/*
 * brand-dna-snippet.js (AI Blocks, brand-dna-capture) - version 1.0.0
 *
 * Measures the page that is open in the browser and returns what it measured as one JSON object:
 * colours by share of page area, fonts per role and the font files that loaded, radius, shadows,
 * button and link styles, nav and footer, the ordered sections, image density, verbatim voice lines,
 * and live facts (prices, offers, shipping, guarantees, review counts) with a capture timestamp.
 *
 * No dependencies. It only reads the page: it sends nothing anywhere and changes nothing.
 *
 * Use it three ways:
 *   1. Devtools console: scroll to the bottom and back (so lazy images load), close any pop-up,
 *      then paste this whole file and press Enter. The JSON is copied to your clipboard when the
 *      console allows it, and is also kept in window.__brandDNA.
 *   2. A browser tool that runs JavaScript (Claude in Chrome, Playwright, Puppeteer): run the file's
 *      text as the script. Its value is the JSON object.
 *   3. capture-brand-dna.mjs runs it for you at 1440 and 390 px widths and merges the pages.
 *
 * Options: set window.__brandDnaOptions = { quiet: true, maxHeight: 40000 } before running.
 * Schema: "ai-blocks-brand-dna/1". Field meanings are in the brand-dna-capture SKILL.md.
 */
(function brandDnaSnippet(opts) {
  'use strict';
  opts = opts || {};
  var VERSION = '1.0.0';
  var started = Date.now();
  var doc = document, root = doc.documentElement, body = doc.body || root;
  var vw = root.clientWidth || window.innerWidth, vh = window.innerHeight;
  var sy = window.scrollY || 0, sx = window.scrollX || 0;
  var fullHeight = Math.max(root.scrollHeight, body.scrollHeight, vh);
  var pageH = Math.min(fullHeight, opts.maxHeight || 40000);
  var notes = [];

  // ---------- small helpers ----------
  function round(n, d) { var p = Math.pow(10, d || 0); return Math.round(n * p) / p; }
  function clean(s, max) { s = String(s == null ? '' : s).replace(/\s+/g, ' ').trim(); return max && s.length > max ? s.slice(0, max - 1) + '…' : s; }
  function tally(list, keyFn, limit) {
    var m = new Map();
    list.forEach(function (x) { var k = keyFn(x); if (k == null || k === '') return; var w = 1; if (Array.isArray(k)) { w = k[1]; k = k[0]; } m.set(k, (m.get(k) || 0) + w); });
    return Array.from(m.entries()).sort(function (a, b) { return b[1] - a[1]; }).slice(0, limit || 12).map(function (e) { return { value: e[0], count: round(e[1], 1) }; });
  }
  function docRect(el) { var r = el.getBoundingClientRect(); return { x: r.left + sx, y: r.top + sy, w: r.width, h: r.height }; }
  var styleCache = new Map();
  function css(el) { var s = styleCache.get(el); if (!s) { s = getComputedStyle(el); styleCache.set(el, s); } return s; }
  var visCache = new Map();
  function visible(el) {
    if (visCache.has(el)) return visCache.get(el);
    var ok = true;
    try {
      if (el.checkVisibility) ok = el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true, opacityProperty: true, visibilityProperty: true });
      if (ok) { var s = css(el); ok = s.display !== 'none' && s.visibility !== 'hidden' && parseFloat(s.opacity) > 0.02; }
      if (ok) { var r = el.getBoundingClientRect(); ok = r.width > 0.5 && r.height > 0.5 && r.right + sx > 0 && r.left + sx < vw + 2; }
    } catch (e) { ok = false; }
    visCache.set(el, ok);
    return ok;
  }
  // Radii like 3.4e7px (a "fully round" trick) all mean a pill: report them as 9999px.
  function normR(r) { var v = parseFloat(r); return /px$/.test(r) && v >= 999 ? '9999px' : r; }
  function inside(el, sel) { try { return !!el.closest(sel); } catch (e) { return false; } }

  // ---------- colour ----------
  var colorCache = new Map(), probe = null;
  function parseColor(str) {
    if (!str) return null;
    if (colorCache.has(str)) return colorCache.get(str);
    var out = null, m = /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i.exec(str.trim());
    if (m) {
      var a = m[4] == null ? 1 : (m[4].slice(-1) === '%' ? parseFloat(m[4]) / 100 : parseFloat(m[4]));
      out = { r: Math.round(+m[1]), g: Math.round(+m[2]), b: Math.round(+m[3]), a: a };
    } else if (str === 'transparent') {
      out = { r: 0, g: 0, b: 0, a: 0 };
    } else {
      try { // oklch(), color(), hsl() and named colours: let the browser paint one pixel and read it back
        if (!probe) { var c = doc.createElement('canvas'); c.width = c.height = 1; probe = c.getContext('2d', { willReadFrequently: true }); }
        probe.clearRect(0, 0, 1, 1); probe.fillStyle = '#000'; probe.fillStyle = str; probe.fillRect(0, 0, 1, 1);
        var d = probe.getImageData(0, 0, 1, 1).data; out = { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
      } catch (e) { out = null; }
    }
    colorCache.set(str, out);
    return out;
  }
  function hex(c) { return '#' + [c.r, c.g, c.b].map(function (v) { return ('0' + Math.max(0, Math.min(255, Math.round(v))).toString(16)).slice(-2); }).join('').toUpperCase(); }
  function pack(c) { return (c.r << 16) | (c.g << 8) | c.b; }
  function unpack(p) { return { r: (p >> 16) & 255, g: (p >> 8) & 255, b: p & 255 }; }
  function blend(top, under) { var a = top.a; return { r: top.r * a + under.r * (1 - a), g: top.g * a + under.g * (1 - a), b: top.b * a + under.b * (1 - a) }; }
  function lab(c) {
    function lin(v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
    var r = lin(c.r), g = lin(c.g), b = lin(c.b);
    var x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047, y = r * 0.2126 + g * 0.7152 + b * 0.0722, z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
    function f(t) { return t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; }
    return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
  }
  function deltaE(a, b) { var p = lab(a), q = lab(b); return Math.sqrt(Math.pow(p[0] - q[0], 2) + Math.pow(p[1] - q[1], 2) + Math.pow(p[2] - q[2], 2)); }
  function describe(c) {
    var max = Math.max(c.r, c.g, c.b), min = Math.min(c.r, c.g, c.b), l = (max + min) / 510, s = max === min ? 0 : (max - min) / (255 - Math.abs(max + min - 255));
    return { lightness: round(l, 2), saturation: round(s, 2), neutral: s < 0.12 || max - min < 18 };
  }
  // Merge near colours (delta E under 6) so anti-aliasing and tints do not split one brand colour.
  function cluster(entries, total, limit) {
    var out = [];
    entries.sort(function (a, b) { return b.w - a.w; }).forEach(function (e) {
      for (var i = 0; i < out.length; i++) if (deltaE(out[i].c, e.c) < 6) { out[i].w += e.w; return; }
      out.push({ c: e.c, w: e.w });
    });
    return out.slice(0, limit || 16).filter(function (e) { return total ? e.w / total >= 0.001 : true; })
      .map(function (e) { var d = describe(e.c); return { hex: hex(e.c), share: total ? round(e.w / total, 4) : null, weight: round(e.w, 1), lightness: d.lightness, saturation: d.saturation, neutral: d.neutral }; });
  }

  // ---------- font names ----------
  function familyOf(stack) {
    var first = String(stack || '').split(',')[0].replace(/["']/g, '').trim();
    var raw = first;
    var m = /^__([A-Za-z0-9]+(?:_[A-Za-z][A-Za-z0-9]*)*?)(?:_Fallback)?_[0-9a-f]{5,8}$/.exec(first); // Next.js next/font names
    if (m) first = m[1].replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, function (ch) { return ch.toUpperCase(); });
    return { family: first, raw: raw, fallback: /fallback/i.test(raw) };
  }
  function typeOf(el, text) {
    var s = css(el), f = familyOf(s.fontFamily);
    return { family: f.family, family_raw: s.fontFamily.slice(0, 160), weight: s.fontWeight, size: s.fontSize, line_height: s.lineHeight,
      letter_spacing: s.letterSpacing, transform: s.textTransform, style: s.fontStyle, color: hexOf(s.color), sample: clean(text != null ? text : el.innerText, 70) };
  }
  function hexOf(str) { var c = parseColor(str); return c && c.a > 0 ? hex(c) + (c.a < 0.98 ? '@' + round(c.a, 2) : '') : null; }
  function sig(t) { return [t.family, t.weight, t.size, t.transform, t.style].join('|'); }

  // ---------- collect visible elements ----------
  var SKIP = /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|LINK|META|HEAD|TITLE|BR|WBR|PATH|G|DEFS|USE|SYMBOL|LINEARGRADIENT|STOP|CLIPPATH|MASK|SOURCE|TRACK|OPTION)$/i;
  var all = Array.prototype.filter.call(body.querySelectorAll('*'), function (el) {
    if (SKIP.test(el.tagName)) return false;
    if (el.ownerSVGElement) return false; // only the outer <svg>
    return visible(el);
  });

  // Large fixed pop-ups (cookie walls, newsletter modals) would distort the colour shares: leave them out and say so.
  var overlays = all.filter(function (el) {
    var s = css(el); if (s.position !== 'fixed') return false;
    var r = el.getBoundingClientRect(); return r.width * r.height > 0.35 * vw * vh && !inside(el, 'header,[role=banner]');
  });
  if (overlays.length) notes.push(overlays.length + ' large fixed overlay(s) left out of the measures (pop-up, cookie banner or drawer). Close them and capture again if they are part of the design.');
  function inOverlay(el) { for (var i = 0; i < overlays.length; i++) if (overlays[i] === el || overlays[i].contains(el)) return true; return false; }
  var els = overlays.length ? all.filter(function (el) { return !inOverlay(el); }) : all;

  // ---------- paint grid: share of visible page area ----------
  var cell = Math.max(6, Math.ceil(Math.sqrt((vw * pageH) / 300000)));
  var cols = Math.ceil(vw / cell), rows = Math.ceil(pageH / cell);
  var IMAGE = -1;
  var base = { r: 255, g: 255, b: 255 };
  [root, body].forEach(function (el) { var c = parseColor(css(el).backgroundColor); if (c && c.a > 0) base = blend(c, base); });
  var grid = new Int32Array(cols * rows).fill(pack(base));
  var gradients = [], imageRects = [], bgImages = 0;
  function paint(r, value, alphaColor) {
    var x0 = Math.max(0, Math.floor(r.x / cell)), x1 = Math.min(cols, Math.ceil((r.x + r.w) / cell));
    var y0 = Math.max(0, Math.floor(r.y / cell)), y1 = Math.min(rows, Math.ceil((r.y + r.h) / cell));
    for (var y = y0; y < y1; y++) for (var x = x0; x < x1; x++) {
      var i = y * cols + x;
      if (alphaColor) { var under = grid[i] === IMAGE ? { r: 128, g: 128, b: 128 } : unpack(grid[i]); grid[i] = alphaColor.a < 0.6 && grid[i] === IMAGE ? IMAGE : pack(blend(alphaColor, under)); }
      else grid[i] = value;
    }
  }
  function gradientColor(str) {
    var stops = (str.match(/rgba?\([^)]+\)|#[0-9a-f]{3,8}\b/gi) || []).map(parseColor).filter(Boolean);
    if (!stops.length) return null;
    var c = stops.reduce(function (acc, s) { return { r: acc.r + s.r / stops.length, g: acc.g + s.g / stops.length, b: acc.b + s.b / stops.length, a: acc.a + s.a / stops.length }; }, { r: 0, g: 0, b: 0, a: 0 });
    return { mid: c, stops: stops.map(hex) };
  }
  var positionedLater = [];
  function paintElement(el) {
    var s = css(el), r = docRect(el), tag = el.tagName;
    if (r.w < 1 || r.h < 1) return;
    var isMedia = /^(IMG|VIDEO|CANVAS|IFRAME|PICTURE|OBJECT|EMBED)$/.test(tag) || (tag.toLowerCase() === 'svg' && r.w * r.h > 120 * 120);
    if (isMedia) { if (tag !== 'PICTURE') { paint(r, IMAGE); if (r.w * r.h > 40 * 40 && imageRects.length < 600) imageRects.push([round(r.x), round(r.y), round(r.w), round(r.h)]); } return; }
    var bgi = s.backgroundImage;
    if (bgi && bgi !== 'none') {
      if (/url\(/i.test(bgi) && r.w * r.h > 60 * 60) { paint(r, IMAGE); bgImages++; if (imageRects.length < 600) imageRects.push([round(r.x), round(r.y), round(r.w), round(r.h)]); return; }
      if (/gradient/i.test(bgi)) { var g = gradientColor(bgi); if (g) { if (gradients.length < 20) gradients.push({ stops: g.stops, area_px: round(r.w * r.h), on: clean(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.split(/\s+/)[0] : ''), 40) }); if (g.mid.a > 0.05) paint(r, 0, g.mid); return; } }
    }
    var c = parseColor(s.backgroundColor);
    if (c && c.a >= 0.05) { if (c.a >= 0.98) paint(r, pack(c)); else paint(r, 0, c); }
  }
  els.forEach(function (el) { var s = css(el); if (s.position !== 'static' && (parseInt(s.zIndex, 10) || 0) > 0) positionedLater.push(el); else paintElement(el); });
  positionedLater.forEach(paintElement);

  var surfaceCounts = new Map(), imageCells = 0;
  for (var gi = 0; gi < grid.length; gi++) { if (grid[gi] === IMAGE) imageCells++; else surfaceCounts.set(grid[gi], (surfaceCounts.get(grid[gi]) || 0) + 1); }
  var totalCells = grid.length;
  var surfaces = cluster(Array.from(surfaceCounts.entries()).map(function (e) { return { c: unpack(e[0]), w: e[1] }; }), totalCells, 14);

  // ---------- text: colours, fonts, sizes by character count ----------
  var textItems = [];
  var walker = doc.createTreeWalker(body, NodeFilter.SHOW_TEXT, null);
  var node;
  while ((node = walker.nextNode())) {
    var t = node.nodeValue; if (!t || !t.trim()) continue;
    var p = node.parentElement; if (!p || SKIP.test(p.tagName) || !visible(p) || (overlays.length && inOverlay(p))) continue;
    textItems.push({ el: p, chars: t.trim().length });
  }
  var totalChars = textItems.reduce(function (a, x) { return a + x.chars; }, 0) || 1;
  var textColorMap = new Map();
  textItems.forEach(function (x) { var c = parseColor(css(x.el).color); if (!c || c.a === 0) return; var k = pack(c); textColorMap.set(k, (textColorMap.get(k) || 0) + x.chars); });
  var textColors = cluster(Array.from(textColorMap.entries()).map(function (e) { return { c: unpack(e[0]), w: e[1] }; }), totalChars, 10);

  var famMap = new Map();
  textItems.forEach(function (x) {
    var s = css(x.el), f = familyOf(s.fontFamily), k = f.family;
    var e = famMap.get(k) || { family: k, raw: f.raw, chars: 0, weights: {}, sizes: {}, italic: 0, uppercase: 0 };
    e.chars += x.chars; e.weights[s.fontWeight] = (e.weights[s.fontWeight] || 0) + x.chars; e.sizes[s.fontSize] = (e.sizes[s.fontSize] || 0) + x.chars;
    if (s.fontStyle === 'italic') e.italic += x.chars; if (s.textTransform === 'uppercase') e.uppercase += x.chars;
    famMap.set(k, e);
  });
  function topKeys(o, n) { return Object.keys(o).sort(function (a, b) { return o[b] - o[a]; }).slice(0, n); }
  var families = Array.from(famMap.values()).sort(function (a, b) { return b.chars - a.chars; }).slice(0, 8).map(function (e) {
    return { family: e.family, family_raw: e.raw, char_share: round(e.chars / totalChars, 3), weights: topKeys(e.weights, 6), sizes: topKeys(e.sizes, 6), italic_share: round(e.italic / e.chars, 2), uppercase_share: round(e.uppercase / e.chars, 2) };
  });
  var sizeMap = {}; textItems.forEach(function (x) { var fs = css(x.el).fontSize; sizeMap[fs] = (sizeMap[fs] || 0) + x.chars; });
  var typeScale = topKeys(sizeMap, 14).map(function (k) { return { size: k, char_share: round(sizeMap[k] / totalChars, 3) }; }).sort(function (a, b) { return parseFloat(b.size) - parseFloat(a.size); });

  // ---------- buttons ----------
  var CHROME = 'header,nav,[role=banner],[role=navigation]';
  var FOOT = 'footer,[role=contentinfo]';
  function label(el) { return clean(el.innerText || el.value || el.getAttribute('aria-label') || el.getAttribute('title') || '', 50); }
  var buttonEls = els.filter(function (el) {
    var tag = el.tagName;
    if (!(tag === 'BUTTON' || tag === 'A' || (tag === 'INPUT' && /submit|button/i.test(el.type)) || el.getAttribute('role') === 'button')) return false;
    var r = el.getBoundingClientRect(); if (r.height < 24 || r.height > 96 || r.width < 36 || r.width > 640) return false;
    var text = label(el); if (text.length < 2 || text.length > 48) return false;
    var s = css(el), bg = parseColor(s.backgroundColor), bw = parseFloat(s.borderTopWidth) || 0, bc = parseColor(s.borderTopColor);
    var filled = bg && bg.a > 0.2, outlined = bw >= 1 && bc && bc.a > 0.2 && s.borderTopStyle !== 'none';
    if (!filled && !outlined) { // a filled child (for example a span) can carry the button look
      var kid = el.firstElementChild; if (kid) { var kb = parseColor(css(kid).backgroundColor); filled = kb && kb.a > 0.2 && kid.getBoundingClientRect().height >= 24; }
    }
    return filled || outlined;
  });
  function textHolder(el) { var w = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n; while ((n = w.nextNode())) if (n.nodeValue.trim()) return n.parentElement || el; return el; }
  var buttons = buttonEls.map(function (el) {
    var s = css(el), r = docRect(el), bg = parseColor(s.backgroundColor), bw = parseFloat(s.borderTopWidth) || 0;
    var kid = (!bg || bg.a <= 0.2) && el.firstElementChild ? css(el.firstElementChild) : null;
    return { text: label(el), tag: el.tagName.toLowerCase(), href: el.tagName === 'A' ? (el.getAttribute('href') || '') : null,
      bg: hexOf(kid ? kid.backgroundColor : s.backgroundColor), color: hexOf(css(textHolder(el)).color), border: bw >= 1 ? bw + 'px ' + (hexOf(s.borderTopColor) || '') : 'none',
      radius: normR((kid || s).borderTopLeftRadius), font: familyOf(s.fontFamily).family, size: s.fontSize, weight: s.fontWeight, transform: s.textTransform,
      letter_spacing: s.letterSpacing, padding: s.paddingTop + ' ' + s.paddingRight, height: round(r.h), width: round(r.w), shadow: s.boxShadow !== 'none',
      first_screen: r.y < vh, in_chrome: inside(el, CHROME) || inside(el, FOOT), y: round(r.y) };
  });
  var variantMap = new Map();
  buttons.forEach(function (b) {
    var k = [b.bg || 'none', b.color, b.radius, b.transform, b.border, b.font, b.weight].join('|');
    var v = variantMap.get(k) || { bg: b.bg, color: b.color, radius: b.radius, border: b.border, font: b.font, size: b.size, weight: b.weight, transform: b.transform, letter_spacing: b.letter_spacing, height: b.height, count: 0, first_screen: 0, examples: [], score: 0 };
    v.count++; if (b.first_screen) v.first_screen++; if (v.examples.length < 5 && v.examples.indexOf(b.text) < 0) v.examples.push(b.text);
    // Primary = the strongest single call to action: a saturated or dark fill beats a pale pill, size and first screen count, repeats add a little.
    var bgc = b.bg ? parseColor(b.bg.split('@')[0]) : null, d = bgc ? describe(bgc) : null;
    var strong = !bgc ? 0.3 : (!d.neutral ? 3 : (d.lightness < 0.3 ? 2 : 0.5));
    var one = (b.in_chrome ? 0.3 : 1) * strong * (b.first_screen ? 1.5 : 1) * Math.min(3, (b.width * b.height) / 6000);
    v.best = Math.max(v.best || 0, one);
    variantMap.set(k, v);
  });
  variantMap.forEach(function (v) { v.score = v.best * (1 + 0.25 * Math.log2(v.count)); delete v.best; });
  var buttonStyles = Array.from(variantMap.values()).sort(function (a, b) { return b.score - a.score; }).slice(0, 8);
  if (buttonStyles[0]) buttonStyles[0].primary = true;
  buttonStyles.forEach(function (v) { v.score = round(v.score, 2); });
  var primaryButton = buttons.filter(function (b) { return buttonStyles[0] && [b.bg || 'none', b.color, b.radius, b.transform].join('|') === [buttonStyles[0].bg || 'none', buttonStyles[0].color, buttonStyles[0].radius, buttonStyles[0].transform].join('|'); })
    .sort(function (a, b) { return (b.first_screen - a.first_screen) || a.y - b.y; })[0] || null;

  // ---------- links ----------
  var buttonSet = new Set(buttonEls);
  var bodyLinks = els.filter(function (el) { return el.tagName === 'A' && !buttonSet.has(el) && !inside(el, CHROME) && !inside(el, FOOT) && clean(el.innerText).length > 1; });
  var linkStyles = tally(bodyLinks, function (a) { var s = css(a); return [hexOf(s.color), s.textDecorationLine, s.fontWeight, s.textTransform].join(' | '); }, 5)
    .map(function (t) { var p = t.value.split(' | '); return { color: p[0], decoration: p[1], weight: p[2], transform: p[3], count: t.count }; });

  // ---------- shape ----------
  function hasShadow(s) { var b = s.boxShadow; if (!b || b === 'none') return false; var cs = b.match(/rgba?\([^)]+\)/g) || []; return !cs.length || cs.some(function (c) { var p = parseColor(c); return p && p.a > 0.01; }); }
  var painted = els.filter(function (el) { var s = css(el), bg = parseColor(s.backgroundColor); return (bg && bg.a > 0.05) || parseFloat(s.borderTopWidth) > 0 || el.tagName === 'IMG' || hasShadow(s); });
  var radii = tally(painted, function (el) { var r = normR(css(el).borderTopLeftRadius); return r === '0px' ? null : r; }, 10);
  var squareCount = painted.filter(function (el) { return normR(css(el).borderTopLeftRadius) === '0px'; }).length;
  var cards = painted.filter(function (el) { var r = el.getBoundingClientRect(); var s = css(el); return r.width >= 140 && r.width <= vw * 0.7 && r.height >= 120 && (hasShadow(s) || parseFloat(s.borderTopWidth) > 0 || (parseColor(s.backgroundColor) || { a: 0 }).a > 0.05); });
  var shape = {
    radius: radii, square_elements: squareCount, painted_elements: painted.length,
    button_radius: buttonStyles[0] ? buttonStyles[0].radius : null,
    card_radius: (tally(cards, function (el) { return normR(css(el).borderTopLeftRadius); }, 1)[0] || {}).value || null,
    image_radius: (tally(els.filter(function (el) { return el.tagName === 'IMG' && el.getBoundingClientRect().width > 120; }), function (el) { return normR(css(el).borderTopLeftRadius); }, 1)[0] || {}).value || null,
    shadows: tally(els, function (el) { var s = css(el); return hasShadow(s) ? s.boxShadow.replace(/rgba?\(0, 0, 0, 0\) 0px 0px 0px 0px,?\s*/g, '').trim() : null; }, 6),
    borders: tally(els, function (el) { var s = css(el); return parseFloat(s.borderTopWidth) > 0 && s.borderTopStyle !== 'none' ? s.borderTopWidth + ' ' + s.borderTopStyle + ' ' + hexOf(s.borderTopColor) : null; }, 6)
  };

  // ---------- type roles ----------
  function firstVisible(sel) { return els.filter(function (el) { return el.matches(sel) && clean(el.innerText).length > 1; }); }
  function modeRole(list) {
    if (!list.length) return null;
    var m = new Map();
    list.forEach(function (el) { var t = typeOf(el); var k = sig(t); var e = m.get(k) || { t: t, n: 0 }; e.n++; m.set(k, e); });
    var best = Array.from(m.values()).sort(function (a, b) { return b.n - a.n; })[0]; best.t.count = list.length; return best.t;
  }
  var roles = {};
  var h1s = firstVisible('h1');
  if (h1s.length) { roles.h1 = typeOf(h1s[0]); roles.h1.count = h1s.length; }
  else {
    var big = textItems.filter(function (x) { return x.el.getBoundingClientRect().top + sy < vh * 1.5; }).sort(function (a, b) { return parseFloat(css(b.el).fontSize) - parseFloat(css(a.el).fontSize); })[0];
    if (big) { roles.h1 = typeOf(big.el); roles.h1.note = 'no <h1>: largest text on the first screen'; }
  }
  var h2 = modeRole(firstVisible('h2')); if (h2) roles.h2 = h2;
  var h3 = modeRole(firstVisible('h3')); if (h3) roles.h3 = h3;
  var bodyMap = new Map();
  textItems.forEach(function (x) {
    var s = css(x.el), size = parseFloat(s.fontSize);
    if (size < 11 || size > 22 || x.chars < 20 || inside(x.el, CHROME + ',' + FOOT + ',button,a,h1,h2,h3,h4,label')) return;
    var t = typeOf(x.el); var k = sig(t); var e = bodyMap.get(k) || { t: t, n: 0 }; e.n += x.chars; bodyMap.set(k, e);
  });
  var bodyBest = Array.from(bodyMap.values()).sort(function (a, b) { return b.n - a.n; })[0];
  if (bodyBest) { roles.body = bodyBest.t; roles.body.char_share = round(bodyBest.n / totalChars, 3); }
  if (primaryButton) { var pbEl = buttonEls.filter(function (el) { return label(el) === primaryButton.text; })[0]; if (pbEl) roles.button = typeOf(pbEl); }
  var navLinkEls = els.filter(function (el) { return el.tagName === 'A' && inside(el, CHROME) && clean(el.innerText).length > 1 && !buttonSet.has(el); });
  var nv = modeRole(navLinkEls); if (nv) roles.nav = nv;
  var priceRe = /(?:₹|\$|£|€|¥|Rs\.?\s?|INR\s?|USD\s?|AED\s?)\s?\d[\d,]*(?:\.\d{1,2})?|\d[\d,]*(?:\.\d{1,2})?\s?(?:₹|€|USD|INR|EUR|GBP)/;
  var priceEls = els.filter(function (el) { var own = Array.prototype.filter.call(el.childNodes, function (n) { return n.nodeType === 3; }).map(function (n) { return n.nodeValue; }).join(' '); return priceRe.test(own) && own.trim().length < 40; });
  var pr = modeRole(priceEls); if (pr) roles.price = pr;

  // ---------- font files that actually loaded ----------
  var loaded = [];
  try { doc.fonts.forEach(function (f) { if (f.status === 'loaded') loaded.push({ family: familyOf(f.family).family, family_raw: f.family.replace(/["']/g, ''), weight: f.weight, style: f.style }); }); } catch (e) { /* FontFaceSet not available */ }
  var seenFont = {}; loaded = loaded.filter(function (f) { var k = f.family_raw + f.weight + f.style; if (seenFont[k]) return false; seenFont[k] = 1; return true; }).slice(0, 40);
  var fontFiles = [];
  try { performance.getEntriesByType('resource').forEach(function (e) { if (/\.(woff2?|ttf|otf|eot)(\?|#|$)/i.test(e.name) && fontFiles.length < 30) fontFiles.push(e.name); }); } catch (e) { /* no timing API */ }
  var fontCss = Array.prototype.map.call(doc.querySelectorAll('link[rel~="stylesheet"][href]'), function (l) { return l.href; }).filter(function (h) { return /fonts\.googleapis|typekit|use\.typekit|fonts\.bunny|fontawesome|font/i.test(h); }).slice(0, 10);
  var familiesLoaded = {}; loaded.forEach(function (f) { familiesLoaded[f.family.toLowerCase()] = 1; });
  Object.keys(roles).forEach(function (k) { var fam = roles[k].family.toLowerCase(); roles[k].font_loaded = !!familiesLoaded[fam] || /^(arial|helvetica|georgia|times new roman|system-ui|-apple-system|blinkmacsystemfont|segoe ui|sans-serif|serif|monospace|verdana|tahoma)$/.test(fam) ? (familiesLoaded[fam] ? 'webfont' : 'system') : 'not loaded'; });

  // ---------- header and nav ----------
  function topBars() {
    var bars = els.filter(function (el) { var s = css(el); if (!/fixed|sticky/.test(s.position)) return false; var r = el.getBoundingClientRect(); return r.top <= 5 && r.width >= vw * 0.8 && r.height >= 30 && r.height <= 280; });
    return bars.filter(function (el) { return !bars.some(function (o) { return o !== el && o.contains(el); }); });
  }
  var header = Array.prototype.filter.call(doc.querySelectorAll('header,[role=banner]'), function (h) { return visible(h) && !inside(h, 'footer,[role=contentinfo]') && h.getBoundingClientRect().top + sy < 300; })[0]
    || topBars()[0]
    || els.filter(function (el) { var r = el.getBoundingClientRect(); return r.top + sy < 10 && r.height >= 30 && r.height <= 280 && r.width > vw * 0.8 && el.querySelector('a[href]'); })[0] || null;
  function linkItem(a) {
    var text = clean(a.innerText || a.getAttribute('aria-label') || a.getAttribute('title') || (a.querySelector('img') || {}).alt || '', 60);
    return { text: text, href: a.getAttribute('href') || '', visible: visible(a), icon: !clean(a.innerText) };
  }
  function dedupeLinks(list, max) { var seen = {}; return list.filter(function (l) { var k = l.text.toLowerCase() + '|' + l.href; if (!l.text || seen[k]) return false; seen[k] = 1; return true; }).slice(0, max); }
  var navScopes = Array.prototype.slice.call(doc.querySelectorAll('header,nav,[role=banner],[role=navigation]')).filter(function (n) { return !inside(n, FOOT); });
  if (header && navScopes.indexOf(header) < 0) navScopes.unshift(header);
  var navLinks = [];
  navScopes.forEach(function (sc) { Array.prototype.forEach.call(sc.querySelectorAll('a[href]'), function (a) { navLinks.push(linkItem(a)); }); });
  navLinks = dedupeLinks(navLinks, 80);
  var logo = null;
  function q(scope, sel) { try { return scope ? scope.querySelector(sel) : null; } catch (e) { return null; } }
  if (header) { var li = q(header, 'img[alt*="logo" i],img[src*="logo" i],a[href="/"] img,img'); var ls = q(header, 'svg[aria-label],a[href="/"] svg'); if (li) logo = { type: 'img', src: li.currentSrc || li.src, alt: li.alt || '' }; else if (ls) logo = { type: 'svg', label: ls.getAttribute('aria-label') || '' }; }
  var nav = {
    items: navLinks.filter(function (l) { return l.visible; }).map(function (l) { return { text: l.text, href: l.href, icon: l.icon || undefined }; }),
    hidden_items: navLinks.filter(function (l) { return !l.visible; }).slice(0, 50).map(function (l) { return { text: l.text, href: l.href }; }),
    header_height: header ? round(header.getBoundingClientRect().height) : null,
    sticky: header ? /sticky|fixed/.test(css(header).position) : null,
    has_search: !!(q(header, 'input[type=search],input[placeholder*="search" i],[aria-label*="search" i],a[href*="search"]') || doc.querySelector('[role=search]')),
    has_cart: !!(q(header, 'a[href*="cart"],[aria-label*="cart" i],[aria-label*="bag" i],a[href*="/bag"]')),
    hamburger: !!q(header, 'button[aria-label*="menu" i],[class*="hamburger" i],[class*="menu-toggle" i],[aria-label*="navigation" i],[aria-label*="drawer" i]'),
    logo: logo
  };
  var announcement = els.filter(function (el) { var r = el.getBoundingClientRect(); return r.top + sy < 120 && r.height >= 20 && r.height <= 64 && r.width > vw * 0.9 && clean(el.innerText).length > 6 && clean(el.innerText).length < 160 && !el.querySelector('nav,input'); })[0];
  if (announcement) nav.announcement = { text: clean(announcement.innerText, 140), bg: hexOf(css(announcement).backgroundColor) };

  // ---------- page blocks, in order ----------
  function blockKids(el) { return Array.prototype.filter.call(el.children, function (c) { if (SKIP.test(c.tagName) || !visible(c)) return false; var r = c.getBoundingClientRect(); return r.height >= 16 && r.width >= vw * 0.45; }); }
  var blocks = blockKids(body);
  for (var pass = 0; pass < 8; pass++) {
    var next = [], changed = false;
    blocks.forEach(function (b) {
      var r = b.getBoundingClientRect(), kids = blockKids(b);
      var wrapper = kids.length === 1 && kids[0].getBoundingClientRect().height >= r.height * 0.8;
      var tall = r.height > Math.max(vh * 2.2, pageH * 0.4) && kids.length >= 2 && !/^(HEADER|FOOTER)$/.test(b.tagName);
      if ((wrapper || tall) && kids.length) { next.push.apply(next, kids); changed = true; } else next.push(b);
    });
    blocks = next; if (!changed) break;
  }
  blocks = blocks.filter(function (b) { return css(b).position !== 'fixed' && !(overlays.length && inOverlay(b)) && !(header && header !== b && header.contains(b)); });
  if (header && !blocks.some(function (b) { return b === header || b.contains(header); })) blocks.push(header);
  blocks.sort(function (a, b) { return a.getBoundingClientRect().top - b.getBoundingClientRect().top; });

  // ---------- footer ----------
  var footers = Array.prototype.filter.call(doc.querySelectorAll('footer,[role=contentinfo]'), function (f) { return f.querySelectorAll('a[href]').length > 0; });
  var footer = footers.sort(function (a, b) { return b.querySelectorAll('a').length - a.querySelectorAll('a').length; })[0] || null;
  if (!footer) { var cands = Array.prototype.filter.call(doc.querySelectorAll('[class*="footer" i],[id*="footer" i]'), function (f) { return f.querySelectorAll('a[href]').length >= 4; }); footer = cands.sort(function (a, b) { return b.querySelectorAll('a').length - a.querySelectorAll('a').length; })[0] || null; }
  if (!footer) { // no footer tag: the last block in the bottom third with many links
    footer = blocks.slice().reverse().filter(function (b) { return docRect(b).y > fullHeight * 0.6 && b.querySelectorAll('a[href]').length >= 8; })[0] || null;
    if (footer) notes.push('No <footer> element: the last link-heavy block was taken as the footer.');
  }
  var footerOut = null;
  if (footer) {
    var used = new Set(), columns = [];
    var lists = Array.prototype.slice.call(footer.querySelectorAll('ul,ol,nav,[class*="col" i],[class*="menu" i],[class*="links" i]')).filter(function (l) { return l.querySelectorAll('a[href]').length >= 2; });
    lists = lists.filter(function (l) { return !lists.some(function (o) { return o !== l && l.contains(o); }); }); // innermost groups
    if (!lists.length) { // no lists: group links by the nearest parent that holds two or more
      var byParent = new Map();
      Array.prototype.forEach.call(footer.querySelectorAll('a[href]'), function (a) { var p = a.parentElement; while (p && p !== footer && p.querySelectorAll('a[href]').length < 2) p = p.parentElement; if (p && p !== footer) byParent.set(p, 1); });
      lists = Array.from(byParent.keys());
    }
    lists.forEach(function (l) {
      var links = Array.prototype.filter.call(l.querySelectorAll('a[href]'), function (a) { return !used.has(a); });
      if (links.length < 2) return; links.forEach(function (a) { used.add(a); });
      var heading = '', probeEl = l;
      for (var up = 0; up < 3 && probeEl && !heading; up++) {
        var prev = probeEl.previousElementSibling;
        while (prev && !heading) { var tx = clean(prev.innerText, 60); if (tx && tx.length < 50 && !prev.querySelector('a')) heading = tx; prev = prev.previousElementSibling; }
        probeEl = probeEl.parentElement; if (probeEl === footer) break;
      }
      if (!heading) { var firstKid = Array.prototype.filter.call(l.children, function (c) { return !c.querySelector('a') && c.tagName !== 'A' && clean(c.innerText).length > 1 && clean(c.innerText).length < 50; })[0]; if (firstKid) heading = clean(firstKid.innerText, 60); }
      columns.push({ heading: heading, links: dedupeLinks(links.map(linkItem), 30).map(function (x) { return { text: x.text, href: x.href }; }) });
    });
    var loose = Array.prototype.filter.call(footer.querySelectorAll('a[href]'), function (a) { return !used.has(a); }).map(linkItem);
    var social = Array.prototype.map.call(footer.querySelectorAll('a[href]'), function (a) { return a.getAttribute('href') || ''; }).filter(function (h) { return /instagram|facebook|youtube|tiktok|twitter|x\.com|linkedin|pinterest|whatsapp|wa\.me|threads/i.test(h); });
    footerOut = { columns: columns.slice(0, 12), other_links: dedupeLinks(loose, 30).map(function (x) { return { text: x.text, href: x.href }; }),
      link_count: footer.querySelectorAll('a[href]').length, social: social.slice(0, 12), bg: hexOf(css(footer).backgroundColor),
      text_sample: clean(footer.innerText, 240), height: round(footer.getBoundingClientRect().height) };
  }

  // ---------- sections ----------
  function regionColor(r) {
    var y0 = Math.max(0, Math.floor(r.y / cell)), y1 = Math.min(rows, Math.ceil((r.y + r.h) / cell)), x0 = Math.max(0, Math.floor(r.x / cell)), x1 = Math.min(cols, Math.ceil((r.x + r.w) / cell));
    var m = new Map(), n = 0;
    for (var y = y0; y < y1; y += 2) for (var x = x0; x < x1; x += 2) { var v = grid[y * cols + x]; m.set(v, (m.get(v) || 0) + 1); n++; }
    var best = Array.from(m.entries()).sort(function (a, b) { return b[1] - a[1]; })[0];
    if (!best) return null;
    return { bg: best[0] === IMAGE ? 'image' : hex(unpack(best[0])), image_share: round((m.get(IMAGE) || 0) / Math.max(1, n), 2) };
  }
  var REVIEW = /\breviews?\b|\bratings?\b|testimonial|stars?\b|★|what (?:our )?customers|trustpilot|verified buyer/i;
  var heroTaken = false;
  var sections = blocks.map(function (b, i) {
    var r = docRect(b), text = clean(b.innerText, 2000), heading = '';
    var hEl = Array.prototype.filter.call(b.querySelectorAll('h1'), visible)[0] || Array.prototype.filter.call(b.querySelectorAll('h2,h3,h4,[role=heading]'), visible)[0];
    if (hEl) heading = clean(hEl.innerText, 90);
    else { var biggest = textItems.filter(function (x) { return b.contains(x.el); }).sort(function (a, c) { return parseFloat(css(c.el).fontSize) - parseFloat(css(a.el).fontSize); })[0]; if (biggest && parseFloat(css(biggest.el).fontSize) >= 18) heading = clean(biggest.el.innerText, 90); }
    var imgs = Array.prototype.filter.call(b.querySelectorAll('img,video,svg'), function (m) { return visible(m) && m.getBoundingClientRect().width > 40; }).length;
    var prices = (text.match(new RegExp(priceRe.source, 'g')) || []).length;
    var rc = regionColor(r) || {};
    var kind = 'content', tag = b.tagName.toLowerCase();
    if (b === header || tag === 'header' || b.matches('[role=banner]')) kind = 'header';
    else if (footer && (b === footer || b.contains(footer) || footer.contains(b))) kind = 'footer';
    else if (r.y < 140 && r.h <= 64 && text.length < 160) kind = 'announcement';
    else if (!heroTaken && r.y < vh * 0.9 && r.h > vh * 0.3 && ((rc.image_share || 0) > 0.4 || (h1s[0] && b.contains(h1s[0])))) { kind = 'hero'; heroTaken = true; }
    else if (b.querySelector('input[type=email]')) kind = 'newsletter';
    else if (/\bfaq\b|frequently asked|questions/i.test(heading) || b.querySelectorAll('details,[aria-expanded]').length >= 3) kind = 'faq';
    else if (prices >= 4) kind = 'product-grid';
    else if (REVIEW.test(heading) || (REVIEW.test(text.slice(0, 300)) && /★|\d\.\d/.test(text))) kind = 'reviews';
    else if (imgs >= 4 && text.length < 160) kind = 'image-row';
    else if (r.h < 220 && b.children.length >= 3 && text.length < 400) kind = 'trust-strip';
    else if (/scroll|auto/.test(css(b).overflowX) || b.querySelector('[class*="swiper" i],[class*="carousel" i],[class*="slider" i],[class*="splide" i]')) kind = 'carousel';
    else if (b.querySelector('button,a[class*="btn" i],a[class*="button" i]') && text.length < 260) kind = 'cta';
    return { index: i, kind: kind, tag: tag, id: b.id || undefined, cls: typeof b.className === 'string' ? clean(b.className, 50) || undefined : undefined,
      heading: heading, top: round(r.y), height: round(r.h), height_share: round(r.h / Math.max(1, fullHeight), 3), bg: rc.bg, image_share: rc.image_share,
      images: imgs, links: b.querySelectorAll('a[href]').length, buttons: b.querySelectorAll('button').length, prices: prices, text_sample: clean(text, 110) };
  });
  if (sections.length < 3) notes.push('Only ' + sections.length + ' sections found: the page may use one tall wrapper. Check the screenshot for the real order.');

  // ---------- images ----------
  var imgEls = els.filter(function (el) { return /^(IMG|VIDEO)$/.test(el.tagName) && el.getBoundingClientRect().width > 40 && el.getBoundingClientRect().height > 40; });
  var aspects = { landscape: 0, portrait: 0, square: 0 };
  imgEls.forEach(function (el) { var r = el.getBoundingClientRect(), q = r.width / r.height; if (q > 1.15) aspects.landscape++; else if (q < 0.87) aspects.portrait++; else aspects.square++; });
  var images = { count: imgEls.length, videos: imgEls.filter(function (el) { return el.tagName === 'VIDEO'; }).length, background_images: bgImages,
    per_1000px: round(imgEls.length / Math.max(1, fullHeight / 1000), 1), per_screen: round(imgEls.length / Math.max(1, fullHeight / vh), 1),
    area_share: round(imageCells / totalCells, 3), aspects: aspects, lazy_unloaded: imgEls.filter(function (im) { return im.tagName === 'IMG' && (!im.complete || im.naturalWidth === 0); }).length,
    alt_missing: imgEls.filter(function (el) { return el.tagName === 'IMG' && !el.getAttribute('alt'); }).length };
  if (images.lazy_unloaded > 3) notes.push(images.lazy_unloaded + ' images had not loaded. Scroll to the bottom and back, then capture again.');

  // ---------- voice: verbatim lines ----------
  function uniq(list) { var seen = {}; return list.filter(function (s) { var k = s.toLowerCase(); if (seen[k]) return false; seen[k] = 1; return true; }); }
  var headlines = uniq(els.filter(function (el) { return /^H[1-3]$/.test(el.tagName) && !inside(el, CHROME + ',' + FOOT); }).map(function (el) { return clean(el.innerText, 160); }).filter(function (s) { return s.length >= 4 && s.length <= 160; }));
  var bodyLines = uniq(els.filter(function (el) { return /^(P|LI|BLOCKQUOTE|DD)$/.test(el.tagName) && !inside(el, CHROME + ',' + FOOT + ',button'); }).map(function (el) { return clean(el.innerText, 320); })
    .filter(function (s) { return s.length >= 40 && s.length <= 320 && !/©|copyright|all rights reserved|cookie|privacy policy/i.test(s); }));
  var ctas = uniq(buttons.map(function (b) { return b.text; })).slice(0, 12);
  var sample = headlines.slice(0, 5).map(function (t) { return { kind: 'headline', text: t }; }).concat(bodyLines.slice(0, 5).map(function (t) { return { kind: 'body', text: t }; }));
  if (sample.length < 5) sample = sample.concat(ctas.slice(0, 5 - sample.length).map(function (t) { return { kind: 'cta', text: t }; }));
  var bodyText = bodyLines.join(' ');
  var we = (bodyText.match(/\b(we|our|us)\b/gi) || []).length, you = (bodyText.match(/\b(you|your)\b/gi) || []).length;
  var sentences = bodyText.split(/[.!?]+\s/).filter(function (s) { return s.trim().length > 3; });
  var voice = { samples: sample.slice(0, 10), headlines: headlines.slice(0, 12), ctas: ctas,
    stats: { we_per_100_words: round(we * 100 / Math.max(1, bodyText.split(/\s+/).length), 1), you_per_100_words: round(you * 100 / Math.max(1, bodyText.split(/\s+/).length), 1),
      avg_sentence_words: round(sentences.reduce(function (a, s) { return a + s.split(/\s+/).length; }, 0) / Math.max(1, sentences.length), 1),
      exclamations: (bodyText.match(/!/g) || []).length, uppercase_ctas: ctas.filter(function (c) { return c === c.toUpperCase() && /[A-Z]/.test(c); }).length + '/' + ctas.length,
      headline_case: headlines.length ? (headlines.filter(function (h) { return h === h.toUpperCase() && /[A-Z]/.test(h); }).length > headlines.length / 2 ? 'upper' : (headlines.filter(function (h) { return /^[A-Z][^A-Z]*$/.test(h.replace(/\b[A-Z]{2,}\b/g, '')); }).length > headlines.length / 2 ? 'sentence' : 'title or mixed')) : null } };

  // ---------- live facts ----------
  var capturedAt = new Date().toISOString();
  var lines = uniq(String(body.innerText || '').split(/\n+/).map(function (s) { return clean(s, 200); }).filter(function (s) { return s.length >= 3; }));
  var FACTS = {
    prices: new RegExp(priceRe.source),
    offers: /\b\d{1,2}\s?% off\b|\bsale\b|\bdiscount|\bcoupon\b|\buse code\b|\bcode\s+[A-Z0-9]{4,}\b|\bbuy \d+ get\b|\bfree gift\b|\bflat \d+|\bextra \d+%|\bbogo\b|\boffer\b|\bdeal\b/i,
    shipping: /free (?:shipping|delivery)|\bships?\b|\bshipping\b|\bdelivery\b|\bdispatch|\bdelivered\b|\bcourier\b|\bpickup\b/i,
    guarantees: /guarantee|warrant|\breturns?\b|\bexchange\b|\brefund|money[- ]back|lifetime|hallmark|certified|\bsecure (?:checkout|payment)/i,
    reviews: /\b\d[\d,.]*\+?\s*(?:k\s*)?(?:[A-Za-z]+\s+)?(?:reviews?|ratings?|customers|orders|happy|sold)\b|\b\d\.\d\s*(?:\/\s*5|stars?|out of 5|★)|★{3,}|\brated\b/i
  };
  var facts = { captured_at: capturedAt, url: location.href, prices: [], offers: [], shipping: [], guarantees: [], reviews: [], structured: [] };
  var quoted = /^["“'‘]/; // customer quotes are voice, not the business's own offer or policy
  lines.forEach(function (l) { Object.keys(FACTS).forEach(function (k) { if (facts[k].length < 16 && FACTS[k].test(l) && l.length <= 200 && !(quoted.test(l) && k !== 'prices')) facts[k].push(l); }); });
  Array.prototype.forEach.call(doc.querySelectorAll('del,s,strike,[class*="compare" i],[class*="was-price" i]'), function (el) { var t = clean(el.innerText, 40); if (priceRe.test(t) && facts.prices.length < 20) facts.prices.push('was ' + t); });
  Array.prototype.forEach.call(doc.querySelectorAll('script[type="application/ld+json"]'), function (s) {
    try {
      var data = JSON.parse(s.textContent), stack = Array.isArray(data) ? data.slice() : [data];
      while (stack.length && facts.structured.length < 20) {
        var o = stack.shift(); if (!o || typeof o !== 'object') continue;
        if (o['@graph']) stack = stack.concat(o['@graph']);
        var type = [].concat(o['@type'] || []).join(',');
        if (/Product/.test(type)) {
          var off = [].concat(o.offers || [])[0] || {};
          facts.structured.push({ type: 'Product', name: clean(o.name, 90), price: off.price || off.lowPrice || null, currency: off.priceCurrency || null, availability: off.availability || null,
            rating: o.aggregateRating ? o.aggregateRating.ratingValue : null, review_count: o.aggregateRating ? (o.aggregateRating.reviewCount || o.aggregateRating.ratingCount) : null });
        } else if (/Organization|Store|LocalBusiness/.test(type) && o.aggregateRating) {
          facts.structured.push({ type: type, name: clean(o.name, 90), rating: o.aggregateRating.ratingValue, review_count: o.aggregateRating.reviewCount || o.aggregateRating.ratingCount });
        }
        if (o.offers && typeof o.offers === 'object' && !Array.isArray(o.offers) && o.offers.offers) stack = stack.concat(o.offers.offers);
      }
    } catch (e) { /* unreadable JSON-LD is skipped */ }
  });
  ['product:price:amount', 'og:price:amount'].forEach(function (p) { var m = doc.querySelector('meta[property="' + p + '"]'); if (m) facts.structured.push({ type: 'meta', property: p, price: m.content, currency: (doc.querySelector('meta[property="' + p.replace('amount', 'currency') + '"]') || {}).content || null }); });

  // ---------- page meta and CSS tokens ----------
  function meta(name) { var m = doc.querySelector('meta[name="' + name + '"],meta[property="' + name + '"]'); return m ? m.content : null; }
  var platform = window.Shopify ? 'shopify' : (doc.getElementById('__NEXT_DATA__') || window.next ? 'nextjs' : (doc.querySelector('link[href*="wp-content"],script[src*="wp-content"]') ? 'wordpress' : (doc.querySelector('[data-wf-site]') ? 'webflow' : (/squarespace/i.test(doc.documentElement.innerHTML.slice(0, 20000)) ? 'squarespace' : null))));
  var cssVars = [];
  try {
    Array.prototype.forEach.call(doc.styleSheets, function (sheet) {
      var rules; try { rules = sheet.cssRules; } catch (e) { return; } // cross-origin sheets cannot be read
      Array.prototype.forEach.call(rules || [], function (rule) {
        if (cssVars.length >= 80 || !rule.selectorText || !/(^|,)\s*(:root|html|body)\s*(,|$)/.test(rule.selectorText)) return;
        for (var i = 0; i < rule.style.length && cssVars.length < 80; i++) { var prop = rule.style[i]; if (prop.indexOf('--') === 0) cssVars.push([prop, clean(rule.style.getPropertyValue(prop), 80)]); }
      });
    });
  } catch (e) { /* stylesheet access refused */ }

  // ---------- palette: one list with roles ----------
  var palette = [];
  function addPalette(hexStr, field, value, role) {
    if (!hexStr) return; var c = parseColor(hexStr.split('@')[0]); if (!c) return;
    for (var i = 0; i < palette.length; i++) if (deltaE(palette[i]._c, c) < 6) { var e = palette[i]; if (field) e[field] = round((e[field] || 0) + value, 4); if (e.roles.indexOf(role) < 0) e.roles.push(role); return; }
    var n = { hex: hex(c), area_share: 0, text_share: 0, roles: [role], _c: c }; if (field) n[field] = value; palette.push(n);
  }
  surfaces.forEach(function (s) { addPalette(s.hex, 'area_share', s.share, s.share >= 0.08 ? 'background' : 'surface'); });
  textColors.forEach(function (t) { addPalette(t.hex, 'text_share', t.share, 'text'); });
  buttonStyles.forEach(function (b, i) { if (b.bg) addPalette(b.bg, null, 0, i === 0 ? 'primary-button' : 'button'); if (b.color) addPalette(b.color, null, 0, 'button-text'); });
  linkStyles.forEach(function (l) { addPalette(l.color, null, 0, 'link'); });
  if (nav.announcement && nav.announcement.bg) addPalette(nav.announcement.bg, null, 0, 'announcement');
  if (footerOut && footerOut.bg) addPalette(footerOut.bg, null, 0, 'footer');
  palette.forEach(function (p) { var d = describe(p._c); p.neutral = d.neutral; p.lightness = d.lightness; p.saturation = d.saturation; if (!d.neutral && p.area_share < 0.06 && p.roles.some(function (r) { return r !== 'text'; })) p.roles.push('accent'); delete p._c; });
  palette.sort(function (a, b) { return (b.area_share + b.text_share * 0.1) - (a.area_share + a.text_share * 0.1); });

  var dna = {
    schema: 'ai-blocks-brand-dna/1', snippet_version: VERSION, method: 'snippet', source: location.href, captured_at: capturedAt,
    page: { url: location.href, path: location.pathname, title: doc.title, description: meta('description'), lang: root.lang || null, canonical: (doc.querySelector('link[rel=canonical]') || {}).href || null,
      og_image: meta('og:image'), theme_color: meta('theme-color'), platform: platform, viewport: { width: vw, height: vh }, page_height: fullHeight, measured_height: pageH },
    palette: palette.slice(0, 18),
    palette_detail: { method: 'dom paint grid, ' + cell + ' px cells, document order with raised z-index on top', surfaces: surfaces, image_share: round(imageCells / totalCells, 3), text_by_chars: textColors, gradients: gradients },
    type: { roles: roles, families: families, scale: typeScale, loaded_fonts: loaded, font_files: fontFiles, font_css: fontCss },
    shape: shape, buttons: { styles: buttonStyles, primary: primaryButton, count: buttons.length }, links: linkStyles,
    nav: nav, footer: footerOut, sections: sections, images: images, image_rects: imageRects, voice: voice, facts: facts,
    css_variables: cssVars, notes: notes, took_ms: Date.now() - started
  };
  try { window.__brandDNA = dna; } catch (e) { /* frozen window */ }
  if (!opts.quiet && typeof console !== 'undefined') {
    try {
      console.log('[brand-dna] ' + dna.page.title + ' | ' + families.slice(0, 3).map(function (f) { return f.family + ' ' + Math.round(f.char_share * 100) + '%'; }).join(', ') +
        ' | top colours ' + palette.slice(0, 5).map(function (p) { return p.hex + ' ' + Math.round(p.area_share * 100) + '%'; }).join(', ') + ' | ' + sections.length + ' sections | ' + images.count + ' images');
      if (typeof copy === 'function') { copy(JSON.stringify(dna, null, 2)); console.log('[brand-dna] JSON copied to the clipboard. Save it as context/brand-dna.json.'); }
    } catch (e) { /* console helpers missing */ }
  }
  return dna;
})(typeof window !== 'undefined' ? window.__brandDnaOptions : undefined);
