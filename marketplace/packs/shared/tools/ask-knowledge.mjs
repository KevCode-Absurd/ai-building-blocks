#!/usr/bin/env node
// ask-knowledge.mjs: find what this agent knows about a question, with the sources, in its own pack.
// Plain Node 18 or later, no dependencies, no network, nothing sent anywhere. Run it from the pack folder:
//
//   node tools/ask-knowledge.mjs "how long to wait after a core update before judging a drop"
//   node tools/ask-knowledge.mjs "core update drop" "traffic fell after Google update" --k 8
//   node tools/ask-knowledge.mjs "title rewrite rules" --in knowledge.md --json
//   node tools/ask-knowledge.mjs "free shipping threshold for bundles" --module OFF,MEA
//
// Several quoted phrasings of one need are searched together and their rankings merged (ask it two or three ways
// when the first words may not be the pack's words). It prints the best passages, best first, each with an id to note
// (a library card's own id and tier: each card comes back whole, with its source line), its file and lines, its
// heading trail and the sources it cites (with the date each was checked, and STALE when a source is past twice its
// review window). A passage that repeats one already shown is left out. When the best passage covers too little of the question, it says the pack does not know:
// then ask the client or research it, and never fill the gap from memory.
//
// Generated from the AI Blocks marketplace (src/modules/packs/retrieve.ts by scripts/gen-ask-knowledge.mjs).
// Do not edit by hand.

// Per-agent knowledge retrieval (RAG) over an agent's own pack: no model, no network, no library search. Every
// agent pack carries what it knows (knowledge.md, sources, skills, prompts, workflows, toolbox items); this finds the
// passages a question needs, with bounded complete methods when prerequisites and exceptions belong together.
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
// - Diversity: keep the strongest whole-question hit, reserve room for explicit clauses, then fill by rank. At
//   most two excerpts per section, ten results by default. These are context controls, not universal optimal k.
// - Parent context: small skills, prompts and workflows can expand to complete methods within a 32,000-character
//   source-text budget, after other selected evidence is reserved. Long or unaffordable parents stay labeled excerpts.
// - Citations: each passage carries the [n] source numbers it cites, resolved to title, URL and checked date, with a
//   stale mark once the source is past its review window.
// - A stopping rule: weak lexical coverage of any explicit need is visible. Lexical matches are not semantic
//   support or proof of complete evidence; the agent still verifies claims, qualifications and missing sources.
//
// The same algorithm ships to every agent as tools/ask-knowledge.mjs (plain Node, no dependencies), so a coding app
// runs it locally; test/packs-retrieve.test.ts checks the two give the same answers.

const STOP = new Set(("a an and the of for to in on with your my our you we i me us is are be it this that from by as at or into out up about can will what how who per one use when need needs want make get help do does did should would could which there their them they then than so if not no yes any all some more most very just also only its it's was were been has have had i'm i've you're don't").split(" "));
/** Light stemming: plural and common verb endings, so "audits", "audited" and "auditing" meet "audit". */
export function stem(w        )         {
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
export function tokens(text        )           {
  const out           = [];
  for (const raw of text.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").split(/[^a-z0-9]+/)) {
    if (!raw || STOP.has(raw)) continue;
    if (raw.length < 2 && !/^\d$/.test(raw)) continue;
    out.push(stem(raw));
  }
  return out;
}
















/** Target and ceiling for a passage, in words. Lecture 3: 100 to 500 tokens; a word is about 1.3 tokens. */
export const CHUNK_TARGET_WORDS = 180;
export const CHUNK_MAX_WORDS = 260;
const MIN_WORDS = 12;
const wordCount = (s        ) => (s.match(/\S+/g) ?? []).length;
const slug = (s        ) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "top";

function citesOf(text        )           {
  const seen           = [];
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
export function chunkMarkdown(path        , md        )          {
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
  const fileName = path.split("/").pop() .replace(/\.md$/, "");
  const firstH1 = lines.slice(start).find(l => /^# /.test(l));
  const title = (firstH1 ? firstH1.slice(2).trim() : "") || fileName.replace(/[-_]+/g, " ");
  const trail           = [];
  const sections                                                                                                = [];
  let current = { heading: "", trail: []            , first: start + 1, body: []                                     };
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

  const chunks          = [];
  const ids = new Map                ();
  const push = (s                , paras                                                 ) => {
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
    const paras                                                  = [];
    let block                                   = [];
    const flush = () => {
      if (block.some(b => b.text.trim())) {
        const t = block.map(b => b.text).join("\n").trim();
        if (wordCount(t) > CHUNK_MAX_WORDS) {
          // Cut an oversized block at line ends.
          let part                                   = [];
          for (const b of block) {
            part.push(b);
            if (wordCount(part.map(x => x.text).join(" ")) >= CHUNK_TARGET_WORDS) { paras.push({ first: part[0].line, last: b.line, text: part.map(x => x.text).join("\n").trim() }); part = []; }
          }
          if (part.some(b => b.text.trim())) paras.push({ first: part[0].line, last: part[part.length - 1].line, text: part.map(x => x.text).join("\n").trim() });
        } else paras.push({ first: block.find(b => b.text.trim()) .line, last: [...block].reverse().find(b => b.text.trim()) .line, text: t });
      }
      block = [];
    };
    for (const b of s.body) { if (!b.text.trim()) flush(); else block.push(b); }
    flush();
    if (!usedDescription && description) { paras.unshift({ first: s.first, last: s.first, text: description }); usedDescription = true; }
    if (!paras.length) continue;
    let group               = [];
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
export function glossaryOf(md        )                        {
  const out = new Map                  ();
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
          lengths           = [];
          ids = new Map                ();
  /** Alternating document id / term frequency; one posting list per interned term. */
          postings             = [];
          avg        ;
          k1 = 1.2;
          b = 0.75;
  /** Consume rows incrementally and retain sparse numeric postings instead of one string-keyed Map per row. */
  constructor(texts                    ) {
    for (const t of texts) {
      const tf = new Map                ();
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
  idf(w        )         { const id = this.ids.get(w), df = id === undefined ? 0 : this.postings[id].length / 2; return Math.log(1 + (this.lengths.length - df + 0.5) / (df + 0.5)); }
  has(w        )          { return this.ids.has(w); }
  scores(query          , weights                      )           {
    const scores = new Array        (this.lengths.length).fill(0);
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


/**
 * What a question asks for, read from its words: a quantity ("how long", "what share", "how many", "roughly") or a
 * call ("should I", "can we", "is it OK", "what do I do"). The line ranker then favours units of the same kind: a
 * line with a number for a quantity, a rule line ("If ..., do ...", "never", "always") for a call.
 */
export function questionKind(q        )           {
  return {
    num: /\bhow (?:long|many|much|big|high|low|often|fast|soon|far|well)\b|\bwhat (?:share|percent(?:age)?|proportion|fraction|rate|number|size)\b|\broughly\b|\b(?:deadline|benchmark|on average)\b/i.test(q),
    rule: /\b(?:should|can|could|may|must) (?:i|we|you|my|our|they)\b|\bis it (?:ok|okay|fine|safe|bad|wise|worth|allowed|legal)\b|\bwhat (?:do|should|must) (?:i|we)\b|\bdo (?:i|we) (?:need|have) to\b|\bwhat (?:should )?happens?\b/i.test(q),
  };
}
/** The kind of one unit: it holds a number (citation marks aside), or it states a rule. */
export function unitKind(u        )           {
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
export function passageUnits(text        )           {
  const out           = [];
  let cur           = [];
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
export const ALIASES             = [
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
const ALIAS_GROUPS             = ALIASES.map(g => [...new Set(g.map(p => tokens(p).join(" ")).filter(Boolean))]);

/** The other phrases of every alias group a query names (as token phrases). */
export function aliasesOf(q          , groups             = ALIAS_GROUPS)           {
  const joined = ` ${q.join(" ")} `;
  const out           = [];
  for (const g of groups) if (g.some(p => joined.includes(` ${p} `))) for (const p of g) if (!joined.includes(` ${p} `)) out.push(p);
  return out;
}

/**
 * A vertical's owner-words layer (knowledge/<vertical>/synonyms.json): `groups` are terms that mean the same thing
 * (ROAS and return on ad spend), searched as one both ways like ALIASES; `phrases` map how owners say a problem
 * ("people add to cart and leave") to the words experts and cards use ("cart abandonment"), one way only. A
 * vertical with no file searches exactly as before.
 */


function synonymIndex(s                  )                      {
  if (!s || (!s.groups?.length && !s.phrases?.length)) return null;
  const phrase = (p        ) => tokens(p).join(" ");
  return {
    groups: (s.groups ?? []).map(g => [...new Set(g.map(phrase).filter(Boolean))]).filter(g => g.length > 1),
    // An owner phrase matches when all its words are in the query, in any order ("leave after adding to cart").
    phrases: (s.phrases ?? []).map(p => ({ owner: p.owner.map(o => [...new Set(tokens(o))]).filter(o => o.length), expert: [...new Set(p.expert.map(phrase).filter(Boolean))] })).filter(p => p.owner.length && p.expert.length),
  };
}
/** The expert phrases a query's owner words point to, and the other names of the terms it uses (as token phrases). */
export function synonymsOf(q          , s                     )           {
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
export function modulePaths(paths          , modules          )           {
  const codes = new Set(modules.map(m => m.trim().toUpperCase()).filter(Boolean));
  return paths.filter(p => { const m = /^knowledge\/[^/]+\/(?:toolbox\/)?([A-Z]{2,4})\.md$/.exec(p); return !!m && codes.has(m[1]); });
}

/** Reciprocal rank fusion constant (Cormack et al.; lecture 3, slide 50). */
export const RRF_K = 60;
/** Most passages one answer returns: RAG accuracy saturates after 10 to 20 documents (lecture 4). */
export const MAX_PASSAGES = 10;
/** Most passages from one section, so one long section cannot crowd out the rest. */
export const PER_SECTION = 2;
/** Parent methods are bounded separately from ranked passage count; large documents remain explicit excerpts. */
export const MAX_METHOD_CHARS = 12_000;
export const MAX_CONTEXT_CHARS = 32_000;
/** Below this share of the question's informative words in the best passage, the pack is said not to know. */
export const MIN_COVERAGE = 0.34;

/** Explicit clauses are separate evidence needs, not model-generated facts or guessed intent.
 * Keep the original question for ranking; bounded clauses only reserve room for otherwise crowded-out needs.
 * Short noun pairs ("price and availability") stay whole. Never cut decimals, URLs or negation words.
 */
export function questionFacets(question        )           {
  const sentenceParts = question.split(/(?:[;?!](?=\s|$)\s*|\.(?=\s+[A-Z])|\n+)/).map(s => s.trim()).filter(Boolean);
  const clauses = sentenceParts.flatMap(s => {
    const parts = s.split(/\s+(?:and)\s+|,\s+(?=(?:what|which|how|should|can|do|is|are|verify|check|assess|prioriti[sz]e|plan|build|change|judge)\b)/i).map(p => p.trim()).filter(Boolean);
    return parts.length > 1 && parts.every(p => tokens(p).length >= 3) ? parts : [s];
  });
  const seen = new Set        ();
  const result = clauses.filter(p => {
    const key = tokens(p).join(" ");
    if (tokens(p).length < 2 || seen.has(key)) return false;
    seen.add(key); return true;
  }).slice(0, 8);
  return result.length > 1 ? result : [];
}




















export class KnowledgeIndex {
           chunks         ;
          body      ;
          heads              = null;
          units      ;
          unitOf          ;
          unitKind            ;
          glossary                       ;
          sources                        ;
          reviewDays        ;
          citeFiles             ;
          synonyms                     ;
          lines         ;
          methods = new Map                                                                        ();
          methodChunks = new Map                  ();
  /**
   * `sources` resolve the [n] numbers of the files in `citeFiles` (default knowledge.md, whose numbers point to
   * sources.json); other files number their own sources, so their [n] stay as they are.
   */
  constructor(files                                  , opts                                                                                                                                           = {}) {
    this.chunks = files.flatMap(f => chunkMarkdown(f.path, f.text));
    // A short operational method is a coherent parent: its prerequisites, procedure and exceptions travel together.
    for (const f of files) if (/^(?:skills|workflows|prompts)\/.*\.md$/.test(f.path)) {
      const text = f.text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
      this.methods.set(f.path, { ...(text.length <= MAX_METHOD_CHARS ? { text } : {}), characters: text.length, lines: [1, text.split("\n").length] });
    }
    for (const [i, chunk] of this.chunks.entries()) if (this.methods.has(chunk.path)) {
      if (!this.methodChunks.has(chunk.path)) this.methodChunks.set(chunk.path, []);
      this.methodChunks.get(chunk.path) .push(i);
    }
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
          expand(q          )                      {
    const joined = ` ${q.join(" ")} `;
    const out = new Map                ();
    for (const [term, words] of this.glossary) {
      if (!joined.includes(` ${term} `)) continue;
      for (const w of words) if (!q.includes(w)) out.set(w, 0.5);
    }
    if (TUNING.aliases) for (const p of [...aliasesOf(q), ...synonymsOf(q, this.synonyms)]) for (const w of p.split(" ")) if (!q.includes(w)) out.set(w, Math.max(out.get(w) ?? 0, TUNING.aliasWeight));
    return out;
  }

  /** True when the pack holds the word, or every word of one of its aliases ("roas" when only "return on ad spend" is there). */
          knows(w        , has                        )          {
    return has(w) || (TUNING.aliases && [...aliasesOf([w]), ...synonymsOf([w], this.synonyms)].some(p => p.split(" ").every(has)));
  }

  /** Each passage scored by its best unit (passageUnits), over the expanded query. */
          lineScores(q          , weights                     , want          )           {
    const out = new Array        (this.chunks.length).fill(0);
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
          feedback(first          , qt          , weights                     )           {
    const top = first.map((s, i) => [s, i]         ).filter(([s]) => s > 0).sort((a, b) => b[0] - a[0]).slice(0, TUNING.prfDocs);
    const gain = new Map                ();
    for (const [, i] of top) {
      const words = tokens(`${this.chunks[i].context}\n${this.chunks[i].text}`);
      const tf = new Map                ();
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
   * reranks a deeper pool itself, such as job preparation (no automatic parent expansion or final-context cap).
   * `contextChars` explicitly bounds returned source text, independent of k; serialized metadata is extra.
   * `decompose` and `expandMethods` may be disabled for measured legacy comparisons.
   */
  ask(questions                   , opts                                                                                                                                                                                                                                         = {})         {
    const qs = (Array.isArray(questions) ? questions : [questions]).map(s => s.trim()).filter(Boolean);
    const k = Math.max(1, Math.min(opts.max ?? MAX_PASSAGES, opts.k ?? 6));
    if (opts.contextChars !== undefined && (!Number.isInteger(opts.contextChars) || opts.contextChars < 1 || opts.contextChars > MAX_CONTEXT_CHARS)) throw new Error(`contextChars must be an integer from 1 to ${MAX_CONTEXT_CHARS}`);
    // A caller requesting a deeper reranking pool owns its final budget; do not inflate or truncate that pool.
    const candidatePool = (opts.max ?? MAX_PASSAGES) > MAX_PASSAGES;
    const contextLimit = opts.contextChars ?? (candidatePool ? Infinity : MAX_CONTEXT_CHARS);
    const expandMethods = opts.expandMethods ?? !candidatePool;
    // A module filter narrows the search to those modules' files (and any paths given); none found: the whole pack.
    const routed = opts.modules?.length ? modulePaths([...new Set(this.chunks.map(c => c.path))], opts.modules) : [];
    const scope = [...(opts.paths ?? []), ...routed];
    const allowed = scope.length ? new Set(scope) : null;
    const fused = new Map                ();
    const facetQuestions = opts.decompose === false ? [] : [...new Set(qs.flatMap(questionFacets))].slice(0, 8);
    const facetRanks                       = [];
    const qWords = [...new Set(qs.flatMap(tokens))];
    for (const [queryIndex, q] of [...qs, ...facetQuestions].entries()) {
      const queryScores = queryIndex < qs.length ? fused : new Map                ();
      const qt = tokens(q);
      if (!qt.length) continue;
      const exp = this.expand(qt);
      const expQuery = [...qt, ...exp.keys()];
      const weights = new Map                ([...exp, ...qt.map(w => [w, 1]                    )]);
      const first = this.body.scores(qt);
      const rankers                              = [[first, 1], [TUNING.heads ? (this.heads ??= new Bm25(this.chunks.map(c => tokens(c.context)))).scores(qt) : null, 1], [TUNING.glossary && exp.size ? this.body.scores(expQuery, weights) : null, 1]];
      if (TUNING.prf > 0) rankers.push([this.feedback(first, qt, weights), 1]);
      if (this.lines) rankers.push([this.lineScores(expQuery, weights, questionKind(q)), TUNING.lineWeight]);
      for (const [scores, w] of rankers) {
        if (!scores) continue;
        const order = scores.map((s, i) => [s, i]         ).filter(([s, i]) => s > 0 && (!allowed || allowed.has(this.chunks[i].path))).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
        order.forEach(([, i], rank) => queryScores.set(i, (queryScores.get(i) ?? 0) + w / (RRF_K + rank + 1)));
      }
      if (queryIndex >= qs.length) {
        const adjustedFacet = opts.adjust ? [...queryScores].flatMap(([i, s]) => { const v = opts.adjust (this.chunks[i], s); return v === null ? [] : [[i, v]                    ]; }) : [...queryScores];
        facetRanks.push(adjustedFacet.sort((a, b) => b[1] - a[1] || a[0] - b[0]));
      }
    }
    const adjusted = opts.adjust ? [...fused].flatMap(([i, s]) => { const v = opts.adjust (this.chunks[i], s); return v === null ? [] : [[i, v]                    ]; }) : [...fused];
    const ranked = adjusted.sort((a, b) => b[1] - a[1] || a[0] - b[0]);
    const perSection = new Map                ();
    const pickedPaths = new Set        ();
    const picked                     = [];
    const expanded = new Set        ();
    const excludedParents = new Set        ();
    let contextCharacters = 0;
    let contextExhausted = false;
    const pick = ([i, s]                  )          => {
      if (picked.length >= k || picked.some(([previous]) => previous === i)) return false;
      const c = this.chunks[i];
      if ((opts.uniquePath || expanded.has(c.path)) && pickedPaths.has(c.path)) return false;
      const key = `${c.path}#${c.context}`;
      if ((perSection.get(key) ?? 0) >= PER_SECTION) return false;
      if (contextCharacters + c.text.length > contextLimit) { contextExhausted = true; return false; }
      contextCharacters += c.text.length;
      perSection.set(key, (perSection.get(key) ?? 0) + 1);
      picked.push([i, s]); pickedPaths.add(c.path); return true;
    };
    // Keep the strongest whole-question match first, then give each explicit need one turn before filling.
    if (ranked.length) pick(ranked[0]);
    for (const ranking of facetRanks) {
      if (ranking[0] && picked.some(([previous]) => previous === ranking[0][0])) continue;
      for (const candidate of ranking) if (pick(candidate)) break;
    }
    for (const candidate of ranked) { if (picked.length >= k) break; pick(candidate); }
    // Reserve all selected evidence first. Expanding one method must not evict another question's evidence.
    for (let round = 0; expandMethods && round < k; round++) {
      let changed = false;
      for (const path of [...pickedPaths]) {
        if (expanded.has(path)) continue;
        const parent = this.methods.get(path);
        if (!parent?.text) continue;
        // Metadata filters can exclude individual sections, not only whole files. Never reintroduce those
        // sections by expanding a matching sibling. Unranked children are checked at score zero as well.
        if (opts.adjust && this.methodChunks.get(path) .some(i => opts.adjust (this.chunks[i], fused.get(i) ?? 0) === null)) {
          excludedParents.add(path); continue;
        }
        const fromPath = picked.filter(([i]) => this.chunks[i].path === path);
        const delta = parent.characters - fromPath.reduce((n, [i]) => n + this.chunks[i].text.length, 0);
        if (contextCharacters + delta > contextLimit) continue;
        expanded.add(path); contextCharacters += delta; changed = true;
        const keep = fromPath[0][0];
        for (let n = picked.length - 1; n >= 0; n--) if (this.chunks[picked[n][0]].path === path && picked[n][0] !== keep) picked.splice(n, 1);
      }
      if (!changed) break;
      // A complete method may replace several excerpts; spare space can retrieve additional distinct evidence.
      for (const candidate of ranked) { if (picked.length >= k) break; pick(candidate); }
    }
    const informative = qWords.filter(w => this.body.idf(w) > 0.2);
    const has = (i        ) => new Set(tokens(`${this.chunks[i].context}\n${expanded.has(this.chunks[i].path) ? this.methods.get(this.chunks[i].path) .text : this.chunks[i].text}`));
    const bestWords = picked.length ? has(picked[0][0]) : new Set        ();
    const coverage = informative.length ? informative.filter(w => this.knows(w, x => bestWords.has(x))).length / informative.length : 0;
    const anywhere = new Set(picked.flatMap(([i]) => [...has(i)]));
    const passages            = picked.map(([i, score]) => {
      const c = this.chunks[i];
      const words = has(i);
      const parent = expandMethods ? this.methods.get(c.path) : undefined;
      const context = parent ? expanded.has(c.path)
        ? { text: parent.text , lines: parent.lines, context_expansion: { mode: "full_method"          } }
        : { context_expansion: { mode: "excerpt"         , reason: excludedParents.has(c.path) ? "method_contains_excluded_evidence" : parent.characters > MAX_METHOD_CHARS ? "method_exceeds_source_budget" : "method_context_budget_exhausted" } }
        : {};
      return { ...c, ...context, score: Math.round(score * 10000) / 10000, matched: qWords.filter(w => words.has(w)), cites: this.citeFiles.has(c.path) ? (expanded.has(c.path) ? citesOf(parent .text ) : c.cites).map(n => this.cite(n, opts.today)).filter((x)                 => !!x) : [] };
    });
    // A name the question depends on (an acronym, a law, a brand, a tool) that appears nowhere in the pack means the
    // pack does not know, however many other words match: "GST on shipping" must not be answered from an Amazon card.
    const unknown = [...new Set(qs.flatMap(namesIn))].filter(w => !this.knows(w, x => this.body.has(x)));
    const facets = facetQuestions.map(question => {
      const words = [...new Set(tokens(question))].filter(w => this.body.idf(w) > 0.2);
      const matches = picked.map(([i]) => ({ id: this.chunks[i].id, coverage: words.length ? words.filter(w => this.knows(w, x => has(i).has(x))).length / words.length : 0 }));
      return { question, coverage: Math.round(Math.max(0, ...matches.map(m => m.coverage)) * 100) / 100,
        matched_passages: matches.filter(m => m.coverage >= MIN_COVERAGE).map(m => m.id),
        missing: words.filter(w => !this.knows(w, x => anywhere.has(x))) };
    });
    return { question: qs.join(" | "), passages, coverage: Math.round(coverage * 100) / 100,
      enough: coverage >= MIN_COVERAGE && !unknown.length && facets.every(f => f.coverage >= MIN_COVERAGE),
      missing: [...new Set([...unknown, ...informative.filter(w => !this.knows(w, x => anywhere.has(x)))])],
      ...(facets.length ? { facets } : {}), ...(Number.isFinite(contextLimit) ? { context_budget: { limit: contextLimit, used: contextCharacters, exhausted: contextExhausted } } : {}) };

  }

          cite(n        , today         )                   {
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
export function namesIn(question        )           {
  const out           = [];
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

function daysBetween(a        , b        )         {
  const t = (d        ) => Date.parse(`${d.slice(0, 10)}T00:00:00Z`);
  const x = t(a), y = t(b);
  return Number.isFinite(x) && Number.isFinite(y) ? Math.round((y - x) / 86_400_000) : 0;
}

/**
 * The files of a pack the knowledge index covers: what the agent opens on demand. The always-loaded core (AGENTS.md,
 * WORK-METHOD.md and the rest), the about files, skills.md (a copy of skills/) and the training logs stay out.
 */
export function indexedPath(path        )          {
  if (!path.endsWith(".md")) return false;
  if (/^(README|AGENTS|CLAUDE|LICENSE|CHANGELOG|WORK-METHOD|skills|soul|personality|QUALITY-METHOD|toolbox|knowledge-map|sources|library|access|LICENSE)\.md$/.test(path)) return false;
  if (/^(context|training|examples|\.agents|\.claude)\//.test(path)) return false;
  if (/^tools\/(?!quality\/cards\/)/.test(path)) return false;
  return true;
}

/** Render an answer as plain text for a chat: each passage with its place, then its sources. */
export function answerText(a        , agentName        )         {
  if (!a.passages.length) return `${agentName}'s pack has nothing on this. Say so, then ask the client or research it (WORK-METHOD.md step 1). Do not answer from memory as if it were the pack's knowledge.`;
  const head = a.enough
    ? `${a.passages.length} passage${a.passages.length === 1 ? "" : "s"} from ${agentName}'s pack, best first. Use only what they say; cite the sources shown.`
    : `Weak match: the best passage covers ${Math.round(a.coverage * 100)}% of the question${a.missing.length ? ` (nothing on: ${a.missing.slice(0, 8).join(", ")})` : ""}. Treat this as not in the pack: ask the client or research it, and say which.`;
  const body = a.passages.map((p, i) => {
    const src = p.cites.length ? `\nSources: ${p.cites.map(c => `[${c.n}] ${c.title}, checked ${c.checked}${c.stale ? " (STALE: recheck before use)" : ""} ${c.url}`).join("; ")}` : "";
    return `--- ${i + 1}. ${p.path}:${p.lines[0]}-${p.lines[1]} | ${p.context} ---\n${p.context_expansion?.mode === "full_method" ? "[Complete bounded method: prerequisites, steps and exceptions retained]\n" : p.context_expansion?.mode === "excerpt" ? p.context_expansion.reason === "method_contains_excluded_evidence" ? "[Excerpt only; excluded source sections remain unavailable]\n" : "[Excerpt only; read the full method for omitted steps and exceptions]\n" : ""}${p.text}${src}`;
  }).join("\n\n");
  const diagnostics = a.facets?.length
    ? `\nEvidence needs: ${a.facets.map(f => `${f.question}: ${f.matched_passages.length ? "lexical match found" : "no sufficient lexical match"}`).join("; ")}. Lexical coverage is not proof that every needed fact or qualification is supported.` : "";
  const limits = a.context_budget?.exhausted ? "\nContext budget exhausted: refine the unresolved need or read the cited full source before answering it." : "";
  return `${head}${diagnostics}${limits}\n\n${body}`;
}

/**
 * knowledge-map.md: every passage's id, place and heading trail in one compact list, for chat apps that cannot run
 * the tool. The AI reads the map, then jumps to the sections it needs instead of reading every file in full (the
 * static form of a hierarchical index).
 */
export function knowledgeMap(index                                , agentName        , withTool = true, budgetWords = 1_800)         {
  const byFile = new Map                 ();
  for (const c of index.chunks) { if (!byFile.has(c.path)) byFile.set(c.path, []); byFile.get(c.path) .push(c); }
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
export function parseSourcesMd(md        )              {
  const out              = [];
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
export function knowledgeExcerpt(md        , request        , budget        )                                            {
  const index = new KnowledgeIndex([{ path: "knowledge.md", text: md }]);
  const ranked = index.ask(request, { k: MAX_PASSAGES }).passages.map(p => index.chunks.find(c => c.id === p.id) )
    // The preamble under the title (dates, how to read the file) is not knowledge a job needs.
    .filter(c => c.context.includes(" > "));
  const steering = [...new Set(index.chunks.filter(c => STEERING.test(c.context)).map(c => c.context))]
    .filter(ctx => !ranked.some(r => r.context === ctx))
    .map(ctx => index.chunks.find(c => c.context === ctx) );
  const picked          = [];
  let used = 0;
  for (const c of [...ranked.slice(0, 3), ...steering, ...ranked.slice(3)]) {
    if (used + c.text.length > budget) continue;
    picked.push(c);
    used += c.text.length + c.context.length + 8;
  }
  const order = new Map(index.chunks.map((c, i) => [c.id, i]));
  picked.sort((a, b) => order.get(a.id)  - order.get(b.id) );
  return { passages: picked, headings: [...new Set(picked.map(c => c.heading || c.context))] };
}

// ---------- Command line ----------

async function main(argv) {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const started = Date.now();
  const args = { q: [], k: null, json: false, in: [], modules: [], pack: null, all: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--k") args.k = Number(argv[++i]);
    else if (a === "--json") args.json = true;
    else if (a === "--in") args.in.push(argv[++i]);
    else if (a === "--module" || a === "--modules") { const value = argv[++i]; if (!value || value.startsWith("--")) throw new Error("--module needs module codes."); args.modules.push(...value.split(",")); }
    else if (a === "--all") args.all = true;
    else if (a === "--pack") args.pack = argv[++i];
    else if (a === "-h" || a === "--help") { console.log(HELP); return 0; }
    else args.q.push(a);
  }
  if (!args.q.length || args.k !== null && (!Number.isInteger(args.k) || args.k < 1 || args.k > 10)) { console.error(HELP); return 2; }
  if (args.all && (args.in.length || args.modules.length)) throw new Error("Use --all separately from --in or --module.");
  const here = path.dirname(fileURLToPath(import.meta.url));
  const pack = fs.realpathSync(path.resolve(args.pack ?? (fs.existsSync(path.join(here, "..", "AGENTS.md")) ? path.join(here, "..") : process.cwd())));
  const relative = p => typeof p === "string" && p.length > 0 && !p.includes("\\") && !p.includes(":") && !path.isAbsolute(p) && p.split("/").every(x => x && x !== "." && x !== ".." && !x.startsWith("."));
  const safePath = rel => {
    if (!relative(rel)) throw new Error("Pack paths must be relative and stay inside this pack.");
    let file = pack;
    for (const part of rel.split("/")) { file = path.join(file, part); if (fs.lstatSync(file).isSymbolicLink()) throw new Error("Pack source links are not followed."); }
    return file;
  };
  let metadata = {};
  try { metadata = JSON.parse(fs.readFileSync(path.join(pack, "pack.json"), "utf8")); } catch {}
  const paths = [];
  // Enumerate metadata first. Download manifests prevent output/ and other job
  // artifacts from accidentally becoming the agent's method knowledge.
  if (Array.isArray(metadata.files)) {
    for (const item of metadata.files) if (relative(item.path) && indexedPath(item.path)) {
      const file = safePath(item.path); if (fs.statSync(file).isFile()) paths.push(item.path);
    }
  } else {
    const walk = rel => {
      for (const entry of fs.readdirSync(path.join(pack, rel), { withFileTypes: true }).sort((a,b)=>a.name.localeCompare(b.name))) {
        if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.isSymbolicLink()) continue;
        const r = rel ? rel + "/" + entry.name : entry.name;
        if (entry.isDirectory()) walk(r);
        else if (entry.isFile() && indexedPath(r)) paths.push(r);
      }
    };
    walk("");
  }
  const allPaths = [...new Set(paths)].sort();
  if (!allPaths.length) { console.error("No pack files found. Run this from the agent's folder, or pass --pack <folder>."); return 2; }
  for (const p of args.in) if (!relative(p)) throw new Error("--in needs a valid pack-relative file path.");
  const modules = [...new Set(args.modules.map(m => m.trim().toUpperCase()).filter(Boolean))];
  if (modules.some(m => !/^[A-Z]{2,4}$/.test(m))) throw new Error("--module needs comma-separated module codes.");
  let role = null;
  const roleFile = path.join(pack, "role-context.json");
  if (!args.all && !args.in.length && !modules.length && fs.existsSync(roleFile)) {
    try { role = JSON.parse(fs.readFileSync(safePath("role-context.json"), "utf8")); } catch { throw new Error("role-context.json is unreadable or malformed; inspect it or explicitly use --all."); }
    const validCodes = (x, empty = false) => Array.isArray(x) && (empty || x.length > 0) && x.length <= 40 && new Set(x).size === x.length && x.every(m => typeof m === "string" && /^[A-Z]{2,4}$/.test(m));
    if (role.schema !== "ecommerce-role-context/1" || typeof role.agent_id !== "string" || !role.agent_id || !validCodes(role.primary_modules) || role.constraint_modules !== undefined && !validCodes(role.constraint_modules, true) || metadata.agent_id && metadata.agent_id !== role.agent_id) throw new Error("role-context.json has invalid identity or modules; inspect it or explicitly use --all.");
  }
  const k = args.k ?? (role ? 5 : 6);
  const sourcesFile = path.join(pack, "sources.md");
  const sources = fs.existsSync(sourcesFile) ? parseSourcesMd(fs.readFileSync(sourcesFile, "utf8")) : [];
  const reviewDays = metadata.knowledge?.review_every_days ?? 0;
  const synonyms = { groups: [], phrases: [] };
  const lib = path.join(pack, "knowledge");
  if (fs.existsSync(lib)) for (const v of fs.readdirSync(lib)) {
    const rel = "knowledge/" + v + "/synonyms.json";
    if (relative(rel) && fs.existsSync(path.join(pack, rel))) { try { const s = JSON.parse(fs.readFileSync(safePath(rel), "utf8")); synonyms.groups.push(...(s.groups ?? [])); synonyms.phrases.push(...(s.phrases ?? [])); } catch {} }
  }
  const loaded = new Map(); let bytesRead = 0;
  const readPaths = selected => {
    for (const rel of selected) if (!loaded.has(rel)) {
      const bytes = fs.readFileSync(safePath(rel));
      const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
      loaded.set(rel, { path: rel, text }); bytesRead += bytes.length;
    }
    return selected.map(p => loaded.get(p));
  };
  const baseline = p => /^(knowledge\.md|playbook\.md)$/.test(p) || /^(skills|prompts|workflows|toolbox)\//.test(p) || /^tools\/quality\/cards\//.test(p) || /^knowledge\/[^/]+\/(?:baseline|toolkit|store-kit)\.md$/.test(p);
  let mode = args.all ? "all" : role ? "role" : modules.length || args.in.length ? "explicit" : "legacy_all";
  let selected = allPaths, fallbackReason = null;
  const explicitRequested = [...new Set([...args.in, ...modulePaths(allPaths, modules)])];
  if (mode === "explicit") selected = allPaths.filter(p => explicitRequested.includes(p));
  if (role) selected = [...new Set([...allPaths.filter(baseline), ...modulePaths(allPaths, role.primary_modules)])].sort();
  readPaths(selected);
  if (role) {
    // Selected module toolboxes name their full skills. Follow those explicit
    // references; do not read every unrelated vertical skill just to build an index.
    const linked = new Set();
    for (const rel of selected.filter(p => /^knowledge\/[^/]+\/toolbox\/[A-Z]{2,4}\.md$/.test(p))) {
      for (const match of loaded.get(rel).text.matchAll(/\x60([^\x60\r\n]+\.md)\x60/g)) if (allPaths.includes(match[1])) linked.add(match[1]);
    }
    selected = [...new Set([...selected, ...linked])].sort(); readPaths(selected);
  }
  const ask = selectedPaths => new KnowledgeIndex(readPaths(selectedPaths), { sources, reviewDays, synonyms }).ask(args.q, { k, today: new Date().toISOString().slice(0,10), distinct: true });
  let answer = ask(selected);
  const initial = { indexed_files: selected.length, passages: answer.passages.length, enough: answer.enough, modules: role?.primary_modules ?? modules };
  if (role && (!answer.enough || !answer.passages.length) && selected.length < allPaths.length) {
    fallbackReason = modulePaths(allPaths, role.primary_modules).length ? "role_scope_weak_or_empty" : "role_modules_unavailable";
    selected = allPaths; answer = ask(selected); mode = "role_fallback_all";
  }
  answer.retrieval_scope = {
    mode, agent_id: role?.agent_id ?? metadata.agent_id ?? null, requested_modules: role?.primary_modules ?? modules,
    searched_modules: [...new Set(selected.map(p => /^knowledge\/[^/]+\/(?:toolbox\/)?([A-Z]{2,4})\.md$/.exec(p)?.[1]).filter(Boolean))],
    missing_requested_modules: (role?.primary_modules ?? modules).filter(m => !modulePaths(allPaths, [m]).length),
    explicit_paths: args.in, missing_explicit_paths: args.in.filter(p=>!allPaths.includes(p)),
    fallback_reason: fallbackReason, initial, available_indexed_files: allPaths.length,
    indexed_files: selected.length, files_read: loaded.size, source_bytes_read: bytesRead, elapsed_ms: Date.now()-started,
    read_paths: [...loaded.keys()].sort(),
    assurance: "Reference curation, not authorization or proof of exhaustive relevant evidence. Counts cover indexed source bodies, not manifests, synonyms or citation metadata. Role defaults search primary modules plus current role methods; constraint modules expand only through explicit requests or visible weak-result fallback."
  };
  const name = metadata.name || "this agent";
  if (args.json) console.log(JSON.stringify(answer, null, 2));
  else {
    console.log(mode === "explicit" && !answer.passages.length ? "No supporting passage found in the explicitly selected files/modules. This does not establish that the whole pack lacks the evidence." : answerText(answer, name));
    console.log("\nSearch scope: " + mode + "; " + loaded.size + "/" + allPaths.length + " files read; " + bytesRead + " source bytes; modules " + (answer.retrieval_scope.searched_modules.join(", ") || "none") + (fallbackReason ? "; fallback: " + fallbackReason : "") + ".");
    if (answer.retrieval_scope.missing_explicit_paths.length) console.log("Requested paths absent: " + answer.retrieval_scope.missing_explicit_paths.join(", "));
  }
  try { const { logEvent } = await import("./log-event.mjs"); logEvent({ tool: "ask-knowledge", cmd: "ask", args: argv, inputs: [], result: "PASS", counts: { passages: answer.passages.length, enough: answer.enough ? 1 : 0, source_files: loaded.size, source_bytes: bytesRead } }); } catch {}
  return 0;
}

const HELP = 'Usage: node tools/ask-knowledge.mjs "<question>" ["<another phrasing>" ...] [--k 1..10] [--in <file>] [--module CODE,CODE | --all] [--json] [--pack <folder>]. A valid role-context.json defaults to its primary modules and 5 passages; legacy packs keep all-file search and 6. Weak role results visibly expand to the full public pack; explicit --in/--module never silently widens.';

const invoked = typeof process !== "undefined" && !!process.argv?.[1] && (await import("node:path")).resolve(process.argv[1]).toLowerCase() === (await import("node:url")).fileURLToPath(import.meta.url).toLowerCase();
if (invoked) { try { process.exitCode = await main(process.argv.slice(2)); } catch(error) { console.error("ask-knowledge: " + error.message); process.exitCode = 2; } }
