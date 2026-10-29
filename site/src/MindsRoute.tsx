import {lazy, Suspense, useCallback, useRef} from "react";
import type {Catalogue} from "./lib/data";
import {Link, setSearch, useLocation} from "./lib/router";
import {StartupReady} from "./StartupReady";
import {ArrowIcon} from "./ui";
import "./minds-opening.css";

type Props = {c: Catalogue | null; toBuilder: (slugs: string[], name?: string) => void; complete: boolean; onNeedFull: () => void; error: string; retry: () => void};
function Pending({error, retry}: Pick<Props, "error" | "retry">) {
  return <section className="wrap minds-pending"><p className="small" role={error ? "alert" : "status"}>{error || "Opening minds…"}</p>{error && <button className="btn btn-line" onClick={retry}>Try again</button>}</section>;
}
// Start the page code while the data is downloading. Keep the real heading mounted throughout.
const Body = lazy(async () => {
  const {default: Page} = await import("./MindsPage");
  return {default: (props: Props & {onReset: (reset: () => void) => void}) => props.c
    ? <Page c={props.c} toBuilder={props.toBuilder} complete={props.complete} onNeedFull={props.onNeedFull} onReset={props.onReset} />
    : <Pending error={props.error} retry={props.retry} />};
});
export default function MindsRoute(props: Props) {
  const {search} = useLocation(), mine = search.get("view") === "my";
  const reset = useRef(() => {});
  const registerReset = useCallback((value: () => void) => { reset.current = value; }, []);
  return <main className={mine ? "minds" : "minds minds-browse"} data-testid={mine ? "my-minds-page" : "minds-page"}>
    <StartupReady />
    <header className={`wrap bp-hero${mine ? "" : " minds-opening"}`}>
      {mine ? <><Link to="/minds" className="mind-back">All minds <ArrowIcon size={12} /></Link><h1 className="bp-h1">My minds</h1><p className="bp-sub">Create a mind in your own voice, or import one to use across your workflows.</p></> : <>
        <h1 className="bp-h1">Borrow a great mind</h1>
        <nav className="mind-browse-links" aria-label="Mind tools"><a href="#mind-results" onClick={() => { reset.current(); setSearch({q: ""}); }}>All minds</a><Link to="/minds?view=my">My minds <ArrowIcon size={12} /></Link><Link to="/skills/advisory-council">Build an advisory council <ArrowIcon size={12} /></Link></nav>
      </>}
    </header>
    {props.error && props.c && <div className="wrap"><p className="small" role="alert">{props.error}</p><button className="btn btn-line" onClick={props.retry}>Try again</button></div>}
    <Suspense fallback={<Pending error={props.error} retry={props.retry} />}><Body {...props} onReset={registerReset} /></Suspense>
  </main>;
}
