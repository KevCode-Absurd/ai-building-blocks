// Compute Wrangler 4.151.3's manifest once with bounded concurrent file reads.
// Only dedicated frozen release directories are accepted. No credentials used.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../site/package.json',import.meta.url));
const {hash}=require('blake3-wasm');
const root=path.resolve(process.argv[2]||'');
const allowed=[path.resolve('site/.wrangler/releases'),path.resolve('C:/Users/kevin/.codex/visualizations/2026/10/22/01a161bf-0b97-7cf2-97f3-74eb6d30d1e4')];
assert(allowed.some(parent=>root.startsWith(parent+path.sep))&&path.basename(root).startsWith('release-2026-10-22'));
const frozen=JSON.parse(await fs.readFile(path.join(root,'release-manifest.json'),'utf8'));
const directory=path.resolve(frozen.assets);
assert.equal(directory,path.join(root,'assets'));
const patterns=(await fs.readFile(path.join(directory,'.assetsignore'),'utf8')).split(/\r?\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('#'));
assert.deepEqual(patterns,['_routes.json','_worker.js'],'Review additional ignore patterns before using this manifest generator.');
const entries=await fs.readdir(directory,{recursive:true,withFileTypes:true});
assert(!entries.some(entry=>entry.isSymbolicLink()),'Frozen assets must not contain symlinks.');
const files=entries.filter(entry=>entry.isFile()).map(entry=>path.relative(directory,path.join(entry.parentPath,entry.name)).split(path.sep).join('/'));
assert.equal(files.length,frozen.files);
const included=files.filter(file=>!['.assetsignore','_headers','_redirects'].includes(file)&&!file.split('/').some(part=>['_routes.json','_worker.js'].includes(part)));
const manifest={};let next=0,done=0,totalBytes=0;
const start=Date.now();
await Promise.all(Array.from({length:32},async()=>{while(next<included.length){
 const relative=included[next++];const bytes=await fs.readFile(path.join(directory,relative));
 assert(bytes.length<=25*1024*1024,'Oversized asset: '+relative);
 manifest['/'+relative]={hash:hash(bytes.toString('base64')+path.extname(relative).slice(1)).toString('hex').slice(0,32),size:bytes.length};
 totalBytes+=bytes.length;done++;if(done%2000===0)console.log(JSON.stringify({hashed:done,total:included.length}));
}}));
const stable=Object.fromEntries(Object.entries(manifest).sort(([a],[b])=>a.localeCompare(b)));
const manifestSha256=crypto.createHash('sha256').update(JSON.stringify(stable)).digest('hex');
const report={createdOn:new Date().toISOString(),directory,wranglerVersion:'4.151.3',fileCount:files.length,entries:included.length,totalBytes,manifestSha256,workerSha256:frozen.workerSha256,manifest:stable};
const output=path.join(root,'frozen-assets-manifest.json');
await fs.writeFile(output,JSON.stringify(report)+'\n');
console.log(JSON.stringify({output,entries:included.length,totalBytes,durationMs:Date.now()-start,manifestSha256}));
