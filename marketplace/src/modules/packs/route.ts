// Deterministic routing of a request to the best skill or workflow of a pack, and of a job type to the role kit's
// own method. No model: the same word scoring as the intake classifier (intake/fakes.ts scoreJobType): stemmed words,
// stop words dropped, name words weigh more than description words, and words many candidates share weigh less.
// Shared by the pack builder (job skill -> kit skill pointer) and the MCP load_agent tool (request -> skill).

const STOP = new Set("a an and the of for to in on with your my our you we i me us is are be it this that from by as at or into out up about can will what how who per new one use when need needs want make get help do".split(" "));
const stem = (w: string) => w.replace(/ies$/, "y").replace(/(?<=[a-z]{3})(es|s)$/, "");
export const wordsOf = (text: string): Set<string> =>
  new Set(text.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2 && !STOP.has(w)).map(stem));

/** One thing a request can be routed to. `name` words (title, skill name, keywords) weigh more than `text` words. */
export interface RouteCandidate { path: string; kind: "job" | "skill" | "workflow"; name: string; text: string }
export interface RouteMatch { candidate: RouteCandidate; score: number; matched: string[] }

/** The lowest score that counts as a match: one rare shared name word, or a few weak ones. */
export const MIN_ROUTE_SCORE = 0.6;

/** Candidates ranked by score (highest first, then path), with the words that matched. Below MIN_ROUTE_SCORE dropped. */
export function rankRoutes(request: string, candidates: RouteCandidate[], min = MIN_ROUTE_SCORE): RouteMatch[] {
  const asked = wordsOf(request);
  const strong = candidates.map(c => wordsOf(c.name));
  const weak = candidates.map((c, i) => new Set([...wordsOf(c.text)].filter(w => !strong[i].has(w))));
  const df = new Map<string, number>();
  candidates.forEach((_, i) => { for (const w of new Set([...strong[i], ...weak[i]])) df.set(w, (df.get(w) ?? 0) + 1); });
  const out: RouteMatch[] = [];
  candidates.forEach((candidate, i) => {
    let score = 0;
    const matched: string[] = [];
    for (const [set, weight] of [[strong[i], 1], [weak[i], 0.35]] as const) {
      for (const w of set) {
        if (!asked.has(w)) continue;
        score += weight / (df.get(w) ?? 1);
        matched.push(w);
      }
    }
    // A whole multi-word name in the request ("landing page copy") is a strong sign.
    const phrase = candidate.name.toLowerCase().replace(/[-_]+/g, " ").trim();
    if (phrase.includes(" ") && request.toLowerCase().replace(/[-_]+/g, " ").includes(phrase)) score += 1;
    if (score >= min) out.push({ candidate, score: Math.round(score * 1000) / 1000, matched });
  });
  return out.sort((a, b) => b.score - a.score || (a.candidate.path < b.candidate.path ? -1 : a.candidate.path > b.candidate.path ? 1 : 0));
}

export function bestRoute(request: string, candidates: RouteCandidate[], min = MIN_ROUTE_SCORE): RouteMatch | null {
  return rankRoutes(request, candidates, min)[0] ?? null;
}

/** "## " sections of a markdown file, in order, each with its heading and full text. Text before the first is "". */
export function markdownSections(md: string): { heading: string; text: string }[] {
  const out: { heading: string; text: string }[] = [];
  let fence = false, current = { heading: "", lines: [] as string[] };
  for (const line of md.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    if (!fence && /^## /.test(line)) {
      out.push({ heading: current.heading, text: current.lines.join("\n").trim() });
      current = { heading: line.slice(3).trim(), lines: [line] };
    } else current.lines.push(line);
  }
  out.push({ heading: current.heading, text: current.lines.join("\n").trim() });
  return out.filter(s => s.text);
}

/**
 * The sections of a knowledge file most relevant to a request, within a character budget, in file order. The
 * role's decision rules, quality bar and common mistakes always rank as relevant: they steer every job.
 */
export function relevantSections(md: string, request: string, budget: number): { heading: string; text: string }[] {
  const sections = markdownSections(md).filter(s => s.heading);
  const asked = wordsOf(request);
  const scored = sections.map((s, i) => {
    let score = 0;
    for (const w of wordsOf(s.text)) if (asked.has(w)) score += 1;
    for (const w of wordsOf(s.heading)) if (asked.has(w)) score += 3;
    if (/decision rules|quality bar|common mistakes|my specialty/i.test(s.heading)) score += 4;
    return { s, i, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score || a.i - b.i);
  const picked: typeof scored = [];
  let used = 0;
  for (const x of scored) {
    if (used + x.s.text.length > budget) continue;
    picked.push(x);
    used += x.s.text.length;
  }
  return picked.sort((a, b) => a.i - b.i).map(x => x.s);
}
