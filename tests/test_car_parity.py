"""Parity harness: the EB car cell must answer exactly like the AppDaemon app.

Two implementations run side by side, tick by tick, on the same inputs:

  ORACLE  the real ManageCarCharge app, loaded from
          /config/appdaemon/apps/battery_optimisation/manage_car_charge.py
          via tests/oracle_car_brain.py. Never modified.
  EB      the car cell, driven through its REAL path: a chain built the way
          coordinator._tick() builds it, run through core.compute().

That second point is the whole design. Calling car_brain.tick() from both sides
would prove nothing — the two would be the same function. By going through
compute() we test the WIRING: does the chain hand the cell the right surplus,
does the state survive a tick, does the flag route control where it should.

Sampling runs in three layers:
  1. GRID       every combination of a small discrete set. Deterministic.
  2. THRESHOLD  values deliberately placed on and around the start/stop
                thresholds and the debounce edge — where off-by-one lives.
  3. RANDOM     uniform noise as a safety net.

Every divergence is written to car_fixed_cases.json as a fully reproducible
case, and those cases run FIRST on every later invocation.

Usage:
    python3 tests/test_car_parity.py                # ~200k sequences
    python3 tests/test_car_parity.py --quick        # ~3k, for a fast loop
    python3 tests/test_car_parity.py --sequences N --seed S
    python3 tests/test_car_parity.py --self-check   # wiring assertions only
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import random
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..",
                                "custom_components", "energy_balancer"))   # repository layout

from oracle_car_brain import Oracle, app_defaults          # noqa: E402
from core import CellConfig, CellState, compute            # noqa: E402
import car_brain                                           # noqa: E402

FIXED_CASES = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                           "car_fixed_cases.json")
# Sequences on which a deliberately "improved" port was caught. They are the
# cheap guard against someone tidying a quirk away: each one is a concrete
# sequence where that quirk changes the answer. Harvested by mutation testing —
# see the report. Runs in well under a second.
QUIRK_GUARDS = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                            "car_quirk_guards.json")

MODES = ["Off", "Automatisch", "Solar"]
TICKS_PER_SEQUENCE = 40


# ---------------------------------------------------------------------------
# The EB side — the real chain, not a shortcut
# ---------------------------------------------------------------------------
class EBCarRunner:
    """Drive the EB car cell through core.compute(), one tick at a time.

    Chain layout copied from coordinator._tick(): solar at position 0, house at
    position 1, then the configured cells. The live config puts the car at
    position 1 as well, so it sits directly behind the house cell and the rest it
    receives is solar − house.
    """

    def __init__(self, knobs: dict):
        self.knobs = knobs
        self.car_cfg = CellConfig(
            id="car", position=1, mode="self_consumption", type="car_charger",
            can_charge=True, can_discharge=False,
            max_charge_w=knobs["max_charge_w"],
            charge_floor_w=knobs["min_charge_w"],
            take_pct=100.0,                    # set per tick
            use_car_brain=True,
            start_margin_w=knobs["hyst_w"],
            debounce_s=knobs["debounce_s"],
            solar_debounce_s=knobs["solar_debounce_s"],
            average_n=knobs["average_n"],
            limit_step_w=knobs["limit_step_w"],
            ratio_fallback=knobs["ratio_fallback"],
        )
        self.car_state = CellState(measured_w=0.0, soc=50.0)
        self.last_rest = None

    def tick(self, *, surplus, ratio, mode, now_ts, min_charge, measured=0.0,
             peak_limit=100000.0):
        s = float(surplus)
        solar = max(0.0, s)
        house = max(0.0, -s)          # rest at the car == solar − house == s

        self.car_cfg.take_pct = ratio
        self.car_cfg.charge_floor_w = min_charge
        self.car_cfg.car_mode = mode
        self.car_state.measured_w = measured
        self.car_state.now_ts = now_ts

        cells = [
            (CellConfig(id="solar", position=0, mode="supply", type="solar"),
             CellState(measured_w=solar)),
            (CellConfig(id="house", position=1, mode="demand", type="house"),
             CellState(measured_w=house)),
            (self.car_cfg, self.car_state),
            (CellConfig(id="net", position=99, mode="grid", type="grid",
                        peak_limit_w=peak_limit),
             CellState(measured_w=0.0)),
        ]
        result = compute(cells)
        out = result.outputs["car"]
        self.last_rest = result.details["car"].get("rest_in_w")
        return out


# ---------------------------------------------------------------------------
# Case generation
# ---------------------------------------------------------------------------
def _knobs(rng, layer: str) -> dict:
    """One set of tunables."""
    if layer == "grid":
        return rng  # already a dict for the grid layer
    if layer == "threshold":
        return {
            "min_charge_w": rng.choice([0, 700, 1400, 1400, 2000, 3000]),
            "hyst_w": rng.choice([0, 1, 50, 50, 200, 500]),
            "debounce_s": rng.choice([0, 5, 15, 15, 60]),
            "solar_debounce_s": rng.choice([0, 30, 300, 300, 600]),
            "average_n": rng.choice([1, 2, 5, 5, 10]),
            "limit_step_w": rng.choice([0, 1, 50, 50, 200]),
            "max_charge_w": rng.choice([3680, 7360, 7400]),
            "ratio_fallback": 50.0,
        }
    return {
        "min_charge_w": rng.randint(0, 4000),
        "hyst_w": rng.randint(0, 1000),
        "debounce_s": rng.randint(0, 900),
        "solar_debounce_s": rng.randint(0, 900),
        "average_n": rng.randint(1, 20),
        "limit_step_w": rng.randint(0, 500),
        "max_charge_w": rng.choice([2000, 3680, 7360, 7400, 11000]),
        "ratio_fallback": 50.0,
    }


def _ticks(rng, knobs: dict, layer: str) -> list:
    """One sequence of ticks."""
    n = TICKS_PER_SEQUENCE
    mode = rng.choice(MODES)
    ratio = rng.choice([0, 1, 50, 80, 100]) if layer == "threshold" else rng.randint(0, 100)
    min_charge = knobs["min_charge_w"]

    # The two numbers the app's thresholds are built from.
    start_th = min_charge + knobs["hyst_w"]
    stop_th = max(0, min_charge - knobs["hyst_w"])

    out = []
    for _ in range(n):
        if layer == "threshold" and ratio > 0:
            # Aim the surplus so that surplus·ratio lands ON a threshold, or a
            # hair either side of it.
            target = rng.choice([start_th, stop_th, min_charge])
            nudge = rng.choice([-50, -1, -0.5, 0, 0.5, 1, 50])
            surplus = (target + nudge) * 100.0 / ratio
        elif layer == "threshold":
            surplus = rng.choice([0, 100, 1000, 5000])
        else:
            surplus = rng.choice([
                rng.uniform(-2000, 9000),
                rng.uniform(-100, 100),
                rng.choice([0.0, -0.0, 1e-9]),
            ])

        # Time steps: the app's own 5 s, EB's 10 s, and steps that land right on
        # the debounce edge.
        if layer == "threshold":
            dbnc = knobs["solar_debounce_s"] if mode == "Solar" else knobs["debounce_s"]
            dt = rng.choice([5, 10, dbnc, max(0, dbnc - 1), dbnc + 1, 1, 300])
        else:
            dt = rng.choice([5, 5, 10, 1, 30, 300, rng.uniform(0.5, 60)])

        # Mode may flip mid-sequence (Off in the middle is the interesting one:
        # it freezes the moving average).
        if rng.random() < 0.08:
            mode = rng.choice(MODES)
        if rng.random() < 0.05:
            ratio = rng.randint(0, 100)

        out.append({
            "dt": round(float(dt), 3),
            "surplus": round(float(surplus), 4),
            "ratio": ratio,
            "mode": mode,
            "min_charge": min_charge,
        })
    return out


GRID_KNOBS = [
    {"min_charge_w": mc, "hyst_w": h, "debounce_s": d, "solar_debounce_s": sd,
     "average_n": a, "limit_step_w": ls, "max_charge_w": 7360,
     "ratio_fallback": 50.0}
    for mc in (0, 1400, 2000)
    for h in (0, 50, 200)
    for d in (0, 15)
    for sd in (15, 300)
    for a in (1, 5)
    for ls in (0, 50)
]


def _grid_cases():
    """Layer 1: the deterministic grid, one sequence per knob combination."""
    rng = random.Random(20260821)
    for knobs in GRID_KNOBS:
        for mode in MODES:
            ticks = []
            m = mode
            for i in range(TICKS_PER_SEQUENCE):
                # A deterministic ramp up and back down, crossing the thresholds.
                surplus = [0, 500, 1500, 3000, 6000, 3000, 1500, 500][i % 8] * 1.0
                ticks.append({"dt": 5.0, "surplus": surplus, "ratio": 80,
                              "mode": m, "min_charge": knobs["min_charge_w"]})
            yield {"knobs": knobs, "ticks": ticks, "layer": "grid"}
    del rng


# ---------------------------------------------------------------------------
# Running one case
# ---------------------------------------------------------------------------
def run_case(case: dict):
    """Run one sequence on both sides. Returns None when identical, else a diff."""
    knobs = case["knobs"]
    ticks = case["ticks"]

    args = app_defaults()
    args.update({
        "min_charge_w": knobs["min_charge_w"],
        "hysteresis_w": knobs["hyst_w"],
        "debounce_s": knobs["debounce_s"],
        "solar_debounce_s": knobs["solar_debounce_s"],
        "average_s": knobs["average_n"],
        "limit_step_w": knobs["limit_step_w"],
        "max_charge_w": knobs["max_charge_w"],
        "ratio_unavailable_fallback": knobs["ratio_fallback"],
    })

    oracle = Oracle(args, start_ts=0.0)
    eb = EBCarRunner(knobs)

    now = 0.0
    for i, t in enumerate(ticks):
        now += t["dt"]
        o_limit = oracle.tick(surplus=t["surplus"], ratio=t["ratio"],
                              mode=t["mode"], now_ts=now,
                              min_charge=t["min_charge"])
        o_action = oracle.action

        out = eb.tick(surplus=t["surplus"], ratio=t["ratio"], mode=t["mode"],
                      now_ts=now, min_charge=t["min_charge"],
                      measured=t.get("measured", 0.0))
        e_limit = out.power_w
        e_action = out.action

        same_power = (o_limit is not None
                      and abs(float(o_limit) - float(e_limit)) < 1e-6)
        same_action = (o_action == e_action)
        if not (same_power and same_action):
            return {
                "tick": i,
                "now_ts": now,
                "input": t,
                "oracle_limit": o_limit,
                "eb_limit": e_limit,
                "oracle_action": o_action,
                "eb_action": e_action,
            }
    return None


def case_key(case: dict) -> str:
    blob = json.dumps({"knobs": case["knobs"], "ticks": case["ticks"]},
                      sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(blob.encode()).hexdigest()[:16]


# ---------------------------------------------------------------------------
# The regression bank
# ---------------------------------------------------------------------------
def load_fixed() -> list:
    if not os.path.exists(FIXED_CASES):
        return []
    try:
        with open(FIXED_CASES) as fh:
            return json.load(fh)
    except (OSError, ValueError):
        return []


def save_fixed(cases: list) -> None:
    with open(FIXED_CASES, "w") as fh:
        json.dump(cases, fh, indent=1, sort_keys=False)
        fh.write("\n")


def add_fixed(bank: list, case: dict, diff: dict, note: str = "") -> bool:
    """Add a failing case if it is not already in the bank. True when added."""
    key = case_key(case)
    if any(c.get("key") == key for c in bank):
        return False
    bank.append({
        "key": key,
        "note": note or f"tick {diff['tick']}: oracle={diff['oracle_limit']} "
                        f"eb={diff['eb_limit']}",
        "layer": case.get("layer", "?"),
        "knobs": case["knobs"],
        "ticks": case["ticks"],
        "first_divergence": diff,
    })
    return True


# ---------------------------------------------------------------------------
# Wiring self-checks — cheap assertions that the plumbing is what we think
# ---------------------------------------------------------------------------
def _run(coro):
    """Drive one coroutine to completion without asyncio."""
    try:
        coro.send(None)
    except StopIteration:
        return
    raise AssertionError("coroutine awaited something the stub cannot provide")


def _check_mode_select() -> list:
    """The whole path: select → helper → coordinator resolution → car_brain.

    Every link is the shipped code:
      * the real EBCarModeWindowSelect / EBCarModeOwnSelect from select.py,
        loaded through the HA stub;
      * the real car_brain.resolve_mode, which is also what coordinator._tick
        calls (asserted below on the source, since importing the coordinator
        would drag in all of Home Assistant);
      * the real car_brain.tick.

    It fails if any link is missing: a select that keeps a private copy, a
    coordinator that stops resolving through resolve_mode, or a brain that
    ignores the mode.
    """
    from ha_stub import load_eb, FakeHass          # local: keeps import cost off
    sel = load_eb("select")
    fails = []

    HELPER = "input_select.car_charge_mode"
    OPTIONS = ["Off", "Automatisch", "Solar"]

    def brain_limit(mode_raw, surplus=4000.0, ratio=90, floor=1400):
        """What the brain does with the mode the chain resolved."""
        cfg = car_brain.CarBrainConfig(
            min_charge_w=floor, hyst_w=50, debounce_s=15, solar_debounce_s=300,
            average_n=1, limit_step_w=50, max_charge_w=7360)
        state = car_brain.CarBrainState.for_config(cfg)
        limit, _r, _s = car_brain.tick(
            cfg, state, surplus=surplus, ratio=ratio,
            mode=car_brain.resolve_mode(mode_raw), now_ts=10.0)
        return limit

    # --- case 1: a helper drives it → the select is a window ---------------
    hass = FakeHass()
    hass.states.set(HELPER, "Automatisch", {"options": OPTIONS})
    ent = sel.EBCarModeWindowSelect(hass, coordinator=None, cell_id="car",
                                    helper=HELPER)

    if ent.current_option != "Automatisch":
        fails.append(f"window select does not read the helper: {ent.current_option}")
    if ent.options != OPTIONS:
        fails.append(f"window select does not read the helper's options: {ent.options}")

    # Picking must move the HELPER, not a private copy.
    _run(ent.async_select_option("Solar"))
    called = hass.services.calls[-1] if hass.services.calls else None
    if not called or called[0:2] != ("input_select", "select_option") \
            or called[2].get("entity_id") != HELPER \
            or called[2].get("option") != "Solar":
        fails.append(f"window select did not drive the helper: {called}")
    if hass.states.get(HELPER).state != "Solar":
        fails.append("helper state did not follow the select")
    if ent.current_option != "Solar":
        fails.append("window select did not follow the helper after the write")

    # And the brain must now see Solar. The proof that it MATTERS: with this
    # surplus/floor the three modes give three different answers.
    lim_solar = brain_limit(hass.states.get(HELPER).state)
    _run(ent.async_select_option("Off"))
    lim_off = brain_limit(hass.states.get(HELPER).state)
    _run(ent.async_select_option("Automatisch"))
    lim_auto = brain_limit(hass.states.get(HELPER).state, surplus=100.0)

    if lim_off != 0:
        fails.append(f"mode Off did not reach the brain (limit {lim_off})")
    if lim_solar <= 0:
        fails.append(f"mode Solar did not reach the brain (limit {lim_solar})")
    if lim_auto != 1400:
        # Automatisch lifts a tiny surplus to the floor — the app's own quirk.
        fails.append(f"mode Automatisch did not reach the brain (limit {lim_auto})")

    # --- unavailable helper: no crash, and the same answer as today --------
    hass.states.set(HELPER, "unavailable", {"options": OPTIONS})
    try:
        opt, opts, avail = ent.current_option, ent.options, ent.available
    except Exception as err:                                   # pragma: no cover
        fails.append(f"window select crashed on an unavailable helper: {err!r}")
        opt = opts = avail = None
    else:
        if opt is not None:
            fails.append(f"unavailable helper should give None, got {opt!r}")
        if opts != OPTIONS:
            fails.append(f"options lost while unavailable: {opts}")
        if avail is not True:
            fails.append("select should still exist while the helper is out")

    hass.states.remove(HELPER)
    try:
        if ent.current_option is not None or ent.options != list(car_brain.MODE_CHOICES):
            fails.append("missing helper not handled as a clean fallback")
        if ent.available is not False:
            fails.append("select should report unavailable when the helper is gone")
    except Exception as err:                                   # pragma: no cover
        fails.append(f"window select crashed on a missing helper: {err!r}")

    # QUIRK 2 must be untouched: an unreachable helper resolves to raw None, so
    # the decision uses "Automatisch" while the clamp is skipped.
    if car_brain.resolve_mode(None) is not None \
            or car_brain.resolve_mode("unavailable") is not None \
            or car_brain.resolve_mode("") is not None:
        fails.append("resolve_mode no longer yields raw None for an absent helper")
    cfgq = car_brain.CarBrainConfig(min_charge_w=1400, hyst_w=50, debounce_s=15,
                                    solar_debounce_s=300, average_n=1,
                                    limit_step_w=50, max_charge_w=7360)
    sq = car_brain.CarBrainState.for_config(cfgq)
    unavail, _r, _s = car_brain.tick(cfgq, sq, surplus=100.0, ratio=90,
                                     mode=car_brain.resolve_mode("unavailable"),
                                     now_ts=10.0)
    sq2 = car_brain.CarBrainState.for_config(cfgq)
    named, _r, _s = car_brain.tick(cfgq, sq2, surplus=100.0, ratio=90,
                                   mode="Automatisch", now_ts=10.0)
    if unavail != named:
        fails.append(f"unavailable helper changed the outcome: {unavail} vs {named}")

    # --- case 2: no helper → the select owns the value ---------------------
    own = sel.EBCarModeOwnSelect(hass, entry=None, coordinator=None,
                                 cell_id="car", current="Solar")
    if own.options != list(car_brain.MODE_CHOICES):
        fails.append(f"own select offers the wrong tokens: {own.options}")
    if own.current_option != "Solar":
        fails.append(f"own select ignored its configured value: {own.current_option}")
    bad = sel.EBCarModeOwnSelect(hass, entry=None, coordinator=None,
                                 cell_id="car", current="nonsense")
    if bad.current_option != "Automatisch":
        fails.append(f"own select did not fall back on a bad value: {bad.current_option}")

    # --- the coordinator link ---------------------------------------------
    # Importing coordinator.py would pull in all of Home Assistant, so this one
    # link is checked on the source: it must resolve the mode through the shared
    # function and prefer the helper over the cell's own value.
    from ha_stub import PKG_DIR
    coord_src = open(os.path.join(PKG_DIR, "coordinator.py")).read()
    if "car_brain.resolve_mode(" not in coord_src:
        fails.append("coordinator no longer resolves the mode via car_brain.resolve_mode")
    if 'io.get("car_mode")' not in coord_src:
        fails.append("coordinator no longer falls back to the cell's own car_mode")
    if '"car_mode": algo.get("car_mode"' not in coord_src:
        fails.append("coordinator does not carry car_mode into cell_io")

    return fails


def self_check() -> list:
    """Returns a list of failure strings (empty when all good)."""
    fails = []

    knobs = {"min_charge_w": 1400, "hyst_w": 50, "debounce_s": 15,
             "solar_debounce_s": 300, "average_n": 5, "limit_step_w": 50,
             "max_charge_w": 7400, "ratio_fallback": 50.0}

    # 1. The rest the car receives IS solar − house.
    eb = EBCarRunner(knobs)
    eb.tick(surplus=1234.0, ratio=80, mode="Solar", now_ts=5.0, min_charge=1400)
    if eb.last_rest is None or abs(eb.last_rest - 1234.0) > 1e-6:
        fails.append(f"rest at car = {eb.last_rest}, expected 1234.0")

    # 2. With the flag OFF the cell must take the old path (floor → idle).
    off = CellConfig(id="car", position=1, mode="self_consumption",
                     type="car_charger", can_discharge=False,
                     max_charge_w=7400, charge_floor_w=1400, take_pct=80)
    cells = [
        (CellConfig(id="solar", position=0, mode="supply"), CellState(measured_w=2000)),
        (CellConfig(id="house", position=1, mode="demand"), CellState(measured_w=1000)),
        (off, CellState(measured_w=0.0)),
        (CellConfig(id="net", position=99, mode="grid", peak_limit_w=3500),
         CellState(measured_w=0.0)),
    ]
    r = compute(cells)
    if r.outputs["car"].action != "idle" or "floor" not in r.outputs["car"].reason:
        fails.append(f"flag off changed the old path: {r.outputs['car']}")

    # 3. The follower branch must be gone under the flag: a car already drawing
    #    3 kW with no surplus must NOT be handed 3 kW back.
    eb2 = EBCarRunner(knobs)
    out = None
    for i in range(6):
        out = eb2.tick(surplus=0.0, ratio=80, mode="Solar", now_ts=5.0 * (i + 1),
                       min_charge=1400, measured=3000.0)
    if out.power_w != 0:
        fails.append(f"follower branch still active: {out}")

    # 4. State survives ticks: after a step change the 5-sample moving average
    #    must climb over several ticks. A stateless cell would jump in one.
    eb3 = EBCarRunner(knobs)
    seen = []
    for i, s in enumerate([0.0, 0.0, 0.0, 5000.0, 5000.0, 5000.0, 5000.0]):
        o = eb3.tick(surplus=s, ratio=100, mode="Solar",
                     now_ts=5.0 * (i + 1), min_charge=1400)
        seen.append(o.power_w)
    if len(set(seen[3:])) < 3:
        fails.append(f"no ramp — state not carried across ticks: {seen}")

    # 5b. The mode select really moves what the brain reads.
    fails.extend(_check_mode_select())

    # 5. The peak headroom is deliberately NOT applied — see _check_peak_choice.
    fails.extend(_check_peak_choice())

    # 6. Switching the flag on must start the brain clean.
    fails.extend(_check_live_flag())

    return fails


def _check_peak_choice() -> list:
    """The car brain outranks the peak headroom. Chosen, not overlooked.

    Jan's decision, 2026-08-21: **the brain wins, `eb_actuator_net` is the
    safety net.** Three reasons this cell does not take the chain's headroom cap
    while use_car_brain is on:

      1. The AppDaemon app has no notion of a monthly peak. Capping here would
         make the ported cell answer differently from the app, and the parity
         harness — 17 M ticks of it — is what says the port is faithful.
      2. The cap would bite exactly where the app is deliberately different: in
         "Automatisch" the brain asks for the floor (1400 W) with no surplus at
         all, i.e. it charges from the grid on purpose. The old path can never
         exceed the surplus, so it never needed a cap.
      3. The peak is defended one layer down: the emergency stop pauses the
         charger above limit − 100 W. That is a guard on measured grid import,
         which is the thing that actually blows the peak.

    So this test pins the deviation from BOTH sides, and it is meant to fail
    either way:
      * put a cap back in → the first assertion goes red;
      * remove the contrast (make the old path unbounded too, or "unify" the two
        paths) → the second goes red.
    """
    fails = []
    knobs = {"min_charge_w": 1400, "hyst_w": 50, "debounce_s": 15,
             "solar_debounce_s": 300, "average_n": 1, "limit_step_w": 50,
             "max_charge_w": 7400, "ratio_fallback": 50.0}

    # Flag ON, no surplus at all, no grid headroom: the brain still asks for the
    # floor. That is grid charging with the peak limit at zero — on purpose.
    eb = EBCarRunner(knobs)
    out = eb.tick(surplus=0.0, ratio=80, mode="Automatisch", now_ts=5.0,
                  min_charge=1400, peak_limit=0.0)
    if out.power_w != 1400:
        fails.append(
            "peak: the brain no longer overrules the headroom "
            f"(expected 1400 W with peak_limit 0, got {out.power_w}). "
            "If this is intentional, the deviation in _check_peak_choice and in "
            "core._process_car_brain has to be rewritten — not just this test.")

    # Flag OFF, same situation: the old path never invents load beyond the
    # surplus, so it idles. This is the contrast the deviation is measured
    # against; without it the first assertion proves nothing.
    off = CellConfig(id="car", position=1, mode="self_consumption",
                     type="car_charger", can_discharge=False,
                     max_charge_w=7400, charge_floor_w=1400, take_pct=80)
    cells = [
        (CellConfig(id="solar", position=0, mode="supply"), CellState(measured_w=0.0)),
        (CellConfig(id="house", position=1, mode="demand"), CellState(measured_w=0.0)),
        (off, CellState(measured_w=0.0)),
        (CellConfig(id="net", position=99, mode="grid", peak_limit_w=0.0),
         CellState(measured_w=0.0)),
    ]
    r = compute(cells)
    if r.outputs["car"].power_w != 0:
        fails.append("peak: the flag-off path now charges without surplus too — "
                     "the deviation is no longer a deviation")

    return fails


def _check_live_flag() -> list:
    """use_car_brain must flip without a reload, and start clean when it does.

    The flag is the way in and the way back, so it is the most important switch
    in this whole port. Two things are pinned:

      * the plumbing — the flag and the four tunables are live-tunable keys, and
        the coordinator reads them from cell_io on every tick rather than
        caching them at setup;
      * the state — an off→on flip throws the old CarBrainState away. A buffer
        left over from an earlier session holds another afternoon's surplus;
        averaging it with the current one produces a number neither the app nor
        EB ever computed. The reset makes an enable behave exactly like the app
        starting up: empty buffer, no "last above start", limit 0.

    The first block below shows the reset is load-bearing (stale and fresh give
    different answers on the same input); the second checks the coordinator
    still does it, on the source, because importing it would pull in all of HA.
    """
    fails = []
    cfg = car_brain.CarBrainConfig(min_charge_w=1400, hyst_w=50, debounce_s=15,
                                   solar_debounce_s=300, average_n=5,
                                   limit_step_w=50, max_charge_w=7360)

    # A brain resumed with yesterday's window vs one that starts clean.
    stale = car_brain.CarBrainState.for_config(cfg)
    for _ in range(5):
        stale.buffer.append(6000.0)
    stale.current_limit = 4800
    stale.last_above_start = 0.0

    fresh = car_brain.CarBrainState.for_config(cfg)

    now = 100000.0
    stale_limit, _r, _s = car_brain.tick(cfg, stale, surplus=0.0, ratio=80,
                                         mode="Solar", now_ts=now)
    fresh_limit, _r, _s = car_brain.tick(cfg, fresh, surplus=0.0, ratio=80,
                                         mode="Solar", now_ts=now)
    if stale_limit == fresh_limit:
        fails.append("live flag: a stale buffer gives the same answer as a fresh "
                     "one, so this check can no longer tell them apart")
    if fresh_limit != 0:
        fails.append(f"live flag: a fresh brain with no surplus should idle, "
                     f"got {fresh_limit}")

    # The coordinator side, on the source.
    here = os.path.dirname(os.path.realpath(__file__))
    coord_path = next(p for p in (os.path.join(here, "..", "coordinator.py"),
                                  os.path.join(here, "..", "custom_components",
                                               "energy_balancer", "coordinator.py"))
                      if os.path.exists(p))
    coord_src = open(coord_path).read()

    for key in ("use_car_brain", "start_margin_w", "debounce_s",
                "solar_debounce_s", "average_n", "car_mode"):
        if f'"{key}"' not in coord_src.split("LIVE_ALGO_KEYS = (", 1)[1].split(")", 1)[0]:
            fails.append(f"live flag: {key} is not in LIVE_ALGO_KEYS, so "
                         "set_option will refuse it")

    if 'io.get("use_car_brain", False)' not in coord_src:
        fails.append("live flag: the coordinator no longer reads use_car_brain "
                     "from cell_io each tick — it cannot be flipped live")
    if "self._car_states.pop(cfg.id, None)" not in coord_src:
        fails.append("live flag: the off→on reset of the brain state is gone; "
                     "enabling would resume a stale buffer")
    if "self._car_brain_on" not in coord_src:
        fails.append("live flag: the coordinator no longer tracks the previous "
                     "flag value, so it cannot see an off→on transition")

    # And the service must be able to carry a bool at all.
    params = load_eb_params()
    if params.coerce_option("use_car_brain", "true", cell_scope=True) is not True:
        fails.append("live flag: set_option cannot turn the flag on with a string")
    if params.coerce_option("use_car_brain", False, cell_scope=True) is not False:
        fails.append("live flag: set_option cannot turn the flag off")

    return fails


def load_eb_params():
    from ha_stub import load_eb
    return load_eb("params")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sequences", type=int, default=200000)
    ap.add_argument("--seed", type=int, default=20260821)
    ap.add_argument("--quick", action="store_true")
    ap.add_argument("--self-check", action="store_true")
    ap.add_argument("--no-grid", action="store_true")
    ap.add_argument("--max-store", type=int, default=200,
                    help="cap on how many new cases are added to the bank")
    args = ap.parse_args()

    print("=== wiring self-check ===")
    fails = self_check()
    for f in fails:
        print("  FAIL:", f)
    if not fails:
        print("  all wiring checks ok "
              "(chain rest, flag-off path, no follower, state carried, "
              "mode select, peak choice, live flag)")
    if args.self_check:
        return 1 if fails else 0

    bank = load_fixed()
    added = 0
    failures = 0
    ticks_run = 0
    t0 = time.time()

    # --- quirk guards -----------------------------------------------------
    guards = []
    if os.path.exists(QUIRK_GUARDS):
        try:
            with open(QUIRK_GUARDS) as fh:
                guards = json.load(fh)
        except (OSError, ValueError):
            guards = []
    print(f"\n=== quirk guards ({len(guards)} sequences) ===")
    guard_fail = 0
    for case in guards:
        ticks_run += len(case["ticks"])
        if run_case(case) is not None:
            guard_fail += 1
            print(f"  BROKEN QUIRK: {case.get('guards')} ({case.get('key')})")
    print(f"  {len(guards) - guard_fail}/{len(guards)} pass")

    # --- regression bank first -------------------------------------------
    print(f"\n=== regression bank ({len(bank)} cases) ===")
    bank_fail = 0
    for case in bank:
        diff = run_case(case)
        ticks_run += len(case["ticks"])
        if diff is not None:
            bank_fail += 1
            print(f"  STILL FAILING {case['key']}: {case['note']}")
    print(f"  {len(bank) - bank_fail}/{len(bank)} pass")

    # --- layer 1: grid ----------------------------------------------------
    grid_n = 0
    if not args.no_grid:
        print("\n=== layer 1: grid ===")
        for case in _grid_cases():
            grid_n += 1
            ticks_run += len(case["ticks"])
            diff = run_case(case)
            if diff is not None:
                failures += 1
                if added < args.max_store and add_fixed(bank, case, diff):
                    added += 1
        print(f"  {grid_n} sequences, {failures} divergences")

    # --- layers 2 + 3: threshold-biased and pure random -------------------
    total = 3000 if args.quick else args.sequences
    print(f"\n=== layers 2+3: {total} random sequences ===")
    rng = random.Random(args.seed)
    rand_fail = 0
    report_every = max(1, total // 10)
    for i in range(total):
        layer = "threshold" if (i % 2 == 0) else "random"
        knobs = _knobs(rng, layer)
        case = {"knobs": knobs, "ticks": _ticks(rng, knobs, layer), "layer": layer}
        ticks_run += len(case["ticks"])
        diff = run_case(case)
        if diff is not None:
            rand_fail += 1
            if added < args.max_store and add_fixed(bank, case, diff):
                added += 1
                print(f"  NEW divergence @seq {i} tick {diff['tick']}: "
                      f"oracle={diff['oracle_limit']} eb={diff['eb_limit']} "
                      f"({diff['input']})")
        if (i + 1) % report_every == 0:
            el = time.time() - t0
            print(f"  {i + 1}/{total}  divergences={rand_fail}  {el:.0f}s")

    elapsed = time.time() - t0
    failures += rand_fail

    if added:
        save_fixed(bank)

    print("\n=== summary ===")
    print(f"  sequences : {len(bank) - added + grid_n + total}")
    print(f"  ticks     : {ticks_run:,} per side ({ticks_run * 2:,} total)")
    print(f"  runtime   : {elapsed:.1f}s  ({ticks_run / max(elapsed, 1e-9):,.0f} ticks/s)")
    print(f"  divergences: {failures}  (bank now holds {len(bank)}, {added} new)")
    print(f"  wiring    : {'ok' if not fails else 'FAILED'}")
    print(f"  quirks    : {'ok' if not guard_fail else 'BROKEN'}")

    return 1 if (failures or fails or bank_fail or guard_fail) else 0


if __name__ == "__main__":
    raise SystemExit(main())
