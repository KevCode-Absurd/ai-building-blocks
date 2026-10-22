import { useState, type ReactNode } from "react";
import type { Block } from "./lib/data";
import { buildSkillZip, download } from "./lib/handoff";
import { getBusiness, useBusiness, withBusiness } from "./lib/business";

const TABS = [
  { id: "chat", name: "Chat" },
  { id: "code", name: "Coding assistant" },
  { id: "saved", name: "Reusable instructions" },
] as const;
type Tab = (typeof TABS)[number]["id"];
const KEY = "abb:install-tab";

/** Portable instructions for chat, file-based coding tools and reusable assistants. */
export default function Install({ b, skill, toast }: { b: Block; skill: string | null; toast: (m: string) => void }) {
  const business = useBusiness();
  const personalSkill = skill ? withBusiness(skill, business) : null;
  const [tab, setTab] = useState<Tab>(() => { try { const t = localStorage.getItem(KEY); return TABS.some((x) => x.id === t) ? (t as Tab) : "chat"; } catch { return "chat"; } });
  const pick = (t: Tab) => { setTab(t); try { localStorage.setItem(KEY, t); } catch { /* private mode */ } };
  const zip = async () => {
    if (!skill) return;
    try { download(await buildSkillZip(b.slug, skill, b.hasFiles, getBusiness()), `${b.slug}.zip`); toast("Skill downloaded"); }
    catch (e) { toast(e instanceof Error ? e.message : "The complete skill could not be downloaded."); }
  };
  const copy = async () => {
    if (!personalSkill) return;
    try { await navigator.clipboard.writeText(personalSkill); toast("Skill copied"); }
    catch { toast("Copy failed. Download the skill instead."); }
  };
  const zipBtn = <button className="btn btn-primary btn-sm" disabled={!skill} onClick={zip} data-testid="install-zip">Download the skill</button>;
  const copyBtn = <button className="btn btn-dark btn-sm" disabled={!skill} onClick={copy}>Copy the skill</button>;
  const steps: Record<Tab, { do: ReactNode[]; then: ReactNode }> = {
    chat: {
      do: [
        <>Get the skill and its supporting files. {zipBtn}</>,
        <>Unzip the folder. Attach SKILL.md and any referenced files to a new chat in your AI assistant.</>,
        <>Ask it to “use the {b.slug} skill” and add your details. If your chat cannot read files, paste the skill text instead. {copyBtn}</>,
      ],
      then: <>Keep using that chat, or attach the files again in a new one. Check that your AI has the tools the skill needs.</>,
    },
    code: {
      do: [
        <>Get the complete skill folder. {zipBtn}</>,
        <>Unzip it in your workspace, keeping <code>{b.slug}/SKILL.md</code> beside its supporting files.</>,
        <>Open the workspace in your AI coding assistant. Ask it to read <code>{b.slug}/SKILL.md</code> and follow it for your task.</>,
      ],
      then: <>Ask for the skill by name and path. If your tool supports installed skills, follow its documentation for the correct folder and activation method.</>,
    },
    saved: {
      do: [
        <>Get the skill and keep its supporting files together. {zipBtn}</>,
        <>Add the files to a project or reusable assistant that supports instructions and attachments.</>,
        <>Tell it to read SKILL.md before starting this job. If it only accepts text, copy the skill and check its instruction limit. {copyBtn}</>,
      ],
      then: <>Open that project or assistant, describe your task and supply the inputs listed on this page.</>,
    },
  };
  const s = steps[tab];
  return (
    <div className="install" data-testid="install">
      <div className="kind-tabs install-tabs" role="tablist" aria-label="How you use your AI">
        {TABS.map((t) => <button key={t.id} role="tab" id={`inst-${t.id}`} aria-selected={tab === t.id} aria-controls="inst-panel" onClick={() => pick(t.id)} data-testid={`install-${t.id}`}>{t.name}</button>)}
      </div>
      <div className="install-panel" role="tabpanel" id="inst-panel" aria-labelledby={`inst-${tab}`}>
        <ol className="num-list">{s.do.map((d, i) => <li key={`${tab}${i}`}><span className="n">{i + 1}</span><span>{d}</span></li>)}</ol>
        <p className="install-then"><b>Every time after:</b> {s.then}</p>
      </div>
    </div>
  );
}
