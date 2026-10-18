import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTitle } from "../components";
import { useCatalogue } from "../lib/data";
import { kits, queueForCanvas, useStore } from "../lib/store";

export default function Kits() {
  useTitle("Your kits");
  const c = useCatalogue();
  const all = useStore((s) => s.kits);
  const nav = useNavigate();
  const [name, setName] = useState("");
  return (
    <div className="wrap" style={{ paddingBottom: "var(--section)" }}>
      <div className="page-head">
        <h1 className="h1">Your kits</h1>
        <p className="lede" style={{ marginTop: 20 }}>A kit is a set of blocks you use together. Open one on the canvas to turn it into a workflow. Kits are kept in this browser for now.</p>
      </div>
      <form style={{ display: "flex", gap: 10, maxWidth: 520, marginBottom: 48 }} onSubmit={(e) => { e.preventDefault(); if (name.trim()) { kits.create(name); setName(""); } }}>
        <label className="search" style={{ flex: 1 }}><span className="visually-hidden">Kit name</span><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name a new kit, e.g. Weekly ads" /></label>
        <button className="btn btn-primary" type="submit">Create kit</button>
      </form>
      {all.length === 0 && (
        <div className="empty" style={{ textAlign: "left", padding: "24px 0" }}>
          <h3 className="h3">No kits yet</h3>
          <p>Create one above, or press "Add to kit" on any block in the <Link className="link" to="/library">library</Link>.</p>
        </div>
      )}
      {all.map((k) => (
        <div className="kit" key={k.id}>
          <div className="kit-head">
            <input value={k.name} onChange={(e) => kits.rename(k.id, e.target.value)} aria-label="Kit name" />
            <span className="small">{k.slugs.length} block{k.slugs.length === 1 ? "" : "s"}</span>
            <button className="btn btn-primary btn-sm" disabled={!k.slugs.length} onClick={() => { queueForCanvas(k.slugs, k.name); nav("/canvas"); }}>Open on canvas</button>
            <button className="btn btn-quiet btn-sm" onClick={() => { if (confirm(`Delete the kit "${k.name}"? The blocks stay in the library.`)) kits.remove(k.id); }}>Delete</button>
          </div>
          <div className="kit-items">
            {k.slugs.length === 0 && <span className="small">Empty. Add blocks from any block page.</span>}
            {k.slugs.map((s) => <Link key={s} to={`/blocks/${s}`}>{c?.bySlug[s]?.name ?? s}</Link>)}
          </div>
        </div>
      ))}
    </div>
  );
}
