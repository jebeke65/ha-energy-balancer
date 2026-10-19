"""The upper side of the emergency brake: the quarter-hour budget.

A capacity tariff bills the highest 15-minute average, not the highest
instantaneous reading. So this is a bucket, not a speed limiter.

The old brake compared the INSTANTANEOUS grid value against a fixed ceiling,
switched on and off on the same condition, and its own charging pushed the grid
against that ceiling. Measured 2026-08-31: 3 reversals in 2 min 26 s, swings
from −57 % to +30 %, and the grid jumped from −278 to +3470 W in 40 s. Within a
quarter hour the block average can only rise, so this ceiling can only get
tighter — it never springs back.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core import block_budget_w, quarter_remaining_s

CEILING = 3498.0


# ---------------------------------------------------------------- time remaining
def test_start_of_the_quarter():
    assert quarter_remaining_s(0, 0) == 900.0
    assert quarter_remaining_s(15, 0) == 900.0
    assert quarter_remaining_s(45, 0) == 900.0


def test_middle_and_end():
    assert quarter_remaining_s(7, 30) == 450.0
    assert quarter_remaining_s(14, 59) == 1.0
    assert quarter_remaining_s(29, 30) == 30.0


# ---------------------------------------------------------------------- budget
def test_empty_block_at_the_start_gives_the_whole_ceiling():
    """Block at 0, whole quarter to go → exactly the ceiling, minus the house."""
    assert block_budget_w(CEILING, 0.0, 900.0, 0.0) == CEILING
    assert block_budget_w(CEILING, 0.0, 900.0, 500.0) == CEILING - 500.0


def test_the_measured_case_of_11_51():
    """Block 70 W, 540 s to go → 5713 W still allowed, while the old brake already fired.

    This is the core of the gain: instantaneously, 3498 W would already trip
    the emergency brake, while at that rate the quarter closes well below the
    ceiling.
    """
    b = block_budget_w(CEILING, 70.0, 540.0, 0.0)
    assert 5700 < b < 5720, b


def test_full_block_squeezes_hard():
    """Block 3400 at minute 10 → 294 W left, while the instantaneous rule would not act."""
    b = block_budget_w(CEILING, 3400.0, 300.0, 0.0)
    assert 290 < b < 300, b


def test_house_load_is_subtracted():
    """The tier gets what is left after the rest of the house has been served."""
    bare = block_budget_w(CEILING, 1000.0, 450.0, 0.0)
    with_house = block_budget_w(CEILING, 1000.0, 450.0, 1200.0)
    assert abs((bare - with_house) - 1200.0) < 1e-6


def test_never_negative():
    """Even when the house alone eats the budget: cap, do not discharge."""
    assert block_budget_w(CEILING, 3000.0, 300.0, 9000.0) == 0.0
    assert block_budget_w(CEILING, 5000.0, 300.0, 0.0) == 0.0


def test_block_above_the_ceiling_gives_nothing_more():
    """Quarter already lost → no more charging. Discharging does not help here:
    a rising average cannot be pushed back down."""
    assert block_budget_w(CEILING, CEILING + 200, 400.0, 0.0) == 0.0


def test_quarter_boundary_does_not_divide_by_zero():
    assert block_budget_w(CEILING, 100.0, 0.0, 0.0) == 0.0
    assert block_budget_w(CEILING, 100.0, -5.0, 0.0) == 0.0


def test_the_brake_is_one_sided_and_therefore_cannot_flip():
    """The property everything rests on.

    NOT: the budget decreases monotonically — it does not, and it should not.
    As the quarter runs out, the same remaining room may be used up faster;
    that is the bucket behaving correctly.

    BUT: the budget is never negative. The brake at most throttles charging and
    never asks for the opposite, so there is no pair of conditions to flip
    between. That is what the old brake did have.
    """
    block = 0.0
    for elapsed in range(0, 900, 30):
        block += 40.0
        b = block_budget_w(CEILING, block, 900.0 - elapsed, 1000.0)
        assert b >= 0.0, (elapsed, b)


def test_sustained_draw_empties_the_bucket():
    """If the block keeps climbing towards the ceiling, the budget goes to zero
    and stays there — the brake does not let go by itself."""
    b_early = block_budget_w(CEILING, 500.0, 800.0, 1000.0)
    b_late = block_budget_w(CEILING, 3450.0, 100.0, 1000.0)
    assert b_early > 0
    assert b_late == 0.0


# ------------------------------------------------------- passing it down the chain
# The budget is passed through three layers: compute -> process_tier ->
# _pool_controller. On 2026-08-31 compute() was the only one that did NOT get
# the parameter, and no test noticed: they all call compute() without a budget,
# so the signature was never exercised with that argument. Live, every tick
# crashed on a TypeError and the whole dashboard was empty.
# These tests DO call compute() with the budget, so the chain stays intact.

from core import CellConfig, CellState, compute          # noqa: E402
from intake import ChargeIntent, WANT_CHARGE             # noqa: E402


def _chain():
    return [
        (CellConfig(id="solar", position=0, mode="supply"), CellState(measured_w=6000)),
        (CellConfig(id="house", position=1, mode="demand"), CellState(measured_w=1000)),
        (CellConfig(id="goodwe", position=4, mode="balanced", max_charge_w=5000,
                    max_discharge_w=4500, capacity_kwh=15, min_soc=10, max_soc=95,
                    has_soc=True, target_soc=50), CellState(soc=40)),
        (CellConfig(id="marstek", position=4, mode="balanced", max_charge_w=2500,
                    max_discharge_w=2500, capacity_kwh=5.12, min_soc=10, max_soc=95,
                    has_soc=True, target_soc=50), CellState(soc=40)),
        (CellConfig(id="net", position=5, mode="grid", peak_limit_w=3500),
         CellState(measured_w=0)),
    ]


CHARGE_FULL = ChargeIntent(WANT_CHARGE, 100.0, "test")


def test_compute_accepts_the_budget():
    """compute()'s signature carries the budget — otherwise every tick crashes."""
    r = compute(_chain(), intent=CHARGE_FULL, block_budget_w=1500.0)
    assert r is not None


def test_budget_throttles_the_tier():
    without = compute(_chain(), intent=CHARGE_FULL)
    with_budget = compute(_chain(), intent=CHARGE_FULL, block_budget_w=1500.0)
    total_without = sum(without.outputs[c].power_w for c in ("goodwe", "marstek"))
    total_with = sum(with_budget.outputs[c].power_w for c in ("goodwe", "marstek"))
    assert abs(total_without - 7500.0) <= 2, total_without   # 100% of pool capacity
    assert abs(total_with - 1500.0) <= 2, total_with         # capped at the budget


def test_zero_budget_stops_charging():
    r = compute(_chain(), intent=CHARGE_FULL, block_budget_w=0.0)
    for c in ("goodwe", "marstek"):
        assert r.outputs[c].power_w == 0.0, (c, r.outputs[c])


def test_ample_budget_leaves_the_base_alone():
    r = compute(_chain(), intent=CHARGE_FULL, block_budget_w=99000.0)
    tot = sum(r.outputs[c].power_w for c in ("goodwe", "marstek"))
    assert abs(tot - 7500.0) <= 2, tot


def test_the_split_stays_right_after_throttling():
    """Throttling must not disturb the ratio between the two batteries."""
    r = compute(_chain(), intent=CHARGE_FULL, block_budget_w=2000.0)
    g = r.outputs["goodwe"].power_w
    m = r.outputs["marstek"].power_w
    assert abs(g + m - 2000.0) <= 2
    assert abs(g / m - 15 / 5.12) < 0.05
