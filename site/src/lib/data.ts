import { useEffect, useState } from "react";
import { migrateSlugs } from "./store";

export type Port = { type: string; required: boolean };
export type Role = "source" | "compress" | "make" | "render" | "check" | "orchestrate";
export type Block = {
  slug: string;
  name: string;
  summary: string;
  category: "general" | "ecommerce" | "orchestrator";
  boards: string[];
  type: "prompt" | "skill" | "workflow" | "routine" | "agent";
  role: Role;
  job: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  inputs: Port[];
  outputs: Port[];
  uses: string[];
  steps: { uses: string; note: string }[];
  origin: "own" | "rebuilt";
  /** The last test run on the example business, if there was one. */
  tested: { on: string; result: "pass" | "fail"; business: string } | null;
  version: string;
  words: number;
  addon: boolean;
  /** Extra files in the skill's folder, like references/types.md or LICENSE. */
  files: string[];
  /** The same look in the other format (image or video), if the library has it. */
  twin: string | null;
  added: string;
  usedIn: number;
  task: string;
  headline: string;
};
/** The full page for one block, loaded when its page opens. */
export type Page = {
  headline: string; subhead: string; explain: string; when: string[];
  you_give: string[]; you_get: string[]; how_to_use: string[];
  how_it_works: { title: string; text: string }[];
  output_shape?: string;
  example?: { business: string; input: string; output: string };
  tweaks: { what: string; how: string }[]; judge: string[]; test?: string[]; improve: string[];
  terms: { term: string; meaning: string }[];
  /** The AI tools and extra inputs that get the best result from this block. */
  works_best_with?: { tools?: { name: string; why: string }[]; inputs?: string[] };
  /** Public sources the block was built from (item.yaml credits). */
  credits?: { title: string; by: string; url: string; used: string }[];
  /** Markdown already turned into HTML by the index build. */
  html: { explain: string; skill: string; addon: string };
};
export type Catalogue = { built: string; portTypes: Record<string, string | null>; renamed: Record<string, string>; blocks: Block[]; bySlug: Record<string, Block> };

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
/** "2026-10-19" as "19 Oct 2026". */
export const testedOn = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const PORT_NAMES: Record<string, string> = {
  voc_reviews: "Customer reviews", pdp_copy: "Product page copy", ad_copy: "Ad copy", brand_brain: "Brand file",
  competitor_set: "Competitor set", reference_set: "Reference ads", ad_breakdowns: "Ad breakdowns", image_prompt: "Image prompt",
  static_ads: "Image ads", video_ads: "Video ads", performance_sheet: "Performance data", audit_report: "Audit report",
};
export const portLabel = (t: string) => PORT_NAMES[t] ?? cap(t.replace(/_/g, " ").replace(/\b(cta|ugc|vsl|cro|pdp|seo|ai)\b/g, (m) => m.toUpperCase()));

let catalogue: Promise<Catalogue> | null = null;
export function loadCatalogue(): Promise<Catalogue> {
  catalogue ??= fetch("/data/blocks.json")
    .then((r) => r.json())
    .then((d) => { migrateSlugs(d.renamed ?? {}); return { ...d, bySlug: Object.fromEntries(d.blocks.map((b: Block) => [b.slug, b])) }; });
  return catalogue;
}
export function useCatalogue() {
  const [c, setC] = useState<Catalogue | null>(null);
  useEffect(() => { loadCatalogue().then(setC); }, []);
  return c;
}
const textCache = new Map<string, Promise<string | null>>();
export function loadSkillText(slug: string, file = "SKILL.md"): Promise<string | null> {
  const key = `${slug}/${file}`;
  if (!textCache.has(key)) textCache.set(key, fetch(`/skills/${key}`).then((r) => (r.ok ? r.text() : null)).then((t) => (t && !t.trimStart().startsWith("<!doctype") ? t.replace(/\r\n?/g, "\n") : null)));
  return textCache.get(key)!;
}

/** Blocks whose outputs feed this block's inputs, and blocks this one can feed. */
export function neighbours(c: Catalogue, b: Block) {
  const ins = new Set(b.inputs.map((p) => p.type));
  const outs = new Set(b.outputs.map((p) => p.type));
  const before = c.blocks.filter((x) => x.slug !== b.slug && x.category !== "orchestrator" && x.outputs.some((p) => ins.has(p.type)));
  const after = c.blocks.filter((x) => x.slug !== b.slug && x.category !== "orchestrator" && x.inputs.some((p) => outs.has(p.type)));
  return { before, after };
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

/** What a person sees: three kinds, in order of how much they do. */
export type Kind = "prompt" | "skill" | "workflow";
export const KINDS: { id: Kind; name: string; plural: string; path: string; what: string }[] = [
  { id: "prompt", name: "Prompt", plural: "Prompts", path: "prompts", what: "One message you paste into your AI for a quick result." },
  { id: "skill", name: "Skill", plural: "Skills", path: "skills", what: "Instructions you add to your AI once. It follows them step by step and checks its own work." },
  { id: "workflow", name: "Workflow", plural: "Workflows", path: "workflows", what: "Several skills in order. Each one hands its work to the next." },
];
export const kindOf = (b: Block): Kind => (b.category === "orchestrator" || b.type === "workflow" || b.type === "routine" ? "workflow" : b.type === "prompt" ? "prompt" : "skill");
export const kindInfo = (b: Block) => KINDS.find((k) => k.id === kindOf(b))!;
export const pathOf = (b: Block) => `/${kindInfo(b).path}/${b.slug}`;

/** The jobs people hire a block for. Every block is filed under one. */
export const TASKS: { id: string; name: string }[] = [
  { id: "write-ad-copy", name: "Write ad copy" },
  { id: "make-image-ads", name: "Make image ads" },
  { id: "make-video-ads", name: "Make video ads" },
  { id: "plan-ad-tests", name: "Plan what ads to test" },
  { id: "check-ads", name: "Check ads before they go live" },
  { id: "read-ad-results", name: "Read your ad results" },
  { id: "audit-landing-page", name: "Audit a landing page" },
  { id: "write-landing-page", name: "Write and build a landing page" },
  { id: "product-photos", name: "Make product photos" },
  { id: "understand-customers", name: "Understand your customers" },
  { id: "brand-file", name: "Set up your brand file" },
  { id: "study-competitors", name: "Study competitor ads" },
  { id: "make-offer", name: "Make an offer people want" },
  { id: "grow-social", name: "Grow on social" },
  { id: "set-up-ai", name: "Set up AI to work for you" },
];
export const taskOf = (b: Block) => TASKS.find((t) => t.id === b.task) ?? TASKS[0];

const pageCache = new Map<string, Promise<Page | null>>();
export function loadPage(slug: string): Promise<Page | null> {
  if (!pageCache.has(slug)) pageCache.set(slug, fetch(`/data/pages/${slug}.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null));
  return pageCache.get(slug)!;
}

/** The kinds of work, named by what gets done: the first way into the library.
 *  Each one groups a few jobs; a job can sit under more than one. */
export const FUNCTIONS: { id: string; name: string; line: string; tasks: string[] }[] = [
  { id: "copywriter", name: "Write copy that sells", line: "Ads, landing pages and offers", tasks: ["write-ad-copy", "write-landing-page", "make-offer"] },
  { id: "media-buyer", name: "Run Meta ads", line: "Plan tests, get ads approved, read the results", tasks: ["plan-ad-tests", "check-ads", "read-ad-results", "study-competitors"] },
  { id: "ads", name: "Create ads", line: "Image ads and video ads, each with its own skills", tasks: ["make-image-ads", "make-video-ads"] },
  { id: "photos", name: "Make product photos", line: "Photos for your product pages", tasks: ["product-photos"] },
  { id: "cro", name: "Turn visitors into buyers", line: "Check your landing pages and fix what loses sales", tasks: ["audit-landing-page", "write-landing-page"] },
  { id: "strategist", name: "Know your market", line: "Your customers, your brand and your rivals", tasks: ["understand-customers", "brand-file", "study-competitors", "make-offer"] },
  { id: "social", name: "Grow on social", line: "Posts that build an audience", tasks: ["grow-social"] },
  { id: "founder", name: "Set up AI for your business", line: "Your brand file and AI, set up once for every job", tasks: ["set-up-ai", "brand-file"] },
];
/** Old links to the two functions that became "Create ads". */
export const FUNCTION_MOVED: Record<string, string> = { designer: "ads", video: "ads" };
/** Image or video: the two kinds of ad a block can make. Every ad-making block makes one, never both. */
export const formatOf = (b: Block): "image" | "video" | null => (b.task === "make-image-ads" ? "image" : b.task === "make-video-ads" ? "video" : null);
export const functionsOf = (b: Block) => FUNCTIONS.filter((f) => f.tasks.includes(b.task));

/** Which businesses a block suits. Most work for any business; some are only for shops selling physical products. */
export const BUSINESSES: { id: string; name: string; test: (b: Block) => boolean }[] = [
  { id: "any", name: "Works for any business", test: (b) => b.category !== "ecommerce" },
  { id: "store", name: "Online stores", test: (b) => b.category === "ecommerce" || b.addon },
];
