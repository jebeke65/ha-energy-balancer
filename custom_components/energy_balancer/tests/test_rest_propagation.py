"""Rest propagation — meten is weten.

A cell hands the next one what is left AFTER its own real consumption. Not after
what it was ASKED to consume: those two are not the same thing, and the gap
between them is where the surplus goes missing.

2026-07-14: EB commanded 3.4 kW to a car charger with no car attached. The charger
drew 4 W. The chain still reported rest_out = 0, so the batteries below it saw no
surplus left and 2.3 kW went out onto the grid while a battery at 63% sat idle.

The chain deliberately does NOT look at a connected/charging sensor. It does not
need to know what kind of device a cell is — only what it consumes.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core import CellConfig, CellState, Downstream, Upstream, process_cell


def _charger(measured, *, rest=3445.0, take_pct=100.0, headroom=3050.0,
             max_charge=7400.0, floor=0.0):
    cfg = CellConfig(id="car_charger", position=1, mode="surplus",
                     type="car_charger", max_charge_w=max_charge,
                     can_discharge=False, take_pct=take_pct, charge_floor_w=floor)
    st = CellState(measured_w=measured)
    out, rest_out, _flags, fc_out, _prev = process_cell(
        cfg, st, Downstream(rest_w=rest, forecast_wh=10000.0),
        Upstream(headroom_w=headroom, current_power_w=0.0))
    return out, rest_out, fc_out


def test_a_charger_that_draws_nothing_passes_the_whole_surplus_down():
    # The live failure: no car attached, so the charger draws ~nothing. Every watt
    # it does not take has to reach the battery behind it.
    out, rest_out, _fc = _charger(measured=4.0)
    assert out.action == "consume"          # EB still commands it
    assert out.power_w > 3000               # ...with the full surplus
    assert rest_out == 3441.0               # 3445 − 4, NOT 3445 − 3445
    assert "measured 4W" in out.reason      # and the reason says so


def test_a_charger_drawing_its_setpoint_leaves_nothing_behind():
    # The normal case must not change: a charger actually pulling the surplus
    # leaves the next cell with nothing.
    out, rest_out, _fc = _charger(measured=3445.0)
    assert out.action == "consume"
    assert rest_out == 0.0


def test_the_shortfall_of_an_underdelivering_charger_flows_down():
    # Smappee is known to deliver less than it is told (project_smappee_charging_issue).
    # The difference is not lost — it belongs to the next cell.
    out, rest_out, _fc = _charger(measured=2000.0)
    assert rest_out == 1445.0               # 3445 − 2000


def test_forecast_is_claimed_on_what_is_taken_not_on_what_is_asked():
    # A cell that consumes nothing claims none of the solar forecast either;
    # claiming on the setpoint would starve the batteries of their forecast budget.
    _out, _rest, fc_idle = _charger(measured=0.0)
    _out, _rest, fc_full = _charger(measured=3445.0)
    assert fc_idle == 10000.0               # untouched
    assert fc_full == 0.0                   # took the entire surplus -> entire forecast


def test_the_commanded_setpoint_still_goes_to_the_actuator():
    # power_w is the setpoint the actuator sends to the hardware; only the rest
    # propagation switched to the measurement. Conflating the two would mean a
    # charger that has not ramped up yet never gets told to.
    out, _rest, _fc = _charger(measured=0.0)
    assert out.power_w > 3000


def test_the_sum_stays_whole():
    # The property that makes this safe: what the cell draws plus what it passes on
    # always equals what it was given. No watt is invented, none disappears.
    for measured in (0.0, 4.0, 1200.0, 3445.0):
        _out, rest_out, _fc = _charger(measured=measured)
        assert measured + rest_out == 3445.0
