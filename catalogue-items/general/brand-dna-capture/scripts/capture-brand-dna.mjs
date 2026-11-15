#!/usr/bin/env node
// capture-brand-dna.mjs (AI Blocks, brand-dna-capture) - version 1.1.0
//
// Opens a live site (or a local HTML file) in a real browser at 1440 and 390 px, runs brand-dna-snippet.js on
// each page, saves screenshots, and merges what it measured into the files already there. It never overwrites:
//   context/brand-dna.json         the raw capture: one entry per page with its own date, and the merged brand
//   context/org-context/           the org context built from it (needs org-context.mjs beside this script; an older
//                                  context/brand-file/ folder is used until it is moved)
//   context/org-context/history/   the capture this run replaced, and changes.md: what is different since last time
//   context/screenshots/*.png      <page>-desktop-first, -desktop-full, -mobile-first, -mobile-full
//   context/brand-dna.md           a short measured summary, only if the file does not exist yet
//   context/brand-dna.receipt.json path, sha256, source, date and method of the capture, for the job record
//
// Usage:
//   node capture-brand-dna.mjs <url | file.html> [extra paths...] [options]
//   node capture-brand-dna.mjs https://www.gehnaindia.com /collections/earrings /products/some-product
//   node capture-brand-dna.mjs ./site/index.html about.html
// Options:
//   --paths a,b        extra paths, comma separated (same as listing them after the URL)
//   --competitor <url> also read a competitor's page: its look and headline lines only, into references.md
//   --admire <url>     the same for a site the client admires; --avoid <url> for one to stay away from (3 in all)
//   --replace          start the capture again instead of merging (the old one is still kept in history/)
//   --out <dir>        output folder (default: ./context)
//   --channel <name>   browser to use: chrome, msedge or chromium (default: try bundled Chromium, then Chrome, then Edge)
//   --playwright <dir> where the playwright package is, if it is not installed in this folder
//   --wait <ms>        extra wait after load (default 2500)
//   --no-block         do not block analytics and ad tags while capturing
//   --no-full          skip full-page screenshots (faster; pixel colour shares then use the first screen only)
//   --overwrite-md     rewrite context/brand-dna.md even if it exists
//
// It only reads pages. It does not log in, fill forms, accept cookie banners or click buy buttons.
// Needs Node 18+ and Playwright: npm i -D playwright  (then: npx playwright install chromium, or use --channel chrome)
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const VERSION = '1.1.0';
const BLOCK = /googletagmanager|google-analytics|analytics\.google|doubleclick|facebook\.net|connect\.facebook|clarity\.ms|hotjar|klaviyo|tiktok\.com\/i18n|analytics\.tiktok|snap\.licdn|bat\.bing|criteo|taboola|outbrain|segment\.(?:io|com)|mixpanel|fullstory|mouseflow|luckyorange|intercomcdn|gorgias\.chat|tidio|zopim|freshchat|crisp\.chat/i;
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, mobile: false },
  { name: 'mobile', width: 390, height: 844, mobile: true, ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' },
];

function parseArgs(argv) {
  const o = { positional: [], out: 'context', wait: 2500, block: true, full: true, channel: null, playwright: null, overwriteMd: false, refs: [], replace: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--help' || a === '-h') o.help = true;
    else if (a === '--out') o.out = argv[++i];
    else if (a === '--paths') o.positional.push(...String(argv[++i] || '').split(',').filter(Boolean).map((p) => ({ extra: p })));
    else if (a === '--channel') o.channel = argv[++i];
    else if (a === '--playwright') o.playwright = argv[++i];
    else if (a === '--wait') o.wait = Number(argv[++i]) || 0;
    else if (a === '--no-block') o.block = false;
    else if (a === '--no-full') o.full = false;
    else if (a === '--overwrite-md') o.overwriteMd = true;
    else if (a === '--replace') o.replace = true;
    else if (a === '--competitor' || a === '--admire' || a === '--avoid') o.refs.push({ kind: a.slice(2), url: argv[++i] });
    else if (a.startsWith('--')) throw new Error(`Unknown option ${a}. Run with --help.`);
    else o.positional.push(a);
  }
  if (o.refs.some((r) => !r.url)) throw new Error('--competitor, --admire and --avoid each need a URL.');
  if (o.refs.length > 3) throw new Error('Capture at most 3 competitor or reference sites in one run.');
  return o;
}

const HELP = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).slice(0, 30).map((l) => l.replace(/^\/\/ ?/, '')).join('\n');

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
    'Playwright is not installed, so the browser capture cannot run.',
    'Install it in this project:   npm i -D playwright',
    'Then either download a browser:   npx playwright install chromium',
    'or use the Chrome you already have:   node capture-brand-dna.mjs <url> --channel chrome',
    'Already installed elsewhere? Pass   --playwright <path to node_modules/playwright>',
    'No Node at all? Use route 2: paste brand-dna-snippet.js into the browser console on each page (see SKILL.md).',
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

export function resolveTargets(target, extras) {
  const isFile = !/^https?:\/\//i.test(target) && fs.existsSync(target);
  if (!isFile && !/^https?:\/\//i.test(target)) {
    if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(target)) target = 'https://' + target;
    else throw new Error(`"${target}" is not a URL and no such file exists.`);
  }
  const first = isFile ? pathToFileURL(path.resolve(target)).href : target;
  const list = [first];
  for (const e of extras) {
    const p = typeof e === 'string' ? e : e.extra;
    if (/^https?:\/\//i.test(p) || /^file:/i.test(p)) list.push(p);
    else if (isFile) list.push(pathToFileURL(path.resolve(path.dirname(path.resolve(target)), p)).href);
    else list.push(new URL(p, first).href);
  }
  return [...new Set(list)];
}

export function pageSlug(u) {
  const url = new URL(u);
  if (url.protocol === 'file:') return path.basename(fileURLToPath(url)).replace(/\.[^.]+$/, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'page';
  const p = url.pathname.replace(/\/+$/, '');
  return p ? p.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase().slice(0, 60) : 'home';
}

// ---------- colour helpers (same maths as the snippet) ----------
export function hexToRgb(h) { const m = /^#?([0-9a-f]{6})/i.exec(String(h || '')); if (!m) return null; const n = parseInt(m[1], 16); return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }; }
export function rgbToHex(c) { return '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase(); }
function lab(c) {
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const r = lin(c.r), g = lin(c.g), b = lin(c.b);
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047, y = r * 0.2126 + g * 0.7152 + b * 0.0722, z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = (t) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
}
export function deltaE(a, b) { const p = lab(a), q = lab(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); }

/** Colour shares from a screenshot, measured by pixels, with photos and videos (from the snippet's image_rects) counted apart. */
export async function pixelPalette(browser, file, rects) {
  const page = await browser.newPage();
  try {
    const dataUrl = 'data:image/png;base64,' + fs.readFileSync(file).toString('base64');
    const res = await page.evaluate(async ({ dataUrl, rects }) => {
      const img = new Image(); img.src = dataUrl; await img.decode();
      const W = Math.min(480, img.width), k = W / img.width, H = Math.max(1, Math.round(img.height * k));
      const c = document.createElement('canvas'); c.width = W; c.height = H; const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, W, H);
      const d = ctx.getImageData(0, 0, W, H).data, mask = new Uint8Array(W * H);
      for (const [x, y, w, h] of rects || []) {
        const x0 = Math.max(0, Math.floor(x * k)), x1 = Math.min(W, Math.ceil((x + w) * k)), y0 = Math.max(0, Math.floor(y * k)), y1 = Math.min(H, Math.ceil((y + h) * k));
        for (let yy = y0; yy < y1; yy++) mask.fill(1, yy * W + x0, yy * W + x1);
      }
      const bins = new Map(); let image = 0;
      for (let i = 0, p = 0; i < d.length; i += 4, p++) {
        if (mask[p]) { image++; continue; }
        const key = ((d[i] >> 3) << 10) | ((d[i + 1] >> 3) << 5) | (d[i + 2] >> 3);
        const e = bins.get(key) || [0, 0, 0, 0]; e[0]++; e[1] += d[i]; e[2] += d[i + 1]; e[3] += d[i + 2]; bins.set(key, e);
      }
      const top = [...bins.values()].sort((a, b) => b[0] - a[0]).slice(0, 300).map((e) => ({ n: e[0], r: e[1] / e[0], g: e[2] / e[0], b: e[3] / e[0] }));
      return { total: W * H, image, top };
    }, { dataUrl, rects });
    const clusters = [];
    for (const e of res.top) {
      const hit = clusters.find((c) => deltaE(c.c, e) < 6);
      if (hit) hit.n += e.n; else clusters.push({ c: { r: e.r, g: e.g, b: e.b }, n: e.n });
    }
    return {
      method: 'screenshot pixels, photos and videos counted as image',
      image_share: +(res.image / res.total).toFixed(4),
      colors: clusters.sort((a, b) => b.n - a.n).filter((c) => c.n / res.total >= 0.002).slice(0, 14).map((c) => ({ hex: rgbToHex(c.c), share: +(c.n / res.total).toFixed(4) })),
    };
  } finally { await page.close(); }
}

/** Load a page the way a visitor sees it: wait, close pop-ups with Escape, scroll so lazy images load, return to the top. */
export async function preparePage(page, url, { wait = 2500 } = {}) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.waitForTimeout(wait);
  await page.keyboard.press('Escape').catch(() => {});
  await page.evaluate(async () => {
    const step = Math.max(400, Math.round(innerHeight * 0.8));
    for (let y = 0, n = 0; y < Math.min(document.documentElement.scrollHeight, 40000) && n < 80; y += step, n++) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 140)); }
    scrollTo(0, 0);
  }).catch(() => {});
  await page.waitForTimeout(900);
}

export async function newContext(browser, vp, block) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, isMobile: vp.mobile, hasTouch: vp.mobile, bypassCSP: true, locale: 'en-US', ...(vp.ua ? { userAgent: vp.ua } : {}) });
  if (block) await ctx.route('**/*', (r) => (BLOCK.test(r.request().url()) ? r.abort() : r.continue()));
  return ctx;
}

export function readSnippet(extraDirs = []) {
  const dirs = [HERE, ...extraDirs, path.join(HERE, '..', '..', 'brand-dna-capture', 'scripts'), path.join(process.cwd(), 'tools')];
  for (const d of dirs) { const f = path.join(d, 'brand-dna-snippet.js'); if (fs.existsSync(f)) return { file: f, text: fs.readFileSync(f, 'utf8') }; }
  throw new Error('brand-dna-snippet.js was not found next to this script. Download it from the brand-dna-capture skill and put it beside this file.');
}

/** Run the snippet in the page and return its JSON. */
export async function runSnippet(page, snippetText) {
  await page.evaluate(() => { window.__brandDnaOptions = { quiet: true }; });
  return page.evaluate((src) => (0, eval)(src), snippetText);
}

export async function capturePage(browser, url, { snippet, outDir, shotsDir, wait, block, full, label }) {
  const slug = label || pageSlug(url), result = { captured_at: new Date().toISOString(), path: (() => { try { const u = new URL(url); return u.protocol === 'file:' ? path.basename(fileURLToPath(u)) : u.pathname; } catch { return url; } })(), url, slug, screenshots: {}, pixel_palette: {} };
  for (const vp of VIEWPORTS) {
    const ctx = await newContext(browser, vp, block), page = await ctx.newPage();
    try {
      await preparePage(page, url, { wait });
      const first = path.join(shotsDir, `${slug}-${vp.name}-first.png`), fullShot = path.join(shotsDir, `${slug}-${vp.name}-full.png`);
      await page.screenshot({ path: first });
      result.screenshots[`${vp.name}_first`] = path.relative(outDir, first).split(path.sep).join('/');
      if (full) {
        try { await page.screenshot({ path: fullShot, fullPage: true, timeout: 60000 }); result.screenshots[`${vp.name}_full`] = path.relative(outDir, fullShot).split(path.sep).join('/'); }
        catch (e) { result.screenshots[`${vp.name}_full_error`] = String(e.message || e).split('\n')[0]; }
      }
      const dna = await runSnippet(page, snippet);
      dna.page.horizontal_overflow = await page.evaluate((w) => Math.max(0, Math.max(document.documentElement.scrollWidth, window.innerWidth) - w), vp.width);
      const shotForPixels = full && fs.existsSync(fullShot) ? fullShot : first;
      try { result.pixel_palette[vp.name] = await pixelPalette(browser, shotForPixels, shotForPixels === first ? dna.image_rects.filter((r) => r[1] < vp.height) : dna.image_rects); }
      catch (e) { result.pixel_palette[vp.name] = { error: String(e.message || e).split('\n')[0] }; }
      delete dna.image_rects;
      result[vp.name] = dna;
      result.title = result.title || dna.page.title;
      console.log(`  ok  ${vp.name.padEnd(7)} ${url}  (${dna.sections.length} sections, ${dna.images.count} images, ${dna.took_ms} ms)`);
    } catch (e) {
      result[vp.name] = { error: String(e.message || e).split('\n')[0] };
      console.log(`  fail ${vp.name.padEnd(7)} ${url}  ${result[vp.name].error}`);
    } finally { await ctx.close(); }
  }
  return result;
}

const familyKey = (f) => String(f || '').toLowerCase().replace(/["']/g, '').trim();

/** Merge pages into one brand view. The first page (usually home) leads; later pages fill gaps and add facts. */
export function mergeBrand(pages, meta) {
  const ok = pages.filter((p) => p.desktop && !p.desktop.error);
  if (!ok.length) return null;
  const lead = ok[0].desktop, leadMobile = ok.find((p) => p.mobile && !p.mobile.error)?.mobile || null;
  const roles = { ...lead.type.roles };
  for (const p of ok.slice(1)) for (const [k, v] of Object.entries(p.desktop.type.roles)) if (!roles[k]) roles[k] = { ...v, from_page: p.path };
  const famMap = new Map();
  for (const p of ok) for (const f of p.desktop.type.families) { const e = famMap.get(familyKey(f.family)) || { ...f, char_share: 0, pages: 0, weights: new Set(), sizes: new Set() }; e.char_share += f.char_share / ok.length; e.pages++; f.weights.forEach((w) => e.weights.add(w)); f.sizes.forEach((s) => e.sizes.add(s)); famMap.set(familyKey(f.family), e); }
  const families = [...famMap.values()].sort((a, b) => b.char_share - a.char_share).map((e) => ({ family: e.family, family_raw: e.family_raw, char_share: +e.char_share.toFixed(3), pages: e.pages, weights: [...e.weights].slice(0, 8), sizes: [...e.sizes].slice(0, 8) }));
  const loaded = new Map(); for (const p of ok) for (const f of p.desktop.type.loaded_fonts) loaded.set(f.family_raw + f.weight + f.style, f);
  const fontFiles = [...new Set(ok.flatMap((p) => p.desktop.type.font_files))].slice(0, 40);
  const styles = new Map();
  for (const p of ok) for (const s of p.desktop.buttons.styles) { const k = [s.bg, s.color, s.radius, s.transform, s.border].join('|'); const e = styles.get(k) || { ...s, count: 0, pages: [] , examples: [] }; e.count += s.count; e.pages.push(p.path); for (const x of s.examples) if (e.examples.length < 6 && !e.examples.includes(x)) e.examples.push(x); styles.set(k, e); }
  const mergedStyles = [...styles.values()].sort((a, b) => (b.primary ? 1 : 0) - (a.primary ? 1 : 0) || b.count - a.count).slice(0, 10);
  const facts = { captured_at: meta.captured_at, prices: [], offers: [], shipping: [], guarantees: [], reviews: [], structured: [] };
  for (const p of ok) for (const k of Object.keys(facts)) if (Array.isArray(facts[k])) for (const v of p.desktop.facts[k] || []) { const at = p.captured_at || meta.captured_at, item = typeof v === 'string' ? { text: v, page: p.path, captured_at: at } : { ...v, page: p.path, captured_at: at }; if (facts[k].length < 40 && !facts[k].some((x) => (x.text || JSON.stringify(x)) === (item.text || JSON.stringify(item)))) facts[k].push(item); }
  const headlines = [...new Set(ok.flatMap((p) => p.desktop.voice.samples.filter((s) => s.kind === 'headline').map((s) => s.text)))];
  const bodyLines = [...new Set(ok.flatMap((p) => p.desktop.voice.samples.filter((s) => s.kind !== 'headline').map((s) => s.text)))];
  const samples = [...headlines.slice(0, 5).map((text) => ({ kind: 'headline', text })), ...bodyLines.slice(0, 5).map((text) => ({ kind: 'body', text }))];
  return {
    palette: lead.palette,
    pixel_palette: ok[0].pixel_palette?.desktop || null,
    type: { roles, families, loaded_fonts: [...loaded.values()].slice(0, 50), font_files: fontFiles, font_css: lead.type.font_css, scale: lead.type.scale },
    shape: lead.shape,
    buttons: { styles: mergedStyles, primary: lead.buttons.primary },
    links: lead.links,
    nav: lead.nav,
    footer: lead.footer,
    images: Object.fromEntries(ok.map((p) => [p.path, { count: p.desktop.images.count, per_1000px: p.desktop.images.per_1000px, area_share: p.desktop.images.area_share }])),
    voice: { samples, ctas: [...new Set(ok.flatMap((p) => p.desktop.voice.ctas))].slice(0, 16), stats: lead.voice.stats },
    facts,
    mobile: leadMobile ? { type_roles: leadMobile.type.roles, primary_button: leadMobile.buttons.primary, nav: { hamburger: leadMobile.nav.hamburger, items: leadMobile.nav.items.slice(0, 20), hidden_items: leadMobile.nav.hidden_items.slice(0, 30) }, horizontal_overflow: leadMobile.page.horizontal_overflow, sections: leadMobile.sections.length } : null,
    platform: lead.page.platform,
    css_variables: lead.css_variables,
  };
}

const pct = (n) => `${Math.round((n || 0) * 1000) / 10}%`;
const siteHost = (u) => { try { const x = new URL(u); return /^https?:$/.test(x.protocol) ? x.hostname.replace(/^www\./, '') : null; } catch { return null; } };

/**
 * Merge a new run into the capture on file. A page read again replaces its old entry; a page not read this time is
 * kept with its own date; a page that failed this time keeps its last good capture. The brand is then merged from
 * all of them, so the first page ever captured (usually home) still leads.
 */
export function mergeCapture(prev, next) {
  if (!prev || !Array.isArray(prev.pages)) return next;
  const ok = (p) => p.desktop && !p.desktop.error, notes = [...(next.notes || [])];
  const fresh = new Map(next.pages.map((p) => [p.url, p]));
  // A page that has never loaded is not carried forward.
  const pages = prev.pages.filter((p) => ok(p) || fresh.has(p.url)).map((p) => ({ ...p, captured_at: p.captured_at || prev.captured_at })).map((p) => {
    const n = fresh.get(p.url); if (!n) return p;
    fresh.delete(p.url);
    if (ok(n) || !ok(p)) return n;
    notes.push(`${p.path}: this run failed, so the capture from ${String(p.captured_at).slice(0, 10)} is kept`);
    return p;
  });
  pages.push(...fresh.values());
  const references = [...new Map([...(prev.references || []), ...(next.references || [])].map((r) => [r.url, r])).values()];
  const out = { ...next, source: prev.source || next.source, first_captured_at: prev.first_captured_at || prev.captured_at, runs: (prev.runs || 1) + 1, notes, pages, references };
  out.brand = mergeBrand(pages, out);
  return out;
}

/** A competitor or reference site: its look and headline lines only. No prices or offers are kept from it. */
export async function captureReference(browser, ref, { snippet, outDir, shotsDir, wait, block }) {
  const vp = VIEWPORTS[0], ctx = await newContext(browser, vp, block), page = await ctx.newPage(), out = { url: ref.url, kind: ref.kind, captured_at: new Date().toISOString() };
  try {
    await preparePage(page, ref.url, { wait });
    const shot = path.join(shotsDir, `ref-${(siteHost(ref.url) || 'site').replace(/[^a-z0-9]+/gi, '-')}-desktop-first.png`);
    await page.screenshot({ path: shot });
    const dna = await runSnippet(page, snippet), r = dna.type.roles, role = (k) => (r[k] ? [r[k].family, r[k].weight, r[k].size].filter(Boolean).join(' ') : undefined), b = dna.buttons.styles.find((s) => s.primary) || dna.buttons.styles[0];
    Object.assign(out, { title: dna.page.title, screenshot: path.relative(outDir, shot).split(path.sep).join('/'),
      look: { palette: dna.palette.slice(0, 5).map((c) => ({ hex: c.hex, area_share: c.area_share })), h1: role('h1'), body: role('body'), button: b ? [b.bg || 'no fill', `radius ${b.radius}`, b.transform !== 'none' && b.transform].filter(Boolean).join(', ') : undefined },
      headlines: (dna.voice.headlines || []).slice(0, 5) });
    console.log(`  ok  ${ref.kind.padEnd(10)} ${ref.url}  (look and ${out.headlines.length} headline lines only)`);
  } catch (e) { out.error = String(e.message || e).split('\n')[0]; console.log(`  fail ${ref.kind.padEnd(10)} ${ref.url}  ${out.error}`); } finally { await ctx.close(); }
  return out;
}

/** org-context.mjs (or its old name brand-file.mjs), beside this script or in ./tools. It builds the org context and works out what changed. */
export async function loadBrandFile() {
  for (const d of [HERE, path.join(process.cwd(), 'tools')]) for (const name of ['org-context.mjs', 'brand-file.mjs']) {
    const f = path.join(d, name);
    if (fs.existsSync(f)) { try { const m = await import(pathToFileURL(f).href); if (m.syncBrandFile) return m; } catch { /* try the next place */ } }
  }
  return null;
}

/** A short, measured summary a model can read first. Judgement lines are left for the model to write. */
export function summaryMarkdown(out) {
  const b = out.brand; if (!b) return '# Brand capture\n\nThe capture failed. See context/brand-dna.json for the errors.\n';
  const r = b.type.roles, role = (k) => (r[k] ? `${r[k].family} ${r[k].weight}, ${r[k].size}${r[k].transform && r[k].transform !== 'none' ? ', ' + r[k].transform : ''} (${r[k].font_loaded})` : 'not found');
  const p = b.buttons.primary, ps = b.buttons.styles[0];
  const lines = [
    `# Brand capture: ${out.pages[0]?.title || out.source}`,
    '',
    `Measured from ${out.source} on ${out.captured_at.slice(0, 10)} by capture-brand-dna.mjs ${VERSION} (${out.pages.length} page${out.pages.length === 1 ? '' : 's'}, 1440 and 390 px). Full data: context/brand-dna.json. Screenshots: context/screenshots/.`,
    '',
    '## Colour, by share of page area (desktop, first page)',
    ...b.palette.slice(0, 8).map((c) => `- ${c.hex} ${pct(c.area_share)} of area${c.text_share ? `, ${pct(c.text_share)} of text` : ''}: ${c.roles.join(', ')}`),
    ...(b.pixel_palette?.colors ? [`- By screenshot pixels: ${b.pixel_palette.colors.slice(0, 6).map((c) => `${c.hex} ${pct(c.share)}`).join(', ')}; photos ${pct(b.pixel_palette.image_share)}`] : []),
    '',
    '## Type',
    `- Headline (h1): ${role('h1')}`, `- Section titles (h2): ${role('h2')}`, `- Body: ${role('body')}`, `- Buttons: ${role('button')}`, `- Nav: ${role('nav')}`,
    `- Families by text share: ${b.type.families.slice(0, 4).map((f) => `${f.family} ${pct(f.char_share)}`).join(', ')}`,
    '',
    '## Shape and components',
    `- Primary button: ${ps ? `${ps.bg || 'no fill'} fill, ${ps.color} text, radius ${ps.radius}, ${ps.transform !== 'none' ? ps.transform + ', ' : ''}${ps.font} ${ps.weight} ${ps.size}` : 'not found'}${p ? ` (e.g. "${p.text}")` : ''}`,
    `- Radius most used: ${b.shape.radius.slice(0, 4).map((x) => `${x.value} x${x.count}`).join(', ') || 'square'}; square elements: ${b.shape.square_elements} of ${b.shape.painted_elements}`,
    `- Shadows: ${b.shape.shadows.length ? b.shape.shadows.slice(0, 2).map((s) => s.value).join(' / ') : 'none'}`,
    `- Nav: ${b.nav.items.slice(0, 10).map((i) => i.text).join(' / ') || 'icons only'}${b.nav.hamburger ? ' (menu button present)' : ''}`,
    `- Footer: ${b.footer ? `${b.footer.columns.length} columns, ${b.footer.link_count} links: ${b.footer.columns.map((c) => c.heading || '(untitled)').join(' / ')}` : 'not found'}`,
    '',
    '## Section order',
    ...out.pages.map((pg) => `- ${pg.path}: ${(pg.desktop?.sections || []).map((s) => s.kind + (s.heading ? ` "${s.heading.slice(0, 40)}"` : '')).join(' > ')}`),
    `- Images: ${Object.entries(b.images).map(([k, v]) => `${k} ${v.count} (${v.per_1000px} per 1000 px)`).join('; ')}`,
    '',
    '## Voice (verbatim)',
    ...b.voice.samples.map((s) => `- ${s.kind}: "${s.text}"`),
    `- Button words: ${b.voice.ctas.slice(0, 8).join(' / ')}`,
    '',
    `## Live facts (captured ${out.captured_at}; re-check before you publish)`,
    ...['prices', 'offers', 'shipping', 'guarantees', 'reviews'].map((k) => `- ${k}: ${b.facts[k].slice(0, 5).map((f) => f.text).join(' | ') || 'none found'}`),
    ...(b.facts.structured.length ? [`- structured data: ${b.facts.structured.slice(0, 3).map((s) => [s.name, s.price && `${s.currency || ''} ${s.price}`, s.rating && `rated ${s.rating} (${s.review_count})`].filter(Boolean).join(', ')).join(' | ')}`] : []),
    '',
    '## What this means (write these lines yourself, citing the numbers above)',
    '- Codes to keep:',
    '- What a new page must reuse (nav, footer, button, card):',
    '- Accent limits (which colour stays small, and at what share):',
    '- Gaps the capture could not fill:',
    '',
  ];
  return lines.join('\n');
}

export async function main(argv = process.argv.slice(2)) {
  let o;
  try { o = parseArgs(argv); } catch (e) { console.error(e.message); return 2; }
  const target = o.positional.find((p) => typeof p === 'string');
  if (o.help || !target) { console.log(HELP); return o.help ? 0 : 2; }
  const pw = loadPlaywright(o.playwright);
  if (!pw) { console.error(playwrightHelp()); return 2; }
  let snippet; try { snippet = readSnippet().text; } catch (e) { console.error(e.message); return 2; }
  let urls; try { urls = resolveTargets(target, o.positional.filter((p) => p !== target)); } catch (e) { console.error(e.message); return 2; }
  const outDir = path.resolve(o.out), shotsDir = path.join(outDir, 'screenshots'), jsonFile = path.join(outDir, 'brand-dna.json');
  let prev = null; try { prev = JSON.parse(fs.readFileSync(jsonFile, 'utf8')); } catch { /* first capture */ }
  if (prev && !o.replace && siteHost(prev.source) && siteHost(urls[0]) && siteHost(prev.source) !== siteHost(urls[0])) {
    console.error(`${path.relative(process.cwd(), jsonFile) || jsonFile} holds ${siteHost(prev.source)}, and an org context is for one business.\nFor a competitor or reference, add --competitor ${urls[0]} to a capture of ${siteHost(prev.source)}.\nFor another business, use --out <another folder>. To start again here, add --replace (the old capture is kept in history).`);
    return 2;
  }
  fs.mkdirSync(shotsDir, { recursive: true });
  const { browser, channel } = await launchBrowser(pw, o.channel).catch((e) => { console.error(e.message); return {}; });
  if (!browser) return 2;
  console.log(`Capturing ${urls.length} page(s) with ${channel}${o.block ? ', analytics tags blocked' : ''}:`);
  const captured_at = new Date().toISOString(), pages = [], references = [], used = new Set();
  try {
    for (const url of urls) {
      let label = pageSlug(url); while (used.has(label)) label += '-2'; used.add(label);
      pages.push(await capturePage(browser, url, { snippet, outDir, shotsDir, wait: o.wait, block: o.block, full: o.full, label }));
    }
    for (const ref of o.refs) references.push(await captureReference(browser, { ...ref, url: /^https?:\/\//i.test(ref.url) ? ref.url : 'https://' + ref.url }, { snippet, outDir, shotsDir, wait: o.wait, block: o.block }));
  } finally { await browser.close(); }
  let out = { schema: 'ai-blocks-brand-dna/1', tool: `capture-brand-dna.mjs ${VERSION}`, method: 'script', source: urls[0], captured_at, browser: channel, viewports: VIEWPORTS.map((v) => `${v.width}x${v.height}`), notes: [], brand: null, pages, references: references.filter((r) => !r.error) };
  for (const pg of pages) for (const vp of ['desktop', 'mobile']) for (const n of pg[vp]?.notes || []) out.notes.push(`${pg.path} ${vp}: ${n}`);
  for (const r of references) if (r.error) out.notes.push(`${r.kind} ${r.url}: ${r.error}`);
  // Never overwrite: keep the capture this run replaces, then merge the new pages into it.
  // The org context folder: context/org-context/, or an older context/brand-file/ until it is moved.
  const orgFolder = !fs.existsSync(path.join(outDir, 'org-context')) && fs.existsSync(path.join(outDir, 'brand-file')) ? 'brand-file' : 'org-context';
  const historyDir = path.join(outDir, orgFolder, 'history');
  if (prev) {
    fs.mkdirSync(historyDir, { recursive: true });
    fs.copyFileSync(jsonFile, path.join(historyDir, `${String(prev.captured_at || captured_at).slice(0, 16).replace(/[-:]/g, '').replace('T', '-')}-brand-dna.json`));
  }
  out = prev && !o.replace ? mergeCapture(prev, out) : { ...out, brand: mergeBrand(pages, out) };
  // The org context: facts, offers, look, voice and references, each line with its source and date, and what changed.
  const bf = await loadBrandFile();
  if (bf) {
    if (prev && !fs.existsSync(path.join(outDir, orgFolder, 'offers.json'))) bf.syncBrandFile(outDir, { dna: prev, now: new Date(prev.captured_at || captured_at) });
    const synced = bf.syncBrandFile(outDir, { dna: out, now: new Date(captured_at) });
    out.changes = prev ? synced.changes.slice(0, 20).map((c) => c.text) : [];
    out.changes_since = prev ? prev.captured_at || null : null;
    out.brand_file = synced.dir;
  } else out.notes.push('org-context.mjs is not beside this script, so the org context was not updated and the changes since last time were not worked out. Put it there and run: node org-context.mjs migrate');
  fs.writeFileSync(jsonFile, JSON.stringify(out, null, 1));
  const mdFile = path.join(outDir, 'brand-dna.md');
  if (!fs.existsSync(mdFile) || o.overwriteMd) fs.writeFileSync(mdFile, summaryMarkdown(out));
  // The receipt a job record or gate can cite: which file, its exact bytes, where it came from, when and how.
  const receipt = { path: path.relative(process.cwd(), jsonFile).split(path.sep).join('/') || 'context/brand-dna.json', sha256: createHash('sha256').update(fs.readFileSync(jsonFile)).digest('hex'),
    source: out.source, pages: pages.map((p) => p.path), captured_at, method: 'script', tool: out.tool, screenshots: path.relative(process.cwd(), shotsDir).split(path.sep).join('/') };
  fs.writeFileSync(path.join(outDir, 'brand-dna.receipt.json'), JSON.stringify(receipt, null, 1));
  const failed = pages.filter((p) => !p.desktop || p.desktop.error).length;
  console.log(`\n${prev && !o.replace ? `Merged ${pages.length} page(s) into` : 'Wrote'} ${path.relative(process.cwd(), jsonFile) || jsonFile} (${out.pages.length} page(s) in all) and ${pages.length * 4} screenshots in ${path.relative(process.cwd(), shotsDir) || shotsDir}.`);
  if (prev) console.log(`The capture from ${String(prev.captured_at).slice(0, 10)} is kept in ${path.relative(process.cwd(), historyDir) || historyDir}.`);
  if (out.brand_file) console.log(`Org context updated: ${out.brand_file}. Check it with: node ${path.relative(process.cwd(), path.join(HERE, 'org-context.mjs')).split(path.sep).join('/')} status`);
  if (out.changes?.length) console.log('Changed since last time:\n- ' + out.changes.join('\n- '));
  else if (prev && bf) console.log('Changed since last time: nothing.');
  console.log(`Receipt: path ${receipt.path} | sha256 ${receipt.sha256} | source ${receipt.source} | date ${captured_at} | method script`);
  if (out.notes.length) console.log('Notes:\n- ' + out.notes.join('\n- '));
  if (failed) console.log(`${failed} page(s) failed. Check the URL, or capture them by hand with the snippet.`);
  return failed === pages.length ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((code) => { process.exitCode = code; }, (e) => { console.error(e?.stack || e); process.exitCode = 1; });
}
