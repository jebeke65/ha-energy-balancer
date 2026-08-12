"""Tests for build_layers — the virtual-layer aggregation (pure).

Covers the regression-prone glue: (position, type) grouping, capacity-weighted
SoC, power summing, storage fields and the house/car NOT-merged rule.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core import CellConfig, CellState, compute, build_layers


def full_chain(solar=3000, house=1000, car=0, gw=None, mk=None, peak=3500):
    """Realistic 6-cell chain with types (mirrors the live apps.yaml)."""
    gw = gw or {"soc": 50, "target": 50}
    mk = mk or {"soc": 50, "target": 50}
    return [
        (CellConfig(id="solar", position=0, mode="supply", type="solar"),
         CellState(measured_w=solar)),
        (CellConfig(id="house", position=1, mode="demand", type="house"),
         CellState(measured_w=house)),
        (CellConfig(id="car_charger", position=1, mode="self_consumption",
                    type="car_charger", max_charge_w=7400, can_discharge=False),
         CellState(measured_w=car)),
        (CellConfig(id="goodwe", position=2, mode="smart", type="house_battery",
                    max_charge_w=5000, max_discharge_w=4500, capacity_kwh=15,
                    min_soc=10, max_soc=95, has_soc=True, target_soc=gw["target"]),
         CellState(soc=gw["soc"])),
        (CellConfig(id="marstek", position=2, mode="smart", type="house_battery",
                    max_charge_w=2500, max_discharge_w=2500, capacity_kwh=5.12,
                    min_soc=10, max_soc=95, has_soc=True, target_soc=mk["target"]),
         CellState(soc=mk["soc"])),
        (CellConfig(id="net", position=99, mode="grid", type="grid",
                    peak_limit_w=peak),
         CellState(measured_w=0)),
    ]


def layers_of(cells):
    r = compute(cells)
    return {L["id"]: L for L in build_layers(cells, r.outputs, r.details)}


def test_layers_one_block_per_type():
    # house + car share position 1 but differ in type → SEPARATE blocks.
    L = layers_of(full_chain())
    assert "house" in L and "car_charger" in L
    assert "house_car_charger" not in L
    # goodwe + marstek share position 2 AND type → ONE pooled block.
    assert "home_battery" in L
    assert L["home_battery"]["members"] == ["goodwe", "marstek"]


def test_layers_kind_from_type():
    L = layers_of(full_chain())
    assert L["solar"]["kind"] == "solar"
    assert L["house"]["kind"] == "house"
    assert L["car_charger"]["kind"] == "car_charger"
    assert L["home_battery"]["kind"] == "house_battery"
    assert L["net"]["kind"] == "grid"


def test_layers_capacity_weighted_soc():
    L = layers_of(full_chain(gw={"soc": 40, "target": 50},
                             mk={"soc": 60, "target": 50}))
    b = L["home_battery"]
    exp = (40 * 15 + 60 * 5.12) / (15 + 5.12)
    assert abs(b["soc"] - round(exp, 1)) <= 0.1
    assert b["capacity_kwh"] == 20.12


def test_layers_power_is_measured_sum_conventional_sign():
    # Storage layers publish the MEASURED power (cells' measured_w, never the EB
    # prediction), + = discharge / − = charge → the NEGATED EB-convention sum.
    cells = full_chain()
    cells[3][1].measured_w = -2000      # goodwe discharging 2000 (EB conv: − = discharge)
    cells[4][1].measured_w = -500       # marstek discharging 500
    r = compute(cells)
    b = {L["id"]: L for L in build_layers(cells, r.outputs, r.details)}["home_battery"]
    assert abs(b["power_w"] - 2500) <= 0.2              # measured sum −2500 → +2500


def test_layers_storage_fields_only_for_batteries():
    L = layers_of(full_chain())
    b = L["home_battery"]
    assert b["has_soc"] is True
    for k in ("soc", "capacity_kwh", "energy_stored_kwh", "target_soc",
              "charge_avail_w", "discharge_avail_w", "action"):
        assert k in b
    assert L["solar"]["has_soc"] is False
    assert "soc" not in L["solar"]
    assert "charge_avail_w" not in L["net"]


def test_layers_energy_stored():
    b = layers_of(full_chain(gw={"soc": 50, "target": 50},
                             mk={"soc": 50, "target": 50}))["home_battery"]
    assert abs(b["energy_stored_kwh"] - 0.5 * 20.12) <= 0.05


def test_layers_avail_sums_with_taper():
    # Mid SoC → full taper → avail = sum of hw maxima.
    b = layers_of(full_chain(gw={"soc": 50, "target": 50},
                             mk={"soc": 50, "target": 50}))["home_battery"]
    assert b["charge_avail_w"] == 5000 + 2500
    assert b["discharge_avail_w"] == 4500 + 2500


def test_layers_action_discharging():
    # Measured discharge → action "discharging" AND power_w POSITIVE (conv sign).
    cells = full_chain()
    cells[3][1].measured_w = -1500       # goodwe discharging
    cells[4][1].measured_w = -800        # marstek discharging
    b = layers_of(cells)["home_battery"]
    assert b["action"] == "discharging" and b["power_w"] > 0


def test_layers_charging_power_is_negative():
    # Measured charge → action "charging" AND power_w NEGATIVE (conv sign).
    cells = full_chain()
    cells[3][1].measured_w = 1500        # goodwe charging (EB conv: + = charge)
    cells[4][1].measured_w = 800         # marstek charging
    b = layers_of(cells)["home_battery"]
    assert b["action"] == "charging" and b["power_w"] < 0


def test_layers_non_storage_keep_natural_sign():
    # Solar layer must NOT be flipped — production stays positive.
    L = layers_of(full_chain(solar=3000))
    assert L["solar"]["power_w"] > 0


def test_layers_per_cell_passthrough():
    b = layers_of(full_chain())["home_battery"]
    assert "power_goodwe" in b and "power_marstek" in b
    assert "soc_goodwe" in b and "soc_marstek" in b


def test_layers_single_cell_named_by_id():
    # A single-cell layer is named exactly by its cell id.
    L = layers_of(full_chain())
    assert L["solar"]["members"] == ["solar"]
    assert L["net"]["members"] == ["net"]


def test_layers_ordered_by_position():
    cells = full_chain()
    layers = build_layers(cells, *(lambda r: (r.outputs, r.details))(compute(cells)))
    positions = [L["position"] for L in layers]
    assert positions == sorted(positions)


def test_layers_full_battery_avail_tapers_to_zero():
    # marstek at max_soc → its charge headroom tapers to 0 in the pool.
    b = layers_of(full_chain(gw={"soc": 50, "target": 50},
                             mk={"soc": 95, "target": 50}))["home_battery"]
    assert b["charge_avail_w"] == 5000          # only goodwe contributes
