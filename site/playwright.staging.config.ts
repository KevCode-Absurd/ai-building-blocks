import { defineConfig } from '@playwright/test';
import base from './playwright.config';
import { stagingTarget } from '../tools/lib/cloudflare-staging-target.mjs';

// Uses the deployed stable build; never starts Vite, builds, or calls a model.
export default defineConfig({
  ...base,
  testMatch: ['site.spec.ts', 'composer.spec.ts', 'composer-fresh.spec.ts', 'composer-auth.spec.ts', 'skill-replacement.spec.ts', 'audience-starters.spec.ts', 'staging-smoke.spec.ts', 'staging-real-writes.spec.ts', 'api-security.spec.ts', 'turnstile-cleanup.spec.ts', 'apps.spec.ts', 'tools.spec.ts', 'ai-tools.spec.ts', 'traction.spec.ts', 'work-expansion.spec.ts', 'usability-refinement.spec.ts', 'imported.spec.ts'],
  outputDir: 'test-results-staging',
  workers: 2,
  timeout: 60_000,
  metadata: { environment: 'isolated staging', deployedVersion: process.env.CF_STAGING_VERSION },
  use: { ...base.use, baseURL: stagingTarget(), trace: 'off', video: 'off' },
  webServer: undefined,
});
