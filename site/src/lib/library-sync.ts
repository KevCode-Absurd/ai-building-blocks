import { LIBRARY_KEYS, validateLibrary, type Library, type LibraryData } from "./library-data.ts";
import { browserSaves, mergeSignUpSaves, type BrowserSave } from "./signup-saves.ts";
import { LibraryMergeConflict, mergeLibraries, sameSavedValue } from "./merge-library.ts";
import { SaveDiagnostics, safeCode, safeErrorCode, safeDiagnostic, type SaveDiagnostic, type DiagnosticStage } from "./save-diagnostics.ts";
type Status = "local" | "loading" | "saving" | "saved" | "error" | "conflict";
type Snapshot = Library & { user: string | null; status: Status; error: string; dirty: boolean; retryAt: number | null; failure: { stage: string; status: number; code: string | null; at: number } | null };
type AccountToken = (forceRefresh?: boolean) => Promise<string>;
class SaveFailure extends Error {
  readonly retryable: boolean;
  readonly status: number;
  readonly notBefore: number;
  readonly stage: string;
  readonly code: string | null;
  constructor(message: string, retryable: boolean, status = 0, notBefore = 0, stage = status ? "http" : "transport", code: string | null = null) {
    super(message); this.retryable = retryable; this.status = status; this.notBefore = notBefore; this.stage = stage; this.code = code;
  }
}
// Diagnostic identifiers only; saved content, tokens, URLs and exception messages are excluded.
const failureCode = safeErrorCode;
function retryAfter(response: Response) {
  const raw = response.headers.get("retry-after");
  if (!raw) return 0;
  const seconds = Number(raw), date = Number.isFinite(seconds) ? Date.now() + Math.max(0, seconds) * 1000 : Date.parse(raw);
  return Number.isFinite(date) ? date : 0;
}
type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem"> & Partial<Pick<Storage, "key" | "length">>;
/** Every request is tied to an account epoch; stale responses never replace another user's work. */
export class LibrarySync {
  private value: Snapshot = { data: {}, revision: 0, user: null, status: "local", error: "", dirty: false, retryAt: null, failure: null };
  private epoch = 0;
  private generation = 0;
  private token: AccountToken | null = null;
  private loaded = false;
  private base: Library | null = null;
  private busy = false;
  private timer: ReturnType<typeof setTimeout> | undefined;
  private retryTimer: ReturnType<typeof setTimeout> | undefined;
  private retryAttempt = 0;
  private retryNotBefore = 0;
  private blocked = false;
  private listeners = new Set<() => void>();
  private beforeListeners = new Set<() => void>();
  private remoteListeners = new Set<(keys: string[]) => void>();
  private storage: StorageLike;
  private send: typeof fetch;
  private tab: string;
  private handoffId: string | null = null;
  private completedHandoffs = new Set<string>();
  readonly diagnostics: SaveDiagnostics;
  private lastDiagnostic: SaveDiagnostic | null = null;
  constructor(storage: StorageLike, send: typeof fetch = fetch, tab = "default") {
    this.storage = storage; this.send = send; this.tab = tab; this.value.data = this.guestData();
    this.diagnostics = new SaveDiagnostics(storage); this.diagnostics.read();
  }
  snapshot = () => this.value;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => this.listeners.delete(listener); };
  beforeSync = (listener: () => void) => { this.beforeListeners.add(listener); return () => this.beforeListeners.delete(listener); };
  onRemote = (listener: (keys: string[]) => void) => { this.remoteListeners.add(listener); return () => this.remoteListeners.delete(listener); };
  private captureEditors() { this.beforeListeners.forEach(listener => listener()); }
  private received(before: LibraryData) { const keys = LIBRARY_KEYS.filter(key => before[key] !== this.value.data[key]); if (keys.length) this.remoteListeners.forEach(listener => listener(keys)); }
  private emit(patch: Partial<Snapshot>) { this.value = { ...this.value, ...patch }; this.listeners.forEach(l => l()); }
  private cacheKey() { return `abb:account-library/1:${this.value.user}:${this.tab}`; }
  private diagnostic(event: Partial<SaveDiagnostic>) {
    this.lastDiagnostic = safeDiagnostic({ ...event, at: Date.now(), attempt: this.retryAttempt + 1 });
    this.diagnostics.record(this.lastDiagnostic);
  }
  private recovered(confirmed = false) {
    if (confirmed && this.lastDiagnostic) this.diagnostics.record({ ...this.lastDiagnostic, event: "recovered", code: "recovered", status: 200 });
    this.lastDiagnostic = null;
    clearTimeout(this.retryTimer); this.retryTimer = undefined;
    this.retryAttempt = 0; this.retryNotBefore = 0; this.blocked = false;
    if (this.value.retryAt !== null || this.value.failure !== null) this.emit({ retryAt: null, failure: null });
  }
  private failed(error: unknown) {
    const failure = error instanceof SaveFailure ? error : null;
    if (!failure) this.diagnostic({ stage: "merge", code: error instanceof LibraryMergeConflict ? "merge_conflict" : safeErrorCode(error), operation: "LOCAL" });
    const detail = failure ? { stage: failure.stage, status: failure.status, code: failure.code, at: Date.now() } : null;
    this.blocked = error instanceof LibraryMergeConflict || !failure?.retryable;
    clearTimeout(this.retryTimer); this.retryTimer = undefined;
    if (this.blocked) {
      this.emit({ status: error instanceof LibraryMergeConflict ? "conflict" : "error", error: (error as Error).message, retryAt: null, failure: detail });
      return;
    }
    const delay = Math.min(30000, 1000 * 2 ** Math.min(this.retryAttempt++, 5)) * (0.8 + Math.random() * 0.4);
    this.retryNotBefore = Math.max(Date.now() + delay, failure!.notBefore);
    this.emit({ status: "error", error: failure!.message + " Your changes are kept on this device and will retry automatically.", retryAt: this.retryNotBefore, failure: detail });
    const epoch = this.epoch;
    const retry = () => {
      if (epoch !== this.epoch || !this.value.user || this.blocked) return;
      const remaining = this.retryNotBefore - Date.now();
      if (remaining > 0) { this.retryTimer = setTimeout(retry, Math.min(remaining, 2147483647)); this.unrefRetry(); return; }
      this.retryTimer = undefined; void this.syncNow();
    };
    this.retryTimer = setTimeout(retry, Math.min(Math.max(0, this.retryNotBefore - Date.now()), 2147483647)); this.unrefRetry();
  }
  private unrefRetry() { (this.retryTimer as unknown as { unref?: () => void })?.unref?.(); }
  private waiting() { return this.blocked || Date.now() < this.retryNotBefore; }
  guestData(): LibraryData {
    const data: LibraryData = {};
    for (const key of LIBRARY_KEYS) { try { const raw = this.storage.getItem(key); if (raw !== null) data[key] = raw; } catch {} }
    return data;
  }
  private persist() {
    try {
      if (this.value.user) this.storage.setItem(this.cacheKey(), JSON.stringify({ data: this.value.data, revision: this.value.revision, dirty: this.value.dirty, ...(this.value.dirty ? { base: this.base } : {}), at: Date.now() }));
      return true;
    } catch (error) { this.diagnostic({ operation: "LOCAL", stage: "storage", code: safeErrorCode(error) }); this.emit({ status: "error", error: "Device storage is unavailable. Keep this page open and download a backup until account saving succeeds." }); return false; }
  }
  prepareSignUp() {
    if (this.value.user) return null;
    const data = validateLibrary(this.guestData());
    if (!Object.keys(data).length) return null;
    const id = crypto.randomUUID();
    this.storage.setItem(`abb:signup-saves/1:${id}`, JSON.stringify({ id, capturedAt: Date.now(), data, user: null }));
    return id;
  }
  handoffComplete(id: string) { return this.completedHandoffs.has(id); }
  private pendingHandoff(): (BrowserSave & { user: string | null }) | null {
    if (!this.value.user) return null;
    if (!this.handoffId) {
      for (let i = 0; i < (this.storage.length ?? 0); i++) {
        const key = this.storage.key?.(i); if (!key?.startsWith("abb:signup-saves/1:")) continue;
        const saved = JSON.parse(this.storage.getItem(key) ?? "null");
        if (saved?.user === this.value.user) { this.handoffId = saved.id; break; }
      }
    }
    if (!this.handoffId) return null;
    const key = `abb:signup-saves/1:${this.handoffId}`;
    const pending = JSON.parse(this.storage.getItem(key) ?? "null");
    if (!pending || pending.id !== this.handoffId || pending.user && pending.user !== this.value.user) return null;
    // Claim once; switching accounts cannot transfer this signup's saves to another person.
    if (!pending.user) { pending.user = this.value.user; this.storage.setItem(key, JSON.stringify(pending)); }
    return pending;
  }
  private finishHandoff(id: string) {
    this.completedHandoffs.add(id);
    try { this.storage.removeItem(`abb:signup-saves/1:${id}`); } catch {}
  }
  connect(user: string | null, token: AccountToken | null, handoffId: string | null = null) {
    this.token = token;
    if (this.value.user === user && this.loaded && (this.handoffId === handoffId || !handoffId)) { this.handoffId = handoffId; return; }
    this.handoffId = handoffId;
    clearTimeout(this.timer); this.epoch++; this.busy = false; this.loaded = !user;
    this.recovered();
    this.base = null;
    let data = user ? {} : this.guestData(), revision = 0, dirty = false;
    if (user) try {
      let cached = JSON.parse(this.storage.getItem(`abb:account-library/1:${user}:${this.tab}`) ?? "null");
      if (!cached || cached.recoveredBy) {
        const candidates: { key: string; value: { data: LibraryData; revision: number; dirty: boolean; at: number; recoveredBy?: string } }[] = [];
        for (let i = 0; i < (this.storage.length ?? 0); i++) {
          const key = this.storage.key?.(i);
          if (!key?.startsWith(`abb:account-library/1:${user}:`) || key.includes(":recovery:")) continue;
          const value = JSON.parse(this.storage.getItem(key) ?? "null");
          if (value?.dirty && !value.recoveredBy) candidates.push({ key, value });
        }
        const latest = candidates.sort((a, b) => b.value.at - a.value.at)[0];
        cached = latest?.value;
        if (latest) {
          // Move the recovery pointer only after the new copy has been durably written.
          this.storage.setItem(`abb:account-library/1:${user}:${this.tab}`, JSON.stringify(cached));
          this.storage.setItem(latest.key, JSON.stringify({ ...latest.value, recoveredBy: this.tab }));
        }
      }
      if (cached) { data = validateLibrary(cached.data); if (!Number.isSafeInteger(cached.revision) || cached.revision < 0) throw Error(); revision = cached.revision; dirty = !!cached.dirty;
        if (!dirty) this.base = { data, revision };
        else if (cached.base && cached.base.revision === revision) this.base = { data: validateLibrary(cached.base.data), revision };
      }
    } catch {}
    this.emit({ user, data, revision, dirty, status: user ? "loading" : "local", error: "", retryAt: null, failure: null });
    if (user) void this.refresh();
  }
  read(key: string) { return this.value.data[key as keyof LibraryData] ?? null; }
  reloadGuest() { if (!this.value.user) this.emit({ data: this.guestData() }); }
  write(key: string, raw: string | null) {
    if (!LIBRARY_KEYS.includes(key as keyof LibraryData)) throw Error("Unknown storage key");
    const existing = this.read(key);
    if (existing === raw) return;
    if (existing && raw) { try { if (sameSavedValue(JSON.parse(existing), JSON.parse(raw))) return; } catch {} }
    // A newly corrected payload gets a new autosave attempt; permission/session
    // failures and true conflicts still require their own resolution.
    if (this.blocked && [400, 413, 422].includes(this.value.failure?.status ?? 0)) this.recovered();
    const data = { ...this.value.data }; if (raw === null) delete data[key as keyof LibraryData]; else data[key as keyof LibraryData] = raw;
    this.generation++;
    this.emit({ data, dirty: !!this.value.user, ...(this.value.user && this.value.status !== "conflict" && !this.waiting() ? { status: "saving" as const } : {}) });
    if (!this.value.user) {
      try { raw === null ? this.storage.removeItem(key) : this.storage.setItem(key, raw); }
      catch (error) { this.diagnostic({ operation: "LOCAL", stage: "storage", code: safeErrorCode(error) }); this.emit({ status: "error", error: "This browser cannot save your work. Keep this page open and download a backup." }); }
    } else { this.persist(); clearTimeout(this.timer); this.timer = setTimeout(() => void this.flush(), 700); }
  }
  private async request(method: string, epoch: number, body?: unknown, merging = false): Promise<Library> {
    for (let fresh = 0; fresh < 2; fresh++) {
      const started = Date.now();
      let responseId: string | null = null;
      const note = (stage: DiagnosticStage, code: unknown, status = 0) => {
        if (epoch === this.epoch) this.diagnostic({ operation: method as "GET" | "PUT", stage, code: safeCode(code), status, requestId: responseId, elapsedMs: Date.now() - started });
      };
      let token: string | undefined;
      let tokenTimeout: ReturnType<typeof setTimeout> | undefined;
      try { token = await Promise.race([
        this.token?.(fresh === 1),
        new Promise<never>((_resolve, reject) => { tokenTimeout = setTimeout(() => reject(new DOMException("Sign-in verification timed out.", "TimeoutError")), 20000); }),
      ]); }
      catch (error) {
        if ((error as { code?: string }).code === "AUTH_SESSION_REQUIRED") { note("token", "session_required", 401); throw new SaveFailure("Sign in again to finish saving your retained changes.", false, 401); }
        note("token", failureCode(error));
        throw new SaveFailure("Sign-in verification is temporarily unavailable.", true, 0, 0, "token", failureCode(error));
      }
      finally { clearTimeout(tokenTimeout); }
      if (!token || epoch !== this.epoch) { if (!token) note("token", "session_required", 401); throw new SaveFailure("Account changed. Reopen your saved work.", false); }
      let response: Response;
      try { response = await this.send("/api/library", { method, headers: { authorization: `Bearer ${token}`, ...(body ? { "content-type": "application/json" } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}), cache: "no-store", signal: AbortSignal.timeout(20000) }); }
      catch (error) { note("transport", failureCode(error)); throw new SaveFailure("The connection to account saving was interrupted.", true, 0, 0, "transport", failureCode(error)); }
      if (epoch !== this.epoch) throw new SaveFailure("Account changed.", false);
      responseId = response.headers.get("x-save-request-id");
      // Refresh a cached/expired token once, without weakening server-side verification.
      if (response.status === 401 && fresh === 0) { note("auth", response.headers.get("x-save-error-code") ?? "http_error", 401); await response.body?.cancel(); continue; }
      let result: { error?: string; revision?: number; data?: unknown } = {};
      try { const parsed: unknown = await response.json(); if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) result = parsed; }
      catch { if (response.ok) { note("response", "invalid_response", response.status); throw new SaveFailure("Account saving returned an incomplete response.", true); } }
      if (epoch !== this.epoch) throw new SaveFailure("Account changed.", false);
      if (!response.ok) {
        const diagnostic = safeDiagnostic({ stage: response.headers.get("x-save-error-stage") as DiagnosticStage });
        note(response.headers.has("x-save-error-stage") ? diagnostic.stage : "http", response.headers.get("x-save-error-code") ?? "http_error", response.status);
        if (response.status === 409 && !merging) this.emit({ status: "conflict" });
        // The active SDK session may outlive a temporary verification outage. Keep
        // retrying with fresh credentials; an ended session stops via AUTH_SESSION_REQUIRED.
        const retryable = [401, 408, 425, 429].includes(response.status) || response.status >= 500;
        throw new SaveFailure(result.error ?? (retryable ? "Account saving is temporarily unavailable." : "Account saving needs attention."), retryable, response.status, retryAfter(response), response.headers.has("x-save-error-stage") ? diagnostic.stage : "http", safeCode(response.headers.get("x-save-error-code") ?? "http_error"));
      }
      if (!Number.isSafeInteger(result.revision) || result.revision! < 0) { note("response", "invalid_response", response.status); throw new SaveFailure("Invalid account copy. Your device copy is retained.", false); }
      try { return { data: validateLibrary(result.data), revision: result.revision! }; }
      catch { note("response", "invalid_response", response.status); throw new SaveFailure("Invalid account copy. Your device copy is retained.", false); }
    }
    throw new SaveFailure("Sign in again to finish saving your retained changes.", false, 401);
  }
  private rebase(remote: Library): LibraryData {
    if (remote.revision === this.value.revision) return this.value.data;
    if (sameSavedValue(remote.data, this.value.data)) return remote.data;
    if (!this.base || this.base.revision !== this.value.revision) throw new LibraryMergeConflict();
    return mergeLibraries(this.base.data, this.value.data, remote.data);
  }
  refresh = async () => {
    if (!this.value.user || this.busy || this.value.status === "conflict" || this.waiting()) return;
    this.captureEditors();
    const epoch = this.epoch; this.busy = true;
    try {
      let remote = await this.request("GET", epoch);
      if (epoch !== this.epoch) return;
      this.captureEditors();
      if (this.handoffId && browserSaves(remote.data).some(save => save.id === this.handoffId)) this.finishHandoff(this.handoffId);
      const pending = this.pendingHandoff();
      if (pending && !this.value.dirty) {
        for (let attempt = 0; attempt < 4; attempt++) {
          if (epoch !== this.epoch) return;
          if (browserSaves(remote.data).some(save => save.id === pending.id)) { this.finishHandoff(pending.id); break; }
          const merged = mergeSignUpSaves(remote.data, pending);
          if (merged === remote.data) { this.finishHandoff(pending.id); break; }
          const generation = this.generation;
          try {
            const saved = await this.request("PUT", epoch, { data: merged, revision: remote.revision }, true);
            if (epoch !== this.epoch) return;
            this.captureEditors();
            // Edits made while the import was uploading remain local deltas against its starting copy.
            if (this.value.dirty && this.generation !== generation) {
              const local = mergeLibraries(this.base?.data ?? remote.data, this.value.data, saved.data);
              this.base = saved; this.emit({ data: local, revision: saved.revision });
            }
            remote = saved; this.finishHandoff(pending.id); break;
          } catch (error) { if ((error as { status?: number }).status !== 409 || attempt === 3) throw error; remote = await this.request("GET", epoch); }
        }
      }
      this.captureEditors();
      const before = this.value.data;
      const data = this.value.dirty ? this.rebase(remote) : remote.data;
      const dirty = !sameSavedValue(data, remote.data);
      this.recovered(true);
      this.base = remote; this.loaded = true;
      if (this.value.revision !== remote.revision || !sameSavedValue(before, data) || this.value.status !== (dirty ? "saving" : "saved")) {
        this.emit({ data, revision: remote.revision, dirty, status: dirty ? "saving" : "saved", error: "" }); this.persist(); this.received(before);
      }
    } catch (error) { if (epoch === this.epoch) this.failed(error); }
    finally { if (epoch === this.epoch) {
      this.busy = false;
      if (this.loaded && this.value.dirty && this.value.status === "saving") void this.flush();
    } }
  };
  flush = async () => {
    if (!this.value.user || this.busy || this.value.status === "conflict" || this.waiting()) return;
    this.captureEditors();
    if (!this.value.dirty) return;
    if (!this.loaded) { await this.refresh(); return; }
    const epoch = this.epoch; this.busy = true; this.emit({ status: "saving", error: "" });
    try {
      for (let attempt = 0; attempt < 4; attempt++) {
        const generation = this.generation, data = structuredClone(this.value.data), revision = this.value.revision;
        try {
          const saved = await this.request("PUT", epoch, { data, revision }, true);
          if (epoch !== this.epoch) return;
          this.captureEditors();
          this.base = saved;
          const dirty = generation !== this.generation;
          this.recovered(true);
          this.emit({ revision: saved.revision, dirty, status: dirty ? "saving" : "saved", error: "" }); this.persist();
          break;
        } catch (error) {
          if ((error as { status?: number }).status !== 409) throw error;
          const remote = await this.request("GET", epoch);
          if (epoch !== this.epoch) return;
          this.captureEditors();
          const before = this.value.data, merged = this.rebase(remote);
          this.base = remote;
          const dirty = !sameSavedValue(merged, remote.data);
          if (!dirty) this.recovered(true);
          this.emit({ data: merged, revision: remote.revision, dirty, status: dirty ? "saving" : "saved", error: "" }); this.persist(); this.received(before);
          if (!dirty) break;
          if (attempt === 3) throw new SaveFailure("Several devices are saving at once.", true);
        }
      }
    } catch (error) { if (epoch === this.epoch) this.failed(error); }
    finally { if (epoch === this.epoch) {
      this.busy = false;
      if (this.value.status === "saving" && this.value.dirty) void this.flush();
      else if (this.value.status === "saved" && this.pendingHandoff()) void this.refresh();
    } }
  };
  syncNow = async () => { if (!this.value.user || this.busy || this.value.status === "conflict") return; this.captureEditors(); await (this.value.dirty ? this.flush() : this.refresh()); };
  retry = async () => { this.blocked = false; await this.syncNow(); };
  /** Do not end the session while the latest work exists only on this device. */
  async saveBeforeSignOut(expectedUser: string) {
    this.captureEditors();
    const epoch = this.epoch, deadline = Date.now() + 30000;
    clearTimeout(this.timer);
    for (;;) {
      if (epoch !== this.epoch || this.value.user !== expectedUser) throw Error("Your account changed. Please try signing out again.");
      if (Date.now() >= deadline) throw Error("Saving is taking longer than expected. You’re still signed in. Please try again.");
      if (Date.now() < this.retryNotBefore) { await new Promise(resolve => setTimeout(resolve, Math.min(250, this.retryNotBefore - Date.now()))); continue; }
      if (this.busy) { await new Promise(resolve => setTimeout(resolve, 25)); continue; }
      if (this.value.status === "conflict") throw Error("Another device saved changes. Open saving settings to keep both copies before signing out.");
      if (!this.loaded || (!this.value.dirty && this.pendingHandoff())) await this.refresh();
      else if (this.value.dirty) await this.flush();
      else if (this.value.status === "saved") return;
      else throw Error("Your latest work hasn’t reached your account yet. You’re still signed in. Please reconnect and try again.");
      const completed = this.snapshot();
      if (completed.status === "error") throw Error("Your latest work hasn’t reached your account. You’re still signed in. Reconnect or open saving settings, then try again.");
      if (completed.status === "conflict") throw Error(completed.error || "Your work hasn’t finished saving. Open saving settings before signing out.");
    }
  }
  async loadAccountCopy() {
    // The UI downloads the pending copy first. Preserve an additional recovery copy on this device.
    if (this.busy) return;
    if (this.value.dirty) this.storage.setItem(`${this.cacheKey()}:recovery:${Date.now()}`, JSON.stringify(this.value.data));
    this.recovered();
    this.emit({ dirty: false, status: "loading" }); this.loaded = false; await this.refresh();
  }
  importGuest() { this.importData(this.guestData()); }
  importData(input: LibraryData) {
    if (this.value.user && (!this.loaded || this.value.status === "conflict")) throw Error("Load your account before importing saved data.");
    const guest = validateLibrary(input);
    const same = (a: Record<string, unknown>, b: Record<string, unknown>) => { const { id: _a, ...left } = a, { id: _b, ...right } = b; return JSON.stringify(left) === JSON.stringify(right); };
    for (const key of LIBRARY_KEYS) {
      if (!guest[key]) continue;
      if (key === "abb:v1" && this.read(key)) {
        const remote = JSON.parse(this.read(key)!), local = JSON.parse(guest[key]!);
        for (const field of ["kits", "flows"]) {
          const merged = [...remote[field]];
          for (const entry of local[field]) { if (merged.some(x => same(x, entry))) continue; merged.push(merged.some(x => x.id === entry.id) ? { ...entry, id: crypto.randomUUID() } : entry); }
          remote[field] = merged;
        }
        if (!remote.draft && local.draft) remote.draft = local.draft;
        else if (local.draft && !same(remote.draft, local.draft) && !remote.flows.some((f: Record<string, unknown>) => same(f, local.draft))) remote.flows.push({ ...local.draft, id: crypto.randomUUID() });
        this.write(key, JSON.stringify(remote));
      } else if (!this.read(key)) this.write(key, guest[key]!);
    }
  }
}
