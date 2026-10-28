import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { decodeCatalogue, freeSelection, LIMITS } from '../src/lib/composer-core.ts';
import { semanticReservation } from '../src/lib/composer-semantic.ts';
import { MODELS } from '../src/lib/composer-models.ts';
import { handleComposer, memoryComposer } from '../src/server/composer.ts';
const catalogue = decodeCatalogue(JSON.parse(fs.readFileSync('public/data/blocks.json')));
const goal = 'Build a landing page from scratch';

test('the API passes a full allowed context to routing and planning while charging the existing bounded call path', async () => {
  const context = 'Synthetic notes: use the approved source files.\n'.padEnd(LIMITS.context, 'x');
  const seen = [], store = memoryComposer();
  const req = new Request('https://example.test/api/compose', { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': crypto.randomUUID() }, body: JSON.stringify({ goal, context, assignMinds: false }) });
  const result = await handleComposer(req, catalogue, { WORKFLOW_COMPOSER_ENABLED: 'true', WORKFLOW_DEFAULT_MODEL: 'claude-haiku-5-5', ANTHROPIC_API_KEY: 'synthetic-test-key' }, store, 'test-ip', async (_model, _key, prompt, schema) => {
    seen.push(JSON.parse(prompt.user));
    return { text: JSON.stringify(schema.properties.intents ? { intents: [{ query: goal, kind: 'create' }] } : freeSelection(catalogue, goal)), cost: .001, latencyMs: 1, usage: { input: 100, output: 100, cached: 0, cacheWrite: 0 }, finish: 'completed' };
  }, 'test-user');
  assert.equal(result.status, 200, JSON.stringify(await result.clone().json()));
  assert.equal(seen.length, 2, 'No extra rewrite stage or free-search call');
  assert(seen.every(prompt => prompt.context === context && prompt.request === goal));
  assert.equal((await store.usage('test-user', new Date().toISOString().slice(0, 10))).estimatedCost, .002);
});

test('the pre-call reservation includes the larger context and its actual UTF-8 size', () => {
  const model = MODELS.find(m => m.id === 'gpt-6-luna');
  const reserve = context => semanticReservation(catalogue, goal, context, {}, model, false);
  assert(reserve('x'.repeat(LIMITS.context)) > reserve('x'.repeat(4000)));
  assert(reserve('界'.repeat(4000)) > reserve('x'.repeat(4000)));
});
