import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { useComposerAccount } from "./lib/composer-account";
import { library, setAccountToken } from "./lib/library-storage";
export function Persistence({ children }: { children: ReactNode }) {
  const account = useComposerAccount(true, false), token = useRef(account.token);
  token.current = account.token;
  const snapshot = useSyncExternalStore(library.subscribe, library.snapshot);
  const [notice, setNotice] = useState("");
  const user = account.state === "signed-in" ? account.userId : null;
  useEffect(() => {
    if (account.state === "loading") return;
    const getToken = user ? () => token.current(user) : null;
    setAccountToken(getToken); library.connect(user, getToken);
  }, [user, account.state]);
  useEffect(() => {
    const online = () => void library.retry();
    const leaving = (e: BeforeUnloadEvent) => { if (library.snapshot().dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("online", online); window.addEventListener("beforeunload", leaving);
    return () => { window.removeEventListener("online", online); window.removeEventListener("beforeunload", leaving); };
  }, []);
  const backup = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ format: "ai-blocks-library/1", ...library.snapshot(), browserData: library.guestData() }, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "ai-blocks-backup.json"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const ready = account.state !== "loading" && snapshot.user === user && snapshot.status !== "loading";
  return <>
    <aside className="persistence-bar" aria-label="Saving and account" data-testid="persistence-bar" data-account={user ?? "guest"} data-save-status={ready ? snapshot.status : "loading"}>
      <span role="status">{!ready ? "Opening your saved work…" : snapshot.error || (user ? snapshot.status === "saved" ? "Saved to your account. Available after sign-in on any device." : "Saving to your account…" : "Guest saves stay in this browser with no scheduled expiry. Clearing browser data can erase them. Sign in to keep an account copy.")}</span>
      {ready && <>
        {user ? <>
          <button className="link-btn" onClick={() => { try { library.importGuest(); setNotice("Browser kits and workflows imported. Existing account context and drafts were kept; browser originals remain available after signing out."); } catch (e) { setNotice((e as Error).message); } }}>Import browser saves</button>
          <button className="link-btn" onClick={() => void account.signOut()}>Sign out</button>
        </> : <button className="link-btn" disabled={account.state === "unconfigured"} onClick={() => account.state === "error" ? account.retry() : void account.signIn()}>{account.state === "error" ? "Retry sign-in" : account.state === "unconfigured" ? "Account saving not connected" : "Sign in to save"}</button>}
        <button className="link-btn" onClick={backup}>Download backup</button>
        <label className="link-btn">Restore backup<input className="visually-hidden" type="file" accept="application/json,.json" onChange={async e => {
          const file = e.currentTarget.files?.[0]; if (!file) return;
          try { if (file.size > 8_000_000) throw Error("Backup is too large."); const saved = JSON.parse(await file.text()); if (saved.format !== "ai-blocks-library/1") throw Error("Choose an AI Blocks library backup."); library.importData(saved.data); setNotice("Backup kits and workflows restored. Existing account context and drafts were kept."); }
          catch (error) { setNotice((error as Error).message); }
        }} /></label>
        {snapshot.status === "error" && user && <button className="link-btn" onClick={() => void library.retry()}>Retry saving</button>}
        {snapshot.status === "conflict" && <button className="link-btn" onClick={() => { backup(); void library.loadAccountCopy().catch(e => setNotice(e.message)); }}>Back up my copy and load account copy</button>}
      </>}
      {notice && <span role="status">{notice}</span>}
    </aside>
    {ready ? <div key={user ?? "guest"}>{children}</div> : <main className="wrap bp-hero"><p>Opening your saved work…</p></main>}
  </>;
}
