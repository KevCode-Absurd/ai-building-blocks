import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { candidatesFor, decodeCatalogue, freeSelection } from '../src/lib/composer-core.ts';
import { parseIntents, semanticReservation } from '../src/lib/composer-semantic.ts';
import { MODELS, ProviderError } from '../src/lib/composer-models.ts';
import { handleComposer, memoryComposer } from '../src/server/composer.ts';
import { WIDE_CASES } from '../../tools/lib/workflow-wide-cases.mjs';
const c = decodeCatalogue(JSON.parse(fs.readFileSync('public/data/blocks.json', 'utf8')));
for (const task of WIDE_CASES) test(`semantic candidate coverage: ${task.id}`, () => {
  const found = candidatesFor(c, task.goal, {}, task.context ?? '', [{ query: task.query, kind: task.kind }]);
  assert(found.length <= 90); assert.equal(new Set(found.map(b => b.slug)).size, found.length);
  for (const slug of ['request-acceptance-brief', 'request-deliverable-drafter', 'request-acceptance-checker']) assert(found.some(b => b.slug === slug));
  if (task.specialist) assert(found.some(b => new RegExp(task.specialist).test(b.slug)), task.id);
});
test('eight unrelated results share the candidate window without dropping the last task', () => {
  const tasks = ['incident response runbook', 'supplier quote comparison', 'research literature comparison', 'resume job application', 'spreadsheet formula auditor', 'accessibility checker', 'customer reply drafter', 'construction variation decision brief'];
  const found = candidatesFor(c, tasks.join('; '), {}, '', tasks.map(query => ({ query, kind: 'other' })));
  for (const match of [/incident/, /supplier/, /literature|research/, /resume/, /spreadsheet/, /accessibility/, /reply/, /construction/]) assert(found.some(b => match.test(b.slug)), String(match));
});
test('invalid interpretations cannot become workflow instructions', () => {
  for (const value of [{}, { intents: [] }, { intents: Array(9).fill({ query: 'x', kind: 'create' }) }, { intents: [{ query: '', kind: 'create' }] }, { intents: [{ query: 'x', kind: 'execute-arbitrary-tools' }] }]) assert.throws(() => parseIntents(JSON.stringify(value)));
});
const model = MODELS.find(m => m.id === 'gpt-6.1-sol');
const env = { OPENAI_API_KEY: 'unit-test', WORKFLOW_COMPOSER_ENABLED: 'true', WORKFLOW_DEFAULT_MODEL: model.id, WORKFLOW_DAILY_CAP_USD: '2' };
const request = () => new Request('https://example.test/api/compose', { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': crypto.randomUUID() }, body: JSON.stringify({ goal: 'Plan a family trip', context: '', choices: {} }) });
const result = text => ({ text: JSON.stringify(text), cost: .001, latencyMs: 1, usage: { input: 10, output: 10, cached: 0, cacheWrite: 0 }, finish: 'completed', actualModel: model.id });
test('both model calls are budgeted before interpretation; one account attempt covers the full workflow', async () => {
  const store = memoryComposer(); let calls = 0;
  const response = await handleComposer(request(), c, env, store, 'ip', async (_m, _k, prompt, schema) => {
    calls++; assert.equal((await store.usage('user', new Date().toISOString().slice(0, 10))).attemptsToday, 1);
    return result(schema.properties.intents ? { intents: [{ query: 'family travel itinerary', kind: 'create' }] } : freeSelection(c, 'Plan a family trip'));
  }, 'user');
  assert.equal(response.status, 200); assert.equal(calls, 2); assert.equal((await response.json()).cost, .002);
  const usage = await store.usage('user', new Date().toISOString().slice(0, 10)); assert.equal(usage.completed, 1); assert.equal(usage.estimatedCost, .002);
});
test('known interpretation failures charge only known usage; unknown planning failures retain the reservation', async () => {
  const day = new Date().toISOString().slice(0, 10);
  const invalid = memoryComposer(); let calls = 0;
  const response = await handleComposer(request(), c, env, invalid, 'ip', async () => { calls++; return result({ intents: [] }); }, 'user');
  assert.equal(response.status, 502); assert.equal(calls, 1); assert.equal((await invalid.usage('user', day)).estimatedCost, .001);
  const unknown = memoryComposer();
  const failed = await handleComposer(request(), c, env, unknown, 'ip', async (_m, _k, _p, schema) => { if (schema.properties.intents) return result({ intents: [{ query: 'travel itinerary', kind: 'create' }] }); throw Error('network outcome unknown'); }, 'user');
  assert.equal(failed.status, 502); assert.equal((await unknown.usage('user', day)).estimatedCost, semanticReservation(c, 'Plan a family trip', '', {}, model));
});
test('rejected provider credit requests release unused reservations and report an actionable error', async () => {
  for (const failAt of [1, 2]) {
    const store = memoryComposer(); let calls = 0;
    const response = await handleComposer(request(), c, env, store, 'ip', async () => {
      if (++calls === failAt) { const error = new ProviderError('Provider rejected request', 429); error.unbilled = true; error.providerCode = 'credit_balance_exhausted'; throw error; }
      return result({ intents: [{ query: 'family travel itinerary', kind: 'create' }] });
    }, 'user');
    assert.equal(response.status, 503); assert.match((await response.json()).error, /provider allowance is exhausted/);
    assert.equal((await store.usage('user', new Date().toISOString().slice(0, 10))).estimatedCost, failAt === 1 ? 0 : .001);
  }
});
