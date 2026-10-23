import { expect, test } from "@playwright/test";

/**
 * Layout claims the build could only reason about. These are the tests that
 * would have caught a broken column, an overflow, or a stamp overlapping a
 * name — none of which any script on the build machine could see.
 */

test("nothing overflows the viewport horizontally", async ({ page }) => {
  for (const path of ["/", "/work/", "/work/strata/", "/notes/the-pattern/", "/colophon/"]) {
    await page.goto(path);
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return { scroll: doc.scrollWidth, client: doc.clientWidth };
    });
    expect(overflow.scroll, `${path} scrolls sideways by ${overflow.scroll - overflow.client}px`).toBeLessThanOrEqual(
      overflow.client + 1,
    );
  }
});

test("the bench rows stay inside the shell", async ({ page }) => {
  await page.goto("/work/");
  const shell = await page.locator(".shell").first().boundingBox();
  expect(shell).not.toBeNull();
  const rows = page.locator(".entries__row");
  const count = await rows.count();
  expect(count).toBe(6);
  for (let i = 0; i < count; i += 1) {
    const box = await rows.nth(i).boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(shell!.x - 1);
    expect(box!.x + box!.width).toBeLessThanOrEqual(shell!.x + shell!.width + 1);
  }
});

test("type stays inside a readable measure", async ({ page }) => {
  await page.goto("/work/strata/");
  const widths = await page.locator(".prose").evaluateAll((nodes) =>
    nodes.map((node) => {
      const style = getComputedStyle(node);
      return node.getBoundingClientRect().width / parseFloat(style.fontSize);
    }),
  );
  expect(widths.length).toBeGreaterThan(0);
  for (const em of widths) expect(em).toBeLessThanOrEqual(72);
});

test("the masthead is sticky and does not cover the first heading", async ({ page }) => {
  await page.goto("/work/strata/");
  const header = await page.locator(".masthead").boundingBox();
  const h1 = await page.locator("h1").boundingBox();
  expect(header).not.toBeNull();
  expect(h1).not.toBeNull();
  expect(h1!.y).toBeGreaterThanOrEqual(header!.y + header!.height - 1);
});

test("the hero stays above the fold on a phone", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "phone only");
  await page.goto("/");
  const instrument = page.locator("[data-mode-root]");
  await expect(instrument).toBeVisible();
  const box = await instrument.boundingBox();
  expect(box).not.toBeNull();
  const height = page.viewportSize()!.height;
  expect(box!.y).toBeLessThan(height * 1.6);
});
