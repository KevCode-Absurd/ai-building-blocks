#!/usr/bin/env node
// check-creative-set.mjs (AI Blocks, brand-dna-capture) - version 1.2.0
//
// Checks a set of static ad creatives before hand-over, from the pixels and from the set's manifest.
//   node check-creative-set.mjs <folder of creatives> [--manifest <file>] [--size 1080x1080] [--fonts "Lato,Nanum Myeongjo"]
//     [--type <type-report.json>] [--no-buttons] [--no-type] [--json]
//   node check-creative-set.mjs probe <folder of creative .html files> --out <creatives>/type-report.json [--size 1080x1080]
//
// From the pixels (PNG, plain Node, no packages):
//   - size and shape: every creative is the asked size (default 1080x1080)
//   - layout variety: creatives built on the same template are grouped by where their flat panels and colours
//     sit (edge shapes on a coarse grid, mirror-blind, so an arch on the left matches one on the right). A set of
//     10 or more needs at least 4 layouts, and no layout on more than 30% of the set
//   - near-copies: two creatives that are almost the same picture
//   - a low-contrast product box (from the manifest): a note to look at it, since pearls on cream read low too
//   - the button: where the manifest says a button is drawn (cta_box), the pixels must show one solid fill that
//     stands out from what is around it. A set of 10 or more needs a button on the image on at least 70% of its
//     creatives (--no-buttons when the brief says no buttons)
// From the manifest (creatives/manifest.json, written by whoever made the set; one entry per creative):
//   { "file": "01-x.png", "layout": "arch", "product": "Celestial Navaratna Bracelet",
//     "product_box": [x, y, w, h] (fractions of the frame), "headline": "...", "body": "...", "cta": "...",
//     "price": "₹21,130", "review": { "quote": "...", "about": "Celestial Navaratna Bracelet" }, "segment": "...",
//     "format": "notes list", "cta_box": [x, y, w, h], "moment": "Margazhi season", "claim_source": "FAQ: ..." }
//   - the product fills at least a third of the frame
//   - every creative has a headline and a CTA; no empty field shipped as a blank bar
//   - money is written the local way (₹10,000 or ₹1,00,000, never ₹10.000); no placeholders ([X], TBD, {{...}})
//   - a review quote sits only on the product it is about
//   - formats: a set of 10 or more names a format for each creative and uses at least 3 native formats (a notes
//     list, a chat, a comparison table, an explainer, a review card, a before-and-after...). Pixel layouts can
//     differ while the set still reads as one template of photo plus panel
//   - absolute claims ("every stone we set", "all our pieces", "100%", "guaranteed", "the only") need a
//     claim_source that was checked against the whole range, or softer words. "always" and "never" are notes
//   - a set of 10 or more with no local or seasonal moment (the moment field) gets a note
// How the type renders (from a type report: the probe runs in the page that draws each creative, in a browser):
//   - every font loaded (no fallback font), and with --fonts, every text is in one of the brand's fonts
//   - text 40px and up kerns the pairs a good font always kerns (Wo, Te, Ya, AV, LT ...): a font that leaves
//     "Wo" unkerned prints "W orn now" with a gap
//   - no text under 18px on a 1080 frame, and a note under 24px (hard to read on a phone)
//   - a number like 15,710 is not set in a face whose comma is nearly all dot (a hairline tail), where it reads 15.710
//   - no photo is drawn more than 1.3x bigger than its own pixels (it looks soft)
//   The probe: node check-creative-set.mjs probe <html folder> (needs Playwright), or in your own renderer:
//     const { typeProbe } = await import('./check-creative-set.mjs'); report[file] = await page.evaluate(typeProbe, { canvas: 1080 });
//   Save { "01-x.png": <probe>, ... } as type-report.json next to the creatives, or put it in each manifest entry as "type".
// It exits 1 when anything fails, so it can gate a hand-over. It only reads files (probe also opens the pages).
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

export const VERSION = '1.2.0';
export const RULES = Object.freeze({ minLayouts: 4, maxLayoutShare: 0.3, minSetForVariety: 10, minProductShare: 1 / 3, minProductContrast: 22, minButtonShare: 0.7, minNativeFormats: 3, minTextPx: 18, readTextPx: 24, minKernPx: 40, minCommaTail: 0.15, maxUpscale: 1.3 });

// ---------- PNG: enough of a decoder for 8-bit, non-interlaced images (what browsers and image APIs save) ----------
export function decodePng(buf) {
  if (buf.length < 8 || buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  let p = 8, w = 0, h = 0, depth = 0, type = 0, interlace = 0; const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), kind = buf.toString('ascii', p + 4, p + 8), data = buf.subarray(p + 8, p + 8 + len);
    if (kind === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); depth = data[8]; type = data[9]; interlace = data[12]; }
    else if (kind === 'IDAT') idat.push(data); else if (kind === 'IEND') break;
    p += 12 + len;
  }
  const channels = { 0: 1, 2: 3, 4: 2, 6: 4 }[type];
  if (depth !== 8 || !channels || interlace) throw new Error(`unsupported PNG (depth ${depth}, colour type ${type}${interlace ? ', interlaced' : ''})`);
  const raw = zlib.inflateSync(Buffer.concat(idat)), stride = w * channels, out = Buffer.alloc(h * stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], src = y * (stride + 1) + 1, dst = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= channels ? out[dst + x - channels] : 0, b = y ? out[dst - stride + x] : 0, c = y && x >= channels ? out[dst - stride + x - channels] : 0;
      const v = raw[src + x];
      out[dst + x] = (f === 0 ? v : f === 1 ? v + a : f === 2 ? v + b : f === 3 ? v + ((a + b) >> 1) : (() => { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); return v + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); })()) & 255;
    }
  }
  return { width: w, height: h, channels, data: out };
}
const lum = (r, g, b) => 0.299 * r + 0.587 * g + 0.114 * b;
function pixel(img, x, y) { const i = (y * img.width + x) * img.channels, d = img.data; return img.channels >= 3 ? [d[i], d[i + 1], d[i + 2]] : [d[i], d[i], d[i]]; }

/** A coarse map of the picture: for each cell of an n x n grid, its mean colour and whether it is a flat panel. */
export function layoutMap(img, n = 8) {
  const cells = [];
  for (let cy = 0; cy < n; cy++) for (let cx = 0; cx < n; cx++) {
    const x0 = Math.floor((cx * img.width) / n), x1 = Math.floor(((cx + 1) * img.width) / n), y0 = Math.floor((cy * img.height) / n), y1 = Math.floor(((cy + 1) * img.height) / n);
    const step = Math.max(1, Math.floor((x1 - x0) / 12));
    let r = 0, g = 0, b = 0, l2 = 0, k = 0;
    for (let y = y0; y < y1; y += step) for (let x = x0; x < x1; x += step) { const [pr, pg, pb] = pixel(img, x, y); r += pr; g += pg; b += pb; const L = lum(pr, pg, pb); l2 += L * L; k++; }
    r /= k; g /= k; b /= k; const L = lum(r, g, b), sd = Math.sqrt(Math.max(0, l2 / k - L * L));
    cells.push({ r, g, b, L, sd, flat: sd < 10 });
  }
  return cells;
}
/** 0 = same template, 1 = nothing alike. Weighs where the flat panels sit and the colour of panels both share. */
export function layoutDistance(a, b) {
  let maskDiff = 0, colour = 0, both = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i].flat !== b[i].flat) maskDiff++;
    if (a[i].flat && b[i].flat) { both++; colour += (Math.abs(a[i].r - b[i].r) + Math.abs(a[i].g - b[i].g) + Math.abs(a[i].b - b[i].b)) / 765; }
  }
  const flatA = a.filter((c) => c.flat).length, flatB = b.filter((c) => c.flat).length;
  if (flatA + flatB < 6) return 0.5 + 0.5 * meanDiff(a, b); // two full-bleed photos: judge by the whole picture only
  return 0.6 * (maskDiff / a.length) + 0.4 * (both ? colour / both : 1);
}
const meanDiff = (a, b) => a.reduce((n, c, i) => n + (Math.abs(c.r - b[i].r) + Math.abs(c.g - b[i].g) + Math.abs(c.b - b[i].b)) / 765, 0) / a.length;
/** Groups creatives that share a template. Each group is seeded by its first member. */
export function groupLayouts(maps, threshold = 0.16) {
  const groups = [];
  maps.forEach((m, i) => { const g = groups.find((gr) => layoutDistance(maps[gr[0]], m) < threshold); if (g) g.push(i); else groups.push([i]); });
  return groups;
}

/** The shape of a picture: edge directions on a coarse grid, so the same template matches whatever photo sits in it. */
const G = 64, CELLS = 8, BINS = 6;
function greyGrid(img) {
  const g = new Float32Array(G * G);
  for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) {
    const x0 = Math.floor((x * img.width) / G), x1 = Math.floor(((x + 1) * img.width) / G), y0 = Math.floor((y * img.height) / G), y1 = Math.floor(((y + 1) * img.height) / G);
    let s = 0, k = 0; for (let yy = y0; yy < y1; yy += 2) for (let xx = x0; xx < x1; xx += 2) { s += lum(...pixel(img, xx, yy)); k++; }
    g[y * G + x] = k ? s / k : 0;
  }
  return g;
}
function edgeHistogram(g, flip) {
  const at = (x, y) => g[y * G + (flip ? G - 1 - x : x)], v = new Float32Array(CELLS * CELLS * BINS), per = G / CELLS;
  for (let y = 1; y < G - 1; y++) for (let x = 1; x < G - 1; x++) {
    const gx = at(x + 1, y) - at(x - 1, y), gy = at(x, y + 1) - at(x, y - 1), m = Math.hypot(gx, gy); if (m < 8) continue;
    let a = Math.atan2(gy, gx); if (a < 0) a += Math.PI;
    v[(Math.floor(y / per) * CELLS + Math.floor(x / per)) * BINS + Math.min(BINS - 1, Math.floor((a / Math.PI) * BINS))] += m;
  }
  const n = Math.hypot(...v) || 1; return v.map((x) => x / n);
}
export function shapeOf(img) { const g = greyGrid(img); return [edgeHistogram(g, false), edgeHistogram(g, true)]; }
const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };
/** 0 = same template, 1 = nothing alike; a mirrored layout counts as the same. */
export function shapeDistance(a, b) { return 1 - Math.max(dot(a[0], b[0]), dot(a[0], b[1])); }
/** Groups creatives that share a template: any two closer than the threshold join, and so do their groups. */
export function groupShapes(shapes, threshold = 0.3) {
  const par = shapes.map((_, i) => i), root = (i) => (par[i] === i ? i : (par[i] = root(par[i])));
  for (let i = 0; i < shapes.length; i++) for (let j = i + 1; j < shapes.length; j++) if (shapeDistance(shapes[i], shapes[j]) < threshold) par[root(i)] = root(j);
  const m = new Map(); shapes.forEach((_, i) => { const r = root(i); if (!m.has(r)) m.set(r, []); m.get(r).push(i); });
  return [...m.values()];
}

/** Luminance spread inside a box: a product that has faded into a gradient reads as low contrast. */
export function boxContrast(img, [bx, by, bw, bh]) {
  const x0 = Math.max(0, Math.floor(bx * img.width)), y0 = Math.max(0, Math.floor(by * img.height)), x1 = Math.min(img.width, Math.ceil((bx + bw) * img.width)), y1 = Math.min(img.height, Math.ceil((by + bh) * img.height));
  const step = Math.max(1, Math.floor((x1 - x0) / 60)); let s = 0, s2 = 0, k = 0;
  for (let y = y0; y < y1; y += step) for (let x = x0; x < x1; x += step) { const L = lum(...pixel(img, x, y)); s += L; s2 += L * L; k++; }
  return k ? Math.sqrt(Math.max(0, s2 / k - (s / k) ** 2)) : 0;
}

/** Does the box look like a button? One fill colour covers much of it, and that fill stands out from the ring around it. */
export function buttonLook(img, [bx, by, bw, bh]) {
  const W = img.width, H = img.height, x0 = Math.max(0, Math.floor(bx * W)), y0 = Math.max(0, Math.floor(by * H)), x1 = Math.min(W, Math.ceil((bx + bw) * W)), y1 = Math.min(H, Math.ceil((by + bh) * H));
  if (x1 - x0 < 4 || y1 - y0 < 4) return { ok: false, why: 'the box is too small to be a button' };
  const q = (c) => c.map((v) => v >> 5).join(','), counts = new Map(), step = Math.max(1, Math.floor((x1 - x0) / 80));
  let k = 0;
  for (let y = y0; y < y1; y += step) for (let x = x0; x < x1; x += step) { const key = q(pixel(img, x, y)); counts.set(key, (counts.get(key) || 0) + 1); k++; }
  const [topKey, topN] = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  const fill = topKey.split(',').map((v) => Number(v) * 32 + 16), share = topN / k;
  // The ring: a band around the box, half the box height wide.
  const pad = Math.max(3, Math.round((y1 - y0) / 2)); let rr = 0, rg = 0, rb = 0, rk = 0;
  for (let y = Math.max(0, y0 - pad); y < Math.min(H, y1 + pad); y += step) for (let x = Math.max(0, x0 - pad); x < Math.min(W, x1 + pad); x += step) {
    if (x >= x0 && x < x1 && y >= y0 && y < y1) continue; const [r, g, b] = pixel(img, x, y); rr += r; rg += g; rb += b; rk++;
  }
  const ring = rk ? [rr / rk, rg / rk, rb / rk] : fill, apart = Math.hypot(fill[0] - ring[0], fill[1] - ring[1], fill[2] - ring[2]);
  if (share < 0.45) return { ok: false, share, apart, fill, why: `no solid fill in the box (its main colour covers ${Math.round(share * 100)}%)` };
  if (apart < 60) return { ok: false, share, apart, fill, why: 'the fill does not stand out from what is around it' };
  return { ok: true, share, apart, fill };
}

/** Native formats: ones that look like something people read in a feed, not a product poster. */
const NATIVE = [['notes', /\b(notes?|checklist|to-?do|list)\b/], ['chat', /\b(chat|dm|whatsapp|message|text thread|imessage)\b/], ['table', /\b(table|comparison|compare|vs\.?|versus|chart)\b/],
  ['explainer', /\b(explainer|how[- ]to|guide|faq|q ?& ?a|myth|steps?)\b/], ['review', /\b(review|testimonial|quote card|rating)\b/], ['ugc', /\b(ugc|selfie|unboxing|phone photo)\b/],
  ['before-after', /\b(before|after|then and now|photo vs)\b/], ['post', /\b(tweet|post|meme|receipt|calculator|map)\b/]];
export function nativeFormat(format) { const f = String(format || '').toLowerCase(); const hit = NATIVE.find(([, re]) => re.test(f)); return hit ? hit[0] : null; }
const ABSOLUTE = /\b(?:every|all)\s+(?:of\s+)?(?:[\p{L}'’]+\s+){0,2}?(?:stones?|pieces?|gems?|gemstones?|diamonds?|products?|items?|orders?|designs?|rings?|customers?|ingredients?|batch(?:es)?|plans?|users?|clients?|materials?)\b|\b(?:100\s?%|guaranteed|the only|no one else|purest)\b/iu;
const SOFT_ABSOLUTE = /\b(?:always|never)\b/i;
export function claimIssues(entry) {
  const fails = [], notes = [];
  for (const k of ['headline', 'body']) {
    const t = String(entry[k] ?? ''), m = t.match(ABSOLUTE);
    if (m && !String(entry.claim_source || '').trim()) fails.push(`${k} makes an absolute claim ("${m[0]}") with no claim_source: check it against the whole range (a lab-grown or budget line counts) and name the source, or soften it`);
    else if (SOFT_ABSOLUTE.test(t) && !entry.claim_source) notes.push(`${k} says "${t.match(SOFT_ABSOLUTE)[0]}": if it is a promise, check it`);
  }
  return { fails, notes };
}

// ---------- text checks ----------
const MONEY_BAD = /(?:₹|rs\.?|inr)\s?\d{1,3}\.\d{3}\b|(?:₹|rs\.?|inr)\s?\d{5,}\b(?![,.]\d)/i;
const PLACEHOLDER = /\[(?:x|date|name|link|price|tbd|todo|insert[^\]]*)\]|\bTBD\b|\bTODO\b|lorem ipsum|\{\{[^}]*\}\}|\bXX+\b/i;
export function textIssues(entry) {
  const out = [];
  const fields = ['headline', 'body', 'cta', 'price'].map((k) => [k, entry[k]]);
  if (!String(entry.headline || '').trim()) out.push('no headline');
  if (!String(entry.cta || '').trim()) out.push('no CTA button text');
  for (const [k, v] of fields) {
    const t = String(v ?? '');
    if (v !== undefined && v !== null && !t.trim() && (k === 'price')) out.push(`${k} is empty: an empty bar or button would ship`);
    if (MONEY_BAD.test(t)) out.push(`${k} writes money the wrong way ("${t.match(MONEY_BAD)[0]}"): use ₹10,000 or ₹1,00,000`);
    if (PLACEHOLDER.test(t)) out.push(`${k} has a placeholder ("${t.match(PLACEHOLDER)[0]}")`);
  }
  if (entry.review && entry.product && entry.review.about && norm(entry.review.about) !== norm(entry.product)) out.push(`the review quote is about "${entry.review.about}" but sits on "${entry.product}"`);
  return out;
}
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// ---------- how the type renders ----------
/** Runs inside the page that draws one creative (Playwright: await page.evaluate(typeProbe, { canvas: 1080 })).
 *  Self-contained on purpose: the browser gets only this function's source. Reads fonts, kerning, sizes and photo scale. */
export async function typeProbe(opts = {}) {
  const canvas = opts.canvas || 1080, root = document.querySelector(opts.root || 'body') || document.body;
  await document.fonts.ready;
  const k = canvas / (root.getBoundingClientRect().width || innerWidth);
  const els = [...root.querySelectorAll('*')]; // before the probe adds its own measuring span
  // Pairs a good text or display font always kerns, and a few to tell whether a font kerns at all.
  const MUST = { T: 'aeoruwy', V: 'aeo', W: 'aeo', Y: 'aeo', L: 'TVWY', A: 'TVWY' }, CONTROL = ['To', 'Ta', 'AV', 'Yo', 'LT'];
  const sp = document.createElement('span');
  sp.style.cssText = 'position:absolute;left:-99999px;top:0;white-space:pre;font-size:100px;letter-spacing:0;word-spacing:0';
  document.body.appendChild(sp);
  const width = (cs, t, fam) => {
    sp.style.fontFamily = fam || cs.fontFamily; sp.style.fontWeight = cs.fontWeight; sp.style.fontStyle = cs.fontStyle;
    sp.style.fontStretch = cs.fontStretch; sp.style.fontFeatureSettings = cs.fontFeatureSettings; sp.style.fontVariationSettings = cs.fontVariationSettings;
    sp.style.fontKerning = cs.fontKerning === 'none' ? 'none' : 'normal'; sp.textContent = t; return sp.getBoundingClientRect().width;
  };
  const kernOf = (cs, ab) => (width(cs, ab) - width(cs, ab[0]) - width(cs, ab[1])) / 100;
  // How much of the comma's ink hangs below the baseline. A hairline tail (under ~15%) makes 15,710 read as 15.710.
  const cv = document.createElement('canvas'); cv.width = 200; cv.height = 300; const cx = cv.getContext('2d', { willReadFrequently: true });
  const commaTail = (cs) => {
    cx.clearRect(0, 0, 200, 300); cx.font = `${cs.fontStyle} ${cs.fontWeight} 160px ${cs.fontFamily}`; cx.fillStyle = '#000'; cx.textBaseline = 'alphabetic'; cx.fillText(',', 20, 150);
    const d = cx.getImageData(0, 0, 200, 300).data; let up = 0, down = 0;
    for (let y = 0; y < 300; y++) for (let x = 0; x < 200; x++) if (d[(y * 200 + x) * 4 + 3] > 127) { if (y >= 150) down++; else up++; }
    return up + down ? Math.round((down / (up + down)) * 100) / 100 : null;
  };
  const visible = (cs, r) => r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0;
  const texts = [], kern = [], fonts = [], images = [], seen = new Set(), seenFont = new Set();
  for (const el of els) {
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim();
    if (!own) continue;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect(); if (!visible(cs, r)) continue;
    const fam = cs.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '');
    const generic = /^(serif|sans-serif|monospace|cursive|fantasy|system-ui|ui-serif|ui-sans-serif)$/i.test(fam);
    // A font that did not load draws the same as the fallback after it.
    const loaded = generic || ['monospace', 'serif'].some((g) => Math.abs(width(cs, own + 'WMiw', `"${fam}", ${g}`) - width(cs, own + 'WMiw', g)) > 0.5);
    const px = Math.round(parseFloat(cs.fontSize) * k * 10) / 10;
    texts.push({ text: own.slice(0, 80), font: fam, weight: cs.fontWeight, loaded, px, kerning: cs.fontKerning });
    const fk = `${fam}|${cs.fontWeight}|${cs.fontStyle}`;
    if (!seenFont.has(fk)) { seenFont.add(fk); fonts.push({ font: fam, weight: cs.fontWeight, kerns: CONTROL.some((pr) => kernOf(cs, pr) < -0.01), off: cs.fontKerning === 'none', commaTail: commaTail(cs) }); }
    for (let i = 0; i + 1 < own.length; i++) {
      const ab = own[i] + own[i + 1]; if (!(MUST[own[i]] || '').includes(own[i + 1])) continue;
      const key = `${fk}|${ab}`; if (seen.has(key)) continue; seen.add(key);
      kern.push({ pair: ab, font: fam, weight: cs.fontWeight, kern: Math.round(kernOf(cs, ab) * 1000) / 1000, px, sample: own.slice(Math.max(0, i - 10), i + 12), off: cs.fontKerning === 'none' });
    }
  }
  const natural = (src) => new Promise((res) => { const im = new Image(); im.onload = () => res([im.naturalWidth, im.naturalHeight]); im.onerror = () => res(null); im.src = src; });
  for (const el of els) {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect(); if (!visible(cs, r)) continue;
    let src = null, nat = null, fit = 'fill';
    if (el.tagName === 'IMG') { if (!el.naturalWidth) continue; src = el.currentSrc || el.src; nat = [el.naturalWidth, el.naturalHeight]; fit = cs.objectFit; }
    else {
      const m = /url\(["']?([^"')]+)["']?\)/.exec(cs.backgroundImage || ''); if (!m) continue;
      src = m[1]; nat = await natural(src); const bs = cs.backgroundSize;
      fit = bs === 'contain' ? 'contain' : /^auto( auto)?$/.test(bs) ? 'none' : 'cover';
    }
    if (!nat || !nat[0] || !nat[1]) continue;
    const sx = r.width / nat[0], sy = r.height / nat[1];
    const s = (fit === 'contain' || fit === 'scale-down' ? Math.min(sx, sy) : fit === 'none' ? 1 : Math.max(sx, sy)) * k;
    images.push({ src: src.startsWith('data:') ? 'an inline image' : decodeURIComponent(src.split(/[\\/]/).pop()).slice(0, 80), natural: nat, drawn: [Math.round(r.width * k), Math.round(r.height * k)], scale: Math.round(s * 100) / 100 });
  }
  sp.remove();
  return { canvas, texts, fonts, kern, images };
}
const short = (t, n = 40) => { const s = String(t); return s.length > n ? `${s.slice(0, n - 1)}…` : s; };
/** What the type report says about one creative. */
export function typeIssues(p, { fonts = null, rules = RULES } = {}) {
  const fails = [], notes = [];
  if (!p || !Array.isArray(p.texts)) return { fails, notes: ['no type report for this creative'] };
  const f = 1080 / (p.canvas || 1080), texts = p.texts, brand = fonts && fonts.map((x) => x.toLowerCase());
  const done = new Set(), once = (key, msg) => { if (!done.has(key)) { done.add(key); fails.push(msg); } };
  for (const t of texts) {
    if (!t.loaded) once(`fb|${t.font}`, `"${short(t.text)}" draws in a fallback font: "${t.font}" did not load. Load the font file before the screenshot`);
    else if (brand && !brand.includes(String(t.font).toLowerCase())) once(`bf|${t.font}`, `"${short(t.text)}" is set in ${t.font}, which is not one of the brand's fonts (${fonts.join(', ')})`);
  }
  for (const fo of p.fonts || []) if (fo.off) once(`off|${fo.font}`, `${fo.font} has font-kerning turned off, so letters sit unevenly: remove font-kerning: none`);
  // A font that kerns "To" but not "Wo" prints the gap the Gehna round 5 judges saw ("W orn now").
  for (const kp of p.kern || []) {
    if (kp.off || Math.abs(kp.kern) >= 0.005 || kp.px * f < rules.minKernPx) continue;
    const fo = (p.fonts || []).find((x) => x.font === kp.font && x.weight === kp.weight);
    if (fo && !fo.kerns) once(`nk|${kp.font}`, `${kp.font} does not kern at all (tested To, AV, Yo), so "${short(kp.sample)}" shows gaps. Use the brand's own font file, or a cut that kerns`);
    else once(`k|${kp.font}|${kp.pair}`, `${kp.font} does not kern "${kp.pair}" ("${short(kp.sample)}"), so it prints with a gap after "${kp.pair[0]}". Use the brand's own font file, or a cut that kerns the pair`);
  }
  const list = (ts) => `${ts.slice(0, 3).map((t) => `${Math.round(t.px * f)}px "${short(t.text, 28)}"`).join(', ')}${ts.length > 3 ? ` and ${ts.length - 3} more` : ''}`;
  const tiny = texts.filter((t) => t.px * f < rules.minTextPx), small = texts.filter((t) => t.px * f >= rules.minTextPx && t.px * f < rules.readTextPx);
  if (tiny.length) fails.push(`text under ${rules.minTextPx}px on a 1080 frame cannot be read on a phone: ${list(tiny)}. Make it bigger or cut it`);
  if (small.length) notes.push(`small text (under ${rules.readTextPx}px on a 1080 frame): ${list(small)}. Look at it at phone size; cut words before shrinking them`);
  // A comma that is nearly all dot: "15,710" reads as "15.710" (the Gehna round 5 judges saw it in Bodoni Moda).
  for (const t of texts) {
    if (!/\d,\d/.test(t.text)) continue;
    const fo = (p.fonts || []).find((x) => x.font === t.font && x.weight === t.weight);
    if (fo && typeof fo.commaTail === 'number' && fo.commaTail < rules.minCommaTail) once(`cm|${t.font}|${t.weight}`, `"${short(t.text)}" is set in ${t.font}, whose comma is nearly all dot (${Math.round(fo.commaTail * 100)}% tail), so ${(t.text.match(/[^\s]*\d,\d[\d,]*/) || [''])[0]} reads like a decimal. Set numbers in the body font`);
  }
  for (const im of p.images || []) if (im.scale > rules.maxUpscale) once(`im|${im.src}`, `${im.src} is drawn at ${im.scale}x its own pixels (${im.natural[0]}px wide shown at ${im.drawn[0]}px), so it will look soft. Use a bigger source or draw it smaller`);
  return { fails, notes };
}
/** Finds the type report for one creative file: the manifest's "type", or type-report.json by file, html or number. */
function typeFor(file, entry, report) {
  if (entry && entry.type) return entry.type;
  if (!report) return null;
  const stem = file.replace(/\.[^.]+$/, ''), num = (file.match(/^\d+/) || [])[0];
  const htmlKey = entry && entry.html ? path.basename(entry.html) : null;
  for (const key of [file, htmlKey, `${stem}.html`]) if (key && report[key]) return report[key];
  if (num) { const hit = Object.keys(report).find((x) => (x.match(/^\d+/) || [])[0] === num); if (hit) return report[hit]; }
  return null;
}

// ---------- the whole set ----------
export function checkSet(dir, { manifest = null, size = '1080x1080', rules = RULES, buttons = true, type = true, fonts = null, typeReport = null } = {}) {
  const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
  const mPath = manifest || path.join(dir, 'manifest.json');
  let entries = null;
  if (fs.existsSync(mPath)) { const doc = JSON.parse(fs.readFileSync(mPath, 'utf8')); entries = Array.isArray(doc) ? doc : doc.creatives || []; }
  const tPath = typeReport || path.join(dir, 'type-report.json');
  const report = fs.existsSync(tPath) ? JSON.parse(fs.readFileSync(tPath, 'utf8')) : null;
  const [sw, sh] = size.split('x').map(Number);
  const fails = [], notes = [], per = [];
  const maps = [], decoded = new Map();
  for (const f of files) {
    const row = { file: f, fails: [], notes: [] };
    if (/\.png$/i.test(f)) {
      try { const img = decodePng(fs.readFileSync(path.join(dir, f))); decoded.set(f, img); maps.push({ f, map: layoutMap(img), shape: shapeOf(img) }); if (img.width !== sw || img.height !== sh) row.fails.push(`is ${img.width}x${img.height}, not ${size}`); }
      catch (err) { row.notes.push(`pixels not read: ${err.message}`); }
    } else row.notes.push('not a PNG: pixel checks skipped (save PNG)');
    per.push(row);
  }
  // Layout variety, from the pixels.
  const groups = groupShapes(maps.map((m) => m.shape)).map((g) => g.map((i) => maps[i].f)).sort((a, b) => b.length - a.length);
  const n = files.length;
  if (n >= rules.minSetForVariety) {
    if (groups.length < rules.minLayouts) fails.push(`only ${groups.length} layout${groups.length === 1 ? '' : 's'} across ${n} creatives (the pixels group them); make at least ${rules.minLayouts}`);
    if (groups[0] && groups[0].length / n > rules.maxLayoutShare) fails.push(`${groups[0].length} of ${n} creatives share one layout (${groups[0].slice(0, 4).join(', ')}${groups[0].length > 4 ? ', ...' : ''}); no layout on more than ${Math.round(rules.maxLayoutShare * 100)}% of the set`);
  }
  for (let i = 0; i < maps.length; i++) for (let j = i + 1; j < maps.length; j++) if (meanDiff(maps[i].map, maps[j].map) < 0.02) fails.push(`${maps[i].f} and ${maps[j].f} are near-copies`);
  // The manifest: what the maker says each creative is.
  if (!entries) {
    if (n >= 5) fails.push(`no manifest: write ${path.basename(mPath)} with one entry per creative (layout, product, product_box, headline, body, cta, price, review) so the text and product checks can run`);
  } else {
    const declared = new Set(entries.map((e) => e.layout).filter(Boolean));
    if (n >= rules.minSetForVariety && declared.size < rules.minLayouts) fails.push(`the manifest names only ${declared.size} layouts`);
    let withButton = 0; const natives = new Set(), fills = [];
    for (const e of entries) {
      const row = per.find((r) => r.file === e.file); if (!row) { fails.push(`manifest names ${e.file}, which is not in the folder`); continue; }
      row.fails.push(...textIssues(e));
      const c = claimIssues(e); row.fails.push(...c.fails); row.notes.push(...c.notes);
      const nf = nativeFormat(e.format); if (nf) natives.add(nf);
      if (Array.isArray(e.cta_box) && e.cta_box.length === 4) {
        const img = decoded.get(e.file);
        if (!img) withButton++;
        else { const b = buttonLook(img, e.cta_box); if (b.ok) { withButton++; fills.push(b.fill); } else row.fails.push(`the cta_box does not look like a button in the pixels: ${b.why}`); }
      }
      if (Array.isArray(e.product_box) && e.product_box.length === 4) {
        const share = e.product_box[2] * e.product_box[3];
        if (share < rules.minProductShare) row.fails.push(`the product fills ${Math.round(share * 100)}% of the frame; make it at least ${Math.round(rules.minProductShare * 100)}%`);
        const img = decoded.get(e.file);
        // Contrast alone cannot tell a faded product from pearls on cream, so it is a note to look, not a failure.
        if (img) { const c = boxContrast(img, e.product_box); if (c < rules.minProductContrast) row.notes.push(`low contrast in the product box (${c.toFixed(0)}): look at it at phone size; if a gradient or text sits on the product, move it off`); }
      } else row.notes.push('no product_box in the manifest');
    }
    for (const r of per) if (!entries.some((e) => e.file === r.file)) r.notes.push('not in the manifest');
    if (n >= rules.minSetForVariety) {
      if (buttons && withButton / n < rules.minButtonShare) fails.push(`only ${withButton} of ${n} creatives show a button on the image (cta_box in the manifest, checked in the pixels); put one on at least ${Math.round(rules.minButtonShare * 100)}%, in the brand's own button style from its real ads. Use --no-buttons only when the brief says no buttons`);
      if (!entries.some((e) => e.format)) fails.push('the manifest has no format for each creative (product, offer, notes list, chat, comparison table, explainer, review card...)');
      else if (natives.size < rules.minNativeFormats) fails.push(`only ${natives.size} native format${natives.size === 1 ? '' : 's'} (${[...natives].join(', ') || 'none'}); use at least ${rules.minNativeFormats}, such as a notes list, a chat, a comparison table or an explainer, each tied to a segment`);
      if (!entries.some((e) => String(e.moment || '').trim())) notes.push("no creative names a local or seasonal moment (the moment field); the data's top regions and dates usually give one");
    }
    const keys = new Set(fills.map((f) => f.map((v) => v >> 6).join(',')));
    if (keys.size > 2) notes.push(`buttons use ${keys.size} different fills; one button style, taken from the brand's real ads, reads as one brand`);
  }
  // How the type renders, from the type report (or a "type" field in each manifest entry).
  if (type) {
    let probed = 0;
    for (const row of per) {
      const t = typeFor(row.file, entries && entries.find((e) => e.file === row.file), report);
      if (!t) continue; probed++;
      const ti = typeIssues(t, { fonts, rules }); row.fails.push(...ti.fails); row.notes.push(...ti.notes);
    }
    if (n >= rules.minSetForVariety && probed < n) fails.push(`the type was checked on ${probed} of ${n} creatives: run the type probe on the page that draws each one (node check-creative-set.mjs probe <html folder> --out ${path.join(path.basename(dir), 'type-report.json')}), then look at every headline at full size. Use --no-type only when no creative has text drawn from HTML`);
  }
  const failCount = fails.length + per.reduce((k, r) => k + r.fails.length, 0);
  return { ok: failCount === 0, files: n, layouts: groups, fails, notes, per, failCount };
}
export function reportText(r) {
  const out = [`CREATIVE SET: ${r.files} creatives | ${r.layouts.length} layouts by the pixels | ${r.ok ? 'PASS' : `FAIL (${r.failCount})`}`, ''];
  out.push('LAYOUTS (grouped from the pixels, biggest first):', ...r.layouts.map((g, i) => `  ${i + 1}. ${g.length} x  ${g.join(', ')}`), '');
  if (r.fails.length || (r.notes || []).length) out.push('SET:', ...r.fails.map((f) => `  FAIL ${f}`), ...(r.notes || []).map((x) => `  note ${x}`), '');
  const rows = r.per.filter((p) => p.fails.length || p.notes.length);
  if (rows.length) out.push('EACH CREATIVE:', ...rows.flatMap((p) => [`  ${p.file}`, ...p.fails.map((f) => `    FAIL ${f}`), ...p.notes.map((x) => `    note ${x}`)]));
  return out.join('\n');
}
async function probeFiles(target, { out, size = '1080x1080', print = console.log } = {}) {
  const files = fs.statSync(target).isDirectory() ? fs.readdirSync(target).filter((f) => /\.html?$/i.test(f)).sort().map((f) => path.join(target, f)) : [target];
  if (!files.length) throw new Error(`no .html files in ${target}`);
  let pw = null;
  for (const name of ['playwright', 'playwright-core']) {
    for (const from of [process.cwd(), path.join(process.cwd(), 'site')]) { try { pw = createRequire(path.join(from, 'noop.js'))(name); break; } catch {} }
    if (pw) break;
    try { pw = await import(name); break; } catch {}
  }
  if (!pw || !pw.chromium) throw new Error('the probe needs Playwright (npm i -D playwright, then npx playwright install chromium). Or run typeProbe in your own renderer: report[file] = await page.evaluate(typeProbe, { canvas: 1080 })');
  const [w, h] = size.split('x').map(Number), browser = await pw.chromium.launch();
  try {
    const page = await browser.newPage({ viewport: { width: w, height: h } }), report = {};
    for (const f of files) { await page.goto(pathToFileURL(f).href, { waitUntil: 'load' }); report[path.basename(f)] = await page.evaluate(typeProbe, { canvas: w }); }
    if (out) { fs.writeFileSync(out, JSON.stringify(report, null, 1)); print(`type report for ${files.length} pages: ${out}`); }
    return report;
  } finally { await browser.close(); }
}
async function main(argv = process.argv.slice(2), print = console.log) {
  const a = { _: [] }; for (let i = 0; i < argv.length; i++) { const x = argv[i]; if (x.startsWith('--')) { const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; a[x.slice(2)] = v; } else a._.push(x); }
  if (!a._[0]) { const src = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n'); print(src.slice(1, src.findIndex((l) => l.startsWith('import '))).map((l) => l.replace(/^\/\/ ?/, '')).join('\n')); return 2; }
  const size = typeof a.size === 'string' ? a.size : '1080x1080';
  try {
    if (a._[0] === 'probe') {
      if (!a._[1]) throw new Error('probe needs a folder of .html files');
      const r = await probeFiles(path.resolve(a._[1]), { out: typeof a.out === 'string' ? path.resolve(a.out) : null, size, print });
      if (!a.out) print(JSON.stringify(r, null, 1)); return 0;
    }
    const r = checkSet(path.resolve(a._[0]), { manifest: typeof a.manifest === 'string' ? path.resolve(a.manifest) : null, size, buttons: !a['no-buttons'], type: !a['no-type'],
      fonts: typeof a.fonts === 'string' ? a.fonts.split(',').map((x) => x.trim()).filter(Boolean) : null, typeReport: typeof a.type === 'string' ? path.resolve(a.type) : null });
    print(a.json ? JSON.stringify(r, null, 2) : reportText(r)); return r.ok ? 0 : 1;
  } catch (err) { print(`check-creative-set: ${err.message}`); return 2; }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().then((code) => { process.exitCode = code; });
