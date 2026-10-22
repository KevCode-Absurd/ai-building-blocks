// Read-only responsive E2E audit. No account, provider or production write calls.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(path.resolve('site/package.json'));
const { chromium } = require('@playwright/test');
const origin = process.argv[2] || 'http://127.0.0.1:5180';
assert(['http://127.0.0.1:5180', 'http://127.0.0.1:5182', 'https://useaiblocks.com'].includes(origin));
const output = path.resolve(process.argv[3] || 'reports/responsive-app');
await fs.mkdir(output, { recursive: true });
const widths = [320, 390, 600, 768, 1024, 1440, 1920];
const routes = ['/', '/#build', '/how-it-works', '/compose', '/from-a-source', '/minds', '/minds/charlie-munger', '/tools', '/ai-tools', '/ai-tools/chatgpt', '/apps', '/apps/starter-pack', '/tools/growth-channel-planner', '/tools/loan-payment', '/tools/layout-grid-calculator', '/tools/word-counter', '/tools/text-cleaner', '/tools/contrast-checker', '/tools/json-formatter', '/tools/csv-to-json', '/tools/task-priority-planner', '/tools/weighted-decision-matrix', '/space', '/people', '/s/responsive-unissued-link', '/skills/website-brand-brain-builder', '/prompts/fact-based-ad-copy-writer', '/workflows/review-image-ads', '/support', '/about', '/privacy', '/terms', '/cookies', '/ai-disclaimer', '/jobs', '/jobs/build-websites', '/example-app/', '/example-app/landing', '/example-app/seo'];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = []; let blockedWrites = 0;
async function inspect(page) {
  return page.evaluate(() => {
    const issues = [], viewport = innerWidth;
    if (document.documentElement.scrollWidth > viewport + 1) issues.push({ kind: 'document-overflow', width: document.documentElement.scrollWidth });
    const visible = e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none'; };
    const inScroller = e => { for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) { if (/(auto|scroll)/.test(getComputedStyle(p).overflowX)) return true; } return false; };
    for (const e of document.querySelectorAll('main button,main a,main input,main select,main textarea,header button,header a,[role="dialog"] button,[role="dialog"] input,[role="dialog"] textarea')) {
      if (!visible(e) || e.closest('.react-flow__viewport,.react-flow__controls,.visually-hidden,.skip-link') || inScroller(e)) continue;
      const r = e.getBoundingClientRect();
      if (r.left < -2 || r.right > viewport + 2) issues.push({ kind: 'control-outside-viewport', tag: e.tagName, text: (e.textContent || e.getAttribute('aria-label') || e.getAttribute('placeholder') || '').trim().slice(0, 65), left: Math.round(r.left), right: Math.round(r.right) });
    }
    const cards = [...document.querySelectorAll('[data-testid="block-card"]')];
    const rows = new Map();
    for (const e of cards) { const top = Math.round(e.getBoundingClientRect().top); if (!rows.has(top)) rows.set(top, []); rows.get(top).push(e); }
    for (const group of rows.values()) if (group.length > 1) for (const selector of ['.nm', '.peek', '.view']) {
      const positions = group.map(e => Math.round(e.querySelector(selector).getBoundingClientRect().top));
      if (Math.max(...positions) - Math.min(...positions) > 2) issues.push({ kind: 'card-row-misalignment', selector, positions });
    }
    for (const e of cards) for (const child of e.querySelectorAll('.meta,.nm,.peek,.view')) if (child.scrollWidth > child.clientWidth + 2) issues.push({ kind: 'clipped-card-text', text: child.textContent.slice(0, 65) });
    return issues.slice(0, 20);
  });
}
async function check(name, page, fn) {
  const start = Date.now();
  try { await fn(); results.push({ name, status: 'pass', ms: Date.now() - start }); }
  catch (e) { results.push({ name, status: 'fail', error: e.message, ms: Date.now() - start }); await page.screenshot({ path: path.join(output, `failure-${results.length}.png`), fullPage: false }).catch(() => {}); }
  console.log(JSON.stringify(results.at(-1)));
}
async function ready(page) {
  await page.locator('main').first().waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForFunction(() => !document.documentElement.dataset.boot || document.documentElement.dataset.boot === 'ready');
  await page.locator('#app-loader').waitFor({ state: 'detached' }).catch(() => {});
}
try {
  for (const width of widths) {
    const ctx = await browser.newContext({ viewport: { width, height: 950 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
    await ctx.addInitScript(() => { if (!localStorage.getItem('abb:theme')) localStorage.setItem('abb:theme', 'dark'); });
    await ctx.route('**/*', route => {
      const request = route.request(), url = new URL(request.url());
      if (!['GET', 'HEAD'].includes(request.method())) { blockedWrites++; return route.abort(); }
      if (url.origin !== origin) return route.abort();
      if (url.pathname === '/api/auth') return route.fulfill({ json: { configured: false, publishableKey: null } });
      if (url.pathname === '/api/compose') return route.fulfill({ json: { enabled: false } });
      if (url.pathname === '/api/security') return route.fulfill({ json: { required: false } });
      if (url.pathname.startsWith('/api/comments')) return route.fulfill({ json: { comments: [] } });
      if (url.pathname.startsWith('/api/spaces/public')) return route.fulfill({ json: { items: [] } });
      if (url.pathname.startsWith('/api/spaces/')) return route.fulfill({ status: 404, json: { error: 'Synthetic unissued share link' } });
      return route.continue();
    });
    const page = await ctx.newPage();
    for (const route of routes) await check(`${width}px ${route}`, page, async () => {
      await page.goto(origin + route, { waitUntil: 'domcontentloaded' }); await ready(page);
      if (route.startsWith('/example-app')) await page.evaluate(() => document.documentElement.classList.add('dark'));
      if (route === '/' || route === '/#build') await page.getByTestId('block-card').first().waitFor();
      if (route === '/#build') await page.getByTestId('builder').scrollIntoViewIfNeeded();
      assert.deepEqual(await inspect(page), []);
      if ((route === '/' && [320, 768, 1440].includes(width)) || (width === 390 && ['/compose', '/minds', '/support'].includes(route))) {
        if (route === '/') await page.getByTestId('block-card').first().scrollIntoViewIfNeeded();
        await page.screenshot({ path: path.join(output, `${width}-${route.replace(/\W/g, '') || 'home'}.png`), fullPage: false });
      }
    });
    await check(`${width}px navigation and context drawer`, page, async () => {
      await page.goto(origin); await ready(page);
      const menu = page.getByTestId('menu-btn');
      if (await menu.isVisible()) { await menu.click(); assert.deepEqual(await inspect(page), []); await menu.click(); }
      await page.getByTestId('open-business').click(); await page.getByRole('dialog').waitFor(); assert.deepEqual(await inspect(page), []);
      await page.getByRole('button', { name: 'Close', exact: true }).click();
      if (await menu.isVisible()) await menu.click();
      else await page.getByTestId('nav-more').click();
      await page.getByTestId('open-kits').click(); await page.getByRole('dialog').waitFor(); assert.deepEqual(await inspect(page), []);
      await page.getByRole('button', { name: 'Close', exact: true }).click();
      const filters = page.getByRole('button', { name: 'More filters', exact: true });
      if (await filters.isVisible()) { await filters.click(); assert.deepEqual(await inspect(page), []); }
    });
    await check(`${width}px free workflow result and editable steps`, page, async () => {
      await page.goto(origin + '/compose'); await ready(page);
      await page.getByTestId('compose-goal').fill('Build an accessible landing page with editable HTML, then audit SEO and deliver the source files.');
      await page.getByTestId('compose-submit').click(); await page.getByRole('region', { name: 'Your workflow' }).waitFor();
      await page.getByTestId('compose-steps').waitFor();
      assert.deepEqual(await inspect(page), []);
    });
    await check(`${width}px prepared growth planner and long dropdown labels`, page, async () => {
      await page.goto(origin + '/tools/growth-channel-planner'); await ready(page);
      await page.getByTestId('traction-mode').click();
      await page.getByRole('option', { name: 'Nonprofit or community', exact: true }).click();
      await page.getByTestId('traction-scope').click();
      assert.deepEqual(await inspect(page), []);
      await page.getByRole('option', { name: 'Engineering as Marketing', exact: true }).click();
      await page.getByTestId('traction-business').fill('A community organisation providing accessible creative workshops and local education programmes.');
      await page.getByTestId('traction-prepare').click(); await page.getByTestId('traction-result').waitFor();
      assert.deepEqual(await inspect(page), []);
      assert(await page.locator('.traction-delivery > p').evaluate(e => parseFloat(getComputedStyle(e).marginTop) >= 20));
    });
    if ([320, 768, 1440].includes(width)) {
      await page.evaluate(() => localStorage.setItem('abb:theme', 'light'));
      for (const route of routes) await check(`${width}px light ${route}`, page, async () => {
        await page.goto(origin + route); await ready(page);
        await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
        if (route.startsWith('/example-app')) await page.evaluate(() => document.documentElement.classList.remove('dark'));
        if (route === '/' || route === '/#build') await page.getByTestId('block-card').first().waitFor();
        if (route === '/minds') {
          const faces = page.getByTestId('face-wall');
          assert.equal(await faces.locator(':scope > span').count(), 305);
          assert(await faces.evaluate(e => e.scrollHeight <= e.clientHeight + 1));
          assert.equal(await page.getByTestId('mind-identity').count(), 305);
        }
        assert.deepEqual(await inspect(page), []);
      });
    }
    if (width === 1440) await check('Hero CTA pointer survives the interactive globe hover', page, async () => {
      await page.goto(origin); await ready(page);
      await page.locator('.hero').evaluate(e => e.classList.add('globe-hot'));
      for (const link of await page.locator('.hero-actions a').all()) { await link.hover(); assert.equal(await link.evaluate(e => getComputedStyle(e).cursor), 'pointer'); }
    });
    await ctx.close();
  }
} finally {
  await browser.close();
  const report = { checkedOn: new Date().toISOString(), origin, status: results.every(r => r.status === 'pass') ? 'pass' : 'fail', widths, routeTemplates: routes.length, passed: results.filter(r => r.status === 'pass').length, failed: results.filter(r => r.status === 'fail').length, blockedWrites, providerCalls: 0, apiFixtures: 'read-only auth/security/comments/spaces responses; no real account or D1 mutations', results };
  await fs.writeFile(path.join(output, 'checks.json'), JSON.stringify(report, null, 2) + '\n');
  if (report.failed) process.exitCode = 1;
}
