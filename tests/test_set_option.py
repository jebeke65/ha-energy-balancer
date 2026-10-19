"""energy_balancer.set_option value conversion.

Two jobs:

  1. Prove the keys that already worked behave EXACTLY as before. The old rule
     is reimplemented here as `_old_rule` and the new conversion is compared
     against it over a matrix of inputs. If someone tidies coerce_option and
     changes a float into an int on the way, this goes red.

  2. Pin the new behaviour: a flag really becomes a bool, a duration really
     becomes an int, a mode string is validated against its choices.

One key deliberately differs and is asserted as such: `min_soc_mode`. It has
always been in LIVE_ALGO_KEYS but was unreachable through the service, because
the old rule sent every string through float(). It is typ "str" with choices, so
the spec-driven conversion makes it work. That is a consequence of the rule, not
a separate decision.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ha_stub import load_eb

_params = load_eb("params")
coerce_option = _params.coerce_option
OptionValueError = _params.OptionValueError
CELL_ALGO_SPEC = _params.CELL_ALGO_SPEC
SYSTEM_SPEC = _params.SYSTEM_SPEC

# The keys that were live-tunable before the car brain existed.
OLD_CELL_KEYS = ("sunny_min_soc", "no_sun_min_soc", "hysteresis",
                 "charge_floor_w", "take_pct", "pv_weight", "manual_min_soc")
OLD_SYSTEM_KEYS = ("peak_limit_w", "observer_mode",
                   "import_price_per_kwh", "export_price_per_kwh")

SENTINEL = object()


def _old_rule(value):
    """The conversion exactly as __init__.py did it before this change."""
    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            return SENTINEL          # → vol.Invalid
    return value


def _new(key, value, cell_scope):
    try:
        return coerce_option(key, value, cell_scope=cell_scope)
    except OptionValueError:
        return SENTINEL


# --- 1. no regression on the keys that already worked -----------------------

def test_old_numeric_cell_keys_are_untouched():
    values = [0, 1, 15, 100, 15.5, 0.0, -3, "15", "15.5", "0", "-3",
              "nonsense", "", True, False]
    for key in OLD_CELL_KEYS:
        for v in values:
            old = _old_rule(v)
            new = _new(key, v, True)
            assert type(new) is type(old) and new == old, (
                f"{key} with {v!r}: was {old!r} ({type(old).__name__}), "
                f"now {new!r} ({type(new).__name__})")


def test_old_system_numeric_keys_are_untouched():
    values = [0, 1, 3500, 0.25, "3500", "0.25", "nonsense", ""]
    for key in ("peak_limit_w", "import_price_per_kwh", "export_price_per_kwh"):
        for v in values:
            old = _old_rule(v)
            new = _new(key, v, False)
            assert type(new) is type(old) and new == old, (
                f"{key} with {v!r}: was {old!r}, now {new!r}")


def test_observer_mode_bool_still_passes_through():
    # A real bool went through untouched before and must still do so.
    assert coerce_option("observer_mode", True, cell_scope=False) is True
    assert coerce_option("observer_mode", False, cell_scope=False) is False


def test_observer_mode_string_now_works_instead_of_raising():
    # Before: float("true") raised → rejected. Now it is a bool, which is what
    # a caller writing observer_mode: "true" always meant.
    assert _old_rule("true") is SENTINEL
    assert coerce_option("observer_mode", "true", cell_scope=False) is True
    assert coerce_option("observer_mode", "off", cell_scope=False) is False


def test_unknown_key_falls_back_to_the_old_rule():
    # No spec → the old behaviour, so nothing can quietly change for a key this
    # module does not know about.
    assert coerce_option("something_unknown", "12", cell_scope=True) == 12.0
    assert _new("something_unknown", "nope", True) is SENTINEL


# --- 2. the one intentional difference --------------------------------------

def test_min_soc_mode_was_rejected_before_and_works_now():
    assert _old_rule("balanced") is SENTINEL          # the old rule refused it
    assert coerce_option("min_soc_mode", "balanced", cell_scope=True) == "balanced"
    assert coerce_option("min_soc_mode", "manual", cell_scope=True) == "manual"
    assert _new("min_soc_mode", "nonsense", True) is SENTINEL


# --- 3. the new car-brain keys ----------------------------------------------

def test_use_car_brain_is_a_real_bool():
    for truthy in (True, "true", "True", "on", "yes", "1"):
        assert coerce_option("use_car_brain", truthy, cell_scope=True) is True
    for falsy in (False, "false", "off", "no", "0"):
        assert coerce_option("use_car_brain", falsy, cell_scope=True) is False


def test_use_car_brain_rejects_nonsense():
    assert _new("use_car_brain", "maybe", True) is SENTINEL


def test_durations_become_whole_numbers():
    for key in ("debounce_s", "solar_debounce_s", "average_n"):
        v = coerce_option(key, "15", cell_scope=True)
        assert v == 15 and isinstance(v, int), f"{key} -> {v!r}"
        v = coerce_option(key, 15.7, cell_scope=True)
        assert v == 15 and isinstance(v, int), f"{key} -> {v!r}"
    assert _new("debounce_s", "later", True) is SENTINEL


def test_start_margin_w_stays_a_float_key():
    # Not an int: it is a watt threshold like charge_floor_w.
    assert coerce_option("start_margin_w", "50", cell_scope=True) == 50.0
    assert coerce_option("start_margin_w", 50, cell_scope=True) == 50


def test_car_mode_is_validated_against_its_choices():
    for mode in ("Off", "Automatisch", "Solar"):
        assert coerce_option("car_mode", mode, cell_scope=True) == mode
    # Case matters — car_brain compares the token literally.
    assert _new("car_mode", "solar", True) is SENTINEL
    assert _new("car_mode", "Aan", True) is SENTINEL


def test_every_new_live_key_has_a_spec():
    # A key in LIVE_ALGO_KEYS without a Spec would silently fall back to the
    # numeric rule, which is how a flag would end up stored as 1.0.
    for key in ("use_car_brain", "start_margin_w", "debounce_s",
                "solar_debounce_s", "average_n", "car_mode"):
        assert key in CELL_ALGO_SPEC, f"{key} missing from CELL_ALGO_SPEC"


def test_live_algo_keys_and_specs_agree():
    """Every live-tunable cell key must be one this converter understands."""
    from ha_stub import PKG_DIR
    coord_src = open(os.path.join(PKG_DIR, "coordinator.py")).read()
    block = coord_src.split("LIVE_ALGO_KEYS = (", 1)[1].split(")", 1)[0]
    keys = [k.strip().strip('",\'') for k in block.split(",")
            if k.strip().startswith(('"', "'"))]
    for key in keys:
        assert key in CELL_ALGO_SPEC, f"LIVE_ALGO_KEYS has {key!r}, spec does not"
