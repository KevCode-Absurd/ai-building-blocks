// Deliverable families of the work method: what each family captures before work, how each stage applies to it, its
// real candidates, completeness list, craft weights and default context requirements. Pure data and functions, no I/O.
//
// One place per sentence: the method itself lives in packs/shared/WORK-METHOD.md; the capture lists live here and
// render into context/README.md; a job skill carries only its family's stage slice and gates with the job's own
// details filled in.
import type { ContextRequirement, CraftCriterion, DeliverableFamily, JobType } from "../../core/types.ts";

export const FAMILY_LABELS: Record<DeliverableFamily, string> = {
  web_page: "Web pages and sites",
  ad_creative: "Ads and creative",
  copy: "Copy",
  email: "Email",
  audit: "Audits",
  analysis: "Analysis and reports",
  strategy: "Strategy",
  plan: "Plans",
  code: "Code",
  ops_doc: "Operating documents",
  other: "Other work",
};

/** The rubric group in WORK-METHOD.md's craft table that each family is scored with. */
export const RUBRIC_GROUP: Record<DeliverableFamily, string> = {
  web_page: "web_page", ad_creative: "ad_creative", copy: "copy / email", email: "copy / email",
  audit: "audit / analysis", analysis: "audit / analysis", strategy: "strategy / plan", plan: "strategy / plan",
  code: "code / ops_doc / other", ops_doc: "code / ops_doc / other", other: "code / ops_doc / other",
};

/** Words that name a kind of work, checked in this order: "ads performance review" is an audit, "landing page copy" is copy. */
const FAMILY_WORDS: [DeliverableFamily, RegExp][] = [
  ["code", /\b(code|api|sql|schema|refactor|readme|ci|docker|webhook|snippet|regex|parser|database|runbook)\b/],
  ["ops_doc", /\b(templates?|polic(y|ies)|handbook|sop|checklists?|job description|procedures?|faq|knowledge base|macros|canned replies|manual|forms?|kit)\b/],
  ["audit", /\b(audit|teardown|review|health check|diagnos\w*)\b/],
  ["strategy", /\b(strategy|positioning|go-to-market|pricing|proposal)\b/],
  ["email", /\b(e-?mails?|newsletters?|drip)\b/],
  ["copy", /\b(copy|copywriting|headlines?|captions?|scripts?|articles?|blog|posts?|press release|case study|show notes|ebook|guide|bio)\b/],
  ["ad_creative", /\b(ads?|ad creative|creative|graphics|thumbnails?|carousels?|banners?)\b/],
  ["web_page", /\b(landing pages?|web ?pages?|websites?|home ?page|wireframes?|site)\b/],

  ["analysis", /\b(analysis|report|research|synthesis|survey|dashboard|forecast|model|categori[sz]ation|reconciliation|summary|white paper|trend)\b/],
  ["plan", /\b(plan|calendar|roadmap|schedule|budget|spec)\b/],
];

/**
 * The family of a job type: its own `family` when the catalogue sets one, else a deterministic guess from its title,
 * deliverable and area. Order matters: "ad account audit" is an audit, not an ad.
 */
export function familyOf(jt: Pick<JobType, "title" | "deliverable" | "area"> & { family?: DeliverableFamily }): DeliverableFamily {
  if (jt.family) return jt.family;
  if (jt.area === "engineering") return /\b(audit|review)\b/i.test(jt.title) ? "audit" : "code";
  // The title decides first; the deliverable only when the title names no kind of work; the area last.
  for (const text of [jt.title, jt.deliverable]) {
    const t = text.toLowerCase();
    for (const [family, re] of FAMILY_WORDS) if (re.test(t)) return family;
  }
  switch (jt.area) {
    case "data": case "research": case "finance": return "analysis";
    case "people": case "operations": case "customer-support": return "ops_doc";
    case "marketing": case "content": case "sales": case "ecommerce": return "copy";
    default: return "other";
  }
}

/** What to capture for each family, and where it goes. Rendered into context/README.md. */
export const CAPTURE: Record<DeliverableFamily, string[]> = {
  web_page: [
    "The live site: `context/brand-dna.json` (colours with their share of page area, fonts with weights and sizes per role, radius, button and link styles, nav and footer, section order of key pages, image density and style).",
    "Screenshots of the key pages at 390 px and 1440 px wide: `context/screenshots/`.",
    "5 to 10 verbatim voice samples from the site: `context/voice.md`.",
    "Live facts (prices, offers, shipping, reviews, guarantees), each with the date you captured it: `context/facts.md`.",
    "The page's source or platform (Shopify, Webflow, WordPress, a repo), so the build drops into it.",
  ],
  ad_creative: [
    "The brand from the live site: `context/brand-dna.json` and `context/screenshots/`.",
    "The ads running now and their results, read at level 1 through the client's ad account or the platform's ad library: `context/data/`.",
    "Product images and the offer as it stands today: `context/facts.md`, with dates.",
    "2 or 3 competitor or reference ads the client names, or that you find: `context/references.md`.",
  ],
  copy: [
    "5 to 10 verbatim voice samples from their site, emails or posts: `context/voice.md`.",
    "Live facts with capture dates (offer, prices, proof, guarantees): `context/facts.md`.",
    "The words their customers use, from reviews, support tickets or calls: `context/voice.md`, marked as customer words.",
    "The copy it replaces, if any, and how it performed.",
  ],
  email: [
    "3 to 5 emails they have sent, with open and click rates if they have them: `context/voice.md` and `context/data/`.",
    "The list or segment it goes to, and what it already received.",
    "Live facts with capture dates: `context/facts.md`.",
  ],
  audit: [
    "A dated snapshot of the real account or data, pulled at level 1 through the client's connector or an export: `context/data/`.",
    "The date range, the metric definitions and what changed when (launches, price changes, tracking changes).",
    "The client's goal and the numbers they judge success by.",
  ],
  analysis: [
    "The real data or export, unchanged, with its date and source: `context/data/`.",
    "What each field means, and how the numbers are produced.",
    "The decision the analysis has to support.",
  ],
  strategy: [
    "The business as it stands: offer, prices, channels, customers and numbers, each with its source: `context/facts.md`.",
    "2 or 3 competitors or references, and what each does better: `context/references.md`.",
    "Constraints (money, people, time) and what they tried before.",
  ],
  plan: [
    "Current facts, owners and dates: `context/facts.md`.",
    "Constraints and fixed dates, and what has already been decided.",
  ],
  code: [
    "The existing repo or system: language, framework, conventions, how to run and test it.",
    "The files the change touches, read in full before you edit.",
  ],
  ops_doc: [
    "The current document, process or tool it replaces, and who uses it.",
    "The rules it must follow (policy, law, platform), each with its source and date.",
  ],
  other: [
    "Whatever already exists for this job: files, links, past versions and who uses them.",
  ],
};

/**
 * The shared method lists. site/src/jobs/grounding.mjs holds the same lists under the same names, and
 * site/test/jobs-grounding.test.mjs fails when the two copies differ: WORD_BUDGETS, PROVEN_LEVERS, CANDIDATE_AXES,
 * CANDIDATES, CRAFT_METHODS, COMPLETENESS, CONTEXT_LEVELS, CONTEXT_NEED and the craft weights.
 */

/** What candidates must differ on: at least two of these. A new colour, crop or wording is not a candidate. */
export const CANDIDATE_AXES: string[] = ["promise", "proof", "structure", "buyer moment", "offer", "visual world"];

/**
 * Real candidates by family: the part that decides the outcome, made as real work before the build. The 10 Nov 2026
 * blind test found described directions came out the same as a plain model's; made candidates did not.
 */
export const CANDIDATES: Record<DeliverableFamily, string> = {
  web_page: "Three first screens, made in full: headline, proof and the one action.",
  ad_creative: "At least 9 one-line concepts across different promises, proofs and formats, then the strongest written up in full.",
  copy: "Three openings, each written in full: the headline and the first paragraph.",
  email: "Three series arcs, each with email 1 written in full. For one email: three subject lines, each with its opening.",
  audit: "Three competing explanations of the main problem, each with the evidence for it and what would rule it out.",
  analysis: "Three competing explanations, each tested against the data, with what would rule it out.",
  strategy: "Two differently shaped one-page plans, each with what it costs and what it wins.",
  plan: "Two differently shaped one-page plans, each with its totals.",
  code: "When the design is open, two approaches taken far enough to compare: the interface and the trade-off.",
  ops_doc: "When the process is open, two outlines of the steps, with what each costs the team.",
  other: "When the approach is open, two short versions of the part that decides the outcome.",
};

/**
 * The craft skill for a step, by its plain name: [slug, name]. Every agent's toolbox carries these, so the method names
 * them and never sends anyone to search. The address is where the same skill lives in the library. The same list is in
 * site/src/jobs/grounding.mjs.
 */
export const SKILL_ADDRESS = "https://useaiblocks.com/skills/";
export const CRAFT_METHODS = {
  candidates: {
    web_page: ["make-three-first-screens", "Make three first screens"],
    ad_creative: ["make-ad-concept-spread", "Make an ad concept spread"],
    email: ["three-series-arcs", "Three series arcs"],
    strategy: ["two-plan-shapes", "Two plan shapes"],
    plan: ["two-plan-shapes", "Two plan shapes"],
  } as Partial<Record<DeliverableFamily, [slug: string, name: string]>>,
  look: ["make-design-directions", "Make three design directions"],
  choose: ["outside-chooser", "Outside chooser"],
  check: ["clients-eye-check", "Client's-eye check"],
  truth: ["claim-source-trace", "Claim source trace"],
  buyer: ["buyer-can-act-check", "Buyer can act check"],
};

/** "Use \"Make three first screens\": your toolbox has it (address)." for a family whose candidates have a craft skill, else "". */
export function candidateMethodLine(family: DeliverableFamily): string {
  const row = CRAFT_METHODS.candidates[family];
  return row ? ` Use "${row[1]}": your toolbox has it (${SKILL_ADDRESS}${row[0]}).` : "";
}

/**
 * Format completeness by family: what the maker ticks before hand-over. The same blind test marked down ads with no
 * description or price, emails with no product, and plans whose totals did not add up.
 */
export const COMPLETENESS: Partial<Record<DeliverableFamily, string[]>> = {
  web_page: ["one primary action", "proof beside the claim it supports", "works on a 390 px phone screen", "loads fast, with sized images"],
  ad_creative: ["every field the platform needs, including the description", "character counts inside the platform limits", "text and logo inside the placement's safe areas", "the brand and the price named for a cold audience", "the landing URL"],
  email: ["a subject line", "preview text", "one product and one ask in every email", "working links", "an exit rule", "merge tags that match the email tool"],
  plan: ["totals that add up", "dated steps", "an owner for each step", "cut, keep and scale rules", "break-even shown"],
};

/** How much brand context a job takes from the brand file. A job takes its slice, never the whole file. */
export const CONTEXT_LEVELS = {
  none: "No brand context: work from the system, files or data.",
  facts: "Facts only: the offer, prices, customers and numbers, each with its source and date.",
  voice: "Facts and voice: the facts, plus 5 to 10 real lines in the brand's own words.",
  look: "Facts and look: the facts, plus colours, type, components and screenshots.",
  full: "Full: facts, voice and look.",
} as const;
export type ContextLevel = keyof typeof CONTEXT_LEVELS;

/** The default slice by family. Strategy, plans, code and operations work never demand a brand capture. */
export const CONTEXT_NEED: Record<DeliverableFamily, ContextLevel> = {
  web_page: "full", ad_creative: "full", copy: "voice", email: "voice", audit: "facts", analysis: "none",
  strategy: "facts", plan: "facts", code: "none", ops_doc: "none", other: "none",
};

/** The slice a job of this family takes, as one line for a spec sheet or a job skill. */
export function contextNeed(family: DeliverableFamily): { level: ContextLevel; take: string } {
  const level = CONTEXT_NEED[family];
  return { level, take: CONTEXT_LEVELS[level] };
}

/**
 * Craft weights by rubric group (the keys are RUBRIC_GROUP's values). The job carries the largest weight in every
 * group: blind judges score "does it do the job" first, and the old weights put brand or voice fidelity above it.
 * "Own material" is the scoreable stand-in for "better than a plain model": at least one idea, proof or angle that
 * came from this business's real material and would not appear in a generic answer. Truth is a gate, not a score.
 */
export const CRAFT_WEIGHTS: Record<string, [criterion: string, weight: number][]> = {
  "web_page": [["Does the job for the buyer", 30], ["Brand fidelity", 20], ["Launchability", 15], ["Own material", 10], ["Specificity", 10], ["Clarity", 10], ["Distinctiveness vs defaults", 5]],
  "ad_creative": [["Does the job for the buyer", 30], ["Range across named axes", 15], ["Brand fidelity", 15], ["Strategic idea", 10], ["Hook and thumb-stop", 10], ["Platform fit", 10], ["Own material", 10]],
  "copy / email": [["Does the job for the buyer", 30], ["Voice fidelity", 20], ["Specificity", 15], ["Clarity", 15], ["Own material", 10], ["Distinctiveness vs defaults", 10]],
  "audit / analysis": [["Does the job for the decision", 30], ["Evidence quality", 20], ["Prioritised actions with expected impact", 15], ["Correctness", 15], ["Own material", 10], ["Clarity", 10]],
  "strategy / plan": [["Does the job for the decision", 30], ["Actionability", 25], ["Grounded in this business", 20], ["Clarity", 15], ["Own material", 10]],
  "code / ops_doc / other": [["Does the job", 30], ["Correctness", 25], ["Fits the existing system", 20], ["Clarity", 15], ["Own material", 10]],
};

/**
 * A family's craft weights as one line ("Does the job for the buyer 30, Brand fidelity 20, ..."), for a job skill whose
 * job type has no craft rubric of its own. WORK-METHOD.md states only the two rows every family shares.
 */
export function craftWeightsLine(family: DeliverableFamily): string {
  return CRAFT_WEIGHTS[RUBRIC_GROUP[family]].map(([criterion, weight]) => `${criterion} ${weight}`).join(", ");
}

export const OWN_MATERIAL: CraftCriterion = {
  criterion: "Own material", weight: 10,
  test: "At least one idea, proof or angle came from this business's real material and would not appear in a generic answer.",
};
const JOB_TESTS: Record<string, string> = {
  "Does the job for the buyer": "The buyer it is for gets a reason to act and can act today; every acceptance test on the spec sheet passes.",
  "Does the job for the decision": "The client can decide and act today: one recommendation that follows from the evidence; every acceptance test on the spec sheet passes.",
  "Does the job": "It does what was asked on the real system or for the real team; every acceptance test on the spec sheet passes.",
};
const JOB_ROW = /^(job done|job and conversion logic|does the job)\b/i;

/**
 * A job type's own craft rubric, made job-first: its job row (or the group's, when it has none) leads at 30, "Own
 * material" follows at 10, and its other rows keep their order and share the remaining 60 in proportion. Weights still
 * sum to 100. In the catalogue only 1 of 242 job types puts the job first and 92 have no job row at all.
 */
export function jobFirstCraft(rows: CraftCriterion[], family: DeliverableFamily): CraftCriterion[] {
  const [label, weight] = CRAFT_WEIGHTS[RUBRIC_GROUP[family]][0];
  const own = rows.find(r => /^own material\b/i.test(r.criterion));
  const job = rows.find(r => JOB_ROW.test(r.criterion));
  const rest = rows.filter(r => r !== job && r !== own);
  const left = 100 - weight - OWN_MATERIAL.weight, sum = rest.reduce((n, r) => n + r.weight, 0);
  // Largest-remainder rounding, so the scaled rows add up exactly.
  const exact = rest.map(r => (sum ? r.weight * left / sum : left / Math.max(rest.length, 1)));
  const scaled = exact.map(Math.floor);
  const order = exact.map((x, i) => [x - Math.floor(x), i] as const).sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  for (let k = 0, short = left - scaled.reduce((n, x) => n + x, 0); rest.length && k < short; k++) scaled[order[k % order.length][1]]++;
  return [
    { criterion: label, weight: rest.length ? weight : weight + left, test: job?.test ?? JOB_TESTS[label] },
    { ...OWN_MATERIAL, ...(own ? { test: own.test } : {}) },
    ...rest.map((r, i) => ({ ...r, weight: scaled[i] })),
  ];
}

/** The family's GJP slice for a job skill: how each stage applies. `diverge` is the family's real candidates. */
const SLICES: Record<DeliverableFamily, { taste: string; diverge: string; build: string; check: string }> = {
  web_page: {
    taste: "Name the brand codes to keep (type, colour proportions, imagery, pacing, voice) and the defaults to avoid from tools/ai-default-patterns.md.",
    diverge: `${CANDIDATES.web_page} In patch mode each one is the live first screen as you would change it, with its ranked edits and their evidence.`,
    build: "Build on the captured shell: keep the nav, footer, fonts, colour proportions and component styles unless the plan changes them on purpose. Page lines are facts to use, not copy to paste.",
    check: "Run tools/check-brand-fidelity.mjs (or its manual checklist) and test at 390 px and 1440 px.",
  },
  ad_creative: {
    taste: "Name the brand codes to keep and the ad defaults to avoid: one look for every concept, reused hook formulas, product on a gradient.",
    diverge: `${CANDIDATES.ad_creative} A new colour or headline is not a new concept.`,
    build: "Each ad uses the client's real product, offer and voice, sized for its placement. It names the brand and the price for someone who has never heard of them.",
    check: "Confirm each product advertised is live and in stock at its landing URL, and that the set covers different promises and proofs.",
  },
  copy: {
    taste: "Name the voice traits to keep from the samples, and the copy defaults to avoid (\"unlock\", \"elevate\", rule-of-three lists, fake urgency).",
    diverge: CANDIDATES.copy,
    build: "Give their real facts and their customers' words a new framing. No claim without a dated source in context/.",
    check: "Ask of every line: could a competitor publish this unchanged? Rewrite the lines that could.",
  },
  email: {
    taste: "Name the voice traits to keep from their past emails, and the defaults to avoid (fake urgency, generic subject lines).",
    diverge: CANDIDATES.email,
    build: "Write it for the named list or segment, with facts from context/facts.md. Every email shows one product and makes one ask.",
    check: "Check it against the emails they sent before: is it recognisably theirs? Check every link, price and policy against context/facts.md.",
  },
  audit: {
    taste: "Agree the goal and the numbers that matter before you score anything.",
    diverge: CANDIDATES.audit,
    build: "Diagnose this account, then rank the fixes by expected impact, with the number each one should move. Recommend the first fix; do not hand over a menu.",
    check: "Recompute every figure from the snapshot. A checklist score with no account-specific diagnosis fails.",
  },
  analysis: {
    taste: "Agree the decision the analysis supports and how sure it must be.",
    diverge: CANDIDATES.analysis,
    build: "Answer the decision first. Show the working on their data: what each number means, how it was computed, and what the data cannot say.",
    check: "Recompute the key numbers from the source and label each claim as observed, inferred or estimated.",
  },
  strategy: {
    taste: "Ask where they want to be positioned, at what price point, and which brands they admire or avoid.",
    diverge: CANDIDATES.strategy,
    build: "Recommend one, with the runner-up in a line, the first moves, their owners and the measure of success.",
    check: "Check that each claim about the business or market traces to context/, and that every number adds up with its sum shown.",
  },
  plan: {
    taste: "Confirm the fixed dates, owners and limits before you plan.",
    diverge: CANDIDATES.plan,
    build: "Every step has an owner, a date and a finish line a person can check. Where a planning number is unknown, give a working figure with its sum shown, never a blank.",
    check: "Walk the plan against the constraints in context/: does anything clash, and do the totals add up?",
  },
  code: {
    taste: "Follow the repo's own conventions; note any you will break and why.",
    diverge: CANDIDATES.code,
    build: "Deliver runnable files that drop into the existing system, with how to run and test them.",
    check: "Run it, or the tests, and report what ran. Never claim a run that did not happen.",
  },
  ops_doc: {
    taste: "Match the format and words the team already uses.",
    diverge: CANDIDATES.ops_doc,
    build: "Write steps a person can follow, each with an owner and a clear finish.",
    check: "Check every rule against its dated source, and walk the steps as a new team member would.",
  },
  other: {
    taste: "Agree what good looks like for this person before you start.",
    diverge: CANDIDATES.other,
    build: "Fit the work into what already exists.",
    check: "Check it against the job's gates and the person's own goal.",
  },
};

/** The family's stage slice. Its candidates line names the craft skill that makes them, where one exists. */
export function familySlice(family: DeliverableFamily) { const slice = SLICES[family]; return { ...slice, diverge: slice.diverge + candidateMethodLine(family) }; }

/**
 * Word budgets for the hand-over, by family (the same as site/src/jobs/grounding.mjs WORD_BUDGETS). The 9 Nov 2026
 * blind test found grounded work scored lower on clarity than plain model output because it ran long. The 10 Nov rerun
 * found a tight plan budget cut detail the client needed and sent readers to working files they never get.
 */
export const WORD_BUDGETS: Record<DeliverableFamily, string> = {
  web_page: "Hand-over note up to 150 words. Page copy no longer than the live page plus 20%, unless the change says why.",
  ad_creative: "Up to 150 words per concept. The hook fits the placement's visible text (about 125 characters on Meta).",
  copy: "The length the spec sheet names; with none, no longer than the copy it replaces.",
  email: "Body up to 200 words per email, unless the brand's own past emails run longer.",
  audit: "The top 3 fixes on the first screen, and up to 10,000 words in all. Evidence tables go in an appendix.",
  analysis: "The answer and how sure it is on the first screen, and up to 10,000 words in all. Working goes in an appendix.",
  strategy: "A summary up to 250 words first, and up to 10,000 words in all. Keep the specifics someone needs to act: concepts, angles, audiences, numbers.",
  plan: "A summary up to 250 words first, and up to 10,000 words in all. Keep the specifics someone needs to act: concepts, angles, audiences, numbers. Schedules go in tables.",
  code: "A hand-over note up to 150 words: what changed, how to run it, what to check.",
  ops_doc: "Steps a new person can follow in one read, none longer than 40 words.",
  other: "A summary up to 150 words first.",
};

/**
 * What every hand-over also meets (the same as grounding.mjs HANDOVER_FINISH). In the 11 Nov 2026 benchmark, work
 * that left blanks or ran 2 to 4 times longer than a plain answer lost on clarity; complete proposals and a length
 * near the plain answer won 88% of 128 blind verdicts.
 */
export const HANDOVER_FINISH = "No unintended blanks or placeholders; preserve explicitly requested template fields with --requested-template. Put sign-offs once in To confirm outside publishable copy. Follow the matched quality family profile aim, ceiling and shape; the brief can ask for more. tools/check-handover.mjs with --profile <family> passes, along with the applicable v3 clarity, proof and visual checks.";

/**
 * Proven conversion levers by family (the same as grounding.mjs PROVEN_LEVERS). The blind test also found plain
 * output sometimes added a strong lever (star ratings) that grounded work left out, so the job checks for them.
 */
export const PROVEN_LEVERS: Partial<Record<DeliverableFamily, string[]>> = {
  web_page: ["reviews and ratings near the decision", "price, saving and payment options where people choose", "delivery date and shipping cost", "returns and guarantee terms", "stock, size or fit help", "real customer proof and trust marks", "one clear primary action on the first mobile screen"],
  ad_creative: ["a hook in the first line and the first second", "real proof: reviews, numbers or press", "the offer or price, when it helps", "the product in use", "one clear call to action"],
  copy: ["a specific promise in the first line", "real proof next to each claim", "the buyer's main objection, answered", "one clear next step"],
  email: ["a subject line that gives a reason to open", "one main call to action with a direct link", "real proof: reviews or numbers", "a reason to buy now that is true (offer, guarantee or best-sellers)", "footer, unsubscribe and an exit rule for buyers"],
  audit: ["the proven levers for the page, ad or email being audited (the same lists as those jobs), each marked present or missing"],
};

/**
 * The family gates every job skill of the family carries: the hand-over shape with its word budget, the proven levers
 * when the family has them, and the format's completeness list. The gates for every job (acceptance tests, sourced
 * claims, the buyer can act, access) are in WORK-METHOD.md, step 5.
 */
export function familyGates(family: DeliverableFamily): string[] {
  const levers = PROVEN_LEVERS[family], complete = COMPLETENESS[family];
  return [
    `The hand-over fits: the native work first, with context only when needed, with nothing internal in it. ${WORD_BUDGETS[family]} ${HANDOVER_FINISH} Supporting detail goes in an appendix inside the deliverable, never in a file the client does not have.`,
    ...(levers ? [`Proven levers checked on the live asset, each marked present, missing or not applicable: ${levers.join("; ")}. Each missing one is added from real data, or skipped with a reason. The marks stay in your notes, not in the deliverable.`] : []),
    ...(complete ? [`Format complete: ${complete.join("; ")}.`] : []),
  ];
}

const hasField = (jt: JobType, re: RegExp) => jt.spec_fields.some(f => f.type === "url" || re.test(`${f.id} ${f.label}`));

/**
 * The context requirements of a job type: its own when the catalogue sets them, else a default for its family. The
 * default never invents a field: it names the context the family needs and how to get it.
 */
export function contextRequirements(jt: JobType): ContextRequirement[] {
  if (jt.context_requirements?.length) return jt.context_requirements;
  const family = familyOf(jt);
  const site: ContextRequirement = { id: "site_url", label: "Your website, or the page to improve", required: true, how: "Capture it into context/ with tools/capture-brand-dna.mjs or the browser snippet; screenshots and pasted text if neither runs." };
  const assets: ContextRequirement = { id: "existing_assets", label: "What exists now", required: true, how: "Read the current version before you change anything; it is the starting point (patch mode)." };
  const refs: ContextRequirement = { id: "competitors", label: "2 or 3 competitors or brands you admire", required: false, how: "Ask; if they have none, find 2 and say which." };
  const account: ContextRequirement = { id: "account_access", label: "The account or data to read", required: true, how: "Pull a dated snapshot at level 1 (read) through their connector, or ask for an export." };
  switch (family) {
    case "web_page": return [site, refs, { id: "brand_guide", label: "Brand guide, if you have one", required: false, how: "Use it alongside the capture; the live site wins where they differ." }];
    case "ad_creative": return [site, { ...account, required: false, label: "The ad account, or the ads running now", how: "Read at level 1, or look them up in the platform's ad library." }, refs];
    case "copy": case "email": return [hasField(jt, /url|site|link/) ? site : { ...site, label: "Your website or recent copy", how: "Capture voice samples and live facts into context/; pasted copy works too." }, refs];
    case "audit": case "analysis": return [account];
    case "strategy": return [{ ...site, label: "Your website or business facts", how: "Capture the live facts into context/facts.md, each with its date." }, refs];
    default: return [assets];
  }
}
