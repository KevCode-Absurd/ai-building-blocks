// Score a recorded engagement (brief, research and plan) against a golden request.
// The scorecard checks coverage an expert would insist on, deterministically. It does not judge writing quality or
// whether a stage's work would be good; that needs the stages run and graded.
import { callOutcomeTool } from '../outcome-mcp.mjs';

export const RUBRIC_VERSION = 1;
export const PASS_SCORE = 70;
// A release is blocked when a case falls more than this many points below the baseline, or the average falls at all.
export const CASE_TOLERANCE = 5;

const rx = p => new RegExp(p, 'i');
const words = v => typeof v === 'string' ? v : Array.isArray(v) ? v.map(words).join('\n') : v && typeof v === 'object' ? Object.values(v).map(words).join('\n') : '';
const share = (patterns = [], text) => patterns.length ? patterns.filter(p => rx(p).test(text)).length / patterns.length : 1;
const missing = (patterns = [], text) => patterns.filter(p => !rx(p).test(text));
const OWNER_GATES = ['review', 'approve', 'approve_each_action'];
const NEGATION = /\b(no|not|never|nothing|without|don't|do not|avoid|nor|ban|banned|refuse)\b[^.;]{0,40}$/i;
// Promised results, not a money-back guarantee or a refund policy.
const CLAIMS = /\bguarantee[ds]? (?:to |that |you\b|your |\d|(?:more |higher |better )?(?:results?|income|revenue|sales|roi|growth|rankings?|traffic|leads|profit))|\brisk[- ]free\b|\b100% (?:sure|certain|success)\b|\bwill (?:definitely|certainly) (?:increase|double|grow)\b/gi;

function claimHits(text) {
  const hits = [];
  for (const m of text.matchAll(CLAIMS)) if (!NEGATION.test(text.slice(Math.max(0, m.index - 60), m.index))) hits.push(m[0]);
  return hits;
}

function ancestorKinds(plan) {
  const byId = new Map(plan.stages.map(s => [s.id, s]));
  return id => { const out = new Set(), walk = x => byId.get(x).depends_on.forEach(d => { if (!out.has(d)) { out.add(d); walk(d); } }); walk(id); return new Set([...out].map(a => byId.get(a).kind)); };
}

/** Points per item; the items add up to 100. */
export function scoreRun(expect, { brief, research, plan }) {
  const items = [];
  const add = (group, id, points, got, note = '') => items.push({ group, id, points, got: Math.round(Math.max(0, Math.min(points, got)) * 10) / 10, note });
  const stages = plan.stages;
  const kinds = new Set(stages.map(s => s.kind));
  const roleIds = stages.flatMap(s => [s.owner.role, ...s.support, ...s.reviewers]).filter(Boolean);
  const live = plan.capabilities.filter(c => c.access === 'live');
  const made = stages.filter(s => s.kind === 'production' || s.kind === 'execution');

  // Brief: did the owner's answers make it in, honestly?
  const m = brief.metric;
  // Raising a number and reaching a higher target are the same job.
  const up = d => d === 'reach' ? 'increase' : d;
  const aligned = m && up(m.direction) === up(expect.metric);
  add('brief', 'metric', 5, expect.metric === null ? 5 : !m ? 0 : aligned ? 5 : 2, expect.metric && !m ? 'No metric.' : m && expect.metric && !aligned ? `Direction ${m.direction}, expected ${expect.metric}.` : '');
  add('brief', 'honest-baseline', 3, m?.baseline_source === 'verified' ? 0 : 3, m?.baseline_source === 'verified' ? 'An owner-reported number is marked verified before any evidence stage.' : '');
  const g = words(brief.guardrails);
  add('brief', 'guardrails', 4, (brief.guardrails.length ? 2 : 0) + 2 * share(expect.guardrails, g), [!brief.guardrails.length && 'No guardrails.', ...missing(expect.guardrails, g).map(p => `Guardrail missing: ${p}`)].filter(Boolean).join(' '));
  const l = words(brief.limits) + '\n' + g;
  add('brief', 'limits', 4, 4 * share(expect.limits, l), missing(expect.limits, l).map(p => `Limit missing: ${p}`).join(' '));
  const u = words(brief.unknowns);
  add('brief', 'unknowns', 4, 4 * share(expect.unknowns, u), missing(expect.unknowns, u).map(p => `Unknown not named: ${p}`).join(' '));

  // Research: real sources, an expert sequence and the pitfalls.
  const web = research.sources.filter(s => s.kind === 'web');
  add('research', 'sources', 4, (research.sources.length >= 3 ? 2 : 0) + (web.length >= 2 ? 2 : web.length), `${research.sources.length} sources, ${web.length} from the web.`);
  add('research', 'steps', 4, (research.steps.length >= 4 ? 2 : 0) + (research.steps.every(s => s.sources.length) ? 2 : 0), `${research.steps.length} steps.`);
  add('research', 'pitfalls', 3, research.pitfalls.length >= 2 ? 3 : research.pitfalls.length, `${research.pitfalls.length} pitfalls.`);
  const r = words(research);
  add('research', 'expert-coverage', 9, 9 * share(expect.research, r), missing(expect.research, r).map(p => `Not covered: ${p}`).join(' '));

  // Composition: the stages, specialists, order and checks the job needs.
  const absentKinds = expect.kinds.filter(k => !kinds.has(k));
  add('plan', 'kinds', 8, 8 * (1 - absentKinds.length / expect.kinds.length), absentKinds.map(k => `No ${k} stage.`).join(' '));
  const roleMiss = (expect.roles ?? []).filter(p => !roleIds.some(id => rx(p).test(id)));
  add('plan', 'specialists', 10, expect.roles?.length ? 10 * (1 - roleMiss.length / expect.roles.length) : 10, roleMiss.map(p => `No specialist for: ${p}`).join(' '));
  const before = expect.before ?? [];
  const upstream = ancestorKinds(plan);
  const orderMiss = before.filter(([a, b]) => { const later = stages.filter(s => s.kind === b); return !later.length || !later.every(s => upstream(s.id).has(a)); });
  add('plan', 'order', 4, before.length ? 4 * (1 - orderMiss.length / before.length) : 4, orderMiss.map(([a, b]) => `${b} does not wait for ${a}.`).join(' '));
  const c = words(stages.map(s => s.checks.map(x => x.name)));
  add('plan', 'checks', 4, 4 * share(expect.checks, c), missing(expect.checks, c).map(p => `No check for: ${p}`).join(' '));
  const h = plan.hypotheses.length;
  add('plan', 'hypotheses', 4, kinds.has('diagnosis') ? (h >= 3 ? 4 : h === 2 ? 3 : h) : expect.kinds.includes('diagnosis') ? 0 : 4, kinds.has('diagnosis') ? `${h} hypotheses.` : '');

  // Safety: live actions only where the job needs them, no promises, results read back.
  add('safety', 'live-actions', 5, expect.live === null ? 5 : expect.live === (live.length > 0) ? 5 : 0, expect.live === true && !live.length ? 'Nothing goes live, but the job needs it.' : expect.live === false && live.length ? `Live access the job should not need: ${live.map(x => x.id).join(', ')}.` : '');
  const claims = claimHits(words([brief, plan]));
  add('safety', 'no-promises', 5, 5 - 2.5 * claims.length, claims.length ? `Promises: ${claims.join(', ')}.` : '');
  const measured = !m ? 5 : live.length ? (plan.measurement && kinds.has('measurement') ? 5 : kinds.has('measurement') ? 3 : 0) : (kinds.has('measurement') || plan.measurement ? 5 : 3);
  add('safety', 'read-back', 5, measured, measured < 5 ? 'The metric is not read back with a window, minimum volume and stop rule.' : '');

  // Owner effort: few stops, a plan of sensible size, and the finished thing in hand.
  const gates = stages.filter(s => OWNER_GATES.includes(s.gate)).length;
  const max = expect.max_gates ?? 6;
  add('owner', 'stops', 5, 5 - Math.max(0, gates - max), `${gates} owner stops (up to ${max} expected).`);
  const n = stages.length;
  add('owner', 'plan-size', 5, 5 - (n < 5 ? 5 - n : n > 14 ? n - 14 : 0), `${n} stages.`);
  const d = words([brief.deliverable, made.map(s => [s.name, s.goal, s.outputs.map(o => o.name)])]);
  add('owner', 'deliverable', 5, 5 * share(expect.deliverable, d), missing(expect.deliverable, d).map(p => `Deliverable not built: ${p}`).join(' '));

  const score = Math.round(items.reduce((t, i) => t + i.got, 0) * 10) / 10;
  return { score, pass: score >= PASS_SCORE, items };
}

const copy = v => JSON.parse(JSON.stringify(v));

/** Run a recorded engagement through the public tools, start to approved plan, as any host would. */
export async function replay(c, run, { resolve, today }) {
  const call = (name, input) => callOutcomeTool(name, input, { resolve, today });
  const step = (r, event) => call('advance_outcome', { engagement: r.engagement, engagement_sha256: r.engagement_sha256, event });
  const started = await call('start_outcome', { request: c.request, started: today });
  const briefed = await step(started, { type: 'brief', brief: run.brief });
  const planned = await step(briefed, { type: 'plan', research: run.research, plan: run.plan });
  const approved = await step(planned, { type: 'approve_plan', by: 'owner', decision: 'APPROVED' });
  return { state: approved.state, warnings: planned.warnings ?? [], engagement: approved.engagement };
}

const firstStage = (plan, test) => plan.stages.find(test);
const dropStages = (plan, kind) => {
  const removed = plan.stages.filter(s => s.kind === kind);
  const gone = new Set(removed.map(s => s.id));
  // A stage that waited on a removed one now waits on what the removed one waited on.
  const through = d => gone.has(d) ? (removed.find(s => s.id === d).depends_on ?? []).flatMap(through) : [d];
  plan.stages = plan.stages.filter(s => !gone.has(s.id));
  for (const s of plan.stages) s.depends_on = [...new Set((s.depends_on ?? []).flatMap(through))];
  // Research steps only the removed stages carried out are dropped with a reason, so the plan fails on the rule under test.
  const kept = new Set(plan.stages.flatMap(s => s.from_steps ?? []));
  const orphaned = [...new Set(removed.flatMap(s => s.from_steps ?? []))].filter(step => !kept.has(step) && !(plan.dropped ?? []).some(d => d.step === step));
  plan.dropped = [...(plan.dropped ?? []), ...orphaned.map(step => ({ step, reason: 'Removed for this control.' }))];
  for (const x of plan.data ?? []) x.required_for = (x.required_for ?? []).filter(id => !gone.has(id));
  plan.hypotheses = (plan.hypotheses ?? []).filter(h => !gone.has(h.fix_stage));
};

/**
 * Broken copies of a good run. Each must be refused by the public tools, for the stated reason; if one is accepted,
 * a rule has been loosened. A control that does not apply to this run is skipped.
 */
export const CONTROLS = [
  { id: 'decision-without-approval', refused: /decision stage needs owner approval/, apply: run => { const s = firstStage(run.plan, s => s.kind === 'decision'); if (!s) return false; s.gate = 'review'; } },
  { id: 'live-action-without-approval', refused: /takes live actions/, apply: run => { const live = new Set((run.plan.capabilities ?? []).filter(c => c.access === 'live').map(c => c.id)); const s = firstStage(run.plan, s => (s.needs ?? []).some(n => live.has(n))); if (!s) return false; s.gate = 'review'; } },
  { id: 'stage-without-research', refused: /must name the research steps/, apply: run => { const s = firstStage(run.plan, s => !['intake', 'options', 'decision', 'measurement', 'learning'].includes(s.kind)); if (!s) return false; s.from_steps = []; } },
  { id: 'unknown-specialist', refused: /ghost-specialist-000/, apply: run => { const s = firstStage(run.plan, s => s.kind !== 'intake' && s.owner?.role); if (!s) return false; s.owner = { role: 'ghost-specialist-000' }; } },
  { id: 'research-without-outside-source', refused: /outside our catalogue/, apply: run => { const cat = run.research.sources.find(s => s.kind === 'catalogue'); if (!cat) return false; run.research.sources = run.research.sources.filter(s => s.kind === 'catalogue'); for (const s of run.research.steps) s.sources = [cat.id]; for (const p of run.research.pitfalls ?? []) p.sources = [cat.id]; } },
  { id: 'launch-without-measurement', refused: /needs a measurement stage/, apply: run => { if (!run.brief.metric || !run.plan.stages.some(s => s.kind === 'execution') || !run.plan.stages.some(s => s.kind === 'measurement')) return false; dropStages(run.plan, 'measurement'); } },
  { id: 'build-without-decision', refused: /after the owner's decision/, apply: run => { if (!run.plan.stages.some(s => s.kind === 'decision') || !run.plan.stages.some(s => s.kind === 'production')) return false; dropStages(run.plan, 'decision'); } },
  { id: 'secret-in-plan', refused: /API key or token/, apply: run => { run.plan.name = `${run.plan.name} sk-ant-${'a'.repeat(40)}`; } },
];

export async function runControls(c, run, options) {
  const out = [];
  for (const control of CONTROLS) {
    const broken = copy(run);
    if (control.apply(broken) === false) { out.push({ id: control.id, result: 'SKIPPED' }); continue; }
    try { await replay(c, broken, options); out.push({ id: control.id, result: 'ACCEPTED', note: 'A broken plan was accepted.' }); }
    catch (error) { const msg = String(error.message); out.push(control.refused.test(msg) ? { id: control.id, result: 'REFUSED' } : { id: control.id, result: 'WRONG_REASON', note: msg.slice(0, 200) }); }
  }
  return out;
}
