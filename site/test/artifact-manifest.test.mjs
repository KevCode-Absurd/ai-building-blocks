import test from 'node:test';
import assert from 'node:assert/strict';
import {validateArtifactManifest} from '../src/jobs/artifact-manifest.mjs';
const sha='a'.repeat(64),child='b'.repeat(64);
const spec=[{id:'result',path:'delivery.zip',count:2}],outputs=[{id:'result',path:'delivery.zip',sha256:sha}];
const files=()=>['analysis.csv','recommendation.md'].map((path,n)=>({slot_id:`part-${n}`,path,sha256:child,modality:n?'text':'data',output_id:'result',container_sha256:sha}));

test('child manifests support all task artifacts without calling a container a rendered image',()=>{
  const result=validateArtifactManifest(files(),{specs:spec,outputs});
  assert.equal(result.ok,true);assert.equal(result.coverage.result,2);assert.equal(result.assurance,'HOST_REPORTED_NOT_BYTE_VERIFIED');
  assert.equal(validateArtifactManifest([{slot_id:'result',path:'delivery.zip',sha256:sha,modality:'image'}],{specs:spec,outputs}).ok,false);
});
test('parent/child revisions, count, path uniqueness and declared output coverage are enforced',()=>{
  for(const mutate of [a=>a.pop(),a=>{a[1].slot_id=a[0].slot_id;},a=>{a[1].path=a[0].path;},a=>{a[0].container_sha256=child;},a=>{a[0].output_id='missing';},a=>{a[0].path='C:/private/file.csv';},a=>{a[0].path='../../outside.csv';}]){
    const artifacts=files();mutate(artifacts);assert.equal(validateArtifactManifest(artifacts,{specs:spec,outputs}).ok,false);
  }
  assert.equal(validateArtifactManifest(files(),{specs:[{id:'result',path:'delivery.zip'}],outputs}).ok,false);
});
