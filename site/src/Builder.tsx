import { createContext, memo, useCallback, useContext, useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
  Background, BackgroundVariant, Controls, Handle, Position, ReactFlow, ReactFlowProvider, addEdge, useEdgesState, useNodesState, useReactFlow,
  type Connection, type Edge, type Node, type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/base.css";
import { SearchIcon } from "./ui";
import { type Block, type Catalogue, KINDS, TASKS, kindOf, portLabel, taskOf, wireSteps } from "./lib/data";
import { suggestNext } from "./lib/suggest";
import { type Flow, QUEUED, flows, takeQueued, uid, useStore } from "./lib/store";
import { buildHandoffZip, download, orderFlow, typeMismatches } from "./lib/handoff";

type NodeData = { slug: string; ecommerce?: boolean; step?: number };
type BlockNode = Node<NodeData, "block">;
const CatalogueCtx = createContext<Catalogue | null>(null);
const NodeActions = createContext<{ remove: (id: string) => void; toggleEcom: (id: string) => void }>({ remove: () => {}, toggleEcom: () => {} });

const BlockNodeView = memo(function BlockNodeView({ id, data }: NodeProps<BlockNode>) {
  const c = useContext(CatalogueCtx);
  const act = useContext(NodeActions);
  const b = c?.bySlug[data.slug];
  return (
    <div className="node" data-testid="flow-node">
      <Handle type="target" position={Position.Left} />
      <div className="top">{b ? <span className="kind">{KINDS.find((k) => k.id === kindOf(b))!.name}</span> : <span className="small">Missing block</span>}<span className="step-n">{data.step ? `Step ${data.step}` : ""}</span></div>
      <div className="nm">{b?.name ?? data.slug}</div>
      {b && (
        <div className="io">
          <div><b>In</b> {b.inputs.map((p) => portLabel(p.type)).join(", ") || "your request"}</div>
          <div><b>Out</b> {b.outputs.map((p) => portLabel(p.type)).join(", ") || "see skill"}</div>
        </div>
      )}
      <button className="x nodrag" aria-label="Remove block" onClick={() => act.remove(id)}>×</button>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});
const nodeTypes = { block: BlockNodeView };

const toFlow = (id: string, name: string, nodes: BlockNode[], edges: Edge[]): Flow => ({
  id, name, updated: Date.now(),
  nodes: nodes.map((n) => ({ id: n.id, slug: n.data.slug, x: Math.round(n.position.x), y: Math.round(n.position.y), ecommerce: !!n.data.ecommerce })),
  edges: edges.map((e) => ({ id: e.id, from: e.source, to: e.target })),
});
const fromFlow = (f: Flow) => ({
  nodes: f.nodes.map((n): BlockNode => ({ id: n.id, type: "block", position: { x: n.x, y: n.y }, data: { slug: n.slug, ecommerce: n.ecommerce } })),
  edges: f.edges.map((e): Edge => ({ id: e.id, source: e.from, target: e.to })),
});
function chain(c: Catalogue, slugs: string[], start = { x: 40, y: 110 }) {
  const nodes: BlockNode[] = slugs.map((slug, i) => ({ id: uid(), type: "block", position: { x: start.x + (i % 3) * 300, y: start.y + Math.floor(i / 3) * 190 }, data: { slug } }));
  const edges: Edge[] = wireSteps(c, slugs).map(([a, b]) => ({ id: uid(), source: nodes[a].id, target: nodes[b].id }));
  return { nodes, edges };
}

function PalItem({ b, why, onAdd }: { b: Block; why?: string; onAdd: (slug: string) => void }) {
  return (
    <div className="pal-item" data-slug={b.slug} draggable onDragStart={(e) => { e.dataTransfer.setData("application/abb-block", b.slug); e.dataTransfer.effectAllowed = "move"; }} title="Drag onto the canvas">
      <div style={{ minWidth: 0 }}><b>{b.name}</b><small>{why ?? b.summary}</small></div>
      <button className="add" aria-label={`Add ${b.name}`} onClick={() => onAdd(b.slug)}>+</button>
    </div>
  );
}

function Palette({ c, anchor, inFlow, onAdd, onTemplate }: { c: Catalogue; anchor: string | null; inFlow: Set<string>; onAdd: (slug: string) => void; onTemplate: (b: Block) => void }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"next" | "all" | "kits">("next");
  const userKits = useStore((s) => s.kits);
  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const kitSlugs = new Set(userKits.flatMap((k) => k.slugs));
    return c.blocks.filter((b) => b.category !== "orchestrator" &&
      (cat !== "kits" || kitSlugs.has(b.slug)) &&
      words.every((w) => `${b.name} ${b.slug} ${b.summary} ${b.headline} ${taskOf(b).name}`.toLowerCase().includes(w)));
  }, [c, q, cat, userKits]);
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
            <div className="pal-group">Or start from a ready workflow</div>
            {templates.map((t) => <button key={t.slug} className="tpl" onClick={() => onTemplate(t)}>{t.name}<small>{t.steps.length} steps</small></button>)}
          </div>
        )}
        {!showNext && TASKS.map((t) => {
          const items = list.filter((b) => taskOf(b).id === t.id);
          if (!items.length) return null;
          return (
            <div key={t.id}>
              <div className="pal-group">{t.name} · {items.length}</div>
              {items.map((b) => <PalItem key={b.slug} b={b} onAdd={onAdd} />)}
            </div>
          );
        })}
        {!showNext && list.length === 0 && <p className="small" style={{ padding: "16px 8px" }}>{cat === "kits" ? "Nothing saved yet. Open any skill and press Save to kit." : "No blocks match. Try another word."}</p>}
      </div>
    </aside>
  );
}

function Stage({ c, toast }: { c: Catalogue; toast: (m: string) => void }) {
  const saved = useStore((s) => s.flows);
  const initial = useMemo(() => flows.current(), []);
  const [flowId, setFlowId] = useState(initial?.id ?? uid());
  const [name, setName] = useState(initial?.name ?? "Untitled workflow");
  const start = useMemo(() => (initial ? fromFlow(initial) : { nodes: [], edges: [] }), [initial]);
  const [nodes, setNodes, onNodesChange] = useNodesState<BlockNode>(start.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(start.edges);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const nodesRef = useRef(nodes);
  nodesRef.current = nodes;
  const refit = () => setTimeout(() => fitView({ padding: 0.2, duration: 300, maxZoom: 1 }), 60);

  // Blocks, workflows and kits sent here from anywhere on the page.
  useEffect(() => {
    const take = () => {
      const q = takeQueued();
      const known = q.slugs.filter((s) => c.bySlug[s]);
      if (!known.length) return;
      if (q.name) {
        const g = chain(c, known);
        setFlowId(uid()); setName(q.name); setNodes(g.nodes); setEdges(g.edges);
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

  const flow = useMemo(() => toFlow(flowId, name, nodes, edges), [flowId, name, nodes, edges]);
  const order = useMemo(() => orderFlow(flow), [flow]);
  const mismatched = useMemo(() => new Set(typeMismatches(c, flow)), [c, flow]);
  // Save as the person works, and once more if the page closes before the pause is up.
  const pending = useRef<Flow | null>(null);
  useEffect(() => {
    if (!nodes.length && !saved.some((f) => f.id === flowId)) return;
    pending.current = flow;
    const t = setTimeout(() => { flows.save(flow); pending.current = null; }, 350);
    return () => clearTimeout(t);
  }, [flow]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const flush = () => { if (pending.current) { flows.save(pending.current); pending.current = null; } };
    window.addEventListener("pagehide", flush);
    return () => { window.removeEventListener("pagehide", flush); flush(); };
  }, []);

  const anchorNode = nodes.find((n) => n.selected) ?? nodes[nodes.length - 1];
  const anchor = anchorNode?.data.slug ?? null;
  const inFlow = useMemo(() => new Set(nodes.map((n) => n.data.slug)), [nodes]);
  const stepOf = useMemo(() => Object.fromEntries((order ?? []).map((o) => [o.node.id, o.step])), [order]);
  const viewNodes = useMemo(() => nodes.map((n) => (n.data.step === stepOf[n.id] ? n : { ...n, data: { ...n.data, step: stepOf[n.id] } })), [nodes, stepOf]);
  const viewEdges = useMemo(() => edges.map((e) => ({ ...e, className: mismatched.has(e.id) ? "mismatch" : undefined })), [edges, mismatched]);

  const onConnect = useCallback((conn: Connection) => {
    if (conn.source === conn.target) return;
    setEdges((es) => (es.some((e) => e.source === conn.source && e.target === conn.target) ? es : addEdge({ ...conn, id: uid() }, es)));
  }, [setEdges]);
  const addNext = (slug: string) => {
    const last = anchorNode;
    const id = uid();
    const pos = last ? { x: last.position.x + 300, y: last.position.y + (nodes.some((n) => n.position.x === last.position.x + 300 && Math.abs(n.position.y - last.position.y) < 40) ? 190 : 0) } : { x: 40, y: 110 };
    setNodes((ns) => [...ns, { id, type: "block", position: pos, data: { slug } }]);
    if (last) setEdges((es) => [...es, { id: uid(), source: last.id, target: id }]);
    toast(`${c.bySlug[slug]?.name ?? slug} added${last ? " and connected" : ""}`);
    refit();
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const slug = e.dataTransfer.getData("application/abb-block");
    if (slug) setNodes((ns) => [...ns, { id: uid(), type: "block", position: screenToFlowPosition({ x: e.clientX - 120, y: e.clientY - 36 }), data: { slug } }]);
  };
  const loadTemplate = (t: Block) => {
    const g = chain(c, t.steps.map((s) => s.uses).filter((s) => c.bySlug[s]));
    setFlowId(uid()); setName(t.name); setNodes(g.nodes); setEdges(g.edges); refit();
  };
  const actions = useMemo(() => ({
    remove: (id: string) => { setNodes((ns) => ns.filter((n) => n.id !== id)); setEdges((es) => es.filter((e) => e.source !== id && e.target !== id)); },
    toggleEcom: (id: string) => setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, ecommerce: !n.data.ecommerce } } : n))),
  }), [setNodes, setEdges]);
  const newFlow = () => { setFlowId(uid()); setName("Untitled workflow"); setNodes([]); setEdges([]); flows.open(null); };
  const openFlow = (id: string) => { const f = flows.get(id); if (!f) return; const g = fromFlow(f); setFlowId(f.id); setName(f.name); setNodes(g.nodes); setEdges(g.edges); flows.open(f.id); refit(); };
  const exportPack = async () => {
    const r = await buildHandoffZip(c, flow);
    if ("error" in r) { toast(r.error); return; }
    download(r.blob, r.filename);
    toast("Downloaded. Give the folder to Claude and say \"Follow HANDOFF.md\".");
  };
  const status = !nodes.length ? null
    : !order ? { warn: true, text: "This workflow loops back on itself. Remove one connection." }
    : mismatched.size ? { warn: true, text: `${nodes.length} blocks · ${mismatched.size} connection${mismatched.size > 1 ? "s" : ""} where the types don't match (dashed)` }
    : { warn: false, text: `${nodes.length} block${nodes.length > 1 ? "s" : ""} · runs in ${order.length} step${order.length > 1 ? "s" : ""} · saved in this browser` };

  return (
    <NodeActions.Provider value={actions}>
      <div className="builder" data-testid="builder">
        <Palette c={c} anchor={anchor} inFlow={inFlow} onAdd={addNext} onTemplate={loadTemplate} />
        <div className="stage" onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }} onDrop={onDrop}>
          <div className="stage-bar">
            <input className="flow-name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Workflow name" />
            {saved.length > 0 && (
              <select className="select" value={saved.some((f) => f.id === flowId) ? flowId : ""} onChange={(e) => openFlow(e.target.value)} aria-label="Open a saved workflow">
                <option value="" disabled>Saved workflows</option>
                {saved.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            )}
            <span className="spacer" />
            <button className="btn btn-ghost btn-sm" onClick={newFlow}>New</button>
            {saved.some((f) => f.id === flowId) && <button className="btn btn-ghost btn-sm" onClick={() => { if (confirm(`Delete "${name}"?`)) { flows.remove(flowId); newFlow(); } }}>Delete</button>}
            <button className="btn btn-primary btn-sm" onClick={exportPack} disabled={!nodes.length} data-testid="download-handoff">Download the workflow</button>
          </div>
          <ReactFlow
            nodes={viewNodes} edges={viewEdges} nodeTypes={nodeTypes}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
            fitView fitViewOptions={{ padding: 0.3, maxZoom: 1 }} minZoom={0.3} maxZoom={1.6} preventScrolling={false}
            defaultEdgeOptions={{ type: "smoothstep" }} deleteKeyCode={["Backspace", "Delete"]} proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} />
            <Controls showInteractive={false} position="bottom-right" />
          </ReactFlow>
          {!nodes.length && (
            <div className="stage-empty">
              <div>
                <h3 className="h3">Drag a block here to start</h3>
                <p className="small">Or press + on a suggestion, or start from a ready workflow on the left.<br />After each block, the left side suggests what usually comes next.</p>
              </div>
            </div>
          )}
          {status && <div className={`stage-status${status.warn ? " warn" : ""}`} data-testid="flow-status">{status.text}</div>}
        </div>
      </div>
    </NodeActions.Provider>
  );
}

export default function Builder({ c, toast }: { c: Catalogue; toast: (m: string) => void }) {
  return (
    <CatalogueCtx.Provider value={c}>
      <ReactFlowProvider><Stage c={c} toast={toast} /></ReactFlowProvider>
    </CatalogueCtx.Provider>
  );
}
