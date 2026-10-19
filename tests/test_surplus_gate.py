"""Surplus" car mode: the tier gets the sun first, the car waits for a tier SoC.

Jan, 2026-10-14: with the kWh price close to (or above) the CREG home-charging
reimbursement, the house batteries get priority. The car waits until the tier
(capacity-weighted SoC of the house batteries) reaches `surplus_tier_soc`, and
from there on behaves EXACTLY like "Solar". It waits again below the threshold
minus SURPLUS_GATE_HYST.

What these tests pin:
  * gate closed → car idle at 0 W, whatever the sun does;
  * gate open   → tick-for-tick identical to "Solar";
  * hysteresis  → opens at thr, stays open down to thr − 5, closes below;
  * the tier SoC is capacity-weighted and ignores offline batteries;
  * unknown tier SoC → gate closed (batteries first);
  * Off / Automatisch / Solar do not depend on the tier SoC at all.
"""

import os
import random
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import car_brain  # noqa: E402
from core import (CellConfig, CellState, SURPLUS_GATE_HYST,  # noqa: E402
                  compute)


class Runner:
    """Solar, house, car (pos 1) and the two-battery tier (pos 2), like live."""

    def __init__(self, mode, thr=80.0, batteries=True):
        self.car_cfg = CellConfig(
            id="car", position=1, mode="self_consumption", type="car_charger",
            can_charge=True, can_discharge=False, max_charge_w=7360,
            charge_floor_w=1400, take_pct=80.0, use_car_brain=True,
            start_margin_w=50, debounce_s=15, solar_debounce_s=300,
            average_n=5, limit_step_w=50, car_mode=mode,
            surplus_tier_soc=thr)
        self.car_st = CellState(measured_w=0.0)
        self.batteries = batteries
        self.t = 1_000_000.0

    def tick(self, surplus, gw_soc=50.0, ms_soc=50.0, ms_online=True):
        self.t += 10.0
        self.car_st.now_ts = self.t
        cells = [
            (CellConfig(id="solar", position=0, mode="supply", type="solar"),
             CellState(measured_w=max(0.0, surplus))),
            (CellConfig(id="house", position=1, mode="demand", type="house"),
             CellState(measured_w=max(0.0, -surplus))),
            (self.car_cfg, self.car_st),
            (CellConfig(id="net", position=99, mode="grid", type="grid",
                        peak_limit_w=100000.0), CellState(measured_w=0.0)),
        ]
        if self.batteries:
            cells += [
                (CellConfig(id="goodwe", position=2, mode="balanced",
                            type="house_battery", capacity_kwh=15.0,
                            has_soc=True), CellState(soc=gw_soc)),
                (CellConfig(id="marstek", position=2, mode="balanced",
                            type="house_battery", capacity_kwh=5.12,
                            has_soc=True),
                 CellState(soc=ms_soc, online=ms_online)),
            ]
        r = compute(cells)
        return r.outputs["car"]


def test_gate_closed_car_waits():
    r = Runner("Surplus")
    for _ in range(60):
        out = r.tick(5000, gw_soc=60, ms_soc=60)
        assert out.power_w == 0.0 and out.action == "idle", out
    assert "tier first" in out.reason, out.reason


def test_gate_open_is_identical_to_solar():
    rng = random.Random(1410)
    sur, sol = Runner("Surplus"), Runner("Solar")
    for i in range(3000):
        s = rng.choice([rng.uniform(-1500, 6000), 2000, 1800, 0])
        a = sur.tick(s, gw_soc=90, ms_soc=90)
        b = sol.tick(s, gw_soc=90, ms_soc=90)
        assert (a.action, a.power_w) == (b.action, b.power_w), (i, a, b)


def test_hysteresis():
    r = Runner("Surplus", thr=80.0)
    for soc, expect_open in [(70, False), (79.9, False), (80, True),
                             (77, True), (80 - SURPLUS_GATE_HYST, True),
                             (74.9, False), (78, False), (80, True)]:
        r.tick(5000, gw_soc=soc, ms_soc=soc)
        assert r.car_st.car_state.surplus_open is expect_open, (soc, expect_open)


def test_tier_soc_is_capacity_weighted():
    # (15*90 + 5.12*40) / 20.12 = 77.3 % → below 80, closed
    r = Runner("Surplus", thr=80.0)
    r.tick(5000, gw_soc=90, ms_soc=40)
    assert abs(r.car_st.tier_soc - 77.28) < 0.01, r.car_st.tier_soc
    assert r.car_st.car_state.surplus_open is False


def test_offline_battery_is_ignored():
    r = Runner("Surplus", thr=80.0)
    r.tick(5000, gw_soc=90, ms_soc=0, ms_online=False)   # Marstek false zero
    assert r.car_st.tier_soc == 90.0
    assert r.car_st.car_state.surplus_open is True


def test_unknown_tier_soc_keeps_gate_closed():
    r = Runner("Surplus", batteries=False)
    out = r.tick(5000)
    assert r.car_st.tier_soc is None
    assert out.power_w == 0.0 and "unknown" in out.reason, out.reason


def test_existing_modes_ignore_tier_soc():
    rng = random.Random(7)
    for mode in ("Off", "Automatisch", "Solar"):
        low, high = Runner(mode), Runner(mode)
        for i in range(1500):
            s = rng.uniform(-2000, 6000)
            a = low.tick(s, gw_soc=10, ms_soc=10)
            b = high.tick(s, gw_soc=95, ms_soc=95)
            assert (a.action, a.power_w, a.reason) == \
                (b.action, b.power_w, b.reason), (mode, i, a, b)


def test_average_stays_fresh_while_waiting():
    # Morning at 0 W while waiting, then sun: once the gate opens the brain must
    # see today's surplus, not a buffer frozen at the morning value.
    r = Runner("Surplus", thr=80.0)
    for _ in range(10):
        r.tick(0, gw_soc=60, ms_soc=60)
    for _ in range(10):
        r.tick(4000, gw_soc=60, ms_soc=60)
    assert list(r.car_st.car_state.buffer) == [4000.0] * 5


def test_select_offers_surplus():
    # The EB car cell accepts it, so its own select (no helper) offers it too.
    assert car_brain.MODE_SURPLUS in car_brain.MODE_CHOICES
