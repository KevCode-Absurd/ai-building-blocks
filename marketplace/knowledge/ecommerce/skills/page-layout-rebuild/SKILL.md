---
name: page-layout-rebuild
description: "Rebuilds the structure of a web page the owner likes (from a screenshot or URL) as clean HTML in the store's own brand. Reads and measures the reference fully before building, makes a structure version checked side by side against it, then, after the client's go, a branded version with the store's colours, fonts, copy, products and owned images, each brand choice tied to its source. Other brands' pages are structural reference only: a written rights check makes sure no copy, images, icons, fonts, logos or fake urgency are reused. Adds proven page fixes and a speed and mobile pass. Read access to build; publishing needs the client's yes."
---

# Page layout rebuild in the store's brand

**You get:** a structure version and a branded version of a reference page as clean HTML in the store's brand, with images, an optional Shopify section, a section inventory, a brand map and a rights check file.

An owner often sees a page they like and wants "one like that". The useful part of that page is its structure: what comes first, how proof is placed, how the eye moves. The words, photos, fonts and look belong to someone else. This skill reads the structure exactly, leaves the rest, and builds the page in the store's own brand.

## When to use

- The owner shares a screenshot or link of a product, landing or home page they like.
- A redesign needs a proven layout to start from.
- A page builder layout needs to become clean, fast HTML or a Shopify section.
- The store's own old page needs rebuilding in its new brand (a faithful copy is fine here, since the store owns it).

## Not for

- Writing a page from scratch around buyer doubts: use `reasons-to-buy-listicle-page` or `advertorial-story-page`.
- Auditing why a page converts poorly: use `storefront-conversion-audit` or `store-meta-landing`.
- Building the brand's colour and font tokens: use `store-visual-identity-sheet` first.
- Studying rivals' ads: use `store-meta-competitor`.

## What you need

Required:

1. **The reference**: a URL, or full-page screenshots at desktop width (about 1,440 px) and, ideally, phone width (about 390 px).
2. **Who owns it**: the store's own page, or another business's.
3. **Brand files**: colour and font tokens with their roles, logo, button style, from `store-visual-identity-sheet` or `store-meta-brand-dna`.
4. **The store's content**: product facts, price, offer, real reviews with names and sources, owned photos and video.

Optional: the page this replaces (URL and its GA4 or Shopify numbers), `product-claims-profile` output.

Access: read (level 1) to build. Installing on a duplicate theme needs draft access (level 2). Publishing needs the client's yes.

Missing input: ask once. Without a phone screenshot, build the phone layout from the desktop one and log "mobile interpreted". Without brand files, read colours and fonts from the store's live site and mark them "read from live site".

## Before you start: the gates

1. **Rights gate.** If the reference belongs to another business, only its structure is used: section order, grid, spacing, hierarchy, the kind of element in each slot. Its copy, photos, illustrations, icons, logos, custom fonts and distinctive look are not used. Fail: stop any step that would copy them.
2. **Honesty gate.** Countdown timers, stock counters, "as seen in" strips and review badges are kept only if the store's version is true (a real deadline, real stock, real press, a real review profile). Otherwise the slot is dropped.
3. **Content gate.** Every section kept has real store content to fill it. A section with nothing true to say is dropped.
4. **Money gate.** For a page taking paid traffic, gross profit per purchase is known so it can be judged on profit per session. Fail: build, but the test plan waits.

## Steps

### 1. Choose the reference wisely

Prefer pages from businesses one or two steps larger than the store whose layouts have lasted, over category giants with different needs [MCR-0034]. Note what the page is for (cold traffic, search traffic, returning buyers): structure follows traffic source [LPG-0050].

### 2. Read and measure everything before building

Building before the read is finished is where rebuilds go wrong. Fill an inventory first:

- **Sections**, top to bottom: number, job (prove, reassure, explain, compare, close), layout (columns, which side holds the image), background, height.
- **Measurements** taken off the screenshot, not guessed: content width, section padding, gaps, corner radii, button size, each image's aspect ratio.
- **Component checks:** check style (dark or light chips), review card layout and avatar shape, how the page closes (sticky bar or card), timeline style. These flip easily when built from memory.
- **Type scale:** headline, subhead and body sizes, weights, and the font style (serif or sans, wide or narrow).

About 60% of visitors may leave after the hero [LPG-0041], so record the first screen in most detail.

### 3. Build the structure version

One HTML file, one style block, no framework:

- every colour, font, weight, radius, shadow and width defined once as a variable at the top and used everywhere else, so rebranding changes values in one place;
- sections numbered to match the inventory;
- each image slot marked with its name and aspect ratio;
- text, tables, timelines and review cards built as real HTML, never as images.

For another business's page, use neutral greys and label every block with its job and size ("Headline, 6 to 9 words", "Product image, 4:5"). For the store's own page, use its real content.

Check it side by side with the reference at the same width, section by section: column split, image shapes, spacing, component style. Log every difference with its reason (font unavailable, mobile interpreted). Show the client the structure version and the difference log, and wait for their go and any changes.

### 4. Improve where the reference breaks proven levers

Change the structure only where it falls short, and list each change:

- First phone screen holds price, add to cart and a risk reducer; rating above the title; thumbnails visible [LPG-0034].
- Two kinds of proof in the first screen [LPG-0036]; risk reducers directly under the main button [LPG-0038].
- One lead benefit, matched to the ads that send traffic [LPG-0064].
- No links leading shoppers away from the product, such as category breadcrumbs on a paid landing page [LPG-0071].
- A clear order: outcome headline, proof above the fold, risk reducers, need, then proof and value sections [LPG-0048].

### 5. Build the branded version

Work in a copy. One change type at a time, checked before the next:

1. **Tokens.** Map each variable to a brand value and write the brand-guide line that justifies it. If the reference has more colours than the brand, map several variables to one brand colour; never invent shades. Check every text colour against its background for readable contrast. Headlines 3 to 4 times body size [LPG-0010].
2. **Copy.** Every text slot gets the store's own words, true and sourced, at roughly the reference's length so the layout holds.
3. **Images.** Owned or licensed photos only, real product, at each slot's aspect ratio, with alt text; a photo of one product never sits under another's name. Decorative textures with no brand equivalent are dropped. Any missing photo goes on a "not sourced" list and is collected before handover; no empty boxes ship.
4. **Fonts and icons.** The store's licensed fonts or open-licence fonts (for example from Google Fonts) with font-display swap; an open-licence icon set. Never self-host a commercial font without a web licence.
5. **Requested changes**, one at a time.

Compare the branded version with the structure version at the same width: same structure, only colour, type, copy and images differ, unless a change was asked for.

Optional Shopify delivery: a section file with scoped CSS and settings for every text and image, plus a page template, installed on a duplicate theme.

### 6. Speed and mobile pass

PageSpeed Insights on mobile plus a real phone. Pass marks (Core Web Vitals good): LCP 2.5 s or less, INP 200 ms or less, CLS 0.1 or less, no sideways scrolling. Fix images first (hero under about 200 KB, others about 100 KB, WebP or AVIF), then scripts [SPD-0002]; first image eager [SPD-0006]; bars and banners built into the page, not app add-ons that shift the layout [SPD-0007].

### 7. Rights check

Record before handover:

- **Copy:** compare the branded text with the reference; flag any run of 5 or more identical words and rewrite it, unless it is a stock phrase such as "add to cart". Practitioner default.
- **Images and video:** a source the store owns or licensed, per file.
- **Fonts, icons, illustrations:** licence named for each.
- **Look:** side by side, the page reads as the store's brand, not the reference brand with a new logo.

### 8. Plan the measurement

For a page that replaces another or takes paid traffic: compare against the old page or product page on revenue and gross profit per session, with UTMs and GA4 purchases counted. Size the test with `store-meta-test`, or compare four weeks before and after for small stores.

## Checks before you hand it over

- The inventory was complete before building, with measurements.
- The structure version was compared section by section and its differences logged.
- No copy, image, icon, logo or custom font from another business appears, and the rights check is complete.
- No timer, counter, badge or press strip is kept unless true.
- Every brand token has its source line; text contrast reads.
- Every structure change from step 4 is listed with its reason; mobile speed meets the good levels.
- Nothing is installed live or published without the client's yes.

## Output

**One-screen summary first:** what was kept from the reference (structure only), what was improved and why, what was dropped as untrue, speed results, the rights check result, and what the client must approve.

**Files:** `inventory.md`, `structure-[page].html`, `branded-[page].html`, `images/`, optional Shopify section and template, `rights-check.csv` (Asset, Type, Source, Licence, Status).

**Table "Section inventory":** Number, Section, Job, Layout, Kept, changed or dropped, Reason.

**Table "Brand map":** Variable, Structure value, Brand value, Source line in brand guide.

## Common mistakes

- **Building before reading.** Step 2 finishes the inventory and measurements first.
- **Copying the reference's words, photos or fake urgency.** The rights and honesty gates stop it.
- **Copying weak parts too.** Step 4 checks the structure against proven levers.
- **Inventing brand shades.** Step 5 maps several variables to one brand colour.
- **Unlicensed fonts**, or **a beautiful page that loads slowly.** Steps 5 and 6.
- **Leaving links that leak buyers** [LPG-0071].

## Sources

- LPG-0010: headline size.
- LPG-0034, LPG-0036, LPG-0038: first screen, two kinds of proof, risk reducers.
- LPG-0041: many visitors leave after the hero.
- LPG-0048: a landing page section order.
- LPG-0050: section order follows traffic source.
- LPG-0064: one benefit per page.
- LPG-0071: links away from the product lose sales.
- MCR-0034: study brands one or two steps bigger.
- SPD-0002, SPD-0006, SPD-0007: speed fixes.

What makes this skill ours: other brands' pages are used for structure only, enforced by a written rights check and an honesty gate on timers, badges and press; the reference is measured before anything is built and the structure is checked side by side; each brand choice is tied to its source; and the page must pass Core Web Vitals good levels before handover.
