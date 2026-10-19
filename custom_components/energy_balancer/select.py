"""Native select entities.

* select.eb_<pool>_min_soc_mode — how the pool's floor (target SoC) is decided:
  "balanced" runs the algorithm (sunny/no_sun + forecast + consumption, floor
  clamped), "manual" takes the manual_min_soc slider verbatim. Pool-level for
  the same reason the SoC targets are: the tier target is a capacity-weighted
  average, so a per-cell mode would be meaningless — one knob writes the same
  value to every member cell.

* select.eb_<cell>_mode — the car brain's mode (Off / Automatisch / Solar / Surplus), only
  on a cell with use_car_brain on. Two shapes, following the same rule the rest
  of this integration follows (see number.py): an entity reference is the single
  knob and we drive it, otherwise we own the value.

    charge_mode_entity set   → EBCarModeWindowSelect: a window on that helper.
                               Options and current value are READ from it and
                               picking calls select_option on it. No private
                               copy, so the helper and this entity cannot drift.
    charge_mode_entity unset → EBCarModeOwnSelect: our own value, written
                               through to the entry options like the tier mode.
"""

from __future__ import annotations

from homeassistant.components.select import SelectEntity
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, UNAVAILABLE_STATES
from .devices import cell_device, layer_device, system_device
from .params import CELL_ALGO_SPEC, SYSTEM_SPEC, is_entity_ref

_KEY = "min_soc_mode"
_CAR_KEY = "car_mode"
_MONTH_KEY = "month_start_peak_policy"


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

    # Car-brain mode, per cell that runs the brain.
    for cfg in coordinator.cell_configs:
        io = coordinator.cell_io.get(cfg.id, {})
        if not io.get("use_car_brain"):
            continue
        helper = io.get("charge_mode_entity")
        if helper and is_entity_ref(helper):
            entities.append(EBCarModeWindowSelect(
                hass, coordinator, cfg.id, helper))
        else:
            current = str(io.get(_CAR_KEY) or CELL_ALGO_SPEC[_CAR_KEY].default)
            entities.append(EBCarModeOwnSelect(
                hass, entry, coordinator, cfg.id, current))

    # Month rollover policy — only meaningful once a month peak sensor is named.
    if coordinator.month_peak_sensor:
        entities.append(EBMonthStartPolicySelect(
            hass, entry, coordinator, coordinator.month_start_peak_policy))

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


class EBCarModeWindowSelect(CoordinatorEntity, SelectEntity):
    """The car brain's mode when a helper drives it — a view, not a copy.

    Same rule as EBTakeNumber in number.py: the configured entity is the single
    knob, so this entity reads it live and writes straight back to it. Keeping a
    private copy here is exactly the bug that made three take-% sliders on the
    dashboard move a number and change nothing.

    The option list is read from the helper too. Hardcoding Off/Automatisch/Solar
    would silently drop an option the user adds to their input_select, and would
    offer options the helper does not accept.
    """

    _attr_has_entity_name = False

    def __init__(self, hass, coordinator, cell_id: str, helper: str) -> None:
        super().__init__(coordinator)
        self._hass = hass
        self._cell_id = cell_id
        self._helper = helper
        self._attr_unique_id = f"{DOMAIN}_param_{cell_id}_{_CAR_KEY}"
        self._attr_name = f"EB {cell_id} mode"
        self._attr_device_info = cell_device(cell_id)

    def _state(self):
        return self._hass.states.get(self._helper)

    @property
    def options(self) -> list:
        """The helper's own option list; the spec's tokens as a fallback.

        A missing or unavailable helper has no options attribute — fall back
        rather than raise, so the entity still renders while the helper is out.
        """
        st = self._state()
        opts = st.attributes.get("options") if st is not None else None
        if opts:
            return [str(o) for o in opts]
        return list(CELL_ALGO_SPEC[_CAR_KEY].choices)

    @property
    def current_option(self):
        """None while the helper is unavailable.

        Deliberately not defaulted to "Automatisch": the brain treats an
        unreachable helper as a raw None (car_brain.resolve_mode, QUIRK 2), and
        showing a concrete mode here would claim something the brain is not
        doing.
        """
        st = self._state()
        if st is None or st.state in UNAVAILABLE_STATES:
            return None
        return str(st.state)

    @property
    def available(self) -> bool:
        return self._state() is not None

    async def async_select_option(self, option: str) -> None:
        # Drive the helper; it is the single knob. `select_option` with an
        # `option` key is the service on both input_select and select.
        domain = self._helper.split(".", 1)[0]
        await self._hass.services.async_call(
            domain, "select_option",
            {"entity_id": self._helper, "option": option}, blocking=True)
        self.async_write_ha_state()


class EBMonthStartPolicySelect(SelectEntity):
    """What the stale monthly-peak reading counts as at the turn of the month.

    The P1 keeps last month's peak for the first quarter of a new month (measured
    2026-08-31: 15,2 minutes). Whatever EB draws in that window closes the first
    block of the month, so leaving the old ceiling in place lets the fresh month
    inherit the old peak. Three ways out, and the choice is the user's:

      previous   — take the reading as-is (what EB did before this existed)
      configured — cap it at peak_limit_w
      zero       — ignore it; the other peak_limit_sensors decide
    """

    _attr_has_entity_name = False
    _attr_should_poll = False

    def __init__(self, hass, entry, coordinator, current: str) -> None:
        self._hass = hass
        self._entry = entry
        self._coordinator = coordinator
        self._attr_options = list(SYSTEM_SPEC[_MONTH_KEY].choices)
        self._attr_current_option = (
            current if current in self._attr_options
            else SYSTEM_SPEC[_MONTH_KEY].default)
        self._attr_unique_id = f"{DOMAIN}_param_{_MONTH_KEY}"
        self._attr_name = "EB month start peak policy"
        self._attr_device_info = system_device()

    async def async_select_option(self, option: str) -> None:
        from . import async_persist_option  # late import: avoids cycle
        await async_persist_option(
            self._hass, self._entry, self._coordinator, _MONTH_KEY, option, None)
        self._attr_current_option = option
        self.async_write_ha_state()


class EBCarModeOwnSelect(SelectEntity):
    """The car brain's mode when no helper drives it — we own the value.

    Same shape as EBTierModeSelect: write through to the entry options so the
    dashboard and the options flow stay in sync.
    """

    _attr_has_entity_name = False
    _attr_should_poll = False

    def __init__(self, hass, entry, coordinator, cell_id: str, current: str) -> None:
        self._hass = hass
        self._entry = entry
        self._coordinator = coordinator
        self._cell_id = cell_id
        self._attr_options = list(CELL_ALGO_SPEC[_CAR_KEY].choices)
        self._attr_current_option = (
            current if current in self._attr_options
            else CELL_ALGO_SPEC[_CAR_KEY].default)
        self._attr_unique_id = f"{DOMAIN}_param_{cell_id}_{_CAR_KEY}"
        self._attr_name = f"EB {cell_id} mode"
        self._attr_device_info = cell_device(cell_id)

    async def async_select_option(self, option: str) -> None:
        from . import async_persist_option  # late import: avoids cycle
        await async_persist_option(
            self._hass, self._entry, self._coordinator,
            _CAR_KEY, option, self._cell_id)
        self._attr_current_option = option
        self.async_write_ha_state()
