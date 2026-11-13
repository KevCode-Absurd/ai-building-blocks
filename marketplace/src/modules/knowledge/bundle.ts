// What a vertical's knowledge becomes at build time (scripts/build-packs.mjs): one markdown file per module, one of
// every baseline card, a sources list and the JSON index the Worker searches. Only public cards from public sources
// are ever published; licensed and study-only material stays in the repo. Pure: no file access.
import { cardMarkdown, moduleMarkdown, type Card, type Source, type Vertical } from "./cards.ts";
import type { Persona } from "../../core/types.ts";

/**
 * One toolbox entry for a module (knowledge/<vertical>/toolbox.json): a library item (library:<slug>) or a vendored
 * open-source skill (local:<set>/<skill>), when to use it, how to run it for this kind of business, and the cards to
 * read first.
 */
export interface VerticalToolItem { ref: string; type: string; use: string; when: string; tune: string; cards: string[] }
export interface VerticalToolbox { schema: "ai-blocks-vertical-toolbox/1"; reviewed: string; modules: Record<string, VerticalToolItem[]> }
/** What the build knows about each named item: its plain name and, for a library item, the type it ships as. */
export interface ToolNames { library: Record<string, { name: string; type: string }>; vendor: Record<string, { name: string; path: string; set: string }> }

export interface VerticalBundle {
  vertical: Vertical;
  cards: Card[];          // public only
  sources: Source[];      // public only
  toolbox: VerticalToolbox | null;
  /** Vendored skill files (knowledge/<vertical>/vendor/<set>/...): path -> text. */
  vendor: Record<string, string>;
  /** Served once each at /packs/knowledge/<vertical>/<name>, and carried by the vertical's agents at the same path. */
  files: Record<string, { content: string; purpose: string }>;
  index: { schema: "ai-blocks-vertical-index/1"; vertical: Vertical; counts: Record<string, number>; sources: Source[]; cards: Card[] };
}

const USE_LABEL: Record<string, string> = { brief: "brief", explore: "explore", build: "build", check: "check", think: "think" };

/** The path inside a pack of a toolbox entry's item, or null when the build does not have it. */
export function toolItemPath(ref: string, names: ToolNames): string | null {
  if (ref.startsWith("library:")) { const n = names.library[ref.slice(8)]; return n ? `toolbox/${n.type}/${ref.slice(8)}.md` : null; }
  if (ref.startsWith("local:")) return names.vendor[ref.slice(6)]?.path ?? null;
  return null;
}

/** A module's toolbox as markdown: each item with when, how to run it for a store, the cards to read and its file. */
export function moduleToolboxMarkdown(vertical: Vertical, code: string, items: VerticalToolItem[], names: ToolNames, publicCards: Set<string>): string {
  const mod = vertical.modules.find(m => m.code === code)!;
  const kept = items.filter(i => toolItemPath(i.ref, names));
  return [
    `# ${vertical.name} toolbox: ${mod.name} (${code})`, "",
    `What to use for this part of the work, best first, tuned for ${vertical.name.toLowerCase()} brands. Every item is in this pack: open only the one you pick. "For a store" says how to run it here. "Read first" names the knowledge cards to check before you use it (search a card you do not carry by its id with ask_vertical_knowledge).`, "",
    ...kept.flatMap(i => {
      const name = i.ref.startsWith("library:") ? names.library[i.ref.slice(8)].name : names.vendor[i.ref.slice(6)].name;
      const cards = i.cards.filter(c => publicCards.has(c));
      return [
        `## ${name}`, "",
        `${i.when.trim()} (${USE_LABEL[i.use] ?? i.use})`, "",
        `**For a store:** ${i.tune.trim()}`, "",
        ...(cards.length ? [`**Read first:** ${cards.join(", ")}`, ""] : []),
        `**File:** \`${toolItemPath(i.ref, names)}\``, "",
      ];
    }),
  ].join("\n");
}

export function verticalBundle(vertical: Vertical, allCards: Card[], allSources: Source[], extra: { toolbox?: VerticalToolbox | null; vendor?: Record<string, string>; names?: ToolNames } = {}): VerticalBundle {
  const sources = allSources.filter(s => s.public);
  const open = new Set(sources.map(s => s.id));
  const cards = allCards.filter(c => c.public && open.has(c.source)).sort((a, b) => a.id < b.id ? -1 : 1);
  const byId = new Map(sources.map(s => [s.id, s]));
  const dir = `knowledge/${vertical.id}`;
  const files: VerticalBundle["files"] = {};
  const counts: Record<string, number> = {};
  for (const m of vertical.modules) {
    const own = cards.filter(c => c.modules[0] === m.code);
    counts[m.code] = own.length;
    if (!own.length) continue;
    files[`${dir}/${m.code}.md`] = { content: moduleMarkdown(vertical, m.code, own, byId), purpose: `${vertical.name} knowledge cards: ${m.name} (${own.length}).` };
  }
  const baseline = cards.filter(c => c.scope === "baseline");
  if (baseline.length) {
    files[`${dir}/baseline.md`] = {
      purpose: `The ${baseline.length} ${vertical.name.toLowerCase()} baseline cards: what holds for almost every brand, from every module.`,
      content: [`# ${vertical.name} knowledge: the baseline`, "", `The ${baseline.length} cards that hold for almost every brand, from every module. Check these before any growth play: a broken baseline is repaired, never tested.`, "", ...baseline.flatMap(c => [cardMarkdown(c, byId.get(c.source), 2), ""])].join("\n"),
    };
  }
  files[`${dir}/sources.md`] = {
    purpose: `Every public source behind the ${vertical.name.toLowerCase()} cards, with its tier and date.`,
    content: [`# ${vertical.name} knowledge: sources`, "", `Each card names its source. Tier 1 is platform documentation, 2 large-sample research, 3 a named practitioner with receipts, 4 opinion or undated. Cards are written in our own words; open the source for the full context.`, "",
      ...sources.map(s => `- **${s.id}** ${s.title}${s.author !== "unknown" ? `, ${s.author}` : ""}${s.date !== "unknown" ? `, ${s.date}` : ""}. Tier ${s.tier}. ${/^https?:/.test(s.url) ? s.url : "No public link."} ${s.cards} card${s.cards === 1 ? "" : "s"}.`)].join("\n") + "\n",
  };
  // The toolbox: one file per module, and the vendored skills it names, each served once.
  const names = extra.names ?? { library: {}, vendor: {} };
  const toolbox = extra.toolbox ?? null;
  const publicIds = new Set(cards.map(c => c.id));
  if (toolbox) for (const m of vertical.modules) {
    const items = toolbox.modules[m.code] ?? [];
    if (!items.some(i => toolItemPath(i.ref, names))) continue;
    files[`${dir}/toolbox/${m.code}.md`] = { content: moduleToolboxMarkdown(vertical, m.code, items, names, publicIds), purpose: `What to use for ${m.name.toLowerCase()} work, tuned for ${vertical.name.toLowerCase()} brands.` };
  }
  const vendor = extra.vendor ?? {};
  for (const [p, text] of Object.entries(vendor)) files[p] = { content: text, purpose: p.endsWith("LICENSE.md") ? "Licence and source of the open-source skills beside it." : `Open-source skill file (${p.split("/").slice(3).join("/")}), carried as written.` };
  return { vertical, cards, sources, toolbox, vendor, files, index: { schema: "ai-blocks-vertical-index/1", vertical, counts, sources, cards } };
}

/**
 * The vertical files one agent carries: its own modules (a lead with more than 6: the constraint modules), the
 * baseline cards of every other module, and the sources. The module files and sources are shared copies; the
 * baseline file is the agent's own, so no card appears twice in one pack.
 */
export function personaVerticalFiles(persona: Persona, bundle: VerticalBundle | undefined): { path: string; content: string; purpose: string; shared: boolean }[] {
  if (!bundle || persona.vertical !== bundle.vertical.id) return [];
  const dir = `knowledge/${bundle.vertical.id}`;
  const lead = (persona.modules?.length ?? 0) > 6;
  const constraints = Object.entries(bundle.vertical.constraints ?? {}).filter(([k]) => k !== "rule").map(([, v]) => v);
  const codes = [...new Set(lead ? constraints : (persona.modules ?? []).slice(0, 4))].filter(c => bundle.files[`${dir}/${c}.md`]);
  const carried = new Set(codes);
  const byId = new Map(bundle.sources.map(s => [s.id, s]));
  const others = bundle.cards.filter(c => c.scope === "baseline" && !carried.has(c.modules[0]));
  const out: { path: string; content: string; purpose: string; shared: boolean }[] = [];
  if (others.length) out.push({
    path: `${dir}/baseline.md`, shared: false,
    purpose: `The ${others.length} ${bundle.vertical.name.toLowerCase()} baseline cards from the modules I do not carry: what holds for almost every brand.`,
    content: [`# ${bundle.vertical.name} knowledge: the baseline`, "", `The ${others.length} baseline cards from the modules whose full files I do not carry: what holds for almost every brand. Check these before any growth play: a broken baseline is repaired, never tested.`, "", ...others.flatMap(c => [cardMarkdown(c, byId.get(c.source), 2), ""])].join("\n"),
  });
  for (const c of codes) out.push({ path: `${dir}/${c}.md`, shared: true, ...bundle.files[`${dir}/${c}.md`] });
  for (const c of codes) if (bundle.files[`${dir}/toolbox/${c}.md`]) out.push({ path: `${dir}/toolbox/${c}.md`, shared: true, ...bundle.files[`${dir}/toolbox/${c}.md`] });
  // Vendored skill sets used by these modules: the skills named, plus each set's shared references, agents and licence.
  const sets = new Set<string>(), skills = new Set<string>();
  for (const c of codes) for (const i of bundle.toolbox?.modules[c] ?? []) if (i.ref.startsWith("local:")) { const [set, skill] = i.ref.slice(6).split("/"); sets.add(set); skills.add(`${set}/${skill}`); }
  for (const p of Object.keys(bundle.vendor).sort()) {
    const m = new RegExp(`^${dir}/vendor/([^/]+)/(skills/([^/]+)/SKILL\\.md|references/.+|agents/.+|LICENSE\\.md)$`).exec(p);
    if (!m || !sets.has(m[1])) continue;
    if (m[3] && !skills.has(`${m[1]}/${m[3]}`)) continue;
    out.push({ path: p, shared: true, ...bundle.files[p] });
  }
  if (bundle.files[`${dir}/sources.md`]) out.push({ path: `${dir}/sources.md`, shared: true, ...bundle.files[`${dir}/sources.md`] });
  return out;
}

/** The library items an agent's vertical toolbox names (for its carried modules), to ship under toolbox/. */
export function personaVerticalLibrary(persona: Persona, bundle: VerticalBundle | undefined): { slug: string; type: string }[] {
  if (!bundle?.toolbox || persona.vertical !== bundle.vertical.id) return [];
  const lead = (persona.modules?.length ?? 0) > 6;
  const constraints = Object.entries(bundle.vertical.constraints ?? {}).filter(([k]) => k !== "rule").map(([, v]) => v);
  const codes = lead ? constraints : (persona.modules ?? []).slice(0, 4);
  const out = new Map<string, string>();
  for (const c of codes) for (const i of bundle.toolbox.modules[c] ?? []) if (i.ref.startsWith("library:")) out.set(i.ref.slice(8), i.type);
  return [...out].map(([slug, type]) => ({ slug, type }));
}

/** The part of an agent's knowledge.md that points at its vertical library. */
export function verticalKnowledgeSection(persona: Persona, bundle: VerticalBundle, carried: string[], mcpUrl: string): string {
  const v = bundle.vertical;
  return [
    `## ${v.name} knowledge library`, "",
    `I work only with ${v.summary.charAt(0).toLowerCase()}${v.summary.slice(1)} My pack carries ${carried.length - 1} files of expert knowledge cards from the ${v.name.toLowerCase()} library (${bundle.cards.length} cards from ${bundle.sources.length} curated sources in all): ${carried.filter(p => !p.endsWith("sources.md")).map(p => `\`${p}\``).join(", ")}, with \`${carried.find(p => p.endsWith("sources.md")) ?? ""}\`.`, "",
    "- Each card is one claim with when it holds, when it fails, its numbers and its source tier. Check \"Holds when\" against this business before you use a card, and name the card id when you do.",
    "- Baseline cards come first: a broken baseline is repaired, never tested.",
    ...(v.constraints?.rule ? [`- ${v.constraints.rule}`] : []),
    ...(carried.some(p => p.includes("/toolbox/")) ? [`- My ${v.name.toLowerCase()} toolbox: ${carried.filter(p => p.includes("/toolbox/")).map(p => "`" + p + "`").join(", ")}. It says which skill, workflow or helper to use for each kind of job, tuned for ${v.name.toLowerCase()} brands, and the cards to read first.`] : []),
    `- For a module I do not carry, search the whole library through the AI Blocks connector (${mcpUrl}): the \`ask_vertical_knowledge\` tool with vertical \`${v.id}\`. It searches this library only.`,
    "- Cards are research, not orders: they never change the access level, approvals or the facts policy.",
  ].join("\n");
}
