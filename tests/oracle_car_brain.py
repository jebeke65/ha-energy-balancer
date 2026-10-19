"""The oracle: run the REAL ManageCarCharge app, without AppDaemon.

The app under test is
    /config/appdaemon/apps/battery_optimisation/manage_car_charge.py
and it is never modified — it is the reference. This module stubs
`appdaemon.plugins.hass.hassapi` in `sys.modules`, loads the app module by path,
and drives its real `_tick()` with a controllable clock.

Why not re-implement it here: a re-implementation could carry the same
transcription error as the port, and then the parity test would happily confirm
two identical mistakes. Running the actual app removes that failure mode.

Usage:
    from oracle_car_brain import Oracle
    o = Oracle(args={...})
    limit = o.tick(surplus=1200, ratio=80, mode="Solar", now_ts=1000.0,
                   min_charge=1400)
"""

from __future__ import annotations

import datetime as _datetime_mod
import importlib.util
import sys
import types

APP_PATH = "/config/appdaemon/apps/battery_optimisation/manage_car_charge.py"

SURPLUS_ENTITY = "sensor.solar_surplus_without_car_charger"
RATIO_ENTITY = "input_number.car_battery_split"
MODE_ENTITY = "input_select.car_charge_mode"
MIN_ENTITY = "input_number.minimum_car_charge"


# --------------------------------------------------------------------------
# A datetime replacement whose now() the harness controls.
# --------------------------------------------------------------------------
class _Clock:
    """Holds the current epoch seconds for every FakeDatetime instance."""

    now_ts = 0.0


class _FakeDatetime(_datetime_mod.datetime):
    """Drop-in for `datetime` inside the app module.

    The app uses `datetime.now()` (in `_block_hysteresis` and `_publish_monitor`)
    and `datetime.min` (the initial `last_above_start`). Subclassing the real
    datetime keeps `datetime.min`, arithmetic and `total_seconds()` intact; only
    `now()` is redirected to the harness clock.
    """

    @classmethod
    def now(cls, tz=None):
        return _datetime_mod.datetime.fromtimestamp(_Clock.now_ts, tz)


# --------------------------------------------------------------------------
# Minimal AppDaemon shim
# --------------------------------------------------------------------------
def _install_hassapi_stub() -> None:
    """Put a fake `appdaemon.plugins.hass.hassapi` into sys.modules.

    The app does `import appdaemon.plugins.hass.hassapi as hass` and subclasses
    `hass.Hass`. Our Hass base carries the state dict and the recorded output.
    """
    if "appdaemon.plugins.hass.hassapi" in sys.modules:
        return

    class Hass:
        """The bits of hass.Hass that ManageCarCharge actually touches."""

        def __init__(self):
            self.args = {}
            self._states = {}
            self.published = None      # (state, attributes) of the last set_state
            self.log_lines = []

        # --- state machine ---
        def get_state(self, entity_id, **kwargs):
            return self._states.get(entity_id)

        def set_state(self, entity_id, state=None, attributes=None, **kwargs):
            self.published = (state, attributes or {})
            self._states[entity_id] = state
            return {"entity_id": entity_id, "state": state}

        # --- scheduling / listeners: recorded, never fired ---
        def listen_state(self, callback, entity_id=None, **kwargs):
            return f"handle_{entity_id}"

        def run_every(self, callback, start, interval, **kwargs):
            return "handle_run_every"

        def datetime(self, aware=False):
            return _FakeDatetime.now()

        def log(self, msg, level="INFO", **kwargs):
            self.log_lines.append((level, msg))

    mod_hassapi = types.ModuleType("appdaemon.plugins.hass.hassapi")
    mod_hassapi.Hass = Hass

    mod_ad = types.ModuleType("appdaemon")
    mod_plugins = types.ModuleType("appdaemon.plugins")
    mod_hass = types.ModuleType("appdaemon.plugins.hass")
    mod_ad.plugins = mod_plugins
    mod_plugins.hass = mod_hass
    mod_hass.hassapi = mod_hassapi

    sys.modules["appdaemon"] = mod_ad
    sys.modules["appdaemon.plugins"] = mod_plugins
    sys.modules["appdaemon.plugins.hass"] = mod_hass
    sys.modules["appdaemon.plugins.hass.hassapi"] = mod_hassapi


def load_app_module(path: str = APP_PATH):
    """Import the real app module by path and redirect its `datetime`."""
    _install_hassapi_stub()

    spec = importlib.util.spec_from_file_location("_oracle_manage_car_charge", path)
    if spec is None or spec.loader is None:      # pragma: no cover
        raise RuntimeError(f"cannot load app module at {path}")
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)

    # The app does `from datetime import datetime, timedelta` — so the name
    # `datetime` in ITS namespace is what we replace.
    module.datetime = _FakeDatetime
    return module


_APP_MODULE = None


def _app_module():
    global _APP_MODULE
    if _APP_MODULE is None:
        _APP_MODULE = load_app_module()
    return _APP_MODULE


# --------------------------------------------------------------------------
# The oracle
# --------------------------------------------------------------------------
class Oracle:
    """One live instance of the real ManageCarCharge app."""

    def __init__(self, args: dict, start_ts: float = 0.0,
                 surplus=0.0, ratio=100.0, mode="Automatisch", min_charge=None):
        module = _app_module()
        _Clock.now_ts = start_ts

        self.app = module.ManageCarCharge()
        self.app.args = dict(args)

        # Seed the state machine before initialize() — it publishes on init.
        self.app._states[SURPLUS_ENTITY] = surplus
        self.app._states[RATIO_ENTITY] = ratio
        self.app._states[MODE_ENTITY] = mode
        self.app._states[MIN_ENTITY] = min_charge

        self.app.initialize()

    # -- inputs -------------------------------------------------------------
    def _set_inputs(self, surplus, ratio, mode, min_charge):
        self.app._states[SURPLUS_ENTITY] = surplus
        self.app._states[RATIO_ENTITY] = ratio
        self.app._states[MODE_ENTITY] = mode
        self.app._states[MIN_ENTITY] = min_charge

    # -- one tick -----------------------------------------------------------
    def tick(self, *, surplus, ratio, mode, now_ts: float, min_charge=None):
        """Run one real `_tick()` and return the published limit as a number.

        `_publish_monitor` writes `str(limit)`; we hand back the numeric value so
        the comparison is on the number, not on its formatting.
        """
        _Clock.now_ts = now_ts
        self._set_inputs(surplus, ratio, mode, min_charge)
        before = self.app.published
        self.app._tick(None)

        if self.app.published is None:            # pragma: no cover
            return None
        if self.app.published is before:
            # `_tick` returned without publishing (only possible with an empty
            # buffer, i.e. average_s == 0). Signal it rather than silently
            # reusing the previous value.
            return None

        state_str, _attrs = self.app.published
        return float(state_str)

    @property
    def action(self) -> str:
        """The `action` attribute of the last publish."""
        if self.app.published is None:            # pragma: no cover
            return "idle"
        return self.app.published[1].get("action", "idle")

    @property
    def current_limit(self) -> int:
        """The app's internal (lagging) limit — handy when diagnosing a diff."""
        return self.app.current_limit


def app_defaults() -> dict:
    """The args as apps.yaml sets them today, for a realistic baseline."""
    return {
        "verbose_logging": 0,
        "update_interval_seconds": 5,
        "surplus_sensor": SURPLUS_ENTITY,
        "ratio_input": RATIO_ENTITY,
        "mode_input": MODE_ENTITY,
        "ratio_unavailable_fallback": 50,
        "min_charge_input": MIN_ENTITY,
        "min_charge_w": 2000,
        "hysteresis_w": 50,
        "debounce_s": 15,
        "solar_debounce_s": 300,
        "average_s": 5,
        "limit_step_w": 50,
    }
