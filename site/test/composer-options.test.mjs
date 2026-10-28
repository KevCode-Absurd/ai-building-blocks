import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { handleComposer, memoryComposer, d1Composer } from '../src/server/composer.ts';
import { accountAttemptLimit } from '../src/lib/composer-policy.ts';
import { decodeCatalogue, freeSelection, LIMITS, LEGACY_REQUEST_LIMIT } from '../src/lib/composer-core.ts';
import { callModel, MODELS } from '../src/lib/composer-models.ts';
import { ROUTING_SCHEMA, parseIntents } from '../src/lib/composer-semantic.ts';
const c = decodeCatalogue(JSON.parse(fs.readFileSync('public/data/blocks.json')));
const goal = 'Build a landing page from scratch';
const env = { WORKFLOW_COMPOSER_ENABLED: 'true', OPENAI_API_KEY: 'test-openai', ANTHROPIC_API_KEY: 'test-anthropic', WORKFLOW_UNLIMITED_USER_ID: 'user_owner' };
const req = (patch = {}, id = crypto.randomUUID()) => new Request('https://example.test/api/compose', { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': id }, body: JSON.stringify({ goal, context: '', ...patch }) });
const output = value => ({ text: JSON.stringify(value), cost: .001, latencyMs: 1, usage: { input: 100, output: 100, cached: 0, cacheWrite: 0 }, finish: 'completed' });
const runner = async (_m, _k, _p, schema) => { const plan = freeSelection(c, goal); const mind = schema.properties.steps?.items.properties.minds?.items.enum?.[0]; plan.steps.forEach(s => { s.minds = mind ? [mind] : []; }); return output(schema.properties.intents ? { intents: [{ query: goal, kind: 'create' }] } : schema.properties.issues ? { issues: [] } : plan); };
test('model discovery exposes exactly the approved choices with truthful credential availability', async () => {
  for (const patch of [{}, { ANTHROPIC_API_KEY: undefined }, { OPENAI_API_KEY: undefined }, { WORKFLOW_COMPOSER_ENABLED: 'false' }]) {
    const e = { ...env, ...patch };
    const r = await handleComposer(new Request('https://example.test/api/compose'), c, e, memoryComposer(), 'ip');
    const data = await r.json();
    assert.equal(data.defaultModel, 'gpt-6-luna');
    assert.deepEqual(data.models.map(m => m.id), ['gpt-6-luna', 'gpt-6.1-sol', 'claude-haiku-5-5']);
    assert(data.models.every(m => Object.keys(m).sort().join() === 'available,id,label'));
    assert.equal(data.models[0].available, e.WORKFLOW_COMPOSER_ENABLED === 'true' && !!e.OPENAI_API_KEY);
    assert.equal(data.models[2].available, e.WORKFLOW_COMPOSER_ENABLED === 'true' && !!e.ANTHROPIC_API_KEY);
    assert.equal(data.enabled, data.models.some(m => m.available));
    assert(!JSON.stringify(data).includes('test-openai')); assert(!JSON.stringify(data).includes('user_owner'));
  }
});
for (const model of ['gpt-6-luna', 'gpt-6.1-sol', 'claude-haiku-5-5']) test('explicit approved dispatch and billing: ' + model, async () => {
  const store = memoryComposer(); let calls = 0;
  const r = await handleComposer(req({ model }), c, env, store, 'ip', async (m, key, ...args) => {
    assert.equal(m.id, model); assert.equal(key, model.startsWith('claude') ? env.ANTHROPIC_API_KEY : env.OPENAI_API_KEY); calls++; return runner(m, key, ...args);
  }, 'user_other');
  assert.equal(r.status, 200); assert.equal((await r.json()).model, model);
  assert.equal(calls, model === 'gpt-6-luna' ? 3 : 2);
  assert.equal((await store.usage('user_other', new Date().toISOString().slice(0, 10))).estimatedCost, .001 * calls);
});
test('invalid or unavailable selections reject before catalogue access or a reservation', async () => {
  for (const model of ['claude-sonnet-5-5', 'gpt-6-astra', '', null, {}, ['gpt-6-luna']]) {
    const r = await handleComposer(req({ model }), () => { throw Error('No catalogue'); }, env, memoryComposer(), 'ip', () => { throw Error('No provider'); }, 'user_other');
    assert.equal(r.status, 400);
  }
  const store = memoryComposer();
  assert.equal((await handleComposer(req({ model: 'claude-haiku-5-5' }), () => { throw Error('No catalogue'); }, { ...env, ANTHROPIC_API_KEY: undefined }, store, 'ip', runner, 'user_other')).status, 503);
  assert.equal((await store.usage('user_other', new Date().toISOString().slice(0, 10))).attemptsToday, 0);
});
test('model is part of account-scoped idempotency and omitted model stays Luna', async () => {
  const store = memoryComposer(), id = crypto.randomUUID(); let calls = 0;
  const run = async (...args) => { calls++; return runner(...args); };
  const first = await handleComposer(req({}, id), c, env, store, 'ip', run, 'user_other');
  assert.equal((await first.json()).model, 'gpt-6-luna');
  assert.equal((await handleComposer(req({ model: 'gpt-6-luna' }, id), c, env, store, 'ip', run, 'user_other')).status, 200);
  assert.equal(calls, 3);
  assert.equal((await handleComposer(req({ model: 'gpt-6.1-sol' }, id), c, env, store, 'ip', run, 'user_other')).status, 409);
  assert.equal(calls, 3);
});
test('new submissions enforce request and context bounds before catalogue access while preserving legacy request capacity', async () => {
  assert.equal(LIMITS.request, 3000); assert.equal(LIMITS.context, 12000); assert.equal(LEGACY_REQUEST_LIMIT, 10000);
  let calls = 0;
  for (const length of [3001, 10000]) assert.equal((await handleComposer(req({ goal: goal.padEnd(length, 'x') }), () => { throw Error('No catalogue'); }, env, memoryComposer(), 'ip', async () => { calls++; }, 'user_owner')).status, 400);
  assert.equal((await handleComposer(req({ context: 'x'.repeat(LIMITS.context + 1) }), () => { throw Error('No catalogue'); }, env, memoryComposer(), 'ip', async () => { calls++; }, 'user_owner')).status, 400);
  assert.equal(calls, 0);
});
test('owner policy is exact, fail-closed and cannot be requested by another subject', () => {
  assert.equal(accountAttemptLimit(env, 'user_owner'), null);
  for (const user of ['user_other', 'user_ownerx', '', '*']) assert.equal(accountAttemptLimit(env, user), 5);
  for (const configured of ['*', 'user_owner,user_other', ' user_owner ', '']) assert.equal(accountAttemptLimit({ ...env, WORKFLOW_UNLIMITED_USER_ID: configured }, 'user_owner'), 5);
  assert.equal(accountAttemptLimit({ ...env, WORKFLOW_DAILY_ATTEMPT_LIMIT: 'invalid' }, 'user_owner'), 0);
});
for (const mode of ['memory', 'D1']) test(mode + ': owner daily-count exemption preserves shared budget and ordinary-user account/IP limits', async () => {
  let db; let store;
  if (mode === 'memory') store = memoryComposer();
  else {
    db = new DatabaseSync(':memory:');
    for (const file of ['0004_composer.sql', '0005_composer_accounts.sql']) db.exec(fs.readFileSync('migrations/' + file, 'utf8'));
    store = d1Composer({ prepare(sql) { return { bind(...values) { return { async first() { return db.prepare(sql).get(...values) ?? null; }, async run() { return db.prepare(sql).run(...values); } }; } }; } });
  }
  try {
    const job = { fingerprint: 'f', day: '2026-10-23', user_id: 'user_owner', charge: .1, status: 'pending', result: null };
    const owner = await Promise.all(Array.from({ length: 12 }, (_, i) => store.claim({ ...job, id: 'owner-' + i, ip: 'ip-' + i }, 10, accountAttemptLimit(env, 'user_owner'))));
    assert.equal(owner.filter(Boolean).length, 12);
    const ordinary = await Promise.all(Array.from({ length: 9 }, (_, i) => store.claim({ ...job, user_id: 'user_other', id: 'other-' + i, ip: 'other-' + i }, 10, accountAttemptLimit(env, 'user_other'))));
    assert.equal(ordinary.filter(Boolean).length, 5);
    const sameIP = await Promise.all(Array.from({ length: 13 }, (_, i) => store.claim({ ...job, id: 'same-' + i, ip: 'same' }, 10, null)));
    assert.equal(sameIP.filter(Boolean).length, 13);
    const ordinaryIP = await Promise.all(Array.from({length:13},(_,i)=>store.claim({...job,id:'ordinary-ip-'+i,user_id:'ordinary-'+i,ip:'ordinary-same'},10,5)));
    assert.equal(ordinaryIP.filter(Boolean).length,10);
    assert.equal(await store.claim({ ...job, id: 'cost-denied', ip: 'new', charge: 10 }, 10, null), false);
    assert.equal(await store.claim({ ...job, id: 'owner-0', ip: 'duplicate' }, 10, null), false);
  } finally { db?.close(); }
});
test('spoofed owner fields never bypass the ordinary account limit', async () => {
  const store = memoryComposer();
  for (let i = 0; i < 6; i++) {
    const r = await handleComposer(req({ userId: 'user_owner', unlimited: true, dailyAttemptLimit: null, model: 'claude-haiku-5-5' }), c, env, store, 'ip-' + i, runner, 'user_other');
    assert.equal(r.status, i < 5 ? 200 : 429);
  }
});
test('Anthropic receives its supported schema while original constraints and application checks stay intact', async () => {
  const schema = structuredClone(ROUTING_SCHEMA);
  let sent;
  await callModel(MODELS.find(m => m.id === 'claude-haiku-5-5'), 'test', { system: 'x', user: 'x' }, schema, 1600, async (_url, options) => {
    sent = JSON.parse(options.body).output_config.format.schema;
    return Response.json({ content: [{ type: 'text', text: '{"intents":[{"query":"x","kind":"create"}]}' }], stop_reason: 'end_turn', usage: { input_tokens: 10, output_tokens: 10 } });
  });
  assert.equal(sent.properties.intents.maxItems, undefined);
  assert.equal(sent.properties.intents.minItems, 1);
  assert.match(sent.properties.intents.description, /"maxItems":8/);
  assert.equal(sent.additionalProperties, false);
  assert.deepEqual(sent.properties.intents.items.properties.kind.enum, ROUTING_SCHEMA.properties.intents.items.properties.kind.enum);
  assert.deepEqual(schema, ROUTING_SCHEMA, 'Provider adaptation must not mutate the source schema or OpenAI requests.');
  assert.throws(() => parseIntents(JSON.stringify({ intents: Array(9).fill({ query: 'x', kind: 'create' }) })));
});
