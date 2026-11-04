import { useEffect, useState } from "react";
import { SAVED_KIT } from "./SaveButton";
import { usePersistence } from "./AccountPersistence";
import { library } from "./lib/library-storage";
import { flows, useStore } from "./lib/store";
import { type Catalogue, pathOf } from "./lib/data";
import { Link, navigate, useLocation } from "./lib/router";
import { openBusiness } from "./Business";
import { browserSaves, type BrowserSave } from "./lib/signup-saves";
import AccountSessionActions from "./AccountSessionActions";
import { WORK_KEY, nameFromSlug, parseWork } from "./lib/saved-work-data";

function downloadBrowserSave(save: BrowserSave, plan = false) {
  const raw = plan ? save.data["abb:composer"]! : JSON.stringify({ format: "ai-blocks-library/1", data: save.data });
  const url = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
  const a = document.createElement("a"); a.href = url; a.download = plan ? "workflow.edit.json" : "browser-saves-backup.json"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function SignUp({ signIn = false }: { signIn?: boolean }) {
  const { account } = usePersistence();
  const unavailable = account.state === "unconfigured";
  const [error, setError] = useState("");
  return <section className="account-welcome" data-testid="account-welcome">
    <p className="account-eyebrow">Your own place for good work</p>
    <h1>{signIn ? "Welcome back." : "Keep what works."}</h1>
    <p className="lede">Your kits, skills and workflows. Saved together, ready when you need them.</p>
    <div className="account-actions">
      <button className="btn btn-primary" disabled={unavailable} onClick={async () => { try { setError(""); if (account.state === "error") account.retry(); else await account.signIn(!signIn, "/account"); } catch { setError("We couldn’t prepare your browser saves. Your originals are still here. Please try again."); } }}>{account.state === "error" ? "Retry connection" : signIn ? "Sign in" : "Create a free account"}</button>
      <Link to={signIn ? "/sign-up" : "/sign-in"} className="link-btn">{signIn ? "Create an account" : "Already have an account? Sign in"}</Link>
    </div>
    {unavailable && <p className="small" role="status">Account sign-in is unavailable right now. Your browser saves are still here.</p>}
    {error && <p className="small" role="alert">{error}</p>}
    <p className="small account-welcome-note">Your browser saves come with you automatically when you sign up or sign in. Anything already in your account is kept.</p>
    <Link to="/account" className="small account-text-link">View this browser’s saved work →</Link>
    <p className="small">Accounts are for adults aged 18 or older. Read our <Link to="/terms">Terms of service</Link> and <Link to="/privacy">Privacy policy</Link>.</p>
  </section>;
}

function Settings() {
  const { account, snapshot } = usePersistence();
  const [notice, setNotice] = useState("");
  const user = snapshot.user;
  const backup = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ format: "ai-blocks-library/1", ...library.snapshot(), browserData: library.guestData() }, null, 2)], { type: "application/json" }));
    const a = document.createElement("a"); a.href = url; a.download = "ai-blocks-backup.json"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return <div className="account-settings" data-testid="account-settings" data-account={user ?? "guest"} data-save-status={snapshot.status}>
    <section className="account-setting">
      <div><h2>Account</h2><p className="small">{user ? account.profile.email || "You’re signed in." : "You’re using this browser without an account."}</p></div>
      {user && <div className="account-actions"><button className="btn btn-line btn-sm" onClick={() => account.manageProfile()}>Manage profile & sign-in</button></div>}
    </section>
    <section className="account-setting">
      <div><h2>Saving</h2><p className="small" role="status">{snapshot.error || (user ? snapshot.status === "saved" ? "Saved to your account. Your work is available when you sign in on another device." : "Saving your latest changes…" : "Saves stay in this browser with no scheduled expiry. Clearing browser data or using private browsing can erase them.")}</p></div>
      {snapshot.status === "error" && <button className="btn btn-line btn-sm" onClick={() => void library.retry()}>Retry saving</button>}
      {snapshot.status === "conflict" && <button className="btn btn-line btn-sm" onClick={() => { backup(); void library.loadAccountCopy().catch(e => setNotice(e.message)); }}>Back up my copy and load account copy</button>}
    </section>
    <section className="account-setting" id="browser-saves">
      <div><h2>Browser saves</h2><p className="small">Browser saves are copied into your account automatically when you sign up or sign in. You can also bring in saves from another browser here. Existing account details and browser originals are kept.</p></div>
      {user ? <button className="btn btn-line btn-sm" onClick={() => { try { library.importGuest(); setNotice("Browser saves imported. Existing account details and browser originals were kept."); } catch (e) { setNotice((e as Error).message); } }}>Import browser saves</button> : <Link to="/sign-up" className="account-text-link">Sign up to import →</Link>}
    </section>
    <section className="account-setting">
      <div><h2>Backups</h2><p className="small">Keep a separate copy of your kits, workflows and details, or bring back a previous backup.</p></div>
      <div className="account-actions"><button className="btn btn-line btn-sm" onClick={backup}>Download backup</button>
        <label className="btn btn-line btn-sm account-restore">Restore backup<input aria-label="Restore backup" type="file" accept="application/json,.json" onChange={async e => {
          const file = e.currentTarget.files?.[0]; e.currentTarget.value = ""; if (!file) return;
          try {
            if (file.size > 8_000_000) throw Error("Backup is too large.");
            const saved = JSON.parse(await file.text()); if (saved.format !== "ai-blocks-library/1") throw Error("Choose an AI Blocks library backup.");
            library.importData(saved.data); setNotice("Backup restored. Existing account details were kept.");
          } catch (error) { setNotice((error as Error).message); }
        }} /></label>
      </div>
      {browserSaves(snapshot.data).length > 0 && <details><summary>Original browser copies</summary><p className="small">A complete copy is kept for each new browser snapshot, including any alternate plan or personal details.</p>{browserSaves(snapshot.data).map(save => <button className="link-btn" key={save.id} onClick={() => downloadBrowserSave(save)}>Download browser copy from {new Date(save.capturedAt).toLocaleDateString()}</button>)}</details>}
    </section>
    <section className="account-setting">
      <div><h2>Saving diagnostics</h2><p className="small">If saving fails, download a report for support. It contains error codes and timings from the last 24 hours, without your saved work or sign-in details.</p></div>
      <button className="btn btn-line btn-sm" onClick={() => {
        const url = URL.createObjectURL(new Blob([JSON.stringify(library.diagnostics.export(), null, 2)], { type: "application/json" }));
        const a = document.createElement("a"); a.href = url; a.download = "ai-blocks-saving-diagnostics.json"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
      }}>Download saving diagnostics</button>
    </section>
    <section className="account-setting"><div><h2>Your brand file</h2><p className="small">Edit the private file about you and your business that is added to your prompts and downloads.</p></div><button className="btn btn-line btn-sm" onClick={openBusiness}>Edit your brand file</button></section>
    <section className="account-setting"><div><h2>Team space</h2><p className="small">Choose what you share with your team, and who can open it by email address or company domain.</p></div><Link to="/space" className="btn btn-line btn-sm">Manage team space</Link></section>
    {notice && <p className="account-notice" role="status">{notice}</p>}
  </div>;
}

function MyWork({ c, onKits }: { c: Catalogue | null; onKits: () => void }) {
  const kits = useStore(s => s.kits), saved = useStore(s => s.flows), draft = useStore(s => s.draft);
  const { snapshot } = usePersistence();
  const work = [...(draft ? [draft] : []), ...saved];
  const skills = [...new Set(kits.flatMap(k => k.slugs))].flatMap(slug => c?.bySlug[slug] ? [c.bySlug[slug]] : []);
  const custom = work.flatMap(flow => (flow.customSkills ?? []).map(skill => ({ skill, flow }))).filter((entry, i, all) => all.findIndex(other => other.skill.slug === entry.skill.slug && other.skill.markdown === entry.skill.markdown) === i);
  const resume = (id?: string) => { if (id) flows.open(id); navigate("/#build"); };
  const recent = parseWork(snapshot.data[WORK_KEY]);
  const tools = Object.entries(recent.tools).sort((a, b) => b[1].at - a[1].at).slice(0, 5), roles = Object.entries(recent.roles).sort((a, b) => b[1].at - a[1].at).slice(0, 5);
  const browserPlans = browserSaves(snapshot.data).filter(save => save.data["abb:composer"] && save.data["abb:composer"] !== snapshot.data["abb:composer"]);
  // Until something is saved, one empty state instead of four boxes that each say 0.
  const empty = !kits.some(k => k.slugs.length || k.name !== SAVED_KIT) && !custom.length && !saved.length && !(draft && (draft.nodes.length || draft.goal))
    && !tools.length && !roles.length && !snapshot.data["abb:composer"] && !browserPlans.length;
  return <>
    {!snapshot.user && <div className="account-local-note"><span>These saves are on this browser.</span><Link to="/sign-up">Sign up to keep an account copy →</Link></div>}
    {(snapshot.status === "error" || snapshot.status === "conflict") && <p role="alert" className="account-notice">Your latest changes need attention. <Link to="/account?view=settings">Open saving settings →</Link></p>}
    {empty ? <section className="account-empty" data-testid="account-empty">
      <h2>Nothing saved yet</h2>
      <p>Skills, prompts and workflows you save show up here, with your plans and calculator numbers.</p>
      <div className="account-actions"><Link to="/#library" className="btn btn-primary">Find a task</Link><Link to="/compose" className="btn btn-line">Build a workflow</Link></div>
    </section> : <div className="account-work-grid">
      <section className="account-card" data-testid="account-saved"><div className="account-card-heading"><h2>Saved</h2><span className="small">{skills.length + custom.length}</span></div>
        {skills.map(item => <Link className="account-work-row" to={pathOf(item)} key={item.slug}>{item.name}<span aria-hidden="true">↗</span></Link>)}
        {custom.map(({ skill, flow }) => <button className="account-work-row" key={`${flow.id}:${skill.slug}`} onClick={() => resume(flow === draft ? undefined : flow.id)}><span>{skill.name}<small>In {flow.name || "your workflow"}</small></span><span aria-hidden="true">↗</span></button>)}
        {!skills.length && !custom.length && <p className="small">Choose Save on any skill, prompt, workflow or agent. It will be waiting here.</p>}
        {kits.filter(k => k.name !== SAVED_KIT).map(kit => <button className="account-work-row" key={kit.id} onClick={onKits}><span>{kit.name}<small>Kit</small></span><span className="small">{kit.slugs.length} items →</span></button>)}
        {kits.length > 0 ? <button className="link-btn account-card-action" onClick={onKits}>Manage my kits →</button> : <Link to="/#library" className="account-card-action">Find a task →</Link>}
      </section>
      <section className="account-card"><div className="account-card-heading"><h2>Workflows</h2><span className="small">{saved.length}</span></div>
        {draft && <button className="account-work-row" onClick={() => resume()}><span>{draft.name || "Current workflow"}<small>Current draft</small></span><span aria-hidden="true">↗</span></button>}
        {saved.map(flow => <button className="account-work-row" key={flow.id} onClick={() => resume(flow.id)}><span>{flow.name}</span><span aria-hidden="true">↗</span></button>)}
        {!draft && !saved.length && <p className="small">Every plan you make is saved here, with workflows you build.</p>}
        <Link to="/compose" className="account-card-action">{snapshot.data["abb:composer"] ? "Open my last plan →" : "Build a workflow →"}</Link>
      </section>
      <section className="account-card" data-testid="account-numbers"><div className="account-card-heading"><h2>Calculators and specialists</h2><span className="small">{tools.length + roles.length}</span></div>
        {tools.map(([slug, entry]) => <Link className="account-work-row" to={`/tools/${slug}`} key={`tool:${slug}`}><span>{entry.name || nameFromSlug(slug)}<small>Your numbers are saved</small></span><span aria-hidden="true">↗</span></Link>)}
        {roles.map(([id, entry]) => <Link className="account-work-row" to={`/roles/${id}`} key={`role:${id}`}><span>{entry.name || nameFromSlug(id)}<small>Specialist you looked at</small></span><span aria-hidden="true">↗</span></Link>)}
        {!tools.length && !roles.length && <p className="small">Numbers you type into a calculator and specialists you open appear here.</p>}
        <Link to="/tools" className="account-card-action">Open a calculator →</Link>
      </section>
      <section className="account-card"><div className="account-card-heading"><h2>Team space</h2></div><p className="small">My work is only for you. Your team space is separate. It holds what you choose to share, and you pick who can open it by email address or company domain.</p><Link to="/space" className="account-card-action">Open team space →</Link></section>
      {browserPlans.map(save => <section className="account-card" key={save.id}><h2>Browser plan</h2><p className="small">This plan was kept separately so your current account plan stays intact.</p><button className="link-btn account-card-action" onClick={() => downloadBrowserSave(save, true)}>Download editable browser plan →</button></section>)}
    </div>}
  </>;
}

export default function AccountPage({ c, onKits }: { c: Catalogue | null; onKits: () => void }) {
  const { path, search } = useLocation();
  const { account, snapshot } = usePersistence();
  const settings = search.get("view") === "settings";
  useEffect(() => { if (snapshot.user && (path === "/sign-up" || path === "/sign-in")) navigate("/account", { replace: true }); }, [snapshot.user, path]);
  if ((path === "/sign-up" || path === "/sign-in") && !snapshot.user) return <main className="wrap account-page"><SignUp signIn={path === "/sign-in"} /></main>;
  return <main className="wrap account-page" data-testid="account-page" data-account={snapshot.user ?? "guest"} data-save-status={snapshot.status}>
    <div className="account-heading"><p className="account-eyebrow">{snapshot.user ? "My account" : "On this browser"}</p><h1>{settings ? "Settings" : account.profile.name ? `${account.profile.name.split(" ")[0]}’s work` : "My work"}</h1><p className="lede">{settings ? "Your account, saving and personal details." : "What you save, plan and build, in one place."}</p></div>
    <AccountSessionActions />
    <nav className="account-tabs" aria-label="Account"><Link to="/account" aria-current={!settings ? "page" : undefined}>My work</Link><Link to="/account?view=settings" aria-current={settings ? "page" : undefined}>Settings</Link></nav>
    {settings ? <Settings /> : <MyWork c={c} onKits={onKits} />}
  </main>;
}
