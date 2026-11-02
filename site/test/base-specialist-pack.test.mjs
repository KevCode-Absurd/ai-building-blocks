import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {unzipSync,strFromU8} from 'fflate';
import {baseSpecialistFiles} from '../src/roles/base-specialist.mjs';
import {buildBaseSpecialistPack} from '../src/roles/base-specialist-pack.ts';
import {PublicCatalogueService} from '../src/server/public-catalogue.ts';
import {handlePublicApi} from '../src/server/public-api.ts';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import {handlePublicMcp} from '../src/server/public-mcp.ts';
const read=p=>fs.readFileSync(new URL('../public'+p,import.meta.url));
const sha=b=>createHash('sha256').update(b).digest('hex');
const manifest=JSON.parse(read('/data/public-api-manifest.json')),catalogue=JSON.parse(read('/data/blocks.json'));
const role=id=>JSON.parse(read('/data/roles/'+id+'.json'));
const checkedRead=async(p,max,expected)=>{const b=read(p);assert(b.length<=max);if(expected){assert.equal(b.length,expected.bytes);assert.equal(sha(b),expected.sha256);}return new Uint8Array(b);};
const asset=async p=>{try{return new Response(read(p));}catch{return new Response(null,{status:404});}};
const env={PUBLIC_API_ENABLED:'true',API_ALLOWED_HOSTS:'example.test',API_READ_LIMITER:{async limit(){return {success:true};}},API_WRITE_LIMITER:{async limit(){return {success:true};}},ASSETS:{fetch:r=>asset(new URL(r.url).pathname)}};
const request=(path,body)=>new Request('https://example.test'+path,{method:body?'POST':'GET',headers:{'cf-connecting-ip':'192.0.2.10',...(body?{'content-type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});

for(const id of ['coding-specialist','design-specialist','media-buyer'])test(id+' complete base pack has no job context and preserves every pinned source file',async()=>{
 const r=role(id),pack=await buildBaseSpecialistPack(r,catalogue,manifest,checkedRead),files=unzipSync(pack.bytes);
 for(const p of ['README.md','START_HERE.md','SKILL.md','SETUP.md','SOUL.md','INTAKE.md','PLAYBOOK.md','SKILLS.md','BEST_PRACTICES.md','HANDOFF.md','CONNECTIONS.md','PERMISSIONS.md','CHECKS.md','TRAINING.md','CONTEXT.md','LAUNCH.txt','specialist.json','manifest.json','sources.json','pack-checks.json'])assert(files[p],p);
 const specialist=JSON.parse(strFromU8(files['specialist.json']));assert.equal(specialist.state,'AWAITING_TASK');assert.equal(specialist.task,null);assert.equal(specialist.private_context_included,false);
 const sources=JSON.parse(strFromU8(files['sources.json']));
 for(const r of sources.methods){
  const entry=manifest.resources[r.slug];assert.equal(r.revision_sha256,entry.revision_sha256);
  assert.equal(sha(files['skills/'+r.slug+'/SKILL.md']),entry.instruction.sha256);
  for(const f of entry.files??[]){const exported=f.path===r.slug+'/SKILL.md'&&r.archive_instruction_copy?r.archive_instruction_copy:'skills/'+f.path;assert(files[exported],f.path);assert.equal(sha(files[exported]),f.sha256,f.path);}
 }
 const inventory=JSON.parse(strFromU8(files['manifest.json']));for(const f of inventory.files){assert.equal(files[f.path].length,f.bytes);assert.equal(sha(files[f.path]),f.sha256);}
 assert(Object.keys(files).some(p=>p.includes('/references/')));assert(Object.keys(files).some(p=>/LICENSE/.test(p)));
 assert(!strFromU8(files['CONTEXT.md']).includes('Gehna'));assert(strFromU8(files['INTAKE.md']).includes('Do not ask again'));
 assert.equal(JSON.parse(strFromU8(files['pack-checks.json'])).execution_checks,'NOT_RUN');
 const repeat=await buildBaseSpecialistPack(r,catalogue,manifest,checkedRead);assert.equal(sha(pack.bytes),sha(repeat.bytes));
});

test('missing, stale and altered sources fail the whole download instead of exporting a partial pack',async()=>{
 const r=role('coding-specialist');
 await assert.rejects(()=>buildBaseSpecialistPack({...r,catalogueHash:'0'.repeat(64)},catalogue,manifest,checkedRead),/changed/);
 await assert.rejects(()=>buildBaseSpecialistPack(r,catalogue,manifest,async(p,max,e)=>{if(p.endsWith('.zip'))throw Error('Missing archive');return checkedRead(p,max,e);}),/Missing archive/);
 const corrupt=structuredClone(manifest),slug=r.resources[0].slug;corrupt.resources[slug].files[0].sha256='0'.repeat(64);
 await assert.rejects(()=>buildBaseSpecialistPack(r,catalogue,corrupt,checkedRead),/inventory mismatch/);
});

test('MCP base load asks intake in the host, keeps contextual preparation optional and requires acceptance for suggestions',async()=>{
 const s=new PublicCatalogueService(asset,'https://example.test');
 const a=await s.callTool('prepare_specialist',{role_id:'coding-specialist'});assert.equal(a.schema,'ai-blocks-base-specialist/1');assert.equal(a.state,'AWAITING_TASK');assert.equal(a.execution.model_calls_by_service,0);assert.equal(a.execution.stored_by_service,false);assert.deepEqual(a.files,baseSpecialistFiles(role('coding-specialist')));assert(a.download_url.endsWith('/coding-specialist/pack'));assert.equal(a.methods.length,role('coding-specialist').resources.length);assert(!('preparation'in a));
 await assert.rejects(()=>s.callTool('prepare_specialist',{}));await assert.rejects(()=>s.callTool('prepare_specialist',{role_id:'../bad'}));await assert.rejects(()=>s.callTool('prepare_specialist',{role_id:'coding-specialist',context:'Do not silently discard my context'}));
 const matches=await s.callTool('find_specialist',{task:'Build a feature in my codebase'});assert.equal(matches.user_acceptance_required,true);
 const prepared=await s.callTool('prepare_specialist',{role_id:'coding-specialist',task:'Fix the supplied synthetic test failure'});assert.equal(prepared.state,'NOT_STARTED');
});

test('REST returns a verified complete ZIP and role-only preparation; query context and writes to the pack endpoint are rejected',async()=>{
 const response=await handlePublicApi(request('/api/v1/specialists/coding-specialist/pack'),env);assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'application/zip');assert.match(response.headers.get('content-disposition'),/coding-specialist-base-specialist.zip/);const b=new Uint8Array(await response.arrayBuffer());assert.equal(response.headers.get('x-content-sha256'),sha(b));assert(unzipSync(b)['START_HERE.md']);
 const loaded=await handlePublicApi(request('/api/v1/specialist-preparations',{role_id:'design-specialist'}),env);assert.equal(loaded.status,200);assert.equal((await loaded.json()).state,'AWAITING_TASK');assert.equal(loaded.headers.get('cache-control'),'no-store');
 assert.equal((await handlePublicApi(request('/api/v1/specialists/coding-specialist/pack?task=private'),env)).status,400);
 assert.equal((await handlePublicApi(request('/api/v1/specialists/coding-specialist/pack',{}),env)).status,405);
 const schema=await(await handlePublicApi(request('/api/v1/openapi.json'),env)).json();assert(schema.paths['/api/v1/specialists/{role_id}/pack']);
});

test('every published specialist has a complete verified static download and role-only host intake',async()=>{
 const index=JSON.parse(read('/data/roles-index.json')),packs=JSON.parse(read('/data/base-specialist-packs.json'));
 assert.equal(packs.count,index.roles.length);assert.equal(packs.catalogue_hash,manifest.catalogue_sha256);assert.deepEqual(Object.keys(packs.packs).sort(),index.roles.map(r=>r.id).sort());
 for(const r of index.roles){
  const metadata=packs.packs[r.id],profile=role(r.id),bytes=read(metadata.path),files=unzipSync(bytes);
  assert.equal(sha(bytes),metadata.sha256,r.id);assert.equal(bytes.length,metadata.bytes,r.id);assert.equal(metadata.role_source_hash,profile.sourceHash,r.id);
  assert.equal(Object.keys(files).length,metadata.files,r.id);assert(metadata.bytes<25_000_000,r.id);
  const base=JSON.parse(strFromU8(files['specialist.json']));assert.equal(base.id,r.id);assert.equal(base.state,'AWAITING_TASK');assert.equal(base.private_context_included,false);
  const inventory=JSON.parse(strFromU8(files['manifest.json']));for(const f of inventory.files){assert(files[f.path],r.id+':'+f.path);assert.equal(sha(files[f.path]),f.sha256,r.id+':'+f.path);}
  for(const source of profile.resources)assert(files['skills/'+source.slug+'/SKILL.md'],r.id+':'+source.slug);
 }
});

test('a stale or tampered prebuilt pack is rejected by the public download service',async()=>{
 const source=JSON.parse(read('/data/base-specialist-packs.json'));
 for(const change of ['role','bytes']){
  const altered=structuredClone(source);if(change==='role')altered.packs['coding-specialist'].role_source_hash='0'.repeat(64);
  const s=new PublicCatalogueService(async p=>p==='/data/base-specialist-packs.json'?Response.json(altered):change==='bytes'&&p===source.packs['coding-specialist'].path?new Response('tampered'):asset(p),'https://example.test');
  await assert.rejects(()=>s.specialistPack('coding-specialist'),/differs|do not match/);
 }
});

test('official MCP SDK can load a base specialist with role_id only',async()=>{
 const service=new PublicCatalogueService(asset,'https://example.test');
 const transport=new StreamableHTTPClientTransport(new URL('https://example.test/mcp'),{fetch:(input,init)=>handlePublicMcp(new Request(input,init),service)});
 const client=new Client({name:'base-specialist-local-test',version:'1'});await client.connect(transport);
 try{const tools=await client.listTools();assert(tools.tools.find(t=>t.name==='prepare_specialist'));const r=await client.callTool({name:'prepare_specialist',arguments:{role_id:'coding-specialist'}});assert(!r.isError);const value=r.structuredContent??JSON.parse(r.content.find(c=>c.type==='text').text);assert.equal(value.state,'AWAITING_TASK');assert(value.files['SOUL.md']);}finally{await client.close();}
});
