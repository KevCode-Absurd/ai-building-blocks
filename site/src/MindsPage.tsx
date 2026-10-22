// /minds: the people you can borrow a way of thinking from (docs/MINDS-PRD.md §4). Use one alone from its page,
// or seat a few here and open the council in the builder: Start → the minds side by side → Advisory council → End.
import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { type Catalogue, type RosterMind, pathOf } from "./lib/data";
import { Link } from "./lib/router";
import { ArrowIcon } from "./ui";
import PixelFace from "./PixelFace";
import { LabelBadges, LabelIcon } from "./MindLabel";

const MAX = 7;
const COUNCIL = "advisory-council";

export default function MindsPage({ c, toBuilder }: { c: Catalogue; toBuilder: (slugs: string[], asNew?: string) => void }) {
  const roster = c.minds?.roster ?? [];
  const areas = c.minds?.areas ?? {};
  const [area, setArea] = useState("");
  const [label, setLabel] = useState("");
  const labels = c.minds?.labels ?? {};
  const [seated, setSeated] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem("aib-council-draft") ?? "[]");
      return Array.isArray(saved) ? [...new Set(saved.filter((s): s is string => typeof s === "string" && !!c.bySlug[s] && c.bySlug[s].type === "mind"))].slice(0, MAX) : [];
    } catch { return []; }
  });
  useEffect(() => { try { localStorage.setItem("aib-council-draft", JSON.stringify(seated)); } catch { /* private mode */ } }, [seated]);
  useEffect(() => { document.title = "Minds · AI Blocks"; return () => { document.title = "Free AI Skills & Custom Workflow Builder | AI Blocks"; }; }, []);
  const built = roster.filter((m) => m.built).length;
  const shown = useMemo(() => roster.filter((m) => (!area || m.area === area) && (!label || m.labels?.includes(label))), [roster, area, label]);
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
        <p className="bp-file"><span>{built} of {roster.length} ready</span>{built < roster.length && <span>The rest are being built</span>}</p>
        <FaceWall roster={roster} />
      </header>

      <section className="wrap minds-body">
        <section className="council-guide" aria-labelledby="council-guide-h" data-testid="council-guide">
          <h2 id="council-guide-h">Think through a decision with an advisory council</h2>
          <p>An advisory council puts different ways of thinking to work on the same question. One mind may focus on customers, another on money, another on design. You get their recommendations, the strongest disagreement, and three steps to take next.</p>
          <ol>
            <li><b>Choose different strengths.</b> Start with three to five minds whose roles fit your decision. Use “Seat on council” below.</li>
            <li><b>Give them one clear question.</b> Open the council in the builder. Add your options, facts, limits and what a good result looks like.</li>
            <li><b>Run the downloaded council.</b> Download the workflow, give the folder to your AI, and ask it to follow HANDOFF.md. Read the dissent before making your call.</li>
          </ol>
          <p className="small">These are AI interpretations of public work. Adding more minds brings more viewpoints; their agreement does not prove an answer is right. You make the final decision.</p>
          <Link to="/skills/advisory-council">See what a council gives you <ArrowIcon size={12} /></Link>
        </section>
        <div className="areas" role="group" aria-label="Pick an area">
          <button className="chip" aria-pressed={!area} onClick={() => setArea("")}>Everyone<span className="count">{roster.length}</span></button>
          {Object.entries(areas).map(([id, name]) => {
            const n = roster.filter((m) => m.area === id).length;
            return <button key={id} className="chip" aria-pressed={area === id} onClick={() => setArea(area === id ? "" : id)} data-testid={`minds-area-${id}`}>{name}<span className="count">{n}</span></button>;
          })}
        </div>

        <div className="label-filter" role="group" aria-label="Pick what they did" data-testid="label-filter">
          <span className="label-filter-h">What they did</span>
          {Object.entries(labels).map(([id, name]) => {
            const n = roster.filter((m) => m.labels?.includes(id) && (!area || m.area === area)).length;
            return (
              <button key={id} className="lchip" aria-pressed={label === id} disabled={!n && label !== id} onClick={() => setLabel(label === id ? "" : id)} data-testid={`minds-label-${id}`}>
                <LabelIcon id={id} size={13} />{name}<span className="count">{n}</span>
              </button>
            );
          })}
        </div>

        <ul className="mind-grid" data-testid="mind-grid">
          {shown.map((m) => <MindCard key={m.slug} m={m} c={c} on={seated.includes(m.slug)} full={seated.length >= MAX} onToggle={toggle} />)}
        </ul>
      </section>

      <div className={`council-bar${seated.length ? " open" : ""}`} aria-live="polite" data-testid="council-bar">
        <div className="wrap council-in">
          <span className="council-faces" aria-hidden="true">{seated.map((s) => { const r = roster.find((m) => m.slug === s); return <PixelFace key={s} face={r?.face} area={r?.area} slug={s} size={28} />; })}</span>
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
      <div className="mind-person">
        <PixelFace face={m.face} area={m.area} slug={m.slug} size={48} className="mind-face" />
        <div><span className="mind-area">{c.minds?.areas[m.area] ?? m.area}</span>
          {b ? <Link to={pathOf(b)} className="mind-name mind-profile-link">{m.name}<span className="mind-view" aria-hidden="true">View more <ArrowIcon size={11} /></span></Link> : <span className="mind-name">{m.name}</span>}
          {(m.identity || b?.identity) && <span className="mind-identity" data-testid="mind-identity">{m.identity || b?.identity}</span>}
        </div>
      </div>
      <LabelBadges c={c} labels={m.labels} size="sm" />
      <span className="mind-seat">{m.seat}</span>
      {m.built
        ? <button className="btn btn-ghost btn-sm mind-seat-btn" aria-pressed={on} disabled={!on && full} onClick={() => onToggle(m.slug)} data-testid="seat-mind">{on ? "Seated" : "Seat on council"}</button>
        : <span className="mind-soon">Being built</span>}
    </li>
  );
}

/** Every face on the roster in one pixel wall, so you can see who's in the room before you pick an area. */
function FaceWall({ roster }: { roster: RosterMind[] }) {
  return (
    <div className="face-wall" aria-hidden="true" data-testid="face-wall">
      {roster.map((m, i) => (
        <span key={m.slug} className={m.built ? "" : "soon"} style={{ "--w": `${((i * 37) % roster.length) / roster.length}s` } as CSSProperties}>
          <PixelFace face={m.face} area={m.area} slug={m.slug} size={24} />
        </span>
      ))}
    </div>
  );
}
