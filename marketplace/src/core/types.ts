// Shared domain types. Modules import these; module-only types stay inside the module.
// Changing a type here affects every module: note it in your report instead of editing it while others build.

/** Business areas used to group job types. Buyers come from every industry; areas are the kind of work. */
export const AREAS = [
  "marketing", "content", "sales", "ecommerce", "customer-support", "research",
  "finance", "people", "operations", "product",
] as const;
export type Area = (typeof AREAS)[number];

// ---------- Job types (the menu) ----------

export type SpecFieldType = "text" | "longtext" | "number" | "choice" | "multichoice" | "list" | "url";
export interface SpecField {
  id: string;            // snake_case, unique within the job type
  label: string;         // plain words shown to the buyer
  type: SpecFieldType;
  required: boolean;
  help?: string;         // one short sentence
  options?: string[];    // for choice / multichoice
  max?: number;          // max length (text) or max value (number) or max items (list)
}

export interface RubricCriterion {
  id: string;            // snake_case
  text: string;          // what good looks like, in plain words
  weight: number;        // 1 to 5
  pass_rule: string;     // how a judge decides pass or fail, concrete and checkable
  critical: boolean;     // a fail here fails the whole draft
  source: "template" | "buyer";
}

export interface PriceBand {
  base_usd: number;      // price for the standard size
  min_usd: number;
  max_usd: number;
  /** Optional size adjuster: price grows with a numeric spec field beyond what the base includes. */
  size?: { field: string; unit: string; included: number; per_unit_usd: number };
  rush_multiplier: number; // e.g. 1.5 for half the turnaround
}

export interface SampleBrief {
  id: string;
  text: string;          // a realistic buyer request, in a buyer's words
  visibility: "public" | "hidden"; // hidden briefs are never shown to experts (certification)
}

export interface JobType {
  id: string;            // kebab-case, stable forever
  title: string;         // "Landing page copy"
  summary: string;       // one sentence a buyer understands
  area: Area;
  deliverable: string;   // what the buyer receives, concretely
  format: "markdown";
  turnaround_hours: number;
  spec_fields: SpecField[];
  rubric: RubricCriterion[];       // exactly 5 template criteria (source: "template")
  price: PriceBand;
  baseline_prompt: string;         // a competent general prompt for plain AI: the bar agents must beat
  not_for: string[];               // out of scope or banned for this job type
  sample_briefs: SampleBrief[];    // at least 4: 2 public, 2 hidden
  keywords: string[];              // words buyers use, for classification
  demand_sources: { note: string; url: string }[]; // why this is one of the most-requested jobs
}

// ---------- Agent packages ----------

export type ModelTier = "small" | "standard" | "premium";
export interface AgentStep {
  id: string;            // snake_case
  title: string;
  /** Prompt template. Placeholders: {{request}} {{spec}} {{rubric}} {{brand}} {{previous}} {{step:<id>}} {{feedback}} */
  prompt: string;
  tier: ModelTier;
  output: "markdown" | "json";
  max_tokens: number;
}

/** An agent package, close to the open Agent Skills format: one skill with instructions, files and an ordered pipeline. */
export interface AgentPackage {
  schema: "ai-blocks-agent/1";
  job_type_id: string;
  name: string;
  skill: { name: string; description: string; instructions: string }; // instructions = SKILL.md body (markdown)
  files: { path: string; content: string }[];                          // reference files: style guides, checklists
  steps: AgentStep[];                                                    // run in order; the last step's output is the draft
  style_rules: string[];
  banned_patterns: string[];
  checklist: string[];
}

// ---------- Personas (named agents buyers hire) ----------

export interface PersonaOutcome {
  id: string;                   // snake_case, unique within the persona
  title: string;                // outcome in plain words: "An SEO plan for the next 90 days"
  deliverable: string;          // exactly what the buyer receives
  job_type_id: string | null;   // catalogue job type that prices and checks it; null = quoted by hand for now
  job_type_hint?: string;       // free-text hint used to map to a job type later
}

export interface PersonaProfile {
  bio: string;                  // 2 or 3 sentences, first person, plain words
  outcomes: PersonaOutcome[];   // 3 to 6
  capabilities: string[];       // "What I work with": methods, frameworks, library skills it draws on
  good_at: string[];
  not_for: string[];
  samples: { title: string; brief: string }[]; // example requests a buyer could send
  accent: string;               // hex colour for the portrait background and accents
  portrait: string;             // path under /agents/, e.g. "/agents/nova-seo.webp"
  /** Appearance for the portrait prompt: age range, skin tone, hair, outfit, one work prop, expression. Adult, fictional. */
  look: string;
  method: string;               // how this agent works (markdown); becomes the agent package instructions
  source_roles: string[];       // library role or item ids it was built from
}

export interface Persona {
  id: string;                   // kebab-case slug, also the page address: /agents/<id>
  kind: "house" | "expert";
  expert_id?: string | null;
  name: string;                 // a short, friendly first name, unique on the platform
  title: string;                // "SEO strategist"
  tagline: string;              // one line, outcome first
  area: Area;
  profile: PersonaProfile;
  status: "live" | "hidden";
  sort: number;
}

// ---------- Jobs ----------

export const JOB_STATUSES = [
  "draft", "quoted", "confirmed", "running", "checking", "in_review", "delivered",
  "revising", "accepted", "rejected", "disputed", "failed", "cancelled",
] as const;
export type JobStatus = (typeof JOB_STATUSES)[number];

export interface JobRow {
  id: string; org_id: string; created_by: string; source: "web" | "mcp" | "api" | "ops";
  status: JobStatus; job_type_id: string | null; catalogue_version: string | null; persona_id: string | null; title: string;
  price_cents: number | null; currency: string; quote: string; quote_expires_at: string | null;
  turnaround_hours: number | null; due_at: string | null;
  agent_id: string | null; agent_version: number | null;
  revisions_used: number; revisions_allowed: number;
  delivered_at: string | null; auto_accept_at: string | null; accepted_at: string | null;
  payment_status: "not_required" | "pending" | "received" | "refunded";
  created_at: string; updated_at: string;
}

export interface ClarifyingQuestion { field_id: string; question: string; options?: string[] }

export interface Quote {
  job_type_id: string;
  catalogue_version: string;
  price_cents: number;
  currency: "usd";
  breakdown: { label: string; cents: number }[];
  turnaround_hours: number;
  rush: boolean;
  expires_at: string;
  rubric: RubricCriterion[];
  spec: Record<string, unknown>;
}

// ---------- Evaluation ----------

export interface CriterionResult { id: string; pass: boolean; evidence: string; note: string }
export interface RubricResult { criteria: CriterionResult[]; passed: boolean; score: number }
export interface PolicyResult { passed: boolean; flags: { code: string; message: string; excerpt: string }[] }
export interface BaselineResult { winner: "agent" | "baseline" | "tie"; reasons: string; orders: ("agent" | "baseline" | "tie")[] }
