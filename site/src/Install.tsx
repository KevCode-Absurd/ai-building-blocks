import { useState, type ReactNode } from "react";
import type { Block } from "./lib/data";
import { buildSkillZip, download } from "./lib/handoff";

// The most a ChatGPT GPT takes in its Instructions box.
const GPT_LIMIT = 8000;
const TABS = [
  { id: "claude", name: "Claude" },
  { id: "code", name: "Claude Code" },
  { id: "chatgpt", name: "ChatGPT" },
  { id: "gemini", name: "Gemini" },
  { id: "other", name: "Any other AI" },
] as const;
type Tab = (typeof TABS)[number]["id"];
const KEY = "abb:install-tab";

/** A one-line command or text to copy. */
function Line({ text, toast, what }: { text: string; toast: (m: string) => void; what: string }) {
  return (
    <span className="cmd">
      <code>{text}</code>
      <button className="code-copy" onClick={async () => { await navigator.clipboard.writeText(text).catch(() => {}); toast(`Copied the ${what}`); }}>Copy</button>
    </span>
  );
}

/** Add a skill to your AI once, so you start it by name instead of pasting it every time. Remembers the AI you picked, in this browser. */
export default function Install({ b, skill, toast }: { b: Block; skill: string | null; toast: (m: string) => void }) {
  const [tab, setTab] = useState<Tab>(() => { try { const t = localStorage.getItem(KEY); return TABS.some((x) => x.id === t) ? (t as Tab) : "claude"; } catch { return "claude"; } });
  const pick = (t: Tab) => { setTab(t); try { localStorage.setItem(KEY, t); } catch { /* private mode */ } };
  const zip = async () => {
    if (!skill) return;
    download(await buildSkillZip(b.slug, skill, b.addon, b.files ?? []), `${b.slug}.zip`);
    toast(`Downloaded ${b.slug}.zip`);
  };
  const file = () => { if (skill) { download(new Blob([skill], { type: "text/markdown" }), "SKILL.md"); toast("Downloaded SKILL.md"); } };
  const copy = async () => { if (skill) { await navigator.clipboard.writeText(skill).catch(() => {}); toast("Skill copied"); } };
  const chars = skill?.length ?? 0;
  const n = chars.toLocaleString("en-US");
  const zipBtn = <button className="btn btn-primary btn-sm" disabled={!skill} onClick={zip} data-testid="install-zip">Download {b.slug}.zip</button>;
  const copyBtn = <button className="btn btn-primary btn-sm" disabled={!skill} onClick={copy}>Copy the skill</button>;

  const steps: Record<Tab, { do: ReactNode[]; then: ReactNode }> = {
    claude: {
      do: [
        <>Download the skill as a folder Claude can read. {zipBtn}</>,
        <>In Claude, open <b>Settings</b>, then <b>Capabilities</b>, and make sure <b>Code execution and file creation</b> is on. Skills need it.</>,
        <>Under <b>Skills</b>, click <b>Upload skill</b> and pick the .zip. Leave it switched on.</>,
      ],
      then: <>In any chat, ask Claude to “use the {b.slug} skill” and paste your details. Claude also picks it up by itself when you ask for this job.</>,
    },
    code: {
      do: [
        <>Download the skill. {zipBtn}</>,
        <>Unzip it into your skills folder, so the file ends up at <code>~/.claude/skills/{b.slug}/SKILL.md</code>. On a Mac or Linux:<Line text={`unzip ~/Downloads/${b.slug}.zip -d ~/.claude/skills/`} toast={toast} what="command" />On Windows, in PowerShell:<Line text={`Expand-Archive "$HOME\\Downloads\\${b.slug}.zip" "$HOME\\.claude\\skills"`} toast={toast} what="command" /></>,
        <>To share it with your team, unzip it into <code>.claude/skills/</code> inside the project and commit it.</>,
      ],
      then: <>Type <code>/{b.slug}</code> in any Claude Code session. It also runs by itself when you ask for this job.</>,
    },
    chatgpt: {
      do: chars <= GPT_LIMIT ? [
        <>Copy the skill. {copyBtn}</>,
        <>In ChatGPT, open <b>GPTs</b>, click <b>Create</b>, then <b>Configure</b>. Name it “{b.name}” and paste the skill into <b>Instructions</b>. It's {n} characters, inside the 8,000 limit.</>,
        <>Click <b>Create</b> and keep it to <b>Only me</b>.</>,
      ] : [
        <>Download the skill file. <button className="btn btn-primary btn-sm" disabled={!skill} onClick={file}>Download SKILL.md</button></>,
        <>In ChatGPT, open <b>GPTs</b>, click <b>Create</b>, then <b>Configure</b>. Name it “{b.name}” and upload SKILL.md under <b>Knowledge</b>. At {n} characters it's too long for the Instructions box, which takes 8,000.</>,
        <>Paste this into <b>Instructions</b>, then click <b>Create</b>:<Line text="Follow SKILL.md from your knowledge, step by step, for every request." toast={toast} what="instruction" /></>,
      ],
      then: <>Type @ and the GPT's name in any chat to bring it in, or open it from the sidebar. Making a GPT needs a paid plan. On the free plan, create a <b>Project</b>, paste the skill into its instructions, and start your chats inside that project.</>,
    },
    gemini: {
      do: [
        <>Copy the skill. {copyBtn}</>,
        <>In Gemini, open <b>Gems</b> and click <b>New Gem</b>. Name it “{b.name}” and paste the skill into <b>Instructions</b>.</>,
        <>Click <b>Save</b>.</>,
      ],
      then: <>Open the Gem from your Gems list whenever you need this job, and paste your details.</>,
    },
    other: {
      do: [
        <>Copy the skill. {copyBtn}</>,
        <>Save it wherever your AI keeps reusable instructions: a project, a custom assistant or a saved prompt.</>,
        <>Nowhere to save it? Make it a snippet in a text expander like Raycast, Espanso or TextExpander, with a short trigger such as <code>;{b.slug.split("-").slice(0, 2).join("")}</code>.</>,
      ],
      then: <>Type the trigger in any chat box and the whole skill pastes in. Add your details and send.</>,
    },
  };
  const s = steps[tab];
  return (
    <div className="install" data-testid="install">
      <div className="kind-tabs install-tabs" role="tablist" aria-label="Your AI">
        {TABS.map((t) => <button key={t.id} role="tab" id={`inst-${t.id}`} aria-selected={tab === t.id} aria-controls="inst-panel" onClick={() => pick(t.id)} data-testid={`install-${t.id}`}>{t.name}</button>)}
      </div>
      <div className="install-panel" role="tabpanel" id="inst-panel" aria-labelledby={`inst-${tab}`}>
        <ol className="num-list">{s.do.map((d, i) => <li key={`${tab}${i}`}><span className="n">{i + 1}</span><span>{d}</span></li>)}</ol>
        <p className="install-then"><b>Every time after:</b> {s.then}</p>
      </div>
    </div>
  );
}
