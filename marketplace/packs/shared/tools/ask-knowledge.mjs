#!/usr/bin/env node
// ask-knowledge.mjs: find what this agent knows about a question, with the sources, in its own pack.
// Plain Node 18 or later, no dependencies, no network, nothing sent anywhere. Run it from the pack folder:
//
//   node tools/ask-knowledge.mjs "how long to wait after a core update before judging a drop"
//   node tools/ask-knowledge.mjs "core update drop" "traffic fell after Google update" --k 8
//   node tools/ask-knowledge.mjs "title rewrite rules" --in knowledge.md --json
//
// Several quoted phrasings of one need are searched together and their rankings merged (ask it two or three ways
// when the first words may not be the pack's words). It prints the best passages, best first, each with its file and
// lines, its heading trail and the sources it cites (with the date each was checked, and STALE when a source is past
// twice its review window). When the best passage covers too little of the question, it says the pack does not know:
// then ask the client or research it, and never fill the gap from memory.
//
// Generated from the AI Blocks marketplace (src/modules/packs/retrieve.ts by scripts/gen-ask-knowledge.mjs).
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
export const TUNING = { heads: false, prf: 0, prfDocs: 3, prfWeight: 0.3, glossary: true };

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
   */
  ask(questions                   , opts                                                   = {})         {
    const qs = (Array.isArray(questions) ? questions : [questions]).map(s => s.trim()).filter(Boolean);
    const k = Math.max(1, Math.min(MAX_PASSAGES, opts.k ?? 6));
    const allowed = opts.paths?.length ? new Set(opts.paths) : null;
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
    const ranked = [...fused].sort((a, b) => b[1] - a[1] || a[0] - b[0]);
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
    const coverage = informative.length ? informative.filter(w => bestWords.has(w)).length / informative.length : 0;
    const anywhere = new Set(picked.flatMap(([i]) => [...has(i)]));
    const passages            = picked.map(([i, score]) => {
      const c = this.chunks[i];
      const words = has(i);
      return { ...c, score: Math.round(score * 10000) / 10000, matched: qWords.filter(w => words.has(w)), cites: this.citeFiles.has(c.path) ? c.cites.map(n => this.cite(n, opts.today)).filter((x)                 => !!x) : [] };
    });
    return { question: qs.join(" | "), passages, coverage: Math.round(coverage * 100) / 100, enough: coverage >= MIN_COVERAGE, missing: informative.filter(w => !anywhere.has(w)) };
  }

          cite(n        , today         )                   {
    const s = this.sources.get(n);
    if (!s) return null;
    const stale = !!(today && this.reviewDays && s.checked && daysBetween(s.checked, today) > this.reviewDays * 2);
    return { n, title: s.title, url: s.url, checked: s.checked, stale };
  }
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

// ---------- Command line ----------

async function main(argv) {
  const fs = await import("node:fs");
  const path = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const args = { q: [], k: 6, json: false, in: [], pack: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--k") args.k = Number(argv[++i]) || 6;
    else if (a === "--json") args.json = true;
    else if (a === "--in") args.in.push(argv[++i]);
    else if (a === "--pack") args.pack = argv[++i];
    else if (a === "-h" || a === "--help") { console.log(HELP); return 0; }
    else args.q.push(a);
  }
  if (!args.q.length) { console.error(HELP); return 2; }
  const here = path.dirname(fileURLToPath(import.meta.url));
  const pack = path.resolve(args.pack ?? (fs.existsSync(path.join(here, "..", "AGENTS.md")) ? path.join(here, "..") : process.cwd()));
  const files = [];
  const walk = rel => {
    for (const name of fs.readdirSync(path.join(pack, rel)).sort()) {
      if (name.startsWith(".") || name === "node_modules") continue;
      const r = rel ? rel + "/" + name : name;
      if (fs.statSync(path.join(pack, r)).isDirectory()) walk(r);
      else if (indexedPath(r)) files.push({ path: r, text: fs.readFileSync(path.join(pack, r), "utf8") });
    }
  };
  walk("");
  if (!files.length) { console.error("No pack files found in " + pack + ". Run this from the agent's folder, or pass --pack <folder>."); return 2; }
  let reviewDays = 0;
  try { reviewDays = JSON.parse(fs.readFileSync(path.join(pack, "pack.json"), "utf8")).knowledge?.review_every_days ?? 0; } catch {}
  const sourcesFile = path.join(pack, "sources.md");
  const sources = fs.existsSync(sourcesFile) ? parseSourcesMd(fs.readFileSync(sourcesFile, "utf8")) : [];
  const index = new KnowledgeIndex(files, { sources, reviewDays });
  const today = new Date().toISOString().slice(0, 10);
  const answer = index.ask(args.q, { k: args.k, today, paths: args.in });
  let name = "this agent";
  try { name = JSON.parse(fs.readFileSync(path.join(pack, "pack.json"), "utf8")).name || name; } catch {}
  console.log(args.json ? JSON.stringify(answer, null, 2) : answerText(answer, name));
  return 0;
}

const HELP = 'Usage: node tools/ask-knowledge.mjs "<question>" ["<another phrasing>" ...] [--k 6] [--in <file>] [--json] [--pack <folder>]';

const invoked = typeof process !== "undefined" && !!process.argv?.[1] && (await import("node:path")).resolve(process.argv[1]).toLowerCase() === (await import("node:url")).fileURLToPath(import.meta.url).toLowerCase();
if (invoked) process.exitCode = await main(process.argv.slice(2));
