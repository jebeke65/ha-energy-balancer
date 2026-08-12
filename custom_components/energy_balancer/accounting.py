"""Incremental energy/cost accounting for Energy Balancer.

Basic-costs model (user requirement): a price per kWh that may be a fixed
value OR a live entity (prices change e.g. monthly). Therefore NOTHING is
recomputed from totals afterwards — every tick prices the kWh delta of
that tick at the rate valid at that moment:

    costs           += Δimport_kwh × import_price(now)
    export_revenue  += Δexport_kwh × export_price(now)
    savings         += Δself_consumed_solar_kwh × import_price(now)
                       + Δexport_kwh × export_price(now)
    battery_savings += Δbattery_discharge_kwh × import_price(now)
    net_cost         = costs − export_revenue

Accumulators exist per period (daily / monthly / yearly) + a lifetime
savings counter, and roll over on the day/month/year boundary. State is
persisted via a HA Store so restarts do not lose the running totals.
"""

from __future__ import annotations

from datetime import datetime

STORAGE_KEY = "energy_balancer.accounting"
STORAGE_VERSION = 1

# Never integrate over a longer gap than this (restart/downtime guard).
MAX_TICK_GAP_S = 120.0

PERIODS = ("daily", "monthly", "yearly")
FIELDS = ("grid_import_energy", "grid_export_energy",
          "costs", "savings", "export_revenue", "battery_savings")


def _period_keys(now: datetime) -> dict:
    return {
        "daily": now.strftime("%Y-%m-%d"),
        "monthly": now.strftime("%Y-%m"),
        "yearly": now.strftime("%Y"),
    }


def _empty_bucket() -> dict:
    return {f: 0.0 for f in FIELDS}


class EnergyAccounting:
    """Pure accumulator — the coordinator feeds it one tick at a time.

    No I/O here: the coordinator loads/saves the state dict via a Store.
    """

    def __init__(self, state: dict | None = None) -> None:
        state = state or {}
        self.buckets = {p: {**_empty_bucket(), **state.get(p, {})} for p in PERIODS}
        self.keys = state.get("keys", {})
        self.lifetime_total_savings = float(state.get("lifetime_total_savings", 0.0))
        self._last_ts: float | None = state.get("last_ts")
        self.dirty = False

    # ------------------------------------------------------------------ tick
    def tick(self, now: datetime, ts: float, grid_w: float, solar_w: float,
             battery_discharge_w: float, import_price: float,
             export_price: float) -> None:
        """Integrate one tick. ts = monotonic-ish epoch seconds."""
        self._rollover(now)

        if self._last_ts is None:
            self._last_ts = ts
            return
        dt = ts - self._last_ts
        self._last_ts = ts
        if dt <= 0 or dt > MAX_TICK_GAP_S:
            return  # clock jump / restart gap — skip, never back-fill

        h = dt / 3600.0
        import_kwh = max(0.0, grid_w) / 1000.0 * h
        export_kwh = max(0.0, -grid_w) / 1000.0 * h
        # Solar consumed on-site (production minus what is exported).
        self_solar_kwh = max(0.0, (solar_w / 1000.0 * h) - export_kwh)
        batt_kwh = max(0.0, battery_discharge_w) / 1000.0 * h

        d_costs = import_kwh * import_price
        d_revenue = export_kwh * export_price
        d_savings = self_solar_kwh * import_price + d_revenue
        d_batt = batt_kwh * import_price

        for p in PERIODS:
            b = self.buckets[p]
            b["grid_import_energy"] += import_kwh
            b["grid_export_energy"] += export_kwh
            b["costs"] += d_costs
            b["savings"] += d_savings
            b["export_revenue"] += d_revenue
            b["battery_savings"] += d_batt
        self.lifetime_total_savings += d_savings
        self.dirty = True

    def _rollover(self, now: datetime) -> None:
        keys = _period_keys(now)
        for p in PERIODS:
            if self.keys.get(p) != keys[p]:
                self.buckets[p] = _empty_bucket()
                self.keys[p] = keys[p]
                self.dirty = True

    def note_quarter_peak(self, avg_w: float) -> None:
        """Record a completed 15-min average grid import (capacity tariff)."""
        for p in ("monthly", "yearly"):
            b = self.buckets[p]
            if avg_w > b.get("peak_15min_max", 0.0):
                b["peak_15min_max"] = avg_w
                self.dirty = True

    # ------------------------------------------------------------- serialize
    def as_state(self) -> dict:
        return {
            **{p: dict(self.buckets[p]) for p in PERIODS},
            "keys": dict(self.keys),
            "lifetime_total_savings": self.lifetime_total_savings,
            "last_ts": self._last_ts,
        }

    def snapshot(self) -> dict:
        """Flat dict for the sensor platform (suffix -> value)."""
        out = {}
        for p in PERIODS:
            b = self.buckets[p]
            for f in FIELDS:
                out[f"{p}_{f}"] = round(b[f], 4)
            out[f"{p}_net_cost"] = round(b["costs"] - b["export_revenue"], 4)
        out["lifetime_total_savings"] = round(self.lifetime_total_savings, 4)
        out["monthly_consecutive_peak"] = round(
            self.buckets["monthly"].get("peak_15min_max", 0.0))
        return out
