// The job menu: the most-requested jobs, each with a spec, rubric, price band and plain-AI baseline.
// Data lives in data/*.json (one file per group of areas); this file only loads and serves it.
import type { JobType } from "../../core/types.ts";
import j1 from "./data/jobs-marketing-content.json" with { type: "json" };
import j2 from "./data/jobs-sales-ecommerce-support.json" with { type: "json" };
import j3 from "./data/jobs-research-product.json" with { type: "json" };
import j4 from "./data/jobs-finance-people-operations.json" with { type: "json" };

let ALL: JobType[] = [j1, j2, j3, j4].flat() as JobType[];
let BY_ID = new Map(ALL.map(jt => [jt.id, jt]));

/** Tests only: replace the menu with fixtures (test/fixtures.ts). */
export function setCatalogueForTests(list: JobType[]): void { ALL = list; BY_ID = new Map(list.map(jt => [jt.id, jt])); }

function fnv1a(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, "0");
}

/** Changes whenever any job type changes. Jobs record the version they were quoted on. */
export const CATALOGUE_VERSION = `cat-${ALL.length}-${fnv1a(JSON.stringify(ALL))}`;

export function listJobTypes(): JobType[] { return ALL; }
export function getJobType(id: string | null | undefined): JobType | null { return (id && BY_ID.get(id)) || null; }

/** What buyers and experts may see: no hidden briefs, no baseline prompt. */
export function publicJobType(jt: JobType) {
  const { baseline_prompt: _b, sample_briefs, demand_sources: _d, ...rest } = jt;
  return { ...rest, sample_briefs: sample_briefs.filter(b => b.visibility === "public") };
}

export function jobTypeSummary(jt: JobType) {
  return { id: jt.id, title: jt.title, summary: jt.summary, area: jt.area, deliverable: jt.deliverable, turnaround_hours: jt.turnaround_hours, price_from_usd: jt.price.min_usd, price_base_usd: jt.price.base_usd };
}
