// What comes after a block, and what comes before it. Shared by the block page plan (tools/lib/needs.mjs,
// at build time) and the builder's "add next" and "add before" suggestions (lib/suggest.ts and the before side, through
// previousSteps). One ranking for both directions (handoffLink). Plain code: same catalogue, same answer.
//
// Evidence, strongest first:
//   1. a reviewed workflow runs the other block straight after this one, or the other block is built on this one (uses);
//   2. the other block needs a specific thing this one makes (ad copy, a script, a skill file), most when it can't
//      start without it;
//   3. both do the same job, and their names and descriptions are about the same subject.
// What a block hands back must match what the next one takes: a sibling with nothing to take (another translator) is
// scored down and only shown when fewer than two real hand-offs exist, and "takes" names only real port matches.
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
  // Who could be linked at all, by what links them: readers and makers of each port type, the blocks of each job.
  const list = (map, key, x) => { let l = map.get(key); if (!l) map.set(key, (l = [])); if (l[l.length - 1] !== x) l.push(x); };
  const readersOf = new Map(), makersOf = new Map(), byTask = new Map();
  for (const x of all) {
    if (x.type === "mind") continue;
    for (const p of x.inputs ?? []) list(readersOf, typeOf(p), x);
    for (const t of handsOver(x)) list(makersOf, t, x);
    list(byTask, x.task, x);
  }
  c = { words, idf, norm, follows, later, bySlug, jobs, jobOut, usedBy, broad, readersOf, makersOf, byTask };
  CONTEXT.set(all, c);
  return c;
}

/** A port type too loose to link two blocks alone: a generic one, or one read in many different jobs. */
export const isLoosePort = (type, all) => GENERIC_PORTS.has(type) || context(all).broad.has(type);

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
/** Score for each specific thing the other block needs to start and this one makes; LOOSE for a generic or stand-in one. */
const SPECIFIC = 6, LOOSE = 2.5;
/** Taken off a link with nothing to hand over (no input of the other block is made here). */
const NO_HANDOFF = 5;
/** With this many real hand-offs (or workflow links) on the list, siblings with nothing to hand over are left off. */
const SIBLINGS_UNTIL = 2;
/** The result types a block hands over: its outputs and `extra` types they contain. */
const madeOf = (b, extra = []) => new Set([...(b.outputs ?? []).map(typeOf), ...extra]);
/** Types a result holds as parts: a brand brain holds the products and buyers. */
export const PARTS = { brand_brain: ["product_data", "persona"] };
/** What a block hands over, with the parts of what it makes (a brand brain builder hands over product data too). */
export function handsOver(b) {
  const made = madeOf(b);
  for (const t of [...made]) for (const part of PARTS[t] ?? []) made.add(part);
  return made;
}
/** Whether `to` only makes again the specific things `from` already makes (loose results like a plan do not count). */
const remakes = (from, to, made) => {
  const outs = (to.outputs ?? []).map(typeOf).filter((t) => !GENERIC_PORTS.has(t));
  return outs.length > 0 && outs.every((t) => made.has(t));
};
const usedCount = (x) => Math.min((Array.isArray(x.usedIn) ? x.usedIn.length : Number(x.usedIn)) || 0, 5);
/** A candidate's own merits, whichever side it is suggested on: tested, used in workflows, not an agent. */
export const candidateMerit = (x) => (isTested(x) ? 1.5 : 0) + usedCount(x) * 0.3 + (x.type === "agent" ? -1 : 0);

/**
 * How well `from` leads into `to`: the one ranking behind "what comes next" (nextSteps) and "what comes before"
 * (previousSteps, the builder's before-steps). Evidence, strongest first: `from` runs straight before `to` in a reviewed
 * workflow, `to` is built on `from`, `to` needs a specific thing `from` makes, then generic or stand-in hand-offs and
 * the same job and subject. `made`: the types `from` hands over (default: its outputs); `alike`: types they can stand
 * in for. Returns null when nothing links them, else { score, linked, takes, hands, follows, why }: `linked` false is a
 * weaker fallback link (same family and subject); `takes`, the inputs of `to` that `from` really makes, strongest first;
 * `hands`, whether anything is handed over (a port, a build-on or a workflow step). The candidate's own merits
 * (candidateMerit) are not included.
 * @param {any} from
 * @param {any} to
 * @param {any[]} all
 * @param {{ made?: Set<string>, alike?: Set<string>, creative?: boolean }} [options]
 * @returns {{ score: number, linked: boolean, takes: string[], hands: boolean, follows: number, why: string } | null}
 */
export function handoffLink(from, to, all, { made = madeOf(from), alike = new Set(), creative } = {}) {
  const ctx = context(all);
  const follows = ctx.follows.get(from.slug)?.get(to.slug) ?? 0, after = ctx.later.get(from.slug)?.get(to.slug) ?? 0;
  // A block built on this one ("uses" it) comes after it; one this block is built on comes before it.
  const builtOn = ctx.usedBy.get(from.slug)?.has(to.slug) ? 1 : 0;
  if (!follows && (from.uses ?? []).includes(to.slug)) return null;
  const inputs = to.inputs ?? [];
  const takes = inputs.filter((p) => made.has(typeOf(p)));
  const stands = inputs.filter((p) => alike.has(typeOf(p)) && !made.has(typeOf(p)));
  if (!follows && !builtOn && !after && !takes.length && !stands.length && to.task !== from.task) return null;
  const loose = (p) => GENERIC_PORTS.has(typeOf(p)) || ctx.broad.has(typeOf(p));
  // After a reviewed workflow, the hand-off is the strongest evidence: a specific thing the other block needs to start
  // counts most; a generic or stand-in one (a plan, a brief, opening lines read as ad copy) far less.
  // A block whose inputs are all optional needs one of them (an ad, a script or a page to check): any it takes counts as needed.
  const needs = (p) => required(p) || !inputs.some(required);
  const specific = takes.filter((p) => !loose(p)).reduce((s, p) => s + (needs(p) ? SPECIFIC : 2), 0);
  const generic = [...takes.filter(loose), ...stands].reduce((s, p) => s + (needs(p) ? LOOSE : 1), 0);
  // "Set up AI" holds unrelated set-ups (a study plan, a server plan), so sharing it is no evidence on its own.
  const catchAll = from.task === CATCH_ALL && to.task === CATCH_ALL;
  const sameTask = to.task === from.task && !catchAll, family = !catchAll && sameFamily(from.task, to.task), flow = jobFlow(from.task, to.task, all);
  const sim = subjectSimilarity(from, to, all);
  // Within one job, any real hand-off links them (the score orders them); across jobs a generic hand-off needs
  // backing from the workflows and a close subject.
  const linked = follows > 0 || builtOn > 0 || (after > 0 && family)
    || (specific > 0 && (sameTask || (flow >= MOVES && sim >= 0.02) || sim >= 0.12))
    || (generic > 0 && (sameTask || (family && flow >= MOVES && sim >= 0.1)))
    || (sameTask && sim >= 0.2);
  const fallback = !linked && ((specific > 0 && family && sim >= 0.04) || (generic > 0 && family && sim >= 0.1) || (sameTask && sim >= 0.1));
  if (!linked && !fallback) return null;
  // A check of an ad or a page only follows something people will see.
  creative ??= [...made, ...alike].some((t) => CREATIVE.has(t)) || (from.outputs ?? []).some((p) => typeOf(p) === "copy_draft" && sameFamily(from.task, "write-ad-copy"));
  if (!creative && !follows && !builtOn && (to.task === "check-ads" || to.task === "audit-landing-page")) return null;
  const missing = inputs.filter((p) => required(p) && !made.has(typeOf(p)) && !alike.has(typeOf(p))).length;
  const score = Math.min(follows, 3) * 6 + builtOn * 8 + Math.min(after, 2) * 2 + specific + generic + sim * 25 + (sameTask ? 3 : family ? 1 : 0) + flow * 10
    - missing * 0.5 + (creative && to.task === "check-ads" ? 4 : 0)
    // Another way to make the same thing (a second job post writer after a job post writer) is an alternative, not a next step.
    - (!follows && from.role !== "check" && to.role !== "check" && remakes(from, to, made) ? 4 : 0)
    // A check that reads what a maker made is the usual next step after it.
    + (from.role !== "check" && to.role === "check" && takes.length + stands.length ? 2 : 0)
    // Nothing to hand over: a sibling on the same subject, which a real hand-off should beat.
    - (!takes.length && !stands.length && !builtOn ? NO_HANDOFF : 0);
  const strength = (p) => (loose(p) ? 0 : 2) + (needs(p) ? 1 : 0);
  const named = [...new Set([...takes].sort((p, q) => strength(q) - strength(p)).map(typeOf))];
  return { score, linked, takes: named, hands: takes.length + stands.length + builtOn + follows > 0, follows, why: follows ? "follows" : specific || generic ? "takes" : "same job" };
}

/** The list from scored candidates: strong links (or, with none, the best FALLBACK weak ones), near the best, a few per job. */
function pick(strong, weak, { max, perTask, floor, siblings }) {
  const order = (p, q) => q.score - p.score || p.x.slug.localeCompare(q.x.slug);
  // With no strong link, the best weaker ones (same family and subject) still give the page somewhere to go.
  const pool = strong.length ? strong.sort(order) : weak.sort(order).slice(0, FALLBACK);
  // A sibling with nothing to hand over (another translator, the same tool for another language) is only shown when
  // fewer than SIBLINGS_UNTIL real hand-offs make the list.
  const handoffs = siblings === "never" ? Infinity : siblings ? pool.filter((s) => s.hands && s.score >= floor * (pool[0]?.score ?? 0)).length : Infinity;
  const perJob = new Map(), picked = [];
  for (const s of pool) {
    if (picked.length >= max) break;
    if (picked.length && s.score < floor * picked[0].score && !s.keep) continue;
    if (!s.hands && handoffs >= SIBLINGS_UNTIL) continue;
    const n = perJob.get(s.x.task) ?? 0;
    if (n >= perTask) continue;
    perJob.set(s.x.task, n + 1);
    picked.push(s);
  }
  return picked;
}
const offList = (b, x) => x.slug === b.slug || x.type === "mind" || isFlow(x) || x.twin === b.slug;

/**
 * The blocks to suggest after `b`, best first: [{ x, score, follows, takes, hands, why }] (handoffLink, plus the
 * candidate's merits). `outs` may add result types the block's outputs contain (the brand brain's parts); `alike`, types
 * they can stand in for (opening lines read as ad copy). Only `takes`, the other block's inputs this one really makes,
 * names the hand-off, strongest first (specific and required before generic or optional); a stand-in counts as loose evidence.
 * `siblings`: false never lists a block that takes nothing from this one (the builder and the step map, where an after
 * step must use what this one made); true (block pages) fills a short list with same-subject siblings.
 * @param {any} b
 * @param {any[]} all
 * @param {{ max?: number, perTask?: number, floor?: number, exclude?: (x: any) => boolean, outs?: string[], alike?: string[], startHere?: string[], siblings?: boolean }} [options]
 * @returns {{ x: any, score: number, follows: number, takes: string[], hands: boolean, why: string }[]}
 */
export function nextSteps(b, all, { max = 5, perTask = 3, floor = FLOOR, exclude = () => false, outs: extraOuts = [], alike: alikeOuts = [], startHere = [], siblings = true } = {}) {
  const made = madeOf(b, extraOuts);
  const alike = new Set(alikeOuts.filter((t) => !made.has(t)));
  const creative = [...made, ...alike].some((t) => CREATIVE.has(t)) || (b.outputs ?? []).some((p) => typeOf(p) === "copy_draft" && sameFamily(b.task, "write-ad-copy"));
  const strong = [], weak = [], ctx = context(all), slug = (s) => ctx.bySlug.get(s);
  // Only these can link (handoffLink): blocks that read something it makes, the same job, workflow neighbours, build-ons.
  const near = new Set([...[...made, ...alike].flatMap((t) => ctx.readersOf.get(t) ?? []), ...(ctx.byTask.get(b.task) ?? []),
    ...[...(ctx.follows.get(b.slug)?.keys() ?? []), ...(ctx.later.get(b.slug)?.keys() ?? []), ...(ctx.usedBy.get(b.slug) ?? [])].map(slug)]);
  for (const x of near) {
    if (!x || offList(b, x) || exclude(x)) continue;
    const link = handoffLink(b, x, all, { made, alike, creative });
    if (!link) continue;
    (link.linked ? strong : weak).push({ x, ...link, score: link.score + candidateMerit(x) + (startHere.includes(x.slug) ? 1 : 0) });
  }
  return pick(strong, weak, { max, perTask, floor, siblings: siblings ? "few" : "never" });
}

/**
 * The blocks to suggest before `b`, best first: makers of what it reads, by the same ranking as nextSteps the other
 * way round (handoffLink from each candidate to `b`). Only real hand-offs: the candidate makes an input of `b` (with a
 * brand brain's parts), `b` is built on it, or it runs straight before `b` in a reviewed workflow; never a sibling.
 * `takes`: the inputs of `b` it makes, strongest first. Each: { x, score, follows, takes, hands, keep, why }.
 * `makers`: named makers of a shared input (the brand brain builder for product facts, read in every line of work):
 * one that makes an input of `b` is always on the list (within `max`), whatever the subject and score.
 * @param {any} b
 * @param {any[]} all
 * @param {{ max?: number, perTask?: number, floor?: number, exclude?: (x: any) => boolean, startHere?: string[], makers?: string[] }} [options]
 * @returns {{ x: any, score: number, follows: number, takes: string[], hands: boolean, why: string }[]}
 */
export function previousSteps(b, all, { max = 5, perTask = 2, floor = FLOOR, exclude = () => false, startHere = [], makers = [] } = {}) {
  const ctx = context(all), reads = new Set((b.inputs ?? []).map(typeOf)), builtOn = new Set(b.uses ?? []);
  const strong = [], weak = [];
  // Only makers of what it reads, what it is built on and its workflow predecessors can go before it.
  const near = new Set([...reads].flatMap((t) => ctx.makersOf.get(t) ?? []));
  for (const s of builtOn) if (ctx.bySlug.get(s)) near.add(ctx.bySlug.get(s));
  for (const { x } of workflowPredecessors(b, all)) near.add(x);
  for (const x of near) {
    if (offList(b, x) || exclude(x)) continue;
    const made = handsOver(x);
    if (![...made].some((t) => reads.has(t)) && !builtOn.has(x.slug) && !ctx.follows.get(x.slug)?.has(b.slug)) continue;
    const named = makers.includes(x.slug) && [...made].some((t) => reads.has(t));
    const link = handoffLink(x, b, all, { made }) ?? (named ? { score: 0, linked: true, takes: (b.inputs ?? []).filter((p) => made.has(typeOf(p))).map(typeOf), hands: true, follows: 0, why: "takes" } : null);
    if (!link?.hands) continue;
    if (named) link.linked = true;
    (link.linked ? strong : weak).push({ x, ...link, keep: named, score: link.score + candidateMerit(x) + (startHere.includes(x.slug) ? 1 : 0) });
  }
  return pick(strong, weak, { max, perTask, floor, siblings: false });
}
