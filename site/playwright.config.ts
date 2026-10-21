import { defineConfig, devices } from "@playwright/test";

// End-to-end tests run against the dev server in the machine's installed Chrome (no browser download).
// Set PW_CHANNEL=msedge to use Edge, or PW_CHANNEL= (empty) to use Playwright's own Chromium after `npx playwright install`.
const channel = process.env.PW_CHANNEL ?? "chrome";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: "http://127.0.0.1:5180", colorScheme: "dark", trace: "retain-on-failure", ...(channel ? { channel } : {}) },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, ...(channel ? { channel } : {}) }, grepInvert: /@mobile/ },
    { name: "mobile", use: { ...devices["Pixel 7"], ...(channel ? { channel } : {}) }, grep: /@mobile/ },
  ],
  // A managed test run can use a server it started explicitly, without a second
  // process regenerating the same public assets if its health check is delayed.
  webServer: process.env.PW_EXTERNAL_SERVER ? undefined : { command: "npm run dev -- --host 127.0.0.1 --strictPort", url: "http://127.0.0.1:5180", reuseExistingServer: true, timeout: 180_000 },
});
