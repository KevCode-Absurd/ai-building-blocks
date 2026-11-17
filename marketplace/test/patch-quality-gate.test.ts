import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const tool=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../packs/shared/tools/quality/qe-check.cjs');
function check(patch:string,expected='new\n') {const dir=fs.mkdtempSync(path.join(os.tmpdir(),'patch-quality-'));for(const name of ['before','after'])fs.mkdirSync(path.join(dir,name));fs.writeFileSync(path.join(dir,'before/a.txt'),'old\n');fs.writeFileSync(path.join(dir,'after/a.txt'),expected);fs.writeFileSync(path.join(dir,'change.diff'),patch);const file=path.join(dir,'report.md');fs.writeFileSync(file,'The edited local file is ready for review.');const r=spawnSync(process.execPath,[tool,file,'--context',dir,'--json'],{encoding:'utf8'});return {process:r,result:JSON.parse(r.stdout)};}
const valid='diff --git a/a.txt b/a.txt\n--- a/a.txt\n+++ b/a.txt\n@@ -1 +1 @@\n-old\n+new\n';
test('quality entry point automatically rejects a pseudo diff beside a prose report',()=>{const r=check('--- before/a.txt\n+++ after/a.txt\n@@ text @@\n-old\n+new\n');assert.equal(r.process.status,1);assert.ok(r.result.failed.includes('patches'));});
test('quality entry point applies a real patch and compares exact expected bytes',()=>{const r=check(valid);assert.equal(r.result.rows.find((x:any)=>x.name==='patches').status,'PASS');});
test('valid syntax cannot pass when expected edited file differs',()=>{const r=check(valid,'different\n');assert.equal(r.process.status,1);assert.ok(r.result.failed.includes('patches'));});
