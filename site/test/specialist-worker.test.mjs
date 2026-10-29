import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {specialistFiles} from '../src/roles/specialist-worker.mjs';
import {rankSpecialists} from '../src/roles/specialist-matching.mjs';
import {PublicCatalogueService} from '../src/server/public-catalogue.ts';
import {handlePublicApi} from '../src/server/public-api.ts';
const read=p=>fs.readFileSync(new URL('../public'+p,import.meta.url)),index=JSON.parse(read('/data/roles-index.json'));
const asset=async p=>{try{return new Response(read(p));}catch{return new Response('Missing',{status:404});}};
const service=()=>new PublicCatalogueService(asset,'https://example.test');
const env={PUBLIC_API_ENABLED:'true',API_ALLOWED_HOSTS:'example.test',API_READ_LIMITER:{async limit(){return {success:true};}},API_WRITE_LIMITER:{async limit(){return {success:true};}},ASSETS:{fetch:r=>asset(new URL(r.url).pathname)}};
const request=(url,body)=>new Request('https://example.test'+url,{method:body?'POST':'GET',headers:{'cf-connecting-ip':'192.0.2.10',...(body?{'content-type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});

test('task retrieval chooses complete remits for broad jobs, exposes alternatives and leaves unrelated requests unmatched',()=>{
 for(const [task,id] of [['Launch a Meta advertising campaign','media-buyer'],['Diagnose a bug in my codebase','fix-a-bug-with-proof-and-a-clear-pull-request'],['Build a landing page','build-a-landing-page-fix-it-and-prove-the-top-change'],['Prepare my executive day and meetings','executive-assistant'],['Audit technical SEO and indexing','seo-specialist'],['Draft replies to customer support tickets','customer-support-specialist'],['Improve landing page conversion','cro-specialist']])assert.equal(rankSpecialists(index,task)[0].id,id,task);
 assert.deepEqual(rankSpecialists(index,'zzzzqnonexistent'),[]);assert.deepEqual(rankSpecialists(index,'please help me'),[]);
 assert.notEqual(rankSpecialists(index,'Fix a JSON type conversion error in code')[0].id,'cro-specialist');
 assert.notEqual(rankSpecialists(index,'Improve PostgreSQL database indexing')[0].id,'seo-specialist');
});
test('every worker has source-backed routing, editable onboarding, permission boundaries and accurate connection status',()=>{
 for(const row of index.roles){const r=JSON.parse(read('/data/roles/'+row.id+'.json')),files=specialistFiles(r);assert.equal(Object.keys(files).length,11,r.id);assert.equal(JSON.parse(files['worker.json']).execution.status,'NOT_STARTED');assert(files['PERMISSIONS.md'].includes('Existing session authorization still applies'));assert(files['TRAINING.md'].includes('not model fine-tuning'));assert.equal(r.worker.routes.length,r.resources.length);for(const route of r.worker.routes){const f=r.functions.find(f=>f.method===route.method);assert.deepEqual(route.when,f.when.length?f.when:[f.description]);assert.deepEqual(route.deliverables,f.deliverables);assert.deepEqual(route.inputs,f.inputs);}assert(r.worker.connections.every(c=>c.status==='NOT_VERIFIED'));}
});
test('task preparation carries private training and context, hashes changes, keeps approvals false and makes no provider calls',async()=>{
 const s=service(),args={role_id:'coding-specialist',task:'Build the supplied synthetic feature and check its files.',context:'Synthetic project only.',tools:'Local terminal and browser.',training:'Use short release notes. Accepted example: attached sample.md.',me:'## Work\nSynthetic engineering team.'};
 const a=await s.callTool('prepare_specialist',args);assert.equal(a.selected_role.id,args.role_id);assert.equal(a.state,'NOT_STARTED');assert.equal(a.execution.model_calls_by_service,0);assert.equal(a.execution.stored_by_service,false);assert.equal(a.preparation.approval.grants_execution_authority,false);assert(a.worker_files['TRAINING.md'].includes(args.training));assert(a.worker_files['CONTEXT.md'].includes(args.me));assert(a.launch_brief.includes(args.training));assert(a.preparation.workflow.notes.includes(args.training));
 const b=await s.callTool('prepare_specialist',{...args,training:'Use longer release notes.'});assert.notEqual(a.worker_sha256,b.worker_sha256);assert.notEqual(a.preparation.draft_sha256,b.preparation.draft_sha256);
 assert.equal((await s.callTool('prepare_specialist',{task:'Launch a Meta advertising campaign'})).selected_role.id,'media-buyer');
 await assert.rejects(()=>s.callTool('prepare_specialist',{task:'zzzzqnonexistent'}));await assert.rejects(()=>s.callTool('prepare_specialist',{...args,training:'x'.repeat(6001)}));await assert.rejects(()=>s.callTool('prepare_specialist',{...args,role_id:'../bad'}));
});
test('REST exposes specialist discovery, complete worker retrieval and private POST preparation using the shared contracts',async()=>{
 const found=await handlePublicApi(request('/api/v1/specialists?task=executive%20day%20meetings'),env);assert.equal(found.status,200);assert.equal((await found.json()).candidates[0].id,'executive-assistant');
 const readRole=await handlePublicApi(request('/api/v1/specialists/coding-specialist'),env);assert.equal(readRole.status,200);assert.equal((await readRole.json()).worker.schema,'ai-blocks-specialist-worker/1');
 const response=await handlePublicApi(request('/api/v1/specialist-preparations',{role_id:'coding-specialist',task:'Check the supplied synthetic code.',training:'Prefer short explanations.'}),env);assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');assert.equal((await response.json()).state,'NOT_STARTED');
 const schema=await (await handlePublicApi(request('/api/v1/openapi.json'),env)).json();assert(schema.paths['/api/v1/specialist-preparations']);
});
