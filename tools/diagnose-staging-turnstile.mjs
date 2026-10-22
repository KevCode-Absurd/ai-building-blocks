// Real SDK observation only. Never solves a challenge; blocks all fixture writes.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { stagingTarget } from './lib/cloudflare-staging-target.mjs';
import { protectStagingContext } from '../site/e2e/fixtures/staging-aware-test.ts';
const base = stagingTarget();
const token = JSON.parse(fs.readFileSync('site/.wrangler/staging-secrets.json', 'utf8')).PREVIEW_ACCESS_TOKEN;
process.env.CF_PREVIEW_ACCESS_TOKEN = token;
const require = createRequire(new URL('../site/package.json', import.meta.url));
const { chromium } = require('@playwright/test');
const report = { checkedOn: new Date().toISOString(), deployedVersion: process.env.CF_STAGING_VERSION, browser: 'standard headless Chrome; no fingerprint changes', status: 'diagnostic-only', productionTouched: false, databaseWrites: 0, providerCalls: 0, codes: [], messages: [] };
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext(); await protectStagingContext(context);
  const page = await context.newPage();
  await page.exposeFunction('__recordWidgetError', code => { report.codes.push(String(code).slice(0, 32)); });
  await page.addInitScript(() => {
    document.addEventListener('load', event => {
      if (!(event.target instanceof HTMLScriptElement) || !event.target.src.startsWith('https://challenges.cloudflare.com/turnstile/')) return;
      const api = window.turnstile; if (!api) return;
      const render = api.render.bind(api);
      api.render = (element, options) => render(element, { ...options, 'error-callback': code => {
        window.__recordWidgetError(String(code));
        return options['error-callback']?.(code);
      } });
    }, true);
  });
  page.on('console', message => { if (/turnstile/i.test(message.text())) report.messages.push(message.text().replace(/https?:\/\/\S+/g, '[URL]').slice(0, 300)); });
  await page.route('**/api/spaces', route => {
    if (route.request().method() === 'POST') { report.realTokenIssued = !!route.request().headers()['x-turnstile-token']; return route.abort(); }
    return route.fallback();
  });
  await page.goto(base + '/space');
  await page.getByTestId('space-name').fill('Staging diagnostic - no write');
  await page.getByTestId('make-space-go').click();
  for (let attempt = 0; attempt < 30 && !report.codes.length && !report.realTokenIssued; attempt++) await page.waitForTimeout(1000);
  report.ui = await page.evaluate(() => ({ sdkLoaded: !!window.turnstile, dialogOpen: !!document.querySelector('dialog[open]'), toast: document.querySelector('.toast')?.textContent || null }));
  await page.screenshot({ path: 'reports/staging-turnstile-diagnostic.png' });
} catch (error) {
  report.failure = String(error.message).replaceAll(token, '[redacted]');
} finally {
  await browser.close();
  fs.writeFileSync('reports/cloudflare-staging-turnstile-diagnostic.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report));
}
