/** Public catalogue search only. Shared by the deterministic index builder and browser. */
import { geoAnswerAlias, searchIntents } from "./library-search-intents.ts";
import { WORD_ALIASES } from "./library-search-language.ts";
export type SearchField = "title" | "summary" | "intro" | "body" | "metadata";
/** `strong`: every subject word is in the item's name or summary, or the item's stated purpose matches the request.
 *  Callers count these to say "N strong matches" instead of every passing mention. */
export type SearchHit = { score: number; field: SearchField; reason?: string; literal?: number; strong?: boolean };
export type SearchDocument = { slug: string; title: string; kind?: string; summary?: string; intro?: string; body?: string; metadata?: string; purpose?: Partial<Record<SearchField, string[]>>; excludeIntents?: string[] };
export type LibrarySearchIndex = { version: 1; sourceHash: string; corpusHash?: string; engineHash?: string; docs: string[]; terms: string[]; postings: string[]; shards?: { size: number; files: { file: string; sha256: string; terms: number }[] } };
const FIELDS = ["title", "summary", "intro", "body", "metadata"] as const;
const WEIGHTS = [1000, 100, 10, 1, 3];
const STOP = new Set(["a", "an", "and", "the", "for", "to", "of", "with", "in", "on", "is", "it", "how", "your", "my", "i", "want", "need", "help", "me", "please", "can", "could", "would", "like", "get", "make", "do", "does", "about", "some", "this", "that", "our", "we", "us", "you", "am", "be", "being", "someone", "something"]);
for (const filler of ["what", "which", "why", "where", "when", "should", "using", "into", "from", "so", "but", "these", "those", "there", "their", "been", "have", "has", "had", "who", "know", "see"]) STOP.add(filler);
for (const filler of ["best", "recommend", "recommendation", "recommendations", "suggest", "suggestions", "looking", "searching"]) STOP.add(filler);
for (const filler of ["no", "not", "will", "after", "are", "was", "were", "did", "got", "gets", "getting", "arent", "isnt", "dont", "doesnt", "didnt", "hasnt", "havent", "wont", "cant", "anymore", "really", "just", "very", "also", "any", "way", "ways", "thing", "things", "stuff"]) STOP.add(filler);
export function searchTokens(text: string, preserveConceptWords = false): string[] {
  // "No-shows" is one thing, not "no" and "shows"; so is an "about us" page. "T&Cs" are terms and conditions.
  const original = text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/\bno[\s_-]?shows?\b/g, " noshow ").replace(/\bt ?& ?cs?\b/g, " terms conditions ").replace(/\babout us\b/g, " aboutus ").replace(/[_-]/g, " ");
  const normalized = (geoAnswerAlias(original, preserveConceptWords) ? original.replace(/\bgeo\b/g, " aeo ") : original)
    .replace(/\b(?:answer\s*engine\s*optimi[sz]ation|generative\s*engine\s*optimi[sz]ation|ai\s*search|aeo)\b/g, " aeo ")
    .replace(/\b(?:search\s*engine\s*optimi[sz]ation|seo)\b/g, " seo ")
    .replace(/\b(?:agentic|agents)\b/g, " agent ");
  const inflections = normalized.replace(/\bcopywrit(?:ing|ers?|es|e)\b/g, ' copy write ').replace(/\b(?:writing|writers?|writes)\b/g, ' write ').replace(/\b(?:investing|investments?|investors?)\b/g, ' invest ').replace(/\b(?:budgeting|budgets)\b/g, ' budget ').replace(/\b(?:financial|financing)\b/g, ' finance ').replace(/\b(?:designing|designers?)\b/g, ' design ').replace(/\b(?:planning|planners?)\b/g, ' plan ').replace(/\b(?:pricing|priced)\b/g, ' price ')
    // One spelling for -ise/-ize words (analyse, summarise, organise) and one form of "ads".
    .replace(/\b(\w{3,}?)([iy])z(e|es|ed|er|ers|ing|ation|ations)\b/g, "$1$2s$3").replace(/\bads\b/g, " ad ");
  return [...new Set(((preserveConceptWords ? original + " " + inflections : inflections).match(/[\p{L}\p{N}]+/gu) ?? []).filter(token => !STOP.has(token)).map(token => token === "ads" ? "ad" : token.length > 4 && token.endsWith("ies") ? token.slice(0, -3) + "y" : token.length > 3 && /[^s]s$/.test(token) ? token.slice(0, -1) : token).filter(token => !STOP.has(token)))];
}

/** A query's words: required subject words, optional "how" words, and catalogue words that can stand in for a typed word. */
/** `phrase` groups the typed words of one multi-word phrase a rule rewrote ("ask for a raise"): one catalogue word
 *  can stand in for the whole phrase. */
type QueryWords = { hard: string[]; soft: string[]; alternatives: Record<string, string[]>; sequence: string[]; phrase: Record<string, number> };
const recentQueries = new Map<string, QueryWords>();
export function queryTokens(query: string): QueryWords {
  const text = query.slice(0, 300), known = recentQueries.get(text);
  if (known) return known;
  // Contractions are one word ("don't" is "dont").
  const lower = text.toLowerCase().replace(/[’']/g, "'").replace(/n't\b/g, "nt").replace(/'(?:s|m|re|ve|ll|d)\b/g, "");
  const all = searchTokens(lower);
  const alternatives: Record<string, string[]> = {};
  const add = (token: string, words: string[]) => { const extra = words.filter(t => t !== token); if (extra.length) alternatives[token] = [...new Set([...(alternatives[token] ?? []), ...extra])]; };
  const phrase: Record<string, number> = {};
  let phrases = 0;
  for (const [pattern, instead] of aliasRules()) for (const match of lower.matchAll(pattern)) {
    const tokens = searchTokens(match[0]);
    for (const token of tokens) { add(token, instead); if (tokens.length > 1) phrase[token] ??= phrases; }
    phrases++;
  }
  // "Reviews" and "ratings" are what customers leave, so they are the subject; "review" alone is a "how" word.
  const leftByCustomers = /\b(?:reviews|ratings)\b/.test(lower);
  let hard = all.filter(token => !SOFT.has(token) || leftByCustomers && token === "review");
  // Nothing but "how" words: they are the subject after all.
  if (!hard.length) hard = all;
  const words = { hard: hard.slice(0, 12), soft: all.filter(token => !hard.includes(token)).slice(0, 12), alternatives, sequence: all, phrase };
  if (recentQueries.size > 64) recentQueries.clear();
  recentQueries.set(text, words);
  return words;
}
let compiledAliases: [RegExp, string[]][] | undefined;
const aliasRules = () => compiledAliases ??= [...QUERY_ALIASES, ...WORD_ALIASES].map(([pattern, alias]) => [new RegExp(pattern.source, "g"), searchTokens(alias)]);
/** A word split in two ("tik tok", "web site", "e mail") also meets the catalogue's single word. Index-aware, so
 *  the joined word is only offered when the catalogue uses it. */
function withJoinedWords(index: LibrarySearchIndex, words: QueryWords): Record<string, string[]> {
  const alternatives = { ...words.alternatives };
  for (let i = 0; i + 1 < words.sequence.length; i++) {
    const a = words.sequence[i], b = words.sequence[i + 1], joined = a + b;
    if (SOFT.has(a) || SOFT.has(b) || index.terms[lowerBound(index.terms, joined)] !== joined) continue;
    for (const part of [a, b]) alternatives[part] = [...new Set([...(alternatives[part] ?? []), joined])];
  }
  return alternatives;
}

/** Words that say how or how well, not what. They add evidence but are not required while a subject word remains.
 *  Kept in token form ("analysis" is the token "analysi"). */
const SOFT = new Set(["creative", "write", "create", "generate", "build", "analyse", "analysis", "analyst", "check", "review", "fix", "improve", "better", "good", "great", "idea", "template", "tip", "example", "simple", "simply", "quick", "easy", "free", "tool", "online", "using", "old", "new", "small", "several", "multiple", "many", "more", "higher", "plan", "list", "set", "up", "keep", "keeping", "start", "starting", "find", "tell", "turn", "give", "ready", "proper", "professional",
  // The kind of business says who is asking, not what they need ("more bookings for my salon"): context, unless it
  // is all they typed. library-search-language.ts maps each to local-service words.
  "salon", "barber", "barbershop", "hairdresser", "spa", "dentist", "dental", "clinic", "physio", "vet", "plumber", "plumbing", "electrician", "roofer", "cleaner", "landscaper", "gardener", "handyman", "tradesman", "locksmith", "decorator", "bakery", "cafe", "coffee", "restaurant", "takeaway", "florist"].flatMap(word => searchTokens(word)));
/** Plain wording people type, mapped to the words the catalogue uses. Each typed word may be met by the catalogue words instead. */
const QUERY_ALIASES: [RegExp, string][] = [
  [/\b(?:stop(?:ped|s)? (?:working|selling|converting)|not (?:working|selling|converting)|are ?n'?t (?:working|selling|converting)|dropp?(?:ed|ing)|declin(?:e|ed|ing)|tank(?:ed|ing))\b/, "drop"],
  [/\b(?:disapproved|rejected|banned|flagged|taken down)\b/, "policy compliance"],
  [/\b(?:facebook|fb|instagram|insta)\b/, "meta"],
  [/\b(?:has ?n'?t paid|not paid|unpaid|overdue|chas(?:e|ing))\b/, "late payment reminder invoice"],
  [/\b(?:price (?:increase|rise|hike)s?|rais(?:e|ing) (?:my |our |the )?prices?)\b/, "price rise"],
  [/\bmanufacturers?\b/, "factory supplier"],
  [/\b(?:bad|negative|one.star|1.star) reviews?\b/, "review reply"],
  [/\bcover letters?\b/, "resume application"],
  [/\bcv\b/, "resume"],
  [/\bp ?& ?l\b|\bp and l\b/, "profit loss pl"],
  [/\b(?:1 ?on ?1|1:1|one.on.one)\b/, "one meeting"],
  [/\b(?:ai.sounding|sounds? like ai|robotic|ai.written)\b/, "slop style"],
  [/\b(?:gone|went) quiet\b|\bghost(?:ed|ing)\b/, "stalled quiet"],
  [/\b(?:keeps?|are) leaving\b|\bcancel+(?:ing|ations?)\b/, "churn"],
  [/\bugc\b/, "creator"],
  [/\b(?:spy|spying)\b/, "competitor library"],
  [/\bpersonas?\b/, "avatar profile"],
  [/\b(?:stripe|paypal|square|shopify) payouts?\b/, "bank reconcile"],
  [/\bto.?do list\b/, "task"],
  [/\bexams?\b/, "study revision"],
  [/\brespond(?:ing)?\b/, "reply"],
  [/\b(?:cash|money) (?:last|run out)|run(?:ning)? out of (?:cash|money)\b/, "runway forecast"],
  [/\b(?:clearer|clarity|simpler|easier to read|plain(?:er)? (?:english|language|words))\b/, "plain clear"],
];


function encodePosting(entries: Map<number, number>): string {
  const bytes: number[] = []; let previous = 0;
  for (const [id, mask] of entries) {
    let value = (id - previous) * 32 + mask; previous = id;
    do { const byte = value & 127; value = Math.floor(value / 128); bytes.push(byte | (value ? 128 : 0)); } while (value);
  }
  let binary = ""; for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
const decoded = new WeakMap<LibrarySearchIndex, Map<number, [number, number][]>>();
function posting(index: LibrarySearchIndex, term: number): [number, number][] {
  if (!index.postings[term]) return [];
  let cache = decoded.get(index); if (!cache) { cache = new Map(); decoded.set(index, cache); }
  const existing = cache.get(term); if (existing) return existing;
  const bytes = atob(index.postings[term]), result: [number, number][] = []; let id = 0, value = 0, shift = 0;
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes.charCodeAt(i); value += (byte & 127) * 2 ** shift;
    if (byte & 128) { shift += 7; if (shift > 28) throw Error("Invalid search posting"); continue; }
    const mask = value % 32; id += Math.floor(value / 32);
    if (!mask || id >= index.docs.length || result.length && id <= result[result.length - 1][0]) throw Error("Invalid search document");
    result.push([id, mask]); value = 0; shift = 0;
  }
  if (shift) throw Error("Truncated search posting");
  cache.set(term, result); return result;
}
export function buildLibrarySearchIndex(documents: SearchDocument[], sourceHash: string): LibrarySearchIndex {
  const docs = [...documents].sort((a, b) => a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0);
  if (new Set(docs.map(doc => doc.slug)).size !== docs.length) throw Error("Duplicate search documents");
  const terms = new Map<string, Map<number, number>>();
  docs.forEach((doc, id) => FIELDS.forEach((field, bit) => {
    const purpose = doc.purpose?.[field] ?? [doc[field] ?? ""];
    for (const token of [...searchTokens(doc[field] ?? "", true), ...purpose.flatMap(text => searchIntents(text, true).filter(intent => !doc.excludeIntents?.includes(intent.id)).map(intent => "~" + intent.id))]) {
      let hits = terms.get(token); if (!hits) { hits = new Map(); terms.set(token, hits); }
      hits.set(id, (hits.get(id) ?? 0) | (1 << bit));
    }
  }));
  docs.forEach((doc, id) => {
    if (!doc.kind) return;
    const term = '~kind:' + doc.kind;
    let hits = terms.get(term); if (!hits) { hits = new Map(); terms.set(term, hits); }
    hits.set(id, 16);
  });
  const vocabulary = [...terms.keys()].sort();
  return { version: 1, sourceHash, docs: docs.map(doc => doc.slug), terms: vocabulary, postings: vocabulary.map(term => encodePosting(terms.get(term)!)) };
}
const STAND_IN_KNOWN = 0.6;
const weight = (mask: number) => Math.max(...WEIGHTS.filter((_, bit) => mask & (1 << bit)));
const fieldOf = (mask: number): SearchField => mask & 1 ? "title" : mask & 2 ? "summary" : mask & 4 ? "intro" : mask & 16 ? "metadata" : "body";
function lowerBound(terms: string[], query: string): number {
  let low = 0, high = terms.length;
  while (low < high) { const middle = (low + high) >>> 1; if (terms[middle] < query) low = middle + 1; else high = middle; }
  return low;
}
/** Endings that give another form of the same word ("review", "reviewing", "invoiced"). "-er" usually makes a
 *  different word ("reviewer", "leader", "customer"), except after a few doing words, where it names the tool
 *  that does it ("checker", "tracker", "maker"). */
const FORM_ENDING = /^(?:s|es|d|ed|ing|ings|ment|ments|ly|ation|ations)$/;
const DOERS = new Set(["check", "track", "build", "find", "make", "pick", "read", "test", "draft", "scan", "score", "print", "edit", "plan"]);
export function isWordForm(word: string, ending: string): boolean {
  return FORM_ENDING.test(ending) || DOERS.has(word) && (/^(?:n?ers?|ors?)$/.test(ending) || word.endsWith("e") && /^rs?$/.test(ending));
}
/** Terms that start with a typed word. A whole word the catalogue uses only meets its own forms; a word still being
 *  typed ("analy") meets every word it starts. */
function prefixTerms(index: LibrarySearchIndex, token: string, result: number[], whole = "") {
  for (let term = lowerBound(index.terms, token); term < index.terms.length && (index.terms[term] === token || token.length >= 4 && token !== "aeo" && token !== "seo" && index.terms[term].startsWith(token)); term++) {
    if (whole && index.terms[term] !== whole && !isWordForm(whole, index.terms[term].slice(token.length))) continue;
    if (!result.includes(term)) result.push(term);
  }
}
/** Edit distance with swapped neighbours, or max + 1 once it exceeds `max`. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let before = Array.from({ length: b.length + 1 }, (_, j) => j), prev: number[] = [];
  for (let i = 1; i <= a.length; i++) {
    const row = [i]; let best = i;
    for (let j = 1; j <= b.length; j++) {
      let value = Math.min(before[j] + 1, row[j - 1] + 1, before[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) value = Math.min(value, prev[j - 2] + 1);
      row.push(value); best = Math.min(best, value);
    }
    if (best > max) return max + 1;
    prev = before; before = row;
  }
  return Math.min(before[b.length], max + 1);
}
/** Letters two words share in order: among equally close spellings, the one that keeps the typed letters wins
 *  ("sgan" is "sagan" with a letter dropped, not "sign"). */
function sharedLetters(a: string, b: string): number {
  let row = new Array(b.length + 1).fill(0);
  for (let i = 1; i <= a.length; i++) { const next = [0]; for (let j = 1; j <= b.length; j++) next.push(a[i - 1] === b[j - 1] ? row[j - 1] + 1 : Math.max(row[j], next[j - 1])); row = next; }
  return row[b.length];
}
const fuzzyCache = new WeakMap<LibrarySearchIndex, Map<string, number[]>>();
/** A word's consonant outline ("referral" and "refrel" are both r-f-r-l): catches typos that drop or swap vowels. */
const outline = (word: string) => word[0] + word.slice(1).replace(/[aeiouy]/g, "").replace(/(.)\1+/g, "$1");
/** Terms for one query word: exact, longer forms, then (for a word the catalogue never uses) close spellings such
 *  as "emial" or "refrel". Only typed words are corrected; catalogue stand-ins are used as written. */
function matchingTerms(index: LibrarySearchIndex, token: string, correct = true): number[] {
  const result: number[] = [], whole = index.terms[lowerBound(index.terms, token)] === token ? token : "";
  prefixTerms(index, token, result, whole);
  if (token.length >= 6 && token.endsWith("e")) prefixTerms(index, token.slice(0, -1), result, whole);
  if (!correct || index.terms[lowerBound(index.terms, token)] === token || token.length < 4 || /\d/.test(token)) return result;
  let cache = fuzzyCache.get(index); if (!cache) { cache = new Map(); fuzzyCache.set(index, cache); }
  let fuzzy = cache.get(token);
  if (!fuzzy) {
    const max = token.length >= 7 ? 2 : 1, shape = token.length >= 5 ? outline(token) : "", found: [number, number, number, number][] = [];
    for (let term = lowerBound(index.terms, token[0]); term < index.terms.length && index.terms[term][0] === token[0]; term++) {
      const candidate = index.terms[term];
      if (candidate.length < 4 || candidate === token || Math.abs(candidate.length - token.length) > 3) continue;
      const apart = distance(token, candidate, Math.max(max, shape ? 3 : 0));
      if (apart <= max || shape && apart <= 3 && outline(candidate) === shape) found.push([term, apart, -sharedLetters(token, candidate), Math.abs(candidate.length - token.length)]);
    }
    fuzzy = found.sort((a, b) => a[1] - b[1] || a[2] - b[2] || a[3] - b[3] || a[0] - b[0]).slice(0, 3).map(([term]) => term);
    cache.set(token, fuzzy);
  }
  for (const term of fuzzy) if (!result.includes(term)) result.push(term);
  return result;
}
export function searchShardIds(index: LibrarySearchIndex, query: string): number[] {
  if (!index.shards) return [];
  const ids = new Set<number>();
  const words = queryTokens(query), alternatives = withJoinedWords(index, words);
  for (const typed of [...words.hard, ...words.soft]) for (const token of [typed, ...(alternatives[typed] ?? [])]) for (const term of matchingTerms(index, token, token === typed)) if (!index.postings[term]) ids.add(Math.floor(term / index.shards.size));
  return [...ids].sort((a,b) => a-b);
}
export function searchLibraryIndex(index: LibrarySearchIndex, query: string): Map<string, SearchHit> {
  // "write a skill" asks for a method that writes skills, not for every skill: a format word after a making verb is the subject.
  const makesFormat = /^\s*(?:(?:how (?:do|can) i|how to|i want to|help me|please)\s+)?(?:write|build|make|create|design|draft|set up|turn)\b/i.test(query);
  const preferred = makesFormat ? [] : [
    ['mind', /\b(?:minds?|thinkers?|experts?)\b/i], ['prompt', /\bprompts?\b/i], ['skill', /\bskills?\b/i],
    ['workflow', /\b(?:workflows?|routines?)\b/i], ['agent', /\bagents?\b/i],
  ].filter(([, pattern]) => (pattern as RegExp).test(query)).map(([kind]) => kind as string)
    .filter(kind => index.terms[lowerBound(index.terms, '~kind:' + kind)] === '~kind:' + kind);
  const formatWords = new Set(['mind', 'thinker', 'expert', 'prompt', 'skill', 'workflow', 'routine', 'agent']);
  const words = queryTokens(query), alternatives = withJoinedWords(index, words);
  const hard = words.hard.filter(token => !preferred.length || !formatWords.has(token)), soft = words.soft.filter(token => !preferred.length || !formatWords.has(token));
  if (!hard.length) {
    const formats = new Map<string, SearchHit>();
    for (const kind of preferred) {
      const term = lowerBound(index.terms, '~kind:' + kind);
      if (index.terms[term] === '~kind:' + kind) for (const [id] of posting(index, term)) formats.set(index.docs[id], { score: 1, field: 'metadata', reason: 'Requested format: ' + kind + '.' });
    }
    return formats;
  }
  // Per document, the best evidence for one typed word (or a stand-in for it).
  const evidence = (typed: string) => {
    const group = new Map<number, { score: number; mask: number }>();
    // A stand-in helps most when the catalogue does not use the typed word itself.
    const standIn = index.terms[lowerBound(index.terms, typed)] === typed ? STAND_IN_KNOWN : .9;
    for (const token of [typed, ...(alternatives[typed] ?? [])]) {
      const terms = matchingTerms(index, token, token === typed), corrections = fuzzyCache.get(index)?.get(token) ?? [];
      for (const term of terms) {
        // Rarer words say more ("fee" over "terms"); the cap only stops a one-off word from swamping the rest.
        const hits = posting(index, term), specificity = Math.min(6, 1 + Math.log(1 + index.docs.length / Math.max(1, hits.length)));
        // Exact words count fully, longer forms and catalogue stand-ins a little less, a corrected spelling less again
        // (the closest correction more than the others).
        const correction = corrections.indexOf(term);
        const form = (index.terms[term] === token ? 1 : correction < 0 ? .8 : correction === 0 ? .7 : .55) * (token === typed ? 1 : standIn);
        for (const [id, mask] of hits) {
          const score = weight(mask) * specificity * form, old = group.get(id);
          if (!old || score > old.score) group.set(id, { score, mask });
        }
      }
    }
    return group;
  };
  const overlap = new Map<number, { score: number; count: number }>();
  const matched = new Map<number, { score: number; mask: number; weakest: number; strongest: number; count: number }>();
  for (const token of hard) {
    const group = evidence(token);
    for (const [id, hit] of group) {
      const old = overlap.get(id); overlap.set(id, { score: (old?.score ?? 0) + hit.score, count: (old?.count ?? 0) + 1 });
      const was = matched.get(id), w = weight(hit.mask);
      matched.set(id, was ? { score: was.score + hit.score, mask: was.mask | hit.mask, weakest: Math.min(was.weakest, w), strongest: Math.max(was.strongest, w), count: was.count + 1 } : { score: hit.score, mask: hit.mask, weakest: w, strongest: w, count: 1 });
    }
  }
  const optional = new Map<number, number>();
  for (const token of soft) for (const [id, hit] of evidence(token)) {
    optional.set(id, (optional.get(id) ?? 0) + hit.score);
    const old = overlap.get(id); overlap.set(id, { score: (old?.score ?? 0) + hit.score, count: (old?.count ?? 0) + 1 });
  }
  // Every subject word must match. A long query whose words never all appear together may drop one word,
  // at a steep discount, so a misspelt or unusual extra word does not empty the results.
  let need = hard.length;
  if (hard.length >= 3 && [...matched.values()].filter(hit => hit.count === hard.length).length < 3) need = hard.length - 1;
  let intents = searchIntents(query.slice(0, 300));
  if (intents.some(intent => intent.id === "employee-onboarding" || intent.id === "customer-onboarding")) intents = intents.filter(intent => intent.id !== "onboarding");
  if (intents.some(intent => intent.id === "ad-results-review")) intents = intents.filter(intent => intent.id !== "ad-performance");
  if (intents.some(intent => intent.id === "ad-spend-analysis")) intents = intents.filter(intent => intent.id !== "ad-performance" && intent.id !== "ad-results-review");
  const naturalRequest = /^\s*(?:how|what|why|can|could|would|help|please|i|my|find|show|where|when|tell|book)\b/i.test(query);
  // A long request needs purpose evidence. Incidental words buried in a method
  // are still available to direct keyword searches, without pretending they
  // establish that the method can fulfil an unrelated real-world request.
  const literal = [...matched].filter(([, hit]) => hit.count >= need && (hit.count === hard.length || fieldOf(hit.mask) === "title" || fieldOf(hit.mask) === "summary") && (intents.length || !naturalRequest || fieldOf(hit.mask) === "title" || fieldOf(hit.mask) === "summary"));
  // A title hit for one word must not launder a passing body mention of the
  // other word into a strong match: the weakest word's evidence scales the whole.
  const result = new Map<string, SearchHit>(literal.map(([id, hit]) => [index.docs[id], {
    score: (hit.score * (hit.weakest / hit.strongest) ** 0.4 + (optional.get(id) ?? 0) * 0.5) * (hit.count < hard.length ? 0.35 : 1),
    field: fieldOf(hit.mask),
    ...(hit.count === hard.length && hit.weakest >= WEIGHTS[1] ? { strong: true } : {}),
  }]));
  const tokens = hard.length + soft.length;
  for (const intent of intents) {
    const term = lowerBound(index.terms, "~" + intent.id); if (index.terms[term] !== "~" + intent.id) continue;
    for (const [id, mask] of posting(index, term)) {
      // Purpose evidence dominates incidental words elsewhere ("new" must not
      // make a mind outrank a new-hire method). Literal matches remain available.
      const shared = overlap.get(id), score = weight(mask) * 100 + Math.min(weight(mask) * 50, shared ? shared.score * Math.min(1, shared.count / tokens) : 0);
      const old = result.get(index.docs[id]);
      // The plain word match stays on the hit, so ranking can still treat a title that says the words as one.
      const literal = old?.literal ?? (old && !old.reason ? old.score : undefined);
      if (!old || score > old.score) result.set(index.docs[id], { score, field: fieldOf(mask), reason: (fieldOf(mask) === "body" ? "Full instructions mention: " : "Matches goal: ") + intent.label + ".", ...(literal ? { literal } : {}), ...(fieldOf(mask) !== "body" || old?.strong ? { strong: true } : {}) });
    }
  }
  // Explicit format requests change ranking only among relevant candidates.
  // This uses format metadata rather than words such as "agent" in a body.
  for (const kind of preferred) {
    const term = lowerBound(index.terms, '~kind:' + kind);
    if (index.terms[term] !== '~kind:' + kind) continue;
    for (const [id] of posting(index, term)) {
      const hit = result.get(index.docs[id]);
      if (hit && hit.field !== 'body' && (hit.score >= 10 || hit.reason?.startsWith('Matches goal:'))) result.set(index.docs[id], { ...hit, score: hit.score + 1_000_000 });
    }
  }
  return result;
}

export function validateLibrarySearchIndex(value: unknown, sourceHash: string): LibrarySearchIndex {
  const index = value as LibrarySearchIndex;
  if (!index || index.version !== 1 || index.sourceHash !== sourceHash || !/^[a-f\d]{64}$/.test(sourceHash) || !Array.isArray(index.docs) || !Array.isArray(index.terms) || !Array.isArray(index.postings) || index.terms.length !== index.postings.length || index.docs.length > 20000 || index.terms.length > 1000000) throw Error("The full search index does not match this library.");
  if (index.docs.some((slug, i) => typeof slug !== "string" || !/^[a-z\d]+(?:-[a-z\d]+)*$/.test(slug) || i > 0 && slug <= index.docs[i - 1]) || index.terms.some((term, i) => typeof term !== "string" || !term || i > 0 && term <= index.terms[i - 1]) || index.postings.some(value => typeof value !== "string" || !/^[A-Za-z\d+/]*={0,2}$/.test(value))) throw Error("Invalid full search index.");
  if (index.shards && (index.shards.size !== 1024 || !Array.isArray(index.shards.files) || index.shards.files.length !== Math.ceil(index.terms.length / 1024) || index.shards.files.some((file, id) => !/^[a-f\d]{64}$/.test(file.sha256) || file.file !== `/data/library-search/${file.sha256}.json` || file.terms !== Math.min(1024, index.terms.length - id * 1024)))) throw Error("Invalid search chunk manifest.");
  return index;
}
