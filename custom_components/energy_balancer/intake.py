"""Translation layer on the input side — foreign charge policy → EB vocabulary.

Mirror image of the actuator layer. Down at the hardware end, `actuation.py`
turns an EB action into a neutral actuator verb and the vendor words live only
in the `script.eb_actuator_*` scripts. Up here the same seam is needed for what
comes *in*: an external charge brain speaks its own dialect, and EB should never
have to understand it.

Why this exists at all
----------------------
The pool brain publishes a single number for what are, in its own code, five
distinct decisions — and three of them are `0`:

  * "charge at N%"                             → a real setpoint
  * "I want to charge but have no peak room"   → 0
  * "sensors dropped out, do not charge"       → 0
  * "manual autonomous / manual discharge"     → 0
  * "inside the dead band, let go"             → 0

Reading only the number, those collapse into one value and EB has to guess.
Guessing wrong is expensive: read as "let go" a safety stop becomes a release,
and read as "stand still" a release becomes a hard stop that parks both
batteries while the house draws from the grid.

The brain does publish its intent, in a `mode` attribute next to the number.
This module turns that pair into one unambiguous EB-side intent, so nothing
downstream ever sees a foreign word.

Bypassing it later
------------------
`from_external` is the only function that knows a foreign dialect. Drop the
brain from the config and the coordinator passes `None`, which every consumer
already reads as "no external policy — work it out yourself". Replace the brain
with EB's own charge policy and you emit `ChargeIntent` directly: the seam stays,
the translation disappears. That is the point of putting it here rather than
inlining the mapping in the coordinator.
"""

from dataclasses import dataclass

# What EB understands. Deliberately three, not two.
WANT_CHARGE = "charge"        # pull power in, at `pct` of the pool's charge cap
WANT_NO_CHARGE = "no_charge"  # do not pull from the grid — but keep covering the house
WANT_RELEASE = "release"      # hand the cells over; they regulate themselves

# The dialect this module translates. These strings are the ONLY foreign tokens
# in the integration, and they are confined to the table below.
_MODE_CHARGE = "eco_charge"
_MODE_SELF = "general"


@dataclass(frozen=True)
class ChargeIntent:
    """What an external charge policy wants from the pool.

    `pct` is only meaningful for WANT_CHARGE; the other two carry 0.0 so a
    caller that ignores `want` still cannot accidentally grid-charge.
    """

    want: str
    pct: float = 0.0
    source: str = ""

    @property
    def charging(self) -> bool:
        return self.want == WANT_CHARGE and self.pct > 0.0


def from_external(mode, pct, available: bool = True) -> ChargeIntent | None:
    """Translate one external charge-brain reading into an EB intent.

    Returns None when there is nothing to translate — no brain configured, or
    its sensor is unavailable. None means "no external policy", which leaves EB
    on its own charge ramp; it does NOT mean "do not charge".

    `no_charge` is not `idle`. It says: do not pull from the grid. Covering the
    house from the batteries is a separate decision and stays with the tier —
    which is why an empty peak window must never park a battery that still has
    charge in it.
    """
    if not available or mode is None:
        return None

    token = str(mode).strip().lower()

    try:
        value = float(pct)
    except (TypeError, ValueError):
        # A mode we understand with a number we do not: treat the number as
        # missing rather than as zero. Zero is a decision; this is an absence.
        return ChargeIntent(WANT_NO_CHARGE, 0.0, f"{token}/unparsable")

    if token == _MODE_CHARGE:
        if value > 0.0:
            return ChargeIntent(WANT_CHARGE, max(0.0, min(100.0, value)), token)
        # Wanting to charge at 0% is not the same as not wanting to charge.
        # The brain emits this both when the peak window is full and when its
        # own inputs dropped out. Both mean: no grid charging right now. Neither
        # means: let go, and neither means: stand still.
        return ChargeIntent(WANT_NO_CHARGE, 0.0, token)

    if token == _MODE_SELF:
        # The brain's hands-off mode, whatever number rides along with it.
        return ChargeIntent(WANT_RELEASE, 0.0, token)

    # An unknown dialect is not a licence to invent policy. Fall back to EB's
    # own ramp rather than picking one of the three at random.
    return None
