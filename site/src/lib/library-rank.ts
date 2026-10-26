/** Orders library search matches. Shared by the library page (App.tsx) and the offline evaluation
 *  (scripts/evaluate-recommendations.mjs), so what is measured is what ships. No network, no model. */
import { queryTokens, searchTokens, type SearchHit } from "./library-search-core.ts";

export type RankBlock = { slug: string; name: string; aliases?: string[]; type?: string; task?: string; headline?: string };
type Options<B> = { isTested: (b: B) => boolean; suggestion?: string };

// Role words say what kind of tool it is, not what it is about; they never count against a name.
const ROLE = new Set(["writer", "write", "planner", "plan", "checker", "check", "builder", "build", "maker", "make", "reviewer", "review", "finder", "find", "analyst", "analyse", "tool", "guide", "helper", "creator", "designer", "design", "drafter", "draft", "editor", "generator", "agent", "workflow", "prompt", "skill", "coach", "assistant", "reader", "tracker", "auditor", "audit", "scorer", "picker"]);
const names = new WeakMap<object, string[]>();
const nameWords = (b: RankBlock) => { let found = names.get(b); if (!found) names.set(b, (found = searchTokens(`${b.name} ${(b.aliases ?? []).join(" ")}`))); return found; };
const covers = (words: string[], token: string) => words.some(w => w === token || token.length >= 4 && w.startsWith(token) || w.length >= 4 && token.startsWith(w));
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
const jaccard = (a: string[], b: string[]) => { const x = new Set(a.filter(w => !ROLE.has(w))), y = new Set(b.filter(w => !ROLE.has(w))); let n = 0; for (const w of x) if (y.has(w)) n++; return n / Math.max(1, x.size + y.size - n); };

/**
 * Best first. The search score (log scale) is the base. A name that says the whole request is the strongest extra
 * signal (people type job titles); extra subject words in a name count slightly against it; a person's mind is
 * kept below methods unless the request names minds or the person; "Tested" only nudges, so it never buries
 * the right answer. Near-identical names doing the same job do not fill the top results twice.
 */
export function rankLibraryResults<B extends RankBlock>(blocks: B[], hits: Map<string, SearchHit>, query: string, { isTested, suggestion }: Options<B>): B[] {
  const { hard, soft, alternatives, sequence } = queryTokens(query);
  // A typed word is also said by a catalogue stand-in, a near spelling, or a word it was split from ("tik tok" in "TikTok").
  const standIns: Record<string, string[]> = {}, joined: Record<string, string[]> = {};
  for (const t of [...hard, ...soft]) {
    const i = sequence.indexOf(t);
    standIns[t] = alternatives[t] ?? [];
    joined[t] = [...(i > 0 ? [sequence[i - 1] + t] : []), ...(i >= 0 && i + 1 < sequence.length ? [t + sequence[i + 1]] : [])];
  }
  const said = (words: string[], t: string) => covers(words, t) || standIns[t].some(a => covers(words, a)) || joined[t].some(a => words.includes(a)) || words.some(w => nearly(t, w));
  const wantsMinds = /\b(?:minds?|experts?|thinkers?|people|person|who)\b/i.test(query);
  const score = new Map<string, number>();
  for (const b of blocks) {
    const hit = hits.get(b.slug), words = nameWords(b);
    // A matched purpose ("Matches goal") counts like a literal match in the same field, so a name that says the
    // request can still lead; a format someone asked for keeps its lead (+1,000,000 in the search score).
    const base = Math.log10(1 + (hit?.score ?? 0) / (hit?.reason?.startsWith("Matches goal") && (hit.score < 1_000_000) ? 25 : 1));
    // A catalogue stand-in for a typed word ("resume" for "cv") counts, at a discount.
    const typed = hard.length ? hard.filter(t => covers(words, t)).length / hard.length : 0;
    const named = hard.length ? hard.reduce((sum, t) => sum + (covers(words, t) ? 1 : said(words, t) ? 0.6 : 0), 0) / hard.length : 0;
    const extras = soft.filter(t => said(words, t)).length;
    let value = base + 1.2 * named + (named === 1 ? 0.4 : 0) + 0.25 * Math.min(2, extras);
    if (named > 0) value -= Math.min(0.4, 0.08 * words.filter(w => !ROLE.has(w) && ![...hard, ...soft].some(t => said([w], t))).length);
    if (b.type === "mind" && !wantsMinds && typed < 1) value -= 1.2;
    if (isTested(b)) value += 0.15;
    if (b.slug === suggestion) value += 0.5;
    score.set(b.slug, value);
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
