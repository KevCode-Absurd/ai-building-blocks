import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { memoryComposer, d1Composer, handleComposer, decodeCatalogue } from '../src/server/composer.ts';
import { dailyAttemptLimit, dailyBudget } from '../src/lib/composer-policy.ts';
import { handleTranscription } from '../src/server/transcription.ts';
import { pcmWav } from '../src/lib/voice-audio.ts';
const c = decodeCatalogue(JSON.parse(fs.readFileSync('public/data/blocks.json', 'utf8')));
const goal = 'Build a landing page from scratch';
const request = () => new Request('https://example.test/api/compose', { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': crypto.randomUUID() }, body: JSON.stringify({ goal, context: '', assignMinds: false }) });
function sqliteStore() {
  const db = new DatabaseSync(':memory:');
  for (const file of ['0004_composer.sql', '0005_composer_accounts.sql']) db.exec(fs.readFileSync('migrations/' + file, 'utf8'));
  const binding = { prepare(sql) { return { bind(...args) { return { async first() { return db.prepare(sql).get(...args) ?? null; }, async run() { return db.prepare(sql).run(...args); } }; } }; } };
  return { store: d1Composer(binding), close: () => db.close() };
}
test('five attempts and ten dollars are configurable defaults; invalid settings disable paid calls', () => {
  assert.equal(dailyAttemptLimit({}), 5); assert.equal(dailyBudget({}), 10);
  assert.equal(dailyAttemptLimit({ WORKFLOW_DAILY_ATTEMPT_LIMIT: '8' }), 8);
  for (const value of ['', 'NaN', '-1', 'Infinity', '0']) assert.equal(dailyBudget({ WORKFLOW_DAILY_CAP_USD: value }), 0);
  for (const value of ['', 'NaN', '-1', 'Infinity', '0', '2.5']) assert.equal(dailyAttemptLimit({ WORKFLOW_DAILY_ATTEMPT_LIMIT: value }), 0);
});
for (const mode of ['memory', 'D1']) test(`${mode}: concurrent requests across IPs admit five, retain failed/pending attempts, reset next day`, async () => {
  const fixture = mode === 'memory' ? { store: memoryComposer(), close() {} } : sqliteStore();
  const { store } = fixture;
  try {
    const job = { fingerprint: 'f', day: '2026-10-23', user_id: 'alice', charge: .1, status: 'pending', result: null };
    const accepted = await Promise.all(Array.from({ length: 30 }, (_, i) => store.claim({ ...job, id: String(i), ip: 'ip-' + i }, 10)));
    assert.equal(accepted.filter(Boolean).length, 5);
    await store.finish('0', 0, 'failed', null);
    assert.equal(await store.claim({ ...job, id: 'sixth', ip: 'changed' }, 10), false);
    assert.equal(await store.claim({ ...job, id: 'bob', user_id: 'bob', ip: 'changed' }, 10), true);
    assert.equal(await store.claim({ ...job, id: 'next-day', day: '2026-10-24', ip: 'changed' }, 10), true);
    assert.equal(await store.claim({ ...job, id: 'increase', ip: 'changed' }, 10, 6), true);
    assert.equal((await store.usage('alice', job.day)).attemptsToday, 6);
  } finally { fixture.close(); }
});
for (const mode of ['memory', 'D1']) test(`${mode}: site-wide ten-dollar reservation cap survives changing users/IPs and includes voice`, async () => {
  const fixture = mode === 'memory' ? { store: memoryComposer(), close() {} } : sqliteStore();
  const { store } = fixture;
  try {
    const day = new Date().toISOString().slice(0, 10);
    const accepted = await Promise.all(Array.from({ length: 40 }, (_, i) => store.claim({ id: String(i), fingerprint: 'f', day, user_id: 'user-' + i, ip: 'ip-' + i, charge: 1, status: 'pending', result: null }, 10)));
    assert.equal(accepted.filter(Boolean).length, 10);
    let calls = 0;
    const runner = async () => { calls++; throw Error('Should never spend'); };
    const response = await handleComposer(request(), c, { WORKFLOW_COMPOSER_ENABLED: 'true', ANTHROPIC_API_KEY: 'fake', WORKFLOW_DEFAULT_MODEL: 'claude-haiku-5-5' }, store, 'new-ip', runner, 'new-user');
    assert.equal(response.status, 429); assert.equal(calls, 0);
    const audio = new Uint8Array(await pcmWav(new Float32Array(32000), 16000).arrayBuffer());
    const voice = new Request('https://example.test/api/transcribe', { method: 'POST', headers: { 'content-type': 'audio/wav', 'idempotency-key': crypto.randomUUID() }, body: audio });
    const transcribed = await handleTranscription(voice, { WORKFLOW_COMPOSER_ENABLED: 'true', OPENAI_API_KEY: 'fake', WORKFLOW_SALT: 'salt' }, store, 'voice-ip', runner);
    assert.equal(transcribed.status, 429); assert.equal(calls, 0);
    await store.finish('0', .5, 'done', null);
    assert.equal(await store.claim({ id: 'released', fingerprint: 'f', day, user_id: 'another', ip: 'another', charge: .5, status: 'pending', result: null }, 10), true);
    assert.equal(await store.claim({ id: 'over', fingerprint: 'f', day, user_id: 'over', ip: 'over', charge: .001, status: 'pending', result: null }, 10), false);
  } finally { fixture.close(); }
});
