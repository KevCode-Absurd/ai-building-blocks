// "Add to a workflow": from any skill, start a new workflow or open one of yours,
// then put the steps in order, drop the ones you don't need and add the ones you do.
import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { type Block, type Catalogue, taskOf, wireSteps } from "./lib/data";
import { type Step, applySteps, isAutoWired, stepsOf } from "./lib/flowEdit";
import { navigate } from "./lib/router";
import { type Flow, flows, uid, useStore } from "./lib/store";
import { suggestNext } from "./lib/suggest";
import { CloseIcon, SearchIcon } from "./ui";

type Props = { c: Catalogue; slug: string; onClose: () => void; toast: (m: string) => void };
type Draft = { base: Flow | null; name: string; steps: Step[]; from: string };

export default function AddToFlow({ c, slug, onClose, toast }: Props) {
  const b = c.bySlug[slug];
  const mine = useStore((s) => s.flows);
  const ready = useMemo(() => c.blocks.filter((x) => x.category === "orchestrator"), [c]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const withThis = (steps: Step[]) => (steps.some((s) => s.slug === slug) ? steps : [...steps, { id: uid(), slug, added: true }]);
  const startNew = () => setDraft({ base: null, name: `${b.name} workflow`, steps: [{ id: uid(), slug, added: true }], from: "new" });
  const openMine = (f: Flow) => setDraft({ base: f, name: f.name, steps: withThis(stepsOf(f)), from: "mine" });
  const copyReady = (t: Block) => setDraft({ base: null, name: `My ${t.name.charAt(0).toLowerCase()}${t.name.slice(1)}`, steps: withThis(t.steps.map((s) => s.uses).filter((s) => c.bySlug[s]).map((s) => ({ id: uid(), slug: s }))), from: "ready" });

  return (
    <dialog
      ref={ref} className="atf" aria-labelledby="atf-title" data-testid="add-to-flow"
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <div className="atf-top">
        {draft && !savedId && <button className="btn btn-ghost btn-sm" onClick={() => setDraft(null)}><span aria-hidden="true">←</span> Back</button>}
        <h2 id="atf-title" className="atf-title">{savedId ? "Saved" : draft ? "Put the steps in order" : `Add “${b.name}” to a workflow`}</h2>
        <button className="icon-btn" onClick={onClose} aria-label="Close"><CloseIcon /></button>
      </div>

      {savedId ? (
        <div className="atf-body atf-done" data-testid="atf-done">
          <p>“{draft?.name}” has {draft?.steps.length} step{draft?.steps.length === 1 ? "" : "s"} and is saved in this browser. Open it in the builder to see how each step feeds the next, or download it for your AI.</p>
          <div className="atf-foot">
            <button className="btn btn-ghost" onClick={onClose}>Keep browsing</button>
            <button className="btn btn-primary" onClick={() => { flows.open(savedId); onClose(); navigate("/#build"); }} data-testid="atf-open">Open in the builder</button>
          </div>
        </div>
      ) : draft ? (
        <Editor c={c} slug={slug} draft={draft} setDraft={setDraft} onSave={(f) => { flows.save(f); setSavedId(f.id); toast(`Saved to ${f.name}`); }} />
      ) : (
        <div className="atf-body">
          <p className="atf-lead">A workflow is a few skills in a row. Each one hands its result to the next, so you run the whole job in one go.</p>
          <button className="atf-new" onClick={startNew} data-testid="atf-new">
            <span className="atf-plus" aria-hidden="true">+</span>
            <span><b>Start a new workflow</b><small>It starts with this {b.type === "prompt" ? "prompt" : "skill"}. Add more steps next.</small></span>
          </button>
          <h3 className="atf-h">Your workflows</h3>
          {mine.length === 0 ? (
            <p className="small atf-empty">None yet. Start a new one above, or copy a ready one below.</p>
          ) : (
            <ul className="atf-list" data-testid="atf-mine">
              {mine.map((f) => {
                const has = f.nodes.some((n) => n.slug === slug);
                return (
                  <li key={f.id}>
                    <button onClick={() => openMine(f)}>
                      <span><b>{f.name}</b><small>{f.nodes.length} step{f.nodes.length === 1 ? "" : "s"}{has ? " · already has this one" : ""}</small></span>
                      <span className="atf-go">{has ? "Edit" : "Add here"}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          <h3 className="atf-h">Or copy a ready workflow</h3>
          <ul className="atf-list">
            {ready.map((t) => (
              <li key={t.slug}>
                <button onClick={() => copyReady(t)}>
                  <span><b>{t.name}</b><small>{t.steps.length} steps · makes your own copy</small></span>
                  <span className="atf-go">Copy</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </dialog>
  );
}

function Editor({ c, slug, draft, setDraft, onSave }: { c: Catalogue; slug: string; draft: Draft; setDraft: (d: Draft) => void; onSave: (f: Flow) => void }) {
  const [reordered, setReordered] = useState(false);
  const [drag, setDrag] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const { steps } = draft;
  const handMade = !!draft.base && !isAutoWired(c, draft.base);
  const set = (next: Step[], moved = false) => { setDraft({ ...draft, steps: next }); if (moved) setReordered(true); };
  const move = (from: number, to: number) => {
    if (from === to || to < 0 || to >= steps.length) return;
    const next = [...steps];
    const [s] = next.splice(from, 1);
    next.splice(to, 0, s);
    set(next, true);
  };
  const add = (s: string) => { set([...steps, { id: uid(), slug: s, added: true }]); setQ(""); };
  const inFlow = useMemo(() => new Set(steps.map((s) => s.slug)), [steps]);
  const last = steps[steps.length - 1]?.slug ?? null;
  const next = useMemo(() => suggestNext(c, last, inFlow, 4), [c, last, inFlow]);
  const found = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    return c.blocks.filter((x) => x.category !== "orchestrator" && !inFlow.has(x.slug) &&
      words.every((w) => `${x.name} ${x.summary} ${x.headline} ${taskOf(x).name}`.toLowerCase().includes(w))).slice(0, 6);
  }, [c, q, inFlow]);
  // Which step feeds which, using the same rule as the builder: a step takes the latest result it can use.
  const feeds = useMemo(() => {
    const m: Record<number, number[]> = {};
    for (const [a, z] of wireSteps(c, steps.map((s) => s.slug))) (m[z] ??= []).push(a + 1);
    return m;
  }, [c, steps]);

  const onDragStart = (i: number) => (e: DragEvent) => { setDrag(i); e.dataTransfer.effectAllowed = "move"; e.dataTransfer.setData("text/plain", String(i)); };
  const onDragOver = (i: number) => (e: DragEvent) => { if (drag === null) return; e.preventDefault(); setOver(i); };
  const onDrop = (i: number) => (e: DragEvent) => { e.preventDefault(); if (drag !== null) move(drag, i); setDrag(null); setOver(null); };

  return (
    <div className="atf-body">
      <label className="atf-name">
        <span>Workflow name</span>
        <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} data-testid="atf-name" />
      </label>
      <p className="small atf-hint">Drag a step to move it, or use the arrows. Steps run top to bottom.</p>
      <ol className="atf-steps" data-testid="atf-steps">
        {steps.map((s, i) => {
          const blk = c.bySlug[s.slug];
          return (
            <li
              key={s.id} draggable onDragStart={onDragStart(i)} onDragOver={onDragOver(i)} onDrop={onDrop(i)} onDragEnd={() => { setDrag(null); setOver(null); }}
              className={`${s.slug === slug ? "is-this" : ""}${drag === i ? " is-drag" : ""}${over === i && drag !== i ? (drag !== null && drag < i ? " drop-after" : " drop-before") : ""}`}
              data-slug={s.slug}
            >
              <span className="atf-grip" aria-hidden="true">⋮⋮</span>
              <span className="atf-n">{i + 1}</span>
              <span className="atf-txt">
                <b>{blk?.name ?? s.slug}</b>
                <small>{s.slug === slug ? "This one · " : s.added ? "New · " : ""}{blk ? taskOf(blk).name : "No longer in the library"}{feeds[i]?.length && !(feeds[i].length === 1 && feeds[i][0] === i) ? ` · uses step ${feeds[i].join(" and ")}` : ""}</small>
              </span>
              <span className="atf-ctl">
                <button className="icon-btn" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move ${blk?.name ?? s.slug} up`}>↑</button>
                <button className="icon-btn" onClick={() => move(i, i + 1)} disabled={i === steps.length - 1} aria-label={`Move ${blk?.name ?? s.slug} down`}>↓</button>
                <button className="icon-btn" onClick={() => set(steps.filter((x) => x.id !== s.id))} aria-label={`Remove ${blk?.name ?? s.slug}`} data-testid="atf-remove">×</button>
              </span>
            </li>
          );
        })}
      </ol>
      {steps.length === 0 && <p className="small atf-empty">No steps left. Add one below.</p>}
      {!inFlow.has(slug) && <button className="btn btn-ghost btn-sm" onClick={() => add(slug)}>Put “{c.bySlug[slug]?.name}” back</button>}

      <h3 className="atf-h">Add a step</h3>
      {next.length > 0 && !q && (
        <div className="atf-sugg" data-testid="atf-suggestions">
          {next.map(({ b, why }) => (
            <button key={b.slug} onClick={() => add(b.slug)} data-slug={b.slug}>
              <span className="atf-plus" aria-hidden="true">+</span>
              <span><b>{b.name}</b><small>{why}</small></span>
            </button>
          ))}
        </div>
      )}
      <label className="search atf-search"><SearchIcon /><span className="visually-hidden">Find a step to add</span><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Find any skill or prompt" data-testid="atf-search" /></label>
      {q && (
        <div className="atf-sugg">
          {found.map((x) => (
            <button key={x.slug} onClick={() => add(x.slug)} data-slug={x.slug}>
              <span className="atf-plus" aria-hidden="true">+</span>
              <span><b>{x.name}</b><small>{taskOf(x).name}</small></span>
            </button>
          ))}
          {found.length === 0 && <p className="small atf-empty">Nothing matches. Try another word.</p>}
        </div>
      )}
      {handMade && <p className="small atf-hint">You drew your own connections in the builder. They stay unless you move a step, which reconnects everything in the new order.</p>}

      <div className="atf-foot">
        <span className="small">{steps.length} step{steps.length === 1 ? "" : "s"}{draft.base ? ` · updates “${draft.base.name}”` : " · a new workflow"}</span>
        <button className="btn btn-primary" disabled={!steps.length} onClick={() => onSave(applySteps(c, draft.base, draft.name.trim() || "Untitled workflow", steps, reordered))} data-testid="atf-save">
          {draft.base ? "Save changes" : "Save workflow"}
        </button>
      </div>
    </div>
  );
}
