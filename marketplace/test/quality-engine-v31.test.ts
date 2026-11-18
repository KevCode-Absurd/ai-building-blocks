import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const tools=fileURLToPath(new URL('../packs/shared/tools/',import.meta.url));
const dir=mkdtempSync(path.join(tmpdir(),'quality-v31-'));
const put=(name:string,text:string)=>{const file=path.join(dir,name);writeFileSync(file,text);return file;};
const run=(tool:string,...args:string[])=>spawnSync(process.execPath,[path.join(tools,tool),...args],{encoding:'utf8'});

test('requested template fields survive while internal and unfinished markers still fail',()=>{
  const file=put('template.md','# Quarterly update\n\nOwner: {{owner}}\nActual result: [insert actual result]\n');
  assert.equal(run('quality/leakcheck.cjs',file).status,1);
  assert.equal(run('quality/leakcheck.cjs',file,'--requested-template').status,0);
  assert.equal(run('check-handover.mjs',file).status,1);
  assert.equal(run('check-handover.mjs',file,'--requested-template').status,0);
  const bad=put('internal.md','[INTERNAL] Finish later.\nTODO\nOwner: {{owner}}');
  assert.equal(run('quality/leakcheck.cjs',bad,'--requested-template').status,1);
  assert.equal(run('check-handover.mjs',bad,'--requested-template').status,1);
});

test('proof rejects a mismatched table and accepts a correctly escaped cell',()=>{
  const broken=put('broken.md','| Moment | Title | Body characters |\n|---|---|---|---|\n| Now | Your move | Learn today | Short |\n');
  const fail=run('quality/proof.cjs',broken,'--offline','--json');
  assert.equal(fail.status,1);
  assert.ok(JSON.parse(fail.stdout).markdown.some((x:any)=>x.sev==='FAIL'));
  const valid=put('escaped.md','| Title | Body |\n|---|---|\n| A \\| B | Learn today |\n');
  assert.equal(run('quality/proof.cjs',valid,'--offline','--json').status,0);
});

test('format checks actual row counts, native fields and limits, with byte-bound receipts',()=>{
  const file=put('pushes.md','# Pushes\n\n| Title | Body |\n|---|---|\n| Move | Learn today |\n| Play | Your lesson awaits |\n');
  const good=put('good.json',JSON.stringify({required_headings:['Pushes'],tables:[{headers:['Title','Body'],rows:2,max_chars:{Title:4,Body:20}}]}));
  const pass=run('quality/check-format.cjs',file,'--contract',good);
  assert.equal(pass.status,0,pass.stdout+pass.stderr);
  const receipt=JSON.parse(pass.stdout);
  assert.match(receipt.file_sha256,/^[a-f0-9]{64}$/);
  assert.match(receipt.contract_sha256,/^[a-f0-9]{64}$/);
  const wrong=put('wrong.json',JSON.stringify({tables:[{headers:['Title','Body'],rows:3,max_chars:{Body:5}}]}));
  const fail=run('quality/check-format.cjs',file,'--contract',wrong);
  assert.equal(fail.status,1);
  assert.ok(JSON.parse(fail.stdout).failures.some((s:string)=>s.includes('Expected 3 rows')));
  assert.equal(run('quality/check-format.cjs',file,'--contract',put('empty.json','{}')).status,2);
});

test('a heading shown only in a code example cannot satisfy a native heading requirement',()=>{
  const file=put('fake-heading.md','```md\n# Required heading\n```\n\nOther prose.');
  const contract=put('heading.json',JSON.stringify({required_headings:['Required heading']}));
  assert.equal(run('quality/check-format.cjs',file,'--contract',contract).status,1);
});

test('format flags corrupted rendered text and invalid UTF-8 without rejecting ordinary multilingual copy',()=>{
  const contract=put('encoding-contract.json',JSON.stringify({required_headings:['Collection']}));
  const good=put('encoding-good.html','<meta charset="utf-8"><h1>Collection</h1><p>São Tomé · Ângela · ₹500 · 70 × 220 mm</p>');
  assert.equal(run('quality/check-format.cjs',good,'--contract',contract).status,0);
  const bad=put('encoding-bad.html','<h1>Collection</h1><p>Parts \u00c2\u00b7 70 mm \u00c3\u2014 220 mm; buyer\u00e2\u20ac\u2122s</p>');
  const result=run('quality/check-format.cjs',bad,'--contract',contract);
  assert.equal(result.status,1);
  assert.ok(JSON.parse(result.stdout).failures.some((s:string)=>s.includes('corrupted display')));
  const bytes=path.join(dir,'invalid-utf8.md');
  writeFileSync(bytes,Buffer.concat([Buffer.from('# Collection\n'),Buffer.from([0xc3,0x28])]));
  assert.equal(run('quality/check-format.cjs',bytes,'--contract',contract).status,1);
});
test('encoding-only checks every delivered text file without granting a format pass',()=>{
  const answer=put('delivery-answer.md','₹500 · São Tomé · 70 × 220 mm');
  const csv=put('delivery.csv','item,price\nCafé,500\n');
  const pass=run('quality/check-format.cjs','--encoding-only',answer,csv);
  assert.equal(pass.status,0,pass.stderr);
  const receipt=JSON.parse(pass.stdout);
  assert.equal(receipt.status,'ENCODING_PASS'); assert.equal(receipt.formatChecked,false);
  assert.equal(receipt.files.length,2);
  assert.ok(receipt.files.every((f:any)=>f.validUtf8 && /^[a-f0-9]{64}$/.test(f.sha256)));
  writeFileSync(csv,Buffer.concat([Buffer.from('item,note\nBottle,'),Buffer.from([0x97])]));
  const fail=run('quality/check-format.cjs','--encoding-only',answer,csv);
  assert.equal(fail.status,1); assert.equal(JSON.parse(fail.stdout).failures[0].path,csv);
  assert.equal(JSON.parse(fail.stdout).files[1].validUtf8,false);
  const missing=run('quality/check-format.cjs','--encoding-only',path.join(dir,'missing.csv'));
  assert.equal(missing.status,1); assert.equal(JSON.parse(missing.stdout).files[0].validUtf8,null);
  assert.equal(run('quality/check-format.cjs','--encoding-only').status,2);
  assert.equal(run('quality/check-format.cjs','--encoding-only','--contract',csv).status,2);
  assert.equal(run('quality/check-format.cjs',answer).status,2);
});

test('native field names retain underscores and visible link labels use their own length',()=>{
  const file=put('field-names.md','| field_name | Body |\n|---|---|\n| **order_id** | [Go](https://example.com/long-path) |\n');
  const contract=put('field-names.json',JSON.stringify({tables:[{headers:['field_name','Body'],rows:1,max_chars:{field_name:8,Body:2}}]}));
  const r=run('quality/check-format.cjs',file,'--contract',contract);
  assert.equal(r.status,0,r.stdout+r.stderr);
});

test('qe-check passes the owner-finish flags through to leakcheck and gates the raw limit',()=>{
  const file=put('finish.md','# Emails\n\n**Subject:** Start small (test: Clear your head)\n\nRunner-up: a three-item set.\n');
  assert.equal(run('quality/qe-check.cjs',file).status,1);
  const ok=run('quality/qe-check.cjs',file,'--options-requested');
  assert.equal(ok.status,0,ok.stdout);
  const over=run('quality/qe-check.cjs',file,'--options-requested','--limit','10');
  assert.equal(over.status,1,over.stdout);
  assert.match(over.stdout,/FAIL\s+limit/);
});

test('qe-check passes --brief and --profile to leakcheck, so invented dates and a bolder move in copy fail',()=>{
  const brief=put('qe-brief.md','# Brief\n\nA soap shop wants three welcome emails. Average order $28.\n');
  const emails=put('qe-emails.md','# Welcome emails\n\n**Subject:** Your first bar\n\nHi there, your soap ships soon.\n\n**Bolder move:** add a free sample to email 2.\n');
  assert.equal(run('quality/qe-check.cjs',emails,'--context',dir).status,0);
  const copy=run('quality/qe-check.cjs',emails,'--brief',brief,'--profile','lifecycle-email','--context',dir);
  assert.equal(copy.status,1,copy.stdout); assert.match(copy.stdout,/FAIL\s+leakcheck/); assert.match(copy.stdout,/Bolder move/);
  const dated=put('qe-dated.md','# Plan\n\nSend email 1 on 4 June.\n');
  const r=run('quality/qe-check.cjs',dated,'--brief',brief,'--context',dir);
  assert.equal(r.status,1,r.stdout); assert.match(r.stdout,/date not in the brief "4 June"/);
  assert.equal(run('quality/qe-check.cjs',dated,'--brief',path.join(dir,'none.md')).status,2);
  assert.equal(run('quality/qe-check.cjs',dated,'--profile','no-such-family').status,2);
});

// The numbers ledger and trace checks belong to other tools. qe-check runs them only when their inputs exist, and
// skips them with a note when their scripts are not in the pack. A copy of the quality folder with stand-in scripts
// keeps this test independent of how those tools grade.
const packCopy=(stubs:Record<string,string>)=>{
  const root=mkdtempSync(path.join(tmpdir(),'qe-pack-'));
  const q=path.join(root,'tools','quality');
  mkdirSync(q,{recursive:true});
  for(const f of ['qe-check.cjs','wordcount.cjs','readability.cjs','leakcheck.cjs','date-evidence.cjs','proof.cjs','check-format.cjs','profiles.json'])copyFileSync(path.join(tools,'quality',f),path.join(q,f));
  for(const [name,body] of Object.entries(stubs))writeFileSync(path.join(q,name),body);
  writeFileSync(path.join(root,'pack.json'),'{}');
  mkdirSync(path.join(root,'context'));
  writeFileSync(path.join(root,'final.md'),'# Plan\n\nKeep the bundle at its current price.\n');
  return root;
};
const qeIn=(root:string,...args:string[])=>spawnSync(process.execPath,[path.join(root,'tools','quality','qe-check.cjs'),'final.md',...args],{encoding:'utf8',cwd:root});
const ECHO="const a=process.argv.slice(2);console.log('args '+a.join(' '));";

test('qe-check skips the ledger and trace checks with a note when their inputs or scripts are missing',()=>{
  const bare=packCopy({});
  const none=qeIn(bare);
  assert.equal(none.status,0,none.stdout);
  assert.match(none.stdout,/NOT_RUN\s+numbers\n\s+no context[\\/]numbers\.json/);
  assert.match(none.stdout,/NOT_RUN\s+trace\n\s+no context[\\/]trace\.md/);
  writeFileSync(path.join(bare,'context','numbers.json'),'[]');
  writeFileSync(path.join(bare,'context','trace.md'),'| Question | Cards | Call it supports |\n');
  const missing=qeIn(bare);
  assert.equal(missing.status,0,missing.stdout);
  assert.match(missing.stdout,/NOT_RUN\s+numbers\n\s+numbers\.cjs is not in this pack, so this check was skipped/);
  assert.match(missing.stdout,/NOT_RUN\s+trace\n\s+trace-check\.cjs is not in this pack, so this check was skipped/);
});

test('qe-check runs the ledger and trace checks when their inputs exist and adds their lines to its report',()=>{
  const root=packCopy({
    'numbers.cjs':ECHO+"console.log('FAIL total: rows add to 900, the total says 1,000');process.exitCode=1;",
    'trace-check.cjs':ECHO+"console.log('WARN the trace names no card');",
  });
  writeFileSync(path.join(root,'context','numbers.json'),'[]');
  writeFileSync(path.join(root,'context','trace.md'),'Q1: free shipping line\n');
  writeFileSync(path.join(root,'context','spec.md'),'# Spec\n');
  writeFileSync(path.join(root,'brief.md'),'# Brief\n\nKeep it simple.\n');
  const r=qeIn(root,'--brief','brief.md');
  assert.equal(r.status,1,r.stdout);
  assert.match(r.stdout,/FAIL\s+numbers\n[\s\S]*args context[\\/]numbers\.json --final final\.md --brief brief\.md/);
  assert.match(r.stdout,/rows add to 900/);
  assert.match(r.stdout,/WARN\s+trace\n[\s\S]*args context[\\/]trace\.md --spec context[\\/]spec\.md --pack \S+ --final final\.md/);
  assert.match(r.stdout,/qe-check: 1 failed \(numbers\)/);
});

test('a ledger or trace script that refuses its arguments is noted, never a qe-check usage error',()=>{
  const root=packCopy({'numbers.cjs':"console.error('The ledger is not valid JSON');process.exit(2);"});
  writeFileSync(path.join(root,'context','numbers.json'),'{');
  const r=qeIn(root);
  assert.equal(r.status,0,r.stdout);
  assert.match(r.stdout,/NOT_RUN\s+numbers\n\s+The ledger is not valid JSON/);
});
