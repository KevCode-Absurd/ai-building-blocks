import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {PublicCatalogueService} from '../src/server/public-catalogue.ts';
const read=p=>fs.readFileSync(new URL('../public'+p,import.meta.url));
const index=JSON.parse(read('/data/roles-index.json'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const service=(overrides={})=>new PublicCatalogueService(async p=>{try{return new Response(overrides[p]??read(p));}catch{return new Response('Missing',{status:404});}},'https://useaiblocks.com');
const contents=async(s,uri)=>JSON.parse((await s.readResource(uri)).contents[0].text);
test('MCP exposes every role and complete revision-pinned instructions without executing it',async()=>{
 const s=service(),all=await contents(s,'aiblocks://roles');assert.equal(all.roles.length,index.roles.length);
 for(const id of ['coding-specialist','seo-specialist','customer-support-specialist']){
  const r=await contents(s,'aiblocks://roles/'+id);assert.equal(r.execution_status,'NOT_STARTED');assert.equal(r.custom_skill.resources.length,r.resources.length);assert.equal(r.custom_skill.instructions,r.instructions);assert.match(r.next_action,/No model was called/);
  const args={name:r.name,goal:'Check supplied synthetic files without publishing.',steps:[{id:'role',slug:r.custom_skill.slug}],custom_skills:[r.custom_skill]};
  const draft=await s.callTool('prepare_workflow',args);assert.equal(draft.workflow.custom_skills[0].resources.length,r.resources.length);assert.ok(draft.draft_sha256);
  await assert.rejects(()=>s.callTool('prepare_workflow',{...args,custom_skills:[{...r.custom_skill,resources:[{...r.custom_skill.resources[0],revision_sha256:'0'.repeat(64)}]}]}));
 }
});
test('MCP rejects missing, traversal, corrupt and stale role profiles',async()=>{
 await assert.rejects(()=>service().readResource('aiblocks://roles/unknown-role'));
 await assert.rejects(()=>service().readResource('aiblocks://roles/../coding-specialist'));
 const stale={...index,sourceHash:'0'.repeat(64)};await assert.rejects(()=>service({'/data/roles-index.json':JSON.stringify(stale)}).readResource('aiblocks://roles'),e=>e.code==='stale_roles');
 const p='/data/roles/coding-specialist.json',r=JSON.parse(read(p));
 await assert.rejects(()=>service({[p]:JSON.stringify({...r,name:'Tampered'})}).readResource('aiblocks://roles/coding-specialist'));
 r.resources[0].revision='0'.repeat(64);const bytes=Buffer.from(JSON.stringify(r));
 const i={...index,profiles:{...index.profiles,'coding-specialist':{bytes:bytes.length,sha256:sha(bytes)}}};
 await assert.rejects(()=>service({[p]:bytes,'/data/roles-index.json':JSON.stringify(i)}).readResource('aiblocks://roles/coding-specialist'),e=>e.code==='stale_role');
});

test('every published role can be prepared with its current complete source closure and remains unexecuted',async()=>{
 const s=service();
 for(const row of index.roles){
  const r=await contents(s,'aiblocks://roles/'+row.id);
  const draft=await s.callTool('prepare_workflow',{name:r.name,goal:'Synthetic preparation check only. No task execution or external changes.',steps:[{id:'role',slug:r.custom_skill.slug}],custom_skills:[r.custom_skill]});
  assert.equal(draft.state,'NOT_STARTED',r.id);assert.equal(draft.execution.model_calls_by_service,0,r.id);
  assert.equal(draft.approval.grants_execution_authority,false,r.id);
  for(const ref of r.custom_skill.resources)assert(draft.resources.some(s=>s.slug===ref.slug),r.id+' missing '+ref.slug);
 }
});
