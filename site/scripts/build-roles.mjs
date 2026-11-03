import {workerContract} from "../src/roles/specialist-worker.mjs";
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {FEATURED_ROLES,ROLE_AREAS,roleSeeds} from '../src/roles/role-definitions.mjs';
import {roleInstructions} from '../src/roles/role-instructions.mjs';
import {CONTEXT_KINDS,contextKindFor,practiceOf} from '../src/roles/context-intake.mjs';
import {roleExpertise} from '../src/roles/role-expertise.mjs';
import {TARGET_METHODS,MAX_ADDED,supportMethods,reviewerMinds,workedExample,roleEvaluation,familyOf,plainSummary,plainList} from '../src/roles/role-enrichment.mjs';
import {grade} from '../../tools/readability.mjs';
import {TASKS} from '../src/lib/catalogue-taxonomy.mjs';
import {nextVersion} from '../src/roles/role-versions.mjs';
import {roleLearning} from '../src/roles/training-rules.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const strings=value=>Array.isArray(value)?value.flatMap(v=>typeof v==='string'&&v.trim()?[v.trim()]:v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).length===1&&typeof Object.values(v)[0]==='string'?[`${Object.keys(v)[0]}: ${Object.values(v)[0]}`]:[]):[];
const toolsOf=page=>Array.isArray(page.works_best_with?.tools)?page.works_best_with.tools.filter(t=>typeof t?.name==='string'&&typeof t?.why==='string').map(t=>`${t.name}: ${t.why}`):strings(page.works_best_with);
const kind=b=>b.category==='orchestrator'?'workflow':b.type??'skill';
const href=b=>`/${b.type==='agent'?'agents':b.type==='prompt'?'prompts':b.type==='mind'?'minds':b.type==='workflow'||b.type==='routine'||b.category==='orchestrator'?'workflows':'skills'}/${b.slug}`;
const TASK_BY_ID=new Map(TASKS.map(t=>[t.id,t]));
export const RELATED=4,LINKS_PER_ITEM=3;
export function buildRoles({catalogue,manifest,page,skill,reference=()=>'',evals={},learned={},versions=null,today=null}) {
 const bySlug=Object.fromEntries(catalogue.blocks.map(b=>[b.slug,b]));
 const ledger={...(versions??{})};
 const profiles=roleSeeds(catalogue.blocks).map(seed=>{
  const lead=bySlug[seed.lead];if(!lead)throw Error('Missing role lead: '+seed.lead);
  const p=page(seed.lead),contextKind=contextKindFor(seed.area,seed.lead,lead.task),practice=practiceOf(seed.area,seed.lead,lead.task),contextMethod=CONTEXT_KINDS[contextKind].method;
  const core=[...new Set([seed.lead,...seed.resources,...(lead.uses??[])])].filter(s=>s!==contextMethod);
  const support=supportMethods({lead,leadPage:p,blocks:catalogue.blocks,manifest,exclude:new Set([...core,contextMethod]),count:Math.min(MAX_ADDED,TARGET_METHODS-core.length)});
  const deliverables=strings(seed.remit?.deliverables??p.you_get), inputs=strings(seed.remit?.inputs??p.you_give);
  if(!deliverables.length||!inputs.length)throw Error('Role needs concrete inputs and deliverables: '+seed.id);
  // The card and page summary: the role's own words, chosen by rule to read at grade 8 or lower (role-enrichment.mjs).
  const summary=plainSummary({summary:seed.remit?.summary??lead.summary,subhead:seed.remit?'':p.subhead,inputs,deliverables},grade);
  const reviewers=reviewerMinds({role:{name:seed.name,summary,area:seed.area,task:lead.task,deliverables,methods:[...core,...support]},blocks:catalogue.blocks,manifest,exclude:new Set([...core,...support,contextMethod])}).slice(0,Math.max(0,23-core.length-support.length));
  const resourceIds=[...core,...support,contextMethod,...reviewers];
  if(resourceIds.length>24)throw Error('Review oversized role toolbox: '+seed.id);
  const resources=resourceIds.map(slug=>{
   const b=bySlug[slug], r=manifest.resources[slug];if(!b||!r||r.reference_validation?.status!=='PASS')throw Error('Unavailable role method: '+slug);
   const text=skill(slug);if(!text?.trim()||sha(Buffer.from(text))!==r.instruction.sha256)throw Error('Role instruction bytes differ: '+slug);
   return {slug,name:b.name,summary:b.summary,task:b.task,kind:kind(b),path:href(b),revision:r.revision_sha256,skillPath:r.instruction.path,bundled:slug!==seed.lead&&(lead.uses??[]).includes(slug),onboarding:slug===contextMethod,
    ...(support.includes(slug)?{support:true}:{}),...(reviewers.includes(slug)?{reviewer:true}:{}),
    ...(b.source?.license?{license:b.source.license}:{}),...(b.source?.by?{by:b.source.by}:{}),...(b.source?.url?{sourceUrl:b.source.url}:{})};
  });
  const capabilities=seed.remit?.capabilities??(Array.isArray(p.how_it_works)?p.how_it_works.filter(v=>v&&typeof v.title==='string'&&typeof v.text==='string').map(v=>({name:v.title,description:v.text})):[]);
  if(!capabilities.length)capabilities.push({name:lead.name,description:lead.summary});
  const functions=resources.map(r=>({name:r.name,description:r.summary,method:r.slug,when:strings(page(r.slug).when),inputs:strings(page(r.slug).you_give),deliverables:strings(page(r.slug).you_get)}));
  const fit=strings(seed.remit?.fit??p.when);
  // Tools come from the methods that do the work; context setup and review lenses add no tools.
  const toolSources=resources.filter(r=>!r.onboarding&&!r.reviewer&&!r.support);
  const expertise=roleExpertise({id:seed.id,area:practice,lead:seed.lead,skill:skill(seed.lead),source:reference(seed.lead,'references/source-agent.md'),learned:learned[seed.id]});
  const example=workedExample({seed,summary,fit,inputs,leadPage:p});
  const profile={schema:'ai-blocks-role/1',id:seed.id,name:seed.name,summary,area:seed.area,family:familyOf(lead,TASK_BY_ID),lead:seed.lead,featured:seed.featured,contextKind,
   deliverables,inputs,opening:{give:plainList(inputs,3,grade),get:plainList(deliverables,4,grade)},helpfulInputs:strings(p.works_best_with?.inputs),fit,limits:[...strings(seed.remit?.limits??p.not_for),...strings(seed.limits)],tools:[...new Set([...seed.tools,...toolSources.flatMap(r=>toolsOf(page(r.slug)))])],
   method:strings(p.how_to_use),capabilities,expertise,workedExample:example,example:example.task,functions,resources,resourceCount:resources.length,
   sourceChecks:{completeMethods:resources.length,referenceValidation:'PASS'},catalogueHash:manifest.catalogue_sha256};
  profile.evaluation=roleEvaluation({id:seed.id,deliverables,inputs,fit,expertise,results:evals});
  // Content fingerprint excludes the catalogue hash, so unrelated library changes do not bump versions.
  const short=v=>sha(JSON.stringify(v)).slice(0,16);
  const parts={remit:short([profile.name,summary,deliverables,inputs,fit,profile.limits,capabilities]),expertise:short(expertise),checks:short(profile.evaluation.rubric),example:short(example),methods:resources.map(r=>r.slug+'@'+r.revision.slice(0,12))};
  if(versions){ledger[seed.id]=nextVersion(ledger[seed.id],parts,today);profile.version={number:ledger[seed.id].version,since:ledger[seed.id].since,changes:ledger[seed.id].changes.slice(0,5)};}
  profile.learning=roleLearning(learned[seed.id]);
  profile.worker=workerContract(profile);
  profile.instructions=roleInstructions(profile,resourceIds);
  profile.sourceHash=sha(JSON.stringify(profile));
  return profile;
 });
 const ids=new Set(),names=new Set();for(const p of profiles){if(!/^[a-z0-9][a-z0-9-]{0,69}$/.test(p.id)||ids.has(p.id)||names.has(p.name.toLowerCase()))throw Error('Duplicate or invalid role: '+p.id+' / '+p.name);ids.add(p.id);names.add(p.name.toLowerCase());}
 for(const role of FEATURED_ROLES)if(!ids.has(role.id))throw Error('Missing featured role');
 // Related specialists: others doing the same kind of work (then the same area), most shared working methods first; ties are broken by a
 // hash of the pair, so links spread across the family instead of all pointing at its first few roles.
 const work=new Map(profiles.map(p=>[p.id,new Set(p.resources.filter(r=>!r.onboarding&&!r.reviewer).map(r=>r.slug))]));
 const pairHash=s=>{let h=2166136261;for(const ch of s)h=Math.imul(h^ch.charCodeAt(0),16777619);return h>>>0;};
 for(const p of profiles){
  const mine=work.get(p.id);
  const near=profiles.filter(o=>o.id!==p.id&&(o.family.id===p.family.id||o.area===p.area)).map(o=>{let shared=0;for(const s of work.get(o.id))if(mine.has(s))shared++;return {o,score:(o.family.id===p.family.id?100:0)+shared*10+(o.featured?2:0),tie:pairHash(p.id+'>'+o.id)};})
   .sort((a,b)=>b.score-a.score||a.tie-b.tie).slice(0,RELATED).map(({o})=>({id:o.id,name:o.name}));
  delete p.sourceHash;p.related=near;p.sourceHash=sha(JSON.stringify(p));
 }
 const families=[...new Map(profiles.map(p=>[p.family.id,p.family])).values()].sort((a,b)=>a.name.localeCompare(b.name));
 for(const id of Object.keys(ledger))if(!ids.has(id))delete ledger[id];
 return {profiles,ledger,index:{schema:'ai-blocks-roles/1',sourceHash:manifest.catalogue_sha256,areas:ROLE_AREAS,families,profiles:Object.fromEntries(profiles.map(p=>[p.id,{sha256:sha(JSON.stringify(p)),bytes:Buffer.byteLength(JSON.stringify(p))}])),
  roles:profiles.map(({id,name,summary,area,family,deliverables,resourceCount,featured,lead})=>({id,name,summary,area,family:family.id,deliverables:deliverables.slice(0,3),resourceCount,featured,keywords:String(bySlug[lead].cues??'').toLowerCase().slice(0,240)}))}};
}
export function roleLinks(profiles){
 const links={};
 for(const p of profiles)for(const r of p.resources)if(!r.onboarding&&!r.reviewer&&r.kind!=='mind')(links[r.slug]??=[]).push({p,lead:r.slug===p.lead});
 const pick=rows=>rows.sort((a,b)=>Number(b.lead)-Number(a.lead)||Number(b.p.featured)-Number(a.p.featured)||a.p.resources.length-b.p.resources.length||a.p.id.localeCompare(b.p.id)).slice(0,LINKS_PER_ITEM).map(({p})=>[p.id,p.name]);
 return Object.fromEntries(Object.entries(links).sort(([a],[b])=>a.localeCompare(b)).map(([slug,rows])=>[slug,pick(rows)]));
}
// llms/specialists.txt: every specialist with its one line, linked from llms.txt (build-index.mjs writes that file first).
export function writeSpecialistLlms(root,profiles){
 const SITE='https://useaiblocks.com',dir=path.join(root,'public/llms');fs.mkdirSync(dir,{recursive:true});
 const rows=[...profiles].sort((a,b)=>a.name.localeCompare(b.name)).map(p=>`- [${p.name}](${SITE}/roles/${p.id}): ${p.summary}`);
 fs.writeFileSync(path.join(dir,'specialists.txt'),[`# Specialists: AI Blocks`,'',`> ${profiles.length} AI specialists you can hire for free. Each one bundles working methods for one kind of job and runs in your own AI. Load one with the MCP tool prepare_specialist or GET ${SITE}/api/v1/specialists/{id}/pack.`,'',...rows,''].join('\n'));
}
const readJson=(file,fallback)=>{try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch{return fallback;}};
export function writeRoles(root=process.cwd()){
 const read=file=>JSON.parse(fs.readFileSync(path.join(root,'public/data',file),'utf8'));
 const catalogue=read('blocks.json'),manifest=read('public-api-manifest.json');
 const rolesDir=path.join(root,'src/roles'),versionsFile=path.join(rolesDir,'role-versions.json');
 const evals=readJson(path.join(rolesDir,'role-evals.json'),{results:{}}).results??{},learned=readJson(path.join(rolesDir,'role-learned.json'),{roles:{}}).roles??{};
 const versions=readJson(versionsFile,{roles:{}}).roles??{};
 const built=buildRoles({catalogue,manifest,page:slug=>read('pages/'+slug+'.json'),skill:slug=>fs.readFileSync(path.join(root,'public/skills',slug,'SKILL.md'),'utf8'),
  reference:(slug,file)=>{try{return fs.readFileSync(path.join(root,'public/skills',slug,file),'utf8');}catch{return '';}},evals,learned,versions,today:new Date().toISOString().slice(0,10)});
 const ledgerText=JSON.stringify({schema:'ai-blocks-role-versions/1',note:'Updated by build-roles when a role\'s own content changes. Commit it with the change.',roles:Object.fromEntries(Object.entries(built.ledger).sort(([a],[b])=>a.localeCompare(b)))})+'\n';
 let current='';try{current=fs.readFileSync(versionsFile,'utf8');}catch{}
 if(current!==ledgerText)fs.writeFileSync(versionsFile,ledgerText);
 const folder=path.join(root,'public/data/roles');fs.mkdirSync(folder,{recursive:true});
 const expected=new Set(built.profiles.map(p=>p.id+'.json'));for(const name of fs.readdirSync(folder))if(/^[a-z0-9-]+\.json$/.test(name)&&!expected.has(name))fs.unlinkSync(path.join(folder,name));
 for(const p of built.profiles)fs.writeFileSync(path.join(folder,p.id+'.json'),JSON.stringify(p));
 fs.writeFileSync(path.join(root,'public/data/roles-index.json'),JSON.stringify(built.index));
 const {profiles:inventory,...searchIndex}=built.index;
 fs.writeFileSync(path.join(root,'public/data/roles-search.json'),JSON.stringify(searchIndex));
 const pageFolder=path.join(root,'public/data/roles-pages');fs.mkdirSync(pageFolder,{recursive:true});
 for(let page=1;page<=Math.ceil(built.index.roles.length/24);page++){
  const from=(page-1)*24;
  const starter={...searchIndex,starter:true,page,roles:searchIndex.roles.map((r,i)=>i>=from&&i<from+24?r:{...r,summary:'',deliverables:[],keywords:''})};
  fs.writeFileSync(page===1?path.join(root,'public/data/roles-starter.json'):path.join(pageFolder,page+'.json'),JSON.stringify(starter));
 }
 // "Specialists who do this" on item pages: for each skill, prompt, agent or workflow, the roles that work with it
 // (the role built on it first). Split by the slug's first character so an item page loads one small file.
 const links=roleLinks(built.profiles),linkFolder=path.join(root,'public/data/role-links');fs.rmSync(linkFolder,{recursive:true,force:true});fs.mkdirSync(linkFolder,{recursive:true});
 const buckets={};for(const [slug,rows] of Object.entries(links))(buckets[slug[0]]??={})[slug]=rows;
 for(const [key,items] of Object.entries(buckets))fs.writeFileSync(path.join(linkFolder,key+'.json'),JSON.stringify({schema:'ai-blocks-role-links/1',items}));
 writeSpecialistLlms(root,built.profiles);
 const added=built.profiles.reduce((n,p)=>n+p.resources.filter(r=>r.support).length,0),reviewed=built.profiles.filter(p=>p.resources.some(r=>r.reviewer)).length;
 console.log(`Roles: ${built.profiles.length} source-backed setups; ${built.profiles.filter(p=>p.featured).length} featured; ${added} support methods added; ${reviewed} with reviewer minds; complete methods and reference manifests verified.`);
 return built;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))writeRoles();
