import { expect, test } from "@playwright/test";

/**
 * The three instruments, driven the way a person drives them. The jsdom tests
 * prove the handlers are wired; these prove the thing is actually operable with
 * a pointer and a keyboard, which is a different claim.
 */

test("the mode engine rearranges when you choose a layout", async ({ page }) => {
  await page.goto("/");
  const stage = page.locator("[data-stage]");
  await expect(stage).toHaveAttribute("data-layout", /codex|mosaic|lattice/);

  await page.getByRole("button", { name: "Mosaic", exact: true }).first().click();
  await expect(stage).toHaveAttribute("data-layout", "mosaic");
  await expect(page.locator("[data-mode]").first()).toHaveText("MOSAIC");

  const columns = await stage.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(" ").length);
  expect(columns, "mosaic should be a multi-column grid").toBeGreaterThan(1);
});

test("hovering an object produces a read, and pin refuses it", async ({ page }) => {
  await page.goto("/");
  const object = page.locator("[data-object]").first();
  await object.hover();
  await page.waitForTimeout(1600);
  await expect(page.locator("[data-read]").first()).not.toHaveText("DEMO");

  await page.getByRole("button", { name: "Pin", exact: true }).first().click();
  await expect(page.locator("[data-read]").first()).toHaveText("PINNED BY YOU");
  await page.locator("[data-object]").nth(1).hover();
  await page.waitForTimeout(300);
  await expect(page.locator("[data-read]").first()).toHaveText("PINNED BY YOU");
});

test("the dial responds to the keyboard as well as the drag", async ({ page }) => {
  await page.goto("/work/verde/");
  const range = page.locator("[data-threshold]");
  await range.focus();
  await range.press("Home");
  await expect(page.locator("[data-threshold-out]")).toHaveText("10");
  await expect(page.locator("[data-live-pump]")).toHaveText("ON");

  for (let i = 0; i < 50; i += 1) await range.press("ArrowRight");
  await expect(page.locator("[data-threshold-out]")).toHaveText("60");
  await expect(page.locator("[data-live-pump]")).toHaveText("ON");

  await page.getByRole("button", { name: "Auto", exact: true }).click();
  await expect(page.locator("[data-live-pump]")).toHaveText("ON");
  await page.getByRole("button", { name: "Pump", exact: true }).click();
  await expect(page.locator("[data-why]")).toHaveText("manual override");
});

test("the ledger filter changes what is on screen", async ({ page }) => {
  await page.goto("/notes/the-pattern/");
  const rows = page.locator("[data-ledger-row]");
  await expect(rows).toHaveCount(34);

  await page.getByRole("button", { name: "X", exact: true }).click();
  await expect(rows.locator(":visible")).toHaveCount(8);
  await expect(page.locator("[data-ledger-count]")).toHaveText("8");

  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(rows.locator(":visible")).toHaveCount(34);
});

test("the cloth opens and reveals the next entry", async ({ page }) => {
  await page.goto("/");
  const cloth = page.locator(".cloth");
  await expect(cloth).not.toHaveAttribute("open", "");
  await cloth.locator("summary").click();
  await expect(cloth).toHaveAttribute("open", "");
  await expect(page.getByRole("heading", { name: /Entry 010/i })).toBeVisible();
});
