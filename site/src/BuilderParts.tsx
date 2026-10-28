import { WORKFLOW_NOTES_LIMIT } from "./lib/workflow-limits.ts";
// The pieces around the builder's canvas: connections that say what they carry, the step panel,
// the "what you'll need" list, starting from a goal, and the step list phones get instead of the canvas.
import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type Edge, type EdgeProps } from "@xyflow/react";
import { type Catalogue, type Page, KINDS, kindOf, loadPage, pathOf, portLabel, taskOf } from "./lib/data";
import { useTyped } from "./lib/typing";
import type { Ordered } from "./lib/handoff";
import { passLabel, passes } from "./lib/plan";
import { type Flow, type Team, TEAM_MAX } from "./lib/store";
import { type Lead, leadsOf, mindName, mindsIn, suggestMinds, taskMinds } from "./lib/crew";
import "./my-minds.css";
import PixelFace from "./PixelFace";

type NotesPatch = { role?: string; notes?: string; mind?: string; minds?: string[] };

/** Pick a mind by typing their name. Once picked, it shows their face and name, with a way to change it. */
export function MindPick({ c, value, onPick, label, placeholder, exclude = [], testid }: {
  c: Catalogue; value: string | null; onPick: (slug: string | null) => void; label: string; placeholder: string; exclude?: string[]; testid: string;
}) {
  const [q, setQ] = useState("");
  const all = useMemo(() => mindsIn(c), [c]);
  const picked = value ? c.bySlug[value] : null;
  if (picked) {
    return (
      <div className="mind-picked" data-testid={`${testid}-picked`}>
        <PixelFace face={picked.face} area={picked.area} slug={picked.slug} size={28} />
        <span><b>{mindName(c, picked.slug)}</b><small>{picked.identity || picked.seats?.[0] || ""}</small></span>
        <button type="button" className="link-btn" onClick={() => onPick(null)} data-testid={`${testid}-clear`}>Remove</button>
      </div>
    );
  }
  const find = (v: string) => { const t = v.trim().toLowerCase(); return all.find((m) => !exclude.includes(m.slug) && (m.name.toLowerCase() === t || mindName(c, m.slug).toLowerCase() === t)); };
  const list = `minds-${testid}`;
  return (
    <label className="sp-field">
      <span>{label}</span>
      <input list={list} value={q} placeholder={placeholder} data-testid={testid}
        onChange={(e) => { const m = find(e.target.value); if (m) { onPick(m.slug); setQ(""); } else setQ(e.target.value); }} />
      <datalist id={list}>{all.filter((m) => !exclude.includes(m.slug)).map((m) => <option key={m.slug} value={mindName(c, m.slug)}>{m.identity}</option>)}</datalist>
    </label>
  );
}

/** A face and a name for a mind already on the team. */
function Member({ c, slug, onRemove }: { c: Catalogue; slug: string; onRemove: () => void }) {
  const m = c.bySlug[slug];
  return (
    <li data-testid="team-member" data-slug={slug}>
      {m && <PixelFace face={m.face} area={m.area} slug={slug} size={24} />}
      <b>{mindName(c, slug)}</b>
      <button type="button" className="icon-btn" onClick={onRemove} aria-label={`Take ${mindName(c, slug)} off the team`}>×</button>
    </li>
  );
}

/** How long each step lights up for in a preview, in seconds: long enough to read a few lines of its result. */
export const STEP_S = 2.4;

/** The first few lines of a step's output shape, for showing on a step. */
export function sampleOf(output: string | undefined, lines = 5): string {
  if (!output) return "";
  const rows = output.replace(/\r/g, "").split("\n");
  while (rows.length && !rows[0].trim()) rows.shift();
  const cut = rows.slice(0, lines);
  return cut.join("\n").trimEnd() + (rows.length > lines ? "\n…" : "");
}

/** A step's result writing itself out, the way your AI would answer. */
export function Sample({ text, name, step }: { text: string; name: string; step?: number }) {
  const { n } = useTyped(text, true, STEP_S * 650);
  return (
    <figure className={`node-out${step ? " run-out" : ""}`} aria-label={`What ${name} hands back`} data-testid="step-sample">
      <figcaption>{step ? `Step ${step}: sample result` : "Sample result, not work produced here"}</figcaption>
      <pre>{text.slice(0, n)}<span className="cursor" /></pre>
    </figure>
  );
}
const BITS = ["0", "1", "1", "0", "1", "0"];

export type FlowEdgeData = { fromPort?: string; toPort?: string; label?: string; mismatch?: boolean; run?: number; delay?: number };
export type FlowEdgeT = Edge<FlowEdgeData, "flow">;

/** A connection with what it carries written on it. During a preview, 0s and 1s run along it. */
export const FlowEdge = memo(function FlowEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, markerEnd, style }: EdgeProps<FlowEdgeT>) {
  const [path, lx, ly] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        {data?.label && <div className={`edge-label${data.mismatch ? " warn" : ""}`} style={{ transform: `translate(-50%, -50%) translate(${lx}px, ${ly}px)` }} data-testid="edge-label">{data.label}</div>}
        {!!data?.run && (
          <div key={data.run} className="bits" aria-hidden="true">
            {BITS.map((b, i) => <span key={i} style={{ offsetPath: `path("${path}")`, animationDelay: `${(data.delay ?? 0) + i * 0.1}s` }}>{b}</span>)}
          </div>
        )}
      </EdgeLabelRenderer>
    </>
  );
});

/** What one step needs and gives back, and where each comes from or goes. */
/** The person's own instructions for one step: a role and free notes. They go into the download (lib/handoff.ts withNotes). */
function StepNotes({ id, role, notes, seats, onNotes }: { id: string; role: string; notes: string; seats: string[]; onNotes: (id: string, patch: NotesPatch) => void }) {
  const list = `seats-${id}`;
  return (
    <div className="sp-notes" data-testid="step-notes">
      <h4 className="sp-h">Your notes for this step</h4>
      <p className="small">Optional. They go into the download, at the top of this step's skill file.</p>
      <label className="sp-field">
        <span>Role</span>
        <input value={role} maxLength={120} list={seats.length ? list : undefined} placeholder={seats[0] ? `Suggested: ${seats[0]}` : "For example: My investor"} onChange={(e) => onNotes(id, { role: e.target.value })} data-testid="step-role" />
        {seats.length > 0 && <datalist id={list}>{seats.map((s) => <option key={s} value={s} />)}</datalist>}
      </label>
      {seats.length > 0 && !role && (
        <div className="sp-seats">{seats.map((s) => <button key={s} type="button" className="chip" onClick={() => onNotes(id, { role: s })}>{s}</button>)}</div>
      )}
      <label className="sp-field">
        <span>Extra instructions</span>
        <textarea value={notes} maxLength={2000} rows={4} placeholder="For example: Push back hard on the price. Keep it under 200 words." onChange={(e) => onNotes(id, { notes: e.target.value })} data-testid="step-instructions" />
      </label>
    </div>
  );
}

/** The Start node: what the whole workflow is for, and notes every step should follow. */
export type StartPatch = { goal?: string; notes?: string; overseer?: string; team?: Team };
const MODES: { id: Team["mode"]; name: string; line: string }[] = [
  { id: "split", name: "Split by expertise", line: "Each part of the job goes to the mind best suited to it. Their parts are merged into one final answer." },
  { id: "together", name: "Decide together", line: "Every mind takes the whole job. They argue it out and hand back one agreed answer." },
];

/** The minds working on the whole workflow: one overseer who checks every step, and a team of up to six below you. */
function Crew({ c, overseer, team, onChange }: { c: Catalogue; overseer: string; team: Team | undefined; onChange: (p: StartPatch) => void }) {
  const minds = team?.minds ?? [];
  const mode = team?.mode ?? "split";
  const setTeam = (next: string[], m = mode) => onChange({ team: next.length ? { minds: next, mode: m } : undefined });
  return (
    <>
      <div className="sp-crew" data-testid="overseer">
        <h4 className="sp-h">Overseer</h4>
        <p className="small">Optional. One mind checks every step against their own standards and sends weak work back once.</p>
        <MindPick c={c} value={overseer || null} onPick={(s) => onChange({ overseer: s ?? undefined })} label="Mind" placeholder="For example: David Ogilvy" testid="overseer-input" />
      </div>
      <div className="sp-crew" data-testid="team">
        <h4 className="sp-h">Your team</h4>
        <p className="small">Optional. Add up to {TEAM_MAX} minds with different strengths. Split the job between them, or have them review the same decision. You make the final call.</p>
        {minds.length > 0 && <ul className="team-list">{minds.map((s) => <Member key={s} c={c} slug={s} onRemove={() => setTeam(minds.filter((x) => x !== s))} />)}</ul>}
        {minds.length < TEAM_MAX
          ? <MindPick c={c} value={null} exclude={minds} onPick={(s) => s && setTeam([...minds, s])} label={minds.length ? "Add another" : "Add a mind"} placeholder="For example: Ratan Tata" testid="team-input" />
          : <p className="small">That's a full team of {TEAM_MAX}.</p>}
        {minds.length > 0 && (
          <>
            <div className="seg team-mode" role="group" aria-label="How the team works">
              {MODES.map((m) => <button key={m.id} type="button" aria-pressed={mode === m.id} onClick={() => setTeam(minds, m.id)} data-testid={`team-${m.id}`}>{m.name}</button>)}
            </div>
            <p className="small" data-testid="team-mode-line">{MODES.find((m) => m.id === mode)!.line}</p>
          </>
        )}
      </div>
    </>
  );
}

export function StartPanel({ c, goal, notes, overseer, team, onChange, onClose }: {
  c: Catalogue; goal: string; notes: string; overseer: string; team: Team | undefined; onChange: (patch: StartPatch) => void; onClose: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <aside className="step-panel" aria-label="Start" tabIndex={-1} ref={ref} data-testid="start-panel">
      <div className="sp-top"><span className="kind">Start</span><button className="icon-btn" onClick={onClose} aria-label="Close">×</button></div>
      <div className="sp-body">
        <h3 className="sp-name">Where every run begins</h3>
        <p className="sp-sum">It's always first. Say what this workflow is for, so every step works toward the same thing.</p>
        <label className="sp-field">
          <span>What it's for</span>
          <textarea value={goal} maxLength={3000} rows={3} placeholder="For example: Decide whether to raise our price to $49" onChange={(e) => onChange({ goal: e.target.value })} data-testid="start-goal" />
        </label>
        <label className="sp-field">
          <span>Notes for every step</span>
          <textarea value={notes} maxLength={WORKFLOW_NOTES_LIMIT} rows={3} placeholder="For example: We sell to small gyms. Keep every answer short." onChange={(e) => onChange({ notes: e.target.value })} data-testid="start-notes" />
        </label>
        <details className="workflow-options"><summary>Add expert perspectives (optional)</summary><Crew c={c} overseer={overseer} team={team} onChange={onChange} /></details>
      </div>
    </aside>
  );
}

/** The End node: what the workflow hands back. It appears once the workflow is saved. */
export function EndPanel({ finals, onClose }: { finals: string[]; onClose: () => void }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { ref.current?.focus(); }, []);
  return (
    <aside className="step-panel" aria-label="End" tabIndex={-1} ref={ref} data-testid="end-panel">
      <div className="sp-top"><span className="kind">End</span><button className="icon-btn" onClick={onClose} aria-label="Close">×</button></div>
      <div className="sp-body">
        <h3 className="sp-name">What you get at the end</h3>
        <p className="sp-sum">Every last step leads here. Steps that run side by side all finish before it.</p>
        <ul className="sp-list">{finals.length ? finals.map((f) => <li key={f}><b>{f}</b></li>) : <li><small>Add a step to see what it hands back.</small></li>}</ul>
        <p className="small sp-job">Then your AI suggests what you could do next. You can stop there.</p>
      </div>
    </aside>
  );
}

export function StepPanel({ c, flow, order, nodeId, onClose, onRemove, onReplace, onNotes }: {
  c: Catalogue; flow: Flow; order: Ordered[] | null; nodeId: string; onClose: () => void; onRemove: (id: string) => void; onReplace: (id: string) => void;
  onNotes: (id: string, patch: NotesPatch) => void;
}) {
  const node = flow.nodes.find((n) => n.id === nodeId);
  const b = node && c.bySlug[node.slug];
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { ref.current?.focus(); }, [nodeId]);
  const [page, setPage] = useState<Page | null>(null);
  useEffect(() => { setPage(null); if (node && !node.slug.startsWith("custom-")) loadPage(node.slug).then(setPage); }, [node?.slug]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);
  if (!node) return null;
  const stepOf = Object.fromEntries((order ?? []).map((o) => [o.node.id, o.step]));
  const nodeById = Object.fromEntries(flow.nodes.map((n) => [n.id, n]));
  const ins = flow.edges.filter((e) => e.to === node.id).map((e) => nodeById[e.from]).filter(Boolean);
  const outs = flow.edges.filter((e) => e.from === node.id).map((e) => nodeById[e.to]).filter(Boolean);
  const nameOf = (id: string) => c.bySlug[nodeById[id]?.slug]?.name ?? "a missing block";
  const stepName = (id: string) => `step ${stepOf[id] ?? "?"}, ${nameOf(id)}`;
  return (
    <aside className="step-panel" aria-label="About this step" tabIndex={-1} ref={ref} data-testid="step-panel">
      <div className="sp-top">
        <span className="kind">{b ? KINDS.find((k) => k.id === kindOf(b))!.name : "Missing"}</span>
        <span className="sp-step">{stepOf[node.id] ? `Step ${stepOf[node.id]}` : ""}</span>
        <button className="icon-btn" onClick={onClose} aria-label="Close">×</button>
      </div>
      {!b ? <p className="small">This skill is no longer in the library. Replace or remove it before downloading.</p> : (
        <div className="sp-body">
          <h3 className="sp-name">{b.name}</h3>
          <p className="sp-sum">{b.summary}</p>
          <h4 className="sp-h">It needs</h4>
          <ul className="sp-list">
            {b.inputs.length === 0 && <li><b>Your request</b><small>Tell it what you want when you start.</small></li>}
            {b.inputs.map((p) => {
              const binding = node.bindings?.find(binding => binding.type === p.type && ins.some(n => n.id === binding.from));
              const from = binding ? ins.find(n => n.id === binding.from) : ins.find((n) => c.bySlug[n.slug]?.outputs.some((o) => o.type === p.type));
              return (
                <li key={p.type}>
                  <b>{portLabel(p.type)}<span className="opt"> {p.required ? "required" : "optional"}</span></b>
                  <small>{from ? `Comes from ${stepName(from.id)}` : p.required ? "Use an existing file, link or earlier result. If it is missing, ask your AI to help create it before this step" : "Add this in your AI if it helps"}{c.portTypes[p.type] ? `. ${c.portTypes[p.type]}` : ""}</small>
                  {binding && <small>{binding.instruction}</small>}
                </li>
              );
            })}
          </ul>
          <h4 className="sp-h">It gives back</h4>
          <ul className="sp-list">
            {b.outputs.map((p) => {
              const to = outs.filter((n) => passes(c, node.slug, n.slug).includes(p.type));
              return (
                <li key={p.type}>
                  <b>{portLabel(p.type)}</b>
                  <small>{to.length ? `Goes to ${to.map((n) => stepName(n.id)).join(" and ")}` : "Ready for you to use"}{c.portTypes[p.type] ? `. ${c.portTypes[p.type]}` : ""}</small>
                </li>
              );
            })}
          </ul>
          {b.type !== "mind" && <StepMind c={c} flow={flow} order={order} nodeId={node.id} onNotes={onNotes} />}
          <details className="workflow-options"><summary>Edit instructions</summary>
          <StepNotes id={node.id} role={node.role ?? ""} notes={node.notes ?? ""} seats={b.seats ?? []} onNotes={onNotes} /></details>
          {page?.output_shape && (
            <>
              <h4 className="sp-h">What it hands back</h4>
              <pre className="sp-sample" data-testid="panel-sample">{sampleOf(page.output_shape, 9)}</pre>
            </>
          )}
          <div className="sp-actions">
            {!b.slug.startsWith("custom-") && <a className="btn btn-ghost btn-sm" href={pathOf(b)} target="_blank" rel="noreferrer">Open its page</a>}
            <button className="btn btn-ghost btn-sm" onClick={() => onReplace(node.id)}>Replace skill</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { onRemove(node.id); onClose(); }}>Remove the step</button>
          </div>
          <p className="small sp-job">Job: {taskOf(b).name}</p>
        </div>
      )}
    </aside>
  );
}


/** Hand one step to a mind: the step's skill decides what to make, and the mind's method and voice decide how. */
function StepMind({ c, flow, order, nodeId, onNotes }: { c: Catalogue; flow: Flow; order: Ordered[] | null; nodeId: string; onNotes: (id: string, patch: NotesPatch) => void }) {
  const node = flow.nodes.find((n) => n.id === nodeId)!;
  const b = c.bySlug[node.slug];
  const step = order?.find((o) => o.node.id === nodeId)?.step;
  const lead = step && order ? leadsOf(c, flow, order)[step] : undefined;
  const ideas = useMemo(() => suggestMinds(c, b, 2), [c, b]);
  const selected = taskMinds(c, node);
  const set = (minds: string[]) => onNotes(node.id, { minds, mind: minds[0] });
  const toggle = (slug: string) => set(selected.includes(slug) ? selected.filter(s => s !== slug) : [...selected, slug].slice(0, TEAM_MAX));
  const personal = mindsIn(c).filter(m => m.version === "local");
  return (
    <div className="sp-crew" data-testid="step-mind">
      <h4 className="sp-h">Assign Mind</h4>
      <p className="small">Choose one mind for its method and voice, or up to {TEAM_MAX} for a council. The downloaded workflow asks each council member for a view, has them challenge one another, then combines their strongest ideas and records disagreement. For writing, the first selected mind sets the final voice.</p>
      {selected.length > 0 && <div className="task-mind-selected" aria-label="Selected task minds">{selected.map(s => <button key={s} type="button" className="chip" aria-pressed="true" onClick={() => toggle(s)} aria-label={`Remove ${mindName(c, s)} from task`}>{mindName(c, s)} ×</button>)}</div>}
      {selected.length > 1 && <p className="small" data-testid="task-council">Council of {selected.length} · Compare views → challenge → one answer with dissent</p>}
      {ideas.length > 0 && <><p className="small"><b>Recommended for this task</b> · {b.minds?.some(s => ideas.some(m => m.slug === s)) ? "Based on the skill's source minds and subject areas" : "Based on matching subject areas"}</p><div className="sp-seats">{ideas.map(m => <button key={m.slug} type="button" className="chip task-mind-recommendation" aria-pressed={selected.includes(m.slug)} disabled={!selected.includes(m.slug) && selected.length >= TEAM_MAX} onClick={() => toggle(m.slug)} data-testid="mind-idea">{mindName(c, m.slug)}<small>{selected.includes(m.slug) ? "Selected" : "Add recommended mind"}</small></button>)}</div></>}
      {personal.length > 0 && <><p className="small"><b>Your minds</b></p><div className="sp-seats">{personal.map(m => <button key={m.slug} type="button" className="chip" aria-pressed={selected.includes(m.slug)} disabled={!selected.includes(m.slug) && selected.length >= TEAM_MAX} onClick={() => toggle(m.slug)}>{m.name}</button>)}</div></>}
      {selected.length < TEAM_MAX && <MindPick c={c} value={null} exclude={selected} onPick={s => s && toggle(s)} label="Add a mind" placeholder="Search minds by name" testid="step-mind-input" />}
      {!selected.length && lead?.from === "team" && <p className="small" data-testid="team-lead">Your team gives this step to <b>{mindName(c, lead.mind)}</b>. Choose minds here to change that.</p>}
      <p className="small">Create or import your own mind in Compose or the Minds library. Minds run when you give the downloaded pack to your AI.</p>
    </div>
  );
}

/** Phones: the workflow as a numbered list, with arrows to reorder, instead of boxes to drag. */
export function StepList({ c, order, selectedId, leads = {}, run, live, samples, onOpen, onMove, onRemove }: {
  c: Catalogue; order: Ordered[]; selectedId?: string | null; leads?: Record<number, Lead>; run: number; live: number; samples: Record<string, string>; onOpen: (id: string) => void; onMove: (from: number, to: number) => void; onRemove: (id: string) => void;
}) {
  return (
    <ol className="step-list" data-testid="step-list">
      {order.map((o, i) => {
        const b = c.bySlug[o.node.slug];
        const prev = order[i - 1];
        const carry = prev && o.from.includes(prev.step) ? passLabel(c, prev.node.slug, o.node.slug) : o.from.length ? `uses step ${o.from.join(" and ")}` : "";
        return (
          <li key={o.node.id} style={{ "--d": `${i * STEP_S}s`, "--t": `${STEP_S}s` } as CSSProperties} className={run ? "running" : ""} data-slug={o.node.slug}>
            {i > 0 && (
              <div className="sl-pass" aria-label={carry ? `Passes ${carry}` : undefined}>
                <span className="sl-line" aria-hidden="true">{!!run && <span key={run} className="sl-bits" style={{ animationDelay: `${(i - 1) * STEP_S + 0.5}s` }}>0110</span>}</span>
                {carry && <span className="sl-carry">{carry}</span>}
              </div>
            )}
            <div className="sl-row" data-selected={selectedId === o.node.id ? "true" : undefined}>
              <span className="sl-n">{o.step}</span>
              <button className="sl-txt" aria-pressed={selectedId === o.node.id} onClick={() => onOpen(o.node.id)} data-testid="step-open">
                <b>{b?.name ?? o.node.slug}</b>
                <small className="sl-purpose">{b?.summary ?? "Review this step before using it."}</small><small className="sl-result">Makes: {b?.outputs.map(p => portLabel(p.type)).join(", ") || "See this step’s instructions"}</small><small>{(leads[o.step]?.minds?.length ?? 0) > 1 ? `Council: ${leads[o.step].minds!.map(s => mindName(c, s)).join(", ")}` : leads[o.step] ? `Done like ${mindName(c, leads[o.step].mind)}${o.node.role ? `, as ${o.node.role}` : ""}` : o.node.role ? `Role: ${o.node.role}` : b ? `${taskOf(b).name}. Tap to see what it needs or add notes` : "No longer in the library"}</small>
              </button>
              <span className="sl-ctl">
                <button className="icon-btn" onClick={() => onMove(i, i - 1)} disabled={i === 0} aria-label={`Move ${b?.name ?? "step"} up`} data-testid="step-up">↑</button>
                <button className="icon-btn" onClick={() => onMove(i, i + 1)} disabled={i === order.length - 1} aria-label={`Move ${b?.name ?? "step"} down`} data-testid="step-down">↓</button>
                <button className="icon-btn" onClick={() => onRemove(o.node.id)} aria-label={`Remove ${b?.name ?? "step"}`}>×</button>
              </span>
            </div>
            {live === o.step && samples[o.node.slug] && b && <Sample text={samples[o.node.slug]} name={b.name} />}
          </li>
        );
      })}
    </ol>
  );
}
