import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validatePlaybook } from '../src/outcomes/playbook-contract.mjs';
import { PLAYBOOKS, getPlaybook, matchPlaybooks } from '../src/outcomes/playbooks/index.mjs';
import { FEATURED_ROLES } from '../src/roles/role-definitions.mjs';
import { callOutcomeTool, outcomeMcpTools } from '../src/outcomes/outcome-mcp.mjs';
import cpaSource from '../src/outcomes/playbooks/reduce-paid-acquisition-cost.mjs';
import genericSource from '../src/outcomes/playbooks/generic-outcome.mjs';

const catalogue = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../catalogue-items');
const folders = fs.readdirSync(catalogue, { withFileTypes: true }).filter(d => d.isDirectory()).flatMap(d => fs.readdirSync(path.join(catalogue, d.name), { withFileTypes: true }).filter(x => x.isDirectory()).map(x => ({ group: d.name, slug: x.name })));
const methodSlugs = new Set(folders.map(f => f.slug));
// Generated role ids drop the agency- prefix (role-definitions.mjs roleSeeds); featured roles keep their own ids.
const roleIds = new Set([...FEATURED_ROLES.map(r => r.id), ...folders.filter(f => ['agents', 'orchestrators'].includes(f.group)).map(f => f.slug.replace(/^agency-/, ''))]);
const copy = v => JSON.parse(JSON.stringify(v));
const START = { request: 'Our Meta ads CPA keeps going up and profit is shrinking', started: '2026-11-02', answers: { platforms: 'Meta, about 6 lakh a month', 'cpa-change': 'From 900 to 1450 since August', economics: 'AOV 2400, margin 60%, break-even about 1400', goal: 'Under 1100 by January', connections: 'Meta Ads MCP and Shopify MCP are connected', limits: 'Budget ceiling 7 lakh; no discounts above 15%' } };

async function step(result, event) { return callOutcomeTool('advance_outcome', { engagement: result.engagement, engagement_sha256: result.engagement_sha256, event }); }
async function complete(result, stageId, overrides = {}) {
  const def = getPlaybook(result.engagement.playbook.id).stages.find(s => s.id === stageId);
  return step(result, { type: 'complete', stage_id: stageId, outputs: def.outputs.map(o => ({ id: o.id })), checks: def.checks.map(c => ({ id: c.id, result: overrides[c.id] ?? 'PASS' })) });
}
const stateOf = (r, id) => r.engagement.stages.find(s => s.id === id).state;

test('every playbook validates against the live catalogue roles and methods', () => {
  assert.equal(PLAYBOOKS.length, 2);
  for (const p of [cpaSource, genericSource]) validatePlaybook(p, { methodSlugs, roleIds: p.fallback ? undefined : roleIds });
  assert.equal(PLAYBOOKS.filter(p => p.fallback).length, 1);
});

test('playbook rules keep decisions and live actions with the owner', () => {
  const broken = mutate => { const p = copy(cpaSource); mutate(p); return () => validatePlaybook(p); };
  assert.throws(broken(p => { p.stages.find(s => s.id === 'launch').gate = 'review'; }), /every action needs owner approval/);
  assert.throws(broken(p => { p.stages.find(s => s.id === 'decision').gate = 'review'; }), /decision stage needs owner approval/);
  assert.throws(broken(p => { p.stages.find(s => s.id === 'concepts').depends_on = ['context']; }), /after the owner's decision/);
  assert.throws(broken(p => { p.stages.find(s => s.id === 'evidence').depends_on = ['diagnosis']; }), /later kind/);
  assert.throws(broken(p => { p.stages.find(s => s.id === 'context').owner = { area: 'marketing' }; }), /names the owner role/);
  assert.throws(broken(p => { p.hypotheses[0].fix_stage = 'nowhere'; }), /unknown nowhere/);
});

test('requests route to a specific playbook or the generic fallback', () => {
  assert.equal(matchPlaybooks('Our cost per purchase on Facebook ads doubled')[0].id, 'reduce-paid-acquisition-cost');
  assert.equal(matchPlaybooks('ROAS is falling on Meta ads')[0].id, 'reduce-paid-acquisition-cost');
  assert.equal(matchPlaybooks('My business is not doing too well')[0].id, 'generic-outcome');
  assert.equal(matchPlaybooks('Our website is slow').at(-1).id, 'generic-outcome');
});

test('a vague request asks one batch, then switches to the fitting playbook', async () => {
  const r = await callOutcomeTool('start_outcome', { request: 'My business is not doing too well', started: '2026-11-02' });
  assert.equal(r.playbook.id, 'generic-outcome');
  assert.equal(r.state, 'NEEDS_ANSWERS');
  assert.equal(r.questions[0].id, 'route');
  assert.ok(r.files['PLAYBOOK.md'] && r.files['BRIEF.md'] && r.files['decisions.jsonl'] === '');
  await assert.rejects(step(r, { type: 'answer', answers: { route: 'cheaper' } }), /one of/);
  const routed = await step(r, { type: 'answer', answers: { route: 'acquisition-cost', goal: 'Under 1100' } });
  assert.equal(routed.state, 'SWITCH_PLAYBOOK');
  assert.equal(routed.switch_to, 'reduce-paid-acquisition-cost');
  const specific = await callOutcomeTool('start_outcome', { request: r.engagement.request, playbook_id: routed.switch_to, answers: routed.engagement.answers, started: '2026-11-02' });
  assert.deepEqual(specific.unused_answers, ['route']);
  assert.equal(specific.engagement.answers.goal, 'Under 1100');
  assert.ok(!specific.questions.some(q => q.id === 'goal'));
});

test('a rising-CPA engagement runs from intake to a closed experiment and a second round', async () => {
  let r = await callOutcomeTool('start_outcome', START);
  assert.equal(r.playbook.id, 'reduce-paid-acquisition-cost');
  assert.equal(r.state, 'READY');
  assert.deepEqual(r.ready.map(s => s.stage_id), ['context', 'evidence']);
  const evidence = r.ready.find(s => s.stage_id === 'evidence');
  assert.match(evidence.prompt, /prepare_specialist \{"role_id":"media-buyer"\}/);
  assert.match(evidence.prompt, /meta-results-review-agent/);
  assert.match(r.files['BRIEF.md'], /From 900 to 1450 since August/);

  await assert.rejects(complete(r, 'evidence', { totals: 'FAIL' }), /Spend and purchase totals/);
  await assert.rejects(step(r, { type: 'complete', stage_id: 'evidence', outputs: [{ id: 'dataset' }], checks: [] }), /evidence\/EVIDENCE\.md/);
  r = await complete(r, 'evidence');
  assert.equal(stateOf(r, 'evidence'), 'DONE');
  assert.equal(stateOf(r, 'integrity-tracking'), 'READY');

  // Missing data: with an alternative the stage runs limited; without one it waits.
  r = await step(r, { type: 'data', data_id: 'orders', status: 'MISSING' });
  assert.match(r.ready.find(s => s.stage_id === 'integrity-tracking').limits[0], /platform-reported/);
  r = await step(r, { type: 'data', data_id: 'tracking-setup', status: 'MISSING' });
  assert.equal(stateOf(r, 'integrity-tracking'), 'BLOCKED');
  assert.match(r.files['DATA-REQUESTS.md'], /Events Manager/);
  r = await step(r, { type: 'data', data_id: 'tracking-setup', status: 'AVAILABLE' });
  assert.equal(stateOf(r, 'integrity-tracking'), 'READY');

  r = await complete(r, 'context');
  assert.equal(r.state, 'AWAITING_OWNER');
  await assert.rejects(step(r, { type: 'approve', stage_id: 'context', decision: 'APPROVED', by: 'host' }), /Only the owner/);
  r = await step(r, { type: 'approve', stage_id: 'context', decision: 'CHANGES_REQUESTED', by: 'owner', note: 'Use the new tagline' });
  assert.match(r.ready.find(s => s.stage_id === 'context').prompt, /new tagline/);
  r = await complete(r, 'context');
  r = await step(r, { type: 'approve', stage_id: 'context', decision: 'APPROVED', by: 'owner' });
  for (const id of ['integrity-tracking', 'integrity-site']) { r = await complete(r, id); r = await step(r, { type: 'approve', stage_id: id, decision: 'APPROVED', by: 'owner' }); }
  assert.match(r.ready.find(s => s.stage_id === 'diagnosis').prompt, /hypotheses\.md/);
  r = await complete(r, 'diagnosis');
  r = await complete(r, 'options');
  r = await step(r, { type: 'approve', stage_id: 'options', decision: 'APPROVED', by: 'owner' });

  await assert.rejects(complete(r, 'decision'), /record_outcome_decision/);
  const decision = { id: 'd1', stage_id: 'decision', by: 'owner', considered: [{ id: 'r1', summary: 'Fix CAPI deduplication' }, { id: 'r2', summary: 'New concepts for women 45-54' }, { id: 'r3', summary: 'Cut weekend spend' }], chosen: ['r2'] };
  await assert.rejects(callOutcomeTool('record_outcome_decision', { engagement: r.engagement, engagement_sha256: r.engagement_sha256, decision }), /passed over the top option/);
  r = await callOutcomeTool('record_outcome_decision', { engagement: r.engagement, engagement_sha256: r.engagement_sha256, decision: { ...decision, rationale: 'Our developer is fixing CAPI this week already', rule: { text: 'Tracking work goes to the in-house developer', scope: 'business' } } });
  assert.equal(r.append.file, 'decisions.jsonl');
  assert.deepEqual(JSON.parse(r.append.line).passed_over, ['r1', 'r3']);
  assert.match(r.learning_candidate.save_to, /memory\/decisions\.md/);
  r = await complete(r, 'decision');
  r = await step(r, { type: 'approve', stage_id: 'decision', decision: 'APPROVED', by: 'owner' });
  await assert.rejects(step(r, { type: 'skip', stage_id: 'decision', reason: 'x' }), /DONE/);
  r = await step(r, { type: 'skip', stage_id: 'tracking-fixes', reason: 'Owner\'s developer handles it' });
  r = await step(r, { type: 'skip', stage_id: 'page-fixes', reason: 'No landing-page card chosen' });
  r = await complete(r, 'concepts'); r = await step(r, { type: 'approve', stage_id: 'concepts', decision: 'APPROVED', by: 'owner' });
  r = await complete(r, 'ad-production'); r = await step(r, { type: 'approve', stage_id: 'ad-production', decision: 'APPROVED', by: 'owner' });
  assert.equal(r.ready[0].stage_id, 'launch');
  assert.equal(r.ready[0].gate, 'approve_each_action');

  await assert.rejects(complete(r, 'launch'), /Register at least one experiment/);
  const reg = { action: 'register', id: 'x1', hypothesis_id: 'h-underserved-segment', card_id: 'r2', change: 'Three new concepts aimed at women 45-54', metric: 'Purchase CPA', baseline: 1450, target: 1100, window: { start: '2026-11-10', end: '2026-11-24' }, min_volume: 50, guardrails: ['Purchases per week stay above 80'] };
  r = await callOutcomeTool('record_outcome_experiment', { engagement: r.engagement, engagement_sha256: r.engagement_sha256, experiment: reg });
  r = await complete(r, 'launch');
  assert.equal(stateOf(r, 'launch'), 'AWAITING_APPROVAL');
  r = await step(r, { type: 'approve', stage_id: 'launch', decision: 'APPROVED', by: 'owner' });
  await assert.rejects(callOutcomeTool('record_outcome_experiment', { engagement: r.engagement, engagement_sha256: r.engagement_sha256, experiment: { ...reg, id: 'x2' } }), /registered before it goes live/);
  r = await complete(r, 'measurement');
  await assert.rejects(complete(r, 'learning'), /Close every experiment/);

  const close = { action: 'close', id: 'x1', observed: 1180, volume: 31, guardrail_results: [{ name: 'Purchases per week stay above 80', held: true }], verdict: 'WIN' };
  const args = experiment => ({ engagement: r.engagement, engagement_sha256: r.engagement_sha256, experiment });
  await assert.rejects(callOutcomeTool('record_outcome_experiment', args(close)), /INCONCLUSIVE/);
  await assert.rejects(callOutcomeTool('record_outcome_experiment', args({ ...close, volume: 60, guardrail_results: [{ name: 'Purchases per week stay above 80', held: false }] })), /not a win/);
  await assert.rejects(callOutcomeTool('record_outcome_experiment', args({ ...close, volume: 60, observed: 1500 })), /did not beat/);
  r = await callOutcomeTool('record_outcome_experiment', args({ ...close, volume: 60, learning: 'Women 45-54 respond to problem-first concepts' }));
  assert.equal(r.outcome_report.share, 'ONLY_WITH_OWNER_CONSENT');
  assert.equal(r.outcome_report.relative_change, -0.186);
  assert.ok(!JSON.stringify(r.outcome_report).includes('1180'));
  assert.equal(r.learning_candidate.scope, 'business');

  r = await complete(r, 'learning');
  r = await step(r, { type: 'approve', stage_id: 'learning', decision: 'APPROVED', by: 'owner' });
  assert.equal(r.state, 'ROUND_COMPLETE');
  r = await step(r, { type: 'next_round', note: 'Fatigue check in two weeks' });
  assert.equal(r.engagement.round, 2);
  assert.equal(stateOf(r, 'evidence'), 'DONE');
  assert.equal(stateOf(r, 'diagnosis'), 'READY');
  assert.equal(stateOf(r, 'launch'), 'WAITING');
});

test('autonomy relaxes review gates but never decisions or live actions', async () => {
  let r = await callOutcomeTool('start_outcome', START);
  await assert.rejects(step(r, { type: 'autonomy', level: 2, by: 'host' }), /Only the owner/);
  r = await step(r, { type: 'autonomy', level: 3, by: 'owner' });
  r = await complete(r, 'context');
  assert.equal(stateOf(r, 'context'), 'DONE');
  const launch = getPlaybook('reduce-paid-acquisition-cost').stages.find(s => s.id === 'launch');
  const { gateFor } = await import('../src/outcomes/engagement.mjs');
  assert.equal(gateFor(launch, r.engagement), 'approve_each_action');
  assert.equal(gateFor(getPlaybook('reduce-paid-acquisition-cost').stages.find(s => s.id === 'decision'), r.engagement), 'approve');
  assert.equal(gateFor(getPlaybook('reduce-paid-acquisition-cost').stages.find(s => s.id === 'ad-production'), r.engagement), 'review');
});

test('a changed or foreign engagement is rejected', async () => {
  const r = await callOutcomeTool('start_outcome', START);
  const tampered = copy(r.engagement); tampered.stages[2].state = 'DONE';
  await assert.rejects(callOutcomeTool('advance_outcome', { engagement: tampered, engagement_sha256: r.engagement_sha256, event: { type: 'start', stage_id: 'evidence' } }), /changed since/);
  await assert.rejects(callOutcomeTool('advance_outcome', { engagement: r.engagement, engagement_sha256: r.engagement_sha256, event: { type: 'teleport' } }), /Event type/);
  await assert.rejects(callOutcomeTool('start_outcome', { request: 'x', mystery: true }), /Unsupported argument/);
  assert.deepEqual(outcomeMcpTools.map(t => t.name), ['list_outcome_playbooks', 'start_outcome', 'advance_outcome', 'record_outcome_decision', 'record_outcome_experiment']);
  const listed = await callOutcomeTool('list_outcome_playbooks', { playbook_id: 'reduce-paid-acquisition-cost' });
  assert.match(listed.markdown, /flowchart TD/);
});
