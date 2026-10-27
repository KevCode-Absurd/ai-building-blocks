// Final bookkeeping only. No remote calls, credentials, browser control or deployment.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createHash, randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';

export const REQUIRED_PRODUCTION_PUBLIC_CHECKS = [
  'production_status_no_hosted_execution_or_model_calls', 'production_openapi', 'client_neutral_connection_docs', 'production_oauth_discovery',
  'personal_anonymous_rejected_with_oauth_challenge', 'company_anonymous_rejected_with_oauth_challenge',
  'official_sdk_public_initialize_and_nine_tools', 'public_skill_complete_resource_hash_verified',
  'public_workflow_preparation_not_execution', 'public_rest_mcp_preparation_parity',
];
export const REQUIRED_PRODUCTION_PERSONAL_CHECKS = [
  'production_real_account_oauth_and_fourteen_tools', 'production_personal_saved_library_rest_mcp_parity',
  'production_personal_token_denied_company_resource', 'production_temporary_canary_grant_revoked_and_access_rejected',
];
const origin = 'https://useaiblocks.com';
const outputJson = 'reports/2026-10-23-mcp-production-validation.json';
const outputMarkdown = 'reports/2026-10-23-mcp-production-validation.md';
const canonical = v => Array.isArray(v) ? v.map(canonical) : v && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical(v[k])])) : v;
const hash = v => createHash('sha256').update(typeof v === 'string' ? v : JSON.stringify(canonical(v))).digest('hex');
const passedChecks = (report, required, label) => {
  assert(Array.isArray(report.checks) && report.checks.length >= required.length, `${label}: required checks are missing.`);
  assert(report.checks.every(c => c && c.status === 'PASS'), `${label}: all checks must pass; skipped, unrun and failed checks are unacceptable.`);
  const names = report.checks.map(c => c.check ?? c.id);
  assert.equal(new Set(names).size, names.length, `${label}: duplicate check labels are ambiguous.`);
  for (const name of required) assert(names.includes(name), `${label}: required check ${name} did not pass.`);
};
const validTime = value => { const time = Date.parse(value); assert(Number.isFinite(time), 'Evidence timestamps must be valid.'); return time; };

export function productionFinalization({ tracker, deployment, canary, acceptance, packageEvidence, access, personal, codex, reuse, paths, verifiedOn = new Date().toISOString() }) {
  assert.equal(deployment.environment, 'production'); assert.equal(deployment.status, 'deployed-awaiting-canaries');
  assert(typeof deployment.versionId === 'string' && deployment.versionId.length > 10, 'A deployed version is required.');
  for (const field of ['workerSha256', 'publicManifestSha256', 'catalogueSha256']) assert(/^[a-f0-9]{64}$/.test(deployment[field] ?? ''), `Deployment ${field} is required.`);
  assert.equal(tracker.production?.versionId, deployment.versionId, 'The current tracker production version differs from the deployment evidence. Reconcile before finalization.');
  assert.equal(tracker.production.workerSha256, deployment.workerSha256, 'Tracked worker differs from the deployed worker.');
  assert.equal(tracker.production.publicManifestSha256, deployment.publicManifestSha256, 'Tracked public manifest differs from deployment.');
  assert.equal(deployment.flags?.PUBLIC_API_ENABLED, 'true'); assert.equal(deployment.flags?.MCP_OAUTH_ENABLED, 'true');
  assert.equal(tracker.production.flags?.PUBLIC_API_ENABLED, 'true'); assert.equal(tracker.production.flags?.MCP_OAUTH_ENABLED, 'true');
  assert.equal(deployment.existingComposerEnabled, true); assert.equal(deployment.existingBudgetPreserved, true); assert.equal(deployment.privatePreviewNotEnabled, true);
  assert.equal(canary.status, 'pass'); assert.equal(canary.environment, 'production'); assert.equal(canary.origin, origin);
  assert(validTime(canary.recorded_at) >= validTime(deployment.deployedOn), 'Production canary predates this deployment.');
  assert(validTime(verifiedOn) >= validTime(canary.recorded_at), 'Verification cannot predate its evidence.');
  passedChecks(canary, [...REQUIRED_PRODUCTION_PUBLIC_CHECKS, ...REQUIRED_PRODUCTION_PERSONAL_CHECKS], 'Production canary');
  assert.equal(canary.server_model_calls, 0); assert.equal(canary.credentials_written, false); assert.equal(canary.private_content_recorded, false);
  assert.equal(acceptance.status, 'pass'); assert.equal(acceptance.productionCompatible, true); assert.equal(acceptance.stagedSourceEquivalent, true);
  assert.equal(acceptance.workerSha256, deployment.workerSha256, 'Deployment does not match the tested accepted worker.');
  assert.equal(acceptance.unitTestsPassed, 363); assert.equal(acceptance.typescript, 'PASS');
  assert.equal(packageEvidence.allCommandsPassed, true);
  assert.equal(packageEvidence.workerSha256, deployment.workerSha256, 'Packaged checks do not match the deployed worker.');
  const unit = packageEvidence.jobs?.find(command => command.name === 'unit-tests');
  assert(unit && unit.exitCode === 0 && unit.counts?.tests === 363 && unit.counts.pass === 363 && unit.counts.fail === 0, 'The accepted 363 passing unit tests are required.');
  for (const name of ['site-typescript', 'api-typescript', 'worker-package']) assert(packageEvidence.jobs.some(c => c.name === name && c.exitCode === 0), `Accepted check ${name} is required.`);
  assert.equal(access.ok, true); assert.equal(access.environment, 'staging'); assert.equal(access.restored, true); assert.equal(access.fixture_cleanup_verified, true);
  passedChecks(access, [], 'Staging company access'); assert.equal(access.checks.length, 59);
  assert.equal(personal.ok, true); assert.equal(personal.environment, 'real-staging'); assert.equal(personal.savedRowsRestored, true);
  passedChecks(personal, ['temporary-personal-oauth-grant-revoked-and-access-denied', 'account_minds-original-row-restored-exactly', 'account_library-original-row-restored-exactly'], 'Staging personal library');
  assert.equal(personal.checks.length, 13); assert.equal(personal.tokensWritten, false); assert.equal(personal.productionChanged, false);
  assert.equal(codex.status, 'PASS'); assert.equal(codex.runs?.length, 2);
  for (const run of codex.runs) { assert.equal(run.status, 'PASS'); assert.equal(run.resourcesIndependentlyVerified, 9); }
  for (const field of ['separateCodexInvocations', 'sameWorkflowRevision', 'samePreparationHash', 'noNewSetupOnSecondRun', 'noHostedComposerJobs']) assert.equal(codex[field], true);
  for (const field of ['savedSourcesUnchanged', 'noNewClientRegistration', 'noNewOAuthConsent', 'noHostedComposerJobs']) assert.equal(reuse[field], true);
  assert.equal(reuse.hostedComposerJobs, 0);
  let reconciliation = null;
  if (deployment.syntheticTestCleanupReconciliation !== undefined) {
    const value = deployment.syntheticTestCleanupReconciliation;
    assert(value?.reconciled === true && value.syntheticOnly === true && value.customerRowsPreserved === true && typeof value.summary === 'string' && value.excludedCount === 1 && /^[a-f0-9]{64}$/.test(value.rowSha256 ?? ''), 'Synthetic cleanup reconciliation needs an explicit reviewed, single-row synthetic-only result.');
    reconciliation = { reconciled: true, syntheticOnly: true, customerRowsPreserved: true, summary: value.summary, excludedCount: 1, rowSha256: value.rowSha256 };
  }
  assert(deployment.originalRowsPreserved === true || deployment.originalRowsPreserved === false && deployment.requiredBaselineRowsPreservedExactly === true && reconciliation, 'Existing rows must be preserved or covered by the exact reviewed synthetic-cleanup reconciliation.');
  const report = {
    schema: 'abb-production-api-mcp-validation/1', status: 'PASS', environment: 'production', checkedOn: verifiedOn, origin,
    productionVersionId: deployment.versionId, workerSha256: deployment.workerSha256, publicManifestSha256: deployment.publicManifestSha256,
    apiEnabled: true, oauthEnabled: true, serverModelCallsByCanary: 0, hostedWorkflowExecution: false,
    productionCanaryChecksPassed: canary.checks.length, requiredPublicCanariesPassed: REQUIRED_PRODUCTION_PUBLIC_CHECKS.length,
    productionPersonalOAuth: { status: 'PASS', temporaryGrantRevokedAndAccessDenied: true, savedLibraryRestMcpParity: true, companyResourceDenied: true },
    stagingAcceptance: { unitTestsPassed: 363, siteAndApiTypescript: 'PASS', companyAccessChecksPassed: 59, companyFixturesRestored: true, personalLibraryChecksPassed: 13, originalPersonalRowsRestored: true, personalResourcesHashVerified: personal.resourcesVerified, realCodexRunsPassed: 2, resourcesHashVerifiedPerRun: [9, 9], secondRunReusedSavedWorkflowAndConnection: true, noHostedComposerJobs: true },
    originalRowsPreserved: deployment.originalRowsPreserved, requiredBaselineRowsPreservedExactly: deployment.originalRowsPreserved === true || deployment.requiredBaselineRowsPreservedExactly === true, customerRowsPreserved: true, existingComposerAndBudgetPreserved: true, ...(reconciliation ? { syntheticTestCleanupReconciliation: reconciliation } : {}),
    evidence: paths,
    scope: 'Production public API/MCP discovery, complete public skill resource integrity, deterministic preparation, authenticated personal saved-library protocol/REST parity and grant revocation. Full saved-work execution and company membership/failure matrices were verified in isolated staging with the same accepted source.',
    limitations: [
      'Production canaries verify protocol, retrieval and preparation; they do not claim a new AI workflow execution in production.',
      'Actual host execution was tested twice in Codex against synthetic company text resources in staging. Other AI clients remain unverified.',
      'Private binary files, hosted execution, enforced host obedience and a measured per-user infrastructure cost guarantee are outside this release.',
    ],
    historicalStagingReportsModified: false, finalizerRemoteOperations: 0,
  };
  const next = structuredClone(tracker);
  Object.assign(next.production, { status: 'published-and-verified', verified: true, canaries: 'PASS', apiMcpVerified: true, apiMcpVerifiedOn: verifiedOn, apiMcpCanaryReport: paths.productionCanary, apiMcpValidationReport: outputJson, apiMcpVerification: { ...(next.production.apiMcpVerification ?? {}), status: 'passed-tested-production-canaries', versionId: deployment.versionId, verifiedOn, report: outputJson, canaryReport: paths.productionCanary, productionCanaryChecksPassed: canary.checks.length, realPersonalOAuthVerified: true, temporaryCanaryGrantRevoked: true, scope: report.scope } });
  next.checkedOn = verifiedOn;
  const markdown = `# API and MCP production verification — 23 October 2026\n\n**PASS:** the production API/MCP release is published and verified within the tested scope.\n\nProduction version: \`${deployment.versionId}\`.\n\n| Evidence | Result |\n| --- | --- |\n| Production protocol and retrieval canaries | ${canary.checks.length} passed |\n| Production personal work-account OAuth, REST/MCP parity, scope rejection and temporary grant revocation | Passed |\n| Release unit tests; site/API TypeScript | 363 passed; passed |\n| Staging company membership and failure matrix | 59 passed; fixture restored |\n| Staging personal saved-work matrix | 13 passed; original account rows restored |\n| Actual Codex staging workflow execution | Two successful runs; nine resources hash-verified per run |\n| Reuse | Same saved workflow/revision/preparation and connection, without new setup |\n\nExisting customer rows, the website composer and its budget settings were preserved.${reconciliation ? ` ${reconciliation.summary}` : ''} The API prepares and retrieves material; the customer's AI performs workflow execution with its own tools and accounts.\n\nThe production canary covers protocol, public resource integrity and authenticated personal saved-library access. Full saved-work execution and the company access matrix were tested in isolated staging. Other AI hosts, private binary support files and guaranteed per-user infrastructure costs remain outside the verified scope.\n\nEvidence: [production canary](${path.basename(paths.productionCanary)}), [deployment](${path.basename(paths.deployment)}), [release acceptance](${path.basename(paths.releaseAcceptance)}), [company access](${path.basename(paths.companyAccess)}), [personal library](${path.basename(paths.personalLibrary)}), [two Codex runs](${path.basename(paths.realCodex)}), [reuse audit](${path.basename(paths.codexReuse)}).\n\nHistorical staging reports and their dates were retained. Finalization changed local tracking/report files only; it made no remote requests.\n`;
  return { tracker: next, report, markdown };
}

export async function finalizeMcpProduction({ repo = path.resolve(import.meta.dirname, '..'), canaryFile, deploymentFile = 'reports/2026-10-23-mcp-production-deployment.json' }) {
  assert(canaryFile, 'Provide the latest successful production canary report explicitly with --canary.');
  const reports = path.join(repo, 'reports'), fullCanary = path.resolve(repo, canaryFile);
  assert.equal(path.dirname(fullCanary), reports, 'The canary must be a local report in this repository.');
  assert(/^2026-10-23-mcp-production-canary-\d+\.json$/.test(path.basename(fullCanary)), 'Use a production canary evidence filename.');
  const latest = (await fs.readdir(reports)).filter(name => /^2026-10-23-mcp-production-canary-\d+\.json$/.test(name)).sort((a, b) => Number(b.match(/(\d+)\.json$/)[1]) - Number(a.match(/(\d+)\.json$/)[1]))[0];
  assert.equal(path.basename(fullCanary), latest, 'A newer production canary exists; inspect it before finalizing.');
  const paths = { deployment: path.relative(repo, path.resolve(repo, deploymentFile)).replaceAll('\\', '/'), productionCanary: path.relative(repo, fullCanary).replaceAll('\\', '/'), releaseAcceptance: 'reports/2026-10-23-mcp-release-acceptance.json', packageEvidence: 'reports/2026-10-23-mcp-production-package.json', companyAccess: 'reports/2026-10-23-mcp-access-live-1792747705761.json', personalLibrary: 'reports/2026-10-23-mcp-personal-live-1792747821407.json', realCodex: 'reports/2026-10-23-mcp-codex-end-to-end.json', codexReuse: 'reports/2026-10-23-mcp-reuse-after-second.json' };
  assert.equal(path.dirname(path.resolve(repo, paths.deployment)), reports, 'The deployment evidence must be a local repository report.');
  const lockPath = path.join(reports, '.mcp-production-finalize.lock'), lock = await fs.open(lockPath, 'wx');
  const temporary = [];
  try {
    const trackerFile = path.join(reports, 'cloudflare-live-release.json'), originalTracker = await fs.readFile(trackerFile, 'utf8');
    const sourceText = Object.fromEntries(await Promise.all(Object.entries(paths).map(async ([key, relative]) => [key, await fs.readFile(path.join(repo, relative), 'utf8')])));
    const data = Object.fromEntries(Object.entries(sourceText).map(([key, text]) => [key, JSON.parse(text)]));
    const finalized = productionFinalization({ tracker: JSON.parse(originalTracker), deployment: data.deployment, canary: data.productionCanary, acceptance: data.releaseAcceptance, packageEvidence: data.packageEvidence, access: data.companyAccess, personal: data.personalLibrary, codex: data.realCodex, reuse: data.codexReuse, paths });
    finalized.report.evidenceSha256 = Object.fromEntries(Object.entries(sourceText).map(([key, text]) => [key, hash(text)]));
    for (const file of [outputJson, outputMarkdown]) await assert.rejects(fs.access(path.join(repo, file)), /ENOENT/, 'Preserve existing production validation; reconcile an already-finalized release explicitly.');
    for (const [key, relative] of Object.entries(paths)) assert.equal(await fs.readFile(path.join(repo, relative), 'utf8'), sourceText[key], 'Evidence changed during finalization.');
    assert.equal(await fs.readFile(trackerFile, 'utf8'), originalTracker, 'Tracker changed concurrently; no files have been updated.');
    const stage = async (destination, text) => { const file = path.join(reports, `.mcp-production-finalize-${randomUUID()}.tmp`); temporary.push(file); await fs.writeFile(file, text, { flag: 'wx' }); await fs.rename(file, destination); temporary.splice(temporary.indexOf(file), 1); };
    await stage(path.join(repo, outputJson), JSON.stringify(finalized.report, null, 2) + '\n');
    await stage(path.join(repo, outputMarkdown), finalized.markdown);
    assert.equal(await fs.readFile(trackerFile, 'utf8'), originalTracker, 'Tracker changed concurrently; validation evidence is saved but tracking was not overwritten.');
    await stage(trackerFile, JSON.stringify(finalized.tracker, null, 2) + '\n');
    return { status: 'PASS', productionVersionId: finalized.report.productionVersionId, productionCanaryChecksPassed: finalized.report.productionCanaryChecksPassed, report: outputJson, trackerUpdated: true, historicalStagingReportsModified: false, remoteOperations: 0 };
  } finally { for (const file of temporary) await fs.unlink(file).catch(() => {}); await lock.close(); await fs.unlink(lockPath); }
}

async function main() {
  const options = {}; const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i += 2) { assert(['--canary', '--deployment'].includes(args[i]) && args[i + 1], 'Use --canary PATH and optional --deployment PATH.'); const key = args[i] === '--canary' ? 'canaryFile' : 'deploymentFile'; assert(!options[key], 'Duplicate finalization option.'); options[key] = args[i + 1]; }
  console.log(JSON.stringify(await finalizeMcpProduction(options), null, 2));
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(error => { console.error(error.message); process.exitCode = 1; });
