#!/usr/bin/env node
// Read-only replacements for the one-off handoff cleanup/licence/book/held helpers.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {git, REPO, checkedPath, worktreeText} from './git-content.mjs';
import {checkTextChange} from './source-validation.mjs';
import {primarySkillName} from '../../site/scripts/lib/skill-file.mjs';
const YAML=createRequire(new URL('../../site/package.json',import.meta.url))('yaml');
export const AUDITS=['yaml','front','cleanup','licences','book-order','held'];
export function proseFindings(file,text,names=new Map()){
  const found=[];
  for(const [rule,pattern] of [
    ['affiliate-tag',/https?:\/\/(?:www\.)?amazon\.[a-z.]+\/[^\s)"'<>]*[?&]tag=[A-Za-z0-9_-]+/g],
    ['claimed-source-order',/in the order [^,.\n]{1,160} teaches|This workflow follows the method in [^\n]+ by [^.\n]+\. Each step/g],
  ])for(const match of text.matchAll(pattern))found.push({file,rule,line:text.slice(0,match.index).split('\n').length});
  for(const match of text.matchAll(/\[([^\]\n]{2,120})\]\(https:\/\/useaiblocks\.com\/(?:skills|prompts|workflows|agents|minds)\/([a-z0-9-]+)\)/g)){
    const item=names.get(match[2]);if(item?.aliases?.some(alias=>alias.toLowerCase()===match[1].toLowerCase())&&item.name.toLowerCase()!==match[1].toLowerCase())found.push({file,rule:'old-link-label',line:text.slice(0,match.index).split('\n').length});
  }
  return found;
}
export function licenceFindings(file,item,method,names){
  const found=[], front=method.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/);
  const header=front?YAML.parse(front[1],{maxAliasCount:100,logLevel:'silent'}):{};
  const own=String(header?.license??header?.licence??'');
  const sick=String(item.source?.by??'').toLowerCase()==='sickn33';
  const expected=sick?(own==='MIT'?'MIT':/Apache[ -]2(?:\.0)?/i.test(own)?'Apache-2.0':!own?'CC-BY-4.0':null):null;
  if(expected&&item.source?.licence!==expected)found.push({file,rule:'header-licence-mismatch',expected,actual:item.source?.licence??null});
  const licence=item.source?.licence_file;
  if(typeof licence==='string'&&(!/^[A-Za-z0-9_.-]+$/.test(licence)||!names.includes(licence)))found.push({file,rule:'missing-original-licence'});
  const credits=(item.credits??[]).map(c=>typeof c.used==='string'?c.used:'').join('\n');
  const changed=/Added by AI Blocks|<!-- needs:|<!-- next:/.test(method);
  if(changed&&/Copied as (?:it is|is)[,.]/i.test(credits)&&!/added|changed|adapted|refreshed/i.test(credits))found.push({file,rule:'changed-import-credit'});
  if(changed&&(expected==='Apache-2.0'||item.source?.licence==='Apache-2.0')&&!/Changed by AI Blocks \(\d{4}-\d{2}-\d{2}\):[^\n]+\s*$/.test(method))found.push({file,rule:'missing-final-apache-change-note'});
  return found;
}
export function auditCatalogue({root=REPO,mode='all'}={}){
  if(mode!=='all'&&!AUDITS.includes(mode))throw Error('Unknown read-only audit');
  const wanted=name=>mode==='all'||mode===name;
  const files=git(root,['ls-files','-z','--','catalogue-items','tools/orchestrator-pages']).toString('utf8').split('\0').filter(Boolean);
  files.forEach(checkedPath);const byFolder=new Map();
  for(const file of files){const folder=path.posix.dirname(file),names=byFolder.get(folder)??[];names.push(path.posix.basename(file));byFolder.set(folder,names);}
  const findings=[], expectedFixtures=[];let checked=0,imports=0;
  const copy=worktreeText(root,'catalogue-items/display-copy.yaml');const names=new Map(Object.entries(copy?YAML.parse(copy,{maxAliasCount:100,logLevel:'silent'}):{}).filter(([,value])=>typeof value?.name==='string'&&Array.isArray(value?.aliases)));
  for(const file of files){
    if(/(?:^|\/)(tests|runs)\//.test(file)||! /\.(md|ya?ml)$/i.test(file)||/(?:^|\/)LICENSE(?:[.-][^/]*)?$/i.test(file))continue;
    const text=worktreeText(root,file);if(text===null)continue;checked++;
    if((wanted('yaml')&&/\.ya?ml$/i.test(file))||(wanted('front')&&/\.md$/i.test(file))){
      const errors=checkTextChange({file,before:null,after:Buffer.from(text)});
      for(const message of errors){const row={file,rule:'source-parse',message};
        if(file==='catalogue-items/imported/skill-portability-checker/examples/bad-yaml-colon/SKILL.md')expectedFixtures.push(row);else findings.push(row);
      }
    }
    for(const row of proseFindings(file,text,names))if((['affiliate-tag','old-link-label'].includes(row.rule)&&wanted('cleanup'))||(row.rule==='claimed-source-order'&&wanted('book-order')))findings.push(row);
    if(wanted('licences')&&/^catalogue-items\/imported\/[^/]+\/item\.yaml$/.test(file)){
      imports++;const folder=path.posix.dirname(file),names=byFolder.get(folder)??[];
      const primary=primarySkillName(names);if(!primary){findings.push({file,rule:'missing-method'});continue;}
      try{findings.push(...licenceFindings(file,YAML.parse(text,{maxAliasCount:100,logLevel:'silent'}),worktreeText(root,folder+'/'+primary)??'',names));}
      catch{findings.push({file,rule:'licence-metadata-unreadable'});}
    }
  }
  let held=[];
  if(wanted('held')){const text=worktreeText(root,'catalogue-items/quarantine.yaml');const entries=text?YAML.parse(text,{maxAliasCount:100,logLevel:'silent'}):{};held=Object.keys(entries??{}).sort();}
  return {schema:'abb-local-audit/1',mode,readOnly:true,checked,imports,held,expectedFixtures,findings,note:'Findings are review leads. No files, licences, held states or evidence were changed. Imported text changes require a real safety issue or plainly wrong data.'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{const args=process.argv.slice(2);if(args.length>1||args.some(a=>a.startsWith('--')))throw Error('Choose a read-only audit');const report=auditCatalogue({mode:args[0]??'all'});console.log(JSON.stringify(report,null,2));if(report.findings.length)process.exitCode=1;}
  catch{console.error('Read-only catalogue audit failed. Check source paths and YAML; no source files were changed.');process.exitCode=1;}
}
