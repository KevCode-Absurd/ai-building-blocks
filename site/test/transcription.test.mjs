import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pcmWav } from '../src/lib/voice-audio.ts';
import { handleTranscription, voiceDuration, MAX_VOICE_BYTES } from '../src/server/transcription.ts';
import { memoryComposer } from '../src/server/composer.ts';
import { apiSecurity } from '../src/server/api-security.ts';
const env = { WORKFLOW_COMPOSER_ENABLED: 'true', OPENAI_API_KEY: 'test-secret', WORKFLOW_SALT: 'test-salt', WORKFLOW_DAILY_CAP_USD: '1' };
const wav = async (seconds = 2, rate = 48000) => new Uint8Array(await pcmWav(new Float32Array(seconds * rate).fill(.1), rate).arrayBuffer());
const req = (audio, id = crypto.randomUUID(), headers = {}) => new Request('https://useaiblocks.com/api/transcribe', { method: 'POST', headers: { 'content-type': 'audio/wav', 'idempotency-key': id, ...headers }, body: audio });

test('PCM resampling has a verifiable duration and a hard five-minute byte cap', async () => {
  for (const rate of [16000, 44100, 48000]) assert.equal(voiceDuration(await wav(2, rate)), 2);
  assert.equal((await wav(301, 16000)).length, MAX_VOICE_BYTES);
  const bytes = await wav();
  for (const offset of [0, 4, 8, 12, 16, 20, 22, 24, 28, 32, 34, 36, 40]) { const bad = bytes.slice(); bad[offset] ^= 255; assert.throws(() => voiceDuration(bad), undefined, String(offset)); }
  assert.throws(() => voiceDuration(bytes.slice(0, 50)));
});
test('real provider contract, bounded text, no recording or transcript persisted', async () => {
  const store = memoryComposer(); let captured;
  const response = await handleTranscription(req(await wav()), env, store, 'visitor', async (url, options) => {
    assert.equal(url, 'https://api.openai.com/v1/audio/transcriptions'); assert.equal(options.headers.authorization, 'Bearer test-secret');
    assert.equal(options.body.get('model'), 'whisper-1'); assert.equal(options.body.get('file').type, 'audio/wav');
    assert.equal(voiceDuration(new Uint8Array(await options.body.get('file').arrayBuffer())), 2);
    return Response.json({ text: 'spoken words '.repeat(1000) });
  });
  assert.equal(response.status, 200); assert.equal((await response.json()).text.length, 10000);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  // A wrapper inspects the same ledger interface used by D1.
  const wrapper = { ...store, async finish(...args) { captured = args; return store.finish(...args); } };
  await handleTranscription(req(await wav()), env, wrapper, 'visitor', async () => Response.json({ text: 'Private spoken request' }));
  assert.equal(captured[3], null); assert.equal(captured[1], .0002); assert.equal(captured[2], 'done');
});
test('replay, concurrent reservations, global cap and visitor allowance prevent repeated spending', async () => {
  const store = memoryComposer(), audio = await wav(); let calls = 0;
  const provider = async () => { calls++; return Response.json({ text: 'Build a landing page' }); };
  const id = crypto.randomUUID();
  assert.equal((await handleTranscription(req(audio, id), env, store, 'ip', provider)).status, 200);
  assert.equal((await handleTranscription(req(audio, id), env, store, 'ip', provider)).status, 409); assert.equal(calls, 1);
  const capStore = memoryComposer(); const small = { ...env, WORKFLOW_DAILY_CAP_USD: '.0003' };
  const responses = await Promise.all([1, 2, 3].map(i => handleTranscription(req(audio), small, capStore, 'ip' + i, provider)));
  assert.equal(responses.filter(r => r.status === 200).length, 1);
  assert.equal((await handleTranscription(req(audio), { ...env, WORKFLOW_DAILY_CAP_USD: 'NaN' }, store, 'ip', provider)).status, 429);
  for (let i = 0; i < 9; i++) assert.equal((await handleTranscription(req(audio), env, store, 'ip', provider)).status, 200);
  assert.equal((await handleTranscription(req(audio), env, store, 'ip', provider)).status, 429);
});
test('disabled, missing key/salt/store, malformed WAV, wrong origin and provider failures fail safely', async () => {
  const audio = await wav(), store = memoryComposer(); let calls = 0;
  const provider = async () => { calls++; throw Error('test-secret'); };
  for (const change of [{ OPENAI_API_KEY: '' }, { WORKFLOW_SALT: '' }, { WORKFLOW_COMPOSER_ENABLED: 'false' }]) assert.equal((await handleTranscription(req(audio), { ...env, ...change }, store, 'ip', provider)).status, 503);
  assert.equal((await handleTranscription(req(audio), env, null, 'ip', provider)).status, 503);
  assert.equal((await handleTranscription(req(audio, undefined, { origin: 'https://attacker.test' }), env, store, 'ip', provider)).status, 403);
  assert.equal((await handleTranscription(req(new Uint8Array(20)), env, store, 'ip', provider)).status, 400);
  assert.equal((await handleTranscription(req(new Uint8Array(MAX_VOICE_BYTES + 1)), env, store, 'ip', provider)).status, 400); assert.equal(calls, 0);
  let finished; const wrapper = { ...store, async finish(...args) { finished = args; return store.finish(...args); } };
  const out = await handleTranscription(req(audio), env, wrapper, 'ip', provider);
  assert.equal(out.status, 502); assert(!JSON.stringify(await out.json()).includes('test-secret')); assert.equal(finished[1], .00025); assert.equal(finished[2], 'failed');
});
test('paid voice route requires both rate limiters and a matching Turnstile action', async () => {
  const allow = { async limit() { return { success: true }; } };
  const security = { API_ALLOWED_HOSTS: 'useaiblocks.com', TURNSTILE_SITE_KEY: 'real-key', TURNSTILE_SECRET_KEY: 'secret', API_WRITE_LIMITER: allow, AI_LIMITER: allow };
  const request = () => req(new Uint8Array(), undefined, { 'cf-connecting-ip': '192.0.2.5', 'x-turnstile-token': 'fresh' });
  assert.equal((await apiSecurity(request(), { ...security, AI_LIMITER: undefined })).status, 503);
  assert.equal((await apiSecurity(request(), security, async () => Response.json({ success: true, hostname: 'useaiblocks.com', action: 'compose' }))).status, 403);
  assert.equal(await apiSecurity(request(), security, async () => Response.json({ success: true, hostname: 'useaiblocks.com', action: 'transcribe' })), null);
});
test('a rejected Whisper request does not consume the reserved transcription budget', async () => {
  const store = memoryComposer(); let settled;
  const wrapper = { ...store, async finish(...args) { settled = args; return store.finish(...args); } };
  const response = await handleTranscription(req(await wav()), env, wrapper, 'ip', async () => Response.json({ error: { code: 'insufficient_quota' } }, { status: 429 }));
  assert.equal(response.status, 502); assert.equal(settled[1], 0); assert.equal(settled[2], 'failed');
});
