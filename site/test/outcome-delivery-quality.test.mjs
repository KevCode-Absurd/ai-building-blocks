import test from 'node:test';
import assert from 'node:assert/strict';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {callOutcomeTool} from '../src/outcomes/outcome-mcp.mjs';
import {checkEngagement, engagementDigest, stageDeliveryRequirements} from '../src/outcomes/engagement.mjs';
import {LANDING_PAGE_CHECKS} from '../src/jobs/landing-page-delivery.mjs';
import {handlePublicApi} from '../src/server/public-api.ts';
import {handlePublicMcp} from '../src/server/public-mcp.ts';
import {PublicCatalogueService} from '../src/server/public-catalogue.ts';
import {workContext} from './fixtures/jobs/work-context-fixture.mjs';

// Synthetic host records exercise contract enforcement, not real browser quality.
const copy = value => structuredClone(value), sha = 'a'.repeat(64), old = 'b'.repeat(64);
const origin = 'https://example.test', asset = async () => new Response('Missing', {status:404});
const env = {PUBLIC_API_ENABLED:'true',API_ALLOWED_HOSTS:'example.test',API_READ_LIMITER:{async limit(){return {success:true};}},API_WRITE_LIMITER:{async limit(){return {success:true};}},ASSETS:{fetch:asset}};
const post = (route,body) => new Request(origin+route,{method:'POST',headers:{'content-type':'application/json','cf-connecting-ip':'192.0.2.5'},body:JSON.stringify(body)});
const args = (r,event) => ({engagement:r.engagement,engagement_sha256:r.engagement_sha256,event});
const step = (r,event) => callOutcomeTool('advance_outcome',args(r,event));

test('generic improvement completion requires a current baseline and observed results through MCP and REST',async t=>{
  const r=await ready({request:'Improve the existing operating documents',goal:'Revise the operating documents',format:'md',extension:'md'});
  const event=completion(r);delete event.landing_page_delivery;event.production_artifacts.forEach(artifact=>{artifact.modality='doc';artifact.kind='document';});
  assert.equal(r.ready.find(stage=>stage.stage_id==='build').delivery_requirements.work_context_required,true);
  await assert.rejects(step(r,event),/work_context/);
  let response=await handlePublicApi(post('/api/v1/outcome-steps',args(r,event)),env);assert.equal(response.status,400);assert.match(JSON.stringify(await response.json()),/work_context/);
  const service=new PublicCatalogueService(asset,origin),client=new Client({name:'outcome-baseline-regression',version:'1'});t.after(()=>client.close());
  await client.connect(new StreamableHTTPClientTransport(new URL(origin+'/mcp'),{fetch:(input,init)=>handlePublicMcp(new Request(input,init),service)}));
  let result=await client.callTool({name:'advance_outcome',arguments:args(r,event)});assert.equal(result.isError,true);assert.match(JSON.stringify(result),/work_context/);
  event.work_context=workContext(event.production_artifacts);event.work_context.sources[0].currentness='UNKNOWN';await assert.rejects(step(r,event),/baseline/);
  event.work_context.sources[0].currentness='CURRENT';const stale=copy(event);stale.work_context.comparison.results[0].artifact_sha256=old;await assert.rejects(step(r,stale),/current production hashes|SHA-256/);
  response=await handlePublicApi(post('/api/v1/outcome-steps',args(r,event)),env);assert.equal(response.status,200,JSON.stringify(await response.json()));
  result=await client.callTool({name:'advance_outcome',arguments:args(r,event)});assert.notEqual(result.isError,true);
  const done=await step(r,event);assert.equal(done.engagement.stages.find(stage=>stage.id==='build').state,'AWAITING_APPROVAL');assert.equal(checkEngagement(done.engagement).schema,'ai-blocks-outcome-engagement/3');
});

test('baseline contract follows final existing-work scope without forcing unrelated intermediate copy or concepts',async()=>{
  for(const [request,goal,expected]of [
    ['Improve the existing data process','Diagnose and audit the current process',true],
    ['Improve the existing website','Create preliminary visual concepts',false],
    ['Improve the existing website','Write supporting headline copy',false],
    ['Improve the existing email copy','Write the final email copy',true],
    ['Write an audit of the current service','Produce the audit report',true],
    ['Create an ad campaign to increase awareness','Create ad concepts',false],
  ]){const r=await ready({request,goal,format:'md',extension:'md'});assert.equal(r.ready.find(stage=>stage.stage_id==='build').delivery_requirements.work_context_required,expected,`${request}: ${goal}`);}
});

async function ready({request='Build two launchable product landing pages on our existing website',goal='Build two product landing pages using the existing components',format='source',extension='zip',extraImages=false,bundleCount}={}) {
  let r = await callOutcomeTool('start_outcome',{request,started:'2026-11-08',engagement_id:'synthetic-pages'});
  r = await step(r,{type:'brief',brief:{outcome:request,deliverable:request,done:['Two usable outputs meet the accepted request.'],data_home:'private-test-project',decides:'Owner'}});
  const research = {approach:'Inspect existing site and extend its components.',sources:[{id:'owner',kind:'owner',title:'Accepted request',ref:'BRIEF.md'},{id:'site',kind:'web',title:'Existing website',ref:origin,date:'2026-11-08'}],steps:[{id:'scope',name:'Inspect site and context',why:'Retain the working integration.',sources:['owner','site']},{id:'build',name:'Build and test outputs',why:'Deliver working source rather than screenshots.',sources:['owner','site']}],pitfalls:[]};
  const stage = (id,kind,name,goal,depends_on,outputs,from_steps=[],gate='none') => ({id,kind,name,goal,depends_on,outputs,from_steps,owner:{gap:'Synthetic fixture role'},checks:kind==='intake'?[]:[{id:'verified',name:'Check the actual output',required:true}],gate});
  const plan = {name:'Synthetic site implementation',stages:[
    stage('intake','intake','Scope','Agree the job',[],[],['scope']),
    stage('decision','decision','Choose route','Choose a route',['intake'],[{id:'choice',name:'Decision',format:'md',path:'choice.md'}],[],'approve'),
    stage('build','production',goal,goal,['decision'],bundleCount?[{id:'images',name:'Finished output set',format:'zip',path:'deliverables/images.zip',count:bundleCount}]:[...[1,2].map(n=>({id:`page-${n}`,name:`${/landing[ -]?page/i.test(request)?'Product landing page':/\b(?:ads?|creatives?|advertising)\b/i.test(request)?'Ad image':'Deliverable'} ${n}`,format,path:`pages/product-${n}.${extension}`})),...(extraImages?[1,2].map(n=>({id:`ad-${n}`,name:`Static image ad ${n}`,format:'png',path:`ads/image-${n}.png`})) :[])],['build'],'review'),
    stage('learning','learning','Learn','Record owner acceptance',['build'],[{id:'learning',name:'Learning',format:'md',path:'learning.md'}]),
  ]};
  r = await step(r,{type:'plan',research,plan});
  r = await step(r,{type:'approve_plan',by:'owner',decision:'APPROVED'});
  r = await callOutcomeTool('record_outcome_decision',{engagement:r.engagement,engagement_sha256:r.engagement_sha256,decision:{id:'route',stage_id:'decision',by:'owner',considered:[{id:'reuse',summary:'Reuse existing website'}],chosen:['reuse']}});
  r = await step(r,{type:'complete',stage_id:'decision',outputs:[{id:'choice'}],checks:[{id:'verified',result:'PASS'}]});
  return step(r,{type:'approve',stage_id:'decision',by:'owner',decision:'APPROVED'});
}

function adCompletion(r){
  const event=completion(r);delete event.landing_page_delivery;
  event.outputs.forEach((output,n)=>{output.sha256=String(n+1).repeat(64);});
  event.production_artifacts=event.outputs.map(output=>({slot_id:output.id,path:output.path,sha256:output.sha256,modality:'image',kind:'image-ad'}));
  event.visual_delivery={schema:'ai-blocks-visual-delivery/1',renderer:'synthetic-image-renderer',receipt:'receipts/generation.json',reviewer_id:'independent-reviewer',references:['brand/source-product.jpg','brand/logo.svg'],items:event.outputs.map((output,n)=>({slot_id:output.id,sha256:output.sha256,maker_id:`maker-${n+1}`,status:'PASS',reference_comparison:'Compared the product shape and real logo against supplied references.',spec_comparison:'Checked exact copy and the static format against the accepted brief.',checks:['brand','product_fidelity','claims_copy','format'].map(id=>({id,status:'PASS',receipt:`receipts/${output.id}-${id}.json`,observed:`Observed ${id} in this synthetic current image.`})),compared_with:event.outputs.filter(other=>other.id!==output.id).map(other=>other.id),observed_differences:[{axis:'promise',observation:'Different buyer argument demonstrated in the image.'},{axis:'composition',observation:'Different hierarchy and placement of the product and copy.'}]}))};
  return event;
}

function completion(r) {
  const outputs = r.engagement.plan.stages.find(s=>s.id==='build').outputs.map(o=>({id:o.id,path:o.path,sha256:sha}));
  return {type:'complete',stage_id:'build',outputs,checks:[{id:'verified',result:'PASS'}],production_artifacts:outputs.map(o=>({slot_id:o.id,path:o.path,sha256:o.sha256,modality:'interactive',kind:'landing-page'})),landing_page_delivery:{schema:'ai-blocks-landing-page-delivery/1',mode:'LAUNCHABLE_SITE',artifacts:outputs.map(o=>({
    slot_id:o.id,source:{path:o.path,sha256:sha,entrypoint:`src/${o.id}.tsx`,build_command:'npm run build',preview_command:'npm run preview'},
    existing_site:{status:'ADAPTED',url:origin,evidence:'receipts/site.json',rationale:'Keep the existing design system and working commerce controls.',integration_target:`src/${o.id}.tsx`,reused_components:['Header','ProductPicker','brand.css']},
    brand:{brain_ref:'brand/00-start-here.md',font_refs:['brand/fonts.css'],asset_refs:['brand/logo.svg'],evidence:'receipts/brand.json'},
    checks:[...LANDING_PAGE_CHECKS.map(id=>({id,status:'PASS',source_sha256:sha,receipt:`receipts/${o.id}-${id}.json`,observed:`Observed ${id} on the current test fixture.`,...(id==='responsive'?{viewport:{width:390,height:844}}:{})})),{id:'responsive',status:'PASS',source_sha256:sha,receipt:`receipts/${o.id}-desktop.json`,observed:'Checked desktop layout.',viewport:{width:1440,height:900}}],limitations:[],
  }))}};
}

test('fresh outcomes expose the same launchable contract and preserve independent owner approval',async()=>{
  const r=await ready();
  assert.equal(r.engagement.schema,'ai-blocks-outcome-engagement/3');
  assert.equal(r.engagement.quality_policy.version,1);
  const build=r.ready.find(s=>s.stage_id==='build');
  assert.equal(build.delivery_requirements.required,true);
  assert.match(build.prompt,/production_artifacts/);
  assert.match(build.job_handoff.args.request,/launchable landing-page source/);
  const done=await step(r,completion(r));
  assert.equal(done.engagement.stages.find(s=>s.id==='build').state,'AWAITING_APPROVAL');
  assert.equal(done.review.independently_verified,false);
  assert.equal(done.review.grants_execution_authority,false);
});

test('high-level PASS and a screenshot cannot bypass launch readiness through direct, REST or MCP calls',async t=>{
  const r=await ready(), event=completion(r);
  delete event.production_artifacts; delete event.landing_page_delivery;
  await assert.rejects(step(r,event),/production_artifacts/);
  const response=await handlePublicApi(post('/api/v1/outcome-steps',args(r,event)),env);
  assert.equal(response.status,400);assert.match(JSON.stringify(await response.json()),/production_artifacts/);
  const service=new PublicCatalogueService(asset,origin), client=new Client({name:'outcome-readiness-regression',version:'1'});
  t.after(()=>client.close());
  await client.connect(new StreamableHTTPClientTransport(new URL(origin+'/mcp'),{fetch:(input,init)=>handlePublicMcp(new Request(input,init),service)}));
  const result=await client.callTool({name:'advance_outcome',arguments:args(r,event)});
  assert.equal(result.isError,true);assert.match(JSON.stringify(result),/production_artifacts/);
  const mockup=completion(r);mockup.production_artifacts[0].modality='image';mockup.landing_page_delivery.artifacts[0].source.entrypoint='image.png';
  await assert.rejects(step(r,mockup),/interactive|raster|entrypoint/);
});

test('every source output needs current readiness evidence; stale checks and untested actions fail',async()=>{
  const r=await ready();
  for(const mutate of [
    e=>{e.production_artifacts.pop();e.landing_page_delivery.artifacts.pop();},
    e=>{e.production_artifacts[0].sha256=old;},
    e=>{e.landing_page_delivery.artifacts[0].checks[0].source_sha256=old;},
    e=>{e.landing_page_delivery.artifacts[0].checks.find(c=>c.id==='primary_action').status='NOT_RUN';},
    e=>{e.landing_page_delivery.mode='DESIGN_REFERENCE';},
  ]){const event=completion(r);mutate(event);await assert.rejects(step(r,event),/readiness|match|launchable|source|working/);}
  const good=await step(r,completion(r)), tampered=copy(good.engagement);
  tampered.stages.find(s=>s.id==='build').outputs[0].sha256=old;
  assert.throws(()=>checkEngagement(tampered),/current SHA-256/);
  const noPolicy=copy(r.engagement);delete noPolicy.quality_policy;
  assert.throws(()=>checkEngagement(noPolicy),/unchanged execution quality policy/);
});

test('copy and explicit mockup requests remain scoped without being described as launchable',async()=>{
  const copyOnly=await ready({request:'Write landing page copy only',goal:'Write landing page copy and audit the draft',format:'md',extension:'md'});
  const copyDef=copyOnly.engagement.plan.stages.find(s=>s.id==='build');
  assert.equal(stageDeliveryRequirements(copyOnly.engagement,copyDef).required,false);
  const event={type:'complete',stage_id:'build',outputs:copyDef.outputs.map(o=>({id:o.id})),checks:[{id:'verified',result:'PASS'}]};
  assert.equal((await step(copyOnly,event)).engagement.stages.find(s=>s.id==='build').state,'AWAITING_APPROVAL');
  const mockup=await ready({request:'Create two image-only landing page design mockups',goal:'Create two landing page mockups',format:'png',extension:'png'});
  assert.equal(mockup.ready.find(s=>s.stage_id==='build').delivery_requirements.delivery_mode,'DESIGN_REFERENCE');
  assert.equal(mockup.ready.find(s=>s.stage_id==='build').delivery_requirements.required,false);
});

test('legacy engagements remain resumable and explicitly carry structural-only assurance',async()=>{
  const r=await ready(), legacy=copy(r.engagement);
  legacy.schema='ai-blocks-outcome-engagement/2';delete legacy.quality_policy;
  const def=legacy.plan.stages.find(s=>s.id==='build');
  assert.equal(stageDeliveryRequirements(legacy,def).assurance,'LEGACY_STRUCTURAL_ONLY');
  const done=await callOutcomeTool('advance_outcome',{engagement:legacy,engagement_sha256:await engagementDigest(legacy),event:{type:'complete',stage_id:'build',outputs:def.outputs.map(o=>({id:o.id})),checks:[{id:'verified',result:'PASS'}]}});
  assert.equal(done.engagement.schema,'ai-blocks-outcome-engagement/2');
  assert.equal(done.engagement.stages.find(s=>s.id==='build').state,'AWAITING_APPROVAL');
});

test('static ad production requires actual image inspection on direct, REST and MCP paths',async t=>{
  const r=await ready({request:'Create two static image ads for my campaign',goal:'Render two static image ads with distinct arguments',format:'png',extension:'png'});
  assert.equal(r.ready.find(s=>s.stage_id==='build').delivery_requirements.image_required,true);
  const event=adCompletion(r), missing=copy(event);delete missing.visual_delivery;
  await assert.rejects(step(r,missing),/visual_delivery/);
  const response=await handlePublicApi(post('/api/v1/outcome-steps',args(r,missing)),env);
  assert.equal(response.status,400);assert.match(JSON.stringify(await response.json()),/visual_delivery/);
  const service=new PublicCatalogueService(asset,origin),client=new Client({name:'image-readiness-regression',version:'1'});t.after(()=>client.close());
  await client.connect(new StreamableHTTPClientTransport(new URL(origin+'/mcp'),{fetch:(input,init)=>handlePublicMcp(new Request(input,init),service)}));
  const result=await client.callTool({name:'advance_outcome',arguments:args(r,missing)});
  assert.equal(result.isError,true);assert.match(JSON.stringify(result),/visual_delivery/);
  assert.equal((await step(r,event)).engagement.stages.find(s=>s.id==='build').state,'AWAITING_APPROVAL');
});

test('image review rejects self-judging, stale evidence, failed fidelity and identical images despite PASS',async()=>{
  const r=await ready({request:'Create two static image ads',goal:'Render two static image ads',format:'png',extension:'png'});
  for(const mutate of [
    e=>{e.visual_delivery.reviewer_id=e.visual_delivery.items[0].maker_id;},
    e=>{e.visual_delivery.items[0].sha256=old;},
    e=>{e.visual_delivery.items[0].checks.find(c=>c.id==='product_fidelity').status='FAIL';},
    e=>{e.visual_delivery.items[0].observed_differences=[{axis:'visual_world',observation:'New name.'}];},
    e=>{e.outputs[1].sha256=e.outputs[0].sha256;e.production_artifacts[1].sha256=e.outputs[0].sha256;e.visual_delivery.items[1].sha256=e.outputs[0].sha256;},
  ]){const event=adCompletion(r);mutate(event);await assert.rejects(step(r,event),/inspection|reviewer|current|fidelity|differences|duplicate|identical/);}
  const done=await step(r,adCompletion(r)),tampered=copy(done.engagement);
  tampered.stages.find(s=>s.id==='build').visual_delivery.items[0].checks[0].status='NOT_RUN';
  assert.throws(()=>checkEngagement(tampered),/inspection failed/);
});

test('mixed image and launchable page delivery checks both current artifact sets',async()=>{
  const r=await ready({request:'Build two launchable landing pages and two static image ads on our existing website',goal:'Build two landing pages and render two static image ads',extraImages:true});
  const event=completion(r),visual=adCompletion(r);
  event.production_artifacts=event.production_artifacts.filter(a=>a.slot_id.startsWith('page-')).concat(visual.production_artifacts.filter(a=>a.slot_id.startsWith('ad-')));
  event.outputs.forEach(output=>{if(output.id.startsWith('ad-'))output.sha256=visual.outputs.find(a=>a.id===output.id).sha256;});
  event.landing_page_delivery.artifacts=event.landing_page_delivery.artifacts.filter(a=>a.slot_id.startsWith('page-'));
  event.visual_delivery=visual.visual_delivery;
  event.visual_delivery.items=event.visual_delivery.items.filter(a=>a.slot_id.startsWith('ad-')).map(a=>({...a,compared_with:a.compared_with.filter(id=>id.startsWith('ad-'))}));
  assert.equal((await step(r,event)).engagement.stages.find(s=>s.id==='build').state,'AWAITING_APPROVAL');
  const missing=copy(event);missing.production_artifacts=missing.production_artifacts.filter(a=>a.slot_id.startsWith('page-'));
  await assert.rejects(step(r,missing),/every declared page source|static image/);
});

test('a final image review keeps inspection requirements while copy and concept stages stay intermediate',async()=>{
  for(const [goal,format,extension,required] of [
    ['Render two static image ads and review the final images','png','png',true],
    ['Produce final campaign assets','zip','zip',true],
    ['Write ad copy for two static image ads','md','md',false],
    ['Plan two static image ad concepts','png','png',false],
    ['Audit the existing static image ads','md','md',false],
  ]){
    const r=await ready({request:'Create two static image ads',goal,format,extension});
    assert.equal(r.ready.find(s=>s.stage_id==='build').delivery_requirements.image_required,required,goal);
  }
});

test('a 25-image container keeps its own output hash and requires 25 child inspections',async()=>{
  const r=await ready({request:'Create 25 static image ads',goal:'Render 25 static image ads',bundleCount:25});
  const event=adCompletion(r),parent=event.outputs[0];
  const first=event.visual_delivery.items[0];
  event.production_artifacts=Array.from({length:25},(_,n)=>({slot_id:`image-${n+1}`,path:`images/ad-${n+1}.png`,sha256:(n+1).toString(16).padStart(64,'0'),modality:'image',kind:'image-ad',output_id:parent.id,container_sha256:parent.sha256}));
  event.visual_delivery.items=event.production_artifacts.map((a,n)=>({...copy(first),slot_id:a.slot_id,sha256:a.sha256,compared_with:[`image-${(n+1)%25+1}`]}));
  const done=await step(r,event);
  assert.equal(done.engagement.stages.find(s=>s.id==='build').production_artifacts.length,25);
  assert.equal(done.engagement.stages.find(s=>s.id==='build').outputs.length,1);
  for(const mutate of [
    e=>{e.production_artifacts.pop();e.visual_delivery.items.pop();},
    e=>{e.production_artifacts[0].container_sha256=old;},
    e=>{e.production_artifacts[0].path='../outside.png';},
    e=>{e.production_artifacts=[{slot_id:parent.id,path:parent.path,sha256:parent.sha256,modality:'image',kind:'image-ad'}];},
  ]){const bad=copy(event);mutate(bad);await assert.rejects(step(r,bad),/manifest/);}
});
