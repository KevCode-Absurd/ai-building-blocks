// The AI tools section's data: public/data/ai-tools.json, written by scripts/build-ai-tools.mjs from catalogue-items/ai-tools/*.yaml.
// Fetched once, when someone first opens /ai-tools, and kept for the rest of the visit.
import { useEffect, useState } from "react";

export type PricingModel = "free" | "freemium" | "subscription" | "usage" | "enterprise";
export type Named = { id: string; name: string; blurb: string };
export type ToolBlock = { slug: string; name: string; path: string };
export type Tool = {
  slug: string;
  name: string;
  maker: string;
  url: string;
  promise: string;
  useCases: string[];
  categories: string[];
  does: string[];
  benefits: string[];
  bestFor: string[];
  notFor: string[];
  pricing: { model: PricingModel; from: string; note: string };
  worksWith: { slug?: string; name: string }[];
  runsIn: string[];
  blocks: ToolBlock[];
  alternatives: string[];
  lastChecked: string;
  sources: string[];
};
export type AiTools = {
  built: string;
  useCases: Named[];
  categories: Named[];
  tools: Tool[];
  bySlug: Record<string, Tool>;
  useCaseName: Record<string, string>;
  categoryName: Record<string, string>;
};

export const PRICING: { id: PricingModel; name: string; what: string }[] = [
  { id: "free", name: "Free", what: "Nothing to pay." },
  { id: "freemium", name: "Free plan", what: "A free plan to start, paid plans for more." },
  { id: "subscription", name: "Monthly plan", what: "A set price per month or per seat." },
  { id: "usage", name: "Pay as you go", what: "You pay for what you use." },
  { id: "enterprise", name: "Quote only", what: "Priced per company. Ask for a quote." },
];
export const pricingName = (m: PricingModel) => PRICING.find((p) => p.id === m)?.name ?? m;
export const RUNS_IN: Record<string, string> = { web: "Web", desktop: "Desktop app", mobile: "Phone app", api: "API", "browser-extension": "Browser extension", slack: "Slack", chrome: "Chrome" };
export const runsInName = (r: string) => RUNS_IN[r] ?? r;
/** "2026-10-21" as "Oct 2026". */
export const monthOf = (iso: string) => new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
/** "US$20 per month" shortened for a card: "US$20/mo". */
export const shortPrice = (from: string) => from.replace(/\s+per\s+month\b/i, "/mo").replace(/\s+per\s+year\b/i, "/yr").replace(/\s+per\s+(seat|user)\b/i, "/seat");

let loading: Promise<AiTools> | null = null;
export function loadAiTools(): Promise<AiTools> {
  loading ??= fetch("/data/ai-tools.json")
    .then((r) => { if (!r.ok) throw new Error(`ai-tools.json: ${r.status}`); return r.json(); })
    .then((d: Omit<AiTools, "bySlug" | "useCaseName" | "categoryName">) => ({
      ...d,
      bySlug: Object.fromEntries(d.tools.map((t) => [t.slug, t])),
      useCaseName: Object.fromEntries(d.useCases.map((u) => [u.id, u.name])),
      categoryName: Object.fromEntries(d.categories.map((c) => [c.id, c.name])),
    }))
    .catch((e) => { loading = null; throw e; });
  return loading;
}
/** null while loading, false when the file could not be read, else the data. */
export function useAiTools(): AiTools | null | false {
  const [d, setD] = useState<AiTools | null | false>(null);
  useEffect(() => { let on = true; loadAiTools().then((x) => on && setD(x), () => on && setD(false)); return () => { on = false; }; }, []);
  return d;
}

/** Plain-text search over the fields a visitor would type: name, maker, promise, use cases, what it does. */
export function matches(t: Tool, d: AiTools, q: string) {
  if (!q) return true;
  const hay = [t.name, t.maker, t.promise, ...t.useCases.map((u) => d.useCaseName[u]), ...t.categories.map((c) => d.categoryName[c]), ...t.does, ...t.bestFor, ...t.worksWith.map((w) => w.name)].join(" ").toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w));
}
