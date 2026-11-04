# Changelog

## 0.3.1

### Fixed
- The tab header (top of every dashboard tab) and the grid card showed 0 or nothing
  for the values whose entity ids changed in 0.3.0. Every card that sets its own
  `hass` now resolves the old ids through `eb-legacy-ids.js`, as the base class does.

### Tests
- A source guard in `tests/test_dashboard.py` fails for any card whose `set hass`
  does not start with the legacy-id wrapper.

## 0.3.0

### Breaking
- Entity ids follow one rule: `<domain>.eb_<cell>_<what>`, the block that computes a
  value first (see `naming.py` and `NAMING.md`). Examples: `sensor.eb_net_peak_limit`
  (was `sensor.eb_target_peak_limit`), `sensor.eb_homebattery_layer` (was
  `sensor.eb_layer_home_battery`), `number.eb_net_peak_limit_w` (was
  `number.eb_peak_limit_w`). Home Assistant keeps the entity id of an entity that is
  already registered, so an existing install keeps its old ids until they are renamed
  in Settings → Entities; dashboards, automations and scripts that use them must follow.
- The peak knobs (`peak_limit_w`, `peak_max_w`, month start peak policy) moved from the
  EB System device to the grid cell's device.
- Removed the SEM copies of values that have their own EB sensor; the bundled cards
  derive them from that sensor.

### Added
- `sensor.eb_<cell>_headroom_out`: the net ceiling a block hands on to the next one.
  A car charger after the home battery reads its headroom from the battery tier, not
  from the grid.

### Fixed
- The block brake brings the meter's 15-minute counter forward by its measured delay;
  a late P1 reading no longer lets the brake aim over the ceiling.
- A layer's energy meters (`*_energy_charged` / `*_energy_discharged`) are unknown while
  any member meter is unreadable, instead of summing the readable ones. A restart no
  longer produces a drop that the statistics took for a meter reset.

### Changed
- The ceiling (start reference, measured monthly peak, own maximum) is decided in one
  function in `core.py`; the grid cell publishes it and the block budget reaches the
  tier from the grid cell only.
- `sensor.eb_net_cell` no longer repeats the ceiling as `peak_limit_w`; read
  `sensor.eb_net_peak_limit`.

### Tests
- `tests/test_block_counter_lag.py`, plus naming, headroom, layer meter and attribute
  guards in the existing suites.

## 0.2.2

### Security
- The schedule card escapes every value it writes into its timeline markup: the tariff
  level and type from `schedule_today` (tooltip and row label) and the kWh of the EV
  plan (tooltip) are rendered as text, never parsed as markup.

### Fixed
- The schedule card no longer stops rendering when a tariff provider publishes
  `avg_price` as a string.

### Tests
- `dashboard/card/test/schedule-card.test.mjs` (`npm test`) renders the built card with
  markup in those attributes; a source guard in `tests/test_dashboard.py` keeps every
  timeline text value behind the escape helper.

## 0.2.1

### Changed
- Sensor auto-detection reads the Energy Dashboard preferences through the energy
  integration's own manager (`homeassistant.components.energy.data`) instead of opening
  its storage file. `energy` is now listed in `after_dependencies`.

### Security
- The chain card sets the cell name, SoC, target, action and ratio with `textContent`;
  no value from the card configuration or from an entity is parsed as markup any more.
  Its colours accept hex values only.
- The flow card only accepts real colour values (`#hex`, `rgb()`/`hsl()`, `var(--…)`,
  colour names) from its configuration and escapes entity ids before they go into its
  SVG markup.
- Removed an unused helper that built HTML from entity ids.

## 0.2.0

### Added
- **Car brain** for car charger cells (`use_car_brain`, off by default). A dedicated
  charging policy with the modes `Off`, `Automatisch`, `Solar` and `Surplus`, a moving
  average of the surplus, start/stop debouncing and a minimum step per change. The mode
  can follow your own `input_select` (`charge_mode_entity`) or live in
  `select.eb_<cell>_mode`. Its tunables appear as `number.eb_<cell>_*` entities.
- **`Surplus` mode**: the home batteries get the sun first. The car waits until the
  tier (capacity-weighted SoC of the online home batteries) reaches `surplus_tier_soc`,
  then behaves exactly like `Solar`, and waits again 5 points below that value. The
  existing modes are unchanged.
- **15-minute block budget** (`block_demand_sensor`): the battery tier gets a budget for
  the rest of the current quarter hour, based on the running 15-minute average import
  that a capacity tariff bills.
- **Your own peak maximum** (`peak_max_w`, `number.eb_peak_max_w`). The import ceiling is
  now `max(peak_limit_w, monthly peak, peak_max_w)`; the maximum can only raise it.
- **Month rollover handling** (`month_peak_sensor`, `month_start_peak_policy`,
  `month_start_window_min`, `month_end_window_min`): treats the stale monthly peak that
  meters keep showing after midnight on the 1st, on both sides of the boundary.
- **Lifetime energy sensors**, published as `total_increasing` so they work in the
  Energy dashboard. House and solar energy are now counted as well.
- **Performance sensor** per cell (`sensor.eb_<cell>_performance`): how closely the
  device follows the power EB ordered.
- A dependency-free test runner, `tests/run_tests_stdlib.py`, and a parity harness for
  the car brain.

### Changed
- `energy_balancer.set_option` converts the value to the option's own type: flags
  become booleans, durations whole numbers, and mode names are checked against their
  choices. Numeric options behave exactly as before. More options can be changed live
  (see the Services page).
- A change of the car's take % or mode now acts on the next tick instead of after the
  solar debounce time.

### Dashboard (HACS review)
- The dashboard is now a Lovelace **strategy** (`strategy: type: custom:energy-balancer`).
  Its views are built from the live configuration every time it opens, through the
  `energy_balancer/dashboard` websocket command; nothing has to be regenerated.
- `generate_dashboard` is **admin only**, creates the dashboard through Home Assistant's
  own dashboards collection with only the strategy in it, and **refuses** a path that is
  already in use. It no longer writes `.storage/lovelace*` files and never changes a
  dashboard it did not create. New field `dashboard_icon`; default path `energy-balancer`.
- The cards are served from the integration folder (static path) and loaded with
  `add_extra_js_url`. Nothing is copied into `www/`, and no Lovelace resource is needed.
  The resources 0.1.0 created under `/local/energy_balancer/` are removed at startup.
- Chart.js and its date adapter are bundled; the cards no longer download code from a CDN.
- Removed the load-priority card and the diagnose button: they called services of
  another integration (SEM) that do not exist here.
- The dashboard template no longer contains entity ids of one particular installation;
  every cell, sensor and helper comes from the configuration.
- Minimum Home Assistant version is now 2024.7.0.

### Repository
- Added the copyright and licence notice of SEM, from which the cards, the dashboard
  template, the dashboard generator and the sensor detection are derived (`LICENSE`,
  `NOTICE`).
- Tests and `NAMING.md` moved to the repository root, so HACS no longer installs them.
- All code, comments and documentation are in English.

## 0.1.0

- Initial release.
