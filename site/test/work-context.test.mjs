import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {WORK_CONTEXT_SCHEMA,inferWorkMode,validateWorkContext} from '../src/jobs/work-context.mjs';
import {buildExecutionPlan,validateProductionQuality,executionQualityMethod} from '../src/jobs/execution-quality.mjs';
import {validateJobDocument} from '../src/jobs/contracts.mjs';
import {startJob,advanceJob,jobStateDigest} from '../src/jobs/engine.mjs';
import {proposeTeam} from '../src/jobs/propose-team.mjs';
import {engineFixture} from './fixtures/jobs/engine-fixture.mjs';
import {workContext} from './fixtures/jobs/work-context-fixture.mjs';
import {checkExecutionDelivery} from '../../marketplace/src/modules/directory/execution.ts';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {PublicCatalogueService} from '../src/server/public-catalogue.ts';
import {handlePublicApi} from '../src/server/public-api.ts';
import {handlePublicMcp} from '../src/server/public-mcp.ts';

const request='Improve the six existing operating documents for business owners';
const copy=structuredClone;
const send=(r,event,context)=>advanceJob({job_id:r.job_id,state:r.state,state_digest:r.state_digest,...event},context);
function fixture(){const f=engineFixture();f.card.request_verbatim=f.input.request=request;f.card.work_context=workContext();f.production.work_context=workContext(f.production.artifacts);f.team.proposal_id=proposeTeam({task:request,job:'write-documents',job_card:f.card,tier:'standard',host_capabilities:f.input.host_capabilities},f.context).proposal_id;return f;}
function retentionContext(artifacts,acceptance){const context=workContext(artifacts);context.changes=[];context.sources[0].sha256=artifacts[0].sha256;context.retention={reason:'Current synthetic native drafts already meet the accepted job.',request_review:{observation:'Compared the original request, required edits and accepted criteria with the inspected current drafts; no unresolved requested edit remains in this fixture.',receipt:'receipts/required-edit-review.json'},artifacts:artifacts.map(artifact=>({path:artifact.path,sha256:artifact.sha256,source_id:'current-work'})),criteria:artifacts.flatMap(artifact=>acceptance.map(criterion=>({id:criterion.id,artifact_path:artifact.path,artifact_sha256:artifact.sha256,status:'PASS',observation:'The exact inspected current artifact meets this accepted criterion.',receipt:'receipts/criterion-review.json'})))};return context;}

test('work context is published once and rejects malformed values safely at the shared boundary',()=>{
  assert.deepEqual(JSON.parse(fs.readFileSync(new URL('../src/jobs/schemas/work-context.json',import.meta.url),'utf8')),WORK_CONTEXT_SCHEMA);
  for(const name of ['job-card','production'])assert.deepEqual(JSON.parse(fs.readFileSync(new URL(`../src/jobs/schemas/${name}.json`,import.meta.url),'utf8')).properties.work_context,WORK_CONTEXT_SCHEMA);
  for(const value of [null,[],false,1,'context',{...workContext(),sources:[null]}, {...workContext(),changes:[false]}, {...workContext(),comparison:[]}, {...workContext(),extra:true}]){
    assert.doesNotThrow(()=>validateWorkContext(value,{request}));assert.equal(validateWorkContext(value,{request}).ok,false);
  }
  assert.equal(validateJobDocument(WORK_CONTEXT_SCHEMA.title,workContext()).ok,true);
  for(const change of [ctx=>{ctx.sources[0].currentness='UNKNOWN';},ctx=>{ctx.sources[0].currentness='STALE';},ctx=>{delete ctx.sources[0].freshness_basis;},ctx=>{ctx.sources[0].role='REFERENCE';},ctx=>{ctx.changes[0].source_ids=['unknown'];},ctx=>{ctx.mode='ASSESS';ctx.changes=[];ctx.preserve=[];}]){const ctx=workContext();change(ctx);assert.equal(validateWorkContext(ctx,{request}).ok,false);}
});

test('task interpretation preserves generic baselines without imposing ad axes on other jobs',()=>{
  assert.equal(inferWorkMode('Create an ad to increase awareness'),'CREATE');
  assert.equal(inferWorkMode('Create new ads to improve awareness'),'CREATE');
  assert.equal(inferWorkMode('Build a new onboarding tool to improve retention'),'CREATE');
  assert.equal(inferWorkMode('Create an updated version of the existing onboarding tool to improve retention'),'IMPROVE');
  assert.equal(inferWorkMode('Improve the current onboarding tool to increase retention'),'IMPROVE');
  assert.equal(inferWorkMode('Write an audit of the current data pipeline'),'ASSESS');
  assert.equal(inferWorkMode(request),'IMPROVE');
  const plan=buildExecutionPlan({request});assert.equal(plan.work_context.required,true);assert.deepEqual(plan.exploration.axes,['mechanism','evidence','tradeoff','structure']);
  assert.match(plan.work_context.principle,/retain reviewed current native artifacts unchanged/);assert.match(plan.work_context.fields.join(' '),/actual accepted criterion IDs/);
  assert.equal(buildExecutionPlan({request:'Create six documents'}).work_context.required,false);
  assert.match(executionQualityMethod(),/LOCAL_BYTES_VERIFIED_SEMANTICS_UNVERIFIED/);
});

test('fresh generic scope and production enforce current work while legacy history remains explicit',async()=>{
  const f=fixture();let r=await startJob(f.input,f.context);
  const missing=copy(f.card);delete missing.work_context;
  await assert.rejects(send(r,{event:'scope',document:missing},f.context),/work_context/);
  const stale=copy(f.card);stale.work_context.sources[0].currentness='STALE';await assert.rejects(send(r,{event:'scope',document:stale},f.context),/baseline/);
  for(const event of f.events.slice(0,4))r=await send(r,event,f.context);
  const before=copy(f.production);delete before.work_context;
  await assert.rejects(send(r,{event:'produce',document:before},f.context),/comparison.results/);
  const done=await send(r,{event:'produce',document:f.production},f.context);assert.equal(done.phase,'REVIEW');
  const legacy=await startJob(f.input,f.context);legacy.state.schema='ai-blocks-job-state/1';delete legacy.state.base.quality_policy;legacy.state_digest=await jobStateDigest(legacy.state);
  assert.equal((await send(legacy,{event:'scope',document:missing},f.context)).phase,'STAFF');
});

test('production needs current-hash observations and preserves the scoped baseline across both directory and library',()=>{
  const f=fixture(),plan=buildExecutionPlan({request,card:f.card});
  assert.equal(validateProductionQuality({document:f.production,card:f.card,team:f.team,plan}).ok,true);
  assert.equal(checkExecutionDelivery(request,f.production,f.card,f.team).ok,true);
  for(const mutate of [doc=>{delete doc.work_context;},doc=>{delete doc.work_context.comparison.results;},doc=>{doc.work_context.comparison.results[0].status='NOT_RUN';},doc=>{doc.work_context.comparison.results.forEach(row=>row.artifact_sha256='c'.repeat(64));},doc=>{doc.work_context.preserve=[];},doc=>{doc.work_context.sources[0].sha256='c'.repeat(64);}]){
    const doc=copy(f.production);mutate(doc);assert.equal(validateProductionQuality({document:doc,card:f.card,team:f.team,plan}).ok,false);assert.equal(checkExecutionDelivery(request,doc,f.card,f.team).ok,false);
  }
  // The accepted card can itself carry the observed results; production need not
  // repeat the same context prose when that record is already complete.
  const completeCard={...f.card,work_context:f.production.work_context},document=copy(f.production);delete document.work_context;
  assert.equal(validateProductionQuality({document,card:completeCard,team:f.team,plan}).ok,true);
});

test('official MCP and REST refuse the same generic baseline bypasses and publish the full contract',async t=>{
  const f=fixture(),origin='https://example.test',asset=async()=>new Response('Missing',{status:404});
  const env={PUBLIC_API_ENABLED:'true',API_ALLOWED_HOSTS:'example.test',API_READ_LIMITER:{async limit(){return {success:true};}},API_WRITE_LIMITER:{async limit(){return {success:true};}},ASSETS:{fetch:asset}};
  const original=PublicCatalogueService.prototype.jobContext;PublicCatalogueService.prototype.jobContext=async()=>f.context;t.after(()=>{PublicCatalogueService.prototype.jobContext=original;});
  const service=new PublicCatalogueService(asset,origin);service.jobContext=async()=>f.context;
  const client=new Client({name:'generic-baseline-regression',version:'1'});t.after(()=>client.close());
  await client.connect(new StreamableHTTPClientTransport(new URL(origin+'/mcp'),{fetch:(input,init)=>handlePublicMcp(new Request(input,init),service)}));
  const post=body=>handlePublicApi(new Request(origin+'/api/v1/job-events',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'192.0.2.5'},body:JSON.stringify(body)}),env);
  let r=await startJob(f.input,f.context);
  const missing=copy(f.card);delete missing.work_context;
  const args=(event,document)=>({job_id:r.job_id,state:r.state,state_digest:r.state_digest,event,document});
  let response=await post(args('scope',missing));assert.equal(response.status,400);assert.match(JSON.stringify(await response.json()),/work_context/);
  let result=await client.callTool({name:'advance_job',arguments:args('scope',missing)});assert.equal(result.isError,true);assert.match(JSON.stringify(result),/work_context/);
  for(const event of f.events.slice(0,4))r=await send(r,event,f.context);
  const bad=copy(f.production);bad.work_context.sources[0].currentness='UNKNOWN';
  response=await post(args('produce',bad));assert.equal(response.status,400);assert.match(JSON.stringify(await response.json()),/baseline/);
  result=await client.callTool({name:'advance_job',arguments:args('produce',bad)});assert.equal(result.isError,true);
  response=await post(args('produce',f.production));assert.equal(response.status,200);assert.equal((await response.json()).phase,'REVIEW');
  result=await client.callTool({name:'advance_job',arguments:args('produce',f.production)});assert.notEqual(result.isError,true);assert.equal(result.structuredContent.phase,'REVIEW');
  response=await handlePublicApi(new Request(origin+'/api/v1/schemas/ai-blocks-work-context/1.json',{headers:{'cf-connecting-ip':'192.0.2.5'}}),env);assert.equal(response.status,200);assert.deepEqual(await response.json(),WORK_CONTEXT_SCHEMA);
});

test('retention passes the same exact artifacts and real criteria through engine, directory, REST and MCP',async t=>{
  const f=fixture();f.production.work_context=retentionContext(f.production.artifacts,f.card.acceptance);f.card.work_context=copy(f.production.work_context);
  f.card.work_context.retention.criteria.forEach(row=>{row.status='NOT_RUN';});
  const asset=async()=>new Response('Missing',{status:404}),origin='https://example.test';
  const env={PUBLIC_API_ENABLED:'true',API_ALLOWED_HOSTS:'example.test',API_READ_LIMITER:{async limit(){return {success:true};}},API_WRITE_LIMITER:{async limit(){return {success:true};}},ASSETS:{fetch:asset}};
  const original=PublicCatalogueService.prototype.jobContext;PublicCatalogueService.prototype.jobContext=async()=>f.context;t.after(()=>{PublicCatalogueService.prototype.jobContext=original;});
  let r=await startJob(f.input,f.context);for(const event of f.events.slice(0,4))r=await send(r,event,f.context);
  assert.equal(checkExecutionDelivery(request,f.production,f.card,f.team).ok,true);
  assert.equal((await send(r,{event:'produce',document:f.production},f.context)).phase,'REVIEW');
  const args=document=>({job_id:r.job_id,state:r.state,state_digest:r.state_digest,event:'produce',document});
  const post=document=>handlePublicApi(new Request(origin+'/api/v1/job-events',{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'192.0.2.5'},body:JSON.stringify(args(document))}),env);
  const service=new PublicCatalogueService(asset,origin),client=new Client({name:'retention-boundary-regression',version:'1'});t.after(()=>client.close());
  await client.connect(new StreamableHTTPClientTransport(new URL(origin+'/mcp'),{fetch:(input,init)=>handlePublicMcp(new Request(input,init),service)}));
  const bad=copy(f.production);bad.work_context.retention.criteria[0].id='invented';
  assert.equal((await post(bad)).status,400);
  assert.equal((await client.callTool({name:'advance_job',arguments:args(bad)})).isError,true);
  assert.equal((await post(f.production)).status,200);
  assert.notEqual((await client.callTool({name:'advance_job',arguments:args(f.production)})).isError,true);
  const schema=await handlePublicApi(new Request(origin+'/api/v1/schemas/ai-blocks-work-context/1.json',{headers:{'cf-connecting-ip':'192.0.2.5'}}),env);
  assert.deepEqual((await schema.json()).properties.retention,WORK_CONTEXT_SCHEMA.properties.retention);
});
