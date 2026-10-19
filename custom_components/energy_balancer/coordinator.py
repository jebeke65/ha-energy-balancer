"""Energy Balancer coordinator.

HA-native port of the AppDaemon wrapper (apps/energy_balancer/energy_balancer.py).
Reads sensor values, builds the 6-cell chain, runs the (unchanged) core.compute,
and exposes the result for the sensor platform. Observer only — never actuates.

The orchestration mirrors the AppDaemon `_tick` 1:1:
  * forecast kWh -> Wh, house_includes subtraction, pv_weight normalisation,
    take_pct clamp, peak-limit max, external charge intent, prev_action + tier_pct
    persistence across ticks.
"""

from __future__ import annotations

import logging
import time
from calendar import monthrange
from datetime import datetime, timedelta

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .accounting import STORAGE_KEY, STORAGE_VERSION, EnergyAccounting

from .const import (
    CONF_CELLS,
    CONF_CHARGE_PCT_SENSOR,
    CONF_FORECAST_PEAK_POWER_SENSOR,
    CONF_FORECAST_PEAK_TIME_SENSOR,
    CONF_FORECAST_SENSOR,
    CONF_FORECAST_TODAY_SENSOR,
    CONF_FORECAST_TOMORROW_SENSOR,
    CONF_GRID_SENSOR,
    CONF_HOUSE_INCLUDES,
    CONF_HOUSE_SENSOR,
    CONF_PEAK_LIMIT_SENSORS,
    CONF_PEAK_LIMIT_W,
    CONF_SOLAR_SENSOR,
    CONF_UPDATE_INTERVAL,
    DEFAULT_PEAK_LIMIT_W,
    DEFAULT_UPDATE_INTERVAL,
    ENTITY_PREFIX,
    ENTITY_PREFIXES,
    UNAVAILABLE_STATES,
)
from .actuation import run_actuation
from .intake import from_external
from .core import (CellConfig, CellState, block_budget_w, build_layers,
                   compute, quarter_remaining_s)
from . import car_brain
from .params import clamp_algo, validate_config

_LOGGER = logging.getLogger(__name__)

# The "lifetime" accounting bucket exists for one reason: never-resetting energy
# counters the HA energy dashboard will accept. The accounting snapshot generates
# every field for every period, so without this filter the bucket would also spawn
# lifetime_costs / _savings / _export_revenue / _battery_savings / _net_cost —
# sensors nobody asked for, and confusing next to the existing
# sensor.eb_lifetime_total_savings. Only the four energy counters go out.
_LIFETIME_GEPUBLICEERD = frozenset({
    "lifetime_grid_import_energy", "lifetime_grid_export_energy",
    "lifetime_solar_energy", "lifetime_house_energy",
})


def _publiceer_snapshot_key(key: str) -> bool:
    """False for lifetime_* keys that are not one of the four energy counters.

    lifetime_total_savings is not period-generated and predates this, so it is
    left alone.
    """
    if key == "lifetime_total_savings" or not key.startswith("lifetime_"):
        return True
    return key in _LIFETIME_GEPUBLICEERD


class EBCoordinator(DataUpdateCoordinator):
    """Polls sensors and runs one chain tick per update."""

    def __init__(self, hass: HomeAssistant, config: dict) -> None:
        # Single validation pass: every parameter checked, invalid values
        # replaced by defaults (params.py); raises on missing system sensors.
        config = validate_config(config)
        interval = int(config.get(CONF_UPDATE_INTERVAL, DEFAULT_UPDATE_INTERVAL))
        super().__init__(
            hass,
            _LOGGER,
            name="energy_balancer",
            update_interval=timedelta(seconds=interval),
        )
        self._cfg = config
        self.solar_sensor = config[CONF_SOLAR_SENSOR]
        self.house_sensor = config[CONF_HOUSE_SENSOR]
        self.house_includes = config.get(CONF_HOUSE_INCLUDES, []) or []
        self.grid_sensor = config[CONF_GRID_SENSOR]
        self.forecast_sensor = config.get(CONF_FORECAST_SENSOR)
        self.charge_pct_sensor = config.get(CONF_CHARGE_PCT_SENSOR)
        # Display-only forecast inputs (the chain itself steers on forecast_sensor).
        self.forecast_today_sensor = config.get(CONF_FORECAST_TODAY_SENSOR)
        self.forecast_tomorrow_sensor = config.get(CONF_FORECAST_TOMORROW_SENSOR)
        self.forecast_peak_power_sensor = config.get(CONF_FORECAST_PEAK_POWER_SENSOR)
        self.forecast_peak_time_sensor = config.get(CONF_FORECAST_PEAK_TIME_SENSOR)
        # Daily solar energy display: mirror the inverter day total (overridable).
        self.daily_solar_sensor = config.get("daily_solar_sensor") or "sensor.solar_production_today"
        self.peak_limit_default = float(config.get(CONF_PEAK_LIMIT_W, DEFAULT_PEAK_LIMIT_W))
        self.peak_limit_sensors = config.get(CONF_PEAK_LIMIT_SENSORS, []) or []
        self.peak_max_w = float(config.get("peak_max_w", 0.0) or 0.0)
        # Upper brake: the running 15-minute block. See _block_budget.
        self.block_demand_sensor = config.get("block_demand_sensor") or ""
        # Month rollover: the meter keeps last month's peak for the first quarter
        # of the new month, so the fresh month would inherit it. See
        # _in_month_start_window / _month_start_peak.
        self.month_peak_sensor = config.get("month_peak_sensor") or ""
        self.month_start_peak_policy = config.get("month_start_peak_policy", "previous")
        self.month_start_window_min = int(config.get("month_start_window_min", 30))
        # Same cap, but already biting BEFORE midnight. See _in_month_start_window.
        self.month_end_window_min = int(config.get("month_end_window_min", 0))
        self.import_price_cfg = config.get("import_price_per_kwh", 0.0)
        self.export_price_cfg = config.get("export_price_per_kwh", 0.0)

        # Cost/energy accounting (persisted via Store; loaded in async_setup).
        self.accounting = EnergyAccounting()
        self._acct_store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._acct_saved = 0.0

        # Persisted state across ticks (the hysteresis latch + pool ramp).
        self._prev_actions: dict = {}
        self._tier_pct: dict = {}
        self._cell_states: dict = {}
        # Car-brain memory per cell (buffer / debounce clock / lagging limit).
        # Only ever populated for a cell with use_car_brain on.
        self._car_states: dict = {}
        # Last (take_pct, car_mode) per car cell — see the input-change block
        # in _tick. The app gets a listener for these two; EB polls.
        self._car_inputs: dict = {}
        # Previous value of the flag per cell, so an off→on flip can start the
        # brain clean instead of resuming a stale window (see _tick).
        self._car_brain_on: dict = {}

        # Build steerable cell configs once.
        self.cell_configs: list[CellConfig] = []
        self.cell_io: dict = {}
        for cell_id, cell_cfg in (config.get(CONF_CELLS, {}) or {}).items():
            cfg, io = self._build_cell(cell_id, cell_cfg)
            self.cell_configs.append(cfg)
            self.cell_io[cell_id] = io
        self.cell_configs.sort(key=lambda c: c.position)

    # ------------------------------------------------------------------ build
    @staticmethod
    def _build_cell(cell_id: str, cfg: dict):
        hw = cfg.get("hardware", {}) or {}
        algo = cfg.get("algo", {}) or {}
        config = CellConfig(
            id=cell_id,
            position=int(cfg.get("position", 99)),
            mode=str(cfg.get("mode", "off")),   # CellConfig normalizes legacy modes
            type=str(cfg.get("type", "")),
            can_charge=bool(hw.get("can_charge", True)),
            can_discharge=bool(hw.get("can_discharge", True)),
            max_charge_w=float(hw.get("max_charge_w", 5000)),
            max_discharge_w=float(hw.get("max_discharge_w", 5000)),
            capacity_kwh=float(hw.get("capacity_kwh", 10)),
            min_soc=float(hw.get("min_soc", 10)),
            max_soc=float(hw.get("max_soc", 95)),
            has_soc=bool(hw.get("soc_sensor")),
            set_flag_on_charge=str(algo.get("set_flag_on_charge", "")),
            no_discharge_on_flag=str(algo.get("no_discharge_on_flag", "")),
        )
        io = {
            "power_sensor": hw.get("power_sensor"),
            "power_sign": int(hw.get("power_sign", 1)),
            "soc_sensor": hw.get("soc_sensor"),
            "energy_charged_sensor": hw.get("energy_charged_sensor"),
            "energy_discharged_sensor": hw.get("energy_discharged_sensor"),
            "take_pct": algo.get("take_pct", 100),
            "charge_floor_w": algo.get("charge_floor_w", 0),
            "hysteresis": algo.get("hysteresis", 3),
            "target_soc": algo.get("target_soc"),
            "sunny_min_soc": algo.get("sunny_min_soc", 25),
            "no_sun_min_soc": algo.get("no_sun_min_soc", 40),
            "min_soc_mode": algo.get("min_soc_mode", "balanced"),
            "manual_min_soc": algo.get("manual_min_soc", 15),
            "self_consumption_w": hw.get("self_consumption_w", 0),
            "pv_weight": algo.get("pv_weight", 0),
            "connected_sensor": algo.get("connected_sensor"),
            "charging_sensor": algo.get("charging_sensor"),
            "charge_mode_entity": algo.get("charge_mode_entity"),
            "use_car_brain": algo.get("use_car_brain", False),
            # Only consulted when no charge_mode_entity is configured; that
            # helper, when present, is the single knob.
            "car_mode": algo.get("car_mode", "Automatisch"),
            "start_margin_w": algo.get("start_margin_w", 50),
            "debounce_s": algo.get("debounce_s", 15),
            "solar_debounce_s": algo.get("solar_debounce_s", 300),
            "average_n": algo.get("average_n", 5),
            "limit_step_w": algo.get("limit_step_w", 50),
            "surplus_tier_soc": algo.get("surplus_tier_soc", 80),
        }
        return config, io

    # ------------------------------------------------------------- read helpers
    def _read_float(self, entity, default=0.0):
        if not entity:
            return default
        state = self.hass.states.get(entity)
        if state is None or state.state in UNAVAILABLE_STATES:
            return default
        try:
            return float(state.state)
        except (TypeError, ValueError):
            return default

    def _read_str(self, entity, default=""):
        if not entity:
            return default
        state = self.hass.states.get(entity)
        if state is None or state.state in UNAVAILABLE_STATES:
            return default
        return str(state.state)

    def _charge_intent(self):
        """Read the external charge policy and hand it over already translated.

        The whole point of routing this through `intake` is that the foreign
        dialect stops here: the chain never sees the source's own words, and the
        day this brain is replaced only this method changes.

        Its `mode` attribute is what disambiguates a 0 — without it, "no peak
        room, do not charge" and "let the cells regulate themselves" arrive as
        the same number.
        """
        entity = self.charge_pct_sensor
        if not entity:
            return None
        state = self.hass.states.get(entity)
        if state is None or state.state in UNAVAILABLE_STATES:
            return None
        return from_external(state.attributes.get("mode"), state.state)

    def _is_available(self, entity) -> bool:
        if not entity:
            return True
        state = self.hass.states.get(entity)
        return state is not None and state.state not in UNAVAILABLE_STATES

    def _resolve(self, value, default=0.0):
        """Constant or entity reference -> float (mirrors AppDaemon _resolve)."""
        if value is None:
            return default
        if (isinstance(value, str) and "." in value
                and any(value.startswith(p) for p in ENTITY_PREFIXES)):
            return self._read_float(value, default)
        try:
            return float(value)
        except (TypeError, ValueError):
            return default

    # ------------------------------------------------------------ live options
    # Tunables that take effect next tick without an integration reload.
    LIVE_ALGO_KEYS = ("sunny_min_soc", "no_sun_min_soc", "hysteresis",
                      "charge_floor_w", "take_pct", "pv_weight",
                      "min_soc_mode", "manual_min_soc",
                      # Car brain. use_car_brain is the important one: it is the
                      # way in AND the way back, so it must flip without a
                      # reload. All of these are read from cell_io every tick.
                      "use_car_brain", "start_margin_w", "debounce_s",
                      "solar_debounce_s", "average_n", "car_mode",
                      "surplus_tier_soc")
    LIVE_SYSTEM_KEYS = ("peak_limit_w", "observer_mode",
                        "import_price_per_kwh", "export_price_per_kwh",
                        # Must flip without a reload: the window it governs is
                        # 30 minutes once a month, so waiting for a restart
                        # means waiting a month.
                        "month_start_peak_policy", "month_start_window_min",
                        "month_end_window_min",
                        "month_peak_sensor", "block_demand_sensor",
                        "peak_max_w")

    def apply_live_option(self, key: str, value, cell_id: str | None = None) -> None:
        """Apply a tunable immediately; persistence is handled by the caller."""
        if cell_id is not None:
            if cell_id in self.cell_io:
                self.cell_io[cell_id][key] = value
            return
        if key == "peak_limit_w":
            self.peak_limit_default = float(value)
        elif key == "month_start_peak_policy":
            self.month_start_peak_policy = str(value)
        elif key == "month_start_window_min":
            self.month_start_window_min = int(value)
        elif key == "month_end_window_min":
            self.month_end_window_min = int(value)
        elif key == "month_peak_sensor":
            self.month_peak_sensor = str(value or "")
        elif key == "block_demand_sensor":
            self.block_demand_sensor = str(value or "")
        elif key == "peak_max_w":
            self.peak_max_w = float(value or 0.0)
        elif key == "import_price_per_kwh":
            self.import_price_cfg = value
        elif key == "export_price_per_kwh":
            self.export_price_cfg = value
        elif key == "observer_mode":
            self._cfg["observer_mode"] = bool(value)

    # ---------------------------------------------------------------- storage
    async def async_load_accounting(self) -> None:
        """Restore the cost/energy accumulators (call once at setup)."""
        state = await self._acct_store.async_load()
        if state:
            self.accounting = EnergyAccounting(state)

    # ------------------------------------------------------------------- tick
    async def _async_update_data(self):
        data = await self.hass.async_add_executor_job(self._tick)
        # Translation/actuation layer — separate from the ported algorithm.
        data["actuation"] = await run_actuation(self.hass, self, data)
        # Throttled persist of the cost accumulators (5 min / on rollover).
        now = time.time()
        if self.accounting.dirty and now - self._acct_saved >= 300:
            self._acct_saved = now
            self.accounting.dirty = False
            await self._acct_store.async_save(self.accounting.as_state())
        return data

    def _tick(self):
        solar = self._read_float(self.solar_sensor, 0.0)
        house_raw = self._read_float(self.house_sensor, 0.0)
        grid = self._read_float(self.grid_sensor, 0.0)
        forecast = self._read_float(self.forecast_sensor, 0.0) * 1000.0  # kWh -> Wh

        # Subtract cells whose power is already inside the house sensor.
        house = house_raw
        for cfg in self.cell_configs:
            if cfg.id in self.house_includes:
                io = self.cell_io[cfg.id]
                p = self._read_float(io.get("power_sensor"), 0.0) * io.get("power_sign", 1)
                if p > 0:
                    house -= p

        cells = [
            (CellConfig(id="solar", position=0, mode="supply", type="solar"),
             CellState(measured_w=solar)),
            (CellConfig(id="house", position=1, mode="demand", type="house"),
             CellState(measured_w=house)),
        ]

        source_sensors = {
            "solar": self.solar_sensor,
            "house": self.house_sensor,
            "net": self.grid_sensor,
        }

        for cfg in self.cell_configs:
            io = self.cell_io[cfg.id]
            power = self._read_float(io.get("power_sensor"), 0.0) * io.get("power_sign", 1)
            soc = self._read_float(io.get("soc_sensor"), 50.0)
            online = True
            for sensor in (io.get("power_sensor"), io.get("soc_sensor")):
                if sensor and not self._is_available(sensor):
                    online = False

            # Prefer the native number.eb_<cell>_take slider when present.
            native_take = f"number.{ENTITY_PREFIX}_{cfg.id}_take"
            if self.hass.states.get(native_take) is not None:
                take = self._read_float(native_take, 100)
            else:
                take = self._resolve(io.get("take_pct"), 100)
            cfg.take_pct = max(0, min(100, take))
            cfg.charge_floor_w = clamp_algo(
                "charge_floor_w", self._resolve(io.get("charge_floor_w"), 0))
            cfg.hysteresis = clamp_algo(
                "hysteresis", self._resolve(io.get("hysteresis"), 3))
            cfg.sunny_min_soc = clamp_algo(
                "sunny_min_soc", self._resolve(io.get("sunny_min_soc"), 25))
            cfg.no_sun_min_soc = clamp_algo(
                "no_sun_min_soc", self._resolve(io.get("no_sun_min_soc"), 40))
            mode = str(io.get("min_soc_mode", "balanced")).strip().lower()
            cfg.min_soc_mode = mode if mode in ("balanced", "manual") else "balanced"
            cfg.manual_min_soc = clamp_algo(
                "manual_min_soc", self._resolve(io.get("manual_min_soc"), 15))
            cfg.self_consumption_w = self._resolve(io.get("self_consumption_w"), 0)
            pv = self._resolve(io.get("pv_weight"), 0)
            pv = pv / 100.0 if pv > 1 else pv
            cfg.pv_weight = max(0.0, min(1.0, pv))
            t = io.get("target_soc")
            cfg.target_soc = (clamp_algo("target_soc", self._resolve(t))
                              if t is not None else None)

            # --- Car brain (off unless explicitly enabled on this cell) ------
            # Read from cell_io every tick, so energy_balancer.set_option can
            # flip it (and the tunables) without a reload. That matters both
            # ways: it is how the brain is switched on and how it is switched
            # back off if it misbehaves.
            was_on = self._car_brain_on.get(cfg.id, False)
            cfg.use_car_brain = bool(io.get("use_car_brain", False))
            if cfg.use_car_brain and not was_on:
                # Off→on: throw the old memory away and start like the app does
                # on boot — empty buffer, no "last above start", limit 0. A
                # half-full window from an earlier session describes a different
                # afternoon; averaging today's surplus with it would produce a
                # number neither side ever saw. Pinned by the wiring check.
                self._car_states.pop(cfg.id, None)
                self._car_inputs.pop(cfg.id, None)
            self._car_brain_on[cfg.id] = cfg.use_car_brain
            if cfg.use_car_brain:
                cfg.start_margin_w = clamp_algo(
                    "start_margin_w", self._resolve(io.get("start_margin_w"), 50))
                cfg.debounce_s = int(clamp_algo(
                    "debounce_s", self._resolve(io.get("debounce_s"), 15)))
                cfg.solar_debounce_s = int(clamp_algo(
                    "solar_debounce_s", self._resolve(io.get("solar_debounce_s"), 300)))
                cfg.average_n = int(clamp_algo(
                    "average_n", self._resolve(io.get("average_n"), 5)))
                cfg.limit_step_w = clamp_algo(
                    "limit_step_w", self._resolve(io.get("limit_step_w"), 50))
                cfg.surplus_tier_soc = clamp_algo(
                    "surplus_tier_soc", self._resolve(io.get("surplus_tier_soc"), 80))
                # The raw mode string — None when the entity is missing or
                # unavailable, because the app's two reads of it differ in
                # their fallback (see car_brain._set_limit_if_needed).
                # With a helper configured that helper IS the knob (the select
                # entity is only a window on it); without one, the cell's own
                # car_mode option is used and select.eb_<cell>_mode writes there.
                mode_ent = io.get("charge_mode_entity")
                cfg.car_mode = car_brain.resolve_mode(
                    self._read_str(mode_ent, "") if mode_ent
                    else io.get("car_mode"))

                # A deliberate change of the ratio or the mode must act at
                # once. The app subscribes to both helpers; EB polls, so the
                # change is noticed here and handed to the brain's state.
                # See car_brain.apply_input_change for why the debounce clock
                # is reset as well (the app leaves it running, which costs up
                # to solar_debounce_s before a lowered ratio does anything).
                # Deliberately NOT in core/car_brain: the parity harness drives
                # core.compute() directly, so the port stays exactly the app.
                car_inputs = (cfg.take_pct, cfg.car_mode)
                car_state = self._car_states.get(cfg.id)
                if (cfg.id in self._car_inputs
                        and car_inputs != self._car_inputs[cfg.id]
                        and car_state is not None):
                    car_brain.apply_input_change(car_state)
                self._car_inputs[cfg.id] = car_inputs

            st = CellState(
                soc=soc, measured_w=power, online=online,
                prev_action=self._prev_actions.get(cfg.id, "idle"),
                car_state=self._car_states.get(cfg.id),
                now_ts=time.time(),
            )
            cells.append((cfg, st))
            self._cell_states[cfg.id] = st
            source_sensors[cfg.id] = io.get("power_sensor", "")

        # --- The one place the ceiling is decided -------------------------
        # Two inputs, one rule:
        #   start reference — peak_limit_w, the number in EB's own config. It is
        #     what you WANT the month to cost and it never moves on its own.
        #   running reference — the measured monthly peak. Once a month is
        #     spoiled, staying under the start reference buys nothing, so the
        #     measurement may raise the ceiling. That is the max().
        #   your own max — a knob that only ever raises. Its lower bound moves
        #     with max(peak, start), so it cannot be set under what already
        #     happened; that would mean nothing, since a spent quarter cannot be
        #     unspent.
        # Everything else in the house should read the published result
        # (sensor.eb_target_peak_limit) rather than recompute this.
        in_window = self._in_month_start_window()
        running_peak = 0.0
        for s in self.peak_limit_sensors:
            v = self._read_float(s, 0.0)
            if in_window and s and s == self.month_peak_sensor:
                v = self._month_start_peak(v)
            if v > running_peak:
                running_peak = v
        peak_limit = max(self.peak_limit_default, running_peak, self.peak_max_w)

        cells.append(
            (CellConfig(id="net", position=99, mode="grid", type="grid",
                        peak_limit_w=peak_limit),
             CellState(measured_w=grid))
        )

        result = compute(cells, forecast_wh=forecast, grid_w=grid,
                         tier_pct=self._tier_pct, intent=self._charge_intent(),
                         block_budget_w=self._block_budget(peak_limit, grid, cells))

        # Persist the latched prev_action per steerable cell.
        for cfg in self.cell_configs:
            st = self._cell_states.get(cfg.id)
            if st is not None:
                self._prev_actions[cfg.id] = st.prev_action
                if st.car_state is not None:
                    self._car_states[cfg.id] = st.car_state

        layers = build_layers(cells, result.outputs, result.details)

        # Energy counters summed per layer (read here so the entity stays pure).
        for layer in layers:
            ec = ed = 0.0
            has_ec = has_ed = False
            for cid in layer["members"]:
                io = self.cell_io.get(cid, {})
                if io.get("energy_charged_sensor"):
                    ec += self._read_float(io["energy_charged_sensor"], 0.0)
                    has_ec = True
                if io.get("energy_discharged_sensor"):
                    ed += self._read_float(io["energy_discharged_sensor"], 0.0)
                    has_ed = True
            layer["energy_charged_kwh"] = round(ec, 3) if has_ec else None
            layer["energy_discharged_kwh"] = round(ed, 3) if has_ed else None

        cell_type = {cfg.id: (cfg.type or cfg.mode) for cfg, _ in cells}
        compat = self._build_compat(result.details, layers)

        # ----- cost/energy accounting (Δ kWh × price-at-this-moment) -----
        import_price = max(0.0, min(5.0, self._resolve(self.import_price_cfg, 0.0)))
        export_price = max(0.0, min(5.0, self._resolve(self.export_price_cfg, 0.0)))
        batt_discharge_w = max(0.0, -float(compat.get("battery_power") or 0.0))
        now = datetime.now()
        self.accounting.tick(now, time.time(), grid, solar,
                             batt_discharge_w, import_price, export_price,
                             house_w=house)
        self._track_quarter_peak(now, grid)

        return {
            "outputs": result.outputs,
            "details": result.details,
            "grid_predicted_w": result.grid_predicted_w,
            "source_sensors": source_sensors,
            "cell_type": cell_type,
            "layers": layers,
            "compat": compat,
            "extras": self._build_extras(solar, house, grid, peak_limit,
                                         import_price, export_price, forecast),
            "timestamp": now.isoformat(timespec="seconds"),
        }

    def peak_max_floor(self) -> float:
        """Lower bound for the user's max knob: max(monthly peak, start ref).

        Setting the knob under what already happened would mean nothing — a spent
        quarter cannot be unspent — so the entity refuses to go there.
        """
        measured = 0.0
        for s in self.peak_limit_sensors:
            v = self._read_float(s, 0.0)
            if v > measured:
                measured = v
        return max(self.peak_limit_default, measured)

    # ------------------------------------------------------- block budget
    def _block_budget(self, ceiling_w: float, grid_w: float, cells) -> float | None:
        """Upper brake: what the tier may still draw this quarter (W).

        None when no block sensor is configured — then the base value is left
        alone and the external brain's own peak limit is the only guard.

        `other_load_w` is everything on the meter that is NOT this tier, so the
        tier gets what is left of the block after the house has been served. Its
        own draw is taken from the measurement rather than the setpoint: measuring
        is knowing, and a device that ignores its setpoint must not also get a budget
        computed as if it had obeyed.
        """
        if not self.block_demand_sensor:
            return None
        block_w = self._read_float(self.block_demand_sensor, 0.0)
        now = datetime.now()
        remaining = quarter_remaining_s(now.minute, now.second)
        tier_w = sum(
            float(st.measured_w)
            for cfg, st in cells
            if cfg.type == "house_battery" and st is not None
        )
        return block_budget_w(ceiling_w, block_w, remaining,
                             max(0.0, grid_w) - max(0.0, tier_w))

    # --------------------------------------------------- month rollover
    def _in_month_start_window(self, now: datetime | None = None) -> bool:
        """True around the month rollover — on either side of midnight.

        Both windows apply the same cap (see _month_start_peak):

        * after — the first month_start_window_min minutes of the 1st. The meter
          holds the previous month's peak for a while past midnight (measured on
          the P1, 2026-08-31: 15,2 minutes), so a stale ceiling there licenses EB
          to re-establish the old peak in the very first block of the new month.
        * before — the last month_end_window_min minutes of the last day of the
          month. A tier already pulling 3 kW at 23:59 is still pulling it at
          00:01, and that block is what sets the new month's peak; the brake has
          to be biting before the boundary rather than racing to catch it. It
          also makes the whole mechanism testable without waiting a month.

        Either window at 0 switches that side off; no month_peak_sensor switches
        the whole thing off.
        """
        if not self.month_peak_sensor:
            return False
        now = now or datetime.now()
        minute_of_day = now.hour * 60 + now.minute
        if (self.month_start_window_min > 0 and now.day == 1
                and minute_of_day < self.month_start_window_min):
            return True
        last_day = monthrange(now.year, now.month)[1]
        if (self.month_end_window_min > 0 and now.day == last_day
                and (1440 - minute_of_day) <= self.month_end_window_min):
            return True
        return False

    def _month_start_peak(self, measured: float) -> float:
        """What the (stale) monthly-peak reading counts as inside the window."""
        if self.month_start_peak_policy == "zero":
            return 0.0
        if self.month_start_peak_policy == "configured":
            return min(measured, self.peak_limit_default)
        return measured                      # "previous" — behaviour as it was

    # ------------------------------------------------------- 15-min peak
    def _track_quarter_peak(self, now: datetime, grid_w: float) -> None:
        """Average grid import per quarter hour (capacity-tariff metric)."""
        quarter = (now.hour, now.minute // 15)
        state = getattr(self, "_quarter", None)
        if state is None or state["q"] != quarter:
            if state is not None and state["n"] > 0:
                self.accounting.note_quarter_peak(state["sum"] / state["n"])
            self._quarter = state = {"q": quarter, "sum": 0.0, "n": 0}
        state["sum"] += max(0.0, grid_w)
        state["n"] += 1

    def quarter_peak_now(self) -> float:
        state = getattr(self, "_quarter", None)
        if not state or state["n"] == 0:
            return 0.0
        return state["sum"] / state["n"]

    # ----------------------------------------------------------- extras
    def _build_extras(self, solar: float, house: float, grid: float,
                      peak_limit: float, import_price: float,
                      export_price: float, forecast_wh: float = 0.0) -> dict:
        """Suffix -> value/attrs for the SEM-shaped detail cards.
        Only values EB genuinely has — nothing is faked."""
        steerable = [c for c in self.cell_configs if c.mode != "off"]
        charging = []
        shed_w = 0.0
        devices_attr = []
        for cfg in steerable:
            st = self._cell_states.get(cfg.id)
            p = float(st.measured_w) if st else 0.0
            if p > 50:
                charging.append(cfg.id)
                shed_w += p
            devices_attr.append({
                "id": cfg.id, "type": cfg.type, "power_w": round(p),
                "take_pct": cfg.take_pct,
            })

        grid_import = max(0.0, grid)
        grid_export = max(0.0, -grid)
        surplus_total = max(0.0, solar - house)
        quarter_avg = self.quarter_peak_now()

        acct = self.accounting.snapshot()
        watched = [self.solar_sensor, self.house_sensor, self.grid_sensor] + [
            io.get("power_sensor") for io in self.cell_io.values()]
        unavailable = sum(1 for s in watched if s and not self._is_available(s))

        # Which forecast provider is behind the configured entities. Derived rather
        # than configured — one less thing to keep in sync by hand.
        _fc_entities = " ".join(str(e or "") for e in (
            self.forecast_sensor, self.forecast_today_sensor,
            self.forecast_tomorrow_sensor, self.forecast_peak_power_sensor))
        if "solcast" in _fc_entities:
            forecast_source = "solcast"
        elif "forecast_solar" in _fc_entities:
            forecast_source = "forecast.solar"
        elif _fc_entities.strip():
            forecast_source = "custom"
        else:
            forecast_source = "none"

        return {
            # tariff
            "tariff_current_import_rate": {
                "value": round(import_price, 4),
                "attrs": {"is_dynamic": isinstance(self.import_price_cfg, str),
                          "source": str(self.import_price_cfg)},
            },
            "tariff_current_export_rate": {
                "value": round(export_price, 4),
                "attrs": {"is_dynamic": isinstance(self.export_price_cfg, str),
                          "source": str(self.export_price_cfg)},
            },
            # forecast (display only — the dashboard's forecast section read these
            # and found nothing, so every tile rendered 0)
            "forecast_remaining_today_kwh": {
                "value": round(self._read_float(self.forecast_sensor, 0.0), 2),
                "attrs": {"source_entity": self.forecast_sensor or ""},
            },
            "forecast_corrected_today": {
                "value": round(self._read_float(self.forecast_today_sensor, 0.0), 2),
                "attrs": {"source_entity": self.forecast_today_sensor or ""},
            },
            "forecast_tomorrow_kwh": {
                "value": round(self._read_float(self.forecast_tomorrow_sensor, 0.0), 2),
                "attrs": {"source_entity": self.forecast_tomorrow_sensor or ""},
            },
            "forecast_peak_power_today_w": {
                "value": round(self._read_float(self.forecast_peak_power_sensor, 0.0)),
                "attrs": {"source_entity": self.forecast_peak_power_sensor or ""},
            },
            "forecast_peak_time_today": {
                "value": self._read_str(self.forecast_peak_time_sensor, ""),
            },
            "forecast_source": {"value": forecast_source},
            # peak / load management
            "target_peak_limit": {"value": round(peak_limit)},
            "current_vs_peak_percentage": {
                "value": round(grid_import / peak_limit * 100.0, 1) if peak_limit else 0},
            "consecutive_peak_15min": {"value": round(quarter_avg)},
            "monthly_consecutive_peak": {"value": acct["monthly_consecutive_peak"]},
            "load_management_status": {
                "value": "reducing" if grid_import > 0.9 * peak_limit else "ok"},
            "available_load_reduction": {"value": round(shed_w)},
            "controllable_devices_count": {
                "value": len(steerable), "attrs": {"devices": devices_attr}},
            # surplus
            "surplus_total_w": {"value": round(surplus_total)},
            "surplus_allocated_w": {"value": round(shed_w)},
            "surplus_unallocated_w": {"value": round(grid_export)},
            "surplus_active_devices": {"value": len(charging)},
            "surplus_total_devices": {"value": len(steerable)},
            # grid
            "grid_status": {
                "value": ("importing" if grid > 50
                          else "exporting" if grid < -50 else "idle")},
            "daily_grid_import_energy": {"value": acct["daily_grid_import_energy"]},
            "daily_grid_export_energy": {"value": acct["daily_grid_export_energy"]},
            # Daily solar energy mirrors the inverter's own day total (display only);
            # EB's own integration could only count from boot. Home comes later.
            "daily_solar_energy": {"value": round(
                self._read_float(self.daily_solar_sensor, 0.0), 2)},
            "monthly_grid_import_energy": {"value": acct["monthly_grid_import_energy"]},
            "monthly_grid_export_energy": {"value": acct["monthly_grid_export_energy"]},
            # Never-resetting counters, published as total_increasing — the only
            # shape the energy dashboard accepts. The daily/monthly/yearly ones
            # above reset without a last_reset and are for EB's own cards.
            "lifetime_grid_import_energy": {"value": acct["lifetime_grid_import_energy"]},
            "lifetime_grid_export_energy": {"value": acct["lifetime_grid_export_energy"]},
            "lifetime_solar_energy": {"value": acct["lifetime_solar_energy"]},
            "lifetime_house_energy": {"value": acct["lifetime_house_energy"]},
            # solar forecast (from the configured forecast_sensor;
            # semantics: remaining kWh expected today)
            "forecast_today_kwh": {
                "value": round(forecast_wh / 1000.0, 2),
                "attrs": {"source": str(self.forecast_sensor),
                          "semantics": "remaining_today"},
            },
            # diagnostics
            "diag_grid_sign": {"value": "+import"},
            "diag_battery_capacity": {
                "value": round(sum(c.capacity_kwh for c in self.cell_configs
                                   if c.has_soc), 2)},
            "diag_update_interval": {
                "value": int(self.update_interval.total_seconds())},
            "diag_charger_count": {
                "value": sum(1 for c in self.cell_configs if c.type == "car_charger")},
            "diag_sensors_unavailable": {"value": unavailable},
            # costs (flat accounting snapshot)
            **{k: {"value": v} for k, v in acct.items()
               if k != "monthly_consecutive_peak" and _publiceer_snapshot_key(k)},
        }

    def _build_compat(self, details: dict, layers: list) -> dict:
        """SEM-shaped compatibility values, fed to the ported SEM cards.

        Uses MEASURED power (not the EB prediction) and EB's internal battery
        sign (+ = charge, − = discharge) — exactly what the SEM system-diagram
        expects (battery>0 charging, grid split into import/export).
        """
        def m(cid):
            return float(details.get(cid, {}).get("measured_w", 0.0) or 0.0)

        solar = m("solar")
        home = m("house")
        grid = m("net")
        ev = sum(m(c.id) for c in self.cell_configs if c.type == "car_charger")
        batt = sum(m(c.id) for c in self.cell_configs if c.has_soc)

        batt_soc = None
        for layer in layers:
            if layer.get("has_soc"):
                batt_soc = layer.get("soc")
                break

        grid_import = max(0.0, grid)
        grid_export = max(0.0, -grid)
        load = home + max(0.0, ev) + max(0.0, batt)
        autarky = max(0.0, min(100.0, (load - grid_import) / load * 100.0)) if load > 0 else 0.0
        self_cons = max(0.0, min(100.0, (solar - grid_export) / solar * 100.0)) if solar > 0 else 0.0
        status = "charging" if batt > 50 else "discharging" if batt < -50 else "idle"

        return {
            "solar_power": round(solar),
            "home_consumption_power": round(home),
            "grid_power": round(grid),
            "grid_import_power": round(grid_import),
            "grid_export_power": round(grid_export),
            "ev_power": round(ev),
            "battery_power": round(batt),
            "battery_soc": round(batt_soc, 1) if batt_soc is not None else None,
            "battery_status": status,
            "autarky_rate": round(autarky, 1),
            "self_consumption_rate": round(self_cons, 1),
        }
