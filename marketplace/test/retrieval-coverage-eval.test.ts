import test from 'node:test';
import assert from 'node:assert/strict';
const load = (rel:string):Promise<any> => import(rel);
test('retrieving one supporting passage cannot pass a multi-evidence question',async()=>{
  const {scoreCoverage}=await load('../scripts/eval-retrieval-coverage.mjs');
  const refs=[{file:'policy.md',quote:'Returns within seven days.'},{file:'policy.md',quote:'International orders excluded.'}];
  const first={path:'policy.md',text:'Returns within seven days.'};
  const partial=scoreCoverage([first,first],refs);
  assert.equal(partial.referenceRecall,.5); assert.equal(partial.allReferencesFound,false);
  const wrong=scoreCoverage([first,{path:'old-policy.md',text:refs[1].quote}],refs);
  assert.equal(wrong.found,1);
  const complete=scoreCoverage([first,{path:'policy.md',text:'International\n orders excluded.'}],refs);
  assert.equal(complete.referenceRecall,1); assert.equal(complete.allReferencesFound,true);
  assert.equal(scoreCoverage([],refs).referenceRecall,0);
  assert.throws(()=>scoreCoverage([],[]),/Nonempty/);
  assert.throws(()=>scoreCoverage([],[refs[0],refs[0]]),/Duplicate/);
  assert.throws(()=>scoreCoverage([],[{file:'policy.md',quote:''}]),/nonempty/);
});
test('coverage evaluation refuses stale annotations and invalid retrieval budgets',async()=>{
  const {evaluateCoverage}=await load('../scripts/eval-retrieval-coverage.mjs');
  assert.throws(()=>evaluateCoverage({questions:[]}),/No annotated/);
  const f={questions:[{id:'bad',role:'seo-specialist',q:'Returns?',references:[{file:'absent.md',quote:'No such source'}]}]};
  assert.throws(()=>evaluateCoverage(f),/Stale\/missing/);
  assert.throws(()=>evaluateCoverage(f,[0]),/integer/);
  assert.throws(()=>evaluateCoverage(f,[11]),/integer/);
});
