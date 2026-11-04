"""Entity ids: <domain>.eb_<cell>_<what> — the block that computes it comes first.

One rule, in one place:

* <cell> is the cell id without underscores (car_charger -> carcharger), so the
  first word after eb_ is always the block.
* A house battery belongs to the home battery tier: eb_homebattery_<cell>_<what>.
  That follows the cell's TYPE, not its position, so changing a priority never
  renames anything.
* <what> may be split further into a domain: energy_, peak_, surplus_ …

Entities that are not a cell's (EB System, EB Costs) keep their own names.
"""

from __future__ import annotations

TIER_ID = "home_battery"
TIER_TYPE = "house_battery"


def slug(cell_id: str) -> str:
    return cell_id.replace("_", "")


def cell_prefix(coordinator, cell_id: str) -> str:
    """The <cell> part for a chain cell (tier members nest under the tier)."""
    for cfg in getattr(coordinator, "cell_configs", []):
        if cfg.id == cell_id and cfg.type == TIER_TYPE:
            return f"{slug(TIER_ID)}_{slug(cell_id)}"
    return slug(cell_id)


def entity_id(domain: str, prefix: str, what: str | None = None) -> str:
    return f"{domain}.eb_{prefix}_{what}" if what else f"{domain}.eb_{prefix}"


# Extras that belong to a cell: key -> (cell, what). The rest stay as they are.
_PERIODS = ("daily", "monthly", "yearly", "lifetime")
EXTRA_IDS = {
    "target_peak_limit": ("net", "peak_limit"),
    "net_allowed_import": ("net", "allowed_import"),
    "current_vs_peak_percentage": ("net", "peak_usage_pct"),
    "consecutive_peak_15min": ("net", "peak_quarter"),
    "monthly_consecutive_peak": ("net", "peak_month"),
    "load_management_status": ("net", "peak_status"),
    "available_load_reduction": ("net", "peak_load_reduction"),
    "controllable_devices_count": ("net", "surplus_devices_controllable"),
    "surplus_total_w": ("net", "surplus_total_w"),
    "surplus_allocated_w": ("net", "surplus_allocated_w"),
    "surplus_unallocated_w": ("net", "surplus_unallocated_w"),
    "surplus_active_devices": ("net", "surplus_active_devices"),
    "surplus_total_devices": ("net", "surplus_total_devices"),
    "grid_status": ("net", "status"),
    **{f"{p}_grid_import_energy": ("net", f"energy_import_{p}") for p in _PERIODS},
    **{f"{p}_grid_export_energy": ("net", f"energy_export_{p}") for p in _PERIODS},
    **{f"{p}_solar_energy": ("solar", f"energy_{p}") for p in _PERIODS},
    **{f"{p}_house_energy": ("house", f"energy_{p}") for p in _PERIODS},
}
