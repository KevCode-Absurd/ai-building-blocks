import { startJob, advanceJob, JobValidationError, JOB_EVENTS } from './engine.mjs';
import { proposeTeam, getApproaches, buildOrgChart } from './propose-team.mjs';
import { localPreferences, updatePreferences } from './dials.mjs';
import { dialQuestions } from './dial-questions.mjs';
import { jobMethod, deliveryTemplates } from './method.mjs';
import { JOB_SCHEMAS } from './contracts.mjs';
import { checkSchema } from '../outcomes/schema-check.mjs';

const text = maxLength => ({ type: 'string', minLength: 1, maxLength });
const object = { type: 'object' }, hash = { type: 'string', pattern: '^[a-f0-9]{64}$' };
const host = { type: 'object', properties: { parallel_agents: { type: 'boolean' }, max_parallel: { type: 'integer', minimum: 1, maximum: 100 }, models: { type: 'array', maxItems: 20, items: text(100) }, tools: { type: 'array', maxItems: 50, items: text(100) }, visual_renderers: { type: 'array', maxItems: 20, items: text(100) },native_tools:{type:'array',maxItems:30,items:object},allow_paid_native:{type:'boolean'}, connectors: { type: 'array', maxItems: 50, items: text(100) }, budget: { type: 'string', enum: ['small', 'normal', 'large'] } }, additionalProperties: false };
const definition = (name, title, description, properties, required = [], rest) => ({ name, title, description, inputSchema: { type: 'object', properties, required, additionalProperties: false }, outputSchema: { type: 'object', properties: { schema: { type: 'string' } }, required: ['schema'], additionalProperties: true }, annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: name !== 'start_job', openWorldHint: false }, ...(rest ? { rest } : {}) });
export const jobMcpTools = [
  definition('start_job', 'Scope a job and staff a flexible team', 'Dark-launch team protocol: define the real job and rubric, then assign a task lead and experts. Returns the tier estimate, host method, questions and local state. All thinking and work run in the user’s AI; no server model calls or action authority.', { request: text(4000), job:text(120), job_reason:text(1000), mode: { enum: ['auto', 'team', 'direct'], type: 'string' }, dials: object, host_capabilities: host, host_profile: { enum: ['parallel', 'sequential', 'pack'], type: 'string' }, context_refs: { type: 'array', maxItems: 30, items: object }, preferences: object, preferences_ref: object, parent_outcome_id: text(100), from_option: text(100), option_source: object, item_id: text(120), role_id: text(120), persona_id: text(120) }, ['request'], '/api/v1/jobs'),
  definition('advance_job', 'Validate the next job event', 'Send unchanged latest state and state_digest. Validates phase evidence, alternatives and review. Artifacts stay local. refresh_capabilities updates actual tool availability. Reports do not prove execution or consent.', { job_id: text(80), event: { type: 'string', enum: JOB_EVENTS }, state: object, state_digest: hash, schema: text(100), document: object, accept_proposal: { type: 'boolean' } }, ['job_id', 'event', 'state', 'state_digest', 'document'], '/api/v1/job-events'),
  definition('propose_team', 'Propose experts and a task lead', 'Match published roles, palettes and personas to this task. The general coordinator chooses its lead. Review catalogue gaps before accepting; no work runs here.', { task: text(4000), job: text(120), job_card: object, tier: { type: 'string', enum: ['quick', 'standard', 'deep'] }, host_capabilities: host }, ['task'], '/api/v1/team-proposals'),
  definition('get_approaches', 'See the distinct ways to do a job', 'Read source-backed approach families, methods, lenses and needed tools. Coverage and review gaps are reported honestly. Pass job or task.', { job: text(120), task: text(4000) }),
  definition('get_job_templates', 'Read the job method and delivery templates', 'Read the host-specific protocol and the files needed for delivery. Contains decisions and evidence, never private chain-of-thought.', { host_profile: { type: 'string', enum: ['parallel', 'sequential', 'pack'] }, tier: { type: 'string', enum: ['quick', 'standard', 'deep'] } }),
  definition('get_job_preferences', 'Read saved job choices or local defaults', 'On this anonymous service, return recommended choices and a local-file template. Signed-in connections use the scoped private preference record. No private data is loaded publicly.', { preferences: object }),
  definition('set_job_preferences', 'Prepare local saved job choices', 'Anonymous calls only prepare local preference files; they save nothing on the server. Signed-in connections require the selected workspace write consent. An ordinary one-off request never changes saved defaults.', { preferences: object, job: text(120), answers: object, request: text(4000) }, ['answers']),
];
export const JOB_REST_OPERATIONS = Object.fromEntries(jobMcpTools.filter(t => t.rest).map(t => [t.rest, t.name]));
export const JOB_MAX_BODY_BYTES = 256000;

export async function callJobTool(name, input = {}, context = {}) {
  const tool = jobMcpTools.find(t => t.name === name);
  if (!tool) throw new JobValidationError([{ path: 'name', message: 'Unknown job tool.' }]);
  const errors = checkSchema(tool.inputSchema, input); if (errors.length) throw new JobValidationError(errors);
  if (name === 'start_job') return startJob(input, context);
  if (name === 'advance_job') return advanceJob(input, context);
  if (name === 'propose_team') return proposeTeam(input, context);
  if (name === 'get_approaches') {
    if (!input.job && !input.task) throw new JobValidationError([{ path: 'job', message: 'Send job or task.' }]);
    return getApproaches(context.approaches, input, context);
  }
  if (name === 'get_job_templates') return { schema: 'ai-blocks-job-templates/1', files: [{ path: 'JOB-METHOD.md', content: jobMethod(input.host_profile, input.tier) }, ...deliveryTemplates()], schemas: Object.keys(JOB_SCHEMAS).map(id => ({ id, url: `/api/v1/schemas/${id}.json` })), model_calls: 0 };
  if (name === 'get_job_preferences') return localPreferences(input.preferences);
  const updated = updatePreferences(input.preferences, { job: input.job, answers: input.answers, request: input.request, explicit: true });
  if (!updated.ok) throw new JobValidationError(updated.errors);
  return { ...localPreferences(updated.preferences), changed: updated.changed };
}

export const getDialQuestions = input => ({ schema: 'ai-blocks-dial-questions/1', questions: dialQuestions(input), model_calls: 0 });
export const getOrgChart = context => ({ ...buildOrgChart(context), schema: 'ai-blocks-org-chart/1', model_calls: 0 });
