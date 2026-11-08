import test from 'node:test';
import assert from 'node:assert/strict';
import { planRefs, validateBrief, validatePlan, validateResearch } from '../src/outcomes/plan-contract.mjs';
import { engagementDigest, gateFor } from '../src/outcomes/engagement.mjs';
import { localResolver } from '../src/outcomes/evals/local-catalogue.mjs';
import { callOutcomeTool, outcomeMcpTools } from '../src/outcomes/outcome-mcp.mjs';
import example from '../src/outcomes/examples/rising-cpa.mjs';
import { handlePublicApi } from '../src/server/public-api.ts';

const resolve = localResolver();
const TOOL = { resolve, today: '2026-11-02' };
const copy = v => JSON.parse(JSON.stringify(v));

const call = (name, input) => callOutcomeTool(name, input, TOOL);
const step = (r, event) => call('advance_outcome', { engagement: r.engagement, engagement_sha256: r.engagement_sha256, event });
async function complete(r, stageId, overrides = {}) {
  const def = r.engagement.plan.stages.find(s => s.id === stageId);
  return step(r, { type: 'complete', stage_id: stageId, outputs: def.outputs.map(o => ({ id: o.id })), checks: def.checks.map(c => ({ id: c.id, result: overrides[c.id] ?? 'PASS' })) });
}
const stateOf = (r, id) => r.engagement.stages.find(s => s.id === id).state;
async function briefed() {
  const r = await call('start_outcome', { request: 'My business is not doing too well', started: '2026-11-02' });
  return step(r, { type: 'brief', brief: example.brief });
}
async function approved() {
  const r = await step(await briefed(), { type: 'plan', research: example.research, plan: example.plan });
  return step(r, { type: 'approve_plan', by: 'owner', decision: 'APPROVED' });
}

test('the worked example is a valid composed plan built from real specialists and items', async () => {
  const brief = validateBrief(example.brief), research = validateResearch(example.research), plan = validatePlan(example.plan, { research, brief });
  assert.deepEqual(await resolve(planRefs(plan, research)), { missing_roles: [], missing_items: [] });
  // Normalized output validates again unchanged, so the engagement can re-check it on every call.
  assert.deepEqual(validatePlan(copy(plan), { research: validateResearch(copy(research)), brief: validateBrief(copy(brief)) }), plan);
});

test('plan rules hold for any composed plan', async () => {
  const broken = (mutate, mutateResearch = () => {}) => () => { const p = copy(example.plan), rs = copy(example.research); mutate(p); mutateResearch(rs); return validatePlan(p, { research: validateResearch(rs), brief: example.brief }); };
  const stage = (p, id) => p.stages.find(s => s.id === id);
  assert.throws(broken(p => { stage(p, 'launch').gate = 'review'; }), /every action needs owner approval/);
  assert.throws(broken(p => { stage(p, 'decision').gate = 'review'; }), /decision stage needs owner approval/);
  assert.throws(broken(p => { stage(p, 'concepts').depends_on = ['context']; }), /after the owner's decision/);
  assert.throws(broken(p => { stage(p, 'evidence').depends_on = ['diagnosis']; }), /later kind/);
  assert.throws(broken(p => { stage(p, 'evidence').from_steps = []; }), /research steps it carries out/);
  assert.throws(broken(p => { stage(p, 'launch').from_steps = ['s-creative']; }), /Not covered: s-test/);
  assert.ok(broken(p => { stage(p, 'launch').from_steps = ['s-creative']; p.dropped = [{ step: 's-test', reason: 'Owner launches by hand' }]; })().dropped.length);
  assert.throws(broken(p => { stage(p, 'context').owner = { role: 'media-buyer', gap: 'x' }; }), /one catalogue specialist/);
  assert.throws(broken(p => { stage(p, 'context').checks = []; }), /one output and one check/);
  assert.throws(broken(p => { p.stages.push(p.stages.splice(p.stages.findIndex(s => s.id === 'measurement'), 1)[0]); }), /ends with a learning stage/);
  assert.throws(broken(p => { p.stages = p.stages.filter(s => s.kind !== 'measurement'); stage(p, 'learning').depends_on = ['launch']; }), /needs a measurement stage/);
  assert.throws(broken(() => {}, rs => { rs.sources = rs.sources.filter(s => s.kind === 'catalogue'); for (const s of rs.steps) s.sources = ['cat-bottleneck']; rs.pitfalls = []; }), /outside our catalogue/);
  assert.throws(broken(() => {}, rs => { rs.sources[0].ref = 'http://example.com/'; }), /https/);
  assert.throws(broken(() => {}, rs => { rs.steps[0].sources = []; }), /cite at least one source/);
  // A missing specialist is recorded as a gap; unknown catalogue ids are refused.
  const gap = copy(example.plan); stage(gap, 'context').owner = { gap: 'A brand strategist for regional jewellery' };
  assert.ok(validatePlan(gap, { research: validateResearch(example.research), brief: example.brief }));
  const ghost = copy(example.plan); stage(ghost, 'context').owner = { role: 'ghost-specialist' }; stage(ghost, 'context').uses.push('no-such-item');
  const b = await briefed();
  await assert.rejects(step(b, { type: 'plan', research: example.research, plan: ghost }), /ghost-specialist/);
  stage(ghost, 'context').owner = { role: 'brand-file-from-website' };
  await assert.rejects(step(b, { type: 'plan', research: example.research, plan: ghost }), /no-such-item/);
});

test('a vague request becomes a brief, then a researched plan the owner approves', async () => {
  const r = await call('start_outcome', { request: 'My business is not doing too well', started: '2026-11-02', include_example: true });
  assert.equal(r.state, 'NEEDS_BRIEF');
  assert.equal(r.engagement.id, '20261102-my-business-is-not-doing');
  // The method travels once, as METHOD.md, with examples for the list and object fields of the brief.
  assert.equal(r.method, undefined);
  assert.equal(r.method_version, 5);
  assert.match(r.files['METHOD.md'], /## 2\. Aim higher/);
  assert.match(r.files['METHOD.md'], /\| ambition \|/);
  assert.match(r.files['METHOD.md'], /Research/);
  assert.match(r.files['METHOD.md'], /\| connections \|.*"access":"read","status":"connected"/);
  assert.equal(r.example.plan.stages[0].kind, 'intake');
  await assert.rejects(step(r, { type: 'plan', research: example.research, plan: example.plan }), /brief before the plan/);
  await assert.rejects(step(r, { type: 'brief', brief: { ...example.brief, metric: { ...example.brief.metric, baseline: null } } }), /missing baseline/);
  await assert.rejects(step(r, { type: 'brief', brief: { ...example.brief, assets: ['Meta token EAA' + 'B'.repeat(70)] } }), /API key or token/);

  const b = await step(r, { type: 'brief', brief: example.brief });
  assert.equal(b.state, 'NEEDS_PLAN');
  assert.match(b.files['BRIEF.md'], /From 900 to 1450 since August/);
  assert.ok(b.research_protocol.some(x => /web/.test(x)));

  let p = await step(b, { type: 'plan', research: example.research, plan: example.plan });
  assert.equal(p.state, 'AWAITING_PLAN_APPROVAL');
  assert.match(p.files['PLAN.md'], /Live actions/);
  assert.match(p.files['RESEARCH.md'], /web\.dev/);
  assert.ok(p.warnings.some(w => /without a date/.test(w)));
  await assert.rejects(step(p, { type: 'start', stage_id: 'evidence' }), /approves the plan first/);
  await assert.rejects(step(p, { type: 'approve_plan', by: 'host', decision: 'APPROVED' }), /Only the owner/);
  p = await step(p, { type: 'approve_plan', by: 'owner', decision: 'CHANGES_REQUESTED', note: 'Add a check on returning customers' });
  assert.equal(p.state, 'NEEDS_PLAN');
  assert.match(p.next, /returning customers/);
  p = await step(p, { type: 'plan', research: example.research, plan: example.plan });
  assert.equal(p.engagement.plan_version, 2);
  p = await step(p, { type: 'approve_plan', by: 'owner', decision: 'APPROVED' });
  assert.equal(p.state, 'READY');
  assert.deepEqual(p.ready.map(s => s.stage_id), ['context', 'evidence']);
  const evidence = p.ready.find(s => s.stage_id === 'evidence');
  assert.match(evidence.prompt, /prepare_specialist \{"role_id":"media-buyer"\}/);
  assert.match(evidence.prompt, /Pull comparable before and after data/);
});

test('an approved plan runs to a closed experiment and a second round', async () => {
  let r = await approved();
  await assert.rejects(complete(r, 'evidence', { totals: 'FAIL' }), /Spend and purchase totals/);
  r = await complete(r, 'evidence');
  assert.equal(stateOf(r, 'integrity-tracking'), 'READY');
  r = await step(r, { type: 'data', data_id: 'orders', status: 'MISSING' });
  assert.match(r.ready.find(s => s.stage_id === 'integrity-tracking').limits[0], /platform-reported/);
  r = await step(r, { type: 'data', data_id: 'tracking-setup', status: 'MISSING' });
  assert.equal(stateOf(r, 'integrity-tracking'), 'BLOCKED');
  r = await step(r, { type: 'data', data_id: 'tracking-setup', status: 'AVAILABLE' });

  // Internal stages that their checks cover need no owner stop; the owner sees the findings at the decision.
  for (const id of ['context', 'integrity-tracking', 'integrity-site', 'diagnosis', 'options']) { r = await complete(r, id); assert.equal(stateOf(r, id), 'DONE'); }

  await assert.rejects(complete(r, 'decision'), /record_outcome_decision/);
  const decision = { id: 'd1', stage_id: 'decision', by: 'owner', considered: [{ id: 'r1', summary: 'Fix CAPI deduplication' }, { id: 'r2', summary: 'New concepts for women 45-54' }, { id: 'r3', summary: 'Cut weekend spend' }], chosen: ['r2'] };
  const rec = (name, field, value) => call(name, { engagement: r.engagement, engagement_sha256: r.engagement_sha256, [field]: value });
  await assert.rejects(rec('record_outcome_decision', 'decision', decision), /passed over the top option/);
  r = await rec('record_outcome_decision', 'decision', { ...decision, rationale: 'Our developer is fixing CAPI this week already', rule: { text: 'Tracking work goes to the in-house developer', scope: 'business' } });
  assert.deepEqual(JSON.parse(r.append.line).passed_over, ['r1', 'r3']);
  assert.match(r.learning_candidate.save_to, /memory\/decisions\.md/);
  r = await complete(r, 'decision');
  r = await step(r, { type: 'approve', stage_id: 'decision', decision: 'APPROVED', by: 'owner' });
  r = await step(r, { type: 'skip', stage_id: 'tracking-fixes', reason: 'Owner\'s developer handles it' });
  r = await step(r, { type: 'skip', stage_id: 'page-fixes', reason: 'No landing-page card chosen' });
  r = await complete(r, 'concepts');
  await assert.rejects(step(r, { type: 'approve', stage_id: 'concepts', decision: 'APPROVED', by: 'host' }), /Only the owner/);
  r = await step(r, { type: 'approve', stage_id: 'concepts', decision: 'APPROVED', by: 'owner' });
  assert.match(r.ready.find(s => s.stage_id === 'ad-production').prompt, /"paid-media-creative-strategist" review/);
  r = await complete(r, 'ad-production');
  assert.equal(r.ready[0].gate, 'approve_each_action');

  await assert.rejects(complete(r, 'launch'), /Register at least one experiment/);
  const reg = { action: 'register', id: 'x1', hypothesis_id: 'h-underserved-segment', card_id: 'r2', change: 'Three new concepts aimed at women 45-54', metric: 'Purchase CPA', baseline: 1450, target: 1100, window: { start: '2026-11-10', end: '2026-11-24' }, min_volume: 50, guardrails: ['Purchases per week stay above 80'] };
  r = await rec('record_outcome_experiment', 'experiment', reg);
  r = await complete(r, 'launch');
  r = await step(r, { type: 'approve', stage_id: 'launch', decision: 'APPROVED', by: 'owner' });
  await assert.rejects(rec('record_outcome_experiment', 'experiment', { ...reg, id: 'x2' }), /registered before it goes live/);
  r = await complete(r, 'measurement');
  await assert.rejects(complete(r, 'learning'), /Close every experiment/);

  const close = { action: 'close', id: 'x1', observed: 1180, volume: 31, guardrail_results: [{ name: 'Purchases per week stay above 80', held: true }], verdict: 'WIN' };
  await assert.rejects(rec('record_outcome_experiment', 'experiment', close), /INCONCLUSIVE/);
  await assert.rejects(rec('record_outcome_experiment', 'experiment', { ...close, volume: 60, guardrail_results: [{ name: 'Purchases per week stay above 80', held: false }] }), /not a win/);
  await assert.rejects(rec('record_outcome_experiment', 'experiment', { ...close, volume: 60, observed: 1500 }), /did not beat/);
  r = await rec('record_outcome_experiment', 'experiment', { ...close, volume: 60, learning: 'Women 45-54 respond to problem-first concepts' });
  assert.equal(r.outcome_report.relative_change, -0.186);
  assert.ok(!JSON.stringify(r.outcome_report).includes('1180'));

  r = await complete(r, 'learning');
  assert.equal(r.state, 'ROUND_COMPLETE');
  const pattern = JSON.parse(r.files['PATTERN.json']);
  assert.equal(pattern.share, 'ONLY_WITH_OWNER_CONSENT');
  assert.deepEqual(pattern.experiments, [{ hypothesis_id: 'h-underserved-segment', verdict: 'WIN' }]);
  assert.ok(!r.files['PATTERN.json'].includes('1450'));
  r = await step(r, { type: 'next_round', note: 'Fatigue check in two weeks' });
  assert.equal(r.engagement.round, 2);
  assert.equal(stateOf(r, 'evidence'), 'DONE');
  assert.equal(stateOf(r, 'diagnosis'), 'READY');
});

test('a revised plan keeps unchanged finished stages and goes back to the owner', async () => {
  let r = await approved();
  r = await complete(r, 'evidence');
  const revised = copy(example.plan);
  revised.stages.find(s => s.id === 'diagnosis').goal += ' Split new from returning customers.';
  r = await step(r, { type: 'plan', research: example.research, plan: revised });
  assert.equal(r.state, 'AWAITING_PLAN_APPROVAL');
  assert.equal(stateOf(r, 'evidence'), 'DONE');
  assert.equal(stateOf(r, 'diagnosis'), 'WAITING');
  r = await step(r, { type: 'approve_plan', by: 'owner', decision: 'APPROVED' });

  // At autonomy 2 a revision with live actions still goes to the owner; one without them is approved by autonomy.
  r = await step(r, { type: 'autonomy', level: 2, by: 'owner' });
  r = await step(r, { type: 'plan', research: example.research, plan: { ...revised, name: `${revised.name} (v3)` } });
  assert.equal(r.state, 'AWAITING_PLAN_APPROVAL');
  r = await step(r, { type: 'approve_plan', by: 'owner', decision: 'APPROVED' });
  const offline = copy(revised);
  offline.capabilities = offline.capabilities.filter(c => c.access !== 'live');
  offline.stages = offline.stages.filter(s => s.kind !== 'execution');
  offline.stages.find(s => s.kind === 'measurement').depends_on = ['ad-production', 'page-fixes', 'tracking-fixes'];
  for (const h of offline.hypotheses) if (h.fix_stage === 'launch') h.fix_stage = 'concepts';
  offline.dropped = [{ step: 's-test', reason: 'The owner launches ads themselves' }];
  r = await step(r, { type: 'plan', research: example.research, plan: offline });
  assert.equal(r.engagement.phase, 'RUN');
  assert.match(r.engagement.history.at(-1).note, /approved by autonomy/);
});

test('autonomy relaxes review gates but never decisions or live actions', async () => {
  let r = await approved();
  await assert.rejects(step(r, { type: 'autonomy', level: 2, by: 'host' }), /Only the owner/);
  r = await step(r, { type: 'autonomy', level: 3, by: 'owner' });
  r = await complete(r, 'context');
  assert.equal(stateOf(r, 'context'), 'DONE');
  const def = id => r.engagement.plan.stages.find(s => s.id === id);
  assert.equal(gateFor(def('launch'), r.engagement), 'approve_each_action');
  assert.equal(gateFor(def('decision'), r.engagement), 'approve');
  assert.equal(gateFor(def('concepts'), r.engagement), 'review');
});

test('a changed engagement or a plan edited outside the tools is rejected', async () => {
  const r = await approved();
  const tampered = copy(r.engagement); tampered.stages[2].state = 'DONE';
  await assert.rejects(call('advance_outcome', { engagement: tampered, engagement_sha256: r.engagement_sha256, event: { type: 'start', stage_id: 'evidence' } }), /changed since/);
  const loosened = copy(r.engagement); loosened.plan.stages.find(s => s.id === 'launch').gate = 'none';
  await assert.rejects(call('advance_outcome', { engagement: loosened, engagement_sha256: await engagementDigest(loosened), event: { type: 'start', stage_id: 'evidence' } }), /every action needs owner approval/);
  await assert.rejects(call('advance_outcome', { engagement: r.engagement, engagement_sha256: r.engagement_sha256, event: { type: 'teleport' } }), /event\.type: must be one of brief, plan/);
  await assert.rejects(call('start_outcome', { request: 'x', mystery: true }), /mystery: is not an argument of start_outcome/);
  assert.deepEqual(outcomeMcpTools.map(t => t.name), ['start_outcome', 'advance_outcome', 'record_outcome_decision', 'record_outcome_experiment', 'read_back_outcome_experiment', 'prepare_outcome_pattern']);
  const b = await briefed();
  const unchecked = await callOutcomeTool('advance_outcome', { engagement: b.engagement, engagement_sha256: b.engagement_sha256, event: { type: 'plan', research: example.research, plan: example.plan } });
  assert.ok(unchecked.warnings.some(w => /not checked against the live catalogue/.test(w)));
});

test('the public API serves outcome tools over REST and MCP, with the larger body limit for outcome calls only', async () => {
  const limiter = { async limit() { return { success: true }; } };
  const env = { PUBLIC_API_ENABLED: 'true', API_ALLOWED_HOSTS: 'example.test', API_READ_LIMITER: limiter, API_WRITE_LIMITER: limiter, ASSETS: { fetch: () => new Response('missing', { status: 404 }) } };
  const post = (route, body) => handlePublicApi(new Request('https://example.test' + route, { method: 'POST', headers: { 'cf-connecting-ip': '192.0.2.9', 'content-type': 'application/json', accept: 'application/json, text/event-stream' }, body: JSON.stringify(body) }), env);
  const started = await post('/api/v1/outcomes', { request: 'My business is not doing too well', started: '2026-11-02' });
  assert.equal(started.status, 200);
  const r = await started.json();
  assert.equal(r.state, 'NEEDS_BRIEF');
  const briefed = await (await post('/api/v1/outcome-steps', { engagement: r.engagement, engagement_sha256: r.engagement_sha256, event: { type: 'brief', brief: example.brief } })).json();
  assert.equal(briefed.state, 'NEEDS_PLAN');
  const bad = await post('/api/v1/outcome-steps', { engagement: r.engagement, engagement_sha256: 'f'.repeat(64), event: { type: 'brief', brief: example.brief } });
  assert.equal(bad.status, 400);
  assert.match((await bad.json()).error.message, /changed since.*Nothing was executed or saved/);
  const padding = 'x'.repeat(70000);
  const big = await post('/mcp', { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'advance_outcome', arguments: { engagement: { ...r.engagement, request: padding }, engagement_sha256: r.engagement_sha256, event: { type: 'autonomy', level: 1, by: 'owner' } } } });
  assert.notEqual(big.status, 413);
  const other = await post('/mcp', { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'search_library', arguments: { query: padding } } });
  assert.equal(other.status, 413);
  const spec = await (await handlePublicApi(new Request('https://example.test/api/v1/openapi.json', { headers: { 'cf-connecting-ip': '192.0.2.9' } }), env)).json();
  assert.equal(spec.paths['/api/v1/outcome-steps'].post.operationId, 'advance_outcome');
});
