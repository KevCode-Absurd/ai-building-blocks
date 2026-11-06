// Public shapes for the directory API: what buyers see of a persona. Never includes method, source_roles or look,
// and never a price: hiring is free. Other modules (the MCP server, the home page) reuse these so every surface
// shows the same thing.
import { AREAS, type Area, type Persona, type PersonaOutcome, type PersonaSoul } from "../../core/types.ts";
import { getJobType, jobTypeSummary } from "../catalogue/index.ts";
import { getRole } from "./roles.ts";
import { megaCard, megaTeam, type TeamMember } from "./mega.ts";
import { soulView } from "./soul.ts";

// The personality lives in soul.ts (type imports only, so the browser app can use it too); re-exported for other modules.
export { SOUL_SECTIONS, soulMarkdown, soulView, splitVoice } from "./soul.ts";

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
  engineering: "Code and engineering",
  data: "Data and AI",
  design: "Design and media",
  learning: "Training and teaching",
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
  /** The job role this agent is hired for (directory/data/roles.json); /agents?role=<id> lists everyone in it. */
  role: { id: string; name: string } | null;
  /** A mega agent: the kind of business it is tailored to and how many channel specialists it leads. null otherwise. */
  mega: { variant: string; team_size: number } | null;
  portrait: string;
  accent: string;
  /** Up to three outcome titles. */
  outcomes: string[];
  /** The quickest turnaround among the outcomes that have a job type, in hours; null when none has one. */
  ready_in_hours: number | null;
}

export interface AgentOutcome { id: string; title: string; deliverable: string; job_type_id: string | null; job: JobSummary | null }

export interface AgentProfile extends Omit<AgentCard, "outcomes"> {
  bio: string;
  /** Every outcome, each joined to its job type summary (turnaround, deliverable). */
  outcomes: AgentOutcome[];
  capabilities: string[];
  good_at: string[];
  not_for: string[];
  /** Example requests; job_type_id is the outcome the request fits best, when that outcome has a job type. */
  samples: { title: string; brief: string; job_type_id: string | null }[];
  /** The agent's personality (its soul.md), or null while it has none. */
  soul: PersonaSoul | null;
  /** A mega agent's channel specialists, in order (one line each). Empty for everyone else. */
  team: TeamMember[];
}

const HEX = /^#[0-9A-Fa-f]{6}$/;
const PORTRAIT = /^\/agents\/[a-z0-9-]+\.webp$/;

/** The job type behind an outcome, if the catalogue has it. */
export function outcomeJob(o: PersonaOutcome): JobSummary | null {
  const jt = getJobType(o.job_type_id);
  return jt ? jobTypeSummary(jt) : null;
}

/** The quickest turnaround among the persona's outcomes that have a job type. */
export function readyIn(p: Persona): number | null {
  const hours = (p.profile.outcomes ?? []).map(o => outcomeJob(o)?.turnaround_hours).filter((n): n is number => typeof n === "number" && n > 0);
  return hours.length ? Math.min(...hours) : null;
}

/** The persona's job role as { id, name }, or null when it has none or the id is not in the role list. */
export function roleRef(p: Persona): { id: string; name: string } | null {
  const role = getRole(p.role);
  return role ? { id: role.id, name: role.name } : null;
}

export function agentCard(p: Persona): AgentCard {
  return {
    id: p.id, kind: p.kind, name: p.name, title: p.title, tagline: p.tagline, area: p.area, area_label: areaLabel(p.area),
    role: roleRef(p),
    mega: megaCard(p),
    portrait: PORTRAIT.test(p.profile.portrait ?? "") ? p.profile.portrait : `/agents/${p.id}.webp`,
    accent: HEX.test(p.profile.accent ?? "") ? p.profile.accent : "#0A0A0A",
    outcomes: (p.profile.outcomes ?? []).slice(0, 3).map(o => o.title),
    ready_in_hours: readyIn(p),
  };
}

const STOP = new Set("a an and the of for to in on with your my our you we i me us is are be it this that from by as at or into out up about can will what how who".split(" "));
const words = (text: string) => new Set(text.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2 && !STOP.has(w)).map(w => w.replace(/(ies|es|s)$/, "")));

/** The outcome with a job type that an example request fits best (most shared words), or null when none has one. */
export function sampleJob(p: Persona, sample: { title: string; brief: string }): string | null {
  const withJob = (p.profile.outcomes ?? []).filter(o => outcomeJob(o));
  if (!withJob.length) return null;
  const ask = words(`${sample.title} ${sample.brief}`);
  let best: { id: string; score: number } | null = null;
  for (const o of withJob) {
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
    soul: soulView(p),
    team: megaTeam(p),
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

/**
 * The order areas take on the home page's "Meet a few of the agents": it leads with variety (marketing, then code,
 * data and design), so the first few cards show different kinds of work, not six marketers.
 */
export const FEATURED_AREA_ORDER: readonly Area[] = [
  "marketing", "engineering", "data", "design", "sales", "customer-support", "content",
  "research", "finance", "people", "operations", "product", "ecommerce", "learning",
];

/**
 * Agents for the home page: the best-ranked agent (lowest sort, then name) from each area, in FEATURED_AREA_ORDER,
 * skipping areas with no agent. Areas missing from that order come after it, in AREAS order. If count is more than
 * the number of areas, the rest are the next best agents not picked yet. Stable: the same list gives the same picks.
 */
export function pickFeatured(list: Persona[], count = 6): Persona[] {
  const sorted = [...list].sort((a, b) => a.sort - b.sort || a.name.localeCompare(b.name) || a.id.localeCompare(b.id));
  const order = [...FEATURED_AREA_ORDER, ...AREAS.filter(a => !FEATURED_AREA_ORDER.includes(a))];
  const picks: Persona[] = [];
  for (const area of order) {
    if (picks.length >= count) break;
    const best = sorted.find(p => p.area === area);
    if (best) picks.push(best);
  }
  for (const p of sorted) {
    if (picks.length >= count) break;
    if (!picks.includes(p)) picks.push(p);
  }
  return picks;
}
