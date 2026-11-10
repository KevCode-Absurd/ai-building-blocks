// What each job role's agents can do and what they bring, from data/role-toolbox.json. scripts/role-toolbox.mjs
// writes that file from the role kits (packs/roles/<role-id>/: skills, prompts, workflows and toolbox.json) and the
// library (catalogue-items/), and `npm run build` runs it first. The profile shows it as "What I can do" and "What
// I bring", the crawler copy lists the same, and the directory search reads the task names.
// Worker and tests only: the browser app gets this through /api/agents/:id, never by importing the data.
import data from "./data/role-toolbox.json" with { type: "json" };
import { taskNature, type WorkNature } from "./work.ts";

/** One role's entry in data/role-toolbox.json. */
export interface RoleToolbox {
  /** The kit's own files, "<folder>/<name>" -> plain name: "skills/print-layout-spec" -> "Print layout spec". */
  kit: Record<string, string>;
  /** For each kit skill, a line of its description and the tasks that use it: what an outcome is matched against. */
  skills: Record<string, string>;
  /** The role's tasks in plain words, most common first. Empty until the role has a toolbox.json. */
  tasks: { id: string; task: string; kind: string }[];
  /** Every item the tasks name, in first-use order: "kit:<folder>/<name>" or a library page path ("skills/<slug>"). */
  items: string[];
  /** Other job roles this role brings in on a complex job. */
  helpers: string[];
  reviewed: string | null;
}

export interface ToolboxFile {
  schema: string;
  /** Library page path ("skills/<slug>", "minds/<slug>", "ai-tools/<slug>"...) -> the item's plain name. */
  library: Record<string, string>;
  /** Library items with no page on useaiblocks.com: named, never linked. */
  unpaged: string[];
  roles: Record<string, RoleToolbox>;
}

export const LIBRARY_ORIGIN = "https://useaiblocks.com";

let FILE = data as unknown as ToolboxFile;
let UNPAGED = new Set(FILE.unpaged);

/** Tests only. */
export function setRoleToolboxForTests(file: ToolboxFile): void { FILE = file; UNPAGED = new Set(file.unpaged); }
export function roleToolboxFile(): ToolboxFile { return FILE; }

/** The role's kit and toolbox, or null for an unknown role (or an agent with no role). */
export function roleToolbox(roleId: string | null | undefined): RoleToolbox | null {
  return (roleId && Object.prototype.hasOwnProperty.call(FILE.roles, roleId) && FILE.roles[roleId]) || null;
}

export interface AgentTask { id: string; task: string; nature: WorkNature }

export type BringType = "skill" | "prompt" | "workflow" | "tool" | "lens" | "helper";

export interface BringItem {
  /** The item's plain name: "Print layout spec", "Layout default breaker", "David Carson", "Brand designer". */
  name: string;
  /** Its page: on the library for a library item, on this site for a helper role. null when it has none. */
  href: string | null;
  /** For one of the agent's own files: its path in the download, which the profile opens in the file viewer. */
  file: string | null;
}

/** One kind of thing the agent brings: its plural label ("Thinking lenses"), the word for one ("thinking lens") and the items. */
export interface BringGroup { type: BringType; label: string; one: string; items: BringItem[] }

/** The order and the plain labels of "What I bring". */
export const BRING_LABELS: { type: BringType; label: string; one: string }[] = [
  { type: "skill", label: "Skills", one: "skill" },
  { type: "prompt", label: "Prompts", one: "prompt" },
  { type: "workflow", label: "Workflows", one: "workflow" },
  { type: "tool", label: "Tools", one: "tool" },
  { type: "lens", label: "Thinking lenses", one: "thinking lens" },
  { type: "helper", label: "Helper agents", one: "helper agent" },
];

const LIBRARY_FOLDERS: Record<string, BringType> = { skills: "skill", prompts: "prompt", workflows: "workflow", "ai-tools": "tool", minds: "lens", agents: "helper" };
const KIT_FOLDERS: Record<string, BringType> = { skills: "skill", prompts: "prompt", workflows: "workflow" };

/** Where a kit file sits in the agent's download. */
const kitFilePath = (key: string) => (key.startsWith("skills/") ? `${key}/SKILL.md` : `${key}.md`);

/** The role's tasks with what each one is (made, planned or reviewed), in the toolbox's order. */
export function roleTasks(box: RoleToolbox | null): AgentTask[] {
  return (box?.tasks ?? []).map(t => ({ id: t.id, task: t.task, nature: taskNature(t.task, t.kind) }));
}

/**
 * "What I bring": the agent's own skills, prompts and workflows first, then every library item its toolbox names,
 * then the job roles it brings in. Counts are the lengths of these lists, so they are always what is listed.
 * `roleName` gives a helper role's name and page (null for a role the site does not list).
 */
export function bringGroups(box: RoleToolbox | null, roleName: (id: string) => string | null): BringGroup[] {
  if (!box) return [];
  const lists = new Map<BringType, BringItem[]>(BRING_LABELS.map(l => [l.type, []]));
  const seen = new Set<string>();
  const add = (type: BringType | undefined, id: string, item: BringItem) => {
    if (!type || seen.has(id)) return;
    seen.add(id);
    lists.get(type)!.push(item);
  };
  const addKit = (key: string) => add(KIT_FOLDERS[key.split("/")[0]], `kit:${key}`, { name: box.kit[key], href: null, file: kitFilePath(key) });
  // The agent's own files lead each list, in the order its tasks use them; a file no task names yet still counts.
  for (const ref of box.items) if (ref.startsWith("kit:") && box.kit[ref.slice(4)]) addKit(ref.slice(4));
  for (const key of Object.keys(box.kit)) addKit(key);
  for (const ref of box.items) {
    if (ref.startsWith("kit:")) continue;
    const name = FILE.library[ref];
    if (name) add(LIBRARY_FOLDERS[ref.split("/")[0]], ref, { name, href: UNPAGED.has(ref) ? null : `${LIBRARY_ORIGIN}/${ref}`, file: null });
  }
  // Helper roles lead the helper list: they are agents on this site.
  const helpers: BringItem[] = [];
  for (const id of box.helpers) {
    const name = roleName(id);
    if (name && !seen.has(`role:${id}`)) { seen.add(`role:${id}`); helpers.push({ name, href: `/agents?role=${encodeURIComponent(id)}`, file: null }); }
  }
  lists.set("helper", [...helpers, ...lists.get("helper")!]);
  return BRING_LABELS.map(l => ({ type: l.type, label: l.label, one: l.one, items: lists.get(l.type)! })).filter(g => g.items.length > 0);
}

/** "42 skills, 6 prompts, 5 workflows, 2 tools, 4 thinking lenses and 6 helper agents". */
export function bringSummary(groups: BringGroup[]): string {
  const parts = groups.map(g => `${g.items.length} ${g.items.length === 1 ? g.one : g.label.toLowerCase()}`);
  return parts.length <= 1 ? parts.join("") : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}
