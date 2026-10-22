#!/usr/bin/env node
/**
 * Internal link and anchor check for built HTML.
 *
 * The markdown checker cannot see the generated site, and the site's whole
 * argument is that a link you can click resolves. External URLs are not
 * fetched here either; reachability is not something this environment knows.
 *
 * Usage: node tools/quality/htmllinks.mjs site/dist
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";

const SKIP = /^(https?:|mailto:|tel:|data:|javascript:|#?$)/i;

/** Strip a deploy prefix such as /Portfolio/ before resolving on disk. */
export function stripBase(href, base) {
  if (!base || base === "/") return href;
  const prefix = base.replace(/\/$/, "");
  if (href === prefix) return "/";
  if (href.startsWith(`${prefix}/`)) return href.slice(prefix.length) || "/";
  return href;
}

export function listHtml(root) {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (extname(full) === ".html") out.push(full);
    }
  };
  walk(root);
  return out.sort();
}

/** Turn an href into a file on disk, or null if it should not be checked. */
export function resolveHref(fromFile, root, href) {
  if (SKIP.test(href) || href.startsWith("//")) return null;
  const clean = href.split("#")[0].split("?")[0];
  const anchor = href.includes("#") ? href.split("#")[1] : "";
  if (!clean) return { file: fromFile, anchor };
  let target = clean.startsWith("/") ? join(root, clean) : resolve(dirname(fromFile), clean);
  if (clean.endsWith("/")) target = join(target, "index.html");
  else if (extname(target) === "") {
    if (existsSync(join(target, "index.html"))) target = join(target, "index.html");
    else if (existsSync(`${target}.html`)) target = `${target}.html`;
  }
  return { file: target, anchor };
}

export function checkTree(root, base = process.env.SITE_BASE ?? "/") {
  const findings = [];
  const files = listHtml(root);
  for (const file of files) {
    const html = readFileSync(file, "utf8");
    for (const match of html.matchAll(/\s(href|src)="([^"]+)"/g)) {
      const href = stripBase(match[2], base);
      const resolved = resolveHref(file, root, href);
      if (!resolved) continue;
      if (!existsSync(resolved.file)) {
        findings.push({ file: relative(root, file), href, rule: "missing-file" });
        continue;
      }
      if (resolved.anchor) {
        const target = readFileSync(resolved.file, "utf8");
        const has =
          new RegExp(`id="${resolved.anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`).test(target) ||
          new RegExp(`name="${resolved.anchor}"`).test(target);
        if (!has) findings.push({ file: relative(root, file), href, rule: "missing-anchor" });
      }
    }
  }
  return { files: files.length, findings };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = resolve(process.argv[2] ?? "site/dist");
  if (!existsSync(root)) {
    console.error(`no such directory: ${root}`);
    process.exit(1);
  }
  const { files, findings } = checkTree(root, process.env.SITE_BASE ?? "/");
  for (const finding of findings) console.error(`  ${finding.file}: ${finding.rule} ${finding.href}`);
  console.log(`${files} pages, ${findings.length} broken internal links`);
  process.exit(findings.length === 0 ? 0 : 1);
}
