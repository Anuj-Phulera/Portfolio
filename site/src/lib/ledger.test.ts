import assert from "node:assert/strict";
import { test } from "node:test";
import { ClaimError, assertPublishable, cite, isPublishable, loadLedger, stats, validateCitations } from "./ledger.ts";

const ledger = loadLedger();

test("the real ledger loads and has 36 graded entries", () => {
  assert.equal(ledger.entries.length, 36);
  assert.equal(ledger.version, 1);
});

test("every entry has the fields the site relies on", () => {
  for (const e of ledger.entries) {
    assert.match(e.id, /^CLM-\d{3}$/);
    assert.ok(e.evidence.length > 0, `${e.id} has no evidence`);
    assert.ok(e.safe_wording.length > 10, `${e.id} has no safe wording`);
    assert.ok(["V", "P", "U", "A", "X"].includes(e.grade));
  }
});

test("the ledger's parse matches the published counts", () => {
  const s = stats(ledger);
  assert.equal(s.byGrade.V, 15);
  assert.equal(s.byGrade.X, 8);
  assert.equal(s.byUse.publish, 14);
  assert.equal(s.byUse["do-not-publish"], 10);
  assert.equal(s.publishable, 20);
});

test("a blocked claim cannot be published", () => {
  assert.throws(() => assertPublishable(cite(ledger, "CLM-002")), ClaimError);
  assert.throws(() => assertPublishable(cite(ledger, "CLM-003")), ClaimError);
  assert.doesNotThrow(() => assertPublishable(cite(ledger, "CLM-027")));
});

test("caveated claims are publishable but flagged", () => {
  const entry = cite(ledger, "CLM-029");
  assert.equal(entry.grade, "V");
  assert.equal(entry.public_use, "publish-with-caveat");
  assert.equal(isPublishable(entry), true);
});

test("an unknown claim id is an error, not a silent empty citation", () => {
  assert.throws(() => cite(ledger, "CLM-999"), /Unknown claim/);
});

test("validateCitations reports the location of the blocked citation", () => {
  assert.throws(
    () => validateCitations(ledger, [{ where: "home", ids: ["CLM-027", "CLM-017"] }]),
    /CLM-017 is marked do-not-publish/,
  );
});
