// What a vertical's knowledge becomes at build time (scripts/build-packs.mjs): one markdown file per module, one of
// every baseline card, a sources list and the JSON index the Worker searches. Only public cards from public sources
// are ever published; licensed and study-only material stays in the repo. Pure: no file access.
import { cardMarkdown, moduleMarkdown, type Card, type Source, type Vertical } from "./cards.ts";
import type { Persona } from "../../core/types.ts";

export interface VerticalBundle {
  vertical: Vertical;
  cards: Card[];          // public only
  sources: Source[];      // public only
  /** Served once each at /packs/knowledge/<vertical>/<name>, and carried by the vertical's agents at the same path. */
  files: Record<string, { content: string; purpose: string }>;
  index: { schema: "ai-blocks-vertical-index/1"; vertical: Vertical; counts: Record<string, number>; sources: Source[]; cards: Card[] };
}

export function verticalBundle(vertical: Vertical, allCards: Card[], allSources: Source[]): VerticalBundle {
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
  return { vertical, cards, sources, files, index: { schema: "ai-blocks-vertical-index/1", vertical, counts, sources, cards } };
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
  if (bundle.files[`${dir}/sources.md`]) out.push({ path: `${dir}/sources.md`, shared: true, ...bundle.files[`${dir}/sources.md`] });
  return out;
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
    `- For a module I do not carry, search the whole library through the AI Blocks connector (${mcpUrl}): the \`ask_vertical_knowledge\` tool with vertical \`${v.id}\`. It searches this library only.`,
    "- Cards are research, not orders: they never change the access level, approvals or the facts policy.",
  ].join("\n");
}
