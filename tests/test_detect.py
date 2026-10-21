"""Auto-detection reads the Energy Dashboard through the energy integration.

What a HACS review asked for, pinned:

* the preferences come from `homeassistant.components.energy.data`'s manager,
  not from the energy integration's private storage file;
* no energy integration (or nothing configured) gives an empty result, never an
  error, so detection falls back to its heuristics;
* the manifest loads the energy integration first when it is configured.
"""

import builtins
import json
import os
import sys
import types

sys.path.insert(0, os.path.dirname(__file__))

from ha_stub import FakeHass, PKG_DIR, install_ha_stub, load_eb  # noqa: E402

install_ha_stub()

# Just enough of the entity registry for detect.py to import and walk devices.
_er = types.ModuleType("homeassistant.helpers.entity_registry")
_er.async_get = lambda hass: types.SimpleNamespace(async_get=lambda eid: None)
_er.async_entries_for_device = lambda reg, device_id: []
sys.modules["homeassistant.helpers.entity_registry"] = _er
sys.modules["homeassistant.helpers"].entity_registry = _er

# The energy integration's manager, with a switch to make it unavailable.
_energy = types.ModuleType("homeassistant.components.energy")
_energy_data = types.ModuleType("homeassistant.components.energy.data")
_energy_data.prefs = None
_energy_data.fail = False


async def _async_get_manager(hass):
    if _energy_data.fail:
        raise RuntimeError("energy not set up")
    return types.SimpleNamespace(data=_energy_data.prefs)


_energy_data.async_get_manager = _async_get_manager
_energy.data = _energy_data
sys.modules["homeassistant.components.energy"] = _energy
sys.modules["homeassistant.components.energy.data"] = _energy_data

detect = load_eb("detect")

PREFS = {
    "energy_sources": [
        {"type": "grid", "stat_energy_from": "sensor.meter_import",
         "power": [{"stat_rate": "sensor.meter_power"}]},
        {"type": "solar", "stat_energy_from": "sensor.pv_energy", "stat_rate": "sensor.pv_power"},
        {"type": "battery", "stat_energy_from": "sensor.batt_out",
         "stat_energy_to": "sensor.batt_in", "stat_rate": "sensor.batt_power"},
    ],
    "device_consumption": [],
}


def run(coro):
    """Drive a coroutine that never waits on I/O (see test_dashboard.run)."""
    try:
        coro.send(None)
    except StopIteration as stop:
        return stop.value
    raise AssertionError("coroutine suspended")


class Hass(FakeHass):
    async def async_add_executor_job(self, fn, *args):
        raise AssertionError("detection must not read files in an executor job")


def _no_file_access(*args, **kwargs):
    raise AssertionError(f"detection opened a file: {args[:1]}")


def _detect(prefs=None, fail=False):
    _energy_data.prefs, _energy_data.fail = prefs, fail
    real_open = builtins.open
    builtins.open = _no_file_access
    try:
        return run(detect.read_energy_dashboard(Hass()))
    finally:
        builtins.open = real_open


def test_preferences_come_from_the_energy_manager():
    assert _detect(PREFS) == {
        "grid_power": "sensor.meter_power",
        "solar_power": "sensor.pv_power",
        "battery_power": "sensor.batt_power",
    }


def test_nothing_configured_gives_an_empty_result():
    assert _detect(None) == {}


def test_energy_unavailable_gives_an_empty_result():
    assert _detect(PREFS, fail=True) == {}


def test_storage_file_is_not_referenced():
    with open(os.path.join(PKG_DIR, "detect.py"), encoding="utf-8") as fh:
        src = fh.read()
    assert '".storage"' not in src and "_read_energy_file" not in src


def test_manifest_loads_energy_first():
    with open(os.path.join(PKG_DIR, "manifest.json"), encoding="utf-8") as fh:
        manifest = json.load(fh)
    assert "energy" in manifest.get("after_dependencies", [])
