import test from 'node:test';
import assert from 'node:assert/strict';
import { CASES, INDUSTRIES } from '../src/outcomes/evals/cases.mjs';
import { EXPECT } from '../src/outcomes/evals/expect.mjs';
import { CONTROLS, replay, runControls, scoreRun } from '../src/outcomes/evals/rubric.mjs';
import { localResolver } from '../src/outcomes/evals/local-catalogue.mjs';
import example from '../src/outcomes/examples/rising-cpa.mjs';
import { scoreRunV2, spread } from '../src/outcomes/evals/rubric-v2.mjs';
import { GRADE_DIMENSIONS, STAGE_GRADE_SCHEMA, STAGE_OUTPUT_CONTRACT, checkStageOutputs, sha256Text, stageGradePrompt, validateGrade } from '../src/outcomes/evals/stage-grading.mjs';

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

test('rubric v2 adds up to 100 on every path and is harder than v1', async () => {
  const r = await replay({ request: example.request }, example, options);
  const v2 = scoreRunV2(cpa, r.engagement, { today: '2026-11-02' });
  assert.equal(v2.items.reduce((t, i) => t + i.points, 0), 100);
  const v1 = scoreRun(cpa, r.engagement);
  assert.ok(v2.score < v1.score, `v2 ${v2.score} should be harder than v1 ${v1.score}`);
  // No metric and no diagnosis: the measurement and hypothesis points move to the deliverable and the choices.
  const plain = copy(r.engagement); plain.brief.metric = null; plain.plan.stages = plain.plan.stages.filter(s => s.kind !== 'diagnosis');
  const v2plain = scoreRunV2({ ...cpa, metric: null, kinds: cpa.kinds.filter(k => k !== 'diagnosis') }, plain, { today: '2026-11-02' });
  assert.equal(v2plain.items.reduce((t, i) => t + i.points, 0), 100);
  assert.ok(v2plain.items.some(i => i.id === 'grounded-choices') && v2plain.items.some(i => i.id === 'done-checkable'));
});

test('rubric v2 tells a great plan from a merely complete one', async () => {
  const r = await replay({ request: example.request }, example, options);
  const great = scoreRunV2(cpa, r.engagement, { today: '2026-11-02' });
  // Still passes every v1 rule, but with stock checks, vague hypotheses, undated blogs, no figures in the measurement and more owner stops.
  const ok = copy(r.engagement);
  for (const s of ok.plan.stages) for (const c of s.checks) c.name = 'Every hypothesis is SUPPORTED, REFUTED or UNKNOWN';
  for (const h of ok.plan.hypotheses) { h.confirm_if = 'It looks likely'; h.refute_if = 'It looks unlikely'; }
  for (const s of ok.research.sources.filter(x => x.kind === 'web')) { s.date = null; s.ref = 'https://blog.example.com/post'; }
  ok.plan.measurement = { window: 'Long enough', min_volume: 'Enough to tell', stop_rule: 'Stop if it looks bad' };
  for (const s of ok.plan.stages.filter(x => x.gate === 'none' && x.kind !== 'intake')) s.gate = 'review';
  const merely = scoreRunV2(cpa, ok, { today: '2026-11-02' });
  assert.ok(great.score - merely.score >= 25, `great ${great.score} vs merely complete ${merely.score}`);
  const lost = new Set(merely.items.filter(i => i.got < i.points / 2).map(i => i.id));
  for (const id of ['specific', 'decision-thresholds', 'primary-sources', 'dated-recent', 'minimum-volume', 'minutes']) assert.ok(lost.has(id), id);
  assert.deepEqual(spread([60, 70, 80]), { mean: 70, min: 60, max: 80, sd: 8.2 });
});

// A stage's work as the host would leave it in outcomes/<id>/.
async function evidenceStage() {
  const r = await replay({ request: example.request }, example, options);
  const e = copy(r.engagement);
  const def = e.plan.stages.find(s => s.id === 'evidence');
  const md = def.outputs.find(o => o.path.endsWith('.md')) ?? def.outputs[0];
  const files = {};
  for (const o of def.outputs) files[o.path] = o.format === 'csv' || o.path.endsWith('.csv') ? 'date,spend,purchases\n2026-10-01,120,4\n' : o.path.endsWith('.json') ? '{"ok":true}' : '# Evidence\n';
  files[md.path] = `# Evidence\n\nSpend rose 38% after 2026-09-15 [evidence: ${def.outputs[0].path}]. The owner says CPA was about 1,450 (reported).\n\n## Checks\n\n${def.checks.map(c => `- ${c.id}: PASS. Compared with the platform export (evidence: ${def.outputs[0].path})`).join('\n')}\n`;
  return { e, def, files, md };
}

test('stage outputs are checked against the contract: present, evidenced and cited', async () => {
  const { e, def, files, md } = await evidenceStage();
  const good = checkStageOutputs(e, 'evidence', files);
  assert.ok(good.pass, JSON.stringify(good.results.filter(x => !x.ok)));
  assert.equal(good.score, 100);
  const fails = (mutate, id) => { const f = copy(files); const eng = copy(e); mutate(f, eng); const r = checkStageOutputs(eng, 'evidence', f); assert.ok(!r.results.find(x => x.id === id).ok, id); };
  fails(f => { delete f[def.outputs[0].path]; }, 'outputs-exist');
  fails((f, eng) => { eng.stages.find(s => s.id === 'evidence').outputs = def.outputs.map(o => ({ id: o.id, path: o.path, sha256: 'a'.repeat(64) })); }, 'outputs-match-report');
  fails(f => { f[md.path] = f[md.path].replace(/- [a-z0-9-]+: PASS[^\n]*\n$/, ''); }, 'checks-evidenced');
  fails(f => { f[md.path] = f[md.path].replace(/\(evidence: [^)]+\)\n$/, '(evidence: nowhere.csv)\n'); }, 'checks-evidenced');
  fails((f, eng) => { eng.stages.find(s => s.id === 'evidence').checks = [{ id: def.checks[0].id, result: 'FAIL' }]; }, 'checks-match-report');
  fails(f => { f[md.path] = f[md.path].replace('# Evidence\n\n', '# Evidence\n\nRevenue was $48,000 last month. Orders were 1,200. Returns were 310.\n\n'); }, 'figures-cited');
  fails(f => { f[md.path] += '\nThis is guaranteed to double your sales.\n'; }, 'no-promises');
  assert.throws(() => checkStageOutputs(e, 'nope', files), /Unknown stage/);
});

test('stage grades are host-recorded files that pin the work they read', async () => {
  const { e, files, def } = await evidenceStage();
  const prompt = stageGradePrompt(e, 'evidence', files, { caseId: 'rising-cpa' });
  assert.match(prompt, /You did not do this work/);
  assert.match(prompt, /graded\/rising-cpa\/evidence\.json/);
  for (const k of Object.keys(GRADE_DIMENSIONS)) assert.match(prompt, new RegExp(k));
  const grade = {
    schema: STAGE_GRADE_SCHEMA, case: 'rising-cpa', engagement_id: e.id, stage_id: 'evidence', grader: { host: 'test fixture', model: 'none', independent: true }, graded: '2026-11-03',
    outputs: def.outputs.map(o => ({ path: o.path, sha256: sha256Text(files[o.path]) })), scores: { goal_fit: 4, evidence: 5, specificity: 3, usefulness: 4, honesty: 5 },
    reasons: Object.fromEntries(Object.keys(GRADE_DIMENSIONS).map(k => [k, `Quoted line for ${k}: "Spend rose 38%".`])), verdict: 'ACCEPT',
  };
  assert.deepEqual(validateGrade(grade, { files }), { ok: true, problems: [], score: 84 });
  assert.match(validateGrade({ ...grade, grader: { ...grade.grader, independent: false } }).problems.join(' '), /independent/);
  assert.match(validateGrade({ ...grade, scores: { ...grade.scores, honesty: 6 } }).problems.join(' '), /honesty/);
  const changed = copy(files); changed[def.outputs[0].path] += 'edited\n';
  assert.match(validateGrade(grade, { files: changed }).problems.join(' '), /grade it again/);
  assert.match(STAGE_OUTPUT_CONTRACT, /## Checks/);
});
