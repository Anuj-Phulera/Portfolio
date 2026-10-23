import { isPublishable, type ClaimEntry, type Ledger } from "../ledger.ts";
import { DIAL_DEFAULT_THRESHOLD, DIAL_SERIES, MODE_OBJECTS } from "../fixtures.ts";
import { html, type Html } from "../html.ts";
import { inline } from "../inline.ts";

/**
 * Instruments are rendered as complete HTML at build time. JavaScript only
 * changes state — layout, readings, filters — so every instrument still shows
 * its content with the bundle blocked or broken.
 */

interface InstrumentOptions {
  id: "mode" | "dial" | "ledger";
  index: string;
  title: string;
  caption: string;
  labNote: { real: string; simplified: string; mocked: string; source: string };
  ledger?: Ledger;
}

function frame(options: InstrumentOptions, stage: Html, controls: Html, readout: Html): Html {
  const { id, index, title, labNote } = options;
  return html`
    <section class="instrument" data-instrument="${id}" ${id === "mode" ? html`data-mode-root` : ""} ${id === "dial" ? html`data-dial-root` : ""} ${id === "ledger" ? html`data-ledger-root` : ""}>
      <div class="instrument__bar">
        <span><b>INSTRUMENT ${index}</b> · ${title}</span>
        <span class="instrument__state" data-state>${id === "mode" ? "DEMO" : "READY"}</span>
      </div>
      ${stage}
      ${readout}
      ${controls}
      <p class="instrument__caption">${inline(options.caption)}</p>
      <details class="labnote">
        <summary>Lab note — what is real, simplified and mocked</summary>
        <dl class="labnote__body">
          <div><dt>Real</dt><dd>${labNote.real}</dd></div>
          <div><dt>Simplified</dt><dd>${labNote.simplified}</dd></div>
          <div><dt>Mocked</dt><dd>${labNote.mocked}</dd></div>
          <div><dt>Source</dt><dd><code>${labNote.source}</code></dd></div>
        </dl>
      </details>
    </section>
  `;
}

export function modeInstrument(options: Omit<InstrumentOptions, "id" | "ledger">): Html {
  const stage = html`
    <div class="instrument__stage">
      <div class="stage" data-stage data-layout="codex">
        ${MODE_OBJECTS.map(
          (object) => html`
            <article class="stage__object" data-object="${object.id}" tabindex="0">
              <span class="stage__id">${object.id} · ${object.cls}</span>
              <span class="stage__title">${object.title}</span>
              <span class="stage__body">${object.body}</span>
              <span class="stage__rel">${object.relations} relations</span>
            </article>
          `,
        )}
      </div>
    </div>
  `;

  const readout = html`
    <div class="readout" role="status" aria-live="polite" data-readout>
      <span><b>READ</b> <em data-read>DEMO</em></span>
      <span><b>MODE</b> <span data-mode>CODEX</span></span>
      <span><b>CONF</b> <span data-conf>—</span></span>
    </div>
  `;

  const controls = html`
    <div class="instrument__controls">
      <span class="label" id="mode-controls">Layout</span>
      <button class="btn" type="button" data-layout-btn="codex" aria-pressed="true">Codex</button>
      <button class="btn" type="button" data-layout-btn="mosaic" aria-pressed="false">Mosaic</button>
      <button class="btn" type="button" data-layout-btn="lattice" aria-pressed="false">Lattice</button>
      <button class="btn" type="button" data-pin aria-pressed="false">Pin</button>
    </div>
  `;

  return frame({ ...options, id: "mode", title: "MODE ENGINE" }, stage, controls, readout);
}

export function dialInstrument(options: Omit<InstrumentOptions, "id" | "ledger">): Html {
  const threshold = DIAL_DEFAULT_THRESHOLD;
  const now = DIAL_SERIES[DIAL_SERIES.length - 1] ?? 0;

  const stage = html`
    <div class="instrument__stage">
      <div class="dial">
        <div class="dial__series" aria-hidden="true">
          ${DIAL_SERIES.map(
            (value, index) => html`
              <span
                class="bar"
                data-bar
                data-value="${value}"
                data-now="${index === DIAL_SERIES.length - 1 ? "true" : "false"}"
                data-below="${value < threshold ? "true" : "false"}"
              ></span>
            `,
          )}
        </div>
        <div class="dial__scale"><span>24 h ago</span><span>fixed fixture</span><span>now</span></div>
        <div class="dial__row">
          <label for="dial-threshold">Threshold</label>
          <input id="dial-threshold" type="range" min="10" max="70" step="1" value="${threshold}" data-threshold />
          <span class="dial__value"><span data-threshold-out>${threshold}</span>%</span>
        </div>
        <div class="dial__row">
          <label for="dial-pump">Pump</label>
          <div class="dial__switch">
            <button class="btn" type="button" data-auto aria-pressed="true">Auto</button>
            <button class="btn" type="button" id="dial-pump" data-pump aria-pressed="false" disabled>Pump</button>
          </div>
          <span class="dial__value" data-pump-state>ON</span>
        </div>
      </div>
    </div>
  `;

  const readout = html`
    <div class="readout" role="status" aria-live="polite" data-readout>
      <span><b>MOISTURE</b> <em data-moisture>${now}</em>%</span>
      <span><b>THRESHOLD</b> <span data-live-threshold>${threshold}</span>%</span>
      <span><b>PUMP</b> <span data-live-pump>ON</span></span>
      <span><b>WHY</b> <span data-why>${now}% is below ${threshold}%</span></span>
    </div>
  `;

  const controls = html`
    <div class="instrument__controls">
      <span class="label">State</span>
      <span class="dial__value">SIMULATED — no sensor is connected</span>
    </div>
  `;

  return frame({ ...options, id: "dial", title: "WATERING DIAL" }, stage, controls, readout);
}

export function ledgerInstrument(options: Omit<InstrumentOptions, "id"> & { ledger: Ledger }): Html {
  const { ledger } = options;
  const entries = ledger.entries;

  const stage = html`
    <div class="instrument__stage">
      <div class="ledger">
        ${entries.map(
          (entry: ClaimEntry) => html`
            <div class="ledger__row" data-ledger-row data-grade="${entry.grade}" data-blocked="${!isPublishable(entry)}">
              <span class="ledger__id">${entry.id}</span>
              <span>
                ${isPublishable(entry) ? entry.claim : entry.safe_wording}
                <span class="ledger__project">
                  ${entry.project}${isPublishable(entry) ? "" : " · not published as written"}
                </span>
              </span>
              <span class="ledger__grade" data-grade="${entry.grade}">${entry.grade}</span>
            </div>
          `,
        )}
      </div>
    </div>
  `;

  const controls = html`
    <div class="instrument__controls">
      <span class="label" id="ledger-controls">Grade</span>
      <button class="btn" type="button" data-grade-btn="all" aria-pressed="true">All</button>
      <button class="btn" type="button" data-grade-btn="V" aria-pressed="false">V</button>
      <button class="btn" type="button" data-grade-btn="P" aria-pressed="false">P</button>
      <button class="btn" type="button" data-grade-btn="U" aria-pressed="false">U</button>
      <button class="btn" type="button" data-grade-btn="A" aria-pressed="false">A</button>
      <button class="btn" type="button" data-grade-btn="X" aria-pressed="false">X</button>
    </div>
  `;

  const readout = html`
    <div class="readout" role="status" aria-live="polite" data-readout>
      <span><b>SHOWING</b> <em data-ledger-count>${entries.length}</em> of ${entries.length}</span>
      <span><b>V</b> verified · <b>P</b> partial · <b>U</b> unverifiable · <b>A</b> aspirational · <b>X</b> contradicted</span>
    </div>
  `;

  return frame({ ...options, id: "ledger", title: "CLAIMS LEDGER" }, stage, controls, readout);
}
