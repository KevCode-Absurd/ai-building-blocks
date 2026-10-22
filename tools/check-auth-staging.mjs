// Four authentication UI cases on the deployment owner's confirmed snapshot.
// Real Clerk sessions, protected POSTs and provider calls are not exercised.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { stagingTarget } from './lib/cloudflare-staging-target.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const site = path.join(root, 'site');
if (!process.env.CF_STAGING_VERSION || !process.env.CF_RELEASE_DIST) throw Error('The deployment owner must confirm the version and immutable assets first.');
const origin = stagingTarget();
const token = JSON.parse(fs.readFileSync(path.join(site, '.wrangler/staging-secrets.json'), 'utf8')).PREVIEW_ACCESS_TOKEN;
if (typeof token !== 'string' || token.length < 32) throw Error('Private staging access is unavailable.');
const snapshot = path.resolve(process.env.CF_RELEASE_DIST);
const evidence = path.join(site, '.wrangler/auth-staging-evidence');
fs.mkdirSync(evidence, { recursive: true });
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const report = { checkedOn: new Date().toISOString(), version: process.env.CF_STAGING_VERSION, origin, snapshot, status: 'running', providerCalls: 0, productionTouched: false, realClerkSignIn: false, assets: [], scope: 'Four deployed UI cases: anonymous assembly, sign-in draft return, simulated session expiry/usage, and missing configuration. Clerk SDK and protected POSTs are mocked.' };
try {
  for (const [route, file] of [['/compose', 'compose.html'], ['/data/blocks.json', 'data/blocks.json']]) {
    const target = new URL(route, origin);
    if (target.origin !== origin) throw Error('Unexpected staging origin.');
    const response = await fetch(target, { headers: { 'x-preview-access': token }, redirect: 'manual', signal: AbortSignal.timeout(30000) });
    if (response.status !== 200) throw Error(`Staging ${route} returned ${response.status}.`);
    const expected = sha(fs.readFileSync(path.join(snapshot, file)));
    const actual = sha(Buffer.from(await response.arrayBuffer()));
    if (actual !== expected) throw Error(`Staging ${route} differs from the confirmed release snapshot.`);
    report.assets.push({ file, sha256: actual });
  }
  const resultFile = path.join(evidence, 'results.json');
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(site, 'node_modules/@playwright/test/cli.js'), 'test', '--config', 'playwright.staging.config.ts', 'e2e/composer-auth.spec.ts', '--workers', '1', '--output', '.wrangler/auth-staging-evidence/browser', '--reporter', 'list,json'], {
      cwd: site, stdio: 'inherit', windowsHide: true,
      env: { ...process.env, CF_PREVIEW_ACCESS_TOKEN: token, PLAYWRIGHT_JSON_OUTPUT_NAME: resultFile },
    });
    child.on('error', reject); child.on('exit', resolve);
  });
  const results = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
  report.stats = results.stats;
  report.status = code === 0 && results.stats.expected === 4 && results.stats.unexpected === 0 ? 'pass' : 'fail';
  if (report.status !== 'pass') process.exitCode = 1;
} catch (error) {
  report.status = 'fail'; report.failure = String(error.message).replaceAll(token, '[redacted]'); process.exitCode = 1;
} finally {
  fs.writeFileSync(path.join(root, 'reports/2026-10-22-auth-staging-check.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: report.status, version: report.version, stats: report.stats, providerCalls: 0, productionTouched: false, realClerkSignIn: false, ...(report.failure ? { failure: report.failure } : {}) }));
}
