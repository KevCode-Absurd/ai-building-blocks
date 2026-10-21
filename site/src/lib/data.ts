import type { Face } from "./face";
import { useEffect, useState } from "react";
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
  headline: string;
  /** One finished picture made with a prompt like this block's, for visual blocks that have one. */
  look?: { src: string; alt: string };
};
export type PlanLink = { slug: string; name: string; url: string };
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
  headline: string; subhead: string; explain: string; when: string[];
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
export type RosterMind = { slug: string; name: string; area: string; seat: string; living: boolean; built: boolean; face?: Face; labels?: string[] };
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
export type Catalogue = { built: string; portTypes: Record<string, string | null>; renamed: Record<string, string>; minds?: { areas: Record<string, string>; roster: RosterMind[]; labels?: Record<string, string> }; blocks: Block[]; bySlug: Record<string, Block> };

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
    .then((d) => {
      migrateSlugs(d.renamed ?? {});
      // A mind's face is sent once, on the roster, and copied onto its block here.
      const faces = new Map<string, Face | undefined>((d.minds?.roster ?? []).map((m: RosterMind) => [m.slug, m.face]));
      const blocks: Block[] = (d.blocks as Wire[]).map(unwire);
      for (const b of blocks) if (b.type === "mind" && !b.face) b.face = faces.get(b.slug);
      return { ...d, blocks, bySlug: Object.fromEntries(blocks.map((b) => [b.slug, b])) };
    });
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

/** What a person sees: three kinds, in order of how much they do. */
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
  { id: "think-with-minds", name: "Talk it through with great minds" },
  { id: "test-an-idea", name: "Test an idea before you build it" },
  { id: "plan-strategy", name: "Plan your strategy" },
  { id: "build-product", name: "Build a product people want" },
  { id: "build-software", name: "Build and ship software" },
  { id: "sell-and-negotiate", name: "Sell and negotiate" },
  { id: "lead-people", name: "Lead and manage people" },
  { id: "speak-and-persuade", name: "Speak and persuade" },
  { id: "write-and-tell-stories", name: "Write and tell stories" },
  { id: "design-work", name: "Design things people love" },
  { id: "think-and-decide", name: "Think it through and decide" },
  { id: "money-and-investing", name: "Handle money and investing" },
  { id: "work-with-files", name: "Make documents, sheets and slides" },
  { id: "build-websites", name: "Build websites and web apps" },
  { id: "test-and-fix-code", name: "Test and fix code" },
  { id: "ship-and-host", name: "Ship and host your app" },
  { id: "secure-code", name: "Keep your code secure" },
  { id: "connect-tools", name: "Connect AI to your tools" },
  { id: "make-skills", name: "Make your own skills" },
  { id: "make-images", name: "Make images and art" },
  { id: "organise-work", name: "Run meetings, notes and plans" },
  { id: "work-with-audio", name: "Turn speech into text and back" },
  { id: "run-your-store", name: "Run your online store" },
  { id: "get-found-in-search", name: "Get found in search and AI answers" },
  { id: "write-emails", name: "Write emails that get read" },
  { id: "set-prices", name: "Set your prices" },
  { id: "help-customers", name: "Help your customers" },
  { id: "hire-people", name: "Hire and look after your people" },
  { id: "check-contracts", name: "Check contracts and rules" },
  { id: "track-numbers", name: "Track your numbers" },
  { id: "document-work", name: "Write down how work gets done" },
  { id: "research-topics", name: "Research a topic properly" },
  { id: "teach-and-train", name: "Teach and train people" },
  { id: "plan-supply-chain", name: "Plan stock, shipping and suppliers" },
  { id: "find-products", name: "Find products worth selling" },
  { id: "set-up-store", name: "Set up your online store" },
  { id: "speed-up-store", name: "Make your store load fast" },
  { id: "test-store-changes", name: "Test changes to your store" },
  { id: "run-google-ads", name: "Run Google Ads" },
  { id: "launch-and-scale-ads", name: "Launch and scale Meta and TikTok ads" },
  { id: "keep-customers", name: "Keep customers coming back" },
  { id: "sell-on-amazon", name: "Sell on Amazon" },
  { id: "protect-your-store", name: "Keep your store safe" },
];
const TASK_BY_ID = new Map(TASKS.map((t) => [t.id, t]));
export const taskOf = (b: Block) => TASK_BY_ID.get(b.task) ?? TASKS[0];

const pageCache = new Map<string, Promise<Page | null>>();
export function loadPage(slug: string): Promise<Page | null> {
  if (!pageCache.has(slug)) pageCache.set(slug, fetch(`/data/pages/${slug}.json`).then((r) => (r.ok ? r.json() : null)).catch(() => null));
  return pageCache.get(slug)!;
}

/** The kinds of work, named by what gets done: the first way into the library.
 *  Each one groups a few jobs; a job can sit under more than one. */
export const FUNCTIONS: { id: string; name: string; line: string; tasks: string[] }[] = [
  { id: "copywriter", name: "Write copy that sells", line: "Ads, landing pages and offers", tasks: ["write-ad-copy", "write-landing-page", "make-offer", "write-emails"] },
  { id: "media-buyer", name: "Run Meta ads", line: "Plan tests, get ads approved, read the results", tasks: ["plan-ad-tests", "launch-and-scale-ads", "check-ads", "read-ad-results", "study-competitors"] },
  { id: "google-ads", name: "Run Google Ads", line: "Shopping, Performance Max, Search and your product feed", tasks: ["run-google-ads"] },
  { id: "retention", name: "Keep customers buying", line: "Email, text messages, subscriptions and what happens after the order", tasks: ["keep-customers", "write-emails"] },
  { id: "ads", name: "Create ads", line: "Image ads and video ads, each with its own skills", tasks: ["make-image-ads", "make-video-ads"] },
  { id: "photos", name: "Make product photos", line: "Photos for your product pages", tasks: ["product-photos"] },
  { id: "cro", name: "Turn visitors into buyers", line: "Check your landing pages and fix what loses sales", tasks: ["audit-landing-page", "write-landing-page", "test-store-changes", "speed-up-store"] },
  { id: "strategist", name: "Know your market", line: "Your customers, your brand and your rivals", tasks: ["understand-customers", "brand-file", "study-competitors", "make-offer"] },
  { id: "social", name: "Grow on social", line: "Posts that build an audience", tasks: ["grow-social"] },
  { id: "founder", name: "Set up AI for your work", line: "Your brand file and AI, set up once for every job", tasks: ["set-up-ai", "brand-file"] },
  { id: "minds", name: "Think with great minds", line: "Borrow one mind's thinking, or seat a council", tasks: ["think-with-minds"] },
  { id: "validator", name: "Test your idea", line: "Talk to customers before you build", tasks: ["test-an-idea", "understand-customers"] },
  { id: "strategy", name: "Plan your strategy", line: "Where to play, how to win, and the money", tasks: ["plan-strategy", "money-and-investing", "set-prices"] },
  { id: "product", name: "Build a product", line: "Products and software people use", tasks: ["build-product", "build-software"] },
  { id: "seller", name: "Sell more", line: "Sell, negotiate and win people over", tasks: ["sell-and-negotiate", "speak-and-persuade"] },
  { id: "leader", name: "Lead people", line: "Run a team, a meeting or a company", tasks: ["lead-people", "speak-and-persuade"] },
  { id: "writer", name: "Write and tell stories", line: "Books, essays, scripts and talks", tasks: ["write-and-tell-stories"] },
  { id: "maker", name: "Design things", line: "Products, brands and pages people love", tasks: ["design-work", "make-images"] },
  { id: "thinker", name: "Think it through", line: "Hard problems, big decisions, new ideas", tasks: ["think-and-decide"] },
  { id: "developer", name: "Build and code", line: "Websites, apps and the code behind them", tasks: ["build-software", "build-websites", "test-and-fix-code", "ship-and-host", "secure-code"] },
  { id: "files", name: "Work with files", line: "Documents, sheets, slides and PDFs", tasks: ["work-with-files"] },
  { id: "connector", name: "Connect your tools", line: "Plug AI into the apps you use, or make your own skills", tasks: ["connect-tools", "make-skills", "set-up-ai"] },
  { id: "office", name: "Run your work", line: "Meetings, notes, plans and audio", tasks: ["organise-work", "work-with-audio", "document-work"] },
  { id: "store", name: "Run your store", line: "Orders, stock, prices and payouts", tasks: ["set-up-store", "run-your-store", "set-prices", "sell-on-amazon", "protect-your-store"] },
  { id: "search", name: "Get found", line: "Search, AI answers and listings", tasks: ["get-found-in-search"] },
  { id: "support", name: "Help your customers", line: "Replies, help pages and problems sorted fast", tasks: ["help-customers", "write-emails"] },
  { id: "people", name: "Hire and look after people", line: "Job posts, interviews, pay and reviews", tasks: ["hire-people", "lead-people"] },
  { id: "legal", name: "Check contracts and rules", line: "Contracts, NDAs and compliance, checked before a lawyer", tasks: ["check-contracts"] },
  { id: "analyst", name: "Track your numbers", line: "Books, reports, dashboards and data", tasks: ["track-numbers", "read-ad-results", "money-and-investing"] },
  { id: "researcher", name: "Research anything", line: "Sources found, read, checked and written up", tasks: ["research-topics"] },
  { id: "teacher", name: "Teach and train", line: "Lessons, courses, quizzes and feedback", tasks: ["teach-and-train"] },
  { id: "supply", name: "Run your supply chain", line: "Stock, suppliers, shipping and routes", tasks: ["find-products", "plan-supply-chain", "run-your-store"] },
];

/** The broad areas above the groups (docs/MINDS-PRD.md §3). A group can sit in more than one; a mind sits in its own areas. */
export const AREAS: { id: string; name: string; fns: string[] }[] = [
  { id: "marketing", name: "Marketing", fns: ["copywriter", "media-buyer", "google-ads", "ads", "cro", "retention", "strategist", "social", "search"] },
  { id: "design", name: "Design", fns: ["ads", "photos", "maker", "product"] },
  { id: "business", name: "Business", fns: ["strategist", "founder", "validator", "strategy", "product", "minds", "files", "office", "store", "support", "legal", "analyst", "supply"] },
  { id: "sales", name: "Sales", fns: ["seller", "validator", "support"] },
  { id: "leadership", name: "Leadership", fns: ["leader", "strategy", "people"] },
  { id: "writing", name: "Writing", fns: ["copywriter", "writer"] },
  { id: "arts", name: "Arts", fns: ["writer", "maker"] },
  { id: "coding", name: "Coding", fns: ["product", "developer", "connector"] },
  { id: "science", name: "Science", fns: ["thinker", "researcher"] },
  { id: "teaching", name: "Teaching", fns: ["teacher", "researcher"] },
  { id: "thinking", name: "Thinking", fns: ["thinker", "minds"] },
];
// Worked out once per job, not once per block per keystroke: the library asks these for every block, many times a second.
const AREAS_BY_TASK = new Map<string, string[]>();
export const areasOf = (b: Block): string[] => {
  if (b.type === "mind") return [b.area ?? "", ...(b.also ?? [])].filter(Boolean);
  let r = AREAS_BY_TASK.get(b.task);
  if (!r) AREAS_BY_TASK.set(b.task, (r = AREAS.filter((a) => a.fns.some((f) => FUNCTIONS.find((x) => x.id === f)?.tasks.includes(b.task))).map((a) => a.id)));
  return r;
};
/** Old links to the two functions that became "Create ads". */
export const FUNCTION_MOVED: Record<string, string> = { designer: "ads", video: "ads" };
/** Image or video: the two kinds of ad a block can make. Every ad-making block makes one, never both. */
export const formatOf = (b: Block): "image" | "video" | null => (b.task === "make-image-ads" ? "image" : b.task === "make-video-ads" ? "video" : null);
const VIDEO_OUT = new Set(["video_prompt", "video_ads"]);
const IMAGE_OUT = new Set(["image_prompt", "avatar_sheet", "static_ads", "photo_set", "pdp_images", "upscaled_image"]);
/** What a block needs a picture or video tool for, since Claude writes prompts but can't draw.
 *  Same rule as tools/add-making-it.mjs, which adds the matching note to the SKILL.md. */
export const rendersOf = (b: Block): "image" | "video" | null =>
  b.outputs.some((o) => VIDEO_OUT.has(o.type)) ? "video" : b.outputs.some((o) => IMAGE_OUT.has(o.type)) ? "image" : null;
const FNS_BY_TASK = new Map<string, typeof FUNCTIONS>();
export const functionsOf = (b: Block) => {
  let r = FNS_BY_TASK.get(b.task);
  if (!r) FNS_BY_TASK.set(b.task, (r = FUNCTIONS.filter((f) => f.tasks.includes(b.task))));
  return r;
};


/** The paid service a block needs, from its "paid:<service>" warning, or "". */
export const paidService = (b: { warnings?: string[] }) => b.warnings?.find((w) => w.startsWith("paid:"))?.slice(5) ?? "";

/** Where an imported skill came from (item.yaml `source`). The library list only carries `by`; the rest comes with the page. */
export type Source = { by: string; repo?: string; url?: string; licence?: string; original?: string; commit?: string };
