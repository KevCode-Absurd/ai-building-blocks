import {test} from 'node:test';
import assert from 'node:assert/strict';
import {validateFactCheck,factCheckView} from '../src/lib/fact-checks.ts';
const docs={status:'docs_checked',scope:'Synthetic command flags in the cited documentation.',checked_on:'2026-10-28',sources:['https://example.invalid/docs']};
test('documentation dates retain their narrow scope and never assert a successful live run',()=>{
 const row=validateFactCheck(docs,'2026-10-29'),view=factCheckView(row,'2026-10-29');assert.equal(view.needsCheck,false);assert.equal(view.ageDays,1);assert.match(view.notes.join(' '),/Documentation check only/);assert.equal('tested' in row,false);
});
test('source-stated dates and failed attempts cannot become independent verification',()=>{
 const source=validateFactCheck({status:'source_dated',scope:'Synthetic author-stated source date.',source_date:'2026-08-15',sources:docs.sources},'2026-10-29');
 assert.equal(source.checked_on,undefined);assert.equal(factCheckView(source,'2026-10-29').old,true);assert.match(factCheckView(source,'2026-10-29').notes.join(' '),/not independently checked/);
 const attempted=validateFactCheck({status:'not_checked',scope:'Synthetic inaccessible pricing source.',attempted_on:'2026-10-28',sources:docs.sources},'2026-10-29');assert.equal(factCheckView(attempted,'2026-10-29').needsCheck,true);assert.equal(attempted.checked_on,undefined);
 assert.throws(()=>validateFactCheck({...attempted,checked_on:'2026-10-28'},'2026-10-29'),/cannot claim/);
});
test('recheck warning begins after sixty days and source drift overrides a recent date',()=>{
 assert.equal(factCheckView(docs,'2026-12-27').old,false);assert.equal(factCheckView(docs,'2026-12-28').old,true);
 assert.equal(factCheckView({...docs,source_matches:false},'2026-10-29').needsCheck,true);
});
test('impossible, future and unsafe source records are rejected without echoing their contents',()=>{
 for(const checked_on of ['2026-02-30','2026-13-01','2026-10-30','today'])assert.throws(()=>validateFactCheck({...docs,checked_on},'2026-10-29'),/Invalid or future/);
 for(const sources of [[],['javascript:alert(1)'],['https://user:password@example.invalid/docs']])assert.throws(()=>validateFactCheck({...docs,sources},'2026-10-29'));
 assert.throws(()=>validateFactCheck({...docs,checked_on:undefined},'2026-10-29'),/actual date/);
});
