// One owner's job: brief, research, a composed plan and its run. The host keeps engagement.json in the owner's project
// and sends it back; this module checks each move and says what can run next. No model, storage, scheduling or external action runs here.
import { canonicalTeamJSON } from '../teams/team-contract.mjs';
import { STAGE_KINDS, fail, text, validateBrief, validatePlan, validateResearch, planMarkdown, researchMarkdown, hypothesesMarkdown } from './plan-contract.mjs';
import { METHOD, methodMarkdown } from './method.mjs';
import { nearest, checkSchema } from './schema-check.mjs';
import { buildExecutionPlan, EXECUTION_QUALITY_POLICY, supportedExecutionQualityPolicy, validateProductionQuality } from '../jobs/execution-quality.mjs';
import {validateSourceTrace} from '../jobs/source-trace.mjs';
import {preflightNativeExecution} from '../jobs/native-execution.mjs';
import {LANDING_PAGE_DELIVERY_SCHEMA} from '../jobs/landing-page-delivery.mjs';
import {VISUAL_DELIVERY_SCHEMA, validateVisualDelivery} from '../jobs/visual-delivery.mjs';
import {validateArtifactManifest} from '../jobs/artifact-manifest.mjs';
import {WORK_CONTEXT_SCHEMA,inferWorkMode,validateWorkContext} from '../jobs/work-context.mjs';

export { fail, text };
export const ENGAGEMENT_SCHEMA = 'ai-blocks-outcome-engagement/3';
export const LEGACY_ENGAGEMENT_SCHEMA = 'ai-blocks-outcome-engagement/2';
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
  keys(e, ['schema', 'id', 'request', 'started', 'phase', 'round', 'autonomy', 'brief', 'research', 'plan', 'plan_version', 'plan_check', 'plan_changes', 'data', 'stages', 'records', 'history', 'quality_policy'], 'Engagement');
  if (![ENGAGEMENT_SCHEMA, LEGACY_ENGAGEMENT_SCHEMA].includes(e.schema)) fail('Unknown engagement schema.');
  if (e.schema === ENGAGEMENT_SCHEMA && !supportedExecutionQualityPolicy(e.quality_policy)) fail('The current outcome engagement requires a complete supported execution quality policy. Start a new engagement rather than removing quality gates.');
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
    for (const s of e.stages) {
      if (!STAGE_STATES.includes(s.state)) fail(`Stage ${s.id} has an unknown state.`);
      if (['DONE', 'AWAITING_APPROVAL'].includes(s.state)) checkStageDelivery(e, plan.stages.find(def => def.id === s.id), s);
    }
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
    schema: ENGAGEMENT_SCHEMA, id: eid, request: words, started: day, phase: 'DEFINE', round: 1, autonomy: { level: 0 }, quality_policy: {...EXECUTION_QUALITY_POLICY},
    brief: null, research: null, plan: null, plan_version: 0, plan_check: null, plan_changes: null, data: [], stages: [],
    records: { decisions: [], experiments: {} }, history: [{ type: 'start', round: 1, at: day }],
  };
}

/** Select delivery requirements for the actual stage. Copy, audits and concept
 * boards remain useful intermediate outputs; they do not certify a working site.
 * The original request and accepted brief prevent a generic stage title from
 * silently downgrading a requested implementation into a screenshot.
 */
export function stageDeliveryRequirements(e, def) {
  const current = e.schema === ENGAGEMENT_SCHEMA;
  if (def.kind !== 'production') return {required: false, assurance: current ? 'HOST_REPORTED' : 'LEGACY_STRUCTURAL_ONLY'};
  const stageText = [def.name, def.goal, ...def.outputs.flatMap(o => [o.name, o.format, o.path])].join(' ');
  const request = `${e.request} ${e.brief?.deliverable ?? ''}`;
  const original = buildExecutionPlan({request});
  const own = buildExecutionPlan({request: stageText});
  const source = def.outputs.some(o => /\b(?:html|react|vue|svelte|astro|liquid|theme[ -]?files|source|website|interactive|web[ -]?app)\b/i.test(o.format) || /\.(?:html?|jsx?|tsx?|vue|svelte|astro|liquid)$/i.test(o.path));
  const intermediate = /\b(?:copy|copywriting|audit|review|brief|concepts?|wireframes?|moodboards?|design[ -]directions?)\b/i.test(`${def.name} ${def.goal}`) && !source && !/\b(?:implement|launchable|functional|working|deployable|build|code)\b/i.test(`${def.name} ${def.goal}`);
  const requested = !intermediate && (own.landing_pages.requested || (original.landing_pages.requested && source));
  const mode = original.landing_pages.requested ? original.landing_pages.delivery_mode : own.landing_pages.delivery_mode;
  const adContext=/\b(?:ads?|creatives?|advertising)\b/i.test(`${request} ${stageText}`);
  const raster=def.outputs.some(o=>/\b(?:png|jpe?g|webp|avif|image)\b/i.test(o.format)||/\.(?:png|jpe?g|webp|avif)$/i.test(o.path));
  const renderedAds=/\b(?:image[ -]?ads?|static[ -]?(?:ads?|creatives?)|ad[ -]?(?:images?|creatives?)|render(?:ed|ing)?)\b/i.test(stageText);
  const requestedImageOutput=/\b(?:image[ -]?ads?|static[ -]?(?:ads?|creatives?)|ad[ -]?(?:images?|creatives?))\b/i.test(request);
  const unspecifiedImageStage=requestedImageOutput&&!own.landing_pages.requested&&!source;
  const purpose=`${def.name} ${def.goal}`;
  const explicitRendering=/\b(?:render|photograph|photoshoot|generate\s+(?:the\s+)?images?|final[ -]images?|finished[ -]images?)\b/i.test(purpose);
  const imageIntermediate=(/\b(?:copy|copywriting|scripts?|briefs?|concepts?|moodboards?|storyboards?|plans?|planning)\b/i.test(purpose)&&!explicitRendering)||(/\b(?:audit|review)\b/i.test(purpose)&&!explicitRendering&&!/\b(?:create|produce|make|build|generate)\b/i.test(purpose));
  const imageRequired=current&&!imageIntermediate&&adContext&&(raster||renderedAds||unspecifiedImageStage);
  const workMode=inferWorkMode(request), ownMode=inferWorkMode(purpose);
  const planningOnly=/\b(?:concepts?|moodboards?|wireframes?|design[ -]directions?|briefs?|planning)\b/i.test(purpose)&&ownMode==='CREATE';
  const supportingCopy=/\b(?:copy|copywriting|scripts?)\b/i.test(purpose)&&ownMode==='CREATE'&&!/\b(?:copy|copywriting|scripts?)\b/i.test(request);
  const workRequired=current&&workMode!=='CREATE'&&!planningOnly&&!supportingCopy;
  return {required: current && requested && mode === 'LAUNCHABLE_SITE', image_required:imageRequired, work_context_required:workRequired, work_mode:workMode, delivery_mode: requested ? mode : 'NONE', existing_site_required:original.landing_pages.existing_site_required, assurance: current ? 'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED' : 'LEGACY_STRUCTURAL_ONLY'};
}

function checkStageDelivery(e, def, record) {
  const requirement = stageDeliveryRequirements(e, def);
  if(record.source_trace||e.quality_policy?.source_trace&&def.uses.length){
    const result=validateSourceTrace(record.source_trace,{methods:def.uses,artifacts:record.production_artifacts??record.outputs,production:true,required:e.quality_policy?.source_trace===true&&def.uses.length>0});
    if(!result.ok)fail(`Stage ${def.id} source trace: ${result.errors.map(error=>`${error.path}: ${error.message}`).join('; ')}`);
  }
  if(e.schema===ENGAGEMENT_SCHEMA&&(requirement.work_context_required||record.work_context!==undefined)){
    const issues=checkSchema(WORK_CONTEXT_SCHEMA,record.work_context);
    if(issues.length)fail(`Stage ${def.id} work_context: ${issues.map(error=>`${error.path}: ${error.message}`).join('; ')}`);
    const work=validateWorkContext(record.work_context,{request:e.request,required:requirement.work_context_required===true,production:true,artifacts:record.production_artifacts,acceptance:(e.brief?.done??[]).map((criterion,index)=>({id:'done-'+index,criterion}))});
    if(!work.ok)fail(`Stage ${def.id} current-work comparison: ${work.errors.map(error=>`${error.path}: ${error.message}`).join('; ')}`);
  }
  const counted=e.schema===ENGAGEMENT_SCHEMA&&def.outputs.some(output=>output.count!==undefined);
  if (!requirement.required && !requirement.image_required && !requirement.work_context_required && !counted && record.production_artifacts===undefined) return requirement;
  const artifacts = record.production_artifacts;
  if (!Array.isArray(artifacts) || !artifacts.length) fail(`Stage ${def.id} requires production_artifacts linked to the actual output hashes and current inspection receipts. A path or PASS assertion does not establish completed production.`);
  for (const artifact of artifacts) {
    object(artifact, 'Production artifact'); keys(artifact, ['slot_id', 'path', 'sha256', 'modality', 'kind','output_id','container_sha256'], 'Production artifact');
  }
  const manifest=validateArtifactManifest(artifacts,{outputs:record.outputs,specs:def.outputs});
  if(!manifest.ok)fail(`Stage ${def.id} artifact manifest: ${manifest.errors.map(error=>`${error.path}: ${error.message}`).join('; ')}`);
  const expectedSource = def.outputs.filter(o => /\b(?:html|react|vue|svelte|astro|liquid|theme[ -]?files|source|website|interactive|web[ -]?app|png|jpe?g|webp|avif|image)\b/i.test(o.format) || /\.(?:html?|jsx?|tsx?|vue|svelte|astro|liquid|png|jpe?g|webp|avif)$/i.test(o.path));
  if (expectedSource.some(o => !manifest.coverage[o.id])) fail(`Stage ${def.id} needs readiness evidence for every declared page source output.`);
  if(requirement.image_required){
    const schemaIssues=checkSchema(VISUAL_DELIVERY_SCHEMA,record.visual_delivery);
    if(schemaIssues.length)fail(`Stage ${def.id} visual_delivery: ${schemaIssues.map(error=>`${error.path}: ${error.message}`).join('; ')}`);
    const images=artifacts.filter(artifact=>artifact.modality==='image');
    if(!images.length)fail(`Stage ${def.id} must include the requested static image artifacts.`);
    const result=validateVisualDelivery(record.visual_delivery,{artifacts:images,request:e.request});
    if(!result.ok)fail(`Stage ${def.id} image inspection failed: ${result.errors.map(error=>`${error.path}: ${error.message}`).join('; ')}`);
  }
  if (!requirement.required) return requirement;
  const schemaIssues=checkSchema(LANDING_PAGE_DELIVERY_SCHEMA,record.landing_page_delivery);
  if(schemaIssues.length)fail(`Stage ${def.id} landing_page_delivery: ${schemaIssues.map(error=>`${error.path}: ${error.message}`).join('; ')}`);
  const result = validateProductionQuality({
    document: {artifacts: artifacts.filter(a=>a.modality==='interactive').map(a => ({...a, kind: a.kind ?? 'landing-page'})), landing_page_delivery: record.landing_page_delivery},
    plan: {landing_pages: {requested: true, delivery_mode: 'LAUNCHABLE_SITE',existing_site_required:requirement.existing_site_required}},
  });
  if (!result.ok) fail(`Stage ${def.id} is not launchable: ${result.errors.map(error => `${error.path}: ${error.message}`).join('; ')}`);
  return requirement;
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
  data: ['data_id', 'status', 'note'], start: ['stage_id','native_tools'], complete: ['stage_id', 'outputs', 'checks', 'summary', 'production_artifacts', 'landing_page_delivery', 'visual_delivery','work_context','source_trace','native_tools'], approve: ['stage_id', 'decision', 'by', 'note'],
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
    case 'start': {
      const [s,def] = stage(); need(s, ['READY'], 'start');
      if(e.quality_policy?.version>=2&&def.kind==='production'){
        const requirement=stageDeliveryRequirements(e,def);
        const preflight=preflightNativeExecution({plan:{landing_pages:{requested:requirement.required,delivery_mode:requirement.delivery_mode},images:{required:requirement.image_required}},tools:event.native_tools??[]});
        if(preflight.status==='BLOCKED')fail(`Stage ${s.id} native preflight: ${preflight.errors.map(error=>error.message).join('; ')}`);
        s.native_tools=clone(event.native_tools??[]);s.native_preflight=preflight;
      }
      s.state = 'IN_PROGRESS'; break;
    }
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
      if(e.quality_policy?.version>=2&&def.kind==='production'){
        const requirement=stageDeliveryRequirements(e,def);
        const preflight=preflightNativeExecution({plan:{landing_pages:{requested:requirement.required,delivery_mode:requirement.delivery_mode},images:{required:requirement.image_required}},tools:event.native_tools??s.native_tools??[]});
        if(preflight.status==='BLOCKED')fail(`Stage ${s.id} native preflight: ${preflight.errors.map(error=>error.message).join('; ')}`);
        s.native_tools=clone(event.native_tools??s.native_tools??[]);s.native_preflight=preflight;
      }
      checkStageDelivery(e, def, {outputs, production_artifacts: event.production_artifacts, landing_page_delivery: event.landing_page_delivery,visual_delivery:event.visual_delivery,work_context:event.work_context,source_trace:event.source_trace});
      s.outputs = outputs; s.checks = checks; note = optionalText(event.summary, 'Summary', 2000);
      if (event.production_artifacts !== undefined) s.production_artifacts = clone(event.production_artifacts);
      if (event.landing_page_delivery !== undefined) s.landing_page_delivery = clone(event.landing_page_delivery);
      if (event.visual_delivery !== undefined) s.visual_delivery = clone(event.visual_delivery);
      if (event.work_context !== undefined) s.work_context = clone(event.work_context);
      if (event.source_trace !== undefined) s.source_trace = clone(event.source_trace);
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
  const teamStage = ['production','decision'].includes(def.kind);
  const deliveryRequirements = stageDeliveryRequirements(e, def);
  const handoffRequest = def.goal + (deliveryRequirements.required ? '\nRequired delivery: launchable landing-page source integrated with the existing website. A design image does not meet the job.' : '');
  const jobHandoff = teamStage ? { tool:'start_job', args:{request:handoffRequest,mode:'team',parent_outcome_id:e.id,context_refs:[{id:'outcome-brief',kind:'files',ref:'BRIEF.md'},...inputs.map((ref,index)=>({id:'stage-input-'+index,kind:'files',ref}))]}, decision_record_tool:'record_outcome_decision' } : null;
  const prompt = [
    `You are ${who} on outcome engagement ${e.id} (plan v${e.plan_version}, round ${e.round}).`,
    `Goal: ${def.goal}`,
    steps.length ? `This carries out the expert steps: ${steps.map(x => `${x.name} (${x.why})`).join('; ')}. RESEARCH.md has the sources.` : '',
    `Read first: BRIEF.md${inputs.length ? `, ${inputs.join(', ')}` : ''}.`, load,
    def.uses.length ? `Retrieve these items before using them, with get_item: ${def.uses.join(', ')}. Use only what this stage needs.` : '',
    e.quality_policy?.source_trace&&def.uses.length?'Before completion include source_trace (ai-blocks-source-trace/1): selected full AI Blocks instruction/supporting-resource byte hashes, revisions, complete retrieval receipts and why each method fits; separate INSPECTED context from INFERRED/MISSING, and selected/read methods from actual EXECUTED work with current output hashes. The live API checks these against the catalogue inventory; a summary or all_read flag is insufficient.':'',
    e.quality_policy?.version>=2&&def.kind==='production'?'Before starting native production, pass native_tools with actual callable tool IDs, capabilities, available:true, billing:LOCAL|INCLUDED|PAID, checked_at within one hour and availability_receipt. The platform permits no paid tool by default. Refresh these reports at completion if they expire. Missing capabilities block this branch; a renderer name or skill is not an executor.':'',
    data.length ? `Data: ${data.map(d => `${d.name} (${d.status})`).join('; ')}.` : '', ...(s.limits ?? []).map(l => `Limit: ${l}`),
    caps.length ? `Access: ${caps.map(c => `${c.name} (${c.access} via ${c.via}${c.access === 'live' ? '; only with the owner\'s approval of each action' : ''}${c.via === 'api_key' ? '; ask the owner for the key now, keep it in the environment or secret store, never in files' : ''})`).join('; ')}.` : '',
    def.kind === 'diagnosis' ? 'Test every hypothesis in hypotheses.md and add any the data suggests.' : '',
    teamStage ? 'Run this stage through start_job with '+JSON.stringify(jobHandoff.args)+'. Follow the full team protocol: the general coordinator selects a task lead and flexible experts, validates real variety, runs the council and independent review, and returns the delivery decision record. Map considered routes, the choice, rationale, dissent and alternatives into record_outcome_decision. The council offers decision support; the owner still chooses at this stage’s existing approval gate. Team mode grants no new live-action authority.' : '',
    s.changes ? `The owner asked for changes: ${s.changes}` : '',
    `Write: ${def.outputs.map(o => `${o.path} (${o.name})`).join('; ')}.`,
    deliveryRequirements.required ? 'Launch readiness: inspect and reuse the existing site, deliver editable source, and test the real primary action, links/assets, phone and desktop layouts, keyboard access and brand content. Include production_artifacts with output IDs, paths, current SHA-256 and modality interactive, plus landing_page_delivery with current-source receipts. A PNG or a high review score cannot replace these checks. This is a host-reported readiness record, not server verification or deployment authority.' : '',
    deliveryRequirements.image_required ? 'Image delivery: include production_artifacts matching the rendered image output IDs, paths and SHA-256 values, and visual_delivery with renderer receipt, reviewer_id separate from every maker_id, source references and current-hash checks for brand, product_fidelity, claims_copy and format. For a varied batch, compare every image to another real image and record substantive observed differences. All review statements remain host reports, not proof of user acceptance.' : '',
    deliveryRequirements.work_context_required ? 'Existing-work delivery: read the authoritative current baseline and supply work_context (GET /api/v1/schemas/ai-blocks-work-context/1.json), with dated source hashes and freshness basis, preservation rules, and source-backed changes OR explicit retention with changes:[] for reviewed unchanged current native artifacts. Retention needs request-review evidence, CURRENT baseline-to-artifact mappings with identical hashes, the exact complete actual artifact path/hash set and PASS observations covering these actual accepted criteria: '+JSON.stringify((e.brief?.done??[]).map((criterion,index)=>({id:'done-'+index,criterion})))+'. Supply observed comparison.results covering every current production_artifact hash in either case. Unmet requested edits, failed/unrun required checks, unknown or stale baselines, planned checks and a high score cannot establish a passing improvement or retention. Keep unmeasured outcomes explicit. This remains host-reported evidence, not independent verification or owner approval.' : '',
    `Check before reporting: ${def.checks.map(c => `${c.id}: ${c.name}${c.required ? '' : ' (optional)'}`).join('; ')}.`,
    def.reviewers.length ? `Then have ${def.reviewers.map(r => `"${r}"`).join(', ')} review the actual output against accepted criteria (prepare_specialist). Make evidence-backed targeted repairs for material findings and rerun affected checks; no material issue found is a valid review outcome, not a reason to rewrite passing work.` : '',
    `Owner-reported numbers stay reports until checked. Don't invent data, results or approvals. When done, call advance_outcome with {"type":"complete","stage_id":"${def.id}","outputs":[...],"checks":[...]}.`,
  ].filter(Boolean).join('\n');
  return { stage_id: def.id, kind: def.kind, name: def.name, state: s.state, owner: def.owner, support: def.support, reviewers: def.reviewers, uses: def.uses, inputs, data, capabilities: caps, outputs: def.outputs, checks: def.checks, delivery_requirements: deliveryRequirements, gate: gateFor(def, e), ...(jobHandoff ? {job_handoff:jobHandoff} : {}), ...(def.optional_when ? { optional_when: def.optional_when } : {}), ...(s.limits ? { limits: s.limits } : {}), prompt };
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
  const fullExecutionPlan = buildExecutionPlan({ request: e.request, card: e.brief ? { job_to_be_done: e.brief.outcome, acceptance: (e.brief.done ?? []).map((criterion, index) => ({ id: 'done-' + index, criterion, threshold: 'Must pass', critical: true })) } : undefined });
  const files = { 'engagement.json': JSON.stringify(e, null, 2) + '\n', 'ENGAGEMENT.md': statusMarkdown(e), ...(e.brief ? { 'BRIEF.md': briefMarkdown(e) } : {}) };
  if (initial) Object.assign(files, { 'METHOD.md': methodMarkdown(), 'decisions.jsonl': '', 'experiments.jsonl': '', 'LEARNINGS.md': '# Learnings\n\nOne line per learning: date, scope (engagement, business or platform), the rule, and the decision or experiment it came from.\n' });
  const execution_plan = { schema: fullExecutionPlan.schema, task_type: fullExecutionPlan.task_type, landing_pages: {requested:fullExecutionPlan.landing_pages.requested, delivery_mode:fullExecutionPlan.landing_pages.delivery_mode, existing_site_required:fullExecutionPlan.landing_pages.existing_site_required}, scope_required: !e.brief, file: 'EXECUTION-PLAN.json' };
  // Progressive disclosure: the full role/context contract travels once scope is known.
  files['EXECUTION-PLAN.json'] = JSON.stringify(e.brief ? fullExecutionPlan : execution_plan, null, 2) + '\n';
  const base = { schema: 'ai-blocks-outcome-step/1', folder: `outcomes/${e.id}/`, execution_plan, engagement: e, engagement_sha256: await engagementDigest(e), review: { host_reported: true, independently_verified: false, grants_execution_authority: false, quality_assurance: e.schema === ENGAGEMENT_SCHEMA ? 'HOST_REPORTED_QUALITY_GATES' : 'LEGACY_STRUCTURAL_ONLY' } };
  // The method travels once, as files["METHOD.md"], which the host saves and rereads at each phase.
  if (e.phase === 'DEFINE') return { ...base, state: 'NEEDS_BRIEF', method_version: METHOD.version, next: `Ask the owner one batch of questions covering the brief frame${initial ? ' in files["METHOD.md"]' : ' in METHOD.md'} (skip what the conversation, memory or brand files already answer), then call advance_outcome with {"type":"brief","brief":{...}}.`, files };
  if (e.phase === 'RESEARCH') return { ...base, state: 'NEEDS_PLAN', next: `${e.plan_changes ? `The owner asked for changes to plan v${e.plan_version}: ${e.plan_changes}. ` : ''}Research relevant facts and constraints, choose task methods from the AI Blocks catalogue, write RESEARCH.md, and compose the plan from our catalogue, then call advance_outcome with {"type":"plan","research":{...},"plan":{...}}. METHOD.md has the rules.`, research_protocol: METHOD.research_protocol, composition_rules: METHOD.composition_rules, files };
  Object.assign(files, { 'PLAN.md': planMarkdown(e.brief, e.research, p, { version: e.plan_version, warnings: e.plan_check.warnings }), 'RESEARCH.md': researchMarkdown(e.research), 'hypotheses.md': hypothesesMarkdown(p), 'DATA-REQUESTS.md': dataRequestsMarkdown(e) });
  const warnings = [...e.plan_check.warnings, ...(e.plan_check.catalogue_checked ? [] : ['Specialists and items were not checked against the live catalogue on this call.'])];
  if(e.quality_policy&&e.quality_policy.version<EXECUTION_QUALITY_POLICY.version)warnings.push('This legacy policy predates source-use traces and native tool preflight. Start a new engagement for those gates.');
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
