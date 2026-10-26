import type { ReactNode } from "react";
import { type Catalogue, kindOf } from "./lib/data";
import { Link } from "./lib/router";
import { BlockCard } from "./ui";
import { isTested } from "./lib/verification";

const trustRank = (b: Parameters<typeof isTested>[0]) => isTested(b) ? 0 : 1;

const MIND_PICKS = ["richard-feynman", "marie-curie", "don-norman", "barbara-minto", "steve-jobs", "jane-jacobs", "marcus-aurelius", "grace-hopper"];
const FLOW_PICKS = ["make-a-long-form-easier-to-finish", "prepare-a-team-absence-handover", "check-supplier-invoices-before-approval", "tailor-a-job-application-to-real-evidence", "choose-a-study-plan-you-can-keep", "prepare-evidence-for-a-compliance-review"];

export function HomeMinds({ c }: { c: Catalogue }) {
  const minds = c.blocks.filter(b => b.type === "mind");
  const picks = [...MIND_PICKS.map(slug => c.bySlug[slug]).filter(b => b?.type === "mind"), ...minds].filter((b, index, all) => all.findIndex(other => other.slug === b.slug) === index).slice(0, 8);
  return <section className="section wrap home-collection" id="home-minds" data-testid="home-minds" aria-labelledby="home-minds-title">
    <div className="home-section-head"><div><h2 className="h2" id="home-minds-title">Minds</h2><p>Try a different way of thinking about your question. Built from public work; these are AI interpretations, not the real people.</p></div><Link to="/minds" className="btn btn-dark btn-sm">Explore all {minds.length} minds →</Link></div>
    <div className="grid">{picks.map(b => <BlockCard key={b.slug} b={b} />)}</div>
  </section>;
}

export function HomeWorkflows({ c, children }: { c: Catalogue; children?: ReactNode }) {
  const workflows = c.blocks.filter(b => kindOf(b) === "workflow");
  const picks = [...FLOW_PICKS.map(slug => c.bySlug[slug]).filter(b => b && kindOf(b) === "workflow"), ...workflows].filter((b, index, all) => all.findIndex(other => other.slug === b.slug) === index).slice(0, 6);
  return <section className="section wrap home-collection" id="home-workflows" data-testid="featured-workflows" aria-labelledby="home-workflows-title">
    <div className="home-section-head"><div><h2 className="h2" id="home-workflows-title">Workflows and builder</h2><p>Open a ready workflow in the builder, or choose your own steps. Download the full plan to use in your AI.</p></div><Link to="/?kind=workflow#library" className="btn btn-dark btn-sm">Browse all {workflows.length} workflows →</Link></div>
    <div className="home-builder-actions"><Link to="/#build" className="btn btn-primary">Open the workflow builder →</Link><Link to="/compose" className="btn btn-dark">Plan from a goal →</Link><Link to="/from-a-source" className="btn btn-ghost">Start from a link or document →</Link><Link to="/apps" className="btn btn-ghost">See an example →</Link></div>
    <div className="grid">{picks.map(b => <BlockCard key={b.slug} b={b} workflowBuilder />)}</div>
    {children}
  </section>;
}

export function HomeAgents({ c }: { c: Catalogue }) {
  const agents = c.blocks.filter(b => b.type === "agent");
  // Tested agents first.
  const picks = [...agents].sort((a, b) => trustRank(a) - trustRank(b));
  return <section className="section wrap home-collection" id="home-agents" data-testid="home-agents" aria-labelledby="home-agents-title">
    <div className="home-section-head"><div><h2 className="h2" id="home-agents-title">Agents</h2><p>Instructions for repeatable jobs, with checks and limits. Use them in an AI tool that supports the work.</p></div><Link to="/?kind=agent#library" className="btn btn-dark btn-sm">Browse all {agents.length} agents →</Link></div>
    <div className="grid">{picks.slice(0, 4).map(b => <BlockCard key={b.slug} b={b} />)}</div>
  </section>;
}
