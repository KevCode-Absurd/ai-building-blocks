import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { BlockCard, SearchIcon, useTitle } from "../components";
import { type Block, JOBS, LEVELS, ROLES, cap, useCatalogue } from "../lib/data";
import { useStore } from "../lib/store";
import { START_HERE } from "./Home";

const CATS = [["all", "All"], ["general", "General"], ["ecommerce", "Ecommerce"]] as const;

function matches(b: Block, q: string) {
  if (!q) return true;
  const hay = `${b.name} ${b.slug} ${b.summary} ${b.job} ${b.role} ${b.inputs.map((p) => p.type).join(" ")} ${b.outputs.map((p) => p.type).join(" ")}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w));
}

export default function Library() {
  const c = useCatalogue();
  const recent = useStore((s) => s.recent);
  const [params, setParams] = useSearchParams();
  const q = params.get("q") ?? "";
  const category = params.get("category") ?? "all";
  const role = params.get("role") ?? "";
  const job = params.get("job") ?? "";
  const level = params.get("level") ?? "";
  useTitle(category === "ecommerce" ? "Ecommerce" : category === "general" ? "General blocks" : "Library");
  const set = (k: string, v: string) => { const p = new URLSearchParams(params); if (v && v !== "all") p.set(k, v); else p.delete(k); setParams(p, { replace: true }); };

  const blocks = useMemo(() => (c?.blocks ?? []).filter((b) => b.category !== "orchestrator"), [c]);
  const results = useMemo(() => blocks.filter((b) =>
    (category === "all" || (category === "ecommerce" ? b.category === "ecommerce" || b.addon : b.category === category)) &&
    (!role || b.role === role) && (!job || b.job === job) && (!level || b.level === level) && matches(b, q),
  ), [blocks, category, role, job, level, q]);
  const filtered = !!(q || role || job || level);
  const jobs = useMemo(() => [...new Set(blocks.map((b) => b.job))].sort(), [blocks]);

  const shelves: [string, Block[]][] = c && !filtered ? [
    ["Start here", START_HERE.map((s) => c.bySlug[s]).filter((b) => b && results.includes(b))],
    ["Used in the most workflows", [...results].filter((b) => b.usedIn > 0).sort((a, b) => b.usedIn - a.usedIn).slice(0, 6)],
    ["You looked at recently", recent.map((s) => c.bySlug[s]).filter((b) => b && results.includes(b)).slice(0, 6)],
    ["Recently added", [...results].sort((a, b) => b.added.localeCompare(a.added) || a.name.localeCompare(b.name)).slice(0, 6)],
  ] : [];

  return (
    <>
      <div className="wrap page-head">
        <h1 className="h1">{category === "ecommerce" ? "Ecommerce blocks" : category === "general" ? "General blocks" : "The library"}</h1>
        <p className="lede" style={{ marginTop: 20 }}>
          {category === "ecommerce" ? "Blocks made for online stores, plus general blocks that carry an ecommerce add-on." : "Every block in one place. Search by what you want to make, or filter by job and role."}
        </p>
      </div>
      <div className="toolbar">
        <div className="wrap toolbar-in">
          <label className="search">
            <SearchIcon />
            <span className="visually-hidden">Search blocks</span>
            <input value={q} onChange={(e) => set("q", e.target.value)} placeholder="Search: landing page, reviews, video script…" />
          </label>
          <div className="seg" role="group" aria-label="Category">
            {CATS.map(([id, label]) => <button key={id} aria-pressed={category === id} onClick={() => set("category", id)}>{label}</button>)}
          </div>
          <select className="select" value={job} onChange={(e) => set("job", e.target.value)} aria-label="Job">
            <option value="">Any job</option>
            {jobs.map((j) => <option key={j} value={j}>{JOBS[j] ?? cap(j)}</option>)}
          </select>
          <select className="select" value={role} onChange={(e) => set("role", e.target.value)} aria-label="Role">
            <option value="">Any role</option>
            {ROLES.filter((r) => r.id !== "orchestrate").map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <select className="select" value={level} onChange={(e) => set("level", e.target.value)} aria-label="Level">
            <option value="">Any level</option>
            {LEVELS.map((l) => <option key={l} value={l}>{cap(l)}</option>)}
          </select>
        </div>
      </div>
      <div className="wrap" style={{ paddingBottom: "var(--section)" }}>
        {!c && <p className="small">Loading the library…</p>}
        {shelves.filter(([, list]) => list.length > 0).map(([title, list]) => (
          <section key={title} className="lib-section">
            <div className="shelf-title"><h2>{title}</h2></div>
            <div className="grid">{list.map((b) => <BlockCard key={b.slug} b={b} />)}</div>
          </section>
        ))}
        {c && (
          <section className="lib-section">
            <div className="shelf-title"><h2>{filtered ? "Results" : "All blocks"}</h2><span className="small">{results.length} block{results.length === 1 ? "" : "s"}</span></div>
            {results.length ? (
              <div className="grid">{results.map((b) => <BlockCard key={b.slug} b={b} showImage={false} />)}</div>
            ) : (
              <div className="empty">
                <h3 className="h3">No blocks match that yet</h3>
                <p>Try fewer words, or clear a filter. <button className="link" style={{ background: "none", border: 0, cursor: "pointer", padding: 0 }} onClick={() => setParams({}, { replace: true })}>Clear all</button></p>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}
