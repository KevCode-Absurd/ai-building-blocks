// The prerendered HTML for "Skip it when" lines with their item links, and for "Similar items and how they differ",
// so crawlers and readers without JavaScript see the same links as the app (BlockPage.tsx, SimilarItems.tsx).
import { notForParts } from "../../src/lib/not-for-parts.mjs";

/** Each not_for line as HTML: plain text escaped, item names as links. Lines that are not text are skipped. */
export function skipWhenItems(page, esc) {
  const lines = Array.isArray(page?.not_for) ? page.not_for : page?.not_for ? [page.not_for] : [];
  return lines.map((line, i) => (typeof line === "string" && line.trim()
    ? notForParts(line, page.not_for_links, i).map((p) => (p.href ? `<a href="${esc(p.href)}">${esc(p.text)}</a>` : esc(p.text))).join("")
    : null)).filter((x) => x !== null);
}

/** The table of near-duplicates in one job (page JSON `siblings`), or "" when there is none. */
export function similarHtml(rows, self, esc) {
  if (!Array.isArray(rows) || rows.length < 2) return "";
  const ul = (xs) => (Array.isArray(xs) && xs.length ? `<ul>${xs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "");
  const body = rows.map((r) => `<tr><th scope="row">${r.slug === self ? `<span aria-current="page">${esc(r.name)}</span>` : `<a href="${esc(r.href)}">${esc(r.name)}</a>`}${r.start ? " <b>Start here</b>" : ""}${r.slug === self ? " (this page)" : ""}</th><td>${esc(r.summary)}</td><td>${ul(r.give)}</td><td>${ul(r.get)}</td></tr>`).join("");
  return `<div id="similar"><h3>Similar items and how they differ</h3><p>These do a similar job. Not sure which one? Try the one marked Start here.</p><table><thead><tr><th scope="col">Item</th><th scope="col">What it does</th><th scope="col">You give</th><th scope="col">You get</th></tr></thead><tbody>${body}</tbody></table></div>`;
}
