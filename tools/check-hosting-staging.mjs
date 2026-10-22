// Live customer-flow checks against one confirmed immutable staging release.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { stagingTarget } from './lib/cloudflare-staging-target.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const site = path.join(root, 'site');
if (!process.env.CF_STAGING_VERSION || !process.env.CF_RELEASE_DIST) throw Error('Provide the confirmed deployed version and immutable asset directory.');
const base = stagingTarget();
const token = JSON.parse(fs.readFileSync(path.join(site, '.wrangler/staging-secrets.json'), 'utf8')).PREVIEW_ACCESS_TOKEN;
if (typeof token !== 'string' || token.length < 32) throw Error('Private staging access is not configured.');
const evidence = path.join(site, '.wrangler/hosting-staging-evidence');
const failedOnly = process.env.CF_STAGING_FAILED_ONLY === 'true';
const label = process.env.CF_STAGING_RUN_LABEL || (failedOnly ? 'repairs' : 'results');
if (!/^[a-z0-9-]{1,50}$/.test(label)) throw Error('Invalid evidence label.');
const workers = process.env.CF_STAGING_WORKERS || '2';
if (!['1', '2'].includes(workers)) throw Error('Use one or two staging browser workers.');
fs.mkdirSync(evidence, { recursive: true });
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const report = { checkedOn: new Date().toISOString(), environment: base, deployedVersion: process.env.CF_STAGING_VERSION, status: 'running', productionTouched: false, providerCalls: 0, scope: 'Live hosting/customer flows. Seven security UI cases use mocked verification; real-widget persistence is reported separately.', snapshot: path.resolve(process.env.CF_RELEASE_DIST), assets: [], timings: [] };
report.browserWorkers = Number(workers);
const reportPath = path.join(root, failedOnly ? 'reports/cloudflare-staging-browser-repairs.json' : 'reports/cloudflare-staging-browser-check.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
try {
  for (const [urlPath, relative] of [['/', 'index.html'], ['/data/blocks.json', 'data/blocks.json']]) {
    const target = new URL(urlPath, base);
    if (target.origin !== base) throw Error('Unexpected staging origin.');
    const response = await fetch(target, { headers: { 'x-preview-access': token }, redirect: 'manual', signal: AbortSignal.timeout(30_000) });
    if (response.status !== 200) throw Error('Staging artifact returned HTTP ' + response.status);
    const hash = sha(Buffer.from(await response.arrayBuffer()));
    if (hash !== sha(fs.readFileSync(path.join(report.snapshot, relative)))) throw Error('Staging artifact differs from the immutable release: ' + relative);
    report.assets.push({ asset: relative, sha256: hash });
  }
  const login = await fetch(base + '/__preview/login', { method: 'POST', redirect: 'manual', headers: { origin: base, 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ preview_token: token }), signal: AbortSignal.timeout(30_000) });
  if (login.status !== 303) throw Error('Staging browser login returned HTTP ' + login.status);
  const session = login.headers.get('set-cookie')?.split(';')[0];
  if (!session?.startsWith('__Host-ai_preview=')) throw Error('Staging browser session is missing.');
  const resultPath = path.join(evidence, label + '.json');
  const filenames = ['site', 'audience-starters', 'staging-smoke', 'api-security', 'turnstile-cleanup', 'apps', 'tools', 'ai-tools', 'traction', 'work-expansion', 'usability-refinement', 'imported'].map(name => `e2e/${name}.spec.ts`);
  const childEnv = { ...process.env, CF_PREVIEW_ACCESS_TOKEN: token, CF_PREVIEW_SESSION_COOKIE: session, PLAYWRIGHT_JSON_OUTPUT_NAME: resultPath };
  delete childEnv.CF_STAGING_COMMENTS_TEAM_TOKEN;
  const filterArgs = failedOnly ? ['--grep', JSON.parse(fs.readFileSync(path.join(root, 'reports/cloudflare-staging-browser-initial-r4.json'), 'utf8')).failures.map(f => f.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')] : ['--grep-invert', 'every skill has questions and comments'];
  report.scope += failedOnly ? ' Targeted rerun of all twelve initial failures.' : '';
  const code = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(site, 'node_modules/@playwright/test/cli.js'), 'test', '--config', 'playwright.staging.config.ts', ...filenames, ...filterArgs, '--workers', workers, '--output', path.join(evidence, label + '-artifacts'), '--reporter', 'list,json'], { cwd: site, env: childEnv, stdio: 'inherit', windowsHide: true });
    child.on('error', reject); child.on('exit', resolve);
  });
  const result = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
  report.stats = result.stats;
  report.failures = [];
  function collect(suite) {
    for (const spec of suite.specs || []) for (const test of spec.tests || []) {
      for (const run of test.results || []) {
        if (run.status !== 'passed' && run.status !== 'skipped') report.failures.push({ title: spec.title, status: run.status, errors: (run.errors || []).map(error => String(error.message || '').replaceAll(token, '[redacted]')) });
        for (const attachment of run.attachments || []) if (attachment.name === 'observed-navigation-timings' && attachment.body) report.timings.push(JSON.parse(Buffer.from(attachment.body, 'base64').toString('utf8')));
      }
    }
    for (const nested of suite.suites || []) collect(nested);
  }
  for (const suite of result.suites || []) collect(suite);
  report.status = code === 0 && result.stats.unexpected === 0 && !result.errors?.length ? 'pass' : 'fail';
  if (report.status !== 'pass') process.exitCode = 1;
} catch (error) {
  report.status = 'fail'; report.failure = String(error.message).replaceAll(token, '[redacted]'); process.exitCode = 1;
} finally {
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: report.status, version: report.deployedVersion, stats: report.stats, productionTouched: false, providerCalls: 0, ...(report.failure ? { failure: report.failure } : {}) }));
}
