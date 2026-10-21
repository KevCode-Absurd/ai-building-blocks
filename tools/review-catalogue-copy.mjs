import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from '../site/node_modules/yaml/dist/index.js';
import {applyDisplayCopy} from './lib/display-copy.mjs';
import {grade} from './readability.mjs';
const root='catalogue-items',catalogue=JSON.parse(fs.readFileSync('site/public/data/blocks.json','utf8'));
const edits=YAML.parse(fs.readFileSync(path.join(root,'display-copy.yaml'),'utf8'));
const results=[];let cursor=0;
const names=new Map();
const blocked=/\b(delve|leverage|utilize|facilitate|empower|streamline|unlock|supercharge|seamless|effortless|revolutionize|game.changer)\b/i;
async function worker(){
 while(cursor<catalogue.blocks.length){
  const b=catalogue.blocks[cursor++];
  const dir=['general','ecommerce','imported','orchestrators','agents','minds'].map(x=>path.join(root,x,b.slug)).find(d=>fs.existsSync(path.join(d,'SKILL.md')));
  if(!dir)throw Error(`No source instructions for ${b.slug}`);
  const source=await fs.promises.readFile(path.join(dir,'SKILL.md'),'utf8');
  const itemFile=path.join(dir,'item.yaml');
  const pageFile=[path.join(dir,'page.yaml'),path.join('tools/orchestrator-pages',b.slug+'.yaml')].find(f=>fs.existsSync(f));
  const item=fs.existsSync(itemFile)?YAML.parse(await fs.promises.readFile(itemFile,'utf8')):{};
  const originalPage=pageFile?YAML.parse(await fs.promises.readFile(pageFile,'utf8')):{};
  const before={...b,name:originalPage.name??item.name??b.name,summary:originalPage.summary??item.summary??b.summary,subhead:originalPage.subhead??''};
  const edit=edits[b.slug],after=applyDisplayCopy(before,{...originalPage,name:before.name,summary:before.summary},edit).page;
  const changed=!!edit&&['name','summary','subhead'].some(k=>edit[k]&&edit[k]!==before[k]);
  const issues=[];
  if(!b.name?.trim()||!b.summary?.trim())issues.push('Missing first-read copy');
  if(edit){
   if(blocked.test([edit.name,edit.summary,edit.subhead].filter(Boolean).join(' ')))issues.push('Banned filler in editorial copy');
   if(edit.name&&edit.name.split(/\s+/).length>8)issues.push('Editorial title exceeds eight words');
   if(edit.subhead&&edit.subhead.split(/\s+/).length>60)issues.push('Editorial introduction exceeds sixty words');
   if(edit.summary&&edit.summary.split(/\s+/).length>24)issues.push('Editorial card summary exceeds twenty-four words');
   if(/[—!]/.test([edit.name,edit.summary,edit.subhead].filter(Boolean).join(' ')))issues.push('Editorial punctuation breaks brand rules');
  }
  const name=after.name||b.name;
  if(!names.has(name.toLowerCase()))names.set(name.toLowerCase(),[]);names.get(name.toLowerCase()).push(b.slug);
  results.push({slug:b.slug,source:path.join(dir,'SKILL.md').replaceAll('\\','/'),sourceSha256:crypto.createHash('sha256').update(source).digest('hex'),status:changed?'reworded':'retained',before:{name:before.name,summary:before.summary},after:{name,summary:after.summary||b.summary,...(edit?.subhead?{subhead:edit.subhead}:{})},reason:edit?.reason??'Retained the specific job and existing input/result description after catalogue screening.',sourceStructure:{hasInstructions:source.length>150,hasMethodHeading:/^#{1,4} .*\b(steps|workflow|process|method|instructions|procedure|how|use|approach|protocol)\b/im.test(source),hasResultHeading:/^#{1,4} .*\b(output|result|hand back|deliver|format|response)\b/im.test(source)},issues,...(edit?.subhead?{introductionGrade:grade(edit.subhead)}:{})});
 }
}
await Promise.all(Array.from({length:8},worker));
results.sort((a,b)=>a.slug.localeCompare(b.slug));
for(const slug of Object.keys(edits))if(!results.some(x=>x.slug===slug))throw Error(`Unknown editorial slug ${slug}`);
const counts={screened:results.length,reworded:results.filter(x=>x.status==='reworded').length,titles:results.filter(x=>x.before.name!==x.after.name).length,summaries:results.filter(x=>x.before.summary!==x.after.summary).length,introductions:results.filter(x=>x.after.subhead).length,issues:results.filter(x=>x.issues.length).length};
const report={date:'2026-10-21',scope:'Every published item screened against its own source file and first-read copy. Edited jobs compared with their existing input/result promise. This is a copy and source-structure review, not live model evaluation or a claim of usefulness for every input.',skillsUsed:['page-copywriter','sales-copy-editor','anti-ai-slop-copy-editor','.claude/skills/plain-writing'],counts,duplicateTitles:[...names].filter(([,s])=>s.length>1).map(([name,slugs])=>({name,slugs})),items:results};
fs.writeFileSync('reports/catalogue-copy-review.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(counts));
for(const r of results.filter(x=>x.issues.length))console.log(r.slug+': '+r.issues.join('; '));
if(counts.issues)process.exitCode=1;
