"""The dashboard: built from the configuration, created without touching storage.

What a HACS review asked for, pinned:

* the views contain nothing of one particular installation — no cell names,
  helpers or sensors that only exist on the machine the template came from;
* no card calls services of another integration (SEM's load-priority card and
  diagnose button are gone, and so is the CDN download of Chart.js);
* generate_dashboard creates a dashboard through Home Assistant's dashboards
  collection with only the strategy in it, and refuses a path that is taken by
  anything it did not create;
* the 0.1.0 card resources under /local/energy_balancer/ are removed, and only
  those.
"""

import json
import os
import sys
import types

sys.path.insert(0, os.path.dirname(__file__))

from ha_stub import FakeHass, PKG_DIR, load_eb  # noqa: E402

dash = load_eb("dashboard_gen")
front = load_eb("frontend")
core = load_eb("core")
exc = sys.modules["homeassistant.exceptions"]

# An installation that is deliberately NOT the one the template was written on.
# ("car_charger" as a cell TYPE is generic; "eb_car_charger" as an entity is not.)
CELLS = [
    core.CellConfig(id="ev", position=1, mode="surplus", type="car_charger"),
    core.CellConfig(id="batt_a", position=2, mode="balanced", type="house_battery", has_soc=True),
    core.CellConfig(id="batt_b", position=2, mode="balanced", type="house_battery", has_soc=True),
]
FOREIGN = ("goodwe", "marstek", "eb_car_charger", "layer_car_charger", "car_connected", "car_charge_mode",
           "solar_production", "grid_active_power", "house_consumption_without",
           "solar_forecast_remaining", "ebi-dashboard")


def run(coro):
    """Drive a coroutine that never waits on I/O (no asyncio: in the flat test
    directory EB's own select.py shadows the stdlib module asyncio needs)."""
    try:
        coro.send(None)
    except StopIteration as stop:
        return stop.value
    raise AssertionError("coroutine suspended")


class Hass(FakeHass):
    async def async_add_executor_job(self, fn, *args):
        return fn(*args)


def _coordinator(cells=CELLS):
    return types.SimpleNamespace(
        cell_configs=list(cells),
        cell_io={"ev": {"connected_sensor": "binary_sensor.ev_plugged",
                        "charging_sensor": "binary_sensor.ev_charging",
                        "charge_mode_entity": None}},
        solar_sensor="sensor.pv_w", house_sensor="sensor.home_w",
        grid_sensor="sensor.meter_w", forecast_sensor="sensor.pv_left_kwh",
    )


def _hass():
    h = Hass()
    for eid in ("sensor.pv_w", "sensor.home_w", "sensor.meter_w", "sensor.pv_left_kwh",
                "binary_sensor.ev_plugged", "binary_sensor.ev_charging",
                "sensor.eb_ev", "number.eb_ev_take", "number.eb_batt_a_take",
                "sensor.eb_layer_ev", "sensor.eb_layer_home_battery", "sensor.eb_layer_net"):
        h.states.set(eid, "0")
    return h


def _views(hass=None, coordinator=None):
    return run(dash.async_build_views(hass or _hass(), coordinator or _coordinator()))


def _cards(views):
    out = []

    def walk(cards):
        for c in cards:
            if isinstance(c, dict):
                out.append(c)
                walk(c.get("cards") or [])
    for v in views:
        walk(v.get("cards") or [])
    return out


# ------------------------------------------------------------------ views
def test_views_carry_nothing_of_another_installation():
    text = json.dumps(_views())
    for word in FOREIGN:
        assert word not in text, word


def test_no_template_markers_survive():
    text = json.dumps(_views())
    assert "eb_fill" not in text and "eb_requires" not in text and "chart_cells" not in text


def test_no_sem_service_cards():
    types_ = {c.get("type") for c in _cards(_views())}
    assert "custom:eb-load-priority-card" not in types_
    assert "custom:eb-diagnose-button" not in types_


def test_car_entities_come_from_the_car_cell():
    ev = next(v for v in _views() if v.get("path") == "ev")
    ents = [e["entity"] for c in _cards([ev]) if c.get("type") == "entities" for e in c["entities"]]
    assert "binary_sensor.ev_plugged" in ents and "binary_sensor.ev_charging" in ents
    assert "sensor.eb_ev" in ents and "number.eb_ev_take" in ents


def test_no_car_cell_no_ev_view():
    views = _views(coordinator=_coordinator([c for c in CELLS if c.type != "car_charger"]))
    assert all(v.get("path") != "ev" for v in views)


def test_take_sliders_only_for_entities_that_exist():
    control = next(v for v in _views() if v.get("path") == "control")
    sliders = next(c for c in _cards([control]) if c.get("title") == "Control — take %")
    assert [e["entity"] for e in sliders["entities"]] == ["number.eb_ev_take", "number.eb_batt_a_take"]


def test_pool_chart_series_uses_the_published_layer_id():
    series = dash._chart_series(_coordinator())
    ids = [s["entity"] for s in series]
    assert "sensor.eb_layer_home_battery" in ids
    assert "sensor.eb_layer_batt_a_batt_b" not in ids


def test_system_sensors_are_the_configured_ones():
    cfg = next(v for v in _views() if v.get("path") == "config")
    sys_card = next(c for c in _cards([cfg]) if c.get("title") == "System sensors (live)")
    assert [e["entity"] for e in sys_card["entities"]] == [
        "sensor.pv_w", "sensor.home_w", "sensor.meter_w", "sensor.pv_left_kwh"]


def test_every_eb_card_gets_the_prefix():
    for c in _cards(_views()):
        if str(c.get("type", "")).startswith("custom:eb-"):
            assert c.get("entity_prefix") == "sensor.eb_", c.get("type")


# ------------------------------------------------- dashboard creation
class FakeDashboard:
    def __init__(self, config=None, mode="storage"):
        self.mode = mode
        self.config = config
        self.saved = None

    async def async_load(self, force):
        if self.config is None:
            raise RuntimeError("ConfigNotFound")
        return self.config

    async def async_save(self, config):
        self.saved = config


class FakeCollection:
    def __init__(self, dashboards):
        self.created = []
        self._dashboards = dashboards

    async def async_create_item(self, data):
        self.created.append(data)
        self._dashboards[data["url_path"]] = FakeDashboard()
        return data


def _hass_with_lovelace(existing=None, panels=None):
    h = _hass()
    dashboards = dict(existing or {})
    coll = FakeCollection(dashboards)

    class WS:                      # the bound list handler holds the collection
        storage_collection = coll

        def ws_list_item(self, *a):
            pass

    h.data["lovelace"] = types.SimpleNamespace(dashboards=dashboards, resources=None)
    h.data["websocket_api"] = {"lovelace/dashboards/list": (WS().ws_list_item, None)}
    h.data["frontend_panels"] = dict(panels or {})
    return h, coll, dashboards


def _gen(h, path="energy-balancer"):
    return run(dash.async_generate_dashboard(h, title="EB", path=path))


def test_creates_through_the_collection_with_only_the_strategy():
    h, coll, dashboards = _hass_with_lovelace()
    assert _gen(h) == "created"
    assert coll.created[0]["url_path"] == "energy-balancer"
    assert dashboards["energy-balancer"].saved == {"strategy": {"type": "custom:energy-balancer"}}


def test_refuses_a_dashboard_it_did_not_create():
    other = FakeDashboard({"views": [{"title": "mine"}]})
    h, coll, _ = _hass_with_lovelace({"energy-balancer": other})
    try:
        _gen(h)
        raise AssertionError("should have refused")
    except exc.ServiceValidationError:
        pass
    assert other.saved is None and coll.created == []


def test_refuses_a_yaml_dashboard_on_the_path():
    h, coll, _ = _hass_with_lovelace({"energy-balancer": FakeDashboard({}, mode="yaml")})
    try:
        _gen(h)
        raise AssertionError("should have refused")
    except exc.ServiceValidationError:
        pass


def test_refuses_a_path_used_by_another_panel():
    h, coll, _ = _hass_with_lovelace(panels={"energy-balancer": object()})
    try:
        _gen(h)
        raise AssertionError("should have refused")
    except exc.ServiceValidationError:
        pass
    assert coll.created == []


def test_own_dashboard_is_left_alone():
    ours = FakeDashboard({"strategy": {"type": "custom:energy-balancer"}})
    h, coll, _ = _hass_with_lovelace({"energy-balancer": ours})
    assert _gen(h) == "exists"
    assert ours.saved is None and coll.created == []


def test_no_collection_gives_a_clear_error():
    h, _, _ = _hass_with_lovelace()
    h.data["websocket_api"] = {}
    try:
        _gen(h)
        raise AssertionError("should have raised")
    except exc.HomeAssistantError as err:
        assert "custom:energy-balancer" in str(err)


def test_old_dict_layout_is_supported():
    h = _hass()
    coll = FakeCollection({})
    h.data["lovelace"] = {"dashboards": coll._dashboards, "dashboards_collection": coll}
    assert dash._dashboards_collection(h) is coll


# ------------------------------------------------------- legacy resources
class FakeResources:
    def __init__(self, items):
        self.items = list(items)
        self.deleted = []

    async def async_get_info(self):
        return {}

    def async_items(self):
        return list(self.items)

    async def async_delete_item(self, item_id):
        self.deleted.append(item_id)
        self.items = [i for i in self.items if i["id"] != item_id]


def test_only_our_old_resources_are_removed():
    res = FakeResources([
        {"id": "a", "url": "/local/energy_balancer/eb-cards.js?v=1", "type": "module"},
        {"id": "b", "url": "/local/energy_balancer/eb-chain-card-r2.js?v=2", "type": "module"},
        {"id": "c", "url": "/hacsfiles/mini-graph-card/mini-graph-card-bundle.js", "type": "module"},
        {"id": "d", "url": "/local/my_energy_balancer_fork/x.js", "type": "module"},
    ])
    h = _hass()
    h.data["lovelace"] = types.SimpleNamespace(dashboards={}, resources=res)
    run(front._async_remove_legacy_resources(h))
    assert res.deleted == ["a", "b"]


def test_yaml_resources_are_not_touched():
    class YamlResources:
        def async_items(self):
            return [{"id": "a", "url": "/local/energy_balancer/eb-cards.js"}]
    h = _hass()
    h.data["lovelace"] = types.SimpleNamespace(dashboards={}, resources=YamlResources())
    run(front._async_remove_legacy_resources(h))   # must not raise


# ------------------------------------------------------------- the bundle
def _bundle():
    with open(os.path.join(PKG_DIR, "dashboard", "card", "dist", "eb-cards.js"), encoding="utf-8") as fh:
        return fh.read()


def test_bundle_downloads_nothing_at_runtime():
    b = _bundle()
    assert "cdn.jsdelivr.net" not in b and "unpkg.com" not in b


def test_bundle_calls_no_sem_services():
    assert "solar_energy_management" not in _bundle()


def test_bundle_defines_the_strategy_and_keeps_the_notice():
    b = _bundle()
    assert "ll-strategy-dashboard-energy-balancer" in b
    assert b.startswith("/*! Energy Balancer cards.") and "belinea4071" in b.splitlines()[0]


# --------------------------------------------------------------- naming
def test_labels_read_as_words_but_the_chain_card_keeps_capitals():
    control = next(v for v in _views() if v.get("path") == "control")
    sliders = next(c for c in _cards([control]) if c.get("title") == "Control — take %")
    assert [e["name"] for e in sliders["entities"]] == ["Ev %", "Batt a %"]
    chain = dash._chain_cells(_coordinator())
    assert chain[0]["name"] == "SOLAR" and chain[1]["name"] == "HOME"
    assert chain[-1]["name"] == "NET"
    assert [c["name"] for c in chain[3]] == ["BATT A", "BATT B"]
