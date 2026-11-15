---
name: store-visual-identity-sheet
description: "Turn the store's live theme into one visual identity sheet that designers, freelancers and AI image tools all follow. Reads colours, fonts, spacing, corner radius, buttons, cards and badges straight from the Shopify theme settings and the live site's CSS, checks every text and button colour pair for accessible contrast, flags inconsistencies (near-duplicate colours, stray fonts, mixed button styles, heavy images) with a fix for each, and delivers a printable guide plus a flat token file and a ready prompt block for image tools. Use for a new designer or agency, before an ad or photo batch, after a theme change, or when the site looks patched together. Read access only."
---

# Visual identity sheet from the live theme

**You get:** a printable visual identity guide of 6 to 10 pages, a tokens.json file with a CSS variables block, and a fix table for contrast and other problems, ready for designers and image tools.

This skill reads what the store actually ships, not what an old brand deck says, and writes it down as tokens anyone can use. It also finds what is broken: colours that fail contrast, five shades of the same green, three button styles. A sheet that only documents a mess spreads the mess.

## When to use

- A new designer, freelancer or agency starts work and needs exact values.
- Before an ad, email or photo batch, so every piece matches the site.
- After a theme change or app install, to catch drift.
- The site looks patched together and the owner wants one standard.
- AI image tools keep producing off-brand colours and the team needs one prompt block.

## Not for

- Voice, story and customer words: use `store-knowledge-folder`.
- A brand profile for Meta ads: use `store-meta-brand-dna`.
- Fixing the page layout or what sells on a page: use `store-meta-landing`.
- A new logo or rebrand: that is a design project, not a read of the current theme.

## What you need

**Required**

- The live store URL. You will read the home page, one collection page, one product page, the cart and one policy page, at phone (390 px wide) and desktop (1440 px) sizes.
- Theme values, by one of these routes (best first):
  1. The theme files. In Shopify admin, Online Store, Themes, the theme's menu, "Download theme file" emails a zip; `config/settings_data.json` holds the chosen values (colour schemes, font handles such as `assistant_n4`, button radius) and `config/settings_schema.json` names them.
  2. A staff account with theme read access, so you can open "Edit code" and read the same files.
  3. No access: read the live CSS. Open the browser developer tools on each page; most current themes set CSS custom properties on `:root` (colours, font families, radius), and computed styles on buttons, headings and body text give the rest.
- Any existing brand notes or guide, and the logo files the owner has (SVG or high-resolution PNG).

**Optional**

- Figma or Canva brand kit, email template, packaging files.
- PageSpeed Insights report for the home and top product page.

**When something is missing.** Ask once for the theme file and logo originals. Without them, work from the live CSS and say "read from the live site, not theme settings" at the top. A logo taken from the site header is marked "web copy, not original".

**Access.** Level 1, read. Never edit the theme. Fixes go in a change list the owner approves; making them needs draft access (a duplicate theme) and publishing them needs the owner's yes.

## Before you start: the gates

1. **Money gate: not needed for the sheet, needed for the fix order.** This job ranks fixes by where buyers see them, not by product profit. If `store-knowledge-folder` has a products table, rank product page fixes on the top products by gross profit per purchase first. If not, rank by traffic.
2. **Capacity.** Ask who will apply fixes (owner, developer, agency) and how many hours they have. Fail: still deliver the sheet; mark fixes "no one to apply yet" and keep the list to the top five.
3. **The theme you read is the live one.** Check the theme name in admin matches the published theme, or that the CSS you read came from the live URL. Fail: stop and read the published theme; a draft theme gives a wrong sheet.

## Steps

### 1. Pull every value the store uses

From `settings_data.json` or the live CSS, list: every colour (hex), where it is used (background, text, button, link, sale badge, border), every font family and weight, the body and heading sizes on phone and desktop, spacing values (section padding, grid gap), corner radius on buttons, cards, inputs and images, and shadow styles. Record the source of each value (file and key, or page and CSS selector) and the date.

### 2. Name roles, not just colours

Give each colour one job: primary action, text, background, surface, border, sale, success, error. A colour with no job, or a job with three colours, is a finding. Write the font pairing as heading font and body font with weights, where each loads from (Google Fonts, self-hosted, system) and whether the store holds the licence for print and ads, and the type scale from the smallest to the largest size actually used.

Then write one plain line of reasoning per section, so designers know why and not only what: the two ideas the palette carries, the job each font does, and the section rhythm (how page sections alternate light and dark backgrounds). A guide that only lists hex codes gets followed loosely.

Check the size step between body and headline. Hero headlines about three to four times the body size read well on desktop [LPG-0010]; on phone, long headlines at that size push the button off the first screen, so scale down there.

### 3. Check contrast on every real pair

For each text colour on its real background, and each button label on its button, compute the contrast ratio (WCAG relative luminance formula; any free contrast checker gives the same number). Pass marks from WCAG 2.2: 4.5:1 for normal text, 3:1 for large text (about 24 px, or about 19 px bold) and 3:1 for button edges, input borders and icons that carry meaning. Common fails on stores: white text on a light brand colour, grey placeholder text, sale prices in light red, text laid over photos. For each fail, give the nearest passing shade in the same hue so the brand still looks like itself.

### 4. Flag inconsistencies, each with a fix

Practitioner defaults, test them:

- **Near-duplicate colours:** two hex values that look the same to the eye (for example `#1F3B2D` and `#203C2E`). Merge to one.
- **More than two font families**, or weights loaded but never used. Each extra font file slows the page.
- **More than one primary button style** (size, radius, colour or case differ between pages). Pick the one on the product page; it carries the money.
- **Mixed corner radius** across buttons, cards and inputs. Pick one or two values.
- **Elements injected by apps** that ignore the theme's fonts and colours (review widgets, free shipping bars, pop-ups). These also cause layout shift when they load late [SPD-0007].

### 5. Check the image rules the sheet will set

Images are part of the identity and the biggest weight on the page. Set the rules: upload around 2,000 px wide and compress under 500 KB, ideally 100 to 200 KB, since Shopify only lightly compresses uploads [SPD-0008]; product images under about 100 KB and hero images under about 200 KB in WebP, and never lazy-load the first screen's image [SPD-0002]. A faded-in or lazy hero is the most common cause of slow first paint on Shopify themes with a hero banner [SPD-0006]. Record the photo style the store's best images share: background, light, angle, people or not, props.

### 6. Write the component rules buyers actually meet

Describe each with values, a phone screenshot and a do and don't:

- **Primary button** (the add-to-cart): colour, label case, size, radius, hover and disabled states. Directly under it, a one-line trust row (returns, guarantee, delivery) in the body font; risk reducers placed there help cold traffic when the store can honour them [LPG-0038].
- **Product card:** image ratio, title lines, price and compare-at price style, badge style. On phone, collection pages that show four cards (two by two) with prices and a few "bestseller" or "new" badges suit quick-add products [LPG-0059]; products that need sizing first should not get quick add.
- **Product page first screen on phone:** image thumbnails, rating above the title, price, add-to-cart and risk reducers in view [LPG-0034].
- **Button order:** primary (add to cart, checkout), secondary (outline, for "learn more"), text link. One primary per screen.
- **Logo:** which file for light backgrounds, dark backgrounds and photos; clear space (for example the height of one letter); smallest size on screen; where it never goes (over faces, over the product).
- **Badges, inputs, review stars, icons:** one style each.

### 7. Write the prompt block for image tools

A short, plain block any generator or freelancer brief can paste: palette as named hex values with roles, the photo style from step 5, background rules, light, what never appears (competitor colours, stock-photo smiles, text in the image). Add: "the product must match the product truth set exactly", pointing to `store-meta-product-photos` for the check.

### 8. Rank the fixes

One table: issue, where it appears, who sees it (all buyers, phone only, one page), fix, effort in hours, and whether it needs a developer. Order: contrast fails on the add-to-cart and price first, then image weight on top product pages, then button and colour merges, then the rest.

Before handover, run two quick tests of the sheet itself:

- **Feeling at a glance.** Write the one feeling the store should give in a single word (for example calm, playful, expert). Show the homepage and the top product page for three seconds each to five people outside the team and ask for one word. If most words miss the feeling, find the colour that fights it (a loud sale red on a calm brand, a cold grey on a warm one) and list it as a fix: either push the main colour toward the feeling or cut the colour that pulls away. Check the main text and button pair for colour-blind readability as well as contrast.
- **Stranger test.** Give only the one-page wall sheet to a designer or AI image tool that has never seen the store and ask for one ad layout. If the result needs corrections, the sheet is missing a rule; add it.

### Phone-first markets and payment badges

### Phone-first markets and payment badges

In many markets phone traffic is well above desktop, so judge every rule at 360 px wide as well as 390 px. If the store shows payment badges near the price (buy now pay later, local wallets, pay on delivery where offered), add them to the badge rules so they stay one style.

## Checks before you hand it over

1. Every token has a source (theme file key or page and selector) and a date.
2. Every text and button pair shows its contrast ratio and pass or fail; every fail has a passing replacement in the same hue.
3. Each colour has one role; no role has more than one colour unless stated.
4. The token file values match the guide exactly (spot-check five).
5. Image rules state width, file size and the first-screen loading rule.
6. The fix list is ranked and every fix names who applies it.
7. The feeling-at-a-glance and stranger tests were run, and their misses are on the fix list.
8. Nothing was changed in the theme.

## Output

1. **One-screen summary first:** the palette (six to eight swatches with roles), the font pair, the three worst problems with their fixes, and how many contrast pairs fail.
2. **Printable guide** (HTML that prints to A4 or Letter, about 6 to 10 pages, styled in the store's own colours and fonts): logo use and clear space, colours with roles and contrast table, type specimens set in real lines from the store's site (not filler text), text colours shown on each real background, type scale, spacing and radius, button order, product card, badges, form inputs, photo style, image rules, do and don't screenshots, the image-tool prompt block, and a last page that fits everything on one sheet for a designer's wall.
3. **`tokens.json`:** flat keys, for example `color.action.primary`, `color.text.default`, `font.heading.family`, `font.body.size.mobile`, `radius.button`, `space.section`, each with value and source; plus a ready-to-paste CSS variables block with the same values.
4. **Fix table:** issue, where, who sees it, fix, effort, needs developer (yes or no), contrast before and after where relevant.

## Common mistakes

- **Copying the old brand deck.** Step 1 reads the live theme; where they differ, the site wins and the gap is a finding.
- **Documenting a failing colour as "brand".** Step 3 checks contrast and gives a passing shade in the same hue.
- **Reading a draft theme.** Gate 3 confirms the published theme.
- **Forgetting app widgets.** Step 4 includes injected elements that ignore the theme.
- **Image rules with no weights.** Step 5 sets pixel width and file size.
- **A sheet without a prompt block.** AI tools drift without one; step 7 writes it.
- **A sheet nobody tested.** Step 8 checks the feeling at a glance and hands the sheet to a stranger.
- **Fonts the store cannot use everywhere.** Step 2 checks the licence before the guide sends them to print or ads.

## Sources

- [LPG-0010]: headline about three to four times body size, scaled down on phone.
- [LPG-0038]: risk reducers directly under the main button.
- [LPG-0034]: mobile product page first screen.
- [LPG-0059]: mobile collection grid of four with prices and badges.
- [SPD-0002]: image weight targets and no lazy-loading above the fold.
- [SPD-0006]: lazy or faded hero is the common slow-LCP cause on Shopify.
- [SPD-0007]: app-injected elements cause layout shift.
- [SPD-0008]: upload size and compression on Shopify.

Platform documentation: WCAG 2.2 contrast criteria 1.4.3 and 1.4.11; Shopify theme file structure (`config/settings_data.json`).

What makes this skill ours: it reads tokens from the published theme's own settings file instead of guessing from screenshots; it checks every real colour pair for contrast and gives a same-hue fix; it treats app widgets and image weight as part of the identity; and it ranks fixes by what buyers on the top-profit product pages see first.

## Selling in India

- COD and UPI badges near the price follow the same badge rules; keep them one style.
