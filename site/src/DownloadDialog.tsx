// Downloading a workflow, in two parts: what you'll need before you start, then what to do with the folder.
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Need } from "./lib/handoff";
import { hasBusiness, useBusiness } from "./lib/business";
import { openBusiness } from "./Business";
import ExecutionPrompt from "./ExecutionPrompt";

const AIS = [
  { id: "chat", name: "Chat" },
  { id: "code", name: "Coding assistant" },
  { id: "saved", name: "Reusable instructions" },
] as const;
type Ai = (typeof AIS)[number]["id"];
const KEY = "abb:install-tab"; // shared with the portable skill setup instructions

function steps(ai: Ai, zip: string, biz: boolean): ReactNode[] {
  const files = <><b>HANDOFF.md</b>, <b>START_HERE.txt</b>, <b>workflow.json</b>, <b>EXECUTION.md</b>{biz && <>, <b>about-me.md</b></>} and the complete <b>skills</b> folder with its references, plus the other package files</>;
  switch (ai) {
    case "code": return [
      <>Unzip <b>{zip}</b> into a new folder.</>,
      <>Open that folder in your AI coding assistant and ask it to read HANDOFF.md.</>,
      <>Paste the first message below. With file access, each step saves its result in the <b>outputs</b> folder.</>,
    ];
    case "saved": return [
      <>Unzip <b>{zip}</b>.</>,
      <>Add {files} to a project or reusable assistant that supports files and instructions.</>,
      <>Open that project or assistant and paste the first message below.</>,
    ];
    default: return [
      <>Unzip <b>{zip}</b>.</>,
      <>In a new chat, attach {files}. If your AI cannot read attachments, paste their contents.</>,
      <>Paste the first message below. Ask for each output as a file or a code block you can save.</>,
    ];
  }
}

/** Opens on what you'll need. After the download, it shows how to run the folder in the AI you use. */
export function DownloadDialog({ name, goal, zip, needs, finals, onDownload, onClose, kind = "workflow" }: {
  name: string; goal?: string; zip: string; needs: Need[]; finals: string[]; onDownload: () => Promise<boolean>; onClose: () => void;
  kind?: "workflow" | "agent";
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [got, setGot] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ai, setAi] = useState<Ai>(() => { try { const t = localStorage.getItem(KEY); return AIS.some((x) => x.id === t) ? (t as Ai) : "chat"; } catch { return "chat"; } });
  const biz = hasBusiness(useBusiness());
  useEffect(() => { const d = ref.current; if (d && !d.open) d.showModal(); }, []);
  const close = () => ref.current?.close();
  const pick = (a: Ai) => { setAi(a); try { localStorage.setItem(KEY, a); } catch { /* private mode */ } };
  const go = async () => { if (busy) return; setBusy(true); try { if (await onDownload()) setDone(true); } finally { setBusy(false); } };
  const must = needs.filter((n) => n.required), may = needs.filter((n) => !n.required);
  const item = (n: Need) => (
    <li key={n.type}>
      <label>
        <input type="checkbox" checked={got.has(n.type)} onChange={() => setGot((s) => { const x = new Set(s); if (x.has(n.type)) x.delete(n.type); else x.add(n.type); return x; })} />
        <span><b>{n.label}</b><small>{n.about ? `${n.about} ` : ""}For step{n.steps.length > 1 ? "s" : ""} {n.steps.join(", ")}.</small></span>
      </label>
    </li>
  );
  return (
    <dialog className="atf needs" ref={ref} onClose={onClose} onClick={(e) => { if (e.target === ref.current) close(); }} aria-labelledby="needs-h" data-testid="needs">
      <div className="atf-top">
        <h2 className="atf-title" id="needs-h">{done ? `Run “${name}” in your AI` : `What you'll need for “${name}”`}</h2>
        <button className="icon-btn" onClick={close} aria-label="Close">×</button>
      </div>
      {!done ? (
        <div className="atf-body">
          <div className="atf-foot"><span className="small">The download includes the rules and complete skills.</span><button className="btn btn-primary" disabled={busy} onClick={() => void go()} data-testid="needs-download">{busy ? "Preparing the files…" : kind === "agent" ? "Download the agent pack" : "Download the workflow"}</button></div>
          <ExecutionPrompt name={name} goal={goal} />
          {needs.length === 0
            ? <p className="atf-lead">Nothing to gather. Every step works from your request or an earlier step's result.</p>
            : <p className="atf-lead">Your AI first looks for these in your files and available context. If a required file is missing, it asks before that step starts. For useful optional files, it asks if you want to attach or create them.</p>}
          {must.length > 0 && <><h3 className="atf-h">Have these ready</h3><ul className="needs-list" data-testid="needs-required">{must.map(item)}</ul></>}
          {may.length > 0 && <><h3 className="atf-h">These make it better, if you have them</h3><ul className="needs-list">{may.map(item)}</ul></>}
          <p className="small biz-in">{biz ? "Your saved context goes in the folder too." : <>Save <button className="link-btn" onClick={() => { close(); openBusiness(); }} data-testid="needs-add-business">your context</button> once to include it in future packs.</>}</p>
          <div className="atf-foot">
            <span className="small">{needs.length ? `${got.size} of ${needs.length} gathered` : "No extra files listed"}. This list is a reminder; your AI still needs to validate the files.</span>
          </div>
        </div>
      ) : (
        <div className="atf-body" data-testid="next-steps">
          <p className="atf-lead">The folder is downloading as <b>{zip}</b>. Here's how to run it.</p>
          <div className="kind-tabs next-tabs" role="tablist" aria-label="Your AI">
            {AIS.map((x) => <button key={x.id} role="tab" aria-selected={ai === x.id} onClick={() => pick(x.id)} data-testid={`next-${x.id}`}>{x.name}</button>)}
          </div>
          <ol className="num-list next-list">{steps(ai, zip, biz).map((s, i) => <li key={`${ai}${i}`}><span className="n">{i + 1}</span><span>{s}</span></li>)}</ol>
          <ExecutionPrompt name={name} goal={goal} copyTestId="copy-first-message" />
          <div className="next-what">
            {must.length > 0 && <div><h3 className="atf-h">It will ask you for</h3><ul>{must.map((n) => <li key={n.type}>{n.label}</li>)}</ul></div>}
            {finals.length > 0 && <div><h3 className="atf-h">You get back</h3><ul data-testid="next-finals">{finals.map((f) => <li key={f}>{f}</li>)}</ul></div>}
          </div>
          <p className="small">The folder tells your AI to check its work after each step, and to ask you before it publishes, sends or spends anything.</p>
          <div className="atf-foot">
            <button className="btn btn-ghost btn-sm" onClick={() => void onDownload()}>Download again</button>
            <button className="btn btn-primary" onClick={close} data-testid="next-done">Done</button>
          </div>
        </div>
      )}
    </dialog>
  );
}
