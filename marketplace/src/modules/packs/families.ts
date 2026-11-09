// Deliverable families of the Grounded Job Protocol (DESIGN.md): what each family captures before work, how each GJP
// stage applies to it, and its default context requirements. Pure data and pure functions, no I/O.
//
// One place per sentence: the protocol itself and the craft-rubric weights live in packs/shared/WORK-METHOD.md; the
// capture lists live here and render into context/README.md; a job skill carries only its family's stage slice with
// the job's own details filled in.
import type { ContextRequirement, DeliverableFamily, JobType } from "../../core/types.ts";

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

/** The family's GJP slice for a job skill: how each stage applies. `{deliverable}` is filled per job. */
const SLICES: Record<DeliverableFamily, { taste: string; diverge: string; build: string; check: string }> = {
  web_page: {
    taste: "Name the brand codes to keep (type, colour proportions, imagery, pacing, voice) and the defaults to avoid from tools/ai-default-patterns.md.",
    diverge: "In patch mode, give 2 or 3 change-sets to the live page, each a ranked list of edits with its evidence. Otherwise, directions that differ on structure, proof or visual world.",
    build: "Build on the captured shell: keep the nav, footer, fonts, colour proportions and component styles unless the plan changes them on purpose.",
    check: "Run tools/check-brand-fidelity.mjs (or its manual checklist) and test at 390 px and 1440 px.",
  },
  ad_creative: {
    taste: "Name the brand codes to keep and the ad defaults to avoid: one look for every concept, reused hook formulas, product on a gradient.",
    diverge: "Concepts differ on at least two of mechanism, proof, visual world and offer. A new colour or headline is not a new concept.",
    build: "Each concept uses the client's real product, offer and voice, sized for its placement.",
    check: "Check range across the named axes and platform fit, then compare with the best reference ad.",
  },
  copy: {
    taste: "Name the voice traits to keep from the samples, and the copy defaults to avoid (\"unlock\", \"elevate\", rule-of-three lists, fake urgency).",
    diverge: "Write 2 or 3 angles that differ on promise, proof or structure, and say which reference each learns from.",
    build: "Use their real facts and their customers' words. No claim without a source in context/.",
    check: "Ask of every line: could a competitor publish this unchanged? Rewrite the ones that pass that test.",
  },
  email: {
    taste: "Name the voice traits to keep from their past emails, and the defaults to avoid (fake urgency, generic subject lines).",
    diverge: "Draft 2 or 3 angles that differ on the reason to open and the proof offered.",
    build: "Write it for the named list or segment, with facts from context/facts.md.",
    check: "Check it against the emails they sent before: is it recognisably theirs?",
  },
  audit: {
    taste: "Agree the goal and the numbers that matter before you score anything.",
    diverge: "Write 2 or 3 competing explanations of why the key numbers moved, each with the evidence that would confirm or kill it.",
    build: "Diagnose this account, then rank the fixes by expected impact, with the number each one should move.",
    check: "Recompute every figure from the snapshot. A checklist score with no account-specific diagnosis fails.",
  },
  analysis: {
    taste: "Agree the decision the analysis supports and how sure it must be.",
    diverge: "Test 2 or 3 competing hypotheses against the data before you settle on one.",
    build: "Show the working on their data: what each number means, how it was computed, and what the data cannot say.",
    check: "Recompute the key numbers from the source and label each claim as observed, inferred or estimated.",
  },
  strategy: {
    taste: "Ask where they want to be positioned, at what price point, and which brands they admire or avoid.",
    diverge: "Give 2 or 3 options with real trade-offs, each grounded in this business's facts.",
    build: "Recommend one, with the first moves, owners and the measure of success.",
    check: "Check that each claim about the business or market traces to context/, and that the options really differ.",
  },
  plan: {
    taste: "Confirm the fixed dates, owners and limits before you plan.",
    diverge: "Where the order of work is open, compare 2 sequences and say when each would win.",
    build: "Every step has an owner, a date and a finish line a person can check.",
    check: "Walk the plan against the constraints in context/: does anything clash?",
  },
  code: {
    taste: "Follow the repo's own conventions; note any you will break and why.",
    diverge: "When the design is open, compare 2 approaches with their trade-offs before you write code.",
    build: "Deliver runnable files that drop into the existing system, with how to run and test them.",
    check: "Run it, or the tests, and report what ran. Never claim a run that did not happen.",
  },
  ops_doc: {
    taste: "Match the format and words the team already uses.",
    diverge: "When the process is open, compare 2 ways of running it and their costs.",
    build: "Write steps a person can follow, each with an owner and a clear finish.",
    check: "Check every rule against its dated source, and walk the steps as a new team member would.",
  },
  other: {
    taste: "Agree what good looks like for this person before you start.",
    diverge: "When the approach is open, compare 2 routes and say when each wins.",
    build: "Fit the work into what already exists.",
    check: "Check it against the job's gates and the person's own goal.",
  },
};

export function familySlice(family: DeliverableFamily) { return SLICES[family]; }

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
