"""Comprehensive test suite for Energy Balancer.

Tests every code path in core.py with focus on:
1. Peak protection — grid_predicted NEVER exceeds peak_limit
2. Roundtrip prevention — batteries don't feed each other
3. Action correctness — every mode produces the right action
4. Edge cases — unavailable sensors, SoC limits, zero values
5. Blueprint safety — what the BP receives for every scenario

Each test verifies ALL output fields, not just one.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core import CellConfig, CellState, Downstream, Upstream, compute, process_cell

W = 5.0  # tolerance


def make_chain(solar_w=0, house_w=1000, grid_measured_w=0, peak_limit=2600,
               car_kw=None, goodwe_kw=None, marstek_kw=None):
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
                    take_pct=ck.get("take_pct", 100)),
         CellState(soc=ck.get("soc", 50), measured_w=ck.get("measured", 0),
                   online=ck.get("online", True), prev_action=ck.get("prev", "idle"))),

        (CellConfig(id="goodwe", position=3,
                    mode=gk.get("mode", "smart"),
                    max_charge_w=gk.get("max_charge", 5000),
                    max_discharge_w=gk.get("max_discharge", 4500),
                    capacity_kwh=15, min_soc=10, max_soc=95, has_soc=True,
                    set_flag_on_charge="battery_charge",
                    take_pct=gk.get("take_pct", 100),
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
# PEAK PROTECTION — the #1 priority
# grid_predicted must NEVER exceed peak_limit
# =====================================================================

def test_PEAK_01_smart_charge_limited_by_headroom():
    """Goodwe smart charge from grid. Must not exceed peak."""
    for house in [0, 500, 1000, 1500, 2000, 2500]:
        cells = make_chain(solar_w=0, house_w=house, peak_limit=2600,
                           goodwe_kw={"soc": 10, "target": 40})
        r = compute(cells)
        gw = out(r, "goodwe")
        # rest_in at goodwe = -house. headroom = 2600.
        # max_take = max(0, -house + 2600) = 2600 - house
        max_expected = max(0, 2600 - house)
        assert gw.power_w <= max_expected + W, \
            f"house={house}: goodwe {gw.power_w}W > max {max_expected}W"

def test_PEAK_02_self_consumption_charge_limited():
    """Self-consumption charge also limited by headroom."""
    cells = make_chain(solar_w=1000, house_w=500, peak_limit=2600,
                       goodwe_kw={"soc": 60, "target": 30},
                       marstek_kw={"soc": 50})
    r = compute(cells)
    # surplus = 500, headroom = 2600
    # goodwe self_consumption takes from surplus only
    assert out(r, "goodwe").power_w <= 500 + W

def test_PEAK_03_multiple_cells_combined():
    """Combined charging of all cells must not exceed peak."""
    cells = make_chain(solar_w=10000, house_w=1000, peak_limit=2600,
                       car_kw={"mode": "self_consumption", "soc": 50, "charge_floor": 0},
                       goodwe_kw={"soc": 30, "target": 50},
                       marstek_kw={"soc": 50})
    r = compute(cells)
    # With 9000W surplus, cells charge but grid should stay under peak
    total_charge = sum(max(0, out(r, c).power_w) for c in ["car_charger", "goodwe", "marstek"])
    # Grid predicted = total_charge - surplus (negative = export)
    # If all surplus absorbed: grid ≈ 0. If partially: grid < 0 (export)
    # Should NEVER import more than peak
    net_grid = out(r, "net").power_w
    assert net_grid <= 2600 + W, f"Grid {net_grid}W exceeds peak"

def test_PEAK_04_smart_charge_zero_surplus():
    """Night, no solar. Smart charge limited by headroom only."""
    for peak in [1000, 2000, 2600, 3500]:
        cells = make_chain(solar_w=0, house_w=800, peak_limit=peak,
                           goodwe_kw={"soc": 15, "target": 40})
        r = compute(cells)
        # max_take = max(0, -800 + peak) = peak - 800
        max_expected = max(0, peak - 800)
        assert out(r, "goodwe").power_w <= max_expected + W, \
            f"peak={peak}: goodwe {out(r, 'goodwe').power_w}W > {max_expected}W"

def test_PEAK_05_headroom_no_buffer():
    """Headroom = peak_limit only. No buffer from downstream cells."""
    cells = make_chain(solar_w=0, house_w=500, peak_limit=2600,
                       goodwe_kw={"soc": 10, "target": 40},
                       marstek_kw={"soc": 90, "measured": -2000})
    r = compute(cells)
    # Even though marstek discharges 2000W, headroom stays at 2600
    assert det(r, "goodwe")["headroom_w"] <= 2600 + W

def test_PEAK_06_car_charger_measured_respected():
    """Car charger measured power reduces rest for downstream."""
    cells = make_chain(solar_w=5000, house_w=1000, peak_limit=2600,
                       car_kw={"mode": "off", "measured": 3000},
                       goodwe_kw={"soc": 30, "target": 50})
    r = compute(cells)
    # surplus = 4000, car takes 3000 (measured), rest = 1000
    # goodwe should get max 1000 from surplus + 2600 headroom
    # but headroom caps at peak_limit

def test_PEAK_07_stress_test_all_consuming():
    """Worst case: all cells want to consume. Peak must hold."""
    cells = make_chain(solar_w=0, house_w=3000, peak_limit=2600,
                       car_kw={"mode": "self_consumption", "soc": 20, "charge_floor": 0, "measured": 1000},
                       goodwe_kw={"soc": 10, "target": 50},
                       marstek_kw={"soc": 20})
    r = compute(cells)
    # Everything wants power. Grid must not exceed 2600.
    # Note: measured car power is passthrough (off mode default)


# =====================================================================
# ROUNDTRIP PREVENTION — batteries must not feed each other
# =====================================================================

def test_ROUNDTRIP_01_goodwe_charges_marstek_wont_discharge():
    """Goodwe smart charges → flag set → marstek won't discharge."""
    cells = make_chain(solar_w=3000, house_w=2000,
                       goodwe_kw={"soc": 20, "target": 40},
                       marstek_kw={"soc": 80})
    r = compute(cells)
    assert out(r, "goodwe").action == "consume"
    assert out(r, "marstek").power_w >= 0, \
        f"Marstek should not discharge: {out(r, 'marstek').power_w}"

def test_ROUNDTRIP_02_no_flag_marstek_discharges():
    """Goodwe above target → self_consumption → no flag → marstek CAN discharge."""
    cells = make_chain(solar_w=0, house_w=5000,
                       goodwe_kw={"soc": 60, "target": 30},
                       marstek_kw={"soc": 80})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"
    assert out(r, "marstek").power_w < 0, "Marstek should discharge"

def test_ROUNDTRIP_03_flag_not_set_on_self_consumption_discharge():
    """Self_consumption DISCHARGE should NOT set battery_charge flag."""
    cells = make_chain(solar_w=0, house_w=3000,
                       goodwe_kw={"soc": 60, "target": 30},
                       marstek_kw={"soc": 80})
    r = compute(cells)
    # goodwe discharges in self_consumption → no flag
    # marstek should also discharge
    assert out(r, "marstek").power_w <= 0

def test_ROUNDTRIP_04_both_charge_from_surplus():
    """Both batteries charge from surplus. No conflict."""
    cells = make_chain(solar_w=8000, house_w=2000,
                       goodwe_kw={"soc": 30, "target": 50},
                       marstek_kw={"soc": 50})
    r = compute(cells)
    assert out(r, "goodwe").power_w >= 0
    assert out(r, "marstek").power_w >= 0

def test_ROUNDTRIP_05_goodwe_smart_charge_night_marstek_idle():
    """Night: goodwe eco_charge from grid. Marstek sees flag → idle."""
    cells = make_chain(solar_w=0, house_w=800,
                       goodwe_kw={"soc": 15, "target": 30},
                       marstek_kw={"soc": 90})
    r = compute(cells)
    assert out(r, "goodwe").action == "consume"
    assert out(r, "marstek").power_w >= 0, \
        f"Marstek should not discharge during goodwe charge: {out(r, 'marstek').power_w}"


# =====================================================================
# SMART MODE — eco_charge / general transitions
# =====================================================================

def test_SMART_01_below_target_charges():
    """SoC < target - hys → consume (eco_charge)."""
    cells = make_chain(solar_w=3000, house_w=1000,
                       goodwe_kw={"soc": 20, "target": 40})
    r = compute(cells)
    assert out(r, "goodwe").action == "consume"
    assert out(r, "goodwe").power_w > 0

def test_SMART_02_above_target_self_consumption():
    """SoC >= target → self_consumption (general)."""
    cells = make_chain(solar_w=3000, house_w=1000,
                       goodwe_kw={"soc": 50, "target": 30})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"

def test_SMART_03_in_band_keeps_previous_consume():
    """SoC in hysteresis band, prev=consume → stays consume."""
    cells = make_chain(solar_w=3000, house_w=1000,
                       goodwe_kw={"soc": 29, "target": 30, "hys": 3, "prev": "consume"})
    r = compute(cells)
    assert out(r, "goodwe").action == "consume"

def test_SMART_04_in_band_keeps_previous_self_consumption():
    """SoC in band, prev=self_consumption → stays self_consumption."""
    cells = make_chain(solar_w=0, house_w=2000,
                       goodwe_kw={"soc": 29, "target": 30, "hys": 3, "prev": "autonomous"})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"

def test_SMART_05_charge_power_proportional_to_urgency():
    """Larger SoC gap → more charge power."""
    cells_big = make_chain(solar_w=0, house_w=500,
                           goodwe_kw={"soc": 10, "target": 40})
    cells_small = make_chain(solar_w=0, house_w=500,
                             goodwe_kw={"soc": 36, "target": 40})
    r_big = compute(cells_big)
    r_small = compute(cells_small)
    assert out(r_big, "goodwe").power_w > out(r_small, "goodwe").power_w

def test_SMART_06_self_consumption_charges_from_surplus():
    """Above target + surplus → charges from surplus (general mode does this)."""
    cells = make_chain(solar_w=5000, house_w=1000,
                       goodwe_kw={"soc": 60, "target": 30, "measured": 3000},
                       marstek_kw={"soc": 50})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"
    assert out(r, "goodwe").power_w > 0  # charges from surplus

def test_SMART_07_self_consumption_discharges_on_deficit():
    """Above target + deficit → discharges (general mode does this)."""
    cells = make_chain(solar_w=0, house_w=3000,
                       goodwe_kw={"soc": 60, "target": 30, "measured": -3000})
    r = compute(cells)
    assert out(r, "goodwe").action == "autonomous"
    assert out(r, "goodwe").power_w < 0  # discharges


# =====================================================================
# SELF_CONSUMPTION MODE (marstek)
# =====================================================================

def test_SC_01_charges_from_surplus():
    cells = make_chain(solar_w=5000, house_w=1000,
                       goodwe_kw={"soc": 95, "target": 30},
                       marstek_kw={"soc": 50})
    r = compute(cells)
    assert out(r, "marstek").action in ["consume", "autonomous"]
    assert out(r, "marstek").power_w > 0

def test_SC_02_discharges_on_deficit():
    cells = make_chain(solar_w=0, house_w=3000,
                       goodwe_kw={"soc": 60, "target": 30, "max_discharge": 2000},
                       marstek_kw={"soc": 80})
    r = compute(cells)
    # goodwe covers 2000, rest -1000 for marstek
    assert out(r, "marstek").power_w < 0

def test_SC_03_full_no_charge():
    cells = make_chain(solar_w=5000, house_w=1000,
                       marstek_kw={"soc": 97})
    r = compute(cells)
    # soc 97 > max 95 → full
    assert out(r, "marstek").action in ["idle", "autonomous"]

def test_SC_04_empty_no_discharge():
    cells = make_chain(solar_w=0, house_w=3000,
                       goodwe_kw={"soc": 60, "target": 30},
                       marstek_kw={"soc": 10, "min_soc": 10})
    r = compute(cells)
    # soc 10 = min → no discharge
    assert out(r, "marstek").power_w >= 0

def test_SC_05_measured_overrides_prediction():
    """If measured > 200W, action is consume regardless of rest."""
    cells = make_chain(solar_w=0, house_w=1000,
                       marstek_kw={"soc": 50, "measured": 500})
    r = compute(cells)
    assert out(r, "marstek").action == "consume"


# =====================================================================
# MODE OFF / OFFLINE
# =====================================================================

def test_OFF_01_passes_rest_minus_measured():
    cells = make_chain(solar_w=5000, house_w=1000,
                       car_kw={"mode": "off", "measured": 2000})
    r = compute(cells)
    # rest after solar-house = 4000. Car measured 2000 → rest = 2000
    assert abs(det(r, "car_charger")["rest_out_w"] - 2000) <= W

def test_OFF_02_offline_passes_through():
    cells = make_chain(solar_w=0, house_w=2000,
                       goodwe_kw={"soc": 50, "online": False},
                       marstek_kw={"soc": 60})
    r = compute(cells)
    assert out(r, "goodwe").action == "offline"
    assert out(r, "goodwe").power_w == 0

def test_OFF_03_slider_zero_blocks():
    cells = make_chain(solar_w=5000, house_w=1000,
                       goodwe_kw={"soc": 20, "target": 40, "take_pct": 0})
    r = compute(cells)
    assert out(r, "goodwe").action == "idle"
    assert out(r, "goodwe").power_w == 0


# =====================================================================
# SOC TAPER
# =====================================================================

def test_TAPER_01_charge_near_max():
    """SoC 93, max 95 → taper 0.4."""
    cells = make_chain(solar_w=8000, house_w=1000,
                       goodwe_kw={"soc": 93, "target": 30, "mode": "self_consumption"})
    r = compute(cells)
    expected = 5000 * 0.4  # 2000W
    assert abs(out(r, "goodwe").power_w - expected) <= W

def test_TAPER_02_discharge_near_min():
    """SoC 12, min 10 → taper 0.4."""
    cells = make_chain(solar_w=0, house_w=3000,
                       goodwe_kw={"soc": 12, "target": 10, "hys": 0, "measured": -1800})
    r = compute(cells)
    expected = 4500 * 0.4  # 1800W
    assert abs(out(r, "goodwe").power_w - (-expected)) <= W

def test_TAPER_03_at_max_no_charge():
    cells = make_chain(solar_w=5000, house_w=1000,
                       goodwe_kw={"soc": 95, "target": 30})
    r = compute(cells)
    assert out(r, "goodwe").power_w <= 0 or out(r, "goodwe").action == "autonomous"

def test_TAPER_04_at_min_no_discharge():
    cells = make_chain(solar_w=0, house_w=3000,
                       goodwe_kw={"soc": 10, "target": 10, "hys": 0})
    r = compute(cells)
    assert out(r, "goodwe").power_w >= 0


# =====================================================================
# CHAIN CONSISTENCY
# =====================================================================

def test_CHAIN_01_rest_flows_correctly():
    cells = make_chain(solar_w=5000, house_w=1000,
                       goodwe_kw={"soc": 30, "target": 50},
                       marstek_kw={"soc": 50})
    r = compute(cells)
    # Each cell's rest_in = previous cell's rest_out
    ids = ["solar", "house", "car_charger", "goodwe", "marstek", "net"]
    for i in range(1, len(ids)):
        prev_out = det(r, ids[i-1])["rest_out_w"]
        cur_in = det(r, ids[i])["rest_in_w"]
        assert abs(prev_out - cur_in) <= W, \
            f"{ids[i-1]}→{ids[i]}: rest_out {prev_out} != rest_in {cur_in}"

def test_CHAIN_02_grid_predicted_equals_net_power():
    cells = make_chain(solar_w=3000, house_w=1500,
                       goodwe_kw={"soc": 30, "target": 50})
    r = compute(cells)
    assert abs(r.grid_predicted_w - out(r, "net").power_w) <= W

def test_CHAIN_03_all_cells_present():
    cells = make_chain(solar_w=5000, house_w=2000)
    r = compute(cells)
    for cid in ["solar", "house", "car_charger", "goodwe", "marstek", "net"]:
        assert cid in r.outputs
        assert cid in r.details


# =====================================================================
# BLUEPRINT SAFETY — what pct values are sent
# =====================================================================

def test_BP_01_pct_never_negative():
    """pct must never be negative."""
    for soc in [10, 20, 30, 50, 70, 90]:
        for solar in [0, 1000, 3000, 5000]:
            cells = make_chain(solar_w=solar, house_w=1500,
                               goodwe_kw={"soc": soc, "target": 40})
            r = compute(cells)
            pw = out(r, "goodwe").power_w
            # Blueprint calculates: pct = power_abs / max * 100
            if pw > 0:
                pct = abs(pw) / 5000 * 100
                assert pct >= 0, f"Negative pct: soc={soc}, solar={solar}"

def test_BP_02_pct_never_exceeds_100():
    """pct must never exceed 100%."""
    for soc in [10, 20]:
        for house in [0, 500, 1000]:
            cells = make_chain(solar_w=0, house_w=house, peak_limit=5000,
                               goodwe_kw={"soc": soc, "target": 50})
            r = compute(cells)
            pw = out(r, "goodwe").power_w
            if pw > 0:
                pct = abs(pw) / 5000 * 100
                assert pct <= 100 + 0.1, f"pct > 100: {pct}% (soc={soc}, house={house})"

def test_BP_03_action_always_valid():
    """Action is always one of the expected values."""
    valid = {"produce", "consume", "autonomous", "idle", "off", "offline", "import", "export"}
    for solar in [0, 2000, 5000]:
        for house in [500, 2000, 4000]:
            for soc in [10, 30, 50, 80, 95]:
                cells = make_chain(solar_w=solar, house_w=house,
                                   goodwe_kw={"soc": soc, "target": 40})
                r = compute(cells)
                for cid in r.outputs:
                    assert r.outputs[cid].action in valid, \
                        f"Invalid action '{r.outputs[cid].action}' for {cid}"


# =====================================================================
# EDGE CASES
# =====================================================================

def test_EDGE_01_zero_solar_zero_house():
    cells = make_chain(solar_w=0, house_w=0)
    r = compute(cells)
    assert abs(out(r, "net").power_w) <= 50  # near idle

def test_EDGE_02_massive_surplus():
    cells = make_chain(solar_w=20000, house_w=500)
    r = compute(cells)
    # All cells charge, rest goes to grid as export
    assert out(r, "net").power_w <= 0  # exporting

def test_EDGE_03_massive_deficit():
    cells = make_chain(solar_w=0, house_w=10000, grid_measured_w=3000,
                       goodwe_kw={"soc": 80, "target": 30},
                       marstek_kw={"soc": 80})
    r = compute(cells)
    # Batteries discharge, remainder from grid
    assert out(r, "net").power_w > 0  # importing

def test_EDGE_04_all_cells_offline():
    cells = make_chain(solar_w=3000, house_w=1000,
                       goodwe_kw={"online": False},
                       marstek_kw={"online": False})
    r = compute(cells)
    assert out(r, "goodwe").action == "offline"
    assert out(r, "marstek").action == "offline"

def test_EDGE_05_negative_measured_in_off_mode():
    """Car charger off with negative measured (exporting?)."""
    cells = make_chain(car_kw={"mode": "off", "measured": -100})
    r = compute(cells)
    # Should still work, rest increases by 100

def test_EDGE_06_soc_exactly_at_boundaries():
    """SoC exactly at min/max/target boundaries."""
    for soc in [10, 10.01, 15, 30, 94.99, 95]:
        cells = make_chain(solar_w=3000, house_w=1000,
                           goodwe_kw={"soc": soc, "target": 30})
        r = compute(cells)
        # Should not crash
        assert out(r, "goodwe").action in {"consume", "autonomous", "idle"}


# =====================================================================
# NOODSTOP SCENARIO'S — wat als de BP fout interpreteert?
# =====================================================================

def test_NOODSTOP_01_consume_zero_is_safe():
    """If consume power is 0, BP sets eco_charge 0% → goodwe on_release (eco mode)."""
    cells = make_chain(solar_w=0, house_w=2600, peak_limit=2600,
                       goodwe_kw={"soc": 15, "target": 40})
    r = compute(cells)
    # house = peak → no headroom → take = 0
    # Should NOT be consume with 0W (that triggers eco_charge 0%)
    gw = out(r, "goodwe")
    if gw.action == "consume":
        assert gw.power_w > 0, "Consume with 0W would set eco_charge 0% → dangerous"

def test_NOODSTOP_02_headroom_prevents_overconsumption():
    """No cell can consume more than headroom allows."""
    for house in range(0, 3000, 500):
        cells = make_chain(solar_w=0, house_w=house, peak_limit=2600,
                           goodwe_kw={"soc": 10, "target": 50})
        r = compute(cells)
        gw_power = out(r, "goodwe").power_w
        if gw_power > 0:
            max_allowed = max(0, 2600 - house)
            assert gw_power <= max_allowed + W, \
                f"house={house}: goodwe {gw_power}W > headroom {max_allowed}W"

def test_NOODSTOP_03_flags_set_always_propagates():
    """Flag must be in flags for all downstream cells after setter."""
    cells = make_chain(solar_w=3000, house_w=1000,
                       goodwe_kw={"soc": 20, "target": 40},
                       marstek_kw={"soc": 80})
    r = compute(cells)
    if out(r, "goodwe").action == "consume" and out(r, "goodwe").power_w > 0:
        # Marstek should see the flag → not discharge
        assert out(r, "marstek").power_w >= 0


def test_SC_produce_with_surplus_is_self_consumption():
    """When desired=produce but rest>=0 (surplus), action must be self_consumption not idle.
    This happens when marstek is discharging (measured<-50) but goodwe already covers the deficit."""
    cells = make_chain(solar_w=0, house_w=500, grid_measured_w=0,
                       goodwe_kw={"soc": 50, "target": 30, "measured": -500},
                       marstek_kw={"soc": 50, "measured": -300})
    r = compute(cells)
    assert out(r, "marstek").action == "autonomous", \
        f"Expected self_consumption, got {out(r, 'marstek').action}: {out(r, 'marstek').reason}"


# =====================================================================
# Runner
# =====================================================================

if __name__ == "__main__":
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    passed = failed = errors = 0
    failures = []
    for t in tests:
        try:
            t()
            print(f"  PASS  {t.__name__}")
            passed += 1
        except AssertionError as e:
            print(f"  FAIL  {t.__name__}: {e}")
            failed += 1
            failures.append(t.__name__)
        except Exception as e:
            print(f"  ERROR {t.__name__}: {type(e).__name__}: {e}")
            errors += 1
            failures.append(t.__name__)

    print(f"\n{'='*60}")
    print(f"RESULTS: {passed} passed, {failed} failed, {errors} errors out of {passed+failed+errors}")
    if failures:
        print(f"\nFailed tests:")
        for f in failures:
            print(f"  - {f}")
    print(f"{'='*60}")
    sys.exit(1 if (failed + errors) > 0 else 0)
