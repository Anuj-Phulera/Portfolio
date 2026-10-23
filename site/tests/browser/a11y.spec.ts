import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const axePath = require.resolve("axe-core/axe.min.js");

const ROUTES = ["/", "/work/", "/work/strata/", "/work/nirmaan/", "/notes/the-pattern/", "/about/", "/colophon/"];

/**
 * The same axe ruleset as `scripts/axe-audit.mjs`, but in a real browser —
 * which means colour contrast is actually evaluated instead of being skipped
 * for want of a layout engine.
 */
for (const path of ROUTES) {
  test(`axe finds no violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.addScriptTag({ path: axePath });
    const result = await page.evaluate(async () => {
      // @ts-expect-error injected at runtime
      return await window.axe.run(document, {
        runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] },
      });
    });
    const violations = result.violations.map(
      (v: { id: string; impact: string; nodes: { target: string[]; failureSummary: string }[] }) =>
        `${v.id} (${v.impact}) at ${v.nodes.map((n) => n.target.join(" ")).join(", ")}: ${v.nodes[0]?.failureSummary?.replace(/\n/g, " ").slice(0, 200)}`,
    );
    expect(violations).toEqual([]);
  });
}

test("the skip link is the first stop and it works", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const focused = await page.evaluate(() => document.activeElement?.className ?? "");
  expect(focused).toContain("skip");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main$/);
});

test("every instrument control is reachable and named", async ({ page }) => {
  await page.goto("/");
  const controls = page.locator(".instrument button");
  const count = await controls.count();
  expect(count).toBeGreaterThanOrEqual(5);
  for (let i = 0; i < count; i += 1) {
    const control = controls.nth(i);
    const name = (await control.textContent())?.trim() ?? "";
    expect(name.length, "a control has no visible label").toBeGreaterThan(0);
  }
});

test("focus is visible on the first nav item", async ({ page }) => {
  await page.goto("/work/");
  const link = page.locator(".nav a").first();
  await link.focus();
  const outline = await link.evaluate((node) => {
    const style = getComputedStyle(node);
    return { width: style.outlineWidth, style: style.outlineStyle };
  });
  expect(outline.style).not.toBe("none");
  expect(parseFloat(outline.width)).toBeGreaterThan(0);
});
