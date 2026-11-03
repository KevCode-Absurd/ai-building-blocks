import { useEffect, useRef, useState } from "react";
import { executionPrompt } from "./lib/workflow-execution";
import type { Catalogue } from "./lib/data";
import type { Flow } from "./lib/store";
import { type Business, getBusiness } from "./lib/business";
import type { FlowMessage } from "./lib/handoff";
import { copyText } from "./lib/copy-text";
import "./execution-prompt.css";

const count = (n: number) => n.toLocaleString("en-US");

/** Two ways to take a workflow to your AI. With `flow` and `catalogue`: "Copy as one message", the whole workflow
 *  in one chat message for the ChatGPT, Claude or Gemini app. Always: the short first message to send with the zip.
 *  `business` is the brand file to add (default: the saved one, read at click time in this browser). */
export default function ExecutionPrompt({ goal, name, instructions, copyTestId = "copy-execution-prompt", flow, catalogue, business }: { goal?: string | null; name?: string; instructions?: string; copyTestId?: string; flow?: Flow; catalogue?: Catalogue; business?: Business }) {
  const prompt = instructions ?? executionPrompt(goal, name);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<FlowMessage | null>(null);
  const [messageState, setMessageState] = useState<"" | "copied" | "failed">("");
  const [messageError, setMessageError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const canMessage = !!flow && !!catalogue && flow.nodes.length > 0;
  useEffect(() => { setCopied(false); setFailed(false); }, [prompt]);
  // Callers often build `flow` on each render, so reset on what the message is made from.
  const shape = flow ? `${flow.name}|${flow.goal ?? ""}|${flow.notes ?? ""}|${flow.nodes.map(n => `${n.id}:${n.slug}:${n.notes ?? ""}`).join(",")}|${flow.edges.map(e => e.from + ">" + e.to).join(",")}` : "";
  useEffect(() => { setMessage(null); setMessageState(""); setMessageError(""); }, [shape]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    setFailed(false);
    try { await navigator.clipboard.writeText(prompt); setCopied(true); clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(false), 1800); }
    catch { setCopied(false); setFailed(true); setOpen(true); }
  };
  const build = async (): Promise<FlowMessage> => {
    const { flowMessage } = await import("./lib/handoff");
    const built = await flowMessage(catalogue!, flow!, business ?? getBusiness());
    if ("error" in built) throw Error(built.error);
    return built;
  };
  const copyMessage = async () => {
    setMessageState(""); setMessageError("");
    const pending = build();
    try { const built = await pending; await copyText(pending.then(b => b.text)); setMessage(built); setMessageState("copied"); }
    catch (e) {
      setMessageState("failed");
      try { setMessage(await pending); setMessageError("Copy did not work. Select and copy the message below."); }
      catch { setMessageError(e instanceof Error ? e.message : "The message could not be made. Try again."); }
    }
  };
  return <div className="workflow-launch" data-testid="execution-prompt">
    {canMessage && <>
      <div className="workflow-launch-actions"><button type="button" className="btn btn-primary btn-sm" onClick={() => void copyMessage()} data-testid="copy-one-message">Copy as one message</button><span className="small">For ChatGPT, Claude or Gemini. One message with the goal, the questions to ask you and each step's method, plus your brand file if you saved one.</span></div>
      {messageState === "copied" && message && <p className="small" role="status" data-testid="one-message-status">{message.fits ? `Copied ${count(message.chars)} characters. Paste it as your first message.` : `Copied ${count(message.chars)} characters. That is longer than some chats take at once. If yours cuts it off, download the workflow and attach the files.`}{message.shortened ? " Some step methods are longer than one message allows, so they are shorter versions with a link to the rest. The download has everything." : ""}</p>}
      {messageError && <p className="small" role="alert">{messageError}</p>}
      {message && messageState === "failed" && <textarea aria-label="The workflow as one message" readOnly value={message.text} rows={9} onFocus={e => e.currentTarget.select()} data-testid="one-message-text" />}
    </>}
    <div className="workflow-launch-actions"><button type="button" className={canMessage ? "btn btn-line btn-sm" : "btn btn-dark btn-sm"} onClick={() => void copy()} data-testid={copyTestId}>{copied ? "Copied" : "Copy AI instructions"}</button><span className="small">{canMessage ? "For coding tools and AIs that read files. Send it with the download." : "Optional. The same rules are inside your download."}</span></div>
    <details open={open} onToggle={e => setOpen(e.currentTarget.open)}><summary>Read the instructions to paste into your AI</summary>
      <p className="small">Attach the whole folder so your AI can read every skill and its supporting files.{!goal?.trim() && " Replace [MY GOAL] with what you want to achieve."} These instructions ask your AI to find needed files, ask questions and check each result. How well it follows them depends on your AI and its tools.</p>
      <textarea aria-label="AI execution instructions" readOnly value={prompt} rows={9} />
    </details>
    {copied && <span className="visually-hidden" role="status">AI instructions copied.</span>}
    {failed && <p className="small" role="alert">Copy did not work. Select and copy the instructions above.</p>}
  </div>;
}
