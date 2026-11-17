import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
// @ts-expect-error Portable JavaScript implementation is exercised directly.
import {recordsFromCapture} from '../../catalogue-items/general/brand-dna-capture/scripts/org-context.mjs';
const script=readFileSync(new URL('../../catalogue-items/general/brand-dna-capture/scripts/brand-dna-snippet.js',import.meta.url),'utf8');
// Execute the actual production extraction block, without mocking its matching or clipping rules.
const extraction=script.split('// ---------- live facts ----------')[1].split('// ---------- page meta and CSS tokens ----------')[0];
const clean=script.match(/  function clean\(s, max\) \{[^\n]+/)![0];
function capture(text:string):any {
 const env={body:{innerText:text},location:{href:'https://fixture.invalid/policy'},doc:{querySelectorAll:()=>[],querySelector:()=>null},priceRe:/\$\d+/,notes:[],uniq:(x:any[])=>[...new Set(x)]};
 return vm.runInNewContext(`${clean}\n${extraction}\n({facts,notes})`,env);
}
test('actual snippet retains policy exclusions after the former200character boundary',()=>{
 const text='Our seven-day returns apply to qualifying purchases. '+ 'Detailed conditions must be read before ordering. '.repeat(8)+'India orders only. No returns or exchanges for international orders.';
 const {facts}=capture(text);assert.equal(facts.guarantees[0],text);assert.equal(facts.capture.truncated,false);
 const records=recordsFromCapture({pages:[{url:'https://fixture.invalid/policy',path:'/policy',captured_at:'2026-11-17',desktop:{facts}}]});
 assert.ok([...records.facts,...records.offers].some((x:any)=>x.value===text));
});
test('qualifying clauses survive beyond16earlier guarantee records',()=>{
 const text=Array.from({length:30},(_,i)=>`Warranty condition ${i}.`).join('\n')+'\nSilver products cannot be exchanged under this policy.';
 const {facts}=capture(text);assert.equal(facts.guarantees.length,31);assert.equal(facts.guarantees.at(-1),'Silver products cannot be exchanged under this policy.');
});
test('oversized policy is omitted with explicit truncation, never a misleading partial guarantee',()=>{
 const {facts,notes}=capture('Returns allowed. '+ 'Long condition. '.repeat(2000)+' Except custom products.');
 assert.equal(facts.guarantees.length,0);assert.equal(facts.capture.truncated,true);assert.ok(notes[0].includes('never clipped'));
});
test('category and total budgets remain bounded and visibly incomplete',()=>{
 const category=capture(Array.from({length:150},(_,i)=>`Warranty ${i}`).join('\n')).facts;
 assert.equal(category.guarantees.length,128);assert.equal(category.capture.omitted,22);
 const budget=capture(Array.from({length:100},(_,i)=>`Warranty ${i}: `+'clause '.repeat(2000)).join('\n')).facts;
 assert.equal(budget.capture.truncated,true);assert.ok(budget.guarantees.join('').length<=262144);
});
test('partial capture cannot automatically promote its remaining policy snippets as live facts',()=>{
 const {facts}=capture('Returns available.\n'+'Warranty '+ 'x'.repeat(17000));
 const records=recordsFromCapture({pages:[{url:'https://fixture.invalid',path:'/',captured_at:'2026-11-17',desktop:{facts}}]});
 assert.equal(records.facts.length,1);assert.equal(records.facts[0].status,'unconfirmed');assert.equal(records.facts[0].capture_truncated,true);
});
test('customer quotations are not converted into merchant policy and identical lines deduplicate',()=>{
 const {facts}=capture('“Best warranty ever.”\nReturns apply in India.\nReturns apply in India.');
 assert.deepEqual(Array.from(facts.guarantees),['Returns apply in India.']);
});
