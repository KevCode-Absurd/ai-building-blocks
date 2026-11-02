// Decisions and experiments: the logs that let an engagement, a business and the platform get better over time.
// Lines are returned for the host to append; nothing is stored or shared here.
import { checkEngagement, describeEngagement, fail, refuseSecrets, text } from './engagement.mjs';

const ID = /^[a-z0-9][a-z0-9-]{0,79}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const SCOPES = ['engagement', 'business', 'platform'];
const object = (v, label) => v && typeof v === 'object' && !Array.isArray(v) ? v : fail(`${label} must be an object.`);
const keys = (v, allowed, label) => { const extra = Object.keys(v).find(k => !allowed.includes(k)); if (extra) fail(`${label} has an unsupported field: ${extra}.`); };
const id = (v, label) => ID.test(v ?? '') ? v : fail(`${label} must be a lowercase id.`);
const optional = (v, label, max = 2000) => v === undefined ? undefined : text(v, label, max);
const number = (v, label) => typeof v === 'number' && Number.isFinite(v) ? v : fail(`${label} must be a number.`);
const count = (v, label) => Number.isSafeInteger(v) && v >= 0 ? v : fail(`${label} must be a whole number.`);
const clone = v => JSON.parse(JSON.stringify(v));
const SAVE_TO = {
  engagement: 'LEARNINGS.md in this engagement folder',
  business: 'memory/decisions.md in the owner\'s project, indexed in memory/INDEX.md, so every future engagement reads it',
  platform: 'PATTERN.json and the outcome report, shared with AI Blocks only if the owner agrees; save it locally under business scope meanwhile',
};
function rule(v, source) {
  if (v === undefined) return null;
  object(v, 'Rule'); keys(v, ['text', 'scope'], 'Rule');
  if (!SCOPES.includes(v.scope)) fail('Rule scope must be engagement, business or platform.');
  return { scope: v.scope, rule: text(v.text, 'Rule', 600), source, save_to: SAVE_TO[v.scope] };
}
const line = record => JSON.stringify(record) + '\n';

/** Record what the owner chose, what they passed over and why. Passing over the top option needs a reason. */
export async function recordDecision(input, d) {
  const e = clone(checkEngagement(input));
  if (e.phase !== 'RUN') fail('Decisions are recorded while the approved plan runs.');
  object(d, 'Decision'); refuseSecrets(d); keys(d, ['id', 'stage_id', 'considered', 'chosen', 'rationale', 'given_up', 'revisit_when', 'rule', 'by', 'at'], 'Decision');
  if (d.by !== 'owner') fail('Record only decisions the owner actually made (by: "owner").');
  const did = id(d.id, 'Decision id');
  if (e.records.decisions.some(x => x.id === did)) fail('That decision id is already recorded.');
  const s = e.stages.find(s => s.id === d.stage_id) ?? fail('Unknown stage.');
  if (!['READY', 'IN_PROGRESS', 'AWAITING_APPROVAL'].includes(s.state)) fail(`Stage ${s.id} is ${s.state}; decisions belong to an active stage.`);
  const considered = (Array.isArray(d.considered) && d.considered.length && d.considered.length <= 30 ? d.considered : fail('List 1 to 30 options considered, best-ranked first.')).map(o => { object(o, 'Option'); keys(o, ['id', 'summary'], 'Option'); return { id: id(o.id, 'Option id'), summary: text(o.summary, 'Option summary', 500) }; });
  if (new Set(considered.map(o => o.id)).size !== considered.length) fail('Option ids must be unique.');
  const chosen = Array.isArray(d.chosen) ? d.chosen.map(c => considered.some(o => o.id === c) ? c : fail(`Chosen ${c} was not among the options.`)) : fail('List the chosen option ids (empty if none).');
  const rationale = optional(d.rationale, 'Rationale');
  if (!chosen.includes(considered[0].id) && (!rationale || rationale.length < 15)) fail(`The owner passed over the top option (${considered[0].id}). Ask why and record the reason; it is how the next round gets smarter.`);
  if (d.at !== undefined && !DATE.test(d.at)) fail('Decision date must be YYYY-MM-DD.');
  const record = {
    type: 'decision', id: did, engagement: e.id, round: e.round, stage_id: s.id, ...(d.at ? { at: d.at } : {}), considered, chosen,
    passed_over: considered.filter(o => !chosen.includes(o.id)).map(o => o.id), ...(rationale ? { rationale } : {}),
    ...(d.given_up ? { given_up: text(d.given_up, 'What was given up', 1000) } : {}), ...(d.revisit_when ? { revisit_when: text(d.revisit_when, 'Revisit condition', 500) } : {}),
  };
  const learning = rule(d.rule, { decision_id: did });
  if (learning) record.rule = learning;
  e.records.decisions.push({ id: did, stage_id: s.id, round: e.round });
  e.history = [...e.history, { type: 'decision', round: e.round, stage_id: s.id, ...(d.at ? { at: d.at } : {}) }].slice(-200);
  return { ...(await describeEngagement(e)), record_schema: 'ai-blocks-outcome-record/1', append: { file: 'decisions.jsonl', line: line(record) }, learning_candidate: learning };
}

/** Register a test before it goes live, then close it with an honest verdict. */
export async function recordExperiment(input, x) {
  const e = clone(checkEngagement(input));
  if (e.phase !== 'RUN') fail('Experiments are recorded while the approved plan runs.');
  object(x, 'Experiment'); refuseSecrets(x);
  const plan = e.plan;
  const action = x.action === 'register' || x.action === 'close' ? x.action : fail('Experiment action must be register or close.');
  const xid = id(x.id, 'Experiment id');
  if (x.at !== undefined && !DATE.test(x.at)) fail('Experiment date must be YYYY-MM-DD.');
  const stageOf = kind => plan.stages.filter(d => d.kind === kind).map(d => e.stages.find(s => s.id === d.id));
  let record, learning = null, report = null;
  if (action === 'register') {
    keys(x, ['action', 'id', 'hypothesis_id', 'card_id', 'change', 'metric', 'direction', 'baseline', 'target', 'window', 'min_volume', 'guardrails', 'at'], 'Experiment');
    if (e.records.experiments[xid]) fail('That experiment id is already registered.');
    if (!stageOf('decision').every(s => s.state === 'DONE')) fail('Register experiments after the owner\'s decision.');
    if (stageOf('execution').some(s => s.state === 'DONE')) fail('Launch is already complete this round; a test must be registered before it goes live.');
    const hypothesis = x.hypothesis_id === undefined ? null : id(x.hypothesis_id, 'Hypothesis id');
    if (hypothesis && !hypothesis.startsWith('h-new-') && !plan.hypotheses.some(h => h.id === hypothesis)) fail('Use a plan hypothesis id, or prefix a new one with h-new-.');
    const briefed = e.brief.metric?.direction;
    const direction = ['decrease', 'increase'].includes(briefed) ? briefed : ['decrease', 'increase'].includes(x.direction) ? x.direction : fail('Say whether this test\'s metric should decrease or increase.');
    const window = object(x.window, 'Window'); keys(window, ['start', 'end'], 'Window');
    if (!DATE.test(window.start ?? '') || !DATE.test(window.end ?? '') || window.end < window.start) fail('Window needs start and end dates, end not before start.');
    const guardrails = (Array.isArray(x.guardrails) ? x.guardrails : fail('List the guardrails this test must hold.')).map(g => text(g, 'Guardrail', 300));
    const baseline = number(x.baseline, 'Baseline');
    if (baseline <= 0) fail('Baseline must be above zero.');
    record = {
      type: 'experiment', action, id: xid, engagement: e.id, round: e.round, ...(x.at ? { at: x.at } : {}), ...(hypothesis ? { hypothesis_id: hypothesis } : {}), ...(x.card_id ? { card_id: id(x.card_id, 'Card id') } : {}),
      change: text(x.change, 'Change', 1000), metric: text(x.metric, 'Metric', 200), direction, baseline, ...(x.target !== undefined ? { target: number(x.target, 'Target') } : {}),
      window: { start: window.start, end: window.end }, min_volume: count(x.min_volume, 'Minimum volume'), guardrails,
    };
    e.records.experiments[xid] = { state: 'REGISTERED', round: e.round, plan_version: e.plan_version, direction, baseline, min_volume: record.min_volume, guardrails, ...(hypothesis ? { hypothesis_id: hypothesis } : {}) };
  } else {
    keys(x, ['action', 'id', 'observed', 'volume', 'guardrail_results', 'verdict', 'learning', 'rule', 'at'], 'Experiment');
    const reg = e.records.experiments[xid] ?? fail('Register the experiment before closing it.');
    if (reg.state !== 'REGISTERED') fail('That experiment is already closed.');
    const observed = number(x.observed, 'Observed value'), volume = count(x.volume, 'Volume');
    const results = (Array.isArray(x.guardrail_results) ? x.guardrail_results : fail('Report each guardrail.')).map(g => { object(g, 'Guardrail result'); keys(g, ['name', 'held', 'note'], 'Guardrail result'); if (typeof g.held !== 'boolean') fail('Guardrail held must be true or false.'); return { name: text(g.name, 'Guardrail', 300), held: g.held, ...(g.note ? { note: text(g.note, 'Guardrail note', 500) } : {}) }; });
    const unreported = reg.guardrails.filter(g => !results.some(r => r.name === g));
    if (unreported.length) fail(`Report the registered guardrails: ${unreported.join('; ')}.`);
    const verdict = ['WIN', 'LOSS', 'INCONCLUSIVE'].includes(x.verdict) ? x.verdict : fail('Verdict must be WIN, LOSS or INCONCLUSIVE.');
    const enough = volume >= reg.min_volume, held = results.every(r => r.held);
    const better = reg.direction === 'decrease' ? observed < reg.baseline : observed > reg.baseline;
    if (!enough && verdict !== 'INCONCLUSIVE') fail(`Volume ${volume} is below the registered minimum ${reg.min_volume}, so the verdict is INCONCLUSIVE.`);
    if (verdict === 'WIN' && !held) fail('A test that broke a guardrail is not a win.');
    if (verdict === 'WIN' && !better) fail('The observed value did not beat the baseline in the registered direction.');
    const relative = Math.round((observed / reg.baseline - 1) * 1000) / 1000;
    record = { type: 'experiment', action, id: xid, engagement: e.id, round: reg.round, ...(x.at ? { at: x.at } : {}), observed, volume, volume_met: enough, guardrail_results: results, verdict, relative_change: relative, ...(x.learning ? { learning: text(x.learning, 'Learning', 1000) } : {}) };
    learning = rule(x.rule, { experiment_id: xid }) ?? (record.learning ? { scope: 'business', rule: record.learning, source: { experiment_id: xid }, save_to: SAVE_TO.business } : null);
    if (learning) record.rule = learning;
    // Shareable only with consent: no brand, no absolute figures, no free text.
    report = { schema: 'ai-blocks-outcome-report/1', share: 'ONLY_WITH_OWNER_CONSENT', plan_version: reg.plan_version ?? e.plan_version, ...(e.brief.metric ? { metric: { name: e.brief.metric.name, direction: reg.direction } } : {}), ...(reg.hypothesis_id ? { hypothesis_id: reg.hypothesis_id } : {}), verdict, relative_change: relative, volume_met: enough, guardrails_held: held };
    e.records.experiments[xid] = { ...reg, state: 'CLOSED', verdict };
  }
  e.history = [...e.history, { type: `experiment_${action}`, round: e.round, ...(x.at ? { at: x.at } : {}) }].slice(-200);
  return { ...(await describeEngagement(e)), record_schema: 'ai-blocks-outcome-record/1', append: { file: 'experiments.jsonl', line: line(record) }, learning_candidate: learning, ...(report ? { outcome_report: report } : {}) };
}
