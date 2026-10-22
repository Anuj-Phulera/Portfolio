/**
 * The site build.
 *
 * 1. Read the claims ledger and refuse to continue if any page cites a
 *    blocked entry.
 * 2. Bundle the three islands with Vite (the only thing that needs bundling).
 * 3. Render every page to static HTML.
 * 4. Measure what was written, then write the colophon from those measurements.
 *
 * The order matters: the colophon cannot state the site's weight until the
 * site has a weight.
 */

import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { dirname, extname, join, relative, resolve } from "node:path";
import { build as viteBuild } from "vite";
import { ABOUT, THE_PATTERN, colophonPage } from "./src/content/pages.ts";
import { PROJECTS, projectBySlug } from "./src/content/projects.ts";
import { ROUTES } from "./src/content/routes.ts";
import { SITE } from "./src/content/site.ts";
import type { Project } from "./src/content/types.ts";
import { collectCitations } from "./src/lib/render/blocks.ts";
import { documentShell, type Assets } from "./src/lib/render/layout.ts";
import {
  renderEntries,
  renderHome,
  renderNotFound,
  renderPage,
  renderProject,
  type RenderContext,
} from "./src/lib/render/pages.ts";
import { ClaimError, loadLedger, stats, validateCitations } from "./src/lib/ledger.ts";
import { ORIGIN } from "./src/lib/paths.ts";
import { robotsTxt, sitemapXml } from "./src/lib/sitemap.ts";

const root = import.meta.dirname;
const dist = join(root, "dist");

interface PageFile {
  path: string;
  html: string;
}

function main(): void {
  console.log("site: reading claims ledger");
  const ledger = loadLedger();
  const counts = stats(ledger);
  const ctx: RenderContext = { ledger };

  // ---- gate 1: every cited claim must be publishable -----------------------
  const citations = [
    ...PROJECTS.map((project) => collectCitations(project.blocks, `work/${project.slug}`)),
    collectCitations(THE_PATTERN.blocks, "notes/the-pattern"),
    collectCitations(ABOUT.blocks, "about"),
  ];
  try {
    validateCitations(ledger, citations);
  } catch (error) {
    if (error instanceof ClaimError) {
      console.error(`\nBUILD STOPPED — ${error.message}\n`);
      process.exitCode = 1;
      return;
    }
    throw error;
  }
  const cited = new Set(citations.flatMap((c) => c.ids));
  console.log(`site: ${cited.size} distinct claims cited, all clear to publish`);

  const claims = { total: counts.total, publishable: counts.publishable };
  const rendered = renderAll(
    ctx,
    { pages: 0, htmlBytes: 0, cssBytes: 0, jsBytes: 0, fontBytes: 0 },
    { css: [], js: [], fonts: [] },
    claims,
  );

  // ---- gate 2: no blocked claim may appear verbatim -----------------------
  const joined = rendered.map((page) => page.html).join("\n");
  const leaked = ledger.entries.filter(
    (entry) =>
      (entry.public_use === "do-not-publish" || entry.public_use === "internal-only") &&
      joined.includes(entry.claim),
  );
  if (leaked.length > 0) {
    console.error(`\nBUILD STOPPED — blocked claim text present: ${leaked.map((e) => e.id).join(", ")}\n`);
    process.exitCode = 1;
    return;
  }

  buildAssets()
    .then((assets) => {
      console.log(`site: islands ${assets.js.length} js, ${assets.css.length} css, ${assets.fonts.length} fonts`);
      writeAll(ctx, assets, claims);
    })
    .catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
}

interface ClaimCounts {
  total: number;
  publishable: number;
}

function renderAll(
  ctx: RenderContext,
  metrics: { pages: number; htmlBytes: number; cssBytes: number; jsBytes: number; fontBytes: number },
  assets: Assets,
  claims: ClaimCounts,
): PageFile[] {
  const shell = (title: string, description: string, path: string, body: ReturnType<typeof renderHome>) =>
    documentShell({ title, description, path, body, assets, marker: "ANUJ PHULERA · BENCH 01" });

  const colophon = colophonPage(metrics, { total: claims.total, publishable: claims.publishable, blocked: claims.total - claims.publishable });

  return ROUTES.map((route) => {
    let body: ReturnType<typeof renderHome>;
    switch (route.kind) {
      case "home":
        body = renderHome(ctx);
        break;
      case "index":
        body = renderEntries();
        break;
      case "entry": {
        const slug = route.path.split("/")[2] ?? "";
        const project = projectBySlug(slug);
        if (!project) throw new Error(`route ${route.path} has no project`);
        body = renderProject(project, ctx);
        break;
      }
      case "note":
        body = renderPage(THE_PATTERN, ctx);
        break;
      case "about":
        body = renderPage(ABOUT, ctx);
        break;
      case "colophon":
        body = renderPage(colophon, ctx);
        break;
      case "error":
        body = renderNotFound();
        break;
    }
    return { path: route.file, html: shell(route.title, route.description, route.path, body) };
  });
}

async function buildAssets(): Promise<Assets> {
  rmSync(dist, { recursive: true, force: true });
  await viteBuild({ configFile: resolve(root, "vite.config.ts"), logLevel: "warn" });
  const assetsDir = join(dist, "assets");
  const files = readdirSync(assetsDir);
  const byExt = (wanted: string) =>
    files.filter((file) => extname(file) === wanted).map((file) => `/assets/${file}`);
  const css = byExt(".css");
  const js = byExt(".js");
  if (js.length === 0) throw new Error("vite did not emit a script");
  return { css, js, fonts: byExt(".woff2") };
}

function writeAll(ctx: RenderContext, assets: Assets, claims: ClaimCounts): void {
  const metricsOf = (pages: PageFile[]) => ({
    pages: pages.length,
    htmlBytes: pages.reduce((sum, page) => sum + gzipSync(Buffer.from(page.html)).length, 0),
    cssBytes: sizeOf(assets.css),
    jsBytes: sizeOf(assets.js),
    fontBytes: sizeOf(assets.fonts),
  });

  // Two passes: the colophon reports the weight of a site that includes the
  // colophon, so it is measured, rewritten, and measured again.
  let pages: PageFile[] = [];
  let metrics = { pages: 0, htmlBytes: 0, cssBytes: sizeOf(assets.css), jsBytes: sizeOf(assets.js), fontBytes: sizeOf(assets.fonts) };
  for (let pass = 0; pass < 2; pass += 1) {
    pages = renderAll(ctx, metrics, assets, claims);
    metrics = metricsOf(pages);
  }

  for (const page of pages) {
    const target = join(dist, page.path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, page.html);
  }

  cpSync(join(root, "public"), dist, { recursive: true });

  writeFileSync(join(dist, "sitemap.xml"), sitemapXml(ROUTES, ORIGIN || "https://example.invalid", SITE.built));
  writeFileSync(join(dist, "robots.txt"), robotsTxt(ORIGIN || null));

  const total = metrics.htmlBytes + metrics.cssBytes + metrics.jsBytes + metrics.fontBytes;
  console.log(`site: ${pages.length} pages`);
  console.log(`site: html ${kb(metrics.htmlBytes)} · css ${kb(metrics.cssBytes)} · js ${kb(metrics.jsBytes)} · fonts ${kb(metrics.fontBytes)}`);
  console.log(`site: total ${kb(total)}`);
  console.log(`site: ${claims.total} claims, ${claims.publishable} publishable, ${claims.total - claims.publishable} blocked`);
  console.log("site: done");
  if (process.env.SITE_VERBOSE) {
    for (const page of pages) console.log(`  ${relative(root, join(dist, page.path))}`);
  }
}

/** Transfer size: gzip for text, raw for woff2 (already compressed). */
function sizeOf(paths: string[]): number {
  return paths.reduce((sum, href) => {
    const file = join(dist, href.replace(/^\//, ""));
    try {
      const bytes = readFileSync(file);
      if (extname(file) === ".woff2") return sum + bytes.length;
      return sum + gzipSync(bytes).length;
    } catch {
      return sum;
    }
  }, 0);
}

function kb(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

main();
