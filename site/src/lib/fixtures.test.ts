import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import { DIAL_DEFAULT_THRESHOLD, DIAL_SERIES, MODE_OBJECTS } from "./fixtures.ts";

const css = readFileSync(resolve(import.meta.dirname, "../styles/components.css"), "utf8");

test("the fixture is plausible as moisture readings", () => {
  for (const value of DIAL_SERIES) {
    assert.ok(value >= 0 && value <= 100, `${value} is not a percentage`);
  }
  assert.equal(DIAL_SERIES.length, 24, "one reading per hour");
});

test("the default threshold actually crosses the last reading", () => {
  const now = DIAL_SERIES[DIAL_SERIES.length - 1];
  assert.ok(now !== undefined);
  assert.ok(now < DIAL_DEFAULT_THRESHOLD, "the demo must start with the pump on");
});

test("every bar height in the fixture has a rule in the stylesheet", () => {
  const missing = [...new Set(DIAL_SERIES)].filter(
    (value) => !css.includes(`.bar[data-value="${value}"]`),
  );
  assert.deepEqual(missing, [], `add .bar[data-value="N"] rules for ${missing.join(", ")}`);
});

test("no rule in the stylesheet measures more than the fixture can hold", () => {
  const heights = [...css.matchAll(/\.bar\[data-value="(\d+)"\]\s*\{\s*height:\s*(\d+)%/g)];
  assert.ok(heights.length >= 20, `found ${heights.length} bar rules`);
  for (const [, attribute, height] of heights) {
    assert.equal(attribute, height, "the data attribute and the height must agree");
  }
});

test("the mode objects are distinct and each has a relation count", () => {
  assert.equal(new Set(MODE_OBJECTS.map((o) => o.id)).size, MODE_OBJECTS.length);
  assert.equal(new Set(MODE_OBJECTS.map((o) => o.title)).size, MODE_OBJECTS.length);
  for (const object of MODE_OBJECTS) {
    assert.ok(object.relations > 0);
    assert.ok(object.body.length > 60, `${object.id} needs a real sentence`);
  }
});
