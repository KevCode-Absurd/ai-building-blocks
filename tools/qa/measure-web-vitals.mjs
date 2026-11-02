#!/usr/bin/env node
// Sequential real Chrome navigations and small public interactions. No account or model writes.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require = createRequire(new URL('../../site/package.json', import.meta.url));
const {chromium} = require('@playwright/test');
const arg = name => { const i = process.argv.indexOf(name); return i < 0 ? null : process.argv[i + 1]; };
const origin = arg('--origin') ?? 'https://useaiblocks.com';
if (!['https://useaiblocks.com', 'http://127.0.0.1:5191'].includes(origin)) throw Error('Use production or the local production preview.');
const runtime = arg('--runtime');
if (!runtime) throw Error('Pass --runtime with a directory containing the official web-vitals package.');
const vitals = await fs.readFile(path.join(runtime, 'node_modules/web-vitals/dist/web-vitals.iife.js'), 'utf8');
const out = path.resolve(arg('--out') ?? 'reports/web-vitals');
await fs.mkdir(out, {recursive: true});
const routes = (arg('--routes') ?? '/,/jobs/make-video-ads,/skills/voice-and-tone-guide-writer,/compose').split(',');
const repeats = Number(arg('--repeats') ?? 3);
if (!Number.isInteger(repeats) || repeats < 1 || repeats > 5) throw Error('Use one to five repetitions.');
const profiles = (arg('--profiles') ?? 'mobile,desktop').split(',');
const report = {checkedOn: new Date().toISOString(), origin, scope: 'Cold Chrome lab sessions. Mobile uses 4x CPU and a 1.6 Mbps/150 ms network; desktop is unthrottled. Sampled INP includes explicit interactions, not a field percentile. No production writes or model calls.', runs: []};
const browser = await chromium.launch({channel: 'chrome', headless: true});
try {
  for (const profile of profiles) for (const route of routes) for (let repeat = 1; repeat <= repeats; repeat++) {
    const mobile = profile === 'mobile';
    const context = await browser.newContext({viewport: mobile ? {width: 412, height: 823} : {width: 1440, height: 900}, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 1.75 : 1, colorScheme: 'dark', serviceWorkers: 'block'});
    try {
      await context.addInitScript({content: vitals + '\nwindow.__vitals={};for(const name of ["LCP","CLS","INP"]){webVitals["on"+name](m=>window.__vitals[name]={value:m.value,rating:m.rating},{reportAllChanges:true});}'});
      // Drop any non-read request, including analytics. Never submit a paid request or change an account.
      await context.route('**/*', r => ['GET', 'HEAD', 'OPTIONS'].includes(r.request().method()) ? r.continue() : r.abort());
      const page = await context.newPage(), cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable'); await cdp.send('Network.setCacheDisabled', {cacheDisabled: true});
      if (mobile) { await cdp.send('Emulation.setCPUThrottlingRate', {rate: 4}); await cdp.send('Network.emulateNetworkConditions', {offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8}); }
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.goto(origin + route, {waitUntil: 'load', timeout: 60000});
      await page.waitForFunction(() => !document.documentElement.dataset.boot || document.documentElement.dataset.boot === 'ready', null, {timeout: 45000});
      await page.waitForTimeout(1200);
      const before = await page.evaluate(() => ({vitals: {...window.__vitals}, navigation: performance.getEntriesByType('navigation')[0].toJSON(), paint: performance.getEntriesByType('paint').map(e => ({name: e.name, ms: e.startTime})), bytes: performance.getEntriesByType('resource').reduce((n,e)=>n+e.transferSize, 0)}));
      const menu = page.getByTestId('menu-btn');
      if (await menu.isVisible()) { await menu.click(); await page.waitForTimeout(200); await menu.click(); }
      if (route === '/') {
        const search = page.getByTestId('library-search'); await search.fill('meeting notes');
        await page.waitForTimeout(1600); await search.press('End'); await search.press('s'); await search.press('Backspace');
      } else if (route === '/compose') {
        const request = page.getByTestId('compose-goal'); await request.fill('Turn supplied meeting notes into a checked action list');
        await request.press('End'); await request.press('s'); await request.press('Backspace');
      } else if (route === '/roles') {
        const search = page.getByTestId('role-search'); await search.fill('coding');
        await page.waitForTimeout(1600); await search.press('End'); await search.press('s'); await search.press('Backspace');
      } else if (route.startsWith('/roles/')) {
        const detail = page.getByTestId('base-specialist').getByText('Use through MCP or API', {exact: true});
        await detail.click(); await detail.click();
      } else if (route.startsWith('/skills/')) {
        const detail = page.locator('details > summary').first(); if (await detail.isVisible()) { await detail.click(); await detail.click(); }
      }
      await page.waitForTimeout(1500);
      const after = await page.evaluate(() => ({vitals: {...window.__vitals}, overflow: document.documentElement.scrollWidth > innerWidth, interactions: performance.interactionCount ?? null}));
      const result = {profile, route, repeat, before, after, errors};
      report.runs.push(result);
      await page.screenshot({path: path.join(out, `${profile}-${route === '/' ? 'home' : route.slice(1).replaceAll('/', '--')}-${repeat}.png`)});
      console.log(JSON.stringify({profile, route, repeat, load: Math.round(before.navigation.loadEventEnd), ttfb: Math.round(before.navigation.responseStart), before: before.vitals, after: after.vitals, overflow: after.overflow, errors}));
      await fs.writeFile(path.join(out, 'summary.json'), JSON.stringify(report, null, 2) + '\n');
    } finally { await context.close(); }
  }
} finally { await browser.close(); }
