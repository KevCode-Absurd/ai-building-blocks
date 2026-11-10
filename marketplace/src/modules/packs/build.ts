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
import { teamMarkdown } from "../directory/team.ts";
import { qualityMethodMarkdown } from "../directory/execution.ts";
import { outputPolicyMarkdown } from "../runner/output-policy.ts";
import { CAPTURE, FAMILY_LABELS, RUBRIC_GROUP, contextRequirements, familyGates, familyOf, familySlice } from "./families.ts";
import { bestRoute, type RouteCandidate } from "./route.ts";
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
 * "toolbox" = a library item's text, the same in every pack that carries it (served once at /packs/toolbox/).
 */
export type FileSource = "agent" | "role" | "job" | "mega" | "tools" | "toolbox";
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
  options: PackOptions;
}

/** The tools every agent pack carries (zip and files.json), in this order, and what each is for. */
export const TOOL_FILES: { name: string; purpose: string }[] = [
  { name: "capture-brand-dna.mjs", purpose: "Captures a live site into context/brand-dna.json and screenshots (Node and Playwright)." },
  { name: "brand-dna-snippet.js", purpose: "The same capture, pasted into any browser console." },
  { name: "check-brand-fidelity.mjs", purpose: "Checks a built page against context/brand-dna.json." },
  { name: "ai-default-patterns.md", purpose: "The named AI defaults to avoid unless chosen on purpose." },
];

/**
 * Whether a role's work carries a brand to the public. Only these roles get the brand-capture tools and the
 * questions about position and admired brands; a bookkeeper, recruiter or support agent gets what fits its work.
 * The rule: the department is marketing, content, design or ecommerce; or a linked job makes a web page or an ad;
 * or it is a sales role whose jobs are copy or email.
 */
const BRAND_DEPARTMENTS = new Set(["marketing", "content", "design", "ecommerce"]);
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

Start every job the way WORK-METHOD.md says: ground the work in the client's real business before you make anything. Facts, readiness and whose style wins are in OUTPUT-POLICY.md.

Read these files before you start, in this order:

1. WORK-METHOD.md: how every job runs.
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

- Ask once, in one short numbered message, five questions at most, for what capture cannot tell you.
- Never ask for passwords, API keys or card numbers. Ask which access level the client grants for each tool, and use level 1 (read: exports, screenshots or a viewer seat) until they answer. Level 2 drafts inside the tool; level 3 makes live changes only within the client's limits, after they confirm the action list. Log every action.
- Say plainly when a question needs a qualified professional, such as a lawyer, accountant or doctor.

## Not part of your work

{{not_for_list}}

Pack version {{version}}, updated {{updated}}. Profile: {{profile_url}}
`,
  // Only the outline: the full method is packs/shared/WORK-METHOD.md, which always wins when it exists.
  "WORK-METHOD.md": `# Work method: the Grounded Job Protocol

0. Frame: write context/job-card.md (client, outcome, deliverable kind, success measure, mode: patch whenever something exists).
1. Ground: capture the real business into context/ before you make anything (context/README.md). Every choice cites it.
2. Taste: write context/taste-brief.md: brand codes to keep, references, defaults to avoid.
3. Diverge: 2 or 3 directions that differ on substance, not colour or wording.
4. Build inside the client's system, with their real facts.
5. Check in a separate pass: gates pass or fail, then craft.
6. Record DECISIONS.md, and propose typed lessons for "Rules I learned" in playbook.md.
`,
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

Every job runs the way WORK-METHOD.md says. Facts, readiness and whose style wins are in OUTPUT-POLICY.md.

If soul.md still starts with a "template" line, training is not finished. Start by following instructions.md, and do no client work until training is done.

When training is done, you are the person described in soul.md and personality.md. Read, in order: soul.md, personality.md, playbook.md, knowledge.md and access.md.

{{team_list}}

## Skills

{{skills_list}}

## How you work

- Follow WORK-METHOD.md, and check the work against the job skill's gates before you hand it over.
- Never ask for passwords, API keys or card numbers.

Pack version {{version}}, updated {{updated}}.
`,
  "train/instructions.md": `# Training instructions

You are a training coach. Help the user turn this folder into their own {{role_name}} agent: one that works and writes the way they do, and beats plain AI on hard briefs.

Read OUTPUT-POLICY.md and WORK-METHOD.md first.

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
  agent: ["README.md", "AGENTS.md", "WORK-METHOD.md", "LICENSE.md"],
  train: ["train/README.md", "train/AGENTS.md", "train/instructions.md", "train/soul.md", "train/personality.md", "WORK-METHOD.md", "LICENSE.md"],
};

// ---------- Context and tools ----------

/**
 * Points every tools/<file> reference at the pack's own copy when it has one, else at the public copy
 * (<origin>/tools/<file>), so a pack never names a file it does not hold.
 */
const TOOL_REF = /(?<![\w/.-])tools\/([a-z0-9][a-z0-9.-]*\.(?:mjs|js|md))\b/g;
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
function contextReadme(jts: JobType[], tools: Set<string>, origin: string, brand = true): string {
  const families = [...new Set(jts.map(familyOf))];
  if (!families.length) families.push("other");
  // Roles that carry no brand to the public capture no site and get no capture tools (brandFacing).
  const capture = brand || tools.size > 0;
  const out = [
    "# Context: what to capture before the work",
    "",
    "Everything you capture about a client goes in a `context/` folder in their own project, never in this pack. AI Blocks stores none of it. Make only the files the job needs; WORK-METHOD.md says when each is written.",
    "",
    "## The folder",
    "",
    bullets([
      "`context/job-card.md`: client, outcome, deliverable kind, success measure, mode and access (step 0).",
      ...(capture ? ["`context/brand-dna.json` and `context/screenshots/`: the captured site (step 1)."] : []),
      "`context/voice.md`: verbatim voice samples, with customer words marked as theirs.",
      "`context/facts.md`: live facts, each with its source and the date you captured it.",
      "`context/references.md`: competitors and references, and what each does better.",
      "`context/data/`: dated snapshots of accounts or data, pulled at level 1.",
      "`context/taste-brief.md`: the taste brief (step 2).",
      "`DECISIONS.md`, next to the deliverable: what was considered, chosen and dropped (step 6).",
    ]),
    "",
    "## What to capture for my work",
    "",
  ];
  for (const f of families) {
    const jobs = jts.filter(jt => familyOf(jt) === f).map(jt => jt.title);
    out.push(`### ${FAMILY_LABELS[f]}${jobs.length ? ` (${jobs.join(", ")})` : ""}`, "", bullets(CAPTURE[f]), "");
  }
  if (capture) {
    out.push("## Tools", "", bullets(TOOL_FILES.map(t => tools.has(t.name) ? `\`tools/${t.name}\` (also at ${origin}/tools/${t.name}): ${t.purpose}` : `tools/${t.name}: ${t.purpose}`)), "",
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
 * (pass/fail gates, then weighted craft). The general protocol is WORK-METHOD.md; the craft steps are the role kit's
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
  const craft = jt.craft_rubric?.length
    ? ["| Criterion | Weight | How to test it |", "|---|---|---|", ...jt.craft_rubric.map(c => `| ${cell(c.criterion)} | ${c.weight} | ${cell(c.test)} |`)]
    : [
        ...jt.rubric.filter(c => !c.critical).map(c => `- ${c.text} (weight ${c.weight}). ${c.pass_rule}`),
        `- Then score specificity, fidelity, distinctiveness and job done with the ${RUBRIC_GROUP[family]} weights in WORK-METHOD.md, step 5.`,
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
    kind === "agent" ? `The steps of WORK-METHOD.md, as they apply to ${jt.title.toLowerCase()}:` : `The steps of WORK-METHOD.md, as they apply to ${jt.title.toLowerCase()}. Make them yours in playbook.md:`,
    "",
    `1. **Ground.** Capture into \`context/\` first (\`context/README.md\`, ${FAMILY_LABELS[family]}): ${required.length ? required.join("; ") : "what exists now"}. Nothing is produced before that file exists.`,
    `2. **Taste.** ${slice.taste}`,
    `3. **Diverge.** ${slice.diverge}`,
    `4. **Build** ${lowerFirst(jt.deliverable)}. ${pointer ? `Follow \`${pointer.path}\` (${pointer.title}) step by step for the craft. ` : ""}${slice.build}`,
    `5. **Check, in a separate pass.** ${slice.check} Then the gates and craft below.`,
    "6. **Record.** Write DECISIONS.md: what you considered, chose and dropped, and what to test next.",
    "",
    "## Gates: pass or fail",
    "",
    bullets([...gates, "And the gates for every job: WORK-METHOD.md, step 5."]),
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

/** The kinds of lesson "Rules I learned" holds (WORK-METHOD.md, step 6). */
export const RULE_TYPES = ["decision_rule", "taste_reference", "never_do", "exemplar", "check"] as const;

function rulesSection(train: boolean): string[] {
  return [
    "## Rules I learned", "",
    ...(train ? ["Rules come from test rounds. See instructions.md, stage 6.", ""] : []),
    "Add one line per lesson that holds for every client: `- [type] The rule. Why: the reason. From: where and when you learned it.`",
    `Types: ${RULE_TYPES.map(t => `\`${t}\``).join(", ")}. A lesson about one client stays in that client's context/, never here. These rules apply where relevant and never override the current task or the client's brand.`,
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
  out.push("I ground every job first: I capture what exists into context/ (WORK-METHOD.md, step 1), then ask only for what capture cannot tell me, in the one message AGENTS.md describes.", "");
  if (jts.length) {
    for (const jt of jts) out.push(`### ${jt.title}`, "", bullets(intakeLines(jt)), "");
  } else {
    out.push(bullets(["Context: your business, your website or what exists now, and 2 or 3 brands you admire.", "Details: the one result you want, who it is for, and when you need it."]), "");
  }
  out.push(...section("How I work"), persona.profile.method.trim(), "");
  out.push("These are my Build steps. Ground, Taste and Diverge come before them, and a separate Check comes after (WORK-METHOD.md).", "");
  if (jts.length) {
    out.push(...section("How my work is checked"));
    out.push("Each job's skill holds its gates, which pass or fail, and its craft scores:", "");
    out.push(bullets(jts.map(jt => `${jt.title}: \`${skillPaths.get(jt.id) ?? `skills/${jt.id}/SKILL.md`}\``)), "");
  }
  // What is not my work is in AGENTS.md ("Rules"), once.
  out.push(...section("Handoff"), "I hand back the work itself first, then the short note AGENTS.md describes, and DECISIONS.md for anything bigger than a quick answer. I say what to check before you publish or send it.", "");
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
    "The gates for every job in WORK-METHOD.md, step 5: a failed gate fails the answer.",
    "Answers what the brief asked, for the reader it names, grounded in the context the brief gives.",
    "Craft, scored with the family weights in WORK-METHOD.md: could a competitor publish it unchanged?",
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
  // the ones its role kit or its own method names, so a pack never points at a tool it lacks.
  const department = role?.department ?? persona.area;
  const families = [...new Set(jts.map(familyOf))];
  const brand = brandFacing(department, families);
  const kitText = brand ? "" : [...Object.values(kitFiles), persona.profile.method ?? ""].join("\n");
  const toolDrafts: Draft[] = agent
    ? TOOL_FILES.filter(t => input.tools?.[t.name]?.trim() && (brand || kitText.includes(`tools/${t.name}`)))
      .map(t => ({ path: `tools/${t.name}`, group: "tool" as const, content: input.tools![t.name], source: "tools" as const, purpose: `Tool: ${t.purpose}` }))
    : [];
  const toolNames = new Set(toolDrafts.map(d => d.path.slice("tools/".length)));

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
  // A curated agent pack has no library.md: the toolbox carries those items in full. Training packs keep it,
  // because packs/shared/train/AGENTS.md names it.
  const withLibraryMd = !builtToolbox || !agent;

  // The examples guide may be a template, as train/examples/README.md or train/examples-README.md.
  const examplesTemplate = ["train/examples/README.md", "train/examples-README.md"].find(t => templates[t]?.trim()) ?? null;
  const drafts: Draft[] = [
    { path: "README.md", group: "start", template: agent ? "README.md" : "train/README.md",
      purpose: agent ? "Start here: who this is, what's inside and how to load it in your AI tool." : "Start here: what training does and how to begin." },
    { path: "AGENTS.md", group: "start", template: agent ? "AGENTS.md" : "train/AGENTS.md", purpose: "The operating instructions any AI reads first." },
    { path: "CLAUDE.md", group: "start", content: "@AGENTS.md", purpose: "Points Claude Code to AGENTS.md." },
    { path: "toolbox.md", group: "start", content: toolboxMarkdown,
      purpose: builtToolbox ? "What to use when: every skill, prompt, workflow, thinking lens and helper for this role, task by task." : "The skills, prompts and workflows in this pack, in one list." },
    { path: "WORK-METHOD.md", group: "start", template: "WORK-METHOD.md", resolveTools: true, purpose: "How every job runs: ground, taste, diverge, build, check and record, with the gates and craft rubrics." },
    { path: "context/README.md", group: "start", content: contextReadme(jts, toolNames, origin, brand), resolveTools: true, purpose: "What to capture about the client before the work, by kind of work, and where each file goes." },
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
    { path: "knowledge.md", group: "knowledge", content: knowledgeMarkdown(persona, kit, kind, roleName, megaKit),
      purpose: knowledgeReady ? "What I know about the role, with sources, then my specialty." : megaKit ? "My specialty, and where my channel knowledge is." : "My specialty. The role's researched knowledge is coming." },
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
    if (d.path === "pack.json") continue;
    let content = d.template ? fillTemplate(d.template, templates[d.template], values) : d.content!;
    // A pack never names a tools/ file it lacks: train packs ship no tools/, so their role kit files, playbook and knowledge point at the public copy.
    if (d.resolveTools || (kind === "train" && (sourceOf(d) === "role" || d.path === "playbook.md" || d.path === "knowledge.md"))) content = resolveToolRefs(content, toolNames, origin);
    if (!agent && (d.path === "soul.md" || d.path === "personality.md") && !content.replace(/^\uFEFF/, "").trimStart().startsWith(TEMPLATE_MARKER)) {
      content = `${TEMPLATE_MARKER}\n${content}`;
    }
    // A mega agent's AGENTS.md always has its team, even while the shared template has no {{team_list}} yet.
    if (megaKit && d.path === "AGENTS.md" && !templates[d.template!].includes("{{team_list}}")) {
      content = `${normalizeText(content).trimEnd()}\n\n${values.team_list}`;
      notes.push(`packs/shared/${d.template} has no {{team_list}}, so the channel team was added at the end of ${persona.id}'s ${kind} AGENTS.md`);
    }
    content = normalizeText(content);
    files.push({ path: d.path, content, purpose: d.purpose, group: d.group, bytes: encoder.encode(content).length, sha256: await sha256(content), source: sourceOf(d), ...(d.sharedPath ? { sharedPath: d.sharedPath } : {}) });
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
  if (file.source === "tools" || file.source === "toolbox") return `/packs/${file.path}`;
  return `/packs/${pack.manifest.agent_id}/${file.path}`;
}

/** Folder names under /packs that are not agents, so no agent id may use them. */
export const RESERVED_PACK_PATHS = new Set(["roles", "jobs", "mega", "tools", "toolbox", "toolbox-index.json", "toolbox-index", "index.json", "index"]);

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
const isToolScript = (path: string) => /^tools\/.+\.(mjs|js)$/.test(path);

/** The setup guide, the pointer for Claude Code and the record files are for people and tools, not the agent. */
// QUALITY-METHOD.md is only for hosts that call the AI Blocks MCP job tools, and those load it through MCP: a chat
// app never needs it, so the one file leaves it out (the zip keeps it).
const NOT_IN_ONE_FILE = new Set(["README.md", "CLAUDE.md", "CHANGELOG.md", "pack.json", "QUALITY-METHOD.md"]);

/**
 * <id>.txt: the whole agent in one plain text file, for chat apps (ChatGPT, Claude, Gemini) where one attachment is
 * the quickest start. It holds every file the agent reads, AGENTS.md first, each after a "===== FILE: <path> ====="
 * line; each skill's SKILL.md is left out when skills.md holds them all. Plain .txt, because every chat app takes it
 * (Gemini's list of file types does not name .md). Agent packs only.
 */
export function oneFileText(pack: BuiltPack, origin: string = ORIGIN, inlineItems: number = ONE_FILE_ITEMS): string {
  if (pack.kind !== "agent") throw new PackBuildError(`only agent packs have a one-file version, not ${pack.kind} packs`);
  const m = pack.manifest, site = origin.replace(/\/+$/, "");
  const bundled = pack.files.some(f => f.path === "skills.md");
  // Scripts stay out (a chat app cannot run them); every reference to one points at its public copy instead.
  const kept = new Set(pack.files.filter(f => f.path.startsWith("tools/") && !isToolScript(f.path)).map(f => f.path.slice("tools/".length)));
  // The toolbox's library items: the best few for this agent are here in full; the rest are named by address, so the
  // file stays small enough to attach to a chat. Each address is one known page, not a search.
  const items = pack.files.filter(f => f.source === "toolbox");
  const inline = new Set((pack.toolbox?.top ?? []).filter(p => items.some(f => f.path === p)).slice(0, inlineItems));
  const away = items.filter(f => !inline.has(f.path)).map(f => f.path);
  const byAddress = (text: string) => away.length ? text.replace(/(?<![\w/.-])toolbox\/[a-z]+\/[a-z0-9-]+\.md\b/g, p => inline.has(p) || !away.includes(p) ? p : `${site}/packs/${p}`) : text;
  const files = pack.files
    .filter(f => !NOT_IN_ONE_FILE.has(f.path) && !isToolScript(f.path) && !(bundled && /^skills\/[^/]+\/SKILL\.md$/.test(f.path)) && !(f.source === "toolbox" && !inline.has(f.path)))
    .sort((a, b) => Number(b.path === "AGENTS.md") - Number(a.path === "AGENTS.md"));
  const head = [
    `# ${m.name}, ${m.title}: the whole agent in one file`,
    "",
    `This is ${m.name}'s agent pack from AI Blocks, version ${m.version}, in one file for chat apps such as ChatGPT, Claude and Gemini. Attach it to a chat, or add it to a project or Gem, and your AI works as ${m.name}. It runs on your own AI plan.`,
    "",
    `For the AI reading this: each part below is one file of the pack and starts with a line such as "===== FILE: playbook.md =====". When your instructions say to open or read a file, read that part. Start with the AGENTS.md part and follow it.${bundled ? " Every skill is in the skills.md part, under its own heading, so a path such as skills/<name>/SKILL.md means that heading." : ""}${away.length ? ` The toolbox.md part names ${items.length} library items: ${inline.size} are parts of this file, and each of the other ${away.length} is one page at the address beside its name. Open that page when you choose the item; if you cannot open pages, ask the person to paste it or work from the items you have.` : ""}`,
    "",
    `Free to use and change, not to sell: the LICENSE.md part has the terms. Newest version and ${m.name}'s profile: ${site}/agents/${m.agent_id}`,
  ];
  const parts = files.map(f => `===== FILE: ${f.path} =====\n\n${byAddress(resolveToolRefs(f.content, kept, site)).trim()}`);
  return normalizeText([head.join("\n"), ...parts].join("\n\n"));
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
