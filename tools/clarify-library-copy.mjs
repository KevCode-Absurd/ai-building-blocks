// Expand thin page introductions using existing, job-specific catalogue copy.
// Does not edit imported SKILL.md files, instructions, claims or source licenses.
import fs from 'node:fs';
import YAML from '../site/node_modules/yaml/dist/index.js';
import {grade, sentences} from './readability.mjs';
const write=process.argv.includes('--write');
const audit=JSON.parse(fs.readFileSync('reports/library-audit.json','utf8'));
const words=s=>String(s).trim().split(/\s+/).length;
const banned=/—|\b(?:delve|foster|leverage|utilize|facilitate|empower|streamline|robust|unlock|supercharge|harness|elevate|seamless|effortless|transformative|revolutionize|paradigm|synergy|holistic|journey|ecosystem|best-in-class|world-class|next-level)\b/i;
const changes=[];
for(const c of audit.copy){
 const doc=YAML.parseDocument(fs.readFileSync(c.file,'utf8')),p=doc.toJS();
 let next='';
 const candidates=[String(p.explain??'').split(/\n\s*\n/)[0],...(p.how_it_works??[]).map(x=>`${p.summary} ${x.text}`)];
 for(const text of candidates){
  let candidate='';
  for(const sentence of sentences(text.replace(/[*_`]/g,''))){if(words(candidate+' '+sentence)>50)break;candidate=(candidate+' '+sentence).trim();if(words(candidate)>=25)break;}
  if(words(candidate)>=25 && !banned.test(candidate) && grade(candidate)<=10){next=candidate;break;}
 }
 if(!next){
  const input=(p.you_give??[]).find(x=>typeof x==='string'&&words(x)<=13&&!/optional|\[|<|:/.test(x));
  const tail=input?`Bring ${input.charAt(0).toLowerCase()+input.slice(1).replace(/[.!]$/,'')}. Use the result to plan your next step.`:'Share your goal and the files you already have. The skill file sets out the steps and the tools needed for this job.';
  next=`${p.summary} ${tail}`;
  if(words(next)>55||grade(next)>10||banned.test(next)) next=`${p.summary} Share your goal and the files you have. Read the skill file for the steps and tools this job needs.`;
 }
 if(next!==p.subhead){changes.push({slug:c.slug,file:c.file,before:p.subhead,after:next,grade:grade(next)});doc.set('subhead',next);if(write)fs.writeFileSync(c.file,String(doc));}
}
fs.writeFileSync('reports/copy-clarity-changes.json',JSON.stringify(changes,null,2)+'\n');
console.log(`${changes.length} page introductions ${write?'expanded':'proposed'}; imported instructions untouched.`);
