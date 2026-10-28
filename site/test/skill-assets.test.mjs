import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {zipSync,strToU8} from 'fflate';
import {buildSkillAssets} from '../scripts/build-skill-assets.mjs';
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'abb-skill-assets-'));
after(()=>{assert.ok(path.resolve(temp).startsWith(path.resolve(os.tmpdir())+path.sep+'abb-skill-assets-'));fs.rmSync(temp,{recursive:true,force:true});});
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
let sequence=0;
function fixture(){
 const root=path.join(temp,String(++sequence));fs.mkdirSync(path.join(root,'skills/example'),{recursive:true});fs.mkdirSync(path.join(root,'data'));
 const instruction=strToU8('# Synthetic fixture\r\nDo a local check.\r\n');
 const files={'example/SKILL.md':strToU8('# Synthetic fixture\nDo a local check.\n'),'example/references/method.md':strToU8('Synthetic method.\r\n'),'example/scripts/check.mjs':strToU8('export const synthetic = true;\n'),'example/skills/child/SKILL.md':strToU8('# Synthetic bundled skill\n')};
 const archive=zipSync(files),record=bytes=>({sha256:sha(bytes),bytes:bytes.length});
 const manifest={schema:'abb-public-catalogue/1',resources:{example:{instruction:{path:'/skills/example/SKILL.md',...record(instruction)},archive:{path:'/skills/example.zip',...record(archive)},files:Object.entries(files).map(([name,bytes])=>({path:name,...record(bytes)}))}}};
 fs.writeFileSync(path.join(root,'skills/example/SKILL.md'),instruction);fs.writeFileSync(path.join(root,'skills/example.zip'),archive);
 const save=()=>fs.writeFileSync(path.join(root,'data/public-api-manifest.json'),JSON.stringify(manifest));save();return {root,manifest,files,instruction,save};
}
test('public supporting files match inventoried ZIP bytes and repeated builds are stable',()=>{
 const f=fixture(),result=buildSkillAssets(f.root);assert.equal(result.files,3);assert.equal(result.written,3);
 for(const [name,bytes]of Object.entries(f.files))assert.deepEqual(fs.readFileSync(path.join(f.root,'skills',name)),Buffer.from(name==='example/SKILL.md'?f.instruction:bytes));
 assert.equal(buildSkillAssets(f.root).written,0);
 const stale='skills/example/references/old.md';fs.writeFileSync(path.join(f.root,stale),'Old generated fixture');
 const list=JSON.parse(fs.readFileSync(path.join(f.root,'data/skill-assets.json')));list.paths.push(stale);fs.writeFileSync(path.join(f.root,'data/skill-assets.json'),JSON.stringify(list));
 fs.writeFileSync(path.join(f.root,'skills/example/unmanaged.txt'),'Not owned by the generator');
 assert.equal(buildSkillAssets(f.root).removed,1);assert.ok(!fs.existsSync(path.join(f.root,stale)));assert.ok(fs.existsSync(path.join(f.root,'skills/example/unmanaged.txt')));
});
test('a mismatched package inventory stops before publishing any supporting file',()=>{
 const f=fixture();f.manifest.resources.example.files.at(-1).sha256='0'.repeat(64);f.save();
 assert.throws(()=>buildSkillAssets(f.root),/checksum mismatch/);assert.ok(!fs.existsSync(path.join(f.root,'skills/example/references/method.md')));
});
test('line-ending differences are allowed but changed instruction content is rejected',()=>{
 const f=fixture(),changed=strToU8('# Synthetic fixture\nA different method.\n');
 fs.writeFileSync(path.join(f.root,'skills/example/SKILL.md'),changed);Object.assign(f.manifest.resources.example.instruction,{sha256:sha(changed),bytes:changed.length});f.save();
 assert.throws(()=>buildSkillAssets(f.root),/Packaged instructions differ/);assert.ok(!fs.existsSync(path.join(f.root,'skills/example/references/method.md')));
});
test('archive traversal and a poisoned old inventory cannot escape the generated asset root',()=>{
 const f=fixture(),archive=zipSync({...f.files,'example/../escape.txt':strToU8('Synthetic unsafe path')});
 fs.writeFileSync(path.join(f.root,'skills/example.zip'),archive);Object.assign(f.manifest.resources.example.archive,{sha256:sha(archive),bytes:archive.length});f.save();
 assert.throws(()=>buildSkillAssets(f.root),/Unsafe/);assert.ok(!fs.existsSync(path.join(f.root,'skills/escape.txt')));
 const other=fixture();fs.writeFileSync(path.join(other.root,'data/skill-assets.json'),JSON.stringify({schema:'abb-skill-assets/1',paths:['skills/example/../../outside.txt']}));
 assert.throws(()=>buildSkillAssets(other.root),/Unsafe/);assert.ok(!fs.existsSync(path.join(other.root,'skills/example/references/method.md')));
 const canonical=fixture();fs.writeFileSync(path.join(canonical.root,'data/skill-assets.json'),JSON.stringify({schema:'abb-skill-assets/1',paths:['skills/example/SKILL.md']}));
 assert.throws(()=>buildSkillAssets(canonical.root),/Invalid prior/);assert.deepEqual(fs.readFileSync(path.join(canonical.root,'skills/example/SKILL.md')),Buffer.from(canonical.instruction));
});
test('existing directory junctions cannot redirect package writes',()=>{
 const f=fixture(),outside=path.join(temp,'outside-'+sequence);fs.mkdirSync(outside);
 fs.symlinkSync(outside,path.join(f.root,'skills/example/references'),process.platform==='win32'?'junction':'dir');
 assert.throws(()=>buildSkillAssets(f.root),/symlink/);assert.ok(!fs.existsSync(path.join(outside,'method.md')));
});
test('a raw package index cannot replace a public catalogue page',()=>{
 const f=fixture(),bytes=strToU8('<!doctype html><title>Synthetic package</title>');
 const archive=zipSync({...f.files,'example/index.html':bytes});fs.writeFileSync(path.join(f.root,'skills/example.zip'),archive);
 Object.assign(f.manifest.resources.example.archive,{sha256:sha(archive),bytes:archive.length});f.manifest.resources.example.files.push({path:'example/index.html',sha256:sha(bytes),bytes:bytes.length});f.save();
 assert.throws(()=>buildSkillAssets(f.root),/shadow its catalogue page/);assert.ok(!fs.existsSync(path.join(f.root,'skills/example/index.html')));
});
