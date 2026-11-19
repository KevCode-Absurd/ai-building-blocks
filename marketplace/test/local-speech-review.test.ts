import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buildPack,TOOL_FILES} from '../src/modules/packs/build.ts';
import {housePersonas} from '../src/modules/directory/index.ts';
import {getRole} from '../src/modules/directory/roles.ts';
import {listJobTypes} from '../src/modules/catalogue/index.ts';
// @ts-ignore Portable offline tool ships as JavaScript.
import {reviewSegments,collectSpeech} from '../packs/shared/tools/local-speech-review.mjs';

test('machine uncertainty and source timecodes remain review inputs, never semantic approval',()=>{
  const rows=reviewSegments({transcription:[{offsets:{from:500,to:2500},text:' Do not promise a date.',tokens:[{text:'[_BEG_]',p:0.1},{text:' not',p:0.2},{text:' date',p:0.9}]}]});
  assert.equal(rows[0].text,'Do not promise a date.');assert.equal(rows[0].startMs,500);assert.equal(rows[0].endMs,2500);
  assert.deepEqual(rows[0].uncertainTokens,[{text:' not',probability:0.2}]);assert.equal(rows[0].review,'UNREVIEWED_MACHINE_TRANSCRIPT');
  assert.throws(()=>reviewSegments({transcription:[{offsets:{from:10,to:5},text:'bad'}]}),/Invalid segment/);
  assert.throws(()=>reviewSegments({}),/transcription array/);
});

test('wrong language and dependency pins fail before creating or overwriting evidence',()=>{
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'speech-review-'));
  try{
    const model=path.join(dir,'ggml-small.en.bin');fs.writeFileSync(model,'test bytes, not an executable');
    const common={source:model,cli:model,model,ffmpeg:model,out:path.join(dir,'result'),language:'hi'};
    assert.throws(()=>collectSpeech(common),/English-only/);assert.equal(fs.existsSync(common.out),false);
    assert.throws(()=>collectSpeech({...common,language:'en',modelSha256:'0'.repeat(64)}),/hash mismatch/);assert.equal(fs.existsSync(common.out),false);
    fs.mkdirSync(common.out);fs.writeFileSync(path.join(common.out,'retained.txt'),'original');
    assert.throws(()=>collectSpeech({...common,language:'en'}),/EEXIST/);assert.equal(fs.readFileSync(path.join(common.out,'retained.txt'),'utf8'),'original');
  }finally{fs.rmSync(dir,{recursive:true,force:true});}
});

test('offline speech capability is Cody-agent-only and does not enter unrelated or training packs',async()=>{
  const names=['local-speech-review.mjs','LOCAL-SPEECH-REVIEW.md'];
  for(const name of names)assert.deepEqual(TOOL_FILES.find(x=>x.name===name)?.personaIds,['cody-video-editor']);
  const tools=Object.fromEntries(names.map(name=>[name,fs.readFileSync(new URL('../packs/shared/tools/'+name,import.meta.url),'utf8')]));
  const personas=housePersonas().filter(p=>p.vertical==='ecommerce'&&p.status==='live');assert.equal(personas.length,81);
  for(const persona of personas)for(const kind of ['agent','train'] as const){
    const input={persona,role:getRole(persona.role)??null,kit:null,jobTypes:listJobTypes(),options:{kind,version:'test',updated:'2026-11-19'}};
    const pack=await buildPack({...input,tools});
    const expected=persona.id==='cody-video-editor'&&kind==='agent';
    for(const name of names)assert.equal(pack.files.some(f=>f.path==='tools/'+name),expected);
    const instructions=pack.files.find(f=>f.path==='AGENTS.md')!.content;
    assert.equal(instructions.includes('## Inspect and preserve requested speech'),expected);
    if(!expected){const baseline=await buildPack({...input,tools:{}});assert.deepEqual(pack.files,baseline.files,persona.id+' '+kind);assert.deepEqual(pack.manifest,baseline.manifest);}
  }
});
