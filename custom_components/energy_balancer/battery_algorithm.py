"""
Battery SOC Algorithm
=====================

Inputs:
  A = min_battery_sunny          Target in full sun (%)
  B = min_battery_no_sun         Target without sun (%)
  C = battery_state_of_charge    Battery SOC (%)
  D = pv_remaining_today         Expected solar today (kWh)
  E = solar_production           Current PV, all panels (W)
  F = pv_forecast_now            Expected PV now (W)
  G = sun_elevation              Sun elevation (degrees)
  J = hours_until_solar          Hours until solar > 500 W
  K = base_consumption_w         Base consumption of the house (W)
  L = car_charging_w             Car charging power (W, 0 if deferred)

Calculations:
  battery_room     = (95 - C) / 100 * 15
  solar_coverage   = D / battery_room                       [0 - 1]
  sun_availability = G / 15                                 [0 - 1]
  forecast_ratio   = E / max(F, 1)                          [0 - 1]
  weight           = solar_coverage * sun_availability * forecast_ratio

  consumption_kwh  = (K + L) * J / 1000
  solar_kwh        = D (remaining today)
  shortfall_kwh    = max(0, consumption_kwh - solar_kwh)
  consumption_soc  = shortfall_kwh / 15 * 100               [%]

  base             = B - (B - A) * weight
  min_soc          = max(base, consumption_soc)
"""

BATTERY_CAPACITY_KWH = 15.0
MAX_SOC = 95.0
FULL_SUN_KWH = 15.0   # forecast in kWh at which we assume "full sun"


def clamp(lo, hi, val):
    """Limit a value to [lo, hi] (physical bounds)."""
    return max(lo, min(hi, val))


def calculate_weight(i_soc, i_pv_remaining, i_pv_actual, i_pv_forecast, i_sun_elevation):
    """Compute the PV forecast weight (0-1).

    Args:
        i_soc:           C - battery SOC (%)
        i_pv_remaining:  D - expected PV today (kWh)
        i_pv_actual:     E - current PV production (W)
        i_pv_forecast:   F - expected PV now (W)
        i_sun_elevation: G - sun elevation (degrees)

    Returns:
        dict with all intermediate results and the weight
    """
    # battery_room: how many kWh still fit in?
    battery_room = max(0.1, (MAX_SOC - i_soc) / 100.0 * BATTERY_CAPACITY_KWH)

    # solar_coverage: does the expected sun cover the battery room?
    solar_coverage = clamp(0, 1, i_pv_remaining / battery_room)

    # sun_availability: is the sun high enough to produce?
    sun_availability = clamp(0, 1, i_sun_elevation / 15.0)

    # forecast_ratio: does the forecast match the actual production?
    forecast_ratio = clamp(0, 1, i_pv_actual / max(i_pv_forecast, 1))

    # weight: combined confidence in solar energy
    weight = solar_coverage * sun_availability * forecast_ratio

    return {
        "battery_room": round(battery_room, 2),
        "solar_coverage": round(solar_coverage, 4),
        "sun_availability": round(sun_availability, 4),
        "forecast_ratio": round(forecast_ratio, 4),
        "weight": round(weight, 4),
    }


def calculate_min_soc(weight, i_sunny_min, i_no_sun_min,
                      i_hours_until_solar, i_base_consumption_w,
                      i_car_charging_w, i_pv_remaining):
    """Compute the dynamic minimum SOC (%).

    Replaces the old temp_boost logic with a consumption-based calculation.

    Args:
        weight:                result of calculate_weight (0-1)
        i_sunny_min:           A - target in full sun (%)
        i_no_sun_min:          B - target without sun (%)
        i_hours_until_solar:   J - hours until solar > 500 W
        i_base_consumption_w:  K - base consumption of the house (W)
        i_car_charging_w:      L - car charging power (W, 0 if deferred)
        i_pv_remaining:        D - expected PV remaining today (kWh)

    Returns:
        dict with all intermediate results and min_soc
    """
    # Total expected consumption until the sun is there
    total_consumption_w = i_base_consumption_w + i_car_charging_w
    consumption_kwh = total_consumption_w * i_hours_until_solar / 1000.0

    # How much sun do we expect?
    solar_kwh = max(0, i_pv_remaining)

    # Shortfall: what the battery has to bridge
    shortfall_kwh = max(0, consumption_kwh - solar_kwh)

    # Shortfall expressed as a SOC percentage
    consumption_soc = shortfall_kwh / BATTERY_CAPACITY_KWH * 100.0

    # base: linear interpolation between B (no sun) and A (full sun)
    weight_base = i_no_sun_min - (i_no_sun_min - i_sunny_min) * weight

    # min_soc: always the maximum of weight_base and consumption_soc
    # weight_base covers cloudy weather (weight is low when actual << forecast)
    # consumption_soc covers night-time use (hours until sun × consumption)
    min_soc = max(weight_base, consumption_soc)

    # Dynamic floor: scales with the solar forecast
    # Lots of sun → low floor (sunny_min), little sun → high floor (no_sun_min)
    solar_factor = clamp(0, 1, solar_kwh / FULL_SUN_KWH)
    floor = i_no_sun_min - (i_no_sun_min - i_sunny_min) * solar_factor

    min_soc = clamp(floor, i_no_sun_min, min_soc)

    return {
        "consumption_w": round(total_consumption_w, 0),
        "consumption_kwh": round(consumption_kwh, 2),
        "solar_kwh": round(solar_kwh, 2),
        "shortfall_kwh": round(shortfall_kwh, 2),
        "consumption_soc": round(consumption_soc, 1),
        "hours_until_solar": round(i_hours_until_solar, 2),
        "car_charging_w": round(i_car_charging_w, 0),
        "weight_base": round(weight_base, 1),
        "floor": round(floor, 1),
        "min_soc": round(min_soc, 1),
    }


def calculate_all(i_soc, i_pv_remaining, i_pv_actual, i_pv_forecast,
                  i_sun_elevation, i_sunny_min, i_no_sun_min,
                  i_hours_until_solar=0, i_base_consumption_w=1300,
                  i_car_charging_w=0):
    """Full algorithm: all inputs -> min_soc.

    Returns:
        dict with all intermediate results
    """
    w = calculate_weight(i_soc, i_pv_remaining, i_pv_actual,
                         i_pv_forecast, i_sun_elevation)
    m = calculate_min_soc(w["weight"], i_sunny_min, i_no_sun_min,
                          i_hours_until_solar, i_base_consumption_w,
                          i_car_charging_w, i_pv_remaining)
    return {**w, **m}
