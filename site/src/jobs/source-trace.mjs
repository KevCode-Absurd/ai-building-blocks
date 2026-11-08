// A bounded, portable host report. Matching catalogue hashes proves correspondence,
// not that a model understood a source or a tool actually executed a method.
import {checkSchema} from '../outcomes/schema-check.mjs';
const list = value => Array.isArray(value) ? value : [];
const text = value => typeof value === 'string' && value.trim().length > 0;
const hash = value => /^[a-f0-9]{64}$/.test(value ?? '');
const path = value => text(value) && value.length <= 240 && !/^(?:[a-z]:|[\\/])|[\\\0?#%]|(?:^|\/)\.{1,2}(?:\/|$)/i.test(value);
const receipt = value => path(value?.path) && hash(value?.sha256);
export const SOURCE_TRACE_SCHEMA_ID = 'ai-blocks-source-trace/1';
const str=maxLength=>({type:'string',minLength:1,maxLength});
const sha={type:'string',pattern:'^[a-f0-9]{64}$'};
const obj=(properties,required=Object.keys(properties))=>({type:'object',properties,required,additionalProperties:false});
const rows=(items,maxItems=100)=>({type:'array',items,maxItems});
const receiptSchema=obj({path:str(240),sha256:sha});
export const SOURCE_TRACE_SCHEMA={
  $schema:'https://json-schema.org/draft/2020-12/schema',$id:'https://useaiblocks.com/api/v1/schemas/ai-blocks-source-trace/1.json',title:SOURCE_TRACE_SCHEMA_ID,
  ...obj({schema:{const:SOURCE_TRACE_SCHEMA_ID},context:rows(obj({id:str(120),ref:str(1000),status:{enum:['INSPECTED','INFERRED','MISSING']},sha256:sha,receipt:receiptSchema,inspected_at:str(40),observation:str(2000),based_on:rows(str(120)),limitation:str(2000)},['id','ref','status','observation'])),methods:rows(obj({slug:str(120),revision_sha256:sha,reason:str(2000),used_by:rows(str(120)),resources:rows(obj({path:str(240),sha256:sha,bytes:{type:'integer',minimum:0},status:{const:'COMPLETE'},receipt:receiptSchema}),2000),execution:obj({status:{enum:['NOT_RUN','BLOCKED','EXECUTED']},reason:str(2000),receipt:receiptSchema,observation:str(2000),artifacts:rows(obj({path:str(240),sha256:sha}),1000)},['status'])}))})
};

/** Build expectations from the service's catalogue inventory, never from a
 * caller's all_read flag. Supporting item edges retain their own full packages. */
export function sourceTraceRequirements({ methods = [], manifest, items = [] } = {}) {
  const errors = [], required = new Map(), visiting = new Set();
  const bySlug = new Map(list(items).map(item => [item.slug, item]));
  const visit = (pin, selected = false) => {
    const entry = manifest?.resources?.[pin?.slug];
    if (!entry || !hash(entry.revision_sha256) || (pin.revision_sha256 && pin.revision_sha256 !== entry.revision_sha256)) {
      errors.push({path:'source_trace.methods',message:`The selected ${pin?.slug ?? '(unnamed)'} revision has no matching current catalogue inventory.`}); return;
    }
    if (required.has(pin.slug)) { if (selected) required.get(pin.slug).selected = true; return; }
    if (required.size >= 100) { errors.push({path:'source_trace.methods',message:'Split source closures larger than 100 methods.'}); return; }
    if (entry.reference_validation?.status !== 'PASS') errors.push({path:'source_trace.methods',message:`The ${pin.slug} package has not passed supporting-reference validation.`});
    const inventory = new Map();
    const add = (file, instruction = false) => {
      const raw=String(file?.path??''),relative = instruction ? 'SKILL.md' : raw.startsWith(`${pin.slug}/`)?raw.slice(pin.slug.length+1):raw;
      if (!path(relative) || !hash(file?.sha256) || !Number.isSafeInteger(file?.bytes) || file.bytes < 0) { errors.push({path:'source_trace.methods',message:`The ${pin.slug} package has an incomplete file inventory.`}); return; }
      inventory.set(relative, {path:relative,sha256:file.sha256,bytes:file.bytes});
    };
    add(entry.instruction, true);
    for (const file of list(entry.files)) if(file.path!==`${pin.slug}/SKILL.md`)add(file);
    required.set(pin.slug,{slug:pin.slug,revision_sha256:entry.revision_sha256,selected,resources:[...inventory.values()]});
    if (visiting.has(pin.slug)) return;
    visiting.add(pin.slug);
    const item = bySlug.get(pin.slug);
    for (const child of new Set([...list(item?.uses),...list(item?.steps).map(step=>typeof step==='string'?step:step?.uses)])) visit({slug:child});
    visiting.delete(pin.slug);
  };
  for (const method of list(methods)) visit(typeof method === 'string' ? {slug:method} : method, true);
  return {schema:'ai-blocks-source-trace-requirements/1',methods:[...required.values()],errors,ok:errors.length===0,assurance:'CATALOGUE_INVENTORY_NOT_EXECUTION'};
}

/** Validate the trace against authoritative requirements where available. A replay
 * without the catalogue remains explicitly a host report, never verified reads. */
export function validateSourceTrace(report, { requirements, methods = [], context_sources = [], artifacts = [], production = false, required = false } = {}) {
  const errors = [], add = (at,message) => errors.push({path:at,message});
  if (!report && !required) return {ok:true,errors,assurance:'NOT_PROVIDED'};
  if(report){const issues=checkSchema(SOURCE_TRACE_SCHEMA,report);if(issues.length)return {ok:false,errors:issues.map(issue=>({path:`source_trace${issue.path?'.'+issue.path:''}`,message:issue.message})),assurance:'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED'};}
  if (report?.schema !== SOURCE_TRACE_SCHEMA_ID || !Array.isArray(report.methods) || !Array.isArray(report.context)) {
    add('source_trace',`Supply ${SOURCE_TRACE_SCHEMA_ID} with context and methods; a list of skill names is not a source-use trace.`);
    return {ok:false,errors,assurance:'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED'};
  }
  if (report.methods.length > 100 || report.context.length > 100) add('source_trace','Keep the report to task-relevant sources and at most 100 methods and context records.');
  for (const error of list(requirements?.errors)) errors.push(error);
  const seen = new Set(), expected = new Map(list(requirements?.methods).map(method=>[method.slug,method]));
  const pins = new Map(list(methods).map(method=>[typeof method==='string'?method:method.slug,typeof method==='string'?null:method.revision_sha256]));
  const sourceIds = new Set();
  for (const [i,source] of report.context.entries()) {
    const at=`source_trace.context[${i}]`;
    if (!text(source?.id) || sourceIds.has(source.id) || !text(source.ref) || !['INSPECTED','INFERRED','MISSING'].includes(source.status)) add(at,'Use unique source IDs, an actual reference and INSPECTED, INFERRED or MISSING status.');
    sourceIds.add(source?.id);
    if (!text(source?.observation)) add(at,'Record the concrete observation, inference or missing information.');
    if (source?.status==='INSPECTED' && (!hash(source.sha256) || !receipt(source.receipt) || !text(source.inspected_at) || Number.isNaN(Date.parse(source.inspected_at)))) add(at,'An inspected source needs its snapshot hash, dated inspection and hashed read/inspection receipt.');
    if (source?.status==='INFERRED' && (!list(source.based_on).length || list(source.based_on).some(id=>!report.context.some(other=>other?.id===id&&other.status==='INSPECTED')) || !text(source.limitation))) add(at,'Inference needs inspected basis sources and an explicit limitation; it is not an inspected fact.');
    if (source?.status==='MISSING' && !text(source.limitation)) add(at,'Missing context needs the affected decision or limitation.');
    const scoped = list(context_sources).find(current=>current.id===source?.id);
    if (scoped && (source.ref!==(scoped.ref??scoped.path) || scoped.sha256 && source.sha256!==scoped.sha256)) add(at,'Keep the accepted context reference and snapshot hash; record a changed source separately.');
    if(scoped?.required_inspection&&source.status!=='INSPECTED')add(at,'The accepted brand/project brain or current baseline must be INSPECTED at its exact scoped hash; an inference or missing record cannot replace it.');
  }
  for (const source of list(context_sources)) if (!report.context.some(row=>row?.id===source.id)) add('source_trace.context',`Trace the accepted context source ${source.id}.`);
  for (const [i,method] of report.methods.entries()) {
    const at=`source_trace.methods[${i}]`;
    if (!text(method?.slug) || seen.has(method.slug) || !hash(method.revision_sha256)) add(at,'Use each selected or supporting method once with its exact revision SHA-256.');
    seen.add(method?.slug);
    const inventory=expected.get(method?.slug), pinned=pins.get(method?.slug);
    if (inventory && method.revision_sha256!==inventory.revision_sha256 || pinned && method.revision_sha256!==pinned) add(`${at}.revision_sha256`,'The method revision differs from the accepted catalogue pin.');
    if (requirements && !inventory) add(at,'Do not introduce an unselected method outside the approved source closure.');
    if (!text(method?.reason) || !list(method?.used_by).length || !list(method.used_by).every(text)) add(at,'Explain task fit and identify the receiving seat or stage.');
    if (!Array.isArray(method?.resources) || !method.resources.length || method.resources.length>2000) add(at,'List complete instruction and supporting-resource read receipts.');
    const files=new Set();
    for (const [j,file] of list(method?.resources).entries()) {
      const fileAt=`${at}.resources[${j}]`, expectedFile=inventory?.resources.find(row=>row.path===file?.path);
      if (!path(file?.path)||files.has(file.path)||!hash(file.sha256)||!Number.isSafeInteger(file.bytes)||file.bytes<0||!receipt(file.receipt)||file.status!=='COMPLETE') add(fileAt,'Each resource needs a unique safe path, full byte count/hash, COMPLETE status and hashed retrieval receipt.');
      files.add(file?.path);
      if (inventory && (!expectedFile || file.sha256!==expectedFile.sha256 || file.bytes!==expectedFile.bytes)) add(fileAt,'This resource hash or byte count differs from the pinned catalogue inventory.');
    }
    for (const file of list(inventory?.resources)) if (!files.has(file.path)) add(`${at}.resources`,`Read the complete pinned supporting closure; ${file.path} is missing.`);
    if (!files.has('SKILL.md')) add(`${at}.resources`,'Read the full SKILL.md, not its discovery summary.');
    const execution=method?.execution;
    if (!['NOT_RUN','BLOCKED','EXECUTED'].includes(execution?.status)) add(`${at}.execution`,'Distinguish selected/read methods from actual EXECUTED, NOT_RUN or BLOCKED work.');
    if (execution?.status==='EXECUTED' && (!receipt(execution.receipt)||!text(execution.observation)||!list(execution.artifacts).length)) add(`${at}.execution`,'Actual execution needs a hashed tool/work receipt, observed result and the output revisions it produced.');
    for(const result of list(execution?.artifacts))if(!text(result?.path)||!hash(result.sha256)||!list(artifacts).some(artifact=>artifact.path===result.path&&artifact.sha256===result.sha256))add(`${at}.execution.artifacts`,'Execution must name current output paths and hashes, not a stale artifact or bundle substitute.');
    if (['NOT_RUN','BLOCKED'].includes(execution?.status)&&!text(execution.reason)) add(`${at}.execution`,'Explain why a read method was not executed.');
  }
  for (const [slug] of pins) if (!seen.has(slug)) add('source_trace.methods',`Trace selected method ${slug}.`);
  for (const [slug] of expected) if (!seen.has(slug)) add('source_trace.methods',`Trace supporting package ${slug}.`);
  if (production) for (const [slug] of pins) if (!report.methods.some(method=>method.slug===slug&&method.execution?.status==='EXECUTED')) add('source_trace.methods',`Production cannot claim ${slug} as used while its execution is NOT_RUN or BLOCKED.`);
  if(production)for(const artifact of list(artifacts))for(const claimed of list(artifact.items)){
    const method=report.methods.find(method=>method.slug===claimed.slug&&method.revision_sha256===claimed.revision_sha256);
    if(!method?.execution?.artifacts?.some(result=>result.path===artifact.path&&result.sha256===artifact.sha256))add('source_trace.methods',`The ${artifact.path} artifact claims ${claimed.slug}; that method needs an execution receipt covering this exact output revision.`);
    if(text(artifact.maker_seat)&&!method?.used_by?.includes(artifact.maker_seat))add('source_trace.methods',`Trace ${claimed.slug} to its actual receiving maker ${artifact.maker_seat}, not just an unrelated seat.`);
  }
  return {ok:errors.length===0,errors,assurance:requirements?'CATALOGUE_HASH_MATCHED_HOST_REPORT':'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED'};
}

export function sourceTraceInstructions() {
  return 'Record source_trace (ai-blocks-source-trace/1): context separates INSPECTED snapshot/hash/date/receipt and observations from INFERRED with inspected basis and limitation, or MISSING. Each selected AI Blocks method and supporting item carries its exact revision, task-fit reason, used_by seats/stages and complete SKILL.md/resource paths, byte counts, hashes and hashed retrieval receipts. Match the service catalogue inventory, not an all_read flag. execution is NOT_RUN/BLOCKED with reason until actual work supplies a hashed receipt, observation and current artifact paths/hashes. A read method is not an executed tool; catalogue hash correspondence is not proof of understanding or execution. Keep private source bytes in the authorized host, not this report.';
}
