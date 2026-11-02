// Read-only release canary. No provider calls, private context, account writes or activation.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StreamableHTTPClientTransport} from '@modelcontextprotocol/sdk/client/streamableHttp.js';
const args=process.argv.slice(2);
if(args.length!==4||args[0]!=='--origin'||args[2]!=='--out')throw Error('Use --origin HTTPS_ORIGIN --out REPORT_FILE.');
const origin=new URL(args[1]);
if(origin.protocol!=='https:'||origin.username||origin.password||origin.pathname!=='/'||origin.search||origin.hash)throw Error('Use a bare HTTPS public origin.');
const sha=b=>createHash('sha256').update(b).digest('hex');
const report={origin:origin.origin,status:'RUNNING',readOnly:true,providerCalls:0,privateRecords:0,packs:[],protocol:[]};
async function get(route){const r=await fetch(new URL(route,origin),{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error(route+' HTTP '+r.status);return r;}
try{
 const [index,packs]=await Promise.all([get('/data/roles-index.json').then(r=>r.json()),get('/data/base-specialist-packs.json').then(r=>r.json())]);
 if(index.sourceHash!==packs.catalogue_hash||index.roles.length!==packs.count||Object.keys(packs.packs).length!==packs.count)throw Error('Live specialist inventories differ.');
 const queue=[...index.roles];
 await Promise.all(Array.from({length:4},async()=>{
  for(;;){const role=queue.shift();if(!role)return;const p=packs.packs[role.id];
   if(p?.path!=='/specialists/'+role.id+'-base-specialist.zip')throw Error('Invalid live pack path.');
   const bytes=new Uint8Array(await(await get(p.path)).arrayBuffer());
   if(bytes.length!==p.bytes||sha(bytes)!==p.sha256)throw Error('Live pack byte mismatch: '+role.id);
   report.packs.push({id:role.id,bytes:bytes.length,sha256:p.sha256,status:'PASS'});
  }
 }));
 const client=new Client({name:'ai-blocks-base-specialist-release-check',version:'1'});
 try{
  await client.connect(new StreamableHTTPClientTransport(new URL('/mcp',origin)));
  if(client.getServerVersion()?.version!=='2.2.0')throw Error('Unexpected production MCP version.');
  for(const id of ['coding-specialist','design-specialist','media-buyer']){
   const r=await client.callTool({name:'prepare_specialist',arguments:{role_id:id}});
   if(r.isError)throw Error('MCP base load failed: '+id);
   const value=r.structuredContent??JSON.parse(r.content.find(c=>c.type==='text').text);
   if(value.state!=='AWAITING_TASK'||value.selected_role?.id!==id||!value.files?.['INTAKE.md']||!value.files?.['SOUL.md']||value.execution?.model_calls_by_service!==0||value.execution?.stored_by_service!==false)throw Error('MCP base contract differs: '+id);
   const rest=await fetch(new URL('/api/v1/specialist-preparations',origin),{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({role_id:id}),signal:AbortSignal.timeout(30000)});
   const equivalent=await rest.json();if(!rest.ok||JSON.stringify(equivalent.files)!==JSON.stringify(value.files))throw Error('REST/MCP base files differ: '+id);
   const download=await get('/api/v1/specialists/'+id+'/pack'),bytes=new Uint8Array(await download.arrayBuffer());
   if(sha(bytes)!==packs.packs[id].sha256||download.headers.get('x-content-sha256')!==packs.packs[id].sha256)throw Error('API download differs: '+id);
   const page=await(await get('/roles/'+id)).text();if(!page.includes('/specialists/'+id+'-base-specialist.zip')||!page.includes('Download base specialist'))throw Error('Production page is missing the direct download: '+id);
   report.protocol.push({id,mcp:'PASS',restParity:'PASS',apiZip:'PASS',directPageLink:'PASS'});
  }
 }finally{await client.close();}
 report.status='PASS';report.count=report.packs.length;
}catch(error){report.status='FAIL';report.error=error.message;process.exitCode=1;}
report.packs.sort((a,b)=>a.id.localeCompare(b.id));
await fs.mkdir(path.dirname(path.resolve(args[3])),{recursive:true});await fs.writeFile(args[3],JSON.stringify(report,null,2));
console.log(JSON.stringify({status:report.status,packs:report.packs.length,protocol:report.protocol,error:report.error,report:path.resolve(args[3])}));
