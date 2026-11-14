#!/usr/bin/env node
// check-creative-set.mjs (AI Blocks, brand-dna-capture) - version 1.1.0
//
// Checks a set of static ad creatives before hand-over, from the pixels and from the set's manifest.
//   node check-creative-set.mjs <folder of creatives> [--manifest <file>] [--size 1080x1080] [--no-buttons] [--json]
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
// It exits 1 when anything fails, so it can gate a hand-over. It only reads files.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

export const VERSION = '1.1.0';
export const RULES = Object.freeze({ minLayouts: 4, maxLayoutShare: 0.3, minSetForVariety: 10, minProductShare: 1 / 3, minProductContrast: 22, minButtonShare: 0.7, minNativeFormats: 3 });

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

// ---------- the whole set ----------
export function checkSet(dir, { manifest = null, size = '1080x1080', rules = RULES, buttons = true } = {}) {
  const files = fs.readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f)).sort();
  const mPath = manifest || path.join(dir, 'manifest.json');
  let entries = null;
  if (fs.existsSync(mPath)) { const doc = JSON.parse(fs.readFileSync(mPath, 'utf8')); entries = Array.isArray(doc) ? doc : doc.creatives || []; }
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
function main(argv = process.argv.slice(2), print = console.log) {
  const a = { _: [] }; for (let i = 0; i < argv.length; i++) { const x = argv[i]; if (x.startsWith('--')) { const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; a[x.slice(2)] = v; } else a._.push(x); }
  if (!a._[0]) { print(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').filter((l) => l.startsWith('//')).slice(0, 34).map((l) => l.replace(/^\/\/ ?/, '')).join('\n')); return 2; }
  try { const r = checkSet(path.resolve(a._[0]), { manifest: typeof a.manifest === 'string' ? path.resolve(a.manifest) : null, size: typeof a.size === 'string' ? a.size : '1080x1080', buttons: !a['no-buttons'] }); print(a.json ? JSON.stringify(r, null, 2) : reportText(r)); return r.ok ? 0 : 1; }
  catch (err) { print(`check-creative-set: ${err.message}`); return 2; }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
