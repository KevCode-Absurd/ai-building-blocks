import { Link } from "./lib/router";
import { INFO_PAGES, OPERATOR, SUPPORT_EMAIL, emailLink } from "./lib/site-info.mjs";
import { openTailor } from "./Tailor";

const groups = [
  { label: "Explore", links: [["/#library", "Block library"], ["/minds", "Minds"], ["/tools", "Mini tools"], ["/ai-tools", "AI tools"], ["/tools/growth-channel-planner", "Growth channels"]] },
  { label: "Create", links: [["/compose", "Build a custom workflow"], ["/from-a-source", "Create skills from content"], ["/apps", "Example apps"], ["/apps/starter-pack", "App starter pack"], ["/space", "My space"], ["/people", "From people"]] },
  { label: "Help", links: [["/how-it-works", "How it works"], ["/support", "Help & contact"], ["/about", "About AI Blocks"]] },
];
export default function SiteFooter() {
  return <footer className="footer">
    <div className="wrap">
      <div className="footer-grid"><div className="footer-brand"><Link to="/" className="footer-name">AI Blocks</Link><p>Reusable AI skills and workflows for the work you do.</p><a href={emailLink()} className="footer-email">{SUPPORT_EMAIL}</a><span className="small">Support, feedback and privacy requests</span></div>
        {groups.map(group => <nav key={group.label} aria-label={`Footer ${group.label.toLowerCase()}`}><h2>{group.label}</h2>{group.links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}{group.label === "Help" && <button className="link-btn" onClick={() => openTailor()} data-testid="tailor-footer">Get a skill tailored for you</button>}</nav>)}
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} AI Blocks · {OPERATOR}, India</span><nav aria-label="Policies">{INFO_PAGES.filter(page => !["/support", "/about"].includes(page.path)).map(page => <Link key={page.path} to={page.path}>{page.label}</Link>)}</nav></div>
    </div>
  </footer>;
}
