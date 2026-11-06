// Sign-in state for the browser app. Clerk loads lazily; /api/me says what the signed-in person may do.
// Local dev (APP_ENV=local) has a demo sign-in instead, because the live Clerk app only works on useaiblocks.com domains.
import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import type { Clerk } from "@clerk/clerk-js";

export interface Me {
  user: { id: string; email: string | null; emailVerified: boolean; name: string | null };
  orgId: string;
  roles: { ops: boolean; reviewer: boolean };
  betaAccess: boolean;
  expert: { id: string; status: "applied" | "approved" | "rejected" | "paused"; displayName: string; founding: boolean } | null;
}

export interface AppConfig { clerkPublishableKey: string; env: string; betaMode: "invite" | "open"; libraryUrl: string }

interface AuthState {
  loaded: boolean;
  config: AppConfig | null;
  signedIn: boolean;
  me: Me | null;
  displayName: string;
  getToken(): Promise<string | null>;
  openSignIn(): void;
  signOut(): Promise<void>;
  refreshMe(): Promise<void>;
  /** Local dev only. */
  demoSignIn?(userId: string): void;
}

const AuthContext = createContext<AuthState | null>(null);
const DEMO_KEY = "agents.demoUser";

let clerkPromise: Promise<Clerk> | null = null;
function loadClerk(key: string): Promise<Clerk> {
  clerkPromise ??= import("@clerk/clerk-js/no-rhc").then(async ({ Clerk }) => {
    const clerk = new Clerk(key);
    await clerk.load({ appearance: { variables: { colorPrimary: "#0a0a0a", fontFamily: "Space Grotesk, system-ui, sans-serif", borderRadius: "4px" } } });
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
      try {
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
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const state: AuthState = {
    loaded, config, signedIn, me, displayName: name,
    getToken: () => tokenGetter(),
    openSignIn: () => {
      if (config?.env === "local") { const id = prompt("Demo user id (local only)", "user_demo") ?? ""; if (id) state.demoSignIn!(id); return; }
      clerk?.openSignIn({ fallbackRedirectUrl: location.href });
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
