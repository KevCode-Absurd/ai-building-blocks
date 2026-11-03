// A "Skip it when" line split into plain text and links to the items it names. The links come from the index build
// (page JSON `not_for_links`: { line, start, end, href }, made by tools/lib/not-for-links.mjs). Used by the item page and
// by the prerendered HTML, so crawlers see the same links.

/**
 * @param {string} line
 * @param {{ line: number, start: number, end: number, href: string }[] | undefined} links
 * @param {number} lineIndex the line's place in the page's own not_for list
 * @returns {{ text: string, href?: string }[]}
 */
export function notForParts(line, links, lineIndex) {
  const text = String(line ?? "");
  const mine = (Array.isArray(links) ? links : [])
    .filter((l) => l && l.line === lineIndex && typeof l.href === "string" && l.href.startsWith("/") && l.start >= 0 && l.end <= text.length && l.start < l.end)
    .sort((a, b) => a.start - b.start);
  const parts = [];
  let at = 0;
  for (const l of mine) {
    if (l.start < at) continue;
    if (l.start > at) parts.push({ text: text.slice(at, l.start) });
    parts.push({ text: text.slice(l.start, l.end), href: l.href });
    at = l.end;
  }
  if (at < text.length || !parts.length) parts.push({ text: text.slice(at) });
  return parts;
}
