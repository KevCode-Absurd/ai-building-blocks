// Built-page first-paint QA. Read-only pages; every non-GET request is blocked.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(path.resolve('site/package.json'));
const { chromium } = require('@playwright/test');
const assets = path.resolve(process.argv[2]);
const output = path.resolve(process.argv[3] || 'reports/startup-loading');
await fs.mkdir(output, { recursive: true });
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://local');
    if (url.pathname.startsWith('/api/')) {
      res.writeHead(url.pathname === '/api/security' ? 200 : 503, { 'content-type': 'application/json' });
      return res.end(url.pathname === '/api/security' ? '{"required":false}' : '{"error":"Unavailable in read-only startup QA"}');
    }
    const name = decodeURIComponent(url.pathname).slice(1);
    assert(!name.includes('..'));
    const candidates = name ? [name, name + '.html', path.join(name, 'index.html')] : ['index.html'];
    if (/^(space|people)$/.test(name)) candidates.push('index.html');
    if (name.startsWith('s/')) candidates.push('shared-space-shell.html');
    let file;
    for (const relative of candidates) {
      const p = path.join(assets, relative);
      if ((await fs.stat(p).catch(() => null))?.isFile()) { file = p; break; }
    }
    const status = file ? 200 : 404;
    file ||= path.join(assets, '404.html');
    res.writeHead(status, { 'content-type': types[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
    res.end(await fs.readFile(file));
  } catch { res.writeHead(500); res.end('Startup QA server error'); }
});
const liveURL = process.argv[4];
if (!liveURL) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = liveURL ? new URL(liveURL).origin : `http://127.0.0.1:${server.address().port}`;
if (liveURL) assert(['https://useaiblocks.com', 'https://ai-building-blocks-staging.kevinmark7498.workers.dev'].includes(origin));
const previewToken = origin === 'https://ai-building-blocks-staging.kevinmark7498.workers.dev'
  ? JSON.parse(await fs.readFile('site/.wrangler/staging-secrets.json', 'utf8')).PREVIEW_ACCESS_TOKEN : undefined;
function continueReadOnly(route) {
  assert(['GET', 'HEAD'].includes(route.request().method()));
  const headers = route.request().headers();
  if (previewToken && new URL(route.request().url()).origin === origin) headers['x-preview-access'] = previewToken;
  return route.continue({ headers });
}
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
let blockedWrites = 0;
async function context(options = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, serviceWorkers: 'block', ...options });
  await ctx.route('**/*', route => {
    if (!['GET', 'HEAD'].includes(route.request().method())) { blockedWrites++; return route.abort(); }
    if (new URL(route.request().url()).origin !== origin) return route.abort();
    return continueReadOnly(route);
  });
  await ctx.addInitScript(() => {
    document.addEventListener('abb:ready', () => {
      window.__firstReady = { path: location.pathname, heading: document.querySelector('#root h1')?.textContent };
    }, { once: true });
  });
  return ctx;
}
async function check(name, fn) {
  const start = Date.now();
  try { await fn(); results.push({ name, status: 'PASS', ms: Date.now() - start }); }
  catch (e) { results.push({ name, status: 'FAIL', ms: Date.now() - start, error: e.message }); }
  console.log(`${results.at(-1).status}: ${name}`);
}
async function ready(page) {
  await page.waitForFunction(() => document.documentElement.dataset.boot === 'ready', null, { timeout: 20000 });
  await page.waitForFunction(() => !document.getElementById('app-loader'));
  assert.equal(await page.locator('#root').evaluate(el => getComputedStyle(el).visibility), 'visible');
  assert.equal(await page.locator('[data-prerendered]').count(), 0);
}
async function held(page, pattern) {
  let release, startedResolve, requested = false;
  const started = new Promise(resolve => { startedResolve = resolve; });
  const wait = new Promise(resolve => { release = resolve; });
  await page.route(pattern, async route => { requested = true; startedResolve(); await wait; await continueReadOnly(route).catch(() => {}); });
  return { release, started, requested: () => requested };
}
async function loader(page) {
  await page.waitForFunction(() => document.documentElement.dataset.boot === 'loading');
  assert.equal(await page.locator('#root').evaluate(el => getComputedStyle(el).visibility), 'hidden');
  assert(await page.locator('#app-loader').isVisible());
}
try {
  await check('Delayed entry JS: animated screen hides actual prerender, then reveals home', async () => {
    const ctx = await context(); const page = await ctx.newPage();
    const gate = await held(page, '**/assets/*.js');
    try {
      await page.goto(origin, { waitUntil: 'commit' }); await loader(page);
      assert((await page.locator('[data-prerendered]').textContent()).length > 100);
      const tile = page.locator('.boot-mark i').first();
      assert.equal(await tile.evaluate(el => getComputedStyle(el).animationName), 'boot-assemble');
      const first = await tile.evaluate(el => getComputedStyle(el).transform);
      await page.waitForFunction(first => {
        const tile = document.querySelector('.boot-mark i');
        return tile && getComputedStyle(tile).transform !== first;
      }, first, { timeout: 3000 });
      await page.screenshot({ path: path.join(output, 'desktop-loading.png') });
      gate.release(); await ready(page);
        assert.match(await page.locator('h1').first().textContent(), /Use AI like the top 1%/);
      await page.screenshot({ path: path.join(output, 'desktop-ready.png') });
    } finally { gate.release(); await ctx.close(); }
  });
  await check('Delayed Space route chunk cannot reveal the home HTML or route fallback', async () => {
    const ctx = await context(); const page = await ctx.newPage();
    const gate = await held(page, '**/assets/SpacePage-*.js');
    try {
      await page.goto(origin + '/space', { waitUntil: 'commit' });
      await page.waitForFunction(() => document.getElementById('root')?.querySelector('header'));
      await gate.started; assert(gate.requested()); await page.waitForTimeout(400); await loader(page);
      gate.release(); await ready(page);
      assert.match(await page.locator('h1').first().textContent(), /Keep your skills and workflows/i);
      assert(await page.getByRole('button', { name: /Make my space/i }).isVisible());
    } finally { gate.release(); await ctx.close(); }
  });
  await check('Phone, saved light theme and reduced motion: static mark, then correct page', async () => {
    const ctx = await context({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
    await ctx.addInitScript(() => localStorage.setItem('abb:theme', 'light'));
    const page = await ctx.newPage(); const gate = await held(page, '**/assets/*.js');
    try {
      await page.goto(origin + '/space', { waitUntil: 'commit' }); await loader(page);
      assert.equal(await page.locator('#app-loader').evaluate(el => getComputedStyle(el).backgroundColor), 'rgb(250, 250, 250)');
      assert.equal(await page.locator('.boot-mark i').first().evaluate(el => getComputedStyle(el).animationName), 'none');
      await page.screenshot({ path: path.join(output, 'mobile-light-loading.png') });
      gate.release(); await ready(page);
      assert.match(await page.locator('h1').first().textContent(), /Keep your skills and workflows/i);
      assert(await page.getByRole('button', { name: /Make my space/i }).isVisible());
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await page.screenshot({ path: path.join(output, 'mobile-light-ready.png') });
    } finally { gate.release(); await ctx.close(); }
  });
  await check('Delayed catalogue: compose stays covered until its real route is ready', async () => {
    const ctx = await context(); const page = await ctx.newPage(); const gate = await held(page, '**/data/blocks.json');
    try {
      await page.goto(origin + '/compose', { waitUntil: 'commit' });
      await page.waitForFunction(() => document.getElementById('root')?.querySelector('header'));
      await gate.started; assert(gate.requested()); await loader(page);
      gate.release(); await ready(page);
      assert.match(await page.locator('h1').first().textContent(), /workflow|request/i);
    } finally { gate.release(); await ctx.close(); }
  });
  await check('Optional catalogue cannot delay the usable home hero or Space form', async () => {
    for (const route of ['/', '/space']) {
      const ctx = await context(); const page = await ctx.newPage(); const gate = await held(page, '**/data/blocks.json');
      try {
        await page.goto(origin + route, { waitUntil: 'commit' }); await ready(page);
        if (route === '/') assert.match(await page.locator('h1').first().textContent(), /Use AI like the top 1%/);
        else assert(await page.getByRole('button', { name: /Make my space/i }).isVisible());
      } finally { gate.release(); await ctx.close(); }
    }
  });
  await check('Every lazy page section opens from a cold link with the correct route', async () => {
    const ctx = await context(); const page = await ctx.newPage();
    try {
      for (const route of ['/tools', '/ai-tools', '/apps', '/tools/growth-channel-planner', '/minds', '/from-a-source', '/how-it-works', '/s/startup-qa-missing-share']) {
        await page.goto(origin + route); await ready(page);
        await page.locator('#root h1').first().waitFor();
        assert((await page.locator('#root h1').first().textContent()).trim().length > 0);
        assert.equal(new URL(page.url()).pathname, route);
      }
    } finally { await ctx.close(); }
  });
  await check('No JavaScript: home and skill still expose readable HTML, headings and links', async () => {
    const ctx = await context({ javaScriptEnabled: false }); const page = await ctx.newPage();
    try {
      for (const route of ['/', '/skills/website-brand-brain-builder']) {
        await page.goto(origin + route);
        assert(await page.locator('[data-prerendered] h1').isVisible());
        assert(!await page.locator('#app-loader').isVisible());
        assert((await page.locator('[data-prerendered] a').count()) > 5);
      }
    } finally { await ctx.close(); }
  });
  await check('Plain job hubs and real 404 have no boot gate or loader', async () => {
    const ctx = await context(); const page = await ctx.newPage();
    try {
      for (const route of ['/jobs', '/jobs/build-websites', '/startup-qa-page-does-not-exist']) {
        const response = await page.goto(origin + route);
        if (route.includes('does-not-exist')) assert.equal(response.status(), 404);
        assert.equal(await page.locator('html').getAttribute('data-boot'), null);
        assert.equal(await page.locator('#app-loader').count(), 0);
        assert(await page.locator('h1').isVisible());
      }
    } finally { await ctx.close(); }
  });
  await check('Failed entry JS: timed recovery offers keyboard-accessible plain library', async () => {
    const ctx = await context(); const page = await ctx.newPage();
    await page.route('**/assets/*.js', route => route.abort());
    try {
      await page.goto(origin, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => document.documentElement.dataset.boot === 'error', null, { timeout: 16000 });
      assert.equal(await page.locator('#root').evaluate(el => getComputedStyle(el).visibility), 'hidden');
      assert(await page.getByRole('link', { name: 'Try again', exact: true }).isVisible());
      await page.keyboard.press('Tab');
      assert.equal(await page.locator(':focus').textContent(), 'Try again');
      await page.getByRole('link', { name: 'Browse the library', exact: true }).click();
      assert(await page.getByRole('heading', { name: 'All skills by job', exact: true }).isVisible());
    } finally { await ctx.close(); }
  });
  await check('Failed stylesheet: never reveals an unformatted interactive page', async () => {
    const ctx = await context(); const page = await ctx.newPage();
    await page.route('**/assets/*.css', route => route.abort());
    try {
      await page.goto(origin + '/space', { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => document.documentElement.dataset.boot === 'error');
      await page.waitForTimeout(600);
      assert.equal(await page.locator('#root').evaluate(el => getComputedStyle(el).visibility), 'hidden');
      assert(await page.getByRole('link', { name: 'Try again', exact: true }).isVisible());
    } finally { await ctx.close(); }
  });
  await check('A stylesheet failure after startup cannot re-hide the live page', async () => {
    const ctx = await context(); const page = await ctx.newPage();
    try {
      await page.goto(origin); await ready(page);
      await page.route('**/startup-qa-missing.css', route => route.abort());
      await page.evaluate(() => new Promise(resolve => {
        const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = '/startup-qa-missing.css';
        link.onerror = () => resolve(); document.head.append(link);
      }));
      assert.equal(await page.locator('html').getAttribute('data-boot'), 'ready');
      assert.equal(await page.locator('#root').evaluate(el => getComputedStyle(el).visibility), 'visible');
      assert.equal(await page.locator('#app-loader').count(), 0);
    } finally { await ctx.close(); }
  });
  await check('Cold deep link, library anchor and internal navigation retain destination', async () => {
    const ctx = await context(); const page = await ctx.newPage();
    try {
      await page.goto(origin + '/skills/website-brand-brain-builder'); await ready(page);
      assert.match(await page.locator('h1').first().textContent(), /brand|website/i);
      await page.goto(origin + '/?block=website-brand-brain-builder'); await ready(page);
      await page.waitForURL('**/skills/website-brand-brain-builder');
      assert.equal((await page.evaluate(() => window.__firstReady)).path, '/skills/website-brand-brain-builder');
      await page.goto(origin + '/#library'); await ready(page);
      assert.equal(new URL(page.url()).hash, '#library');
      await page.waitForFunction(() => Math.abs(document.getElementById('library').getBoundingClientRect().top) < 150);
      await page.getByRole('link', { name: 'My space', exact: true }).last().click();
      await page.waitForURL('**/space');
      await page.getByRole('button', { name: /Make my space/i }).waitFor();
      assert.equal(await page.locator('#app-loader').count(), 0);
    } finally { await ctx.close(); }
  });
} finally {
  await browser.close(); if (server.listening) await new Promise(resolve => server.close(resolve));
  const indexSha256 = crypto.createHash('sha256').update(await fs.readFile(path.join(assets, 'index.html'))).digest('hex');
  const report = { origin, indexSha256, status: results.every(r => r.status === 'PASS') ? 'PASS' : 'FAIL', createdAt: new Date().toISOString(), assets, browser: 'installed Chrome, headless, serial isolated contexts', productionWrites: 0, blockedWrites, results };
  await fs.writeFile(path.join(output, 'checks.json'), JSON.stringify(report, null, 2) + '\n');
  if (report.status !== 'PASS') process.exitCode = 1;
}
