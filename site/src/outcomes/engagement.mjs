// One owner's job: brief, research, a composed plan and its run. The host keeps engagement.json in the owner's project
// and sends it back; this module checks each move and says what can run next. No model, storage, scheduling or external action runs here.
import { canonicalTeamJSON } from '../teams/team-contract.mjs';
import { STAGE_KINDS, fail, text, validateBrief, validatePlan, validateResearch, planMarkdown, researchMarkdown, hypothesesMarkdown } from './plan-contract.mjs';
import { METHOD, methodMarkdown } from './method.mjs';
import { nearest } from './schema-check.mjs';

export { fail, text };
export const ENGAGEMENT_SCHEMA = 'ai-blocks-outcome-engagement/2';
export const PHASES = ['DEFINE', 'RESEARCH', 'PLAN_REVIEW', 'RUN'];
export const STAGE_STATES = ['WAITING', 'READY', 'IN_PROGRESS', 'AWAITING_APPROVAL', 'DONE', 'SKIPPED', 'BLOCKED'];
const SETTLED = new Set(['DONE', 'SKIPPED']);
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ID = /^[a-z0-9][a-z0-9-]{0,79}$/;
const encoder = new TextEncoder();
// Keys and tokens stay with the host. These shapes cover the common providers; a match refuses the whole move.
const SECRET = /(sk-(ant-|proj-)?[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|gh[pousr]_[A-Za-z0-9]{30,}|xox[abprs]-[A-Za-z0-9-]{10,}|AIza[0-9A-Za-z_-]{35}|EAA[A-Za-z0-9]{60,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|Bearer\s+[A-Za-z0-9._~+/-]{20,})/;

const object = (v, label) => v && typeof v === 'object' && !Array.isArray(v) ? v : fail(`${label} must be an object.`);
const keys = (v, allowed, label) => { const extra = Object.keys(v).find(k => !allowed.includes(k)); if (extra) fail(`${label} has an unsupported field: ${extra}.`, nearest(extra, allowed)); };
const optionalText = (v, label, max) => v === undefined || v === null ? null : text(v, label, max);
const date = (v, label) => v === undefined ? null : DATE.test(v ?? '') ? v : fail(`${label} must be YYYY-MM-DD.`);
const clone = v => JSON.parse(JSON.stringify(v));
const same = (a, b) => canonicalTeamJSON(a) === canonicalTeamJSON(b);
export function refuseSecrets(value) { if (SECRET.test(JSON.stringify(value))) fail('This contains what looks like an API key or token. Keep keys with your AI (environment or secret store) and never put them in the engagement or its files.'); return value; }

export async function engagementDigest(e) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(canonicalTeamJSON(e))))].map(v => v.toString(16).padStart(2, '0')).join('');
}

/** Check that a host-returned engagement is coherent. The brief, research and plan are re-checked against the rules on every call. */
export function checkEngagement(input) {
  const e = object(input, 'Engagement');
  keys(e, ['schema', 'id', 'request', 'started', 'phase', 'round', 'autonomy', 'brief', 'research', 'plan', 'plan_version', 'plan_check', 'plan_changes', 'data', 'stages', 'records', 'history'], 'Engagement');
  if (e.schema !== ENGAGEMENT_SCHEMA) fail('Unknown engagement schema.');
  if (encoder.encode(JSON.stringify(e)).length > 200000) fail('The engagement exceeds 200 KB. Keep evidence in files and reference their paths.');
  refuseSecrets(e);
  if (!ID.test(e.id ?? '')) fail('Engagement id is invalid.');
  text(e.request, 'Request', 4000); date(e.started, 'Start date');
  if (!PHASES.includes(e.phase)) fail('Unknown engagement phase.');
  if (!Number.isSafeInteger(e.round) || e.round < 1) fail('Round must be a positive integer.');
  if (![0, 1, 2, 3].includes(e.autonomy?.level)) fail('Autonomy level must be 0 to 3.');
  if (!Number.isSafeInteger(e.plan_version) || e.plan_version < 0) fail('Plan version must be a whole number.');
  if (e.phase !== 'DEFINE' && !e.brief) fail('Only a new engagement has no brief.');
  const brief = e.brief ? validateBrief(e.brief) : null;
  if (e.plan) {
    const research = validateResearch(e.research);
    const plan = validatePlan(e.plan, { research, brief });
    if (!same(plan, e.plan) || !same(research, e.research) || !same(brief, e.brief)) fail('The plan was changed outside the outcome tools.');
    if (!Array.isArray(e.stages) || e.stages.map(s => s.id).join() !== plan.stages.map(s => s.id).join()) fail('Engagement stages do not match the plan.');
    if (!Array.isArray(e.data) || e.data.map(d => d.id).join() !== plan.data.map(d => d.id).join()) fail('Engagement data does not match the plan.');
    for (const s of e.stages) if (!STAGE_STATES.includes(s.state)) fail(`Stage ${s.id} has an unknown state.`);
  } else if (['PLAN_REVIEW', 'RUN'].includes(e.phase) || e.stages?.length || e.data?.length) fail('There is no plan yet.');
  if (!Array.isArray(e.records?.decisions) || !object(e.records?.experiments, 'Experiment records')) fail('Engagement records are malformed.');
  if (!Array.isArray(e.history)) fail('Engagement history must be a list.');
  return e;
}

/** Effective gate after the owner's autonomy level. Decisions and live actions always stop for the owner. */
export function gateFor(stage, e) {
  if (stage.gate !== 'review') return stage.gate;
  if (stage.kind === 'production') return e.autonomy.level >= 2 && e.round > 1 ? 'none' : 'review';
  return e.autonomy.level >= 1 ? 'none' : 'review';
}

function refresh(e) {
  if (!e.plan) return e;
  const by = new Map(e.stages.map(s => [s.id, s]));
  for (const def of e.plan.stages) {
    const s = by.get(def.id);
    if (def.kind === 'intake') { s.state = 'DONE'; continue; }
    if (e.phase !== 'RUN') { if (!SETTLED.has(s.state)) { s.state = 'WAITING'; delete s.block; delete s.limits; } continue; }
    if (!['WAITING', 'READY', 'BLOCKED'].includes(s.state) || s.block?.by === 'host') continue;
    if (!def.depends_on.every(d => SETTLED.has(by.get(d).state))) { s.state = 'WAITING'; delete s.block; continue; }
    const missing = e.plan.data.filter(d => d.required_for.includes(def.id) && e.data.find(x => x.id === d.id).status === 'MISSING');
    const hard = missing.filter(d => !d.alternative);
    if (hard.length) { s.state = 'BLOCKED'; s.block = { by: 'data', reason: `Missing ${hard.map(d => d.name).join(', ')}.` }; continue; }
    s.state = 'READY'; delete s.block;
    if (missing.length) s.limits = missing.map(d => `${d.name} is missing: ${d.alternative}`); else delete s.limits;
  }
  return e;
}

const slug = s => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').split('-').slice(0, 5).join('-');
/** Start an engagement from the owner's own words. It begins in DEFINE: the host writes the brief next. */
export function startEngagement({ request, id, started } = {}) {
  const day = date(started, 'Start date') ?? new Date().toISOString().slice(0, 10);
  const words = text(request, 'Request', 4000);
  refuseSecrets(words);
  const eid = id === undefined ? `${day.replaceAll('-', '')}-${slug(words) || 'outcome'}`.slice(0, 80).replace(/-+$/, '') : ID.test(id) ? id : fail('Engagement id must be a lowercase id.');
  return {
    schema: ENGAGEMENT_SCHEMA, id: eid, request: words, started: day, phase: 'DEFINE', round: 1, autonomy: { level: 0 },
    brief: null, research: null, plan: null, plan_version: 0, plan_check: null, plan_changes: null, data: [], stages: [],
    records: { decisions: [], experiments: {} }, history: [{ type: 'start', round: 1, at: day }],
  };
}

/** Install a validated plan. Finished stages carry over when their definition is unchanged; the owner approves the plan unless autonomy allows. */
function installPlan(e, research, plan, check) {
  const before = new Map((e.plan?.stages ?? []).map(d => [d.id, d]));
  const states = new Map(e.stages.map(s => [s.id, s]));
  e.stages = plan.stages.map(def => { const old = states.get(def.id); return old && SETTLED.has(old.state) && before.has(def.id) && same(before.get(def.id), def) ? old : { id: def.id, state: 'WAITING' }; });
  e.data = plan.data.map(d => e.data.find(x => x.id === d.id) ?? { id: d.id, status: 'UNKNOWN' });
  e.research = research; e.plan = plan; e.plan_version += 1; e.plan_changes = null;
  e.plan_check = { catalogue_checked: check?.catalogue_checked === true, warnings: check?.warnings ?? [] };
  const auto = e.plan_version > 1 && e.autonomy.level >= 2 && !plan.capabilities.some(c => c.access === 'live');
  e.phase = auto ? 'RUN' : 'PLAN_REVIEW';
  return auto;
}

/** The fields each event type takes besides type and at. The advance_outcome input schema is built from this. */
export const EVENT_FIELDS = {
  brief: ['brief'], plan: ['research', 'plan'], approve_plan: ['decision', 'by', 'note'],
  data: ['data_id', 'status', 'note'], start: ['stage_id'], complete: ['stage_id', 'outputs', 'checks', 'summary'], approve: ['stage_id', 'decision', 'by', 'note'],
  skip: ['stage_id', 'reason'], block: ['stage_id', 'reason'], reopen: ['stage_id'], autonomy: ['level', 'by', 'note'], next_round: ['note'],
};
const PHASE_OF = { brief: PHASES, plan: ['RESEARCH', 'PLAN_REVIEW', 'RUN'], approve_plan: ['PLAN_REVIEW'], autonomy: PHASES };

/** Apply one host-reported event. Rejects moves the method does not allow, and says exactly why. planCheck carries the catalogue result for a plan event. */
export function advanceEngagement(input, event, { planCheck } = {}) {
  const e = clone(checkEngagement(input));
  object(event, 'Event');
  const fields = EVENT_FIELDS[event.type] ?? fail(`Event type must be one of ${Object.keys(EVENT_FIELDS).join(', ')}.`);
  keys(event, ['type', 'at', ...fields], 'Event');
  refuseSecrets(event);
  if (!(PHASE_OF[event.type] ?? ['RUN']).includes(e.phase)) fail(`A ${event.type} event is not allowed while the engagement is in ${e.phase}.${e.phase === 'PLAN_REVIEW' ? ' The owner approves the plan first.' : ''}`);
  const at = date(event.at, 'Event date');
  const stage = () => { const s = e.stages.find(s => s.id === event.stage_id) ?? fail(`Unknown stage ${event.stage_id}. The plan's stages: ${e.stages.map(s => s.id).join(', ')}.`, nearest(event.stage_id, e.stages.map(s => s.id))); return [s, e.plan.stages.find(d => d.id === s.id)]; };
  const need = (s, states, verb) => { if (!states.includes(s.state)) fail(`Stage ${s.id} is ${s.state}; it must be ${states.join(' or ')} to ${verb}.`); };
  let note = null;
  switch (event.type) {
    case 'brief': e.brief = validateBrief(event.brief); e.phase = 'RESEARCH'; break;
    case 'plan': {
      const research = validateResearch(event.research);
      const plan = validatePlan(event.plan, { research, brief: e.brief });
      if (installPlan(e, research, plan, planCheck)) note = 'Revised plan approved by autonomy level: no live actions.';
      break;
    }
    case 'approve_plan': {
      if (event.by !== 'owner') fail('Only the owner approves the plan. Report by: "owner" after they actually said so.');
      if (event.decision === 'APPROVED') e.phase = 'RUN';
      else if (event.decision === 'CHANGES_REQUESTED') { e.phase = 'RESEARCH'; e.plan_changes = text(event.note, 'Requested changes'); }
      else fail('Decision must be APPROVED or CHANGES_REQUESTED.');
      note = optionalText(event.note, 'Approval note', 2000); break;
    }
    case 'data': {
      const d = e.data.find(d => d.id === event.data_id) ?? fail(`Unknown data item ${event.data_id}. The plan's data: ${e.data.map(d => d.id).join(', ') || 'none'}.`, nearest(event.data_id, e.data.map(d => d.id)));
      if (!['AVAILABLE', 'MISSING'].includes(event.status)) fail('Data status must be AVAILABLE or MISSING.');
      d.status = event.status; const n = optionalText(event.note, 'Data note', 1000); if (n) d.note = n; else delete d.note; break;
    }
    case 'start': { const [s] = stage(); need(s, ['READY'], 'start'); s.state = 'IN_PROGRESS'; break; }
    case 'complete': {
      const [s, def] = stage(); need(s, ['READY', 'IN_PROGRESS'], 'complete');
      if (def.kind === 'intake') fail('Intake completes itself once the brief is accepted.');
      const outputs = (Array.isArray(event.outputs) ? event.outputs : fail('List the outputs written.')).map(o => {
        object(o, 'Output'); keys(o, ['id', 'path', 'sha256'], 'Output');
        const spec = def.outputs.find(x => x.id === o.id) ?? fail(`Stage ${s.id} has no output ${o.id}.`);
        if (o.sha256 !== undefined && !/^[a-f0-9]{64}$/.test(o.sha256)) fail('Output sha256 must be lowercase hex.');
        return { id: o.id, path: o.path === undefined ? spec.path : text(o.path, 'Output path', 240), ...(o.sha256 ? { sha256: o.sha256 } : {}) };
      });
      const missingOut = def.outputs.filter(x => !outputs.some(o => o.id === x.id));
      if (missingOut.length) fail(`Write ${missingOut.map(x => x.path).join(', ')} before completing ${s.id}.`);
      const checks = (Array.isArray(event.checks) ? event.checks : fail('Report each check.')).map(c => {
        object(c, 'Check'); keys(c, ['id', 'result', 'note'], 'Check');
        if (!def.checks.some(x => x.id === c.id)) fail(`Stage ${s.id} has no check ${c.id}.`);
        if (!['PASS', 'FAIL', 'NOT_RUN'].includes(c.result)) fail('Check result must be PASS, FAIL or NOT_RUN.');
        return { id: c.id, result: c.result, ...(c.note ? { note: text(c.note, 'Check note', 1000) } : {}) };
      });
      const unmet = def.checks.filter(x => x.required && checks.find(c => c.id === x.id)?.result !== 'PASS');
      if (unmet.length) fail(`Fix and recheck before completing ${s.id}: ${unmet.map(x => x.name).join('; ')}.`);
      if (def.kind === 'decision' && !e.records.decisions.some(d => d.stage_id === s.id && d.round === e.round)) fail('Record the owner\'s decision with record_outcome_decision first.');
      if (def.kind === 'execution' && !Object.values(e.records.experiments).some(x => x.round === e.round)) fail('Register at least one experiment with record_outcome_experiment before launch is complete.');
      if (def.kind === 'learning' && Object.values(e.records.experiments).some(x => x.round === e.round && x.state !== 'CLOSED')) fail('Close every experiment from this round first.');
      s.outputs = outputs; s.checks = checks; note = optionalText(event.summary, 'Summary', 2000);
      if (note) s.summary = note;
      s.state = gateFor(def, e) === 'none' ? 'DONE' : 'AWAITING_APPROVAL'; break;
    }
    case 'approve': {
      const [s] = stage(); need(s, ['AWAITING_APPROVAL'], 'approve');
      if (event.by !== 'owner') fail('Only the owner approves. Report by: "owner" after they actually said so.');
      if (event.decision === 'APPROVED') s.state = 'DONE';
      else if (event.decision === 'CHANGES_REQUESTED') { s.state = 'IN_PROGRESS'; s.changes = text(event.note, 'Requested changes'); }
      else fail('Decision must be APPROVED or CHANGES_REQUESTED.');
      if (s.state === 'DONE') delete s.changes;
      note = optionalText(event.note, 'Approval note', 2000); break;
    }
    case 'skip': {
      const [s, def] = stage(); need(s, ['WAITING', 'READY', 'BLOCKED'], 'skip');
      if (['intake', 'decision', 'learning'].includes(def.kind)) fail('Intake, the owner\'s decision and learning cannot be skipped.');
      s.state = 'SKIPPED'; s.skip_reason = note = text(event.reason, 'Skip reason', 1000); delete s.block; break;
    }
    case 'block': { const [s] = stage(); need(s, ['READY', 'IN_PROGRESS'], 'block'); s.state = 'BLOCKED'; s.block = { by: 'host', reason: note = text(event.reason, 'Block reason', 1000) }; break; }
    case 'reopen': { const [s] = stage(); if (s.state !== 'BLOCKED' || s.block?.by !== 'host') fail('Only a stage the host blocked can be reopened; data blocks clear when the data arrives.'); s.state = 'WAITING'; delete s.block; break; }
    case 'autonomy': {
      if (event.by !== 'owner') fail('Only the owner sets autonomy.');
      if (![0, 1, 2, 3].includes(event.level)) fail('Autonomy level must be 0 to 3.');
      e.autonomy = { level: event.level }; note = optionalText(event.note, 'Autonomy note', 1000); break;
    }
    case 'next_round': {
      if (e.stages.at(-1).state !== 'DONE') fail('Finish the learning stage before starting another round.');
      const from = STAGE_KINDS.indexOf('diagnosis');
      for (const s of e.stages) if (STAGE_KINDS.indexOf(e.plan.stages.find(d => d.id === s.id).kind) >= from) { for (const k of Object.keys(s)) if (k !== 'id') delete s[k]; s.state = 'WAITING'; }
      e.round += 1; note = optionalText(event.note, 'Round note', 1000); break;
    }
  }
  e.history = [...e.history, { type: event.type, round: e.round, ...(event.stage_id ? { stage_id: event.stage_id } : {}), ...(event.type === 'plan' ? { plan_version: e.plan_version } : {}), ...(at ? { at } : {}), ...(note ? { note } : {}) }].slice(-200);
  return refresh(e);
}

/** The orchestrator's handoff for one stage: who, with what, producing what, checked how. */
export function stageInstruction(e, def) {
  const p = e.plan, s = e.stages.find(s => s.id === def.id);
  const inputs = def.depends_on.flatMap(d => e.stages.find(s => s.id === d).outputs?.map(o => o.path) ?? []);
  const data = def.data.map(id => { const d = p.data.find(d => d.id === id); return { id, name: d.name, status: e.data.find(x => x.id === id).status }; });
  const caps = def.needs.map(id => p.capabilities.find(c => c.id === id));
  const steps = def.from_steps.map(id => e.research.steps.find(s => s.id === id));
  const who = def.owner.role ? `the ${def.owner.role} specialist` : `the expert this stage needs (${def.owner.gap})`;
  const load = def.owner.role ? `Load the specialist with prepare_specialist {"role_id":"${def.owner.role}"}${def.support.length ? ` and, for their parts, ${def.support.map(r => `"${r}"`).join(', ')}` : ''}.` : `No catalogue specialist fits. Work as ${def.owner.gap}, using the items below, and note anything a specialist would have needed.`;
  const prompt = [
    `You are ${who} on outcome engagement ${e.id} (plan v${e.plan_version}, round ${e.round}).`,
    `Goal: ${def.goal}`,
    steps.length ? `This carries out the expert steps: ${steps.map(x => `${x.name} (${x.why})`).join('; ')}. RESEARCH.md has the sources.` : '',
    `Read first: BRIEF.md${inputs.length ? `, ${inputs.join(', ')}` : ''}.`, load,
    def.uses.length ? `Retrieve these items before using them, with get_item: ${def.uses.join(', ')}. Use only what this stage needs.` : '',
    data.length ? `Data: ${data.map(d => `${d.name} (${d.status})`).join('; ')}.` : '', ...(s.limits ?? []).map(l => `Limit: ${l}`),
    caps.length ? `Access: ${caps.map(c => `${c.name} (${c.access} via ${c.via}${c.access === 'live' ? '; only with the owner\'s approval of each action' : ''}${c.via === 'api_key' ? '; ask the owner for the key now, keep it in the environment or secret store, never in files' : ''})`).join('; ')}.` : '',
    def.kind === 'diagnosis' ? 'Test every hypothesis in hypotheses.md and add any the data suggests.' : '',
    s.changes ? `The owner asked for changes: ${s.changes}` : '',
    `Write: ${def.outputs.map(o => `${o.path} (${o.name})`).join('; ')}.`,
    `Check before reporting: ${def.checks.map(c => `${c.id}: ${c.name}${c.required ? '' : ' (optional)'}`).join('; ')}.`,
    def.reviewers.length ? `Then have ${def.reviewers.map(r => `"${r}"`).join(', ')} review the output (prepare_specialist) and fix what they find.` : '',
    `Owner-reported numbers stay reports until checked. Don't invent data, results or approvals. When done, call advance_outcome with {"type":"complete","stage_id":"${def.id}","outputs":[...],"checks":[...]}.`,
  ].filter(Boolean).join('\n');
  return { stage_id: def.id, kind: def.kind, name: def.name, state: s.state, owner: def.owner, support: def.support, reviewers: def.reviewers, uses: def.uses, inputs, data, capabilities: caps, outputs: def.outputs, checks: def.checks, gate: gateFor(def, e), ...(def.optional_when ? { optional_when: def.optional_when } : {}), ...(s.limits ? { limits: s.limits } : {}), prompt };
}

export function briefMarkdown(e) {
  const b = e.brief, m = b.metric;
  const list = (title, items) => items.length ? `\n## ${title}\n\n${items.map(x => `- ${x}`).join('\n')}\n` : '';
  return `# Brief\n\nEngagement ${e.id}, started ${e.started}, round ${e.round}.\n\n## What the owner said\n\n> ${e.request.replace(/\n/g, '\n> ')}\n\n## Outcome\n\n${b.outcome}\n\n**Deliverable:** ${b.deliverable}\n\n${b.done.map(d => `- [ ] ${d}`).join('\n')}\n` +
    `${m ? `\n## Metric\n\n${m.name}: ${m.direction}${m.target !== null ? ` to ${m.target}` : ''} (${m.unit}). Baseline: ${m.baseline ?? 'unknown'} (${m.baseline_source}).${b.deadline ? ` By ${b.deadline}.` : ''}\n` : b.deadline ? `\nBy ${b.deadline}.\n` : ''}` +
    list('Must not get worse', b.guardrails) + list('Limits', b.limits) + list('Reuse', b.assets) + list('Connections', b.connections.map(c => `${c.name}: ${c.access}, ${c.status}`)) +
    `\n## Working setup\n\n- Data home: ${b.data_home}\n- Decides: ${b.decides}${b.technical_level ? `\n- Hands-on: ${b.technical_level}` : ''}\n` + list('Still unknown', b.unknowns) +
    `${b.answers.length ? `\n## Questions and answers\n\n${b.answers.map(a => `- **${a.question}** ${a.answer}`).join('\n')}\n` : ''}` +
    `\n## Rules for every specialist\n\n- Read this brief and the outputs you are given before starting.\n- Reported numbers are reports until the evidence stage checks them.\n- Every claim points to its evidence. Unknowns stay unknown.\n- No live change, spend or publishing without the owner's approval of that action.\n- Write files only at the paths your stage names. Keys and tokens never go in files.\n`;
}
const ICON = { WAITING: 'waiting', READY: 'ready', IN_PROGRESS: 'in progress', AWAITING_APPROVAL: 'needs owner', DONE: 'done', SKIPPED: 'skipped', BLOCKED: 'blocked' };
export function statusMarkdown(e) {
  const head = `# Outcome ${e.id}\n\nPhase ${e.phase} · round ${e.round} · plan v${e.plan_version} · autonomy level ${e.autonomy.level}\n\n> ${e.request.split('\n')[0]}\n`;
  if (!e.plan) return head + `\n${e.phase === 'DEFINE' ? 'Writing the brief.' : 'Researching and composing the plan.'}\n`;
  return head + `\n| # | Stage | State | Owner | Note |\n|---|---|---|---|---|\n${e.plan.stages.map((d, i) => { const s = e.stages[i]; return `| ${i + 1} | ${d.name} | ${ICON[s.state]} | ${d.owner.role ?? 'gap'} | ${(s.block?.reason ?? s.skip_reason ?? s.changes ?? s.limits?.join(' ') ?? '').replace(/\|/g, '/')} |`; }).join('\n')}\n\nDecisions: ${e.records.decisions.length}. Experiments: ${Object.keys(e.records.experiments).length} (${Object.values(e.records.experiments).filter(x => x.state === 'CLOSED').length} closed).\n`;
}
export function dataRequestsMarkdown(e) {
  const open = e.plan.data.filter(d => e.data.find(x => x.id === d.id).status !== 'AVAILABLE');
  return `# Data we need\n\n${open.map(d => `## ${d.name} (${e.data.find(x => x.id === d.id).status})\n\nWhy: ${d.why}\n\nFields: ${d.fields.join(', ') || 'as named'}.\n\n${d.routes.map(r => `- ${r.kind}: ${r.how}`).join('\n')}${d.alternative ? `\n\nIf it can't be had: ${d.alternative}` : ''}`).join('\n\n') || 'Everything this plan needs is available.'}\n`;
}

/** The anonymised plan and how it went. Shared with AI Blocks only if the owner agrees, after reading it. */
export function planPattern(e) {
  const closed = Object.values(e.records.experiments).filter(x => x.state === 'CLOSED');
  return {
    schema: 'ai-blocks-plan-pattern/1', share: 'ONLY_WITH_OWNER_CONSENT', review_before_sharing: 'Stage and step names were written by the host. Remove anything that identifies the business before sharing.',
    method_version: METHOD.version, plan_version: e.plan_version, rounds: e.round, metric: e.brief.metric ? { name: e.brief.metric.name, direction: e.brief.metric.direction } : null,
    research: { steps: e.research.steps.map(s => s.name), source_kinds: [...new Set(e.research.sources.map(s => s.kind))].sort() },
    stages: e.plan.stages.map((d, i) => ({ kind: d.kind, name: d.name, owner: d.owner.role ?? null, gap: d.owner.gap ?? null, uses: d.uses, checks: d.checks.map(c => c.name), gate: d.gate, state: e.stages[i].state })),
    dropped: e.plan.dropped.map(d => d.reason), experiments: closed.map(x => ({ hypothesis_id: x.hypothesis_id ?? null, verdict: x.verdict })),
  };
}

/** What the host should do next, plus the files to save in outcomes/<id>/. */
export async function describeEngagement(e, { initial = false } = {}) {
  const p = e.plan;
  const files = { 'engagement.json': JSON.stringify(e, null, 2) + '\n', 'ENGAGEMENT.md': statusMarkdown(e), ...(e.brief ? { 'BRIEF.md': briefMarkdown(e) } : {}) };
  if (initial) Object.assign(files, { 'METHOD.md': methodMarkdown(), 'decisions.jsonl': '', 'experiments.jsonl': '', 'LEARNINGS.md': '# Learnings\n\nOne line per learning: date, scope (engagement, business or platform), the rule, and the decision or experiment it came from.\n' });
  const base = { schema: 'ai-blocks-outcome-step/1', folder: `outcomes/${e.id}/`, engagement: e, engagement_sha256: await engagementDigest(e), review: { host_reported: true, independently_verified: false, grants_execution_authority: false } };
  // The method travels once, as files["METHOD.md"], which the host saves and rereads at each phase.
  if (e.phase === 'DEFINE') return { ...base, state: 'NEEDS_BRIEF', method_version: METHOD.version, next: `Ask the owner one batch of questions covering the brief frame${initial ? ' in files["METHOD.md"]' : ' in METHOD.md'} (skip what the conversation, memory or brand files already answer), then call advance_outcome with {"type":"brief","brief":{...}}.`, files };
  if (e.phase === 'RESEARCH') return { ...base, state: 'NEEDS_PLAN', next: `${e.plan_changes ? `The owner asked for changes to plan v${e.plan_version}: ${e.plan_changes}. ` : ''}Research how experts do this job (memory, then our catalogue, then the web), write RESEARCH.md, compose the plan from our catalogue, then call advance_outcome with {"type":"plan","research":{...},"plan":{...}}. METHOD.md has the rules.`, research_protocol: METHOD.research_protocol, composition_rules: METHOD.composition_rules, files };
  Object.assign(files, { 'PLAN.md': planMarkdown(e.brief, e.research, p, { version: e.plan_version, warnings: e.plan_check.warnings }), 'RESEARCH.md': researchMarkdown(e.research), 'hypotheses.md': hypothesesMarkdown(p), 'DATA-REQUESTS.md': dataRequestsMarkdown(e) });
  const warnings = [...e.plan_check.warnings, ...(e.plan_check.catalogue_checked ? [] : ['Specialists and items were not checked against the live catalogue on this call.'])];
  if (e.phase === 'PLAN_REVIEW') return { ...base, state: 'AWAITING_PLAN_APPROVAL', next: 'Show the owner PLAN.md and anything under "Worth knowing". Report their actual answer with {"type":"approve_plan","by":"owner","decision":"APPROVED"} or CHANGES_REQUESTED with their note.', warnings, files };

  const by = s => e.stages.filter(x => x.state === s).map(x => p.stages.find(d => d.id === x.id));
  const order = d => p.stages.indexOf(d);
  const ready = [...by('READY'), ...by('IN_PROGRESS')].filter(d => d.kind !== 'intake').sort((a, b) => order(a) - order(b));
  const awaiting = by('AWAITING_APPROVAL'), blocked = by('BLOCKED'), learningDone = e.stages.at(-1).state === 'DONE';
  const state = awaiting.length ? 'AWAITING_OWNER' : ready.length ? 'READY' : learningDone ? 'ROUND_COMPLETE' : blocked.length ? 'BLOCKED' : 'WAITING';
  if (state === 'ROUND_COMPLETE') files['PATTERN.json'] = JSON.stringify(planPattern(e), null, 2) + '\n';
  const next = {
    AWAITING_OWNER: `Show the owner ${awaiting.map(d => d.name).join(', ')} and ask for approval or changes. Report their actual answer with {"type":"approve"}.${ready.length ? ` Meanwhile, run ${ready.map(d => d.name).join(', ')}.` : ''}`,
    READY: `Run ${ready.map(d => d.name).join(', ')}${ready.length > 1 ? ' (they can run in parallel)' : ''} using each stage prompt. If results show the plan no longer fits, submit a revised plan.`,
    ROUND_COMPLETE: 'Share the learnings. Offer the owner PATTERN.json to share with AI Blocks, only if they agree after reading it. For another round call advance_outcome with {"type":"next_round"}, or submit a revised plan.',
    BLOCKED: 'Get the missing data in DATA-REQUESTS.md, skip the blocked stage with a reason the owner accepts, or submit a revised plan.',
    WAITING: 'Nothing can run yet. Check blocked stages and data requests.',
  }[state];
  return {
    ...base, state, next, ready: ready.map(d => stageInstruction(e, d)), awaiting_owner: awaiting.map(d => ({ stage_id: d.id, name: d.name, gate: gateFor(d, e) })),
    blocked: blocked.map(d => ({ stage_id: d.id, name: d.name, reason: e.stages.find(s => s.id === d.id).block?.reason })), ...(warnings.length ? { warnings } : {}), files,
  };
}
