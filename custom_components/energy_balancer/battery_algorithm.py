"""
Battery SOC Algorithm
=====================

Inputs:
  A = min_battery_sunny          Target bij volle zon (%)
  B = min_battery_no_sun         Target zonder zon (%)
  C = battery_state_of_charge    Batterij SOC (%)
  D = pv_remaining_today         Verwachte zon vandaag (kWh)
  E = solar_production           Actuele PV alle panelen (W)
  F = pv_forecast_now            Verwachte PV nu (W)
  G = sun_elevation              Zonhoogte (graden)
  J = hours_until_solar          Uren tot solar > 500W
  K = base_consumption_w         Basisverbruik woning (W)
  L = car_charging_w             Auto laadvermogen (W, 0 als uitgesteld)

Berekeningen:
  batterij_ruimte  = (95 - C) / 100 * 15
  solar_coverage   = D / batterij_ruimte                    [0 - 1]
  sun_availability = G / 15                                 [0 - 1]
  forecast_ratio   = E / max(F, 1)                          [0 - 1]
  weight           = solar_coverage * sun_availability * forecast_ratio

  consumption_kwh  = (K + L) * J / 1000
  solar_kwh        = D (remaining today)
  tekort_kwh       = max(0, consumption_kwh - solar_kwh)
  consumption_soc  = tekort_kwh / 15 * 100                  [%]

  base             = B - (B - A) * weight
  min_soc          = max(base, consumption_soc)

Testbaar via:
  cd /config/appdaemon/apps/battery_optimisation/tests
  python3 test_battery_min_soc.py --verbose
"""

BATTERY_CAPACITY_KWH = 15.0
MAX_SOC = 95.0
FULL_SUN_KWH = 15.0   # kWh forecast waarbij we "volle zon" aannemen


def clamp(lo, hi, val):
    """Begrens waarde tussen lo en hi (fysieke grenzen)."""
    return max(lo, min(hi, val))


def calculate_weight(i_soc, i_pv_remaining, i_pv_actual, i_pv_forecast, i_sun_elevation):
    """Bereken PV forecast weight (0-1).

    Args:
        i_soc:           C - batterij SOC (%)
        i_pv_remaining:  D - verwachte PV vandaag (kWh)
        i_pv_actual:     E - actuele PV productie (W)
        i_pv_forecast:   F - verwachte PV nu (W)
        i_sun_elevation: G - zonhoogte (graden)

    Returns:
        dict met alle tussenresultaten en weight
    """
    # batterij_ruimte: hoeveel kWh past er nog in?
    batterij_ruimte = max(0.1, (MAX_SOC - i_soc) / 100.0 * BATTERY_CAPACITY_KWH)

    # solar_coverage: dekt de verwachte zon de batterijruimte?
    solar_coverage = clamp(0, 1, i_pv_remaining / batterij_ruimte)

    # sun_availability: staat de zon hoog genoeg voor productie?
    sun_availability = clamp(0, 1, i_sun_elevation / 15.0)

    # forecast_ratio: klopt de forecast met de werkelijke productie?
    forecast_ratio = clamp(0, 1, i_pv_actual / max(i_pv_forecast, 1))

    # weight: gecombineerd vertrouwen in zonne-energie
    weight = solar_coverage * sun_availability * forecast_ratio

    return {
        "batterij_ruimte": round(batterij_ruimte, 2),
        "solar_coverage": round(solar_coverage, 4),
        "sun_availability": round(sun_availability, 4),
        "forecast_ratio": round(forecast_ratio, 4),
        "weight": round(weight, 4),
    }


def calculate_min_soc(weight, i_sunny_min, i_no_sun_min,
                      i_hours_until_solar, i_base_consumption_w,
                      i_car_charging_w, i_pv_remaining):
    """Bereken dynamische minimum SOC (%).

    Vervangt de oude temp_boost logica door een verbruiksgebaseerde berekening.

    Args:
        weight:                uitkomst van calculate_weight (0-1)
        i_sunny_min:           A - target bij volle zon (%)
        i_no_sun_min:          B - target zonder zon (%)
        i_hours_until_solar:   J - uren tot solar > 500W
        i_base_consumption_w:  K - basisverbruik woning (W)
        i_car_charging_w:      L - auto laadvermogen (W, 0 als uitgesteld)
        i_pv_remaining:        D - verwachte PV remaining vandaag (kWh)

    Returns:
        dict met alle tussenresultaten en min_soc
    """
    # Totaal verwacht verbruik tot zon er is
    total_consumption_w = i_base_consumption_w + i_car_charging_w
    consumption_kwh = total_consumption_w * i_hours_until_solar / 1000.0

    # Hoeveel zon verwachten we?
    solar_kwh = max(0, i_pv_remaining)

    # Tekort: wat de batterij moet overbruggen
    tekort_kwh = max(0, consumption_kwh - solar_kwh)

    # Tekort omzetten naar SOC percentage
    consumption_soc = tekort_kwh / BATTERY_CAPACITY_KWH * 100.0

    # base: lineaire interpolatie tussen B (geen zon) en A (volle zon)
    weight_base = i_no_sun_min - (i_no_sun_min - i_sunny_min) * weight

    # min_soc: altijd het maximum van weight_base en consumption_soc
    # weight_base vangt bewolkt weer op (weight is laag als actueel << forecast)
    # consumption_soc vangt nachtverbruik op (uren tot zon × verbruik)
    min_soc = max(weight_base, consumption_soc)

    # Dynamische floor: schaalt met de zonneforecast
    # Veel zon → lage floor (sunny_min), weinig zon → hoge floor (no_sun_min)
    solar_factor = clamp(0, 1, solar_kwh / FULL_SUN_KWH)
    floor = i_no_sun_min - (i_no_sun_min - i_sunny_min) * solar_factor

    min_soc = clamp(floor, i_no_sun_min, min_soc)

    return {
        "consumption_w": round(total_consumption_w, 0),
        "consumption_kwh": round(consumption_kwh, 2),
        "solar_kwh": round(solar_kwh, 2),
        "tekort_kwh": round(tekort_kwh, 2),
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
    """Volledig algoritme: alle inputs -> min_soc.

    Returns:
        dict met alle tussenresultaten
    """
    w = calculate_weight(i_soc, i_pv_remaining, i_pv_actual,
                         i_pv_forecast, i_sun_elevation)
    m = calculate_min_soc(w["weight"], i_sunny_min, i_no_sun_min,
                          i_hours_until_solar, i_base_consumption_w,
                          i_car_charging_w, i_pv_remaining)
    return {**w, **m}
