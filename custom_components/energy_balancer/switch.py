"""Observer-mode switch (switch.eb_observer_mode).

ON = observer/dry-run: the chain computes and logs but never actuates.
OFF = live actuation. Writes through to the entry options (dual control:
dashboard and options-flow stay in sync).
"""

from __future__ import annotations

from homeassistant.components.switch import SwitchEntity

from .const import DOMAIN
from .devices import system_device


async def async_setup_entry(hass, entry, async_add_entities) -> None:
    coordinator = hass.data[DOMAIN]
    async_add_entities([EBObserverSwitch(hass, entry, coordinator)])


class EBObserverSwitch(SwitchEntity):
    """Toggle observer (dry-run) mode."""

    _attr_has_entity_name = False
    _attr_should_poll = False
    _attr_icon = "mdi:eye-outline"

    def __init__(self, hass, entry, coordinator) -> None:
        self._hass = hass
        self._entry = entry
        self._coordinator = coordinator
        self._attr_unique_id = f"{DOMAIN}_observer_mode"
        self._attr_name = "EB observer mode"
        self._attr_device_info = system_device()

    @property
    def is_on(self) -> bool:
        return bool(self._coordinator._cfg.get("observer_mode", True))

    async def _set(self, value: bool) -> None:
        from . import async_persist_option  # late import: avoids cycle
        await async_persist_option(
            self._hass, self._entry, self._coordinator,
            "observer_mode", value)
        self.async_write_ha_state()

    async def async_turn_on(self, **kwargs) -> None:
        await self._set(True)

    async def async_turn_off(self, **kwargs) -> None:
        await self._set(False)
