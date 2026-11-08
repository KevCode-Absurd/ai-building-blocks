// Outcome orchestrator tools for MCP and REST. Stateless: the host keeps the engagement folder, researches, composes and does the work.
import { advanceEngagement, checkEngagement, describeEngagement, engagementDigest, startEngagement } from './engagement.mjs';
import { recordDecision, recordExperiment } from './records.mjs';
import { ValidationError, checkCatalogue, collector, planRefs, planWarnings, validateBrief, validatePlan, validateResearch } from './plan-contract.mjs';
import { DECISION_SCHEMA, EVENT_SCHEMA, EXPERIMENT_SCHEMA } from './outcome-schema.mjs';
import { checkSchema, nearest } from './schema-check.mjs';
import example from './examples/rising-cpa.mjs';
import { READBACK_TOOL } from './monitoring.mjs';
import { PATTERN_TOOL } from './patterns.mjs';
import {validateSourceTrace} from '../jobs/source-trace.mjs';

const str = (maxLength = 4000) => ({ type: 'string', minLength: 1, maxLength });
const hash = { type: 'string', pattern: '^[a-f0-9]{64}$', description: 'engagement_sha256 from the last outcome tool result. A different value means the engagement changed.' };
const engagement = { type: 'object', description: 'The complete engagement.json from the last outcome tool result, unchanged.' };
const annotations = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };
const outputSchema = { type: 'object', properties: { schema: { type: 'string' } }, required: ['schema'], additionalProperties: true };

/** The outcome part of a server's instructions (the local scoping preview uses it; the public MCP has its own short text). */
export const OUTCOME_INSTRUCTIONS = 'For any outcome the owner wants (more customers, rising ad costs, launch a product, close the month, or something vague like "my business is not doing well"), call start_outcome with their own words and follow each result\'s next step. You pin the outcome down with one batch of questions, research relevant facts and constraints, select task methods from AI Blocks, compose a plan from our specialists and items, and the owner approves it before anything runs. Save the returned files in outcomes/<id>/. Decisions and live actions always stop for the owner; API keys stay with you and never go in files.';

/**
 * The outcome tools, one entry each. To add a tool, append an entry (or spread a list imported from another file):
 *   name, title, description: what the host sees in tools/list.
 *   input: { properties, required }: the input JSON Schema; every argument is checked against it before run.
 *   rest: the REST route that mirrors it (POST, JSON body = the tool arguments), if any.
 *   engagement: true when the tool takes { engagement, engagement_sha256 } and needs the current engagement checked first.
 *   run(args, { engagement, resolve, today }): the result, or throw (fail / ValidationError) to refuse.
 */
export const OUTCOME_TOOLS = [
  {
    name: 'start_outcome', title: 'Start here for any business goal', rest: '/api/v1/outcomes',
    description: 'Start any goal in the owner’s words. Returns the brief frame, METHOD.md, next step and local outcomes/<id>/ files. include_example adds a worked brief, research and plan. Execution runs in the connected AI.',
    input: { properties: {
      request: str(), engagement_id: { type: 'string', pattern: '^[a-z0-9][a-z0-9-]{0,79}$' }, started: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
      include_example: { type: 'boolean', description: 'Add the worked example (rising ad costs) to see the quality bar. Off by default; it is large.' },
    }, required: ['request'] },
    async run(a) {
      const e = startEngagement({ request: a.request, id: a.engagement_id, started: a.started });
      return { ...(await describeEngagement(e, { initial: true })), ...(a.include_example ? { example } : {}) };
    },
  },
  {
    name: 'advance_outcome', title: 'Move an outcome engagement forward', rest: '/api/v1/outcome-steps', engagement: true,
    description: 'Advance the engagement with brief, catalogue-checked plan, owner approve_plan, data, start, complete with outputs/checks/source receipts, owner approve, skip, block, reopen or next_round. plan revises the run; owner autonomy sets review level. Returns field-specific problems; executes no work.',
    input: { properties: { engagement, engagement_sha256: hash, event: EVENT_SCHEMA }, required: ['engagement', 'engagement_sha256', 'event'] },
    async run(a, { engagement: e, resolve, today }) {
      let planCheck;
      if (a.event.type === 'brief') await under('event.brief', () => validateBrief(a.event.brief));
      if (a.event.type === 'plan') {
        if (!e.brief) throw new ValidationError([{ path: 'event.type', message: 'Submit the brief before the plan.' }]);
        // Research and plan problems come back together; the plan is checked against the research, so it waits for valid research.
        const c = collector();
        const research = c.try('event.research', () => validateResearch(a.event.research));
        const plan = research && c.try('event.plan', () => validatePlan(a.event.plan, { research, brief: e.brief }));
        c.done();
        // A catalogue outage (PublicApiError) passes through unchanged; unknown ids come back as problems.
        if (resolve) { const found = await resolve(planRefs(plan, research)); await under('event', () => checkCatalogue(found, plan, research)); }
        planCheck = { catalogue_checked: Boolean(resolve), warnings: planWarnings(e.brief, research, plan, today ?? new Date().toISOString().slice(0, 10)) };
      }
      if(a.event.type==='complete'&&(a.event.source_trace||e.quality_policy?.source_trace)){
        const def=e.plan?.stages.find(stage=>stage.id===a.event.stage_id);
        if(def?.uses.length&&resolve){
          const found=await resolve({roles:[],items:def.uses,source_inventory:true});
          if(!found.source_requirements)throw new ValidationError([{path:'event.source_trace',message:'The catalogue resolver cannot verify complete pinned source inventories. Retrieve the current source requirements before claiming selected methods executed.'}]);
          const result=validateSourceTrace(a.event.source_trace,{requirements:found.source_requirements,methods:def.uses,artifacts:a.event.production_artifacts??a.event.outputs,production:true,required:true});
          if(!result.ok)throw new ValidationError(result.errors.map(error=>({path:`event.${error.path}`,message:error.message})));
        }
      }
      return describeEngagement(await under('event', () => advanceEngagement(e, a.event, { planCheck })));
    },
  },
  {
    name: 'record_outcome_decision', title: 'Record the owner\'s decision', rest: '/api/v1/outcome-decisions', engagement: true,
    description: 'Record the owner’s actual ranked options, choice and reasons for passing over the top option. Returns decisions.jsonl and any scoped learning candidate; saves nothing.',
    input: { properties: { engagement, engagement_sha256: hash, decision: DECISION_SCHEMA }, required: ['engagement', 'engagement_sha256', 'decision'] },
    run: (a, { engagement: e }) => under('decision', () => recordDecision(e, a.decision)),
  },
  {
    name: 'record_outcome_experiment', title: 'Register or close an experiment', rest: '/api/v1/outcome-experiments', engagement: true,
    description: 'Register change, metric, baseline, window, minimum volume and guardrails before launch; close with actual observations and verdict. Low volume is INCONCLUSIVE; broken guardrails cannot WIN. Returns local records and an optional share proposal.',
    input: { properties: { engagement, engagement_sha256: hash, experiment: EXPERIMENT_SCHEMA }, required: ['engagement', 'engagement_sha256', 'experiment'] },
    run: (a, { engagement: e }) => under('experiment', () => recordExperiment(e, a.experiment)),
  },
  // Scheduled read-backs (B4) and plan patterns (B5): entries live with their engines.
  ...[READBACK_TOOL, PATTERN_TOOL].map(({ path, run, ...t }) => ({ ...t, run: (a, c) => under(path, () => run(a, c)) })),
];

/** Run fn (sync or async) and report what it refuses as problems under path, so every refusal names its field. */
async function under(path, fn) {
  try { return await fn(); }
  catch (error) { const c = collector(); c.try(path, () => { throw error; }); c.done(); }
}

export const outcomeMcpTools = OUTCOME_TOOLS.map(({ name, title, description, input }) => ({
  name, title, description, inputSchema: { type: 'object', properties: input.properties, required: input.required, additionalProperties: false }, outputSchema, annotations,
}));

/** REST mirrors of the tools (POST, JSON body = tool arguments). */
export const OUTCOME_REST_OPERATIONS = Object.fromEntries(OUTCOME_TOOLS.filter(t => t.rest).map(t => [t.rest, t.name]));
// An engagement carries its brief, research and plan, so outcome calls may exceed the general request limit.
export const OUTCOME_MAX_BODY_BYTES = 256_000;

async function current(input) {
  try { checkEngagement(input.engagement); }
  catch (error) { throw new ValidationError([{ path: 'engagement', message: `${error.message} Send the engagement.json from the last outcome result, unchanged.` }]); }
  if (await engagementDigest(input.engagement) !== input.engagement_sha256) throw new ValidationError([{ path: 'engagement_sha256', message: 'This engagement changed since the last outcome result. Send the latest engagement.json and its engagement_sha256.' }]);
  return input.engagement;
}

/**
 * Call an outcome tool. Every argument problem is reported together in one ValidationError: issues with the field
 * path, what is wrong and, where it is clear, the value that was probably meant.
 * resolve, when given, checks catalogue ids: async ({roles, items}) => ({missing_roles, missing_items, suggestions?}).
 * Without it a plan is accepted on structure alone and the result says the catalogue was not checked.
 */
export async function callOutcomeTool(name, input = {}, { resolve, today } = {}) {
  const tool = OUTCOME_TOOLS.find(t => t.name === name);
  if (!tool) throw new ValidationError([{ path: '', message: `Unknown outcome tool ${name}.`, suggestion: nearest(String(name), OUTCOME_TOOLS.map(t => t.name)) }]);
  const def = outcomeMcpTools.find(t => t.name === name);
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new ValidationError([{ path: '', message: 'Send the arguments as one JSON object.' }]);
  const issues = checkSchema(def.inputSchema, input).map(i => !i.path.includes('.') && !i.path.includes('[') && /is not a field here/.test(i.message) ? { ...i, message: `is not an argument of ${name}. Arguments: ${Object.keys(def.inputSchema.properties).join(', ')}.` } : i);
  if (issues.length) throw new ValidationError(issues);
  const context = { resolve, today };
  if (tool.engagement) context.engagement = await current(input);
  return tool.run(input, context);
}

/** Catalogue resolver over the public catalogue service: one role inventory read, item lookups from the cached index, and the nearest real id for each unknown one. */
export function catalogueResolver(catalogue) {
  return async ({ roles, items, source_inventory=false }) => {
    if(source_inventory){
      const methods=[],queue=[...items],seen=new Set();
      while(queue.length){
        const slug=queue.shift();if(seen.has(slug))continue;if(seen.size>=100)throw Error('Split source closures larger than 100 methods.');seen.add(slug);
        const item=await catalogue.callTool('get_item',{id:slug,response_format:'detailed'});
        if(!item?.instruction_resource||item.resource_validation?.status!=='PASS')throw new ValidationError([{path:'event.source_trace',message:`The ${slug} complete package inventory is unavailable or has unresolved supporting files.`}]);
        const resources=[item.instruction_resource,...(item.resources??[])];
        methods.push({slug,revision_sha256:item.revision_sha256,selected:items.includes(slug),resources:[...new Map(resources.map(file=>[file.path,{path:file.path,bytes:file.bytes,sha256:file.sha256}])).values()]});
        queue.push(...(item.support_items??[]).map(child=>child.slug));
      }
      return {missing_roles:[],missing_items:[],source_requirements:{schema:'ai-blocks-source-trace-requirements/1',methods,errors:[],ok:true,assurance:'CATALOGUE_INVENTORY_NOT_EXECUTION'}};
    }
    const content = (await catalogue.readResource('aiblocks://roles')).contents[0];
    const roleIds = (JSON.parse('text' in content ? content.text : '{}').roles ?? []).map(r => r.id);
    const known = new Set(roleIds);
    const found = await Promise.all(items.map(id => catalogue.callTool('get_item', { id }).then(() => true, () => false)));
    const missing_roles = roles.filter(r => !known.has(r)), missing_items = items.filter((_, i) => !found[i]);
    const suggestions = {};
    for (const r of missing_roles) { const s = nearest(r, roleIds); if (s) suggestions[r] = s; }
    await Promise.all(missing_items.map(async id => {
      const rows = await catalogue.callTool('search_library', { query: id.replace(/-/g, ' ').slice(0, 300), limit: 5 }).then(r => r?.items ?? [], () => []);
      const s = nearest(id, rows.map(r => r.id)) ?? rows[0]?.id;
      if (s) suggestions[id] = s;
    }));
    return { missing_roles, missing_items, suggestions };
  };
}
