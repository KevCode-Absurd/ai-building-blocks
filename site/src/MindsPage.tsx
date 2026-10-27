import { REMOTE_LIBRARY_UPDATE, libraryStorage } from "./lib/library-storage";
// /minds: the people you can borrow a way of thinking from (docs/MINDS-PRD.md §4). Use one alone from its page,
// or seat a few here and open the council in the builder: Start → the minds side by side → Advisory council → End.
import { type CSSProperties, memo, useEffect, useMemo, useRef, useState } from "react";
import { type Catalogue, type RosterMind, classificationText, pathOf } from "./lib/data";
import { useLibrarySearch } from "./lib/library-search";
import { rankLibraryResults } from "./lib/library-rank";
import { mindSearchOrder } from "./lib/mind-match";
import { isTested } from "./lib/verification";
import { Link } from "./lib/router";
import { ArrowIcon } from "./ui";
import PixelFace from "./PixelFace";
import { LabelBadges, LabelIcon } from "./MindLabel";
import MyMinds from "./MyMinds";
import "./minds-browser.css";

const MAX = 7;
const COUNCIL = "advisory-council";
const BROWSE_ROLES = ["founder", "investor", "operator", "product", "marketer", "seller", "creator", "designer", "artist", "musician", "filmmaker"];
const normalizeSearch = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
let hasShownFaceWall = false;

export default function MindsPage({ c, toBuilder }: { c: Catalogue; toBuilder: (slugs: string[], asNew?: string) => void }) {
  const roster = c.minds?.roster ?? [];
  const areas = c.minds?.areas ?? {};
  const [label, setLabel] = useState("");
  const [query, setQuery] = useState(() => new URLSearchParams(location.search).get("q")?.slice(0, 120) ?? "");
  const search = useLibrarySearch(c, query, { extraText: classificationText });
  const myMinds = new URLSearchParams(location.search).get("view") === "my";
  const labels = c.minds?.labels ?? {};
  const [seated, setSeated] = useState<string[]>(() => {
    try {
      const saved: unknown = JSON.parse(libraryStorage.getItem("aib-council-draft") ?? "[]");
      return Array.isArray(saved) ? [...new Set(saved.filter((s): s is string => typeof s === "string" && !!c.bySlug[s] && c.bySlug[s].type === "mind"))].slice(0, MAX) : [];
    } catch { return []; }
  });
  const remoteApplying = useRef(true);
  useEffect(() => { if (remoteApplying.current) { remoteApplying.current = false; return; } try { libraryStorage.setItem("aib-council-draft", JSON.stringify(seated)); } catch {} }, [seated]);
  useEffect(() => {
    const received = (event: Event) => {
      if (!(event as CustomEvent<string[]>).detail.includes("aib-council-draft")) return;
      try { const saved: unknown = JSON.parse(libraryStorage.getItem("aib-council-draft") ?? "[]"); if (Array.isArray(saved)) { remoteApplying.current = true; setSeated([...new Set(saved.filter((slug): slug is string => typeof slug === "string" && !!c.bySlug[slug] && c.bySlug[slug].type === "mind"))].slice(0, MAX)); } } catch {}
    };
    window.addEventListener(REMOTE_LIBRARY_UPDATE, received); return () => window.removeEventListener(REMOTE_LIBRARY_UPDATE, received);
  }, [c]);
  useEffect(() => {
    document.title = `${myMinds ? "My minds" : "Minds"} · AI Blocks`;
    if (myMinds) document.querySelector('[data-testid="my-minds"] details')?.setAttribute("open", "");
    return () => { document.title = "Free AI Skills & Custom Workflow Builder | AI Blocks"; };
  }, [myMinds]);
  const searchable = useMemo(() => roster.map((mind) => ({
    mind,
    text: normalizeSearch([mind.name, mind.identity, mind.seat, areas[mind.area], c.bySlug[mind.slug]?.summary, c.bySlug[mind.slug] ? classificationText(c.bySlug[mind.slug]) : '',
      ...(mind.labels ?? []).map((id) => labels[id]), ...(mind.useCases ?? [])].filter(Boolean).join(" ")),
  })), [roster, areas, labels, c.bySlug]);
  const shown = useMemo(() => {
    const terms = normalizeSearch(query).trim().split(/\s+/).filter(Boolean);
    const matched = searchable.filter(({ mind, text }) => (!label || mind.labels?.includes(label))
      && (!terms.length || search.hits.has(mind.slug) || terms.every((term) => text.includes(term)))).map(({ mind }) => mind);
    if (!terms.length) return matched;
    // The library search's order (lib/library-rank.ts), then mind-match.ts: a typed name leads, then the minds best
    // known for the topic (also when no word of their page matched), then the other matches.
    const ranked = rankLibraryResults(matched.map((mind) => c.bySlug[mind.slug] ?? { slug: mind.slug, name: mind.name, type: "mind" }), search.hits, query, { isTested: (b) => "tested" in b && isTested(b) }).map((b) => b.slug);
    const bySlug = new Map(roster.map((mind) => [mind.slug, mind]));
    return mindSearchOrder(c, query, ranked, (slug) => !label || !!bySlug.get(slug)?.labels?.includes(label)).map((slug) => bySlug.get(slug)).filter((mind): mind is RosterMind => !!mind);
  }, [searchable, label, query, search.hits, c, roster]);
  const clear = () => { setQuery(""); setLabel(""); };
  const toggle = (slug: string) => setSeated((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : s.length >= MAX ? s : [...s, slug]));
  const open = () => {
    const names = seated.map((s) => c.bySlug[s]?.name.split(" (")[0] ?? s);
    toBuilder([...seated, ...(c.bySlug[COUNCIL] ? [COUNCIL] : [])], `Council: ${names.join(", ")}`);
  };

  if (myMinds) return (
    <main className="minds" data-testid="my-minds-page">
      <header className="wrap bp-hero">
        <Link to="/minds" className="mind-back">All minds <ArrowIcon size={12} /></Link>
        <h1 className="bp-h1">My minds</h1>
        <p className="bp-sub">Create a mind in your own voice, or import one to use across your workflows.</p>
      </header>
      <div className="wrap minds-body"><MyMinds /></div>
    </main>
  );

  return (
    <main className="minds minds-browse" data-testid="minds-page">
      <header className="wrap bp-hero">
        <h1 className="bp-h1">Borrow a great mind</h1>
        <nav className="mind-browse-links" aria-label="Mind tools">
          <a href="#mind-results" onClick={clear}>All minds</a>
          <Link to="/minds?view=my">My minds <ArrowIcon size={12} /></Link>
          <Link to="/skills/advisory-council">Build an advisory council <ArrowIcon size={12} /></Link>
        </nav>
        <FaceWall roster={roster} />
      </header>

      <section className="wrap minds-body" aria-label="Find a mind">
        <div className="mind-search">
          <label htmlFor="mind-search">Search minds</label>
          <input id="mind-search" type="search" value={query} onChange={(event) => setQuery(event.currentTarget.value)} placeholder="Search by name, e.g. Steve Jobs" />
        </div>
        <div className="label-filter mind-role-filter" role="group" aria-label="Filter minds by role" data-testid="label-filter">
          {BROWSE_ROLES.map((id) => {
            const n = roster.filter((m) => m.labels?.includes(id)).length;
            return <button key={id} className="lchip" aria-pressed={label === id} aria-controls="mind-results" onClick={() => setLabel(label === id ? "" : id)} data-testid={`minds-label-${id}`}>
              <LabelIcon id={id} size={13} />{labels[id]}<span className="count">{n}</span>
            </button>;
          })}
        </div>
        <div className="mind-results-meta">
          <p className="small" role="status">{shown.length} {shown.length === 1 ? "mind" : "minds"}{label ? ` · ${labels[label]}` : ""}</p>
          {(query || label) && <button className="link-btn" onClick={clear}>Clear search and filters</button>}
        </div>
        <ul className="mind-grid" id="mind-results" tabIndex={-1} aria-label="Matching minds" data-testid="mind-grid">
          {shown.map((m) => <MindCard key={m.slug} m={m} c={c} on={seated.includes(m.slug)} full={seated.length >= MAX} onToggle={toggle} />)}
        </ul>
        {!shown.length && <p>No minds match this search. Try another name or clear the filters.</p>}
        <p className="small mind-attribution">AI interpretations of public work. Explore a profile for its sources and methods.</p>
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
    <li className={`mind${m.built ? "" : " soon"}${on ? " on" : ""}`} data-testid="mind-card" data-slug={m.slug} data-role={m.labels?.[0] ?? "thinker"}>
      <span className="mind-role-mark" aria-hidden="true"><LabelIcon id={m.labels?.[0] ?? "thinker"} size={28} /></span>
      <div className="mind-person">
        <PixelFace face={m.face} area={m.area} slug={m.slug} size={48} className="mind-face" />
        <div><span className="mind-area">{c.minds?.areas[m.area] ?? m.area}</span>
          {b ? <Link to={pathOf(b)} className="mind-name mind-profile-link">{m.name}<span className="mind-view" aria-hidden="true">View more <ArrowIcon size={11} /></span></Link> : <span className="mind-name">{m.name}</span>}
          {(m.identity || b?.identity) && <span className="mind-identity" data-testid="mind-identity">{m.identity || b?.identity}</span>}
        </div>
      </div>
      <LabelBadges c={c} labels={m.labels} size="sm" />
      <span className="mind-seat">{m.seat}</span>
      {m.useCases?.[0] && <p className="mind-use"><b>Try:</b> {m.useCases[0]}</p>}
      {m.built
        ? <button className="btn btn-ghost btn-sm mind-seat-btn" aria-pressed={on} disabled={!on && full} onClick={() => onToggle(m.slug)} data-testid="seat-mind"><span className="mind-seat-plus" aria-hidden="true">{on ? "✓" : "+"}</span>{on ? "Seated" : "Seat on council"}</button>
        : <span className="mind-soon">Being built</span>}
    </li>
  );
}

/** Every face on the roster in one pixel wall, so you can see who's in the room before you pick an area. */
const FaceWall = memo(function FaceWall({ roster }: { roster: RosterMind[] }) {
  const animate = useMemo(() => !hasShownFaceWall, []);
  useEffect(() => { hasShownFaceWall = true; }, []);
  return (
    <div className="face-wall" aria-hidden="true" data-testid="face-wall">
      {roster.map((m, i) => (
        <span key={m.slug} className={m.built ? "" : "soon"} style={{ "--w": `${((i * 37) % roster.length) / roster.length}s`, animation: animate ? undefined : "none" } as CSSProperties}>
          <PixelFace face={m.face} area={m.area} slug={m.slug} size={24} />
        </span>
      ))}
    </div>
  );
});
