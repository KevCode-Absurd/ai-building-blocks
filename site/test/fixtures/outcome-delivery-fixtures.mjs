// Synthetic contracts only, not client results.
import { directScope, diagnosticScope } from './request-scope-fixtures.mjs';
export function outcomeScope(diagnostic = false) {
  const scope = diagnostic ? diagnosticScope() : directScope();
  scope.work.push({ ...structuredClone(scope.work[0]), id: 'other-fix', title: 'Unselected independent improvement', depends_on: ['audit'] });
  const recommendation = (id, work_id, rank) => ({
    id, title: 'Implement ' + id, rank, finding_ids: diagnostic ? ['activation'] : [], work_ids: [work_id],
    reason: 'Act on the accepted scoped evidence.', expected_effect: 'Intended improvement; no measured uplift yet.', tradeoffs: 'Preserve correctness and operating limits.',
    measurement: { metric: 'Successful activation', comparison: 'Accepted pre-change baseline versus the verified changed path.', window: 'After sufficient comparable observations; duration unresolved.', decision_rule: 'Accept only when the required checks and agreed guardrails hold.', guardrails: ['No regression in correctness.'], limitations: 'No causal business outcome is established by a local patch.' },
    fallback: { when: 'Repository write access is missing', deliverable: 'A checked patch file', next_step: 'Our next orchestrator applies it after scoped repository access is available.' }
  });
  scope.delivery = {
    before: 'The requested path does not meet its intended result.', after: 'The corrected path passes checks without damaging the guardrails.', metric: 'The task-specific outcome, with its baseline and definition retained.', guardrails: ['Keep live publishing separate.'],
    evidence_reviews: scope.sources.map(s => ({ source_id: s.id, status: 'CHECKED', checks: ['Read the synthetic fixture and checked its scope.'], limitation: 'Synthetic evidence, not a real client result.' })),
    data_requests: [], recommendations: [recommendation('R1', 'fix', 1), recommendation('R2', 'other-fix', 2)]
  };
  return scope;
}
