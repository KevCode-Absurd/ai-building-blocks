import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'e2e', testMatch: 'voice.spec.ts', grep: /recorded voice|recorded transcript/,
  timeout: 45000, workers: 1, outputDir: '../runs/voice-browser-contract',
  reporter: [['list'], ['json', { outputFile: '../reports/voice-browser-contract.json' }]],
  use: { baseURL: process.env.VOICE_QA_BASE_URL || 'http://127.0.0.1:5184', channel: 'chrome', viewport: { width: 1440, height: 950 }, trace: 'off' },
});
