import { SharingSettings } from "./SharingSettings";
import { hasAccount } from "../lib/library-storage";
import { legacySpaceKey } from "../lib/space";
import { LINK_ACCESS, type AccessPolicy } from "../server/space-access";
// Spaces on the site: /space (your own), /s/<link> (a space someone shared with you) and /people (public items).
// Data lives on the server (src/server/spaces.ts); this browser keeps only the owner key (src/lib/space.ts).
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowIcon } from "../ui";
import { Code, Section } from "../BlockPage";
import { Link, navigate } from "../lib/router";
import { type Catalogue, pathOf } from "../lib/data";
import { download } from "../lib/handoff";
import { shareUrl } from "../lib/plan";
import { type Flow, useStore, uid } from "../lib/store";
import { getBusiness } from "../lib/business";
import ExecutionPrompt from "../ExecutionPrompt";
import { buildSpaceWorkflowExport, hasWorkflowData, isWorkflowItem, sourceGoal, spaceExecutionPrompt, spaceWorkflowUrl, workflowDataForSpace } from "../lib/space-workflow-export";
import { KIND_NAMES, type Item, type Kind, type NewItem, type PublicItem, SpaceError, deviceLink, fromText, itemsFromFile, setSpaceKey, shareLink, spaceKey, spaces, useSpaceKey } from "../lib/space";
import "./space.css";

type Toast = (m: string) => void;
const TITLE = "Free AI Skills & Custom Workflow Builder | AI Blocks";
const useTitle = (t: string) => useEffect(() => { document.title = `${t} · AI Blocks`; return () => { document.title = TITLE; }; }, [t]);
const KINDS: Kind[] = ["skill", "prompt", "workflow", "kit", "agent"];
const errText = (e: unknown) => (e instanceof SpaceError ? e.message : "That didn't work. Try again.");
const copy = async (text: string, toast: Toast, done: string) => {
  try { await navigator.clipboard.writeText(text); toast(done); }
  catch { toast("Your browser couldn't copy it. Select the text and copy it manually."); }
};
const fileName = (i: Item) => `${i.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item"}.md`;
type FlowData = Partial<Flow> & { localId?: string };
type KitData = { slugs: string[]; localId?: string };

/** One item: what it is, what's in it, and what you can do with it here. */
function ItemCard({ item, c, toast, owner, onChange, onDelete, onSave }: {
  item: Item; c: Catalogue | null; toast: Toast; owner?: boolean;
  onChange?: (patch: Partial<NewItem>) => void; onDelete?: () => void; onSave?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [exportError, setExportError] = useState("");
  const workflow = isWorkflowItem(item), structured = workflow && hasWorkflowData(item);
  const flow = workflow ? (item.data as FlowData | null) : null;
  const kit = item.kind === "kit" ? (item.data as KitData | null) : null;
  const slugs = Array.isArray(flow?.nodes) ? flow.nodes.map(n => n?.slug).filter(s => typeof s === "string") : Array.isArray(kit?.slugs) ? kit.slugs.filter(s => typeof s === "string") : [];
  const blocks = c ? slugs.map((s) => Object.hasOwn(c.bySlug, s) ? c.bySlug[s] : null).filter(Boolean) : [];
  const getWorkflow = async () => {
    if (busy) return;
    setBusy(true); setExportError("");
    try { const result = await buildSpaceWorkflowExport(c, item, getBusiness()); download(result.blob, result.filename); toast(result.mode === "workflow" ? "Workflow pack downloaded" : "Source files downloaded. Your AI must verify the workflow before running it."); }
    catch (e) { setExportError(e instanceof Error ? e.message : "The complete workflow could not be downloaded."); }
    finally { setBusy(false); }
  };
  const toBuilder = () => {
    setExportError("");
    try {
      if (structured) { if (!c) throw Error("The skill library is still loading. Try again when it is ready."); window.location.href = spaceWorkflowUrl(c, item); return; }
      if (Array.isArray(kit?.slugs) && kit.slugs.length) window.location.href = shareUrl({ id: uid(), name: item.title, nodes: kit.slugs.map((slug, i) => ({ id: uid(), slug, x: 40 + i * 300, y: 110 })), edges: [], updated: Date.now() });
    } catch (e) { setExportError(e instanceof Error ? e.message : "The complete workflow could not be opened."); }
  };
  return (
    <article className="sp-item" data-testid="space-item" data-kind={item.kind}>
      <header className="sp-item-top">
        <span className="sp-kind">{KIND_NAMES[item.kind]}</span>
        {owner ? (
          <div className="sp-vis" role="group" aria-label={`Who can see ${item.title}`}>
            {(["private", "public"] as const).map((v) => (
              <button key={v} aria-pressed={item.visibility === v} onClick={() => item.visibility !== v && onChange?.({ visibility: v })} data-testid={`vis-${v}`}>{v === "private" ? "Private" : "Public"}</button>
            ))}
          </div>
        ) : item.visibility === "public" ? <span className="sp-kind">Public</span> : null}
      </header>
      <h3 className="sp-item-h">{item.title}</h3>
      {item.summary && <p className="sp-item-p">{item.summary}</p>}
      {blocks.length > 0 && <p className="small sp-steps">{blocks.map((b, n) => b && <span key={`${b.slug}-${n}`}>{n ? (flow ? " → " : ", ") : ""}<Link to={pathOf(b)}>{b.name}</Link></span>)}</p>}
      {workflow && !structured && <p className="small" data-testid="space-source-status">Source awaiting review. Your AI must find the full workflow, skills and required files before it starts. The download marks execution as blocked until that review is complete.</p>}
      <div className="sp-acts">
        {item.body && <button className="btn btn-ghost btn-sm" onClick={() => setOpen(!open)} aria-expanded={open} data-testid="item-open">{open ? "Close" : "Open"}</button>}
        {item.body && <button className="btn btn-ghost btn-sm" onClick={() => copy(item.body, toast, "Source text copied.")}>{workflow ? "Copy source text" : "Copy"}</button>}
        {workflow ? <button className="btn btn-primary btn-sm" onClick={() => void getWorkflow()} disabled={busy} data-testid="space-workflow-download">{busy ? "Preparing the files…" : structured ? item.kind === "agent" ? "Download the agent pack" : "Download the workflow" : "Download source files"}</button> : item.body && <button className="btn btn-ghost btn-sm" onClick={() => download(new Blob([item.body], { type: "text/markdown" }), fileName(item))}>Download</button>}
        {(structured || slugs.length > 0) && <button className="btn btn-ghost btn-sm" onClick={toBuilder} data-testid="item-builder">Open in the builder</button>}
        {onSave && <button className="btn btn-ghost btn-sm" onClick={onSave} data-testid="item-save">Save to team space</button>}
        {owner && onDelete && <button className="btn btn-ghost btn-sm sp-del" onClick={() => { if (confirm(`Delete "${item.title}" from your space? This can't be undone.`)) onDelete(); }} data-testid="item-delete">Delete</button>}
      </div>
      {workflow && <ExecutionPrompt name={item.title} goal={sourceGoal(item)} instructions={spaceExecutionPrompt(item)} copyTestId="space-copy-execution-prompt" />}
      {exportError && <p role="alert" className="small" data-testid="space-workflow-error">{exportError}</p>}
      {open && item.body && <div className="sp-body"><Code name={fileName(item)} text={item.body} toast={toast} /></div>}
    </article>
  );
}

function Grouped({ items, render }: { items: Item[]; render: (i: Item) => JSX.Element }) {
  return (
    <>
      {KINDS.filter((k) => items.some((i) => i.kind === k)).map((k) => (
        <div key={k} className="sp-group">
          <h3 className="with-h">{KIND_NAMES[k]}s</h3>
          <div className="sp-grid">{items.filter((i) => i.kind === k).map(render)}</div>
        </div>
      ))}
    </>
  );
}

/** Add an item: drop or pick a SKILL.md, a text file or a zip of skills, or paste one. */
function AddForm({ onAdd }: { onAdd: (items: NewItem[]) => Promise<void> }) {
  const [kind, setKind] = useState<Kind>("skill");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const reset = () => { setTitle(""); setSummary(""); setBody(""); };
  const files = async (list: FileList | null) => {
    if (!list?.length) return;
    setBusy(true);
    try { await onAdd((await Promise.all([...list].map(itemsFromFile))).flat().map((i) => ({ ...i, kind: kind === "workflow" || kind === "kit" ? "skill" : kind }))); }
    finally { setBusy(false); if (fileRef.current) fileRef.current.value = ""; }
  };
  const submit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (busy || (!title.trim() && !body.trim())) return;
    const filled = fromText(body, title || "Untitled", kind);
    setBusy(true);
    try { await onAdd([{ ...filled, title: title.trim() || filled.title, summary: summary.trim() || filled.summary }]); reset(); }
    finally { setBusy(false); }
  };
  return (
    <form className="sp-add" onSubmit={submit} data-testid="add-form">
      <div className={`sp-drop${drag ? " on" : ""}`} onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); files(e.dataTransfer?.files ?? null); }}>
        <p><b>Drop a SKILL.md, a text file or a zip of skills here</b>, or <button type="button" className="link-btn" onClick={() => fileRef.current?.click()}>pick files</button>. Each skill in a zip is added on its own.</p>
        <input ref={fileRef} type="file" accept=".md,.txt,.zip" multiple hidden onChange={(e) => files(e.currentTarget.files)} data-testid="add-file" />
      </div>
      <p className="small sp-or">Or paste one:</p>
      <div className="sp-row">
        <label className="sp-field"><span>What it is</span>
          <select value={kind} onChange={(e) => setKind(e.currentTarget.value as Kind)} data-testid="add-kind">{KINDS.map((k) => <option key={k} value={k}>{KIND_NAMES[k]}</option>)}</select>
        </label>
        <label className="sp-field grow"><span>Name</span><input value={title} onInput={(e) => setTitle(e.currentTarget.value)} maxLength={80} placeholder="Refund reply writer" data-testid="add-title" /></label>
      </div>
      <label className="sp-field"><span>One line on what it does (optional)</span><input value={summary} onInput={(e) => setSummary(e.currentTarget.value)} maxLength={240} placeholder="Writes a kind refund reply from the order details" /></label>
      <label className="sp-field"><span>{kind === "agent" ? "The agent's instructions" : kind === "workflow" ? "The steps, in order" : kind === "kit" ? "What's in it" : "The skill or prompt"}</span>
        <textarea rows={7} value={body} onInput={(e) => setBody(e.currentTarget.value)} placeholder={kind === "agent" ? "You answer support emails for…" : "Paste the SKILL.md or the prompt"} data-testid="add-body" />
      </label>
      <p><button className="btn btn-primary btn-sm" disabled={busy || (!title.trim() && !body.trim())} data-testid="add-save">{busy ? "Saving…" : "Add to team space"}</button></p>
      <p className="small">You can also add a workflow from the builder.</p>
    </form>
  );
}

function MakeSpace({ toast, onMade }: { toast: Toast; onMade?: () => void }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [paste, setPaste] = useState("");
  const [pasteError, setPasteError] = useState("");
  const pasteRef = useRef<HTMLInputElement>(null);
  const signedIn = hasAccount();
  const make = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setBusy(true);
    try { const r = await spaces.make(name.trim() || "Team space"); if (!hasAccount()) setSpaceKey(r.ownerKey); onMade?.(); toast("Your space is ready"); }
    catch (err) { toast(errText(err)); }
    finally { setBusy(false); }
  };
  const open = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!paste.trim()) { setPasteError("Paste your private link first. You copied it when you made your space."); pasteRef.current?.focus(); return; }
    setPasteError("");
    const k = decodeURIComponent((/key=([^&\s]+)/.exec(paste)?.[1] ?? paste).trim());
    try { if (hasAccount()) await spaces.claim(k); else await spaces.mine(k); setSpaceKey(k); onMade?.(); toast("Space opened"); } catch (err) { toast(errText(err)); }
  };
  return (
    <div className="sp-start">
      <form className="sp-card" onSubmit={make} data-testid="make-space">
        <h2 className="bp-h2">Make your team space</h2>
        {signedIn
          ? <p className="small" data-testid="space-sign-in-note">Your space is saved to your account, so you can open it on any device.</p>
          : <div className="sp-sign-in" data-testid="space-sign-in-note">
              <p className="small">Sign in first to keep your space on every device and choose who on your team can open it.</p>
              <p><Link to="/sign-in" className="btn btn-line btn-sm" data-testid="space-sign-in">Sign in</Link></p>
              <p className="small">You can also make one without signing in. It stays in this browser, and you get a private link to open it anywhere else.</p>
            </div>}
        <label className="sp-field"><span>Name it</span><input value={name} onInput={(e) => setName(e.currentTarget.value)} maxLength={60} placeholder="Sam's marketing team" data-testid="space-name" /></label>
        <p><button className="btn btn-primary" disabled={busy} data-testid="make-space-go">{busy ? "Making it…" : "Make my team space"} <ArrowIcon /></button></p>
      </form>
      <form className="sp-card" onSubmit={open} noValidate>
        <h2 className="bp-h2">Already have one?</h2>
        <p className="small">Paste the private link you copied from "Use it on another device".</p>
        <label className="sp-field"><span>Your private link</span><input ref={pasteRef} value={paste} onInput={(e) => { setPaste(e.currentTarget.value); if (pasteError) setPasteError(""); }} aria-invalid={pasteError ? true : undefined} aria-describedby={pasteError ? "space-key-error" : undefined} data-testid="space-key-paste" /></label>
        {pasteError && <p className="sp-error" id="space-key-error" role="alert" data-testid="space-key-error">{pasteError}</p>}
        <p><button className="btn btn-dark btn-sm" data-testid="space-key-open">Open it</button></p>
      </form>
    </div>
  );
}

/** Kits and workflows saved only in this browser, offered once so they move into the space. */
function BringIn({ items, onAdd }: { items: Item[]; onAdd: (items: NewItem[]) => Promise<void> }) {
  const kits = useStore((s) => s.kits);
  const flows = useStore((s) => s.flows);
  const have = new Set(items.map((i) => (i.data as { localId?: string } | null)?.localId).filter(Boolean));
  const newKits = kits.filter((k) => k.slugs.length && !have.has(k.id));
  const newFlows = flows.filter((f) => f.nodes.length && !have.has(f.id));
  if (!newKits.length && !newFlows.length) return null;
  const bring = () => onAdd([
    ...newKits.map((k): NewItem => ({ kind: "kit", title: k.name, summary: `${k.slugs.length} blocks`, data: { slugs: k.slugs, localId: k.id } })),
    ...newFlows.map((f): NewItem => ({ kind: "workflow", title: f.name, summary: `${f.nodes.length} steps`, data: workflowDataForSpace(f) })),
  ]);
  return (
    <div className="sp-bring" data-testid="bring-in">
      <p><b>{[newKits.length && `${newKits.length} saved set${newKits.length > 1 ? "s" : ""} of skills`, newFlows.length && `${newFlows.length} workflow${newFlows.length > 1 ? "s" : ""}`].filter(Boolean).join(" and ")}</b> {newKits.length + newFlows.length > 1 ? "are" : "is"} saved only in this browser.</p>
      <button className="btn btn-dark btn-sm" onClick={bring} data-testid="bring-in-go">Add to team space</button>
    </div>
  );
}

function MySpace({ c, toast }: { c: Catalogue | null; toast: Toast }) {
  const browserKey = useSpaceKey();
  const k = hasAccount() ? "account" : browserKey;
  const [state, setState] = useState<{ status: "loading" | "ready" | "off" | "error" | "empty"; access?: AccessPolicy; name: string; share: string; items: Item[]; message?: string }>({ status: "loading", name: "", share: "", items: [] });
  // A "use on another device" link: take the key from after the #, then clear it from the address bar.
  useEffect(() => {
    const m = /key=([^&]+)/.exec(location.hash);
    if (m) { setSpaceKey(decodeURIComponent(m[1])); history.replaceState(null, "", "/space"); }
  }, []);
  const load = useCallback(async () => {
    if (!spaceKey()) return;
    try { const r = await spaces.mine(); setState({ status: "ready", name: r.space.name, share: r.shareToken, access: r.access, items: r.items }); }
    catch (e) { setState({ status: hasAccount() && e instanceof SpaceError && e.status === 404 ? "empty" : e instanceof SpaceError && (e.status === 503 || e.status === 404) ? "off" : "error", name: "", share: "", items: [], message: errText(e) }); }
  }, []);
  useEffect(() => { load(); }, [k, load]);
  useTitle(state.name || "Team space");

  const add = async (list: NewItem[]) => {
    let n = 0;
    for (const i of list) { try { await spaces.add(i); n++; } catch (e) { toast(errText(e)); break; } }
    if (n) toast(n === 1 ? "Added to your space" : `Added ${n} to your space`);
    load();
  };
  const change = async (id: string, patch: Partial<NewItem>) => {
    try { await spaces.change(id, patch); toast(patch.visibility === "public" ? "Public: it shows on From people" : patch.visibility === "private" ? "Private: only people with your link see it" : "Saved"); load(); } catch (e) { toast(errText(e)); }
  };
  const remove = async (id: string) => { try { await spaces.remove(id); toast("Deleted"); load(); } catch (e) { toast(errText(e)); } };
  const rename = async (name: string) => { if (name.trim() && name.trim() !== state.name) { try { await spaces.rename(name.trim()); toast("Renamed"); load(); } catch (e) { toast(errText(e)); } } };
  const newLink = async () => {
    if (!confirm("Make a new share link? The old link stops working, so anyone using it will need the new one.")) return;
    try { await spaces.newLink(); toast("New link made. The old one no longer works."); load(); } catch (e) { toast(errText(e)); }
  };

  if (!k || state.status === "empty") {
    return (
      <main className="bp sp" data-testid="space-page">
        <header className="wrap bp-hero">
          <p className="bp-kicker"><span className="kind">Team space</span>Free</p>
          <h1 className="bp-h1">Keep your skills and workflows in one place, and share them with your team</h1>
          <p className="bp-sub">Save your own skills, prompts, workflows and agents in one place. Then choose who on your team can open them: people you invite, or anyone with your company email. Nothing is public unless you make it public.</p>
          <p className="small sp-work-link" data-testid="space-work-link">Your private plans, workflows and calculator numbers are in <Link to="/account">My work</Link>. Only you see those. Your team space is what you choose to share.</p>
        </header>
        <div className="wrap ap-body">{hasAccount() && legacySpaceKey() && <p><button className="btn btn-dark" onClick={async () => { try { await spaces.claim(); await load(); } catch (e) { toast(errText(e)); } }}>Link my existing browser space to this account</button></p>}<MakeSpace toast={toast} onMade={load} /></div>
      </main>
    );
  }
  return (
    <main className="bp sp" data-testid="space-page">
      <header className="wrap bp-hero">
        <p className="bp-kicker"><span className="kind">Team space</span>{state.items.length} item{state.items.length === 1 ? "" : "s"}</p>
        {state.status === "ready"
          ? <h1 className="bp-h1"><input className="sp-name" defaultValue={state.name} key={state.name} aria-label="Space name" onBlur={(e) => rename(e.currentTarget.value)} onKeyDown={(e) => { if (e.key === "Enter") e.currentTarget.blur(); }} data-testid="space-title" /></h1>
          : <h1 className="bp-h1">Team space</h1>}
        <p className="bp-sub">Your skills, prompts, workflows and agents. Share the link below with your team. They can read and copy what's here, but they can't change it.</p>
        <p className="small sp-work-link" data-testid="space-work-link">Your private plans, workflows and calculator numbers are in <Link to="/account">My work</Link>. Only you see those. Your team space is what you choose to share.</p>
      </header>
      <div className="wrap ap-body">
        {state.status === "loading" && <p className="small">Loading…</p>}
        {state.status === "off" && <p className="cm-note" data-testid="spaces-off">{state.message}</p>}
        {state.status === "error" && (
          <div className="cm-note"><p>{state.message}</p><p><button className="btn btn-dark btn-sm" onClick={load}>Try again</button> <button className="link-btn" onClick={() => { if (confirm("Forget this space on this browser? You'll need its key to open it again.")) setSpaceKey(""); }}>Use a different space</button></p></div>
        )}
        {state.status === "ready" && (
          <>
            <section className="sp-share" aria-label="Share your space" data-testid="share-box">
              <div>
                <h2 className="bp-h2">Share with your team</h2>
                <p className="small">Choose who can open this link below. Allowed people can read and copy items; they cannot edit your space.</p>
              </div>
              <div className="sp-link">
                <input readOnly value={shareLink(state.share)} aria-label="Share link" data-testid="share-link" onFocus={(e) => e.currentTarget.select()} />
                <button className="btn btn-primary btn-sm" onClick={() => copy(shareLink(state.share), toast, "Link copied. Send it to your team.")} data-testid="share-copy">Copy link</button>
                <button className="btn btn-ghost btn-sm" onClick={newLink} data-testid="share-new">Make a new link</button>
              </div>
            </section>

            <SharingSettings key={JSON.stringify(state.access)} access={state.access ?? LINK_ACCESS} onSaved={() => { toast("Workspace access saved"); void load(); }} />

            <Section id="add" title="Add to your space" wide>
              <AddForm onAdd={add} />
              <BringIn items={state.items} onAdd={add} />
            </Section>

            <Section id="items" title="In your space" lead={state.items.length ? "Private items follow your workspace access settings. Public ones also show on From people." : undefined} wide>
              {state.items.length === 0 && <div className="empty"><h3 className="h3">Nothing here yet</h3><p>Add a skill above, or save a workflow from the builder.</p></div>}
              <Grouped items={state.items} render={(i) => <ItemCard key={i.id} item={i} c={c} toast={toast} owner onChange={(p) => change(i.id, p)} onDelete={() => remove(i.id)} />} />
            </Section>

            {!hasAccount() && <Section id="device" title="Use it on another device" lead="This link opens your space to change it. Treat it like a password: keep it to yourself.">
              <p><button className="btn btn-dark btn-sm" onClick={() => copy(deviceLink(spaceKey()), toast, "Copied. Open it on your other device.")} data-testid="device-copy">Copy my private link</button></p>
              <details>
                <summary>Copy my private link manually</summary>
                <label className="sp-field"><span>Private device link</span><input readOnly autoComplete="off" value={deviceLink(spaceKey())} onFocus={(e) => e.currentTarget.select()} data-testid="device-link" /></label>
              </details>
              <p className="small"><button className="link-btn" onClick={() => { if (confirm("Forget this space on this browser? You'll need your private link to open it again.")) setSpaceKey(""); }}>Forget it on this browser</button></p>
            </Section>}
          </>
        )}
      </div>
    </main>
  );
}

/** Saves a copy of someone's item into your own space, if you have one. */
function useSaveCopy(toast: Toast) {
  const k = useSpaceKey();
  return k || hasAccount() ? async (i: Item) => {
    try { await spaces.add({ kind: i.kind, title: i.title, summary: i.summary, body: i.body, data: i.data }); toast(`Saved a copy of “${i.title}” to your space`); } catch (e) { toast(errText(e)); }
  } : undefined;
}

function SharedSpace({ token, c, toast }: { token: string; c: Catalogue | null; toast: Toast }) {
  const [state, setState] = useState<{ status: "loading" | "ready" | "missing"; name: string; items: Item[]; message?: string }>({ status: "loading", name: "", items: [] });
  const save = useSaveCopy(toast);
  useEffect(() => {
    spaces.shared(token).then((r) => setState({ status: "ready", name: r.space.name, items: r.items })).catch((e) => setState({ status: "missing", name: "", items: [], message: errText(e) }));
  }, [token]);
  useTitle(state.name || "Shared space");
  return (
    <main className="bp sp" data-testid="shared-space">
      <header className="wrap bp-hero">
        <p className="bp-kicker"><span className="kind">Shared with you</span>{state.status === "ready" ? `${state.items.length} item${state.items.length === 1 ? "" : "s"}` : ""}</p>
        <h1 className="bp-h1">{state.status === "ready" ? state.name : state.status === "missing" ? "This link doesn't open a space" : "Opening…"}</h1>
        <p className="bp-sub">{state.status === "missing" ? state.message : "Someone shared their space with you. Copy or download anything, open workflows in the builder, or save copies to your own space."}</p>
        {!save && state.status === "ready" && <div className="bp-actions"><Link to="/space" className="btn btn-dark btn-sm">Make your own space to save copies</Link></div>}
      </header>
      <div className="wrap ap-body">
        {state.status === "ready" && (state.items.length
          ? <Grouped items={state.items} render={(i) => <ItemCard key={i.id} item={i} c={c} toast={toast} onSave={save ? () => save(i) : undefined} />} />
          : <div className="empty"><h3 className="h3">Nothing here yet</h3><p>The space is empty for now.</p></div>)}
      </div>
    </main>
  );
}

function People({ c, toast }: { c: Catalogue | null; toast: Toast }) {
  useTitle("From people");
  const [list, setList] = useState<{ status: "loading" | "ready" | "off"; items: PublicItem[]; message?: string }>({ status: "loading", items: [] });
  const [open, setOpen] = useState<Record<string, Item>>({});
  const save = useSaveCopy(toast);
  useEffect(() => { spaces.publicList().then((r) => setList({ status: "ready", items: r.items })).catch((e) => setList({ status: "off", items: [], message: errText(e) })); }, []);
  const full = async (p: PublicItem) => {
    if (open[p.id]) return open[p.id];
    const { item } = await spaces.publicItem(p.id);
    setOpen((o) => ({ ...o, [p.id]: item }));
    return item;
  };
  return (
    <main className="bp sp" data-testid="people-page">
      <header className="wrap bp-hero">
        <p className="bp-kicker"><span className="kind">From people</span>Shared in the open</p>
        <h1 className="bp-h1">Skills and workflows other people made public</h1>
        <p className="bp-sub">Anyone with a space can make an item public. We don't check these, so read one before you rely on it. In our library, blocks marked Safety checked have been checked for harmful or hidden instructions.</p>
        <div className="bp-actions"><Link to="/space" className="btn btn-primary btn-sm">Share yours from your space <ArrowIcon size={12} /></Link><Link to="/#library" className="btn btn-dark btn-sm">See the library</Link></div>
      </header>
      <div className="wrap ap-body">
        {list.status === "loading" && <p className="small">Loading…</p>}
        {list.status === "off" && <p className="cm-note" data-testid="spaces-off">{list.message}</p>}
        {list.status === "ready" && !list.items.length && <div className="empty"><h3 className="h3">Nothing public yet</h3><p>Be the first: make an item in your space public.</p></div>}
        <div className="sp-grid">
          {list.items.map((p) => open[p.id]
            ? <ItemCard key={p.id} item={open[p.id]} c={c} toast={toast} onSave={save ? () => save(open[p.id]) : undefined} />
            : (
              <article key={p.id} className="sp-item" data-testid="public-item">
                <header className="sp-item-top"><span className="sp-kind">{KIND_NAMES[p.kind]}</span><span className="small">from {p.space || "someone"}</span></header>
                <h3 className="sp-item-h">{p.title}</h3>
                {p.summary && <p className="sp-item-p">{p.summary}</p>}
                <div className="sp-acts"><button className="btn btn-ghost btn-sm" onClick={() => full(p).catch((e) => toast(errText(e)))} data-testid="public-open">See it</button></div>
              </article>
            ))}
        </div>
      </div>
    </main>
  );
}

export default function SpacePage({ path, c, toast }: { path: string; c: Catalogue | null; toast: Toast }) {
  const parts = useMemo(() => path.split("/").filter(Boolean), [path]);
  if (parts[0] === "s" && parts[1]) return <SharedSpace token={decodeURIComponent(parts[1])} c={c} toast={toast} />;
  if (parts[0] === "people") return <People c={c} toast={toast} />;
  if (parts[0] !== "space") navigate("/space", { replace: true });
  return <MySpace c={c} toast={toast} />;
}
