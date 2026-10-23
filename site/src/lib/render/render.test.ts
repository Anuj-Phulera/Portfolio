import assert from "node:assert/strict";
import { test } from "node:test";
import { PROJECTS } from "../../content/projects.ts";
import { ABOUT, THE_PATTERN } from "../../content/pages.ts";
import { renderHome, renderEntries, renderProject, renderPage, renderNotFound } from "./pages.ts";
import { ledgerInstrument } from "./instruments.ts";
import { documentShell } from "./layout.ts";
import { loadLedger } from "../ledger.ts";
import { esc } from "../html.ts";
import { INSTRUMENTS } from "../../content/instruments.ts";

const ledger = loadLedger();
const ctx = { ledger };
const assets = { css: ["/assets/a.css"], js: ["/assets/a.js"], fonts: [] };

test("home lists every entry and has one h1", () => {
  const out = renderHome(ctx).value;
  for (const project of PROJECTS) assert.ok(out.includes(project.name), project.name);
  assert.equal((out.match(/<h1/g) ?? []).length, 1);
  assert.ok(out.includes("data-mode-root"));
});

test("entries index carries the status legend", () => {
  const out = renderEntries().value;
  for (const project of PROJECTS) assert.ok(out.includes(project.tagline));
  assert.ok(out.includes("WITHDRAWN"));
});

test("a project page renders its receipts as native details elements", () => {
  const project = PROJECTS.find((p) => p.slug === "strata");
  assert.ok(project);
  const out = renderProject(project, ctx).value;
  const receipts = (out.match(/<details class="receipt"/g) ?? []).length;
  assert.equal(receipts, project.blocks.filter((b) => b.kind === "receipt").length);
  assert.ok(out.includes("src/content/graph.ts"));
  assert.equal((out.match(/<h1/g) ?? []).length, 1);
});

test("prose pages render with exactly one h1", () => {
  for (const page of [THE_PATTERN, ABOUT]) {
    const out = renderPage(page, ctx).value;
    assert.equal((out.match(/<h1/g) ?? []).length, 1, page.slug);
  }
});

test("the ledger instrument never prints a blocked claim verbatim", () => {
  const out = ledgerInstrument({ ...INSTRUMENTS.ledger, caption: "x", ledger }).value;
  const blocked = ledger.entries.filter((e) => e.public_use === "do-not-publish" || e.public_use === "internal-only");
  assert.ok(blocked.length > 0);
  for (const entry of blocked) {
    assert.ok(!out.includes(entry.claim), `leaked ${entry.id}`);
    assert.ok(out.includes(esc(entry.safe_wording)), `missing correction for ${entry.id}`);
  }
});

test("the shell escapes the title and marks the current page", () => {
  const out = documentShell({
    title: `<script>alert(1)</script>`,
    description: "d",
    path: "/about/",
    body: renderNotFound(),
    assets,
  });
  assert.ok(!out.includes("<script>alert(1)</script>"));
  assert.ok(out.includes('aria-current="page"'));
  assert.ok(out.includes('href="#main"'));
});

test("the 404 page is a page, not a dead end", () => {
  const out = renderNotFound().value;
  assert.ok(out.includes('href="/work/"'));
  assert.ok(out.includes('href="/"'));
});

test("no page ships an inline style attribute", () => {
  const pages = [renderHome(ctx), renderEntries(), renderNotFound(), renderPage(ABOUT, ctx)];
  for (const page of pages) assert.ok(!/style="/.test(page.value));
});

test("a claim cited twice does not produce a duplicate id", async () => {
  const { PROJECTS } = await import("../../content/projects.ts");
  const project = PROJECTS.find((p) => p.slug === "skillverse");
  assert.ok(project);
  const out = renderProject(project, ctx).value;
  const ids = [...out.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `duplicate ids: ${ids.join(", ")}`);
});

test("a measurement table aligns its numbers and leaves prose alone", async () => {
  const { PROJECTS } = await import("../../content/projects.ts");
  const project = PROJECTS.find((p) => p.slug === "resonate");
  assert.ok(project);
  const block = project.blocks.find((b) => b.kind === "table");
  assert.ok(block && block.kind === "table");

  const out = renderProject(project, ctx).value;
  assert.ok(out.includes('class="measure__table"'));
  assert.ok(out.includes('scope="col"'), "column headers are scoped");
  assert.ok(out.includes('scope="row"'), "row headers are scoped");

  const heads = [...out.matchAll(/<th scope="col"([^>]*)>([^<]*)<\/th>/g)].map(
    (match) => ({ attributes: match[1] ?? "", label: match[2] ?? "" }),
  );
  assert.equal(heads.length, block.columns.length);
  assert.ok(!heads[heads.length - 1]?.attributes.includes("measure__number"), "a prose column is not right-aligned");
  assert.ok(heads[1]?.attributes.includes("measure__number"), "a number column is");
});

test("every table row has as many cells as there are columns", async () => {
  const { PROJECTS } = await import("../../content/projects.ts");
  for (const project of PROJECTS) {
    for (const block of project.blocks) {
      if (block.kind !== "table") continue;
      for (const row of block.rows) {
        assert.equal(
          row.length,
          block.columns.length,
          `${project.slug}: a row has ${row.length} cells for ${block.columns.length} columns`,
        );
      }
    }
  }
});

test("no table ships an empty column header", async () => {
  // axe flags an empty <th scope="col">, and it flagged one here: a comparison
  // table whose first column held row labels and therefore had no heading.
  const { PROJECTS } = await import("../../content/projects.ts");
  const { THE_PATTERN } = await import("../../content/pages.ts");

  const blocks = [
    ...PROJECTS.flatMap((project) => project.blocks),
    ...THE_PATTERN.blocks,
  ].filter((block) => block.kind === "table");

  assert.ok(blocks.length >= 2, "the tables under test should exist");
  for (const block of blocks) {
    if (block.kind !== "table") continue;
    for (const column of block.columns) {
      assert.ok(column.trim().length > 0, `${block.title}: a column has no heading`);
    }
  }
});
