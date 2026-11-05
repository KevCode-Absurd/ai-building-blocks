import { createHash } from 'node:crypto';
import { withoutPageShell } from './page-shell.mjs';

export const CONTENT_SCHEMA = 'abb-content-fingerprints/1';
export const sha256 = value => createHash('sha256').update(value).digest('hex');
export const stableJson = value => JSON.stringify(sort(value));
function sort(value) {
  if (Array.isArray(value)) return value.map(sort);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, sort(value[key])]));
}
function withoutModifiedDates(value) {
  if (Array.isArray(value)) return value.map(withoutModifiedDates);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value).filter(([key]) => key !== 'dateModified').map(([key, entry]) => [key, withoutModifiedDates(entry)]));
}

// The site-wide menu and footer that scripts/prerender.mjs puts on every page. A new menu link is not new content on
// 6,700 pages: counting it marked every page as updated on each deploy, and search engines stop trusting such dates.
export const SITE_CHROME = /<header\b[^>]*\bdata-prerendered-nav\b[^>]*>[\s\S]*?<\/header\s*>|<footer class="wrap small">[\s\S]*?<\/footer\s*>/gi;

/** Content, not a new asset filename, stylesheet, loader script, the loading cover's picture of the page, the
 *  site-wide menu and footer, or the stamp itself. */
export function canonicalHtml(html) {
  return withoutPageShell(html).replace(SITE_CHROME, '').replace(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi, (_all, attributes, body) =>
    /\btype\s*=\s*["']application\/ld\+json["']/i.test(attributes)
      ? `<script type="application/ld+json">${stableJson(withoutModifiedDates(JSON.parse(body)))}</script>` : '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, '')
    .replace(/<link\b[^>]*\brel\s*=\s*["'](?:stylesheet|modulepreload|preload)["'][^>]*>/gi, '')
    .replace(/<!--(?!\s*\[if)[\s\S]*?-->/g, '')
    .replace(/\snonce\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\r\n?/g, '\n').trim();
}

export function contentFingerprint(html, resourceRevision = '', extra = null) {
  return sha256(stableJson({ html: canonicalHtml(html), resourceRevision, extra }));
}

/** Strict calendar and timezone validation, accepting dates or real ISO timestamps. */
export function validLastmod(value, now = Date.now()) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value)) return false;
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  const calendar = new Date(0); calendar.setUTCHours(0, 0, 0, 0); calendar.setUTCFullYear(year, month - 1, day);
  if (calendar.getUTCFullYear() !== year || calendar.getUTCMonth() !== month - 1 || calendar.getUTCDate() !== day) return false;
  if (value.length > 10 && (Number(value.slice(11, 13)) > 23 || Number(value.slice(14, 16)) > 59 || Number(value.slice(17, 19)) > 59 || (value.at(-1) !== 'Z' && (Number(value.slice(-5, -3)) > 23 || Number(value.slice(-2)) > 59)))) return false;
  const time = Date.parse(value);
  return Number.isFinite(time) && time <= now;
}

export function selectLastmod({ hash, previousHash, previousDate = '', sourceTime = '' }, now = Date.now()) {
  if (hash === previousHash) return previousDate;
  // A committed source revision is a stable, verifiable version time. Never use build time.
  return validLastmod(sourceTime, now) ? new Date(sourceTime).toISOString() : '';
}

/** The WebPage stamp concerns this published page; the source work retains its own dates. */
export function stampHtmlDate(html, value) {
  return html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi, (all, attributes, body) => {
    if (!/\btype\s*=\s*["']application\/ld\+json["']/i.test(attributes)) return all;
    const data = JSON.parse(body), graph = data['@graph'] ?? (Array.isArray(data) ? data : [data]);
    let found = false;
    for (const node of graph) if (['WebPage', 'CollectionPage'].includes(node?.['@type'])) {
      if (value) node.dateModified = value; else delete node.dateModified;
      found = true;
    }
    return found ? `<script${attributes}>${JSON.stringify(data)}</script>` : all;
  });
}

export function newestLastmod(values) {
  return values.filter(Boolean).reduce((latest, value) => !latest || Date.parse(value) > Date.parse(latest) ? value : latest, '');
}
