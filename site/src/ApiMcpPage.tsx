import { useEffect, useLayoutEffect, useRef, type MouseEvent } from "react";
import content from "./content/api-mcp.html?raw";
import "./api-mcp.css";

/** Open every closed <details> that hides the element the address's #hash points at. Returns that element when it was hidden. */
function revealHash(root: HTMLElement | null) {
  if (!root || location.hash.length < 2) return null;
  let id = location.hash.slice(1);
  try { id = decodeURIComponent(id); } catch { /* keep the raw hash */ }
  const target = document.getElementById(id);
  if (!target || !root.contains(target)) return null;
  let hidden = false;
  for (let el: HTMLElement | null = target; el && el !== root; el = el.parentElement) {
    if (el instanceof HTMLDetailsElement && !el.open) { el.open = true; hidden = true; }
  }
  return hidden ? target : null;
}

/** Trusted, repository-owned documentation inside the site's shared App shell. */
export default function ApiMcpPage() {
  const main = useRef<HTMLElement>(null);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);
  // The developer reference is collapsed. Links such as /api-and-mcp#api (the footer's
  // "Documentation") point inside it, so open it before the router scrolls to the target.
  useLayoutEffect(() => {
    const show = () => {
      const target = revealHash(main.current);
      if (target) requestAnimationFrame(() => target.scrollIntoView({ behavior: "instant" as ScrollBehavior }));
    };
    show();
    window.addEventListener("hashchange", show);
    return () => window.removeEventListener("hashchange", show);
  }, []);

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
