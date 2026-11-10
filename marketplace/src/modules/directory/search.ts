// Directory search: plain requests in, the agents who do that work out, makers first.
//
// "I need a landing page for my shop" used to find nobody, because every word had to appear in an agent's name,
// title, tagline or an outcome title. Now a request is cut down to the words that carry it ("landing", "page",
// "shop"), each word is matched in any of its forms (plural, "-ing", "writer" for "write") and its everyday
// stand-ins ("store" for "shop"), and an agent matches when it covers most of the request's weight (rare words
// weigh more than common ones). What is searched: name, title and job role; the role's aliases; outcome titles and
// their search hints; the tagline; the role's toolbox task names; the job types behind the outcomes; and, adding to
// a score but never making a match alone, the bio, capabilities and what each outcome delivers. "Not for" lines are
// never searched.
//
// Ranking: a match in the title counts most, then an alias, an outcome, the tagline, a task, a job type and the
// small print (WEIGHTS). Every match is scaled by what that piece of work is (work.ts): for "I need a landing page"
// an outcome that is a landing page beats one that is a landing page audit, and "audit my landing page" turns that
// round. Words side by side in the request count extra side by side in an agent, and so do several of them in one
// title, outcome or task. Agents within a few per cent of each other then go in `sort` order, most useful first.
//
// GET /api/agents, the plain /agents?q= page and the MCP tool list_agents all search through service.ts
// (searchPersonas, listPersonas), which calls this. Nothing here runs a model.
import type { Persona } from "../../core/types.ts";
import { getJobType } from "../catalogue/index.ts";
import { getRole } from "./roles.ts";
import { roleTasks, roleToolbox, type RoleToolbox } from "./toolbox.ts";
import { outcomeNature, workLine, type WorkNature } from "./work.ts";

// ---------- Words ----------

/** Words that carry no part of a request: "I need someone to do my ...". */
const STOP = new Set(("a an and the for to of with in on is it its how your my i im ive want wants wanted need needs needed help helps me please can could would " +
  "like get got do does doing done about some this that these those our we us you am be been being someone somebody anyone anybody something anything " +
  "what which who whom whose or as at by are was were will shall should if then than just also so very really too there here have has had not no " +
  "looking look nothing everything give gives let lets make makes making made up out off from into over them they their").split(" "));

/** Doing words whose "-er" form names who does it ("writer", "designer", "bookkeeper"). Other "-er" words keep
 *  their ending: a poster is not a post and a banner is not a ban. */
const DOERS = new Set(("check track build find pick read test draft scan score print plan write rewrite design review audit research map rank sort tag tune " +
  "spot publish summarise organise optimise analyse convert explain remind open start explore fix size split sharpen tighten shorten catch watch match " +
  "grade rate schedule trim clean brief price label format compare outline polish translate sequence extract select detect connect estimate evaluate " +
  "validate generate calculate simulate edit moderate render reply respond repurpose forecast budget report recap digest sketch storyboard caption " +
  "script pitch qualify triage route sync import export merge lint debug refactor deploy migrate monitor profile benchmark localise personalise " +
  "prioritise develop bookkeep copywrite manage sell train teach coach produce program consult recruit interview illustrate animate photograph " +
  "market advertise blog podcast fundraise negotiate invest film narrate facilitate advise mentor tutor assess inspect integrate automate maintain " +
  "repair install configure administer operate").split(" "));

const KEEP = new Set(["news", "canvas", "series", "lens", "ios", "sms", "saas", "gas", "bias", "atlas", "alias", "pros", "analysis", "basis", "thesis", "focus", "status", "bonus", "campus", "always", "across", "less", "business", "process", "access", "success", "address", "press", "class", "glass", "cross", "loss", "boss", "sales", "ads", "seo", "faq", "kpi"]);

/** One form for the endings that do not change what a word is about: plurals, "-ing", "-ed", "-ise/-ize",
 *  "colour/color", and "-er" for the doers above. Lighter than a full stemmer on purpose. */
export function stem(word: string): string {
  let w = word;
  if (w === "ads" || w === "advert" || w === "adverts") return "ad";
  if (w.length < 4 || KEEP.has(w)) return w;
  w = w.replace(/^(.{3,}?)([iy])z(e|es|ed|er|ers|ing|ation|ations)$/, "$1$2s$3").replace(/isations?$/, "ise").replace(/^(.{2,})our(s|ed|ing|ful)?$/, "$1or$2");
  if (w.endsWith("ies") && w.length > 4) w = `${w.slice(0, -3)}y`;
  else if (/(?:ch|sh|x|z|ss)es$/.test(w)) w = w.slice(0, -2);
  else if (w.endsWith("s") && !/(?:ss|us|is)$/.test(w)) w = w.slice(0, -1);
  const doer = /^(.{3,}?)(?:er|or)$/.exec(w);
  if (doer) {
    const base = /([^aeiouylsz])\1$/.test(doer[1]) ? doer[1].slice(0, -1) : doer[1];
    for (const candidate of [base, `${base}e`, doer[1]]) if (DOERS.has(candidate)) { w = candidate; break; }
  }
  const m = /^(.{3,}?)(?:ing|ed)$/.exec(w);
  if (m && /[aeiouy]/.test(m[1]) && !m[1].endsWith("e")) {
    let s = m[1];
    if (s.length > 3 && /([^aeiouylsz])\1$/.test(s)) s = s.slice(0, -1);
    else if (s.length <= 3 && /[^aeiou][aeiou][^aeiouwxy]$/.test(s)) s += "e";
    w = s;
  }
  if (w.length >= 5 && w.endsWith("e")) w = w.slice(0, -1);
  return w;
}

/** Every word of a text that search looks at, in order: lower case, accents off, in its one form. With `keepAll`
 *  the filler words stay (for an agent's own text, where "set" or "up" may be part of a name). */
function wordsOf(text: string, keepAll = false): string[] {
  return wordsIn(plainText(text), keepAll);
}

/** Lower case, accents off, and the few spellings that must read as one word ("set-up", "e-mail", "A/B"). Line breaks stay. */
function plainText(text: string): string {
  return String(text ?? "").normalize("NFKD").replace(/\p{M}/gu, "").toLowerCase()
    .replace(/\ba\/b\b/g, " ab ").replace(/\be-?mails?\b/g, " email ").replace(/\bset[- ]?ups?\b/g, " setup ").replace(/\bsign[- ]?ups?\b/g, " signup ")
    .replace(/\bbook[- ]keep/g, "bookkeep").replace(/\be[- ]?commerce\b/g, " ecommerce ").replace(/[’']/g, "");
}

/** A word's one form, remembered: an agent's text repeats the same few thousand words. */
const stems = new Map<string, string>();

function wordsIn(plain: string, keepAll: boolean): string[] {
  const out: string[] = [];
  const raws = plain.match(/[a-z0-9$%+#&]+/g) ?? [];
  // A request made only of filler words ("anything like this") is searched as it stands, and finds what it finds.
  if (!keepAll && raws.every(raw => STOP.has(raw))) keepAll = true;
  for (const raw of raws) {
    if (!keepAll && STOP.has(raw)) continue;
    let s = stems.get(raw);
    if (s === undefined) { s = stem(raw); if (stems.size < 50_000) stems.set(raw, s); }
    out.push(s);
  }
  return out;
}

/** The words of a request that carry it, in order, each once. At most 12. */
export function searchTerms(q: string | undefined): string[] {
  return [...new Set(wordsOf(q ?? ""))].slice(0, 12);
}

/** Words people use for one thing. Asking with one also finds the others, at a discount so the exact word still wins. */
const SYNONYM_GROUPS = [
  ["shop", "store"], ["ad", "advertisement", "advertising"], ["customer", "shopper", "client"], ["resume", "cv"], ["supplier", "vendor"],
  ["invoice", "bill"], ["hire", "recruit", "recruitment"], ["employee", "staff"], ["picture", "photo", "image"], ["contract", "agreement"],
  ["survey", "questionnaire"], ["slide", "deck", "presentation"], ["spreadsheet", "excel", "workbook"], ["inventory", "stock"],
  ["forecast", "projection"], ["video", "clip", "reel"], ["booking", "appointment", "reservation"], ["series", "sequence", "drip"],
  ["flyer", "brochure", "leaflet"], ["sign", "signage"], ["merch", "merchandise"], ["font", "typeface", "typography"], ["logo", "wordmark"],
  ["outreach", "prospecting"], ["welcome", "onboarding"], ["newsletter", "email"], ["pricing", "price"], ["proposal", "quote"], ["kpi", "metric"],
  ["sop", "procedure"], ["thumbnail", "cover"], ["speed", "fast", "slow"], ["tracking", "analytics", "measurement", "pixel"],
  ["developer", "engineer"], ["website", "web"], ["fix", "repair", "troubleshoot"], ["blog", "article"], ["copy", "copywriting", "wording"],
  ["support", "helpdesk"], ["tax", "vat"], ["payroll", "wages"], ["course", "lesson"],
];
const SYNONYM_SCORE = 0.7;
const SYNONYMS = new Map<string, string[]>();
for (const group of SYNONYM_GROUPS) {
  const stems = [...new Set(group.map(stem))];
  for (const s of stems) SYNONYMS.set(s, [...new Set([...(SYNONYMS.get(s) ?? []), ...stems.filter(x => x !== s)])]);
}
// One way only: "my site" means a website, but a request for a website should not find a building site.
SYNONYMS.set(stem("site"), [stem("website")]);

// ---------- What a request is after ----------

const REVIEW_ASK = new Set(["audit", "review", "check", "analyse", "diagnose", "assess", "critique", "evaluate", "teardown", "analysis", "report", "benchmark"].map(stem));
const PLAN_ASK = new Set(["plan", "strategy", "roadmap", "brief", "calendar", "schedule", "checklist", "map"].map(stem));

/**
 * What the person wants back: a review of something they have ("audit my landing page"), a plan ("plan my product
 * launch"), or the thing itself, which is what most requests mean ("I need a landing page").
 */
export function requestIntent(q: string | undefined): WorkNature {
  const terms = searchTerms(q);
  if (terms.some(t => REVIEW_ASK.has(t))) return "review";
  if (terms.some(t => PLAN_ASK.has(t))) return "plan";
  return "make";
}

/**
 * How much a piece of work counts for each kind of request. When the thing itself is asked for, a review of it
 * counts about half and a plan for it nearly in full, so an agent who makes landing pages comes before one who
 * audits them. The first row applies only while some agent does make the thing (makersExist in rankPersonas):
 * nobody "makes" technical SEO, so a search for it does not push the technical SEO specialist down for auditing.
 */
const FIT: Record<WorkNature, Record<WorkNature, number>> = {
  make: { make: 1, plan: 0.96, review: 0.55 },
  plan: { plan: 1, make: 0.96, review: 0.65 },
  review: { review: 1, make: 0.7, plan: 0.7 },
};
const EVEN: Record<WorkNature, number> = { make: 1, plan: 1, review: 1 };

/** Doing words that say little about the job: "set up tracking" is about tracking, "build me a website" about a
 *  website. They add to a match, lightly. */
const LIGHT = new Set(["setup", "create", "build", "write", "fix", "improve", "handle", "run", "start", "sort", "prepare", "produce"].map(stem));
const LIGHT_WEIGHT = 0.15;
/** Words that say whose it is or who it is for, not what is wanted: "for my shop", and the person in "hire a developer". */
const SETTING_WEIGHT = 0.15;

/**
 * The words in a request that only set the scene, in their one form: what follows "for my", "for our", "for a" or
 * "for the" ("a landing page for my shop"), and who is to be hired ("help me hire a developer" is a hiring job,
 * and the recruiters do it). They still count, a little, so a Shopify agent edges ahead for a shop.
 */
export function settingTerms(q: string | undefined): Set<string> {
  const text = String(q ?? "").toLowerCase();
  const out = new Set<string>();
  for (const m of text.matchAll(/\bfor\s+(?:my|our|a|an|the)\s+([^.,;:!?]+)/g)) for (const w of wordsOf(m[1])) out.add(w);
  for (const m of text.matchAll(/\b(?:hire|hiring|recruit|recruiting)\s+([^.,;:!?]+)/g)) for (const w of wordsOf(m[1])) out.add(w);
  return out;
}

// ---------- What is searched in an agent ----------

type PartKind = "title" | "alias" | "tagline" | "body" | "outcome" | "job" | "task";
interface Part { kind: PartKind; words: Set<string>; seq: string; weight: number; nature: WorkNature | null; text: string }
interface Doc { parts: Part[]; all: Set<string>; nature: WorkNature }

const WEIGHTS: Record<PartKind, number> = { title: 1, alias: 0.95, outcome: 0.9, tagline: 0.8, task: 0.7, job: 0.6, body: 0.35 };
/** Keeps two neighbours in a list from reading as one phrase. */
const GAP = " zzgap ";

interface RawPart { kind: PartKind; text: string; nature: WorkNature | null }

/** Reads a list of texts into parts with one pass over their joined text (a persona has 20 to 50 of them). */
function readParts(raw: RawPart[]): Part[] {
  const lines = plainText(raw.map(r => r.text.replace(/\s+/g, " ")).join("\n")).split("\n");
  return raw.map((r, i) => {
    const words = wordsIn(lines[i] ?? "", true);
    return { kind: r.kind, words: new Set(words), seq: ` ${words.join(" ")} `, weight: WEIGHTS[r.kind], nature: r.nature, text: r.text.split(GAP)[0] };
  });
}

const docs = new WeakMap<Persona, Doc>();
/** A role's tasks are the same for every agent in it, so they are read once per role. */
const taskParts = new WeakMap<RoleToolbox, Part[]>();

function tasksOf(roleId: string | undefined): Part[] {
  const box = roleToolbox(roleId);
  if (!box) return [];
  let parts = taskParts.get(box);
  if (!parts) taskParts.set(box, parts = readParts(roleTasks(box).map(t => ({ kind: "task" as const, text: t.task, nature: t.nature }))));
  return parts;
}

function docOf(p: Persona): Doc {
  const hit = docs.get(p);
  if (hit) return hit;
  const role = getRole(p.role);
  const profile = p.profile ?? ({} as Persona["profile"]);
  const outcomes = profile.outcomes ?? [];
  const nature = workLine(outcomes)?.nature ?? "make";
  const raw: RawPart[] = [
    { kind: "title", text: [p.name, p.title, role?.name ?? ""].join(GAP), nature: null },
    { kind: "alias", text: (role?.aliases ?? []).join(GAP), nature: null },
    { kind: "tagline", text: p.tagline ?? "", nature: null },
    { kind: "body", text: [profile.bio, ...(profile.capabilities ?? []), ...(profile.good_at ?? []), ...outcomes.map(o => o.deliverable), role?.summary].filter(Boolean).join(GAP), nature: null },
  ];
  for (const o of outcomes) {
    const kind = outcomeNature(o.title, o.job_type_hint);
    raw.push({ kind: "outcome", text: [o.title, o.job_type_hint ?? ""].join(GAP), nature: kind });
    const job = getJobType(o.job_type_id);
    if (job) raw.push({ kind: "job", text: [job.title, ...(job.keywords ?? [])].join(GAP), nature: kind });
  }
  const parts = [...readParts(raw), ...tasksOf(p.role)];
  const all = new Set<string>();
  for (const x of parts) for (const w of x.words) all.add(w);
  const doc = { parts, all, nature };
  docs.set(p, doc);
  return doc;
}

/** Tests only: forget what was read from each agent (after swapping the roles or the toolbox data under the same personas). */
export function forgetSearchDocs(list: Persona[]): void { for (const p of list) docs.delete(p); }

// ---------- Ranking ----------

export interface SearchHit {
  persona: Persona;
  score: number;
  /** The share of the request's weight this agent covers, 0 to 1. */
  coverage: number;
  /** The outcome or toolbox task that fits the request best, in its own words. null when the match is elsewhere (title, tagline). */
  because: string | null;
}

/** An agent must cover this share of the request's weight. Two words of like weight both have to match. */
const MIN_COVERAGE = 0.6;
/** Agents this close to the best score rank together, and `sort` (most useful first) orders them. */
const TIER = 0.05;
/** Agents scoring under this share of the best are left out: they match in the small print only. */
const MIN_SHARE = 0.25;

const has = (words: Set<string>, term: string): number => {
  if (words.has(term)) return 1;
  const alts = SYNONYMS.get(term);
  return alts && alts.some(a => words.has(a)) ? SYNONYM_SCORE : 0;
};

/**
 * Every agent that matches the request, best first, with its score. No words in the request: everyone, score 0,
 * in the order given. Words no agent has anywhere ("for my bakery in Leeds") are set aside, so a place or a trade
 * we have no agent for does not empty the list; a request made only of such words finds nobody.
 */
export function rankPersonas(list: Persona[], q: string | undefined): SearchHit[] {
  const asked = searchTerms(q);
  if (!asked.length) return list.map(persona => ({ persona, score: 0, coverage: 1, because: null }));
  const intent = requestIntent(q);
  const setting = settingTerms(q);
  const all = list.map(p => ({ persona: p, doc: docOf(p) }));
  // How many agents have each word (or a stand-in for it). Rare words carry more of the request.
  const found = asked.map(term => {
    let df = 0;
    for (const x of all) if (has(x.doc.all, term) > 0) df++;
    return { term, df };
  }).filter(t => t.df > 0);
  if (!found.length) return [];
  // Scene-setting words count less, unless the request has nothing else.
  const onlySetting = found.every(t => setting.has(t.term) || LIGHT.has(t.term));
  const terms = found.map(t => {
    const scene = !onlySetting && setting.has(t.term);
    return { term: t.term, scene, idf: Math.log(1 + list.length / t.df) * (onlySetting ? 1 : scene ? SETTING_WEIGHT : LIGHT.has(t.term) ? LIGHT_WEIGHT : 1) };
  });
  const mass = terms.reduce((sum, t) => sum + t.idf, 0);
  const core = terms.filter(t => !t.scene);
  // Words that sat side by side in the request ("landing page") count extra when an agent has them side by side.
  const order = wordsOf(q ?? "");
  const pairs: { ab: string; ba: string; idf: number }[] = [];
  for (let i = 0; i + 1 < order.length; i++) {
    const a = core.find(t => t.term === order[i]), b = core.find(t => t.term === order[i + 1]);
    if (a && b && a !== b) pairs.push({ ab: ` ${a.term} ${b.term} `, ba: ` ${b.term} ${a.term} `, idf: Math.min(a.idf, b.idf) });
  }

  // Makers go first only for a thing somebody makes: some agent must have an outcome or task that is the made
  // thing, holding most of the request or two of its words side by side ("store speed").
  const named = core.filter(t => !LIGHT.has(t.term));
  const things = named.length ? named : core;
  const thingMass = things.reduce((sum, t) => sum + t.idf, 0);
  const thingPairs = pairs.filter(pair => things.some(t => pair.ab.startsWith(` ${t.term} `)) && things.some(t => pair.ab.endsWith(` ${t.term} `)));
  const isTheThing = (part: Part) => part.nature === "make" && (part.kind === "outcome" || part.kind === "task")
    && (things.reduce((sum, t) => sum + (has(part.words, t.term) > 0 ? t.idf : 0), 0) >= MIN_COVERAGE * thingMass - 1e-9
      || thingPairs.some(pair => part.seq.includes(pair.ab)));
  const makersExist = intent !== "make" || all.some(x => x.doc.parts.some(isTheThing));
  const scale = makersExist ? FIT[intent] : EVEN;

  const hits: SearchHit[] = [];
  for (const { persona, doc } of all) {
    const fit = (x: Part) => x.weight * scale[x.nature ?? doc.nature];
    let covered = 0, score = 0;
    for (const t of terms) {
      let best = 0, sum = 0, strong = false;
      for (const x of doc.parts) {
        const m = has(x.words, t.term);
        if (!m) continue;
        const s = m * fit(x);
        sum += s;
        if (s > best) best = s;
        if (x.kind !== "body") strong = true;
      }
      // A word found only in the small print (the bio, what an outcome delivers) adds to the score but does not
      // count as covered. A word found in several places counts a little more each time.
      if (strong) covered += t.idf;
      if (best > 0) score += t.idf * (best + 0.2 * Math.min(sum - best, 2));
    }
    if (covered < MIN_COVERAGE * mass - 1e-9) continue;
    for (const pair of pairs) {
      let best = 0;
      for (const x of doc.parts) {
        if (x.seq.includes(pair.ab)) best = Math.max(best, fit(x));
        else if (x.seq.includes(pair.ba)) best = Math.max(best, 0.7 * fit(x));
      }
      score += 0.8 * pair.idf * best;
    }
    // One title, outcome or task that holds several of the words is a better sign than the same words scattered
    // about, and a title that holds them ("Product launch manager" for "plan my product launch") is the best sign.
    let together = 0, because: string | null = null, becauseScore = 0;
    for (const x of doc.parts) {
      if (x.kind === "body") continue;
      let held = 0, n = 0;
      for (const t of core) { const m = has(x.words, t.term); if (m) { held += m * t.idf; n++; } }
      if (!n) continue;
      const s = held * fit(x);
      if (n > 1 && s > together) together = s;
      if (n > 1 && x.kind === "title") score += 0.5 * s;
      if ((x.kind === "outcome" || x.kind === "task") && s > becauseScore) { becauseScore = s; because = x.text; }
    }
    score += 0.6 * together;
    hits.push({ persona, score, coverage: covered / mass, because });
  }
  if (!hits.length) return [];
  const top = hits.reduce((m, h) => Math.max(m, h.score), 0);
  const tier = (h: SearchHit) => Math.floor((1 - h.score / top) / TIER + 1e-9);
  return hits.filter(h => h.score >= MIN_SHARE * top)
    .sort((a, b) => tier(a) - tier(b) || a.persona.sort - b.persona.sort || b.score - a.score || a.persona.name.localeCompare(b.persona.name) || a.persona.id.localeCompare(b.persona.id));
}

const byOrder = (a: Persona, b: Persona) => a.sort - b.sort || a.name.localeCompare(b.name) || a.id.localeCompare(b.id);

/**
 * The display order everywhere: `sort` ascending (lower = more useful), then name. With a search: the agents that
 * match (rankPersonas), the best matches first and the most useful first among agents that match about as well.
 */
export function searchPersonas(list: Persona[], q: string | undefined): Persona[] {
  if (!searchTerms(q).length) return [...list].sort(byOrder);
  return rankPersonas(list, q).map(h => h.persona);
}

/** The words of a text that carry meaning, each in its one form: what the profile matches an outcome to a skill with. */
export function contentWords(text: string): Set<string> {
  return new Set(wordsIn(plainText(text), false).filter(w => w.length > 1 && !STOP.has(w)));
}
