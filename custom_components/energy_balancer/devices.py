"""Device grouping: one device per steerable cell + one system device.

Gives the integration page a per-cell overview: Energy Balancer -> devices
"EB <cell>" (cell sensor + take slider) and "EB System" (status, layer and
compat/output sensors). Entities keep their unique_id — only the grouping
is added, nothing is renamed.
"""

from __future__ import annotations

from homeassistant.helpers.device_registry import DeviceInfo

from .const import DOMAIN

MANUFACTURER = "Energy Balancer"


def system_device() -> DeviceInfo:
    """The umbrella device holding status/layer/output entities."""
    return DeviceInfo(
        identifiers={(DOMAIN, "system")},
        name="EB System",
        manufacturer=MANUFACTURER,
        model="Chain outputs",
    )


def cell_device(cell_id: str) -> DeviceInfo:
    """One device per chain cell (steerable AND virtual: solar/house/net),
    nested under the system device."""
    return DeviceInfo(
        identifiers={(DOMAIN, f"cell_{cell_id}")},
        name=f"EB {cell_id}",
        manufacturer=MANUFACTURER,
        model="Cell",
        via_device=(DOMAIN, "system"),
    )


def costs_device() -> DeviceInfo:
    """Tariff + cost/savings accounting entities."""
    return DeviceInfo(
        identifiers={(DOMAIN, "costs")},
        name="EB Costs",
        manufacturer=MANUFACTURER,
        model="Cost accounting",
        via_device=(DOMAIN, "system"),
    )


def layer_device(lid: str) -> DeviceInfo:
    """One device per pooled storage layer (the combined home battery)."""
    name = ("EB Home Battery" if lid.startswith("home_battery")
            else f"EB {lid}")
    if lid.startswith("home_battery_p"):
        name = f"EB Home Battery ({lid.removeprefix('home_battery_')})"
    return DeviceInfo(
        identifiers={(DOMAIN, f"layer_{lid}")},
        name=name,
        manufacturer=MANUFACTURER,
        model="Battery pool",
        via_device=(DOMAIN, "system"),
    )
