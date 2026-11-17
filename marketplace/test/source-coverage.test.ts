import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
// @ts-expect-error Portable audit script is exercised at runtime.
import {auditSourceCoverage,readSourceCoverage} from '../scripts/check-source-coverage.mjs';

test('source coverage distinguishes discarded, held and licensed material from missing evidence',()=>{
  const sources=[{id:'zero',cards:0,public:true,rights:'public_reference',why:'No useful mechanism.'},
    {id:'private',cards:1,public:false,rights:'licensed'}, {id:'public',cards:1,public:true,rights:'owned'}];
  const result=auditSourceCoverage(sources,[{id:'p1',source:'private',public:false},{id:'a1',source:'public',public:true}], [{card:{id:'h1',source:'zero'},problems:['Missing scope']}]);
  assert.equal(result.status,'PASS');
  assert.deepEqual(result.sources.map((s:any)=>s.disposition),['zero_accepted_cards','accepted_not_public','public_cards_available']);
  assert.equal(result.sources[0].held_cards,1);
  assert.equal(result.counts.public_eligible_cards,1);
  assert.match(result.interpretation,/not a missing source/);
});

test('stale inventory counts, duplicate identities, orphan references and publication leaks fail',()=>{
  const result=auditSourceCoverage([{id:'s',cards:1,rights:'licensed',public:false},{id:'s',cards:1,rights:'licensed',public:false}],
    [{id:'a',source:'s',public:true},{id:'a',source:'s',public:false},{id:'b',source:'missing',public:false}]);
  assert.equal(result.status,'FAIL');
  assert.match(result.errors.join('\n'),/reported 1 cards, found 2/);
  assert.match(result.errors.join('\n'),/Duplicate source id/);
  assert.match(result.errors.join('\n'),/Duplicate card id/);
  assert.match(result.errors.join('\n'),/source not inventoried/);
  assert.match(result.errors.join('\n'),/public card references non-public source/);
  assert.equal(auditSourceCoverage([{id:'s',cards:0,rights:'study_only',public:true}],[]).status,'FAIL');
});

test('every real ecommerce source count reconciles to accepted cards and public boundaries',()=>{
  const report=readSourceCoverage(fileURLToPath(new URL('../knowledge/ecommerce/',import.meta.url)));
  assert.deepEqual(report.errors,[]);
  assert.ok(report.counts.accepted_cards>0);
  assert.ok(report.counts.zero_accepted_sources>0,'Known discarded sources remain inventoried');
  assert.ok(report.counts.accepted_nonpublic_sources>0,'Licensed knowledge remains separate');
});
