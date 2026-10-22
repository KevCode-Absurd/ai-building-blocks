// One actual Chrome microphone capture -> app WAV -> real server handler ->
// real OpenAI transcription. Synthetic public text only; never print keys/audio.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { handleTranscription, voiceDuration } from '../site/src/server/transcription.ts';
import { memoryComposer } from '../site/src/server/composer.ts';
import { loadWorkflowEnv } from './lib/workflow-env.mjs';
const require = createRequire(path.resolve('site/package.json'));
const { chromium } = require('@playwright/test');
const origin = process.argv[2] || 'http://127.0.0.1:5184';
assert(origin === 'http://127.0.0.1:5184');
const env = { ...loadWorkflowEnv(path.resolve('.')), WORKFLOW_COMPOSER_ENABLED: 'true', WORKFLOW_SALT: 'local-voice-canary', WORKFLOW_DAILY_CAP_USD: '.05' };
assert(env.OPENAI_API_KEY, 'The configured OpenAI key is required.');
const store = memoryComposer(); let providerCalls = 0, duration = 0, bytes = 0;
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--use-file-for-fake-audio-capture=' + path.resolve('site/test/fixtures/voice-request.wav')] });
try {
  const context = await browser.newContext({ permissions: ['microphone'], viewport: { width: 1440, height: 950 } });
  await context.route('**/api/security', route => route.fulfill({ json: { required: false } }));
  await context.route('**/api/transcribe', async route => {
    const audio = route.request().postDataBuffer(); bytes = audio.length; duration = voiceDuration(audio);
    const response = await handleTranscription(new Request(origin + '/api/transcribe', { method: 'POST', headers: route.request().headers(), body: audio }), env, store, 'canary', async (...args) => { providerCalls++; assert(providerCalls <= 1, 'Exactly one paid canary is allowed.'); return fetch(...args); });
    await route.fulfill({ status: response.status, contentType: 'application/json', body: await response.text() });
  });
  const page = await context.newPage(); await page.goto(origin + '/compose');
  const reject = page.getByRole('button', { name: 'Reject cookies', exact: true }); if (await reject.isVisible()) await reject.click();
  const goal = page.getByTestId('compose-goal'), voice = page.getByTestId('compose-voice');
  await goal.fill('Please'); await voice.click(); await voice.filter({ hasText: 'Stop recording' }).waitFor();
  assert(await goal.isDisabled());
  await page.waitForTimeout(6500); await voice.click();
  await page.waitForFunction(() => document.querySelector('[data-testid="compose-goal"]').value.length > 12, { timeout: 80000 });
  const text = await goal.inputValue();
  assert.match(text, /landing page/i); assert.match(text, /coffee shop/i); assert(text.startsWith('Please ')); assert.equal(providerCalls, 1);
  assert(await goal.isEnabled());
  await page.screenshot({ path: 'reports/voice-transcription-browser.png' });
  await fs.writeFile('reports/voice-transcription-browser.json', JSON.stringify({ checkedOn: new Date().toISOString(), status: 'pass', browser: 'installed Chrome', realMicrophoneCapturePipeline: true, physicalMicrophone: false, syntheticFixture: 'Build a landing page for my coffee shop and check it before publishing.', provider: 'OpenAI', model: 'whisper-1', providerCalls, duration, bytes, transcript: text, maximumEstimatedCostUSD: Math.ceil(duration) * .006 / 60 * 1.25, keepsExistingText: true, editableAfterTranscription: true, serverAudioOrTranscriptPersistence: false }, null, 2) + '\n');
  console.log(JSON.stringify({ status: 'pass', providerCalls, duration, bytes, matchesFixture: true }));
} finally { await browser.close(); }
