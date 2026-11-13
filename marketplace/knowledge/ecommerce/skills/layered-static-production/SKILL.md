---
name: layered-static-production
description: "Produce premium cold-audience statics in two layers: a clean, text-free base image built around the real product, and real type set over it in HTML, so every word is crisp and spelled right. Runs from customer research checked against two sources, to validated angles, a money forecast of what the batch costs to test and how many winners to expect, concepts, the base image, short copy written to that image, a composed 9:16 master with a separate 4:5, and pass or fail gates. Renders with a free browser and Playwright by default, with Figma optional, and an automatic check that fails any file where text overlaps, falls into a platform safe zone or is too small to read on a phone. Use for a batch of cold-audience statics where clean type and a strong message matter more than speed."
---

# Layered static production

**You get:** 4 to 12 finished cold-audience statics as PNG files at 1080 x 1920 and 1080 x 1350, with HTML sources, a layout check file, a buyer profile, angle and concept tables and a test spend forecast.

Words decide most statics, and generated words are where image tools fail. So the image and the type are made separately, the message is researched first, and a script checks the layout before any person does.

## When to use

- The store needs a batch of 4 to 12 premium statics for cold buyers.
- Image tools keep misspelling headlines or burying them in clutter.
- Statics look generic and the message is not grounded in real customer words.
- The team wants files that pass a layout check automatically before review.

## Not for

- One quick static today: use `proven-static-formats`.
- Deciding one ad's visual idea in depth: use `static-ad-visual-idea`.
- Writing a full concept and copy set for Meta: use `store-meta-concepts`.
- Planning a month of creative across formats: use `monthly-ad-batch-sprint`.

## What you need

**Required**

- Customer research from at least two independent sources: the reviews export (CSV: rating, body, date), plus one of a post-purchase survey export, support tickets, product questions, or public forum threads.
- Real product photos (clean front shot, in-use shots if any) and the logo file.
- Brand fonts (font files or Google Fonts names) and hex colours.
- Target cost per purchase per product and the month's test budget (from `store-meta-math`).
- The proof table, from `store-meta-brand-dna`.

**Optional**

- Meta Ads Manager export (last 90 days, ad level) to learn the store's own hit rate.
- Any image tool the store uses; none is required.

**When something is missing.** Only one research source: run a two-question post-purchase survey (what made you buy today, what almost stopped you) [CRO-0018] or mine product questions, and mark single-source insights "unconfirmed". No fonts: use a free Google font close to the site's and say so. No test budget: stop at the forecast.

**Access.** Read only. Generating base images may cost money on paid tools; the owner picks the tool. Uploading or launching needs the owner's yes.

## Before you start: the gates

1. **Gross profit per purchase known** for each product, with a target cost per purchase. Fail: stop; the forecast cannot be done.
2. **Cash.** The forecast's test spend fits the month's test budget. Fail: cut ads until it fits.
3. **Capacity.** Someone can review base images and finals at three gates. Fail: smaller batch.
4. **Tracking.** Store-side purchases can be tied to ads (UTMs or Meta purchases within about 20% of store orders; practitioner default, test it). Fail: produce the batch but grade it on store orders by UTM only.

## Steps

### 1. Build the buyer profile, two sources per insight

For each buyer group: the main problem, awareness stage, what they tried that failed, trigger moments, desired outcome, exact phrases, questions they ask. Paste quotes by hand so the wording survives [AVT-0007]. An insight enters only if two independent sources show it. Self-identifying phrases that repeat mark a separate buyer group [AVT-0016].

### 2. Write and cut angles

An angle is buyer group x argument. Write about twice as many as you need. Keep an angle only if you can say the pain or desire, the argument, the proof row behind it, and why this buyer cares. Cut any angle that is a common pain solved the common way. Write one line per angle: buyer, argument, proof. Two lines with the same argument are one angle: visual variety does not make a new ad [MCR-0022], and near-copies share one delivery entity [MCR-0078]. Weight broad accounts toward unaware and problem-aware buyers [MCR-0057].

**Gate A:** the owner picks the angles.

### 3. Forecast in money

- Test spend per ad: 3 times target cost per purchase [ADC-0039]. Batch test spend = ads x that figure.
- Daily budget: target purchases x expected cost per purchase / test days [ADC-0066].
- Expected winners: ads x the store's own hit rate if known, else 5 to 15%, which is typical of large accounts [MCR-0025]; small accounts should expect the low end.
- Offer statics only where the offer's break-even is recomputed [OFF-0016].

Write it as: "8 ads, about $960 test spend at $40 target cost per purchase, expect 0 to 1 winners; read by <date>." If test spend is over the budget, cut ads now.

### 4. Concept each ad

Give each image one job: stop (make the problem felt), explain (show the mechanism or comparison), blend in (look like a post or note), or make the product wanted. Develop the idea with `static-ad-visual-idea`. A concept passes if it reads in a second at phone size, works without the headline, shows the real product (in scene or as a small inset), and does not look like a template every rival uses.

**Gate B:** the owner approves concepts.

### 5. Make the base image, with no text

- Canvas 1080 x 1920. Plan where type will go before making the image: keep a quiet area for the headline.
- The real product photo is the reference for any generated scene, or is placed on top of it. Any generator works; so does a phone photo or a licensed stock background.
- No letters, logos or numbers in the base. Exception: lettering that is part of the scene (a shop sign) if the concept needs it, never the headline.

**Gate C:** the owner approves base images at full size.

### 6. Write the copy to the image

Copy is written after the base exists, so it plays off the picture.

- Headline 5 to 8 words where possible [ORG-0016]; headline plus support line about 90 characters or fewer (practitioner default, test it).
- Plain words at about grade 5 to 8 [MCR-0063], to one person, clear or deliberately curious [MCR-0024].
- The support line states the mechanism or the turn; it never repeats the headline.
- No "it's not X, it's Y" lines [MCR-0016]. Reviews carry a name and source [LPG-0037].
- Offer two or three headline options per base; with layers split, testing headlines is cheap.

### 7. Compose in HTML

One HTML file per ad at exactly 1080 x 1920: base image full bleed, type in the brand fonts, logo as the real file. Mark every readable element with `data-read`. Render with Playwright or a browser screenshot.

**Read zone.** For a master that also runs in Reels, all readable elements sit in x 65 to 1015, y 285 to 1248: inside the 4:5 centre crop and above Meta's Reels caption band (bottom about 35%; check the current template). If the copy will not fit there at readable size, build the 4:5 (1080 x 1350) as its own HTML file.

### 8. Run the automatic layout check

A short Playwright script loads each HTML file, reads `getBoundingClientRect()` for every `data-read` element and writes `layout-check.json`. It fails a file when:

- any readable element leaves the read zone;
- any two readable elements overlap;
- any readable text is under 40 px font size on the 1080 px canvas (practitioner default, test it);
- the headline's contrast against the base, sampled behind its box, is under 4.5 to 1 for small text or 3 to 1 for large (WCAG).

Fix and rerun until every file passes. Figma is optional: if the owner wants editable files, rebuild the passed layouts as frames with real text layers.

### 9. Final gates

- **Product:** compare the product in each final with the real photo at 3 times magnification.
- **Words:** proofread every word against the approved copy, including prices.
- **Claims:** every claim matches its proof row and the live page today.
- **Pre-launch:** run each file through `prelaunch-ad-check`.

### 10. Deliver and log

Deliver the PNGs, the HTML sources and the check results. After launch (owner's yes only), record store-side results per ad at 3 times target cost per purchase and update the store's hit rate for the next forecast.

## Checks before you hand it over

1. Every insight used has two sources, named.
2. Every angle has an argument and a proof row, and no two share the same argument.
3. The forecast's test spend fits the budget, with a read date.
4. No base image contains generated headline text.
5. Every file passed the automatic layout check, with `layout-check.json` attached.
6. Every final passed the product, words and claims gates and `prelaunch-ad-check`.
7. 9:16 and 4:5 versions are both correct, from a shared read zone or separate files.
8. Nothing was uploaded or launched without the owner's yes.

## Output

1. **One-screen summary:** ads delivered, angles covered, test spend, expected winners, read date, the ad to watch first.
2. **Buyer profile** with sources per insight.
3. **Angle table:** angle ID, buyer group, argument, proof row, awareness stage, chosen (yes or no).
4. **Forecast table:** ads, target cost per purchase, test spend per ad, total test spend, daily budget, expected winners, read date.
5. **Concept table:** ad ID, angle, image job, visual idea, base image file, headline options with character counts, support line.
6. **Finals:** PNG at 1080 x 1920 and 1080 x 1350, HTML sources, `layout-check.json`.
7. **To confirm:** proof the owner must supply.

## Common mistakes

- **Headlines generated inside the image.** Steps 5 and 7 keep type as a separate layer.
- **One review treated as an insight.** Step 1 requires two sources.
- **Six visuals, one argument.** Step 2 counts arguments, not looks.
- **A batch the budget cannot read.** Step 3 sizes test spend first.
- **Text under the Reels caption.** Steps 7 and 8 enforce the read zone.
- **Copy written before the image exists.** Step 6 writes copy to the base.
- **Trusting the script alone.** Step 9 adds product, word and claim checks by eye.

## Sources

- [CRO-0018]: two-question post-purchase survey.
- [AVT-0007]: read reviews by hand and paste exact quotes.
- [AVT-0016]: self-identifying phrases mark buyer groups.
- [MCR-0022]: a colour or pose change is not a new ad.
- [MCR-0078]: near-duplicates share one delivery entity.
- [MCR-0057]: weight broad accounts toward unaware and problem-aware buyers.
- [ADC-0039]: judge after 3 times target cost per purchase.
- [ADC-0066]: daily test budget formula.
- [MCR-0025]: creative hit rate of 5 to 15% in large accounts.
- [OFF-0016]: recompute break-even for every offer.
- [ORG-0016]: hook text 5 to 8 words.
- [MCR-0063]: hook copy at grade 5 to 8.
- [MCR-0024]: a static is clear or a deliberate curiosity gap.
- [MCR-0016]: ban "it's not X, it's Y" lines.
- [LPG-0037]: named reviews and press quotes.

Platform documentation: Meta Reels safe-zone guidance and image sizes, WCAG contrast ratios.

What makes this skill ours: a real money forecast (test spend, daily budget, expected winners) before any image is made; a read zone that fits both the 4:5 crop and Meta's Reels caption band; a free automatic check for overlap, safe zones, size and contrast; insights admitted only with two sources.
