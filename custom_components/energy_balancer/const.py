"""Constants for the Energy Balancer integration."""

DOMAIN = "energy_balancer"

# Entity prefix. Was "ebi" during observer phase (side-by-side with AppDaemon).
# Now "eb" — EBI is the master, AppDaemon EB is disabled.
ENTITY_PREFIX = "eb"

# --- Config keys (mirror the AppDaemon apps.yaml schema 1:1) ---
CONF_SOLAR_SENSOR = "solar_sensor"
CONF_HOUSE_SENSOR = "house_sensor"
CONF_HOUSE_INCLUDES = "house_includes"
CONF_GRID_SENSOR = "grid_sensor"
CONF_FORECAST_SENSOR = "forecast_sensor"
CONF_CHARGE_PCT_SENSOR = "charge_pct_sensor"

# Optional forecast inputs — display only. The chain already steers on
# CONF_FORECAST_SENSOR; these fill the dashboard's forecast section, which showed
# nothing but zeros because EB never published the fields the cards ask for.
CONF_FORECAST_TODAY_SENSOR = "forecast_today_sensor"
CONF_FORECAST_TOMORROW_SENSOR = "forecast_tomorrow_sensor"
CONF_FORECAST_PEAK_POWER_SENSOR = "forecast_peak_power_sensor"
CONF_FORECAST_PEAK_TIME_SENSOR = "forecast_peak_time_sensor"
CONF_PEAK_LIMIT_W = "peak_limit_w"
CONF_PEAK_LIMIT_SENSORS = "peak_limit_sensors"
CONF_UPDATE_INTERVAL = "update_interval_seconds"
CONF_OBSERVER = "observer_mode"
CONF_CELLS = "cells"

# Per-cell sub-keys
CONF_POSITION = "position"
CONF_MODE = "mode"
CONF_TYPE = "type"
CONF_HARDWARE = "hardware"
CONF_ALGO = "algo"

# Defaults
DEFAULT_UPDATE_INTERVAL = 10
DEFAULT_PEAK_LIMIT_W = 3500.0
DEFAULT_OBSERVER = True

# State strings treated as "no value"
UNAVAILABLE_STATES = (None, "unknown", "unavailable", "")

# Entity-id prefixes that _resolve treats as a live entity reference
ENTITY_PREFIXES = (
    "sensor.",
    "input_number.",
    "input_select.",
    "number.",
    "binary_sensor.",
)
