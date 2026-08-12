> **Note — this is a working design document, written in Dutch.**
> It records the reasoning behind the mode/action vocabulary used throughout the
> code (`core.py` refers to it by name). Sections 1-4 describe the model that is
> now live; sections 5-7 are still open questions. For user-facing documentation
> see https://jebeke65.github.io/ha-energy-balancer/concepts.html

# Naamgeving — energiesysteem

Status: **ontwerp, nog niet uitgevoerd.** Vastgelegd 2026-07-13.
Niets in de code is op basis van dit document gewijzigd.

## 1. De diagnose

Vandaag lopen zes woordenlijsten door elkaar — EB, twee fabrikanten, de actuatielaag
en twee dashboards. De onderliggende fout is niet dat er te veel woorden zijn, maar
dat **twee orthogonale assen in één enum geperst zijn**:

| huidig token | zegt eigenlijk |
|---|---|
| `consume` | EB stuurt, richting = laden |
| `produce` | EB stuurt, richting = ontladen |
| `idle` | EB stuurt, setpoint = nul |
| `autonomous` (nu: `self_consumption`) | **EB stuurt niet** — de cel regelt zelf |
| `off` | **EB stuurt niet** — de cel doet niet mee |
| `offline` | **EB kan niet sturen** — onbereikbaar |

De eerste drie zeggen *wat* er gestuurd wordt, de laatste drie *wie* er stuurt.
Daardoor staat `self_consumption` naast `idle` alsof het soortgenoten zijn, terwijl
de ene "ik bemoei me er niet mee" betekent en de andere "ik stuur actief naar nul".

Wat daaruit voortkwam, met vindplaats:

1. **`self_consumption` is een Marstek-woord** (work-mode van de Venus) dat als
   generiek systeemtoken is gaan rondlopen — `core.py` 7×. Het beschrijft bovendien
   het verkeerde: gemeten stond marstek op **−198 W** (leveren) terwijl het dashboard
   `self_consumption` toonde.
2. **Eén woord, twee rollen** — `self_consumption` is tegelijk config-*mode*
   (`params.py:71`, `config_flow.py:36`, opgeslagen in de config-entry) én runtime-*action*.
3. **Twee woordenlijsten in één `choose`-blok** —
   `blueprints/automation/energy_balancer/eb_cell_actuator.yaml:133-147`:
   ```yaml
   - conditions: "{{ action == 'consume' }}"
     sequence: !input on_charge          # input 'charge', token 'consume'
   - conditions: "{{ action == 'produce' }}"
     sequence: !input on_discharge       # input 'discharge', token 'produce'
   ```
4. **`pauze`** — een Nederlands woord tussen Engelse tokens, `actuation.py:38`.
5. **Interne tokens lekken naar de UI** — `input_select.vb_goodwe_mode_override` en
   `vb_marstek_mode_override` bieden letterlijk `off`/`self_consumption`/`smart` aan,
   met `Automatic` ertussen (dat geen mode is maar "geen override").
6. **HW lekt naar de UI** — goodwe's `general` staat op het dashboard.
7. **Status vermomd als mode** — `input_select.car_charge_mode_actual`
   (`Off`/`Charging`/`Paused`) is een waarneming, geen keuze.

## 2. Het model

Een cel heeft **twee onafhankelijke velden**, en ze staan los van elkaar:

```
modus    — het beleid dat de gebruiker kiest   ("wat mag deze cel")
actie    — wat de cel op dit moment doet       ("wat doet ze nu")   ← gemeten
```

Elke combinatie is geldig en betekenisvol. Dat is de kern:

```
GOODWE    balanced   · laadt 1224W        (EB stuurt)
MARSTEK   autonomous · ontlaadt 198W      (de cel regelt zelf)
CAR       surplus    · laadt 2481W
```

**Er zijn maar twee acties: laden en ontladen.** `idle` is geen derde actie maar
gewoon nul. `autonomous`, `off` en `offline` zijn helemaal geen acties — dat zijn
uitspraken over eigenaarschap, en die horen op de andere as.

**De actie is een waarneming, geen commando.** Ze wordt afgeleid uit het teken van
het gemeten vermogen. Dat moet ook wel: in `autonomous` stuurt EB per definitie niets,
dus er *is* geen commando om te tonen. Dit is dezelfde regel als de comment die al in
`core.py:210` staat — *meten is weten* — en precies de regel die de release-tak van de
tier schond (opgelost 2026-07-13: `rest_out` telde het autonome verbruik niet mee).

## 3. Drie stromen, elk één richting

| stroom | woorden | van → naar |
|---|---|---|
| **modus** | `off` `surplus` `charge` `discharge` `autonomous` `balanced` | gebruiker → EB. **Bereikt de hardware nooit.** |
| **beslissing** | `control` + setpoint | EB → actuator → HW |
| **actie** | laadt / ontlaadt / nul | HW (gemeten) → EB → dashboard |

### 3.1 Modus — wat de gebruiker kiest

**Live sinds 2026-07-13.**

| modus | betekenis |
|---|---|
| `off` | EB stuurt de cel niet. Wordt **wel** nog gemeten. *Semantiek nog te beslissen — zie §7.* |
| `surplus` | laadt alleen wanneer er overschot is (was: `self_consumption`) |
| `charge` | geforceerd laden, ook uit het net |
| `discharge` | geforceerd ontladen, ook bij overschot |
| `autonomous` | de cel bepaalt alles zelf; EB blijft eraf |
| `balanced` | EB stuurt, op doel-SoC en prognose (was: `smart`) |

Deze woorden zijn EB's beleidsinput. Ze gaan **niet** naar de actuator — die hoeft niet
te weten of jij `balanced` of `surplus` koos.

**Wat de geforceerde modi níét mogen overrulen:**

- **De piekruimte.** `charge` is begrensd door `rest + headroom`, niet door `headroom`.
  Trekt het huis al 500 W uit het net en is er 3500 W piekruimte, dan is er nog 3000 W
  van jou. Dit fout doen is een geforceerde modus die stilletjes je maandpiek verhoogt.
- **De SoC-grenzen** (`_charge_taper` / `_discharge_taper`) en `take_pct`.
- **`no_discharge_on_flag`.** Dat is een veiligheidsvergrendeling (leeg de thuisbatterij
  niet in de auto), geen voorkeur die een modus mag negeren.

**Gevolg voor de tier:** `is_tier` eist dat **alle** cellen op dezelfde positie `surplus`
of `balanced` zijn. Zet je goodwe op `charge`, dan valt de tier uiteen en gaan goodwe én
marstek terug naar het sequentiële pad. Verdedigbaar — een pool met een geforceerde cel is
geen pool meer — maar het moet gedocumenteerd zijn, niet ontdekt worden.

### 3.2 Beslissing — wat EB naar de actuator stuurt

```
control = eb          → voer dit setpoint uit   (+ laden, − ontladen, 0 vasthouden)
control = cell        → laat los, regel zelf
control = none        → stilzetten, doe niet mee
control = unreachable → cel overgeslagen
```

Meer krijgt de actuator niet. Dit is het volledige contract.

### 3.3 Actie — wat het dashboard toont

Afgeleid uit het gemeten vermogen: `laadt` (+), `ontlaadt` (−), `nul` (0).
Geldt voor **elke** cel, ook zon, huis en net — daar is het simpelweg het teken van
wat er gemeten wordt. Er is dus geen apart action-woord nodig voor een zonnepaneel;
dat was een schijnprobleem, ontstaan door alles in één enum te duwen.

## 4. De hardware — waar de merkwoorden thuishoren

De actuator is de **enige** plek waar een fabrikantwoord mag staan.

| beslissing | goodwe | marstek |
|---|---|---|
| `control=eb`, power > 0 | `eco_charge` + pct | `marstek_hw_charge` |
| `control=eb`, power < 0 | `eco_discharge` | `marstek_hw_discharge` |
| `control=eb`, power = 0 | **`backup`** | `marstek_hw_idle` |
| `control=cell` | `general` | `marstek_hw_release` (HW: `self_consumption`/`anti_feed`) |
| `control=none` | `backup` | `marstek_hw_idle` |

**Let op — dit is geen cosmetiek.** `control=eb, power=0` (vasthouden) en
`control=cell` (loslaten) zijn op de goodwe fysiek verschillend: `backup` versus
`general`. Ze mogen nooit samenvallen. `eco_charge 0%` is gevaarlijk — daarom is
`on_idle` ooit van `eco_discharge 0%` naar `backup` gezet. Zolang `control` en `power`
gescheiden velden zijn, kan die verwarring niet meer ontstaan; duw je ze terug in één
enum, dan wel.

Zie ook: `reference_goodwe_eco_mode_soc`, `reference_marstek_actuator_pd_fix` — de
Venus-PD draait autonoom en mag door EB nooit in `manual_mode` gezet worden.

## 5. Wat verdwijnt

- **`self_consumption`** uit de systeemlaag, volledig. Blijft alleen bestaan binnen
  de `marstek_hw_*`-scripts, als HW-woord.
- **`INTERNAL_TO_PUBLIC`** in `actuation.py` — de tabel bestond juist omdát intern en
  extern uit elkaar liepen. Spreken kern en grens dezelfde taal, dan is ze overbodig.
  Daarmee verdwijnt ook het Nederlandse **`pauze`**.
- **De scheve blueprint-inputs** (`on_charge` die op `consume` matcht).
- **De rauwe tokens op het dashboard** (`vb_*_mode_override`).

## 6. Migratie — volgorde op risico

1. **Actie en control scheiden** in `core.py` (`CellOutput`): `control` + signed power
   in plaats van één enum. Raakt `core.py`, `actuation.py`, de blueprint, 4 automations,
   de actuator-scripts, de kaarten en de tests. Geen config-migratie.
   **Risico:** mis je één consument, dan valt de actuator door zijn `choose` heen en
   stuurt hij *niets* — de batterij blijft in haar laatste stand hangen. Dus atomair,
   met grep-verificatie op nul overblijvers en de 147 tests erachteraan.
2. **`INTERNAL_TO_PUBLIC` opheffen**, blueprint-inputs gelijktrekken. Zelfde beweging.
3. **`can_autonomous` als capability** — EB mag `control=cell` niet uitsturen naar een
   cel die dat niet kent. Vandaag ontbreekt die controle: EB stuurt en hoopt.
   *Agnostisch = praat tegen een contract, niet tegen een apparaat* — dezelfde regel
   als de capability-detectie in de context engine.
4. **Modi hernoemen** naar de lijst uit §3.1. Vereist migratie van de config-entry
   (`data.cells` + `options.cells`) en `packages/energy_balancer.yaml`. Apart, met backup.
5. **Dashboardlabels** — Nederlandse presentatie (`charge` → "Laden", `surplus` →
   "Enkel bij overschot"). Eerst uitzoeken wie er op de huidige labels conditioneert.

## 7. Aannames die nog bevestiging vragen

- **`off` = EB zet de cel stil en haalt haar uit de merit-order** (§3.1). Dus niet
  "EB laat los en de cel doet maar wat" — dan zou `off` niet te onderscheiden zijn van
  `autonomous`. Vandaag mappen ze allebei op `unmanaged`, wat betekent dat `off` de cel
  *niet* stilzet. Dat is de gevaarlijkste onduidelijkheid in het huidige model.
- Een cel op `off` blijft **wel** meetellen in de keten (haar gemeten vermogen
  beïnvloedt `rest`). Anders ontstaat exact de bug van 2026-07-13: de keten belooft een
  overschot dat fysiek al opgebruikt is.
