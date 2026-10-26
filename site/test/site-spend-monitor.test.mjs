import {test} from 'node:test';
import assert from 'node:assert/strict';
import {estimateSpend,decisionFor,pauseBindings,sameSettingsExceptEnable} from '../../tools/lib/site-spend-policy.mjs';
const when=Date.parse('2026-10-23T12:00:00Z');
const metrics=()=>({workers:[{sum:{requests:1000,cpuTimeUs:1000000}}],d1:[{sum:{rowsRead:100,rowsWritten:5}}],d1Storage:[{max:{databaseSizeBytes:1000}}],r2:[],r2Storage:[{max:{payloadSize:1000,metadataSize:100}}]});
test('includes ledger reservations, CPU in microseconds, requests, storage, fixed fees and a delay buffer',()=>{
 const e=estimateSpend(metrics(),2,null,when);assert.equal(e.costs.aiAndReservations,2);assert.equal(e.costs.workerCpu,.00002);assert.equal(e.costs.workerRequests,.0003);assert(e.costs.d1Storage>0&&e.costs.r2Storage>0&&e.costs.fixedHosting>0);assert(e.bufferUSD>=1);assert(e.estimatedUSD>3);
});
test('warns once per day at ten, pauses at twelve and keeps a pause across midnight until manual review',()=>{
 assert.equal(decisionFor({estimatedUSD:9.99,day:'a'}).status,'healthy');
 assert.deepEqual(decisionFor({estimatedUSD:10,day:'a'}),{status:'warning',reason:'approaching_daily_budget',notify:true});
 assert.equal(decisionFor({estimatedUSD:11,day:'a'},{warningDay:'a'}).notify,false);
 assert.equal(decisionFor({estimatedUSD:10,day:'b'},{warningDay:'a'}).notify,true);
 assert.equal(decisionFor({estimatedUSD:12,day:'a'}).status,'paused');
 assert.equal(decisionFor({estimatedUSD:0,day:'b'},{pauseLatched:true,status:'paused'}).status,'paused');
});
test('missing, invalid, truncated or unavailable metrics never become zero-dollar estimates',()=>{
 for(const field of ['workers','d1','d1Storage','r2','r2Storage']){const m=metrics();delete m[field];assert.throws(()=>estimateSpend(m,0,null,when));}
 for(const bad of [NaN,Infinity,-1,undefined,'0'])assert.throws(()=>estimateSpend(metrics(),bad,null,when));
 const m=metrics();m.workers[0].sum.cpuTimeUs=null;assert.throws(()=>estimateSpend(m,0,null,when));
 const many=metrics();many.r2=Array.from({length:1000},()=>({}));assert.throws(()=>estimateSpend(many,0,null,when));
});
test('daily high water prevents released reservations or sampled metrics resetting the spend estimate',()=>{
 const previous=estimateSpend(metrics(),7,null,when);const later=estimateSpend(metrics(),0,previous,when+300000);assert.equal(later.estimatedUSD,previous.estimatedUSD);
 const tomorrow=estimateSpend(metrics(),0,previous,when+86400000);assert(tomorrow.estimatedUSD<previous.estimatedUSD);
});
test('fast burn adds fifteen minutes of headroom and recovery after a first failed check stays finite',()=>{
 const previous=estimateSpend(metrics(),0,null,when);const later=estimateSpend(metrics(),3,previous,when+300000);assert(later.bufferUSD>=9);
 const recovered=estimateSpend(metrics(),0,{day:'2026-10-23',checkedAt:new Date(when-300000).toISOString(),status:'error'},when);assert(Number.isFinite(recovered.estimatedUSD));
});
test('R2 billing-unit rounding is reserved; reported usage is conservatively charged without free allowances',()=>{
 const m=metrics();m.r2=[{sum:{requests:1,responseObjectSize:1}}];const e=estimateSpend(m,0,null,when);assert.equal(e.costs.r2RoundingReserve,9);assert(e.estimatedUSD>=10);
});
test('pause payload changes only the AI enable flag and never copies secret values',()=>{
 const before={annotations:{x:'y'},limits:{cpu_ms:1000},bindings:[{name:'COMPOSER',type:'d1',id:'db'},{name:'OPENAI_API_KEY',type:'secret_text'},{name:'WORKFLOW_COMPOSER_ENABLED',type:'plain_text',text:'true'},{name:'WORKFLOW_DAILY_CAP_USD',type:'plain_text',text:'10'}]};
 assert.deepEqual(pauseBindings(before),[{name:'COMPOSER',type:'inherit'},{name:'OPENAI_API_KEY',type:'inherit'},{name:'WORKFLOW_COMPOSER_ENABLED',type:'plain_text',text:'false'},{name:'WORKFLOW_DAILY_CAP_USD',type:'inherit'}]);
 const after=structuredClone(before);after.bindings.find(b=>b.name==='WORKFLOW_COMPOSER_ENABLED').text='false';assert.deepEqual(sameSettingsExceptEnable(after),sameSettingsExceptEnable(before));assert.throws(()=>pauseBindings({bindings:[]}));
});
