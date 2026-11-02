// Prebuild every specialist ZIP: no per-download compression or model calls in production.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {buildBaseSpecialistPack} from '../src/roles/base-specialist-pack.ts';
const digest=b=>createHash('sha256').update(b).digest('hex');
export async function buildSpecialistPacks(publicDir,{progress=()=>{}}={}){
 const root=path.resolve(publicDir),folder=path.join(root,'specialists');
 for(const p of [root,folder])if((await fs.lstat(p).catch(()=>null))?.isSymbolicLink())throw Error('Specialist output cannot be a linked directory.');
 const cache=new Map();let cachedBytes=0;
 const read=async(p,max,expected)=>{
  if(!p.startsWith('/')||p.startsWith('//')||p.includes('..')||/[\\?#%]/.test(p))throw Error('Invalid specialist source path.');
  let b=cache.get(p);if(!b)b=await fs.readFile(path.join(root,p.slice(1)));
  if(b.length>max||expected&&(b.length!==expected.bytes||digest(b)!==expected.sha256))throw Error('Specialist source integrity mismatch: '+p);
  if(!cache.has(p)&&b.length<=8_000_000){while(cachedBytes+b.length>64_000_000&&cache.size){const key=cache.keys().next().value;cachedBytes-=cache.get(key).length;cache.delete(key);}cache.set(p,b);cachedBytes+=b.length;}
  return b;
 };
 const json=async p=>JSON.parse(new TextDecoder().decode(await read(p,16_000_000)));
 const index=await json('/data/roles-index.json'),catalogueBytes=await read('/data/blocks.json',12_000_000),catalogue=JSON.parse(new TextDecoder().decode(catalogueBytes)),manifest=await json('/data/public-api-manifest.json');
 if(index.sourceHash!==manifest.catalogue_sha256||digest(catalogueBytes)!==manifest.catalogue_sha256)throw Error('Specialist catalogue snapshots differ.');
 await fs.mkdir(folder,{recursive:true});
 const packs={},failures=[];let totalBytes=0;
 for(const [i,row]of index.roles.entries()){
  try{
   const roleBytes=await read('/data/roles/'+row.id+'.json',250_000,index.profiles[row.id]);
   const role=JSON.parse(new TextDecoder().decode(roleBytes));
   if(role.id!==row.id)throw Error('Specialist identity mismatch.');
   const pack=await buildBaseSpecialistPack(role,catalogue,manifest,read),target=path.join(folder,pack.filename);
   if(pack.bytes.length>=25_000_000)throw Error('Complete ZIP exceeds the static asset size limit.');
   if((await fs.lstat(target).catch(()=>null))?.isSymbolicLink())throw Error('Specialist archive target is a symlink.');
   const existing=await fs.readFile(target).catch(()=>null);if(!existing||digest(existing)!==digest(pack.bytes))await fs.writeFile(target,pack.bytes);
   packs[row.id]={path:'/specialists/'+pack.filename,bytes:pack.bytes.length,sha256:digest(pack.bytes),role_source_hash:role.sourceHash,files:pack.fileCount,methods:pack.methodCount};totalBytes+=pack.bytes.length;
  }catch(e){failures.push({id:row.id,error:e.message});}
  if((i+1)%50===0||i===index.roles.length-1)progress({checked:i+1,total:index.roles.length,failures:failures.length});
 }
 if(failures.length){const e=new Error('Complete specialist packs failed: '+JSON.stringify(failures));e.failures=failures;throw e;}
 const output={schema:'ai-blocks-base-specialist-packs/1',catalogue_hash:manifest.catalogue_sha256,count:index.roles.length,packs};
 await fs.writeFile(path.join(root,'data/base-specialist-packs.json'),JSON.stringify(output));
 return {specialists:index.roles.length,totalBytes,largest:Math.max(...Object.values(packs).map(p=>p.bytes))};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 console.log(JSON.stringify(await buildSpecialistPacks(fileURLToPath(new URL('../public/',import.meta.url)),{progress:r=>console.log(JSON.stringify(r))})));
}
