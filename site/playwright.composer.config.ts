import { defineConfig } from "@playwright/test";
import base from "./playwright.stable.config";
// Dedicated preview avoids regenerating 18k static assets for each browser pass.
// This explicit config enables ONE paid smoke call, within the dev server's $2 cap.
process.env.COMPOSER_LIVE_TEST = "1";
export default defineConfig({ ...base, testMatch: ["composer.spec.ts", "composer-live.spec.ts" ] });
