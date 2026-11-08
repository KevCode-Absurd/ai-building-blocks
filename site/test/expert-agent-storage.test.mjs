import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {DatabaseSync} from 'node:sqlite';
import {memoryExpertStore,d1ExpertStore} from '../src/server/expert-agent-store.ts';
import {ExpertAgentService} from '../src/server/expert-agent-service.ts';
import {profile,scope,source,proposal,NOW} from './fixtures/expert-agent-fixtures.mjs';
import {agentRecordDigest} from '../src/agents/expert-agent-contract.mjs';

export function sqlExpertFixture(){
 const db=new DatabaseSync(':memory:');db.exec('PRAGMA foreign_keys=ON');db.exec(readFileSync(new URL('../migrations/0011_expert_agent_records.sql',import.meta.url),'utf8'));
 db.exec(readFileSync(new URL('../migrations/0012_expert_agent_deletion.sql',import.meta.url),'utf8'));
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
 test(`${backend}: private export is exact and permanent deletion removes every version without retry resurrection`,async()=>{
  const f=fixture(),s=service(f.store),input=write({profile:profile()}),saved=await s.callTool('save_expert_profile',input);
  assert.deepEqual(saved.destination,{store:'ai-blocks-private-expert-records',scope:'personal:user-one'});assert.equal(saved.model_training,false);
  await s.callTool('save_expert_profile',write({expected_version:1,profile:{...profile(),version:2,headline:'An edited private profile'}}));
  const before=await get(s,'profile','pm-profile'),exported=await s.callTool('export_expert_record',{kind:'profile',id:'pm-profile',version:1});
  assert.equal(exported.record.sha256,saved.records[0].sha256);assert.equal(exported.record.storage_version,1);assert.equal(exported.contains_private_data,true);assert.equal(exported.published,false);
  await assert.rejects(()=>s.callTool('delete_expert_record',{kind:'profile',id:'pm-profile',expected_version:1,expected_sha256:exported.record.sha256,confirmed:true}),e=>e.code==='revision_conflict');
  await assert.rejects(()=>service(f.store,{scope:'personal:other'}).callTool('delete_expert_record',{kind:'profile',id:'pm-profile',expected_version:2,expected_sha256:before.sha256,confirmed:true}),e=>e.code==='expert_record_unavailable');
  const erased=await s.callTool('delete_expert_record',{kind:'profile',id:'pm-profile',expected_version:2,expected_sha256:before.sha256,confirmed:true});assert.equal(erased.all_versions,true);
  for(const version of [1,2])await assert.rejects(()=>get(s,'profile','pm-profile',version),e=>e.code==='expert_record_unavailable');
  await assert.rejects(()=>s.callTool('save_expert_profile',input),e=>e.code==='expert_record_deleted');
  await assert.rejects(()=>s.callTool('save_expert_profile',write({profile:profile()})),e=>e.code==='expert_record_deleted');
  assert.equal((await s.callTool('list_expert_records',{kind:'profile'})).items.length,0);f.db?.close();
 });
 test(`${backend}: an edited narrower proposal invalidates the old preview and only the exact reviewed judgment becomes active`,async()=>{
  const f=fixture(),s=await seeded(f.store),old=await proposed(s),narrow=proposal();narrow.knowledge_changes[0].record.conditions=['Assessing independent demand for this product team'];narrow.knowledge_changes[0].record.exceptions=['A supplied contractual requirement overrides frequency'];
  await s.callTool('propose_expert_learning',write({id:'capture-one',expected_version:3,proposal:narrow}));
  await assert.rejects(()=>s.callTool('review_expert_learning',write({id:'capture-one',expected_version:4,expected_agent_version:1,decision:'accept',approved_preview_sha256:old.preview_sha256})),e=>e.code==='invalid_expert_record');
  assert.equal((await get(s,'agent','pm-agent')).data.knowledge.length,0);
  const current=await s.callTool('preview_expert_learning',{id:'capture-one',decision:'accept'});await s.callTool('review_expert_learning',write({id:'capture-one',expected_version:4,expected_agent_version:1,decision:'accept',approved_preview_sha256:current.preview_sha256}));
  assert.deepEqual((await get(s,'agent','pm-agent')).data.knowledge[0].conditions,narrow.knowledge_changes[0].record.conditions);f.db?.close();
 });
 test(`${backend}: deletion refuses dependent records and does not silently erase an agent with its capture`,async()=>{
  const f=fixture(),s=await seeded(f.store);await proposed(s);
  for(const [kind,id]of [['profile','pm-profile'],['agent','pm-agent']]){const current=await get(s,kind,id);await assert.rejects(()=>s.callTool('delete_expert_record',{kind,id,expected_version:current.storage_version,expected_sha256:current.sha256,confirmed:true}),e=>e.code==='expert_record_in_use');assert.equal((await get(s,kind,id)).sha256,current.sha256);}
  const capture=await get(s,'capture','capture-one');await s.callTool('delete_expert_record',{kind:'capture',id:capture.id,expected_version:capture.storage_version,expected_sha256:capture.sha256,confirmed:true});
  const agent=await get(s,'agent','pm-agent');await s.callTool('delete_expert_record',{kind:'agent',id:agent.id,expected_version:agent.storage_version,expected_sha256:agent.sha256,confirmed:true});
  assert.equal((await get(s,'profile','pm-profile')).storage_version,1);f.db?.close();
 });
 for(const parentKind of ['profile','agent'])test(`${backend}: deleting ${parentKind} after service read but before child commit cannot create an orphan`,async()=>{
  const f=fixture(),s=service(f.store);await s.callTool('save_expert_profile',write({profile:profile()}));
  if(parentKind==='agent')await s.callTool('create_expert_agent',write({id:'pm-agent',profile_id:'pm-profile',name:'Private reviewer',scope:scope()}));
  const parent=await get(s,parentKind,parentKind==='profile'?'pm-profile':'pm-agent'),childKind=parentKind==='profile'?'agent':'capture';
  const racing={...f.store,async commit(request,rows){
   if(rows.some(row=>row.kind===childKind))assert.equal(await f.store.erase('personal:user-one',parentKind+':'+parent.id,parent.storage_version,parent.sha256),true);
   return f.store.commit(request,rows);
  }};
  const raced=service(racing),input=parentKind==='profile'?write({id:'pm-agent',profile_id:'pm-profile',name:'Private reviewer',scope:scope()}):write({id:'capture-one',agent_id:parent.id,agent_sha256:parent.sha256,mode:'interview',source:source()});
  await assert.rejects(()=>raced.callTool(parentKind==='profile'?'create_expert_agent':'begin_expert_capture',input),e=>e.code==='expert_parent_unavailable');
  assert.equal((await f.store.list('personal:user-one',childKind)).length,0);assert.equal(await f.store.request('personal:user-one',input.idempotency_key),null,'failed child transaction must not leave a success receipt');
  await assert.rejects(()=>get(s,parentKind,parent.id),e=>e.code==='expert_record_unavailable');f.db?.close();
 });
 for(const use of ['personal','company'])test(`${backend}: ${use} storage rejects mismatched source use on begin and all legacy capture operations`,async()=>{
  const f=fixture(),currentScope=use+':user-one',s=service(f.store,{scope:currentScope}),opposite=use==='personal'?'company':'personal';
  await s.callTool('save_expert_profile',write({profile:profile()}));await s.callTool('create_expert_agent',write({id:'pm-agent',profile_id:'pm-profile',name:'Private reviewer',scope:scope()}));
  const agent=await get(s,'agent','pm-agent'),start={id:'capture-one',agent_id:agent.id,agent_sha256:agent.sha256,mode:'interview'};
  await assert.rejects(()=>s.callTool('begin_expert_capture',write({...start,source:{...source(),allowed_uses:[opposite]}})),e=>e.code==='source_scope_not_permitted');
  assert.equal((await f.store.list(currentScope,'capture')).length,0);
  await s.callTool('begin_expert_capture',write({...start,source:{...source(),allowed_uses:[use]}}));
  // Simulate a pre-fix preview capture already stored in the wrong-use scope.
  const existing=await f.store.get(currentScope,'capture:capture-one'),legacy=JSON.parse(existing.contents);legacy.source.allowed_uses=[opposite];legacy.answers=[{question_id:'case',answer:'LEGACY_PRIVATE_CAPTURE_SENTINEL',artifact_sha256:null}];
  const row={...existing,version:2,contents:JSON.stringify(legacy),digest:await agentRecordDigest(legacy),request_key:'legacy-private-source'};assert.equal(await f.store.commit({scope:currentScope,request_key:row.request_key,request_digest:'c'.repeat(64),receipt:'{}',created:NOW().toISOString()},[row]),true);
  const calls=[['get_expert_record',{kind:'capture',id:'capture-one'}],['export_expert_record',{kind:'capture',id:'capture-one'}],['preview_expert_learning',{id:'capture-one',decision:'accept'}],['record_expert_capture_answer',write({id:'capture-one',expected_version:2,answer:{question_id:'procedure',answer:'More private data',artifact_sha256:null}})],['propose_expert_learning',write({id:'capture-one',expected_version:2,proposal:proposal()})],['review_expert_learning',write({id:'capture-one',expected_version:2,expected_agent_version:1,decision:'accept',approved_preview_sha256:'a'.repeat(64)})]];
  for(const [name,args]of calls)await assert.rejects(()=>s.callTool(name,args),e=>e.code==='source_scope_not_permitted'&&!e.message.includes('LEGACY_PRIVATE_CAPTURE_SENTINEL'));
  const listed=await s.callTool('list_expert_records',{kind:'capture'});assert.equal(listed.items.length,0);assert.equal(listed.restricted_records_omitted,1);
  assert.equal((await f.store.get(currentScope,'capture:capture-one')).version,2);
  const erased=await s.callTool('delete_expert_record',{kind:'capture',id:'capture-one',expected_version:2,expected_sha256:row.digest,confirmed:true});assert.equal(erased.deleted,true,'rights restrictions must not prevent an explicit purge');f.db?.close();
 });
 test(`${backend}: declared-scope draft capture preserves unknown and expired rights limitations without implying reuse permission`,async()=>{
  const f=fixture(),s=await seeded(f.store),a=await get(s,'agent','pm-agent');
  const capture=await s.callTool('begin_expert_capture',write({id:'capture-one',agent_id:a.id,agent_sha256:a.sha256,mode:'interview',source:{...source(),rights_status:'unknown',expires_on:'2020-01-01'}}));
  assert.equal(capture.saved,true);assert.equal(capture.source_use.rights_verified,false);assert.equal(capture.source_use.storage_use,'personal');assert.equal(capture.source_use.limitations.length,2);
  await s.callTool('record_expert_capture_answer',write({id:'capture-one',expected_version:1,answer:{question_id:'case',answer:'Selected evidence held only as a private draft for review.',artifact_sha256:null}}));
  await s.callTool('propose_expert_learning',write({id:'capture-one',expected_version:2,proposal:proposal()}));const p=await s.callTool('preview_expert_learning',{id:'capture-one',decision:'accept'});
  assert.equal(p.source_use.rights_verified,false);assert.equal(p.source_use.limitations.length,2);
  const reviewed=await s.callTool('review_expert_learning',write({id:'capture-one',expected_version:3,expected_agent_version:1,decision:'accept',approved_preview_sha256:p.preview_sha256}));assert(reviewed.source_use.limitations.some(x=>x.includes('expired')));
  await assert.rejects(()=>s.callTool('prepare_saved_expert_agent',{id:'pm-agent',use:'personal'}),e=>e.code==='invalid_expert_operation');
  assert.equal((await s.callTool('export_expert_record',{kind:'capture',id:'capture-one'})).source_use.rights_verified,false,'private archival export must not claim cleared reuse rights');f.db?.close();
 });
 test(`${backend}: task discovery is Unicode-aware and scoped, excludes unrelated/inactive content, and returns only bounded scope summaries`,async()=>{
  const f=fixture(),s=await seeded(f.store);await proposed(s);
  const examples=[['hindi','ग्राहक प्रमाण की समीक्षा','ग्राहक समीक्षा'],['japanese','商品調査の判断を支援する','商品調査'],['arabic','تقييم أدلة العميل','تقييم'],['english','Customer evidence research','ＣＵＳＴＯＭＥＲ']];
  for(const [id,task,query]of examples){await s.callTool('create_expert_agent',write({id,profile_id:'pm-profile',name:task,scope:{...scope(),task}}));const found=await s.callTool('list_expert_records',{kind:'agent',query});assert(found.items.some(row=>row.id===id),query);assert.equal(found.assurance,'TASK_TEXT_MATCH_NOT_SEMANTIC_SUITABILITY');assert(found.items.every(row=>row.summary_only&&row.scope_summary));assert(!JSON.stringify(found).includes('PRIVATE_CAPTURE_SENTINEL'));}
  assert.equal((await s.callTool('list_expert_records',{kind:'agent',query:'astrophotography'})).items.length,0);
  assert.equal((await s.callTool('list_expert_records',{kind:'agent',query:'tickets'})).items.length,0,'capture answers and unapproved knowledge are not discovery fields');
  assert.equal((await s.callTool('list_expert_records',{kind:'agent',query:'Production changes'})).items.length,0,'an exclusion alone must not make a positive match');
  assert.equal((await service(f.store,{scope:'personal:other'}).callTool('list_expert_records',{kind:'agent',query:'customer'})).items.length,0);
  const listed=await s.callTool('list_expert_records',{kind:'agent'});assert(!Object.hasOwn(listed.items[0],'scope_summary'),'no-query metadata shape remains unchanged');
  for(const args of [{kind:'capture',query:'private'},{kind:'agent',query:'x'.repeat(201)},{kind:'agent',limit:26},{kind:'agent',limit:0}])await assert.rejects(()=>s.callTool('list_expert_records',args),e=>e.code==='invalid_arguments');
  f.db?.close();
 });
 test(`${backend}: task discovery caps results and UTF8 response bytes without returning knowledge or raw source content`,async()=>{
  const f=fixture(),s=await seeded(f.store),large='客户'.repeat(250);
  for(let i=0;i<30;i++)await s.callTool('create_expert_agent',write({id:'research-'+i,profile_id:'pm-profile',name:'Customer research '+i,scope:{task:'Customer evidence '+large,deliverables:Array.from({length:10},(_,index)=>large+' '+index),not_for:Array.from({length:10},(_,index)=>large+' '+index),review_rules:[]}}));
  const result=await s.callTool('list_expert_records',{kind:'agent',query:'customer',limit:25});assert(result.items.length>0&&result.items.length<=25);assert.equal(result.total_matches,30);assert(result.has_more);assert(new TextEncoder().encode(JSON.stringify(result)).length<30000);
  assert(result.items.every(row=>row.scope_summary.deliverables.length<=3&&row.scope_summary.not_for.length<=3));assert(result.next_action.includes('get_expert_record'));f.db?.close();
 });
}
