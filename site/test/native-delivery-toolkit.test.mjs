import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {unzipSync,strFromU8} from 'fflate';
import {nativeToolkitBytes,nativeToolkitFiles,NATIVE_TOOLKIT_ZIP,NATIVE_TOOLKIT_SOURCES} from '../scripts/build-native-delivery-toolkit.mjs';
const exec=promisify(execFile),sha=value=>createHash('sha256').update(value).digest('hex');

function crc32(bytes) {
 let crc=0xffffffff;
 for(const byte of bytes){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}
 return (crc^0xffffffff)>>>0;
}

test('portable native toolkit is reproducible, complete and has matching CRC and SHA-256 for every declared source',async()=>{
 const bytes=Buffer.from(nativeToolkitBytes());assert.deepEqual(bytes,Buffer.from(nativeToolkitBytes()));assert.deepEqual(bytes,await fs.readFile(NATIVE_TOOLKIT_ZIP),'Run node site/scripts/build-native-delivery-toolkit.mjs');
 const unpacked=unzipSync(bytes),prefix='native-delivery-toolkit/',files=nativeToolkitFiles(),manifest=JSON.parse(strFromU8(unpacked[prefix+'SOURCE-MANIFEST.json']));
 assert.equal(Object.keys(unpacked).length,Object.keys(files).length);
 for(const file of NATIVE_TOOLKIT_SOURCES)assert(unpacked[prefix+file],file);
 for(const [file,entry] of Object.entries(manifest.files)){const actual=unpacked[prefix+file];assert(actual,file);assert.equal(sha(actual),entry.sha256,file);assert.equal(actual.length,entry.bytes,file);}
 // Validate ZIP central-directory CRC against actual uncompressed entry bytes.
 const end=bytes.length-22;assert.equal(bytes.readUInt32LE(end),0x06054b50);let cursor=bytes.readUInt32LE(end+16),count=0;
 while(bytes.readUInt32LE(cursor)===0x02014b50){const size=bytes.readUInt16LE(cursor+28),extra=bytes.readUInt16LE(cursor+30),comment=bytes.readUInt16LE(cursor+32),name=bytes.subarray(cursor+46,cursor+46+size).toString('utf8');assert.equal(crc32(unpacked[name]),bytes.readUInt32LE(cursor+16),name);cursor+=46+size+extra+comment;count++;}
 assert.equal(count,Object.keys(unpacked).length);
 const pkg=JSON.parse(strFromU8(unpacked[prefix+'site/package.json']));assert.deepEqual(Object.keys(pkg.dependencies).sort(),['@playwright/test','sharp']);for(const version of Object.values(pkg.dependencies))assert.match(version,/^\d+\.\d+\.\d+$/);
 assert(!Object.keys(unpacked).some(file=>/(?:node_modules|\.env|jobs-notes|\.git\/)/.test(file)));
});

test('extracted toolkit resolves its closure and actually runs preflight plus browser fixture without repository-relative imports or install/network',async t=>{
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'aiblocks-native-toolkit-'));
 t.after(async()=>{assert.equal(path.dirname(root),os.tmpdir());assert(path.basename(root).startsWith('aiblocks-native-toolkit-'));await fs.rm(root,{recursive:true,force:true});});
 for(const [name,bytes] of Object.entries(unzipSync(nativeToolkitBytes()))){const target=path.join(root,...name.split('/'));await fs.mkdir(path.dirname(target),{recursive:true});await fs.writeFile(target,bytes);}
 const extracted=path.join(root,'native-delivery-toolkit'),runner=path.join(extracted,'tools/inspect-native-delivery.mjs');
 // Dependency resolution uses installed test dependencies only; the archive
 // itself contains neither node_modules nor machine-specific module paths.
 const env={...process.env,NODE_PATH:fileURLToPath(new URL('../node_modules',import.meta.url))};
 try{await exec(process.execPath,[runner,'preflight','--root',extracted,'--manifest','examples/preflight.json'],{cwd:extracted,env});assert.fail('The empty host inventory must block.');}catch(error){assert.equal(error.code,1);const result=JSON.parse(error.stdout);assert.equal(result.status,'BLOCKED');assert.equal(result.model_calls,0);}
 const {stdout}=await exec(process.execPath,[runner,'inspect','--root',extracted,'--manifest','examples/inspection.json'],{cwd:extracted,env,timeout:30000});
 const result=JSON.parse(stdout);assert.equal(result.status,'PASS');assert.equal(result.paid_calls,0);assert.equal(result.pages.length,1);assert.equal(result.pages[0].checks.find(check=>check.id==='local_primary_action').status,'PASS');
});
