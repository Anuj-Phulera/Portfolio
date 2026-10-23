import { defineConfig, devices } from "@playwright/test";

/**
 * Browser verification. This suite cannot run on the machine that built the
 * site — there is no browser there and the download is blocked — so it runs in
 * CI, where a real Chromium is available. That is the whole point: the claims
 * the build could not check are checked here on every push.
 */
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // A JSON report is always written so CI can turn failures into a PR comment.
  reporter: [["list"], ["json", { outputFile: "results.json" }]],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npx vite preview --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173/",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
