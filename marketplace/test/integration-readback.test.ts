import test from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore Standalone portable Node tool intentionally ships without TypeScript declarations.
import { checkIntegrationReadback, integrationTemplate, integrationDigest, LIVE_CHECKS } from '../packs/shared/tools/integration-readback.mjs';

const now = Date.parse('2026-11-17T12:00:00Z');
function fixture(provider = 'meta', stage = 'draft') {
  const plan = integrationTemplate(provider); plan.accountId = 'test-account'; plan.stage = stage;
  if (stage === 'live') plan.objects[0].fields.status = 'ACTIVE';
  const readback: any = { schema: 'integration-readback/1', provider, accountId: plan.accountId, environment: plan.environment,
    observedAt: new Date(now).toISOString(), sourceRef: 'receipts/provider-result.json', planDigest: integrationDigest(plan),
    objects: [{ key: 'primary', providerId: 'provider-object-1', fields: { ...plan.objects[0].fields } }], checks: [] as any[] };
  return { plan, readback };
}
const run = (plan: any, readback: any) => checkIntegrationReadback(plan, readback, { now });
test('missing connector has resumable dependency, never a fabricated execution pass', () => {
  const { plan } = fixture(); const r = run(plan, null);
  assert.equal(r.status, 'DEPENDENCY_REQUIRED'); assert.equal(r.externalActionsExecuted, 0); assert.equal(r.authorityGranted, false);
  assert.match(r.resume, /Reuse authority/); assert.equal(r.remaining[0].check, 'connection');
});
test('draft readback matches exact object state without claiming live readiness', () => {
  const { plan, readback } = fixture(); const r = run(plan, readback);
  assert.equal(r.status, 'DRAFT_READBACK_MATCHED'); assert.equal(r.assurance, 'submitted-readback-only-not-authenticated');
});
test('active state cannot satisfy a paused intended object', () => {
  const { plan, readback } = fixture(); readback.objects[0].fields.status = 'ACTIVE';
  assert.equal(run(plan, readback).findings[0].code, 'FIELD_MISMATCH');
  plan.objects[0].fields.status = 'ACTIVE'; assert.equal(run(plan, readback).status, 'INVALID');
});
test('cross-account, cross-provider and sandbox-to-production evidence is rejected', () => {
  for (const field of ['provider', 'accountId', 'environment']) {
    const { plan, readback } = fixture(); readback[field] = field === 'environment' ? 'production' : 'other';
    assert.ok(run(plan, readback).findings.some((f: any) => f.code === 'SCOPE_MISMATCH'));
  }
});
test('current plan digest changes with exact intended budget and normalized field types', () => {
  const { plan, readback } = fixture(); plan.objects[0].fields.dailyBudgetMinorUnits = 5000;
  assert.ok(run(plan, readback).findings.some((f: any) => f.code === 'PLAN_CHANGED'));
  readback.planDigest = integrationDigest(plan); readback.objects[0].fields.dailyBudgetMinorUnits = '5000';
  assert.ok(run(plan, readback).findings.some((f: any) => f.path.endsWith('.dailyBudgetMinorUnits')));
  readback.objects[0].fields.dailyBudgetMinorUnits = 5000; assert.equal(run(plan, readback).status, 'DRAFT_READBACK_MATCHED');
});
test('stale and future-dated provider snapshots cannot pass', () => {
  for (const minutes of [-16, 2]) { const { plan, readback } = fixture(); readback.observedAt = new Date(now + minutes * 60000).toISOString(); assert.ok(run(plan, readback).findings.some((f: any) => f.code === 'STALE')); }
});
test('partial batch leaves only missing objects in the resumable record', () => {
  const { plan, readback } = fixture(); plan.objects.push({ key: 'second', fields: { status: 'PAUSED' } }); readback.planDigest = integrationDigest(plan);
  const r = run(plan, readback); assert.deepEqual(r.remaining.map((f: any) => f.check), ['objects.second']);
});
test('duplicate provider IDs, keys and unrelated readback objects fail closed', () => {
  const { plan, readback } = fixture(); readback.objects.push({ ...readback.objects[0] }); assert.equal(run(plan, readback).status, 'INVALID');
  readback.objects[1].key = 'unrequested'; assert.equal(run(plan, readback).status, 'INVALID');
});
for (const provider of ['meta', 'shopify', 'messaging']) test(`${provider} live completion requires performed provider-specific checks`, () => {
  const { plan, readback } = fixture(provider, 'live');
  assert.equal(run(plan, readback).findings.filter((f: any) => f.code === 'CHECK_REQUIRED').length, LIVE_CHECKS[provider].length);
  readback.checks = LIVE_CHECKS[provider].map((name: string) => ({ name, status: 'PASS', sourceRef: `receipts/${name}.json`, observedAt: readback.observedAt, detail: 'Observed result for this test fixture.' }));
  assert.equal(run(plan, readback).status, 'LIVE_READBACK_MATCHED');
  readback.checks[0].status = 'NOT_RUN'; assert.equal(run(plan, readback).status, 'REVIEW_REQUIRED');
});
test('a failed operational check remains visible even if the draft built correctly', () => {
  const { plan, readback } = fixture(); readback.checks = [{ name: 'tracking', status: 'FAIL', sourceRef: 'receipts/events.json', observedAt: readback.observedAt, detail: 'Browser and server event IDs differ.' }];
  assert.ok(run(plan, readback).findings.some((f: any) => f.code === 'CHECK_FAILED'));
});
test('live check timestamps and actual result references are required', () => {
  const { plan, readback } = fixture('messaging', 'live');
  readback.checks = [{ name: 'inbox_test', status: 'PASS', detail: 'Model says fine.' }]; assert.equal(run(plan, readback).status, 'INVALID');
  readback.checks[0].sourceRef = 'receipt.json'; readback.checks[0].observedAt = new Date(now - 3600000).toISOString();
  assert.ok(run(plan, readback).findings.some((f: any) => f.code === 'STALE'));
});
test('invalid schemas, malformed fields and placeholders fail without crashes', () => {
  for (const input of [null, [], {}, { ...integrationTemplate(), accountId: 'test', objects: [{ key: 'x', fields: { status: 42 } }] }]) assert.equal(run(input, null).status, 'INVALID');
  assert.equal(run(integrationTemplate(), null).status, 'INVALID');
  const { plan, readback } = fixture(); readback.assumeVerified = true; assert.equal(run(plan, readback).status, 'INVALID');
});
test('invalid freshness controls cannot suppress required checks', () => {
  const { plan, readback } = fixture();
  for (const options of [{ now: NaN }, { now, maxAgeMinutes: Infinity }, { now, maxAgeMinutes: 0 }]) assert.equal(checkIntegrationReadback(plan, readback, options).status, 'INVALID');
});
test('ambiguous local timestamps cannot stand in for current provider capture time', () => {
  for (const value of ['2026-11-17', '2026-11-17T12:00:00', '11/17/2026 12:00:00']) {
    const { plan, readback } = fixture(); readback.observedAt = value; assert.equal(run(plan, readback).status, 'INVALID');
  }
  const { plan, readback } = fixture(); readback.observedAt = '2026-11-17T17:30:00+05:30';
  assert.equal(run(plan, readback).status, 'DRAFT_READBACK_MATCHED');
});
test('inherited schema fields are not accepted as a submitted JSON plan', () => {
  const { plan } = fixture(); assert.equal(run(Object.create(plan), null).status, 'INVALID');
});

