/** Keep the server's public HTML readable while the private account boundary opens.
 * This component never reads a personal store, token, draft or account response. */
export default function PublicOpening({ html }: { html: string }) {
  // The startup cover stays until App commits its usable screen. This public
  // fallback is not that signal: revealing it early flashes the plain HTML.
  // Only public, pre-rendered pages may retain their initial HTML. Private routes
  // keep the existing loading boundary and never get a cached account view.
  const publicPage = location.pathname === "/" || /^\/(skills|prompts|workflows|agents|minds|tools|ai-tools|apps|jobs)(\/|$)/.test(location.pathname)
    || ["/how-it-works", "/about", "/support", "/privacy", "/terms", "/cookies", "/ai-disclaimer", "/api-and-mcp", "/api-and-mcp.html", "/me-md"].includes(location.pathname);
  if (!publicPage) return <main className="wrap bp-hero"><p role="status">Opening your saved work…</p></main>;
  if (html.includes("data-prerendered")) return <div data-testid="public-opening" dangerouslySetInnerHTML={{ __html: html }} />;
  return <div data-testid="public-opening">
    <header className="wrap header-in"><a className="brand" href="/">AI Blocks</a><nav aria-label="Public pages"><a href="/#library">Find a task</a><span aria-hidden="true"> · </span><a href="/how-it-works">Help</a><span aria-hidden="true"> · </span><a href="/tools">Browser tools</a></nav><a className="btn btn-ghost btn-sm" href="/account" data-testid="account-link">My saved work</a></header>
    <main className="wrap bp-hero">
      <h1 className="bp-h1">{location.pathname === "/" ? "Use AI like the top 1%" : "Find a task for your work"}</h1>
      {location.pathname === "/" && <p className="lede">Turn hours of work into minutes. Spend the time you save on the work only you can do. Or at the beach (we won't tell).</p>}
      <section id="library"><h2 className="h3">Explore the library</h2><nav className="public-type-links" aria-label="Task types">{[["", "All"], ["prompt", "Prompts"], ["skill", "Skills"], ["workflow", "Workflows"], ["agent", "Agents"], ["mind", "Minds"]].map(([kind, label]) => <a key={kind} href={`/?${kind ? `kind=${kind}` : ""}#library`}>{label}</a>)}</nav><p><a href="/jobs">Browse all tasks by job</a></p></section>
      <p role="status" className="small">Public tasks are available. Your saved work is opening separately.</p>
    </main>
  </div>;
}
