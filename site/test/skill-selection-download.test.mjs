import {test} from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {unzipSync,zipSync,strToU8,strFromU8} from 'fflate';
import {fileURLToPath} from 'node:url';

const bundled=await build({entryPoints:[fileURLToPath(new URL('../src/lib/skill-selection-download.ts',import.meta.url))],bundle:true,write:false,format:'esm',platform:'browser'});
const {buildSkillSelectionZip}=await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const block=(slug,hasFiles=false)=>({slug,name:slug,type:'skill',category:'general',hasFiles});

test('selected pack keeps chosen order, links, complete references and binary assets',async()=>{
  const originalFetch=globalThis.fetch;
  const reference=strToU8('Read this reference unchanged.');
  const binary=new Uint8Array([0,255,7,128]);
  const calls=[];
  globalThis.fetch=async url=>{
    calls.push(url);
    return url.endsWith('.zip')?new Response(zipSync({'second/SKILL.md':strToU8('# Second'),'second/references/guide.md':reference,'second/assets/example.bin':binary}),{headers:{'content-type':'application/zip'}}):new Response('# First');
  };
  try{
    const files=unzipSync(new Uint8Array(await(await buildSkillSelectionZip([block('second',true),block('first'),block('second',true)])).arrayBuffer()));
    const order=JSON.parse(strFromU8(files['skill-order.json']));
    assert.deepEqual(order.map(row=>row.slug),['second','first']);
    assert.deepEqual(order.map(row=>row.step),[1,2]);
    assert.equal(order[0].url,'https://useaiblocks.com/skills/second');
    assert.match(strFromU8(files['README.md']),/1\. \[second\].*\n2\. \[first\]/);
    assert.deepEqual(files['second/references/guide.md'],reference);
    assert.deepEqual(files['second/assets/example.bin'],binary);
    assert.equal(strFromU8(files['first/SKILL.md']),'# First');
    assert.deepEqual(calls,['/skills/second.zip','/skills/first/SKILL.md']);
  }finally{globalThis.fetch=originalFetch;}
});

test('empty selections, unavailable bundles and unsafe archives fail without a partial download',async()=>{
  const originalFetch=globalThis.fetch;
  try{
    await assert.rejects(buildSkillSelectionZip([]),/Choose at least one/);
    globalThis.fetch=async()=>new Response('missing',{status:404});
    await assert.rejects(buildSkillSelectionZip([block('missing',true)]),/complete files for missing/);
    await assert.rejects(buildSkillSelectionZip([block('missing-text')]),/Couldn't load missing-text/);
    globalThis.fetch=async()=>new Response(zipSync({'escape/SKILL.md':strToU8('wrong folder')}),{headers:{'content-type':'application/zip'}});
    await assert.rejects(buildSkillSelectionZip([block('unsafe',true)]));
    globalThis.fetch=async()=>new Response(zipSync({'incomplete/references/guide.md':strToU8('No skill instructions')}),{headers:{'content-type':'application/zip'}});
    await assert.rejects(buildSkillSelectionZip([block('incomplete',true)]),/complete files for incomplete/);
  }finally{globalThis.fetch=originalFetch;}
});
