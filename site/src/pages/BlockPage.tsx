import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Marked } from "marked";
import { KitMenu, RoleMark, Toast, useTitle } from "../components";
import { type Block, JOBS, cap, formatImage, loadSkillText, neighbours, portLabel, useCatalogue } from "../lib/data";
import { markViewed, queueForCanvas } from "../lib/store";
import { download } from "../lib/handoff";

// Skill text is shown as Markdown with any raw HTML escaped: files are data, never markup we trust.
const md = new Marked({ gfm: true, renderer: { html: ({ text }) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;") } });

function splitFrontmatter(text: string) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n?/);
  return m ? { front: m[1], body: text.slice(m[0].length) } : { front: "", body: text };
}

const useWhen = (front: string) => front.match(/^description:\s*(.+)$/m)?.[1].replace(/^["']|["']$/g, "").replace(/^Use when\s*/i, (m) => m) ?? "";

function Mini({ b }: { b: Block }) {
  return <Link to={`/blocks/${b.slug}`} className="mini">{b.name}<small>{b.slug}</small></Link>;
}

export default function BlockPage() {
  const { slug = "" } = useParams();
  const c = useCatalogue();
  const nav = useNavigate();
  const b = c?.bySlug[slug];
  const [skill, setSkill] = useState<string | null>(null);
  const [addon, setAddon] = useState<string | null>(null);
  const [tab, setTab] = useState<"skill" | "ecommerce" | "connect">("skill");
  const [toast, setToast] = useState<string | null>(null);
  useTitle(b?.name ?? "Block");

  useEffect(() => {
    setSkill(null); setAddon(null); setTab("skill");
    if (!slug) return;
    loadSkillText(slug).then(setSkill);
    loadSkillText(slug, "ecommerce.md").then(setAddon);
    markViewed(slug);
  }, [slug]);

  const near = useMemo(() => (c && b ? neighbours(c, b) : null), [c, b]);
  const parts = useMemo(() => (skill ? splitFrontmatter(skill) : null), [skill]);

  if (c && !b) return <div className="wrap empty"><h3 className="h3">There's no block called {slug}</h3><p>It may have been renamed. <Link className="link" to={`/library?q=${encodeURIComponent(slug.replace(/-/g, " "))}`}>Search the library</Link></p></div>;
  if (!b) return <div className="wrap page-head"><p className="small">Loading…</p></div>;

  const isFlow = b.category === "orchestrator";
  const copy = async () => { if (skill) { await navigator.clipboard.writeText(skill); setToast("Skill copied. Paste it into your AI."); } };
  const toCanvas = () => { queueForCanvas(isFlow ? b.steps.map((s) => s.uses) : [b.slug]); nav("/canvas"); };

  return (
    <>
      <div className="wrap">
        <div className="block-head">
          <div>
            <div className="crumbs">
              <Link to="/library">Library</Link><span>/</span>
              <Link to={isFlow ? "/workflows" : `/library?category=${b.category}`}>{isFlow ? "Workflows" : cap(b.category)}</Link><span>/</span>
              <Link to={`/library?job=${b.job}`}>{JOBS[b.job] ?? cap(b.job)}</Link>
            </div>
            <RoleMark role={b.role} />
            <h1 className="h1" style={{ marginTop: 14 }}>{b.name}</h1>
            <p className="lede" style={{ marginTop: 22 }}>{b.summary}</p>
            <div className="sl"><span>{b.slug}</span><button className="copy-btn" onClick={() => { navigator.clipboard.writeText(b.slug); setToast("Skill name copied"); }}>Copy name</button></div>
            <div className="actions">
              {isFlow ? (
                <button className="btn btn-primary" onClick={toCanvas}>Open on the canvas</button>
              ) : (
                <>
                  <button className="btn btn-primary" onClick={copy} disabled={!skill}>Copy skill</button>
                  <button className="btn btn-quiet" disabled={!skill} onClick={() => skill && download(new Blob([skill], { type: "text/markdown" }), `${b.slug}.SKILL.md`)}>Download</button>
                  <KitMenu slug={b.slug} onChange={setToast} />
                  <button className="btn btn-quiet" onClick={toCanvas}>Add to canvas</button>
                </>
              )}
            </div>
          </div>
          <dl className="facts">
            <div><dt>Type</dt><dd>{cap(b.type)}</dd></div>
            <div><dt>Level</dt><dd>{cap(b.level)}</dd></div>
            <div><dt>Goes in</dt><dd>{b.inputs.length ? b.inputs.map((p) => portLabel(p.type) + (p.required ? "" : " (optional)")).join(", ") : "Your request"}</dd></div>
            <div><dt>Comes out</dt><dd>{b.outputs.map((p) => portLabel(p.type)).join(", ") || "See the skill"}</dd></div>
            <div><dt>Category</dt><dd>{isFlow ? "Workflow" : cap(b.category)}{b.addon ? " + ecommerce add-on" : ""}</dd></div>
            <div><dt>Version</dt><dd>{b.version}{b.origin === "rebuilt" ? ", written by us" : ""}</dd></div>
            <div style={{ gridColumn: "1 / -1" }}><dt>Tested</dt><dd>Not yet. Tests follow the framework before a block is marked tested.</dd></div>
          </dl>
        </div>

        <div className="block-body">
          <div>
            <div className="tabs" role="tablist">
              <button role="tab" aria-selected={tab === "skill"} onClick={() => setTab("skill")}>{isFlow ? "The workflow" : "The skill"}</button>
              {addon && <button role="tab" aria-selected={tab === "ecommerce"} onClick={() => setTab("ecommerce")}>Ecommerce add-on</button>}
              {!isFlow && <button role="tab" aria-selected={tab === "connect"} onClick={() => setTab("connect")}>How it connects</button>}
            </div>
            {tab === "skill" && isFlow && (
              <div className="rows" style={{ marginBottom: 48 }}>
                {b.steps.map((s, i) => {
                  const sb = c!.bySlug[s.uses];
                  return (
                    <Link key={i} to={`/blocks/${s.uses}`} className="row" style={{ gridTemplateColumns: "60px minmax(0,1fr) minmax(0,1fr)" }}>
                      <span className="mono small">{String(i + 1).padStart(2, "0")}</span>
                      <span><span className="nm" style={{ fontSize: 20 }}>{sb?.name ?? s.uses}</span>{sb && <><br /><RoleMark role={sb.role} /></>}</span>
                      <span className="sm">{s.note || sb?.summary}</span>
                    </Link>
                  );
                })}
              </div>
            )}
            {tab === "skill" && parts && (
              <>
                {!isFlow && useWhen(parts.front) && <p className="frontmatter" style={{ fontFamily: "var(--sans)", fontSize: 15 }}><b style={{ fontWeight: 500, color: "var(--ink)" }}>When to use it.</b> {useWhen(parts.front)}</p>}
                <div className="prose" dangerouslySetInnerHTML={{ __html: md.parse(parts.body) as string }} />
              </>
            )}
            {tab === "skill" && !parts && <p className="small">Loading the skill…</p>}
            {tab === "ecommerce" && addon && <div className="prose" dangerouslySetInnerHTML={{ __html: md.parse(addon) as string }} />}
            {tab === "connect" && near && (
              <div className="prose">
                <h2>Feeds this block</h2>
                {near.before.length ? <ul>{near.before.slice(0, 12).map((x) => <li key={x.slug}><Link className="link" to={`/blocks/${x.slug}`}>{x.name}</Link> gives {x.outputs.filter((p) => b.inputs.some((i) => i.type === p.type)).map((p) => portLabel(p.type).toLowerCase()).join(", ")}</li>)}</ul> : <p>Nothing in the library produces this block's inputs yet. You provide them.</p>}
                <h2>Takes this block's output</h2>
                {near.after.length ? <ul>{near.after.slice(0, 12).map((x) => <li key={x.slug}><Link className="link" to={`/blocks/${x.slug}`}>{x.name}</Link> reads {x.inputs.filter((p) => b.outputs.some((o) => o.type === p.type)).map((p) => portLabel(p.type).toLowerCase()).join(", ")}</li>)}</ul> : <p>This block ends a chain: its output is for you.</p>}
              </div>
            )}
          </div>
          <aside className="side">
            {b.example && (
              <figure className="example-figure" style={{ margin: 0 }}>
                <img src={formatImage(b.example)} alt={`An example made with ${b.name}`} loading="lazy" />
                <figcaption>An example of this format. Made from public info, not affiliated with the brand shown.</figcaption>
              </figure>
            )}
            {near && near.before.length > 0 && <div><h4>Works well after</h4>{near.before.slice(0, 4).map((x) => <Mini key={x.slug} b={x} />)}</div>}
            {near && near.after.length > 0 && <div><h4>Works well before</h4>{near.after.slice(0, 4).map((x) => <Mini key={x.slug} b={x} />)}</div>}
          </aside>
        </div>
      </div>
      <Toast message={toast} onDone={() => setToast(null)} />
    </>
  );
}
