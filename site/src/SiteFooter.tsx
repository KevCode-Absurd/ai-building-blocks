import { Link } from "./lib/router";
import { INFO_PAGES, SOCIAL_PROFILES, SUPPORT_EMAIL, emailLink } from "./lib/site-info-nav.mjs";
import { FOOTER_GROUPS, FOOTER_LINE, isStaticPage } from "./lib/site-nav.mjs";
import { openTailor } from "./Tailor";
import { usePeopleVisible } from "./lib/people";

// Three short columns from lib/site-nav.mjs (the plain pages show the same footer), then the policies in the bottom row.
// App tours are reached through How it works; source and growth tools have their own entry points.
const groups = FOOTER_GROUPS as { label: string; links: [string, string, string][] }[];
export default function SiteFooter() {
  const people = usePeopleVisible(); // From people shows here only once the public list has 20 or more items
  return <footer className="footer">
    <div className="wrap">
      <div className="footer-grid"><div className="footer-brand"><Link to="/" className="footer-name">AI Blocks</Link><p>{FOOTER_LINE}</p><a href={emailLink()} className="footer-email">{SUPPORT_EMAIL}</a>{SOCIAL_PROFILES.length > 0 && <nav className="footer-social small" aria-label="AI Blocks on other sites">{SOCIAL_PROFILES.map(({ label, url }) => <a key={url} href={url} rel="me noopener" target="_blank">{label}</a>)}</nav>}<span className="small">Support, feedback and privacy requests</span></div>
        {groups.map(group => <nav key={group.label} aria-label={`Footer ${group.label.toLowerCase()}`}><h2>{group.label}</h2>
          {group.links.map(([to, label, id]) => isStaticPage(to)
            ? <a key={to} href={to} data-testid={id || undefined}>{label}</a>
            : <Link key={to} to={to} data-testid={id || undefined}>{label}</Link>)}
          {group.label === "Explore" && people && <Link to="/people" data-testid="footer-people">From people</Link>}
          {group.label === "Help" && <button className="link-btn" onClick={() => openTailor()} data-testid="tailor-footer">Get a skill tailored for you</button>}
        </nav>)}
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} AI Blocks</span><nav aria-label="Policies">{INFO_PAGES.filter(page => !["/support", "/about"].includes(page.path)).map(page => <Link key={page.path} to={page.path}>{page.label}</Link>)}</nav></div>
    </div>
  </footer>;
}
