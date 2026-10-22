// Supplemental acceptance evidence against the production Worker. No source/index writes.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { STARTER_PATHS, starterTemplate } from '../site/src/lib/audience-starters.ts';
const require = createRequire(new URL('../site/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const base = process.env.AUDIENCE_CHECK_URL || 'http://127.0.0.1:5183';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const checks = [];
try {
  let ready = false;
  for (let attempt = 0; attempt < 30; attempt++) {
    try { ready = (await fetch(`${base}/api/compose`, { signal: AbortSignal.timeout(1000) })).status === 200; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  assert.ok(ready, 'Local Worker did not become ready');
  for (const width of [320, 393, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: 'dark' });
    const page = await context.newPage(), pageErrors = [];
    page.on('pageerror', error => pageErrors.push(error.message));
    for (const starter of STARTER_PATHS) {
      await page.goto(`${base}/?audience=${starter.id}#library`);
      await page.getByTestId('audience-guide').waitFor();
      assert.equal(await page.getByTestId('block-card').count(), 8, starter.id);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
      assert.equal(overflow, false, `${starter.id} at ${width}px overflows`);
      assert.equal(pageErrors.length, 0, pageErrors.join('\n'));
      const response = await page.request.get(`${base}${starterTemplate(starter.id)}`);
      assert.equal(response.status(), 200, `${starter.id}: brief unavailable`);
      assert.equal(await response.text(), fs.readFileSync(`site/public${starterTemplate(starter.id)}`, 'utf8'), `${starter.id}: brief content differs`);
      if ((width === 1440 && starter.id === 'case-competitions') || (width === 320 && starter.id === 'equity-research')) {
        await page.screenshot({ path: `reports/audience-worker-${starter.id}-${width}.png` });
      }
      checks.push({ id: starter.id, width, cards: 8, noHorizontalOverflow: true, noPageErrors: true, briefHTTP: 200, exactBriefContent: true });
    }
    await context.close();
  }
} finally { await browser.close(); }
const report = { checkedOn: '2026-10-22', environment: base, checks };
fs.writeFileSync('reports/audience-browser-check.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ checks: checks.length, widths: [320, 393, 1440], passed: true }));
