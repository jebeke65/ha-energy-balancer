"""The input translation layer: foreign charge policy → EB intent.

The whole reason this layer exists is that the external brain says `0` for
several different decisions. These tests pin down that each of them lands on the
right side, because getting it wrong is not a cosmetic bug: read a safety stop as
"let go" and the batteries are handed over during a sensor outage; read a release
as "stand still" and both batteries are parked while the house buys from the grid.
"""

from intake import (
    WANT_CHARGE,
    WANT_NO_CHARGE,
    WANT_RELEASE,
    ChargeIntent,
    from_external,
)


# --- the five branches the brain can emit ------------------------------------

def test_charge_with_a_setpoint_is_a_charge():
    i = from_external("eco_charge", 40)
    assert i.want == WANT_CHARGE
    assert i.pct == 40
    assert i.charging


def test_charge_at_zero_is_not_a_release():
    """No peak room, and sensor dropout, both arrive here.

    The brain still wants to charge; it just cannot right now. That must not be
    read as "hands off" — a release during a sensor outage is exactly what the
    brain's own comment ("prevent grid spikes") is trying to avoid.
    """
    i = from_external("eco_charge", 0)
    assert i.want == WANT_NO_CHARGE
    assert not i.charging


def test_self_regulation_is_a_release():
    i = from_external("general", 0)
    assert i.want == WANT_RELEASE


def test_a_number_alongside_release_does_not_turn_it_into_a_charge():
    """The brain pins 0 here, but the intent is carried by the mode, not the number."""
    assert from_external("general", 75).want == WANT_RELEASE


def test_unavailable_means_no_policy_at_all():
    """None is not "do nothing" — it is "nobody is steering, work it out yourself"."""
    assert from_external("eco_charge", 40, available=False) is None
    assert from_external(None, 0) is None


# --- robustness --------------------------------------------------------------

def test_an_unknown_dialect_is_not_a_licence_to_invent_policy():
    assert from_external("turbo_mode", 50) is None


def test_case_and_padding_do_not_change_the_meaning():
    assert from_external("  ECO_Charge ", 30).want == WANT_CHARGE
    assert from_external("General", 0).want == WANT_RELEASE


def test_an_unparsable_number_is_an_absence_not_a_zero():
    i = from_external("eco_charge", "unknown")
    assert i.want == WANT_NO_CHARGE


def test_a_percentage_is_clamped_to_its_range():
    assert from_external("eco_charge", 140).pct == 100
    assert from_external("eco_charge", -20).want == WANT_NO_CHARGE


def test_only_a_real_charge_can_report_charging():
    for i in (ChargeIntent(WANT_NO_CHARGE), ChargeIntent(WANT_RELEASE),
              ChargeIntent(WANT_CHARGE, 0.0)):
        assert not i.charging


def test_the_source_is_carried_for_diagnosis():
    """The reason strings on the cell sensors quote this — keep it populated."""
    assert from_external("eco_charge", 40).source
    assert from_external("general", 0).source
