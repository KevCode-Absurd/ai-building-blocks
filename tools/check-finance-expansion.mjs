// Read-only original-data preflight; no generator imports, site build or provider calls.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from '../site/node_modules/yaml/dist/index.js';
import {evaluateModel,defaultInputs,validateModel} from './finance-expansion/model-engine.mjs';
const sha=value=>crypto.createHash('sha256').update(value).digest('hex');
const shards=['public-markets','private-deals','operating-credit'];
const sources=shards.filter(name=>fs.existsSync(`tools/finance-expansion/${name}.json`)).map(name=>({name,path:`tools/finance-expansion/${name}.json`,data:JSON.parse(fs.readFileSync(`tools/finance-expansion/${name}.json`,'utf8'))}));
const existing=[];
for(const category of ['general','ecommerce','imported','orchestrators','agents'])for(const dir of fs.readdirSync(`catalogue-items/${category}`,{withFileTypes:true}).filter(entry=>entry.isDirectory())){
  const file=`catalogue-items/${category}/${dir.name}/item.yaml`;if(fs.existsSync(file)){const item=YAML.parse(fs.readFileSync(file,'utf8'));if(item.generated_from!=='tools/finance-expansion')existing.push({slug:item.slug,name:item.name,summary:item.summary??'',type:item.type??'skill',path:file});}
}
const words=text=>new Set(String(text).toLowerCase().replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(word=>word&&!['a','an','the','and','to','of','for','with','checker','builder','planner','review','assistant','prepare','build','check'].includes(word)));
const similarity=(a,b)=>{const x=words(a),y=words(b);return x.size&&y.size?[...x].filter(word=>y.has(word)).length/new Set([...x,...y]).size:0;};
const items=sources.flatMap(source=>['skills','workflows','agents'].flatMap(group=>(source.data[group]??[]).map(spec=>({...spec,type:group==='skills'?'skill':group==='workflows'?'workflow':'agent',shard:source.name}))));
const byId=new Map(items.map(item=>[item.slug,item]));
const errors=[],reviews=[],checks=[];
const require=(condition,slug,message)=>{if(!condition)errors.push({slug,message});};
require(byId.size===items.length,'batch','Duplicate candidate slugs.');
const close=(a,b)=>Number.isFinite(a)&&Number.isFinite(b)&&Math.abs(a-b)<=1e-7+1e-9*Math.abs(b);
for(const item of items){
  require(!existing.some(old=>old.slug===item.slug),item.slug,'Existing slug collision.');
  const nearest=existing.map(old=>({slug:old.slug,name:old.name,similarity:similarity(item.name,old.name)})).sort((a,b)=>b.similarity-a.similarity).slice(0,5);
  const exact=existing.filter(old=>old.name?.toLowerCase()===item.name.toLowerCase());
  require(!exact.length,item.slug,'Existing exact display-name collision.');
  const explained=new Set((item.distinctFrom??[]).filter(match=>match.why?.length>=30).map(match=>match.slug));
  for(const match of nearest.filter(match=>match.similarity>=.6&&!explained.has(match.slug)))reviews.push({slug:item.slug,kind:'near-existing-job',match});
  const peer=items.filter(other=>other.slug!==item.slug&&other.type===item.type).map(other=>({slug:other.slug,name:other.name,similarity:similarity(item.name,other.name)})).filter(match=>match.similarity>=.7);
  if(peer.length)reviews.push({slug:item.slug,kind:'near-new-job',matches:peer});
  if(item.summary.split(/\s+/).length>18)reviews.push({slug:item.slug,kind:'card-copy',message:'Reduce card summary to the brand default of 18 words.'});
  let fixtures=0;
  if(item.type==='skill')try{
    validateModel(item.model);const actual=evaluateModel(item.model);
    require(JSON.stringify(Object.keys(item.model.expected).sort())===JSON.stringify([...item.model.outputs].sort()),item.slug,'Baseline expectation does not cover every output.');
    for(const [id,value]of Object.entries(item.model.expected))require(close(actual.outputs[id],value),item.slug,`Baseline ${id}: ${actual.outputs[id]} != ${value}`);
    fixtures++;
    const used=new Set(item.model.calculations.flatMap(node=>node.args.filter(arg=>typeof arg==='string')));
    for(const input of item.model.inputs)if(!used.has(input.id))reviews.push({slug:item.slug,kind:'unused-input',input:input.id});
    for(const fixture of item.model.cases){
      const inputs={...defaultInputs(item.model),...fixture.inputs};let actual,error;
      try{actual=evaluateModel(item.model,inputs);}catch(caught){error=caught.message;}
      if(fixture.error)require(Boolean(error),item.slug,`${fixture.name}: expected refusal.`);
      else{require(!error,item.slug,`${fixture.name}: unexpected ${error}`);if(actual)for(const [id,value]of Object.entries(fixture.expected))require(close(actual.outputs[id],value),item.slug,`${fixture.name} ${id}: ${actual.outputs[id]} != ${value}`);}
      fixtures++;
    }
  }catch(error){errors.push({slug:item.slug,message:error.message});}
  else if(item.type==='workflow')for(const step of item.steps)require(byId.get(step.uses)?.type==='skill',item.slug,`Unknown component ${step.uses}`);
  else if(item.type==='agent'){require(byId.get(item.workflow)?.type==='workflow',item.slug,`Unknown governing workflow ${item.workflow}`);require(byId.get(item.extra)?.type==='skill',item.slug,`Unknown branch skill ${item.extra}`);}
  checks.push({slug:item.slug,type:item.type,shard:item.shard,nearestExisting:nearest,declaredDistinctions:item.distinctFrom,fixtures});
}
const report={checkedOn:new Date().toISOString(),status:errors.length?'needs-correction':sources.length===3?'structural-checks-pass-method-review-separate':'partial-authoring',counts:{skills:items.filter(item=>item.type==='skill').length,workflows:items.filter(item=>item.type==='workflow').length,agents:items.filter(item=>item.type==='agent').length,errors:errors.length,overlapAndCopyReviewCandidates:reviews.length,fixtures:checks.reduce((sum,item)=>sum+item.fixtures,0)},sources:sources.map(source=>({path:source.path,sha256:sha(fs.readFileSync(source.path))})),scope:'Structural checks and calculation fixtures; similarity candidates need recorded semantic review. This does not execute real investment or financial analysis on company data.',errors,reviews,items:checks};
fs.writeFileSync('reports/finance-expansion-preflight.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({status:report.status,counts:report.counts,errors:errors.slice(0,30)},null,2));
if(errors.length)process.exitCode=1;
