class EBChainCard extends HTMLElement {
  set hass(hass) {
    this._hass = hass;
    const config = this.config || {};
    const cells = config.cells || [
      { id: "solar", name: "SOLAR" },
      { id: "house", name: "HOME" },
      { id: "car_charger", name: "CAR CHARGER" },
      { id: "goodwe", name: "GOODWE" },
      { id: "marstek", name: "MARSTEK" },
      { id: "net", name: "NET" },
    ];
    const prefix = config.entity_prefix || "sensor.eb_";

    // A cell entry may be an array → those cells share a position (tier),
    // rendered side by side. Normalize to rows; flat = all cells in order.
    const rows = cells.map(c => Array.isArray(c) ? c.slice() : [c]);
    const flat = rows.reduce((acc, r) => acc.concat(r), []);

    // --- Configurable colors by power sign + auto/manual border ---
    // consumption = positive power, production = negative, idle ≈ 0.
    const _c = config.colors || {};
    const COL = {
      consumption: _c.consumption || "#ff9800",
      production:  _c.production  || "#4caf50",
      idle:        _c.idle        || "#888888",
      offline:     _c.offline     || "#f44336",
      autoBorder:  _c.auto_border   || null,
      manualBorder: _c.manual_border || null,
    };
    const POWER_TH = config.power_threshold != null ? config.power_threshold : 50;
    const BG_OP = config.background_opacity != null ? config.background_opacity : 0.16;
    const AUTO_ATTR = (config.auto && config.auto.attribute) || null;
    const _hex2rgba = (hex, a) => {
      let h = String(hex).replace("#", "");
      if (h.length === 3) h = h.split("").map(x => x + x).join("");
      const n = parseInt(h, 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    };
    // Classify by action (semantically correct per cell), with the measured
    // sign as fallback for autonomous / unknown (battery: + = charge).
    const _signColor = (w, action) => {
      if (action === "offline") return COL.offline;
      if (action === "consume" || action === "import") return COL.consumption;
      if (action === "produce" || action === "export") return COL.production;
      if (action === "idle" || action === "off") return COL.idle;
      if (Math.abs(w) < POWER_TH) return COL.idle;
      return w > 0 ? COL.consumption : COL.production;
    };
    // Auto/manual per cell. Source = per-cell `auto_entity` OR global
    // `auto.attribute` (truthy = automatic). Returns true/false, or null when
    // no source is configured (then the border just follows the power sign).
    const _truthy = v => !(v === false || v == null ||
      ["off", "false", "0", "", "unavailable", "unknown"].includes(String(v).toLowerCase()));
    const _isAuto = (attrs, cell) => {
      if (cell.auto_entity) {
        const e = hass.states[cell.auto_entity];
        return e ? _truthy(e.state) : null;
      }
      if (AUTO_ATTR && attrs[AUTO_ATTR] !== undefined) return _truthy(attrs[AUTO_ATTR]);
      return null;
    };

    // Build DOM once
    if (!this._built) {
      this.innerHTML = "";
      const style = document.createElement("style");
      style.textContent = `
        .eb-connector-line {
          position: absolute; left: 4px; top: 0; bottom: 0;
          width: 2px; background: #444;
        }
        .eb-dot {
          position: absolute; left: 1px; top: 0;
          width: 8px; height: 8px; border-radius: 50%;
          will-change: transform;
        }
        .eb-dot.down { animation: ebmove var(--eb-speed, 1.5s) linear infinite; }
        .eb-dot.up { animation: ebmove var(--eb-speed, 1.5s) linear infinite reverse; }
        @keyframes ebmove { from { transform: translateY(0); } to { transform: translateY(42px); } }
        .eb-spark { opacity: 0.8; }
      `;
      this.appendChild(style);

      const card = document.createElement("ha-card");
      const wrap = document.createElement("div");
      wrap.style.padding = "8px";
      card.appendChild(wrap);
      this.appendChild(card);

      this._refs = {};
      this._tierTags = [];
      // Cells that sit inside a TIER frame. The take-ratio is a per-cell cap and
      // is not meaningful on a tier member — the pool splits its power pro rata,
      // so the member's own slider is not what decides its share.
      this._tierMembers = new Set();
      this._history = {};
      this._lastHistoryFetch = 0;

      for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        const isTier = row.length > 1;

        // Row container — tier = boxes side by side inside a dashed frame.
        const rowEl = document.createElement("div");
        if (isTier) {
          rowEl.style.cssText = "display:flex;gap:8px;border:1px dashed #555;border-radius:10px;padding:6px;position:relative";
          const tag = document.createElement("div");
          tag.textContent = "TIER";
          tag.style.cssText = "position:absolute;top:-7px;left:10px;background:#1c1c1c;color:#888;font-size:9px;padding:0 4px;letter-spacing:1px";
          rowEl.appendChild(tag);
          this._tierTags.push({ tag, layer: `${prefix}layer_${row.map(x => x.id).join("_")}` });
          for (const x of row) this._tierMembers.add(x.id);
        }
        wrap.appendChild(rowEl);

        for (let c = 0; c < row.length; c++) {
          const id = row[c].id;

          const box = document.createElement("div");
          box.style.cssText = "flex:1;min-width:0;border-radius:8px;background:#2a2a2a;padding:8px;border:2px solid #666";
          box.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px">
              <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:1px">
                <div><span class="eb-name" style="color:#fff;font-weight:bold;font-size:14px"></span></div>
                <div class="eb-action" style="font-size:12px"></div>
                <div class="eb-meas" style="color:#fff;font-size:16px;font-weight:bold"></div>
                <div class="eb-reason" style="color:#888;font-size:9px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis"></div>
              </div>
              <div style="flex:1;height:52px;min-width:0" class="eb-graph-wrap">
                <svg class="eb-spark" width="100%" height="52" preserveAspectRatio="none"></svg>
              </div>
            </div>`;
          rowEl.appendChild(box);

          const spark = box.querySelector(".eb-spark");
          const meas = box.querySelector(".eb-meas");
          spark.style.cursor = "pointer";
          meas.style.cursor = "pointer";

          const fireMoreInfo = () => {
            const entityId = this._refs[id] && this._refs[id].sourceSensor
              ? this._refs[id].sourceSensor
              : `${prefix}${id}`;
            this.dispatchEvent(new CustomEvent("hass-more-info", {
              bubbles: true, composed: true, detail: { entityId }
            }));
          };
          spark.addEventListener("click", fireMoreInfo);
          meas.addEventListener("click", fireMoreInfo);

          this._refs[id] = {
            box,
            name: box.querySelector(".eb-name"),
            action: box.querySelector(".eb-action"),
            meas,
            reason: box.querySelector(".eb-reason"),
            spark,
            sourceSensor: null,
          };
        }

        // Connector after the row (except the last). Driven by the row's last
        // cell — its rest_out flows to the next position. A tier shows ONE
        // connector below it, none between its side-by-side cells.
        if (r < rows.length - 1) {
          const lastId = row[row.length - 1].id;
          const conn = document.createElement("div");
          conn.style.cssText = "display:flex;padding:0 16px;gap:10px;height:42px";
          conn.innerHTML = `
            <div style="width:10px;position:relative">
              <div class="eb-connector-line"></div>
              <div class="eb-dot" style="display:none"></div>
            </div>
            <div style="display:flex;flex-direction:column;justify-content:center;flex:1">
              <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:600">
                <span class="eb-rest"></span>
                <span class="eb-hd" style="color:#ffb74d"></span>
              </div>
              <div style="display:flex;justify-content:space-between;font-size:12px;margin-top:3px">
                <span class="eb-fc" style="color:#80cbc4"></span>
                <span class="eb-verm" style="color:#ffb74d"></span>
              </div>
            </div>`;
          wrap.appendChild(conn);

          this._refs[lastId].conn = {
            dot: conn.querySelector(".eb-dot"),
            rest: conn.querySelector(".eb-rest"),
            hd: conn.querySelector(".eb-hd"),
            fc: conn.querySelector(".eb-fc"),
            verm: conn.querySelector(".eb-verm"),
          };
        }
      }
      this._built = true;
    }

    // Fetch history every 60s
    const now = Date.now();
    if (now - this._lastHistoryFetch > 60000) {
      this._lastHistoryFetch = now;
      this._fetchHistory(hass, flat, prefix);
    }

    // Update values only
    for (let i = 0; i < flat.length; i++) {
      const cell = flat[i];
      const id = cell.id;
      const name = cell.name || id.toUpperCase();
      const entity = hass.states[`${prefix}${id}`];
      const ref = this._refs[id];
      if (!entity || !ref) continue;

      const a = entity.attributes;
      const action = a.action || "?";
      const meas = Math.round(a.measured_w || 0);
      const color = _signColor(meas, action);
      const ro = Math.round(a.rest_out_w || 0);
      const hd = Math.round(a.headroom_w || 0);
      const fcOut = Math.round((a.forecast_out_wh || 0) / 10) / 100;
      // take_pct is the cap EB applies WHEN IT STEERS. So show it only while EB is
      // actually steering (control === "eb"). Next to `autonomous` the cell runs on
      // its own regulator and ignores the slider entirely — printing "100%" there
      // claims a limit that is not being applied to anything.
      // `?? ` and not `|| `: a slider at 0 means the cell is blocked, and `0 || 100`
      // would have rendered that as "100%" — the exact opposite of the truth.
      const takeRaw = Number(a.take_pct ?? NaN);
      const showTake = Number.isFinite(takeRaw)
        && String(a.control || "") === "eb"          // EB is actually steering
        && !this._tierMembers.has(id);               // ...and it is not a tier member
      const takeStr = showTake
        ? ` <span style="color:#888;font-size:11px">(Ratio: ${Math.round(takeRaw)}%)</span>`
        : "";
      const socStr = a.soc != null ? ` ${Math.round(a.soc)}%` : "";
      const targetStr = a.target_soc != null ? ` (t:${Math.round(a.target_soc)}%)` : "";
      const reason = a.reason || "";

      // background = power sign (tint over dark base); border = auto/manual
      // (or the power sign when no auto-source is configured).
      ref.box.style.background = `linear-gradient(${_hex2rgba(color, BG_OP)}, ${_hex2rgba(color, BG_OP)}), #2a2a2a`;
      const auto = _isAuto(a, cell);
      ref.box.style.borderColor =
        (auto === true && COL.autoBorder) ? COL.autoBorder
        : (auto === false && COL.manualBorder) ? COL.manualBorder
        : color;
      ref.name.innerHTML = `${name}${socStr}<span style="color:#888;font-size:11px;font-weight:normal">${targetStr}</span>`;
      ref.action.innerHTML = `<span style="color:${color}">${action}</span>${takeStr}`;
      ref.meas.textContent = `${meas}W`;
      ref.meas.style.color = color;
      ref.reason.textContent = reason;

      ref.sourceSensor = a.source_sensor || null;

      // Draw sparkline if history available
      this._drawSparkline(ref.spark, id, color, meas);

      // Connector
      if (ref.conn) {
        const flowDown = ro > 50;
        const flowUp = ro < -50;
        const flowColor = flowDown ? "#81c784" : flowUp ? "#f44336" : "#444";
        const arrow = flowDown ? "▼" : flowUp ? "▲" : "•";
        const dot = ref.conn.dot;

        ref.conn.rest.textContent = `${arrow} ${ro}W rest`;
        ref.conn.rest.style.color = flowColor;
        ref.conn.hd.textContent = `▲ ${hd}W headroom`;
        ref.conn.fc.textContent = `${fcOut} kWh forecast`;
        ref.conn.verm.textContent = `${Math.round(a.successor_power_w || 0)}W vermogen`;

        if (flowDown || flowUp) {
          const newDir = flowDown ? "down" : "up";
          if (dot.dataset.dir !== newDir) {
            dot.className = `eb-dot ${newDir}`;
            dot.dataset.dir = newDir;
          }
          dot.style.background = flowColor;
          const absW = Math.abs(ro);
          const dur = Math.max(500, Math.min(3000, Math.round(3000 - (absW / 5000) * 2500)));
          const curSpeed = dot.dataset.speed || "0";
          if (Math.abs(dur - parseInt(curSpeed)) > dur * 0.2 || !dot.dataset.speed) {
            dot.style.setProperty("--eb-speed", `${dur}ms`);
            dot.dataset.speed = dur;
          }
          dot.style.display = "";
        } else {
          dot.style.display = "none";
          dot.dataset.dir = "";
        }
      }
    }

    // Tier frame label: show the cap-weighted tier SoC + target.
    for (const t of this._tierTags) {
      const e = hass.states[t.layer];
      if (!e) continue;
      const s = e.attributes.soc, tg = e.attributes.target_soc;
      const socTxt = s != null ? ` ${Math.round(s)}%` : "";
      const tgTxt = tg != null ? ` (t:${Math.round(tg)}%)` : "";
      t.tag.textContent = `TIER${socTxt}${tgTxt}`;
    }
  }

  async _fetchHistory(hass, cells, prefix) {
    const end = new Date().toISOString();
    const start = new Date(Date.now() - 3 * 3600 * 1000).toISOString();

    for (const cell of cells) {
      // Use the source_sensor attribute (has real history) instead of eb_ sensor
      const ebEntity = hass.states[`${prefix}${cell.id}`];
      const sourceSensor = ebEntity && ebEntity.attributes.source_sensor;
      if (!sourceSensor) continue;

      try {
        const resp = await hass.callApi(
          "GET",
          `history/period/${start}?end_time=${end}&filter_entity_id=${sourceSensor}&minimal_response&no_attributes`
        );
        if (resp && resp[0]) {
          this._history[cell.id] = resp[0]
            .map(s => ({
              v: parseFloat(s.state !== undefined ? s.state : s.s),
              t: new Date(s.last_changed || s.lu || 0).getTime()
            }))
            .filter(e => !isNaN(e.v) && e.t > 0);
        }
      } catch (e) {
        // History fetch failed — leave sparkline empty
      }
    }
  }

  _drawSparkline(svg, cellId, color, currentVal) {
    const raw = this._history[cellId] || [];
    const now = Date.now();
    const tStart = now - 3 * 3600 * 1000;
    // Append current value — even 1 history point + current is enough to draw
    const entries = [...raw, { v: currentVal, t: now }];
    if (entries.length < 2) { svg.innerHTML = ""; return; }

    const values = entries.map(e => e.v);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const w = svg.getBoundingClientRect().width || svg.clientWidth || 140;
    const h = 52;
    const padL = 32;  // left margin for Y labels
    const padR = 2;
    const padT = 2;
    const padB = 12;  // bottom margin for X labels
    const gw = w - padL - padR;
    const gh = h - padT - padB;

    // Map data to coordinates
    const points = entries.map(e => {
      const x = padL + ((e.t - tStart) / (3 * 3600 * 1000)) * gw;
      const y = padT + ((max - e.v) / range) * gh;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    // Zero line
    let zeroLine = "";
    if (min < 0 && max > 0) {
      const zy = padT + ((max - 0) / range) * gh;
      zeroLine = `<line x1="${padL}" y1="${zy.toFixed(1)}" x2="${w - padR}" y2="${zy.toFixed(1)}" stroke="#555" stroke-width="0.5" stroke-dasharray="3,3"/>
        <text x="${padL - 2}" y="${zy.toFixed(1)}" fill="#666" font-size="7" text-anchor="end" dominant-baseline="middle">0</text>`;
    }

    // Y-axis labels (max, min)
    const yMax = `<text x="${padL - 2}" y="${padT + 4}" fill="#888" font-size="7" text-anchor="end">${Math.round(max)}W</text>`;
    const yMin = `<text x="${padL - 2}" y="${h - padB}" fill="#888" font-size="7" text-anchor="end">${Math.round(min)}W</text>`;

    // X-axis: hour marks
    let xLabels = "";
    const nowDate = new Date(now);
    for (let hBack = 0; hBack <= 3; hBack++) {
      const hourTs = new Date(nowDate);
      hourTs.setMinutes(0, 0, 0);
      hourTs.setHours(hourTs.getHours() - hBack);
      const ts = hourTs.getTime();
      if (ts >= tStart && ts <= now) {
        const x = padL + ((ts - tStart) / (3 * 3600 * 1000)) * gw;
        const label = hourTs.getHours().toString().padStart(2, "0") + ":00";
        xLabels += `<line x1="${x.toFixed(1)}" y1="${padT}" x2="${x.toFixed(1)}" y2="${h - padB}" stroke="#333" stroke-width="0.5"/>`;
        xLabels += `<text x="${x.toFixed(1)}" y="${h - 2}" fill="#888" font-size="7" text-anchor="middle">${label}</text>`;
      }
    }

    // Fill area
    const fillPoints = `${padL},${h - padB} ${points.join(" ")} ${w - padR},${h - padB}`;

    svg.innerHTML = `
      ${xLabels}
      ${zeroLine}
      ${yMax}${yMin}
      <polygon points="${fillPoints}" fill="${color}" opacity="0.15"/>
      <polyline points="${points.join(" ")}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linejoin="round"/>
    `;
  }

  setConfig(config) {
    this.config = config;
    this._built = false;
  }

  getCardSize() {
    const cells = (this.config && this.config.cells) ? this.config.cells.length : 6;
    return Math.ceil(cells * 1.5);
  }

  static getStubConfig() {
    return {
      entity_prefix: "sensor.eb_",
      cells: [
        { id: "solar", name: "SOLAR" },
        { id: "house", name: "HOME" },
        { id: "car_charger", name: "CAR CHARGER" },
        [ { id: "goodwe", name: "GOODWE" }, { id: "marstek", name: "MARSTEK" } ],
        { id: "net", name: "NET" },
      ]
    };
  }
}

customElements.define("eb-chain-card", EBChainCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "eb-chain-card",
  name: "Energy Balancer Chain",
  description: "Visualises the energy balancer cell chain with flows between cells",
  preview: true,
});
