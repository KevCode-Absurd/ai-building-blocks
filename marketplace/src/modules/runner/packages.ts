// House agent packages: plan -> draft -> check and fix, compiled from a persona's method (or a strong generic method)
// and the job type's deliverable, rubric and limits. Pure and deterministic: same inputs, same package, same sha256.
import type { AgentPackage, AgentStep, Area, JobType, Persona, PersonaSoul, RubricCriterion, SpecField } from "../../core/types.ts";
import { sha256Hex, stableJson } from "../../core/db.ts";

/** Plain-writing rules every house agent follows (AI Blocks style: grade 8 to 9, specific, no hype). */
export const STYLE_RULES: string[] = [
  "Write for the reader named in the brief, at a grade 8 to 9 reading level.",
  "Keep sentences short: aim for 15 words and split anything over 25.",
  "One idea per sentence. Use the active voice and say who does what.",
  "Use concrete nouns from the brief (the product, the price, the place) instead of general words.",
  "Use the simple word: use, help, start, get, show, more, about.",
  "Say a thing once. Cut filler words such as very, really, just, actually and simply.",
  "Headings say what the section gives the reader. Buttons and calls to action start with a verb.",
  "Match the buyer's voice notes when they give them; otherwise be warm, direct and calm.",
];

/** Words that read as hype or as AI-written copy. */
export const HYPE_WORDS: string[] = [
  "delve", "foster", "leverage", "utilize", "facilitate", "empower", "streamline", "robust", "cutting-edge", "game changer",
  "game-changer", "unlock", "supercharge", "harness", "elevate", "seamless", "effortless", "transformative", "revolutionize",
  "paradigm", "synergy", "holistic", "ecosystem", "best-in-class", "world-class", "next-level", "magic",
];

/** Things the draft must never contain. The first five protect the buyer from invented claims. */
export const BANNED_PATTERNS: string[] = [
  "Invented facts: any fact about the buyer's business, product or market that is not in the brief, details or brand profile.",
  "Invented numbers: prices, percentages, results, dates, counts or statistics that the buyer did not give.",
  "Invented quotes, testimonials or reviews, and invented customer, partner or press names.",
  "Invented awards, certifications, guarantees or claims about health, money or legal outcomes.",
  "Links or sources the buyer did not give (suggest where a link should go instead, in [brackets]).",
  `Hype words: ${HYPE_WORDS.join(", ")}.`,
  "Contrast reveals such as \"It's not X, it's Y\" or \"Not just X, but Y\". Say Y, with the reason.",
  "Stock openers such as \"In today's fast-paced world\", \"Whether you're X or Y\", \"Here's the thing\" or \"Say goodbye to\".",
  "Self-answered questions and colon reveals such as \"The result? More sales.\" Just say it.",
  "Trailing clauses that pile on after the point is made, and endings that recap or add a cute one-liner.",
  "Em dashes. Use a full stop, a comma or brackets.",
  "Emoji, exclamation marks and ALL CAPS labels.",
  "Notes about how you worked, apologies, or remarks about being an AI.",
];

/** Job types whose draft step runs on the premium tier: long or complex deliverables. */
export function isLongJob(jobType: JobType): boolean {
  return jobType.price.base_usd >= 199 || jobType.turnaround_hours >= 72;
}

const AREA_TIPS: Record<Area, string> = {
  marketing: "Lead with the buyer's customer and the problem they want solved. Every part points to one clear next step.",
  content: "Answer the reader's real question early, then go deeper. Headings should work as a summary on their own.",
  sales: "Write to one buyer at one company. Make it about their problem, keep it short, and ask for one small next step.",
  ecommerce: "Help a shopper decide fast: what it is, who it suits, what it is made of, and what happens after they buy.",
  "customer-support": "Solve the customer's problem in as few steps as possible. Be kind, specific and clear about what happens next.",
  research: "Separate what the data shows from what you infer. Say how sure you are and what would change the answer.",
  finance: "Show the numbers the buyer gave, in tables where it helps. Never fill a gap with a made-up figure; flag it instead.",
  people: "Be fair, specific and lawful. Write so the person on the other side knows exactly what is expected of them.",
  operations: "Make every step something a person can do, with an owner and a clear finish line.",
  product: "Be exact. Name the user, the problem and how anyone can tell the work is done.",
  engineering: "Write code that runs as given: complete files or functions, the language and versions stated, no invented APIs or libraries, and short notes on how to run and test it.",
  data: "Show your working on the buyer's own data. Say what each number means, how it was computed and what the data cannot tell you.",
  design: "Be specific enough that a designer, editor or tool can make it without guessing: sizes, order, words on screen and the reason for each choice.",
  learning: "Start from what the learner can already do and what they must be able to do at the end. Check each part against that goal.",
};

/** A strong generic method for a job type when no persona wrote one. */
export function genericMethod(jobType: JobType): string {
  return [
    "1. Read the request and the details twice. Write down the one result the buyer wants and who the work is for.",
    "2. List every fact you were given: names, prices, numbers, dates, proof and links. These are the only facts you may use.",
    "3. Note what is missing. Where a fact is needed, use a short placeholder in square brackets, such as [add your price], never a guess.",
    `4. Plan the structure from the deliverable (${lowerFirst(jobType.deliverable)}) and give each part one job.`,
    "5. Write for the reader named in the brief: use their words, answer their questions and give them a clear next step.",
    `6. ${AREA_TIPS[jobType.area] ?? "Keep every part useful to the buyer."}`,
    "7. Check the draft against every rubric item and the checklist. Fix anything that fails before you hand it over.",
  ].join("\n");
}

function lowerFirst(text: string): string {
  const t = text.trim().replace(/\.$/, "");
  return t ? t[0].toLowerCase() + t.slice(1) : t;
}

function kebab(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64).replace(/-+$/, "");
}

export function rubricMarkdown(rubric: RubricCriterion[]): string {
  if (!rubric.length) return "(no rubric given)";
  return rubric.map(c => `- ${c.id}${c.critical ? " (must pass)" : ""}: ${c.text} Pass rule: ${c.pass_rule}`).join("\n");
}

function checklistFor(jobType: JobType, notFor: string[]): string[] {
  return [
    `It gives the buyer exactly this: ${jobType.deliverable}`,
    ...jobType.rubric.map(c => `${c.id}: ${c.pass_rule}`),
    "Every fact, number, name, quote and review comes from the request, the details or the brand profile.",
    "Missing facts are shown as [placeholders] the buyer can fill in, never guessed.",
    "Plain words and short sentences; no hype words, banned patterns or em dashes.",
    ...(notFor.length ? [`Nothing from the not-for list: ${notFor.join("; ")}.`] : []),
    "It is complete and ready to use, with no notes about how it was written.",
  ];
}

function jobBlock(jobType: JobType): string {
  return `## Job\n${jobType.title} (job type id: ${jobType.id})\nDeliverable: ${jobType.deliverable}`;
}

const CONTEXT = [
  "## Buyer's request\n{{request}}",
  "## Details (spec)\n{{spec}}",
  "## Brand profile\n{{brand}}",
  "## Rubric\n{{rubric}}",
  "## Earlier version\n{{previous}}",
  "## Changes asked for\n{{feedback}}",
].join("\n\n");

function buildSteps(jobType: JobType, checklist: string[]): AgentStep[] {
  const long = isLongJob(jobType);
  const draftTokens = long ? 12000 : 6000;
  return [
    {
      id: "plan",
      title: "Plan the work",
      tier: "standard",
      output: "markdown",
      max_tokens: 2500,
      prompt: [
        "Plan the work for this job. Do not write the deliverable yet.",
        jobBlock(jobType),
        CONTEXT,
        [
          "Write a short plan in markdown with these headings:",
          "1. Goal: the one result the buyer wants, and who it is for.",
          "2. Facts I can use: every fact from the request, details and brand profile, as a list. Nothing else.",
          "3. Missing facts: what is missing, and the [placeholder] you will use for each.",
          "4. Outline: the parts of the deliverable in order, with one line on what each part does.",
          "5. Rubric: for each rubric item, how the draft will pass it.",
          "6. Changes: if changes were asked for, how you will make each one. Otherwise write \"None\".",
        ].join("\n"),
      ].join("\n\n"),
    },
    {
      id: "draft",
      title: "Write the draft",
      tier: long ? "premium" : "standard",
      output: "markdown",
      max_tokens: draftTokens,
      prompt: [
        "Write the complete deliverable now, following your plan.",
        jobBlock(jobType),
        "## Plan\n{{step:plan}}",
        CONTEXT,
        [
          "Rules for this step:",
          `- Deliver this, complete: ${jobType.deliverable}`,
          "- Markdown only. Start with the first heading of the deliverable. No preamble and no notes about how you worked.",
          "- Use only the facts listed in the plan. Use [placeholders] for anything missing.",
          "- If an earlier version is shown, keep what works and make every change asked for.",
        ].join("\n"),
      ].join("\n\n"),
    },
    {
      id: "check_and_fix",
      title: "Check against the rubric and fix",
      tier: "standard",
      output: "markdown",
      max_tokens: draftTokens,
      prompt: [
        "Check this draft against the rubric and the checklist, then fix it.",
        jobBlock(jobType),
        "## Draft\n{{step:draft}}",
        CONTEXT,
        `## Checklist\n${checklist.map(c => `- ${c}`).join("\n")}`,
        [
          "Go through each rubric item and each checklist line. Where the draft fails one, fix it.",
          "Remove any fact, number, name, quote or review that is not in the request, the details or the brand profile.",
          "Remove hype words and the banned patterns. Make every change asked for.",
          "Return only the final deliverable in markdown, complete, with no comments about the check.",
        ].join("\n"),
      ].join("\n\n"),
    },
  ];
}

/** Compile a house agent package for a persona (or the generic house agent when persona is null) and a job type. */
export function buildHousePackage(persona: Persona | null, jobType: JobType): AgentPackage {
  const outcome = persona?.profile.outcomes.find(o => o.job_type_id === jobType.id) ?? null;
  const notFor = [...jobType.not_for, ...(persona?.profile.not_for ?? [])];
  const checklist = checklistFor(jobType, notFor);
  const name = persona ? `${persona.name}, ${persona.title}: ${jobType.title}` : `AI Blocks house agent: ${jobType.title}`;
  const method = persona?.profile.method?.trim() || genericMethod(jobType);

  const intro = persona
    ? `You are ${persona.name}, ${persona.title} at AI Blocks. ${persona.tagline}\n\n${persona.profile.bio}`
    : `You are the AI Blocks house agent for ${jobType.title.toLowerCase()}. You do this one job well for small businesses and teams.`;
  const sections: string[] = [
    `# ${name}`,
    intro,
    `## The job\n${jobType.summary}\n\nWhat the buyer gets: ${jobType.deliverable}` +
      (outcome ? `\n\nAs ${persona!.name}'s outcome "${outcome.title}": ${outcome.deliverable}` : ""),
    `## How you work\n${method}`,
  ];
  if (persona) {
    if (persona.profile.capabilities.length) sections.push(`## What you work with\n${persona.profile.capabilities.map(c => `- ${c}`).join("\n")}`);
    if (persona.profile.good_at.length) sections.push(`## Good at\n${persona.profile.good_at.map(c => `- ${c}`).join("\n")}`);
    if (persona.profile.soul) sections.push(`## Who you are\n${soulBrief(persona.profile.soul)}`);
  }
  sections.push(
    `## Not part of this job\n${notFor.map(n => `- ${n}`).join("\n") || "- (nothing listed)"}\n\nIf the request asks for any of these, do the rest of the job, leave that part out, and say so in one plain line at the end.`,
    `## How the work is checked\nEvery draft is scored against the job's rubric before anyone sees it. Items marked "must pass" fail the whole draft. The buyer may add up to three items of their own; the full rubric comes with each request.\n\n${rubricMarkdown(jobType.rubric)}`,
    `## Facts\nUse only facts from the request, the details and the brand profile. Where a fact is needed and missing, write a short placeholder in square brackets, such as [add your price], instead of guessing.`,
    `## Writing rules\n${STYLE_RULES.map(r => `- ${r}`).join("\n")}`,
    `## Never write\n${BANNED_PATTERNS.map(r => `- ${r}`).join("\n")}`,
  );

  const files: AgentPackage["files"] = [
    { path: "reference/rubric.md", content: `# Rubric for ${jobType.title}\n\n${rubricMarkdown(jobType.rubric)}\n` },
    { path: "reference/style-guide.md", content: `# Writing rules\n\n${STYLE_RULES.map(r => `- ${r}`).join("\n")}\n\n# Never write\n\n${BANNED_PATTERNS.map(r => `- ${r}`).join("\n")}\n` },
    { path: "reference/checklist.md", content: `# Checklist\n\n${checklist.map(c => `- [ ] ${c}`).join("\n")}\n` },
    { path: "reference/spec-fields.md", content: `# Details the buyer can give\n\n${specFieldsMarkdown(jobType.spec_fields)}\n` },
  ];
  if (persona) files.push({ path: "reference/persona.md", content: `# ${persona.name}, ${persona.title}\n\n${persona.tagline}\n\n${persona.profile.bio}\n\n## Method\n\n${method}\n` });
  if (persona?.profile.soul) files.push({ path: "reference/soul.md", content: `# ${persona.name}, ${persona.title}\n\n${soulBrief(persona.profile.soul)}\n` });

  return {
    schema: "ai-blocks-agent/1",
    job_type_id: jobType.id,
    name,
    skill: {
      name: kebab(persona ? `${persona.id}-${jobType.id}` : `house-${jobType.id}`),
      description: `${jobType.summary} Delivers: ${jobType.deliverable}`.slice(0, 1024),
      instructions: sections.join("\n\n"),
    },
    files,
    steps: buildSteps(jobType, checklist),
    style_rules: [...STYLE_RULES],
    banned_patterns: [...BANNED_PATTERNS],
    checklist,
  };
}

/**
 * The persona's character (its soul) as instructions. It shapes how the agent thinks about the job, the choices it
 * makes and the voice of its own notes to the buyer. It never changes the facts, the rubric or the tone the buyer
 * asked for in the deliverable itself.
 */
function soulBrief(soul: PersonaSoul): string {
  return [
    soul.essence,
    `How you think: ${soul.temperament}`,
    `How you talk to the buyer: ${soul.voice}`,
    `What you care about:\n${soul.values.map(v => `- ${v}`).join("\n")}`,
    `Your working habits:\n${soul.quirks.map(q => `- ${q}`).join("\n")}`,
    `When the brief is thin or you disagree: ${soul.pushback}`,
    `Outside work: ${soul.off_hours}`,
    "Let this character show in your judgment, in the choices you make and in any short note to the buyer. In the deliverable itself, follow the tone the buyer asked for and the writing rules. Your character never changes the facts or the checklist.",
  ].join("\n\n");
}

/** Exported for agent packs (packs/build.ts): a job type's details as a list the agent asks for. */
export function specFieldsMarkdown(fields: SpecField[]): string {
  return fields.map(f => `- ${f.id} (${f.label})${f.required ? ", required" : ""}${f.help ? `: ${f.help}` : ""}`).join("\n") || "(none)";
}

/** The digest stored in agent_versions.sha256. */
export async function packageSha(pkg: AgentPackage): Promise<string> {
  return sha256Hex(stableJson(pkg));
}

// ---------- Prompt rendering ----------

export interface PromptContext {
  request: string;
  spec: Record<string, unknown>;
  specFields?: SpecField[];
  rubric: RubricCriterion[];
  brand: Record<string, unknown>;
  previous: string;
  feedback: string;
  steps: Record<string, string>;
}

function valueText(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";
  if (Array.isArray(value)) return value.map(valueText).filter(Boolean).join("; ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value).trim();
}

export function specMarkdown(spec: Record<string, unknown>, fields: SpecField[] = []): string {
  const labels = new Map(fields.map(f => [f.id, f.label]));
  const order = [...fields.map(f => f.id), ...Object.keys(spec).filter(k => !labels.has(k)).sort()];
  const lines = order.filter(id => valueText(spec[id])).map(id => `- ${labels.get(id) ?? id} [${id}]: ${valueText(spec[id])}`);
  return lines.join("\n") || "(none given)";
}

function brandMarkdown(brand: Record<string, unknown>): string {
  const lines = Object.keys(brand).sort().filter(k => valueText(brand[k])).map(k => `- ${k}: ${valueText(brand[k])}`);
  return lines.join("\n") || "(none given)";
}

/** Fill a step prompt. One pass, so placeholders inside the buyer's own text are never expanded. */
export function renderPrompt(template: string, ctx: PromptContext): string {
  return template.replace(/\{\{(request|spec|rubric|brand|previous|feedback|step:[a-z0-9_]+)\}\}/g, (_m, key: string) => {
    if (key.startsWith("step:")) return ctx.steps[key.slice(5)]?.trim() || "(not written yet)";
    switch (key) {
      case "request": return ctx.request.trim() || "(none given)";
      case "spec": return specMarkdown(ctx.spec, ctx.specFields);
      case "rubric": return rubricMarkdown(ctx.rubric);
      case "brand": return brandMarkdown(ctx.brand);
      case "previous": return ctx.previous.trim() || "(none: this is the first version)";
      case "feedback": return ctx.feedback.trim() || "(none)";
      default: return "";
    }
  });
}
