"""Energy Balancer integration.

Config-entry based. A YAML block (`energy_balancer:` in the HA config) is
imported into a config entry once (migration); after that the entry is the source
of truth and is edited via the UI (config-flow + options-flow).
"""

from __future__ import annotations

import logging

import voluptuous as vol

from homeassistant.config_entries import SOURCE_IMPORT, ConfigEntry
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers.typing import ConfigType

from .const import DOMAIN
from .coordinator import EBCoordinator
from .core import adopt_wiring, migrate_cell_modes
from .dashboard_gen import async_generate_dashboard
from .params import is_entity_ref

_LOGGER = logging.getLogger(__name__)

CONFIG_SCHEMA = vol.Schema({DOMAIN: dict}, extra=vol.ALLOW_EXTRA)

PLATFORMS = ["sensor", "number", "switch", "select"]

SERVICE_GENERATE_DASHBOARD = "generate_dashboard"
GENERATE_DASHBOARD_SCHEMA = vol.Schema({
    vol.Optional("dashboard_title", default="Energy Balancer"): vol.Coerce(str),
    vol.Optional("dashboard_path", default="ebi-dashboard"): vol.Coerce(str),
})

SERVICE_SET_OPTION = "set_option"
SET_OPTION_SCHEMA = vol.Schema({
    vol.Optional("cell"): vol.Coerce(str),
    vol.Required("option"): vol.Coerce(str),
    vol.Required("value"): vol.Any(bool, int, float, str),
})


async def async_persist_option(hass: HomeAssistant, entry: ConfigEntry,
                               coordinator, key: str, value,
                               cell_id: str | None = None) -> None:
    """Dual-path write: apply live on the coordinator AND persist into the
    entry options (so the options-flow shows the same value). Sets a flag so
    the update listener skips the full reload for live tunables."""
    coordinator.apply_live_option(key, value, cell_id)

    conf = {**entry.data, **entry.options}
    if cell_id is not None:
        cells = dict(conf.get("cells", {}))
        cell = dict(cells.get(cell_id, {}))
        algo = dict(cell.get("algo", {}))
        algo[key] = value
        cell["algo"] = algo
        cells[cell_id] = cell
        conf = {**conf, "cells": cells}
    else:
        conf = {**conf, key: value}

    coordinator.suppress_reload = True
    hass.config_entries.async_update_entry(entry, options=conf)
    await coordinator.async_request_refresh()


async def async_migrate_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """v1 → v2: cell modes onto the current vocabulary (NAMING.md).

    self_consumption → surplus, smart → balanced. Both data and options carry a
    cells dict and async_setup_entry merges them, so both have to be rewritten —
    migrating only one would leave the old spelling to win on the next reload.

    normalize_mode() in CellConfig stays as a safety net: an unrecognised mode
    falls through to "idle" without raising, which is a battery that never charges.
    """
    if entry.version == 1:
        hass.config_entries.async_update_entry(
            entry,
            data=migrate_cell_modes(dict(entry.data)),
            options=migrate_cell_modes(dict(entry.options)),
            version=2,
        )
        _LOGGER.info("Migrated Energy Balancer config entry to v2 (cell modes)")

    if entry.version == 2:
        # v2 -> v3: adopt the entity wiring from the YAML package (forecast inputs,
        # take_pct references). Editing .storage/core.config_entries by hand does not
        # work — Home Assistant holds the entries in memory and writes its own copy
        # back on shutdown, silently discarding the edit. This is the supported route.
        seed = hass.data.get(f"{DOMAIN}_yaml") or {}
        hass.config_entries.async_update_entry(
            entry,
            data=adopt_wiring(dict(entry.data), seed),
            options=adopt_wiring(dict(entry.options), seed),
            version=3,
        )
        _LOGGER.info("Migrated Energy Balancer config entry to v3 (entity wiring)")
    return True


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Trigger a one-time import of the YAML config into a config entry."""
    conf = config.get(DOMAIN)
    if conf:
        # Kept for async_migrate_entry: the package file is the source of the
        # entity wiring, and a migration has no other way to reach it.
        hass.data[f"{DOMAIN}_yaml"] = conf
    if conf and not hass.config_entries.async_entries(DOMAIN):
        hass.async_create_task(hass.config_entries.flow.async_init(
            DOMAIN, context={"source": SOURCE_IMPORT}, data=conf))
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    conf = {**entry.data, **entry.options}

    coordinator = EBCoordinator(hass, conf)
    await coordinator.async_load_accounting()
    await coordinator.async_config_entry_first_refresh()
    hass.data[DOMAIN] = coordinator

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    async def _handle_generate_dashboard(call: ServiceCall) -> None:
        await async_generate_dashboard(
            hass, coordinator,
            title=call.data["dashboard_title"],
            path=call.data["dashboard_path"],
        )

    if not hass.services.has_service(DOMAIN, SERVICE_GENERATE_DASHBOARD):
        hass.services.async_register(
            DOMAIN, SERVICE_GENERATE_DASHBOARD, _handle_generate_dashboard,
            schema=GENERATE_DASHBOARD_SCHEMA,
        )

    async def _handle_set_option(call: ServiceCall) -> None:
        cell = call.data.get("cell")
        key = call.data["option"]
        value = call.data["value"]
        live = (coordinator.LIVE_ALGO_KEYS if cell
                else coordinator.LIVE_SYSTEM_KEYS)
        if key not in live:
            raise vol.Invalid(
                f"'{key}' is not a live-tunable option "
                f"({'cell' if cell else 'system'}: {', '.join(live)})")
        # A storage-pool id (e.g. home_battery) fans out to all member cells
        # — SoC targets are pool-level, per-cell values stay in sync.
        targets = [cell] if cell else [None]
        if cell and cell not in coordinator.cell_io:
            pool = next((l for l in (coordinator.data or {}).get("layers", [])
                         if l["id"] == cell and l.get("has_soc")), None)
            if pool is None:
                raise vol.Invalid(f"unknown cell or pool '{cell}'")
            targets = pool["members"]
        # Value may be a number or an entity reference (resolved live).
        if isinstance(value, str) and not is_entity_ref(value):
            try:
                value = float(value)
            except ValueError:
                raise vol.Invalid(
                    f"value {value!r} is neither a number nor an entity id")
        for target in targets:
            await async_persist_option(hass, entry, coordinator, key, value, target)

    if not hass.services.has_service(DOMAIN, SERVICE_SET_OPTION):
        hass.services.async_register(
            DOMAIN, SERVICE_SET_OPTION, _handle_set_option,
            schema=SET_OPTION_SCHEMA,
        )

    entry.async_on_unload(entry.add_update_listener(_async_reload))

    _LOGGER.info(
        "Energy Balancer started | cells=%s | interval=%ss | observer=%s",
        [c.id for c in coordinator.cell_configs],
        coordinator.update_interval.total_seconds(),
        conf.get("observer_mode", True),
    )
    return True


async def _async_reload(hass: HomeAssistant, entry: ConfigEntry) -> None:
    coordinator = hass.data.get(DOMAIN)
    if coordinator is not None and getattr(coordinator, "suppress_reload", False):
        # Live-tunable write from our own entities/service — already applied
        # on the coordinator; skip the disruptive full reload.
        coordinator.suppress_reload = False
        return
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    coordinator = hass.data.get(DOMAIN)
    if coordinator is not None:
        # Persist the cost accumulators on clean unload/restart.
        await coordinator._acct_store.async_save(coordinator.accounting.as_state())
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        hass.data.pop(DOMAIN, None)
        if hass.services.has_service(DOMAIN, SERVICE_GENERATE_DASHBOARD):
            hass.services.async_remove(DOMAIN, SERVICE_GENERATE_DASHBOARD)
    return unloaded
