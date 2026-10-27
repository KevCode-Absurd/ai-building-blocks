import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { decodeCatalogue, freeSelection, finalize, plannerPrompt, selectionSchema } from '../src/lib/composer-core.ts';
import { semanticReservation } from '../src/lib/composer-semantic.ts';
import { handleComposer, memoryComposer } from '../src/server/composer.ts';
import { MODELS } from '../src/lib/composer-models.ts';
const c = decodeCatalogue(JSON.parse(fs.readFileSync('public/data/blocks.json')));
const minds = c.blocks.filter(b => b.type === 'mind');
const goal = 'Write a thank-you email for volunteers';
const env = { WORKFLOW_COMPOSER_ENABLED: 'true', OPENAI_API_KEY: 'test', ANTHROPIC_API_KEY: 'test' };
const request = (patch = {}, id = crypto.randomUUID()) => new Request('https://example.test/api/compose', { method: 'POST', headers: { 'content-type': 'application/json', 'idempotency-key': id }, body: JSON.stringify({ goal, context: '', ...patch }) });
const output = value => ({ text: JSON.stringify(value), cost: .001, latencyMs: 1, usage: { input: 10, output: 10, cached: 0, cacheWrite: 0 }, finish: 'completed' });
function runnerFor(on, seen = []) { return async (_m, _k, prompt, schema) => {
  if (schema.properties.intents) return output({ intents: [{ query: goal, kind: 'create' }] });
  if (schema.properties.issues) return output({ issues: [] });
  const data = JSON.parse(prompt.user); seen.push(data);
  if (on) { assert.equal(data.mindRoster.length, minds.length); assert.deepEqual(data.mindRoster.map(m=>m.slug).sort(), minds.map(m=>m.slug).sort()); assert(data.mindRoster.every(m=>m.name && Array.isArray(m.areas) && m.expertise.length)); }
  else assert.equal(Object.hasOwn(data, 'mindRoster'), false);
  assert(schema.properties.steps.items.required.includes('minds'));
  const plan = freeSelection(c, goal); plan.steps.forEach(s => { s.minds = on ? [minds[0].slug] : []; }); return output(plan);
}; }
for (const model of ['gpt-6-luna', 'gpt-6.1-sol', 'claude-haiku-5-5']) test('default-on full roster assignments without extra model calls: ' + model, async () => {
  let calls = 0; const run = runnerFor(true);
  const r = await handleComposer(request({ model }), c, env, memoryComposer(), 'ip', async (...args)=>{ calls++; return run(...args); }, 'user_other');
  assert.equal(r.status, 200); assert((await r.json()).plan.steps.every(s=>s.minds.length===1));
  assert.equal(calls, model === 'gpt-6-luna' ? 3 : 2);
});
test('off omits the full roster and produces no assignments', async () => {
  const r = await handleComposer(request({ assignMinds: false, model: 'claude-haiku-5-5' }), c, env, memoryComposer(), 'ip', runnerFor(false), 'user_other');
  assert.equal(r.status, 200); assert((await r.json()).plan.steps.every(s=>s.minds.length===0));
});
test('invalid toggles reject before loading the catalogue or reserving funds', async () => {
  for(const assignMinds of [null, 'true', 1, {}, []]) assert.equal((await handleComposer(request({ assignMinds }), ()=>{throw Error('No catalogue');}, env, memoryComposer(), 'ip', ()=>{throw Error('No calls');}, 'user_other')).status, 400);
});
test('mind toggle is part of idempotency, omission is equivalent to true', async () => {
  const store = memoryComposer(), id = crypto.randomUUID();
  assert.equal((await handleComposer(request({}, id), c, env, store, 'ip', runnerFor(true), 'user_other')).status, 200);
  assert.equal((await handleComposer(request({assignMinds:true}, id), c, env, store, 'ip', ()=>{throw Error('No duplicate calls');}, 'user_other')).status, 200);
  assert.equal((await handleComposer(request({assignMinds:false}, id), c, env, store, 'ip', ()=>{throw Error('No duplicate calls');}, 'user_other')).status, 409);
});
test('assignments validate strict roster membership, uniqueness, type and council size', () => {
  for(const value of [['not-a-real-mind'], [freeSelection(c,goal).steps[0].slug], [minds[0].slug,minds[0].slug], minds.slice(0,4).map(m=>m.slug), 'jeff-bezos', [null]]) {
    const plan = freeSelection(c,goal); plan.steps[0].minds=value; assert.throws(()=>finalize(c,plan,'ai'), /mind assignments/);
  }
  const council = freeSelection(c,goal); council.steps.forEach(s=>{s.minds=minds.slice(0,3).map(m=>m.slug);});
  assert.deepEqual(finalize(c,council,'ai',undefined,true).steps[0].minds,minds.slice(0,3).map(m=>m.slug));
  assert.throws(()=>finalize(c,council,'ai',undefined,false), /turned off/);
});
test('legacy saved plans remain unassigned; new enabled requests require assignments', () => {
  const plan = freeSelection(c,goal); assert.equal(finalize(c,plan,'ai').steps[0].minds,undefined);
  assert.throws(()=>finalize(c,plan,'ai',undefined,true), /every step/);
});
test('schema allowlists every mind, and roster cost is reserved for all providers', () => {
  const candidates = [c.bySlug[freeSelection(c,goal).steps[0].slug]];
  assert.deepEqual(selectionSchema(candidates,true,minds).properties.steps.items.properties.minds.items.enum,minds.map(m=>m.slug));
  assert.equal(selectionSchema(candidates,true,[]).properties.steps.items.properties.minds.maxItems,0);
  assert(!Object.hasOwn(JSON.parse(plannerPrompt(goal,'',{},candidates).user),'mindRoster'));
  for(const model of MODELS.filter(m=>['gpt-6-luna','gpt-6.1-sol','claude-haiku-5-5'].includes(m.id))) assert(semanticReservation(c,goal,'',{},model,true)>semanticReservation(c,goal,'',{},model,false));
});
