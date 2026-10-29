import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {createRoleFlow,roleLaunchPrompt} from '../src/roles/role-runtime.ts';
import {PublicCatalogueService} from '../src/server/public-catalogue.ts';
const read=p=>fs.readFileSync(new URL('../public'+p,import.meta.url));
test('a specialist accepts a smaller job and actual deliverables without inheriting the primary workflow inputs or outputs',()=>{
 const role=JSON.parse(read('/data/roles/executive-assistant.json'));
 const blocks=JSON.parse(read('/data/blocks.json')).blocks;
 const c={sourceHash:role.catalogueHash,bySlug:Object.fromEntries(blocks.map(b=>[b.slug,b]))};
 const brief={goal:'Draft one reply from the supplied email. Do not send it.',context:'Synthetic email attached. No calendar task is requested.',tools:'Text files only.',training:'Keep the reply short.',me:'',deliverables:['reply.md'],resources:role.resources.map(r=>r.slug)};
 const flow=createRoleFlow(c,role,brief,'synthetic-email-job');
 assert.deepEqual(flow.customSkills[0].inputs,[{type:'short_text',required:true}]);
 assert.deepEqual(flow.customSkills[0].outputs,[{type:'document',required:true}]);
 assert(flow.customSkills[0].workerFiles['JOB.md'].includes('reply.md'));
 assert(flow.customSkills[0].workerFiles['CONNECTIONS.md'].includes('Only active methods'));
 assert(flow.customSkills[0].markdown.includes('does not make all its tasks or input files mandatory'));
 assert(roleLaunchPrompt(role,brief).includes('reply.md'));
 assert.throws(()=>createRoleFlow(c,role,{...brief,deliverables:['x'.repeat(1001)]},'bad'),/deliverables/);
});
test('MCP task preparation binds actual requested outputs and resolves only the worker task-brief port',async()=>{
 const service=new PublicCatalogueService(async p=>{try{return new Response(read(p));}catch{return new Response('Missing',{status:404});}},'https://example.test');
 const args={role_id:'executive-assistant',task:'Draft a reply from my supplied email. Do not send.',deliverables:['reply.md']};
 const a=await service.callTool('prepare_specialist',args),b=await service.callTool('prepare_specialist',{...args,deliverables:['reply.docx']});
 assert.deepEqual(a.preparation.inputs.map(i=>i.type),['short_text']);
 assert.equal(a.preparation.handoff_check.status,'PASS');
 assert(a.worker_files['JOB.md'].includes('reply.md'));assert(a.preparation.workflow.notes.includes('reply.md'));
 assert.notEqual(a.preparation.draft_sha256,b.preparation.draft_sha256);assert.notEqual(a.worker_sha256,b.worker_sha256);
 assert.equal(a.state,'NOT_STARTED');assert.equal(a.execution.model_calls_by_service,0);
});
