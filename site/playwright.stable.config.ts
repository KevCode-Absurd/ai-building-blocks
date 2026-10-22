import { defineConfig } from "@playwright/test";
import base from "./playwright.config";
// Browser checks against a stable source snapshot, without regenerating public assets.
export default defineConfig({ ...base, use: { ...base.use, baseURL: "http://127.0.0.1:5190" }, webServer: { command: "node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5190 --strictPort --mode test", url: "http://127.0.0.1:5190", reuseExistingServer: true, timeout: 60000 } });
