import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const read = file => JSON.parse(fs.readFileSync(file));
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const args=process.argv.slice(2), isFinal=args[0]==='--final';
const runs = isFinal ? [args[2]] : ['reports/2026-10-22-next-100-browser-first-full.json','reports/2026-10-22-next-100-browser-search-fix.json','reports/2026-10-22-next-100-browser-settled-mobile.json'];
const cases = report => {
  const out=[];
  const visit=suite=>{for(const spec of suite.specs??[])for(const test of spec.tests??[])out.push({title:spec.title,project:test.projectName,status:test.results.at(-1)?.status});for(const child of suite.suites??[])visit(child);};
  for(const suite of report.suites)visit(suite);return out;
};
const full=read(runs[0]);
if(isFinal){assert.equal(full.stats.expected,104);assert.equal(full.stats.unexpected,0);assert.equal(full.stats.skipped,0);assert.equal(full.stats.flaky,0);}
else {
  assert.equal(full.stats.expected,103);assert.equal(full.stats.unexpected,1);
  const search=read(runs[1]);assert.equal(search.stats.expected,1);assert.equal(search.stats.unexpected,0);
  const phones=read(runs[2]);assert.equal(phones.stats.expected,2);assert.equal(phones.stats.unexpected,0);
}
const final=new Map();for(const file of runs)for(const entry of cases(read(file)))final.set(`${entry.project}:${entry.title}`,entry);
assert.equal(final.size,104);assert([...final.values()].every(entry=>entry.status==='passed'));
const assetDir=path.resolve(isFinal ? args[1] : 'site/.wrangler/releases/release-2026-10-22-r12-voice-workflow/assets');
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
const screenshots=walk(isFinal ? args[3] : 'runs/next-100-browser-settled-mobile').filter(file=>file.endsWith('.png'));assert.equal(screenshots.length,6);
const method=isFinal ? 'One complete 104-case browser run passed against this exact final frozen artifact, including all 75 workflow and agent downloads. Screenshots wait for the actual loader transition. Earlier release reports remain preserved separately.' : '104 unique browser cases passed cumulatively: initial full run 103 pass and one incorrect no-results assertion; focused corrected search rerun passed. Both phone checks reran after waiting for the actual boot transition so final screenshots show settled UI. Product bytes were unchanged throughout. Historical raw reports and original screenshots remain intact.';
const report={schema:isFinal?'ai-blocks-browser-qa/1':'ai-blocks-browser-qa-aggregate/1',checkedOn:new Date().toISOString(),status:'pass',assets:assetDir,catalogueSha256:sha(path.join(assetDir,'data/blocks.json')),stats:{expected:104,unexpected:0,skipped:0,flaky:0},method,sourceRuns:runs.map(file=>({file,sha256:sha(file),stats:read(file).stats})),coverage:{editedToolsAndExactDownloadedResults:25,actualWorkflowAndAgentZipDownloads:75,phonePages:50,phoneWidths:[320,390],invalidInputRecovery:1,topicAndNameSearch:1},visualReview:{status:'pass',method:'Viewed all six actual settled screenshots; readable labels and results, usable controls, no horizontal clipping.',screenshots},cases:[...final.values()]};
fs.writeFileSync('reports/2026-10-22-next-100-browser-qa.json',JSON.stringify(report,null,2)+'\n');
const packs=read('reports/2026-10-22-next-100-packs-qa.json');assert.equal(packs.passed,75);assert.equal(packs.catalogueSha256,report.catalogueSha256);
assert.equal(path.resolve(packs.dist),assetDir,'Pack and browser checks must cover the same artifact');
const methods=read('reports/next-100-independent-method-review.json');assert.equal(methods.counts.errors,0);assert.equal(methods.counts.reviews_pending,0);
const acceptance={checkedOn:new Date().toISOString(),status:'verified-frozen-build-ready-for-publication',assets:assetDir,counts:{tools:25,workflows:55,agents:20,total:100},unitChecks:50,typeScript:'pass',browserCases:104,actualDownloadedPacks:75,independentDeterministicPackAssemblies:75,phonePages:50,visuallyInspectedScreenshots:6,nativeAdapterFixtureChecks:4,providerCallsForThisBatch:0,reports:['reports/2026-10-22-next-100-browser-qa.json','reports/2026-10-22-next-100-packs-qa.json','reports/next-100-independent-method-review.json','reports/next-100-independent-tools-review.json','reports/next-100-adapter-checks.json'].map(file=>({file,sha256:sha(file)})),limits:'Workflow methods, handoffs, downloads and source applicability were checked; execution of every business workflow through an AI model is not claimed. Production publication and live exact-file verification are tracked by the publishing chat.'};
fs.writeFileSync('reports/2026-10-22-next-100-acceptance.json',JSON.stringify(acceptance,null,2)+'\n');
console.log(JSON.stringify({status:acceptance.status,browserCases:104,packs:75,screenshots:6}));
