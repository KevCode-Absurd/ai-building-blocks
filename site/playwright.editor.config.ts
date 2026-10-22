import { defineConfig } from "@playwright/test";
import path from "node:path";
import base from "./playwright.config";

// Set both variables to an immutable preview when recording release evidence.
export default defineConfig({
  ...base,
  testMatch: ["account-minds.spec.ts", "composer-auth.spec.ts", "composer-matching.spec.ts", "composer.spec.ts", "custom-minds.spec.ts", "voice.spec.ts", "workflow-execution.spec.ts", "add-skill.spec.ts", "space-workflow-execution.spec.ts"],
  webServer: undefined,
  timeout: 60000,
  workers: 2,
  outputDir: ".wrangler/editor-browser",
  metadata: { editorReleaseRoot: process.env.EDITOR_RELEASE_ROOT ? path.resolve(process.env.EDITOR_RELEASE_ROOT) : "source-preview" },
  use: { ...base.use, baseURL: process.env.EDITOR_TEST_URL || "http://127.0.0.1:5199" },
  reporter: [["list"], ["json", { outputFile: "../reports/2026-10-22-workflow-editor-built-browser.json" }]],
});
