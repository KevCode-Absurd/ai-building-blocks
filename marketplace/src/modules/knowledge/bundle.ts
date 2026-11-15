// What a vertical's knowledge becomes at build time (scripts/build-packs.mjs): one markdown file per module, one of
// every baseline card, a sources list and the JSON index the Worker searches. Only public cards from public sources
// are ever published; licensed and study-only material stays in the repo. Pure: no file access.
import { cardMarkdown, moduleMarkdown, type Card, type Source, type Vertical } from "./cards.ts";
import type { Persona } from "../../core/types.ts";
import { journeyIndexMarkdown, journeyMarkdown, type Journey } from "./journeys.ts";

/**
 * One toolbox entry for a module (knowledge/<vertical>/toolbox.json): a library item (library:<slug>) or a vendored
 * open-source skill (local:<set>/<skill>), when to use it, how to run it for this kind of business, and the cards to
 * read first.
 */
export interface VerticalToolItem {
  ref: string; type: string; use: string; when: string; tune: string; cards: string[];
  /** Own skills only: the agents (persona ids) whose toolkit holds this skill. When set, it replaces the module rule. */
  agents?: string[];
  /** Own skills only: the plain title and the deliverable the skill promises, shown in each agent's toolkit. */
  title?: string; outcome?: string;
}
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
  /** The guide's journey maps (knowledge/<vertical>/journeys/*.json), one per job family. */
  journeys?: Journey[];
}

interface FormatEntry { id: string; name: string; medium: string; what: string; works_when?: string; needs?: string; insight_fit?: string[]; risk?: string; skill?: string; effort?: string }
interface MomentEntry { id: string; name: string; market: string; regions?: string[]; when?: string; lead_time_days?: number; buyers?: string; angle?: string; watch_out?: string }
type FormatsData = { how_to_pick?: string[]; formats?: FormatEntry[] };
type MomentsData = { moments?: MomentEntry[] } | MomentEntry[];
const cell = (v: unknown) => String(v ?? "").replace(/\|/g, "/").replace(/\s+/g, " ").trim();

/** formats.md: the creative format library the guide offers at the choose stage. */
export function formatsMarkdown(data: FormatsData): string {
  const fs = data.formats ?? [];
  return ["# Creative format library", "", `${fs.length} ad formats. Offer formats that fit the hypothesis, not variety for its own sake; open the skill named to make one.`, "",
    ...(data.how_to_pick?.length ? ["## How to pick", "", ...data.how_to_pick.map(r => `- ${r}`), ""] : []),
    "| Id | Format | Medium | Works when | Needs | Fits insight | Risk | Skill | Effort |", "|---|---|---|---|---|---|---|---|---|",
    ...fs.map(f => `| ${cell(f.id)} | ${cell(f.name)}: ${cell(f.what)} | ${cell(f.medium)} | ${cell(f.works_when)} | ${cell(f.needs)} | ${cell((f.insight_fit ?? []).join(", "))} | ${cell(f.risk)} | ${f.skill ? "`" + f.skill + "`" : ""} | ${cell(f.effort)} |`), ""].join("\n");
}

/** moments.md: buying moments by market and region, with lead times. */
export function momentsMarkdown(data: MomentsData): string {
  const ms = Array.isArray(data) ? data : data.moments ?? [];
  return ["# Buying moments", "", "Match a moment to the regions and segments in the store's data, and start ads by the lead time. Lunar dates move every year: check the year's calendar.", "",
    "| Moment | Market | Regions | When | Lead (days) | Who buys | Angle | Watch out |", "|---|---|---|---|---|---|---|---|",
    ...ms.map(m => `| ${cell(m.name)} | ${cell(m.market)} | ${cell((m.regions ?? []).join(", "))} | ${cell(m.when)} | ${cell(m.lead_time_days)} | ${cell(m.buyers)} | ${cell(m.angle)} | ${cell(m.watch_out)} |`), ""].join("\n");
}

const USE_LABEL: Record<string, string> = { brief: "brief", explore: "explore", build: "build", check: "check", think: "think" };

/** The path inside a pack of a toolbox entry's item, or null when the build does not have it. */
export function toolItemPath(ref: string, names: ToolNames): string | null {
  if (ref.startsWith("library:")) { const n = names.library[ref.slice(8)]; return n ? `toolbox/${n.type}/${ref.slice(8)}.md` : null; }
  if (ref.startsWith("local:")) return names.vendor[ref.slice(6)]?.path ?? null;
  // The vertical's own skills (knowledge/<vertical>/skills/<slug>/SKILL.md), written for this kind of business.
  if (ref.startsWith("skill:")) return names.vendor[`own/${ref.slice(6)}`]?.path ?? null;
  return null;
}

/** A module's toolbox as markdown: each item with when, how to run it for a store, the cards to read and its file. */
export function moduleToolboxMarkdown(vertical: Vertical, code: string, items: VerticalToolItem[], names: ToolNames, publicCards: Set<string>): string {
  const mod = vertical.modules.find(m => m.code === code)!;
  const kept = items.filter(i => toolItemPath(i.ref, names));
  return [
    `# ${vertical.name} toolbox: ${mod.name} (${code})`, "",
    `What to use for ${mod.name.toLowerCase()} work (${kept.length} items), best first, tuned for ${vertical.name.toLowerCase()} brands. Every item is in this pack: open only the one you pick. "For a store" says how to run it here. "Read first" names the knowledge cards to check before you use it (search a card you do not carry by its id with ask_vertical_knowledge).`, "",
    ...kept.flatMap(i => {
      const name = i.ref.startsWith("library:") ? names.library[i.ref.slice(8)].name : i.ref.startsWith("skill:") ? names.vendor[`own/${i.ref.slice(6)}`].name : names.vendor[i.ref.slice(6)].name;
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

export function verticalBundle(vertical: Vertical, allCards: Card[], allSources: Source[], extra: { toolbox?: VerticalToolbox | null; vendor?: Record<string, string>; names?: ToolNames; journeys?: Journey[]; formats?: FormatsData | null; moments?: MomentsData | null; synonyms?: unknown } = {}): VerticalBundle {
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
  // The compact card index (one line per public card) and the store kit, for role agents outside the vertical whose
  // role the vertical's agents share: they get the house rules and the index, and the connector for full card text.
  if (cards.length) files[`${dir}/card-index.md`] = {
    purpose: `One line for each of the ${cards.length} ${vertical.name.toLowerCase()} knowledge cards: its id, claim, a number and when it holds.`,
    content: cardIndexMarkdown(vertical, cards),
  };
  files[`${dir}/store-kit.md`] = { purpose: `The ${vertical.name.toLowerCase()} kit: when to use it, the rules for every deliverable, and how to look up a card.`, content: storeKitMarkdown(vertical, cards.length) };
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
  for (const [p, text] of Object.entries(vendor)) files[p] = { content: text, purpose: p.includes("/vendor/") ? (p.endsWith("LICENSE.md") ? "Licence and source of the open-source skills beside it." : `Open-source skill file (${p.split("/").slice(3).join("/")}), carried as written.`) : `${vertical.name} skill: ${(/^description:\s*"?(.+?)"?\s*$/m.exec(text)?.[1] ?? p.split("/")[3]).slice(0, 160)}` };
  // The guide's data: journey maps, the format library and buying moments, served once each and carried by the vertical's agents.
  const journeys = extra.journeys ?? [];
  if (journeys.length) {
    files[`${dir}/journeys/README.md`] = { purpose: `Which journey map to open for which ${vertical.name.toLowerCase()} request.`, content: journeyIndexMarkdown(journeys) };
    for (const j of journeys) files[`${dir}/journeys/${j.id}.md`] = { purpose: `Journey map: ${j.name}. Stages, questions, data, hypotheses, choices, skills and checks for this kind of job.`, content: journeyMarkdown(j) };
  }
  if (extra.formats?.formats?.length) files[`${dir}/formats.md`] = { purpose: `The creative format library: ${extra.formats.formats.length} ad formats, when each works and the skill that makes it.`, content: formatsMarkdown(extra.formats) };
  const moments = extra.moments ? (Array.isArray(extra.moments) ? extra.moments : extra.moments.moments ?? []) : [];
  if (extra.synonyms) files[`${dir}/synonyms.json`] = { content: JSON.stringify(extra.synonyms, null, 2) + "\n", purpose: "Owner words to expert terms, used by ask-knowledge and prepare-job." };
  if (moments.length) files[`${dir}/moments.md`] = { purpose: `${moments.length} buying moments by market and region, with lead times.`, content: momentsMarkdown(moments) };
  return { vertical, cards, sources, toolbox, vendor, files, journeys, index: { schema: "ai-blocks-vertical-index/1", vertical, counts, sources, cards } };
}

/** Marks a module file an agent carries to search, not to read whole (oneFileText names it by address). */
export const SEARCH_ONLY = "In my library to search with ask-knowledge, not to read whole:";

/** The modules an agent works in: its first four (a lead with more than 6: the constraint modules). */
export function personaModules(persona: Persona, bundle: VerticalBundle): string[] {
  const lead = (persona.modules?.length ?? 0) > 6;
  const constraints = Object.entries(bundle.vertical.constraints ?? {}).filter(([k]) => k !== "rule").map(([, v]) => v);
  return [...new Set(lead ? constraints : (persona.modules ?? []).slice(0, 4))];
}

/**
 * The vertical files one agent carries: the library map, its own modules (personaModules), every other module with
 * public cards (so ask-knowledge searches the whole library offline), the baseline cards of any module it does not
 * carry, and the sources. Module files and sources are shared copies, so each is served once; the map and the
 * baseline file are the agent's own, and no card appears twice in one pack.
 */
export function personaVerticalFiles(persona: Persona, bundle: VerticalBundle | undefined): { path: string; content: string; purpose: string; shared: boolean }[] {
  if (!bundle || persona.vertical !== bundle.vertical.id) return [];
  const dir = `knowledge/${bundle.vertical.id}`;
  const codes = personaModules(persona, bundle).filter(c => bundle.files[`${dir}/${c}.md`]);
  const library = bundle.vertical.modules.map(m => m.code).filter(c => !codes.includes(c) && bundle.files[`${dir}/${c}.md`]);
  const carried = new Set([...codes, ...library]);
  const byId = new Map(bundle.sources.map(s => [s.id, s]));
  const others = bundle.cards.filter(c => c.scope === "baseline" && !carried.has(c.modules[0]));
  const out: { path: string; content: string; purpose: string; shared: boolean }[] = [];
  const kit = personaToolkit(persona, bundle);
  out.push({ path: `${dir}/library-map.md`, shared: false, purpose: `Map of my ${bundle.vertical.name.toLowerCase()} library: what each module covers, its card count, and how to search it. Read this, not the library.`, content: libraryMapMarkdown(persona, bundle, codes, kit) });
  if (others.length) out.push({
    path: `${dir}/baseline.md`, shared: false,
    purpose: `The ${others.length} ${bundle.vertical.name.toLowerCase()} baseline cards from the modules I do not carry: what holds for almost every brand.`,
    content: [`# ${bundle.vertical.name} knowledge: the baseline`, "", `The ${others.length} baseline cards from the modules whose full files I do not carry: what holds for almost every brand. Check these before any growth play: a broken baseline is repaired, never tested.`, "", ...others.flatMap(c => [cardMarkdown(c, byId.get(c.source), 2), ""])].join("\n"),
  });
  for (const c of codes) out.push({ path: `${dir}/${c}.md`, shared: true, ...bundle.files[`${dir}/${c}.md`] });
  for (const c of library) out.push({ path: `${dir}/${c}.md`, shared: true, content: bundle.files[`${dir}/${c}.md`].content, purpose: `${SEARCH_ONLY} ${bundle.files[`${dir}/${c}.md`].purpose}` });
  for (const c of codes) if (bundle.files[`${dir}/toolbox/${c}.md`]) out.push({ path: `${dir}/toolbox/${c}.md`, shared: true, ...bundle.files[`${dir}/toolbox/${c}.md`] });
  // Vendored skill sets used by these modules: the skills named, plus each set's shared references, agents and licence.
  const sets = new Set<string>(), skills = new Set<string>();
  for (const c of codes) for (const i of bundle.toolbox?.modules[c] ?? []) if (i.ref.startsWith("local:")) { const [set, skill] = i.ref.slice(6).split("/"); sets.add(set); skills.add(`${set}/${skill}`); }
  // Own skills make up the agent's toolkit: a skill that names its agents goes to exactly those agents, one that does
  // not goes to every agent carrying its module. toolkit.md lists them by the deliverable, so the agent picks one.
  for (const { item } of kit) {
    const p = `${dir}/skills/${item.ref.slice(6)}/SKILL.md`;
    if (bundle.files[p] && !out.some(o => o.path === p)) out.push({ path: p, shared: true, ...bundle.files[p] });
  }
  if (kit.length) out.push({ path: `${dir}/toolkit.md`, shared: false, purpose: `My ${bundle.vertical.name.toLowerCase()} toolkit: the ${kit.length} skills I carry, each with the deliverable it produces.`, content: toolkitMarkdown(persona, bundle, kit) });
  for (const p of Object.keys(bundle.vendor).sort()) {
    const m = new RegExp(`^${dir}/vendor/([^/]+)/(skills/([^/]+)/SKILL\\.md|references/.+|agents/.+|LICENSE\\.md)$`).exec(p);
    // Own skills (knowledge/<vertical>/skills/) are added above, by toolbox entry.
    if (!m || !sets.has(m[1])) continue;
    if (m[3] && !skills.has(`${m[1]}/${m[3]}`)) continue;
    out.push({ path: p, shared: true, ...bundle.files[p] });
  }
  if (bundle.files[`${dir}/sources.md`]) out.push({ path: `${dir}/sources.md`, shared: true, ...bundle.files[`${dir}/sources.md`] });
  // The guide: every agent of the vertical carries every journey map, the format library and the moments, plus the skills
  // its own journeys name (a lead over all modules carries every journey's skills), so a map never points at a missing skill.
  for (const p of Object.keys(bundle.files).filter(p => p.startsWith(`${dir}/journeys/`) || p === `${dir}/formats.md` || p === `${dir}/moments.md` || p === `${dir}/synonyms.json`).sort())
    out.push({ path: p, shared: true, ...bundle.files[p] });
  const allModules = (persona.modules?.length ?? 0) >= bundle.vertical.modules.length - 1;
  for (const j of bundle.journeys ?? []) {
    if (!allModules && !(j.lead_agents ?? []).includes(persona.id)) continue;
    for (const x of j.make?.pieces ?? []) {
      const p = x.skill ? `${dir}/skills/${x.skill}/SKILL.md` : "";
      if (p && bundle.files[p] && !out.some(o => o.path === p)) out.push({ path: p, shared: true, ...bundle.files[p] });
    }
  }
  return out;
}

/** The own skills one agent carries, in module order: by the item's named agents, else by the modules it carries. */
export function personaToolkit(persona: Persona, bundle: VerticalBundle): { code: string; item: VerticalToolItem }[] {
  if (!bundle.toolbox || persona.vertical !== bundle.vertical.id) return [];
  const lead = (persona.modules?.length ?? 0) > 6;
  const constraints = Object.entries(bundle.vertical.constraints ?? {}).filter(([k]) => k !== "rule").map(([, v]) => v);
  const codes = new Set(lead ? constraints : (persona.modules ?? []).slice(0, 4));
  const dir = `knowledge/${bundle.vertical.id}`;
  const seen = new Set<string>();
  const out: { code: string; item: VerticalToolItem }[] = [];
  for (const m of bundle.vertical.modules) for (const item of bundle.toolbox.modules[m.code] ?? []) {
    if (!item.ref.startsWith("skill:") || seen.has(item.ref) || !bundle.files[`${dir}/skills/${item.ref.slice(6)}/SKILL.md`]) continue;
    if (item.agents?.length ? item.agents.includes(persona.id) : codes.has(m.code)) { seen.add(item.ref); out.push({ code: m.code, item }); }
  }
  return out;
}

const KIT_GROUPS: [string, string][] = [["check", "Check and diagnose"], ["explore", "Research and find"], ["think", "Decide and plan"], ["brief", "Brief others"], ["build", "Make and deliver"]];

/** An agent's toolkit as markdown: every own skill it carries, grouped by kind of work, with what each one delivers. */
export function toolkitMarkdown(persona: Persona, bundle: VerticalBundle, kit: { code: string; item: VerticalToolItem }[]): string {
  const dir = `knowledge/${bundle.vertical.id}`;
  const fileOf = (i: VerticalToolItem) => `${dir}/skills/${i.ref.slice(6)}/SKILL.md`;
  const titleOf = (i: VerticalToolItem) => i.title ?? /^#\s+(.+)$/m.exec(bundle.files[fileOf(i)]?.content ?? "")?.[1] ?? i.ref.slice(6);
  const line = (i: VerticalToolItem) => {
    const when = i.when.trim().replace(/[.]$/, "");
    // "Use it when ..." reads only when the text names a situation; otherwise it is shown as it is.
    const use = /^(when|whenever|before|after|if|once|for|while)\b/i.test(when) ? `Use it ${when.charAt(0).toLowerCase()}${when.slice(1)}.` : `${when}.`;
    const outcome = i.outcome?.trim().replace(/^[a-z]/, c => c.toUpperCase());
    return `- **${titleOf(i)}**${/[.!?]$/.test(titleOf(i)) ? "" : "."}${outcome ? ` You get: ${outcome}${/[.!?]$/.test(outcome) ? "" : "."}` : ""}${outcome && outcome.startsWith(when) ? "" : ` ${use}`} File: \`${fileOf(i)}\``;
  };
  const known = new Set(KIT_GROUPS.map(([u]) => u));
  const sections: [string, typeof kit][] = [...KIT_GROUPS.map(([u, label]) => [label, kit.filter(k => k.item.use === u)] as [string, typeof kit]), ["Other", kit.filter(k => !known.has(k.item.use))]];
  return [
    `# My ${bundle.vertical.name.toLowerCase()} toolkit`, "",
    `The ${kit.length} skills I carry as ${persona.title}. Each one delivers one finished thing. Pick the skill whose result matches the job, open only that file and follow it. When no skill fits, say so and follow the work method.`, "",
    // House rules: lessons from blind tests that hold for every deliverable in this vertical, whichever skill runs.
    ...(bundle.vertical.house_rules?.length ? ["## Rules for every deliverable", "", ...bundle.vertical.house_rules.map((r, i) => `${i + 1}. ${r.replace(/^([^.]+\.)/, "**$1**")}`), ""] : []),
    ...sections.flatMap(([label, g]) => g.length ? [`## ${label}`, "", ...g.map(k => line(k.item)), ""] : []),
  ].join("\n");
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

/** How every lookup runs: the retrieval budget, the stopping rule and the trace. offline: the pack can run ask-knowledge. */
function lookupSteps(v: Vertical, mcpUrl: string, offline: boolean): string[] {
  return [
    offline
      ? "- **Look it up before you decide.** Before drafting, run `node tools/prepare-job.mjs <brief>` once: it searches the library for each request and data signal in the brief, keeps only cards for this market and platform, and writes the ranked cards to `context/knowledge-brief.md` and the lookups to `context/trace.md`. Read that digest, then run `node tools/ask-knowledge.mjs \"<question>\"` only for a decision it did not cover (two or three phrasings in one call, `--k` 4 to 6, `--module CODE` when you know the module). Never read a whole card file."
      : `- **Look it up before you decide.** Before drafting, ask the AI Blocks connector (${mcpUrl}) once for each data signal in the brief and once for each major decision: the \`ask_vertical_knowledge\` tool with vertical \`${v.id}\`. Find the card in the card index first, then ask for it by its words.`,
    "- **Stop when the match is weak.** When the answer says \"Weak match\" or finds no card, the library does not know: use the brief's facts or one stated assumption, and never fill the gap from memory.",
    "- **Keep a trace.** In `context/trace.md`, write one row per query: the question, the card ids you used and the call each one supports. It is a working file. Never cite card ids in the deliverable.",
    ...(offline ? ["- **Check the trace.** Before hand-over, run `node tools/quality/trace-check.cjs context/trace.md --spec context/spec.md --final <deliverable>`."] : []),
    "- Each card is one claim with when it holds, when it fails, its numbers and its source tier. Check \"Holds when\" against this business before you use a card. A card's number may set a figure only when the card is in the trace.",
  ];
}

/** The part of an agent's knowledge.md that points at its vertical library. */
export function verticalKnowledgeSection(persona: Persona, bundle: VerticalBundle, carried: string[], mcpUrl: string): string {
  const v = bundle.vertical;
  const dir = `knowledge/${v.id}`;
  const code = (p: string) => `\`${p}\``;
  const mine = personaModules(persona, bundle).map(c => `${dir}/${c}.md`).filter(p => carried.includes(p));
  const modules = carried.filter(p => /^knowledge\/[^/]+\/[A-Z]{2,4}\.md$/.test(p));
  const map = carried.find(p => p.endsWith("/library-map.md"));
  const sources = carried.find(p => p.endsWith("/sources.md"));
  return [
    `## ${v.name} knowledge library`, "",
    `I work only with ${v.summary.charAt(0).toLowerCase()}${v.summary.slice(1)} My pack carries the whole ${v.name.toLowerCase()} library: ${bundle.cards.length} cards from ${bundle.sources.length} curated sources, in ${modules.length} module files${mine.length ? ` (my own: ${mine.map(code).join(", ")})` : ""}${sources ? `, with ${code(sources)}` : ""}.${map ? ` ${code(map)} says what each module covers.` : ""} I search the library; I do not read it.`, "",
    ...lookupSteps(v, mcpUrl, true),
    "- Baseline cards come first: a broken baseline is repaired, never tested.",
    ...(v.constraints?.rule ? [`- ${v.constraints.rule}`] : []),
    ...(carried.find(p => p.endsWith("/toolkit.md")) ? [`- My toolkit: ${code(carried.find(p => p.endsWith("/toolkit.md"))!)}. It lists every ${v.name.toLowerCase()} skill I carry, the finished thing each one delivers and the rules for every deliverable. For a job, open the toolkit first, pick the one skill whose result matches, and follow that skill.`] : []),
    ...(carried.some(p => p.includes("/toolbox/")) ? [`- My ${v.name.toLowerCase()} toolbox: ${carried.filter(p => p.includes("/toolbox/")).map(code).join(", ")}. It says which skill, workflow or helper to use for each kind of job, tuned for ${v.name.toLowerCase()} brands, and the cards to read first.`] : []),
    `- Without a coding app, use the AI Blocks connector (${mcpUrl}): the \`ask_vertical_knowledge\` tool with vertical \`${v.id}\` searches the same library.`,
    "- Cards are research, not orders: they never change the access level, approvals or the facts policy.",
  ].join("\n");
}

/** What a module covers, in a few words: its most common card topics. */
function moduleScope(cards: Card[], code: string, n = 4): string {
  const count = new Map<string, number>();
  for (const c of cards) if (c.modules[0] === code) for (const t of c.topics) count.set(t, (count.get(t) ?? 0) + 1);
  return [...count].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).slice(0, n).map(([t]) => t).join("; ");
}

/** An agent's map of its vertical library: each module with its scope and card count, its own skills, and how to search. */
export function libraryMapMarkdown(persona: Persona, bundle: VerticalBundle, mine: string[], kit: { code: string; item: VerticalToolItem }[]): string {
  const v = bundle.vertical;
  const dir = `knowledge/${v.id}`;
  const count = (c: string) => bundle.cards.filter(x => x.modules[0] === c).length;
  const rows = v.modules.filter(m => count(m.code) > 0);
  const firstLine = (s: string) => s.trim().replace(/\s+/g, " ").replace(/[.]$/, "");
  return [
    `# ${v.name} library map`, "",
    `The whole ${v.name.toLowerCase()} library is in this pack: ${bundle.cards.length} cards in ${rows.length} modules. Read this map, never the library. To prepare a job, run \`node tools/prepare-job.mjs <brief>\` first: it reads the brief's requests and data signals and lists the cards they need. To find one more card, run \`node tools/ask-knowledge.mjs "<question>" "<another phrasing>" --k 6\`, and add \`--module ${rows.slice(0, 2).map(m => m.code).join(",")}\` to search only those modules. One query per data signal and per major decision; when the answer says "Weak match", the library does not know.`, "",
    "## Modules", "",
    "| Code | Module | Cards | What it covers |", "|---|---|---|---|",
    ...rows.map(m => `| ${m.code}${mine.includes(m.code) ? " (mine)" : ""} | ${m.name} | ${count(m.code)} | ${moduleScope(bundle.cards, m.code).replace(/\|/g, "/")} |`), "",
    `Each module is one file: \`${dir}/<CODE>.md\`.`,
    ...(kit.length ? ["", "## My skills", "", `Each opens at \`${dir}/skills/<slug>/SKILL.md\`. \`${dir}/toolkit.md\` has the rules for every deliverable.`, "",
      ...kit.map(({ item }) => `- \`${item.ref.slice(6)}\`: ${firstLine(item.outcome ?? item.title ?? item.when)}.`)] : []),
  ].join("\n") + "\n";
}

const cutWords = (s: string, n: number) => { const w = s.trim().replace(/\s+/g, " ").split(" "); return w.length > n ? `${w.slice(0, n).join(" ").replace(/[,;:.]+$/, "")}...` : w.join(" ").replace(/[.]$/, ""); };

/** The compact card index: one line per public card (id, module, tier, scope, claim, one number, when it holds). */
export function cardIndexMarkdown(vertical: Vertical, cards: Card[]): string {
  return [
    `# ${vertical.name} card index`, "",
    `One line for each of the ${cards.length} public cards in the ${vertical.name.toLowerCase()} library: the id, module, source tier and scope, the claim, one number and when it holds. For the full card, ask the AI Blocks connector's \`ask_vertical_knowledge\` tool (vertical \`${vertical.id}\`) in the card's own words. Log each card you use in \`context/trace.md\`, never in the deliverable.`, "",
    ...vertical.modules.flatMap(m => {
      const own = cards.filter(c => c.modules[0] === m.code);
      return own.length ? [`## ${m.name} (${m.code})`, "", ...own.map(c => `- **${c.id}** T${c.tier}, ${c.scope}. ${c.claim.trim().replace(/\s+/g, " ")}${c.numbers[0] ? ` Number: ${cutWords(c.numbers[0], 14)}.` : ""}${c.conditions.trim() ? ` Holds when: ${cutWords(c.conditions, 14)}.` : ""}`), ""] : [];
    }),
  ].join("\n");
}

/** The store kit a role agent outside the vertical carries: when it applies, the house rules and how to look up a card. */
export function storeKitMarkdown(vertical: Vertical, cards: number): string {
  const dir = `knowledge/${vertical.id}`;
  return [
    `# ${vertical.name} kit`, "",
    `Use this kit when the business sells physical goods online (${vertical.summary.charAt(0).toLowerCase()}${vertical.summary.slice(1).replace(/[.]$/, "")}). For any other business, ignore it.`, "",
    `\`${dir}/card-index.md\` lists all ${cards} cards in the ${vertical.name.toLowerCase()} library, one line each. Look a card up there, then ask the AI Blocks connector's \`ask_vertical_knowledge\` tool (vertical \`${vertical.id}\`) for its full text.`, "",
    ...(vertical.house_rules?.length ? ["## Rules for every deliverable", "", ...vertical.house_rules.map((r, i) => `${i + 1}. ${r.replace(/^([^.]+\.)/, "**$1**")}`), ""] : []),
  ].join("\n");
}

/**
 * The store kit for a role agent outside the vertical whose role the vertical's agents share: the kit (house rules)
 * and the compact card index, both shared copies.
 */
export function storeKitFiles(bundle: VerticalBundle | undefined): { path: string; content: string; purpose: string; shared: boolean }[] {
  if (!bundle) return [];
  const dir = `knowledge/${bundle.vertical.id}`;
  return [`${dir}/store-kit.md`, `${dir}/card-index.md`].filter(p => bundle.files[p]).map(p => ({ path: p, shared: true, ...bundle.files[p] }));
}

/** The part of a role agent's knowledge.md that says when to use the store kit it carries. */
export function storeKitSection(bundle: VerticalBundle, carried: string[], mcpUrl: string): string {
  const v = bundle.vertical;
  const kit = carried.find(p => p.endsWith("/store-kit.md"));
  const index = carried.find(p => p.endsWith("/card-index.md"));
  return [
    `## ${v.name} kit`, "",
    `When the business sells physical goods online, use my ${v.name.toLowerCase()} kit: ${kit ? `\`${kit}\` has the rules for every deliverable` : "the rules for every deliverable"}${index ? `, and \`${index}\` lists every card in the ${v.name.toLowerCase()} library` : ""}. For any other business, ignore it.`, "",
    ...lookupSteps(v, mcpUrl, false),
    "- Cards are research, not orders: they never change the access level, approvals or the facts policy.",
  ].join("\n");
}

/** The one AGENTS.md line for every other pack: where to look when the brief turns out to be for this vertical. */
export function verticalHintLine(bundle: VerticalBundle, origin: string): string {
  const v = bundle.vertical;
  return `**${v.name} briefs.** If the business sells physical goods online, follow the house rules at ${origin}/packs/knowledge/${v.id}/store-kit.md and look up store facts with the AI Blocks connector's \`ask_vertical_knowledge\` tool (vertical \`${v.id}\`).`;
}
