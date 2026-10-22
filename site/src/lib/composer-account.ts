import { useEffect, useRef, useState } from "react";
import type { Clerk } from "@clerk/clerk-js";

type AccountState = "loading" | "unconfigured" | "signed-out" | "signed-in" | "error";
type Usage = { completed: number; attemptsToday: number; dailyAttemptLimit: number };
let clientPromise: Promise<Clerk> | null = null;
let configPromise: Promise<{ configured: boolean; publishableKey?: string }> | null = null;
function config() {
  return configPromise ??= fetch("/api/auth").then(r => { if (!r.ok) throw Error(); return r.json(); }).catch(error => { configPromise = null; throw error; });
}
async function client(key: string) {
  if (!clientPromise) clientPromise = import("@clerk/clerk-js").then(async ({ Clerk }) => {
    const clerk = new Clerk(key);
    await clerk.load();
    return clerk;
  }).catch(error => { clientPromise = null; throw error; });
  return clientPromise;
}
export function useComposerAccount(active: boolean, loadUsage = true) {
  const [state, setState] = useState<AccountState>("loading");
  const [usage, setUsage] = useState<Usage | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const clerk = useRef<Clerk | null>(null);
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    if (!active) return;
    let live = true, unsubscribe: (() => void) | undefined;
    setState("loading");
    void (async () => {
      const settings = await config();
      if (!settings.configured || !settings.publishableKey) { if (live) setState("unconfigured"); return; }
      const sdk = await client(settings.publishableKey);
      if (!live) return;
      clerk.current = sdk;
      unsubscribe = sdk.addListener(() => {
        if (!live) return;
        setState(sdk.session?.status === "active" ? "signed-in" : "signed-out");
        setSessionId(sdk.session?.id ?? null);
        setUserId(sdk.session?.status === "active" ? sdk.session.user.id : null);
      });
    })().catch(() => { if (live) setState("error"); });
    return () => { live = false; unsubscribe?.(); };
  }, [active, revision]);
  const token = async (expectedUser?: string) => {
    if (expectedUser && clerk.current?.session?.user.id !== expectedUser) throw Error("Your account changed. Reopen your mind library and try again.");
    const value = await clerk.current?.session?.getToken();
    if (expectedUser && clerk.current?.session?.user.id !== expectedUser) throw Error("Your account changed. Reopen your mind library and try again.");
    if (!value) { setState("signed-out"); setUsage(null); throw Error("Sign in to generate a free AI workflow."); }
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
    state, userId, usage, token, refreshUsage,
    retry: () => { configPromise = null; setRevision(v => v + 1); },
    expired: () => { setState("signed-out"); setUsage(null); },
    signIn: (signUp = false) => {
      const returnPath = location.pathname === "/minds" ? "/minds" : "/compose";
      const options = { signInForceRedirectUrl: `${location.origin}${returnPath}`, signUpForceRedirectUrl: `${location.origin}${returnPath}` };
      return signUp ? clerk.current?.redirectToSignUp(options) : clerk.current?.redirectToSignIn(options);
    },
    signOut: () => clerk.current?.signOut({ redirectUrl: "/compose" }),
  };
}
