type Metadata = { title: string; description: string; canonical: string; robots: string; graph: unknown; markdown?: string | null; json?: string | null; image?: string };
const SITE = 'https://useaiblocks.com';
const cache = new Map<string, Metadata>();
let active: { data: Metadata; path: string } | null = null;
const normalize = (p: string) => p.length > 1 ? p.replace(/\/+$/, '') : '/';
const initialPath = normalize(location.pathname);
const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
if (canonical === SITE + initialPath) {
  const get = (s: string) => document.querySelector<HTMLMetaElement>(s)?.content || '';
  let graph: unknown = null;
  try { graph = JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent || 'null'); } catch { /* Replaced on navigation. */ }
  cache.set(initialPath, { title: document.title, description: get('meta[name="description"]'), canonical, robots: get('meta[name="robots"]') || 'max-image-preview:large, max-snippet:-1', graph, image: get('meta[property="og:image"]'), markdown: document.querySelector<HTMLLinkElement>('link[rel="alternate"][type="text/markdown"]')?.getAttribute('href'), json: document.querySelector<HTMLLinkElement>('link[rel="alternate"][type="application/json"]')?.getAttribute('href') });
}
function setMeta(attribute: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!el) { el = document.createElement('meta'); el.setAttribute(attribute, key); document.head.append(el); }
  el.content = content;
  document.querySelectorAll(`meta[${attribute}="${key}"]`).forEach(other => { if (other !== el) other.remove(); });
}
function apply(data: Metadata, path: string) {
  active = { data, path };
  document.title = data.title;
  setMeta('name', 'description', data.description); setMeta('name', 'robots', data.robots);
  for (const [key, value] of Object.entries({ title: data.title, description: data.description, url: data.canonical, image: data.image || SITE + '/og/default.png' })) setMeta('property', 'og:' + key, value);
  for (const [key, value] of Object.entries({ title: data.title, description: data.description, image: data.image || SITE + '/og/default.png' })) setMeta('name', 'twitter:' + key, value);
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.append(link); }
  link.href = data.canonical;
  document.querySelectorAll('script[type="application/ld+json"],link[rel="alternate"][type="text/markdown"],link[rel="alternate"][type="application/json"]').forEach(el => el.remove());
  if (data.graph && !data.robots.includes('noindex')) { const el = document.createElement('script'); el.type = 'application/ld+json'; el.textContent = JSON.stringify(data.graph); document.head.append(el); }
  // Item pages link their Markdown and JSON twins (src/server/twins.ts); older records link the skill file.
  if (data.markdown) { const el = document.createElement('link'); el.rel = 'alternate'; el.type = 'text/markdown'; el.href = data.markdown; el.title = data.json ? 'Markdown version' : 'The skill file'; document.head.append(el); }
  if (data.json) { const el = document.createElement('link'); el.rel = 'alternate'; el.type = 'application/json'; el.href = data.json; el.title = 'JSON version'; document.head.append(el); }
  document.documentElement.dataset.metadataPath = path;
}
// Some independently loaded pages still set their title after fetching data.
// Keep the generated route record authoritative when those late effects run.
const headObserver = new MutationObserver(() => {
  if (!active || normalize(location.pathname) !== active.path) return;
  const { data, path } = active;
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content;
  const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content;
  if (document.title !== data.title || description !== data.description || robots !== data.robots) apply(data, path);
});
headObserver.observe(document.head, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['content'] });
/** Static HTML and SPA navigation share one small build-generated route record. */
export function syncPageMetadata(input: string) {
  const path = normalize(input), controller = new AbortController();
  if (path.startsWith('/community/')) {
    apply({ title: 'Community skill or workflow · AI Blocks', description: 'Read a reviewed community submission and inspect its complete files before use.', canonical: SITE + path, robots: 'noindex, nofollow', graph: null }, path);
    return () => controller.abort();
  }
  if (['/account', '/sign-up', '/sign-in'].includes(path)) {
    apply({ title: (path === '/account' ? 'My account' : path === '/sign-up' ? 'Create an account' : 'Sign in') + ' · AI Blocks', description: 'Your saved kits, skills, workflows and account settings in one place.', canonical: SITE + path, robots: 'noindex, nofollow', graph: null }, path);
    return () => controller.abort();
  }
  const privatePage = path === '/space' || path.startsWith('/s/') || ['/publish', '/my-submissions', '/admin/review'].includes(path);
  setMeta('name', 'robots', privatePage ? 'noindex, nofollow' : 'max-image-preview:large, max-snippet:-1');
  if (cache.has(path)) { apply(cache.get(path)!, path); return () => controller.abort(); }
  const key = path.startsWith('/s/') ? 'shared-space-shell' : path === '/' ? 'index' : path.slice(1);
  void (async () => {
    try {
      if (!/^[a-zA-Z0-9_/-]+$/.test(key) || key.split('/').includes('..')) throw Error('Unknown route');
      const response = await fetch('/metadata/' + key + '.json', { signal: controller.signal, cache: 'no-cache' });
      if (!response.ok || !response.headers.get('content-type')?.includes('json')) throw Error('Unknown route');
      const data = await response.json() as Metadata;
      if (controller.signal.aborted || normalize(location.pathname) !== path) return;
      if (privatePage) { data.robots = 'noindex, nofollow'; data.canonical = SITE + path; data.graph = null; }
      cache.set(path, data); apply(data, path);
    } catch {
      if (controller.signal.aborted || normalize(location.pathname) !== path) return;
      apply({ title: 'Page not found · AI Blocks', description: 'This page could not be found. Browse the library for a useful skill, workflow or tool.', canonical: SITE + path, robots: 'noindex, nofollow', graph: null }, path);
    }
  })();
  return () => controller.abort();
}

export function communityPageMetadata(title: string, description: string) {
  const path = normalize(location.pathname);
  if (!path.startsWith('/community/')) return;
  apply({ title: title + ' · AI Blocks', description, canonical: SITE + path, robots: 'max-image-preview:large, max-snippet:-1', graph: null }, path);
}
