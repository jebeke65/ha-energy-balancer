/**
 * SEM Cards — Single bundled entry point
 *
 * All SEM custom cards are imported here and bundled by Rollup
 * into a single eb-cards.js file for Lovelace resource registration.
 */

// Display cards
import './cards/eb-title-card.js';
import './cards/eb-tab-header.js';
import './cards/eb-weather-card.js';
import './cards/eb-period-selector-card.js';
import './cards/eb-energy-impact-card.js';
import './cards/eb-ev-progress-card.js';
import './cards/eb-gauge-card.js';

// Hero / SVG cards
import './cards/eb-solar-card.js';
import './cards/eb-solar-summary-card.js';
import './cards/eb-battery-card.js';
import './cards/eb-grid-card.js';
import './cards/eb-schedule-card.js';

// Interactive cards
import './cards/eb-battery-zones-card.js';
import './cards/eb-costs-card.js';
import './cards/eb-costs-detail-card.js';
import './cards/eb-charger-status-card.js';
import './cards/eb-ev-status-card.js';
import './cards/eb-home-status-card.js';
import './cards/eb-price-card.js';
import './cards/eb-system-card.js';
import './cards/eb-today-plan-card.js';

// Complex cards (observers, animations, external libs)
import './cards/eb-flow-card.js';
import './cards/eb-system-diagram-card.js';
import './cards/eb-chart-card.js';
import './cards/eb-load-priority-card.js';
import './cards/eb-control-card.js';
import './elements/eb-entity-picker.js';
import './cards/eb-config-card.js';
import './cards/eb-onboarding-banner.js';
import './cards/eb-diagnose-button.js';

// Version info
console.info(
    '%c SEM Cards %c Lit Bundle ',
    'color: #4db6ac; font-weight: bold; background: #1e232d; padding: 2px 6px; border-radius: 4px 0 0 4px;',
    'color: #ff9800; background: #1e232d; padding: 2px 6px; border-radius: 0 4px 4px 0;'
);
