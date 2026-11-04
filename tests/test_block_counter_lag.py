"""The block brake reads the meter's 15-minute counter as it stands NOW.

2026-10-21: the P1 counter reached Home Assistant ~10 s late, and EB read it as
current. At ~4.7 kW those 10 s are 4700 x 10 / 900 = ~52 W the brake did not
know about, so it aimed that much over the ceiling: four charging quarters in a
row closed 35-67 W over the monthly peak (4517 -> 4708 W), each overshoot
becoming the next quarter's ceiling. Replayed on that day with the counter 10 s
late, the old brake reproduced the overshoots (4689 W); with the reading brought
up to date it closed at the ceiling (4519 W).

Pinned here:
* the delay is measured on the quarter reset, not configured;
* a reading is brought forward by its age (delay + time since it arrived);
* until the reset arrives, the old quarter's total is not taken for the new one;
* a drop in the middle of a quarter (sensor dropping out) is not a reset.
"""

import os
import sys
import types
from datetime import datetime, timedelta

sys.path.insert(0, os.path.dirname(__file__))

from ha_stub import FakeHass, install_ha_stub, load_eb  # noqa: E402

install_ha_stub()
if "homeassistant.helpers.storage" not in sys.modules:
    _st = types.ModuleType("homeassistant.helpers.storage")
    _st.Store = object
    sys.modules["homeassistant.helpers.storage"] = _st
_uc = sys.modules["homeassistant.helpers.update_coordinator"]
if not hasattr(_uc, "DataUpdateCoordinator"):
    class _DUC:
        def __init__(self, *a, **k):
            pass

        def __class_getitem__(cls, item):
            return cls
    _uc.DataUpdateCoordinator = _DUC

core = load_eb("core")
coord_mod = load_eb("coordinator")

SENSOR = "sensor.p1_active_average_demand"


class Clock:
    def __init__(self):
        self.now = None

    def time(self):
        return self.now.timestamp()


CLOCK = Clock()
coord_mod.time = CLOCK


class Counter:
    """A state with the timestamps HA keeps."""
    def __init__(self, value, arrived):
        self.state = str(value)
        self.attributes = {}
        self.last_changed = self.last_updated = self.last_reported = arrived


def _coordinator():
    hass = FakeHass()
    c = types.SimpleNamespace(hass=hass, block_demand_sensor=SENSOR,
                              block_counter_lag_s=0.0, _block_prev_w=None,
                              _block_reset_boundary=None)
    return c, hass


def _tick(c, hass, now, value, arrived, grid):
    hass.states._d[SENSOR] = Counter(value, arrived)
    CLOCK.now = now
    return coord_mod.EBCoordinator._block_now(c, float(value), grid, now)


T = datetime(2026, 10, 21, 11, 0, 0)


# ------------------------------------------------------------ pure helpers
def test_lag_from_the_reset_of_11_00():
    # first reading of the quarter: 25 W, arrived 13.9 s after the boundary, grid 5983 W
    assert round(core.block_counter_lag_s(13.9, 25, 5983), 1) == 10.1


def test_lag_is_clamped():
    assert core.block_counter_lag_s(400, 0, 3000) == 60.0
    assert core.block_counter_lag_s(1, 300, 3000) == 0.0


def test_reading_is_brought_forward_by_its_age():
    # 12:29:55 on 2026-10-21: the counter showed 4606 W at 5177 W grid, 10 s old
    assert round(core.block_now_w(4606, 10, 5177, 895, reset_seen=True)) == 4664


def test_old_quarter_total_is_not_taken_for_the_new_one():
    assert round(core.block_now_w(4553, 10, 5400, 5, reset_seen=False)) == 30


def test_age_never_reaches_back_past_the_boundary():
    assert core.block_now_w(20, 30, 3600, 8, reset_seen=True) == 20 + 3600 * 8 / 900


# -------------------------------------------------- the coordinator method
def test_quarter_rollover_as_it_happened_at_11_00():
    c, hass = _coordinator()
    _tick(c, hass, T - timedelta(seconds=15), 4500, T - timedelta(seconds=16), 5900)
    # 5 s into the new quarter the counter still shows the old total
    est = _tick(c, hass, T + timedelta(seconds=5), 4553, T + timedelta(seconds=4), 5983)
    assert round(est) == round(5983 * 5 / 900)
    # the reset arrives: 25 W at 11:00:13.9
    est = _tick(c, hass, T + timedelta(seconds=15), 25, T + timedelta(seconds=13.9), 5983)
    assert 9.5 < c.block_counter_lag_s < 10.5
    assert round(est) == round(25 + 5983 * (1.1 + c.block_counter_lag_s) / 900)


def test_lag_is_not_learned_without_import():
    c, hass = _coordinator()
    _tick(c, hass, T - timedelta(seconds=15), 800, T - timedelta(seconds=16), 0)
    _tick(c, hass, T + timedelta(seconds=15), 0, T + timedelta(seconds=13), 0)
    assert c.block_counter_lag_s == 0.0
    assert c._block_reset_boundary is not None


def test_a_drop_mid_quarter_is_not_a_reset():
    c, hass = _coordinator()
    mid = T + timedelta(minutes=7)
    _tick(c, hass, mid, 2400, mid - timedelta(seconds=2), 4000)
    c.block_counter_lag_s = 10.0
    _tick(c, hass, mid + timedelta(seconds=10), 0, mid + timedelta(seconds=9), 4000)
    assert c.block_counter_lag_s == 10.0


def test_started_mid_quarter_reads_the_counter():
    c, hass = _coordinator()
    c.block_counter_lag_s = 10.0
    now = T + timedelta(minutes=5)
    est = _tick(c, hass, now, 1500, now - timedelta(seconds=3), 4500)
    assert round(est) == round(1500 + 4500 * 13 / 900)


def test_coordinator_feeds_the_estimate_to_the_brake():
    src = open(coord_mod.__file__, encoding="utf-8").read()
    body = src.split("def _block_inputs", 1)[1].split("def _block_now", 1)[0]
    assert "self._block_now(block_w, grid_w, now)" in body
