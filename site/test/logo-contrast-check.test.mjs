// The logo contrast check catches the 11 Nov 2026 bake-off failure: a near-black wordmark on a black panel.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const TOOL = fileURLToPath(new URL('../../marketplace/packs/shared/tools/quality/check-logo-contrast.cjs', import.meta.url));
const SITE = fileURLToPath(new URL('..', import.meta.url));
const ad = color => `<body style="margin:0"><div style="width:400px;height:500px;background:#0b0b0b;position:relative">
  <div style="position:absolute;left:24px;top:24px;font:700 40px/1 Arial;color:${color}">GEHNA</div>
  <div style="position:absolute;left:0;top:200px;width:400px;height:300px;background:#c9a96e"></div></div></body>`;

test('a wordmark that blends into its panel fails, and a readable one passes', async t => {
  let browser;
  try { browser = await chromium.launch({ chromiumSandbox: true, ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}) }); }
  catch (error) { t.skip(`Chromium is not installed: ${error.message.split('\n')[0]}`); return; }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'logo-contrast-'));
  try {
    const page = await browser.newPage({ viewport: { width: 400, height: 500 } });
    for (const [name, color] of [['dark', '#1a1a1a'], ['light', '#ffffff']]) {
      await page.setContent(ad(color));
      // Under the full parallel suite, headless Chromium sometimes cannot capture a frame. Retry only that error.
      for (let attempt = 1; ; attempt++) {
        try { await page.screenshot({ path: path.join(dir, `${name}.png`) }); break; }
        catch (error) { if (attempt === 3 || !/Unable to capture screenshot/.test(error.message)) throw error; await page.waitForTimeout(250 * attempt); }
      }
    }
  } finally { await browser.close(); }
  const run = (file, ...extra) => spawnSync(process.execPath, [TOOL, path.join(dir, file), '--box', '4%,3%,45%,12%', ...extra], { cwd: SITE, encoding: 'utf8' });

  const dark = run('dark.png');
  assert.equal(dark.status, 1, dark.stderr);
  const darkReceipt = JSON.parse(dark.stdout);
  assert.equal(darkReceipt.status, 'FAIL');
  assert.ok(darkReceipt.boxes[0].ratio < 1.5, `ratio ${darkReceipt.boxes[0].ratio}`);
  assert.match(dark.stderr, /below 3:1/);

  const light = run('light.png', '--json', path.join(dir, 'receipt.json'));
  assert.equal(light.status, 0, light.stderr);
  const receipt = JSON.parse(fs.readFileSync(path.join(dir, 'receipt.json'), 'utf8'));
  assert.equal(receipt.status, 'PASS');
  assert.ok(receipt.boxes[0].ratio > 15);
  // Anti-aliased edges pull the averaged mark colour slightly off pure white.
  assert.ok(parseInt(receipt.boxes[0].mark.slice(1, 3), 16) > 0xe0, receipt.boxes[0].mark);
  assert.match(receipt.sha256, /^[0-9a-f]{64}$/);

  // A box with no mark in it (only the gold panel) fails as missing, not as passing.
  const empty = run('light.png', '--box', '10%,60%,30%,20%');
  assert.equal(JSON.parse(empty.stdout).boxes[1].status, 'FAIL');
  assert.match(JSON.parse(empty.stdout).boxes[1].reason, /missing or blends in/);
});
