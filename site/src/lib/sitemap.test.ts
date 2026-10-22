import assert from "node:assert/strict";
import { test } from "node:test";
import { INDEXABLE, ROUTES, routeByPath } from "../content/routes.ts";
import { robotsTxt, sitemapXml } from "./sitemap.ts";

test("routes are unique by path and by output file", () => {
  assert.equal(new Set(ROUTES.map((r) => r.path)).size, ROUTES.length);
  assert.equal(new Set(ROUTES.map((r) => r.file)).size, ROUTES.length);
});

test("every content route is present and the 404 is not indexable", () => {
  assert.ok(routeByPath("/"));
  assert.ok(routeByPath("/work/"));
  assert.ok(routeByPath("/work/strata/"));
  assert.ok(routeByPath("/colophon/"));
  assert.equal(routeByPath("/404.html")?.noindex, true);
  assert.equal(INDEXABLE.length, ROUTES.length - 1);
});

test("priorities stay inside the sitemap's legal range", () => {
  for (const route of ROUTES) {
    assert.ok(route.priority >= 0 && route.priority <= 1, route.path);
    assert.ok(route.description.length > 10, `${route.path} needs a description`);
  }
});

test("the sitemap lists indexable routes and skips the error page", () => {
  const xml = sitemapXml(ROUTES, "https://example.test", "2026-10-22");
  assert.ok(xml.startsWith('<?xml version="1.0"'));
  assert.ok(xml.includes("<loc>https://example.test/work/strata/</loc>"));
  assert.ok(!xml.includes("/404.html"));
  assert.equal((xml.match(/<url>/g) ?? []).length, INDEXABLE.length);
});

test("the sitemap applies a deploy prefix", () => {
  process.env.SITE_BASE = "/Portfolio/";
  const xml = sitemapXml(ROUTES, "https://example.test", "2026-10-22");
  delete process.env.SITE_BASE;
  assert.ok(xml.includes("<loc>https://example.test/Portfolio/work/</loc>"), xml.slice(0, 400));
});

test("robots points at the sitemap only when an origin is known", () => {
  assert.ok(!robotsTxt(null).includes("Sitemap:"));
  assert.ok(robotsTxt("https://example.test").includes("Sitemap: https://example.test/sitemap.xml"));
});

test("XML special characters are escaped", () => {
  const route = {
    path: "/a&b/",
    file: "a/index.html",
    kind: "note" as const,
    title: "A & B",
    description: "d",
    priority: 0.5,
    changeFrequency: "yearly" as const,
    noindex: false,
  };
  const xml = sitemapXml([route], "https://example.test", "2026-10-22");
  assert.ok(xml.includes("/a&amp;b/"), xml);
});
