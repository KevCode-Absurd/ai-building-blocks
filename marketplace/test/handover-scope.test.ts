import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const tool=fileURLToPath(new URL('../packs/shared/tools/check-handover.mjs',import.meta.url));
function run(profile:string, onePage=false) {
  const dir=mkdtempSync(path.join(tmpdir(),'handover-scope-'));
  const plain=path.join(dir,'plain.md'), final=path.join(dir,'final.md');
  writeFileSync(plain,'Protect paid orders first.');
  writeFileSync(final,Array.from({length:onePage?70:12},(_,i)=>`Decision ${i+1}: protect reserved stock and review the delivery evidence.`).join('\n\n'));
  return spawnSync(process.execPath,[tool,final,plain,'--profile',profile,...(onePage?['--one-page']:[])],{encoding:'utf8'});
}
test('an analytical deliverable is not rejected merely because its plain baseline omitted the evidence',()=>{
  const r=run('analysis-memo');assert.equal(r.status,0,r.stdout+r.stderr);assert.match(r.stdout,/length review/);
});
test('explicit one-page constraints still bind analytical deliverables',()=>{
  const r=run('analysis-memo',true);assert.equal(r.status,1);assert.match(r.stdout,/more than one page/);
});
test('buyer-facing copy retains the existing relative-length guard',()=>{
  const r=run('paid-social-ads');assert.equal(r.status,1);assert.match(r.stdout,/family ceiling/);
});
