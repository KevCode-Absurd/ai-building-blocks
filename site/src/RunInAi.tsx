import { useState, type ReactNode } from "react";
import { Link } from "./lib/router";
import "./block-flow.css";

const AIS = ["claude", "chatgpt", "gemini"] as const;
type Ai = (typeof AIS)[number];
const NAMES: Record<Ai, string> = { claude: "Claude", chatgpt: "ChatGPT", gemini: "Gemini" };
const KEY = "abb:run-ai";

/** What to do after the main Download button: upload the file to ChatGPT, Claude or Gemini. Shown under the button,
 *  so nobody has to guess. A workflow or agent pack is a folder of files with START_HERE.txt and HANDOFF.md. */
export function UploadSteps({ noun, hasFiles, pack }: { noun: string; hasFiles: boolean; pack: boolean }) {
  const [ai, setAi] = useState<Ai>(() => { try { const v = localStorage.getItem(KEY); return AIS.find(x => x === v) ?? "claude"; } catch { return "claude"; } });
  const pick = (a: Ai) => { setAi(a); try { localStorage.setItem(KEY, a); } catch { /* the choice lasts for this visit */ } };
  const steps: Record<Ai, ReactNode[]> = pack ? {
    claude: [<>Unzip the download.</>, <>In Claude, start a new project and add all the files to it.</>, <>Start a chat in that project and say: <b>Read START_HERE.txt and follow HANDOFF.md</b>.</>],
    chatgpt: [<>Unzip the download.</>, <>In ChatGPT, start a new project and add all the files to its Sources.</>, <>Start a chat in that project and say: <b>Read START_HERE.txt and follow HANDOFF.md</b>.</>],
    gemini: [<>Unzip the download.</>, <>In a new Gemini chat, attach all the files.</>, <>Say: <b>Read START_HERE.txt and follow HANDOFF.md</b>.</>],
  } : {
    claude: [<>In Claude, open Customize → Skills, then choose + → Create skill → Upload a skill.</>, <>Upload the ZIP you downloaded and turn the {noun} on.</>, <>In any chat, ask for it by name.</>],
    chatgpt: [<>Unzip the download.</>, <>Add the files to a ChatGPT project's Sources.</>, <>Start a chat in that project and ask it to use the {noun}.</>],
    gemini: [<>Unzip the download.</>, <>In Gemini, open Gems and choose New Gem. Paste in the text of SKILL.md{hasFiles ? " and add the other files as its knowledge" : ""}.</>, <>Save the Gem and start your chats with it.</>],
  };
  return (
    <div className="upload-steps" data-testid="upload-steps">
      <p className="upload-steps-h">Then upload it to your AI:</p>
      <div className="kind-tabs install-tabs" role="group" aria-label="Which AI you use">
        {AIS.map(a => <button key={a} type="button" aria-pressed={ai === a} onClick={() => pick(a)} data-testid={`upload-${a}`}>{NAMES[a]}</button>)}
      </div>
      <ol className="num-list" aria-label={`Upload it to ${NAMES[ai]}`}>
        {steps[ai].map((s, i) => <li key={`${ai}${i}`}><span className="n">{i + 1}</span><span>{s}</span></li>)}
      </ol>
    </div>
  );
}

/** The second way: an AI already connected to AI Blocks (MCP or API) fetches the item itself, so nothing is installed.
 *  Plain text and a copy button per line; workflows also get a line that asks for a plan. */
export function PullFromAi({ slug, plan = false, toast }: { slug: string; plan?: boolean; toast: (m: string) => void }) {
  const [failed, setFailed] = useState(false);
  const copy = async (line: string) => {
    try { await navigator.clipboard.writeText(line); setFailed(false); toast("Copied. Send it in a chat with your connected AI."); }
    catch { setFailed(true); }
  };
  const line = (text: string) => <p className="cmd"><code>{text}</code><button type="button" className="code-copy" onClick={() => void copy(text)} aria-label={`Copy “${text}”`}>Copy</button></p>;
  return (
    <div className="pull-ai" data-testid="pull-from-ai">
      <h3 className="run-ai-h">Pull it from your AI</h3>
      <p className="small">Already connected your AI to AI Blocks? Send this line in any chat. Your AI gets the latest version itself.</p>
      {line(`Use AI Blocks to get ${slug}`)}
      {plan && <>
        <p className="small">Or ask your AI to plan it for your own goal. Change [your goal] to what you want done.</p>
        {line(`Use AI Blocks to plan [your goal], starting from ${slug}`)}
      </>}
      {failed && <p className="small" role="alert">Copy did not work. Select the line and copy it.</p>}
      <p className="small">Not connected yet? <Link to="/api-and-mcp" data-testid="pull-connect">Connect your AI once</Link>. Then it can find and get any skill or workflow when it needs one.</p>
    </div>
  );
}
