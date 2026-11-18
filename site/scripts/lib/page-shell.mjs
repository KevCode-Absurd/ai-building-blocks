// The first screen of every app page except home (which has its own, tools/lib/home-initial-shell.mjs): the site
// header and the page's own heading and opening line, styled by the page's stylesheets, drawn inside the loading
// cover with the loading bar under it. The rest of the page arrives with the app, so nobody sees a wall of plain text.
// It is a picture of the page, not content: it carries no h1 or ids, and content fingerprints leave it out.
export const PAGE_SHELL_START = "<!-- PAGE_SHELL_START -->";
export const PAGE_SHELL_END = "<!-- PAGE_SHELL_END -->";
export const withoutPageShell = (html) => html.replace(/<!-- PAGE_SHELL_START -->[\s\S]*?<!-- PAGE_SHELL_END -->/g, "");

// A copied hero keeps its look but not its ids, labels or h1 (a styled p takes the heading's place).
function quiet(html) {
  return html
    .replace(/\s(?:id|aria-labelledby|aria-describedby|data-testid)="[^"]*"/g, "")
    .replace(/<h1\b([^>]*)>/g, (_, attrs) => /\bclass="/.test(attrs) ? `<p${attrs.replace(/\bclass="/, 'class="page-shell-h1 ')}>` : `<p class="page-shell-h1"${attrs}>`)
    .replace(/<\/h1>/g, "</p>");
}

/** The cover's picture of one page. `content` pages (guides) reuse their own hero section; others show the heading
 *  and the first subhead of the prerendered body. Returns "" when there is no heading to show. */
export function pageShell({ logo, h1, body = "", content = "", mainClass = "" }) {
  const contentHero = content.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0];
  const blogHero = mainClass === "blog-page" ? content.match(/<header class="(?:blog|post)-hero"[\s\S]*?<\/header>/)?.[0] : null;
  const sub = body.match(/<p class="bp-sub">([\s\S]*?)<\/p>/)?.[1];
  const hero = blogHero
    ? `<div class="wrap blog-page"><div class="${blogHero.includes('class="post-hero"') ? "blog-post" : "blog-index"}">${quiet(blogHero)}</div></div>`
    : contentHero
    ? `<div class="wrap ${mainClass}">${quiet(contentHero)}</div>`
    : h1 ? `<div class="wrap bp-hero"><p class="bp-h1 page-shell-h1">${h1}</p>${sub ? `<p class="bp-sub">${quiet(sub)}</p>` : ""}</div>` : "";
  if (!hero) return "";
  const header = `<header class="header site-header"><div class="wrap header-in"><span class="brand">${logo}AI Blocks</span><div class="site-menu"><span class="btn btn-line site-menu-trigger">Menu<span aria-hidden="true">+</span></span></div></div></header>`;
  return `${PAGE_SHELL_START}<div class="page-shell" inert>${header}${hero}</div>${PAGE_SHELL_END}`;
}
