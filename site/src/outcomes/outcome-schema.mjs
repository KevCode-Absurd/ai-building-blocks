// Input JSON Schemas for the outcome tools, built from the same field lists and value sets the validators use
// (plan-contract.mjs, engagement.mjs), so a host sees the exact shape before it calls. A field the validators accept
// without a type here is a build error, which keeps the two in step.
import { ACCESS, BASELINE_SOURCES, CONNECTION_STATUSES, DIRECTIONS, FIELDS, GATES, ROUTES, SOURCE_KINDS, STAGE_KINDS, VIA } from './plan-contract.mjs';
import { EVENT_FIELDS } from './engagement.mjs';
import {VISUAL_DELIVERY_SCHEMA} from '../jobs/visual-delivery.mjs';
import {WORK_CONTEXT_SCHEMA} from '../jobs/work-context.mjs';
import {SOURCE_TRACE_SCHEMA} from '../jobs/source-trace.mjs';

// Empty text is refused by the validators with a plain message, so strings carry only their length limit here.
const str = (maxLength = 2000) => ({ type: 'string', maxLength });
const id = { type: 'string', pattern: '^[a-z0-9][a-z0-9-]{0,79}$' };
const slug = { type: 'string', pattern: '^[a-z0-9][a-z0-9-]{0,119}$' };
const date = { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' };
const list = (items, maxItems, minItems) => ({ type: 'array', items, ...(maxItems ? { maxItems } : {}), ...(minItems ? { minItems } : {}) });
const texts = (maxItems, len) => list(str(len), maxItems);
const ids = maxItems => list(id, maxItems);
const one = values => ({ type: 'string', enum: values });

/** An object schema over exactly the validator's field list. types names every field; required lists the must-haves. */
function shape(name, types, required = [], extra = {}) {
  const fields = FIELDS[name] ?? name;
  const missing = fields.filter(f => !types[f]);
  const unknown = Object.keys(types).filter(f => !fields.includes(f));
  if (missing.length || unknown.length) throw Error(`Outcome schema ${name} is out of step with its validator: ${[...missing, ...unknown].join(', ')}.`);
  // The validators treat null like a missing optional field, so the schema allows it too.
  const optional = s => required.includes(s) ? types[s] : { ...types[s], type: [...new Set([types[s].type, 'null'].flat())] };
  return { type: 'object', ...extra, properties: Object.fromEntries(fields.map(f => [f, optional(f)])), required, additionalProperties: false };
}

export const BRIEF_SCHEMA = shape('brief', {
  outcome: str(1000),
  ambition: shape('ambition', { goal_beyond: str(500), rungs: list(str(500), 3, 3), chosen: { type: 'integer', minimum: 1, maximum: 3 }, judge: str(500) }, ['goal_beyond', 'rungs', 'chosen', 'judge']),
  deliverable: str(600), done: list(str(500), 20, 1),
  metric: shape('metric', { name: str(200), direction: one(DIRECTIONS), unit: str(60), baseline: { type: 'number' }, baseline_source: one(BASELINE_SOURCES), target: { type: 'number' } }, ['name', 'direction', 'unit', 'baseline_source']),
  deadline: str(200), guardrails: texts(15, 500), limits: texts(20, 500), assets: texts(30, 500),
  connections: list(shape('connection', { name: str(200), access: one(ACCESS), status: one(CONNECTION_STATUSES) }, ['name', 'access', 'status']), 30),
  data_home: str(300), technical_level: str(300), decides: str(300), unknowns: texts(20, 500),
  answers: list(shape('answer', { question: str(500), answer: str(2000) }, ['question', 'answer']), 40),
}, ['outcome', 'deliverable', 'done', 'data_home', 'decides']);

export const RESEARCH_SCHEMA = shape('research', {
  approach: str(3000),
  sources: list(shape('source', { id, kind: one(SOURCE_KINDS), title: str(300), ref: str(600), date: { type: 'string', pattern: '^\\d{4}-\\d{2}(-\\d{2})?$' }, note: str(500) }, ['id', 'kind', 'title', 'ref'], { description: 'web: full https link and date; catalogue: an item id; memory or owner: where it came from.' }), 40, 2),
  steps: list(shape('step', { id, name: str(200), why: str(800), sources: list(id, 10, 1) }, ['id', 'name', 'why', 'sources']), 30, 1),
  pitfalls: list(shape('pitfall', { text: str(500), sources: list(id, 10, 1) }, ['text', 'sources']), 20),
}, ['approach', 'sources', 'steps']);

const owner = { ...shape('owner', { role: id, gap: str(500) }), description: 'One of: role (a find_specialist id) or gap (the expert you needed when none fits).' };
export const PLAN_SCHEMA = shape('plan', {
  name: str(160),
  capabilities: list(shape('capability', { id, access: one(ACCESS), via: one(VIA), name: str(200), why: str(500) }, ['id', 'access', 'via', 'name', 'why']), 25),
  data: list(shape('data', { id, name: str(200), why: str(600), fields: texts(30, 200), routes: list(shape('route', { kind: one(ROUTES), how: str(600) }, ['kind', 'how']), 6, 1), required_for: ids(40), alternative: str(600) }, ['id', 'name', 'why', 'routes']), 20),
  stages: list(shape('stage', {
    id, kind: one(STAGE_KINDS), name: str(120), goal: str(1500), from_steps: ids(10), owner, support: ids(8), reviewers: ids(6), uses: list(slug, 20),
    data: ids(40), needs: ids(40), depends_on: ids(40),
    outputs: list(shape('output', { id, name: str(250), format: str(40), path: str(200),count:{type:'integer',minimum:1,maximum:1000} }, ['id', 'name', 'format', 'path']), 12),
    checks: list(shape('check', { id, name: str(500), required: { type: 'boolean' } }, ['id', 'name']), 12),
    gate: one(GATES), optional_when: str(500),
  }, ['id', 'kind', 'name', 'goal', 'owner', 'gate']), 30, 1),
  hypotheses: list(shape('hypothesis', { id, statement: str(400), test: str(800), confirm_if: str(500), refute_if: str(500), fix_stage: id }, FIELDS.hypothesis), 30),
  dropped: list(shape('dropped', { step: id, reason: str(500) }, ['step', 'reason']), 30),
  measurement: (shape('measurement', { window: str(300), min_volume: str(300), stop_rule: str(500) }, ['window', 'min_volume', 'stop_rule'])),
}, ['name', 'stages']);

// Every event's fields, typed. A plan event during the run is a revision.
const decision = one(['APPROVED', 'CHANGES_REQUESTED']);
const by = { type: 'string', description: '"owner", only after the owner actually said so.' };
// Full capability fields are described in each ready production prompt and
// enforced by the shared preflight; avoid repeating their schema in tools/list.
const nativeTools={type:'array',maxItems:30,items:{type:'object'}};
const EVENT_TYPES = {
  brief: { brief: BRIEF_SCHEMA }, plan: { research: RESEARCH_SCHEMA, plan: PLAN_SCHEMA },
  approve_plan: { decision, by, note: str(2000) },
  data: { data_id: id, status: one(['AVAILABLE', 'MISSING']), note: str(1000) },
  start: { stage_id: id,native_tools:nativeTools },
  complete: {
    source_trace:{type:'object',description:'Read GET /api/v1/schemas/ai-blocks-source-trace/1.json. Selected methods need complete pinned source reads and separate execution receipts.'},
    native_tools:nativeTools,
    stage_id: id, outputs: list({ type: 'object', properties: { id, path: str(240), sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' } }, required: ['id'], additionalProperties: false }),
    checks: list({ type: 'object', properties: { id, result: one(['PASS', 'FAIL', 'NOT_RUN']), note: str(1000) }, required: ['id', 'result'], additionalProperties: false }), summary: str(2000),
    production_artifacts: list({type:'object', properties:{slot_id:id,path:str(240),sha256:{type:'string',pattern:'^[a-f0-9]{64}$'},modality:one(['interactive','image','text','doc','data']),kind:str(120),output_id:id,container_sha256:{type:'string',pattern:'^[a-f0-9]{64}$'}},required:['slot_id','path','sha256','modality'],additionalProperties:false},1000),
    // Full nested report schemas are served separately and checked by the stage
    // validator. Keep the front-door tool list small enough for discovery.
    landing_page_delivery:{type:'object',description:'Current-source page report. Full schema: GET /api/v1/schemas/ai-blocks-landing-page-delivery/1.json. Read it before completion.',properties:{schema:{const:'ai-blocks-landing-page-delivery/1'},mode:one(['LAUNCHABLE_SITE','DESIGN_REFERENCE']),artifacts:list({type:'object'},1000)},required:['schema','mode','artifacts'],additionalProperties:false},
    visual_delivery:{type:'object',description:'Static-ad report. Full schema: GET /api/v1/schemas/ai-blocks-visual-delivery/1.json. Read it before completion. Current image hashes, renderer receipt, independent reviewer and brand/product/claim/format inspection are required.',properties:Object.fromEntries(Object.entries(VISUAL_DELIVERY_SCHEMA.properties).map(([key,value])=>[key,key==='items'?{type:'array',minItems:1,maxItems:1000,items:{type:'object'}}:value])),required:VISUAL_DELIVERY_SCHEMA.required,additionalProperties:false},
    work_context:{type:'object',description:'Existing-work context and observed comparison. Full schema: GET /api/v1/schemas/ai-blocks-work-context/1.json. Required for substantive IMPROVE or ASSESS production, with CURRENT baseline, preservation, source-backed changes and current-hash comparison.results.',properties:Object.fromEntries(Object.entries(WORK_CONTEXT_SCHEMA.properties).map(([key,value])=>[key,['sources','preserve','changes'].includes(key)?{type:'array',maxItems:value.maxItems,items:{type:'object'}}:key==='comparison'?{type:'object'}:value])),required:WORK_CONTEXT_SCHEMA.required,additionalProperties:false},
  },
  approve: { stage_id: id, decision, by, note: str(2000) },
  skip: { stage_id: id, reason: str(1000) }, block: { stage_id: id, reason: str(1000) }, reopen: { stage_id: id },
  autonomy: { level: { type: 'integer', minimum: 0, maximum: 3 }, by, note: str(1000) }, next_round: { note: str(1000) },
};
const OPTIONAL = new Set(['note', 'summary', 'at', 'production_artifacts', 'landing_page_delivery', 'visual_delivery','work_context','source_trace','native_tools']);
export const EVENT_SCHEMA = {
  description: 'One event. type picks the fields: brief, plan (research + plan), approve_plan, data, start, complete, approve, skip, block, reopen, autonomy, next_round.',
  oneOf: Object.entries(EVENT_FIELDS).map(([type, fields]) => {
    const types = EVENT_TYPES[type] ?? {};
    const missing = fields.filter(f => !types[f]);
    if (missing.length || Object.keys(types).some(f => !fields.includes(f))) throw Error(`Outcome event ${type} schema is out of step with its validator.`);
    return { type: 'object', properties: { type: { const: type }, at: date, ...types }, required: ['type', ...fields.filter(f => !OPTIONAL.has(f))], additionalProperties: false };
  }),
};
if (Object.keys(EVENT_TYPES).some(t => !EVENT_FIELDS[t])) throw Error('An outcome event schema has no validator.');

// Decisions and experiments (records.mjs), in the order the validators read them.
const rule = { type: 'object', properties: { text: str(600), scope: one(['engagement', 'business', 'platform']) }, required: ['text', 'scope'], additionalProperties: false };
export const DECISION_SCHEMA = {
  type: 'object', properties: {
    id, stage_id: id, considered: list({ type: 'object', properties: { id, summary: str(500) }, required: ['id', 'summary'], additionalProperties: false }, 30, 1),
    chosen: ids(30), rationale: str(2000), given_up: str(1000), revisit_when: str(500), rule, by, at: date,
  }, required: ['id', 'stage_id', 'considered', 'chosen', 'by'], additionalProperties: false,
  description: 'considered is best-ranked first; passing over the top option needs a rationale.',
};
export const EXPERIMENT_SCHEMA = {
  description: 'register before the change goes live; close with what was observed.',
  oneOf: [
    { type: 'object', properties: {
      action: { const: 'register' }, id, hypothesis_id: id, card_id: id, change: str(1000), metric: str(200), direction: one(['decrease', 'increase']), baseline: { type: 'number' }, target: { type: 'number' },
      window: { type: 'object', properties: { start: date, end: date }, required: ['start', 'end'], additionalProperties: false }, min_volume: { type: 'integer', minimum: 0 }, guardrails: list(str(300)), at: date,
    }, required: ['action', 'id', 'change', 'metric', 'baseline', 'window', 'min_volume', 'guardrails'], additionalProperties: false },
    { type: 'object', properties: {
      action: { const: 'close' }, id, observed: { type: 'number' }, volume: { type: 'integer', minimum: 0 },
      guardrail_results: list({ type: 'object', properties: { name: str(300), held: { type: 'boolean' }, note: str(500) }, required: ['name', 'held'], additionalProperties: false }),
      verdict: one(['WIN', 'LOSS', 'INCONCLUSIVE']), learning: str(1000), rule, at: date,
    }, required: ['action', 'id', 'observed', 'volume', 'guardrail_results', 'verdict'], additionalProperties: false },
  ],
};
