import { craftRubric, familyOf, gatesFor, DELIVERABLE_KINDS } from './grounding.mjs';

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
/** Craft must reach this weighted share on its own; a strong standard score cannot carry weak craft. */
export const CRAFT_PASS = 0.7;
/** No craft criterion may score below this (of 10): weak brand fidelity cannot hide behind strong clarity. */
export const CRAFT_FLOOR = 5;
/**
 * @param {any} card
 * @param {any[]} [items]
 * @param {{kind?: string}} [options] kind: the job's deliverable_kind. When set, the rubric adds the craft criteria for
 *   that family (DESIGN weights: brand fidelity, distinctiveness against the named defaults, launchability for web pages)
 *   and its pass/fail gates. Legacy jobs replay without it.
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
