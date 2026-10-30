import {decodeWire, pathOf, type Block, type Page} from './data';

const cache = new Map<string, {block: Block; page: Page} | null>();
/** Public, build-owned header data only. It never supplies account state or task authority. */
export function readItemOpening(slug: string): {block: Block; page: Page} | null {
  const element = document.getElementById('abb-item-opening');
  if (!element || element.getAttribute('type') !== 'application/json') return null;
  const key = `${location.pathname}:${slug}`;
  if (cache.has(key)) return cache.get(key)!;
  let result: {block: Block; page: Page} | null = null;
  try {
    const text = element.textContent ?? '';
    if (text.length > 32000) throw Error('Oversized public opening');
    const data = JSON.parse(text);
    if (data.schema !== 1 || data.path !== location.pathname || data.slug !== slug || data.block?.slug !== slug
      || typeof data.block.name !== 'string' || typeof data.block.summary !== 'string' || !data.page
      || ['headline', 'subhead', 'added'].some(key => data.page[key] !== undefined && typeof data.page[key] !== 'string')) throw Error('Invalid public opening');
    const block = decodeWire({blocks: [data.block]} as Parameters<typeof decodeWire>[0]).bySlug[slug];
    if (pathOf(block) !== location.pathname) throw Error('Opening belongs to another route');
    result = {block, page: data.page};
  } catch { /* Invalid or absent data keeps the normal catalogue loading path. */ }
  cache.set(key, result);
  return result;
}
