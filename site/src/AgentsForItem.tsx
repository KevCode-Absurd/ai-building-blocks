import {useEffect,useState} from 'react';
// "Agents who use this" on an item page: up to four named agents (agents.useaiblocks.com) whose job role lists this
// item in its toolbox. Read from one small file per first letter (public/data/item-agents/<c>.json, written by
// scripts/build-item-agents.mjs). The plain page shows the same block (scripts/lib/item-agents.mjs).
// Nothing shows when no agent carries the item, or when the files are not there yet.
type Row=[string,string,string?];
const AGENTS='https://agents.useaiblocks.com/agents/';
const files=new Map<string,Promise<Record<string,Row[]>>>();
function agentsFor(slug:string){
 const key=slug[0];let file=files.get(key);
 if(!file){file=fetch(`/data/item-agents/${key}.json`).then(r=>r.ok&&r.headers.get('content-type')?.includes('json')?r.json():null).then(d=>d?.schema==='ai-blocks-item-agents/1'&&d.items&&typeof d.items==='object'?d.items:{}).catch(()=>{files.delete(key);return {};});files.set(key,file);}
 return file;
}
export default function AgentsForItem({slug}:{slug:string}){
 const [rows,setRows]=useState<Row[]>([]);
 useEffect(()=>{let live=true;setRows([]);if(/^[a-z0-9]/.test(slug))void agentsFor(slug).then(items=>{const found=items[slug];if(live&&Array.isArray(found))setRows(found.filter(r=>Array.isArray(r)&&/^[a-z0-9][a-z0-9-]{0,79}$/.test(String(r[0]))&&typeof r[1]==='string').slice(0,4));});return()=>{live=false;};},[slug]);
 if(!rows.length)return null;
 return <section className="bp-next agents-block" id="agents" aria-labelledby="agents-h" data-testid="agents-block">
  <h2 className="bp-h2" id="agents-h">Agents who use this</h2>
  <p className="bp-note">These named agents bring this to their jobs. Open one to see what else they do.</p>
  <ul>{rows.map(([id,name,title])=><li key={id}><a href={`${AGENTS}${id}`}>{title?`${name}, ${title}`:name}</a></li>)}</ul>
 </section>;
}
