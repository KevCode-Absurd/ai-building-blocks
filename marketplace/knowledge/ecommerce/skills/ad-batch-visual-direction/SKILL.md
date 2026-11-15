---
name: ad-batch-visual-direction
description: "Set the visual direction for a batch of ad images so the batch has controlled variety: settings for mood, lighting, composition, camera angle, palette, photo style, depth and motion, with each one marked lock or vary. Picks a main photo style, a test style and one to avoid from the store's own results by style where there is enough data, and from the product and placement where there is not. Sets the spread so variants are different enough to count as new ads for delivery, not colour swaps that the platform treats as one. Use before generating or shooting a batch, when variants come out too alike or too random, or when nobody knows which look actually sells for this store."
---

# Visual direction for an ad batch

**You get:** a visual direction for one ad batch: a main, test and avoid photo style chosen from the store's own results, a lock or vary spec for every variant, and a contact sheet, ready for designers or image tools.

Controlled variety: lock what makes the ad this brand's, vary what the batch is testing, and vary it enough to matter.

## When to use

- A batch of statics (or simple motion ads) is about to be generated, shot or designed.
- Earlier variants all looked the same, or looked like five different brands.
- The team argues about style and nobody has checked which style has sold for this store.
- A new placement (Reels, Stories, Pinterest) needs a look that fits it.

## Not for

- Writing concepts and copy: use `store-meta-concepts`.
- Deciding the visual idea for one static: use `static-ad-visual-idea`.
- Turning these settings into a model-ready prompt: use `ad-image-prompt-compiler`.
- Deciding whether AI may show this product at all: use `store-meta-product-photos`.

## What you need

**Required**

- The concepts in the batch (product, buyer group, angle, offer), from `store-meta-concepts` or a brief.
- Brand look: palette hex codes, fonts, logo, and five real brand images the owner likes. `store-meta-brand-dna` produces these.
- Placements the batch will run in.
- Real product photos for every product in the batch.

**Optional, needed to choose style from results**

- Meta Ads Manager export, last 90 to 180 days, ad level: ad name, ad ID, ad set name, spend, impressions, link clicks, purchases, cost per purchase, attribution setting. TikTok or Pinterest exports with the same columns if those run.
- Shopify orders export for the same dates (Created at, Lineitem sku, Discount code, UTM fields if captured) to check store-side purchases.
- The ad files or thumbnails, so each can be tagged by style.

**When something is missing.** No results export: choose styles from the product and placement (step 3, path B) and say confidence is low. No brand images: ask once; otherwise set the palette from the logo and product only.

**Access.** Read only for exports. The output is a spec file. Nothing is generated, uploaded or launched by this skill.

## Before you start: the gates

1. **Gross profit per purchase known** for each product in the batch. Needed to compare styles on profit, not just cost per purchase. Fail: compare styles on cost per purchase against break-even only, and label it.
2. **Cash and capacity.** The batch size fits what the test budget can read (about 3 times target cost per purchase per concept [ADC-0039]) and what the team can produce. Fail: cut variants before setting direction; send the owner to `monthly-ad-batch-sprint`.
3. **Tracking good enough to rank styles.** Ads Manager purchases within about 20% of store orders over the same dates (practitioner default, test it). Fail: use path B in step 3 and do not claim a style "wins".
4. **The product can be shown truthfully** in every style chosen. Where the buyer judges colour, texture or fit, an AI-made product is not allowed. Fail: drop that style for that product.

## Steps

### 1. Name the settings

| Setting | What it controls | Typical options |
|---|---|---|
| Mood | Feeling at first glance | calm, energetic, warm, clinical, playful, tense |
| Lighting | How light falls | window daylight, studio soft box, hard sun, golden hour, flat even |
| Composition | Where things sit | centred hero, rule of thirds, edge crop, split, grid, flat lay |
| Camera angle | Viewpoint | eye level, 30 degrees above, overhead, low, macro |
| Palette | Colour world | brand-led, monochrome flood, muted neutral, high-contrast pop |
| Photo style | The whole look | studio product, documentary lifestyle, phone-shot native, editorial, illustration, data or diagram |
| Depth | Focus | everything sharp, shallow focus on product, background blur |
| Motion | For video or animated statics | still, subtle loop, slow push, fast cuts |

Add two fields that change the most: **setting world** (kitchen, gym, desk, outdoors, plain sweep) and **who appears** (no one, hands only, a real customer, a creator, the founder).

### 2. Lock what makes it this brand's

Always locked: the product's real look (label, colour, shape, size), logo, fonts, palette hex codes for type and brand marks. Lock one or two more that the brand's five liked images share (often palette world and mood). Everything else is open to vary.

Every setting gets a value; none is left blank, because a blank setting is one the designer or image model will invent. Defaults are fine. Leave at least three or four settings free so variants have room to differ; a batch with everything locked produces one ad several times.

**Order of authority** when choices clash: what the owner explicitly chose wins; then the settings set here for this batch; then the brand's visual identity sheet; then the theme defaults in step 4. Say so in the spec whenever an owner choice overrides a recommendation, and why the recommendation differed.

### 3. Choose the main, test and avoid styles

**Path A, from the store's results.**

1. Tag every ad in the export with its photo style, setting world and who appears, using one fixed list so tags compare [MCR-0051]. That card holds for accounts making roughly 10 or more ads a month; below that, patterns are noise, so use path B.
2. Group by style. Read results at ad set level where styles share ad sets [ADC-0059], on 7-day click.
3. A style counts only if it spent at least 3 times target cost per purchase [ADC-0039]. Below that, mark it "not enough data".
4. Rank styles by expected gross profit per ad: revenue minus spend minus production cost per ad [MCR-0023]. Cheap styles can win even at a lower return. Check the top style's purchases against Shopify orders for the same SKUs and dates.
5. **Main style:** highest gross profit per ad with enough data. **Test style:** a style with no or thin data that fits the product and placement. **Avoid:** a style that lost money with enough data, or one that cannot show this product truthfully.

**Path B, no usable history.** Choose by what the buyer must judge and where the ad runs:

| Buyer must judge | Main style | Test style |
|---|---|---|
| Size, fit, texture, colour | Documentary lifestyle with real product | Phone-shot native |
| How it works | Data or diagram | Documentary lifestyle |
| Price and value | Studio product with clear offer | Phone-shot native |
| Status or taste | Editorial | Documentary lifestyle |

This table is a practitioner default, test it. Two evidence notes: rough native statics can beat polished work in accounts that need volume [MCR-0060], and premium brands can use phone-shot footage if the product itself is not shown in the rough part [MCR-0010]. A format that marketers are widely copying is likely past its peak in crowded categories; judge by your own data [MCR-0062].

### 4. Set the spread so variants count

A new background colour or pose is not a new ad [MCR-0022], and near-identical ads can be grouped and served to the same people [MCR-0078]. So:

- **Big settings:** photo style, setting world, who appears, composition family.
- **Small settings:** lighting, palette shade, angle, depth, mood shade.
- A variant counts as distinct only if it changes at least one big setting and at least two settings in total (practitioner default, test it).
- Visual change alone still sits inside one concept. For delivery reach, the concept itself (buyer group, angle or offer) must differ; plan that in `store-meta-concepts`. Keep 10 to 15 distinct formats live where the budget can feed them, rather than many copies of one winner [MCR-0036].
- Borrow cues from far-off industries for fresh looks, as long as it stays clear what the product is [BRD-0003].
- Meta learns which formats each person responds to, so a batch of only one look (say lo-fi phone shots) never reaches people who ignore that look; spread big settings across the batch so every concept can meet more people [MCR-6657].

**Starting version sets by theme.** When the batch has a known theme, start from three versions that differ on at least two settings, then adjust to the store's results:

| Theme | Version 1 | Version 2 | Version 3 |
|---|---|---|---|
| Lifestyle | Aspirational: calm mood, golden hour, premium setting | Relatable: warm mood, everyday room, phone-shot style | Active: energetic mood, outdoors, dynamic diagonal |
| Problem and solution | Scene-led: the problem moment, product small | Product-led: the product large, problem as an inset | Balanced: split frame, problem left, fix right |
| Social proof | One real review with a close portrait of the real reviewer | Several real reviews or customer photos in a grid | A real customer using the product, action shot |
| Offer | Bold offer card, product hero | Bundle laid out flat with unit price | Product in use with an offer band (real end date only) |
| Features | Annotated product with three callouts | Comparison grid against the usual way | Simple how-it-works diagram |

These are practitioner defaults, not results; they only set where the first batch starts.

### 5. Fit each placement

- 9:16: compose with clear space in the top and bottom bands for type and the platform's interface; subject in the middle.
- 4:5 feed: tighter crop, product larger.
- Motion: subtle movement only where the platform rewards video; a still is fine for feed.

### 6. Write the spec and preview the spread

For each variant, list every setting with lock or vary and its value. Make a contact sheet of quick drafts or reference images, one per variant, and check by eye that no two read as the same ad at thumbnail size.

Run the stamp test on the sheet: shrink every variant to about postage-stamp size side by side. If you cannot say what each one is about, or which job it does, without reading its words, change the layout family, the background or the main picture until you can. Variants that only differ in their words will be grouped as one ad.

## Checks before you hand it over

1. Every variant has all eight settings plus setting world and who appears filled in, each marked lock or vary.
2. The product's real look, logo, fonts and palette are locked in every variant.
3. Every variant changes at least one big setting and two settings in total from every other variant.
4. Main, test and avoid styles each have a reason: data with spend and store-side check (path A) or the buyer-judges table (path B), labelled.
5. No style was ranked on less than 3 times target cost per purchase of spend.
6. No variant shows an AI-made product where the buyer judges colour, texture or fit.
7. The batch size fits the test budget and team capacity.

## Output

1. **One-screen summary:** main style, test style, avoid style, and why in one line each; number of variants and the spread rule used.
2. **Style results table (path A):** style, ads, spend, store-side purchases, cost per purchase, production cost per ad, gross profit per ad, enough data (yes or no).
3. **Direction spec per variant:** variant ID, concept ID, placement, mood, lighting, composition, angle, palette, photo style, depth, motion, setting world, who appears, lock or vary per field.
4. **Contact sheet** of the variant previews.
5. **Assumptions:** where a locked setting was not given, the setting used and why, one line each, at most three, only where an unknown changes what to do.

## Common mistakes

- **Blank settings.** Step 2 gives every setting a value and leaves three or four free on purpose.
- **Variants only the copywriter can tell apart.** Step 6 runs the stamp test.
- **Calling colour swaps new ads.** Step 4 requires a big-setting change and a new concept for reach.
- **Picking style by taste.** Step 3 ranks styles on gross profit per ad from the store's own results.
- **Ranking on thin data.** Step 3 needs 3 times target cost per purchase per style.
- **Forgetting production cost.** Step 3 subtracts it, so cheap styles get credit.
- **An AI product where the buyer judges texture.** Gate 4 and the checks block it.
- **Too many variants for the budget.** Gate 2 cuts the batch first.

## Sources

- [ADC-0039]: judge after 3 times target cost per purchase.
- [MCR-0051]: tag every ad on the same fields.
- [ADC-0059]: judge creative at ad set level.
- [MCR-0023]: compare creative types on gross profit per ad, including production cost.
- [MCR-0060]: rough native statics can beat polished video.
- [MCR-0010]: premium brands can open lo-fi if the product stays out of it.
- [MCR-0062]: a widely promoted format is likely past its peak.
- [MCR-0022]: a colour or pose change is not a new ad.
- [MCR-0078]: near-duplicates share one delivery entity.
- [MCR-0036]: 10 to 15 distinct formats outlast copies of one winner.
- [MCR-6657]: Meta learns format response per person; mix formats so concepts reach more people.
- [BRD-0003]: borrow design ideas from distant industries.

What makes this skill ours: styles ranked on gross profit per ad from the store's own results, with production cost and a store-side order check; a spread rule that separates big and small settings so variants count; a truth gate that keeps AI away from products judged on colour, texture or fit; a batch size capped by what the test budget can read.
