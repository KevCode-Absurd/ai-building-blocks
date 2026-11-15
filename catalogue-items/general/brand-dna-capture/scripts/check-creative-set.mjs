#!/usr/bin/env node
// check-creative-set.mjs (AI Blocks, brand-dna-capture) - version 1.4.0
//
// Checks a set of static ad creatives before hand-over, from the pixels and from the set's manifest.
//   node check-creative-set.mjs <folder of creatives> [--manifest <file>] [--size 1080x1080] [--fonts "Lato,Nanum Myeongjo"]
//     [--type <type-report.json>] [--domain gehnaindia.com] [--no-buttons] [--no-type] [--json]
//   node check-creative-set.mjs probe <folder of creative .html files> --out <creatives>/type-report.json [--size 1080x1080]
//   node check-creative-set.mjs match <folder of creatives>   (opens each ad's landing page, rendering it in a browser when
//     the store draws it with script; writes match-report.json)
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
//     "format": "notes list", "cta_box": [x, y, w, h], "moment": "Margazhi season", "claim_source": "FAQ: ...",
//     "angle": "...", "price_checked": "2026-11-15", "in_stock": true, "compare_at": "₹24,000", "offer_terms": "...",
//     "timing_check": "...", "spec_source": "...", "policy_source": "...", "ai_scene": "...", "source_photo": "...",
//     "ad": { "primary_text": "...", "headline": "...", "description": "...", "url": "https://...?utm_source=..." },
//     "faces": [[x, y, w, h]] (every face that shows, or [] for none), "photo_box": [x, y, w, h], "funnel": "prospecting" }
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
//   - the mix: in any set of 3 or more, at least half the creatives are image-led (product or lifestyle); text cards
//     (notes, chats, tables, receipts) are the rest, each with 40 words or fewer on the image. 5 or more name at least
//     2 segments, and at least one piece is for people who already know the store (funnel "retargeting") or carries an
//     offer (a payment plan, a gift, free shipping); no two share angle and format
//   - faces: every face that shows is in faces; none is cut by the frame or its photo_box, and no button sits on one
// E-commerce promises (each one checked against its terms):
//   - a date promise ("Wedding in February?", "by Diwali") needs timing_check: when the buyer really gets it
//   - a pay-later line (EMI, "pay monthly", "6 x ₹2,817") needs offer_terms, and a pay-first plan must say when it ships
//   - rankings ("#1", "Top 3", "bestseller", "most added") need a claim_source quoting the store's own tag
//   - measured specs (5.24 g, 2 ct, 500 ml) need spec_source; policies (refund, free shipping, COD) need policy_source
//   - "20% off" must match price against compare_at; a review quote must be word for word from review.source_text
//   - a price needs price_checked within 7 days and the product in stock
//   - an AI scene needs its source_photo, and the image model never draws people with the product
// Ad delivery: a landing URL on the store's domain (--domain), UTM tags, Meta's text limits, a headline of 10 words
//   or fewer, and (match) the landing page names the product and shows the price the ad shows
// How the type renders (from a type report: the probe runs in the page that draws each creative, in a browser):
//   - every font loaded (no fallback font), and with --fonts, every text is in one of the brand's fonts
//   - text 40px and up kerns the pairs a good font always kerns (Wo, Te, Ya, AV, LT ...), read from where each letter
//     lands, so a hand fix in a span counts: a font that leaves "Wo" unkerned prints "W orn now" with a gap
//   - no hairline face (thin stroke under a fifth of the thick one) at 30px and up: Didone hairlines vanish on phones
//   - text against a solid backdrop has 4.5:1 contrast (3:1 at 48px and up); 50 words on an image at most (note at 30)
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

export const VERSION = '1.4.0';
export const RULES = Object.freeze({ minLayouts: 4, maxLayoutShare: 0.3, minSetForVariety: 10, minProductShare: 1 / 3, minProductContrast: 22, minButtonShare: 0.7, minNativeFormats: 3, minTextPx: 18, readTextPx: 24, minKernPx: 40, maxKernGap: -0.008, minCommaTail: 0.15, maxUpscale: 1.3,
  minStrokeContrast: 0.2, strokeMinPx: 30, minContrast: 4.5, minContrastLarge: 3, largeTextPx: 48, maxImageWords: 50, noteImageWords: 30, minSetForMix: 3, maxTextCardShare: 0.5,
  minSegments: 2, minSetForSegments: 5, maxHeadlineWords: 14, noteHeadlineWords: 10, maxPriceAgeDays: 7, maxPrimaryHook: 125, maxAdHeadline: 40, maxAdDescription: 30,
  maxTextCardWords: 40, faceEdge: 0.005, minSetForFunnel: 5 });

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
const MONEY_BAD = /(?:₹|rs\.?|inr)\s?\d{1,3}\.\d{3}\b|(?:₹|rs\.?|inr)\s?\d{5,}\b(?![,.]\d)|[$£€]\s?\d{1,3}\.\d{3}\b(?!\.\d)|[$£€]\s?\d+\.\d\b(?!\d)|[$£€]\s?\d{5,}\b(?![,.]\d)/i;
const PLACEHOLDER = /\[(?:x|date|name|link|price|tbd|todo|insert[^\]]*)\]|\bTBD\b|\bTODO\b|lorem ipsum|\{\{[^}]*\}\}|\bXX+\b/i;
export function textIssues(entry) {
  const out = [];
  const fields = ['headline', 'body', 'cta', 'price'].map((k) => [k, entry[k]]);
  if (!String(entry.headline || '').trim()) out.push('no headline');
  if (!String(entry.cta || '').trim()) out.push('no CTA button text');
  for (const [k, v] of fields) {
    const t = String(v ?? '');
    if (v !== undefined && v !== null && !t.trim() && (k === 'price')) out.push(`${k} is empty: an empty bar or button would ship`);
    if (MONEY_BAD.test(t)) out.push(`${k} writes money the wrong way ("${t.match(MONEY_BAD)[0]}"): use ₹10,000 or ₹1,00,000, $1,234.50, £1,234 or €1,234`);
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
  const cv = document.createElement('canvas'); cv.width = 400; cv.height = 400; const cx = cv.getContext('2d', { willReadFrequently: true });
  const ink = (cs, ch, px, x, y) => { cx.clearRect(0, 0, 400, 400); cx.font = `${cs.fontStyle} ${cs.fontWeight} ${px}px ${cs.fontFamily}`; cx.fillStyle = '#000'; cx.textBaseline = 'alphabetic'; cx.fillText(ch, x, y); return cx.getImageData(0, 0, 400, 400).data; };
  // How much of the comma's ink hangs below the baseline. A hairline tail (under ~15%) makes 15,710 read as 15.710.
  const commaTail = (cs) => {
    const d = ink(cs, ',', 160, 20, 200); let up = 0, down = 0;
    for (let y = 0; y < 400; y++) for (let x = 0; x < 400; x++) if (d[(y * 400 + x) * 4 + 3] > 127) { if (y >= 200) down++; else up++; }
    return up + down ? Math.round((down / (up + down)) * 100) / 100 : null;
  };
  // Thin over thick stroke of "o": a Didone hairline is about a tenth of its stem and vanishes at phone size.
  const strokeContrast = (cs) => {
    const d = ink(cs, 'o', 200, 60, 300), a = (x, y) => d[(y * 400 + x) * 4 + 3] / 255;
    let x0 = 400, x1 = -1, y0 = 400, y1 = -1;
    for (let y = 0; y < 400; y++) for (let x = 0; x < 400; x++) if (a(x, y) > 0.5) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return null;
    const mx = (x0 + x1) >> 1, my = (y0 + y1) >> 1, span = Math.max(2, Math.round((x1 - x0) * 0.12));
    const runDown = (x) => { let s = 0, on = false; for (let y = Math.max(0, y0 - 2); y <= my; y++) { const v = a(x, y); if (v > 0.02) { on = true; s += v; } else if (on) break; } return s; };
    let thin = 0; for (let x = mx - span; x <= mx + span; x++) thin = Math.max(thin, runDown(x));
    let thick = 0, on = false; for (let x = Math.max(0, x0 - 2); x <= mx; x++) { const v = a(x, my); if (v > 0.02) { on = true; thick += v; } else if (on) break; }
    return thick ? Math.round((thin / thick) * 100) / 100 : null;
  };
  const rgb = (c) => { const m = /rgba?\(([^)]+)\)/.exec(c || ''); if (!m) return null; const v = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: v[0], g: v[1], b: v[2], a: v.length > 3 ? v[3] : 1 }; };
  const lumOf = ({ r, g, b }) => { const f = (x) => { x /= 255; return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  // The colour behind a text: what paints under its centre. A photo or gradient first means "unknown", not a guess.
  const backdrop = (el, r) => {
    // The browser's paint order under the text's centre, the text's own box included (a button's fill).
    const stack = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    for (const e of stack) {
      if ((e !== el && el.contains(e)) || e === sp) continue;
      const cs = getComputedStyle(e);
      if (e.tagName === 'IMG' || e.tagName === 'VIDEO' || e.tagName === 'CANVAS' || /url\(|gradient\(/.test(cs.backgroundImage || '')) return null;
      const c = rgb(cs.backgroundColor); if (c && c.a > 0) return c.a >= 0.95 ? c : null;
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  };
  const visible = (cs, r) => r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0;
  const texts = [], kern = [], fonts = [], images = [], seenFont = new Set(), fontMeta = new Map();
  const fontOf = (cs) => {
    const fam = cs.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, ''), fk = `${fam}|${cs.fontWeight}|${cs.fontStyle}`;
    if (!seenFont.has(fk)) { seenFont.add(fk); const rec = { font: fam, weight: cs.fontWeight, style: cs.fontStyle, kerns: CONTROL.some((pr) => kernOf(cs, pr) < -0.01), off: cs.fontKerning === 'none', commaTail: commaTail(cs), stroke: strokeContrast(cs) }; fonts.push(rec); fontMeta.set(fk, rec); }
    return fam;
  };
  for (const el of els) {
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').replace(/\s+/g, ' ').trim();
    if (!own) continue;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect(); if (!visible(cs, r)) continue;
    const fam = fontOf(cs);
    const generic = /^(serif|sans-serif|monospace|cursive|fantasy|system-ui|ui-serif|ui-sans-serif)$/i.test(fam);
    // A font that did not load draws the same as the fallback after it.
    const loaded = generic || ['monospace', 'serif'].some((g) => Math.abs(width(cs, own + 'WMiw', `"${fam}", ${g}`) - width(cs, own + 'WMiw', g)) > 0.5);
    const px = Math.round(parseFloat(cs.fontSize) * k * 10) / 10;
    const fg = rgb(cs.color), bg = backdrop(el, r);
    let contrast = null;
    if (fg && bg && fg.a >= 0.95) { const L1 = lumOf(fg), L2 = lumOf(bg); contrast = Math.round(((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)) * 100) / 100; }
    texts.push({ text: own.slice(0, 80), font: fam, weight: cs.fontWeight, style: cs.fontStyle, loaded, px, kerning: cs.fontKerning, contrast, words: own.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length });
  }
  // Kerning as printed: walk each text block letter by letter (spans included) and read where each letter lands.
  // A must-kern pair should sit tighter than the block's usual letter gap; a hand fix with letter-spacing counts.
  const blockOf = (el) => { let e = el; while (e && e !== root && getComputedStyle(e).display === 'inline') e = e.parentElement; return e || root; };
  const blocks = new Set(); for (const el of els) if ([...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) blocks.add(blockOf(el));
  const seenPair = new Set(), range = document.createRange();
  for (const b of blocks) {
    const bcs = getComputedStyle(b); if (!visible(bcs, b.getBoundingClientRect())) continue;
    const chars = [], walk = document.createTreeWalker(b, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      if (blockOf(n.parentElement) !== b) continue;
      const cs = getComputedStyle(n.parentElement);
      for (let i = 0; i < n.textContent.length; i++) {
        const ch = n.textContent[i]; if (/\s/.test(ch)) { chars.push(null); continue; }
        range.setStart(n, i); range.setEnd(n, i + 1); const rr = range.getBoundingClientRect();
        if (!rr.width && !rr.height) continue;
        chars.push({ ch, cs, x: rr.left, top: rr.top, h: rr.height, size: parseFloat(cs.fontSize) });
      }
    }
    const pairs = [];
    for (let i = 0; i + 1 < chars.length; i++) {
      const p = chars[i], q = chars[i + 1]; if (!p || !q || Math.abs(p.top - q.top) > p.h * 0.3 || q.x <= p.x) continue;
      const adv = (width(p.cs, p.ch) * p.size) / 100, eff = (q.x - p.x - adv) / p.size;
      pairs.push({ p, q, eff, i });
    }
    if (pairs.length < 3) continue;
    const sorted = pairs.map((x) => x.eff).sort((a, c) => a - c), median = sorted[sorted.length >> 1];
    const line = chars.map((c) => (c ? c.ch : ' ')).join('');
    for (const { p, q, eff, i } of pairs) {
      if (!(MUST[p.ch] || '').includes(q.ch)) continue;
      const fam = fontOf(p.cs), key = `${fam}|${p.cs.fontWeight}|${p.ch}${q.ch}|${Math.round(eff * 100)}`;
      if (seenPair.has(key)) continue; seenPair.add(key);
      kern.push({ pair: p.ch + q.ch, font: fam, weight: p.cs.fontWeight, kern: Math.round((eff - median) * 1000) / 1000, px: Math.round(p.size * k), sample: line.slice(Math.max(0, i - 10), i + 12), off: p.cs.fontKerning === 'none' });
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
  const done = new Set(), once = (key, msg, list = fails) => { if (!done.has(key)) { done.add(key); list.push(msg); } };
  const meta = (t) => (p.fonts || []).find((x) => x.font === t.font && x.weight === t.weight && (!x.style || !t.style || x.style === t.style)) || (p.fonts || []).find((x) => x.font === t.font && x.weight === t.weight);
  for (const t of texts) {
    if (!t.loaded) once(`fb|${t.font}`, `"${short(t.text)}" draws in a fallback font: "${t.font}" did not load. Load the font file before the screenshot`);
    else if (brand && !brand.includes(String(t.font).toLowerCase())) once(`bf|${t.font}`, `"${short(t.text)}" is set in ${t.font}, which is not one of the brand's fonts (${fonts.join(', ')})`);
  }
  for (const fo of p.fonts || []) if (fo.off) once(`off|${fo.font}`, `${fo.font} has font-kerning turned off, so letters sit unevenly: remove font-kerning: none`);
  // A must-kern pair that prints no tighter than the line's usual letter gap shows as a gap ("W orn now", round 5).
  // The probe reads where letters land, so a hand fix (a span with negative letter-spacing) counts as kerned.
  for (const kp of p.kern || []) {
    if (kp.off || kp.kern <= rules.maxKernGap || kp.px * f < rules.minKernPx) continue;
    const fo = (p.fonts || []).find((x) => x.font === kp.font && x.weight === kp.weight);
    if (fo && !fo.kerns) once(`nk|${kp.font}`, `${kp.font} does not kern at all (tested To, AV, Yo), so "${short(kp.sample)}" shows gaps. Use the brand's own font file, or a cut that kerns`);
    else once(`k|${kp.font}|${kp.pair}`, `"${kp.pair}" in ${kp.font} ("${short(kp.sample)}") prints no tighter than the other letters, so it shows a gap after "${kp.pair[0]}". Use the brand's own font file, a cut that kerns the pair, or tighten it by hand`);
  }
  // A Didone hairline (thin stroke under a fifth of the stem) disappears at phone size (round 6: 4 of 10 judges).
  for (const t of texts) {
    const fo = meta(t);
    if (fo && typeof fo.stroke === 'number' && fo.stroke < rules.minStrokeContrast && t.px * f >= rules.strokeMinPx) once(`st|${t.font}|${t.weight}|${t.style || ''}`, `"${short(t.text)}" is set in ${t.font}, a hairline face (thin stroke ${Math.round(fo.stroke * 100)}% of the thick one): the thin strokes vanish at phone size. Use the site's own heading font, or a face with sturdier strokes`);
  }
  const list = (ts) => `${ts.slice(0, 3).map((t) => `${Math.round(t.px * f)}px "${short(t.text, 28)}"`).join(', ')}${ts.length > 3 ? ` and ${ts.length - 3} more` : ''}`;
  const tiny = texts.filter((t) => t.px * f < rules.minTextPx), small = texts.filter((t) => t.px * f >= rules.minTextPx && t.px * f < rules.readTextPx);
  if (tiny.length) fails.push(`text under ${rules.minTextPx}px on a 1080 frame cannot be read on a phone: ${list(tiny)}. Make it bigger or cut it`);
  if (small.length) notes.push(`small text (under ${rules.readTextPx}px on a 1080 frame): ${list(small)}. Look at it at phone size; cut words before shrinking them`);
  // Contrast against a solid backdrop (text over a photo is left to the eye).
  const low = texts.filter((t) => /[\p{L}\p{N}]/u.test(t.text) && typeof t.contrast === 'number' && t.contrast < (t.px * f >= rules.largeTextPx ? rules.minContrastLarge : rules.minContrast));
  if (low.length) fails.push(`text too faint against its background: ${low.slice(0, 3).map((t) => `"${short(t.text, 28)}" ${t.contrast}:1`).join(', ')}. Small text needs ${rules.minContrast}:1, big text ${rules.minContrastLarge}:1`);
  // Words on the image: the round 6 set lost "finished" and "natural" for text-heavy cards.
  const words = texts.reduce((s, t) => s + (t.words ?? String(t.text).split(/\s+/).filter(Boolean).length), 0);
  if (words > rules.maxImageWords) fails.push(`${words} words on the image: a feed ad reads in a second or two. Cut to ${rules.noteImageWords} or fewer, and move the rest to the ad text`);
  else if (words > rules.noteImageWords) notes.push(`${words} words on the image; ${rules.noteImageWords} or fewer reads faster`);
  // A comma that is nearly all dot: "15,710" reads as "15.710" (the Gehna round 5 judges saw it in Bodoni Moda).
  for (const t of texts) {
    if (!/\d,\d/.test(t.text)) continue;
    const fo = meta(t);
    if (fo && typeof fo.commaTail === 'number' && fo.commaTail < rules.minCommaTail) once(`cm|${t.font}|${t.weight}`, `"${short(t.text)}" is set in ${t.font}, whose comma is nearly all dot (${Math.round(fo.commaTail * 100)}% tail), so ${(t.text.match(/[^\s]*\d,\d[\d,]*/) || [''])[0]} reads like a decimal. Set numbers in the body font`);
  }
  for (const im of p.images || []) if (im.scale > rules.maxUpscale) once(`im|${im.src}`, `${im.src} is drawn at ${im.scale}x its own pixels (${im.natural[0]}px wide shown at ${im.drawn[0]}px), so it will look soft. Use a bigger source or draw it smaller`);
  return { fails, notes };
}

// ---------- e-commerce promises: every promise checked against its terms ----------
const MONTHS = 'january|february|march|april|may|june|july|august|september|october|november|december';
const TIME_PROMISE = new RegExp(`\\b(?:in|by|before|for|this|next)\\s+(?:${MONTHS}|diwali|christmas|eid|holi|pongal|onam|navratri|rakhi|raksha bandhan|karva chauth|new year|valentine'?s(?: day)?|mother'?s day|father'?s day|black friday|cyber monday|the wedding|your wedding|the weekend|this weekend|the holidays)\\b|\\bin time for\\b|\\barrives?\\s+(?:by|before|in time)\\b|\\b(?:wedding|festival|party)\\s+in\\s+(?:${MONTHS})\\b`, 'i');
const PAY_LATER = /\b(?:emi|no[- ]cost emi|instal(?:l)?ments?|pay (?:over|monthly|later|in \d+)|per month|\/\s?mo(?:nth)?\b|monthly payments?|book (?:it )?(?:now|at today'?s price)|\d+\s*[x×]\s*(?:₹|\$|£|€|rs\.?))/i;
const RANKING = /#\s?\d+\b|\bno\.?\s?1\b|\bnumber one\b|\btop\s?\d+\b|\bbest[- ]?sell(?:er|ing)\b|\bmost[- ](?:added|loved|popular|bought|wished|wishlisted|reviewed)\b|\btrending\b|\b(?:customer|people'?s) (?:favourite|favorite|choice)\b/i;
const SPEC = /\b\d+(?:\.\d+)?\s?(?:g|gm|gms|grams?|kg|ct|carats?|kt|karat|ml|ltr|litres?|liters?|mm|cm|inch(?:es)?|oz|lbs?|mah|gb|tb)\b/i;
const POLICY = /\b(?:refunds?|returns?|exchanges?|free (?:shipping|delivery|returns?)|cash on delivery|\bcod\b|warranty|money[- ]back|deliver(?:ed|y)? (?:in|within) \d+|ships? (?:in|within|today)|\d+[- ]day (?:returns?|exchange|refund|trial))\b/i;
const PCT = /(\d{1,2})\s?%\s?off|save\s?(\d{1,2})\s?%|(\d{1,2})\s?%\s?(?:discount|less)/i;
const num = (s) => Number(String(s ?? '').replace(/[^\d.]/g, '')) || 0;
const onImage = (e) => ['headline', 'body', 'cta', 'price'].map((k) => String(e[k] ?? '')).join(' | ');
const adText = (e) => { const a = e.ad || {}; return [a.primary_text, a.headline, a.description].map((x) => String(x ?? '')).join(' | '); };
const hasText = (v) => String(v ?? '').trim().length > 0;
/** Promises an ad makes that a buyer would hold the store to: dates, pay-later terms, rankings, specs, policies, discounts, reviews, prices. */
export function offerIssues(entry, { today = new Date(), rules = RULES } = {}) {
  const fails = [], notes = [], all = `${onImage(entry)} | ${adText(entry)}`;
  const t = all.match(TIME_PROMISE);
  if (t && !hasText(entry.timing_check)) fails.push(`promises a date ("${t[0]}") with no timing_check: work out when the buyer actually gets it under the offer's terms (pay-first plans ship after the last payment) and write the dates down, or drop the date`);
  const pl = all.match(PAY_LATER);
  if (pl) {
    if (!hasText(entry.offer_terms)) fails.push(`a pay-later line ("${pl[0]}") with no offer_terms: copy the plan's terms from the store (who pays when, when it ships) with the source`);
    else if (/after (?:the |your )?(?:last|final)|once (?:all|the last)|pay[- ]first|layaway|on full payment/i.test(entry.offer_terms) && !/(deliver|ship|dispatch)/i.test(all)) fails.push(`the plan ships only after the last payment, but the ad never says when it ships: say it on the image or in the ad text, or it reads as buy now, pay later`);
  }
  const r = onImage(entry).match(RANKING);
  if (r) { const raw = String(entry.claim_source || '').toLowerCase(), tag = r[0].toLowerCase().replace(/\s+/g, ' '); if (!(raw.includes(tag) || (norm(tag).length > 2 && norm(raw).includes(norm(tag))))) fails.push(`a ranking claim ("${r[0]}") needs a claim_source that quotes the store's own tag or number for it, with the date checked`); }
  const s = onImage(entry).match(SPEC);
  if (s && !hasText(entry.spec_source)) fails.push(`a measured spec ("${s[0]}") with no spec_source: say what it measures (gross or metal weight, net volume) and where it comes from`);
  const po = all.match(POLICY);
  if (po && !hasText(entry.policy_source) && !hasText(entry.offer_terms)) fails.push(`a policy promise ("${po[0]}") with no policy_source: quote the store's policy and its conditions (who pays return shipping, which items are excluded)`);
  const pc = onImage(entry).match(PCT);
  if (pc) {
    const claimed = Number(pc[1] || pc[2] || pc[3]);
    if (!entry.compare_at) fails.push(`shows ${claimed}% off with no compare_at price: give the was-price so the saving can be checked`);
    else { const real = Math.round((1 - num(entry.price) / num(entry.compare_at)) * 100); if (Math.abs(real - claimed) > 1) fails.push(`says ${claimed}% off, but ${entry.price} against ${entry.compare_at} is ${real}% off`); }
  }
  if (entry.review && hasText(entry.review.quote)) {
    const clean = (x) => String(x).toLowerCase().replace(/[“”"‘’'`]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
    if (!hasText(entry.review.source_text)) notes.push('the review has no source_text: paste the review as written so the quote can be checked word for word');
    else { const src = clean(entry.review.source_text); const bits = String(entry.review.quote).split(/\.\.\.|…/).map(clean).filter((b) => b.length > 2); if (bits.some((b) => !` ${src} `.includes(` ${b} `))) fails.push('the review quote is not word for word from review.source_text: quote it exactly, and mark any cut with …'); }
  }
  if (hasText(entry.price)) {
    if (!hasText(entry.price_checked)) fails.push(`shows a price (${entry.price}) with no price_checked date: check it on the live store and write the date`);
    else { const d = new Date(entry.price_checked); if (!Number.isNaN(+d) && (today - d) / 864e5 > rules.maxPriceAgeDays) fails.push(`the price was checked on ${entry.price_checked}, more than ${rules.maxPriceAgeDays} days ago: check it again`); }
    if (entry.in_stock === false) fails.push(`${entry.product || 'the product'} is out of stock: do not advertise it`);
  }
  const ai = String(entry.ai_scene || '');
  if (ai.trim()) {
    if (!hasText(entry.source_photo)) fails.push('an AI-made scene with no source_photo: name the real product photo it was built from, so the piece can be checked against it');
    if (/\b(?:person|people|model|woman|women|man|men|girl|boy|hands?|face|faces|portrait|wearing|worn by)\b/i.test(ai) && !/\bno (?:people|person|faces?|hands?|model)\b|\bwithout (?:people|a model|hands)\b/i.test(ai)) fails.push('the image model drew people with the product: use the brand\'s real model photos for people, and the image model only for props and backgrounds');
  }
  return { fails, notes };
}
/** Delivery checks a media buyer runs before upload: where the ad goes, how it is tagged, and Meta's text limits. */
export function adIssues(entry, { domain = null, rules = RULES } = {}) {
  const fails = [], notes = [], a = entry.ad;
  const words = String(entry.headline || '').split(/\s+/).filter(Boolean).length;
  if (words > rules.maxHeadlineWords) fails.push(`the headline has ${words} words: keep it to ${rules.noteHeadlineWords} or fewer so it reads at a glance`);
  else if (words > rules.noteHeadlineWords) notes.push(`the headline has ${words} words; ${rules.noteHeadlineWords} or fewer reads faster`);
  if (!a) return { fails, notes };
  const url = String(a.url || entry.url || '').trim();
  if (!url) fails.push('no landing URL in ad.url: name the product or collection page the button opens');
  else {
    let u = null; try { u = new URL(url); } catch { fails.push(`ad.url is not a full URL ("${short(url)}")`); }
    if (u) {
      if (domain && !u.hostname.replace(/^www\./, '').endsWith(domain.replace(/^www\./, ''))) fails.push(`ad.url goes to ${u.hostname}, not the store (${domain})`);
      const missing = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].filter((k) => !u.searchParams.has(k));
      if (missing.length) notes.push(`ad.url has no ${missing.join(', ')}: tag each creative (utm_content = the file name) so its sales show up in the store's reports`);
    }
  }
  const first = String(a.primary_text || '').split('\n')[0];
  if (first.length > rules.maxPrimaryHook) notes.push(`the first line of the primary text is ${first.length} characters; Meta cuts it near ${rules.maxPrimaryHook}, so put the hook first`);
  if (String(a.headline || '').length > rules.maxAdHeadline) fails.push(`ad.headline is ${String(a.headline).length} characters; Meta cuts it after about ${rules.maxAdHeadline} on phones`);
  if (String(a.description || '').length > rules.maxAdDescription) notes.push(`ad.description is ${String(a.description).length} characters; it often shows only ${rules.maxAdDescription}`);
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

/** Ad-to-page message match: fetch each ad's landing page and check the product name and price the ad shows are there. */
export async function matchPages(entries, { fetcher = globalThis.fetch, timeoutMs = 20000, render = null } = {}) {
  const out = {}, cache = new Map();
  for (const e of entries) {
    const url = String((e.ad && e.ad.url) || e.url || '').trim(); if (!url) continue;
    if (!cache.has(url)) {
      cache.set(url, (async () => {
        try {
          const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), timeoutMs);
          const res = await fetcher(url, { signal: ctl.signal, headers: { 'user-agent': 'Mozilla/5.0 (creative-set check)' } }); clearTimeout(t);
          const html = await res.text();
          return { status: res.status, text: html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#8377;|&#x20b9;/gi, (m) => (/nbsp/i.test(m) ? ' ' : '₹')).replace(/\s+/g, ' ') };
        } catch (err) { return { status: 0, error: err.message }; }
      })());
    }
    const page = await cache.get(url);
    const look = (text) => {
      const checks = [], body = norm(text);
      if (e.product && !norm(e.product).split(' ').filter((w) => w.length > 2).every((w) => body.includes(w))) checks.push(`the page does not name "${e.product}"`);
      if (e.price) { const digits = String(e.price).replace(/[^\d]/g, ''); if (digits && !text.replace(/[,\s]/g, '').includes(digits)) checks.push(`the page does not show the price ${e.price}`); }
      return checks;
    };
    let checks = [], method = 'fetch';
    if (!page.status) checks.push(`could not open the page (${page.error})`);
    else if (page.status >= 400) checks.push(`the page answers ${page.status}`);
    else {
      checks = look(page.text);
      // Many stores draw the product in the browser (Gehna's do), so a plain fetch sees no name or price: render it.
      if (checks.length && render) {
        if (!page.rendered) page.rendered = render(url).catch((err) => ({ error: err.message }));
        const r = await page.rendered;
        if (typeof r === 'string') { checks = look(r); method = 'rendered'; } else checks.push(`could not render the page (${r && r.error})`);
      }
    }
    out[e.file] = { url, status: page.status || 0, ok: checks.length === 0, issues: checks, method };
  }
  return out;
}

/** A person in the picture: every face is listed, and none is cut by the frame, by its photo box, or covered by the button. */
const PERSON_HINT = /\b(?:model|worn|wearing|person|people|woman|women|man|men|face|portrait|selfie|ugc|lifestyle|on a model|hands?)\b/i;
const NO_PERSON = /\b(?:no|without|not any)\s+(?:a\s+)?(?:people|persons?|faces?|hands?|models?|woman|women|man|men)\b(?:\s+(?:drawn|shown|in (?:it|the (?:scene|frame|photo))))?/gi;
export function faceIssues(entry, { rules = RULES } = {}) {
  const fails = [], notes = [], hint = [entry.format, entry.layout, entry.ai_scene, entry.photo].map((x) => String(x ?? '')).join(' ').replace(NO_PERSON, ' ');
  if (!Array.isArray(entry.faces)) {
    if (PERSON_HINT.test(hint)) fails.push(`this creative shows a person ("${hint.match(PERSON_HINT)[0]}") but the manifest has no faces: list each face as [x, y, w, h], so a crop through a face can be caught`);
    else notes.push('no faces field: write faces: [] when no person shows, or the box of each face');
    return { fails, notes };
  }
  const e = rules.faceEdge, inside = (f, b) => f[0] >= b[0] - e && f[1] >= b[1] - e && f[0] + f[2] <= b[0] + b[2] + e && f[1] + f[3] <= b[1] + b[3] + e;
  const overlap = (a, b) => Math.max(0, Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1]));
  entry.faces.forEach((f, i) => {
    if (!Array.isArray(f) || f.length !== 4) { fails.push(`faces[${i}] is not a box [x, y, w, h]`); return; }
    const tag = entry.faces.length > 1 ? `face ${i + 1}` : 'the face';
    if (f[0] < e || f[1] < e || f[0] + f[2] > 1 - e || f[1] + f[3] > 1 - e) fails.push(`${tag} is cut by the edge of the frame: keep the whole head in, or crop below the chin`);
    else if (Array.isArray(entry.photo_box) && entry.photo_box.length === 4 && !inside(f, entry.photo_box)) fails.push(`${tag} is cut by the edge of its photo: keep the whole head inside the photo, or crop below the chin`);
    if (Array.isArray(entry.cta_box) && entry.cta_box.length === 4 && overlap(f, entry.cta_box) > 0.15 * f[2] * f[3]) fails.push(`the button covers ${tag}`);
  });
  return { fails, notes };
}
/** For people who already know the store, or carrying a real offer: a set of 5 that is all cold prospecting misses both. */
const OFFER_HINT = /\b(?:offer|emi|instal(?:l)?ments?|pay (?:monthly|later|over)|payment plan|discount|% off|sale|gift with|free (?:gift|shipping|delivery|resize)|bundle|cart|retarget(?:ing)?|returning|come back|still thinking)\b/i;
export function isRetargetOrOffer(entry) {
  if (/^(?:retarget(?:ing)?|remarketing|returning|cart|bottom|bofu)/i.test(String(entry.funnel || '').trim())) return true;
  return OFFER_HINT.test([entry.angle, entry.format, entry.offer_terms ? 'offer' : '', entry.headline].map((x) => String(x ?? '')).join(' '));
}

// ---------- the whole set ----------
export function checkSet(dir, { manifest = null, size = '1080x1080', rules = RULES, buttons = true, type = true, fonts = null, typeReport = null, domain = null, today = new Date() } = {}) {
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
    let withButton = 0, textCards = 0, funnelHits = 0; const natives = new Set(), fills = [];
    for (const e of entries) {
      const row = per.find((r) => r.file === e.file); if (!row) { fails.push(`manifest names ${e.file}, which is not in the folder`); continue; }
      row.fails.push(...textIssues(e));
      const c = claimIssues(e); row.fails.push(...c.fails); row.notes.push(...c.notes);
      const o = offerIssues(e, { today, rules }); row.fails.push(...o.fails); row.notes.push(...o.notes);
      const ad = adIssues(e, { domain, rules }); row.fails.push(...ad.fails); row.notes.push(...ad.notes);
      const nf = nativeFormat(e.format); if (nf) { natives.add(nf); textCards++; }
      const fc = faceIssues(e, { rules }); row.fails.push(...fc.fails); row.notes.push(...fc.notes);
      if (isRetargetOrOffer(e)) funnelHits++;
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
    // The mix (round 6: 3 of 5 were text cards and 9 of 10 judges called the set text-heavy).
    if (n >= rules.minSetForMix && textCards / n > rules.maxTextCardShare) fails.push(`${textCards} of ${n} creatives are text cards (notes, chat, table, explainer, review, receipt): keep at least half image-led, with the product or a person wearing it as the hero`);
    if (n >= rules.minSetForFunnel && !funnelHits) fails.push(`all ${n} creatives are prospecting with no offer: make at least one for people who already know the store (funnel "retargeting": cart and site visitors, past buyers) or one that carries a real offer from the store (a payment plan, a gift, free shipping), with its terms`);
    if (n >= rules.minSetForSegments) {
      const segs = new Set(entries.map((e) => norm(e.segment || '')).filter(Boolean));
      if (entries.some((e) => !String(e.segment || '').trim())) fails.push('some creatives name no segment: tie each one to a buyer group the data names');
      else if (segs.size < rules.minSegments) fails.push(`all ${n} creatives speak to one segment; speak to at least ${rules.minSegments} that the data names`);
    }
    const seenAF = new Map();
    for (const e of entries) {
      if (!e.angle || !e.format) continue;
      const key = `${norm(e.angle)}|${nativeFormat(e.format) || norm(e.format)}`;
      if (seenAF.has(key)) fails.push(`${seenAF.get(key)} and ${e.file} share both angle ("${e.angle}") and format: change one`); else seenAF.set(key, e.file);
    }
    // The landing pages, from match-report.json (node check-creative-set.mjs match <folder>).
    const mPathMatch = path.join(dir, 'match-report.json');
    if (fs.existsSync(mPathMatch)) {
      const mr = JSON.parse(fs.readFileSync(mPathMatch, 'utf8'));
      for (const row of per) { const m = mr[row.file]; if (m && !m.ok) row.fails.push(...m.issues.map((x) => `landing page ${m.url}: ${x}`)); }
    } else if (entries.some((e) => (e.ad && e.ad.url) || e.url)) notes.push('landing pages not checked: run node check-creative-set.mjs match <folder> to see each page names the product and shows the price');
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
      const entry = entries && entries.find((e) => e.file === row.file);
      if (entry && nativeFormat(entry.format)) {
        const words = (t.texts || []).reduce((n2, x) => n2 + (x.words ?? String(x.text).split(/\s+/).filter(Boolean).length), 0);
        if (words > rules.maxTextCardWords) row.fails.push(`a text card (${entry.format}) with ${words} words on the image: keep it to ${rules.maxTextCardWords} or fewer (round 7: the 44-word checklist and review card read slowest)`);
      }
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
async function loadPlaywright() {
  for (const name of ['playwright', 'playwright-core']) {
    for (const from of [process.cwd(), path.join(process.cwd(), 'site')]) { try { const pw = createRequire(path.join(from, 'noop.js'))(name); if (pw && pw.chromium) return pw; } catch {} }
    try { const pw = await import(name); if (pw && pw.chromium) return pw; } catch {}
  }
  return null;
}
async function probeFiles(target, { out, size = '1080x1080', print = console.log } = {}) {
  const files = fs.statSync(target).isDirectory() ? fs.readdirSync(target).filter((f) => /\.html?$/i.test(f)).sort().map((f) => path.join(target, f)) : [target];
  if (!files.length) throw new Error(`no .html files in ${target}`);
  const pw = await loadPlaywright();
  if (!pw) throw new Error('the probe needs Playwright (npm i -D playwright, then npx playwright install chromium). Or run typeProbe in your own renderer: report[file] = await page.evaluate(typeProbe, { canvas: 1080 })');
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
    if (a._[0] === 'match') {
      if (!a._[1]) throw new Error('match needs the folder of creatives with its manifest.json');
      const dir = path.resolve(a._[1]), doc = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
      const pw = await loadPlaywright(); let browser = null;
      const render = pw ? async (url) => {
        browser ??= await pw.chromium.launch();
        const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
        try { await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {}); await page.waitForTimeout(1500); return await page.evaluate(() => document.body.innerText); } finally { await page.close(); }
      } : null;
      let r; try { r = await matchPages(Array.isArray(doc) ? doc : doc.creatives || [], { render }); } finally { if (browser) await browser.close(); }
      if (!pw) print('note: Playwright not found, so pages the store draws in the browser could not be rendered');
      fs.writeFileSync(path.join(dir, 'match-report.json'), JSON.stringify(r, null, 1));
      const bad = Object.entries(r).filter(([, v]) => !v.ok);
      print(`landing pages: ${Object.keys(r).length} checked, ${bad.length} with problems`); for (const [f, v] of bad) print(`  ${f}: ${v.issues.join('; ')}`);
      return bad.length ? 1 : 0;
    }
    if (a._[0] === 'probe') {
      if (!a._[1]) throw new Error('probe needs a folder of .html files');
      const r = await probeFiles(path.resolve(a._[1]), { out: typeof a.out === 'string' ? path.resolve(a.out) : null, size, print });
      if (!a.out) print(JSON.stringify(r, null, 1)); return 0;
    }
    const r = checkSet(path.resolve(a._[0]), { manifest: typeof a.manifest === 'string' ? path.resolve(a.manifest) : null, size, buttons: !a['no-buttons'], type: !a['no-type'],
      fonts: typeof a.fonts === 'string' ? a.fonts.split(',').map((x) => x.trim()).filter(Boolean) : null, typeReport: typeof a.type === 'string' ? path.resolve(a.type) : null,
      domain: typeof a.domain === 'string' ? a.domain : null });
    print(a.json ? JSON.stringify(r, null, 2) : reportText(r)); return r.ok ? 0 : 1;
  } catch (err) { print(`check-creative-set: ${err.message}`); return 2; }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().then((code) => { process.exitCode = code; });
