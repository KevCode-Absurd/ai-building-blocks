import { useEffect, useRef, useState, type ReactNode } from "react";
import "./item-main-action.css";

/** The main action, right under the opening. On a phone, a slim copy of it stays at the bottom of the screen
 *  once the original scrolls away, until the "Other ways" section is on screen. */
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
        <a className="btn btn-ghost btn-sm" href={`#${moreId}`} data-testid="more-ways-link">Other ways <span aria-hidden="true">↓</span></a>
      </div>
      {note && <div className="small item-main-action-note">{note}</div>}
    </section>
    <div className="item-sticky-action" hidden={!sticky} data-testid="sticky-action" role="region" aria-label="Main action">{sticky && render(true)}</div>
  </>;
}
