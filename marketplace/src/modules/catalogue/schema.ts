// Validation for job types. The catalogue test runs every job type through validateJobType.
import { z } from "zod";
import { AREAS, type JobType } from "../../core/types.ts";

const id = z.string().regex(/^[a-z][a-z0-9_]{1,59}$/, "snake_case id");
const slug = z.string().regex(/^[a-z][a-z0-9-]{2,59}$/, "kebab-case id");

const specField = z.object({
  id, label: z.string().min(2).max(80),
  type: z.enum(["text", "longtext", "number", "choice", "multichoice", "list", "url"]),
  required: z.boolean(),
  help: z.string().max(200).optional(),
  options: z.array(z.string().min(1).max(80)).min(2).max(12).optional(),
  max: z.number().int().positive().optional(),
}).strict().refine(f => !["choice", "multichoice"].includes(f.type) || !!f.options, "choice fields need options");

const criterion = z.object({
  id, text: z.string().min(10).max(300), weight: z.number().int().min(1).max(5),
  pass_rule: z.string().min(15).max(400), critical: z.boolean(), source: z.enum(["template", "buyer"]),
}).strict();

export const jobTypeSchema = z.object({
  id: slug,
  title: z.string().min(3).max(60),
  summary: z.string().min(20).max(200),
  area: z.enum(AREAS),
  deliverable: z.string().min(20).max(400),
  format: z.literal("markdown"),
  turnaround_hours: z.number().int().min(1).max(240),
  spec_fields: z.array(specField).min(2).max(14),
  rubric: z.array(criterion).length(5),
  price: z.object({
    base_usd: z.number().positive(), min_usd: z.number().positive(), max_usd: z.number().positive(),
    size: z.object({ field: id, unit: z.string().min(1).max(30), included: z.number().nonnegative(), per_unit_usd: z.number().positive() }).strict().optional(),
    rush_multiplier: z.number().min(1).max(3),
  }).strict(),
  baseline_prompt: z.string().min(80).max(4000),
  not_for: z.array(z.string().min(5).max(200)).min(1).max(10),
  sample_briefs: z.array(z.object({ id, text: z.string().min(40).max(3000), visibility: z.enum(["public", "hidden"]) }).strict()).min(4).max(12),
  keywords: z.array(z.string().min(2).max(40)).min(4).max(30),
  demand_sources: z.array(z.object({ note: z.string().min(10).max(300), url: z.string().url().startsWith("https://") }).strict()).min(1).max(6),
}).strict();

export function validateJobType(value: unknown): { ok: true; jobType: JobType } | { ok: false; errors: string[] } {
  const parsed = jobTypeSchema.safeParse(value);
  if (!parsed.success) return { ok: false, errors: parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`) };
  const jt = parsed.data as JobType, errors: string[] = [];
  const fieldIds = new Set(jt.spec_fields.map(f => f.id));
  if (fieldIds.size !== jt.spec_fields.length) errors.push("spec_fields: duplicate ids");
  if (!jt.spec_fields.some(f => f.required)) errors.push("spec_fields: at least one field must be required");
  if (new Set(jt.rubric.map(c => c.id)).size !== 5) errors.push("rubric: duplicate ids");
  if (jt.rubric.some(c => c.source !== "template")) errors.push("rubric: catalogue criteria must have source 'template'");
  if (!jt.rubric.some(c => c.critical)) errors.push("rubric: mark at least one criterion critical");
  if (!(jt.price.min_usd <= jt.price.base_usd && jt.price.base_usd <= jt.price.max_usd)) errors.push("price: need min <= base <= max");
  if (jt.price.size && !fieldIds.has(jt.price.size.field)) errors.push("price.size.field must be a spec field id");
  if (jt.price.size && jt.spec_fields.find(f => f.id === jt.price.size!.field)?.type !== "number") errors.push("price.size.field must be a number field");
  const vis = jt.sample_briefs.map(b => b.visibility);
  if (vis.filter(v => v === "public").length < 2 || vis.filter(v => v === "hidden").length < 2) errors.push("sample_briefs: need at least 2 public and 2 hidden");
  if (new Set(jt.sample_briefs.map(b => b.id)).size !== jt.sample_briefs.length) errors.push("sample_briefs: duplicate ids");
  return errors.length ? { ok: false, errors } : { ok: true, jobType: jt };
}
