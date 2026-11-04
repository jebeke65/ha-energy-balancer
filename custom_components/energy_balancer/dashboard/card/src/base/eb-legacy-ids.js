// Old entity ids the cards still ask for -> the ids EB publishes since
// 2026-11-04 (<domain>.eb_<cell>_<what>, see naming.py in the integration).
//
// The cards are a SEM port: they build ids from SEM's names (prefix +
// 'battery_soc', prefix + cell id, ...). Rather than touch every card, the
// hass object a card sees resolves those names here, in one place, for both
// reading states and calling services.

export const RENAMED = {
    'number.eb_car_charger_average_n': 'number.eb_carcharger_average_n',
    'number.eb_car_charger_charge_floor_w': 'number.eb_carcharger_charge_floor_w',
    'number.eb_car_charger_debounce_s': 'number.eb_carcharger_debounce_s',
    'number.eb_car_charger_hysteresis': 'number.eb_carcharger_hysteresis',
    'number.eb_car_charger_limit_step_w': 'number.eb_carcharger_limit_step_w',
    'number.eb_car_charger_solar_debounce_s': 'number.eb_carcharger_solar_debounce_s',
    'number.eb_car_charger_start_margin_w': 'number.eb_carcharger_start_margin_w',
    'number.eb_car_charger_surplus_tier_soc': 'number.eb_carcharger_surplus_tier_soc',
    'number.eb_car_charger_take': 'number.eb_carcharger_take',
    'number.eb_goodwe_charge_floor_w': 'number.eb_homebattery_goodwe_charge_floor_w',
    'number.eb_goodwe_hysteresis': 'number.eb_homebattery_goodwe_hysteresis',
    'number.eb_goodwe_take': 'number.eb_homebattery_goodwe_take',
    'number.eb_home_battery_manual_min_soc': 'number.eb_homebattery_manual_min_soc',
    'number.eb_home_battery_no_sun_min_soc': 'number.eb_homebattery_no_sun_min_soc',
    'number.eb_home_battery_sunny_min_soc': 'number.eb_homebattery_sunny_min_soc',
    'number.eb_marstek_charge_floor_w': 'number.eb_homebattery_marstek_charge_floor_w',
    'number.eb_marstek_hysteresis': 'number.eb_homebattery_marstek_hysteresis',
    'number.eb_marstek_take': 'number.eb_homebattery_marstek_take',
    'number.eb_peak_limit_w': 'number.eb_net_peak_limit_w',
    'number.eb_peak_max_w': 'number.eb_net_peak_max_w',
    'select.eb_car_charger_mode': 'select.eb_carcharger_mode',
    'select.eb_home_battery_min_soc_mode': 'select.eb_homebattery_min_soc_mode',
    'select.eb_month_start_peak_policy': 'select.eb_net_month_start_peak_policy',
    'sensor.eb_available_load_reduction': 'sensor.eb_net_peak_load_reduction',
    'sensor.eb_car_charger': 'sensor.eb_carcharger_cell',
    'sensor.eb_car_charger_performance': 'sensor.eb_carcharger_performance',
    'sensor.eb_consecutive_peak_15min': 'sensor.eb_net_peak_quarter',
    'sensor.eb_controllable_devices_count': 'sensor.eb_net_surplus_devices_controllable',
    'sensor.eb_current_vs_peak_percentage': 'sensor.eb_net_peak_usage_pct',
    'sensor.eb_daily_grid_export_energy': 'sensor.eb_net_energy_export_daily',
    'sensor.eb_daily_grid_import_energy': 'sensor.eb_net_energy_import_daily',
    'sensor.eb_daily_solar_energy': 'sensor.eb_solar_energy_daily',
    'sensor.eb_goodwe': 'sensor.eb_homebattery_goodwe_cell',
    'sensor.eb_goodwe_performance': 'sensor.eb_homebattery_goodwe_performance',
    'sensor.eb_grid_status': 'sensor.eb_net_status',
    'sensor.eb_house': 'sensor.eb_house_cell',
    'sensor.eb_layer_car_charger': 'sensor.eb_carcharger_layer',
    'sensor.eb_layer_home_battery': 'sensor.eb_homebattery_layer',
    'sensor.eb_layer_home_battery_energy_charged': 'sensor.eb_homebattery_energy_charged',
    'sensor.eb_layer_home_battery_energy_discharged': 'sensor.eb_homebattery_energy_discharged',
    'sensor.eb_layer_home_battery_soc': 'sensor.eb_homebattery_soc',
    'sensor.eb_layer_home_battery_target': 'sensor.eb_homebattery_target_soc',
    'sensor.eb_layer_house': 'sensor.eb_house_layer',
    'sensor.eb_layer_net': 'sensor.eb_net_layer',
    'sensor.eb_layer_solar': 'sensor.eb_solar_layer',
    'sensor.eb_lifetime_grid_export_energy': 'sensor.eb_net_energy_export_lifetime',
    'sensor.eb_lifetime_grid_import_energy': 'sensor.eb_net_energy_import_lifetime',
    'sensor.eb_lifetime_house_energy': 'sensor.eb_house_energy_lifetime',
    'sensor.eb_lifetime_solar_energy': 'sensor.eb_solar_energy_lifetime',
    'sensor.eb_load_management_status': 'sensor.eb_net_peak_status',
    'sensor.eb_marstek': 'sensor.eb_homebattery_marstek_cell',
    'sensor.eb_marstek_performance': 'sensor.eb_homebattery_marstek_performance',
    'sensor.eb_monthly_consecutive_peak': 'sensor.eb_net_peak_month',
    'sensor.eb_monthly_grid_export_energy': 'sensor.eb_net_energy_export_monthly',
    'sensor.eb_monthly_grid_import_energy': 'sensor.eb_net_energy_import_monthly',
    'sensor.eb_monthly_solar_energy': 'sensor.eb_solar_energy_monthly',
    'sensor.eb_net': 'sensor.eb_net_cell',
    'sensor.eb_solar': 'sensor.eb_solar_cell',
    'sensor.eb_surplus_active_devices': 'sensor.eb_net_surplus_active_devices',
    'sensor.eb_surplus_allocated_w': 'sensor.eb_net_surplus_allocated_w',
    'sensor.eb_surplus_total_devices': 'sensor.eb_net_surplus_total_devices',
    'sensor.eb_surplus_total_w': 'sensor.eb_net_surplus_total_w',
    'sensor.eb_surplus_unallocated_w': 'sensor.eb_net_surplus_unallocated_w',
    'sensor.eb_system_eb_daily_house_energy': 'sensor.eb_house_energy_daily',
    'sensor.eb_system_eb_monthly_house_energy': 'sensor.eb_house_energy_monthly',
    'sensor.eb_system_eb_yearly_house_energy': 'sensor.eb_house_energy_yearly',
    'sensor.eb_target_peak_limit': 'sensor.eb_net_peak_limit',
    'sensor.eb_yearly_grid_export_energy': 'sensor.eb_net_energy_export_yearly',
    'sensor.eb_yearly_grid_import_energy': 'sensor.eb_net_energy_import_yearly',
    'sensor.eb_yearly_solar_energy': 'sensor.eb_solar_energy_yearly'
};

// SEM copies that EB no longer publishes: derived from the sensor that holds
// the measurement. [source, transform of the numeric state].
const DERIVED = {
    'sensor.eb_solar_power': ['sensor.eb_solar_layer', v => v],
    'sensor.eb_home_consumption_power': ['sensor.eb_house_layer', v => v],
    'sensor.eb_grid_power': ['sensor.eb_net_layer', v => v],
    'sensor.eb_grid_import_power': ['sensor.eb_net_layer', v => Math.max(0, v)],
    'sensor.eb_grid_export_power': ['sensor.eb_net_layer', v => Math.max(0, -v)],
    'sensor.eb_ev_power': ['sensor.eb_carcharger_layer', v => v],
    // The layer uses the battery sign (+ = discharge); SEM wants + = charge.
    'sensor.eb_battery_power': ['sensor.eb_homebattery_layer', v => -v],
    'sensor.eb_battery_soc': ['sensor.eb_homebattery_soc', v => v],
};

function derive(states, id) {
    if (id === 'sensor.eb_battery_status') {
        const src = states['sensor.eb_homebattery_layer'];
        return src && { ...src, entity_id: id, state: src.attributes?.action ?? src.state };
    }
    const d = DERIVED[id];
    if (!d) return undefined;
    const src = states[d[0]];
    if (!src) return undefined;
    const v = parseFloat(src.state);
    return { ...src, entity_id: id, state: Number.isFinite(v) ? String(d[1](v)) : src.state };
}

export function resolveId(id) {
    return (typeof id === 'string' && RENAMED[id]) || id;
}

const _wrapped = new WeakMap();

// A hass whose `states` and `callService` understand the old ids. One wrapper
// per hass object, so identity checks between renders keep working.
export function withLegacyIds(hass) {
    if (!hass || typeof hass !== 'object') return hass;
    let w = _wrapped.get(hass);
    if (w) return w;
    const real = hass.states || {};
    const cache = {};
    const states = new Proxy(real, {
        get(target, id) {
            if (typeof id !== 'string' || id in target) return target[id];
            if (RENAMED[id]) return target[RENAMED[id]];
            if (!(id in cache)) cache[id] = derive(target, id);
            return cache[id];
        },
        has(target, id) {
            return id in target || (typeof id === 'string'
                && (!!RENAMED[id] || derive(target, id) !== undefined));
        },
    });
    const mapIds = (data) => {
        if (!data || data.entity_id == null) return data;
        const e = data.entity_id;
        return { ...data, entity_id: Array.isArray(e) ? e.map(resolveId) : resolveId(e) };
    };
    w = Object.create(hass, {
        states: { value: states, enumerable: true },
        callService: { value: (domain, service, data, target, ...rest) =>
            hass.callService(domain, service, mapIds(data), mapIds(target), ...rest) },
    });
    _wrapped.set(hass, w);
    return w;
}
