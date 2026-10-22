import { useRef, useState } from "react";
import { customMindMarkdown, importMind, mindFile, validateCustomMinds, type CustomMind } from "./lib/custom-minds";
import { saveMind, useMyMinds } from "./lib/mind-library";
import { download } from "./lib/handoff";
import "./my-minds.css";

const fresh = (): CustomMind => ({ slug: `my-mind-${crypto.randomUUID()}`, name: "", specialty: "", voice: "", principles: "", avoid: "", examples: "" });
export default function MyMinds() {
  const minds = useMyMinds(), [draft, setDraft] = useState<CustomMind | null>(null), [message, setMessage] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const change = (key: keyof CustomMind, value: string) => setDraft(m => m && ({ ...m, [key]: value }));
  const load = async (file?: File) => {
    if (!file) return;
    try { if (file.size > 80000) throw Error("Keep a mind file under 80 KB."); setDraft(importMind(await file.text(), file.name)); setMessage("Review the profile, then save it to your minds."); }
    catch (e) { setMessage((e as Error).message); }
    finally { if (input.current) input.current.value = ""; }
  };
  return <section className="my-minds" aria-label="My minds" data-testid="my-minds">
    <details><summary>My minds · Keep your voice across workflows{minds.length ? ` (${minds.length})` : ""}</summary>
      <p className="small">Create a reusable writing voice or way of working. Save it here, then select it on any workflow task. Profiles stay in this browser; assigned minds are included in your downloads and shared workflow links.</p>
      <div className="my-minds-actions"><button type="button" className="btn btn-dark btn-sm" onClick={() => { setDraft(fresh()); setMessage(""); }}>Create a mind</button><button type="button" className="link-btn" onClick={() => input.current?.click()}>Import mind or writing sample</button><input ref={input} type="file" accept=".json,.md,.txt" className="visually-hidden" aria-label="Import mind file" onChange={e => void load(e.currentTarget.files?.[0])} /></div>
      {minds.length > 0 && <ul className="my-minds-list">{minds.map(m => <li key={m.slug}><div><b>{m.name}</b><p className="small">{m.specialty}</p></div><div className="my-minds-actions"><button type="button" className="link-btn" onClick={() => { setDraft({ ...m }); setMessage(""); }}>Edit {m.name}</button><button type="button" className="link-btn" onClick={() => download(new Blob([mindFile(m)], { type: "application/json" }), `${m.slug}.json`)}>Export {m.name}</button><button type="button" className="link-btn" onClick={() => download(new Blob([customMindMarkdown(m)], { type: "text/markdown" }), `${m.slug}.md`)}>Download instructions</button></div></li>)}</ul>}
      {draft && <div className="my-mind-editor" role="group" aria-label="Mind profile">
        <h3>{minds.some(m => m.slug === draft.slug) ? "Edit your mind" : "Build your own mind"}</h3>
        <p className="small">Start with two or three pieces you wrote and like. Describe what makes them sound like you, add your working rules, then try the profile on a small task and refine it.</p>
        <label>Name<input value={draft.name} maxLength={100} placeholder="My writing voice" onChange={e => change("name", e.currentTarget.value)} /></label>
        <label>What should this mind help with?<input value={draft.specialty} maxLength={500} placeholder="Write clear customer emails in my voice" onChange={e => change("specialty", e.currentTarget.value)} /></label>
        <label>Voice and writing style<textarea rows={3} value={draft.voice} maxLength={3000} placeholder="Warm and direct. Short paragraphs. Concrete examples. Use British spelling." onChange={e => change("voice", e.currentTarget.value)} /></label>
        <label>How this mind works<textarea rows={3} value={draft.principles} maxLength={4000} placeholder="Start with the reader's question. Check claims against sources. Offer one useful next step." onChange={e => change("principles", e.currentTarget.value)} /></label>
        <label>Things to avoid<textarea rows={2} value={draft.avoid} maxLength={2000} placeholder="Avoid jargon, exaggerated promises and invented personal stories." onChange={e => change("avoid", e.currentTarget.value)} /></label>
        <label>Writing samples or reference notes<textarea rows={6} value={draft.examples} maxLength={8000} placeholder="Paste examples you have permission to use. Remove confidential information before saving or sharing." onChange={e => change("examples", e.currentTarget.value)} /><small>{draft.examples.length.toLocaleString()} / 8,000 characters. Samples guide style; they do not provide facts for other tasks.</small></label>
        <div className="my-minds-actions"><button type="button" className="btn btn-primary btn-sm" onClick={() => { try { const mind = validateCustomMinds([draft])[0]; saveMind(mind); setDraft(null); setMessage(`${mind.name} is saved. Choose it in a task's Minds for this task section.`); } catch (e) { setMessage((e as Error).message || "Saving failed. Try exporting a copy."); } }}>Save mind</button><button type="button" className="link-btn" onClick={() => setDraft(null)}>Cancel</button></div>
      </div>}
      {message && <p className="small" role="status">{message}</p>}
    </details>
  </section>;
}
