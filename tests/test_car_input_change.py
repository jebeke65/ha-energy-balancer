"""A hand-changed ratio (or mode) must act on the next tick, not 300 s later.

Background, measured live on 2026-09-23 with EB and the AppDaemon app running
side by side: the ratio went from 100 % to 30 % at 15:19:55 while the sun gave
about 3.9 kW. Both sides kept the car at 4047 W and only dropped to 0 W at
15:24:56 — 301 s later. The reason is `_block_hysteresis`: it holds the current
limit until `last_above_start` is `solar_debounce_s` old, and that clock says
nothing about *why* the computed power fell below the stop threshold. A passing
cloud and a slider look identical to it.

The app has a `listen_state` on the ratio and mode helpers, but its callback
only clears the average buffer — the clock keeps running. EB polls, so its
coordinator notices the change itself and calls `car_brain.apply_input_change`,
which does both: clear the buffer (what the app does) and reset the clock (what
the app does not).

The port itself stays untouched, which is why the parity harness — it drives
`core.compute()` directly, never the coordinator — is unaffected.
"""

import os
import re
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

import car_brain  # noqa: E402

# The runner copies the tests into a flat directory of symlinks, so "../x.py"
# does not exist there. Resolve the package from the module that was imported.
PKG = os.path.dirname(os.path.realpath(car_brain.__file__))


def _source(name: str) -> str:
    with open(os.path.join(PKG, name)) as fh:
        return fh.read()


CFG = car_brain.CarBrainConfig(
    min_charge_w=2000, hyst_w=50, debounce_s=15, solar_debounce_s=300,
    average_n=5, limit_step_w=50, max_charge_w=7360,
)
SURPLUS = 3900.0          # what the sun gave during the measurement
CHARGING = 4048           # where the car sat before the ratio was lowered


def _charging_state():
    """A brain that is charging on 100 % and has just been above start."""
    state = car_brain.CarBrainState.for_config(CFG)
    for _ in range(CFG.average_n):
        car_brain.tick(CFG, state, surplus=SURPLUS, ratio=100,
                       mode="Solar", now_ts=0.0)
    state.current_limit = CHARGING
    state.last_above_start = 0.0
    return state


def test_without_the_reset_the_old_limit_is_held():
    """The measured behaviour: 30 % changes nothing for five minutes."""
    state = _charging_state()
    limit, reason, _ = car_brain.tick(CFG, state, surplus=SURPLUS, ratio=30,
                                      mode="Solar", now_ts=10.0)
    assert limit == CHARGING, f"expected the hold, got {limit} ({reason})"
    assert "dbnc" in reason


def test_apply_input_change_stops_on_the_next_tick():
    """With the clock reset the same tick lands on min (0 W in solar)."""
    state = _charging_state()
    car_brain.apply_input_change(state)
    limit, reason, _ = car_brain.tick(CFG, state, surplus=SURPLUS, ratio=30,
                                      mode="Solar", now_ts=10.0)
    assert limit == 0, f"expected an immediate stop, got {limit} ({reason})"
    assert "min(0)" in reason


def test_apply_input_change_clears_the_buffer_like_the_app():
    state = _charging_state()
    assert len(state.buffer) > 0
    car_brain.apply_input_change(state)
    assert len(state.buffer) == 0
    # maxlen survives, so the window keeps its configured size
    assert state.buffer.maxlen == CFG.average_n


def test_raising_the_ratio_never_needed_the_reset():
    """Upwards was always immediate — proven here so a later 'fix' cannot
    quietly make the up path depend on apply_input_change."""
    state = car_brain.CarBrainState.for_config(CFG)
    for _ in range(CFG.average_n):
        car_brain.tick(CFG, state, surplus=SURPLUS, ratio=30,
                       mode="Solar", now_ts=0.0)
    limit, reason, _ = car_brain.tick(CFG, state, surplus=SURPLUS, ratio=100,
                                      mode="Solar", now_ts=10.0)
    assert limit > 0 and "≥start" in reason, reason


def test_cloud_cover_still_gets_the_full_debounce():
    """No input change: the surplus itself collapses. The hold must stay.

    The window has to empty out first (average_n samples of nothing), so this
    walks the same seconds the sun would: ten per tick, well inside the 300 s.
    """
    state = _charging_state()
    ts = 0.0
    for _ in range(CFG.average_n):
        ts += 10.0
        limit, reason, _ = car_brain.tick(CFG, state, surplus=0.0, ratio=100,
                                          mode="Solar", now_ts=ts)
    assert limit > 0, f"cloud protection gone: stopped after {ts:.0f}s ({reason})"
    assert "dbnc" in reason, reason

    # And it does give up once the debounce is really over.
    limit, reason, _ = car_brain.tick(CFG, state, surplus=0.0, ratio=100,
                                      mode="Solar", now_ts=ts + 300.0)
    assert limit == 0, reason


def test_tick_does_not_call_apply_input_change():
    """The port must stay the app: only the coordinator may reset the clock."""
    src = _source("car_brain.py")
    body = src[src.index("def tick("):]
    assert "apply_input_change" not in body


def test_coordinator_wires_the_change_detection():
    """Source guard — importing the coordinator would drag in all of HA.

    Pins the three parts that make it work: remembering the inputs per cell,
    comparing them, and handing a real change to the brain state.
    """
    src = _source("coordinator.py")
    assert "self._car_inputs" in src, "coordinator forgot the remembered inputs"
    assert "car_brain.apply_input_change" in src, "coordinator stopped resetting"

    block = src[src.index("car_inputs = (cfg.take_pct, cfg.car_mode)"):]
    block = block[:block.index("st = CellState(")]
    assert "car_inputs != self._car_inputs[cfg.id]" in block, \
        "the reset is no longer guarded by an actual change"
    assert re.search(r"self\._car_inputs\[cfg\.id\] = car_inputs", block), \
        "the coordinator does not store the inputs for the next tick"

    # Turning the brain off and on again must not leave a stale comparison.
    assert "self._car_inputs.pop(cfg.id, None)" in src
