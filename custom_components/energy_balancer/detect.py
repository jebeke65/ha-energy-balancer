"""Sensor auto-detection — ported from SEM's intelligence.

Two layers, exactly like SEM:
  1. The HA Energy Dashboard (.storage/energy) is authoritative for
     solar / grid / battery sensors.
  2. Registry-walking + device_class/name heuristics fill the rest and find
     siblings on the same device (battery soc next to battery power, etc.).
"""

from __future__ import annotations

import json
import logging

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

_LOGGER = logging.getLogger(__name__)

_BAD = ("reactive", "apparent", "factor")  # never a real power reading


def _dc(hass, eid):
    st = hass.states.get(eid)
    return st.attributes.get("device_class") if st else None


def _unit(hass, eid):
    st = hass.states.get(eid)
    return (st.attributes.get("unit_of_measurement") or "").lower() if st else ""


def _usable(hass, eid):
    st = hass.states.get(eid)
    return st is not None and st.state not in (None, "unknown", "unavailable", "")


# --------------------------------------------------------------------------- #
# Energy Dashboard (.storage/energy) — authoritative source
# --------------------------------------------------------------------------- #
def _read_energy_file(path: str) -> dict:
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def derive_power_from_energy(hass, energy_eid: str, name_any=()) -> str | None:
    """SEM's _find_power_sensor_on_device: walk the energy sensor's device,
    pick the best power sensor sibling (prefer name keywords, then shortest id)."""
    cands = []
    for eid in siblings_on_device(hass, energy_eid):
        if not eid.startswith("sensor."):
            continue
        low = eid.lower()
        if any(b in low for b in _BAD):
            continue
        if _dc(hass, eid) != "power" and _unit(hass, eid) not in ("w", "kw"):
            continue
        if not _usable(hass, eid):
            continue
        cands.append(eid)
    if not cands:
        return None
    cands.sort(key=lambda e: (
        next((i for i, kw in enumerate(name_any) if kw in e.lower()), len(name_any)),
        len(e)))
    return cands[0]


async def read_energy_dashboard(hass: HomeAssistant) -> dict:
    """Return {solar_power, grid_power, battery_power, ev_power} from the dashboard.

    Uses the configured power-rate sensor when present, otherwise DERIVES the
    power sensor from the energy sensor's device (SEM's key trick — most setups
    only register energy sensors in the dashboard, not power-rate sensors)."""
    raw = await hass.async_add_executor_job(
        _read_energy_file, hass.config.path(".storage", "energy"))
    data = (raw or {}).get("data", {})
    out: dict = {}
    for src in data.get("energy_sources", []):
        t = src.get("type")
        if t == "solar":
            p = src.get("stat_rate") or src.get("stat_power")
            if not p and src.get("stat_energy_from"):
                p = derive_power_from_energy(hass, src["stat_energy_from"],
                                             ("solar", "pv", "production", "total", "ac"))
            if p:
                out.setdefault("solar_power", p)
        elif t == "grid":
            p = next((e["stat_rate"] for e in src.get("power", []) if e.get("stat_rate")),
                     None) or src.get("stat_rate")
            if not p and src.get("stat_energy_from"):
                p = derive_power_from_energy(hass, src["stat_energy_from"],
                                             ("active_power", "power", "grid", "total"))
            if p:
                out.setdefault("grid_power", p)
        elif t == "battery":
            p = src.get("stat_rate") or src.get("stat_power")
            if not p:
                seed = src.get("stat_energy_to") or src.get("stat_energy_from")
                if seed:
                    p = derive_power_from_energy(hass, seed, ("battery", "power", "total"))
            if p:
                out.setdefault("battery_power", p)
    for dev in data.get("device_consumption", []):
        name = (dev.get("stat_consumption") or "").lower()
        if any(p in name for p in ("ev", "charger", "keba", "wallbox", "easee", "zappi", "smappee")):
            seed = dev.get("stat_rate") or dev.get("stat_power") or dev.get("stat_consumption")
            ev = dev.get("stat_rate") or dev.get("stat_power")
            if not ev and dev.get("stat_consumption"):
                ev = derive_power_from_energy(hass, dev["stat_consumption"], ("power", "charg"))
            if ev:
                out.setdefault("ev_power", ev)
    return {k: v for k, v in out.items() if v}


# --------------------------------------------------------------------------- #
# Registry walking
# --------------------------------------------------------------------------- #
def siblings_on_device(hass: HomeAssistant, seed_entity: str) -> list[str]:
    """All entity_ids on the same device as seed_entity."""
    reg = er.async_get(hass)
    seed = reg.async_get(seed_entity)
    if not seed or not seed.device_id:
        return []
    return [e.entity_id for e in er.async_entries_for_device(reg, seed.device_id)
            if not e.disabled_by]


def _first(hass, candidates, *, device_class=None, name_any=(), unit_any=()):
    """First usable entity matching the device_class / name / unit filters."""
    for eid in candidates:
        low = eid.lower()
        if any(b in low for b in _BAD):
            continue
        if device_class and _dc(hass, eid) != device_class:
            continue
        if name_any and not any(n in low for n in name_any):
            continue
        if unit_any and _unit(hass, eid) not in unit_any:
            continue
        if _usable(hass, eid):
            return eid
    return None


def _all_sensors(hass) -> list[str]:
    return hass.states.async_entity_ids("sensor")


# --------------------------------------------------------------------------- #
# High-level detectors for Energy Balancer
# --------------------------------------------------------------------------- #
async def find_system_sensors(hass: HomeAssistant) -> dict:
    """solar / house / grid / forecast — Energy Dashboard first, then heuristics."""
    res = await read_energy_dashboard(hass)  # solar_power, grid_power, battery_power, ev_power

    sensors = _all_sensors(hass)
    if not res.get("solar_power"):
        res["solar_power"] = _first(hass, sensors, device_class="power",
                                    name_any=("solar", "pv", "production"))
    if not res.get("grid_power"):
        res["grid_power"] = _first(hass, sensors, device_class="power",
                                   name_any=("grid", "net", "p1", "meter"))
    # House/home consumption — not in the Energy Dashboard.
    house = _first(hass, sensors, device_class="power",
                   name_any=("house", "home", "consumption", "load"))
    if house:
        res["house_power"] = house
    # Solar forecast remaining today (kWh).
    fc = _first(hass, sensors, name_any=("forecast",), unit_any=("kwh",))
    if fc and ("solar" in fc.lower() or "pv" in fc.lower() or "remaining" in fc.lower()):
        res["forecast"] = fc
    return {k: v for k, v in res.items() if v}


def detect_battery(hass: HomeAssistant, hint: str | None = None) -> dict:
    """battery power (signed) + soc + energy counters, via sibling walk from a seed."""
    out: dict = {}
    seed = hint
    if not seed:
        seed = _first(hass, _all_sensors(hass), device_class="power", name_any=("battery", "batterij"))
    if not seed:
        return out
    out["power_sensor"] = seed
    fam = siblings_on_device(hass, seed) or [seed]
    out["soc_sensor"] = _first(hass, fam, device_class="battery", unit_any=("%",))
    out["energy_charged_sensor"] = _first(hass, fam, device_class="energy",
                                          name_any=("charge", "charged", "charging"))
    out["energy_discharged_sensor"] = _first(hass, fam, device_class="energy",
                                             name_any=("discharge", "discharged", "discharging"))
    return {k: v for k, v in out.items() if v}


def detect_charger(hass: HomeAssistant) -> dict:
    """EV charger power + connected + charging sensors."""
    out: dict = {}
    power = _first(hass, _all_sensors(hass), device_class="power",
                   name_any=("charger", "ev", "wallbox", "keba", "easee", "smappee"))
    if power:
        out["power_sensor"] = power
    binaries = hass.states.async_entity_ids("binary_sensor")
    out["connected_sensor"] = _first(hass, binaries, name_any=("connect", "plug"))
    out["charging_sensor"] = _first(hass, binaries, name_any=("charg",))
    return {k: v for k, v in out.items() if v}
