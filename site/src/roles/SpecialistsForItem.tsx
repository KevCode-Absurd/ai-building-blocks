import {useEffect,useState} from 'react';
import {Link} from '../lib/router';
import {roleHeading} from './role-copy.mjs';
// "Specialists who do this" on an item page: the roles that use this skill, prompt, agent or workflow, read from
// one small file per first letter (public/data/role-links/<c>.json, written by build-roles.mjs). The prerendered
// page shows the same block (scripts/lib/role-links.mjs). Nothing shows when no specialist uses the item.
type Row=[string,string];
const files=new Map<string,Promise<Record<string,Row[]>>>();
function linksFor(slug:string){
 const key=slug[0];let file=files.get(key);
 if(!file){file=fetch(`/data/role-links/${key}.json`).then(r=>r.ok&&r.headers.get('content-type')?.includes('json')?r.json():null).then(d=>d?.schema==='ai-blocks-role-links/1'&&d.items&&typeof d.items==='object'?d.items:{}).catch(()=>{files.delete(key);return {};});files.set(key,file);}
 return file;
}
export default function SpecialistsForItem({slug}:{slug:string}){
 const [rows,setRows]=useState<Row[]>([]);
 useEffect(()=>{let live=true;setRows([]);if(/^[a-z0-9]/.test(slug))void linksFor(slug).then(items=>{const found=items[slug];if(live&&Array.isArray(found))setRows(found.filter(r=>Array.isArray(r)&&/^[a-z0-9][a-z0-9-]{0,69}$/.test(String(r[0]))).slice(0,3));});return()=>{live=false;};},[slug]);
 if(!rows.length)return null;
 return <section className="bp-next specialists-block" id="specialists" aria-labelledby="specialists-h" data-testid="specialists-block">
  <h2 className="bp-h2" id="specialists-h">Specialists who do this</h2>
  <p className="bp-note">Each one uses this as one of its methods for a bigger job. Hire one for free and give it the job in your own AI.</p>
  <ul>{rows.map(([id,name])=><li key={id}><Link to={`/roles/${id}`}>{roleHeading(name)}</Link></li>)}</ul>
 </section>;
}
