// Catalogue-wide keyword test set, derived mechanically from each item's own name (no hand labels).
// For every item: its core topic words (name minus role and filler words), a typo of that query, and a synonym
// variant from a small generic list (or, when no name word has a synonym, a summary query: the item's most telling
// name word with a topical summary word its name lacks, e.g. "conversion purchases").
// An item counts as found when it, or an item whose name has the same topic words, is in the top results.
// Used by scripts/evaluate-recommendations.mjs (--only keywords) and test/recommendation-gate.test.mjs.

// What kind of tool an item is, not what it is about. People often leave these out of a search.
const ROLE = new Set(['writer', 'planner', 'checker', 'builder', 'maker', 'reviewer', 'finder', 'analyst', 'guide', 'helper', 'creator', 'designer',
  'drafter', 'editor', 'generator', 'agent', 'tracker', 'auditor', 'scorer', 'picker', 'keeper', 'mapper', 'sorter', 'tester', 'setter', 'runner',
  'reader', 'explainer', 'spotter', 'ranker', 'chooser', 'comparer', 'coach', 'assistant', 'tool', 'workflow', 'prompt', 'skill', 'specialist',
  'strategist', 'investigator', 'reporter', 'researcher', 'modeler', 'modeller', 'architect', 'engineer', 'developer', 'manager', 'coordinator',
  'organizer', 'organiser', 'collector', 'updater', 'converter', 'rewriter', 'optimizer', 'optimiser', 'advisor', 'adviser', 'analyzer', 'analyser',
  'tutor', 'trainer', 'cleaner', 'fixer', 'diagnoser', 'estimator', 'screener', 'simulator', 'translator', 'reconciler', 'splitter', 'tuner', 'desk']);
const FILLER = new Set(['a', 'an', 'and', 'the', 'for', 'to', 'of', 'with', 'in', 'on', 'from', 'by', 'your', 'you', 'my', 'it', 'its', 'that', 'then',
  'into', 'or', 'as', 'at', 'is', 'be', 'can', 'get', 'make', 'one', 'what', 'how', 'before', 'after', 'up']);

/** A small generic list of words people use interchangeably (business and tool words). Both directions. */
export const KEYWORD_SYNONYMS = [
  ['facebook', 'meta'], ['rejected', 'disapproved'], ['email', 'newsletter'], ['customer', 'client'], ['customers', 'clients'], ['store', 'shop'],
  ['buyer', 'customer'], ['buyers', 'customers'], ['resume', 'cv'], ['photo', 'picture'], ['photos', 'pictures'], ['image', 'picture'],
  ['video', 'clip'], ['analysis', 'analytics'], ['audit', 'review'], ['spreadsheet', 'excel'], ['slides', 'powerpoint'], ['deck', 'slides'],
  ['invoice', 'bill'], ['refund', 'return'], ['returns', 'refunds'], ['bookkeeping', 'accounting'], ['hiring', 'recruiting'], ['employee', 'staff'],
  ['competitor', 'rival'], ['competitors', 'rivals'], ['website', 'site'], ['sales', 'revenue'], ['price', 'pricing'], ['ad', 'advert'],
  ['ads', 'adverts'], ['compliance', 'policy'], ['churn', 'cancellations'], ['onboarding', 'induction'], ['meeting', 'call'], ['forecast', 'projection'],
  ['budget', 'spending'], ['checkout', 'cart'], ['inventory', 'stock'], ['supplier', 'vendor'], ['suppliers', 'vendors'], ['contract', 'agreement'],
  ['bug', 'error'], ['bugs', 'errors'], ['podcast', 'audio'], ['logo', 'brand mark'], ['seo', 'search ranking'],
  ['retention', 'repeat customers'], ['loyalty', 'rewards'], ['survey', 'questionnaire'], ['interview', 'screening'], ['salary', 'pay'],
  ['startup', 'new business'], ['landing', 'sales'], ['copy', 'copywriting'], ['headline', 'title'], ['caption', 'post text'],
];
const SYNONYM = new Map();
for (const [a, b] of KEYWORD_SYNONYMS) { if (!SYNONYM.has(a)) SYNONYM.set(a, b); if (!SYNONYM.has(b)) SYNONYM.set(b, a); }

const words = text => (String(text ?? '').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[’']/g, '').match(/[\p{L}\p{N}]+/gu) ?? []);
/** Core topic words of a name: what the item is about. */
export const coreWords = name => { const all = words(name).filter(w => !FILLER.has(w)), core = all.filter(w => !ROLE.has(w)); return core.length ? core : all; };
/** Summary words that could be a search word: no filler, role or numbers, at least four letters. */
const SUMMARY_FILLER = new Set(['give', 'share', 'paste', 'tell', 'list', 'plan', 'with', 'from', 'into', 'that', 'this', 'what', 'which', 'when', 'your', 'them', 'they',
  'their', 'then', 'each', 'every', 'more', 'most', 'less', 'only', 'also', 'just', 'over', 'have', 'will', 'gets', 'make', 'shows', 'show', 'turn', 'find', 'write',
  'check', 'clear', 'short', 'first', 'next', 'before', 'after', 'about', 'where', 'while', 'than', 'were', 'been', 'being', 'some', 'many', 'much', 'very', 'ready', 'real',
  'three', 'four', 'five', 'plus', 'stop', 'line', 'lines', 'part', 'parts', 'kind', 'type', 'need', 'needs', 'want', 'keep', 'used', 'using', 'work', 'works', 'other', 'same', 'both', 'like', 'good', 'well', 'still', 'take', 'goes', 'come', 'know', 'says', 'said']);
const summaryWords = text => [...new Set(words(text).filter(w => w.length >= 4 && !/\d/.test(w) && !FILLER.has(w) && !ROLE.has(w) && !SUMMARY_FILLER.has(w)))];
const singular = w => w.length > 4 && w.endsWith('ies') ? w.slice(0, -3) + 'y' : w.length > 3 && /[^s]s$/.test(w) ? w.slice(0, -1) : w;
/** Items with the same topic words in their names answer the same keyword search equally well. */
export const topicKey = name => [...new Set(coreWords(name).map(singular))].sort().join(' ');

const hash = text => { let h = 2166136261; for (const c of text) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0; return h; };
/** One deterministic keyboard slip in the longest word (never the first letter): a dropped, doubled or swapped letter. */
export function typo(query, seed) {
  const list = query.split(' '), at = list.reduce((best, w, i) => w.length > list[best].length ? i : best, 0), w = list[at];
  if (w.length < 5 || /\d/.test(w)) return null;
  const h = hash(seed), i = 1 + (h % (w.length - 2)), kind = (h >>> 8) % 3;
  list[at] = kind === 0 ? w.slice(0, i) + w.slice(i + 1) : kind === 1 ? w.slice(0, i) + w[i] + w.slice(i) : w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2);
  return list[at] === w ? null : list.join(' ');
}

/** Up to three keyword queries per item: { slug, type, kind: 'core' | 'typo' | 'synonym' | 'summary', q }. */
export function keywordQueries(blocks) {
  // Rarer name words say more about an item; long names keep their three most telling words, in order.
  const df = new Map();
  for (const b of blocks) for (const w of new Set([...coreWords(b.name), ...summaryWords(b.summary)])) df.set(w, (df.get(w) ?? 0) + 1);
  const rarest = list => [...list].sort((x, y) => (df.get(x) ?? 0) - (df.get(y) ?? 0) || (x < y ? -1 : 1))[0];
  const out = [];
  for (const b of blocks) {
    if (!b.name) continue;
    let core = coreWords(b.name);
    if (core.length > 3) { const keep = new Set([...core].sort((x, y) => (df.get(x) ?? 0) - (df.get(y) ?? 0)).slice(0, 3)); core = core.filter(w => keep.has(w)).slice(0, 3); }
    const q = core.join(' '), type = b.type ?? 'skill';
    out.push({ slug: b.slug, type, kind: 'core', q });
    const slip = typo(q, b.slug);
    if (slip) out.push({ slug: b.slug, type, kind: 'typo', q: slip });
    const swap = core.findIndex(w => SYNONYM.has(w));
    if (swap >= 0) out.push({ slug: b.slug, type, kind: 'synonym', q: core.map((w, i) => i === swap ? SYNONYM.get(w) : w).join(' ') });
    else {
      // A topical summary word: used across the catalogue (not an odd word), but not everywhere.
      const named = new Set(coreWords(b.name).map(singular)), extra = summaryWords(b.summary).filter(w => !named.has(singular(w)) && (df.get(w) ?? 0) >= 5 && (df.get(w) ?? 0) <= 150);
      const anchor = rarest(core.filter(w => w.length >= 3)), topical = [...extra].sort((x, y) => (df.get(y) ?? 0) - (df.get(x) ?? 0) || (x < y ? -1 : 1))[0];
      if (anchor && topical) out.push({ slug: b.slug, type, kind: 'summary', q: anchor + ' ' + topical });
    }
  }
  return out;
}

/** hit@1 / hit@5 for a ranked search function (query → slugs, best first). */
export function scoreKeywords(blocks, queries, search) {
  const key = new Map(blocks.map(b => [b.slug, topicKey(b.name)]));
  const agg = () => ({ n: 0, hit1: 0, hit5: 0 });
  const all = agg(), byType = {}, byKind = {}, misses = [], notFirst = [];
  for (const item of queries) {
    const top = search(item.q).slice(0, 5), want = key.get(item.slug);
    const found = top.findIndex(slug => slug === item.slug || key.get(slug) === want);
    for (const a of [all, byType[item.type] ??= agg(), byKind[item.kind] ??= agg()]) { a.n++; a.hit1 += found === 0; a.hit5 += found >= 0; }
    if (found < 0) misses.push({ ...item, top: top.slice(0, 3) });
    else if (found > 0) notFirst.push({ ...item, rank: found + 1, top: top.slice(0, found) });
  }
  const fin = a => ({ n: a.n, hit1: Number((a.hit1 / Math.max(1, a.n)).toFixed(3)), hit5: Number((a.hit5 / Math.max(1, a.n)).toFixed(3)) });
  return { ...fin(all), byType: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, fin(v)])), byKind: Object.fromEntries(Object.entries(byKind).map(([k, v]) => [k, fin(v)])), misses, notFirst };
}
