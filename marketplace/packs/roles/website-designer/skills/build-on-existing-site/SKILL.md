---
name: build-on-existing-site
description: "Adds or rebuilds a page inside a client's existing Squarespace, Wix, Webflow, Framer, Shopify or WordPress site so it looks like the rest of the site, not like a fresh template. Captures the live site with tools/capture-brand-dna.mjs, chooses patch, extend or new, picks the section order from the site's own pages, the traffic source and the visitor's awareness, builds with the site's existing sections, blocks and global styles, then checks the result against the live site with tools/check-brand-fidelity.mjs. Use when a client with a builder site wants a new landing page, campaign page or a better version of one page."
---

# Build on the existing site

Builder templates pull every page toward the same layout. The client's existing pages are the better guide: visitors already know them and the brand already lives in them. This skill builds the new page from the site's own sections, blocks and global styles.

## When to use

- A new landing, campaign or service page on a site the client already runs.
- One page that underperforms and needs a better version (patch).
- Before the site-build-sheet skill, whenever the site already exists.

## What you need

**Access:** level 1 to read the live site, the template name and the builder's style settings. Level 2 to build a hidden, unpublished or duplicated page. Level 3 to publish it, within the client's limits, after step 7.

- The site address, the page to change or the closest page to match, and the builder and plan.
- The one action, where visitors come from and what that source promised.
- Any copy the client wants used; the rest comes from the captured site.

## Steps

1. **Capture.** Run `node tools/capture-brand-dna.mjs <site> <closest page>`, or paste `tools/brand-dna-snippet.js` into the browser console on each page. With neither, take full-page screenshots at desktop and phone width and read the builder's site styles panel. Save to `context/`.
2. **Map the site's own parts.** List the global styles in the builder's setting names (fonts per heading level, colours and what each is for, button style), the header and footer as they are, and the sections the closest page uses, in order, with the block or element in each.
3. **Choose the mode.** `patch` an existing page (duplicate it first), `extend` with a new page that reuses existing sections, or `new` only for a site with no pages to learn from. Say which and why.
4. **Choose the structure.** Start from the closest page's section order. Then adjust for the traffic source (ad promise in the first screen; search answer first; warm list offer first), the visitor's awareness, the category's conventions (timetable, menu, gallery, booking) and the real proof on hand. Write one line per section on why it is there. Cut any section that has no real content.
5. **Build with what the site has.** Duplicate existing sections and saved blocks before making new ones. Use the site's global styles, never page-level overrides that drift from them. Keep the site header and footer. Use the client's words and facts from the capture; mark only true gaps as [add].
6. **Keep clear of template defaults** listed in `tools/ai-default-patterns.md` unless the plan chooses one: the generic hero-cards-steps-testimonials-FAQ page, the template's stock hero, fade-up animation on every block, pill buttons on a square brand, a cream background swapped in for "premium".
7. **Check.** Run `node tools/check-brand-fidelity.mjs --brand context/brand-dna.json --page <preview link>` against the unpublished preview, or work through its manual checklist side by side with the live site at desktop and phone width. Review the side-by-side screenshots in a separate pass. Fix and re-check, then hand back.

## Checks

- Every section exists in the client's builder, version and plan.
- Header, footer, fonts, button style and colour proportions match the live site, or each change is stated.
- No invented prices, reviews or claims; true gaps are [add].
- The page works on a phone and the main action goes somewhere real.

## Output format

1. **Site map of parts:** global styles, header, footer and the closest page's sections.
2. **Mode and structure,** with one line per section on why.
3. **Build sheet** for the page in the builder's own names, with copy, images and links.
4. **Fidelity check** results with screenshots, and the action log for anything built or published.
