import { startJob, advanceJob, JobValidationError, JOB_EVENTS } from './engine.mjs';
import { proposeTeam, getApproaches, buildOrgChart } from './propose-team.mjs';
import { localPreferences, updatePreferences } from './dials.mjs';
import { dialQuestions } from './dial-questions.mjs';
import { jobMethod, jobRecords, deliveryTemplates } from './method.mjs';
import { JOB_SCHEMAS } from './contracts.mjs';
import { checkSchema } from '../outcomes/schema-check.mjs';
import { prepareJobContext, DELIVERABLE_KINDS } from './grounding.mjs';
import { intakeQuestions, INTAKE_ASK } from './intake-questions.mjs';
import { routeJob } from './router.mjs';

const text = maxLength => ({ type: 'string', minLength: 1, maxLength });
const object = { type: 'object' }, hash = { type: 'string', pattern: '^[a-f0-9]{64}$' };
const host = { type: 'object', properties: { parallel_agents: { type: 'boolean' }, max_parallel: { type: 'integer', minimum: 1, maximum: 100 }, models: { type: 'array', maxItems: 20, items: text(100) }, tools: { type: 'array', maxItems: 50, items: text(100) }, visual_renderers: { type: 'array', maxItems: 20, items: text(100) }, connectors: { type: 'array', maxItems: 50, items: text(100) }, budget: { type: 'string', enum: ['small', 'normal', 'large'] } }, additionalProperties: false };
const kindField = { type: 'string', enum: DELIVERABLE_KINDS, description: 'Declare it; a word guess is only a suggestion.' };
const grounding = { deliverable_kind: kindField, site_url: { type: 'string', minLength: 8, maxLength: 2000, pattern: '^https?://[^ ]+$' }, has_existing_asset: { type: 'boolean', description: 'true: patch an existing asset.' } };
const definition = (name, title, description, properties, required = [], rest) => ({ name, title, description, inputSchema: { type: 'object', properties, required, additionalProperties: false }, outputSchema: { type: 'object', properties: { schema: { type: 'string' } }, required: ['schema'], additionalProperties: true }, annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: name !== 'start_job', openWorldHint: false }, ...(rest ? { rest } : {}) });
export const jobMcpTools = [
  definition('prepare_job_context', 'Start any piece of work', 'The first call for any piece of work: a page, ad, email, copy, audit, analysis, plan or code. Returns a short brief to act on, up to 4 questions to ask (each with a default) and whether one lead or a team fits. Also an annex to save: what to capture from the client’s real site or data, the rubric and gates, and the AI defaults to avoid. No model calls.', { request: text(4000), ...grounding, category: text(80) }, ['request'], '/api/v1/job-context'),
  definition('start_job', 'Name the lead for a job', 'Decides who does a job and says why. One kind of work: one lead, with the lead to load, the questions and the rubric. Mixed kinds of work, a large batch or mode team: one lead with helpers, the short team method and a state for advance_job. All work runs in the user’s AI; no server model calls or action authority.', { request: text(4000), ...grounding, job:text(120), job_reason:text(1000), mode: { enum: ['auto', 'single', 'team', 'direct'], type: 'string' }, dials: object, host_capabilities: host, host_profile: { enum: ['parallel', 'sequential', 'pack'], type: 'string' }, context_refs: { type: 'array', maxItems: 30, items: object }, preferences: object, preferences_ref: object, parent_outcome_id: text(100), from_option: text(100), option_source: object, item_id: text(120), role_id: text(120), persona_id: text(120) }, ['request'], '/api/v1/jobs'),
  definition('advance_job', 'Check the next step of a team job', 'Team jobs only. Send the latest complete state and state_digest unchanged, with one event and its document. Each step checks its record; a refusal names the field to fix. Artifacts stay local; send hashes. Every result is a host report, not proof of execution or consent.', { job_id: text(80), event: { type: 'string', enum: JOB_EVENTS }, state: object, state_digest: hash, schema: text(100), document: object, accept_proposal: { type: 'boolean' } }, ['job_id', 'event', 'state', 'state_digest', 'document'], '/api/v1/job-events'),
  definition('propose_team', 'Preview a lead and helpers', 'The roster a team job would get: one lead who owns the deliverable and the helpers it may call, matched from published roles and personas. start_job returns this for a team job. Review any unmapped catalogue gaps before accepting.', { task: text(4000), job: text(120), job_card: object, tier: { type: 'string', enum: ['quick', 'standard', 'deep'] }, host_capabilities: host }, ['task'], '/api/v1/team-proposals'),
  definition('get_approaches', 'See the distinct ways to do a job', 'Read source-backed approach families, methods, lenses and needed tools. Coverage and review gaps are reported honestly. Pass job or task.', { job: text(120), task: text(4000) }),
  definition('get_job_templates', 'Read the team method and templates', 'JOB-METHOD.md (the short team method), JOB-RECORDS.md (every record field; open it only when advance_job refuses a record) and the delivery templates.', { host_profile: { type: 'string', enum: ['parallel', 'sequential', 'pack'] }, tier: { type: 'string', enum: ['quick', 'standard', 'deep'] } }),
  definition('get_job_preferences', 'Read saved job choices or local defaults', 'On this anonymous service, return recommended choices and a local-file template. Signed-in connections use the scoped private preference record. No private data is loaded publicly.', { preferences: object }),
  definition('set_job_preferences', 'Prepare local saved job choices', 'Anonymous calls only prepare local preference files; they save nothing on the server. Signed-in connections require the selected workspace write consent. An ordinary one-off request never changes saved defaults.', { preferences: object, job: text(120), answers: object, request: text(4000) }, ['answers']),
];
export const JOB_REST_OPERATIONS = Object.fromEntries(jobMcpTools.filter(t => t.rest).map(t => [t.rest, t.name]));
export const JOB_MAX_BODY_BYTES = 256000;

/** The front door: the grounded brief, the questions for this kind of job, and who should do it (one lead or a team). */
function jobContext(input, context) {
  const { schema, brief, ...rest } = prepareJobContext(input, context.grounding ?? {}), args = rest.annex.next.team.arguments;
  const routed = routeJob({ request: input.request, deliverable_kind: input.deliverable_kind }, { approaches: context.approaches ?? {} });
  const next = routed.mode === 'outcome' ? { tool: 'start_outcome', arguments: { request: input.request }, why: 'This is a goal with no deliverable named yet.' }
    : { tool: 'start_job', arguments: args, why: routed.mode === 'team' ? 'Names the lead and helpers and opens the team record.' : 'Names the lead to load for this job.' };
  return {
    schema, brief,
    questions: intakeQuestions({ deliverableKind: rest.annex.deliverable_kind, family: rest.annex.family, request: input.request }),
    // Until the brief itself carries these questions, they take the place of any TASTE questions it lists.
    questions_note: `${INTAKE_ASK} Ask these instead of any TASTE questions in the brief.`,
    route: { mode: routed.mode, reason: routed.mode_reason, next },
    ...rest,
  };
}

export async function callJobTool(name, input = {}, context = {}) {
  const tool = jobMcpTools.find(t => t.name === name);
  if (!tool) throw new JobValidationError([{ path: 'name', message: 'Unknown job tool.' }]);
  const errors = checkSchema(tool.inputSchema, input); if (errors.length) throw new JobValidationError(errors);
  if (name === 'prepare_job_context') return jobContext(input, context);
  if (name === 'start_job') return startJob(input, context);
  if (name === 'advance_job') return advanceJob(input, context);
  if (name === 'propose_team') return proposeTeam(input, context);
  if (name === 'get_approaches') {
    if (!input.job && !input.task) throw new JobValidationError([{ path: 'job', message: 'Send job or task.' }]);
    return getApproaches(context.approaches, input, context);
  }
  if (name === 'get_job_templates') return { schema: 'ai-blocks-job-templates/1', files: [{ path: 'JOB-METHOD.md', content: jobMethod(input.host_profile, input.tier) }, { path: 'JOB-RECORDS.md', content: jobRecords(input.tier) }, ...deliveryTemplates()], schemas: Object.keys(JOB_SCHEMAS).map(id => ({ id, url: `/api/v1/schemas/${id}.json` })), model_calls: 0 };
  if (name === 'get_job_preferences') return localPreferences(input.preferences);
  const updated = updatePreferences(input.preferences, { job: input.job, answers: input.answers, request: input.request, explicit: true });
  if (!updated.ok) throw new JobValidationError(updated.errors);
  return { ...localPreferences(updated.preferences), changed: updated.changed };
}

export const getDialQuestions = input => ({ schema: 'ai-blocks-dial-questions/1', questions: dialQuestions(input), model_calls: 0 });
export const getOrgChart = context => ({ ...buildOrgChart(context), schema: 'ai-blocks-org-chart/1', model_calls: 0 });
