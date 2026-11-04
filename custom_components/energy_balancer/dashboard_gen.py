"""Energy Balancer dashboard: views built from the live configuration.

Portions derived from SEM (https://github.com/traktore-org/sem-community), MIT License, Copyright (c) 2025 belinea4071. See NOTICE.

The dashboard is a Lovelace *strategy*. Its stored configuration is one line,

    strategy:
      type: custom:energy-balancer

and the frontend asks for the views every time it opens the dashboard, through
the `energy_balancer/dashboard` websocket command (frontend.py). The views come
from the template in dashboard/eb_dashboard_template.yaml, adapted from SEM's
dashboard template, with every installation-specific part filled in here from
the configuration: the chain, the chart series, the pools, the car charger's
own entities, the take-% sliders and the system sensors.

`async_generate_dashboard` creates such a dashboard through Home Assistant's own
dashboards collection. It never writes Lovelace storage files itself, and it
never touches a dashboard it did not create: a path that is already in use by
anything else is refused.
"""

from __future__ import annotations

import copy
import logging
import os

import yaml

from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError, ServiceValidationError

from .const import ENTITY_PREFIX
from .naming import cell_prefix, entity_id, slug

_LOGGER = logging.getLogger(__name__)

TEMPLATE_FILE = os.path.join(os.path.dirname(__file__), "dashboard", "eb_dashboard_template.yaml")

STRATEGY_TYPE = "custom:energy-balancer"
STRATEGY_CONFIG = {"strategy": {"type": STRATEGY_TYPE}}

# Display names for the structural cells; any other cell is named after its id.
CELL_NAMES = {"solar": "Solar", "house": "Home", "net": "Net"}

_KIND_COLOR = {
    "solar": "#ff9800", "house": "#ff4444", "grid": "#488fc2",
    "house_battery": "#4db6ac", "car_charger": "#8DC892",
}


def _name(cid: str) -> str:
    """'car_charger' -> 'Car charger'."""
    return CELL_NAMES.get(cid, cid.replace("_", " ").capitalize())


def _chain_name(cid: str) -> str:
    """The chain card shows its cells in capitals: 'CAR CHARGER'."""
    return _name(cid).upper()


def _steerable(coordinator) -> list:
    return sorted(coordinator.cell_configs, key=lambda c: c.position)


# ------------------------------------------------------------------ layers
def _layer_groups(coordinator) -> list:
    """(layer id, member ids, kind) in chain order — the same ids build_layers
    publishes as sensor.eb_<id>_layer (naming.py).

    Cells at the same position and of the same type form one layer. A layer of
    several cells of which at least one has a SoC is a storage pool, with the
    stable id "home_battery" (a second pool gets a position suffix); every
    other layer is named after its members.
    """
    chain = [("solar", 0, "solar", False), ("house", 1, "house", False)]
    chain += [(c.id, c.position, c.type or c.mode, c.has_soc) for c in _steerable(coordinator)]
    chain += [("net", 99, "grid", False)]

    groups: dict = {}
    for cid, pos, kind, has_soc in chain:
        groups.setdefault((pos, kind), []).append((cid, has_soc))

    out = []
    pool_used = False
    for (pos, kind) in sorted(groups):
        members = groups[(pos, kind)]
        ids = [m[0] for m in members]
        if len(members) > 1 and any(m[1] for m in members):
            lid = "home_battery" if not pool_used else f"home_battery_p{pos}"
            pool_used = True
        else:
            lid = "_".join(ids)
        out.append((lid, ids, kind))
    return out


def _chain_cells(coordinator) -> list:
    """Chain-card cells: solar, house, <steerable pooled by position>, net."""
    steer = _steerable(coordinator)
    # Each cell carries its own entities (naming.py), so the card never builds
    # an id from the cell id: the cell sensor, what it hands on (rest_out /
    # forecast_out, a tier's being the layer's) and the headroom it gets from
    # the next block (that block's headroom_out; the grid cell's ceiling).
    # A tier also carries its layer.
    layer_of = {m: lid for lid, ids, _kind in _layer_groups(coordinator) for m in ids}
    peak = entity_id("sensor", "net", "peak_limit")

    def cell(cid, block_prefix=None):
        p = block_prefix or cell_prefix(coordinator, cid)
        out = {"id": cid, "name": _chain_name(cid),
               "entity": entity_id("sensor", cell_prefix(coordinator, cid), "cell")}
        if cid != "net":
            out["rest_out"] = entity_id("sensor", p, "rest_out")
            out["forecast_out"] = entity_id("sensor", p, "forecast_out")
            out["headroom_out"] = entity_id("sensor", p, "headroom_out")
        return out

    cells = [cell("solar"), cell("house")]
    i = 0
    while i < len(steer):
        j = i + 1
        while j < len(steer) and steer[j].position == steer[i].position:
            j += 1
        group = steer[i:j]
        if len(group) > 1:
            lp = slug(layer_of.get(group[0].id, group[0].id))
            layer = entity_id("sensor", lp, "layer")
            cells.append([{**cell(c.id, lp), "layer": layer} for c in group])
        else:
            cells.append(cell(group[0].id))
        i = j
    cells.append(cell("net"))

    def first(row):
        return row[0] if isinstance(row, list) else row

    for row, nxt in zip(cells, cells[1:]):
        hd = first(nxt).get("headroom_out", peak)
        for c in (row if isinstance(row, list) else [row]):
            c["headroom"] = hd
    return cells


def _chart_series(coordinator) -> list:
    """One chart series per layer, using the layer sensors (measured, pooled)."""
    return [{
        "entity": entity_id("sensor", slug(lid), "layer"),
        "name": "+".join(_name(i) for i in ids),
        "color": _KIND_COLOR.get(kind, "#42A5F5"),
        "type": "area",
    } for lid, ids, kind in _layer_groups(coordinator)]


def _config_pools(coordinator) -> list:
    """Storage pools for the config card. The pool-level SoC targets live on
    number.eb_<pool>_*_min_soc (naming.py)."""
    return [{"id": lid, "members": ids}
            for lid, ids, _kind in _layer_groups(coordinator)
            if lid.startswith("home_battery")]


# ------------------------------------------------------- template filling
def _walk(views: list, fn) -> None:
    """Apply fn to every card dict, nested stacks and wrappers included."""
    def walk(cards):
        for card in cards:
            if not isinstance(card, dict):
                continue
            fn(card)
            if isinstance(card.get("cards"), list):
                walk(card["cards"])
            if isinstance(card.get("card"), dict):  # conditional-style wrappers
                walk([card["card"]])

    for view in views:
        if isinstance(view.get("cards"), list):
            walk(view["cards"])


def _exists(hass: HomeAssistant, entity_id) -> bool:
    return bool(entity_id) and hass.states.get(entity_id) is not None


def _car_cells(coordinator) -> list:
    return [c for c in _steerable(coordinator) if c.type == "car_charger"]


def _car_entities(hass: HomeAssistant, coordinator) -> list:
    rows = []
    for c in _car_cells(coordinator):
        io = coordinator.cell_io.get(c.id, {})
        p = cell_prefix(coordinator, c.id)
        candidates = [
            (entity_id("sensor", p, "cell"), f"{_name(c.id)} (EB power)"),
            (entity_id("sensor", slug(c.id), "layer"), "Charging power"),
            (entity_id("number", p, "take"), "Take %"),
            (entity_id("select", p, "mode"), "Charge mode (EB)"),
            (io.get("connected_sensor"), "Connected"),
            (io.get("charging_sensor"), "Charging"),
            (io.get("charge_mode_entity"), "Charge mode"),
        ]
        seen = set()
        for eid, name in candidates:
            if isinstance(eid, str) and eid not in seen and _exists(hass, eid):
                seen.add(eid)
                rows.append({"entity": eid, "name": name})
    return rows


def _car_series(coordinator) -> list:
    car_ids = {c.id for c in _car_cells(coordinator)}
    return [{
        "entity": entity_id("sensor", slug(lid), "layer"),
        "name": "+".join(_name(i) for i in ids),
        "color": _KIND_COLOR["car_charger"],
        "type": "area",
    } for lid, ids, _kind in _layer_groups(coordinator) if set(ids) & car_ids]


def _take_sliders(hass: HomeAssistant, coordinator) -> list:
    takes = [(entity_id("number", cell_prefix(coordinator, c.id), "take"), c.id)
             for c in _steerable(coordinator)]
    return [{"entity": e, "name": f"{_name(cid)} %"}
            for e, cid in takes if _exists(hass, e)]


def _system_sensors(hass: HomeAssistant, coordinator) -> list:
    rows = [
        (coordinator.solar_sensor, "Solar"),
        (coordinator.house_sensor, "House"),
        (coordinator.grid_sensor, "Grid"),
        (getattr(coordinator, "forecast_sensor", None), "Forecast today"),
    ]
    return [{"entity": e, "name": n} for e, n in rows if _exists(hass, e)]


def _layer_entities(hass: HomeAssistant) -> list:
    prefix = f"sensor.{ENTITY_PREFIX}_"
    return sorted(e for e in hass.states.async_entity_ids("sensor")
                  if e.startswith(prefix) and e.endswith("_layer"))


def _cell_rows(coordinator, cell_ids: list) -> list:
    """(label, cell entity, rest_out entity) per cell; a tier member's rest_out
    is its layer's, the grid cell hands nothing on."""
    layer_of = {m: lid for lid, ids, _kind in _layer_groups(coordinator)
                if len(ids) > 1 for m in ids}
    rows = []
    for c in cell_ids:
        p = cell_prefix(coordinator, c)
        rest = "" if c == "net" else entity_id(
            "sensor", slug(layer_of[c]) if c in layer_of else p, "rest_out")
        rows.append((c, entity_id("sensor", p, "cell"), rest))
    return rows


def _cell_loop_markdown(rows: list, line: str) -> str:
    """rows: (label, cell entity, rest_out entity or '') — full ids, never built
    from a cell id inside the template (naming.py decides the names)."""
    items = ", ".join(f"('{c}', '{e}', '{r}')" for c, e, r in rows)
    return (f"{{% for c, e, r in [{items}] -%}}\n"
            f"{line}\n"
            "{% endfor -%}\n")


_ACTUATOR_LINE = ("- **{{ c }}**: {{ state_attr(e,'actuator_action') }} → "
                  "{{ state_attr(e,'actuator_setpoint') }}{{ state_attr(e,'actuator_unit') }} "
                  "(sent: {{ state_attr(e,'actuator_sent') }})")
_DIAG_LINE = ("- **{{ c }}**: {{ state_attr(e,'action') }} · {{ states(e) }} W · "
              "rest out {{ states(r) if r else '–' }} · "
              "peak {{ states('sensor.eb_net_peak_limit') }} — _{{ state_attr(e,'reason') }}_")


def _fill_placeholders(hass: HomeAssistant, views: list, coordinator) -> None:
    """Replace every `eb_fill:` marker in the template with live content."""
    steer_ids = [c.id for c in _steerable(coordinator)]
    fills = {
        "car_entities": lambda card: card.__setitem__("entities", _car_entities(hass, coordinator)),
        "car_series": lambda card: card.__setitem__("series", _car_series(coordinator)),
        "take_sliders": lambda card: card.__setitem__("entities", _take_sliders(hass, coordinator)),
        "system_sensors": lambda card: card.__setitem__("entities", _system_sensors(hass, coordinator)),
        "layers": lambda card: card.__setitem__("entities", _layer_entities(hass)),
        "actuator_markdown": lambda card: card.__setitem__(
            "content", _cell_loop_markdown(_cell_rows(coordinator, steer_ids), _ACTUATOR_LINE)),
        "diagnostics_markdown": lambda card: card.__setitem__(
            "content", _cell_loop_markdown(
                _cell_rows(coordinator, ["solar", "house", *steer_ids, "net"]), _DIAG_LINE)),
    }

    def fill(card):
        key = card.pop("eb_fill", None)
        if key is not None:
            fills[key](card)
        if card.get("type") == "custom:eb-chart-card" and card.pop("chart_cells", False):
            card["series"] = _chart_series(coordinator)
        if card.get("type") == "custom:eb-chain-card" and not card.get("cells"):
            card["cells"] = _chain_cells(coordinator)
        if card.get("type") == "custom:eb-config-card":
            card.setdefault("cells", [{"id": c.id, "type": c.type} for c in _steerable(coordinator)])
            card.setdefault("pools", _config_pools(coordinator))

    _walk(views, fill)


def _drop_empty_entity_cards(views: list) -> None:
    """An entities card that ended up with nothing to show is removed."""
    def prune(cards):
        out = []
        for card in cards:
            if isinstance(card, dict):
                if card.get("type") == "entities" and not card.get("entities"):
                    continue
                if isinstance(card.get("cards"), list):
                    card["cards"] = prune(card["cards"])
            out.append(card)
        return out

    for view in views:
        if isinstance(view.get("cards"), list):
            view["cards"] = prune(view["cards"])


def _apply_requirements(views: list, coordinator) -> list:
    """Drop views whose `eb_requires` cell type is not configured."""
    types = {c.type for c in coordinator.cell_configs}
    kept = []
    for view in views:
        need = view.pop("eb_requires", None)
        if need is None or need in types:
            kept.append(view)
    return kept


def _apply_entity_prefix(views: list, prefix: str) -> None:
    """Point every custom:eb-* card at the live entity prefix.

    The ported SEM cards default to 'sensor.ebi_'; the integration publishes
    'sensor.eb_*'. Set entity_prefix on each eb- card unless the template
    already pins one.
    """
    def fill(card):
        ctype = card.get("type", "")
        if isinstance(ctype, str) and ctype.startswith("custom:eb-") and not card.get("entity_prefix"):
            card["entity_prefix"] = prefix

    _walk(views, fill)


def _pick_weather_entity(hass: HomeAssistant):
    """Best available weather.* entity (prefers one with a temperature)."""
    best = None
    for st in hass.states.async_all("weather"):
        if st.state in ("unavailable", "unknown"):
            continue
        if st.attributes.get("temperature") is not None:
            return st.entity_id
        best = best or st.entity_id
    return best


def _apply_weather(views: list, weather_entity) -> None:
    """Set the weather card's entity, or drop the card if there is none."""
    def walk(cards):
        out = []
        for card in cards:
            if isinstance(card, dict) and card.get("type") == "custom:eb-weather-card":
                if not weather_entity:
                    continue
                card = {**card, "entity": weather_entity}
            if isinstance(card, dict) and isinstance(card.get("cards"), list):
                card = {**card, "cards": walk(card["cards"])}
            out.append(card)
        return out

    for view in views:
        if isinstance(view.get("cards"), list):
            view["cards"] = walk(view["cards"])


_TEMPLATE_CACHE: dict = {}


def _load_template_sync() -> dict:
    mtime = os.path.getmtime(TEMPLATE_FILE)
    if _TEMPLATE_CACHE.get("mtime") != mtime:
        with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
            _TEMPLATE_CACHE.update(mtime=mtime, data=yaml.safe_load(f))
    return copy.deepcopy(_TEMPLATE_CACHE["data"])


async def async_build_views(hass: HomeAssistant, coordinator) -> list:
    """The dashboard's views for this installation."""
    template = await hass.async_add_executor_job(_load_template_sync)
    views = _apply_requirements(template.get("views", []), coordinator)
    _apply_weather(views, _pick_weather_entity(hass))
    _fill_placeholders(hass, views, coordinator)
    _drop_empty_entity_cards(views)
    _apply_entity_prefix(views, f"sensor.{ENTITY_PREFIX}_")
    return views


# ------------------------------------------------------ dashboard creation
def _lovelace(hass: HomeAssistant):
    return hass.data.get("lovelace")


def _lovelace_dashboards(hass: HomeAssistant) -> dict:
    data = _lovelace(hass)
    if isinstance(data, dict):                       # HA < 2025.2
        return data.get("dashboards") or {}
    return getattr(data, "dashboards", None) or {}


def _dashboards_collection(hass: HomeAssistant):
    """Home Assistant's own dashboards collection, or None.

    Up to 2025.1 it is published in hass.data["lovelace"]. From 2025.2 it is no
    longer stored there; the only holder is the websocket handler that lists
    dashboards (`lovelace/dashboards/list`), a bound method of the collection's
    websocket wrapper. This is the collection the dashboards page itself uses.
    """
    data = _lovelace(hass)
    if isinstance(data, dict):
        return data.get("dashboards_collection")
    entry = (hass.data.get("websocket_api") or {}).get("lovelace/dashboards/list")
    handler = entry[0] if isinstance(entry, tuple) and entry else None
    ws = getattr(handler, "__self__", None)
    coll = getattr(ws, "storage_collection", None)
    return coll if hasattr(coll, "async_create_item") else None


async def _is_ours(dashboard) -> bool:
    """A dashboard is ours when its whole configuration is our strategy."""
    if getattr(dashboard, "mode", None) != "storage":
        return False
    try:
        config = await dashboard.async_load(False)
    except Exception:  # noqa: BLE001 — empty or unreadable: not ours
        return False
    return isinstance(config, dict) and config.get("strategy", {}).get("type") == STRATEGY_TYPE \
        and not config.get("views")


async def async_generate_dashboard(
    hass: HomeAssistant, *, title: str = "Energy Balancer",
    path: str = "energy-balancer", icon: str = "mdi:scale-balance",
) -> str:
    """Create the Energy Balancer dashboard at `path`.

    Returns "created" or "exists" (a dashboard of ours is already there).
    Raises ServiceValidationError when the path is taken by anything else.
    """
    dashboards = _lovelace_dashboards(hass)
    if path in dashboards:
        if await _is_ours(dashboards[path]):
            return "exists"
        raise ServiceValidationError(
            f"Dashboard path '{path}' is already in use by another dashboard. "
            "Choose another dashboard_path; Energy Balancer does not change "
            "dashboards it did not create.")
    if path in (hass.data.get("frontend_panels") or {}):
        raise ServiceValidationError(
            f"'{path}' is already in use by another panel. Choose another dashboard_path.")

    coll = _dashboards_collection(hass)
    if coll is None:
        raise HomeAssistantError(
            "Home Assistant's dashboards collection is not reachable. Create a new "
            "dashboard yourself (Settings → Dashboards → Add dashboard → New dashboard "
            "from scratch) and set its raw configuration to: "
            f"strategy: {{type: {STRATEGY_TYPE}}}")

    await coll.async_create_item({
        "url_path": path, "title": title, "icon": icon,
        "show_in_sidebar": True, "require_admin": False,
    })
    dashboard = _lovelace_dashboards(hass).get(path)
    if dashboard is None:
        raise HomeAssistantError(f"Dashboard '{path}' was created but is not loaded yet")
    await dashboard.async_save(copy.deepcopy(STRATEGY_CONFIG))
    _LOGGER.info("Created Energy Balancer dashboard '%s'", path)
    return "created"
