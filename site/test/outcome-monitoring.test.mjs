import test from 'node:test';
import assert from 'node:assert/strict';
import { outcomeLoopMcpTools, outcomeMcpTools } from '../src/outcomes/outcome-mcp.mjs';
import { parseExperiments, planReadbacks, readBack, readbackDates } from '../src/outcomes/monitoring.mjs';
import { REGISTER, call, complete, launched, rec } from './outcome-run-helper.mjs';

const GUARD = 'Purchases per week stay above 80';
const reading = (over = {}) => ({ experiment_id: 'x1', at: '2026-11-17', observed: 1300, volume: 30, guardrails: [{ name: GUARD, value: 95, limit: 80, worse_if: 'below' }], source: 'Ads Manager export, read-only', ...over });

test('a launched test is read back on schedule and closed with a verdict', async () => {
  const { r, experiments, append } = await launched();
  const tool = input => call('read_back_outcome_experiment', { engagement: r.engagement, engagement_sha256: r.engagement_sha256, experiments, ...input }, { today: '2026-11-17' });

  // The schedule: a weekly read inside the window, then a final read once the data settles.
  const plan = await tool({});
  assert.equal(plan.state, 'SCHEDULED');
  assert.deepEqual(plan.experiments[0].checks, ['2026-11-17']);
  assert.equal(plan.experiments[0].final, '2026-11-26');
  assert.equal(plan.routine.cron, '0 9 * * 2');
  assert.match(plan.routine.prompt, /read_back_outcome_experiment/);
  assert.match(plan.routine.prompt, /Never apply them/);
  assert.match(plan.files['READBACKS.md'], /only if the owner agrees/);

  // Mid-window: on track, no verdict, no peeking.
  const mid = await tool({ reading: reading() });
  assert.equal(mid.status, 'ON_TRACK');
  assert.equal(mid.verdict, undefined);
  assert.equal(mid.close, undefined);
  assert.equal(mid.next_readback, '2026-11-26');
  assert.equal(JSON.parse(mid.append.line).relative_change, -0.103);

  // Final read: an honest verdict and the payload record_outcome_experiment accepts.
  const end = readBack(r.engagement, experiments, reading({ at: '2026-11-26', observed: 1180, volume: 60 }), { today: '2026-11-26' });
  assert.equal(end.status, 'READY_TO_CLOSE');
  assert.equal(end.verdict, 'WIN');
  assert.equal(end.close.tool, 'record_outcome_experiment');
  assert.deepEqual(end.proposals.map(p => [p.action, p.applied, p.needs_owner_approval]), [['keep_change', false, true]]);
  let closed = await complete(r, 'measurement');
  closed = await rec(closed, 'record_outcome_experiment', 'experiment', end.close.experiment);
  assert.equal(JSON.parse(closed.append.line).verdict, 'WIN');
  assert.equal(closed.engagement.records.experiments.x1.state, 'CLOSED');
  // Once closed, it is not read again.
  assert.throws(() => readBack(closed.engagement, append(closed.append.line), reading({ at: '2026-11-27' })), /already closed/);
  assert.equal(planReadbacks(closed.engagement, experiments).state, 'NOTHING_TO_READ');
});

test('read-back verdicts follow the registered rules', async () => {
  const { r, experiments } = await launched();
  const at = (over, opts) => readBack(r.engagement, experiments, reading({ at: '2026-11-26', ...over }), opts);
  assert.equal(at({ volume: 31, observed: 1180 }).verdict, 'INCONCLUSIVE', 'below the minimum volume');
  assert.equal(at({ volume: 60, observed: 1500 }).verdict, 'LOSS', 'did not beat the baseline');
  assert.equal(at({ volume: 60, observed: 1430 }).verdict, 'WIN');
  assert.equal(at({ volume: 60, observed: 1430, min_effect: 0.05 }).verdict, 'INCONCLUSIVE', 'within the minimum effect');
  const broke = at({ volume: 60, observed: 1100, guardrails: [{ name: GUARD, value: 70, limit: 80, worse_if: 'below' }] });
  assert.equal(broke.verdict, 'LOSS', 'a broken guardrail is never a win');
  assert.equal(broke.status, 'GUARDRAIL_BREACH');
  assert.throws(() => at({ guardrails: [{ name: GUARD, held: true, value: 70, limit: 80, worse_if: 'below' }] }), /does not match/);
  assert.equal(at({ guardrails: [] }).status, 'INCOMPLETE_READING');
  assert.throws(() => at({ experiment_id: 'x9' }), /No registered experiment x9/);
  assert.throws(() => at({ source: undefined }), /source/);
  assert.throws(() => at({ note: 'key sk-ant-' + 'a'.repeat(40) }), /API key or token/);
  assert.throws(() => readBack(r.engagement, experiments, reading({ at: '2026-12-01' }), { today: '2026-11-30' }), /future/);
});

test('guardrail breaches alert at once and budget changes are only proposed', async () => {
  const { r, experiments } = await launched();
  const breach = readBack(r.engagement, experiments, reading({ guardrails: [{ name: GUARD, held: false, note: 'Purchases fell to 61' }] }));
  assert.equal(breach.status, 'GUARDRAIL_BREACH');
  assert.equal(breach.alerts[0].level, 'urgent');
  assert.match(breach.files['ALERTS.md'], /Nothing has been paused, reverted or changed/);
  assert.ok(breach.proposals.every(p => p.applied === false && p.needs_owner_approval === true));
  assert.equal(breach.close, undefined, 'a mid-window breach is the owner\'s call, not an automatic close');

  // Slow volume and overspend: proposals, never changes.
  const slow = readBack(r.engagement, experiments, reading({ at: '2026-11-12', volume: 5, spend: { to_date: 900, cap: 2000 } }));
  assert.match(slow.alerts.map(a => a.message).join(' '), /INCONCLUSIVE/);
  assert.match(slow.alerts.map(a => a.message).join(' '), /cap of 2000/);
  assert.deepEqual(slow.proposals.map(p => p.action).sort(), ['extend_window', 'lower_daily_budget']);
  assert.ok(slow.proposals.every(p => !p.applied));
  assert.equal(slow.review.applies_changes, false);
});

test('read-back schedules and tools stay small and opt-in', async () => {
  assert.deepEqual(readbackDates(REGISTER, { every_days: 3, settle_days: 0 }), { checks: ['2026-11-13', '2026-11-16', '2026-11-19', '2026-11-22'], final: '2026-11-24' });
  assert.equal(parseExperiments('').size, 0);
  assert.throws(() => parseExperiments('{not json'), /line 1/);
  const { r, experiments } = await launched();
  assert.equal(planReadbacks(r.engagement, experiments, { every_days: 1 }).routine.cron, '0 9 * * *');
  assert.throws(() => planReadbacks(r.engagement, experiments, { every_days: 5 }), /every_days/);
  // Not in the public list until added on purpose; routed by callOutcomeTool either way.
  assert.ok(!outcomeMcpTools.some(t => t.name === 'read_back_outcome_experiment'));
  assert.ok(JSON.stringify(outcomeLoopMcpTools).length < 4500);
  await assert.rejects(call('read_back_outcome_experiment', { engagement: r.engagement, engagement_sha256: '0'.repeat(64), experiments }), /changed since/);
  await assert.rejects(call('read_back_outcome_experiment', { engagement: r.engagement, engagement_sha256: r.engagement_sha256, experiments, budget: 5 }), /Unsupported argument budget/);
});
