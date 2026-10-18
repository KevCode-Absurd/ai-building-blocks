import { useEffect, useState } from "react";

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
  example: string | null;
  origin: "own" | "rebuilt";
  version: string;
  words: number;
  addon: boolean;
  added: string;
  usedIn: number;
};
export type Catalogue = { built: string; portTypes: Record<string, string | null>; blocks: Block[]; bySlug: Record<string, Block> };
export type AdExample = { id: string; title: string; style: string; format: string; brand: string; w: number; h: number };
export type Examples = { note: string; ads: AdExample[]; formats: { id: string; w: number; h: number }[] };

export const ROLES: { id: Role; name: string; does: string }[] = [
  { id: "source", name: "Source", does: "Brings information in" },
  { id: "compress", name: "Digest", does: "Turns a lot of information into a short, usable summary" },
  { id: "make", name: "Make", does: "Writes the thing" },
  { id: "render", name: "Render", does: "Produces images and video, or the prompts for them" },
  { id: "check", name: "Check", does: "Stops weak work before it moves on" },
  { id: "orchestrate", name: "Orchestrate", does: "Connects blocks and passes work between them" },
];
export const roleName = (r: Role) => ROLES.find((x) => x.id === r)?.name ?? r;

export const JOBS: Record<string, string> = {
  brand: "Brand", research: "Customer research", offer: "Offers", copy: "Copywriting", image: "Images", video: "Video",
  page: "Pages and CRO", ads: "Ads strategy", email: "Email", organic: "Organic", analysis: "Analysis", ops: "Operations",
};
export const LEVELS = ["beginner", "intermediate", "advanced", "expert"] as const;
export const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const PORT_NAMES: Record<string, string> = {
  voc_reviews: "Customer reviews", pdp_copy: "Product page copy", ad_copy: "Ad copy", brand_brain: "Brand brain",
  competitor_set: "Competitor set", reference_set: "Reference ads", ad_breakdowns: "Ad breakdowns", image_prompt: "Image prompt",
  static_ads: "Static ads", video_ads: "Video ads", performance_sheet: "Performance data", audit_report: "Audit report",
};
export const portLabel = (t: string) => PORT_NAMES[t] ?? cap(t.replace(/_/g, " ").replace(/\b(cta|ugc|vsl|cro|pdp|seo|ai)\b/g, (m) => m.toUpperCase()));

let catalogue: Promise<Catalogue> | null = null;
export function loadCatalogue(): Promise<Catalogue> {
  catalogue ??= fetch("/data/blocks.json")
    .then((r) => r.json())
    .then((d) => ({ ...d, bySlug: Object.fromEntries(d.blocks.map((b: Block) => [b.slug, b])) }));
  return catalogue;
}
let examples: Promise<Examples> | null = null;
export function loadExamples(): Promise<Examples> {
  examples ??= fetch("/examples/examples.json").then((r) => r.json());
  return examples;
}

export function useCatalogue() {
  const [c, setC] = useState<Catalogue | null>(null);
  useEffect(() => { loadCatalogue().then(setC); }, []);
  return c;
}
export function useExamples() {
  const [e, setE] = useState<Examples | null>(null);
  useEffect(() => { loadExamples().then(setE); }, []);
  return e;
}

const textCache = new Map<string, Promise<string | null>>();
export function loadSkillText(slug: string, file: "SKILL.md" | "ecommerce.md" = "SKILL.md"): Promise<string | null> {
  const key = `${slug}/${file}`;
  if (!textCache.has(key)) textCache.set(key, fetch(`/skills/${key}`).then((r) => (r.ok ? r.text() : null)).then((t) => (t && !t.trimStart().startsWith("<!doctype") ? t : null)));
  return textCache.get(key)!;
}

export const formatImage = (id: string) => `/examples/formats/${id}.webp`;
export const adImage = (id: string, thumb = true) => `/examples/ads/${id}${thumb ? "-thumb" : ""}.webp`;

/** Blocks whose outputs feed this block's inputs, and blocks this one can feed. */
export function neighbours(c: Catalogue, b: Block) {
  const ins = new Set(b.inputs.map((p) => p.type));
  const outs = new Set(b.outputs.map((p) => p.type));
  const before = c.blocks.filter((x) => x.slug !== b.slug && x.category !== "orchestrator" && x.outputs.some((p) => ins.has(p.type)));
  const after = c.blocks.filter((x) => x.slug !== b.slug && x.category !== "orchestrator" && x.inputs.some((p) => outs.has(p.type)));
  return { before, after };
}
