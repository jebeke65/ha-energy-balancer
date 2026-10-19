"""Load real EB modules that import Home Assistant, without Home Assistant.

Same trick as oracle_car_brain.py uses for AppDaemon: put just enough of the
`homeassistant` namespace into sys.modules, then import the module for real. The
point is to exercise the SHIPPED classes — a hand-rolled stand-in could carry the
same mistake as the code it stands in for, and then the test proves nothing.

The EB modules use relative imports (`from .const import DOMAIN`), so they need a
package. We register a synthetic package whose __path__ points at the integration
directory; `eb_pkg.const`, `eb_pkg.devices` and friends then resolve normally.
"""

from __future__ import annotations

import importlib
import importlib.util
import os
import sys
import types

# realpath, not abspath: run_tests_stdlib.py runs the suite from a flat
# directory of SYMLINKS, and abspath would resolve to that temp dir.
_HERE = os.path.dirname(os.path.realpath(__file__))
# tests/ lives inside the integration (live) or at the repository root (repo).
PKG_DIR = next(
    (p for p in (os.path.dirname(_HERE),
                 os.path.join(os.path.dirname(_HERE), "custom_components", "energy_balancer"))
     if os.path.exists(os.path.join(p, "core.py"))),
    os.path.dirname(_HERE))
PKG_NAME = "eb_pkg"


# --------------------------------------------------------------------------
# The fake state machine
# --------------------------------------------------------------------------
class FakeState:
    def __init__(self, state, attributes=None):
        self.state = state
        self.attributes = attributes or {}


class FakeStates:
    def __init__(self):
        self._d = {}

    def get(self, entity_id):
        return self._d.get(entity_id)

    def set(self, entity_id, state, attributes=None):
        self._d[entity_id] = FakeState(state, attributes)

    def remove(self, entity_id):
        self._d.pop(entity_id, None)

    def async_entity_ids(self, domain=None):
        return [e for e in self._d if domain is None or e.startswith(domain + ".")]

    def async_all(self, domain=None):
        out = []
        for eid in self.async_entity_ids(domain):
            st = self._d[eid]
            st.entity_id = eid
            out.append(st)
        return out


class FakeServices:
    """Records service calls and applies the ones we care about."""

    def __init__(self, states: FakeStates):
        self.calls = []
        self._states = states

    async def async_call(self, domain, service, data, blocking=False):
        self.calls.append((domain, service, dict(data), blocking))
        # Apply select_option so the fake world behaves like the real one:
        # a service call really does move the helper's state.
        if service == "select_option":
            eid = data["entity_id"]
            old = self._states.get(eid)
            attrs = old.attributes if old else {}
            self._states.set(eid, data["option"], attrs)
        elif service == "set_value":
            eid = data["entity_id"]
            old = self._states.get(eid)
            attrs = old.attributes if old else {}
            self._states.set(eid, data["value"], attrs)


class FakeHass:
    def __init__(self):
        self.states = FakeStates()
        self.services = FakeServices(self.states)
        self.data = {}


# --------------------------------------------------------------------------
# The homeassistant stub
# --------------------------------------------------------------------------
def _mod(name):
    m = types.ModuleType(name)
    sys.modules[name] = m
    return m


def install_ha_stub() -> None:
    if "homeassistant" in sys.modules:
        return

    ha = _mod("homeassistant")
    core = _mod("homeassistant.core")
    const = _mod("homeassistant.const")
    exceptions = _mod("homeassistant.exceptions")
    helpers = _mod("homeassistant.helpers")
    dev_reg = _mod("homeassistant.helpers.device_registry")
    upd_co = _mod("homeassistant.helpers.update_coordinator")
    components = _mod("homeassistant.components")
    select_mod = _mod("homeassistant.components.select")
    number_mod = _mod("homeassistant.components.number")

    class HomeAssistant:  # noqa: D401 - marker only
        pass

    class ConfigEntryError(Exception):
        pass

    class HomeAssistantError(Exception):
        pass

    class ServiceValidationError(HomeAssistantError):
        pass

    def DeviceInfo(**kwargs):          # noqa: N802 - mirrors the HA helper
        return dict(kwargs)

    class Entity:
        _attr_name = None
        _attr_unique_id = None
        _attr_device_info = None
        hass = None

        def async_write_ha_state(self):
            pass

        @property
        def name(self):
            return self._attr_name

        @property
        def unique_id(self):
            return self._attr_unique_id

        @property
        def device_info(self):
            return self._attr_device_info

    class SelectEntity(Entity):
        _attr_options = None
        _attr_current_option = None

        @property
        def options(self):
            return self._attr_options

        @property
        def current_option(self):
            return self._attr_current_option

        @property
        def available(self):
            return True

    class NumberEntity(Entity):
        _attr_native_value = None

    class NumberMode:
        SLIDER = "slider"
        BOX = "box"

    class CoordinatorEntity:
        def __init__(self, coordinator):
            self.coordinator = coordinator

    ha.core = core
    core.HomeAssistant = HomeAssistant
    exceptions.ConfigEntryError = ConfigEntryError
    exceptions.HomeAssistantError = HomeAssistantError
    exceptions.ServiceValidationError = ServiceValidationError

    # frontend / websocket_api / http: just enough for frontend.py to import and
    # for a test to see what it registers.
    frontend_mod = _mod("homeassistant.components.frontend")
    frontend_mod.extra_js = []
    frontend_mod.add_extra_js_url = lambda hass, url: frontend_mod.extra_js.append(url)
    ws_mod = _mod("homeassistant.components.websocket_api")
    ws_mod.registered = []
    ws_mod.websocket_command = lambda schema: (lambda f: f)
    ws_mod.async_response = lambda f: f
    ws_mod.async_register_command = lambda hass, handler: ws_mod.registered.append(handler)
    http_mod = _mod("homeassistant.components.http")

    class StaticPathConfig:
        def __init__(self, url_path, path, cache_headers=True):
            self.url_path, self.path, self.cache_headers = url_path, path, cache_headers

    http_mod.StaticPathConfig = StaticPathConfig
    components.frontend = frontend_mod
    components.websocket_api = ws_mod
    components.http = http_mod
    if "voluptuous" not in sys.modules:
        try:
            import voluptuous  # noqa: F401
        except ImportError:
            vol = _mod("voluptuous")
            vol.Required = vol.Optional = lambda key, **kw: key
    const.PERCENTAGE = "%"
    dev_reg.DeviceInfo = DeviceInfo
    upd_co.CoordinatorEntity = CoordinatorEntity
    select_mod.SelectEntity = SelectEntity
    number_mod.NumberEntity = NumberEntity
    number_mod.NumberMode = NumberMode
    ha.helpers = helpers
    ha.components = components
    helpers.device_registry = dev_reg
    helpers.update_coordinator = upd_co
    components.select = select_mod
    components.number = number_mod


def load_eb(module: str):
    """Import `<integration>/<module>.py` as part of a synthetic package."""
    install_ha_stub()

    if PKG_NAME not in sys.modules:
        pkg = types.ModuleType(PKG_NAME)
        pkg.__path__ = [PKG_DIR]
        sys.modules[PKG_NAME] = pkg

    return importlib.import_module(f"{PKG_NAME}.{module}")
