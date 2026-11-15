// /from-a-source: paste a long source, download a pack your AI turns into a workflow and its skills (docs/INTAKE.md).
// Nothing is generated here. The pack carries your text, the framework and a HANDOFF.md; your AI does the work.
import { useEffect, useRef, useState } from "react";
import type { Catalogue } from "./lib/data";
import { getBusiness, hasBusiness, useBusiness } from "./lib/business";
import { download } from "./lib/handoff";
import { type IntakeInput, type SourceKind, SHORT, SOURCE_KINDS, buildIntakePack, wordCount } from "./lib/intake";
import { Link } from "./lib/router";
import ExecutionPrompt from "./ExecutionPrompt";
import { usePersistence } from "./AccountPersistence";
import "./intake-layout.css";

const empty: IntakeInput = { title: "", by: "", link: "", kind: "blog", text: "" };
type Props = { c: Catalogue; toast: (m: string) => void };

/** The old aib-intake-draft has no owner. Leave its bytes untouched for explicit owner recovery. */
export default function IntakePage(props: Props) {
  const { account, snapshot, ready } = usePersistence();
  const user = account.state === "signed-in" ? account.userId : null;
  if (!ready || snapshot.user !== user) return <main className="wrap bp-hero"><p role="status">Opening your source draft…</p></main>;
  const owner = snapshot.user ? `user:${encodeURIComponent(snapshot.user)}` : "guest";
  const key = `abb:intake-draft:v2:${owner}`;
  return <ScopedIntakePage key={key} {...props} draftKey={key} />;
}

function readDraft(key: string): IntakeInput {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "null");
    if (!value || typeof value !== "object") return empty;
    return {
      title: typeof value.title === "string" ? value.title : "",
      by: typeof value.by === "string" ? value.by : "",
      link: typeof value.link === "string" ? value.link : "",
      text: typeof value.text === "string" ? value.text : "",
      kind: SOURCE_KINDS.some(k => k.id === value.kind) ? value.kind : "blog",
    };
  } catch { return empty; }
}

function ScopedIntakePage({ c, toast, draftKey }: Props & { draftKey: string }) {
  const [v, setV] = useState<IntakeInput>(() => readDraft(draftKey));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [helpOpen, setHelpOpen] = useState(false);
  const active = useRef(true);
  const downloadButton = useRef<HTMLButtonElement>(null);
  const biz = hasBusiness(useBusiness());
  useEffect(() => { active.current = true; return () => { active.current = false; }; }, []);
  useEffect(() => { if (error && !busy) downloadButton.current?.focus(); }, [error, busy]);
  useEffect(() => { document.title = "Create skills from content · AI Blocks"; }, []);
  useEffect(() => { try { localStorage.setItem(draftKey, JSON.stringify(v)); } catch { /* keep this visit's draft in memory */ } }, [draftKey, v]);
  const set = (k: keyof IntakeInput) => (e: { target: { value: string } }) => { setV(x => ({ ...x, [k]: e.target.value })); setError(""); };
  const words = wordCount(v.text);
  const get = async () => {
    if (busy) return;
    setBusy(true); setError("");
    try {
      const r = await buildIntakePack(c, v, getBusiness());
      if (!active.current) return;
      if ("error" in r) { setError(r.error ?? "Check your connection and try again."); return; }
      download(r.blob, r.filename);
      setHelpOpen(true);
      toast("Download started.");
    } catch {
      if (active.current) setError("The download could not start. Check your connection and try again.");
    } finally { if (active.current) setBusy(false); }
  };
  return (
    <main className="wrap bp-hero intake" data-testid="intake-page">
      <Link to="/compose" className="back"><span aria-hidden="true">←</span> Build a workflow</Link>
      <p className="bp-kicker"><span className="kind">From content</span><Link to="/skills/long-source-to-workflow">Read the full method</Link></p>
      <h1 className="bp-h1">Turn a long article, video or book into a workflow you can run</h1>
      <p className="bp-sub">Paste the full text. You get a pack with your source, the steps to follow and the library's skills. Give it to your AI and it finds the method, checks the order with you, writes a skill for every step, then the workflow that runs them in order.</p>

      <ol className="intake-steps" aria-label="What happens">
        <li><b>Paste the text.</b> Use the article, transcript or your full notes.</li>
        <li><b>Download the files.</b> Your source and the instructions stay together.</li>
        <li><b>Use them in your AI.</b> Review the steps it finds before it writes the skills and workflow.</li>
      </ol>

      <form className="intake-form" onSubmit={(e) => { e.preventDefault(); get(); }}>
        <p className="small intake-entry-note">Only the source text is needed. Add the other details if you have them.</p>
        <div className="intake-row">
          <label>Title (optional)<input value={v.title} onChange={set("title")} placeholder="How we price our bundles" data-testid="intake-title" /></label>
          <label>Who made it (optional)<input value={v.by} onChange={set("by")} placeholder="The writer, speaker or channel" data-testid="intake-by" /></label>
        </div>
        <div className="intake-row">
          <label>Link for credit (optional)<input value={v.link} onChange={set("link")} placeholder="https://" inputMode="url" aria-describedby="intake-link-help" data-testid="intake-link" /><span className="small intake-field-help" id="intake-link-help">A link does not load the content. Paste its text below.</span></label>
          <label>What it is
            <select value={v.kind} onChange={(e) => setV((x) => ({ ...x, kind: e.target.value as SourceKind }))} data-testid="intake-kind">
              {SOURCE_KINDS.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
          </label>
        </div>
        <label>Source text (required)
          <textarea value={v.text} onChange={set("text")} rows={14} required aria-describedby="intake-source-help intake-words" placeholder="Paste the whole article, transcript or your notes. A summary loses steps, so use the full text where you can." data-testid="intake-text" />
        </label>
        <p className="small intake-entry-note" id="intake-source-help">For a video or podcast, paste the transcript. This page prepares files; your AI turns the content into a workflow.</p>
        <p className="small" id="intake-words" data-testid="intake-words">
          {words ? `${words.toLocaleString()} words.` : "Nothing pasted yet."}
          {words > 0 && words < SHORT && " That's short. If it's a summary, your AI will mark the steps it can't find."}
          {biz ? " Your org context goes in the pack too." : ""}
        </p>
        {error && <p className="small intake-error" role="alert">We could not prepare the files. Your text is still here. {error}</p>}
        <div className="bp-actions intake-actions">
          <button ref={downloadButton} type="submit" className="btn btn-primary" disabled={!words || busy} data-testid="intake-download">{busy ? "Preparing the files…" : error ? "Try download again" : "Download the pack"}</button>
          {words > 0 && <button type="button" className="btn btn-dark" onClick={() => { setV(empty); setError(""); }}>Clear</button>}
        </div>
        <p className="small intake-local-note">Your draft stays in this browser. It is not synced to your account. Your source text goes into the download, not to an AI.</p>
        <details className="intake-transfer-help" open={helpOpen} onToggle={e => setHelpOpen(e.currentTarget.open)}><summary>How to use the downloaded files</summary>
          <ol><li>Unzip the download and keep all its files together.</li><li>Open the folder in your AI coding assistant, or attach the files in your AI chat.</li><li>Say "Follow HANDOFF.md". Your AI will show you the steps it found. Review them before it writes the skills and workflow.</li></ol>
          <p className="small">Your AI makes the result in your chat or workspace. <Link to="/how-it-works#use-in-ai" target="_blank" rel="noopener">Get help using the files<span className="visually-hidden"> (opens in a new tab)</span></Link>.</p>
          <ExecutionPrompt name={v.title || "Source to workflow"} goal={`Turn ${v.title || "the supplied source"} into a reusable workflow and its skills`} />
        </details>
      </form>
    </main>
  );
}
