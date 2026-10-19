"""The lifetime bucket must never empty, and house/solar must be counted.

Background 2026-08-31: the Energy dashboard refused EB's energy sensors. The
daily/monthly/yearly buckets are published as `total` without `last_reset`, and
HA then reads a reset to 0 as a real decrease. Hence a bucket with a fixed key,
published as total_increasing. House consumption was not counted anywhere
either ("Home comes later" in coordinator.py).
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from datetime import datetime

from accounting import EnergyAccounting, PERIODS


def _tick(acc, ts, *, grid_w=0.0, solar_w=0.0, house_w=0.0, now=None):
    acc.tick(now or datetime(2026, 8, 31, 12, 0, 0), ts, grid_w, solar_w,
             0.0, 0.30, 0.05, house_w=house_w)


def test_lifetime_is_one_of_the_periods():
    assert "lifetime" in PERIODS


def test_one_hour_at_1000w_gives_1_kwh():
    acc = EnergyAccounting()
    _tick(acc, 0)                      # the first tick only sets the clock
    # 120 s is exactly the maximum step; 30 steps of 120 s = 1 hour
    for i in range(1, 31):
        _tick(acc, i * 120.0, grid_w=1000.0, solar_w=2000.0, house_w=500.0)
    b = acc.buckets["lifetime"]
    assert abs(b["grid_import_energy"] - 1.0) < 1e-6, b["grid_import_energy"]
    assert abs(b["solar_energy"] - 2.0) < 1e-6, b["solar_energy"]
    assert abs(b["house_energy"] - 0.5) < 1e-6, b["house_energy"]


def test_export_does_not_count_as_import():
    acc = EnergyAccounting()
    _tick(acc, 0)
    _tick(acc, 60.0, grid_w=-1000.0)
    b = acc.buckets["lifetime"]
    assert b["grid_import_energy"] == 0.0
    assert b["grid_export_energy"] > 0.0


def test_day_rollover_resets_the_day_but_not_lifetime():
    acc = EnergyAccounting()
    day1 = datetime(2026, 8, 31, 23, 59, 0)
    day2 = datetime(2026, 9, 1, 0, 1, 0)
    _tick(acc, 0, now=day1)
    _tick(acc, 60.0, grid_w=3600.0, house_w=3600.0, now=day1)
    day_before = acc.buckets["daily"]["grid_import_energy"]
    life_before = acc.buckets["lifetime"]["grid_import_energy"]
    assert day_before > 0 and life_before > 0

    _tick(acc, 120.0, grid_w=0.0, now=day2)          # new day
    assert acc.buckets["daily"]["grid_import_energy"] == 0.0
    assert acc.buckets["lifetime"]["grid_import_energy"] == life_before


def test_month_and_year_rollover_leave_lifetime_alone():
    acc = EnergyAccounting()
    _tick(acc, 0, now=datetime(2026, 12, 31, 23, 59, 0))
    _tick(acc, 60.0, grid_w=3600.0, now=datetime(2026, 12, 31, 23, 59, 30))
    life = acc.buckets["lifetime"]["grid_import_energy"]
    assert life > 0
    _tick(acc, 120.0, now=datetime(2027, 1, 1, 0, 0, 30))
    assert acc.buckets["monthly"]["grid_import_energy"] == 0.0
    assert acc.buckets["yearly"]["grid_import_energy"] == 0.0
    assert acc.buckets["lifetime"]["grid_import_energy"] == life


def test_house_w_is_optional():
    """Older callers (and the rest of the suite) do not pass house_w."""
    acc = EnergyAccounting()
    acc.tick(datetime(2026, 8, 31, 12, 0, 0), 0.0, 0.0, 0.0, 0.0, 0.3, 0.05)
    acc.tick(datetime(2026, 8, 31, 12, 1, 0), 60.0, 1000.0, 0.0, 0.0, 0.3, 0.05)
    assert acc.buckets["lifetime"]["house_energy"] == 0.0
    assert acc.buckets["lifetime"]["grid_import_energy"] > 0.0


def test_snapshot_contains_the_lifetime_fields():
    acc = EnergyAccounting()
    snap = acc.snapshot()
    for f in ("lifetime_grid_import_energy", "lifetime_grid_export_energy",
              "lifetime_solar_energy", "lifetime_house_energy"):
        assert f in snap, f


def test_old_stored_state_stays_readable():
    """A state from before lifetime existed must not crash."""
    old = {"daily": {"grid_import_energy": 5.0}, "keys": {"daily": "2026-08-30"},
           "lifetime_total_savings": 12.0, "last_ts": None}
    acc = EnergyAccounting(old)
    assert acc.buckets["daily"]["grid_import_energy"] == 5.0
    assert acc.buckets["lifetime"]["grid_import_energy"] == 0.0
    assert acc.buckets["daily"]["house_energy"] == 0.0
