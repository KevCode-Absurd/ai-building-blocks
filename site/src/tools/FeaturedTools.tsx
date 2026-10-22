import { Link } from "../lib/router";
import type { Catalogue } from "../lib/data";
import "./featured-tools.css";

const PICKS = [
  ["contrast-checker", "Design", "Check your colour contrast", "See whether text is readable against its background."],
  ["meeting-cost", "People", "Put a cost on that meeting", "See what a recurring meeting uses in people's time."],
  ["emergency-fund", "Personal money", "Work out your cash buffer", "Turn essential monthly costs into a savings target."],
  ["task-priority-planner", "Personal effectiveness", "Choose what to work on next", "Compare impact, urgency and hours of effort."],
  ["csv-to-json", "Operations", "Turn a table into JSON", "Convert a CSV file's text, including quoted cells."],
  ["weighted-decision-matrix", "Decisions", "Compare your options fairly", "Choose criteria and weights, then score each option."],
];
export default function FeaturedTools() {
  return <section className="section wrap featured-tools" id="everyday-tools" aria-labelledby="everyday-tools-title" data-testid="featured-tools">
    <div className="featured-tools-head"><div><p className="mono small">FREE EVERYDAY TOOLS</p><h2 className="h2" id="everyday-tools-title">Get a useful answer right here</h2><p className="small">Quick tools for your work and life. Type, compare and take the result with you.</p></div><Link to="/tools" className="btn btn-dark btn-sm">Explore all tools →</Link></div>
    <div className="featured-tools-grid">{PICKS.map(([slug, area, title, summary]) => <Link className="featured-tool" key={slug} to={`/tools/${slug}`}><span className="mono small">{area}</span><h3>{title}</h3><p>{summary}</p><span className="small">Open tool <span aria-hidden="true">→</span></span></Link>)}</div>
  </section>;
}

const WORKFLOWS = [
  ["make-a-long-form-easier-to-finish", "Design"],
  ["prepare-a-team-absence-handover", "People"],
  ["check-supplier-invoices-before-approval", "Finance"],
  ["tailor-a-job-application-to-real-evidence", "Your career"],
  ["choose-a-study-plan-you-can-keep", "Learning"],
  ["prepare-evidence-for-a-compliance-review", "Compliance preparation"],
];
export function FeaturedWorkflows({ c }: { c: Catalogue }) {
  const picks = WORKFLOWS.map(([slug, area]) => ({ b: c.bySlug[slug], area })).filter(x => x.b);
  if (!picks.length) return null;
  return <section className="section wrap featured-tools" aria-labelledby="everyday-workflows-title" data-testid="featured-workflows">
    <div className="featured-tools-head"><div><p className="mono small">WORKFLOWS FOR REAL JOBS</p><h2 className="h2" id="everyday-workflows-title">Start with the result you need</h2><p className="small">Bring your facts. Each workflow guides your AI through the work and the checks.</p></div><Link to="/?kind=workflow#library" className="btn btn-dark btn-sm">Browse {c.blocks.filter(b => b.type === "workflow").length} workflows →</Link></div>
    <div className="featured-tools-grid">{picks.map(({ b, area }) => <Link className="featured-tool" key={b.slug} to={`/workflows/${b.slug}`}><span className="mono small">{area}</span><h3>{b.name}</h3><p>{b.summary}</p><span className="small">See the workflow →</span></Link>)}</div>
    <p className="small">Have a repeating job? <Link to="/?kind=agent#library">Explore agents for ongoing work →</Link></p>
  </section>;
}
