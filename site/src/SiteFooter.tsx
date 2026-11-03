import { Link } from "./lib/router";
import { INFO_PAGES, SOCIAL_PROFILES, SUPPORT_EMAIL, emailLink } from "./lib/site-info-nav.mjs";
import { openTailor } from "./Tailor";
import { usePeopleVisible } from "./lib/people";

// Keep the starting points short, then help. Policies sit in the bottom row.
// App tours are reached through How it works; source and growth tools have their own entry points.
const groups = [
  { label: "Explore", links: [["/#library", "Find a task"], ["/roles", "Hire an AI specialist"], ["/compose", "Plan a job"], ["/tools", "Tools"], ["/minds", "Minds"], ["/space", "Team space"]] },
  { label: "Help", links: [["/how-it-works", "How it works"], ["/support", "Help & contact"], ["/about", "About AI Blocks"]] },
];
export default function SiteFooter() {
  const people = usePeopleVisible(); // From people shows here only once the public list has 20 or more items
  return <footer className="footer">
    <div className="wrap">
      <div className="footer-grid"><div className="footer-brand"><Link to="/" className="footer-name">AI Blocks</Link><p>Reusable AI skills and workflows for the work you do.</p><a href={emailLink()} className="footer-email">{SUPPORT_EMAIL}</a>{SOCIAL_PROFILES.length > 0 && <nav className="footer-social small" aria-label="AI Blocks on other sites">{SOCIAL_PROFILES.map(({ label, url }) => <a key={url} href={url} rel="me noopener" target="_blank">{label}</a>)}</nav>}<span className="small">Support, feedback and privacy requests</span></div>
        {groups.map(group => <nav key={group.label} aria-label={`Footer ${group.label.toLowerCase()}`}><h2>{group.label}</h2>{group.links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}{group.label === "Explore" && people && <Link to="/people" data-testid="footer-people">From people</Link>}{group.label === "Explore" && <a href="/industries" data-testid="footer-industries">AI help by industry</a>}{group.label === "Help" && <><a href="/how-we-test" data-testid="footer-how-we-test">How we test</a><Link to="/api-and-mcp" data-testid="footer-api-mcp">Connect your AI</Link><Link to="/api-and-mcp#api" data-testid="footer-documentation">Documentation</Link><button className="link-btn" onClick={() => openTailor()} data-testid="tailor-footer">Get a skill tailored for you</button></>}</nav>)}
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} AI Blocks</span><nav aria-label="Policies">{INFO_PAGES.filter(page => !["/support", "/about"].includes(page.path)).map(page => <Link key={page.path} to={page.path}>{page.label}</Link>)}</nav></div>
    </div>
  </footer>;
}
