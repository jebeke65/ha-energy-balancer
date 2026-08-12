"""Energy Balancer — chain model.

Six cells in a chain: solar → house → car → battery → battery → net.
All six have the same interface: same inputs, same outputs.

Downstream pass (N-1 → N): rest (W), forecast (Wh)
Upstream pass (N+1 → N): headroom (W), current_power (W)

Each cell sees only its direct neighbours. No global state.

Modes (structural — set in code, not configurable):
  supply         — fixed supply (solar): adds measured_w to rest
  demand         — fixed demand (house): subtracts measured_w from rest
  grid           — absorbs remainder (net): has max import (peak)

Modes (configurable — chosen by the user):
  off            — pass through (still measured)
  surplus        — charge from surplus, discharge on deficit
  balanced       — charge/discharge based on dynamic target + hysteresis

See NAMING.md. The system layer carries no vendor words: `surplus` was named
`self_consumption` after a vendor work mode, and `smart` said nothing about what
it does. Stored configs still hold the old names — normalize_mode() translates
them on the way in, so both spellings load.

Sign convention:
  rest: + = surplus, − = deficit
  power: + = charge (takes from chain), − = discharge (gives to chain)
  grid: + = import, − = export
"""

from dataclasses import dataclass
from typing import Optional

try:
    from .battery_algorithm import calculate_min_soc  # package context (HA)
    from .intake import WANT_CHARGE, WANT_NO_CHARGE
except ImportError:
    from battery_algorithm import calculate_min_soc   # flat context (tests)
    from intake import WANT_CHARGE, WANT_NO_CHARGE


# ---------------------------------------------------------------------------
# Mode vocabulary — legacy spellings map onto the current ones
# ---------------------------------------------------------------------------

MODE_ALIASES = {
    "self_consumption": "surplus",
    "smart": "balanced",
}


def normalize_mode(mode: str) -> str:
    """Translate a stored mode onto the current vocabulary.

    Called from CellConfig.__post_init__, so a legacy mode cannot enter the chain
    by any route — including callers that build a CellConfig directly.
    """
    return MODE_ALIASES.get(mode, mode)


def adopt_wiring(conf: dict, seed: dict) -> dict:
    """Take the entity wiring from the YAML package, leave the tuning alone.

    A config entry holds two kinds of value: *wiring* (which entity feeds what) and
    *tuning* (numbers the user drags on a dashboard). Wiring lives in the package
    file and is version-controlled; tuning belongs to whoever turned the knob.

    So: system keys the entry does not have yet are copied in, and each cell's
    `take_pct` reference is re-adopted from the seed. Numbers already in the entry
    are never touched — a slider the user moved must survive an upgrade.

    Pure and idempotent; running it twice changes nothing.
    """
    conf = dict(conf or {})
    seed = seed or {}

    for key, value in seed.items():
        if key == "cells":
            continue
        conf.setdefault(key, value)

    seed_cells = seed.get("cells") or {}
    cells = conf.get("cells")
    if not cells:
        return conf

    migrated = {}
    for cell_id, cell in cells.items():
        cell = dict(cell)
        seed_take = ((seed_cells.get(cell_id) or {}).get("algo") or {}).get("take_pct")
        if seed_take is not None:
            algo = dict(cell.get("algo") or {})
            algo["take_pct"] = seed_take
            cell["algo"] = algo
        migrated[cell_id] = cell
    return {**conf, "cells": migrated}


def migrate_cell_modes(conf: dict) -> dict:
    """Rewrite the modes in a stored config onto the current vocabulary.

    Used by async_migrate_entry. Pure and idempotent: running it on an already
    migrated config is a no-op, and anything that is not a cell mode is copied
    through untouched.
    """
    cells = (conf or {}).get("cells")
    if not cells:
        return dict(conf or {})

    migrated = {}
    for cell_id, cell in cells.items():
        cell = dict(cell)
        if "mode" in cell:
            cell["mode"] = normalize_mode(str(cell["mode"]))
        migrated[cell_id] = cell
    return {**conf, "cells": migrated}


# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class CellConfig:
    """Static / slow-changing configuration."""
    id: str
    position: int
    mode: str = "off"       # supply | demand | grid | off | surplus | balanced
    type: str = ""          # semantic device type: solar|house|car_charger|house_battery|grid

    can_charge: bool = True
    can_discharge: bool = True
    max_charge_w: float = 5000.0
    max_discharge_w: float = 5000.0
    capacity_kwh: float = 10.0
    min_soc: float = 10.0
    max_soc: float = 95.0

    has_soc: bool = False
    set_flag_on_charge: str = ""      # flag to add when charging
    no_discharge_on_flag: str = ""    # don't discharge if this flag is set
    take_pct: float = 100.0
    charge_floor_w: float = 0.0
    hysteresis: float = 3.0
    target_soc: Optional[float] = None
    peak_limit_w: Optional[float] = None  # only for grid cell
    self_consumption_w: float = 0.0       # cell's own power draw

    # Balanced mode target calculation inputs
    sunny_min_soc: float = 25.0       # target SoC at full sun
    no_sun_min_soc: float = 40.0      # target SoC without sun
    hours_until_solar: float = 0.0
    base_consumption_w: float = 800.0  # predicted house consumption (W)
    pv_weight: float = 0.0            # solar confidence 0-1

    # Floor mode. "balanced" = run the algorithm (with its safeguards);
    # "manual" = use manual_min_soc verbatim, deliberately bypassing the
    # floor clamp so the user can park the pool lower than the algorithm would.
    min_soc_mode: str = "balanced"
    manual_min_soc: float = 15.0

    def __post_init__(self):
        # Normalize here rather than at the call site: a legacy mode can then not
        # enter the chain by any route, including callers that build a CellConfig
        # directly. An unrecognised mode falls through to "idle" without a word.
        self.mode = normalize_mode(self.mode)


@dataclass
class CellState:
    """Runtime state read from sensors + internal memory."""
    soc: float = 50.0
    measured_w: float = 0.0
    online: bool = True
    prev_action: str = "idle"


@dataclass
class Downstream:
    rest_w: float
    forecast_wh: float
    flags: set = None

    def __post_init__(self):
        if self.flags is None:
            self.flags = set()


@dataclass
class Upstream:
    headroom_w: float
    current_power_w: float


@dataclass
class CellOutput:
    action: str          # consume | produce | idle | autonomous | off | offline
                         #   + import/export for the grid cell (see NAMING.md)
    power_w: float       # + = charge, − = discharge
    reason: str = ""


@dataclass
class ChainResult:
    outputs: dict            # cell_id → CellOutput
    grid_predicted_w: float
    details: dict            # cell_id → debug info


# ---------------------------------------------------------------------------
# SoC taper — reduce power near SoC limits
# ---------------------------------------------------------------------------

def _calculate_target(cfg: CellConfig, forecast_wh: float) -> float:
    """Calculate dynamic target SoC using the proven battery_algorithm.

    In "manual" floor mode the user's slider wins outright: the algorithm —
    and with it the floor clamp that keeps the target from going low — is
    skipped entirely. That is the point of the mode; the per-cell `min_soc`
    (the inverter's DoD) is still the hard limit further down the chain.
    """
    if cfg.min_soc_mode == "manual":
        return cfg.manual_min_soc

    m = calculate_min_soc(
        weight=cfg.pv_weight,
        i_sunny_min=cfg.sunny_min_soc,
        i_no_sun_min=cfg.no_sun_min_soc,
        i_hours_until_solar=cfg.hours_until_solar,
        i_base_consumption_w=cfg.base_consumption_w,
        i_car_charging_w=0,  # car is a separate cell in the chain
        i_pv_remaining=forecast_wh / 1000.0,
    )
    return m["min_soc"]


def _claim_forecast(take: float, rest: float, forecast: float) -> float:
    """When a cell takes energy from surplus, it claims the same fraction of forecast."""
    if rest <= 0 or forecast <= 0:
        return forecast
    frac = min(1.0, take / rest)
    return forecast * (1.0 - frac)


def _charge_taper(soc: float, max_soc: float) -> float:
    if soc >= max_soc:
        return 0.0
    if soc > max_soc - 5:
        return (max_soc - soc) / 5.0
    return 1.0


def _discharge_taper(soc: float, min_soc: float) -> float:
    if soc <= min_soc:
        return 0.0
    if soc < min_soc + 5:
        return (soc - min_soc) / 5.0
    return 1.0


# ---------------------------------------------------------------------------
# Cell processing — one cell, one tick
# ---------------------------------------------------------------------------

def process_cell(cfg: CellConfig, st: CellState,
                 fw: Downstream, bw: Upstream) -> tuple:
    """Process one cell. Returns (CellOutput, rest_out, flags_out, forecast_out, new_prev_action)."""

    rest = fw.rest_w - cfg.self_consumption_w  # cell's own draw
    flags = set(fw.flags)  # copy so we don't mutate
    forecast = fw.forecast_wh

    # --- Offline ---
    if not st.online:
        return (CellOutput("offline", 0.0, "sensor unavailable"),
                rest, flags, forecast, st.prev_action)

    # --- Fixed supply (solar) ---
    if cfg.mode == "supply":
        new_rest = rest + st.measured_w
        return (CellOutput("produce", st.measured_w, f"supply {st.measured_w:.0f}W"),
                new_rest, flags, forecast, "idle")

    # --- Fixed demand (house) ---
    if cfg.mode == "demand":
        new_rest = rest - st.measured_w
        return (CellOutput("consume", st.measured_w, f"demand {st.measured_w:.0f}W"),
                new_rest, flags, forecast, "idle")

    # --- Grid (absorbs remainder) — use measured (P1) for action ---
    if cfg.mode == "grid":
        grid_w = st.measured_w  # P1 measured: positive = import, negative = export
        action = "import" if grid_w > 50 else "export" if grid_w < -50 else "idle"
        return (CellOutput(action, grid_w, f"grid {grid_w:.0f}W"),
                0.0, flags, forecast, "idle")

    # --- Mode off — not controlled, but measured power still affects rest ---
    if cfg.mode == "off":
        new_rest = rest - st.measured_w
        return (CellOutput("off", st.measured_w,
                f"off (measured {st.measured_w:.0f}W)"),
                new_rest, flags, forecast, "idle")

    # --- Slider 0 = blocked ---
    if cfg.take_pct <= 0:
        return (CellOutput("idle", 0.0, "take 0% — blocked"),
                rest, flags, forecast, "idle")

    # --- Determine desired action ---
    desired = _desired_action(cfg, st, rest, forecast)

    # --- Headroom cap: max take so rest_out >= -headroom ---
    max_take_headroom = max(0.0, rest + bw.headroom_w)

    # --- Above target in balanced mode — pass through, the cell self-manages ---
    if desired == "autonomous":
        # Use measured_w for rest propagation — meten is weten
        measured = st.measured_w
        rest_out = rest - measured

        if measured > 50 and cfg.can_charge:
            if cfg.set_flag_on_charge:
                flags.add(cfg.set_flag_on_charge)
            sc_fc = _claim_forecast(abs(measured), rest, forecast)
            return (CellOutput("autonomous", measured,
                    f"autonomous charge {measured:.0f}W (SoC {st.soc:.0f}%)"),
                    rest_out, flags, sc_fc, "autonomous")
        elif measured < -50 and cfg.can_discharge:
            if cfg.no_discharge_on_flag and cfg.no_discharge_on_flag in flags:
                return (CellOutput("autonomous", 0.0,
                        f"{cfg.no_discharge_on_flag} upstream — no discharge (SoC {st.soc:.0f}%)"),
                        rest, flags, forecast, "autonomous")
            return (CellOutput("autonomous", measured,
                    f"autonomous discharge {abs(measured):.0f}W (SoC {st.soc:.0f}%)"),
                    rest_out, flags, forecast, "autonomous")
        else:
            return (CellOutput("autonomous", 0.0,
                    f"autonomous idle (SoC {st.soc:.0f}%)"),
                    rest_out, flags, forecast, "autonomous")

    # --- Execute charge ---
    if desired == "consume" and cfg.can_charge:
        taper = _charge_taper(st.soc, cfg.max_soc)
        if taper <= 0:
            return (CellOutput("idle", 0.0, f"full (SoC {st.soc:.0f}%)"),
                    rest, flags, forecast, "idle")

        max_hw = cfg.max_charge_w * taper

        if cfg.mode == "charge":
            # Forced: take the surplus out of the equation. Charging from the grid
            # is the whole point of this mode. max_take_headroom still caps it —
            # a forced mode may not push the monthly peak up.
            take = min(max_hw * cfg.take_pct / 100.0, max_take_headroom)
        elif cfg.mode == "balanced":
            target = cfg.target_soc if cfg.target_soc is not None else _calculate_target(cfg, forecast)
            urgency = min(1.0, max(0.2, (target - st.soc) / 20.0))
            want = max_hw * urgency
            take = min(want, max_take_headroom, max_hw)
        else:
            if st.measured_w > 50:
                take = min(st.measured_w, max_take_headroom)
            elif rest <= 0:
                return (CellOutput("idle", 0.0, "no surplus"),
                        rest, flags, forecast, "idle")
            else:
                share = rest * cfg.take_pct / 100.0
                if cfg.charge_floor_w > 0 and share < cfg.charge_floor_w:
                    return (CellOutput("idle", 0.0,
                            f"surplus {share:.0f}W < floor {cfg.charge_floor_w:.0f}W"),
                            rest, flags, forecast, "idle")
                take = min(share, max_hw, max_take_headroom)

        take = max(0.0, take)
        if take <= 0:
            # No headroom → autonomous (a forced 0% charge setpoint is dangerous)
            return (CellOutput("autonomous", 0.0,
                    f"no headroom (rest_in={rest:.0f}, headroom={bw.headroom_w:.0f})"),
                    rest, flags, forecast, "autonomous")
        if cfg.set_flag_on_charge:
            flags.add(cfg.set_flag_on_charge)

        # Meten is weten. `take` is what we ASK the cell to draw; `measured` is what
        # it actually draws. The chain has to pass on reality, not the request:
        # a car charger with no car attached was handed 3.4 kW of surplus, reported
        # rest_out = 0, and the batteries below it saw nothing left to charge from —
        # so the whole surplus went out onto the grid (2026-07-14). Whatever the cell
        # does not take flows down to the next one.
        #
        # Deliberately no connected/charging sensor here: the chain does not need to
        # know what kind of device this is, only what it consumes.
        measured = st.measured_w
        rest_out = rest - measured
        new_fc = _claim_forecast(max(0.0, measured), rest, forecast)
        reason = (f"charge {take:.0f}W (measured {measured:.0f}W, "
                  f"rest_in={rest:.0f}, headroom={bw.headroom_w:.0f})")
        return (CellOutput("consume", take, reason),
                rest_out, flags, new_fc, "consume")

    # --- Execute discharge ---
    if desired == "produce" and cfg.can_discharge:
        forced = cfg.mode == "discharge"

        # A forced discharge feeds the house (and, if it exceeds demand, the grid);
        # not needing it is exactly what the user overrode.
        if rest >= 0 and not forced:
            return (CellOutput("autonomous", 0.0, "surplus, no discharge needed"),
                    rest, flags, forecast, "autonomous")

        # Won't discharge if configured flag is set upstream. This guard holds even
        # when forced: it is a safety interlock (don't empty the battery into the
        # car), not a preference the mode may overrule.
        if cfg.no_discharge_on_flag and cfg.no_discharge_on_flag in flags:
            return (CellOutput("idle", 0.0, f"{cfg.no_discharge_on_flag} upstream — no discharge"),
                    rest, flags, forecast, "idle")

        taper = _discharge_taper(st.soc, cfg.min_soc)
        if taper <= 0:
            return (CellOutput("idle", 0.0, f"empty (SoC {st.soc:.0f}%)"),
                    rest, flags, forecast, "idle")

        max_hw = cfg.max_discharge_w * taper
        if forced:
            give = max_hw * cfg.take_pct / 100.0
            reason = f"forced discharge {give:.0f}W (SoC {st.soc:.0f}%)"
        else:
            deficit = abs(rest)
            give = min(deficit, max_hw)
            reason = f"discharge {give:.0f}W (deficit={deficit:.0f})"
        return (CellOutput("produce", -give, reason),
                rest + give, flags, forecast, "produce")

    # --- Idle — still account for actual measured power ---
    meas = st.measured_w
    if meas > 0:
        meas = min(meas, max_take_headroom)
    new_rest = rest - meas
    return (CellOutput("idle", meas,
            f"idle (measured {meas:.0f}W)"),
            new_rest, flags, forecast, "idle")


def _desired_action(cfg: CellConfig, st: CellState, rest: float,
                    forecast: float = 0.0) -> str:
    if cfg.mode == "balanced":
        target = cfg.target_soc if cfg.target_soc is not None else _calculate_target(cfg, forecast)
        cfg.target_soc = target  # store for detail output
        hys = cfg.hysteresis
        if st.soc < target - hys:
            return "consume"
        elif st.soc >= target:
            return "autonomous"
        else:
            return st.prev_action if st.prev_action in ("consume", "autonomous") else "autonomous"

    if cfg.mode == "surplus":
        # Measured reality overrides prediction
        if st.measured_w > 50:
            return "consume"
        elif st.measured_w < -50:
            return "produce"
        elif rest > 0 and st.soc < cfg.max_soc:
            return "consume"
        elif rest < 0 and st.soc > cfg.min_soc:
            return "produce"
        # Default: autonomous (gates open, let PD controller decide)
        # Only truly idle when slider=0, offline, or SoC limits hit
        return "autonomous"

    # --- Forced modes — the user overrides the chain ---
    # They charge/discharge regardless of surplus, so grid charging is the point.
    # The headroom cap in process_cell still applies: a forced mode may not blow
    # through the monthly peak. Capability wins over the mode: a car charger that
    # cannot discharge stays idle rather than silently doing nothing.
    if cfg.mode == "charge":
        return "consume" if cfg.can_charge else "idle"

    if cfg.mode == "discharge":
        return "produce" if cfg.can_discharge else "idle"

    # EB never steers this cell — the device regulates itself, either direction.
    if cfg.mode == "autonomous":
        return "autonomous"

    return "idle"


# ---------------------------------------------------------------------------
# Upstream pass — headroom propagation
# ---------------------------------------------------------------------------

def upstream_pass(cells: list) -> dict:
    """Propagate headroom + current_power upstream through chain.

    Starts from the last cell (grid). Grid cell's peak_limit_w is the
    initial headroom. Each cell adds its discharge buffer.
    """
    headroom = 0.0
    current_power = 0.0
    result = {}

    for cfg, st in reversed(cells):
        if cfg.mode == "grid":
            if cfg.peak_limit_w is not None:
                headroom = cfg.peak_limit_w
            current_power = st.measured_w  # P1 grid measured

        result[cfg.id] = Upstream(
            headroom_w=headroom,
            current_power_w=current_power,
        )

        # Headroom passes through unchanged — no buffer from downstream cells

        # Each cell adds its own power to current_power for predecessor
        if cfg.mode not in ("supply", "demand", "grid"):
            current_power += st.measured_w

    return result


# ---------------------------------------------------------------------------
# Tier processing — multiple cells sharing one position (pool)
# ---------------------------------------------------------------------------

def _cell_target(cfg: CellConfig, forecast: float):
    """Resolve a cell's charge target SoC (smart → dynamic), else None."""
    if cfg.target_soc is not None:
        return cfg.target_soc
    if cfg.mode == "balanced":
        t = _calculate_target(cfg, forecast)
        cfg.target_soc = t  # store for detail output (same as process_cell)
        return t
    return None


def _latch_state(cfg: CellConfig, st: CellState, target) -> str:
    """Target-band hysteresis latch (ported from BatteryOptimisation).

    charge   when soc < target − hys   (and stays charging until soc ≥ target + hys)
    discharge when soc > target + hys   (and stays discharging until soc ≤ target − hys)
    in the band → hold the previous direction (the latch).

    Returns "charge" | "discharge" | "hold".
    """
    if target is None:
        return "charge" if st.soc < cfg.max_soc else "hold"
    hys = cfg.hysteresis
    if st.soc < target - hys:
        return "charge"
    if st.soc > target + hys:
        return "discharge"
    # Inside the band: keep the previous direction (the hysteresis latch).
    p = st.prev_action
    if p in ("charge", "consume"):
        return "charge"
    if p in ("discharge", "produce"):
        return "discharge"
    return "hold"


def _state_to_prev(state: str, st: CellState) -> str:
    """Map a latch state to the prev_action token to persist (keeps the latch)."""
    if state == "charge":
        return "consume"
    if state == "discharge":
        return "produce"
    return st.prev_action  # hold → unchanged, so the latch direction survives


def reactive_charge_ramp(prev_pct, grid_w, threshold_w,
                         up_step=5, up_export_step=10, down_step=10):
    """Reactive charge ramp on measured grid — BatteryOptimisation flow.

    Ramps the pool charge % to keep the measured grid just under threshold_w:
      grid > threshold        → halve (fast peak protection)
      grid > 98% threshold     → step down
      grid < 0 (export)        → step up faster (surplus available)
      grid < 95% threshold     → step up slowly
      else                     → hold (95-98% band)

    threshold_w = peak ceiling when grid-charging below target; 0 for pure
    surplus-soak (then it only ramps up while exporting → steady-state grid≈0,
    never imports). Returns the new charge % (0–100).
    """
    p = int(prev_pct)
    if grid_w > threshold_w:
        p = p // 2
    elif grid_w > threshold_w * 0.98:
        p = p - down_step
    elif grid_w < 0:
        p = p + up_export_step
    elif grid_w < threshold_w * 0.95:
        p = p + up_step
    return max(0, min(100, p))


def grid_follow_ramp(prev_pct, grid_w, deadband=50, step=5, fast_step=10):
    """Signed grid-follow controller — explicit cover instead of handing over.

    Drives the grid toward 0, free in BOTH directions on ONE signed accumulator
    (+ = charge / − = discharge): exporting → charge the surplus; importing →
    discharge to cover the house. This is what a cell does autonomously, now
    explicit so the pool can be split. Settles within ±deadband of 0 (a few-tick
    transient accepted). Returns the new signed % (−100…100).
    """
    p = float(prev_pct)
    if grid_w > deadband:                      # importing → discharge more
        p -= fast_step if grid_w > 4 * deadband else step
    elif grid_w < -deadband:                   # exporting → charge more
        p += fast_step if grid_w < -4 * deadband else step
    return max(-100.0, min(100.0, p))


def _distribute(total: float, weight: dict, cap: dict) -> tuple:
    """Spread `total` W across cells ∝ weight, clamped to per-cell cap.

    Water-fills: each pass allocates proportionally, clamps cells that hit
    their cap, then redistributes the residual among the rest. Returns
    (alloc dict, leftover) where leftover > 0 only if Σcap < total.
    """
    alloc = {k: 0.0 for k in cap}
    remaining = max(0.0, total)
    while remaining > 1e-6:
        active = {k for k in cap
                  if cap[k] - alloc[k] > 1e-6 and weight.get(k, 0.0) > 0.0}
        if not active:
            break
        wsum = sum(weight[k] for k in active)
        if wsum <= 0:
            break
        progressed = False
        for k in active:
            share = remaining * weight[k] / wsum
            give = min(share, cap[k] - alloc[k])
            if give > 0:
                alloc[k] += give
                progressed = True
        remaining = total - sum(alloc.values())
        if not progressed:
            break
    return alloc, max(0.0, remaining)


def _pool_controller(members, fw, headroom, grid_w, tier_state, flags, forecast,
                     intent=None):
    """BatteryOptimisation flow on a battery pool — ONE signed accumulator.

    The pool acts as one battery (capacity-weighted SoC/target, summed caps).
    A single signed charge % (`tier_state[pos]`, + = charge / − = discharge) is
    ramped on the MEASURED grid; the resulting pool power is split across the
    cells. This replaces handing the pool over above target with an explicit
    discharge setpoint, so the pool can be split over both batteries.

    Returns (outputs, rest_out, flags, forecast, prev) for the active members.
    """
    outputs, prev = {}, {}
    pos = members[0][0].position
    hys = members[0][0].hysteresis

    cap_sum = sum(c.capacity_kwh for c, _ in members) or 1.0
    pool_soc = sum(st.soc * c.capacity_kwh for c, st in members) / cap_sum
    targets = {c.id: _cell_target(c, forecast) for c, _ in members}
    pool_target = sum((targets[c.id] or 0.0) * c.capacity_kwh
                      for c, _ in members) / cap_sum

    charge_cap = {c.id: c.max_charge_w * (c.take_pct / 100.0)
                  * _charge_taper(st.soc, c.max_soc) for c, st in members}
    # Discharge floor = min_soc (the device's own depth-of-discharge limit).
    dis_cap = {c.id: c.max_discharge_w * (c.take_pct / 100.0)
               * _discharge_taper(st.soc, c.min_soc) for c, st in members}
    pool_max_charge = sum(charge_cap.values())
    pool_max_dis = sum(dis_cap.values())

    pct = float(tier_state.get(pos, 0.0))      # signed: + charge, − discharge

    # --- Charge latch (BatteryOptimisation): below target → grid-charge to peak;
    #     above target → release (explicit grid-follow). Held in the band. ---
    active_key = "active_%d" % pos
    charge_active = bool(tier_state.get(active_key, False))
    if pool_soc < pool_target - hys:
        charge_active = True
    elif pool_soc > pool_target + hys:
        charge_active = False

    # --- Peak emergency: grid over the ceiling → instant discharge (hard) ---
    release = False
    why = ""                       # only read on the release path below
    if grid_w > headroom and pool_max_dis > 0:
        charge_active = False
        dis = min(pool_max_dis, grid_w)               # cover the over-import now
        pct = -100.0 * dis / pool_max_dis
    elif intent is not None:
        # An external charge policy owns the decision, and the target band plays
        # no part in it. The band lives in the external brain, which already runs
        # it and hands down the verdict; re-deciding it here made EB veto a charge
        # the brain had asked for. Seen 2026-08-10: the brain said charge, the
        # pool sat 3 points above target, and EB released — the batteries stayed
        # flat while the house drew from the grid.
        #
        # The intent arrives already translated into EB's own vocabulary by
        # `intake.from_external`; no foreign token reaches this function.
        # `charge_active` is still tracked for the no-brain path below, but it is
        # no longer a gate here. That also defuses the peak branch clearing the
        # latch: one grid peak used to switch charging off for hours.
        if intent.want == WANT_CHARGE:
            charge_active = True
            pct = max(0.0, min(100.0, float(intent.pct)))
            release = pct <= 0
            why = f"no setpoint (charge 0 from {intent.source})"
        else:
            # WANT_NO_CHARGE and WANT_RELEASE both stop grid-charging, and today
            # both come out here as a release. They are kept apart on purpose:
            # `no_charge` means "do not pull from the grid" while the batteries
            # keep covering the house, and once the tier gains its own discharge
            # path that is where the two must diverge. Collapsing them now would
            # bury the distinction the intake layer exists to preserve.
            charge_active = False
            pct = 0.0
            release = True
            why = ("no grid charging" if intent.want == WANT_NO_CHARGE
                   else "handed to the cells")
            why = f"{why} ({intent.source})"
    elif charge_active:
        # No external policy: EB falls back on its own band and ramps on the
        # measured grid, up to the ceiling. `intent is None` means nobody is
        # telling us what to do, which is not the same as being told to do
        # nothing.
        pct = float(reactive_charge_ramp(max(0, int(pct)), grid_w, headroom))
        release = pct <= 0
        why = "no setpoint (own ramp at 0)"
    else:
        release = True
        why = f"SoC {pool_soc:.0f}% > target {pool_target:.0f}%"

    if release:
        # Released → EB stops steering and each cell regulates itself against its
        # own meter. Smooth, with no explicit grid-follow pump around grid=0: the
        # reserve is met, and surplus soak plus peak cover ride on the devices'
        # own fast regulation. EB takes explicit control back as soon as the pool
        # drops below target again (charge_active flips True).
        tier_state[pos] = 0.0
        tier_state[active_key] = charge_active
        rest_out = fw.rest_w
        for c, st in members:
            # Use measured_w for rest propagation — meten is weten. EB plans
            # nothing here, but the cells keep drawing power autonomously, so
            # the rest handed to the next cell has to account for it.
            measured = st.measured_w
            rest_out -= measured
            outputs[c.id] = CellOutput("autonomous", measured,
                f"release: autonomous ({why})")
            prev[c.id] = "autonomous"
        return (outputs, rest_out, flags, forecast, prev)
    tier_state[pos] = pct
    tier_state[active_key] = charge_active

    # --- Convert to pool power + split across the cells ---
    if pct >= 0:                                       # charge
        pool_w = pct / 100.0 * pool_max_charge
        # Split by room left, not by distance below target. The old key weighed
        # (target + hysteresis - SoC) x capacity, which is a band test per cell:
        # a cell above its own target scored zero and was parked on "pool hold"
        # even while the pool as a whole was charging. On 2026-08-10 that put the
        # full 2500 W on the marstek (5.12 kWh, 15%) and nothing on the goodwe
        # (15 kWh, 19%), which had by far the most room. Deciding whether to
        # charge is the band's job and lives elsewhere; this only divides.
        # No hysteresis here: a share that drifts from 74/26 to 73/27 is not a
        # decision that can chatter, it is simply the right ratio.
        weight = {c.id: max(0.0, c.max_soc - st.soc) * c.capacity_kwh
                  for c, st in members}
        if sum(weight.values()) <= 0:
            weight = dict(charge_cap)
        alloc, _ = _distribute(min(pool_w, pool_max_charge), weight, charge_cap)
        taken = sum(alloc.values())
        for c, st in members:
            x = alloc.get(c.id, 0.0)
            if x > 1e-6:
                if c.set_flag_on_charge:
                    flags.add(c.set_flag_on_charge)
                outputs[c.id] = CellOutput("consume", x,
                    f"pool charge {x:.0f}W (pct={pct:.0f}, grid={grid_w:.0f})")
                prev[c.id] = "consume"
            else:
                outputs[c.id] = CellOutput("idle", 0.0,
                    f"pool hold (SoC {st.soc:.0f}%, pct={pct:.0f})")
                prev[c.id] = "idle"
        return (outputs, fw.rest_w - taken, flags,
                _claim_forecast(taken, fw.rest_w, forecast), prev)

    # discharge
    pool_w = -pct / 100.0 * pool_max_dis
    weight = {c.id: max(0.0, st.soc - c.min_soc) * c.capacity_kwh
              for c, st in members}
    if sum(weight.values()) <= 0:
        weight = dict(dis_cap)
    alloc, _ = _distribute(min(pool_w, pool_max_dis), weight, dis_cap)
    given = sum(alloc.values())
    for c, st in members:
        x = alloc.get(c.id, 0.0)
        if x > 1e-6:
            outputs[c.id] = CellOutput("produce", -x,
                f"pool discharge {x:.0f}W (pct={pct:.0f}, grid={grid_w:.0f})")
            prev[c.id] = "produce"
        else:
            outputs[c.id] = CellOutput("idle", 0.0,
                f"pool hold (SoC {st.soc:.0f}%, pct={pct:.0f})")
            prev[c.id] = "idle"
    return outputs, fw.rest_w + given, flags, forecast, prev


def process_tier(group: list, fw: Downstream, bw_data: dict,
                 grid_w: float = 0.0, tier_pct: dict = None,
                 intent=None) -> tuple:
    """Process >1 cells sharing a position as one tier (parallel pool).

    Target-band hysteresis latch per cell (BatteryOptimisation behaviour):
      charge   when soc < target − delta, latched up to target + delta;
      discharge when soc > target + delta, latched down to target − delta;
      hold inside the band (keep previous direction).

    The chain's surplus/deficit is split across the *participating* members:
      • surplus (rest > 0) → only cells whose latch is "charge" actively charge,
        weighted by take_pct·(target+delta − soc)·capacity. Any leftover surplus
        is then soaked by free room (room→max_soc) so nothing exports while a
        cell still has room.
      • deficit (rest < 0) → only cells whose latch is "discharge" discharge,
        weighted by take_pct·(soc − floor)·capacity with floor = max(min_soc,
        target − delta). A charge/hold cell is NEVER forced to discharge below
        its floor — the target always holds. The deficit it doesn't cover is
        imported from grid.

    Cells are driven explicitly every tick (charge / discharge / hold) —
    never handed over to the device's own regulation. Returns
    (outputs, rest_out, flags_out, forecast_out, prev); outputs and prev are
    dicts keyed by cell id.
    """
    rest = fw.rest_w
    flags = set(fw.flags)
    forecast = fw.forecast_wh
    outputs = {}
    prev = {}

    # Offline / slider-0 members drop out (they don't contend).
    members = []
    for cfg, st in group:
        if not st.online:
            outputs[cfg.id] = CellOutput("offline", 0.0, "sensor unavailable")
            prev[cfg.id] = st.prev_action
        elif cfg.take_pct <= 0:
            outputs[cfg.id] = CellOutput("idle", 0.0, "take 0% — blocked")
            prev[cfg.id] = "idle"
        else:
            members.append((cfg, st))

    if not members:
        return outputs, rest, flags, forecast, prev

    # Per-cell target + latch state (the hysteresis band).
    targets, states = {}, {}
    for cfg, st in members:
        tgt = _cell_target(cfg, forecast)
        targets[cfg.id] = tgt
        states[cfg.id] = _latch_state(cfg, st, tgt)

    headroom = bw_data[members[0][0].id].headroom_w  # peak import ceiling (W)

    # ---- Live path: BatteryOptimisation pool controller (signed grid ramp) ----
    if tier_pct is not None:
        p_out, rest_out, flags, fc, p_prev = _pool_controller(
            members, fw, headroom, grid_w, tier_pct, flags, forecast,
            intent=intent)
        outputs.update(p_out)
        prev.update(p_prev)
        return outputs, rest_out, flags, fc, prev

    # ---- Feed-forward fallback (unit tests / no live grid) ----
    # ---- Step 1: discharge-latch cells cover the deficit (down to band floor) ----
    # Floor = target − delta (never below min_soc). A charge/hold cell is never
    # forced to discharge — the target always holds; uncovered deficit → grid.
    given = 0.0
    if rest < 0:
        deficit = -rest
        avail, weight = {}, {}
        for cfg, st in members:
            tgt = targets[cfg.id]
            floor = max(cfg.min_soc, (tgt - cfg.hysteresis) if tgt is not None
                        else cfg.min_soc)
            blocked = bool(cfg.no_discharge_on_flag and cfg.no_discharge_on_flag in flags)
            cap = (cfg.max_discharge_w * (cfg.take_pct / 100.0)
                   * _discharge_taper(st.soc, floor))
            if (cfg.can_discharge and not blocked
                    and states[cfg.id] == "discharge" and cap > 0):
                avail[cfg.id] = cap
                weight[cfg.id] = max(0.0, st.soc - floor) * cfg.capacity_kwh
            else:
                avail[cfg.id] = 0.0
                weight[cfg.id] = 0.0
        total = min(deficit, sum(avail.values()))
        alloc, _ = _distribute(total, weight, avail)
        given = sum(alloc.values())
        for cfg, st in members:
            x = alloc.get(cfg.id, 0.0)
            if x > 1e-6:
                outputs[cfg.id] = CellOutput("produce", -x,
                    f"tier discharge {x:.0f}W (deficit={deficit:.0f})")
                prev[cfg.id] = "produce"
        rest += given  # remaining deficit after batteries above target chipped in

    # ---- Step 2: charge ----
    # Per-cell tapered charge cap + weight (prefer cells below their band;
    # fall back to room so an above-target pool still absorbs surplus).
    avail, weight = {}, {}
    any_below = False
    for cfg, st in members:
        cap = (cfg.max_charge_w * (cfg.take_pct / 100.0)
               * _charge_taper(st.soc, cfg.max_soc))
        avail[cfg.id] = max(0.0, cap) if cfg.can_charge else 0.0
        tgt = targets[cfg.id]
        below = tgt is not None and st.soc < tgt - cfg.hysteresis
        any_below = any_below or below
        if cfg.can_charge and avail[cfg.id] > 0:
            top = (tgt + cfg.hysteresis) if tgt is not None else cfg.max_soc
            weight[cfg.id] = max(0.0, top - st.soc) * cfg.capacity_kwh
        else:
            weight[cfg.id] = 0.0
    if sum(weight.values()) <= 0:           # all at/above band → absorb by room
        weight = dict(avail)
    pool_max = sum(avail.values())

    # Feed-forward budget (the live grid-ramp path returned earlier).
    budget = (max(0.0, headroom + rest) if any_below
              else max(0.0, rest))          # below target: grid-charge to peak
    alloc, _ = _distribute(min(budget, pool_max), weight, avail)
    # Soak any remaining real surplus by free room (avoid export).
    surplus_left = max(0.0, rest - sum(alloc.values()))
    if surplus_left > 1e-6:
        room = {k: max(0.0, avail[k] - alloc.get(k, 0.0)) for k in avail}
        extra, _ = _distribute(surplus_left, room, room)
        for k in extra:
            alloc[k] = alloc.get(k, 0.0) + extra[k]
    taken = sum(alloc.values())

    for cfg, st in members:
        x = alloc.get(cfg.id, 0.0)
        if x > 1e-6:
            if cfg.set_flag_on_charge:
                flags.add(cfg.set_flag_on_charge)
            outputs[cfg.id] = CellOutput("consume", x,
                f"tier charge {x:.0f}W (grid={grid_w:.0f})")
            prev[cfg.id] = "consume"
    rest -= taken

    # ---- Step 3: anyone without an action → hold (keep the latch direction) ----
    for cfg, st in members:
        if cfg.id not in outputs:
            outputs[cfg.id] = CellOutput("idle", 0.0,
                f"tier: hold (SoC {st.soc:.0f}%, {states[cfg.id]})")
            prev[cfg.id] = _state_to_prev(states[cfg.id], st)

    return outputs, rest, flags, _claim_forecast(taken, fw.rest_w, forecast), prev


# Who is steering the cell — the other axis of a cell output. `action` says what
# is happening, `control` says who decided it. See NAMING.md §2: the old enum
# mashed both into one, which is how "self_consumption" ended up sitting next to
# "idle" as if they were the same kind of word.
_CONTROL_BY_ACTION = {
    "consume": "eb",            # EB commands a setpoint
    "produce": "eb",
    "idle": "eb",               # EB commands zero — not the same as letting go
    "autonomous": "cell",       # EB let go; the device regulates itself
    "off": "none",              # not steered
    "offline": "unreachable",   # cannot be steered
}


STRUCTURAL_MODES = ("supply", "demand", "grid")


def control_of(action: str, mode: str = "") -> str:
    """Who is steering this cell.

    The mode has to come into it. Solar emits the action `produce` and the house
    emits `consume` — both of which mean "EB commanded it" on a steerable cell, but
    those two are never commanded at all: they are measured. Deriving control from
    the action alone put them under `eb`, and the chain card then printed a take-%
    limit next to a cell nobody was limiting.
    """
    if mode in STRUCTURAL_MODES:
        return "none"                       # observed, never commanded
    return _CONTROL_BY_ACTION.get(action, "none")


def _detail(cfg, st, rest_in, rest_out, bw, out, fc_in, fc_out) -> dict:
    """Build the per-cell debug detail (shared by single-cell and tier paths)."""
    return {
        "rest_in_w": round(rest_in, 1),
        "rest_out_w": round(rest_out, 1),
        "headroom_w": round(bw.headroom_w, 1),
        "successor_power_w": round(bw.current_power_w, 1),
        "action": out.action,
        "control": control_of(out.action, cfg.mode),
        "mode": cfg.mode,
        "power_w": round(out.power_w, 1),
        "measured_w": round(st.measured_w, 1),
        "soc": round(st.soc, 1) if cfg.has_soc else None,
        "target_soc": round(cfg.target_soc, 1) if cfg.target_soc is not None else None,
        "forecast_in_wh": round(fc_in, 1),
        "forecast_out_wh": round(fc_out, 1),
        "take_pct": cfg.take_pct,
    }


# ---------------------------------------------------------------------------
# Main compute — one tick
# ---------------------------------------------------------------------------

def compute(cells: list, forecast_wh: float = 0.0,
            grid_w: float = 0.0, tier_pct: dict = None,
            intent=None) -> ChainResult:
    """Run one tick of the energy balancer.

    cells: list of (CellConfig, CellState) tuples — all 6 cells.
    Returns ChainResult with per-cell outputs and grid prediction.
    """
    ordered = sorted(cells, key=lambda cs: cs[0].position)

    # Upstream pass
    bw_data = upstream_pass(ordered)

    # Group cells that share a position (consecutive after sort).
    groups = []
    i = 0
    while i < len(ordered):
        j = i + 1
        while j < len(ordered) and ordered[j][0].position == ordered[i][0].position:
            j += 1
        groups.append(ordered[i:j])
        i = j

    # Downstream pass — rest starts at 0, solar adds, house subtracts, etc.
    rest = 0.0
    flags = set()
    forecast = forecast_wh
    outputs = {}
    details = {}

    for group in groups:
        # A tier = >1 contending battery cells on the same position. Single
        # cells and additive same-position cells (supply/demand) stay on the
        # original sequential path → identical behaviour.
        is_tier = len(group) > 1 and all(
            cfg.mode in ("surplus", "balanced") for cfg, _ in group)

        if not is_tier:
            for cfg, st in group:
                bw = bw_data[cfg.id]
                out, new_rest, new_flags, new_forecast, new_prev = process_cell(
                    cfg, st, Downstream(rest, forecast, flags), bw)
                outputs[cfg.id] = out
                details[cfg.id] = _detail(
                    cfg, st, rest, new_rest, bw, out, forecast, new_forecast)
                rest = new_rest
                flags = new_flags
                forecast = new_forecast
                st.prev_action = new_prev
        else:
            t_out, new_rest, new_flags, new_forecast, t_prev = process_tier(
                group, Downstream(rest, forecast, flags), bw_data,
                grid_w=grid_w, tier_pct=tier_pct, intent=intent)
            for cfg, st in group:
                out = t_out[cfg.id]
                bw = bw_data[cfg.id]
                outputs[cfg.id] = out
                d = _detail(cfg, st, rest, new_rest, bw, out, forecast, new_forecast)
                d["tier"] = True
                details[cfg.id] = d
                st.prev_action = t_prev[cfg.id]
            rest = new_rest
            flags = new_flags
            forecast = new_forecast

    # Grid predicted = what the grid cell absorbed
    grid_cell = [cfg for cfg, _ in ordered if cfg.mode == "grid"]
    grid_predicted = outputs[grid_cell[0].id].power_w if grid_cell else -rest

    return ChainResult(
        outputs=outputs,
        grid_predicted_w=round(grid_predicted, 1),
        details=details,
    )


# ---------------------------------------------------------------------------
# Layer aggregation — one virtual block per priority layer (pure, testable)
# ---------------------------------------------------------------------------

def build_layers(cells: list, outputs: dict, details: dict) -> list:
    """Aggregate cells into one block per priority layer.

    A layer = cells sharing the same (position, type) — only same-priority
    AND same-type cells pool. State = net power_w.
    Storage layers (cells with SoC) add capacity-weighted SoC, energy, target
    and hardware headroom. Pure: no I/O — the wrapper adds energy counters +
    timestamp + set_state on top.

    Block id: a pooled storage layer gets the STABLE id "home_battery"
    (member-independent, so adding a battery to the pool never renames the
    layer entities); any further pooled storage layer gets a position suffix.
    All other layers keep the member ids joined (single-member layers = the
    cell id, already stable).

    Returns a list of layer dicts, ordered by (position, type).
    """
    groups = {}
    for cfg, st in cells:
        key = (cfg.position, cfg.type or cfg.mode)
        groups.setdefault(key, []).append((cfg, st))

    layers = []
    home_battery_used = False
    for (position, ctype) in sorted(groups):
        members = groups[(position, ctype)]
        is_storage_pool = (len(members) > 1
                           and any(c.has_soc for c, _ in members))
        if is_storage_pool and not home_battery_used:
            lid = "home_battery"
            home_battery_used = True
        elif is_storage_pool:
            lid = f"home_battery_p{position}"
        else:
            lid = "_".join(c.id for c, _ in members)

        pwr = 0.0
        member_ids, per = [], {}
        soc_w = tgt_w = soc_cap = 0.0
        charge_avail = discharge_avail = 0.0
        has_soc = False
        per_soc = {}

        for cfg, st in members:
            d = details.get(cfg.id, {})
            pw = st.measured_w          # MEASURED power (never the EB prediction)
            pwr += pw
            member_ids.append(cfg.id)
            per[f"power_{cfg.id}"] = round(pw, 1)
            if cfg.has_soc:
                has_soc = True
                soc_w += st.soc * cfg.capacity_kwh
                tgt_w += (d.get("target_soc") or 0.0) * cfg.capacity_kwh
                soc_cap += cfg.capacity_kwh
                charge_avail += cfg.max_charge_w * _charge_taper(st.soc, cfg.max_soc)
                discharge_avail += cfg.max_discharge_w * _discharge_taper(st.soc, cfg.min_soc)
                per_soc[f"soc_{cfg.id}"] = round(st.soc, 1)

        # Action from the EB-internal sign (+ = charge) — unambiguous.
        action = ("charging" if pwr > 50
                  else "discharging" if pwr < -50 else "idle")

        # Storage layers are published in the conventional battery sign
        # (+ = discharge, − = charge) so the virtual battery matches HA battery
        # sensors / power-flow cards. The EB-internal convention (+ = charge) is
        # kept everywhere else (core, actuators, per-cell eb_<id> shadows).
        if has_soc:
            disp_pwr = -pwr
            per = {k: -v for k, v in per.items()}
        else:
            disp_pwr = pwr

        layer = {
            "id": lid, "position": position, "kind": ctype,
            "power_w": round(disp_pwr, 1), "members": member_ids,
            "has_soc": has_soc, **per,
        }
        if has_soc:
            cap = soc_cap or 1.0
            soc_comb = soc_w / cap
            layer.update({
                "soc": round(soc_comb, 1),
                "capacity_kwh": round(soc_cap, 2),
                "energy_stored_kwh": round(soc_comb / 100.0 * soc_cap, 2),
                "target_soc": round(tgt_w / cap, 1),
                "charge_avail_w": round(charge_avail),
                "discharge_avail_w": round(discharge_avail),
                "action": action,
                **per_soc,
            })
        layers.append(layer)
    return layers
