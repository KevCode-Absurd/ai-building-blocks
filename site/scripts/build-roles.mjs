import {workerContract,specialistFiles} from "../src/roles/specialist-worker.mjs";
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {FEATURED_ROLES,ROLE_AREAS,roleSeeds} from '../src/roles/role-definitions.mjs';
import {roleInstructions} from '../src/roles/role-instructions.mjs';
import {CONTEXT_METHOD} from '../src/roles/context-intake.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const strings=value=>Array.isArray(value)?value.flatMap(v=>typeof v==='string'&&v.trim()?[v.trim()]:v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===1&&typeof Object.values(v)[0]==='string'?[`${Object.keys(v)[0]}: ${Object.values(v)[0]}`]:[]):[];
const toolsOf=page=>Array.isArray(page.works_best_with?.tools)?page.works_best_with.tools.filter(t=>typeof t?.name==='string'&&typeof t?.why==='string').map(t=>`${t.name}: ${t.why}`):strings(page.works_best_with);
const kind=b=>b.category==='orchestrator'?'workflow':b.type??'skill';
const href=b=>`/${b.type==='agent'?'agents':b.type==='prompt'?'prompts':b.type==='mind'?'minds':b.type==='workflow'||b.type==='routine'||b.category==='orchestrator'?'workflows':'skills'}/${b.slug}`;
export function buildRoles({catalogue,manifest,page,skill}) {
 const bySlug=Object.fromEntries(catalogue.blocks.map(b=>[b.slug,b]));
 const profiles=roleSeeds(catalogue.blocks).map(seed=>{
  const lead=bySlug[seed.lead];if(!lead)throw Error('Missing role lead: '+seed.lead);
  const p=page(seed.lead), resourceIds=[...new Set([seed.lead,...seed.resources,...(lead.uses??[]),CONTEXT_METHOD])];
  if(resourceIds.length>24)throw Error('Review oversized role toolbox: '+seed.id);
  const resources=resourceIds.map(slug=>{
   const b=bySlug[slug], r=manifest.resources[slug];if(!b||!r||r.reference_validation?.status!=='PASS')throw Error('Unavailable role method: '+slug);
   const text=skill(slug);if(!text?.trim()||sha(Buffer.from(text))!==r.instruction.sha256)throw Error('Role instruction bytes differ: '+slug);
   return {slug,name:b.name,summary:b.summary,task:b.task,kind:kind(b),path:href(b),revision:r.revision_sha256,skillPath:r.instruction.path,bundled:slug!==seed.lead&&(lead.uses??[]).includes(slug),onboarding:slug===CONTEXT_METHOD,
    ...(b.source?.license?{license:b.source.license}:{}),...(b.source?.by?{by:b.source.by}:{}),...(b.source?.url?{sourceUrl:b.source.url}:{})};
  });
  const deliverables=strings(p.you_get), inputs=strings(p.you_give);
  if(!deliverables.length||!inputs.length)throw Error('Role needs concrete inputs and deliverables: '+seed.id);
  const capabilities=Array.isArray(p.how_it_works)?p.how_it_works.filter(v=>v&&typeof v.title==='string'&&typeof v.text==='string').map(v=>({name:v.title,description:v.text})):[];
  if(!capabilities.length)capabilities.push({name:lead.name,description:lead.summary});
  const functions=resources.map(r=>({name:r.name,description:r.summary,method:r.slug,when:strings(page(r.slug).when),inputs:strings(page(r.slug).you_give),deliverables:strings(page(r.slug).you_get)}));
  const profile={schema:'ai-blocks-role/1',id:seed.id,name:seed.name,summary:lead.summary,area:seed.area,lead:seed.lead,featured:seed.featured,
   deliverables,inputs,helpfulInputs:strings(p.works_best_with?.inputs),fit:strings(p.when),limits:[...strings(p.not_for),...strings(seed.limits)],tools:[...new Set([...seed.tools,...resources.flatMap(r=>toolsOf(page(r.slug)))])],
   method:strings(p.how_to_use),capabilities,functions,example:seed.example??'',resources,resourceCount:resources.length,
   sourceChecks:{completeMethods:resources.length,referenceValidation:'PASS'},catalogueHash:manifest.catalogue_sha256,sourceHash:sha(JSON.stringify({seed,resources,deliverables,inputs,source:manifest.catalogue_sha256}))};
  profile.worker=workerContract(profile);
  profile.workerFiles=specialistFiles(profile);
  profile.instructions=roleInstructions(profile,resourceIds);
  profile.sourceHash=sha(JSON.stringify({...profile,sourceHash:undefined}));
  return profile;
 });
 const ids=new Set(),names=new Set();for(const p of profiles){if(!/^[a-z0-9][a-z0-9-]{0,69}$/.test(p.id)||ids.has(p.id)||names.has(p.name.toLowerCase()))throw Error('Duplicate or invalid role: '+p.id+' / '+p.name);ids.add(p.id);names.add(p.name.toLowerCase());}
 for(const role of FEATURED_ROLES)if(!ids.has(role.id))throw Error('Missing featured role');
 return {profiles,index:{schema:'ai-blocks-roles/1',sourceHash:manifest.catalogue_sha256,areas:ROLE_AREAS,profiles:Object.fromEntries(profiles.map(p=>[p.id,{sha256:sha(JSON.stringify(p)),bytes:Buffer.byteLength(JSON.stringify(p))}])),roles:profiles.map(({id,name,summary,area,deliverables,resourceCount,featured})=>({id,name,summary,area,deliverables:deliverables.slice(0,3),resourceCount,featured}))}};
}
export function writeRoles(root=process.cwd()){
 const read=file=>JSON.parse(fs.readFileSync(path.join(root,'public/data',file),'utf8'));
 const catalogue=read('blocks.json'),manifest=read('public-api-manifest.json');
 const built=buildRoles({catalogue,manifest,page:slug=>read('pages/'+slug+'.json'),skill:slug=>fs.readFileSync(path.join(root,'public/skills',slug,'SKILL.md'),'utf8')});
 const folder=path.join(root,'public/data/roles');fs.mkdirSync(folder,{recursive:true});
 const expected=new Set(built.profiles.map(p=>p.id+'.json'));for(const name of fs.readdirSync(folder))if(/^[a-z0-9-]+\.json$/.test(name)&&!expected.has(name))fs.unlinkSync(path.join(folder,name));
 for(const p of built.profiles)fs.writeFileSync(path.join(folder,p.id+'.json'),JSON.stringify(p));
 fs.writeFileSync(path.join(root,'public/data/roles-index.json'),JSON.stringify(built.index));
 const {profiles:inventory,...searchIndex}=built.index;
 fs.writeFileSync(path.join(root,'public/data/roles-search.json'),JSON.stringify(searchIndex));
 const pageFolder=path.join(root,'public/data/roles-pages');fs.mkdirSync(pageFolder,{recursive:true});
 for(let page=1;page<=Math.ceil(built.index.roles.length/24);page++){
  const from=(page-1)*24;
  const starter={...searchIndex,starter:true,page,roles:searchIndex.roles.map((r,i)=>i>=from&&i<from+24?r:{...r,summary:'',deliverables:[]})};
  fs.writeFileSync(page===1?path.join(root,'public/data/roles-starter.json'):path.join(pageFolder,page+'.json'),JSON.stringify(starter));
 }
 console.log(`Roles: ${built.profiles.length} source-backed setups; ${built.profiles.filter(p=>p.featured).length} featured; complete methods and reference manifests verified.`);
 return built;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))writeRoles();
