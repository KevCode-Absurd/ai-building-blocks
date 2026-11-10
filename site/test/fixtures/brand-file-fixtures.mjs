// Fixtures for the brand file tool: a small test shop on a reserved test host, in the shape capture-brand-dna.mjs
// writes, plus the older written files the tool can build from. Nothing here describes a real business.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { mergeBrand } from '../../../catalogue-items/general/brand-dna-capture/scripts/capture-brand-dna.mjs';

export const SITE = 'https://shop.example.test';
export const tempContext = () => path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'brand-file-')), 'context');

const role = (family, weight, size, transform = 'none') => ({ family, weight, size, transform, font_loaded: true });
/** One captured page, as capturePage() returns it. */
export function page({ pathname = '/', at, prices = [], offers = [], shipping = [], guarantees = [], reviews = [], structured = [], headlines = ['Shoes made from trees'], body = ['We make shoes from natural materials.'], ctas = ['SHOP NOW'], h1 = 'Test Serif', fill = '#112233', error = null }) {
  const url = SITE + pathname;
  if (error) return { path: pathname, url, slug: 'p', captured_at: at, screenshots: {}, pixel_palette: {}, desktop: { error }, mobile: { error } };
  const desktop = {
    page: { title: 'Test shop', url, path: pathname, platform: null },
    palette: [{ hex: '#FFFFFF', area_share: 0.62, text_share: 0, roles: ['background'] }, { hex: fill, area_share: 0.09, text_share: 0.8, roles: ['text', 'primary-button'] }, { hex: '#F6B74D', area_share: 0.004, text_share: 0, roles: ['link', 'accent'] }],
    type: { roles: { h1: role(h1, '500', '48px'), h2: role(h1, '500', '30px'), body: role('Test Sans', '400', '16px'), button: role('Test Sans', '600', '14px', 'uppercase'), nav: role('Test Sans', '500', '14px') }, families: [{ family: 'Test Sans', family_raw: 'Test Sans', char_share: 0.8, weights: ['400'], sizes: ['16px'] }, { family: h1, family_raw: h1, char_share: 0.2, weights: ['500'], sizes: ['48px'] }], loaded_fonts: [], font_files: ['https://shop.example.test/fonts/test-sans.woff2'], font_css: null, scale: [] },
    shape: { radius: [{ value: '4px', count: 12 }, { value: '0px', count: 3 }], shadows: [], square_elements: 40, painted_elements: 120 },
    buttons: { styles: [{ bg: fill, color: '#FFFFFF', radius: '4px', transform: 'uppercase', border: 'none', font: 'Test Sans', weight: '600', size: '14px', count: 6, primary: true, examples: ['SHOP NOW', 'ADD TO CART'] }], primary: { text: 'SHOP NOW' } },
    links: [{ color: '#F6B74D', underline: true }],
    nav: { items: [{ text: 'Men' }, { text: 'Women' }, { text: 'Sale' }], hidden_items: [], hamburger: false, has_cart: true },
    footer: { columns: [{ heading: 'Help', links: [] }, { heading: 'Company', links: [] }], link_count: 14 },
    sections: [{ kind: 'hero', heading: headlines[0] }, { kind: 'product-grid', heading: 'Bestsellers' }, { kind: 'footer', heading: null }],
    images: { count: 34, per_1000px: 6, area_share: 0.41 },
    voice: { samples: [...headlines.map((text) => ({ kind: 'headline', text })), ...body.map((text) => ({ kind: 'body', text }))], headlines, ctas, stats: {} },
    facts: { captured_at: at, url, prices, offers, shipping, guarantees, reviews, structured },
    css_variables: [], notes: [],
  };
  return { path: pathname, url, slug: pathname === '/' ? 'home' : pathname.slice(1).replace(/\W+/g, '-'), captured_at: at, title: 'Test shop', screenshots: {}, pixel_palette: {}, desktop, mobile: null };
}
/** A whole capture file (context/brand-dna.json) from pages. */
export function capture(pages, at, extra = {}) {
  const out = { schema: 'ai-blocks-brand-dna/1', tool: 'capture-brand-dna.mjs test', method: 'script', source: SITE + '/', captured_at: at, notes: [], brand: null, pages, ...extra };
  out.brand = mergeBrand(pages, out);
  return out;
}
const product = (name, price, availability = 'https://schema.org/InStock', rating = null) => ({ type: 'Product', name, price, currency: 'USD', availability, rating, review_count: rating ? 1200 : null });
/** The first capture: home and one product page, read on 1 November 2026. */
export const firstCapture = (at = '2026-11-01T09:00:00.000Z') => capture([
  page({ at, shipping: ['Free shipping on orders over $75'], guarantees: ['30 days to return or exchange'], reviews: ['Rated 4.8 by 12,000 customers'], offers: ['Autumn sale: 20% off boots'] }),
  page({ pathname: '/products/runner', at, prices: ['$98'], structured: [product('Runner', '98', 'https://schema.org/InStock', '4.7')], headlines: ['The Runner'], body: ['Light, breathable and machine washable.'], ctas: ['ADD TO CART'] }),
], at);
/** The same two pages nine days later: the price rose, the sale ended, a new offer started and the Runner sold out. */
export const secondCapture = (at = '2026-11-10T09:00:00.000Z') => capture([
  page({ at, shipping: ['Free shipping on orders over $75'], guarantees: ['30 days to return or exchange'], reviews: ['Rated 4.8 by 12,000 customers'], offers: ['Free socks with every pair this week'] }),
  page({ pathname: '/products/runner', at, prices: ['$110'], structured: [product('Runner', '110', 'https://schema.org/OutOfStock', '4.7')], headlines: ['The Runner'], body: ['Light, breathable and machine washable.'], ctas: ['ADD TO CART'] }),
], at);
export const writeCapture = (ctx, dna) => { fs.mkdirSync(ctx, { recursive: true }); fs.writeFileSync(path.join(ctx, 'brand-dna.json'), JSON.stringify(dna, null, 1)); };

/** The older written files a job left in context/. */
export const WRITTEN = {
  'facts.md': '# Facts\n\nCaptured 9 Nov 2026.\n\n- Founded in 2016 (source: https://shop.example.test/about)\n- Runner costs $98 | https://shop.example.test/products/runner | 2026-11-09\n- Ships to 12 countries [confirmed: shipping page, 2026-11-02]\n- Most buyers are runners aged 25 to 40 [inferred]\n',
  'voice.md': '# Voice\n\n## Brand lines\n- "Better things in a better way" (source: https://shop.example.test/about) 2026-11-09\n- Made from trees, not oil.\n\n## Customer words\n- "I forgot I was wearing them"\n',
  'references.md': '# References\n\n- Brand one: clean product pages, one action per screen.\n',
  'taste-brief.md': '# Taste brief\n\n- Brand codes to keep: uppercase buttons, white page, small marigold accent.\n- Admire: plain product photography on white.\n- Avoid: cream "premium" bands and rounded cards.\n',
};
/** The old eight-file folder ("brand brain"). */
export const OLD_FOLDER = {
  '00-start-here.md': '# Start here\n\nTest shop sells shoes. Load offers.md for prices.\n',
  'business.md': '# Business\n\n- Sells shoes made from natural materials [confirmed: home page, 2026-10-20]\n- Stage: established [inferred]\n',
  'offers.md': '# Offers\n\n## Runner\n- One-time $98 [confirmed: product page, 2026-10-20]\n- Free returns for 30 days [confirmed: product page, 2026-10-20]\n',
  'customers.md': '# Customers\n\n- "I wear them every day" [confirmed: review R1, 2026-10-20]\n- Buys after trying a friend\'s pair [unknown: founder]\n',
  'proof-and-claims.md': '# Proof and claims\n\n| Claim | Status |\n|---|---|\n| Machine washable | approved [confirmed: product page, 2026-10-20] |\n',
  'voice-and-look.md': '# Voice and look\n\n- Plain and warm, never cheeky.\n- Colours: #112233 for text and buttons.\n- Fonts: Test Serif for headlines.\n',
  'market.md': '# Market\n\n- Brand two: cheaper, less durable.\n',
  'log.md': '# Log\n\n- 2026-10-21: the owner dropped the discount-led headline.\n',
};
export function writeFiles(dir, files) { fs.mkdirSync(dir, { recursive: true }); for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), text); }
