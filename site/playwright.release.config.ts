import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// The release check (e2e/release.spec.ts), run before every production deploy. The dev server runs in test mode
// (no file watching, no reloads) and with a bigger heap, because the catalogue data is large.
export default defineConfig({
  ...base,
  testMatch: ["release.spec.ts"],
  timeout: 90_000,
  workers: 3,
  outputDir: "test-results-release",
  webServer: process.env.PW_EXTERNAL_SERVER ? undefined : { command: "node --max-old-space-size=6144 node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5180 --strictPort --mode test", url: "http://127.0.0.1:5180", reuseExistingServer: true, timeout: 180_000 },
  use: { ...base.use, baseURL: process.env.PW_BASE_URL || "http://127.0.0.1:5180" },
});
