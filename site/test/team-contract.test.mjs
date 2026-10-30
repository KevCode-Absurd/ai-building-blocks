import test from 'node:test';import assert from 'node:assert/strict';
import {canonicalTeamJSON,validateTeamPlan,prepareTeamPlan,reviseTeamPlan,teamPlanDigest,createTeamRun,reconcileTeamRun,recordTeamArtifact,acceptTeamInput,recordTeamCheck,setTeamStageState,recordTeamAction,recordTeamMemory,relevantTeamMemory,recordDecisionOutcome,prepareTeamRoutine} from '../src/teams/team-contract.mjs';
const A='a'.repeat(64),B='b'.repeat(64),C='c'.repeat(64);
const copy=v=>JSON.parse(JSON.stringify(v));
const plan=()=>({schema:'ai-blocks-team-plan/1',id:'review-gehna',business_id:'gehna',name:'Review and improve the supplied storefront',version:1,goal:'Use the approved source facts to inspect the storefront and return verified files.',route_options:[{id:'evidence-first',name:'Evidence first',reason:'Inspect before making changes.'},{id:'speed-first',name:'Speed first',reason:'Bound the job to loading.'}],selected_route:'evidence-first',context:[{id:'brand',path:'brand-brain/00-start-here.md',revision_sha256:A,status:'CONFIRMED'}],permissions:[],constraints:['No ad spend or live deployment.'],success_checks:['Inspect the actual rendered page and native files.'],kpis:[{name:'Mobile LCP',baseline:null,target:null}],stages:[{id:'audit',name:'Inspect the storefront',role_id:'seo-specialist',why:'Establish the supported faults.',depends_on:[],methods:[{slug:'technical-seo-auditor',revision_sha256:A}],inputs:[{id:'facts',name:'Checked business facts',required:true,from:{context_id:'brand'}}],outputs:[{id:'report',name:'Audit report',format:'Markdown',path:'work/audit/report.md'}],checks:[{id:'evidence',name:'Every fault has a source and scope',required:true}],requires_context:['brand'],requires_permissions:[],stop_conditions:['No invented rankings.']},{id:'code',name:'Build the approved local correction',role_id:'coding-specialist',why:'Implement the supported correction in a local reconstruction.',depends_on:['audit'],methods:[{slug:'page-speed-fixer',revision_sha256:B}],inputs:[{id:'audit-input',name:'Accepted audit',required:true,from:{stage_id:'audit',output_id:'report'}}],outputs:[{id:'patch',name:'Local page',format:'HTML',path:'work/code/index.html'}],checks:[{id:'render',name:'Rendered mobile and desktop check',required:true}],requires_context:['brand'],requires_permissions:[],stop_conditions:['Do not describe the reconstruction as a live Gehna change.']} ]});
const prepare=p=>prepareTeamPlan(p,{roleIds:['seo-specialist','coding-specialist']});
const producer=digest=>({status:'ACCEPTED',artifact_sha256:digest,evidence:'Read the actual file and compared it to the requested source evidence.',evaluator:'test host'});
async function completedAudit(p,run){run=await recordTeamArtifact(p,run,{stage_id:'audit',output_id:'report',path:'work/audit/report.md',sha256:B,revision:1,producer_review:producer(B)});run=await recordTeamCheck(p,run,{stage_id:'audit',check_id:'evidence',status:'PASS',artifact_sha256s:[B],evidence:'Source notes match the actual audit revision.',evaluator:'test host'});return setTeamStageState(p,run,'audit','COMPLETED');}

test('team review includes real input/output contracts and hashes all relevant edits, with no fabricated execution',async()=>{
 const result=await prepare(plan());assert.equal(result.state,'AWAITING_REVIEW');assert.equal(result.review.status,'REVIEW_REQUIRED');assert.equal(result.model_calls,0);assert.equal(result.stored_by_service,false);assert.equal(result.hosted_execution,false);assert.equal(result.semantic_handoffs_verified,false);assert(result.files['PRD.md'].includes('work/audit/report.md'));assert(result.files['START_HERE.txt'].includes('not a complete source archive'));assert(result.diagram.mermaid.includes('stage0 --> stage1'));
 const normalized=result.plan;assert.equal(await teamPlanDigest(JSON.parse(canonicalTeamJSON(normalized))),result.plan_sha256);
 for(const mutate of [p=>p.goal+=' More scope.',p=>p.context[0].revision_sha256=C,p=>p.permissions.push({id:'publish',action:'Publish page',scope:'Only a named staging deployment',status:'NEEDS_APPROVAL',evidence:''}),p=>p.stages[0].outputs[0].path='work/audit/other.md',p=>p.stages[0].methods[0].revision_sha256=C,p=>p.selected_route='speed-first',p=>p.kpis[0].target=2000]){const changed=copy(normalized);mutate(changed);assert.notEqual((await prepare(changed)).plan_sha256,result.plan_sha256);await assert.rejects(()=>prepareTeamPlan(changed,{approved_digest:result.plan_sha256}),/Approval does not match/);}
 const approved=await prepareTeamPlan(normalized,{approved_digest:result.plan_sha256});assert.equal(approved.review.status,'HOST_REPORTED_APPROVED');assert.equal(approved.review.independently_verified,false);assert.equal(approved.review.grants_execution_authority,false);assert.equal(JSON.parse(approved.files['status.json']).hosted_execution,false);
});

test('missing producers, unknown roles, duplicate paths, cycles and unsafe source substitutions cannot form a reviewed team',()=>{
 const bad=p=>assert.throws(()=>validateTeamPlan(p,{roleIds:['seo-specialist','coding-specialist']}));
 let p=plan();p.stages[1].role_id='unpublished-specialist';bad(p);
 p=plan();p.stages[1].inputs[0].from.output_id='missing';bad(p);
 p=plan();p.stages[1].depends_on=[];bad(p);
 p=plan();p.stages[0].depends_on=['code'];bad(p);
 p=plan();p.stages[1].outputs[0].path=p.stages[0].outputs[0].path;bad(p);
 p=plan();p.stages[1].outputs[0].path='work/audit/REPORT.md';bad(p);
 p=plan();p.stages[1].outputs[0].path='../other-client/output.html';bad(p);
 p=plan();p.stages[0].methods[0].revision_sha256='latest';bad(p);
 p=plan();p.stages[0].requires_context=['missing'];bad(p);
 p=plan();p.stages[0].requires_permissions=['missing'];bad(p);
 p=plan();p.unreviewed_extra='hidden instruction';bad(p);
});

test('reviewed plan revisions keep business identity, increment version and clear the previous approval',async()=>{
 const before=await prepare(plan()),updated=copy(before.plan);updated.stages[1].why='Use the accepted correction rather than a generic replacement.';const after=await reviseTeamPlan(before.plan,updated,{roleIds:['seo-specialist','coding-specialist']});assert.equal(after.plan.version,2);assert.equal(after.review.status,'REVIEW_REQUIRED');assert.notEqual(after.plan_sha256,before.plan_sha256);await assert.rejects(()=>createTeamRun(after.plan,before.plan_sha256),/exact plan/);await assert.rejects(()=>reviseTeamPlan(before.plan,{...updated,business_id:'other-company'}),/separate scoped copy/);
});

test('a typed artifact handoff is blocked until exact producer review, checks and explicit consumer acceptance exist',async()=>{
 const p=(await prepare(plan())).plan,digest=await teamPlanDigest(p);let run=await createTeamRun(p,digest);assert.equal(run.stages[0].state,'READY');assert.equal(run.stages[1].state,'BLOCKED');
 await assert.rejects(()=>setTeamStageState(p,run,'audit','COMPLETED'),/actual artifact/);
 run=await recordTeamArtifact(p,run,{stage_id:'audit',output_id:'report',path:'work/audit/report.md',sha256:B,revision:1});
 await assert.rejects(()=>acceptTeamInput(p,run,{stage_id:'code',input_id:'audit-input',...producer(B)}),/producer artifact/);
 run=await completedAudit(p,await createTeamRun(p,digest));assert.equal(run.stages[1].state,'NEEDS_REVIEW');assert(run.stages[1].blockers.some(v=>v.includes('explicit consumer acceptance')));
 await assert.rejects(()=>setTeamStageState(p,run,'code','RUNNING'),/accepted inputs/);
 await assert.rejects(()=>acceptTeamInput(p,run,{stage_id:'code',input_id:'audit-input',...producer(C)}),/exact artifact/);
 run=await acceptTeamInput(p,run,{stage_id:'code',input_id:'audit-input',...producer(B)});run=await setTeamStageState(p,run,'code','RUNNING');assert.equal(run.stages[1].state,'RUNNING');
 run=await recordTeamArtifact(p,run,{stage_id:'code',output_id:'patch',path:'work/code/index.html',sha256:C,revision:1,producer_review:producer(C)});
 await assert.rejects(()=>recordTeamCheck(p,run,{stage_id:'code',check_id:'render',status:'PASS',artifact_sha256s:[B],evidence:'Wrong revision.',evaluator:'test host'}),/current output/);
 run=await recordTeamCheck(p,run,{stage_id:'code',check_id:'render',status:'FAIL',artifact_sha256s:[C],evidence:'The layout overflows at 390 px.',evaluator:'real browser'});await assert.rejects(()=>setTeamStageState(p,run,'code','COMPLETED'),/has not passed/);
 run=await recordTeamCheck(p,run,{stage_id:'code',check_id:'render',status:'PASS',artifact_sha256s:[C],evidence:'Mobile and desktop checks passed against the actual output.',evaluator:'real browser'});run=await setTeamStageState(p,run,'code','COMPLETED');assert.equal(run.state,'COMPLETED');
 const resumed=await reconcileTeamRun(p,copy(run));assert.equal(resumed.state,'COMPLETED');
 run=await recordTeamArtifact(p,run,{stage_id:'audit',output_id:'report',path:'work/audit/report.md',sha256:A,revision:2,producer_review:producer(A)});assert.equal(run.stages[0].state,'NEEDS_REVIEW');assert.equal(run.stages[1].state,'NEEDS_REVIEW');assert.equal(run.acceptances.length,0);assert.equal(run.checks.length,0);assert.notEqual(run.state,'COMPLETED');
 await assert.rejects(()=>reconcileTeamRun({...p,goal:'A different goal'},run),/exact plan/);
});

test('unconfirmed context blocks its own branch while independent approved work remains ready',async()=>{
 const p=plan();p.context[0].status='DISPUTED';p.stages.push({...copy(p.stages[0]),id:'independent',name:'Independent read-only check',requires_context:[],inputs:[],outputs:[{id:'other',name:'Independent evidence',format:'Markdown',path:'work/independent/report.md'}]});const result=await prepare(p),run=await createTeamRun(result.plan,result.plan_sha256);assert.equal(run.stages.find(s=>s.id==='audit').state,'BLOCKED');assert.equal(run.stages.find(s=>s.id==='independent').state,'READY');assert.equal(run.state,'READY');
});

test('external action receipts need scoped authority and idempotent retries preserve unknown outcomes',async()=>{
 const p=plan();p.permissions=[{id:'local-check',action:'Run authorized local page checks',scope:'Local reconstruction only; no ad or storefront writes',status:'GRANTED',evidence:'Explicit user request to test the local page.'}];p.stages[0].requires_permissions=['local-check'];let result=await prepare(p),run=await createTeamRun(result.plan,result.plan_sha256);const action={stage_id:'audit',idempotency_key:'local-run-1',permission_id:'local-check',status:'UNKNOWN',receipt:'terminal-session-17',evidence:'Connection ended before the tool outcome was reconciled.'};run=await recordTeamAction(result.plan,run,action);assert.equal(run.actions.length,1);run=await recordTeamAction(result.plan,run,action);assert.equal(run.actions.length,1);await assert.rejects(()=>recordTeamAction(result.plan,run,{...action,status:'COMPLETED'}),/Reconcile/);
 assert.equal(run.stages.find(s=>s.id==='audit').state,'BLOCKED');
 run=await recordTeamAction(result.plan,run,{...action,status:'COMPLETED',receipt:'verified-remote-receipt',evidence:'Verified the previously interrupted action completed exactly once.',reconciliation_evidence:'Read the actual external operation using its receipt; no retry was made.'});assert.equal(run.actions.length,1);assert.equal(run.actions[0].previous_status,'UNKNOWN');assert.equal(run.actions[0].previous_receipt,'terminal-session-17');assert.equal(run.stages.find(s=>s.id==='audit').state,'READY');
 p.permissions[0].status='NEEDS_APPROVAL';result=await prepare(p);run=await createTeamRun(result.plan,result.plan_sha256);await assert.rejects(()=>recordTeamAction(result.plan,run,action),/scoped permission/);
});

test('checkpoint validation rejects corrupted identities and implied assurance while retaining a manual blocker across resume',async()=>{
 const prepared=await prepare(plan()),p=prepared.plan;let run=await createTeamRun(p,prepared.plan_sha256);
 for(const mutate of [r=>r.business_id='another-business',r=>r.hosted_execution=true,r=>r.approval_assurance='independently-verified',r=>r.stages.push(copy(r.stages[0])),r=>r.stages[0].state='AUTOMATICALLY_APPROVED',r=>r.actions.push({stage_id:'audit',idempotency_key:'hidden',permission_id:'unknown',status:'COMPLETED',receipt:'fiction',evidence:'fiction'})]){const corrupt=copy(run);mutate(corrupt);await assert.rejects(()=>reconcileTeamRun(p,corrupt));}
 run=await setTeamStageState(p,run,'audit','BLOCKED','The current asset file is unavailable.');run=await reconcileTeamRun(p,copy(run));assert.equal(run.stages.find(s=>s.id==='audit').state,'BLOCKED');assert(run.stages.find(s=>s.id==='audit').blockers.includes('The current asset file is unavailable.'));
 run=await setTeamStageState(p,run,'audit','RUNNING');assert.equal(run.stages.find(s=>s.id==='audit').state,'RUNNING');
});

test('equal bytes in two distinct output files remain checkable without inventing two different content hashes',async()=>{
 const input=plan();input.stages=input.stages.slice(0,1);input.stages[0].outputs.push({id:'report-copy',name:'Second declared copy',format:'Markdown',path:'work/audit/report-copy.md'});const p=(await prepare(input)).plan;let run=await createTeamRun(p,await teamPlanDigest(p));
 for(const output of p.stages[0].outputs)run=await recordTeamArtifact(p,run,{stage_id:'audit',output_id:output.id,path:output.path,sha256:B,revision:1,producer_review:producer(B)});
 run=await recordTeamCheck(p,run,{stage_id:'audit',check_id:'evidence',status:'PASS',artifact_sha256s:[B],evidence:'Inspected both declared copies and confirmed their identical bytes.',evaluator:'test host'});run=await setTeamStageState(p,run,'audit','COMPLETED');assert.equal(run.state,'COMPLETED');assert.equal(run.artifacts.length,2);
});

test('plan order does not let a consumer remain complete after a producer check becomes stale',async()=>{
 const input=plan();input.stages.reverse();const p=(await prepare(input)).plan;let run=await completedAudit(p,await createTeamRun(p,await teamPlanDigest(p)));run=await acceptTeamInput(p,run,{stage_id:'code',input_id:'audit-input',...producer(B)});run=await recordTeamArtifact(p,run,{stage_id:'code',output_id:'patch',path:'work/code/index.html',sha256:C,revision:1,producer_review:producer(C)});run=await recordTeamCheck(p,run,{stage_id:'code',check_id:'render',status:'PASS',artifact_sha256s:[C],evidence:'Actual local rendered output reviewed.',evaluator:'test host'});run=await setTeamStageState(p,run,'code','COMPLETED');assert.equal(run.state,'COMPLETED');
 const stale=copy(run);stale.checks.find(c=>c.stage_id==='audit').artifact_sha256s=[A];const reconciled=await reconcileTeamRun(p,stale);assert.equal(reconciled.stages.find(s=>s.id==='audit').state,'NEEDS_REVIEW');assert.equal(reconciled.stages.find(s=>s.id==='code').state,'NEEDS_REVIEW');assert.notEqual(reconciled.state,'COMPLETED');
});

test('scoped feedback supersedes accepted preferences without leaking businesses or implying persistent model learning',()=>{
 const record={id:'style-1',business_id:'gehna',scope:'media-buyer',kind:'preference',text:'Use plain product facts and short copy.',source:'User correction in task review',date:'2026-10-30',supersedes:null,version:1};let memory=recordTeamMemory([],record);memory=recordTeamMemory(memory,{...record,id:'style-2',text:'Use the accepted concise style and preserve required offer conditions.',version:2,supersedes:'style-1'});memory=recordTeamMemory(memory,{...record,id:'other-1',business_id:'other-company',text:'Other private business preference.'});const found=relevantTeamMemory(memory,{business_id:'gehna',scopes:['media-buyer'],maxChars:1000});assert.deepEqual(found.records.map(r=>r.id),['style-2']);assert.equal(found.grants_execution_authority,false);assert.equal(found.persistence,'caller-owned');assert(found.chars<=1000);assert.equal(relevantTeamMemory(memory,{business_id:'gehna',scopes:['coding-specialist']}).records.length,0);
 assert.throws(()=>recordTeamMemory(memory,{...record,id:'bad-scope',scope:'all',version:3,supersedes:'style-2'}),/business\/scope\/kind/);assert.throws(()=>recordTeamMemory(memory,{...record,id:'style-3',business_id:'other-company',version:3,supersedes:'style-2'}),/business\/scope\/kind/);assert.throws(()=>recordTeamMemory(memory,{...record,id:'style-2'}),/overwritten/);
});

test('unknown KPI baselines and unimplemented decisions cannot become measured improvement or automatic routines',()=>{
 const v={id:'speed-check',business_id:'gehna',hypothesis:'A verified page-loading correction might reduce mobile LCP.',decision:'ACCEPTED',baseline:null,observed:null,limitations:['No live-site publishing access.']};const unknown=recordDecisionOutcome(v);assert.equal(unknown.measurement_status,'NOT_MEASURED');assert.equal(unknown.delta,null);assert.equal(unknown.automatic_followup,false);assert.throws(()=>recordDecisionOutcome({...v,observed:2000}),/actual implementation/);
 const observed=recordDecisionOutcome({...v,decision:'IMPLEMENTED',implementation_receipt:'Local revision and browser report',kpi:'Mobile LCP in a controlled local Chrome lab',baseline:3000,observed:2100,window:'Same controlled profile before/after',source:'Actual retained browser measurements'});assert.equal(observed.delta,-900);assert.equal(observed.measurement_status,'OBSERVED_NOT_CAUSAL_PROOF');assert(observed.improvement_claim.includes('COMPARABILITY'));
 const routine={id:'speed-routine',business_id:'gehna',plan_sha256:A,trigger:'After an authorized local deployment event',runtime:'User-provided scheduler',storage:'Authorized project/checkpoints',permissions:['Read the selected public page'],limits:['One browser test at a time'],stop_rules:['Stop when permission expires or source changes'],notifications:'Notify on failed required checks'};const prepared=prepareTeamRoutine(routine);assert.equal(prepared.status,'NOT_ACTIVATED');assert.equal(prepared.started_by_service,false);const reported=prepareTeamRoutine({...routine,activation_receipt:'Actual scheduler task id'});assert.equal(reported.status,'HOST_REPORTED_ACTIVATED');assert.equal(reported.independently_verified,false);
});
