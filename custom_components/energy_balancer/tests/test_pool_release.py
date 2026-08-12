"""Regression: a zero charge setpoint must never park the pool.

The external pool brain publishes a single number and means several things by 0.
EB used to see only that number, so "let the cells regulate themselves" arrived
here as a plain 0. Distributing 0 W hands every member an `idle`, and the
actuators turn idle into a hard stop (gates off). The house then imported from
the grid while both batteries sat there with charge in them. Observed
2026-07-29: grid 243 W, house 886 W, solar 624 W, pool parked at 16.8% SoC.

Since the intake layer the number no longer travels alone — it arrives as an
intent, so the two kinds of zero are told apart. Both must still keep the pool
out of a hard stop; that is what these tests hold onto.
"""

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core import compute
from intake import from_external
from test_tier import chain, o

BELOW_TARGET = ({"soc": 16, "target": 25}, {"soc": 19, "target": 25})
ABOVE_TARGET = ({"soc": 60, "target": 25}, {"soc": 60, "target": 25})


def _tier(socs, mode, pct):
    """Run the live path (tier_pct present) with a translated external policy."""
    cells = chain(600, 900, *socs)
    return compute(cells, grid_w=0.0, tier_pct={4: 0.0},
                   intent=from_external(mode, pct))


# --- the bug this file exists for -------------------------------------------

def test_hands_off_releases_instead_of_parking():
    """Below target, brain hands over: both cells regulate themselves."""
    r = _tier(BELOW_TARGET, "general", 0)
    g, m = o(r, "goodwe"), o(r, "marstek")
    assert g.action == "autonomous", g.reason
    assert m.action == "autonomous", m.reason
    assert g.action != "idle" and m.action != "idle"


def test_wanting_to_charge_without_room_also_does_not_park():
    """The other zero: the brain wants to charge but has no peak room.

    Different intent, same hard requirement — a battery with charge in it may not
    be switched off while the house is drawing.
    """
    r = _tier(BELOW_TARGET, "eco_charge", 0)
    g, m = o(r, "goodwe"), o(r, "marstek")
    assert g.action != "idle", g.reason
    assert m.action != "idle", m.reason


def test_the_two_zeroes_are_distinguishable_afterwards():
    """Diagnosis depends on this: the reason must say which zero it was."""
    hands_off = o(_tier(BELOW_TARGET, "general", 0), "goodwe").reason
    no_room = o(_tier(BELOW_TARGET, "eco_charge", 0), "goodwe").reason
    assert hands_off != no_room
    assert "general" in hands_off
    assert "no grid charging" in no_room


# --- and the fix must not overreach ------------------------------------------

def test_a_real_setpoint_still_charges():
    r = _tier(BELOW_TARGET, "eco_charge", 50)
    g, m = o(r, "goodwe"), o(r, "marstek")
    assert "consume" in (g.action, m.action)
    assert (g.power_w + m.power_w) > 0


def test_release_above_target_keeps_its_own_reason():
    """The pre-existing release path is driven by SoC, not by the brain."""
    g = o(_tier(ABOVE_TARGET, "general", 0), "goodwe")
    assert g.action == "autonomous"
    assert "target" in g.reason


def test_no_external_policy_falls_back_to_ebs_own_ramp():
    """No brain configured: EB must still steer, not sit on its hands."""
    cells = chain(600, 900, *BELOW_TARGET)
    r = compute(cells, grid_w=0.0, tier_pct={4: 0.0}, intent=None)
    g, m = o(r, "goodwe"), o(r, "marstek")
    assert (g.power_w + m.power_w) > 0, (g.reason, m.reason)
