/** Public catalogue search only. Shared by the deterministic index builder and browser. */
import { geoAnswerAlias, searchIntents } from "./library-search-intents.ts";
export type SearchField = "title" | "summary" | "intro" | "body" | "metadata";
export type SearchHit = { score: number; field: SearchField; reason?: string };
export type SearchDocument = { slug: string; title: string; summary?: string; intro?: string; body?: string; metadata?: string; purpose?: Partial<Record<SearchField, string[]>>; excludeIntents?: string[] };
export type LibrarySearchIndex = { version: 1; sourceHash: string; corpusHash?: string; engineHash?: string; docs: string[]; terms: string[]; postings: string[]; shards?: { size: number; files: { file: string; sha256: string; terms: number }[] } };
const FIELDS = ["title", "summary", "intro", "body", "metadata"] as const;
const WEIGHTS = [1000, 100, 10, 1, 3];
const STOP = new Set(["a", "an", "and", "the", "for", "to", "of", "with", "in", "on", "is", "it", "how", "your", "my", "i", "want", "need", "help", "me", "please", "can", "could", "would", "like", "get", "make", "do", "does", "about", "some", "this", "that", "our", "we", "us", "you", "am", "be", "being", "someone", "something"]);
for (const filler of ["what", "which", "why", "where", "when", "should", "using", "into", "from", "so", "but", "these", "those", "there", "their", "been", "have", "has", "had", "who", "know", "see"]) STOP.add(filler);

export function searchTokens(text: string, preserveConceptWords = false): string[] {
  const original = text.normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase().replace(/[_-]/g, " ");
  const normalized = (geoAnswerAlias(original, preserveConceptWords) ? original.replace(/\bgeo\b/g, " aeo ") : original)
    .replace(/\b(?:answer\s*engine\s*optimi[sz]ation|generative\s*engine\s*optimi[sz]ation|ai\s*search|aeo)\b/g, " aeo ")
    .replace(/\b(?:search\s*engine\s*optimi[sz]ation|seo)\b/g, " seo ")
    .replace(/\b(?:agentic|agents)\b/g, " agent ");
  return [...new Set(((preserveConceptWords ? original + " " + normalized : normalized).match(/[\p{L}\p{N}]+/gu) ?? []).filter(token => !STOP.has(token)).map(token => token.length > 4 && token.endsWith("ies") ? token.slice(0, -3) + "y" : token.length > 3 && /[^s]s$/.test(token) ? token.slice(0, -1) : token))];
}

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
  const vocabulary = [...terms.keys()].sort();
  return { version: 1, sourceHash, docs: docs.map(doc => doc.slug), terms: vocabulary, postings: vocabulary.map(term => encodePosting(terms.get(term)!)) };
}
const weight = (mask: number) => Math.max(...WEIGHTS.filter((_, bit) => mask & (1 << bit)));
const fieldOf = (mask: number): SearchField => mask & 1 ? "title" : mask & 2 ? "summary" : mask & 4 ? "intro" : mask & 16 ? "metadata" : "body";
function lowerBound(terms: string[], query: string): number {
  let low = 0, high = terms.length;
  while (low < high) { const middle = (low + high) >>> 1; if (terms[middle] < query) low = middle + 1; else high = middle; }
  return low;
}
function matchingTerms(index: LibrarySearchIndex, token: string): number[] {
  const result: number[] = [];
  for (let term = lowerBound(index.terms, token); term < index.terms.length && (index.terms[term] === token || token.length >= 4 && token !== "aeo" && token !== "seo" && index.terms[term].startsWith(token)); term++) result.push(term);
  return result;
}
export function searchShardIds(index: LibrarySearchIndex, query: string): number[] {
  if (!index.shards) return [];
  const ids = new Set<number>();
  for (const token of searchTokens(query.slice(0, 300)).slice(0, 12)) for (const term of matchingTerms(index, token)) if (!index.postings[term]) ids.add(Math.floor(term / index.shards.size));
  return [...ids].sort((a,b) => a-b);
}
export function searchLibraryIndex(index: LibrarySearchIndex, query: string): Map<string, SearchHit> {
  const tokens = searchTokens(query.slice(0, 300)).slice(0, 12);
  if (!tokens.length) return new Map();
  let candidates: Map<number, { score: number; mask: number }> | null = null;
  const overlap = new Map<number, { score: number; count: number }>();
  for (const token of tokens) {
    const group = new Map<number, { score: number; mask: number }>();
    for (const term of matchingTerms(index, token)) {
      const hits = posting(index, term), specificity = Math.min(4, 1 + Math.log(1 + index.docs.length / Math.max(1, hits.length)));
      for (const [id, mask] of hits) {
        const score = weight(mask) * specificity * (index.terms[term] === token ? 1 : .8), old = group.get(id);
        if (!old || score > old.score) group.set(id, { score, mask });
      }
    }
    for (const [id, hit] of group) { const old = overlap.get(id); overlap.set(id, { score: (old?.score ?? 0) + hit.score, count: (old?.count ?? 0) + 1 }); }
    if (!candidates) candidates = group;
    else for (const [id, old] of candidates) { const next = group.get(id); if (!next) candidates.delete(id); else candidates.set(id, { score: old.score + next.score, mask: old.mask | next.mask }); }
  }
  let intents = searchIntents(query.slice(0, 300));
  if (intents.some(intent => intent.id === "employee-onboarding" || intent.id === "customer-onboarding")) intents = intents.filter(intent => intent.id !== "onboarding");
  if (intents.some(intent => intent.id === "ad-results-review")) intents = intents.filter(intent => intent.id !== "ad-performance");
  if (intents.some(intent => intent.id === "ad-spend-analysis")) intents = intents.filter(intent => intent.id !== "ad-performance" && intent.id !== "ad-results-review");
  const naturalRequest = /^\s*(?:how|what|why|can|could|would|help|please|i|my|find|show|where|when|tell|book)\b/i.test(query);
  // A long request needs purpose evidence. Incidental words buried in a method
  // are still available to direct keyword searches, without pretending they
  // establish that the method can fulfil an unrelated real-world request.
  const literal = [...(candidates ?? [])].filter(([, hit]) => intents.length || !naturalRequest || fieldOf(hit.mask) === "title" || fieldOf(hit.mask) === "summary");
  const result = new Map<string, SearchHit>(literal.map(([id, hit]) => [index.docs[id], { score: hit.score, field: fieldOf(hit.mask) }]));
  for (const intent of intents) {
    const term = lowerBound(index.terms, "~" + intent.id); if (index.terms[term] !== "~" + intent.id) continue;
    for (const [id, mask] of posting(index, term)) {
      // Purpose evidence dominates incidental words elsewhere ("new" must not
      // make a mind outrank a new-hire method). Literal matches remain available.
      const shared = overlap.get(id), score = weight(mask) * 100 + Math.min(weight(mask) * 50, shared ? shared.score * Math.min(1, shared.count / tokens.length) : 0);
      const old = result.get(index.docs[id]);
      if (!old || score > old.score) result.set(index.docs[id], { score, field: fieldOf(mask), reason: (fieldOf(mask) === "body" ? "Full instructions mention: " : "Matches goal: ") + intent.label + "." });
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
