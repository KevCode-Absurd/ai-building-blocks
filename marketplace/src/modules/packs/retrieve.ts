// Per-agent knowledge retrieval (RAG) over an agent's own pack: no model, no network, no library search. Every
// agent pack carries what it knows (knowledge.md, sources, skills, prompts, workflows, toolbox items); this finds the
// few passages a question needs, so an agent reads a few hundred words with their sources instead of whole files.
//
// Design, from Stanford CS329Z lecture 3 (RAG) and lecture 4 (tool use):
// - Chunks follow the file's own headings (structure beats fixed cuts), about 60 to 260 words each, with a
//   one-paragraph overlap when a long section is cut, so no fact is lost at a boundary.
// - Contextual retrieval: each chunk is indexed with a short situating line (file title and heading trail), the
//   static form of Anthropic's contextual chunk headers, worked out at build time so it costs nothing per job.
// - Hybrid retrieval: BM25 over the contextual chunk, and BM25 after expanding the query with the role's own
//   glossary (which bridges some paraphrase the way an embedding would), merged by reciprocal rank fusion, score =
//   sum of 1 / (60 + rank). Several phrasings of one question fuse the same way (multi-query retrieval). Two more
//   rankers are built but off (TUNING): a heading-only ranker cut Hit@5 from 0.71 to 0.44 on the golden set, and
//   pseudo-relevance feedback did not raise MRR (scripts/eval-retrieval.mjs, 13 Nov 2026).
// - Aliases: a short list of short forms and their spelled-out names (ROAS and return on ad spend) joins the
//   glossary expansion, the cheap answer to sparse search missing synonyms, with no embeddings and no model. A
//   vertical's owner-words file (knowledge/<vertical>/synonyms.json) adds its own groups and owner phrases.
// - Line ranker (MaxP): each list item, table row and paragraph is also scored alone and the passage keeps its best
//   unit, so the one rule or number a question needs counts in full inside a long list of unrelated ones.
// - Routing: a query may name the library modules to search (--module MCR,ADC); the whole pack is the fallback.
// - Diversity and position: at most two passages per section and ten in all (accuracy saturates after 10 to 20
//   documents, and what sits in the middle gets lost), best first.
// - Citations: each passage carries the [n] source numbers it cites, resolved to title, URL and checked date, with a
//   stale mark once the source is past its review window.
// - A stopping rule: when the best passage matches too little of the question, the result says the pack does not
//   know, so the agent asks or researches instead of padding an answer.
//
// The same algorithm ships to every agent as tools/ask-knowledge.mjs (plain Node, no dependencies), so a coding app
// runs it locally; test/packs-retrieve.test.ts checks the two give the same answers.

const STOP = new Set(("a an and the of for to in on with your my our you we i me us is are be it this that from by as at or into out up about can will what how who per one use when need needs want make get help do does did should would could which there their them they then than so if not no yes any all some more most very just also only its it's was were been has have had i'm i've you're don't").split(" "));
/** Light stemming: plural and common verb endings, so "audits", "audited" and "auditing" meet "audit". */
export function stem(w: string): string {
  if (w.length <= 3 || /^\d/.test(w)) return w;
  const s = w.replace(/ies$/, "y");
  const verb = s.replace(/(?<=[a-z]{3})(?:ing|ed)$/, "");
  // "dropped" and "dropping" meet "drop": a doubled last consonant left by the cut is undone (not ll, ss, zz).
  if (verb !== s) return verb.replace(/([b-df-hjkmnp-rtvwxy])\1$/, "$1");
  // Plurals, but not words that end in a double s or in "us" and "is" ("business", "status", "analysis").
  if (/(?:ss|us|is)$/.test(s)) return s;
  return s.replace(/(?<=[a-z]{3})(?:ches|shes|xes|sses)$/, m => m.slice(0, -2)).replace(/(?<=[a-z]{3})s$/, "");
}
/** The words of a text, in order, lower case, stop words dropped, stemmed. Numbers count as words ("2026", "404"). */
export function tokens(text: string): string[] {
  const out: string[] = [];
  for (const raw of text.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").split(/[^a-z0-9]+/)) {
    if (!raw || STOP.has(raw)) continue;
    if (raw.length < 2 && !/^\d$/.test(raw)) continue;
    out.push(stem(raw));
  }
  return out;
}

export interface Chunk {
  /** Stable id: "<path>#<heading-slug>" plus "-2", "-3" when a section is cut into several passages. */
  id: string;
  path: string;
  /** The file title and heading trail, the chunk's situating context ("SEO specialist: role knowledge > 5. Decision rules"). */
  context: string;
  /** The deepest heading over the chunk ("" before the first heading). */
  heading: string;
  /** 1-based first and last line of the passage in the file. */
  lines: [number, number];
  text: string;
  /** Source numbers the passage cites, as [3] or [3][8], in order of first use. */
  cites: number[];
}

/** Target and ceiling for a passage, in words. Lecture 3: 100 to 500 tokens; a word is about 1.3 tokens. */
export const CHUNK_TARGET_WORDS = 180;
export const CHUNK_MAX_WORDS = 260;
const MIN_WORDS = 12;
const wordCount = (s: string) => (s.match(/\S+/g) ?? []).length;
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "top";

function citesOf(text: string): number[] {
  const seen: number[] = [];
  for (const m of text.matchAll(/\[(\d{1,3})\]/g)) {
    const n = Number(m[1]);
    if (n > 0 && !seen.includes(n)) seen.push(n);
  }
  return seen;
}

/**
 * A markdown file as passages. Front matter is dropped, but a skill's description is kept as the first passage's
 * text. Headings (# to ####) start sections; code fences never do. Long sections are cut at paragraph ends near
 * CHUNK_TARGET_WORDS, repeating the last paragraph of one passage at the start of the next when it is short.
 */
export function chunkMarkdown(path: string, md: string): Chunk[] {
  const lines = md.replace(/^﻿/, "").replace(/\r\n?/g, "\n").split("\n");
  let start = 0;
  let description = "";
  if (lines[0]?.trim() === "---") {
    const end = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
    if (end > 0) {
      const d = lines.slice(1, end).find(l => /^description:/.test(l));
      description = d ? d.replace(/^description:\s*/, "").replace(/^["']|["']$/g, "").trim() : "";
      start = end + 1;
    }
  }
  const fileName = path.split("/").pop()!.replace(/\.md$/, "");
  const firstH1 = lines.slice(start).find(l => /^# /.test(l));
  const title = (firstH1 ? firstH1.slice(2).trim() : "") || fileName.replace(/[-_]+/g, " ");
  const trail: string[] = [];
  const sections: { heading: string; trail: string[]; first: number; body: { line: number; text: string }[] }[] = [];
  let current = { heading: "", trail: [] as string[], first: start + 1, body: [] as { line: number; text: string }[] };
  let fence = false;
  for (let i = start; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    const h = !fence && /^(#{1,4}) +(.+?)\s*#*\s*$/.exec(line);
    if (h) {
      sections.push(current);
      const level = h[1].length;
      trail.length = Math.max(0, level - 1);
      trail[level - 1] = h[2].replace(/[*_`]/g, "");
      current = { heading: h[2].replace(/[*_`]/g, ""), trail: trail.filter(Boolean), first: i + 1, body: [] };
    } else current.body.push({ line: i + 1, text: line });
  }
  sections.push(current);

  const chunks: Chunk[] = [];
  const ids = new Map<string, number>();
  const push = (s: typeof current, paras: { first: number; last: number; text: string }[]) => {
    const text = paras.map(p => p.text).join("\n\n").trim();
    if (!text) return;
    const ctx = [title, ...s.trail.filter((t, i) => !(i === 0 && t === title))].join(" > ");
    const base = `${path}#${slug(s.heading || title)}`;
    const n = (ids.get(base) ?? 0) + 1;
    ids.set(base, n);
    chunks.push({ id: n === 1 ? base : `${base}-${n}`, path, context: ctx, heading: s.heading, lines: [paras[0].first, paras[paras.length - 1].last], text, cites: citesOf(text) });
  };
  let usedDescription = false;
  for (const s of sections) {
    // Paragraphs: blank-line separated blocks; a list or table stays one block unless it is very long.
    const paras: { first: number; last: number; text: string }[] = [];
    let block: { line: number; text: string }[] = [];
    const flush = () => {
      if (block.some(b => b.text.trim())) {
        const t = block.map(b => b.text).join("\n").trim();
        if (wordCount(t) > CHUNK_MAX_WORDS) {
          // Cut an oversized block at line ends.
          let part: { line: number; text: string }[] = [];
          for (const b of block) {
            part.push(b);
            if (wordCount(part.map(x => x.text).join(" ")) >= CHUNK_TARGET_WORDS) { paras.push({ first: part[0].line, last: b.line, text: part.map(x => x.text).join("\n").trim() }); part = []; }
          }
          if (part.some(b => b.text.trim())) paras.push({ first: part[0].line, last: part[part.length - 1].line, text: part.map(x => x.text).join("\n").trim() });
        } else paras.push({ first: block.find(b => b.text.trim())!.line, last: [...block].reverse().find(b => b.text.trim())!.line, text: t });
      }
      block = [];
    };
    for (const b of s.body) { if (!b.text.trim()) flush(); else block.push(b); }
    flush();
    if (!usedDescription && description) { paras.unshift({ first: s.first, last: s.first, text: description }); usedDescription = true; }
    if (!paras.length) continue;
    let group: typeof paras = [];
    let words = 0;
    for (const p of paras) {
      const w = wordCount(p.text);
      if (group.length && words + w > CHUNK_TARGET_WORDS && words >= MIN_WORDS) {
        push(s, group);
        // Overlap: carry the last paragraph over when it is short (10 to 20 per cent of a passage).
        const last = group[group.length - 1];
        group = wordCount(last.text) <= CHUNK_TARGET_WORDS * 0.25 ? [last] : [];
        words = group.length ? wordCount(last.text) : 0;
      }
      group.push(p);
      words += w;
    }
    push(s, group);
  }
  // A passage with almost nothing in it (a lone heading's one-liner) joins nothing and is dropped only if empty.
  return chunks.filter(c => wordCount(c.text) > 0);
}

/** The glossary of a knowledge file ("## Glossary" or "## 9. Glossary"): term -> the words of its definition. */
export function glossaryOf(md: string): Map<string, string[]> {
  const out = new Map<string, string[]>();
  const m = /^##\s+(?:\d+\.\s*)?Glossary[^\n]*\n([\s\S]*?)(?=^##\s|(?![\s\S]))/im.exec(md.replace(/\r\n?/g, "\n"));
  if (!m) return out;
  for (const line of m[1].split("\n")) {
    const g = /^\s*[-*]\s+\*\*([^*]{2,60})\*\*\s*[:.,–—-]?\s*(.+)$/.exec(line) ?? /^\s*[-*]\s+([^:]{2,40}):\s+(.+)$/.exec(line);
    if (!g) continue;
    const term = tokens(g[1]).join(" ");
    if (!term) continue;
    // Expansion words: the definition's first sentence, at most 12 words, and the term's own spelled-out parts.
    out.set(term, [...new Set([...tokens(g[1]), ...tokens(g[2].split(/(?<=[.;])\s/)[0]).slice(0, 12)])]);
  }
  return out;
}

class Bm25 {
  private lengths: number[] = [];
  private ids = new Map<string, number>();
  /** Alternating document id / term frequency; one posting list per interned term. */
  private postings: number[][] = [];
  private avg: number;
  private k1 = 1.2;
  private b = 0.75;
  /** Consume rows incrementally and retain sparse numeric postings instead of one string-keyed Map per row. */
  constructor(texts: Iterable<string[]>) {
    for (const t of texts) {
      const tf = new Map<number, number>();
      for (const w of t) {
        let id = this.ids.get(w);
        if (id === undefined) { id = this.ids.size; this.ids.set(w, id); this.postings.push([]); }
        tf.set(id, (tf.get(id) ?? 0) + 1);
      }
      const doc = this.lengths.length;
      for (const [id, frequency] of tf) this.postings[id].push(doc, frequency);
      this.lengths.push(t.length);
    }
    this.avg = this.lengths.reduce((a, len) => a + len, 0) / Math.max(1, this.lengths.length) || 1;
  }
  idf(w: string): number { const id = this.ids.get(w), df = id === undefined ? 0 : this.postings[id].length / 2; return Math.log(1 + (this.lengths.length - df + 0.5) / (df + 0.5)); }
  has(w: string): boolean { return this.ids.has(w); }
  scores(query: string[], weights?: Map<string, number>): number[] {
    const scores = new Array<number>(this.lengths.length).fill(0);
    for (const w of new Set(query)) {
      const id = this.ids.get(w);
      if (id === undefined) continue;
      const postings = this.postings[id], weight = (weights?.get(w) ?? 1) * this.idf(w);
      for (let i = 0; i < postings.length; i += 2) {
        const doc = postings[i], f = postings[i + 1];
        scores[doc] += weight * (f * (this.k1 + 1)) / (f + this.k1 * (1 - this.b + this.b * this.lengths[doc] / this.avg));
      }
    }
    return scores;
  }
}

/**
 * Ranker settings, chosen on the 75-question golden set (scripts/eval-retrieval.mjs, 13 Nov 2026): heading ranker
 * off (Hit@5 0.44 with it, 0.71 without), feedback off (MRR 0.56 without, at most 0.54 with), glossary on (MRR 0.56
 * with, 0.54 without). Chunks of about 180 words beat 60, 90, 120 and 260. The line ranker (14 Nov 2026, tuned on
 * the odd-numbered questions, eval-retrieval.mjs --split): on, at weight 1.5, each unit with its passage's heading
 * trail, number lines x1.4 for a quantity question and rule lines x1.4 for a should-I question; Hit@1 0.43 to 0.55,
 * Hit@5 0.69 to 0.79, MRR 0.56 to 0.64 (held-out half Hit@5 0.65 to 0.73).
 */
export const TUNING = { heads: false, prf: 0, prfDocs: 3, prfWeight: 0.3, glossary: true, aliases: true, aliasWeight: 0.7, lines: true, lineWeight: 1.5, lineContext: "context", numBoost: 1.4, ruleBoost: 1.4 };

export interface UnitKind { num: boolean; rule: boolean }
/**
 * What a question asks for, read from its words: a quantity ("how long", "what share", "how many", "roughly") or a
 * call ("should I", "can we", "is it OK", "what do I do"). The line ranker then favours units of the same kind: a
 * line with a number for a quantity, a rule line ("If ..., do ...", "never", "always") for a call.
 */
export function questionKind(q: string): UnitKind {
  return {
    num: /\bhow (?:long|many|much|big|high|low|often|fast|soon|far|well)\b|\bwhat (?:share|percent(?:age)?|proportion|fraction|rate|number|size)\b|\broughly\b|\b(?:deadline|benchmark|on average)\b/i.test(q),
    rule: /\b(?:should|can|could|may|must) (?:i|we|you|my|our|they)\b|\bis it (?:ok|okay|fine|safe|bad|wise|worth|allowed|legal)\b|\bwhat (?:do|should|must) (?:i|we)\b|\bdo (?:i|we) (?:need|have) to\b|\bwhat (?:should )?happens?\b/i.test(q),
  };
}
/** The kind of one unit: it holds a number (citation marks aside), or it states a rule. */
export function unitKind(u: string): UnitKind {
  return {
    num: /\d/.test(u.replace(/\[\d{1,3}\]/g, "")),
    rule: /^(?:[-*+]\s+|\d{1,2}[.)]\s+|\|\s*)?(?:\*\*[^*]+\*\*[:.]?\s*)?(?:if|when|unless|never|always|do not|don't|before|once)\b/i.test(u) || /\b(?:never|always|must|do not|don't)\b/i.test(u),
  };
}

/**
 * The units a passage is made of, for the line ranker: each list item (with its wrapped lines), each table row and
 * each plain paragraph. Rules, numbers and mistakes sections hold one fact per line, so a 200-word passage of twelve
 * unrelated rules scores low on any one of them as a whole; scored line by line (MaxP, the best unit stands for the
 * passage) the line that answers the question counts in full.
 */
export function passageUnits(text: string): string[] {
  const out: string[] = [];
  let cur: string[] = [];
  const flush = () => { if (cur.length) out.push(cur.join(" ")); cur = []; };
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t) { flush(); continue; }
    if (/^\|?\s*:?-{2,}/.test(t) && /^[|:\-\s]+$/.test(t)) continue;
    if (/^\|/.test(t) || /^\s*(?:[-*+]|\d{1,2}[.)])\s+/.test(line)) { flush(); cur.push(t); continue; }
    cur.push(t);
  }
  flush();
  return out;
}

/**
 * Short forms and their spelled-out names, searched as one (the paraphrase gap of sparse search, lecture 3): a
 * question that says "ROAS" also reaches a passage that says "return on ad spend", and the other way round. Each
 * group is one meaning; any phrase in it pulls in the others at TUNING.aliasWeight, through the glossary ranker.
 * Kept small and unambiguous: a word with two common meanings stays out.
 */
export const ALIASES: string[][] = [
  ["roas", "return on ad spend"], ["aov", "average order value", "order value", "basket size"],
  ["cac", "customer acquisition cost", "cost per new customer", "cost to acquire"],
  ["ltv", "clv", "lifetime value", "customer lifetime value"], ["cod", "cash on delivery"], ["rto", "return to origin"],
  ["ugc", "user generated content", "creator video"], ["cvr", "conversion rate"], ["ctr", "click through rate"],
  ["cpm", "cost per thousand impressions"], ["cpc", "cost per click"], ["cpa", "cost per acquisition", "cost per purchase"],
  ["mer", "marketing efficiency ratio", "blended roas"], ["pdp", "product detail page", "product page"],
  ["atc", "add to cart"], ["bnpl", "buy now pay later"], ["moq", "minimum order quantity"],
  ["3pl", "third party logistics", "fulfilment partner"], ["cogs", "cost of goods sold"],
  ["aeo", "answer engine optimisation", "answer engine"], ["pmax", "performance max"],
  ["asc", "advantage shopping campaign", "advantage plus shopping"], ["capi", "conversions api", "server side tracking"],
  ["mde", "minimum detectable effect", "smallest detectable effect"], ["nps", "net promoter score"],
  ["wismo", "where is my order", "order status"], ["abandoned cart", "cart abandonment", "abandoned checkout"],
  ["free shipping threshold", "free delivery threshold", "shipping threshold"], ["win back", "winback", "lapsed customer", "reactivation"],
  ["welcome series", "welcome flow", "welcome email"], ["creative fatigue", "ad fatigue"], ["hook rate", "thumb stop rate"],
  ["breakeven roas", "break even roas"], ["dtc", "d2c", "direct to consumer"], ["gmv", "gross merchandise value"],
  ["repeat purchase", "repeat rate", "returning customer"], ["ecommerce", "online store"], ["pos", "point of sale"],
  ["spark ad", "boosted creator post"], ["sms", "text message"], ["kpi", "key metric"],
];

/** ALIASES as token phrases, each group a list of phrases (each phrase its tokens joined by one space). */
const ALIAS_GROUPS: string[][] = ALIASES.map(g => [...new Set(g.map(p => tokens(p).join(" ")).filter(Boolean))]);

/** The other phrases of every alias group a query names (as token phrases). */
export function aliasesOf(q: string[], groups: string[][] = ALIAS_GROUPS): string[] {
  const joined = ` ${q.join(" ")} `;
  const out: string[] = [];
  for (const g of groups) if (g.some(p => joined.includes(` ${p} `))) for (const p of g) if (!joined.includes(` ${p} `)) out.push(p);
  return out;
}

/**
 * A vertical's owner-words layer (knowledge/<vertical>/synonyms.json): `groups` are terms that mean the same thing
 * (ROAS and return on ad spend), searched as one both ways like ALIASES; `phrases` map how owners say a problem
 * ("people add to cart and leave") to the words experts and cards use ("cart abandonment"), one way only. A
 * vertical with no file searches exactly as before.
 */
export interface Synonyms { groups?: string[][]; phrases?: { owner: string[]; expert: string[] }[] }
interface SynonymIndex { groups: string[][]; phrases: { owner: string[][]; expert: string[] }[] }
function synonymIndex(s?: Synonyms | null): SynonymIndex | null {
  if (!s || (!s.groups?.length && !s.phrases?.length)) return null;
  const phrase = (p: string) => tokens(p).join(" ");
  return {
    groups: (s.groups ?? []).map(g => [...new Set(g.map(phrase).filter(Boolean))]).filter(g => g.length > 1),
    // An owner phrase matches when all its words are in the query, in any order ("leave after adding to cart").
    phrases: (s.phrases ?? []).map(p => ({ owner: p.owner.map(o => [...new Set(tokens(o))]).filter(o => o.length), expert: [...new Set(p.expert.map(phrase).filter(Boolean))] })).filter(p => p.owner.length && p.expert.length),
  };
}
/** The expert phrases a query's owner words point to, and the other names of the terms it uses (as token phrases). */
export function synonymsOf(q: string[], s: SynonymIndex | null): string[] {
  if (!s) return [];
  const words = new Set(q);
  const joined = ` ${q.join(" ")} `;
  const out = aliasesOf(q, s.groups);
  for (const p of s.phrases) if (p.owner.some(o => o.every(w => words.has(w)))) for (const e of p.expert) if (!joined.includes(` ${e} `)) out.push(e);
  return [...new Set(out)];
}

/**
 * The pack paths that hold the given vertical modules: knowledge/<vertical>/<CODE>.md and its toolbox file. Lets a
 * query search only the modules it needs (routing by metadata); the whole library stays the fallback.
 */
export function modulePaths(paths: string[], modules: string[]): string[] {
  const codes = new Set(modules.map(m => m.trim().toUpperCase()).filter(Boolean));
  return paths.filter(p => { const m = /^knowledge\/[^/]+\/(?:toolbox\/)?([A-Z]{2,4})\.md$/.exec(p); return !!m && codes.has(m[1]); });
}

/** Reciprocal rank fusion constant (Cormack et al.; lecture 3, slide 50). */
export const RRF_K = 60;
/** Most passages one answer returns: RAG accuracy saturates after 10 to 20 documents (lecture 4). */
export const MAX_PASSAGES = 10;
/** Most passages from one section, so one long section cannot crowd out the rest. */
export const PER_SECTION = 2;
/** Below this share of the question's informative words in the best passage, the pack is said not to know. */
export const MIN_COVERAGE = 0.34;

export interface SourceRef { n: number; title: string; url: string; checked: string; stale: boolean }
export interface Passage extends Omit<Chunk, "cites"> { score: number; matched: string[]; cites: SourceRef[] }
export interface Answer {
  question: string;
  passages: Passage[];
  /** Share of the question's informative words found in the best passage, 0 to 1. */
  coverage: number;
  /** False when the best passage covers less than MIN_COVERAGE of the question: say so, ask or research. */
  enough: boolean;
  /** The question's words that no passage holds: what to ask the client or research. */
  missing: string[];
}
export interface SourceRow { n: number; title: string; publisher?: string; url: string; checked: string }

export class KnowledgeIndex {
  readonly chunks: Chunk[];
  private body: Bm25;
  private heads: Bm25 | null = null;
  private units: Bm25;
  private unitOf: number[];
  private unitKind: UnitKind[];
  private glossary: Map<string, string[]>;
  private sources: Map<number, SourceRow>;
  private reviewDays: number;
  private citeFiles: Set<string>;
  private synonyms: SynonymIndex | null;
  private lines: boolean;
  /**
   * `sources` resolve the [n] numbers of the files in `citeFiles` (default knowledge.md, whose numbers point to
   * sources.json); other files number their own sources, so their [n] stay as they are.
   */
  constructor(files: { path: string; text: string }[], opts: { sources?: SourceRow[]; reviewDays?: number; glossaryFrom?: string; citeFiles?: string[]; synonyms?: Synonyms | null; lines?: boolean } = {}) {
    this.chunks = files.flatMap(f => chunkMarkdown(f.path, f.text));
    this.citeFiles = new Set(opts.citeFiles ?? ["knowledge.md"]);
    this.lines = opts.lines ?? TUNING.lines;
    // Construct rankers incrementally: do not materialize all body/line tokens while also retaining their maps.
    const chunks = this.chunks;
    this.body = new Bm25((function* () { for (const c of chunks) yield tokens(`${c.context}\n${c.text}`); })());
    this.unitOf = [];
    this.unitKind = [];
    const unitOf = this.unitOf, unitKinds = this.unitKind;
    const lines = this.lines;
    this.units = new Bm25((function* () {
      if (!lines) return;
      for (const [i, c] of chunks.entries()) for (const u of passageUnits(c.text)) {
        const t = tokens(u);
        if (t.length < 3) continue;
        t.push(...tokens(TUNING.lineContext === "context" ? c.context : TUNING.lineContext === "heading" ? c.heading : ""));
        unitOf.push(i); unitKinds.push(unitKind(u)); yield t;
      }
    })());
    const gloss = opts.glossaryFrom ?? files.find(f => f.path === "knowledge.md")?.text ?? "";
    this.glossary = glossaryOf(gloss);
    this.sources = new Map((opts.sources ?? []).filter(s => s && Number.isFinite(s.n)).map(s => [s.n, s]));
    this.reviewDays = opts.reviewDays ?? 0;
    this.synonyms = synonymIndex(opts.synonyms);
    this.lines = opts.lines ?? TUNING.lines;
  }

  /** The query's glossary expansion: definition words of every glossary term the query names, at half weight. */
  private expand(q: string[]): Map<string, number> {
    const joined = ` ${q.join(" ")} `;
    const out = new Map<string, number>();
    for (const [term, words] of this.glossary) {
      if (!joined.includes(` ${term} `)) continue;
      for (const w of words) if (!q.includes(w)) out.set(w, 0.5);
    }
    if (TUNING.aliases) for (const p of [...aliasesOf(q), ...synonymsOf(q, this.synonyms)]) for (const w of p.split(" ")) if (!q.includes(w)) out.set(w, Math.max(out.get(w) ?? 0, TUNING.aliasWeight));
    return out;
  }

  /** True when the pack holds the word, or every word of one of its aliases ("roas" when only "return on ad spend" is there). */
  private knows(w: string, has: (x: string) => boolean): boolean {
    return has(w) || (TUNING.aliases && [...aliasesOf([w]), ...synonymsOf([w], this.synonyms)].some(p => p.split(" ").every(has)));
  }

  /** Each passage scored by its best unit (passageUnits), over the expanded query. */
  private lineScores(q: string[], weights: Map<string, number>, want: UnitKind): number[] {
    const out = new Array<number>(this.chunks.length).fill(0);
    this.units.scores(q, weights).forEach((s, u) => {
      const i = this.unitOf[u], k = this.unitKind[u];
      const v = s * (want.num && k.num ? TUNING.numBoost : 1) * (want.rule && k.rule ? TUNING.ruleBoost : 1);
      if (v > out[i]) out[i] = v;
    });
    return out;
  }

  /**
   * Pseudo-relevance feedback (RM3-style, no model): the most telling words of the top passages of a first pass join
   * the query at a lower weight, so a question in the client's words reaches passages in the pack's words.
   */
  private feedback(first: number[], qt: string[], weights: Map<string, number>): number[] {
    const top = first.map((s, i) => [s, i] as const).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0]).slice(0, TUNING.prfDocs);
    const gain = new Map<string, number>();
    for (const [, i] of top) {
      const words = tokens(`${this.chunks[i].context}\n${this.chunks[i].text}`);
      const tf = new Map<string, number>();
      for (const w of words) tf.set(w, (tf.get(w) ?? 0) + 1);
      for (const [w, f] of tf) if (!qt.includes(w)) gain.set(w, (gain.get(w) ?? 0) + (f / words.length) * this.body.idf(w));
    }
    const extra = [...gain].sort((a, b) => b[1] - a[1]).slice(0, TUNING.prf);
    const w2 = new Map(weights);
    for (const [w] of extra) if (!w2.has(w)) w2.set(w, TUNING.prfWeight);
    return this.body.scores([...qt, ...extra.map(([w]) => w)], w2);
  }

  /**
   * The passages that answer a question, best first. `questions` may hold several phrasings of one need (the
   * agent's own rewrites); their rankings fuse like the rankers do. `today` (YYYY-MM-DD) marks stale sources.
   * `adjust` lets a caller with metadata (knowledge cards: tier, freshness, market) rescale a passage's fused score
   * or drop it (null) before the top k are picked. `max` raises the ceiling on k (MAX_PASSAGES) for a caller that
   * reranks a deeper pool itself, such as job preparation.
   */
  ask(questions: string | string[], opts: { k?: number; max?: number; today?: string; paths?: string[]; modules?: string[]; uniquePath?: boolean; adjust?: (chunk: Chunk, score: number) => number | null } = {}): Answer {
    const qs = (Array.isArray(questions) ? questions : [questions]).map(s => s.trim()).filter(Boolean);
    const k = Math.max(1, Math.min(opts.max ?? MAX_PASSAGES, opts.k ?? 6));
    // A module filter narrows the search to those modules' files (and any paths given); none found: the whole pack.
    const routed = opts.modules?.length ? modulePaths([...new Set(this.chunks.map(c => c.path))], opts.modules) : [];
    const scope = [...(opts.paths ?? []), ...routed];
    const allowed = scope.length ? new Set(scope) : null;
    const fused = new Map<number, number>();
    const qWords = [...new Set(qs.flatMap(tokens))];
    for (const q of qs) {
      const qt = tokens(q);
      if (!qt.length) continue;
      const exp = this.expand(qt);
      const expQuery = [...qt, ...exp.keys()];
      const weights = new Map<string, number>([...exp, ...qt.map(w => [w, 1] as [string, number])]);
      const first = this.body.scores(qt);
      const rankers: [number[] | null, number][] = [[first, 1], [TUNING.heads ? (this.heads ??= new Bm25(this.chunks.map(c => tokens(c.context)))).scores(qt) : null, 1], [TUNING.glossary && exp.size ? this.body.scores(expQuery, weights) : null, 1]];
      if (TUNING.prf > 0) rankers.push([this.feedback(first, qt, weights), 1]);
      if (this.lines) rankers.push([this.lineScores(expQuery, weights, questionKind(q)), TUNING.lineWeight]);
      for (const [scores, w] of rankers) {
        if (!scores) continue;
        const order = scores.map((s, i) => [s, i] as const).filter(([s, i]) => s > 0 && (!allowed || allowed.has(this.chunks[i].path))).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
        order.forEach(([, i], rank) => fused.set(i, (fused.get(i) ?? 0) + w / (RRF_K + rank + 1)));
      }
    }
    const adjusted = opts.adjust ? [...fused].flatMap(([i, s]) => { const v = opts.adjust!(this.chunks[i], s); return v === null ? [] : [[i, v] as [number, number]]; }) : [...fused];
    const ranked = adjusted.sort((a, b) => b[1] - a[1] || a[0] - b[0]);
    const perSection = new Map<string, number>();
    const pickedPaths = new Set<string>();
    const picked: [number, number][] = [];
    for (const [i, s] of ranked) {
      const c = this.chunks[i];
      if (opts.uniquePath && pickedPaths.has(c.path)) continue;
      const key = `${c.path}#${c.context}`;
      if ((perSection.get(key) ?? 0) >= PER_SECTION) continue;
      perSection.set(key, (perSection.get(key) ?? 0) + 1);
      picked.push([i, s]);
      pickedPaths.add(c.path);
      if (picked.length >= k) break;
    }
    const informative = qWords.filter(w => this.body.idf(w) > 0.2);
    const has = (i: number) => new Set(tokens(`${this.chunks[i].context}\n${this.chunks[i].text}`));
    const bestWords = picked.length ? has(picked[0][0]) : new Set<string>();
    const coverage = informative.length ? informative.filter(w => this.knows(w, x => bestWords.has(x))).length / informative.length : 0;
    const anywhere = new Set(picked.flatMap(([i]) => [...has(i)]));
    const passages: Passage[] = picked.map(([i, score]) => {
      const c = this.chunks[i];
      const words = has(i);
      return { ...c, score: Math.round(score * 10000) / 10000, matched: qWords.filter(w => words.has(w)), cites: this.citeFiles.has(c.path) ? c.cites.map(n => this.cite(n, opts.today)).filter((x): x is SourceRef => !!x) : [] };
    });
    // A name the question depends on (an acronym, a law, a brand, a tool) that appears nowhere in the pack means the
    // pack does not know, however many other words match: "GST on shipping" must not be answered from an Amazon card.
    const unknown = [...new Set(qs.flatMap(namesIn))].filter(w => !this.knows(w, x => this.body.has(x)));
    return { question: qs.join(" | "), passages, coverage: Math.round(coverage * 100) / 100, enough: coverage >= MIN_COVERAGE && !unknown.length, missing: [...new Set([...unknown, ...informative.filter(w => !this.knows(w, x => anywhere.has(x)))])] };
  }

  private cite(n: number, today?: string): SourceRef | null {
    const s = this.sources.get(n);
    if (!s) return null;
    const stale = !!(today && this.reviewDays && s.checked && daysBetween(s.checked, today) > this.reviewDays * 2);
    return { n, title: s.title, url: s.url, checked: s.checked, stale };
  }
}

/**
 * The names in a question, as tokens: all-capital words of 2 to 6 letters (GST, FSSAI, DPDP), words with a capital
 * after the first letter (iPhone, TikTok), and capitalised words that do not start a sentence (Shiprocket, Delhivery).
 */
export function namesIn(question: string): string[] {
  const out: string[] = [];
  const words = question.split(/\s+/);
  words.forEach((raw, i) => {
    const w = raw.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9]+$/g, "");
    if (w.length < 2) return;
    const sentenceStart = i === 0 || /[.?!:]["')]?$/.test(words[i - 1] ?? "");
    const acronym = /^[A-Z]{2,6}s?$/.test(w);
    const inner = /^[A-Za-z][a-z]+[A-Z]/.test(w);
    const proper = /^[A-Z][a-z]{2,}$/.test(w) && !sentenceStart;
    if (acronym || inner || proper) out.push(...tokens(w));
  });
  return out;
}

function daysBetween(a: string, b: string): number {
  const t = (d: string) => Date.parse(`${d.slice(0, 10)}T00:00:00Z`);
  const x = t(a), y = t(b);
  return Number.isFinite(x) && Number.isFinite(y) ? Math.round((y - x) / 86_400_000) : 0;
}

/**
 * The files of a pack the knowledge index covers: what the agent opens on demand. The always-loaded core (AGENTS.md,
 * WORK-METHOD.md and the rest), the about files, skills.md (a copy of skills/) and the training logs stay out.
 */
export function indexedPath(path: string): boolean {
  if (!path.endsWith(".md")) return false;
  if (/^(README|AGENTS|CLAUDE|LICENSE|CHANGELOG|WORK-METHOD|skills|soul|personality|QUALITY-METHOD|toolbox|knowledge-map|sources|library|access|LICENSE)\.md$/.test(path)) return false;
  if (/^(context|training|examples|\.agents|\.claude)\//.test(path)) return false;
  if (/^tools\/(?!quality\/cards\/)/.test(path)) return false;
  return true;
}

/** Render an answer as plain text for a chat: each passage with its place, then its sources. */
export function answerText(a: Answer, agentName: string): string {
  if (!a.passages.length) return `${agentName}'s pack has nothing on this. Say so, then ask the client or research it (WORK-METHOD.md step 1). Do not answer from memory as if it were the pack's knowledge.`;
  const head = a.enough
    ? `${a.passages.length} passage${a.passages.length === 1 ? "" : "s"} from ${agentName}'s pack, best first. Use only what they say; cite the sources shown.`
    : `Weak match: the best passage covers ${Math.round(a.coverage * 100)}% of the question${a.missing.length ? ` (nothing on: ${a.missing.slice(0, 8).join(", ")})` : ""}. Treat this as not in the pack: ask the client or research it, and say which.`;
  const body = a.passages.map((p, i) => {
    const src = p.cites.length ? `\nSources: ${p.cites.map(c => `[${c.n}] ${c.title}, checked ${c.checked}${c.stale ? " (STALE: recheck before use)" : ""} ${c.url}`).join("; ")}` : "";
    return `--- ${i + 1}. ${p.path}:${p.lines[0]}-${p.lines[1]} | ${p.context} ---\n${p.text}${src}`;
  }).join("\n\n");
  return `${head}\n\n${body}`;
}

/**
 * knowledge-map.md: every passage's id, place and heading trail in one compact list, for chat apps that cannot run
 * the tool. The AI reads the map, then jumps to the sections it needs instead of reading every file in full (the
 * static form of a hierarchical index).
 */
export function knowledgeMap(index: Pick<KnowledgeIndex, "chunks">, agentName: string, withTool = true, budgetWords = 1_800): string {
  const byFile = new Map<string, Chunk[]>();
  for (const c of index.chunks) { if (!byFile.has(c.path)) byFile.set(c.path, []); byFile.get(c.path)!.push(c); }
  const lines = [
    `# Knowledge map`,
    "",
    `Every section ${agentName} can look up, by file. Find the sections a question needs here, then read only those.${withTool ? ` In a coding app, run \`node tools/ask-knowledge.mjs "<question>"\` instead: it returns the passages with their sources.` : ""} If nothing here fits, the pack does not know: ask the client or research it.`,
    "",
  ];
  let words = wordCount(lines.join(" "));
  for (const [path, cs] of byFile) {
    const heads = [...new Set(cs.map(c => c.context.split(" > ").slice(1).join(" > ")).filter(Boolean))];
    const line = `- \`${path}\`${heads.length ? `: ${heads.join("; ")}` : ""}`;
    const w = wordCount(line);
    if (words + w > budgetWords) { lines.push(`- \`${path}\``); words += 2; continue; }
    lines.push(line);
    words += w;
  }
  return `${lines.join("\n")}\n`;
}

/** sources.md lines as the pack writes them: "3. [Title](https://...), Publisher. Checked 2026-11-06. Supports: ..." */
export function parseSourcesMd(md: string): SourceRow[] {
  const out: SourceRow[] = [];
  for (const line of md.replace(/\r\n?/g, "\n").split("\n")) {
    const m = /^(\d+)\. \[([^\]]+)\]\(([^)\s]+)\).*?Checked (\d{4}-\d{2}-\d{2})/.exec(line);
    if (m) out.push({ n: Number(m[1]), title: m[2], url: m[3], checked: m[4] });
  }
  return out;
}

/** Sections every job leans on: one passage of each comes along with any knowledge excerpt. */
const STEERING = /decision rules|quality bar|common mistakes|my specialty/i;

/**
 * The knowledge.md passages a request needs, within a character budget, in file order: the best passages for the
 * request (KnowledgeIndex.ask), plus the first passage of each steering section (decision rules, quality bar, common
 * mistakes, specialty) when the request found none of it. Used by load_agent in place of whole sections.
 */
export function knowledgeExcerpt(md: string, request: string, budget: number): { passages: Chunk[]; headings: string[] } {
  const index = new KnowledgeIndex([{ path: "knowledge.md", text: md }]);
  const ranked = index.ask(request, { k: MAX_PASSAGES }).passages.map(p => index.chunks.find(c => c.id === p.id)!)
    // The preamble under the title (dates, how to read the file) is not knowledge a job needs.
    .filter(c => c.context.includes(" > "));
  const steering = [...new Set(index.chunks.filter(c => STEERING.test(c.context)).map(c => c.context))]
    .filter(ctx => !ranked.some(r => r.context === ctx))
    .map(ctx => index.chunks.find(c => c.context === ctx)!);
  const picked: Chunk[] = [];
  let used = 0;
  for (const c of [...ranked.slice(0, 3), ...steering, ...ranked.slice(3)]) {
    if (used + c.text.length > budget) continue;
    picked.push(c);
    used += c.text.length + c.context.length + 8;
  }
  const order = new Map(index.chunks.map((c, i) => [c.id, i]));
  picked.sort((a, b) => order.get(a.id)! - order.get(b.id)!);
  return { passages: picked, headings: [...new Set(picked.map(c => c.heading || c.context))] };
}
