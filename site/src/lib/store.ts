// Everything a person saves (kits, workflows, recently viewed) lives here.
// For now it is kept in this browser; moving it to a free account later only changes this file.
import { useSyncExternalStore } from "react";

export type Kit = { id: string; name: string; slugs: string[]; updated: number };
export type FlowNode = { id: string; slug: string; x: number; y: number; ecommerce?: boolean };
export type FlowEdge = { id: string; from: string; to: string; fromPort?: string; toPort?: string };
export type Flow = { id: string; name: string; nodes: FlowNode[]; edges: FlowEdge[]; updated: number };
/** `flows` are the workflows the person saved; `draft` is what the builder has open right now, kept as they work. */
type State = { kits: Kit[]; flows: Flow[]; recent: string[]; currentFlow: string | null; draft: Flow | null };

const KEY = "abb:v1";
const empty: State = { kits: [], flows: [], recent: [], currentFlow: null, draft: null };

function read(): State {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}
let state: State = read();
const listeners = new Set<() => void>();
function set(next: State) {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* storage full or blocked: keep working in memory */ }
  listeners.forEach((l) => l());
}
if (typeof window !== "undefined") window.addEventListener("storage", (e) => { if (e.key === KEY) { state = read(); listeners.forEach((l) => l()); } });

export function useStore<T>(pick: (s: State) => T): T {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => pick(state));
}
export const uid = () => Math.random().toString(36).slice(2, 10);

export const kits = {
  create(name: string, slugs: string[] = []): Kit {
    const kit = { id: uid(), name: name.trim() || "Untitled kit", slugs, updated: Date.now() };
    set({ ...state, kits: [kit, ...state.kits] });
    return kit;
  },
  toggle(kitId: string, slug: string) {
    set({ ...state, kits: state.kits.map((k) => k.id !== kitId ? k : { ...k, updated: Date.now(), slugs: k.slugs.includes(slug) ? k.slugs.filter((s) => s !== slug) : [...k.slugs, slug] }) });
  },
  rename(kitId: string, name: string) { set({ ...state, kits: state.kits.map((k) => (k.id === kitId ? { ...k, name, updated: Date.now() } : k)) }); },
  remove(kitId: string) { set({ ...state, kits: state.kits.filter((k) => k.id !== kitId) }); },
};

export const flows = {
  save(flow: Flow) {
    const f = { ...flow, updated: Date.now() };
    const exists = state.flows.some((x) => x.id === f.id);
    set({ ...state, currentFlow: f.id, draft: state.draft?.id === f.id ? f : state.draft, flows: exists ? state.flows.map((x) => (x.id === f.id ? f : x)) : [f, ...state.flows] });
  },
  /** Keep the builder's open workflow, saved or not, so a reload never loses work. */
  keep(flow: Flow) { set({ ...state, draft: flow }); },
  open(id: string | null) { set({ ...state, currentFlow: id, draft: id ? state.flows.find((f) => f.id === id) ?? null : null }); },
  draft() { return state.draft ?? this.current(); },
  remove(id: string) { set({ ...state, flows: state.flows.filter((f) => f.id !== id), currentFlow: state.currentFlow === id ? null : state.currentFlow }); },
  get(id: string | null) { return state.flows.find((f) => f.id === id) ?? null; },
  current() { return state.flows.find((f) => f.id === state.currentFlow) ?? null; },
};

/** Blocks get new names now and then; kits, workflows and history saved under an old name follow it. */
export function migrateSlugs(renamed: Record<string, string>) {
  const to = (s: string) => renamed[s] ?? s;
  const moved = (xs: string[]) => xs.some((s) => renamed[s]);
  if (!state.kits.some((k) => moved(k.slugs)) && ![...state.flows, ...(state.draft ? [state.draft] : [])].some((f) => moved(f.nodes.map((n) => n.slug))) && !moved(state.recent)) return;
  set({
    ...state,
    kits: state.kits.map((k) => ({ ...k, slugs: k.slugs.map(to) })),
    flows: state.flows.map((f) => ({ ...f, nodes: f.nodes.map((n) => ({ ...n, slug: to(n.slug) })) })),
    recent: state.recent.map(to),
    draft: state.draft && { ...state.draft, nodes: state.draft.nodes.map((n) => ({ ...n, slug: to(n.slug) })) },
  });
}

export function markViewed(slug: string) {
  if (state.recent[0] === slug) return;
  set({ ...state, recent: [slug, ...state.recent.filter((s) => s !== slug)].slice(0, 12) });
}

/** Blocks sent to the builder ("Add to builder", a workflow, a kit); the builder picks them up when told. */
const PENDING = "abb:pending";
export function queueForCanvas(slugs: string[], asNewFlow?: string) {
  try { sessionStorage.setItem(PENDING, JSON.stringify({ slugs, name: asNewFlow ?? null })); } catch { /* ignore */ }
  window.dispatchEvent(new Event(QUEUED));
}
export const QUEUED = "abb:queued";
export function takeQueued(): { slugs: string[]; name: string | null } {
  try {
    const v = JSON.parse(sessionStorage.getItem(PENDING) ?? "null");
    sessionStorage.removeItem(PENDING);
    return v && Array.isArray(v.slugs) ? v : { slugs: [], name: null };
  } catch { return { slugs: [], name: null }; }
}
