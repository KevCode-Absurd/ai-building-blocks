import type {Block,Catalogue} from "./data";
/** Workflow-scoped text, never installed, rendered as HTML or executed on upload. */
export type CustomSkill = { slug: string; name: string; summary: string; markdown: string; role: Block["role"]; inputs: { type: string; required: boolean }[]; outputs: { type: string; required: boolean }[]; resources?: string[]; workerFiles?: Record<string,string> };
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
    if (s.resources !== undefined && (!Array.isArray(s.resources) || s.resources.length > 24 || s.resources.some((id: unknown) => typeof id !== "string" || !/^[a-z0-9][a-z0-9-]{0,119}$/.test(id) || id.startsWith("custom-")))) throw Error("Choose at most 24 existing library methods for a role.");
    if (s.workerFiles !== undefined && (!s.workerFiles || typeof s.workerFiles !== "object" || Array.isArray(s.workerFiles) || Object.keys(s.workerFiles).length > 11 || JSON.stringify(s.workerFiles).length > 250000 || Object.entries(s.workerFiles).some(([name,text]) => !/^(?:SOUL|KNOWLEDGE|PLAYBOOK|TOOL_ROUTER|CONNECTIONS|PERMISSIONS|TRAINING|CONTEXT|JOB|CHECKS)\.md$|^worker\.json$/.test(name) || typeof text !== "string" || text.includes("\u0000")))) throw Error("Invalid specialist worker files. Use the named Markdown and worker.json files within 250 KB.");
    return { slug: s.slug, name: s.name.trim(), summary: s.summary, markdown: s.markdown, role: s.role, inputs: ports(s.inputs), outputs: ports(s.outputs), ...(s.resources !== undefined ? {resources: [...new Set<string>(s.resources)]} : {}), ...(s.workerFiles !== undefined ? {workerFiles:{...s.workerFiles}} : {}) };
  });
}
export function withCustomSkills(c: Catalogue, raw?: CustomSkill[]): Catalogue {
  const skills = validateCustomSkills(raw);
  if (!skills.length) return c;
  const blocks = skills.map(s => {
    if (Object.hasOwn(c.bySlug, s.slug) && c.bySlug[s.slug].version !== "local") throw Error("A custom skill cannot replace a repository identifier.");
    if (s.resources?.some(id => !Object.hasOwn(c.bySlug, id) || c.bySlug[id].version === "local")) throw Error("A selected role method is unavailable. Refresh the role before exporting it.");
    return { ...s, type: "skill", category: "general", headline: s.name, task: "set-up-ai", boards: [], uses: s.resources ?? [], steps: [], job: "ops", level: "intermediate", thinking: "medium", origin: "own", tested: null, version: "local", twin: null, usedIn: 0, warnings: ["Custom skill: supplied by you; review its instructions before execution."] } as Block;
  });
  return { ...c, blocks: [...c.blocks.filter(b => !skills.some(s => s.slug === b.slug)), ...blocks], bySlug: { ...c.bySlug, ...Object.fromEntries(blocks.map(b => [b.slug, b])) } };
}
