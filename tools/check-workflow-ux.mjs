import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(path.resolve('site/package.json'));
const { chromium } = require('@playwright/test');
const origin = process.argv[2] || 'http://127.0.0.1:5184';
assert(/^http:\/\/127\.0\.0\.1:518[024]$/.test(origin));
const results = [];
const browser = await chromium.launch({ channel: 'chrome', headless: true });
let blockedWrites = 0;
async function context(options) {
  const ctx = await browser.newContext({ serviceWorkers: 'block', ...options });
  await ctx.route('**/*', route => {
    const req = route.request(), url = new URL(req.url());
    if (!['GET', 'HEAD'].includes(req.method())) { blockedWrites++; return route.abort(); }
    if (url.origin !== origin) return route.abort();
    if (url.pathname === '/api/auth') return route.fulfill({ json: { configured: false } });
    if (url.pathname === '/api/security') return route.fulfill({ json: { required: false } });
    if (url.pathname === '/api/compose') return route.fulfill({ json: { enabled: false } });
    return route.continue();
  });
  return ctx;
}
async function check(name, fn) {
  try { await fn(); results.push({ name, status: 'pass' }); }
  catch (e) { results.push({ name, status: 'fail', error: e.message }); }
  console.log(JSON.stringify(results.at(-1)));
}
try {
  for (const width of [320, 390, 1440]) for (const theme of ['light', 'dark']) {
    const ctx = await context({ viewport: { width, height: 950 }, colorScheme: theme, reducedMotion: 'reduce', isMobile: width < 500, hasTouch: width < 500 });
    await ctx.addInitScript(({ theme }) => {
      localStorage.setItem('theme', theme);
      localStorage.setItem('abb:v1', JSON.stringify({ kits: [], flows: [], recent: [], currentFlow: null, draft: { id: 'ux-fixture', name: 'Selection check', updated: 0, nodes: [{ id: 'ux-step', slug: 'brand-voice-editor', x: 40, y: 110 }], edges: [] } }));
    }, { theme });
    const page = await ctx.newPage();
    await page.goto(origin + '/#build');
    await page.getByTestId('builder').waitFor();
    await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
    await check(`${width}px ${theme}: Context + Minds, kits in menu, no overflow`, async () => {
      await page.getByTestId('nav-minds').waitFor({ state: 'visible' });
      assert(await page.getByTestId('open-business').isVisible());
      assert.equal(await page.getByTestId('open-kits').isVisible(), false);
      const toggle = page.getByTestId(width < 1025 ? 'menu-btn' : 'nav-more');
      await toggle.click(); await page.getByTestId('open-kits').click();
      await page.getByRole('dialog').waitFor();
      await page.getByRole('dialog').getByRole('button', { name: 'Close', exact: true }).click();
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    });
    await check(`${width}px ${theme}: selected workflow has contrasting outline`, async () => {
      const target = width < 500 ? page.getByTestId('step-open').first() : page.getByTestId('flow-node').first();
      await target.click();
      const row = width < 500 ? page.locator('.sl-row[data-selected="true"]').first() : page.locator('.react-flow__node.selected .node').first();
      await row.waitFor();
      if (width < 500) assert.equal(await target.getAttribute('aria-pressed'), 'true');
      const style = await row.evaluate(el => { const s = getComputedStyle(el); return { outline: s.outlineWidth, color: s.outlineColor, text: getComputedStyle(document.documentElement).getPropertyValue('--text').trim(), offset: s.outlineOffset }; });
      assert.equal(style.outline, '2px'); assert.equal(style.offset, '2px');
      assert.equal(style.color, theme === 'dark' ? 'rgb(255, 255, 255)' : 'rgb(10, 10, 10)');
      await page.screenshot({ path: `reports/workflow-ux-${width}-${theme}.png` });
    });
    await ctx.close();
  }
  for (const reducedMotion of ['reduce', 'no-preference']) {
    const ctx = await context({ viewport: { width: 390, height: 850 }, isMobile: true, hasTouch: true, reducedMotion });
    const page = await ctx.newPage(); await page.goto(origin); await page.getByTestId('globe').waitFor();
    await check(`globe ${reducedMotion}: simultaneous automatic highlights`, async () => {
      const count = await page.getByTestId('globe').evaluate(canvas => {
        const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height); let count = 0;
        for (let i = 0; i < data.length; i += 4) if (data[i + 3] > 30 && Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2]) > 35) count++;
        return count;
      });
      if (reducedMotion === 'reduce') assert.equal(count, 0); else assert(count > 30, `Expected many colored pixels; got ${count}`);
    });
    await check(`globe ${reducedMotion}: real horizontal touch drag and vertical page scroll`, async () => {
      const cdp = await ctx.newCDPSession(page);
      const box = await page.getByTestId('globe').boundingBox();
      const x = box.x + box.width * .5, y = box.y + box.height * .45;
      const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
      await touch('touchStart', x, y);
      assert(await page.locator('body').evaluate(el => el.classList.contains('globe-dragging')), JSON.stringify(await page.evaluate(({ x, y }) => ({ target: document.elementFromPoint(x, y)?.outerHTML.slice(0, 250), hero: document.querySelector('.hero')?.getBoundingClientRect().toJSON() }), { x, y })));
      await touch('touchMove', x + 35, y); await touch('touchMove', x + 90, y);
      assert(await page.locator('body').evaluate(el => el.classList.contains('globe-dragging')));
      await touch('touchEnd', x + 90, y);
      assert.equal(await page.locator('body').evaluate(el => el.classList.contains('globe-dragging')), false);
      await touch('touchStart', x, y); await touch('touchMove', x, y - 35); await touch('touchMove', x, y - 100); await touch('touchEnd', x, y - 100);
      await page.waitForFunction(() => scrollY > 10);
      assert.equal(await page.locator('body').evaluate(el => el.classList.contains('globe-dragging')), false);
      await cdp.detach();
    });
    await ctx.close();
  }
} finally { await browser.close(); }
await fs.writeFile('reports/2026-10-22-workflow-ux-check.json', JSON.stringify({ origin, blockedWrites, results }, null, 2));
if (results.some(r => r.status !== 'pass')) process.exitCode = 1;
