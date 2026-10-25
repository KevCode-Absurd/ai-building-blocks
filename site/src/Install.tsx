import { useState, type ReactNode } from "react";
import type { Block } from "./lib/data";
import { buildSkillZip, download } from "./lib/handoff";
import { getBusiness, useBusiness, withBusiness } from "./lib/business";
import "./task-simplicity.css";
import { trackUxEvent } from "./lib/ux-events";

const TABS = [
  { id: "chat", name: "Chat" },
  { id: "code", name: "Coding assistant" },
  { id: "saved", name: "Saved AI project" },
] as const;
type Tab = (typeof TABS)[number]["id"];
const KEY = "abb:install-tab";

/** Full-file transfer stays available on the task after download. */
export default function Install({ b, skill, toast, compact = false, onPrepared }: { b: Block; skill: string | null; toast: (m: string) => void; compact?: boolean; onPrepared?: () => void }) {
  const business = useBusiness();
  const personalSkill = skill ? withBusiness(skill, business) : null;
  const [tab, setTab] = useState<Tab>(() => { try { const t = localStorage.getItem(KEY); return TABS.some(x => x.id === t) ? t as Tab : "chat"; } catch { return "chat"; } });
  const [prepared, setPrepared] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copyFailed, setCopyFailed] = useState(false);
  const pick = (t: Tab) => { setTab(t); try { localStorage.setItem(KEY, t); } catch { /* keep selection for this visit */ } };
  const zip = async () => {
    if (!skill || busy) return;
    setBusy(true); setError(""); trackUxEvent("pack_download_requested");
    try { download(await buildSkillZip(b.slug, skill, b.hasFiles, getBusiness()), `${b.slug}.zip`); setPrepared(true); onPrepared?.(); toast("Files prepared. Follow the steps to use them in your AI."); }
    catch { setError("The files could not be prepared. Your details are kept. Try downloading again."); }
    finally { setBusy(false); }
  };
  const copy = async () => {
    if (!personalSkill) return;
    try { await navigator.clipboard.writeText(personalSkill); setCopyFailed(false); trackUxEvent("request_copied"); toast("Instructions copied. Paste them into your AI."); }
    catch { setCopyFailed(true); }
  };
  const steps: Record<Tab, ReactNode[]> = {
    chat: [<>Unzip <b>{b.slug}.zip</b>.</>, <>Attach <b>SKILL.md</b> and all supporting files to a new chat. Your AI must support the files and tools this task needs.</>, <>Ask it to read SKILL.md, follow its steps and use your task details.</>],
    code: [<>Unzip <b>{b.slug}.zip</b> in a new workspace folder.</>, <>Open that folder in your AI coding assistant. Keep SKILL.md beside its supporting files.</>, <>Ask your AI to read <b>{b.slug}/SKILL.md</b> and follow it for your task.</>],
    saved: [<>Unzip <b>{b.slug}.zip</b>.</>, <>Add the complete files to an AI project that supports files and instructions.</>, <>Ask it to read SKILL.md, then describe your task and give it the material it needs.</>],
  };
  return <div className="install task-install" data-testid="install">
    <button className="btn btn-primary btn-sm" disabled={!skill || busy} onClick={() => void zip()} data-testid="install-zip">{busy ? "Preparing the files…" : prepared ? "Download the files again" : "Download the files"}</button>
    <p className="small">Includes the complete instructions and supporting files.{getBusiness().name ? " Your saved business details are included too." : ""}</p>
    {error && <p role="alert">{error}</p>}
    {(!compact || prepared) && <div className="task-file-transfer" data-testid="skill-transfer">
      <h3>Use the files in your AI</h3>
      <details className="task-tool-choice"><summary>{TABS.find(t => t.id === tab)?.name} · Change</summary><div className="kind-tabs install-tabs" role="group" aria-label="How you use your AI">{TABS.map(t => <button key={t.id} aria-pressed={tab === t.id} onClick={() => pick(t.id)} data-testid={`install-${t.id}`}>{t.name}</button>)}</div></details>
      <ol className="num-list">{steps[tab].map((s, i) => <li key={`${tab}${i}`}><span className="n">{i + 1}</span><span>{s}</span></li>)}</ol>
      <p className="small">This download prepares the task. Your AI runs it. Check facts and any missing details before using the result.</p>
      <details><summary>Reuse or copy the instructions</summary><p>Keep the files in a saved project, or attach them again in a new chat. If your AI supports installed skills, use its documented install method.</p><button className="btn btn-ghost btn-sm" disabled={!personalSkill} onClick={() => void copy()}>Copy the instructions</button>{b.hasFiles && <p className="small">Copying text alone leaves out supporting files. Use the complete download for this task.</p>}{copyFailed && <div className="task-copy-fallback"><p role="alert">Copy did not work. Select and copy the text below.</p><textarea aria-label="Copy skill instructions manually" readOnly value={personalSkill ?? ""} rows={7} onFocus={e => e.currentTarget.select()} /></div>}</details>
    </div>}
  </div>;
}
