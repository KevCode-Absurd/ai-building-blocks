import { useMemo, useState, type FormEvent } from "react";
import { type Catalogue, kindInfo, pathOf } from "./lib/data";
import { GOAL_EXAMPLES, matchBlocks, planFromGoal } from "./lib/goal";
import { Link } from "./lib/router";
import { ArrowIcon } from "./ui";

/** Fills the library search from elsewhere on the page. */
export const SEARCH = "abb:library-search";

/** The first thing on the home page: say what you want done, and get the page or the steps that do it. */
export default function HomeGoal({ c, toBuilder }: { c: Catalogue | null; toBuilder: (slugs: string[], asNew?: string) => void }) {
  const [goal, setGoal] = useState("");
  const [asked, setAsked] = useState("");
  const plan = useMemo(() => (c && asked ? planFromGoal(c, asked) : null), [c, asked]);
  const flow = plan && "workflow" in plan.from ? plan.from.workflow : null;
  const matches = useMemo(() => (c && asked ? matchBlocks(c, asked, 8).filter((b) => b.category !== "orchestrator" && !plan?.slugs.includes(b.slug)).slice(0, 3) : []), [c, asked, plan]);
  const ask = (g: string) => { setGoal(g); setAsked(g.trim()); };
  const submit = (e: FormEvent) => { e.preventDefault(); if (goal.trim()) ask(goal); };
  const steps = plan && c ? plan.slugs.map((s) => c.bySlug[s]).filter(Boolean) : [];

  return (
    <div className="hgoal" data-testid="home-goal">
      <form className="hgoal-form" onSubmit={submit}>
        <label className="visually-hidden" htmlFor="hgoal-in">What do you want done?</label>
        <input id="hgoal-in" value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="What do you want done? Try “ads for my new product”" autoComplete="off" data-testid="home-goal-input" />
        <button className="btn btn-primary" disabled={!goal.trim() || !c} data-testid="home-goal-go">Show me how</button>
      </form>
      {!asked && (
        <div className="hgoal-eg">
          {GOAL_EXAMPLES.map((g) => <button type="button" key={g} className="chip" onClick={() => ask(g)}>{g}</button>)}
        </div>
      )}
      {asked && c && (
        <div className="hgoal-out" aria-live="polite" data-testid="home-goal-result">
          {steps.length > 0 ? (
            <div className="hgoal-plan">
              <p className="hgoal-h">{flow ? <>A ready workflow does this in {steps.length} steps</> : <>Get it done in {steps.length} step{steps.length > 1 ? "s" : ""}</>}</p>
              <ol className="hgoal-steps">{steps.map((b, i) => <li key={b.slug}><span className="n">{i + 1}</span><Link to={pathOf(b)}>{b.name}</Link></li>)}</ol>
              <div className="hgoal-acts">
                <button className="btn btn-dark btn-sm" onClick={() => toBuilder(plan!.slugs, flow?.name ?? plan!.name)} data-testid="home-goal-build">Open the steps in the builder</button>
                {flow && <Link to={pathOf(flow)} className="btn btn-ghost btn-sm">Read about this workflow</Link>}
              </div>
            </div>
          ) : (
            <p className="hgoal-miss">Nothing does that yet. Name the result you want, like ad copy, a landing page or video ads.</p>
          )}
          {matches.length > 0 && (
            <div className="hgoal-one">
              <p className="hgoal-h">{steps.length ? "Or do one part on its own" : "These come closest"}</p>
              <ul>{matches.map((b) => <li key={b.slug}><Link to={pathOf(b)}><span className="kind">{kindInfo(b).name}</span><span className="hgoal-nm">{b.name}</span><ArrowIcon size={12} /></Link></li>)}</ul>
            </div>
          )}
          <p className="hgoal-foot">
            <button className="link-btn" onClick={() => { setAsked(""); setGoal(""); }}>Start again</button>
            <button className="link-btn" onClick={() => { window.dispatchEvent(new CustomEvent(SEARCH, { detail: asked })); document.getElementById("library")?.scrollIntoView({ behavior: "smooth" }); }}>Search the library for “{asked}”</button>
          </p>
        </div>
      )}
    </div>
  );
}
