import { test } from "@playwright/test";

/**
 * Screenshots, uploaded as a CI artifact. They are not assertions — they are
 * evidence, so that a person can look at the site without having to build it.
 */
const PAGES = [
  ["home", "/"],
  ["entries", "/work/"],
  ["strata", "/work/strata/"],
  ["verde", "/work/verde/"],
  ["pattern", "/notes/the-pattern/"],
  ["colophon", "/colophon/"],
  ["404", "/404.html"],
] as const;

for (const [name, path] of PAGES) {
  test(`screenshot ${name}`, async ({ page }, testInfo) => {
    await page.goto(path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: `test-results/shots/${testInfo.project.name}/${name}.png`,
      fullPage: true,
    });
  });
}

test("screenshot the reduced-motion home", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `test-results/shots/${testInfo.project.name}/home-reduced.png`,
    fullPage: true,
  });
});

test("screenshot print view", async ({ page }, testInfo) => {
  await page.goto("/work/strata/", { waitUntil: "networkidle" });
  await page.emulateMedia({ media: "print" });
  await page.screenshot({
    path: `test-results/shots/${testInfo.project.name}/strata-print.png`,
    fullPage: true,
  });
});
