#!/usr/bin/env node
// Check that a logo or wordmark placed on an ad image can actually be seen.
// Usage: node check-logo-contrast.cjs <ad.png|jpg|webp> --box x,y,w,h [--box ...] [--min 3] [--json out.json]
// A box is where the logo sits, in pixels or percent of the image ("4%,4%,30%,10%"). Inside each box the pixels are
// split into mark and background by brightness (Otsu); the smaller group is the mark. The WCAG contrast ratio of the
// two group colours must reach --min (default 3, the WCAG bar for logos-as-graphics and large text).
// Exit 0 when every box passes, 1 when one fails, 2 when the check could not run. The receipt names the file hash.
// Why: in the 11 Nov 2026 ad bake-off a black wordmark on black panels was invisible and judges marked those ads down.
'use strict';
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

let PW;
try { PW = require.resolve('playwright', { paths: [process.cwd(), path.join(process.cwd(), 'site'), __dirname] }); }
catch { console.error('Logo check not run: install Playwright and its Chromium browser in the host project.'); process.exit(2); }

function parseArgs(argv) {
  const out = { file: null, boxes: [], min: 3, json: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--box') out.boxes.push(argv[++i]);
    else if (a === '--min') out.min = Number(argv[++i]);
    else if (a === '--json') out.json = argv[++i];
    else if (!out.file) out.file = a;
  }
  return out;
}

function resolveBox(spec, width, height) {
  const parts = String(spec ?? '').split(',').map(s => s.trim());
  if (parts.length !== 4) throw new Error(`A box is x,y,w,h: got "${spec}"`);
  const [x, y, w, h] = parts.map((p, i) => {
    const n = Number(p.replace('%', ''));
    if (!Number.isFinite(n) || n < 0) throw new Error(`Box value "${p}" is not a number`);
    return Math.round(p.endsWith('%') ? (n / 100) * (i % 2 === 0 ? width : height) : n);
  });
  const box = { x: Math.min(x, width - 1), y: Math.min(y, height - 1) };
  box.w = Math.max(1, Math.min(w, width - box.x)); box.h = Math.max(1, Math.min(h, height - box.y));
  return box;
}

const channel = v => { const c = v / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const luminance = ([r, g, b]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const ratio = (a, b) => { const [hi, lo] = [luminance(a), luminance(b)].sort((m, n) => n - m); return (hi + 0.05) / (lo + 0.05); };
const hex = c => '#' + c.map(v => Math.round(v).toString(16).padStart(2, '0')).join('');

/** Split pixels into two brightness groups with Otsu's threshold; the smaller group is the mark. */
function analyse(rgba) {
  const n = rgba.length / 4, hist = new Array(256).fill(0), lum = new Uint8Array(n);
  for (let i = 0; i < n; i++) {
    const a = rgba[i * 4 + 3] / 255;
    // Transparent pixels count as white paper; ads are flattened images, so this is rare.
    const px = [0, 1, 2].map(k => rgba[i * 4 + k] * a + 255 * (1 - a));
    lum[i] = Math.round(255 * Math.sqrt(luminance(px)));
    hist[lum[i]]++;
  }
  let sum = 0; for (let t = 0; t < 256; t++) sum += t * hist[t];
  let sumB = 0, wB = 0, best = 0, threshold = 127;
  for (let t = 0; t < 256; t++) {
    wB += hist[t]; if (!wB) continue;
    const wF = n - wB; if (!wF) break;
    sumB += t * hist[t];
    const between = wB * wF * ((sumB / wB) - ((sum - sumB) / wF)) ** 2;
    if (between > best) { best = between; threshold = t; }
  }
  const groups = [[0, 0, 0, 0], [0, 0, 0, 0]];
  for (let i = 0; i < n; i++) {
    const g = groups[lum[i] > threshold ? 1 : 0];
    for (let k = 0; k < 3; k++) g[k] += rgba[i * 4 + k];
    g[3]++;
  }
  const [dark, light] = groups.map(g => g[3] ? [g[0] / g[3], g[1] / g[3], g[2] / g[3]] : null);
  const darkShare = groups[0][3] / n;
  if (!dark || !light) return { mark: hex(dark ?? light), background: hex(dark ?? light), mark_share: 0, ratio: 1 };
  const markIsDark = darkShare <= 0.5;
  return { mark: hex(markIsDark ? dark : light), background: hex(markIsDark ? light : dark), mark_share: Math.round(1000 * (markIsDark ? darkShare : 1 - darkShare)) / 1000, ratio: Math.round(100 * ratio(dark, light)) / 100 };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.file || !args.boxes.length || !(args.min > 1)) {
    console.error('Usage: node check-logo-contrast.cjs <ad image> --box x,y,w,h [--box ...] [--min 3] [--json out.json]');
    process.exit(2);
  }
  const abs = path.resolve(args.file);
  if (!fs.existsSync(abs)) { console.error('File not found: ' + abs); process.exit(2); }
  const bytes = fs.readFileSync(abs), ext = path.extname(abs).slice(1).toLowerCase();
  const type = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', gif: 'image/gif' }[ext];
  if (!type) { console.error('Use a PNG, JPEG, WebP or GIF image.'); process.exit(2); }

  const { chromium } = require(PW);
  const browser = await chromium.launch(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {});
  try {
    const page = await browser.newPage();
    await page.route('**/*', route => (route.request().url().startsWith('data:') ? route.continue() : route.abort()));
    await page.setContent('<canvas id="c"></canvas>');
    const size = await page.evaluate(async src => {
      const img = new Image(); img.src = src; await img.decode();
      const c = document.getElementById('c'); c.width = img.naturalWidth; c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      return { width: img.naturalWidth, height: img.naturalHeight };
    }, `data:${type};base64,${bytes.toString('base64')}`);
    const results = [];
    for (const spec of args.boxes) {
      const box = resolveBox(spec, size.width, size.height);
      const rgba = await page.evaluate(({ x, y, w, h }) => Array.from(document.getElementById('c').getContext('2d').getImageData(x, y, w, h).data), box);
      const found = analyse(rgba);
      // A box that is almost one colour holds no visible mark at all.
      const visible = found.mark_share >= 0.01;
      results.push({ box: spec, pixels: box, ...found, status: visible && found.ratio >= args.min ? 'PASS' : 'FAIL', ...(visible ? {} : { reason: 'No mark stands out in this box: the logo is missing or blends in.' }) });
    }
    const receipt = { tool: 'check-logo-contrast', file: path.basename(abs), sha256: crypto.createHash('sha256').update(bytes).digest('hex'), image: size, min_ratio: args.min, boxes: results, status: results.every(r => r.status === 'PASS') ? 'PASS' : 'FAIL' };
    if (args.json) fs.writeFileSync(path.resolve(args.json), JSON.stringify(receipt, null, 2) + '\n');
    console.log(JSON.stringify(receipt, null, 2));
    for (const r of results.filter(row => row.status === 'FAIL')) console.error(`FAIL ${r.box}: ${r.reason ?? `mark ${r.mark} on ${r.background} is ${r.ratio}:1, below ${args.min}:1. Use the light or dark logo version, or put it on a calmer area.`}`);
    process.exitCode = receipt.status === 'PASS' ? 0 : 1;
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error('Logo check not run: ' + error.message); process.exit(2); });
