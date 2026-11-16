// Page titles for the agent pages, shared by the Worker (src/pages.ts, the HTML it sends) and the browser app, which
// sets the same title once it starts, so search engines see one title either way. No imports: the app bundles this.

export const SITE_SUFFIX = " | AI Blocks";
export const AGENTS_TITLE = `Free AI agents by job role${SITE_SUFFIX}`;
export const GUIDES_TITLE = `Guides to free AI agent packs${SITE_SUFFIX}`;
export const CONNECT_TITLE = `Connect your AI to free AI agents${SITE_SUFFIX}`;
export const ECOMMERCE_TITLE = `AI agents for e-commerce stores${SITE_SUFFIX}`;

/** "Danielle, SEO strategist | Free AI agent | AI Blocks", or without "Free AI agent" when that runs long. */
export function agentTitle(name: string, title: string): string {
  const long = `${name}, ${title} | Free AI agent${SITE_SUFFIX}`;
  return long.length <= 65 ? long : `${name}, ${title}${SITE_SUFFIX}`;
}

/** "Profit per visitor check | E-commerce prompt | AI Blocks". When that runs past 65 it drops "E-commerce <kind>", then
 *  cuts the item's title at a word, so search results show the title whole. */
export function shelfTitle(itemTitle: string, kindOne: string): string {
  const full = `${itemTitle} | E-commerce ${kindOne}${SITE_SUFFIX}`;
  if (full.length <= 65) return full;
  const plain = `${itemTitle}${SITE_SUFFIX}`;
  if (plain.length <= 65) return plain;
  const room = 65 - SITE_SUFFIX.length - 1;
  const cut = itemTitle.slice(0, room);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(" "), room - 15)).replace(/[\s,.;:–-]+$/, "")}…${SITE_SUFFIX}`;
}

/** "Bookkeeper AI agents, free | AI Blocks". Long role names drop ", free", then any brackets, to stay within 65. */
export function roleTitle(roleName: string): string {
  const full = `${roleName} AI agents, free${SITE_SUFFIX}`;
  if (full.length <= 65) return full;
  const plain = `${roleName} AI agents${SITE_SUFFIX}`;
  if (plain.length <= 65) return plain;
  return `${roleName.replace(/\s*\([^)]*\)/g, "")} AI agents${SITE_SUFFIX}`;
}
