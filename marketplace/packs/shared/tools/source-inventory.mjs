#!/usr/bin/env node
// Read-only inventory of supplied evidence. Field names locate evidence; they do
// not establish its freshness, truth, permission or relevance to a decision.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {pathToFileURL} from 'node:url';

export function inventorySources(folder,{maxBytes=4_000_000,maxFiles=2000}={}) {
  const root=fs.realpathSync(folder), files=[], errors=[];
  const within=p=>{const r=path.relative(root,p);return r!== '..'&&!r.startsWith('..'+path.sep)&&!path.isAbsolute(r);};
  function fields(value,prefix='',depth=0,out=new Set()) {
    if(depth>8||out.size>=2000)return {out,truncated:true};
    let truncated=false;
    if(Array.isArray(value)) {
      out.add(prefix+'[]');
      for(const row of value.slice(0,100))truncated=fields(row,prefix+'[]',depth+1,out).truncated||truncated;
      if(value.length>100)truncated=true;
    } else if(value&&typeof value==='object') {
      for(const key of Object.keys(value)) {
        const p=prefix?`${prefix}.${key}`:key;out.add(p);
        if(value[key]&&typeof value[key]==='object')truncated=fields(value[key],p,depth+1,out).truncated||truncated;
      }
    }
    return {out,truncated};
  }
  function visit(dir) {
    for(const entry of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
      if(entry.name.startsWith('.')||entry.name==='node_modules')continue;
      const file=path.join(dir,entry.name),rel=path.relative(root,file).replaceAll('\\','/');
      if(entry.isSymbolicLink()) {errors.push(`${rel}: symbolic link not followed`);continue;}
      if(!within(fs.realpathSync(file))) {errors.push(`${rel}: outside source root`);continue;}
      if(entry.isDirectory()) {visit(file);continue;}
      if(!/\.(json|csv|tsv|md|txt|html?|pdf|docx|xlsx|png|jpe?g|webp|svg|mp4)$/i.test(entry.name))continue;
      if(files.length>=maxFiles) {errors.push('file limit reached; inventory incomplete');return;}
      const row={path:rel,bytes:fs.statSync(file).size,status:'inventoried',fields:[],coverage:'metadata_only'};
      files.push(row);
      if(row.bytes>maxBytes) {row.status='too_large_to_read';errors.push(`${rel}: read limit exceeded; inspect separately`);continue;}
      try {
        const bytes=fs.readFileSync(file);row.sha256=crypto.createHash('sha256').update(bytes).digest('hex');
        if(/\.json$/i.test(file)) {
          const {out,truncated}=fields(JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/,'')));
          row.fields=[...out].sort();row.coverage=truncated?'sampled_fields':'all_fields';
        } else if(/\.(md|txt)$/i.test(file)) {
          row.headings=bytes.toString('utf8').split(/\r?\n/).flatMap((line,i)=>/^#{1,6}\s+/.test(line)?[{line:i+1,title:line.replace(/^#+\s+/,'')}]:[]);
        }
      } catch(error) {row.status='unreadable';errors.push(`${rel}: ${error.message}`);}
    }
  }
  visit(root);
  return {schema:'supplied-source-inventory/1',root,complete:errors.length===0,files,errors,interpretation:'Presence and structural fields only. Read matching source records before drawing conclusions. Sampled fields do not prove another field is absent. Unreadable/oversized sources remain unresolved, never missing.'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  if(!process.argv[2]) {console.error('Usage: node tools/source-inventory.mjs <supplied-evidence-folder>');process.exitCode=2;}
  else {try {const r=inventorySources(process.argv[2]);console.log(JSON.stringify(r,null,2));if(!r.complete)process.exitCode=1;}catch(e){console.error(e.message);process.exitCode=2;}}
}
