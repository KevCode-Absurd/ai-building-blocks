import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Need } from "./lib/handoff";
import { hasBusiness, useBusiness } from "./lib/business";
import { openBusiness } from "./Business";
import ExecutionPrompt from "./ExecutionPrompt";
import "./task-simplicity.css";
import { trackUxEvent } from "./lib/ux-events";

const AIS = [
  { id: "chat", name: "Chat" },
  { id: "code", name: "Coding assistant" },
  { id: "saved", name: "Saved AI project" },
] as const;
type Ai = (typeof AIS)[number]["id"];
const KEY = "abb:install-tab";

function steps(ai: Ai, zip: string): ReactNode[] {
  switch (ai) {
    case "code": return [<>Unzip <b>{zip}</b> into a new folder.</>, <>Open that folder in your AI coding assistant. Keep all the files together.</>, <>Ask it to read <b>START_HERE.txt</b> and follow <b>HANDOFF.md</b>. Add the material it asks for.</>];
    case "saved": return [<>Unzip <b>{zip}</b>.</>, <>Add all the files and the complete skills folder to an AI project that can read files and use the required tools.</>, <>Ask it to read <b>START_HERE.txt</b> and follow <b>HANDOFF.md</b>. Give it the material it asks for.</>];
    default: return [<>Unzip <b>{zip}</b>.</>, <>In a new AI chat, attach the plan files and every skill with its supporting files. Your AI needs file support and the tools required by the task.</>, <>Ask it to read <b>START_HERE.txt</b> and follow <b>HANDOFF.md</b>. Ask for the results as files you can save.</>];
  }
}

/** Can be kept on a task page after the download dialog closes. */
export function TransferGuide({ name, goal, zip }: { name: string; goal?: string; zip: string }) {
  const [ai, setAi] = useState<Ai>(() => { try { const saved = localStorage.getItem(KEY); return AIS.some(x => x.id === saved) ? saved as Ai : "chat"; } catch { return "chat"; } });
  const pick = (value: Ai) => { setAi(value); try { localStorage.setItem(KEY, value); } catch { /* retain for this visit */ } };
  return <div className="task-file-transfer" data-testid="transfer-guide">
    <h3>Use the files in your AI</h3>
    <details className="task-tool-choice"><summary>{AIS.find(x => x.id === ai)?.name} · Change</summary><div className="kind-tabs next-tabs" role="group" aria-label="Your AI">{AIS.map(x => <button key={x.id} type="button" aria-pressed={ai === x.id} onClick={() => pick(x.id)} data-testid={`next-${x.id}`}>{x.name}</button>)}</div></details>
    <ol className="num-list next-list">{steps(ai, zip).map((s, i) => <li key={`${ai}${i}`}><span className="n">{i + 1}</span><span>{s}</span></li>)}</ol>
    <p className="small">Your AI runs the task. The download does not run, publish or schedule anything. It tells your AI to check its work and ask before it sends, publishes or spends.</p>
    <details><summary>Need a first message or a file checklist?</summary><p>Keep HANDOFF.md, START_HERE.txt, workflow.json, EXECUTION.md, the complete skills folder and all other package files together. If your AI cannot read them or use the needed tools, choose a compatible AI before running this task.</p><ExecutionPrompt name={name} goal={goal} copyTestId="copy-first-message" /></details>
  </div>;
}

export function DownloadDialog({ name, goal, zip, needs, finals, onDownload, onClose, kind = "workflow", onPrepared }: {
  name: string; goal?: string; zip: string; needs: Need[]; finals: string[]; onDownload: () => Promise<boolean>; onClose: () => void;
  kind?: "workflow" | "agent"; onPrepared?: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [got, setGot] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const biz = hasBusiness(useBusiness());
  useEffect(() => { const previous = document.activeElement as HTMLElement | null; const d = ref.current; if (d && !d.open) d.showModal(); return () => { if (previous?.isConnected) previous.focus(); }; }, []);
  const close = () => ref.current?.close();
  const go = async () => {
    if (busy) return;
    setBusy(true); setError(""); trackUxEvent("pack_download_requested");
    try { if (await onDownload()) { setDone(true); onPrepared?.(); } else { setError("The files could not be prepared. Check the task or steps, then try again. Your work is kept."); } }
    catch { setError("The download could not start. Check your connection and try again. Your work is kept."); }
    finally { setBusy(false); }
  };
  const must = needs.filter(n => n.required), may = needs.filter(n => !n.required);
  const item = (n: Need) => <li key={n.type}><label><input type="checkbox" checked={got.has(n.type)} onChange={() => setGot(s => { const next = new Set(s); if (next.has(n.type)) next.delete(n.type); else next.add(n.type); return next; })} /><span><b>{n.label}</b><small>{n.about ? `${n.about} ` : ""}For step{n.steps.length > 1 ? "s" : ""} {n.steps.join(", ")}.</small></span></label></li>;
  return <dialog className="atf needs task-download" ref={ref} onClose={onClose} onClick={e => { if (e.target === ref.current) close(); }} aria-labelledby="needs-h" data-testid="needs">
    <div className="atf-top"><h2 className="atf-title" id="needs-h">{done ? "Files prepared. Use them in your AI." : `Get the files for “${name}”`}</h2><button className="icon-btn" onClick={close} aria-label="Close">×</button></div>
    <div className="atf-body" data-testid={done ? "next-steps" : undefined}>
      {error && <p role="alert">{error}</p>}
      {!done ? <>
        <p>The pack includes the full instructions, skills and supporting files. Your AI does the work after you give it the files.</p>
        {must.length ? <><h3 className="atf-h">Material to add in your AI</h3><ul className="needs-list" data-testid="needs-required">{must.map(item)}</ul><p className="small">You can download now and add this material later. These checkboxes are reminders, not file checks.</p></> : <p>No extra files are listed. Start from your request.</p>}
        {may.length > 0 && <details><summary>Helpful extras (optional)</summary><ul className="needs-list">{may.map(item)}</ul></details>}
        <details><summary>Your me.md in this pack</summary><p className="small">{biz ? "The parts of your me.md this workflow needs are included in the download." : <>Optional: <button className="link-btn" onClick={() => { close(); openBusiness(); }} data-testid="needs-add-business">add your me.md</button> before downloading.</>}</p></details>
        <div className="atf-foot"><span className="small">{must.length ? `${must.filter(n => got.has(n.type)).length} of ${must.length} required items noted` : "Complete task files"}</span><button className="btn btn-primary" disabled={busy} onClick={() => void go()} data-testid="needs-download">{busy ? "Preparing the files…" : kind === "agent" ? "Download the agent files" : "Download the workflow"}</button></div>
        {busy && <p role="status" className="small">Preparing the complete files…</p>}
      </> : <>
        <p className="atf-lead">The browser was asked to download <b>{zip}</b>. Check your downloads if you cannot find it.</p>
        <TransferGuide name={name} goal={goal} zip={zip} />
        <details><summary>What your AI needs and gives back</summary><div className="next-what">{must.length > 0 && <div><h3 className="atf-h">It will ask you for</h3><ul>{must.map(n => <li key={n.type}>{n.label}</li>)}</ul></div>}{finals.length > 0 && <div><h3 className="atf-h">Expected results from your AI</h3><ul data-testid="next-finals">{finals.map(f => <li key={f}>{f}</li>)}</ul></div>}</div></details>
        <div className="atf-foot"><button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => void go()}>Download again</button><button className="btn btn-primary" onClick={close} data-testid="next-done">Close instructions</button></div>
      </>}
    </div>
  </dialog>;
}
