import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "e2e", testMatch: ["persistence.spec.ts", "account-settings.spec.ts", "live-sync.spec.ts"], timeout: 30_000, workers: 1,
  use: { baseURL: "http://127.0.0.1:5195", channel: "chrome", viewport: { width: 1440, height: 1000 }, trace: "retain-on-failure" },
  webServer: process.env.PW_PERSISTENCE_EXTERNAL ? undefined : { command: "node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5195 --strictPort --mode test", url: "http://127.0.0.1:5195", reuseExistingServer: true, timeout: 60_000 },
});
