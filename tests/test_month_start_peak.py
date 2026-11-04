"""The month rollover must not carry over the previous month's peak.

Measured on the P1 meter, 2026-08-31: `peak_demand_current_month` kept July's
value for 15.2 minutes after midnight (hourly average 751.28 with 2901 before
and ~20 after → f = 0.2538 of the hour). Whatever EB draws in that window
closes the first quarter of the new month — so with the old ceiling still
active, EB immediately sets the new monthly peak to the old value.

The window works on both sides of midnight. The side before exists because the
tier does not stop on a dime: what runs at 23:59 is still running at 00:01. It
also makes the whole thing testable without waiting for a month to turn.

The rule lives in the grid cell (core.in_month_rollover_window,
core.month_start_peak, core.grid_ceiling_w) and is tested here directly. The
coordinator only supplies the clock and says which reading is the month peak;
the last test guards that wiring, since coordinator.py imports homeassistant
and does not fit the stdlib runner.
"""

import os
import pathlib
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from datetime import datetime

from core import (CellConfig, grid_ceiling_w, in_month_rollover_window,
                  month_start_peak)


class _Fake:
    """The coordinator's settings, wired to the grid cell's real rule."""

    def __init__(self, policy="previous", window=30, sensor="sensor.month_peak_demand",
                 ceiling=3000.0, end=0):
        self.month_start_peak_policy = policy
        self.month_start_window_min = window
        self.month_end_window_min = end
        self.month_peak_sensor = sensor
        self.peak_limit_default = ceiling

    def _in_month_start_window(self, now):
        return bool(self.month_peak_sensor) and in_month_rollover_window(
            now, self.month_start_window_min, self.month_end_window_min)

    def _month_start_peak(self, measured):
        return month_start_peak(measured, self.month_start_peak_policy,
                                self.peak_limit_default)


FIRST_QUARTER = datetime(2026, 9, 1, 0, 7, 0)
AFTER_THE_WINDOW = datetime(2026, 9, 1, 0, 31, 0)
MID_MONTH = datetime(2026, 9, 15, 0, 7, 0)
JUST_BEFORE_MIDNIGHT = datetime(2026, 8, 31, 23, 59, 0)


def test_window_only_on_the_first():
    c = _Fake()
    assert c._in_month_start_window(FIRST_QUARTER)
    assert not c._in_month_start_window(MID_MONTH)
    assert not c._in_month_start_window(JUST_BEFORE_MIDNIGHT)


def test_window_closes_after_the_configured_minutes():
    c = _Fake(window=30)
    assert c._in_month_start_window(datetime(2026, 9, 1, 0, 29, 0))
    assert not c._in_month_start_window(AFTER_THE_WINDOW)


def test_window_covers_the_measured_15_2_minutes_with_margin():
    """15.2 minutes measured; 30 chosen so a slower meter does not slip through."""
    c = _Fake(window=30)
    assert c._in_month_start_window(datetime(2026, 9, 1, 0, 15, 0))
    assert c._in_month_start_window(datetime(2026, 9, 1, 0, 16, 0))


def test_window_zero_switches_everything_off():
    assert not _Fake(window=0)._in_month_start_window(FIRST_QUARTER)


def test_no_sensor_no_window():
    assert not _Fake(sensor="")._in_month_start_window(FIRST_QUARTER)


def test_previous_keeps_the_old_peak():
    """The behaviour from before 2026-08-31 — August's 3498 stays in force."""
    assert _Fake(policy="previous")._month_start_peak(3498.0) == 3498.0


def test_configured_caps_at_the_configured_ceiling():
    c = _Fake(policy="configured", ceiling=3000.0)
    assert c._month_start_peak(3498.0) == 3000.0


def test_configured_does_not_lower_a_value_already_below():
    """If the reading is below the ceiling, there is nothing to cap."""
    c = _Fake(policy="configured", ceiling=3000.0)
    assert c._month_start_peak(1263.0) == 1263.0


def test_zero_ignores_the_reading():
    assert _Fake(policy="zero")._month_start_peak(3498.0) == 0.0


def test_the_case_of_1_september_2026():
    """August closed at 3498 W, the configured ceiling is 3000 W.

    peak_limit = max(over the sensors). With the floor helper at 3050 that gives:
      previous   -> max(3050, 3498) = 3498  <- the month inherits the old peak
      configured -> max(3050, 3000) = 3050
      zero       -> max(3050, 0)    = 3050
    """
    floor = 3050.0
    month_peak = 3498.0
    outcomes = {}
    for policy in ("previous", "configured", "zero"):
        c = _Fake(policy=policy, ceiling=3000.0)
        outcomes[policy] = max(floor, c._month_start_peak(month_peak))
    assert outcomes["previous"] == 3498.0
    assert outcomes["configured"] == 3050.0
    assert outcomes["zero"] == 3050.0


def test_outside_the_window_the_policy_does_not_count():
    """On 15 September the real monthly peak simply applies."""
    c = _Fake(policy="zero")
    assert not c._in_month_start_window(MID_MONTH)


# ------------------------------------------- the side before midnight
LAST_DAY_2145 = datetime(2026, 8, 31, 21, 45, 0)   # 135 min before midnight
LAST_DAY_2345 = datetime(2026, 8, 31, 23, 45, 0)   # 15 min before midnight
LAST_DAY_2330 = datetime(2026, 8, 31, 23, 30, 0)   # 30 min before midnight


def test_end_window_is_off_by_default():
    """Whoever does not set it keeps exactly the old behaviour."""
    assert not _Fake(end=0)._in_month_start_window(LAST_DAY_2345)


def test_end_window_acts_before_midnight():
    c = _Fake(end=15)
    assert c._in_month_start_window(LAST_DAY_2345)
    assert not c._in_month_start_window(LAST_DAY_2330)


def test_end_window_at_the_boundary():
    """Exactly N minutes before midnight still counts, N+1 does not."""
    c = _Fake(end=30)
    assert c._in_month_start_window(datetime(2026, 8, 31, 23, 30, 0))
    assert not c._in_month_start_window(datetime(2026, 8, 31, 23, 29, 0))


def test_end_window_only_on_the_last_day_of_the_month():
    """30 August is not a month end, 31 August is."""
    c = _Fake(end=60)
    assert not c._in_month_start_window(datetime(2026, 8, 30, 23, 45, 0))
    assert c._in_month_start_window(datetime(2026, 8, 31, 23, 45, 0))


def test_end_window_knows_the_length_of_every_month():
    """30 June, 31 July, 28 February — monthrange, not a fixed 31."""
    c = _Fake(end=60)
    assert c._in_month_start_window(datetime(2026, 6, 30, 23, 45, 0))
    assert not c._in_month_start_window(datetime(2026, 6, 29, 23, 45, 0))
    assert c._in_month_start_window(datetime(2026, 7, 31, 23, 45, 0))
    assert c._in_month_start_window(datetime(2026, 2, 28, 23, 45, 0))


def test_end_window_knows_a_leap_year():
    c = _Fake(end=60)
    assert c._in_month_start_window(datetime(2028, 2, 29, 23, 45, 0))
    assert not c._in_month_start_window(datetime(2028, 2, 28, 23, 45, 0))


def test_wide_open_end_window_for_a_trial():
    """200 minutes: at 21:45 on the last day the brake is already armed.

    This way the mechanism can be tried without waiting a month — exactly what
    was done on 2026-08-31 at 21:45.
    """
    c = _Fake(end=200)
    assert c._in_month_start_window(LAST_DAY_2145)
    assert not c._in_month_start_window(datetime(2026, 8, 31, 20, 30, 0))


def test_no_sensor_no_end_window_either():
    assert not _Fake(sensor="", end=200)._in_month_start_window(LAST_DAY_2145)


def test_the_two_windows_join_up():
    """From 23:45 to 00:30 there must be no gap around the rollover."""
    c = _Fake(window=30, end=15)
    moments = [datetime(2026, 8, 31, 23, 45 + i) for i in range(15)]
    moments += [datetime(2026, 9, 1, 0, i) for i in range(30)]
    gaps = [m for m in moments if not c._in_month_start_window(m)]
    assert not gaps, f"gap in the coverage: {gaps[:3]}"


def test_the_cap_is_the_same_on_both_sides():
    """Before and after midnight the same policy applies — no second rule."""
    c = _Fake(policy="configured", ceiling=2500.0, window=30, end=200)
    assert c._in_month_start_window(LAST_DAY_2145)
    assert c._in_month_start_window(FIRST_QUARTER)
    assert c._month_start_peak(3498.0) == 2500.0


# ------------------------------------------------ the grid cell applies it
def _net(policy, rollover, readings, start=3000.0):
    return CellConfig(id="net", position=99, mode="grid", peak_limit_w=start,
                      peak_readings_w=readings, month_start_peak_policy=policy,
                      month_rollover=rollover)


def test_grid_cell_caps_only_the_month_peak_inside_the_window():
    readings = ((3498.0, True), (3050.0, False))
    assert grid_ceiling_w(_net("zero", True, readings)) == 3050.0
    assert grid_ceiling_w(_net("configured", True, readings)) == 3050.0
    assert grid_ceiling_w(_net("previous", True, readings)) == 3498.0
    assert grid_ceiling_w(_net("zero", False, readings)) == 3498.0


def test_the_coordinator_wires_the_window_as_before():
    """No month peak sensor, no window; only that sensor's reading is flagged."""
    root = pathlib.Path(__file__).resolve().parent.parent
    src = next(p for p in (root / "coordinator.py",
                           root / "custom_components" / "energy_balancer" / "coordinator.py")
               if p.exists())
    t = src.read_text()
    assert "rollover = bool(self.month_peak_sensor) and in_month_rollover_window(" in t
    assert "bool(s) and s == self.month_peak_sensor" in t
