// The schedule card sets its timeline as one markup string. Render it from the
// built bundle with markup in the attributes it reads (schedule_today and the
// EV plan's kWh) and check that the values come out as text. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const defined = {};
globalThis.window = globalThis;
globalThis.HTMLElement = class {};
globalThis.customElements = { define(name, cls) { defined[name] = cls; }, get(name) { return defined[name]; } };
globalThis.document = {
    createElement: () => ({}), createTreeWalker: () => ({}), createComment: () => ({}),
    querySelector: () => null, addEventListener() {}, head: { appendChild() {} },
};
globalThis.customCards = [];
await import(fileURLToPath(new URL('../dist/eb-cards.js', import.meta.url)));

const Card = defined['eb-schedule-card'];
const card = Object.create(Card.prototype);
const now = new Date();
const at = (h) => { const d = new Date(now); d.setHours(h, 0, 0, 0); return d.toISOString(); };
const evil = '<img src=x onerror=alert(1)>';
card._prefix = 'sensor.ebi_';
// a translation that carries the kWh placeholder, as the real ones do
card._t = (key) => (key === 'plan_ev_min_reached' ? 'min {kwh} kWh' : key);
card._hass = {
    language: 'en',
    states: {
        'sensor.ebi_tariff_current_import_rate': { state: '0.3', attributes: { schedule_today: [
            { start: '00:00', end: '12:00', level: evil, tariff: evil, avg_price: '0.31' },
            { start: '12:00', end: '24:00', tariff: evil },
        ] } },
        'sensor.ebi_charging_state': { state: 'idle', attributes: { today_plan: [
            { kind: 'ev_charge_start', when: at(1) },
            { kind: 'ev_min_reached', when: at(5), values: { kwh: evil } },
            { kind: 'ev_deadline', when: at(7) },
        ] } },
    },
};

test('hostile attribute values render as text', () => {
    const out = card._buildSvgContent({});
    assert.ok(!out.includes('<img'), 'markup from an attribute reached the timeline');
    assert.equal(out.split('&lt;img src=x onerror=alert(1)&gt;').length - 1, 3);
});

test('a price published as a string still renders', () => {
    assert.match(card._buildSvgContent({}), /avg 0\.31/);
});

