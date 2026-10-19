> **Note — this is a working design document.**
> It records the reasoning behind the mode/action vocabulary used throughout the
> code (`core.py` refers to it by name). Sections 1-4 describe the model that is
> now live; sections 5-7 are still open questions. For user-facing documentation
> see https://jebeke65.github.io/ha-energy-balancer/concepts.html

# Naming — energy system

Status: **design, not yet implemented.** Recorded 2026-07-13.
Nothing in the code has been changed on the basis of this document.

## 1. The diagnosis

Today six vocabularies run through each other — EB, two manufacturers, the actuation
layer and two dashboards. The underlying fault is not that there are too many words, but
that **two orthogonal axes have been squeezed into one enum**:

| current token | actually says |
|---|---|
| `consume` | EB is in control, direction = charge |
| `produce` | EB is in control, direction = discharge |
| `idle` | EB is in control, setpoint = zero |
| `autonomous` (now: `self_consumption`) | **EB is not in control** — the cell regulates itself |
| `off` | **EB is not in control** — the cell does not take part |
| `offline` | **EB cannot control** — unreachable |

The first three say *what* is being controlled, the last three *who* is in control.
As a result `self_consumption` sits next to `idle` as if they were the same kind of
thing, while one means "I stay out of it" and the other "I actively drive to zero".

What came out of that, with locations:

1. **`self_consumption` is a Marstek word** (a work mode of the Venus) that has started
   circulating as a generic system token — `core.py` 7×. On top of that it describes the
   wrong thing: marstek was measured at **−198 W** (delivering) while the dashboard
   showed `self_consumption`.
2. **One word, two roles** — `self_consumption` is both a config *mode*
   (`params.py:71`, `config_flow.py:36`, stored in the config entry) and a runtime *action*.
3. **Two vocabularies in one `choose` block** —
   `blueprints/automation/energy_balancer/eb_cell_actuator.yaml:133-147`:
   ```yaml
   - conditions: "{{ action == 'consume' }}"
     sequence: !input on_charge          # input 'charge', token 'consume'
   - conditions: "{{ action == 'produce' }}"
     sequence: !input on_discharge       # input 'discharge', token 'produce'
   ```
4. **`pauze`** — a Dutch word among English tokens, `actuation.py:38`.
5. **Internal tokens leak into the UI** — `input_select.vb_goodwe_mode_override` and
   `vb_marstek_mode_override` literally offer `off`/`self_consumption`/`smart`,
   with `Automatic` in between (which is not a mode but "no override").
6. **Hardware leaks into the UI** — goodwe's `general` is shown on the dashboard.
7. **Status disguised as a mode** — `input_select.car_charge_mode_actual`
   (`Off`/`Charging`/`Paused`) is an observation, not a choice.

## 2. The model

A cell has **two independent fields**, and they are separate from each other:

```
mode     — the policy the user chooses      ("what may this cell do")
action   — what the cell is doing right now ("what is it doing now")   ← measured
```

Every combination is valid and meaningful. That is the core:

```
GOODWE    balanced   · charging 1224W       (EB in control)
MARSTEK   autonomous · discharging 198W     (the cell regulates itself)
CAR       surplus    · charging 2481W
```

**There are only two actions: charge and discharge.** `idle` is not a third action but
simply zero. `autonomous`, `off` and `offline` are not actions at all — they are
statements about ownership, and those belong on the other axis.

**The action is an observation, not a command.** It is derived from the sign of the
measured power. It has to be: in `autonomous` EB by definition controls nothing, so there
*is* no command to show. This is the same rule as the comment already in
`core.py:210` — *measuring is knowing* — and exactly the rule the tier's release branch
broke (fixed 2026-07-13: `rest_out` did not count the autonomous consumption).

## 3. Three flows, each in one direction

| flow | words | from → to |
|---|---|---|
| **mode** | `off` `surplus` `charge` `discharge` `autonomous` `balanced` | user → EB. **Never reaches the hardware.** |
| **decision** | `control` + setpoint | EB → actuator → HW |
| **action** | charging / discharging / zero | HW (measured) → EB → dashboard |

### 3.1 Mode — what the user chooses

**Live since 2026-07-13.**

| mode | meaning |
|---|---|
| `off` | EB does not control the cell. It **is** still measured. *Semantics still to be decided — see §7.* |
| `surplus` | charges only when there is a surplus (was: `self_consumption`) |
| `charge` | forced charging, also from the grid |
| `discharge` | forced discharging, also when there is a surplus |
| `autonomous` | the cell decides everything itself; EB stays out of it |
| `balanced` | EB controls, on target SoC and forecast (was: `smart`) |

These words are EB's policy input. They do **not** go to the actuator — it does not need
to know whether you chose `balanced` or `surplus`.

**What the forced modes may NOT override:**

- **The peak headroom.** `charge` is bounded by `rest + headroom`, not by `headroom`.
  If the house already draws 500 W from the grid and there is 3500 W of peak headroom,
  3000 W is still yours. Getting this wrong is a forced mode that silently raises your
  monthly peak.
- **The SoC limits** (`_charge_taper` / `_discharge_taper`) and `take_pct`.
- **`no_discharge_on_flag`.** That is a safety interlock (do not empty the home battery
  into the car), not a preference a mode may ignore.

**Consequence for the tier:** `is_tier` requires **all** cells at the same position to be
`surplus` or `balanced`. Put goodwe on `charge` and the tier falls apart, and goodwe and
marstek both go back to the sequential path. Defensible — a pool with a forced cell is no
longer a pool — but it has to be documented, not discovered.

### 3.2 Decision — what EB sends to the actuator

```
control = eb          → execute this setpoint   (+ charge, − discharge, 0 hold)
control = cell        → let go, regulate yourself
control = none        → stand still, do not take part
control = unreachable → cell skipped
```

The actuator gets nothing more. This is the complete contract.

### 3.3 Action — what the dashboard shows

Derived from the measured power: `charging` (+), `discharging` (−), `zero` (0).
Applies to **every** cell, including solar, house and grid — there it is simply the sign
of what is measured. So no separate action word is needed for a solar panel; that was a
non-problem, created by pushing everything into one enum.

## 4. The hardware — where the brand words belong

The actuator is the **only** place where a manufacturer word may appear.

| decision | goodwe | marstek |
|---|---|---|
| `control=eb`, power > 0 | `eco_charge` + pct | `marstek_hw_charge` |
| `control=eb`, power < 0 | `eco_discharge` | `marstek_hw_discharge` |
| `control=eb`, power = 0 | **`backup`** | `marstek_hw_idle` |
| `control=cell` | `general` | `marstek_hw_release` (HW: `self_consumption`/`anti_feed`) |
| `control=none` | `backup` | `marstek_hw_idle` |

**Note — this is not cosmetic.** `control=eb, power=0` (hold) and `control=cell`
(let go) are physically different on the goodwe: `backup` versus `general`. They must
never coincide. `eco_charge 0%` is dangerous — which is why `on_idle` was once moved from
`eco_discharge 0%` to `backup`. As long as `control` and `power` are separate fields, that
confusion can no longer arise; push them back into one enum and it can.

See also: `reference_goodwe_eco_mode_soc`, `reference_marstek_actuator_pd_fix` — the
Venus PD runs autonomously and must never be put into `manual_mode` by EB.

## 5. What disappears

- **`self_consumption`** from the system layer, completely. It only remains inside the
  `marstek_hw_*` scripts, as a hardware word.
- **`INTERNAL_TO_PUBLIC`** in `actuation.py` — the table existed precisely because
  internal and external had drifted apart. Once core and boundary speak the same
  language, it is redundant. With it the Dutch **`pauze`** disappears too.
- **The skewed blueprint inputs** (`on_charge` matching `consume`).
- **The raw tokens on the dashboard** (`vb_*_mode_override`).

## 6. Migration — in order of risk

1. **Separate action and control** in `core.py` (`CellOutput`): `control` + signed power
   instead of one enum. Touches `core.py`, `actuation.py`, the blueprint, 4 automations,
   the actuator scripts, the cards and the tests. No config migration.
   **Risk:** miss one consumer and the actuator falls through its `choose` and sends
   *nothing* — the battery stays stuck in its last state. So atomically, with grep
   verification down to zero leftovers and the 147 tests afterwards.
2. **Remove `INTERNAL_TO_PUBLIC`**, align the blueprint inputs. Same move.
3. **`can_autonomous` as a capability** — EB must not send `control=cell` to a cell that
   does not know it. Today that check is missing: EB sends and hopes.
   *Agnostic = talk to a contract, not to a device* — the same rule as the capability
   detection in the context engine.
4. **Rename the modes** to the list in §3.1. Requires migrating the config entry
   (`data.cells` + `options.cells`) and `packages/energy_balancer.yaml`. Separately, with
   a backup.
5. **Dashboard labels** — Dutch presentation (`charge` → "Laden", `surplus` →
   "Enkel bij overschot"). First find out who conditions on the current labels.

## 7. Assumptions that still need confirmation

- **`off` = EB stops the cell and takes it out of the merit order** (§3.1). So not
  "EB lets go and the cell does whatever it likes" — then `off` would be
  indistinguishable from `autonomous`. Today both map to `unmanaged`, which means `off`
  does *not* stop the cell. That is the most dangerous ambiguity in the current model.
- A cell on `off` **does** keep counting in the chain (its measured power affects
  `rest`). Otherwise exactly the bug of 2026-07-13 arises: the chain promises a surplus
  that has already been used up physically.
