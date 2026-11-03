import { library, libraryStorage } from "./library-storage";
// Your brand file: the briefing you'd give a new hire, written once (docs/WRITING.md calls it "your brand file").
// It starts with 5 quick questions about the business, can grow with more detail, and can include the owner's
// personal me.md (docs/ME-FILE-PRD.md) as an optional part.
// It is added to every skill they copy, every specialist message and every workflow they download, with only the
// sections the task needs. Saved to the signed-in account, or locally for guests, as one `abb:business` object
// (the personal me.md is its `me` field). It is added in the browser at click time and never sent to our servers.
import { useSyncExternalStore } from "react";
import { ME_MAX_BYTES, meContext, meText, sectionsToMe, type TaskLike } from "./me-file";
import { REACH_CHOICES, orderByProfile as orderItems, type Reach } from "./profile-order";
export { GOAL_CHOICES, REACH_CHOICES, ordersPicks, profileScore, type ProfileLike, type Reach } from "./profile-order";

/** What the owner calls it everywhere on the site. */
export const BRAND_FILE = "brand file";
export const BRAND_FILE_TITLE = "Your brand file";

export const FIELDS = [
  { id: "name", label: "Your name or business", md: "Name", hint: "" },
  { id: "sells", label: "What you do or sell", md: "What I do or sell", hint: "" },
  { id: "buyer", label: "Who the work is for", md: "Who it's for", hint: "" },
  { id: "why", label: "What makes your work useful", md: "Why people pick me", hint: "" },
  { id: "proof", label: "Facts and proof to use", md: "Proof", hint: "" },
  { id: "voice", label: "Your writing style", md: "How I sound", hint: "" },
  { id: "site", label: "Website or profile", md: "Website", hint: "" },
  { id: "avoid", label: "Claims or topics to avoid", md: "Never say", hint: "" },
  { id: "more", label: "Other goals, limits or preferences", md: "Anything else", hint: "" },
] as const;
export type FieldId = (typeof FIELDS)[number]["id"];

/** The short first-run setup: 5 questions. Questions 4 and 5 also order picks (lib/profile-order.ts). */
export const SETUP_QUESTIONS = [
  { id: "name", label: "What is your business called?", placeholder: "For example: Sprout" },
  { id: "sells", label: "What do you sell or do?", placeholder: "For example: plant care kits and repotting at home" },
  { id: "buyer", label: "Who buys it?", placeholder: "For example: busy renters who want plants that live" },
  { id: "reach", label: "Where are your customers?", placeholder: "" },
  { id: "goal", label: "What do you want most right now?", placeholder: "Or write your own" },
] as const;
export const DETAIL_FIELDS = FIELDS.filter((f) => !SETUP_QUESTIONS.some((q) => q.id === f.id));

/** The 9 fields, the setup answers (`reach`, `area`, `goal`) and `me`: a pasted or uploaded personal me.md.
 *  Older saved objects have only the fields or only `me` and still work. */
export type Business = Partial<Record<FieldId | "reach" | "area" | "goal" | "me", string>>;
export { ME_MAX_BYTES };
export const meBytes = (text: string) => new TextEncoder().encode(text).length;

const KEY = "abb:business";
const read = (): Business => { try { return JSON.parse(libraryStorage.getItem(KEY) ?? "{}") ?? {}; } catch { return {}; } };
let current: Business = typeof localStorage !== "undefined" ? read() : {};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
library.subscribe(() => { current = read(); emit(); });
if (typeof window !== "undefined") window.addEventListener("storage", (e) => { if (e.key === KEY) { current = read(); emit(); } });

export function setBusiness(next: Business) {
  current = Object.fromEntries(Object.entries(next).filter(([, v]) => typeof v === "string" && v.trim())) as Business;
  try { if (Object.keys(current).length) libraryStorage.setItem(KEY, JSON.stringify(current)); else libraryStorage.removeItem(KEY); } catch { /* private mode: keep it for this visit */ }
  emit();
}
export const getBusiness = () => current;
export function useBusiness(): Business {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => current);
}
export const hasBusiness = (b: Business) => Object.values(b).some((v) => v && v.trim());
export const hasMeFile = (b: Business) => !!b.me?.trim();
/** How many of the 5 setup questions have an answer. */
export const setupAnswered = (b: Business) => SETUP_QUESTIONS.filter((q) => b[q.id]?.trim()).length;

const one = (s: string) => s.trim().replace(/\s*\n\s*/g, " ");
const row = (label: string, v?: string) => (v?.trim() ? [`- **${label}:** ${one(v)}`] : []);
/** "Where my customers are" in words: "Local, around Leeds". */
export function reachText(b: Business): string {
  const choice = REACH_CHOICES.find((r) => r.id === b.reach);
  const area = b.area?.trim() && b.reach !== "online" ? one(b.area) : "";
  return choice ? `${choice.md}${area ? `, around ${area}` : ""}` : area;
}

/** The 5 setup answers as a "Business basics" section. With a personal me.md saved, it carries all 5 (the me.md is
 *  about the person, these are about the business); the optional detail fields stay out, as before, because the
 *  me.md covers voice, proof and what to avoid. Without a me.md, name, sells and buyer are already in the me.md built
 *  from the fields, so it carries only where customers are and the main goal. */
function basicsSection(b: Business, withFields: boolean): string {
  const rows = [
    ...(withFields ? FIELDS.filter((f) => SETUP_QUESTIONS.some((q) => q.id === f.id)).flatMap((f) => row(f.md, b[f.id])) : []),
    ...row("Where my customers are", reachText(b)),
    ...row("Main goal right now", b.goal),
  ];
  return rows.join("\n");
}

/** The whole brand file: the business answers plus the personal me.md when there is one. Empty when nothing is saved.
 *  "Business basics" is a heading lib/me-file.ts doesn't know, so every task keeps it. */
export function businessText(b: Business): string {
  const me = meText(b);
  const basics = basicsSection(b, hasMeFile(b));
  if (!basics) return me;
  if (!me) return sectionsToMe([{ id: "other", title: "Business basics", body: basics }]);
  return `${me.trimEnd()}\n\n## Business basics\n\n${basics}\n`;
}

/** What a task gets: the brand file sections it needs, its voice rule and the freshness rule (lib/me-file.ts). */
export const meFor = (b: Business, tasks: TaskLike[] = []) => meContext(businessText(b), tasks);

/** A skill with the person's brand file after it, ready to paste into a chat. */
export const withBusiness = (skill: string, b: Business, tasks: TaskLike[] = []) => {
  const about = meFor(b, tasks);
  return about ? `${skill.trim()}\n\n---\n\n${about}` : skill;
};

/** Picks ordered by the brand file: a local business sees local-service items first, an online shop sees store
 *  items first, and the main goal breaks ties. Stable, and unchanged when nothing is saved. Client-side only. */
export function orderByProfile<T>(items: readonly T[], textOf: (item: T) => string, b: Business = current): T[] {
  return orderItems(items, b, textOf);
}
/** Which part the brand file drawer opens at. The me.md guide sets `me` before it opens the drawer. */
export const drawerFocus = { me: false };
export const isReach =(v: unknown): v is Reach => REACH_CHOICES.some((r) => r.id === v);
