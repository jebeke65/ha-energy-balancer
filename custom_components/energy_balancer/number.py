"""Native number entities.

* number.eb_<cell>_take — take_pct slider per steerable cell. Reads the live
  value and writes back to the configured source (an entity reference is the
  single knob; we drive it rather than keeping a private copy).
* number.eb_<cell>_<param> — live-tunable algo params (sunny_min_soc,
  no_sun_min_soc, hysteresis, charge_floor_w) and number.eb_peak_limit_w.
  These write through to the config-entry options (dual control: dashboard
  AND options-flow stay in sync); only created when the configured value is
  numeric — a param set to an entity reference keeps that reference as the
  single knob.
"""

from __future__ import annotations

from homeassistant.components.number import NumberEntity, NumberMode
from homeassistant.helpers.update_coordinator import CoordinatorEntity
from homeassistant.const import PERCENTAGE

from .const import DOMAIN
from .devices import cell_device, layer_device, system_device
from .params import CELL_ALGO_SPEC, SYSTEM_SPEC, is_entity_ref

# (key, unit, step) — ranges come from the params spec (single source).
_CELL_PARAMS = (
    ("hysteresis", PERCENTAGE, 1),
    ("charge_floor_w", "W", 50),
)
# SoC targets are pool-level: the tier target is a capacity-weighted average,
# so per-cell values are meaningless — one knob per storage pool writes the
# same value to every member cell.
_TIER_PARAMS = (
    ("sunny_min_soc", PERCENTAGE, 1),
    ("no_sun_min_soc", PERCENTAGE, 1),
    # The manual floor. Only consulted when min_soc_mode is "manual", but the
    # slider is always present so a value can be dialled in before switching.
    ("manual_min_soc", PERCENTAGE, 1),
)


async def async_setup_entry(hass, entry, async_add_entities) -> None:
    coordinator = hass.data[DOMAIN]
    entities = []
    for cfg in coordinator.cell_configs:
        entities.append(EBTakeNumber(hass, entry, coordinator, cfg.id))
        io = coordinator.cell_io.get(cfg.id, {})
        for key, unit, step in _CELL_PARAMS:
            raw = io.get(key)
            if raw is None or is_entity_ref(raw):
                continue  # entity-driven param: that entity is the knob
            spec = CELL_ALGO_SPEC[key]
            entities.append(EBParamNumber(
                hass, entry, coordinator, cfg.id, key,
                float(raw), spec.minv, spec.maxv, step, unit))

    # Pool-level SoC targets: one knob per storage pool, fanning out to
    # all member cells.
    data = coordinator.data or {}
    for layer in data.get("layers", []):
        if not (layer.get("has_soc") and len(layer.get("members", [])) > 1):
            continue
        members = layer["members"]
        for key, unit, step in _TIER_PARAMS:
            raws = [coordinator.cell_io.get(m, {}).get(key) for m in members]
            if any(r is None or is_entity_ref(r) for r in raws):
                continue  # entity-driven on a member: that entity is the knob
            spec = CELL_ALGO_SPEC[key]
            entities.append(EBTierParamNumber(
                hass, entry, coordinator, layer["id"], members, key,
                float(raws[0]), spec.minv, spec.maxv, step, unit))

    # System-wide peak limit (only when numerically configured).
    peak = coordinator.peak_limit_default
    spec = SYSTEM_SPEC["peak_limit_w"]
    entities.append(EBParamNumber(
        hass, entry, coordinator, None, "peak_limit_w",
        float(peak), spec.minv, spec.maxv, 100, "W"))
    async_add_entities(entities)



class EBTakeNumber(CoordinatorEntity, NumberEntity):
    """The take_pct slider for one cell — a view on the real knob, not a copy.

    It used to be a RestoreNumber that stored the value in itself and told nobody:
    async_set_native_value() wrote a private attribute and stopped there. The
    coordinator reads take_pct from the config (usually an entity reference), so
    dragging this slider moved a number on the screen and changed nothing at all.
    Three of them sat on the EB dashboard, for the car and both batteries.

    Now it reads the live value and writes back to whatever the config points at —
    the same rule the rest of this module already follows: an entity reference is
    the single knob, and we drive that knob rather than competing with it.
    """

    _attr_has_entity_name = False
    _attr_native_min_value = 0
    _attr_native_max_value = 100
    _attr_native_step = 1
    _attr_mode = NumberMode.SLIDER
    _attr_native_unit_of_measurement = PERCENTAGE

    def __init__(self, hass, entry, coordinator, cell_id: str) -> None:
        super().__init__(coordinator)
        self._hass = hass
        self._entry = entry
        self._coordinator = coordinator
        self._cell_id = cell_id
        self._attr_unique_id = f"{DOMAIN}_take_{cell_id}"
        self._attr_name = f"EB {cell_id} take %"
        self._attr_device_info = cell_device(cell_id)

    def _configured(self):
        return (self._coordinator.cell_io.get(self._cell_id) or {}).get("take_pct")

    @property
    def native_value(self) -> float:
        # The truth lives at the source, not in this entity.
        return round(self._coordinator._resolve(self._configured(), 100.0))

    async def async_set_native_value(self, value: float) -> None:
        raw = self._configured()
        if is_entity_ref(raw):
            # Drive the referenced helper; it is the single knob.
            domain = raw.split(".", 1)[0]
            await self._hass.services.async_call(
                domain, "set_value",
                {"entity_id": raw, "value": value}, blocking=True)
        else:
            from . import async_persist_option  # late import: avoids cycle
            await async_persist_option(
                self._hass, self._entry, self._coordinator,
                "take_pct", value, self._cell_id)
        self.async_write_ha_state()


class EBParamNumber(NumberEntity):
    """A live-tunable parameter that writes through to the entry options."""

    _attr_has_entity_name = False
    _attr_mode = NumberMode.BOX
    _attr_should_poll = False

    def __init__(self, hass, entry, coordinator, cell_id, key,
                 initial, minv, maxv, step, unit) -> None:
        self._hass = hass
        self._entry = entry
        self._coordinator = coordinator
        self._cell_id = cell_id
        self._key = key
        self._attr_native_value = initial
        self._attr_native_min_value = minv if minv is not None else 0
        self._attr_native_max_value = maxv if maxv is not None else 100
        self._attr_native_step = step
        self._attr_native_unit_of_measurement = unit
        if cell_id is None:
            self._attr_unique_id = f"{DOMAIN}_param_{key}"
            self._attr_name = f"EB {key}"
            self._attr_device_info = system_device()
        else:
            self._attr_unique_id = f"{DOMAIN}_param_{cell_id}_{key}"
            self._attr_name = f"EB {cell_id} {key}"
            self._attr_device_info = cell_device(cell_id)

    async def async_set_native_value(self, value: float) -> None:
        from . import async_persist_option  # late import: avoids cycle
        await async_persist_option(
            self._hass, self._entry, self._coordinator,
            self._key, value, self._cell_id)
        self._attr_native_value = value
        self.async_write_ha_state()


class EBTierParamNumber(NumberEntity):
    """A pool-level SoC target: one knob, written to every member cell."""

    _attr_has_entity_name = False
    _attr_mode = NumberMode.BOX
    _attr_should_poll = False

    def __init__(self, hass, entry, coordinator, lid, members, key,
                 initial, minv, maxv, step, unit) -> None:
        self._hass = hass
        self._entry = entry
        self._coordinator = coordinator
        self._members = members
        self._key = key
        self._attr_native_value = initial
        self._attr_native_min_value = minv if minv is not None else 0
        self._attr_native_max_value = maxv if maxv is not None else 100
        self._attr_native_step = step
        self._attr_native_unit_of_measurement = unit
        self._attr_unique_id = f"{DOMAIN}_param_{lid}_{key}"
        self._attr_name = f"EB {lid} {key}"
        self._attr_device_info = layer_device(lid)

    async def async_set_native_value(self, value: float) -> None:
        from . import async_persist_option  # late import: avoids cycle
        for member in self._members:
            await async_persist_option(
                self._hass, self._entry, self._coordinator,
                self._key, value, member)
        self._attr_native_value = value
        self.async_write_ha_state()
