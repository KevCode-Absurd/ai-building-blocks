import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
const require = createRequire(path.resolve('site/package.json'));
const { chromium } = require('@playwright/test'), { unzipSync, strFromU8 } = require('fflate');
const [target, label = 'local'] = process.argv.slice(2);
const suite = JSON.parse(await fs.readFile('reports/semantic-wide-v2.json', 'utf8'));
assert.equal(suite.passed, 30, 'Complete the request evaluation first.');
let server, origin = target;
if (!/^https:/.test(target)) {
  const root = path.resolve(target);
  server = http.createServer(async (req, res) => {
    try {
      const route = new URL(req.url, 'http://localhost').pathname;
      if (route.startsWith('/api/')) { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(route === '/api/auth' ? { configured: false, publishableKey: null } : route === '/api/compose' || route === '/api/transcribe' ? { enabled: true } : { items: [], comments: [] })); return; }
      let file = path.resolve(root, '.' + decodeURIComponent(route)); assert(file === root || file.startsWith(root + path.sep));
      if (route === '/') file = path.join(root, 'index.html'); else if (!path.extname(file)) file += '.html';
      const data = await fs.readFile(file); const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
      res.setHeader('content-type', types[path.extname(file)] || 'application/octet-stream'); res.end(data);
    } catch { res.statusCode = 404; res.end('Not found'); }
  });
  await new Promise(resolve => server.listen(5184, '127.0.0.1', resolve)); origin = 'http://127.0.0.1:5184';
}
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const checks = [], errors = []; let providerPosts = 0;
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 950 }, acceptDownloads: true });
  const page = await context.newPage(); page.setDefaultTimeout(30000);
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', req => { if (req.method() === 'POST' && /\/api\/(compose|transcribe)$/.test(new URL(req.url()).pathname)) providerPosts++; });
  await page.goto(origin + '/compose');
  const reject = page.getByRole('button', { name: 'Reject cookies', exact: true }); if (await reject.isVisible()) await reject.click();
  const voice = page.getByTestId('compose-voice');
  assert.equal(await voice.getAttribute('aria-label'), 'Record voice request'); assert.equal((await voice.innerText()).trim(), ''); assert.equal(await voice.locator('svg').count(), 1);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 950 });
    const box = await voice.boundingBox(); assert.equal(box.width, 44); assert.equal(box.height, 44);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator('.compose-request-box').screenshot({ path: `reports/composer-${label}-microphone-${width}.png` });
    checks.push(`Accessible microphone icon and timer at ${width}px`);
  }
  await page.setViewportSize({ width: 1440, height: 950 });
  for (const run of suite.runs) {
    await page.getByLabel('Import workflow JSON', { exact: true }).setInputFiles({ name: 'workflow.edit.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify({ format: 'ai-blocks-composition/1', goal: run.goal, context: run.context, choices: {}, plan: run.plan, model: suite.model, cost: run.cost, latencyMs: 0 })) });
    await page.waitForFunction(count => document.querySelectorAll('[data-testid="flow-node"]').length === count, run.plan.steps.length);
    const pending = page.waitForEvent('download'); await page.getByTestId('compose-download').click(); const download = await pending;
    const files = unzipSync(await fs.readFile(await download.path()));
    const saved = JSON.parse(strFromU8(files['workflow.edit.json'])); assert.equal(saved.goal, run.goal);
    for (const step of run.plan.steps) assert(files[`skills/${step.slug}/SKILL.md`], run.id + ': ' + step.slug);
    assert(files['HANDOFF.md']); assert(files['README.md']); assert(files['inputs.json']);
    checks.push(`${run.id}: AI result renders as editable graph and downloads all selected skills`);
  }
  assert.deepEqual(errors, []); assert.equal(providerPosts, 0);
  await context.close();
  if (server && process.argv.includes('--whisper-canary')) {
    const code = await new Promise((resolve, reject) => { const child = spawn(process.execPath, ['tools/check-voice-browser.mjs', origin], { windowsHide: true, stdio: 'inherit' }); child.on('error', reject); child.on('exit', resolve); }); assert.equal(code, 0); checks.push('Real Chrome audio capture transcribed by OpenAI Whisper using a synthetic fixture');
  }
  const report = { checkedOn: new Date().toISOString(), origin, status: 'pass', passed: checks.length, checks, browserErrors: errors, workflowGenerationPosts: providerPosts, scope: 'The real-model plans are imported for graph/export verification; this test does not bypass production sign-in or human verification.' };
  await fs.writeFile(`reports/composer-wide-${label}-browser.json`, JSON.stringify(report, null, 2)); console.log(JSON.stringify(report));
} finally { await browser.close(); if (server) await new Promise(resolve => server.close(resolve)); }
