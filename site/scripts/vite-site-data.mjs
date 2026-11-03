// Build-time helpers for the site's data files (vite.config.ts).
// catalogueAsset: the full catalogue gets a content-hashed copy under /assets, cached for a year, so a returning
//   visitor never downloads the same 4 MB twice and a new build is never served stale. /data/blocks.json stays for
//   the worker, the API and scripts. The dev server keeps using /data/blocks.json.
// toolNextSteps: the names and addresses of the library items the mini tools suggest next, resolved when the site is
//   built, so a calculator page needs no catalogue download.
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

export const catalogueAssetName = (bytes) => `assets/blocks-${createHash('sha256').update(bytes).digest('hex').slice(0, 16)}.json`;

export function catalogueAsset({ root }) {
  let url = '/data/blocks.json', source = null;
  return {
    name: 'catalogue-asset',
    config(_, { command }) {
      const file = path.join(root, 'public/data/blocks.json');
      if (command === 'build' && fs.existsSync(file)) { source = fs.readFileSync(file); url = '/' + catalogueAssetName(source); }
      return { define: { __CATALOGUE_URL__: JSON.stringify(url) } };
    },
    generateBundle() { if (source) this.emitFile({ type: 'asset', fileName: url.slice(1), source }); },
    // index.html starts the catalogue download early on some pages; it must ask for the same file the app reads.
    transformIndexHtml(html) { return source ? html.replaceAll('"/data/blocks.json"', JSON.stringify(url)) : html; },
  };
}

const kindPath = (b) => b.type === 'mind' ? 'minds' : b.type === 'agent' ? 'agents' : b.category === 'orchestrator' || b.type === 'workflow' || b.type === 'routine' ? 'workflows' : b.type === 'prompt' ? 'prompts' : 'skills';

/** { slug: { name, path } } for every slug a tool names in `next`, following renames. Unknown slugs are left out. */
export function nextStepLinks(tools, catalogue) {
  const bySlug = new Map((catalogue?.blocks ?? []).map((b) => [b.slug, b]));
  const out = {};
  for (const tool of tools) for (const step of tool.next ?? []) {
    const b = bySlug.get(step.slug) ?? bySlug.get(catalogue?.renamed?.[step.slug]);
    if (b) out[step.slug] = { name: b.name, path: `/${kindPath(b)}/${b.slug}` };
  }
  return out;
}

export function toolNextSteps({ root }) {
  const id = 'virtual:tool-next-steps', resolved = '\0' + id;
  return {
    name: 'tool-next-steps',
    resolveId(source) { return source === id ? resolved : undefined; },
    async load(loaded) {
      if (loaded !== resolved) return;
      const file = path.join(root, 'public/data/blocks.json');
      const { TOOLS } = await import(new URL('../../mini-tools/index.mjs', import.meta.url).href);
      let catalogue = null;
      if (fs.existsSync(file)) { this.addWatchFile(file); catalogue = JSON.parse(fs.readFileSync(file, 'utf8')); }
      return `export default ${JSON.stringify(nextStepLinks(TOOLS, catalogue))};`;
    },
  };
}
