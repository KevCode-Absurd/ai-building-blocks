import { Link } from "./lib/router";
import { notForParts } from "./lib/not-for-parts.mjs";
import "./similar-items.css";

/** One row of "Similar items and how they differ" (page JSON `siblings`, made by scripts/lib/similar-items.mjs). */
export type SiblingRow = { slug: string; name: string; href: string; summary: string; give: string[]; get: string[]; start?: true };
export type NotForLink = { line: number; start: number; end: number; href: string };

/** A "Skip it when" line, with the items it names as links (page JSON `not_for_links`). */
export function SkipLine({ text, links, index }: { text: string; links?: NotForLink[]; index: number }) {
  return <>{notForParts(text, links, index).map((p, i) => (p.href ? <Link key={i} to={p.href} data-testid="skip-link">{p.text}</Link> : <span key={i}>{p.text}</span>))}</>;
}

/** Near-duplicates in the same job, side by side, with the one to start with marked. */
export default function SimilarItems({ rows, self }: { rows?: SiblingRow[]; self: string }) {
  if (!Array.isArray(rows) || rows.length < 2) return null;
  return (
    <div className="bp-similar" data-testid="similar-items">
      <h3 className="bp-h3">Similar items and how they differ</h3>
      <p className="bp-note">These do a similar job. Not sure which one? Try the one marked Start here.</p>
      <table className="bp-similar-table">
        <thead><tr><th scope="col">Item</th><th scope="col">What it does</th><th scope="col">You give</th><th scope="col">You get</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.slug} className={r.slug === self ? "is-self" : undefined}>
              <th scope="row" data-label="Item">
                {r.slug === self ? <span aria-current="page">{r.name}</span> : <Link to={r.href}>{r.name}</Link>}
                {r.start && <span className="bp-similar-start" data-testid="start-here">Start here</span>}
                {r.slug === self && <span className="bp-similar-self">This page</span>}
              </th>
              <td data-label="What it does">{r.summary}</td>
              <td data-label="You give">{r.give.length > 0 && <ul>{r.give.map((x, i) => <li key={i}>{x}</li>)}</ul>}</td>
              <td data-label="You get">{r.get.length > 0 && <ul>{r.get.map((x, i) => <li key={i}>{x}</li>)}</ul>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
