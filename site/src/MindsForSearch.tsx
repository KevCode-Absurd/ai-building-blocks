import { useMemo } from "react";
import { type Catalogue, pathOf } from "./lib/data";
import { mindsFor, SEARCH_ROW_FLOOR, TOPIC_PROMINENCE } from "./lib/mind-match";
import { Link } from "./lib/router";

/** Above a library search's results: up to three minds clearly known for what was searched (lib/mind-match.ts),
 *  so a topic search also points to the people whose thinking fits it. Nothing shows when no mind is a clear fit. */
export default function MindsForSearch({ c, q }: { c: Catalogue; q: string }) {
  const minds = useMemo(() => mindsFor(c, [[q, 1]], 3, SEARCH_ROW_FLOOR, TOPIC_PROMINENCE), [c, q]);
  if (!minds.length) return null;
  return (
    <p className="small library-minds" data-testid="library-minds">
      {"Minds who know this: "}
      {minds.map(({ mind }, i) => <span key={mind.slug}>{i ? " · " : ""}<Link to={pathOf(mind)}>{mind.name.split(" (")[0]}</Link></span>)}
      {" · "}<Link to={`/minds?q=${encodeURIComponent(q)}`}>More minds</Link>
    </p>
  );
}
