import { Link } from "../lib/router";
import { OUTCOME_PATHS } from "./owner-message";

const TABS = [
  [OUTCOME_PATHS.start, "Start a job"],
  [OUTCOME_PATHS.example, "See an example"],
  [OUTCOME_PATHS.status, "Where my job stands"],
] as const;

/** The three owner pages, side by side. */
export function OutcomeTabs({ path }: { path: string }) {
  return (
    <nav className="gd-tabs" aria-label="Get it done">
      {TABS.map(([to, label]) => <Link key={to} to={to} aria-current={path === to ? "page" : undefined}>{label}</Link>)}
    </nav>
  );
}
