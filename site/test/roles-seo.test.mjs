import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {rolePage} from '../scripts/lib/role-pages.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../public/data/'+p,import.meta.url)));
test('every specialist has unique useful search text, branded titles and the complete API resource link',()=>{
 const index=read('roles-index.json'),titles=new Set(),descriptions=new Set();
 for(const row of index.roles){const p=rolePage('/roles/'+row.id,index,id=>read('roles/'+id+'.json'));
  assert(p.documentTitle.length>=50&&p.documentTitle.length<=60,row.id+' title length');assert(p.documentTitle.endsWith(' | AI Blocks'),row.id+' brand');
  assert(p.desc.length>=120&&p.desc.length<=155,row.id+' description');
  assert(!titles.has(p.documentTitle),row.id+' duplicate title');assert(!descriptions.has(p.desc),row.id+' duplicate description');
  titles.add(p.documentTitle);descriptions.add(p.desc);assert(p.content.includes(`href="/api/v1/specialists/${row.id}"`));
 }
 const root=rolePage('/roles',index,()=>null);assert(root.documentTitle.length>=50&&root.documentTitle.length<=60);
 for(let page=1;page<=Math.ceil(index.roles.length/24);page++){
  const p=rolePage(page===1?'/roles':'/roles/page/'+page,index,()=>null);
  assert(p.desc.length>=120&&p.desc.length<=155,'directory page '+page+' description');
  assert(p.documentTitle.endsWith(' | AI Blocks'),'directory page '+page+' brand');
 }
});
