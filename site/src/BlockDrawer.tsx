import { useEffect, useMemo, useState } from "react";
import { Marked } from "marked";
import { Drawer, KitMenu, RoleMark } from "./ui";
import { type Catalogue, JOBS, cap, loadSkillText, neighbours, portLabel, wireSteps } from "./lib/data";
import { markViewed } from "./lib/store";
import { buildHandoffZip, download } from "./lib/handoff";

// Skill text renders as Markdown with raw HTML escaped: files are data, never markup we trust.
const md = new Marked({ gfm: true, renderer: { html: ({ text }) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;") } });
const splitFront = (t: string) => { const m = t.match(/^---\n([\s\S]*?)\n---\n?/); return m ? { front: m[1], body: t.slice(m[0].length) } : { front: "", body: t }; };
const whenOf = (front: string) => front.match(/^description:\s*(.+)$/m)?.[1].replace(/^["']|["']$/g, "") ?? "";

type Props = {
  c: Catalogue; slug: string; onOpen: (slug: string) => void; onClose: () => void;
  toast: (m: string) => void; toBuilder: (slugs: string[], asNew?: string) => void;
};

export default function BlockDrawer({ c, slug, onOpen, onClose, toast, toBuilder }: Props) {
  const b = c.bySlug[slug];
  const [skill, setSkill] = useState<string | null>(null);
  const [addon, setAddon] = useState<string | null>(null);
  const [tab, setTab] = useState<"skill" | "ecommerce" | "connect">("skill");
  useEffect(() => {
    setSkill(null); setAddon(null); setTab("skill");
    loadSkillText(slug).then(setSkill);
    loadSkillText(slug, "ecommerce.md").then(setAddon);
    markViewed(slug);
  }, [slug]);
  const near = useMemo(() => (b ? neighbours(c, b) : null), [c, b]);
  const parts = skill ? splitFront(skill) : null;
  if (!b) return <Drawer label="Not found" top={<span className="mono">{slug}</span>} onClose={onClose}><p className="small">There's no block called {slug}. It may have been renamed.</p></Drawer>;

  const isFlow = b.category === "orchestrator";
  const handoff = async () => {
    const nodes = b.steps.map((s, i) => ({ id: `s${i + 1}`, slug: s.uses, x: i * 300, y: 0 }));
    const edges = wireSteps(c, b.steps.map((s) => s.uses)).map(([a, z], i) => ({ id: `e${i}`, from: nodes[a].id, to: nodes[z].id }));
    const r = await buildHandoffZip(c, { id: b.slug, name: b.name, updated: 0, nodes, edges });
    if ("error" in r) toast(r.error); else { download(r.blob, r.filename); toast("Handoff downloaded. Give the folder to your AI and say \"follow HANDOFF.md\"."); }
  };

  return (
    <Drawer label={b.name} top={<span className="mono">{b.slug}</span>} onClose={onClose}>
      <RoleMark role={b.role} />
      <h2 className="title">{b.name}</h2>
      <p className="lede" style={{ fontSize: 16 }}>{b.summary}</p>

      <div className="drawer-actions">
        {isFlow ? (
          <>
            <button className="btn btn-primary btn-sm" onClick={() => toBuilder(b.steps.map((s) => s.uses), b.name)}>Open in builder</button>
            <button className="btn btn-dark btn-sm" onClick={handoff}>Download handoff</button>
          </>
        ) : (
          <>
            <button className="btn btn-primary btn-sm" disabled={!skill} onClick={async () => { if (skill) { await navigator.clipboard.writeText(skill).catch(() => {}); toast("Skill copied. Paste it into your AI."); } }}>Copy skill</button>
            <button className="btn btn-dark btn-sm" disabled={!skill} onClick={() => skill && download(new Blob([skill], { type: "text/markdown" }), `${b.slug}.SKILL.md`)}>Download</button>
            <KitMenu slug={b.slug} onChange={toast} />
            <button className="btn btn-dark btn-sm" onClick={() => toBuilder([b.slug])}>Add to builder</button>
          </>
        )}
      </div>

      <dl className="facts">
        <div><dt>Needs</dt><dd>{b.inputs.length ? b.inputs.map((p) => portLabel(p.type) + (p.required ? "" : " (optional)")).join(", ") : "Your request"}</dd></div>
        <div><dt>Gives you</dt><dd>{b.outputs.map((p) => portLabel(p.type)).join(", ") || "See the skill"}</dd></div>
        <div><dt>Job</dt><dd>{JOBS[b.job] ?? cap(b.job)}</dd></div>
        <div><dt>Level</dt><dd>{cap(b.level)}</dd></div>
        <div><dt>Works for</dt><dd>{b.category === "ecommerce" ? "Online stores" : b.addon ? "Any business, with an ecommerce add-on" : isFlow ? "Any business" : "Any business"}</dd></div>
        <div><dt>Tested</dt><dd>Not yet</dd></div>
      </dl>

      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === "skill"} onClick={() => setTab("skill")}>{isFlow ? "Steps" : "Skill"}</button>
        {addon && <button role="tab" aria-selected={tab === "ecommerce"} onClick={() => setTab("ecommerce")}>Ecommerce add-on</button>}
        {!isFlow && <button role="tab" aria-selected={tab === "connect"} onClick={() => setTab("connect")}>Connects to</button>}
      </div>

      {tab === "skill" && isFlow && (
        <div className="steps-list">
          {b.steps.map((s, i) => {
            const sb = c.bySlug[s.uses];
            return (
              <button key={i} onClick={() => onOpen(s.uses)}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <span><b>{sb?.name ?? s.uses}</b><small>{s.note}</small></span>
              </button>
            );
          })}
        </div>
      )}
      {tab === "skill" && !isFlow && parts && (
        <>
          {whenOf(parts.front) && <p className="when"><b>When to use it. </b>{whenOf(parts.front)}</p>}
          <div className="prose" dangerouslySetInnerHTML={{ __html: md.parse(parts.body) as string }} />
        </>
      )}
      {tab === "skill" && !isFlow && !parts && <p className="small">Loading the skill…</p>}
      {tab === "ecommerce" && addon && <div className="prose" dangerouslySetInnerHTML={{ __html: md.parse(addon) as string }} />}
      {tab === "connect" && near && (
        <div className="connect">
          <h4>Feeds into this block</h4>
          {near.before.length ? (
            <ul>{near.before.slice(0, 10).map((x) => <li key={x.slug}><button onClick={() => onOpen(x.slug)}><RoleMark role={x.role}>{x.name}</RoleMark><small>{x.outputs.filter((p) => b.inputs.some((i) => i.type === p.type)).map((p) => portLabel(p.type)).join(", ")}</small></button></li>)}</ul>
          ) : <p className="small" style={{ marginBottom: 24 }}>Nothing makes this block's inputs yet. You provide them.</p>}
          <h4>Takes this block's output</h4>
          {near.after.length ? (
            <ul>{near.after.slice(0, 10).map((x) => <li key={x.slug}><button onClick={() => onOpen(x.slug)}><RoleMark role={x.role}>{x.name}</RoleMark><small>{x.inputs.filter((p) => b.outputs.some((o) => o.type === p.type)).map((p) => portLabel(p.type)).join(", ")}</small></button></li>)}</ul>
          ) : <p className="small">This block ends a chain. Its output is for you.</p>}
        </div>
      )}
    </Drawer>
  );
}
