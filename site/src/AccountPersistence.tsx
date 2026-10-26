import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { accountRoute, useComposerAccount } from "./lib/composer-account";
import { library, setAccountToken } from "./lib/library-storage";
import { Link, setSearch, useLocation } from "./lib/router";
import "./account.css";

type Account = ReturnType<typeof useComposerAccount>;
type PersistenceState = { account: Account; snapshot: ReturnType<typeof library.snapshot>; ready: boolean };
const PersistenceContext = createContext<PersistenceState | null>(null);
export function usePersistence() {
  const value = useContext(PersistenceContext);
  if (!value) throw Error("Saved work requires the account provider.");
  return value;
}

/** Saving runs silently. Account and recovery controls belong on /account. */
export function Persistence({ children, publicFallback }: { children: ReactNode; publicFallback?: ReactNode }) {
  const { path, search } = useLocation();
  const publicHome = path === "/" && !!publicFallback;
  const [accountActive, setAccountActive] = useState(!publicHome);
  useEffect(() => {
    if (!publicHome) { setAccountActive(true); return; }
    // Restore sessions after the public homepage has had a chance to paint.
    // Account recovery still runs; Clerk startup no longer delays first paint.
    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    let idleId = 0;
    const timer = window.setTimeout(() => {
      if (idleWindow.requestIdleCallback) idleId = idleWindow.requestIdleCallback(() => setAccountActive(true), { timeout: 1800 });
      else setAccountActive(true);
    }, 1200);
    return () => {
      window.clearTimeout(timer);
      if (idleWindow.cancelIdleCallback && idleId) idleWindow.cancelIdleCallback(idleId);
    };
  }, [publicHome]);
  // Clerk loads only for a possible session or an account page (lib/composer-account.ts); signed-out visitors skip it.
  const account = useComposerAccount(accountActive, false, accountRoute(path)), token = useRef(account.token);
  token.current = account.token;
  const snapshot = useSyncExternalStore(library.subscribe, library.snapshot);
  const user = account.state === "signed-in" ? account.userId : null;
  const handoffId = search.get("browser_save");
  useEffect(() => {
    if (account.state === "loading") return;
    const getToken = user ? (forceRefresh = false) => token.current(user, forceRefresh) : null;
    setAccountToken(getToken); library.connect(user, getToken, handoffId);
  }, [user, account.state, handoffId]);
  useEffect(() => { if (handoffId && user && snapshot.status === "saved" && library.handoffComplete(handoffId)) setSearch({ browser_save: "" }); }, [handoffId, user, snapshot.status]);
  useEffect(() => {
    const leaving = (e: BeforeUnloadEvent) => { if (library.snapshot().dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", leaving);
    return () => window.removeEventListener("beforeunload", leaving);
  }, []);
  useEffect(() => {
    if (!user) return;
    const sync = () => { if (document.visibilityState !== "hidden" && navigator.onLine !== false) void library.syncNow(); };
    const changed = (event: StorageEvent) => { if (event.key?.startsWith(`abb:account-library/1:${user}:`)) sync(); };
    const timer = window.setInterval(sync, 15000);
    window.addEventListener("focus", sync); window.addEventListener("online", sync);
    document.addEventListener("visibilitychange", sync); window.addEventListener("storage", changed);
    return () => { clearInterval(timer); window.removeEventListener("focus", sync); window.removeEventListener("online", sync); document.removeEventListener("visibilitychange", sync); window.removeEventListener("storage", changed); };
  }, [user]);
  // Keep the account boundary: a different user's saves must never flash during sign-in.
  const ready = account.state !== "loading" && snapshot.user === user && snapshot.status !== "loading";
  // The homepage is public. Let its real hero and task UI appear while account
  // restoration continues in the background; account-only routes still wait
  // for the verified account and matching saved-work snapshot above.
  return <PersistenceContext.Provider value={{ account, snapshot, ready }}>
    {ready || publicHome ? <div key={user ?? "guest"}>{children}</div> : publicFallback ?? <main className="wrap bp-hero"><p role="status">Opening your saved work…</p></main>}
  </PersistenceContext.Provider>;
}

export function AccountLink() {
  const { account, snapshot } = usePersistence();
  const problem = snapshot.status === "error" || snapshot.status === "conflict";
  return <Link to={problem ? "/account?view=settings" : account.state === "signed-in" ? "/account" : "/sign-up"} className="btn btn-ghost btn-sm account-link" data-testid="account-link">{account.state === "signed-in" ? "My account" : "Sign up"}{problem && <span className="account-alert-dot" aria-label="Saving needs attention" />}</Link>;
}

/** Only shown beside saved work, never as a site-wide banner. */
export function SaveHint({ subject = "work", onNavigate }: { subject?: string; onNavigate?: () => void }) {
  const { snapshot } = usePersistence();
  const problem = snapshot.status === "error" || snapshot.status === "conflict";
  return <p className="save-hint" role="status" data-testid="save-hint">
    {problem ? <Link to="/account?view=settings" onClick={onNavigate}>Saving needs attention. Open settings →</Link> : snapshot.user
      ? snapshot.status === "saving" ? "Saving…" : "Saved to your account."
      : <><Link to="/sign-up" onClick={onNavigate}>Sign up to save your {subject}</Link> across devices.</>}
  </p>;
}
