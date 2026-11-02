import {zipSync,unzipSync,strToU8} from 'fflate';
import {baseSpecialistFiles} from './base-specialist.mjs';
import {inspectSkillArchive,safePackagePath,sha256,verifyLocalReferences,referenceFixtureExclusions} from '../lib/workflow-execution.ts';
import type {RoleProfile} from './role-types';

type Asset={path:string;bytes:number;sha256:string};
type Source={revision_sha256:string;instruction:Asset;archive?:Asset|null;files?:Asset[];reference_validation?:{status:string}};
type Catalogue={blocks:{slug:string;uses?:string[];steps?:(string|[string,unknown]|{uses:string})[]}[]};
type Manifest={catalogue_sha256:string;resources:Record<string,Source>};
type Read=(path:string,max:number,expected?:Asset)=>Promise<Uint8Array>;
const MAX=60_000_000;

/** Same complete, verified archive for browser downloads and stateless REST. */
export async function buildBaseSpecialistPack(role:RoleProfile,catalogue:Catalogue,manifest:Manifest,read:Read) {
 if(role.catalogueHash!==manifest.catalogue_sha256)throw Error('The specialist and library changed. Reload before downloading.');
 for(const r of role.resources)if(manifest.resources[r.slug]?.revision_sha256!==r.revision)throw Error('A specialist method changed. Reload before downloading.');
 const blocks=new Map(catalogue.blocks.map(b=>[b.slug,b])),selected=new Set<string>();
 function collect(id:string){
  if(selected.has(id))return;
  if(!/^[a-z0-9][a-z0-9-]*$/.test(id)||!blocks.has(id)||!manifest.resources[id])throw Error('A required specialist method is unavailable.');
  selected.add(id); const b=blocks.get(id)!;
  for(const child of new Set([...(b.uses??[]),...(b.steps??[]).map(s=>typeof s==='string'?s:Array.isArray(s)?s[0]:s.uses)]))collect(child);
 }
 role.resources.forEach(r=>collect(r.slug));
 const files:Record<string,Uint8Array>={},sources:{slug:string;revision_sha256:string;files:string[];archive_instruction_copy?:string}[]=[];
 let total=0;
 function put(path:string,bytes:Uint8Array){
  if(!safePackagePath(path)||Object.hasOwn(files,path)||Object.keys(files).length>=6000||(total+=bytes.length)>MAX)throw Error('The complete specialist pack is unsafe or exceeds the 60 MB limit.');
  files[path]=bytes;
 }
 for(const [p,t]of Object.entries(baseSpecialistFiles(role)))put(p,strToU8(t as string));
 // Sequential source archives bound peak memory and preserve deterministic assembly.
 for(const slug of [...selected].sort()){
  const source=manifest.resources[slug];
  if(source.reference_validation?.status!=='PASS')throw Error('A required source has unresolved supporting files: '+slug);
  const text=await read(source.instruction.path,8_000_000,source.instruction);
  const raw=source.archive?await read(source.archive.path,20_000_000,source.archive):null;
  const entries:Record<string,Uint8Array>=raw?(inspectSkillArchive(raw,slug),unzipSync(raw)):{};
  const expected=new Map((source.files??[]).map(f=>[f.path,f]));
  if(raw){
   for(const [p,b]of Object.entries(entries)){
    if(p.endsWith('/'))continue;
    const f=expected.get(p);if(!f||b.length!==f.bytes||await sha256(b)!==f.sha256)throw Error('Source inventory mismatch: '+p);
   }
   for(const f of expected.values())if(!entries[f.path])throw Error('Missing source file: '+f.path);
  }else{
   for(const f of expected.values()){
    if(f.path!==slug+'/SKILL.md')throw Error('A complete source archive is missing: '+slug);
    if(text.length!==f.bytes||await sha256(text)!==f.sha256)throw Error('Source inventory mismatch: '+f.path);
   }
  }
  let archiveInstructionCopy:string|undefined;
  if(entries[slug+'/SKILL.md']&&await sha256(entries[slug+'/SKILL.md'])!==await sha256(text)){
   const normalize=(b:Uint8Array)=>new TextDecoder('utf-8',{fatal:true}).decode(b).replace(/\r\n?/g,'\n');
   if(normalize(entries[slug+'/SKILL.md'])!==normalize(text))throw Error('Source instruction mismatch: '+slug);
   // Published text and archive can have different line endings. Retain both exact byte versions.
   archiveInstructionCopy='source-originals/'+slug+'/SKILL.md';put(archiveInstructionCopy,entries[slug+'/SKILL.md']);
  }
  entries[slug+'/SKILL.md']=text;
  const paths=[];
  for(const [p,b]of Object.entries(entries).sort(([a],[b])=>a.localeCompare(b))){if(p.endsWith('/'))continue;put('skills/'+p,b);paths.push('skills/'+p);}
  sources.push({slug,revision_sha256:source.revision_sha256,files:paths,...(archiveInstructionCopy?{archive_instruction_copy:archiveInstructionCopy}:{})});
 }
 const resolved=verifyLocalReferences(files);
 put('sources.json',strToU8(JSON.stringify({schema:'ai-blocks-specialist-sources/1',role_id:role.id,role_source_hash:role.sourceHash,catalogue_hash:role.catalogueHash,methods:sources},null,2)));
 put('pack-checks.json',strToU8(JSON.stringify({state:'PACK_VERIFIED_NOT_EXECUTED',private_context_included:false,checks:['source hashes','complete archives and licences','safe paths and size limits','operative local reference links'],resolved_reference_count:resolved.length,reference_fixture_exclusions:referenceFixtureExclusions(files),execution_checks:'NOT_RUN'},null,2)));
 const inventory=await Promise.all(Object.entries(files).map(async([path,b])=>({path,bytes:b.length,sha256:await sha256(b)})));
 put('manifest.json',strToU8(JSON.stringify({schema:'ai-blocks-specialist-pack/1',files:inventory},null,2)));
 // ZIP timestamps are local wall time; a fixed local date is portable across build timezones.
 const mtime=new Date(2026,0,1,0,0,0);
 const bytes=zipSync(Object.fromEntries(Object.entries(files).sort(([a],[b])=>a.localeCompare(b)).map(([p,b])=>[p,[b,{mtime}]])),{level:6});
 return {bytes,filename:role.id+'-base-specialist.zip',fileCount:Object.keys(files).length,methodCount:sources.length};
}

export async function loadBaseSpecialistPack(role:Pick<RoleProfile,'id'|'sourceHash'|'catalogueHash'>){
 const read:Read=async(path,max,expected)=>{
  if(!path.startsWith('/')||path.startsWith('//')||/[\\?#%]/.test(path)||path.includes('..'))throw Error('Invalid published asset path.');
  const r=await fetch(path);if(!r.ok||!r.body)throw Error('The complete specialist files could not load. Try again.');
  if(expected&&expected.bytes>max)throw Error('The specialist source exceeds the download limit.');
  const chunks:Uint8Array[]=[],reader=r.body.getReader();let size=0;
  for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw Error('The source exceeds the download limit.');}chunks.push(value);}
  const b=new Uint8Array(size);let offset=0;for(const c of chunks){b.set(c,offset);offset+=c.length;}
  if(expected&&(b.length!==expected.bytes||await sha256(b)!==expected.sha256))throw Error('The source changed during download. Reload and try again.');
  return b;
 };
 const index=JSON.parse(new TextDecoder().decode(await read('/data/base-specialist-packs.json',1_000_000)));
 const pack=index.packs?.[role.id],filename=role.id+'-base-specialist.zip';
 if(index.schema!=='ai-blocks-base-specialist-packs/1'||index.catalogue_hash!==role.catalogueHash||!pack||pack.role_source_hash!==role.sourceHash||pack.path!=='/specialists/'+filename||!Number.isSafeInteger(pack.bytes)||pack.bytes<=0||pack.bytes>=25_000_000||!/^[a-f0-9]{64}$/.test(pack.sha256))throw Error('The specialist download changed. Reload and try again.');
 return {bytes:await read(pack.path,25_000_000,pack),filename,fileCount:pack.files as number,methodCount:pack.methods as number};
}
