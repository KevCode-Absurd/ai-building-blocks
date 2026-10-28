import { createRequire } from 'node:module';
const YAML = createRequire(new URL('../../site/package.json', import.meta.url))('yaml');
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const endings = text => [...text.matchAll(/([^\r\n]*)(\r\n|\n|\r|$)/g)].filter(match => match[0]).map(match => ({ text: match[1], end: match[2] }));
export function checkEndings(before, after) {
  const old = endings(before), next = endings(after), styles = new Set(old.map(line => line.end).filter(Boolean));
  if (!styles.size) return [];
  if (styles.size === 1) return next.some(line => line.end && !styles.has(line.end)) ? ['Line endings differ from HEAD'] : [];
  // Preserve unchanged unique lines in an already mixed file; never normalize it wholesale.
  const unique = rows => { const map = new Map(); for (const row of rows) map.set(row.text, map.has(row.text) ? null : row.end); return map; };
  const oldLines = unique(old), newLines = unique(next);
  for (const [text, end] of oldLines) if (end !== null && newLines.has(text) && newLines.get(text) !== null && newLines.get(text) !== end) return ['An unchanged line in a mixed-ending file changed its ending'];
  if (old.length === next.length && old.some((line, i) => line.end !== next[i].end)) return ['Mixed line-ending pattern differs from HEAD'];
  return [];
}
function parse(text, label, failures) {
  const document = YAML.parseDocument(text, { uniqueKeys: true, strict: true, logLevel: 'silent' });
  if (document.errors.length) {
    const error = document.errors[0], line = text.slice(0, error.pos?.[0] ?? 0).split('\n').length;
    failures.push(`${label}: ${error.code ?? 'invalid YAML'} at line ${line}`); return null;
  }
  try { return document.toJS({ maxAliasCount: 100 }); }
  catch { failures.push(`${label}: unsafe or excessive YAML aliases`); return null; }
}
export function checkTextChange({ file, before, after }) {
  const failures = [];
  if (/(^|\/)(tests|runs)\//.test(file)) return ['Protected test/run evidence must stay unchanged'];
  if (before && /(?:^|\/)LICENSE(?:[.-][^/]*)?$/i.test(file)) return ['Keep the original licence file unchanged'];
  if (!after) return failures;
  if (after.includes(0) || before?.includes(0) || /\.(?:png|jpe?g|gif|webp|pdf|zip|xlsx|woff2?|ico)$/i.test(file)) return failures;
  const text = after.toString('utf8'), old = before?.toString('utf8');
  if (old !== undefined) failures.push(...checkEndings(old, text));
  let data, front = false;
  if (/\.ya?ml$/i.test(file)) data = parse(text, 'YAML', failures);
  else if (/\.md$/i.test(file) && /^\uFEFF?---\r?\n/.test(text)) {
    const match = text.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
    if (!match) failures.push('Front matter has no closing delimiter');
    else { data = parse(match[1], 'Front matter', failures); front = true; }
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return failures;
  const strings = front ? ['name', 'description'] : /\/(?:item|page)\.yaml$/.test(file) ? ['name', 'headline', 'summary', 'description'] : /catalogue-items\/ai-tools\//.test(file) ? ['name', 'promise'] : [];
  for (const field of strings) if (field in data && typeof data[field] !== 'string') failures.push(`${field}: expected text; quote a value containing ': '`);
  if (/\/(?:page\.yaml|ai-tools\/[^/]+\.ya?ml)$/.test(file)) for (const field of ['when', 'not_for', 'benefits', 'what_it_does']) {
    if (Array.isArray(data[field]) && data[field].some(value => typeof value !== 'string')) failures.push(`${field}: expected text bullets; quote a bullet containing ': '`);
  }
  if (/\/item\.yaml$/.test(file)) {
    for (const field of ['inputs', 'outputs']) if (field in data && (!Array.isArray(data[field]) || data[field].some(port => typeof port !== 'string' && (!port || typeof port.type !== 'string' || (port.required !== undefined && typeof port.required !== 'boolean'))))) failures.push(`${field}: invalid type or required flag`);
    if (old !== undefined) {
      const previous = parse(old, 'HEAD YAML', failures);
      if (previous && !equal(previous.tested, data.tested)) failures.push('The tested block must stay unchanged');
    }
    if (data.credits !== undefined && !Array.isArray(data.credits)) failures.push('credits: expected a list');
    else for (const credit of data.credits ?? []) if (credit?.used !== undefined && typeof credit.used !== 'string') failures.push("credits.used: quote text containing ': '");
  }
  return failures;
}
