import assert from "node:assert/strict";
import { test } from "node:test";
import { PROJECTS, projectBySlug } from "./projects.ts";
import { ABOUT, THE_PATTERN } from "./pages.ts";
import { COUNTS, NAV, STATUS_MEANINGS } from "./site.ts";
import { loadLedger, cite, isPublishable } from "../lib/ledger.ts";
import type { Block } from "./types.ts";

const ledger = loadLedger();

function textOf(blocks: Block[]): string {
  const parts: string[] = [];
  for (const block of blocks) {
    if ("text" in block) parts.push(block.text);
    if (block.kind === "list") parts.push(...block.items);
    if (block.kind === "facts") parts.push(...block.rows.flat());
    if (block.kind === "files") parts.push(...block.rows.flat());
    if (block.kind === "quote") parts.push(block.cite);
  }
  return parts.join(" ");
}

test("six entries, numbered 01 to 06, unique slugs", () => {
  assert.equal(PROJECTS.length, COUNTS.entries);
  assert.deepEqual(
    PROJECTS.map((p) => p.index),
    ["01", "02", "03", "04", "05", "06"],
  );
  assert.equal(new Set(PROJECTS.map((p) => p.slug)).size, PROJECTS.length);
});

test("every entry has a status the site knows how to render", () => {
  const known = new Set(STATUS_MEANINGS.map((s) => s.status));
  for (const project of PROJECTS) assert.ok(known.has(project.status), `${project.slug}: ${project.status}`);
  // The bench is only interesting if the states differ.
  assert.equal(new Set(PROJECTS.map((p) => p.status)).size, 5);
});

test("the next-entry chain ends and every link resolves", () => {
  let current = PROJECTS[0];
  const seen = new Set<string>();
  while (current?.nextSlug) {
    assert.ok(!seen.has(current.slug), `cycle at ${current.slug}`);
    seen.add(current.slug);
    const next = projectBySlug(current.nextSlug);
    assert.ok(next, `${current.slug} points at missing ${current.nextSlug}`);
    current = next;
  }
  assert.equal(current?.slug, "rakshabandhan");
});

test("each entry is substantive and carries at least two receipts", () => {
  for (const project of PROJECTS) {
    const words = textOf(project.blocks).split(/\s+/).filter(Boolean).length;
    assert.ok(words > 220, `${project.slug} has only ${words} words`);
    const receipts = project.blocks.filter((b) => b.kind === "receipt");
    assert.ok(receipts.length >= 2, `${project.slug} has ${receipts.length} receipts`);
  }
});

test("every receipt resolves to a ledger entry that may be published", () => {
  const all = [...PROJECTS.flatMap((p) => p.blocks), ...THE_PATTERN.blocks, ...ABOUT.blocks];
  const receipts = all.filter((b) => b.kind === "receipt");
  assert.ok(receipts.length >= 12, `only ${receipts.length} receipts on the site`);
  for (const receipt of receipts) {
    if (receipt.kind !== "receipt") continue;
    const entry = cite(ledger, receipt.claim);
    assert.ok(isPublishable(entry), `${receipt.claim} is ${entry.public_use}`);
  }
});

test("copy avoids the phrases the research ruled out", () => {
  const all = [...PROJECTS.map((p) => [p.slug, textOf(p.blocks)] as const)];
  const banned = [
    /\bpassionate\b/i,
    /\binnovative\b/i,
    /\bcutting[- ]edge\b/i,
    /\bworld[- ]class\b/i,
    /\bgame[- ]chang/i,
    /\bleverage\b/i,
    /\bseamless(ly)?\b/i,
    /\bunlock/i,
    /\blorem ipsum\b/i,
    /\bTODO\b/,
    /\bTBD\b/,
  ];
  for (const [slug, text] of all) {
    for (const pattern of banned) assert.ok(!pattern.test(text), `${slug} contains ${pattern}`);
  }
});

test("every navigation destination has a page in the content set", () => {
  const slugs = new Set(["/", "/work/", "/notes/the-pattern/", "/about/", "/colophon/"]);
  for (const item of NAV) assert.ok(slugs.has(item.href), item.href);
});

test("the two prose pages exist and have ledes", () => {
  for (const page of [THE_PATTERN, ABOUT]) {
    assert.ok(page.lede.length > 20);
    assert.ok(page.blocks.length >= 4);
  }
});
