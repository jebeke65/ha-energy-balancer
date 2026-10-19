"""Frontend wiring: serve the cards, load them, answer the dashboard strategy.

* The built cards are served straight from the integration folder
  (`async_register_static_paths`), nothing is copied into www/.
* They are loaded on every frontend page with `add_extra_js_url`, so no Lovelace
  resource entry is needed. A content hash in the URL makes browsers pick up a
  new bundle after an upgrade.
* `energy_balancer/dashboard` returns the views for the dashboard strategy
  (`strategy: type: custom:energy-balancer`, see dashboard/card/src/strategy/).
* Version 0.1.0 registered the cards as Lovelace resources under
  /local/energy_balancer/. Those two resources are ours; they are removed once,
  through Home Assistant's resources collection, so the cards do not load twice.
"""

from __future__ import annotations

import hashlib
import logging
import os

import voluptuous as vol

from homeassistant.components import frontend, websocket_api
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)

STATIC_URL = f"/{DOMAIN}_static"
CARD_DIR = os.path.join(os.path.dirname(__file__), "dashboard", "card", "dist")
CARD_FILES = ("eb-cards.js", "eb-chain-card-r2.js")
LEGACY_RESOURCE_PREFIX = "/local/energy_balancer/"

_DATA_FRONTEND = f"{DOMAIN}_frontend_registered"


def _hash_files_sync() -> dict:
    out = {}
    for name in CARD_FILES:
        try:
            with open(os.path.join(CARD_DIR, name), "rb") as fh:
                out[name] = hashlib.sha1(fh.read()).hexdigest()[:8]
        except OSError:
            _LOGGER.warning("Bundled card missing from the integration: %s", name)
    return out


async def async_setup_frontend(hass: HomeAssistant) -> None:
    """Register static path, card modules and the websocket command — once."""
    if hass.data.get(_DATA_FRONTEND):
        return
    hass.data[_DATA_FRONTEND] = True

    await hass.http.async_register_static_paths(
        [StaticPathConfig(STATIC_URL, CARD_DIR, cache_headers=True)])
    for name, digest in (await hass.async_add_executor_job(_hash_files_sync)).items():
        frontend.add_extra_js_url(hass, f"{STATIC_URL}/{name}?v={digest}")

    websocket_api.async_register_command(hass, ws_dashboard)

    try:
        await _async_remove_legacy_resources(hass)
    except Exception as err:  # noqa: BLE001 — never block setup on a cleanup
        _LOGGER.warning("Could not remove the old Energy Balancer card resources: %s", err)


def _resources(hass: HomeAssistant):
    data = hass.data.get("lovelace")
    if isinstance(data, dict):                       # HA < 2025.2
        return data.get("resources")
    return getattr(data, "resources", None)


async def _async_remove_legacy_resources(hass: HomeAssistant) -> None:
    res = _resources(hass)
    if res is None or not hasattr(res, "async_delete_item"):
        return                                       # YAML resource mode: read-only
    await res.async_get_info()                       # makes sure the collection is loaded
    for item in list(res.async_items()):
        url = str(item.get("url", ""))
        if url.startswith(LEGACY_RESOURCE_PREFIX):
            await res.async_delete_item(item["id"])
            _LOGGER.info("Removed old Energy Balancer card resource %s "
                         "(the cards are now served by the integration)", url)


@websocket_api.websocket_command({vol.Required("type"): f"{DOMAIN}/dashboard"})
@websocket_api.async_response
async def ws_dashboard(hass: HomeAssistant, connection, msg: dict) -> None:
    """Views for the Energy Balancer dashboard strategy."""
    from .dashboard_gen import async_build_views

    coordinator = hass.data.get(DOMAIN)
    if coordinator is None:
        connection.send_error(msg["id"], "not_loaded", "Energy Balancer is not set up")
        return
    views = await async_build_views(hass, coordinator)
    connection.send_result(msg["id"], {"views": views})
