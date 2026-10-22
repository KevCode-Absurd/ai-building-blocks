// Called only after the complete build and Worker bundle have been copied to a
// dedicated release directory. Future shared-tree changes cannot alter uploads.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root=path.resolve(process.argv[2]||'');
const allowed=[path.resolve('site/.wrangler/releases'),path.resolve('C:/Users/kevin/.codex/visualizations/2026/10/22/01a161bf-0b97-7cf2-97f3-74eb6d30d1e4')];
assert(allowed.some(parent=>root.startsWith(parent+path.sep))&&path.basename(root).startsWith('release-2026-10-22'));
const assets=path.join(root,'assets'), worker=path.join(root,'worker','worker.js');
const critical=['index.html','compose.html','skills/loss-framing-writer.html','data/blocks.json',...['storyboard-to-powerpoint-deck-builder','case-competition-slide-deck-builder','research-paper-writer','equity-research-valuation-report-builder'].map(slug=>'skills/'+slug+'.zip')];
const sha=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
for(const file of critical)assert(fs.existsSync(path.join(assets,file)),'Incomplete release: '+file);
assert(fs.existsSync(worker),'A frozen bundled Worker is required.');
const hashes=Object.fromEntries(critical.map(file=>[file,sha(path.join(assets,file))]));
const files=fs.readdirSync(assets,{recursive:true,withFileTypes:true}).filter(entry=>entry.isFile()).length;
const outputs={};
for(const [name,input] of [['staging','site/wrangler.jsonc'],['production','site/wrangler.production.jsonc']]){
 const config=JSON.parse(fs.readFileSync(input,'utf8'));
 delete config.$schema;
 config.main=worker;config.no_bundle=true;config.assets.directory=assets;
 for(const env of Object.values(config.env||{}))if(env.assets)env.assets.directory=assets;
 const output=path.join(root,`wrangler.${name}.jsonc`);
 assert(!fs.existsSync(output),'Release configs already exist; use a fresh release directory.');
 fs.writeFileSync(output,JSON.stringify(config,null,2)+'\n');outputs[name]=output;
}
const report={frozenOn:new Date().toISOString(),root,assets,worker,workerSha256:sha(worker),files,blocks:JSON.parse(fs.readFileSync(path.join(assets,'data/blocks.json'),'utf8')).blocks.length,criticalAssets:hashes,configs:outputs};
fs.writeFileSync(path.join(root,'release-manifest.json'),JSON.stringify(report,null,2)+'\n');
fs.writeFileSync('reports/cloudflare-frozen-release.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
