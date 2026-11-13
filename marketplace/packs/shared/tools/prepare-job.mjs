#!/usr/bin/env node
// prepare-job.mjs: read the brief once and put the library cards this job needs in front of you, before drafting.
// Plain Node 18 or later, no dependencies, no network, nothing sent anywhere. Run it from the pack folder:
//
//   node tools/prepare-job.mjs context/brief.md
//   node tools/prepare-job.mjs "We sell cotton bedsheets in India on Shopify. Write a 5-email win-back series..."
//   node tools/prepare-job.mjs context/brief.md --k 20 --json
//
// It reads what the brief asks for and what its data says (the standout row of each table, the biggest item of each
// list of shares, the funnel step that drops most), searches the pack's library once per request and signal, keeps
// only cards for this market, marketplace and store platform, ranks them, drops near-duplicates and lists gaps. It
// writes the digest to context/knowledge-brief.md and adds its lookups to context/trace.md. Use a card only where its
// "holds when" fits; check its "fails when". Card ids stay in your notes, never in the deliverable.
//
// Generated from the AI Blocks marketplace (src/modules/knowledge/prepare.ts by scripts/gen-prepare-job.mjs).
// Do not edit by hand.

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
//   glossary expansion, the cheap answer to sparse search missing synonyms, with no embeddings and no model.
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
          docs           ;
          df = new Map                ();
          avg        ;
          k1 = 1.2;
          b = 0.75;
  constructor(texts            ) {
    this.docs = texts.map(t => { const tf = new Map                (); for (const w of t) tf.set(w, (tf.get(w) ?? 0) + 1); return { len: t.length, tf }; });
    for (const d of this.docs) for (const w of d.tf.keys()) this.df.set(w, (this.df.get(w) ?? 0) + 1);
    this.avg = this.docs.reduce((a, d) => a + d.len, 0) / Math.max(1, this.docs.length) || 1;
  }
  idf(w        )         { const n = this.docs.length, df = this.df.get(w) ?? 0; return Math.log(1 + (n - df + 0.5) / (df + 0.5)); }
  has(w        )          { return this.df.has(w); }
  scores(query          , weights                      )           {
    const q = [...new Set(query)];
    return this.docs.map(d => {
      let s = 0;
      for (const w of q) {
        const f = d.tf.get(w);
        if (!f) continue;
        s += (weights?.get(w) ?? 1) * this.idf(w) * (f * (this.k1 + 1)) / (f + this.k1 * (1 - this.b + this.b * d.len / this.avg));
      }
      return s;
    });
  }
}

/**
 * Ranker settings, chosen on the 75-question golden set (scripts/eval-retrieval.mjs, 13 Nov 2026): heading ranker
 * off (Hit@5 0.44 with it, 0.71 without), feedback off (MRR 0.56 without, at most 0.54 with), glossary on (MRR 0.56
 * with, 0.54 without). Chunks of about 180 words beat 60, 90, 120 and 260.
 */
export const TUNING = { heads: false, prf: 0, prfDocs: 3, prfWeight: 0.3, glossary: true, aliases: true, aliasWeight: 0.7 };

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
export function aliasesOf(q          )           {
  const joined = ` ${q.join(" ")} `;
  const out           = [];
  for (const g of ALIAS_GROUPS) if (g.some(p => joined.includes(` ${p} `))) for (const p of g) if (!joined.includes(` ${p} `)) out.push(p);
  return out;
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
/** Below this share of the question's informative words in the best passage, the pack is said not to know. */
export const MIN_COVERAGE = 0.34;

export class KnowledgeIndex {
           chunks         ;
          body      ;
          heads      ;
          glossary                       ;
          sources                        ;
          reviewDays        ;
          citeFiles             ;
  /**
   * `sources` resolve the [n] numbers of the files in `citeFiles` (default knowledge.md, whose numbers point to
   * sources.json); other files number their own sources, so their [n] stay as they are.
   */
  constructor(files                                  , opts                                                                                              = {}) {
    this.chunks = files.flatMap(f => chunkMarkdown(f.path, f.text));
    this.citeFiles = new Set(opts.citeFiles ?? ["knowledge.md"]);
    // The situating context counts once in the body ranker and alone in the heading ranker.
    this.body = new Bm25(this.chunks.map(c => tokens(`${c.context}\n${c.text}`)));
    this.heads = new Bm25(this.chunks.map(c => tokens(c.context)));
    const gloss = opts.glossaryFrom ?? files.find(f => f.path === "knowledge.md")?.text ?? "";
    this.glossary = glossaryOf(gloss);
    this.sources = new Map((opts.sources ?? []).filter(s => s && Number.isFinite(s.n)).map(s => [s.n, s]));
    this.reviewDays = opts.reviewDays ?? 0;
  }

  /** The query's glossary expansion: definition words of every glossary term the query names, at half weight. */
          expand(q          )                      {
    const joined = ` ${q.join(" ")} `;
    const out = new Map                ();
    for (const [term, words] of this.glossary) {
      if (!joined.includes(` ${term} `)) continue;
      for (const w of words) if (!q.includes(w)) out.set(w, 0.5);
    }
    if (TUNING.aliases) for (const p of aliasesOf(q)) for (const w of p.split(" ")) if (!q.includes(w)) out.set(w, Math.max(out.get(w) ?? 0, TUNING.aliasWeight));
    return out;
  }

  /** True when the pack holds the word, or every word of one of its aliases ("roas" when only "return on ad spend" is there). */
          knows(w        , has                        )          {
    return has(w) || (TUNING.aliases && aliasesOf([w]).some(p => p.split(" ").every(has)));
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
   * or drop it (null) before the top k are picked.
   */
  ask(questions                   , opts                                                                                                                                = {})         {
    const qs = (Array.isArray(questions) ? questions : [questions]).map(s => s.trim()).filter(Boolean);
    const k = Math.max(1, Math.min(MAX_PASSAGES, opts.k ?? 6));
    // A module filter narrows the search to those modules' files (and any paths given); none found: the whole pack.
    const routed = opts.modules?.length ? modulePaths([...new Set(this.chunks.map(c => c.path))], opts.modules) : [];
    const scope = [...(opts.paths ?? []), ...routed];
    const allowed = scope.length ? new Set(scope) : null;
    const fused = new Map                ();
    const qWords = [...new Set(qs.flatMap(tokens))];
    for (const q of qs) {
      const qt = tokens(q);
      if (!qt.length) continue;
      const exp = this.expand(qt);
      const expQuery = [...qt, ...exp.keys()];
      const weights = new Map                ([...exp, ...qt.map(w => [w, 1]                    )]);
      const first = this.body.scores(qt);
      const rankers = [first, TUNING.heads ? this.heads.scores(qt) : null, TUNING.glossary && exp.size ? this.body.scores(expQuery, weights) : null];
      if (TUNING.prf > 0) rankers.push(this.feedback(first, qt, weights));
      for (const scores of rankers) {
        if (!scores) continue;
        const order = scores.map((s, i) => [s, i]         ).filter(([s, i]) => s > 0 && (!allowed || allowed.has(this.chunks[i].path))).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
        order.forEach(([, i], rank) => fused.set(i, (fused.get(i) ?? 0) + 1 / (RRF_K + rank + 1)));
      }
    }
    const adjusted = opts.adjust ? [...fused].flatMap(([i, s]) => { const v = opts.adjust (this.chunks[i], s); return v === null ? [] : [[i, v]                    ]; }) : [...fused];
    const ranked = adjusted.sort((a, b) => b[1] - a[1] || a[0] - b[0]);
    const perSection = new Map                ();
    const picked                     = [];
    for (const [i, s] of ranked) {
      const c = this.chunks[i];
      const key = `${c.path}#${c.context}`;
      if ((perSection.get(key) ?? 0) >= PER_SECTION) continue;
      perSection.set(key, (perSection.get(key) ?? 0) + 1);
      picked.push([i, s]);
      if (picked.length >= k) break;
    }
    const informative = qWords.filter(w => this.body.idf(w) > 0.2);
    const has = (i        ) => new Set(tokens(`${this.chunks[i].context}\n${this.chunks[i].text}`));
    const bestWords = picked.length ? has(picked[0][0]) : new Set        ();
    const coverage = informative.length ? informative.filter(w => this.knows(w, x => bestWords.has(x))).length / informative.length : 0;
    const anywhere = new Set(picked.flatMap(([i]) => [...has(i)]));
    const passages            = picked.map(([i, score]) => {
      const c = this.chunks[i];
      const words = has(i);
      return { ...c, score: Math.round(score * 10000) / 10000, matched: qWords.filter(w => words.has(w)), cites: this.citeFiles.has(c.path) ? c.cites.map(n => this.cite(n, opts.today)).filter((x)                 => !!x) : [] };
    });
    // A name the question depends on (an acronym, a law, a brand, a tool) that appears nowhere in the pack means the
    // pack does not know, however many other words match: "GST on shipping" must not be answered from an Amazon card.
    const unknown = [...new Set(qs.flatMap(namesIn))].filter(w => !this.knows(w, x => this.body.has(x)));
    return { question: qs.join(" | "), passages, coverage: Math.round(coverage * 100) / 100, enough: coverage >= MIN_COVERAGE && !unknown.length, missing: [...new Set([...unknown, ...informative.filter(w => !this.knows(w, x => anywhere.has(x)))])] };
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
    return `--- ${i + 1}. ${p.path}:${p.lines[0]}-${p.lines[1]} | ${p.context} ---\n${p.text}${src}`;
  }).join("\n\n");
  return `${head}\n\n${body}`;
}

/**
 * knowledge-map.md: every passage's id, place and heading trail in one compact list, for chat apps that cannot run
 * the tool. The AI reads the map, then jumps to the sections it needs instead of reading every file in full (the
 * static form of a hierarchical index).
 */
export function knowledgeMap(index                , agentName        , withTool = true, budgetWords = 1_800)         {
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

// Prepare a job: turn a whole brief into the few library cards an expert would want in front of them, in one call.
//
// Agents told to "look it up once per signal" ran about two lookups a job (owner bench, round 2, 13 Nov 2026), so the
// lookup is one tool that does the reading for them, cheaply: no model, no network, under a second on 900 cards.
// Design, from Stanford CS329Z lecture 3 (RAG) and lecture 6 (context engineering):
// - Query planning: the brief is split into what it asks for (each request sentence) and what its data says (the
//   standout rows of every table and the lines that rank or share something), each its own query, plus the whole
//   brief as one long query. Rankings fuse by reciprocal rank (multi-query retrieval).
// - Metadata filters: market, Amazon marketplace and store platform are read from the brief, and a card written for
//   another market or marketplace never comes back (CardIndex.fits, on the card's own facets).
// - Doc-side expansion: each card is indexed with the questions it answers ("Asked as"), so a brief in an owner's
//   words meets a card in an expert's words (doc2query, done once when the card was written).
// - Rerank: a light boost when the card's "holds when" shares the brief's words, and when several queries agree.
// - Diversity: near-duplicate cards are dropped (maximal marginal relevance, by word overlap), so the digest has range.
// - Gaps: a request or signal no card covers well is listed as a gap: decide it from the brief, never from memory.
// - Budget: the digest is a short ranked list of claims with when each holds and fails, about a thousand words,
//   because accuracy saturates after 10 to 20 documents and what sits in the middle gets lost.

/** Cards from the module files a pack carries (knowledge/<vertical>/<CODE>.md, written by cards.ts moduleMarkdown). */
export function cardsFromModuleMarkdown(code        , md        )             {
  const out             = [];
  for (const block of md.replace(/\r\n?/g, "\n").split(/^## /m).slice(1)) {
    const claim = block.split("\n")[0].trim();
    const head = /^Card ([A-Z]{2,4}-\d{4})\. Tier (\d), (baseline|growth)(?:, (.*?))?\.$/m.exec(block);
    if (!head) continue;
    const facets = (head[4] ?? "").split("; ").map(s => s.trim()).filter(Boolean);
    const markets           = [], amazon           = [], platforms           = [];
    let mode = "";
    for (const f of facets) {
      if (f.startsWith("market ")) markets.push(...f.slice(7).split(", "));
      else if (f.startsWith("Amazon ")) amazon.push(...f.slice(7).split(", "));
      else if (/^(dtc first|amazon first|new product|expansion|both)$/.test(f)) mode = f.replace(/ /g, "_");
      else platforms.push(...f.split(", "));
    }
    const field = (name        ) => new RegExp(`^\\*\\*${name}:\\*\\* (.*)$`, "m").exec(block)?.[1].trim() ?? "";
    const body = block.split("\n").slice(1).join("\n");
    const text = body.split(/\n\*\*(?:Holds when|Fails when|Numbers|Asked as|Source):\*\*/)[0].replace(/^Card .*$/m, "").trim();
    out.push({ id: head[1], module: code, claim, text, holds: field("Holds when"), fails: field("Fails when"), asks: field("Asked as"),
      tier: Number(head[2]), scope: head[3], markets, amazon, mode, platforms: platforms.map(p => p.toLowerCase()) });
  }
  return out;
}

const has = (re        , s        ) => re.test(s);

/** What the brief says about market, marketplace, platform and model. Unsure stays unset: a filter only acts on a clear fact. */
export function briefFacts(brief        )             {
  const india = has(/₹|\bINR\b|\bRs\.?\s?\d|\bIndia(n)?\b|\blakhs?\b|\bcrores?\b|\bpincodes?\b|Shiprocket|Delhivery|Razorpay|\bUPI\b|Flipkart|Meesho|Nykaa|Amazon\.in/i, brief);
  const us = has(/\$\s?\d|\bUSD\b|United States|\bU\.?S\.?A?\b(?!-)|\bAmerican\b|Amazon\.com\b/, brief);
  const uk = has(/£\s?\d|\bGBP\b|United Kingdom|\bUK\b|Amazon\.co\.uk/, brief);
  const eu = has(/€\s?\d|\bEUR\b|\bEU\b|Europe(an)?\b/, brief);
  const markets = [india && "IN", us && "US", uk && "UK", eu && "EU"].filter(Boolean)            ;
  const market = markets.length === 1 ? markets[0] : undefined;
  const amazon = has(/\bAmazon\b/i, brief) ? (has(/Amazon\.in\b/i, brief) ? "IN" : has(/Amazon\.com\b/i, brief) ? "US" : market) : undefined;
  const platform = has(/WooCommerce/i, brief) ? "woocommerce" : has(/Shopify/i, brief) ? "shopify" : undefined;
  const channels = [["meta", /\b(Meta|Facebook|Instagram|Reels?)\b/i], ["tiktok", /TikTok/i], ["google", /\bGoogle\b|Performance Max|\bPMax\b|YouTube/i],
    ["email", /\bemails?\b|Klaviyo|newsletter/i], ["sms", /\bSMS\b|text message/i], ["whatsapp", /WhatsApp/i], ["amazon", /\bAmazon\b/i]]
    .filter(([, re]) => (re          ).test(brief)).map(([c]) => c          );
  return { market, amazon, platform, cod: has(/\bCOD\b|cash on delivery/i, brief), subscription: has(/subscri(be|ption)/i, brief), channels };
}

/** A request: a work verb leads, or "I/we want/need", "help me", "can you", or a real question (not a quoted one). */
const ASK = /^(?:please\s+)?(?:write|draft|create|build|plan|design|give|recommend|decide|fix|audit|set up|propose|suggest|prioriti[sz]e|rewrite|improve|find|choose|pick|tell|show|map|lay out|put together|make|turn|outline|forecast|allocate|split|cut|scale|launch|structure)\b|\b(?:i|we)(?:'d| would)?\s+(?:want|need|like)\b|\bhelp (?:me|us)\b|\b(?:can|could) you\b|^(?:how|what|which|should|where|when)\b[^"]*\?$|^(?:deliverable|the job|the ask|task|what i need)\b/i;
const NOT_ASK = /test inputs?|not the brand's|for this exercise/i;
const sentencesOf = (s        ) => s.replace(/\r\n?/g, "\n").split(/\n+|(?<=[.!?])\s+(?=[A-Z])/).map(x => x.replace(/^[-*#>\d.)\s]+/, "").trim()).filter(x => x.split(/\s+/).length >= 4);

/** The brief's requests: sentences that ask for work or a decision, at most five, longest first. */
export function briefAsks(brief        )           {
  const prose = brief.split("\n").filter(l => !/^\s*\|/.test(l) && !/\S\s+\|\s+\S/.test(l)).join("\n");
  // A label before the request ("What the owner wants: "Write ...") is dropped so the verb leads.
  // A sentence that opens on a quote with no label is a customer speaking ("I want to see the EMI"), not a request.
  const asks           = [];
  for (const s of sentencesOf(prose)) {
    // "I need Meta ad copy for cold audiences: 3 primary texts" is a request with a list, not a label.
    const lead = /^[^:"“”]{1,40}:\**\s*/.exec(s);
    // A label is dropped when it is no request itself, or when what follows it is the request ("What I need: Write ...").
    const rest = lead ? s.slice(lead[0].length).replace(/^["“]\s*/, "") : "";
    const label = lead && (!ASK.test(lead[0].replace(/[:*\s]+$/, "")) || ASK.test(rest)) ? lead : null;
    if (!label && /^["“”]/.test(s)) continue;
    if (label && /words|says?|said|quotes?|voice|tone|persona|customers?|reviews?|chat/i.test(label[0])) continue;
    const t = (label ? s.slice(label[0].length) : s).replace(/^["“]\s*/, "").replace(/["”]\s*$/, "");
    if (ASK.test(t) && !NOT_ASK.test(t)) asks.push(t);
  }
  return asks.sort((a, b) => b.length - a.length).slice(0, 5);
}

const num = (s        ) => { const m = /-?\d[\d,]*(?:\.\d+)?/.exec(s.replace(/[₹$£€]/g, "")); return m ? Number(m[0].replace(/,/g, "")) : NaN; };

/**
 * The brief's data signals: in each table, the row that stands out in each number column (well above or below the
 * column's middle), said as "<row> <column> highest" or "lowest"; and prose lines that rank or share something
 * ("top return reason", "38% of chats").
 */
export function briefSignals(brief        )           {
  const out           = [];
  const lines = brief.replace(/\r\n?/g, "\n").split("\n");
  let table             = [];
  const flush = () => {
    // A funnel table (sessions, add to cart, checkout, orders): the row whose step rate falls far below the others.
    if (table.length >= 3 && table[0].filter(h => /session|visit|view|cart|checkout|order|purchase/i.test(h)).length >= 3) {
      const [header, ...rows] = table;
      for (let c = 2; c < header.length; c++) {
        const rates = rows.map(r => num(r[c] ?? "") / num(r[c - 1] ?? "")).map((v, i) => [v, i]         ).filter(([v]) => Number.isFinite(v) && v > 0);
        if (rates.length < 2) continue;
        const best = Math.max(...rates.map(([v]) => v));
        const [low, lowRow] = [...rates].sort((a, b) => a[0] - b[0])[0];
        if (low / best <= 0.6) out.push(`${rows[lowRow][0]}: ${header[c - 1]} to ${header[c]} rate lowest (fix the funnel step with the biggest drop, ${header[c - 1].toLowerCase()} to ${header[c].toLowerCase()})`);
      }
    }
    if (table.length >= 3) {
      const [header, ...rows] = table;
      for (let c = 1; c < header.length; c++) {
        const vals = rows.map(r => num(r[c] ?? "")).map((v, i) => [v, i]         ).filter(([v]) => Number.isFinite(v));
        if (vals.length < 3) continue;
        const sorted = [...vals].sort((a, b) => a[0] - b[0]);
        const mid = sorted[Math.floor(sorted.length / 2)][0];
        const [hi, hiRow] = sorted[sorted.length - 1], [lo, loRow] = sorted[0];
        const meaning = columnMeaning(header[c]);
        if (!meaning) continue;
        if (mid > 0 && hi / mid >= 1.25) out.push(`${rows[hiRow][0]}: ${header[c]} highest (${meaning.high})`);
        if (mid > 0 && lo / mid <= 0.75 && meaning.low) out.push(`${rows[loRow][0]}: ${header[c]} lowest (${meaning.low})`);
      }
    }
    table = [];
  };
  // A table row: cells split by pipes, with or without the outer pipes ("Why they bought | Share").
  const isRow = (l        ) => /^\s*\|.*\|\s*$/.test(l) || /\S\s+\|\s+\S/.test(l);
  for (const l of lines) {
    if (isRow(l)) {
      const cells = l.trim().replace(/^\||\|$/g, "").split("|").map(c => c.trim().replace(/\*\*/g, ""));
      if (!cells.every(c => /^:?-{2,}:?$/.test(c))) table.push(cells);
    } else flush();
  }
  flush();
  for (const l of lines.filter(l => !isRow(l))) {
    // A labelled list of shares ("Pre-sale chat topics: delivery 34%; firmness 19%"): its biggest item is the signal.
    const label = /^[\s*-]*([^:]{3,60}):\s*(.+)$/.exec(l);
    const items = label ? label[2].split(";").map(p => /^(.*?)[,\s]*(\d+(?:\.\d+)?)\s*%/.exec(p.trim())).filter((m)                       => !!m && m[1].trim().length >= 2)
      .map(m => [m[1].replace(/^[\s"“”]+|[\s,"“”]+$/g, ""), Number(m[2])]         ) : [];
    if (label && items.length >= 2) {
      const [top, share] = [...items].sort((a, b) => b[1] - a[1])[0];
      const meaning = columnMeaning(label[1]) ?? { high: "answer the biggest item first", low: "" };
      out.push(`${top}: ${share}% of ${label[1].replace(/\*\*/g, "").trim().toLowerCase()} (${meaning.high})`);
      continue;
    }
    for (const s of sentencesOf(l)) {
      if (/\b(top|most|biggest|main|best|worst|highest|lowest|leading|majority)\b(?!-)/i.test(s) && /\d+(\.\d+)?\s*(%|x\b|times\b)/i.test(s) && !ASK.test(s)
        && !/\bat most\b|\bwords?\b|\blength\b|\bdeadline\b|:$/i.test(s)) out.push(s);
    }
  }
  return [...new Set(out.map(s => s.replace(/\s+/g, " ").trim()))].slice(0, 8);
}

/**
 * What a standout number in a column means for the work, so the query says the decision, not just the row's name.
 * A column with no known meaning (prices, SKU counts) is not a signal.
 */
const COLUMN_MEANINGS                                            = [
  [/roas|return on ad|\bmer\b/i, { high: "scale budget and creative toward the best return on ad spend segment", low: "cut or fix the worst return on ad spend segment" }],
  [/\bcpa\b|\bcac\b|cost per (purchase|acquisition|order|customer)/i, { high: "cut spend where cost per purchase is highest", low: "scale the segment with the lowest cost per purchase" }],
  [/conv|orders? after click|\bcvr\b|purchase rate|checkout rate/i, { high: "lead with the best converting product or page", low: "fix the page or offer with the lowest conversion rate" }],
  [/\bctr\b|click.?through|clicks|hook|thumb/i, { high: "relaunch the creative angle with the best click through rate", low: "creative fatigue weak hook low click through rate" }],
  [/return|refund|exchange/i, { high: "reduce returns by answering the top return reason on the product page", low: "" }],
  [/\brto\b|undelivered|cancel/i, { high: "reduce cash on delivery returns and cancellations", low: "" }],
  [/repeat|retention|reorder|\bltv\b|lifetime/i, { high: "build retention around the segment with the best repeat rate", low: "win back the segment with weak repeat purchase" }],
  [/question|chat|ticket|complaint|objection|reason/i, { high: "answer the top customer question or objection in the copy", low: "" }],
  [/margin|profit|contribution/i, { high: "push the highest margin product in offers and ads", low: "protect margin on the lowest margin product" }],
  [/open rate|click rate|unsub/i, { high: "email subject lines and timing that win opens", low: "fix email engagement and deliverability" }],
  [/share|% of|\bmix\b|customers|buyers|orders|revenue|sales|traffic|sessions|spend/i, { high: "write for the largest customer segment in its own words", low: "" }],
];
function columnMeaning(header        )                                       {
  if (/price|\bmrp\b|cost of goods|\bsku\b|weight/i.test(header) && !/margin|profit/i.test(header)) return null;
  return COLUMN_MEANINGS.find(([re]) => re.test(header))?.[1] ?? null;
}

/** The query plan: each request at full weight, each signal at 0.8, the whole brief at 0.5. */
export function planQueries(brief        )              {
  const asks = briefAsks(brief).map(text => ({ kind: "ask"         , text, weight: 1 }));
  const signals = briefSignals(brief).map(text => ({ kind: "signal"         , text, weight: 0.8 }));
  return [...asks, ...signals, { kind: "brief", text: brief.replace(/\s+/g, " ").slice(0, 2000), weight: 0.5 }];
}

/** The library modules each kind of request lives in. A card from a named module gets a modest boost, never a filter. */
const DELIVERABLE_MODULES                       = [
  [/\bemails?\b|welcome (series|flow)|newsletter|klaviyo|win.?back|abandon|post.?purchase|\bflows?\b|\bsms\b|whatsapp/i, ["EML", "CXP"]],
  [/\bads?\b|ad copy|headlines?|primary text|creatives?|concepts?|hooks?|\bugc\b|scripts?|creators?|influencers?|spark/i, ["ADC", "MCR", "AVT"]],
  [/budget|campaign|scal(e|ing)|\bbids?\b|\bmeta\b|facebook|tiktok ads|media (plan|buying)|\broas\b|advantage/i, ["MCR", "MEA", "ADC"]],
  [/google|shopping|performance max|\bpmax\b|search ads|youtube/i, ["GAD", "MEA"]],
  [/product page|\bpdp\b|landing page|advertorial|\bpages?\b|description|bullets/i, ["LPG", "CRO", "AVT"]],
  [/a\/b|split test|\btests?\b|experiment|conversion rate|\bcro\b/i, ["CRO", "MEA"]],
  [/offers?\b|discount|bundle|free shipping|threshold|pricing|\bprices?\b|\baov\b|upsell|subscription/i, ["OFF", "FIN"]],
  [/\bseo\b|organic search|collections?|\bblog\b|keywords?/i, ["SEO", "AEO"]],
  [/organic|social media|\breels\b|instagram posts|content calendar|tiktok (posts|videos)/i, ["ORG"]],
  [/amazon|listing|a\+ content|sponsored products/i, ["AMZ"]],
  [/\bcod\b|cash on delivery|\brto\b|shipping|courier|fulfil|inventory|\bstock\b|warehouse|\b3pl\b/i, ["OPS", "SET", "FIN"]],
  [/product research|new product|which product|winning product/i, ["PRD", "AVT"]],
  [/customer research|avatar|persona|reviews|survey/i, ["AVT"]],
  [/\bbrand (name|story|positioning)|positioning/i, ["BRD"]],
  [/margin|profit|cash flow|unit economics|forecast|p&l|break.?even/i, ["FIN", "MEA"]],
  [/page speed|load time|core web vitals|\blcp\b/i, ["SPD"]],
];
export function briefModules(asks          )           {
  const text = asks.join(" ");
  return [...new Set(DELIVERABLE_MODULES.filter(([re]) => re.test(text)).flatMap(([, m]) => m))];
}

/** A card written for another market, Amazon marketplace or store platform never fits ("global" fits everywhere). */
export function fitsFacts(card          , f            )          {
  const miss = (have          , want         ) => !!want && have.length > 0 && !have.includes(want) && !have.includes("global");
  if (miss(card.markets, f.market)) return false;
  if (card.amazon.length && !f.channels.includes("amazon")) return false;
  if (miss(card.amazon, f.amazon)) return false;
  const stores = card.platforms.filter(p => p === "shopify" || p === "woocommerce");
  if (f.platform && stores.length && !stores.includes(f.platform)) return false;
  return true;
}

/**
 * Situations a card can be written for. When a card's claim or "holds when" names one and the brief never does (a
 * subscription card for a one-off store, a TikTok Shop card for a Meta-only brand), the card is pushed down, not
 * dropped: the brief may simply not say.
 */
const SITUATIONS                     = [
  // Subscription products, not newsletter subscribers.
  [/subscriptions?\b|subscribe and save|recharge|\bskio\b|cancelled subscribers|active subscribers/i, /subscriptions?\b|subscribe and save|recurring (order|deliver)|replenish|renewal/i],
  [/tiktok shop|gmv max/i, /tiktok shop|gmv max/i],
  [/\bamazon\b|\bfba\b|seller central/i, /\bamazon\b/i],
  [/\bcod\b|cash on delivery|\brto\b/i, /\bcod\b|cash on delivery|\brto\b/i],
  [/black friday|\bbfcm\b|cyber monday/i, /black friday|\bbfcm\b|cyber monday|holiday sale|sale season/i],
  [/whatsapp/i, /whatsapp/i],
  [/\bsms\b|text messag/i, /\bsms\b|text messag|texts\b/i],
  [/wholesale|\bb2b\b|retailers?\b/i, /wholesale|\bb2b\b|retail/i],
  [/dropship/i, /dropship/i],
  [/zero.to.one|pre.launch|brand.new (store|brand)|no sales yet/i, /\b(new|launch|launching|first sale|just started|no sales)\b/i],
];
/** Markets a card names in its own words when it carries no market tag ("US SMS programmes"). */
const MARKET_WORDS                     = [["US", /\bUS\b|\bU\.S\.|United States|American\b/], ["IN", /\bIndia(n)?\b/], ["UK", /\bUK\b|United Kingdom|British\b/], ["EU", /\bEU\b|European\b/]];
/** Score kept by a card written for a situation the brief does not describe (tuned on the odd half of the jobs golden set). */
export let SITUATION_WEIGHT = 0.15;
/** Cards scoring under this share of the best card are not worth a reader's time: the digest stops there. */
export let FLOOR = 0.05;
export function tunePrep(o                                        )       { if (o.situation !== undefined) SITUATION_WEIGHT = o.situation; if (o.floor !== undefined) FLOOR = o.floor; }
export function situationPenalty(card          , brief        , market         )         {
  const said = `${card.claim} ${card.holds}`;
  let p = SITUATIONS.some(([c, b]) => c.test(said) && !b.test(brief)) ? SITUATION_WEIGHT : 1;
  if (market && !card.markets.length) {
    const named = MARKET_WORDS.filter(([, re]) => re.test(card.holds)).map(([m]) => m);
    if (named.length && !named.includes(market)) p *= SITUATION_WEIGHT;
  }
  return p;
}

const overlap = (a             , b             ) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n / (a.size + b.size - n || 1); };

export class JobPrep {
          cards            ;
          byPath = new Map                  ();
          index                ;
          words = new Map                     ();
  constructor(cards            ) {
    this.cards = cards;
    const files = cards.map(c => {
      const path = `knowledge/cards/${c.id}.md`;
      this.byPath.set(path, c);
      this.words.set(c.id, new Set(tokens(`${c.claim} ${c.text}`)));
      return { path, text: `# ${c.claim}\n\n${c.text}\n\nHolds when: ${c.holds}\n\nAsked as: ${c.asks}` };
    });
    this.index = new KnowledgeIndex(files);
  }

  prepare(brief        , opts                                              = {})           {
    const k = Math.max(3, Math.min(25, opts.k ?? 15));
    const facts = { ...briefFacts(brief), ...(opts.facts ?? {}) };
    const queries = planQueries(brief);
    const fused = new Map                                          ();
    const gaps           = [];
    const wantedModules = briefModules(queries.filter(q => q.kind === "ask").map(q => q.text));
    const adjust = (chunk                  , score        ) => {
      const card = this.byPath.get(chunk.path);
      return card && fitsFacts(card, facts) ? score * (card.tier === 1 ? 1.05 : card.tier === 2 ? 1.02 : card.tier === 4 ? 0.98 : 1) : null;
    };
    for (const q of queries) {
      // Each query searches the whole library, and again inside the requested modules (a wider, routed pool).
      const passes = [{ a: this.index.ask(q.text, { k: 10, adjust }), w: 1 }];
      const routed = wantedModules.length ? this.cards.filter(c => wantedModules.includes(c.module)).map(c => `knowledge/cards/${c.id}.md`) : [];
      if (routed.length && q.kind !== "brief") passes.push({ a: this.index.ask(q.text, { k: 10, adjust, paths: routed }), w: 0.7 });
      if (q.kind !== "brief" && (!passes[0].a.passages.length || passes[0].a.coverage < MIN_COVERAGE / 2)) gaps.push(q.text);
      for (const { a, w } of passes) a.passages.forEach((p, rank) => {
        const card = this.byPath.get(p.path);
        if (!card) return;
        const e = fused.get(card.id) ?? { score: 0, via: [] };
        e.score += (q.weight * w) / (10 + rank + 1);
        if (q.kind !== "brief" && !e.via.includes(q.text)) e.via.push(q.text);
        fused.set(card.id, e);
      });
    }
    // Rerank: when the card holds for a business like this one, and when several queries found it.
    const briefWords = new Set(tokens(brief));
    const wanted = new Set(briefModules(queries.filter(q => q.kind === "ask").map(q => q.text)));
    const ranked = [...fused].map(([id, e]) => {
      const card = this.cards.find(c => c.id === id) ;
      const holds = card.holds ? overlap(new Set(tokens(card.holds)), briefWords) : 0;
      const prior = wanted.size ? (wanted.has(card.module) ? 1.35 : 0.85) : 1;
      return { card, score: e.score * prior * situationPenalty(card, brief, facts.market) * (1 + Math.min(0.3, holds * 2)) * (1 + 0.1 * Math.max(0, e.via.length - 1)), via: e.via };
    }).sort((a, b) => b.score - a.score || a.card.id.localeCompare(b.card.id));
    // Diversity: skip a card that says nearly what a picked card says.
    const picks             = [];
    const top = ranked[0]?.score ?? 0;
    for (const r of ranked) {
      if (r.score < top * FLOOR) break;
      const w = this.words.get(r.card.id) ;
      if (picks.some(p => overlap(this.words.get(p.card.id) , w) > 0.45)) continue;
      picks.push({ card: r.card, score: Math.round(r.score * 10000) / 10000, via: r.via });
      if (picks.length >= k) break;
    }
    // A request or signal is a gap when the library barely matches it, or when nothing it found made the digest.
    for (const q of queries) if (q.kind !== "brief" && !gaps.includes(q.text) && !picks.some(p => p.via.includes(q.text))) gaps.push(q.text);
    return { facts, queries, picks, gaps };
  }

  /** One plain query, no plan, filters, rerank or diversity: the baseline an agent gets from a single lookup. */
  raw(question        , k = 10)           {
    return this.index.ask(question, { k }).passages.map(p => this.byPath.get(p.path)?.id).filter((x)              => !!x);
  }
}

const clip = (s        , n        ) => { const w = s.split(/\s+/); return w.length > n ? `${w.slice(0, n).join(" ")} ...` : s; };

/** The digest an agent reads before drafting: facts used as filters, the ranked cards, and the gaps. */
export function preparedMarkdown(p          )         {
  const f = p.facts;
  const factLine = [f.market && `market ${f.market}`, f.amazon && `Amazon ${f.amazon}`, f.platform, f.cod && "cash on delivery", f.subscription && "subscription",
    f.channels.length && `channels: ${f.channels.join(", ")}`].filter(Boolean).join("; ") || "none clear; no filter applied";
  const asks = p.queries.filter(q => q.kind === "ask"), signals = p.queries.filter(q => q.kind === "signal");
  return [
    "# Knowledge brief for this job",
    "",
    "Read before drafting. These are the library cards that fit this brief, best first. Use a card only where its \"holds when\" fits this business; check each \"fails when\" against the brief. Cite card ids in your notes, never in the deliverable.",
    "",
    `**Facts read from the brief (used as filters):** ${factLine}.`,
    "",
    ...(asks.length ? ["**What the brief asks for:**", ...asks.map(q => `- ${q.text}`), ""] : []),
    ...(signals.length ? ["**Signals in the data:**", ...signals.map(q => `- ${q.text}`), ""] : []),
    "## Cards",
    "",
    ...p.picks.flatMap((x, i) => [
      `${i + 1}. **${x.card.id}** ${x.card.claim} (tier ${x.card.tier}, ${x.card.scope})`,
      ...(x.card.holds ? [`   - Holds when: ${clip(x.card.holds, 20)}`] : []),
      ...(x.card.fails ? [`   - Fails when: ${clip(x.card.fails, 20)}`] : []),
      ...(x.via.length ? [`   - Found for: ${clip(x.via[0], 10)}`] : []),
    ]),
    "",
    "## Gaps",
    "",
    ...(p.gaps.length ? p.gaps.map(g => `- No strong card for: ${clip(g, 25)} Decide it from the brief and the owner's data, never from memory.`) : ["- None: every request and signal has a matching card."]),
    "",
    "For more on one card or one question: `node tools/ask-knowledge.mjs \"<question>\" --module <CODE>`.",
  ].join("\n");
}

// ---------- Command line ----------

async function main(argv) {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const args = { brief: null, k: 15, json: false, pack: null, out: "context/knowledge-brief.md", trace: "context/trace.md" };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--k") args.k = Number(argv[++i]) || 15;
    else if (a === "--json") args.json = true;
    else if (a === "--pack") args.pack = argv[++i];
    else if (a === "--out") args.out = argv[++i];
    else if (a === "--trace") args.trace = argv[++i];
    else if (a === "-h" || a === "--help") { console.log(HELP); return 0; }
    else args.brief = args.brief ? args.brief + " " + a : a;
  }
  if (!args.brief) { console.error(HELP); return 2; }
  const brief = fs.existsSync(args.brief) && fs.statSync(args.brief).isFile() ? fs.readFileSync(args.brief, "utf8") : args.brief;
  const here = path.dirname(fileURLToPath(import.meta.url));
  const pack = path.resolve(args.pack ?? (fs.existsSync(path.join(here, "..", "AGENTS.md")) ? path.join(here, "..") : process.cwd()));
  const cards = [];
  const lib = path.join(pack, "knowledge");
  if (fs.existsSync(lib)) for (const v of fs.readdirSync(lib)) {
    const dir = path.join(lib, v);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir).sort()) {
      const m = /^([A-Z]{2,4})\.md$/.exec(f);
      if (m) cards.push(...cardsFromModuleMarkdown(m[1], fs.readFileSync(path.join(dir, f), "utf8")));
    }
  }
  if (!cards.length) { console.log("This pack carries no library cards, so there is nothing to prepare. Use tools/ask-knowledge.mjs for the pack's own knowledge."); return 0; }
  const prepared = new JobPrep(cards).prepare(brief, { k: args.k });
  const md = preparedMarkdown(prepared);
  const write = (rel, text, append) => {
    const file = path.resolve(process.cwd(), rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    if (append) fs.appendFileSync(file, text); else fs.writeFileSync(file, text);
  };
  write(args.out, md + "\n", false);
  const traceFile = path.resolve(process.cwd(), args.trace);
  const rows = prepared.queries.filter(q => q.kind !== "brief").map(q => {
    const ids = prepared.picks.filter(p => p.via.includes(q.text)).map(p => p.card.id);
    return "| " + q.text.replace(/\|/g, "/").replace(/\s+/g, " ").slice(0, 160) + " | " + (ids.join(", ") || "none: a gap") + " | to settle in the draft |";
  });
  write(args.trace, (fs.existsSync(traceFile) ? "\n" : "# Knowledge trace\n\nWorking file, never shipped. Fill in the call each card supports as you draft.\n\n") + "| Question | Cards | Call it supports |\n|---|---|---|\n" + rows.join("\n") + "\n", true);
  console.log(args.json ? JSON.stringify({ facts: prepared.facts, queries: prepared.queries, gaps: prepared.gaps, picks: prepared.picks.map(p => ({ id: p.card.id, claim: p.card.claim, holds: p.card.holds, fails: p.card.fails, via: p.via, score: p.score })) }, null, 2) : md);
  console.error("prepare-job: " + prepared.picks.length + " cards from " + cards.length + "; wrote " + args.out + " and " + args.trace);
  return 0;
}

const HELP = 'Usage: node tools/prepare-job.mjs <brief file or "brief text"> [--k 15] [--out context/knowledge-brief.md] [--trace context/trace.md] [--json] [--pack <folder>]';

const invoked = typeof process !== "undefined" && !!process.argv?.[1] && (await import("node:path")).resolve(process.argv[1]).toLowerCase() === (await import("node:url")).fileURLToPath(import.meta.url).toLowerCase();
if (invoked) process.exitCode = await main(process.argv.slice(2));
