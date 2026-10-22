// Verify the actual hydrated head across SPA transitions and interrupted fetches.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(path.resolve('site/package.json'));
const { chromium } = require('@playwright/test');
const origin = process.argv[2] || 'http://127.0.0.1:5182';
assert(['http://127.0.0.1:5182', 'https://useaiblocks.com'].includes(origin));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = []; let documents = 0;
const ctx = await browser.newContext({ serviceWorkers: 'block', reducedMotion: 'reduce' });
await ctx.route('**/*', route => {
  const req = route.request(), u = new URL(req.url());
  if (!['GET', 'HEAD'].includes(req.method()) || u.origin !== origin) return route.abort();
  if (u.pathname.startsWith('/api/')) return route.fulfill({ json: u.pathname === '/api/comments' ? { comments: [] } : { configured: false, enabled: false, required: false } });
  return route.continue();
});
const page = await ctx.newPage();
page.on('request', r => { if (r.isNavigationRequest() && r.frame() === page.mainFrame()) documents++; });
async function check(name, fn) { try { await fn(); results.push({ name, status: 'pass' }); } catch (e) { results.push({ name, status: 'fail', error: e.message }); } console.log(JSON.stringify(results.at(-1))); }
async function head(route) {
  await page.waitForFunction(p => document.documentElement.dataset.metadataPath === p, route);
  const got = await page.evaluate(() => {
    const get = s => document.querySelector(s)?.getAttribute('content');
    return { title: document.title, description: get('meta[name=description]'), canonical: document.querySelector('link[rel=canonical]')?.href, robots: get('meta[name=robots]'), ogTitle: get('meta[property="og:title"]'), ogDescription: get('meta[property="og:description"]'), ogUrl: get('meta[property="og:url"]'), twitterTitle: get('meta[name="twitter:title"]'), graphs: [...document.querySelectorAll('script[type="application/ld+json"]')].map(e => JSON.parse(e.textContent)), robotsCount: document.querySelectorAll('meta[name=robots]').length };
  });
  assert.equal(got.canonical, 'https://useaiblocks.com' + route);
  assert.equal(got.ogTitle, got.title); assert.equal(got.twitterTitle, got.title);
  assert.equal(got.ogDescription, got.description); assert.equal(got.ogUrl, got.canonical);
  assert.equal(got.robotsCount, 1);
  const privatePage = route === '/space' || route.startsWith('/s/') || route === '/missing-seo-contract';
  assert.equal(got.robots.includes('noindex'), privatePage);
  if (privatePage) assert.equal(got.graphs.length, 0);
  else {
    const response = await ctx.request.get(origin + '/metadata/' + (route === '/' ? 'index' : route.slice(1)) + '.json');
    const expected = await response.json();
    assert.equal(got.title, expected.title); assert.equal(got.description, expected.description);
    assert.deepEqual(got.graphs, expected.graph ? [expected.graph] : []);
  }
}
async function navigate(route) {
  await page.evaluate(route => { history.pushState(null, '', route); dispatchEvent(new PopStateEvent('popstate')); }, route);
  await head(route);
}
try {
  await page.goto(origin); await head('/');
  const initialDocuments = documents;
  for (const route of ['/support', '/tools', '/tools/growth-channel-planner', '/minds', '/minds/charlie-munger', '/skills/website-brand-brain-builder', '/compose', '/space', '/s/unissued-seo-check', '/privacy', '/missing-seo-contract', '/']) await check('SPA head ' + route, () => navigate(route));
  await check('SPA transitions preserve the document', async () => assert.equal(documents, initialDocuments));
  await check('Late component title and description cannot restore a stale head', async () => {
    await navigate('/tools');
    await page.evaluate(() => { document.title = 'Stale component title'; document.querySelector('meta[name=description]').content = 'Stale description'; });
    await page.waitForFunction(() => document.title !== 'Stale component title'); await head('/tools');
  });
  await check('Interrupted private-page metadata fetch cannot replace the new public head', async () => {
    await page.route('**/metadata/shared-space-shell.json', async route => { await new Promise(r => setTimeout(r, 250)); await route.continue().catch(() => {}); });
    const pending = page.waitForRequest('**/metadata/shared-space-shell.json');
    await page.evaluate(() => { history.pushState(null, '', '/s/delayed-seo-check'); dispatchEvent(new PopStateEvent('popstate')); });
    await pending;
    await page.evaluate(() => { history.pushState(null, '', '/about'); dispatchEvent(new PopStateEvent('popstate')); });
    await head('/about'); await page.waitForTimeout(400); await head('/about');
  });
  await check('Direct private-page HTML remains noindex after hydration', async () => { await page.goto(origin + '/space'); await head('/space'); });
} finally {
  await browser.close();
  const report = { checkedOn: new Date().toISOString(), origin, status: results.every(r => r.status === 'pass') ? 'pass' : 'fail', passed: results.filter(r => r.status === 'pass').length, failed: results.filter(r => r.status === 'fail').length, results };
  await fs.writeFile('reports/seo-browser-contract.json', JSON.stringify(report, null, 2) + '\n');
  if (report.failed) process.exitCode = 1;
}
