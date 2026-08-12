"""Tests for the same-priority tier (parallel pool) split.

goodwe + marstek share position 4 → process_tier splits surplus/deficit
pro-rata by take_pct·gap·capacity, clamped to caps, residual by free room.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core import CellConfig, CellState, compute

W = 2.0


def chain(solar, house, gw, mk, peak=3500):
    """solar → house → [goodwe, marstek same position] → net."""
    return [
        (CellConfig(id="solar", position=0, mode="supply"),
         CellState(measured_w=solar)),
        (CellConfig(id="house", position=1, mode="demand"),
         CellState(measured_w=house)),
        (CellConfig(id="goodwe", position=4, mode="smart",
                    max_charge_w=5000, max_discharge_w=4500,
                    capacity_kwh=15, min_soc=10, max_soc=95, has_soc=True,
                    set_flag_on_charge="battery_charge",
                    take_pct=gw.get("take", 100), target_soc=gw["target"]),
         CellState(soc=gw["soc"])),
        (CellConfig(id="marstek", position=4, mode="smart",
                    max_charge_w=2500, max_discharge_w=2500,
                    capacity_kwh=5.12, min_soc=10, max_soc=95, has_soc=True,
                    take_pct=mk.get("take", 100), target_soc=mk["target"]),
         CellState(soc=mk["soc"])),
        (CellConfig(id="net", position=5, mode="grid", peak_limit_w=peak),
         CellState(measured_w=0)),
    ]


def o(r, cid):
    return r.outputs[cid]


def test_tier_charge_split_by_capacity():
    # peak=0 → no grid headroom, so charge is bounded by the surplus only (pure
    # split test). Equal gap (target−soc) → split purely by capacity 15 : 5.12.
    r = compute(chain(5000, 1000, {"soc": 30, "target": 50},
                       {"soc": 30, "target": 50}, peak=0))
    g, m = o(r, "goodwe"), o(r, "marstek")
    assert g.action == "consume" and m.action == "consume"
    assert abs((g.power_w + m.power_w) - 4000) <= W          # all surplus soaked
    assert abs(g.power_w / m.power_w - 15 / 5.12) < 0.05      # ratio = capacity


def test_tier_charge_clamps_marstek_residual_to_goodwe():
    # Big surplus, big gap → marstek would get > 2500, clamps, rest → goodwe.
    r = compute(chain(8000, 1000, {"soc": 30, "target": 90},
                       {"soc": 30, "target": 90}, peak=0))
    g, m = o(r, "goodwe"), o(r, "marstek")
    assert abs(m.power_w - 2000) <= W or m.power_w <= 2500    # within cap
    assert g.power_w + m.power_w <= 7000 + W
    assert m.power_w <= 2500 + W                              # never exceeds hw cap


def test_tier_discharge_split_by_capacity():
    # Deficit, both above min_soc → split by (soc-min)·cap.
    r = compute(chain(0, 3000, {"soc": 60, "target": 30}, {"soc": 60, "target": 30}))
    g, m = o(r, "goodwe"), o(r, "marstek")
    assert g.action == "produce" and m.action == "produce"
    assert g.power_w < 0 and m.power_w < 0
    assert abs((-g.power_w - m.power_w) - 3000) <= W
    assert abs(g.power_w / m.power_w - 15 / 5.12) < 0.05


def test_tier_soc_equalizes_charge():
    # Emptier cell (relative to target) gets the larger share. peak=0 → surplus-
    # bounded so the split (not grid-charge) is what's under test.
    r = compute(chain(4000, 1000, {"soc": 20, "target": 80},
                       {"soc": 60, "target": 80}, peak=0))
    g, m = o(r, "goodwe"), o(r, "marstek")
    assert g.power_w > m.power_w                              # goodwe far below target
    assert abs((g.power_w + m.power_w) - 3000) <= W


def test_tier_no_export_while_room():
    # Surplus fully absorbed → nothing reaches the grid cell (peak=0: no import).
    r = compute(chain(5000, 1000, {"soc": 30, "target": 50},
                       {"soc": 30, "target": 50}, peak=0))
    assert abs(r.details["net"]["rest_in_w"]) <= W
    assert "tier" in r.details["goodwe"] and r.details["goodwe"]["tier"] is True


def test_tier_full_cell_drops_out():
    # marstek full (SoC ≥ max) → all charge goes to goodwe (peak=0: surplus only).
    r = compute(chain(3000, 1000, {"soc": 40, "target": 80},
                       {"soc": 95, "target": 80}, peak=0))
    g, m = o(r, "goodwe"), o(r, "marstek")
    assert abs(g.power_w - 2000) <= W                         # goodwe takes the 2000
    assert m.power_w == 0.0


def test_tier_slider_zero_blocks_one_cell():
    # marstek take_pct 0 → blocked; goodwe takes everything (peak=0: surplus only).
    r = compute(chain(3000, 1000,
                       {"soc": 30, "target": 80},
                       {"soc": 30, "target": 80, "take": 0}, peak=0))
    g, m = o(r, "goodwe"), o(r, "marstek")
    assert m.action == "idle" and m.power_w == 0.0
    assert abs(g.power_w - 2000) <= W


# --- Target-band latch (the user's exact rule) ---

def test_tier_no_discharge_below_target_band():
    # Both batteries below target−delta (band 47–53) → must NOT discharge on a
    # deficit. peak=0 → no grid headroom, so they simply hold and the load is
    # imported from grid. The target always holds (a below-target cell never
    # discharges).
    r = compute(chain(0, 3000, {"soc": 40, "target": 50},
                       {"soc": 40, "target": 50}, peak=0))
    g, m = o(r, "goodwe"), o(r, "marstek")
    assert g.power_w == 0.0 and m.power_w == 0.0
    assert g.action == "idle" and m.action == "idle"
    # Deficit fully reaches the grid (import).
    assert abs(r.details["net"]["rest_in_w"] + 3000) <= W


def test_tier_grid_charge_below_band_up_to_peak():
    # Below the band with a deficit and peak headroom → grid-charge toward target,
    # but total grid import never exceeds the peak ceiling.
    # solar 0, house 1000 → deficit 1000; peak 3500 → 2500 import room for charging.
    r = compute(chain(0, 1000, {"soc": 30, "target": 50},
                      {"soc": 30, "target": 50}, peak=3500))
    g, m = o(r, "goodwe"), o(r, "marstek")
    assert g.action == "consume" and m.action == "consume"   # charging, not holding
    assert g.power_w > 0 and m.power_w > 0
    # Grid import = charge + house deficit, capped at the peak (3500).
    grid_import = -r.details["net"]["rest_in_w"]
    assert abs(grid_import - 3500) <= 5                       # rides the peak ceiling
    assert g.power_w + m.power_w <= 2500 + W                  # charge ≤ import room


def test_tier_discharge_floors_at_target_band():
    # SoC sitting on the band floor (target−delta = 27) → discharge tapers to 0,
    # so the battery stops at the bottom of the band, not at min_soc.
    cells = chain(0, 3000, {"soc": 27, "target": 30}, {"soc": 27, "target": 30})
    cells[2][1].prev_action = "produce"   # goodwe was discharging (latched)
    cells[3][1].prev_action = "produce"   # marstek was discharging (latched)
    r = compute(cells)
    g, m = o(r, "goodwe"), o(r, "marstek")
    assert g.power_w == 0.0 and m.power_w == 0.0       # at floor → held


def test_tier_latch_holds_in_band():
    # In the band (47–53) the previous direction is held:
    #   prev=produce + deficit → keeps discharging
    #   prev=consume + deficit → holds (does not start discharging)
    cells = chain(0, 2000, {"soc": 50, "target": 50}, {"soc": 50, "target": 50})
    cells[2][1].prev_action = "produce"   # goodwe latched to discharge
    cells[3][1].prev_action = "consume"   # marstek latched to charge → hold
    r = compute(cells)
    g, m = o(r, "goodwe"), o(r, "marstek")
    assert g.power_w < 0 and g.action == "produce"     # keeps discharging
    assert m.power_w == 0.0 and m.action == "idle"     # holds


def test_tier_discharge_above_band_to_floor():
    # Above the band (soc 60 > 53) → discharge allowed, weighted by (soc−floor)
    # with floor = target−delta = 47.
    r = compute(chain(0, 3000, {"soc": 60, "target": 50}, {"soc": 60, "target": 50}))
    g, m = o(r, "goodwe"), o(r, "marstek")
    assert g.action == "produce" and m.action == "produce"
    assert abs((-g.power_w - m.power_w) - 3000) <= W
    assert abs(g.power_w / m.power_w - 15 / 5.12) < 0.05
