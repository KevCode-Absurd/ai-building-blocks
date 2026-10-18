import { defineConfig, devices } from "@playwright/test";

// End-to-end tests run against the dev server in the machine's installed Chrome (no browser download).
// Set PW_CHANNEL=msedge to use Edge, or PW_CHANNEL= (empty) to use Playwright's own Chromium after `npx playwright install`.
const channel = process.env.PW_CHANNEL ?? "chrome";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:5180", colorScheme: "dark", trace: "retain-on-failure", ...(channel ? { channel } : {}) },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, ...(channel ? { channel } : {}) }, grepInvert: /@mobile/ },
    { name: "mobile", use: { ...devices["Pixel 7"], ...(channel ? { channel } : {}) }, grep: /@mobile/ },
  ],
  webServer: { command: "npm run dev", url: "http://localhost:5180", reuseExistingServer: true, timeout: 60_000 },
});
