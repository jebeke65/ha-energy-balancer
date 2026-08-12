"""Floor mode: balanced runs the algorithm, manual takes the slider verbatim.

The point of "manual" is that it OVERRIDES the safeguards — calculate_min_soc()
clamps the target to a forecast-scaled floor, and a user who deliberately wants
to park the pool lower must be able to. These tests pin that: same config, the
mode alone decides whether the floor applies.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core import CellConfig, _calculate_target


def _cfg(**kw):
    base = dict(id="bat", position=2, mode="balanced", sunny_min_soc=15,
                no_sun_min_soc=40, pv_weight=0.0, hours_until_solar=6,
                base_consumption_w=1000)
    base.update(kw)
    return CellConfig(**base)


def test_balanced_applies_the_algorithm_floor():
    # No sun, no forecast -> the floor clamp lifts the target to no_sun_min_soc.
    assert _calculate_target(_cfg(), 0.0) == 40


def test_manual_takes_the_slider_verbatim():
    c = _cfg(min_soc_mode="manual", manual_min_soc=30)
    assert _calculate_target(c, 0.0) == 30


def test_manual_may_go_below_the_floor():
    # 5% is far under the balanced floor (40) — the safeguard must NOT clamp it.
    c = _cfg(min_soc_mode="manual", manual_min_soc=5)
    assert _calculate_target(c, 0.0) == 5


def test_manual_ignores_forecast_and_consumption():
    # Inputs that would move the balanced target do not move the manual one.
    a = _calculate_target(_cfg(min_soc_mode="manual", manual_min_soc=20), 0.0)
    b = _calculate_target(
        _cfg(min_soc_mode="manual", manual_min_soc=20,
             hours_until_solar=0, base_consumption_w=5000), 20000.0)
    assert a == b == 20


def test_mode_switches_back_to_balanced():
    c = _cfg(min_soc_mode="manual", manual_min_soc=5)
    assert _calculate_target(c, 0.0) == 5
    c.min_soc_mode = "balanced"
    assert _calculate_target(c, 0.0) == 40


def test_default_mode_is_balanced():
    assert _cfg().min_soc_mode == "balanced"
