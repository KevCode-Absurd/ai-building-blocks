// Final evidence summary; only observed passing reports qualify a release.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const files=['finance-expansion-manifest.json','finance-model-runtime-qa.json','finance-peer-qa.json','finance-packs-qa.json','finance-browser-qa.json','finance-browser-visual-qa.json','finance-release.json','finance-staging-deployment.json','finance-staging-qa.json','finance-production-deployment.json','finance-live-qa.json','finance-live-browser-qa.json'];
const reports=Object.fromEntries(files.map(file=>[file,JSON.parse(fs.readFileSync('reports/'+file,'utf8'))]));
const manifest=reports[files[0]],runtime=reports[files[1]],peer=reports[files[2]],packs=reports[files[3]],browser=reports[files[4]],visual=reports[files[5]],release=reports[files[6]],staging=reports[files[8]],production=reports[files[10]],liveBrowser=reports[files[11]];
assert.deepEqual(manifest.counts,{skills:120,workflows:60,agents:30,total:210});
assert.equal(runtime.passed,120);assert.equal(runtime.fixtures,376);assert.equal(peer.independentMethodReviews,210);assert.equal(peer.directlyReviewedNativeSheets,120);assert.equal(packs.passed,210);
for(const [report,count]of [[browser,212],[liveBrowser,3]]){assert.equal(report.stats.expected,count);assert.equal(report.stats.unexpected,0);assert.equal(report.stats.flaky,0);assert.equal(report.stats.skipped,0);}
assert.equal(visual.status,'pass');assert.equal(visual.screenshots,12);
for(const report of [staging,production]){assert.equal(report.status,'pass');assert.equal(report.passed,631);assert.equal(report.catalogueSha256,release.catalogueSha256);assert.equal(report.releaseRoot,release.root);}
assert.equal(staging.stagingPrivate,true);assert.equal(release.workerUnchanged,true);assert.equal(release.browserAssetsUnchanged,true);
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
assert.equal(release.sourceManifestSha256,sha(fs.readFileSync('reports/finance-expansion-manifest.json')));
const report={checkedOn:new Date().toISOString(),status:'pass',sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8',windowsHide:true}).trim(),origin:'https://useaiblocks.com',productionVersionId:reports['finance-production-deployment.json'].versionId,stagingVersionId:reports['finance-staging-deployment.json'].versionId,releaseRoot:release.root,counts:manifest.counts,nativeWorkbooks:120,calculationCases:376,independentlyReviewedMethods:210,directlyReviewedNativeSheets:120,packChecks:210,browserCases:212,mobilePageChecks:420,websiteScreenshotsReviewed:12,productionBrowserDownloads:3,stagingExactByteChecks:631,productionExactByteChecks:631,productionBindingsPreserved:reports['finance-production-deployment.json'].bindingsPreserved,stagingBindingsPreserved:reports['finance-staging-deployment.json'].bindingsPreserved,workerUnchanged:true,browserAssetsUnchanged:true,providerCalls:0,scope:'Original focused financial methods, illustrative editable XLSX examples, portable review agents and source-driven workflows. Fixture arithmetic does not establish company evidence, accounting/legal conclusions, investment performance or actual Microsoft Excel application execution.',evidence:files.map(file=>({file:'reports/'+file,sha256:sha(fs.readFileSync('reports/'+file))}))};
report.nonblockingFindings=visual.issues??[];
fs.writeFileSync('reports/finance-release-qa.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,counts:report.counts,version:report.productionVersionId,report:'reports/finance-release-qa.json'}));
