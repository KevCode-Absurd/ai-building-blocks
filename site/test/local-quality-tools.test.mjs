import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {selectLowest,saveWeekly} from '../../tools/qa/weekly-report.mjs';
import {licenceFindings,proseFindings} from '../../tools/qa/catalogue-audit.mjs';
const result=(slug,score,at='2026-10-27T00:00:00Z')=>({group:'general',slug,key:'general/'+slug,score,at,fixes:['A synthetic source-review suggestion.']});
test('weekly report uses the latest saved result per item and preserves imported items',()=>{
 const imported={...result('original',4),group:'imported',key:'imported/original'};
 const report=selectLowest([result('one',1),result('one',90,'2026-10-28T00:00:00Z'),result('two',30),imported]);
 assert.deepEqual(report.items.map(r=>[r.key,r.score]),[['imported/original',4],['general/two',30],['general/one',90]]);
 assert.equal(report.available,3);assert.match(report.items[0].scoreKind,/historical/);
});
test('invalid scores, dates, groups, missing items and path-shaped slugs never become a report item',()=>{
 const report=selectLowest([result('../escape',1),{...result('bad',1),group:'elsewhere'},result('score',101),result('date',1,'unknown'),result('absent',1),result('valid',40)],{exists:(_group,slug)=>slug!=='absent'});
 assert.equal(report.invalidResultRows,4);assert.equal(report.missingResultRows,1);assert.deepEqual(report.items.map(r=>r.key),['general/valid']);
 assert.throws(()=>selectLowest([],{limit:51}));
});
test('saved grades cannot imply a new review and later commits or dirty files are flagged',()=>{
 const report=selectLowest([result('edited',10),result('dirty',20),result('unknown',30),result('older',40)],{latestSource:new Map([['general/edited','2026-10-28T00:00:00Z'],['general/older','2026-10-26T00:00:00Z']]),dirty:new Set(['general/dirty'])});
 assert.equal(report.items[0].changedSinceScreen,true);assert.equal(report.items[1].sourceDirty,true);assert.equal(report.items[2].freshness,'source date unknown');assert.match(report.items[3].freshness,/not a new source review/);
});
test('weekly writes only its own stable report and refuses linked directories',t=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'abb-weekly-'));const outside=fs.mkdtempSync(path.join(os.tmpdir(),'abb-weekly-outside-'));
 t.after(()=>{for(const target of [root,outside]){const resolved=path.resolve(target);assert.equal(path.dirname(resolved),path.resolve(os.tmpdir()));assert.match(path.basename(resolved),/^abb-weekly-/);fs.rmSync(resolved,{recursive:true,force:true});}});
 const report={contentHash:'fixture',items:[]};assert.equal(saveWeekly(root,report).changed,true);const file=path.join(root,'reports/weekly-quality/latest.json');const before=fs.readFileSync(file);assert.equal(saveWeekly(root,report).changed,false);assert.deepEqual(fs.readFileSync(file),before);
 fs.unlinkSync(file);fs.rmdirSync(path.dirname(file));fs.symlinkSync(outside,path.dirname(file),process.platform==='win32'?'junction':'dir');
 try{assert.throws(()=>saveWeekly(root,report),/directory/);assert.deepEqual(fs.readdirSync(outside),[]);}finally{fs.unlinkSync(path.dirname(file));}
});
test('licence audit follows each sickn33 header and requires actual original licence files',()=>{
 const item={source:{by:'sickn33',licence:'CC-BY-4.0',licence_file:'LICENSE-CONTENT'},credits:[]};
 assert.deepEqual(licenceFindings('item.yaml',item,'# Original instructions', ['LICENSE-CONTENT']),[]);
 const mismatches=licenceFindings('item.yaml',item,'---\nlicense: MIT\n---\n# Original instructions', ['LICENSE-CONTENT']);assert.equal(mismatches[0].expected,'MIT');
 assert.equal(licenceFindings('item.yaml',item,'# Original instructions',[])[0].rule,'missing-original-licence');
});
test('licence and prose audits report problems without rewriting instructions or credits',()=>{
 const item={source:{by:'sickn33',licence:'Apache-2.0',licence_file:'LICENSE'},credits:[{used:'Copied as it is.'}]};
 const text='---\nlicense: Apache-2.0\n---\nAdded by AI Blocks\nRead https://amazon.com/book?tag=synthetic\nin the order Example teaches\n';const before=JSON.stringify(item);
 const found=licenceFindings('item.yaml',item,text,['LICENSE']);assert.ok(found.some(r=>r.rule==='missing-final-apache-change-note'));assert.ok(found.some(r=>r.rule==='changed-import-credit'));assert.equal(JSON.stringify(item),before);
 assert.deepEqual(proseFindings('SKILL.md',text).map(r=>r.rule),['affiliate-tag','claimed-source-order']);
});
test('name cleanup flags only a recorded old label, leaving purposeful link descriptions alone',()=>{
 const names=new Map([['synthetic',{name:'Current name',aliases:['Old name']}] ]);
 const text='[Old name](https://useaiblocks.com/skills/synthetic)\n[Make a useful result](https://useaiblocks.com/skills/synthetic)';
 assert.deepEqual(proseFindings('page.md',text,names),[{file:'page.md',rule:'old-link-label',line:1}]);
});
