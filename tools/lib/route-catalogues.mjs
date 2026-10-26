// Pure public catalogue transformations. No filesystem, network or deployment.
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const slugOK=s=>typeof s==='string'&&/^[a-z0-9][a-z0-9-]{0,119}$/.test(s);
export const routeKind=b=>b.type==='mind'?'minds':b.type==='agent'?'agents':b.category==='orchestrator'||b.type==='workflow'||b.type==='routine'?'workflows':b.type==='prompt'?'prompts':'skills';
const steps=b=>(b.steps??[]).map(s=>typeof s==='string'?s:Array.isArray(s)?s[0]:s?.uses);
export const routeDependencies=b=>[...new Set([...(b.uses??[]),...steps(b),...(b.twin?[b.twin]:[]),...(b.minds??[])])];
export function buildRouteCatalogue(full,slug,sourceHash){
 assert(/^[a-f0-9]{64}$/.test(sourceHash));assert(slugOK(slug));assert(Array.isArray(full.blocks));
 const bySlug=new Map(full.blocks.map(b=>[b.slug,b]));assert.equal(bySlug.size,full.blocks.length);const root=bySlug.get(slug);assert(root&&routeKind(root)!=='minds','Unknown public task route: '+slug);
 const included=new Set(),pending=[slug];
 while(pending.length){const id=pending.pop();if(included.has(id))continue;assert(slugOK(id)&&bySlug.has(id),'Unknown dependency '+id+' from '+slug);included.add(id);const block=bySlug.get(id);pending.push(...routeDependencies(block));
  // If the page offers assigned minds, a multi-mind export can need the shared
  // council instructions. Avoid traversing reverse mind skills/flows listings.
  if(block.minds?.length&&bySlug.has('advisory-council'))pending.push('advisory-council');
 }
 const blocks=full.blocks.filter(b=>included.has(b.slug)),ports=new Set(blocks.flatMap(b=>[...(b.inputs??[]),...(b.outputs??[])].map(p=>typeof p==='string'?p.replace(/\?$/,''):p.type)));
 const roster=(full.minds?.roster??[]).filter(m=>included.has(m.slug)),areas=new Set(roster.map(m=>m.area)),labels=new Set(roster.flatMap(m=>m.labels??[]));
 const result={schema:'abb-route-catalogue/1',partial:true,routeSlug:slug,routeKind:routeKind(root),sourceHash,built:full.built,portTypes:Object.fromEntries(Object.entries(full.portTypes??{}).filter(([p])=>ports.has(p))),renamed:Object.fromEntries(Object.entries(full.renamed??{}).filter(([,to])=>included.has(to))),...(full.minds?{minds:{...full.minds,roster,areas:Object.fromEntries(Object.entries(full.minds.areas??{}).filter(([id])=>areas.has(id))),...(full.minds.labels?{labels:Object.fromEntries(Object.entries(full.minds.labels).filter(([id])=>labels.has(id)))}:{})}}:{}),blocks};
 assertRouteCatalogue(result,full);return result;
}
export function assertRouteCatalogue(mini,full){
 assert.equal(mini.schema,'abb-route-catalogue/1');assert.equal(mini.partial,true);assert(/^[a-f0-9]{64}$/.test(mini.sourceHash));
 const original=new Map(full.blocks.map(b=>[b.slug,b])),included=new Map(mini.blocks.map(b=>[b.slug,b]));assert.equal(included.size,mini.blocks.length);assert(included.has(mini.routeSlug));assert.equal(routeKind(included.get(mini.routeSlug)),mini.routeKind);
 for(const b of mini.blocks){assert.deepEqual(b,original.get(b.slug),'Wire record changed: '+b.slug);for(const dep of routeDependencies(b))assert(included.has(dep),'Missing dependency '+dep);for(const p of [...(b.inputs??[]),...(b.outputs??[])]){const id=typeof p==='string'?p.replace(/\?$/,''):p.type;if(Object.hasOwn(full.portTypes??{},id))assert.deepEqual(mini.portTypes[id],full.portTypes[id]);}}
 for(const[from,to]of Object.entries(mini.renamed))assert.equal(full.renamed[from],to);
 for(const row of mini.minds?.roster??[]){assert(included.has(row.slug));assert.deepEqual(row,(full.minds?.roster??[]).find(m=>m.slug===row.slug));}
 return true;
}
export function generateRouteCatalogues(fullBytes){
 const bytes=typeof fullBytes==='string'?Buffer.from(fullBytes):Buffer.from(fullBytes),full=JSON.parse(bytes.toString('utf8')),sourceHash=hash(bytes),files={},routes=[];
 for(const b of full.blocks){if(routeKind(b)==='minds'||b.headline==='')continue;const mini=buildRouteCatalogue(full,b.slug,sourceHash),data=Buffer.from(JSON.stringify(mini)),file=`data/route-catalogues/${mini.routeKind}/${b.slug}.json`;assert(data.length<=2_000_000&&mini.blocks.length<=1024,'Route catalogue exceeds client guard: '+b.slug);files[file]=data;routes.push({slug:b.slug,kind:mini.routeKind,file,bytes:data.length,records:mini.blocks.length,sha256:hash(data)});}
 return{files,summary:{schema:'abb-route-catalogues/1',sourceHash,routes:routes.length,maxBytes:Math.max(...routes.map(r=>r.bytes)),maxRecords:Math.max(...routes.map(r=>r.records)),totalBytes:routes.reduce((s,r)=>s+r.bytes,0),entries:routes}};
}
export function routeCataloguePreloadScript(sourceHash){
 assert(/^[a-f0-9]{64}$/.test(sourceHash)||sourceHash==='__ABB_CATALOGUE_SOURCE_HASH__');
 return `<!-- The library list starts downloading alongside the code instead of after it. -->
    <script>
      window.__abbCatalogueSourceHash = "${sourceHash}";
      if (location.pathname === "/" || /^\\/(skills|prompts|workflows|agents|minds|space|people|s|compose|from-a-source)(\\/|$)/.test(location.pathname)) {
        const home = location.pathname === "/";
        const params = new URLSearchParams(location.search);
        const typed = location.pathname.match(/^\\/(skills|prompts|workflows|agents)\\/([a-z0-9][a-z0-9-]{0,119})\\/?$/);
        const starter = home && !params.has("block") && !params.has("workflow");
        const hasLibraryIntent = location.hash === "#library" || location.hash === "#build" || ["q", "kind", "area", "fn", "job", "audience", "starred"].some(key => params.has(key));
        const files = typed ? ["/data/route-catalogues/" + typed[1] + "/" + typed[2] + ".json"] : starter ? (hasLibraryIntent ? ["/data/blocks.json", "/data/starter-blocks.json"] : ["/data/starter-blocks.json"]) : ["/data/blocks.json"];
        for (const href of files) {
          const catalogue = document.createElement("link");
          catalogue.rel = "preload"; catalogue.href = href;
          catalogue.as = "fetch"; catalogue.crossOrigin = "anonymous";
          if (home && href === "/data/blocks.json") catalogue.fetchPriority = "low";
          document.head.append(catalogue);
        }
      }
    </script>`;
}
export function patchRouteCataloguePreload(html,sourceHash){
 const pattern=/<!-- The library list starts downloading alongside the code instead of after it\. -->\s*<script>[\s\S]*?<\/script>/g;
 assert.equal([...html.matchAll(pattern)].length,1,'Expected exactly one known catalogue preload script');return html.replace(pattern,routeCataloguePreloadScript(sourceHash));
}
