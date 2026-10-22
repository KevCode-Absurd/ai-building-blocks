// Actual native browser form, not a fetch with a fabricated Origin header.
// No CAPTCHA interaction, provider calls, screenshots, traces or fixture writes.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { stagingTarget } from './lib/cloudflare-staging-target.mjs';
const require = createRequire(new URL('../site/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const base = stagingTarget();
const release = JSON.parse(fs.readFileSync('reports/cloudflare-live-release.json', 'utf8'));
assert.equal(process.env.CF_STAGING_VERSION, release.staging.versionId);
const secret = JSON.parse(fs.readFileSync('site/.wrangler/staging-secrets.json', 'utf8')).PREVIEW_ACCESS_TOKEN;
assert(typeof secret === 'string' && secret.length >= 32);
const checks = [];
let browser, sessionValue = '', failure, actualOrigin;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  const response = await page.goto(base + '/__preview/login', { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200);
  assert.equal(response.headers()['referrer-policy'], 'same-origin');
  checks.push('live login document preserves same-origin form metadata');
  await page.getByLabel('Staging access credential').fill(secret);
  const posted = page.waitForResponse(response => response.url() === base + '/__preview/login' && response.request().method() === 'POST');
  await page.getByRole('button', { name: 'Open staging', exact: true }).click();
  const loginResponse = await posted;
  actualOrigin = (await loginResponse.request().allHeaders()).origin;
  assert.equal(loginResponse.status(), 303, 'Real native form login must succeed.');
  assert.equal(actualOrigin, base, 'The browser must generate the exact Origin; never allow null.');
  checks.push('unmodified native form supplies exact Origin and receives303');
  await page.waitForURL(base + '/space');
  await page.getByTestId('space-name').waitFor({ state: 'visible' });
  const cookie = (await context.cookies(base)).find(cookie => cookie.name === '__Host-ai_preview');
  assert(cookie, 'Browser must receive its private session cookie.');
  sessionValue = cookie.value;
  assert(cookie.httpOnly && cookie.secure && cookie.sameSite === 'Strict', 'Private cookie flags must remain intact.');
  checks.push('cookie-only browser opens the actual space UI');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.getByTestId('space-name').waitFor({ state: 'visible' });
  checks.push('browser session persists on reload without a preview header');
  const denied = await context.request.post(base + '/api/spaces', { headers: { origin: base }, data: { name: 'Rejected browser login probe' } });
  assert.equal(denied.status(), 403);
  assert(/security check/i.test((await denied.json()).error));
  checks.push('native login session still cannot create a space without Turnstile');
} catch (error) {
  failure = String(error.message).replaceAll(secret, '[redacted]');
  if (sessionValue) failure = failure.replaceAll(sessionValue, '[redacted]');
} finally { await browser?.close().catch(() => {}); }
const report = { checkedOn: new Date().toISOString(), origin: base, deployedVersion: release.staging.versionId, status: failure ? 'fail' : 'pass', actualBrowserForm: true, previewHeaderInjected: false, loginOriginOverridden: false, browserGeneratedOrigin: actualOrigin ?? null, passed: checks.length, checks, protectedWritesCreated: 0, providerCalls: 0, credentialsPrintedOrPersisted: false, ...(failure ? { failure } : {}) };
fs.writeFileSync('reports/cloudflare-staging-browser-login.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (failure) process.exitCode = 1;
