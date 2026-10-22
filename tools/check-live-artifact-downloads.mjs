// Read-only live verification for the four reviewed artifact skill packages.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../site/package.json',import.meta.url));
const {unzipSync}=require('fflate');
const base=new URL(process.argv[2]);
assert.equal(base.protocol,'https:');
assert(['ai-building-blocks-staging.kevinmark7498.workers.dev','ai-building-blocks.kevinmark7498.workers.dev','useaiblocks.com'].includes(base.hostname));
assert(!base.username&&!base.password&&!base.port&&!base.search&&!base.hash&&base.pathname==='/');
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const stableDist=process.env.CF_RELEASE_DIST||'site/dist';
const staging=base.hostname.includes('-staging.');
if(staging)assert(process.env.CF_PREVIEW_ACCESS_TOKEN,'Load the private staging access token in-process.');
const accessHeaders=staging?{'x-preview-access':process.env.CF_PREVIEW_ACCESS_TOKEN}:{};
const cases={
 'storyboard-to-powerpoint-deck-builder':['launch-tools/USAGE.md','launch-tools/finalize_pptx.py','templates/storyboard.example.json'],
 'case-competition-slide-deck-builder':['launch-tools/USAGE.md','launch-tools/build_case.py','launch-tools/sample.json'],
 'research-paper-writer':['launch-tools/USAGE.md','launch-tools/reproduce_simulation.py','launch-tools/task-schedules.csv'],
 'equity-research-valuation-report-builder':['launch-tools/USAGE.md','launch-tools/render_equity.py','launch-tools/validate_equity.py',...['S01','S02','S03','S04','S05'].map(id=>'launch-tools/sources/'+id+'.json')],
};
const checked=[];
for(const [slug,required] of Object.entries(cases)){
 const url=new URL('/skills/'+slug+'.zip',base);
 const response=await fetch(url,{headers:accessHeaders,redirect:'manual',signal:AbortSignal.timeout(30000)});
 assert.equal(response.status,200,slug);
 const bytes=Buffer.from(await response.arrayBuffer());
 assert.equal(sha(bytes),sha(fs.readFileSync(path.join(stableDist,'skills',slug+'.zip'))),slug+' differs from stable build');
 const files=unzipSync(bytes);
 for(const file of ['SKILL.md','SKILL.upstream.md',...required])assert(files[slug+'/'+file],slug+' lacks '+file);
 assert(new TextDecoder().decode(files[slug+'/SKILL.md']).includes('launch-tools/USAGE.md'));
 checked.push({slug,bytes:bytes.length,files:Object.keys(files).length,sha256:sha(bytes),status:'pass'});
}
const report={checkedOn:new Date().toISOString(),origin:base.origin,deployedVersion:staging?process.env.CF_STAGING_VERSION:process.env.CF_PRODUCTION_VERSION,readOnly:true,status:'pass',packages:checked};
const environment=base.hostname.includes('-staging.')?'staging':'production';
fs.writeFileSync('reports/cloudflare-'+environment+'-artifact-downloads.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
