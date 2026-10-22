import assert from "node:assert/strict";
import { test } from "node:test";
import { applyBase, normaliseBase, url } from "./paths.ts";

test("base normalisation accepts the shapes people actually type", () => {
  assert.equal(normaliseBase(undefined), "/");
  assert.equal(normaliseBase(""), "/");
  assert.equal(normaliseBase("/"), "/");
  assert.equal(normaliseBase("Portfolio"), "/Portfolio/");
  assert.equal(normaliseBase("/Portfolio"), "/Portfolio/");
  assert.equal(normaliseBase("/Portfolio/"), "/Portfolio/");
});

test("url joins without doubling or dropping slashes", () => {
  assert.equal(url("/work/", "/"), "/work/");
  assert.equal(url("/work/", "/Portfolio/"), "/Portfolio/work/");
  assert.equal(url("/", "/Portfolio/"), "/Portfolio/");
});

test("applyBase is a no-op at the root", () => {
  const html = '<a href="/work/">x</a><img src="/a.png">';
  assert.equal(applyBase(html, "/"), html);
});

test("applyBase rewrites href, src and og:content but not anchors or externals", () => {
  const html = '<a href="/work/">w</a><a href="#main">s</a><a href="https://x.test/">e</a><img src="/f.svg"><meta content="/og.png">';
  const out = applyBase(html, "/Portfolio/");
  assert.ok(out.includes('href="/Portfolio/work/"'));
  assert.ok(out.includes('href="#main"'));
  assert.ok(out.includes('href="https://x.test/"'));
  assert.ok(out.includes('src="/Portfolio/f.svg"'));
  assert.ok(out.includes('content="/Portfolio/og.png"'));
});

test("applyBase leaves protocol-relative URLs alone", () => {
  assert.equal(applyBase('<a href="//cdn.test/x">y</a>', "/Portfolio/"), '<a href="//cdn.test/x">y</a>');
});

test("applyBase is idempotent", () => {
  const once = applyBase('<a href="/work/">w</a>', "/Portfolio/");
  assert.equal(applyBase(once, "/Portfolio/"), once);
});
