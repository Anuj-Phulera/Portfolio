import { expect, test } from "@playwright/test";

/**
 * The reduced-motion path is a promise the site makes in writing. This is the
 * only place it can be checked, because it needs a real media query.
 */

test("with motion reduced the engine never idles", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("[data-state]").first()).toHaveText("STATIC");
  const layout = await page.locator("[data-stage]").getAttribute("data-layout");
  await page.waitForTimeout(5200);
  await expect(page.locator("[data-stage]")).toHaveAttribute("data-layout", layout ?? "codex");
});

test("with motion reduced nothing is hidden and nothing is postponed", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/strata/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".receipt").first()).toBeVisible();
  const durations = await page.evaluate(() =>
    ["--dur-fast", "--dur-base", "--dur-reveal", "--dur-scene"].map((name) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim(),
    ),
  );
  for (const value of durations) expect(value).toBe("0ms");
});

test("the still controls work without motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Lattice", exact: true }).first().click();
  await expect(page.locator("[data-stage]")).toHaveAttribute("data-layout", "lattice");
});
