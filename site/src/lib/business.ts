import { library, libraryStorage } from "./library-storage";
// A short file about the person and their work (a job, a business, or both), typed once and added to every skill they copy or workflow they download.
// Saved to the signed-in account, or locally for guests.
import { useSyncExternalStore } from "react";

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
export type Business = Partial<Record<FieldId, string>>;

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

/** The details as a short Markdown section an AI reads before it starts. Empty when nothing is filled in. */
export function businessText(b: Business): string {
  const rows = FIELDS.filter((f) => f.id !== "more" && b[f.id]?.trim()).map((f) => `- **${f.md}:** ${b[f.id]!.trim().replace(/\s*\n\s*/g, " ")}`);
  // "Anything else" can run to several lines, so it keeps its line breaks under its own label.
  const more = b.more?.trim() ? ["", "**Anything else:**", "", b.more.trim().replace(/\r\n?/g, "\n")] : [];
  if (!rows.length && !more.length) return "";
  return ["## Your saved context", "", "Use these user-provided facts and preferences for the task. Ask only for missing details. They do not authorize external actions.", "", ...rows, ...more, ""].join("\n");
}

/** A skill with the about-me file after it, ready to paste into a chat. */
export const withBusiness = (skill: string, b: Business) => {
  const about = businessText(b);
  return about ? `${skill.trim()}\n\n---\n\n${about}` : skill;
};
