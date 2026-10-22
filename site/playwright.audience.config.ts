import { defineConfig } from '@playwright/test';
import path from 'node:path';
import base from './playwright.config';

export default defineConfig({
  ...base,
  testMatch: ['audience-starters.spec.ts'],
  webServer: undefined,
  timeout: 60000,
  workers: 2,
  outputDir: '.wrangler/audience-browser',
  metadata: { editorReleaseRoot: process.env.EDITOR_RELEASE_ROOT ? path.resolve(process.env.EDITOR_RELEASE_ROOT) : 'source-preview' },
  use: { ...base.use, baseURL: process.env.EDITOR_TEST_URL || 'http://127.0.0.1:5186' },
  reporter: [['list'], ['json', { outputFile: '../reports/2026-10-22-audience-built-browser.json' }]],
});
