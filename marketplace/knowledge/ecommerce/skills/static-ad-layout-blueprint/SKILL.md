---
name: static-ad-layout-blueprint
description: "Turn an ad's type, sizes and copy into a layout blueprint a designer or image tool can follow: where the product, headline, proof and call to action go, how big each is, and three or four structurally different layout variants. Zones are measured in pixels inside each placement's real safe area (Meta feed, Stories, Reels, TikTok, Pinterest, Google), add up, and are checked with a quick wireframe you can open in any browser. Text sizes are set so they still read at phone size, and every price or offer zone is tied to the live page. Use before briefing a designer or image tool, when one layout must serve several placements, or when a finished static keeps getting cropped or covered."
---

# Static ad layout blueprint

**You get:** three or four layout variants for a static ad with pixel-measured zones inside each placement's safe area, wireframe PNGs with HTML source, designer notes and a recommended variant.

A layout is a decision about what the eye sees first, second and third, inside the part of the screen the platform leaves clear. This skill makes that decision in pixels before anyone designs.

## When to use

- A static concept and its copy are approved and need a layout before design or image generation.
- One concept must run in feed, Stories, Reels and other platforms, and someone has to decide whether one master file can serve them all.
- Finished statics keep losing their headline under the Reels caption or get cropped badly.
- An image tool keeps putting text and product in random places and needs zones to follow.

## Not for

- Choosing what the ad says or which angle: use `store-meta-concepts`.
- Choosing the ad type from the account's gaps: use `proven-static-formats`.
- The visual idea behind the image: use `static-ad-visual-idea`.
- Producing the finished image with real type: use `layered-static-production`.

## What you need

**Required**

- The ad type (for example product hero, comparison, review card, offer card, problem scene with product inset, callout diagram, native text post, bundle grid).
- The placements it will run in, by platform.
- The final copy: headline, subhead, proof line, price or offer line, on-image CTA if any, each with its character count.
- The product photo file (clean, real product) and the logo file.
- Brand fonts and colours (hex), from `store-meta-brand-dna`.

**Optional**

- The live product page URL, if the ad shows a price or offer.
- A past ad from the store that was cropped or covered, to fix.

**When something is missing.** No copy: stop and ask for it; zones are sized to real words. No brand fonts: use a free sans-serif such as Inter and say so. No placements: assume Meta feed 4:5 and Reels 9:16.

**Access.** Read only. The blueprint is a file. Nothing is uploaded.

## Before you start: the gates

1. **Gross profit per purchase known**, but only if the layout shows a price or offer. The offer zone needs the break-even maths done [OFF-0016]. Fail: drop the offer zone and lay out the ad without it until `store-meta-math` is run.
2. **Capacity.** Someone can build what the blueprint asks: a designer, the owner in a free editor, or an image tool. Fail: reduce to the two simplest variants that a free editor can make.
3. **Tracking.** Not needed to draw a layout. It is needed only if a variant is being chosen from past results; then results must come from store-side purchases. Fail: pick variants on structure, not on past numbers.
4. **The price is live.** Any price, offer or stock line matches the page today. Fail: remove the line.

## Steps

### 1. Set each canvas and its safe area

Use the platform's own template in Ads Manager or its help pages on the day; these are the values to start from.

| Placement | Canvas (px) | Keep readable items out of |
|---|---|---|
| Meta feed 4:5 | 1080 x 1350 | about 5% margin on each edge (practitioner default) |
| Meta feed 1:1 | 1080 x 1080 | about 5% margin |
| Meta Stories 9:16 | 1080 x 1920 | top and bottom about 14% (270 px) |
| Meta Reels 9:16 | 1080 x 1920 | top about 14% (270 px), bottom about 35% (670 px), sides about 6% (65 px) |
| TikTok 9:16 | 1080 x 1920 | bottom caption band and right-side buttons; use TikTok's current overlay |
| Pinterest 2:3 | 1000 x 1500 | about 5% margin |
| Google Demand Gen | 1200 x 628, 1200 x 1200, 960 x 1200 | about 5% margin |

**One master or separate files.** A 9:16 master can serve 4:5 feed (centre crop, y 285 to 1635) and Reels only if every readable item sits in the shared box x 65 to 1015, y 285 to 1248. That box is a little under half the canvas. If the copy does not fit it at readable sizes, build each ratio as its own layout. Never let the platform crop for you: automatic formats can crop story assets into feed [ADC-0065].

### 2. Choose the layout family

Each family splits the safe area into zones that add up to 100%. Adjust within a few points; keep the sum.

| Family | Visual | Headline | Proof | Price or offer | CTA | Clear space |
|---|---|---|---|---|---|---|
| Product hero | 50 | 20 | 10 | 0 to 10 | 0 to 5 | 10 to 15 |
| Comparison (stack at 9:16, side by side at 1:1) | 55 | 15 | 15 | 0 | 5 | 10 |
| Callout diagram | 45 | 15 | 25 (3 or 4 callouts) | 0 | 5 | 10 |
| Review card | 30 | 0 | 45 (quote, name, rating) | 0 | 5 | 20 |
| Offer card | 35 | 15 | 10 | 25 | 5 | 10 |
| Problem scene with product inset | 60 (inset 10 of it) | 20 | 5 | 0 | 5 | 10 |
| Native text post | 20 | 55 | 10 | 0 | 0 | 15 |
| Bundle grid | 50 | 15 | 5 | 20 | 5 | 5 |

Percentages are a practitioner default, test them. Two rules come from evidence: a static is either fully clear or a deliberate curiosity gap [MCR-0024], and a curiosity layout must point to a page that explains [MCR-0019]. A product-on-white image with one bold text bar is the cheapest layout for testing which value proposition wins [MCR-0075].

### 3. Set the text hierarchy

- At most three type sizes: headline, support, small print.
- Headline about 3 to 4 times the body size [LPG-0010]. That card measured web pages; for ads, use it as the starting ratio and confirm with the shrink test in step 6.
- On a 1080 px wide canvas, no readable text under about 40 px (practitioner default, test it). A feed image shows at about 400 px wide on a phone, so 40 px becomes about 15 px.
- Headline 5 to 8 words where possible; past 12 words it reads poorly [ORG-0016].
- Contrast at least 4.5 to 1 for small text and 3 to 1 for large text (WCAG). Check with any free contrast checker.
- A discount shows as whichever number is bigger, money saved or percent off [OFF-0017].
- Show the price exactly as the store shows it for that market, in its currency (tax-inclusive in the UK, EU and Australia; before sales tax in the US and Canada), and a payment badge (free returns, buy now, pay later, pay on delivery) only if that option is live for that product. Leave room for longer words when the ad runs in the languages your buyers use; German or French text can run a third longer than English.

### 4. Place the CTA and the proof

- The platform adds its own button. An on-image CTA is optional; if used, put it at the bottom of the safe area, never in the Reels bottom band.
- Reviews carry a name and source; press logos carry the outlet's quote [LPG-0037].
- Health and body categories: no before-and-after split that implies the viewer has the problem [MCR-0020].

### 5. Draw three or four variants that differ in structure

Each variant changes where the product sits, how headline and image relate, or which proof is shown. A new background colour or pose is not a new ad and adds little [MCR-0022]; near-identical files can be grouped as one by Meta's delivery [MCR-0078]. For each variant write what it gains and what it gives up.

### 6. Render a wireframe and test it

Free path: write one HTML file per variant at the exact canvas size, each zone a labelled box, with the safe-area bands shaded. Open it in any browser and screenshot, or render it with Playwright. Manual path: the same boxes in Canva free or Figma free on a guide layer.

Test each wireframe:
- Zone sums equal 100% of the safe area.
- No readable box crosses a shaded band.
- No two text boxes overlap.
- Shrink to 400 px wide: a stranger can still read the headline and price.
- For a shared master, crop to 4:5 and confirm nothing readable is lost.

## Checks before you hand it over

1. Every placement has its canvas size and safe area stated, with the date checked.
2. Zone percentages in every variant add up to 100%.
3. The wireframe shows no readable box in a shaded band and no overlapping text.
4. Every text zone is sized to its real copy, with character counts, and passes the shrink test.
5. Variants differ in structure, not just colour.
6. Any price or offer matches the live page today and has its break-even recomputed.
7. Nothing was uploaded or published.

## Output

1. **One-screen summary:** the recommended variant, why, one master or separate files, and the second variant to test against it.
2. **Placement table:** placement, canvas, safe area, master or own file.
3. **Zone table per variant:** zone, x, y, width, height (px), share of safe area, content, type size, colour.
4. **Wireframes:** one PNG per variant and placement, plus the HTML source.
5. **Designer or tool notes:** product photo to use, fonts, colours, what must not move.
6. **Assumptions:** one line each, at most three, only where an unknown changes what to do.

## Common mistakes

- **Stretching a 4:5 to 9:16.** Step 1 builds a shared box or separate files.
- **Headline under the Reels caption.** Step 1 and step 6 shade the bottom band and test it.
- **Zones that add to more than the canvas.** Step 2 and the checks force a sum of 100%.
- **Text that reads on a monitor and not on a phone.** Step 3 and the shrink test set minimum sizes.
- **Variants that are only colour swaps.** Step 5 requires a structural change.
- **An offer nobody priced.** Gate 1 and step 3 tie the offer to break-even.

## Sources

- [OFF-0016]: recompute break-even for every offer.
- [ADC-0065]: automatic formats can crop story assets into feed.
- [MCR-0024]: a static is fully clear or a deliberate curiosity gap.
- [MCR-0019]: curiosity statics need a page that explains.
- [MCR-0075]: product-on-white plus a text bar to test value propositions.
- [LPG-0010]: headline 3 to 4 times body size.
- [ORG-0016]: hook text 5 to 8 words, falls off past 12.
- [OFF-0017]: show the discount as the bigger number.
- [LPG-0037]: named reviews and press quotes.
- [MCR-0020]: health imagery and personal-attribute policy.
- [MCR-0022]: a colour or pose change is not a new ad.
- [MCR-0078]: near-duplicates share one delivery entity.

Platform documentation: Meta Ads Guide sizes and Reels safe-zone guidance, TikTok safe-zone overlay, Pinterest and Google Demand Gen image specs, WCAG contrast ratios.

What makes this skill ours: zones measured in pixels inside each platform's safe area and checked to add up; a worked shared box that tells you when one master can serve feed and Reels; a free wireframe render that tests overlap and phone readability before design; an offer zone that only exists once the offer's break-even is known.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Show the price inclusive of taxes, in rupees, as the store shows it, and a cash-on-delivery badge only if COD is live for that product.
