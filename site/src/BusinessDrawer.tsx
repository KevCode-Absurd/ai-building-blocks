import { useEffect, useRef, useState } from "react";
import { BEFORE_LIBRARY_SYNC, REMOTE_LIBRARY_UPDATE } from "./lib/library-storage";
import { Drawer } from "./ui";
import { Link } from "./lib/router";
import { SaveHint } from "./AccountPersistence";
import { BRAND_FILE_TITLE, DETAIL_FIELDS, GOAL_CHOICES, KIND_CHOICES, ME_MAX_BYTES, REACH_CHOICES, SETUP_QUESTIONS, type Business, businessText, drawerFocus, getBusiness, hasBusiness, meBytes, setBusiness, setupAnswered } from "./lib/business";
import { MAKE_ME_PROMPT } from "./lib/me-prompts";
import "./business-drawer.css";

const kb = (bytes: number) => `${Math.ceil(bytes / 1000)} KB`;
const tooBigMessage = (bytes: number) => `This is ${kb(bytes)}. Keep your me.md under ${kb(ME_MAX_BYTES)}: cut old projects and long notes, then try again.`;

/** Your brand file: 5 quick questions about the business, more detail if you like, and your personal me.md as an
 *  optional part. Loaded only when the drawer opens. */
export default function BusinessDrawer({ onClose, toast }: { onClose: () => void; toast: (m: string) => void }) {
  const [form, setForm] = useState<Business>(() => getBusiness());
  const [meText, setMeText] = useState(() => getBusiness().me ?? "");
  const [fileError, setFileError] = useState("");
  const [promptFailed, setPromptFailed] = useState(false);
  const [firstRun] = useState(() => !hasBusiness(getBusiness()));
  // Which optional parts start open. Fixed when the drawer opens, so clearing a field never folds it away mid-edit.
  const [startOpen] = useState(() => { const b = getBusiness(); return { details: DETAIL_FIELDS.some((f) => b[f.id]?.trim()), me: !!b.me?.trim() }; });
  const pending = useRef<Business | null>(null), remoteApplying = useRef(false), meSection = useRef<HTMLDetailsElement>(null);
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
  // Opened from the me.md guide: go straight to the personal part.
  useEffect(() => { const toMe = drawerFocus.me; drawerFocus.me = false; if (toMe && meSection.current) { meSection.current.open = true; meSection.current.scrollIntoView?.({ block: "start" }); } }, []);
  const close = () => { setBusiness(form); onClose(); };
  const set = (id: keyof Business, value: string) => setForm(f => ({ ...f, [id]: value }));
  const hasFile = !!form.me?.trim();
  const answered = setupAnswered(form);
  const details = DETAIL_FIELDS.filter((f) => form[f.id]?.trim()).length;
  const text = businessText(form);
  const customGoal = form.goal && !(GOAL_CHOICES as readonly string[]).includes(form.goal) ? form.goal : "";
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
  const status = answered === SETUP_QUESTIONS.length ? "All 5 questions answered." : `${answered} of ${SETUP_QUESTIONS.length} answered.`;
  return (
    <Drawer label={BRAND_FILE_TITLE} top={<span className="mono">{BRAND_FILE_TITLE}</span>} onClose={close}>
      <form className="biz me-drawer" onSubmit={(e) => { e.preventDefault(); close(); toast(answered || details || hasFile ? "Saved. What you copy and download now fits your business." : "Nothing saved yet."); }} data-testid="business-form">
        <h2 className="title" style={{ marginTop: 0 }}>{BRAND_FILE_TITLE}</h2>
        <SaveHint subject="brand file" onNavigate={close} />
        <p className="small biz-lead">The short briefing you'd give a new helper, written once. Answer 5 quick questions. Then every prompt you copy, every specialist you use and every pack you download fits your business.</p>
        <p className="small me-private" data-testid="me-private">Private. It stays on this device, or in your account when you sign in. It is never public. It is added to what you copy on your own device.</p>

        <section className="me-choice biz-setup" aria-labelledby="biz-setup-h" data-testid="biz-setup">
          <h3 id="biz-setup-h">{firstRun ? "Start with 5 quick questions" : "The basics"}</h3>
          <p className="small" aria-live="polite">{status} Skip any you like.</p>
          {SETUP_QUESTIONS.slice(0, 3).map((q, i) => (
            <label key={q.id} className="biz-field">
              <span>{i + 1}. {q.label}</span>
              {q.id === "name"
                ? <input value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} placeholder={q.placeholder} autoComplete="organization" data-testid="biz-name" />
                : <textarea rows={2} value={form[q.id] ?? ""} onChange={(e) => set(q.id, e.target.value)} placeholder={q.placeholder} data-testid={`biz-${q.id}`} />}
            </label>
          ))}
          <label className="biz-field">
            <span>Kind of business (optional)</span>
            <select value={form.kind ?? ""} onChange={(e) => set("kind", e.target.value)} data-testid="biz-kind">
              <option value="">Not set</option>
              {KIND_CHOICES.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
            </select>
            <small className="small">Every download then includes a playbook for this kind of business. <Link to={form.kind ? `/industries/${form.kind}` : "/industries"} onClick={close}>See the {form.kind ? "board" : "boards"}</Link></small>
          </label>
          <fieldset className="biz-choices" data-testid="biz-reach">
            <legend>4. {SETUP_QUESTIONS[3].label}</legend>
            {REACH_CHOICES.map((r) => (
              <label key={r.id} className="biz-choice"><input type="radio" name="biz-reach" value={r.id} checked={form.reach === r.id} onChange={() => set("reach", r.id)} /><span>{r.label}</span></label>
            ))}
            {(form.reach === "local" || form.reach === "both") && (
              <label className="biz-field"><span>Town or area you serve</span><input value={form.area ?? ""} onChange={(e) => set("area", e.target.value)} placeholder="For example: north Leeds" data-testid="biz-area" /></label>
            )}
          </fieldset>
          <fieldset className="biz-choices" data-testid="biz-goal">
            <legend>5. {SETUP_QUESTIONS[4].label}</legend>
            {GOAL_CHOICES.map((g) => (
              <label key={g} className="biz-choice"><input type="radio" name="biz-goal" value={g} checked={form.goal === g} onChange={() => set("goal", g)} /><span>{g}</span></label>
            ))}
            <label className="biz-field"><span className="visually-hidden">Your own goal</span><input value={customGoal} onChange={(e) => set("goal", e.target.value)} placeholder={SETUP_QUESTIONS[4].placeholder} data-testid="biz-goal-own" /></label>
          </fieldset>
        </section>

        <details className="me-choice me-basics" open={startOpen.details} data-testid="me-basics">
          <summary><h3>Add more detail (optional)</h3></summary>
          <p className="small">{hasFile ? "Your me.md below is used for these. They are added only when there is no me.md." : "Proof, your voice and what never to say help your AI write things you can use as they are."}</p>
          {DETAIL_FIELDS.map((f) => (
            <label key={f.id} className="biz-field">
              <span>{f.label}</span>
              {f.id === "site"
                ? <input value={form[f.id] ?? ""} onChange={(e) => set(f.id, e.target.value)} placeholder={f.hint} data-testid={`biz-${f.id}`} />
                : <textarea rows={f.id === "more" ? 4 : 2} value={form[f.id] ?? ""} onChange={(e) => set(f.id, e.target.value)} placeholder={f.hint} data-testid={`biz-${f.id}`} />}
            </label>
          ))}
        </details>

        <details className="me-choice me-basics" ref={meSection} open={startOpen.me} data-testid="me-part">
          <summary><h3>Your me.md (optional, about you)</h3></summary>
          <p className="small">A me.md is a short file about you as a person: your projects, how you write and what to avoid. It helps when you write as yourself. <Link to="/me-md" onClick={close}>What is a me.md?</Link></p>
          <p className="small"><strong>Make it with your AI.</strong> Copy this prompt into ChatGPT, Claude or Gemini. Your AI asks before it uses what it remembers, then writes your me.md for you to check.</p>
          <p className="me-actions"><button type="button" className="btn btn-dark btn-sm" onClick={() => void copyPrompt()} data-testid="me-copy-prompt">Copy the prompt</button><Link to="/skills/me-md-builder" onClick={close}>Or use the me.md builder skill</Link></p>
          {promptFailed && <textarea className="me-fallback" aria-label="Copy the prompt manually" readOnly rows={5} value={MAKE_ME_PROMPT} onFocus={e => e.currentTarget.select()} />}
          <label className="biz-field"><span>Paste your me.md</span>
            <textarea rows={8} value={meText} onChange={(e) => { setMeText(e.target.value); setFileError(""); }} placeholder={"# me.md\n\n## Core\n..."} aria-invalid={tooBig || undefined} aria-describedby="me-size" data-testid="me-text" />
          </label>
          <p className="me-file small"><label className="btn btn-line btn-sm me-upload">Upload a .md or .txt file<input type="file" accept=".md,.markdown,.txt,text/markdown,text/plain" onChange={(e) => { void upload(e.currentTarget.files?.[0]); e.currentTarget.value = ""; }} data-testid="me-upload" /></label><span id="me-size">{meText ? `${kb(meBytes(meText))} of ${kb(ME_MAX_BYTES)}` : `Up to ${kb(ME_MAX_BYTES)}.`}</span></p>
          {(tooBig || fileError) && <p className="me-error" role="alert" data-testid="me-error">{fileError || tooBigMessage(meBytes(meText))}</p>}
          <p className="small">Never add passwords, ID or bank numbers, health details or private facts about other people.</p>
        </details>

        <div className="biz-bar">
          <span className="small">{answered || details || hasFile ? `${status}${hasFile ? " Your me.md is saved." : ""}` : "Every question is optional."}</span>
          {(answered > 0 || details > 0 || hasFile || meText) && <button type="button" className="btn btn-ghost btn-sm" onClick={() => { if (confirm("Clear your brand file, including your me.md?")) { setMeText(""); setForm({}); } }}>Clear</button>}
          <button className="btn btn-primary btn-sm" data-testid="biz-save">Done</button>
        </div>
        {text && (
          <details className="biz-preview">
            <summary>See what your AI gets</summary>
            <p className="small">Each copy and download gets only the parts its task needs.</p>
            <pre>{text}</pre>
          </details>
        )}
      </form>
    </Drawer>
  );
}
