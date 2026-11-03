// Drives the worked example through the public outcome tools, for the read-back and pattern tests.
import { localResolver } from '../src/outcomes/evals/local-catalogue.mjs';
import { callOutcomeTool } from '../src/outcomes/outcome-mcp.mjs';
import example from '../src/outcomes/examples/rising-cpa.mjs';

export const TOOL = { resolve: localResolver(), today: '2026-11-02' };
export const call = (name, input, opts = TOOL) => callOutcomeTool(name, input, opts);
export const step = (r, event) => call('advance_outcome', { engagement: r.engagement, engagement_sha256: r.engagement_sha256, event });
export const rec = (r, name, field, value) => call(name, { engagement: r.engagement, engagement_sha256: r.engagement_sha256, [field]: value });
export async function complete(r, stageId) {
  const def = r.engagement.plan.stages.find(s => s.id === stageId);
  return step(r, { type: 'complete', stage_id: stageId, outputs: def.outputs.map(o => ({ id: o.id })), checks: def.checks.map(c => ({ id: c.id, result: 'PASS' })) });
}
export const REGISTER = { action: 'register', id: 'x1', hypothesis_id: 'h-underserved-segment', card_id: 'r2', change: 'Three new concepts aimed at women 45-54', metric: 'Purchase CPA', baseline: 1450, target: 1100, window: { start: '2026-11-10', end: '2026-11-24' }, min_volume: 50, guardrails: ['Purchases per week stay above 80'] };

/** The example engagement with one experiment registered and launch approved. Returns the result and experiments.jsonl. */
export async function launched({ request = 'My business is not doing too well', brief = example.brief } = {}) {
  let r = await call('start_outcome', { request, started: '2026-11-02' });
  r = await step(r, { type: 'brief', brief });
  r = await step(r, { type: 'plan', research: example.research, plan: example.plan });
  r = await step(r, { type: 'approve_plan', by: 'owner', decision: 'APPROVED' });
  for (const id of ['evidence', 'context', 'integrity-tracking', 'integrity-site', 'diagnosis', 'options']) r = await complete(r, id);
  r = await rec(r, 'record_outcome_decision', 'decision', { id: 'd1', stage_id: 'decision', by: 'owner', considered: [{ id: 'r2', summary: 'New concepts for women 45-54' }, { id: 'r3', summary: 'Cut weekend spend' }], chosen: ['r2'] });
  r = await complete(r, 'decision');
  r = await step(r, { type: 'approve', stage_id: 'decision', decision: 'APPROVED', by: 'owner' });
  r = await step(r, { type: 'skip', stage_id: 'tracking-fixes', reason: 'Not chosen' });
  r = await step(r, { type: 'skip', stage_id: 'page-fixes', reason: 'Not chosen' });
  r = await complete(r, 'concepts');
  r = await step(r, { type: 'approve', stage_id: 'concepts', decision: 'APPROVED', by: 'owner' });
  r = await complete(r, 'ad-production');
  r = await rec(r, 'record_outcome_experiment', 'experiment', REGISTER);
  let experiments = r.append.line;
  r = await complete(r, 'launch');
  r = await step(r, { type: 'approve', stage_id: 'launch', decision: 'APPROVED', by: 'owner' });
  return { r, experiments, append: line => { experiments += line; return experiments; } };
}
