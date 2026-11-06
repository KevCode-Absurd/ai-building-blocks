// Sign-in state for the browser app. Clerk loads lazily; /api/me says what the signed-in person may do.
// Local dev (APP_ENV=local) has a demo sign-in instead, because the live Clerk app only works on useaiblocks.com domains.
import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import type { Clerk } from "@clerk/clerk-js";
import { maybeSignedIn, PUBLIC_PAGE } from "./session-hint.ts";

export interface Me {
  user: { id: string; email: string | null; emailVerified: boolean; name: string | null };
  orgId: string;
  roles: { ops: boolean; reviewer: boolean };
  betaAccess: boolean;
  /** May start jobs that run on AI Blocks: ops only while HOSTED_JOBS is off. */
  hostedJobs: boolean;
  expert: { id: string; status: "applied" | "approved" | "rejected" | "paused"; displayName: string; founding: boolean } | null;
}

export interface AppConfig { clerkPublishableKey: string; env: string; inviteOnly: boolean; hostedJobs?: boolean; libraryUrl: string }

interface AuthState {
  loaded: boolean;
  config: AppConfig | null;
  signedIn: boolean;
  me: Me | null;
  displayName: string;
  getToken(): Promise<string | null>;
  /** Sends the visitor to sign in (Clerk's own page), then back to `next` (a path on this site; default: here). */
  openSignIn(next?: string, opts?: { signUp?: boolean }): void;
  signOut(): Promise<void>;
  refreshMe(): Promise<void>;
  /** Local dev only. */
  demoSignIn?(userId: string): void;
}

const AuthContext = createContext<AuthState | null>(null);

/** A path on this site to come back to after sign-in. Anything else (another site, "//host", a backslash trick)
 *  becomes "/", and so does the sign-in page itself, so it never loops. */
export function safeNext(raw: string | null | undefined): string {
  const next = (raw ?? "").trim();
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\") || /[\u0000-\u001f]/.test(next)) return "/";
  if (next === "/sign-in" || next.startsWith("/sign-in?") || next.startsWith("/sign-in/")) return "/";
  return next;
}

/** The sign-in page, set to come back to `next` (default: the page the visitor is on now). */
export function signInHref(next?: string): string {
  const here = typeof location === "undefined" ? "/" : location.pathname === "/sign-in" ? safeNext(new URLSearchParams(location.search).get("next")) : location.pathname + location.search;
  const target = safeNext(next ?? here);
  return target === "/" ? "/sign-in" : `/sign-in?next=${encodeURIComponent(target)}`;
}
const DEMO_KEY = "agents.demoUser";

// The no-rhc build is Clerk's headless client: it has no UI components (openSignIn would throw "Clerk was not loaded
// with Ui components"). Sign-in and sign-up happen on Clerk's own pages, as on the library (useaiblocks.com), and come
// back to the page the visitor was on.
let clerkPromise: Promise<Clerk> | null = null;
function loadClerk(key: string): Promise<Clerk> {
  clerkPromise ??= import("@clerk/clerk-js/no-rhc").then(async ({ Clerk }) => {
    const clerk = new Clerk(key);
    await clerk.load();
    return clerk;
  });
  return clerkPromise;
}

let tokenGetter: () => Promise<string | null> = async () => null;
let demoUser: string | null = null;
/** Headers for API calls: the Clerk session token, or the demo user locally. */
export async function authHeaders(): Promise<Record<string, string>> {
  if (demoUser) return { "x-test-user": demoUser };
  const token = await tokenGetter();
  return token ? { authorization: `Bearer ${token}` } : {};
}

export function AuthProvider(props: { children: ComponentChildren }) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [clerk, setClerk] = useState<Clerk | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [me, setMe] = useState<Me | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");

  const refreshMe = async () => {
    const headers = await authHeaders();
    if (!headers.authorization && !headers["x-test-user"]) { setMe(null); return; }
    const res = await fetch("/api/me", { headers });
    setMe(res.ok ? await res.json() : null);
  };

  const startClerk = async (cfg: AppConfig): Promise<Clerk> => {
    const c = await loadClerk(cfg.clerkPublishableKey);
    tokenGetter = async () => (await c.session?.getToken()) ?? null;
    setClerk(c);
    const sync = async () => {
      setSignedIn(!!c.user);
      setName(c.user?.firstName ?? c.user?.primaryEmailAddress?.emailAddress ?? "");
      await refreshMe();
    };
    c.addListener(() => { void sync(); });
    await sync();
    return c;
  };

  useEffect(() => {
    (async () => {
      const cfg: AppConfig = await fetch("/api/config").then(r => r.json());
      setConfig(cfg);
      if (cfg.env === "local") {
        demoUser = localStorage.getItem(DEMO_KEY);
        setSignedIn(!!demoUser); setName(demoUser ?? "");
        await refreshMe(); setLoaded(true);
        return;
      }
      if (!PUBLIC_PAGE.test(location.pathname) || maybeSignedIn(document.cookie, location.search)) {
        try { await startClerk(cfg); } finally { setLoaded(true); }
      } else {
        setLoaded(true);
      }
    })();
  }, []);

  const state: AuthState = {
    loaded, config, signedIn, me, displayName: name,
    getToken: () => tokenGetter(),
    openSignIn: (next?: string, opts?: { signUp?: boolean }) => {
      const back = new URL(next === undefined ? location.pathname + location.search : safeNext(next), location.origin).href;
      if (config?.env === "local") {
        const id = prompt("Demo user id (local only)", "user_demo") ?? "";
        if (id) { state.demoSignIn!(id); if (back !== location.href) location.assign(back); }
        return;
      }
      const urls = { signInForceRedirectUrl: back, signUpForceRedirectUrl: back };
      void (async () => {
        // Clerk was skipped for a signed-out visitor: load it now. If they turn out to be signed in, just use that.
        const c = clerk ?? (config ? await startClerk(config) : null);
        if (!c || (!clerk && c.user)) return;
        await (opts?.signUp ? c.redirectToSignUp(urls) : c.redirectToSignIn(urls));
      })();
    },
    signOut: async () => {
      if (config?.env === "local") { localStorage.removeItem(DEMO_KEY); demoUser = null; setSignedIn(false); setMe(null); return; }
      await clerk?.signOut(); setMe(null);
    },
    refreshMe,
    demoSignIn: (id: string) => { localStorage.setItem(DEMO_KEY, id); demoUser = id; setSignedIn(true); setName(id); void refreshMe(); },
  };
  return <AuthContext.Provider value={state}>{props.children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const v = useContext(AuthContext);
  if (!v) throw new Error("useAuth outside AuthProvider");
  return v;
}
