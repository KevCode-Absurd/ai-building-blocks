---
name: write-homepage-copy
description: "Writes a store's homepage copy section by section, with the job each section must do for two visitors: a first-time visitor who needs to know what the store sells and where to start, and a returning buyer who wants to reorder or see what is new. Covers announcement bar, hero, shop-by paths, best sellers, proof, how it works or why us, story teaser, FAQ strip and footer trust lines, judged by view-product rate from the store's own data. Use when the homepage gets traffic but few people click into products, after a rebrand, or before sending brand or influencer traffic to the home page."
---

# Homepage copy

**You get:** a homepage written in full, section by section (usually 7 to 10 sections), each with its copy, its job, which visitor it serves, the number that proves it works, and a returning-buyer variant where it differs, ready to load into the theme editor after the client approves it.

## When to use

- Most homepage visitors leave without opening a product.
- Brand search, press, influencer or word-of-mouth traffic lands on the homepage.
- The hero is a slogan or a slideshow and nobody can say what the store sells in three seconds.
- The store has a repeat-purchase product and returning buyers must dig to reorder.

## Not for

- Deciding which products go where on the homepage by profit and stock: `merchandise-homepage-and-collections` (this skill writes the words around those picks).
- Menus and collection structure: `set-up-navigation-and-collections`.
- The about page: `write-about-us-brand-story-page`.
- A full funnel audit: `storefront-conversion-audit`.

## What you need

Required (read access, level 1):

1. **Live homepage URL** and screenshots at phone and desktop width.
2. **GA4 or Shopify Analytics, last 30 to 90 days**: homepage sessions split new versus returning, homepage exit rate, and the share of homepage sessions that view a product (GA4 path exploration or the "view_item" event after a homepage page_view).
3. **Traffic sources to the homepage**: brand search, direct, social, email, paid.
4. **Top 10 products by gross profit and units** (from `build-sku-profit-sheet` or the Shopify sales by product report with costs).
5. **Reviews export** and the store's real rating and review count.
6. **Policies**: shipping times by region, free-shipping line, returns window, COD and payment options.

Optional: post-purchase survey answers, heatmap or scroll map of the homepage, a list of press mentions with links.

If analytics are missing, write the copy but mark every "proof it works" metric as "baseline not captured" and add setting up the view-product measure to the To confirm list. Theme edits need draft access (level 2) on a duplicate theme; publishing needs a client yes.

## Before you start: the gates

1. **Products to point at earn money.** Hero and best-seller picks have positive gross profit per order and at least 4 weeks of stock. Fail: swap the pick, or send the list to `merchandise-homepage-and-collections`.
2. **Proof is real.** Rating, review count, customer count and press mentions can be traced to a source. Fail: drop the number; never round up.
3. **Promises are kept.** Delivery times and free-shipping lines match the last 90 days of dispatch data; in the US a stated ship time needs a reasonable basis [CXP-6160]. Fail: write the cautious version.

## Steps

1. **Set the score.** Judge the homepage by its view-product rate: the share of homepage sessions that open a product page [LPG-0033]. A healthy store-wide view-product step sits around 50 to 70% in one practitioner's GA4 benchmark [LPG-0040]; record the store's current number as the baseline.
2. **Split the two visitors.** From analytics, note the new versus returning share of homepage sessions and what each does next. New visitors need "what is this, is it for me, where do I start". Returning buyers need "reorder, what is new, my account". If returning buyers are under 15% of homepage sessions, write for new visitors and give returning buyers one clear reorder link.
3. **Write the announcement bar.** One line, one fact: the free-shipping line, a real delivery promise or a live offer with its end date. No rotating messages.
4. **Write the hero.** Headline: what the store sells and for whom or with what result, under 10 words, in buyer words from reviews. Subhead: one line on why this store (the one difference buyers mention most). One button to the best entry point (best-seller collection, quiz or hero product), with a label that says where it goes ("Shop bestsellers", not "Learn more"). Directly under the button, the risk reducers (returns, delivery, COD where relevant) [LPG-0038]. Static hero, not a slideshow. Many visitors never scroll, so test the headline first and the image second [LPG-0016].
5. **Proof in the first scroll.** Real star rating with count plus one short named quote: two different kinds of proof [LPG-0036]. Add press only with the outlet's words.
6. **Shop-by paths.** Three to six tiles named the way buyers shop (by need, by type, by recipient), each with an image and a 2 to 4 word label. Image-led category links lifted results in agency tests [LPG-0039]; keep the visible menu under about 7 items [LPG-0007]. Put bestsellers at the top of the mobile menu, since new visitors often open it first [LPG-0061].
7. **Best sellers.** Section heading that says why these ("Most reordered", "Start here"), product cards with name, price, rating and one key difference. Order by demand and margin; about 60% of visitors may leave after the hero and more drop with each row [LPG-0041], so the first row carries the store.
8. **Why us or how it works.** Three short points, each a difference buyers confirm in reviews, with a proof line. For paid social traffic put this problem-and-education block high; for search and brand traffic put proof first [LPG-0050].
9. **Returning-buyer block.** "Reorder your favourite", "New this month" and a link to account or subscription management. Where the theme allows, show it only to logged-in or returning visitors.
10. **Story teaser.** Two sentences from the true origin story and a link to the about page.
11. **FAQ strip.** The 3 to 4 questions new visitors ask most (delivery time, returns, COD, sizing), answered in one line each, taken from tickets.
12. **Footer trust lines.** Contact routes that really work, policy links, business name and address, payment marks.
13. **India and US notes.** India: name COD and UPI in the hero reassurance line if COD share is high, add a pincode delivery check link, and keep prices GST-inclusive; a regional-language hero variant only where reviews show that language. US: a specific delivery date beats a vague range when the store can keep it [CXP-0010].

## Checks before you hand it over

- A stranger shown the first screen for 3 seconds can say what the store sells and where to click.
- Exactly one primary button in the hero, labelled with its destination.
- Every number (rating, count, customers, delivery days) has a source and date.
- Each section has a stated job and a metric (view-product rate, tile clicks, reorder clicks).
- Returning buyers can reach reorder or account in one tap.
- No fake urgency, no "as seen in" without the outlet's words.
- Menu labels use buyer words, not internal names.

## Output

**Summary (one screen):** current view-product rate, new versus returning split, the hero promise and why, the section order, and the runner-up headline in one line.

**Section sheet:**

| # | Section | Visitor served | Job | Copy (headline, body, button) | Returning-buyer variant | Source | Metric to watch |
|---|---|---|---|---|---|---|---|
| 1 | Announcement bar | both | one fact | | | | bar clicks |
| 2 | Hero | new | say what and where to start | | | | view-product rate |
| 3 | Proof strip | new | trust | | | | |
| 4 | Shop by | new | route | | | | tile clicks |
| 5 | Best sellers | both | start the browse | | | | card clicks |
| 6 | Why us or how it works | new | difference | | | | scroll depth |
| 7 | Reorder and new | returning | reorder | | | | reorder clicks |
| 8 | Story teaser | new | trust | | | | about page clicks |
| 9 | FAQ strip | new | doubts | | | | |
| 10 | Footer trust | both | reassurance | | | | |

**To confirm:** facts and sign-offs needed before publishing.

## Common mistakes

- **A slogan for a headline.** Step 4 says what the store sells.
- **Writing only for first-timers.** Step 2 and step 9 give returning buyers a fast path.
- **Ten equal buttons.** Step 4 allows one primary action.
- **Judging the page by bounce rate.** Step 1 uses view-product rate.
- **Hero products that lose money or run out.** Gate 1 checks profit and stock.
- **Inflated proof numbers.** Gate 2 drops anything without a source.

## Sources

- LPG-0033: judge the homepage by view-product rate; capped menus.
- LPG-0040: GA4 purchase-journey step benchmarks.
- LPG-0038: risk reducers under the hero button.
- LPG-0016: headline first, hero image second.
- LPG-0036: two kinds of proof in the first screen.
- LPG-0039, LPG-0007: image category links; keep menus short.
- LPG-0061: bestsellers at the top of the mobile menu.
- LPG-0041: drop-off after the hero and per row.
- LPG-0050: order sections by traffic source.
- CXP-0010: specific delivery dates lift conversion when accurate.
- CXP-6160: US ship-time claims need a reasonable basis.

What makes this skill ours: every section has a named visitor, a job and a metric; the homepage is scored on view-product rate from the store's own analytics; returning buyers get their own fast path; and hero picks are gated on profit and stock before any words are written.
