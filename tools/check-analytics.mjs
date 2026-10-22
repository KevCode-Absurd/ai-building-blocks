// Focused real-browser privacy/typing proof against frozen app HTML. Vendors are
// mocked before any request leaves the browser; no customer data is transmitted.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(path.resolve('site/package.json'));
const { chromium } = require('@playwright/test');
const release = JSON.parse(await fs.readFile('reports/cloudflare-live-release.json', 'utf8'));
const assets = process.env.ANALYTICS_DIST || path.join(release.production.assetReleaseRoot.replaceAll('\\\\', '\\'), 'assets');
const analytics = await fs.readFile('site/public/analytics.js', 'utf8');
const output = 'reports/analytics-browser'; await fs.mkdir(output, { recursive: true });
const mime = file => file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css' : file.endsWith('.json') ? 'application/json' : file.endsWith('.svg') ? 'image/svg+xml' : file.endsWith('.html') ? 'text/html' : 'application/octet-stream';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
try {
  for (const delayed of [false, true]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    let vendorRequests = 0, pageLoads = 0, releaseVendor;
    const ready = new Promise(resolve => { releaseVendor = resolve; });
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.hostname === 'www.googletagmanager.com') { vendorRequests++; return route.fulfill({ contentType: 'text/javascript', body: '/* mock Google transport; dataLayer is inspected locally */' }); }
      if (url.hostname === 'www.clarity.ms') {
        vendorRequests++;
        if (delayed) await ready;
        // The observed vendor tag queues start and moves it ahead of consent.
        return route.fulfill({ contentType: 'text/javascript', body: `
          window.clarity('start',{projectId:'z1oj0rgzrv'});
          window.clarity.q.unshift(window.clarity.q.pop());
          const pending=window.clarity.q||[];
          window.__replay={active:false,records:[]};
          window.clarity=function(method){
            if(method==='start'){window.__replay.active=true;window.__replay.records.push(['start',location.href]);}
            if(method==='stop'){window.__replay.active=false;window.__replay.records.push(['stop',location.href]);window.clarity=function(){(window.clarity.q=window.clarity.q||[]).push(arguments)};}
          };
          window.clarity.v='mock-verified-stop-api';
          pending.forEach(args=>window.clarity(...args));
        ` });
      }
      if (url.origin !== 'https://useaiblocks.com') return route.abort();
      if (url.pathname === '/analytics.js') return route.fulfill({ contentType: 'text/javascript', body: analytics });
      if (url.pathname.startsWith('/api/')) return route.fulfill({ contentType: 'application/json', body: '{}' });
      let relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
      if (!relative) relative = 'index.html';
      let file = path.resolve(assets, relative);
      assert(file.startsWith(path.resolve(assets) + path.sep));
      let body;
      for (const candidate of [file, file + '.html', path.join(file, 'index.html')]) {
        try { if ((await fs.stat(candidate)).isFile()) { file = candidate; body = await fs.readFile(candidate); break; } } catch (_) {}
      }
      if (!body) return route.fulfill({ status: 404, body: 'not found' });
      if (file.endsWith('.html')) { pageLoads++; body = body.toString().replace('</head>', '<script defer src="/analytics.js"></script></head>'); }
      return route.fulfill({ contentType: mime(file), body });
    });
    const page = await context.newPage();
    await page.goto('https://useaiblocks.com/');
    await page.getByRole('button', { name: 'Accept cookies', exact: true }).waitFor();
    assert.equal(vendorRequests, 0);
    await page.getByRole('button', { name: 'Accept cookies', exact: true }).click();
    await page.waitForFunction(() => window.dataLayer?.length > 0);
    if (!delayed) await page.waitForFunction(() => window.__replay?.active);
    const input = page.getByTestId('library-search');
    await input.waitFor(); await input.scrollIntoViewIfNeeded(); await input.focus();
    const before = pageLoads;
    await input.pressSequentially('synthetic privacy search');
    await page.waitForFunction(() => location.search.includes('synthetic'));
    assert.equal(await input.inputValue(), 'synthetic privacy search'); assert(await input.evaluate(el => el === document.activeElement));
    assert.equal(pageLoads, before, 'typing must not reload');
    if (delayed) releaseVendor();
    await page.waitForFunction(() => window.__replay && !window.__replay.active);
    const records = await page.evaluate(() => window.__replay.records);
    assert(!records.some(record => /synthetic|compose|owner|\/s\//.test(record[1])));
    const events = await page.evaluate(() => window.dataLayer.map(args => [...args]).filter(args => args[0] === 'event'));
    assert(events.length >= 1); assert(!JSON.stringify(events).includes('synthetic'));
    await page.goto('https://useaiblocks.com/cookies');
    await page.getByRole('button', { name: 'Cookie preferences', exact: true }).click();
    await page.screenshot({ path: path.join(output, delayed ? 'late-vendor-mobile.png' : 'consent-mobile.png') });
    await page.getByRole('button', { name: 'Reject cookies', exact: true }).click();
    await page.waitForLoadState();
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('abb:analytics-consent:v1')).value), 'denied');
    results.push({ name: delayed ? 'late vendor download after typing' : 'active vendor stopped before typing', status: 'pass', noReload: true, focusAndValuePreserved: true, noPrivateAnalyticsEvents: true, noPrivateReplayMetadata: true, revocationPersisted: true });
    await context.close();
  }
  const report = { checkedOn: new Date().toISOString(), status: 'pass', browser: 'installed Chrome headless', vendorRequests: 'mocked; no real provider requests', tests: results };
  await fs.writeFile(path.join(output, 'checks.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
} finally { await browser.close(); }
