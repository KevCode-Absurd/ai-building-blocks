// Downloading a workflow, in two parts: what you'll need before you start, then what to do with the folder.
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Need } from "./lib/handoff";
import { hasBusiness, useBusiness } from "./lib/business";
import { openBusiness } from "./Business";

export const FIRST_MESSAGE = "Follow HANDOFF.md step by step. Start with “Before you start”, and ask me for anything that's missing.";

const AIS = [
  { id: "claude", name: "Claude" },
  { id: "code", name: "Claude Code" },
  { id: "chatgpt", name: "ChatGPT" },
  { id: "other", name: "Any other AI" },
] as const;
type Ai = (typeof AIS)[number]["id"];
const KEY = "abb:install-tab"; // the same choice as on skill pages: pick your AI once

function steps(ai: Ai, zip: string, biz: boolean): ReactNode[] {
  const files = <><b>HANDOFF.md</b>{biz && <>, <b>my-business.md</b></>} and the SKILL.md files in the <b>skills</b> folder</>;
  switch (ai) {
    case "claude": return [
      <>Unzip <b>{zip}</b>.</>,
      <>In Claude, start a new chat and attach {files}. Running it often? Make a <b>Project</b> and add the files to its knowledge, so you only do this once.</>,
      <>Paste the first message below and send it.</>,
    ];
    case "code": return [
      <>Unzip <b>{zip}</b> into a new folder.</>,
      <>Open a terminal in that folder and type <code>claude</code>.</>,
      <>Paste the first message below. Each step saves its result in the <b>outputs</b> folder.</>,
    ];
    case "chatgpt": return [
      <>Unzip <b>{zip}</b>.</>,
      <>In ChatGPT, start a new chat and attach {files}. Running it often? Make a <b>Project</b> and add the files to it.</>,
      <>Paste the first message below and send it.</>,
    ];
    default: return [
      <>Unzip <b>{zip}</b>.</>,
      <>Give your AI {files}, any way it takes files: attach them, or add them to a project or its knowledge.</>,
      <>Paste the first message below and send it.</>,
    ];
  }
}

/** Opens on what you'll need. After the download, it shows how to run the folder in the AI you use. */
export function DownloadDialog({ name, zip, needs, finals, onDownload, onClose }: {
  name: string; zip: string; needs: Need[]; finals: string[]; onDownload: () => Promise<boolean>; onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [got, setGot] = useState<Set<string>>(new Set());
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);
  const [ai, setAi] = useState<Ai>(() => { try { const t = localStorage.getItem(KEY); return AIS.some((x) => x.id === t) ? (t as Ai) : t === "gemini" ? "other" : "claude"; } catch { return "claude"; } });
  const biz = hasBusiness(useBusiness());
  useEffect(() => { const d = ref.current; if (d && !d.open) d.showModal(); }, []);
  const close = () => ref.current?.close();
  const pick = (a: Ai) => { setAi(a); try { localStorage.setItem(KEY, a); } catch { /* private mode */ } };
  const go = async () => { if (await onDownload()) setDone(true); };
  const copy = async () => { await navigator.clipboard.writeText(FIRST_MESSAGE).catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1600); };
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
          {needs.length === 0
            ? <p className="atf-lead">Nothing to gather. Every step works from your request or an earlier step's result.</p>
            : <p className="atf-lead">Gather these once, before you start. Your AI asks for each one at the step that uses it, and writes MISSING where something isn't there.</p>}
          {must.length > 0 && <><h3 className="atf-h">Have these ready</h3><ul className="needs-list" data-testid="needs-required">{must.map(item)}</ul></>}
          {may.length > 0 && <><h3 className="atf-h">These make it better, if you have them</h3><ul className="needs-list">{may.map(item)}</ul></>}
          <p className="small biz-in">{biz ? "Your business details go in the folder too, so your AI won't ask for them." : <>Add <button className="link-btn" onClick={() => { close(); openBusiness(); }} data-testid="needs-add-business">your business details</button> first, and they go in the folder so your AI asks you less.</>}</p>
          <div className="atf-foot">
            <span className="small">{needs.length ? `${got.size} of ${needs.length} ready` : "Ready to go"}</span>
            <button className="btn btn-primary" onClick={go} data-testid="needs-download">Download the workflow</button>
          </div>
        </div>
      ) : (
        <div className="atf-body" data-testid="next-steps">
          <p className="atf-lead">The folder is downloading as <b>{zip}</b>. Here's how to run it.</p>
          <div className="kind-tabs next-tabs" role="tablist" aria-label="Your AI">
            {AIS.map((x) => <button key={x.id} role="tab" aria-selected={ai === x.id} onClick={() => pick(x.id)} data-testid={`next-${x.id}`}>{x.name}</button>)}
          </div>
          <ol className="num-list next-list">{steps(ai, zip, biz).map((s, i) => <li key={`${ai}${i}`}><span className="n">{i + 1}</span><span>{s}</span></li>)}</ol>
          <figure className="first-msg">
            <figcaption><span>First message</span><button className="code-copy" onClick={copy} data-testid="copy-first-message">{copied ? "Copied" : "Copy"}</button></figcaption>
            <p>{FIRST_MESSAGE}</p>
          </figure>
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
