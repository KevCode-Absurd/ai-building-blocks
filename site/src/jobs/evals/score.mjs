// Deterministic structural replay only. A schema pass is not proof of model quality or a blind win.
import { startJob, advanceJob } from '../engine.mjs';
import { routeJob } from '../router.mjs';
import { validateJobDocument } from '../contracts.mjs';
import { CASES, JOB_EVAL_VERSION, NEGATIVE_CONTROLS } from './cases.mjs';

export const REAL_RECORDING = 'REAL_HOST_RECORDING';
export const SYNTHETIC_RECORDING = 'SYNTHETIC_STRUCTURAL_FIXTURE';
export const PASS_SCORE = 95;
export const CHECKS = ['routing_correct', 'contracts_pass', 'council_complete', 'variety_contract', 'review_independent', 'delivery_pack_complete'];
const clone = value => structuredClone(value);
const message = error => String(error?.message ?? error).slice(0, 1200);
const object = value => value && typeof value === 'object' && !Array.isArray(value);

export function validateCaseSet(cases = CASES) {
  const errors = [];
  if (cases.length !== 20) errors.push('Record exactly 20 benchmark cases.');
  if (new Set(cases.map(c => c.id)).size !== cases.length) errors.push('Case ids must be unique.');
  for (const [shape, count] of [['many_artifacts', 8], ['one_decision', 8], ['system_build', 4]]) if (cases.filter(c => c.output_shape === shape).length !== count) errors.push(`Need ${count} ${shape} cases.`);
  if (cases.filter(c => c.clarity === 'vague').length < 5) errors.push('Need at least five vague briefs.');
  if (cases.filter(c => c.clarity === 'specific').length < 5) errors.push('Need at least five specific briefs.');
  if (cases.some(c => !c.request?.trim() || !c.id || !c.job)) errors.push('Every case needs a request, id and job.');
  return { status: errors.length ? 'FAIL' : 'PASS', errors };
}

/** Runs eight targeted mutations. The baseline must pass, and the expected rule must cause refusal. */
export async function runControls(fixtures) {
  const baseline = schema => {
    const group = fixtures.find(row => row.schema === schema);
    if (!group?.valid?.length) throw new Error(`Missing valid baseline for ${schema}.`);
    return clone(group.valid[0].document);
  };
  const controls = [];
  const test = (id, schema, doc, mutate, pattern, context = {}) => {
    const before = validateJobDocument(schema, doc, context);
    if (!before.ok) { controls.push({ id, status: 'FAIL', reason: 'Invalid control baseline', errors: before.errors }); return; }
    const changed = clone(doc); mutate(changed);
    const result = validateJobDocument(schema, changed, context);
    const expected = result.errors.some(error => pattern.test(`${error.path}: ${error.message}`));
    controls.push({ id, status: !result.ok && expected ? 'PASS' : 'FAIL', result: result.ok ? 'ACCEPTED' : expected ? 'REFUSED' : 'WRONG_REASON', errors: result.errors });
  };
  const spread = baseline('ai-blocks-spread/1'), template = spread.slots[0];
  spread.variety_mix = { preset: 'wide', proven: 20, new: 50, outlier: 30 };
  spread.slots = Array.from({ length: 10 }, (_, i) => ({ ...clone(template), slot_id: `d${i}`, family: `family-${i % 5}`, maker_seat: `maker-${i % 2}`, items: [{ slug: `method-${i % 5}`, revision_sha256: 'a'.repeat(64) }], mix: i < 2 ? 'proven' : i < 7 ? 'new' : 'outlier' }));
  test(NEGATIVE_CONTROLS[0], 'ai-blocks-spread/1', spread, doc => doc.slots.forEach((slot, i) => { slot.family = i < 9 ? 'family-0' : 'family-1'; }), /exceeds 30%|at most two slots|distinct approach families/);
  const team = baseline('ai-blocks-team-plan/2');
  test(NEGATIVE_CONTROLS[1], 'ai-blocks-review/1', baseline('ai-blocks-review/1'), doc => { doc.judge_seat = team.seats.find(s => s.seat_type === 'maker').seat_id; }, /judge_seat.*independent judge/, { team });
  test(NEGATIVE_CONTROLS[2], 'ai-blocks-council/1', baseline('ai-blocks-council/1'), doc => doc.critiques.forEach(c => { c.flaw_quote = ''; }), /flaw_quote/);
  test(NEGATIVE_CONTROLS[3], 'ai-blocks-routes/1', baseline('ai-blocks-routes/1'), doc => { doc.routes[1].differs_on = clone(doc.routes[0].differs_on); }, /differs_on.*similar/);
  test(NEGATIVE_CONTROLS[4], 'ai-blocks-job-card/1', baseline('ai-blocks-job-card/1'), doc => { doc.questions_asked = Array.from({ length: 6 }, (_, i) => ({ q: `Question ${i}?`, answer: 'Default', by: 'owner' })); }, /questions_asked/);
  const routed = routeJob({ request: 'Use the sample-method skill.' }, { items: [{ slug: 'sample-method', name: 'Sample method' }] });
  controls.push({ id: NEGATIVE_CONTROLS[5], status: routed.mode === 'direct' ? 'PASS' : 'FAIL', result: routed.mode === 'direct' ? 'REFUSED_TEAM_ROUTE' : 'ACCEPTED_TEAM_ROUTE' });
  for (const [id, tamper] of [[NEGATIVE_CONTROLS[6], false], [NEGATIVE_CONTROLS[7], true]]) {
    try {
      const initial = await startJob({ request: 'Make six source-backed documents.', mode: 'team' });
      const state = clone(initial.state);
      if (tamper) state.base.request = 'A changed request.';
      await advanceJob({ job_id: initial.job_id, state, state_digest: initial.state_digest, event: 'review', document: baseline('ai-blocks-review/1') });
      controls.push({ id, status: 'FAIL', result: 'ACCEPTED' });
    } catch (error) {
      const expected = error.issues?.some(issue => issue.path === (tamper ? 'state_digest' : 'event'));
      controls.push({ id, status: expected ? 'PASS' : 'FAIL', result: expected ? 'REFUSED' : 'WRONG_REASON', reason: message(error) });
    }
  }
  return controls.map(control => ({ ...control, provenance: SYNTHETIC_RECORDING, model_calls: 0 }));
}

/** Replays the actual engine. Recorded response claims cannot bypass its gates. */
export async function replayRecording(c, run, fallbackCatalogue = {}) {
  const errors = [], checks = Object.fromEntries(CHECKS.map(key => [key, false]));
  if (!object(run)) return { id: c.id, status: 'NOT_RUN', provenance: null, score: 0, checks, errors: ['No recording.'] };
  if (run.case !== c.id) errors.push('Recording case does not match this brief.');
  if (run.method_version !== JOB_EVAL_VERSION) errors.push('Recording method_version is stale or missing.');
  if (![REAL_RECORDING, SYNTHETIC_RECORDING].includes(run.provenance)) errors.push('Recording must state REAL_HOST_RECORDING or SYNTHETIC_STRUCTURAL_FIXTURE provenance.');
  if (typeof run.host !== 'string' || !run.host.trim()) errors.push('Record the host app, model, effort and profile.');
  if (typeof run.recorded !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T.*Z)?$/.test(run.recorded)) errors.push('Record the date in ISO form.');
  if (run.initial_input?.request !== c.request) errors.push('Use the shared case request without changes.');
  if (!Array.isArray(run.events)) errors.push('Record the ordered host events.');
  if (run.provenance === REAL_RECORDING && (!run.transcript_ref || !/^[a-f0-9]{64}$/.test(run.transcript_sha256 ?? ''))) errors.push('Real recordings need a local transcript reference and SHA-256.');
  if (errors.length) return { id: c.id, status: 'FAIL', provenance: run.provenance ?? null, score: 0, checks, errors };
  let current;
  try {
    const catalogue = run.catalogue ?? fallbackCatalogue;
    current = await startJob(run.initial_input, catalogue);
    checks.routing_correct = current.mode === c.expected_mode;
    if (current.model_calls !== 0) throw new Error('start_job reported a model call.');
    for (const entry of run.events) {
      current = await advanceJob({ ...entry, state: current.state, state_digest: current.state_digest, job_id: current.job_id }, catalogue);
      if (current.model_calls !== 0) throw new Error(`${entry.event} reported a model call.`);
    }
    const history = current.state?.history ?? [], find = event => history.find(entry => entry.event === event)?.document;
    const card = find('scope'), production = [...history].reverse().find(entry => entry.event === 'produce')?.document;
    const council = find('council'), reviews = history.filter(entry => entry.event === 'review').map(entry => entry.document);
    const delivery = find('deliver'), divergence = find('diverge');
    checks.contracts_pass = ['LEARN', 'COMPLETE'].includes(current.phase);
    checks.council_complete = !!council && council.status === 'DECIDED';
    checks.variety_contract = card?.output_shape === 'many_artifacts' ? !!(divergence?.spread || divergence?.schema === 'ai-blocks-spread/1') : !!(divergence?.routes || divergence?.schema === 'ai-blocks-routes/1');
    checks.review_independent = reviews.length > 0 && reviews.every(review => review.judge_saw_council === false && !production?.artifacts?.some(artifact => artifact.maker_seat === review.judge_seat));
    const paths = new Set((delivery?.files ?? []).map(file => file.path.replace(/^delivery\//, '')));
    const required = ['DELIVERY.md', 'DECISIONS.md', 'EVIDENCE.md', 'REVIEW.md', 'TEAM.md', 'run.json', ...(card?.output_shape === 'many_artifacts' ? ['SPREAD.md'] : [])];
    checks.delivery_pack_complete = required.every(file => paths.has(file)) && Array.isArray(delivery?.deliverables) && delivery.deliverables.length > 0;
    if (card?.output_shape !== c.output_shape) errors.push(`Scoped shape ${card?.output_shape ?? 'missing'} differs from case ${c.output_shape}.`);
  } catch (error) { errors.push(message(error)); }
  const score = Math.round(CHECKS.filter(key => checks[key]).length / CHECKS.length * 1000) / 10;
  return { id: c.id, status: errors.length || score < PASS_SCORE ? 'FAIL' : run.provenance === REAL_RECORDING ? 'PASS' : 'SYNTHETIC_ONLY', provenance: run.provenance, score, checks, errors, terminal_phase: current?.phase ?? null, host: run.host, recorded: run.recorded, model_calls: 0, assurance: 'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED' };
}

export function summarize(results, controls, cases = CASES) {
  const real = results.filter(row => row.provenance === REAL_RECORDING), missing = cases.filter(c => !real.some(r => r.id === c.id));
  const failures = real.filter(row => row.status !== 'PASS'), controlsPass = controls.length === NEGATIVE_CONTROLS.length && controls.every(row => row.status === 'PASS');
  const mean = real.length ? Math.round(real.reduce((sum, row) => sum + row.score, 0) / real.length * 10) / 10 : null;
  const status = failures.length || !controlsPass ? 'FAIL' : missing.length ? 'NOT_RUN' : mean >= PASS_SCORE ? 'PASS' : 'FAIL';
  return { schema: 'ai-blocks-job-eval-scorecard/1', method_version: JOB_EVAL_VERSION, status, pass_score: PASS_SCORE, average: mean, recorded: real.length, expected: cases.length, missing: missing.map(c => c.id), controls: { passed: controls.filter(row => row.status === 'PASS').length, total: controls.length, status: controlsPass ? 'PASS' : 'FAIL' }, results, model_calls: 0, bakeoff_v2: 'NOT_RUN', quality_claim: 'No blind quality or 10x claim is established by structural replay.' };
}
