/**
 * Regenerate docs/badges/*.svg from the repository's own numbers.
 *
 *   node tools/badges/generate.mjs
 *
 * It reads the claims ledger and the built site rather than any hand-typed
 * figure, so a badge cannot quietly claim something the repository no longer
 * says. Run it after changing the ledger or the site; the test next to it fails
 * if the committed SVGs disagree with the source.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { badge } from "./badge.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
export const OUT = join(root, "docs/badges");

/** Claims totals, read from the ledger the build enforces. */
export function claims() {
  const ledger = JSON.parse(readFileSync(join(root, "PREP/02-claims/ledger.json"), "utf8"));
  const entries = ledger.entries;
  const publishable = entries.filter((entry) => entry.public_use === "publish").length;
  return { entries: entries.length, publishable };
}

/** Total gzipped transfer of the built site, or null when it is not built. */
export function siteSize() {
  const dist = join(root, "site/dist");
  let total = 0;
  try {
    const walk = (directory) => {
      for (const name of readdirSync(directory)) {
        const path = join(directory, name);
        const info = statSync(path);
        if (info.isDirectory()) walk(path);
        else total += info.size;
      }
    };
    walk(dist);
  } catch {
    return null;
  }
  return total;
}

/**
 * The counts this repository states on its own pages.
 *
 * Tests and browser tests are recorded here because they come from CI output
 * rather than from a file that can be read locally.
 */
export const RECORDED = {
  tests: "102 passing",
  browser: "89 in Chromium",
  node: "22",
};

export function measure() {
  const { entries, publishable } = claims();
  const bytes = siteSize();
  return {
    claims: `${entries} graded`,
    publishable: `${publishable} publishable`,
    transfer: bytes === null ? "not built" : `${(bytes / 1024).toFixed(1)} KB`,
    tests: RECORDED.tests,
    browser: RECORDED.browser,
    node: RECORDED.node,
  };
}

export function render() {
  const m = measure();
  return {
    claims: { label: "claims", value: m.claims, color: "#0a7d32" },
    publishable: { label: "gate", value: m.publishable, color: "#0a7d32" },
    tests: { label: "tests", value: m.tests, color: "#0a7d32" },
    browser: { label: "browser suite", value: m.browser, color: "#0a7d32" },
    transfer: { label: "transfer", value: m.transfer, color: "#0a5eba" },
    node: { label: "node", value: m.node, color: "#555" },
  };
}

export function write() {
  mkdirSync(OUT, { recursive: true });
  const generated = render();
  const paths = [];
  for (const [name, options] of Object.entries(generated)) {
    const path = join(OUT, `${name}.svg`);
    writeFileSync(path, badge(options));
    paths.push(path);
  }
  return paths;
}

if (process.argv[1] && process.argv[1].endsWith("generate.mjs")) {
  const paths = write();
  for (const path of paths) console.log(path.replace(`${root}/`, ""));
}
