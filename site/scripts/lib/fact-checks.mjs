import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';
import {validateFactCheck} from '../../src/lib/fact-checks.ts';
import {digest,methodBody} from '../../../tools/qa/contract-evidence.mjs';
const YAML=createRequire(new URL('../../package.json',import.meta.url))('yaml');
const GROUPS=new Set(['general','ecommerce','imported','orchestrators','agents','minds']);
const LIVE_HOSTS=new Set(['ai-act-service-desk.ec.europa.eu','www.ncsc.gov.uk','ncsc.gov.uk','iasme.co.uk','shopify.dev','developers.facebook.com','developers.meta.com','uaelegislation.gov.ae','www.uaelegislation.gov.ae','sdaia.gov.sa','pdpl.sdaia.gov.sa','nca.gov.sa','www.nca.gov.sa','laws.boe.gov.sa','rulebook.sama.gov.sa','www.cbuae.gov.ae','cbuae.gov.ae','www.adgm.com','adgm.com','www.difc.com','difc.com','learn.microsoft.com','developers.google.com','cloud.google.com','docs.aws.amazon.com','docs.anthropic.com','docs.claude.com','platform.openai.com','developers.openai.com','huggingface.co']);
export function citedLiveSources(text){
  const urls=[];
  for(const match of text.matchAll(/https:\/\/[^\s<>"'`]+/g)){
    const raw=match[0].replace(/[),.;]+$/,'');let url;try{url=new URL(raw);}catch{continue;}
    const github=url.hostname==='github.com'&&/^\/(?:googleworkspace\/cli|ggml-org\/llama\.cpp|huggingface\/trl)(?:\/|$)/.test(url.pathname);
    if((!LIVE_HOSTS.has(url.hostname)&&!github)||url.username||url.password||[...url.searchParams.keys()].some(key=>/key|token|secret|password/i.test(key)))continue;
    if(!urls.includes(raw))urls.push(raw);if(urls.length===3)break;
  }
  return urls;
}
export function factSourceDigest(file,text){
  const normalized=text.replace(/\r\n?/g,'\n');
  if(path.posix.basename(file).toLowerCase()!=='skill.md')return digest(normalized.trim());
  const front=normalized.match(/^\uFEFF?---\n[\s\S]*?\n---(?:\n|$)/)?.[0]??'';
  return digest(front+methodBody(normalized));
}
export function loadFactChecks(catalogueRoot){
  const file=path.join(catalogueRoot,'_fact-checks.yaml'),data=fs.existsSync(file)?YAML.parse(fs.readFileSync(file,'utf8'),{maxAliasCount:100,logLevel:'silent'}):{schema:'abb-fact-checks/1',checks:{}};
  if(data?.schema!=='abb-fact-checks/1'||!data.checks||typeof data.checks!=='object'||Array.isArray(data.checks))throw Error('Invalid fact-check registry');
  const root=fs.realpathSync.native(catalogueRoot),records=new Map();
  for(const [slug,rows]of Object.entries(data.checks)){
    if(!/^[a-z0-9][a-z0-9-]{0,119}$/.test(slug)||!Array.isArray(rows)||!rows.length||rows.length>5)throw Error('Invalid fact-check item');
    records.set(slug,rows.map(raw=>{
      if(!raw||typeof raw!=='object'||Object.keys(raw).some(key=>!['status','scope','sources','checked_on','attempted_on','source_date','reviewed_files'].includes(key)))throw Error('Unexpected fact-check field');
      const record=validateFactCheck(raw),files=raw.reviewed_files;
      if(!files||typeof files!=='object'||Array.isArray(files)||!Object.keys(files).length||Object.keys(files).length>12)throw Error('Fact-check records need reviewed source hashes');
      let matches=true;
      for(const [relative,hash]of Object.entries(files)){
        const parts=relative.split('/');
        if(!GROUPS.has(parts[0])||parts[1]!==slug||parts.length<3||parts.some(part=>!part||part.startsWith('.')||['tests','runs'].includes(part))||! /\.(?:md|txt|py|ps1|mjs|ts|json|ya?ml)$/i.test(relative)||/[\\\r\n\0]/.test(relative)||! /^[a-f0-9]{64}$/.test(hash))throw Error('Invalid reviewed fact-check source');
        const absolute=path.resolve(catalogueRoot,relative);
        if(!absolute.startsWith(path.resolve(catalogueRoot)+path.sep))throw Error('Fact-check source escaped catalogue');
        if(!fs.existsSync(absolute)){matches=false;continue;}
        if(fs.lstatSync(absolute).isSymbolicLink()||!fs.realpathSync.native(absolute).startsWith(root+path.sep))throw Error('Unsafe fact-check source link');
        if(factSourceDigest(relative,fs.readFileSync(absolute,'utf8'))!==hash)matches=false;
      }
      return {...record,source_matches:matches};
    }));
  }
  let defaults=0;
  return {
    forItem(slug,text){
      if(records.has(slug))return records.get(slug);
      const sources=citedLiveSources(text);if(!sources.length)return [];
      defaults++;return [{status:'not_checked',scope:'Current details in the cited vendor or regulator documentation have no independent check recorded here.',sources}];
    },
    validateKnown(slugs){for(const slug of records.keys())if(!slugs.has(slug))throw Error('A fact-check record does not match a published item');},
    summary(){return {scopedItems:records.size,scopedChecks:[...records.values()].reduce((sum,rows)=>sum+rows.length,0),citedItemsWithoutIndependentCheck:defaults};},
  };
}
