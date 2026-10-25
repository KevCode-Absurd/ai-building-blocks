import { useEffect, useRef, type MouseEvent } from "react";
import content from "./content/api-mcp.html?raw";
import "./api-mcp.css";

/** Trusted, repository-owned documentation inside the site's shared App shell. */
export default function ApiMcpPage() {
  const main = useRef<HTMLElement>(null);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);

  async function copy(event: MouseEvent<HTMLElement>) {
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
      status.textContent = "Copied to clipboard.";
      button.textContent = "Copied";
    } catch {
      const range = document.createRange();
      range.selectNodeContents(source);
      const selection = window.getSelection();
      selection?.removeAllRanges(); selection?.addRange(range);
      status.textContent = "Text selected. Use your device’s Copy command.";
      button.textContent = "Text selected";
    }
    const timer = setTimeout(() => {
      button.textContent = label;
      button.disabled = false;
      timers.current.delete(timer);
    }, 1800);
    timers.current.add(timer);
  }

  return <main ref={main} className="wrap api-mcp-docs" onClick={copy} dangerouslySetInnerHTML={{ __html: content }} />;
}
