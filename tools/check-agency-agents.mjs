// Verify all source packs and the generated catalogue, search and public API assets.
// Run after npm run index in site/: node tools/check-agency-agents.mjs
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import YAML from '../site/node_modules/yaml/dist/index.js';
import {unzipSync} from '../site/node_modules/fflate/esm/index.mjs';
import {grade} from './readability.mjs';
const ROOT=path.resolve(import.meta.dirname,'..');
const arg=key=>{const at=process.argv.indexOf(key);return at>=0?process.argv[at+1]:null;};
const assetsRoot=path.resolve(arg('--assets')??path.join(ROOT,'site/public'));
const outputFile=path.resolve(arg('--out')??path.join(ROOT,'reports/2026-10-25-agency-agents-checks.json'));
const read=file=>fs.readFileSync(path.join(ROOT,file),'utf8');
const json=file=>JSON.parse(read(file));
const assetJson=file=>JSON.parse(fs.readFileSync(path.join(assetsRoot,file),'utf8'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const report=json('reports/2026-10-25-agency-agents-import.json');
assert.equal(report.mode,'write');assert.deepEqual(report.problems,[]);
assert.equal(report.rows.length,283);assert.equal(new Set(report.rows.map(r=>r.division)).size,18);
assert(report.findings.every(f=>typeof f.review==='string'&&f.review.length>20));
const catalogue=assetJson('data/blocks.json');
const manifest=assetJson('data/public-api-manifest.json');
const search=assetJson('data/library-search.json');
const counts={profiles:0,archives:0,sourceHashes:0,licences:0,pages:0,searchDocuments:0,apiResources:0};
const notices=read('NOTICE.md');
for(const r of report.rows){
 const base=`catalogue-items/agents/${r.slug}`;
 const it=YAML.parse(read(base+'/item.yaml')),pg=YAML.parse(read(base+'/page.yaml'));
 assert.equal(it.origin,'imported');assert.equal(it.type,'agent');assert.equal(it.source.repo,report.repo);
 assert.equal(it.source.commit,report.commit);assert.equal(it.source.path,r.path);
 assert.equal(it.source.sha256,r.sourceSha256);assert.equal(it.source.licence,'MIT');
 assert(!it.tested);assert.equal(it.example_pending,true);
 assert.equal(sha(fs.readFileSync(path.join(ROOT,base,'references/source-agent.md'))),r.sourceSha256);counts.sourceHashes++;
 const skill=read(base+'/SKILL.md');
 const metadata=YAML.parse(skill.match(/^---\n([\s\S]*?)\n---/)[1]);
 assert.equal(metadata.name,r.slug);assert(metadata.description.length<=1024);
 assert(skill.includes('references/source-agent.md'));
 assert(skill.includes("host's instruction hierarchy"));assert(skill.includes("user's authorization"));
 assert(it.summary.split(/\s+/).length<=22);assert(grade(it.summary)<=10,`${r.slug}: reading grade ${grade(it.summary)}`);
 assert.equal(pg.job,r.task);assert(pg.you_get.includes(r.outcome));
 assert(notices.includes(`agents/${r.slug}`));
 const block=catalogue.blocks.find(b=>b.slug===r.slug);assert(block,r.slug);
 assert.equal(block.category,'agent');assert.equal(block.type,'agent');assert(block.tested==null);assert.equal(block.hasFiles,true);
 assert.equal(block.task,r.task);assert.equal(block.source.by,it.source.by);counts.profiles++;
 const page=assetJson(`data/pages/${r.slug}.json`);assert(page.html.skill.includes('source-agent.md'));assert.equal(page.source.licence,'MIT');assert.equal(page.source.commit,report.commit);assert.equal(page.source.repo,report.repo);counts.pages++;
 const archive=unzipSync(new Uint8Array(fs.readFileSync(path.join(assetsRoot,`skills/${r.slug}.zip`))));
 assert.equal(sha(archive[`${r.slug}/references/source-agent.md`]),r.sourceSha256);
 assert.equal(Buffer.from(archive[`${r.slug}/SKILL.md`]).toString('utf8'),skill);
 const licence=Buffer.from(archive[`${r.slug}/LICENSE`]).toString('utf8');
 assert(licence.includes('Copyright (c) 2025 AgentLand Contributors'));assert(licence.includes('Permission is hereby granted, free of charge'));counts.licences++;
 for(const file of ['SETUP.md','source.json'])assert(archive[`${r.slug}/${file}`]);
 for(const file of Object.keys(archive))assert(file.startsWith(r.slug+'/')&&!file.includes('..')&&!file.includes('\\'));
 if(r.path==='specialized/agentic-identity-trust.md'){
  const companion=report.rows.find(row=>row.path==='specialized/identity-graph-operator.md');
  assert.equal(sha(archive[`${r.slug}/references/identity-graph-operator.md`]),companion.sourceSha256);
 }
 counts.archives++;
 const resource=manifest.resources[r.slug];assert(resource,`${r.slug}: public API missing`);
 assert.equal(resource.reference_validation.status,'PASS');assert.equal(resource.instruction.sha256,sha(Buffer.from(skill)));counts.apiResources++;
 assert(search.docs.includes(r.slug),`${r.slug}: missing from search`);counts.searchDocuments++;
}
assert.equal(catalogue.blocks.filter(b=>b.slug.startsWith('agency-')).length,283);
const result={status:'pass',checkedOn:new Date().toISOString(),sourceCommit:report.commit,counts,catalogueBlocks:catalogue.blocks.length,catalogueAgents:catalogue.blocks.filter(b=>b.type==='agent').length,limitations:'Static source, package and publication checks. Agent behavior has not been evaluated in model runs. No live deployment performed.'};
fs.mkdirSync(path.dirname(outputFile),{recursive:true});fs.writeFileSync(outputFile,JSON.stringify({...result,assetsRoot},null,2)+'\n');
console.log(JSON.stringify(result));
