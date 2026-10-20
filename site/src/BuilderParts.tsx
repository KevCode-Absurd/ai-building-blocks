// The pieces around the builder's canvas: connections that say what they carry, the step panel,
// the "what you'll need" list, starting from a goal, and the step list phones get instead of the canvas.
import { memo, useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type Edge, type EdgeProps } from "@xyflow/react";
import { type Catalogue, type Page, KINDS, kindOf, loadPage, pathOf, portLabel, taskOf } from "./lib/data";
import { useTyped } from "./lib/typing";
import type { Ordered } from "./lib/handoff";
import { passLabel, passes } from "./lib/plan";
import { GOAL_EXAMPLES } from "./lib/goal";
import type { Flow } from "./lib/store";

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
      <figcaption>{step ? `step ${step}: what it hands back` : "what it hands back"}</figcaption>
      <pre>{text.slice(0, n)}<span className="cursor" /></pre>
    </figure>
  );
}
const BITS = ["0", "1", "1", "0", "1", "0"];

export type FlowEdgeData = { label?: string; mismatch?: boolean; run?: number; delay?: number };
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
function StepNotes({ id, role, notes, seats, onNotes }: { id: string; role: string; notes: string; seats: string[]; onNotes: (id: string, patch: { role?: string; notes?: string }) => void }) {
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
export function StartPanel({ goal, notes, onChange, onClose }: { goal: string; notes: string; onChange: (patch: { goal?: string; notes?: string }) => void; onClose: () => void }) {
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
          <textarea value={goal} maxLength={2000} rows={3} placeholder="For example: Decide whether to raise our price to $49" onChange={(e) => onChange({ goal: e.target.value })} data-testid="start-goal" />
        </label>
        <label className="sp-field">
          <span>Notes for every step</span>
          <textarea value={notes} maxLength={2000} rows={3} placeholder="For example: We sell to small gyms. Keep every answer short." onChange={(e) => onChange({ notes: e.target.value })} data-testid="start-notes" />
        </label>
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

export function StepPanel({ c, flow, order, nodeId, onClose, onRemove, onNotes }: {
  c: Catalogue; flow: Flow; order: Ordered[] | null; nodeId: string; onClose: () => void; onRemove: (id: string) => void;
  onNotes: (id: string, patch: { role?: string; notes?: string }) => void;
}) {
  const node = flow.nodes.find((n) => n.id === nodeId);
  const b = node && c.bySlug[node.slug];
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { ref.current?.focus(); }, [nodeId]);
  const [page, setPage] = useState<Page | null>(null);
  useEffect(() => { setPage(null); if (node) loadPage(node.slug).then(setPage); }, [node?.slug]); // eslint-disable-line react-hooks/exhaustive-deps
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
      {!b ? <p className="small">This block isn't in the library any more. Remove it, or the download skips it.</p> : (
        <div className="sp-body">
          <h3 className="sp-name">{b.name}</h3>
          <p className="sp-sum">{b.summary}</p>
          <h4 className="sp-h">It needs</h4>
          <ul className="sp-list">
            {b.inputs.length === 0 && <li><b>Your request</b><small>Tell it what you want when you start.</small></li>}
            {b.inputs.map((p) => {
              const from = ins.find((n) => c.bySlug[n.slug]?.outputs.some((o) => o.type === p.type));
              return (
                <li key={p.type}>
                  <b>{portLabel(p.type)}{p.required ? "" : <span className="opt"> optional</span>}</b>
                  <small>{from ? `Comes from ${stepName(from.id)}` : "You give it this"}{c.portTypes[p.type] ? `. ${c.portTypes[p.type]}` : ""}</small>
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
          <StepNotes id={node.id} role={node.role ?? ""} notes={node.notes ?? ""} seats={b.seats ?? []} onNotes={onNotes} />
          {page?.output_shape && (
            <>
              <h4 className="sp-h">What it hands back</h4>
              <pre className="sp-sample" data-testid="panel-sample">{sampleOf(page.output_shape, 9)}</pre>
            </>
          )}
          <div className="sp-actions">
            <a className="btn btn-ghost btn-sm" href={pathOf(b)} target="_blank" rel="noreferrer">Open its page</a>
            <button className="btn btn-ghost btn-sm" onClick={() => { onRemove(node.id); onClose(); }}>Remove the step</button>
          </div>
          <p className="small sp-job">Job: {taskOf(b).name}</p>
        </div>
      )}
    </aside>
  );
}


/** Type what you want at the end; the builder lays out the steps. */
export function GoalBox({ onPlan, big }: { onPlan: (goal: string) => boolean; big?: boolean }) {
  const [goal, setGoal] = useState("");
  const [miss, setMiss] = useState(false);
  const go = (g: string) => { const ok = onPlan(g); setMiss(!ok); if (ok) setGoal(""); };
  const submit = (e: FormEvent) => { e.preventDefault(); if (goal.trim()) go(goal); };
  return (
    <form className={`goal${big ? " big" : ""}`} onSubmit={submit} data-testid="goal">
      <label className="goal-q" htmlFor={big ? "goal-big" : "goal-side"}>What do you want at the end?</label>
      <div className="goal-row">
        <input id={big ? "goal-big" : "goal-side"} value={goal} onChange={(e) => { setGoal(e.target.value); setMiss(false); }} placeholder={`Try “${GOAL_EXAMPLES[0]}”`} data-testid="goal-input" />
        <button className="btn btn-dark btn-sm" disabled={!goal.trim()} data-testid="goal-go">Lay out the steps</button>
      </div>
      {miss && <p className="small goal-miss">No steps for that yet. Name the result you want, like a landing page, video ads or ad copy.</p>}
      {big && <div className="goal-eg">{GOAL_EXAMPLES.map((g) => <button type="button" key={g} className="chip" onClick={() => go(g)}>{g}</button>)}</div>}
    </form>
  );
}

/** Phones: the workflow as a numbered list, with arrows to reorder, instead of boxes to drag. */
export function StepList({ c, order, run, live, samples, onOpen, onMove, onRemove }: {
  c: Catalogue; order: Ordered[]; run: number; live: number; samples: Record<string, string>; onOpen: (id: string) => void; onMove: (from: number, to: number) => void; onRemove: (id: string) => void;
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
            <div className="sl-row">
              <span className="sl-n">{o.step}</span>
              <button className="sl-txt" onClick={() => onOpen(o.node.id)} data-testid="step-open">
                <b>{b?.name ?? o.node.slug}</b>
                <small>{o.node.role ? `Role: ${o.node.role}` : b ? `${taskOf(b).name}. Tap to see what it needs or add notes` : "No longer in the library"}</small>
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
