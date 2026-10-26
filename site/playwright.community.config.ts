import { defineConfig } from "@playwright/test";
import stable from "./playwright.stable.config";
export default defineConfig({ ...stable, testMatch: "community.spec.ts", outputDir: "test-results-community", projects: stable.projects?.map(p => p.name === "desktop" ? { ...p, grepInvert: undefined } : p) });
