"""pytest: put the integration's modules on sys.path.

The tests import EB's modules flat (`from core import ...`), without the package
__init__ (which needs Home Assistant). tests/ sits either inside the integration
or at the repository root; this finds the integration in both layouts.
"""

import os
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
for _candidate in (os.path.dirname(_HERE),
                   os.path.join(os.path.dirname(_HERE), "custom_components", "energy_balancer")):
    if os.path.exists(os.path.join(_candidate, "core.py")):
        sys.path.insert(0, _candidate)
        break
sys.path.insert(0, _HERE)
