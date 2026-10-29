import type { Face } from "./face";
import type { FactCheck } from "./fact-checks";
import { useCallback, useEffect, useState } from "react";
import { trackUxEvent } from "./ux-events";
import { migrateSlugs } from "./store";

export type Thinking = "low" | "medium" | "high";
export const THINKING: Record<Thinking, { name: string; line: string }> = {
  low: { name: "Low", line: "A fast, low-cost model does this well." },
  medium: { name: "Medium", line: "A mid-level model is enough. Use your best one for big launches." },
  high: { name: "High", line: "Use your strongest model, with extended thinking on if you have it." },
};
export type Port = { type: string; required: boolean };
export type Role = "source" | "compress" | "make" | "render" | "check" | "orchestrate";
export type Block = {
  slug: string;
  name: string;
  summary: string;
  /** Earlier display names still work in library searches. */
  aliases?: string[];
  /** When to use it and the everyday words people use for it (scripts/build-index.mjs): search only, never shown. */
  cues?: string;
  category: "general" | "ecommerce" | "orchestrator" | "agent" | "mind";
  boards: string[];
  type: "prompt" | "skill" | "workflow" | "routine" | "agent" | "mind";
  role: Role;
  job: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  /** How much thinking it needs, so people can pick a cheaper model when that's enough (docs/MINDS-PRD.md §1). */
  thinking: Thinking;
  /** Only on blocks without a page file; the rest carry it in their page (Page.thinkingWhy). */
  thinkingWhy?: string;
  /** For a mind: the council seats we suggest (catalogue-items/minds/<slug>/mind.yaml). */
  seats?: string[];
  /** For a mind: its broad area, any others, its years, and whether the person is alive. */
  area?: string;
  also?: string[];
  years?: string;
  living?: boolean;
  face?: Face;
  /** For a mind: role labels from catalogue-items/minds/_labels.yaml, most defining first. */
  labels?: string[];
  identity?: string;
  /** For a skill: the minds whose work it comes from, strongest first (item.yaml `minds`, docs/SOURCE-SKILLS-PRD.md). */
  minds?: string[];
  /** For a mind: the skills from their work, worked out from the skills' `minds` lists. */
  skills?: string[];
  /** For a mind: the workflows from their work. */
  flows?: string[];
  inputs: Port[];
  outputs: Port[];
  uses: string[];
  steps: { uses: string; note: string }[];
  /** Keep the workflow's governing instructions when exporting it or opening it in the builder. */
  execution?: "coordinator";
  origin: "own" | "rebuilt" | "imported";
  /** For an imported skill: who made it, where it came from and its licence (item.yaml `source`). */
  source?: Source;
  /** Things to know before using it, shown as labels: "scrapes" = it collects data from websites, "paid:<service>" = it needs a paid account with that service (item.yaml `warnings`). */
  warnings?: string[];
  /** The last test run on the example business, if there was one. */
  tested: { on: string; result: "pass" | "fail"; business: string } | null;
  version: string;
  /** True when the skill has extra files (references/, scripts/, LICENSE...). A skill's ship in skills/<slug>.zip; the list is in its page data. */
  hasFiles?: boolean;
  /** The same look in the other format (image or video), if the library has it. */
  twin: string | null;
  usedIn: number;
  task: string;
  /** Reviewed secondary use cases; job functions are independent of format. */
  tasks?: string[];
  jobFunctions?: string[];
  /** Source-supported subject expertise, independent of display names. */
  topics?: string[];
  headline: string;
  /** One finished picture made with a prompt like this block's, for visual blocks that have one. */
  look?: { src: string; alt: string };
};
export type PlanLink = { slug: string; name: string; url: string };
/** Preserve governing branch/resume rules; fixed legacy sequences can still be edited step by step. */
export const workflowEntries = (b: Block): string[] => b.type === "agent" || b.execution === "coordinator" ? [b.slug] : b.steps.map(s => s.uses);
export type PlanItem = { key: string; label: string; what: string; parts: string[]; required: boolean; maker?: PlanLink };
export type Plan = {
  needed: PlanItem[];
  helps: PlanItem[];
  chain: (PlanLink & { label: string; bring: string[]; uses: string[] })[];
  brain: { files: string[]; note: string } | null;
  next: (PlanLink & { job: string; label: string; takes: string[] })[];
};
/** The full page for one block, loaded when its page opens. */
export type Page = {
  /** Scoped source checks; these do not claim a successful live test. */
  fact_checks?: FactCheck[];
  /** Reviewed method adapters for this skill, generated from the published inputs and steps. */
  copyable?: ReturnType<typeof import('./copyable-task.mjs').makeTaskRecipe>;
  headline: string; subhead: string; explain: string; when: string[];
  /** Situations where this item is the wrong tool, often naming a better one. */
  not_for?: string[];
  /** What goes in and what comes out, from SKILL.md. Not the same as `example`, the test input, which is never shipped. */
  output_sample?: { input: string[]; prerequisites?: string[]; output: { name: string; contains: string }[] };
  you_give: string[]; you_get: string[]; how_to_use: string[];
  how_it_works: { title: string; text: string }[];
  /** A workflow's note for each step, in order (blocks.json sends only the step slugs). */
  stepNotes?: string[];
  output_shape?: string;
  example?: { business: string; input: string; output: string };
  tweaks: { what: string; how: string }[]; judge: string[]; test?: string[]; improve: string[];
  terms: { term: string; meaning: string }[];
  /** The AI tools and extra inputs that get the best result from this block. */
  works_best_with?: { tools?: { name: string; why: string }[]; inputs?: string[] };
  /** Public sources the block was built from (item.yaml credits). */
  credits?: { title: string; by: string; url: string; used: string }[];
  /** For a mind: their big ideas, suggested council seats and the minds they pair well with. */
  ideas?: { title: string; text: string }[];
  hire?: { jobs: { title: string; text: string }[]; steps: { title: string; text: string }[]; questions: string[] };
  seats?: { seat: string; asks: string }[];
  pairs?: string[];
  /** What it needs first, the steps before it and the paths after it (tools/lib/needs.mjs). */
  plan?: Plan;
  /** Facts only a block's own page needs (moved here from blocks.json to keep the library small). */
  files?: string[];
  words?: number; added?: string; tested?: { on: string; result: "pass" | "fail"; business: string; model?: string; judge?: string };
  /** Why the block needs the thinking level it has (moved here from blocks.json to keep the library small). */
  thinkingWhy?: string;
  /** An imported skill's full source: blocks.json keeps only `by`, to stay small. */
  source?: Source;
  /** Markdown already turned into HTML by the index build. */
  html: { explain: string; skill: string };
};
export type RosterMind = { slug: string; name: string; identity?: string; area: string; seat: string; living: boolean; built: boolean; face?: Face; labels?: string[]; useCases?: string[] };
/** A block as blocks.json sends it: defaults and empty values left out (a headline equal to the name too), ports as "type" or "type?" (optional), steps as a slug or [slug, note]. */
type Wire = Partial<Omit<Block, "inputs" | "outputs" | "steps" | "tested">> & { slug: string; inputs?: string[]; outputs?: string[]; steps?: (string | [string, string])[]; tested?: 1 };
const port = (p: string): Port => (p.endsWith("?") ? { type: p.slice(0, -1), required: false } : { type: p, required: true });
function unwire(w: Wire): Block {
  const { inputs, outputs, steps, tested, ...rest } = w;
  return {
    name: "", summary: "", task: "set-up-ai", category: "general", type: "skill", role: "make", job: "ops", level: "intermediate", thinking: "medium",
    boards: [], uses: [], origin: "own", version: "1.0.0", twin: null, minds: [], usedIn: 0, tested: tested ? { on: "", result: "pass", business: "" } : null,
    ...rest, headline: rest.headline ?? rest.name,
    inputs: (inputs ?? []).map(port), outputs: (outputs ?? []).map(port), steps: (steps ?? []).map((s) => (typeof s === "string" ? { uses: s, note: "" } : { uses: s[0], note: s[1] })),
  } as Block;
}
/** `index` is set on the small list catalogue (blocks-index.json): cards, filters and quick search only, no ports, uses or roster. */
export type Catalogue = { built: string; sourceHash?: string; itemSlug?: string; index?: true; portTypes: Record<string, string | null>; renamed: Record<string, string>; minds?: { areas: Record<string, string>; roster: RosterMind[]; labels?: Record<string, string> }; blocks: Block[]; bySlug: Record<string, Block> };

export const ROLES: { id: Role; name: string; does: string }[] = [
  { id: "source", name: "Source", does: "Brings information in" },
  { id: "compress", name: "Digest", does: "Turns a lot of information into a short, usable summary" },
  { id: "make", name: "Make", does: "Writes the thing" },
  { id: "render", name: "Render", does: "Produces images and video, or the prompts for them" },
  { id: "check", name: "Check", does: "Stops weak work before it moves on" },
  { id: "orchestrate", name: "Orchestrate", does: "Connects blocks and passes work between them" },
];
export const roleName = (r: Role) => ROLES.find((x) => x.id === r)?.name ?? r;

export const LEVELS = ["beginner", "intermediate", "advanced", "expert"] as const;
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
/** "2026-10-19" as "Oct 2026". Pages never show a day, only the month. */
export const monthOf = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
// Friendly type names live in port-label.ts so the Worker (public MCP diagrams) uses the same ones.
export { portLabel } from "./port-label.ts";

let catalogue: Promise<Catalogue> | null = null;
let resolvedCatalogue: Catalogue | null = null;
let listIndex: Promise<Catalogue> | null = null;
let resolvedIndex: Catalogue | null = null;
let starter: Promise<Catalogue> | null = null;
let resolvedStarter: Catalogue | null = null;
function decodeCatalogue(d: Omit<Catalogue, "blocks" | "bySlug" | "portTypes"> & { portTypes?: Catalogue["portTypes"]; blocks: Wire[] }): Catalogue {
  // Full, list and starter catalogues use the same wire records and decoder.
  const faces = new Map<string, Face | undefined>((d.minds?.roster ?? []).map((m: RosterMind) => [m.slug, m.face]));
  const blocks: Block[] = d.blocks.map(unwire);
  for (const b of blocks) if (b.type === "mind" && !b.face) b.face = faces.get(b.slug);
  return { ...d, portTypes: d.portTypes ?? {}, renamed: d.renamed ?? {}, blocks, bySlug: Object.fromEntries(blocks.map(b => [b.slug, b])) };
}
const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
/** A public data file, retried once. The clock only covers the wait for the server to answer:
 * a slow but moving download (a phone line, a background tab) is not cut off half way. */
async function fetchData(url: string, { answerMs = 12000, totalMs = 60000, attempts = 2 } = {}): Promise<ArrayBuffer> {
  for (let attempt = 1; ; attempt++) {
    const controller = new AbortController();
    const answer = setTimeout(() => controller.abort(), answerMs), total = setTimeout(() => controller.abort(), totalMs);
    try {
      const response = await fetch(url, { signal: controller.signal, ...(attempt > 1 ? { cache: "reload" as RequestCache } : {}) });
      clearTimeout(answer);
      if (!response.ok) throw Object.assign(Error(`${url}: ${response.status}`), { retry: response.status >= 500 || response.status === 429 });
      return await response.arrayBuffer();
    } catch (error) {
      if (attempt >= attempts || (error as { retry?: boolean }).retry === false) throw error;
      await pause(800 * attempt);
    } finally { clearTimeout(answer); clearTimeout(total); }
  }
}
export function loadStarterCatalogue(): Promise<Catalogue> {
  starter ??= fetch("/data/starter-blocks.json", { signal: AbortSignal.timeout(2000) })
    .then(async response => {
      if (!response.ok) throw Error("Starter tasks unavailable");
      const text = await response.text();
      if (text.length > 128000) throw Error("Starter tasks too large");
      const data = JSON.parse(text);
      if (data.starter !== true || !Array.isArray(data.blocks) || data.blocks.length !== 4) throw Error("Invalid starter tasks");
      resolvedStarter = decodeCatalogue(data); return resolvedStarter;
    }).catch(error => { starter = null; throw error; });
  return starter;
}
export function loadCatalogue(): Promise<Catalogue> {
  catalogue ??= fetchData("/data/blocks.json")
    .then(async (bytes) => {
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      return { ...JSON.parse(new TextDecoder().decode(bytes)), sourceHash: Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("") };
    })
    .then((d) => {
      migrateSlugs(d.renamed ?? {});
      resolvedCatalogue = decodeCatalogue(d); return resolvedCatalogue;
    }).catch((e) => { catalogue = null; throw e; });
  return catalogue;
}
/** The library list (scripts/build-list-index.mjs): what cards, filters and quick search need, about a third
 * smaller over the wire than blocks.json. The full catalogue is used instead once it is here. */
export function loadCatalogueIndex(): Promise<Catalogue> {
  if (resolvedCatalogue) return Promise.resolve(resolvedCatalogue);
  listIndex ??= fetchData("/data/blocks-index.json")
    .then((bytes) => {
      const d = JSON.parse(new TextDecoder().decode(bytes));
      if (d.index !== true || !Array.isArray(d.blocks) || !/^[a-f\d]{64}$/.test(d.sourceHash ?? "")) throw Error("Invalid catalogue index");
      migrateSlugs(d.renamed ?? {});
      resolvedIndex = decodeCatalogue(d); return resolvedIndex;
    })
    // An older deployment without the list file still has the full catalogue.
    .catch(() => loadCatalogue())
    .catch((e) => { listIndex = null; throw e; });
  return listIndex;
}
/** `tier: "index"` is enough for lists and cards; block pages, the builder and the composer need "full". */
export function useCatalogueState(enabled = true, { starterFirst = false, tier = "full" }: { starterFirst?: boolean; tier?: "full" | "index" } = {}) {
  const [catalogue, setCatalogue] = useState<Catalogue | null>(() => resolvedCatalogue ?? (tier === "index" ? resolvedIndex : null));
  const [starterCatalogue, setStarterCatalogue] = useState<Catalogue | null>(resolvedStarter);
  const [starterFailed, setStarterFailed] = useState(false);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(enabled);
  const retry = useCallback(() => { trackUxEvent("task_retried"); setAttempt(value => value + 1); }, []);
  // The starter is optional and loads even before the full library is wanted. A stalled starter
  // must not hold the full library behind its timeout; both downloads make progress independently.
  useEffect(() => {
    if (!starterFirst || resolvedCatalogue || resolvedStarter) return;
    let live = true;
    void loadStarterCatalogue().then(value => { if (live) setStarterCatalogue(value); }).catch(() => { if (live) setStarterFailed(true); });
    return () => { live = false; };
  }, [starterFirst, attempt]);
  useEffect(() => {
    if (!enabled) { setLoading(false); return; }
    let live = true;
    const ready = resolvedCatalogue ?? (tier === "index" ? resolvedIndex : null);
    if (ready) { setCatalogue(ready); setLoading(false); setError(""); return; }
    // A list catalogue on screen is not enough for a page that needs the full one.
    setCatalogue(current => tier === "full" && current?.index ? null : current);
    setLoading(true); setError("");
    (tier === "index" ? loadCatalogueIndex() : loadCatalogue()).then(value => { if (live) setCatalogue(value); }).catch(() => {
      if (live) setError("The task library could not load. Check your connection and try again.");
    }).finally(() => { if (live) setLoading(false); });
    return () => { live = false; };
  }, [enabled, attempt, starterFirst, tier]);
  const shown = tier === "full" && catalogue?.index ? null : catalogue;
  return { catalogue: shown, starterCatalogue: starterFirst ? starterCatalogue : null, starterFailed: starterFirst && starterFailed, complete: shown !== null, loading, error, retry };
}
const itemCatalogues = new Map<string, Promise<Catalogue>>();
export function loadItemCatalogue(slug: string): Promise<Catalogue> {
  if (resolvedCatalogue) return Promise.resolve(resolvedCatalogue);
  if (!/^[a-z0-9-]+$/.test(slug)) return loadCatalogue();
  if (!itemCatalogues.has(slug)) itemCatalogues.set(slug, fetchData(`/data/items/${slug}.json`, {attempts: 1})
    .then(bytes => {
      const data = JSON.parse(new TextDecoder().decode(bytes));
      if (data.itemSlug !== slug || !Array.isArray(data.blocks) || !data.blocks.some((b: Wire) => b.slug === slug) || !/^[a-f\d]{64}$/.test(data.sourceHash ?? "")) throw Error("Invalid item data");
      if (data.page) pageCache.set(slug, Promise.resolve(data.page));
      return decodeCatalogue(data);
    }).catch(() => { itemCatalogues.delete(slug); return loadCatalogue(); }));
  return itemCatalogues.get(slug)!;
}
/** Show the exact item and its existing links first, then complete the library after its page opens. */
export function useItemCatalogue(slug: string | null) {
  const [state, setState] = useState<{slug: string | null; catalogue: Catalogue | null; error: string}>({slug: null, catalogue: null, error: ""});
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!slug) return;
    let live = true;
    const complete = () => { void loadCatalogue().then(catalogue => { if (live) setState({slug, catalogue, error: ""}); }).catch(() => {}); };
    void loadItemCatalogue(slug).then(catalogue => {
      if (!live) return; setState({slug, catalogue, error: ""});
      if (!catalogue.itemSlug) return;
      if (document.documentElement.dataset.boot === "ready") complete();
      else document.addEventListener("abb:ready", complete, {once: true});
    }).catch(() => { if (live) setState({slug, catalogue: null, error: "The task library could not load. Check your connection and try again."}); });
    return () => { live = false; document.removeEventListener("abb:ready", complete); };
  }, [slug, attempt]);
  return {catalogue: state.slug === slug ? state.catalogue : null, error: state.slug === slug ? state.error : "", retry: useCallback(() => setAttempt(n => n + 1), [])};
}
export function useCatalogue(enabled = true) { return useCatalogueState(enabled).catalogue; }
const textCache = new Map<string, Promise<string | null>>();
export function loadSkillText(slug: string, file = "SKILL.md"): Promise<string | null> {
  const key = `${slug}/${file}`;
  if (!textCache.has(key)) {
    const pending = fetch(`/skills/${key}`).then((r) => (r.ok ? r.text() : null)).then((t) => (t && !t.trimStart().startsWith("<!doctype") ? t.replace(/\r\n?/g, "\n") : null));
    textCache.set(key, pending.then(text => {
      if (!text) textCache.delete(key);
      return text;
    }, error => {
      textCache.delete(key);
      throw error;
    }));
  }
  return textCache.get(key)!;
}

/** The extra files in a skill's folder (references/, scripts/, assets/, LICENSE...), listed at build time in its page data. */
export function loadFiles(b: Block): Promise<string[]> {
  if (!b.hasFiles) return Promise.resolve([]);
  return loadPage(b.slug).then((p) => (Array.isArray(p?.files) ? p.files : []));
}
/** A skill with extra files as the zip built for it (skills/<slug>.zip: <slug>/SKILL.md plus its files). Null when it isn't there. */
export async function loadSkillZip(slug: string): Promise<Uint8Array | null> {
  try {
    const r = await fetch(`/skills/${slug}.zip`);
    // A missing file can come back as the site's own page.
    if (!r.ok || (r.headers.get("content-type") ?? "").includes("text/html")) return null;
    return new Uint8Array(await r.arrayBuffer());
  } catch { return null; }
}

/** Blocks whose outputs feed this block's inputs, and blocks this one can feed. */
const portIndex = new WeakMap<Catalogue, { made: Map<string, Block[]>; taken: Map<string, Block[]> }>();
export function neighbours(c: Catalogue, b: Block) {
  let ix = portIndex.get(c);
  if (!ix) {
    ix = { made: new Map(), taken: new Map() };
    for (const x of c.blocks) {
      if (x.category === "orchestrator") continue;
      for (const t of new Set(x.outputs.map((p) => p.type))) (ix.made.get(t) ?? ix.made.set(t, []).get(t)!).push(x);
      for (const t of new Set(x.inputs.map((p) => p.type))) (ix.taken.get(t) ?? ix.taken.set(t, []).get(t)!).push(x);
    }
    portIndex.set(c, ix);
  }
  const pick = (m: Map<string, Block[]>, types: string[]) => { const seen = new Set<Block>(); for (const t of new Set(types)) for (const x of m.get(t) ?? []) if (x.slug !== b.slug) seen.add(x); return c.blocks.filter((x) => seen.has(x)); };
  return { before: pick(ix.made, b.inputs.map((p) => p.type)), after: pick(ix.taken, b.outputs.map((p) => p.type)) };
}

/** Wires an ordered list of blocks: each step reads from the latest earlier step that makes one of its inputs,
 *  or from the step just before it when none does. Returns [from, to] index pairs. */
export function wireSteps(c: Catalogue, slugs: string[]): [number, number][] {
  const edges: [number, number][] = [];
  slugs.forEach((slug, i) => {
    if (i === 0) return;
    const b = c.bySlug[slug];
    const from = new Set<number>();
    for (const p of b?.inputs ?? []) {
      for (let j = i - 1; j >= 0; j--) if (c.bySlug[slugs[j]]?.outputs.some((o) => o.type === p.type)) { from.add(j); break; }
    }
    if (!from.size) from.add(i - 1);
    for (const j of [...from].sort((a, z) => a - z)) edges.push([j, i]);
  });
  return edges;
}

/** The five formats people can use, from one prompt to an expert's perspective. */
export type Kind = "prompt" | "skill" | "workflow" | "agent" | "mind";
export const KINDS: { id: Kind; name: string; plural: string; path: string; what: string }[] = [
  { id: "prompt", name: "Prompt", plural: "Prompts", path: "prompts", what: "One message you paste into your AI for a quick result." },
  { id: "skill", name: "Skill", plural: "Skills", path: "skills", what: "Instructions you add to your AI once. It follows them step by step and checks its own work." },
  { id: "workflow", name: "Workflow", plural: "Workflows", path: "workflows", what: "Several skills in order. Each one hands its work to the next." },
  { id: "agent", name: "Agent", plural: "Agents", path: "agents", what: "An AI that runs whole workflows on its own, decides what to do next and asks you before anything that spends, sends or goes live." },
  { id: "mind", name: "Mind", plural: "Minds", path: "minds", what: "A great mind's ideas and voice, from their public work. Use one alone, or seat several on a council." },
];
export const kindOf = (b: Block): Kind => (b.type === "mind" ? "mind" : b.type === "agent" ? "agent" : b.category === "orchestrator" || b.type === "workflow" || b.type === "routine" ? "workflow" : b.type === "prompt" ? "prompt" : "skill");
export const kindInfo = (b: Block) => KINDS.find((k) => k.id === kindOf(b))!;
export const pathOf = (b: Block) => `/${kindInfo(b).path}/${b.slug}`;

export { TASKS, FUNCTIONS, AREAS, QUICK_JOB_IDS, taskOf, taskIdsOf, functionsOf, areasOf, availableTasks, availableFunctions, classificationText, FUNCTION_MOVED, formatOf, rendersOf } from "./catalogue-taxonomy.mjs";

const pageCache = new Map<string, Promise<Page | null>>();
export function loadPage(slug: string): Promise<Page | null> {
  if (!pageCache.has(slug)) pageCache.set(slug, fetch(`/data/pages/${slug}.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null).then(page => { if (!page) pageCache.delete(slug); return page; }));
  return pageCache.get(slug)!;
}

/** The paid service a block needs, from its "paid:<service>" warning, or "". */
export const paidService = (b: { warnings?: string[] }) => b.warnings?.find((w) => w.startsWith("paid:"))?.slice(5) ?? "";

/** Where an imported skill came from (item.yaml `source`). The library list only carries `by`; the rest comes with the page. */
export type Source = { by: string; repo?: string; url?: string; licence?: string; original?: string; commit?: string };

/** The wire decoder, for offline scripts (scripts/evaluate-minds.mjs) that read public/data/blocks.json as the site does. */
export { decodeCatalogue as decodeWire };
