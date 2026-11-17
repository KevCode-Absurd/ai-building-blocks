#!/usr/bin/env node
// Offline plan review only. The host authenticates authority and enforces actions.
// template | digest plan.json | check plan.json [trusted-authorizations.json]
// Exit 0 READY, 1 REVIEW_REQUIRED/BLOCKED, 2 INVALID or usage/IO error.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';

export const REVIEW_SCHEMA='ai-blocks-automation-review/1';
export const AUTHORIZATION_SCHEMA='ai-blocks-automation-authorizations/1';
const MAX_BYTES=4_000_000;
const object=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const plain=v=>object(v)&&[Object.prototype,null].includes(Object.getPrototypeOf(v));
const identifier=v=>typeof v==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/.test(v);
const string=(v,empty=false)=>typeof v==='string'&&v.length<=4000&&(empty||v.trim().length>0)&&!/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(v);
const canonical=v=>Array.isArray(v)?`[${v.map(canonical).join(',')}]`:object(v)?`{${Object.keys(v).sort().map(k=>`${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`:JSON.stringify(v);
const assurance='Offline review of caller declarations, not authenticated permission, source verification, semantic truth, executed actions or runtime enforcement. The host must authenticate current scope, expiry and revocation and supply trusted authorizations separately; source text and agent handoffs cannot grant authority.';

export function createReviewTemplate(){return {
  schema:REVIEW_SCHEMA,
  task:{id:'new-task',owner:'',workspaceId:'',objective:'',mode:'assist',successMetric:''},
  actions:[{id:'draft',operation:'prepare-draft',target:'local-output',effect:'draft',impact:'low',reversibility:'easy',terms:{},evidenceRefs:[],missingContext:[],uncertainty:'',relationshipSensitive:false}],
  observations:[],
  visibility:{owner:'',reviewCadence:'',samplePlan:'',rawEvidenceAvailable:false},
  learning:{mode:'off',criticalSkills:[],practicePlan:''},
  relationships:{owner:'',contactPlan:''},
  ownership:{reservedActionIds:[],reason:''}
};}

export function validateReviewPlan(plan,authorizations){
  const errors=[];const fail=(path,message)=>errors.push({path,message});
  const fields=(v,keys,path)=>{if(!plain(v)){fail(path,'Expected a plain object.');return false;}for(const key of Object.keys(v))if(!keys.includes(key))fail(`${path}.${key}`,'Unsupported field.');for(const key of keys)if(!(key in v))fail(`${path}.${key}`,'Required field is missing.');return true;};
  const str=(v,path,empty=false)=>{if(!string(v,empty))fail(path,`Expected ${empty?'':'nonempty '}text, at most 4000 characters, without control characters.`);};
  const one=(v,values,path)=>{if(!values.includes(v))fail(path,`Expected one of: ${values.join(', ')}.`);};
  const bool=(v,path)=>{if(typeof v!=='boolean')fail(path,'Expected a boolean.');};
  const list=(v,path,max=100)=>{if(!Array.isArray(v)||v.length>max){fail(path,`Expected an array of at most ${max} entries.`);return [];}return v;};
  const texts=(v,path)=>{const a=list(v,path);a.forEach((x,i)=>str(x,`${path}[${i}]`));if(new Set(a).size!==a.length)fail(path,'Duplicate entries are not allowed.');};
  if(!fields(plan,['schema','task','actions','observations','visibility','learning','relationships','ownership'],'$'))return errors;
  if(plan.schema!==REVIEW_SCHEMA)fail('schema','Unknown review schema.');
  if(fields(plan.task,['id','owner','workspaceId','objective','mode','successMetric'],'task')){
    if(!identifier(plan.task.id))fail('task.id','Expected a simple identifier.');
    if(!identifier(plan.task.workspaceId))fail('task.workspaceId','Expected a workspace identifier supplied by the host.');
    for(const k of ['owner','objective','successMetric'])str(plan.task[k],`task.${k}`);
    one(plan.task.mode,['assist','automate'],'task.mode');
  }
  const ids=new Set();const actions=list(plan.actions,'actions');if(!actions.length)fail('actions','At least one action is required.');
  actions.forEach((a,i)=>{
    const p=`actions[${i}]`;if(!fields(a,['id','operation','target','effect','impact','reversibility','terms','evidenceRefs','missingContext','uncertainty','relationshipSensitive'],p))return;
    if(!identifier(a.id)||ids.has(a.id))fail(`${p}.id`,'Expected a unique simple identifier.');ids.add(a.id);
    for(const k of ['operation','target'])str(a[k],`${p}.${k}`);
    one(a.effect,['read','draft','external'],`${p}.effect`);one(a.impact,['low','material','high'],`${p}.impact`);one(a.reversibility,['easy','costly','irreversible','unknown'],`${p}.reversibility`);
    if(!plain(a.terms)||Object.keys(a.terms).length>32)fail(`${p}.terms`,'Expected at most 32 named scalar terms.');
    else for(const [key,value]of Object.entries(a.terms)){
      if(!identifier(key)||['__proto__','constructor','prototype'].includes(key))fail(`${p}.terms`,'Terms need safe simple keys.');
      if(!(value===null||typeof value==='boolean'||typeof value==='number'&&Number.isFinite(value)||string(value)))fail(`${p}.terms.${key}`,'Terms must be finite numbers, nonempty text, booleans or null; nested data is unsupported.');
    }
    texts(a.evidenceRefs,`${p}.evidenceRefs`);texts(a.missingContext,`${p}.missingContext`);str(a.uncertainty,`${p}.uncertainty`,true);bool(a.relationshipSensitive,`${p}.relationshipSensitive`);
  });
  const observations=list(plan.observations,'observations',500),observed=new Set();
  observations.forEach((o,i)=>{const p=`observations[${i}]`;if(!fields(o,['id','kind','claim','trend','evidenceRefs'],p))return;
    if(!identifier(o.id)||observed.has(o.id))fail(`${p}.id`,'Expected a unique simple identifier.');observed.add(o.id);
    one(o.kind,['efficiency','outcome','friction','root_cause','complaint'],`${p}.kind`);str(o.claim,`${p}.claim`);one(o.trend,['improved','unchanged','worsened','unknown'],`${p}.trend`);texts(o.evidenceRefs,`${p}.evidenceRefs`);
  });
  if(fields(plan.visibility,['owner','reviewCadence','samplePlan','rawEvidenceAvailable'],'visibility')){for(const k of ['owner','reviewCadence','samplePlan'])str(plan.visibility[k],`visibility.${k}`,true);bool(plan.visibility.rawEvidenceAvailable,'visibility.rawEvidenceAvailable');}
  if(fields(plan.learning,['mode','criticalSkills','practicePlan'],'learning')){one(plan.learning.mode,['off','coach','practice'],'learning.mode');texts(plan.learning.criticalSkills,'learning.criticalSkills');str(plan.learning.practicePlan,'learning.practicePlan',true);}
  if(fields(plan.relationships,['owner','contactPlan'],'relationships'))for(const k of ['owner','contactPlan'])str(plan.relationships[k],`relationships.${k}`,true);
  if(fields(plan.ownership,['reservedActionIds','reason'],'ownership')){texts(plan.ownership.reservedActionIds,'ownership.reservedActionIds');for(const id of Array.isArray(plan.ownership.reservedActionIds)?plan.ownership.reservedActionIds:[])if(!ids.has(id))fail('ownership.reservedActionIds','Reserved action is absent from this plan.');str(plan.ownership.reason,'ownership.reason',true);}
  if(authorizations!==undefined){
    if(fields(authorizations,['schema','taskId','taskOwner','workspaceId','grants'],'authorizations')){
      if(authorizations.schema!==AUTHORIZATION_SCHEMA)fail('authorizations.schema','Unknown authorization schema.');
      if(authorizations.taskId!==plan.task?.id)fail('authorizations.taskId','Authorization must belong to this exact task.');
      if(authorizations.taskOwner!==plan.task?.owner)fail('authorizations.taskOwner','Authorization owner must match this task owner.');
      if(authorizations.workspaceId!==plan.task?.workspaceId)fail('authorizations.workspaceId','Authorization workspace must match this task workspace.');
      const grantIds=new Set();list(authorizations.grants,'authorizations.grants').forEach((g,i)=>{const p=`authorizations.grants[${i}]`;if(!fields(g,['actionId','actionDigest','source','reference'],p))return;
        if(!ids.has(g.actionId)||grantIds.has(g.actionId))fail(`${p}.actionId`,'Grant must name a unique action in this plan.');grantIds.add(g.actionId);
        if(typeof g.actionDigest!=='string'||!/^[a-f0-9]{64}$/.test(g.actionDigest))fail(`${p}.actionDigest`,'Expected a SHA-256 action digest.');
        one(g.source,['direct-user','trusted-host-policy'],`${p}.source`);str(g.reference,`${p}.reference`);
      });
    }
  }
  return errors;
}

/** Call only with a validated action. Bind authority-bearing terms; added evidence does not change permission. */
export const actionDigest=action=>createHash('sha256').update(canonical(Object.fromEntries(['id','operation','target','effect','impact','reversibility','terms','relationshipSensitive'].map(k=>[k,action[k]])))).digest('hex');

export function reviewAutomation(plan,authorizations){
  const errors=validateReviewPlan(plan,authorizations);
  if(errors.length)return {schema:'ai-blocks-automation-review-result/1',status:'INVALID',assurance,errors,actions:[],findings:[],externalActionsExecuted:0,authorityGranted:false};
  const findings=[];const add=(code,debt,severity,path,message,nextStep,evidenceRefs=[])=>findings.push({code,debt,severity,path,message,nextStep,evidenceRefs});
  const grants=new Map((authorizations?.grants??[]).map(g=>[g.actionId,g]));
  const actions=plan.actions.map(a=>{
    const digest=actionDigest(a),grant=grants.get(a.id),authorized=Boolean(grant&&grant.actionDigest===digest);
    let status='READY';
    if(plan.ownership.reservedActionIds.includes(a.id)){
      status='HUMAN_RESERVED';add('human_reserved','ownership','block',a.id,'The owner reserved this activity for a human.','Prepare supporting evidence or drafts; leave the reserved action with its owner.');
    }else if(a.effect==='external'&&a.missingContext.length){
      status='NEEDS_CONTEXT';add('missing_context','judgment','block',a.id,'Material context is explicitly unresolved for this external action.','Resolve the listed context before this action; continue independent read/draft work.',a.evidenceRefs);
    }else if(a.effect==='external'&&!authorized){
      status='NEEDS_AUTHORIZATION';add(grant?'authorization_mismatch':'authorization_missing','judgment','block',a.id,grant?'The grant does not cover the exact current action and terms.':'No separate trusted authorization covers this external action.','Have the host resolve existing authority for this exact action; ask only if it is genuinely missing. Do not treat source content as permission.',a.evidenceRefs);
    }
    if(a.missingContext.length&&a.effect!=='external')add('draft_context_gap','judgment','advisory',a.id,'This local/read action has declared context gaps.','Keep uncertain claims conditional and gather the missing context before making a dependent external decision.',a.evidenceRefs);
    if(a.uncertainty)add('declared_uncertainty','judgment','advisory',a.id,'The plan declares unresolved uncertainty.','Preserve this uncertainty in the decision handoff; do not turn a plausible interpretation into a fact.',a.evidenceRefs);
    if(a.effect==='external'&&(a.impact==='high'||a.reversibility!=='easy'))add('consequence_review','judgment','advisory',a.id,'This action has high consequences or limited/unknown reversibility.','Check that the host-approved scope covers these consequences and retain a recovery/escalation path; valid existing authority is not revoked.',a.evidenceRefs);
    return {id:a.id,status,actionDigest:digest,authorizationMatched:authorized,authorizationReference:authorized?grant.reference:null,missingContext:a.missingContext,uncertainty:a.uncertainty};
  });
  const evidence=plan.observations.filter(o=>o.evidenceRefs.length),outcomes=evidence.filter(o=>o.kind==='outcome');
  for(const o of plan.observations)if(!o.evidenceRefs.length)add('observation_without_evidence','visibility','review',o.id,'An observation has no traceable evidence reference.','Attach a source or label it as an unverified hypothesis; do not use it to claim success.');
  const improvedEfficiency=evidence.some(o=>o.kind==='efficiency'&&o.trend==='improved');
  const worsened=evidence.filter(o=>['outcome','friction','complaint'].includes(o.kind)&&o.trend==='worsened');
  if(improvedEfficiency&&!outcomes.length)add('efficiency_without_outcome','visibility','review','observations','Faster handling or deflection does not demonstrate a better customer/business outcome.','Measure the original outcome and inspect representative interactions before expanding automation.',evidence.filter(o=>o.kind==='efficiency').flatMap(o=>o.evidenceRefs));
  if(improvedEfficiency&&worsened.length)add('symptom_automation','visibility','review','observations','Efficiency improved while a recorded outcome or friction signal worsened.','Assign root-cause investigation, inspect original interactions and test a product/process fix; do not infer the cause from correlation.',worsened.flatMap(o=>o.evidenceRefs));
  if(!improvedEfficiency&&worsened.length)add('adverse_signal','visibility','review','observations','A recorded customer/business outcome or friction signal worsened.','Investigate the adverse signal and its original evidence before claiming automation success or expanding scope.',worsened.flatMap(o=>o.evidenceRefs));
  if(plan.task.mode==='automate'){
    if(outcomes.length&&outcomes.every(o=>o.trend==='unknown'))add('outcome_trend_unknown','visibility','review','observations','Outcome references exist, but their direction is still unknown.','Collect a comparable baseline and follow-up before claiming an improvement.');
    if(!outcomes.length)add('outcome_measure_missing','visibility','review','task.successMetric','Ongoing automation lacks a sourced customer/business outcome observation.','Establish a baseline and follow-up outcome measurement, including adverse signals.');
    if(!plan.visibility.owner.trim()||!plan.visibility.reviewCadence.trim()||!plan.visibility.samplePlan.trim()||!plan.visibility.rawEvidenceAvailable)add('visibility_loop_missing','visibility','review','visibility','The owner, review cadence, representative sample or original evidence access is missing.','Define a proportionate review loop with originals and a path to investigate recurring complaints; do not retain unnecessary personal data.');
  }
  for(const o of evidence.filter(o=>o.kind==='root_cause'))add('root_cause_hypothesis','visibility','advisory',o.id,'A proposed root cause is a hypothesis, not established causality.','Test the proposed explanation against original evidence and plausible alternatives.',o.evidenceRefs);
  if(plan.learning.mode==='off'&&plan.learning.criticalSkills.length&&!plan.learning.practicePlan.trim())add('critical_skill_practice_optional','skill','advisory','learning','Critical skills are designated, but no practice plan is requested.','Offer occasional optional teach-back or unaided practice; keep learning off unless the owner chooses it.');
  if(plan.learning.mode!=='off'&&(!plan.learning.criticalSkills.length||!plan.learning.practicePlan.trim()))add('learning_plan_missing','skill','review','learning','Learning mode was requested without a concrete critical skill and practice plan.','Specify an optional teach-back, prediction-before-answer or occasional unaided exercise; routine delivery can continue.');
  if(plan.learning.mode!=='off'&&plan.learning.criticalSkills.length&&plan.learning.practicePlan.trim())add('learning_opt_in','skill','advisory','learning','Use the requested practice plan for the designated skills.','Keep learning opt-in; do not hide the final answer or obstruct urgent work.');
  if(plan.actions.some(a=>a.relationshipSensitive)&&(!plan.relationships.owner.trim()||!plan.relationships.contactPlan.trim()))add('relationship_continuity_missing','relationship','review','relationships','A relationship-sensitive task has no human continuity plan.','Name the human relationship owner and an appropriate contact/escalation opportunity; no contact is sent by this tool.');
  if(plan.ownership.reservedActionIds.length&&!plan.ownership.reason.trim())add('ownership_reason_missing','ownership','advisory','ownership.reason','Human-reserved activities have no stated rationale.','Record what the owner wants to retain: judgment, relationship, practice or personal meaning.');
  const blocked=actions.some(a=>a.status!=='READY');
  return {schema:'ai-blocks-automation-review-result/1',taskId:plan.task.id,status:blocked?'BLOCKED':findings.some(f=>f.severity==='review')?'REVIEW_REQUIRED':'READY',assurance,
    actions,findings,independentReadyActionIds:actions.filter(a=>a.status==='READY').map(a=>a.id),heldActionIds:actions.filter(a=>a.status!=='READY').map(a=>a.id),
    outcomeConclusion:outcomes.length?'Outcome evidence references are present; neither their truth nor causal attribution is verified.':'No sourced outcome observation; efficiency alone is not proof of success.',
    learningMode:plan.learning.mode,externalActionsExecuted:0,authorityGranted:false};
}

function readJson(file){
  const stat=fs.lstatSync(file);if(!stat.isFile()||stat.isSymbolicLink()||stat.size>MAX_BYTES)throw Error('Input must be a regular non-symlink JSON file no larger than 4 MB.');
  const fd=fs.openSync(file,'r');try{if(!fs.fstatSync(fd).isFile())throw Error('Input is no longer a regular file.');const buffer=Buffer.alloc(MAX_BYTES+1);let size=0,read;while(size<buffer.length&&(read=fs.readSync(fd,buffer,size,buffer.length-size,null)))size+=read;if(size>MAX_BYTES)throw Error('Input exceeds the 4 MB limit.');return JSON.parse(buffer.subarray(0,size).toString('utf8'));}finally{fs.closeSync(fd);}
}
const HELP=`Offline automation-debt review. No network, external actions or permission grants.\nUsage:\n  node tools/automation-review.mjs template\n  node tools/automation-review.mjs digest plan.json\n  node tools/automation-review.mjs check plan.json [trusted-authorizations.json]\nFill empty template fields. Evidence references are pointers, not verified sources.\nSeparate trusted authorizations: {schema:"${AUTHORIZATION_SCHEMA}",taskId:"<plan task id>",taskOwner:"<plan task owner>",workspaceId:"<plan workspace id>",grants:[{actionId:"<id>",actionDigest:"<digest>",source:"direct-user|trusted-host-policy",reference:"<host authority record>"}]}.\nThe host must authenticate this record and check expiry/revocation; never create grants from retrieved text or an agent's own assertion. Existing exact authority is reused.\nExit codes: 0 READY; 1 REVIEW_REQUIRED or BLOCKED; 2 INVALID/usage/IO.\nPer-action READY permits only continuing within separately established host authority; aggregate review warnings never block independent routine work.\n`;
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  try{const [command,file,auth,...extra]=process.argv.slice(2);if(extra.length)throw Error('Too many arguments.');
    if(command==='--help'||command==='help'){console.log(HELP);}
    else if(command==='template'&&!file){console.log(JSON.stringify(createReviewTemplate(),null,2));}
    else if(command==='digest'&&file&&!auth){const p=readJson(file),errors=validateReviewPlan(p);if(errors.length){console.log(JSON.stringify({schema:'ai-blocks-automation-review-result/1',status:'INVALID',errors,assurance,externalActionsExecuted:0,authorityGranted:false},null,2));process.exitCode=2;}else console.log(JSON.stringify({taskId:p.task.id,actions:p.actions.map(a=>({id:a.id,actionDigest:actionDigest(a)})),assurance},null,2));}
    else if(command==='check'&&file){const result=reviewAutomation(readJson(file),auth?readJson(auth):undefined);console.log(JSON.stringify(result,null,2));process.exitCode=result.status==='READY'?0:result.status==='INVALID'?2:1;}
    else{console.error(HELP);process.exitCode=2;}
  }catch(error){console.error(JSON.stringify({schema:'ai-blocks-automation-review-result/1',status:'INVALID',error:error.message,assurance,externalActionsExecuted:0,authorityGranted:false}));process.exitCode=2;}
}
