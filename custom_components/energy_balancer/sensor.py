"""Energy Balancer sensor platform.

Publishes one sensor.eb_<cell> per chain cell, a status sensor, and one
block per priority layer (power / SoC / target / energy).
"""

from __future__ import annotations

from homeassistant.components.sensor import (
    SensorDeviceClass,
    SensorEntity,
    SensorStateClass,
)
from homeassistant.const import UnitOfEnergy, UnitOfPower
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, ENTITY_PREFIX
from .devices import cell_device, costs_device, layer_device, system_device


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
    for cell_id in data.get("outputs", {}):
        entities.append(EBCellSensor(coordinator, cell_id))
    entities.append(EBStatusSensor(coordinator))

    for layer in data.get("layers", []):
        lid = layer["id"]
        dev = _layer_device_info(layer)
        layer_entities: list[SensorEntity] = [EBLayerSensor(coordinator, lid)]
        if layer.get("has_soc"):
            layer_entities.append(EBLayerSocSensor(coordinator, lid))
            layer_entities.append(EBLayerTargetSensor(coordinator, lid))
            if layer.get("energy_charged_kwh") is not None:
                layer_entities.append(EBLayerEnergySensor(coordinator, lid, "charged"))
            if layer.get("energy_discharged_kwh") is not None:
                layer_entities.append(EBLayerEnergySensor(coordinator, lid, "discharged"))
        for ent in layer_entities:
            ent._attr_device_info = dev
        entities.extend(layer_entities)

    # SEM-shaped compatibility sensors (feed the ported SEM cards).
    # Each lands on the device of the cell/pool it describes.
    storage_pools = [l["id"] for l in data.get("layers", [])
                     if l.get("has_soc") and len(l.get("members", [])) > 1]
    battery_dev = layer_device(storage_pools[0]) if storage_pools else None
    car_cells = [c.id for c in coordinator.cell_configs if c.type == "car_charger"]
    compat_dev = {
        "solar_power": cell_device("solar"),
        "home_consumption_power": cell_device("house"),
        "grid_power": cell_device("net"),
        "grid_import_power": cell_device("net"),
        "grid_export_power": cell_device("net"),
    }
    if car_cells:
        compat_dev["ev_power"] = cell_device(car_cells[0])
    if battery_dev:
        compat_dev.update({"battery_power": battery_dev,
                           "battery_soc": battery_dev,
                           "battery_status": battery_dev})
    for key in data.get("compat", {}):
        ent = EBCompatSensor(coordinator, key)
        if key in compat_dev:
            ent._attr_device_info = compat_dev[key]
        entities.append(ent)

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
            "rest_in_w": detail.get("rest_in_w", 0),
            "rest_out_w": detail.get("rest_out_w", 0),
            "headroom_w": detail.get("headroom_w", 0),
            "successor_power_w": detail.get("successor_power_w", 0),
            "measured_w": detail.get("measured_w", 0),
            "soc": detail.get("soc"),
            "target_soc": detail.get("target_soc"),
            "forecast_in_wh": detail.get("forecast_in_wh", 0),
            "forecast_out_wh": detail.get("forecast_out_wh", 0),
            "take_pct": detail.get("take_pct", 100),
            "source_sensor": self._data.get("source_sensors", {}).get(self._cell_id, ""),
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
        return attrs


class EBLayerSocSensor(_EBLayerBase):
    """Dedicated SoC entity for a storage layer (for power-flow cards)."""

    _attr_device_class = SensorDeviceClass.BATTERY
    _attr_native_unit_of_measurement = "%"
    _attr_state_class = SensorStateClass.MEASUREMENT

    def __init__(self, coordinator, lid: str) -> None:
        super().__init__(coordinator, lid, f"layer_{lid}_soc", f"layer_{lid}_soc")
        self._attr_name = f"EB Layer {lid} SoC"

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

    @property
    def native_value(self):
        layer = self._layer()
        return layer.get(f"energy_{self._direction}_kwh") if layer else None


# --- SEM-compatibility sensors -------------------------------------------------
# (key, friendly name, device_class, unit, state_class)
_COMPAT_SPEC = {
    "solar_power": ("Solar Power", SensorDeviceClass.POWER, UnitOfPower.WATT, SensorStateClass.MEASUREMENT),
    "home_consumption_power": ("Home Consumption Power", SensorDeviceClass.POWER, UnitOfPower.WATT, SensorStateClass.MEASUREMENT),
    "grid_power": ("Grid Power", SensorDeviceClass.POWER, UnitOfPower.WATT, SensorStateClass.MEASUREMENT),
    "grid_import_power": ("Grid Import Power", SensorDeviceClass.POWER, UnitOfPower.WATT, SensorStateClass.MEASUREMENT),
    "grid_export_power": ("Grid Export Power", SensorDeviceClass.POWER, UnitOfPower.WATT, SensorStateClass.MEASUREMENT),
    "ev_power": ("EV Power", SensorDeviceClass.POWER, UnitOfPower.WATT, SensorStateClass.MEASUREMENT),
    "battery_power": ("Battery Power", SensorDeviceClass.POWER, UnitOfPower.WATT, SensorStateClass.MEASUREMENT),
    "battery_soc": ("Battery SoC", SensorDeviceClass.BATTERY, "%", SensorStateClass.MEASUREMENT),
    "autarky_rate": ("Autarky Rate", None, "%", SensorStateClass.MEASUREMENT),
    "self_consumption_rate": ("Self-Consumption Rate", None, "%", SensorStateClass.MEASUREMENT),
    "battery_status": ("Battery Status", None, None, None),
}


# --- Extra detail sensors (tariff / costs / peak / surplus / diag) -------------
_EUR = "EUR"
_EURKWH = "EUR/kWh"
_KWH = UnitOfEnergy.KILO_WATT_HOUR
_W = UnitOfPower.WATT
_MEAS = SensorStateClass.MEASUREMENT
_TOT = SensorStateClass.TOTAL

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
