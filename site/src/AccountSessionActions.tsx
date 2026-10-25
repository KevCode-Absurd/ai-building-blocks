import { useState } from "react";
import { usePersistence } from "./AccountPersistence";
import { Link } from "./lib/router";

/** Use the existing account boundary and save-before-sign-out flow everywhere. */
export default function AccountSessionActions({ onSignedOut }: { onSignedOut?: () => void }) {
  const { account } = usePersistence();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  if (account.state === "loading") return <p className="small" role="status">Checking your account…</p>;
  if (account.state === "signed-in") return <div className="account-session-actions">
    <button type="button" className="btn btn-line btn-sm" disabled={busy} onClick={async () => {
      setBusy(true); setError("");
      try { await account.signOut(); onSignedOut?.(); }
      catch (reason) { setError(reason instanceof Error ? reason.message : "Sign-out did not finish. Your work is kept. Please try again."); }
      finally { setBusy(false); }
    }}>{busy ? "Saving before sign-out…" : "Sign out"}</button>
    {error && <p className="small" role="alert">{error}</p>}
  </div>;
  return <div className="account-session-actions">
    {account.state === "error" ? <button type="button" className="btn btn-line btn-sm" onClick={account.retry}>Retry sign-in connection</button> : <>
      <Link to="/sign-in" className="btn btn-line btn-sm">Sign in</Link>
      <Link to="/sign-up" className="account-text-link">Create an account</Link>
    </>}
    {account.state === "unconfigured" && <p className="small" role="status">Sign-in is unavailable right now. Your browser saves are still here.</p>}
  </div>;
}
