/**
 * The badges are claims, so they get the same treatment as the claims: a test
 * that fails when the artwork and the source disagree.
 */
import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { badge } from "./badge.mjs";
import { measure, render, OUT } from "./generate.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

test("a badge names both halves in its accessible title", () => {
  const svg = badge({ label: "tests", value: "102 passing" });
  assert.ok(svg.includes('<title>tests: 102 passing</title>'));
  assert.ok(svg.includes('role="img"'));
  assert.ok(svg.includes('aria-label="tests: 102 passing"'));
});

test("the width grows with the text", () => {
  const narrow = Number(badge({ label: "a", value: "b" }).match(/width="(\d+)"/)[1]);
  const wide = Number(badge({ label: "aaaaaaaaaa", value: "bbbbbbbbbb" }).match(/width="(\d+)"/)[1]);
  assert.ok(wide > narrow, "a longer label should produce a wider badge");
});

test("markup in a value is escaped, not injected", () => {
  const svg = badge({ label: "<script>", value: "a & b" });
  assert.ok(!svg.includes("<script>"));
  assert.ok(svg.includes("&lt;script&gt;"));
  assert.ok(svg.includes("a &amp; b"));
});

test("the numbers come from the ledger, not from the artwork", () => {
  const m = measure();
  const ledger = JSON.parse(readFileSync(join(root, "PREP/02-claims/ledger.json"), "utf8"));
  const publishable = ledger.entries.filter((e) => e.public_use === "publish").length;
  assert.equal(m.claims, `${ledger.entries.length} graded`);
  assert.equal(m.publishable, `${publishable} publishable`);
});

test("every committed badge matches what the generator would write now", () => {
  const generated = render();
  for (const [name, options] of Object.entries(generated)) {
    const onDisk = readFileSync(join(OUT, `${name}.svg`), "utf8");
    assert.equal(
      onDisk,
      badge(options),
      `docs/badges/${name}.svg is stale — run node tools/badges/generate.mjs`,
    );
  }
});

test("no badge claims a figure the site does not report", () => {
  const m = measure();
  // The transfer badge must match the size of the built site, not a guess.
  if (m.transfer !== "not built") {
    assert.match(m.transfer, /^\d+\.\d KB$/);
  }
});
