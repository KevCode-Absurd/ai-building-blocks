/** Display-only repair for already-sanitized skill HTML. Never apply this to copied/exported source. */
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const decodeAttribute = value => value.replace(/&(?:amp|quot|apos|lt|gt|#39|#\d+|#x[\da-f]+);/gi, entity => {
  const names = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>', '&#39;': "'" };
  if (names[entity.toLowerCase()]) return names[entity.toLowerCase()];
  const hex = /^&#x/i.test(entity), n = Number.parseInt(entity.slice(hex ? 3 : 2, -1), hex ? 16 : 10);
  return Number.isFinite(n) && n > 0 && n <= 0x10ffff ? String.fromCodePoint(n) : '\ufffd';
});
const attr = (tag, name) => {
  const attributes = /([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  for (const match of tag.matchAll(attributes)) {
    if (match[1].toLowerCase() === name.toLowerCase() && (match[2] ?? match[3] ?? match[4]) !== undefined) {
      return { value: match[2] ?? match[3] ?? match[4], start: match.index, length: match[0].length };
    }
  }
  return null;
};
// These are literal source/example destinations, not routes on AI Blocks.
const SOURCE_EXAMPLE_PATHS = new Set(['/features/analytics', '/docs/projects/create', '/docs/webhooks', '/skills/']);
const isRelativeFile = value => value && !/^(?:[a-z][a-z\d+.-]*:|[/?#])/i.test(value.trim());

/** Reject traversal instead of guessing how the original repository was laid out. */
function safePath(value) {
  let path = value;
  try {
    for (let i = 0; i < 4; i++) { const next = decodeURIComponent(path); if (next === path) break; path = next; }
  } catch { return null; }
  if (/[\\\x00-\x1f\x7f?#]/.test(path) || path.startsWith('/') || /^[a-z][a-z\d+.-]*:/i.test(path)) return null;
  const parts = path.split('/');
  if (parts.some(p => p === '..' || p === '' || p === '.')) {
    // A leading ./ is harmless; interior dot segments and parent references are not accepted.
    while (parts[0] === '.') parts.shift();
    if (!parts.length || parts.some(p => p === '..' || p === '' || p === '.')) return null;
  }
  return parts.join('/');
}

/**
 * Resolve only exact included paths against /skills/<slug>/.
 * Unknown source links become labelled text; unknown local images become labelled references.
 * External URLs and actual site routes, queries and anchors remain unchanged.
 * The four explicit non-site source/example root paths become labelled references.
 * @param {string} html Already-sanitized rendered skill HTML.
 * @param {string} slug Canonical catalogue slug.
 * @param {string[]} files Exact included relative filenames from Page.files.
 */
export function normalizeSkillHtml(html, slug, files = []) {
  const known = new Set(['SKILL.md', ...files].filter(file => typeof file === 'string').map(safePath).filter(Boolean));
  const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
  const resolve = raw => {
    const value = decodeAttribute(raw);
    let sourcePath = value.split(/[?#]/, 1)[0];
    if (/^https?:\/\//i.test(value)) {
      try { const url = new URL(value); if (url.origin === 'https://useaiblocks.com') sourcePath = url.pathname; } catch { /* leave malformed absolute references untouched */ }
    }
    if (SOURCE_EXAMPLE_PATHS.has(sourcePath)) return { relative: true, url: null };
    if (!isRelativeFile(value)) return { relative: false, url: null };
    const split = value.search(/[?#]/), pathname = split < 0 ? value : value.slice(0, split);
    const path = safePath(pathname);
    if (!validSlug || !path || !known.has(path)) return { relative: true, url: null };
    const suffix = split < 0 ? '' : value.slice(split);
    return { relative: true, url: `/skills/${slug}/${path.split('/').map(encodeURIComponent).join('/')}${suffix}` };
  };
  let display = String(html).replace(/<a\b((?:[^"'<>]|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/a\s*>/gi, (original, attrs, body) => {
    const href = attr(attrs, 'href');
    if (!href) return original;
    const result = resolve(href.value);
    if (!result.relative) return original;
    if (result.url) return `<a${attrs.slice(0, href.start)}href="${escapeHtml(result.url)}"${attrs.slice(href.start + href.length)}>${body}</a>`;
    return `<span class="skill-source-reference">${body} <span class="small">(source reference: <code>${escapeHtml(decodeAttribute(href.value))}</code>)</span></span>`;
  });
  display = display.replace(/<img\b((?:[^"'<>]|"[^"]*"|'[^']*')*)\/?\s*>/gi, (original, attrs) => {
    const src = attr(attrs, 'src');
    if (!src) return original;
    const result = resolve(src.value);
    if (!result.relative) return original;
    if (result.url) return `<img${attrs.slice(0, src.start)}src="${escapeHtml(result.url)}"${attrs.slice(src.start + src.length)}>`;
    const alt = attr(attrs, 'alt');
    return `<span class="skill-source-reference">${alt?.value ? `${escapeHtml(decodeAttribute(alt.value))} — ` : ''}Image source reference: <code>${escapeHtml(decodeAttribute(src.value))}</code></span>`;
  });
  return display;
}
