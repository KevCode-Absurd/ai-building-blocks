import {parseCouncil,type CouncilDraft} from './council-model.ts';
export type SavedCouncil={id:string;name:string;saved_at:string;draft:CouncilDraft};
export const savedCouncilKey=(owner:string)=>'abb:saved-councils:'+owner;
export function readSavedCouncils(raw:string|null):SavedCouncil[]{
 try{if(!raw||raw.length>3000000)return [];const rows=JSON.parse(raw);if(!Array.isArray(rows)||rows.length>20)return [];return rows.flatMap(row=>{try{if(!row||typeof row.id!=='string'||!/^[a-zA-Z0-9_-]{1,100}$/.test(row.id)||typeof row.name!=='string'||!row.name.trim()||row.name.length>80||typeof row.saved_at!=='string'||!Number.isFinite(Date.parse(row.saved_at)))return [];return [{id:row.id,name:row.name,saved_at:row.saved_at,draft:parseCouncil(JSON.stringify(row.draft))}];}catch{return [];}});}catch{return [];}
}
export function rememberCouncil(rows:SavedCouncil[],name:string,draft:CouncilDraft,selected:string):SavedCouncil[]{
 const clean=name.trim();if(!clean||clean.length>80)throw Error('Give your council a name of 1 to 80 characters.');
 if(rows.length>=20&&!rows.some(row=>row.id===selected))throw Error('This browser can save up to 20 councils. Replace or remove one first.');
 const checked=parseCouncil(JSON.stringify(draft));checked.org_context.read_by_coordinator=false;
 const id=rows.some(row=>row.id===selected)?selected:'council_'+crypto.randomUUID();
 const next=[{id,name:clean,saved_at:new Date().toISOString(),draft:checked},...rows.filter(row=>row.id!==id)];
 if(JSON.stringify(next).length>3000000)throw Error('Saved councils exceed this browser’s 3 MB limit. Download JSON and remove an older council.');
 return next;
}
export function reusableCouncil(saved:SavedCouncil):CouncilDraft{
 const draft=parseCouncil(JSON.stringify(saved.draft));draft.org_context.read_by_coordinator=false;return draft;
}
