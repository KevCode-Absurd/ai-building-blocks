// Run only after the release owner confirms the deployed staging version and snapshot.
// Credentials stay in process memory and go only to the verified staging origin.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { stagingTarget } from './lib/cloudflare-staging-target.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const site = path.join(root, 'site');
if (!process.env.CF_STAGING_VERSION || !process.env.CF_RELEASE_DIST) throw Error('The release owner must provide the confirmed version and immutable asset directory.');
const base = stagingTarget();
const secrets = JSON.parse(fs.readFileSync(path.join(site, '.wrangler/staging-secrets.json'), 'utf8'));
const token = secrets.PREVIEW_ACCESS_TOKEN;
if (typeof token !== 'string' || token.length < 32) throw Error('Staging preview access is not configured.');
const artifact = path.resolve(process.env.CF_RELEASE_DIST);
const failedOnly = process.env.CF_COMPOSER_FAILED_ONLY === 'true';
const workers = process.env.CF_COMPOSER_WORKERS || '2';
if (!['1', '2'].includes(workers)) throw Error('Use one or two staging browser workers.');
const reportPath = path.join(root, failedOnly ? 'reports/2026-10-22-composer-staging-repairs-check.json' : 'reports/2026-10-22-composer-staging-check.json');
const evidence = path.join(site, '.wrangler/composer-staging-evidence');
fs.mkdirSync(evidence, { recursive: true });
const sha = data => crypto.createHash('sha256').update(data).digest('hex');
const report = { checkedOn: new Date().toISOString(), staging: base, version: process.env.CF_STAGING_VERSION, status: 'running', providerCalls: 0, productionTouched: false, snapshot: artifact, assets: [], scope: 'Deployed free planner, replacement, recorded paid-error fixtures, complete packs and voice simulations. No real microphone or paid inference.' };
try {
  for (const asset of ['data/blocks.json', 'compose.html', ...['request-acceptance-brief', 'request-deliverable-drafter', 'request-acceptance-checker'].map(slug => `skills/${slug}/SKILL.md`)]) {
    const url = new URL(asset === 'compose.html' ? '/compose' : '/' + asset, base);
    if (url.origin !== base) throw Error('Staging origin mismatch.');
    const response = await fetch(url, { headers: { 'x-preview-access': token }, redirect: 'manual', signal: AbortSignal.timeout(30000) });
    if (response.status !== 200) throw Error(`Staging asset ${asset} returned ${response.status}.`);
    const actual = sha(Buffer.from(await response.arrayBuffer()));
    const expected = sha(fs.readFileSync(path.join(artifact, asset)));
    if (actual !== expected) throw Error(`Deployed ${asset} differs from the confirmed release snapshot.`);
    report.assets.push({ asset, sha256: actual });
  }
  const resultFile = path.join(evidence, 'results.json');
  const cli = path.join(site, 'node_modules/@playwright/test/cli.js');
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [cli, 'test', '--config', 'playwright.staging.config.ts', 'e2e/composer.spec.ts', 'e2e/composer-fresh.spec.ts', 'e2e/skill-replacement.spec.ts', '--workers', workers, '--output', 'test-results-staging/composer', '--reporter', 'list,json', ...(failedOnly ? ['--last-failed'] : [])], {
      cwd: site, stdio: 'inherit', env: { ...process.env, CF_PREVIEW_ACCESS_TOKEN: token, PLAYWRIGHT_JSON_OUTPUT_NAME: resultFile }, windowsHide: true,
    });
    child.on('error', reject); child.on('exit', resolve);
  });
  const results = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
  report.stats = results.stats;
  report.status = code === 0 && results.stats.unexpected === 0 ? 'pass' : 'fail';
  if (report.status !== 'pass') process.exitCode = 1;
} catch (error) {
  report.status = 'fail'; report.failure = String(error.message).replaceAll(token, '[redacted]'); process.exitCode = 1;
} finally {
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: report.status, version: report.version, stats: report.stats, providerCalls: 0, productionTouched: false, ...(report.failure ? { failure: report.failure } : {}) }));
}
