import { useEffect, useRef, useState } from "react";
import { customMindMarkdown, importMind, mindFile, validateCustomMinds, type CustomMind } from "./lib/custom-minds";
import { useMindLibrary } from "./lib/mind-library";
import { download } from "./lib/download";
import "./my-minds.css";

const fresh = (): CustomMind => ({ slug: `my-mind-${crypto.randomUUID()}`, name: "", specialty: "", voice: "", principles: "", avoid: "", examples: "" });
const SIGNIN_DRAFT = "abb:mind-editor-signin";
function pendingDraft(): { mind: CustomMind; owner: string | null; revision?: number } | null {
  try {
    const raw = sessionStorage.getItem(SIGNIN_DRAFT); sessionStorage.removeItem(SIGNIN_DRAFT);
    if (!raw || raw.length > 25000) return null;
    const value = JSON.parse(raw), m = value.mind;
    if (!m || typeof m.slug !== "string" || !/^my-mind-[a-z0-9-]{1,60}$/.test(m.slug)) return null;
    for (const [field, max] of Object.entries({ name: 100, specialty: 500, voice: 3000, principles: 4000, avoid: 2000, examples: 8000 })) if (typeof m[field] !== "string" || m[field].length > max || m[field].includes("\u0000")) return null;
    if (value.owner !== null && (typeof value.owner !== "string" || value.owner.length > 200)) return null;
    return { mind: m, owner: value.owner, revision: Number.isSafeInteger(value.revision) && value.revision >= 0 ? value.revision : undefined };
  } catch { return null; }
}
export default function MyMinds({ onSignIn }: { onSignIn?: () => Promise<void> } = {}) {
  const library = useMindLibrary(), minds = library.minds;
  const [pending] = useState(pendingDraft);
  const [draft, setDraft] = useState<CustomMind | null>(pending?.mind ?? null);
  const [notice, setNotice] = useState<{ text: string; owner: string | null } | null>(null);
  const setMessage = (text: string) => setNotice({ text, owner: library.userId });
  const message = notice?.owner === library.userId ? notice.text : "";
  const [draftRevision, setDraftRevision] = useState<number | undefined>(pending?.revision), [draftOwner, setDraftOwner] = useState<string | null>(pending?.owner ?? null);
  const [removed, setRemoved] = useState<{ mind: CustomMind; owner: string | null } | null>(null);
  const [localSelection, setLocalSelection] = useState<string[] | null>(null);
  const selectedLocal = library.pendingLocal.filter(m => localSelection === null || localSelection.includes(m.slug));
  const remove = async (mind: CustomMind) => {
    try { await library.remove(mind.slug); setRemoved({ mind, owner: library.userId }); setMessage(`${mind.name} was removed from this library. Existing workflow copies stay intact.`); }
    catch (e) { setMessage((e as Error).message); }
  };
  const open = (mind: CustomMind) => { setDraft(mind); setDraftOwner(library.userId); setDraftRevision(library.mode === "account" && minds.some(m => m.slug === mind.slug) ? library.revision : undefined); setMessage(""); };
  useEffect(() => { if (library.mode !== "loading" && draftOwner && draftOwner !== library.userId) { setDraft(null); setDraftOwner(null); setDraftRevision(undefined); setMessage("Your account changed. Open a mind from the current account to edit it."); } }, [library.userId, library.mode, draftOwner]);
  const signIn = async () => {
    try { if (draft) sessionStorage.setItem(SIGNIN_DRAFT, JSON.stringify({ mind: draft, owner: draftOwner, revision: draftRevision })); await (onSignIn ? onSignIn() : library.account.signIn()); }
    catch { setMessage("Sign-in could not open. Your draft is still here."); }
  };
  const save = async (reviewed = false) => {
    try {
      const mind = validateCustomMinds([draft])[0]; await library.save(mind, reviewed ? library.revision : draftRevision);
      setDraft(null); setMessage(`${mind.name} is saved${library.mode === "account" ? " to your account" : " in this browser"}. Choose it in a task's Minds for this task section.`);
    } catch (e) { setMessage((e as Error).message || "Saving failed. Your draft is still here."); }
  };
  const input = useRef<HTMLInputElement>(null);
  const change = (key: keyof CustomMind, value: string) => setDraft(m => m && ({ ...m, [key]: value }));
  const load = async (file?: File) => {
    if (!file) return;
    try { if (file.size > 80000) throw Error("Keep a mind file under 80 KB."); open(importMind(await file.text(), file.name)); setMessage("Review the profile, then save it to your minds."); }
    catch (e) { setMessage((e as Error).message); }
    finally { if (input.current) input.current.value = ""; }
  };
  return <section className="my-minds" aria-label="My minds" data-testid="my-minds">
    <details><summary>My minds · Keep your voice across workflows{minds.length ? ` (${minds.length})` : ""}</summary>
      <p className="small">Create a reusable writing voice or way of working, then select it on any workflow task. Signed-in minds save privately to your account for use across devices. Assigned profiles are included in downloaded workflows and shared workflow links.</p>
      <div className="mind-account-status" data-testid="mind-account-status">
        {library.mode === "loading" ? <p className="small">Checking your account…</p> : library.mode === "account" ? <><p className="small">{library.busy ? "Syncing your account minds…" : "Your private account library"}</p><button type="button" className="link-btn" disabled={library.busy} onClick={() => void library.refresh()}>Refresh account minds</button></> : <><p className="small">These minds are saved in this browser. Sign in to use them across devices.{library.account.state === "error" ? " Account sign-in could not load." : ""}</p>{library.account.state === "signed-out" && <button type="button" className="link-btn" onClick={() => void signIn()}>Sign in to save minds</button>}{library.account.state === "error" && <button type="button" className="link-btn" onClick={library.account.retry}>Try account sign-in again</button>}</>}
        {library.error && <p className="small" role="alert">{library.error}</p>}
        {library.error && /sign.in|session/i.test(library.error) && <button type="button" className="link-btn" onClick={() => void signIn()}>Sign in again for account minds</button>}
        {library.mode === "account" && library.pendingLocal.length > 0 && <div><p className="small">{library.pendingLocal.length} browser-saved mind{library.pendingLocal.length === 1 ? " is" : "s are"} ready to copy. Choose which to save to this account. Your original browser copies will stay here. Conflicting profiles are kept separately.</p><fieldset className="mind-migration"><legend>Browser minds to copy</legend>{library.pendingLocal.map(m => <label key={m.slug}><input type="checkbox" checked={selectedLocal.some(p => p.slug === m.slug)} disabled={library.busy} onChange={e => setLocalSelection(e.currentTarget.checked ? [...selectedLocal.map(p => p.slug), m.slug] : selectedLocal.filter(p => p.slug !== m.slug).map(p => p.slug))} />{m.name}</label>)}</fieldset><button type="button" className="btn btn-dark btn-sm" disabled={library.busy || !!library.error || !selectedLocal.length} onClick={() => void library.copyBrowserMinds(selectedLocal.map(m => m.slug)).then(() => setMessage("Your browser minds are saved to this account. They are ready on your other devices.")).catch(e => setMessage(e.message))}>Copy browser minds to account</button></div>}
      </div>
      {removed && removed.owner === library.userId && <button type="button" className="link-btn" disabled={library.busy} onClick={() => void library.save(removed.mind).then(() => { setRemoved(null); setMessage("The removed mind is restored."); }).catch(e => setMessage(e.message))}>Undo removal of {removed.mind.name}</button>}
      <div className="my-minds-actions"><button type="button" className="btn btn-dark btn-sm" onClick={() => open(fresh())}>Create a mind</button><button type="button" className="link-btn" onClick={() => input.current?.click()}>Import mind or writing sample</button><input ref={input} type="file" accept=".json,.md,.txt" className="visually-hidden" aria-label="Import mind file" onChange={e => void load(e.currentTarget.files?.[0])} /></div>
      {minds.length > 0 && <ul className="my-minds-list">{minds.map(m => <li key={m.slug}><div><b>{m.name}</b><p className="small">{m.specialty}</p></div><div className="my-minds-actions"><button type="button" className="link-btn" onClick={() => open({ ...m })}>Edit {m.name}</button><button type="button" className="link-btn" disabled={library.busy} onClick={() => void remove(m)}>Remove {m.name}</button><button type="button" className="link-btn" onClick={() => download(new Blob([mindFile(m)], { type: "application/json" }), `${m.slug}.json`)}>Export {m.name}</button><button type="button" className="link-btn" onClick={() => download(new Blob([customMindMarkdown(m)], { type: "text/markdown" }), `${m.slug}.md`)}>Download instructions</button></div></li>)}</ul>}
      {draft && (!draftOwner || draftOwner === library.userId) && <div className="my-mind-editor" role="group" aria-label="Mind profile">
        <h3>{minds.some(m => m.slug === draft.slug) ? "Edit your mind" : "Build your own mind"}</h3>
        <p className="small">Start with two or three pieces you wrote and like. Describe what makes them sound like you, add your working rules, then try the profile on a small task and refine it.</p>
        <label>Name<input value={draft.name} maxLength={100} placeholder="My writing voice" onChange={e => change("name", e.currentTarget.value)} /></label>
        <label>What should this mind help with?<input value={draft.specialty} maxLength={500} placeholder="Write clear customer emails in my voice" onChange={e => change("specialty", e.currentTarget.value)} /></label>
        <label>Voice and writing style<textarea rows={3} value={draft.voice} maxLength={3000} placeholder="Warm and direct. Short paragraphs. Concrete examples. Use British spelling." onChange={e => change("voice", e.currentTarget.value)} /></label>
        <label>How this mind works<textarea rows={3} value={draft.principles} maxLength={4000} placeholder="Start with the reader's question. Check claims against sources. Offer one useful next step." onChange={e => change("principles", e.currentTarget.value)} /></label>
        <label>Things to avoid<textarea rows={2} value={draft.avoid} maxLength={2000} placeholder="Avoid jargon, exaggerated promises and invented personal stories." onChange={e => change("avoid", e.currentTarget.value)} /></label>
        <label>Writing samples or reference notes<textarea rows={6} value={draft.examples} maxLength={8000} placeholder="Paste examples you have permission to use. Remove confidential information before saving or sharing." onChange={e => change("examples", e.currentTarget.value)} /><small>{draft.examples.length.toLocaleString()} / 8,000 characters. Samples guide style; they do not provide facts for other tasks.</small></label>
        {draftRevision !== undefined && draftRevision !== library.revision && !library.error && <div className="mind-conflict" role="alert"><p className="small">The account library changed while you were editing. Review the latest saved profile before replacing it.</p><pre>{JSON.stringify(minds.find(m => m.slug === draft.slug) ?? { status: "This mind is no longer in your account." }, null, 2)}</pre><button type="button" className="btn btn-dark btn-sm" disabled={library.busy} onClick={() => void save(true)}>Save my version instead</button></div>}
        <div className="my-minds-actions"><button type="button" className="btn btn-primary btn-sm" disabled={library.busy || library.mode === "loading"} onClick={() => void save()}>Save mind</button><button type="button" className="link-btn" onClick={() => download(new Blob([mindFile(draft)], { type: "application/json" }), `${draft.slug}.json`)}>Export draft</button><button type="button" className="link-btn" onClick={() => setDraft(null)}>Cancel</button></div>
      </div>}
      {message && <p className="small" role="status">{message}</p>}
    </details>
  </section>;
}
