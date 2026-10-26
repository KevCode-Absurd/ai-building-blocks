// Controlled N=3 hook-only comparison on one fixed published corpus; not a field/mobile percentile.
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { build } from 'esbuild';
import { chromium } from 'playwright';
const repo = path.resolve(import.meta.dirname, '../..');
const taskRoot = 'C:/Users/kevin/.codex/visualizations/2026/10/23/01a16767-65d7-7912-81d7-ae3cd042ca89';
const baseline = path.join(repo, 'site/.wrangler/releases/release-2026-10-23-live-sync-r5');
const output = path.join(taskRoot, 'performance-iteration/search-worker-paired.json');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const corpus = path.join(baseline, 'assets');
const hooks = { before: path.join(baseline, 'source/site/src/lib/library-search.ts'), after: path.join(repo, 'site/src/lib/library-search.ts') };
const bundles = {};
for (const [name, hook] of Object.entries(hooks)) {
  const result = await build({ stdin: { resolveDir: path.join(repo, 'site'), loader: 'tsx', contents: `
import {createElement,useState,useEffect} from 'react'; import {createRoot} from 'react-dom/client';
import {useLibrarySearch} from ${JSON.stringify(hook)};
import {loadCatalogue,taskOf,functionsOf} from './src/lib/data';
const extraText=b=>taskOf(b).name+' '+functionsOf(b).map(x=>x.name).join(' ');
function Library({c}){const[q,setQ]=useState('');const s=useLibrarySearch(c,q,{extraText});
useEffect(()=>{window.__result={complete:s.complete,loading:s.loading,hits:[...s.hits].sort((a,b)=>a[0].localeCompare(b[0])),error:s.error}},[s.hits,s.complete,s.loading,s.error]);
return createElement('main',null,createElement('input',{'aria-label':'Search',value:q,onChange:e=>setQ(e.target.value)}));}
loadCatalogue().then(c=>createRoot(document.getElementById('root')).render(createElement(Library,{c})));
` }, alias: { react: path.join(repo, 'site/node_modules/preact/compat'), 'react-dom/client': path.join(repo, 'site/node_modules/preact/compat/client') }, bundle: true, write: false, format: 'esm', platform: 'browser' });
  bundles['/' + name + '.js'] = result.outputFiles[0].contents;
}
const worker = await build({ entryPoints: [path.join(repo, 'site/src/lib/library-search-worker.ts')], bundle: true, write: false, format: 'esm', platform: 'browser' });
bundles['/library-search-worker.ts'] = worker.outputFiles[0].contents;
const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'GET') { response.writeHead(405); response.end(); return; }
  if (bundles[pathname]) { response.setHeader('Content-Type', 'text/javascript'); response.end(bundles[pathname]); return; }
  if (pathname === '/before' || pathname === '/after') { response.setHeader('Content-Type', 'text/html'); response.end(`<div id="root"></div><script type="module" src="${pathname}.js"></script>`); return; }
  if (pathname.startsWith('/data/') && !pathname.includes('..')) { try { response.setHeader('Content-Type', 'application/json'); response.end(await fs.readFile(path.join(corpus, pathname))); } catch { response.writeHead(404); response.end(); } return; }
  response.writeHead(404); response.end();
});
await new Promise(resolve => server.listen(5212, '127.0.0.1', resolve));
const browser = await chromium.launch({ channel: 'chrome', headless: true }), samples = [];
try {
  for (const cpu of [1, 4]) for (let run = 1; run <= 3; run++) for (const variant of ['before', 'after']) {
    const context = await browser.newContext(), page = await context.newPage(), cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });
    await page.addInitScript(() => { window.__tasks = []; new PerformanceObserver(list => window.__tasks.push(...list.getEntries().map(e => ({ start: e.startTime, duration: e.duration })))).observe({ type: 'longtask', buffered: true }); });
    await page.goto('http://127.0.0.1:5212/' + variant);
    await page.getByRole('textbox', { name: 'Search' }).waitFor();
    await page.waitForTimeout(1200);
    const start = await page.evaluate(() => performance.now());
    await page.getByRole('textbox', { name: 'Search' }).fill('AEO');
    await page.waitForFunction(() => window.__result?.complete && !window.__result.loading && window.__result.hits.length > 0);
    const result = await page.evaluate(start => ({ inputToCompleteMs: performance.now() - start, ...window.__result, queryLongTasks: window.__tasks.filter(t=>t.start>=start) }), start);
    const sample = { cpuSlowdown: cpu, run, variant, inputToCompleteMs: result.inputToCompleteMs, hits: result.hits.length, hitsHash: sha(JSON.stringify(result.hits)), queryLongTasks: result.queryLongTasks, error: result.error };
    samples.push(sample); console.log(JSON.stringify(sample)); await context.close();
  }
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
const summary = [1,4].flatMap(cpu => ['before','after'].map(variant => { const group = samples.filter(s=>s.cpuSlowdown===cpu&&s.variant===variant); const values=group.map(s=>s.inputToCompleteMs).sort((a,b)=>a-b); return { cpuSlowdown:cpu,variant,samples:group.length,medianMs:values[1],minMs:values[0],maxMs:values.at(-1),longestQueryTaskMs:Math.max(0,...group.flatMap(s=>s.queryLongTasks.map(t=>t.duration))) }; }));
await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, JSON.stringify({ measuredOn:new Date().toISOString(),scope:'N=3 paired hook-only controlled comparison. Same public4743 catalogue/search corpus, localHTTP, anonymous fresh contexts, browser4xCPU emulation for mobile-class contention; no auth/provider/API calls. Full-site root preload/navigation changes excluded.1200ms reading pause before input.',catalogueSha256:sha(await fs.readFile(path.join(corpus,'data/blocks.json'))),hookHashes:Object.fromEntries(await Promise.all(Object.entries(hooks).map(async([name,file])=>[name,sha(await fs.readFile(file))]))),workerSha256:sha(await fs.readFile(path.join(repo,'site/src/lib/library-search-worker.ts'))),samples,summary},null,2));
