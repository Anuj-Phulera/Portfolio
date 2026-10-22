import assert from "node:assert/strict";
import { test } from "node:test";
import { attr, esc, html, paragraphs, raw } from "./html.ts";

test("escapes the five dangerous characters", () => {
  assert.equal(esc(`<a href="x">&'</a>`), "&lt;a href=&quot;x&quot;&gt;&amp;&#39;&lt;/a&gt;");
});

test("interpolated values are escaped", () => {
  const out = html`<p>${"<script>alert(1)</script>"}</p>`;
  assert.equal(out.value, "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>");
});

test("raw values are not double-escaped", () => {
  const inner = html`<b>${"a & b"}</b>`;
  const outer = html`<div>${inner}</div>`;
  assert.equal(outer.value, "<div><b>a &amp; b</b></div>");
});

test("null, undefined and false render as empty", () => {
  assert.equal(html`<i>${null}${undefined}${false}</i>`.value, "<i></i>");
});

test("arrays are joined in order", () => {
  const items = ["a", "b"].map((x) => html`<li>${x}</li>`);
  assert.equal(html`<ul>${items}</ul>`.value, "<ul><li>a</li><li>b</li></ul>");
});

test("raw bypasses escaping for deliberate markup", () => {
  assert.equal(html`${raw("<hr>")}`.value, "<hr>");
});

test("attr drops boolean false and keeps true", () => {
  assert.equal(attr(false), "");
  assert.equal(attr(true), "");
  assert.equal(attr('a"b'), "a&quot;b");
});

test("paragraphs splits on blank lines and keeps single newlines inline", () => {
  const out = paragraphs("one\ntwo\n\nthree");
  assert.equal(out.length, 2);
  assert.equal(out[0]?.value, "<p>one two</p>");
  assert.equal(out[1]?.value, "<p>three</p>");
});
