import { useSyncExternalStore } from "react";
import { validateCustomMinds, type CustomMind } from "./custom-minds";
const KEY = "abb:my-minds/1";
function read(): CustomMind[] { try { return validateCustomMinds(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch { return []; } }
let saved = read();
const listeners = new Set<() => void>();
export function saveMind(mind: CustomMind) {
  const next = validateCustomMinds([...saved.filter(m => m.slug !== mind.slug), mind]);
  // Report storage errors so the user can download a copy instead of believing it was saved.
  localStorage.setItem(KEY, JSON.stringify(next)); saved = next; listeners.forEach(l => l());
}
export function useMyMinds() { return useSyncExternalStore(l => { listeners.add(l); return () => listeners.delete(l); }, () => saved); }
if (typeof window !== "undefined") window.addEventListener("storage", e => { if (e.key === KEY) { saved = read(); listeners.forEach(l => l()); } });
