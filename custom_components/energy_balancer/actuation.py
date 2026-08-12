"""Actuation translation layer (separate from the ported algorithm).

The ported algorithm (core.py) is NOT touched. This module sits BETWEEN the
coordinator's computed output and the hardware: it translates EB's internal
per-cell action tokens into the public, agnostic actuator contract and calls
the per-cell adapter script. Easy to disable/roll back without touching core.

Contract (uniform across all cell types):
  service(cell, action, setpoint, unit, power_w, power_abs, soc, target_soc)
  action ∈ {charge, discharge, pauze, unmanaged}
    charge     — device draws `setpoint`
    discharge  — device delivers `setpoint`
    pauze      — freeze: no charge/discharge
    unmanaged  — EBI not steering → device autonomous (script decides)
  offline cell → excluded (no call), rejoins automatically when back online.

Internal→public mapping (algorithm tokens stay unchanged on the shadow sensors):
  consume→charge, produce→discharge, idle→pauze,
  autonomous→unmanaged, off→unmanaged, offline→skip.

observer_mode → dry-run: logs the intended call, sends nothing.
"""

from __future__ import annotations

import logging

from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

INTERNAL_TO_PUBLIC = {
    "consume": "charge",
    "produce": "discharge",
    "idle": "pauze",
    "autonomous": "unmanaged",
    "off": "unmanaged",
    # "offline" -> skipped (cell excluded from dispatch)
}


def _setpoint(public: str, power_abs: float, unit: str,
              voltage: float, phases: int,
              max_charge: float, max_discharge: float):
    """Magnitude in the cell's configured unit. 0 for pauze/unmanaged."""
    if public not in ("charge", "discharge"):
        return 0
    if unit == "A":
        denom = max(1.0, voltage * max(1, phases))
        return round(power_abs / denom, 1)
    if unit in ("%", "pct"):
        cap = max_charge if public == "charge" else max_discharge
        return round(power_abs / cap * 100) if cap > 0 else 0
    return round(power_abs)  # W (default)


async def run_actuation(hass: HomeAssistant, coordinator, data: dict) -> dict:
    """Called once per coordinator tick, after compute. Drives the adapters.

    Returns a per-cell dict of the intended command (visible as sensor
    attributes), so dry-run and live actuation are both observable.
    """
    cfg = coordinator._cfg
    observer = bool(cfg.get("observer_mode", True))
    cells_cfg = cfg.get("cells", {}) or {}
    outputs = (data or {}).get("outputs", {})
    details = (data or {}).get("details", {})
    result: dict = {}

    for cell in coordinator.cell_configs:
        out = outputs.get(cell.id)
        if out is None:
            continue
        if out.action == "offline":
            result[cell.id] = {"action": "offline", "sent": False,
                               "reason": "excluded from dispatch"}
            continue  # excluded until back online
        public = INTERNAL_TO_PUBLIC.get(out.action)
        if public is None:
            continue

        actuator = (cells_cfg.get(cell.id, {}) or {}).get("actuator", {}) or {}
        # Convention: default to script.eb_actuator_<cell>; override in the UI.
        service = actuator.get("service") or f"script.eb_actuator_{cell.id}"
        if "." not in service:
            continue

        unit = actuator.get("unit", "W")
        power_abs = abs(out.power_w)
        setpoint = _setpoint(
            public, power_abs, unit,
            float(actuator.get("voltage", 230)), int(actuator.get("phases", 1)),
            cell.max_charge_w, cell.max_discharge_w)

        d = details.get(cell.id, {})
        # Always-available % of the relevant cap, so a script can use W, A or %
        # straight from the payload without the user configuring a unit.
        cap = cell.max_charge_w if public == "charge" else cell.max_discharge_w
        pct = round(power_abs / cap * 100) if (cap > 0 and public in ("charge", "discharge")) else 0
        payload = {
            "cell": cell.id,
            "action": public,
            "setpoint": setpoint,
            "unit": unit,
            "power_w": round(out.power_w, 1),
            "power_abs": round(power_abs, 1),
            "pct": pct,
            "max_charge_w": cell.max_charge_w,
            "max_discharge_w": cell.max_discharge_w,
            "soc": d.get("soc"),
            "target_soc": d.get("target_soc"),
        }
        result[cell.id] = {"action": public, "setpoint": setpoint, "unit": unit,
                           "service": service, "observer": observer, "sent": not observer}

        if observer:
            _LOGGER.debug("EBI dry-run | %s -> %s %s%s (observer: no actuation)",
                          cell.id, public, setpoint, unit)
            continue

        domain, name = service.split(".", 1)
        try:
            await hass.services.async_call(domain, name, payload, blocking=False)
        except Exception as err:  # noqa: BLE001
            result[cell.id]["sent"] = False
            result[cell.id]["error"] = str(err)
            _LOGGER.warning("EBI actuation for %s via %s failed: %s",
                            cell.id, service, err)

    return result
