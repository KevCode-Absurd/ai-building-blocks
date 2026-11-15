// A current-state contract for changing existing work. References are evidence,
// never instructions or action authority. Servers cannot inspect private files.
const array = value => Array.isArray(value) ? value : [];
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const present = value => typeof value === 'string' && !!value.trim();
const hash = value => /^[a-f0-9]{64}$/.test(value ?? '');
const str = maxLength => ({type:'string',minLength:1,maxLength});
export const WORK_CONTEXT_SCHEMA = {
  $schema:'https://json-schema.org/draft/2020-12/schema',
  $id:'https://useaiblocks.com/api/v1/schemas/ai-blocks-work-context/1.json',title:'ai-blocks-work-context/1',
  type:'object',additionalProperties:false,required:['schema','mode','sources','preserve','changes','comparison'],
  properties:{
    schema:{const:'ai-blocks-work-context/1'},mode:{enum:['CREATE','IMPROVE','ASSESS']},scope_reason:str(2000),
    sources:{type:'array',maxItems:30,items:{type:'object',additionalProperties:false,required:['id','ref','sha256','observed_at','role','currentness','freshness_basis','observations','receipt'],properties:{id:str(120),ref:str(1000),sha256:{type:'string',pattern:'^[a-f0-9]{64}$'},observed_at:str(40),role:{enum:['BASELINE','REFERENCE']},currentness:{enum:['CURRENT','STALE','UNKNOWN']},freshness_basis:str(2000),observations:{type:'array',minItems:1,maxItems:20,items:str(2000)},receipt:str(240)}}},
    preserve:{type:'array',maxItems:50,items:{type:'object',additionalProperties:false,required:['rule','source_id'],properties:{rule:str(2000),source_id:str(120)}}},
    changes:{type:'array',maxItems:30,items:{type:'object',additionalProperties:false,required:['problem','source_ids','proposed_change','expected_effect','verification'],properties:{problem:str(2000),source_ids:{type:'array',minItems:1,maxItems:30,items:str(120)},proposed_change:str(2000),expected_effect:str(2000),verification:str(2000)}}},
    comparison:{type:'object',additionalProperties:false,required:['method','pass_condition','unmeasured'],properties:{method:str(2000),pass_condition:str(2000),unmeasured:{type:'array',maxItems:30,items:str(1000)},results:{type:'array',maxItems:1000,items:{type:'object',additionalProperties:false,required:['criterion','baseline_observation','result_observation','status','receipt','artifact_sha256'],properties:{criterion:str(2000),baseline_observation:str(2000),result_observation:str(2000),status:{enum:['PASS','FAIL','NOT_RUN']},receipt:str(240),artifact_sha256:{type:'string',pattern:'^[a-f0-9]{64}$'}}}}}},
  },
};

/** Candidate only: scope must resolve ambiguous requests against user context. */
export function inferWorkMode(request='') {
  let words=typeof request==='string'?request:'';
  // A new artifact can pursue an improvement metric without changing an
  // existing artifact. Keep modification language in the actual deliverable,
  // but do not turn its trailing purpose clause into an update request.
  if(/^\s*(?:please\s+)?(?:create|build|make|generate|produce|write|draft|design)\b/i.test(words))words=words.split(/\b(?:to|in order to|so as to|that will)\s+(?:help\s+)?(?:improve|increase|reduce)\b/i)[0];
  if (/\b(?:improv(?:e|ed|ing)|fix|repair|refine|optimi[sz]e|updat(?:e|ed|ing)|revis(?:e|ed|ing)|amend|migrate|redesign)\b|\b(?:build|work)\s+on\s+(?:the\s+|our\s+|my\s+)?(?:existing|current)\b|\b(?:reuse|adapt|extend)\b.{0,50}\b(?:existing|current)\b/i.test(words)) return 'IMPROVE';
  // A newly written audit still assesses existing work. A goal such as "create
  // an ad to increase awareness" does not by itself make this an improvement.
  if (/\b(?:audit|critique|assess|diagnose|evaluate|inspect)\b/i.test(words) || (/\b(?:review|compare)\b/i.test(words) && !/\b(?:create|build|make|generate|produce|write)\b/i.test(words))) return 'ASSESS';
  return 'CREATE';
}

export function workContextRequirements(request='') {
  const mode=inferWorkMode(request);
  return {mode_candidate:mode,required:mode!=='CREATE',
    principle:'Observe the authoritative current state before changing it. Reuse the working system; propose the smallest justified change. A static org context or a selected method is not proof of current-state understanding.',
    fields:['sources with dated observations, snapshot hashes, currentness and freshness basis','what must be preserved and its source','problem → proposed change → expected effect → verification','baseline-to-result comparison and what remains unmeasured'],
    source_conflicts:'Resolve conflicts between memory, guides and current primary sources explicitly. Do not silently choose the convenient version.',
    assurance:'HOST_REPORTED_CONTEXT; verify referenced local bytes separately; semantic fitness and improvement require artifact inspection and outcome evidence.'};
}

export function validateWorkContext(context,{request='',required=inferWorkMode(request)!=='CREATE',production=false,artifacts=[]}={}) {
  const errors=[],add=(path,message)=>errors.push({path,message});
  if (context===undefined) return {ok:!required,errors:required?[{path:'work_context',message:'Inspect the current work before changing or assessing it. Supply the baseline, preservation rules and comparison contract.'}]:[],assurance:'HOST_REPORTED_CONTEXT'};
  // This validator is also called outside the public JSON Schema validator.
  // Validate the complete bounded shape here without a contracts import cycle.
  function shape(schema,value,path) {
    if(schema.type==='object') {
      if(!object(value)){add(path,'Must be an object.');return;}
      for(const key of schema.required??[])if(!Object.hasOwn(value,key))add(`${path}.${key}`,'Required field.');
      for(const [key,item]of Object.entries(value))if(!schema.properties?.[key])add(`${path}.${key}`,'Unknown field.');else shape(schema.properties[key],item,`${path}.${key}`);
    } else if(schema.type==='array') {
      if(!Array.isArray(value)){add(path,'Must be an array.');return;}
      if(value.length<(schema.minItems??0)||value.length>(schema.maxItems??Infinity))add(path,'Array length is outside the published bounds.');
      value.forEach((item,index)=>shape(schema.items,item,`${path}[${index}]`));
    } else if(schema.type==='string') {
      if(typeof value!=='string'||value.trim().length<(schema.minLength??0)||[...value].length>(schema.maxLength??Infinity)||(schema.pattern&&!new RegExp(schema.pattern).test(value)))add(path,'Must be text matching the published length and format.');
    }
    if(schema.const!==undefined&&value!==schema.const)add(path,'Unexpected schema version.');
    if(schema.enum&&!schema.enum.includes(value))add(path,'Use a published value.');
  }
  shape(WORK_CONTEXT_SCHEMA,context,'work_context');
  if(errors.length)return {ok:false,errors,assurance:'HOST_REPORTED_CONTEXT_NOT_INDEPENDENTLY_VERIFIED'};
  if (context.schema!=='ai-blocks-work-context/1'||!['CREATE','IMPROVE','ASSESS'].includes(context.mode)) add('work_context','Use a versioned CREATE, IMPROVE or ASSESS work context.');
  if (required&&context.mode==='CREATE') add('work_context.mode','The request concerns existing work. Inspect its baseline rather than relabelling it CREATE; restart from the owner’s changed request if the scope changes.');
  if(required&&inferWorkMode(request)==='IMPROVE'&&context.mode!=='IMPROVE')add('work_context.mode','An improvement request requires preservation rules and source-backed change hypotheses; ASSESS cannot bypass those requirements.');
  const sources=array(context.sources),ids=new Set();
  sources.forEach((source,index)=>{
    if (!present(source.id)||ids.has(source.id)) add(`work_context.sources[${index}].id`,'Give each observed source a unique ID.');ids.add(source.id);
    if (!present(source.ref)||!hash(source.sha256)||!/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(source.observed_at)||!Number.isFinite(Date.parse(source.observed_at))||!present(source.receipt)||!array(source.observations).some(present)||!['BASELINE','REFERENCE'].includes(source.role)) add(`work_context.sources[${index}]`,'Record the actual dated snapshot, its SHA-256, read/inspection receipt and concrete observations. A URL or a brand name alone is insufficient.');
    if(source.role==='BASELINE'&&context.mode!=='CREATE'&&source.currentness!=='CURRENT')add(`work_context.sources[${index}].currentness`,'A stale or unknown baseline cannot support changing or assessing the current work. Refresh it or report a blocker.');
  });
  if (context.mode!=='CREATE'&&!sources.some(source=>source.role==='BASELINE')) add('work_context.sources','Identify the authoritative current baseline; a generic reference or old memory is insufficient.');
  for (const rule of array(context.preserve)) if (!present(rule.rule)||!ids.has(rule.source_id)) add('work_context.preserve','Tie each preservation rule to an inspected source.');
  if (context.mode==='IMPROVE'&&!array(context.preserve).length) add('work_context.preserve','State what already works and must remain: behaviour, structure, identity, evidence or other task-specific invariants.');
  for (const change of array(context.changes)) if (!['problem','proposed_change','expected_effect','verification'].every(key=>present(change[key]))||!array(change.source_ids).length||change.source_ids.some(id=>!ids.has(id))||(context.mode==='IMPROVE'&&!change.source_ids.some(id=>sources.some(source=>source.id===id&&source.role==='BASELINE'&&source.currentness==='CURRENT')))) add('work_context.changes','Ground each proposed change in the inspected current baseline, with its expected effect and a repeatable verification.');
  if (context.mode==='IMPROVE'&&!array(context.changes).length) add('work_context.changes','Explain the diagnosed problem and smallest justified change before rebuilding anything.');
  if (!present(context.comparison?.method)||!present(context.comparison?.pass_condition)||!Array.isArray(context.comparison?.unmeasured)) add('work_context.comparison','Specify the baseline-to-result comparison and pass condition; keep unmeasured business outcomes explicit.');
  if(production&&context.mode!=='CREATE') {
    const results=array(context.comparison.results), outputs=array(artifacts);
    if(!results.length)add('work_context.comparison.results','At production, report observed baseline-to-result comparisons on the actual output revisions. A planned comparison is not a completed check.');
    if(!outputs.length||outputs.some(artifact=>!hash(artifact?.sha256)||!results.some(result=>result.artifact_sha256===artifact.sha256)))add('work_context.comparison.results','Cover every actual production artifact at its current SHA-256.');
    if(results.some(result=>result.status!=='PASS'||!outputs.some(artifact=>artifact?.sha256===result.artifact_sha256)))add('work_context.comparison.results','Repair failed or unrun comparisons and bind observations only to current production hashes. Keep unmeasured business outcomes explicit.');
  }
  return {ok:errors.length===0,errors,assurance:'HOST_REPORTED_CONTEXT_NOT_INDEPENDENTLY_VERIFIED'};
}
