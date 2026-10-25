import { useDeferredValue, useEffect, useId, useMemo, useState } from "react";
import { type Block, type Catalogue, TASKS, taskOf } from "./lib/data";
import { useStore } from "./lib/store";
import { chainSuggestions, firstSkillSuggestions, replacementSuggestions, type ChainSuggestion } from "./lib/workflow-chain";
import "./builder-palette.css";

type Where = "before" | "after" | "start";
export type BuilderPaletteProps = {
  c: Catalogue;
  anchor: { id: string; slug: string } | null;
  inFlow: Set<string>;
  goal: string;
  onGoalChange: (goal: string) => void;
  onAdd: (slug: string, where: Where) => void;
  onTemplate: (b: Block) => void;
  onReplace?: (slug: string) => void;
};
const PAGE = 60;

export default function BuilderPalette({ c, anchor, inFlow, goal, onGoalChange, onAdd, onTemplate, onReplace }: BuilderPaletteProps) {
  const [tab, setTab] = useState<"next" | "all" | "kits">("next");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [expanded, setExpanded] = useState<Set<Where | "replace">>(new Set());
  const kits = useStore(s => s.kits);
  const dq = useDeferredValue(q);
  const deferredGoal = useDeferredValue(goal);
  const goalId = useId();
  const queryId = useId();
  const hays = useMemo(() => new Map(c.blocks.map(b => [b.slug, `${b.name} ${b.slug} ${(b.aliases ?? []).join(" ")} ${b.summary} ${b.headline} ${taskOf(b).name}`.toLowerCase()])), [c]);
  useEffect(() => setLimit(PAGE), [dq, tab]);
  useEffect(() => setExpanded(new Set()), [anchor?.id]);
  const list = useMemo(() => {
    const words = dq.toLowerCase().trim().split(/\s+/).filter(Boolean);
    const kitSlugs = new Set(kits.flatMap(k => k.slugs));
    return c.blocks.filter(b => b.category !== "orchestrator" && b.type !== "agent" && (tab !== "kits" || kitSlugs.has(b.slug)) && words.every(w => hays.get(b.slug)?.includes(w)));
  }, [c, dq, tab, kits, hays]);
  const groups = useMemo(() => TASKS.map(t => ({ t, items: list.filter(b => taskOf(b).id === t.id) })).filter(g => g.items.length), [list]);
  const templates = useMemo(() => c.blocks.filter(b => b.category === "orchestrator"), [c]);
  const first = useMemo(() => firstSkillSuggestions(c, deferredGoal, inFlow), [c, deferredGoal, inFlow]);
  const before = useMemo(() => anchor ? chainSuggestions(c, anchor.slug, inFlow, deferredGoal, "before") : [], [c, anchor, inFlow, deferredGoal]);
  const after = useMemo(() => anchor ? chainSuggestions(c, anchor.slug, inFlow, deferredGoal, "after") : [], [c, anchor, inFlow, deferredGoal]);
  const replacements = useMemo(() => anchor ? replacementSuggestions(c, anchor.slug, inFlow, deferredGoal) : [], [c, anchor, inFlow, deferredGoal]);
  const selected = anchor ? c.bySlug[anchor.slug] : null;

  function card(b: Block, where: Where | "replace", why?: string) {
    const action = where === "replace" ? "Replace" : where === "start" ? "Use first" : where === "before" ? "Add before" : "Add after";
    return <article className="chain-card" key={`${where}-${b.slug}`} data-slug={b.slug} draggable={where !== "replace"} onDragStart={e => {
      if (where === "replace") { e.preventDefault(); return; }
      e.dataTransfer.setData("application/abb-block", b.slug);
      if (anchor && where !== "start") { e.dataTransfer.setData("application/abb-anchor", anchor.id); e.dataTransfer.setData("application/abb-direction", where); }
      e.dataTransfer.effectAllowed = "copy";
    }}>
      <b>{b.name}</b><p>{b.summary}</p>{why && <small>{why}</small>}
      <button type="button" onClick={() => where === "replace" ? onReplace?.(b.slug) : onAdd(b.slug, where)} aria-label={`${action}: ${b.name}`}>{action}</button>
    </article>;
  }
  function section(title: string, suggestions: ChainSuggestion[], where: Where | "replace") {
    const shown = where === "start" || expanded.has(where) ? suggestions : suggestions.slice(0, 3);
    return <section className="chain-section" aria-label={title} data-testid={`chain-${where}`}><h3>{title}</h3>
      {suggestions.length ? shown.map(({ b, why }) => card(b, where, why)) : <p className="chain-empty">No clear match yet. Browse All to choose a step.</p>}
      {shown.length < suggestions.length && <button type="button" className="btn btn-ghost btn-sm" onClick={() => setExpanded(current => new Set([...current, where]))} aria-label={`View more: ${title}`}>View more</button>}
    </section>;
  }

  return <aside className="palette chain-palette" aria-label="Choose workflow steps">
    <div className="palette-top">
      <label htmlFor={goalId}>What do you want to get done?</label>
      <textarea id={goalId} rows={3} maxLength={3000} value={goal} onChange={e => onGoalChange(e.target.value)} placeholder="For example, turn customer reviews into an ad" data-testid="chain-goal" />
      <div className="seg" role="group" aria-label="Choose steps">
        {(["next", "all", "kits"] as const).map(k => <button type="button" key={k} aria-pressed={tab === k} onClick={() => setTab(k)} data-testid={`palette-${k}`}>{k === "next" ? "Suggested" : k === "all" ? "All" : "My kits"}</button>)}
      </div>
      {tab !== "next" && <><label className="visually-hidden" htmlFor={queryId}>Find a block</label><input id={queryId} type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Find a block" data-testid="palette-search" /></>}
    </div>
    <div className="palette-list">
      {tab === "next" ? <div data-testid="suggestions">
        {selected ? <><p className="chain-context">Selected: <b>{selected.name}</b></p>{section("Before this step", before, "before")}{section("After this step", after, "after")}{onReplace && section("Replace this step", replacements, "replace")}</> : <><p className="chain-context">Choose one skill to start. Add the next step when you are ready.</p>{section("Choose your first step", first, "start")}</>}
      </div> : <>
        {(() => { let left = limit; return groups.map(({ t, items }) => { if (left <= 0) return null; const shown = items.slice(0, left); left -= shown.length; return <section key={t.id} className="chain-section"><h3>{t.name} <span>({items.length})</span></h3>{shown.map(b => card(b, anchor ? "after" : "start"))}</section>; }); })()}
        {list.length > limit && <button type="button" className="btn btn-ghost btn-sm" onClick={() => setLimit(n => n + PAGE)} data-testid="palette-more">Show {Math.min(PAGE, list.length - limit)} more</button>}
        {!list.length && <p className="chain-empty">{tab === "kits" ? "No saved blocks match. Save a skill to a kit, or browse All." : "No blocks match. Try another word."}</p>}
      </>}
      <details className="chain-templates"><summary>Ready workflows</summary><p>Start with a complete workflow, then change its steps.</p>{templates.map(b => <button key={b.slug} className="tpl" type="button" onClick={() => onTemplate(b)}>{b.name}<small>{b.steps.length} steps</small></button>)}</details>
    </div>
  </aside>;
}
