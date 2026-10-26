import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {readJson,sha} from '../usability-release-lib.mjs';
export async function repairApiPageDescriptors(assets){
 const file=path.join(assets,'data/public-api-manifest.json'),api=await readJson(file),catalogueBytes=await fs.readFile(path.join(assets,'data/blocks.json')),catalogue=JSON.parse(catalogueBytes),blocks=new Map(catalogue.blocks.map(b=>[b.slug,b]));
 assert.equal(api.catalogue_sha256,sha(catalogueBytes));const changes=[];
 for(const [slug,entry]of Object.entries(api.resources)){
  if(!entry.page)continue;const rel=entry.page.path.slice(1);assert.equal(rel,'data/pages/'+slug+'.json');const bytes=await fs.readFile(path.join(assets,rel)),hash=sha(bytes);
  if(hash===entry.page.sha256){assert.equal(bytes.length,entry.page.bytes);continue;}
  const before=structuredClone(entry),page={...entry.page,sha256:hash,bytes:bytes.length};
  const revision_sha256=sha(JSON.stringify({instruction:entry.instruction.sha256,archive:entry.archive?.sha256??null,metadata:sha(JSON.stringify(blocks.get(slug))),page:hash}));
  api.resources[slug]={...entry,page,revision_sha256};
  const stripped=x=>{const y=structuredClone(x);delete y.page;delete y.revision_sha256;return y;};assert.deepEqual(stripped(api.resources[slug]),stripped(before));
  changes.push({slug,path:entry.page.path,beforePageSha256:before.page.sha256,pageSha256:hash,beforeRevision:before.revision_sha256,revision:revision_sha256});
 }
 if(changes.length){const tmp=file+'.api-pages.tmp';await fs.writeFile(tmp,JSON.stringify(api));await fs.unlink(file);await fs.rename(tmp,file);}
 return {status:'pass',changedResources:changes.length,changes,catalogueUnchanged:true,rawInstructionsAndPackagesUnchanged:true,revisionFormula:'Exact existing build-public-api.mjs instruction/archive/metadata/page SHA256 formula.'};
}
