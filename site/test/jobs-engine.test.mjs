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
  assert.equal(result.preference_update.preferences.by_job_type['write-documents'].proven_pool[0].family, 'family-0');
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

test('a missing or unread brand brain blocks staffing', async () => {
  const f = engineFixture(), result = await startJob(f.input, f.context), missing = structuredClone(f.card);
  delete missing.brand_brain;
  await assert.rejects(() => send(result, { event: 'scope', document: missing }, f.context), /brand_brain/);
  const unread = structuredClone(f.card); unread.brand_brain.read_by_coordinator = false;
  await assert.rejects(() => send(result, { event: 'scope', document: unread }, f.context), /read_by_coordinator|brand_brain/);
  const detached = structuredClone(f.card); detached.context_sources = [];
  await assert.rejects(() => send(result, { event: 'scope', document: detached }, f.context), /matching context source/);
});
