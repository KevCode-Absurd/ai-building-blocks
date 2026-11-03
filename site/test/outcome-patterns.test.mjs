import test from 'node:test';
import assert from 'node:assert/strict';
import { anonymisePattern, catalogueGapReport, preparePattern, privacyScan, privateTerms, reviewSubmission, workflowDraft, REVIEW_CHECKLIST } from '../src/outcomes/patterns.mjs';
import { readBack } from '../src/outcomes/monitoring.mjs';
import example from '../src/outcomes/examples/rising-cpa.mjs';
import { call, complete, launched, rec } from './outcome-run-helper.mjs';

const copy = v => JSON.parse(JSON.stringify(v));
// The worked example with private details an owner might give: a brand, a person, an email, a phone, a town and figures.
const privateBrief = () => {
  const b = copy(example.brief);
  b.outcome = `Bring Sprout Bakery's cost per purchase from £14.50 back under £11 by spring. ${b.outcome}`;
  b.decides = 'Priya Shah, the owner (priya@sproutbakery.co.uk, 07700 900123)';
  b.assets = [...b.assets, 'Our shop on Kings Road, Leeds LS1 4AP, sells 2,400 loaves a month'];
  return b;
};

async function finished() {
  const { r, experiments, append } = await launched({ request: 'Sprout Bakery: my ads cost too much', brief: privateBrief() });
  const close = readBack(r.engagement, experiments, { experiment_id: 'x1', at: '2026-11-26', observed: 1180, volume: 60, guardrails: [{ name: 'Purchases per week stay above 80', held: true }], source: 'Ads Manager export' }).close.experiment;
  let done = await complete(r, 'measurement');
  done = await rec(done, 'record_outcome_experiment', 'experiment', close);
  const all = append(done.append.line);
  done = await complete(done, 'learning');
  if (done.engagement.stages.at(-1).state === 'AWAITING_APPROVAL') done = await call('advance_outcome', { engagement: done.engagement, engagement_sha256: done.engagement_sha256, event: { type: 'approve', stage_id: 'learning', decision: 'APPROVED', by: 'owner' } });
  return { done, experiments: all };
}

test('the anonymiser strips private data and keeps the plan\'s shape', async () => {
  const { done, experiments } = await finished();
  const terms = privateTerms(done.engagement);
  for (const t of ['Sprout', 'Bakery', 'Priya', 'Shah', 'Kings', 'Leeds']) assert.ok(terms.includes(t), t);
  assert.ok(!terms.includes('Meta'), 'platform names that public sources use are kept');
  const { pattern, removed, risks } = anonymisePattern(done.engagement, { experiments });
  const text = JSON.stringify(pattern);
  for (const bad of ['Sprout', 'Priya', 'sproutbakery', '07700', 'LS1', '14.50', '2,400', '1450', '1180']) assert.ok(!text.includes(bad), bad);
  assert.deepEqual(risks, []);
  assert.ok(Object.keys(removed).length);
  assert.equal(pattern.stages.length, example.plan.stages.length);
  assert.ok(pattern.stages.every(s => s.kind && (s.owner || s.gap)));
  assert.deepEqual(pattern.experiments, [{ hypothesis_id: 'h-underserved-segment', verdict: 'WIN', relative_change: -0.186, volume_met: true, guardrails_held: true }]);
  // Leftovers are caught before anything can be shared.
  assert.ok(privacyScan({ note: 'call 07700 900123' }).includes('phone: 07700 900123'));
  assert.deepEqual(privacyScan({ note: 'from Sprout' }, ['Sprout']), ['name: Sprout']);
});

test('consent is opt-in, for the exact file shown, and nothing is sent', async () => {
  const { done, experiments } = await finished();
  const base = { engagement: done.engagement, engagement_sha256: done.engagement_sha256, experiments };
  const preview = await call('prepare_outcome_pattern', base);
  assert.equal(preview.state, 'AWAITING_OWNER_CONSENT');
  assert.match(preview.ask_owner, /nothing is sent unless you say yes/);
  const shown = JSON.parse(preview.files['PATTERN.json']);
  assert.equal(shown.share, 'ONLY_WITH_OWNER_CONSENT');
  const consent = { pattern_sha256: preview.pattern_sha256, by: 'owner', consented: true, at: '2026-11-27' };

  await assert.rejects(call('prepare_outcome_pattern', { ...base, consent: { ...consent, by: 'host' } }), /Only the owner/);
  await assert.rejects(call('prepare_outcome_pattern', { ...base, remove: ['Purchase'], consent }), /different file/);
  assert.equal((await call('prepare_outcome_pattern', { ...base, consent: { ...consent, consented: false } })).state, 'NOT_SHARED');

  const ready = await call('prepare_outcome_pattern', { ...base, consent });
  assert.equal(ready.state, 'READY_TO_SEND');
  assert.match(ready.next, /Nothing has been sent/);
  const submission = JSON.parse(ready.files['PATTERN-SUBMISSION.json']);
  assert.equal(submission.schema, 'ai-blocks-pattern-review/1');
  assert.equal(submission.status, 'PENDING_REVIEW');
  assert.deepEqual(submission.pattern, shown);
  assert.equal(submission.review, null);
  // A pattern that still looks private cannot be consented to: ids are kept as written, so a brand in one is flagged.
  const branded = copy(done.engagement); branded.plan.hypotheses[0].id = 'h-sprout-regulars';
  const leaky = await preparePattern(branded, { experiments });
  assert.equal(leaky.state, 'NEEDS_CLEANING');
  assert.match(leaky.ask_owner, /name: Sprout/);
  await assert.rejects(preparePattern(branded, { experiments, consent: { ...consent, pattern_sha256: leaky.pattern_sha256 } }), /still looks private/);
  // An unfinished round has nothing to share.
  const { r } = await launched();
  assert.throws(() => anonymisePattern(r.engagement), /finished round/);
});

test('a person reviews a submission before it becomes a workflow draft, which is never published', async () => {
  const { done, experiments } = await finished();
  const preview = await preparePattern(done.engagement, { experiments });
  const submission = JSON.parse((await preparePattern(done.engagement, { experiments, consent: { pattern_sha256: preview.pattern_sha256, by: 'owner', consented: true, at: '2026-11-27' } })).files['PATTERN-SUBMISSION.json']);
  const all = Object.fromEntries(Object.keys(REVIEW_CHECKLIST).map(k => [k, true]));
  const review = { reviewer: 'Kevin', reviewer_kind: 'human', decision: 'APPROVED', at: '2026-11-28', checklist: all };

  assert.throws(() => workflowDraft(submission, { slug: 'lower-ad-cost', name: 'Bring ad costs back down' }), /reviewed and approved/);
  await assert.rejects(reviewSubmission(submission, { ...review, reviewer_kind: 'ai' }), /reviewed by a person/);
  await assert.rejects(reviewSubmission(submission, { ...review, checklist: { ...all, method_sound: false } }), /method_sound/);
  const tampered = copy(submission); tampered.pattern.stages[1].name = 'Sprout Bakery evidence';
  await assert.rejects(reviewSubmission(tampered, review), /differs from the file the owner consented to/);
  const rejected = await reviewSubmission(submission, { ...review, decision: 'REJECTED', checklist: {} });
  assert.throws(() => workflowDraft(rejected, { slug: 'lower-ad-cost', name: 'x' }), /reviewed and approved/);

  const approved = await reviewSubmission(submission, review);
  assert.equal(approved.status, 'APPROVED');
  await assert.rejects(reviewSubmission(approved, review), /only pending/);
  const draft = workflowDraft(approved, { slug: 'lower-ad-cost', name: 'Bring ad costs back down' });
  assert.equal(draft.published, false);
  assert.match(draft.files['item.yaml'], /status: draft\npublished: false/);
  assert.match(draft.files['item.yaml'], /type: workflow/);
  assert.match(draft.files['SKILL.md'], /DRAFT\. Not published/);
  for (const id of example.plan.stages.flatMap(s => s.uses ?? []).slice(0, 3)) assert.match(draft.files['item.yaml'], new RegExp(id));
  assert.ok(!/Sprout|Priya/.test(JSON.stringify(draft.files)));
});

test('the catalogue-gap report groups stages no specialist fit', () => {
  const report = catalogueGapReport([
    { source: 'a', industry: 'ecommerce', stages: [{ kind: 'production', gap: 'A packaging designer for food labels' }, { kind: 'evidence' }] },
    { source: 'b', industry: 'local-services', stages: [{ kind: 'production', gap: 'Packaging designer for food labels' }] },
    { source: 'c', stages: [{ kind: 'integrity', gap: 'A pharmacy compliance checker' }] },
  ]);
  assert.equal(report.gaps, 3);
  assert.equal(report.rows[0].count, 2);
  assert.deepEqual(report.rows[0].sources, ['a', 'b']);
  assert.match(report.markdown, /\| Specialist needed \| Times/);
  assert.match(catalogueGapReport([{ source: 'x', stages: [{ kind: 'evidence' }] }]).markdown, /No gaps/);
});
