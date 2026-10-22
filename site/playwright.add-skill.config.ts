import { defineConfig } from "@playwright/test";
export default defineConfig({ testDir: "e2e", testMatch: "add-skill.spec.ts", outputDir: ".wrangler/add-skill-browser", timeout: 60000, workers: 1, reporter: "list", use: { baseURL: process.env.ADD_SKILL_TEST_URL || "http://127.0.0.1:5199", channel: "chrome", viewport: { width: 1440, height: 1000 }, trace: "retain-on-failure" } });
