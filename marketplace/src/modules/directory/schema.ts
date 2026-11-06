// Validation for personas (named house agents). The personas data test runs every file through validatePersona.
import { z } from "zod";
import { AREAS, MEGA_VARIANTS, type Persona } from "../../core/types.ts";

const snake = z.string().regex(/^[a-z][a-z0-9_]{1,59}$/, "snake_case id");

export const personaSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]{2,59}$/, "kebab-case id"),
  kind: z.literal("house"),
  name: z.string().regex(/^\p{Lu}[\p{L}'-]{1,13}$/u, "one short first name, accents allowed"),
  title: z.string().min(3).max(48),
  tagline: z.string().min(20).max(90),
  area: z.enum(AREAS),
  status: z.enum(["live", "hidden"]),
  sort: z.number().int().min(0).max(10000),
  profile: z.object({
    bio: z.string().min(60).max(420),
    outcomes: z.array(z.object({
      id: snake,
      title: z.string().min(10).max(80),
      deliverable: z.string().min(20).max(300),
      job_type_id: z.string().regex(/^[a-z][a-z0-9-]{2,59}$/).nullable(),
      job_type_hint: z.string().max(120).optional(),
    }).strict()).min(3).max(6),
    capabilities: z.array(z.string().min(3).max(90)).min(3).max(10),
    good_at: z.array(z.string().min(3).max(120)).min(2).max(6),
    not_for: z.array(z.string().min(3).max(120)).min(2).max(6),
    samples: z.array(z.object({ title: z.string().min(3).max(60), brief: z.string().min(30).max(600) }).strict()).min(2).max(4),
    accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    portrait: z.string().regex(/^\/agents\/[a-z0-9-]+\.webp$/),
    look: z.string().min(40).max(400),
    method: z.string().min(300).max(4000),
    source_roles: z.array(z.string().min(2).max(120)).min(1).max(8),
    soul: z.object({
      essence: z.string().min(20).max(200),
      temperament: z.string().min(40).max(400),
      voice: z.string().min(40).max(400),
      values: z.array(z.string().min(3).max(140)).min(2).max(4),
      quirks: z.array(z.string().min(3).max(180)).min(2).max(4),
      pushback: z.string().min(40).max(320),
      off_hours: z.string().min(15).max(200),
    }).strict().optional(),
    style: z.object({
      tone: z.string().min(40).max(300),
      sentences: z.string().min(30).max(240),
      formatting: z.string().min(30).max(300),
      signature_moves: z.array(z.string().min(10).max(180)).min(2).max(4),
      words_i_use: z.array(z.string().min(2).max(40)).min(3).max(8),
      words_i_avoid: z.array(z.string().min(2).max(40)).min(3).max(8),
      sample_opening: z.string().min(40).max(400),
      sample_feedback: z.string().min(40).max(400),
    }).strict().optional(),
  }).strict(),
  role: z.string().regex(/^[a-z][a-z0-9-]{2,59}$/, "kebab-case role id").optional(),
  mega: z.object({ kit: z.literal("traction"), variant: z.enum(MEGA_VARIANTS) }).strict().optional(),
}).strict();

export function validatePersona(value: unknown): { ok: true; persona: Persona } | { ok: false; errors: string[] } {
  const parsed = personaSchema.safeParse(value);
  if (!parsed.success) return { ok: false, errors: parsed.error.issues.map(i => `${i.path.join(".")}: ${i.message}`) };
  const p = parsed.data as Persona, errors: string[] = [];
  if (p.profile.portrait !== `/agents/${p.id}.webp`) errors.push("profile.portrait must be /agents/<id>.webp");
  if (new Set(p.profile.outcomes.map(o => o.id)).size !== p.profile.outcomes.length) errors.push("profile.outcomes: duplicate ids");
  if (p.profile.outcomes.some(o => !o.job_type_id && !o.job_type_hint)) errors.push("profile.outcomes: each needs job_type_id or job_type_hint");
  return errors.length ? { ok: false, errors } : { ok: true, persona: p };
}
