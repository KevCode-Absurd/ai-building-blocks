// A short file about the person and their work (a job, a business, or both), typed once and added to every skill they copy or workflow they download.
// Kept in this browser only, like kits and workflows. Nothing is sent anywhere.
import { useSyncExternalStore } from "react";

export const FIELDS = [
  { id: "name", label: "Your name, or your business's", md: "Name", hint: "Sprout" },
  { id: "sells", label: "What you do or sell", md: "What I do or sell", hint: "Greens gummies, $49.99 a month. Or for a job: I run Meta ads for three skincare brands" },
  { id: "buyer", label: "Who it's for", md: "Who it's for", hint: "Busy adults who gave up on greens powders. Or for a job: my manager and our clients" },
  { id: "why", label: "Why people pick you", md: "Why people pick me", hint: "6 g of fiber and 21 vitamins in gummies. No shaker, no chalky taste" },
  { id: "proof", label: "Proof you can point to", md: "Proof", hint: "Reviews, results you got, press, a money-back promise" },
  { id: "voice", label: "How you sound", md: "How I sound", hint: "Friendly and plain. A little funny. Never preachy about health" },
  { id: "site", label: "Website or profile", md: "Website", hint: "sprout.example" },
  { id: "avoid", label: "Anything your AI should never say", md: "Never say", hint: "No promises to cure or treat anything. No “detox”" },
] as const;
export type FieldId = (typeof FIELDS)[number]["id"];
export type Business = Partial<Record<FieldId, string>>;

const KEY = "abb:business";
const read = (): Business => { try { return JSON.parse(localStorage.getItem(KEY) ?? "{}") ?? {}; } catch { return {}; } };
let current: Business = typeof localStorage !== "undefined" ? read() : {};
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
if (typeof window !== "undefined") window.addEventListener("storage", (e) => { if (e.key === KEY) { current = read(); emit(); } });

export function setBusiness(next: Business) {
  current = Object.fromEntries(Object.entries(next).filter(([, v]) => v && v.trim())) as Business;
  try { if (Object.keys(current).length) localStorage.setItem(KEY, JSON.stringify(current)); else localStorage.removeItem(KEY); } catch { /* private mode: keep it for this visit */ }
  emit();
}
export const getBusiness = () => current;
export function useBusiness(): Business {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => current);
}
export const hasBusiness = (b: Business) => Object.values(b).some((v) => v && v.trim());

/** The details as a short Markdown section an AI reads before it starts. Empty when nothing is filled in. */
export function businessText(b: Business): string {
  const rows = FIELDS.filter((f) => b[f.id]?.trim()).map((f) => `- **${f.md}:** ${b[f.id]!.trim().replace(/\s*\n\s*/g, " ")}`);
  if (!rows.length) return "";
  return ["## About me and my work", "", "Use these details. Don't ask me again for anything listed here.", "", ...rows, ""].join("\n");
}

/** A skill with the about-me file after it, ready to paste into a chat. */
export const withBusiness = (skill: string, b: Business) => {
  const about = businessText(b);
  return about ? `${skill.trim()}\n\n---\n\n${about}` : skill;
};
