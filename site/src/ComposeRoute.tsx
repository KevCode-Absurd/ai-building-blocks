import {Suspense,lazy} from "react";
import type {Catalogue} from "./lib/data";
import {Link} from "./lib/router";
import {StartupReady} from "./StartupReady";
import "./compose-opening.css";
const Form = lazy(() => import("./ComposePage"));
/** Keep the real opening visible and stable while the unchanged interactive form loads. */
export default function ComposeRoute(props: {c: Catalogue | null; toast: (message: string) => void; requestCatalogue: () => Promise<Catalogue>}) {
  return <main className="wrap compose-page" data-testid="compose-page">
    <StartupReady />
    <div className="compose-intro"><nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">›</span><span aria-current="page">Build a workflow</span></nav><h1 className="h2">Build a workflow</h1><p className="lede">Say what you want done. Get a free step-by-step plan with the right skills and checks. Edit it, then give it to your AI. No sign-up needed.</p><p className="small compose-other-ways" data-testid="compose-other-ways">Other ways: <Link to="/from-a-source" data-testid="compose-from-source">start from a document</Link> · <Link to="/#build">pick each step yourself</Link> · <Link to="/teams">plan a team of specialists</Link> · <Link to="/get-it-done" data-testid="compose-get-it-done">get a whole job done</Link></p></div>
    <Suspense fallback={<section className="compose-pending"><p className="small" role="status">Opening this page…</p></section>}><Form {...props} /></Suspense>
  </main>;
}
