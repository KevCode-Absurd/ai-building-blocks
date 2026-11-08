import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {sourceTraceRequirements,validateSourceTrace} from '../src/jobs/source-trace.mjs';
import {validateAlternativeDecision} from '../src/jobs/alternative-decision.mjs';
import {validateExploration,validateProductionQuality,LEGACY_EXECUTION_QUALITY_POLICY} from '../src/jobs/execution-quality.mjs';
import {startJob,advanceJob,jobStateDigest} from '../src/jobs/engine.mjs';
import {engineFixture} from './fixtures/jobs/engine-fixture.mjs';
import {sourceTrace} from './fixtures/jobs/source-trace-fixture.mjs';
const copy=structuredClone,sha='a'.repeat(64),other='b'.repeat(64);
const send=(r,event,context)=>advanceJob({job_id:r.job_id,state:r.state,state_digest:r.state_digest,...event},context);
function traced(){
  const manifest={resources:{main:{revision_sha256:sha,instruction:{sha256:sha,bytes:50},files:[{path:'main/references/checks.md',sha256:other,bytes:70}],reference_validation:{status:'PASS'}},support:{revision_sha256:other,instruction:{sha256:other,bytes:30},files:[],reference_validation:{status:'PASS'}}}};
  const methods=[{slug:'main',revision_sha256:sha}],requirements=sourceTraceRequirements({methods,manifest,items:[{slug:'main',uses:['support']},{slug:'support'}]}),artifacts=[{path:'output/result.md',sha256:sha}];
  return {requirements,methods,artifacts,report:sourceTrace({requirements,artifacts})};
}
test('authoritative requirements include only selected methods and full recursive support inventories',()=>{
  const f=traced();assert(f.requirements.ok);assert.equal(f.requirements.methods.length,2);assert.equal(f.requirements.methods[0].resources.length,2);
  const checked=validateSourceTrace(f.report,{...f,production:true,required:true});assert(checked.ok,JSON.stringify(checked.errors));assert.equal(checked.assurance,'CATALOGUE_HASH_MATCHED_HOST_REPORT');
  const missing=copy(f.report);missing.methods[0].resources.pop();assert.match(JSON.stringify(validateSourceTrace(missing,f).errors),/checks.md.*missing/);
  const support=copy(f.report);support.methods.pop();assert.match(JSON.stringify(validateSourceTrace(support,f).errors),/supporting package support/);
});
test('a discovery summary, wrong byte count/hash, stale revision or all_read flag cannot stand in for complete sources',()=>{
  const f=traced();
  for(const mutate of [r=>{r.methods[0].resources=[];},r=>{r.methods[0].resources[0].bytes--;},r=>{r.methods[0].resources[0].sha256=other;},r=>{r.methods[0].revision_sha256=other;},r=>{r.methods[0].all_read=true;}]){
    const report=copy(f.report);mutate(report);assert.equal(validateSourceTrace(report,f).ok,false);
  }
  assert.equal(sourceTraceRequirements({methods:[{slug:'main',revision_sha256:other}],manifest:{resources:{}}}).ok,false);
});
test('real published imported methods use the served instruction hash rather than their archived original',()=>{
  const manifest=JSON.parse(fs.readFileSync(new URL('../public/data/public-api-manifest.json',import.meta.url),'utf8'));
  const slug='article-landing-page',entry=manifest.resources[slug],archived=entry.files.find(file=>file.path===`${slug}/SKILL.md`);
  assert(entry&&archived);assert.notEqual(entry.instruction.sha256,archived.sha256,'fixture has a distinct reviewed served instruction');
  const requirements=sourceTraceRequirements({methods:[{slug,revision_sha256:entry.revision_sha256}],manifest});
  assert(requirements.ok,JSON.stringify(requirements.errors));assert.equal(requirements.methods[0].resources.find(file=>file.path==='SKILL.md').sha256,entry.instruction.sha256);
  const artifacts=[{path:'output/page.html',sha256:sha}];assert(validateSourceTrace(sourceTrace({requirements,artifacts}),{requirements,methods:[slug],artifacts,production:true}).ok);
});
test('retrieval is separate from execution and only current output revisions can substantiate claimed use',()=>{
  const f=traced(),report=copy(f.report);report.methods[0].execution={status:'NOT_RUN',reason:'Read as a candidate; no execution occurred.'};
  assert(validateSourceTrace(report,f).ok);assert.equal(validateSourceTrace(report,{...f,production:true}).ok,false);
  report.methods[0].execution=copy(f.report.methods[0].execution);report.methods[0].execution.artifacts[0].sha256=other;
  assert.match(JSON.stringify(validateSourceTrace(report,{...f,production:true}).errors),/current output paths and hashes/);
});
test('each artifact claiming a selected method must be covered by that method execution and receiving maker',()=>{
  const f=engineFixture(),methods=f.production.artifacts.flatMap(artifact=>artifact.items),report=copy(f.production.source_trace);
  const method=report.methods[0],artifact=f.production.artifacts.find(artifact=>artifact.items.some(item=>item.slug===method.slug));
  method.execution.artifacts=method.execution.artifacts.filter(result=>result.path!==artifact.path);
  assert.equal(validateSourceTrace(report,{methods,artifacts:f.production.artifacts,production:true}).ok,false);
  method.execution.artifacts.push({path:artifact.path,sha256:artifact.sha256});method.used_by=['unrelated-maker'];
  assert.equal(validateSourceTrace(report,{methods,artifacts:f.production.artifacts,production:true}).ok,false);
});
test('context inferences require an actually inspected basis and cannot masquerade as facts',()=>{
  const f=traced(),report=copy(f.report);
  report.context=[{id:'baseline',ref:'project/current.md',status:'INSPECTED',sha256:sha,inspected_at:'2026-11-08T00:00:00Z',receipt:{path:'receipts/read.json',sha256:sha},observation:'Observed the existing flow.'},{id:'hypothesis',ref:'analysis.md',status:'INFERRED',based_on:['baseline'],observation:'The extra step may cause abandonment.',limitation:'No causal result measured.'}];
  assert(validateSourceTrace(report,f).ok);
  report.context[0].status='MISSING';report.context[0].limitation='Source unavailable.';assert.equal(validateSourceTrace(report,f).ok,false);
  assert.equal(validateSourceTrace({...report,methods:[null]},f).ok,false,'malformed records return issues rather than throwing');
});
test('brand brain trace is bound to the accepted brain snapshot and cannot be relabelled as inference',()=>{
  const f=engineFixture(),args={document:f.production,card:f.card,team:f.team,catalogue:f.context,require_trace:true};
  assert(validateProductionQuality(args).ok);
  f.production.source_trace.context[0].sha256=other;assert.equal(validateProductionQuality(args).ok,false);
  f.production.source_trace.context[0].sha256=f.card.brand_brain.sha256;f.production.source_trace.context[0].status='MISSING';f.production.source_trace.context[0].limitation='Not available.';
  assert.equal(validateProductionQuality(args).ok,false);
});
test('every frozen route is compared against every criterion and critical failures block selection',()=>{
  const f=engineFixture(),args={routes:f.routes,card:f.card,council:f.council,required:true};
  assert(validateAlternativeDecision(f.council.alternative_decision,args).ok);
  for(const mutate of [r=>{r.comparisons.pop();},r=>{r.comparisons[0].criteria=[];},r=>{r.comparisons[0].proposal_sha256=other;},r=>{r.dissent='Everyone agreed.';},r=>{r.retained_alternatives=[];},r=>{r.comparisons[0].criteria[0].status='UNSUPPORTED';}]){
    const report=copy(f.council.alternative_decision);mutate(report);assert.equal(validateAlternativeDecision(report,args).ok,false);
  }
});
test('a hybrid identifies a compatible contribution from every selected route',()=>{
  const f=engineFixture(),report=copy(f.council.alternative_decision);report.chosen=['r0','r1'];report.retained_alternatives=report.retained_alternatives.filter(row=>row.route_id==='r2');report.synthesis='Use the interview to choose one bounded automation test.';report.components=[{route_id:'r0',keep:'Customer problem evidence',compatibility:'Used before choosing the process change.'}];
  const args={routes:f.routes,card:f.card,required:true};assert.equal(validateAlternativeDecision(report,args).ok,false);
  report.components.push({route_id:'r1',keep:'Automate only the verified bottleneck',compatibility:'The interview determines what to automate.'});assert.equal(validateAlternativeDecision(report,args).ok,true);
});
test('general alternatives require different mechanisms or first moves, while controlled variants remain consistent',async()=>{
  const f=engineFixture(),input={...f.events[2].document,team:f.team,card:f.card,host:f.input.host_capabilities};
  input.routes.routes[1].differs_on=copy(input.routes.routes[0].differs_on);input.routes.routes[1].name='A more premium name';
  assert.equal((await validateExploration(input)).ok,false);
  input.card.request_verbatim='Create controlled variants and change headlines only';assert.equal((await validateExploration(input)).ok,true);
});
test('new jobs reject missing source traces/matrix; legacy policy remains honestly replayable',async()=>{
  const f=engineFixture();let r=await startJob(f.input,f.context);
  assert.equal(r.state.base.quality_policy.version,2);
  for(const event of f.events.slice(0,3))r=await send(r,event,f.context);
  const council=copy(f.council);delete council.alternative_decision;await assert.rejects(send(r,{event:'council',document:council},f.context),/alternative_decision/);
  r=await send(r,f.events[3],f.context);const production=copy(f.production);delete production.source_trace;await assert.rejects(send(r,{event:'produce',document:production},f.context),/source_trace/);
  const legacy=copy(r.state);legacy.base.quality_policy={...LEGACY_EXECUTION_QUALITY_POLICY};const resumed=await advanceJob({job_id:r.job_id,state:legacy,state_digest:await jobStateDigest(legacy),event:'produce',document:production},f.context);
  assert.equal(resumed.phase,'REVIEW');assert(resumed.warnings.some(warning=>/predates pinned source/.test(warning)));
});
test('native production is blocked before makers start; stale capabilities can refresh without rewriting past state',async()=>{
  const f=engineFixture();f.input.request=f.card.request_verbatim='Create an image ad';f.card.deliverables[0].count=6;
  // Keep this fixture a general document job but request actual raster production;
  // the native requirement must still follow the original task.
  f.input.job='write-documents';f.input.job_reason='Synthetic contract boundary test';f.card.visual_spec={references:['brand/reference.png'],fonts:['Unknown, not invented'],colors:['Unknown, not invented'],logo:'brand/logo.svg',formats:['Editorial'],format_rationale:'Use inspected brand references.',required_renderer:'synthetic'};
  f.input.host_capabilities.visual_renderers=['synthetic'];
  let r=await startJob(f.input,f.context);
  // Roster proposal is tied to the exact request; use the engine's generated ID.
  for(const event of f.events.slice(0,3)){
    if(event.event==='staff')event.document.proposal_id=r.team_proposal?.proposal_id??event.document.proposal_id;
    try{r=await send(r,event,f.context);}catch(error){if(event.event==='staff'&&/proposal_id/.test(error.message)){const {proposeTeam}=await import('../src/jobs/propose-team.mjs');event.document.proposal_id=proposeTeam({task:f.card.request_verbatim,job:'write-documents',job_card:f.card,tier:'standard',host_capabilities:f.input.host_capabilities},f.context).proposal_id;r=await send(r,event,f.context);}else throw error;}
  }
  await assert.rejects(send(r,f.events[3],f.context),/raster_generation/);
  const tools=[{id:'included-host-tools',capabilities:['raster_generation','raster_inspection','semantic_review'],available:true,billing:'INCLUDED',checked_at:new Date(Date.now()-2*60*60*1000).toISOString(),availability_receipt:'receipts/tools.json'}];
  await assert.rejects(send(r,{event:'refresh_capabilities',document:{native_tools:tools,reason:'Rechecked tools.'}},f.context),/raster_generation/);
  tools[0].checked_at=new Date().toISOString();r=await send(r,{event:'refresh_capabilities',document:{native_tools:tools,reason:'Rechecked current included host tools.'}},f.context);
  r=await send(r,f.events[3],f.context);assert.equal(r.phase,'PRODUCE');assert.equal(r.state.history.filter(event=>event.event==='refresh_capabilities').length,1);
});
