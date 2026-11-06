// Agent package validation for the studio: the zod schema for AgentPackage (src/core/types.ts), extra checks the
// runner relies on, approved-rule merging and a check that compiled packages never copy an expert's past work.
import { z } from "zod";
import type { AgentPackage } from "../../core/types.ts";

export const PACKAGE_SCHEMA = "ai-blocks-agent/1";
/** Placeholders the runner fills in step prompts (see AgentStep in core/types.ts). {{step:<id>}} is checked separately. */
const PLACEHOLDERS = new Set(["request", "spec", "rubric", "brand", "previous", "feedback"]);
const MAX_PACKAGE_CHARS = 250_000;
export const MAX_RULES = 40;

const snake = z.string().regex(/^[a-z][a-z0-9_]{0,59}$/, "snake_case id");
const rule = z.string().trim().min(3).max(400);

export const agentStepSchema = z.object({
  id: snake,
  title: z.string().trim().min(2).max(80),
  prompt: z.string().min(20).max(12000),
  tier: z.enum(["small", "standard", "premium"]),
  output: z.enum(["markdown", "json"]),
  max_tokens: z.number().int().min(200).max(16000),
}).strict();

export const agentPackageSchema = z.object({
  schema: z.literal(PACKAGE_SCHEMA),
  job_type_id: z.string().regex(/^[a-z][a-z0-9-]{2,59}$/, "kebab-case job type id"),
  name: z.string().trim().min(2).max(100),
  skill: z.object({
    name: z.string().regex(/^[a-z0-9][a-z0-9-]{1,63}$/, "kebab-case skill name"),
    description: z.string().trim().min(10).max(1024),
    instructions: z.string().min(50).max(60000),
  }).strict(),
  files: z.array(z.object({
    path: z.string().max(120).regex(/^[a-z0-9][a-z0-9_-]*(\/[a-z0-9][a-z0-9_-]*)*\.(md|txt|json)$/, "a relative path such as reference/style.md"),
    content: z.string().max(30000),
  }).strict()).max(12),
  steps: z.array(agentStepSchema).min(1).max(6),
  style_rules: z.array(rule).max(MAX_RULES),
  banned_patterns: z.array(rule).max(MAX_RULES),
  checklist: z.array(rule).min(1).max(MAX_RULES),
}).strict();

// Compile-time proof that the schema matches the shared AgentPackage type.
type Parsed = z.infer<typeof agentPackageSchema>;
const _matches: (p: Parsed) => AgentPackage = p => p;
void _matches;

/** JSON schema for providers that support structured output. */
export const packageJsonSchema = z.toJSONSchema(agentPackageSchema) as Record<string, unknown>;

/** Keep only known keys (models add extras), and pin the fields the studio decides. */
export function normalizePackage(raw: unknown, pin: { jobTypeId: string; name: string }): unknown {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, any>;
  const pick = (o: any, keys: string[]) => (o && typeof o === "object" ? Object.fromEntries(keys.filter(k => k in o).map(k => [k, o[k]])) : o);
  return {
    schema: PACKAGE_SCHEMA,
    job_type_id: pin.jobTypeId,
    name: pin.name,
    skill: pick(r.skill, ["name", "description", "instructions"]),
    files: Array.isArray(r.files) ? r.files.map((f: any) => pick(f, ["path", "content"])) : [],
    steps: Array.isArray(r.steps) ? r.steps.map((s: any) => pick(s, ["id", "title", "prompt", "tier", "output", "max_tokens"])) : r.steps,
    style_rules: Array.isArray(r.style_rules) ? r.style_rules : [],
    banned_patterns: Array.isArray(r.banned_patterns) ? r.banned_patterns : [],
    checklist: Array.isArray(r.checklist) ? r.checklist : r.checklist,
  };
}

export function validateAgentPackage(value: unknown, opts: { jobTypeId?: string } = {}): { ok: true; pkg: AgentPackage } | { ok: false; errors: string[] } {
  const parsed = agentPackageSchema.safeParse(value);
  if (!parsed.success) return { ok: false, errors: parsed.error.issues.map(i => `${i.path.join(".") || "package"}: ${i.message}`) };
  const pkg: AgentPackage = parsed.data;
  const errors: string[] = [];
  if (opts.jobTypeId && pkg.job_type_id !== opts.jobTypeId) errors.push(`job_type_id must be ${opts.jobTypeId}`);
  const seen = new Set<string>();
  for (const [i, step] of pkg.steps.entries()) {
    if (seen.has(step.id)) errors.push(`steps.${i}.id: duplicate step id ${step.id}`);
    // The runner fills placeholders only in this exact form (runner/packages.ts renderPrompt), so anything else is a mistake.
    const used = [...step.prompt.matchAll(/\{\{([^{}]*)\}\}/g)].map(m => m[1]);
    if (!used.length) errors.push(`steps.${i}.prompt: use at least one placeholder such as {{request}} or {{step:<id>}}`);
    for (const key of used) {
      if (/^step:[a-z0-9_]+$/.test(key)) {
        if (!seen.has(key.slice(5))) errors.push(`steps.${i}.prompt: {{${key}}} must name an earlier step`);
      } else if (!PLACEHOLDERS.has(key)) {
        errors.push(`steps.${i}.prompt: unknown placeholder {{${key}}}. Write placeholders exactly, such as {{request}}, with no spaces`);
      }
    }
    if (i > 0 && !used.some(k => k.startsWith("step:"))) errors.push(`steps.${i}.prompt: read the earlier step's work with {{step:<id>}}`);
    seen.add(step.id);
  }
  if (!pkg.steps.some(s => s.prompt.includes("{{request}}"))) errors.push("steps: one step must read the buyer's request with {{request}}");
  if (pkg.steps[pkg.steps.length - 1].output !== "markdown") errors.push("steps: the last step writes the draft, so its output must be markdown");
  const paths = pkg.files.map(f => f.path);
  if (new Set(paths).size !== paths.length) errors.push("files: duplicate paths");
  if (JSON.stringify(pkg).length > MAX_PACKAGE_CHARS) errors.push("package: too large");
  return errors.length ? { ok: false, errors } : { ok: true, pkg };
}

const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();

/** Adds approved rules (kept even if the model forgot them), removes duplicates, and keeps the newest MAX_RULES. */
export function mergeRules(pkg: AgentPackage, approved: { target: "style_rules" | "checklist"; text: string }[]): AgentPackage {
  const merge = (base: string[], extra: string[]) => {
    const out: string[] = [], keys = new Set<string>();
    for (const r of [...base, ...extra]) {
      const k = norm(r);
      if (!k || keys.has(k)) continue;
      keys.add(k); out.push(r.trim());
    }
    // Approved rules come last, so trimming from the front keeps them.
    return out.slice(-MAX_RULES);
  };
  return {
    ...pkg,
    style_rules: merge(pkg.style_rules, approved.filter(a => a.target === "style_rules").map(a => a.text)),
    checklist: merge(pkg.checklist, approved.filter(a => a.target === "checklist").map(a => a.text)),
  };
}

const RULES_MARK = "<!-- studio:rules -->";

/**
 * The runner sends only skill.instructions and the step prompts to the model, so the rule lists must be written into
 * the instructions to change what the agent writes. Replaces any earlier block, so rebuilding never stacks copies.
 */
export function withRuleBlock(pkg: AgentPackage): AgentPackage {
  const base = pkg.skill.instructions.split(RULES_MARK)[0].trimEnd();
  const NL = String.fromCharCode(10);
  const list = (xs: string[]) => xs.map(x => `- ${x}`).join(NL);
  const parts: string[] = [];
  if (pkg.style_rules.length) parts.push(["### How you write", list(pkg.style_rules)].join(NL));
  if (pkg.banned_patterns.length) parts.push(["### Never write anything like this", list(pkg.banned_patterns)].join(NL));
  parts.push(["### Check every draft against this before you finish", list(pkg.checklist)].join(NL));
  const instructions = [base, "", RULES_MARK, "## Rules you always follow", "", parts.join(NL + NL), ""].join(NL);
  return { ...pkg, skill: { ...pkg.skill, instructions } };
}

/**
 * Titles of examples whose text appears in the package (any 80-character run, ignoring spacing and case).
 * The agent learns from past work; it must never carry a client's text into buyers' drafts.
 */
export function copiedExamples(pkg: AgentPackage, examples: { title: string; result: string }[]): string[] {
  const strings: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") strings.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(pkg);
  const hay = norm(strings.join(" \n "));
  const copied: string[] = [];
  for (const ex of examples) {
    const text = norm(ex.result);
    for (let i = 0; i + 80 <= text.length; i += 40) {
      if (hay.includes(text.slice(i, i + 80))) { copied.push(ex.title); break; }
    }
  }
  return copied;
}

/**
 * Rejects text that looks like a password, API key or private key.
 * Pattern adapted from checkedExpertJson in site/src/agents/expert-agent-contract.mjs.
 */
export function looksLikeSecret(text: string): boolean {
  return /\b(?:sk-proj-|sk-ant-api\d+-|sk_live_|rk_live_)[A-Za-z0-9_-]{16,}|\bAKIA[A-Z0-9]{16}\b|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bBearer\s+[A-Za-z0-9._~-]{24,}/i.test(text);
}
