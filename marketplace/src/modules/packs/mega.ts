// Mega kits (packs/mega/<kit>/): one orchestrator playbook, a playbook per kind of business (variant), and a team of
// channel specialists with their channel knowledge. A mega agent (Persona.mega) carries the kit in its pack on top of
// the normal files. This file checks a kit and renders the kit-specific parts; packs/build.ts puts them in the pack.
// Pure: no I/O. The design is in the mega spec (MEGA-SPEC.md) and ARCHITECTURE.md ("Agent packs").
import { MEGA_VARIANTS } from "../../core/types.ts";

export interface MegaChannel { id: string; name: string; book_chapter?: string }
export interface MegaKitJson {
  id: string;
  name: string;
  book?: { title: string; authors: string[]; year: number };
  updated: string;
  review_every_days: number;
  variants: string[];
  channels: MegaChannel[];
}
/** A mega kit as read from packs/mega/<kit>/: kit.json parsed, every other text file keyed by its path in the kit. */
export interface MegaKit { json: MegaKitJson; files: Record<string, string> }

/** The number of channels a traction kit must list (Traction's 19, updated for 2026). */
export const MEGA_CHANNEL_COUNT = 19;

const kebabId = /^[a-z][a-z0-9-]{1,59}$/;

/** Frontmatter name and description of an agent file (simple "key: value" lines). */
export function agentFrontmatter(md: string): { name?: string; description?: string } {
  const m = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/.exec(md);
  if (!m) return {};
  const out: Record<string, string> = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_-]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    let v = kv[2].trim();
    if (/^".*"$/.test(v)) { try { v = JSON.parse(v); } catch { v = v.slice(1, -1); } }
    else if (/^'.*'$/.test(v)) v = v.slice(1, -1).replace(/''/g, "'");
    out[kv[1]] = v;
  }
  return out;
}

/**
 * Checks a mega kit: kit.json shape, exactly 19 channels with unique ids, both files for every channel
 * (channels/<id>.md and agents/<id>.md with frontmatter name "<id>-specialist" and a description), the orchestrator
 * and every listed variant's file. Errors mean the kit is not used (packs build without it, knowledge pending).
 */
export function validateMegaKit(kitId: string, kit: { json: unknown; files: Record<string, string> }): { errors: string[]; warnings: string[] } {
  const errors: string[] = [], warnings: string[] = [];
  const at = (p: string) => `packs/mega/${kitId}/${p}`;
  const j = kit.json as Partial<MegaKitJson> | null;
  if (!j || typeof j !== "object") return { errors: [`${at("kit.json")}: missing or not valid JSON`], warnings };
  if (j.id !== kitId) errors.push(`${at("kit.json")}: id "${j.id ?? ""}" must match its folder "${kitId}"`);
  if (typeof j.name !== "string" || !j.name.trim()) errors.push(`${at("kit.json")}: needs a name`);
  if (typeof j.updated !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(j.updated)) errors.push(`${at("kit.json")}: updated must be a date as YYYY-MM-DD`);
  if (typeof j.review_every_days !== "number" || j.review_every_days < 1) errors.push(`${at("kit.json")}: review_every_days must be a number of days`);
  const variants = Array.isArray(j.variants) ? j.variants : [];
  if (!variants.length) errors.push(`${at("kit.json")}: variants must list the kinds of business`);
  for (const v of variants) {
    if (!(MEGA_VARIANTS as readonly string[]).includes(v)) errors.push(`${at("kit.json")}: variant "${v}" is not one of ${MEGA_VARIANTS.join(", ")}`);
    else if (!kit.files[`variants/${v}.md`]?.trim()) errors.push(`${at(`variants/${v}.md`)}: missing or empty`);
  }
  const channels = Array.isArray(j.channels) ? j.channels : [];
  if (channels.length !== MEGA_CHANNEL_COUNT) errors.push(`${at("kit.json")}: channels lists ${channels.length}; it must list exactly ${MEGA_CHANNEL_COUNT}`);
  const seen = new Set<string>();
  for (const c of channels) {
    if (!c || typeof c.id !== "string" || !kebabId.test(c.id) || typeof c.name !== "string" || !c.name.trim()) {
      errors.push(`${at("kit.json")}: every channel needs a kebab-case id and a name`);
      continue;
    }
    if (seen.has(c.id)) errors.push(`${at("kit.json")}: channel ${c.id} is listed twice`);
    seen.add(c.id);
    if (!kit.files[`channels/${c.id}.md`]?.trim()) errors.push(`${at(`channels/${c.id}.md`)}: missing or empty`);
    const agent = kit.files[`agents/${c.id}.md`];
    if (!agent?.trim()) { errors.push(`${at(`agents/${c.id}.md`)}: missing or empty`); continue; }
    const fm = agentFrontmatter(agent);
    if (fm.name !== `${c.id}-specialist`) errors.push(`${at(`agents/${c.id}.md`)}: frontmatter name must be "${c.id}-specialist"`);
    if (!fm.description?.trim()) errors.push(`${at(`agents/${c.id}.md`)}: frontmatter needs a description`);
    else if (fm.description.length > 300) warnings.push(`${at(`agents/${c.id}.md`)}: description is ${fm.description.length} characters; aim for under 300`);
  }
  if (!kit.files["orchestrator.md"]?.trim()) errors.push(`${at("orchestrator.md")}: missing or empty`);
  return { errors, warnings };
}

/** The "Sources" section of a kit file (a "## Sources" or "## 9. Sources" heading up to the next heading of its level). */
export function sourcesSection(md: string): string | null {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const start = lines.findIndex(l => /^#{2,3}\s+(?:\d+\.\s*)?Sources\s*$/i.test(l.trim()));
  if (start < 0) return null;
  const level = /^(#+)/.exec(lines[start].trim())![1].length;
  let end = lines.findIndex((l, i) => i > start && new RegExp(`^#{1,${level}}\\s`).test(l));
  if (end < 0) end = lines.length;
  const body = lines.slice(start + 1, end).join("\n").trim();
  return body || null;
}

/** Number of entries in a Sources section (numbered or bulleted lines). */
export function countSources(section: string | null): number {
  return section ? section.split("\n").filter(l => /^\s*(\d+[.)]|[-*])\s+\S/.test(l)).length : 0;
}

/**
 * The mega part of sources.md: every local Sources list of the files in the pack (the orchestrator, the agent's
 * variant and the 19 channels), grouped by file, with each file's own numbering as it stands.
 */
export function megaSources(kit: MegaKit, variant: string): { markdown: string; count: number } {
  const groups: { label: string; path: string }[] = [
    { label: "Traction playbook: how I run traction", path: "orchestrator.md" },
    { label: `Traction playbook: ${variant}`, path: `variants/${variant}.md` },
    ...kit.json.channels.map(c => ({ label: `Channel: ${c.name}`, path: `channels/${c.id}.md` })),
  ];
  const out: string[] = [];
  let count = 0;
  for (const g of groups) {
    const section = sourcesSection(kit.files[g.path] ?? "");
    if (!section) continue;
    count += countSources(section);
    out.push(`### ${g.label} (${g.path === "orchestrator.md" || g.path.startsWith("variants/") ? "traction-playbook.md" : g.path})`, "", section, "");
  }
  return { markdown: out.join("\n").trim(), count };
}

/** The {{team_list}} block for AGENTS.md: the specialists in kit.json order, one line each, and how to hand work over. */
export function teamListMarkdown(kit: MegaKit): string {
  const lines = kit.json.channels.map((c, i) => {
    const fm = agentFrontmatter(kit.files[`agents/${c.id}.md`] ?? "");
    return `${i + 1}. **${c.id}-specialist** (${c.name}): ${(fm.description ?? "").replace(/\s+/g, " ").trim()}`;
  });
  return [
    "## My channel team",
    "",
    `I lead ${kit.json.channels.length} channel specialists, one for each traction channel. Each one is a sub-agent in \`agents/<channel>-specialist.md\`, with its channel's knowledge in \`channels/<channel>.md\`.`,
    "",
    ...lines,
    "",
    "How I hand work to them:",
    "",
    "- I choose the channels with traction-playbook.md (Bullseye: brainstorm every channel, rank them, test the inner ring cheaply, then focus).",
    "- I give a specialist the client's goal, the kind of business, the numbers so far and the one test to plan. In Claude Code, the specialists in `.claude/agents/` can be called by name. In other tools, open the specialist's file and follow it for that part of the work.",
    "- A specialist works at the access level my brief gives it for each tool: level 1 reads, level 2 drafts inside the tool, level 3 launches, sends or publishes within the client's caps. It logs every action.",
    "- I merge what comes back into one plan. The client confirms the action list and limits before the first live action, and anything outside them needs a new yes.",
  ].join("\n");
}
