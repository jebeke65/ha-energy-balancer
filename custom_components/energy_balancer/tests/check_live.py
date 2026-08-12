#!/usr/bin/env python3
"""Energy Balancer live config-consistency check.

Runs against the running Home Assistant (REST API). Catches the class of
regression the unit tests can't see — the HA glue between EB and the hardware:

  1. Every `eb_actuator_*` automation's cell_sensor must carry a FRESH
     `timestamp` attribute (the heartbeat). A missing/stale timestamp means the
     actuator never re-fires — exactly the car-actuator outage of 2026-06-07.
  2. Every EB cell's power/soc/energy sensors must exist and be available.
  3. Car mode coherence: connected + desired != Off ⇒ actual must not be Off.

Usage:  python3 tests/check_live.py        (reads /config/.env for HA_TOKEN/HA_URL)
Exit code 0 = all PASS, 1 = at least one FAIL.
"""

import os
import re
import sys
import json
import urllib.request
from datetime import datetime

ROOT = "/config"
APPS_YAML = os.path.join(ROOT, "appdaemon/apps.yaml")
AUTOMATIONS = os.path.join(ROOT, "automations.yaml")
HEARTBEAT_MAX_AGE_S = 90

PASS, FAIL = "PASS", "FAIL"
results = []


def record(ok, msg):
    results.append((ok, msg))
    print(f"  [{PASS if ok else FAIL}] {msg}")


def load_env():
    env = {}
    try:
        with open(os.path.join(ROOT, ".env")) as f:
            for line in f:
                line = line.strip()
                if "=" in line and not line.startswith("#"):
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip().strip('"').strip("'")
    except FileNotFoundError:
        pass
    return env


ENV = load_env()
URL = ENV.get("HA_URL", "http://localhost:8123").rstrip("/")
TOKEN = ENV.get("HA_TOKEN", "")


def api(path):
    req = urllib.request.Request(
        f"{URL}/api/{path}",
        headers={"Authorization": f"Bearer {TOKEN}"},
    )
    with urllib.request.urlopen(req, timeout=10) as r:
        return json.loads(r.read().decode())


def state(entity):
    try:
        return api(f"states/{entity}")
    except Exception:
        return None


def age_seconds(iso):
    try:
        ts = datetime.fromisoformat(iso.split("+")[0])
        return (datetime.now() - ts).total_seconds()
    except Exception:
        return None


# --- Parse apps.yaml (plain YAML, try yaml then fall back) ---
def eb_cells():
    """Return {cell_id: {power_sensor, soc_sensor, energy_*}} for the EB app."""
    try:
        import yaml
        with open(APPS_YAML) as f:
            data = yaml.safe_load(f)
        for app in data.values():
            if isinstance(app, dict) and app.get("module") == "energy_balancer.energy_balancer":
                cells = {}
                for cid, c in (app.get("cells") or {}).items():
                    hw = c.get("hardware", {})
                    cells[cid] = {k: hw.get(k) for k in
                                  ("power_sensor", "soc_sensor",
                                   "energy_charged_sensor", "energy_discharged_sensor")}
                return cells
    except Exception as e:
        print(f"  (apps.yaml parse skipped: {e})")
    return {}


# --- Parse automations.yaml for eb_actuator_* → cell_sensor ---
def actuator_cell_sensors():
    out = {}
    try:
        with open(AUTOMATIONS) as f:
            text = f.read()
    except FileNotFoundError:
        return out
    # Split on top-level "- id:" blocks.
    blocks = re.split(r"\n- id:", text)
    for b in blocks:
        m_id = re.match(r"\s*(eb_actuator_\w+)", b)
        if not m_id:
            continue
        m_cs = re.search(r"cell_sensor:\s*([\w.]+)", b)
        if m_cs:
            out[m_id.group(1)] = m_cs.group(1)
    return out


def check_heartbeats():
    print("\n[1] Actuator heartbeats (cell_sensor.timestamp fresh):")
    acts = actuator_cell_sensors()
    if not acts:
        record(False, "no eb_actuator_* found in automations.yaml")
        return
    for act, sensor in sorted(acts.items()):
        st = state(sensor)
        if st is None:
            record(False, f"{act}: cell_sensor {sensor} not found")
            continue
        ts = st.get("attributes", {}).get("timestamp")
        if not ts:
            record(False, f"{act}: {sensor} has NO timestamp attribute (actuator can't fire)")
            continue
        age = age_seconds(ts)
        if age is None:
            record(False, f"{act}: {sensor} timestamp unparseable ({ts})")
        elif age > HEARTBEAT_MAX_AGE_S:
            record(False, f"{act}: {sensor} timestamp stale ({age:.0f}s old)")
        else:
            record(True, f"{act}: {sensor} heartbeat {age:.0f}s old")


def check_cell_sensors():
    print("\n[2] EB cell sensors exist & available:")
    cells = eb_cells()
    if not cells:
        record(False, "no EB cells parsed from apps.yaml")
        return
    for cid, sensors in cells.items():
        for kind, ent in sensors.items():
            if not ent:
                continue
            st = state(ent)
            if st is None:
                record(False, f"{cid}.{kind}: {ent} NOT FOUND")
            elif st.get("state") in ("unavailable", "unknown"):
                record(False, f"{cid}.{kind}: {ent} = {st['state']}")
            else:
                record(True, f"{cid}.{kind}: {ent} ok")


def check_car_mode():
    print("\n[3] Car mode coherence:")
    connected = (state("binary_sensor.car_connected") or {}).get("state")
    desired = (state("input_select.car_charge_mode") or {}).get("state")
    actual = (state("input_select.car_charge_mode_actual") or {}).get("state")
    if connected != "on":
        record(True, f"car not connected ({connected}) — skip")
        return
    if desired and desired.lower() != "off" and actual == "Off":
        record(False, f"connected, desired={desired}, but actual=Off (should be Paused/Charging)")
    else:
        record(True, f"connected, desired={desired}, actual={actual}")


def main():
    if not TOKEN:
        print("No HA_TOKEN in /config/.env — cannot reach HA.")
        return 2
    print(f"EB live config check → {URL}")
    check_heartbeats()
    check_cell_sensors()
    check_car_mode()
    fails = [m for ok, m in results if not ok]
    print(f"\n=== {len(results) - len(fails)}/{len(results)} checks passed,"
          f" {len(fails)} failed ===")
    for m in fails:
        print(f"FAIL {m}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
