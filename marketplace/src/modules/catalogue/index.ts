// The job menu: the most-requested jobs, each with a spec, rubric, price band and plain-AI baseline.
// Data lives in data/*.json (one file per group of areas); this file only loads and serves it.
import type { JobType } from "../../core/types.ts";
import j1 from "./data/jobs-marketing-content.json" with { type: "json" };
import j2 from "./data/jobs-sales-ecommerce-support.json" with { type: "json" };
import j3 from "./data/jobs-research-product.json" with { type: "json" };
import j4 from "./data/jobs-finance-people-operations.json" with { type: "json" };
import j5 from "./data/jobs-added-1.json" with { type: "json" };
import j6 from "./data/jobs-added-2.json" with { type: "json" };
import j7 from "./data/jobs-added-3.json" with { type: "json" };
import j8 from "./data/jobs-added-4.json" with { type: "json" };
import j9 from "./data/jobs-added-5.json" with { type: "json" };
import j10 from "./data/jobs-added-6.json" with { type: "json" };
import j11 from "./data/jobs-added-7.json" with { type: "json" };
import j12 from "./data/jobs-added-8.json" with { type: "json" };
import j13 from "./data/jobs-added-9.json" with { type: "json" };
import j14 from "./data/jobs-added-10.json" with { type: "json" };
import j15 from "./data/jobs-added-11.json" with { type: "json" };
import j16 from "./data/jobs-added-12.json" with { type: "json" };

let ALL: JobType[] = [j1, j2, j3, j4, j5, j6, j7, j8, j9, j10, j11, j12, j13, j14, j15, j16].flat() as JobType[];
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

/** Faster delivery can be chosen when the job type allows it (its band has a rush multiplier above 1). */
export const fasterAvailable = (jt: JobType) => (jt.price.rush_multiplier ?? 1) > 1;

/**
 * Our own pricing words in the menu's field help and limits, rewritten for free hiring: the data still says "Base price
 * covers 10" (it describes the size the price band includes) and "one feature per order". Buyers read "One job covers
 * 10" and "one feature per job". Money in the buyer's own business ("cost per order", "prices") is left alone.
 */
export function buyerWords(text: string): string {
  return text
    .replace(/\bBase price covers\b/g, "One job covers")
    .replace(/\bbase price covers\b/g, "one job covers")
    .replace(/\binto (several|separate|more) orders\b/g, "into $1 jobs")
    .replace(/\bone (\w+) per order\b/g, "one $1 per job");
}

/**
 * What buyers and experts may see: no hidden briefs, no baseline prompt, and no price. Hiring is free, so the price
 * band stays internal (it still sizes drafts in the runner); buyers only see whether faster delivery is offered.
 */
export function publicJobType(jt: JobType) {
  const { baseline_prompt: _b, sample_briefs, demand_sources: _d, price: _p, spec_fields, not_for, ...rest } = jt;
  return {
    ...rest,
    spec_fields: spec_fields.map(f => (f.help ? { ...f, help: buyerWords(f.help) } : f)),
    not_for: not_for.map(buyerWords),
    faster_available: fasterAvailable(jt),
    sample_briefs: sample_briefs.filter(b => b.visibility === "public"),
  };
}

/** A job type in a list: what the buyer gets and how long it takes. Never a price. */
export function jobTypeSummary(jt: JobType) {
  return { id: jt.id, title: jt.title, summary: jt.summary, area: jt.area, deliverable: jt.deliverable, turnaround_hours: jt.turnaround_hours };
}
