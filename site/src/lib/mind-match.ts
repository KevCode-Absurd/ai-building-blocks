// Which minds know a topic: the step panel's suggestions (crew.ts suggestMinds), the "minds who know this" row on a
// library search and the order of the Minds page search. Plain code, so the same words always give the same minds.
//
// A mind's profile is what it is known for, weighted by how directly it says so: its name, what it is known for
// (seats), who it is (identity) and its role labels count most, the jobs people bring to it (use cases) and the skills
// built from its work next, its summary and areas least. A topic's words count by how rare they are among minds.
import type { Block, Catalogue } from "./data.ts";
import { queryTokens, searchTokens } from "./library-search-core.ts";

type Profile = { slug: string; weight: Map<string, number>; works: number };
const PLACE_CAP = 6;
const PROFILES = new WeakMap<Catalogue, { profiles: Profile[]; idf: Map<string, number> }>();

function profilesOf(c: Catalogue) {
  let found = PROFILES.get(c);
  if (found) return found;
  const roster = new Map((c.minds?.roster ?? []).map(r => [r.slug, r]));
  const labelName = (id: string) => c.minds?.labels?.[id] ?? id.replace(/-/g, " ");
  const areaName = (id: string) => c.minds?.areas?.[id] ?? id;
  const profiles = c.blocks.filter(b => b.type === "mind").map(m => {
    const weight = new Map<string, number>();
    // A word in several places (a seat, the keywords, an area) counts for more than one strong place: the mind is broadly
    // known for it. Capped, so no single word decides.
    const put = (text: string | undefined, w: number) => { if (text) for (const t of new Set(searchTokens(text, true))) weight.set(t, Math.min(PLACE_CAP, (weight.get(t) ?? 0) + w)); };
    put(m.name.split(" (")[0], 3);
    for (const s of m.seats ?? []) put(s, 3);
    put(m.identity ?? roster.get(m.slug)?.identity, 2.5);
    for (const l of m.labels ?? roster.get(m.slug)?.labels ?? []) put(labelName(l), 2);
    for (const u of roster.get(m.slug)?.useCases ?? []) put(u, 2);
    put(m.cues, 2); // the everyday words people use for this mind's fields (catalogue-items/search-asks.json)
    for (const s of m.skills ?? []) put(c.bySlug[s]?.name, 1.5);
    put(m.summary, 1);
    for (const a of [m.area, ...(m.also ?? [])]) if (a) put(areaName(a), 1);
    return { slug: m.slug, weight, works: (m.skills ?? []).length + ((m as Block & { flows?: string[] }).flows ?? []).length };
  });
  const df = new Map<string, number>();
  for (const p of profiles) for (const t of p.weight.keys()) df.set(t, (df.get(t) ?? 0) + 1);
  const idf = new Map([...df].map(([t, n]) => [t, Math.log(1 + profiles.length / n)]));
  PROFILES.set(c, (found = { profiles, idf }));
  return found;
}

export type MindFit = { mind: Block; score: number };
/** Minds for a topic, best first. `parts` are [text, weight] pairs (a step's name counts more than its summary); a
 *  typed word met only through one of its everyday stand-ins counts at a discount. `score` is the share of the topic's
 *  weighted words the mind's profile says, 0 to 1. */
export function mindsFor(c: Catalogue, parts: [string, number][], limit = 5, floor = 0.12, prominence = 0): MindFit[] {
  const { profiles, idf } = profilesOf(c);
  const want = new Map<string, number>(), alt = new Map<string, string[]>();
  for (const [text, w] of parts) {
    if (!text) continue;
    const q = queryTokens(text);
    for (const t of q.hard) want.set(t, Math.max(want.get(t) ?? 0, w));
    for (const t of q.soft) want.set(t, Math.max(want.get(t) ?? 0, w * 0.4));
    for (const [t, a] of Object.entries(q.alternatives)) alt.set(t, [...(alt.get(t) ?? []), ...a]);
  }
  // Words no mind uses carry no signal about who knows the topic.
  const words = [...want].filter(([t]) => idf.has(t) || (alt.get(t) ?? []).some(a => idf.has(a)));
  const total = words.reduce((s, [t, w]) => s + w * (idf.get(t) ?? Math.max(...(alt.get(t) ?? []).map(a => idf.get(a) ?? 0))) * 3, 0);
  if (!total) return [];
  return profiles.map(p => {
    let said = 0;
    for (const [t, w] of words) {
      const direct = p.weight.get(t);
      if (direct) { said += w * (idf.get(t) ?? 0) * direct; continue; }
      const stand = Math.max(0, ...(alt.get(t) ?? []).map(a => (p.weight.get(a) ?? 0) * (idf.get(a) ?? 0)));
      said += w * stand * 0.6;
    }
    // `prominence` (topic searches only) lifts the minds the most library work builds on (their skills and workflows):
    // it mostly settles ties between people who say the same words, in favour of the one people know best for them.
    return { mind: c.bySlug[p.slug], score: (said / total) * (1 + prominence * Math.log2(1 + p.works)) };
  }).filter(x => x.mind && x.score >= floor).sort((a, b) => b.score - a.score || a.mind.name.localeCompare(b.mind.name)).slice(0, limit);
}

/** The words of a step that say what it is about: its name and headline count most, then its summary, then the
 *  everyday words people use for it. */
export const stepTopic = (b: Block): [string, number][] => [[`${b.name} ${(b.aliases ?? []).join(" ")}`, 2], [b.headline ?? "", 1.5], [b.summary, 1], [b.cues ?? "", 0.5]];

/** The Minds page search order: a mind whose name was typed leads, then the minds best known for the topic, then the
 *  rest of the library search's matches in its own order. `matched` is the library search's minds, already ranked;
 *  minds known for the topic join them even when no word of their page matched. */
export function mindSearchOrder(c: Catalogue, query: string, matched: string[], allowed: (slug: string) => boolean = () => true): string[] {
  const terms = queryTokens(query).sequence;
  const named = matched.filter(s => { const words = searchTokens(c.bySlug[s]?.name ?? "", true); return terms.length > 0 && terms.every(t => words.includes(t)); });
  const fits = mindsFor(c, [[query, 1]], 40, undefined, TOPIC_PROMINENCE).filter(f => allowed(f.mind.slug)).map(f => f.mind.slug);
  return [...new Set([...named, ...fits, ...matched])];
}

/** How clearly a mind must fit a library search to be named above its results (scripts/evaluate-minds.mjs `row`). */
export const SEARCH_ROW_FLOOR = 0.8;
/** How clearly a mind must fit a step to be named as a fit for it (the AI builder's fitting_minds). */
export const CLEAR_FIT = 0.5;
/** The lift a topic search gives the minds most library work builds on (scripts/evaluate-minds.mjs, dev half). */
export const TOPIC_PROMINENCE = 0.04;
