// What owners see of the outcome orchestrator: the message that starts a job, the worked example as a walkthrough,
// and where a job stands from its engagement.json. Pure functions over the orchestrator's own code (src/outcomes),
// shared by the pages, the prerendered HTML and the tests. Nothing here calls a model, the network or storage.
import { advanceEngagement, checkEngagement, describeEngagement, gateFor, startEngagement } from "../outcomes/engagement.mjs";
import { planWarnings, validateBrief, validatePlan, validateResearch } from "../outcomes/plan-contract.mjs";
import example from "../outcomes/examples/rising-cpa.mjs";

export { BRIEF_QUESTIONS, JOB_MAX, MCP_URL, OUTCOME_PATHS, looksLikeSecret, outcomeMessage } from "./owner-message.ts";

export const KIND_LABEL: Record<string, string> = {
  intake: "The brief", context: "Know the business", evidence: "Gather the data", integrity: "Check the data can be trusted",
  diagnosis: "Find the cause", options: "Rank the options", decision: "You choose", production: "Make the work",
  execution: "Go live", measurement: "Read the results", learning: "Keep what was learned",
};
export const GATE_LABEL: Record<string, string> = {
  none: "Runs without stopping. You see what it found later.",
  review: "Stops so you can look over the work before it is used.",
  approve: "Stops for your choice.",
  approve_each_action: "Stops before each live action for your yes.",
};

/** "meta-results-review-agent" reads as "Meta results review agent". */
export const humanize = (id: string) => { const s = id.replace(/-/g, " "); return s.charAt(0).toUpperCase() + s.slice(1); };

export type Source = { id: string; kind: string; title: string; ref: string; date: string | null; note: string | null };
export type Stop = { title: string; detail: string; stage: string | null; n: number | null };
export type WalkStage = {
  n: number; id: string; name: string; kind: string; kindLabel: string; goal: string; owner: string | null; gap: string | null;
  support: string[]; reviewers: string[]; uses: string[]; outputs: string[]; checks: string[]; gate: string; gateLabel: string; live: boolean; optionalWhen: string | null;
};

type Example = typeof example;
/** The checked brief (validateBrief), typed for the pages. */
export type Brief = {
  outcome: string; deliverable: string; done: string[]; deadline: string | null; guardrails: string[]; limits: string[]; assets: string[];
  metric: { name: string; direction: string; unit: string; baseline: number | null; baseline_source: string; target: number | null } | null;
  connections: { name: string; access: string; status: string }[]; data_home: string; technical_level: string | null; decides: string; unknowns: string[];
  answers: { question: string; answer: string }[];
};
// plan-contract.mjs collects every problem through closures, so TypeScript cannot infer what its validators return.
// These are the fields the owner pages read from a validated plan and research.
type Named = { id: string; name: string };
type Stage = Named & {
  kind: string; goal: string; owner: { role?: string | null; gap?: string | null }; support: string[]; reviewers: string[]; uses: string[];
  needs: string[]; outputs: Named[]; checks: Named[]; gate: string; optional_when: string | null;
};
type Plan = {
  name: string; stages: Stage[]; capabilities: (Named & { access: string; why: string })[];
  hypotheses: { statement: string; test: string }[]; dropped: { step: string; reason: string }[]; measurement: { window?: string; min_volume?: string; stop_rule?: string } | null;
};
type Research = { approach: string; steps: (Named & { why: string; sources: string[] })[]; pitfalls: { text: string; sources: string[] }[]; sources: unknown[] };

function stopFor(s: Stage, n: number): Stop {
  const at = { stage: s.name, n };
  if (s.gate === "approve") return { ...at, title: "Choose what to do", detail: "You pick which changes to make from a ranked list. If you pass over the top one, your AI asks why and writes your reason down." };
  if (s.gate === "approve_each_action") return { ...at, title: "Approve each live action", detail: "Your AI asks before each change that goes live, one at a time. Nothing goes live until you say yes to that change." };
  return { ...at, title: "Look over the work", detail: "You see the work before it is used, then approve it or ask for changes." };
}
const PLAN_STOP: Stop = { stage: null, n: null, title: "Approve the plan", detail: "Nothing runs until you say yes. Ask for changes and your AI rebuilds the plan." };

/** The worked example as owner-facing screens. Built from the example's own data, so it stays true when the example changes. */
export function walkthrough(ex: Example = example) {
  const research = validateResearch(ex.research) as Research, plan = validatePlan(ex.plan, { research, brief: validateBrief(ex.brief) }) as Plan;
  const brief = validateBrief(ex.brief) as Brief;
  const sources = research.sources as Source[];
  const byId = new Map(sources.map(s => [s.id, s]));
  const cite = (ids: string[]) => ids.map(id => byId.get(id)!).filter(Boolean);
  const live = new Set(plan.capabilities.filter(c => c.access === "live").map(c => c.id));
  const stages: WalkStage[] = plan.stages.map((s, i) => ({
    n: i + 1, id: s.id, name: s.name, kind: s.kind, kindLabel: KIND_LABEL[s.kind] ?? s.kind, goal: s.goal,
    owner: "role" in s.owner ? s.owner.role ?? null : null, gap: "gap" in s.owner ? s.owner.gap ?? null : null,
    support: s.support, reviewers: s.reviewers, uses: s.uses, outputs: s.outputs.map(o => o.name), checks: s.checks.map(c => c.name),
    gate: s.gate, gateLabel: GATE_LABEL[s.gate] ?? s.gate, live: (s.needs as string[]).some(n => live.has(n)), optionalWhen: s.optional_when,
  }));
  const specialists = [...new Set(plan.stages.flatMap(s => ["role" in s.owner ? s.owner.role : undefined, ...s.support, ...s.reviewers]).filter((r): r is string => !!r))];
  const items = [...new Set(plan.stages.flatMap(s => s.uses))];
  return {
    request: ex.request,
    brief,
    research: {
      approach: research.approach,
      steps: research.steps.map(s => ({ name: s.name, why: s.why, sources: cite(s.sources) })),
      pitfalls: research.pitfalls.map(p => ({ text: p.text, sources: cite(p.sources) })),
      sources,
    },
    planName: plan.name,
    stages,
    stops: [PLAN_STOP, ...plan.stages.flatMap((s, i) => s.gate === "none" ? [] : [stopFor(s, i + 1)])],
    liveActions: plan.capabilities.filter(c => c.access === "live").map(c => c.name),
    capabilities: plan.capabilities.map(c => ({ name: c.name, access: c.access, why: c.why })),
    hypotheses: plan.hypotheses.map(h => ({ statement: h.statement, test: h.test })),
    dropped: plan.dropped.map(d => ({ step: research.steps.find(s => s.id === d.step)?.name ?? d.step, reason: d.reason })),
    measurement: plan.measurement,
    learning: stages[stages.length - 1],
    counts: { stages: stages.length, specialists: specialists.length, items: items.length, sources: sources.length, web: sources.filter(s => s.kind === "web").length, steps: research.steps.length, hypotheses: plan.hypotheses.length },
  };
}
export type Walkthrough = ReturnType<typeof walkthrough>;

// ---- Where a job stands ------------------------------------------------------------------------------------------

export const STATE_LABEL: Record<string, string> = {
  WAITING: "Not started", READY: "Ready to run", IN_PROGRESS: "In progress", AWAITING_APPROVAL: "Waiting on you", DONE: "Done", SKIPPED: "Skipped", BLOCKED: "Blocked",
};
export const PHASE_LABEL: Record<string, string> = {
  DEFINE: "Pinning down the job", RESEARCH: "Researching and planning", PLAN_REVIEW: "Plan ready for you", RUN: "Doing the work",
};
export type Item = { title: string; detail: string };
export type StatusStage = { n: number; id: string; name: string; kindLabel: string; owner: string | null; state: string; stateLabel: string; note: string | null };
export type JobStatus = {
  id: string; request: string; started: string; phase: string; phaseLabel: string; round: number; planName: string | null; planVersion: number;
  headline: string; done: number; total: number; stages: StatusStage[]; waiting: Item[]; next: Item[]; blocked: Item[];
  data: { name: string; status: string; why: string }[]; worthKnowing: string[]; decisions: number; experiments: { total: number; closed: number };
};

type EStage = { id: string; state: string; block?: { by: string; reason: string }; skip_reason?: string; changes?: string; limits?: string[] };
type Engagement = {
  id: string; request: string; started: string; phase: string; round: number; plan_version: number; plan_changes: string | null; autonomy: { level: number };
  plan: { name: string; stages: Stage[]; data: { id: string; name: string; why: string }[] } | null;
  stages: EStage[]; data: { id: string; status: string }[]; plan_check: { warnings: string[] } | null;
  records: { decisions: unknown[]; experiments: Record<string, { state: string }> };
};

function waitingItem(def: Stage, n: number, gate: string): Item {
  const at = `Stage ${n}, ${def.name}.`;
  if (gate === "approve") return { title: "Choose what to do", detail: `${at} Your AI shows you the ranked options. Pick the ones to go ahead with.` };
  if (gate === "approve_each_action") return { title: "Approve each live action", detail: `${at} Your AI asks before each change goes live. Say yes or no to each one.` };
  return { title: "Look over the work", detail: `${at} Approve it, or tell your AI what to change.` };
}

/** Where one job stands, from its engagement.json, in the owner's words. Throws when the engagement fails the orchestrator's checks. */
export function jobStatus(input: unknown): JobStatus {
  const e = checkEngagement(input) as unknown as Engagement;
  const plan = e.plan;
  const base = {
    id: e.id, request: e.request, started: e.started, phase: e.phase, phaseLabel: PHASE_LABEL[e.phase] ?? e.phase, round: e.round,
    planName: plan?.name ?? null, planVersion: e.plan_version, decisions: e.records.decisions.length,
    experiments: { total: Object.keys(e.records.experiments).length, closed: Object.values(e.records.experiments).filter(x => x.state === "CLOSED").length },
    worthKnowing: e.plan_check?.warnings ?? [],
  };
  const stages: StatusStage[] = plan ? plan.stages.map((def, i) => {
    const s = e.stages[i];
    return { n: i + 1, id: def.id, name: def.name, kindLabel: KIND_LABEL[def.kind] ?? def.kind, owner: "role" in def.owner ? def.owner.role ?? null : null, state: s.state, stateLabel: STATE_LABEL[s.state] ?? s.state, note: s.block?.reason ?? s.skip_reason ?? s.changes ?? s.limits?.join(" ") ?? null };
  }) : [];
  const done = stages.filter(s => s.state === "DONE" || s.state === "SKIPPED").length;
  const data = plan ? plan.data.map(d => ({ name: d.name, why: d.why, status: e.data.find(x => x.id === d.id)?.status ?? "UNKNOWN" })).filter(d => d.status !== "AVAILABLE") : [];
  const result = (headline: string, waiting: Item[], next: Item[], blocked: Item[] = []): JobStatus => ({ ...base, headline, done, total: stages.length, stages, waiting, next, blocked, data });

  if (e.phase === "DEFINE") return result("Your AI is pinning down the job with you.", [{ title: "Answer your AI's questions", detail: "One batch: what finished looks like, the number that shows it worked, your limits and what your AI can reach." }], []);
  if (e.phase === "RESEARCH") return result("Your AI is finding out how experts do this job and building the plan.", [], [{ title: e.plan_changes ? `Rebuild the plan with your changes` : "Research and build the plan", detail: e.plan_changes ? `You asked for: ${e.plan_changes}` : "It reads what your business learned before, our tested workflows and the web, then picks specialists for each stage." }]);
  if (e.phase === "PLAN_REVIEW" || !plan) {
    const stops = plan ? plan.stages.filter(s => s.gate !== "none").length : 0;
    return result("The plan is ready. Nothing runs until you approve it.", [{ title: "Approve the plan, or ask for changes", detail: `${plan?.name ?? "The plan"}: ${stages.length} stages, stopping for you ${stops} ${stops === 1 ? "time" : "times"} after you approve it.` }], []);
  }
  const order = plan.stages;
  const waiting: Item[] = [], next: Item[] = [], blocked: Item[] = [];
  order.forEach((def, i) => {
    const s = e.stages[i];
    const gate = gateFor(def, e) as string;
    if (s.state === "AWAITING_APPROVAL") waiting.push(waitingItem(def, i + 1, gate));
    else if (def.kind === "decision" && (s.state === "READY" || s.state === "IN_PROGRESS")) waiting.push(waitingItem(def, i + 1, "approve"));
    else if (s.state === "READY" || s.state === "IN_PROGRESS") next.push({ title: `${def.name} (${STATE_LABEL[s.state].toLowerCase()})`, detail: `${"role" in def.owner && def.owner.role ? humanize(def.owner.role) : "Your AI"}: ${def.goal}${gate === "approve_each_action" ? " Your AI asks you before each live action." : ""}` });
    else if (s.state === "BLOCKED") blocked.push({ title: def.name, detail: s.block?.by === "data" ? `${s.block.reason} Give your AI the data, skip this stage with a reason, or ask for a revised plan.` : s.block?.reason ?? "Blocked." });
  });
  const roundDone = e.stages[e.stages.length - 1]?.state === "DONE";
  if (roundDone) return result(`Round ${e.round} is finished.`, [{ title: "Read what was learned", detail: "Then decide whether to run another round or change the plan. Share the plan pattern with AI Blocks only if you want to, after reading it." }], [], blocked);
  if (!next.length && !waiting.length) {
    const upcoming = order.find((_, i) => e.stages[i].state === "WAITING");
    if (upcoming) next.push({ title: `${upcoming.name} (not started)`, detail: "It starts when the stages before it are done." });
  }
  const headline = waiting.length ? `${waiting.length === 1 ? "One thing waits" : `${waiting.length} things wait`} on you.` : blocked.length && !next.length ? "The job is stuck until the blocked stage is sorted out." : "Your AI is working on it.";
  return result(headline, waiting, next, blocked);
}

/** Reads one engagement.json's text. Never throws: a bad file comes back with the reason, in plain words. */
export function readEngagement(text: string): { ok: true; status: JobStatus; engagement: unknown } | { ok: false; error: string } {
  let value: unknown;
  try { value = JSON.parse(text); } catch { return { ok: false, error: "This engagement.json is not valid JSON. It may be cut off or edited by hand." }; }
  try { return { ok: true, status: jobStatus(value), engagement: value }; } catch (err) { return { ok: false, error: `This engagement.json does not pass the orchestrator's checks: ${err instanceof Error ? err.message : String(err)}` }; }
}

// ---- The sample job ------------------------------------------------------------------------------------------------

const SAMPLE_DAY = "2026-11-02";
/** The worked example as a job part way through: the plan approved, the checks and diagnosis done, the owner's choice next.
 * Built by the orchestrator's own moves, so it is a real engagement.json. Stage results are made up for the sample. */
export function sampleEngagement() {
  let e = startEngagement({ request: example.request, started: SAMPLE_DAY, id: "20261102-ad-costs-sample" });
  const brief = validateBrief(example.brief), research = validateResearch(example.research) as Research, plan = validatePlan(example.plan, { research, brief }) as Plan;
  const move = (event: Record<string, unknown>, opts?: Record<string, unknown>) => { e = advanceEngagement(e, event, opts); };
  move({ type: "brief", brief: example.brief, at: SAMPLE_DAY });
  move({ type: "plan", research: example.research, plan: example.plan, at: "2026-11-03" }, { planCheck: { catalogue_checked: true, warnings: planWarnings(brief, research, plan, "2026-11-03") } });
  move({ type: "approve_plan", by: "owner", decision: "APPROVED", at: "2026-11-03" });
  for (const id of ["ad-results", "orders", "tracking-setup", "landing-pages"]) move({ type: "data", data_id: id, status: "AVAILABLE", at: "2026-11-04" });
  for (const id of ["context", "evidence", "integrity-tracking", "integrity-site", "diagnosis", "options"]) {
    const def = plan.stages.find(s => s.id === id)!;
    move({ type: "complete", stage_id: id, outputs: def.outputs.map(o => ({ id: o.id })), checks: def.checks.map(c => ({ id: c.id, result: "PASS" })), at: "2026-11-05" });
  }
  return e;
}

/** The sample job as the folder the orchestrator asks the host to save: outcomes/<id>/ and its files. */
export async function sampleFolder(): Promise<{ id: string; files: Record<string, string> }> {
  const e = sampleEngagement();
  const step = await describeEngagement(e);
  return { id: e.id, files: step.files as Record<string, string> };
}
