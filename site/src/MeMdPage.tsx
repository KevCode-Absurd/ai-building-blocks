import { useEffect, useRef, type MouseEvent } from "react";
import content from "./content/me-md.html?raw";
import { openBusiness } from "./Business";
import { drawerFocus } from "./lib/business";
import "./me-md.css";

// The me.md is the optional, personal part of the org context (lib/business.ts). This line says so under the hero.
const BRAND_NOTE = `<p class="note me-brand-note" data-testid="me-brand-note">Your me.md is the optional, personal part of your org context. Running a business? Start with <button class="text-button" type="button" data-open-brand>5 quick questions about it</button>.</p>`;
const HERO_NOTE = "It is never public.</p>";
const html = content.includes(HERO_NOTE) ? content.replace(HERO_NOTE, HERO_NOTE + BRAND_NOTE) : content;

/** /me-md: what a me.md is, three ways to make it, the starter pack, setup per AI and the privacy rules.
 *  Static, repository-owned HTML (also prerendered by scripts/prerender.mjs); the only script is copy and open. */
export default function MeMdPage() {
  const main = useRef<HTMLElement>(null);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  // Title, description and structured data come from the prerendered metadata (scripts/prerender.mjs).
  useEffect(() => () => { timers.current.forEach(clearTimeout); timers.current.clear(); }, []);

  async function click(event: MouseEvent<HTMLElement>) {
    const target = event.target as Element;
    if (target.closest("[data-open-me]")) { drawerFocus.me = true; openBusiness(); return; }
    if (target.closest("[data-open-brand]")) { openBusiness(); return; }
    const button = target.closest<HTMLButtonElement>("button[data-copy]");
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

  return <main ref={main} className="wrap me-md-docs" data-testid="me-md-page" onClick={click} dangerouslySetInnerHTML={{ __html: html }} />;
}
