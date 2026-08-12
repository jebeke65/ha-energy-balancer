"""Multi-tick latch persistence + transitions + car-cell behaviour.

compute() mutates each CellState.prev_action in place — exactly what the wrapper
carries across ticks. These tests run several ticks on the SAME state objects to
prove the target-band hysteresis latch holds and releases at the band edges (the
class of bug where prev_action did not persist).
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core import CellConfig, CellState, compute
from test_tier import chain, o, W


def test_latch_persists_into_band_discharge():
    # Start above the band (55 > target+3) → discharging. Drop SoC into the band
    # (51, inside 47–53): the latch must KEEP discharging, not flip to hold.
    cells = chain(0, 3000, {"soc": 55, "target": 50}, {"soc": 55, "target": 50})
    r1 = compute(cells)
    assert o(r1, "goodwe").action == "produce" and o(r1, "marstek").action == "produce"

    cells[2][1].soc = 51          # now inside the band, prev_action == "produce"
    cells[3][1].soc = 51
    r2 = compute(cells)
    assert o(r2, "goodwe").action == "produce"   # latched → still discharging
    assert o(r2, "marstek").action == "produce"


def test_latch_releases_below_band_bottom():
    # Discharging, then SoC falls below target−delta (46 < 47) → latch releases,
    # the cell must stop discharging (it's now a charge-latch cell).
    cells = chain(0, 3000, {"soc": 55, "target": 50}, {"soc": 55, "target": 50})
    compute(cells)                # discharge latch on
    cells[2][1].soc = 46
    cells[3][1].soc = 46
    r = compute(cells)
    assert o(r, "goodwe").power_w >= 0 and o(r, "marstek").power_w >= 0  # not discharging


def test_latch_persists_into_band_charge():
    # Start below the band (44 < target−3) → charging. Rise into the band (49):
    # the latch must KEEP its charge direction (not start discharging on a deficit).
    cells = chain(2000, 0, {"soc": 44, "target": 50}, {"soc": 44, "target": 50})
    r1 = compute(cells)
    assert o(r1, "goodwe").action == "consume"

    # Surplus gone, small deficit; SoC now inside the band, prev == "consume".
    cells[0][1].measured_w = 0
    cells[1][1].measured_w = 500
    cells[2][1].soc = 49
    cells[3][1].soc = 49
    r2 = compute(cells)
    # Latched to charge → must NOT discharge to cover the deficit.
    assert o(r2, "goodwe").power_w >= 0 and o(r2, "marstek").power_w >= 0


def test_latch_full_cycle_no_flap_at_target():
    # Sitting exactly at target with tiny swings around it must not oscillate
    # charge/discharge: in the band the prior direction holds.
    cells = chain(0, 1000, {"soc": 50, "target": 50}, {"soc": 50, "target": 50})
    cells[2][1].prev_action = "produce"
    cells[3][1].prev_action = "produce"
    actions = set()
    for soc in (50, 49, 51, 50, 48):       # all inside the band 47–53
        cells[2][1].soc = soc
        cells[3][1].soc = soc
        r = compute(cells)
        actions.add(o(r, "goodwe").action)
    # Never flips to charge while latched to discharge inside the band.
    assert "consume" not in actions


# --- Car cell (self_consumption) edge cases ---

def car_chain(solar, house, car_measured):
    return [
        (CellConfig(id="solar", position=0, mode="supply"), CellState(measured_w=solar)),
        (CellConfig(id="house", position=1, mode="demand"), CellState(measured_w=house)),
        (CellConfig(id="car", position=2, mode="self_consumption", type="car_charger",
                    max_charge_w=7400, can_discharge=False),
         CellState(measured_w=car_measured)),
        (CellConfig(id="net", position=99, mode="grid", peak_limit_w=3500),
         CellState(measured_w=0)),
    ]


def test_car_consumes_on_surplus():
    r = compute(car_chain(4000, 1000, 0))
    assert o(r, "car").action in ("consume", "autonomous")


def test_car_idle_without_surplus():
    # No surplus and not measuring draw → car cell idles (does not invent load).
    r = compute(car_chain(0, 1000, 0))
    assert o(r, "car").action in ("idle", "autonomous")
    assert o(r, "car").power_w <= 0 + W


def test_car_never_discharges():
    # can_discharge=False → the car cell must never produce, even on a deficit.
    r = compute(car_chain(0, 3000, 0))
    assert o(r, "car").power_w >= 0
