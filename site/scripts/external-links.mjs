#!/usr/bin/env node
/**
 * Check that every external link the site publishes actually resolves.
 *
 * This is the check that should have existed before the site linked to eight
 * repositories that did not exist. It needs the network, so it runs in CI
 * rather than locally; `--offline` skips it and says so out loud instead of
 * pretending to have checked.
 *
 * Usage: node scripts/external-links.mjs [dist] [--offline]
 */
import { execFile } from "node:child_process";
import { readFileSync } from "node:fs";
import { promisify } from "node:util";
import { listHtml } from "./axe-audit.mjs";

const run = promisify(execFile);

const OFFLINE = process.argv.includes("--offline");
const TIMEOUT = 15_000;

/** Every external href in the built HTML, with the pages that reference it. */
export function collectExternal(root) {
  const found = new Map();
  for (const file of listHtml(root)) {
    const html = readFileSync(file, "utf8");
    for (const match of html.matchAll(/href="(https?:\/\/[^"]+)"/g)) {
      const url = match[1].replace(/&amp;/g, "&");
      const pages = found.get(url) ?? new Set();
      pages.add(file.slice(root.length + 1));
      found.set(url, pages);
    }
  }
  return new Map([...found].sort(([a], [b]) => a.localeCompare(b)));
}

/**
 * Resolve a URL with curl when it is available.
 *
 * Node's fetch uses its own trust store, which in a proxied environment is not
 * the one the machine actually trusts; curl uses the system store. Rather than
 * special-casing certificates, the check prefers the tool that behaves the way
 * a browser would, and falls back to fetch where curl is absent.
 */
async function resolve(url) {
  try {
    const { stdout } = await run(
      "curl",
      [
        "-s",
        "-o",
        "/dev/null",
        "-w",
        "%{http_code} %{url_effective}",
        "-L",
        "--max-time",
        String(TIMEOUT / 1000),
        "-A",
        "portfolio-link-check",
        url,
      ],
      { timeout: TIMEOUT + 2000 },
    );
    const [code, ...rest] = stdout.trim().split(" ");
    const status = Number(code);
    if (Number.isFinite(status) && status > 0) return { status, finalUrl: rest.join(" ") };
    return { status: 0, error: "no response" };
  } catch (error) {
    const code = error?.code;
    if (code !== "ENOENT") return { status: 0, error: String(error) };
  }

  for (const method of ["HEAD", "GET"]) {
    try {
      const response = await fetch(url, {
        method,
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT),
        headers: { "user-agent": "portfolio-link-check", ...(method === "GET" ? { range: "bytes=0-0" } : {}) },
      });
      if (method === "GET" && response.body) await response.body.cancel();
      return { status: response.status, finalUrl: response.url };
    } catch (error) {
      if (method === "GET") return { status: 0, error: String(error) };
    }
  }
  return { status: 0, error: "unreachable" };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.argv[2]?.startsWith("--") ? "dist" : (process.argv[2] ?? "dist");
  const links = collectExternal(root);
  if (OFFLINE) {
    console.log(`${links.size} external link(s) found; not checked (--offline)`);
    process.exit(0);
  }

  const failures = [];
  for (const [url, pages] of links) {
    const { status, finalUrl, error } = await resolve(url);
    const ok = status >= 200 && status < 400;
    if (!ok) failures.push({ url, status, error, pages: [...pages] });
    const label = ok ? String(status) : `${status} ${error ?? ""}`.trim();
    console.log(`${String(label).padEnd(8)} ${url}`);
    if (ok && finalUrl && finalUrl.replace(/\/$/, "") !== url.replace(/\/$/, "")) {
      console.log(`         → redirects to ${finalUrl}`);
    }
  }

  if (failures.length > 0) {
    console.error(`\n${failures.length} external link(s) do not resolve:`);
    for (const failure of failures) {
      console.error(`  ${failure.url} — referenced by ${failure.pages.join(", ")}`);
    }
  }
  console.log(`\n${links.size} external link(s), ${failures.length} broken`);
  process.exit(failures.length === 0 ? 0 : 1);
}
