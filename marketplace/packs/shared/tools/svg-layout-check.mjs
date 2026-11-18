// Read-only SVG geometry diagnostics. No browser launch, network or file writes.
// Run captureSvgLayout in an already authorized local browser page, then review
// its snapshot in Node. A clear diagnostic is never visual/rights certification.

export async function captureSvgLayout({ selector = 'svg' } = {}) {
  if (typeof selector !== 'string' || selector.length > 200) throw Error('Use a bounded SVG selector');
  const matches = document.querySelectorAll(selector);
  if (matches.length !== 1 || matches[0].localName !== 'svg') throw Error('Select exactly one rendered SVG');
  const root = matches[0];
  if (root.querySelectorAll('*').length > 1000) throw Error('SVG exceeds 1000 elements');
  if (document.fonts?.status === 'loading') throw Error('Wait for document.fonts.ready before probing');
  const rect = root.getBoundingClientRect();
  if (!rect.width || !rect.height) throw Error('SVG has no rendered viewport');
  const box = r => ({ x: r.x - rect.x, y: r.y - rect.y, width: r.width, height: r.height });
  const bounds = el => {
    const b = el.getBBox(), m = el.getScreenCTM();
    if (!m) throw Error('Missing transform');
    const points = [[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y]) => new DOMPoint(x,y).matrixTransform(m));
    const x = Math.min(...points.map(p => p.x)), y = Math.min(...points.map(p => p.y));
    return box({ x, y, width: Math.max(...points.map(p => p.x))-x, height: Math.max(...points.map(p => p.y))-y });
  };
  const warnings = [], items = [];
  for (let ancestor = root.parentElement; ancestor; ancestor = ancestor.parentElement) {
    const s = getComputedStyle(ancestor);
    if (Number(s.opacity) !== 1 || ['filter','clipPath','maskImage','mixBlendMode'].some(k => s[k] && !['none','normal'].includes(s[k]))) {
      warnings.push({ code: 'UNSUPPORTED_ANCESTOR_EFFECT', element: 'svg', detail: 'An enclosing HTML element changes opacity, filtering, clipping, masking or blending.' });
      break;
    }
  }
  for (const el of root.querySelectorAll('*')) {
    const tag = el.localName;
    if (el.closest('defs,clipPath,mask,marker,symbol,pattern')) continue;
    let hidden = false;
    const effects = [];
    for (let node = el; node && node !== root.parentElement; node = node.parentElement) {
      const s = getComputedStyle(node);
      if (s.display === 'none' || s.visibility === 'hidden') hidden = true;
      for (const k of ['filter','clipPath','maskImage','mixBlendMode']) if (s[k] && !['none','normal'].includes(s[k])) effects.push(k);
      if (Number(s.opacity) !== 1) effects.push('opacity');
      if (node === root) break;
    }
    if (hidden || ['title','desc','metadata','style','tspan'].includes(tag)) continue;
    if (['g','a'].includes(tag)) continue;
    const id = `${tag}-${items.length}`;
    if (!['text','rect','image'].includes(tag)) {
      warnings.push({ code: 'UNSUPPORTED_ELEMENT', element: id, detail: tag });
      continue;
    }
    try {
      const s = getComputedStyle(el), m = el.getScreenCTM();
      if (Math.abs(m.b) > 1e-7 || Math.abs(m.c) > 1e-7 || m.a <= 0 || m.d <= 0) effects.push('rotation-skew-or-reflection');
      if (s.stroke !== 'none') effects.push('stroke');
      if (tag === 'text' && el.querySelector('textPath')) effects.push('textPath');
      if (tag === 'text' && el.querySelector('tspan')) effects.push('tspan-styling');
      if (tag === 'rect' && (parseFloat(s.rx) > 0 || parseFloat(s.ry) > 0)) effects.push('rounded-rect');
      items.push({ id, tag, order: items.length, bounds: bounds(el), fill: s.fill,
        fillOpacity: Number(s.fillOpacity), fontSize: parseFloat(s.fontSize) || 0,
        text: tag === 'text' ? el.textContent.slice(0,2000) : '', unsupported: [...new Set(effects)] });
    } catch (error) { warnings.push({ code: 'UNMEASURABLE_ELEMENT', element: id, detail: String(error).slice(0,200) }); }
  }
  const serialized = root.outerHTML;
  if (serialized.length > 40_000_000) throw Error('SVG exceeds supported serialized size');
  if (!globalThis.crypto?.subtle) throw Error('Browser SHA-256 unavailable; do not use an unbound snapshot');
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(serialized));
  return { schema: 'svg-layout-probe/1', sourceDomSha256: [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2,'0')).join(''),
    viewport: { x: 0, y: 0, width: rect.width, height: rect.height }, items, warnings,
    coordinates: 'CSS pixels relative to the rendered SVG viewport; bounds include font metrics, not pixel segmentation.' };
}

export function reviewSvgLayout(snapshot, { normalTextContrast = 4.5 } = {}) {
  const need = (condition, message) => { if (!condition) throw Error(message); };
  need(snapshot?.schema === 'svg-layout-probe/1', 'Unsupported probe schema');
  need(/^[a-f0-9]{64}$/.test(snapshot.sourceDomSha256 ?? ''), 'Missing serialized DOM hash');
  need(Number.isFinite(normalTextContrast) && normalTextContrast >= 4.5 && normalTextContrast <= 21, 'Contrast floor cannot be below 4.5');
  const validBox = b => b && ['x','y','width','height'].every(k => Number.isFinite(b[k]) && Math.abs(b[k]) <= 100000) && b.width >= 0 && b.height >= 0;
  need(validBox(snapshot.viewport) && snapshot.viewport.width > 0 && snapshot.viewport.height > 0, 'Invalid viewport');
  need(Array.isArray(snapshot.items) && snapshot.items.length <= 1000 && Array.isArray(snapshot.warnings) && snapshot.warnings.length <= 1000, 'Bounded items and warnings required');
  const ids = new Set();
  for (const [index,item] of snapshot.items.entries()) {
    need(item && typeof item.id === 'string' && item.id.length <= 200 && !ids.has(item.id) && item.order === index, 'Invalid item identity or paint order'); ids.add(item.id);
    need(['text','rect','image'].includes(item.tag) && validBox(item.bounds), 'Invalid measured item');
    need(typeof item.fill === 'string' && item.fill.length <= 200 && Number.isFinite(item.fillOpacity) && item.fillOpacity >= 0 && item.fillOpacity <= 1, 'Invalid paint');
    need(typeof item.text === 'string' && item.text.length <= 2000 && Number.isFinite(item.fontSize) && item.fontSize >= 0, 'Invalid text metadata');
    need(Array.isArray(item.unsupported) && item.unsupported.length <= 20 && item.unsupported.every(x => typeof x === 'string' && x.length <= 100), 'Invalid unsupported effects');
  }
  need(snapshot.warnings.every(w => w && typeof w.code === 'string' && typeof w.element === 'string' && typeof w.detail === 'string' && w.code.length <= 100 && w.element.length <= 200 && w.detail.length <= 200), 'Invalid warning');
  const overlaps = (a,b) => Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x) > 0.05 && Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y) > 0.05;
  const contains = (a,b) => a.x <= b.x && a.y <= b.y && a.x+a.width >= b.x+b.width && a.y+a.height >= b.y+b.height;
  const rgb = value => {
    const m = /^rgba?\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*([\d.]+))?\s*\)$/.exec(value);
    return m && (m[4] === undefined || Number(m[4]) === 1) && m.slice(1,4).every(v => Number(v) >= 0 && Number(v) <= 255) ? m.slice(1,4).map(Number) : null;
  };
  const luminance = c => c.map(v => { const s=v/255; return s<=0.04045?s/12.92:((s+0.055)/1.055)**2.4; }).reduce((n,v,i)=>n+v*[0.2126,0.7152,0.0722][i],0);
  const findings = snapshot.warnings.map(w => ({ ...w, severity: 'unresolved' }));
  const add = (code, element, detail, extra={}) => findings.push({ code, element, detail, severity: 'unresolved', ...extra });
  for (const item of snapshot.items) {
    if (item.unsupported.length) add('UNSUPPORTED_PAINT_OR_TRANSFORM',item.id,item.unsupported.join(', '));
    if (item.tag === 'text' && !contains(snapshot.viewport,item.bounds)) add('TEXT_OUTSIDE_VIEWPORT',item.id,'Measured text bounds cross the SVG viewport.',{ bounds:item.bounds });
  }
  const textChecks = [];
  for (const text of snapshot.items.filter(x => x.tag === 'text' && x.text.trim())) {
    const before = snapshot.items.filter(x => x.order < text.order && overlaps(x.bounds,text.bounds));
    const panels = before.filter(x => x.tag === 'rect' && !x.unsupported.length && x.fillOpacity === 1 && rgb(x.fill) && contains(x.bounds,text.bounds));
    const panel = panels.at(-1);
    const exposed = before.filter(x => !panel || x.order > panel.order);
    const covering = snapshot.items.filter(x => x.order > text.order && overlaps(x.bounds,text.bounds));
    for (const other of covering) add(other.tag === 'text' ? 'TEXT_TEXT_INTERSECTION' : 'LATER_PAINT_INTERSECTION',text.id,'Later paint may cover the text; inspect the actual export.',{ other:other.id });
    for (const photo of exposed.filter(x => x.tag === 'image')) add('TEXT_IMAGE_INTERSECTION',text.id,'Text bounds intersect an image without an opaque rectangular panel covering the whole text. Palette contrast does not measure this region.',{ image:photo.id, textBounds:text.bounds, imageBounds:photo.bounds });
    let contrast = null;
    if (!snapshot.warnings.length && panel && !exposed.length && !covering.length && !text.unsupported.length && text.fillOpacity === 1 && rgb(text.fill)) {
      const a=luminance(rgb(text.fill)), b=luminance(rgb(panel.fill)); contrast=(Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
      if (contrast < normalTextContrast) add('LOW_SOLID_PANEL_CONTRAST',text.id,'Measured solid-fill colours fall below the conservative text contrast floor.',{ ratio:contrast, minimum:normalTextContrast });
    } else add('CONTRAST_UNRESOLVED',text.id,'No fully supported uniform background could be established. Inspect the actual pixels beneath every affected glyph.');
    textChecks.push({ element:text.id, text:text.text, bounds:text.bounds, solidPanel:panel?.id ?? null, contrastRatio:contrast });
  }
  if (!textChecks.length) add('NO_MEASURABLE_TEXT','svg','Raster or outlined text is not checked by this SVG text probe.');
  return { schema:'svg-layout-review/1', status:findings.length?'REVIEW_REQUIRED':'NO_GEOMETRY_FINDINGS', sourceDomSha256:snapshot.sourceDomSha256,
    viewport:snapshot.viewport, textChecks, findings,
    limitations:'Bounds are conservative geometry, not pixel segmentation. A no-findings result is not a visual pass. Unsupported content can obscure text. Image loading, export/source equivalence, product fidelity, font choice, phone-size readability, semantic variety, rights and platform overlays require separate checks. This snapshot and its hash are host observations, not authenticated proof.' };
}
