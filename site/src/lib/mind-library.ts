import { useEffect, useRef, useSyncExternalStore } from "react";
import { validateCustomMinds, type CustomMind } from "./custom-minds";
import { useComposerAccount } from "./composer-account";
import { MindSync } from "./mind-sync";
const KEY = "abb:my-minds/1";
const EMPTY_MINDS: CustomMind[] = [];
function read(): CustomMind[] { try { return validateCustomMinds(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch { return []; } }
const sync = new MindSync(read(), minds => localStorage.setItem(KEY, JSON.stringify(minds)));
export const saveMind = sync.save;
export function useMindLibrary() {
  const account = useComposerAccount(true, false), token = useRef(account.token);
  token.current = account.token;
  const userId = account.state === "signed-in" ? account.userId : null;
  useEffect(() => {
    // A newly mounted subscriber has not checked Clerk yet; it must not sign out an existing subscriber.
    if (account.state === "loading" && sync.snapshot().userId) return;
    sync.connect(userId, userId ? () => token.current(userId) : null, account.state === "loading");
  }, [userId, account.state]);
  useEffect(() => {
    const refresh = () => { if (!document.hidden) void sync.refresh(); };
    window.addEventListener("focus", refresh); document.addEventListener("visibilitychange", refresh);
    return () => { window.removeEventListener("focus", refresh); document.removeEventListener("visibilitychange", refresh); };
  }, []);
  const state = useSyncExternalStore(sync.subscribe, sync.snapshot);
  // Hide old account data immediately during render, before the account-change effect runs.
  const visible = state.userId === userId && account.state !== "loading" ? state : { ...state, userId, minds: EMPTY_MINDS, mode: "loading" as const, busy: true };
  return { ...visible, account, refresh: sync.refresh, save: sync.save, remove: sync.remove, copyBrowserMinds: sync.copyBrowserMinds, pendingLocal: state.userId === userId ? sync.pendingLocal() : [] };
}
export function useMyMinds() { return useMindLibrary().minds; }
if (typeof window !== "undefined") window.addEventListener("storage", e => { if (e.key === KEY) sync.replaceLocal(read()); });
