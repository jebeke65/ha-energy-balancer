"""The ceiling: three inputs, one rule.

    ceiling = max( month start , P1 monthly peak , your max )

* **month start** (`peak_limit_w`, in the configuration) — what you want the
  month to cost. Never moves by itself, and at the start of the month, while the
  P1 meter still reads zero, it is the whole ceiling.
* **P1 monthly peak** (`month_peak_sensor`, in the configuration) — what
  actually happened. If the month already stands at 3498, staying lower saves
  nothing any more; that room is already paid for.
* **your max** (`number.eb_peak_max_w`) — a knob that can only go up. Its lower
  bound moves with `max(month start, P1)`, because setting it below reality
  means nothing: a quarter hour that is spent cannot be undone.

The logic lives in `coordinator.py`, which imports homeassistant and so does not
fit this runner. Here the rule stands on its own; the last test guards that the
two do not drift apart — exactly the trap in which 247 tests stayed green while
every live tick crashed (2026-08-31).
"""

import sys, os, re, pathlib
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))


def ceiling(month_start, p1_peak, own_max):
    return max(month_start, p1_peak, own_max)


def knob_lower_bound(month_start, p1_peak):
    """The minimum the max knob may be set to."""
    return max(month_start, p1_peak)


# --------------------------------------------------------------- the ceiling
def test_start_of_the_month_is_the_month_start():
    """P1 at zero, knob not set: the month start is the whole ceiling."""
    assert ceiling(2500, 0, 0) == 2500


def test_measured_peak_lifts_the_ceiling():
    """Month already at 3498: staying lower saves nothing any more."""
    assert ceiling(2500, 3498, 0) == 3498


def test_quiet_month_does_not_lower_the_ceiling():
    """A low reading must never push BELOW your month start."""
    assert ceiling(2500, 900, 0) == 2500


def test_winter_you_deliberately_allow_more():
    assert ceiling(2500, 900, 5000) == 5000
    assert ceiling(2500, 3498, 5000) == 5000


def test_the_knob_can_only_lift_the_ceiling():
    """Setting it below reality does not change the outcome."""
    assert ceiling(2500, 3498, 3000) == 3498     # knob below P1 → P1 wins
    assert ceiling(2500, 0, 1000) == 2500        # knob below start → start wins


def test_ceiling_is_never_below_the_month_start():
    for p1 in range(0, 8000, 250):
        for knob in (0, 1000, 3000, 5000):
            assert ceiling(2500, p1, knob) >= 2500, (p1, knob)


# ------------------------------------------------- the knob's lower bound
def test_lower_bound_at_month_start():
    """Fresh month: you may not go below your own month start."""
    assert knob_lower_bound(2500, 0) == 2500


def test_lower_bound_follows_the_measured_peak():
    """If the month has already reached 3498, that is the lower bound."""
    assert knob_lower_bound(2500, 3498) == 3498


def test_lower_bound_moves_up_with_it():
    previous = 0
    for p1 in (0, 1000, 2400, 2600, 3498, 4200):
        now = knob_lower_bound(2500, p1)
        assert now >= previous
        previous = now


# ------------------------------------------------------- copy == original
def test_the_rule_is_the_same_as_in_the_coordinator():
    """This copy must match what coordinator.py actually does.

    Without this test the file only tests itself.
    """
    root = pathlib.Path(__file__).resolve().parent.parent
    src = next(p for p in (root / "coordinator.py",
                           root / "custom_components" / "energy_balancer" / "coordinator.py")
               if p.exists())
    t = src.read_text()
    assert "peak_limit = max(self.peak_limit_default, running_peak, self.peak_max_w)" in t, \
        "coordinator.py no longer computes the ceiling as the max of the three"
    assert re.search(r"if v > running_peak:\s*\n\s*running_peak = v", t), \
        "coordinator.py no longer takes `running_peak` as the maximum over the sensors"
    assert "return max(self.peak_limit_default, measured)" in t, \
        "coordinator.py no longer returns the knob's lower bound as max(start, reading)"
