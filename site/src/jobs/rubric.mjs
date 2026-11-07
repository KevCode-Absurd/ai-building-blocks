export const STANDARD_CRITERIA = Object.freeze([
  { id: 'job', weight: 20, text: 'Solves the real job and meets the request.' },
  { id: 'usable', weight: 15, text: 'Can be used as delivered.' },
  { id: 'range', weight: 15, text: 'Uses distinct approaches in the agreed mix. Brand fit means shared voice and tokens, not one format.' },
  { id: 'truth', weight: 15, text: 'Traces claims to sources and states what remains unknown.' },
  { id: 'reasoned', weight: 10, text: 'Records the choice, alternatives and strongest dissent.' },
  { id: 'insight', weight: 10, text: 'Offers useful insight specific to this job.' },
  { id: 'fit', weight: 10, text: 'Meets the brand rules and hard constraints.' },
  { id: 'clear', weight: 5, text: 'Makes the next action clear.' },
]);
export function assembleRubric(card, items = []) {
  return { schema: 'ai-blocks-rubric/1', standard: STANDARD_CRITERIA.map(c => ({ ...c, ...(c.id === 'range' && card?.dials?.variety_mix?.preset === 'focused' ? { text: 'Varies angle, audience and hook within the chosen family.' } : {}) })), job_specific: (card?.acceptance ?? []).map(c => ({ ...c })), item_checks: items.flatMap(i => (i.checks ?? []).map(check => ({ slug: i.slug, check: typeof check === 'string' ? check : check.text ?? check.name ?? JSON.stringify(check) }))), pass: { overall: 0.75, critical_must_pass: true } };
}
export function scoreReview(review, rubric) {
  const scored = (review?.items ?? []).map(item => {
    const all = rubric.standard.every(c => Number.isFinite(item.scores?.[c.id]) && item.scores[c.id] >= 0 && item.scores[c.id] <= 10);
    const score = all ? rubric.standard.reduce((sum, c) => sum + item.scores[c.id] / 10 * c.weight, 0) / 100 : null;
    return { slot_id: item.slot_id, score, pass: all && score >= rubric.pass.overall && item.verdict === 'PASS' };
  });
  return { items: scored, pass: scored.length > 0 && scored.every(i => i.pass) && review?.set_checks?.count_met === true && review?.set_checks?.variety_contract === 'PASS' && review?.set_checks?.decision_record === 'PASS' };
}
