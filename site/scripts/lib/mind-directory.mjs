const PAGE_SIZE = 24;
const esc = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export const mindDirectoryUrl = page => page === 1 ? '/minds' : `/minds/page/${page}`;
export function mindDirectoryUrls(minds) {
  return Array.from({length: Math.ceil(minds.length / PAGE_SIZE)}, (_, index) => mindDirectoryUrl(index + 1));
}
/** A bounded HTML directory. Every profile stays reachable without JavaScript. */
export function mindDirectory(url, minds) {
  const page = url === '/minds' ? 1 : Number(url.match(/^\/minds\/page\/([1-9]\d*)$/)?.[1] ?? 0);
  const pages = mindDirectoryUrls(minds);
  if (!page || page > pages.length || url !== mindDirectoryUrl(page)) return null;
  const rows = minds.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const nav = `<nav class="hub-pages" aria-label="Mind directory pages">${pages.map((href, index) => index + 1 === page ? `<b aria-current="page">Page ${page}</b>` : `<a href="${href}">Page ${index + 1}</a>`).join('')}</nav>`;
  const body = `${nav}<ul class="hub-list">${rows.map(mind => `<li><a href="/minds/${mind.slug}">${esc(mind.name)}</a>${mind.identity ? `<span>${esc(mind.identity)}</span>` : ''}<span>${esc(mind.summary)}</span></li>`).join('')}</ul>${nav}`;
  return {page, pages: pages.length, rows, body,
    main: {'@type': 'ItemList', numberOfItems: rows.length, itemListElement: rows.map((mind, index) => ({'@type': 'ListItem', position: (page - 1) * PAGE_SIZE + index + 1, name: mind.name, url: `https://useaiblocks.com/minds/${mind.slug}`}))},
    title: `AI minds for work and learning: directory page ${page}`,
    documentTitle: `AI minds for work and learning: page ${page} | AI Blocks`,
    h1: `Explore AI minds: page ${page}`,
    desc: `Browse mind profiles ${1 + (page - 1) * PAGE_SIZE} to ${Math.min(page * PAGE_SIZE, minds.length)} of ${minds.length}. Find a thinker's methods, questions and source files to help with work, learning and creative projects.`};
}
