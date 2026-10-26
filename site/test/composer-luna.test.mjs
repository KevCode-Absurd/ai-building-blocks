import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { decodeCatalogue, freeSelection, candidatesFor } from '../src/lib/composer-core.ts';
import { MODELS, ProviderError, planOutputLimit } from '../src/lib/composer-models.ts';
import { semanticReservation, parseQuality } from '../src/lib/composer-semantic.ts';
import { handleComposer, memoryComposer } from '../src/server/composer.ts';
const c = decodeCatalogue(JSON.parse(fs.readFileSync('public/data/blocks.json')));
const model = MODELS.find(m => m.id === 'gpt-6-luna');
const goal = 'Build a landing page from scratch and deliver source code';
const plan = freeSelection(c, goal);
const request = id => new Request('https://example.test/api/compose', { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': id ?? crypto.randomUUID() }, body: JSON.stringify({ goal, context: '', assignMinds: false }) });
const env = { WORKFLOW_COMPOSER_ENABLED: 'true', OPENAI_API_KEY: 'unit-test', WORKFLOW_DAILY_CAP_USD: '10' };
const result = value => ({ text: JSON.stringify(value), cost: .001, latencyMs: 1, usage: { input: 100, output: 100, cached: 0, cacheWrite: 0 }, finish: 'completed', actualModel: model.id });
const initial = schema => schema.properties.intents ? { intents: [{ query: 'landing page source code', kind: 'create' }] } : plan;
test('preserving an unknown payment integration cannot select Stripe even if a routing hint invents it', () => {
  const goal = 'Our React checkout submits twice. Fix it without breaking our existing payment integration.';
  const candidates = candidatesFor(c, goal, {}, '', [{ query: 'Stripe checkout duplicate submission fix', kind: 'create' }]);
  assert(!candidates.some(b => /^stripe-/.test(b.slug)));
  assert(candidates.some(b => b.slug === 'request-deliverable-drafter'), 'A tailored fallback remains available when a misleading search hint omits a specialist.');
  assert(candidatesFor(c, goal, {}, 'The existing provider is Stripe.', [{ query: 'Stripe payments builder', kind: 'create' }]).some(b => /^stripe-/.test(b.slug)));
});

test('Luna default budgets review before spending; completed retries reuse the whole result', async () => {
  const store = memoryComposer(), id = crypto.randomUUID(); let calls = 0;
  const runner = async (selected, _key, _prompt, schema, max) => {
    assert.equal(selected.id, 'gpt-6-luna'); calls++;
    assert.equal((await store.usage('alice', new Date().toISOString().slice(0, 10))).attemptsToday, 1);
    if (schema.properties.steps) assert.equal(max, 12000);
    return result(schema.properties.issues ? { issues: [] } : initial(schema));
  };
  const first = await handleComposer(request(id), c, env, store, 'ip', runner, 'alice');
  assert.equal(first.status, 200); assert.equal((await first.json()).cost, .003); assert.equal(calls, 3);
  assert.equal((await handleComposer(request(id), c, env, store, 'ip', runner, 'alice')).status, 200); assert.equal(calls, 3);
  assert.equal(planOutputLimit(model), 12000);
  assert(semanticReservation(c, goal, '', {}, model, false) > .003);
});
test('substantive omissions receive exactly one repair and hard validation; all calls count', async () => {
  let calls = 0, reviews = 0, repairs = 0;
  const store = memoryComposer();
  const response = await handleComposer(request(), c, env, store, 'ip', async (_m, _k, prompt, schema) => {
    calls++;
    if (schema.properties.issues) return result({ issues: ++reviews === 1 ? [{ requirement: 'Source files', fix: 'Name editable HTML and CSS outputs.' }] : [] });
    if (prompt.system.includes('Revise the complete workflow')) { repairs++; assert.match(prompt.user, /Source files/); return result({ ...plan, steps: plan.steps.map((s, i) => i ? s : { ...s, notes: s.notes + ' Deliver index.html and styles.css.' }) }); }
    return result(initial(schema));
  }, 'alice');
  assert.equal(response.status, 200); assert.equal(calls, 4); assert.equal(repairs, 1); assert.equal(reviews, 1);
  assert.equal((await response.json()).cost, .004);
});
test('structurally invalid first plan is repaired before review without publishing invalid blocks', async () => {
  let plans = 0, reviews = 0;
  const response = await handleComposer(request(), c, env, memoryComposer(), 'ip', async (_m, _k, _p, schema) => {
    if (schema.properties.issues) { reviews++; return result({ issues: [] }); }
    if (schema.properties.steps && ++plans === 1) return result({ ...plan, steps: [{ slug: 'invented', reason: 'x', notes: '' }] });
    return result(initial(schema));
  }, 'alice');
  assert.equal(response.status, 200); assert.equal(plans, 2); assert.equal(reviews, 0);
  assert(!(await response.json()).plan.steps.some(s => s.slug === 'invented'));
});
test('unresolved or malformed quality results fail closed and settle known usage', async () => {
  for (const malformed of [false, true]) {
    const store = memoryComposer(); let calls = 0;
    const response = await handleComposer(request(), c, env, store, 'ip', async (_m, _k, _p, schema) => {
      calls++;
      return result(schema.properties.issues ? malformed ? { issues: 'pass' } : { issues: [{ requirement: 'Requested files', fix: 'Missing required output.' }] } : initial(schema));
    }, 'alice');
    assert.equal(response.status, 502); assert.equal(calls, malformed ? 3 : 4);
    const usage = await store.usage('alice', new Date().toISOString().slice(0, 10));
    assert.equal(usage.completed, 0); assert.equal(usage.attemptsToday, 1); assert.equal(usage.estimatedCost, calls * .001);
  }
  for (const value of [{}, { issues: null }, { issues: [{}] }, { issues: Array(7).fill({ requirement: 'x', fix: 'y' }) }]) assert.throws(() => parseQuality(JSON.stringify(value)));
});
test('unknown review billing keeps the entire reservation; rejected review charges only prior usage', async () => {
  for (const unknown of [true, false]) {
    const store = memoryComposer(); let calls = 0;
    const response = await handleComposer(request(), c, env, store, 'ip', async (_m, _k, _p, schema) => {
      calls++;
      if (schema.properties.issues) { if (unknown) throw Error('network outcome unknown'); const e = new ProviderError('request rejected', 429); e.unbilled = true; throw e; }
      return result(initial(schema));
    }, 'alice');
    assert.equal(response.status, 502); assert.equal(calls, 3);
    assert.equal((await store.usage('alice', new Date().toISOString().slice(0, 10))).estimatedCost, unknown ? semanticReservation(c, goal, '', {}, model, false) : .002);
  }
});
test('one known truncated plan is retried compactly; prior usage is retained and unknown transport is never retried', async () => {
  for (const unknown of [false, true]) {
    let calls = 0, plans = 0;
    const store = memoryComposer();
    const response = await handleComposer(request(), c, env, store, 'ip', async (_m, _k, prompt, schema) => {
      calls++;
      if (schema.properties.steps && ++plans === 1) {
        if (unknown) throw Error('network outcome unknown');
        throw new ProviderError('truncated', 502, { ...result({}), finish: 'incomplete' });
      }
      if (schema.properties.steps) assert.match(prompt.system, /ran out of output space/);
      return result(schema.properties.issues ? { issues: [] } : initial(schema));
    }, 'alice');
    assert.equal(response.status, unknown ? 502 : 200); assert.equal(plans, unknown ? 1 : 2); assert.equal(calls, unknown ? 2 : 4);
    const usage = await store.usage('alice', new Date().toISOString().slice(0, 10));
    assert.equal(usage.estimatedCost, unknown ? semanticReservation(c, goal, '', {}, model, false) : .004);
  }
});
test('Luna adapter uses compact structured final output without changing other models', async () => {
  const { callModel } = await import('../src/lib/composer-models.ts');
  for (const id of ['gpt-6-luna', 'gpt-6.1-sol']) {
    let sent;
    await callModel(MODELS.find(m => m.id === id), 'unit-test', { system: 'x', user: 'x' }, {}, 100, async (url, options) => {
      sent = JSON.parse(options.body);
      if (id === 'gpt-6-luna') { assert.equal(url, 'https://api.openai.com/v1/chat/completions'); return Response.json({ choices: [{ message: { content: '{}' }, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 10 } }); }
      return Response.json({ status: 'completed', output: [{ type: 'message', role: 'assistant', phase: 'final_answer', content: [{ type: 'output_text', text: '{}' }] }], usage: { input_tokens: 10, output_tokens: 10 } });
    });
    if (id === 'gpt-6-luna') { assert.equal(sent.verbosity, 'low'); assert.equal(sent.reasoning_effort, 'none'); assert.equal(sent.response_format.json_schema.strict, true); }
    else { assert.equal(sent.text.verbosity, undefined); assert.equal(sent.reasoning.effort, 'low'); assert.equal(sent.text.format.strict, true); }
  }
});

test('Luna uses low reasoning for artifact planning while routing remains lightweight', async () => {
  const { callModel } = await import('../src/lib/composer-models.ts');
  for (const planning of [false, true]) {
    await callModel(model, 'unit-test', { system: 'x', user: 'x' }, { properties: planning ? { steps: {} } : { intents: {} } }, 12000, async (_url, options) => {
      const sent = JSON.parse(options.body);
      assert.equal(sent.reasoning_effort, planning ? 'low' : 'none');
      assert.equal(sent.max_completion_tokens, 12000);
      return Response.json({ choices: [{ message: { content: '{}' }, finish_reason: 'stop' }], usage: { prompt_tokens: 10, completion_tokens: 25, completion_tokens_details: { reasoning_tokens: 15 } } });
    });
  }
});
