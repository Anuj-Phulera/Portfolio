/**
 * The data file is published. These tests are the reason it is safe to publish.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test } from "node:test";
import skillverse from "./skillverse.json" with { type: "json" };

const raw = readFileSync(resolve(import.meta.dirname, "skillverse.json"), "utf8");

test("the aggregates contain counts and means, nothing row-level", () => {
  const allowed = new Set(["meta", "age", "hours", "device", "split", "platforms"]);
  for (const key of Object.keys(skillverse)) assert.ok(allowed.has(key), `unexpected key ${key}`);

  const meta = new Set(["records", "respondents", "firstSubmission", "lastSubmission", "splitSampleOf", "note"]);
  for (const key of Object.keys(skillverse.meta)) assert.ok(meta.has(key), `unexpected meta key ${key}`);
});

test("no identifier, city or free-text column survived", () => {
  const banned = [
    "Submission ID",
    "Respondent ID",
    "city",
    "gurugram",
    "delhi",
    "school",
    "colonel",
    "email",
    "@",
  ];
  for (const needle of banned) {
    assert.ok(!raw.toLowerCase().includes(needle.toLowerCase()), `aggregates mention ${needle}`);
  }
});

test("the published totals agree with the ledger entry", () => {
  assert.equal(skillverse.meta.records, 255);
  assert.equal(skillverse.meta.respondents, 254);
  assert.equal(skillverse.meta.firstSubmission, "2026-04-04");
  assert.equal(skillverse.meta.lastSubmission, "2026-07-03");
});

test("the file stays too small to be a dataset", () => {
  // 255 rows, even redacted, could not fit in this file. This is a tripwire.
  assert.ok(raw.length < 4096, `${raw.length} bytes — aggregates have grown into rows`);
});

test("every distribution sums to something defensible", () => {
  const total = (rows: { count: number }[]) => rows.reduce((sum, row) => sum + row.count, 0);
  assert.equal(total(skillverse.hours), skillverse.meta.records);
  assert.ok(total(skillverse.age) <= skillverse.meta.records);
  assert.ok(total(skillverse.device) <= skillverse.meta.records);
  for (const part of skillverse.split) {
    assert.ok(part.mean >= 0 && part.mean <= 100, `${part.label} mean is ${part.mean}`);
  }
});

test("ages are floored and no individual over 25 appears", () => {
  for (const year of skillverse.age) {
    const value = Number(year.label);
    assert.ok(Number.isInteger(value), `${year.label} is not a whole year`);
    assert.ok(value >= 8 && value <= 25, `${year.label} is outside the survey population`);
  }
});
