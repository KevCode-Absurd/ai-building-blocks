// The pieces around the builder's canvas: connections that say what they carry, the step panel,
// the "what you'll need" list, starting from a goal, and the step list phones get instead of the canvas.
import { memo, useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, type Edge, type EdgeProps } from "@xyflow/react";
import { type Catalogue, KINDS, kindOf, pathOf, portLabel, taskOf } from "./lib/data";
import type { Need, Ordered } from "./lib/handoff";
import { passLabel, passes } from "./lib/plan";
import type { Flow } from "./lib/store";

/** How long each step lights up for in a preview, in seconds. */
export const STEP_S = 1.2;
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
export function StepPanel({ c, flow, order, nodeId, onClose, onRemove, onToggleStore }: {
  c: Catalogue; flow: Flow; order: Ordered[] | null; nodeId: string; onClose: () => void; onRemove: (id: string) => void; onToggleStore: (id: string) => void;
}) {
  const node = flow.nodes.find((n) => n.id === nodeId);
  const b = node && c.bySlug[node.slug];
  const ref = useRef<HTMLElement>(null);
  useEffect(() => { ref.current?.focus(); }, [nodeId]);
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
          {b.addon && (
            <label className="sp-check">
              <input type="checkbox" checked={!!node.ecommerce} onChange={() => onToggleStore(node.id)} />
              <span>Add the steps for an online store</span>
            </label>
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

/** Before the download: one list of everything the steps ask the person for. */
export function NeedsDialog({ name, needs, onDownload, onClose }: { name: string; needs: Need[]; onDownload: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [got, setGot] = useState<Set<string>>(new Set());
  useEffect(() => { const d = ref.current; if (d && !d.open) d.showModal(); }, []);
  const must = needs.filter((n) => n.required), may = needs.filter((n) => !n.required);
  const item = (n: Need) => (
    <li key={n.type}>
      <label>
        <input type="checkbox" checked={got.has(n.type)} onChange={() => setGot((s) => { const x = new Set(s); if (x.has(n.type)) x.delete(n.type); else x.add(n.type); return x; })} />
        <span><b>{n.label}</b><small>{n.about ? `${n.about} ` : ""}For step{n.steps.length > 1 ? "s" : ""} {n.steps.join(", ")}.</small></span>
      </label>
    </li>
  );
  return (
    <dialog className="atf needs" ref={ref} onClose={onClose} onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }} aria-labelledby="needs-h" data-testid="needs">
      <div className="atf-top">
        <h2 className="atf-title" id="needs-h">What you'll need for “{name}”</h2>
        <button className="icon-btn" onClick={() => ref.current?.close()} aria-label="Close">×</button>
      </div>
      <div className="atf-body">
        {needs.length === 0
          ? <p className="atf-lead">Nothing to gather. Every step works from your request or an earlier step's result.</p>
          : <p className="atf-lead">Gather these once, before you start. Your AI asks for each one at the step that uses it, and writes MISSING where something isn't there.</p>}
        {must.length > 0 && <><h3 className="atf-h">Have these ready</h3><ul className="needs-list" data-testid="needs-required">{must.map(item)}</ul></>}
        {may.length > 0 && <><h3 className="atf-h">These make it better, if you have them</h3><ul className="needs-list">{may.map(item)}</ul></>}
        <div className="atf-foot">
          <span className="small">{needs.length ? `${got.size} of ${needs.length} ready` : "Ready to go"}</span>
          <button className="btn btn-primary" onClick={() => { onDownload(); ref.current?.close(); }} data-testid="needs-download">Download the workflow</button>
        </div>
      </div>
    </dialog>
  );
}

export const GOAL_EXAMPLES = ["a landing page for my best ad", "video ads from my reviews", "find why my ads stopped selling"];

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
export function StepList({ c, order, run, onOpen, onMove, onRemove }: {
  c: Catalogue; order: Ordered[]; run: number; onOpen: (id: string) => void; onMove: (from: number, to: number) => void; onRemove: (id: string) => void;
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
                <small>{b ? `${taskOf(b).name}. Tap to see what it needs` : "No longer in the library"}</small>
              </button>
              <span className="sl-ctl">
                <button className="icon-btn" onClick={() => onMove(i, i - 1)} disabled={i === 0} aria-label={`Move ${b?.name ?? "step"} up`} data-testid="step-up">↑</button>
                <button className="icon-btn" onClick={() => onMove(i, i + 1)} disabled={i === order.length - 1} aria-label={`Move ${b?.name ?? "step"} down`} data-testid="step-down">↓</button>
                <button className="icon-btn" onClick={() => onRemove(o.node.id)} aria-label={`Remove ${b?.name ?? "step"}`}>×</button>
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
