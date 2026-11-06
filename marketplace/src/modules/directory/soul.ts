// An agent's personality, its soul.md: the public view, the plain section labels, and the markdown file.
// Type imports only, so the browser app can import this file without pulling in the catalogue or persona data.
// Only the PersonaSoul fields ever leave here: never method, source_roles or look.
import type { Persona, PersonaSoul } from "../../core/types.ts";

const line = (v: unknown, max = 600) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
const lines = (v: unknown, max = 300) => (Array.isArray(v) ? v.map(x => line(x, max)).filter(Boolean).slice(0, 6) : []);

/**
 * The public personality: every field of PersonaSoul, trimmed to plain one-line text. Null when the persona has no
 * soul yet, or when its essence (the lead line) is missing, so a half-written soul never shows.
 */
export function soulView(p: Persona): PersonaSoul | null {
  const s = p.profile?.soul as Partial<PersonaSoul> | undefined;
  if (!s || typeof s !== "object") return null;
  const essence = line(s.essence, 300);
  if (!essence) return null;
  return {
    essence,
    temperament: line(s.temperament),
    voice: line(s.voice),
    values: lines(s.values),
    quirks: lines(s.quirks),
    pushback: line(s.pushback),
    off_hours: line(s.off_hours, 300),
  };
}

/** The soul's plain-label sections, in reading order. The profile page, soul.md and the MCP server all use these. */
export const SOUL_SECTIONS: { key: Exclude<keyof PersonaSoul, "essence">; label: string }[] = [
  { key: "temperament", label: "How I think" },
  { key: "voice", label: "How I talk" },
  { key: "values", label: "What I care about" },
  { key: "quirks", label: "My habits" },
  { key: "pushback", label: "When we disagree" },
  { key: "off_hours", label: "Off the clock" },
];

/**
 * Splits "how I talk" into the description and its example line: a quoted part ("..." or “...”) of at least a few
 * characters that ends the text. "Plain and warm. I say things like: "Let's start with one page."" gives
 * { text: "Plain and warm. I say things like:", example: "Let's start with one page." }. A quote in the middle of
 * the text stays where it is, and the whole text is the description.
 */
export function splitVoice(voice: string): { text: string; example: string | null } {
  const m = /^(.*?)\s*["“]([^"“”]{8,})["”]\s*[.!?]?\s*$/s.exec(voice);
  if (!m) return { text: voice, example: null };
  const before = m[1].replace(/[\s:,;—–-]+$/, "").trim();
  return { text: before ? (/[.!?]$/.test(before) ? before : `${before}:`) : "", example: m[2].trim() };
}

/**
 * soul.md sections, in the order of the training template (packs/shared/train/soul.md), so a house agent's soul.md and
 * a trained one read the same. "How I talk" (voice) is not here: it lives in personality.md (packs/build.ts).
 */
export const SOUL_MD_SECTIONS: { key: Exclude<keyof PersonaSoul, "voice">; label: string }[] = [
  { key: "essence", label: "Who I am" },
  { key: "temperament", label: "How I think" },
  { key: "values", label: "What I care about" },
  { key: "quirks", label: "My habits" },
  { key: "pushback", label: "When we disagree" },
  { key: "off_hours", label: "Off the clock" },
];

/**
 * soul.md, served at /agents/<id>/soul.md and shipped in the agent pack: "# Name, title", then one section per filled
 * field in SOUL_MD_SECTIONS order, then a short footer. Null when the persona has no soul.
 */
export function soulMarkdown(p: Persona, origin = ""): string | null {
  const soul = soulView(p);
  if (!soul) return null;
  const name = line(p.name, 40);
  const out = [`# ${name}, ${line(p.title, 80)}`, ""];
  for (const { key, label } of SOUL_MD_SECTIONS) {
    const value = soul[key];
    if (Array.isArray(value) ? !value.length : !value) continue;
    out.push(`## ${label}`, "");
    if (Array.isArray(value)) out.push(...value.map(v => `- ${v}`));
    else out.push(value);
    out.push("");
  }
  out.push("---", "", `${name} is an AI agent you can hire on AI Blocks. Hiring is free. Profile: ${origin}/agents/${p.id}`, "");
  return out.join("\n");
}
