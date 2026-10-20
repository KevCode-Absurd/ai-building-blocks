// /minds: the people you can borrow a way of thinking from (docs/MINDS-PRD.md §4). Use one alone from its page,
// or seat a few here and open the council in the builder: Start → the minds side by side → Advisory council → End.
import { useEffect, useMemo, useState } from "react";
import { type Catalogue, type RosterMind, pathOf } from "./lib/data";
import { Link } from "./lib/router";

const MAX = 7;
const COUNCIL = "advisory-council";

export default function MindsPage({ c, toBuilder }: { c: Catalogue; toBuilder: (slugs: string[], asNew?: string) => void }) {
  const roster = c.minds?.roster ?? [];
  const areas = c.minds?.areas ?? {};
  const [area, setArea] = useState("");
  const [seated, setSeated] = useState<string[]>([]);
  useEffect(() => { document.title = "Minds · AI Blocks"; return () => { document.title = "AI Blocks · Making humanity AI native"; }; }, []);
  const built = roster.filter((m) => m.built).length;
  const shown = useMemo(() => roster.filter((m) => !area || m.area === area), [roster, area]);
  const toggle = (slug: string) => setSeated((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : s.length >= MAX ? s : [...s, slug]));
  const open = () => {
    const names = seated.map((s) => c.bySlug[s]?.name.split(" (")[0] ?? s);
    toBuilder([...seated, ...(c.bySlug[COUNCIL] ? [COUNCIL] : [])], `Council: ${names.join(", ")}`);
  };

  return (
    <main className="minds" data-testid="minds-page">
      <header className="wrap bp-hero">
        <p className="bp-kicker"><span className="kind">Minds</span></p>
        <h1 className="bp-h1">Borrow a great mind</h1>
        <p className="bp-sub">Ask Bezos about your operations, have Shakespeare write your toast, or put Munger, Hormozi and Jobs on a council and let them argue your decision. Each one is built from their public work, and they're AI voices, not the real people.</p>
        <p className="bp-file"><span>{built} of {roster.length} ready</span><span>The rest are being built</span></p>
      </header>

      <section className="wrap minds-body">
        <div className="areas" role="group" aria-label="Pick an area">
          <button className="chip" aria-pressed={!area} onClick={() => setArea("")}>Everyone<span className="count">{roster.length}</span></button>
          {Object.entries(areas).map(([id, name]) => {
            const n = roster.filter((m) => m.area === id).length;
            return <button key={id} className="chip" aria-pressed={area === id} onClick={() => setArea(area === id ? "" : id)} data-testid={`minds-area-${id}`}>{name}<span className="count">{n}</span></button>;
          })}
        </div>

        <ul className="mind-grid" data-testid="mind-grid">
          {shown.map((m) => <MindCard key={m.slug} m={m} c={c} on={seated.includes(m.slug)} full={seated.length >= MAX} onToggle={toggle} />)}
        </ul>
      </section>

      <div className={`council-bar${seated.length ? " open" : ""}`} aria-live="polite" data-testid="council-bar">
        <div className="wrap council-in">
          <span className="council-names">{seated.length ? <><b>Your council:</b> {seated.map((s) => c.bySlug[s]?.name.split(" (")[0] ?? s).join(", ")}</> : "Seat up to seven minds to start a council."}</span>
          {seated.length > 0 && <button className="link-btn" onClick={() => setSeated([])}>Clear</button>}
          <button className="btn btn-primary btn-sm" disabled={!seated.length} onClick={open} data-testid="open-council">Open the council in the builder</button>
        </div>
      </div>
    </main>
  );
}

function MindCard({ m, c, on, full, onToggle }: { m: RosterMind; c: Catalogue; on: boolean; full: boolean; onToggle: (s: string) => void }) {
  const b = c.bySlug[m.slug];
  return (
    <li className={`mind${m.built ? "" : " soon"}${on ? " on" : ""}`} data-testid="mind-card" data-slug={m.slug}>
      <div className="mind-top">
        <span className="mind-area">{c.minds?.areas[m.area] ?? m.area}</span>
        {b?.years && <span className="mind-years">{b.years}</span>}
      </div>
      {b ? <Link to={pathOf(b)} className="mind-name">{m.name}</Link> : <span className="mind-name">{m.name}</span>}
      <span className="mind-seat">Seat: {m.seat}</span>
      {m.built
        ? <button className="btn btn-ghost btn-sm mind-seat-btn" aria-pressed={on} disabled={!on && full} onClick={() => onToggle(m.slug)} data-testid="seat-mind">{on ? "Seated" : "Seat on council"}</button>
        : <span className="mind-soon">Being built</span>}
    </li>
  );
}
