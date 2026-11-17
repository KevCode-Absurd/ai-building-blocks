#!/usr/bin/env node
// Apply a delivered diff only to an isolated copy; compare its bytes with the delivered result.
// Usage: node tools/verify-patch.mjs change.patch before-directory after-directory
// Generate AND verify: node tools/verify-patch.mjs --create change.patch before-directory after-directory
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';

function snapshot(root) {
  const files=new Map();let bytes=0;
  function walk(dir) {
    for(const name of fs.readdirSync(dir).sort()) {
      if(name==='.git')throw Error('Supply only the changed-file baseline, without a .git directory');
      const full=path.join(dir,name),stat=fs.lstatSync(full);
      if(stat.isSymbolicLink())throw Error('Symbolic links are not supported in patch verification');
      if(stat.isDirectory()){walk(full);continue;}
      if(!stat.isFile())throw Error('Only regular files are supported');
      bytes+=stat.size;if(bytes>64_000_000||files.size>=2000)throw Error('Verification input limit exceeded');
      files.set(path.relative(root,full).replaceAll('\\','/'),crypto.createHash('sha256').update(fs.readFileSync(full)).digest('hex'));
    }
  }
  walk(root);return files;
}

export function verifyPatch(patch,before,after) {
  const patchPath=fs.realpathSync(patch),original=fs.realpathSync(before),expected=fs.realpathSync(after);
  const originalFiles=snapshot(original),expectedFiles=snapshot(expected);
  if(!originalFiles.size)throw Error('A nonempty original-file baseline is required');
  const tempRoot=fs.realpathSync(os.tmpdir()),temp=fs.mkdtempSync(path.join(tempRoot,'agent-patch-check-'));
  try {
    for(const relative of originalFiles.keys()) {const dest=path.join(temp,relative);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(original,relative),dest);}
    const run=args=>execFileSync('git',['-c','core.autocrlf=false','-c','core.safecrlf=false',...args],{cwd:temp,encoding:'utf8',timeout:30000,windowsHide:true,stdio:['ignore','pipe','pipe']});
    try {run(['apply','--no-index','--check','--',patchPath]);run(['apply','--no-index','--',patchPath]);}
    catch(e){return {ok:false,status:e.code==='ENOENT'?'NOT_RUN':'FAIL',stage:'patch_application',error:e.code==='ENOENT'?'Git is unavailable':String(e.stderr||e.message).trim()};}
    const actual=snapshot(temp),differences=[];
    for(const relative of new Set([...actual.keys(),...expectedFiles.keys()]))if(actual.get(relative)!==expectedFiles.get(relative))differences.push(relative);
    return {ok:!differences.length,status:differences.length?'FAIL':'PASS',stage:'byte_comparison',differences,files_compared:expectedFiles.size,
      limitations:'Applied only in a temporary baseline copy. Checks syntax, applicability and exact result bytes; not runtime behavior, security, file modes or production readiness.'};
  } finally {
    const resolved=path.resolve(temp),relative=path.relative(tempRoot,resolved);
    if(relative&&relative!=='..'&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative))fs.rmSync(resolved,{recursive:true,force:true});
  }
}
export function createPatch(patch,before,after) {
  const original=fs.realpathSync(before),expected=fs.realpathSync(after),output=path.resolve(patch);
  const originalFiles=snapshot(original),expectedFiles=snapshot(expected);
  if(!originalFiles.size)throw Error('A nonempty original-file baseline is required');
  for(const root of [original,expected]) {const relative=path.relative(root,output);if(!relative||(!relative.startsWith('..'+path.sep)&&relative!=='..'&&!path.isAbsolute(relative)))throw Error('Write the patch outside the baseline and expected directories');}
  if(fs.existsSync(output))throw Error('Refusing to overwrite an existing patch');
  const tempRoot=fs.realpathSync(os.tmpdir()),temp=fs.mkdtempSync(path.join(tempRoot,'agent-patch-create-'));
  try {
    for(const [name,root,files] of [['before',original,originalFiles],['after',expected,expectedFiles]]) {
      fs.mkdirSync(path.join(temp,name));
      for(const relative of files.keys()) {const dest=path.join(temp,name,relative);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(root,relative),dest);}
    }
    let bytes;
    try {bytes=execFileSync('git',['-c','core.autocrlf=false','-c','core.safecrlf=false','diff','--no-index','--no-prefix','--binary','--','before','after'],{cwd:temp,timeout:30000,maxBuffer:128_000_000,windowsHide:true,stdio:['ignore','pipe','pipe']});}
    catch(e) {if(e.status===1&&e.stdout)bytes=e.stdout;else return {ok:false,status:e.code==='ENOENT'?'NOT_RUN':'FAIL',stage:'patch_generation',error:e.code==='ENOENT'?'Git is unavailable':String(e.stderr||e.message)};}
    if(!bytes?.length)throw Error('No changed file bytes; no patch generated');
    const candidate=path.join(temp,'change.patch');fs.writeFileSync(candidate,bytes);
    const result=verifyPatch(candidate,path.join(temp,'before'),path.join(temp,'after'));
    if(result.ok)fs.writeFileSync(output,bytes,{flag:'wx'});
    return {...result,generated:result.ok,patch:result.ok?output:null};
  } finally {
    const relative=path.relative(tempRoot,path.resolve(temp));
    if(relative&&relative!=='..'&&!relative.startsWith('..'+path.sep)&&!path.isAbsolute(relative))fs.rmSync(temp,{recursive:true,force:true});
  }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  try {const create=process.argv[2]==='--create';if(process.argv.length!==(create?6:5))throw Error('Usage: verify-patch.mjs [--create] change.patch before-directory after-directory');const r=(create?createPatch:verifyPatch)(...process.argv.slice(create?3:2));console.log(JSON.stringify(r,null,2));process.exitCode=r.ok?0:r.status==='NOT_RUN'?2:1;}
  catch(e){console.error(JSON.stringify({ok:false,status:'FAIL',error:e.message}));process.exitCode=1;}
}
