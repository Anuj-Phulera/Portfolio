import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { checkTree, stripBase } from "../htmllinks.mjs";
import { checkTreeA11y } from "../a11y-tree.mjs";
import { BUDGETS, judge, measure } from "../site-budget.mjs";

function fixture(files) {
  const root = mkdtempSync(join(tmpdir(), "site-tools-"));
  for (const [path, body] of Object.entries(files)) {
    const full = join(root, path);
    mkdirSync(join(full, ".."), { recursive: true });
    writeFileSync(full, body);
  }
  return root;
}

const page = (body) => `<!doctype html><html lang="en"><head><title>Test page</title></head><body><h1>T</h1>${body}</body></html>`;

test("htmllinks accepts absolute, relative and directory links", () => {
  const root = fixture({
    "index.html": page('<a href="/work/">w</a><a href="about/">a</a><a href="mailto:x@y.z">m</a>'),
    "work/index.html": page('<p id="top">top</p><a href="/">home</a>'),
    "about/index.html": page('<a href="/work/#top">back</a>'),
  });
  const { files, findings } = checkTree(root);
  assert.equal(files, 3);
  assert.deepEqual(findings, []);
});

test("htmllinks catches a link to a file that does not exist", () => {
  const root = fixture({ "index.html": page('<a href="/nowhere/">x</a>') });
  const { findings } = checkTree(root);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, "missing-file");
});

test("htmllinks catches a missing anchor", () => {
  const root = fixture({
    "index.html": page('<a href="/a/#gone">x</a>'),
    "a/index.html": page('<p id="here">y</p>'),
  });
  const { findings } = checkTree(root);
  assert.equal(findings[0].rule, "missing-anchor");
});

test("htmllinks ignores external and empty links", () => {
  const root = fixture({
    "index.html": page('<a href="https://example.com/x">e</a><a href="#">t</a><a href="//cdn.test/x">p</a>'),
  });
  assert.deepEqual(checkTree(root).findings, []);
});

test("a11y-tree reports the same findings as the single-file checker", () => {
  const root = fixture({
    "index.html": "<html><head><title>Test page</title></head><body><h1>a</h1></body></html>",
    "ok/index.html": page("<p>fine</p>"),
  });
  const findings = checkTreeA11y(root);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, "html-lang");
  assert.equal(findings[0].file, "index.html");
});

test("site-budget measures gzip for text and raw for fonts", () => {
  const root = fixture({
    "index.html": page("<p>hello</p>"),
    "assets/main-abc.js": "console.log('x');".repeat(10),
    "assets/style-abc.css": ".a{color:red}".repeat(10),
    "assets/font.woff2": "a".repeat(2048),
  });
  const m = measure(root);
  assert.equal(m.pages, 1);
  assert.equal(m.fonts, 2048);
  assert.ok(m.js > 0 && m.js < 200);
  assert.ok(m.total > m.fonts);
});

test("site-budget names the budget that was crossed", () => {
  const over = judge({ js: BUDGETS.js + 1, css: 1, fonts: 1, page: 1, total: 1 });
  assert.equal(over.length, 1);
  assert.match(over[0], /^js:/);
});

test("the stated budgets do not drift from the colophon", () => {
  assert.equal(BUDGETS.total / 1024, 100);
  assert.equal(BUDGETS.page / 1024, 8);
});

test("stripBase removes a deploy prefix and leaves the rest alone", () => {
  assert.equal(stripBase("/Portfolio/work/", "/Portfolio/"), "/work/");
  assert.equal(stripBase("/Portfolio", "/Portfolio/"), "/");
  assert.equal(stripBase("/work/", "/Portfolio/"), "/work/");
  assert.equal(stripBase("/work/", "/"), "/work/");
});

test("checkTree resolves a subpath deploy when told the base", () => {
  const root = fixture({
    "index.html": page('<a href="/Portfolio/work/">w</a><img src="/Portfolio/favicon.svg">'),
    "work/index.html": page("<p>ok</p>"),
    "favicon.svg": "<svg/>",
  });
  assert.deepEqual(checkTree(root, "/Portfolio/").findings, []);
  // Without the base it must fail, otherwise the option would be untested.
  assert.ok(checkTree(root, "/").findings.length > 0);
});
