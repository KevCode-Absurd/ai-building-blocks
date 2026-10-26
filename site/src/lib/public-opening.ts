// The server's readable first screen (scripts/prerender.mjs), kept when main.tsx clears #root,
// so a public page can show it while its data is still on the way.
let initial: { path: string; html: string } | null = null;
export function keepInitialHtml(html: string) {
  initial = { path: location.pathname, html };
}
/** This address's pre-rendered page body without its plain header and footer (the app draws its own),
 * or "" when there is none or the visitor has moved to another page. Public pages only, never account data. */
export function initialPageHtml(path: string): string {
  if (!initial || initial.path !== path || !initial.html.includes("data-prerendered")) return "";
  return initial.html
    .replace(/<header class="small" data-prerendered-nav>[\s\S]*?<\/header>/, "")
    .replace(/<footer class="wrap small">[\s\S]*?<\/footer>(?=<\/main>)/, "");
}
