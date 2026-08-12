/**
 * EB Configuration Card — Energy Balancer parameter surface
 *
 * Reworked from the SEM configuration card (#442 lineage) for the EB
 * integration's actual parameter set. Mirrors the visual + interaction
 * language of ``eb-control-card.js``:
 *   - accordion sections with color-accent stripe when expanded
 *   - shared (?) help toggle that reveals one-line descriptions
 *   - stepper / toggle primitives backed by the integration's runtime
 *     ``number.eb_*`` / ``switch.eb_*`` entities — no parallel data model
 *
 * Sections:
 *   - System: observer-mode switch, peak-limit stepper and read-only
 *     tariff import/export rates
 *   - one section per storage pool (``pools`` is injected by
 *     dashboard_gen for SoC layers with >1 member) with steppers for
 *     the pool-level SoC targets: sunny_min_soc, no_sun_min_soc
 *   - one section per steerable cell (``cells`` is injected by
 *     dashboard_gen from the coordinator's cell configs) with steppers
 *     for the cell's tuning entities: take, hysteresis, charge_floor_w
 *
 * All writes go through the standard ``number.set_value`` /
 * ``switch.turn_on|turn_off`` services on those entities — the old SEM
 * ``solar_energy_management.set_option`` save path has been removed.
 * A stepper whose entity does not exist renders as a read-only '—' row
 * (the parameter is entity-driven or absent) instead of breaking.
 *
 * Config:
 *   type: custom:eb-config-card
 *   entity_prefix: sensor.eb_    # optional, default sensor.ebi_
 *   cells:                       # injected by dashboard_gen
 *     - { id: car_charger, type: car_charger }
 *     - { id: goodwe, type: house_battery }
 *   pools:                       # injected by dashboard_gen
 *     - { id: home_battery, members: [goodwe, marstek] }
 */

import { SEMLitBase, html, css, nothing } from '../base/eb-lit-base.js';
import { semTheme, semDefineCard, semCardSurfaceCSS } from '../base/eb-shared.js';

// Per-cell tunable number entities: number.<objPrefix><cell>_<suffix>.
// The SoC targets (sunny/no-sun min SoC) are POOL-level, not cell-level —
// they live in POOL_PARAMS below.
const CELL_PARAMS = [
    { suffix: 'take',           labelKey: 'take_pct',       helpKey: 'config_help_take' },
    { suffix: 'hysteresis',     labelKey: 'hysteresis',     helpKey: 'config_help_hysteresis' },
    { suffix: 'charge_floor_w', labelKey: 'charge_floor_w', helpKey: 'config_help_charge_floor' },
];

// Per-pool tunable number entities: number.<objPrefix><pool>_<suffix>
// (e.g. number.eb_home_battery_no_sun_min_soc).
const POOL_PARAMS = [
    { suffix: 'sunny_min_soc',  labelKey: 'sunny_min_soc',  helpKey: 'config_help_sunny_min_soc' },
    { suffix: 'no_sun_min_soc', labelKey: 'no_sun_min_soc', helpKey: 'config_help_no_sun_min_soc' },
];

// Readable fallbacks for label keys that have no semLocalize entry —
// _label() prefers the translation when one exists.
const LABELS = {
    take_pct: 'Take %',
    sunny_min_soc: 'Sunny min SoC',
    no_sun_min_soc: 'No-sun min SoC',
    hysteresis: 'Hysteresis',
    charge_floor_w: 'Charge floor',
    observer_mode: 'Observer mode',
    peak_limit_w: 'Peak limit',
    current_import_rate: 'Import rate',
    current_export_rate: 'Export rate',
    config_section_system: 'System',
    config_help_observer_mode: 'On = dry-run: the chain computes and logs but never actuates.',
    config_help_peak_limit: 'Grid peak guard — the dispatcher sheds load above this limit.',
    config_help_take: 'Share of the available surplus/deficit this cell takes.',
    config_help_sunny_min_soc: 'Target minimum SoC when solar is expected.',
    config_help_no_sun_min_soc: 'Target minimum SoC without expected solar.',
    config_help_hysteresis: 'SoC deadband before the cell switches behavior.',
    config_help_charge_floor: 'Minimum charge power once the cell charges at all.',
};

// Section icon/color per semantic cell type — matches the colors used
// by dashboard_gen's chart series (_KIND_COLOR).
const TYPE_META = {
    solar:         { icon: 'mdi:solar-power',          color: '#ff9800' },
    house:         { icon: 'mdi:home-lightning-bolt',  color: '#ff4444' },
    car_charger:   { icon: 'mdi:ev-station',           color: '#8DC892' },
    house_battery: { icon: 'mdi:battery-medium',       color: '#4db6ac' },
    grid:          { icon: 'mdi:transmission-tower',   color: '#488fc2' },
};

class EBConfigCard extends SEMLitBase {
    static get properties() {
        return {
            ...super.properties,
            _showHelp: { state: true },
        };
    }

    constructor() {
        super();
        // System open by default; pool/cell sections collapsed so the
        // tab doesn't feel overwhelming on first open.
        this._collapsed = { system: false };
        this._showHelp = false;
        this._cells = [];
        this._pools = [];
    }

    setConfig(config) {
        super.setConfig(config);
        this._prefix = config.entity_prefix || 'sensor.ebi_';
        this._cells = Array.isArray(config.cells)
            ? config.cells.filter(c => c && c.id)
            : [];
        this._pools = Array.isArray(config.pools)
            ? config.pools.filter(p => p && p.id)
            : [];
        for (const s of [...this._pools, ...this._cells]) {
            if (!(s.id in this._collapsed)) this._collapsed[s.id] = true;
        }
        // Instance watched list for SEMLitBase's hass setter — system
        // entities + every pool/cell tuning number. Built prefix-resolved,
        // so the base's _mapId pass is a no-op on them.
        const obj = this._objPrefix();
        const ids = [
            `switch.${obj}observer_mode`,
            `number.${obj}peak_limit_w`,
            `${this._prefix}tariff_current_import_rate`,
            `${this._prefix}tariff_current_export_rate`,
        ];
        for (const p of this._pools) {
            for (const prm of POOL_PARAMS) ids.push(`number.${obj}${p.id}_${prm.suffix}`);
        }
        for (const c of this._cells) {
            for (const prm of CELL_PARAMS) ids.push(`number.${obj}${c.id}_${prm.suffix}`);
        }
        this._watchedIds = ids;
    }

    // ── Labels ──

    _label(key) {
        const t = this._t(key);
        return (t && t !== key) ? t : (LABELS[key] || key);
    }

    _cellName(cell) {
        return String(cell.id).replace(/_/g, ' ').toUpperCase();
    }

    // ── UI state ──

    _toggleHelp() { this._showHelp = !this._showHelp; }

    _toggleSection(id) {
        this._collapsed = { ...this._collapsed, [id]: !this._collapsed[id] };
        this.requestUpdate();
    }

    // ── Subtitles ──

    _systemSubtitle() {
        const obs = this._hass?.states[`switch.${this._objPrefix()}observer_mode`];
        const peak = this._hass?.states[`number.${this._objPrefix()}peak_limit_w`];
        const parts = [];
        if (obs) parts.push(`${this._label('observer_mode')} ${obs.state === 'on' ? 'ON' : 'off'}`);
        if (peak && peak.state !== 'unavailable' && peak.state !== 'unknown') {
            parts.push(`${(parseFloat(peak.state) || 0).toFixed(0)} W`);
        }
        return parts.join(' · ');
    }

    _cellSubtitle(cell) {
        const e = this._hass?.states[`number.${this._objPrefix()}${cell.id}_take`];
        if (!e || e.state === 'unavailable' || e.state === 'unknown') return '';
        return `${this._label('take_pct')} ${(parseFloat(e.state) || 0).toFixed(0)}%`;
    }

    _poolSubtitle(pool) {
        return Array.isArray(pool.members) ? pool.members.join(' + ') : '';
    }

    // ── Row renderers ──

    _renderReadonlyRow(labelKey, value, helpKey) {
        return html`
            <div class="stepper-cell">
                <div class="readonly-row">
                    <span class="ctrl-label">${this._label(labelKey)}</span>
                    <span class="readonly-value">${value}</span>
                </div>
                ${(this._showHelp && helpKey) ? html`<div class="setting-help-text">${this._label(helpKey)}</div>` : nothing}
            </div>
        `;
    }

    /** Stepper bound to a number.* entity; read-only '—' row when the
     *  entity does not exist (param is entity-driven or absent). */
    _renderParamRow(entityId, labelKey, T, helpKey) {
        const entity = this._hass?.states[entityId];
        if (!entity) return this._renderReadonlyRow(labelKey, '—', helpKey);
        const frozen = this._frozenEntities[entityId];
        const val = frozen ? frozen.value : (parseFloat(entity.state) || 0);
        const step = parseFloat(entity.attributes.step) || 1;
        const unit = entity.attributes.unit_of_measurement || '';
        const decimals = step < 1 ? 1 : 0;
        const displayVal = val.toFixed(decimals) + (unit ? ' ' + unit : '');
        return html`
            <div class="stepper-cell">
                <div class="stepper-row">
                    <span class="stepper-label">${this._label(labelKey)}</span>
                    <div class="stepper-controls">
                        <button
                            class="stepper-minus" aria-label="Decrease"
                            @click=${() => this._stepNumber(entityId, -1)}
                            @pointerdown=${() => this._startHold(entityId, -1)}
                            @pointerup=${() => this._stopHold(entityId)}
                            @pointerleave=${() => this._stopHold(entityId)}
                        >−</button>
                        <span class="stepper-value">${displayVal}</span>
                        <button
                            class="stepper-plus" aria-label="Increase"
                            @click=${() => this._stepNumber(entityId, 1)}
                            @pointerdown=${() => this._startHold(entityId, 1)}
                            @pointerup=${() => this._stopHold(entityId)}
                            @pointerleave=${() => this._stopHold(entityId)}
                        >+</button>
                    </div>
                </div>
                ${(this._showHelp && helpKey) ? html`<div class="setting-help-text">${this._label(helpKey)}</div>` : nothing}
            </div>
        `;
    }

    /** Toggle bound to a switch.* entity via switch.turn_on / turn_off;
     *  read-only '—' row when the entity does not exist. */
    _renderToggleRow(entityId, labelKey, T, helpKey) {
        const entity = this._hass?.states[entityId];
        if (!entity) return this._renderReadonlyRow(labelKey, '—', helpKey);
        const frozen = this._frozenEntities[entityId];
        const isOn = frozen ? frozen.value === 'on' : entity.state === 'on';
        return html`
            <div class="stepper-cell">
                <div class="toggle-row">
                    <span class="toggle-label">${this._label(labelKey)}</span>
                    <div class="toggle-track ${isOn ? 'on' : ''}" @click=${() => this._toggleSwitch(entityId)}>
                        <div class="toggle-thumb"></div>
                    </div>
                </div>
                ${(this._showHelp && helpKey) ? html`<div class="setting-help-text">${this._label(helpKey)}</div>` : nothing}
            </div>
        `;
    }

    /** Read-only tariff-rate row for a prefixed sensor. */
    _renderRateRow(suffix, labelKey) {
        const e = this._hass?.states[`${this._prefix}${suffix}`];
        const ok = e && e.state !== 'unavailable' && e.state !== 'unknown';
        const unit = e?.attributes?.unit_of_measurement || '';
        const value = ok ? `${e.state}${unit ? ' ' + unit : ''}` : '—';
        return this._renderReadonlyRow(labelKey, value);
    }

    // ── Sections ──

    _sections() {
        const sections = [{
            id: 'system', kind: 'system', icon: 'mdi:tune', color: '#8DC892',
            title: this._label('config_section_system'),
            subtitleFn: () => this._systemSubtitle(),
        }];
        for (const p of this._pools) {
            sections.push({
                id: p.id, kind: 'pool', icon: 'mdi:battery-heart-variant', color: '#4db6ac',
                title: this._cellName(p),
                subtitleFn: () => this._poolSubtitle(p),
            });
        }
        for (const c of this._cells) {
            const meta = TYPE_META[c.type] || { icon: 'mdi:tune-variant', color: '#96CAEE' };
            sections.push({
                id: c.id, kind: 'cell', icon: meta.icon, color: meta.color,
                title: this._cellName(c),
                subtitleFn: () => this._cellSubtitle(c),
            });
        }
        return sections;
    }

    _renderSystemSection(T) {
        const obj = this._objPrefix();
        return html`
            ${this._renderToggleRow(`switch.${obj}observer_mode`, 'observer_mode', T, 'config_help_observer_mode')}
            ${this._renderParamRow(`number.${obj}peak_limit_w`, 'peak_limit_w', T, 'config_help_peak_limit')}
            ${this._renderRateRow('tariff_current_import_rate', 'current_import_rate')}
            ${this._renderRateRow('tariff_current_export_rate', 'current_export_rate')}
        `;
    }

    _renderCellSection(cell, T) {
        const obj = this._objPrefix();
        return html`
            ${CELL_PARAMS.map(p => this._renderParamRow(
                `number.${obj}${cell.id}_${p.suffix}`, p.labelKey, T, p.helpKey))}
        `;
    }

    _renderPoolSection(pool, T) {
        const obj = this._objPrefix();
        return html`
            ${POOL_PARAMS.map(p => this._renderParamRow(
                `number.${obj}${pool.id}_${p.suffix}`, p.labelKey, T, p.helpKey))}
        `;
    }

    _renderSectionHeader(section, T) {
        const collapsed = this._collapsed[section.id];
        const chevronRotate = collapsed ? 'rotate(-90deg)' : 'rotate(0deg)';
        const subtitle = section.subtitleFn();
        return html`
            <div class="section-header" @click=${() => this._toggleSection(section.id)}>
                <div class="section-dot" style="background:${section.color}"></div>
                <ha-icon icon="${section.icon}" style="--mdc-icon-size:20px;color:${section.color}"></ha-icon>
                <span class="section-title-text">${section.title}</span>
                <span class="section-subtitle" style="color:${subtitle ? section.color : ''}">${subtitle}</span>
                <ha-icon class="chevron" icon="mdi:chevron-down"
                         style="--mdc-icon-size:18px;transform:${chevronRotate}"></ha-icon>
            </div>
        `;
    }

    _renderSection(section, content, T) {
        const collapsed = this._collapsed[section.id];
        return html`
            <div class="section ${collapsed ? '' : 'expanded'}"
                 style="--section-accent: ${section.color}">
                ${this._renderSectionHeader(section, T)}
                <div class="section-content ${collapsed ? '' : 'expanded'}">
                    <div class="section-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        if (!this._config) return nothing;
        const T = this._theme();
        const isDark = T.isDark !== false;
        const accent = T.accent || '#42a5f5';
        const sections = this._sections();

        return html`
            <style>
                :host { display: block; contain: layout style paint; }
                .wrap {
                    padding: 16px 20px;
                    position: relative;
                    background: ${semCardSurfaceCSS(T, '#8DC892')};
                    background-size: 100% 100%, 50px 50px;
                    font-family: 'Segoe UI','Roboto',sans-serif;
                    color: var(--primary-text-color, ${T.text});
                }
                .card-help-bar {
                    display: flex; justify-content: flex-end;
                    margin: -4px 0 6px;
                }
                .help-toggle {
                    cursor: pointer;
                    color: var(--secondary-text-color, ${T.textSec});
                    opacity: 0.6;
                    flex-shrink: 0;
                    transition: opacity 0.15s, color 0.15s;
                    user-select: none;
                    padding: 4px;
                    border-radius: 50%;
                }
                .help-toggle:hover { opacity: 1; }
                .help-toggle.on { color: ${accent}; opacity: 1; }

                /* ── Sections: same surface shape as the battery card's
                       per-battery sections so the Config tab reads like
                       the Battery tab. ── */
                .section {
                    margin-bottom: 12px;
                    border-radius: 12px;
                    background: ${T.surface};
                    border: 1px solid ${T.surfaceBorder};
                    overflow: hidden;
                    transition: border-color 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s;
                    position: relative;
                }
                .section.expanded {
                    border-color: color-mix(in srgb, var(--section-accent) 40%, ${T.surfaceBorder});
                    box-shadow: inset 3px 0 0 0 var(--section-accent);
                }
                .section:hover { border-color: ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)'}; }
                .section-header {
                    display: flex; align-items: center; gap: 8px;
                    padding: 12px 14px; cursor: pointer; user-select: none;
                    transition: background 0.15s;
                }
                .section.expanded .section-header {
                    background: color-mix(in srgb, var(--section-accent) 6%, transparent);
                }
                .section-dot {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                .section-title-text {
                    font-size: 0.95em; font-weight: 600; white-space: nowrap;
                    color: var(--primary-text-color, ${T.text});
                }
                .section-subtitle {
                    flex: 1; font-size: 0.75em; font-weight: 500;
                    text-transform: uppercase; letter-spacing: 0.05em;
                    color: var(--secondary-text-color, ${T.textSec});
                    text-align: right; white-space: nowrap;
                    overflow: hidden; text-overflow: ellipsis; margin-right: 4px;
                }
                .chevron { transition: transform 0.25s ease; color: var(--secondary-text-color, ${T.textSec}); }
                .section-content {
                    max-height: 0; opacity: 0; overflow: hidden;
                    transition: max-height 0.3s ease, opacity 0.2s ease;
                }
                .section-content.expanded { max-height: 2000px; opacity: 1; }
                .section-body { padding: 0 14px 14px; }

                /* Inline edit primitives (same look as Control card) */
                .ctrl-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
                .ctrl-label { font-size: 14px; font-weight: 500; }
                .stepper-row { display: flex; align-items: center; justify-content: space-between; padding: 7px 0; }
                .stepper-label {
                    font-size: 14px; font-weight: 500; flex: 1; min-width: 0;
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                }
                .stepper-controls { display: flex; align-items: center; gap: 2px; flex-shrink: 0; }
                .stepper-minus, .stepper-plus {
                    width: 30px; height: 30px; border-radius: 8px;
                    border: 1px solid ${T.surfaceBorder};
                    background: ${T.surface}; color: var(--primary-text-color, ${T.text});
                    font-size: 16px; font-weight: 600; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.15s, border-color 0.15s; user-select: none;
                    touch-action: manipulation;
                    padding: 0; line-height: 1;
                }
                .stepper-minus:hover, .stepper-plus:hover { background: ${T.surfaceHover}; border-color: ${accent}; }
                .stepper-value {
                    font-size: 14px; font-weight: 600; min-width: 60px; text-align: center;
                    font-variant-numeric: tabular-nums;
                }
                .readonly-row { display: flex; align-items: center; justify-content: space-between; padding: 7px 0; }
                .readonly-row .ctrl-label { font-size: 12px; color: var(--secondary-text-color, ${T.textSec}); font-weight: 500; }
                .readonly-value {
                    font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums;
                    color: var(--primary-text-color, ${T.text});
                }
                .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
                .toggle-label { font-size: 14px; font-weight: 500; }
                .toggle-track {
                    position: relative; width: 42px; height: 24px;
                    border-radius: 12px;
                    background: ${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.18)'};
                    cursor: pointer; transition: background 0.2s; flex-shrink: 0;
                }
                .toggle-track.on { background: ${accent}; }
                .toggle-thumb {
                    position: absolute; top: 2px; left: 2px;
                    width: 20px; height: 20px; border-radius: 50%;
                    background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    transition: left 0.2s;
                }
                .toggle-track.on .toggle-thumb { left: 20px; }

                .stepper-cell { display: flex; flex-direction: column; }
                .setting-help-text {
                    font-size: 11px; line-height: 1.35;
                    color: var(--secondary-text-color, ${T.textSec});
                    opacity: 0.75; padding: 2px 4px 6px 0; margin-top: -4px;
                    font-style: italic;
                }
            </style>
            <ha-card>
                <div class="wrap">
                    <div class="card-help-bar">
                        <ha-icon
                            class="help-toggle ${this._showHelp ? 'on' : ''}"
                            icon="${this._showHelp ? 'mdi:help-circle' : 'mdi:help-circle-outline'}"
                            title="${this._t('zone_help_toggle')}"
                            @click=${() => this._toggleHelp()}
                            style="--mdc-icon-size:18px"
                        ></ha-icon>
                    </div>
                    ${sections.map(s => this._renderSection(
                        s,
                        s.kind === 'system'
                            ? this._renderSystemSection(T)
                            : s.kind === 'pool'
                                ? this._renderPoolSection(this._pools.find(p => p.id === s.id), T)
                                : this._renderCellSection(this._cells.find(c => c.id === s.id), T),
                        T,
                    ))}
                </div>
            </ha-card>
        `;
    }

    getCardSize() { return 8; }
    static getStubConfig() { return { entity_prefix: 'sensor.ebi_', cells: [], pools: [] }; }
}

semDefineCard('eb-config-card', EBConfigCard, {
    type: 'custom:eb-config-card',
    name: 'EB Configuration Card',
    description: 'In-dashboard Energy Balancer parameter surface (observer mode, peak limit, per-cell tuning)',
    preview: false,
});
