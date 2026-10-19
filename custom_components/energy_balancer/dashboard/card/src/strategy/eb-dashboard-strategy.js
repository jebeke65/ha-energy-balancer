/**
 * Energy Balancer dashboard strategy.
 *
 * A dashboard whose whole configuration is
 *
 *     strategy:
 *       type: custom:energy-balancer
 *
 * asks the integration for its views every time it is opened, through the
 * `energy_balancer/dashboard` websocket command. The views are built server-side
 * from the live configuration (cells, pools, chart series), so the dashboard
 * follows a change in the configuration without being regenerated, and nothing
 * is written to Home Assistant's dashboard storage.
 */

class EnergyBalancerDashboardStrategy extends HTMLElement {
    static async generate(config, hass) {
        try {
            const result = await hass.callWS({ type: 'energy_balancer/dashboard' });
            return { views: result.views || [] };
        } catch (err) {
            const message = (err && (err.message || err.code)) || String(err);
            return {
                views: [{
                    title: 'Energy Balancer',
                    cards: [{
                        type: 'markdown',
                        content:
                            '## Energy Balancer dashboard unavailable\n\n' +
                            'The integration did not return its dashboard: `' + message + '`.\n\n' +
                            'Check that Energy Balancer is set up and running under ' +
                            '*Settings → Devices & services*.',
                    }],
                }],
            };
        }
    }
}

if (!customElements.get('ll-strategy-dashboard-energy-balancer')) {
    customElements.define('ll-strategy-dashboard-energy-balancer', EnergyBalancerDashboardStrategy);
}
