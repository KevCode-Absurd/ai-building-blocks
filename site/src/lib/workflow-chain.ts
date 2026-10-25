import type { Block, Catalogue } from "./data";
import { retrieve, terms } from "./composer-core";
import { replacementOptions } from "./custom-skills";
import { buildLibrarySearchIndex, searchLibraryIndex, searchTokens, type LibrarySearchIndex } from "./library-search-core";
import { searchIntents, searchIntentExclusions } from "./library-search-intents";

export type ChainDirection = "before" | "after";
export type ChainSuggestion = { b: Block; why: string };
const eligible = (b: Block) => (b.type === "skill" || b.type === "prompt") && b.category !== "orchestrator" && b.execution !== "coordinator";
const cap = (limit: number) => Math.max(0, Math.min(5, Math.floor(limit) || 0));
const label = (port: string) => port.replace(/_/g, " ");
const GENERIC_PORTS = new Set(["brief", "source_text", "text", "document", "report", "plan", "request", "requirements", "output", "notes", "content"]);
const NOISE = new Set(terms("skill prompt workflow make create build write draft review check audit test research analysis plan report source text brief document input output request task general business prepare result supplied information instructions use step"));
// Task categories such as "work with files" are too broad to establish a shared subject.
const topic = (b: Block) => new Set(terms(`${b.name} ${b.summary}`).filter(t => !NOISE.has(t)));
const PUBLIC_INDEX = new WeakMap<Catalogue, LibrarySearchIndex>();
function matchingSkills(c: Catalogue, goal: string): Block[] {
  if (!goal.trim()) return [];
  let index = PUBLIC_INDEX.get(c);
  if (!index) {
    index = buildLibrarySearchIndex(c.blocks.filter(eligible).map(b => ({ slug: b.slug, title: b.name,
      summary: `${b.summary} ${b.headline} ${(b.aliases ?? []).join(" ")}`, excludeIntents: searchIntentExclusions(b.task) })), c.sourceHash ?? "public-metadata");
    PUBLIC_INDEX.set(c, index);
  }
  const publicMatches = [...searchLibraryIndex(index, goal)].sort((a, b) => b[1].score - a[1].score || a[0].localeCompare(b[0])).map(([slug]) => c.bySlug[slug]);
  const fallback = retrieve(c, goal, 64).map(part => c.bySlug[part.slug]);
  return [...new Map([...publicMatches, ...fallback].filter(Boolean).map(b => [b.slug, b])).values()].slice(0, 64);
}
const goalFits = (b: Block, goal: string) => {
  const wanted = searchTokens(goal).filter(t => !NOISE.has(t));
  const publicText = `${b.name} ${b.summary} ${b.headline} ${(b.aliases ?? []).join(" ")}`;
  const text = new Set(searchTokens(publicText, true));
  const purpose = new Set(searchIntents(publicText, true).filter(intent => !searchIntentExclusions(b.task).includes(intent.id)).map(intent => intent.id));
  return searchIntents(goal).some(intent => purpose.has(intent.id)) || !wanted.length || wanted.some(t => text.has(t));
};

/** These are choices for ONE step. This function never builds or changes a workflow. */
export function firstSkillSuggestions(c: Catalogue, goal: string, inFlow = new Set<string>(), limit = 5): ChainSuggestion[] {
  const firsts = new Set(c.blocks.filter(b => b.category === "orchestrator").map(b => b.steps[0]?.uses).filter(Boolean));
  const query = goal.trim();
  const candidates = query ? matchingSkills(c, query) : c.blocks;
  const wantsCheck = /\b(check|review|audit|test|evaluate|assess)\b/i.test(query);
  return candidates.filter(b => eligible(b) && !inFlow.has(b.slug) && (!query || goalFits(b, query))).map((b, i) => {
    const source = b.role === "source" || b.role === "compress";
    const easyInput = b.inputs.filter(p => p.required).length <= 1;
    const score = query ? 80 - i + (firsts.has(b.slug) ? 0.75 : 0) + (source ? 0.5 : 0) + (easyInput ? 0.25 : 0) - (!wantsCheck && b.role === "check" ? 1 : 0)
      : Math.min(b.usedIn, 10) + (firsts.has(b.slug) ? 8 : 0) + (source ? 4 : 0) + (easyInput ? 2 : 0);
    return { b, score, why: query ? "Matches your goal. Check what it needs before adding it." : firsts.has(b.slug) ? "Used as a first step in a ready workflow." : "One possible starting point. Check that it fits your task." };
  }).filter(x => query || firsts.has(x.b.slug) || x.b.usedIn > 0 || x.b.role === "source")
    .sort((a, b) => b.score - a.score || a.b.slug.localeCompare(b.b.slug)).slice(0, cap(limit)).map(({ b, why }) => ({ b, why }));
}

/** Ready-workflow neighbors are the strongest evidence. Declared ports are suggestions,
 * not proof that two skills fit: generic ports also need a shared task or subject. */
export function chainSuggestions(c: Catalogue, anchorSlug: string, inFlow: Set<string>, goal: string, direction: ChainDirection, limit = 5): ChainSuggestion[] {
  const anchor = c.bySlug[anchorSlug];
  if (!anchor || !eligible(anchor)) return [];
  const proven = new Map<string, number>();
  for (const flow of c.blocks.filter(b => b.category === "orchestrator" && b.execution !== "coordinator")) {
    flow.steps.forEach((step, i) => {
      if (step.uses !== anchorSlug) return;
      const neighbor = flow.steps[i + (direction === "before" ? -1 : 1)];
      if (neighbor) proven.set(neighbor.uses, (proven.get(neighbor.uses) ?? 0) + 1);
    });
  }
  const goalRanks = new Map(matchingSkills(c, goal).map((b, i) => [b.slug, i]));
  const anchorTopic = topic(anchor);
  const anchorPorts = new Set((direction === "before" ? anchor.inputs : anchor.outputs).map(p => p.type));
  return c.blocks.filter(b => eligible(b) && b.slug !== anchorSlug && !inFlow.has(b.slug)).flatMap(b => {
    const ports = (direction === "before" ? b.outputs : b.inputs).filter(p => anchorPorts.has(p.type));
    const sameTask = !!b.task && b.task !== "set-up-ai" && b.task === anchor.task;
    const shared = [...topic(b)].filter(t => anchorTopic.has(t)).length;
    const sharedJob = !!b.job && b.job !== "ops" && b.job === anchor.job;
    const context = shared >= 2 || shared >= 1 && (sameTask || sharedJob);
    const specific = ports.find(p => !GENERIC_PORTS.has(p.type));
    // A query can narrow a match, but a loose match for "brief" must not bridge unrelated jobs.
    const matchesGoal = !goal.trim() || goalRanks.has(b.slug) && goalFits(b, goal);
    const typed = ports.length > 0 && matchesGoal && (context || !!specific);
    const count = proven.get(b.slug) ?? 0;
    if (!count && !typed) return [];
    const port = specific ?? ports[0];
    const why = count ? `Used ${direction === "before" ? "before" : "after"} this step in a ready workflow. Check the fit.`
      : direction === "before" ? `May provide ${label(port.type)} for this step. Check the fit.` : `May use this step’s ${label(port.type)}. Check the fit.`;
    return [{ b, why, score: count * 1000 + (context ? 20 : 0) + (specific ? 10 : 0) + (goalRanks.has(b.slug) ? (64 - goalRanks.get(b.slug)!) / 64 : 0) }];
  }).sort((a, b) => b.score - a.score || a.b.slug.localeCompare(b.b.slug)).slice(0, cap(limit)).map(({ b, why }) => ({ b, why }));
}

/** Reuse the repository's task/artifact ranking; never claim equivalent behavior from a shared port. */
export function replacementSuggestions(c: Catalogue, anchorSlug: string, inFlow: Set<string>, goal: string, limit = 5): ChainSuggestion[] {
  const anchor = c.bySlug[anchorSlug];
  if (!anchor || !eligible(anchor)) return [];
  const anchorTopic = topic(anchor);
  return replacementOptions(c, anchor, goal).map(part => c.bySlug[part.slug]).filter(b => {
    if (!b || !eligible(b) || inFlow.has(b.slug)) return false;
    const sameTask = !!b.task && b.task !== "set-up-ai" && b.task === anchor.task;
    const shared = [...topic(b)].filter(t => anchorTopic.has(t)).length;
    return shared >= 2 || sameTask && shared >= 1 || !!goal.trim() && goalFits(b, goal);
  }).slice(0, cap(limit)).map(b => ({ b, why: b.outputs.some(p => anchor.outputs.some(out => out.type === p.type))
    ? "Shares an output type. Review its inputs and instructions before replacing."
    : "A related option. Check its inputs and output before replacing." }));
}
