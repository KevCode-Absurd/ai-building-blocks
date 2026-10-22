// /ai-tools: the AI products people use for their work (ChatGPT, Kling, Zapier...), filed by what you'd use them for.
// Different from /tools, which is the mini calculators. Every filter sits in the address, so a view can be shared.
import { useEffect, useMemo, useState } from "react";
import "./aitools.css";
import { ArrowIcon, SearchIcon, Select } from "../ui";
import { Link, setSearch, useLocation } from "../lib/router";
import { PRICING, matches, shortPrice, useAiTools, type AiTools, type Tool } from "./data";
import AiToolPage from "./AiToolPage";

const TITLE = "Free AI Skills & Custom Workflow Builder | AI Blocks";
const HOME_DESC = "Explore free AI skills, prompts and workflows. Build a custom workflow, edit the steps and download a pack to run in your AI. Try free browser tools too.";
/** Sets the tab title and the description search engines show, and puts the home page's back when the page closes. */
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} · AI Blocks`;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    meta?.setAttribute("content", description);
    return () => { document.title = TITLE; meta?.setAttribute("content", HOME_DESC); };
  }, [title, description]);
}

type Filters = { q: string; use: string; cat: string; price: string };

function ToolCard({ t, d }: { t: Tool; d: AiTools }) {
  const n = t.blocks.length;
  return (
    <Link to={`/ai-tools/${t.slug}`} className="card at-card" data-testid="ai-tool-card" data-slug={t.slug}>
      <span className="meta"><span className="kind">{d.useCaseName[t.useCases[0]]}</span><span className="type">{t.maker}</span></span>
      <span className="nm">{t.name}</span>
      <span className="peek">{t.promise}</span>
      <span className="at-card-foot">
        <span className="at-price">{shortPrice(t.pricing.from)}</span>
        <span className="at-uses">{n ? `${n} block${n === 1 ? "" : "s"} use it` : "No blocks yet"}</span>
      </span>
      <span className="view">See what it does <ArrowIcon size={12} /></span>
    </Link>
  );
}

/** The page's shape while the data loads, so nothing jumps when it lands. */
function Skeleton({ one }: { one?: boolean }) {
  if (one) {
    return (
      <main className="bp at at-one" data-testid="ai-tool-skeleton" aria-busy="true">
        <header className="wrap bp-hero">
          <Link to="/ai-tools" className="back"><span aria-hidden="true">←</span> AI tools</Link>
          <p className="bp-kicker"><span className="at-sk at-sk-line" style={{ width: "7em" }} /></p>
          <span className="at-sk at-sk-h1" />
          <div className="at-sk at-sk-sub" style={{ height: 28 }} />
          <div className="bp-actions"><span className="at-sk at-sk-btn" /></div>
        </header>
        <div className="wrap at-one-body">
          <div className="at-main">{Array.from({ length: 3 }, (_, i) => <div key={i} className="at-sec"><span className="at-sk at-sk-line" style={{ width: "30%", height: 20 }} /><span className="at-sk at-sk-peek" style={{ display: "block", width: "100%", height: 120, marginTop: 14 }} /></div>)}</div>
          <aside className="at-side"><div className="at-sk at-sk-peek" style={{ display: "block", height: 170 }} /><div className="at-sk at-sk-peek" style={{ display: "block", height: 200 }} /></aside>
        </div>
      </main>
    );
  }
  return (
    <main className="bp at" data-testid="ai-tools-skeleton" aria-busy="true">
      <header className="wrap bp-hero">
        <Link to="/" className="back"><span aria-hidden="true">←</span> Home</Link>
        <p className="bp-kicker"><span className="kind">AI tools</span><span className="at-sk at-sk-line" style={{ width: "9em" }} /></p>
        <h1 className="bp-h1">Find the right AI product for the job</h1>
        <div className="at-sk at-sk-sub" />
      </header>
      <div className="wrap at-body">
        <div className="at-sk at-sk-search" />
        <div className="at-chips">{Array.from({ length: 10 }, (_, i) => <span key={i} className="at-sk at-sk-chip" style={{ width: `${90 + ((i * 37) % 70)}px` }} />)}</div>
        <div className="grid at-grid">{Array.from({ length: 9 }, (_, i) => <div key={i} className="card at-card at-sk-card"><span className="at-sk at-sk-line" style={{ width: "40%" }} /><span className="at-sk at-sk-line" style={{ width: "70%", height: 18 }} /><span className="at-sk at-sk-peek" /><span className="at-sk at-sk-line" style={{ width: "55%" }} /></div>)}</div>
      </div>
    </main>
  );
}

function AiToolsIndex({ d }: { d: AiTools }) {
  const { search } = useLocation();
  const [f, setF] = useState<Filters>(() => ({
    q: search.get("q") ?? "",
    use: d.useCases.some((u) => u.id === search.get("use")) ? search.get("use")! : "",
    cat: d.categories.some((c) => c.id === search.get("cat")) ? search.get("cat")! : "",
    price: PRICING.some((p) => p.id === search.get("price")) ? search.get("price")! : "",
  }));
  const set = (patch: Partial<Filters>) => setF((x) => ({ ...x, ...patch }));
  useEffect(() => { setSearch({ q: f.q, use: f.use, cat: f.cat, price: f.price }); }, [f]);
  usePageMeta("AI tools", `${d.tools.length} AI products for your work, filed by what you use them for: what each does, who it suits, what it costs and which library blocks use it.`);

  const base = useMemo(() => d.tools.filter((t) => matches(t, d, f.q) && (!f.cat || t.categories.includes(f.cat)) && (!f.price || t.pricing.model === f.price)), [d, f.q, f.cat, f.price]);
  const shown = useMemo(() => base.filter((t) => !f.use || t.useCases.includes(f.use)), [base, f.use]);
  const useCount = (id: string) => base.filter((t) => t.useCases.includes(id)).length;
  const inUse = (t: Tool) => !f.use || t.useCases.includes(f.use);
  const catOptions = [{ value: "", label: "Any kind", count: d.tools.filter((t) => matches(t, d, f.q) && inUse(t) && (!f.price || t.pricing.model === f.price)).length }, ...d.categories.map((c) => ({ value: c.id, label: c.name, count: d.tools.filter((t) => matches(t, d, f.q) && inUse(t) && (!f.price || t.pricing.model === f.price) && t.categories.includes(c.id)).length }))];
  const priceOptions = [{ value: "", label: "Any price", count: d.tools.filter((t) => matches(t, d, f.q) && inUse(t) && (!f.cat || t.categories.includes(f.cat))).length }, ...PRICING.map((p) => ({ value: p.id, label: p.name, count: d.tools.filter((t) => matches(t, d, f.q) && inUse(t) && (!f.cat || t.categories.includes(f.cat)) && t.pricing.model === p.id).length }))];
  const active = !!(f.q || f.use || f.cat || f.price);
  // When nothing matches, point at the use cases that still have something behind them.
  const suggestions = d.useCases.map((u) => ({ ...u, n: d.tools.filter((t) => t.useCases.includes(u.id)).length })).filter((u) => u.n && u.id !== f.use).slice(0, 5);
  const pricedOn = d.tools.filter((t) => !/check the maker/i.test(t.pricing.from)).length;

  return (
    <main className="bp at" data-testid="ai-tools-index">
      <header className="wrap bp-hero">
        <Link to="/" className="back"><span aria-hidden="true">←</span> Home</Link>
        <p className="bp-kicker"><span className="kind">AI tools</span>{d.tools.length} products, {d.useCases.length} jobs</p>
        <h1 className="bp-h1">Find the right AI product for the job</h1>
        <p className="bp-sub">{d.tools.length} AI products you can use today, filed by what you'd use them for. Each page says what it does, who it suits, what it costs, and which library blocks run on it. Prices for {pricedOn} of them were checked in October 2026; the rest point you to the maker's price page.</p>
      </header>

      <div className="wrap at-body">
        <label className="search big at-search"><SearchIcon /><span className="visually-hidden">Search AI products</span><input value={f.q} onChange={(e) => set({ q: e.target.value })} placeholder="Search by name, maker or job (video, leads, slides)" data-testid="ai-tools-search" /></label>

        <div className="at-chips" role="group" aria-label="Pick a job">
          <button className="chip" aria-pressed={!f.use} onClick={() => set({ use: "" })} data-testid="ai-use-all">Every job<span className="count">{base.length}</span></button>
          {d.useCases.map((u) => {
            const n = useCount(u.id);
            return <button key={u.id} className="chip" aria-pressed={f.use === u.id} disabled={!n && f.use !== u.id} onClick={() => set({ use: f.use === u.id ? "" : u.id })} data-testid={`ai-use-${u.id}`}>{u.name}<span className="count">{n}</span></button>;
          })}
        </div>

        <div className="at-row">
          <div className="filters at-filters">
            <Select label="Kind" value={f.cat} options={catOptions} onChange={(v) => set({ cat: v })} testId="ai-filter-cat" />
            <Select label="Price" value={f.price} options={priceOptions} onChange={(v) => set({ price: v })} testId="ai-filter-price" />
            {active && <button className="btn btn-ghost btn-sm" onClick={() => set({ q: "", use: "", cat: "", price: "" })} data-testid="ai-clear">Clear</button>}
          </div>
          <p className="at-count" aria-live="polite" data-testid="ai-tools-count">{shown.length} of {d.tools.length}{f.use ? ` for ${d.useCaseName[f.use].toLowerCase()}` : ""}</p>
        </div>

        {f.use && <p className="at-blurb" data-testid="ai-use-blurb">{d.useCases.find((u) => u.id === f.use)?.blurb}</p>}

        {shown.length ? (
          <div className="grid at-grid" data-testid="ai-tools-grid">{shown.map((t) => <ToolCard key={t.slug} t={t} d={d} />)}</div>
        ) : (
          <div className="empty at-empty" data-testid="ai-tools-empty">
            <h3>Nothing here matches{f.q ? ` "${f.q}"` : ""}</h3>
            <p>Try fewer words, or pick a job below.</p>
            <div className="at-chips at-chips-center">
              {suggestions.map((u) => <button key={u.id} className="chip" onClick={() => set({ q: "", use: u.id, cat: "", price: "" })}>{u.name}<span className="count">{u.n}</span></button>)}
            </div>
            <button className="link-btn" onClick={() => set({ q: "", use: "", cat: "", price: "" })}>Show every product</button>
          </div>
        )}

        <p className="bp-note at-foot">Prices move. Every page carries the month we last checked and the pages we read. Spotted a change? The file for each product is in the open repo, so send a fix.</p>
      </div>
    </main>
  );
}

export default function AiToolsPage({ path }: { path: string }) {
  const slug = path.split("/").filter(Boolean)[1];
  const d = useAiTools();
  if (d === false) {
    return (
      <main className="wrap bp-missing" data-testid="ai-tools-failed">
        <h1 className="bp-h1">The AI tools list didn't load</h1>
        <p className="bp-sub">Reload the page to try again. If it keeps failing, the home page still has every skill, prompt and workflow.</p>
        <Link to="/" className="btn btn-primary">Go to the home page <ArrowIcon /></Link>
      </main>
    );
  }
  if (!d) return <Skeleton one={!!slug} />;
  if (!slug) return <AiToolsIndex d={d} />;
  return <AiToolPage key={slug} d={d} slug={slug} />;
}
