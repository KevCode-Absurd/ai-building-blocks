import { useEffect, useMemo, useRef, useState } from "react";
import type { Catalogue, Role } from "./lib/data";
import { portLabel } from "./lib/data";
import { CUSTOM_LIMIT, replacementImpact, replacementOptions, validateCustomSkills, withCustomSkills, type CustomSkill } from "./lib/custom-skills";
import "./skill-replace.css";

export function ReplaceMenu({ x, y, onReplace, onClose }: { x: number; y: number; onReplace: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector("button")?.focus();
    const off = (e: Event) => { if (!ref.current?.contains(e.target as Node)) onClose(); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape" || e.key === "Tab") onClose(); };
    document.addEventListener("pointerdown", off); window.addEventListener("keydown", esc); window.addEventListener("scroll", onClose, true);
    return () => { document.removeEventListener("pointerdown", off); window.removeEventListener("keydown", esc); window.removeEventListener("scroll", onClose, true); };
  }, [onClose]);
  return <div ref={ref} className="replace-menu" role="menu" aria-label="Step actions" style={{ left: Math.max(8, Math.min(x, window.innerWidth - 190)), top: Math.max(8, Math.min(y, window.innerHeight - 60)) }}><button role="menuitem" onClick={onReplace}>Replace skill…</button></div>;
}

export default function SkillReplace({ c, slug, goal, before, after, customSkills, onChoose, onClose }: { c: Catalogue; slug: string; goal: string; before: string[]; after: string[]; customSkills: CustomSkill[]; onChoose: (slug: string, custom: CustomSkill[]) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("");
  const [uploaded, setUploaded] = useState<CustomSkill | null>(null);
  const [error, setError] = useState("");
  const [name, setName] = useState(""); const [inputs, setInputs] = useState(""); const [outputs, setOutputs] = useState(""); const [role, setRole] = useState<Role>("make");
  const old = c.bySlug[slug];
  const options = useMemo(() => replacementOptions(c, old, goal, query), [c, old, goal, query]);
  const next = uploaded && selected === uploaded.slug ? { ...uploaded, name: name || uploaded.name, role } : c.bySlug[selected];
  const impact = next && replacementImpact(c, old, next, before, after);
  useEffect(() => { const previous = document.activeElement as HTMLElement; dialog.current?.showModal(); return () => { previous?.isConnected && previous.focus(); }; }, []);
  const upload = async (file?: File) => {
    if (!file) return;
    try {
      if (!/\.(md|txt)$/i.test(file.name) || file.size > CUSTOM_LIMIT) throw Error("Upload a self-contained .md or .txt skill under 128 KB. Multi-file ZIP packages are not supported here yet.");
      const markdown = await file.text();
      const title = markdown.match(/^name:\s*["']?([^\r\n"']+)/m)?.[1] || markdown.match(/^#\s+(.+)$/m)?.[1] || file.name.replace(/\.(md|txt)$/i, "");
      const skill: CustomSkill = { slug: `custom-${crypto.randomUUID()}`, name: title.slice(0, 100), summary: "Uploaded by you; review before running.", markdown, role: "make", inputs: [], outputs: [] };
      validateCustomSkills([...customSkills, skill]); setUploaded(skill); setName(skill.name); setSelected(skill.slug); setRole("make"); setInputs(""); setOutputs(""); setError("");
    } catch (e) { setError((e as Error).message); }
  };
  const choose = () => {
    try {
      let custom = customSkills;
      if (uploaded && selected === uploaded.slug) {
        const ports = (s: string) => s.split(",").map(t => t.trim()).filter(Boolean).map(type => ({ type, required: true }));
        custom = validateCustomSkills([...customSkills, { ...uploaded, name, role, inputs: ports(inputs), outputs: ports(outputs) }]);
        withCustomSkills({ ...c, blocks: c.blocks.filter(b => !customSkills.some(s => s.slug === b.slug)), bySlug: Object.fromEntries(Object.entries(c.bySlug).filter(([s]) => !customSkills.some(x => x.slug === s))) }, custom);
      }
      onChoose(selected, custom); onClose();
    } catch (e) { setError((e as Error).message); }
  };
  return <dialog ref={dialog} className="skill-replace" aria-labelledby="replace-title" onCancel={onClose} onClose={onClose}>
    <div className="replace-heading"><h2 id="replace-title">Replace {old.name}</h2><button className="icon-btn" onClick={onClose} aria-label="Close replacement">×</button></div>
    <p className="small">Choose a relevant alternative or search any repository skill. Your step position and notes stay; review instructions that refer to the old skill.</p>
    <label>Search repository skills<input autoFocus value={query} onChange={e => setQuery(e.currentTarget.value)} placeholder="Search names, tasks or outputs" /></label>
    <div className="replace-options" aria-label="Alternative skills">{options.map(b => <button key={b.slug} aria-pressed={selected === b.slug} onClick={() => setSelected(b.slug)}><b>{b.name}</b><span>{b.summary}</span><small>{b.role === old.role ? "Same role" : `Role: ${b.role}`} · {b.outputs.some(o => old.outputs.some(p => p.type === o.type)) ? "Shares an output type" : "Review output compatibility"}{b.slug.startsWith("custom-") ? " · Your skill" : ""}</small></button>)}{!options.length && <p>No confident alternatives for this request. Search a skill name or upload your own.</p>}</div>
    <details className="replace-upload" open={!!uploaded}><summary>Upload your own skill</summary><p className="small">A self-contained SKILL.md or .txt, up to 128 KB. Stored with this workflow in your browser and downloads. Uploading runs nothing. Supporting files in ZIPs are not imported.</p><input type="file" accept=".md,.txt,text/plain,text/markdown" aria-label="Upload custom skill" onChange={e => void upload(e.currentTarget.files?.[0])} />{uploaded && <><label>Skill name<input value={name} maxLength={100} onChange={e => setName(e.currentTarget.value)} /></label><label>Role<select value={role} onChange={e => setRole(e.currentTarget.value as Role)}>{["source", "compress", "make", "render", "check", "orchestrate"].map(r => <option key={r}>{r}</option>)}</select></label><label>Required input types (comma separated)<input value={inputs} onChange={e => setInputs(e.currentTarget.value)} placeholder="brief, copy_draft" /></label><label>Output types (comma separated)<input value={outputs} onChange={e => setOutputs(e.currentTarget.value)} placeholder="copy_draft" /></label><p className="small">Use lowercase type IDs. Leave unknown types blank; compatibility will be unverified.</p><button aria-pressed={selected === uploaded.slug} onClick={() => setSelected(uploaded.slug)}>Use {name || uploaded.name}</button></>}</details>
    {next && <div className="replace-impact" role="status"><b>Selected: {next.name}</b>{uploaded && selected === uploaded.slug ? <p>Custom contracts are supplied by you and have not been verified. Review all connections after replacing.</p> : <><p>{impact?.missing.length ? `Inputs to supply: ${impact.missing.map(portLabel).join(", ")}.` : "Earlier steps supply the declared required input types."}</p><p>{impact?.removed.length ? `Later steps may lose: ${impact.removed.map(portLabel).join(", ")}.` : "No later declared input loses a matching output type."}</p></>}<p className="small">Compatibility checks compare type declarations; they do not prove that two skills perform the same job. Converted input bindings touching this step will be rechecked.</p></div>}
    {error && <p role="alert">{error}</p>}<div className="replace-footer"><button className="btn btn-ghost" onClick={onClose}>Cancel</button><button className="btn btn-primary" disabled={!selected} onClick={choose}>Replace skill</button></div>
  </dialog>;
}
