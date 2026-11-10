import { craftRubric, familyOf, gatesFor, DELIVERABLE_KINDS } from './grounding.mjs';

/**
 * The standard criteria for every team job. The job leads by a clear margin, 30 of 100, as it does in every craft
 * rubric. The rows about what the client receives carry the rest. The two rows about how the team worked (range and
 * the recorded decision) weigh 5 each: a blind judge never sees them, and in the 10 Nov 2026 blind test they scored
 * well on work that lost on the job and on clarity. The ids and weights are fixed by contracts.mjs (STANDARD_WEIGHTS).
 */
export const STANDARD_CRITERIA = Object.freeze([
  { id: 'job', weight: 30, text: 'Does the job for the buyer or the decision: every acceptance test on the spec sheet passes, within the original request and its scope, and required existing behaviour is kept.' },
  { id: 'usable', weight: 15, text: 'Usable today: the requested native artifact, complete for its format, with observed task-appropriate checks; where something is sold it is live, in stock and at the stated price; no placeholder blocks use.' },
  { id: 'truth', weight: 15, text: 'Every fact a buyer or the client will read traces to a dated source; unsourced claims were removed, not flagged; what remains unknown is stated.' },
  { id: 'insight', weight: 10, text: 'Own material: at least one idea, proof or angle came from this business\'s real material and would not appear in a generic answer.' },
  { id: 'fit', weight: 10, text: 'Fits the actual project or brand system, purpose, audience, structure, behaviour, evidence and hard constraints; matching tokens alone is insufficient.' },
  { id: 'clear', weight: 10, text: 'The work comes first and the next action is clear on one reading; nothing internal (process notes, agent or file names) reaches the client.' },
  { id: 'range', weight: 5, text: 'Explores substantively different mechanisms, evidence or structures where useful, while preserving agreed invariants and intentional controlled variants.' },
  { id: 'reasoned', weight: 5, text: 'Decides: one recommendation that follows from the evidence, the runner-up in one line, and the strongest dissent on record. No menu of options is handed over.' },
]);
/** Craft must reach this weighted share on its own; a strong standard score cannot carry weak craft. */
export const CRAFT_PASS = 0.7;
/** No craft criterion may score below this (of 10): weak brand fidelity cannot hide behind strong clarity. */
export const CRAFT_FLOOR = 5;
/**
 * @param {any} card
 * @param {any[]} [items]
 * @param {{kind?: string}} [options] kind: the job's deliverable_kind. When set, the rubric adds the craft criteria for
 *   that family (job-first: "does the job" carries the largest weight, then fidelity, own material and the rest) and
 *   its pass/fail gates (acceptance tests, sourced claims, the buyer can act, format complete). Legacy jobs replay
 *   without it.
 */
export function assembleRubric(card, items = [], { kind } = {}) {
  const craft = DELIVERABLE_KINDS.includes(kind) ? { deliverable_kind: kind, family: familyOf(kind), criteria: craftRubric(kind), gates: gatesFor(kind), pass: CRAFT_PASS, floor: CRAFT_FLOOR } : null;
  return { schema: 'ai-blocks-rubric/1', standard: STANDARD_CRITERIA.map(c => ({ ...c, ...(c.id === 'range' && card?.dials?.variety_mix?.preset === 'focused' ? { text: 'Tests the agreed variable within the chosen method while preserving all controlled dimensions.' } : {}) })), job_specific: (card?.acceptance ?? []).map(c => ({ ...c })), item_checks: items.flatMap(i => (i.checks ?? []).map(check => ({ slug: i.slug, check: typeof check === 'string' ? check : check.text ?? check.name ?? JSON.stringify(check) }))), pass: { overall: 0.75, critical_must_pass: true }, ...(craft ? { craft } : {}) };
}
const inRange = value => Number.isFinite(value) && value >= 0 && value <= 10;
export function scoreReview(review, rubric) {
  const craft = rubric.craft;
  const scored = (review?.items ?? []).map(item => {
    const all = rubric.standard.every(c => inRange(item.scores?.[c.id]));
    const score = all ? rubric.standard.reduce((sum, c) => sum + item.scores[c.id] / 10 * c.weight, 0) / 100 : null;
    if (!craft) return { slot_id: item.slot_id, score, pass: all && score >= rubric.pass.overall && item.verdict === 'PASS' };
    const craftAll = craft.criteria.every(c => inRange(item.craft_scores?.[c.id]));
    const craftScore = craftAll ? craft.criteria.reduce((sum, c) => sum + item.craft_scores[c.id] / 10 * c.weight, 0) / 100 : null;
    // Gates are pass/fail and never averaged away: a missing, NOT_RUN or FAIL gate fails the item.
    const failedGates = craft.gates.filter(g => !(item.gates ?? []).some(x => x?.id === g.id && x.status === 'PASS')).map(g => g.id);
    return { slot_id: item.slot_id, score, craft_score: craftScore, failed_gates: failedGates, pass: all && score >= rubric.pass.overall && craftAll && craftScore >= craft.pass && craft.criteria.every(c => item.craft_scores[c.id] >= (craft.floor ?? 0)) && !failedGates.length && item.verdict === 'PASS' };
  });
  return { assurance: 'MODEL_REVIEW_NOT_OWNER_ACCEPTANCE', owner_acceptance: 'NOT_RECORDED', business_outcomes: 'NOT_MEASURED', items: scored, pass: scored.length > 0 && scored.every(i => i.pass) && review?.set_checks?.count_met === true && review?.set_checks?.variety_contract === 'PASS' && review?.set_checks?.decision_record === 'PASS' };
}
