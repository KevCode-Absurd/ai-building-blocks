import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {checkBudgets, entryFiles, missingScriptHashes, BUDGETS} from '../scripts/byte-budgets.mjs';
import {runUptime, checks} from '../scripts/uptime-check.mjs';

function fakeDist() {
  const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'budgets-'));
  fs.mkdirSync(path.join(dist, 'assets')); fs.mkdirSync(path.join(dist, 'data/items'), {recursive: true});
  fs.writeFileSync(path.join(dist, 'index.html'), '<script type="module" crossorigin src="/assets/index-a1.js"></script><link rel="stylesheet" crossorigin href="/assets/index-b2.css">');
  fs.writeFileSync(path.join(dist, 'assets/index-a1.js'), 'x'.repeat(1000));
  fs.writeFileSync(path.join(dist, 'assets/index-b2.css'), 'y'.repeat(500));
  fs.writeFileSync(path.join(dist, 'data/blocks.json'), '{}');
  fs.writeFileSync(path.join(dist, 'data/items/small.json'), '{}');
  fs.writeFileSync(path.join(dist, 'data/items/big.json'), 'z'.repeat(300));
  return dist;
}

test('byte budgets measure the entry code, styles and the largest per-route data file', () => {
  const dist = fakeDist();
  try {
    assert.deepEqual(entryFiles(dist), {script: ['/assets/index-a1.js'], style: ['/assets/index-b2.css']});
    const budgets = [['js', {entry: 'script'}, 1000], ['css', {entry: 'style'}, 499], ['cat', {dir: 'data', pattern: /^blocks(\.[\w-]+)?\.json$/}, 10], ['item', {dir: 'data/items', pattern: /\.json$/}, 300], ['gone', {file: 'data/none.json'}, 10]];
    const {ok, rows} = checkBudgets(dist, budgets);
    assert.equal(ok, false);
    assert.deepEqual(rows.map(r => [r.name, r.ok]), [['js', true], ['css', false], ['cat', true], ['item', true], ['gone', false]]);
    assert.equal(rows[0].bytes, 1000); assert.ok(rows[0].brotli > 0 && rows[0].brotli < 1000);
    assert.deepEqual(rows[3].files, ['/data/items/big.json']);
    assert.match(rows[4].error, /missing/);
  } finally { fs.rmSync(dist, {recursive: true, force: true}); }
});

test('the gate lists inline scripts in built pages whose hash the report-only policy is missing', () => {
  const dist = fakeDist();
  try {
    const known = 'document.documentElement.dataset.theme = "dark";', added = 'updateShellTheme();';
    const sha = code => createHash('sha256').update(code).digest('base64');
    fs.writeFileSync(path.join(dist, 'index.html'), `<script>${known}</script><script type="application/ld+json">{}</script><script src="/a.js"></script><script>${added}</script>`);
    fs.mkdirSync(path.join(dist, 'skills')); fs.writeFileSync(path.join(dist, 'skills/a.html'), `<script>${known}</script>`);
    fs.writeFileSync(path.join(dist, '_headers'), `/*
  Content-Security-Policy-Report-Only: script-src 'self' 'sha256-${sha(known)}'; report-uri /api/client-error
`);
    assert.deepEqual(missingScriptHashes(dist), {checked: 3, missing: [{page: 'index.html', hash: `'sha256-${sha(added)}'`}]});
  } finally { fs.rmSync(dist, {recursive: true, force: true}); }
});

test('every budget is a real number of bytes and the gate runs after the production build', async () => {
  for (const [name, , budget] of BUDGETS) assert.ok(Number.isInteger(budget) && budget > 0, name);
  const {gateSteps} = await import('../../tools/release.mjs');
  const names = gateSteps.map(step => step[0]);
  assert.equal(names.indexOf('Byte budgets'), names.indexOf('Production build') + 1);
});

test('the uptime check reads home, an item page, API status and MCP, and fails on any bad answer', async () => {
  assert.deepEqual(checks().map(c => c.path), ['/', '/skills/website-brand-brain-builder', '/api/v1/status', '/mcp']);
  const healthy = async (url, init) => {
    const p = new URL(url).pathname;
    if (p === '/') return new Response('<title>AI Blocks</title>', {headers: {'content-type': 'text/html'}});
    if (p === '/api/v1/status') return Response.json({model_calls: false});
    if (p === '/mcp') { assert.equal(init.method, 'POST'); return Response.json({result: {tools: [{name: 'get_item'}]}}); }
    return new Response('<h1>Item</h1>', {headers: {'content-type': 'text/html'}});
  };
  const good = await runUptime({fetcher: healthy});
  assert.equal(good.ok, true); assert.equal(good.results.length, 4);
  const down = await runUptime({fetcher: async (url, init) => new URL(url).pathname === '/mcp' ? new Response('no', {status: 503}) : healthy(url, init)});
  assert.equal(down.ok, false); assert.deepEqual(down.results.filter(r => !r.ok).map(r => [r.name, r.status]), [['mcp', 503]]);
  const offline = await runUptime({fetcher: async () => { throw new TypeError('fetch failed'); }});
  assert.equal(offline.ok, false); assert.ok(offline.results.every(r => r.status === 0 && r.error === 'TypeError'));
});
