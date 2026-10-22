import { defineConfig } from '@playwright/test';
import base from './playwright.config';

// Exercise the production build in an explicitly started Workers emulator.
// Never start Vite or regenerate public assets from this test configuration.
export default defineConfig({
  ...base,
  testMatch: ['site.spec.ts', 'composer.spec.ts', 'audience-starters.spec.ts'],
  outputDir: 'test-results-workers',
  workers: 2,
  use: { ...base.use, baseURL: 'http://127.0.0.1:5183' },
  webServer: undefined,
});
