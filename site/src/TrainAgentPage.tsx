import { useEffect, useRef, type MouseEvent } from "react";
import content from "./content/train-agent.html?raw";
import "./train-agent.css";

/** /train-your-own-ai-agent: the step-by-step guide to training a personal AI agent, with its starter pack.
 *  Static, repository-owned HTML (also prerendered by scripts/prerender.mjs); the only script is copy. */
export default function TrainAgentPage() {
  const main = useRef<HTMLElement>(null);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  // Title, description and structured data come from the prerendered metadata (scripts/prerender.mjs).
  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);

  async function click(event: MouseEvent<HTMLElement>) {
    const button = (event.target as Element).closest<HTMLButtonElement>("button[data-copy]");
    const root = main.current;
    if (!button || !root?.contains(button) || button.disabled) return;
    const source = root.querySelector<HTMLElement>(`[id="${button.dataset.copy}"]`);
    const status = root.querySelector<HTMLElement>("#copy-status");
    if (!source || !status) return;
    const label = button.textContent;
    button.disabled = true;
    try {
      await navigator.clipboard.writeText(source.textContent?.trim() ?? "");
      status.textContent = "Prompt copied. Paste it into ChatGPT, Claude or Gemini.";
      button.textContent = "Copied";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(source);
      const selection = window.getSelection();
      selection?.removeAllRanges(); selection?.addRange(range);
      status.textContent = "Text selected. Use your device's Copy command.";
      button.textContent = "Text selected";
    }
    const timer = setTimeout(() => { button.textContent = label; button.disabled = false; timers.current.delete(timer); }, 1800);
    timers.current.add(timer);
  }

  return <main ref={main} className="wrap agent-guide" data-testid="train-agent-page" onClick={click} dangerouslySetInnerHTML={{ __html: content }} />;
}
