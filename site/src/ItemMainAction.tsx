import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { RUN_TARGETS, runLink, runTarget } from "./lib/item-actions";
import { trackUxEvent } from "./lib/ux-events";
import "./item-main-action.css";

const KEY = "abb:run-ai";
const remembered = () => { try { return runTarget(localStorage.getItem(KEY) ?? "")?.id ?? ""; } catch { return ""; } };

/** One button for the job: pick ChatGPT, Claude or Gemini. A short text opens a chat with it filled in;
 *  a long one (or Gemini, which has no prefill link) is copied and a new chat opens for pasting.
 *  The text is always copied as well, so an empty chat box is never a dead end. */
export function RunInMyAi({ getText, noun, toast, compact = false, onRun }: { getText: (() => string) | null; noun: string; toast: (m: string) => void; compact?: boolean; onRun?: () => void }) {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState(remembered);
  const [manual, setManual] = useState("");
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menuId = useId();
  useEffect(() => {
    if (!open) return;
    box.current?.querySelector<HTMLButtonElement>(".run-my-ai-menu button")?.focus();
    const outside = (event: PointerEvent) => { if (!box.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); button.current?.focus(); } };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [open]);
  const run = (id: string) => {
    if (!getText) return;
    const text = getText();
    const target = runTarget(id)!;
    const { url, prefilled } = runLink(id, text);
    setOpen(false); setLast(id); setManual("");
    try { localStorage.setItem(KEY, id); } catch { /* the choice lasts for this visit */ }
    // Start the copy and open the tab inside the click, so neither is blocked.
    const copied = navigator.clipboard?.writeText(text) ?? Promise.reject(Error("No clipboard"));
    window.open(url, "_blank", "noopener,noreferrer");
    trackUxEvent("request_copied"); onRun?.();
    copied.then(
      () => toast(prefilled ? `${target.name} opened with the ${noun} filled in. It is copied too, in case the box is empty.` : `${cap(noun)} copied. Paste it into the new ${target.name} chat and send it.`),
      () => { if (prefilled) toast(`${target.name} opened with the ${noun} filled in.`); else setManual(text); },
    );
  };
  return <div className={`run-my-ai${compact ? " compact" : ""}`} ref={box}>
    <button ref={button} type="button" className="btn btn-primary run-my-ai-btn" disabled={!getText} aria-expanded={open} aria-controls={menuId} aria-haspopup="true" onClick={() => setOpen(value => !value)} data-testid={compact ? "sticky-run-in-my-ai" : "run-in-my-ai"}>
      {getText ? "Run in my AI" : "Loading…"}<span aria-hidden="true">{open ? "−" : "+"}</span>
    </button>
    {open && <div className="run-my-ai-menu" id={menuId} role="group" aria-label="Choose your AI">
      {RUN_TARGETS.map(t => <button key={t.id} type="button" onClick={() => run(t.id)} data-testid={`${compact ? "sticky-" : ""}run-in-${t.id}`}>
        <b>{t.name}</b>{last === t.id && <small>Last used</small>}
      </button>)}
      <p className="small">Opens a new chat in a new tab. The {noun} is copied too.</p>
    </div>}
    {manual && <div className="task-copy-fallback"><p role="alert">Copy did not work. Select the text below, copy it and paste it into the new chat.</p><textarea aria-label={`Copy the ${noun} manually`} readOnly rows={6} value={manual} onFocus={e => e.currentTarget.select()} /></div>}
  </div>;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The main action, right under the opening. On a phone, a slim copy of it stays at the bottom of the screen
 *  once the original scrolls away, until the full "More ways" section is on screen. */
export default function ItemMainAction({ render, note, moreId = "run" }: { render: (compact: boolean) => ReactNode; note?: ReactNode; moreId?: string }) {
  const top = useRef<HTMLElement>(null);
  const [past, setPast] = useState(false);
  const [moreInView, setMoreInView] = useState(false);
  useEffect(() => {
    const start = top.current, more = document.getElementById(moreId);
    if (!start || typeof IntersectionObserver === "undefined") return;
    const watchStart = new IntersectionObserver(([entry]) => setPast(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    const watchMore = new IntersectionObserver(([entry]) => setMoreInView(entry.isIntersecting));
    watchStart.observe(start); if (more) watchMore.observe(more);
    return () => { watchStart.disconnect(); watchMore.disconnect(); };
  }, [moreId]);
  const sticky = past && !moreInView;
  return <>
    <section className="item-main-action" ref={top} data-testid="main-action" aria-label="Use it">
      <div className="item-main-action-row">
        {render(false)}
        <a className="btn btn-ghost btn-sm" href={`#${moreId}`} data-testid="more-ways-link">More ways <span aria-hidden="true">↓</span></a>
      </div>
      {note && <p className="small item-main-action-note">{note}</p>}
    </section>
    <div className="item-sticky-action" hidden={!sticky} data-testid="sticky-action" role="region" aria-label="Main action">{sticky && render(true)}</div>
  </>;
}
