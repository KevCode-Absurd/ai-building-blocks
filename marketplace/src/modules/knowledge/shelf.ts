// A vertical's shelves: the prompts, skills, tools and minds a store owner can use on their own, beside the agents.
// /e-commerce shows them as tabs under one search, like useaiblocks.com.
//
// Built once by scripts/build-packs.mjs (buildShelf) from knowledge/<vertical>/library/{prompts,tools,minds}.json,
// the vertical's own skills (toolbox.json + skills/<name>/SKILL.md) and the library's minds and AI tool guides
// (catalogue-items/). It writes /packs/knowledge/<vertical>/shelf.json (what the lists and the search need) and one
// text file per item. The Worker reads shelf.json once per version (service.ts verticalShelf) and searches it here.
// Pure: no I/O.
import { contentWords, searchTerms } from "../directory/search.ts";

export const SHELF_SCHEMA = "ai-blocks-shelf/1";
export const SHELF_KINDS = ["prompts", "skills", "tools", "minds"] as const;
export type ShelfKind = (typeof SHELF_KINDS)[number];
export const SHELF_LABELS: Record<ShelfKind, { one: string; many: string }> = {
  prompts: { one: "prompt", many: "prompts" }, skills: { one: "skill", many: "skills" },
  tools: { one: "tool", many: "tools" }, minds: { one: "mind", many: "minds" },
};
export const isShelfKind = (k: string): k is ShelfKind => (SHELF_KINDS as readonly string[]).includes(k);

/** Where an item came from on useaiblocks.com (catalogue-items/<dir>/<slug>). */
export interface ShelfFrom { dir: string; slug: string }

interface ItemBase {
  slug: string; title: string; summary: string;
  /** The stage of the store's work (team-stages.ts ids). */
  stage: string;
  /** The team agents who use it, best fit first. */
  agents: string[];
  /** The item's full text, under /packs/. */
  path: string;
}
export interface ShelfPrompt extends ItemBase { module: string; fill: string[]; output: string; from: ShelfFrom[]; credit: string | null; text: string }
export interface ShelfSkill extends ItemBase { module: string; when: string }
export interface ShelfTool extends ItemBase {
  maker: string; url: string; kind: string; jobs: string[]; connect: string; checked: string; sources: string[];
  /** Its guide on useaiblocks.com, when it has one. */
  guide: string | null;
}
export interface ShelfMind extends ItemBase { identity: string; area: string; questions: string[]; library: string }
export type ShelfItem = ShelfPrompt | ShelfSkill | ShelfTool | ShelfMind;

export interface ShelfFile {
  schema: typeof SHELF_SCHEMA;
  vertical: string;
  built: string;
  stages: { id: string; label: string }[];
  prompts: Omit<ShelfPrompt, "text">[];
  skills: ShelfSkill[];
  tools: ShelfTool[];
  minds: ShelfMind[];
}

// ---------- Building (scripts/build-packs.mjs) ----------

export interface PromptRecord { slug: string; title: string; summary: string; stage: string; module: string; agents: string[]; fill: string[]; prompt: string; output: string; from?: ShelfFrom[]; credit?: string | null }
export interface ToolRecord { slug: string; name: string; maker: string; url: string; kind: string; ai_tools_slug?: string | null; for_stores: string; jobs: string[]; agents: string[]; stage: string; connect: string; checked: string; sources: string[] }
export interface MindRecord { slug: string; hire_for: string; store_questions: string[]; agents: string[]; stage: string }
export interface SkillRecord { name: string; title: string; outcome: string; when: string; module: string; agents: string[]; text: string }
export interface MindSource { name: string; identity: string; area: string; skill: string }

export interface ShelfInput {
  vertical: string;
  built: string;
  stages: readonly { id: string; label: string; agents: readonly string[] }[];
  /** Module code to stage, for a skill no agent carries. */
  moduleStage: Record<string, string>;
  /** Ids of the vertical's live agents. */
  agents: Set<string>;
  prompts: PromptRecord[];
  skills: SkillRecord[];
  tools: ToolRecord[];
  minds: MindRecord[];
  /** The library's minds by slug: name, identity, area and SKILL.md. */
  mindSources: Record<string, MindSource>;
  /** The library's AI tool guides by slug, already rendered as markdown. */
  toolGuides: Record<string, string>;
  /** Where the library lives, for "on useaiblocks.com" links. */
  libraryOrigin: string;
}

const firstLine = (s: string) => s.replace(/\s+/g, " ").trim();
const sentence = (s: string) => { const t = firstLine(s); return t ? t[0].toUpperCase() + t.slice(1) : t; };

/** The shelves and their files. Items whose agents are not on the team keep only the agents that are; a broken
 *  item (no title, no text) is left out with a note, never shipped half made. */
export function buildShelf(input: ShelfInput): { file: ShelfFile; files: Record<string, string>; notes: string[] } {
  const v = input.vertical, base = `/packs/knowledge/${v}`;
  const notes: string[] = [];
  const files: Record<string, string> = {};
  const stageIds = new Set(input.stages.map(s => s.id));
  const stageOfAgent = new Map<string, string>();
  for (const s of input.stages) for (const a of s.agents) if (!stageOfAgent.has(a)) stageOfAgent.set(a, s.id);
  const team = (ids: string[]) => [...new Set(ids)].filter(a => input.agents.has(a));
  const stageFor = (want: string, agents: string[], module = "") =>
    stageIds.has(want) ? want : (agents.map(a => stageOfAgent.get(a)).find(Boolean) ?? input.moduleStage[module] ?? input.stages[0]?.id ?? "");
  const unique = <T extends { slug: string }>(list: T[], kind: string) => {
    const seen = new Set<string>();
    return list.filter(x => { if (seen.has(x.slug)) { notes.push(`${kind} ${x.slug}: duplicate slug, kept the first`); return false; } seen.add(x.slug); return true; });
  };

  const prompts: Omit<ShelfPrompt, "text">[] = [];
  for (const p of unique(input.prompts, "prompt")) {
    if (!p.title?.trim() || !p.prompt?.trim()) { notes.push(`prompt ${p.slug}: no title or text, left out`); continue; }
    const agents = team(p.agents ?? []);
    const path = `${base}/prompts/${p.slug}.md`;
    const from = (p.from ?? []).filter(f => f?.dir && f?.slug);
    files[path] = promptMarkdown(p, from, input.libraryOrigin);
    files[`${base}/prompts/${p.slug}.txt`] = `${p.prompt.trim()}\n`;
    prompts.push({ slug: p.slug, title: firstLine(p.title), summary: firstLine(p.summary), stage: stageFor(p.stage, agents, p.module), agents, path,
      module: p.module, fill: (p.fill ?? []).map(firstLine), output: firstLine(p.output ?? ""), from, credit: p.credit ?? null });
  }

  const skills: ShelfSkill[] = [];
  for (const s of input.skills) {
    if (!s.text.trim()) { notes.push(`skill ${s.name}: no SKILL.md, left out`); continue; }
    const agents = team(s.agents);
    skills.push({ slug: s.name, title: firstLine(s.title || s.name), summary: sentence(s.outcome), stage: stageFor("", agents, s.module), agents,
      path: `${base}/skills/${s.name}/SKILL.md`, module: s.module, when: firstLine(s.when) });
  }

  const tools: ShelfTool[] = [];
  for (const t of unique(input.tools, "tool")) {
    const agents = team(t.agents ?? []);
    const guide = t.ai_tools_slug && input.toolGuides[t.ai_tools_slug] ? t.ai_tools_slug : null;
    if (t.ai_tools_slug && !guide) notes.push(`tool ${t.slug}: no AI tool guide ${t.ai_tools_slug} in the library`);
    const path = `${base}/tools/${t.slug}.md`;
    files[path] = toolMarkdown(t, guide ? input.toolGuides[guide] : null);
    tools.push({ slug: t.slug, title: firstLine(t.name), summary: firstLine(t.for_stores), stage: stageFor(t.stage, agents), agents, path,
      maker: t.maker, url: t.url, kind: t.kind, jobs: t.jobs.map(firstLine), connect: firstLine(t.connect), checked: t.checked, sources: t.sources,
      guide: guide ? `${input.libraryOrigin}/ai-tools/${guide}` : null });
  }

  const minds: ShelfMind[] = [];
  for (const m of unique(input.minds, "mind")) {
    const src = input.mindSources[m.slug];
    if (!src) { notes.push(`mind ${m.slug}: not in the library, left out`); continue; }
    const agents = team(m.agents ?? []);
    const path = `${base}/minds/${m.slug}.md`;
    files[path] = src.skill.endsWith("\n") ? src.skill : `${src.skill}\n`;
    minds.push({ slug: m.slug, title: src.name, summary: firstLine(m.hire_for), stage: stageFor(m.stage, agents), agents, path,
      identity: src.identity, area: src.area, questions: m.store_questions.map(firstLine), library: `${input.libraryOrigin}/minds/${m.slug}` });
  }

  // Each shelf in the store's order of work, then by title, so a list reads like the team does.
  const order = new Map(input.stages.map((s, i) => [s.id, i]));
  const byStage = <T extends { stage: string; title: string }>(a: T, b: T) => (order.get(a.stage) ?? 99) - (order.get(b.stage) ?? 99) || a.title.localeCompare(b.title);
  const file: ShelfFile = {
    schema: SHELF_SCHEMA, vertical: v, built: input.built,
    stages: input.stages.map(s => ({ id: s.id, label: s.label })),
    prompts: prompts.sort(byStage), skills: skills.sort(byStage), tools: tools.sort(byStage), minds: minds.sort(byStage),
  };
  files[`${base}/shelf.json`] = `${JSON.stringify(file)}\n`;
  return { file, files, notes };
}

function fromLines(from: ShelfFrom[], credit: string | null | undefined, origin: string): string {
  const lines = from.map(f => `- Built on [${f.slug}](${origin}/${f.dir === "orchestrators" ? "workflows" : f.dir === "agents" ? "agents" : "skills"}/${f.slug}) on useaiblocks.com, rewritten for online stores.`);
  if (credit) lines.push(`- ${credit}`);
  return lines.length ? `\n## Where it comes from\n\n${lines.join("\n")}\n` : "";
}

function promptMarkdown(p: PromptRecord, from: ShelfFrom[], origin: string): string {
  const fill = (p.fill ?? []).map(f => `- ${firstLine(f)}`).join("\n");
  return `# ${firstLine(p.title)}\n\n${firstLine(p.summary)}\n\n## What you fill in\n\n${fill}\n\n## What you get\n\n${firstLine(p.output ?? "")}\n\n## The prompt\n\nCopy everything below into ChatGPT, Claude or Gemini, and fill in the [SQUARE BRACKETS].\n\n\`\`\`\`text\n${p.prompt.trim()}\n\`\`\`\`\n${fromLines(from, p.credit, origin)}`;
}

function toolMarkdown(t: ToolRecord, guide: string | null): string {
  const jobs = t.jobs.map(j => `- ${firstLine(j)}`).join("\n");
  const sources = t.sources.map(s => `- ${s}`).join("\n");
  return `# ${firstLine(t.name)}\n\nBy ${t.maker}. Official site: ${t.url}\n\n${firstLine(t.for_stores)}\n\n## What a store uses it for\n\n${jobs}\n\n## How an agent works with it\n\n${firstLine(t.connect)}\n\nAgents start with read access and ask before anything is sent, spent or published.\n\n## Checked\n\n${t.checked}, from these pages:\n\n${sources}\n${guide ? `\n---\n\n${guide.trim()}\n` : ""}`;
}

// ---------- Searching (the Worker) ----------

const WEIGHTS = { title: 4, summary: 2, extra: 1 };

/** The words of an item, by how much a match there counts. */
function fieldsOf(kind: ShelfKind, item: ShelfItem): { title: string; summary: string; extra: string } {
  switch (kind) {
    case "prompts": { const p = item as ShelfPrompt; return { title: p.title, summary: `${p.summary} ${p.output}`, extra: `${p.fill.join(" ")} ${p.module}` }; }
    case "skills": { const s = item as ShelfSkill; return { title: `${s.title} ${s.slug.replace(/-/g, " ")}`, summary: s.summary, extra: `${s.when} ${s.module}` }; }
    case "tools": { const t = item as ShelfTool; return { title: `${t.title} ${t.maker}`, summary: t.summary, extra: `${t.jobs.join(" ")} ${t.kind.replace(/-/g, " ")} ${t.connect}` }; }
    default: { const m = item as ShelfMind; return { title: `${m.title} ${m.identity}`, summary: m.summary, extra: `${m.questions.join(" ")} ${m.area}` }; }
  }
}

const stems = (text: string) => contentWords(text);

/** One shelf, searchable. Built once per Worker and shelf version. */
export class ShelfSearch {
  private docs: { item: ShelfItem; title: Set<string>; summary: Set<string>; extra: Set<string> }[];
  readonly kind: ShelfKind;
  readonly items: ShelfItem[];
  constructor(kind: ShelfKind, items: ShelfItem[]) {
    this.kind = kind; this.items = items;
    this.docs = items.map(item => { const f = fieldsOf(kind, item); return { item, title: stems(f.title), summary: stems(f.summary), extra: stems(f.extra) }; });
  }
  /** Best match first. An item matches when it has most of the request's words (all of them for one or two). */
  search(q: string, stage = ""): ShelfItem[] {
    const terms = searchTerms(q);
    const pool = this.docs.filter(d => !stage || d.item.stage === stage);
    if (!terms.length) return pool.map(d => d.item);
    const need = terms.length <= 2 ? terms.length : Math.ceil(terms.length * 0.6);
    const hits: { item: ShelfItem; score: number; i: number }[] = [];
    pool.forEach((d, i) => {
      let found = 0, score = 0;
      for (const t of terms) {
        const w = d.title.has(t) ? WEIGHTS.title : d.summary.has(t) ? WEIGHTS.summary : d.extra.has(t) ? WEIGHTS.extra : 0;
        if (w) { found++; score += w; }
      }
      if (found >= need) hits.push({ item: d.item, score: score + found * 2, i });
    });
    return hits.sort((a, b) => b.score - a.score || a.i - b.i).map(h => h.item);
  }
}
