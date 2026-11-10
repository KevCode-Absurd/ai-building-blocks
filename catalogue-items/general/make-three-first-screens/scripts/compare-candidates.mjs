#!/usr/bin/env node
// compare-candidates.mjs (AI Blocks, make-three-first-screens) - version 1.0.0
//
// Puts 2 to 4 candidates side by side, so someone who did not make them can look and choose.
// A candidate is an HTML file, a URL, an SVG or an image (png, jpg, webp, gif, avif). It writes one folder:
//   compare-desktop.png   one sheet: every candidate at desktop width (pages at 1440 px), labelled A, B, C, D
//   compare-phone.png     one sheet: every candidate at phone width (390 px)
//   shots/<label>-*.png   each candidate on its own at full size, for a close look
//   compare.html          the same candidates side by side in live frames; opens in any browser
//   compare.json          the files above, by label. Safe to give the chooser: it never names a candidate
//   compare.key.json      which label is which candidate. Keep it from the chooser until they have picked
//
// Usage:
//   node compare-candidates.mjs <candidate> <candidate> [<candidate>] [<candidate>] [options]
//   node compare-candidates.mjs screens/one.html screens/two.html screens/three.html
//   node compare-candidates.mjs ads/one.svg ads/two.svg ads/three.png --out compare-ads
//   node compare-candidates.mjs posts/one.html posts/two.html --size 1080x1350
// Options:
//   --out <dir>        output folder (default: ./compare)
//   --size <WxH>       treat HTML and URL candidates as fixed-size designs, such as 1080x1350 for a feed post
//                      (SVGs and images use their own size unless you give this)
//   --full             capture whole pages, not only the first screen (up to 6000 px tall)
//   --shuffle          hand out the labels in a random order, so A is not always the one you made first
//   --html-only        skip the browser and write compare.html only
//   --channel <name>   browser to use: chrome, msedge or chromium (default: try bundled Chromium, then Chrome, then Edge)
//   --playwright <dir> where the playwright package is, if it is not installed in this folder
//   --wait <ms>        extra wait after load (default 1500)
//   --no-block         do not block analytics and ad tags on live pages
//
// It only looks. It does not log in, fill forms, accept cookie banners or click buy buttons. It makes no network
// calls of its own: the only requests are the candidates loading. With no Playwright or no browser it still writes
// compare.html, so a person or a browser tool can look.
// Needs Node 18+. The PNG sheets need Playwright: npm i -D playwright  (then: npx playwright install chromium, or use --channel chrome)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { randomInt } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const VERSION = '1.0.0';
const BLOCK = /googletagmanager|google-analytics|analytics\.google|doubleclick|facebook\.net|connect\.facebook|clarity\.ms|hotjar|klaviyo|tiktok\.com\/i18n|analytics\.tiktok|snap\.licdn|bat\.bing|criteo|taboola|outbrain|segment\.(?:io|com)|mixpanel|fullstory|mouseflow|luckyorange|intercomcdn|gorgias\.chat|tidio|zopim|freshchat|crisp\.chat/i;
const DESKTOP = { name: 'desktop', width: 1440, height: 900, mobile: false };
const PHONE = { name: 'phone', width: 390, height: 844, mobile: true, ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' };
export const LABELS = ['A', 'B', 'C', 'D'];
const IMAGE_EXT = /\.(?:png|jpe?g|webp|gif|avif)$/i;
const FULL_MAX = 6000;   // tallest full-page capture, in px
const DESIGN_MAX = 2400; // longest side of a fixed-size design, in px
const TILE = { desktop: 720, phone: 390 }; // how wide one candidate is drawn on each sheet

export function parseArgs(argv) {
  const o = { positional: [], out: 'compare', wait: 1500, block: true, full: false, shuffle: false, htmlOnly: false, channel: null, playwright: null, size: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') o.help = true;
    else if (a === '--out') o.out = argv[++i];
    else if (a === '--size') o.size = parseSize(argv[++i]);
    else if (a === '--channel') o.channel = argv[++i];
    else if (a === '--playwright') o.playwright = argv[++i];
    else if (a === '--wait') o.wait = Number(argv[++i]) || 0;
    else if (a === '--full') o.full = true;
    else if (a === '--shuffle') o.shuffle = true;
    else if (a === '--html-only') o.htmlOnly = true;
    else if (a === '--no-block') o.block = false;
    else if (a.startsWith('--')) throw new Error(`Unknown option ${a}. Run with --help.`);
    else o.positional.push(a);
  }
  if (!o.out) throw new Error('--out needs a folder.');
  return o;
}

export function parseSize(text) {
  const m = /^(\d{2,5})\s*[x×]\s*(\d{2,5})$/i.exec(String(text || '').trim());
  if (!m) throw new Error(`--size needs width x height in px, such as 1080x1350. Got "${text ?? ''}".`);
  return fitSize({ width: Number(m[1]), height: Number(m[2]) });
}

/** Keep a design's shape and bring its longest side down to DESIGN_MAX. */
export function fitSize(size, max = DESIGN_MAX) {
  const k = Math.min(1, max / Math.max(size.width, size.height));
  return { width: Math.max(1, Math.round(size.width * k)), height: Math.max(1, Math.round(size.height * k)) };
}

const HELP = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1).filter((l, i, all) => all.slice(0, i + 1).every((x) => x.startsWith('//'))).map((l) => l.replace(/^\/\/ ?/, '')).join('\n');

/** Find the playwright package: --playwright, this folder, the script's folder, then NODE_PATH. */
export function loadPlaywright(hint) {
  const own = createRequire(import.meta.url), names = ['playwright', 'playwright-core', '@playwright/test'], attempts = [];
  for (const h of [hint].filter(Boolean)) {
    const dir = path.resolve(h);
    attempts.push(() => own(dir)); // the package folder itself
    for (const name of names) attempts.push(() => createRequire(path.join(dir, 'noop.js'))(name)); // a project folder
  }
  for (const base of [process.cwd(), HERE]) for (const name of names) attempts.push(() => createRequire(path.join(base, 'noop.js'))(name));
  for (const name of names) attempts.push(() => own(name)); // NODE_PATH
  for (const attempt of attempts) { try { const mod = attempt(); if (mod?.chromium) return mod; } catch { /* try the next place */ } }
  return null;
}

export function playwrightHelp() {
  return [
    'Playwright is not installed, so the PNG sheets cannot be made.',
    'Install it in this project:   npm i -D playwright',
    'Then either download a browser:   npx playwright install chromium',
    'or use the Chrome you already have:   node compare-candidates.mjs <candidates> --channel chrome',
    'Already installed elsewhere? Pass   --playwright <path to node_modules/playwright>',
    'No browser for Node at all? Open compare.html in any browser, or in a browser tool. Scroll to each row, then screenshot it.',
  ].join('\n');
}

export async function launchBrowser(pw, channel) {
  const order = channel ? [channel] : [null, 'chrome', 'msedge'];
  let last;
  for (const ch of order) {
    try {
      const browser = await pw.chromium.launch({ headless: true, ...(ch && ch !== 'chromium' ? { channel: ch } : {}) });
      return { browser, channel: ch || 'chromium' };
    } catch (e) { last = e; }
  }
  throw new Error(`No browser could start (${String(last?.message || last).split('\n')[0]}). Try --channel chrome, or run: npx playwright install chromium`);
}

/** Work out what one candidate is: a page (HTML file or URL) or a fixed-size design (SVG or image). */
export function resolveCandidate(given) {
  if (/^https?:\/\//i.test(given)) {
    const p = new URL(given).pathname;
    return { given, href: given, local: null, type: /\.svg$/i.test(p) ? 'svg' : IMAGE_EXT.test(p) ? 'image' : 'url' };
  }
  const file = path.resolve(given);
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) throw new Error(`"${given}" is not a URL and no such file exists.`);
  const type = /\.html?$/i.test(file) ? 'html' : /\.svg$/i.test(file) ? 'svg' : IMAGE_EXT.test(file) ? 'image' : null;
  if (!type) throw new Error(`"${given}" is not an HTML file, an SVG or an image (png, jpg, webp, gif, avif).`);
  return { given, href: pathToFileURL(file).href, local: file, type };
}

/** The size an SVG asks for: its width and height in px, or else its viewBox. */
export function svgSize(text) {
  const tag = /<svg\b[^>]*>/i.exec(String(text || ''))?.[0] || '';
  const num = (name) => { const m = new RegExp(`\\s${name}\\s*=\\s*["']\\s*([\\d.]+)(?:px)?\\s*["']`, 'i').exec(tag); return m ? Number(m[1]) : null; };
  let w = num('width'), h = num('height');
  const vb = /\sviewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(tag);
  if ((!w || !h) && vb) {
    const vw = Number(vb[1]), vh = Number(vb[2]);
    if (w && !h) h = (w * vh) / vw; else if (h && !w) w = (h * vw) / vh; else { w = vw; h = vh; }
  }
  return w && h ? { width: Math.round(w), height: Math.round(h) } : null;
}

/** Labels in the order given, or in a random order with --shuffle. Returns the candidates with a label each, sorted A to D. */
export function assignLabels(candidates, shuffle = false) {
  const order = candidates.map((_, i) => i);
  if (shuffle) for (let i = order.length - 1; i > 0; i--) { const j = randomInt(i + 1); [order[i], order[j]] = [order[j], order[i]]; }
  return order.map((from, i) => ({ ...candidates[from], label: LABELS[i] }));
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const posix = (p) => p.split(path.sep).join('/');

/** How compare.html (which sits in outDir) reaches a candidate: a relative path when it can, else the full address. */
export function linkFrom(outDir, c) {
  if (!c.local) return c.href;
  const rel = path.relative(outDir, c.local);
  return path.isAbsolute(rel) || /^[a-z]:/i.test(rel) ? c.href : posix(rel).split('/').map((s) => (s === '..' ? s : encodeURIComponent(s))).join('/');
}

const SHEET_CSS = `
  body{margin:0;background:#EDEDED;font:16px/1.35 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;color:#111}
  #sheet{display:inline-block;padding:24px;background:#EDEDED}
  h1{font-size:15px;font-weight:600;margin:0 0 6px;color:#333}
  p.how{font-size:13px;margin:0 0 18px;color:#555}
  h2{font-size:14px;font-weight:600;margin:28px 0 12px;color:#333}
  .grid{display:grid;gap:24px;align-items:start;justify-content:start}
  .tile{background:#fff;border:1px solid #BDBDBD}
  .tag{font-size:26px;font-weight:700;line-height:1;padding:10px 14px;background:#111;color:#fff}
  .tile img{display:block}
  .frame{overflow:hidden;background:#fff}
  .frame iframe{border:0;transform-origin:0 0;background:#fff}
  .fail{padding:36px 14px;font-size:14px;color:#8A1F1F}
`;
const cols = (n) => (n <= 3 ? n : 2);

/** compare.html: every candidate side by side in live frames, at desktop and at phone width. Needs no browser to write. */
export function compareHtml(candidates, outDir, opts = {}) {
  const tile = (c, view) => {
    const src = esc(linkFrom(outDir, c)), W = TILE[view];
    if (c.type === 'svg' || c.type === 'image') {
      const w = Math.min(W, (opts.size || c.size)?.width || W);
      return `<div class="tile"><div class="tag">${c.label}</div><img src="${src}" alt="Candidate ${c.label}" style="width:${w}px;height:auto"></div>`;
    }
    const vp = opts.size || (view === 'desktop' ? DESKTOP : PHONE), k = Math.min(1, W / vp.width);
    return `<div class="tile"><div class="tag">${c.label}</div><div class="frame" style="width:${Math.round(vp.width * k)}px;height:${Math.round(vp.height * k)}px">`
      + `<iframe src="${src}" title="Candidate ${c.label}" sandbox="allow-scripts allow-same-origin" style="width:${vp.width}px;height:${vp.height}px;transform:scale(${+k.toFixed(4)})"></iframe></div></div>`;
  };
  const row = (view) => `<div class="grid" style="grid-template-columns:repeat(${view === 'desktop' ? cols(candidates.length) : candidates.length},max-content)">${candidates.map((c) => tile(c, view)).join('')}</div>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Compare candidates</title><style>${SHEET_CSS}</style></head><body><div id="sheet">
<h1>Candidates ${candidates.map((c) => c.label).join(', ')}, side by side</h1>
<p class="how">The labels are neutral. Judge what you see. Scroll each row into view before you screenshot it: a browser may leave a frame blank while it is off screen. If a frame stays blank when you can see it, that site does not allow framing, so screenshot that candidate on its own.</p>
<h2>Desktop width${opts.size ? '' : ' (pages 1440 px wide, drawn at half size)'}</h2>
${row('desktop')}
<h2>Phone width (390 px)</h2>
${row('phone')}
</div></body></html>
`;
}

/** One static sheet built from the saved shots, ready to screenshot. */
export function sheetHtml(candidates, view) {
  const W = TILE[view];
  const tile = (c) => {
    const shot = c.shots?.[view];
    if (!shot) return `<div class="tile"><div class="tag">${c.label}</div><div class="fail" style="width:${W - 28}px">Candidate ${c.label} could not be shown: ${esc(c.error || 'no capture')}</div></div>`;
    const w = c.kind === 'design' ? Math.min(W, c.size?.width || W) : W;
    return `<div class="tile"><div class="tag">${c.label}</div><img src="${esc(shot)}" alt="Candidate ${c.label}" style="width:${w}px;height:auto"></div>`;
  };
  const head = view === 'desktop' ? 'Desktop view. Pages are 1440 px wide, drawn at half size. Designs are drawn up to 720 px wide.' : 'Phone view. Pages are 390 px wide. Designs are drawn 390 px wide, as in a phone feed.';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>${SHEET_CSS}</style></head><body><div id="sheet"><h1>${head}</h1><p class="how">The labels are neutral. Judge what you see.</p>`
    + `<div class="grid" style="grid-template-columns:repeat(${view === 'desktop' ? cols(candidates.length) : candidates.length},max-content)">${candidates.map(tile).join('')}</div></div></body></html>\n`;
}

async function openPage(browser, vp, block) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, isMobile: !!vp.mobile, hasTouch: !!vp.mobile, locale: 'en-US', ...(vp.ua ? { userAgent: vp.ua } : {}) });
  if (block) await ctx.route('**/*', (r) => (BLOCK.test(r.request().url()) ? r.abort() : r.continue()));
  return { ctx, page: await ctx.newPage() };
}

/** Load a page the way a visitor first sees it: wait, close pop-ups with Escape. With --full, scroll so lazy images load. */
async function settle(page, url, { wait, full }) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(wait);
  await page.keyboard.press('Escape').catch(() => {});
  if (full) {
    await page.evaluate(async () => {
      const step = Math.max(400, Math.round(innerHeight * 0.8));
      for (let y = 0, n = 0; y < Math.min(document.documentElement.scrollHeight, 12000) && n < 40; y += step, n++) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      scrollTo(0, 0);
    }).catch(() => {});
    await page.waitForTimeout(400);
  }
}

/** A page candidate: one shot at desktop width and one at phone width. */
async function shootPage(browser, c, { shotsDir, outDir, wait, block, full }) {
  c.kind = 'page'; c.shots = {};
  for (const vp of [DESKTOP, PHONE]) {
    const { ctx, page } = await openPage(browser, vp, block);
    try {
      await settle(page, c.href, { wait, full });
      const file = path.join(shotsDir, `${c.label}-${vp.name}.png`);
      if (full) {
        const h = await page.evaluate(() => Math.max(document.documentElement.scrollHeight, innerHeight));
        await page.screenshot({ path: file, fullPage: true, clip: { x: 0, y: 0, width: vp.width, height: Math.min(h, FULL_MAX) }, timeout: 60000 });
      } else await page.screenshot({ path: file });
      c.shots[vp.name] = posix(path.relative(outDir, file));
    } finally { await ctx.close(); }
  }
}

/** A design candidate (SVG, image, or a page with --size): one shot at its own size, used on both sheets. */
async function shootDesign(browser, c, { shotsDir, outDir, wait, block, size }) {
  c.kind = 'design'; c.shots = {};
  const file = path.join(shotsDir, `${c.label}.png`);
  if (c.type === 'html' || c.type === 'url') {
    const { ctx, page } = await openPage(browser, size, block);
    try { await settle(page, c.href, { wait, full: false }); await page.screenshot({ path: file }); c.size = size; } finally { await ctx.close(); }
  } else {
    // Draw the SVG or image through a small local page, so it is measured and shown the same way every time.
    const wrap = path.join(outDir, '.candidate-frame.html');
    fs.writeFileSync(wrap, `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#fff"><img id="c" src="${esc(c.href)}" style="display:block"></body>`);
    const { ctx, page } = await openPage(browser, { width: 1200, height: 1200 }, block && !c.local);
    try {
      await page.goto(pathToFileURL(wrap).href, { waitUntil: 'load', timeout: 60000 });
      const nat = await page.evaluate(async () => { const i = document.getElementById('c'); try { await i.decode(); } catch { /* reported below */ } return { width: i.naturalWidth, height: i.naturalHeight }; });
      if (!nat.width || !nat.height) throw new Error('the file did not load as an image');
      const own = c.type === 'svg' && c.local ? svgSize(fs.readFileSync(c.local, 'utf8')) : null;
      c.size = size || fitSize(own || nat);
      await page.setViewportSize(c.size);
      await page.evaluate(({ width, height }) => { const i = document.getElementById('c'); i.style.width = width + 'px'; i.style.height = height + 'px'; i.style.objectFit = 'contain'; }, c.size);
      await page.waitForTimeout(150);
      await page.screenshot({ path: file, clip: { x: 0, y: 0, ...c.size } });
    } finally { await ctx.close(); fs.rmSync(wrap, { force: true }); }
  }
  const rel = posix(path.relative(outDir, file));
  c.shots = { desktop: rel, phone: rel };
}

async function shootSheet(browser, candidates, view, outDir) {
  const tmp = path.join(outDir, `.sheet-${view}.html`), file = path.join(outDir, `compare-${view}.png`);
  fs.writeFileSync(tmp, sheetHtml(candidates, view));
  const { ctx, page } = await openPage(browser, { width: 3400, height: 1200 }, false);
  try {
    await page.goto(pathToFileURL(tmp).href, { waitUntil: 'load', timeout: 60000 });
    await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
    await page.locator('#sheet').screenshot({ path: file, timeout: 60000 });
  } finally { await ctx.close(); fs.rmSync(tmp, { force: true }); }
  return path.basename(file);
}

export async function main(argv = process.argv.slice(2)) {
  let o;
  try { o = parseArgs(argv); } catch (e) { console.error(e.message); return 2; }
  if (o.help || !o.positional.length) { console.log(HELP); return o.help ? 0 : 2; }
  if (o.positional.length < 2 || o.positional.length > LABELS.length) { console.error(`Give 2 to ${LABELS.length} candidates. Got ${o.positional.length}.`); return 2; }
  let candidates;
  try { candidates = assignLabels(o.positional.map(resolveCandidate), o.shuffle); } catch (e) { console.error(e.message); return 2; }
  const outDir = path.resolve(o.out), shotsDir = path.join(outDir, 'shots');
  fs.mkdirSync(outDir, { recursive: true });
  if (fs.existsSync(shotsDir)) for (const f of fs.readdirSync(shotsDir)) if (/^[A-D](?:-desktop|-phone)?\.png$/.test(f)) fs.rmSync(path.join(shotsDir, f), { force: true });
  for (const f of ['compare-desktop.png', 'compare-phone.png']) fs.rmSync(path.join(outDir, f), { force: true });

  const notes = [];
  let browser = null, channel = null;
  if (!o.htmlOnly) {
    const pw = loadPlaywright(o.playwright);
    if (!pw) { console.error(playwrightHelp()); notes.push('Playwright was not found, so no PNG sheets were made.'); }
    else ({ browser, channel } = await launchBrowser(pw, o.channel).catch((e) => { console.error(e.message); notes.push('No browser could start, so no PNG sheets were made.'); return {}; }));
  } else notes.push('Run with --html-only, so no PNG sheets were made.');

  let sheets = null;
  if (browser) {
    fs.mkdirSync(shotsDir, { recursive: true });
    console.log(`Comparing ${candidates.length} candidates with ${channel}:`);
    try {
      for (const c of candidates) {
        const design = c.type === 'svg' || c.type === 'image' || !!o.size;
        try {
          await (design ? shootDesign : shootPage)(browser, c, { shotsDir, outDir, wait: o.wait, block: o.block, full: o.full, size: o.size });
          console.log(`  ok   ${c.label}  ${c.kind}${c.size ? ` ${c.size.width}x${c.size.height}` : ''}`);
        } catch (e) {
          c.kind = c.kind || (design ? 'design' : 'page'); c.shots = {}; c.error = String(e.message || e).split('\n')[0];
          notes.push(`${c.label} could not be captured: ${c.error}`);
          console.log(`  fail ${c.label}  ${c.error}`);
        }
      }
      if (candidates.some((c) => c.shots?.desktop)) sheets = { desktop: await shootSheet(browser, candidates, 'desktop', outDir), phone: await shootSheet(browser, candidates, 'phone', outDir) };
    } finally { await browser.close(); }
  } else for (const c of candidates) { c.kind = c.type === 'svg' || c.type === 'image' || o.size ? 'design' : 'page'; c.shots = null; if (o.size) c.size = o.size; }

  fs.writeFileSync(path.join(outDir, 'compare.html'), compareHtml(candidates, outDir, { size: o.size }));
  const out = {
    schema: 'ai-blocks-compare/1', tool: `compare-candidates.mjs ${VERSION}`, made_at: new Date().toISOString(),
    mode: sheets ? 'sheets' : 'html-only', browser: sheets ? channel : null, labels: candidates.map((c) => c.label),
    sheets, html: 'compare.html', key: 'compare.key.json',
    candidates: candidates.map((c) => ({ label: c.label, kind: c.kind, ...(c.size ? { size: `${c.size.width}x${c.size.height}` } : {}), shots: c.shots && Object.keys(c.shots).length ? c.shots : null, ...(c.error ? { error: c.error } : {}) })),
    notes,
  };
  fs.writeFileSync(path.join(outDir, 'compare.json'), JSON.stringify(out, null, 1) + '\n');
  fs.writeFileSync(path.join(outDir, 'compare.key.json'), JSON.stringify({ note: 'Which label is which candidate. Keep this from the chooser until they have picked.', shuffled: o.shuffle, candidates: candidates.map((c) => ({ label: c.label, source: c.given })) }, null, 1) + '\n');

  const where = posix(path.relative(process.cwd(), outDir)) || '.';
  if (sheets) console.log(`\nWrote ${where}/compare-desktop.png and ${where}/compare-phone.png, with each candidate on its own in ${where}/shots/.`);
  else console.log(`\nNo PNG sheets were made. Wrote ${where}/compare.html: open it in a browser or a browser tool to see the candidates side by side.`);
  console.log(`Give the chooser ${sheets ? 'the two sheets' : 'the view of compare.html'}. Keep ${where}/compare.key.json back until they have picked.`);
  const failed = candidates.filter((c) => c.error).length;
  if (failed) console.log(`${failed} candidate(s) could not be captured. Check the file or address, then run again.`);
  return failed && candidates.length - failed < 2 ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((code) => { process.exitCode = code; }, (e) => { console.error(e?.stack || e); process.exitCode = 1; });
}
