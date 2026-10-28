import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import YAML from 'yaml';
import {markdown,safeHref} from '../scripts/lib/safe-markdown.mjs';
import {quarantineClosure} from '../../tools/lib/quarantine.mjs';
import {applyDisplayCopy} from '../../tools/lib/display-copy.mjs';

test('source Markdown cannot create active scripts, executable links or credential URLs',()=>{
  for(const href of ['javascript:alert(1)','java&#x73;cript:alert(1)','javascript&colon;alert(1)','data:text/html,test','vbscript:msgbox(1)','file:///c:/secret','https://user:pass@example.com','//example.com','java\nscript:alert(1)'])assert.equal(safeHref(href),false,href);
  const html=markdown.parse('<script>alert(1)</script>\n\n[x](javascript:alert%281%29)\n\n[x](java&#x73;cript:alert%281%29)\n\n![x](data:text/html,bad)');
  assert.ok(!/<script|href=|src=/.test(html),html);
  assert.match(html,/&lt;script&gt;/);
  for(const href of ['https://example.com/path?q=1&b=2','/skills/example','references/method.md','#checks','mailto:hello@example.com'])assert.equal(safeHref(href),true,href);
  assert.match(markdown.parse('[read](https://example.com/?a=1&b=2)'),/href="https:\/\/example.com\/\?a=1&amp;b=2"/);
});
test('quarantine propagates through uses and steps, including cycles, while keeping clean workflows',()=>{
  const blocks=[{slug:'bad'},{slug:'direct',uses:['bad']},{slug:'indirect',steps:[{uses:'direct'}]},{slug:'cycle-a',uses:['cycle-b']},{slug:'cycle-b',uses:['cycle-a','bad']},{slug:'clean',uses:['good']},{slug:'good'}];
  assert.deepEqual([...quarantineClosure(blocks,['bad'])].sort(),['bad','cycle-a','cycle-b','direct','indirect']);
});
test('every published block has complete assets and no dependency on withheld skills',()=>{
  const catalogue=JSON.parse(fs.readFileSync('public/data/blocks.json','utf8'));
  const slugs=new Set(catalogue.blocks.map(b=>b.slug));
  // Whatever catalogue-items/quarantine.yaml still holds stays off the site.
  const held=Object.keys(YAML.parse(fs.readFileSync('../catalogue-items/quarantine.yaml','utf8'))??{});
  assert.ok(held.length>0);
  for(const slug of held){
    assert.ok(!slugs.has(slug),slug);
    assert.ok(!fs.existsSync(`public/skills/${slug}.zip`),slug);
    assert.ok(!fs.existsSync(`public/skills/${slug}/SKILL.md`),slug);
  }
  for(const b of catalogue.blocks){
    assert.ok(fs.statSync(`public/skills/${b.slug}/SKILL.md`).size>20,b.slug);
    assert.ok(fs.statSync(`public/data/pages/${b.slug}.json`).size>20,b.slug);
    if(b.hasFiles)assert.ok(fs.statSync(`public/skills/${b.slug}.zip`).size>20,b.slug);
    for(const dep of [...(b.uses??[]),...(b.steps??[]).map(s=>typeof s==='string'?s:s[0])])assert.ok(slugs.has(dep),`${b.slug} -> ${dep}`);
    const page=JSON.parse(fs.readFileSync(`public/data/pages/${b.slug}.json`,'utf8'));
    for(const html of Object.values(page.html??{})){
      assert.ok(!/<(?:script|iframe|object|embed)\b/i.test(html),b.slug);
      for(const match of html.matchAll(/\b(href|src)="([^"]*)"/g))assert.ok(safeHref(match[2],match[1]==='src'),`${b.slug}: unsafe rendered URL`);
    }
  }
});


test('editorial names preserve source metadata and searchable prior names',()=>{
  const item={slug:'example',name:'Original name',source:{licence:'MIT'}},page={name:'Original public name',headline:'Original public name',summary:'Original summary'};
  const result=applyDisplayCopy(item,page,{name:'Clear job name',summary:'Share facts. Get the result.',reason:'clarity'});
  assert.equal(result.page.headline,'Clear job name');
  assert.deepEqual(result.aliases,['Original public name']);
  assert.equal(item.name,'Original name');assert.equal(page.name,'Original public name');
  assert.deepEqual(result.item.source,{licence:'MIT'});
  assert.throws(()=>applyDisplayCopy(item,page,{source:'replace licence'}),/Invalid display copy/);
});
