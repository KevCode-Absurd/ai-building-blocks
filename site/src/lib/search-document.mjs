import { classificationText } from './catalogue-taxonomy.mjs';
import { searchIntentExclusions } from './library-search-intents.ts';

const plain = value => String(value ?? '').replace(/<[^>]*>/g, ' ').replace(/&(?:amp|lt|gt|quot|apos|#39|nbsp);/g, value => ({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&#39;': "'", '&nbsp;': ' ' })[value]);
const texts = value => Array.isArray(value) ? value.filter(v => typeof v === 'string').map(plain) : typeof value === 'string' ? [plain(value)] : [];

/** One evidence model for quick results, the full index and every item format.
 * Subject labels are reviewed metadata, never a list of pinned search results.
 * Navigation, credits and recommended other items do not establish purpose. */
export function makeSearchDocument(block, page = {}, { body = '', extraText = '' } = {}) {
  const titles = [block.name, block.headline, page.headline, ...(block.topics ?? []), ...(block.type === 'mind' ? [block.identity] : [])].filter(Boolean).map(plain);
  const summaries = [block.summary, block.description, page.subhead, page.description, ...texts(page.when), ...texts(page.you_get),
    ...(block.type === 'mind' ? [...(page.ideas ?? []).map(idea => idea.title), ...(page.hire?.jobs ?? []).map(job => job.title)] : [])].filter(Boolean).map(plain);
  const introductions = [plain(page.explain), plain(page.html?.explain), ...texts(page.intro)].filter(Boolean);
  const metadata = [block.type ?? 'skill', block.category ?? 'general', block.task ?? '', block.job ?? '', classificationText(block), extraText].filter(Boolean);
  return { slug: block.slug, kind: block.type === 'routine' || block.category === 'orchestrator' ? 'workflow' : block.type ?? 'skill', excludeIntents: searchIntentExclusions(block.task ?? '', block.tasks ?? []),
    title: [...new Set([...titles, block.slug, ...(block.aliases ?? [])])].join(' '), summary: summaries.join(' '), intro: introductions.join(' '), ...(body ? { body } : {}),
    metadata: metadata.join(' '), purpose: { title: [...new Set(titles)], summary: summaries, intro: introductions, metadata } };
}

/** Mini tools (calculators at /tools/<slug>) in the same search, as kind "tool". Their index key keeps them apart
 *  from catalogue slugs, as in the public API (scripts/build-public-api.mjs). */
export const miniToolKey = slug => `minitool-${slug}`;
export const miniToolSlug = key => key.startsWith('minitool-') ? key.slice('minitool-'.length) : null;
export function makeToolSearchDocument(tool) {
  const titles = [tool.name, tool.short, tool.headline].filter(Boolean).map(plain), summaries = [tool.summary, tool.question].filter(Boolean).map(plain);
  const metadata = [`${tool.category ?? ''} mini tool free calculator`];
  return { slug: miniToolKey(tool.slug), kind: 'tool', title: [...new Set([...titles, tool.slug])].join(' '), summary: summaries.join(' '), metadata: metadata.join(' '),
    purpose: { title: [...new Set(titles)], summary: summaries, metadata } };
}
