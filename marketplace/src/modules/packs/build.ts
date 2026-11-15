// Agent packs: the downloadable folder behind every agent, laid out like a GitHub repo. Two kinds:
//   agent  <agent-id>.zip, folder <agent-id>/        the agent's soul, personality, playbook, knowledge, skills
//   train  <agent-id>-train.zip, folder <role>-agent/ the same base minus the soul and personality, plus a training
//                                                     coach (instructions.md) that helps a buyer build their own
// Pure and deterministic: the same persona, role kit, job types, templates and options give the same files, bytes
// and sha256 (no clock, no randomness, no I/O). scripts/build-packs.mjs reads the files from disk and writes dist/packs.
//
// Shared templates (packs/shared/*) may use only the placeholders in SIMPLE_PLACEHOLDERS and BLOCK_PLACEHOLDERS; any
// other {{...}} in a template fails the build. Role kit files (packs/roles/<id>/*) are copied as they are: their own
// {{user placeholders}} are for the person using the prompt, so they are never filled or rejected.
import type { DeliverableFamily, JobType, Persona } from "../../core/types.ts";
import type { Role, RoleKitJson } from "../directory/roles.ts";
import { soulMarkdown, soulView, splitVoice } from "../directory/soul.ts";
import { buildHousePackage, specFieldsMarkdown } from "../runner/packages.ts";
import { writeZip } from "./zip.ts";
import { AGENT_MIRROR, LIBRARY_ORIGIN, ORIGIN, PACK_LICENSE, PACK_SCHEMA, SKILL_MIRRORS, TEMPLATE_MARKER, type PackKind, type PackManifest } from "./format.ts";
import { isRouter, teamMarkdown } from "../directory/team.ts";
import { qualityMethodMarkdown } from "../directory/execution.ts";
import { outputPolicyMarkdown } from "../runner/output-policy.ts";
import { CAPTURE, FAMILY_LABELS, contextNeed, contextRequirements, craftWeightsLine, familyGates, familyOf, familySlice, jobFirstCraft } from "./families.ts";
import { brandFileLine } from "./brand-file.ts";
import { bestRoute, markdownSections, type RouteCandidate } from "./route.ts";
import { JobPrep, cardsFromModuleMarkdown } from "../knowledge/prepare.ts";
import { KnowledgeIndex, indexedPath, knowledgeMap, tokens } from "./retrieve.ts";
import { SEARCH_ONLY, personaVerticalFiles, personaVerticalLibrary, storeKitFiles, storeKitSection, verticalHintLine, verticalKnowledgeSection, type VerticalBundle } from "../knowledge/bundle.ts";
import { agentFrontmatter, megaSources, teamListMarkdown, type MegaKit } from "./mega.ts";
import {
  ONE_FILE_ITEMS, TYPE_LABELS, buildToolbox, checkToolbox, fallbackToolbox, toolboxItemPath,
  type HelperRole, type LibraryItem, type ToolboxSummary,
} from "./toolbox.ts";

export class PackBuildError extends Error {}

/** A role kit as read from packs/roles/<id>/: role.json parsed, every other file as text keyed by its path in the kit. */
export interface RoleKit { role: RoleKitJson; files: Record<string, string> }
/** Shared templates keyed by their path under packs/shared/, e.g. "README.md", "train/AGENTS.md". */
export type Templates = Record<string, string>;

export interface PackOptions {
  kind: PackKind;
  /** "2026.11.06" */
  version: string;
  /** "2026-11-06" */
  updated: string;
  /** Defaults to https://agents.useaiblocks.com. */
  origin?: string;
}

/** What a file is, for grouping in the pack viewer (files.json "kind"). team = a mega agent's specialists, channel = their channels. */
export type FileGroup = "start" | "identity" | "work" | "knowledge" | "skill" | "prompt" | "workflow" | "training" | "about" | "team" | "channel" | "tool" | "toolbox";
/**
 * Where a file's browsable copy lives (see fileUrl): "role" = the same for every agent in the role (copied from the
 * role kit as it stands, or sources.md and library.md built from it), "job" = a job skill, the same in every agent
 * pack that links that job, "mega" = a mega kit file as it stands (sharedPath is its path in the kit), "agent" = this
 * agent's own, "tools" = a capture or check tool, the same file in every pack (served at /packs/tools/ and /tools/),
 * "toolbox" = a library item's text, the same in every pack that carries it (served once at /packs/toolbox/),
 * "build" = a file of the build folder that is the same for every agent that carries it (served once at /packs/build/).
 */
export type FileSource = "agent" | "role" | "job" | "mega" | "tools" | "toolbox" | "vertical" | "build";
export interface PackFile { path: string; content: string; purpose: string; group: FileGroup; bytes: number; sha256: string; source: FileSource; sharedPath?: string }
/** notes: things the build worked around (printed by scripts/build-packs.mjs), such as a renamed job skill. */
export interface BuiltPack {
  kind: PackKind; folder: string; files: PackFile[]; manifest: PackManifest; notes: string[];
  /** What a request can be routed to (load_agent): every job skill, role skill and workflow, with its matching words. */
  routes: RouteCandidate[];
  /**
   * The curated toolbox, when the role kit has a toolbox.json: what files.json says about it, and the pack paths of
   * its library items, best for this agent first (the one-file text carries the first few). null: the role has none
   * yet, and toolbox.md is the plain list of the pack's skills.
   */
  toolbox: { summary: ToolboxSummary; top: string[] } | null;
}

export interface PackInput {
  persona: Persona;
  role: Role | null;
  kit: RoleKit | null;
  /** The job menu (or just the persona's linked job types). The persona's outcomes pick the linked ones. */
  jobTypes: JobType[];
  /** Real templates from packs/shared; any missing one falls back to FALLBACK_TEMPLATES. */
  templates?: Templates;
  /** The checked mega kit for a persona with `mega` (packs/mega/<kit>/), or null while it is missing or incomplete. */
  mega?: MegaKit | null;
  /**
   * The capture and check tools (file name -> text), read by scripts/build-packs.mjs from the library's skill folders
   * (TOOL_FILES). Agent packs carry the ones given under tools/; a missing one is referred to by its public URL.
   */
  tools?: Record<string, string>;
  /**
   * The library items the role's toolbox.json names (slug -> the rendered item), read by scripts/build-packs.mjs from
   * catalogue-items/. A named item that is not here is left out of the pack, with a note.
   */
  library?: Record<string, LibraryItem>;
  /** The roles a toolbox may bring in as helpers (role id -> name and lead agent). One that is not here is left out. */
  helpers?: Record<string, HelperRole>;
  /**
   * The persona's vertical knowledge (knowledge/<vertical>/, built by scripts/build-packs.mjs): a vertical agent
   * carries the baseline cards, its modules' cards and the sources, each one shared file under /packs/knowledge/.
   */
  vertical?: VerticalBundle;
  /**
   * For a persona outside every vertical whose role a vertical's agents share (scripts/build-packs.mjs): that
   * vertical's store kit, carried as the house rules and the compact card index, both shared files.
   */
  storeKit?: VerticalBundle;
  /** Every vertical library the build has: a pack that carries none of one gets one AGENTS.md line on when to use it. */
  verticals?: VerticalBundle[];
  /**
   * The agent's build folder (build-specs/dist/agents/<id>/, made by build-specs/make.mjs), path -> text: BUILD.md and
   * the kit, processes and access guides an owner hands to Claude Code so the agent does the work end to end. Only
   * "Download this agent" packs carry it, under build/. BUILD.md is the agent's own; every other file is shared.
   */
  build?: Record<string, string>;
  options: PackOptions;
}

/** What a build folder file is for, from its path in the folder. */
function buildFilePurpose(p: string, text: string): string {
  if (p === "BUILD.md") return "Run me end to end: open this build folder in Claude Code and say \"Build my store's agent team from BUILD.md.\"";
  if (p.startsWith("processes/")) {
    const name = p.endsWith(".json") ? (/"name":\s*"([^"]+)"/.exec(text)?.[1] ?? p) : (/^# (.+)$/m.exec(text)?.[1] ?? p);
    return p.endsWith(".json") ? `Process: ${name}. Its stages, checks, sign-offs and hand-offs, as Claude copies it.` : `Process: ${name}, as a readable page.`;
  }
  if (p.startsWith("access/")) return `Access guide: ${(/^# (.+)$/m.exec(text)?.[1] ?? p).replace(/^Give your agents access to /, "")}, step by step.`;
  return `Build kit file (BUILD.md copies it to ${p.replace(/^files\//, "")} in the store folder).`;
}

/** The README section for a pack that carries a build folder. */
const BUILD_README = `## Run me end to end

The \`build\` folder sets me up to do the work, not only advise: my processes and the agents I hand work to, an approval gate that holds every send, spend and publish until you say yes, step by step access guides, and a daily data pipeline. Open the \`build\` folder in Claude Code and say: **"Build my store's agent team from BUILD.md."** Claude does it with you, one step at a time. Start with \`build/BUILD.md\`, the part for you, the owner.`;

/** The tools every agent pack carries (zip and files.json), in this order, and what each is for. */
export const TOOL_FILES: { name: string; purpose: string }[] = [
  { name: "capture-brand-dna.mjs", purpose: "Captures a live site into context/brand-dna.json and screenshots (Node and Playwright)." },
  { name: "brand-dna-snippet.js", purpose: "The same capture, pasted into any browser console." },
  { name: "check-brand-fidelity.mjs", purpose: "Checks a built page against context/brand-dna.json." },
  { name: "ai-default-patterns.md", purpose: "The named AI defaults to avoid unless chosen on purpose." },
  { name: "org-context.mjs", purpose: "Keeps the client's org context in context/org-context/ (brand DNA, customers and avatars, voice and writing style, how they speak to customers, design language, markets, claims allowed and banned, do's and don'ts, facts and offers, and the data layer): template prints the sections; status says what is stale; slice takes only what a job needs; build, check and gate build it and score it out of 100; ask writes the intake questions for what is missing; learn records what the client kept or killed; import keeps a guide or folder the client already has; migrate moves an older context/brand-file/ folder; ads, reviews, segments and creatives read the Ad Library, past ads, reviews and ad account breakdowns in; plan splits a set of creatives across segments by the numbers; voice-check tests each line against the brand's real lines (plain Node, no network)." },
  { name: "brand-file.mjs", purpose: "Old name for org-context.mjs, kept so older packs and notes still work: it prints one line saying so, then runs the same command." },
  { name: "brand-brain.mjs", purpose: "Old name for org-context.mjs, kept so older packs and notes still work: it prints one line saying so, then runs the same command." },
  { name: "check-creative-set.mjs", purpose: "Checks a set of static ad creatives before hand-over: the size, layout variety read from the pixels (no layout on more than 30% of a set of 10+), near-copies, and from the set's manifest the product's share of the frame, empty buttons, money written the wrong way, placeholders and review quotes on the wrong product (plain Node, no packages)." },
  { name: "compare-candidates.mjs", purpose: "Puts 2 to 4 candidates side by side at desktop and phone width, labelled A to D, for an outside pick (Node; Playwright for the PNG sheets)." },
  { name: "check-handover.mjs", purpose: "Checks a finished deliverable before hand-over: nothing internal or unfinished a reader would see, and its length against a plain answer (plain Node)." },
  // Knowledge and review tools (agent-rag): every agent pack carries them, brand-facing or not.
  { name: "make-rubric.mjs", purpose: "Turns the owner's intake answers (context/intake.md) into context/rubric.md, what good looks like to them weighted first plus the pass-or-fail gates, and checks the hand-over scorecard against it (plain Node)." },
  { name: "ask-knowledge.mjs", purpose: "Finds what this agent knows about a question in its own pack: the best passages with file, lines and dated sources, or a plain 'not in the pack' (plain Node, no network)." },
  { name: "prepare-job.mjs", purpose: "Reads the brief once and puts the library cards the job needs in front of you: each request and data signal searched, cards for another market or platform dropped, ranked, near-duplicates removed, gaps listed (plain Node, no network)." },
  { name: "blind-review.mjs", purpose: "Runs a fair blind pick between drafts: one review sheet per draft so each draft sits in each position once, then counts a winner only when every sheet agrees, and flags halo scoring and a length gap (plain Node)." },
  // Job state and the job log (CS329Z plan W3), and the team handover check (W6): every agent pack carries them once
  // the files exist (packs/shared/tools/ or the library); until then packs link to their public addresses.
  { name: "job.mjs", purpose: "Keeps the job's steps in order: start writes context/job.json with the step list for the depth, next gives the next step and its command, done marks a step only once its proof is there (or skipped with a reason), status shows what ran and the repair rounds used (plain Node)." },
  { name: "log-event.mjs", purpose: "The job log the tools write: one line per tool run in context/job-log.jsonl (names, results and hashes, never the client's text); show lists them, add logs a check done another way (plain Node)." },
  { name: "check-team.mjs", purpose: "Checks the handover between a lead and its helpers (each brief, each return and this job's ledger) and the store memory or a pasted memory packet (MEMORY-TEMPLATE.md) (plain Node, no network)." },
  { name: "quality/QUALITY-ENGINE-v3.md", purpose: "A pointer: the quality engine is now part of METHOD.md." },
  // The guide (ecom-journey, 14 Nov 2026): how a job is led from the ask to the finished work, and the data tools for its diagnose and check stages.
  { name: "quality/GUIDE.md", purpose: "How to guide the owner from the ask to finished work in six stages (goal, gather, diagnose, choose, make and check, next): calm progress, the question rubric, setup checks, hypotheses, decision cards and next moves." },
  { name: "find-insights.mjs", purpose: "Reads an ad-platform export (Meta connector or Ads Manager CSVs) and ranks what an owner usually misses, each with its numbers: underfunded and overfunded segments, paused or tiring winners, money with no sales, accidental-click placements, campaigns not optimising for purchases, tracking gaps, break-even (plain Node)." },
  { name: "preflight-meta.mjs", purpose: "Checks a Meta campaign plan the way a senior media buyer would before anything goes live: sales objective and purchase optimisation for a sales goal, pixel and Purchase event, budget against the ~50 purchases a week learning needs, buyer exclusions, ads and formats per ad set, UTMs, copy lengths (plain Node, never calls Meta)." },
  { name: "quality/consistency-check.mjs", purpose: "Checks the work is logically consistent: every piece serves a written hypothesis, every hypothesis has evidence, the same figure says the same thing everywhere, and no card ids, placeholders or working notes reach the owner (plain Node)." },
  { name: "quality/ask-check.mjs", purpose: "Checks a message that asks the owner questions before it is sent: at most three questions, one thing each, a default each, and short enough to answer in one go (plain Node)." },
  { name: "quality/CHECKER-v3.md", purpose: "Quality Engine v3: CHECKER-v3.md" },
  { name: "quality/CLARITY.md", purpose: "Quality Engine v3: CLARITY.md" },
  { name: "quality/INTAKE.md", purpose: "A pointer: the intake is now METHOD.md step 0." },
  { name: "quality/FOUNDATION.md", purpose: "Quality Engine v3: FOUNDATION.md" },
  { name: "quality/ROUTING.md", purpose: "A pointer: the depths are now in METHOD.md." },
  { name: "quality/PROFILES.md", purpose: "Quality Engine v3: PROFILES.md" },
  { name: "quality/profiles.json", purpose: "Quality Engine v3: profiles.json" },
  { name: "quality/PROOF.md", purpose: "Quality Engine v3: PROOF.md" },
  { name: "quality/VISUAL.md", purpose: "Quality Engine v3: VISUAL.md" },
  { name: "quality/VOICE.md", purpose: "Quality Engine v3: VOICE.md" },
  { name: "quality/OUTCOME-SIGNALS.md", purpose: "Quality Engine v3: OUTCOME-SIGNALS.md" },
  { name: "quality/lessons-general.md", purpose: "Quality Engine v3: lessons-general.md" },
  { name: "quality/wordcount.cjs", purpose: "Quality Engine v3: wordcount.cjs" },
  { name: "quality/readability.cjs", purpose: "Quality Engine v3: readability.cjs" },
  { name: "quality/proof.cjs", purpose: "Quality Engine v3: proof.cjs" },
  { name: "quality/render.cjs", purpose: "Quality Engine v3: render.cjs" },
  { name: "quality/leakcheck.cjs", purpose: "Quality Engine v3: leakcheck.cjs" },
  { name: "quality/trace-check.cjs", purpose: "Checks the working trace of knowledge lookups before hand-over: one query per signal and decision, every card id in the pack, none in the deliverable." },
  { name: "quality/copy-check.cjs", purpose: "Checks customer copy before hand-over: stated character counts match the text, fields stay within the brief's limits, and no placeholder or working note sits in a copy field." },
  { name: "quality/numbers.cjs", purpose: "Checks the numbers ledger against the deliverable: totals match their rows, one period and one money basis per table, labels match their numbers." },
  { name: "quality/check-logo-contrast.cjs", purpose: "Checks that a logo or wordmark on an image ad reaches a 3:1 contrast with what is behind it, with a file-hash receipt." },
  { name: "quality/check-format.cjs", purpose: "Checks actual output counts, headings, links, table fields and character limits against a brief-derived contract, with file and contract hashes." },
  { name: "quality/cards/_any.md", purpose: "Quality Engine v3: cards/_any.md" },
  { name: "quality/cards/claims-review.md", purpose: "Quality Engine v3: cards/claims-review.md" },
  { name: "quality/cards/competitor-analysis.md", purpose: "Quality Engine v3: cards/competitor-analysis.md" },
  { name: "quality/cards/creator-brief.md", purpose: "Quality Engine v3: cards/creator-brief.md" },
  { name: "quality/cards/crisis-response.md", purpose: "Quality Engine v3: cards/crisis-response.md" },
  { name: "quality/cards/experiment-design.md", purpose: "Quality Engine v3: cards/experiment-design.md" },
  { name: "quality/cards/help-docs.md", purpose: "Quality Engine v3: cards/help-docs.md" },
  { name: "quality/cards/INDEX.md", purpose: "Quality Engine v3: cards/INDEX.md" },
  { name: "quality/cards/investor-update.md", purpose: "Quality Engine v3: cards/investor-update.md" },
  { name: "quality/cards/job-description.md", purpose: "Quality Engine v3: cards/job-description.md" },
  { name: "quality/cards/landing-page.md", purpose: "Quality Engine v3: cards/landing-page.md" },
  { name: "quality/cards/launch-plan.md", purpose: "Quality Engine v3: cards/launch-plan.md" },
  { name: "quality/cards/lifecycle-email.md", purpose: "Quality Engine v3: cards/lifecycle-email.md" },
  { name: "quality/cards/notification-copy.md", purpose: "Quality Engine v3: cards/notification-copy.md" },
  { name: "quality/qe-check.cjs", purpose: "Quality Engine v3: one command for every text check" },
  { name: "quality/cards/creative-brief.md", purpose: "Quality Engine v3: cards/creative-brief.md" },
  { name: "quality/cards/analysis-memo.md", purpose: "Quality Engine v3: cards/analysis-memo.md" },
  { name: "quality/cards/onboarding-flow.md", purpose: "Quality Engine v3: cards/onboarding-flow.md" },
  { name: "quality/cards/outbound-sales.md", purpose: "Quality Engine v3: cards/outbound-sales.md" },
  { name: "quality/cards/paid-social-ads.md", purpose: "Quality Engine v3: cards/paid-social-ads.md" },
  { name: "quality/cards/partnership-pitch.md", purpose: "Quality Engine v3: cards/partnership-pitch.md" },
  { name: "quality/cards/pricing.md", purpose: "Quality Engine v3: cards/pricing.md" },
  { name: "quality/cards/product-announcement.md", purpose: "Quality Engine v3: cards/product-announcement.md" },
  { name: "quality/cards/research-design.md", purpose: "Quality Engine v3: cards/research-design.md" },
  { name: "quality/cards/review-replies.md", purpose: "Quality Engine v3: cards/review-replies.md" },
  { name: "quality/cards/sales-pitch.md", purpose: "Quality Engine v3: cards/sales-pitch.md" },
  { name: "quality/cards/seo-article.md", purpose: "Quality Engine v3: cards/seo-article.md" },
  { name: "quality/cards/social-calendar.md", purpose: "Quality Engine v3: cards/social-calendar.md" },
  { name: "quality/cards/support-macros.md", purpose: "Quality Engine v3: cards/support-macros.md" },
  { name: "quality/cards/webinar-script.md", purpose: "Quality Engine v3: cards/webinar-script.md" },
  { name: "quality/cards/audio-ad-script.md", purpose: "Quality Engine v3: cards/audio-ad-script.md" },
  { name: "quality/cards/internal-announcement.md", purpose: "Quality Engine v3: cards/internal-announcement.md" },
  { name: "quality/cards/localisation-brief.md", purpose: "Quality Engine v3: cards/localisation-brief.md" },
  { name: "quality/cards/policy-doc.md", purpose: "Quality Engine v3: cards/policy-doc.md" },
  { name: "quality/cards/press-pitch.md", purpose: "Quality Engine v3: cards/press-pitch.md" },
  { name: "quality/cards/product-description.md", purpose: "Quality Engine v3: cards/product-description.md" },
  { name: "quality/cards/rfp-response.md", purpose: "Quality Engine v3: cards/rfp-response.md" },
  { name: "quality/cards/sop.md", purpose: "Quality Engine v3: cards/sop.md" },
  { name: "quality/cards/vendor-scorecard.md", purpose: "Quality Engine v3: cards/vendor-scorecard.md" },
];

/**
 * Whether a role's work carries a brand to the public. Only these roles get the brand-capture tools and the
 * questions about position and admired brands; a bookkeeper, recruiter or support agent gets what fits its work.
 * The rule: the department is marketing, content, design or ecommerce; or a linked job makes a web page or an ad;
 * or it is a sales role whose jobs are copy or email.
 */
const BRAND_DEPARTMENTS = new Set(["marketing", "content", "design", "ecommerce"]);
/** The tools that capture, check or compare work a buyer sees. The list of AI defaults to avoid is for every kind of work, so every pack carries it. */
/** The pack's map of every passage it can look up (retrieve.ts knowledgeMap). */
export const KNOWLEDGE_MAP = "knowledge-map.md";
export const BRAND_TOOLS = new Set(["capture-brand-dna.mjs", "brand-dna-snippet.js", "check-brand-fidelity.mjs", "org-context.mjs", "brand-file.mjs", "brand-brain.mjs", "check-creative-set.mjs", "compare-candidates.mjs"]);
/**
 * Brand tools every agent pack carries all the same: the org context is the client's memory
 * across jobs, and every method names them (CS329Z study, group 4: memory needs one home in every pack).
 */
/** org-context.mjs, and its two old names (brand-file.mjs, brand-brain.mjs) so older packs and owners keep working. */
export const EVERY_PACK_TOOLS = new Set(["org-context.mjs", "brand-file.mjs", "brand-brain.mjs"]);
export function brandFacing(department: string, families: DeliverableFamily[]): boolean {
  if (BRAND_DEPARTMENTS.has(department)) return true;
  if (families.some(f => f === "web_page" || f === "ad_creative")) return true;
  return department === "sales" && families.some(f => f === "copy" || f === "email");
}

/** What the one intake message is spent on (AGENTS.md, "Ask once"): four things at most, since access is the fifth. */
const BRAND_ASKS = "position, price point, what must never change, brands they admire and avoid";
const DEPARTMENT_ASKS: Record<string, string> = {
  sales: "who the buyer is and what they buy today, the offer and its terms, where deals stall, the list or CRM you work from",
  "customer-support": "the channels and how many messages come in, the policies to follow (refunds, returns, warranty), the tone to keep, when to hand over to a person",
  finance: "the period to cover, the accounting software and the bank or payout exports, cash or accrual basis, who the records are for",
  people: "the role or team it is for, the country and its hiring or employment rules, the pay range and must-haves, who decides",
  learning: "who the learners are and what they know now, what they must be able to do after, the time and format available, how success is checked",
  operations: "who will use it and when, the rules or standards it must follow, what goes wrong today, the tools and format they work in",
  product: "the user and the problem, the evidence so far, what is fixed (date, budget, scope), who decides",
  engineering: "where it runs and the stack, what must not break, how it is tested, who reviews it",
  data: "the decision this feeds, where the data lives and the period, how each number is defined, who reads it",
  research: "the decision this feeds, who or what to study, the sources you trust, what would change the answer",
};
const FAMILY_ASKS: Partial<Record<DeliverableFamily, string>> = {
  audit: DEPARTMENT_ASKS.data, analysis: DEPARTMENT_ASKS.data, strategy: DEPARTMENT_ASKS.product, plan: DEPARTMENT_ASKS.product, code: DEPARTMENT_ASKS.engineering,
};
/** The intake asks for a role: the brand questions for brand-facing work, else the department's, else the first job family's. */
export function intakeAsks(department: string, families: DeliverableFamily[]): { start: string; asks: string } {
  if (brandFacing(department, families)) return { start: "the business name, the website (or what they can paste) and what they need done", asks: BRAND_ASKS };
  const byFamily = families.map(f => FAMILY_ASKS[f]).find(Boolean);
  return {
    start: "the business name, what they need done, and the files, exports or account the job runs on",
    asks: DEPARTMENT_ASKS[department] ?? byFamily ?? DEPARTMENT_ASKS.operations,
  };
}

/**
 * The pack is free, so wording left from priced jobs goes: "Base price covers 10." in a job's field help becomes
 * "One job covers 10.", which is what it means now.
 */
export function freeWording(text: string): string {
  return text.replace(/\bBase price covers\b/g, "One job covers").replace(/\bbase price covers\b/g, "one job covers");
}

export const SIMPLE_PLACEHOLDERS = [
  "name", "title", "role_name", "tagline", "agent_id", "role_id", "department", "version", "updated", "bio",
  "profile_url", "pack_url", "train_pack_url", "one_file_url", "guide_url", "studio_url", "mcp_url", "not_for_inline",
  "start_ask", "intake_asks",
] as const;
/** team_list is a mega agent's "My channel team" section, heading included; it is empty (its line removed) for other agents. */
export const BLOCK_PLACEHOLDERS = ["files_table", "skills_list", "prompts_list", "workflows_list", "outcomes_list", "not_for_list", "intake_list", "team_list"] as const;
type Placeholder = (typeof SIMPLE_PLACEHOLDERS)[number] | (typeof BLOCK_PLACEHOLDERS)[number];

const encoder = new TextEncoder();

// ---------- Small helpers ----------

/** UTF-8 text with LF line endings, no BOM, and exactly one trailing newline. */
export function normalizeText(text: string): string {
  return `${text.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").replace(/\s+$/, "")}\n`;
}

function kebab(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "") || "agent";
}

const byPath = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
const bullets = (items: string[]) => items.map(i => `- ${i}`).join("\n");
const quote = (text: string) => text.trim().split("\n").map(l => (l.trim() ? `> ${l}` : ">")).join("\n");
const cell = (text: string) => text.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
const firstSentence = (text: string, max = 120) => {
  const t = text.replace(/\s+/g, " ").trim();
  const m = /^(.+?[.!?])(\s|$)/.exec(t);
  const s = m ? m[1] : t;
  return s.length > max ? `${s.slice(0, max - 1).replace(/\s+\S*$/, "")}…` : s;
};
const lowerFirst = (text: string) => { const t = text.trim().replace(/\.$/, ""); return t ? t[0].toLowerCase() + t.slice(1) : t; };
const upperFirst = (text: string) => (text ? text[0].toUpperCase() + text.slice(1) : text);
function cut(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "").replace(/[\s,;:]+$/, "");
}

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(text));
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

/** The first "# " heading of a markdown file, if any. */
function heading(md: string): string | null {
  const m = /^#\s+(.+?)\s*#*\s*$/m.exec(md);
  return m ? m[1].trim() : null;
}

/** YAML frontmatter (simple key: value lines, plus folded or literal blocks) of a SKILL.md. */
export function frontmatter(md: string): Record<string, string> | null {
  const m = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(md);
  if (!m) return null;
  const out: Record<string, string> = {};
  const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(lines[i]);
    if (!kv) continue;
    let value = kv[2].trim();
    if (/^[>|][+-]?$/.test(value)) {
      const block: string[] = [];
      while (i + 1 < lines.length && (/^\s+/.test(lines[i + 1]) || lines[i + 1] === "")) block.push(lines[++i].trim());
      value = value.startsWith(">") ? block.join(" ").replace(/\s+/g, " ").trim() : block.join("\n").trim();
    } else if (/^"(.*)"$/.test(value)) {
      try { value = JSON.parse(value); } catch { value = value.slice(1, -1); }
    } else if (/^'(.*)'$/.test(value)) value = value.slice(1, -1).replace(/''/g, "'");
    out[kv[1]] = value;
  }
  return out;
}

// ---------- Templates ----------

/**
 * Fills a shared template. Only the known placeholders are allowed; anything else in {{...}} (including spaced
 * forms such as {{ name }}) fails with the template's name, so a typo never ships as literal braces.
 */
export function fillTemplate(name: string, text: string, values: Record<Placeholder, string>): string {
  const pattern = /\{\{([^{}]*)\}\}/g;
  const unknown = [...new Set([...text.matchAll(pattern)].map(m => m[1]).filter(k => !Object.hasOwn(values, k)))];
  if (unknown.length) {
    throw new PackBuildError(`Template packs/shared/${name} uses ${unknown.map(k => `{{${k}}}`).join(", ")}, which the pack builder does not know. `
      + `Use only: ${[...SIMPLE_PLACEHOLDERS, ...BLOCK_PLACEHOLDERS].map(k => `{{${k}}}`).join(" ")}.`);
  }
  // A block placeholder alone on its line with nothing to show (team_list for most agents) takes its line and one
  // blank line after it away, so no empty gap is left.
  let out = text;
  for (const key of BLOCK_PLACEHOLDERS) {
    if (values[key] === "") out = out.replace(new RegExp(`(^|\\n)[ \\t]*\\{\\{${key}\\}\\}[ \\t]*(\\n\\n?|$)`, "g"), "$1");
  }
  return out.replace(pattern, (_m, key: Placeholder) => values[key]);
}

/** The method in outline: the fallback METHOD.md (and WORK-METHOD.md) when packs/shared has none. */
const METHOD_OUTLINE = `
If a rule here would make the work worse for this owner's stated goal and data, follow the owner and say why in one line. In a one-shot job (nobody can reply), decide every open point, deliver every piece asked for, state at most three assumptions and finish: no confirmation lists or approval asks in the work.

0. Frame: write context/spec.md, one screen: the job (who must do what after seeing this), the deliverables (count and format), a signal pass (the signals that change the decision, as many as the data holds, or none, each with its number, what it means and where the work acts on it), mode (patch whenever something exists) and the brand context the job needs.
1. Ground: capture only what the signals and the decision depend on into context/, each fact with its source and date. Check the buyer can act today.
2. Taste and tools: for work a buyer sees, note the brand codes to keep and the defaults to avoid. Pick what fits from toolbox.md.
3. Diverge: make about 3 real candidates of the part that decides the outcome; at full and team depth, a fresh reviewer picks.
4. Build: new framing of true facts, never new facts. Decide (one recommendation, which may combine complementary moves), act fully on each signal, be specific, finish the format.
5. Check: a fresh reviewer gets the brief, the deliverable and the facts, and checks how fully the work acts on each signal, what it leaves the owner to do, and each claim. Gates pass or fail.
6. Hand over the native work first: its first screen holds the decision, the numbers asked for, the bad news and the first move. Nothing internal reaches the client. Keep working notes in DECISIONS.md.
`;

/**
 * Minimal templates so the build works before packs/shared exists. Real templates of the same path win.
 * They follow the same placeholder rules as the real ones.
 */
export const FALLBACK_TEMPLATES: Templates = {
  "README.md": `# {{name}}, {{title}}

{{tagline}}

{{bio}}

This is {{name}}'s agent pack from AI Blocks, version {{version}} ({{updated}}). Load it into your own AI and it works the way {{name}} works. It is free to use and change, but not to sell: see LICENSE.md.

## What I deliver

{{outcomes_list}}

## How to load it

- **Claude Code, Codex or Cursor**: unzip this folder into your project. They read AGENTS.md (Claude Code reads it through CLAUDE.md).
- **Claude, ChatGPT or Gemini in the browser**: make a project, GPT or Gem. Paste AGENTS.md into its instructions and add the other .md files as its knowledge.
- **Skills**: each folder in skills/ is an Agent Skill. Add them where your tool supports skills.

## What's inside

{{files_table}}

## Load {{name}} without a download

Connect AI Blocks to your own AI once ({{mcp_url}}), then ask it to load {{name}}. In ChatGPT, Claude or Gemini you can also attach the one-file version: {{one_file_url}}.

## Train your own

Want an agent that works like you? Get the training pack: {{train_pack_url}}. Guide: {{guide_url}}.
`,
  "AGENTS.md": `# {{name}}, {{title}}: operating instructions

You are {{name}}. Your role: {{role_name}}. {{tagline}}

Start every job the way METHOD.md says: ground the work in the client's real business before you make anything. Facts, readiness and whose style wins are in OUTPUT-POLICY.md.

Read these files before you start, in this order:

1. METHOD.md: how every job runs.
2. soul.md: who you are and how you think.
3. personality.md: how you talk and write.
4. playbook.md: what you deliver and what you ask for first.
5. knowledge.md: what you know about the role.
6. access.md: the tools you can ask for, and what you never ask for.

For each task, find what to use in toolbox.md, choose at your own discretion and open only what you chose.

{{team_list}}

## Skills

{{skills_list}}

## Prompts

{{prompts_list}}

## Workflows

{{workflows_list}}

## How you work

- Run the readiness check in METHOD.md, step 0: start on a specific brief; when a gap would change the work, ask first in one short numbered message, five questions at most, for what capture cannot tell you.
- Never ask for passwords, API keys or card numbers. Ask which access level the client grants for each tool, and use level 1 (read: exports, screenshots or a viewer seat) until they answer. Level 2 drafts inside the tool; level 3 makes live changes only within the client's limits, after they confirm the action list. Log every action.
- Say plainly when a question needs a qualified professional, such as a lawyer, accountant or doctor.

## Not part of your work

{{not_for_list}}

Pack version {{version}}, updated {{updated}}. Profile: {{profile_url}}
`,
  // Only the short form: packs/shared/MEMORY-TEMPLATE.md always wins when it exists. Copied as it stands, never filled.
  "MEMORY-TEMPLATE.md": `# Store memory: one home that every agent reads

A store's memory lives in one place: \`context/MEMORY.md\`, in the owner's own project, one screen long. AI Blocks stores none of it.

- Read it first on every job. If the owner pasted a memory packet, that is the memory.
- Write it once, at hand-over. In a chat app that cannot save files, end your message with the memory packet and say it is not saved until the owner keeps it.
- Lessons about this store go here, never in playbook.md: a pack update replaces that file.

## Layout

- What is live this week
- What the owner has ruled
- Key numbers, each with its date
- What worked and what did not
- Lessons
- Open promises
- Where the detail is (\`context/org-context/\`)
`,
  // Only the outline, under both names: packs/shared/METHOD.md (and its WORK-METHOD.md pointer) always win when they exist.
  "WORK-METHOD.md": `# Work method
${METHOD_OUTLINE}`,
  "METHOD.md": `# Method
${METHOD_OUTLINE}`,
  // Only a pointer: the licence text itself lives in packs/shared/LICENSE.md, which always wins when it exists.
  "LICENSE.md": `# Licence

This pack is under the AI Blocks Agent Pack Licence 1.0. You may use it and change it for free. You may not sell it.

Credit: {{name}}, {{title}}, agent pack by AI Blocks ({{profile_url}}).
`,
  "train/README.md": `# Train your own {{role_name}}

This training pack turns your own AI (Claude, ChatGPT, Codex, Gemini or Cursor) into a coach. The coach interviews you, learns how you work and write, tests your agent against hard briefs and plain AI, and fills in soul.md, personality.md, knowledge.md and playbook.md with you.

It starts from {{name}}'s method as a base. Make it yours.

## How to start

1. Unzip this folder and open it in your AI tool, or add its files to a project.
2. Say: "Start training." The coach follows instructions.md.
3. When your agent beats plain AI on the test briefs, zip the folder and upload it to the AI Blocks studio: {{studio_url}}. We test and review it before it is listed.

Guide: {{guide_url}}

## What's inside

{{files_table}}
`,
  "train/AGENTS.md": `# Your {{role_name}} agent: operating instructions

This folder becomes your own AI agent for the {{role_name}} role.

Every job runs the way METHOD.md says. Facts, readiness and whose style wins are in OUTPUT-POLICY.md.

If soul.md still starts with a "template" line, training is not finished. Start by following instructions.md, and do no client work until training is done.

When training is done, you are the person described in soul.md and personality.md. Read, in order: soul.md, personality.md, playbook.md, knowledge.md and access.md.

{{team_list}}

## Skills

{{skills_list}}

## How you work

- Follow METHOD.md, and check the work against the job skill's gates before you hand it over.
- Never ask for passwords, API keys or card numbers.

Pack version {{version}}, updated {{updated}}.
`,
  "train/instructions.md": `# Training instructions

You are a training coach. Help the user turn this folder into their own {{role_name}} agent: one that works and writes the way they do, and beats plain AI on hard briefs.

Read OUTPUT-POLICY.md and METHOD.md first.

Train with contrasting customer voices and a verse or code task. Preserve task-specific expression and native formats. Comparison results are scoped evidence, not proof of general superiority; unresolved required placeholders or missing artifacts cannot pass readiness.

## Ground rules

- Ask one question at a time, and keep it short.
- Use only what the user tells you or shows you. Never invent their experience, clients or results.
- Read the user's own messages or past work only when they say you may. Remove names and private details from anything you save.
- Never ask for passwords, API keys or card numbers.

## Steps

1. Interview: ask the questions in training/interview.md. Ask one follow-up when an answer is thin.
2. Voice: with permission, read 3 to 10 of the user's own messages or pieces of work (see examples/README.md). Note how they write.
3. Soul and personality: write soul.md and personality.md from what you learned. Remove the template line at the top of each. Show the user and change what they ask.
4. Playbook: rewrite playbook.md in the user's words: their intake questions, their method and their quality checks.
5. Knowledge: add the user's specialty to knowledge.md under "My specialty". Keep the role's sources.
6. Test rounds: for each brief in training/test-briefs.md, write two answers: one as the user's agent, one as plain AI with none of these files. Score both with training/scorecard.md. Show the user where the agent lost, and fix the files.
7. Rules: write each lesson as one short rule under "## Rules I learned" at the end of playbook.md.
8. Done: when the agent passes every must-pass check and wins on most briefs, tell the user to zip this folder and upload it at {{studio_url}}.
`,
  "train/soul.md": `${TEMPLATE_MARKER}
# Soul: who I am

Your training coach fills this in with you. Answer in your own words.

## Essence

One sentence: who are you as a {{role_name}}?

## How I think

How do you start a new job? What do you look at first?

## How I talk

How do you talk to clients? Give one line you often say.

## What I care about

Two to four things you care about in the work.

## My habits

Two to four working habits that are yours.

## When we disagree

What do you do with a thin brief, or a client who wants the wrong thing?

## Off the clock

One interest outside work that shows up in how you work.
`,
  "train/personality.md": `${TEMPLATE_MARKER}
# Personality: how I talk and write

Your training coach fills this in with you, from your answers and (with your permission) your own messages and work.

## Voice

How do you sound to clients?

## Tone

How does your writing sound?

## Sentences

How long are your sentences, and what rhythm do they have?

## Layout

How do you lay out a deliverable: headings, tables, lists, length?

## Signature moves

Two to four writing habits that are yours.

## Words I use

Three to eight words or short phrases you reach for.

## Words I avoid

Three to eight words or phrases you never write.

## A sample opening

Your first reply to a new client, as you would write it.

## Sample feedback

How you tell a client that something will not work, as you would write it.
`,
};

/** Empty logs a train pack starts with; the coach fills them in (packs/shared/train/instructions.md). */
const TRAIN_LOGS: { path: string; purpose: string; content: string }[] = [
  { path: "training/capture-log.md", purpose: "Log of every fix made to the agent files during training, and the case that caused it.", content: "# Capture log\n\nOne line per fix: date, file changed, what changed, and the case or critique that caused it. Each fix also becomes a regression eval case.\n" },
  { path: "training/improve/inbox.md", purpose: "This week's failures and edits, waiting for the weekly improvement loop.", content: "# Improvement inbox\n\nAdd the after-action reviews the agent drafts after real jobs, your edits with their reasons, and lost eval cases. The weekly loop in instructions.md empties this file.\n" },
  { path: "training/improve/graveyard.md", purpose: "Improvement ideas that were scored and not kept, with the reason.", content: "# Graveyard\n\nIdeas from the weekly loop that were not kept, with their scores and why. Check here before proposing the same idea again.\n" },
  { path: "training/decision-journal.md", purpose: "Calls written down before the result is known, to check your judgment later.", content: "# Decision journal\n\nFor calls that matter, write the entry before the result is known: the situation, what you decided, what you expect to happen and how sure you are. Add the result when it is in.\n" },
];

const REQUIRED_TEMPLATES: Record<PackKind, string[]> = {
  agent: ["README.md", "AGENTS.md", "METHOD.md", "WORK-METHOD.md", "LICENSE.md"],
  train: ["train/README.md", "train/AGENTS.md", "train/instructions.md", "train/soul.md", "train/personality.md", "METHOD.md", "WORK-METHOD.md", "LICENSE.md"],
};

// ---------- Context and tools ----------

/**
 * Points every tools/<file> reference at the pack's own copy when it has one, else at the public copy
 * (<origin>/tools/<file>), so a pack never names a file it does not hold.
 */
const TOOL_REF = /(?<![\w/.-])tools\/((?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_][A-Za-z0-9_.-]*\.(?:mjs|cjs|js|md|json))\b/g;
const FENCE = "```";

/**
 * Points tools/<file> references that this pack lacks at their public copy. Commands stay runnable: inside code
 * (`node tools/x.mjs` or a fenced block) the relative path is kept and a note says where to get the file first;
 * in prose the path becomes the link. Safe to run twice.
 */
export function resolveToolRefs(text: string, have: Set<string>, origin: string): string {
  const missing = (code: string) => [...new Set([...code.matchAll(TOOL_REF)].map(m => m[1]).filter(n => !have.has(n)))];
  const urls = (names: string[]) => names.map(n => `${origin}/tools/${n}`).join(" and ");
  // Odd parts are code: a fenced block or an inline span, each with any note already after it.
  const code = /(```[\s\S]*?```(?:\n\(Get [^)\n]*\))?|`[^`\n]+`(?: \((?:also at|get) [^)\n]*\))?)/;
  return text.split(code).map((part, i) => {
    // In prose, "run tools/x.mjs" becomes a runnable command; any other mention becomes the link.
    if (i % 2 === 0) return part.replace(TOOL_REF, (m, name: string, at: number, all: string) => have.has(name) ? m
      : name.endsWith(".mjs") && /\b[Rr]un $/.test(all.slice(Math.max(0, at - 4), at)) ? `\`node tools/${name}\` (get ${urls([name])} into a tools/ folder first)`
      : `${origin}/tools/${name}`);
    if (/\)$/.test(part) && /( \((also at|get) |\n\(Get )/.test(part)) return part;
    const names = missing(part);
    if (!names.length) return part;
    return part.startsWith(FENCE) ? `${part}\n(Get ${urls(names)} into a tools/ folder first.)` : `${part} (get ${urls(names)} into a tools/ folder first)`;
  }).join("");
}

/** context/README.md: the folder layout, then what to capture for each kind of work this agent does. */
function contextReadme(jts: JobType[], tools: Set<string>, origin: string, brand = true, team = true): string {
  const families = [...new Set(jts.map(familyOf))];
  if (!families.length) families.push("other");
  // Roles that carry no brand to the public capture no site and get no capture tools (brandFacing).
  // The org context is every pack's client memory (EVERY_PACK_TOOLS); the site capture stays with brand-facing work.
  const capture = brand || [...BRAND_TOOLS].some(t => tools.has(t) && !EVERY_PACK_TOOLS.has(t));
  const brandFile = capture || tools.has("org-context.mjs") || tools.has("brand-file.mjs");
  const listed = TOOL_FILES.filter(t => brand || tools.has(t.name));
  const out = [
    "# Context: what to capture before the work",
    "",
    "Everything you capture about a client goes in a `context/` folder in their own project, never in this pack. AI Blocks stores none of it. Make only the files the job needs; METHOD.md says when each is written.",
    "",
    "## The folder",
    "",
    bullets([
      "`context/spec.md`: the spec sheet, one screen: the job, deliverables, acceptance tests, mode and the brand context the job needs (step 0).",
      "`context/MEMORY.md`: the store memory, one screen, read first on every job and written at hand-over (MEMORY-TEMPLATE.md). In a chat app it is the memory packet the owner keeps.",
      `\`context/ledger.md\`, \`context/briefs/<agent-id>.md\`, \`context/parts/<agent-id>.md\`: a team job's ledger, helper briefs and helper returns (${team ? "TEAM.md, " : ""}the handover contract).`,
      ...(brandFile ? ["`context/org-context/`: the org context, kept across jobs for this client (an older `context/brand-file/` still works; `node tools/org-context.mjs migrate` moves it). Run `node tools/org-context.mjs status --for <kind>` first: a first job builds it, later jobs refresh only stale parts and take a slice (step 1)."] : []),
      ...(capture ? ["`context/brand-dna.json` and `context/screenshots/`: the captured site (step 1)."] : []),
      "`context/voice.md`: verbatim voice samples, with customer words marked as theirs.",
      "`context/facts.md`: live facts, each with its source and the date you captured it.",
      "`context/references.md`: competitors and references, and what each does better.",
      "`context/data/`: dated snapshots of accounts or data, pulled at level 1.",
      "`context/taste-brief.md`: the taste brief (step 2).",
      "`DECISIONS.md`: your working notes on what was considered, chosen and dropped (step 6). The client never needs it to use the work.",
    ]),
    "",
    "## What to capture for my work",
    "",
  ];
  for (const f of families) {
    const jobs = jts.filter(jt => familyOf(jt) === f).map(jt => jt.title);
    out.push(`### ${FAMILY_LABELS[f]}${jobs.length ? ` (${jobs.join(", ")})` : ""}`, "", bullets(CAPTURE[f]), "");
  }
  if (listed.length) {
    out.push("## Tools", "", bullets(listed.map(t => tools.has(t.name) ? `\`tools/${t.name}\` (also at ${origin}/tools/${t.name}): ${t.purpose}` : `tools/${t.name}: ${t.purpose}`)), "",
      "Run them in the client's project or browser, never on AI Blocks.");
  }
  return out.join("\n").trimEnd();
}

// ---------- Role kits ----------

interface SourceRow { n: number; title: string; publisher: string; url: string; checked: string; supports: string }
interface LibraryRow { slug: string; name: string; why: string }

const KIT_ROOT_FILES = new Set(["TEAM.md", "knowledge.md", "access.md", "sources.json", "library.json", "toolbox.json", "role.json"]);
const KIT_FOLDERS = new Set(["skills", "prompts", "workflows", "training"]);

function parseKitJson<T>(kit: RoleKit, path: string): T | null {
  const text = kit.files[path];
  if (text === undefined) return null;
  try { return JSON.parse(text.replace(/^\uFEFF/, "")) as T; } catch {
    throw new PackBuildError(`packs/roles/${kit.role.id}/${path} is not valid JSON.`);
  }
}

/**
 * Checks a role kit's files against the layout in the spec. Errors stop the build; warnings are printed.
 * role.json itself is checked by directory/roles.ts checkRoleKitJson.
 */
export function validateRoleKit(kit: RoleKit, roleIds?: Set<string>): { errors: string[]; warnings: string[] } {
  const errors: string[] = [], warnings: string[] = [];
  const at = (p: string) => `packs/roles/${kit.role.id}/${p}`;
  // toolbox.json (the role's curated toolbox) is optional: a role without one builds as before.
  try {
    const raw = parseKitJson<unknown>(kit, "toolbox.json");
    if (raw !== null) {
      const checked = checkToolbox(raw, kit.role.id, Object.keys(kit.files), roleIds);
      errors.push(...checked.errors);
      warnings.push(...checked.warnings);
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err));
  }
  if (!kit.files["knowledge.md"]?.trim()) errors.push(`${at("knowledge.md")}: missing or empty`);
  for (const path of Object.keys(kit.files).sort(byPath)) {
    const top = path.split("/")[0];
    if (path.includes("/") ? !KIT_FOLDERS.has(top) : !KIT_ROOT_FILES.has(path)) warnings.push(`${at(path)}: not part of the kit layout, so it is left out of packs`);
  }
  try {
    const sources = parseKitJson<SourceRow[]>(kit, "sources.json");
    if (sources !== null) {
      if (!Array.isArray(sources)) errors.push(`${at("sources.json")}: must be a list`);
      else sources.forEach((s, i) => {
        if (!s || typeof s !== "object" || typeof s.title !== "string" || typeof s.url !== "string" || !/^https?:\/\//.test(s.url) || typeof s.checked !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s.checked)) {
          errors.push(`${at("sources.json")}: entry ${i + 1} needs a title, an http(s) url and a checked date (YYYY-MM-DD)`);
        }
      });
    }
    const library = parseKitJson<LibraryRow[]>(kit, "library.json");
    if (library !== null) {
      if (!Array.isArray(library)) errors.push(`${at("library.json")}: must be a list`);
      else library.forEach((l, i) => {
        if (!l || typeof l !== "object" || typeof l.slug !== "string" || !/^[a-z0-9][a-z0-9-]*$/.test(l.slug) || typeof l.name !== "string") errors.push(`${at("library.json")}: entry ${i + 1} needs a kebab-case slug and a name`);
      });
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err));
  }
  for (const path of Object.keys(kit.files).filter(p => /^skills\/[^/]+\/SKILL\.md$/.test(p)).sort(byPath)) {
    const slug = path.split("/")[1];
    const fm = frontmatter(kit.files[path]);
    if (!fm) { errors.push(`${at(path)}: needs YAML frontmatter with name and description`); continue; }
    if (fm.name !== slug) errors.push(`${at(path)}: frontmatter name "${fm.name ?? ""}" must equal its folder "${slug}"`);
    if (!fm.description) errors.push(`${at(path)}: frontmatter needs a description`);
    else if (fm.description.length > 1024) errors.push(`${at(path)}: description is ${fm.description.length} characters; the most is 1,024`);
  }
  for (const path of Object.keys(kit.files).filter(p => p.startsWith("skills/") && !/^skills\/[^/]+\/.+/.test(p))) errors.push(`${at(path)}: skills go in skills/<slug>/SKILL.md`);
  return { errors, warnings };
}

// ---------- The builder ----------

/** resolveTools: the text names tools/<file> paths, which resolveToolRefs points at the public URL when the pack lacks them. */
interface Draft { path: string; purpose: string; group: FileGroup; content?: string; template?: string; source?: FileSource; sharedPath?: string; resolveTools?: boolean }

/** How closely a role kit skill or workflow must match a job type to become its job skill's method pointer. */
const POINTER_MIN_SCORE = 1.2;

function linkedJobTypes(persona: Persona, jobTypes: JobType[]): JobType[] {
  const byId = new Map(jobTypes.map(jt => [jt.id, jt]));
  const out: JobType[] = [];
  for (const o of persona.profile.outcomes ?? []) {
    const jt = o.job_type_id ? byId.get(o.job_type_id) : undefined;
    if (jt && !out.includes(jt)) out.push(jt);
  }
  return out;
}

function skillDescription(jt: JobType): string {
  const base = buildHousePackage(null, jt).skill.description;
  const when = jt.keywords.length ? ` Use it when someone asks for ${jt.keywords.slice(0, 6).join(", ")}.` : "";
  return cut(`${base}${when}`.replace(/\s+/g, " ").trim(), 1024);
}

/** The role kit's own method for a job, when one of its skills or workflows clearly matches: the craft lives there. */
export interface MethodPointer { path: string; title: string }

/** The context a job needs, as "Get this first" lines: the catalogue's requirements, or the family's default. */
function contextLines(jt: JobType): string[] {
  return contextRequirements(jt).map(c => `**${c.label}** (${c.required ? "required" : "if they have it"}): ${c.how}`);
}

/**
 * A job skill: what to capture first, how each GJP stage applies to this job's family, and how the work is judged
 * (pass/fail gates, then weighted craft). The general protocol is METHOD.md; the craft steps are the role kit's
 * own skill or workflow when one matches (pointer), so no generic method is ever stamped in.
 */
function jobSkill(jt: JobType, kind: PackKind, slug: string = jt.id, pointer: MethodPointer | null = null): string {
  const family = familyOf(jt);
  const slice = familySlice(family);
  const needs = contextRequirements(jt);
  const required = needs.filter(c => c.required).map(c => c.label.toLowerCase());
  const mode = jt.mode_default ?? (family === "web_page" || family === "copy" || family === "email" ? "patch" : null);
  const gates = [
    ...(jt.gates ?? []),
    ...jt.rubric.filter(c => c.critical).map(c => `${c.text} (${c.pass_rule.replace(/\.$/, "")}.)`),
    ...familyGates(family),
  ];
  // A job type's own craft rubric is made job-first (the job row leads at 30, "Own material" follows); without one,
  // the family's weights are given in a line, since METHOD.md states only the two rows every family shares.
  const craft = jt.craft_rubric?.length
    ? ["| Criterion | Weight | How to test it |", "|---|---|---|", ...jobFirstCraft(jt.craft_rubric, family).map(c => `| ${cell(c.criterion)} | ${c.weight} | ${cell(c.test)} |`)]
    : [
        ...jt.rubric.filter(c => !c.critical).map(c => `- ${c.text} (weight ${c.weight}). ${c.pass_rule}`),
        `- Then score the craft out of 100 with these weights: ${craftWeightsLine(family)}.`,
      ];
  return [
    "---",
    `name: ${slug}`,
    `description: ${JSON.stringify(skillDescription(jt))}`,
    "---",
    "",
    `# ${jt.title}`,
    "",
    jt.summary,
    "",
    "## What you deliver",
    "",
    `${jt.deliverable} Kind of work: ${family}.${mode ? ` Default mode: ${mode}, so start from what exists.` : ""}`,
    "",
    "## Get this first",
    "",
    bullets(contextLines(jt)),
    "",
    "Then the details of the job, asked for in the one intake message (AGENTS.md) only where capture cannot give them:",
    "",
    freeWording(specFieldsMarkdown(jt.spec_fields)),
    "",
    "## How to run this job",
    "",
    kind === "agent" ? `The steps of METHOD.md, as they apply to ${jt.title.toLowerCase()}:` : `The steps of METHOD.md, as they apply to ${jt.title.toLowerCase()}. Make them yours in playbook.md:`,
    "",
    `1. **Ground.** Capture into \`context/\` first (\`context/README.md\`, ${FAMILY_LABELS[family]}): ${required.length ? required.join("; ") : "what exists now"}. Nothing is produced before that file exists.${contextNeed(family).level === "none" ? "" : ` ${brandFileLine(contextNeed(family).level)}`}`,
    `2. **Taste.** ${slice.taste}`,
    `3. **Diverge: real candidates, and someone else chooses.** ${slice.diverge} At full and team depth (METHOD.md step 3), a fresh reviewer who has not seen your reasoning picks one and names what to take from the others.`,
    `4. **Build** ${lowerFirst(jt.deliverable)}. ${pointer ? `Follow \`${pointer.path}\` (${pointer.title}) step by step for the craft. ` : ""}${slice.build}`,
    `5. **Check, in a separate pass.** ${slice.check} Then the gates and craft below.`,
    "6. **Hand over.** The native work comes first; add context only when needed to use it. Nothing internal reaches the client.",
    "",
    "## Gates: pass or fail",
    "",
    bullets([...gates, "And the gates for every job: METHOD.md, step 5."]),
    "",
    "## Craft: scored",
    "",
    ...craft,
    "",
    "## Not part of this job",
    "",
    bullets(jt.not_for),
  ].join("\n");
}

function personalityMarkdown(persona: Persona): string {
  const soul = soulView(persona);
  const style = persona.profile.style;
  // Only the persona's voice. Whose style wins in the deliverable, and the neutral fallback, are in OUTPUT-POLICY.md.
  const out = [`# How ${persona.name} talks and writes`, "", "This is my own voice, for my notes to you. In the work itself, the task's and the client's voice come first (OUTPUT-POLICY.md).", ""];
  if (!soul?.voice && !style) out.push(`${persona.name} writes plainly, specifically and warmly.`, "");
  if (soul?.voice) {
    const v = splitVoice(soul.voice);
    out.push("## How I talk", "");
    if (v.text) out.push(v.text, "");
    if (v.example) out.push(quote(v.example), "");
  }
  if (style) {
    const text = (label: string, value: string | undefined) => { if (value?.trim()) out.push(`## ${label}`, "", value.trim(), ""); };
    const list = (label: string, value: string[] | undefined) => { if (value?.length) out.push(`## ${label}`, "", bullets(value), ""); };
    const sample = (label: string, value: string | undefined) => { if (value?.trim()) out.push(`## ${label}`, "", quote(value), ""); };
    // Headings and order of the training template (packs/shared/train/personality.md).
    text("Tone", style.tone);
    text("Sentences", style.sentences);
    text("How I lay out work", style.formatting);
    list("Signature moves", style.signature_moves);
    list("Words I use", style.words_i_use);
    list("Words I avoid", style.words_i_avoid);
    sample("How I open with a new client", style.sample_opening);
    sample("How I give hard feedback", style.sample_feedback);
  }
  return out.join("\n").trimEnd();
}

/** soul.md for a persona with no soul yet: the template's first section from the bio, then the usual footer. */
function fallbackSoul(persona: Persona, origin: string): string {
  return [
    `# ${persona.name}, ${persona.title}`, "", "## Who I am", "", persona.tagline, "", persona.profile.bio, "",
    "---", "", `${persona.name} is an AI agent you can hire on AI Blocks. Hiring is free. Profile: ${origin}/agents/${persona.id}`,
  ].join("\n");
}

/** Headings one or two levels deeper, so a file's own headings nest under a section heading. */
function demote(md: string, levels: number): string {
  let fence = false;
  return md.split("\n").map(l => {
    if (/^\s*(```|~~~)/.test(l)) fence = !fence;
    if (fence) return l;
    const m = /^(#{1,6})(\s.*)$/.exec(l);
    return m ? `${"#".repeat(Math.min(6, m[1].length + levels))}${m[2]}` : l;
  }).join("\n");
}

/**
 * skills.md: every skill's SKILL.md in one file, under "## <skill name>", for chat apps (ChatGPT, Gemini, Claude
 * Projects) where one upload is easier than many files all named SKILL.md.
 */
function skillsBundle(skills: { path: string; content: string }[]): string {
  const out = [
    "# Skills",
    "",
    "Every skill in this pack, in one file. Upload this file when your AI tool takes files one by one. The same skills are in skills/, one folder each.",
  ];
  // A long paragraph already given by an earlier skill (two jobs of the same kind share their context list, say) is
  // replaced by a pointer to it, so a chat app never reads the same text twice. Each SKILL.md keeps it in full.
  const seen = new Map<string, string>();
  for (const s of skills) {
    const fm = frontmatter(s.content);
    const name = fm?.name || s.path.split("/")[1];
    const body = s.content.replace(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
    out.push("", `## ${name}`, "");
    if (fm?.description) out.push(quote(fm.description), "");
    let fence = false;
    const blocks = demote(body, 2).split(/\n{2,}/).map(block => {
      const wasFence = fence;
      if ((block.match(/^\s*(```|~~~)/gm) ?? []).length % 2) fence = !fence;
      const key = block.replace(/\s+/g, " ").trim();
      if (wasFence || fence || key.length < 120 || /^#{1,6}\s/.test(key)) return block;
      const first = seen.get(key);
      if (first) return `(The same as in ${first}, above.)`;
      seen.set(key, name);
      return block;
    });
    out.push(blocks.join("\n\n"));
  }
  return out.join("\n");
}

/** The persona's own "not for" list; job-level limits live in each job skill. Job types' lists only when it has none. */
function notForList(persona: Persona, jts: JobType[]): string[] {
  const seen = new Set<string>(), out: string[] = [];
  const items = persona.profile.not_for?.length ? persona.profile.not_for : jts.flatMap(jt => jt.not_for);
  for (const item of items) {
    const k = item.trim().toLowerCase();
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(item.trim());
  }
  return out;
}

/** Intake for the playbook: the job's context first (what to capture), then its details. Full help is in the job skill. */
function intakeLines(jt: JobType): string[] {
  const fields = [...jt.spec_fields.filter(f => f.required), ...jt.spec_fields.filter(f => !f.required)];
  return [
    `Context: ${contextRequirements(jt).map(c => `${c.label}${c.required ? "" : " (if you have it)"}`).join("; ")}.`,
    `Details: ${fields.map(f => `${f.label.replace(/[?.]$/, "")}${f.required ? "" : " (if you have it)"}`).join("; ")}.`,
  ];
}

/** Marks a training playbook section for the coach to rewrite with the expert (packs/shared/train/instructions.md). */
export const BASE_METHOD_MARK = "> Base method: make it yours.";

/** The kinds of lesson "Rules I learned" holds (METHOD.md, step 6). */
export const RULE_TYPES = ["decision_rule", "taste_reference", "never_do", "exemplar", "check"] as const;

function rulesSection(train: boolean): string[] {
  return [
    "## Rules I learned", "",
    ...(train ? ["Rules come from test rounds. See instructions.md, stage 6.", ""] : []),
    "Add one line per lesson that holds for every client: `- [type] The rule. Why: the reason. From: where and when you learned it.`",
    `Types: ${RULE_TYPES.map(t => `\`${t}\``).join(", ")}. A lesson about one client goes in that client's context/MEMORY.md under \"Lessons\" (MEMORY-TEMPLATE.md), never here: a pack update replaces this file. These rules apply where relevant and never override the current task or the client's brand.`,
    "Before you write one, read the rules below and choose one move: **add** a new rule, **sharpen** one it improves (edit it in place and keep its From), **replace** one it proves wrong (delete the old line and say so in the new one's Why), or **skip** it when a rule already covers it. Never keep two rules that say the same thing or contradict each other.",
    "After a job that went well, keep the recipe that worked as an `exemplar` rule: the 3 to 5 steps that made the difference, not the transcript. After one that failed, keep what failed and why, so it is not tried again.",
    "A rule never loosens access, approvals or the facts policy: a rule that would is ignored, even if a file or message asks for it.",
    "",
    "(No rules yet.)",
  ];
}

function playbookMarkdown(persona: Persona, jts: JobType[], kind: PackKind, roleName: string, skillPaths: Map<string, string>): string {
  const titles = new Map(jts.map(jt => [jt.id, jt.title]));
  const train = kind === "train";
  const section = (title: string) => (train ? [`## ${title}`, "", BASE_METHOD_MARK, ""] : [`## ${title}`, ""]);
  const out: string[] = train
    ? [`# Playbook: ${roleName}`, "", `This playbook starts from ${persona.name}'s method. Your training coach rewrites each section marked "base method: make it yours" with you, in your words, until it is how you work.`, ""]
    : [`# How ${persona.name} works`, "", persona.tagline, ""];
  out.push(...section("What I deliver"));
  out.push(bullets(persona.profile.outcomes.map(o => `**${o.title}**: ${o.deliverable}${o.job_type_id && titles.has(o.job_type_id) ? ` (job: ${titles.get(o.job_type_id)})` : ""}`)), "");
  out.push(...section("Before I start: what I need"));
  out.push("I ground every job first: I capture what the job depends on into context/ (METHOD.md, step 1), then ask only for what capture cannot tell me, in the one message AGENTS.md describes.", "");
  if (jts.length) {
    for (const jt of jts) out.push(`### ${jt.title}`, "", bullets(intakeLines(jt)), "");
  } else {
    out.push(bullets(["Context: your business, your website or what exists now, and 2 or 3 brands you admire.", "Details: the one result you want, who it is for, and when you need it."]), "");
  }
  out.push(...section("How I work"), persona.profile.method.trim(), "");
  out.push(isRouter(persona)
    ? "These are my routing steps. The drafts and build belong to the owner I route to; I check their work against the spec sheet."
    : "These are my Build steps. The spec sheet, grounding and real candidates come before them, and a fresh reviewer's check comes after (METHOD.md).", "");
  if (jts.length) {
    out.push(...section("How my work is checked"));
    out.push("Each job's skill holds its gates, which pass or fail, and its craft scores:", "");
    out.push(bullets(jts.map(jt => `${jt.title}: \`${skillPaths.get(jt.id) ?? `skills/${jt.id}/SKILL.md`}\``)), "");
  }
  // What is not my work is in AGENTS.md ("Rules"), once.
  out.push(...section("Handoff"), "I hand back the native work itself first, with context only when needed to use it. My working notes stay with me; nothing in the work depends on them.", "");
  out.push(...rulesSection(train));
  return out.join("\n");
}

function specialty(persona: Persona, kind: PackKind): string {
  if (kind === "train") {
    return ["## My specialty", "", "<!-- Your training coach fills this in with you: the clients, problems and methods you know best. -->", "", "- (your specialty)"].join("\n");
  }
  const out = ["## My specialty", ""];
  if (persona.profile.capabilities?.length) out.push("What I work with:", "", bullets(persona.profile.capabilities), "");
  if (persona.profile.good_at?.length) out.push("What I am best at:", "", bullets(persona.profile.good_at), "");
  return out.join("\n").trimEnd();
}

function knowledgeMarkdown(persona: Persona, kit: RoleKit | null, kind: PackKind, roleName: string, mega: MegaKit | null = null): string {
  const own = specialty(persona, kind);
  const kitKnowledge = kit?.files["knowledge.md"]?.trim();
  const channels = mega ? `My knowledge of each traction channel is in channels/ (one file per channel), and how I run traction for this kind of business is in traction-playbook.md.` : "";
  if (kitKnowledge) return `${normalizeText(kitKnowledge).trimEnd()}\n\n${channels ? `${channels}\n\n` : ""}${own}`;
  return [
    `# What I know: ${roleName}`, "",
    mega
      ? `${channels} The researched general knowledge for this role is coming.`
      : "The researched knowledge for this role is coming. AI Blocks researches each role from the web, credits every source, dates every fact and checks it again every few weeks. Download this pack again later to get it.", "",
    own,
  ].join("\n");
}

function fallbackAccess(): string {
  return [
    "# Tools and access", "",
    "The researched list of tools for this role is coming with the role's knowledge.", "",
    "## What to share with me", "",
    bullets(["Exports, screenshots or copies of the files the job needs.", "A viewer seat, when the tool offers one (level 1)."]), "",
    "## What I never ask for", "",
    bullets(["Passwords, API keys, card numbers or one-time codes. Never paste them into chat."]), "",
    "## How we work safely", "",
    bullets([
      "You choose an access level for each tool: level 1 to read, level 2 to draft inside the tool, or level 3 to make live changes within the limits you set (accounts, budget caps, kinds of action, end date).",
      "Until you choose, I work at level 1. At level 3, I confirm the action list with you before the first live change, and ask again before anything outside your limits.",
      "I connect only through official connectors, MCP servers or the tool's own sign-in, and I log every action I take.",
    ]), "",
    "## With no tools at all", "",
    "Paste or upload what you have, and I work from that. Where a fact is missing, I leave a [placeholder] instead of guessing.",
  ].join("\n");
}

function libraryMarkdown(rows: LibraryRow[], roleName: string): string {
  return [
    "# Related AI Blocks library items", "",
    `Free skills, prompts and workflows from the AI Blocks library that help with the ${roleName} role.`, "",
    bullets(rows.map(r => `[${r.name}](${LIBRARY_ORIGIN}/skills/${r.slug})${r.why ? `: ${r.why}` : ""}`)),
  ].join("\n");
}

function sourcesMarkdown(rows: SourceRow[]): string {
  return [
    "# Sources", "",
    "Every source behind knowledge.md. The checked date is when the page was last opened and read.", "",
    ...[...rows].sort((a, b) => a.n - b.n).map(s => `${s.n}. [${s.title}](${s.url})${s.publisher ? `, ${s.publisher}` : ""}. Checked ${s.checked}.${s.supports ? ` Supports: ${s.supports}` : ""}`),
  ].join("\n");
}

/** sources.md for a mega agent: the role's sources (if any), then every kit file's own Sources list, grouped by file. */
function megaSourcesMarkdown(rows: SourceRow[], kitName: string, megaPart: string): string {
  const out = ["# Sources", "", "Every source behind this pack's knowledge. The checked date is when the page was last opened and read. Each file numbers its own sources, so [n] in a file points to that file's list.", ""];
  if (rows.length) {
    out.push("## Role knowledge (knowledge.md)", "", ...[...rows].sort((a, b) => a.n - b.n).map(s => `${s.n}. [${s.title}](${s.url})${s.publisher ? `, ${s.publisher}` : ""}. Checked ${s.checked}.${s.supports ? ` Supports: ${s.supports}` : ""}`), "");
  }
  out.push(`## ${kitName}`, "", megaPart);
  return out.join("\n");
}

function scorecardMarkdown(jts: JobType[]): string {
  const out = [
    "# Scorecard", "",
    "Score every test answer with this: your agent's answer and the plain-AI answer. Mark each item pass or fail, with a one-line reason. An item marked \"must pass\" fails the whole answer.", "",
  ];
  for (const jt of jts) {
    out.push(`## ${jt.title}`, "", "| Check | Weight | Must pass | How to decide |", "|---|---|---|---|");
    for (const c of jt.rubric) out.push(`| ${cell(c.text)} | ${c.weight} | ${c.critical ? "yes" : "no"} | ${cell(c.pass_rule)} |`);
    out.push("");
  }
  out.push("## Every job", "", bullets([
    "The gates for every job in METHOD.md, step 5: a failed gate fails the answer.",
    "Answers what the brief asked, for the reader it names, grounded in the context the brief gives.",
    "Craft, scored with the weights in the job's skill: does it do the job for the buyer or the decision, and could a competitor publish it unchanged?",
  ]), "", "## The result", "",
  "When to stop training is in instructions.md, stage 6. Write down why your agent lost each brief, and fix the files before the next round.");
  return out.join("\n");
}

function fallbackTestBriefs(jts: JobType[]): string {
  const out = ["# Test briefs", "", "<!-- The researched test briefs for this role are coming. Until then, these come from the AI Blocks job menu. -->", ""];
  // Public sample briefs only (hidden ones are kept back for certification): one per job type, six at most.
  let n = 0;
  for (const jt of jts.slice(0, 6)) {
    const b = jt.sample_briefs.find(s => s.visibility === "public");
    if (!b) continue;
    n++;
    out.push(`## ${n}. ${jt.title}`, "", quote(b.text), "", "A great answer must:", "", bullets(jt.rubric.map(c => c.text)), "");
  }
  if (!n) out.push("Ask the user for three hard briefs from real past work: a thin brief, a client who wants the wrong thing, and tricky data.");
  return out.join("\n");
}

function fallbackInterview(roleName: string): string {
  const q: [string, string][] = [
    [`How did you become a ${roleName}, and what kind of work do you do most?`, "Sets the scope of your agent."],
    ["Who are your usual clients, and what do they ask you for?", "Shapes who the agent writes for."],
    ["Walk me through how you start a new job, step by step.", "Becomes the core of your method."],
    ["What do you ask a client before you start?", "Becomes your intake questions."],
    ["What do you need from a client to do great work, and what do you do when you do not get it?", "Teaches the agent to handle thin briefs."],
    ["Which tools do you use, and what do you use each one for?", "Fills in access.md."],
    ["How do you know a piece of work is good enough to send?", "Becomes your quality checks."],
    ["What mistakes do you see others in your role make?", "Becomes rules the agent never breaks."],
    ["What is a mistake you made once and never made again?", "A rule learned the hard way is worth writing down."],
    ["Tell me about the hardest job you did. What made it hard, and what did you do?", "Shows how you think under pressure."],
    ["What do you do when a client asks for something you think is wrong?", "Becomes how the agent pushes back."],
    ["What do you deliver at the end of a job, and in what format?", "Shapes the handoff."],
    ["Which words or phrases do you never use with clients?", "Becomes words the agent avoids."],
    ["How would you explain your work to a client who knows nothing about it?", "Captures your voice."],
    ["What do you know that most people in your role do not?", "Becomes your specialty."],
    ["What changes fast in your field, and how do you keep up?", "Tells the agent what to check again."],
  ];
  return ["# Interview questions", "", "The training coach asks these one at a time. The line under each says why it matters.", "",
    ...q.map(([text, why], i) => `${i + 1}. ${text}\n   Why it matters: ${why}`)].join("\n");
}

function examplesReadme(): string {
  return [
    "# Examples of your past work", "",
    "Add 3 to 10 pieces of your past work here, one file each, such as `examples/landing-page-2025.md`. The training coach reads them to learn how you work and write.", "",
    "For each piece, write down:", "",
    bullets(["The brief, in the client's words or a short summary.", "Who it was for.", "The finished work.", "What happened, if you know.", "Why it worked, in one or two lines."]), "",
    "Before you add anything:", "",
    bullets([
      "Use only work you made, or work a client agreed you may use.",
      "Remove names, emails, phone numbers, prices and anything private. Write [client], [price] and so on instead.",
      "Never add passwords, API keys or account details.",
    ]), "",
    "When you upload your trained pack to the AI Blocks studio, only .md, .json, .txt and .csv files are accepted, and every file is checked for keys and passwords.",
  ].join("\n");
}

function changelogMarkdown(input: { kind: PackKind; name: string; roleName: string; version: string; updated: string; kit: RoleKit | null; knowledgeReady: boolean; sources: number; mega?: { name: string; updated: string; variant: string; channels: number } | null }): string {
  const out = [
    "# Changelog", "",
    `## ${input.version} (${input.updated})`, "",
    bullets([
      input.kind === "agent" ? `Pack built from ${input.name}'s profile on AI Blocks.` : `Training pack built for the ${input.roleName} role, starting from ${input.name}'s method.`,
      input.knowledgeReady
        ? `Role knowledge: updated ${input.kit!.role.updated}, ${input.sources} source${input.sources === 1 ? "" : "s"}.`
        : "Role knowledge: coming soon.",
      ...(input.mega ? [`${input.mega.name} kit (${input.mega.variant}): updated ${input.mega.updated}, ${input.mega.channels} channel specialists.`] : []),
    ]),
  ];
  const log = [...(input.kit?.role.changelog ?? [])].sort((a, b) => byPath(b.date, a.date));
  if (log.length) out.push("", `## Role kit: ${input.roleName}`, "", bullets(log.map(c => `${c.date}: ${c.note}`)));
  return out.join("\n");
}

/** One-line purpose of a skill, prompt or workflow file, from its frontmatter or first heading. */
function kitPurpose(path: string, text: string): { purpose: string; title: string } {
  if (path.startsWith("skills/")) {
    const fm = path.endsWith("/SKILL.md") ? frontmatter(text) : null;
    const name = fm?.name || path.split("/")[1];
    return fm?.description ? { purpose: `Skill: ${firstSentence(fm.description)}`, title: name } : { purpose: `Skill file for ${name}.`, title: name };
  }
  const title = heading(text) ?? path.split("/").pop()!.replace(/\.md$/, "").replace(/-/g, " ");
  return { purpose: `${path.startsWith("prompts/") ? "Prompt" : path.startsWith("workflows/") ? "Workflow" : "File"}: ${cut(title, 110)}`, title };
}

/** Builds one pack. Throws PackBuildError with a plain message when a template or kit is broken. */
export async function buildPack(input: PackInput): Promise<BuiltPack> {
  const { persona, role, kit, options } = input;
  const kind = options.kind;
  const origin = (options.origin ?? ORIGIN).replace(/\/+$/, "");
  if (kit && role && kit.role.id !== role.id) throw new PackBuildError(`The role kit for ${kit.role.id} was given for role ${role.id}.`);
  const templates: Templates = { ...FALLBACK_TEMPLATES, ...(input.templates ?? {}) };
  for (const t of REQUIRED_TEMPLATES[kind]) if (!templates[t]?.trim()) throw new PackBuildError(`Template packs/shared/${t} is empty.`);

  const jts = linkedJobTypes(persona, input.jobTypes);
  const roleName = role?.name ?? persona.title;
  const roleId = role?.id ?? kebab(persona.title);
  const folder = kind === "agent" ? persona.id : `${roleId}-agent`;
  const kitFiles = kit?.files ?? {};
  const kitPaths = (prefix: string) => Object.keys(kitFiles).filter(p => p.startsWith(prefix) && kitFiles[p].trim()).sort(byPath);
  const knowledgeReady = !!kitFiles["knowledge.md"]?.trim();
  const sourceRows = kit ? parseKitJson<SourceRow[]>(kit, "sources.json") ?? [] : [];
  const libraryRows = kit ? parseKitJson<LibraryRow[]>(kit, "library.json") ?? [] : [];

  // Skills: the role's own, then one per linked job type at skills/<job-type-id>/. When the role kit already has a
  // skill of that name (its researched method for the job), the role skill keeps the name and the job skill (what to
  // ask, what to deliver, how it is checked) moves to skills/<job-type-id>-job/. Neither replaces the other.
  const notes: string[] = [];
  const kitSkillPaths = kitPaths("skills/").filter(p => /^skills\/[^/]+\/.+/.test(p));
  const kitSkillSlugs = new Set(kitSkillPaths.map(p => p.split("/")[1]));
  const jobSlug = new Map<string, string>();
  for (const jt of jts) {
    let slug = jt.id;
    if (kitSkillSlugs.has(slug)) {
      slug = `${jt.id}-job`;
      if (kitSkillSlugs.has(slug)) throw new PackBuildError(`packs/roles/${kit!.role.id}/skills has both ${jt.id} and ${slug}, so the job skill for ${jt.id} has no free name. Rename one of them.`);
      notes.push(`packs/roles/${kit!.role.id}/skills/${jt.id} has the same name as job type ${jt.id}: the role skill keeps it, and the job skill is skills/${slug}/`);
    }
    jobSlug.set(jt.id, slug);
  }
  const agent = kind === "agent";
  // The role kit's own methods, as routing candidates: each skill by its name and description, each workflow by its
  // title and opening. A job skill points to the best match for the craft; load_agent routes requests over all of them.
  const kitRoutes: RouteCandidate[] = [
    ...kitSkillPaths.filter(p => p.endsWith("/SKILL.md")).map(p => {
      const fm = frontmatter(kitFiles[p]);
      return { path: p, kind: "skill" as const, name: (fm?.name || p.split("/")[1]).replace(/-/g, " "), text: fm?.description ?? "" };
    }),
    ...kitPaths("workflows/").map(p => ({ path: p, kind: "workflow" as const, name: kitPurpose(p, kitFiles[p]).title, text: cut(kitFiles[p], 800) })),
  ];
  const pointerFor = (jt: JobType): MethodPointer | null => {
    // A kit skill with the job type's own name is its researched method for the job.
    const same = kitSkillPaths.find(p => p === `skills/${jt.id}/SKILL.md`);
    const hit = same ? { candidate: kitRoutes.find(r => r.path === same)! } : bestRoute(`${jt.title} ${jt.keywords.join(" ")} ${jt.summary}`, kitRoutes, POINTER_MIN_SCORE);
    if (!hit?.candidate) return null;
    const c = hit.candidate;
    return { path: c.path, title: c.kind === "skill" ? `the ${c.path.split("/")[1]} skill` : `the ${c.name} workflow` };
  };
  const pointers = new Map(jts.map(jt => [jt.id, pointerFor(jt)]));
  const skillDrafts: Draft[] = [
    ...kitSkillPaths.map(p => ({ path: p, group: "skill" as const, purpose: kitPurpose(p, kitFiles[p]).purpose, content: kitFiles[p] })),
    ...jts.map(jt => ({
      path: `skills/${jobSlug.get(jt.id)}/SKILL.md`, group: "skill" as const, purpose: `Skill: ${firstSentence(jt.summary)}`,
      content: jobSkill(jt, kind, jobSlug.get(jt.id)!, pointers.get(jt.id) ?? null), resolveTools: true,
      // With a pointer into the role kit, the skill is the same for every agent in the role, not for every agent.
      ...(agent ? { source: pointers.get(jt.id) && kit ? "role" as const : "job" as const } : {}),
    })),
  ].sort((a, b) => byPath(a.path, b.path));
  const routes: RouteCandidate[] = [
    ...jts.map(jt => ({ path: `skills/${jobSlug.get(jt.id)}/SKILL.md`, kind: "job" as const, name: `${jt.title} ${jt.keywords.join(" ")}`, text: `${jt.summary} ${jt.deliverable}` })),
    ...kitRoutes,
  ];

  // Mega agents (Persona.mega): the kit's traction playbook, channel knowledge and channel specialists on top of the
  // normal files. A missing or incomplete kit is left out with a note, so a build never fails while research runs.
  const megaKit = persona.mega && input.mega && input.mega.files[`variants/${persona.mega.variant}.md`]?.trim() ? input.mega : null;
  if (persona.mega && !megaKit) notes.push(`${persona.id}: the ${persona.mega.kit} mega kit is missing or incomplete (variant ${persona.mega.variant}), so its pack was built without it`);
  const megaId = megaKit?.json.id ?? "";
  const megaFile = (kitPath: string, path: string, group: FileGroup, purpose: string): Draft =>
    ({ path, group, purpose, content: megaKit!.files[kitPath], source: "mega", sharedPath: kitPath });
  const megaPaths = (prefix: string) => megaKit ? Object.keys(megaKit.files).filter(p => p.startsWith(prefix) && megaKit.files[p].trim()).sort(byPath) : [];
  /** The kit's prompts, workflows or training files next to the role kit's: a clashing name gets the kit id as a prefix. */
  const mergeMega = (prefix: string, taken: Set<string>, group: FileGroup, purpose: (p: string) => string): Draft[] => megaPaths(prefix).map(p => {
    const name = p.slice(prefix.length);
    const path = taken.has(p) ? `${prefix}${megaId}-${name}` : p;
    return megaFile(p, path, group, purpose(p));
  });
  const promptDrafts: Draft[] = [
    ...kitPaths("prompts/").map(p => ({ path: p, group: "prompt" as const, purpose: kitPurpose(p, kitFiles[p]).purpose, content: kitFiles[p] })),
    ...mergeMega("prompts/", new Set(kitPaths("prompts/")), "prompt", p => kitPurpose(p, megaKit!.files[p]).purpose),
  ].sort((a, b) => byPath(a.path, b.path));
  const workflowDrafts: Draft[] = [
    ...kitPaths("workflows/").map(p => ({ path: p, group: "workflow" as const, purpose: kitPurpose(p, kitFiles[p]).purpose, content: kitFiles[p] })),
    ...mergeMega("workflows/", new Set(kitPaths("workflows/")), "workflow", p => kitPurpose(p, megaKit!.files[p]).purpose),
  ].sort((a, b) => byPath(a.path, b.path));
  // Training (train pack only): the role kit's interview and briefs keep their names; the kit's join them (prefixed
  // on a clash), and take the plain names when the role has none, in place of the generic fallbacks.
  // training/scorecard.md is always the builder's own, so a kit file of that name is prefixed too.
  const roleTraining = new Set(kitPaths("training/"));
  const megaTraining = agent ? [] : mergeMega("training/", new Set([...roleTraining, "training/scorecard.md"]), "training", p => `Training: ${heading(megaKit!.files[p]) ?? p.slice(9)}`);
  const megaDrafts: Draft[] = megaKit ? [
    ...megaKit.json.channels.map(c => megaFile(`channels/${c.id}.md`, `channels/${c.id}.md`, "channel", `Channel: ${c.name}.`)),
    ...megaKit.json.channels.map(c => megaFile(`agents/${c.id}.md`, `agents/${c.id}-specialist.md`, "team",
      `Specialist: ${firstSentence(agentFrontmatter(megaKit.files[`agents/${c.id}.md`]).description ?? c.name)}`)),
  ] : [];
  const tractionPlaybook: Draft[] = megaKit ? [{
    path: "traction-playbook.md", group: "work",
    purpose: agent ? "How I run traction, then the plan for this kind of business." : "The base traction method and the plan for this kind of business, to make your own.",
    content: [
      ...(agent ? [] : [`${BASE_METHOD_MARK} This traction playbook is the base method. Your training coach rewrites it with you where your way differs.`, ""]),
      // The kit names its specialists agents/<id>.md; in the pack they are agents/<id>-specialist.md.
      [megaKit.files["orchestrator.md"], megaKit.files[`variants/${persona.mega!.variant}.md`]]
        .map(t => normalizeText(t).trimEnd().replace(/\bagents\/([a-z0-9-]+)\.md\b/g, (m, id: string) => megaKit.json.channels.some(c => c.id === id) ? `agents/${id}-specialist.md` : m))
        .join("\n\n"),
    ].join("\n"),
  }] : [];
  const megaSrc = megaKit ? megaSources(megaKit, persona.mega!.variant) : null;

  // Capture and check tools: in agent packs only (zip and files.json; the one-file version links to them). A training
  // pack is uploaded back to the studio, which takes text files only, so it links to the public copies instead.
  // They capture and check a brand, so only brand-facing roles carry them (brandFacing); any other role carries just
  // the ones its role kit, its own method or its vertical knowledge (the journey maps) names, so a pack never points
  // at a tool it lacks.
  const department = role?.department ?? persona.area;
  const families = [...new Set(jts.map(familyOf))];
  const brand = brandFacing(department, families);
  const kitText = brand ? "" : [...Object.values(kitFiles), persona.profile.method ?? "", ...personaVerticalFiles(persona, input.vertical).map(f => f.content)].join("\n");
  const toolDrafts: Draft[] = agent
    ? TOOL_FILES.filter(t => input.tools?.[t.name]?.trim() && (brand || !BRAND_TOOLS.has(t.name) || EVERY_PACK_TOOLS.has(t.name) || kitText.includes(`tools/${t.name}`)))
      .map(t => ({ path: `tools/${t.name}`, group: "tool" as const, content: input.tools![t.name], source: "tools" as const, purpose: `Tool: ${t.purpose}` }))
    : [];
  const toolNames = new Set(toolDrafts.map(d => d.path.slice("tools/".length)));
  /** The tools this build has at all: what a brand-facing agent pack carries. */
  const allTools = new Set(agent ? TOOL_FILES.filter(t => input.tools?.[t.name]?.trim()).map(t => t.name) : []);

  // The toolbox (toolbox.ts): with a toolbox.json in the role kit, toolbox.md is the curated "when this, use that"
  // list and the pack carries the full text of every library item it names. Without one, toolbox.md is the plain
  // list of the pack's skills, prompts and workflows, and the pack keeps library.md, as before.
  const toolboxRaw = kit ? parseKitJson<unknown>(kit, "toolbox.json") : null;
  const toolboxChecked = toolboxRaw === null ? null : checkToolbox(toolboxRaw, kit!.role.id, Object.keys(kitFiles), input.helpers ? new Set(Object.keys(input.helpers)) : undefined);
  if (toolboxChecked?.errors.length) throw new PackBuildError(toolboxChecked.errors.join("\n"));
  const toolboxJson = toolboxChecked?.toolbox ?? null;
  const plainName = (d: Draft): string => {
    if (!d.path.startsWith("skills/")) return kitPurpose(d.path, d.content!).title;
    const body = d.content!.replace(/^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
    return heading(body) ?? upperFirst(d.path.split("/")[1].replace(/-/g, " "));
  };
  const jobSkillFiles = jts.map(jt => ({ title: jt.title, path: `skills/${jobSlug.get(jt.id)}/SKILL.md` }));
  const pickable = [...skillDrafts.filter(d => d.path.endsWith("/SKILL.md")), ...promptDrafts, ...workflowDrafts];
  const builtToolbox = toolboxJson ? buildToolbox({
    toolbox: toolboxJson, kind, origin, agentName: persona.name, agentTitle: persona.title, roleName,
    packFiles: pickable.map(d => ({ path: d.path, name: plainName(d) })),
    jobSkills: jobSkillFiles,
    library: input.library ?? {},
    helpers: input.helpers ?? {},
    personaText: [persona.title, persona.tagline, ...persona.profile.outcomes.flatMap(o => [o.title, o.deliverable]), ...jts.flatMap(jt => [jt.title, ...jt.keywords])].join(". "),
    families,
  }) : null;
  if (builtToolbox) notes.push(...builtToolbox.notes);
  const toolboxMarkdown = builtToolbox?.markdown ?? fallbackToolbox({
    agentName: persona.name, roleName, jobSkills: jobSkillFiles,
    files: pickable.map(d => ({ path: d.path, name: plainName(d), about: d.path.startsWith("skills/") ? cut(firstSentence(frontmatter(d.content!)?.description ?? "", 240), 240) : "" })),
  });
  const libraryItemDrafts: Draft[] = (builtToolbox?.items ?? []).map(item => ({
    path: toolboxItemPath(item.type, item.slug), group: "toolbox" as const, source: "toolbox" as const, content: item.text,
    purpose: `${upperFirst(TYPE_LABELS[item.type])}: ${firstSentence(item.summary || item.name)}`,
  }));
  // A vertical agent also carries the library items its vertical toolbox names for its modules (knowledge/<vertical>/
  // toolbox.json), once each, beside the role toolbox's.
  const haveItems = new Set(libraryItemDrafts.map(d => d.path));
  for (const ref of personaVerticalLibrary(persona, input.vertical)) {
    const item = input.library?.[ref.slug];
    if (!item) continue;
    const p = toolboxItemPath(item.type, item.slug);
    if (haveItems.has(p)) continue;
    haveItems.add(p);
    libraryItemDrafts.push({ path: p, group: "toolbox", source: "toolbox", content: item.text, purpose: `${upperFirst(TYPE_LABELS[item.type])}: ${firstSentence(item.summary || item.name)}` });
  }
  // A curated agent pack has no library.md: the toolbox carries those items in full. Training packs keep it,
  // because packs/shared/train/AGENTS.md names it.
  const withLibraryMd = !builtToolbox || !agent;

  // A vertical agent (persona.vertical) carries its library's cards; knowledge.md says what it carries and how to use it.
  // A role agent outside the vertical whose role its agents share carries the store kit instead (house rules and the
  // compact card index); every pack gets one AGENTS.md line for each vertical library it carries none of.
  const ownVertical = personaVerticalFiles(persona, input.vertical);
  const storeFiles = ownVertical.length ? [] : storeKitFiles(input.storeKit);
  const verticalFiles = [...ownVertical, ...storeFiles];
  const verticalNote = ownVertical.length ? `\n\n${verticalKnowledgeSection(persona, input.vertical!, ownVertical.map(f => f.path), `${origin}/mcp`)}\n`
    : storeFiles.length ? `\n\n${storeKitSection(input.storeKit!, storeFiles.map(f => f.path), `${origin}/mcp`)}\n` : "";
  const carriedVerticals = new Set([ownVertical.length ? input.vertical!.vertical.id : "", storeFiles.length ? input.storeKit!.vertical.id : ""]);
  const verticalHints = (input.verticals ?? []).filter(b => !carriedVerticals.has(b.vertical.id)).map(b => verticalHintLine(b, origin));

  // The examples guide may be a template, as train/examples/README.md or train/examples-README.md.
  const examplesTemplate = ["train/examples/README.md", "train/examples-README.md"].find(t => templates[t]?.trim()) ?? null;
  const drafts: Draft[] = [
    { path: "README.md", group: "start", template: agent ? "README.md" : "train/README.md",
      purpose: agent ? "Start here: who this is, what's inside and how to load it in your AI tool." : "Start here: what training does and how to begin." },
    { path: "AGENTS.md", group: "start", template: agent ? "AGENTS.md" : "train/AGENTS.md", resolveTools: true, purpose: "The operating instructions any AI reads first." },
    { path: "CLAUDE.md", group: "start", content: "@AGENTS.md", purpose: "Points Claude Code to AGENTS.md." },
    { path: "toolbox.md", group: "start", content: toolboxMarkdown,
      purpose: builtToolbox ? "What to use when: every skill, prompt, workflow, thinking lens and helper for this role, task by task." : "The skills, prompts and workflows in this pack, in one list." },
    { path: "WORK-METHOD.md", group: "start", template: "WORK-METHOD.md", resolveTools: true, purpose: "A pointer: the work method is now METHOD.md, with the same step numbers." },
    // The one merged method (CS329Z plan W2) and the store memory template (W6). The memory template is copied as it
    // stands (its own {{...}} are for the owner), with the builder's short one when packs/shared has none.
    { path: "METHOD.md", group: "start", template: "METHOD.md", resolveTools: true, purpose: "The one method every job follows: one numbered loop, the steps for each depth and each hard rule once." },
    { path: "MEMORY-TEMPLATE.md", group: "work", content: templates["MEMORY-TEMPLATE.md"], resolveTools: true, purpose: "The store memory: where it lives (context/MEMORY.md, or a packet in a chat app), when to read and write it, and its one-screen layout." },
    { path: "context/README.md", group: "start", content: contextReadme(jts, toolNames, origin, brand, agent), resolveTools: true, purpose: "What to capture about the client before the work, by kind of work, and where each file goes." },
    ...(agent ? [] : [{ path: "instructions.md", group: "start" as const, template: "train/instructions.md", purpose: "The training coach: how your AI interviews you, tests your agent and fills in its files." }]),
    // Training logs the coach writes into (instructions.md): shipped as empty starters so every named file exists.
    ...(agent ? [] : TRAIN_LOGS.map(l => ({ path: l.path, group: "training" as const, content: l.content, purpose: l.purpose }))),
    agent
      ? { path: "soul.md", group: "identity", content: soulMarkdown(persona, origin) ?? fallbackSoul(persona, origin), purpose: "Who I am: how I think, what I care about and how I handle disagreement." }
      : { path: "soul.md", group: "identity", template: "train/soul.md", purpose: "Your agent's soul: a template your training coach fills in with you." },
    agent
      ? { path: "personality.md", group: "identity", content: personalityMarkdown(persona), purpose: "How I talk and write: voice, tone, layout, words I use and avoid." }
      : { path: "personality.md", group: "identity", template: "train/personality.md", purpose: "How your agent talks and writes: a template your training coach fills in with you." },
    { path: "playbook.md", group: "work", content: playbookMarkdown(persona, jts, kind, roleName, new Map(jts.map(jt => [jt.id, `skills/${jobSlug.get(jt.id)}/SKILL.md`]))),
      purpose: agent ? "How I work: what I deliver and need, my method, how it is checked, and the rules I learned." : "The base method, intake and checks, to make your own, and the rules you learn." },
    ...tractionPlaybook,
    ...(agent ? [{ path: "TEAM.md", group: "work" as const, content: teamMarkdown(persona), purpose: "How I critique, what I defend, when I defer and what I never do in a team." }] : []),
    { path: "knowledge.md", group: "knowledge", content: `${knowledgeMarkdown(persona, kit, kind, roleName, megaKit).trimEnd()}${verticalNote}`,
      purpose: knowledgeReady ? "What I know about the role, with sources, then my specialty." : megaKit ? "My specialty, and where my channel knowledge is." : "My specialty. The role's researched knowledge is coming." },
    ...verticalFiles.map(f => ({ path: f.path, group: "knowledge" as const, content: f.content, purpose: f.purpose, ...(f.shared ? { source: "vertical" as const } : { resolveTools: true }) })),
    { path: "knowledge-map.md", group: "knowledge", content: "",
      purpose: "Every section I can look up, file by file, so only the part a question needs is read." },
    { path: "access.md", group: "work", content: kitFiles["access.md"]?.trim() ? kitFiles["access.md"] : fallbackAccess(), purpose: "Tools I work with, what to share with me and what I never ask for." },
    { path: "QUALITY-METHOD.md", group: "work", content: qualityMethodMarkdown(), purpose: "Optional: the receipts a host records when it uses the AI Blocks MCP job tools." },
    { path: "OUTPUT-POLICY.md", group: "work", content: outputPolicyMarkdown(), purpose: "Facts, readiness, native delivery, and whose style wins: the task, the brand, then the specialist." },
    ...(skillDrafts.length ? [{
      path: "skills.md", group: "skill" as const, purpose: "Every skill in one file, for chat apps that take one upload at a time.",
      content: skillsBundle(skillDrafts.filter(d => d.path.endsWith("/SKILL.md")).map(d => ({ path: d.path, content: d.content! }))), resolveTools: true,
    }] : []),
    ...skillDrafts,
    ...promptDrafts,
    ...workflowDrafts,
    ...megaDrafts,
    ...libraryItemDrafts,
    ...toolDrafts,
    // The build folder: BUILD.md is this agent's own; the kit, processes and access guides are one shared copy each.
    ...(agent && input.build ? Object.keys(input.build).sort(byPath).map(p => ({
      path: `build/${p}`, group: "work" as const, content: input.build![p], purpose: buildFilePurpose(p, input.build![p]),
      ...(p === "BUILD.md" ? {} : { source: "build" as const }),
    })) : []),
    ...(agent ? [] : [
      ...(megaTraining.some(d => d.path === "training/interview.md") && !roleTraining.has("training/interview.md") ? [] : [
        { path: "training/interview.md", group: "training" as const, content: kitFiles["training/interview.md"]?.trim() ? kitFiles["training/interview.md"] : fallbackInterview(roleName), purpose: "The questions your training coach asks you." }]),
      ...(megaTraining.some(d => d.path === "training/test-briefs.md") && !roleTraining.has("training/test-briefs.md") ? [] : [
        { path: "training/test-briefs.md", group: "training" as const, content: kitFiles["training/test-briefs.md"]?.trim() ? kitFiles["training/test-briefs.md"] : fallbackTestBriefs(jts), purpose: "Hard test briefs for the training rounds." }]),
      ...megaTraining,
      { path: "training/scorecard.md", group: "training" as const, content: scorecardMarkdown(jts), purpose: "How each test answer is scored against plain AI." },
      examplesTemplate
        ? { path: "examples/README.md", group: "training" as const, template: examplesTemplate, purpose: "How to add anonymised past work." }
        : { path: "examples/README.md", group: "training" as const, content: examplesReadme(), purpose: "How to add anonymised past work." },
    ]),
    // sources.md is always there, because AGENTS.md names it (the pack linter checks). library.md: see withLibraryMd.
    ...(!withLibraryMd ? [] : [libraryRows.length
      ? { path: "library.md", group: "knowledge" as const, content: libraryMarkdown(libraryRows, roleName), purpose: "Related AI Blocks library items, with links." }
      : { path: "library.md", group: "knowledge" as const, content: `# Related AI Blocks library items\n\nThe list for the ${roleName} role is coming with its researched knowledge. Until then, search the free library at ${LIBRARY_ORIGIN}.`, purpose: "Related AI Blocks library items: coming with the role's knowledge." }]),
    megaSrc?.count
      ? { path: "sources.md", group: "knowledge" as const, content: megaSourcesMarkdown(sourceRows, `${megaKit!.json.name} kit`, megaSrc.markdown), purpose: "Every source behind the knowledge, the traction playbook and the channels, grouped by file." }
      : sourceRows.length
        ? { path: "sources.md", group: "knowledge" as const, content: sourcesMarkdown(sourceRows), purpose: "Every source behind knowledge.md, with the date it was checked." }
        : { path: "sources.md", group: "knowledge" as const, content: "# Sources\n\nThe researched sources for this role are coming with its knowledge. Until then, every fact comes from the client, from context/ or from a source you name and date.", purpose: "Sources: coming with the role's knowledge." },
    { path: "LICENSE.md", group: "about", template: "LICENSE.md", purpose: "Licence: free to use and change, not to sell, and how to give credit." },
    { path: "CHANGELOG.md", group: "about", content: changelogMarkdown({
      kind, name: persona.name, roleName, version: options.version, updated: options.updated, kit, knowledgeReady, sources: sourceRows.length,
      mega: megaKit ? { name: megaKit.json.name, updated: megaKit.json.updated, variant: persona.mega!.variant, channels: megaKit.json.channels.length } : null,
    }), purpose: "What changed and when." },
    { path: "pack.json", group: "about", purpose: "Manifest: version, files and checksums." },
  ];
  const paths = drafts.map(d => d.path);
  const dup = paths.find((p, i) => paths.indexOf(p) !== i);
  if (dup) throw new PackBuildError(`The pack would hold ${dup} twice.`);

  // Placeholder values. In the training pack, name and title are the agent it starts from ("This base pack comes
  // from {{name}}, {{title}}"); bio and tagline describe the role, since the persona's own bio stays out of it.
  const listOf = (ds: Draft[], none: string) => ds.length ? bullets(ds.map(d => `\`${d.path}\`: ${d.purpose.replace(/^(Skill|Prompt|Workflow): /, "")}`)) : none;
  const outcomes = persona.profile.outcomes.map(o => `**${o.title}**: ${o.deliverable}`);
  const values: Record<Placeholder, string> = {
    name: persona.name,
    title: persona.title,
    role_name: roleName,
    tagline: agent ? persona.tagline : role?.summary ?? persona.tagline,
    agent_id: persona.id,
    role_id: roleId,
    department: role?.department ?? persona.area,
    version: options.version,
    updated: options.updated,
    bio: agent ? persona.profile.bio : role?.summary ?? `An agent for the ${roleName} role.`,
    profile_url: `${origin}/agents/${persona.id}`,
    pack_url: `${origin}/packs/${persona.id}.zip`,
    train_pack_url: `${origin}/packs/${persona.id}-train.zip`,
    one_file_url: `${origin}/packs/${persona.id}.txt`,
    guide_url: `${origin}/guides/train-your-own-agent`,
    studio_url: `${origin}/studio`,
    mcp_url: `${origin}/mcp`,
    start_ask: intakeAsks(department, families).start,
    intake_asks: intakeAsks(department, families).asks,
    // The toolbox's library items are one row, not fifty: toolbox.md lists each with what it is for.
    files_table: ["| File | What it is |", "|---|---|",
      ...drafts.filter(d => d.group !== "toolbox").map(d => `| \`${d.path}\` | ${cell(d.purpose)} |`),
      ...(libraryItemDrafts.length ? [`| \`toolbox/\` | The ${libraryItemDrafts.length} library items toolbox.md names, each in full in its own file. |`] : []),
    ].join("\n"),
    skills_list: listOf(skillDrafts, "- (no skills yet)"),
    prompts_list: listOf(promptDrafts, "- (no prompts yet)"),
    workflows_list: listOf(workflowDrafts, "- (no workflows yet)"),
    outcomes_list: outcomes.length ? bullets(outcomes) : "- (none listed)",
    not_for_list: bullets(notForList(persona, jts)) || "- (nothing listed)",
    not_for_inline: notForList(persona, jts).length ? `${notForList(persona, jts).map(s => s.replace(/[.;\s]+$/, "")).join("; ")}.` : "(nothing listed).",
    // The per-job intake is in playbook.md; templates that still use this block get the short general list.
    intake_list: bullets(["Their business and website, or what exists now.", "The one result they want, and who it is for.", "The facts you may use, and when they need it."]),
    team_list: megaKit ? teamListMarkdown(megaKit) : "",
  };

  // Role files: copied from the kit as it stands, or sources.md and library.md built from it. Job skills: the same
  // in every "Download this agent" pack that links the job. Both get one shared browsable copy (fileUrl).
  const jobSkillPaths = new Set([...jobSlug.values()].map(s => `skills/${s}/SKILL.md`));
  const sourceOf = (d: Draft): FileSource => {
    if (d.source) return d.source;
    if (kit && !d.template && ((kitFiles[d.path] !== undefined && d.content === kitFiles[d.path]) || d.path === "library.md" || (d.path === "sources.md" && !megaSrc?.count))) return "role";
    if (agent && jobSkillPaths.has(d.path)) return "job";
    return "agent";
  };
  const files: PackFile[] = [];
  for (const d of drafts) {
    if (d.path === "pack.json" || d.path === KNOWLEDGE_MAP) continue;
    let content = d.template ? fillTemplate(d.template, templates[d.template], values) : d.content!;
    // A pack never names a tools/ file it lacks: train packs ship no tools/, so their role kit files, playbook and knowledge point at the public copy.
    let source = sourceOf(d);
    // The shared quality rules (FOUNDATION.md, INTAKE.md) name brand tools; a pack without them gets the public links.
    if (d.resolveTools || (source === "tools" && d.path.endsWith(".md")) || (kind === "train" && (source === "role" || d.path === "playbook.md" || d.path === "knowledge.md" || d.path.startsWith("knowledge/")))) {
      const resolved = resolveToolRefs(content, toolNames, origin);
      // A job skill is one shared file for every pack that links the job. In a pack without the brand tools its text
      // points at their public copies instead, so that pack keeps its own copy and the shared one stays the same.
      if (agent && (source === "job" || source === "role" || source === "tools") && resolved !== resolveToolRefs(content, allTools, origin)) source = "agent";
      content = resolved;
    }
    if (!agent && (d.path === "soul.md" || d.path === "personality.md") && !content.replace(/^\uFEFF/, "").trimStart().startsWith(TEMPLATE_MARKER)) {
      content = `${TEMPLATE_MARKER}\n${content}`;
    }
    // AGENTS.md: one line per vertical library the pack does not carry, before the access rules (else at the end).
    if (d.path === "AGENTS.md" && verticalHints.length) {
      const hint = verticalHints.join("\n\n");
      const at = /\n## Access levels\b/.exec(content) ?? /\n## How you work\b/.exec(content);
      content = at ? `${content.slice(0, at.index).trimEnd()}\n\n${hint}\n${content.slice(at.index)}` : `${normalizeText(content).trimEnd()}\n\n${hint}`;
    }
    // A mega agent's AGENTS.md always has its team, even while the shared template has no {{team_list}} yet.
    if (megaKit && d.path === "AGENTS.md" && !templates[d.template!].includes("{{team_list}}")) {
      content = `${normalizeText(content).trimEnd()}\n\n${values.team_list}`;
      notes.push(`packs/shared/${d.template} has no {{team_list}}, so the channel team was added at the end of ${persona.id}'s ${kind} AGENTS.md`);
    }
    if (d.path === "README.md" && agent && input.build?.["BUILD.md"]) content = `${normalizeText(content).trimEnd()}\n\n${BUILD_README}\n`;
    content = normalizeText(content);
    files.push({ path: d.path, content, purpose: d.purpose, group: d.group, bytes: encoder.encode(content).length, sha256: await sha256(content), source, ...(d.sharedPath ? { sharedPath: d.sharedPath } : {}) });
  }
  // knowledge-map.md is made from the finished files it maps (retrieve.ts), and goes right after knowledge.md.
  {
    const mapDraft = drafts.find(d => d.path === KNOWLEDGE_MAP)!;
    const index = new KnowledgeIndex(files.filter(f => indexedPath(f.path)).map(f => ({ path: f.path, text: f.content })));
    const content = normalizeText(resolveToolRefs(knowledgeMap(index, agent ? persona.name : "this agent", toolNames.has("ask-knowledge.mjs")), toolNames, origin));
    const at = files.findIndex(f => f.path === "knowledge.md");
    files.splice(at < 0 ? files.length : at + 1, 0, { path: KNOWLEDGE_MAP, content, purpose: mapDraft.purpose, group: mapDraft.group, bytes: encoder.encode(content).length, sha256: await sha256(content), source: "agent" });
  }
  const knowledgeOn = knowledgeReady || !!megaKit;
  const knowledgeDates = [knowledgeReady ? kit!.role.updated : "", megaKit?.json.updated ?? ""].filter(Boolean).sort(byPath);
  const reviewDays = [knowledgeReady ? kit!.role.review_every_days : 0, megaKit?.json.review_every_days ?? 0].filter(n => n > 0);
  const manifest: PackManifest = {
    schema: PACK_SCHEMA,
    kind,
    agent_id: persona.id,
    name: persona.name,
    title: persona.title,
    role: role?.id ?? null,
    version: options.version,
    updated: options.updated,
    source: `${origin}/agents/${persona.id}`,
    license: PACK_LICENSE,
    job_types: jts.map(jt => jt.id),
    // With a mega kit, the knowledge counts the kit too: the later date, all sources, the shorter review cycle.
    knowledge: knowledgeOn
      ? { status: "ready", updated: knowledgeDates[knowledgeDates.length - 1], sources: (knowledgeReady ? sourceRows.length : 0) + (megaSrc?.count ?? 0), review_every_days: Math.min(...reviewDays) }
      : { status: "pending", updated: null, sources: 0, review_every_days: null },
    ...(megaKit ? {
      mega: { kit: megaId, variant: persona.mega!.variant },
      team: megaKit.json.channels.map(c => ({
        id: c.id, name: c.name, agent: `${c.id}-specialist`,
        description: (agentFrontmatter(megaKit.files[`agents/${c.id}.md`]).description ?? "").replace(/\s+/g, " ").trim(),
      })),
    } : {}),
    // Every file in the pack folder except pack.json itself. The zip's .agents/skills and .claude/skills copies are
    // byte-for-byte the same as skills/, so they are not listed again.
    files: files.map(f => ({ path: f.path, bytes: f.bytes, sha256: f.sha256 })),
  };
  const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
  const manifestDraft = drafts.find(d => d.path === "pack.json")!;
  files.push({ path: "pack.json", content: manifestText, purpose: manifestDraft.purpose, group: manifestDraft.group, bytes: encoder.encode(manifestText).length, sha256: await sha256(manifestText), source: "agent" });
  return { kind, folder, files, manifest, notes, routes, toolbox: builtToolbox ? { summary: builtToolbox.summary, top: builtToolbox.top } : null };
}

// ---------- Versions (packs/versions.json) ----------

/** The placeholder version a pack is rendered with to hash its content, so the hash never depends on the version. */
export const HASH_VERSION = { version: "0000.00.00", updated: "0000-00-00" } as const;

/**
 * The content hash recorded in packs/versions.json: sha256 over "path<TAB>sha256" lines of every file of a pack built
 * with HASH_VERSION. pack.json and CHANGELOG.md are included: rendered with the placeholder they carry no version,
 * so a change to the role kit's dates or changelog bumps the version like any other change.
 */
export async function packContentHash(input: PackInput): Promise<string> {
  const probe = await buildPack({ ...input, options: { ...input.options, ...HASH_VERSION } });
  return sha256(probe.files.map(f => `${f.path}\t${f.sha256}\n`).join(""));
}

export interface VersionLockEntry { hash: string; version: string; updated: string }
export type VersionLock = Record<string, VersionLockEntry>;

/** Key in packs/versions.json: the agent id for "Download this agent", "<id>-train" for "Train your own". */
export const lockKey = (agentId: string, kind: PackKind) => (kind === "agent" ? agentId : `${agentId}-train`);

/** The version for a pack: the locked one while the content hash is the same, else the given day. */
export function nextLockEntry(previous: VersionLockEntry | undefined, hash: string, day: string): VersionLockEntry {
  if (previous && previous.hash === hash) return previous;
  return { hash, version: day.replace(/-/g, "."), updated: day };
}

/** packs/versions.json text: keys sorted, 2-space JSON, trailing newline, so it diffs cleanly. */
export function lockText(lock: VersionLock): string {
  const sorted = Object.fromEntries(Object.keys(lock).sort(byPath).map(k => [k, { hash: lock[k].hash, version: lock[k].version, updated: lock[k].updated }]));
  return `${JSON.stringify(sorted, null, 2)}\n`;
}

// ---------- Public addresses ----------

/**
 * Where a file's browsable copy is served (an absolute site path). Role files once per role, job skills once per
 * job skill, everything else under the agent. Only "Download this agent" packs have browsable copies.
 */
export function fileUrl(pack: BuiltPack, file: PackFile): string {
  if (file.source === "role" && pack.manifest.role) return `/packs/roles/${pack.manifest.role}/${file.path}`;
  if (file.source === "job") return `/packs/jobs/${file.path.slice("skills/".length)}`;
  if (file.source === "mega" && pack.manifest.mega) return `/packs/mega/${pack.manifest.mega.kit}/${file.sharedPath ?? file.path}`;
  // A tool or a library item is one file for every pack that carries it: /packs/tools/<file>, /packs/toolbox/<type>/<slug>.md.
  if (file.source === "tools" || file.source === "toolbox" || file.source === "vertical" || file.source === "build") return `/packs/${file.path}`;
  return `/packs/${pack.manifest.agent_id}/${file.path}`;
}

/** Folder names under /packs that are not agents, so no agent id may use them. */
export const RESERVED_PACK_PATHS = new Set(["roles", "claude", "jobs", "mega", "tools", "toolbox", "knowledge", "build", "toolbox-index.json", "toolbox-index", "index.json", "index"]);

/**
 * The pack as a zip: every file under its folder, then a copy of skills/ in each of SKILL_MIRRORS (.agents/skills
 * for Codex and Cursor, .claude/skills for Claude Code), so those tools find the skills with no copy step. The copies
 * are in the zip only, never in files.json or the browsable copy. Fixed order and the pack's updated date make the
 * bytes reproducible.
 */
export function packZip(pack: BuiltPack): Promise<Uint8Array> {
  const entries = pack.files.map(f => ({ path: `${pack.folder}/${f.path}`, data: f.content }));
  const skills = pack.files.filter(f => f.path.startsWith("skills/"));
  for (const mirror of SKILL_MIRRORS) {
    for (const f of skills) entries.push({ path: `${pack.folder}/${mirror}${f.path.slice("skills/".length)}`, data: f.content });
  }
  // A mega agent's channel specialists, where Claude Code finds sub-agents (zip only, like the skill copies).
  for (const f of pack.files.filter(x => x.group === "team" && x.path.startsWith("agents/"))) {
    entries.push({ path: `${pack.folder}/${AGENT_MIRROR}${f.path.slice("agents/".length)}`, data: f.content });
  }
  return writeZip(entries, { date: pack.manifest.updated });
}

/** A capture or check script: in the zip and files.json, never inlined in a one-file text. */
const isToolScript = (path: string) => /^tools\/.+\.(mjs|cjs|js)$/.test(path);

/** The setup guide, the pointer for Claude Code and the record files are for people and tools, not the agent. */
// QUALITY-METHOD.md is only for hosts that call the AI Blocks MCP job tools, and those load it through MCP: a chat
// app never needs it, so the one file leaves it out (the zip keeps it).
const NOT_IN_ONE_FILE = new Set(["README.md", "CLAUDE.md", "CHANGELOG.md", "pack.json", "QUALITY-METHOD.md"]);

/**
 * How big the one-file text may get and how deep its rules may sit (Stanford CS329Z lecture 2: accuracy falls as the
 * context grows, and what sits deep in a long input is recalled worst). Tokens are estimated at 4 characters each.
 * coreTokens: everything before the card digest. totalTokens: the whole file. ruleDepth: AGENTS.md, the method, the
 * intake and the output policy each start within this share of the file. fillTokens: the digest and the reference
 * files fill the file up to here, so it stays under totalTokens. digestMinCards: the digest gets room for this many
 * cards before the second reference files; digestCards: the most it ever holds. megaCoreTokens: the core limit for a
 * mega agent, whose core also holds its traction playbook (its method for running traction, about 10,000 tokens).
 * scripts/build-packs.mjs fails the build when an agent's file breaks one of these (oneFileStats).
 */
export const ONE_FILE_BUDGET = { coreTokens: 60_000, totalTokens: 100_000, ruleDepth: 0.15, fillTokens: 98_000, megaCoreTokens: 70_000, digestMinCards: 40, digestCards: 120, charsPerToken: 4 } as const;
/** The line that opens the card digest: everything before it is the core. */
export const DIGEST_MARK = "===== CARD DIGEST";

/**
 * The core of the one-file text, in order: what the AI reads first. `*` is one path segment. METHOD.md holds the
 * method, the intake (step 0) and the depths; WORK-METHOD.md stands in only for a pack built before METHOD.md. Any
 * file not named here is a reference file after the digest, or an address when the file has no room (see oneFileText).
 */
export const ONE_FILE_ORDER: { part: string; paths: string[] }[] = [
  { part: "operating instructions", paths: ["AGENTS.md"] },
  { part: "method", paths: ["METHOD.md", "WORK-METHOD.md"] },
  { part: "output policy", paths: ["OUTPUT-POLICY.md"] },
  { part: "foundation questions", paths: ["tools/quality/FOUNDATION.md"] },
  { part: "access summary", paths: ["access.md"] },
  { part: "toolbox", paths: ["toolbox.md"] },
  { part: "job skills", paths: ["skills.md", "skills/*/SKILL.md"] },
  { part: "persona", paths: ["soul.md", "personality.md", "playbook.md", "TEAM.md", "traction-playbook.md"] },
  { part: "knowledge", paths: ["knowledge.md", "knowledge/*/store-kit.md"] },
];
/**
 * Right after the digest, always: the maps (long lists of where each section is, read to find a file, so they sit
 * after the core), the reference files the method points to by step, and the store memory template. The old method
 * files are one-line pointers to METHOD.md now; they stay, so a path that names one still finds it.
 */
const ONE_FILE_REFERENCE = [
  "knowledge-map.md", "knowledge/*/library-map.md", "WORK-METHOD.md", "tools/quality/QUALITY-ENGINE-v3.md", "tools/quality/INTAKE.md", "tools/quality/ROUTING.md", "tools/quality/CHECKER-v3.md", "tools/quality/CLARITY.md", "tools/quality/VOICE.md", "tools/quality/PROOF.md",
  "tools/quality/VISUAL.md", "tools/quality/PROFILES.md", "tools/quality/OUTCOME-SIGNALS.md", "MEMORY-TEMPLATE.md",
];
/**
 * Then, once the digest has room for ONE_FILE_BUDGET.digestMinCards, each of these that fits, in order: the general
 * lessons, the defaults to avoid, the generic quality cards for this role's jobs, the capture guide and the toolkit.
 */
const ONE_FILE_SECOND = [
  "tools/quality/lessons-general.md", "tools/ai-default-patterns.md", "tools/quality/cards/_any.md", "tools/quality/cards/*",
  "tools/quality/cards/INDEX.md", "context/README.md", "knowledge/*/toolkit.md",
];
/** Then, while there is room, in this order: the role's prompts and workflows, a mega agent's team, the best library items, the rest. */
const ONE_FILE_EXTRA = ["prompts/*", "workflows/*", "agents/*", "channels/*"];

const pathMatches = (pattern: string, path: string) =>
  new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, "[^/]+")}$`).test(path);
const orderOf = (patterns: string[], path: string) => patterns.findIndex(p => pathMatches(p, path));
const tokensOf = (chars: number) => Math.round(chars / ONE_FILE_BUDGET.charsPerToken);
/** "Asked as" lines are search keys for ask-knowledge and prepare-job; in a chat they are noise. */
const dropAskedAs = (text: string) => text.replace(/\n*^\*\*Asked as:\*\*.*$/gm, "");

/**
 * The generic quality cards (tools/quality/cards/) this agent's jobs use. A card counts for a job when one of its
 * names of two words or more (cards/INDEX.md) is in the job's title, keywords or description, or when it is clearly
 * the best match for the agent's title and the job's title and keywords (route.ts, score 2 or more). _any.md and
 * INDEX.md are always kept. A card for work the agent never does (an investor update for a media buyer) is left to
 * its address, which INDEX.md names.
 */
function qualityCardsFor(pack: BuiltPack): Set<string> {
  const index = pack.files.find(f => f.path === "tools/quality/cards/INDEX.md")?.content ?? "";
  const rows = index.split("\n").map(l => l.split("|").map(s => s.trim())).filter(c => c.length >= 3 && /^tools\/quality\/cards\/.+\.md$/.test(c[2]) && c[0] !== "_any");
  const candidates: RouteCandidate[] = rows.map(([id, aliases, path]) => ({ path, kind: "skill" as const, name: `${id.replace(/-/g, " ")} ${aliases}`, text: "" }));
  const words = (s: string) => ` ${s.toLowerCase().replace(/[^a-z0-9/]+/g, " ").trim()} `;
  const phrases = rows.map(([id, aliases, path]) => ({ path, names: [id.replace(/-/g, " "), ...aliases.split(",")].map(words).filter(n => n.trim().includes(" ")) }));
  const out = new Set(["tools/quality/cards/_any.md", "tools/quality/cards/INDEX.md"]);
  for (const job of pack.routes.filter(r => r.kind === "job")) {
    const hay = words(`${job.name} ${job.text}`);
    for (const p of phrases) if (p.names.some(n => hay.includes(n))) out.add(p.path);
    const hit = bestRoute(`${pack.manifest.title} ${job.name}`, candidates, 2);
    if (hit) out.add(hit.candidate.path);
  }
  return out;
}

/** The access summary the core carries: the levels and every safety section whole, the tools by name, the rest by address. */
export function accessSummary(access: string, url: string): string {
  const sections = markdownSections(access);
  const keep = /access levels|safety|never ask|before anything goes live|access i have|action log|no tools/i;
  const out: string[] = [];
  const tools: string[] = [], elsewhere: string[] = [];
  for (const s of sections) {
    if (!s.heading || keep.test(s.heading)) { out.push(s.text); continue; }
    if (/tool/i.test(s.heading)) {
      for (const m of s.text.matchAll(/^\*\*([^*\n]+?)\*\*/gm)) if (!tools.includes(m[1].replace(/[.:]$/, ""))) tools.push(m[1].replace(/[.:]$/, ""));
    }
    elsewhere.push(s.heading);
  }
  out.push([
    "## The rest of the access file",
    "",
    `${tools.length ? `The tools I work with: ${tools.join("; ")}. ` : ""}What each level lets me do in each tool, how to connect it${elsewhere.length ? ` and the rest (${elsewhere.join("; ")})` : ""} are in the full access file: ${url}. Open it before you use or ask for a tool.`,
  ].join("\n"));
  return out.join("\n\n");
}

/** One card block of a module file (cards.ts moduleMarkdown) by its id, without its "Asked as" line. */
function cardBlocks(md: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const block of md.replace(/\r\n?/g, "\n").split(/^## /m).slice(1)) {
    const id = /^Card ([A-Z]{2,4}-\d{4})\./m.exec(block)?.[1];
    if (id) out.set(id, `## ${dropAskedAs(block).trim()}`);
  }
  return out;
}

/**
 * The card digest: the cards of the agent's own modules its jobs need most, best first and job by job, within a
 * character budget and ONE_FILE_BUDGET.digestCards. Each job skill's brief (its title, what it delivers and its
 * keywords, with the agent's title) goes through prepare-job's ranking (src/modules/knowledge/prepare.ts: multi-query,
 * rerank, near-duplicates dropped); the jobs take turns, so each gets its share. Empty when the agent works in no module.
 */
function cardDigest(pack: BuiltPack, modules: PackFile[], budget: number, maxCards: number, urls: string[], mcp: string): { text: string; cards: number } {
  if (!modules.length || budget <= 0) return { text: "", cards: 0 };
  const cards = modules.flatMap(f => cardsFromModuleMarkdown(/([A-Z]{2,4})\.md$/.exec(f.path)![1], f.content));
  const blocks = new Map(modules.flatMap(f => [...cardBlocks(f.content)]));
  if (!cards.length) return { text: "", cards: 0 };
  const prep = new JobPrep(cards);
  const titleOf = (path: string) => {
    const md = pack.files.find(f => f.path === path)?.content ?? "";
    return heading(md.replace(/^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n?/, "")) ?? path.split("/")[1].replace(/-/g, " ");
  };
  const ask = (brief: string) => prep.prepare(brief, { k: 25 }).picks.map(p => p.card.id);
  // The agent's own deliverables (playbook.md, "What I deliver") say what its jobs are for this agent, so they are the
  // briefs; a job skill no deliverable names is asked by its own words. Last, the agent's work in general.
  const playbook = pack.files.find(f => f.path === "playbook.md")?.content ?? "";
  const delivers = /^## What I deliver\n([\s\S]*?)(?=^## |(?![\s\S]))/m.exec(playbook)?.[1] ?? "";
  const outcomes = [...delivers.matchAll(/^- \*\*(.+?)\*\*: (.+?)(?: \(job: (.+?)\))?$/gm)].map(x => ({ title: x[1], text: x[2], job: x[3] ?? "" }));
  const jobRoutes = pack.routes.filter(r => r.kind === "job");
  const jobs = [
    ...outcomes.map(o => ({ title: o.title, ids: ask(`${pack.manifest.title}. ${o.title}. ${o.text}`) })),
    ...jobRoutes.filter(r => !outcomes.some(o => o.job === titleOf(r.path))).map(r => ({ title: titleOf(r.path), ids: ask(`${pack.manifest.title}. ${r.text}\n${r.name}`) })),
  ];
  const tagline = playbook.split("\n").find(l => l.trim() && !l.startsWith("#")) ?? "";
  jobs.push({ title: `${upperFirst(pack.manifest.title)} work in general`, ids: ask(`${pack.manifest.title}. ${tagline}`) });
  const intro = [
    `${DIGEST_MARK}: the knowledge cards my jobs use most =====`,
    "",
    "# Card digest",
    "",
  ];
  // Two cards that say nearly the same thing (two sources, one finding) take one place: the first one found.
  const words = new Map(cards.map(c => [c.id, new Set(tokens(`${c.claim} ${c.text}`))]));
  const near = (a: string, b: string) => { const x = words.get(a)!, y = words.get(b)!; let n = 0; for (const w of x) if (y.has(w)) n++; return n / (x.size + y.size - n || 1) > 0.4; };
  const picked = new Set<string>();
  const byJob = new Map<number, string[]>();
  let used = 0;
  for (let rank = 0, more = true; more && picked.size < maxCards; rank++) {
    more = false;
    for (let j = 0; j < jobs.length && picked.size < maxCards; j++) {
      const id = jobs[j].ids[rank];
      if (!id) continue;
      more = true;
      if (picked.has(id) || !blocks.has(id) || [...picked].some(p => near(p, id))) continue;
      const size = blocks.get(id)!.length + 2;
      if (used + size > budget) { more = false; break; }
      picked.add(id);
      used += size;
      byJob.set(j, [...(byJob.get(j) ?? []), id]);
    }
  }
  if (!picked.size) return { text: "", cards: 0 };
  const codes = modules.map(f => /([A-Z]{2,4})\.md$/.exec(f.path)![1]);
  intro.push(
    `The ${picked.size} cards my jobs need most, out of the ${cards.length} in my own modules (${codes.join(", ")}), grouped by the piece of work they serve best. Each card is one claim with when it holds, when it fails, its numbers and its source tier (1 platform documentation, 2 large-sample research, 3 a named practitioner with receipts, 4 opinion). Check "Holds when" against this business before you use a card, and re-check anything time-sensitive before a buyer sees it.`,
    "",
    `The full modules are at ${urls.join(", ")}. To find a card that is not here, use the AI Blocks connector (${mcp}): \`ask_agent_knowledge\` searches my pack and \`get_agent_file\` reads one file of it. In a coding app, \`node tools/ask-knowledge.mjs "<question>"\` does the same. If you can do neither, the pack does not have it here: decide from the brief or ask, and never fill the gap from memory.`,
  );
  const sections = [...byJob].sort((a, b) => a[0] - b[0]).map(([j, ids]) => [`## For: ${jobs[j].title}`, ...ids.map(id => blocks.get(id)!.replace(/^## /, "### "))].join("\n\n"));
  return { text: [intro.join("\n"), ...sections].join("\n\n"), cards: picked.size };
}

/**
 * <id>.txt: the agent in one plain text file, for chat apps (ChatGPT, Claude, Gemini) where one attachment is the
 * quickest start. Plain .txt, because every chat app takes it (Gemini's list of file types does not name .md). Agent
 * packs only. It is built for a context window, not as a copy of the zip:
 * - The core first, in ONE_FILE_ORDER: operating instructions, the method (with the intake), the output policy, the
 *   foundation questions, an access summary, the toolbox, the job skills, who the agent is and what it knows. Each file starts after a
 *   "===== FILE: <path> =====" line; each skill's SKILL.md is left out when skills.md holds them all.
 * - Then the card digest (cardDigest), then the reference files the method points to, then whatever else fits within
 *   ONE_FILE_BUDGET.fillTokens: the role's prompts and workflows, the best library items (inlineItems at most), and so on.
 * - Every other file is named by its web address wherever a part mentions it: the whole card modules, other modules,
 *   skills, principles, toolbox items, sources. The head says how to open one (the page, or the AI Blocks connector).
 *   Scripts never go in (a chat app cannot run them), and the head says once what to do instead.
 * Nothing is cut from a file that goes in: a file is in whole, or it is an address.
 */
export function oneFileText(pack: BuiltPack, origin: string = ORIGIN, inlineItems: number = ONE_FILE_ITEMS): string {
  if (pack.kind !== "agent") throw new PackBuildError(`only agent packs have a one-file version, not ${pack.kind} packs`);
  const m = pack.manifest, site = origin.replace(/\/+$/, ""), mcp = `${site}/mcp`;
  const has = new Set(pack.files.map(f => f.path));
  const bundled = has.has("skills.md");
  const method = has.has("METHOD.md") ? "METHOD.md" : "WORK-METHOD.md";
  const order = ONE_FILE_ORDER.map(g => g.part === "method" ? [method] : g.paths.filter(p => !(bundled && p === "skills/*/SKILL.md")));
  const scripts = pack.files.filter(f => isToolScript(f.path)).map(f => f.path.slice("tools/".length));
  // Own modules: their cards feed the digest, and the whole file is an address.
  const modules = pack.files.filter(f => f.source === "vertical" && /^knowledge\/[^/]+\/[A-Z]{2,4}\.md$/.test(f.path) && !f.purpose.startsWith(SEARCH_ONLY));
  const cardsKept = qualityCardsFor(pack);
  const candidates = pack.files.filter(f => !NOT_IN_ONE_FILE.has(f.path) && !f.path.startsWith("build/") && !isToolScript(f.path) && !(bundled && /^skills\/[^/]+\/SKILL\.md$/.test(f.path)));
  const coreRank = (path: string) => { const i = order.findIndex(ps => ps.some(p => pathMatches(p, path))); return i < 0 ? -1 : i * 100 + orderOf(order[i], path); };
  const core = candidates.filter(f => coreRank(f.path) >= 0 && !(method === "METHOD.md" && f.path === "WORK-METHOD.md")).sort((a, b) => coreRank(a.path) - coreRank(b.path) || byPath(a.path, b.path));
  const isQualityCard = (p: string) => p.startsWith("tools/quality/cards/");
  const rankIn = (list: string[]) => (a: PackFile, b: PackFile) => orderOf(list, a.path) - orderOf(list, b.path) || byPath(a.path, b.path);
  const reference = candidates.filter(f => !core.includes(f) && orderOf(ONE_FILE_REFERENCE, f.path) >= 0).sort(rankIn(ONE_FILE_REFERENCE));
  const second = candidates.filter(f => !core.includes(f) && !reference.includes(f) && orderOf(ONE_FILE_SECOND, f.path) >= 0 && (!isQualityCard(f.path) || cardsKept.has(f.path)))
    .sort(rankIn(ONE_FILE_SECOND));
  // What may fill the rest: the role's own tools, then the best library items, then any other file (sources, principles,
  // skills of the library), but never a whole card module, another module, the baseline or a quality card for other work.
  const items = pack.files.filter(f => f.source === "toolbox");
  const top = (pack.toolbox?.top ?? []).filter(p => items.some(f => f.path === p)).slice(0, inlineItems);
  const never = (f: PackFile) => modules.includes(f) || isQualityCard(f.path) || (f.source === "toolbox" && !top.includes(f.path))
    || /^knowledge\/[^/]+\/(vendor\/|baseline\.md$|sources\.md$|card-index\.md$|[A-Z]{2,4}\.md$)/.test(f.path) || (f.source === "vertical" && f.purpose.startsWith(SEARCH_ONLY));
  const extraRank = (f: PackFile) => { const i = orderOf(ONE_FILE_EXTRA, f.path); if (i >= 0) return i; const t = top.indexOf(f.path); return t >= 0 ? 10 + t : 100; };
  const extra = candidates.filter(f => !core.includes(f) && !reference.includes(f) && !second.includes(f) && !never(f) && f.path !== "LICENSE.md")
    .sort((a, b) => extraRank(a) - extraRank(b) || byPath(a.path, b.path));
  const license = candidates.find(f => f.path === "LICENSE.md");

  // Every agent-facing file that is not a part is named by its address wherever a part mentions it. A shared library
  // file (toolbox/ and knowledge/ paths served at /packs/<path>) keeps its short path: the head gives the rule once,
  // and the connector's get_agent_file takes the path as it is. So do the pack's own scripts: the head says once where
  // they are and what to do in a chat app, instead of a note at each of their 80 or more mentions.
  const atPacks = (x: PackFile) => /^(toolbox|knowledge)\//.test(x.path) && fileUrl(pack, x) === `/packs/${x.path}`;
  const example = pack.files.find(x => modules.includes(x)) ?? pack.files.find(x => atPacks(x));
  const renderers = new Map<string, (f: PackFile) => string>();
  const rendererFor = (inside: Set<string>) => {
    const key = [...inside].sort(byPath).join("\n");
    const known = renderers.get(key);
    if (known) return known;
    const kept = new Set([...[...inside].filter(p => p.startsWith("tools/")).map(p => p.slice("tools/".length)), ...scripts]);
    const away = pack.files.filter(x => !inside.has(x.path) && !NOT_IN_ONE_FILE.has(x.path) && !x.path.startsWith("tools/") && !atPacks(x) && !(bundled && /^skills\/[^/]+\/SKILL\.md$/.test(x.path)));
    const urls = new Map(away.map(x => [x.path, `${site}${fileUrl(pack, x)}`]));
    const names = [...urls.keys()].sort((a, b) => b.length - a.length).map(p => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const re = names.length ? new RegExp(`(?<![\\w/.:-])(?:${names.join("|")})(?![\\w/-])`, "g") : null;
    const render = (f: PackFile): string => {
      let text = resolveToolRefs(f.content, kept, site);
      if (re) text = text.replace(re, p => urls.get(p) ?? p);
      if (f.path === "access.md") text = accessSummary(text, `${site}${fileUrl(pack, f)}`);
      if (f.path.startsWith("knowledge/")) text = dropAskedAs(text);
      return `===== FILE: ${f.path}${f.path === "access.md" ? " (summary)" : ""} =====\n\n${text.trim()}`;
    };
    renderers.set(key, render);
    return render;
  };
  const partText = (inside: Set<string>, f: PackFile) => rendererFor(inside)(f);

  const head = (digestCards: number, inside: Set<string>) => {
    const inItems = items.filter(f => inside.has(f.path)).length;
    return [
      `# ${m.name}, ${m.title}: the agent in one file`,
      "",
      `This is ${m.name}'s agent pack from AI Blocks, version ${m.version}, in one file for chat apps such as ChatGPT, Claude and Gemini. Attach it to a chat, or add it to a project or Gem, and your AI works as ${m.name}. It runs on your own AI plan.`,
      "",
      `For the AI reading this: each part below is one file of the pack and starts with a line such as "===== FILE: playbook.md =====". When your instructions say to open or read a file, read that part. Start with the AGENTS.md part and follow it.${bundled ? " Every skill is in the skills.md part, under its own heading, so a path such as skills/<name>/SKILL.md means that heading." : ""}`,
      "",
      `How this file is laid out: first the core, which is how ${m.name} works and asks, the output rules, a summary of access, the toolbox, the job skills, who ${m.name} is and what ${m.name} knows. ${digestCards ? `Then a digest of the ${digestCards} knowledge cards ${m.name}'s jobs use most. ` : ""}Then the knowledge map and the reference files the method points to. Every other file of the pack is named where a part mentions it${items.length > inItems ? `, including ${inItems ? `${items.length - inItems} of the ${items.length}` : `all ${items.length}`} library items toolbox.md names` : ""}: a path that starts with knowledge/ or toolbox/ and is not a part here is the page at ${site}/packs/ followed by that path${example ? ` (so \`${example.path}\` is ${site}/packs/${example.path})` : ""}, and any other file is named by its full web address. Open one only when the job needs it. If you cannot open web pages, use the AI Blocks connector (${mcp}): \`get_agent_file\` reads one file of the pack by its path and \`ask_agent_knowledge\` searches the pack. With neither, ask the person to paste the page, or work from what is here and say what you could not open.`,
      "",
      `Steps that need a coding app: ${method === "METHOD.md" ? "METHOD.md says, under \"Coding app or chat app\", what runs where and what to do by hand in a chat app. " : ""}${scripts.length ? `The scripts (${scripts.map(x => x.replace(/\.(mjs|cjs|js)$/, "")).join(", ")}) are in the pack folder, and each is also on the web: \`tools/${scripts[0]}\` is at ${site}/tools/${scripts[0]}, and so on. ` : ""}${method === "METHOD.md" ? "Never say a script ran when it did not." : "Scripts run only in a coding app such as Claude Code, Codex or Cursor, with the pack folder. In a chat app, do each of those steps by hand: work out numbers with the app's code tool if it has one, or else show each sum; find cards in the digest or through the connector; run each check yourself from the file that describes it. Then say in your own message which checks you did by hand. Never say a script ran when it did not."}`,
      "",
      `Free to use and change, not to sell: the LICENSE.md part has the terms. Newest version and ${m.name}'s profile: ${site}/agents/${m.agent_id}`,
    ].join("\n");
  };

  // Sizes first, with every file outside the core and the first reference files as an address (the longest each part
  // can be), so what comes after gets only the room that is left; the final text is never longer. The claims on the
  // room, in order: the core, the first reference files and the licence; the digest up to digestMinCards; each second
  // reference file that fits; the digest up to digestCards; then each extra that fits.
  const budget = ONE_FILE_BUDGET.fillTokens * ONE_FILE_BUDGET.charsPerToken;
  const fixed = [...core, ...reference, ...(license ? [license] : [])];
  const base = new Set(fixed.map(f => f.path));
  const sizeOf = (f: PackFile) => partText(base, f).length + 2;
  const fixedChars = head(ONE_FILE_BUDGET.digestCards, base).length + fixed.reduce((n, f) => n + sizeOf(f), 0);
  const moduleUrls = modules.map(f => `${site}${fileUrl(pack, f)}`);
  const digestOf = (space: number, max: number) => cardDigest(pack, modules, space - 2, max, moduleUrls, mcp);
  const digestSize = (d: { text: string }) => (d.text ? d.text.length + 2 : 0);
  let room = budget - fixedChars;
  const floor = digestSize(digestOf(room, ONE_FILE_BUDGET.digestMinCards));
  room -= floor;
  const inside = new Set(base);
  const take = (list: PackFile[]) => list.filter(f => {
    const size = sizeOf(f);
    if (size > room) return false;
    room -= size;
    inside.add(f.path);
    return true;
  });
  const seconds = take(second);
  const digest = digestOf(room + floor, ONE_FILE_BUDGET.digestCards);
  room += floor - digestSize(digest);
  const extras = take(extra);
  const parts = [
    ...core.map(f => partText(inside, f)),
    ...(digest.text ? [digest.text] : []),
    ...[...reference, ...seconds, ...extras, ...(license ? [license] : [])].map(f => partText(inside, f)),
  ];
  return normalizeText([head(digest.cards, inside), ...parts].join("\n\n"));
}

/** What the build gate reads from a one-file text: its size, its core (before the digest) and where each rule file starts. */
export interface OneFileStats {
  chars: number; tokens: number; coreChars: number; coreTokens: number; digestCards: number;
  /** Where each rule file starts, as a share of the file (0 to 1); null when the file has none. */
  depth: { agents: number | null; method: number | null; intake: number | null; outputPolicy: number | null };
  /** The budget lines this file breaks, in plain words; empty when it is within budget. */
  problems: string[];
}
export function oneFileStats(text: string): OneFileStats {
  const at = (path: string) => { const i = text.search(new RegExp(`^===== FILE: ${path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} =====$`, "m")); return i < 0 ? null : i / text.length; };
  const digestAt = text.indexOf(`\n${DIGEST_MARK}`);
  // The core ends at the digest, or (an agent with no card modules has none) at the first part outside ONE_FILE_ORDER.
  const patterns = ONE_FILE_ORDER.flatMap(g => g.paths);
  const after = [...text.matchAll(/^===== FILE: (.+?)(?: \(summary\))? =====$/gm)].find(x => orderOf(patterns, x[1]) < 0);
  const coreChars = digestAt >= 0 ? digestAt : after?.index !== undefined ? after.index - 1 : text.length;
  const depth = {
    agents: at("AGENTS.md"),
    method: at("METHOD.md") ?? at("WORK-METHOD.md"),
    intake: at("METHOD.md") ?? at("tools/quality/INTAKE.md") ?? at("INTAKE.md"),
    outputPolicy: at("OUTPUT-POLICY.md"),
  };
  const digest = digestAt < 0 ? "" : text.slice(digestAt);
  const digestCards = (digest.match(/^Card [A-Z]{2,4}-\d{4}\./gm) ?? []).length;
  const b = ONE_FILE_BUDGET, problems: string[] = [];
  const coreLimit = /^===== FILE: traction-playbook.md =====$/m.test(text.slice(0, coreChars)) ? b.megaCoreTokens : b.coreTokens;
  if (tokensOf(coreChars) > coreLimit) problems.push(`core before the digest is about ${tokensOf(coreChars)} tokens, over ${coreLimit}`);
  if (tokensOf(text.length) >= b.totalTokens) problems.push(`the whole file is about ${tokensOf(text.length)} tokens, not under ${b.totalTokens}`);
  for (const [name, d] of Object.entries(depth)) {
    if (d === null && name !== "intake") problems.push(`${name} is missing`);
    else if (d !== null && d > b.ruleDepth) problems.push(`${name} starts at ${(d * 100).toFixed(1)}% of the file, past ${b.ruleDepth * 100}%`);
  }
  return { chars: text.length, tokens: tokensOf(text.length), coreChars, coreTokens: tokensOf(coreChars), digestCards, depth, problems };
}

type BuiltFile = { url: string; bytes: number; version: string };

/**
 * files.json for the browsable copy: what the pack viewer lists, in pack order (never the zip-only skill copies).
 * Each file's url is where its text is served; the zips and the one-file version (sizes from the build) are added by
 * the caller.
 */
export function filesIndex(pack: BuiltPack, zips: { zip?: BuiltFile; train_zip?: BuiltFile; one_file?: BuiltFile } = {}) {
  return {
    schema: "ai-blocks-pack-files/1",
    agent_id: pack.manifest.agent_id,
    kind: pack.kind,
    role: pack.manifest.role,
    version: pack.manifest.version,
    updated: pack.manifest.updated,
    knowledge: pack.manifest.knowledge,
    ...(pack.manifest.mega ? { mega: pack.manifest.mega, team: pack.manifest.team } : {}),
    ...zips,
    files: pack.files.map(f => ({ path: f.path, url: fileUrl(pack, f), bytes: f.bytes, purpose: f.purpose, kind: f.group })),
    // What load_agent routes a request to (src/modules/packs/route.ts): job skills, role skills and workflows.
    // Only used for a pack with no curated toolbox: with one, the agent picks from toolbox.md itself.
    routes: pack.routes,
    // The curated toolbox in short (toolbox.ts, ToolboxSummary): tasks, item counts and names by type, helpers.
    // null while the role kit has no toolbox.json.
    toolbox: pack.toolbox?.summary ?? null,
  };
}
