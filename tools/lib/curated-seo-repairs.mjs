// Derived-output repairs only. Invoke on a new *-r2/assets copy, never the deployed r1.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {normalizeSkillHtml} from '../../site/src/lib/skill-html.mjs';
const require=createRequire(new URL('../../site/package.json',import.meta.url));
const {unzipSync}=require('fflate');
const SITE='https://useaiblocks.com';
const digest=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const decode=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const kind=b=>b.type==='mind'?'minds':b.type==='agent'?'agents':b.category==='orchestrator'||['workflow','routine'].includes(b.type)?'workflows':b.type==='prompt'?'prompts':'skills';
const walk=(d,base=d)=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(d,e.name),base):[path.relative(base,path.join(d,e.name)).replaceAll('\\','/')]);
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const verifiedDynamic=p=>/^\/(?:s\/|api\/|mcp(?:\/|$)|community\/|oauth\/|\.well-known\/oauth-)/.test(p);
const pendingTools=new Set(['source-id-cross-checker','task-dependency-planner','study-review-date-planner','file-rename-preview'].map(s=>'/tools/'+s));
const textExtensions=new Set(['md','txt','json','yaml','yml','csv','toml','ini']);
const rasterExtensions=new Set(['png','jpg','jpeg','webp']);

export function repairCuratedSeo(assetsRoot,{rendersRoot,baselineAssets,baselinePagesRoot,pagePaths}={}){
 const root=fs.realpathSync(path.resolve(assetsRoot));
 if(path.basename(root)!=='assets'||!/(?:^|[-_])r2$/i.test(path.basename(path.dirname(root)))||/(?:^|[\\/])agency-curated-r1(?:[\\/]|$)/i.test(root))throw Error('SEO repairs require a new *-r2/assets copy; deployed r1 is read-only.');
 const within=f=>{const resolved=path.resolve(root,f);if(resolved!==root&&!resolved.startsWith(root+path.sep))throw Error('Repair target escaped assets.');let p=resolved;while(!fs.existsSync(p))p=path.dirname(p);const real=fs.realpathSync(p);if(real!==root&&!real.startsWith(root+path.sep))throw Error('Repair target resolves outside r2 assets.');return resolved;};
 const files=new Set(walk(root)),foldedFiles=new Map(),plan=new Map(),events=[],unresolvedKnownTools=new Set();
 const register=file=>{const key=file.toLowerCase(),entries=foldedFiles.get(key)||[];if(!entries.includes(file))entries.push(file);foldedFiles.set(key,entries);};for(const file of files)register(file);
 const read=f=>{const edit=plan.get(f);return edit?edit.after.toString('utf8'):fs.readFileSync(within(f),'utf8');};
 const set=(file,after,reason)=>{within(file);const next=Buffer.isBuffer(after)?after:Buffer.from(after);const existing=plan.get(file),before=existing?existing.before:(files.has(file)?fs.readFileSync(within(file)):null);if(before?.equals(next)){plan.delete(file);return;}plan.set(file,{before,after:next,reasons:[...new Set([...(existing?.reasons||[]),reason])]});files.add(file);register(file);};
 const catalogue=JSON.parse(read('data/blocks.json')),bySlug=new Map(catalogue.blocks.map(b=>[b.slug,b]));
 const agency=catalogue.blocks.filter(b=>b.type==='agent'&&b.slug.startsWith('agency-'));
 if(agency.length!==283)throw Error(`Expected the 283 original Agency agents; found ${agency.length}.`);
 const protectedHashes=Object.fromEntries([...files].filter(f=>f==='data/blocks.json'||f.endsWith('.zip')||/^skills\/[^/]+\//.test(f)).map(f=>[f,digest(fs.readFileSync(within(f)))]));
 if(rendersRoot){
  const rendered=fs.realpathSync(path.resolve(rendersRoot));
  for(const route of pendingTools){
   const htmlFile=route.slice(1)+'.html',metadataFile='metadata'+route+'.json';
   if(files.has(htmlFile)||files.has(metadataFile)){if(!files.has(htmlFile)||!files.has(metadataFile))throw Error('Partially occupied tool destination: '+route);continue;}
   const html=fs.readFileSync(path.join(rendered,htmlFile),'utf8'),metadata=JSON.parse(fs.readFileSync(path.join(rendered,metadataFile),'utf8'));
   if(metadata.canonical!==SITE+route||/noindex/.test(metadata.robots)||!html.includes(`href="${SITE}${route}"`)||!html.includes(metadata.title.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')))throw Error('Rendered tool metadata identity mismatch: '+route);
   const graph=html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];if(!graph||JSON.stringify(JSON.parse(graph))!==JSON.stringify(metadata.graph))throw Error('Rendered tool graph parity mismatch: '+route);
   set(htmlFile,html,'Install only the verified missing browser-tool static page from fresh scoped renders.');set(metadataFile,JSON.stringify(metadata),'Install matching authoritative browser-tool runtime metadata.');events.push({type:'missing-tool-page',route,rendersRoot:rendered});
  }
  const f='sitemap-pages.xml',before=read(f),urls=[...before.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>decode(m[1]));
  const combined=[...new Set([...urls,...pendingTools].map(u=>u.startsWith('/')?SITE+u:u))].sort();
  set(f,`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${combined.map(u=>`  <url><loc>${esc(u)}</loc></url>`).join('\n')}\n</urlset>\n`,'Add four verified existing browser tools to sitemap without fabricated timestamps.');
 }
 let maps=read('sitemap-agents.xml');
 const listed=[...maps.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>decode(m[1]));
 const locations=[...new Set([...listed,...agency.map(b=>`${SITE}/agents/${b.slug}`)])].sort();
 const sitemap=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${locations.map(u=>`  <url><loc>${esc(u)}</loc></url>`).join('\n')}\n</urlset>\n`;
 if(sitemap!==maps)set('sitemap-agents.xml',sitemap,'List all 283 existing canonical Agency agent pages without invented lastmod dates.');
 const schemaRepair=value=>{let changed=0;if(!value||typeof value!=='object')return changed;if(value['@type']==='HowTo'&&Array.isArray(value.step)&&!value.step.length){value['@type']='CreativeWork';delete value.step;changed++;}for(const child of Object.values(value))if(child&&typeof child==='object')changed+=schemaRepair(child);return changed;};
 for(const file of [...files].filter(f=>f.startsWith('metadata/')&&f.endsWith('.json'))){
  const m=JSON.parse(read(file)),count=schemaRepair(m.graph);if(!count)continue;
  const htmlFile=file.replace(/^metadata\//,'').replace(/\.json$/,'.html');if(!files.has(htmlFile))throw Error('Metadata has no corresponding HTML: '+file);
  const html=read(htmlFile),matches=[...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if(matches.length!==1)throw Error('Expected one schema graph: '+htmlFile);
  const oldGraph=JSON.parse(matches[0][1]);if(schemaRepair(oldGraph)!==count||JSON.stringify(oldGraph)!==JSON.stringify(m.graph))throw Error('Static/runtime graph mismatch: '+file);
  set(file,JSON.stringify(m),'Replace empty HowTo schema with CreativeWork; no step sequence is invented.');
  set(htmlFile,html.replace(matches[0][0],matches[0][0].replace(matches[0][1],JSON.stringify(m.graph).replaceAll('<','\\u003c'))),'Keep static structured data equal to repaired runtime metadata.');
  events.push({type:'empty-howto',file,entities:count});
 }
 const standalone=catalogue.blocks.filter(b=>kind(b)==='workflows'&&b.execution==='coordinator'&&!(b.steps??[]).length);
 for(const block of standalone){
  const slug=block.slug,f=`workflows/${slug}.html`,before=read(f),detail=JSON.parse(read(`data/pages/${slug}.json`));
  const instructions=(detail.files||[]).includes('workflow-state.json')?'SKILL.md and workflow-state.json':'SKILL.md and the included supporting files';
  const zip=`skills/${slug}.zip`;let handoff=false;if(!files.has(zip))throw Error('Standalone coordinator has no verified ZIP: '+slug);unzipSync(fs.readFileSync(within(zip)),{filter:e=>{if(e.name.endsWith('/HANDOFF.md')||e.name==='HANDOFF.md')handoff=true;return false;}});if(handoff)throw Error('Coordinator ZIP actually has HANDOFF.md; needs individual review: '+slug);
  let after=before.replace('It guides your AI through several skills in order, passing each step\'s output to the next.',`It follows ${instructions}, preserving the required inputs, evidence and checkpoints.`).replace('Get the plan and all the skill files. Give the complete pack to your AI, then ask it to follow HANDOFF.md.',`Download the complete workflow pack. Give it to your AI, then ask it to read ${instructions} and follow the governing instructions and checkpoints.`);
  if(after.includes('follow HANDOFF.md')||after.includes('several skills in order'))throw Error('Coordinator copy was not repaired: '+f);
  if(before!==after)set(f,after,'Describe actual coordinator files and checkpoints; ZIP has no HANDOFF.md.');
 }
 const redirects=new Map(read('_redirects').split(/\r?\n/).map(l=>l.trim().split(/\s+/)).filter(f=>f[0]?.startsWith('/')&&!f[0].includes('*')).map(f=>[f[0],f[1]]));
 function resolve(route,seen=new Set()){
  if(seen.has(route)||seen.size>15)return null;seen.add(route);let raw;try{raw=decodeURIComponent(route).replace(/^\/+/, '');}catch{return null;}
  if(raw.split('/').includes('..'))return null;
  if(files.has(raw||'index.html')||files.has(raw+'.html')||files.has(raw+'/index.html'))return route;
  if(redirects.has(route))return resolve(new URL(redirects.get(route),SITE).pathname,seen);
  const m=route.match(/^\/(skills|prompts|workflows|agents|minds)\/([a-z0-9-]+)(?:\.html)?$/),b=m&&bySlug.get(catalogue.renamed?.[m[2]]||m[2]);
  return b?resolve(`/${kind(b)}/${b.slug}`,seen):null;
 }
 const supportCache=new Map();let totalBytes=0;
 function materialize(route){
  if(supportCache.has(route))return supportCache.get(route);
  const no=reason=>{supportCache.set(route,{ok:false,reason});return supportCache.get(route);};
  let decoded;try{decoded=decodeURIComponent(route);}catch{return no('Invalid URL encoding.');}
  const match=decoded.match(/^\/skills\/([a-z0-9-]+)\/(.+)$/);if(!match)return no('Not a supporting-file URL.');
  const [,slug,member]=match;
  if(member.split('/').some(p=>!p||p==='.'||p==='..'||p.startsWith('.'))||/\\|[\x00-\x1f]/.test(member))return no('Unsafe supporting-file path.');
  const extension=member.match(/\.([a-z0-9]+)$/i)?.[1].toLowerCase(),inertText=textExtensions.has(extension)||/(?:^|\/)(?:LICENSE|NOTICE|COPYING)$/i.test(member),raster=rasterExtensions.has(extension);
  const zip=`skills/${slug}.zip`;if(!files.has(zip))return no('No existing public ZIP for this slug.');
  const allowed=new Set([`${slug}/${member}`,member]);let extracted;const found=[];
  try{extracted=unzipSync(fs.readFileSync(within(zip)),{filter:entry=>{if(!allowed.has(entry.name))return false;found.push({name:entry.name,bytes:entry.originalSize});return (inertText||raster)&&entry.originalSize<=1_000_000;}});}catch{return no('ZIP inspection failed.');}
  if(found.length!==1)return no(found.length?'Ambiguous exact ZIP member.':'Exact member absent.');
  const packed=reason=>{const result={ok:false,download:'/'+zip,zip,member:found[0].name,bytes:found[0].bytes,reason};supportCache.set(route,result);events.push({type:'download-public-pack-member',route,...result});return result;};
  if(!inertText&&!raster)return packed('Exact member is available in the complete public pack; active/unsupported format is not served separately.');
  const names=Object.keys(extracted);if(names.length!==1)return packed('Exact member exceeds the 1MB materialization bound.');
  const data=Buffer.from(extracted[names[0]]);let text='';if(inertText)try{text=new TextDecoder('utf-8',{fatal:true}).decode(data);}catch{return packed('Member is not UTF-8 text.');}
  if(inertText&&/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(text))return packed('Member contains binary control bytes.');
  if(raster){const hex=data.subarray(0,12).toString('hex'),valid=extension==='png'?hex.startsWith('89504e470d0a1a0a'):['jpg','jpeg'].includes(extension)?hex.startsWith('ffd8ff'):data.toString('ascii',0,4)==='RIFF'&&data.toString('ascii',8,12)==='WEBP';if(!valid)return packed('Raster member lacks its expected format signature.');}
  const file=decoded.slice(1),occupied=foldedFiles.get(file.toLowerCase());
  if(occupied?.length){
   if(occupied.length===1&&fs.existsSync(within(occupied[0]))&&data.equals(fs.readFileSync(within(occupied[0])))){
    const result={ok:true,canonicalRoute:'/'+occupied[0],zip,member:names[0],sha256:digest(data),reason:'Wrong-case reference canonicalized only after exact ZIP-member bytes matched the existing public file.'};supportCache.set(route,result);events.push({type:'verified-case-canonicalization',route,...result});return result;
   }
   return packed('Case-insensitive destination is occupied by different or ambiguous public bytes; preserve the existing file and download the complete pack.');
  }
  if(totalBytes+data.length>50_000_000)throw Error('Text materialization exceeded bounded 50MB total.');totalBytes+=data.length;
  set(file,data,'Materialize exact already-public ZIP member, byte-for-byte, without executing source code.');
  const result={ok:true,file,zip,member:names[0],sha256:digest(data),bytes:data.length};supportCache.set(route,result);events.push({type:'materialized-public-text',route,...result});return result;
 }
 const decisions=new Map();
 function decision(href,originRoute){
  let u;try{u=new URL(decode(href),SITE+originRoute);}catch{return null;}
  if(u.origin!==SITE||verifiedDynamic(u.pathname)||u.pathname===originRoute)return null;
  const resolved=resolve(u.pathname);if(resolved){if(resolved!==u.pathname)return {action:'canonicalize',to:resolved+u.search+u.hash};return null;}
  if(pendingTools.has(u.pathname)){unresolvedKnownTools.add(u.pathname);return null;}
  const support=materialize(u.pathname);if(support.canonicalRoute)return {action:'canonicalize',to:support.canonicalRoute+u.search+u.hash};if(support.ok)return null;
  if(support.download)return {action:'download',to:support.download,title:'Download complete pack for '+u.pathname.split('/').slice(3).join('/')};
  const result={action:'plain-text',reason:support.reason};if(!decisions.has(u.pathname)){decisions.set(u.pathname,result);events.push({type:'remove-unresolved-anchor',route:u.pathname,reason:support.reason});}return result;
 }
 function repairAnchors(html,route){
  // Text and descendants remain exactly as supplied; only anchor routing is repaired.
  return html.replace(/<a\b([^>]*)\bhref\s*=\s*(?:"([^"]*)"|'([^']*)')([^>]*)>([\s\S]*?)<\/a>/gi,(all,before,dq,sq,after,body)=>{
   const href=dq??sq,change=decision(href,route);if(!change)return all;
   if(change.action==='canonicalize')return all.replace(/\bhref\s*=\s*(?:"[^"]*"|'[^']*')/i,`href="${esc(change.to)}"`);
   if(change.action==='download'){const rest=(before+after).replace(/\btitle\s*=\s*(?:"[^"]*"|'[^']*')/gi,'').replace(/\bdownload(?:\s*=\s*(?:"[^"]*"|'[^']*'))?/gi,'');return `<a${rest} href="${esc(change.to)}" download title="${esc(change.title)}">${body}</a>`;}
   return body;
  });
 }
 const htmlFiles=[...files].filter(f=>f.endsWith('.html')&&!/^(?:mini-tools\/|example-app\/|skills\/[^/]+\/)/.test(f));
 for(const file of htmlFiles){const route=file==='index.html'?'/':'/'+file.replace(/\.html$/,'');const before=read(file),after=repairAnchors(before,route);if(after!==before)set(file,after,'Repair verified dead or aliased static anchors; preserve visible text and governing instruction bytes.');}
 const repairValue=(value,route)=>{if(typeof value==='string')return value.includes('<a')?repairAnchors(value,route):value;if(Array.isArray(value))return value.map(v=>repairValue(v,route));if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,repairValue(v,route)]));return value;};
 const originalAssets=baselineAssets||baselinePagesRoot,selectedPages=pagePaths?new Set(pagePaths):null,baselinePages=originalAssets?path.join(fs.realpathSync(path.resolve(originalAssets)),'data/pages'):null;
 if(selectedPages)for(const file of selectedPages)if(!/^data\/pages\/[a-z0-9-]+\.json$/.test(file)||!files.has(file))throw Error('Invalid selected derived page path: '+file);
 for(const file of [...files].filter(f=>f.startsWith('data/pages/')&&f.endsWith('.json')&&(!selectedPages||selectedPages.has(f)))){
  const slug=path.basename(file,'.json'),b=bySlug.get(slug);if(!b)continue;const before=read(file),data=JSON.parse(before),beforeSemantic=JSON.stringify(data);
  if(baselinePages&&typeof data.html?.skill==='string'){
   const baselineFile=path.join(baselinePages,slug+'.json');if(!fs.existsSync(baselineFile))throw Error('Missing original derived page for correction: '+file);
   const original=JSON.parse(fs.readFileSync(baselineFile,'utf8'));if(typeof original.html?.skill!=='string')throw Error('Original page has no instruction HTML: '+file);data.html.skill=original.html.skill;
  }
  // Runtime and prerender both normalize raw skill-relative references first.
  // Only then can a site-URL repair decide whether an anchor has a real asset or ZIP member.
  if(typeof data.html?.skill==='string')data.html.skill=normalizeSkillHtml(data.html.skill,slug,data.files||[]);
  const after=repairValue(data,`/${kind(b)}/${slug}`);if(JSON.stringify(after)!==beforeSemantic)set(file,JSON.stringify(after),'Normalize original skill-relative HTML before repairing derived site anchors; source methods/downloads unchanged.');
 }
 const publicPeople=read('people.html');
 if(!/<meta name="robots" content="[^"]*noindex/.test(publicPeople)&&publicPeople.includes('From people')){
  const f='from-a-source.html',before=read(f);if(!before.includes('href="/people"')){const after=before.replace('</main>','<p><a href="/people">Browse publicly shared skills and workflows from people</a></p></main>');if(after===before)throw Error('No intended discovery main for people link.');set(f,after,'Add a crawlable inbound link to intended public From people discovery page.');}
 }
 const writes=[...plan].map(([file,change])=>({file,...change}));
 // Preflight every target and compare old identity before staging any writes.
 for(const w of writes){const f=within(w.file),exists=fs.existsSync(f);if(w.before?( !exists||digest(fs.readFileSync(f))!==digest(w.before)):exists)throw Error('Destination changed during repair planning: '+w.file);}
 const nonce=crypto.randomBytes(6).toString('hex'),staged=[],committed=[];
 try{for(const w of writes){const dest=within(w.file);fs.mkdirSync(path.dirname(dest),{recursive:true});const tmp=dest+'.seo-repair-tmp-'+nonce;fs.writeFileSync(tmp,w.after,{flag:'wx'});staged.push({tmp,dest,w});}
  for(const item of staged){fs.renameSync(item.tmp,item.dest);committed.push(item);}
  for(const [file,hash]of Object.entries(protectedHashes))if(digest(fs.readFileSync(within(file)))!==hash)throw Error('Protected public instruction/catalogue/ZIP changed: '+file);
 }catch(error){for(const item of committed.reverse()){if(item.w.before)fs.writeFileSync(item.dest,item.w.before);else fs.rmSync(item.dest);}for(const item of staged)if(fs.existsSync(item.tmp))fs.rmSync(item.tmp);throw error;}
 return {schema:'abb-curated-seo-repairs/1',assetsRoot:root,status:unresolvedKnownTools.size?'REPAIRED_WITH_TOOL_PAGE_PREREQUISITES':'REPAIRED',writes:writes.map(w=>({path:w.file,beforeSha256:w.before?digest(w.before):null,afterSha256:digest(w.after),beforeBytes:w.before?.length??0,afterBytes:w.after.length,reasons:w.reasons})),events,materializedBytes:totalBytes,materializedFiles:events.filter(e=>e.type==='materialized-public-text').length,unresolvedKnownTools:[...unresolvedKnownTools],protectedFilesVerified:Object.keys(protectedHashes).length,sourceCatalogueAndZipBytesPreserved:true,atomicity:'All destinations preflighted, same-directory temporary writes prepared before per-file atomic rename; rollback on detected failure. This is not a cross-filesystem transaction.'};
}
