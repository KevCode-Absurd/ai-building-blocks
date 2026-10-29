import type {Block,Catalogue} from "./data";
/** Workflow-scoped text, never installed, rendered as HTML or executed on upload. */
export type CustomSkill = { slug: string; name: string; summary: string; markdown: string; role: Block["role"]; inputs: { type: string; required: boolean }[]; outputs: { type: string; required: boolean }[] };
export const CUSTOM_LIMIT = 128000;
export function validateCustomSkills(raw: unknown): CustomSkill[] {
  if (raw === undefined) return [];
  if (!Array.isArray(raw) || raw.length > 8 || JSON.stringify(raw).length > 512000) throw Error("Keep custom skills under 512 KB and eight skills per workflow.");
  const slugs = new Set<string>();
  return raw.map(s => {
    if (!s || typeof s.slug !== "string" || !/^custom-[a-z0-9-]{1,70}$/.test(s.slug) || slugs.has(s.slug) || typeof s.name !== "string" || !s.name.trim() || s.name.length > 100 || typeof s.summary !== "string" || s.summary.length > 500 || typeof s.markdown !== "string" || !s.markdown.trim() || s.markdown.length > CUSTOM_LIMIT || /\u0000/.test(s.markdown) || !["source", "compress", "make", "render", "check", "orchestrate"].includes(s.role)) throw Error("Invalid custom skill. Upload a text SKILL.md and describe its inputs and outputs.");
    const ports = (v: unknown): CustomSkill["inputs"] => {
      if (!Array.isArray(v) || v.length > 16) throw Error("Use at most 16 input or output types.");
      return v.map(p => { if (!p || typeof p.type !== "string" || !/^[a-z][a-z0-9_]{0,79}$/.test(p.type) || typeof p.required !== "boolean") throw Error("Port types use lowercase letters, numbers and underscores."); return { type: p.type, required: p.required }; });
    };
    slugs.add(s.slug);
    return { slug: s.slug, name: s.name.trim(), summary: s.summary, markdown: s.markdown, role: s.role, inputs: ports(s.inputs), outputs: ports(s.outputs) };
  });
}
export function withCustomSkills(c: Catalogue, raw?: CustomSkill[]): Catalogue {
  const skills = validateCustomSkills(raw);
  if (!skills.length) return c;
  const blocks = skills.map(s => {
    if (Object.hasOwn(c.bySlug, s.slug) && c.bySlug[s.slug].version !== "local") throw Error("A custom skill cannot replace a repository identifier.");
    return { ...s, type: "skill", category: "general", headline: s.name, task: "set-up-ai", boards: [], uses: [], steps: [], job: "ops", level: "intermediate", thinking: "medium", origin: "own", tested: null, version: "local", twin: null, usedIn: 0, warnings: ["Custom skill: supplied by you; review its instructions before execution."] } as Block;
  });
  return { ...c, blocks: [...c.blocks.filter(b => !skills.some(s => s.slug === b.slug)), ...blocks], bySlug: { ...c.bySlug, ...Object.fromEntries(blocks.map(b => [b.slug, b])) } };
}
