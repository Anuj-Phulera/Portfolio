import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { collectExternal } from "./external-links.mjs";

function fixture(files) {
  const root = mkdtempSync(join(tmpdir(), "ext-links-"));
  for (const [path, body] of Object.entries(files)) {
    const full = join(root, path);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, body);
  }
  return root;
}

test("collects external hrefs once, with every page that uses them", () => {
  const root = fixture({
    "index.html": '<a href="https://a.test/x">a</a><a href="/local/">l</a><a href="mailto:x@y.z">m</a>',
    "b/index.html": '<a href="https://a.test/x">a</a><a href="https://b.test/">b</a>',
  });
  const links = collectExternal(root);
  assert.equal(links.size, 2);
  assert.deepEqual([...links.keys()], ["https://a.test/x", "https://b.test/"]);
  assert.equal(links.get("https://a.test/x").size, 2);
});

test("decodes HTML entities in URLs", () => {
  const root = fixture({ "index.html": '<a href="https://a.test/?x=1&amp;y=2">a</a>' });
  assert.deepEqual([...collectExternal(root).keys()], ["https://a.test/?x=1&y=2"]);
});

test("ignores internal, relative and non-http links", () => {
  const root = fixture({
    "index.html": '<a href="/x/">1</a><a href="#top">2</a><a href="mailto:a@b.c">3</a><a href="//cdn.test/x">4</a>',
  });
  assert.equal(collectExternal(root).size, 0);
});
