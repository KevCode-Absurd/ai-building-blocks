// Small things a visitor leaves behind and expects back: the numbers typed into a calculator and the specialists opened.
// Stored under one library key ("abb:work"), so signed-in visitors get them on every device through the account
// library and signed-out visitors keep them in this browser. Pure functions only: no browser APIs, so tests run in node.

export const WORK_KEY = "abb:work";
export const WORK_LIMITS = { tools: 40, roles: 12, fields: 60, value: 40, name: 120 } as const;

export type ToolEntry = { preset?: string; raw: Record<string, string>; name?: string; at: number };
export type RoleEntry = { name?: string; at: number };
export type WorkData = { tools: Record<string, ToolEntry>; roles: Record<string, RoleEntry> };

const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const SLUG = /^[a-z0-9][a-z0-9-]{0,79}$/;
const time = (v: unknown) => typeof v === "number" && Number.isFinite(v) && v >= 0;

/** Throws on anything the account library must not store. Used by validateLibrary on the client and the server. */
export function validateWork(value: unknown): WorkData {
  if (!record(value)) throw Error("Invalid saved work");
  const tools = value.tools ?? {}, roles = value.roles ?? {};
  if (!record(tools) || !record(roles)) throw Error("Invalid saved work");
  if (Object.keys(tools).length > WORK_LIMITS.tools || Object.keys(roles).length > WORK_LIMITS.roles) throw Error("Too much saved work");
  for (const [slug, entry] of Object.entries(tools)) {
    if (!SLUG.test(slug) || !record(entry) || !time(entry.at) || !record(entry.raw)) throw Error("Invalid calculator numbers");
    if (entry.preset !== undefined && (typeof entry.preset !== "string" || entry.preset.length > 80)) throw Error("Invalid calculator numbers");
    if (entry.name !== undefined && (typeof entry.name !== "string" || entry.name.length > WORK_LIMITS.name)) throw Error("Invalid calculator numbers");
    const fields = Object.entries(entry.raw);
    if (fields.length > WORK_LIMITS.fields || fields.some(([k, v]) => k.length > 80 || typeof v !== "string" || v.length > WORK_LIMITS.value)) throw Error("Invalid calculator numbers");
  }
  for (const [id, entry] of Object.entries(roles)) {
    if (!SLUG.test(id) || !record(entry) || !time(entry.at)) throw Error("Invalid specialist history");
    if (entry.name !== undefined && (typeof entry.name !== "string" || entry.name.length > WORK_LIMITS.name)) throw Error("Invalid specialist history");
  }
  return { tools: tools as Record<string, ToolEntry>, roles: roles as Record<string, RoleEntry> };
}

export function parseWork(raw: string | null | undefined): WorkData {
  if (!raw) return { tools: {}, roles: {} };
  try { return validateWork(JSON.parse(raw)); } catch { return { tools: {}, roles: {} }; }
}

const newest = <T extends { at: number }>(entries: Record<string, T>, limit: number) =>
  Object.fromEntries(Object.entries(entries).sort((a, b) => b[1].at - a[1].at).slice(0, limit));

/** Two devices never conflict here: for each calculator or specialist, the most recent entry wins. */
export function mergeWork(...copies: (string | undefined)[]): string | undefined {
  const present = copies.filter((raw): raw is string => typeof raw === "string");
  if (!present.length) return undefined;
  const tools: Record<string, ToolEntry> = {}, roles: Record<string, RoleEntry> = {};
  for (const raw of present) {
    const work = parseWork(raw);
    for (const [slug, entry] of Object.entries(work.tools)) if (!tools[slug] || entry.at > tools[slug].at) tools[slug] = entry;
    for (const [id, entry] of Object.entries(work.roles)) if (!roles[id] || entry.at > roles[id].at || entry.at === roles[id].at && entry.name && !roles[id].name) roles[id] = entry;
  }
  return JSON.stringify({ tools: newest(tools, WORK_LIMITS.tools), roles: newest(roles, WORK_LIMITS.roles) });
}

/** Keeps only the fields a person changed from the starting numbers, so a visit alone never counts as work. */
export function changedFields(raw: Record<string, string>, defaults: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw)) if (value !== defaults[key] && typeof value === "string") out[key] = value.slice(0, WORK_LIMITS.value);
  return out;
}

export function withTool(raw: string | null | undefined, slug: string, entry: ToolEntry): string {
  const work = parseWork(raw);
  if (!SLUG.test(slug)) return JSON.stringify(work);
  const fields = Object.fromEntries(Object.entries(entry.raw).slice(0, WORK_LIMITS.fields).map(([k, v]) => [k.slice(0, 80), String(v).slice(0, WORK_LIMITS.value)]));
  const tools = { ...work.tools, [slug]: { ...(entry.preset ? { preset: entry.preset.slice(0, 80) } : {}), raw: fields, ...(entry.name ? { name: entry.name.slice(0, WORK_LIMITS.name) } : {}), at: entry.at } };
  return JSON.stringify({ ...work, tools: newest(tools, WORK_LIMITS.tools) });
}

export function withRole(raw: string | null | undefined, id: string, at: number, name?: string): string {
  const work = parseWork(raw);
  if (!SLUG.test(id)) return JSON.stringify(work);
  const keptName = name?.slice(0, WORK_LIMITS.name) || work.roles[id]?.name;
  const roles = { ...work.roles, [id]: { ...(keptName ? { name: keptName } : {}), at } };
  return JSON.stringify({ ...work, roles: newest(roles, WORK_LIMITS.roles) });
}

/** The specialist id in a /roles/<id> address, or null for the list and anything else. */
export function roleFromPath(path: string): string | null {
  const match = /^\/roles\/([a-z0-9][a-z0-9-]{0,69})\/?$/.exec(path);
  return match ? match[1] : null;
}

export const latest = <T extends { at: number }>(entries: Record<string, T>): [string, T] | null =>
  Object.entries(entries).sort((a, b) => b[1].at - a[1].at)[0] ?? null;

/** "meta-ads-specialist" → "Meta ads specialist", shown until the real name loads. */
export const nameFromSlug = (slug: string) => slug.replace(/-/g, " ").replace(/^./, c => c.toUpperCase());

export type PlanSummary = { title: string; goal: string; steps: number; at: number } | null;
/** Reads the saved planner envelope ("abb:composer") without the planner code. */
export function planSummary(raw: string | null | undefined): PlanSummary {
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw);
    if (saved?.format !== "ai-blocks-composition/1" || !record(saved.plan) || typeof saved.plan.title !== "string") return null;
    return { title: saved.plan.title.slice(0, 120), goal: typeof saved.goal === "string" ? saved.goal.slice(0, 300) : "", steps: Array.isArray(saved.plan.steps) ? saved.plan.steps.length : 0, at: time(saved.createdAt) ? saved.createdAt : 0 };
  } catch { return null; }
}

export type NextStep = { text: string; to: string; label: string };
/** One suggestion, from the most recent thing the person did. Never claims work happened that did not. */
export function suggestNext(plan: PlanSummary, role: [string, RoleEntry] | null, tool: [string, ToolEntry] | null): NextStep | null {
  const candidates: { at: number; step: NextStep }[] = [];
  if (plan) candidates.push({ at: plan.at, step: { text: "Download your plan and give it to your AI. Your AI does the steps and makes the result.", to: "/compose#compose-workflow", label: "Open my plan" } });
  if (role) candidates.push({ at: role[1].at, step: { text: `Add your business details to your ${(role[1].name || nameFromSlug(role[0])).toLowerCase()} and download it for your AI.`, to: `/roles/${role[0]}`, label: "Finish setting it up" } });
  if (tool) candidates.push({ at: tool[1].at, step: { text: "Turn these numbers into a plan: say what you want to change and get the steps.", to: "/compose", label: "Plan a job" } });
  return candidates.sort((a, b) => b.at - a.at)[0]?.step ?? null;
}
