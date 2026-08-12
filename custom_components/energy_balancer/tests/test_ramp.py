"""Reactive charge ramp (BatteryOptimisation flow) on the pool.

The pool charges like one battery: a charge % ramped on the MEASURED grid
(closed-loop), split across the cells. Steady state never imports for surplus-
soak; below target it ramps toward the peak ceiling.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core import compute, reactive_charge_ramp, grid_follow_ramp
from test_tier import chain, o


# --- Pure ramp function (ported _adjust_charge_reactive) ---

def test_ramp_up_on_export():
    assert reactive_charge_ramp(0, -500, 3500) == 10        # export → +10


def test_ramp_up_slow_under_70pct():
    assert reactive_charge_ramp(20, 1000, 3500) == 25       # <70% → +5


def test_ramp_hold_in_95_98_band():
    assert reactive_charge_ramp(20, 3380, 3500) == 20       # 95–98% → hold


def test_ramp_step_down_near_threshold():
    assert reactive_charge_ramp(50, 3450, 3500) == 40       # >98% → −10


def test_ramp_halve_over_threshold():
    assert reactive_charge_ramp(60, 4000, 3500) == 30       # >threshold → halve


def test_ramp_clamped_0_100():
    assert reactive_charge_ramp(98, -100, 3500) == 100
    assert reactive_charge_ramp(0, 5000, 3500) == 0


def test_ramp_threshold_zero_converges_to_grid0():
    # Surplus-soak (threshold 0): import halves, export increases → grid → 0.
    assert reactive_charge_ramp(50, 100, 0) == 25           # import → halve
    assert reactive_charge_ramp(50, -100, 0) == 60          # export → +10


# --- Integrated: ramp drives the pool charge over ticks ---

def test_pool_ramps_up_below_target():
    cells = chain(0, 0, {"soc": 30, "target": 50}, {"soc": 30, "target": 50})
    tp = {}
    r = None
    for _ in range(20):
        r = compute(cells, grid_w=0, tier_pct=tp)           # grid<70%peak → ramp up
    assert tp[4] > 0                                         # position-4 tier ramped
    assert o(r, "goodwe").power_w > 0 and o(r, "marstek").power_w > 0  # both charge


def test_pool_releases_above_target_import():
    # Above target + importing (below peak) → RELEASE to autonomous
    # self-consumption (goodwe general + marstek anti_feed). NOT explicit
    # discharge — the inverters cover the house on their own fast meter.
    cells = chain(0, 0, {"soc": 60, "target": 50}, {"soc": 60, "target": 50})
    tp = {4: 0}
    r = None
    for _ in range(10):
        r = compute(cells, grid_w=500, tier_pct=tp)     # import < peak
    assert o(r, "goodwe").action == "autonomous"
    assert o(r, "marstek").action == "autonomous"


def test_pool_releases_above_target_surplus():
    # Above target + exporting (surplus) → RELEASE to autonomous self-consumption.
    # The inverters soak the surplus themselves (no explicit grid-follow pump).
    cells = chain(0, 0, {"soc": 60, "target": 50}, {"soc": 60, "target": 50})
    tp = {4: 0}
    r = None
    for _ in range(5):
        r = compute(cells, grid_w=-1000, tier_pct=tp)   # exporting above target
    assert o(r, "goodwe").action == "autonomous"
    assert o(r, "marstek").action == "autonomous"


def test_pool_peak_emergency_instant_discharge():
    # grid over the peak ceiling → INSTANT discharge in one tick (hard override),
    # even when it was charging.
    cells = chain(0, 0, {"soc": 60, "target": 50},
                  {"soc": 60, "target": 50}, peak=3500)
    tp = {4: 80}                                        # was charging
    r = compute(cells, grid_w=4000, tier_pct=tp)        # one tick, grid > 3500
    assert tp[4] < 0                                    # flipped to discharge at once
    assert o(r, "goodwe").power_w < 0                   # discharging in a single tick


# --- Pure signed grid-follow ramp (the explicit `general` replacement) ---

def test_grid_follow_discharges_on_import():
    assert grid_follow_ramp(0, 500) == -10              # big import → −10 (discharge)


def test_grid_follow_charges_on_export():
    assert grid_follow_ramp(0, -1000) == 10             # big export → +10 (charge)


def test_grid_follow_small_step_near_band():
    assert grid_follow_ramp(0, 100) == -5               # small import → −5
    assert grid_follow_ramp(0, -100) == 5               # small export → +5


def test_grid_follow_holds_in_deadband():
    assert grid_follow_ramp(0, 30) == 0                 # within ±deadband → hold


def test_grid_follow_clamped_signed():
    assert grid_follow_ramp(98, -1000) == 100
    assert grid_follow_ramp(-98, 1000) == -100


def test_pool_split_across_both_cells():
    # Ramped pool charge is split over BOTH batteries (capacity-weighted).
    # Few ticks so the pool charge stays below the hardware caps (else both
    # clamp and the ratio collapses to the cap ratio).
    cells = chain(0, 0, {"soc": 30, "target": 50}, {"soc": 30, "target": 50})
    tp = {}
    r = None
    for _ in range(3):
        r = compute(cells, grid_w=-1000, tier_pct=tp)       # exporting → ramp up
    g, m = o(r, "goodwe").power_w, o(r, "marstek").power_w
    assert g > 0 and m > 0                                   # both charge
    assert abs(g / m - 15 / 5.12) < 0.1                      # ∝ capacity
