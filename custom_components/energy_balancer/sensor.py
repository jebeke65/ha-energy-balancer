"""Energy Balancer sensor platform.

Publishes one sensor.eb_<cell>_cell per chain cell, a sensor.eb_<cell>_performance
per steerable cell, a status sensor, and one block per priority layer
(power / SoC / target / energy). Entity ids follow naming.py.
"""

from __future__ import annotations

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.const import PERCENTAGE, UnitOfEnergy, UnitOfPower
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, ENTITY_PREFIX
from .devices import cell_device, costs_device, layer_device, system_device
from .naming import EXTRA_IDS, cell_prefix, entity_id, slug


# Cells EB never steers: their output is copied straight from the meter.
_VIRTUAL_CELL_TYPES = ("solar", "house", "grid")

# Actions where EB actually orders a power. On idle/autonomous/off/offline EB is
# not steering, so there is nothing for the cell to be right or wrong about.
_COMMANDED_ACTIONS = ("consume", "produce")

# Below this the ratio stops meaning anything: dividing by a near-zero setpoint
# turns a few watts of measurement noise into hundreds of percent. This is
# arithmetic safety, not filtering.
_PERFORMANCE_FLOOR_W = 50.0


def _layer_device_info(layer: dict):
    """Single-member layers live on their cell's device; pooled storage
    layers get the Home Battery device."""
    members = layer.get("members", [])
    if len(members) == 1:
        return cell_device(members[0])
    return layer_device(layer["id"])


async def async_setup_entry(hass, entry, async_add_entities):
    """Set up EB sensors from the config entry's coordinator."""
    coordinator = hass.data[DOMAIN]
    data = coordinator.data or {}

    entities: list[SensorEntity] = []
    cell_type = data.get("cell_type", {})
    for cell_id in data.get("outputs", {}):
        entities.append(EBCellSensor(coordinator, cell_id))
        # Only cells EB actually steers. For solar/house/net the output IS the
        # measurement, so a follow-up ratio would be a constant 100.
        if cell_type.get(cell_id) not in _VIRTUAL_CELL_TYPES:
            entities.append(EBCellPerformanceSensor(coordinator, cell_id))
    entities.append(EBStatusSensor(coordinator))

    for layer in data.get("layers", []):
        lid = layer["id"]
        dev = _layer_device_info(layer)
        layer_entities: list[SensorEntity] = [EBLayerSensor(coordinator, lid)]
        if layer.get("has_soc"):
            layer_entities.append(EBLayerSocSensor(coordinator, lid))
            layer_entities.append(EBLayerTargetSensor(coordinator, lid))
            if layer.get("has_energy_charged"):
                layer_entities.append(EBLayerEnergySensor(coordinator, lid, "charged"))
            if layer.get("has_energy_discharged"):
                layer_entities.append(EBLayerEnergySensor(coordinator, lid, "discharged"))
        # What this block hands to the next one. Every block but the grid
        # cell, so a priority change never leaves a block without them.
        if layer.get("kind") != "grid":
            for what in ("rest_out", "forecast_out", "headroom_out"):
                layer_entities.append(EBChainSensor(coordinator, layer, what))
        for ent in layer_entities:
            ent._attr_device_info = dev
        entities.extend(layer_entities)

    # SEM-shaped ratios. The SEM copies of cell values (solar_power,
    # grid_power, battery_power …) are no longer published: each one repeated a
    # cell or layer sensor (removed 2026-11-04).
    for key in data.get("compat", {}):
        if key in _COMPAT_SPEC:
            entities.append(EBCompatSensor(coordinator, key))

    # Detail sensors for the SEM-shaped cards (tariff/costs/peak/surplus/diag).
    for key in data.get("extras", {}):
        entities.append(EBExtraSensor(coordinator, key))

    async_add_entities(entities)


class _EBBase(CoordinatorEntity, SensorEntity):
    """Shared coordinator wiring; entities group under the System device
    unless a subclass assigns a per-cell device."""

    _attr_should_poll = False
    # Keep object_ids derived from the full "EB ..." name — never prefixed
    # with the device name (cards address sensor.eb_<suffix> directly).
    _attr_has_entity_name = False

    def __init__(self, coordinator, object_id: str, unique_suffix: str) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{DOMAIN}_{unique_suffix}"
        self._attr_device_info = system_device()

    @property
    def _data(self) -> dict:
        return self.coordinator.data or {}


class EBCellSensor(_EBBase):
    """One cell of the chain (power W + rich attributes)."""

    _attr_device_class = SensorDeviceClass.POWER
    _attr_native_unit_of_measurement = UnitOfPower.WATT

    def __init__(self, coordinator, cell_id: str) -> None:
        super().__init__(coordinator, cell_id, cell_id)
        self._cell_id = cell_id
        self._attr_name = f"EB {cell_id}"
        self.entity_id = entity_id("sensor", cell_prefix(coordinator, cell_id), "cell")
        # Every chain cell — steerable AND virtual (solar/house/net) —
        # gets its own device.
        self._attr_device_info = cell_device(cell_id)

    @property
    def native_value(self):
        out = self._data.get("outputs", {}).get(self._cell_id)
        return round(out.power_w) if out else None

    @property
    def extra_state_attributes(self):
        out = self._data.get("outputs", {}).get(self._cell_id)
        if out is None:
            return None
        detail = self._data.get("details", {}).get(self._cell_id, {})
        act = self._data.get("actuation", {}).get(self._cell_id, {})
        return {
            "type": self._data.get("cell_type", {}).get(self._cell_id, ""),
            # The two axes (NAMING.md §2): `mode` is the policy the user chose,
            # `control` is who is steering right now, `action` is what the cell is
            # doing. A cell can be autonomous AND discharging — that combination is
            # exactly what the old single enum could not express.
            "mode": detail.get("mode"),
            "control": detail.get("control"),
            "action": out.action,
            "power_w": round(out.power_w, 1),
            "reason": out.reason,
            "actuator_action": act.get("action"),
            "actuator_setpoint": act.get("setpoint"),
            "actuator_unit": act.get("unit"),
            "actuator_service": act.get("service"),
            "actuator_sent": act.get("sent"),
            "successor_power_w": detail.get("successor_power_w", 0),
            "measured_w": detail.get("measured_w", 0),
            "soc": detail.get("soc"),
            "target_soc": detail.get("target_soc"),
            "take_pct": detail.get("take_pct", 100),
            "source_sensor": self._data.get("source_sensors", {}).get(self._cell_id, ""),
            "timestamp": self._data.get("timestamp"),
            # Grid cell: its block inputs. Tier: its quarter budget. What a cell
            # hands to another cell is a sensor of its own (EBChainSensor), and a
            # value that has its own sensor is not repeated here (the ceiling is
            # sensor.eb_net_peak_limit).
            **{k: detail[k] for k in ("block_now_w", "block_remaining_s",
                                      "block_budget_w")
               if k in detail},
        }


class EBCellPerformanceSensor(_EBBase):
    """How closely one cell follows the power EB ordered, in percent.

    100 means the cell does exactly what it was told. Below that it is ignoring
    the order — the Smappee freezing its charge limit reads ~35. Above that it
    takes more than it was given — the goodwe on eco_charge reads ~160.

    Deliberately RAW: no smoothing, no dead band, no hysteresis, recomputed every
    tick. What counts as "off" depends entirely on the hardware behind the cell,
    so that judgement belongs with whoever acts on it — a numeric_state trigger
    with `for:`, or a filter sensor. Baking a threshold in here would make the
    integration guess on the user's behalf, and guess wrong per device.

    Returns None (unknown) when EB is not steering the cell, so a released or
    idle cell never looks like a fault.
    """

    _attr_native_unit_of_measurement = PERCENTAGE
    _attr_state_class = SensorStateClass.MEASUREMENT
    _attr_suggested_display_precision = 0

    def __init__(self, coordinator, cell_id: str) -> None:
        super().__init__(coordinator, f"{cell_id}_performance",
                         f"{cell_id}_performance")
        self._cell_id = cell_id
        self._attr_name = f"EB {cell_id} performance"
        self.entity_id = entity_id("sensor", cell_prefix(coordinator, cell_id),
                                   "performance")
        self._attr_device_info = cell_device(cell_id)

    def _pair(self) -> tuple[float, float] | None:
        """(commanded_w, measured_w) — both in EB's sign convention
        (+ = charge), or None when EB is not commanding this cell."""
        out = self._data.get("outputs", {}).get(self._cell_id)
        if out is None or out.action not in _COMMANDED_ACTIONS:
            return None
        detail = self._data.get("details", {}).get(self._cell_id, {})
        return float(out.power_w), float(detail.get("measured_w") or 0.0)

    def _not_applicable(self) -> str | None:
        """Why there is nothing to measure right now, or None when there is.

        The state can only be a number or `unknown`, and `unknown` reads as
        "no idea" to anything watching for broken entities. Here it is the
        opposite: EB knows exactly why there is no ratio. Say so in an
        attribute, so a monitor can tell "not applicable" from "dead"."""
        pair = self._pair()
        if pair is None:
            return "cell not commanded"
        if abs(pair[0]) < _PERFORMANCE_FLOOR_W:
            return f"commanded below {_PERFORMANCE_FLOOR_W:.0f} W"
        return None

    @property
    def native_value(self):
        if self._not_applicable() is not None:
            return None
        commanded, measured = self._pair()
        return round(measured / commanded * 100.0, 1)

    @property
    def extra_state_attributes(self):
        out = self._data.get("outputs", {}).get(self._cell_id)
        if out is None:
            return None
        detail = self._data.get("details", {}).get(self._cell_id, {})
        reason = self._not_applicable()
        return {
            "action": out.action,
            "commanded_w": round(float(out.power_w), 1),
            "measured_w": round(float(detail.get("measured_w") or 0.0), 1),
            "floor_w": _PERFORMANCE_FLOOR_W,
            "not_applicable": reason is not None,
            "reason": reason,
            "timestamp": self._data.get("timestamp"),
        }


class EBStatusSensor(_EBBase):
    """Global chain status (grid prediction + per-cell actions)."""

    _attr_device_class = SensorDeviceClass.POWER
    _attr_native_unit_of_measurement = UnitOfPower.WATT
    _attr_name = "EB status"

    def __init__(self, coordinator) -> None:
        super().__init__(coordinator, "status", "status")

    @property
    def native_value(self):
        return round(self._data.get("grid_predicted_w", 0))

    @property
    def extra_state_attributes(self):
        outputs = self._data.get("outputs", {})
        return {
            "grid_predicted_w": round(self._data.get("grid_predicted_w", 0), 1),
            "cell_actions": {cid: o.action for cid, o in outputs.items()},
            "timestamp": self._data.get("timestamp"),
        }


class _EBLayerBase(_EBBase):
    """Look a layer dict up by id on each read."""

    def __init__(self, coordinator, lid: str, object_id: str, unique_suffix: str) -> None:
        super().__init__(coordinator, object_id, unique_suffix)
        self._lid = lid

    def _layer(self):
        for layer in self._data.get("layers", []):
            if layer["id"] == self._lid:
                return layer
        return None


class EBLayerSensor(_EBLayerBase):
    """Pooled power for one priority layer (battery sign for storage layers)."""

    _attr_device_class = SensorDeviceClass.POWER
    _attr_native_unit_of_measurement = UnitOfPower.WATT
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coordinator, lid: str) -> None:
        super().__init__(coordinator, lid, f"layer_{lid}", f"layer_{lid}")
        self._attr_name = f"EB Layer {lid}"
        self.entity_id = entity_id("sensor", slug(lid), "layer")

    @property
    def native_value(self):
        layer = self._layer()
        return round(layer["power_w"]) if layer else None

    @property
    def extra_state_attributes(self):
        layer = self._layer()
        if layer is None:
            return None
        attrs = {
            "position": layer["position"],
            "kind": layer["kind"],
            "power_w": layer["power_w"],
            "members": layer["members"],
            "timestamp": self._data.get("timestamp"),
        }
        for k, v in layer.items():
            if k.startswith(("power_", "soc_")):
                attrs[k] = v
        if layer.get("has_soc"):
            for k in ("action", "soc", "capacity_kwh", "energy_stored_kwh",
                      "target_soc", "charge_avail_w", "discharge_avail_w"):
                attrs[k] = layer.get(k)
        if "block_budget_w" in layer:
            attrs["block_budget_w"] = layer["block_budget_w"]
        return attrs


class EBChainSensor(_EBLayerBase):
    """What a block hands to its neighbour in the chain: rest (W) and forecast
    (Wh) downstream, headroom (W) upstream.

    Inside EB the cells pass these in memory within one tick; this sensor shows
    what was passed. Named after the block that computes it (naming.py).
    """

    _attr_state_class = SensorStateClass.MEASUREMENT
    _SPEC = {
        "rest_out": ("rest_out_w", SensorDeviceClass.POWER, UnitOfPower.WATT),
        "forecast_out": ("forecast_out_wh", SensorDeviceClass.ENERGY, UnitOfEnergy.WATT_HOUR),
        "headroom_out": ("headroom_out_w", SensorDeviceClass.POWER, UnitOfPower.WATT),
    }

    def __init__(self, coordinator, layer: dict, what: str) -> None:
        lid = layer["id"]
        super().__init__(coordinator, lid, f"{lid}_{what}", f"chain_{lid}_{what}")
        self._key, self._attr_device_class, self._attr_native_unit_of_measurement = self._SPEC[what]
        if self._attr_device_class == SensorDeviceClass.ENERGY:
            # A forecast is a measurement, not a meter (see _EXTRA_SPEC).
            self._attr_device_class = None
        members = layer.get("members", [])
        prefix = (cell_prefix(coordinator, members[0]) if len(members) == 1
                  else slug(lid))
        self._attr_name = f"EB {lid} {what.replace('_', ' ')}"
        self.entity_id = entity_id("sensor", prefix, what)

    @property
    def native_value(self):
        layer = self._layer()
        v = layer.get(self._key) if layer else None
        return round(v) if v is not None else None


class EBLayerSocSensor(_EBLayerBase):
    """Dedicated SoC entity for a storage layer (for power-flow cards)."""

    _attr_device_class = SensorDeviceClass.BATTERY
    _attr_native_unit_of_measurement = "%"
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coordinator, lid: str) -> None:
        super().__init__(coordinator, lid, f"layer_{lid}_soc", f"layer_{lid}_soc")
        self._attr_name = f"EB Layer {lid} SoC"
        self.entity_id = entity_id("sensor", slug(lid), "soc")

    @property
    def native_value(self):
        layer = self._layer()
        return layer.get("soc") if layer else None


class EBLayerTargetSensor(_EBLayerBase):
    """Pool target SoC (read by an external pool-brain)."""

    _attr_device_class = SensorDeviceClass.BATTERY
    _attr_native_unit_of_measurement = "%"
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coordinator, lid: str) -> None:
        super().__init__(coordinator, lid, f"layer_{lid}_target", f"layer_{lid}_target")
        self._attr_name = f"EB Layer {lid} Target SoC"
        self.entity_id = entity_id("sensor", slug(lid), "target_soc")

    @property
    def native_value(self):
        layer = self._layer()
        return layer.get("target_soc") if layer else None


class EBLayerEnergySensor(_EBLayerBase):
    """Summed charged/discharged energy for a storage layer."""

    _attr_device_class = SensorDeviceClass.ENERGY
    _attr_native_unit_of_measurement = UnitOfEnergy.KILO_WATT_HOUR
    _attr_state_class = SensorStateClass.TOTAL_INCREASING

    def __init__(self, coordinator, lid: str, direction: str) -> None:
        super().__init__(coordinator, lid, f"layer_{lid}_energy_{direction}",
                         f"layer_{lid}_energy_{direction}")
        self._direction = direction
        self._attr_name = f"EB Layer {lid} Energy {direction.capitalize()}"
        self.entity_id = entity_id("sensor", slug(lid), f"energy_{direction}")

    @property
    def native_value(self):
        layer = self._layer()
        return layer.get(f"energy_{self._direction}_kwh") if layer else None


# --- SEM-compatibility sensors -------------------------------------------------
# (key, friendly name, device_class, unit, state_class)
_COMPAT_SPEC = {
    "autarky_rate": ("Autarky Rate", None, "%", SensorStateClass.MEASUREMENT),
    "self_consumption_rate": ("Self-Consumption Rate", None, "%", SensorStateClass.MEASUREMENT),
}


# --- Extra detail sensors (tariff / costs / peak / surplus / diag) -------------
_EUR = "EUR"
_EURKWH = "EUR/kWh"
_KWH = UnitOfEnergy.KILO_WATT_HOUR
_W = UnitOfPower.WATT
_MEAS = SensorStateClass.MEASUREMENT
_TOT = SensorStateClass.TOTAL
# The energy dashboard only accepts TOTAL / TOTAL_INCREASING, and a TOTAL that
# resets needs a last_reset we do not publish. The lifetime counters never reset,
# so TOTAL_INCREASING is both true and the shape the dashboard wants.
_TOTINC = SensorStateClass.TOTAL_INCREASING

# suffix -> (device_class, unit, state_class, device)
# device: "costs" | "net" | "system"
_EXTRA_SPEC = {
    "tariff_current_import_rate": (None, _EURKWH, _MEAS, "costs"),
    "tariff_current_export_rate": (None, _EURKWH, _MEAS, "costs"),
    # Forecast (display only). No ENERGY device_class: that demands a total /
    # total_increasing state_class, and a forecast is a measurement.
    "forecast_remaining_today_kwh": (None, _KWH, _MEAS, "system"),
    "forecast_corrected_today": (None, _KWH, _MEAS, "system"),
    "forecast_tomorrow_kwh": (None, _KWH, _MEAS, "system"),
    "forecast_peak_power_today_w": (SensorDeviceClass.POWER, _W, _MEAS, "system"),
    "forecast_peak_time_today": (None, None, None, "system"),
    "forecast_source": (None, None, None, "system"),
    "target_peak_limit": (SensorDeviceClass.POWER, _W, _MEAS, "net"),
    "net_allowed_import": (SensorDeviceClass.POWER, _W, _MEAS, "net"),
    "current_vs_peak_percentage": (None, "%", _MEAS, "net"),
    "consecutive_peak_15min": (SensorDeviceClass.POWER, _W, _MEAS, "net"),
    "monthly_consecutive_peak": (SensorDeviceClass.POWER, _W, _MEAS, "net"),
    "load_management_status": (None, None, None, "net"),
    "available_load_reduction": (SensorDeviceClass.POWER, _W, _MEAS, "net"),
    "controllable_devices_count": (None, None, _MEAS, "net"),
    "surplus_total_w": (SensorDeviceClass.POWER, _W, _MEAS, "net"),
    "surplus_allocated_w": (SensorDeviceClass.POWER, _W, _MEAS, "net"),
    "surplus_unallocated_w": (SensorDeviceClass.POWER, _W, _MEAS, "net"),
    "surplus_active_devices": (None, None, _MEAS, "net"),
    "surplus_total_devices": (None, None, _MEAS, "net"),
    "grid_status": (None, None, None, "net"),
    "forecast_today_kwh": (None, _KWH, _MEAS, "system"),
    "diag_grid_sign": (None, None, None, "system"),
    "diag_battery_capacity": (None, _KWH, None, "system"),
    "diag_update_interval": (None, "s", None, "system"),
    "diag_charger_count": (None, None, None, "system"),
    "diag_sensors_unavailable": (None, None, _MEAS, "system"),
}
# Accounting snapshot keys (generated per period)
for _p in ("daily", "monthly", "yearly"):
    _EXTRA_SPEC[f"{_p}_grid_import_energy"] = (SensorDeviceClass.ENERGY, _KWH, _TOT, "net")
    _EXTRA_SPEC[f"{_p}_grid_export_energy"] = (SensorDeviceClass.ENERGY, _KWH, _TOT, "net")
    for _f in ("costs", "savings", "export_revenue", "battery_savings", "net_cost"):
        _EXTRA_SPEC[f"{_p}_{_f}"] = (SensorDeviceClass.MONETARY, _EUR, _TOT, "costs")
_EXTRA_SPEC["lifetime_total_savings"] = (SensorDeviceClass.MONETARY, _EUR, _TOT, "costs")
# Daily solar energy = a mirror of the real inverter day-total (display only), on the
# solar cell. EB's own integration could only count from boot, so it read far too low;
# the inverter already measures this accurately.
_EXTRA_SPEC["daily_solar_energy"] = (SensorDeviceClass.ENERGY, _KWH, _TOT, "solar")
# Lifetime counters for the energy dashboard. They start at zero the day this
# lands — the P1 meter keeps the long history for grid, so only house (which no
# other sensor measures) and solar have no earlier source.
_EXTRA_SPEC["lifetime_grid_import_energy"] = (SensorDeviceClass.ENERGY, _KWH, _TOTINC, "net")
_EXTRA_SPEC["lifetime_grid_export_energy"] = (SensorDeviceClass.ENERGY, _KWH, _TOTINC, "net")
_EXTRA_SPEC["lifetime_solar_energy"] = (SensorDeviceClass.ENERGY, _KWH, _TOTINC, "solar")
_EXTRA_SPEC["lifetime_house_energy"] = (SensorDeviceClass.ENERGY, _KWH, _TOTINC, "house")


class EBExtraSensor(_EBBase):
    """A detail value (sensor.eb_<suffix>) from the coordinator extras block."""

    def __init__(self, coordinator, key: str) -> None:
        super().__init__(coordinator, key, f"extra_{key}")
        self._key = key
        self._attr_name = f"EB {key.replace('_', ' ')}"
        dev_class, unit, state_class, device = _EXTRA_SPEC.get(
            key, (None, None, None, "system"))
        self._attr_device_class = dev_class
        self._attr_native_unit_of_measurement = unit
        self._attr_state_class = state_class
        if key in EXTRA_IDS:
            device, what = EXTRA_IDS[key]
            self.entity_id = entity_id("sensor", slug(device), what)
        self._attr_device_info = (costs_device() if device == "costs"
                                  else cell_device(device)
                                  if device in ("net", "solar", "house")
                                  else system_device())

    def _entry(self) -> dict:
        return self._data.get("extras", {}).get(self._key) or {}

    @property
    def native_value(self):
        return self._entry().get("value")

    @property
    def extra_state_attributes(self):
        return self._entry().get("attrs")


class EBCompatSensor(_EBBase):
    """A SEM-shaped value (sensor.eb_<suffix>) read by the ported SEM cards."""

    def __init__(self, coordinator, key: str) -> None:
        super().__init__(coordinator, key, f"compat_{key}")
        self._key = key
        name, dev_class, unit, state_class = _COMPAT_SPEC.get(
            key, (key.replace("_", " ").title(), None, None, None))
        self._attr_name = f"EB {name}"
        self._attr_device_class = dev_class
        self._attr_native_unit_of_measurement = unit
        self._attr_state_class = state_class

    @property
    def native_value(self):
        return self._data.get("compat", {}).get(self._key)
