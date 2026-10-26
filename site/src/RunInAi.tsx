import { useState, type ReactNode } from "react";
import "./block-flow.css";

const AIS = ["claude", "chatgpt", "gemini"] as const;
type Ai = (typeof AIS)[number];
const NAMES: Record<Ai, string> = { claude: "Claude", chatgpt: "ChatGPT", gemini: "Gemini" };
const KEY = "abb:run-ai";

/** Add a skill to your own AI once, then ask for it by name in any chat. The three paths people use most.
 *  The Copy and Download buttons sit above this; these steps say what to do with what they hand you. */
export default function RunInAi({ noun, hasFiles }: { noun: string; hasFiles: boolean }) {
  const [ai, setAi] = useState<Ai>(() => { try { const v = localStorage.getItem(KEY); return AIS.find(x => x === v) ?? "claude"; } catch { return "claude"; } });
  const pick = (a: Ai) => { setAi(a); try { localStorage.setItem(KEY, a); } catch { /* the choice lasts for this visit */ } };
  const steps: Record<Ai, ReactNode[]> = {
    claude: [
      <>Select <b>Download {noun}</b> above to get the ZIP.</>,
      <>In Claude, open Customize → Skills, then choose + → Create skill → Upload a skill.</>,
      <>Upload the ZIP and turn the {noun} on. Then ask for it by name in any chat.</>,
    ],
    chatgpt: [
      <>Select <b>Download {noun}</b> above and unzip it.</>,
      <>Add the files to a ChatGPT project's Sources.</>,
      <>In the project's instructions, tell ChatGPT to use those files for this job. Start your chats in that project.</>,
    ],
    gemini: [
      <>{hasFiles ? <>Select <b>Download {noun}</b> above and unzip it.</> : <>Select <b>Copy {noun}</b> above.</>}</>,
      <>In Gemini, open Gems and choose New Gem.</>,
      <>Paste the instructions into the Gem{hasFiles ? ", add the other files as its knowledge" : ""} and save it. Start your chats with that Gem.</>,
    ],
  };
  return (
    <div className="run-ai" data-testid="run-in-ai">
      <h3 className="run-ai-h">Add it to your AI once, then ask for it by name</h3>
      <div className="kind-tabs install-tabs" role="group" aria-label="Which AI you use">
        {AIS.map(a => <button key={a} aria-pressed={ai === a} onClick={() => pick(a)} data-testid={`run-ai-${a}`}>{NAMES[a]}</button>)}
      </div>
      <ol className="num-list" aria-label={`Add it to ${NAMES[ai]}`}>
        {steps[ai].map((s, i) => <li key={`${ai}${i}`}><span className="n">{i + 1}</span><span>{s}</span></li>)}
      </ol>
      <p className="small">No setup wanted? Select <b>Copy {noun}</b>, paste it into a new chat and add your details.</p>
    </div>
  );
}
