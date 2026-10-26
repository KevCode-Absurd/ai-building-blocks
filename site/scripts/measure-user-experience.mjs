// Read-only live browser measurement. No generators, signed-in sessions or model calls.
// Anonymous contexts retain real browser caching between cold and warm visits.
import fs from 'node:fs/promises';
import path from 'node:path';
import { chromium, devices } from 'playwright';
const output = path.resolve(process.argv[2]);
const origin = process.argv[3] ?? 'https://useaiblocks.com';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const profiles = [
  { name: 'desktop', use: { viewport: { width: 1440, height: 900 } }, cpu: 1 },
  { name: 'mobile-emulated', use: devices['Pixel 7'], cpu: 4 },
];
const results = [];
try {
  for (const profile of profiles) {
    const context = await browser.newContext({ ...profile.use, serviceWorkers: 'block' });
    await context.addInitScript(() => {
      const state = window.__uxMeasure = { lcp: [], cls: 0, longTasks: [], blocked: [] };
      // Guard transports in-page rather than Playwright routing, which disables HTTP cache.
      const permitted = method => ['GET', 'HEAD'].includes(String(method ?? 'GET').toUpperCase());
      const safe = url => { try { return new URL(url, location.href).pathname; } catch { return 'invalid'; } };
      const nativeFetch = window.fetch;
      window.fetch = (input, init) => {
        const method = init?.method ?? (input instanceof Request ? input.method : 'GET');
        if (!permitted(method)) { state.blocked.push({ transport: 'fetch', method, path: safe(input instanceof Request ? input.url : input) }); return Promise.reject(new Error('Read-only measurement blocks mutations')); }
        return nativeFetch(input, init);
      };
      const open = XMLHttpRequest.prototype.open, send = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function(method, url, ...rest) { this.__measureMethod = method; this.__measureUrl = url; return open.call(this, method, url, ...rest); };
      XMLHttpRequest.prototype.send = function(...args) { if (!permitted(this.__measureMethod)) { state.blocked.push({ transport: 'xhr', method: this.__measureMethod, path: safe(this.__measureUrl) }); throw new Error('Read-only measurement blocks mutations'); } return send.apply(this, args); };
      navigator.sendBeacon = url => { state.blocked.push({ transport: 'beacon', path: safe(url) }); return false; };
      document.addEventListener('submit', event => { if (!permitted(event.target?.method)) { event.preventDefault(); state.blocked.push({ transport: 'form' }); } }, true);
      for (const [type, consume] of [
        ['largest-contentful-paint', entries => entries.forEach(entry => state.lcp.push({ time: entry.startTime, size: entry.size, tag: entry.element?.tagName }))],
        ['layout-shift', entries => entries.forEach(entry => { if (!entry.hadRecentInput) state.cls += entry.value; })],
        ['longtask', entries => entries.forEach(entry => state.longTasks.push({ time: entry.startTime, duration: entry.duration }))],
      ]) try { new PerformanceObserver(list => consume(list.getEntries())).observe({ type, buffered: true }); } catch {}
    });
    const page = await context.newPage(), cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setBlockedURLs', { urls: ['*api.openai.com*', '*api.anthropic.com*', '*generativelanguage.googleapis.com*', '*openrouter.ai*', '*/api/compose*', '*/api/transcribe*'] });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: profile.cpu });
    for (const visit of ['cold', 'warm']) {
      const requests = new Map(), finished = [];
      const onRequest = e => requests.set(e.requestId, { url: e.request.url, method: e.request.method, type: e.type, start: e.timestamp });
      const onResponse = e => { const r = requests.get(e.requestId); if (r) Object.assign(r, { status: e.response.status, fromDiskCache: e.response.fromDiskCache, fromServiceWorker: e.response.fromServiceWorker, protocol: e.response.protocol }); };
      const onFinish = e => { const r = requests.get(e.requestId); if (r) finished.push({ ...r, encodedBytes: e.encodedDataLength, durationMs: (e.timestamp - r.start) * 1000 }); };
      cdp.on('Network.requestWillBeSent', onRequest); cdp.on('Network.responseReceived', onResponse); cdp.on('Network.loadingFinished', onFinish);
      const started = Date.now();
      await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 60000 });
      let searchReady = null, readinessError = null;
      try { await page.getByTestId('library-search').filter({ visible: true }).waitFor({ timeout: 45000 }); await page.waitForFunction(() => { const input = document.querySelector('[data-testid="library-search"]'); return input && !input.disabled; }, null, { timeout: 45000 }); searchReady = Date.now() - started; } catch (error) { readinessError = error.message.split('\n')[0]; }
      await page.waitForTimeout(1200);
      const opening = await page.evaluate(() => ({ navigation: performance.getEntriesByType('navigation')[0]?.toJSON(), paints: performance.getEntriesByType('paint').map(e => e.toJSON()), metrics: window.__uxMeasure, resources: performance.getEntriesByType('resource').map(e => ({ path: new URL(e.name).pathname, start: e.startTime, duration: e.duration, transfer: e.transferSize, encoded: e.encodedBodySize, decoded: e.decodedBodySize, initiator: e.initiatorType })), scripts: [...document.scripts].map(s => s.src && new URL(s.src).pathname).filter(Boolean) }));
      const openingRequests = [...finished];
      const searches = [];
      if (searchReady !== null) for (const query of ['AEO', 'get my brand mentioned in ChatGPT answers']) {
        const profileSearch = process.env.PERF_PROFILE === '1' && query === 'AEO' && visit === 'cold';
        if (profileSearch) { await cdp.send('Profiler.enable'); await cdp.send('Profiler.start'); }
        const began = await page.evaluate(() => performance.now()); const before = finished.length;
        await Promise.all([page.waitForResponse(response => new URL(response.url()).pathname.startsWith('/data/library-search'), { timeout: 30000 }), page.getByTestId('library-search').fill(query)]);
        await page.getByText('Searching full instructions…', { exact: true }).waitFor({ state: 'hidden', timeout: 30000 });
        const end = await page.evaluate(() => performance.now());
        if (profileSearch) { const { profile: cpuProfile } = await cdp.send('Profiler.stop'); await fs.mkdir(path.dirname(output), { recursive: true }); await fs.writeFile(path.join(path.dirname(output), profile.name + '-first-search.cpuprofile'), JSON.stringify(cpuProfile)); }
        searches.push({ query, inputToCompleteMs: end - began, results: await page.getByTestId('result-count').textContent(), error: await page.locator('[role="alert"]').allTextContents(), longTasks: await page.evaluate(start => window.__uxMeasure.longTasks.filter(task => task.time >= start), began), requests: finished.slice(before) });
      }
      const normalize = r => ({ ...r, url: new URL(r.url).origin + new URL(r.url).pathname });
      results.push({ profile: profile.name, cpuSlowdown: profile.cpu, networkThrottling: false, visit, searchReadyMs: searchReady, readinessError, ...opening, requests: openingRequests.map(normalize), searches: searches.map(s => ({ ...s, requests: s.requests.map(normalize) })), transportedMutations: [...requests.values()].filter(r => !['GET', 'HEAD'].includes(r.method)).map(normalize) });
      cdp.off('Network.requestWillBeSent', onRequest); cdp.off('Network.responseReceived', onResponse); cdp.off('Network.loadingFinished', onFinish);
      console.log(JSON.stringify({ profile: profile.name, visit, searchReadyMs: searchReady, transferred: openingRequests.reduce((n,r) => n+r.encodedBytes,0), searches: searches.map(s => ({ ms: s.inputToCompleteMs, results: s.results })), blocked: opening.metrics.blocked }));
    }
    await context.close();
  }
} finally { await browser.close(); }
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, JSON.stringify({ measuredOn: new Date().toISOString(), origin, scope: 'Live anonymous cold/warm browser observations. Mobile is Pixel7 emulation with4xCPU and host network; not a physical phone or field percentile. In-page guards block all non-GET/HEAD transports; service workers and model endpoints are blocked. No signed-in or provider actions.', results }, null, 2));
