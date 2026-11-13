---
name: storefront-conversion-audit
description: "Finds where a store loses buyers between landing and purchase, using its own Shopify or GA4 numbers, and sizes each leak in monthly gross profit, not revenue. Covers every page type a shopper meets (home, menu, collection, product, landing, story and FAQ, cart, checkout), proposes a test only where evidence supports one, ranks fixes by expected gross profit after build cost, and decides ship, test or research from the store's order volume. Hands over a findings table, real annotated before screenshots, after mockups labelled as mockups, and a short branded deck, all buildable with free tools. Use when conversion has slipped, before raising ad spend, or when a new owner or agency takes over."
---

# Storefront conversion audit

**You get:** a funnel table by device, a ranked findings table with monthly gross profit per fix, a test plan, before and after images, a deck and a findings CSV.

Find the leaks between landing and paid order, put a gross profit number on each, and rank the fixes. The client signs off after the data, after the findings, and before any visuals. Worked numbers are illustrative.

## When to use

- Conversion rate or revenue per visitor has fallen for two or more weeks and nobody knows which step broke.
- The owner wants to spend more on ads and needs to know whether the site can turn more traffic into profit.
- A new owner or agency takes over and needs a baseline with numbers.
- Mobile converts far below desktop, or a redesign needs to know which pages matter first.

## Not for

- The single page a Meta ad lands on, judged against that ad: use `store-meta-landing`.
- A pass/fail list of checkout, shipping and policy settings: use `store-settings-checklist-audit`, then feed its fails into step 6.
- Offer, bundle and free-shipping threshold design: use `offer-bundle-threshold-design`.
- Building the winning section in the theme: use `shopify-theme-section-builder`.

## What you need

Required (read access, level 1):

1. **Live store URL**, and any age gate, region gate or pop-up a visitor meets.
2. **Shopify Analytics** for 30, 60 or 90 days plus the same window a year ago: sessions, conversion rate, average order value, orders, revenue; the conversion breakdown (sessions with cart additions, reached checkout, completed checkout); sessions and conversion by device; sessions by landing page; top 5 products by units and revenue.
3. **Shopify order export** for the window: Name, Created at, Subtotal, Discount Amount, Shipping, Total, Lineitem sku, Lineitem quantity.
4. **Gross profit per order**, or its inputs (landed cost per SKU, fulfilment, payment fees, return rate).
5. **Brand files**: logo, brand colours as hex codes, fonts. Used only for the deck.

The minimum to size anything is sessions, conversion rate, order value and the device split. Without all four, ask once; with a partial set, mark the affected conclusions "directional". Never fill a gap with a guess.

Optional: GA4 Purchase journey report filtered to purchase; session recordings and heatmaps (Microsoft Clarity is free); post-purchase survey answers; cost per click by channel.

Mockups in a duplicate theme need draft access (level 2); publishing anything needs a client yes.

## Before you start: the gates

1. **Gross profit per order.** Pass when built from delivered costs. Fail when the only margin is price minus unit cost; work it out with `store-meta-math`, because ranking by revenue rewards fixes that sell more of the thinnest-margin items [CRO-0013]. Nothing is ranked until this passes.
2. **Data trust.** Shopify sessions include bots that GA4 filters [MEA-0012]; GA4's session key event rate counts any key event until filtered to purchase [MEA-0002]. Pass when both sources agree on direction and order counts match the export within about 10% (practitioner default, test it). Fail: narrow to the source you trust and say which.
3. **Capacity and cash.** Ask who builds fixes and how many hours a month. If nobody can code, limit fixes to what the theme editor allows.
4. **Order volume.** Note monthly orders; step 8 uses it.

Checkpoint: show the client the saved numbers and gate results; continue on their OK.

## Steps

### 1. Split the change into its parts

Revenue = sessions x conversion rate x order value. Compare with the prior window and the year before; report sale days apart. A 5% fall in order value plus a 4% fall in conversion compounds to about 10% and is often noise [MEA-0009]. Chase only parts that moved beyond their usual swing.

### 2. Build the funnel by device

Per device: sessions, product view rate, add to cart rate, reached checkout rate, purchase rate. Compare with the store's own past first, then flag against:

- GA4 step rates: sessions to product view 50 to 70%, view to cart 12 to 20%, cart to checkout 40 to 60%, checkout to purchase 45 to 60% [LPG-0040]. A weak product view rate points at menu and collections, not the product page.
- Shopify ratio of about 4 carts to 2 checkouts to 1 purchase; well-run low-ticket stores reach 2 to 1 to 1 [MEA-0008].

### 3. Check revenue per visitor against traffic cost

Two cards set floors for scaling paid traffic: conversion (%) x order value of 300 with clicks near 3 [MEA-0047], or 250 for cold Meta traffic [OFF-0047]. Neither knows this store's margin, so use gross profit per visitor = conversion rate x gross profit per order. If it sits below the average paid cost per click, paid traffic loses money before any ad is judged.

### 4. Capture the real before screenshots

On a 390 px wide phone view, clear pop-ups and gates first, then screenshot each surface in 9:16 frames with the whole section in frame (no clipped headline, price or button). Re-shoot anything clipped. A before image is always a real screenshot of the site today; never generate, redraw or edit it. If a step needs a real payment to reach, mark the slot "screenshot pending".

### 5. Walk every surface

Cover all eight, plus quiz and post-purchase pages where they exist: home, menu, collection, product page, landing pages, about, story and FAQ pages, cart, checkout. For each, note what works, then look for leaks with two kinds of evidence [CRO-0013]:

- Funnel and landing page numbers from steps 1 and 2.
- Recordings: rage clicks under 1 to 2% of sessions are normal; dead clicks on price or menu and quick backs from product pages show missing information [CRO-0023].
- Click maps: elements under about 1% of clicks can go [LPG-0043]. Scroll maps read at 75%, 50% and 25%; half of visitors often leave right after the hero [LPG-0051].
- Surveys: "what almost stopped you" after purchase, and an on-page question at about 60% of session length [LPG-0042] [CRO-0018].

A surface with no leak gets "fine"; there is no quota of tests per page. A missing surface (no landing page, no FAQ) gets a build proposal only if evidence shows buyers need it.

### 6. Check proven levers on the leaking pages

On a phone, pass or fail:

- Product page first screen: thumbnails, rating above title, price, add to cart, risk reducer [LPG-0034]. Two kinds of proof above the fold, risk reducers under the button [LPG-0036] [LPG-0038]. Reviews show name and source, not bare logos [LPG-0037]. Under about 80 reviews is the biggest proof gap [LPG-0062].
- Bundle options name the money saved [LPG-0021]. Menu has 7 items or fewer [LPG-0039]. Mobile grid shows four products with prices [LPG-0059].
- Cart hides the code box when no promotion runs [LPG-0058]. Checkout adds under about 10% of order value in fees [LPG-0063]. A padded, specific delivery date shows [CXP-0010]. Shop Pay is on [SET-0008].
- Speed: images first, then third-party scripts [SPD-0002].

Proof inside any fix must be real: no "N bought today" counter without a live data source.

### 7. Size each fix in gross profit

Monthly gain = sessions exposed x baseline conversion x expected relative lift x gross profit per order, plus any order value change x orders x gross margin. Expected value = gain x chance it works, minus build cost [CRO-0013].

Only 10 to 20% of well-run tests produce a clear winner, and mature pages usually gain 1 to 5% [CRO-0012]. Case-study lifts of 25% or more are the top of a range, never the plan.

Illustrative: 20,000 mobile sessions a month, 2% conversion, gross profit 26 per order. A 3% lift adds 12 orders, about 312 a month; at a 40% chance and build cost of 200, the 12-month value is about 1,300. Rank on 12-month value.

### 8. Decide ship, test or research

By monthly orders [CRO-0011]: under 30, research and fix what is broken; 30 to 300, one bold test at a time sized for 20% or more; 300 to 3,000, regular tests for 10 to 20%; above that, several at once. A 10% lift needs about 1,000 conversions per variant, a 20% lift about 260 [CRO-0005]. Run at least one full week [CRO-0015]. Outside tools cannot split-test Shopify's checkout [CRO-0016], so checkout fixes on non-Plus stores are settings only. Never test two prices for one product [CRO-0009]. Ship without a test when the fix repairs something broken.

Checkpoint: the client signs off the ranked findings before any visuals.

### 9. Make after mockups

One change per mockup, everything else identical. Best: make the change in a duplicate theme and screenshot its preview (level 2). Otherwise edit the page in the browser's inspect panel, draw over the before in a free editor, or edit the before with any image tool that keeps the brand UI and product exact. Label every after image "mockup, not live". Mock only what the store can build.

### 10. Build the deck

Eight to twelve slides in Google Slides or the store's template, in brand colours and fonts: summary, funnel by device, one slide per ranked fix (real before with the problem boxed, after mockup, evidence, gross profit, ship or test), test plan, "To confirm".

## Checks before you hand it over

- Sessions, conversion and order value changes multiply back to the revenue change.
- All eight surfaces are covered; each fix has two pieces of evidence and a gross profit figure.
- Every before image is a real, unclipped screenshot; every after is labelled a mockup.
- Planning lifts sit at 1 to 5% unless a store test shows more.
- Each ship, test or research call matches the order band; no checkout tests, no same-product price tests.
- No proof in any mockup is invented; nothing was published without a client yes.
- Fix count fits the stated build hours.

## Output

1. **One-screen summary:** what changed, the leakiest step and device, the top three fixes with monthly gross profit, and the one thing to do this week.
2. **Funnel table:** Device, Sessions, Product view %, Add to cart %, Reached checkout %, Purchase %, Prior, Year ago, Flag.
3. **Surface table:** Surface, Verdict (fine or leak), Evidence, Fix.
4. **Findings table:** Rank, Surface, Finding, Evidence (two), Fix, Gross profit a month, Chance, Build hours, Ship or test, Owner.
5. **Test plan:** Hypothesis, Page, Primary metric, Sample needed, Run length, Stop rule.
6. **Files:** before and after images (PNG, 9:16), the deck, `conversion-findings.csv`; plus "To confirm".

## Common mistakes

- **Ranking by revenue.** Step 7 sizes gross profit.
- **A test quota per page.** Step 5 proposes tests only where evidence points.
- **Generated before images.** Step 4 uses real screenshots only.
- **Planning on case-study lifts.** Step 7 caps them.
- **Testing on low traffic or at checkout.** Step 8 ties method to volume and platform limits.
- **Fixing the product page when the leak is navigation.** Step 2 finds the weak step first.

## Sources

- CRO-0005, CRO-0011, CRO-0015: sample sizes, method by order volume, full-week runs.
- CRO-0009, CRO-0016: no same-product price tests; no outside checkout tests on Shopify.
- CRO-0012, CRO-0013: most tests lose; rank by expected gross profit with two pieces of evidence.
- CRO-0018, CRO-0023, LPG-0042, LPG-0043, LPG-0051: surveys, recordings, click and scroll maps.
- LPG-0021, LPG-0034, LPG-0036, LPG-0037, LPG-0038, LPG-0039, LPG-0058, LPG-0059, LPG-0062, LPG-0063: proven page levers.
- LPG-0040, MEA-0008: funnel benchmarks.
- MEA-0002, MEA-0012: GA4 and Shopify counting traps.
- MEA-0009: sessions x conversion x order value.
- MEA-0047, OFF-0047: revenue per visitor floors for paid traffic.
- CXP-0010, SET-0008, SPD-0002: delivery dates, Shop Pay, speed.

What makes this skill ours: every fix is sized in gross profit with a realistic lift and a chance of working; tests are proposed only where evidence exists, with the method set by order volume and Shopify's checkout limits; paid traffic is checked against gross profit per visitor; and before images are always real while every visual can be made with free tools.
