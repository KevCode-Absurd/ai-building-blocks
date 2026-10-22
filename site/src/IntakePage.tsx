// /from-a-source: paste a long source, download a pack your AI turns into a workflow and its skills (docs/INTAKE.md).
// Nothing is generated here. The pack carries your text, the framework and a HANDOFF.md; your AI does the work.
import { useEffect, useState } from "react";
import type { Catalogue } from "./lib/data";
import { getBusiness, hasBusiness, useBusiness } from "./lib/business";
import { download } from "./lib/handoff";
import { type IntakeInput, type SourceKind, SHORT, SOURCE_KINDS, buildIntakePack, wordCount } from "./lib/intake";
import { Link } from "./lib/router";
import ExecutionPrompt from "./ExecutionPrompt";

const DRAFT = "aib-intake-draft";
const empty: IntakeInput = { title: "", by: "", link: "", kind: "blog", text: "" };

export default function IntakePage({ c, toast }: { c: Catalogue; toast: (m: string) => void }) {
  const [v, setV] = useState<IntakeInput>(() => { try { return { ...empty, ...JSON.parse(localStorage.getItem(DRAFT) ?? "{}") }; } catch { return empty; } });
  const [busy, setBusy] = useState(false);
  const biz = hasBusiness(useBusiness());
  useEffect(() => { document.title = "Create skills from content · AI Blocks"; }, []);
  useEffect(() => { try { localStorage.setItem(DRAFT, JSON.stringify(v)); } catch { /* private window */ } }, [v]);
  const set = (k: keyof IntakeInput) => (e: { target: { value: string } }) => setV((x) => ({ ...x, [k]: e.target.value }));
  const words = wordCount(v.text);
  const get = async () => {
    setBusy(true);
    const r = await buildIntakePack(c, v, getBusiness());
    setBusy(false);
    if ("error" in r) { toast(r.error ?? "Couldn't make the pack."); return; }
    download(r.blob, r.filename);
    toast("Pack downloaded. Give the folder to your AI and say \"Follow HANDOFF.md\".");
  };
  return (
    <main className="wrap bp-hero intake" data-testid="intake-page">
      <p className="bp-kicker"><span className="kind">Intake</span><Link to="/skills/long-source-to-workflow">How it works</Link></p>
      <h1 className="bp-h1">Turn a long article, video or book into a workflow you can run</h1>
      <p className="bp-sub">Paste the full text. You get a pack with your source, the steps to follow and the library's skills. Give it to your AI and it finds the method, checks the order with you, writes a skill for every step, then the workflow that runs them in order.</p>
      <button type="button" className="btn btn-primary" disabled={!words || busy} onClick={() => void get()} data-testid="intake-download-top">{busy ? "Making the pack…" : "Download the workflow"}</button>
      <ExecutionPrompt name={v.title || "Source to workflow"} goal={`Turn ${v.title || "the supplied source"} into a reusable workflow and its skills`} />

      <ol className="intake-steps" aria-label="What happens">
        <li><b>Map the skeleton.</b> The steps the source teaches, in its order, each with where it came from.</li>
        <li><b>A skill per step.</b> New ones in your own words, or skills from the library it can reuse.</li>
        <li><b>The workflow.</b> The skills in order, each one taking the result of the one before.</li>
      </ol>

      <form className="intake-form" onSubmit={(e) => { e.preventDefault(); get(); }}>
        <div className="intake-row">
          <label>Title<input value={v.title} onChange={set("title")} placeholder="How we price our bundles" data-testid="intake-title" /></label>
          <label>Who made it<input value={v.by} onChange={set("by")} placeholder="The writer, speaker or channel" data-testid="intake-by" /></label>
        </div>
        <div className="intake-row">
          <label>Link<input value={v.link} onChange={set("link")} placeholder="https://" inputMode="url" data-testid="intake-link" /></label>
          <label>What it is
            <select value={v.kind} onChange={(e) => setV((x) => ({ ...x, kind: e.target.value as SourceKind }))} data-testid="intake-kind">
              {SOURCE_KINDS.map((k) => <option key={k.id} value={k.id}>{k.name}</option>)}
            </select>
          </label>
        </div>
        <label>The source, in full
          <textarea value={v.text} onChange={set("text")} rows={14} placeholder="Paste the whole article, transcript or your notes. A summary loses steps, so use the full text where you can." data-testid="intake-text" />
        </label>
        <p className="small" data-testid="intake-words">
          {words ? `${words.toLocaleString()} words.` : "Nothing pasted yet."}
          {words > 0 && words < SHORT && " That's short. If it's a summary, your AI will mark the steps it can't find."}
          {biz ? " Your saved context goes in the pack too." : ""}
        </p>
        <div className="bp-actions">
          <button type="submit" className="btn btn-primary" disabled={!words || busy} data-testid="intake-download">{busy ? "Making the pack…" : "Download the pack"}</button>
          {words > 0 && <button type="button" className="btn btn-dark" onClick={() => setV(empty)}>Clear</button>}
        </div>
        <ExecutionPrompt name={v.title || "Source to workflow"} goal={`Turn ${v.title || "the supplied source"} into a reusable workflow and its skills`} />
        <p className="small">Your text stays in your browser and goes only into the zip. Open the folder in your AI coding assistant and say "Follow HANDOFF.md". In a chat, upload the files and say the same.</p>
      </form>
    </main>
  );
}
