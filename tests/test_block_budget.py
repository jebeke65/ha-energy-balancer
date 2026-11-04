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
# The grid cell owns the block inputs (ceiling, block so far, seconds left) and
# hands them back up the chain; the tier turns them into its budget. With an
# empty block, a full quarter left and nothing else on the meter, the budget is
# exactly the ceiling — so `_chain(budget)` gives the tier a budget of `budget`.
# (Until 2026-11-03 the budget was a separate compute() argument; on 2026-08-31
# that side door was missing from compute() and every tick crashed.)

from core import CellConfig, CellState, compute          # noqa: E402
from intake import ChargeIntent, WANT_CHARGE             # noqa: E402


def _chain(budget=None):
    net = (dict(peak_limit_w=3500) if budget is None else
           dict(peak_limit_w=budget, block_now_w=0.0, block_remaining_s=900.0))
    return [
        (CellConfig(id="solar", position=0, mode="supply"), CellState(measured_w=6000)),
        (CellConfig(id="house", position=1, mode="demand"), CellState(measured_w=1000)),
        (CellConfig(id="goodwe", position=4, mode="balanced", max_charge_w=5000,
                    max_discharge_w=4500, capacity_kwh=15, min_soc=10, max_soc=95,
                    has_soc=True, target_soc=50), CellState(soc=40)),
        (CellConfig(id="marstek", position=4, mode="balanced", max_charge_w=2500,
                    max_discharge_w=2500, capacity_kwh=5.12, min_soc=10, max_soc=95,
                    has_soc=True, target_soc=50), CellState(soc=40)),
        (CellConfig(id="net", position=5, mode="grid", **net),
         CellState(measured_w=0)),
    ]


CHARGE_FULL = ChargeIntent(WANT_CHARGE, 100.0, "test")


def test_the_budget_reaches_the_tier_from_the_grid_cell():
    r = compute(_chain(1500.0), intent=CHARGE_FULL)
    assert r.details["goodwe"]["block_budget_w"] == 1500.0
    assert r.details["net"]["block_now_w"] == 0.0


def test_no_block_inputs_means_no_budget():
    r = compute(_chain(), intent=CHARGE_FULL)
    assert "block_budget_w" not in r.details["goodwe"]
    tot = sum(r.outputs[c].power_w for c in ("goodwe", "marstek"))
    assert abs(tot - 7500.0) <= 2, tot


def test_the_grid_cell_publishes_the_allowed_import():
    """The grid cell works out what the quarter still allows; the tier only
    subtracts the rest of the house (Jan, 2026-11-04)."""
    r = compute(_chain(1500.0), intent=CHARGE_FULL)
    assert r.details["net"]["allowed_import_w"] == 1500.0
    assert "allowed_import_w" not in compute(_chain(), intent=CHARGE_FULL).details["net"]


def test_the_tier_chain_values_sit_on_the_layer():
    """The grid cell's input is the tier's output, not one battery's."""
    from core import build_layers
    cells = _chain(1500.0)
    r = compute(cells, intent=CHARGE_FULL)
    layer = next(l for l in build_layers(cells, r.outputs, r.details)
                 if l["id"] == "home_battery")
    assert layer["rest_out_w"] == r.details["goodwe"]["rest_out_w"]
    assert layer["rest_out_w"] == r.details["net"]["rest_in_w"]
    assert layer["block_budget_w"] == 1500.0


def test_compute_has_no_side_door_for_grid_data():
    """Grid data enters through the grid cell only (Jan, 2026-11-03)."""
    import inspect
    params = inspect.signature(compute).parameters
    assert "grid_w" not in params and "block_budget_w" not in params


def test_budget_throttles_the_tier():
    without = compute(_chain(), intent=CHARGE_FULL)
    with_budget = compute(_chain(1500.0), intent=CHARGE_FULL)
    total_without = sum(without.outputs[c].power_w for c in ("goodwe", "marstek"))
    total_with = sum(with_budget.outputs[c].power_w for c in ("goodwe", "marstek"))
    assert abs(total_without - 7500.0) <= 2, total_without   # 100% of pool capacity
    assert abs(total_with - 1500.0) <= 2, total_with         # capped at the budget


def test_zero_budget_stops_charging():
    r = compute(_chain(0.0), intent=CHARGE_FULL)
    for c in ("goodwe", "marstek"):
        assert r.outputs[c].power_w == 0.0, (c, r.outputs[c])


def test_ample_budget_leaves_the_base_alone():
    r = compute(_chain(99000.0), intent=CHARGE_FULL)
    tot = sum(r.outputs[c].power_w for c in ("goodwe", "marstek"))
    assert abs(tot - 7500.0) <= 2, tot


def test_the_split_stays_right_after_throttling():
    """Throttling must not disturb the ratio between the two batteries."""
    r = compute(_chain(2000.0), intent=CHARGE_FULL)
    g = r.outputs["goodwe"].power_w
    m = r.outputs["marstek"].power_w
    assert abs(g + m - 2000.0) <= 2
    assert abs(g / m - 15 / 5.12) < 0.05


def test_a_single_cell_layer_carries_what_it_hands_on():
    from core import build_layers
    cells = _chain(1500.0)
    r = compute(cells, intent=CHARGE_FULL)
    house = next(l for l in build_layers(cells, r.outputs, r.details) if l["id"] == "house")
    assert house["rest_out_w"] == r.details["house"]["rest_out_w"]
    assert house["forecast_out_wh"] == r.details["house"]["forecast_out_wh"]


def test_the_car_gets_its_headroom_from_the_tier():
    """Upstream, every block reads the headroom the block after it hands on;
    the grid ceiling reaches the car via the tier, not straight from the grid."""
    from core import build_layers
    cells = _chain(1500.0)
    r = compute(cells, intent=CHARGE_FULL)
    layers = {l["id"]: l for l in build_layers(cells, r.outputs, r.details)}
    assert layers["home_battery"]["headroom_out_w"] == r.details["house"]["headroom_w"]
    assert layers["home_battery"]["headroom_out_w"] == r.details["net"]["peak_limit_w"]
    assert "headroom_out_w" in layers["house"]
