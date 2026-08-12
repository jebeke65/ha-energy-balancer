"""Energy Balancer dashboard generator (ported from SEM).

Loads the EB dashboard template (adapted from SEM's sem_dashboard_template.yaml,
ported to the eb- card namespace) and registers it via Home Assistant's own
Lovelace storage — the exact mechanism SEM uses:

  * live path: hass.data["lovelace"].dashboards[path].async_save(...) -> writes
    storage + refreshes the in-memory cache + fires lovelace_updated (no restart);
  * first-install fallback: Store write of the config + a lovelace_dashboards
    registration entry (one restart surfaces it, then live forever after).

The ported SEM card bundle (eb-cards.js) is registered as a Lovelace resource
with a content-hash cache-bust, also like SEM.
"""

from __future__ import annotations

import hashlib
import logging
import os
import uuid

import yaml

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import ENTITY_PREFIX

_LOGGER = logging.getLogger(__name__)

CARD_BUNDLE_URL = "/local/energy_balancer/eb-cards.js"
CARD_BUNDLE_FILE = "www/energy_balancer/eb-cards.js"
CHAIN_CARD_URL = "/local/energy_balancer/eb-chain-card-r2.js"
CHAIN_CARD_FILE = "www/energy_balancer/eb-chain-card-r2.js"
TEMPLATE_FILE = os.path.join(os.path.dirname(__file__), "dashboard", "eb_dashboard_template.yaml")

CELL_NAMES = {"solar": "SOLAR", "house": "HOME", "car_charger": "CAR CHARGER",
              "goodwe": "GOODWE", "marstek": "MARSTEK", "net": "NET"}


def _chain_cells(coordinator) -> list:
    """Chain-card cells: solar, house, <steerable pooled by position>, net."""
    def nm(cid):
        return CELL_NAMES.get(cid, cid.upper())
    steer = sorted(coordinator.cell_configs, key=lambda c: c.position)
    cells = [{"id": "solar", "name": nm("solar")}, {"id": "house", "name": nm("house")}]
    i = 0
    while i < len(steer):
        j = i + 1
        while j < len(steer) and steer[j].position == steer[i].position:
            j += 1
        group = steer[i:j]
        if len(group) > 1:
            cells.append([{"id": c.id, "name": nm(c.id)} for c in group])
        else:
            cells.append({"id": group[0].id, "name": nm(group[0].id)})
        i = j
    cells.append({"id": "net", "name": nm("net")})
    return cells


_KIND_COLOR = {
    "solar": "#ff9800", "house": "#ff4444", "grid": "#488fc2",
    "house_battery": "#4db6ac", "car_charger": "#8DC892",
}


def _chart_series(coordinator) -> list:
    """One chart series per cell/tier — pooled exactly like build_layers, using
    the layer sensors (measured, pooled power). Fully dynamic from the config."""
    chain = [("solar", 0, "solar"), ("house", 1, "house")]
    chain += [(c.id, c.position, c.type) for c in
              sorted(coordinator.cell_configs, key=lambda c: c.position)]
    chain += [("net", 99, "grid")]

    groups: dict = {}
    order: list = []
    for cid, pos, kind in chain:
        key = (pos, kind)
        if key not in groups:
            groups[key] = []
            order.append(key)
        groups[key].append(cid)

    series = []
    for (pos, kind) in sorted(order):
        ids = groups[(pos, kind)]
        lid = "_".join(ids)
        series.append({
            "entity": f"sensor.{ENTITY_PREFIX}_layer_{lid}",
            "name": "+".join(CELL_NAMES.get(i, i.upper()) for i in ids),
            "color": _KIND_COLOR.get(kind, "#42A5F5"),
            "type": "area",
        })
    return series


def _inject_chart_series(views: list, coordinator) -> None:
    """Fill series of any eb-chart-card flagged chart_cells from the config."""
    series = _chart_series(coordinator)

    def walk(cards):
        for card in cards:
            if not isinstance(card, dict):
                continue
            if card.get("type") == "custom:eb-chart-card" and card.pop("chart_cells", False):
                card["series"] = series
            if isinstance(card.get("cards"), list):
                walk(card["cards"])

    for view in views:
        if isinstance(view.get("cards"), list):
            walk(view["cards"])


def _inject_chain_cells(views: list, coordinator) -> None:
    """Fill the cells array of any eb-chain-card that doesn't define one."""
    cells = _chain_cells(coordinator)

    def walk(cards):
        for card in cards:
            if not isinstance(card, dict):
                continue
            if card.get("type") == "custom:eb-chain-card" and not card.get("cells"):
                card["cells"] = cells
            if isinstance(card.get("cards"), list):
                walk(card["cards"])

    for view in views:
        if isinstance(view.get("cards"), list):
            walk(view["cards"])


def _config_pools(coordinator) -> list:
    """Storage pools for the config card: SoC layers with >1 member.

    Mirrors build_layers' stable id scheme — the first pooled storage
    layer is "home_battery"; any further one gets a position suffix.
    The pool-level SoC targets live on number.eb_<pool>_*_min_soc.
    """
    groups: dict = {}
    for c in sorted(coordinator.cell_configs, key=lambda c: c.position):
        groups.setdefault((c.position, c.type or c.mode), []).append(c)
    pools = []
    used = False
    for (position, _kind) in sorted(groups):
        members = groups[(position, _kind)]
        if len(members) > 1 and any(c.has_soc for c in members):
            pid = "home_battery" if not used else f"home_battery_p{position}"
            used = True
            pools.append({"id": pid, "members": [c.id for c in members]})
    return pools


def _inject_config_cells(views: list, coordinator) -> None:
    """Fill the cells + pools lists of any eb-config-card that doesn't
    define them.

    Same pattern as the chain-card injection: cells = [{id, type}] from
    the coordinator's cell configs in chain order; pools = [{id, members}]
    for pooled storage layers (see _config_pools).
    """
    cells = [{"id": c.id, "type": c.type}
             for c in sorted(coordinator.cell_configs, key=lambda c: c.position)]
    pools = _config_pools(coordinator)

    def walk(cards):
        for card in cards:
            if not isinstance(card, dict):
                continue
            if card.get("type") == "custom:eb-config-card":
                if not card.get("cells"):
                    card["cells"] = cells
                if not card.get("pools"):
                    card["pools"] = pools
            if isinstance(card.get("cards"), list):
                walk(card["cards"])
            if isinstance(card.get("card"), dict):  # conditional-style wrappers
                walk([card["card"]])

    for view in views:
        if isinstance(view.get("cards"), list):
            walk(view["cards"])


def _apply_entity_prefix(views: list, prefix: str) -> None:
    """Point every custom:eb-* card at the live entity prefix.

    The ported SEM cards default to 'sensor.ebi_'; the integration
    publishes 'sensor.eb_*'. Set entity_prefix on each eb- card unless
    the template already pins one.
    """
    def walk(cards):
        for card in cards:
            if not isinstance(card, dict):
                continue
            ctype = card.get("type", "")
            if (isinstance(ctype, str) and ctype.startswith("custom:eb-")
                    and not card.get("entity_prefix")):
                card["entity_prefix"] = prefix
            if isinstance(card.get("cards"), list):
                walk(card["cards"])
            if isinstance(card.get("card"), dict):  # conditional-style wrappers
                walk([card["card"]])

    for view in views:
        if isinstance(view.get("cards"), list):
            walk(view["cards"])


def _load_template_sync() -> dict:
    with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def _bundle_version_sync(path: str) -> str:
    try:
        with open(path, "rb") as f:
            return hashlib.sha1(f.read()).hexdigest()[:8]
    except OSError:
        return "0"


def _pick_weather_entity(hass: HomeAssistant):
    """Best available weather.* entity (prefers one with a forecast/temperature)."""
    best = None
    for st in hass.states.async_all("weather"):
        if st.state in ("unavailable", "unknown"):
            continue
        if st.attributes.get("temperature") is not None:
            return st.entity_id
        best = best or st.entity_id
    return best


def _apply_weather(views: list, weather_entity) -> None:
    """Set the weather card's entity, or drop the card if no weather entity."""
    def walk(cards):
        out = []
        for card in cards:
            if isinstance(card, dict) and card.get("type") == "custom:eb-weather-card":
                if not weather_entity:
                    continue  # drop the card
                card = {**card, "entity": weather_entity}
            if isinstance(card, dict) and isinstance(card.get("cards"), list):
                card = {**card, "cards": walk(card["cards"])}
            out.append(card)
        return out

    for view in views:
        if isinstance(view.get("cards"), list):
            view["cards"] = walk(view["cards"])


async def _register_resource(hass: HomeAssistant, base_url: str, version: str) -> None:
    """Ensure base_url is a Lovelace resource with the current cache-bust + an id."""
    store = Store(hass, 1, "lovelace_resources")
    data = await store.async_load() or {"items": []}
    data.setdefault("items", [])
    target = f"{base_url}?v={version}"
    for item in data["items"]:
        if item.get("url", "").split("?")[0] == base_url:
            changed = False
            if not item.get("id"):  # HA's resource collection indexes by id
                item["id"] = uuid.uuid4().hex
                changed = True
            if item.get("url") != target:
                item["url"] = target
                changed = True
            if changed:
                await store.async_save(data)
            return
    data["items"].append({"id": uuid.uuid4().hex, "type": "module", "url": target})
    await store.async_save(data)
    _LOGGER.info("Registered Lovelace resource %s", target)


async def async_generate_dashboard(
    hass: HomeAssistant, coordinator, *,
    title: str = "EB (integratie)", path: str = "ebi-dashboard",
    icon: str = "mdi:scale-balance",
) -> bool:
    """Generate + register the EB dashboard. Returns True if it reloaded live."""
    bundle_v = await hass.async_add_executor_job(
        _bundle_version_sync, hass.config.path(CARD_BUNDLE_FILE))
    chain_v = await hass.async_add_executor_job(
        _bundle_version_sync, hass.config.path(CHAIN_CARD_FILE))
    await _register_resource(hass, CARD_BUNDLE_URL, bundle_v)
    await _register_resource(hass, CHAIN_CARD_URL, chain_v)

    template = await hass.async_add_executor_job(_load_template_sync)
    views = template.get("views", [])
    _apply_weather(views, _pick_weather_entity(hass))
    _inject_chain_cells(views, coordinator)
    _inject_chart_series(views, coordinator)
    _inject_config_cells(views, coordinator)
    _apply_entity_prefix(views, f"sensor.{ENTITY_PREFIX}_")

    config_payload = {"views": views}
    storage_key = f"lovelace.{path}"

    # --- Live path: dashboard already registered -> save through HA's cache ---
    reloaded_live = False
    try:
        ll_data = hass.data.get("lovelace")
        dashboards = getattr(ll_data, "dashboards", None)
        if dashboards is None and isinstance(ll_data, dict):
            dashboards = ll_data.get("dashboards")
        live_dash = dashboards.get(path) if isinstance(dashboards, dict) else None
        if live_dash is not None and hasattr(live_dash, "async_save"):
            await live_dash.async_save(config_payload)
            reloaded_live = True
            _LOGGER.info("EB dashboard '%s' reloaded live (%d views)", path, len(views))
    except Exception as err:  # noqa: BLE001
        _LOGGER.warning("EB dashboard live reload failed, writing storage: %s", err)

    # --- First-install fallback: write config storage directly ---
    if not reloaded_live:
        await Store(hass, 1, storage_key).async_save({"config": config_payload})
        _LOGGER.info(
            "EB dashboard config written to .storage/%s (%d views) — restart to surface",
            storage_key, len(views),
        )

    # --- Register in lovelace_dashboards (idempotent) ---
    dstore = Store(hass, 1, "lovelace_dashboards")
    ddata = await dstore.async_load() or {"items": []}
    ddata.setdefault("items", [])
    exists = False
    for item in ddata["items"]:
        if item.get("id") == path or item.get("url_path") == path:
            item.update({"mode": "storage", "title": title, "icon": icon,
                         "show_in_sidebar": True, "require_admin": False,
                         "url_path": path})
            exists = True
            break
    if not exists:
        ddata["items"].append({
            "id": path, "mode": "storage", "title": title, "icon": icon,
            "show_in_sidebar": True, "require_admin": False, "url_path": path,
        })
    await dstore.async_save(ddata)

    return reloaded_live
