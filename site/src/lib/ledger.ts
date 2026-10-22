/**
 * The claims ledger is the site's source of truth.
 *
 * Every factual sentence the site publishes resolves to a ledger entry, and the
 * build refuses to run if a page cites an entry that is blocked from
 * publication. This is the one rule the portfolio cannot break, so it is
 * enforced by the compiler of the site rather than by good intentions.
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

export type Grade = "V" | "P" | "U" | "A" | "X";
export type PublicUse = "publish" | "publish-with-caveat" | "do-not-publish" | "internal-only";

export interface ClaimEntry {
  id: string;
  project: string;
  claim: string;
  source: string;
  grade: Grade;
  evidence: string[];
  safe_wording: string;
  public_use: PublicUse;
  attribution: string;
  reviewed: string;
}

export interface Ledger {
  version: number;
  updated: string;
  entries: ClaimEntry[];
}

export const LEDGER_PATH = resolve(import.meta.dirname, "../../../PREP/02-claims/ledger.json");

export function loadLedger(path: string = LEDGER_PATH): Ledger {
  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
  if (typeof parsed !== "object" || parsed === null || !("entries" in parsed)) {
    throw new Error(`${path} is not a claims ledger`);
  }
  return parsed as Ledger;
}

export class ClaimError extends Error {}

/** Look up an entry, or fail loudly enough that a build cannot ship. */
export function cite(ledger: Ledger, id: string): ClaimEntry {
  const entry = ledger.entries.find((e) => e.id === id);
  if (!entry) throw new ClaimError(`Unknown claim ${id}`);
  return entry;
}

const BLOCKED: ReadonlySet<PublicUse> = new Set<PublicUse>(["do-not-publish", "internal-only"]);

export function assertPublishable(entry: ClaimEntry): void {
  if (BLOCKED.has(entry.public_use)) {
    throw new ClaimError(
      `${entry.id} is marked ${entry.public_use}: "${entry.claim}" must not appear on the site.`,
    );
  }
}

export function isPublishable(entry: ClaimEntry): boolean {
  return !BLOCKED.has(entry.public_use);
}

export interface LedgerStats {
  total: number;
  byGrade: Record<Grade, number>;
  byUse: Record<PublicUse, number>;
  publishable: number;
}

export function stats(ledger: Ledger): LedgerStats {
  const byGrade: Record<Grade, number> = { V: 0, P: 0, U: 0, A: 0, X: 0 };
  const byUse: Record<PublicUse, number> = {
    publish: 0,
    "publish-with-caveat": 0,
    "do-not-publish": 0,
    "internal-only": 0,
  };
  for (const entry of ledger.entries) {
    byGrade[entry.grade] += 1;
    byUse[entry.public_use] += 1;
  }
  return {
    total: ledger.entries.length,
    byGrade,
    byUse,
    publishable: ledger.entries.filter(isPublishable).length,
  };
}

/**
 * Walk every citation the content makes and fail on the first blocked one.
 * Called once at build time, before anything is written to disk.
 */
export function validateCitations(
  ledger: Ledger,
  citations: { where: string; ids: string[] }[],
): void {
  for (const { where, ids } of citations) {
    for (const id of ids) {
      assertPublishable(cite(ledger, id));
    }
  }
}
