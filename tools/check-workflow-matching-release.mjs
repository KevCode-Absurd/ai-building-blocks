import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(path.resolve('site/package.json'));
const { chromium } = require('@playwright/test');
const { unzipSync, strFromU8 } = require('fflate');
const [target, label = 'local'] = process.argv.slice(2);
let server, origin = target;
if (!/^https:/.test(target)) {
  const root = path.resolve(target);
  server = http.createServer(async (req, res) => {
    try {
      const route = new URL(req.url, 'http://localhost').pathname;
      if (route.startsWith('/api/')) { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(route === '/api/compose' ? { enabled: true } : route === '/api/auth' ? { configured: false, publishableKey: null } : { items: [], comments: [] })); return; }
      let file = path.resolve(root, '.' + decodeURIComponent(route));
      assert(file.startsWith(root + path.sep) || file === root);
      if (route === '/') file = path.join(root, 'index.html');
      else if (!path.extname(file)) file += '.html';
      const data = await fs.readFile(file);
      const types = { '.html': 'text/html', '.js': 'application/javascript', '.mjs': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
      res.setHeader('content-type', types[path.extname(file)] || 'application/octet-stream'); res.end(data);
    } catch { res.statusCode = 404; res.end('Not found'); }
  });
  await new Promise(resolve => server.listen(5197, '127.0.0.1', resolve)); origin = 'http://127.0.0.1:5197';
}
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const checks = [], errors = []; let modelCalls = 0;
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, acceptDownloads: true });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', req => { if (req.method() === 'POST' && new URL(req.url()).pathname === '/api/compose') modelCalls++; });
    await page.goto(origin + '/compose');
    const reject = page.getByRole('button', { name: 'Reject cookies', exact: true });
    if (await reject.isVisible()) await reject.click();
    await page.getByRole('tab', { name: 'Free assembly', exact: true }).click();
    for (const [goal, expected] of [
      ['i want to audit my ad of my ecommerce store', ['Pre-launch ad checker', 'Marketing claim evidence checker']],
      ['Can you please help me write a product FAQ for my ecommerce store', ['Product launch FAQ writer']],
      ['Write four welcome emails', ['Email sequence writer']],
      ['Review this video ad for my store', ['Pre-launch ad checker', 'Video ad transition review']],
    ]) {
      await page.getByTestId('compose-goal').fill(goal);
      await page.getByTestId('compose-submit').click();
      const steps = page.getByTestId('compose-steps');
      for (const text of expected) await steps.getByText(text, { exact: true }).waitFor();
      assert(!(await steps.innerText()).includes('Request deliverable drafter'));
      if (goal.startsWith('i want')) {
        const pending = page.waitForEvent('download'); await page.getByTestId('compose-download').click();
        const download = await pending, files = unzipSync(await fs.readFile(await download.path()));
        assert(files['skills/pre-launch-ad-checker/SKILL.md']); assert(files['skills/claim-and-proof-matcher/SKILL.md']);
        const plan = JSON.parse(strFromU8(files['workflow.edit.json']));
        assert.equal(plan.goal, goal); assert(plan.plan.steps.some(step => step.slug === 'pre-launch-ad-checker'));
        checks.push(`width ${width}: ad audit ZIP contains matched skills and original request`);
      }
      checks.push(`width ${width}: ${goal}`);
    }
    const goal = 'Write a travel itinerary for a three-day family trip';
    await page.getByTestId('compose-goal').fill(goal); await page.getByTestId('compose-submit').click();
    await page.getByText('NO SPECIALIST MATCH', { exact: true }).waitFor();
    assert((await page.getByTestId('compose-unmatched').innerText()).includes('Different unmatched requests produce the same steps'));
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: `reports/workflow-matching-${label}-${width}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Use AI composition for this request', exact: true }).click();
    assert.equal(await page.getByTestId('compose-goal').inputValue(), goal);
    assert.equal(await page.getByRole('tab', { name: 'AI composition', exact: true }).getAttribute('aria-selected'), 'true');
    checks.push(`width ${width}: fallback disclosed; AI option preserves request; no horizontal overflow`);
    await context.close();
  }
  assert.equal(modelCalls, 0); assert.deepEqual(errors, []);
  const report = { checkedOn: new Date().toISOString(), origin, status: 'pass', checks, passed: checks.length, modelCalls, browserErrors: errors };
  await fs.writeFile(`reports/workflow-matching-${label}-browser.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
} finally { await browser.close(); if (server) await new Promise(resolve => server.close(resolve)); }
