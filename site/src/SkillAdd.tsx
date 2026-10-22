import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { type Catalogue, portLabel, taskOf } from "./lib/data";
import { type Ordered } from "./lib/handoff";
import { suggestNext } from "./lib/suggest";
import "./skill-add.css";

export default function SkillAdd({ c, order, initialPosition, onAdd, onClose }: {
  c: Catalogue; order: Ordered[]; initialPosition: number; onAdd: (slug: string, at: number) => void; onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const previousFocus = useRef(document.activeElement as HTMLElement | null);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const [selected, setSelected] = useState("");
  const [at, setAt] = useState(initialPosition);
  const [error, setError] = useState("");
  const pool = useMemo(() => c.blocks.filter(b => b.type !== "mind" && b.type !== "agent" && b.category !== "orchestrator"), [c]);
  const index = useMemo(() => new Map(pool.map(b => [b.slug, `${b.name} ${b.slug} ${b.summary} ${taskOf(b).name} ${b.outputs.map(p => portLabel(p.type)).join(" ")}`.toLowerCase()])), [pool]);
  const matches = useMemo(() => {
    const words = deferredQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (words.length) return pool.filter(b => words.every(w => index.get(b.slug)!.includes(w)));
    const suggested = suggestNext(c, order[at - 1]?.node.slug ?? null, new Set(order.map(o => o.node.slug)), 12).map(s => s.b).filter(b => index.has(b.slug));
    return suggested.length ? suggested : pool.slice(0, 12);
  }, [pool, c, order, at, deferredQuery, index]);
  const next = c.bySlug[selected];
  const supplied = new Set(order.slice(0, at).flatMap(o => c.bySlug[o.node.slug]?.outputs.map(p => p.type) ?? []));
  const missing = next?.inputs.filter(p => p.required && !supplied.has(p.type)) ?? [];
  useEffect(() => {
    const modal = dialog.current;
    modal?.showModal();
    return () => {
      modal?.close();
      requestAnimationFrame(() => { if (previousFocus.current?.isConnected) previousFocus.current.focus(); });
    };
  }, []);
  const add = () => {
    try { onAdd(selected, at); onClose(); }
    catch (e) { setError(e instanceof Error ? e.message : "The skill could not be added."); }
  };
  return <dialog ref={dialog} className="skill-add" aria-labelledby="skill-add-title" onCancel={onClose}>
    <header><h2 id="skill-add-title">Add a skill</h2><button type="button" className="icon-btn" aria-label="Close add skill" onClick={onClose}>×</button></header>
    <p className="small">Choose a skill and where it should run. Existing steps, notes and connections stay.</p>
    <label>Insert skill<select value={at} onChange={e => setAt(Number(e.currentTarget.value))}>
      <option value={0}>At the beginning</option>
      {order.map((o, i) => <option key={o.node.id} value={i + 1}>{i === order.length - 1 ? "At the end" : `After step ${i + 1}`} · {c.bySlug[o.node.slug]?.name ?? o.node.slug}</option>)}
    </select></label>
    <label>Search skills<input autoFocus value={query} onChange={e => setQuery(e.currentTarget.value)} placeholder="Search names, jobs or outputs" /></label>
    <p className="small" role="status">{deferredQuery.trim() ? `${matches.length} matching skills${matches.length > 40 ? ". Showing the first 40; narrow your search to see more." : "."}` : "Suggested skills. Search to find any skill in the library."}</p>
    <div className="skill-add-results" role="group" aria-label="Skills to add">{matches.slice(0, 40).map(b => <button type="button" key={b.slug} aria-pressed={selected === b.slug} onClick={() => { setSelected(b.slug); setError(""); }}><b>{b.name}</b><span>{b.summary}</span></button>)}{!matches.length && <p>No skills match. Try a shorter name or another job.</p>}</div>
    {next && <div className="skill-add-selection" role="status"><b>Selected: {next.name}</b><p className="small">{missing.length ? `Inputs to supply or connect: ${missing.map(p => portLabel(p.type)).join(", ")}.` : "Earlier steps declare matching input types. Review the connections after adding."}</p></div>}
    {error && <p role="alert">{error}</p>}
    <footer><button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button><button type="button" className="btn btn-primary" disabled={!selected || !!query.trim() && deferredQuery !== query} onClick={add}>Add skill</button></footer>
  </dialog>;
}
