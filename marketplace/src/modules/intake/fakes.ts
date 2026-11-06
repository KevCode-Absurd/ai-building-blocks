// Fake model replies for this module (MODEL_MODE=fake). Register with registerFake from core/models.ts.
// Deterministic and believable, so the local demo and staging work end to end without model keys:
//   intake.classify  keyword match on the catalogue's keywords and titles
//   intake.extract   fills fields from what the request plainly says (long fields get the request itself)
//   intake.rubric    one checklist item per goal sentence, at most three
import type { JobType, SpecField } from "../../core/types.ts";
import { registerFake } from "../../core/models.ts";
import { listJobTypes } from "../catalogue/index.ts";
import { TAGS, unwrap } from "./prompts.ts";

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Whole-word, case-insensitive phrase match that also accepts a plural ending. */
function phraseIn(phrase: string, text: string): boolean {
  const p = phrase.trim();
  if (!p) return false;
  return new RegExp(`(^|[^a-z0-9])${escapeRe(p.toLowerCase())}(s|es)?($|[^a-z0-9])`, "i").test(text.toLowerCase());
}

const STOP = new Set("a an and the of for to in on with your my our you we i me us is are be it this that from by as at or into out up about can will what how who per new one".split(" "));
const stem = (w: string) => w.replace(/ies$/, "y").replace(/(?<=[a-z]{3})(es|s)$/, "");
const wordsOf = (text: string) => new Set(text.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2 && !STOP.has(w)).map(stem));

/** Words from each job type: strong (keywords, title) and weak (summary), with how many job types share each word. */
interface MenuIndex { strong: Map<string, Set<string>>; weak: Map<string, Set<string>>; df: Map<string, number> }
const indexes = new WeakMap<JobType[], MenuIndex>();
function indexFor(menu: JobType[]): MenuIndex {
  let idx = indexes.get(menu);
  if (!idx) {
    const strong = new Map(menu.map(jt => [jt.id, wordsOf([jt.title, ...jt.keywords].join(" "))]));
    const weak = new Map(menu.map(jt => [jt.id, new Set([...wordsOf(jt.summary)].filter(w => !strong.get(jt.id)!.has(w)))]));
    const df = new Map<string, number>();
    for (const jt of menu) for (const w of new Set([...strong.get(jt.id)!, ...weak.get(jt.id)!])) df.set(w, (df.get(w) ?? 0) + 1);
    idx = { strong, weak, df };
    indexes.set(menu, idx);
  }
  return idx;
}

function scoreJobType(jt: JobType, text: string, menu: JobType[]): { score: number; matched: string[] } {
  let score = 0;
  const matched: string[] = [];
  for (const kw of jt.keywords) {
    if (phraseIn(kw, text)) { score += kw.trim().split(/\s+/).length; matched.push(kw); }
  }
  if (phraseIn(jt.title, text)) { score += 2; matched.push(jt.title.toLowerCase()); }
  // Single words count too: keyword and title words more than summary words, and rare words more than
  // words many job types share ("plan", "email").
  const { strong, weak, df } = indexFor(menu);
  const asked = wordsOf(text);
  for (const [set, weight] of [[strong.get(jt.id), 0.8], [weak.get(jt.id), 0.4]] as const) {
    for (const w of set ?? []) {
      if (!asked.has(w)) continue;
      score += weight / (df.get(w) ?? 1);
      if (weight > 0.5 && !matched.some(m => m.includes(w))) matched.push(w);
    }
  }
  return { score, matched };
}

const MIN_SCORE = 0.4;

export function fakeClassify(prompt: string) {
  const text = unwrap(TAGS.request, prompt) ?? prompt;
  const preferred = /usually does: ([^\n]+?)\. Prefer/.exec(prompt)?.[1].split(/,\s*/) ?? [];
  const menu = listJobTypes();
  const ranked = menu
    .map(jt => {
      const s = scoreJobType(jt, text, menu);
      return { jt, matched: s.matched, score: s.score > 0 && preferred.includes(jt.id) ? s.score + 0.5 : s.score };
    })
    // One common word ("help", "plan") is not a match.
    .filter(r => r.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score || a.jt.id.localeCompare(b.jt.id));
  const best = ranked[0];
  if (!best) return { job_type_id: null, confidence: 0.1, reason: "The request does not use the words of any job on the menu.", alternatives: [] };
  // Confidence follows the lead over the runner-up: a clear lead is usually right, a near tie is a guess.
  const margin = best.score - (ranked[1]?.score ?? 0);
  const confidence = Math.round(Math.max(0.05, Math.min(0.95, 0.42 + 0.2 * margin)) * 100) / 100;
  return {
    job_type_id: best.jt.id,
    confidence,
    reason: best.matched.length ? `The request mentions ${best.matched.slice(0, 4).map(m => `"${m}"`).join(", ")}.` : `The request reads like ${best.jt.title.toLowerCase()}.`,
    alternatives: ranked.slice(1, 4).map(r => r.jt.id),
  };
}

const SKIP_START = /^(our|my|the|a|an|this|that|it|us|me|you|your|them|free|now|sale)\b/i;

/** The first match of the patterns, trimmed, when it reads like a short phrase. */
function pick(text: string, patterns: RegExp[], max = 80): string | null {
  for (const re of patterns) {
    const m = re.exec(text);
    const v = m?.[1]?.trim().replace(/\s+/g, " ").replace(/[\s,]+$/, "");
    if (v && v.length >= 3 && v.length <= max && !SKIP_START.test(v)) return v;
  }
  return null;
}

const AUDIENCE = /^(audience|target|who|buyer|buyers|customer|customers|reader|readers|candidate_profile|best_customers)$/;
const BUSINESS = /^(business|business_type|company|shop|organisation|organization|client)$/;
const TOPIC = /^(topic|market|industry|role|role_title|task|process_name|event|show|newsletter|feature|page|app|product)$/;

function textValue(f: SpecField, text: string): string | null {
  if (AUDIENCE.test(f.id)) return pick(text, [/\b(?:for|aimed at|targeting|to reach)\s+([^.,;!?\n]+)/i]);
  if (BUSINESS.test(f.id)) return pick(text, [/\b(?:we|i)\s+(?:run|own|have|manage)\s+((?:an?|two|three)\s[^.;!?\n]+)/i, /\bwe are\s+(an?\s[^.;!?\n]+)/i], 120);
  if (TOPIC.test(f.id)) return pick(text, [/["“]([^"”\n]+)["”]/, /\babout\s+([^.;!?\n]+)/i], 120);
  return null;
}

function numberValue(f: SpecField, text: string): number | null {
  const words = new Set([...f.id.split("_"), ...f.label.toLowerCase().split(/[^a-z]+/)].filter(w => w.length > 3 && !["number", "count", "length", "total"].includes(w)));
  for (const w of words) {
    const stem = w.replace(/(es|s)$/, "");
    const m = new RegExp(`(\\d[\\d,]*(?:\\.\\d+)?)\\s*-?\\s*${escapeRe(stem)}(?:e?s)?\\b`, "i").exec(text);
    if (m) {
      const n = Number(m[1].replace(/,/g, ""));
      if (Number.isFinite(n) && (f.max === undefined || n <= f.max)) return n;
    }
  }
  return null;
}

export function fakeExtract(prompt: string) {
  const text = (unwrap(TAGS.request, prompt) ?? "").trim();
  const fields = JSON.parse(unwrap(TAGS.fields, prompt) ?? "[]") as SpecField[];
  const out: Record<string, unknown> = {};
  // The request itself is the best answer for the main long field ("What are you selling?").
  const long = fields.find(f => f.type === "longtext" && f.required) ?? fields.find(f => f.type === "longtext");
  if (long && text) out[long.id] = text.slice(0, long.max ?? 60000);
  for (const f of fields) {
    if (f.id in out) continue;
    if (f.type === "text") {
      const v = textValue(f, text);
      if (v) out[f.id] = v.slice(0, f.max ?? 1000);
    } else if (f.type === "number") {
      const n = numberValue(f, text);
      if (n !== null) out[f.id] = n;
    } else if (f.type === "choice") {
      const o = f.options?.find(opt => phraseIn(opt, text));
      if (o) out[f.id] = o;
    } else if (f.type === "multichoice") {
      const os = (f.options ?? []).filter(opt => phraseIn(opt, text));
      if (os.length) out[f.id] = os;
    } else if (f.type === "url") {
      const u = /\bhttps?:\/\/[^\s)>,]+/i.exec(text)?.[0];
      if (u) out[f.id] = u;
    }
  }
  return { fields: out, questions: [] };
}

export function fakeRubric(prompt: string) {
  const goals = (unwrap(TAGS.goals, prompt) ?? "").trim();
  const parts = goals.split(/\r?\n|;|(?<=[.!?])\s+/).map(s => s.trim().replace(/^[-*•]\s*/, "").replace(/[.!?]+$/, "")).filter(s => s.length >= 3);
  return {
    criteria: parts.slice(0, 3).map((g, i) => {
      const goal = g.slice(0, 200);
      const text = goal.length >= 10 ? goal[0].toUpperCase() + goal.slice(1) + "." : `The work covers this: ${goal}.`;
      return {
        id: `goal_${i + 1}`,
        text,
        pass_rule: `A reviewer can point to the part of the draft that does this: "${goal}".`,
        weight: /\b(must|has to|never|always|only)\b/i.test(goal) ? 5 : 3,
        critical: /\b(must|has to|never)\b/i.test(goal),
      };
    }),
  };
}

registerFake("intake.classify", req => ({ data: fakeClassify(req.prompt) }));
registerFake("intake.extract", req => ({ data: fakeExtract(req.prompt) }));
registerFake("intake.rubric", req => ({ data: fakeRubric(req.prompt) }));
