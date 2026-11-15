import test from 'node:test';
import assert from 'node:assert/strict';
import { startJob, advanceJob, jobStateDigest } from '../src/jobs/engine.mjs';
import { engineFixture } from './fixtures/jobs/engine-fixture.mjs';
const send = (previous, entry, context) => advanceJob({ job_id: previous.job_id, state: previous.state, state_digest: previous.state_digest, ...entry }, context);

test('a structural fixture completes every phase with a dynamic lead, independent review and scoped feedback', async () => {
  const f = engineFixture(); let result = await startJob(f.input, f.context);
  assert.equal(result.phase, 'SCOPE'); assert.equal(result.model_calls, 0);
  const phases = ['STAFF', 'DIVERGE', 'DELIBERATE', 'PRODUCE', 'REVIEW', 'DELIVER', 'LEARN', 'COMPLETE'];
  for (const [n, entry] of f.events.entries()) { result = await send(result, entry, f.context); assert.equal(result.phase, phases[n]); assert.equal(result.model_calls, 0); assert.equal(result.state_digest, await jobStateDigest(result.state)); }
  assert.deepEqual(result.preference_update.preferences.by_job_type['write-documents'].proven_pool, []);
  assert.equal(result.preference_update.preferences.feedback_records[0].slot_id,'d0');
  assert.equal(result.preference_update.preferences.feedback_records[0].scope,'artifact');
  assert.equal(result.stored_by_service, false);
});

test('digest edits and phase skips fail, including a skip with a recomputed digest', async () => {
  const f = engineFixture(), result = await startJob(f.input, f.context), changed = structuredClone(result.state); changed.base.request += ' Also publish.';
  await assert.rejects(() => advanceJob({ job_id: result.job_id, state: changed, state_digest: result.state_digest, event: 'scope', document: f.card }, f.context), /state_digest/);
  await assert.rejects(() => send(result, { event: 'deliver', document: f.delivery }, f.context), /SCOPE.*scope/);
  const forged = structuredClone(result.state); forged.history.push({ event: 'deliver', document: f.delivery, at: new Date().toISOString() });
  await assert.rejects(async () => advanceJob({ job_id: result.job_id, state: forged, state_digest: await jobStateDigest(forged), event: 'feedback', document: { items: [] } }, f.context), /SCOPE.*scope/);
});

test('staff proposals are accepted through the same validators as host-written teams', async () => {
  const f = engineFixture(); let result = await startJob(f.input, f.context); result = await send(result, f.events[0], f.context);
  result = await send(result, { event: 'staff', accept_proposal: true, document: {} }, f.context);
  assert.equal(result.phase, 'DIVERGE'); const team = result.state.history.at(-1).document;
  assert(team.lead_seat_id); assert(team.seats.some(s => s.seat_type === 'judge')); assert(team.working_groups.length);
});

test('failed review cannot become an unflagged pass and standard revision limit is enforced', async () => {
  const f = engineFixture(); let result = await startJob(f.input, f.context);
  for (const entry of f.events.slice(0, 5)) result = await send(result, entry, f.context);
  const failed = structuredClone(f.review); failed.items[0].verdict = 'REVISE'; failed.items[0].notes = 'Needs a stronger example.';
  result = await send(result, { event: 'review', document: failed }, f.context);
  await assert.rejects(() => send(result, { event: 'deliver', document: f.delivery }, f.context), /flags/);
  result = await send(result, { event: 'revise', document: { slot_ids: ['d0'], reason: 'Fix the failed example.' } }, f.context);
  result = await send(result, { event: 'produce', document: f.production }, f.context); failed.loop = 1;
  result = await send(result, { event: 'review', document: failed }, f.context);
  await assert.rejects(() => send(result, { event: 'revise', document: { slot_ids: ['d0'], reason: 'Again.' } }, f.context), /revision limit/);
  const flagged = { ...f.delivery, flags: ['The first output still needs a stronger example.'], status: 'DELIVERED_WITH_FLAGS' };
  result = await send(result, { event: 'deliver', document: flagged }, f.context); assert.equal(result.phase, 'LEARN');
});

test('a block requires an explained reopen and retains validated history', async () => {
  const f = engineFixture(); let result = await startJob(f.input, f.context);
  result = await send(result, { event: 'block', document: { reason: 'Waiting for source files.' } }, f.context); assert.equal(result.phase, 'BLOCKED');
  await assert.rejects(() => send(result, f.events[0], f.context), /BLOCKED/);
  result = await send(result, { event: 'reopen', document: { reason: 'Source files supplied.' } }, f.context); assert.equal(result.phase, 'SCOPE');
});

test('deep review needs two independent judges and retains an earlier failed verdict', async () => {
  const f = engineFixture({ tier: 'deep' }); let result = await startJob(f.input, f.context);
  for (const entry of f.events.slice(0, 5)) result = await send(result, entry, f.context);
  const first = structuredClone(f.review); first.items[0].verdict = 'REVISE'; first.items[0].notes = 'Add a useful example.';
  result = await send(result, { event: 'review', document: first }, f.context); assert.equal(result.phase, 'REVIEW');
  await assert.rejects(() => send(result, { event: 'review', document: f.review }, f.context), /different judge/);
  result = await send(result, { event: 'review', document: { ...f.review, judge_seat: 's8' } }, f.context);
  assert.equal(result.phase, 'DELIVER'); assert(result.warnings.some(w => w.includes('failed')));
  await assert.rejects(() => send(result, { event: 'deliver', document: f.delivery }, f.context), /flags/);
});

test('quick tier works with a smaller council and permits no revision loop', async () => {
  const f = engineFixture({ tier: 'quick' }); let result = await startJob(f.input, f.context);
  for (const entry of f.events.slice(0, 5)) result = await send(result, entry, f.context);
  const failed = structuredClone(f.review); failed.items[0].verdict = 'REVISE'; failed.items[0].notes = 'Needs a better example.';
  result = await send(result, { event: 'review', document: failed }, f.context);
  await assert.rejects(() => send(result, { event: 'revise', document: { slot_ids: ['d0'], reason: 'Revise.' } }, f.context), /revision limit/);
});

test('council references, staffed tiers and the final coordinator check cannot be bypassed', async () => {
  const f = engineFixture(); let result = await startJob(f.input, f.context);
  result = await send(result, f.events[0], f.context);
  const downgraded = { ...f.team, tier: 'quick' };
  await assert.rejects(() => send(result, { event: 'staff', document: downgraded }, f.context), /tier/);
  result = await send(result, f.events[1], f.context); result = await send(result, f.events[2], f.context);
  const unrelated = structuredClone(f.council); unrelated.subject = 'directions'; unrelated.proposals[0].ref = 'not-in-board';
  await assert.rejects(() => send(result, { event: 'council', document: unrelated }, f.context), /actual owner/);
  for (const entry of f.events.slice(3, 6)) result = await send(result, entry, f.context);
  const missing = structuredClone(f.delivery); delete missing.coordinator_review;
  await assert.rejects(() => send(result, { event: 'deliver', document: missing }, f.context), /coordinator/);
});

test('option reruns resolve against actual validated source records', async () => {
  const f = engineFixture(); let result = await startJob(f.input, f.context);
  for (const entry of f.events.slice(0, 7)) result = await send(result, entry, f.context);
  await assert.rejects(() => startJob({ ...f.input, from_option: 'o1' }, f.context), /option_source/);
  const rerun = await startJob({ ...f.input, from_option: 'o1', option_source: { state: result.state, state_digest: result.state_digest } }, f.context);
  assert.equal(rerun.rerun.option_id, 'o1'); assert.equal(rerun.rerun.proposal.label, 'B');
  await assert.rejects(() => startJob({ ...f.input, from_option: 'missing', option_source: { state: result.state, state_digest: result.state_digest } }, f.context), /does not exist/);
});

const template = result => JSON.parse(result.files.find(file => file.path === 'templates/JOB-CARD.json').content);
test('a missing or unread org context blocks staffing for page, ad, copy and email jobs', async () => {
  for (const deliverable_kind of ['web_page', 'ad_creative', 'copy', 'email']) {
    const f = engineFixture(), result = await startJob({ ...f.input, deliverable_kind }, f.context), missing = structuredClone(f.card);
    assert.ok(template(result).org_context, deliverable_kind);
    delete missing.org_context;
    await assert.rejects(() => send(result, { event: 'scope', document: missing }, f.context), /org_context: A page, ad, copy or email job needs the org context/);
    const unread = structuredClone(f.card); unread.org_context.read_by_coordinator = false;
    await assert.rejects(() => send(result, { event: 'scope', document: unread }, f.context), /read_by_coordinator|org_context/);
    const detached = structuredClone(f.card); detached.context_sources = [];
    await assert.rejects(() => send(result, { event: 'scope', document: detached }, f.context), /matching context source/);
    assert.equal((await send(result, f.events[0], f.context)).phase, 'STAFF');
  }
});

test('audit, analysis, strategy, plan, code and document jobs are staffed without an org context', async () => {
  for (const deliverable_kind of ['audit', 'analysis', 'strategy', 'plan', 'code', 'ops_doc', 'other']) {
    const f = engineFixture(), result = await startJob({ ...f.input, deliverable_kind }, f.context), bare = structuredClone(f.card);
    assert.equal(template(result).org_context, undefined, deliverable_kind);
    assert.doesNotMatch(result.next_action.instruction, /brand (?:file|brain)/, deliverable_kind);
    delete bare.org_context; bare.context_sources = [];
    assert.equal((await send(result, { event: 'scope', document: bare }, f.context)).phase, 'STAFF', deliverable_kind);
    // An org context that is supplied anyway is still accepted.
    assert.equal((await send(result, f.events[0], f.context)).phase, 'STAFF', deliverable_kind);
  }
  // Audits and analysis need their data snapshot before production instead.
  const f = engineFixture(); let result = await startJob({ ...f.input, deliverable_kind: 'audit' }, f.context);
  for (const entry of f.events.slice(0, 4)) result = await send(result, entry, f.context);
  await assert.rejects(() => send(result, f.events[4], f.context), /data snapshot/);
});

test('the kind on the job card decides, and a job with no kind keeps the old brand rule', async () => {
  const f = engineFixture(), result = await startJob({ ...f.input, deliverable_kind: 'plan' }, f.context), email = structuredClone(f.card);
  email.deliverable_kind = 'email'; delete email.org_context;
  await assert.rejects(() => send(result, { event: 'scope', document: email }, f.context), /org_context/);
  // A state from before kinds were declared has no deliverable: it still asks for the org context.
  const legacy = structuredClone(result.state); delete legacy.base.deliverable; delete legacy.base.grounding_policy; delete legacy.base.mode_default;
  const bare = structuredClone(f.card); delete bare.org_context; delete bare.deliverable_kind;
  await assert.rejects(async () => advanceJob({ job_id: result.job_id, state: legacy, state_digest: await jobStateDigest(legacy), event: 'scope', document: bare }, f.context), /org_context/);
});

test('separate jobs may declare safe delivery metadata roots without accepting another job’s files',async()=>{
 const f=engineFixture();let result=await startJob(f.input,f.context);for(const entry of f.events.slice(0,6))result=await send(result,entry,f.context);
 const nested=structuredClone(f.delivery);nested.delivery_root='cases/T1/delivery';for(const file of nested.files)file.path=nested.delivery_root+'/'+file.path.replace(/^delivery\//,'');
 assert.equal((await send(result,{event:'deliver',document:nested},f.context)).phase,'LEARN');
 const crossed=structuredClone(nested);crossed.files[0].path=crossed.files[0].path.replace('T1','T2');await assert.rejects(()=>send(result,{event:'deliver',document:crossed},f.context),/missing/);
 const unsafe=structuredClone(nested);unsafe.delivery_root='../outside';await assert.rejects(()=>send(result,{event:'deliver',document:unsafe},f.context),/delivery_root/);
 const trailing=structuredClone(nested);trailing.delivery_root+=' /';await assert.rejects(()=>send(result,{event:'deliver',document:trailing},f.context),/delivery_root/);
});

test('unexposed tool totals remain unknown without disguising process counts as measured use',async()=>{
 const f=engineFixture();let result=await startJob(f.input,f.context);for(const entry of f.events.slice(0,4))result=await send(result,entry,f.context);
 const unknown=structuredClone(f.production);unknown.artifacts[0].budget={used:null,allowance:10,usage_status:'NOT_AVAILABLE',reason:'Host total tool calls are not exposed; separately recorded render launches have a different unit. See usage-receipt.json.'};
 const accepted=await send(result,{event:'produce',document:unknown},f.context);assert.equal(accepted.phase,'REVIEW');assert(accepted.warnings.some(w=>/allowance use is not verified/.test(w)));
 const noReason=structuredClone(unknown);delete noReason.artifacts[0].budget.reason;await assert.rejects(()=>send(result,{event:'produce',document:noReason},f.context),/budget/);
 const noStatus=structuredClone(unknown);delete noStatus.artifacts[0].budget.usage_status;await assert.rejects(()=>send(result,{event:'produce',document:noStatus},f.context),/budget/);
 const mixed=structuredClone(unknown);mixed.artifacts[0].budget.used=3;await assert.rejects(()=>send(result,{event:'produce',document:mixed},f.context),/budget/);
 const over=structuredClone(f.production);over.artifacts[0].budget.used=11;await assert.rejects(()=>send(result,{event:'produce',document:over},f.context),/allowance/);
});

test('single-kind jobs reject unrelated or missing artifact kinds before review',async()=>{
 const f=engineFixture();let result=await startJob(f.input,f.context);for(const entry of f.events.slice(0,4))result=await send(result,entry,f.context);
 const wrong=structuredClone(f.production);for(const artifact of wrong.artifacts)artifact.kind='unrelated';await assert.rejects(()=>send(result,{event:'produce',document:wrong},f.context),/kind/);
 const absent=structuredClone(f.production);for(const artifact of absent.artifacts)delete artifact.kind;await assert.rejects(()=>send(result,{event:'produce',document:absent},f.context),/kind/);
 assert.equal((await send(result,{event:'produce',document:f.production},f.context)).phase,'REVIEW');
});

test('the scope step is the spec sheet, and it names an org context or taste brief only for kinds that need one', async () => {
  const { validateJobDocument } = await import('../src/jobs/contracts.mjs');
  const slices = { web_page: /org context \(its facts, voice and look\)/, ad_creative: /org context \(its facts, voice and look\)/, copy: /org context \(its facts and voice\)/, email: /org context \(its facts and voice\)/ };
  for (const deliverable_kind of ['web_page', 'ad_creative', 'copy', 'email', 'audit', 'analysis', 'strategy', 'plan', 'code', 'ops_doc', 'other']) {
    const f = engineFixture(), result = await startJob({ ...f.input, deliverable_kind }, f.context), scope = result.next_action.instruction, card = template(result);
    assert.match(scope, /Write the spec sheet in templates\/JOB-CARD\.json/, deliverable_kind); assert.match(scope, /acceptance_tests/, deliverable_kind); assert.match(scope, /Your final check reads from them/, deliverable_kind);
    assert.doesNotMatch(scope, /job card|brand brain|brand file/i, deliverable_kind);
    if (slices[deliverable_kind]) { assert.match(scope, slices[deliverable_kind], deliverable_kind); assert.match(scope, /context\/taste-brief\.md/, deliverable_kind); assert.ok(card.org_context && card.grounding.taste_brief, deliverable_kind); }
    else { assert.doesNotMatch(scope + result.classification_review?.instruction, /org context|brand (?:file|brain)|taste/i, deliverable_kind); assert.equal(card.org_context, undefined, deliverable_kind); assert.equal(card.grounding?.taste_brief, undefined, deliverable_kind); }
    assert.equal(/deliverables with counts, grounding,/.test(scope), ['web_page', 'ad_creative', 'copy', 'email', 'audit', 'analysis'].includes(deliverable_kind), deliverable_kind);
    // The template starts from the suggested acceptance tests, as rows the job-card schema accepts.
    assert.ok(card.acceptance.length >= 5 && card.acceptance.length <= 7, deliverable_kind); assert.ok(card.acceptance.some(row => row.critical) && card.acceptance.every(row => row.id && row.criterion.endsWith('?') && /pass/i.test(row.threshold)), deliverable_kind);
    assert.deepEqual(validateJobDocument('ai-blocks-job-card/1', { ...f.card, acceptance: card.acceptance }).errors.filter(error => error.path.startsWith('acceptance')), [], deliverable_kind);
    // Production is told to report grounding only when the kind has some.
    let at = result; for (const entry of f.events.slice(0, 4)) at = await send(at, entry, f.context);
    const produce = at.next_action.instruction; assert.equal(at.phase, 'PRODUCE');
    if (slices[deliverable_kind]) assert.match(produce, /Report grounding \(brand_dna and taste_brief\) unless the spec sheet holds it/, deliverable_kind);
    else if (['audit', 'analysis'].includes(deliverable_kind)) { assert.match(produce, /Report grounding \(data_snapshot\)/, deliverable_kind); assert.doesNotMatch(produce, /brand_dna|taste_brief/, deliverable_kind); }
    else assert.doesNotMatch(produce, /grounding|brand_dna|taste_brief|data_snapshot/, deliverable_kind);
  }
  // The job-type guess is checked against the org context only when the kind has one.
  const f = engineFixture(), { job, job_reason, ...unnamed } = f.input;
  assert.match((await startJob({ ...unnamed, deliverable_kind: 'web_page' }, f.context)).classification_review.instruction, /actual output and the org context\./);
  assert.match((await startJob({ ...unnamed, deliverable_kind: 'plan' }, f.context)).classification_review.instruction, /^Check this guess against the actual output\. /);
});

test('the orchestrator makes the final check: it hands over, or sends the work back once with the failed tests named', async () => {
  const f = engineFixture(); let result = await startJob(f.input, f.context);
  for (const entry of f.events.slice(0, 6)) result = await send(result, entry, f.context);
  assert.equal(result.phase, 'DELIVER'); assert.equal(result.next_action.alternative_event, 'revise');
  assert.match(result.next_action.instruction, /The lead has handed back\. Now you, the orchestrator, check each acceptance test and each rubric gate against the deliverable yourself/);
  assert.match(result.next_action.instruction, /send it back to the lead once with revise, naming the failed tests in failed_tests/);
  const back = { slot_ids: ['d0'], reason: 'The first output does not show the product a buyer expects.' };
  await assert.rejects(() => send(result, { event: 'revise', document: back }, f.context), /failed_tests: Name each acceptance test or gate that failed/);
  await assert.rejects(() => send(result, { event: 'revise', document: { ...back, failed_tests: ['not-a-test'] } }, f.context), /failed_tests/);
  await assert.rejects(() => send(result, { event: 'revise', document: { failed_tests: ['complete'], slot_ids: ['missing'], reason: 'x' } }, f.context), /real slots/);
  // An acceptance test or a rubric gate can be named. The send-back does not use up a review round.
  let sent = await send(result, { event: 'revise', document: { ...back, failed_tests: ['complete', 'facts_trace_to_source'] } }, f.context);
  assert.equal(sent.phase, 'PRODUCE'); assert.equal(sent.state.history.at(-1).document.failed_tests.length, 2);
  sent = await send(sent, f.events[4], f.context); sent = await send(sent, f.events[5], f.context);
  assert.equal(sent.phase, 'DELIVER'); assert.equal(sent.next_action.alternative_event, undefined);
  assert.match(sent.next_action.instruction, /already sent this back once, so deliver with flags/);
  await assert.rejects(() => send(sent, { event: 'revise', document: { ...back, failed_tests: ['complete'] } }, f.context), /sends work back once/);
  assert.equal((await send(sent, f.events[6], f.context)).phase, 'LEARN');
  // Handing over without a send-back still works.
  assert.equal((await send(result, f.events[6], f.context)).phase, 'LEARN');
});

test('a job card from before the org context rename still passes: brand_brain is read when org_context is missing', async () => {
  for (const deliverable_kind of ['web_page', 'email']) {
    const f = engineFixture(), result = await startJob({ ...f.input, deliverable_kind }, f.context), old = structuredClone(f.card);
    old.brand_brain = old.org_context; old.brand_brain.path = 'brand-brain/00-index.md'; old.context_sources = [{ id: 'brand-brain', kind: 'files', ref: old.brand_brain.path }]; delete old.org_context;
    assert.equal((await send(result, { event: 'scope', document: old }, f.context)).phase, 'STAFF', deliverable_kind);
    const unread = structuredClone(old); unread.brand_brain.read_by_coordinator = false;
    await assert.rejects(() => send(result, { event: 'scope', document: unread }, f.context), /read_by_coordinator|org_context/, deliverable_kind);
  }
});
