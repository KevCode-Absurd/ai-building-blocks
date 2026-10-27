import { library, libraryStorage } from "./library-storage";
// The person's me.md (docs/ME-FILE-PRD.md): a pasted or uploaded file, or the basics typed into 9 short fields.
// It is added to every skill they copy and every workflow they download, with only the sections the task needs.
// Saved to the signed-in account, or locally for guests, as one `abb:business` object (the file is its `me` field).
import { useSyncExternalStore } from "react";
import { ME_MAX_BYTES, meContext, meText, type TaskLike } from "./me-file";

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
/** The 9 fields, plus `me`: a pasted or uploaded me.md. Older saved objects have only the fields and still work. */
export type Business = Partial<Record<FieldId | "me", string>>;
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
  current = Object.fromEntries(Object.entries(next).filter(([, v]) => v && v.trim())) as Business;
  try { if (Object.keys(current).length) libraryStorage.setItem(KEY, JSON.stringify(current)); else libraryStorage.removeItem(KEY); } catch { /* private mode: keep it for this visit */ }
  emit();
}
export const getBusiness = () => current;
export function useBusiness(): Business {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => current);
}
export const hasBusiness = (b: Business) => Object.values(b).some((v) => v && v.trim());
export const hasMeFile = (b: Business) => !!b.me?.trim();

/** The whole me.md: the pasted file when there is one, otherwise one built from the fields. Empty when nothing is saved. */
export const businessText = (b: Business): string => meText(b);

/** What a task gets: the me.md sections it needs, its voice rule and the freshness rule (lib/me-file.ts). */
export const meFor = (b: Business, tasks: TaskLike[] = []) => meContext(businessText(b), tasks);

/** A skill with the person's me.md after it, ready to paste into a chat. */
export const withBusiness = (skill: string, b: Business, tasks: TaskLike[] = []) => {
  const about = meFor(b, tasks);
  return about ? `${skill.trim()}\n\n---\n\n${about}` : skill;
};
