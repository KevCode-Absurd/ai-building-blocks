// Synthetic consented canary using real vendor scripts. The page is a local
// fixture at the production origin; only approved measurement reaches vendors.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(path.resolve('site/package.json'));
const { chromium } = require('@playwright/test');
const code = await fs.readFile('site/public/analytics.js', 'utf8');
const production = process.argv.includes('--production');
const output = 'reports/analytics-browser';
const html = '<!doctype html><html><head><title>AI Blocks tracking canary</title><script defer src="/analytics.js"></script></head><body><h1>AI Blocks tracking canary</h1><input aria-label="Synthetic search"><a href="/compose" id="private">Create workflow</a><script>document.querySelector("input").addEventListener("input",e=>history.replaceState(null,"","/?q="+encodeURIComponent(e.target.value)));document.querySelector("a").addEventListener("click",e=>{e.preventDefault();history.pushState(null,"","/compose")});</script></body></html>';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const providerRequests = [], providerResponses = [];
let navigationCount = 0;
try {
  if (!production) await context.route('https://useaiblocks.com/**', route => route.fulfill({ contentType: route.request().url().endsWith('/analytics.js') ? 'text/javascript' : 'text/html', body: route.request().url().endsWith('/analytics.js') ? code : html }));
  else await context.route('https://useaiblocks.com/api/**', route => route.request().method() === 'GET' ? route.continue() : route.abort());
  const page = await context.newPage();
  page.on('request', request => {
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) navigationCount++;
    const url = new URL(request.url());
    if (/google-analytics\.com$|clarity\.ms$|googletagmanager\.com$/.test(url.hostname)) providerRequests.push({ host: url.hostname, path: url.pathname, raw: request.url() + '\n' + (request.postData() || '') });
  });
  page.on('response', response => {
    const url = new URL(response.url());
    if (/google-analytics\.com$|clarity\.ms$|googletagmanager\.com$/.test(url.hostname)) providerResponses.push({ host: url.hostname, path: url.pathname, status: response.status() });
  });
  await page.goto('https://useaiblocks.com/');
  await page.getByRole('button', { name: 'Accept cookies', exact: true }).waitFor();
  assert.equal(providerRequests.length, 0, 'no vendors before opt-in');
  const gaReceived = page.waitForResponse(r => /google-analytics\.com\/g\/collect/.test(r.url()) && r.status() === 204, { timeout: 45000 });
  const clarityReceived = page.waitForResponse(r => /clarity\.ms\/collect/.test(r.url()) && r.status() >= 200 && r.status() < 300, { timeout: 45000 });
  await page.getByRole('button', { name: 'Accept cookies', exact: true }).click();
  await Promise.all([gaReceived, clarityReceived]);
  await page.waitForFunction(() => !!window.clarity?.v);
  const before = navigationCount;
  const input = production ? page.getByTestId('library-search') : page.getByRole('textbox', { name: 'Synthetic search', exact: true });
  await input.scrollIntoViewIfNeeded(); await input.pressSequentially('synthetic-private-canary');
  assert.equal(await input.inputValue(), 'synthetic-private-canary');
  assert.equal(navigationCount, before, 'search kept its document');
  assert(await input.evaluate(el => document.activeElement === el), 'search focus preserved');
  assert(await page.evaluate(() => !window.clarity.v && Array.isArray(window.clarity.q)), 'real Clarity recorder stopped');
  if (production) await page.locator('a[href="/compose"]').first().click();
  else await page.getByRole('link', { name: 'Create workflow', exact: true }).click();
  assert.equal(new URL(page.url()).pathname, '/compose');
  assert.equal(navigationCount, before, 'private SPA transition does not reload');
  assert(!providerRequests.some(request => request.raw.includes('synthetic-private-canary')), 'no raw synthetic input in vendor requests');
  const ga = providerRequests.find(r => /google-analytics\.com$/.test(r.host) && r.path === '/g/collect');
  assert(ga); const params = new URL(ga.raw.split('\n')[0]).searchParams;
  assert.equal(params.get('tid'), 'G-FLLHB8ZGN7'); assert.equal(params.get('dl'), 'https://useaiblocks.com/'); assert.equal(params.get('en'), 'page_view'); assert(!params.get('dr'));
  const report = { checkedOn: new Date().toISOString(), status: 'pass', kind: production ? 'actual production public-site vendor canary' : 'synthetic pre-deployment real-vendor canary', productionAssetsChanged: false, noVendorRequestsBeforeConsent: true, googleMeasurementId: params.get('tid'), googlePageLocation: params.get('dl'), googleEvent: params.get('en'), noIncomingReferrer: true, providerResponses, actualClarityStopVerified: true, typingFocusAndValuePreserved: true, privateTransitionWithoutReload: true, noRawSyntheticInputInRequests: true };
  await fs.writeFile(path.join(output, production ? 'production-checks.json' : 'real-vendor-checks.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
