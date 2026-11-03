/** Orders library search matches. Shared by the library page (App.tsx) and the offline evaluation
 *  (scripts/evaluate-recommendations.mjs), so what is measured is what ships. No network, no model. */
import { isWordForm, queryTokens, searchTokens, type SearchHit } from "./library-search-core.ts";
import { audienceOf, SPECIALIST_REQUEST } from "./catalogue-audience.mjs";

export type RankBlock = { slug: string; name: string; aliases?: string[]; type?: string; task?: string; headline?: string; audience?: string };
/** `scores`, when given, receives each item's final ranking score (higher is better), for callers that report it. */
type Options<B> = { isTested: (b: B) => boolean; suggestion?: string; scores?: Map<string, number> };

// Role words say what kind of tool it is, not what it is about; they never count against a name.
const TOOL_WORDS = ["writer", "write", "planner", "plan", "checker", "check", "builder", "build", "maker", "make", "reviewer", "review", "finder", "find", "analyst", "analyse", "tool", "guide", "helper", "creator", "designer", "design", "drafter", "draft", "editor", "generator", "agent", "workflow", "prompt", "skill", "coach", "assistant", "reader", "tracker", "auditor", "audit", "scorer", "picker"];
const ROLE = new Set([...TOOL_WORDS, "manager", "strategist", "specialist", "coordinator", "architect", "engineer", "researcher", "reporter", "advisor", "adviser", "keeper", "tester", "runner", "spotter", "ranker", "chooser", "explainer", "organiser", "optimiser", "analyser"]);
// Near-identical names are judged on the common tool words only, so a strategist and a designer for one job both stay.
const DUPLICATE_ROLE = new Set(TOOL_WORDS);
const names = new WeakMap<object, string[]>();
const nameWords = (b: RankBlock) => { let found = names.get(b); if (!found) names.set(b, (found = searchTokens(`${b.name} ${(b.aliases ?? []).join(" ")}`))); return found; };
/** The name and each other name (alias) on its own: a search that says one of them is a match; words picked
 *  from different names are not. */
const variants = new WeakMap<object, string[][]>();
const nameVariants = (b: RankBlock) => { let found = variants.get(b); if (!found) variants.set(b, (found = [b.name, ...(b.aliases ?? [])].map(name => searchTokens(name)))); return found; };
/** The same word in another form: "test" and "testing", "price" and "prices". A longer word that merely starts
 *  the same way is a different word ("project" is not "projection", "review" not "reviewer", "lead" not
 *  "leader"); see isWordForm. */
export const sameWord = (a: string, b: string) => {
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  if (short.length < 3 || !long.startsWith(short.endsWith("e") ? short.slice(0, -1) : short)) return short === long;
  return short === long || isWordForm(short, long.slice(short.length)) || short.endsWith("e") && isWordForm(short, long.slice(short.length - 1));
};
/** A name word the typed word starts ("analy" in "analytics"): still said, at a stand-in's discount. */
const begins = (word: string, token: string) => token.length >= 5 && word.startsWith(token);
/** One slip of the keyboard ("handbok", "polcy"), or two in a long word, still names the word. */
function nearly(a: string, b: string): boolean {
  const max = a.length >= 8 ? 2 : 1;
  if (a.length < 5 || b.length < 4 || Math.abs(a.length - b.length) > max || a[0] !== b[0]) return false;
  let before = Array.from({ length: b.length + 1 }, (_, j) => j), prev: number[] = [];
  for (let i = 1; i <= a.length; i++) {
    const row = [i];
    for (let j = 1; j <= b.length; j++) {
      let value = Math.min(before[j] + 1, row[j - 1] + 1, before[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) value = Math.min(value, prev[j - 2] + 1);
      row.push(value);
    }
    prev = before; before = row;
  }
  return before[b.length] <= max;
}
const EXACT = 0.3, SPECIALIST_NUDGE = 0.5, GOAL_NAMED = 1.4;
const jaccard = (a: string[], b: string[]) => { const x = new Set(a.filter(w => !DUPLICATE_ROLE.has(w))), y = new Set(b.filter(w => !DUPLICATE_ROLE.has(w))); let n = 0; for (const w of x) if (y.has(w)) n++; return n / Math.max(1, x.size + y.size - n); };

/**
 * Best first. The search score (log scale) is the base. A name that says the whole request is the strongest extra
 * signal (people type job titles), judged on each of an item's names separately; a catalogue stand-in for a typed
 * word ("resume" for "cv") counts at a discount; extra subject words in a name count slightly against it; a person's mind is
 * kept below methods unless the request names minds or the person; "Tested" only nudges, so it never buries
 * the right answer. Near-identical names doing the same job do not fill the top results twice.
 */
export function rankLibraryResults<B extends RankBlock>(blocks: B[], hits: Map<string, SearchHit>, query: string, { isTested, suggestion, scores }: Options<B>): B[] {
  const { hard, soft, alternatives, sequence, phrase } = queryTokens(query);
  // A typed word is also said by a catalogue stand-in, a near spelling, or a word it was split from ("tik tok" in "TikTok").
  const standIns: Record<string, string[]> = {}, joined: Record<string, string[]> = {};
  for (const t of [...hard, ...soft]) {
    const i = sequence.indexOf(t);
    standIns[t] = alternatives[t] ?? [];
    joined[t] = [...(i > 0 ? [sequence[i - 1] + t] : []), ...(i >= 0 && i + 1 < sequence.length ? [t + sequence[i + 1]] : [])];
  }
  // Whether a name word is a typed word, or says it, worked out once per pair (names share words across the catalogue).
  const typedWords = [...hard, ...soft];
  const memo = (test: (w: string, t: string) => boolean) => {
    const known = new Map(typedWords.map(t => [t, new Map<string, boolean>()]));
    return (w: string, t: string) => { const seen = known.get(t)!; let found = seen.get(w); if (found === undefined) seen.set(w, found = test(w, t)); return found; };
  };
  const same = memo(sameWord);
  const says = memo((w, t) => same(w, t) || standIns[t].some(a => sameWord(w, a)) || joined[t].includes(w) || begins(w, t) || nearly(t, w));
  const wantsMinds = /\b(?:minds?|experts?|thinkers?|people|person|who)\b/i.test(query);
  // Owners first: a developer's, investor's or researcher's item sits a little lower unless the request is theirs.
  const forSpecialist = SPECIALIST_REQUEST.test(query);
  const score = new Map<string, number>();
  for (const b of blocks) {
    const hit = hits.get(b.slug), words = nameWords(b);
    // A matched purpose ("Matches goal") counts like a literal match in the same field, so a name that says the
    // request can still lead; a format someone asked for keeps its lead (+1,000,000 in the search score).
    // A purpose match never counts for less than the plain words it also matched.
    const base = Math.log10(1 + Math.max((hit?.score ?? 0) / (hit?.reason?.startsWith("Matches goal") && (hit.score < 1_000_000) ? 25 : 1), hit?.literal ?? 0));
    // Share of the subject words a name says itself (a person's mind stays below methods unless it says them all).
    const typed = hard.length ? hard.filter(t => words.some(w => same(w, t))).length / hard.length : 0;
    // The best of its names; an other name (alias) counts a little less than the name shown. A name that says the
    // request and nothing else, role words aside, is the job title people typed. A name that says none of the
    // words cannot lift the item above one of its names that says some of them.
    let value = -Infinity;
    if (words.some(w => typedWords.some(t => says(w, t)))) nameVariants(b).forEach((name, i) => {
      // The word itself counts fully; a stand-in, near spelling or longer word at a discount. One name word
      // answers one typed word ("buyer" does not stand in for both "customer" and "client"); in one phrase a rule
      // rewrote ("ask for a raise"), the word that answered one of its words answers the rest at a lower rate.
      const used = new Map<string, number>();
      const credit = (t: string) => {
        const literal = name.find(w => same(w, t));
        if (literal) { used.set(literal, -1); return 1; }
        const w = name.find(w => !used.has(w) && says(w, t));
        if (w) { used.set(w, phrase[t] ?? -1); return 0.6; }
        return phrase[t] !== undefined && name.some(w => used.get(w) === phrase[t] && says(w, t)) ? 0.4 : 0;
      };
      const named = hard.length ? hard.reduce((sum, t) => sum + credit(t), 0) / hard.length : 0;
      const extras = soft.filter(t => credit(t) > 0).length;
      const unsaid = named > 0 ? name.filter(w => !ROLE.has(w) && !typedWords.some(t => says(w, t))).length : 0;
      if (named || extras) value = Math.max(value, 1.2 * named + (named === 1 ? 0.4 : 0) + 0.25 * Math.min(2, extras) - Math.min(0.4, 0.08 * unsaid) + (named === 1 && !unsaid && extras === soft.length ? EXACT : 0) - (i ? 0.1 : 0));
    });
    // A name that states the goal asked for ("Growth channel planner" for "more customers") says the request as
    // surely as one that repeats its words.
    if (hit?.reason?.startsWith("Matches goal") && hit.field === "title") value = Math.max(value, GOAL_NAMED);
    value = (value === -Infinity ? 0 : value) + base;
    if (b.type === "mind" && !wantsMinds && typed < 1) value -= 1.2;
    if (!forSpecialist && audienceOf(b) === "specialist") value -= SPECIALIST_NUDGE;
    if (isTested(b)) value += 0.15;
    if (b.slug === suggestion) value += 0.5;
    score.set(b.slug, value);
    scores?.set(b.slug, value);
  }
  const sorted = [...blocks].sort((a, b) => score.get(b.slug)! - score.get(a.slug)! || Number(isTested(b)) - Number(isTested(a)) || a.name.localeCompare(b.name));
  // Keep the first of each near-identical pair near the top; move the copy below the first ten.
  const top: B[] = [], later: B[] = [];
  for (const b of sorted) {
    if (top.length < 10 && top.some(t => t.task === b.task && jaccard(nameWords(t), nameWords(b)) >= 0.7)) later.push(b);
    else if (top.length < 10) top.push(b);
    else later.push(b);
  }
  return [...top, ...later];
}

/** How many results are strong matches (lib/library-search-core.ts SearchHit.strong): every subject word in the name
 *  or summary, or a stated purpose that matches. "Refund" mentions thousands of items; a handful are about refunds.
 *  Pass the ranked slugs to count only what is shown (the reviewed suggestion counts as strong). */
export function countStrongMatches(hits: Map<string, SearchHit>, among?: Iterable<string>, suggestion?: string): number {
  let n = 0;
  for (const slug of among ?? hits.keys()) if (hits.get(slug)?.strong || slug === suggestion) n++;
  return n;
}
