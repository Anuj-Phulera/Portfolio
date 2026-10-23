import { INSTRUMENTS } from "../../content/instruments.ts";
import { PROJECTS, projectBySlug } from "../../content/projects.ts";
import { COUNTS, SITE } from "../../content/site.ts";
import type { Page } from "../../content/pages.ts";
import type { Project } from "../../content/types.ts";
import { html, type Html } from "../html.ts";
import { inline } from "../inline.ts";
import type { Ledger } from "../ledger.ts";
import { renderBlocks, type BlockContext } from "./blocks.ts";
import { modeInstrument } from "./instruments.ts";
import { stamp, statusLegend } from "./ui.ts";

export interface RenderContext extends BlockContext {
  ledger: Ledger;
}

const HOME_COPY = {
  kicker: "BENCH 01 · 2026",
  counts: `${COUNTS.entries} ENTRIES · ${COUNTS.repositories} REPOSITORIES`,
  headline: "I build systems, then publish what is true about them.",
  status:
    "Two built, one partial, one withdrawn, one unbuilt, one withheld — and every one of them has something unfinished, written next to the claim it undermines.",
  prose:
    "The bench is not decoration. The instrument below is a working reduction of one project's decision engine: it reads how you move through three objects and changes their arrangement. Where an object is a reduction, its lab note says what is real, what is simplified, and what is mocked.",
} as const;

export function renderHome(ctx: RenderContext): Html {
  return html`
    <section class="hero">
      <div class="shell">
        <div class="hero__grid">
          <div>
            <div class="hero__kicker">
              <span class="label">${HOME_COPY.kicker}</span>
              <span class="label">${HOME_COPY.counts}</span>
            </div>
            <h1>${HOME_COPY.headline}</h1>
            <p class="hero__status">${HOME_COPY.status}</p>
            <div class="prose mt-4">
              <p>${HOME_COPY.prose}</p>
            </div>
          </div>
          <div class="hero__aside">
            ${modeInstrument({
              index: INSTRUMENTS.mode.index,
              title: INSTRUMENTS.mode.title,
              caption:
                "The decision engine from STRATA, reduced to three objects. It reads dwell, revisits and coverage; it explains the read; it can be pinned. The real engine is in `src/engine/decide.ts`.",
              labNote: INSTRUMENTS.mode.labNote,
            })}
          </div>
        </div>
      </div>
    </section>

    <section class="section section--tight" aria-labelledby="bench-heading">
      <div class="shell">
        <div class="bench__head">
          <h2 id="bench-heading" class="label">Entries</h2>
          <span class="label">Status first, always</span>
        </div>
        <div class="bench">
          ${PROJECTS.map(
            (project) => html`
              <a class="bench__row" href="/work/${project.slug}/">
                <span class="bench__index">${project.index}</span>
                <span class="bench__name">${project.name}</span>
                <span class="bench__tagline">${project.tagline}</span>
                ${stamp(project.status)}
                <span class="bench__arrow" aria-hidden="true">→</span>
              </a>
            `,
          )}
        </div>
      </div>
    </section>

    <aside class="interlude" aria-labelledby="interlude-heading">
      <div class="shell">
        <div class="interlude__grid">
          <div>
            <p class="label">The pattern</p>
            <h2 id="interlude-heading">Every number was right. Eight claims about how the work felt were not.</h2>
          </div>
          <div>
            <p>
              An audit of thirty-six claims across eight repositories found the same failure everywhere:
              countable things were accurate, experiential things were aspirational. This site is built so
              that a claim cannot get here without its evidence.
            </p>
            <p class="mt-4">
              <a href="/notes/the-pattern/">Read the audit →</a>
            </p>
          </div>
        </div>
      </div>
    </aside>

    <section class="section" aria-labelledby="cloth-heading">
      <div class="shell">
        <div class="grid">
          <div class="col-text">
            <h2 id="cloth-heading" class="label mb-3">The next object</h2>
          </div>
        </div>
        <details class="cloth">
          <summary>
            <span class="cloth__tag">
              <span class="label">Entry 010</span>
              <span class="cloth__hint">Lift the cloth</span>
            </span>
          </summary>
          <div class="cloth__plate">
            <h2>Entry 010 — unwritten</h2>
            <div class="prose">
              <p>
                There is a next thing and it is not ready to be called a product. What is ready is the list
                underneath, and the date it becomes true.
              </p>
            </div>
            <div class="list">
              <ol>
                <li><span>The STRATA live check running in CI, so the adaptation claim stops depending on my memory.</span></li>
                <li><span>One recorded week of farm payloads, replayed under a <code>REPLAY</code> label.</span></li>
                <li><span>Three shader stills from RESONATE, rendered locally and labelled as stills.</span></li>
              </ol>
            </div>
            <p class="prose">
              If you want to know when it lands, write to
              <a href="mailto:${SITE.email}">${SITE.email}</a>. One action, no form.
            </p>
          </div>
        </details>
      </div>
    </section>
  `;
}

export function renderEntries(): Html {
  return html`
    <section class="section">
      <div class="shell">
        <p class="label">Index</p>
        <h1 class="h-page">Entries</h1>
        <p class="lede mt-4">
          Six entries, eight repositories. The status is the first thing to read, not the last.
        </p>
        <div class="entries">
          ${PROJECTS.map(
            (project) => html`
              <a class="entries__row" href="/work/${project.slug}/">
                <span class="mono">${project.index}</span>
                <span class="entries__name">${project.name}</span>
                <span class="entries__tag">${project.tagline}</span>
                ${stamp(project.status)}
              </a>
            `,
          )}
        </div>
        <div class="mt-7">
          ${statusLegend()}
        </div>
        <p class="prose mt-6">
          Nothing here is described as live unless a deployment was verified, and most were not. Two of these
          projects were once presented as more finished than they were; the entries say which and why.
        </p>
        <p class="prose">
          The audit behind the statuses is in <a href="/notes/the-pattern/">the pattern</a>, and the site's own
          build is in the <a href="/colophon/">colophon</a>.
        </p>
      </div>
    </section>
  `;
}

export function renderProject(project: Project, ctx: RenderContext): Html {
  const next = project.nextSlug ? projectBySlug(project.nextSlug) : undefined;

  return html`
    <article>
      <header class="entry-head">
        <div class="shell">
          <div class="entry-head__meta">
            <span class="entry-head__index">ENTRY ${project.index} / ${String(PROJECTS.length).padStart(2, "0")}</span>
            ${stamp(project.status)}
          </div>
          <h1>${project.name}</h1>
          <p class="entry-head__tagline">${project.tagline}</p>
        </div>
      </header>

      <div class="shell">
        <dl class="entry-meta">
          <div>
            <dt>The question</dt>
            <dd>${project.question}</dd>
          </div>
          <div>
            <dt>Repository</dt>
            <dd>
              ${project.repos.map(
                (repo, index) => html`${index > 0 ? ", " : ""}<a href="${repo.href}">${repo.label}</a>`,
              )}
            </dd>
          </div>
          <div>
            <dt>Attribution</dt>
            <dd>${inline(project.attribution)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>${project.statusNote}</dd>
          </div>
        </dl>
      </div>

      <div class="entry-body">
        <div class="shell">
          <div class="grid entry-grid">
            ${project.blocks.map(
              (block) =>
                html`<div class="${wideBlock(block.kind) ? "col-wide" : "col-text"}">${renderBlocks([block], ctx)}</div>`,
            )}
          </div>
        </div>
      </div>

      <div class="shell">
        <nav class="pager" aria-label="Entries">
          <a href="/work/">← All entries</a>
          ${next ? html`<span>Next: <a href="/work/${next.slug}/">${next.name}</a></span>` : html`<span>End of the bench</span>`}
        </nav>
      </div>
    </article>
  `;
}

/** The bench is asymmetric on purpose: wide objects, narrow reading. */
function wideBlock(kind: string): boolean {
  return ["facts", "instrument", "source", "files", "list", "aside"].includes(kind);
}

export function renderPage(page: Page, ctx: RenderContext): Html {
  return html`
    <article>
      <header class="entry-head">
        <div class="shell">
          <div class="entry-head__meta"><span class="entry-head__index">${page.kicker}</span></div>
          <h1>${page.title}</h1>
          <p class="entry-head__tagline">${page.lede}</p>
        </div>
      </header>
      <div class="entry-body">
        <div class="shell">
          <div class="grid entry-grid">
            ${page.blocks.map(
              (block) =>
                html`<div class="${wideBlock(block.kind) ? "col-wide" : "col-text"}">${renderBlocks([block], ctx)}</div>`,
            )}
          </div>
        </div>
      </div>
    </article>
  `;
}

export function renderNotFound(): Html {
  return html`
    <section class="shell notfound">
      <p class="notfound__code">404</p>
      <h1>This page is not on the bench.</h1>
      <p>
        It may have been withdrawn, or it may never have existed. Both are worth saying plainly.
      </p>
      <p><a href="/work/">All entries</a> · <a href="/">The bench</a></p>
    </section>
  `;
}
