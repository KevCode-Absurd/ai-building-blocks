// Job roles: the canonical list every agent belongs to (Persona.role). Agents in one role share the role's researched
// kit (packs/roles/<role-id>/). This file loads data/roles.json and validates roles and role kits' role.json against it.
// Type imports and zod only, so the packs builder (scripts/build-packs.mjs) can use it in Node.
import { z } from "zod";
import { AREAS, type Area, type Persona } from "../../core/types.ts";
import data from "./data/roles.json" with { type: "json" };

export interface Role {
  id: string;            // kebab-case, stable forever: also the role kit folder packs/roles/<id>/
  name: string;          // the job title, as on a job board: "Meta ads media buyer"
  department: Area;      // one of the app areas
  summary: string;       // 1 or 2 plain sentences: what this person does for a business
  aliases: string[];     // 3 to 10 search terms people use
}

const roleId = z.string().regex(/^[a-z][a-z0-9-]{2,59}$/, "kebab-case role id");

export const roleSchema = z.object({
  id: roleId,
  name: z.string().min(3).max(60),
  department: z.enum(AREAS),
  summary: z.string().min(30).max(400),
  aliases: z.array(z.string().min(2).max(60)).min(3).max(10),
}).strict();

/** role.json in a role kit: the canonical fields plus the kit's own dates and changelog. */
export const roleKitJsonSchema = roleSchema.extend({
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "a date as YYYY-MM-DD"),
  review_every_days: z.union([z.literal(14), z.literal(30), z.literal(60)]),
  changelog: z.array(z.object({ date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "a date as YYYY-MM-DD"), note: z.string().min(3).max(500) }).strict()).max(200),
}).strict();
export type RoleKitJson = z.infer<typeof roleKitJsonSchema>;

export function validateRoles(value: unknown): { ok: true; roles: Role[] } | { ok: false; errors: string[] } {
  const parsed = z.array(roleSchema).min(1).safeParse(value);
  if (!parsed.success) return { ok: false, errors: parsed.error.issues.map(i => `roles.${i.path.join(".")}: ${i.message}`) };
  const roles = parsed.data as Role[], errors: string[] = [];
  const ids = new Set<string>(), names = new Set<string>();
  for (const r of roles) {
    if (ids.has(r.id)) errors.push(`roles: duplicate id ${r.id}`);
    if (names.has(r.name.toLowerCase())) errors.push(`roles: duplicate name ${r.name}`);
    ids.add(r.id);
    names.add(r.name.toLowerCase());
  }
  return errors.length ? { ok: false, errors } : { ok: true, roles };
}

let ROLES: Role[] = (() => {
  const checked = validateRoles(data);
  if (!checked.ok) throw new Error(`directory/data/roles.json is not valid: ${checked.errors.join("; ")}`);
  return checked.roles;
})();
let BY_ID = new Map(ROLES.map(r => [r.id, r]));

export function listRoles(): Role[] { return ROLES; }
export function getRole(id: string | null | undefined): Role | null { return (id && BY_ID.get(id)) || null; }

/** Tests only. */
export function setRolesForTests(list: Role[]): void { ROLES = list; BY_ID = new Map(list.map(r => [r.id, r])); }

/**
 * Checks a role kit's role.json: its shape, and that its id, name and department match the canonical list.
 * folder is the kit's folder name, which must equal the id. Returns plain error lines (empty when fine).
 */
export function checkRoleKitJson(value: unknown, folder: string, roles: Role[] = ROLES): string[] {
  const where = `packs/roles/${folder}/role.json`;
  const parsed = roleKitJsonSchema.safeParse(value);
  if (!parsed.success) return parsed.error.issues.map(i => `${where}: ${i.path.join(".") || "file"}: ${i.message}`);
  const kit = parsed.data, errors: string[] = [];
  if (kit.id !== folder) errors.push(`${where}: id "${kit.id}" must match its folder name "${folder}"`);
  const role = roles.find(r => r.id === kit.id);
  if (!role) errors.push(`${where}: id "${kit.id}" is not in directory/data/roles.json`);
  else {
    if (kit.name !== role.name) errors.push(`${where}: name "${kit.name}" must match the role list: "${role.name}"`);
    if (kit.department !== role.department) errors.push(`${where}: department "${kit.department}" must match the role list: "${role.department}"`);
  }
  return errors;
}

/** Personas whose role is set but not in the role list (the persona schema only checks the id's shape). */
export function personasWithUnknownRole(personas: Persona[], roles: Role[] = ROLES): { id: string; role: string }[] {
  const ids = new Set(roles.map(r => r.id));
  return personas.filter(p => p.role && !ids.has(p.role)).map(p => ({ id: p.id, role: p.role! }));
}
