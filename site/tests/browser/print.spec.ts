import { expect, test } from "@playwright/test";

/** Print is a promised path, so it gets a test rather than a stylesheet and hope. */
test.use({ viewport: { width: 1024, height: 1400 } });

test("print removes the chrome and keeps the content", async ({ page }) => {
  await page.goto("/work/strata/");
  await page.emulateMedia({ media: "print" });

  await expect(page.locator(".masthead")).toBeHidden();
  await expect(page.locator(".skip")).toBeHidden();
  await expect(page.locator(".instrument__controls").first()).toBeHidden();
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".prose").first()).toBeVisible();

  const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(background).toBe("rgb(255, 255, 255)");
});
