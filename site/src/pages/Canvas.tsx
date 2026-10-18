import { createContext, memo, useCallback, useContext, useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import {
  Background, BackgroundVariant, Controls, Handle, Position, ReactFlow, ReactFlowProvider, addEdge, useEdgesState, useNodesState, useReactFlow,
  type Connection, type Edge, type Node, type NodeProps,
} from "@xyflow/react";
import { RoleMark, SearchIcon, Toast, useTitle } from "../components";
import { type Block, type Catalogue, ROLES, portLabel, useCatalogue } from "../lib/data";
import { type Flow, flows, takeQueued, uid, useStore } from "../lib/store";
import { buildHandoffZip, download, orderFlow, typeMismatches } from "../lib/handoff";

type NodeData = { slug: string; ecommerce?: boolean; step?: number };
type BlockNode = Node<NodeData, "block">;
const CatalogueCtx = createContext<Catalogue | null>(null);
const NodeActions = createContext<{ remove: (id: string) => void; toggleEcom: (id: string) => void }>({ remove: () => {}, toggleEcom: () => {} });

const BlockNodeView = memo(function BlockNodeView({ id, data }: NodeProps<BlockNode>) {
  const c = useContext(CatalogueCtx);
  const act = useContext(NodeActions);
  const b = c?.bySlug[data.slug];
  return (
    <div className="node">
      <Handle type="target" position={Position.Left} />
      <div className="top">{b ? <RoleMark role={b.role} /> : "Missing block"}<span className="step-n">{data.step ? `Step ${data.step}` : ""}</span></div>
      <div className="nm">{b?.name ?? data.slug}</div>
      {b && (
        <div className="io">
          <div><b>In</b> {b.inputs.map((p) => portLabel(p.type)).join(", ") || "your request"}</div>
          <div><b>Out</b> {b.outputs.map((p) => portLabel(p.type)).join(", ") || "see skill"}</div>
        </div>
      )}
      {b?.addon && (
        <label className="eco nodrag"><input type="checkbox" checked={!!data.ecommerce} onChange={() => act.toggleEcom(id)} />Use the ecommerce add-on</label>
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
const fromFlow = (f: Flow): { nodes: BlockNode[]; edges: Edge[] } => ({
  nodes: f.nodes.map((n) => ({ id: n.id, type: "block", position: { x: n.x, y: n.y }, data: { slug: n.slug, ecommerce: n.ecommerce } })),
  edges: f.edges.map((e) => ({ id: e.id, source: e.from, target: e.to })),
});

/** Lays a list of blocks out left to right as a chain, wrapping every four. */
function chain(slugs: string[], start = { x: 40, y: 120 }) {
  const nodes: BlockNode[] = slugs.map((slug, i) => ({ id: uid(), type: "block", position: { x: start.x + (i % 4) * 310, y: start.y + Math.floor(i / 4) * 200 }, data: { slug } }));
  const edges: Edge[] = nodes.slice(1).map((n, i) => ({ id: uid(), source: nodes[i].id, target: n.id }));
  return { nodes, edges };
}

function Palette({ c, onAdd, onTemplate }: { c: Catalogue; onAdd: (slug: string) => void; onTemplate: (b: Block) => void }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | "general" | "ecommerce" | "kits">("all");
  const userKits = useStore((s) => s.kits);
  const list = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const kitSlugs = new Set(userKits.flatMap((k) => k.slugs));
    return c.blocks.filter((b) => b.category !== "orchestrator" &&
      (cat === "all" || (cat === "kits" ? kitSlugs.has(b.slug) : cat === "ecommerce" ? b.category === "ecommerce" || b.addon : b.category === cat)) &&
      words.every((w) => `${b.name} ${b.slug} ${b.summary}`.toLowerCase().includes(w)));
  }, [c, q, cat, userKits]);
  const templates = c.blocks.filter((b) => b.category === "orchestrator");
  const onDragStart = (e: DragEvent, slug: string) => { e.dataTransfer.setData("application/abb-block", slug); e.dataTransfer.effectAllowed = "move"; };
  return (
    <aside className="palette" aria-label="Blocks">
      <div className="palette-top">
        <label className="search"><SearchIcon /><span className="visually-hidden">Search blocks</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find a block" /></label>
        <div className="seg" role="group" aria-label="Show" style={{ justifySelf: "start" }}>
          {(["all", "general", "ecommerce", "kits"] as const).map((k) => <button key={k} aria-pressed={cat === k} onClick={() => setCat(k)} style={{ height: 30, padding: "0 10px", fontSize: 13 }}>{k === "all" ? "All" : k === "kits" ? "My kits" : k[0].toUpperCase() + k.slice(1)}</button>)}
        </div>
      </div>
      <div className="palette-list">
        {!q && cat === "all" && templates.length > 0 && (
          <>
            <div className="palette-group">Start from a workflow</div>
            <div className="templates">{templates.map((t) => <button key={t.slug} className="tpl" onClick={() => onTemplate(t)}>{t.name}<small>{t.steps.length} steps</small></button>)}</div>
          </>
        )}
        {ROLES.filter((r) => r.id !== "orchestrate").map((r) => {
          const items = list.filter((b) => b.role === r.id);
          if (!items.length) return null;
          return (
            <div key={r.id}>
              <div className="palette-group">{r.name} · {items.length}</div>
              {items.map((b) => (
                <div key={b.slug} className="pal-item" draggable onDragStart={(e) => onDragStart(e, b.slug)} title="Drag onto the canvas">
                  <span className={`dot role-${b.role}`} />
                  <div style={{ minWidth: 0 }}><b>{b.name}</b><small>{b.summary}</small></div>
                  <button className="add" aria-label={`Add ${b.name}`} onClick={() => onAdd(b.slug)}>+</button>
                </div>
              ))}
            </div>
          );
        })}
        {list.length === 0 && <p className="small" style={{ padding: "16px 8px" }}>{cat === "kits" ? "Your kits are empty. Add blocks to a kit from any block page." : "No blocks match. Try another word."}</p>}
      </div>
    </aside>
  );
}

function Stage({ c }: { c: Catalogue }) {
  useTitle("Canvas");
  const saved = useStore((s) => s.flows);
  const currentId = useStore((s) => s.currentFlow);
  const initial = useMemo(() => flows.get(currentId), []); // eslint-disable-line react-hooks/exhaustive-deps
  const [flowId, setFlowId] = useState(initial?.id ?? uid());
  const [name, setName] = useState(initial?.name ?? "Untitled workflow");
  const start = initial ? fromFlow(initial) : { nodes: [], edges: [] };
  const [nodes, setNodes, onNodesChange] = useNodesState<BlockNode>(start.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(start.edges);
  const [toast, setToast] = useState<string | null>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const wrapper = useRef<HTMLDivElement>(null);

  // Blocks queued from a block page ("Add to canvas").
  useEffect(() => {
    const q = takeQueued();
    if (!q.length) return;
    const known = q.filter((s) => c.bySlug[s]);
    const maxY = nodes.reduce((m, n) => Math.max(m, n.position.y), -80);
    const added = chain(known, { x: 40, y: maxY + 200 });
    setNodes((ns) => [...ns, ...added.nodes]);
    setEdges((es) => [...es, ...added.edges]);
    setToast(known.length === 1 ? "Block added to the canvas" : `${known.length} blocks added`);
    setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 50);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const flow = useMemo(() => toFlow(flowId, name, nodes, edges), [flowId, name, nodes, edges]);
  const order = useMemo(() => orderFlow(flow), [flow]);
  const mismatched = useMemo(() => new Set(typeMismatches(c, flow)), [c, flow]);

  // Save as the person works (only once there is something to save).
  useEffect(() => {
    if (!nodes.length && !saved.some((f) => f.id === flowId)) return;
    const t = setTimeout(() => flows.save(flow), 400);
    return () => clearTimeout(t);
  }, [flow]); // eslint-disable-line react-hooks/exhaustive-deps

  const stepOf = useMemo(() => Object.fromEntries((order ?? []).map((o) => [o.node.id, o.step])), [order]);
  const viewNodes = useMemo(() => nodes.map((n) => (n.data.step === stepOf[n.id] ? n : { ...n, data: { ...n.data, step: stepOf[n.id] } })), [nodes, stepOf]);
  const viewEdges = useMemo(() => edges.map((e) => ({ ...e, className: mismatched.has(e.id) ? "mismatch" : undefined })), [edges, mismatched]);

  const onConnect = useCallback((conn: Connection) => {
    if (conn.source === conn.target) return;
    setEdges((es) => (es.some((e) => e.source === conn.source && e.target === conn.target) ? es : addEdge({ ...conn, id: uid() }, es)));
  }, [setEdges]);

  const addAt = useCallback((slug: string, position: { x: number; y: number }) => {
    setNodes((ns) => [...ns, { id: uid(), type: "block", position, data: { slug } }]);
  }, [setNodes]);
  const addNext = (slug: string) => {
    const last = nodes[nodes.length - 1];
    const pos = last ? { x: last.position.x + 310, y: last.position.y } : { x: 40, y: 120 };
    const id = uid();
    setNodes((ns) => [...ns, { id, type: "block", position: pos, data: { slug } }]);
    if (last) setEdges((es) => [...es, { id: uid(), source: last.id, target: id }]);
    setToast(`${c.bySlug[slug]?.name ?? slug} added${last ? " and connected" : ""}`);
  };
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    const slug = e.dataTransfer.getData("application/abb-block");
    if (slug) addAt(slug, screenToFlowPosition({ x: e.clientX - 125, y: e.clientY - 40 }));
  };
  const loadTemplate = (t: Block) => {
    if (nodes.length && !confirm(`Replace what's on the canvas with "${t.name}"?`)) return;
    const g = chain(t.steps.map((s) => s.uses).filter((s) => c.bySlug[s]));
    setFlowId(uid()); setName(t.name); setNodes(g.nodes); setEdges(g.edges);
    setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 50);
  };
  const actions = useMemo(() => ({
    remove: (id: string) => { setNodes((ns) => ns.filter((n) => n.id !== id)); setEdges((es) => es.filter((e) => e.source !== id && e.target !== id)); },
    toggleEcom: (id: string) => setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, data: { ...n.data, ecommerce: !n.data.ecommerce } } : n))),
  }), [setNodes, setEdges]);

  const newFlow = () => { setFlowId(uid()); setName("Untitled workflow"); setNodes([]); setEdges([]); flows.open(null); };
  const openFlow = (id: string) => { const f = flows.get(id); if (!f) return; const g = fromFlow(f); setFlowId(f.id); setName(f.name); setNodes(g.nodes); setEdges(g.edges); flows.open(f.id); setTimeout(() => fitView({ padding: 0.2 }), 50); };
  const exportPack = async () => {
    const r = await buildHandoffZip(c, flow);
    if ("error" in r) { setToast(r.error); return; }
    download(r.blob, r.filename);
    setToast("Handoff downloaded. Upload the folder to Claude and say \"follow HANDOFF.md\".");
  };

  const status = !nodes.length ? null
    : !order ? { warn: true, text: "This workflow loops back on itself. Remove one connection." }
    : mismatched.size ? { warn: true, text: `${nodes.length} blocks · ${mismatched.size} connection${mismatched.size > 1 ? "s" : ""} where the types don't match (dashed)` }
    : { warn: false, text: `${nodes.length} block${nodes.length > 1 ? "s" : ""} · runs in ${order.length} steps · saved in this browser` };

  return (
    <NodeActions.Provider value={actions}>
      <div className="canvas-shell">
        <Palette c={c} onAdd={addNext} onTemplate={loadTemplate} />
        <div className="stage" ref={wrapper} onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; }} onDrop={onDrop}>
          <div className="stage-bar">
            <input className="flow-name" value={name} onChange={(e) => setName(e.target.value)} aria-label="Workflow name" />
            {saved.length > 0 && (
              <select className="select" style={{ height: 38 }} value={saved.some((f) => f.id === flowId) ? flowId : ""} onChange={(e) => openFlow(e.target.value)} aria-label="Open a saved workflow">
                <option value="" disabled>Saved workflows</option>
                {saved.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            )}
            <span className="spacer" />
            <button className="btn btn-quiet btn-sm" onClick={newFlow}>New</button>
            {saved.some((f) => f.id === flowId) && <button className="btn btn-quiet btn-sm" onClick={() => { if (confirm(`Delete "${name}"?`)) { flows.remove(flowId); newFlow(); } }}>Delete</button>}
            <button className="btn btn-primary btn-sm" onClick={exportPack} disabled={!nodes.length}>Download handoff</button>
          </div>
          <ReactFlow
            nodes={viewNodes} edges={viewEdges} nodeTypes={nodeTypes}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
            fitView fitViewOptions={{ padding: 0.3, maxZoom: 1 }} minZoom={0.3} maxZoom={1.6}
            defaultEdgeOptions={{ type: "smoothstep" }} deleteKeyCode={["Backspace", "Delete"]} proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={22} size={1.2} color="#d6d6d1" />
            <Controls showInteractive={false} position="bottom-right" />
          </ReactFlow>
          {!nodes.length && (
            <div className="stage-empty">
              <div>
                <h3 className="h3">Drag a block here to start</h3>
                <p>Or press + next to any block, or start from a ready-made workflow on the left.<br />Connect a block's right edge to the next block's left edge.</p>
              </div>
            </div>
          )}
          {status && <div className={`stage-status${status.warn ? " warn" : ""}`}>{status.text}</div>}
        </div>
      </div>
      <Toast message={toast} onDone={() => setToast(null)} />
    </NodeActions.Provider>
  );
}

export default function Canvas() {
  const c = useCatalogue();
  if (!c) return <div className="wrap page-head"><p className="small">Loading the canvas…</p></div>;
  return (
    <CatalogueCtx.Provider value={c}>
      <ReactFlowProvider><Stage c={c} /></ReactFlowProvider>
    </CatalogueCtx.Provider>
  );
}
