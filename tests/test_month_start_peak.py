"""The month rollover must not carry over the previous month's peak.

Measured on the P1 meter, 2026-08-31: `peak_demand_current_month` kept July's
value for 15.2 minutes after midnight (hourly average 751.28 with 2901 before
and ~20 after → f = 0.2538 of the hour). Whatever EB draws in that window
closes the first quarter of the new month — so with the old ceiling still
active, EB immediately sets the new monthly peak to the old value.

The window works on both sides of midnight. The side before exists because the
tier does not stop on a dime: what runs at 23:59 is still running at 00:01. It
also makes the whole thing testable without waiting for a month to turn.

The methods below are NOT retyped but extracted from coordinator.py with ast
and executed here — coordinator.py imports homeassistant and so does not fit
the stdlib runner, but a copy could silently drift from the original. That is
exactly the trap in which 247 tests stayed green while every live tick crashed
(2026-08-31).
"""

import ast
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from calendar import monthrange
from datetime import datetime

_WANTED = ("_in_month_start_window", "_month_start_peak")


def _find_source():
    """coordinator.py sits next to tests/, but the stdlib runner runs the tests in
    a flat directory where the file is a sibling. Search both places instead of
    assuming one."""
    here = os.path.dirname(os.path.abspath(__file__))
    for candidate in (os.path.join(here, "..", "coordinator.py"),
                      os.path.join(here, "coordinator.py"),
                      os.path.join(here, "..", "custom_components", "energy_balancer",
                                   "coordinator.py")):
        if os.path.exists(candidate):
            return candidate
    raise AssertionError("coordinator.py not found from " + here)


_SOURCE = _find_source()


def _load_real_methods():
    """Extract the two methods from coordinator.py without importing homeassistant."""
    tree = ast.parse(open(_SOURCE).read())
    cls = next(
        n for n in ast.walk(tree)
        if isinstance(n, ast.ClassDef)
        and any(isinstance(f, ast.FunctionDef) and f.name == _WANTED[0] for f in n.body)
    )
    namespace = {"datetime": datetime, "monthrange": monthrange}
    found = {}
    for f in cls.body:
        if isinstance(f, ast.FunctionDef) and f.name in _WANTED:
            exec(compile(ast.Module([f], []), _SOURCE, "exec"), namespace)
            found[f.name] = namespace[f.name]
    missing = set(_WANTED) - set(found)
    assert not missing, f"coordinator.py lacks {missing}"
    return found


_REAL = _load_real_methods()


class _Fake:
    """Only the fields the window logic reads; the methods are the real ones."""

    def __init__(self, policy="previous", window=30, sensor="sensor.month_peak_demand",
                 ceiling=3000.0, end=0):
        self.month_start_peak_policy = policy
        self.month_start_window_min = window
        self.month_end_window_min = end
        self.month_peak_sensor = sensor
        self.peak_limit_default = ceiling

    _in_month_start_window = _REAL["_in_month_start_window"]
    _month_start_peak = _REAL["_month_start_peak"]


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
