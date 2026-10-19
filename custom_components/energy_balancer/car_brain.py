"""Car-brain: a 1:1 port of the AppDaemon app ManageCarCharge.

Source of truth: /config/appdaemon/apps/battery_optimisation/manage_car_charge.py
(class ManageCarCharge — blocks `_block_basislogica`, `_block_hysteresis` and the
clamp inside `_set_limit_if_needed`).

This module replicates the app's BEHAVIOUR, not its intent. Where the app has a
quirk, the quirk is ported verbatim and marked `QUIRK:`. Do not "fix" any of them
here — the parity harness (tests/test_car_parity.py) drives this port and the real
app side by side, tick by tick, so a well-meaning correction shows up as a failure.

The app keeps its state on `self` (a deque buffer, a timestamp, the last limit).
Here that state is explicit, so the coordinator can carry it across ticks and the
harness can drive it deterministically.

No Home Assistant imports: this file must stay importable on its own.
"""

from __future__ import annotations

from collections import deque
from dataclasses import dataclass, field

# The app's mode vocabulary (input_select.car_charge_mode).
MODE_OFF = "Off"
MODE_AUTO = "Automatisch"
MODE_SOLAR = "Solar"


@dataclass
class CarBrainConfig:
    """The app's tunables.

    Defaults are the *app defaults* (`self.args.get(...)`), NOT the values in
    apps.yaml — the caller supplies those. apps.yaml values are in the comments.
    """

    min_charge_w: int = 1440      # apps.yaml: 2000 (fallback when the slider is unusable)
    hyst_w: int = 200             # apps.yaml: 50
    debounce_s: int = 600         # apps.yaml: 15
    solar_debounce_s: int = 300   # apps.yaml: 300
    average_n: int = 30           # apps.yaml: 5 — QUIRK: a SAMPLE COUNT, not seconds
    limit_step_w: int = 50        # apps.yaml: 50
    max_charge_w: int = 7360      # not set in apps.yaml → app default
    ratio_fallback: float = 50.0  # apps.yaml: 50


@dataclass
class CarBrainState:
    """What the app keeps on `self` between ticks."""

    buffer: deque = field(default_factory=lambda: deque(maxlen=30))
    # app: `self.last_above_start = datetime.min`. Here a float epoch; the
    # sentinel is -inf so "elapsed" is effectively infinite before the first
    # start — the same practical effect as datetime.min.
    last_above_start: float = float("-inf")
    current_limit: int = 0
    # EB-only (not in the app): latch of the "Surplus" gate, see core.py.
    surplus_open: bool = False

    @classmethod
    def for_config(cls, cfg: CarBrainConfig) -> "CarBrainState":
        """Fresh state, buffer sized like the app's `deque(maxlen=average_s)`."""
        return cls(buffer=deque(maxlen=_maxlen(cfg.average_n)))

    def resize_buffer(self, average_n: int) -> None:
        """Follow a live change of average_n.

        The app cannot do this — maxlen is fixed at initialize() — so the parity
        harness never changes average_n mid-sequence. This exists so that turning
        the slider in HA does not leave a stale maxlen behind.
        """
        n = _maxlen(average_n)
        if self.buffer.maxlen != n:
            self.buffer = deque(self.buffer, maxlen=n)


def apply_input_change(state: "CarBrainState") -> None:
    """EB-only: let a deliberate change of ratio/mode act on the NEXT tick.

    Not part of the port — `tick()` never calls this; the coordinator does.

    The app subscribes to the ratio and mode helpers and clears its average
    buffer in the callback (`listen_state` -> `_on_change` -> `buffer.clear()`).
    EB polls instead of subscribing, so that half has to be done here.

    The step beyond the app is `last_above_start`. The app leaves that clock
    running, so a ratio you lower by hand does nothing for up to
    `solar_debounce_s` (300 s): the brain sees "computed power below stop" and
    cannot tell your slider from a passing cloud. Measured 2026-09-23 with both
    sides live: ratio set to 30 % at 15:19:55, the app stopped at 15:24:56 —
    301 s later. Resetting the clock makes a deliberate change land on the next
    tick. Cloud protection is untouched, because only an actual change of the
    inputs reaches this function.
    """
    state.buffer.clear()
    state.last_above_start = float("-inf")


def _maxlen(average_n) -> int:
    """The app: `deque(maxlen=int(args.get("average_s", 30)))`.

    average_n = 0 would give a deque that never stores anything; the app then
    hits `if not self.buffer: return` and publishes NOTHING that tick (the sensor
    keeps its old value). That is out of scope here — the params spec enforces a
    minimum of 1 — so we clamp rather than model a no-publish tick.
    """
    try:
        return max(1, int(average_n))
    except (TypeError, ValueError):
        return 30


# States that mean "this entity has nothing to say".
UNAVAILABLE_MODE_STATES = (None, "", "unknown", "unavailable")

# EB-only mode, NOT part of the port: the AppDaemon app never had it. core.py
# gates it on the tier SoC and then calls tick() with MODE_SOLAR, so tick()
# itself never sees this token. It is in MODE_CHOICES because that list is what
# the EB car cell accepts (and what its own select offers).
MODE_SURPLUS = "Surplus"

MODE_CHOICES = (MODE_OFF, MODE_AUTO, MODE_SOLAR, MODE_SURPLUS)


def resolve_mode(raw):
    """Map a mode entity's state onto the value `tick()` expects.

    An unavailable helper becomes None, NOT "Automatisch". That distinction is
    load-bearing: `tick()` applies the app's `or "Automatisch"` fallback when it
    decides, while `_set_limit_if_needed` still sees the raw None and therefore
    skips its clamp (QUIRK 2). Collapsing None to a string here would quietly
    change what the brain does with an unreachable helper.

    Shared on purpose: the coordinator resolves the mode with this function and
    the wiring check in tests/test_car_parity.py drives the very same one, so the
    two cannot drift apart.
    """
    if raw in UNAVAILABLE_MODE_STATES:
        return None
    return str(raw)


def _elapsed(now_ts: float, last_ts: float) -> float:
    """Seconds since the last "above start", the way the app measures them.

    The app keeps `last_above_start` as a datetime and does
    `(datetime.now() - last).total_seconds()`. datetime holds whole
    microseconds, so that subtraction is exact. Subtracting two float epochs is
    NOT: 1140.5059999999999 − 840.506 gives 299.99999999999994, which falls on
    the wrong side of a 300 s debounce and makes the brain hold on for another
    tick where the app already stopped. Found by the parity harness at 8M ticks
    (case 80a684d7a11c8814), so quantise to microseconds first.
    """
    if last_ts == float("-inf"):
        return float("inf")
    return (round(now_ts * 1_000_000) - round(last_ts * 1_000_000)) / 1_000_000


def _as_float(value, default: float) -> float:
    """Port of `_get_float`: None or unparsable → default."""
    if value is None:
        return default
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _get_min_charge_w(cfg: CarBrainConfig, min_charge_live) -> int:
    """Port of `_get_min_charge_w`.

    QUIRK: `if v and v > 0` — a slider at exactly 0 is falsy, so it falls back to
    the configured `min_charge_w` instead of meaning "no minimum".
    """
    if min_charge_live is not None:
        try:
            v = float(min_charge_live)
            if v and v > 0:
                return int(v)
        except (TypeError, ValueError):
            pass
    return int(cfg.min_charge_w)


def _resolve_ratio(cfg: CarBrainConfig, ratio) -> float:
    """Port of the ratio read: `float(get_state(...))`, fallback on failure."""
    try:
        return float(ratio)
    except (TypeError, ValueError):
        return float(cfg.ratio_fallback)


def _block_base_logic(cfg: CarBrainConfig, state: CarBrainState,
                       is_solar: bool, ratio, min_charge_live) -> tuple[int, str]:
    """Port of the app's `_block_basislogica` (base logic)."""
    # QUIRK: in Solar the floor is 0 *here*, while the hysteresis block below
    # still builds its thresholds from the configured minimum.
    min_w = 0 if is_solar else _get_min_charge_w(cfg, min_charge_live)
    ratio = _resolve_ratio(cfg, ratio)

    avg_surplus = sum(state.buffer) / len(state.buffer)
    raw_power = round(avg_surplus * ratio / 100.0)

    if raw_power < min_w:
        # QUIRK: in "Automatisch" every result below the floor is lifted TO the
        # floor, which makes the stop branch of the hysteresis unreachable there.
        base_power = min_w
        info = (f"avg={avg_surplus:.0f}W ratio={ratio:.0f}% "
                f"raw={raw_power}W < min({min_w}W) → min")
    else:
        base_power = max(0, raw_power)
        info = (f"avg={avg_surplus:.0f}W ratio={ratio:.0f}% "
                f"raw={raw_power}W ≥ min({min_w}W)")

    return base_power, info


def _block_hysteresis(cfg: CarBrainConfig, state: CarBrainState,
                      base_power: int, is_solar: bool,
                      now_ts: float, min_charge_live) -> tuple[int, str]:
    """Port of `_block_hysteresis`."""
    min_w = 0 if is_solar else _get_min_charge_w(cfg, min_charge_live)
    debounce = cfg.solar_debounce_s if is_solar else cfg.debounce_s

    # The app computes both thresholds twice (once generic, once again inside
    # `if is_solar:`) with byte-identical expressions. Ported once — same result.
    min_cfg = _get_min_charge_w(cfg, min_charge_live)
    start_th = min_cfg + cfg.hyst_w
    stop_th = max(0, min_cfg - cfg.hyst_w)

    if base_power >= start_th:
        state.last_above_start = now_ts
        return base_power, f"≥start({start_th}) → ↑"

    if base_power < stop_th:
        elapsed = _elapsed(now_ts, state.last_above_start)
        if elapsed >= debounce:
            return min_w, (f"<stop({stop_th}) {elapsed:.0f}s≥{debounce}s → min({min_w})")
        # QUIRK: holds `current_limit`, which only moves on a change of at least
        # limit_step_w — so this can compare against a value that lags behind
        # what was actually published.
        return state.current_limit, (f"<stop({stop_th}) dbnc {elapsed:.0f}s<{debounce}s"
                                     f" → hold {state.current_limit}W")

    if base_power > state.current_limit:
        return base_power, (f"band[{stop_th},{start_th}] base({base_power})"
                            f">cur({state.current_limit}) → ↑")

    if base_power < state.current_limit:
        return base_power, (f"band[{stop_th},{start_th}] base({base_power})"
                            f"<cur({state.current_limit}) → ↓")

    return state.current_limit, (f"band[{stop_th},{start_th}] "
                                 f"base≤cur({state.current_limit}) → hold")


def _set_limit_if_needed(cfg: CarBrainConfig, state: CarBrainState,
                         new_limit, min_charge_live, raw_mode) -> int:
    """Port of `_set_limit_if_needed`.

    QUIRK 1: the published value is always the clamped `new_limit`, but
    `current_limit` — which the hysteresis block reads next tick — only moves
    when the change is at least `limit_step_w`.

    QUIRK 2: this re-reads the mode entity WITHOUT the `or "Automatisch"`
    fallback that `_tick` applies. With an unavailable mode entity, `_tick`
    behaves as "Automatisch" while this clamp matches neither branch and lets the
    value through unclamped. Hence `raw_mode` here vs the effective mode above.
    """
    min_w = _get_min_charge_w(cfg, min_charge_live)

    if raw_mode == MODE_AUTO and new_limit != 0:
        new_limit = min(max(int(new_limit), min_w), cfg.max_charge_w)
    elif raw_mode == MODE_SOLAR:
        new_limit = min(max(0, int(new_limit)), cfg.max_charge_w)

    published = new_limit

    if abs(published - state.current_limit) < cfg.limit_step_w:
        return published

    state.current_limit = published
    return published


def tick(cfg: CarBrainConfig, state: CarBrainState, *,
         surplus, ratio, mode, now_ts: float,
         min_charge_live=None) -> tuple[int, str, CarBrainState]:
    """One tick of the car brain. Returns (limit_w, reason, state).

    `state` is mutated in place and also returned, so callers may use either.
    `limit_w` is what the app publishes as `sensor.car_charger_output`; the
    action follows from it (>0 → consume).

    Mirrors `ManageCarCharge._tick` exactly, including the order of operations:
    mode check → buffer append → base logic → hysteresis → clamp.

    `mode` is the RAW entity value: pass None for an unavailable entity, so the
    two-different-fallbacks quirk (see `_set_limit_if_needed`) is reproduced.
    """
    # `_tick` applies `or "Automatisch"`; `_set_limit_if_needed` does not.
    effective_mode = mode or MODE_AUTO

    # 0) MODE CHECK — QUIRK: returns before the buffer is appended, so a spell in
    # "Off" freezes the moving average at its pre-Off contents.
    if effective_mode == MODE_OFF:
        state.current_limit = 0
        return 0, "mode=off", state

    state.buffer.append(_as_float(surplus, 0.0))

    is_solar = effective_mode == MODE_SOLAR

    base_power, info_base = _block_base_logic(
        cfg, state, is_solar, ratio, min_charge_live)
    after_hyst, info_hyst = _block_hysteresis(
        cfg, state, base_power, is_solar, now_ts, min_charge_live)

    reason = "; ".join([r for r in (info_base, info_hyst) if r])
    limit = _set_limit_if_needed(cfg, state, after_hyst, min_charge_live, mode)
    return limit, reason, state


def action_for(limit_w) -> str:
    """The app's `action` attribute: consume above zero, idle otherwise."""
    return "consume" if limit_w > 0 else "idle"
