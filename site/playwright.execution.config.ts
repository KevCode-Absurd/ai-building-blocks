import { defineConfig } from "@playwright/test";
export default defineConfig({ testDir: "e2e", testMatch: "workflow-execution.spec.ts", outputDir: "../runs/workflow-execution-browser", timeout: 60_000, workers: 1, reporter: "list", use: { baseURL: process.env.EXECUTION_TEST_URL || "http://127.0.0.1:5198", channel: "chrome", viewport: { width: 1440, height: 1000 }, trace: "retain-on-failure" } });
