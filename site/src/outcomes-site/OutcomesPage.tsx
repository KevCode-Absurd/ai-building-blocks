// /get-it-done (start a job), /get-it-done/example (the worked example, screen by screen) and /get-it-done/status
// (where a job stands, from its folder). Nothing on these pages calls a model or sends what the owner types anywhere.
import { Suspense, lazy } from "react";
import { Link } from "../lib/router";
import { OUTCOME_PATHS } from "./owner-message";
import StartJob from "./StartJob";
import "./outcomes-site.css";
// The walkthrough and the status page carry the orchestrator's checks and the worked example, so they load when opened.
const ExampleJob = lazy(() => import("./ExampleJob"));
const JobStatusPage = lazy(() => import("./JobStatusPage"));

export default function OutcomesPage({ path, toast }: { path: string; toast: (message: string) => void }) {
  const page = path.replace(/\/+$/, "");
  return (
    <main className="bp gd" data-testid="outcomes-page">
      <Suspense fallback={<p className="wrap bp-hero small" role="status">Opening this page…</p>}>
      {page === OUTCOME_PATHS.start ? <StartJob path={page} toast={toast} />
        : page === OUTCOME_PATHS.example ? <ExampleJob path={page} />
        : page === OUTCOME_PATHS.status ? <JobStatusPage path={page} />
        : <header className="wrap bp-hero"><h1 className="bp-h1">This page doesn't exist</h1><p className="bp-sub">The address may have changed.</p><div className="bp-actions"><Link to={OUTCOME_PATHS.start} className="btn btn-primary">Start a job</Link></div></header>}
      </Suspense>
    </main>
  );
}
