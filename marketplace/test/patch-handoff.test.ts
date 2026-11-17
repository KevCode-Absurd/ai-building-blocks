import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
// @ts-expect-error Portable plain-JavaScript pack tool.
import {verifyPatch,createPatch} from '../packs/shared/tools/verify-patch.mjs';
function setup(before:string,after:string,diff:string){const root=fs.mkdtempSync(path.join(os.tmpdir(),'patch-fixture-'));fs.mkdirSync(path.join(root,'before'));fs.mkdirSync(path.join(root,'after'));fs.writeFileSync(path.join(root,'before','x.txt'),before);fs.writeFileSync(path.join(root,'after','x.txt'),after);fs.writeFileSync(path.join(root,'change.patch'),diff);return {root,args:[path.join(root,'change.patch'),path.join(root,'before'),path.join(root,'after')]};}
const diff='--- a/x.txt\n+++ b/x.txt\n@@ -1 +1 @@\n-old\n+new\n';
test('a delivered patch reproduces the final bytes without changing its baseline',()=>{const f=setup('old\n','new\n',diff);assert.equal(verifyPatch(...f.args).status,'PASS');assert.equal(fs.readFileSync(path.join(f.root,'before','x.txt'),'utf8'),'old\n');});
test('the observed no-newline concatenation is a corrupt patch, not a verified handoff',()=>{const f=setup('old','new','--- a/x.txt\n+++ b/x.txt\n@@ -1 +1 @@\n-old+new\n');const r=verifyPatch(...f.args);assert.equal(r.status,'FAIL');assert.equal(r.stage,'patch_application');});
test('a syntactically valid patch must also reproduce the delivered result',()=>{const f=setup('old\n','different\n',diff);const r=verifyPatch(...f.args);assert.equal(r.status,'FAIL');assert.deepEqual(r.differences,['x.txt']);});
test('explicit no-newline markers reproduce an unterminated file exactly',()=>{const f=setup('old','new','--- a/x.txt\n+++ b/x.txt\n@@ -1 +1 @@\n-old\n\\ No newline at end of file\n+new\n\\ No newline at end of file\n');assert.equal(verifyPatch(...f.args).status,'PASS');});
test('a traversal patch is rejected without modifying a file outside the copy',()=>{const f=setup('old\n','new\n','--- a/../outside.txt\n+++ b/../outside.txt\n@@ -1 +1 @@\n-old\n+new\n');fs.writeFileSync(path.join(f.root,'outside.txt'),'old\n');assert.equal(verifyPatch(...f.args).status,'FAIL');assert.equal(fs.readFileSync(path.join(f.root,'outside.txt'),'utf8'),'old\n');});
test('repository metadata cannot enter a verification baseline',()=>{const f=setup('old\n','new\n',diff);fs.mkdirSync(path.join(f.root,'before','.git'));assert.throws(()=>verifyPatch(...f.args),/without a .git/);});

test('generate and verify preserves no-final-newline bytes without manual diff concatenation',()=>{const f=setup('old','new','unused');const out=path.join(f.root,'generated.patch');assert.equal(createPatch(out,f.args[1],f.args[2]).status,'PASS');assert.equal(verifyPatch(out,f.args[1],f.args[2]).status,'PASS');assert.match(fs.readFileSync(out,'utf8'),/No newline at end of file/);assert.equal(fs.readFileSync(path.join(f.root,'before/x.txt'),'utf8'),'old');});
test('generation includes added binary and Unicode-path assets',()=>{const f=setup('old\r\n','new\r\n','unused');fs.mkdirSync(path.join(f.root,'after/assets'));fs.writeFileSync(path.join(f.root,'after/assets/café.bin'),Buffer.from([0,255,0,12]));const out=path.join(f.root,'generated.patch');assert.equal(createPatch(out,f.args[1],f.args[2]).status,'PASS');assert.equal(verifyPatch(out,f.args[1],f.args[2]).files_compared,2);});
test('generation never overwrites a patch or writes inside its inputs',()=>{const f=setup('old','new','saved');assert.throws(()=>createPatch(...f.args),/overwrite/);assert.throws(()=>createPatch(path.join(f.root,'after/new.patch'),f.args[1],f.args[2]),/outside/);assert.equal(fs.readFileSync(f.args[0],'utf8'),'saved');});
test('identical inputs cannot be called a generated change',()=>{const f=setup('same','same','unused');assert.throws(()=>createPatch(path.join(f.root,'empty.patch'),f.args[1],f.args[2]),/No changed file bytes/);assert.equal(fs.existsSync(path.join(f.root,'empty.patch')),false);});
