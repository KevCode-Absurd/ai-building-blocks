import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {verifyDeliveryEvidence,isEvidencePath,FILE_EVIDENCE_SCHEMA,FILE_EVIDENCE_ASSURANCE,FILE_EVIDENCE_LIMITS} from '../../tools/verify-delivery-evidence.mjs';

const cli=fileURLToPath(new URL('../../tools/verify-delivery-evidence.mjs',import.meta.url));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
async function project(t){
 const directory=await fs.mkdtemp(path.join(os.tmpdir(),'aiblocks-file-evidence-'));
 t.after(async()=>{assert.equal(path.dirname(directory),os.tmpdir());assert(path.basename(directory).startsWith('aiblocks-file-evidence-'));await fs.rm(directory,{recursive:true,force:true});});
 const root=path.join(directory,'project');await fs.mkdir(root);await fs.mkdir(path.join(root,'work'));
 const artifact='Native result bytes\n',receipt='{"test":"syntax","status":"PASS"}\n',source='Original facts with constraints\n';
 await Promise.all([fs.writeFile(path.join(root,'work/result.bin'),artifact),fs.writeFile(path.join(root,'work/check.json'),receipt),fs.writeFile(path.join(root,'source.txt'),source)]);
 const manifest={schema:FILE_EVIDENCE_SCHEMA,artifacts:[{id:'result',path:'work/result.bin',sha256:hash(artifact),receipts:[{path:'work/check.json',sha256:hash(receipt)}]}],sources:[{id:'original',path:'source.txt',sha256:hash(source)}]};
 await fs.writeFile(path.join(root,'evidence.json'),JSON.stringify(manifest));
 return{root,directory,manifest,artifact,receipt,source};
}
const codes=report=>report.errors.map(error=>error.code);
const run=(root,args=[])=>spawnSync(process.execPath,[cli,'--root',root,'--manifest','evidence.json',...args],{encoding:'utf8',timeout:10000});

test('verifies actual artifact, source and receipt bytes without claiming semantics',async t=>{
 const p=await project(t),before=await fs.readdir(p.root);
 const report=await verifyDeliveryEvidence(p);
 assert.equal(report.status,'PASS');assert.equal(report.assurance,FILE_EVIDENCE_ASSURANCE);
 assert.equal(report.summary.verified_files,3);assert.equal(report.summary.verified_bytes,Buffer.byteLength(p.artifact+p.receipt+p.source));
 assert.deepEqual(report.files.map(row=>row.kind),['artifact','receipt','source']);
 for(const row of report.files){assert.equal(row.actual_sha256,row.expected_sha256);assert.equal(row.status,'PASS');assert.equal(typeof row.bytes,'number');}
 assert.match(report.verification_limit,/does not establish.*real test/);
 assert.equal(JSON.stringify(report).includes('Native result bytes'),false);
 assert.deepEqual(await fs.readdir(p.root),before);
});

test('stale artifact or receipt content fails even when a saved report says PASS',async t=>{
 const p=await project(t);await fs.writeFile(path.join(p.root,'work/check.json'),'PASS but changed');
 let report=await verifyDeliveryEvidence(p);assert.equal(report.status,'FAIL');assert(codes(report).includes('HASH_MISMATCH'));assert.equal(report.files.find(row=>row.kind==='receipt').status,'FAIL');
 await fs.writeFile(path.join(p.root,'work/result.bin'),'Different result');
 report=await verifyDeliveryEvidence(p);assert.equal(codes(report).filter(code=>code==='HASH_MISMATCH').length,2);assert.equal(report.summary.verified_files,1);
});

test('rejects incomplete evidence, duplicate IDs/paths and undeclared root authority',async t=>{
 const p=await project(t);
 for(const manifest of [{schema:FILE_EVIDENCE_SCHEMA,artifacts:[]},{...p.manifest,root:p.directory},{...p.manifest,artifacts:[...p.manifest.artifacts,structuredClone(p.manifest.artifacts[0])]},{...p.manifest,sources:[{...p.manifest.sources[0],path:'WORK/RESULT.BIN'}]}]){
  const report=await verifyDeliveryEvidence({...p,manifest});assert.equal(report.status,'FAIL');assert.equal(report.files.length,0);
 }
 const missing=structuredClone(p.manifest);missing.sources[0].path='missing.txt';
 const report=await verifyDeliveryEvidence({...p,manifest:missing});assert.equal(report.status,'FAIL');assert(codes(report).includes('UNREADABLE_FILE'));
});

test('never opens absolute, traversal, backslash, alias or device paths',async t=>{
 const p=await project(t);
 for(const unsafe of ['/etc/passwd','../outside.txt','work/../../outside.txt','C:/private.txt','C:private.txt','\\server\\file','work\\result.bin','./source.txt','work//result.bin','NUL.txt','work/result.bin:stream','work/../source.txt','work/result.bin.','work/result.bin ','work/\u0000file']){
  assert.equal(isEvidencePath(unsafe),false,unsafe);
  const manifest=structuredClone(p.manifest);manifest.artifacts[0].path=unsafe;
  const report=await verifyDeliveryEvidence({...p,manifest});assert.equal(report.status,'FAIL',unsafe);assert(codes(report).includes('UNSAFE_PATH'),unsafe);assert.equal(report.files.length,0);
 }
 assert.equal((await verifyDeliveryEvidence({...p,root:'relative-project'})).status,'FAIL');
});

test('symlink/junction evidence cannot escape root, even when target bytes match',async t=>{
 const p=await project(t),outside=path.join(p.directory,'outside');await fs.mkdir(outside);await fs.writeFile(path.join(outside,'result.bin'),p.artifact);
 try{await fs.symlink(outside,path.join(p.root,'linked'),process.platform==='win32'?'junction':'dir');}
 catch(error){if(['EPERM','EACCES','ENOTSUP'].includes(error.code)){t.skip('This host cannot create symlinks/junctions.');return;}throw error;}
 const manifest={schema:FILE_EVIDENCE_SCHEMA,artifacts:[{id:'escape',path:'linked/result.bin',sha256:hash(p.artifact)}]};
 const report=await verifyDeliveryEvidence({...p,manifest});assert.equal(report.status,'FAIL');assert(codes(report).includes('SYMLINK_PATH'));assert.equal(report.summary.inspected_bytes,0);
 const output=run(p.root,['--output','linked/report.json']);assert.equal(output.status,2);await assert.rejects(()=>fs.access(path.join(outside,'report.json')));
});

test('directories and file/count/total/manifest byte caps fail closed',async t=>{
 const p=await project(t),manifest=structuredClone(p.manifest);manifest.artifacts[0].path='work';
 assert(codes(await verifyDeliveryEvidence({...p,manifest})).includes('NOT_REGULAR_FILE'));
 assert(codes(await verifyDeliveryEvidence({...p,limits:{max_files:2}})).includes('FILE_COUNT_LIMIT'));
 assert(codes(await verifyDeliveryEvidence({...p,limits:{max_file_bytes:5}})).includes('FILE_LIMIT'));
 assert(codes(await verifyDeliveryEvidence({...p,limits:{max_total_bytes:Buffer.byteLength(p.artifact)+2}})).includes('TOTAL_BYTE_LIMIT'));
 assert(codes(await verifyDeliveryEvidence({...p,limits:{max_manifest_bytes:5}})).includes('MANIFEST_LIMIT'));
 assert(codes(await verifyDeliveryEvidence({...p,limits:{max_files:FILE_EVIDENCE_LIMITS.max_files+1}})).includes('INVALID_ROOT_OR_LIMITS'));
});

test('CLI writes no file by default and creates only an explicit new report',async t=>{
 const p=await project(t),before=await fs.readdir(p.root),readOnly=run(p.root);
 assert.equal(readOnly.status,0,readOnly.stderr);assert.equal(JSON.parse(readOnly.stdout).status,'PASS');assert.deepEqual(await fs.readdir(p.root),before);
 const written=run(p.root,['--output','report.json']);assert.equal(written.status,0,written.stderr);
 const report=JSON.parse(await fs.readFile(path.join(p.root,'report.json'),'utf8'));assert.equal(report.manifest.sha256,hash(await fs.readFile(path.join(p.root,'evidence.json'))));
 assert.equal(report.assurance,FILE_EVIDENCE_ASSURANCE);
 const again=run(p.root,['--output','report.json']);assert.equal(again.status,2);assert.deepEqual(JSON.parse(await fs.readFile(path.join(p.root,'report.json'),'utf8')),report);
 await fs.writeFile(path.join(p.root,'source.txt'),'updated source');const stale=run(p.root);assert.equal(stale.status,1);assert(codes(JSON.parse(stale.stdout)).includes('HASH_MISMATCH'));
});

test('CLI refuses unsafe output, evidence overwrite, malformed JSON and unknown flags',async t=>{
 const p=await project(t),original=await fs.readFile(path.join(p.root,'source.txt'),'utf8');
 for(const args of [['--output','../report.json'],['--output','source.txt'],['--output','evidence.json'],['--fix'],['--root',p.root]])assert.equal(run(p.root,args).status,2);
 assert.equal(await fs.readFile(path.join(p.root,'source.txt'),'utf8'),original);
 await fs.writeFile(path.join(p.root,'evidence.json'),'{not JSON');assert.equal(run(p.root).status,2);
 const outside=spawnSync(process.execPath,[cli,'--root',p.root,'--manifest','../outside.json'],{encoding:'utf8'});assert.equal(outside.status,2);
});
