// Synthetic contract evidence. These records do not claim real host execution.
export function workContext(artifacts=[],mode='IMPROVE') {
  return {schema:'ai-blocks-work-context/1',mode,sources:[{
    id:'current-work',ref:'project/current.md',sha256:'b'.repeat(64),observed_at:'2026-11-08T10:00:00Z',role:'BASELINE',currentness:'CURRENT',
    freshness_basis:'Inspected the owner-designated current revision in this synthetic fixture; no claim about live state.',
    observations:['The existing document has a supported process but its next action is ambiguous.'],receipt:'receipts/baseline.json',
  }],preserve:mode==='IMPROVE'?[{rule:'Keep the supported process and its source citations.',source_id:'current-work'}]:[],
  changes:mode==='IMPROVE'?[{problem:'The next action is ambiguous.',source_ids:['current-work'],proposed_change:'State the responsible role and next action.',expected_effect:'A reader can identify the next step.',verification:'Compare the next-action instruction and retained citations against the baseline.'}]:[],
  comparison:{method:'Inspect the same process and next-action criteria before and after.',pass_condition:'All supported citations retained and every next action names its responsible role.',unmeasured:['Reader completion rate and business impact were not measured.'],...(artifacts.length?{results:artifacts.map(artifact=>({criterion:'Preserve supported process and clarify the next action.',baseline_observation:'The process has citations; the next action has no owner.',result_observation:'Citations retained and the next action names a role.',status:'PASS',receipt:'receipts/comparison.json',artifact_sha256:artifact.sha256}))}:{})}};
}
