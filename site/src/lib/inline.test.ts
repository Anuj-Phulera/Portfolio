import assert from "node:assert/strict";
import { test } from "node:test";
import { inline } from "./inline.ts";

test("plain text is escaped", () => {
  assert.equal(inline(`a < b & "c"`).value, "a &lt; b &amp; &quot;c&quot;");
});

test("emphasis and code", () => {
  assert.equal(inline("the *why* and `npm run verify`").value, "the <em>why</em> and <code>npm run verify</code>");
});

test("internal links are kept", () => {
  assert.equal(inline("see [the bench](/work/)").value, 'see <a href="/work/">the bench</a>');
});

test("https links are kept", () => {
  assert.equal(
    inline("[source](https://github.com/a/b)").value,
    '<a href="https://github.com/a/b">source</a>',
  );
});

test("javascript: and protocol-relative links are refused", () => {
  const out = inline("[x](javascript:alert(1)) [y](//evil.test)").value;
  assert.ok(!out.includes("<a"), out);
});

test("markup inside emphasis is escaped", () => {
  assert.equal(inline("*<img src=x onerror=1>*").value, "<em>&lt;img src=x onerror=1&gt;</em>");
});

test("an unmatched asterisk stays literal", () => {
  assert.equal(inline("2 * 3").value, "2 * 3");
});
