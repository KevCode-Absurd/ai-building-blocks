// A mind's skills, and the minds behind a skill (docs/SOURCE-SKILLS-PRD.md).
// On a mind's page you tick the skills from their work and download them with the mind as one pack.
// On a skill's page you see who can help with it.
import { useEffect, useState } from "react";
import { type Block, type Catalogue, pathOf } from "./lib/data";
import { buildMindPack, download } from "./lib/handoff";
import { Link } from "./lib/router";
import PixelFace from "./PixelFace";
import { LabelBadges } from "./MindLabel";
import { getBusiness } from "./lib/business";

export function MindSkills({ c, mind, toast }: { c: Catalogue; mind: Block; toast: (m: string) => void }) {
  const skills = (mind.skills ?? []).map((s) => c.bySlug[s]).filter(Boolean);
  const [picked, setPicked] = useState<Set<string>>(() => new Set(skills.map((s) => s.slug)));
  const [busy, setBusy] = useState(false);
  useEffect(() => setPicked(new Set((mind.skills ?? []).filter((s) => c.bySlug[s]))), [mind.slug]);
  const first = mind.name.split(" (")[0];
  const flip = (slug: string) => setPicked((p) => { const n = new Set(p); n.has(slug) ? n.delete(slug) : n.add(slug); return n; });
  const all = picked.size === skills.length;
  const get = async () => {
    setBusy(true);
    try {
      const r = await buildMindPack(c, mind.slug, skills.filter((s) => picked.has(s.slug)).map((s) => s.slug), getBusiness());
      if ("error" in r) { toast(r.error ?? "Couldn't make the pack."); return; }
      download(r.blob, r.filename);
      toast(r.skills ? `Downloaded ${first} with ${r.skills === 1 ? "1 skill" : `${r.skills} skills`}.` : `Downloaded ${first}.`);
    } catch (e) { toast(e instanceof Error ? e.message : "Couldn't make the complete pack. Try again."); }
    finally { setBusy(false); }
  };
  return (
    <div className="mind-skills" data-testid="mind-skills">
      {skills.length > 0 ? (
        <>
          <div className="ms-head">
            <span>{picked.size} of {skills.length} picked</span>
            <button className="link-btn" onClick={() => setPicked(all ? new Set() : new Set(skills.map((s) => s.slug)))} data-testid="mind-skills-all">{all ? "Clear all" : "Pick all"}</button>
          </div>
          <ul className="ms-list">
            {skills.map((s) => (
              <li key={s.slug}>
                <label>
                  <input type="checkbox" checked={picked.has(s.slug)} onChange={() => flip(s.slug)} data-testid="mind-skill-pick" data-slug={s.slug} />
                  <span><b>{s.name}</b><small>{s.summary}</small></span>
                </label>
                <Link to={pathOf(s)} className="ms-open" aria-label={`Open ${s.name}`}>Open</Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="small">No skills from {first}'s work yet. The pack still has {first}'s playbook, personality, knowledge and sources.</p>
      )}
      <div className="bp-actions">
        <button className="btn btn-primary" onClick={get} disabled={busy} data-testid="mind-pack">
          {busy ? "Making the pack…" : picked.size ? `Download ${first} with ${picked.size === 1 ? "1 skill" : `${picked.size} skills`}` : `Download ${first} on their own`}
        </button>
      </div>
      <p className="small">One zip: a README, {first}'s folder (the mind, playbook, personality, knowledge and sources) and a folder for each skill you picked.</p>
    </div>
  );
}

export function HelpedBy({ c, b }: { c: Catalogue; b: Block }) {
  const minds = (b.minds ?? []).map((s) => c.bySlug[s]).filter(Boolean);
  if (!minds.length) return null;
  return (
    <ul className="helped-by" data-testid="helped-by">
      {minds.map((m) => (
        <li key={m.slug}>
          <Link to={pathOf(m)} data-slug={m.slug}>
            <PixelFace face={m.face} area={m.area} slug={m.slug} size={40} />
            <span><b>{m.name}</b><LabelBadges c={c} labels={m.labels} max={2} size="sm" /><small>{m.seats?.[0] ?? ""}</small></span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Workflows: for a skill, the ones it's a step in; for a mind, the ones from their work. Each links to its page,
 *  with the skills it runs in order, so you can see how the pieces connect. */
export function WorkflowList({ c, flows, testid }: { c: Catalogue; flows: Block[]; testid: string }) {
  if (!flows.length) return null;
  return (
    <ul className="flow-list" data-testid={testid}>
      {flows.map((f) => (
        <li key={f.slug}>
          <Link to={pathOf(f)} data-slug={f.slug}><b>{f.name}</b></Link>
          <small>{f.summary}</small>
          <ol className="flow-chain">
            {f.steps.map((s, i) => { const sb = c.bySlug[s.uses]; return <li key={i}>{sb ? <Link to={pathOf(sb)}>{sb.name}</Link> : s.uses}</li>; })}
          </ol>
        </li>
      ))}
    </ul>
  );
}

export const flowsUsing = (c: Catalogue, slug: string) => c.blocks.filter((b) => b.steps.some((s) => s.uses === slug));
