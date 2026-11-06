// Public shapes for the directory API: what buyers see of a persona. Never includes method, source_roles or look.
// Other modules (the MCP server, the home page) can reuse these so every surface shows the same thing.
import { AREAS, type Area, type Persona, type PersonaOutcome } from "../../core/types.ts";
import { getJobType, jobTypeSummary } from "../catalogue/index.ts";

export const AREA_LABELS: Record<Area, string> = {
  marketing: "Marketing",
  content: "Content",
  sales: "Sales",
  ecommerce: "Ecommerce",
  "customer-support": "Customer support",
  research: "Research",
  finance: "Finance",
  people: "People and HR",
  operations: "Operations",
  product: "Product",
};

export const areaLabel = (area: string) => AREA_LABELS[area as Area] ?? area;

export type JobSummary = ReturnType<typeof jobTypeSummary>;

export interface AgentCard {
  id: string;
  kind: Persona["kind"];
  name: string;
  title: string;
  tagline: string;
  area: string;
  area_label: string;
  portrait: string;
  accent: string;
  /** Up to three outcome titles. */
  outcomes: string[];
  /** Lowest min price among the outcomes' job types; null when no outcome has a job type yet. */
  price_from_usd: number | null;
}

export interface AgentOutcome { id: string; title: string; deliverable: string; job_type_id: string | null; job: JobSummary | null }

export interface AgentProfile extends Omit<AgentCard, "outcomes"> {
  bio: string;
  /** Every outcome, each joined to its job type summary (price from, base price, turnaround, deliverable). */
  outcomes: AgentOutcome[];
  capabilities: string[];
  good_at: string[];
  not_for: string[];
  /** Example requests; job_type_id is the outcome the request fits best, when that outcome has a job type. */
  samples: { title: string; brief: string; job_type_id: string | null }[];
}

const HEX = /^#[0-9A-Fa-f]{6}$/;
const PORTRAIT = /^\/agents\/[a-z0-9-]+\.webp$/;

/** The job type behind an outcome, if the catalogue has it. */
export function outcomeJob(o: PersonaOutcome): JobSummary | null {
  const jt = getJobType(o.job_type_id);
  return jt ? jobTypeSummary(jt) : null;
}

export function priceFrom(p: Persona): number | null {
  const prices = (p.profile.outcomes ?? []).map(o => outcomeJob(o)?.price_from_usd).filter((n): n is number => typeof n === "number");
  return prices.length ? Math.min(...prices) : null;
}

export function agentCard(p: Persona): AgentCard {
  return {
    id: p.id, kind: p.kind, name: p.name, title: p.title, tagline: p.tagline, area: p.area, area_label: areaLabel(p.area),
    portrait: PORTRAIT.test(p.profile.portrait ?? "") ? p.profile.portrait : `/agents/${p.id}.webp`,
    accent: HEX.test(p.profile.accent ?? "") ? p.profile.accent : "#0A0A0A",
    outcomes: (p.profile.outcomes ?? []).slice(0, 3).map(o => o.title),
    price_from_usd: priceFrom(p),
  };
}

const STOP = new Set("a an and the of for to in on with your my our you we i me us is are be it this that from by as at or into out up about can will what how who".split(" "));
const words = (text: string) => new Set(text.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2 && !STOP.has(w)).map(w => w.replace(/(ies|es|s)$/, "")));

/** The priced outcome an example request fits best (most shared words), or null when none is priced. */
export function sampleJob(p: Persona, sample: { title: string; brief: string }): string | null {
  const priced = (p.profile.outcomes ?? []).filter(o => outcomeJob(o));
  if (!priced.length) return null;
  const ask = words(`${sample.title} ${sample.brief}`);
  let best: { id: string; score: number } | null = null;
  for (const o of priced) {
    const have = words(`${o.title} ${o.deliverable} ${o.job_type_hint ?? ""}`);
    let score = 0;
    for (const w of ask) if (have.has(w)) score++;
    if (!best || score > best.score) best = { id: o.job_type_id!, score };
  }
  return best && best.score > 0 ? best.id : null;
}

export function agentProfile(p: Persona): AgentProfile {
  return {
    ...agentCard(p),
    bio: p.profile.bio ?? "",
    outcomes: (p.profile.outcomes ?? []).map(o => {
      const job = outcomeJob(o);
      return { id: o.id, title: o.title, deliverable: o.deliverable, job_type_id: job ? job.id : null, job };
    }),
    capabilities: p.profile.capabilities ?? [],
    good_at: p.profile.good_at ?? [],
    not_for: p.profile.not_for ?? [],
    samples: (p.profile.samples ?? []).map(s => ({ title: s.title, brief: s.brief, job_type_id: sampleJob(p, s) })),
  };
}

/** Up to `limit` other agents in the same area, starting just after this one so each profile shows different neighbours. */
export function relatedAgents(p: Persona, sameArea: Persona[], limit = 4): Persona[] {
  const others = sameArea.filter(x => x.id !== p.id && x.area === p.area);
  if (others.length <= limit) return others;
  const start = Math.max(0, sameArea.findIndex(x => x.id === p.id));
  return Array.from({ length: limit }, (_, i) => others[(start + i) % others.length]);
}

/**
 * Filter chips in AREAS order: every area that has a live agent (so chips do not jump while someone types),
 * each with the number of agents that match the search.
 */
export function areaCounts(everyone: Persona[], matching: Persona[] = everyone): { id: Area; label: string; count: number }[] {
  const present = new Set(everyone.map(p => p.area));
  const counts = new Map<string, number>();
  for (const p of matching) counts.set(p.area, (counts.get(p.area) ?? 0) + 1);
  return AREAS.filter(a => present.has(a)).map(a => ({ id: a, label: AREA_LABELS[a], count: counts.get(a) ?? 0 }));
}
