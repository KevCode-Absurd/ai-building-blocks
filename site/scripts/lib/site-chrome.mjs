// The header and footer of the plain pages built without the app (job hubs, the business boards, How we test, the
// minds directory pages). Same links, words and classes as the app's SiteHeader and SiteFooter (src/lib/site-nav.mjs),
// so a visitor sees one site. The menu is a <details> element: it opens with no script; public/site-menu.js only
// closes it on Escape or an outside click and runs the theme switch.
import { FOOTER_GROUPS, FOOTER_LINE, MAIN_NAV, MENU_GROUPS } from "../../src/lib/site-nav.mjs";
import { INFO_PAGES, SOCIAL_PROFILES, SUPPORT_EMAIL, emailLink } from "../../src/lib/site-info-nav.mjs";

const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const IN_HEADER = new Set(MAIN_NAV.map(([to]) => to));
// A section link is current on its own page and on the pages under it (/jobs/x is under Find a task).
const SECTION_OF = [["/jobs", "/#library"], ["/roles", "/roles"], ["/tools", "/tools"], ["/ai-tools", "/tools"], ["/minds", "/minds"]];
const currentFor = (url) => SECTION_OF.find(([prefix]) => url === prefix || url.startsWith(`${prefix}/`))?.[1] ?? null;
const word = (closed, open) => `<span class="if-closed">${closed}</span><span class="if-open">${open}</span>`;
const SUN = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.5"/><path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

/** The site header for a plain page at `url`: logo, the five main sections, Sign in, and the grouped More menu. */
export function staticHeader(url, logo) {
  const current = currentFor(url);
  const here = (to) => (to === current || to === url ? ' aria-current="page"' : "");
  const groups = MENU_GROUPS.map((g) => `<section aria-labelledby="sm-${g.id}"><h2 class="site-menu-label" id="sm-${g.id}">${esc(g.label)}</h2>${g.links.map(([to, label, id]) => `<a href="${to}"${here(to)} data-testid="nav-${id}"${IN_HEADER.has(to) ? " data-shell-menu-main" : ""}>${esc(label)}</a>`).join("")}</section>`).join("");
  return `<a class="skip-link" href="#main-content">Skip to content</a>`
    + `<header class="header site-header" data-prerendered-nav><div class="wrap header-in">`
    + `<a href="/" class="brand" aria-label="AI Blocks, home">${logo}AI Blocks</a>`
    + `<nav class="site-nav" aria-label="Main" data-shell-nav>${MAIN_NAV.map(([to, label, id]) => `<a href="${to}"${here(to)} data-testid="${id}">${esc(label)}</a>`).join("")}</nav>`
    + `<a href="/sign-in" class="btn btn-line btn-sm site-sign-in static-sign-in" data-testid="top-sign-in">Sign in</a>`
    + `<details class="site-menu static-menu"><summary class="btn btn-line site-menu-trigger" data-testid="menu-btn"><span class="site-menu-word-phone">${word("Menu", "Close menu")}</span><span class="site-menu-word-wide">${word("More", "Close")}</span><span aria-hidden="true">${word("+", "&minus;")}</span></summary>`
    + `<nav class="site-menu-links" aria-label="Sections" data-testid="site-menu">${groups}`
    + `<section class="site-menu-account" aria-label="Your account"><a href="/account" class="site-menu-account-link" data-testid="open-saved-work">My work</a><a href="/account?view=settings">Account settings</a><a href="/sign-in">Sign in</a></section>`
    + `<div class="site-menu-appearance"><span>Appearance</span><button type="button" class="icon-btn" data-static-theme aria-label="Switch between light and dark" title="Switch between light and dark">${SUN}</button></div>`
    + `</nav></details></div></header>`;
}

/** The site footer: what AI Blocks is, three short columns of links, then the policies. */
export function staticFooter() {
  const columns = FOOTER_GROUPS.map((g) => `<nav aria-label="Footer ${esc(g.label.toLowerCase())}"><h2>${esc(g.label)}</h2>${g.links.map(([to, label, id]) => `<a href="${to}"${id ? ` data-testid="${id}"` : ""}>${esc(label)}</a>`).join("")}</nav>`).join("");
  const social = SOCIAL_PROFILES.length ? `<nav class="footer-social small" aria-label="AI Blocks on other sites">${SOCIAL_PROFILES.map((p) => `<a href="${esc(p.url)}" rel="me noopener">${esc(p.label)}</a>`).join("")}</nav>` : "";
  const policies = INFO_PAGES.filter((p) => !["/support", "/about"].includes(p.path)).map((p) => `<a href="${p.path}">${esc(p.label)}</a>`).join("");
  return `<footer class="footer"><div class="wrap"><div class="footer-grid">`
    + `<div class="footer-brand"><a href="/" class="footer-name">AI Blocks</a><p>${esc(FOOTER_LINE)}</p><a href="${emailLink()}" class="footer-email">${SUPPORT_EMAIL}</a>${social}<span class="small">Support, feedback and privacy requests</span></div>`
    + `${columns}</div>`
    + `<div class="footer-bottom"><span>&copy; ${new Date().getFullYear()} AI Blocks</span><nav aria-label="Policies">${policies}<a href="/llms.txt">llms.txt</a><a href="/sitemap.xml">Sitemap</a></nav></div>`
    + `</div></footer>`;
}
