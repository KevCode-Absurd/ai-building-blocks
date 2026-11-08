import test from 'node:test';
import assert from 'node:assert/strict';
import {validateWorkContext} from '../src/jobs/work-context.mjs';
import {validateProductionQuality} from '../src/jobs/execution-quality.mjs';
import {workContext} from './fixtures/jobs/work-context-fixture.mjs';

// Structural synthetic evidence, not a real retention review or quality result.
const request='Review and improve the existing operating document and its source notes';
const acceptance=[{id:'correct',criterion:'Keep source-correct facts.',threshold:'Every fact is supported.',critical:true},{id:'usable',criterion:'Readers can find the next step.',threshold:'The next action is identifiable.',critical:true}];
const artifacts=[{path:'project/current.md',sha256:'b'.repeat(64),checks:[{id:'source',status:'PASS'}]},{path:'project/notes.md',sha256:'c'.repeat(64),checks:[{id:'source',status:'PASS'}]}];
const clone=structuredClone;
function retained(){
  const context=workContext(artifacts);
  context.changes=[];
  context.sources.push({...clone(context.sources[0]),id:'current-notes',ref:'project/notes.md',sha256:artifacts[1].sha256});
  context.sources.forEach(source=>{source.observations=['Inspected this current source; its supported content and next action already satisfy this fixture request.'];});
  context.retention={reason:'The inspected current files satisfy the accepted job; a rewrite has no supported benefit.',request_review:{observation:'Reviewed the original request and each requested edit against the current source. No required edit remains unresolved in this synthetic record.',receipt:'receipts/request-review.json'},artifacts:artifacts.map((artifact,index)=>({path:artifact.path,sha256:artifact.sha256,source_id:index?'current-notes':'current-work'})),criteria:artifacts.flatMap(artifact=>acceptance.map(criterion=>({id:criterion.id,artifact_path:artifact.path,artifact_sha256:artifact.sha256,status:'PASS',observation:'Observed the accepted criterion in the exact current source; no supported change needed.',receipt:'receipts/retention-review.json'})))};
  context.comparison.results.forEach(row=>{row.baseline_observation='Current source meets the accepted criterion.';row.result_observation='The same current source remains unchanged.';});
  return context;
}
const validate=context=>validateWorkContext(context,{request,acceptance,artifacts,production:true});

test('review can retain exact current native bytes without inventing changes or weakening check assurance',()=>{
  assert.equal(validate(retained()).ok,true);
  const context=retained(),document={artifacts:clone(artifacts),work_context:context};
  const card={request_verbatim:request,acceptance,work_context:clone(context)};
  const result=validateProductionQuality({document,card});
  assert.equal(result.ok,true,JSON.stringify(result.errors));
  assert.equal(result.assurance,'HOST_REPORTED_NOT_INDEPENDENTLY_VERIFIED');
  document.artifacts[0].checks[0].status='NOT_RUN';
  assert.equal(validateProductionQuality({document,card}).ok,false);
});

test('scope may propose retention with pending checks but production and missing accepted criteria stay blocked',()=>{
  const context=retained();context.retention.criteria[0].status='NOT_RUN';
  assert.equal(validateWorkContext(context,{request,acceptance}).ok,true);
  assert.equal(validate(context).ok,false);
  context.retention.criteria[0].status='FAIL';assert.equal(validate(context).ok,false);
  assert.equal(validateWorkContext(retained(),{request,production:true,artifacts}).ok,false);
  assert.equal(validateWorkContext(retained(),{request,production:true,artifacts,acceptance:[acceptance[0],acceptance[0]]}).ok,false);
});

test('no-op is explicit and cannot coexist with changes or disguise another work mode',()=>{
  for(const mutate of [c=>{delete c.retention;},c=>{c.changes=workContext().changes;},c=>{c.mode='ASSESS';},c=>{c.mode='CREATE';},c=>{c.retention.reason=' ';},c=>{c.retention.request_review.observation='';},c=>{c.retention.request_review.receipt='';}]){
    const context=retained();mutate(context);assert.equal(validate(context).ok,false);
  }
  // Existing non-retention change records keep their previous behavior.
  assert.equal(validateWorkContext(workContext(artifacts),{request,production:true,artifacts}).ok,true);
});

test('every unchanged file requires its exact inspected CURRENT baseline source',()=>{
  for(const mutate of [c=>{c.retention.artifacts[0].source_id='missing';},c=>{c.sources[0].role='REFERENCE';},c=>{c.sources[0].currentness='UNKNOWN';},c=>{c.sources[0].currentness='STALE';},c=>{c.sources[0].sha256='d'.repeat(64);},c=>{c.sources[0].receipt='';},c=>{c.preserve=[];}]){
    const context=retained();mutate(context);assert.equal(validate(context).ok,false);
  }
});

test('retained mapping and actual artifacts must have equal path/hash sets without duplicate or case-colliding paths',()=>{
  for(const mutate of [
    (c,a)=>{a.pop();},(c,a)=>{a.push({path:'project/new.md',sha256:'d'.repeat(64)});},
    (c,a)=>{a[0].sha256='d'.repeat(64);},(c,a)=>{a[0].path='project/renamed.md';},
    (c,a)=>{a[0].path='Project/current.md';},(c,a)=>{a.push(clone(a[0]));},
    (c,a)=>{a.push({...clone(a[0]),path:'PROJECT/current.md'});},
    c=>{c.retention.artifacts.push(clone(c.retention.artifacts[0]));},
    c=>{c.retention.artifacts.push({...clone(c.retention.artifacts[0]),path:'PROJECT/current.md'});},
    c=>{c.retention.artifacts[0].path='../current.md';},c=>{c.retention.artifacts[0].path='project//current.md';},
  ]){const context=retained(),actual=clone(artifacts);mutate(context,actual);assert.equal(validateWorkContext(context,{request,acceptance,artifacts:actual,production:true}).ok,false);}
});

test('all actual accepted criteria and artifacts need unique exact observations; invented or omitted rows fail',()=>{
  for(const mutate of [c=>{c.retention.criteria=c.retention.criteria.filter(row=>row.id!=='usable');},c=>{c.retention.criteria=c.retention.criteria.filter(row=>row.artifact_path!==artifacts[1].path);},c=>{c.retention.criteria[0].id='invented';},c=>{c.retention.criteria.push(clone(c.retention.criteria[0]));},c=>{c.retention.criteria[0].artifact_path='project/other.md';},c=>{c.retention.criteria[0].artifact_path='PROJECT/current.md';},c=>{c.retention.criteria[0].artifact_sha256='d'.repeat(64);},c=>{c.retention.criteria[0].observation='';},c=>{c.retention.criteria[0].receipt='';},c=>{c.retention.criteria[0].status='APPROVED';}]){
    const context=retained();mutate(context);assert.equal(validate(context).ok,false);
  }
  const context=retained();context.comparison.results[0].status='NOT_RUN';assert.equal(validate(context).ok,false);
});

test('an updated production context cannot silently discard accepted baseline snapshots or preservation rules',()=>{
  const context=retained(),card={request_verbatim:request,acceptance,work_context:clone(context)},document={artifacts:clone(artifacts),work_context:context};
  card.work_context.sources.push({...clone(card.work_context.sources[0]),id:'accepted-original',sha256:'e'.repeat(64)});
  assert.equal(validateProductionQuality({document,card}).ok,false);
  card.work_context=clone(context);card.work_context.preserve.push({rule:'Retain this separately scoped invariant.',source_id:'current-work'});
  assert.equal(validateProductionQuality({document,card}).ok,false);
});

test('malformed retention inputs fail safely without throwing',()=>{
  for(const value of [null,false,{},[],{...retained().retention,artifacts:[null]},{...retained().retention,criteria:[false]}]){
    const context=retained();context.retention=value;
    assert.doesNotThrow(()=>validate(context));assert.equal(validate(context).ok,false);
  }
});
