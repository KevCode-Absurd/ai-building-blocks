// One owner's job running through one playbook. The host keeps engagement.json in the owner's project and sends it back;
// this module checks each move and says what can run next. No model, storage, scheduling or external action runs here.
import { canonicalTeamJSON } from '../teams/team-contract.mjs';
import { STAGE_KINDS, playbookMarkdown, hypothesesMarkdown } from './playbook-contract.mjs';

export const ENGAGEMENT_SCHEMA = 'ai-blocks-outcome-engagement/1';
export const STAGE_STATES = ['WAITING', 'READY', 'IN_PROGRESS', 'AWAITING_APPROVAL', 'DONE', 'SKIPPED', 'BLOCKED'];
const SETTLED = new Set(['DONE', 'SKIPPED']);
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const ID = /^[a-z0-9][a-z0-9-]{0,79}$/;
const encoder = new TextEncoder();

export const fail = message => { throw Error(message); };
const object = (v, label) => v && typeof v === 'object' && !Array.isArray(v) ? v : fail(`${label} must be an object.`);
const keys = (v, allowed, label) => { const extra = Object.keys(v).find(k => !allowed.includes(k)); if (extra) fail(`${label} has an unsupported field: ${extra}.`); };
export const text = (v, label, max = 2000) => typeof v === 'string' && v.trim() && v.length <= max ? v.trim() : fail(`${label} must be nonempty text of at most ${max} characters.`);
const optionalText = (v, label, max) => v === undefined || v === null ? null : text(v, label, max);
const date = (v, label) => v === undefined ? null : DATE.test(v ?? '') ? v : fail(`${label} must be YYYY-MM-DD.`);
const clone = v => JSON.parse(JSON.stringify(v));
const kindAt = s => STAGE_KINDS.indexOf(s.kind);

export async function engagementDigest(e) {
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(canonicalTeamJSON(e))))].map(v => v.toString(16).padStart(2, '0')).join('');
}

/** Check that a host-returned engagement belongs to this playbook version and has a coherent shape. */
export function checkEngagement(playbook, input) {
  const e = object(input, 'Engagement');
  keys(e, ['schema', 'id', 'playbook', 'request', 'started', 'round', 'autonomy', 'answers', 'data', 'stages', 'records', 'history'], 'Engagement');
  if (e.schema !== ENGAGEMENT_SCHEMA) fail('Unknown engagement schema.');
  if (encoder.encode(JSON.stringify(e)).length > 200000) fail('The engagement exceeds 200 KB. Keep evidence in files and reference their paths.');
  if (!ID.test(e.id ?? '')) fail('Engagement id is invalid.');
  if (e.playbook?.id !== playbook.id || e.playbook?.version !== playbook.version) fail('This engagement was started on a different playbook version.');
  text(e.request, 'Request', 4000); date(e.started, 'Start date');
  if (!Number.isSafeInteger(e.round) || e.round < 1) fail('Round must be a positive integer.');
  if (![0, 1, 2, 3].includes(e.autonomy?.level)) fail('Autonomy level must be 0 to 3.');
  object(e.answers, 'Answers');
  for (const [k, v] of Object.entries(e.answers)) { if (!playbook.questions.some(q => q.id === k)) fail(`Unknown answer ${k}.`); text(v, 'Answer'); }
  if (!Array.isArray(e.stages) || e.stages.map(s => s.id).join() !== playbook.stages.map(s => s.id).join()) fail('Engagement stages do not match the playbook.');
  for (const s of e.stages) if (!STAGE_STATES.includes(s.state)) fail(`Stage ${s.id} has an unknown state.`);
  if (!Array.isArray(e.data) || e.data.map(d => d.id).join() !== playbook.data.map(d => d.id).join()) fail('Engagement data does not match the playbook.');
  if (!Array.isArray(e.records?.decisions) || !object(e.records?.experiments, 'Experiment records')) fail('Engagement records are malformed.');
  if (!Array.isArray(e.history)) fail('Engagement history must be a list.');
  return e;
}

function applyAnswers(playbook, e, answers) {
  object(answers, 'Answers');
  for (const [k, raw] of Object.entries(answers)) {
    const q = playbook.questions.find(q => q.id === k) ?? fail(`Unknown question ${k}. Ask only the listed questions.`);
    const v = text(raw, `Answer to ${k}`);
    if (q.options.length && !q.options.some(o => o.value === v) && !v.startsWith('other:')) fail(`Answer ${k} with one of: ${q.options.map(o => o.value).join(', ')}, or "other: ...".`);
    e.answers[k] = v;
  }
}

/** Effective gate after the owner's autonomy level. Decisions and live actions always stop for the owner. */
export function gateFor(stage, e) {
  if (stage.gate !== 'review') return stage.gate;
  if (stage.kind === 'production') return e.autonomy.level >= 2 && e.round > 1 ? 'none' : 'review';
  return e.autonomy.level >= 1 ? 'none' : 'review';
}

function refresh(playbook, e) {
  const by = new Map(e.stages.map(s => [s.id, s]));
  for (const def of playbook.stages) {
    const s = by.get(def.id);
    if (def.kind === 'intake') { if (!SETTLED.has(s.state)) s.state = playbook.questions.every(q => !q.required || e.answers[q.id]) ? 'DONE' : 'READY'; continue; }
    if (!['WAITING', 'READY', 'BLOCKED'].includes(s.state) || s.block?.by === 'host') continue;
    if (!def.depends_on.every(d => SETTLED.has(by.get(d).state))) { s.state = 'WAITING'; delete s.block; continue; }
    const needed = playbook.data.filter(d => d.required_for.includes(def.id));
    const missing = needed.filter(d => e.data.find(x => x.id === d.id).status === 'MISSING');
    const hard = missing.filter(d => !d.alternative);
    if (hard.length) { s.state = 'BLOCKED'; s.block = { by: 'data', reason: `Missing ${hard.map(d => d.name).join(', ')}.` }; continue; }
    s.state = 'READY'; delete s.block;
    if (missing.length) s.limits = missing.map(d => `${d.name} is missing: ${d.alternative}`); else delete s.limits;
  }
  return e;
}

/** Start an engagement from the owner's own words and any answers the conversation already gives. */
export function startEngagement(playbook, { request, answers = {}, id, started } = {}) {
  const day = date(started, 'Start date') ?? new Date().toISOString().slice(0, 10);
  const eid = id === undefined ? `${day.replaceAll('-', '')}-${playbook.id}`.slice(0, 80) : ID.test(id) ? id : fail('Engagement id must be a lowercase id.');
  const e = {
    schema: ENGAGEMENT_SCHEMA, id: eid, playbook: { id: playbook.id, version: playbook.version }, request: text(request, 'Request', 4000), started: day, round: 1,
    autonomy: { level: 0 }, answers: {}, data: playbook.data.map(d => ({ id: d.id, status: 'UNKNOWN' })),
    stages: playbook.stages.map(s => ({ id: s.id, state: 'WAITING' })), records: { decisions: [], experiments: {} }, history: [{ type: 'start', round: 1, at: day }],
  };
  applyAnswers(playbook, e, answers);
  return refresh(playbook, e);
}

const EVENT_FIELDS = { answer: ['answers'], data: ['data_id', 'status', 'note'], start: ['stage_id'], complete: ['stage_id', 'outputs', 'checks', 'summary'], approve: ['stage_id', 'decision', 'by', 'note'], skip: ['stage_id', 'reason'], block: ['stage_id', 'reason'], reopen: ['stage_id'], autonomy: ['level', 'by', 'note'], next_round: ['note'] };

/** Apply one host-reported event. Rejects moves the playbook does not allow, and says exactly why. */
export function advanceEngagement(playbook, input, event) {
  const e = clone(checkEngagement(playbook, input));
  object(event, 'Event');
  const fields = EVENT_FIELDS[event.type] ?? fail(`Event type must be one of ${Object.keys(EVENT_FIELDS).join(', ')}.`);
  keys(event, ['type', 'at', ...fields], 'Event');
  const at = date(event.at, 'Event date');
  const stage = () => { const s = e.stages.find(s => s.id === event.stage_id) ?? fail('Unknown stage.'); return [s, playbook.stages.find(d => d.id === s.id)]; };
  const need = (s, states, verb) => { if (!states.includes(s.state)) fail(`Stage ${s.id} is ${s.state}; it must be ${states.join(' or ')} to ${verb}.`); };
  let note = null;
  switch (event.type) {
    case 'answer': applyAnswers(playbook, e, event.answers); break;
    case 'data': {
      const d = e.data.find(d => d.id === event.data_id) ?? fail('Unknown data item.');
      if (!['AVAILABLE', 'MISSING'].includes(event.status)) fail('Data status must be AVAILABLE or MISSING.');
      d.status = event.status; const n = optionalText(event.note, 'Data note', 1000); if (n) d.note = n; else delete d.note; break;
    }
    case 'start': { const [s] = stage(); need(s, ['READY'], 'start'); s.state = 'IN_PROGRESS'; break; }
    case 'complete': {
      const [s, def] = stage(); need(s, ['READY', 'IN_PROGRESS'], 'complete');
      if (def.kind === 'intake') fail('Intake completes itself once the required questions are answered.');
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
      if (def.kind === 'intake' || def.kind === 'decision') fail('Intake and the owner\'s decision cannot be skipped.');
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
      if (e.stages.find(s => s.id === playbook.stages.findLast(d => d.kind === 'learning')?.id)?.state !== 'DONE') fail('Finish the learning stage before starting another round.');
      const from = STAGE_KINDS.indexOf('diagnosis');
      for (const s of e.stages) if (kindAt(playbook.stages.find(d => d.id === s.id)) >= from) { for (const k of Object.keys(s)) if (k !== 'id') delete s[k]; s.state = 'WAITING'; }
      e.round += 1; note = optionalText(event.note, 'Round note', 1000); break;
    }
  }
  e.history = [...e.history, { type: event.type, round: e.round, ...(event.stage_id ? { stage_id: event.stage_id } : {}), ...(at ? { at } : {}), ...(note ? { note } : {}) }].slice(-200);
  return refresh(playbook, e);
}

const ownerOf = def => def.owner.role ? `the ${def.owner.role} specialist` : `the best ${def.owner.area === 'all' ? '' : def.owner.area + ' '}specialist for this stage`;
/** The orchestrator's handoff for one stage: who, with what, producing what, checked how. */
export function stageInstruction(playbook, e, def) {
  const s = e.stages.find(s => s.id === def.id);
  const inputs = def.depends_on.flatMap(d => e.stages.find(s => s.id === d).outputs?.map(o => o.path) ?? []);
  const data = def.data.map(id => { const d = playbook.data.find(d => d.id === id); return { id, name: d.name, status: e.data.find(x => x.id === id).status }; });
  const caps = def.needs.map(id => playbook.capabilities.find(c => c.id === id));
  const load = def.owner.role ? `Load the specialist with prepare_specialist {"role_id":"${def.owner.role}"}${def.support.length ? ` and, for their parts, ${def.support.map(r => `"${r}"`).join(', ')}` : ''}.` : `Choose the specialist with find_specialist or route_scoped_specialist_work for the "${def.owner.area}" area, and confirm the choice with the owner.`;
  const prompt = [
    `You are ${ownerOf(def)} on outcome engagement ${e.id} (${playbook.name} v${playbook.version}, round ${e.round}).`,
    `Goal: ${def.goal}`,
    `Read first: BRIEF.md${inputs.length ? `, ${inputs.join(', ')}` : ''}.`, load,
    def.methods.length ? `Retrieve the full methods before using them, with get_item: ${def.methods.join(', ')}. Use only what this stage needs.` : '',
    data.length ? `Data: ${data.map(d => `${d.name} (${d.status})`).join('; ')}.` : '', ...(s.limits ?? []).map(l => `Limit: ${l}`),
    caps.length ? `Tools: ${caps.map(c => `${c.id} (${c.access}${c.access === 'live' ? ': only with the owner\'s approval of each action' : ''})`).join('; ')}.` : '',
    def.kind === 'diagnosis' ? 'Test every hypothesis in hypotheses.md and add any the data suggests.' : '',
    s.changes ? `The owner asked for changes: ${s.changes}` : '',
    `Write: ${def.outputs.map(o => `${o.path} (${o.name})`).join('; ')}.`,
    def.checks.length ? `Check before reporting: ${def.checks.map(c => `${c.id}: ${c.name}${c.required ? '' : ' (optional)'}`).join('; ')}.` : '',
    `Owner-reported numbers stay reports until checked. Don't invent data, results or approvals. When done, call advance_outcome with {"type":"complete","stage_id":"${def.id}","outputs":[...],"checks":[...]}.`,
  ].filter(Boolean).join('\n');
  return { stage_id: def.id, kind: def.kind, name: def.name, state: s.state, owner: def.owner, support: def.support, methods: def.methods, inputs, data, capabilities: caps, outputs: def.outputs, checks: def.checks, gate: gateFor(def, e), ...(def.optional_when ? { optional_when: def.optional_when } : {}), ...(s.limits ? { limits: s.limits } : {}), prompt };
}

const answerOf = (p, e, id) => e.answers[id] ? (p.questions.find(q => q.id === id).options.find(o => o.value === e.answers[id])?.label ?? e.answers[id]) : null;
export function briefMarkdown(p, e) {
  const asked = p.questions.filter(q => e.answers[q.id]), open = p.questions.filter(q => !e.answers[q.id]);
  return `# Brief: ${p.name}\n\nEngagement ${e.id}, started ${e.started}, round ${e.round}. Playbook ${p.id} v${p.version}.\n\n## What the owner said\n\n> ${e.request.replace(/\n/g, '\n> ')}\n\n## What we know\n\n${asked.map(q => `- **${q.ask}** ${answerOf(p, e, q.id)}`).join('\n') || '- Nothing yet beyond the request.'}\n\n## Outcome\n\n${p.outcome}\n${p.metric ? `\n- Steered by: ${p.metric.name} (${p.metric.direction}).\n${p.metric.guardrails.map(g => `- Limit: ${g}`).join('\n')}\n` : ''}\n## Still to answer\n\n${open.map(q => `- ${q.ask}${q.required ? ' (required)' : ''}`).join('\n') || '- Nothing.'}\n\n## Data\n\n${p.data.map(d => `- ${d.name}: ${e.data.find(x => x.id === d.id).status}`).join('\n') || '- Named at intake.'}\n\n## Rules for every specialist\n\n- Read this brief and the outputs you are given before starting.\n- Numbers the owner reported are reports until the evidence stage checks them.\n- Every claim points to its evidence. Unknowns stay unknown.\n- No live change, spend or publishing without the owner's approval of that action.\n- Write files only at the paths your stage names.\n`;
}
export function statusMarkdown(p, e) {
  const icon = { WAITING: 'waiting', READY: 'ready', IN_PROGRESS: 'in progress', AWAITING_APPROVAL: 'needs owner', DONE: 'done', SKIPPED: 'skipped', BLOCKED: 'blocked' };
  return `# ${p.name}\n\n${e.id} · round ${e.round} · autonomy level ${e.autonomy.level}\n\n| # | Stage | State | Owner | Note |\n|---|---|---|---|---|\n${p.stages.map((d, i) => { const s = e.stages[i]; return `| ${i + 1} | ${d.name} | ${icon[s.state]} | ${d.owner.role ?? d.owner.area} | ${(s.block?.reason ?? s.skip_reason ?? s.changes ?? s.limits?.join(' ') ?? '').replace(/\|/g, '/')} |`; }).join('\n')}\n\nDecisions: ${e.records.decisions.length}. Experiments: ${Object.keys(e.records.experiments).length} (${Object.values(e.records.experiments).filter(x => x.state === 'CLOSED').length} closed).\n`;
}
export function dataRequestsMarkdown(p, e) {
  const open = p.data.filter(d => e.data.find(x => x.id === d.id).status !== 'AVAILABLE');
  return `# Data we need\n\n${open.map(d => `## ${d.name} (${e.data.find(x => x.id === d.id).status})\n\nWhy: ${d.why}\n\nFields: ${d.fields.join(', ') || 'as named'}.\n\n${d.routes.map(r => `- ${r.kind}: ${r.how}`).join('\n')}${d.alternative ? `\n\nIf it can't be had: ${d.alternative}` : ''}`).join('\n\n') || 'Everything this playbook needs is available.'}\n`;
}

/** What the host should do next, plus the files to save in outcomes/<id>/. */
export async function describeEngagement(p, e, { initial = false } = {}) {
  const by = s => e.stages.filter(x => x.state === s).map(x => p.stages.find(d => d.id === x.id));
  const questions = p.questions.filter(q => !e.answers[q.id]).sort((a, b) => Number(b.required) - Number(a.required)).map(q => ({ id: q.id, ask: q.ask, why: q.why, required: q.required, ...(q.options.length ? { options: q.options.map(({ value, label }) => ({ value, label })) } : {}) }));
  const route = p.fallback && e.answers.route ? p.questions.find(q => q.id === 'route').options.find(o => o.value === e.answers.route)?.playbook ?? null : null;
  const ready = [...by('READY'), ...by('IN_PROGRESS')].filter(d => d.kind !== 'intake').sort((a, b) => a.order - b.order);
  const awaiting = by('AWAITING_APPROVAL'), blocked = by('BLOCKED'), learningDone = e.stages.at(-1).state === 'DONE';
  const intakeOpen = e.stages[0].state !== 'DONE';
  const state = route ? 'SWITCH_PLAYBOOK' : intakeOpen ? 'NEEDS_ANSWERS' : awaiting.length ? 'AWAITING_OWNER' : ready.length ? 'READY' : learningDone ? 'ROUND_COMPLETE' : blocked.length ? 'BLOCKED' : 'WAITING';
  const files = {
    'engagement.json': JSON.stringify(e, null, 2) + '\n', 'ENGAGEMENT.md': statusMarkdown(p, e), 'BRIEF.md': briefMarkdown(p, e), 'DATA-REQUESTS.md': dataRequestsMarkdown(p, e),
    ...(initial ? { 'PLAYBOOK.md': playbookMarkdown(p), 'hypotheses.md': hypothesesMarkdown(p), 'decisions.jsonl': '', 'experiments.jsonl': '', 'LEARNINGS.md': '# Learnings\n\nOne line per learning: date, scope (engagement, business or playbook), the rule, and the decision or experiment it came from.\n' } : {}),
  };
  const next = {
    SWITCH_PLAYBOOK: `The owner's answer fits the ${route} playbook. Call start_outcome with playbook_id "${route}", the same request and the answers already given.`,
    NEEDS_ANSWERS: 'Ask the open questions in one batch, skipping any the conversation already answers, then call advance_outcome with {"type":"answer"}.',
    AWAITING_OWNER: `Show the owner ${awaiting.map(d => d.name).join(', ')} and ask for approval or changes. Report their actual answer with {"type":"approve"}.${ready.length ? ` Meanwhile, run ${ready.map(d => d.name).join(', ')}.` : ''}`,
    READY: `Run ${ready.map(d => d.name).join(', ')}${ready.length > 1 ? ' (they can run in parallel)' : ''} using each stage prompt.`,
    ROUND_COMPLETE: 'Share the learnings. If the owner wants another round, call advance_outcome with {"type":"next_round"}.',
    BLOCKED: 'Get the missing data in DATA-REQUESTS.md, or skip the blocked stage with a reason the owner accepts.',
    WAITING: 'Nothing can run yet. Check blocked stages and data requests.',
  }[state];
  return {
    schema: 'ai-blocks-outcome-step/1', state, folder: `outcomes/${e.id}/`, engagement: e, engagement_sha256: await engagementDigest(e), next, questions,
    ...(route ? { switch_to: route } : {}), ready: ready.map(d => stageInstruction(p, e, d)), awaiting_owner: awaiting.map(d => ({ stage_id: d.id, name: d.name, gate: gateFor(d, e) })),
    blocked: blocked.map(d => ({ stage_id: d.id, name: d.name, reason: e.stages.find(s => s.id === d.id).block?.reason })),
    files, review: { host_reported: true, independently_verified: false, grants_execution_authority: false },
  };
}
