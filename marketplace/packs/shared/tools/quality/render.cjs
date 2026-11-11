#!/usr/bin/env node
// Render a local HTML file to phone and desktop full-page screenshots.
// Usage: node render.cjs <file.html> <out-prefix>
// Writes <out-prefix>-phone.png (390x844) and <out-prefix>-desktop.png (1280x800).
// Also writes readable slices: <out-prefix>-phone-1.png, -2.png ... (two screens each)
// and the same for desktop, because a very tall full-page image shrinks past legibility.
// Slice 1 of phone starts with the first phone screen.
// All requests that are not file: or data: are blocked, so the page cannot call out.
'use strict';
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

// Install Playwright in the host project before rendering.
let PW;
try { PW = require.resolve('playwright', { paths: [process.cwd(), path.join(process.cwd(), 'site'), __dirname] }); }
catch { console.error('Rendering not run: install Playwright and its Chromium browser in the host project.'); process.exit(2); }

async function main() {
  const [file, prefix] = process.argv.slice(2);
  if (!file || !prefix) {
    console.error('Usage: node render.cjs <file.html> <out-prefix>');
    process.exit(2);
  }
  const abs = path.resolve(file);
  if (!fs.existsSync(abs)) { console.error('File not found: ' + abs); process.exit(2); }
  const outPrefix = path.resolve(prefix);
  fs.mkdirSync(path.dirname(outPrefix), { recursive: true });

  const { chromium } = require(PW);
  // Use an installed browser when the host sets PW_CHANNEL (for example chrome).
  const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {});
  const blocked = new Set();
  const failed = [];
  try {
    const views = [
      { name: 'phone', width: 390, height: 844, mobile: true, scale: 1 },
      { name: 'desktop', width: 1280, height: 800, mobile: false, scale: 1 },
    ];
    for (const v of views) {
      const ctx = await browser.newContext({
        viewport: { width: v.width, height: v.height },
        deviceScaleFactor: v.scale,
        isMobile: v.mobile,
        hasTouch: v.mobile,
        serviceWorkers: 'block',
      });
      await ctx.route('**/*', (route) => {
        const u = route.request().url();
        if (u.startsWith('file:') || u.startsWith('data:')) return route.continue();
        blocked.add(u.length > 120 ? u.slice(0, 117) + '...' : u);
        return route.abort('blockedbyclient');
      });
      const page = await ctx.newPage();
      page.on('requestfailed', (r) => {
        const u = r.url();
        if (u.startsWith('file:')) failed.push(u);
      });
      await page.goto(pathToFileURL(abs).href, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(400);
      const height = await page.evaluate(() =>
        Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0)
      );
      const overflowX = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1
      );
      const out = `${outPrefix}-${v.name}.png`;
      await page.screenshot({ path: out, fullPage: true });
      const sliceH = v.height * 2;
      const slices = [];
      for (let y = 0, i = 1; y < height; y += sliceH, i++) {
        const sp = `${outPrefix}-${v.name}-${i}.png`;
        await page.screenshot({
          path: sp,
          fullPage: true,
          clip: { x: 0, y, width: v.width, height: Math.min(sliceH, height - y) },
        });
        slices.push(sp);
      }
      console.log(`${v.name}: ${out} (${v.width}px wide, page height ${height}px${overflowX ? ', HORIZONTAL OVERFLOW' : ''})`);
      console.log(`  ${slices.length} slice(s): ${outPrefix}-${v.name}-1.png .. -${slices.length}.png`);
      await ctx.close();
    }
  } finally {
    await browser.close();
  }
  if (blocked.size) {
    console.log(`blocked ${blocked.size} outside request(s):`);
    for (const u of blocked) console.log('  ' + u);
  }
  if (failed.length) {
    console.log(`missing local file(s):`);
    for (const u of new Set(failed)) console.log('  ' + u);
  }
}

main().catch((err) => {
  console.error('Render failed: ' + (err && err.message ? err.message : err));
  process.exit(1);
});
