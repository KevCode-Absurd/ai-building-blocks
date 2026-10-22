import SkillReplace, { ReplaceMenu } from "./SkillReplace";
import { assignedCustomMinds, withCustomMinds, type CustomMind } from "./lib/custom-minds";
import { useMyMinds } from "./lib/mind-library";
import { withCustomSkills, replaceFlowSkill, type CustomSkill } from "./lib/custom-skills";
import { spaceKey, spaces } from "./lib/space";
import { createContext, memo, useCallback, useContext, useDeferredValue, useEffect, useMemo, useRef, useState, type CSSProperties, type DragEvent } from "react";
import {
  Background, BackgroundVariant, Handle, Panel, Position, ReactFlow, ReactFlowProvider, addEdge, useEdgesState, useNodesState, useReactFlow,
  type Connection, type Node, type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import "./workflow-selection.css";
import { SearchIcon } from "./ui";
import { type Block, type Catalogue, KINDS, TASKS, kindOf, loadPage, portLabel, taskOf, wireSteps, workflowEntries } from "./lib/data";
import PixelFace from "./PixelFace";
import { suggestNext } from "./lib/suggest";
import { type Flow, type FlowNode, type Team, QUEUED, flows, takeQueued, uid, useStore } from "./lib/store";
import { leadsOf, mindName } from "./lib/crew";
import { buildHandoffZip, download, finalOutputs, needsOf, orderFlow, typeMismatches, zipName } from "./lib/handoff";
import { getBusiness } from "./lib/business";
import { DownloadDialog } from "./DownloadDialog";
import ExecutionPrompt from "./ExecutionPrompt";
import { flowFrom, passLabel, planFromGoal, shareUrl, tidy, unpackFlow } from "./lib/plan";
import { compositionFlow } from "./lib/composer-flow";
import { finalize, freeSelection } from "./lib/composer-core";
import { applySteps } from "./lib/flowEdit";
import { setSearch } from "./lib/router";
import { EndPanel, FlowEdge, type FlowEdgeT, GoalBox, STEP_S, Sample, StartPanel, type StartPatch, StepList, StepPanel, sampleOf } from "./BuilderParts";

/** mind is the one you picked for the step; lead is who actually leads it (yours, or your team's pick), worked out each time. */
type NodeData = { slug: string; ecommerce?: boolean; step?: number; run?: number; delay?: number; role?: string; notes?: string; mind?: string; minds?: string[]; lead?: string; leadTeam?: boolean; bindings?: FlowNode["bindings"] };
type BlockNode = Node<NodeData, "block">;
// Start and End aren't steps. They're drawn from the steps each time, so they can't be dragged off, deleted or saved wrong.
const START = "__start", END = "__end";
type EndData = { which: "start" | "end"; line: string; crew?: string };
type EndNode = Node<EndData, "terminal">;
const TerminalView = memo(function TerminalView({ data }: NodeProps<EndNode>) {
  const start = data.which === "start";
  return (
    <div className={`terminal t-${data.which}`} data-testid={`flow-${data.which}`}>
      {!start && <Handle type="target" position={Position.Left} isConnectable={false} />}
      <b>{start ? "Start" : "End"}</b>
      <span>{data.line}</span>
      {data.crew && <span className="t-crew" data-testid="start-crew">{data.crew}</span>}
      {start && <Handle type="source" position={Position.Right} isConnectable={false} />}
    </div>
  );
});
const CatalogueCtx = createContext<Catalogue | null>(null);
const NodeActions = createContext<{ remove: (id: string) => void }>({ remove: () => {} });

const BlockNodeView = memo(function BlockNodeView({ id, data }: NodeProps<BlockNode>) {
  const c = useContext(CatalogueCtx);
  const act = useContext(NodeActions);
  const b = c?.bySlug[data.slug];
  return (
    <div key={data.run ?? 0} className={`node${data.run ? " running" : ""}`} style={{ "--d": `${data.delay ?? 0}s`, "--t": `${STEP_S}s` } as CSSProperties} data-testid="flow-node">
      <Handle type="target" position={Position.Left} />
      <div className="top">{b ? <span className="kind">{KINDS.find((k) => k.id === kindOf(b))!.name}</span> : <span className="small">Missing block</span>}<span className="step-n">{data.step ? `Step ${data.step}` : ""}</span></div>
      <div className="nm">{b?.type === "mind" && <PixelFace face={b.face} area={b.area} slug={b.slug} size={28} className="node-face" />}{b?.name ?? data.slug}</div>
      {data.lead && c?.bySlug[data.lead] && (
        <div className="node-mind" data-testid="node-mind"><PixelFace face={c.bySlug[data.lead].face} area={c.bySlug[data.lead].area} slug={data.lead} size={16} />{(data.minds?.length ?? 0) > 1 ? `Council of ${data.minds!.length}` : `Done like ${mindName(c, data.lead)}`}{data.leadTeam ? " (team)" : ""}</div>
      )}
      {(data.role || data.notes) && <div className="node-role" data-testid="node-role">{data.role ? `Role: ${data.role}` : "Has your notes"}</div>}
      {b && (
        <div className="io">
          <div><b>In</b> {b.inputs.map((p) => portLabel(p.type)).join(", ") || "your request"}</div>
          <div><b>Out</b> {b.outputs.map((p) => portLabel(p.type)).join(", ") || "see skill"}</div>
        </div>
      )}
      <button className="x nodrag" aria-label="Remove block" onClick={(e) => { e.stopPropagation(); act.remove(id); }}>×</button>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});
const nodeTypes = { block: BlockNodeView, terminal: TerminalView };
const edgeTypes = { flow: FlowEdge };

const Ico = ({ d }: { d: string }) => <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" aria-hidden="true"><path d={d} /></svg>;
const UNDO = "M5 3 2 6l3 3M2.5 6H10a4 4 0 0 1 0 8H7", REDO = "M11 3l3 3-3 3M13.5 6H6a4 4 0 0 0 0 8h3";
const testId = (label: string) => `view-${label.toLowerCase().replace(/\s+/g, "-")}`;
type Edit = { undo: () => void; redo: () => void; canUndo: boolean; canRedo: boolean };

/** Undo, redo and tidy, then zoom, fit and full screen. Full screen uses the browser's own when it can, and fills the window when it can't (iPhone). */
function ViewControls({ full, onFull, edit, onTidy }: { full: boolean; onFull: () => void; edit: Edit; onTidy: () => void }) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const groups = [[
    { label: "Undo", d: UNDO, on: edit.undo, off: !edit.canUndo, tip: "Undo (Ctrl+Z)" },
    { label: "Redo", d: REDO, on: edit.redo, off: !edit.canRedo, tip: "Redo (Ctrl+Shift+Z)" },
    { label: "Tidy layout", d: "M2 3h5v4H2zM9 3h5v4H9zM2 10h5v4H2zM9 10h5v4H9z", on: onTidy },
  ], [
    { label: "Zoom in", d: "M8 3v10M3 8h10", on: () => zoomIn({ duration: 200 }) },
    { label: "Zoom out", d: "M3 8h10", on: () => zoomOut({ duration: 200 }) },
    { label: "Fit to screen", d: "M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4", on: () => fitView({ padding: 0.2, duration: 300, maxZoom: 1 }) },
    full
      ? { label: "Exit full screen", d: "M6 2v4H2M10 2v4h4M14 10h-4v4M2 10h4v4", on: onFull }
      : { label: "Full screen", d: "M2 6V2h4M2 2l4.5 4.5M10 2h4v4M14 2l-4.5 4.5M14 10v4h-4M14 14l-4.5-4.5M6 14H2v-4M2 14l4.5-4.5", on: onFull },
  ]];
  return (
    <Panel position="bottom-right" className="view-ctls" aria-label="Edit and view">
      {groups.map((g, i) => (
        <div key={i} className="view-ctl" role="group">
          {g.map((x) => <button key={x.label} onClick={x.on} disabled={"off" in x && x.off} aria-label={x.label} title={"tip" in x ? x.tip : x.label} data-testid={testId(x.label)}><Ico d={x.d} /></button>)}
        </div>
      ))}
    </Panel>
  );
}

const fromFlow = (f: Pick<Flow, "nodes" | "edges">) => ({
  nodes: f.nodes.map((n): BlockNode => ({ id: n.id, type: "block", position: { x: n.x, y: n.y }, data: { slug: n.slug, ecommerce: n.ecommerce, role: n.role, notes: n.notes, mind: n.mind, minds: n.minds, bindings: n.bindings } })),
  edges: f.edges.map((e): FlowEdgeT => ({ id: e.id, source: e.from, target: e.to, type: "flow" })),
});
type Ends = { governingSkills?: string[]; customMinds?: CustomMind[]; customSkills?: CustomSkill[]; goal: string; notes: string; ended: boolean; overseer?: string; team?: Team };
const endsOf = (f: Flow | null): Ends => ({ governingSkills: f?.governingSkills, customMinds: f?.customMinds, customSkills: f?.customSkills, goal: f?.goal ?? "", notes: f?.notes ?? "", ended: !!f?.ended, overseer: f?.overseer, team: f?.team });
const toFlow = (id: string, name: string, nodes: BlockNode[], edges: FlowEdgeT[], ends: Ends): Flow => ({
  id, name, updated: 0, governingSkills: ends.governingSkills, customSkills: ends.customSkills, customMinds: ends.customMinds,
  nodes: nodes.map((n) => ({ id: n.id, slug: n.data.slug, x: Math.round(n.position.x), y: Math.round(n.position.y), ...(n.data.ecommerce ? { ecommerce: true } : {}), ...(n.data.role ? { role: n.data.role } : {}), ...(n.data.notes ? { notes: n.data.notes } : {}), ...(n.data.mind ? { mind: n.data.mind } : {}), ...(n.data.minds ? { minds: n.data.minds } : {}), ...(n.data.bindings?.length ? { bindings: n.data.bindings } : {}) })),
  edges: edges.map((e) => ({ id: e.id, from: e.source, to: e.target })),
  ...(ends.goal ? { goal: ends.goal } : {}), ...(ends.notes ? { notes: ends.notes } : {}), ...(ends.ended ? { ended: true } : {}),
  ...(ends.overseer ? { overseer: ends.overseer } : {}), ...(ends.team?.minds.length ? { team: ends.team } : {}),
});
const shape = (f: Flow) => JSON.stringify([f.name, f.goal ?? "", f.notes ?? "", f.overseer ?? "", f.team ?? null, f.customMinds ?? [], f.customSkills ?? [], f.nodes.map((n) => [n.id, n.slug, n.x, n.y, !!n.ecommerce, n.role ?? "", n.notes ?? "", n.mind ?? "", n.minds ?? []]), f.edges.map((e) => [e.from, e.to])]);
const sameFlow = (a: Flow, b: Flow) => shape(a) === shape(b);
function chain(c: Catalogue, slugs: string[], start = { x: 40, y: 110 }) {
  const nodes: BlockNode[] = slugs.map((slug, i) => ({ id: uid(), type: "block", position: { x: start.x + (i % 3) * 360, y: start.y + Math.floor(i / 3) * 190 }, data: { slug } }));
  const edges: FlowEdgeT[] = wireSteps(c, slugs).map(([a, b]) => ({ id: uid(), source: nodes[a].id, target: nodes[b].id, type: "flow" }));
  return { nodes, edges };
}

function useMedia(q: string) {
  const [m, setM] = useState(() => typeof matchMedia !== "undefined" && matchMedia(q).matches);
  useEffect(() => {
    const mq = matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [q]);
  return m;
}

function PalItem({ b, why, onAdd }: { b: Block; why?: string; onAdd: (slug: string) => void }) {
  return (
    <div className="pal-item" data-slug={b.slug} draggable onDragStart={(e) => { e.dataTransfer.setData("application/abb-block", b.slug); e.dataTransfer.effectAllowed = "move"; }} title="Drag onto the canvas">
      <div style={{ minWidth: 0 }}><b>{b.name}</b><small>{why ?? b.summary}</small></div>
      <button className="add" aria-label={`Add ${b.name}`} onClick={() => onAdd(b.slug)}>+</button>
    </div>
  );
}

/** How many blocks the palette draws at a time. */
const PALETTE_PAGE = 60;

function Palette({ c, anchor, inFlow, onAdd, onTemplate, onPlan, showGoal }: {
  c: Catalogue; anchor: string | null; inFlow: Set<string>; onAdd: (slug: string) => void; onTemplate: (b: Block) => void; onPlan: (goal: string) => boolean; showGoal: boolean;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"next" | "all" | "kits">("next");
  const userKits = useStore((s) => s.kits);
  // The search text is built once per block, and the list follows the typing a beat behind, so thousands of blocks stay quick.
  const hays = useMemo(() => new Map(c.blocks.map((b) => [b.slug, `${b.name} ${b.slug} ${b.summary} ${b.headline} ${taskOf(b).name}`.toLowerCase()])), [c]);
  const dq = useDeferredValue(q);
  const [limit, setLimit] = useState(PALETTE_PAGE);
  useEffect(() => setLimit(PALETTE_PAGE), [dq, cat]);
  const list = useMemo(() => {
    const words = dq.toLowerCase().split(/\s+/).filter(Boolean);
    const kitSlugs = new Set(userKits.flatMap((k) => k.slugs));
    return c.blocks.filter((b) => b.category !== "orchestrator" && b.type !== "agent" &&
      (cat !== "kits" || kitSlugs.has(b.slug)) &&
      words.every((w) => hays.get(b.slug)!.includes(w)));
  }, [c, dq, cat, userKits, hays]);
  const groups = useMemo(() => TASKS.map((t) => ({ t, items: list.filter((b) => taskOf(b).id === t.id) })).filter((g) => g.items.length), [list]);
  const next = useMemo(() => suggestNext(c, anchor, inFlow), [c, anchor, inFlow]);
  const templates = c.blocks.filter((b) => b.category === "orchestrator");
  const showNext = cat === "next" && !q;
  return (
    <aside className="palette" aria-label="Blocks to add">
      <div className="palette-top">
        <label className="search"><SearchIcon /><span className="visually-hidden">Find a block</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a block" data-testid="palette-search" /></label>
        <div className="seg" role="group" aria-label="Show">
          {(["next", "all", "kits"] as const).map((k) => <button key={k} aria-pressed={cat === k} onClick={() => setCat(k)} data-testid={`palette-${k}`}>{k === "next" ? "Suggested" : k === "all" ? "All" : "My kits"}</button>)}
        </div>
      </div>
      <div className="palette-list">
        {showNext && (
          <div data-testid="suggestions">
            <div className="pal-group">{anchor && c.bySlug[anchor] ? <>Next after <b>{c.bySlug[anchor].name}</b></> : "Start with one of these"}</div>
            {next.map(({ b, why }) => <PalItem key={b.slug} b={b} why={why} onAdd={onAdd} />)}
            {next.length === 0 && <p className="small" style={{ padding: "8px" }}>Nothing obvious comes next. Its result may be ready to use, or try All.</p>}
            {showGoal && <><div className="pal-group">Or start again from a goal</div><GoalBox onPlan={onPlan} /></>}
            <div className="pal-group">Or start from a ready workflow</div>
            {templates.map((t) => <button key={t.slug} className="tpl" onClick={() => onTemplate(t)}>{t.name}<small>{t.steps.length} steps</small></button>)}
          </div>
        )}
        {!showNext && (() => {
          // Only the first `limit` blocks are drawn; "Show more" adds the next batch.
          let left = limit;
          return groups.map(({ t, items }) => {
            if (left <= 0) return null;
            const shown = items.slice(0, left);
            left -= shown.length;
            return (
              <div key={t.id}>
                <div className="pal-group">{t.name} · {items.length}</div>
                {shown.map((b) => <PalItem key={b.slug} b={b} onAdd={onAdd} />)}
              </div>
            );
          });
        })()}
        {!showNext && list.length > limit && <button className="btn btn-ghost btn-sm" style={{ margin: "8px" }} onClick={() => setLimit((n) => n + PALETTE_PAGE)} data-testid="palette-more">Show {Math.min(PALETTE_PAGE, list.length - limit)} more of {list.length - limit}</button>}
        {!showNext && list.length === 0 && <p className="small" style={{ padding: "16px 8px" }}>{cat === "kits" ? "Nothing saved yet. Open any skill and press Save to kit." : "No blocks match. Try another word."}</p>}
      </div>
    </aside>
  );
}

const typing = (t: EventTarget | null) => { const el = t as HTMLElement | null; return !!el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable); };

type BuilderProps = { c: Catalogue; toast: (m: string) => void; initialFlow?: Flow; onFlowChange?: (flow: Flow) => void };
function Stage({ c: baseCatalogue, toast, initialFlow, onFlowChange }: BuilderProps) {
  const saved = useStore((s) => s.flows);
  const narrow = useMedia("(max-width: 760px)");
  // A shared link (/?flow=...) opens as a new workflow; otherwise the one left open last time.
  const shareCode = useMemo(() => new URLSearchParams(location.search).get("flow"), []);
  const shared = useMemo(() => (shareCode ? unpackFlow(baseCatalogue, shareCode) : null), [baseCatalogue, shareCode]);
  const initial = useMemo(() => initialFlow ?? (shareCode ? shared : flows.draft()), [initialFlow, shared, shareCode]);
  const [flowId, setFlowId] = useState(initial?.id ?? uid());
  const [name, setName] = useState(initial?.name ?? "Untitled workflow");
  const [ends, setEnds] = useState<Ends>(endsOf(initial));
  const myMinds = useMyMinds();
  const mindProfiles = useMemo(() => [...(ends.customMinds ?? []), ...myMinds.filter(m => !ends.customMinds?.some(s => s.slug === m.slug))].slice(0, 12), [myMinds, ends.customMinds]);
  const c = useMemo(() => withCustomMinds(withCustomSkills(baseCatalogue, ends.customSkills), mindProfiles), [baseCatalogue, ends.customSkills, mindProfiles]);
  const [replacing, setReplacing] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const start = useMemo(() => (initial ? fromFlow(initial) : { nodes: [], edges: [] }), [initial]);
  const [nodes, setNodes, onNodesChange] = useNodesState<BlockNode>(start.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdgeT>(start.edges);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const refit = () => setTimeout(() => fitView({ padding: 0.2, duration: 300, maxZoom: 1 }), 60);
  const box = useRef<HTMLDivElement>(null);
  const [inspect, setInspect] = useState<string | null>(null);
  const [needsOpen, setNeedsOpen] = useState(false);
  const [more, setMore] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!more) return;
    const off = (e: Event) => { if (!moreRef.current?.contains(e.target as Element)) setMore(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setMore(false); };
    document.addEventListener("pointerdown", off);
    window.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", off); window.removeEventListener("keydown", esc); };
  }, [more]);

  useEffect(() => {
    if (!shareCode) return;
    setSearch({ flow: "" });
    toast(shared ? `Opened “${shared.name}”, ${shared.nodes.length} steps. Press Save to keep it.` : "That workflow link is broken or out of date.");
    if (shared) setTimeout(() => box.current?.scrollIntoView({ block: "start" }), 120);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Full screen: the browser's own where it exists, otherwise the builder fills the window.
  const [full, setFull] = useState(false);
  useEffect(() => {
    const sync = () => { setFull(document.fullscreenElement === box.current); refit(); };
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!full || document.fullscreenElement) return;
    document.documentElement.classList.add("no-scroll");
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setFull(false); };
    window.addEventListener("keydown", esc);
    return () => { document.documentElement.classList.remove("no-scroll"); window.removeEventListener("keydown", esc); };
  }, [full]);
  const toggleFull = async () => {
    const el = box.current;
    if (!el) return;
    if (document.fullscreenElement) { await document.exitFullscreen().catch(() => {}); return; }
    if (full) { setFull(false); refit(); return; }
    if (el.requestFullscreen) { try { await el.requestFullscreen(); return; } catch { /* fall back below */ } }
    setFull(true); refit();
  };

  const load = (f: Flow) => { const g = fromFlow(f); setFlowId(f.id); setName(f.name); setEnds(endsOf(f)); setNodes(g.nodes); setEdges(g.edges); setInspect(null); refit(); };

  // Blocks, workflows and kits sent here from anywhere on the page.
  useEffect(() => {
    const take = () => {
      const q = takeQueued();
      const known = q.slugs.filter((s) => c.bySlug[s]);
      if (!known.length) return;
      if (q.name) {
        const g = chain(c, known);
        setFlowId(uid()); setName(q.name); setEnds(endsOf(flowFrom(c, q.name, known))); setNodes(g.nodes); setEdges(g.edges);
      } else {
        const maxY = nodesRef.current.reduce((m, n) => Math.max(m, n.position.y), -80);
        const added = chain(c, known, { x: 40, y: maxY + 190 });
        setNodes((ns) => [...ns, ...added.nodes]);
        setEdges((es) => [...es, ...added.edges]);
      }
      refit();
    };
    take();
    window.addEventListener(QUEUED, take);
    return () => window.removeEventListener(QUEUED, take);
  }, [c]); // eslint-disable-line react-hooks/exhaustive-deps

  const flow = useMemo(() => { const next = toFlow(flowId, name, nodes, edges, ends); return { ...next, customMinds: assignedCustomMinds(next, mindProfiles) }; }, [flowId, name, nodes, edges, ends, mindProfiles]);
  useEffect(() => { onFlowChange?.(flow); }, [flow, onFlowChange]);
  const order = useMemo(() => orderFlow(flow), [flow]);
  const mismatched = useMemo(() => new Set(typeMismatches(c, flow)), [c, flow]);
  const savedVersion = saved.find((f) => f.id === flowId);
  const isSaved = !!savedVersion && sameFlow(savedVersion, flow);

  // Keep the open workflow as the person works, and once more if the page closes before the pause is up.
  const pending = useRef<Flow | null>(null);
  useEffect(() => {
    pending.current = flow;
    const t = setTimeout(() => { flows.keep(flow); pending.current = null; }, 350);
    return () => clearTimeout(t);
  }, [flow]);
  useEffect(() => {
    const flush = () => { if (pending.current) { flows.keep(pending.current); pending.current = null; } };
    window.addEventListener("pagehide", flush);
    return () => { window.removeEventListener("pagehide", flush); flush(); };
  }, []);
  // Saving adds the End node, wired to every last step.
  const teamSize = ends.team?.minds.length ?? 0;
  const canRun = nodes.length > 0 || teamSize > 0;
  const save = () => { flows.save({ ...flow, name: name.trim() || "Untitled workflow", ended: true }); setEnds((e) => ({ ...e, ended: true })); toast(`Saved “${name.trim() || "Untitled workflow"}”. Open it again from Saved workflows.`); };

  // Undo and redo: a snapshot of the steps and connections once each change settles.
  const snap = useMemo(() => JSON.stringify([flow.nodes, flow.edges]), [flow]);
  const snapRef = useRef(snap);
  snapRef.current = snap;
  const hist = useRef({ past: [] as string[], present: "", future: [] as string[] });
  const [, setVer] = useState(0);
  const record = (s: string) => {
    const h = hist.current;
    if (!h.present) { h.present = s; return; }
    if (s === h.present) return;
    h.past = [...h.past.slice(-99), h.present]; h.present = s; h.future = [];
    setVer((v) => v + 1);
  };
  // A different workflow starts a fresh history from how it opened.
  useEffect(() => { hist.current = { past: [], present: snapRef.current, future: [] }; setVer((v) => v + 1); }, [flowId]);
  useEffect(() => { const t = setTimeout(() => record(snap), 400); return () => clearTimeout(t); }, [snap]); // eslint-disable-line react-hooks/exhaustive-deps
  const restore = (s: string) => { const [n, e] = JSON.parse(s); const g = fromFlow({ nodes: n, edges: e }); setNodes(g.nodes); setEdges(g.edges); };
  const undo = () => {
    record(snapRef.current);
    const h = hist.current;
    const prev = h.past.pop();
    if (prev === undefined) return;
    h.future.push(h.present); h.present = prev; restore(prev); setVer((v) => v + 1);
  };
  const redo = () => {
    record(snapRef.current);
    const h = hist.current;
    const next = h.future.pop();
    if (next === undefined) return;
    h.past.push(h.present); h.present = next; restore(next); setVer((v) => v + 1);
  };
  const edit: Edit = { undo, redo, canUndo: hist.current.past.length > 0 || (!!hist.current.present && snap !== hist.current.present), canRedo: hist.current.future.length > 0 };
  const keys = useRef(edit);
  keys.current = edit;
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (!(e.ctrlKey || e.metaKey) || (k !== "z" && k !== "y") || typing(e.target)) return;
      const el = box.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!el.contains(document.activeElement) && !(r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4)) return;
      e.preventDefault();
      if (k === "y" || e.shiftKey) keys.current.redo(); else keys.current.undo();
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);

  // Preview: each step lights up in run order, and 0s and 1s carry its result along the connections.
  const [run, setRun] = useState(0);
  const [runStep, setRunStep] = useState(0);
  const [samples, setSamples] = useState<Record<string, string>>({});
  const timers = useRef<number[]>([]);
  const stopRun = () => { timers.current.forEach(clearTimeout); timers.current = []; setRun(0); setRunStep(0); };
  useEffect(() => stopRun, []);
  const preview = async () => {
    if (run) { stopRun(); return; }
    if (!order?.length) { toast(order ? "Add a step first." : "This workflow loops back on itself. Remove one connection first."); return; }
    setInspect(null);
    // Each step shows the first lines of what it hands back, so you see what you'd get.
    const pages = await Promise.all(order.map((o) => loadPage(o.node.slug)));
    setSamples(Object.fromEntries(order.map((o, i) => [o.node.slug, sampleOf(pages[i]?.output_shape)])));
    setRun(Date.now()); setRunStep(1);
    order.forEach((_, i) => { if (i) timers.current.push(window.setTimeout(() => setRunStep(i + 1), i * STEP_S * 1000)); });
    timers.current.push(window.setTimeout(() => { stopRun(); toast("That's the order your AI runs it in, with a real result from each step. Each one hands its work to the next."); }, (order.length * STEP_S + 0.4) * 1000));
  };

  const anchorNode = nodes.find((n) => n.selected) ?? nodes[nodes.length - 1];
  const anchor = anchorNode?.data.slug ?? null;
  const inFlow = useMemo(() => new Set(nodes.map((n) => n.data.slug)), [nodes]);
  const stepOf = useMemo(() => Object.fromEntries((order ?? []).map((o) => [o.node.id, o.step])), [order]);
  const leads = useMemo(() => (order ? leadsOf(c, flow, order) : {}), [c, flow, order]);
  const viewNodes = useMemo(() => nodes.map((n) => {
    const step = stepOf[n.id];
    const lead = step ? leads[step] : undefined;
    const want = { step, run: run || undefined, delay: run && step ? (step - 1) * STEP_S : undefined, lead: lead?.mind, leadTeam: lead?.from === "team" || undefined };
    return n.data.step === want.step && n.data.run === want.run && n.data.delay === want.delay && n.data.lead === want.lead && n.data.leadTeam === want.leadTeam ? n : { ...n, data: { ...n.data, ...want } };
  }), [nodes, stepOf, run, leads]);
  const crewLine = [teamSize ? `Team of ${teamSize}` : "", ends.overseer ? `Overseer: ${mindName(c, ends.overseer)}` : ""].filter(Boolean).join(". ");
  const finalsNow = useMemo(() => (order ? finalOutputs(c, flow, order) : []), [c, flow, order]);
  const showEnd = ends.ended && nodes.length > 0;
  // React Flow measures every node it draws; Start and End aren't in the saved nodes, so their sizes are kept here.
  const [termSize, setTermSize] = useState<Record<string, { width: number; height: number }>>({});
  const allNodes = useMemo((): (BlockNode | EndNode)[] => {
    const into = new Set(edges.map((e) => e.target)), outOf = new Set(edges.map((e) => e.source));
    const avgY = (ns: BlockNode[]) => (ns.length ? ns.reduce((s, n) => s + n.position.y, 0) / ns.length : 110);
    const xs = nodes.map((n) => n.position.x);
    const goal = ends.goal.trim();
    const start: EndNode = { id: START, type: "terminal", draggable: false, deletable: false, connectable: false, measured: termSize[START],
      position: { x: (xs.length ? Math.min(...xs) : 240) - 220, y: avgY(nodes.filter((n) => !into.has(n.id))) + 18 },
      data: { which: "start", line: goal ? (goal.length > 42 ? `${goal.slice(0, 40)}…` : goal) : "Say what it's for", crew: crewLine || undefined } };
    const end: EndNode = { id: END, type: "terminal", draggable: false, deletable: false, connectable: false, measured: termSize[END],
      position: { x: Math.max(...xs, 0) + 320, y: avgY(nodes.filter((n) => !outOf.has(n.id))) + 18 },
      data: { which: "end", line: finalsNow.length ? `Hands back ${finalsNow.length} thing${finalsNow.length > 1 ? "s" : ""}` : "What you get" } };
    return [start, ...viewNodes, ...(showEnd ? [end] : [])];
  }, [nodes, edges, viewNodes, ends.goal, showEnd, finalsNow, termSize, crewLine]);
  const liveNode = run && order ? order[runStep - 1]?.node : undefined;
  const liveSample = liveNode ? samples[liveNode.slug] : "";
  const viewEdges = useMemo(() => {
    const slugOf = Object.fromEntries(nodes.map((n) => [n.id, n.data.slug]));
    return edges.map((e): FlowEdgeT => ({
      ...e, type: "flow", className: mismatched.has(e.id) ? "mismatch" : undefined,
      data: { label: passLabel(c, slugOf[e.source], slugOf[e.target]), mismatch: mismatched.has(e.id), run: run || undefined, delay: ((stepOf[e.source] ?? 1) - 1) * STEP_S + 0.3 },
    }));
  }, [c, nodes, edges, mismatched, run, stepOf]);

  const allEdges = useMemo(() => {
    const into = new Set(edges.map((e) => e.target)), outOf = new Set(edges.map((e) => e.source));
    const fixed = (id: string, source: string, target: string): FlowEdgeT => ({ id, source, target, type: "flow", deletable: false, selectable: false, className: "end-edge", data: {} });
    return [
      ...nodes.filter((n) => !into.has(n.id)).map((n) => fixed(`__s${n.id}`, START, n.id)),
      ...viewEdges,
      ...(showEnd ? nodes.filter((n) => !outOf.has(n.id)).map((n) => fixed(`__e${n.id}`, n.id, END)) : []),
    ];
  }, [nodes, edges, viewEdges, showEnd]);
  const fixedId = (id: string) => id.startsWith("__");
  const onConnect = useCallback((conn: Connection) => {
    if (conn.source === conn.target || fixedId(conn.source) || fixedId(conn.target)) return;
    setEdges((es) => (es.some((e) => e.source === conn.source && e.target === conn.target) ? es : addEdge({ ...conn, id: uid(), type: "flow" }, es)));
  }, [setEdges]);
  const addNext = (slug: string) => {
    const last = anchorNode;
    const id = uid();
    const pos = last ? { x: last.position.x + 360, y: last.position.y + (nodes.some((n) => n.position.x === last.position.x + 360 && Math.abs(n.position.y - last.position.y) < 40) ? 190 : 0) } : { x: 40, y: 110 };
    setNodes((ns) => [...ns, { id, type: "block", position: pos, data: { slug } }]);
    if (last) setEdges((es) => [...es, { id: uid(), source: last.id, target: id, type: "flow" }]);
    toast(`${c.bySlug[slug]?.name ?? slug} added${last ? " and connected" : ""}`);
    refit();
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const slug = e.dataTransfer.getData("application/abb-block");
    if (slug) setNodes((ns) => [...ns, { id: uid(), type: "block", position: screenToFlowPosition({ x: e.clientX - 120, y: e.clientY - 36 }), data: { slug } }]);
  };
  const loadTemplate = (t: Block) => load(flowFrom(c, t.name, workflowEntries(t).filter((s) => c.bySlug[s])));
  const planGoal = (goal: string) => {
    // The reviewed free methods carry checks and handoff notes into the old canvas too.
    if (/landing\s*page|homepage|\bn8n\b|\bhir(e|ing)\b|\bseo\b|\bdashboard\b|welcome.*email|support.*(backlog|ticket)/i.test(goal)) {
      try {
        const plan = finalize(c, freeSelection(c, goal), "free");
        const composed = compositionFlow(c, plan, goal);
        composed.name = goal.trim().replace(/^./, m => m.toUpperCase()).slice(0, 80);
        load(composed); toast(`Laid out ${plan.steps.length} steps with checks and handoff instructions.`); return true;
      } catch { return false; }
    }
    const p = planFromGoal(c, goal);
    if (!p) return false;
    load(flowFrom(c, p.name, p.slugs));
    toast(`Laid out ${p.slugs.length} step${p.slugs.length > 1 ? "s" : ""}${"workflow" in p.from ? `, from the ready workflow “${p.from.workflow.name}”` : ""}. ${narrow ? "Tap" : "Click"} a step to see what it does.`);
    return true;
  };
  const tidyUp = () => {
    const t = tidy(flow);
    if (!t) { toast("This workflow loops back on itself. Remove one connection first."); return; }
    setNodes(fromFlow(t).nodes.map((n) => ({ ...n, selected: nodes.find((x) => x.id === n.id)?.selected })));
    refit();
  };
  const setNotes = useCallback((id: string, patch: { role?: string; notes?: string; mind?: string; minds?: string[] }) => {
    setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)));
  }, [setNodes]);
  const actions = useMemo(() => ({
    remove: (id: string) => { setNodes((ns) => ns.filter((n) => n.id !== id)); setEdges((es) => es.filter((e) => e.source !== id && e.target !== id)); },
  }), [setNodes, setEdges]);
  const moveStep = (from: number, to: number) => {
    if (!order || to < 0 || to >= order.length) return;
    const steps = order.map((o) => ({ id: o.node.id, slug: o.node.slug }));
    const [s] = steps.splice(from, 1);
    steps.splice(to, 0, s);
    const g = fromFlow(applySteps(c, flow, name, steps, true));
    setNodes(g.nodes); setEdges(g.edges);
  };
  const newFlow = () => { stopRun(); setFlowId(uid()); setName("Untitled workflow"); setEnds(endsOf(null)); setNodes([]); setEdges([]); setInspect(null); flows.open(null); };
  const openFlow = (id: string) => { const f = flows.get(id); if (!f) return; stopRun(); load(f); flows.open(f.id); };
  const share = async () => {
    let url: string;
    try { url = shareUrl({ ...flow, name: name.trim() || "Shared workflow" }); if (url.length > 16000) throw Error("This workflow is too large for a link. Download its pack to share the custom skill files."); } catch (e) { toast((e as Error).message); return; }
    try {
      if (narrow && navigator.share) { await navigator.share({ title: name, url }); return; }
      await navigator.clipboard.writeText(url);
      toast("Link copied. Anyone who opens it gets these steps in their builder.");
    } catch (e) {
      if ((e as Error).name !== "AbortError") window.prompt("Copy this link", url);
    }
  };
  // Saves this workflow into the person's space (src/lib/space.ts), so their team sees it through the space link.
  const toSpace = async () => {
    if (flow.customSkills?.length || flow.customMinds?.length) { toast("This workflow has custom skills or minds. Download its pack to share all their instructions."); return; }
    if (!spaceKey()) { toast("Make your space first. It's free and takes one click."); window.location.assign("/space"); return; }
    const title = name.trim() || "Untitled workflow";
    try {
      await spaces.add({ kind: "workflow", title, summary: `${nodes.length} steps`, data: { name: title, nodes: flow.nodes, edges: flow.edges, goal: flow.goal, notes: flow.notes, localId: flowId } });
      toast(`Saved “${title}” to your space`);
    } catch (e) { toast(e instanceof Error ? e.message : "That didn't save. Try again."); }
  };
  const exportPack = async () => {
    const r = await buildHandoffZip(c, flow, getBusiness());
    if ("error" in r) { toast(r.error); return false; }
    download(r.blob, r.filename);
    return true;
  };
  const askDownload = () => { if (!order) { toast("This workflow loops back on itself. Remove one connection so it runs from start to finish."); return; } setNeedsOpen(true); };
  const needs = useMemo(() => (needsOpen && order ? needsOf(c, order) : []), [c, needsOpen, order]);
  const finals = useMemo(() => (needsOpen && order ? finalOutputs(c, flow, order) : []), [c, needsOpen, flow, order]);

  const status = run && order
    ? { warn: false, text: `Step ${runStep} of ${order.length}: ${c.bySlug[order[runStep - 1]?.node.slug]?.name ?? ""}` }
    : !nodes.length ? null
    : !order ? { warn: true, text: "This workflow loops back on itself. Remove one connection." }
    : mismatched.size ? { warn: true, text: `${nodes.length} blocks · ${mismatched.size} connection${mismatched.size > 1 ? "s" : ""} where the types don't match (dashed)` }
    : { warn: false, text: `${nodes.length} block${nodes.length > 1 ? "s" : ""} · runs in ${order.length} step${order.length > 1 ? "s" : ""} · ${isSaved ? "saved" : savedVersion ? "changes not saved" : "not saved yet"}` };
  const listOrder = order ?? flow.nodes.map((n, i) => ({ node: n, step: i + 1, from: [] }));
  const bottom = (
    <div className="stage-foot">
      {nodes.length > 0 && <button className={`btn btn-sm ${run ? "btn-dark" : "btn-ghost"} preview-btn`} onClick={preview} data-testid="preview">{run ? "Stop" : "Preview"}</button>}
      {status && <div className={`stage-status${status.warn ? " warn" : ""}`} data-testid="flow-status" aria-live="polite">{status.text}</div>}
    </div>
  );

  return (
    <CatalogueCtx.Provider value={c}><NodeActions.Provider value={actions}>
      {shareCode && !shared && <p className="workflow-import-error" role="alert">This shared workflow is incomplete or invalid. No steps were imported. Ask for a complete workflow.</p>}
      <div className={`builder${full ? " full" : ""}${narrow ? " list" : ""}${run ? " previewing" : ""}`} ref={box} data-testid="builder">
        <Palette c={c} anchor={anchor} inFlow={inFlow} onAdd={addNext} onTemplate={loadTemplate} onPlan={planGoal} showGoal={nodes.length > 0} />
        <div className="stage" onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }} onDrop={onDrop}>
          <div className="stage-bar">
            <input className="flow-name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Workflow name" />
            <span className="spacer" />
            <button className="btn btn-ghost btn-sm" onClick={save} disabled={!canRun || isSaved} data-testid="save-flow">{isSaved ? "Saved" : "Save"}</button>
            <div className="bar-more" ref={moreRef}>
              <button className="btn btn-ghost btn-sm bar-more-btn" aria-expanded={more} aria-haspopup="true" onClick={() => setMore(!more)} data-testid="bar-more">More</button>
              <div className={`bar-extra${more ? " open" : ""}`} onClick={(e) => { if ((e.target as HTMLElement).closest("button")) setMore(false); }}>
                {saved.length > 0 && (
                  <select className="select" value={savedVersion ? flowId : ""} onChange={(e) => { openFlow(e.target.value); setMore(false); }} aria-label="Open a saved workflow" data-testid="saved-flows">
                    <option value="" disabled>Saved workflows</option>
                    {saved.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                )}
                <button className="btn btn-ghost btn-sm" onClick={share} disabled={!nodes.length} data-testid="share-flow">Share</button>
                <button className="btn btn-ghost btn-sm" onClick={toSpace} disabled={!nodes.length} data-testid="flow-to-space">Save to my space</button>
                <button className="btn btn-ghost btn-sm" onClick={newFlow}>New</button>
                {savedVersion && <button className="btn btn-ghost btn-sm" onClick={() => { if (confirm(`Delete "${name}"?`)) { flows.remove(flowId); newFlow(); } }}>Delete</button>}
              </div>
            </div>
            <button className="btn btn-primary btn-sm" onClick={askDownload} disabled={!canRun} data-testid="download-handoff">Download the workflow</button>
          </div>
          {canRun && !onFlowChange && <ExecutionPrompt name={flow.name} goal={flow.goal} />}
          {narrow ? (
            <div className="stage-list">
              {nodes.length > 0 && (
                <div className="list-tools">
                  <button className="icon-btn" onClick={undo} disabled={!edit.canUndo} aria-label="Undo" data-testid="view-undo"><Ico d={UNDO} /></button>
                  <button className="icon-btn" onClick={redo} disabled={!edit.canRedo} aria-label="Redo" data-testid="view-redo"><Ico d={REDO} /></button>
                  <span className="small">Steps run top to bottom. Use the arrows to reorder.</span>
                </div>
              )}
              <button className="sl-end" onClick={() => setInspect(START)} data-testid="list-start"><b>Start</b><small>{ends.goal.trim() || "Tap to say what it's for"}{crewLine ? `. ${crewLine}` : ""}</small></button>
              {nodes.length ? <StepList c={c} order={listOrder} selectedId={inspect} leads={leads} run={run} live={run ? runStep : 0} samples={samples} onOpen={setInspect} onMove={moveStep} onRemove={actions.remove} /> : (
                <div className="list-empty"><GoalBox onPlan={planGoal} big /><p className="small">Or press + on a suggestion above, or pick a ready workflow.</p><button className="link-btn" onClick={() => setInspect(START)} data-testid="empty-team">Or hand the whole job to a team of minds</button></div>
              )}
              {showEnd && <button className="sl-end" onClick={() => setInspect(END)} data-testid="list-end"><b>End</b><small>{finalsNow.length ? `Hands back ${finalsNow.join(", ").toLowerCase()}` : "What you get"}</small></button>}
              {bottom}
            </div>
          ) : (
            <>
              <ReactFlow
                nodes={allNodes} edges={allEdges} nodeTypes={nodeTypes} edgeTypes={edgeTypes}
                onNodesChange={(ch) => {
                  for (const x of ch) if (x.type === "dimensions" && fixedId(x.id) && x.dimensions) { const d = x.dimensions; setTermSize((s) => (s[x.id]?.width === d.width && s[x.id]?.height === d.height ? s : { ...s, [x.id]: d })); }
                  onNodesChange(ch.filter((x) => !("id" in x) || !fixedId(x.id)) as Parameters<typeof onNodesChange>[0]);
                }}
                onEdgesChange={(ch) => onEdgesChange(ch.filter((x) => !("id" in x) || !fixedId(x.id)))} onConnect={onConnect} onNodeContextMenu={(e, n) => { if (n.type === "block") { e.preventDefault(); setContextMenu({ id: n.id, x: e.clientX, y: e.clientY }); } }} onNodeClick={(_, n) => setInspect(n.id)} onPaneClick={() => setInspect(null)}
                fitView fitViewOptions={{ padding: 0.3, maxZoom: 1 }} minZoom={0.3} maxZoom={1.6} preventScrolling={false}
                defaultEdgeOptions={{ type: "flow" }} deleteKeyCode={["Backspace", "Delete"]} proOptions={{ hideAttribution: true }}
              >
                <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} />
                <ViewControls full={full} onFull={toggleFull} edit={edit} onTidy={tidyUp} />
              </ReactFlow>
              {!nodes.length && inspect !== START && (
                <div className="stage-empty">
                  <div>
                    <h3 className="h3">Say what you want, and get the steps</h3>
                    <GoalBox onPlan={planGoal} big />
                    <p className="small">Or drag a block here, press + on a suggestion, or start from a ready workflow on the left.</p>
                    <button className="link-btn" onClick={() => setInspect(START)} data-testid="empty-team">{teamSize ? `Your team of ${teamSize} is set. Open Start to change it` : "Or hand the whole job to a team of minds"}</button>
                  </div>
                </div>
              )}
              {liveNode && liveSample && <Sample key={runStep} text={liveSample} name={c.bySlug[liveNode.slug]?.name ?? ""} step={runStep} />}
              {bottom}
            </>
          )}
          {inspect === START ? <StartPanel c={c} goal={ends.goal} notes={ends.notes} overseer={ends.overseer ?? ""} team={ends.team} onChange={(p: StartPatch) => setEnds((e) => ({ ...e, ...p }))} onClose={() => setInspect(null)} />
            : inspect === END ? <EndPanel finals={finalsNow} onClose={() => setInspect(null)} />
            : inspect && <StepPanel c={c} flow={flow} order={order} nodeId={inspect} onClose={() => setInspect(null)} onRemove={actions.remove} onReplace={setReplacing} onNotes={setNotes} />}
        </div>
      </div>
      {needsOpen && <DownloadDialog name={name} goal={flow.goal} zip={zipName(name)} needs={needs} finals={finals} onDownload={exportPack} onClose={() => setNeedsOpen(false)} />}
      {contextMenu && <ReplaceMenu x={contextMenu.x} y={contextMenu.y} onClose={() => setContextMenu(null)} onReplace={() => { setReplacing(contextMenu.id); setContextMenu(null); }} />}
      {replacing && flow.nodes.some(n => n.id === replacing) && <SkillReplace c={c} slug={flow.nodes.find(n => n.id === replacing)!.slug} goal={flow.goal ?? flow.name} before={(order ?? []).filter(o => o.step < (order?.find(o => o.node.id === replacing)?.step ?? 0)).map(o => o.node.slug)} after={(order ?? []).filter(o => o.step > (order?.find(o => o.node.id === replacing)?.step ?? 0)).map(o => o.node.slug)} customSkills={ends.customSkills ?? []} onClose={() => setReplacing(null)} onChoose={(slug, customSkills) => {
        setEnds(e => ({ ...e, customSkills }));
        setNodes(fromFlow(replaceFlowSkill(c, flow, replacing, slug, customSkills)).nodes);
        toast("Skill replaced. Review retained notes and the updated input/output connections.");
      }} />}
    </NodeActions.Provider></CatalogueCtx.Provider>
  );
}

export default function Builder({ c, toast, initialFlow, onFlowChange }: BuilderProps) {
  return (
    <CatalogueCtx.Provider value={c}>
      <ReactFlowProvider><Stage c={c} toast={toast} initialFlow={initialFlow} onFlowChange={onFlowChange} /></ReactFlowProvider>
    </CatalogueCtx.Provider>
  );
}
