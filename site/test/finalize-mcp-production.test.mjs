import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { productionFinalization, finalizeMcpProduction, REQUIRED_PRODUCTION_PUBLIC_CHECKS, REQUIRED_PRODUCTION_PERSONAL_CHECKS } from '../../tools/finalize-mcp-production.mjs';

function fixture() {
  const worker = 'a'.repeat(64), manifest = 'b'.repeat(64), version = 'new-production-version-uuid';
  const tracker = { checkedOn: 'old-checked', staging: { status: 'historical-staging-status', checkedOn: 'old-staging-date', evidence: { retained: true } }, production: { versionId: version, workerSha256: worker, publicManifestSha256: manifest, status: 'deployed-awaiting-canaries', verified: false, flags: { PUBLIC_API_ENABLED: 'true', MCP_OAUTH_ENABLED: 'true' }, AIEnabled: true, dailyCapUSD: '10', priorVerification: { retained: true }, unknownFutureField: ['keep', 'all'] }, otherRelease: { untouched: true } };
  const deployment = { environment: 'production', status: 'deployed-awaiting-canaries', versionId: version, workerSha256: worker, publicManifestSha256: manifest, catalogueSha256: 'c'.repeat(64), flags: tracker.production.flags, originalRowsPreserved: true, existingComposerEnabled: true, existingBudgetPreserved: true, privatePreviewNotEnabled: true, deployedOn: '2026-10-23T09:00:00Z' };
  const canary = { status: 'pass', environment: 'production', origin: 'https://useaiblocks.com', recorded_at: '2026-10-23T09:01:00Z', checks: [...REQUIRED_PRODUCTION_PUBLIC_CHECKS, ...REQUIRED_PRODUCTION_PERSONAL_CHECKS].map(check => ({ check, status: 'PASS' })), server_model_calls: 0, credentials_written: false, private_content_recorded: false };
  const acceptance = { status: 'pass', productionCompatible: true, stagedSourceEquivalent: true, workerSha256: worker, unitTestsPassed: 363, typescript: 'PASS' };
  const packageEvidence = { allCommandsPassed: true, workerSha256: worker, jobs: [{ name: 'unit-tests', exitCode: 0, counts: { tests: 363, pass: 363, fail: 0 } }, ...['site-typescript', 'api-typescript', 'worker-package'].map(name => ({ name, exitCode: 0 }))] };
  const access = { ok: true, environment: 'staging', restored: true, fixture_cleanup_verified: true, checks: Array.from({ length: 59 }, (_, i) => ({ check: `company-${i}`, status: 'PASS' })) };
  const personal = { ok: true, environment: 'real-staging', savedRowsRestored: true, tokensWritten: false, productionChanged: false, resourcesVerified: 6, checks: ['temporary-personal-oauth-grant-revoked-and-access-denied', 'account_minds-original-row-restored-exactly', 'account_library-original-row-restored-exactly', ...Array.from({ length: 10 }, (_, i) => `personal-${i}`)].map(check => ({ check, status: 'PASS' })) };
  const codex = { status: 'PASS', runs: [{ status: 'PASS', resourcesIndependentlyVerified: 9 }, { status: 'PASS', resourcesIndependentlyVerified: 9 }], separateCodexInvocations: true, sameWorkflowRevision: true, samePreparationHash: true, noNewSetupOnSecondRun: true, noHostedComposerJobs: true };
  const reuse = { savedSourcesUnchanged: true, noNewClientRegistration: true, noNewOAuthConsent: true, noHostedComposerJobs: true, hostedComposerJobs: 0 };
  const paths = { deployment: 'reports/2026-10-23-mcp-production-deployment.json', productionCanary: 'reports/2026-10-23-mcp-production-canary-2.json', releaseAcceptance: 'reports/2026-10-23-mcp-release-acceptance.json', packageEvidence: 'reports/2026-10-23-mcp-production-package.json', companyAccess: 'reports/2026-10-23-mcp-access-live-1792747705761.json', personalLibrary: 'reports/2026-10-23-mcp-personal-live-1792747821407.json', realCodex: 'reports/2026-10-23-mcp-codex-end-to-end.json', codexReuse: 'reports/2026-10-23-mcp-reuse-after-second.json' };
  return { tracker, deployment, canary, acceptance, packageEvidence, access, personal, codex, reuse, paths, verifiedOn: '2026-10-23T09:02:00Z' };
}

test('production finalization changes only API/MCP bookkeeping and retains historical staging and unrelated tracker fields', () => {
  const data = fixture(), original = structuredClone(data);
  const result = productionFinalization(data);
  assert.equal(result.tracker.production.status, 'published-and-verified'); assert.equal(result.tracker.production.apiMcpVerified, true);
  assert.deepEqual(result.tracker.staging, data.tracker.staging); assert.deepEqual(result.tracker.otherRelease, data.tracker.otherRelease);
  for (const key of ['AIEnabled', 'dailyCapUSD', 'priorVerification', 'unknownFutureField']) assert.deepEqual(result.tracker.production[key], data.tracker.production[key]);
  assert.equal(result.report.productionCanaryChecksPassed, 14);
  assert.equal(result.report.stagingAcceptance.unitTestsPassed, 363); assert.deepEqual(result.report.stagingAcceptance.resourcesHashVerifiedPerRun, [9, 9]);
  assert.equal(result.report.historicalStagingReportsModified, false); assert.match(result.markdown, /protocol, public resource integrity/);
  assert.deepEqual(data, original);
});

test('production verification requires real personal OAuth, explicit revocation and every public check passing', () => {
  for (const changed of ['missing-personal', 'revocation-failed', 'unrun-public', 'wrong-origin', 'stale-date']) {
    const data = fixture();
    if (changed === 'missing-personal') data.canary.checks = data.canary.checks.filter(c => !REQUIRED_PRODUCTION_PERSONAL_CHECKS.includes(c.check));
    if (changed === 'revocation-failed') data.canary.checks.at(-1).status = 'FAIL';
    if (changed === 'unrun-public') data.canary.checks[0].status = 'NOT_RUN';
    if (changed === 'wrong-origin') data.canary.origin = 'https://staging.example.test';
    if (changed === 'stale-date') data.canary.recorded_at = '2026-10-23T08:59:00Z';
    assert.throws(() => productionFinalization(data), undefined, changed);
  }
});

test('tracker version, accepted package, model-cost boundary and staging restoration evidence fail closed', () => {
  for (const mutate of [d => { d.tracker.production.versionId = 'other-production-version'; }, d => { d.deployment.workerSha256 = 'd'.repeat(64); }, d => { d.packageEvidence.jobs[0].counts.fail = 1; }, d => { d.canary.server_model_calls = 1; }, d => { d.access.restored = false; }, d => { d.personal.savedRowsRestored = false; }, d => { d.codex.noNewSetupOnSecondRun = false; }]) {
    const data = fixture(); mutate(data); assert.throws(() => productionFinalization(data));
  }
});

test('the exact reviewed one-row synthetic cleanup is recorded honestly without claiming every original row survived', () => {
  const data = fixture();
  data.deployment.originalRowsPreserved = false; data.deployment.requiredBaselineRowsPreservedExactly = true;
  data.deployment.syntheticTestCleanupReconciliation = { reconciled: true, syntheticOnly: true, customerRowsPreserved: true, summary: 'One exact synthetic test row was removed by concurrent cleanup; customer rows remained byte-identical.', excludedCount: 1, rowSha256: 'e'.repeat(64) };
  const result = productionFinalization(data);
  assert.equal(result.report.originalRowsPreserved, false); assert.equal(result.report.customerRowsPreserved, true); assert.equal(result.report.requiredBaselineRowsPreservedExactly, true);
  assert.match(result.markdown, /One exact synthetic test row/);
  data.deployment.syntheticTestCleanupReconciliation.excludedCount = 2;
  assert.throws(() => productionFinalization(data), /single-row/);
});

test('local finalizer rejects an older canary before changing tracker or historical staging reports', async () => {
  const repo = await fs.mkdtemp(path.join(os.tmpdir(), 'mcp-finalizer-test-'));
  try {
    const data = fixture(), reports = path.join(repo, 'reports'); await fs.mkdir(reports);
    const source = { deployment: data.deployment, productionCanary: data.canary, releaseAcceptance: data.acceptance, packageEvidence: data.packageEvidence, companyAccess: data.access, personalLibrary: data.personal, realCodex: data.codex, codexReuse: data.reuse };
    await fs.writeFile(path.join(reports, 'cloudflare-live-release.json'), JSON.stringify(data.tracker));
    for (const [key, relative] of Object.entries(data.paths)) await fs.writeFile(path.join(repo, relative), JSON.stringify(source[key]));
    await fs.writeFile(path.join(reports, '2026-10-23-mcp-production-canary-1.json'), JSON.stringify(data.canary));
    const historical = '{"checkedOn":"2026-10-23T07:00:00Z","status":"historical-staging-evidence"}';
    await fs.writeFile(path.join(reports, '2026-10-23-mcp-staging-validation.json'), historical);
    await assert.rejects(finalizeMcpProduction({ repo, canaryFile: 'reports/2026-10-23-mcp-production-canary-1.json' }), /newer production canary/);
    assert.equal(await fs.readFile(path.join(reports, 'cloudflare-live-release.json'), 'utf8'), JSON.stringify(data.tracker));
    assert.equal(await fs.readFile(path.join(reports, '2026-10-23-mcp-staging-validation.json'), 'utf8'), historical);
    await assert.rejects(fs.access(path.join(reports, '2026-10-23-mcp-production-validation.json')), /ENOENT/);
    await assert.rejects(fs.access(path.join(reports, '.mcp-production-finalize.lock')), /ENOENT/);
  } finally {
    const relative = path.relative(os.tmpdir(), repo);
    assert(relative.startsWith('mcp-finalizer-test-') && !relative.includes(path.sep) && !path.isAbsolute(relative));
    await fs.rm(repo, { recursive: true, force: true });
  }
});
