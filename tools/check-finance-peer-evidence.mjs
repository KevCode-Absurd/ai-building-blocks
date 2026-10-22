// Pin completed independent reviews to the exact authored methods and rendered sheets.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const manifest=JSON.parse(fs.readFileSync('reports/finance-expansion-manifest.json','utf8'));
assert.deepEqual(manifest.counts,{skills:120,workflows:60,agents:30,total:210});
const results=[],reports=[];
for(const shard of ['public-markets','private-deals','operating-credit']){
  const sourcePath=`tools/finance-expansion/${shard}.json`,source=JSON.parse(fs.readFileSync(sourcePath,'utf8'));
  const reportPath=`reports/finance-${shard}-peer-review.json`,reportBytes=fs.readFileSync(reportPath),report=JSON.parse(reportBytes);
  assert.match(report.status,/^pass/i,shard+' review not passed');assert.equal(report.issues.length,0);
  assert.equal(report.source_sha256,sha(fs.readFileSync(sourcePath)),shard+' source changed after review');
  assert.equal(report.items.length,70);
  const native=JSON.parse(fs.readFileSync(`reports/finance-workbooks-${shard}.json`,'utf8'));assert.equal(native.passed,40);
  const specs=[...source.skills,...source.workflows,...source.agents];
  for(const spec of specs){
    const item=report.items.find(item=>item.slug===spec.slug);assert(item,spec.slug+' not reviewed');
    assert.equal(item.source_spec_sha256,sha(JSON.stringify(spec)),spec.slug+' method changed after review');
    const result={slug:spec.slug,type:item.type,status:'pass',specSha256:item.source_spec_sha256,peerReport:reportPath};
    if(source.skills.some(skill=>skill.slug===spec.slug)){
      assert.equal(item.model_sha256,sha(JSON.stringify(spec.model)),spec.slug+' model changed after review');
      assert.equal(item.visual_review.status,'pass');assert.equal(item.visual_review.inspected,true);
      const evidence=native.results.find(row=>row.slug===spec.slug);assert(evidence);
      const pngSha256=sha(fs.readFileSync(evidence.previewPath));assert.equal(pngSha256,item.png_sha256,spec.slug+' rendered sheet changed; direct review required');
      assert.equal(evidence.modelSha256,item.model_sha256);
      const workbookSpecSha256=sha(JSON.stringify({name:spec.name,model:spec.model,references:spec.references}));
      assert.equal(evidence.workbookSpecSha256,workbookSpecSha256,spec.slug+' native title/model/references are stale');
      const entry=manifest.items.find(row=>row.slug===spec.slug),proofPath=path.join(entry.dir,'references/workbook-verification.json');
      const proof=JSON.parse(fs.readFileSync(proofPath,'utf8'));
      assert.equal(proof.modelSha256,item.model_sha256);assert.equal(proof.workbookSpecSha256,workbookSpecSha256);
      assert.equal(proof.xlsxSha256,sha(fs.readFileSync(path.join(entry.dir,'examples/model.xlsx'))));
      assert.equal(proof.reopenedAndRecalculated,true);assert.equal(proof.baseline,'pass');
      assert.equal(proof.cases.length,spec.model.cases.length);assert(proof.cases.every(fixture=>fixture.status==='pass'));
      proof.visualReview='pass';proof.visualEvidence={report:reportPath,reportSha256:sha(reportBytes),previewSha256:pngSha256,sheet:'Model',sourceSpecSha256:item.source_spec_sha256};
      fs.writeFileSync(proofPath,JSON.stringify(proof,null,2)+'\n');
      Object.assign(result,{modelSha256:item.model_sha256,xlsxSha256:proof.xlsxSha256,pngSha256,visualReview:'pass',nativeRecalculation:'pass'});
    }
    results.push(result);
  }
  reports.push({path:reportPath,sha256:sha(reportBytes),sourcePath,sourceSha256:report.source_sha256});
}
assert.equal(results.length,210);assert.equal(results.filter(result=>result.visualReview==='pass').length,120);
const summary={checkedOn:new Date().toISOString(),status:'pass',items:210,independentMethodReviews:210,directlyReviewedNativeSheets:120,providerCalls:0,reports,scope:'Independent source/method/overlap reviews and actual rendered-sheet inspections, matched to final model/title/reference specifications. Existing PNG reviews carry forward only when exact preview bytes match. Current native saved-file recalculation is checked separately.',results};
fs.writeFileSync('reports/finance-peer-qa.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify({status:'pass',items:210,nativeSheets:120,report:'reports/finance-peer-qa.json'}));
