import {test} from 'node:test';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {executionPlan,checkExecutionDelivery,qualityMethodMarkdown} from '../src/modules/directory/execution.ts';
import {trimmedSeatPack} from '../src/modules/mcp/team-seats.ts';
import {buildPack} from '../src/modules/packs/build.ts';
import {TOOLS} from '../src/modules/mcp/tools.ts';
import {testEnv} from './helpers.ts';
import {NOVA} from './fixtures.ts';
import {engineFixture} from '../../site/test/fixtures/jobs/engine-fixture.mjs';
import {workContext} from '../../site/test/fixtures/jobs/work-context-fixture.mjs';
import {visualDelivery} from '../../site/test/fixtures/jobs/visual-delivery-fixture.mjs';
import {pkceChallenge} from '../src/modules/mcp/oauth.ts';

test('marketplace and downloaded seats use the shared task and quality contract',()=>{
  const plan=executionPlan('Improve the existing onboarding flow without changing authentication');
  assert.equal(plan.schema,'ai-blocks-execution-plan/1');
  assert.equal(plan.execution.hosted,false);
  assert.equal(plan.retrieval.source,'AI_BLOCKS');
  assert.equal(plan.retrieval.dump_entire_library_into_context,false);
  const seat=trimmedSeatPack(null,{seat_type:'coordinator',role_id:'general-coordinator'},'','',[]);
  assert.equal(seat.files['QUALITY-METHOD.md'],qualityMethodMarkdown());
  assert(seat.bytes<=60_000);
});

test('every downloadable agent and training pack includes the shared quality method',async()=>{
  for(const kind of ['agent','train'] as const){
    const pack=await buildPack({persona:NOVA,role:null,kit:null,jobTypes:[],options:{kind,version:'test',updated:'2026-11-08'}});
    assert.equal(pack.files.find(file=>file.path==='QUALITY-METHOD.md')?.content,qualityMethodMarkdown());
    assert(pack.manifest.files.some(file=>file.path==='QUALITY-METHOD.md'));
  }
});

test('read-only MCP planning and delivery checks are available without hosted jobs',async()=>{
  const planTool=TOOLS.find(tool=>tool.name==='get_execution_plan')!;
  const checkTool=TOOLS.find(tool=>tool.name==='check_execution_delivery')!;
  for(const tool of [planTool,checkTool]){assert.equal(tool.scope,'marketplace:read');assert.equal(tool.costly,false);assert.equal(tool.hosted,undefined);assert.equal(tool.annotations.readOnlyHint,true);}
  const result=await planTool.run({} as never,{request:'Build five landing pages on the existing store'});
  assert.equal((result.data.landing_pages as {delivery_mode:string}).delivery_mode,'LAUNCHABLE_SITE');
  const invalid=await checkTool.run({} as never,{request:'Build five landing pages',production:{artifacts:[]},job_card:{},team:{}});
  assert.equal(invalid.data.ok,false);assert.equal(invalid.data.hosted_execution,false);assert.equal(invalid.data.model_calls,0);
});

test('REST and MCP preflight actual host tools without spending, starting jobs or accepting command payloads',async()=>{
  const t=await testEnv({HOSTED_JOBS:'off'}),request='Build a working landing page';
  const tool=TOOLS.find(tool=>tool.name==='get_execution_plan')!;
  const inventory=[{id:'host-local-tools',capabilities:['source_edit','project_build','browser_preview','semantic_review'],available:true,checked_at:new Date().toISOString(),availability_receipt:'receipts/host-tools.json',billing:'LOCAL'}];
  const before=(await t.sql('SELECT COUNT(*) AS n FROM jobs'))[0].n;
  const blocked=await t.api('POST','/api/execution-plan',{body:{request}});assert.equal(blocked.body.native_preflight.status,'BLOCKED');
  const ready=await t.api('POST','/api/execution-plan',{body:{request,host_tools:inventory}});assert.equal(ready.status,200);assert.equal(ready.body.native_preflight.status,'READY_FOR_HOST_EXECUTION');assert.equal(ready.body.native_preflight.model_calls,0);
  const mcp=await tool.run({} as never,{request,host_tools:inventory});assert.equal((mcp.data.native_preflight as {status:string}).status,'READY_FOR_HOST_EXECUTION');
  const paid=await t.api('POST','/api/execution-plan',{body:{request,host_tools:inventory.map(entry=>({...entry,billing:'PAID'}))}});assert.equal(paid.body.native_preflight.status,'BLOCKED');assert.equal(paid.body.execution.hosted,false);
  for(const host_tools of [[{...inventory[0],command:'do anything'}],Array(31).fill(inventory[0]),[{...inventory[0],capabilities:['anything']}],{}])assert.equal((await t.api('POST','/api/execution-plan',{body:{request,host_tools}})).status,400);
  assert.equal((await t.sql('SELECT COUNT(*) AS n FROM jobs'))[0].n,before);
});

test('public marketplace API shares the plan and rejects incomplete delivery without starting a run',async()=>{
  const t=await testEnv({HOSTED_JOBS:'off'});
  const before=(await t.sql('SELECT COUNT(*) AS n FROM jobs'))[0].n;
  const plan=await t.api('POST','/api/execution-plan',{body:{request:'Improve the existing product page',tier:'standard'}});
  assert.equal(plan.status,200);assert.equal(plan.body.schema,'ai-blocks-execution-plan/1');assert.equal(plan.body.execution.hosted,false);assert.equal(plan.res.headers.get('cache-control'),'no-store');
  const checked=await t.api('POST','/api/execution-check',{body:{request:'Build a landing page',production:{artifacts:[]},job_card:{},team:{}}});
  assert.equal(checked.status,200);assert.equal(checked.body.ok,false);assert(checked.body.errors.length);assert.equal(checked.body.stored_by_service,false);
  assert.equal((await t.sql('SELECT COUNT(*) AS n FROM jobs'))[0].n,before);
  assert.equal((await t.api('POST','/api/execution-plan',{body:{request:'x',tier:'unbounded'}})).status,400);
  assert.equal((await t.api('POST','/api/execution-plan',{body:{request:'x',publish:true}})).status,400);
});

test('shared marketplace check cannot promote a page image to launchable source',()=>{
  const fixtures=JSON.parse(readFileSync(new URL('../../site/test/fixtures/jobs/contracts.json',import.meta.url),'utf8'));
  const production=structuredClone(fixtures.find((group:any)=>group.schema==='ai-blocks-production/1').valid[0].document);
  for(const artifact of production.artifacts){artifact.kind='landing-page';artifact.modality='image';}
  production.landing_page_delivery={schema:'ai-blocks-landing-page-delivery/1',mode:'DESIGN_REFERENCE',artifacts:[]};
  const result=checkExecutionDelivery('Build a working landing page',production,{},{seats:[]});
  assert.equal(result.ok,false);
  assert(result.errors.some(error=>/working landing page|Required check/.test(error.message)));
  assert.equal(result.assurance,'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED');
  assert.equal(checkExecutionDelivery('Make a report',{schema:'ai-blocks-production/1',artifacts:[null]},{},{}).ok,false);
});

test('marketplace MCP and REST apply the same generic existing-work evidence gate',async()=>{
  const t=await testEnv({HOSTED_JOBS:'off'}),f=engineFixture(),request='Improve the existing operating documents';
  f.card.request_verbatim=request;f.card.work_context=workContext();f.production.work_context=workContext(f.production.artifacts);
  const tool=TOOLS.find(tool=>tool.name==='check_execution_delivery')!;
  const args={request,production:f.production,job_card:f.card,team:f.team};
  let response=await t.api('POST','/api/execution-check',{body:args});assert.equal(response.status,200);assert.equal(response.body.ok,true);
  let checked=await tool.run({} as never,args);assert.equal(checked.data.ok,true);
  f.production.work_context.sources[0].currentness='UNKNOWN';
  response=await t.api('POST','/api/execution-check',{body:args});assert.equal(response.status,200);assert.equal(response.body.ok,false);assert(response.body.errors.some((error:{message:string})=>/baseline/.test(error.message)));
  checked=await tool.run({} as never,args);assert.equal(checked.data.ok,false);assert.equal(checked.data.hosted_execution,false);assert.equal(checked.data.model_calls,0);
});

test('single-image readiness cannot be bypassed through marketplace REST or authenticated MCP',async()=>{
  const t=await testEnv({HOSTED_JOBS:'off'}),redirect='https://claude.ai/api/mcp/auth_callback';
  const registration=await t.api('POST','/oauth/register',{body:{client_name:'Image contract test',redirect_uris:[redirect]}});
  const verifier=Buffer.from(crypto.getRandomValues(new Uint8Array(48))).toString('base64url');
  const query=new URLSearchParams({response_type:'code',client_id:registration.body.client_id,redirect_uri:redirect,code_challenge:await pkceChallenge(verifier),code_challenge_method:'S256',state:'image-test'});
  const auth=await t.api('GET',`/oauth/authorize?${query}`),requestId=new URL(auth.res.headers.get('location')!).searchParams.get('request');
  const consent=await t.api('POST','/api/oauth/approve',{user:'user_buyer',body:{request_id:requestId,approve:true,allow_order:false}});
  const code=new URL(consent.body.redirect_url).searchParams.get('code');
  const token=await t.api('POST','/oauth/token',{body:{grant_type:'authorization_code',code,client_id:registration.body.client_id,redirect_uri:redirect,code_verifier:verifier}});assert.equal(token.status,200);
  const f=engineFixture();f.production.artifacts=f.production.artifacts.slice(0,1);f.production.artifacts[0].modality='image';f.production.artifacts[0].path='ads/image.png';f.production.visual_delivery=visualDelivery(f.production.artifacts);
  // The changed synthetic output needs a corresponding current trace revision.
  for(const method of f.production.source_trace.methods)method.execution.artifacts=f.production.artifacts.map((artifact:any)=>({path:artifact.path,sha256:artifact.sha256}));
  const baseline=structuredClone(f.production);let rpcId=0;
  for(const [label,mutate,expected]of [
    ['missing renderer and inspection',(p:any)=>{delete p.visual_delivery;},false],
    ['ZIP labelled image',(p:any)=>{p.artifacts[0].path='not-an-image.zip';},false],
    ['stale inspection',(p:any)=>{p.visual_delivery.items[0].sha256='b'.repeat(64);},false],
    ['self review',(p:any)=>{p.visual_delivery.reviewer_id=p.artifacts[0].maker_seat;},false],
    ['failed fidelity',(p:any)=>{p.visual_delivery.items[0].checks[1].status='FAIL';},false],
    ['text substitute',(p:any)=>{p.artifacts[0].modality='text';p.artifacts[0].path='brief.md';delete p.visual_delivery;},false],
    ['current inspected raster',(_p:any)=>{},true],
  ] as const){
    const production=structuredClone(baseline);mutate(production);const args={request:'Create an image ad',production,job_card:{},team:f.team};
    const response=await t.api('POST','/api/execution-check',{body:args});assert.equal(response.status,200,label);assert.equal(response.body.ok,expected,label);
    const rpc=await t.api('POST','/mcp',{headers:{authorization:`Bearer ${token.body.access_token}`,accept:'application/json, text/event-stream'},body:{jsonrpc:'2.0',id:++rpcId,method:'tools/call',params:{name:'check_execution_delivery',arguments:args}}});
    assert.equal(rpc.status,200,JSON.stringify(rpc.body));assert.equal(rpc.body.result?.structuredContent?.ok,expected,`${label}: ${JSON.stringify(rpc.body)}`);
  }
  const text=structuredClone(baseline);text.artifacts[0].modality='text';text.artifacts[0].path='brief.md';delete text.visual_delivery;
  for(const method of text.source_trace.methods)method.execution.artifacts=text.artifacts.map((artifact:any)=>({path:artifact.path,sha256:artifact.sha256}));
  for(const request of ['Write image-ad copy','Create image-ad concepts','Prepare an ad creative brief'])assert.equal(checkExecutionDelivery(request,text,{},f.team).ok,true,request);
});
