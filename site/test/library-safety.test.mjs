import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {markdown,safeHref} from '../scripts/lib/safe-markdown.mjs';
import {quarantineClosure} from '../../tools/lib/quarantine.mjs';

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
  for(const slug of ['stable-diffusion-image-maker','secrets-hygiene-checker','weekly-dependency-and-security-sweep','find-leaked-keys-move-them-to-safe-storage-and-check-the-live-site']){
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
