"""Tests for energy balancer chain model — all 6 cells.

Every test builds a full chain: solar → house → auto → goodwe → marstek → net.
All cells use the same interface.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core import CellConfig, CellState, compute

W = 2.0


def make_chain(solar_w=0, house_w=1000, grid_measured_w=0, peak_limit=3500,
               car_kw=None, goodwe_kw=None, marstek_kw=None):
    """Build a full 6-cell chain. Override individual cells via kwargs dicts."""
    ck = car_kw or {}
    gk = goodwe_kw or {}
    mk = marstek_kw or {}

    cells = [
        (CellConfig(id="solar", position=0, mode="supply"),
         CellState(measured_w=solar_w)),

        (CellConfig(id="house", position=1, mode="demand"),
         CellState(measured_w=house_w)),

        (CellConfig(id="car_charger", position=2,
                    mode=ck.get("mode", "off"),
                    can_charge=ck.get("can_charge", True),
                    can_discharge=False,
                    max_charge_w=ck.get("max_charge", 7400),
                    charge_floor_w=ck.get("charge_floor", 1400),
                    take_pct=ck.get("take_pct", 80)),
         CellState(soc=ck.get("soc", 50), measured_w=ck.get("measured", 0),
                   online=ck.get("online", True), prev_action=ck.get("prev", "idle"))),

        (CellConfig(id="goodwe", position=3,
                    mode=gk.get("mode", "smart"),
                    max_charge_w=gk.get("max_charge", 5000),
                    max_discharge_w=gk.get("max_discharge", 4500),
                    capacity_kwh=15, min_soc=10, max_soc=95, has_soc=True,
                    set_flag_on_charge="battery_charge",
                    take_pct=gk.get("take_pct", 75),
                    hysteresis=gk.get("hys", 3),
                    target_soc=gk.get("target", 30)),
         CellState(soc=gk.get("soc", 50), measured_w=gk.get("measured", 0),
                   online=gk.get("online", True), prev_action=gk.get("prev", "idle"))),

        (CellConfig(id="marstek", position=4,
                    mode=mk.get("mode", "self_consumption"),
                    max_charge_w=mk.get("max_charge", 2500),
                    max_discharge_w=mk.get("max_discharge", 2500),
                    capacity_kwh=5.12, min_soc=mk.get("min_soc", 10), max_soc=95, has_soc=True,
                    no_discharge_on_flag="battery_charge",
                    take_pct=mk.get("take_pct", 100)),
         CellState(soc=mk.get("soc", 50), measured_w=mk.get("measured", 0),
                   online=mk.get("online", True), prev_action=mk.get("prev", "idle"))),

        (CellConfig(id="net", position=5, mode="grid", peak_limit_w=peak_limit),
         CellState(measured_w=grid_measured_w)),
    ]
    return cells


def out(r, cell_id):
    return r.outputs[cell_id]


def det(r, cell_id):
    return r.details[cell_id]


# =====================================================================
# A: Solar surplus → charge cascade
# =====================================================================

def test_A1_surplus_charges_goodwe():
    cells = make_chain(solar_w=4000, house_w=1000, goodwe_kw={"soc": 25, "target": 30})
    r = compute(cells)
    assert out(r, "solar").action == "produce"
    assert out(r, "house").action == "consume"
    assert out(r, "goodwe").action == "consume"
    assert out(r, "goodwe").power_w > 0


def test_A2_surplus_cascade_take_pct():
    cells = make_chain(solar_w=6000, house_w=2000,
                       car_kw={"mode": "self_consumption", "soc": 50},
                       goodwe_kw={"soc": 25, "target": 30},
                       marstek_kw={"soc": 50})
    r = compute(cells)
    # Surplus 4000. Car charger 80% of 4000 = 3200 (> floor 1400)
    assert abs(out(r, "car_charger").power_w - 3200) <= W


def test_A3_surplus_below_floor_skips_car_charger():
    cells = make_chain(solar_w=2000, house_w=1000,
                       car_kw={"mode": "self_consumption", "soc": 50},
                       marstek_kw={"soc": 50})
    r = compute(cells)
    # 1000 * 80% = 800 < floor 1400 → car_charger skips
    assert out(r, "car_charger").action == "idle"
    assert out(r, "marstek").action == "consume"


def test_A4_all_full_exports():
    cells = make_chain(solar_w=5000, house_w=1000, grid_measured_w=-4000,
                       goodwe_kw={"soc": 95, "target": 30},
                       marstek_kw={"soc": 95})
    r = compute(cells)
    assert out(r, "net").action == "export"
    assert out(r, "net").power_w < 0


def test_A5_taper_near_max():
    cells = make_chain(solar_w=8000, house_w=1000,
                       goodwe_kw={"soc": 93, "target": 30, "mode": "self_consumption"})
    r = compute(cells)
    # soc 93, max 95 → taper 0.4 × 5000 = 2000
    gw = out(r, "goodwe").power_w
    assert abs(gw - 2000) <= W


# =====================================================================
# B: Night — discharge
# =====================================================================

def test_B1_night_goodwe_self_consumption():
    """Goodwe above target → self_consumption. Discharges to cover deficit."""
    cells = make_chain(solar_w=0, house_w=2000,
                       goodwe_kw={"soc": 60, "target": 30, "measured": -2000},
                       marstek_kw={"soc": 70})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"
    assert out(r, "goodwe").power_w < 0  # discharges
    assert abs(out(r, "goodwe").power_w - (-2000)) <= W


def test_B2_goodwe_self_consumption_marstek_backup():
    """Goodwe above target → self_consumption, maxed at 4500W.
    Marstek covers the rest."""
    cells = make_chain(solar_w=0, house_w=6000,
                       goodwe_kw={"soc": 60, "target": 30, "measured": -4500},
                       marstek_kw={"soc": 70, "measured": -1500})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"
    assert abs(out(r, "goodwe").power_w - (-4500)) <= W
    assert out(r, "marstek").action == "produce"
    assert abs(out(r, "marstek").power_w - (-1500)) <= W


def test_B3_all_empty_grid_imports():
    cells = make_chain(solar_w=0, house_w=2000, grid_measured_w=2000,
                       goodwe_kw={"soc": 10, "target": 10, "hys": 0},
                       marstek_kw={"soc": 10})
    r = compute(cells)
    assert out(r, "net").action == "import"
    assert abs(out(r, "net").power_w - 2000) <= W


def test_B4_discharge_taper_marstek():
    """Goodwe covers 1500W. Marstek not needed."""
    cells = make_chain(solar_w=0, house_w=1500,
                       goodwe_kw={"soc": 50, "target": 30, "measured": -1500},
                       marstek_kw={"soc": 12, "min_soc": 10})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"
    assert abs(out(r, "goodwe").power_w - (-1500)) <= W
    # Marstek not needed — goodwe covered all
    assert out(r, "marstek").power_w == 0


# =====================================================================
# C: Smart mode — charge from grid
# =====================================================================

def test_C1_smart_below_target_charges():
    cells = make_chain(solar_w=0, house_w=1000,
                       goodwe_kw={"soc": 15, "target": 30})
    r = compute(cells)
    assert out(r, "goodwe").action == "consume"
    assert out(r, "goodwe").power_w > 0


def test_C2_smart_above_target_general():
    cells = make_chain(solar_w=0, house_w=2000,
                       goodwe_kw={"soc": 50, "target": 30})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"


def test_C3_smart_charge_limited_by_headroom():
    cells = make_chain(solar_w=0, house_w=2000, peak_limit=3500,
                       goodwe_kw={"soc": 10, "target": 30},
                       marstek_kw={"soc": 10})  # empty, no buffer
    r = compute(cells)
    assert out(r, "goodwe").power_w <= 1500 + W  # 3500 - 2000 headroom
    assert out(r, "net").power_w <= 3500 + W


def test_C4_smart_in_band_keeps_previous():
    # soc 29, target 30, hys 3 → band [27,30], prev=charge → charge
    cells = make_chain(solar_w=0, house_w=500,
                       goodwe_kw={"soc": 29, "target": 30, "prev": "consume"})
    r = compute(cells)
    assert out(r, "goodwe").action == "consume"


def test_C5_smart_in_band_keeps_general():
    cells = make_chain(solar_w=0, house_w=2000,
                       goodwe_kw={"soc": 29, "target": 30, "prev": "autonomous"})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"


def test_C6_smart_surplus_below_target():
    cells = make_chain(solar_w=4000, house_w=1000,
                       goodwe_kw={"soc": 20, "target": 30})
    r = compute(cells)
    assert out(r, "goodwe").action == "consume"
    assert out(r, "goodwe").power_w > 0


def test_C7_smart_surplus_above_target():
    """Above target + surplus → self_consumption. Charges from surplus.
    Marstek gets the remainder."""
    cells = make_chain(solar_w=4000, house_w=1000,
                       goodwe_kw={"soc": 50, "target": 30, "measured": 2250},
                       marstek_kw={"soc": 50})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"
    assert out(r, "goodwe").power_w > 0  # charges from surplus
    # marstek gets the rest
    assert out(r, "marstek").action == "consume"


# =====================================================================
# D: No roundtripping
# =====================================================================

def test_D1_marstek_doesnt_feed_goodwe():
    cells = make_chain(solar_w=0, house_w=773,
                       goodwe_kw={"soc": 15, "target": 30},
                       marstek_kw={"soc": 93})
    r = compute(cells)
    assert out(r, "goodwe").action == "consume"
    # Marstek sees deficit (house + gw charge). It MAY discharge to
    # reduce grid import — that's helping the grid, not feeding goodwe.
    # But grid should stay under peak.
    assert out(r, "net").power_w <= 3500 + W


def test_D2_self_consumption_never_charges_from_grid():
    cells = make_chain(solar_w=0, house_w=1000,
                       marstek_kw={"soc": 20})
    r = compute(cells)
    assert out(r, "marstek").action != "consume"


# =====================================================================
# E: Headroom / peak
# =====================================================================

def test_E1_headroom_passthrough():
    """Headroom = peak_limit only, no buffer from downstream."""
    cells = make_chain(solar_w=0, house_w=500, peak_limit=3500,
                       goodwe_kw={"soc": 10, "target": 30},
                       marstek_kw={"soc": 80, "measured": -2000})
    r = compute(cells)
    det_gw = det(r, "goodwe")
    assert det_gw["headroom_w"] == 3500

def test_E1b_headroom_not_inflated_when_idle():
    """Marstek not discharging (measured 0) → no buffer added."""
    cells = make_chain(solar_w=0, house_w=500, peak_limit=3500,
                       goodwe_kw={"soc": 10, "target": 30},
                       marstek_kw={"soc": 80, "measured": 0})
    r = compute(cells)
    det_gw = det(r, "goodwe")
    assert det_gw["headroom_w"] == 3500


def test_E2_no_buffer_when_empty():
    cells = make_chain(solar_w=0, house_w=500, peak_limit=3500,
                       goodwe_kw={"soc": 10, "target": 30},
                       marstek_kw={"soc": 10})  # empty, no buffer
    r = compute(cells)
    det_gw = det(r, "goodwe")
    assert det_gw["headroom_w"] == 3500


def test_E3_charge_doesnt_exceed_peak():
    for house in [500, 1000, 2000, 3000]:
        cells = make_chain(solar_w=0, house_w=house, peak_limit=3500,
                           goodwe_kw={"soc": 10, "target": 30},
                           marstek_kw={"soc": 10})
        r = compute(cells)
        assert out(r, "net").power_w <= 3500 + W, f"house={house}"


# =====================================================================
# F: Evening peak
# =====================================================================

def test_F1_evening_peak():
    """Goodwe self_consumption covers 4200W. Marstek not needed."""
    cells = make_chain(solar_w=0, house_w=4200,
                       goodwe_kw={"soc": 70, "target": 30, "measured": -4200},
                       marstek_kw={"soc": 80})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"
    assert abs(out(r, "goodwe").power_w - (-4200)) <= W
    assert out(r, "marstek").power_w == 0  # not needed


def test_F2_both_above_target():
    """Both above target → both self_consumption. Grid imports."""
    cells = make_chain(solar_w=0, house_w=8000,
                       goodwe_kw={"soc": 70, "target": 30},
                       marstek_kw={"soc": 80})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"
    assert abs(out(r, "marstek").power_w - (-2500)) <= W


# =====================================================================
# G: Balanced
# =====================================================================

def test_G1_solar_equals_house():
    cells = make_chain(solar_w=2000, house_w=2000,
                       goodwe_kw={"soc": 50, "target": 30})
    r = compute(cells)
    assert abs(out(r, "net").power_w) <= W


# =====================================================================
# H: Offline / off
# =====================================================================

def test_H1_offline_passes_through():
    cells = make_chain(solar_w=0, house_w=2000,
                       goodwe_kw={"soc": 50, "online": False},
                       marstek_kw={"soc": 60})
    r = compute(cells)
    assert out(r, "goodwe").action == "offline"
    assert out(r, "marstek").action == "produce"


def test_H2_off_passes_through():
    cells = make_chain(solar_w=3000, house_w=1000,
                       marstek_kw={"soc": 50})
    r = compute(cells)
    assert out(r, "car_charger").action == "off"  # default mode
    assert out(r, "marstek").action == "consume"


# =====================================================================
# I: Chain consistency — rest flows correctly
# =====================================================================

def test_I1_rest_flows_through_chain():
    cells = make_chain(solar_w=5000, house_w=1000,
                       goodwe_kw={"soc": 25, "target": 30},
                       marstek_kw={"soc": 50})
    r = compute(cells)
    # Solar rest_out = 5000
    assert abs(det(r, "solar")["rest_out_w"] - 5000) <= W
    # House rest_out = 5000 - 1000 = 4000
    assert abs(det(r, "house")["rest_out_w"] - 4000) <= W
    # Each subsequent cell's rest_in = previous cell's rest_out
    assert abs(det(r, "car_charger")["rest_in_w"] - det(r, "house")["rest_out_w"]) <= W
    assert abs(det(r, "goodwe")["rest_in_w"] - det(r, "car_charger")["rest_out_w"]) <= W
    assert abs(det(r, "marstek")["rest_in_w"] - det(r, "goodwe")["rest_out_w"]) <= W
    assert abs(det(r, "net")["rest_in_w"] - det(r, "marstek")["rest_out_w"]) <= W


def test_I2_grid_predicted_consistency():
    cells = make_chain(solar_w=3000, house_w=1500,
                       goodwe_kw={"soc": 25, "target": 30},
                       marstek_kw={"soc": 50})
    r = compute(cells)
    # grid_predicted = net's power_w
    assert abs(r.grid_predicted_w - out(r, "net").power_w) <= W


# =====================================================================
# J: Urgency
# =====================================================================

def test_J1_far_below_target_high_urgency():
    cells = make_chain(solar_w=0, house_w=500, peak_limit=3500,
                       goodwe_kw={"soc": 10, "target": 40},
                       marstek_kw={"soc": 10})
    r = compute(cells)
    # deficit 30% → urgency 1.0 → want 5000, headroom 3500-500=3000
    assert abs(out(r, "goodwe").power_w - 3000) <= W


def test_J2_just_below_target_low_urgency():
    cells = make_chain(solar_w=0, house_w=500, peak_limit=3500,
                       goodwe_kw={"soc": 36, "target": 40},
                       marstek_kw={"soc": 10})
    r = compute(cells)
    # deficit 4% → urgency 0.2 → want 1000, headroom 3000
    assert out(r, "goodwe").power_w <= 1000 + W


# =====================================================================
# K: Hysteresis transitions
# =====================================================================

def test_K1_enters_charge():
    cells = make_chain(solar_w=0, house_w=500,
                       goodwe_kw={"soc": 26, "target": 30, "hys": 3, "prev": "idle"})
    r = compute(cells)
    assert out(r, "goodwe").action == "consume"


def test_K2_enters_discharge():
    cells = make_chain(solar_w=0, house_w=2000,
                       goodwe_kw={"soc": 30, "target": 30, "prev": "consume"})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"


def test_K3_stays_charge_in_band():
    cells = make_chain(solar_w=0, house_w=500,
                       goodwe_kw={"soc": 29, "target": 30, "hys": 3, "prev": "consume"})
    r = compute(cells)
    assert out(r, "goodwe").action == "consume"


def test_K4_stays_discharge_in_band():
    cells = make_chain(solar_w=0, house_w=2000,
                       goodwe_kw={"soc": 28, "target": 30, "hys": 3, "prev": "autonomous"})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"


# =====================================================================
# L: Solar and house cells
# =====================================================================

def test_L1_solar_adds_to_rest():
    cells = make_chain(solar_w=3000, house_w=0)
    r = compute(cells)
    assert abs(det(r, "solar")["rest_in_w"]) <= W  # starts at 0
    assert abs(det(r, "solar")["rest_out_w"] - 3000) <= W


def test_L2_house_subtracts_from_rest():
    cells = make_chain(solar_w=5000, house_w=2000)
    r = compute(cells)
    assert abs(det(r, "house")["rest_in_w"] - 5000) <= W
    assert abs(det(r, "house")["rest_out_w"] - 3000) <= W


def test_L3_net_absorbs_remainder():
    cells = make_chain(solar_w=5000, house_w=1000, grid_measured_w=-4000,
                       goodwe_kw={"soc": 95, "target": 30},
                       marstek_kw={"soc": 95})
    r = compute(cells)
    assert out(r, "net").action == "export"
    # All cells full → all surplus exported
    assert abs(out(r, "net").power_w - (-4000)) <= W


# =====================================================================
# M: State persistence
# =====================================================================

def test_M1_prev_action_saved():
    cells = make_chain(solar_w=0, house_w=500,
                       goodwe_kw={"soc": 20, "target": 30})
    r = compute(cells)
    assert out(r, "goodwe").action == "consume"
    # Check that the CellState was updated
    gw_state = cells[3][1]  # goodwe is position 3
    assert gw_state.prev_action == "consume"


# =====================================================================
# N: Charge-only cell
# =====================================================================

def test_N1_car_charger_never_discharges():
    cells = make_chain(solar_w=0, house_w=3000,
                       car_kw={"mode": "self_consumption", "soc": 80})
    r = compute(cells)
    assert out(r, "car_charger").power_w >= 0  # never negative


# =====================================================================
# O: Slider controls
# =====================================================================

def test_O1_take_pct_zero_no_consume():
    """Slider op 0 = cel neemt niks op, surplus gaat door."""
    cells = make_chain(solar_w=5000, house_w=1000,
                       goodwe_kw={"soc": 25, "target": 30})
    # Override take_pct to 0
    for cfg, st in cells:
        if cfg.id == "goodwe":
            cfg.take_pct = 0
    r = compute(cells)
    assert out(r, "goodwe").power_w == 0
    # Surplus flows to marstek
    assert out(r, "marstek").action == "consume"


def test_O2_take_pct_zero_smart_no_grid_charge():
    """Smart mode + slider 0 = ook geen grid charge."""
    cells = make_chain(solar_w=0, house_w=500,
                       goodwe_kw={"soc": 15, "target": 30})
    for cfg, st in cells:
        if cfg.id == "goodwe":
            cfg.take_pct = 0
    r = compute(cells)
    assert out(r, "goodwe").power_w == 0
    assert out(r, "goodwe").action == "idle"


def test_O3_take_pct_partial():
    """Slider op 50% = cel neemt helft van surplus."""
    cells = make_chain(solar_w=5000, house_w=1000,
                       goodwe_kw={"soc": 50, "target": 30, "measured": 2000})
    for cfg, st in cells:
        if cfg.id == "goodwe":
            cfg.take_pct = 50
    r = compute(cells)
    # self_consumption above target: takes 50% of 4000 = 2000
    assert abs(out(r, "goodwe").power_w - 2000) <= W


# =====================================================================
# P: Multiple scenarios with all 6 cells visible
# =====================================================================

def test_O1_sunny_day_full_chain():
    cells = make_chain(solar_w=8000, house_w=2000,
                       car_kw={"mode": "self_consumption", "soc": 50},
                       goodwe_kw={"soc": 25, "target": 30},
                       marstek_kw={"soc": 50})
    r = compute(cells)
    # All 6 cells have outputs
    assert len(r.outputs) == 6
    assert len(r.details) == 6
    for cell_id in ["solar", "house", "car_charger", "goodwe", "marstek", "net"]:
        assert cell_id in r.outputs
        assert cell_id in r.details
        assert "rest_in_w" in r.details[cell_id]
        assert "rest_out_w" in r.details[cell_id]
        assert "headroom_w" in r.details[cell_id]
        assert "successor_power_w" in r.details[cell_id]


def test_O2_night_low_soc_full_chain():
    """Goodwe charges from grid (smart, low SoC). Marstek sees battery_charge
    flag → won't discharge to feed goodwe."""
    cells = make_chain(solar_w=0, house_w=800,
                       goodwe_kw={"soc": 15, "target": 30},
                       marstek_kw={"soc": 80})
    r = compute(cells)
    assert out(r, "solar").action == "produce"
    assert out(r, "house").action == "consume"
    assert out(r, "car_charger").action == "off"
    assert out(r, "goodwe").action == "consume"
    # Marstek idle: won't discharge to feed goodwe's charge
    assert out(r, "marstek").action == "idle"
    assert out(r, "net").power_w <= 3500 + W


# =====================================================================
# R: Roundtrip prevention (battery_charge flag)
# =====================================================================

def test_R1_goodwe_charges_marstek_wont_discharge():
    """Goodwe smart charges from surplus → sets battery_charge flag.
    Marstek sees flag → won't discharge."""
    cells = make_chain(solar_w=3000, house_w=2000,
                       goodwe_kw={"soc": 20, "target": 40},
                       marstek_kw={"soc": 80})
    r = compute(cells)
    assert out(r, "goodwe").action == "consume"
    assert out(r, "goodwe").power_w > 0
    # Marstek should NOT discharge to feed goodwe
    assert out(r, "marstek").power_w >= 0, \
        f"Marstek should not discharge: {out(r, 'marstek').power_w}"


def test_R2_no_flag_no_charge_marstek_discharges():
    """Night: goodwe above target → self_consumption discharge → no flag.
    Marstek sees no flag → discharges for real deficit."""
    cells = make_chain(solar_w=0, house_w=5000,
                       goodwe_kw={"soc": 60, "target": 30, "measured": -4500},
                       marstek_kw={"soc": 80, "measured": -500})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"
    assert out(r, "goodwe").power_w < 0  # discharging
    # No battery_charge flag → marstek can discharge
    assert out(r, "marstek").action == "produce"
    assert out(r, "marstek").power_w < 0


def test_R3_both_charge_from_surplus_no_roundtrip():
    """Big surplus: goodwe charges, marstek charges. No discharge."""
    cells = make_chain(solar_w=6000, house_w=2000,
                       goodwe_kw={"soc": 30, "target": 30},
                       marstek_kw={"soc": 50})
    r = compute(cells)
    assert out(r, "goodwe").power_w >= 0
    assert out(r, "marstek").power_w >= 0
    total = out(r, "goodwe").power_w + out(r, "marstek").power_w
    assert total <= 4000 + W  # surplus = 4000


def test_R4_goodwe_eco_charge_marstek_idle():
    """Goodwe smart below target, small surplus. Charges → flag set.
    Marstek sees flag + deficit from goodwe's charge → idle, not discharge."""
    cells = make_chain(solar_w=1000, house_w=800,
                       goodwe_kw={"soc": 15, "target": 30},
                       marstek_kw={"soc": 90})
    r = compute(cells)
    assert out(r, "goodwe").action == "consume"
    # After goodwe takes surplus, rest goes negative
    # Marstek sees deficit BUT battery_charge flag → won't discharge
    assert out(r, "marstek").power_w >= 0


def test_R5_non_battery_ignores_flag():
    """Car charger is not a battery → ignores battery_charge flag."""
    cells = make_chain(solar_w=3000, house_w=1000,
                       car_kw={"mode": "self_consumption", "soc": 50},
                       goodwe_kw={"soc": 20, "target": 40},
                       marstek_kw={"soc": 80})
    r = compute(cells)
    # Car charger should still work normally despite any flags
    assert out(r, "car_charger").action in ["consume", "idle"]


# =====================================================================
# Runner
# =====================================================================

if __name__ == "__main__":
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    passed = failed = 0
    for t in tests:
        try:
            t()
            print(f"  PASS  {t.__name__}")
            passed += 1
        except (AssertionError, Exception) as e:
            label = "FAIL" if isinstance(e, AssertionError) else "ERROR"
            print(f"  {label} {t.__name__}: {e}")
            failed += 1
    print(f"\n{passed} passed, {failed} failed out of {passed + failed}")
    sys.exit(1 if failed else 0)
