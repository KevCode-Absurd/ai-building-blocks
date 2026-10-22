import { defineConfig } from "@playwright/test";
import base from "./playwright.config";
export default defineConfig({ ...base,
  testMatch: ["composer-auth.spec.ts", "composer.spec.ts"],
  outputDir: "test-results-auth",
  use: { ...base.use, baseURL: "http://127.0.0.1:5194" },
  webServer: { command: "node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5194 --strictPort", url: "http://127.0.0.1:5194", reuseExistingServer: true, timeout: 60000 },
});
