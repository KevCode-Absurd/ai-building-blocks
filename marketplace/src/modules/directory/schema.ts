// Validation for personas (named house agents). The personas data test runs every file through validatePersona.
import { z } from "zod";
import { AREAS, type Persona } from "../../core/types.ts";

const snake = z.string().regex(/^[a-z][a-z0-9_]{1,59}$/, "snake_case id");

export const personaSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]{2,59}$/, "kebab-case id"),
  kind: z.literal("house"),
  name: z.string().regex(/^[A-Z][a-zA-Z'-]{1,13}$/, "one short first name"),
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
  }).strict(),
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
