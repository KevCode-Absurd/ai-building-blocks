import { useEffect, useRef, useState } from "react";
import { executionPrompt } from "./lib/workflow-execution";
import "./execution-prompt.css";

export default function ExecutionPrompt({ goal, name, instructions, copyTestId = "copy-execution-prompt" }: { goal?: string | null; name?: string; instructions?: string; copyTestId?: string }) {
  const prompt = instructions ?? executionPrompt(goal, name);
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => { setCopied(false); setFailed(false); }, [prompt]);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    setFailed(false);
    try { await navigator.clipboard.writeText(prompt); setCopied(true); clearTimeout(timer.current); timer.current = setTimeout(() => setCopied(false), 1800); }
    catch { setCopied(false); setFailed(true); setOpen(true); }
  };
  return <div className="workflow-launch" data-testid="execution-prompt">
    <div className="workflow-launch-actions"><button type="button" className="btn btn-dark btn-sm" onClick={() => void copy()} data-testid={copyTestId}>{copied ? "Copied" : "Copy AI instructions"}</button><span className="small">Optional. The same rules are inside your download.</span></div>
    <details open={open} onToggle={e => setOpen(e.currentTarget.open)}><summary>Read the instructions to paste into your AI</summary>
      <p className="small">Attach the whole folder so your AI can read every skill and its supporting files.{!goal?.trim() && " Replace [MY GOAL] with what you want to achieve."} These instructions ask your AI to find needed files, ask questions and check each result. How well it follows them depends on your AI and its tools.</p>
      <textarea aria-label="AI execution instructions" readOnly value={prompt} rows={9} />
    </details>
    {copied && <span className="visually-hidden" role="status">AI instructions copied.</span>}
    {failed && <p className="small" role="alert">Copy did not work. Select and copy the instructions above.</p>}
  </div>;
}
