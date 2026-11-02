import test from 'node:test';
import assert from 'node:assert/strict';
import { CASES, INDUSTRIES } from '../src/outcomes/evals/cases.mjs';
import { EXPECT } from '../src/outcomes/evals/expect.mjs';
import { CONTROLS, replay, runControls, scoreRun } from '../src/outcomes/evals/rubric.mjs';
import { localResolver } from '../src/outcomes/evals/local-catalogue.mjs';
import example from '../src/outcomes/examples/rising-cpa.mjs';

const options = { resolve: localResolver(), today: '2026-11-02' };
const copy = v => JSON.parse(JSON.stringify(v));
const cpa = {
  metric: 'decrease', kinds: ['evidence', 'integrity', 'diagnosis', 'options', 'decision', 'production', 'execution', 'measurement', 'learning'],
  roles: ['tracking', 'media-buyer|paid-media', 'creative|ad'], research: ['pixel|conversions api', 'attribution', 'learning phase'],
  guardrails: ['volume|margin'], limits: ['15%|discount'], unknowns: ['changed'], checks: ['dedup'], live: true, deliverable: ['ad|creative'], before: [['integrity', 'diagnosis']],
};

test('golden requests cover six industries evenly, each with its own expectations', () => {
  assert.equal(CASES.length, 30);
  assert.equal(new Set(CASES.map(c => c.id)).size, 30);
  for (const i of INDUSTRIES) assert.equal(CASES.filter(c => c.industry === i).length, 5, i);
  assert.deepEqual(Object.keys(EXPECT).sort(), CASES.map(c => c.id).sort());
  for (const c of CASES) {
    assert.ok(!('expect' in c), 'hosts never see the expectations');
    const e = EXPECT[c.id];
    assert.ok([null, 'increase', 'decrease', 'reach'].includes(e.metric), c.id);
    assert.ok([true, false, null].includes(e.live), c.id);
    for (const p of [...e.roles, ...e.research, ...e.guardrails, ...e.limits, ...e.unknowns, ...e.checks, ...e.deliverable]) assert.doesNotThrow(() => new RegExp(p, 'i'), `${c.id}: ${p}`);
  }
});

test('the scorecard rewards expert coverage and adds up to 100', async () => {
  const r = await replay({ request: example.request }, example, options);
  const full = scoreRun(cpa, r.engagement);
  assert.equal(full.items.reduce((t, i) => t + i.points, 0), 100);
  assert.ok(full.score >= 80, `worked example scored ${full.score}`);

  // A thinner engagement loses points where an expert would object.
  const thin = copy(r.engagement);
  thin.brief.unknowns = []; thin.brief.metric.baseline_source = 'verified';
  thin.research.sources = thin.research.sources.filter(s => s.kind !== 'web');
  thin.plan.hypotheses = []; thin.plan.capabilities = thin.plan.capabilities.filter(c => c.access !== 'live');
  thin.brief.deliverable = 'Ad results guaranteed to double';
  const low = scoreRun(cpa, thin);
  const lost = new Set(low.items.filter(i => i.got < i.points).map(i => `${i.group}/${i.id}`));
  for (const id of ['brief/unknowns', 'brief/honest-baseline', 'research/sources', 'plan/hypotheses', 'safety/live-actions', 'safety/no-promises']) assert.ok(lost.has(id), id);
  assert.ok(low.score < full.score - 20);
  // A promise that is ruled out is not a promise.
  thin.brief.deliverable = 'Launched ads, with no guaranteed result';
  assert.ok(!scoreRun(cpa, thin).items.find(i => i.id === 'no-promises').note);
});

test('every broken copy of a good plan is refused for the right reason', async () => {
  const results = await runControls({ request: example.request }, example, options);
  assert.equal(results.length, CONTROLS.length);
  for (const r of results) assert.equal(r.result, 'REFUSED', `${r.id}: ${r.note ?? r.result}`);
});
