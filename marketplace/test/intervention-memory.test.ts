import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
// @ts-expect-error Portable JavaScript tool ships unchanged in packs.
import {validateInterventionEpisode, main} from '../../catalogue-items/general/brand-dna-capture/scripts/org-context.mjs';
const scope = {owner_id:'owner',workspace_id:'workspace',brand_id:'brand',platform:'meta',account_id:'account'};
const now = new Date('2026-11-17T12:00:00Z');
function fixture(t: any) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(),'intervention-'));
  t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  const episode:any = {schema_version:'intervention/v1',id:'budget-test-1',scope,hypothesis:'Qualified acquisition improves',success_metric:'cpa',guardrail_metric:'spend',
    change:{at:'2026-11-08T00:00:00Z',summary:'One bounded budget change',target:{type:'campaign',id:'campaign-1'},expected:{budget:100,status:'ACTIVE'},authorization_ref:'host grant fixture'},maturity:{not_before:'2026-11-15T00:00:00Z',rule:'Account conversion lag plus full reporting window'},
    confounders:[],counterevidence:[],evidence:{},lesson:{status:'proposed'}};
  const data:any = {
    baseline:{window:{start:'2026-11-01T00:00:00Z',end:'2026-11-08T00:00:00Z',timezone:'UTC'},coverage:{complete:true,represented:100,total:100},metrics:{cpa:{value:20,unit:'USD/customer',definition:'spend / qualified customers'},spend:{value:100,unit:'USD',definition:'billed spend'}}},
    outcome:{window:{start:'2026-11-08T00:00:00Z',end:'2026-11-15T00:00:00Z',timezone:'UTC'},coverage:{complete:true,represented:100,total:100},mature:true,metrics:{cpa:{value:18,unit:'USD/customer',definition:'spend / qualified customers'},spend:{value:100,unit:'USD',definition:'billed spend'}}},
    receipt:{accepted:true,changeId:'attempt-1'},readback:{matches_expected:true,observed:{budget:100,status:'ACTIVE'}}
  };
  const put=(key:string)=>{
    data[key].scope ??= scope;
    data[key].intervention_id ??= episode.id;
    data[key].target ??= {...episode.change.target};
    data[key].source ??= {locator:`fixture:${key}`,captured_at:key==='baseline'?'2026-11-08T00:00:00Z':'2026-11-16T00:00:00Z'};
    const raw=JSON.stringify(data[key]);fs.writeFileSync(path.join(root,`${key}.json`),raw);
    episode.evidence[key]={path:`${key}.json`,sha256:createHash('sha256').update(raw).digest('hex')};
  };
  Object.keys(data).forEach(put);
  return {root,episode,data,put,check:()=>validateInterventionEpisode(episode,{scope,root,now})};
}
test('mature, pinned, same-scope intervention is eligible for review, never promoted or declared causal',t=>{
  const f=fixture(t),result=f.check();assert.equal(result.eligible_for_review,true);assert.equal(result.status,'review_ready');
  assert.equal(result.lesson_status,'proposed');assert.match(result.limitation,/No connector authenticity, causal improvement/);
});
test('failed receipt with a change ID and confident summary cannot become success',t=>{
  const f=fixture(t);f.episode.summary='Succeeded';f.data.receipt.success=false;f.put('receipt');
  assert.ok(f.check().issues.some((i:any)=>i.code==='change_not_accepted'));
  f.data.receipt.success=true;f.data.receipt.partial_failure=true;f.put('receipt');assert.equal(f.check().eligible_for_review,false);
});
test('future review date or outcome captured before maturity stays unresolved even after time passes',t=>{
  const f=fixture(t);f.episode.maturity.not_before='2026-11-20T00:00:00Z';assert.ok(f.check().issues.some((i:any)=>i.code==='immature'));
  f.episode.maturity.not_before='2026-11-15T00:00:00Z';f.data.outcome.source.captured_at='2026-11-14T00:00:00Z';f.put('outcome');assert.equal(f.check().eligible_for_review,false);
});
test('cross-account episode or artifact cannot be reused as local operating history',t=>{
  const f=fixture(t);f.data.outcome.scope={...scope,account_id:'other'};f.put('outcome');assert.match(JSON.stringify(f.check().issues),/scope does not match/);
  f.episode.scope={...scope,brand_id:'other'};assert.ok(f.check().issues.some((i:any)=>i.code==='scope_mismatch'));
});
test('partial extract and incompatible metric definitions block conclusions',t=>{
  const f=fixture(t);f.data.outcome.coverage.represented=20;f.put('outcome');assert.ok(f.check().issues.some((i:any)=>i.code==='partial_data'));
  f.data.outcome.metrics.cpa.definition='spend / platform events';f.put('outcome');assert.ok(f.check().issues.some((i:any)=>i.code==='incomparable_metric'));
});
test('artifact mutation, missing readback and traversal never count as verified evidence',t=>{
  const f=fixture(t);fs.appendFileSync(path.join(f.root,'receipt.json'),' ');assert.match(JSON.stringify(f.check().issues),/hash changed/);
  delete f.episode.evidence.readback;assert.equal(f.check().eligible_for_review,false);
  f.episode.evidence.outcome.path='../outside.json';assert.match(JSON.stringify(f.check().issues),/safe relative path/);
});
test('review retains counterevidence and confounders without automatically accepting a lesson',t=>{
  const f=fixture(t);f.episode.confounders=['Promotion launched concurrently'];f.episode.counterevidence=['Refunds increased'];
  assert.deepEqual(f.check().confounders,f.episode.confounders);assert.equal(f.check().eligible_for_review,true);
  f.episode.lesson.status='approved';assert.ok(f.check().issues.some((i:any)=>i.code==='unreviewed_promotion'));
});
test('CLI reads the existing job episode without persisting or rewriting memory',t=>{
  const f=fixture(t),file=path.join(f.root,'intervention.json');fs.writeFileSync(file,JSON.stringify(f.episode));const before=fs.readFileSync(file,'utf8');
  const output:string[]=[];assert.equal(main(['intervention-check',file,'--dir',path.join(f.root,'context'),'--owner','owner','--workspace','workspace','--brand','brand','--platform','meta','--account','account','--today','2026-11-17'],(s:string)=>output.push(s)),0);
  assert.equal(JSON.parse(output[0]).eligible_for_review,true);assert.equal(fs.readFileSync(file,'utf8'),before);assert.equal(fs.existsSync(path.join(f.root,'context')),false);
});


test('same-account artifacts for another intervention or target cannot verify this change',t=>{
  const f=fixture(t);
  for (const key of ['baseline','receipt','readback','outcome']) {
    f.data[key].intervention_id='another-intervention';f.put(key);assert.equal(f.check().eligible_for_review,false);
    f.data[key].intervention_id=f.episode.id;f.data[key].target.id='another-campaign';f.put(key);assert.equal(f.check().eligible_for_review,false);
    f.data[key].target.id=f.episode.change.target.id;f.put(key);
  }
  assert.equal(f.check().eligible_for_review,true);
});

test('readback flag cannot override actual state mismatch or absent expected state',t=>{
  const f=fixture(t);f.data.readback.observed.budget=999;f.put('readback');assert.ok(f.check().issues.some((i:any)=>i.code==='readback_unverified'));
  f.data.readback.observed={status:'ACTIVE'};f.put('readback');assert.equal(f.check().eligible_for_review,false);
  delete f.episode.change.expected;assert.ok(f.check().issues.some((i:any)=>i.code==='invalid_expected_state'));
});

test('receipt booleans reject strings, numbers and null instead of concealing failure',t=>{
  const f=fixture(t);
  for (const key of ['accepted','success','partial_failure']) for (const value of ['false','true',0,1,null]) {
    f.data.receipt[key]=value;f.put('receipt');assert.ok(f.check().issues.some((i:any)=>i.code==='invalid_receipt_status'));
    if(key==='accepted') f.data.receipt[key]=true;else delete f.data.receipt[key];
  }
});

test('impossible calendar dates, ambiguous timestamps and invalid zones cannot become review ready',t=>{
  const f=fixture(t);
  for (const invalid of ['2026-02-30T00:00:00Z','2026-11-08T01:00:00','2026-11-08','2026-11-08T24:00:00Z','2026-11-08T00:00:00+14:30']) {
    f.episode.change.at=invalid;assert.ok(f.check().issues.some((i:any)=>i.code==='invalid_change_date'));
  }
  f.episode.change.at='2026-11-08T00:00:00Z';
  f.data.baseline.window.timezone=f.data.outcome.window.timezone='not-a-timezone';f.put('baseline');f.put('outcome');
  assert.ok(f.check().issues.some((i:any)=>i.code==='invalid_window'));
  f.data.baseline.window.timezone=f.data.outcome.window.timezone='Asia/Kolkata';f.put('baseline');f.put('outcome');assert.equal(f.check().eligible_for_review,true);
  f.data.outcome.source.captured_at='2026-11-16T02:00:00';f.put('outcome');assert.equal(f.check().eligible_for_review,false);
});

test('cross-scope episodes with private counterevidence are withheld before artifact inspection',t=>{
  const f=fixture(t);f.episode.scope={...scope,owner_id:'another-owner'};f.episode.confounders=['Private campaign detail'];f.episode.counterevidence=['Private customer data'];
  const result=f.check();assert.equal(result.episode_id,null);assert.deepEqual(result.source_hashes,{});assert.deepEqual(result.confounders,[]);assert.deepEqual(result.counterevidence,[]);
});
