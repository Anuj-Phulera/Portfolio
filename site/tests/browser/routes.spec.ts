import { expect, test } from "@playwright/test";

/**
 * Every route, in a real browser: it loads, it titles itself, it console-logs
 * nothing, and it requests nothing that fails.
 */
const ROUTES = [
  ["/", "bench of working systems"],
  ["/work/", "Entries"],
  ["/work/strata/", "STRATA"],
  ["/work/verde/", "VERDE"],
  ["/work/skillverse/", "SKILLVERSE"],
  ["/work/nirmaan/", "NIRMAAN"],
  ["/work/resonate/", "RESONATE"],
  ["/work/rakshabandhan/", "RAKSHABANDHAN"],
  ["/notes/the-pattern/", "The pattern"],
  ["/about/", "About"],
  ["/colophon/", "Colophon"],
] as const;

for (const [path, needle] of ROUTES) {
  test(`${path} loads cleanly`, async ({ page }) => {
    const errors: string[] = [];
    const failed: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("requestfailed", (request) => failed.push(`${request.url()} ${request.failure()?.errorText ?? ""}`));
    page.on("response", (response) => {
      if (response.status() >= 400) failed.push(`${response.status()} ${response.url()}`);
    });

    const response = await page.goto(path, { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(new RegExp(needle, "i"));
    await expect(page.locator("h1")).toHaveCount(1);
    expect(errors, `console errors on ${path}`).toEqual([]);
    expect(failed, `failed requests on ${path}`).toEqual([]);
  });
}

test("the 404 page is served and offers a way back", async ({ page }) => {
  const response = await page.goto("/404.html");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("link", { name: "All entries" })).toBeVisible();
});
