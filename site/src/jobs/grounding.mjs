// The work method as data: spec sheet, ground, taste, real candidates, build, client's-eye check, hand-over.
// Deterministic and model-free. One source for prepare_job_context, the start_job questions,
// the production gate, the craft rubric and the get_skill preamble. Nothing here stores client data:
// capture files live in the user's project under context/.
// The shared lists (WORD_BUDGETS, PROVEN_LEVERS, CANDIDATE_AXES, CANDIDATES, CRAFT_METHODS, COMPLETENESS, CONTEXT_LEVELS,
// CONTEXT_NEED and the craft weights) are also in marketplace/src/modules/packs/families.ts; test/jobs-grounding.test.mjs fails
// when the two copies differ.

import { intakeQuestions } from './intake-questions.mjs';
import { brandFileStep } from './brand-file.mjs';
import { qualityEngineContext } from './quality-engine.mjs';

const list = value => Array.isArray(value) ? value : [];
const text = value => typeof value === 'string' && value.trim().length > 0;
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const HASH = /^[a-f0-9]{64}$/;

export const DELIVERABLE_KINDS = Object.freeze(['web_page', 'ad_creative', 'copy', 'email', 'audit', 'analysis', 'strategy', 'plan', 'code', 'ops_doc', 'other']);
export const MODES = Object.freeze(['patch', 'extend', 'new']);
export const GROUNDING_POLICY = Object.freeze({ version: 1 });
const FAMILY_BY_KIND = Object.freeze({ web_page: 'web_page', ad_creative: 'ad_creative', copy: 'copy_email', email: 'copy_email', audit: 'audit_analysis', analysis: 'audit_analysis', strategy: 'strategy_plan', plan: 'strategy_plan', code: 'code_ops_other', ops_doc: 'code_ops_other', other: 'code_ops_other' });
export const familyOf = kind => FAMILY_BY_KIND[kind] ?? 'code_ops_other';
/** Kinds whose output is judged against the client's brand: they need the live capture and a taste brief. */
export const BRAND_KINDS = Object.freeze(['web_page', 'ad_creative', 'copy', 'email']);
export const DATA_KINDS = Object.freeze(['audit', 'analysis']);

/** The method in the order a host should run it. The ids are stable; the 10 Nov 2026 blind test rewrote what each step asks. */
export const GJP_STEPS = Object.freeze([
  { id: 'frame', name: 'Spec sheet', do: 'Write the one-screen spec sheet: who must do what after seeing this, the deliverables with counts in the client\'s words, 5 to 7 acceptance tests, the decisions you must take, your assumptions, the mode (patch what exists by default) and the brand context this job needs.' },
  { id: 'ground', name: 'Ground what the job needs', do: 'Capture only what the acceptance tests depend on: the live site into context/brand-dna.json and context/screenshots/, or the real account or data for audits. Every fact gets a source and a date. Check the thing being sold is live, in stock, at the stated price and at the link you will use.' },
  { id: 'taste', name: 'Taste and tools', do: 'For work a buyer sees, write context/taste-brief.md: brand codes to keep, 2 admired references and 1 to avoid, and the named defaults to avoid. When you were given a toolbox, pick from it at your own discretion and open only what you pick.' },
  { id: 'diverge', name: 'Real candidates, someone else chooses', do: 'Make about 3 candidates of the part that decides the outcome, as real work, differing on at least two of promise, proof, structure, buyer moment, offer and visual world. A fresh reviewer answers each acceptance test per candidate, picks one and names what to take from the others. One extra round at most.' },
  { id: 'build', name: 'Build to the craft floor', do: 'Give true facts a new framing and add no new facts. Every piece earns its place commercially. Decide; never hand over a menu. Working figures only for planning numbers the client will tune, with the sum shown. Finish the format\'s completeness list.' },
  { id: 'check', name: 'Client\'s-eye check', do: 'A fresh reviewer gets only the brief, the deliverable and the captured facts. They answer each acceptance test with the proving line, mark every claim sourced or not, and name the weakest piece, what the client would have to ask, and what can be cut. Remove unsourced claims, fix, cut, stop.' },
  { id: 'record', name: 'Hand over', do: 'The work first, opened by 3 to 5 lines: what this is, the main decision and why, what to check before use. Nothing internal reaches the client. Keep working notes in DECISIONS.md.' },
]);
const AUDIT_STEP_OVERRIDES = Object.freeze({
  ground: 'Pull the real account or data snapshot through the client connector at read level into context/ (for example context/data-snapshot.json), with its source and date. Pull only what the acceptance tests depend on.',
  taste: 'Write the decision this informs, what changed recently and what normal looks like for the key metric. When you were given a toolbox, pick from it at your own discretion and open only what you pick.',
  diverge: 'Write three competing explanations of the main problem, each with the evidence for it and what would rule it out. A fresh reviewer picks the one the evidence supports. A fixed checklist score is not a diagnosis.',
  build: 'Diagnose this account or data specifically, then rank actions by expected impact. Recommend the first fix; never hand over a menu.',
});

/**
 * Craft rubrics. Weights sum to 100 per family; gates are pass/fail and never averaged away. In every family the job
 * carries the largest weight: blind judges score "does it do the job for the buyer or the decision" first, and the old
 * weights put brand or voice fidelity above it. "Own material" is the scoreable stand-in for "better than a plain
 * model would produce". Truth is a gate, not a score. Criterion names and weights match CRAFT_WEIGHTS in families.ts.
 */
const OWN_MATERIAL = Object.freeze({ id: 'own_material', criterion: 'Own material', weight: 10, test: 'At least one idea, proof or angle came from this business\'s real material and would not appear in a generic answer.' });
export const CRAFT_RUBRICS = Object.freeze({
  web_page: [
    { id: 'job_conversion', criterion: 'Does the job for the buyer', weight: 30, test: 'The buyer the page is for gets a reason to act and one clear action they can take today, with an argument they can follow. Every acceptance test on the spec sheet passes.' },
    { id: 'brand_fidelity', criterion: 'Brand fidelity', weight: 20, test: 'Recognisably this brand: captured fonts, colour proportions, components, nav, footer and voice samples are used, each choice citing context/brand-dna.json.' },
    { id: 'launchability', criterion: 'Launchability', weight: 15, test: 'Ships as working source on the client stack: loads the brand fonts, works at 390 px and 1440 px, primary action works, no fillable placeholders.' },
    { ...OWN_MATERIAL },
    { id: 'specificity', criterion: 'Specificity', weight: 10, test: 'A competitor could not publish it unchanged: real products, prices, offers and proof from capture.' },
    { id: 'clarity', criterion: 'Clarity', weight: 10, test: 'A first-time visitor understands the offer and next step in one screen.' },
    { id: 'distinctiveness', criterion: 'Distinctiveness vs defaults', weight: 5, test: 'Avoids every default named in the taste brief, or departs from it on purpose with a reason.' },
  ],
  ad_creative: [
    { id: 'job_buyer', criterion: 'Does the job for the buyer', weight: 30, test: 'Each ad gives the named buyer a reason to act: the brand, product and price or offer are clear to someone who has never heard of them, and what is advertised can be bought today. Every acceptance test on the spec sheet passes.' },
    { id: 'range', criterion: 'Range across named axes', weight: 15, test: 'Concepts differ on at least two of promise, proof, structure, buyer moment, offer and visual world, and none uses a named ad default (one look for all, a reused hook, product on a gradient).' },
    { id: 'brand_fidelity', criterion: 'Brand fidelity', weight: 15, test: 'Recognisably this brand: captured colours, type, product and voice.' },
    { id: 'strategic_idea', criterion: 'Strategic idea', weight: 10, test: 'Each concept has an idea about the buyer, not just a look.' },
    { id: 'hook', criterion: 'Hook and thumb-stop', weight: 10, test: 'The first second earns attention for this buyer on this placement.' },
    { id: 'platform_fit', criterion: 'Platform fit', weight: 10, test: 'Native to the placement, its safe areas and specs; a designer can build it without asking anything.' },
    { ...OWN_MATERIAL },
  ],
  copy_email: [
    { id: 'job_done', criterion: 'Does the job for the buyer', weight: 30, test: 'The named reader gets a reason to act and one clear next step; in an email series every email shows a product and makes one ask. Every acceptance test on the spec sheet passes.' },
    { id: 'brand_fidelity', criterion: 'Voice fidelity', weight: 20, test: 'Sounds like the captured voice samples, not a generic brand.' },
    { id: 'specificity', criterion: 'Specificity', weight: 15, test: 'A competitor could not send or publish it unchanged.' },
    { id: 'clarity', criterion: 'Clarity', weight: 15, test: 'One reading is enough to know what to do next.' },
    { ...OWN_MATERIAL },
    { id: 'distinctiveness', criterion: 'Distinctiveness vs defaults', weight: 10, test: 'None of the named copy defaults (unlock, elevate, seamless, rule-of-three lists, fake urgency, generic benefits) unless chosen on purpose.' },
  ],
  audit_analysis: [
    { id: 'job_decision', criterion: 'Does the job for the decision', weight: 30, test: 'The owner can decide and act today: it explains why this metric moved for this client, not a checklist score, and names the first fix with its expected effect. Every acceptance test on the spec sheet passes.' },
    { id: 'evidence', criterion: 'Evidence quality', weight: 20, test: 'Each finding cites the pulled data with its date range.' },
    { id: 'prioritised_actions', criterion: 'Prioritised actions with expected impact', weight: 15, test: 'Actions are ranked, each with its expected effect and how to check it.' },
    { id: 'correctness', criterion: 'Correctness', weight: 15, test: 'Numbers and calculations are right; no invented figures.' },
    { ...OWN_MATERIAL, test: 'At least one finding came from this account\'s own data and would not appear in a generic audit.' },
    { id: 'clarity', criterion: 'Clarity', weight: 10, test: 'The owner knows the first thing to do.' },
  ],
  strategy_plan: [
    { id: 'job_decision', criterion: 'Does the job for the decision', weight: 30, test: 'One recommendation the client can approve today: it follows from the evidence, the runner-up gets one line, and no menu of options is handed over. Every acceptance test on the spec sheet passes.' },
    { id: 'actionability', criterion: 'Actionability', weight: 25, test: 'Next steps have owners, dates and measures; totals add up with the sum shown; no placeholder blocks the plan.' },
    { id: 'grounded', criterion: 'Grounded in this business', weight: 20, test: 'Uses this business\'s real customers, numbers and constraints.' },
    { id: 'clarity', criterion: 'Clarity', weight: 15, test: 'Readable in one pass.' },
    { ...OWN_MATERIAL },
  ],
  code_ops_other: [
    { id: 'job_done', criterion: 'Does the job', weight: 30, test: 'Does what was asked on the real system or for the real team. Every acceptance test on the spec sheet passes.' },
    { id: 'correctness', criterion: 'Correctness', weight: 25, test: 'Runs or reads correctly; checks pass.' },
    { id: 'fits_system', criterion: 'Fits the existing system', weight: 20, test: 'Follows the existing code, tools and conventions.' },
    { id: 'clarity', criterion: 'Clarity', weight: 15, test: 'Someone else can use or maintain it.' },
    { ...OWN_MATERIAL, test: 'At least one choice came from this team\'s real code, tools or way of working, not a generic template.' },
  ],
});
/**
 * Gates for every job. The 10 Nov 2026 blind test: work that did the job better lost on truth because flagged,
 * unsourced claims stayed in the copy. So an unsourced claim is removed, and the acceptance tests are a gate.
 */
export const COMMON_GATES = Object.freeze([
  { id: 'acceptance_tests_pass', gate: 'Every acceptance test on the spec sheet passes, each with the line that proves it, answered by a reviewer who did not make the work.' },
  { id: 'facts_trace_to_source', gate: 'Every fact a buyer or the client will read (prices, counts, ratings, policies, names, delivery times, quotes, product properties) traces to a dated captured source. An unsourced claim is cut or rewritten to what the source says; it is never flagged and left in.' },
  { id: 'no_invented_numbers', gate: 'No invented numbers. A working figure is allowed only for planning numbers the client will tune (budgets, targets, test sizes), with the sum shown; never in anything a buyer reads, and never as a revenue forecast.' },
  { id: 'access_respected', gate: 'Access respected: read, draft, or publish within the agreed limits.' },
  { id: 'no_fillable_placeholders', gate: 'No placeholder that capture could have filled, and none that blocks the client from using the work.' },
  { id: 'hand_over_budget', gate: 'Hand-over fits: the work first, opened by 3 to 5 lines (what this is, the main decision and why, what to check before use), inside its word budget and at most 1.3 times the words of a plain one-pass answer (never over 1.6 unless the brief asks). One recommendation, never a menu. No blanks or placeholders: what needs sign-off is a complete proposal marked "Proposal: confirm before use". Nothing internal: no process sections, lever checklists, agent names, file names, access levels or method words. Supporting detail goes in an appendix inside the deliverable, never in a file the client does not have, such as DECISIONS.md or knowledge.md.' },
]);
/**
 * Word budgets by deliverable kind. The 9 Nov 2026 blind test found grounded work scored lower on clarity than plain
 * model output because it ran long. The 10 Nov rerun found a tight plan budget cut detail the client needed and sent
 * readers to working files they never get, so plans keep their specifics and every deliverable stands on its own.
 */
export const WORD_BUDGETS = Object.freeze({
  web_page: 'Hand-over note up to 150 words. Page copy no longer than the live page plus 20%, unless the change says why.',
  ad_creative: 'Up to 150 words per concept. The hook fits the placement\'s visible text (about 125 characters on Meta).',
  copy: 'The length the spec sheet names; with none, no longer than the copy it replaces.',
  email: 'Body up to 200 words per email, unless the brand\'s own past emails run longer.',
  audit: 'The top 3 fixes on the first screen, and up to 10,000 words in all. Evidence tables go in an appendix.',
  analysis: 'The answer and how sure it is on the first screen, and up to 10,000 words in all. Working goes in an appendix.',
  strategy: 'A summary up to 250 words first, and up to 10,000 words in all. Keep the specifics someone needs to act: concepts, angles, audiences, numbers.',
  plan: 'A summary up to 250 words first, and up to 10,000 words in all. Keep the specifics someone needs to act: concepts, angles, audiences, numbers. Schedules go in tables.',
  code: 'A hand-over note up to 150 words: what changed, how to run it, what to check.',
  ops_doc: 'Steps a new person can follow in one read, none longer than 40 words.',
  other: 'A summary up to 150 words first.',
});
/**
 * Proven conversion levers by kind. Before building, mark each one present, missing or not applicable on the live
 * asset; add the missing ones from real data. The same blind test found plain output sometimes added a strong lever
 * (star ratings) that grounded work left out.
 */
export const PROVEN_LEVERS = Object.freeze({
  web_page: ['reviews and ratings near the decision', 'price, saving and payment options where people choose', 'delivery date and shipping cost', 'returns and guarantee terms', 'stock, size or fit help', 'real customer proof and trust marks', 'one clear primary action on the first mobile screen'],
  ad_creative: ['a hook in the first line and the first second', 'real proof: reviews, numbers or press', 'the offer or price, when it helps', 'the product in use', 'one clear call to action'],
  copy: ['a specific promise in the first line', 'real proof next to each claim', 'the buyer\'s main objection, answered', 'one clear next step'],
  email: ['a subject line that gives a reason to open', 'one main call to action with a direct link', 'real proof: reviews or numbers', 'a reason to buy now that is true (offer, guarantee or best-sellers)', 'footer, unsubscribe and an exit rule for buyers'],
  audit: ['the proven levers for the page, ad or email being audited (the same lists as those jobs), each marked present or missing'],
});
export const LEVER_GATE = Object.freeze({ id: 'proven_levers_checked', gate: 'Proven levers checked: each lever for this kind of work is marked present, missing or not applicable on the live asset, and each missing one is added from real data or skipped with a reason. The marks stay in the working notes, not in the deliverable.' });
export const leversFor = kind => [...(PROVEN_LEVERS[kind] ?? [])];

/** What candidates must differ on: at least two of these. A new colour, crop or wording is not a candidate. */
export const CANDIDATE_AXES = Object.freeze(['promise', 'proof', 'structure', 'buyer moment', 'offer', 'visual world']);
/**
 * Real candidates by kind: the part that decides the outcome, made as real work before the build. The 10 Nov 2026
 * blind test found described directions came out the same as a plain model's; made candidates did not.
 */
export const CANDIDATES = Object.freeze({
  web_page: 'Three first screens, made in full: headline, proof and the one action.',
  ad_creative: 'At least 9 one-line concepts across different promises, proofs and formats, then the strongest written up in full.',
  copy: 'Three openings, each written in full: the headline and the first paragraph.',
  email: 'Three series arcs, each with email 1 written in full. For one email: three subject lines, each with its opening.',
  audit: 'Three competing explanations of the main problem, each with the evidence for it and what would rule it out.',
  analysis: 'Three competing explanations, each tested against the data, with what would rule it out.',
  strategy: 'Two differently shaped one-page plans, each with what it costs and what it wins.',
  plan: 'Two differently shaped one-page plans, each with its totals.',
  code: 'When the design is open, two approaches taken far enough to compare: the interface and the trade-off.',
  ops_doc: 'When the process is open, two outlines of the steps, with what each costs the team.',
  other: 'When the approach is open, two short versions of the part that decides the outcome.',
});
export const candidatesFor = kind => CANDIDATES[kind] ?? CANDIDATES.other;
/**
 * The craft skill for a step, by its plain name: [slug, name]. Every agent's toolbox carries these, so the method names
 * them and never sends anyone to search. The address is where the same skill lives in the library.
 */
export const SKILL_ADDRESS = 'https://useaiblocks.com/skills/';
export const CRAFT_METHODS = Object.freeze({
  candidates: Object.freeze({
    web_page: ['make-three-first-screens', 'Make three first screens'],
    ad_creative: ['make-ad-concept-spread', 'Make an ad concept spread'],
    email: ['three-series-arcs', 'Three series arcs'],
    strategy: ['two-plan-shapes', 'Two plan shapes'],
    plan: ['two-plan-shapes', 'Two plan shapes'],
  }),
  look: ['make-design-directions', 'Make three design directions'],
  choose: ['outside-chooser', 'Outside chooser'],
  check: ['clients-eye-check', 'Client\'s-eye check'],
  truth: ['claim-source-trace', 'Claim source trace'],
  buyer: ['buyer-can-act-check', 'Buyer can act check'],
});
/** A craft skill as the method names it: its plain name, where the toolbox copy came from, and no instruction to search. */
export const craftMethod = row => row ? { name: row[1], slug: row[0], address: SKILL_ADDRESS + row[0], where: 'Your toolbox has it.' } : null;
/** The craft skill that makes this kind's candidates, or null when the kind has none. */
export const candidateMethod = kind => craftMethod(CRAFT_METHODS.candidates[kind]);
/**
 * Format completeness by kind: what the maker ticks before hand-over. The same blind test marked down ads with no
 * description or price, emails with no product, and plans whose totals did not add up.
 */
export const COMPLETENESS = Object.freeze({
  web_page: ['one primary action', 'proof beside the claim it supports', 'works on a 390 px phone screen', 'loads fast, with sized images'],
  ad_creative: ['every field the platform needs, including the description', 'character counts inside the platform limits', 'text and logo inside the placement\'s safe areas', 'the brand and the price named for a cold audience', 'the landing URL'],
  email: ['a subject line', 'preview text', 'one product and one ask in every email', 'working links', 'an exit rule', 'merge tags that match the email tool'],
  plan: ['totals that add up', 'dated steps', 'an owner for each step', 'cut, keep and scale rules', 'break-even shown'],
});
export const completenessFor = kind => [...(COMPLETENESS[kind] ?? [])];
/** How much brand context a job takes from the brand file. A job takes its slice, never the whole file. */
export const CONTEXT_LEVELS = Object.freeze({
  none: 'No brand context: work from the system, files or data.',
  facts: 'Facts only: the offer, prices, customers and numbers, each with its source and date.',
  voice: 'Facts and voice: the facts, plus 5 to 10 real lines in the brand\'s own words.',
  look: 'Facts and look: the facts, plus colours, type, components and screenshots.',
  full: 'Full: facts, voice and look.',
});
/** The default slice by kind. Strategy, plans, code and operations work never demand a brand capture. */
export const CONTEXT_NEED = Object.freeze({ web_page: 'full', ad_creative: 'full', copy: 'voice', email: 'voice', audit: 'facts', analysis: 'none', strategy: 'facts', plan: 'facts', code: 'none', ops_doc: 'none', other: 'none' });
/** The slice a job of this kind takes. `brand_file` is false when the job needs no brand context at all. */
export function contextNeed(kind) {
  const level = CONTEXT_NEED[kind] ?? 'none';
  return { level, take: CONTEXT_LEVELS[level], brand_file: level !== 'none' };
}

export const BUYER_GATE = Object.freeze({ id: 'buyer_can_act', gate: 'Where something is sold, the buyer can act today: it is live, in stock in the sizes or variants that matter, at the stated price, at the link used.' });
export const completenessGate = kind => ({ id: 'format_complete', gate: `Format complete: ${completenessFor(kind).join('; ')}.` });
export const WEB_GATES = Object.freeze([
  { id: 'nav_footer_kept', gate: 'The existing nav and footer are kept, unless the change is on purpose.' },
  { id: 'brand_fonts_loaded', gate: 'Brand fonts are loaded.' },
  { id: 'responsive_390_1440', gate: 'The page works at 390 px and 1440 px.' },
  { id: 'primary_action_works', gate: 'The primary action works.' },
  { id: 'brand_fidelity_lint', gate: 'check-brand-fidelity.mjs (or its manual checklist) passes against context/brand-dna.json.' },
]);
export const gatesFor = kind => [...COMMON_GATES, ...(BRAND_KINDS.includes(kind) ? [BUYER_GATE] : []), ...(PROVEN_LEVERS[kind] ? [LEVER_GATE] : []), ...(COMPLETENESS[kind] ? [completenessGate(kind)] : []), ...(familyOf(kind) === 'web_page' ? WEB_GATES : [])].map(g => ({ ...g }));
export const craftRubric = kind => CRAFT_RUBRICS[familyOf(kind)].map(c => ({ ...c }));

/**
 * Suggested acceptance tests by family: the questions the client would ask of the finished work. Each family has at
 * least two on the commercial job, one on readiness, one on truth and one on clarity. The maker rewrites them for the
 * job at hand and keeps 5 to 7.
 */
const TRUTH_TEST = 'Does every price, count, rating, policy, name and product claim match a dated source?';
export const ACCEPTANCE_TESTS = Object.freeze({
  web_page: [
    { type: 'job', test: 'Would the buyer this page is for understand the offer and want it within the first screen?' },
    { type: 'job', test: 'Does every section give a reason to take the one action, with proof where a buyer would doubt?' },
    { type: 'ready', test: 'Can the client publish this today on their own stack without asking anything?' },
    { type: 'truth', test: TRUTH_TEST },
    { type: 'clear', test: 'After five seconds, can a first-time visitor say what is sold and what to do next?' },
  ],
  ad_creative: [
    { type: 'job', test: 'Would the named buyer stop on each ad and know the brand, the product and the price or offer without clicking?' },
    { type: 'job', test: 'Does each ad make a different argument, so the set tests something real?' },
    { type: 'job', test: 'Is every product advertised live and in stock at its landing URL?' },
    { type: 'ready', test: 'Can a designer or media buyer make and launch each ad without asking anything?' },
    { type: 'truth', test: TRUTH_TEST },
    { type: 'clear', test: 'Is each ad one idea, readable in two seconds on a phone?' },
  ],
  copy: [
    { type: 'job', test: 'Does the first line give this reader a reason to keep reading?' },
    { type: 'job', test: 'Does it answer the main objection and lead to one next step?' },
    { type: 'ready', test: 'Can it be published as it stands, at the length asked for?' },
    { type: 'truth', test: TRUTH_TEST },
    { type: 'clear', test: 'Is one reading enough to know what to do next?' },
  ],
  email: [
    { type: 'job', test: 'Does every email show a product and give one reason to click?' },
    { type: 'job', test: 'Does each email do a different job in moving this reader to the goal?' },
    { type: 'ready', test: 'Can the client load these into their email tool today: subject, preview text, links, merge tags and exit rule?' },
    { type: 'truth', test: TRUTH_TEST },
    { type: 'clear', test: 'Is the one ask clear from the subject line and the first two lines?' },
  ],
  audit_analysis: [
    { type: 'job', test: 'Does it say why the number moved for this account, and rule out the next most likely cause?' },
    { type: 'job', test: 'Does it name the first fix, what it should move and how to check?' },
    { type: 'ready', test: 'Could the owner start the first fix today without asking anything?' },
    { type: 'truth', test: 'Can every figure be recomputed from the dated snapshot?' },
    { type: 'clear', test: 'Are the top three fixes, or the answer, on the first screen?' },
  ],
  strategy_plan: [
    { type: 'job', test: 'Does it make one recommendation the client can approve or reject today?' },
    { type: 'job', test: 'Do the numbers add up with the sum shown, and is break-even or the success measure stated?' },
    { type: 'ready', test: 'Does every step have an owner and a date, with no placeholder that blocks the plan?' },
    { type: 'truth', test: 'Does each claim about the business or market trace to a dated source, with planning figures marked as working figures?' },
    { type: 'clear', test: 'Can the decision and the first three moves be read on one screen?' },
  ],
  code_ops_other: [
    { type: 'job', test: 'Does it do what was asked, on the real system or for the real team?' },
    { type: 'job', test: 'Does everything that worked before still work?' },
    { type: 'ready', test: 'Can someone else run or follow it today from the hand-over alone?' },
    { type: 'truth', test: 'Was every run, test or rule it claims actually run, or checked against its source?' },
    { type: 'clear', test: 'Would a new person understand what changed and what to do next?' },
  ],
});
export const acceptanceTests = kind => (ACCEPTANCE_TESTS[kind] ?? ACCEPTANCE_TESTS[familyOf(kind)]).map((row, n) => ({ id: `t${n + 1}`, ...row }));
/** The decisions the maker takes without handing them back. One recommendation; the runner-up gets one line. */
const DECISIONS = Object.freeze({
  web_page: ['the one action the page asks for', 'which proof leads', 'what to cut from the live page'],
  ad_creative: ['which product or variant to advertise (in stock)', 'which promise leads the set', 'which placements'],
  copy: ['the promise in the first line', 'which proof to use', 'the one next step'],
  email: ['the arc of the series', 'the product in each email', 'the offer, inside the client\'s rules'],
  audit_analysis: ['the most likely cause', 'the first fix'],
  strategy_plan: ['the recommended option', 'how the budget or effort is split', 'the cut, keep and scale rules'],
  code_ops_other: ['the approach', 'what must not change'],
});
export const decisionsFor = kind => [...(DECISIONS[kind] ?? DECISIONS[familyOf(kind)])];
const NUMBER_WORDS = Object.freeze({ one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12 });
const COUNTED = '(?:ads?|creatives?|concepts?|emails?|pages?|posts?|headlines?|subject lines?|scripts?|carousels?|slides?|articles?|variants?|versions?|images?|videos?|documents?|templates?|reports?|plans?)';
/** The count the request names for its deliverable ("6 image ads", "a 5-email series"), else null. A guess the maker confirms. */
export function requestedCount(request = '') {
  const m = new RegExp(`\\b(\\d{1,3}|${Object.keys(NUMBER_WORDS).join('|')}|an?)[\\s-]+(?:[a-z-]+\\s+){0,2}?${COUNTED}\\b`, 'i').exec(String(request ?? ''));
  if (!m) return null;
  const word = m[1].toLowerCase();
  return /^\d+$/.test(word) ? Number(word) : NUMBER_WORDS[word] ?? 1;
}
/** The one-screen spec sheet, pre-filled from the request. Blank strings are for the maker to fill before any work. */
export function specSheet({ request = '', kind, mode, kindSource = 'declared' } = {}) {
  const need = contextNeed(kind), count = requestedCount(request);
  return {
    path: 'context/spec.md',
    fill: 'One screen. Fill every blank before you make anything. Decide what the client did not say and list it under assumptions.',
    job: { text: '', prompt: 'Who must do what after seeing this (buy, sign up, reply, approve a budget)? One sentence.' },
    deliverables: [{ kind, count, in_client_words: String(request).slice(0, 600), prompt: count === null ? 'State the exact count and format in the client\'s words.' : 'Confirm the count and format in the client\'s words.' }],
    acceptance_tests: acceptanceTests(kind),
    acceptance_rule: 'Keep 5 to 7. Rewrite each for this job. At least two on the commercial job, one on readiness, one on truth and one on clarity.',
    decisions: decisionsFor(kind),
    decision_rule: 'Take each decision yourself. One recommendation, with the runner-up in one line. Never hand back a menu.',
    assumptions: [`Mode: ${mode?.mode ?? 'patch'}. ${mode?.reason ?? ''}`.trim(), ...(kindSource === 'suggested' ? [`Kind of work: ${kind}, guessed from the request.`] : [])],
    context_needed: { ...need, levels: Object.keys(CONTEXT_LEVELS), rule: 'Take this slice of the brand file, or capture it, and no more. Raise the level only when an acceptance test depends on it.' },
  };
}

/** The AI-default list from the spec, embedded as a fallback for catalogue-items/general/ai-default-patterns/patterns.json. */
export const EMBEDDED_DEFAULT_PATTERNS = Object.freeze([
  ['web-template-stack', 'web', 'Centred hero, 3 benefit cards, "How it works in 3 steps", testimonials, FAQ, final CTA, regardless of category.', 'It is the average landing page; it ignores what this category and brand do.'],
  ['web-purple-gradient', 'web', 'Purple or blue gradients.', 'The stock SaaS look, not the client\'s colours.'],
  ['web-generic-font', 'web', 'Inter, Geist or system fonts replacing the brand font.', 'Swaps out one of the strongest brand codes.'],
  ['web-pill-buttons', 'web', 'Pill buttons where the brand uses square ones.', 'Component style drifts from the live site.'],
  ['web-emoji-icons', 'web', 'Emoji icons.', 'Reads as a quick template, not a crafted page.'],
  ['web-glassmorphism', 'web', 'Glassmorphism cards.', 'A trend effect with no link to the brand.'],
  ['web-empty-logo-row', 'web', '"Trusted by" logo rows with no logos.', 'Fake proof; a placeholder shaped like evidence.'],
  ['web-stock-hero', 'web', 'Generic stock-style hero images.', 'Could belong to any business.'],
  ['web-uniform-sections', 'web', 'Every section the same height.', 'No pacing; editorial and luxury brands rely on rhythm.'],
  ['web-fade-up-everything', 'web', 'Fade-up animation on every block.', 'Motion as decoration rather than meaning.'],
  ['web-rounded-cards', 'web', 'Rounded cards everywhere.', 'One component used for every idea.'],
  ['web-dropped-nav-footer', 'web', 'Dropping the client\'s nav and footer.', 'Breaks the site the page lives in.'],
  ['web-cream-premium', 'web', 'Cream backgrounds swapped in for "premium".', 'A shorthand for luxury that replaces the real palette.'],
  ['copy-banned-words', 'copy', '"Unlock", "Elevate", "Seamless", "Game-changer", "In today\'s fast-paced world".', 'The most common model phrases; readers spot them.'],
  ['copy-rule-of-three', 'copy', 'Rule-of-three lists everywhere.', 'A rhythm habit, not a choice.'],
  ['copy-headline-formula', 'copy', 'Headline formula cliches.', 'Fill-in-the-blank lines any brand could use.'],
  ['copy-fake-urgency', 'copy', 'Fake urgency.', 'Untrue pressure erodes trust.'],
  ['copy-generic-benefits', 'copy', 'Benefits that any competitor could claim.', 'Says nothing about this business.'],
  ['ads-one-look', 'ads', 'Every concept in one look or style.', 'Variety in labels, not substance.'],
  ['ads-reused-hook', 'ads', 'Hook formulas reused across all variants.', 'Variants that test nothing.'],
  ['ads-product-on-gradient', 'ads', 'Product-on-gradient images.', 'The default product shot; no idea in it.'],
  ['audit-fixed-checklist', 'audits', 'A fixed checklist score with no account-specific diagnosis of why this metric moved.', 'Every account gets the same report.'],
].map(([id, group, description, why]) => Object.freeze({ id, group, description, why })));
const GROUPS_BY_FAMILY = Object.freeze({ web_page: ['web', 'copy'], ad_creative: ['ads', 'copy'], copy_email: ['copy'], audit_analysis: ['audits'], strategy_plan: ['copy'], code_ops_other: [] });
const groupOf = value => {
  const v = String(value ?? '').toLowerCase();
  return /web|page|site|landing|design/.test(v) ? 'web' : /\bads?\b|advert|creative/.test(v) ? 'ads' : /copy|email|writing|voice/.test(v) ? 'copy' : /audit|analys|report/.test(v) ? 'audits' : null;
};
/** Accept W3's patterns.json leniently: an array, or { patterns: [...] }, or groups keyed by family. Unknown rows are dropped. */
export function normalizePatterns(raw) {
  let rows = Array.isArray(raw) ? raw : Array.isArray(raw?.patterns) ? raw.patterns : null;
  if (!rows && object(raw)) rows = Object.entries(raw).flatMap(([group, value]) => list(value).map(row => ({ group, ...row })));
  const out = [];
  for (const row of list(rows)) {
    if (!object(row)) continue;
    const id = String(row.id ?? '').trim(), description = [row.description, row.pattern, row.text, row.name, row.title].find(text);
    const groups = [row.group, row.family, row.families, row.area, row.surface, row.category, row.kind].flat().map(groupOf).filter(Boolean);
    if (!/^[a-z0-9][a-z0-9_-]{0,79}$/i.test(id) || !description || !groups.length) continue;
    const why = [row.why, row.why_default, row.why_it_reads_as_default, row.reason].find(text) ?? '';
    for (const group of new Set(groups)) out.push({ id, group, description: description.trim().slice(0, 400), why: why.trim().slice(0, 400) });
  }
  return out;
}
export function defaultsFor(kind, patterns) {
  const source = list(patterns).length ? patterns : EMBEDDED_DEFAULT_PATTERNS, groups = GROUPS_BY_FAMILY[familyOf(kind)];
  const seen = new Set();
  // The family's own group comes first (ads before copy for ad work).
  return groups.flatMap(group => source.filter(p => p.group === group && !seen.has(p.id) && seen.add(p.id))).map(p => ({ id: p.id, description: p.description, why: p.why }));
}

/** Where the capture and check scripts live. W3 publishes them as supporting files of these library skills. */
export const CAPTURE_TOOLS = Object.freeze([
  { file: 'capture-brand-dna.mjs', skill: 'brand-dna-capture', path: 'scripts/capture-brand-dna.mjs', use: 'First choice. Node + Playwright against the live site URL; writes context/brand-dna.json and context/screenshots/.' },
  { file: 'brand-dna-snippet.js', skill: 'brand-dna-capture', path: 'scripts/brand-dna-snippet.js', use: 'Second choice. Paste into any browser tool or devtools console on the live site; save its JSON as context/brand-dna.json.' },
  { file: 'check-brand-fidelity.mjs', skill: 'brand-fidelity-check', path: 'scripts/check-brand-fidelity.mjs', use: 'CHECK step for web pages: compares the built page with context/brand-dna.json.' },
  { file: 'brand-file.mjs', skill: 'brand-dna-capture', path: 'scripts/brand-file.mjs', use: 'GROUND step, before any capture: status --for <kind> says whether the client\'s brand file exists and what is stale; slice <level> --out context/facts.md takes only what the job needs; learn records what the client kept or killed.' },
  { file: 'compare-candidates.mjs', skill: 'make-three-first-screens', path: 'scripts/compare-candidates.mjs', use: 'CANDIDATES step, for work a buyer sees: puts 2 to 4 candidates (HTML, a URL, SVG or images) side by side under the labels A, B, C, so a fresh reviewer can look and choose. Use --shuffle, and keep compare.key.json from the reviewer until they have picked.' },
]);
export const MARKETPLACE_TOOLS_BASE = 'https://agents.useaiblocks.com/tools/';
/**
 * What every hand-over also meets (the same as marketplace families.ts HANDOVER_FINISH). In the 11 Nov 2026 benchmark,
 * work that left blanks or ran 2 to 4 times longer than a plain answer lost on clarity; complete proposals and a length
 * near the plain answer won 88% of 128 blind verdicts.
 */
export const HANDOVER_FINISH = "No blanks or placeholders. Put sign-offs once in To confirm outside publishable copy. Follow the matched quality family profile aim, ceiling and shape; the brief can ask for more. tools/check-handover.mjs with --profile <family> passes, along with the applicable v3 clarity, proof and visual checks.";
export const GJP_SKILLS = Object.freeze({ protocol: 'grounded-job-protocol', capture: 'brand-dna-capture', fidelity: 'brand-fidelity-check', defaults: 'ai-default-patterns' });

/** Capture spec per family: what goes into context/ and how. */
const BRAND_DNA_FIELDS = Object.freeze(['colours with their share of page area', 'font families, weights and sizes per role', 'radius', 'button and link styles', 'nav and footer structure', 'section order of key pages', 'image density and style', '5 to 10 verbatim voice samples', 'live facts (prices, offers, shipping, reviews, guarantees), each with its capture date']);
export function contextRequirements(kind, { siteUrl, hasExistingAsset } = {}) {
  const family = familyOf(kind), noAsset = hasExistingAsset === false;
  if (BRAND_KINDS.includes(kind)) return [
    { id: 'site_url', label: 'The live site or asset URL', required: !noAsset, how: siteUrl ? `Use ${siteUrl}.` : 'Ask for it. If there is no site, ask for screenshots and the brand guide.' },
    { id: 'brand_dna', label: 'context/brand-dna.json and context/screenshots/', required: !noAsset, how: `Run capture-brand-dna.mjs, else brand-dna-snippet.js, else ask for URL, screenshots and CSS. Capture: ${BRAND_DNA_FIELDS.join('; ')}.` },
    { id: 'existing_assets', label: 'The existing page, ad or email being changed', required: hasExistingAsset === true, how: 'Capture or open the current version before any change (patch mode).' },
    { id: 'competitors', label: '2 or 3 competitors or references', required: true, how: 'Ask the client to name them, or find them; capture each the same way.' },
    { id: 'brand_guide', label: 'Brand guide, if one exists', required: false, how: 'Ask; a guide overrides a capture where they disagree.' },
  ];
  if (family === 'audit_analysis') return [
    { id: 'account_access', label: 'The real account or data, at read level', required: true, how: 'Pull a snapshot through the client connector (level 1, read) into context/data-snapshot.json with source and date range. Never ask for passwords.' },
    { id: 'baseline', label: 'The baseline period and what changed', required: true, how: 'Ask what changed recently (spend, creative, tracking, offer, season, site).' },
    { id: 'success_metric', label: 'The metric that matters and its normal range', required: true, how: 'Ask, then check it against the snapshot.' },
  ];
  if (family === 'strategy_plan') return [
    { id: 'business_facts', label: 'Real customers, prices, numbers and limits', required: true, how: 'Take the facts from the brand file if there is one, else from the live site; ask for what is missing. No brand capture is needed.' },
    { id: 'competitors', label: '2 or 3 competitors the client is compared with', required: true, how: 'Ask the client to name them, or find them.' },
    { id: 'site_url', label: 'The live site', required: false, how: siteUrl ? `Use ${siteUrl}.` : 'Ask for it.' },
  ];
  return [
    { id: 'existing_system', label: 'The existing code, tool or document', required: true, how: 'Open the real repo, platform or file before changing it.' },
    { id: 'acceptance', label: 'How the client will check it works', required: true, how: 'Ask.' },
  ];
}

/** What the taste brief holds. The maker fills it from the capture, the answers and references it finds; it asks nothing more. */
export const TASTE_BRIEF_SECTIONS = Object.freeze(['Brand codes to keep (type, colour and its proportions, imagery, pacing, voice)', 'Category conventions to keep, and which to break', 'References: 2 the client admires, 1 to avoid looking like', 'Defaults to avoid, named by id from the AI-default list']);

/** A guess from the request words. It is a suggestion only; the host declares deliverable_kind. */
export function suggestDeliverableKind(request = '') {
  const words = String(request ?? '');
  const create = /\b(?:make|create|write|build|design|draft|produce|generate|redesign|rewrite|launch|code|implement|develop)\b/i.test(words);
  const assess = /\b(?:audit|review|diagnos\w*|analy[sz]\w*|assess\w*|health[ -]?check|check (?:my|our|the)|benchmark|why (?:is|are|did|has|have)|what went wrong|investigate|evaluate|report on)\b/i.test(words);
  const kind = (k, basis) => ({ kind: k, basis, source: 'suggested' });
  if (assess && !create) return /\b(?:analy[sz]\w*|why (?:is|are|did|has|have)|investigate|report on|benchmark)\b/i.test(words) && !/\baudit\b/i.test(words) ? kind('analysis', 'assessment words without a creation verb') : kind('audit', 'assessment words without a creation verb');
  // A job description is a document for a team, whatever "ad" or "posting" follows the word job.
  if (/\bjob (?:descriptions?|adverts?|ads?|postings?|specs?)\b/i.test(words)) return kind('ops_doc', 'document words');
  // An email series or newsletter is email work even when it asks for the "body copy" of each email.
  // Mixed work (a page or ads as well) falls through to the rules below.
  if (/\b(?:emails?|newsletters?)\b/i.test(words) && /\b(?:series|sequences?|subject lines?|preview text|welcome|drip|flows?|newsletters?)\b/i.test(words)
    && !/\b(?:landing[ -]?pages?|web ?pages?|websites?|ads?|creatives?)\b/i.test(words)) return kind('email', 'email words');
  // Words to be read or spoken are copy, including a script for a video about an app.
  if (/\b(?:copy|copywriting|headlines?|taglines?|wording|captions?|product descriptions?|blog posts?|articles?|press releases?|case stud(?:y|ies)|white ?papers?|(?:social(?: media)?|linkedin|instagram|facebook|twitter|tiktok) posts?|speech(?:es)?|(?:video|ad|explainer|podcast|sales|call|youtube) scripts?|proposals?)\b/i.test(words) && !/\b(?:build|code|implement|redesign|launchable|working)\b/i.test(words)) return kind('copy', 'copy words');
  if (/\b(?:landing[ -]?pages?|web ?pages?|websites?|home ?page|(?:product|sales|pricing|sign[ -]?up|checkout|about|contact|collection|category) pages?|site)\b/i.test(words)) return kind('web_page', 'page or site words');
  if (/\b(?:emails?|newsletters?|drip|welcome series|flows? in klaviyo)\b/i.test(words)) return kind('email', 'email words');
  if (/\b(?:ads?|creatives?|advertising|advertisements?|ugc|thumb-?stop)\b/i.test(words)) return kind('ad_creative', 'ad words with a creation verb');
  if (/\b(?:strategy|positioning|go[ -]to[ -]market|pricing model|brand platform)\b/i.test(words)) return kind('strategy', 'strategy words');
  if (/\b(?:plan|roadmap|calendar|schedule|forecast|budget)\b/i.test(words)) return kind('plan', 'plan words');
  if (/\b(?:code|app|script|function|api|bug|integration|plugin|theme)\b/i.test(words)) return kind('code', 'code words');
  if (/\b(?:sop|process|policy|playbook|checklist|handbook|guide|documents?|template)\b/i.test(words)) return kind('ops_doc', 'document words');
  return kind('other', 'no deliverable word matched');
}
/** The declared kind wins; a suggestion fills in only when the host declared none. */
export function resolveDeliverableKind(declared, request) {
  const suggestion = suggestDeliverableKind(request);
  if (DELIVERABLE_KINDS.includes(declared)) return { kind: declared, source: 'declared', suggestion };
  return { kind: suggestion.kind, source: 'suggested', suggestion };
}

/** patch is the default whenever an existing asset exists. */
export function resolveMode({ request = '', site_url, has_existing_asset, kind } = {}) {
  const words = String(request ?? '');
  if (has_existing_asset === false) return { mode: 'new', reason: 'The host reports no existing asset.' };
  if (/\b(?:new brand|from scratch|no (?:website|site|brand) yet|don'?t have a (?:website|site)|brand[ -]new business)\b/i.test(words)) return { mode: 'new', reason: 'The request says there is no existing brand or asset.' };
  if (DATA_KINDS.includes(kind)) return { mode: 'patch', reason: 'An audit or analysis works on the existing account or data.' };
  if (has_existing_asset === true || /\b(?:improve|fix|redesign|rewrite|refresh|update|optimi[sz]e|tweak|edit|my (?:current|existing)|our (?:current|existing))\b/i.test(words)) return { mode: 'patch', reason: 'An existing asset exists, so improve it with ranked edits rather than replace it.' };
  if (text(site_url)) return { mode: 'extend', reason: 'The client has a site; add the new asset inside its existing system.' };
  return { mode: 'patch', reason: 'Assumed: most clients have an existing site or asset. Ask for it; switch to new only if none exists.', confirm: true };
}

/** One line for the dials, stated not asked. */
export function dialsLine(dials = {}) {
  const mix = dials.variety_mix?.preset ?? 'balanced', volume = dials.volume?.value ?? 1, depth = dials.depth?.value ?? 'standard';
  return `Using a ${mix} mix, ${volume} output${volume === 1 ? '' : 's'} and a ${depth} review; say if you want otherwise.`;
}

/** Which context artifacts production needs for this kind. */
export function groundingRequirement(kind) {
  return { brand_dna: BRAND_KINDS.includes(kind), data_snapshot: DATA_KINDS.includes(kind), taste_brief: BRAND_KINDS.includes(kind) };
}
const contextPath = (value, name) => typeof value === 'string' && value.length <= 240 && !/\.\.|\\|^[a-z]:|^\//i.test(value) && (name ? new RegExp(`(?:^|/)context/${name.replace('.', '\\.')}$`).test(value) : /(?:^|\/)context\/[A-Za-z0-9._-]+$/.test(value));
const isoDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) && Number.isFinite(Date.parse(value.slice(0, 10)));
const textList = (value, min) => Array.isArray(value) && value.length >= min && value.length <= 40 && value.every(v => text(v) && v.length <= 2000);
/** Structure check only. The files stay in the user's project; these are host reports, not proof of capture. */
export function validateGrounding(grounding, kind, { path = 'grounding' } = {}) {
  const need = groundingRequirement(kind), errors = [], add = (p, message) => errors.push({ path: `${path}${p ? `.${p}` : ''}`, message });
  if (!need.brand_dna && !need.data_snapshot && !need.taste_brief) return errors;
  if (!object(grounding)) { add('', `A ${kind} job needs ${need.data_snapshot ? 'a data snapshot in context/' : 'context/brand-dna.json and context/taste-brief.md'} before production. Run prepare_job_context, capture, then report grounding: ${need.data_snapshot ? '{data_snapshot}' : '{brand_dna, taste_brief}'}. If capture is impossible, ask the user; never fall back to a template.`); return errors; }
  if (need.brand_dna) {
    const d = grounding.brand_dna;
    if (!object(d) || !contextPath(d.path, 'brand-dna.json') || !HASH.test(d.sha256 ?? '') || !text(d.source) || !isoDate(d.captured_at) || !['capture-brand-dna.mjs', 'brand-dna-snippet.js', 'manual'].includes(d.method)) add('brand_dna', 'Report the capture: path context/brand-dna.json, its sha256, source (the URL or "screenshots"), captured_at (ISO date) and method (capture-brand-dna.mjs, brand-dna-snippet.js or manual).');
  }
  if (need.data_snapshot) {
    const d = grounding.data_snapshot;
    if (!object(d) || !contextPath(d.path) || !HASH.test(d.sha256 ?? '') || !text(d.source) || !isoDate(d.captured_at)) add('data_snapshot', 'Report the real data pulled at read level: a path under context/, its sha256, source (account or connector) and captured_at (ISO date).');
  }
  if (need.taste_brief) {
    const t = grounding.taste_brief;
    if (!object(t) || !contextPath(t.path, 'taste-brief.md') || !HASH.test(t.sha256 ?? '')) add('taste_brief', 'Report context/taste-brief.md with its sha256.');
    else {
      if (!textList(t.brand_codes, 1)) add('taste_brief.brand_codes', 'Name at least one brand code to keep (type, colour proportions, imagery, pacing or voice).');
      if (!textList(t.references_admired, 2)) add('taste_brief.references_admired', 'Name 2 references the client admires.');
      if (!textList(t.reference_avoid, 1)) add('taste_brief.reference_avoid', 'Name 1 reference to avoid looking like.');
      if (!textList(t.defaults_to_avoid, 1)) add('taste_brief.defaults_to_avoid', 'Name the AI defaults this job will avoid, by id from prepare_job_context.');
      if (t.conventions_break !== undefined && !textList(t.conventions_break, 0)) add('taste_brief.conventions_break', 'List the category conventions to break as short strings.');
    }
  }
  return errors;
}

/** Overlap coefficient: shared items over the smaller set. Two empty sets do not overlap. */
export function overlapShare(a, b) {
  const A = new Set(list(a)), B = new Set(list(b));
  if (!A.size || !B.size) return 0;
  return [...A].filter(x => B.has(x)).length / Math.min(A.size, B.size);
}
const normRef = value => String(value ?? '').toLowerCase().replace(/^https?:\/\/(?:www\.)?/, '').replace(/[^a-z0-9]+/g, ' ').trim();
/** Deterministic variety on substance: routes that share more than the threshold of pinned methods or references fail. */
export function substanceOverlap(routes, { threshold = 0.6, requireReferences = false, path = 'document.routes.routes' } = {}) {
  const errors = [], rows = list(routes);
  rows.forEach((route, index) => {
    if (!Array.isArray(route?.methods) || !route.methods.length || route.methods.length > 6 || route.methods.some(m => !object(m) || !text(m.slug) || !HASH.test(m.revision_sha256 ?? ''))) errors.push({ path: `${path}[${index}].methods`, message: 'Pin the 1 to 6 methods this route actually uses ({slug, revision_sha256}). Rival routes must not run on the same method set.' });
    if (requireReferences && !textList(route?.references, 1)) errors.push({ path: `${path}[${index}].references`, message: 'Cite the reference (page, ad, brand or source) this direction learns from.' });
  });
  if (errors.length) return errors;
  const methodKeys = rows.map(r => list(r.methods).map(m => m.slug)), refKeys = rows.map(r => list(r.references).map(normRef).filter(Boolean));
  for (let i = 0; i < rows.length; i++) for (let j = 0; j < i; j++) {
    const methods = overlapShare(methodKeys[i], methodKeys[j]), refs = overlapShare(refKeys[i], refKeys[j]);
    if (methods > threshold) errors.push({ path: `${path}[${i}].methods`, message: `Shares ${Math.round(methods * 100)}% of its pinned methods with route ${rows[j].route_id}; more than ${Math.round(threshold * 100)}% means the routes differ only in label. Give each route its own methods.` });
    if (refs > threshold) errors.push({ path: `${path}[${i}].references`, message: `Shares ${Math.round(refs * 100)}% of its references with route ${rows[j].route_id}; each direction should learn from a different reference.` });
  }
  return errors;
}

/** get_skill preamble. Qualifies deterministically from the item's job (task), its tag (job), and its name. */
const CREATIVE_TASKS = new Set(['make-image-ads', 'make-video-ads', 'make-images', 'product-photos', 'write-ad-copy', 'write-landing-page', 'build-websites', 'design-work', 'write-emails', 'brand-file', 'grow-social', 'launch-and-scale-ads', 'run-google-ads', 'plan-ad-tests']);
const ASSESS_TASKS = new Set(['audit-landing-page', 'check-ads', 'read-ad-results', 'analyse-data']);
const CREATIVE_TAGS = new Set(['image', 'video', 'copy', 'ads', 'page', 'design', 'email', 'brand', 'creative', 'organic']);
const ASSESS_NAME = /\b(?:audit\w*|analy[sz]\w*|analysis|diagnos\w*)\b/;
const CREATIVE_NAME = /\b(?:landing|homepage|website|ads?|creatives?|copy|copywriter|copywriting|headlines?|taglines?|emails?|newsletters?|brand|branding|logo)\b/;
export function skillPreambleKind(item = {}) {
  const name = [item.slug, item.name].filter(v => typeof v === 'string').join(' ').toLowerCase().replace(/[-_/]+/g, ' ');
  const tags = [item.job, ...list(item.tags)].filter(v => typeof v === 'string');
  if (ASSESS_TASKS.has(item.task) || tags.includes('analysis') || ASSESS_NAME.test(name)) return 'assess';
  if (CREATIVE_TASKS.has(item.task) || tags.some(t => CREATIVE_TAGS.has(t)) || item.category === 'ecommerce' && CREATIVE_NAME.test(name) || CREATIVE_NAME.test(name)) return 'create';
  return null;
}
export function skillPreamble(item = {}) {
  const kind = skillPreambleKind(item);
  if (!kind) return null;
  const lines = kind === 'assess' ? [
    'SPEC: write the one-screen spec sheet first (prepare_job_context with deliverable_kind audit or analysis returns it pre-filled): the decision this informs, and 5 to 7 acceptance tests the owner would ask of the finished work. Ask its questions in one message; each has a default.',
    'GROUND: pull the real account or data at read level into context/ before you form any view, with its source and date range.',
    'CANDIDATES: write three competing explanations of the main problem, each with the evidence for it and what would rule it out. A fixed checklist score is not a diagnosis.',
    `BUILD: diagnose this account, rank the fixes by expected impact and recommend the first one. Never hand over a menu. ${TOOLBOX_ONLY}`,
    'CHECK with a fresh reviewer who sees only the brief, the work and the snapshot: each acceptance test pass or fail, every figure recomputed. Remove what has no source.',
  ] : [
    'SPEC: write the one-screen spec sheet first (prepare_job_context returns it pre-filled): who must do what after seeing this, the deliverables with counts, and 5 to 7 acceptance tests the client would ask of the finished work. Ask its questions in one message; each has a default.',
    'GROUND what those tests need: capture the client\'s live site into context/brand-dna.json and give every fact a buyer will read a dated source. Check the thing being sold is live, in stock and at that price at the link you use.',
    'CANDIDATES: follow annex.quality_engine depth: expert and plain drafts at light or standard; add a real creative alternative only at full depth, or specialist parts at team depth. This skill\'s fixed structures are options, not rules.',
    `BUILD: give true facts a new framing and add no new facts. Decide; never hand over a menu. Name the AI defaults you will avoid (prepare_job_context lists them). ${TOOLBOX_ONLY}`,
    'CHECK with a fresh reviewer who sees only the brief, the work and the captured facts: each acceptance test pass or fail, every claim sourced or not. Remove unsourced claims. Hand over the work first, with nothing internal in it.',
  ];
  return { title: 'Before you run this', kind, lines, quality_engine: { version: '3', method_url: qualityEngineContext().method_url }, tool: { name: 'prepare_job_context', arguments: { request: '<the user\'s request>', deliverable_kind: kind === 'assess' ? 'audit' : '<web_page|ad_creative|copy|email>' } }, precedence: 'The spec sheet and the client\'s captured context come first. Read prepare_job_context annex.quality_engine for family shape, length, clarity, proof and visual checks before using generic defaults. Truth and permission rules always apply.' };
}

/** The craft floor: what the build must clear whatever the kind of work. */
export const CRAFT_RULES = Object.freeze([
  'New framing of true facts, never new facts. Write the persuasion yourself: page lines are facts to use, not copy to paste.',
  'Every piece earns its place commercially and shows the product where a buyer expects it.',
  'Decide. One recommendation, with the runner-up in one line. Never hand the client a menu.',
  'Be specific where the client will act: real product names, prices, dates and set-up steps, each from a source.',
  'A working figure is allowed only for planning numbers the client will tune (budgets, targets, test sizes), with the sum shown. Never for anything a buyer reads, and never as a revenue forecast.',
  'Match the voice by ear: put 5 real lines from the brand beside 5 of yours.',
]);
/** The two outside reviews: someone else chooses the candidate, and someone else checks the finished work. */
export const REVIEWER = Object.freeze({
  who: 'A fresh reviewer who has not seen your reasoning: a new sub-agent where the host can start one, else a separate pass you label SAME-CONTEXT in your notes.',
  choose: {
    gets: ['the brief', 'the spec sheet', 'the candidates, unlabelled'],
    answers: ['Each acceptance test, for each candidate: pass or fail.', 'Which one to build.', 'What to take from the others.', 'What would make a buyer ignore the pick.'],
    rounds: 'One extra round at most, and only when no candidate passes the commercial-job tests.',
  },
  clients_eye: {
    gets: ['the client\'s brief', 'the finished deliverable', 'the captured facts (context/facts.md, the capture or the data snapshot)'],
    answers: [
      'Each acceptance test: pass or fail, with the line that proves it.',
      'Every claim a buyer or the client will read (prices, counts, ratings, policies, names, delivery times, quotes, product properties): sourced or not.',
      'Which piece is weakest, and why a buyer would skip it.',
      'What the client would have to ask before using this.',
      'What can be cut without loss.',
    ],
    then: 'Remove every unsourced claim, or rewrite it to what the source says. Never leave one in with a flag or a footnote. Fix what failed, cut what can go, then stop.',
  },
});

/** Nothing searches the library at job time: every lead arrives with its toolbox. */
export const NO_SEARCH = 'Use what the lead already carries; search_library is for when a person asks to browse.';
/** The same rule, said to whoever is running one skill. */
const TOOLBOX_ONLY = 'Work from this skill and the toolbox you already carry; search_library is for when a person asks to browse.';

const short = (value, max) => value.length <= max ? value : value.slice(0, max - 1).trimEnd() + '…';
/** The questions to ask once, in one message: the one list for this kind of job (intake-questions.mjs). Each row is
 *  { id, question, default }, plus `why` when the list gives one. A question the request already answers is dropped. */
const askQuestions = (kind, family, request) => intakeQuestions({ deliverableKind: kind, family, request }).map(row => ({ id: row.id, question: row.question, default: row.default, ...(row.why ? { why: row.why } : {}) }));
/** Room kept in the brief for the AVOID line, so a long question list can never push it out: its opening words plus one
 *  default at full length. */
const AVOID_RESERVE = 150;
/** prepare_job_context: a short brief for the model plus a structured annex. The brief names the annex parts to open. */
export function prepareJobContext(input = {}, context = {}) {
  const request = String(input.request ?? '').trim();
  const resolved = resolveDeliverableKind(input.deliverable_kind, request), kind = resolved.kind, family = familyOf(kind);
  const siteUrl = typeof input.site_url === 'string' && /^https?:\/\/[^\s]+$/i.test(input.site_url) ? input.site_url : undefined;
  const mode = resolveMode({ request, site_url: siteUrl, has_existing_asset: input.has_existing_asset, kind });
  const patterns = normalizePatterns(context.patterns), defaults = defaultsFor(kind, patterns);
  const questions = askQuestions(kind, family, request).map(q => ({ ...q })), rubric = craftRubric(kind), gates = gatesFor(kind), need = groundingRequirement(kind), levers = leversFor(kind);
  const complete = completenessFor(kind), spec = specSheet({ request, kind, mode, kindSource: resolved.source }), selling = BRAND_KINDS.includes(kind);
  const audit = family === 'audit_analysis', method = candidateMethod(kind);
  const steps = GJP_STEPS.map(step => ({ ...step, do: audit && AUDIT_STEP_OVERRIDES[step.id] ? AUDIT_STEP_OVERRIDES[step.id] : step.do }));
  const scripts = CAPTURE_TOOLS.filter(t => BRAND_KINDS.includes(kind) || (t.skill === 'brand-dna-capture' && family === 'strategy_plan')).map(tool => {
    const resolvedTool = list(context.scripts).find(s => s.file === tool.file);
    const { agents_app, ...row } = tool;
    return { ...row, get_skill: { slug: tool.skill, response_format: 'detailed' }, get_resource: { slug: resolvedTool?.slug ?? tool.skill, path: resolvedTool?.path ?? tool.path, revision_sha256: resolvedTool?.revision_sha256 ?? null }, resource_url: resolvedTool?.resource_url ?? null, marketplace_url: tool.agents_app === false ? null : MARKETPLACE_TOOLS_BASE + tool.file, status: resolvedTool ? 'PUBLISHED' : 'CHECK_GET_SKILL' };
  });
  const ground = need.data_snapshot ? 'GROUND what the tests need: pull the real account or data at read level into context/ (for example context/data-snapshot.json) with source and date range.'
    : need.brand_dna ? `GROUND what the tests need: ${siteUrl ? `capture ${short(siteUrl, 120)}` : 'get the live site URL and capture it'} into context/brand-dna.json. Check what is sold is live, in stock, at that price and link.`
    : 'GROUND what the tests need: open the real facts, system or files this job changes.';
  const ticks = [...(complete.length ? ['annex.completeness'] : []), ...(levers.length ? ['annex.proven_levers'] : [])];
  const build = selling ? 'reframe true facts, add none. Decide; hand over no menu.'
    : audit ? 'diagnose this account or data, rank the fixes and recommend the first. Hand over no menu.'
    : family === 'strategy_plan' ? 'one recommendation, the runner-up in a line, no menu. Working figures only for numbers the client will tune, with the sum shown; no blanks.'
    : 'fit the existing system. Decide the approach yourself; hand over no menu.';
  const head = [
    `Job: ${kind}${resolved.source === 'suggested' ? ' (suggested; declare deliverable_kind if wrong)' : ''}. Mode: ${mode.mode}${mode.confirm ? ' (confirm it)' : ''}.`,
    'SPEC: follow annex.quality_engine; fill annex.spec_sheet: the job, deliverables, 5 to 7 acceptance tests, decisions.',
    ground,
    'TRUTH: every fact a reader sees needs a dated source; cut what has none, never flag it.',
  ];
  const tail = [
    `CANDIDATES: ${candidatesFor(kind)}${selling ? ` Differ on two of: ${CANDIDATE_AXES.join(', ')}.` : ''} A fresh reviewer picks.${method ? ` Your toolbox has "${method.name}".` : ''}`,
    `BUILD: ${build}${ticks.length ? ` Tick ${ticks.join(' and ')}.` : ''}`,
    'CHECK: a fresh reviewer with only the brief, the work and the facts answers each test and marks each claim sourced or not. Fix, cut, stop.',
    `HAND-OVER: the work first, opened by 3 to 5 lines. ${WORD_BUDGETS[kind] ?? WORD_BUDGETS.other} Nothing internal; detail in an appendix, never in a file the client does not have.`,
  ];
  // Under 1,500 characters: the fixed lines first, then room kept for AVOID, then as many questions as fit in full.
  let room = 1500 - [...head, ...tail].join('\n').length - 2;
  const askEnd = need.taste_brief ? ' Write context/taste-brief.md.' : '', quoted = questions.map(q => `"${q.question}"`);
  const askWith = n => !quoted.length ? '' : n === 0 ? `ASK once: the questions in annex.questions, each with its default.${askEnd}` : `ASK once (defaults in annex.questions): ${quoted.slice(0, n).join(' ')}${n < quoted.length ? ` (+${quoted.length - n} more)` : ''}${askEnd}`;
  let fit = quoted.length;
  while (fit > 0 && askWith(fit).length > room - (defaults.length ? AVOID_RESERVE : 0)) fit--;
  const askLine = askWith(fit);
  // The defaults get what is left: descriptions, not ids, so the model knows what to avoid.
  room -= askLine.length + 50;
  const avoid = [];
  for (const d of defaults) { const piece = short(d.description.replace(/\.$/, ''), 90); if (piece.length + 2 > room) break; avoid.push(piece); room -= piece.length + 2; }
  const defaultsLine = avoid.length ? `AVOID unless chosen on purpose: ${avoid.join('; ')}${avoid.length < defaults.length ? ` (+${defaults.length - avoid.length} in annex)` : ''}.` : '';
  let brief = [...head, askLine, defaultsLine, ...tail].filter(Boolean).join('\n');
  if (brief.length > 1500) brief = short(brief, 1500);
  return {
    schema: 'ai-blocks-job-context/1', brief,
    annex: {
      read: 'Read quality_engine first for draft depth, family shape and length, clarity, proof and visual checks. It governs the generic defaults below while existing truth, access and delivery gates still apply. Act on the brief. Open the annex parts it names (spec_sheet, questions, completeness, proven_levers, brand_context) and reviewer before each review. Save the whole annex as context/job-context.json.',
      quality_engine: qualityEngineContext(request, kind),
      request_verbatim: request, deliverable_kind: kind, kind_source: resolved.source, suggestion: resolved.suggestion, family,
      mode_default: mode, site_url: siteUrl ?? null, category: typeof input.category === 'string' ? input.category.slice(0, 80) : null,
      spec_sheet: spec,
      questions,
      brand_context: { ...contextNeed(kind), next: brandFileStep({ kind, status: input.brand_file_status && typeof input.brand_file_status === 'object' ? input.brand_file_status : null }) },
      protocol: steps,
      context_requirements: contextRequirements(kind, { siteUrl, hasExistingAsset: input.has_existing_asset }),
      capture: { order: ['capture-brand-dna.mjs (Node + Playwright)', 'brand-dna-snippet.js (browser console)', 'ask for URL, screenshots and CSS'], fields: need.brand_dna ? [...BRAND_DNA_FIELDS] : [], tools: scripts, skills: Object.values(GJP_SKILLS).map(slug => ({ slug, get_skill: { slug, response_format: 'detailed' } })) },
      artifacts: { spec_sheet: 'context/spec.md', facts: 'context/facts.md', ...(need.brand_dna ? { brand_dna: 'context/brand-dna.json', screenshots: 'context/screenshots/' } : {}), ...(need.data_snapshot ? { data_snapshot: 'context/data-snapshot.json' } : {}), ...(need.taste_brief ? { taste_brief: 'context/taste-brief.md' } : {}), working_notes: 'DECISIONS.md' },
      taste_brief: { path: 'context/taste-brief.md', required_before_production: need.taste_brief, sections: [...TASTE_BRIEF_SECTIONS], fill_from: 'The capture, the answers to annex.questions and the references you find. Ask nothing more.' },
      production_gate: { requires: need, report_as: need.data_snapshot ? { grounding: { data_snapshot: { path: 'context/data-snapshot.json', sha256: '<sha256>', source: '<account or connector>', captured_at: '<ISO date>' } } } : need.brand_dna ? { grounding: { brand_dna: { path: 'context/brand-dna.json', sha256: '<sha256>', source: siteUrl ?? '<site URL>', captured_at: '<ISO date>', method: 'capture-brand-dna.mjs' }, taste_brief: { path: 'context/taste-brief.md', sha256: '<sha256>', brand_codes: ['<code>'], references_admired: ['<ref>', '<ref>'], reference_avoid: ['<ref>'], defaults_to_avoid: defaults.slice(0, 3).map(d => d.id), conventions_break: [] } } } : null, note: 'start_job and advance_job check this structure before PRODUCE. It is a host report, not proof of capture.' },
      truth: { rule: 'Every fact a reader sees needs a dated source. Cut what has none, or rewrite it to what the source says. Never flag it and leave it in.', method: craftMethod(CRAFT_METHODS.truth) },
      buyer_can_act: selling ? { check: 'Before you build, confirm the thing being sold is live, in stock in the sizes or variants that matter, at the stated price, at the link you will use.', if_not: 'Make the call yourself, build for the option that works, and say so in the first line of the hand-over.', method: craftMethod(CRAFT_METHODS.buyer) } : null,
      candidates: { make: candidatesFor(kind), ...(method ? { method } : {}), ...(['web_page', 'ad_creative'].includes(kind) ? { when_the_look_is_open: craftMethod(CRAFT_METHODS.look) } : {}), ...(selling ? { compare_with: 'compare-candidates.mjs (annex.capture.tools): puts the candidates side by side under blind labels for the reviewer.' } : {}), as: 'Real work, not descriptions.', axes: selling ? [...CANDIDATE_AXES] : [], differ_on_at_least: selling ? 2 : null, reject: 'Candidates that differ only in colour, crop, wording or style label.', patch_mode: mode.mode === 'patch' ? 'Each candidate is the live asset as you would change it, with its ranked edits and their evidence.' : null },
      reviewer: { who: REVIEWER.who, choose: { ...REVIEWER.choose, method: craftMethod(CRAFT_METHODS.choose) }, clients_eye: { ...REVIEWER.clients_eye, method: craftMethod(CRAFT_METHODS.check) } },
      craft_floor: [...CRAFT_RULES],
      completeness: complete,
      craft_rubric: rubric, gates,
      hand_over: { opening: 'The work comes first, in the format asked for. Open with 3 to 5 lines: what this is, the main decision you made and why, and what to check before use.', word_budget: WORD_BUDGETS[kind] ?? WORD_BUDGETS.other, finish: HANDOVER_FINISH, check_tool: MARKETPLACE_TOOLS_BASE + 'check-handover.mjs', readable: 'Headings state the point. Sentences are short. Tables are for comparisons only.', detail_goes_to: ['an appendix inside the deliverable'], never_in_the_deliverable: ['process sections', 'lever checklists', 'rejected candidates', 'agent or persona names', 'file names such as knowledge.md or DECISIONS.md', 'access levels', 'method vocabulary'], never_point_to: ['DECISIONS.md', 'knowledge.md', 'other working files'] },
      proven_levers: levers,
      defaults_to_avoid: defaults, defaults_source: patterns.length ? `catalogue:${GJP_SKILLS.defaults}/patterns.json` : 'embedded:DESIGN.md AI-default list',
      next: { team: { tool: 'start_job', arguments: { request, deliverable_kind: kind, ...(siteUrl ? { site_url: siteUrl } : {}), ...(typeof input.has_existing_asset === 'boolean' ? { has_existing_asset: input.has_existing_asset } : {}) } }, single: { tool: 'start_job', arguments: { request, deliverable_kind: kind, ...(siteUrl ? { site_url: siteUrl } : {}), ...(typeof input.has_existing_asset === 'boolean' ? { has_existing_asset: input.has_existing_asset } : {}) }, then: `Load the lead it names with its next_action.tool. ${NO_SEARCH}` } },
    },
    model_calls: 0, stored_by_service: false,
  };
}
