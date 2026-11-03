import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { Clerk } from "@clerk/clerk-js";
import { library } from "./library-storage";

type AccountState = "loading" | "unconfigured" | "signed-out" | "signed-in" | "error";
type Usage = { completed: number; attemptsToday: number; dailyAttemptLimit: number | null; unlimited?: boolean; dailyIpAttemptLimit?: number | null };

// Clerk's browser SDK is large, so it loads only when someone may have an account here:
// a sign-in cookie or our own hint says so, an account page is open, or they ask to sign in.
// Signed-out visitors on public pages never download it.
const AUTH_HINT = "abb:auth-hint";
/** Pages that always open the account connection (account, sign-in and private submission pages). */
export const accountRoute = (path: string) => /^\/(account|sign-in|sign-up|space|publish|my-submissions|admin)(\/|$)/.test(path);
/** True when this browser may hold a session. Only checks which cookies exist; their values never leave this check. */
export function sessionHint(): boolean {
  try {
    for (const part of document.cookie.split(";")) {
      const at = part.indexOf("="), name = part.slice(0, at).trim(), value = part.slice(at + 1).trim();
      // Clerk writes __session (signed in) and __client_uat ("0" when signed out), sometimes with an instance suffix.
      if (at > 0 && value && (/^__session(_[\w-]+)?$/.test(name) || /^__client_uat(_[\w-]+)?$/.test(name) && value !== "0")) return true;
    }
  } catch { /* No cookie access: fall back to the stored hint. */ }
  try { if (localStorage.getItem(AUTH_HINT)) return true; } catch { /* Storage blocked. */ }
  try { return [...new URLSearchParams(location.search).keys()].some(key => key.startsWith("__clerk") || key === "browser_save"); } catch { return false; }
}
const setHint = (value: string | null) => { try { if (value) localStorage.setItem(AUTH_HINT, value); else localStorage.removeItem(AUTH_HINT); } catch { /* Storage blocked. */ } };
/** After a signed-out check, forget the hint, except one set moments ago by a sign-in redirect still under way. */
const clearHint = () => { try { const value = localStorage.getItem(AUTH_HINT) ?? ""; if (!value.startsWith("pending:") || Date.now() - Number(value.slice(8)) > 30000) setHint(null); } catch { /* Storage blocked. */ } };
let wanted = false;
const wantedListeners = new Set<() => void>();
/** Start the account connection everywhere (sign-in, an account feature). It stays open for the visit. */
export function requestAccount() {
  if (wanted) return;
  wanted = true; wantedListeners.forEach(listener => listener());
}
const subscribeWanted = (listener: () => void) => { wantedListeners.add(listener); return () => { wantedListeners.delete(listener); }; };
const isWanted = () => wanted;
/** Look again when the tab returns or another tab signs in (it writes the stored hint). */
const subscribeHint = (listener: () => void) => {
  addEventListener("focus", listener); addEventListener("storage", listener); document.addEventListener("visibilitychange", listener);
  return () => { removeEventListener("focus", listener); removeEventListener("storage", listener); document.removeEventListener("visibilitychange", listener); };
};
let clientPromise: Promise<Clerk> | null = null;
let configPromise: Promise<{ configured: boolean; publishableKey?: string }> | null = null;
function config() {
  return configPromise ??= fetch("/api/auth").then(r => { if (!r.ok) throw Error(); return r.json(); }).catch(error => { configPromise = null; throw error; });
}
async function client(key: string) {
  // The no-rhc build is the same headless client without code for wallets, billing and on-page captcha, which this
  // site never uses (sign-in and sign-up happen on Clerk's own pages). It is about 180 KB smaller compressed.
  if (!clientPromise) clientPromise = import("@clerk/clerk-js/no-rhc").then(async ({ Clerk }) => {
    const clerk = new Clerk(key);
    await clerk.load();
    return clerk;
  }).catch(error => { clientPromise = null; throw error; });
  return clientPromise;
}
export function useComposerAccount(active: boolean, loadUsage = true, eager = false) {
  const demanded = useSyncExternalStore(subscribeWanted, isWanted, isWanted);
  const hinted = useSyncExternalStore(subscribeHint, sessionHint, () => false);
  const needed = demanded || eager || hinted;
  const [state, setState] = useState<AccountState>(() => needed ? "loading" : "signed-out");
  const [usage, setUsage] = useState<Usage | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState({ name: "", email: "" });
  const clerk = useRef<Clerk | null>(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!active) return;
    // No session here and nothing asked for an account: signed out, without loading Clerk.
    if (!needed) { setState("signed-out"); setSessionId(null); setUserId(null); return; }
    let live = true, unsubscribe: (() => void) | undefined;
    setState("loading");
    // Once open, keep the connection for the rest of the visit, even after a sign-out clears the cookies.
    requestAccount();
    void (async () => {
      const settings = await config();
      if (!settings.configured || !settings.publishableKey) { if (live) setState("unconfigured"); return; }
      const sdk = await client(settings.publishableKey);
      if (!live) return;
      clerk.current = sdk;
      unsubscribe = sdk.addListener(() => {
        if (!live) return;
        // Remember a session so the next visit opens it straight away; forget it once signed out.
        if (sdk.session?.status === "active") setHint("1"); else clearHint();
        setState(sdk.session?.status === "active" ? "signed-in" : "signed-out");
        setSessionId(sdk.session?.id ?? null);
        setUserId(sdk.session?.status === "active" ? sdk.session.user.id : null);
        const user = sdk.session?.status === "active" ? sdk.user : null;
        setProfile({ name: user?.fullName || user?.username || "", email: user?.primaryEmailAddress?.emailAddress || "" });
      });
    })().catch(() => { if (live) setState("error"); });
    return () => { live = false; unsubscribe?.(); };
  }, [active, needed, revision]);
  const token = async (expectedUser?: string, forceRefresh = false) => {
    if (expectedUser && clerk.current?.session?.user.id !== expectedUser) throw Object.assign(Error("Your account changed. Reopen your saved work and try again."), { code: "AUTH_SESSION_REQUIRED" });
    const value = await clerk.current?.session?.getToken({ skipCache: forceRefresh });
    if (expectedUser && clerk.current?.session?.user.id !== expectedUser) throw Object.assign(Error("Your account changed. Reopen your saved work and try again."), { code: "AUTH_SESSION_REQUIRED" });
    if (!value) {
      if (clerk.current?.session?.status === "active") throw Error("Sign-in verification is temporarily unavailable. Your saved work is kept on this device.");
      setState("signed-out"); setUsage(null); throw Object.assign(Error("Sign in to finish saving your work."), { code: "AUTH_SESSION_REQUIRED" });
    }
    return value;
  };
  const refreshUsage = async () => {
    try {
      const expectedSession = clerk.current?.session?.id;
      const response = await fetch("/api/auth?usage", { headers: { authorization: `Bearer ${await token()}` } });
      if (expectedSession !== clerk.current?.session?.id) return;
      if (response.status === 401) { setState("signed-out"); setUsage(null); return; }
      if (response.ok) setUsage(await response.json());
    } catch { /* Usage history is optional; the generation API enforces limits. */ }
  };
  useEffect(() => { setUsage(null); if (active && loadUsage && state === "signed-in") void refreshUsage(); }, [active, loadUsage, state, sessionId]);
  return {
    state, userId, profile, usage, token, refreshUsage,
    retry: () => { configPromise = null; setRevision(v => v + 1); },
    expired: () => { setState("signed-out"); setUsage(null); },
    signIn: async (signUp = false, destination?: string) => {
      // Clerk may not be here yet for a signed-out visitor: open it now, then redirect.
      requestAccount();
      let sdk = clerk.current;
      if (!sdk) {
        try {
          const settings = await config();
          if (!settings.configured || !settings.publishableKey) { setState("unconfigured"); return; }
          sdk = clerk.current = await client(settings.publishableKey);
        } catch { setState("error"); return; }
      }
      const returnPath = destination ?? location.pathname + location.search;
      const target = new URL(returnPath, location.origin);
      // Both sign-in and account creation carry this browser's durable snapshot.
      const handoff = library.prepareSignUp();
      if (handoff) target.searchParams.set("browser_save", handoff);
      const options = { signInForceRedirectUrl: target.href, signUpForceRedirectUrl: target.href };
      // Coming back from sign-in, open the account connection straight away.
      setHint(`pending:${Date.now()}`);
      return signUp ? sdk.redirectToSignUp(options) : sdk.redirectToSignIn(options);
    },
    // This client carries no UI components (openUserProfile would throw), so the profile opens on Clerk's own page.
    manageProfile: () => clerk.current?.redirectToUserProfile(),
    signOut: async () => {
      const sdk = clerk.current, session = sdk?.session;
      if (!sdk || !session) return;
      await library.saveBeforeSignOut(session.user.id);
      if (sdk.session?.id !== session.id) throw Error("Your account changed. Please try signing out again.");
      await sdk.signOut({ redirectUrl: "/account" });
    },
  };
}
