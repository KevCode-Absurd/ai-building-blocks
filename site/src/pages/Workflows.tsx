import { Link } from "react-router-dom";
import { Arrow, RoleMark, useTitle } from "../components";
import { useCatalogue } from "../lib/data";

export default function Workflows() {
  useTitle("Workflows");
  const c = useCatalogue();
  const list = c?.blocks.filter((b) => b.category === "orchestrator") ?? [];
  return (
    <div className="wrap" style={{ paddingBottom: "var(--section)" }}>
      <div className="page-head">
        <h1 className="h1">Ready-made workflows</h1>
        <p className="lede" style={{ marginTop: 20 }}>Chains of library blocks that pass their work from one to the next. Open one on the canvas to change it, then download the handoff.</p>
      </div>
      <div className="rows">
        {list.map((b) => (
          <Link key={b.slug} to={`/blocks/${b.slug}`} className="row" style={{ gridTemplateColumns: "minmax(0,1fr) minmax(0,1.3fr) 40px", alignItems: "start" }}>
            <span><span className="nm">{b.name}</span><br /><span className="small">{b.steps.length} steps</span></span>
            <span>
              <span className="sm">{b.summary}</span>
              <span style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 12, fontSize: 13 }}>
                {b.steps.map((s, i) => { const sb = c!.bySlug[s.uses]; return sb ? <RoleMark key={i} role={sb.role}>{sb.name}</RoleMark> : null; })}
              </span>
            </span>
            <span className="arrow"><Arrow size={20} /></span>
          </Link>
        ))}
        {c && !list.length && <p className="small" style={{ padding: "24px 0" }}>Workflows are being added.</p>}
      </div>
    </div>
  );
}
