// Starting from a goal: what in the library is about it, best first.
// Plain code, no AI: the same words always give the same answer. Free mode's "Start with" list (composer-core
// startPicks) and the AI planner's candidate list (composer-core candidatesFor) both draw on these matches.
//
// What a goal is about comes from the library search (library-search-core + library-rank), run on the whole goal,
// each pair of neighbouring words and each subject word, then merged by rank. A pair ("performance review") outweighs
// one shared word ("performance" in Performance Max), and items that cover more of the goal's rarer subject words rank higher.
import type { Library, Part } from "./composer-core.ts";
import { buildLibrarySearchIndex, queryTokens, searchLibraryIndex, searchTokens, type LibrarySearchIndex } from "./library-search-core.ts";
import { rankLibraryResults } from "./library-rank.ts";
import { makeSearchDocument } from "./search-document.mjs";
import { classificationText } from "./catalogue-taxonomy.mjs";

export const GOAL_EXAMPLES = ["a landing page for my best ad", "video ads from my reviews", "find why my ads stopped selling"];

// A library with some items taken out (an evaluation that hides the answer) shares the full library's search indexes.
const ROOTS = new WeakMap<Library, Library>();
export const rootOf = (c: Library): Library => ROOTS.get(c) ?? c;
export function withoutParts(c: Library, slugs: Iterable<string>): Library {
  const gone = new Set(slugs), blocks = c.blocks.filter(b => !gone.has(b.slug));
  const view: Library = { ...c, blocks, bySlug: Object.fromEntries(blocks.map(b => [b.slug, b])) };
  ROOTS.set(view, rootOf(c));
  return view;
}

const SEARCH = new WeakMap<Library, LibrarySearchIndex>();
function searchIndex(c: Library): LibrarySearchIndex {
  const root = rootOf(c);
  let index = SEARCH.get(root);
  if (!index) {
    // The library page's quick index: names, descriptions and job labels (no page text).
    // Each item's "use it when" words (cues) count as description: the situations people describe in their own words.
    index = buildLibrarySearchIndex(root.blocks.filter(b => b.type !== "mind").map(b => makeSearchDocument(b, b.cues ? { when: [b.cues] } : {}, { extraText: classificationText(b) })), "0".repeat(64));
    SEARCH.set(root, index);
  }
  return index;
}
/** The same index built ahead of time (the public API build stores it), so a cold Worker skips the build. A library
 *  always gives the same index, so ranking does not change. */
export const searchIndexFor = (c: Library): LibrarySearchIndex => searchIndex(c);
export function setSearchIndex(c: Library, index: LibrarySearchIndex) { SEARCH.set(rootOf(c), index); }
const isTested = (b: Part) => !!(b as { tested?: unknown }).tested;
/** The library search, best first, limited to items still in this library. */
export function searchParts(c: Library, query: string): Part[] {
  const hits = searchLibraryIndex(searchIndex(c), query);
  const found: Part[] = [];
  for (const slug of hits.keys()) { const b = c.bySlug[slug]; if (b && b.type !== "mind") found.push(b); }
  return rankLibraryResults(found, hits, query, { isTested });
}

// Words that say where or for whom ("my store"), or how ("cut", "run"), not what: nearly every goal has one, so they
// never make a match on their own. A setting word still helps tell two senses apart (store returns, not investment returns).
const SETTING = new Set(["business", "company", "store", "shop", "online", "team", "customer", "client", "brand", "product", "nonprofit", "agency"]);
const PLACE = new Set([...SETTING, "new", "small", "first", "next", "own", "every", "cut", "run", "get", "send", "win", "launch", "start", "apply", "turn", "offer", "follow", "keep", "stop", "put", "take", "bring", "clear", "face", "help"]);
const words = new WeakMap<Part, string[]>();
const wordsOf = (b: Part) => { let found = words.get(b); if (!found) words.set(b, (found = searchTokens(`${b.name} ${(b.aliases ?? []).join(" ")} ${b.headline ?? ""} ${b.summary} ${b.slug} ${b.cues ?? ""}`, true))); return found; };
const covers = (list: string[], t: string) => list.some(w => w === t || t.length >= 4 && w.startsWith(t) || w.length >= 4 && t.startsWith(w));
const RARITY = new WeakMap<Library, Map<string, number>>();
/** How rare a word is in the library: rare words say more about what a goal wants. */
function rarity(c: Library, t: string): number {
  const root = rootOf(c);
  let df = RARITY.get(root);
  if (!df) { df = new Map(); for (const b of root.blocks) if (b.type !== "mind") for (const w of new Set(wordsOf(b))) df.set(w, (df.get(w) ?? 0) + 1); RARITY.set(root, df); }
  return Math.log(1 + root.blocks.length / (1 + (df.get(t) ?? 0)));
}

const NAMED = new WeakMap<Library, { words: string[]; seen: Map<string, number> }>();
/** 1 for a word some item's name uses (it names a kind of work), less for a word only ever seen in descriptions
 *  ("doubled", "lately"): it says less about what a goal wants. */
function named(c: Library, t: string): number {
  const root = rootOf(c);
  let found = NAMED.get(root);
  if (!found) { found = { words: [...new Set(root.blocks.filter(b => b.type !== "mind").flatMap(b => searchTokens(`${b.name} ${(b.aliases ?? []).join(" ")}`, true)))], seen: new Map() }; NAMED.set(root, found); }
  let value = found.seen.get(t);
  if (value === undefined) found.seen.set(t, (value = found.words.some(w => w === t || t.length >= 4 && w.length >= 4 && (w.startsWith(t) || t.startsWith(w))) ? 1 : 0.35));
  return value;
}

export type GoalMatch = { b: Part; score: number; share: number; words: number; pair: boolean };
const MATCHES = new Map<string, { c: Library; found: GoalMatch[] }>();
/** Library items for a goal, best first. `share` is the part of the goal's subject (by rarity) the item's name and
 *  description cover; `pair` says two neighbouring goal words both matched it in one search. */
export function goalMatches(c: Library, text: string, limit = 60): GoalMatch[] {
  const key = text.slice(0, 400), known = MATCHES.get(key);
  if (known?.c === c) return known.found.slice(0, limit);
  const words = queryTokens(key);
  // A number says how many or how long ("300 pages", "60 days"), not what the goal is about.
  const hard = words.hard.filter(t => !/^\d+$/.test(t)), sequence = words.sequence.filter(t => !/^\d+$/.test(t));
  const subject = hard.filter(t => !PLACE.has(t)), setting = sequence.filter(t => SETTING.has(t));
  const fused = new Map<string, number>(), paired = new Set<string>();
  const run = (query: string, weight: number, pair = false) => searchParts(c, query).slice(0, 40).forEach((b, i) => {
    fused.set(b.slug, (fused.get(b.slug) ?? 0) + weight / (i + 6));
    if (pair && i < 15) paired.add(b.slug);
  });
  run(key, 3);
  for (let i = 0; i + 1 < sequence.length; i++) {
    const [a, b] = [sequence[i], sequence[i + 1]];
    if ((subject.includes(a) || subject.includes(b)) && !(PLACE.has(a) && PLACE.has(b))) run(`${a} ${b}`, 2, true);
  }
  if (sequence.length > 1) for (const t of subject) run(t, 1);
  // A subject word counts by how rare it is and whether it names a kind of work.
  const weightOf = (t: string) => rarity(c, t) * named(c, t);
  const total = subject.reduce((s, t) => s + weightOf(t), 0);
  const found = [...fused].map(([slug, value]) => {
    const b = c.bySlug[slug], own = wordsOf(b);
    const said = subject.filter(t => covers(own, t)), share = total ? said.reduce((s, t) => s + weightOf(t), 0) / total : 0;
    const pair = paired.has(slug) && sequence.some((t, i) => i + 1 < sequence.length && covers(own, t) && covers(own, sequence[i + 1]));
    const fits = setting.length ? setting.filter(t => covers(own, t)).length / setting.length : 0;
    return { b, share, words: said.length, pair, score: value * (0.25 + share) * (pair ? 1.3 : 1) * (1 + 0.3 * fits) };
  }).sort((a, b) => b.score - a.score || a.b.slug.localeCompare(b.b.slug));
  if (MATCHES.size > 64) MATCHES.clear();
  MATCHES.set(key, { c, found });
  return found.slice(0, limit);
}
