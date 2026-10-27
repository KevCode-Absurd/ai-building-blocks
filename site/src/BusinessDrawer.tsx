import { useEffect, useRef, useState } from "react";
import { BEFORE_LIBRARY_SYNC, REMOTE_LIBRARY_UPDATE } from "./lib/library-storage";
import { Drawer } from "./ui";
import { Link } from "./lib/router";
import { SaveHint } from "./AccountPersistence";
import { FIELDS, ME_MAX_BYTES, type Business, businessText, getBusiness, meBytes, setBusiness } from "./lib/business";
import { MAKE_ME_PROMPT } from "./lib/me-prompts";
import "./business-drawer.css";

const kb = (bytes: number) => `${Math.ceil(bytes / 1000)} KB`;
const tooBigMessage = (bytes: number) => `This is ${kb(bytes)}. Keep your me.md under ${kb(ME_MAX_BYTES)}: cut old projects and long notes, then try again.`;

/** Your me.md: make it with your AI, paste or upload it, or fill in the basics. Loaded only when the drawer opens. */
export default function BusinessDrawer({ onClose, toast }: { onClose: () => void; toast: (m: string) => void }) {
  const [form, setForm] = useState<Business>(() => getBusiness());
  const [meText, setMeText] = useState(() => getBusiness().me ?? "");
  const [fileError, setFileError] = useState("");
  const [promptFailed, setPromptFailed] = useState(false);
  const pending = useRef<Business | null>(null), remoteApplying = useRef(false);
  const tooBig = meBytes(meText) > ME_MAX_BYTES;
  // A pasted file over the limit is shown with a message and never saved.
  useEffect(() => { if (!tooBig) setForm(f => ((f.me ?? "") === meText ? f : { ...f, me: meText })); }, [meText, tooBig]);
  useEffect(() => {
    if (remoteApplying.current) { remoteApplying.current = false; pending.current = null; return; }
    pending.current = form;
    const timer = setTimeout(() => { if (pending.current === form) { setBusiness(form); pending.current = null; } }, 250);
    return () => clearTimeout(timer);
  }, [form]);
  useEffect(() => {
    const flush = () => { if (pending.current) { setBusiness(pending.current); pending.current = null; } };
    const received = (event: Event) => { if ((event as CustomEvent<string[]>).detail.includes("abb:business")) { remoteApplying.current = true; pending.current = null; const next = getBusiness(); setForm(next); setMeText(next.me ?? ""); } };
    window.addEventListener(BEFORE_LIBRARY_SYNC, flush); window.addEventListener(REMOTE_LIBRARY_UPDATE, received);
    return () => { window.removeEventListener(BEFORE_LIBRARY_SYNC, flush); window.removeEventListener(REMOTE_LIBRARY_UPDATE, received); flush(); };
  }, []);
  const close = () => { setBusiness(form); onClose(); };
  const hasFile = !!form.me?.trim();
  const filled = FIELDS.filter((f) => form[f.id]?.trim()).length;
  const text = businessText(form);
  const copyPrompt = async () => {
    try { await navigator.clipboard.writeText(MAKE_ME_PROMPT); setPromptFailed(false); toast("Prompt copied. Paste it into ChatGPT, Claude or Gemini."); }
    catch { setPromptFailed(true); }
  };
  const upload = async (file?: File) => {
    setFileError("");
    if (!file) return;
    if (!/\.(md|markdown|txt)$/i.test(file.name)) { setFileError("Upload a .md or .txt file."); return; }
    if (file.size > ME_MAX_BYTES) { setFileError(tooBigMessage(file.size)); return; }
    try { setMeText(await file.text()); toast(`${file.name} added. Check it, then select Done.`); }
    catch { setFileError("That file could not be read. Open it, copy the text and paste it here instead."); }
  };
  return (
    <Drawer label="Your me.md" top={<span className="mono">Your me.md</span>} onClose={close}>
      <form className="biz me-drawer" onSubmit={(e) => { e.preventDefault(); close(); toast(hasFile || filled ? "Saved. Your copies and downloads now include your me.md." : "Nothing saved yet."); }} data-testid="business-form">
        <h2 className="title" style={{ marginTop: 0 }}>Your me.md</h2>
        <SaveHint subject="me.md" onNavigate={close} />
        <p className="small biz-lead">One short file that tells your AI who you are. Save it once, and every prompt you copy and every pack you download fits you. <Link to="/me-md" onClick={close}>What is a me.md?</Link></p>
        <p className="small me-private" data-testid="me-private">Private. It stays on this device, or in your account when you sign in. It is never public.</p>

        <section className="me-choice" aria-labelledby="me-make-h">
          <h3 id="me-make-h">1. Make it with your AI</h3>
          <p className="small">Copy this prompt into ChatGPT, Claude or Gemini. Your AI asks before it uses what it remembers, then writes your me.md for you to check.</p>
          <p className="me-actions"><button type="button" className="btn btn-dark btn-sm" onClick={() => void copyPrompt()} data-testid="me-copy-prompt">Copy the prompt</button><Link to="/skills/me-md-builder" onClick={close}>Or use the me.md builder skill</Link></p>
          {promptFailed && <textarea className="me-fallback" aria-label="Copy the prompt manually" readOnly rows={5} value={MAKE_ME_PROMPT} onFocus={e => e.currentTarget.select()} />}
        </section>

        <section className="me-choice" aria-labelledby="me-paste-h">
          <h3 id="me-paste-h">2. Paste or upload your me.md</h3>
          <label className="biz-field"><span>Your me.md</span>
            <textarea rows={8} value={meText} onChange={(e) => { setMeText(e.target.value); setFileError(""); }} placeholder={"# me.md\n\n## Core\n..."} aria-invalid={tooBig || undefined} aria-describedby="me-size" data-testid="me-text" />
          </label>
          <p className="me-file small"><label className="btn btn-line btn-sm me-upload">Upload a .md or .txt file<input type="file" accept=".md,.markdown,.txt,text/markdown,text/plain" onChange={(e) => { void upload(e.currentTarget.files?.[0]); e.currentTarget.value = ""; }} data-testid="me-upload" /></label><span id="me-size">{meText ? `${kb(meBytes(meText))} of ${kb(ME_MAX_BYTES)}` : `Up to ${kb(ME_MAX_BYTES)}.`}</span></p>
          {(tooBig || fileError) && <p className="me-error" role="alert" data-testid="me-error">{fileError || tooBigMessage(meBytes(meText))}</p>}
          <p className="small">Never add passwords, ID or bank numbers, health details or private facts about other people.</p>
        </section>

        <details className="me-choice me-basics" open={!hasFile} data-testid="me-basics">
          <summary><h3>3. Fill in the basics</h3></summary>
          {hasFile && <p className="small">Your me.md above is used. These fields are used only when there is no me.md.</p>}
          {FIELDS.map((f) => (
            <label key={f.id} className="biz-field">
              <span>{f.label}</span>
              {f.id === "name" || f.id === "site"
                ? <input value={form[f.id] ?? ""} onChange={(e) => setForm({ ...form, [f.id]: e.target.value })} placeholder={f.hint} data-testid={`biz-${f.id}`} />
                : <textarea rows={f.id === "more" ? 4 : 2} value={form[f.id] ?? ""} onChange={(e) => setForm({ ...form, [f.id]: e.target.value })} placeholder={f.hint} data-testid={`biz-${f.id}`} />}
            </label>
          ))}
        </details>

        <div className="biz-bar">
          <span className="small">{hasFile ? "Your me.md is saved." : filled ? `${filled} of ${FIELDS.length} filled in` : "Every part is optional."}</span>
          {(filled > 0 || hasFile || meText) && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { if (confirm("Clear your me.md and basics?")) { setMeText(""); setForm({}); } }}>Clear</button>}
          <button className="btn btn-primary btn-sm" data-testid="biz-save">Done</button>
        </div>
        {text && (
          <details className="biz-preview">
            <summary>See your me.md</summary>
            <p className="small">Each copy and download gets only the parts its task needs.</p>
            <pre>{text}</pre>
          </details>
        )}
      </form>
    </Drawer>
  );
}
