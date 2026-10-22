import { validateCustomMinds, type CustomMind } from "./custom-minds.ts";
type Library = { minds: CustomMind[]; revision: number };
export type MindSnapshot = Library & { mode: "local" | "loading" | "account"; userId: string | null; localMinds: CustomMind[]; busy: boolean; error: string };
const sameProfile = (a: CustomMind, b: CustomMind) => ["name", "specialty", "voice", "principles", "avoid", "examples"].every(k => a[k as keyof CustomMind] === b[k as keyof CustomMind]);
export function mergeBrowserMinds(remote: CustomMind[], local: CustomMind[]) {
  const merged = [...remote];
  for (const mind of local) {
    if (merged.some(m => sameProfile(m, mind))) continue;
    merged.push(merged.some(m => m.slug === mind.slug) ? { ...mind, slug: `my-mind-${crypto.randomUUID()}` } : mind);
  }
  return validateCustomMinds(merged);
}
/** Account data stays in memory. The existing anonymous library is never uploaded automatically. */
export class MindSync {
  private value: MindSnapshot;
  private listeners = new Set<() => void>();
  private epoch = 0;
  private token: (() => Promise<string>) | null = null;
  private loaded = false;
  private persistLocal: (minds: CustomMind[]) => void;
  private send: typeof fetch;
  constructor(local: CustomMind[], persistLocal: (minds: CustomMind[]) => void, send: typeof fetch = (input, init) => fetch(input, init)) {
    this.persistLocal = persistLocal; this.send = send;
    this.value = { mode: "loading", userId: null, minds: [], localMinds: local, revision: 0, busy: false, error: "" };
  }
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  snapshot = () => this.value;
  private set(patch: Partial<MindSnapshot>) { this.value = { ...this.value, ...patch }; this.listeners.forEach(l => l()); }
  connect(userId: string | null, token: (() => Promise<string>) | null, loading = false) {
    this.token = token;
    const mode = userId ? "account" : loading ? "loading" : "local";
    if (this.value.userId === userId && this.value.mode === mode) return;
    this.epoch++; this.loaded = false;
    this.set({ mode, userId, minds: mode === "local" ? this.value.localMinds : [], revision: 0, busy: false, error: "" });
    if (userId) void this.refresh();
  }
  replaceLocal(minds: CustomMind[]) { this.set({ localMinds: minds, ...(this.value.mode === "local" ? { minds } : {}) }); }
  private async request(method: string, epoch: number, body?: unknown): Promise<Library> {
    const token = await this.token?.();
    if (!token || epoch !== this.epoch) throw Error("Your account changed. Reopen your mind library and try again.");
    const response = await this.send("/api/minds", { method, headers: { authorization: `Bearer ${token}`, ...(body ? { "content-type": "application/json" } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}), cache: "no-store", signal: AbortSignal.timeout(20000) });
    if (epoch !== this.epoch) throw Error("Your account changed. Reopen your mind library and try again.");
    const data = await response.json();
    if (epoch !== this.epoch) throw Error("Your account changed. Reopen your mind library and try again.");
    if (!response.ok) {
      if (response.status === 401) { this.loaded = false; this.set({ minds: [], revision: 0 }); }
      throw Error(typeof data.error === "string" ? data.error : "Your account minds could not be saved. Try again.");
    }
    if (!Number.isSafeInteger(data.revision) || data.revision < 0 || !Array.isArray(data.minds)) throw Error("Your account library could not be read. Try again.");
    return { minds: validateCustomMinds(data.minds), revision: data.revision };
  }
  refresh = async () => {
    if (this.value.mode !== "account" || this.value.busy) return;
    const epoch = this.epoch; this.set({ busy: true, error: "" });
    try { const library = await this.request("GET", epoch); if (epoch === this.epoch) { this.loaded = true; this.set(library); } }
    catch (e) { if (epoch === this.epoch) this.set({ error: (e as Error).message || "Your account minds could not be loaded. Try again." }); }
    finally { if (epoch === this.epoch) this.set({ busy: false }); }
  };
  private async commit(minds: CustomMind[]) {
    const epoch = this.epoch;
    if (!this.loaded || this.value.busy) throw Error("Refresh your account minds before saving. Your draft is still here.");
    this.set({ busy: true, error: "" });
    try { const library = await this.request("PUT", epoch, { minds: validateCustomMinds(minds), revision: this.value.revision }); if (epoch === this.epoch) this.set(library); }
    catch (e) { if (epoch === this.epoch) this.set({ error: (e as Error).message }); throw e; }
    finally { if (epoch === this.epoch) this.set({ busy: false }); }
  }
  save = async (mind: CustomMind, expectedRevision?: number) => {
    if (this.value.mode === "loading") throw Error("Checking your account. Please wait before saving.");
    if (this.value.mode === "account" && expectedRevision !== undefined && expectedRevision !== this.value.revision) throw Error("Your library changed while this mind was open. Review the latest version before saving your draft.");
    const next = validateCustomMinds([...this.value.minds.filter(m => m.slug !== mind.slug), mind]);
    if (this.value.mode === "account") return this.commit(next);
    this.persistLocal(next); this.replaceLocal(next);
  };
  copyBrowserMinds = async (slugs?: string[]) => {
    if (this.value.mode !== "account") throw Error("Sign in to save these minds to your account.");
    const selected = this.value.localMinds.filter(m => !slugs || slugs.includes(m.slug));
    if (!selected.length) throw Error("Choose at least one browser mind to copy.");
    await this.commit(mergeBrowserMinds(this.value.minds, selected));
  };
  remove = async (slug: string) => {
    if (this.value.mode === "loading") throw Error("Checking your account. Please wait.");
    const next = this.value.minds.filter(m => m.slug !== slug);
    if (this.value.mode === "account") return this.commit(next);
    this.persistLocal(next); this.replaceLocal(next);
  };
  pendingLocal = () => this.value.localMinds.filter(m => !this.value.minds.some(saved => sameProfile(saved, m)));
}
