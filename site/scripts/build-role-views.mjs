import fs from 'node:fs/promises';import path from 'node:path';import{createHash}from'node:crypto';
const publicDir=new URL('../public/',import.meta.url),index=JSON.parse(await fs.readFile(new URL('data/roles-index.json',publicDir),'utf8'));
const folder=new URL('data/role-views/',publicDir);await fs.mkdir(folder,{recursive:true});let fullBytes=0,viewBytes=0;
for(const row of index.roles){
 const profilePath='/data/roles/'+row.id+'.json',bytes=await fs.readFile(new URL(profilePath.slice(1),publicDir)),proof=index.profiles[row.id],hash=createHash('sha256').update(bytes).digest('hex');
 if(bytes.length!==proof.bytes||hash!==proof.sha256)throw Error('Source profile changed: '+row.id);
 const {worker,instructions,...fields}=JSON.parse(bytes);
 if(fields.id!==row.id||!worker)throw Error('Incomplete source profile: '+row.id);
 const view={...fields,schema:'ai-blocks-role-view/1',sourceProfile:{path:profilePath,bytes:bytes.length,sha256:hash}};
 const text=JSON.stringify(view),file=new URL(row.id+'.json',folder);if(await fs.readFile(file,'utf8').catch(()=>null)!==text)await fs.writeFile(file,text);
 fullBytes+=bytes.length;viewBytes+=Buffer.byteLength(text);
}
console.log(JSON.stringify({roleViews:index.roles.length,fullBytes,viewBytes,reductionPercent:Math.round((1-viewBytes/fullBytes)*100)}));
