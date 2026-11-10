// The Grounded Job Protocol (GJP) as data: frame, ground, taste, diverge, build, check, record.
// Deterministic and model-free. One source for prepare_job_context, the start_job questions,
// the production gate, the craft rubric and the get_skill preamble. Nothing here stores client data:
// capture files live in the user's project under context/.

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

/** The protocol in the order a host should run it. The first lines of the MCP instructions say the same. */
export const GJP_STEPS = Object.freeze([
  { id: 'frame', name: 'Frame', do: 'Write the job card: client, outcome, deliverable_kind, success measure and mode (patch the existing asset by default).' },
  { id: 'ground', name: 'Ground', do: 'Capture the real thing before producing anything: the live site into context/brand-dna.json and context/screenshots/, or the real account or data snapshot for audits.' },
  { id: 'taste', name: 'Taste brief', do: 'Write context/taste-brief.md: brand codes to keep, category conventions to keep and break, 2 admired references and 1 to avoid, and the named defaults to avoid.' },
  { id: 'diverge', name: 'Diverge on substance', do: 'Make 2 or 3 directions that differ on named axes (mechanism, proof, structure, visual world, offer), each citing its reference. Colour, crop or wording alone is not a direction.' },
  { id: 'build', name: 'Build inside the client system', do: 'Keep the captured nav, footer, fonts, colour proportions and components unless the plan changes them on purpose. Use real copy and facts.' },
  { id: 'check', name: 'Independent check', do: 'A separate critic pass runs the pass/fail gates and scores the craft rubric, then compares the work with the best reference. Refine once.' },
  { id: 'record', name: 'Record', do: 'Write DECISIONS.md: considered, chosen and why, strongest dissent, what to test next.' },
]);
const AUDIT_STEP_OVERRIDES = Object.freeze({
  ground: 'Pull the real account or data snapshot through the client connector at read level into context/ (for example context/data-snapshot.json), with its source and date.',
  taste: 'Write the decision this informs, what changed recently and what normal looks like for the key metric. Name the defaults to avoid.',
  diverge: 'Write 2 or 3 competing hypotheses for why the numbers moved, each with the evidence that would confirm or kill it. A fixed checklist score is not a diagnosis.',
  build: 'Diagnose this account or data specifically, then rank actions by expected impact.',
});

/** CRAFT-RUBRICS from the spec. Weights sum to 100 per family; gates are pass/fail and never averaged away. */
export const CRAFT_RUBRICS = Object.freeze({
  web_page: [
    { id: 'job_conversion', criterion: 'Job and conversion logic', weight: 20, test: 'The page does the job the client asked for, with one clear primary action and an argument a buyer can follow.' },
    { id: 'brand_fidelity', criterion: 'Brand fidelity', weight: 25, test: 'Recognisably this brand: captured fonts, colour proportions, components, nav, footer and voice samples are used, each choice citing context/brand-dna.json.' },
    { id: 'launchability', criterion: 'Launchability', weight: 20, test: 'Ships as working source on the client stack: loads the brand fonts, works at 390 px and 1440 px, primary action works, no fillable placeholders.' },
    { id: 'specificity', criterion: 'Specificity', weight: 15, test: 'A competitor could not publish it unchanged: real products, prices, offers and proof from capture.' },
    { id: 'distinctiveness', criterion: 'Distinctiveness against the named defaults', weight: 10, test: 'Avoids every default named in the taste brief, or departs from it on purpose with a reason.' },
    { id: 'clarity', criterion: 'Clarity', weight: 10, test: 'A first-time visitor understands the offer and next step in one screen.' },
  ],
  ad_creative: [
    { id: 'strategic_idea', criterion: 'Strategic idea', weight: 20, test: 'Each concept has an idea about the buyer, not just a look.' },
    { id: 'range', criterion: 'Range across named axes', weight: 20, test: 'Concepts differ on mechanism, proof, structure, visual world or offer, and none uses a named ad default (one look for all, a reused hook, product on a gradient).' },
    { id: 'brand_fidelity', criterion: 'Brand fidelity', weight: 15, test: 'Recognisably this brand: captured colours, type, product and voice.' },
    { id: 'hook', criterion: 'Hook and thumb-stop', weight: 15, test: 'The first second earns attention for this buyer on this placement.' },
    { id: 'specificity', criterion: 'Specificity', weight: 15, test: 'Uses real products, offers and proof; a competitor could not run it unchanged.' },
    { id: 'platform_fit', criterion: 'Platform fit', weight: 15, test: 'Native to the placement, its safe zones and specs.' },
  ],
  copy_email: [
    { id: 'brand_fidelity', criterion: 'Voice fidelity', weight: 25, test: 'Sounds like the captured voice samples, not a generic brand.' },
    { id: 'specificity', criterion: 'Specificity', weight: 20, test: 'A competitor could not send or publish it unchanged.' },
    { id: 'job_done', criterion: 'Job done', weight: 20, test: 'Does the job the client asked for.' },
    { id: 'grounded_claims', criterion: 'Proof and claims grounded', weight: 15, test: 'Every claim, price and offer traces to a dated source.' },
    { id: 'distinctiveness', criterion: 'Distinctiveness against the named defaults', weight: 10, test: 'None of the named copy defaults (unlock, elevate, seamless, rule-of-three lists, fake urgency, generic benefits) unless chosen on purpose.' },
    { id: 'clarity', criterion: 'Clarity', weight: 10, test: 'One reading is enough to know what to do next.' },
  ],
  audit_analysis: [
    { id: 'diagnosis', criterion: 'Diagnosis specific to this account or data', weight: 25, test: 'Explains why this metric moved for this client, not a checklist score.' },
    { id: 'evidence', criterion: 'Evidence quality', weight: 20, test: 'Each finding cites the pulled data with its date range.' },
    { id: 'prioritised_actions', criterion: 'Prioritised actions with expected impact', weight: 20, test: 'Actions are ranked, each with its expected effect and how to check it.' },
    { id: 'correctness', criterion: 'Correctness', weight: 20, test: 'Numbers and calculations are right; no invented figures.' },
    { id: 'clarity', criterion: 'Clarity', weight: 15, test: 'The owner knows the first thing to do.' },
  ],
  strategy_plan: [
    { id: 'grounded', criterion: 'Grounded in this business', weight: 25, test: 'Uses this business\'s real customers, numbers and constraints.' },
    { id: 'options', criterion: 'Options considered with trade-offs', weight: 20, test: 'Real alternatives with what each costs and wins.' },
    { id: 'decision_quality', criterion: 'Decision quality', weight: 20, test: 'The choice follows from the evidence and names its strongest dissent.' },
    { id: 'actionability', criterion: 'Actionability', weight: 20, test: 'Next steps have owners, dates and measures.' },
    { id: 'clarity', criterion: 'Clarity', weight: 15, test: 'Readable in one pass.' },
  ],
  code_ops_other: [
    { id: 'job_done', criterion: 'Job done', weight: 30, test: 'Does the job the client asked for.' },
    { id: 'correctness', criterion: 'Correctness', weight: 25, test: 'Runs or reads correctly; checks pass.' },
    { id: 'fits_system', criterion: 'Fits the existing system', weight: 20, test: 'Follows the existing code, tools and conventions.' },
    { id: 'clarity', criterion: 'Clarity', weight: 15, test: 'Someone else can use or maintain it.' },
    { id: 'specificity', criterion: 'Specificity', weight: 10, test: 'Written for this system, not a generic template.' },
  ],
});
export const COMMON_GATES = Object.freeze([
  { id: 'facts_trace_to_source', gate: 'Facts trace to a source.' },
  { id: 'no_invented_numbers', gate: 'No invented numbers.' },
  { id: 'access_respected', gate: 'Access respected: read, draft, or publish within the agreed limits.' },
  { id: 'no_fillable_placeholders', gate: 'No placeholder that capture could have filled.' },
  { id: 'hand_over_budget', gate: 'Hand-over fits: a one-screen summary comes first (what changed, why, what to check), and the deliverable stays inside its word budget. Detail goes to DECISIONS.md or an appendix.' },
]);
/**
 * Word budgets by deliverable kind. The 9 Nov 2026 blind test found grounded work scored lower on clarity than plain
 * model output because it ran long; the budget keeps the evidence and moves it out of the way.
 */
export const WORD_BUDGETS = Object.freeze({
  web_page: 'Hand-over note up to 150 words. Page copy no longer than the live page plus 20%, unless the change says why.',
  ad_creative: 'Up to 150 words per concept. The hook fits the placement\'s visible text (about 125 characters on Meta).',
  copy: 'The length the job card names; with none, no longer than the copy it replaces.',
  email: 'Body up to 200 words per email, unless the brand\'s own past emails run longer.',
  audit: 'The top 3 fixes on the first screen, and up to 1,500 words in all. Evidence tables go in an appendix.',
  analysis: 'The answer and how sure it is on the first screen, and up to 1,500 words in all. Working goes in an appendix.',
  strategy: 'A summary up to 250 words first, and up to 2,500 words in all.',
  plan: 'A summary up to 250 words first, and up to 2,500 words in all. Schedules go in tables.',
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
export const LEVER_GATE = Object.freeze({ id: 'proven_levers_checked', gate: 'Proven levers checked: each lever for this kind of work is marked present, missing or not applicable on the live asset, and each missing one is added from real data or skipped with a reason.' });
export const leversFor = kind => [...(PROVEN_LEVERS[kind] ?? [])];
export const WEB_GATES = Object.freeze([
  { id: 'nav_footer_kept', gate: 'The existing nav and footer are kept, unless the change is on purpose.' },
  { id: 'brand_fonts_loaded', gate: 'Brand fonts are loaded.' },
  { id: 'responsive_390_1440', gate: 'The page works at 390 px and 1440 px.' },
  { id: 'primary_action_works', gate: 'The primary action works.' },
  { id: 'brand_fidelity_lint', gate: 'check-brand-fidelity.mjs (or its manual checklist) passes against context/brand-dna.json.' },
]);
export const gatesFor = kind => [...COMMON_GATES, ...(PROVEN_LEVERS[kind] ? [LEVER_GATE] : []), ...(familyOf(kind) === 'web_page' ? WEB_GATES : [])].map(g => ({ ...g }));
export const craftRubric = kind => CRAFT_RUBRICS[familyOf(kind)].map(c => ({ ...c }));

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
]);
export const MARKETPLACE_TOOLS_BASE = 'https://agents.useaiblocks.com/tools/';
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
    { id: 'business_facts', label: 'Real customers, prices, numbers and limits', required: true, how: 'Use the brand brain and the live site; ask for what is missing.' },
    { id: 'competitors', label: '2 or 3 competitors the client is compared with', required: true, how: 'Ask the client to name them, or find them.' },
    { id: 'site_url', label: 'The live site', required: false, how: siteUrl ? `Use ${siteUrl}.` : 'Ask for it.' },
  ];
  return [
    { id: 'existing_system', label: 'The existing code, tool or document', required: true, how: 'Open the real repo, platform or file before changing it.' },
    { id: 'acceptance', label: 'How the client will check it works', required: true, how: 'Ask.' },
  ];
}

/** The taste and position interview. This is where the question budget goes; format dials are silent defaults. */
export const TASTE_QUESTIONS = Object.freeze({
  brand: [
    { id: 'position', question: 'Who buys this, at what price point, and for what occasion or moment?', why: 'Sets the register: luxury, everyday, gift, urgent fix.' },
    { id: 'never_change', question: 'What must never change: type, colours, logo use, words, claims or layout?', why: 'These become brand codes to keep.' },
    { id: 'references', question: 'Name 2 brands or pages you admire and 1 you would hate to look like.', why: 'Anchors taste outside the model\'s average.' },
  ],
  audit_analysis: [
    { id: 'decision', question: 'What decision will this inform, and by when?', why: 'An audit is for a decision, not a score.' },
    { id: 'what_changed', question: 'What changed recently: spend, creative, tracking, offer, season or site?', why: 'Seeds the competing hypotheses.' },
    { id: 'normal', question: 'Which metric matters most, and what is normal for it?', why: 'Sets the baseline to diagnose against.' },
  ],
  strategy_plan: [
    { id: 'position', question: 'Who is the best customer, what do they pay, and who do they compare you with?', why: 'Grounds the plan in this business.' },
    { id: 'never_change', question: 'What must not change: brand, price, channel or team limits?', why: 'Hard constraints for every option.' },
    { id: 'success', question: 'What result, by when, would make this worth doing?', why: 'The success measure for the job card.' },
  ],
  code_ops_other: [
    { id: 'system', question: 'Where does this live (repo, platform, stack), and what must keep working?', why: 'Build inside the existing system.' },
    { id: 'done', question: 'How will you check that it works?', why: 'Becomes the acceptance check.' },
    { id: 'limits', question: 'What must not change?', why: 'Constraints the build keeps.' },
  ],
});
export function tasteQuestions(kind) {
  const family = familyOf(kind);
  return (BRAND_KINDS.includes(kind) ? TASTE_QUESTIONS.brand : TASTE_QUESTIONS[family] ?? TASTE_QUESTIONS.code_ops_other).map(q => ({ ...q }));
}
export const TASTE_BRIEF_SECTIONS = Object.freeze(['Brand codes to keep (type, colour and its proportions, imagery, pacing, voice)', 'Category conventions to keep, and which to break', 'References: 2 the client admires, 1 to avoid looking like', 'Defaults to avoid, named by id from the AI-default list']);

/** A guess from the request words. It is a suggestion only; the host declares deliverable_kind. */
export function suggestDeliverableKind(request = '') {
  const words = String(request ?? '');
  const create = /\b(?:make|create|write|build|design|draft|produce|generate|redesign|rewrite|launch|code|implement|develop)\b/i.test(words);
  const assess = /\b(?:audit|review|diagnos\w*|analy[sz]\w*|assess\w*|health[ -]?check|check (?:my|our|the)|benchmark|why (?:is|are|did|has|have)|what went wrong|investigate|evaluate|report on)\b/i.test(words);
  const kind = (k, basis) => ({ kind: k, basis, source: 'suggested' });
  if (assess && !create) return /\b(?:analy[sz]\w*|why (?:is|are|did|has|have)|investigate|report on|benchmark)\b/i.test(words) && !/\baudit\b/i.test(words) ? kind('analysis', 'assessment words without a creation verb') : kind('audit', 'assessment words without a creation verb');
  if (/\b(?:copy|copywriting|headlines?|taglines?|wording|captions?|product descriptions?|blog posts?|articles?)\b/i.test(words) && !/\b(?:build|code|implement|redesign|launchable|working)\b/i.test(words)) return kind('copy', 'copy words');
  if (/\b(?:landing[ -]?pages?|web ?pages?|websites?|home ?page|product pages?|sales pages?|site)\b/i.test(words)) return kind('web_page', 'page or site words');
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
    'GROUND: pull the real account or data at read level into context/ first (or call prepare_job_context with deliverable_kind audit or analysis).',
    'Ask the 3 interview questions: the decision this informs, what changed recently, and what normal looks like.',
    'Name the defaults you will avoid, starting with a fixed checklist score that does not explain why this metric moved.',
    'Write 2 or 3 competing hypotheses, each with the evidence that would confirm or kill it, before scoring anything.',
    'Check with an independent pass: a fresh context or another seat runs the gates (facts trace, no invented numbers, access respected).',
  ] : [
    'GROUND: capture the client\'s live site into context/brand-dna.json and context/screenshots/ first (or call prepare_job_context).',
    'Answer the taste questions: position and price point, what must never change, 2 admired references and 1 to avoid.',
    'Name the AI defaults you will avoid (prepare_job_context lists them); this skill\'s fixed structures are options, not rules.',
    'Make 2 or 3 directions that differ on named axes (mechanism, proof, structure, visual world, offer), each citing its reference.',
    'Check with an independent pass in a fresh context: gates pass or fail, then craft scores for fidelity and distinctiveness.',
  ];
  return { title: 'Before you run this', kind, lines, tool: { name: 'prepare_job_context', arguments: { request: '<the user\'s request>', deliverable_kind: kind === 'assess' ? 'audit' : '<web_page|ad_creative|copy|email>' } }, precedence: 'The client\'s captured context and taste brief override this method\'s defaults on look and structure; they never override truth or permission rules.' };
}

const short = (value, max) => value.length <= max ? value : value.slice(0, max - 1).trimEnd() + '…';
/** prepare_job_context: a short brief for the model plus a structured annex the host saves without reading. */
export function prepareJobContext(input = {}, context = {}) {
  const request = String(input.request ?? '').trim();
  const resolved = resolveDeliverableKind(input.deliverable_kind, request), kind = resolved.kind, family = familyOf(kind);
  const siteUrl = typeof input.site_url === 'string' && /^https?:\/\/[^\s]+$/i.test(input.site_url) ? input.site_url : undefined;
  const mode = resolveMode({ request, site_url: siteUrl, has_existing_asset: input.has_existing_asset, kind });
  const patterns = normalizePatterns(context.patterns), defaults = defaultsFor(kind, patterns);
  const questions = tasteQuestions(kind), rubric = craftRubric(kind), gates = gatesFor(kind), need = groundingRequirement(kind), levers = leversFor(kind);
  const audit = family === 'audit_analysis';
  const steps = GJP_STEPS.map(step => ({ ...step, do: audit && AUDIT_STEP_OVERRIDES[step.id] ? AUDIT_STEP_OVERRIDES[step.id] : step.do }));
  const scripts = CAPTURE_TOOLS.filter(t => BRAND_KINDS.includes(kind) || (t.skill === 'brand-dna-capture' && family === 'strategy_plan')).map(tool => {
    const resolvedTool = list(context.scripts).find(s => s.file === tool.file);
    return { ...tool, get_skill: { slug: tool.skill, response_format: 'detailed' }, get_resource: { slug: resolvedTool?.slug ?? tool.skill, path: resolvedTool?.path ?? tool.path, revision_sha256: resolvedTool?.revision_sha256 ?? null }, resource_url: resolvedTool?.resource_url ?? null, marketplace_url: MARKETPLACE_TOOLS_BASE + tool.file, status: resolvedTool ? 'PUBLISHED' : 'CHECK_GET_SKILL' };
  });
  const captureLine = need.data_snapshot ? 'GROUND: pull the real account or data at read level into context/ (for example context/data-snapshot.json) with source and date range.'
    : need.brand_dna ? `GROUND: ${siteUrl ? `capture ${siteUrl}` : 'get the live site URL and capture it'} into context/brand-dna.json and context/screenshots/ (capture-brand-dna.mjs, else brand-dna-snippet.js, else ask for screenshots and CSS).`
    : 'GROUND: open the real business facts, system or files this job changes before producing anything.';
  const lead = [
    `Job: ${kind}${resolved.source === 'suggested' ? ' (suggested; declare deliverable_kind if wrong)' : ''}. Mode: ${mode.mode}${mode.confirm ? ' (confirm it)' : ''}.`,
    captureLine,
    `TASTE: ask ${questions.map(q => `"${q.question}"`).join(' ')}${need.taste_brief ? ' Write context/taste-brief.md.' : ''}`,
  ];
  const tail = [
    audit ? 'DIVERGE: 2 or 3 competing hypotheses, each with the evidence that would kill it.'
      : family === 'strategy_plan' ? 'DIVERGE: 2 or 3 real options with what each costs and wins; choose one and record the strongest dissent.'
      : family === 'code_ops_other' ? 'DIVERGE: when the approach is not obvious, compare 2 approaches that differ in mechanism or trade-off, not wording.'
      : 'DIVERGE: 2 or 3 directions that differ on mechanism, proof, structure, visual world or offer, each citing its reference.',
    ...(!levers.length ? [] : audit ? ['LEVERS: mark which proven levers the audited page, ad or email lacks (annex.proven_levers) and rank adding them among the fixes.']
      : [`LEVERS: before building, mark each of the ${levers.length} proven levers in annex.proven_levers present or missing on the live asset; add missing ones from real data.`]),
    `CHECK: a fresh critic runs ${gates.length} pass/fail gates, then scores ${rubric.slice().sort((x, y) => y.weight - x.weight).slice(0, 3).map(c => `${c.criterion.toLowerCase()} ${c.weight}`).join(', ')}.`,
    `HAND-OVER: a one-screen summary first (what changed, why, what to check). ${WORD_BUDGETS[kind] ?? WORD_BUDGETS.other}`,
    need.brand_dna || need.data_snapshot ? `Report grounding (${need.data_snapshot ? 'data_snapshot' : 'brand_dna and taste_brief'}) before production. Client context overrides method defaults on look and structure, never truth or permission.` : 'Client context overrides method defaults on structure, never truth or permission.',
  ];
  // The defaults get whatever room is left under 1,500 characters: descriptions, not ids, so the model knows what to avoid.
  let room = 1500 - [...lead, ...tail].join('\n').length - 60, avoid = [];
  for (const d of defaults) { const piece = short(d.description.replace(/\.$/, ''), 120); if (piece.length + 2 > room) break; avoid.push(piece); room -= piece.length + 2; }
  const defaultsLine = avoid.length ? `AVOID unless chosen on purpose: ${avoid.join('; ')}${avoid.length < defaults.length ? ` (+${defaults.length - avoid.length} in annex)` : ''}.` : '';
  let brief = [...lead, defaultsLine, ...tail].filter(Boolean).join('\n');
  if (brief.length > 1500) brief = short(brief, 1500);
  return {
    schema: 'ai-blocks-job-context/1', brief,
    annex: {
      read: 'Save this annex as context/job-context.json. The brief above is what to act on.',
      request_verbatim: request, deliverable_kind: kind, kind_source: resolved.source, suggestion: resolved.suggestion, family,
      mode_default: mode, site_url: siteUrl ?? null, category: typeof input.category === 'string' ? input.category.slice(0, 80) : null,
      protocol: steps,
      context_requirements: contextRequirements(kind, { siteUrl, hasExistingAsset: input.has_existing_asset }),
      capture: { order: ['capture-brand-dna.mjs (Node + Playwright)', 'brand-dna-snippet.js (browser console)', 'ask for URL, screenshots and CSS'], fields: need.brand_dna ? [...BRAND_DNA_FIELDS] : [], tools: scripts, skills: Object.values(GJP_SKILLS).map(slug => ({ slug, get_skill: { slug, response_format: 'detailed' } })) },
      artifacts: { ...(need.brand_dna ? { brand_dna: 'context/brand-dna.json', screenshots: 'context/screenshots/' } : {}), ...(need.data_snapshot ? { data_snapshot: 'context/data-snapshot.json' } : {}), taste_brief: 'context/taste-brief.md', decisions: 'DECISIONS.md' },
      taste_brief: { path: 'context/taste-brief.md', required_before_production: need.taste_brief, sections: [...TASTE_BRIEF_SECTIONS], questions },
      production_gate: { requires: need, report_as: need.data_snapshot ? { grounding: { data_snapshot: { path: 'context/data-snapshot.json', sha256: '<sha256>', source: '<account or connector>', captured_at: '<ISO date>' } } } : need.brand_dna ? { grounding: { brand_dna: { path: 'context/brand-dna.json', sha256: '<sha256>', source: siteUrl ?? '<site URL>', captured_at: '<ISO date>', method: 'capture-brand-dna.mjs' }, taste_brief: { path: 'context/taste-brief.md', sha256: '<sha256>', brand_codes: ['<code>'], references_admired: ['<ref>', '<ref>'], reference_avoid: ['<ref>'], defaults_to_avoid: defaults.slice(0, 3).map(d => d.id), conventions_break: [] } } } : null, note: 'start_job and advance_job check this structure before PRODUCE. It is a host report, not proof of capture.' },
      diverge: { axes: audit ? ['hypothesis', 'evidence', 'expected_effect'] : ['mechanism_or_promise', 'proof', 'structure', 'visual_world', 'offer'], count: [2, 3], reject: 'Directions that differ only in colour, crop, wording or style label.', patch_mode: mode.mode === 'patch' ? 'Directions are alternative change-sets to the live asset: ranked edits, each with its evidence.' : null },
      craft_rubric: rubric, gates,
      hand_over: { summary_first: 'A one-screen summary: what changed, why, and what to check first.', word_budget: WORD_BUDGETS[kind] ?? WORD_BUDGETS.other, detail_goes_to: ['DECISIONS.md', 'an appendix'] },
      proven_levers: levers,
      defaults_to_avoid: defaults, defaults_source: patterns.length ? `catalogue:${GJP_SKILLS.defaults}/patterns.json` : 'embedded:DESIGN.md AI-default list',
      next: { team: { tool: 'start_job', arguments: { request, deliverable_kind: kind, ...(siteUrl ? { site_url: siteUrl } : {}), ...(typeof input.has_existing_asset === 'boolean' ? { has_existing_asset: input.has_existing_asset } : {}) } }, single_skill: { tool: 'search_library', arguments: { query: request.slice(0, 300) } } },
    },
    model_calls: 0, stored_by_service: false,
  };
}
