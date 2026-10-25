import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePersistence } from "./AccountPersistence";
import "./community.css";
type Stars = { ranked: string[]; counts: Record<string, number>; starred: Set<string>; pending: Set<string>; error: string; loading: boolean; loadError: boolean; reload(): void; toggle(target: string): Promise<void> };
const Context = createContext<Stars>({ ranked: [], counts: {}, starred: new Set(), pending: new Set(), error: "", loading: false, loadError: false, reload: () => {}, toggle: async () => {} });
export const useCommunityStars = () => useContext(Context);
export function CommunityStars({ children }: { children: ReactNode }) {
  const { account } = usePersistence();
  const [ranked, setRanked] = useState<string[]>([]), [counts, setCounts] = useState<Record<string, number>>({});
  const [starred, setStarred] = useState(new Set<string>()), [pending, setPending] = useState(new Set<string>()), [error, setError] = useState("");
  const [loading, setLoading] = useState(false), [loadError, setLoadError] = useState(false), [revision, setRevision] = useState(0);
  const reload = () => setRevision(n => n + 1);
  const locks = useRef(new Set<string>());
  const ranks = async () => { const r = await fetch("/api/community/rankings"); if (r.ok) { const data = await r.json(); setRanked(data.ranked); setCounts(data.counts ?? {}); } };
  useEffect(() => { void ranks().catch(() => {}); }, []);
  useEffect(() => {
    let live = true; setStarred(new Set()); setLoadError(false); setLoading(account.state === "signed-in");
    if (account.state === "signed-in" && account.userId) {
      const user = account.userId;
      void account.token(user).then(token => fetch("/api/community/stars", { headers: { authorization: `Bearer ${token}` } })).then(async r => { if (!r.ok) throw Error(); const data = await r.json(); if (live) setStarred(new Set(data.starred)); }).catch(() => { if (live) setLoadError(true); }).finally(() => { if (live) setLoading(false); });
    }
    return () => { live = false; };
  }, [account.state, account.userId, revision]);
  const toggle = async (target: string) => {
    if (locks.current.has(target)) return;
    if (account.state !== "signed-in" || !account.userId) { if (account.state === "signed-out") await account.signIn(); else setError("Sign-in is temporarily unavailable. Please try again."); return; }
    locks.current.add(target); setPending(new Set(locks.current)); setError("");
    try {
      const response = await fetch("/api/community/stars", { method: "PUT", headers: { "content-type": "application/json", authorization: `Bearer ${await account.token(account.userId)}` }, body: JSON.stringify({ target, starred: !starred.has(target) }) });
      const result = await response.json(); if (!response.ok) throw Error(result.error);
      setStarred(current => { const next = new Set(current); if (result.starred) next.add(target); else next.delete(target); return next; });
      await ranks().catch(() => {});
    } catch (e) { setError(e instanceof Error ? e.message : "Your star could not be saved. Try again."); }
    finally { locks.current.delete(target); setPending(new Set(locks.current)); }
  };
  return <Context.Provider value={{ ranked, counts, starred, pending, error, loading, loadError, reload, toggle }}>{children}{error && <p className="community-star-error" role="alert">{error}<button type="button" className="link-btn" onClick={() => setError("")}>Dismiss</button></p>}</Context.Provider>;
}
export function StarButton({ target, title }: { target: string; title: string }) {
  const { starred, pending, counts, loading, loadError, reload, toggle } = useCommunityStars();
  const active = starred.has(target);
  return <button type="button" className="community-star" aria-label={`${active ? "Unstar" : "Star"} ${title}`} aria-pressed={active} title={active ? "Remove star" : "Star this item"} aria-busy={pending.has(target)} disabled={pending.has(target) || loading} onClick={() => loadError ? reload() : void toggle(target)}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6"><path d="m12 3 2.8 5.7 6.3.9-4.5 4.4 1 6.2-5.6-3-5.6 3 1-6.2L3 9.6l6.2-.9Z" /></svg><span>{loadError ? "Retry stars" : active ? "Starred" : "Star"}</span>{counts[target] !== undefined && <span>{counts[target]}</span>}</button>;
}
