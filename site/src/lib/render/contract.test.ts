/**
 * Contract tests: the built site must match what the content says it is.
 *
 * These run against site/dist, so they catch the failure mode unit tests miss —
 * a page that exists in the manifest but was never written, or a page written
 * but missing from the sitemap.
 */
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { test } from "node:test";
import { INDEXABLE, ROUTES } from "../../content/routes.ts";
import { PROJECTS } from "../../content/projects.ts";

const dist = resolve(import.meta.dirname, "../../../dist");
const built = existsSync(dist);

test("every route in the manifest has a file on disk", { skip: !built }, () => {
  for (const route of ROUTES) {
    assert.ok(existsSync(join(dist, route.file)), `${route.path} → ${route.file} missing`);
  }
});

test("no page is written that the manifest does not know about", { skip: !built }, () => {
  const found: string[] = [];
  const walk = (dir: string): void => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        if (name !== "assets") walk(full);
      } else if (name.endsWith(".html")) {
        found.push(full.slice(dist.length + 1));
      }
    }
  };
  walk(dist);
  const known = new Set(ROUTES.map((r) => r.file));
  for (const file of found) assert.ok(known.has(file), `${file} is not in routes.ts`);
});

test("the sitemap lists exactly the indexable routes", { skip: !built }, () => {
  const xml = readFileSync(join(dist, "sitemap.xml"), "utf8");
  assert.equal((xml.match(/<url>/g) ?? []).length, INDEXABLE.length);
  for (const route of PROJECTS) {
    assert.ok(xml.includes(`/work/${route.slug}/`), `${route.slug} missing from sitemap`);
  }
});

test("every page carries one description and one canonical origin-free link", { skip: !built }, () => {
  for (const route of ROUTES) {
    const html = readFileSync(join(dist, route.file), "utf8");
    assert.equal((html.match(/<meta name="description"/g) ?? []).length, 1, route.path);
    assert.ok(!/<link rel="canonical" href="\//.test(html), `${route.path} has a relative canonical`);
  }
});

test("the home page ships the Person and WebSite records", { skip: !built }, () => {
  const html = readFileSync(join(dist, "index.html"), "utf8");
  assert.ok(html.includes('"@type":"Person"'));
  assert.ok(html.includes('"@type":"WebSite"'));
});

test("each entry page ships its own CreativeWork and status", { skip: !built }, () => {
  for (const project of PROJECTS) {
    const html = readFileSync(join(dist, "work", project.slug, "index.html"), "utf8");
    assert.ok(html.includes('"@type":"CreativeWork"'), project.slug);
    assert.ok(html.includes(project.status), project.slug);
  }
});
