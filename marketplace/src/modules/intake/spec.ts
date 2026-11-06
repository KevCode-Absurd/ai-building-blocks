// Spec fields: checking values by field type, the "never invent" guard for extracted values,
// and the clarifying questions for required fields that are still missing.
import type { ClarifyingQuestion, JobType, SpecField } from "../../core/types.ts";

export type Spec = Record<string, unknown>;

/** At most this many clarifying questions per job, in total. */
export const MAX_QUESTIONS = 3;

/** Extraction may say a long field is the bulk of the request itself (pasted data); stored as this marker. */
export const IN_REQUEST = "(in the request)";

const DEFAULT_MAX: Record<string, number> = { text: 1000, longtext: 60000, url: 2000, list: 30 };
const MAX_LIST_ITEM = 1000;

export function isEmpty(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  if (typeof v === "string") return v.trim() === "";
  if (Array.isArray(v)) return v.length === 0;
  return false;
}

export type Normalised = { value?: unknown; error?: string };

export interface NormaliseOptions {
  /** "extract": values the model pulled from the request (drop what does not fit); "answer": what the buyer typed (explain what is wrong). */
  mode: "extract" | "answer";
  /** The buyer's request, for the grounding check on extracted numbers and links. */
  request?: string;
}

const NUMBER_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve",
  "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** True when the request states this number (as digits, with thousands commas, as "28k", or as a word up to twenty). */
export function numberAppears(n: number, text: string): boolean {
  const t = text.toLowerCase().replace(/(\d),(?=\d{3}\b)/g, "$1");
  const forms = new Set<string>([String(n)]);
  if (n >= 1000 && n % 100 === 0) forms.add(`${n / 1000}k`);
  if (n >= 1_000_000 && n % 100_000 === 0) forms.add(`${n / 1_000_000}m`);
  for (const f of forms) {
    if (new RegExp(`(^|[^\\d.])${escapeRe(f)}(?![\\d]|\\.\\d)`).test(t)) return true;
  }
  if (Number.isInteger(n) && n >= 0 && n <= 20 && new RegExp(`\\b${NUMBER_WORDS[n]}\\b`).test(t)) return true;
  return false;
}

function toUrl(raw: string): string | null {
  let v = raw.trim();
  if (!/^https?:\/\//i.test(v)) {
    if (!/^[\w-]+(\.[\w-]+)+(:\d+)?(\/\S*)?$/.test(v)) return null;
    v = `https://${v}`;
  }
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

function matchOption(field: SpecField, raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().toLowerCase();
  return field.options?.find(o => o.toLowerCase() === v) ?? null;
}

/** Check one value against its field. Empty values come back as {} (no value, no error). */
export function normaliseValue(field: SpecField, raw: unknown, opts: NormaliseOptions): Normalised {
  const answer = opts.mode === "answer";
  const label = `"${field.label.replace(/\?$/, "")}"`;
  if (isEmpty(raw)) return {};
  switch (field.type) {
    case "text":
    case "longtext": {
      const v = typeof raw === "number" ? String(raw) : typeof raw === "string" ? raw.trim() : null;
      if (v === null) return answer ? { error: `${label} must be text.` } : {};
      if (!v) return {};
      const max = field.max ?? DEFAULT_MAX[field.type];
      if (v.length > max) return answer ? { error: `${label} is too long. Keep it under ${max.toLocaleString("en-US")} characters.` } : { value: v.slice(0, max) };
      return { value: v };
    }
    case "url": {
      if (typeof raw !== "string") return answer ? { error: `Enter a web address for ${label}, like https://example.com.` } : {};
      const u = toUrl(raw);
      if (!u || u.length > (field.max ?? DEFAULT_MAX.url)) return answer ? { error: `Enter a web address for ${label}, like https://example.com.` } : {};
      if (!answer && opts.request !== undefined) {
        const host = new URL(u).hostname.replace(/^www\./, "").toLowerCase();
        if (!opts.request.toLowerCase().includes(host)) return {};
      }
      return { value: u };
    }
    case "number": {
      const n = typeof raw === "number" ? raw : typeof raw === "string" ? Number(raw.replace(/[,\s$£€]/g, "")) : NaN;
      if (!Number.isFinite(n) || n < 0) return answer ? { error: `Enter a number for ${label}, like 5.` } : {};
      if (field.max !== undefined && n > field.max) return answer ? { error: `${label} can be at most ${field.max.toLocaleString("en-US")}.` } : {};
      if (!answer && opts.request !== undefined && !numberAppears(n, opts.request)) return {};
      return { value: n };
    }
    case "choice": {
      const o = matchOption(field, raw);
      if (!o) return answer ? { error: `Pick one of the options for ${label}.` } : {};
      return { value: o };
    }
    case "multichoice": {
      const items = Array.isArray(raw) ? raw : [raw];
      const picked: string[] = [];
      for (const item of items) {
        const o = matchOption(field, item);
        if (!o) { if (answer) return { error: `Pick from the options for ${label}.` }; continue; }
        if (!picked.includes(o)) picked.push(o);
      }
      return picked.length ? { value: picked } : {};
    }
    case "list": {
      const items = (Array.isArray(raw) ? raw : typeof raw === "string" ? raw.split(/\r?\n/) : [])
        .map(i => (typeof i === "string" ? i : typeof i === "number" ? String(i) : "").trim().replace(/^[-*•]\s*/, ""))
        .filter(Boolean);
      if (!items.length) return Array.isArray(raw) || typeof raw === "string" ? {} : answer ? { error: `${label} must be a list.` } : {};
      const max = field.max ?? DEFAULT_MAX.list;
      if (items.length > max) return answer ? { error: `Add up to ${max} items for ${label}.` } : { value: items.slice(0, max).map(i => i.slice(0, MAX_LIST_ITEM)) };
      if (items.some(i => i.length > MAX_LIST_ITEM)) return answer ? { error: `Keep each item in ${label} under ${MAX_LIST_ITEM} characters.` } : { value: items.map(i => i.slice(0, MAX_LIST_ITEM)) };
      return { value: items };
    }
  }
  return {};
}

/** Lower-case the first letter unless the word is an acronym (CSV, SQL). */
const lowerFirst = (s: string) => (s.length > 1 && s[1] === s[1].toLowerCase() ? s[0].toLowerCase() + s.slice(1) : s);

/** A plain question for a field, from its label when the model did not write a usable one. */
export function questionFor(field: SpecField): string {
  const label = field.label.trim();
  if (label.endsWith("?")) return label;
  const many = /^number of (.+)$/i.exec(label);
  if (many) return `How many ${many[1]}?`;
  if (field.type === "choice") return `Which ${lowerFirst(label)} do you want?`;
  if (field.type === "multichoice") return `Which ${lowerFirst(label)} do you want? Pick all that apply.`;
  return `Can you add the ${lowerFirst(label)}?`;
}

function usableQuestion(q: unknown): string | null {
  if (typeof q !== "string") return null;
  // Long dashes read as an AI tell in short copy; a comma does the same job.
  const v = q.replace(/\s*[–—]\s*/g, ", ").replace(/\s+/g, " ").trim();
  if (v.length < 8 || v.length > 160 || !v.endsWith("?")) return null;
  return v;
}

/** Up to three questions for required fields the spec does not fill yet, in the job type's field order. */
export function buildQuestions(jt: JobType, spec: Spec, modelQuestions: { field_id: string; question: string }[] = []): ClarifyingQuestion[] {
  const missing = jt.spec_fields.filter(f => f.required && isEmpty(spec[f.id]));
  return missing.slice(0, MAX_QUESTIONS).map(f => {
    const fromModel = usableQuestion(modelQuestions.find(q => q.field_id === f.id)?.question);
    const q: ClarifyingQuestion = { field_id: f.id, question: fromModel ?? questionFor(f) };
    if ((f.type === "choice" || f.type === "multichoice") && f.options?.length) q.options = [...f.options];
    return q;
  });
}

/** The job title buyers see in their list: the job type, plus a short detail when the spec has one. */
export function jobTitle(jt: JobType, spec: Spec): string {
  const detail = jt.spec_fields.find(f => f.required && f.type === "text" && typeof spec[f.id] === "string" && (spec[f.id] as string).length <= 60 && spec[f.id] !== IN_REQUEST);
  const value = detail ? (spec[detail.id] as string).replace(/[.\s]+$/, "") : "";
  return (value ? `${jt.title}: ${value}` : jt.title).slice(0, 120);
}

/** A title for a request we could not match to a job type yet. */
export function openTitle(text: string): string {
  const firstLine = text.trim().split(/\r?\n/)[0].replace(/\s+/g, " ");
  return firstLine.length > 70 ? `${firstLine.slice(0, 67).replace(/\s+\S*$/, "")}...` : firstLine;
}
