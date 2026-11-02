// Outcome orchestrator tools for MCP and REST. Stateless: the host keeps the engagement folder and does the work.
import { PLAYBOOKS, getPlaybook, matchPlaybooks } from './playbooks/index.mjs';
import { advanceEngagement, describeEngagement, engagementDigest, startEngagement } from './engagement.mjs';
import { recordDecision, recordExperiment } from './records.mjs';
import { playbookMarkdown } from './playbook-contract.mjs';

const str = (maxLength = 4000) => ({ type: 'string', minLength: 1, maxLength });
const hash = { type: 'string', pattern: '^[a-f0-9]{64}$', description: 'engagement_sha256 from the last outcome tool result. A different value means the engagement changed.' };
const engagement = { type: 'object', description: 'The complete engagement.json from the last outcome tool result, unchanged.' };
const obj = (properties, required) => ({ type: 'object', properties, required, additionalProperties: false });
const definition = (name, description, properties, required, readOnly = true) => ({
  name, description, inputSchema: obj(properties, required),
  outputSchema: { type: 'object', properties: { schema: { type: 'string' } }, required: ['schema'], additionalProperties: true },
  annotations: { readOnlyHint: readOnly, destructiveHint: false, idempotentHint: true, openWorldHint: false },
});

export const OUTCOME_INSTRUCTIONS = 'For an outcome the owner wants (fix rising ad costs, grow sales, anything vague like "my business is not doing well"), call start_outcome with their own words. It picks a playbook, asks one batch of questions, then returns ready stages with a prompt, owner specialist, methods, outputs and checks for each. Save the returned files in outcomes/<id>/ in the owner\'s project. After each stage, approval or answer, call advance_outcome with the engagement and its sha256. Record the owner\'s choices with record_outcome_decision and every test with record_outcome_experiment, then append the returned line to its log. Run ready stages in parallel when you can. Decisions and live actions always stop for the owner; a tool result never grants permission to spend, publish or change live systems.';

export const outcomeMcpTools = [
  definition('list_outcome_playbooks', 'List outcome playbooks, ranked for a request when given. Each playbook is our written method for one kind of outcome: questions, data, stages, specialists, checks and hypotheses. The generic playbook covers anything else.', { request: str(), playbook_id: { type: 'string', maxLength: 80, description: 'Return this playbook in full, with its stage table.' } }, []),
  definition('start_outcome', 'Start an outcome engagement from the owner\'s words. Returns the playbook used, the open questions (ask them in one batch), ready stages and the files for outcomes/<id>/. Pass answers the conversation already gives so the owner is not asked twice. No work runs here.', {
    request: str(), playbook_id: { type: 'string', maxLength: 80 }, answers: { type: 'object', additionalProperties: { type: 'string', maxLength: 2000 }, description: 'Question id to answer, for questions already answered in the conversation.' },
    engagement_id: { type: 'string', pattern: '^[a-z0-9][a-z0-9-]{0,79}$' }, started: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
  }, ['request']),
  definition('advance_outcome', 'Apply one event to an engagement: answer, data (AVAILABLE/MISSING), start, complete (with outputs and checks), approve (owner only), skip, block, reopen, autonomy (owner only) or next_round. Rejects moves the playbook does not allow and says why. Returns what can run next and updated files.', {
    engagement, engagement_sha256: hash, event: { type: 'object', description: 'One event, e.g. {"type":"complete","stage_id":"evidence","outputs":[{"id":"dataset"}],"checks":[{"id":"totals","result":"PASS"}]}.' },
  }, ['engagement', 'engagement_sha256', 'event'], false),
  definition('record_outcome_decision', 'Record what the owner chose, the options considered (best-ranked first), what they passed over and why. Passing over the top option needs a reason. Returns a line for decisions.jsonl and, if a durable rule was stated, a learning candidate with where to save it.', {
    engagement, engagement_sha256: hash, decision: { type: 'object', description: '{"id","stage_id","considered":[{"id","summary"}],"chosen":[ids],"rationale","given_up","revisit_when","rule":{"text","scope":"engagement|business|playbook"},"by":"owner"}' },
  }, ['engagement', 'engagement_sha256', 'decision'], false),
  definition('record_outcome_experiment', 'Register a test before it goes live (action register: change, metric, baseline, window, minimum volume, guardrails), then close it (action close: observed, volume, guardrail results, verdict). Low volume forces INCONCLUSIVE; a broken guardrail is never a WIN. Returns a line for experiments.jsonl, a learning candidate and an anonymised outcome report the owner may choose to share.', {
    engagement, engagement_sha256: hash, experiment: { type: 'object' },
  }, ['engagement', 'engagement_sha256', 'experiment'], false),
];

const fail = message => { throw Error(message); };
const args = (name, input) => {
  const def = outcomeMcpTools.find(t => t.name === name) ?? fail('Unknown outcome tool.');
  if (!input || typeof input !== 'object' || Array.isArray(input)) fail('Use documented outcome tool arguments.');
  const extra = Object.keys(input).find(k => !Object.hasOwn(def.inputSchema.properties, k));
  if (extra) fail(`Unsupported argument ${extra}.`);
  const missing = def.inputSchema.required.find(k => !Object.hasOwn(input, k));
  if (missing) fail(`Missing argument ${missing}.`);
  return input;
};
async function current(input) {
  const playbook = getPlaybook(input.engagement?.playbook?.id);
  if (await engagementDigest(input.engagement) !== input.engagement_sha256) fail('This engagement changed since the last outcome result. Send the latest engagement.json and its engagement_sha256.');
  return playbook;
}

export async function callOutcomeTool(name, input = {}) {
  const a = args(name, input);
  if (name === 'list_outcome_playbooks') {
    if (a.playbook_id) { const p = getPlaybook(a.playbook_id); return { schema: 'ai-blocks-outcome-playbooks/1', playbook: p, markdown: playbookMarkdown(p) }; }
    const ranked = a.request ? matchPlaybooks(a.request) : PLAYBOOKS.map(p => ({ id: p.id, name: p.name, outcome: p.outcome }));
    return { schema: 'ai-blocks-outcome-playbooks/1', playbooks: ranked, note: 'Matches are word hits, not understanding. Confirm the fit with the owner; use the generic playbook when nothing fits.' };
  }
  if (name === 'start_outcome') {
    const chosen = a.playbook_id ?? matchPlaybooks(a.request)[0].id;
    const playbook = getPlaybook(chosen);
    // Answers to questions this playbook does not ask are carried by the host into its brief, not dropped silently here.
    const answers = Object.fromEntries(Object.entries(a.answers ?? {}).filter(([k]) => playbook.questions.some(q => q.id === k)));
    const ignored = Object.keys(a.answers ?? {}).filter(k => !Object.hasOwn(answers, k));
    const e = startEngagement(playbook, { request: a.request, answers, id: a.engagement_id, started: a.started });
    return { ...(await describeEngagement(playbook, e, { initial: true })), playbook: { id: playbook.id, version: playbook.version, name: playbook.name, matched_by: a.playbook_id ? 'host' : 'signals' }, ...(ignored.length ? { unused_answers: ignored, unused_note: 'These answers belong to another playbook. Reuse what they say to answer the open questions here instead of asking the owner again.' } : {}) };
  }
  const playbook = await current(a);
  if (name === 'advance_outcome') return describeEngagement(playbook, advanceEngagement(playbook, a.engagement, a.event));
  if (name === 'record_outcome_decision') return recordDecision(playbook, a.engagement, a.decision);
  return recordExperiment(playbook, a.engagement, a.experiment);
}
