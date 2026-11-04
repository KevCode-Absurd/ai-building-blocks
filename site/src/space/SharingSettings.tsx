import { useState } from "react";
import type { AccessPolicy } from "../server/space-access";
import { spaces } from "../lib/space";
import { hasAccount } from "../lib/library-storage";
import { Link } from "../lib/router";
export function SharingSettings({ access, onSaved }: { access: AccessPolicy; onSaved: () => void }) {
  const [mode, setMode] = useState(access.mode), [emails, setEmails] = useState(access.emails.join("\n")), [domain, setDomain] = useState(access.domain);
  const [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  if (!hasAccount()) return <div className="sp-card sp-sign-in" data-testid="space-access-sign-in"><p className="small">Sign in to choose who can open your share link. You can allow only people you invite, or anyone with your company email.</p><p><Link to="/sign-in" className="btn btn-line btn-sm">Sign in</Link></p></div>;
  return <form className="sp-card" aria-label="Workspace access" onSubmit={async e => {
    e.preventDefault(); setBusy(true); setMessage("");
    try { await spaces.access({ mode, emails: emails.split(/[\s,;]+/).filter(Boolean), domain }); setMessage("Access saved. Removed people lose access immediately."); onSaved(); }
    catch (error) { setMessage((error as Error).message); } finally { setBusy(false); }
  }}>
    <label className="sp-field"><span>Who can open the share link?</span><select value={mode} onChange={e => setMode(e.currentTarget.value as AccessPolicy["mode"])}>
      <option value="invited">Only invited email addresses</option><option value="domain">Company email domain and invited people</option><option value="link">Anyone with the link</option>
    </select></label>
    {mode === "domain" && <label className="sp-field"><span>Company email domain</span><input value={domain} onChange={e => setDomain(e.currentTarget.value)} placeholder="yourcompany.com" required /></label>}
    {mode !== "link" && <label className="sp-field"><span>Invited email addresses, one per line</span><textarea rows={3} value={emails} onChange={e => setEmails(e.currentTarget.value)} placeholder="person@yourcompany.com" /></label>}
    <p className="small">Invited people use the same share link and must sign in with a verified allowed email. Access is read only. Copy and send the link yourself; adding an address does not send email. Public items remain publicly accessible.</p>
    <button className="btn btn-primary btn-sm" disabled={busy}>{busy ? "Saving access…" : "Save access"}</button>
    {message && <p role="status">{message}</p>}
  </form>;
}
