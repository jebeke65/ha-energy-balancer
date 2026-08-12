"""Native select entities.

* select.eb_<pool>_min_soc_mode — how the pool's floor (target SoC) is decided:
  "balanced" runs the algorithm (sunny/no_sun + forecast + consumption, floor
  clamped), "manual" takes the manual_min_soc slider verbatim. Pool-level for
  the same reason the SoC targets are: the tier target is a capacity-weighted
  average, so a per-cell mode would be meaningless — one knob writes the same
  value to every member cell.
"""

from __future__ import annotations

from homeassistant.components.select import SelectEntity

from .const import DOMAIN
from .devices import layer_device
from .params import CELL_ALGO_SPEC, is_entity_ref

_KEY = "min_soc_mode"


async def async_setup_entry(hass, entry, async_add_entities) -> None:
    coordinator = hass.data[DOMAIN]
    entities = []
    data = coordinator.data or {}
    for layer in data.get("layers", []):
        if not (layer.get("has_soc") and len(layer.get("members", [])) > 1):
            continue
        members = layer["members"]
        raws = [coordinator.cell_io.get(m, {}).get(_KEY) for m in members]
        if any(is_entity_ref(r) for r in raws):
            continue  # entity-driven on a member: that entity is the knob
        current = next((str(r) for r in raws if r), "balanced")
        entities.append(EBTierModeSelect(
            hass, entry, coordinator, layer["id"], members, current))
    async_add_entities(entities)


class EBTierModeSelect(SelectEntity):
    """A pool-level mode switch: one knob, written to every member cell."""

    _attr_has_entity_name = False
    _attr_should_poll = False

    def __init__(self, hass, entry, coordinator, lid, members, current) -> None:
        self._hass = hass
        self._entry = entry
        self._coordinator = coordinator
        self._members = members
        self._attr_options = list(CELL_ALGO_SPEC[_KEY].choices)
        self._attr_current_option = (
            current if current in self._attr_options else "balanced")
        self._attr_unique_id = f"{DOMAIN}_param_{lid}_{_KEY}"
        self._attr_name = f"EB {lid} {_KEY}"
        self._attr_device_info = layer_device(lid)

    async def async_select_option(self, option: str) -> None:
        from . import async_persist_option  # late import: avoids cycle
        for member in self._members:
            await async_persist_option(
                self._hass, self._entry, self._coordinator,
                _KEY, option, member)
        self._attr_current_option = option
        self.async_write_ha_state()
