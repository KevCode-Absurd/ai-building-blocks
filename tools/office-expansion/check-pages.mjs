import fs from 'node:fs';
import assert from 'node:assert/strict';
import YAML from '../../site/node_modules/yaml/dist/index.js';
import {grade} from '../readability.mjs';
const required=['new_slug','name','summary','job','headline','subhead','explain','when','you_give','you_get','how_to_use','how_it_works','output_shape','tweaks','judge','test','improve'];
const flat=x=>x==null?[]:Array.isArray(x)?x.flatMap(flat):typeof x==='object'?Object.values(x).flatMap(flat):[String(x)];
const manifest=JSON.parse(fs.readFileSync('reports/2026-10-22-office-expansion-source.json'));const rows=[];
for(const {path:file}of manifest.files.filter(f=>f.path.endsWith('/page.yaml'))){const p=YAML.parse(fs.readFileSync(file,'utf8'));for(const key of required)assert(p[key]&&(!Array.isArray(p[key])||p[key].length),file+' missing '+key);assert(p.summary.split(/\s+/).length<=18,p.new_slug+' summary');assert(p.judge.length>=4&&p.tweaks.length>=3&&p.test.length>=3&&p.improve.length>=3);const text=[p.headline,p.subhead,p.summary,p.explain,p.when,p.you_give,p.you_get,p.how_to_use,p.how_it_works.map(s=>s.text),p.tweaks.map(s=>s.how),p.judge,p.improve].flatMap(flat).join('\n');const readingGrade=grade(text);assert(readingGrade<=10,p.new_slug+' grade '+readingGrade);rows.push({slug:p.new_slug,readingGrade,summaryWords:p.summary.split(/\s+/).length,status:'pass'});}
assert.equal(rows.length,20);const report={checkedAt:new Date().toISOString(),passed:20,scope:'All20newOfficepagefields,cardlength,check/testsectionsandgrade10maximum',pages:rows};fs.writeFileSync('reports/2026-10-22-office-expansion-copy-qa.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:20,highestGrade:Math.max(...rows.map(p=>p.readingGrade))}));
