export const STANDARD_CRITERIA = Object.freeze([
  { id: 'job', weight: 20, text: 'Meets the original request and its current scope; preserves required existing behaviour and context.' },
  { id: 'usable', weight: 15, text: 'Provides the requested native artifact with observed task-appropriate checks; unresolved blockers remain explicit.' },
  { id: 'range', weight: 15, text: 'Explores substantively different mechanisms, evidence or structures where useful, while preserving agreed invariants and intentional controlled variants.' },
  { id: 'truth', weight: 15, text: 'Traces claims to sources and states what remains unknown.' },
  { id: 'reasoned', weight: 10, text: 'Records the choice, alternatives and strongest dissent.' },
  { id: 'insight', weight: 10, text: 'Offers useful insight specific to this job.' },
  { id: 'fit', weight: 10, text: 'Fits the actual project or brand system, purpose, audience, structure, behaviour, evidence and hard constraints; matching tokens alone is insufficient.' },
  { id: 'clear', weight: 5, text: 'Makes the next action clear.' },
]);
export function assembleRubric(card, items = []) {
  return { schema: 'ai-blocks-rubric/1', standard: STANDARD_CRITERIA.map(c => ({ ...c, ...(c.id === 'range' && card?.dials?.variety_mix?.preset === 'focused' ? { text: 'Tests the agreed variable within the chosen method while preserving all controlled dimensions.' } : {}) })), job_specific: (card?.acceptance ?? []).map(c => ({ ...c })), item_checks: items.flatMap(i => (i.checks ?? []).map(check => ({ slug: i.slug, check: typeof check === 'string' ? check : check.text ?? check.name ?? JSON.stringify(check) }))), pass: { overall: 0.75, critical_must_pass: true } };
}
export function scoreReview(review, rubric) {
  const scored = (review?.items ?? []).map(item => {
    const all = rubric.standard.every(c => Number.isFinite(item.scores?.[c.id]) && item.scores[c.id] >= 0 && item.scores[c.id] <= 10);
    const score = all ? rubric.standard.reduce((sum, c) => sum + item.scores[c.id] / 10 * c.weight, 0) / 100 : null;
    return { slot_id: item.slot_id, score, pass: all && score >= rubric.pass.overall && item.verdict === 'PASS' };
  });
  return { assurance: 'MODEL_REVIEW_NOT_OWNER_ACCEPTANCE', owner_acceptance: 'NOT_RECORDED', business_outcomes: 'NOT_MEASURED', items: scored, pass: scored.length > 0 && scored.every(i => i.pass) && review?.set_checks?.count_met === true && review?.set_checks?.variety_contract === 'PASS' && review?.set_checks?.decision_record === 'PASS' };
}
