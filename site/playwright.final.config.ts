import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  workers: 3,
  outputDir: 'test-results-final',
  reporter: [['list'], ['json', { outputFile: '../reports/2026-10-24-final-e2e-baseline.json' }]],
  use: { ...base.use, baseURL: 'http://127.0.0.1:5281' },
  webServer: undefined,
});

