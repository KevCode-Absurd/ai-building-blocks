import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Runs the context regressions against the production build. All AI and account
// writes in these tests are intercepted; this configuration never enables live spending. save-retry and
// chunk-recovery pass against the built site; persistence.spec.ts does not yet (its home-page steps expect the dev server).
export default defineConfig({
  ...base,
  testMatch: ["base-specialist.spec.ts", "specialist-teams.spec.ts", "roles.spec.ts", "skill-neighbours-download.spec.ts", "composer-saved-context.spec.ts", "composer-auth.spec.ts", "composer-request-limit.spec.ts", "catalogue-loading.spec.ts", "catalogue-seo.spec.ts", "performance-loading.spec.ts", "save-retry.spec.ts", "chunk-recovery.spec.ts"],
  fullyParallel: false,
  workers: 1,
  use: { ...base.use, baseURL: "http://127.0.0.1:5191" },
  webServer: { command: "node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 5191 --strictPort", url: "http://127.0.0.1:5191", reuseExistingServer: false, timeout: 60000 },
});
