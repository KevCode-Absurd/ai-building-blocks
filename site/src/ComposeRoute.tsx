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
    <div className="compose-intro"><span className="mono small">YOUR GOAL → YOUR WORKFLOW</span><h1 className="h2">Build a custom workflow</h1><p className="lede">Describe what you want to achieve. Get a step-by-step workflow with connected skills and checks, ready to edit, download and run in your own AI.</p><p className="small compose-source-entry">Already have an article, transcript or document? <Link to="/from-a-source" data-testid="compose-from-source">Start from a link or document</Link>.</p></div>
    <Suspense fallback={<section className="compose-pending"><p className="small" role="status">Opening this page…</p></section>}><Form {...props} /></Suspense>
  </main>;
}
