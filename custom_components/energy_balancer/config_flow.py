"""Config + options flow for Energy Balancer (modelled on SEM's wizard).

Single config entry. System sensors step -> cells menu (add/edit/remove) -> create.
async_step_import migrates the existing YAML (packages/energy_balancer.yaml) into
a config entry so the running observer setup carries over unchanged.
"""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import callback
from homeassistant.helpers import selector

from .core import normalize_mode
from .params import CELL_ALGO_SPEC
from .detect import detect_battery, detect_charger, find_system_sensors
from .const import (
    CONF_CELLS,
    CONF_CHARGE_PCT_SENSOR,
    CONF_FORECAST_SENSOR,
    CONF_GRID_SENSOR,
    CONF_HOUSE_SENSOR,
    CONF_OBSERVER,
    CONF_PEAK_LIMIT_SENSORS,
    CONF_PEAK_LIMIT_W,
    CONF_SOLAR_SENSOR,
    CONF_UPDATE_INTERVAL,
    DEFAULT_OBSERVER,
    DEFAULT_PEAK_LIMIT_W,
    DEFAULT_UPDATE_INTERVAL,
    DOMAIN,
)

MODES = ["off", "surplus", "balanced", "charge", "discharge", "autonomous"]
TYPES = ["house_battery", "car_charger", "grid"]

# Cell fields that belong under "hardware" / "algo" when reassembling the form.
_HW_KEYS = ("can_charge", "can_discharge", "max_charge_w", "max_discharge_w",
            "capacity_kwh", "min_soc", "max_soc", "power_sensor", "power_sign",
            "soc_sensor", "energy_charged_sensor", "energy_discharged_sensor")
_ACTUATOR_KEYS = ("actuator_service", "actuator_unit", "actuator_voltage", "actuator_phases")
_ALGO_KEYS = ("take_pct", "hysteresis", "charge_floor_w", "sunny_min_soc",
              "no_sun_min_soc", "min_soc_mode", "manual_min_soc",
              "pv_weight", "connected_sensor", "charging_sensor",
              "charge_mode_entity", "set_flag_on_charge", "no_discharge_on_flag")

_MENU_ADD = "➕ Add cell"
_MENU_FINISH = "✓ Finish"


def _power_sel():
    return selector.EntitySelector(
        selector.EntitySelectorConfig(domain="sensor", device_class="power"))


def _num(minv, maxv, step, unit=None, mode="box"):
    cfg = selector.NumberSelectorConfig(min=minv, max=maxv, step=step, mode=mode)
    if unit:
        cfg = selector.NumberSelectorConfig(min=minv, max=maxv, step=step,
                                            unit_of_measurement=unit, mode=mode)
    return selector.NumberSelector(cfg)


def _mark(key, value, *, required: bool = False):
    """Schema key for an entity field: pre-fill via suggested_value (never a
    default of "" — HA's EntitySelector rejects that with a validation error)."""
    cls = vol.Required if required else vol.Optional
    if value in (None, ""):
        return cls(key)
    return cls(key, description={"suggested_value": value})


def _system_schema(data: dict, detected: dict | None = None) -> vol.Schema:
    d = data or {}
    det = detected or {}

    def pre(key, det_key):  # existing value wins, else auto-detected
        return d.get(key) or det.get(det_key)

    return vol.Schema({
        _mark(CONF_SOLAR_SENSOR, pre(CONF_SOLAR_SENSOR, "solar_power"), required=True): _power_sel(),
        _mark(CONF_HOUSE_SENSOR, pre(CONF_HOUSE_SENSOR, "house_power"), required=True): _power_sel(),
        _mark(CONF_GRID_SENSOR, pre(CONF_GRID_SENSOR, "grid_power"), required=True): _power_sel(),
        _mark(CONF_FORECAST_SENSOR, pre(CONF_FORECAST_SENSOR, "forecast")):
            selector.EntitySelector(selector.EntitySelectorConfig(domain="sensor")),
        _mark(CONF_CHARGE_PCT_SENSOR, d.get(CONF_CHARGE_PCT_SENSOR)):
            selector.EntitySelector(selector.EntitySelectorConfig(domain="sensor")),
        # Forecast tiles on the dashboard — display only, the chain steers on
        # forecast_sensor above.
        _mark("forecast_today_sensor", d.get("forecast_today_sensor")):
            selector.EntitySelector(selector.EntitySelectorConfig(domain="sensor")),
        _mark("forecast_tomorrow_sensor", d.get("forecast_tomorrow_sensor")):
            selector.EntitySelector(selector.EntitySelectorConfig(domain="sensor")),
        _mark("forecast_peak_power_sensor", d.get("forecast_peak_power_sensor")):
            selector.EntitySelector(selector.EntitySelectorConfig(domain="sensor")),
        _mark("forecast_peak_time_sensor", d.get("forecast_peak_time_sensor")):
            selector.EntitySelector(selector.EntitySelectorConfig(domain="sensor")),
        vol.Optional(CONF_PEAK_LIMIT_W, default=d.get(CONF_PEAK_LIMIT_W, DEFAULT_PEAK_LIMIT_W)):
            _num(0, 20000, 100, "W"),
        vol.Optional(CONF_PEAK_LIMIT_SENSORS, default=d.get(CONF_PEAK_LIMIT_SENSORS, [])):
            selector.EntitySelector(selector.EntitySelectorConfig(
                domain=["sensor", "input_number"], multiple=True)),
        vol.Optional(CONF_UPDATE_INTERVAL, default=d.get(CONF_UPDATE_INTERVAL, DEFAULT_UPDATE_INTERVAL)):
            _num(5, 60, 1, "s", "slider"),
        vol.Optional(CONF_OBSERVER, default=d.get(CONF_OBSERVER, DEFAULT_OBSERVER)):
            selector.BooleanSelector(),
        # €/kWh — fixed number or an entity id (e.g. a monthly price sensor)
        vol.Optional("import_price_per_kwh",
                     default=str(d.get("import_price_per_kwh", "0"))): selector.TextSelector(),
        vol.Optional("export_price_per_kwh",
                     default=str(d.get("export_price_per_kwh", "0"))): selector.TextSelector(),
    })


def _flatten_cell(cell: dict) -> dict:
    """Nested {hardware, algo} cell -> flat form dict."""
    flat = {
        "position": cell.get("position", 2),
        "mode": normalize_mode(cell.get("mode", "balanced")),
        "type": cell.get("type", "house_battery"),
    }
    flat.update(cell.get("hardware", {}))
    flat.update(cell.get("algo", {}))
    flat.update({f"actuator_{k}": v for k, v in cell.get("actuator", {}).items()})
    return flat


def _cell_schema(flat: dict, *, with_id: bool, cell_id: str = "") -> vol.Schema:
    f = flat or {}
    fields: dict = {}
    if with_id:
        fields[vol.Required("id", default=cell_id)] = selector.TextSelector()
    fields.update({
        vol.Required("position", default=f.get("position", 2)): _num(0, 99, 1),
        # normalize_mode: a stored legacy mode is not in MODES, which would render
        # the select empty and silently reset the cell on save.
        # translation_key: without it HA prints the raw token in the dropdown.
        vol.Required("mode", default=normalize_mode(f.get("mode", "balanced"))):
            selector.SelectSelector(selector.SelectSelectorConfig(
                options=MODES, translation_key="cell_mode")),
        vol.Required("type", default=f.get("type", "house_battery")):
            selector.SelectSelector(selector.SelectSelectorConfig(
                options=TYPES, translation_key="cell_type")),
        vol.Optional("can_charge", default=f.get("can_charge", True)): selector.BooleanSelector(),
        vol.Optional("can_discharge", default=f.get("can_discharge", True)): selector.BooleanSelector(),
        vol.Optional("max_charge_w", default=f.get("max_charge_w", 5000)): _num(0, 25000, 100, "W"),
        vol.Optional("max_discharge_w", default=f.get("max_discharge_w", 5000)): _num(0, 25000, 100, "W"),
        vol.Optional("capacity_kwh", default=f.get("capacity_kwh", 10)): _num(0, 200, 0.01, "kWh"),
        vol.Optional("min_soc", default=f.get("min_soc", 10)): _num(0, 100, 1, "%"),
        vol.Optional("max_soc", default=f.get("max_soc", 95)): _num(0, 100, 1, "%"),
        _mark("power_sensor", f.get("power_sensor"), required=True): _power_sel(),
        vol.Optional("power_sign", default=str(f.get("power_sign", 1))):
            selector.SelectSelector(selector.SelectSelectorConfig(options=["1", "-1"])),
        _mark("soc_sensor", f.get("soc_sensor")):
            selector.EntitySelector(selector.EntitySelectorConfig(domain="sensor", device_class="battery")),
        _mark("energy_charged_sensor", f.get("energy_charged_sensor")):
            selector.EntitySelector(selector.EntitySelectorConfig(domain="sensor", device_class="energy")),
        _mark("energy_discharged_sensor", f.get("energy_discharged_sensor")):
            selector.EntitySelector(selector.EntitySelectorConfig(domain="sensor", device_class="energy")),
        vol.Optional("take_pct", default=str(f.get("take_pct", "100"))): selector.TextSelector(),
        vol.Optional("hysteresis", default=f.get("hysteresis", 3)): _num(0, 50, 1, "%"),
        vol.Optional("charge_floor_w", default=f.get("charge_floor_w", 0)): _num(0, 10000, 50, "W"),
        vol.Optional("sunny_min_soc", default=str(f.get("sunny_min_soc", 25))): selector.TextSelector(),
        vol.Optional("no_sun_min_soc", default=str(f.get("no_sun_min_soc", 40))): selector.TextSelector(),
        vol.Optional("min_soc_mode", default=f.get("min_soc_mode", "balanced")):
            selector.SelectSelector(selector.SelectSelectorConfig(
                options=list(CELL_ALGO_SPEC["min_soc_mode"].choices))),
        vol.Optional("manual_min_soc", default=str(f.get("manual_min_soc", 15))): selector.TextSelector(),
        vol.Optional("pv_weight", default=str(f.get("pv_weight", "0"))): selector.TextSelector(),
        _mark("connected_sensor", f.get("connected_sensor")):
            selector.EntitySelector(selector.EntitySelectorConfig(domain="binary_sensor")),
        _mark("charging_sensor", f.get("charging_sensor")):
            selector.EntitySelector(selector.EntitySelectorConfig(domain="binary_sensor")),
        _mark("charge_mode_entity", f.get("charge_mode_entity")):
            selector.EntitySelector(selector.EntitySelectorConfig(domain="input_select")),
        vol.Optional("set_flag_on_charge", default=f.get("set_flag_on_charge", "")): selector.TextSelector(),
        vol.Optional("no_discharge_on_flag", default=f.get("no_discharge_on_flag", "")): selector.TextSelector(),
        # --- Actuator (how EBI drives this cell). Leave service blank to use the
        #     convention script.eb_actuator_<cell>. ---
        vol.Optional("actuator_service", default=f.get("actuator_service", "")): selector.TextSelector(),
        vol.Optional("actuator_unit", default={"%": "pct"}.get(f.get("actuator_unit", "W"), f.get("actuator_unit", "W"))):
            selector.SelectSelector(selector.SelectSelectorConfig(
                mode=selector.SelectSelectorMode.DROPDOWN,
                options=[
                    selector.SelectOptionDict(value="W", label="Watt (W)"),
                    selector.SelectOptionDict(value="A", label="Ampère (A)"),
                    selector.SelectOptionDict(value="pct", label="Percent (%)"),
                ])),
        vol.Optional("actuator_voltage", default=f.get("actuator_voltage", 230)): _num(100, 400, 1, "V"),
        vol.Optional("actuator_phases", default=str(f.get("actuator_phases", 1))):
            selector.SelectSelector(selector.SelectSelectorConfig(options=["1", "3"])),
    })
    return vol.Schema(fields)


def _form_to_cell(form: dict) -> dict:
    """Flat form dict -> nested {position, mode, type, hardware, algo} cell."""
    hw = {k: form[k] for k in _HW_KEYS if form.get(k) not in (None, "")}
    if "power_sign" in hw:
        hw["power_sign"] = int(hw["power_sign"])
    algo = {k: form[k] for k in _ALGO_KEYS if form.get(k) not in (None, "")}
    # Actuator block: strip the "actuator_" prefix -> {service, unit, voltage, phases}
    actuator = {k[len("actuator_"):]: form[k]
                for k in _ACTUATOR_KEYS if form.get(k) not in (None, "")}
    if "phases" in actuator:
        actuator["phases"] = int(actuator["phases"])
    if "voltage" in actuator:
        actuator["voltage"] = float(actuator["voltage"])
    return {
        "position": int(form.get("position", 2)),
        "mode": normalize_mode(form.get("mode", "balanced")),
        "type": form.get("type", "house_battery"),
        "hardware": hw,
        "algo": algo,
        "actuator": actuator,
    }


def _detect_cell_flat(hass) -> dict:
    """Auto-detect sensors to pre-fill a NEW cell (battery first, else charger)."""
    bat = detect_battery(hass)
    if bat:
        return bat
    chg = detect_charger(hass)
    if chg:
        return {"type": "car_charger", "can_discharge": False, **chg}
    return {}


class EBConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Energy Balancer config flow."""

    VERSION = 3   # v2: cell modes; v3: entity wiring adopted from the package — NAMING.md

    def __init__(self) -> None:
        self._data: dict[str, Any] = {}
        self._cells: dict[str, Any] = {}
        self._edit_id: str | None = None

    @staticmethod
    @callback
    def async_get_options_flow(config_entry):
        return EBOptionsFlow(config_entry)

    # ---- import from YAML (migration) ----
    async def async_step_import(self, import_data: dict) -> Any:
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        return self.async_create_entry(title="Energy Balancer", data=import_data)

    # ---- manual setup ----
    async def async_step_user(self, user_input=None) -> Any:
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        return await self.async_step_system()

    async def async_step_system(self, user_input=None) -> Any:
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_cells()
        detected = await find_system_sensors(self.hass) if not self._data else None
        return self.async_show_form(
            step_id="system", data_schema=_system_schema(self._data, detected))

    async def async_step_cells(self, user_input=None) -> Any:
        if user_input is not None:
            choice = user_input["cell"]
            if choice == _MENU_FINISH:
                self._data[CONF_CELLS] = self._cells
                return self.async_create_entry(title="Energy Balancer", data=self._data)
            if choice == _MENU_ADD:
                self._edit_id = None
                return await self.async_step_cell()
            self._edit_id = choice
            return await self.async_step_cell()

        options = list(self._cells.keys()) + [_MENU_ADD, _MENU_FINISH]
        return self.async_show_form(
            step_id="cells",
            data_schema=vol.Schema({vol.Required("cell", default=_MENU_ADD):
                selector.SelectSelector(selector.SelectSelectorConfig(options=options))}),
            description_placeholders={"count": str(len(self._cells))},
        )

    async def async_step_cell(self, user_input=None) -> Any:
        if user_input is not None:
            cid = user_input.pop("id", None) or self._edit_id
            self._cells[cid] = _form_to_cell(user_input)
            return await self.async_step_cells()
        flat = (_flatten_cell(self._cells[self._edit_id]) if self._edit_id
                else _detect_cell_flat(self.hass))
        return self.async_show_form(
            step_id="cell",
            data_schema=_cell_schema(flat, with_id=self._edit_id is None,
                                     cell_id=self._edit_id or ""),
            description_placeholders={"cell": self._edit_id or "new"},
        )


class EBOptionsFlow(config_entries.OptionsFlow):
    """Edit system sensors + cells after setup."""

    def __init__(self, config_entry) -> None:
        self._entry = config_entry
        merged = {**config_entry.data, **config_entry.options}
        self._data = {k: v for k, v in merged.items() if k != CONF_CELLS}
        self._cells = dict(merged.get(CONF_CELLS, {}))
        self._edit_id: str | None = None

    async def async_step_init(self, user_input=None) -> Any:
        return await self.async_step_system()

    async def async_step_system(self, user_input=None) -> Any:
        if user_input is not None:
            self._data.update(user_input)
            return await self.async_step_cells()
        return self.async_show_form(step_id="system", data_schema=_system_schema(self._data))

    async def async_step_cells(self, user_input=None) -> Any:
        if user_input is not None:
            choice = user_input["cell"]
            if choice == _MENU_FINISH:
                return self.async_create_entry(
                    title="", data={**self._data, CONF_CELLS: self._cells})
            if choice == _MENU_ADD:
                self._edit_id = None
                return await self.async_step_cell()
            if choice.startswith("🗑 "):
                self._cells.pop(choice[2:].strip(), None)
                return await self.async_step_cells()
            self._edit_id = choice
            return await self.async_step_cell()

        options = (list(self._cells.keys())
                   + [f"🗑 {c}" for c in self._cells]
                   + [_MENU_ADD, _MENU_FINISH])
        return self.async_show_form(
            step_id="cells",
            data_schema=vol.Schema({vol.Required("cell", default=_MENU_FINISH):
                selector.SelectSelector(selector.SelectSelectorConfig(options=options))}),
        )

    async def async_step_cell(self, user_input=None) -> Any:
        if user_input is not None:
            cid = user_input.pop("id", None) or self._edit_id
            self._cells[cid] = _form_to_cell(user_input)
            return await self.async_step_cells()
        flat = (_flatten_cell(self._cells[self._edit_id]) if self._edit_id
                else _detect_cell_flat(self.hass))
        return self.async_show_form(
            step_id="cell",
            data_schema=_cell_schema(flat, with_id=self._edit_id is None,
                                     cell_id=self._edit_id or ""))
