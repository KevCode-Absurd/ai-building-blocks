// What comes after a block, and what comes before it. Shared by the block page plan (tools/lib/needs.mjs,
// at build time) and the builder's "add next" suggestions (lib/suggest.ts). Plain code: same catalogue, same answer.
//
// Evidence, strongest first:
//   1. a reviewed workflow runs the other block straight after this one, or the other block is built on this one (uses);
//   2. the other block takes a specific thing this one makes (ad copy, a script, a skill file);
//   3. both do the same job, and their names and descriptions are about the same subject.
// Moving from one job to another (ad copy to its check, a cash forecast to the books) needs backing from the reviewed
// workflows: how often that job's blocks run straight after this job's (jobFlow). Without it, a link to another job
// needs a specific hand-off and the same subject.
// A generic hand-off (a brief, a document, a spreadsheet, a report) alone is not evidence: nearly every block takes or
// makes one, so it only counts within the same job and subject, or between jobs the workflows connect. The same goes
// for types read in many different jobs (results, product facts, a brand brain).
// Links much weaker than the best one are left off: a short list of real next steps beats five loose ones.
import { AREAS, FUNCTIONS } from "./catalogue-taxonomy.mjs";

/** Port types too general to link two blocks on their own. */
export const GENERIC_PORTS = new Set(["brief", "question", "source_text", "document", "plan", "spreadsheet", "audit_report", "feedback_notes", "shortlist", "copy_draft", "codebase", "code_change", "mind_view", "image"]);
const STOP = new Set("a an and the for of to in on with from by your you their its it this that these those into out over under about as at be is are can get make makes made one two three each every any all more most less than then when what which who how why use using used work job jobs ready step steps plan planner checker writer builder maker reviewer review check write build list share paste give gives say tell name based clear short simple new real own".split(" "));
const stem = (w) => w.length > 5 && w.endsWith("ies") ? w.slice(0, -3) + "y" : w.length > 5 && /(ing|ers|ed)$/.test(w) ? w.replace(/(ing|ers|ed)$/, "") : w.length > 4 && /[^s]s$/.test(w) ? w.slice(0, -1) : w;
export const subjectWords = (text) => [...new Set(String(text ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ").filter((w) => w.length > 2 && !STOP.has(w)).map(stem))];

/** The families a job belongs to: its broad areas, leaving out "Business", which holds half the library. */
const FAMILY = new Map();
export function familiesOf(task) {
  let found = FAMILY.get(task);
  if (!found) {
    const fns = FUNCTIONS.filter((fn) => fn.tasks.includes(task)).map((fn) => fn.id);
    const areas = AREAS.filter((a) => a.fns.some((id) => fns.includes(id))).map((a) => a.id);
    found = new Set(areas.filter((a) => a !== "business").length ? areas.filter((a) => a !== "business") : areas.length ? areas : [task]);
    FAMILY.set(task, found);
  }
  return found;
}
export const sameFamily = (a, b) => a === b || [...familiesOf(a)].some((f) => familiesOf(b).has(f));
const typeOf = (p) => (typeof p === "string" ? p.replace(/\?$/, "") : p.type);
const required = (p) => (typeof p === "string" ? !p.endsWith("?") : p.required !== false);
const isTested = (b) => b.tested === 1 || b.tested?.result === "pass";
const stepSlug = (s) => (typeof s === "string" ? s : Array.isArray(s) ? s[0] : s.uses);

const CONTEXT = new WeakMap();
const bump = (map, a, b, by = 1) => { let m = map.get(a); if (!m) map.set(a, (m = new Map())); m.set(b, (m.get(b) ?? 0) + by); };
const isFlow = (b) => b.category === "orchestrator" || b.type === "workflow" || b.type === "routine";
/** The catch-all job: items in it are linked only by a workflow, a build-on or a specific hand-off. */
const CATCH_ALL = "set-up-ai";
/** A port type read in more than this many jobs counts as a loose hand-off, like the generic ones. */
const BROAD_JOBS = 20;
/**
 * Per-catalogue facts, worked out once: subject words with their rarity, which block follows which in workflows,
 * which blocks are built on which, how work moves between jobs, and which port types many jobs read.
 */
function context(all) {
  let c = CONTEXT.get(all);
  if (c) return c;
  const words = new Map(), df = new Map(), follows = new Map(), later = new Map(), bySlug = new Map(all.map((b) => [b.slug, b]));
  for (const b of all) {
    if (b.type === "mind") continue;
    const w = subjectWords(`${b.name} ${(b.aliases ?? []).join(" ")} ${b.summary}`);
    words.set(b.slug, w);
    for (const t of w) df.set(t, (df.get(t) ?? 0) + 1);
  }
  for (const b of all) {
    const steps = (b.steps ?? []).map(stepSlug).filter((s) => bySlug.has(s));
    steps.forEach((s, i) => {
      if (steps[i + 1] && steps[i + 1] !== s) bump(follows, s, steps[i + 1]);
      for (const after of steps.slice(i + 2)) if (after !== s) bump(later, s, after);
    });
  }
  // The same hand-offs one level up: how often one job's blocks run straight after another job's in reviewed
  // workflows, plus blocks built on a block of another job (a skill that uses another skill's result).
  const jobs = new Map(), jobOut = new Map(), usedBy = new Map();
  const move = (from, to, times) => { bump(jobs, from, to, times); jobOut.set(from, (jobOut.get(from) ?? 0) + times); };
  for (const [from, after] of follows) for (const [to, times] of after) move(bySlug.get(from).task, bySlug.get(to).task, times);
  for (const x of all) {
    if (isFlow(x) || x.type === "mind") continue;
    for (const u of x.uses ?? []) {
      const from = bySlug.get(u);
      if (!from || from.slug === x.slug) continue;
      move(from.task, x.task, 1);
      let m = usedBy.get(u);
      if (!m) usedBy.set(u, (m = new Set()));
      m.add(x.slug);
    }
  }
  // How many different jobs read each port type: a type read across many jobs (results, product facts) says little alone.
  const readers = new Map();
  for (const b of all) {
    if (b.type === "mind" || isFlow(b)) continue;
    for (const p of b.inputs ?? []) { const t = typeOf(p); let m = readers.get(t); if (!m) readers.set(t, (m = new Set())); m.add(b.task); }
  }
  const broad = new Set([...readers].filter(([, m]) => m.size > BROAD_JOBS).map(([t]) => t));
  const n = Math.max(1, words.size), idf = (t) => Math.log(1 + n / (1 + (df.get(t) ?? 0)));
  const norm = new Map([...words].map(([slug, w]) => [slug, Math.sqrt(w.reduce((s, t) => s + idf(t) ** 2, 0)) || 1]));
  c = { words, idf, norm, follows, later, bySlug, jobs, jobOut, usedBy, broad };
  CONTEXT.set(all, c);
  return c;
}

/** How much two blocks are about the same subject, 0 to 1 (rarity-weighted overlap of name, alias and summary words). */
export function subjectSimilarity(a, b, all) {
  const { words, idf, norm } = context(all);
  const wa = words.get(a.slug), wb = new Set(words.get(b.slug) ?? []);
  if (!wa || !wb.size) return 0;
  let dot = 0;
  for (const t of wa) if (wb.has(t)) dot += idf(t) ** 2;
  return dot / (norm.get(a.slug) * norm.get(b.slug));
}

/** Blocks that came straight before this one in reviewed workflows, most often first. */
export function workflowPredecessors(b, all) {
  const { follows, bySlug } = context(all), found = [];
  for (const [from, after] of follows) if (after.has(b.slug)) found.push({ x: bySlug.get(from), times: after.get(b.slug) });
  return found.filter((f) => f.x).sort((p, q) => q.times - p.times || p.x.slug.localeCompare(q.x.slug));
}

/** Prior weight of staying in the same job, so jobs with few reviewed workflows still favour their own blocks. */
const STAY = 4;
/** How often work moves from job `a` to job `b` in reviewed workflows, 0 to 1 (staying in the job counts STAY extra times). */
export function jobFlow(a, b, all) {
  const { jobs, jobOut } = context(all);
  return ((jobs.get(a)?.get(b) ?? 0) + (a === b ? STAY : 0)) / ((jobOut.get(a) ?? 0) + STAY);
}

const CREATIVE = new Set(["hooks", "ad_copy", "script", "static_ads", "video_ads", "landing_page", "pdp_copy", "email_flow", "image_prompt", "video_prompt"]);
/** The workflow evidence a link to another job needs: that job's share of this job's hand-offs (jobFlow). */
const MOVES = 0.05;
/** A link is shown only when its score is at least this share of the best link's score (option `floor`; 0 keeps every candidate). */
const FLOOR = 0.5;
/** With no strong link, at most this many weaker ones (same family and subject). */
const FALLBACK = 2;
/**
 * The blocks to suggest after `b`, best first: [{ x, score, follows, takes, why }].
 * `outs` may add result types the block's own outputs stand for (the brand brain's parts).
 * @param {any} b
 * @param {any[]} all
 * @param {{ max?: number, perTask?: number, floor?: number, exclude?: (x: any) => boolean, outs?: string[], startHere?: string[] }} [options]
 * @returns {{ x: any, score: number, follows: number, takes: string[], why: string }[]}
 */
export function nextSteps(b, all, { max = 5, perTask = 3, floor = FLOOR, exclude = () => false, outs: extraOuts = [], startHere = [] } = {}) {
  const ctx = context(all);
  const outs = new Set([...(b.outputs ?? []).map(typeOf), ...extraOuts]);
  const creative = [...outs].some((t) => CREATIVE.has(t)) || (b.outputs ?? []).some((p) => typeOf(p) === "copy_draft" && sameFamily(b.task, "write-ad-copy"));
  const direct = ctx.follows.get(b.slug), later = ctx.later.get(b.slug), builtOnThis = ctx.usedBy.get(b.slug), before = new Set(b.uses ?? []);
  const loose = (p) => GENERIC_PORTS.has(typeOf(p)) || ctx.broad.has(typeOf(p));
  const strong = [], weak = [];
  for (const x of all) {
    if (x.slug === b.slug || x.type === "mind" || isFlow(x) || x.twin === b.slug || exclude(x)) continue;
    const follows = direct?.get(x.slug) ?? 0, after = later?.get(x.slug) ?? 0;
    // A block built on this one ("uses" it) comes after it; one this block is built on comes before it.
    const builtOn = builtOnThis?.has(x.slug) ? 1 : 0;
    if (!follows && before.has(x.slug)) continue;
    const inputs = x.inputs ?? [];
    const takes = inputs.filter((p) => outs.has(typeOf(p)));
    if (!follows && !builtOn && !after && !takes.length && x.task !== b.task) continue;
    const specific = takes.filter((p) => !loose(p)).reduce((s, p) => s + (required(p) ? 3 : 1), 0);
    const generic = takes.filter(loose).reduce((s, p) => s + (GENERIC_PORTS.has(typeOf(p)) ? 1 : 1.5), 0);
    // "Set up AI" holds unrelated set-ups (a study plan, a server plan), so sharing it is no evidence on its own.
    const catchAll = b.task === CATCH_ALL && x.task === CATCH_ALL;
    const sameTask = x.task === b.task && !catchAll, family = !catchAll && sameFamily(b.task, x.task), flow = jobFlow(b.task, x.task, all);
    const sim = subjectSimilarity(b, x, all);
    const linked = follows > 0 || builtOn > 0 || (after > 0 && family)
      || (specific > 0 && (sameTask || (flow >= MOVES && sim >= 0.02) || sim >= 0.12))
      || (generic > 0 && ((sameTask && sim >= 0.05) || (family && flow >= MOVES && sim >= 0.1)))
      || (sameTask && sim >= 0.2);
    const fallback = !linked && ((specific > 0 && family && sim >= 0.04) || (generic > 0 && family && sim >= 0.1) || (sameTask && sim >= 0.1));
    if (!linked && !fallback) continue;
    // A check of an ad or a page only follows something people will see.
    if (!creative && !follows && !builtOn && (x.task === "check-ads" || x.task === "audit-landing-page")) continue;
    const missing = inputs.filter((p) => required(p) && !outs.has(typeOf(p))).length;
    const score = Math.min(follows, 3) * 6 + builtOn * 8 + Math.min(after, 2) * 2 + specific + generic + sim * 25 + (sameTask ? 3 : family ? 1 : 0) + flow * 10
      + (isTested(x) ? 1.5 : 0) + Math.min((Array.isArray(x.usedIn) ? x.usedIn.length : Number(x.usedIn)) || 0, 5) * 0.3 - missing * 0.5 + (x.type === "agent" ? -1 : 0)
      + (startHere.includes(x.slug) ? 1 : 0) + (creative && x.task === "check-ads" ? 4 : 0)
      // A check that reads what a maker made is the usual next step after it.
      + (b.role !== "check" && x.role === "check" && takes.length ? 2 : 0);
    (linked ? strong : weak).push({ x, score, follows, takes: takes.map(typeOf), why: follows ? "follows" : specific || generic ? "takes" : "same job" });
  }
  const order = (p, q) => q.score - p.score || p.x.slug.localeCompare(q.x.slug);
  // With no strong link, the best weaker ones (same family and subject) still give the page somewhere to go.
  const pool = strong.length ? strong.sort(order) : weak.sort(order).slice(0, FALLBACK);
  const perJob = new Map(), picked = [];
  for (const s of pool) {
    if (picked.length >= max || (picked.length && s.score < floor * picked[0].score)) break;
    const n = perJob.get(s.x.task) ?? 0;
    if (n >= perTask) continue;
    perJob.set(s.x.task, n + 1);
    picked.push(s);
  }
  return picked;
}
