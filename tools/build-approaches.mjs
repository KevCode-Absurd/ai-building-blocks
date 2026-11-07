// Compile explicit approach mappings. This tool never calls a model or treats
// output ports as evidence that two methods make recognisably different work.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import YAML from '../site/node_modules/yaml/dist/index.js';
import {TASKS} from '../site/src/lib/catalogue-taxonomy.mjs';
import {compileClassifications} from '../site/scripts/lib/catalogue-classification.mjs';

const unique=rows=>[...new Set(rows)];
const array=value=>Array.isArray(value)?value:[];
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const listFields=['items','pickers','checks','tool_guides','supporting_items','seeds_from'];
const LEGACY_JOBS={copy:'write-ad-copy',email:'write-ad-copy',ads:'make-image-ads',image:'make-image-ads',video:'make-video-ads',page:'write-landing-page',analysis:'read-ad-results',research:'understand-customers',brand:'brand-file',offer:'make-offer',organic:'grow-social',ops:'set-up-ai'};
const readYaml=file=>fs.existsSync(file)?YAML.parse(fs.readFileSync(file,'utf8'))??{}:{};

/** Read authored job fields, with the exact precedence used by build-index. */
export function collectApproachItems(root) {
 const classification=compileClassifications(readYaml(path.join(root,'catalogue-items/classification.yaml')));
 const items=[];
 for(const directory of fs.readdirSync(path.join(root,'catalogue-items'),{withFileTypes:true}).filter(row=>row.isDirectory()).sort((a,b)=>a.name.localeCompare(b.name))) {
  for(const entry of fs.readdirSync(path.join(root,'catalogue-items',directory.name),{withFileTypes:true}).filter(row=>row.isDirectory()).sort((a,b)=>a.name.localeCompare(b.name))) {
   const folder=path.join(root,'catalogue-items',directory.name,entry.name),file=path.join(folder,'item.yaml');
   if(!fs.existsSync(file)) {
    const mindFile=path.join(folder,'mind.yaml');
    if(fs.existsSync(mindFile)){const mind=readYaml(mindFile);items.push({slug:mind.slug??entry.name,name:mind.name??entry.name,role:'lens',type:'mind',job:'think-with-minds',outputs:['mind_view'],uses:[],summary:mind.summary??'',when:'',source:path.relative(root,mindFile).split(path.sep).join('/')});}
    continue;
   }
   const item=readYaml(file),slug=item.slug??entry.name;
   const ownPage=path.join(folder,'page.yaml'),page=readYaml(fs.existsSync(ownPage)?ownPage:path.join(root,'tools/orchestrator-pages',slug+'.yaml'));
   items.push({slug,name:item.name??slug,role:item.role??'make',type:item.type??'skill',job:classification.primary.get(slug)??page.job??LEGACY_JOBS[item.job]??(TASKS.some(row=>row.id===item.job)?item.job:'set-up-ai'),outputs:array(item.outputs).map(row=>typeof row==='string'?row:row?.type).filter(Boolean),uses:array(item.uses),summary:item.summary??'',when:array(page.when).find(value=>typeof value==='string')??item.summary??'',source:path.relative(root,file).split(path.sep).join('/')});
  }
 }
 const publicIndex=path.join(root,'site/public/data/blocks.json');
 if(fs.existsSync(publicIndex)) {
  const published=new Set(JSON.parse(fs.readFileSync(publicIndex,'utf8')).blocks.map(item=>item.slug));
  return items.filter(item=>published.has(item.slug));
 }
 return items;
}

/** All errors are returned together so authored data can be reviewed as a diff. */
export function compileApproaches({source={},lenses={},items=[],roles=[],manifest={}}={}) {
 const errors=[],bySlug=new Map(items.map(item=>[item.slug,item])),knownJobs=new Set([...TASKS.map(job=>job.id),...items.map(item=>item.job)]);
 const jobSource=source.jobs??source,lensSource=lenses.lenses??lenses;
 const lensMap=Array.isArray(lensSource)?Object.fromEntries(lensSource.map(lens=>[lens.id,lens])):lensSource;
 const fail=(field,message)=>errors.push({path:field,message});
 const jobs={};
 for(const job of [...knownJobs].sort()) {
  const entry=jobSource[job]??{},families=[],membership=new Map();
  if(entry.families!==undefined&&!Array.isArray(entry.families))fail(`jobs.${job}.families`,'Expected an array of approach families.');
  if(entry.output_shape_default!==undefined&&!['one_decision','many_artifacts','system_build'].includes(entry.output_shape_default))fail(`jobs.${job}.output_shape_default`,'Choose one_decision, many_artifacts or system_build.');
  if(entry.default_volume!==undefined&&(!Number.isInteger(entry.default_volume)||entry.default_volume<1||entry.default_volume>1000))fail(`jobs.${job}.default_volume`,'Use a whole count from 1 to 1,000.');
  for(const [number,family] of array(entry.families).entries()) {
   const at=`jobs.${job}.families[${number}]`;
   if(!/^[a-z0-9][a-z0-9-]{0,79}$/.test(family.id??''))fail(at+'.id','Use a short family slug.');
   if(families.some(row=>row.id===family.id))fail(at+'.id','Family id is repeated in this job.');
   for(const field of ['name','what_it_looks_like','when_it_wins'])if(typeof family[field]!=='string'||!family[field].trim())fail(at+'.'+field,'A clear description is required.');
   if(!array(family.items).length)fail(at+'.items','A family must have at least one real maker or renderer.');
   for(const field of listFields) {
    if(family[field]!==undefined&&!Array.isArray(family[field]))fail(at+'.'+field,'Expected an array of catalogue slugs.');
    if(new Set(array(family[field])).size!==array(family[field]).length)fail(at+'.'+field,'Do not repeat an item in the same family list.');
    for(const [i,slug] of array(family[field]).entries()) {
     const item=bySlug.get(slug);
     if(!item)fail(`${at}.${field}[${i}]`,'This catalogue item does not exist.');
     else if(field==='items'&&(item.type==='mind'||!['make','render'].includes(item.role)))fail(`${at}.${field}[${i}]`,'Output families contain makers and renderers; put supporting methods and optional minds in the other lists.');
     if(field==='items')membership.set(slug,(membership.get(slug)??0)+1);
    }
   }
   const validModalities=new Set(['text','image','video','audio','3d','interactive','doc','data']);
   if(!array(family.modality).length||array(family.modality).some(value=>!validModalities.has(value)))fail(at+'.modality','List the media this family can actually produce.');
   for(const id of array(family.lenses))if(!Object.hasOwn(lensMap,id))fail(at+'.lenses','Unknown lens: '+id);
   families.push({...family,items:unique(array(family.items)),pickers:unique(array(family.pickers)),checks:unique(array(family.checks)),tool_guides:unique(array(family.tool_guides)),supporting_items:unique(array(family.supporting_items)),seeds_from:unique(array(family.seeds_from)),tools_needed:unique(array(family.tools_needed)),lead_roles:unique(array(family.lead_roles).concat(roles.filter(role=>array(family.items).includes(role.lead)).map(role=>role.id))),personas:unique(array(family.personas)),lenses:unique(array(family.lenses))});
  }
  for(const [slug,count] of membership)if(count>3)fail(`jobs.${job}.families`,'An item belongs to more than three families: '+slug);
  const jobLenses=array(entry.lenses);
  for(const id of jobLenses)if(!Object.hasOwn(lensMap,id))fail(`jobs.${job}.lenses`,'Unknown lens: '+id);
  const makers=items.filter(item=>item.job===job&&item.type!=='mind'&&['make','render'].includes(item.role));
  const covered=new Set(families.flatMap(family=>listFields.flatMap(field=>family[field])));
  const candidates=Object.fromEntries(unique(makers.flatMap(item=>item.outputs)).sort().map(output=>[output,makers.filter(item=>item.outputs.includes(output)).map(item=>item.slug)]));
  const termCounts=new Map();for(const item of items.filter(item=>item.job===job&&item.type!=='mind'))for(const term of (item.name+' '+item.summary).toLowerCase().match(/[a-z][a-z0-9]{2,}/g)??[])termCounts.set(term,(termCounts.get(term)??0)+1);
  const keywords=[...termCounts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,180).map(([term])=>term);
  jobs[job]={name:TASKS.find(task=>task.id===job)?.name??job,keywords,output_shape_default:entry.output_shape_default??'one_decision',default_volume:entry.default_volume??1,families,lenses:jobLenses.map(id=>({...lensMap[id],id})),coverage:{make_items:makers.length,covered_items:makers.filter(item=>covered.has(item.slug)).length,families:families.length,minimum_families:makers.length>=10?4:0,status:makers.length>=10&&families.length<4?'GAP':'PASS',unmapped_items:makers.filter(item=>!covered.has(item.slug)).map(item=>item.slug),draft_output_groups:candidates,missing_checks:families.filter(family=>!family.checks.length).map(family=>family.id)}};
 }
 for(const job of Object.keys(jobSource))if(!knownJobs.has(job)&&!['schema','note','source','review_status'].includes(job))fail('jobs.'+job,'Unknown catalogue job.');
 for(const [id,lens] of Object.entries(lensMap))for(const field of ['minds','check_items'])for(const slug of array(lens[field]))if(!bySlug.has(slug))fail(`lenses.${id}.${field}`,'Unknown catalogue item: '+slug);
 const coverage=Object.entries(jobs).map(([job,value])=>({job,...value.coverage})).sort((a,b)=>b.make_items-a.make_items||a.job.localeCompare(b.job));
 const pinned=Object.fromEntries(unique(Object.values(jobs).flatMap(job=>job.families.flatMap(family=>listFields.flatMap(field=>family[field])))).sort().flatMap(slug=>{const revision=manifest.resources?.[slug]?.revision_sha256;return /^[a-f0-9]{64}$/.test(revision??'')?[[slug,revision]]:[];}));
 return {ok:errors.length===0,errors,index:{schema:'ai-blocks-approach-index/1',source_sha256:hash({source,lenses,items:items.map(({slug,job,role,outputs})=>({slug,job,role,outputs}))}),review_status:source.review_status??'DRAFT_REQUIRES_REVIEW',note:'Families come from explicit catalogue mappings. Output groups are inventory for a human or approved text model; they are not counted as approach families.',jobs,revisions:pinned,coverage:{status:coverage.some(row=>row.status==='GAP')?'GAPS_REMAIN':'PASS',jobs:coverage,top_ten:coverage.slice(0,10).map(row=>row.job)}}};
}

export function buildApproaches(root=path.resolve(fileURLToPath(new URL('..',import.meta.url)))) {
 const source=readYaml(path.join(root,'catalogue-items/_approaches.yaml')),lenses=readYaml(path.join(root,'catalogue-items/_lenses.yaml'));
 const readJson=file=>{try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch{return {};}};
 const roles=readJson(path.join(root,'site/public/data/roles-index.json')).roles??[],manifest=readJson(path.join(root,'site/public/data/public-api-manifest.json'));
 const result=compileApproaches({source,lenses,items:collectApproachItems(root),roles,manifest});
 if(!result.ok)throw new Error(result.errors.map(error=>error.path+': '+error.message).join('\n'));
 const output=path.join(root,'site/public/data');fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'approach-index.json'),JSON.stringify(result.index)+'\n');
 const gaps=result.index.coverage.jobs.filter(job=>job.status==='GAP');
 console.log(`Approaches: ${Object.values(result.index.jobs).reduce((sum,job)=>sum+job.families.length,0)} explicit families; ${gaps.length} jobs still need family mapping; review ${result.index.review_status}. No model calls.`);
 return result.index;
}
/** Bootstrap only literal routes already listed in video-ad-format-picker.
 * Names and descriptions are copied from authored catalogue fields. Other jobs
 * remain gaps; their output ports are never promoted into approach families. */
export function seedPilotApproaches(root) {
 const target=path.join(root,'catalogue-items/_approaches.yaml');
 if(fs.existsSync(target))throw new Error('The approach source exists. Review and edit it instead of overwriting it.');
 const items=collectApproachItems(root),bySlug=new Map(items.map(item=>[item.slug,item]));
 const groups=[
  ['accurate-product-image-ad-maker'],['single-image-ad-planner'],['carousel-ad-writer'],
  ['3d-cutaway-image-ad-maker'],['clay-scene-image-ad-maker'],['watercolor-image-ad-maker'],
  ['paper-craft-image-ad-maker'],['knitted-wool-image-ad-maker'],['clay-town-image-ad-maker'],
  ['comic-strip-image-ad-maker'],['talking-object-image-ad-maker'],['paper-cutout-image-ad-maker'],
  ['selfie-style-ad-script','selfie-style-video-prompts'],['podcast-style-ad-script','podcast-style-video-prompts'],
  ['short-film-ad-script','short-film-video-prompts'],['3d-explainer-video-script','3d-explainer-video-prompts'],
  ['claymation-ad-script','claymation-video-prompts'],['watercolor-ad-script','watercolor-video-prompts'],
  ['paper-craft-ad-script','paper-craft-video-prompts'],['knitted-wool-ad-script','knitted-wool-video-prompts'],
  ['clay-town-video-ad-script-writer','clay-town-video-prompts'],['motion-comic-ad-script','motion-comic-video-prompts'],
  ['skeleton-video-ad-script-writer','skeleton-video-prompts'],['anime-video-ad-script-writer','anime-video-clip-prompt-writer'],
  ['talking-object-ad-script','talking-object-video-prompts'],['paper-cutout-ad-script','paper-cutout-video-prompts'],
  ['jingle-video-ad-script-writer','jingle-video-clip-prompt-writer'],['long-form-video-ad-script-writer'],
 ];
 const jobs={};
 for(const slugs of groups) {
  for(const slug of slugs)if(!bySlug.has(slug))throw new Error('Pilot source names an unknown item: '+slug);
  const lead=bySlug.get(slugs[0]),modality=lead.job==='make-image-ads'?'image':'video';
  const job=jobs[lead.job]??={output_shape_default:'many_artifacts',default_volume:10,families:[],lenses:['customer','brand-guardian','craft','sceptic']};
  job.families.push({id:lead.slug,name:lead.name,what_it_looks_like:lead.summary,when_it_wins:lead.when,modality:[modality],tools_needed:[modality],items:slugs,pickers:['video-ad-format-picker'],checks:['pre-launch-ad-checker'],tool_guides:[],seeds_from:['video-ad-format-picker'],lenses:['craft','customer'],source:lead.source});
 }
 fs.writeFileSync(target,YAML.stringify({schema:'ai-blocks-approach-source/1',review_status:'SOURCE_SEEDED_REQUIRES_REVIEW',note:'Pilot entries are literal routes from the existing video-ad-format-picker and the handoff pilot inventory. Names, descriptions and use cases are copied from catalogue fields. No model labeling pass has run. All other jobs still require mappings and review.',jobs}));
 return jobs;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
 const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
 if(process.argv.includes('--seed-pilot'))seedPilotApproaches(root);
 buildApproaches(root);
}
