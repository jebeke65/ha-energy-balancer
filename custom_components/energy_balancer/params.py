"""Input-parameter validation layer for Energy Balancer.

Every parameter coming from the config entry (UI wizard or the one-time
YAML import) passes through here exactly once, when the coordinator is
built. The goal: a misconfigured parameter never crashes or silently skews
the algorithm — it falls back to its spec default and logs one WARNING
naming the parameter, the bad value and the default used.

Rules
-----
* A parameter marked ``entity_ok`` may be a fixed value OR an entity-id
  string (e.g. ``input_number.min_battery_no_sun``); entity references are
  validated on format only here — they resolve live each tick via
  ``coordinator._resolve()`` and are range-clamped with ``clamp_algo()``.
* A parameter marked ``entity_only`` must be an entity-id (sensors).
* Required system sensors (solar/house/grid) have no sensible default;
  a missing one raises ``ConfigEntryError`` with a clear message.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any

from homeassistant.exceptions import ConfigEntryError

from .const import ENTITY_PREFIXES

_LOGGER = logging.getLogger(__name__)


# --------------------------------------------------------------------- spec
@dataclass(frozen=True)
class Spec:
    """Validation rule for one parameter."""

    default: Any = None
    minv: float | None = None
    maxv: float | None = None
    typ: str = "float"          # float | int | bool | str | list
    entity_ok: bool = False     # fixed value OR live entity-id allowed
    entity_only: bool = False   # must be an entity-id (or empty -> default)
    choices: tuple = field(default_factory=tuple)


SYSTEM_SPEC: dict[str, Spec] = {
    "solar_sensor": Spec(typ="str", entity_only=True),
    "house_sensor": Spec(typ="str", entity_only=True),
    "grid_sensor": Spec(typ="str", entity_only=True),
    "forecast_sensor": Spec(typ="str", entity_only=True),
    "charge_pct_sensor": Spec(typ="str", entity_only=True),
    # Forecast display inputs (optional)
    "forecast_today_sensor": Spec(typ="str", entity_only=True),
    "forecast_tomorrow_sensor": Spec(typ="str", entity_only=True),
    "forecast_peak_power_sensor": Spec(typ="str", entity_only=True),
    "forecast_peak_time_sensor": Spec(typ="str", entity_only=True),
    "house_includes": Spec(default=[], typ="list"),
    "peak_limit_w": Spec(default=3500.0, minv=0, maxv=30000),
    "peak_limit_sensors": Spec(default=[], typ="list"),
    # The user's own ceiling. Only ever raises: its lower bound moves with
    # max(monthly peak, peak_limit_w), because setting it under what already
    # happened would mean nothing. 0 = not set.
    "peak_max_w": Spec(default=0.0, minv=0, maxv=30000),
    # The running 15-minute average grid import (the capacity-tariff metric).
    # Feeds the upper brake: without it EB does not cap charging on the block at
    # all and leans entirely on the external brain's own peak limit.
    "block_demand_sensor": Spec(typ="str", entity_only=True),
    # Which entry in peak_limit_sensors carries the monthly peak. The meter holds
    # last month's peak for the first quarter of a new month (measured 2026-08-31:
    # 15,2 minutes), so without this EB is licensed to re-establish the old peak in
    # the very first block of the month. Leave empty to switch the whole thing off.
    "month_peak_sensor": Spec(typ="str", entity_only=True),
    # What that stale reading counts as inside the window:
    #   previous   — take it as-is (behaviour before 2026-08-31)
    #   configured — cap it at peak_limit_w
    #   zero       — ignore it; the other peak_limit_sensors decide
    "month_start_peak_policy": Spec(default="previous", typ="str",
                                    choices=("previous", "configured", "zero")),
    "month_start_window_min": Spec(default=30, minv=0, maxv=240, typ="int"),
    # The same cap, applied BEFORE midnight: how many minutes ahead of the month
    # boundary the ceiling is already pulled down to peak_limit_w. The tier does
    # not stop on a dime, so a brake that only arms at 00:00 arms too late — the
    # power already flowing closes the first block of the new month. 0 = off.
    # Range runs to a full day so the window can be opened wide to test it
    # without waiting for a month to turn.
    "month_end_window_min": Spec(default=0, minv=0, maxv=1440, typ="int"),
    "update_interval_seconds": Spec(default=10, minv=5, maxv=300, typ="int"),
    "observer_mode": Spec(default=True, typ="bool"),
    # Tariff (basic costs): €/kWh, fixed value OR a live entity (e.g. a
    # monthly-varying price sensor). Used incrementally: each tick the
    # kWh delta is priced at the rate valid at that moment.
    "import_price_per_kwh": Spec(default=0.0, minv=0, maxv=5, entity_ok=True),
    "export_price_per_kwh": Spec(default=0.0, minv=0, maxv=5, entity_ok=True),
}

# System sensors without which the chain cannot run at all.
SYSTEM_REQUIRED = ("solar_sensor", "house_sensor", "grid_sensor")

CELL_TOP_SPEC: dict[str, Spec] = {
    "position": Spec(default=2, minv=0, maxv=99, typ="int"),
    # Both spellings validate while stored configs still carry the old ones;
    # normalize_mode() translates them on the way into the chain. The legacy
    # pair drops out once the config entry is migrated (NAMING.md, stap 2).
    "mode": Spec(default="off", typ="str",
                 choices=("off", "surplus", "balanced",
                          "charge", "discharge", "autonomous",
                          "self_consumption", "smart")),
    "type": Spec(default="", typ="str",
                 choices=("", "house_battery", "car_charger", "grid")),
}

CELL_HW_SPEC: dict[str, Spec] = {
    "can_charge": Spec(default=True, typ="bool"),
    "can_discharge": Spec(default=True, typ="bool"),
    "max_charge_w": Spec(default=5000.0, minv=0, maxv=25000),
    "max_discharge_w": Spec(default=5000.0, minv=0, maxv=25000),
    "capacity_kwh": Spec(default=10.0, minv=0, maxv=200),
    "min_soc": Spec(default=10.0, minv=0, maxv=100),
    "max_soc": Spec(default=95.0, minv=0, maxv=100),
    "power_sensor": Spec(typ="str", entity_only=True),
    "power_sign": Spec(default=1, typ="int", choices=(1, -1)),
    "soc_sensor": Spec(typ="str", entity_only=True),
    "energy_charged_sensor": Spec(typ="str", entity_only=True),
    "energy_discharged_sensor": Spec(typ="str", entity_only=True),
    "self_consumption_w": Spec(default=0.0, minv=0, maxv=5000, entity_ok=True),
}

CELL_ALGO_SPEC: dict[str, Spec] = {
    "take_pct": Spec(default=100.0, minv=0, maxv=100, entity_ok=True),
    "hysteresis": Spec(default=3.0, minv=0, maxv=50, entity_ok=True),
    "charge_floor_w": Spec(default=0.0, minv=0, maxv=10000, entity_ok=True),
    "sunny_min_soc": Spec(default=25.0, minv=0, maxv=100, entity_ok=True),
    "no_sun_min_soc": Spec(default=40.0, minv=0, maxv=100, entity_ok=True),
    "pv_weight": Spec(default=0.0, minv=0, maxv=100, entity_ok=True),
    "target_soc": Spec(default=None, minv=0, maxv=100, entity_ok=True),
    # Floor mode: "balanced" runs the algorithm (sunny/no_sun + forecast +
    # consumption, floor-clamped); "manual" takes `manual_min_soc` verbatim so
    # the user can deliberately go below what the safeguards would allow.
    "min_soc_mode": Spec(default="balanced", typ="str",
                         choices=("balanced", "manual")),
    "manual_min_soc": Spec(default=15.0, minv=0, maxv=100, entity_ok=True),
    "connected_sensor": Spec(typ="str", entity_only=True),
    "charging_sensor": Spec(typ="str", entity_only=True),
    "charge_mode_entity": Spec(typ="str", entity_only=True),
    "set_flag_on_charge": Spec(default="", typ="str"),
    "no_discharge_on_flag": Spec(default="", typ="str"),
    # --- Car brain (ported from the AppDaemon app ManageCarCharge) ---------
    # OFF by default: with use_car_brain false the cell follows exactly the
    # path it followed before this parameter existed. The four tunables below
    # only mean anything once the flag is on; they carry the app's own
    # apps.yaml values as defaults so switching the flag reproduces today's
    # AppDaemon behaviour rather than some new mix.
    "use_car_brain": Spec(default=False, typ="bool"),
    # The car brain's mode. Normally driven by `charge_mode_entity`
    # (input_select.car_charge_mode); this value is the fallback for a cell that
    # has no such helper, and it supplies the option list for that case. The
    # tokens are the app's own vocabulary — car_brain compares against them
    # literally, so they are not translated.
    "car_mode": Spec(default="Automatisch", typ="str",
                     choices=("Off", "Automatisch", "Solar", "Surplus")),
    # "Surplus" mode: the tier gets the sun first. The car waits until the
    # tier (capacity-weighted SoC of the house batteries) reaches this
    # percentage, and from there on behaves exactly like "Solar". It waits
    # again below this value minus SURPLUS_GATE_HYST (core.py).
    "surplus_tier_soc": Spec(default=80.0, minv=0, maxv=100, entity_ok=True),
    "start_margin_w": Spec(default=50.0, minv=0, maxv=2000, entity_ok=True),
    "debounce_s": Spec(default=15, minv=0, maxv=3600, typ="int", entity_ok=True),
    "solar_debounce_s": Spec(default=300, minv=0, maxv=3600, typ="int", entity_ok=True),
    "average_n": Spec(default=5, minv=1, maxv=60, typ="int", entity_ok=True),
    "limit_step_w": Spec(default=50.0, minv=0, maxv=2000, entity_ok=True),
}

CELL_ACTUATOR_SPEC: dict[str, Spec] = {
    "service": Spec(default="", typ="str"),
    "unit": Spec(default="W", typ="str", choices=("W", "A", "pct", "%")),
    "voltage": Spec(default=230.0, minv=100, maxv=400),
    "phases": Spec(default=1, typ="int", choices=(1, 3)),
}


# ---------------------------------------------------------------- validation
def is_entity_ref(value: Any) -> bool:
    """True when value looks like a live entity reference."""
    return (isinstance(value, str) and "." in value
            and any(value.startswith(p) for p in ENTITY_PREFIXES))


def _warn(ctx: str, key: str, raw: Any, default: Any) -> None:
    _LOGGER.warning(
        "EB config: %s.%s has invalid value %r — using default %r",
        ctx, key, raw, default)


def _clean(ctx: str, key: str, raw: Any, spec: Spec) -> Any:
    """One validated value: entity-id kept as-is, numbers clamped,
    anything invalid replaced by the spec default (+ 1 warning)."""
    if raw in (None, ""):
        return spec.default

    # Entity reference fields
    if spec.entity_only:
        if is_entity_ref(raw):
            return raw
        _warn(ctx, key, raw, spec.default)
        return spec.default
    if spec.entity_ok and is_entity_ref(raw):
        return raw  # resolved live each tick, clamped via clamp_algo()

    if spec.typ == "bool":
        if isinstance(raw, bool):
            return raw
        if isinstance(raw, str):
            return raw.strip().lower() in ("1", "true", "yes", "on")
        return bool(raw)

    if spec.typ == "list":
        if isinstance(raw, (list, tuple)):
            return list(raw)
        _warn(ctx, key, raw, spec.default)
        return spec.default

    if spec.typ == "str" and not spec.choices:
        return str(raw)

    if spec.choices:
        # int choices (power_sign, phases) may arrive as strings
        cand: Any = raw
        if spec.typ == "int":
            try:
                cand = int(float(raw))
            except (TypeError, ValueError):
                cand = raw
        if cand in spec.choices:
            return cand
        _warn(ctx, key, raw, spec.default)
        return spec.default

    # Numeric with range clamp
    try:
        num = float(raw)
    except (TypeError, ValueError):
        _warn(ctx, key, raw, spec.default)
        return spec.default
    if spec.minv is not None and num < spec.minv:
        _warn(ctx, key, raw, spec.minv)
        num = spec.minv
    if spec.maxv is not None and num > spec.maxv:
        _warn(ctx, key, raw, spec.maxv)
        num = spec.maxv
    return int(num) if spec.typ == "int" else num


def _clean_block(ctx: str, block: dict, spec_table: dict[str, Spec]) -> dict:
    block = block or {}
    out = {}
    for key, spec in spec_table.items():
        val = _clean(ctx, key, block.get(key), spec)
        if val is not None:
            out[key] = val
    # keep unknown keys untouched (forward compatibility)
    for key, val in block.items():
        if key not in spec_table:
            out[key] = val
    return out


def validate_cell(cell_id: str, cfg: dict) -> dict:
    """Validated copy of one cell config (top + hardware/algo/actuator)."""
    cfg = cfg or {}
    ctx = f"cell:{cell_id}"
    out = {key: _clean(ctx, key, cfg.get(key), spec)
           for key, spec in CELL_TOP_SPEC.items()}
    out["hardware"] = _clean_block(f"{ctx}.hardware", cfg.get("hardware"), CELL_HW_SPEC)
    out["algo"] = _clean_block(f"{ctx}.algo", cfg.get("algo"), CELL_ALGO_SPEC)
    out["actuator"] = _clean_block(f"{ctx}.actuator", cfg.get("actuator"), CELL_ACTUATOR_SPEC)

    # Cross-check: an inverted SoC band breaks the charge/discharge tapers.
    hw = out["hardware"]
    if hw.get("min_soc", 10) >= hw.get("max_soc", 95):
        _LOGGER.warning(
            "EB config: %s min_soc (%s) >= max_soc (%s) — resetting to 10/95",
            ctx, hw.get("min_soc"), hw.get("max_soc"))
        hw["min_soc"], hw["max_soc"] = 10.0, 95.0
    return out


def validate_config(conf: dict) -> dict:
    """Validated copy of the full entry config (system + cells).

    Raises ConfigEntryError when a required system sensor is missing —
    there is no sensible default for those.
    """
    conf = conf or {}
    missing = [k for k in SYSTEM_REQUIRED if not is_entity_ref(conf.get(k))]
    if missing:
        raise ConfigEntryError(
            f"Energy Balancer: required system sensor(s) missing/invalid: "
            f"{', '.join(missing)} — fix via the integration options.")

    out = {key: _clean("system", key, conf.get(key), spec)
           for key, spec in SYSTEM_SPEC.items()}
    for key, val in conf.items():
        if key not in SYSTEM_SPEC and key != "cells":
            out[key] = val

    out["cells"] = {cid: validate_cell(cid, ccfg)
                    for cid, ccfg in (conf.get("cells") or {}).items()}
    return out


class OptionValueError(ValueError):
    """A set_option value that does not fit its spec."""


def coerce_option(key: str, value, cell_scope: bool):
    """Convert a set_option value to the type its Spec declares.

    The service used to force every non-entity value through float(), which is
    fine for a slider and useless for a flag or a mode string. It now follows the
    spec instead:

        typ "bool"           → a real bool ("true"/"on"/"1"/"yes" accepted)
        typ "int"            → an int
        typ "str" + choices  → validated against the choices, kept as a string
        anything else        → EXACTLY the old rule (see below)

    The last branch is deliberately the old code, not a tidier equivalent: for
    every key that already worked, a string is parsed as a float and any other
    type is passed through untouched. An int stays an int, a float stays a
    float. That keeps the existing keys byte-identical — tests/test_set_option.py
    pins it.

    Entity references are returned as-is at the call site, before this runs.

    One key does change: `min_soc_mode` is typ "str" with choices, so today it is
    rejected (float("balanced") raises) even though it sits in LIVE_ALGO_KEYS.
    From here it works. That is a consequence of the rule above, not a separate
    decision — reported rather than hidden.
    """
    spec = (CELL_ALGO_SPEC if cell_scope else SYSTEM_SPEC).get(key)

    if spec is not None and spec.typ == "bool":
        if isinstance(value, bool):
            return value
        if isinstance(value, str):
            s = value.strip().lower()
            if s in ("1", "true", "yes", "on"):
                return True
            if s in ("0", "false", "no", "off"):
                return False
            raise OptionValueError(
                f"value {value!r} is not a boolean (true/false)")
        return bool(value)

    if spec is not None and spec.typ == "int":
        try:
            return int(float(value))
        except (TypeError, ValueError):
            raise OptionValueError(f"value {value!r} is not a whole number")

    if spec is not None and spec.choices and spec.typ == "str":
        s = str(value)
        if s not in spec.choices:
            raise OptionValueError(
                f"value {value!r} is not one of {', '.join(spec.choices)}")
        return s

    # --- unchanged from before: numbers and everything without a spec -------
    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            raise OptionValueError(
                f"value {value!r} is neither a number nor an entity id")
    return value


def clamp_algo(key: str, value: float) -> float:
    """Range-clamp an entity-resolved algo value at tick time."""
    spec = CELL_ALGO_SPEC.get(key)
    if spec is None or value is None:
        return value
    if spec.minv is not None and value < spec.minv:
        return spec.minv
    if spec.maxv is not None and value > spec.maxv:
        return spec.maxv
    return value
