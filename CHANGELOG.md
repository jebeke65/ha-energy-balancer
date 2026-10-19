# Changelog

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
