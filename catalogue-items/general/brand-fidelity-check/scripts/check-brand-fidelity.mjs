#!/usr/bin/env node
// check-brand-fidelity.mjs (AI Blocks, brand-fidelity-check) - version 1.0.0
//
// Checks a candidate page (a local HTML file or a URL) against a brand capture made by capture-brand-dna.mjs
// (or a JSON saved from brand-dna-snippet.js). It runs the same snippet on the candidate at 1440 and 390 px and
// reports pass or fail on eight checks:
//   fonts      brand fonts loaded and used for the same roles (h1, h2, body, button, nav, price)
//   palette    colours within tolerance; area-share drift flagged (an accent that grows, a main surface that shrinks)
//   buttons    primary button radius, case and fill match
//   chrome     nav and footer present, with item overlap
//   placeholders  no lorem, TODO, "placeholder", [brackets], "to shoot", XX prices or unfilled {{tokens}}
//   facts      prices and review numbers match the capture, or the page carries a fresher facts date
//   mobile     works at 390 px with no horizontal scroll
//   action     the primary action is a real link or button
// It also saves side-by-side screenshots (live vs candidate, desktop and mobile) and a prompt for a
// fresh-context visual review, because a model that built the page should not grade its own look.
//
// Usage:
//   node check-brand-fidelity.mjs --brand context/brand-dna.json --page build/index.html
//   node check-brand-fidelity.mjs --brand context/brand-dna.json --page https://staging.example.com/landing
// Options:
//   --brand-page <path>  which captured page to compare with (default: the one with the same path, else the first)
//   --out <dir>          where the report and screenshots go (default: context/fidelity)
//   --tolerance <n>      colour distance allowed, in delta E (default 12)
//   --channel <name>     chrome, msedge or chromium (default: try bundled Chromium, then Chrome, then Edge)
//   --playwright <dir>   where the playwright package is, if it is not installed in this folder
//   --no-block           do not block analytics and ad tags
// Exit code: 0 all checks pass, 1 a check failed, 2 the check could not run.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const VERSION = '1.0.0';
const BLOCK = /googletagmanager|google-analytics|analytics\.google|doubleclick|facebook\.net|connect\.facebook|clarity\.ms|hotjar|klaviyo|analytics\.tiktok|bat\.bing|criteo|segment\.(?:io|com)|mixpanel|fullstory|intercomcdn|gorgias\.chat|tidio|zopim|crisp\.chat/i;
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true, ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' },
];
const ROLES = ['h1', 'h2', 'body', 'button', 'nav', 'price'];
const SYSTEM_FONTS = /^(arial|helvetica|helvetica neue|georgia|times|times new roman|system-ui|-apple-system|blinkmacsystemfont|segoe ui|roboto|sans-serif|serif|monospace|verdana|tahoma|ui-sans-serif|ui-serif)$/i;

// ---------- arguments ----------
function parseArgs(argv) {
  const o = { out: 'context/fidelity', tolerance: 12, block: true };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], v = () => argv[++i];
    if (a === '--help' || a === '-h') o.help = true;
    else if (a === '--brand') o.brand = v();
    else if (a === '--page') o.page = v();
    else if (a === '--brand-page') o.brandPage = v();
    else if (a === '--out') o.out = v();
    else if (a === '--tolerance') o.tolerance = Number(v()) || 12;
    else if (a === '--channel') o.channel = v();
    else if (a === '--playwright') o.playwright = v();
    else if (a === '--no-block') o.block = false;
    else throw new Error(`Unknown option ${a}. Run with --help.`);
  }
  return o;
}
const HELP = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).slice(0, 30).map((l) => l.replace(/^\/\/ ?/, '')).join('\n');

// ---------- browser ----------
function loadPlaywright(hint) {
  const own = createRequire(import.meta.url), names = ['playwright', 'playwright-core', '@playwright/test'], attempts = [];
  for (const h of [hint].filter(Boolean)) {
    const dir = path.resolve(h);
    attempts.push(() => own(dir));
    for (const name of names) attempts.push(() => createRequire(path.join(dir, 'noop.js'))(name));
  }
  for (const base of [process.cwd(), HERE]) for (const name of names) attempts.push(() => createRequire(path.join(base, 'noop.js'))(name));
  for (const name of names) attempts.push(() => own(name));
  for (const attempt of attempts) { try { const mod = attempt(); if (mod?.chromium) return mod; } catch { /* next */ } }
  return null;
}
async function launchBrowser(pw, channel) {
  let last;
  for (const ch of channel ? [channel] : [null, 'chrome', 'msedge']) {
    try { return { browser: await pw.chromium.launch({ headless: true, ...(ch && ch !== 'chromium' ? { channel: ch } : {}) }), channel: ch || 'chromium' }; } catch (e) { last = e; }
  }
  throw new Error(`No browser could start (${String(last?.message || last).split('\n')[0]}). Try --channel chrome, or run: npx playwright install chromium`);
}
function readSnippet() {
  const spots = [path.join(HERE, 'brand-dna-snippet.js'), path.join(HERE, '..', '..', 'brand-dna-capture', 'scripts', 'brand-dna-snippet.js'), path.join(process.cwd(), 'tools', 'brand-dna-snippet.js')];
  const found = spots.filter((f) => fs.existsSync(f));
  if (!found.length) throw new Error('brand-dna-snippet.js was not found. Put it next to this script (it ships with the brand-dna-capture skill).');
  const texts = found.map((f) => fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'));
  if (texts.some((t) => t !== texts[0])) console.warn('Note: two copies of brand-dna-snippet.js differ; using ' + found[0] + '. Recapture the brand with the same version.');
  return texts[0];
}
async function newContext(browser, vp, block) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, isMobile: vp.mobile, hasTouch: vp.mobile, bypassCSP: true, locale: 'en-US', ...(vp.ua ? { userAgent: vp.ua } : {}) });
  if (block) await ctx.route('**/*', (r) => (BLOCK.test(r.request().url()) ? r.abort() : r.continue()));
  return ctx;
}
async function preparePage(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(1500);
  await page.keyboard.press('Escape').catch(() => {});
  await page.evaluate(async () => {
    const step = Math.max(400, Math.round(innerHeight * 0.8));
    for (let y = 0, n = 0; y < Math.min(document.documentElement.scrollHeight, 40000) && n < 80; y += step, n++) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
    scrollTo(0, 0);
  }).catch(() => {});
  await page.waitForTimeout(700);
}

// ---------- colour ----------
const hexToRgb = (h) => { const m = /^#?([0-9a-f]{6})/i.exec(String(h || '')); if (!m) return null; const n = parseInt(m[1], 16); return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }; };
const rgbToHex = (c) => '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
function lab(c) {
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const r = lin(c.r), g = lin(c.g), b = lin(c.b);
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047, y = r * 0.2126 + g * 0.7152 + b * 0.0722, z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}
const deltaE = (a, b) => { const A = typeof a === 'string' ? hexToRgb(a) : a, B = typeof b === 'string' ? hexToRgb(b) : b; if (!A || !B) return 999; const p = lab(A), q = lab(B); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };
const neutral = (h) => { const c = hexToRgb(h); if (!c) return true; const mx = Math.max(c.r, c.g, c.b), mn = Math.min(c.r, c.g, c.b); return mx - mn < 18; };
const pct = (n) => `${Math.round((n || 0) * 1000) / 10}%`;

async function pixelPalette(browser, file, rects) {
  const page = await browser.newPage();
  try {
    const dataUrl = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
    const res = await page.evaluate(async ({ dataUrl, rects }) => {
      const img = new Image(); img.src = dataUrl; await img.decode();
      const W = Math.min(480, img.width), k = W / img.width, H = Math.max(1, Math.round(img.height * k));
      const c = document.createElement('canvas'); c.width = W; c.height = H; const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, W, H);
      const d = ctx.getImageData(0, 0, W, H).data, mask = new Uint8Array(W * H);
      for (const [x, y, w, h] of rects || []) { const x0 = Math.max(0, Math.floor(x * k)), x1 = Math.min(W, Math.ceil((x + w) * k)), y0 = Math.max(0, Math.floor(y * k)), y1 = Math.min(H, Math.ceil((y + h) * k)); for (let yy = y0; yy < y1; yy++) mask.fill(1, yy * W + x0, yy * W + x1); }
      const bins = new Map(); let image = 0;
      for (let i = 0, p = 0; i < d.length; i += 4, p++) { if (mask[p]) { image++; continue; } const key = ((d[i] >> 3) << 10) | ((d[i + 1] >> 3) << 5) | (d[i + 2] >> 3); const e = bins.get(key) || [0, 0, 0, 0]; e[0]++; e[1] += d[i]; e[2] += d[i + 1]; e[3] += d[i + 2]; bins.set(key, e); }
      return { total: W * H, image, top: [...bins.values()].sort((a, b) => b[0] - a[0]).slice(0, 300).map((e) => ({ n: e[0], r: e[1] / e[0], g: e[2] / e[0], b: e[3] / e[0] })) };
    }, { dataUrl, rects });
    const clusters = [];
    for (const e of res.top) { const hit = clusters.find((c) => deltaE(c.c, e) < 6); if (hit) hit.n += e.n; else clusters.push({ c: { r: e.r, g: e.g, b: e.b }, n: e.n }); }
    return { method: 'screenshot pixels, photos and videos counted as image', image_share: +(res.image / res.total).toFixed(4), colors: clusters.sort((a, b) => b.n - a.n).filter((c) => c.n / res.total >= 0.002).slice(0, 14).map((c) => ({ hex: rgbToHex(c.c), share: +(c.n / res.total).toFixed(4) })) };
  } finally { await page.close(); }
}

// ---------- brand file ----------
function loadBrand(file) {
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (Array.isArray(raw.pages)) return raw;
  if (raw.schema === 'ai-blocks-brand-dna/1' && raw.palette) { // a single snippet result saved from a browser console
    return { schema: raw.schema, source: raw.page?.url, captured_at: raw.captured_at, pages: [{ path: raw.page?.path || '/', url: raw.page?.url, desktop: raw.page?.viewport?.width < 700 ? null : raw, mobile: raw.page?.viewport?.width < 700 ? raw : null, screenshots: {}, pixel_palette: {} }], brand: null };
  }
  throw new Error(`${file} is not a brand-dna capture (schema ai-blocks-brand-dna/1).`);
}
function pickBrandPage(brand, candidateUrl, wanted) {
  const pages = brand.pages.filter((p) => p.desktop && !p.desktop.error);
  if (!pages.length) throw new Error('The brand capture has no usable desktop page. Capture again.');
  if (wanted) return pages.find((p) => p.path === wanted || p.url === wanted || p.slug === wanted) || pages[0];
  let cPath = null; try { const u = new URL(candidateUrl); cPath = u.protocol === 'file:' ? null : u.pathname.replace(/\/+$/, '') || '/'; } catch { /* file */ }
  return pages.find((p) => (p.path || '').replace(/\/+$/, '') === cPath) || pages[0];
}

// ---------- the eight checks ----------
const fam = (f) => String(f || '').toLowerCase().replace(/["']/g, '').replace(/\s*fallback\s*/g, '').replace(/\s+/g, ' ').trim();
const radiusPx = (r) => { const s = String(r || '0'); if (/%/.test(s)) return parseFloat(s) >= 50 ? 9999 : parseFloat(s); return parseFloat(s) || 0; };
const pill = (r, h) => radiusPx(r) >= 999 || (h && radiusPx(r) >= h / 2 - 1);
const words = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9& ]+/g, ' ').replace(/\s+/g, ' ').trim();
const overlap = (brandList, candList) => { const B = new Set(brandList.map(words).filter(Boolean)), C = new Set(candList.map(words).filter(Boolean)); if (!B.size) return null; let n = 0; for (const b of B) if (C.has(b)) n++; return { share: n / B.size, matched: n, of: B.size, missing: [...B].filter((b) => !C.has(b)).slice(0, 12) }; };
const PRICE = /(?:₹|\$|£|€|¥|Rs\.?\s?|INR\s?|USD\s?|AED\s?)\s?(\d[\d,]*(?:\.\d{1,2})?)|(\d[\d,]*(?:\.\d{1,2})?)\s?(?:₹|€|USD|INR|EUR|GBP)\b/g;
// Only numbers next to a currency count as prices; structured-data prices are plain numbers.
const priceNums = (list) => new Set(list.flatMap((t) => (typeof t === 'number' || /^\s*[\d.,]+\s*$/.test(String(t)) ? [String(t)] : [...String(t).matchAll(PRICE)].map((m) => m[1] || m[2])))
  .map((n) => String(Number(String(n).replace(/,/g, '')))).filter((n) => Number(n) >= 1));
const statNums = (list) => new Set(list.flatMap((t) => String(t).match(/\d[\d,]*(?:\.\d+)?\+?/g) || []).map((n) => n.replace(/,/g, '').replace(/\+$/, '')).filter((n) => Number(n) > 0 && !/^(19|20)\d\d$/.test(n)));

export function checkFonts(ref, cand) {
  const items = [], fails = [];
  for (const role of ROLES) {
    const b = ref.type.roles[role], c = cand.type.roles[role];
    if (!b) continue;
    if (!c) { items.push(`${role}: brand ${b.family}, candidate has no ${role}`); continue; }
    const same = fam(b.family) === fam(c.family);
    items.push(`${role}: brand ${b.family} ${b.weight}${b.transform !== 'none' ? ' ' + b.transform : ''}, candidate ${c.family} ${c.weight}${c.transform !== 'none' ? ' ' + c.transform : ''}${c.font_loaded === 'not loaded' ? ' (font file not loaded)' : ''}`);
    if (!same) fails.push(`${role} uses ${c.family}, the brand uses ${b.family}`);
    else if (c.font_loaded === 'not loaded' && !SYSTEM_FONTS.test(fam(c.family))) fails.push(`${role} names ${c.family} but the font file did not load, so the browser fell back`);
    if (same && b.transform !== c.transform && ['button', 'nav'].includes(role)) fails.push(`${role} text is ${c.transform}, the brand uses ${b.transform}`);
  }
  const brandWeb = new Set((ref.type.loaded_fonts || []).map((f) => fam(f.family)).filter((f) => !SYSTEM_FONTS.test(f)));
  const candWeb = new Set((cand.type.loaded_fonts || []).map((f) => fam(f.family)));
  const usedBrand = [...new Set(ROLES.map((r) => ref.type.roles[r] && fam(ref.type.roles[r].family)).filter((f) => f && brandWeb.has(f)))];
  for (const f of usedBrand) if (!candWeb.has(f)) fails.push(`brand font "${f}" is not loaded on the candidate`);
  return { id: 'fonts', title: 'Brand fonts loaded and used for the same roles', status: fails.length ? 'fail' : 'pass', detail: fails.length ? fails : ['Every captured role uses the brand family.'], evidence: items };
}

export function checkPalette(refPage, candDna, candPixels, tol) {
  const ref = refPage.desktop, refPix = refPage.pixel_palette?.desktop;
  const usePixels = !!(refPix?.colors && candPixels?.colors);
  const B = usePixels ? refPix.colors.map((c) => ({ hex: c.hex, share: c.share })) : ref.palette.map((c) => ({ hex: c.hex, share: c.area_share }));
  const C = usePixels ? candPixels.colors.map((c) => ({ hex: c.hex, share: c.share })) : candDna.palette.map((c) => ({ hex: c.hex, share: c.area_share }));
  const known = [...B.map((c) => c.hex), ...ref.palette.map((c) => c.hex), ...(ref.buttons?.styles || []).flatMap((s) => [s.bg, s.color]).filter(Boolean).map((h) => h.split('@')[0])];
  const fails = [], warns = [], evidence = [];
  for (const c of C.filter((x) => x.share >= 0.03)) {
    const d = Math.min(...known.map((k) => deltaE(k, c.hex)));
    if (d > tol) fails.push(`${c.hex} covers ${pct(c.share)} of the candidate but is not a brand colour (nearest is ${d.toFixed(0)} delta E away)`);
  }
  // Give each candidate colour to its nearest brand colour (within tolerance), so a tint such as cream is not swallowed by white.
  const nearest = (hex) => { let best = null, d = Infinity; for (const b of B) { const x = deltaE(b.hex, hex); if (x < d) { d = x; best = b; } } return d <= tol ? best : null; };
  const candShare = new Map(); for (const c of C) { const b = nearest(c.hex); if (b) candShare.set(b, (candShare.get(b) || 0) + c.share); }
  for (const b of B.filter((x) => x.share >= 0.002)) {
    const cs = candShare.get(b) || 0, bs = b.share;
    evidence.push(`${b.hex}: brand ${pct(bs)}, candidate ${pct(cs)}`);
    if (!neutral(b.hex) && bs < 0.08 && cs > Math.max(2 * bs, bs + 0.03)) fails.push(`accent ${b.hex} grew from ${pct(bs)} to ${pct(cs)} of the page; accents stay near their measured share`);
    else if (cs - bs > 0.15) fails.push(`${b.hex} grew from ${pct(bs)} to ${pct(cs)} of the page, which changes the page's colour balance`);
    else if (cs > Math.max(2 * bs, bs + 0.08)) warns.push(`${b.hex} grew from ${pct(bs)} to ${pct(cs)}`);
    else if (bs >= 0.1 && cs < bs * 0.5) warns.push(`main surface ${b.hex} shrank from ${pct(bs)} to ${pct(cs)}`);
  }
  const bi = usePixels ? refPix.image_share : ref.images.area_share, ci = usePixels ? candPixels.image_share : candDna.images.area_share;
  evidence.push(`photos and video: brand ${pct(bi)} of the page, candidate ${pct(ci)}`);
  if (bi >= 0.1 && ci < bi * 0.5) warns.push(`imagery fell from ${pct(bi)} to ${pct(ci)} of the page`);
  if ((candDna.palette_detail?.gradients || []).length && !(ref.palette_detail?.gradients || []).length) warns.push(`the candidate adds ${candDna.palette_detail.gradients.length} gradient(s); the brand page has none`);
  return { id: 'palette', title: 'Palette within tolerance, area shares close to the capture', status: fails.length ? 'fail' : warns.length ? 'warn' : 'pass', detail: [...fails, ...warns.map((w) => 'warn: ' + w)].length ? [...fails, ...warns.map((w) => 'warn: ' + w)] : ['Colours and their shares match.'], evidence: [`measured by ${usePixels ? 'screenshot pixels' : 'DOM paint grid'}, tolerance ${tol} delta E`, ...evidence] };
}

export function checkButtons(ref, cand, tol) {
  const b = (ref.buttons.styles || []).find((s) => s.primary) || ref.buttons.styles?.[0], c = (cand.buttons.styles || []).find((s) => s.primary) || cand.buttons.styles?.[0];
  if (!b) return { id: 'buttons', title: 'Button radius and style match', status: 'n/a', detail: ['The capture found no brand button to compare with.'], evidence: [] };
  if (!c) return { id: 'buttons', title: 'Button radius and style match', status: 'fail', detail: ['The candidate has no filled or outlined button.'], evidence: [`brand primary: ${JSON.stringify(b)}`] };
  const fails = [], warns = [];
  const br = radiusPx(b.radius), cr = radiusPx(c.radius);
  if (pill(b.radius, b.height) !== pill(c.radius, c.height) || (!pill(b.radius, b.height) && Math.abs(br - cr) > 3)) fails.push(`primary button radius is ${c.radius}, the brand uses ${b.radius}`);
  if ((b.transform || 'none') !== (c.transform || 'none')) fails.push(`primary button text is ${c.transform}, the brand uses ${b.transform}`);
  if (b.bg && c.bg && deltaE(b.bg.split('@')[0], c.bg.split('@')[0]) > tol) fails.push(`primary button fill is ${c.bg}, the brand uses ${b.bg}`);
  if (!b.bg !== !c.bg) fails.push(`primary button is ${c.bg ? 'filled' : 'outlined'}, the brand's is ${b.bg ? 'filled' : 'outlined'}`);
  if (fam(b.font) !== fam(c.font)) warns.push(`primary button font is ${c.font}, the brand uses ${b.font}`);
  const brandRadii = new Set((ref.buttons.styles || []).map((s) => (pill(s.radius, s.height) ? 'pill' : Math.round(radiusPx(s.radius) / 4))));
  for (const s of cand.buttons.styles || []) { const k = pill(s.radius, s.height) ? 'pill' : Math.round(radiusPx(s.radius) / 4); if (!brandRadii.has(k)) warns.push(`button "${s.examples[0]}" has radius ${s.radius}, which no brand button uses`); }
  return { id: 'buttons', title: 'Button radius and style match', status: fails.length ? 'fail' : warns.length ? 'warn' : 'pass', detail: fails.length || warns.length ? [...fails, ...warns.map((w) => 'warn: ' + w)] : ['The primary button matches the brand.'],
    evidence: [`brand primary: ${b.bg || 'no fill'} / ${b.color}, radius ${b.radius}, ${b.transform}, ${b.font} ${b.weight} (e.g. "${b.examples?.[0] || ''}")`, `candidate primary: ${c.bg || 'no fill'} / ${c.color}, radius ${c.radius}, ${c.transform}, ${c.font} ${c.weight} (e.g. "${c.examples?.[0] || ''}")`] };
}

export function checkChrome(ref, cand) {
  const fails = [], evidence = [];
  const bNav = [...ref.nav.items, ...(ref.nav.hidden_items || [])].map((i) => i.text), cNav = [...cand.nav.items, ...(cand.nav.hidden_items || [])].map((i) => i.text);
  const navO = overlap(bNav, cNav);
  if (navO && navO.of >= 3) { evidence.push(`nav: ${navO.matched} of ${navO.of} brand items present`); if (navO.share < 0.6) fails.push(`nav keeps ${navO.matched} of ${navO.of} brand items; missing: ${navO.missing.join(', ')}`); }
  else { evidence.push(`nav: brand header has ${bNav.length} link(s)${ref.nav.hamburger ? ' and a menu button' : ''}`); if (!cand.nav.header_height) fails.push('the candidate has no header bar'); if (ref.nav.hamburger && !cand.nav.hamburger && cNav.length < 3) fails.push('the brand header has a menu; the candidate header has neither a menu nor nav links'); }
  if (ref.nav.has_cart && !cand.nav.has_cart) fails.push('the brand header has a cart or bag link; the candidate does not');
  if (ref.footer) {
    if (!cand.footer) fails.push(`the candidate has no footer; the brand footer has ${ref.footer.link_count} links in ${ref.footer.columns.length} columns`);
    else {
      const bf = [...ref.footer.columns.flatMap((c) => c.links.map((l) => l.text)), ...ref.footer.other_links.map((l) => l.text)];
      const cf = [...cand.footer.columns.flatMap((c) => c.links.map((l) => l.text)), ...cand.footer.other_links.map((l) => l.text)];
      const fo = overlap(bf, cf);
      if (fo) { evidence.push(`footer: ${fo.matched} of ${fo.of} brand links present`); if (fo.share < 0.6) fails.push(`footer keeps ${fo.matched} of ${fo.of} brand links; missing: ${fo.missing.join(', ')}`); }
    }
  }
  return { id: 'chrome', title: 'Nav and footer present, with item overlap', status: fails.length ? 'fail' : 'pass', detail: fails.length ? fails : ['Header and footer carry the brand items.'], evidence };
}

export const PLACEHOLDER_PATTERNS = [
  ['lorem ipsum', /lorem ipsum|dolor sit amet/i], ['TODO or TBD', /\bTODO\b|\bTBD\b|\bFIXME\b/], ['the word placeholder', /\bplaceholder\b/i],
  ['[bracketed] gap', /\[[A-Za-z][^\]\n]{1,60}\]/], ['"to shoot"', /\bto (?:shoot|be shot)\b/i], ['MISSING marker', /\bMISSING:/],
  ['XX number', /(?:₹|\$|£|€)\s?X{2,}|\bX{2,}[,.]X{2,}|\b(?:XX|xx)%/], ['"... here" stub', /\b(?:your|insert|add)\s+(?:logo|headline|text|copy|image|photo|name|price|tagline)\s+here\b/i],
  ['unfilled {{token}}', /\{\{\s*[\w.]+\s*\}\}/], ['"supply" chip', /\bto supply\b|\bsupplied by client\b/i],
];
export function checkPlaceholders(scan) {
  const hits = [];
  for (const line of scan.lines) for (const [name, re] of PLACEHOLDER_PATTERNS) if (re.test(line)) { hits.push(`${name}: "${line.slice(0, 120)}"`); break; }
  for (const src of scan.placeholderImages) hits.push(`placeholder image: ${src.slice(0, 120)}`);
  return { id: 'placeholders', title: 'No placeholder text or stand-in images', status: hits.length ? 'fail' : 'pass', detail: hits.length ? hits.slice(0, 15) : ['No placeholders found in the visible text or image sources.'], evidence: [`${scan.lines.length} visible text lines scanned`] };
}

export function checkFacts(brand, cand, scan) {
  const all = brand.pages.filter((p) => p.desktop && !p.desktop.error).map((p) => p.desktop.facts);
  const bPrices = priceNums(all.flatMap((f) => [...f.prices, ...f.structured.map((s) => s.price).filter(Boolean)]));
  const bStats = statNums(all.flatMap((f) => [...f.reviews, ...f.structured.flatMap((s) => [s.rating, s.review_count]).filter(Boolean)]));
  const cPriceLines = [...cand.facts.prices, ...cand.facts.structured.map((s) => s.price).filter(Boolean)];
  const unmatchedPrices = [...priceNums(cPriceLines)].filter((n) => !bPrices.has(n));
  const unmatchedStats = [...statNums(cand.facts.reviews)].filter((n) => !bStats.has(n) && !/^(1|2|3|4|5|7|10|24|30|100)$/.test(n));
  const captured = new Date(brand.captured_at || all[0]?.captured_at || 0), fresher = scan.factsDate && new Date(scan.factsDate) > captured;
  const ageDays = Math.floor((Date.now() - captured.getTime()) / 864e5);
  const fails = [], warns = [], evidence = [`brand facts captured ${captured.toISOString().slice(0, 10)} (${ageDays} day${ageDays === 1 ? '' : 's'} ago)`, `brand prices: ${[...bPrices].slice(0, 12).join(', ') || 'none'}`, `candidate prices: ${[...priceNums(cPriceLines)].slice(0, 12).join(', ') || 'none'}`];
  if (scan.factsDate) evidence.push(`candidate states a facts date: ${scan.factsDate}`);
  const problem = (msg) => (fresher ? warns : fails).push(msg + (fresher ? ` (the page says its facts are from ${scan.factsDate}, newer than the capture: check them against the source)` : ''));
  if (unmatchedPrices.length) problem(`prices not in the capture: ${unmatchedPrices.slice(0, 10).join(', ')}`);
  if (unmatchedStats.length) problem(`review or proof numbers not in the capture: ${unmatchedStats.slice(0, 10).join(', ')}`);
  if (ageDays > 7) warns.push(`the capture is ${ageDays} days old; capture prices and offers again before publishing`);
  return { id: 'facts', title: 'Prices and proof numbers match the capture, or carry a fresher date', status: fails.length ? 'fail' : warns.length ? 'warn' : 'pass', detail: fails.length || warns.length ? [...fails, ...warns.map((w) => 'warn: ' + w)] : ['Every price and proof number on the page appears in the capture.'], evidence };
}

export function checkMobile(mobileScan, liveOverflow) {
  if (!mobileScan) return { id: 'mobile', title: 'Works at 390 px with no horizontal scroll', status: 'fail', detail: ['The mobile render failed.'], evidence: [] };
  const over = mobileScan.overflow > 1;
  return { id: 'mobile', title: 'Works at 390 px with no horizontal scroll', status: over ? 'fail' : 'pass',
    detail: over ? [`the page is ${mobileScan.overflow}px wider than the 390 px screen`, ...mobileScan.offenders.map((o) => `wider than the screen: ${o}`)] : ['No horizontal scroll at 390 px.'],
    evidence: [`document width ${mobileScan.scrollWidth}px at a ${mobileScan.innerWidth}px viewport`, ...(liveOverflow ? [`note: the live page also overflows by ${liveOverflow}px`] : [])] };
}

export function checkAction(cand, scan) {
  const p = cand.buttons.primary, fails = [];
  if (!p) fails.push('no primary action found (no filled or outlined button or button-styled link)');
  else if (p.tag === 'a' && (!p.href || p.href === '#' || /^javascript:/i.test(p.href))) fails.push(`the primary action "${p.text}" is a link to "${p.href || 'nothing'}"`);
  for (const f of scan.fakeButtons) fails.push(`"${f}" looks like a button but is not a link or button, so it cannot be used by keyboard or screen reader`);
  return { id: 'action', title: 'The primary action is a real link or button', status: fails.length ? 'fail' : 'pass', detail: fails.length ? fails : [`"${p.text}" is a ${p.tag === 'a' ? 'link to ' + p.href : p.tag}. Click it once by hand to confirm where it goes.`], evidence: p ? [`${p.tag} "${p.text}" ${p.href || ''}`] : [] };
}

export function checkSections(refPage, cand) {
  const b = (refPage.desktop.sections || []).map((s) => s.kind), c = (cand.sections || []).map((s) => s.kind);
  const dropped = b.filter((k) => !c.includes(k)), added = c.filter((k) => !b.includes(k));
  return { id: 'sections', title: 'Section order (information only)', status: 'info', detail: [`brand: ${b.join(' > ')}`, `candidate: ${c.join(' > ')}`, ...(dropped.length ? [`kinds dropped: ${[...new Set(dropped)].join(', ')}`] : []), ...(added.length ? [`kinds added: ${[...new Set(added)].join(', ')}`] : []), 'Every drop, add or move should be on the change list with a reason.'], evidence: [] };
}

// ---------- page scans the snippet does not do ----------
async function scanPage(page) {
  return page.evaluate(() => {
    const lines = [...new Set(String(document.body.innerText || '').split(/\n+/).map((s) => s.replace(/\s+/g, ' ').trim()).filter((s) => s.length > 1))];
    // Text drawn by CSS (::before and ::after) and elements whose class says placeholder are invisible to innerText.
    let n = 0;
    for (const el of document.body.querySelectorAll('*')) {
      if (++n > 6000) break;
      const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
      let drawn = false;
      for (const pseudo of ['::before', '::after']) { const c = getComputedStyle(el, pseudo).content; if (c && c !== 'none' && c !== 'normal' && /[A-Za-z]{3}/.test(c)) { lines.push(c.replace(/^["']|["']$/g, '') + ' ' + (el.innerText || '').trim().slice(0, 60)); drawn = true; } }
      if (!drawn && typeof el.className === 'string' && /(^|[\s_-])(placeholder|todo|tbd|missing|to-supply|stub)($|[\s_-])/i.test(el.className) && (el.innerText || '').trim()) lines.push('placeholder (class "' + el.className.trim().slice(0, 40) + '") ' + (el.innerText || '').trim().slice(0, 60));
    }
    const placeholderImages = [...document.images].map((i) => i.currentSrc || i.src || '').filter((s) => /placehold|placeholder|dummyimage|picsum\.photos|via\.placeholder|fakeimg|lorempixel|source\.unsplash\.com\/random/i.test(s));
    let factsDate = null;
    const m = document.querySelector('meta[name="facts-date"],meta[name="ai-blocks:facts-date"],[data-facts-date]');
    if (m) factsDate = m.getAttribute('content') || m.getAttribute('data-facts-date');
    if (!factsDate) { const t = /(?:prices?|facts|offers?)\s+(?:as of|checked|updated)(?: on)?\s+(\d{1,2}\s+\w{3,9}\s+\d{4}|\d{4}-\d{2}-\d{2})/i.exec(document.body.innerText || ''); if (t) factsDate = t[1]; }
    if (factsDate && isNaN(new Date(factsDate))) factsDate = null;
    const fake = [];
    for (const el of document.querySelectorAll('div,span,p,li')) {
      if (fake.length >= 5) break;
      const r = el.getBoundingClientRect(); if (r.top > innerHeight || r.height < 28 || r.height > 90 || r.width < 60 || r.width > 520) continue;
      const s = getComputedStyle(el), text = (el.innerText || '').trim();
      if (!text || text.length > 40 || el.closest('a,button,[role=button],label,summary')) continue;
      const bg = s.backgroundColor, filled = bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg);
      if (filled && s.cursor === 'pointer' && !el.querySelector('a,button,input')) fake.push(text);
    }
    return { lines, placeholderImages, factsDate, fakeButtons: fake };
  });
}
async function mobileScan(page, width) {
  // Phones zoom out to fit wide content, which makes innerWidth grow with it, so compare with the screen width we set.
  return page.evaluate((width) => {
    const iw = width, sw = Math.max(document.documentElement.scrollWidth, document.body ? document.body.scrollWidth : 0, window.innerWidth), offenders = [];
    if (sw > iw + 1) for (const el of document.body.querySelectorAll('*')) {
      const r = el.getBoundingClientRect(); if (r.right > iw + 1 && r.width > 0 && r.height > 0 && getComputedStyle(el).position !== 'fixed') {
        const name = el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
        if (!offenders.some((o) => o.el.contains(el))) offenders.push({ el, text: `${name} (${Math.round(r.width)}px wide, right edge at ${Math.round(r.right)}px)` });
        if (offenders.length >= 6) break;
      }
    }
    return { innerWidth: iw, scrollWidth: sw, overflow: Math.max(0, sw - iw), offenders: offenders.map((o) => o.text) };
  }, width);
}

/** Two screenshots side by side with labels, saved as one PNG. */
async function sideBySide(browser, leftFile, rightFile, outFile, labels, colWidth) {
  const page = await browser.newPage({ viewport: { width: colWidth * 2 + 60, height: 400 } });
  try {
    const img = (f) => (f && fs.existsSync(f) ? 'data:image/png;base64,' + fs.readFileSync(f).toString('base64') : '');
    const cell = (f, label) => `<figure><figcaption>${label}</figcaption>${img(f) ? `<img src="${img(f)}">` : '<div class="none">no screenshot</div>'}</figure>`;
    await page.setContent(`<!doctype html><style>body{margin:0;padding:20px;background:#ddd;font:600 15px system-ui,sans-serif;display:flex;gap:20px;align-items:flex-start}figure{margin:0;width:${colWidth}px}figcaption{padding:0 0 8px}img{width:${colWidth}px;display:block;box-shadow:0 0 0 1px #999}.none{height:200px;background:#fff;display:grid;place-items:center;color:#900}</style>${cell(leftFile, labels[0])}${cell(rightFile, labels[1])}`);
    await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))));
    await page.screenshot({ path: outFile, fullPage: true });
  } finally { await page.close(); }
}

function resolveTarget(t) {
  if (/^https?:\/\//i.test(t) || /^file:/i.test(t)) return t;
  if (fs.existsSync(t)) return pathToFileURL(path.resolve(t)).href;
  throw new Error(`--page "${t}" is not a URL and no such file exists.`);
}

export async function main(argv = process.argv.slice(2)) {
  let o; try { o = parseArgs(argv); } catch (e) { console.error(e.message); return 2; }
  if (o.help || !o.brand || !o.page) { console.log(HELP); return o.help ? 0 : 2; }
  let brand, target, snippet;
  try { brand = loadBrand(o.brand); target = resolveTarget(o.page); snippet = readSnippet(); } catch (e) { console.error(e.message); return 2; }
  const refPage = pickBrandPage(brand, target, o.brandPage);
  const pw = loadPlaywright(o.playwright);
  if (!pw) { console.error('Playwright is not installed. Install it with: npm i -D playwright (then npx playwright install chromium, or pass --channel chrome).\nNo Node? Use the manual checklist in the brand-fidelity-check SKILL.md.'); return 2; }
  const outDir = path.resolve(o.out); fs.mkdirSync(outDir, { recursive: true });
  const brandDir = path.dirname(path.resolve(o.brand));
  let launched; try { launched = await launchBrowser(pw, o.channel); } catch (e) { console.error(e.message); return 2; }
  const { browser } = launched;
  const cand = {}, shots = {}, pixels = {};
  let scan = null, mScan = null;
  try {
    for (const vp of VIEWPORTS) {
      const ctx = await newContext(browser, vp, o.block), page = await ctx.newPage();
      try {
        await preparePage(page, target);
        shots[`candidate_${vp.name}_first`] = path.join(outDir, `candidate-${vp.name}-first.png`);
        shots[`candidate_${vp.name}_full`] = path.join(outDir, `candidate-${vp.name}-full.png`);
        await page.screenshot({ path: shots[`candidate_${vp.name}_first`] });
        await page.screenshot({ path: shots[`candidate_${vp.name}_full`], fullPage: true, timeout: 60000 }).catch(() => { delete shots[`candidate_${vp.name}_full`]; });
        if (vp.name === 'mobile') mScan = await mobileScan(page, vp.width);
        await page.evaluate(() => { window.__brandDnaOptions = { quiet: true }; });
        cand[vp.name] = await page.evaluate((src) => (0, eval)(src), snippet);
        if (vp.name === 'desktop') {
          scan = await scanPage(page);
          const pf = shots.candidate_desktop_full || shots.candidate_desktop_first;
          pixels.desktop = await pixelPalette(browser, pf, pf === shots.candidate_desktop_first ? cand.desktop.image_rects.filter((r) => r[1] < vp.height) : cand.desktop.image_rects).catch(() => null);
        }
      } finally { await ctx.close(); }
    }
    // Live screenshots: reuse the capture's, or take fresh ones when the capture has none.
    const live = {};
    for (const vp of VIEWPORTS) for (const kind of ['first', 'full']) { const rel = refPage.screenshots?.[`${vp.name}_${kind}`]; if (rel && fs.existsSync(path.resolve(brandDir, rel))) live[`${vp.name}_${kind}`] = path.resolve(brandDir, rel); }
    if (!live.desktop_first && /^https?:/i.test(refPage.url || '')) {
      for (const vp of VIEWPORTS) {
        const ctx = await newContext(browser, vp, o.block), page = await ctx.newPage();
        try { await preparePage(page, refPage.url); live[`${vp.name}_first`] = path.join(outDir, `live-${vp.name}-first.png`); await page.screenshot({ path: live[`${vp.name}_first`] }); live[`${vp.name}_full`] = path.join(outDir, `live-${vp.name}-full.png`); await page.screenshot({ path: live[`${vp.name}_full`], fullPage: true, timeout: 60000 }).catch(() => { delete live[`${vp.name}_full`]; }); }
        catch (e) { console.warn(`Could not screenshot the live page at ${vp.name}: ${String(e.message).split('\n')[0]}`); } finally { await ctx.close(); }
      }
    }
    for (const [vp, w] of [['desktop', 720], ['mobile', 390]]) {
      for (const kind of ['first', 'full']) {
        const out = path.join(outDir, `side-by-side-${vp}-${kind}.png`);
        try { await sideBySide(browser, live[`${vp}_${kind}`], shots[`candidate_${vp}_${kind}`], out, [`LIVE ${refPage.url || refPage.path} (${vp})`, `CANDIDATE ${/^https?:/i.test(o.page) ? o.page : path.basename(path.dirname(path.resolve(o.page))) + '/' + path.basename(o.page)} (${vp})`], w); shots[`side_by_side_${vp}_${kind}`] = out; }
        catch (e) { console.warn(`Side-by-side ${vp} ${kind} failed: ${String(e.message).split('\n')[0]}`); }
      }
    }
  } catch (e) {
    await browser.close(); console.error('The candidate page could not be checked: ' + String(e.message || e).split('\n')[0]); return 2;
  }
  await browser.close();
  if (!cand.desktop) { console.error('The candidate did not render at desktop width.'); return 2; }

  const ref = refPage.desktop;
  const checks = [
    checkFonts(ref, cand.desktop),
    checkPalette(refPage, cand.desktop, pixels.desktop, o.tolerance),
    checkButtons(ref, cand.desktop, o.tolerance),
    checkChrome(ref, cand.desktop),
    checkPlaceholders(scan),
    checkFacts(brand, cand.desktop, scan),
    checkMobile(mScan, refPage.mobile?.page?.horizontal_overflow),
    checkAction(cand.desktop, scan),
    checkSections(refPage, cand.desktop),
  ];
  const failed = checks.filter((c) => c.status === 'fail');
  const rel = (f) => path.relative(outDir, f).split(path.sep).join('/');
  const report = { schema: 'ai-blocks-fidelity/1', tool: `check-brand-fidelity.mjs ${VERSION}`, checked_at: new Date().toISOString(), brand_file: o.brand, brand_page: refPage.path, brand_captured_at: brand.captured_at, candidate: o.page,
    result: failed.length ? 'fail' : 'pass', failed: failed.map((c) => c.id), checks, screenshots: Object.fromEntries(Object.entries(shots).map(([k, v]) => [k, rel(v)])), candidate_dna: { desktop: { ...cand.desktop, image_rects: undefined }, mobile: cand.mobile ? { ...cand.mobile, image_rects: undefined } : null } };
  fs.writeFileSync(path.join(outDir, 'fidelity-report.json'), JSON.stringify(report, null, 1));
  const icon = { pass: 'PASS', fail: 'FAIL', warn: 'WARN', 'n/a': 'N/A ', info: 'INFO' };
  const md = [
    `# Brand fidelity: ${failed.length ? 'FAIL' : 'PASS'}`, '',
    `Candidate: ${o.page}`, `Compared with: ${refPage.url || refPage.path} (captured ${String(brand.captured_at || '').slice(0, 10)})`, `Checked: ${report.checked_at.slice(0, 16).replace('T', ' ')} UTC by check-brand-fidelity.mjs ${VERSION}`, '',
    ...checks.flatMap((c) => [`## ${icon[c.status]} ${c.title}`, ...c.detail.map((d) => `- ${d}`), ...(c.evidence.length ? ['', ...c.evidence.map((e) => `  - ${e}`)] : []), '']),
    '## Side-by-side screenshots for a fresh-context review',
    ...Object.entries(report.screenshots).filter(([k]) => k.startsWith('side_by_side')).map(([k, v]) => `- ${k.replace(/_/g, ' ')}: ${v}`),
    '', 'Give only the side-by-side images to a reviewer that did not build the page (a new chat or another seat), with visual-review.md. Do not send the build notes.', '',
  ].join('\n');
  fs.writeFileSync(path.join(outDir, 'fidelity-report.md'), md);
  fs.writeFileSync(path.join(outDir, 'visual-review.md'), [
    '# Visual review (fresh context)', '',
    'You are reviewing two screenshots side by side. The left is the live site. The right is a candidate page meant to belong to the same site.',
    'You have not seen how the candidate was made. Answer from the images only.', '',
    '1. Same brand and same site? List every visible difference: type, colour and how much of each, button shape and case, spacing, imagery, header, footer, section order.',
    '2. Would a returning customer notice anything off? Name it and say where it is.',
    '3. Which differences look deliberate improvements, and which look like a generic template showing through?', '',
    'Files:', ...Object.entries(report.screenshots).filter(([k]) => k.startsWith('side_by_side')).map(([, v]) => `- ${v}`), '',
    'Compare your list with the change list for this page. Any difference that is not on the change list is a defect to fix before hand-off.', '',
  ].join('\n'));
  console.log(md.split('\n## Side-by-side')[0]);
  console.log(`Report: ${path.join(o.out, 'fidelity-report.md')} | screenshots and visual-review.md in ${o.out}`);
  return failed.length ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((code) => { process.exitCode = code; }, (e) => { console.error(e?.stack || e); process.exitCode = 2; });
}
