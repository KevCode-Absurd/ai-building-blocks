#!/usr/bin/env node
// Reuse saved historical screening evidence. Never imports the paid screener or reads credentials.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {git,REPO,checkedPath} from './git-content.mjs';
const GROUPS=new Set(['general','ecommerce','orchestrators','imported','agents','minds','ai-tools']);
const sha=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
function safeFile(root,file,canonicalRoot=fs.realpathSync(root)){checkedPath(file);const absolute=path.join(root,file);if(fs.lstatSync(absolute).isSymbolicLink()||!fs.realpathSync(absolute).startsWith(canonicalRoot+path.sep))throw Error('Evidence path escaped repository');return absolute;}
export function selectLowest(rows,{limit=50,latestSource=new Map(),dirty=new Set(),exists=()=>true}={}){
  if(!Number.isInteger(limit)||limit<1||limit>50)throw Error('Choose 1 to 50 saved results');
  const latest=new Map();let invalid=0,missing=0;
  for(const row of rows){
    const key=`${row.group}/${row.slug}`;
    if(!GROUPS.has(row.group)||! /^[a-z0-9][a-z0-9-]*$/.test(row.slug??'')||row.key!==key||!Number.isFinite(row.score)||row.score<0||row.score>100||typeof row.at!=='string'||!Number.isFinite(Date.parse(row.at))){invalid++;continue;}
    if(!exists(row.group,row.slug)){missing++;continue;}
    const previous=latest.get(key);
    if(!previous||Date.parse(previous.at)<Date.parse(row.at)||(previous.at===row.at&&String(previous.evidence)<String(row.evidence)))latest.set(key,row);
  }
  const selected=[...latest.values()].sort((a,b)=>a.score-b.score||a.key.localeCompare(b.key,'en')).slice(0,limit).map(row=>{
    const sourceAt=latestSource.get(row.key)??null,modified=dirty.has(row.key);
    return {key:row.key,score:row.score,scoreKind:'saved historical screening score /100',screenedAt:row.at,evidence:row.evidence??null,sourceCommittedAt:sourceAt,sourceDirty:modified,changedSinceScreen:modified||(sourceAt!==null&&Date.parse(sourceAt)>Date.parse(row.at)),freshness:modified?'working source changed':sourceAt===null?'source date unknown':Date.parse(sourceAt)>Date.parse(row.at)?'source changed after this screen':'no later commit found; not a new source review',verdict:typeof row.verdict==='string'?row.verdict:null,fixes:Array.isArray(row.fixes)?row.fixes.filter(v=>typeof v==='string').slice(0,3).map(v=>v.slice(0,700)):[],safetyIssues:Array.isArray(row.safety_issues)?row.safety_issues.filter(v=>typeof v==='string').slice(0,20).map(v=>v.slice(0,700)):[]};
  });
  return {available:latest.size,invalidResultRows:invalid,missingResultRows:missing,items:selected};
}
function sourceKey(file){const match=file.match(/^catalogue-items\/([^/]+)\/([^/]+)/);if(match&&GROUPS.has(match[1]))return match[1]+'/'+(match[1]==='ai-tools'?match[2].replace(/\.yaml$/,''):match[2]);const fallback=file.match(/^tools\/orchestrator-pages\/([^/]+)\.yaml$/);return fallback?'orchestrators/'+fallback[1]:null;}
export function weeklyReport({root=REPO}={}){
  const rows=[],screen=path.join(root,'runs/screen'),canonicalRoot=fs.realpathSync(root);
  if(fs.existsSync(screen))for(const label of fs.readdirSync(screen,{withFileTypes:true})){
    if(!label.isDirectory()||! /^[A-Za-z0-9_-]+$/.test(label.name))continue;
    const relative=`runs/screen/${label.name}/results`;const folder=path.join(root,relative);if(!fs.existsSync(folder))continue;safeFile(root,relative,canonicalRoot);
    for(const entry of fs.readdirSync(folder,{withFileTypes:true})){
      if(!entry.isFile()||!entry.name.endsWith('.json'))continue;
      const evidence=relative+'/'+entry.name;try{const file=safeFile(root,evidence,canonicalRoot);if(fs.statSync(file).size>1_000_000)throw Error('Oversized saved result');rows.push({...JSON.parse(fs.readFileSync(file,'utf8')),evidence});}catch{rows.push({invalid:true});}
    }
  }
  const latestSource=new Map();let at=null;
  const log=git(root,['log','--format=@@%cI','--name-only','--','catalogue-items','tools/orchestrator-pages']).toString('utf8');
  for(const line of log.split(/\r?\n/)){if(line.startsWith('@@')){at=line.slice(2);continue;}const key=sourceKey(line);if(key&&at&&Number.isFinite(Date.parse(at))&&(!latestSource.has(key)||Date.parse(latestSource.get(key))<Date.parse(at)))latestSource.set(key,at);}
  const changed=[git(root,['diff','HEAD','--name-only','-z']),git(root,['ls-files','--others','--exclude-standard','-z','--','catalogue-items','tools/orchestrator-pages'])].flatMap(b=>b.toString('utf8').split('\0').filter(Boolean));
  const dirty=new Set(changed.map(sourceKey).filter(Boolean));
  const presence=new Map();
  const exists=(group,slug)=>{
    const key=group+'/'+slug;if(presence.has(key))return presence.get(key);
    const files=group==='ai-tools'?[`catalogue-items/ai-tools/${slug}.yaml`]:[`catalogue-items/${group}/${slug}/item.yaml`,...(group==='minds'?[`catalogue-items/minds/${slug}/mind.yaml`]:[])];
    const found=files.some(file=>fs.existsSync(path.join(root,file))&&fs.statSync(safeFile(root,file,canonicalRoot)).isFile());presence.set(key,found);return found;
  };
  const result=selectLowest(rows,{latestSource,dirty,exists});
  const stable={schema:'abb-weekly-local-quality/1',...result,policy:'Saved scores are historical, not new tests or a current quality grade. The saved fingerprint includes the model, rubric and prompt; it is not a source-file hash. No API calls, automatic fixes, hiding or deletion. Review imports only for real safety issues or plainly wrong data.'};
  return {...stable,contentHash:sha(stable)};
}
export function saveWeekly(root,report){
  const repo=fs.realpathSync(root);const relative='reports/weekly-quality';let current=repo;
  for(const part of relative.split('/')){current=path.join(current,part);if(!fs.existsSync(current))fs.mkdirSync(current);if(fs.lstatSync(current).isSymbolicLink()||fs.realpathSync(current)!==current)throw Error('Report directory must stay inside the repository');}
  const file=path.join(current,'latest.json');if(fs.existsSync(file)&&(fs.lstatSync(file).isSymbolicLink()||!fs.statSync(file).isFile()))throw Error('Unsafe report target');
  let previous=null;if(fs.existsSync(file))try{previous=JSON.parse(fs.readFileSync(file,'utf8'));}catch{}
  const changed=previous?.contentHash!==report.contentHash;if(changed)fs.writeFileSync(file,JSON.stringify(report,null,2)+'\n');return {changed,file,count:report.items.length,contentHash:report.contentHash};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{if(process.argv.length!==2)throw Error('No source-changing options');console.log(JSON.stringify(saveWeekly(REPO,weeklyReport()),null,2));}
  catch{console.error('Local weekly report failed safely. Check saved result files and repository paths. No model calls or source edits were made.');process.exitCode=1;}
}
