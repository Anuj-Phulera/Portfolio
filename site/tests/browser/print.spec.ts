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

test("every receipt is open when the page is printed", async ({ page }) => {
  await page.goto("/work/skillverse/");

  // The media query alone must open them: Chromium can take its print snapshot
  // before beforeprint fires, so a listener that only watches the event is a
  // race. No manual dispatch here, on purpose.
  await page.emulateMedia({ media: "print" });

  const collapsed = await page.$$eval("details.receipt", (nodes) =>
    nodes.filter((node) => !(node as HTMLDetailsElement).open).length,
  );
  expect(collapsed).toBe(0);

  // Leaving print media must put the page back, the same way afterprint does.
  // Printing should not leave the screen rearranged.
  await page.emulateMedia({ media: "screen" });
  const after = await page.$$eval("details.receipt", (nodes) =>
    nodes.filter((node) => (node as HTMLDetailsElement).open).length,
  );
  expect(after).toBe(0);
});
