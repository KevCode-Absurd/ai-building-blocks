import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const tool=fileURLToPath(new URL('../packs/shared/tools/quality/numbers.cjs',import.meta.url));
function check(figures:unknown,body:string){const dir=mkdtempSync(path.join(tmpdir(),'numbers-comparison-'));try{const ledger=path.join(dir,'numbers.json'),final=path.join(dir,'final.md');writeFileSync(ledger,JSON.stringify(figures));writeFileSync(final,body);return spawnSync(process.execPath,[tool,ledger,'--final',final],{encoding:'utf8'});}finally{rmSync(dir,{recursive:true,force:true});}}
const rate=(id:string,value:number,period:string,basis:string)=>({id,value,unit:'percent',period,basis,source:'Illustrative regression evidence'});
const money=(id:string,value:number,period:string,basis='gross profit')=>({id,value,unit:'USD',period,basis,source:'Illustrative regression evidence'});
const earlier='2026-10-01 to 2026-10-14',later='2026-10-15 to 2026-10-28';

test('support before/after comparison keeps distinct cohorts and does not cross-bind counts to rates',()=>{const r=check([rate('before_deflection',40,earlier,'deflection'),rate('after_deflection',70,later,'deflection'),rate('before_repeat',10,earlier,'repeat_contact'),rate('after_repeat',20,later,'repeat_contact'),rate('before_complaints',3,earlier,'complaint_order_ratio'),rate('after_complaints',5,later,'complaint_order_ratio')],`| Measure | Earlier | Later | Meaning |
|---|---|---|---|
| Automated answer, no immediate handoff | 80/200 = 40% | 140/200 = 70% | Resolution unverified |
| At least one repeat contact within 14 days | 20/200 = 10% | 40/200 = 20% | Worsening friction |
| Complaints / orders | 30/1,000 = 3% | 50/1,000 = 5% | Period ratio |
`);assert.equal(r.status,0,r.stdout+r.stderr);assert.doesNotMatch(r.stdout,/FAIL|mixes two money bases/);assert.match(r.stdout,/source window coexist.*needs review/);});

test('recognized earlier/later and before/after headers permit source windows in separate columns',()=>{for(const [before,after] of [['Earlier','Later'],['Before','After'],['Previous','Current']]){const r=check([money('a',110,earlier),money('b',220,later)],`| Metric | ${before} | ${after} |\n|---|---|---|\n| Gross profit | $110 | $220 |\n`);assert.equal(r.status,0,r.stdout);}});

test('comparison labels do not exempt mixing daily and monthly figures inside one cell',()=>{const r=check([],`| Measure | Before | After |\n|---|---|---|\n| Savings | $100 a day and $200 a month | $300 a month |\n`);assert.equal(r.status,1);assert.match(r.stdout,/column "Before": mixes two periods \(day, month\)/);});

test('the same compared measure still fails when before/after values use different money bases',()=>{const r=check([money('a',110,earlier,'gross profit'),money('b',220,later,'revenue')],`| Measure | Before | After |\n|---|---|---|\n| Benefit | $110 | $220 |\n`);assert.equal(r.status,1);assert.match(r.stdout,/mixes two money bases/);});

test('coincidental numerators cannot inherit percentage or currency ledger metadata',()=>{const r=check([rate('unrelated_rate',40,later,'deflection'),money('unrelated_money',20,later,'revenue'),rate('actual_rate',10,earlier,'repeat_contact')],`| Metric | Value |\n|---|---|\n| Repeat contact | 20/200 = 10% |\n| Other count | 40 cases |\n`);assert.equal(r.status,0,r.stdout);assert.doesNotMatch(r.stdout,/mixes two/);});

test('equal compatible ledger values make association unknown instead of certifying a guessed basis',()=>{const r=check([money('a',110,earlier,'gross profit'),money('b',110,later,'revenue')],`| Item | Amount |\n|---|---|\n| A | $110 |\n`);assert.equal(r.status,0,r.stdout);assert.match(r.stdout,/multiple compatible ledger figures.*association is unknown, not verified/);});

test('ordinary single columns still reject inferred relative and absolute source-window mixtures',()=>{for(const [a,b]of [['month','quarter'],[earlier,later]]){const r=check([money('a',110,a),money('b',220,b)],`| Item | Amount |\n|---|---|\n| A | $110 |\n| B | $220 |\n`);assert.equal(r.status,1,r.stdout);assert.match(r.stdout,/column "Amount": mixes two periods/);}});

test('follow-up duration and dated cohort are reviewed as different dimensions, not a contradiction',()=>{const r=check([rate('repeat',10,earlier,'repeat_contact')],`| Metric | Value |\n|---|---|\n| Repeat within 14 days | 10% |\n`);assert.equal(r.status,0,r.stdout);assert.match(r.stdout,/metric duration\/reporting rate and an absolute source window coexist/);assert.doesNotMatch(r.stdout,/FAIL/);});

test('mixed-window formulas and incorrect arithmetic remain hard failures',()=>{const mixed=check([money('a',110,earlier),money('b',220,later),{...money('sum',330,earlier),formula:'a+b'}],'');assert.equal(mixed.status,1);assert.match(mixed.stdout,/formula mixes periods/);const bad=check([{...rate('incorrect',11,earlier,'repeat_contact'),formula:'numer / denom * 100',inputs:{numer:20,denom:200}}],'');assert.equal(bad.status,1);assert.match(bad.stdout,/written as 11 but its formula gives 10/);});


test('before/after columns may separate cohorts but cannot hide incompatible daily and monthly rates',()=>{const figures=[money('before',110,'month'),money('after',220,'day')];for(const cells of [['$110 a month','$220 a day'],['$110','$220']]){const r=check(figures,`| Measure | Before | After |\n|---|---|---|\n| Gross profit | ${cells[0]} | ${cells[1]} |\n`);assert.equal(r.status,1,r.stdout);assert.match(r.stdout,/comparison mixes reporting periods \(month, day\)/);}const comparable=check([money('before',110,'month'),money('after',220,'month')],`| Measure | Before | After |\n|---|---|---|\n| Gross profit | $110 a month | $220 a month |\n`);assert.equal(comparable.status,0,comparable.stdout);});


test('missing legacy units cannot silently certify ledger metadata or revive unsafe value-only binding',()=>{const r=check([{id:'a',value:110,period:'month',basis:'gross profit',source:'Synthetic'},{id:'b',value:220,period:'day',basis:'revenue',source:'Synthetic'}],`| Item | Amount |\n|---|---|\n| A | $110 |\n| B | $220 |\n`);assert.equal(r.status,0,r.stdout);assert.match(r.stdout,/missing or unsupported unit.*association is unknown, not verified/);assert.doesNotMatch(r.stdout,/FAIL/);});
