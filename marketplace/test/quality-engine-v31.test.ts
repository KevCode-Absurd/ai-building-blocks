import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
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
