import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {DatabaseSync} from 'node:sqlite';
import {memoryExpertStore,d1ExpertStore} from '../src/server/expert-agent-store.ts';
import {ExpertAgentService} from '../src/server/expert-agent-service.ts';
import {profile,scope,source,proposal,NOW} from './fixtures/expert-agent-fixtures.mjs';
import {agentRecordDigest} from '../src/agents/expert-agent-contract.mjs';

export function sqlExpertFixture(){
 const db=new DatabaseSync(':memory:');db.exec('PRAGMA foreign_keys=ON');db.exec(readFileSync(new URL('../migrations/0011_expert_agent_records.sql',import.meta.url),'utf8'));
 const statement=(sql,values=[])=>({bind(...v){return statement(sql,v);},async first(){return db.prepare(sql).get(...values)??null;},async all(){return {results:db.prepare(sql).all(...values)};},async run(){return {meta:{changes:Number(db.prepare(sql).run(...values).changes)}};}});
 const adapter={prepare:s=>statement(s),async batch(stmts){db.exec('BEGIN');try{const r=[];for(const s of stmts)r.push(await s.run());db.exec('COMMIT');return r;}catch(e){db.exec('ROLLBACK');throw e;}}};
 return {store:d1ExpertStore(adapter),db};
}
const service=(store,opts={})=>new ExpertAgentService(store,{now:NOW,authorize:async wanted=>{if(wanted&&opts.write===false)throw Error('write_denied');return {scope:opts.scope??'personal:user-one',userId:opts.userId??'user-one',write:opts.write!==false};}});
let counter=0;const write=(extra={})=>({expected_version:0,idempotency_key:'synthetic-request-'+(++counter),confirmed:true,...extra});
async function seeded(store){const s=service(store);await s.callTool('save_expert_profile',write({profile:profile()}));await s.callTool('create_expert_agent',write({id:'pm-agent',profile_id:'pm-profile',name:'Synthetic reviewer',scope:scope()}));return s;}
const get=(s,kind,id,version)=>s.callTool('get_expert_record',{kind,id,...(version?{version}:{})});
async function proposed(s){const a=await get(s,'agent','pm-agent');await s.callTool('begin_expert_capture',write({id:'capture-one',agent_id:a.id,agent_sha256:a.sha256,mode:'interview',source:source()}));
 await s.callTool('record_expert_capture_answer',write({id:'capture-one',expected_version:1,answer:{question_id:'case',answer:'PRIVATE_CAPTURE_SENTINEL: synthetic repeated tickets from one organization.',artifact_sha256:null}}));
 await s.callTool('propose_expert_learning',write({id:'capture-one',expected_version:2,proposal:proposal()}));return s.callTool('preview_expert_learning',{id:'capture-one',decision:'accept'});
}

for(const backend of ['memory','D1']){
 const fixture=()=>backend==='D1'?sqlExpertFixture():{store:memoryExpertStore()};
 test(`${backend}: guided capture survives service restarts, stays private and acceptance atomically saves the exact candidate`,async()=>{
  const f=fixture(),s=await seeded(f.store),p=await proposed(s),fresh=service(f.store);
  assert.equal((await get(fresh,'capture','capture-one')).data.answers.length,1);assert.equal((await get(fresh,'agent','pm-agent')).data.knowledge.length,0);
  const result=await fresh.callTool('review_expert_learning',write({id:'capture-one',expected_version:3,expected_agent_version:1,decision:'accept',approved_preview_sha256:p.preview_sha256}));
  assert.equal(result.records.length,2);assert.equal(result.evaluation_status,'NOT_RUN');assert.equal(result.published,false);
  const updated=await get(service(f.store),'agent','pm-agent');assert.equal(updated.data.version,2);assert.equal(updated.storage_version,2);assert.equal(updated.sha256,p.result_agent_sha256);
  const old=await get(s,'agent','pm-agent',1);assert.equal(old.data.knowledge.length,0);assert.equal(updated.data.parent_sha256,old.sha256);
  const capture=await get(s,'capture','capture-one');assert.equal(capture.data.review.decision,'accept');assert.equal(updated.data.sources[0].sha256,await agentRecordDigest(capture.source_evidence));
  const list=await s.callTool('list_expert_records',{kind:'capture'});assert(!JSON.stringify(list).includes('PRIVATE_CAPTURE_SENTINEL'));
  const pack=await s.callTool('prepare_saved_expert_agent',{id:'pm-agent',version:2,use:'personal'});assert.equal(pack.agent_sha256,updated.sha256);assert.equal(pack.model_calls,0);
  await assert.rejects(()=>service(f.store,{scope:'personal:other'}).callTool('get_expert_record',{kind:'agent',id:'pm-agent'}),e=>e.code==='expert_record_unavailable');f.db?.close();
 });
 test(`${backend}: idempotent replay binds exact content and rechecks authorization`,async()=>{
  const f=fixture(),s=service(f.store),input=write({profile:profile()});const first=await s.callTool('save_expert_profile',input);
  const again=await service(f.store).callTool('save_expert_profile',input);assert.equal(again.idempotent_replay,true);assert.deepEqual(again.records,first.records);
  await assert.rejects(()=>s.callTool('save_expert_profile',{...input,profile:{...profile(),headline:'Changed'}}),e=>e.code==='idempotency_conflict');
  await assert.rejects(()=>service(f.store,{write:false}).callTool('save_expert_profile',input),/write_denied/);
  const requests=await Promise.all([s.callTool('save_expert_profile',input),s.callTool('save_expert_profile',input)]);assert(requests.every(r=>r.idempotent_replay));f.db?.close();
 });
 test(`${backend}: concurrent capture reviews cannot partially commit or apply a correction twice`,async()=>{
  const f=fixture(),s=await seeded(f.store),p=await proposed(s),base={id:'capture-one',expected_version:3,expected_agent_version:1,decision:'accept',approved_preview_sha256:p.preview_sha256};
  const results=await Promise.allSettled([s.callTool('review_expert_learning',write(base)),s.callTool('review_expert_learning',write(base))]);
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal((await get(s,'agent','pm-agent')).data.version,2);assert.equal((await get(s,'capture','capture-one')).storage_version,4);
  // A second fresh fixture injects a capture CAS conflict after candidate construction.
  const second=fixture(),original=await seeded(second.store),preview=await proposed(original);
  const conflict={...second.store,async commit(request,rows){if(rows.length===2){const target=rows.find(r=>r.kind==='capture');await second.store.commit({...request,request_key:'competing-request',request_digest:'b'.repeat(64)},[{...target,request_key:'competing-request'}]);}return second.store.commit(request,rows);}};
  await assert.rejects(()=>service(conflict).callTool('review_expert_learning',write({...base,approved_preview_sha256:preview.preview_sha256})),e=>e.code==='revision_conflict');
  assert.equal((await get(original,'agent','pm-agent')).storage_version,1);
  if(second.db)assert.equal(second.db.prepare("SELECT COUNT(*) n FROM expert_agent_versions WHERE kind='agent'").get().n,1);f.db?.close();second.db?.close();
 });
 test(`${backend}: scope edits invalidate old captures; reject preserves the agent; storage versions are separate from agent versions`,async()=>{
  const f=fixture(),s=await seeded(f.store),p=await proposed(s);
  await s.callTool('review_expert_learning',write({id:'capture-one',expected_version:3,expected_agent_version:1,decision:'reject',approved_preview_sha256:(await s.callTool('preview_expert_learning',{id:'capture-one',decision:'reject'})).preview_sha256}));
  assert.equal((await get(s,'agent','pm-agent')).storage_version,1);assert.equal((await get(s,'capture','capture-one')).storage_version,4);
  const a=await get(s,'agent','pm-agent');await s.callTool('begin_expert_capture',write({id:'capture-two',agent_id:a.id,agent_sha256:a.sha256,mode:'work-review',source:{...source(),id:'review-source'}}));
  await s.callTool('revise_expert_agent_scope',write({id:'pm-agent',expected_version:1,scope:{...scope(),not_for:['Production changes','Budget decisions']}}));
  await assert.rejects(()=>s.callTool('record_expert_capture_answer',write({id:'capture-two',expected_version:1,answer:{question_id:'work',answer:'An old task.',artifact_sha256:null}})),e=>e.code==='invalid_expert_record');assert(p.preview_sha256);f.db?.close();
 });
 test(`${backend}: strict schemas, write confirmation and authenticated identity prevent arbitrary record injection`,async()=>{
  const f=fixture(),s=service(f.store);
  await assert.rejects(()=>s.callTool('save_expert_profile',write({profile:profile(),confirmed:false})),e=>e.code==='confirmation_required');
  await assert.rejects(()=>s.callTool('save_expert_profile',write({profile:{...profile(),owner_id:'other'}})),e=>e.code==='identity_mismatch');
  await assert.rejects(()=>s.callTool('save_expert_profile',write({profile:profile(),owner_id:'other'})),e=>e.code==='invalid_arguments');
  await assert.rejects(()=>s.callTool('save_expert_profile',write({profile:{...profile(),private_notes:'Bearer '+'X'.repeat(50)}})),e=>e.code==='invalid_arguments');
  await assert.rejects(()=>s.callTool('save_expert_profile',write({profile:{...profile(),verified:true}})),e=>e.code==='invalid_expert_record');
  assert.equal((await s.callTool('list_expert_records',{kind:'profile'})).items.length,0);f.db?.close();
 });
 test(`${backend}: a company ownership change cannot silently transfer an expert's profile or agent authorship`,async()=>{
  const f=fixture(),s=await seeded(f.store),newOwner=service(f.store,{userId:'new-owner'});
  await assert.rejects(()=>newOwner.callTool('save_expert_profile',write({expected_version:1,profile:{...profile(),owner_id:'new-owner',version:2}})),e=>e.code==='expert_author_required');
  await assert.rejects(()=>newOwner.callTool('revise_expert_agent_scope',write({expected_version:1,id:'pm-agent',scope:scope()})),e=>e.code==='expert_author_required');
  assert.equal((await get(s,'profile','pm-profile')).storage_version,1);assert.equal((await get(s,'agent','pm-agent')).data.owner_id,'user-one');f.db?.close();
 });
}
