import type { Block } from "../../content/types.ts";
import { INSTRUMENTS } from "../../content/instruments.ts";
import { GRADE_MEANING } from "../fixtures.ts";
import { html, type Html } from "../html.ts";
import { inline } from "../inline.ts";
import { cite, type Ledger } from "../ledger.ts";
import { dialInstrument, ledgerInstrument, modeInstrument } from "./instruments.ts";

const GRADE_WORD: Record<string, string> = {
  V: "verified",
  P: "partial",
  U: "unverifiable",
  A: "aspirational",
  X: "contradicted",
};

export interface BlockContext {
  ledger: Ledger;
}

function instrument(id: "mode" | "dial" | "ledger", caption: string, ledger: Ledger): Html {
  const meta = INSTRUMENTS[id];
  const options = { index: meta.index, title: meta.title, caption, labNote: meta.labNote };
  if (id === "mode") return modeInstrument(options);
  if (id === "dial") return dialInstrument(options);
  return ledgerInstrument({ ...options, ledger });
}

function renderBlock(block: Block, ctx: BlockContext): Html {
  switch (block.kind) {
    case "lede":
      return html`<p class="lede">${inline(block.text)}</p>`;

    case "prose":
      return html`<div class="prose"><p>${inline(block.text)}</p></div>`;

    case "receipt": {
      const entry = cite(ctx.ledger, block.claim);
      return html`
        <details class="receipt" id="${entry.id}" data-claim="${entry.id}">
          <summary>
            <span>Evidence · ${entry.id} · ${GRADE_WORD[entry.grade] ?? entry.grade}</span>
            ${block.note ? html`<span class="receipt__note">${block.note}</span>` : ""}
          </summary>
          <div class="receipt__body">
            <p class="receipt__wording">${inline(entry.safe_wording)}</p>
            <div class="receipt__evidence">
              ${entry.evidence.map((line) => html`<span>${line}</span>`)}
            </div>
            <p class="receipt__meta">
              <span class="receipt__grade">Grade ${entry.grade} — ${GRADE_MEANING[entry.grade] ?? ""}</span>
              <span>Public use ${entry.public_use}</span>
              <span>Reviewed ${entry.reviewed}</span>
              <span>Source ${entry.source}</span>
            </p>
          </div>
        </details>
      `;
    }

    case "facts":
      return html`
        <div class="facts">
          <p class="facts__title">${block.title}</p>
          <dl>
            ${block.rows.map(
              ([key, value]) => html`
                <div class="facts__row"><dt>${key}</dt><dd>${value}</dd></div>
              `,
            )}
          </dl>
        </div>
      `;

    case "instrument":
      return instrument(block.id, block.caption, ctx.ledger);

    case "quote":
      return html`
        <figure class="pullquote">
          <blockquote><p>${inline(block.text)}</p></blockquote>
          <figcaption><cite>${block.cite}</cite></figcaption>
        </figure>
      `;

    case "source":
      return html`
        <figure class="source">
          <p class="source__file">${block.file}</p>
          <pre><code>${block.lines.join("\n")}</code></pre>
          <figcaption>${block.caption}</figcaption>
        </figure>
      `;

    case "files":
      return html`
        <div class="files">
          <p class="facts__title">${block.title}</p>
          <ul>
            ${block.rows.map(
              ([path, note]) => html`<li><code>${path}</code><span>${note}</span></li>`,
            )}
          </ul>
        </div>
      `;

    case "list":
      return html`
        <div class="list">
          <p class="list__title">${block.title}</p>
          <ol>
            ${block.items.map((item) => html`<li><span>${inline(item)}</span></li>`)}
          </ol>
        </div>
      `;

    case "aside":
      return html`
        <div class="aside">
          <p class="aside__label">${block.label}</p>
          <p>${inline(block.text)}</p>
        </div>
      `;

    case "next":
      return html`
        <div class="next">
          <p class="label">Next</p>
          <p>${inline(block.text)}</p>
        </div>
      `;
  }
}

export function renderBlocks(blocks: Block[], ctx: BlockContext): Html {
  return html`<div class="flow">${blocks.map((block) => renderBlock(block, ctx))}</div>`;
}

/** Every ledger id a page cites, with the page it came from. Used by the gate. */
export function collectCitations(blocks: Block[], where: string): { where: string; ids: string[] } {
  const ids = blocks.filter((b) => b.kind === "receipt").map((b) => (b as { claim: string }).claim);
  return { where, ids };
}
