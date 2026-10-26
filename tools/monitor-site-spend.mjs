// A scheduled, local monitor. Credentials stay in Wrangler's existing private store.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { POLICY, estimateSpend, decisionFor, pauseBindings, sameSettingsExceptEnable } from './lib/site-spend-policy.mjs';
import { fingerprint } from './check-ui-refinement-live.mjs';
const repo = path.resolve(import.meta.dirname, '..');
const account = '31c814d2c58a11163d3187f505f0b9c5', script = 'ai-building-blocks';
const baseRoot = path.join(repo, 'site/.wrangler/spend-monitor');
const root = process.env.SITE_SPEND_MONITOR_STATE_DIR ? path.resolve(process.env.SITE_SPEND_MONITOR_STATE_DIR) : baseRoot;
assert(root === baseRoot || root.startsWith(baseRoot + path.sep), 'Monitor state must stay in its private workspace directory');
const stateFile = path.join(root, 'state.json');
const enforce = process.argv.includes('--enforce');
await fs.mkdir(root, { recursive: true });
let previous = {}; try { previous = JSON.parse(await fs.readFile(stateFile)); } catch (e) { if (e.code !== 'ENOENT') throw e; }
const startedAt = new Date().toISOString();
let authorization, lock, credentialError;
try {
  if (process.env.CLOUDFLARE_API_TOKEN) authorization = process.env.CLOUDFLARE_API_TOKEN;
  else {
  const credentialFile = path.join(process.env.APPDATA, 'xdg.config/.wrangler/config/default.toml');
  let text = await fs.readFile(credentialFile, 'utf8');
  const expiration = text.match(/^expiration_time\s*=\s*"([^"\r\n]+)"/m)?.[1];
  if (!expiration || Date.parse(expiration) <= Date.now() + 300000) {
    // Official Wrangler performs the existing OAuth refresh. No token is logged,
    // copied into the repo, or uploaded into the website's runtime.
    try { await promisify(execFile)(process.execPath, [path.join(repo, 'site/node_modules/wrangler/bin/wrangler.js'), 'deployments', 'list', '--name', script, '--json'], { cwd: path.join(repo, 'site'), windowsHide: true, timeout: 60000, maxBuffer: 2 * 1024 * 1024, env: { ...process.env, CI: 'true', WRANGLER_SEND_METRICS: 'false', WRANGLER_LOG_PATH: path.join(root, 'auth-refresh.log') } }); }
    catch { throw Error('Cloudflare authorization refresh failed'); }
    text = await fs.readFile(credentialFile, 'utf8');
  }
  authorization = text.match(/^oauth_token\s*=\s*"([^"\r\n]+)"/m)?.[1]; assert(authorization, 'Wrangler authorization missing');
  }
} catch { credentialError = 'Cloudflare authorization unavailable'; }
async function api(route, init = {}) {
  assert(authorization, credentialError);
  const response = await fetch('https://api.cloudflare.com/client/v4' + route, { ...init, headers: { authorization: 'Bearer ' + authorization, ...init.headers }, signal: AbortSignal.timeout(30000) });
  assert(response.ok, 'Cloudflare HTTP ' + response.status);
  const data = await response.json(); assert(data.success === true, 'Cloudflare operation failed'); return data.result;
}
const worker = `/accounts/${account}/workers/scripts/${script}`;
const query = async (id, sql, params = []) => {
  const data = await api(`/accounts/${account}/d1/database/${id}/query`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ sql, params }) });
  assert(Array.isArray(data) && data.every(r => r.success), 'AI ledger query failed'); return data[0].results;
};
const version = async () => { const data = await api(worker + '/deployments'); const versions = (data.deployments ?? data)[0].versions; assert.equal(versions.length, 1); assert.equal(versions[0].percentage, 100); return versions[0].version_id; };
async function collect() {
  const start = startedAt.slice(0, 10) + 'T00:00:00Z', storageStart = new Date(Date.parse(startedAt) - 86400000).toISOString();
  const filter = `datetime_geq:"${start}",datetime_leq:"${startedAt}"`, storage = `datetime_geq:"${storageStart}",datetime_leq:"${startedAt}"`;
  const gql = `{viewer{accounts(filter:{accountTag:"${account}"}){workers:workersInvocationsAdaptive(limit:1,filter:{${filter}}){sum{requests cpuTimeUs}} d1:d1AnalyticsAdaptiveGroups(limit:1,filter:{${filter}}){sum{rowsRead rowsWritten}} d1Storage:d1StorageAdaptiveGroups(limit:1000,filter:{${storage}}){dimensions{databaseId} max{databaseSizeBytes}} r2:r2OperationsAdaptiveGroups(limit:1000,filter:{${filter}}){dimensions{actionType storageClass} sum{requests responseObjectSize}} r2Storage:r2StorageAdaptiveGroups(limit:1000,filter:{${storage}}){dimensions{bucketName storageClass} max{payloadSize metadataSize}}}}}`;
  const results = await Promise.allSettled([
    (async () => { assert(authorization, credentialError); const r = await fetch('https://api.cloudflare.com/client/v4/graphql', { method: 'POST', headers: { authorization: 'Bearer ' + authorization, 'content-type': 'application/json' }, body: JSON.stringify({ query: gql }), signal: AbortSignal.timeout(30000) }); assert(r.ok, 'Analytics HTTP ' + r.status); const d = await r.json(); assert(!d.errors?.length && d.data?.viewer?.accounts?.length === 1, 'Analytics incomplete or unavailable'); return d.data.viewer.accounts[0]; })(),
    (async () => { const configs = await Promise.all(['ai-building-blocks', 'ai-building-blocks-staging'].map(name => api(`/accounts/${account}/workers/scripts/${name}/settings`))); const ids = [...new Set(configs.map(s => { const b = s.bindings.find(b => b.name === 'COMPOSER'); assert(b?.id, 'AI ledger binding missing'); return b.id; }))]; const totals = await Promise.all(ids.map(id => query(id, 'SELECT COALESCE(SUM(charge),0) AS usd FROM composer_jobs WHERE day = ?', [startedAt.slice(0, 10)]))); return totals.reduce((n, rows) => { assert.equal(rows.length, 1); assert(typeof rows[0].usd === 'number' && rows[0].usd >= 0, 'Invalid AI ledger total'); return n + rows[0].usd; }, 0); })(),
  ]);
  for (const result of results) if (result.status === 'rejected') throw result.reason;
  return { metrics: results[0].value, aiUSD: results[1].value };
}
async function pausePaidFeatures() {
  const before = await api(worker + '/settings'), previousVersionId = await version();
  if (before.bindings.find(b => b.name === 'WORKFLOW_COMPOSER_ENABLED')?.text === 'false') return { alreadyPaused: true, versionId: previousVersionId };
  const bindings = pauseBindings(before);
  assert.equal(fingerprint(await api(worker + '/settings')), fingerprint(before), 'Concurrent Worker settings change; retry next check');
  const form = new FormData(); form.set('settings', new Blob([JSON.stringify({ bindings })], { type: 'application/json' }));
  await api(worker + '/settings?bindings_inherit=strict', { method: 'PATCH', body: form });
  const after = await api(worker + '/settings'), versionId = await version();
  assert.equal(after.bindings.find(b => b.name === 'WORKFLOW_COMPOSER_ENABLED')?.text, 'false');
  assert.deepEqual(sameSettingsExceptEnable(after), sameSettingsExceptEnable(before), 'Unexpected Worker settings change');
  for (const endpoint of ['/api/compose', '/api/transcribe']) { const r = await fetch('https://useaiblocks.com' + endpoint, { signal: AbortSignal.timeout(30000) }); assert.equal(r.status, 200); assert.equal((await r.json()).enabled, false, 'Pause read-back failed'); }
  const liveFile = path.join(repo, 'reports/cloudflare-live-release.json');
  try { const live = JSON.parse(await fs.readFile(liveFile)); if (live.production.versionId === previousVersionId) { Object.assign(live.production, { versionId, aiEnabled: false, AIEnabled: false, paidFeaturesPaused: true, pauseSource: 'daily-spend-monitor', pauseRecordedAt: new Date().toISOString(), settingsFingerprint: fingerprint((({ annotations, ...rest }) => rest)(after)) }); await fs.writeFile(liveFile, JSON.stringify(live, null, 2)); } } catch { /* Dedicated monitor report remains authoritative; never undo a pause for local report errors. */ }
  return { previousVersionId, versionId, aiGenerationPaused: true, voicePaused: true, otherBindingsPreserved: true };
}
async function persist(state) {
  const temporary = stateFile + '.tmp'; await fs.writeFile(temporary, JSON.stringify(state, null, 2)); await fs.rename(temporary, stateFile);
  await fs.appendFile(path.join(root, 'events.jsonl'), JSON.stringify(state) + '\n');
}
let output;
try {
  if (enforce) { try { lock = await fs.open(path.join(root, 'running.lock'), 'wx'); } catch (e) { if (e.code === 'EEXIST') { const stats = await fs.stat(path.join(root, 'running.lock')); if (Date.now() - stats.mtimeMs < 180000) { console.log(JSON.stringify({ status: 'already-running', notify: false })); process.exit(0); } await fs.unlink(path.join(root, 'running.lock')); lock = await fs.open(path.join(root, 'running.lock'), 'wx'); } else throw e; } }
  const { metrics, aiUSD } = await collect();
  const estimate = estimateSpend(metrics, aiUSD, previous, Date.parse(startedAt));
  const decision = decisionFor(estimate, previous);
  output = { ...estimate, ...decision, warnUSD: POLICY.warnUSD, pauseUSD: POLICY.pauseUSD, targetUSD: POLICY.targetUSD, mode: enforce ? 'enforce' : 'read-only', scope: 'Site production/staging AI ledger plus account-wide Cloudflare Workers, D1 and R2 estimates', pauseLatched: previous.pauseLatched || decision.status === 'paused', pauseReason: decision.status === 'paused' ? decision.reason : previous.pauseReason, warningDay: decision.status === 'warning' ? estimate.day : previous.warningDay };
  if (enforce && output.pauseLatched) { output.pause = await pausePaidFeatures(); output.notify ||= !previous.pauseConfirmed; output.pauseConfirmed = true; }
  if (enforce) await persist(output);
} catch (error) {
  const message = String(error.message).slice(0, 240);
  output = { ...previous, checkedAt: startedAt, status: 'error', error: message, notify: previous.status !== 'error' || previous.error !== message, mode: enforce ? 'enforce' : 'read-only', pauseLatched: enforce || !!previous.pauseLatched, pauseReason: previous.pauseReason ?? 'monitoring_unavailable' };
  if (enforce) { try { output.pause = await pausePaidFeatures(); output.pauseConfirmed = true; } catch (pauseError) { output.pauseConfirmed = false; output.pauseError = String(pauseError.message).slice(0, 240); output.notify ||= previous.pauseConfirmed !== false; } await persist(output); }
} finally { if (lock) { await lock.close(); await fs.unlink(path.join(root, 'running.lock')); } }
console.log(JSON.stringify(output, null, 2));
if (output.status === 'error') process.exitCode = 1;
