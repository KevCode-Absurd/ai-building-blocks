// A small JSON Schema checker for the outcome tools' input schemas. It reports every problem at once, each with the
// field path and, where it can tell, the value that was probably meant. Covers the keywords our schemas use:
// type, enum, const, pattern, minLength, maxLength, minimum, maximum, minItems, maxItems, properties, required,
// additionalProperties (false), items, oneOf (picked by a const discriminator) and anyOf.

/** Edit distance, capped: returns cap + 1 once the distance is known to exceed cap. */
function distance(a, b, cap = 6) {
  if (Math.abs(a.length - b.length) > cap) return cap + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (row[j] < best) best = row[j];
    }
    if (best > cap) return cap + 1;
    prev = row;
  }
  return prev[b.length];
}

/**
 * The candidate that was most likely meant, or null when nothing is close. Ids are compared as whole strings and as
 * hyphen-separated words, so "seo-specalist" finds "seo-specialist" and "ads-meta" finds "meta-ads".
 */
export function nearest(target, candidates) {
  if (typeof target !== 'string' || !target) return null;
  const t = target.toLowerCase(), words = new Set(t.split(/[-_\s]+/).filter(Boolean));
  let best = null, bestScore = 0;
  for (const c of candidates) {
    if (typeof c !== 'string' || c === target) continue;
    const l = c.toLowerCase(), longest = Math.max(t.length, l.length);
    // Allow about one typo in three characters (at least two), so short ids still match a slip.
    const limit = Math.max(2, Math.floor(longest / 3)), d = distance(t, l, limit);
    const close = d <= limit ? 1 - d / longest : 0;
    const cw = l.split(/[-_\s]+/).filter(Boolean);
    const shared = cw.filter(w => words.has(w)).length;
    const overlap = shared ? (2 * shared) / (cw.length + words.size) : 0;
    const score = Math.max(close, overlap * 0.9);
    if (score > bestScore) { best = c; bestScore = score; }
  }
  return bestScore >= 0.5 ? best : null;
}

// Plain words for the patterns our schemas use.
const HINTS = {
  '^[a-z0-9][a-z0-9-]{0,79}$': 'must be a lowercase id: letters, digits and hyphens, up to 80 characters.',
  '^[a-z0-9][a-z0-9-]{0,119}$': 'must be a catalogue id from search_library.',
  '^\\d{4}-\\d{2}-\\d{2}$': 'must be a date: YYYY-MM-DD.',
  '^\\d{4}-\\d{2}(-\\d{2})?$': 'must be YYYY-MM or YYYY-MM-DD.',
  '^[a-f0-9]{64}$': 'must be the 64-character lowercase SHA-256 from the last result.',
};
const kind = v => v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v;
const fits = (type, v) => type === kind(v) || (type === 'number' && typeof v === 'number' && Number.isFinite(v));
const show = v => JSON.stringify(v)?.slice(0, 60) ?? String(v);
const key = (path, k) => /^[a-z_][a-z0-9_]*$/i.test(k) ? (path ? `${path}.${k}` : k) : `${path}[${JSON.stringify(k)}]`;

/** The const value each oneOf branch requires for one shared property (such as type or action), if there is one. */
function discriminator(branches) {
  const first = branches[0]?.properties;
  if (!first) return null;
  for (const [prop, spec] of Object.entries(first)) {
    if (spec?.const === undefined) continue;
    if (branches.every(b => b.properties?.[prop]?.const !== undefined)) return prop;
  }
  return null;
}

/**
 * Check value against schema. Returns a list of { path, message, suggestion? }; an empty list means it fits.
 * At most limit problems are collected so a wholly wrong payload still gives a readable answer.
 */
export function checkSchema(schema, value, path = '', limit = 40) {
  const issues = [];
  const add = (p, message, suggestion) => { if (issues.length < limit) issues.push({ path: p || '(arguments)', message, ...(suggestion !== undefined && suggestion !== null ? { suggestion } : {}) }); };
  const walk = (s, v, p) => {
    if (!s || issues.length >= limit) return;
    if (s.oneOf) {
      const prop = discriminator(s.oneOf);
      if (prop && v && typeof v === 'object' && !Array.isArray(v)) {
        const allowed = s.oneOf.map(b => b.properties[prop].const);
        const branch = s.oneOf.find(b => b.properties[prop].const === v[prop]);
        if (!branch) { add(key(p, prop), v[prop] === undefined ? `is required: one of ${allowed.join(', ')}.` : `must be one of ${allowed.join(', ')}.`, nearest(String(v[prop] ?? ''), allowed)); return; }
        walk(branch, v, p); return;
      }
      const results = s.oneOf.map(b => checkSchema(b, v, p, limit));
      const best = results.reduce((a, b) => b.length < a.length ? b : a);
      if (best.length) best.forEach(i => add(i.path, i.message, i.suggestion));
      return;
    }
    if (s.anyOf) {
      const results = s.anyOf.map(b => checkSchema(b, v, p, limit));
      if (results.some(r => !r.length)) return;
      const types = s.anyOf.map(b => b.type).filter(Boolean);
      if (types.length === s.anyOf.length) add(p, `must be ${types.flat().join(' or ')}.`);
      else results.reduce((a, b) => b.length < a.length ? b : a).forEach(i => add(i.path, i.message, i.suggestion));
      return;
    }
    if (s.type) {
      const types = [s.type].flat();
      if (!types.some(t => fits(t, v))) { add(p, `must be ${types.map(t => t === 'array' ? 'a list' : t === 'object' ? 'an object' : t === 'string' ? 'text' : t).join(' or ')}, not ${v === undefined ? 'missing' : kind(v) === 'array' ? 'a list' : kind(v)}.`); return; }
    }
    if (s.const !== undefined && v !== s.const) { add(p, `must be ${show(s.const)}.`); return; }
    if (s.enum && !s.enum.includes(v)) { add(p, `must be one of ${s.enum.map(show).join(', ')}.`, typeof v === 'string' ? nearest(v, s.enum.filter(x => typeof x === 'string')) : null); return; }
    if (typeof v === 'string') {
      if (s.minLength !== undefined && v.trim().length < s.minLength) add(p, 'must not be empty.');
      else if (s.maxLength !== undefined && v.length > s.maxLength) add(p, `must be at most ${s.maxLength} characters (it has ${v.length}).`);
      else if (s.pattern && !new RegExp(s.pattern).test(v)) add(p, HINTS[s.pattern] ?? `must match ${s.pattern}.`);
    }
    if (typeof v === 'number') {
      if (s.minimum !== undefined && v < s.minimum) add(p, `must be at least ${s.minimum}.`);
      if (s.maximum !== undefined && v > s.maximum) add(p, `must be at most ${s.maximum}.`);
    }
    if (Array.isArray(v)) {
      if (s.minItems !== undefined && v.length < s.minItems) add(p, `needs at least ${s.minItems} ${s.minItems === 1 ? 'entry' : 'entries'}.`);
      if (s.maxItems !== undefined && v.length > s.maxItems) add(p, `may have at most ${s.maxItems} entries (it has ${v.length}).`);
      if (s.items) v.forEach((x, i) => walk(s.items, x, `${p}[${i}]`));
    }
    if (v && typeof v === 'object' && !Array.isArray(v) && (s.properties || s.required)) {
      const props = s.properties ?? {};
      const count = Object.keys(v).length;
      if (s.minProperties !== undefined && count < s.minProperties) add(p, `needs ${s.maxProperties === 1 ? 'one' : `at least ${s.minProperties}`} of: ${Object.keys(props).join(', ')}.`);
      if (s.maxProperties !== undefined && count > s.maxProperties) add(p, `takes ${s.maxProperties === 1 ? 'only one' : `at most ${s.maxProperties}`} of: ${Object.keys(props).join(', ')}.`);
      for (const r of s.required ?? []) if (!Object.hasOwn(v, r) || v[r] === undefined) add(key(p, r), 'is required.');
      for (const [k, x] of Object.entries(v)) {
        if (Object.hasOwn(props, k)) walk(props[k], x, key(p, k));
        else if (s.additionalProperties === false) add(key(p, k), `is not a field here. Allowed: ${Object.keys(props).join(', ')}.`, nearest(k, Object.keys(props)));
      }
    }
  };
  walk(schema, value, path);
  return issues;
}

/** One line per problem, for the text of a tool error. */
export function issueLines(issues) {
  return issues.map(i => `- ${i.path}: ${i.message}${i.suggestion ? ` Did you mean "${i.suggestion}"?` : ''}`).join('\n');
}
