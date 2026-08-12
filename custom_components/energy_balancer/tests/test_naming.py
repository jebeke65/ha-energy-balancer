"""Tests for the mode vocabulary — see NAMING.md.

The system layer carries no vendor words. `self_consumption` was borrowed from a
Marstek work mode and `smart` said nothing about what it does; they are now
`surplus` and `balanced`.

Stored config entries still hold the old spellings, so both must load. The alias
lives on CellConfig itself, not at a call site — a legacy mode must not be able to
enter the chain by any route. An unrecognised mode falls through to "idle" without
raising, so a silent typo here costs you a battery that never charges.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core import (CellConfig, CellState, Downstream, Upstream,
                  MODE_ALIASES, normalize_mode, migrate_cell_modes, process_cell)


def _battery(mode, soc=50.0, measured=0.0, target=50.0):
    cfg = CellConfig(id="bat", position=2, mode=mode, type="house_battery",
                     max_charge_w=5000, max_discharge_w=5000, capacity_kwh=10,
                     min_soc=10, max_soc=95, has_soc=True, target_soc=target)
    return cfg, CellState(soc=soc, measured_w=measured)


# --- the alias itself -------------------------------------------------------

def test_normalize_maps_the_legacy_spellings():
    assert normalize_mode("self_consumption") == "surplus"
    assert normalize_mode("smart") == "balanced"


def test_normalize_leaves_current_and_structural_modes_alone():
    for mode in ("off", "surplus", "balanced", "supply", "demand", "grid"):
        assert normalize_mode(mode) == mode


def test_alias_table_covers_exactly_the_two_renamed_modes():
    # Guards the removal step: when the config entry is migrated and the alias is
    # dropped, this test tells you what you are dropping.
    assert MODE_ALIASES == {"self_consumption": "surplus", "smart": "balanced"}


# --- the alias cannot be bypassed -------------------------------------------

def test_cellconfig_normalizes_on_construction():
    # Not the coordinator's job: tests and other callers build CellConfig directly.
    assert CellConfig(id="c", position=2, mode="smart").mode == "balanced"
    assert CellConfig(id="c", position=2, mode="self_consumption").mode == "surplus"


# --- old and new spelling must behave identically ---------------------------

def _run(mode, **kw):
    cfg, st = _battery(mode, **kw)
    out, rest_out, _flags, _fc, prev = process_cell(
        cfg, st, Downstream(rest_w=2000.0, forecast_wh=5000.0),
        Upstream(headroom_w=3500.0, current_power_w=0.0))
    return out.action, out.power_w, rest_out, prev


def test_balanced_behaves_exactly_like_the_old_smart():
    assert _run("balanced", soc=20, target=50) == _run("smart", soc=20, target=50)
    assert _run("balanced", soc=80, target=50) == _run("smart", soc=80, target=50)


def test_surplus_behaves_exactly_like_the_old_self_consumption():
    # "self_consumption" here is the legacy MODE, not the old action token — the
    # alias must still map it onto surplus.
    assert _run("surplus", measured=800) == _run("self_consumption", measured=800)
    assert _run("surplus", measured=-800) == _run("self_consumption", measured=-800)


def test_balanced_below_target_still_charges():
    # Anchors the meaning, not just the equality: a rename that silently turned the
    # mode into a no-op would pass the two tests above if both sides broke together.
    action, power, _rest, _prev = _run("balanced", soc=20, target=50)
    assert action == "consume"
    assert power > 0


# --- config-entry migration (v1 → v2) ---------------------------------------

LEGACY_CONF = {
    "observer_mode": False,
    "peak_limit_w": 3500,
    "cells": {
        "car_charger": {"position": 1, "mode": "self_consumption",
                        "type": "car_charger", "algo": {"take_pct": 80}},
        "goodwe": {"position": 2, "mode": "smart", "type": "house_battery"},
        "marstek": {"position": 2, "mode": "smart", "type": "house_battery"},
    },
}


def test_migration_rewrites_every_cell_mode():
    out = migrate_cell_modes(LEGACY_CONF)
    assert {c: v["mode"] for c, v in out["cells"].items()} == {
        "car_charger": "surplus", "goodwe": "balanced", "marstek": "balanced"}


def test_migration_leaves_everything_else_untouched():
    out = migrate_cell_modes(LEGACY_CONF)
    assert out["observer_mode"] is False
    assert out["peak_limit_w"] == 3500
    assert out["cells"]["car_charger"]["algo"] == {"take_pct": 80}
    assert out["cells"]["car_charger"]["type"] == "car_charger"


def test_migration_does_not_mutate_the_input():
    # async_update_entry gets the result; the entry's own dict must not be edited
    # underneath it.
    migrate_cell_modes(LEGACY_CONF)
    assert LEGACY_CONF["cells"]["goodwe"]["mode"] == "smart"


def test_migration_is_idempotent():
    once = migrate_cell_modes(LEGACY_CONF)
    assert migrate_cell_modes(once) == once


def test_migration_survives_an_empty_options_dict():
    # entry.options is {} on an entry that was never edited through the UI —
    # migrating it must not raise or invent a cells key.
    assert migrate_cell_modes({}) == {}
    assert "cells" not in migrate_cell_modes({"peak_limit_w": 3500})


# --- forced modes: charge / discharge / autonomous ---------------------------
#
# These three did not exist before 2026-07-13. They are the only part of the
# rename that adds behaviour rather than moving words around, so they carry their
# own tests. See NAMING.md §3.1.

def _cell(mode, *, soc=50.0, measured=0.0, rest=0.0, headroom=3500.0,
          take_pct=100.0, can_charge=True, can_discharge=True, flags=None):
    cfg = CellConfig(id="bat", position=2, mode=mode, type="house_battery",
                     max_charge_w=5000, max_discharge_w=4000, capacity_kwh=10,
                     min_soc=10, max_soc=95, has_soc=True, target_soc=50,
                     take_pct=take_pct, can_charge=can_charge,
                     can_discharge=can_discharge)
    st = CellState(soc=soc, measured_w=measured)
    out, rest_out, _f, _fc, _prev = process_cell(
        cfg, st, Downstream(rest_w=rest, forecast_wh=0.0, flags=flags or set()),
        Upstream(headroom_w=headroom, current_power_w=0.0))
    return out, rest_out


def test_charge_grid_charges_without_any_surplus():
    # The whole point of the mode: a deficit must not stop it. Give it peak room
    # to spare, so the cap under test here is the hardware maximum and nothing else.
    out, _rest = _cell("charge", soc=40, rest=-500, headroom=9000)
    assert out.action == "consume"
    assert out.power_w == 5000        # full max_charge_w, taper 1.0 at SoC 40


def test_charge_respects_the_peak_headroom():
    # A forced mode may not push the monthly peak up. Headroom caps the take.
    out, _rest = _cell("charge", soc=40, rest=0, headroom=1200)
    assert out.action == "consume"
    assert out.power_w == 1200


def test_charge_headroom_cap_accounts_for_an_existing_deficit():
    # The cap is rest + headroom, not headroom: with the house already pulling
    # 500W from the grid, only 3000W of the 3500W peak room is still ours. Getting
    # this wrong is a forced mode that quietly raises the monthly peak bill.
    out, _rest = _cell("charge", soc=40, rest=-500, headroom=3500)
    assert out.power_w == 3000


def test_charge_is_scaled_by_take_pct():
    out, _rest = _cell("charge", soc=40, rest=0, take_pct=40)
    assert out.power_w == 2000        # 40% of 5000


def test_charge_stops_at_a_full_battery():
    out, _rest = _cell("charge", soc=95, rest=2000)
    assert out.action == "idle"
    assert out.power_w == 0.0


def test_charge_on_a_cell_that_cannot_charge_stays_idle():
    out, _rest = _cell("charge", soc=40, rest=2000, can_charge=False)
    assert out.action == "idle"


def test_discharge_gives_power_even_when_there_is_surplus():
    # Plain "produce" bails out on rest >= 0; forced discharge is exactly the
    # override of that rule, and may push the surplus onto the grid.
    out, rest_out = _cell("discharge", soc=80, rest=1000)
    assert out.action == "produce"
    assert out.power_w == -4000       # full max_discharge_w
    assert rest_out == 5000           # discharge adds to the chain


def test_discharge_is_scaled_by_take_pct_and_stops_at_the_floor():
    out, _rest = _cell("discharge", soc=80, rest=-500, take_pct=25)
    assert out.power_w == -1000       # 25% of 4000

    out, _rest = _cell("discharge", soc=10, rest=-500)   # at min_soc
    assert out.action == "idle"


def test_discharge_still_honours_the_no_discharge_interlock():
    # A safety interlock is not a preference the mode may overrule — e.g. don't
    # empty the house battery into the car.
    cfg = CellConfig(id="bat", position=2, mode="discharge", type="house_battery",
                     max_discharge_w=4000, min_soc=10, max_soc=95, has_soc=True,
                     no_discharge_on_flag="car_charging")
    out, _r, _f, _fc, _p = process_cell(
        cfg, CellState(soc=80),
        Downstream(rest_w=-1000, forecast_wh=0.0, flags={"car_charging"}),
        Upstream(headroom_w=3500, current_power_w=0.0))
    assert out.action == "idle"
    assert out.power_w == 0.0


def test_autonomous_never_steers_but_still_reports_what_it_measures():
    # EB commands nothing; the device regulates itself. The measured power must
    # still propagate into rest — meten is weten — or the next cell is handed a
    # surplus that is already spent.
    out, rest_out = _cell("autonomous", soc=60, measured=900, rest=2000)
    assert out.action == "autonomous"
    assert out.power_w == 900
    assert rest_out == 1100           # 2000 − 900


def test_autonomous_reports_a_discharging_cell_too():
    out, rest_out = _cell("autonomous", soc=60, measured=-700, rest=500)
    assert out.power_w == -700
    assert rest_out == 1200           # 500 − (−700)


# --- control: the other axis (NAMING.md §2) ----------------------------------

def test_control_says_who_is_steering_not_what_happens():
    from core import control_of
    # EB commands a setpoint — including zero. "Hold at zero" is a command.
    assert control_of("consume") == "eb"
    assert control_of("produce") == "eb"
    assert control_of("idle") == "eb"
    # EB let go. Not the same thing as idle: on the goodwe these are physically
    # different work modes (general vs backup), and conflating them is dangerous.
    assert control_of("autonomous") == "cell"
    assert control_of("off") == "none"
    assert control_of("offline") == "unreachable"


def test_control_of_a_structural_cell_is_none():
    from core import control_of
    # Solar, house and grid are observed, never commanded.
    for action in ("supply", "demand", "import", "export", "anything"):
        assert control_of(action) == "none"


def test_solar_and_house_are_not_steered_even_though_they_produce_and_consume():
    from core import control_of
    # The real trap: solar emits the action "produce" and the house emits "consume".
    # Both of those mean "EB commanded it" on a steerable cell — so deriving control
    # from the action alone filed them under `eb`, and the chain card then printed a
    # take-% limit next to a cell nobody was limiting. The mode decides.
    assert control_of("produce", "supply") == "none"     # solar
    assert control_of("consume", "demand") == "none"     # house
    assert control_of("idle", "grid") == "none"          # net
    # ...while the same actions on a steerable cell really are EB's doing.
    assert control_of("consume", "surplus") == "eb"      # car charger
    assert control_of("produce", "balanced") == "eb"     # battery discharging
    assert control_of("autonomous", "balanced") == "cell"


# --- v2 -> v3: entity wiring adopted from the package ------------------------
#
# 2026-07-14: editing .storage/core.config_entries by hand does not stick. HA holds
# the entries in memory and writes its own copy back on shutdown, so the edit is
# silently discarded — which is why the forecast sensors never appeared and the car
# take_pct kept pointing at the old helper. A migration is the only honest route.

SEED = {
    "solar_sensor": "sensor.solar",
    "forecast_today_sensor": "sensor.solar_forecast_today",
    "forecast_tomorrow_sensor": "sensor.solar_forecast_tomorrow",
    "cells": {
        "car_charger": {"algo": {"take_pct": "input_number.car_battery_split"}},
    },
}

ENTRY = {
    "solar_sensor": "sensor.solar",
    "peak_limit_w": 3500,
    "cells": {
        "car_charger": {"mode": "surplus",
                        "algo": {"take_pct": "input_number.eb_car_charger_take",
                                 "charge_floor_w": 1400}},
        "goodwe": {"mode": "balanced", "algo": {"take_pct": 80}},
    },
}


def test_wiring_adds_the_keys_the_entry_never_had():
    from core import adopt_wiring
    out = adopt_wiring(ENTRY, SEED)
    assert out["forecast_today_sensor"] == "sensor.solar_forecast_today"
    assert out["forecast_tomorrow_sensor"] == "sensor.solar_forecast_tomorrow"


def test_wiring_repoints_take_pct_at_the_knob_the_package_names():
    from core import adopt_wiring
    out = adopt_wiring(ENTRY, SEED)
    assert out["cells"]["car_charger"]["algo"]["take_pct"] == "input_number.car_battery_split"


def test_wiring_does_not_touch_a_cell_the_seed_says_nothing_about():
    from core import adopt_wiring
    out = adopt_wiring(ENTRY, SEED)
    # goodwe has no take_pct in the seed — the number the user set survives.
    assert out["cells"]["goodwe"]["algo"]["take_pct"] == 80


def test_wiring_never_overwrites_a_value_the_user_tuned():
    from core import adopt_wiring
    out = adopt_wiring(ENTRY, SEED)
    assert out["peak_limit_w"] == 3500                                   # not in seed
    assert out["cells"]["car_charger"]["algo"]["charge_floor_w"] == 1400  # left alone


def test_wiring_is_idempotent_and_does_not_mutate_the_entry():
    from core import adopt_wiring
    once = adopt_wiring(ENTRY, SEED)
    assert adopt_wiring(once, SEED) == once
    assert ENTRY["cells"]["car_charger"]["algo"]["take_pct"] == "input_number.eb_car_charger_take"


def test_wiring_survives_an_empty_seed_or_an_empty_entry():
    from core import adopt_wiring
    assert adopt_wiring(ENTRY, {}) == ENTRY
    assert adopt_wiring({}, SEED)["forecast_today_sensor"] == "sensor.solar_forecast_today"
