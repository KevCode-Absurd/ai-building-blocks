// Search-result text for every page: the <title> (50 to 60 characters, main phrase first, brand last) and the meta
// description (120 to 155 characters). Used by scripts/prerender.mjs to write each page and by scripts/check-seo.mjs
// to hold the rules. A description is built from the page's own fields (summary, then what it is for, what you get,
// the subhead), never from a shared sentence stuck on every page.
export const BRAND = "AI Blocks";
export const TITLE = { min: 50, max: 60 };
export const DESC = { min: 120, max: 155 };

export const clean = (s) => String(s ?? "").replace(/\s+/g, " ").trim();
const stripEnd = (s) => clean(s).replace(/[\s.,;:]+$/, "");
// "Write ad copy" -> "write ad copy", but "AI tools" and "SKILL.md" keep their capitals.
export const lowerFirst = (s) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
// Only these openers are safe to lower-case mid-sentence; anything else could be a name ("Shopify sellers...").
const SAFE_OPENER = /^(you|you're|your|a|an|the|someone|it|there|they|we|people)\b/i;
const sentences = (s) => clean(s).match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g)?.map((x) => x.trim()).filter(Boolean) ?? [];
const wordSet = (s) => new Set(clean(s).toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 3));
// How much of `b` is already said in `a` (0 to 1), so a description never repeats itself.
const overlap = (a, b) => { const A = wordSet(a), B = wordSet(b); if (!B.size) return 1; let n = 0; for (const w of B) if (A.has(w)) n++; return n / B.size; };
const cutWords = (s, n) => { if (s.length <= n) return s; const cut = s.slice(0, n + 1).replace(/\s+\S*$/, ""); return cut.replace(/[\s.,;:&-]+$/, ""); };
const branded = (t) => t.endsWith(`| ${BRAND}`);

/**
 * Pick one title. In order: a branded candidate inside 50 to 60; a branded one of 45 or more that fits; any
 * candidate inside the range; the longest that fits; the shortest, cut at a word. Brand stays last.
 */
export function fitTitle(candidates, { min = TITLE.min, max = TITLE.max } = {}) {
  const list = [...new Set(candidates.map(clean).filter(Boolean))];
  const fits = list.filter((t) => t.length <= max);
  const pick = fits.find((t) => branded(t) && t.length >= min) ?? fits.find((t) => branded(t) && t.length >= min - 5) ?? fits.find((t) => t.length >= min);
  if (pick) return pick;
  if (fits.length) return fits.reduce((a, b) => (b.length > a.length ? b : a));
  return cutWords(list[list.length - 1], max);
}
/** Candidates for a "name: qualifier" title, richest first, ending in the bare name. */
export function titleLadder(name, tails) {
  const out = [];
  for (const tail of tails) out.push(`${name}: ${tail} | ${BRAND}`);
  out.push(`${name} | ${BRAND}`);
  for (const tail of tails) out.push(`${name}: ${tail}`);
  out.push(name);
  return out;
}
export const NOUN = { skill: "AI skill", prompt: "AI prompt", workflow: "AI workflow", agent: "AI agent" };
/** Skill, prompt, workflow and agent pages. */
export function itemTitle({ name, kind, job }) {
  const noun = NOUN[kind] ?? NOUN.skill;
  return fitTitle(titleLadder(clean(name), [
    ...(job ? [`free ${noun} to ${lowerFirst(clean(job))}`] : []),
    `free ${noun} for Claude, ChatGPT and Gemini`,
    `free ${noun} for Claude and ChatGPT`,
    `free ${noun} to use in your AI`,
    `free ${noun} for your AI`,
    `free ${noun}, reusable`,
    `free ${noun} to copy`,
    `free ${noun}`,
    noun,
    noun.replace(/^AI /, ""),
  ]));
}
/** Mind pages: "Jeff Bezos: free AI mind for business help | AI Blocks". */
export function mindTitle({ name, identity, area }) {
  const a = lowerFirst(clean(area));
  return fitTitle(titleLadder(clean(name), [
    ...(identity && a ? [`${clean(identity)} as an AI mind for ${a}`] : []),
    ...(a ? [`free AI mind for ${a} help`, `free AI mind for ${a}`] : []),
    "free AI mind for advice",
    "free AI mind to ask for help",
    "free AI mind",
    "AI mind",
  ]));
}
/** Static and tool pages: the plain name, padded with the first qualifier that fits. */
export function pageTitle(name, qualifiers = []) {
  return fitTitle(titleLadder(clean(name), qualifiers));
}

/** Cut a description to a whole sentence under the limit; if that leaves it thin, to a whole word with an ellipsis. */
export function trimDescription(s, max = DESC.max) {
  s = clean(s);
  if (s.length <= max) return s;
  let last = -1;
  for (const m of s.matchAll(/[.?!](?=\s|$)/g)) { if (m.index + 1 <= max) last = m.index + 1; else break; }
  if (last >= DESC.min - 10) return s.slice(0, last);
  return `${cutWords(s, max - 1).replace(/[\s.,;:]+$/, "")}…`;
}
const ensureStop = (s) => (/[.?!…]$/.test(s) ? s : `${s}.`);

/**
 * A description from the page's own words. `summary` leads. When it is under 120 characters, add the first of
 * these that fits: when to use it, what you get, what you give it, then sentences from the subhead and the steps.
 * `tail` (a few spellings, longest first) is the last resort for a page with nothing of its own that fits.
 * Returns { text, from: "summary" | "extended" | "tail" | "trimmed", short: boolean }.
 */
export function describe({ summary, subhead = "", when = [], youGet = [], youGive = [], steps = [], more = [], tail = [] }) {
  const base = ensureStop(clean(summary));
  if (base.length > DESC.max) return { text: trimDescription(base), from: "trimmed", short: false };
  if (base.length >= DESC.min) return { text: base, from: "summary", short: false };
  const extras = [];
  const strings = (a) => a.filter((x) => typeof x === "string" && x.trim()).map((x) => stripEnd(x));
  for (const w of when.filter((x) => typeof x === "string" && SAFE_OPENER.test(clean(x))).slice(0, 3)) extras.push(`Use it when ${stripEnd(w).replace(/^[A-Za-z']+/, (m) => m.toLowerCase())}.`);
  const gets = strings(youGet);
  for (let n = Math.min(gets.length, 3); n >= 2; n--) extras.push(`You get: ${gets.slice(0, n).join("; ")}.`);
  for (const g of gets.slice(0, 4)) extras.push(`You get: ${g}.`);
  for (const g of strings(youGive).slice(0, 2)) extras.push(`You give it: ${g}.`);
  extras.push(...more.map((x) => ensureStop(clean(x))).filter((x) => x.length > 1));
  for (const s of sentences(subhead).slice(0, 4)) extras.push(ensureStop(s));
  if (steps.length >= 2) extras.push(`Steps: ${steps.slice(0, 4).join(", ")}.`);
  // A long extra also comes in shorter forms, cut at a clause ("..., and", " and ", " with "), so one of them can fit.
  const shorter = (e) => { const out = []; const m = e.match(/^(You get: |Use it when |You give it: )(.*?)\.?$/); if (!m) return out; const re = /,| and | with | for | or /g; let x; while ((x = re.exec(m[2]))) { const cut = m[2].slice(0, x.index).trim(); if (cut.length >= 18) out.push(`${m[1]}${cut}.`); } return out.reverse(); };
  extras.push(...extras.flatMap(shorter));
  const usable = extras.filter((e) => overlap(base, e) <= 0.6);
  let text = base;
  for (const extra of usable) {
    if (text.length >= DESC.min) break;
    if (overlap(text, extra) > 0.6) continue;
    if (text.length + 1 + extra.length <= DESC.max) text = `${text} ${extra}`;
  }
  // The single extra that lands closest inside the range wins if the greedy pass fell short.
  if (text.length < DESC.min) {
    let best = text;
    for (const extra of usable) { const c = `${base} ${extra}`; if (c.length <= DESC.max && c.length > best.length) best = c; }
    text = best;
  }
  let from = text === base ? "summary" : "extended";
  if (text.length < DESC.min) {
    for (const extra of tail) { if (text.length + 1 + extra.length <= DESC.max) { text = `${text} ${extra}`; from = "tail"; break; } }
  }
  return { text, from, short: text.length < DESC.min };
}

/**
 * Title and description for a skill, prompt, workflow or agent page, from the catalogue record and its page JSON.
 * prerender.mjs writes them into the page; check-seo.mjs reads the same function to list the pages whose own
 * copy is too thin to describe (reports/*-seo-copy-gaps.json).
 */
export function itemSeo({ block, page = {}, job = "", kind = "skill", steps = [] }) {
  const noun = NOUN[kind] ?? NOUN.skill;
  const arr = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  const description = describe({
    summary: block.summary, subhead: page.subhead, when: arr(page.when), youGet: arr(page.you_get), youGive: arr(page.you_give), steps, more: job ? [`Part of the job: ${clean(job)}.`] : [],
    tail: [`Free ${noun} for Claude, ChatGPT and Gemini.`, `Free ${noun} for Claude and ChatGPT.`, `Free ${noun}.`],
  });
  return { title: itemTitle({ name: block.name, kind, job }), description };
}
