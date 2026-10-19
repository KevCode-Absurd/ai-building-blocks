# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, honest audit: every rate, order value and sized figure checks out against the CSV, the leakiest group (61% off traffic, P2 especially) is correctly found, and the ship-now list hits the real discount, renewal and guarantee problems. The only soft spot is asserting the P1 drop is ad fatigue without hedging, and some test maths rests on an assumed 30-day window, which it does label MISSING.

## Judge list

- Met: The top of the audit says which mode it ran in, and page-only mode has no money figures.
  "Mode: with numbers, partial. The ad file gives orders split by traffic source" stated in section 1; money figures allowed and labelled.
- Met: The first finding is on the step that loses the most buyers, not on colour or fonts.
  Finding 1: "The page never shows the 61% the ad promised" targets click to purchase for the 61% off traffic, the named leakiest step.
- Met: Every finding quotes the page or points to a screenshot.
  Each finding has an Evidence line, e.g. "Under the button: 'DISCOUNT AUTO-APPLIED'", "Header: '4.8/5.0 (100,000)'"; finding 10 flags MISSING screenshot.
- Met: Sized fixes use your own rates, show the sum, and say "model, not a forecast".
  "All figures below are a model, not a forecast"; targets 2.99% (P1 days 1-21) and 3.42% (non-discount ads); P2 5,569 x (2.99% - 0.90%) = 116.
- Met: No fix adds a rating, review count, price or offer you don't hold.
  Fixes reuse held facts only: "$29.99 first box, then $49.99 every 4 weeks ($1.78/day)", "show the widget's live figure".
- Met: Sections that work are named as working.
  Section 8 names the gut/habit messages, plan box, quality section, survey framing, FAQ, spokesperson disclosure and K1 as working.

## What went in

```text
The page: sprout.example/products/sprout, as text top to bottom, with
earlier notes (sprout/product-page.md). No
screenshots.

Numbers: the practice ad file (sprout/ad-results.csv), with clicks,
purchases and revenue for nine ads. No steps between click and
purchase, no device split, no dates.

Facts: sprout/brand.md (offers, guarantee, claims fine and risky).

[attached: sprout/brand.md, sprout/product-page.md, sprout/ad-results.csv]
```

## What came out

```text
# Sprout product page audit: where buyers drop, and what to fix

## 1. Mode and sources

**Mode: with numbers, partial.** The ad file gives orders split by traffic source: nine ads, ten rows, with P1 split into two 21-day periods. That meets the minimum. Several gaps limit what the numbers can say:

- Link clicks stand in for visits.
- Purchases are as reported in the ad file.
- There is only one step between landing and purchase.

**Sources**
- **Page:** sprout.example/products/sprout, as text top to bottom. Read 13 Oct 2026, with notes from 30 Sept (sprout/product-page.md). No screenshots, so nothing was seen at 390 px. Items marked "(inferred)" in the capture were not seen directly.
- **Ads checked:** the 9 ads in sprout/ad-results.csv. I have the opening line and format for each. I do not have their pictures or landing URLs.
- **Facts:** sprout/brand.md, captured Sept to Oct 2026 and updated 18 Oct 2026.

**Missing**
- MISSING: date range for the ad file. Days live are 14 to 42 per row, with no calendar dates.
- MISSING: which page each ad lands on. I assume all adult ads land on this product page. K1 may land on the Kids page.
- MISSING: product views, add to cart, reached checkout, orders, phone vs desktop, new vs returning.
- Not inspected: cart and checkout. Whether $29.99 actually applies without the text sign-up was not seen.

## 2. Step table

The only steps available are impression → link click → purchase. "Click to purchase" covers landing, adding to cart and checkout together.

**By ad (traffic source)**

| Ad | Opening line | Impressions | Clicks | Click rate | Purchases | Click to purchase | Avg order | Revenue per click |
|---|---|---|---|---|---|---|---|---|
| T1 | Fix the Hot Girl Tummy | 300,000 | 4,950 | 1.65% | 198 | **4.00%** | $42.10 | $1.68 |
| H1 | One Step I Never Skip | 96,300 | 1,300 | 1.35% | 44 | 3.38% | $45.80 | $1.55 |
| K1 | Fiber Kids Won't Fight | 169,200 | 2,030 | 1.20% | 63 | 3.10% | $48.60 | $1.51 |
| F1 | Struggling to Get Enough Fiber? | 138,500 | 1,524 | 1.10% | 46 | 3.02% | $40.39 | $1.22 |
| P1, days 1 to 21 | 'Sprout is too expensive': 61% off | 250,000 | 3,750 | 1.50% | 112 | 2.99% | $34.20 | $1.02 |
| W1 | Support Muscle While You Lose Weight | 64,300 | 900 | 1.40% | 23 | 2.56% | $44.52 | $1.14 |
| S1 | Trusted by 1M+: Take 61% OFF | 128,000 | 1,600 | 1.25% | 38 | 2.38% | $33.00 | $0.78 |
| P1, days 22 to 42 | same as P1 | 193,500 | 1,780 | 0.92% | 39 | 2.19% | $34.21 | $0.75 |
| R1 | The Daily Nutrition Every Runner Forgets | 76,900 | 538 | 0.70% | 10 | 1.86% | $40.00 | $0.74 |
| P2 | Don't Pay Full Price... (61% off inside) | 227,300 | **5,569** | **2.45%** | 50 | **0.90%** | $31.10 | **$0.28** |
| **All** | | 1,644,000 | 23,941 | 1.46% | 623 | 2.60% | $39.60 | $1.03 |

**By offer group**

| Group | Clicks | Share of clicks | Click to purchase | Avg order | Revenue per click |
|---|---|---|---|---|---|
| "61% off" ads (P1 both periods, P2, S1) | 12,699 | 53% | 1.88% | $33.36 | $0.63 |
| All other ads (T1, H1, K1, F1, W1, R1) | 11,242 | 47% | 3.42% | $43.48 | $1.49 |

**Against the store's own past (P1)**

| Measure | Days 1 to 21 | Days 22 to 42 |
|---|---|---|
| Click rate | 1.50% | 0.92% |
| Click to purchase | 2.99% | 2.19% |
| Revenue per click | $1.02 | $0.75 |

The P1 drop is ad fatigue on the same page. The fix is a creative rotation, not a page change.

## 3. Leakiest step

- **Step:** click to purchase.
- **Group:** visitors from the "61% off" ads, P2 above all.
  - P2 brings the most clicks of any ad (5,569) at the highest click rate (2.45%).
  - It then converts at 0.90%, under a quarter of T1's 4.00%. It returns $0.28 per click against $1.49 for the non-discount ads.
  - The 61% group is over half of all clicks but converts at about half the rate of the rest. Its order value is also about $10 lower.
- **Page that owns it:** the landing page. For the adult ads this is assumed to be this product page (MISSING: confirmed landing URLs). Without add-to-cart counts, I cannot say whether these visitors leave on the first screen, at the plan box or at checkout. The first place to look is whether the page matches the ad's "61% off" promise.

## 4. Findings

### This page (product page, owns click to purchase)

**1. The page never shows the 61% the ad promised.**
- **Evidence:**
  - The ad says "61% off inside".
  - On the page, the bar says "Save 52% + free shipping on your first order" and the badge says "MOST POPULAR: GET UP TO 55% OFF". The pop-up says "Sign Up for 55% Off".
  - The plan box shows "~~$66.65~~ $29.99", which is 55% off. A 61% cut on $66.65 would be about $26, and that price appears nowhere.
- **Step it should move:** click to purchase for P1, P2 and S1 traffic.
- **Change:** one discount number on the ad, bar, badge, pop-up and plan box, and it must be the one the shopper actually gets.
  - If the 61% includes the "4 FREE gifts", either show that sum on the page or drop the ads to the 55% that is shown.
  - MISSING: what the 61% is made of.
- **Keep:** the struck-through $66.65 next to the first-order price, and the per-day price.
- **Confidence:**
  - High that this is wrong.
  - Medium that it explains P2's gap. P1 carries the same 61% claim and converts at 2.99%, so P2's hook ("You Literally Don't Have To") may also pull in more pure deal-hunters.

**2. "DISCOUNT AUTO-APPLIED" conflicts with the small print.**
- **Evidence:**
  - Under the button: "DISCOUNT AUTO-APPLIED".
  - Footer: "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only."
- **Step:** click to purchase. The drop may land at checkout, which was not inspected.
- **Change:** either make $29.99 truly apply with no sign-up, or say "$29.99 with text sign-up" right beside the price.
- **Keep:** "Free Shipping Today", if true for all first orders.
- **Confidence:** high that the wording is wrong. It cannot be checked past the button (not inspected).

**3. Three stories for one $29.99 price.**
- **Evidence:**
  - The bar says "✨ Limited Time Sale ✨".
  - The birthday section says "Subs Now Start at $29.99 ... Not just for a week but indefinitely."
  - The footer says the price needs a "promotional SMS discount reserved for new customers only."
- **Step:** click to purchase, for the price doubter asking "Which discount is real?"
- **Change:** pick one reason and remove the others. If the price is permanent, remove "Limited Time Sale".
- **Keep:** the birthday line's voice, if it stays true.
- **Confidence:** high that it is contradictory.

**4. The renewal price sits below the button, in small type.**
- **Evidence:**
  - The plan box reads "$29.99. $1.07/day".
  - Only under the button: "Renews at $49.99 each 4 weeks."
- **Step:** click to purchase, and fewer cancels and refunds later.
- **Change:** put it in the plan box: "$29.99 first box, then $49.99 every 4 weeks ($1.78/day)".
- **Keep:** "Pause Or Cancel Any Time".
- **Confidence:** high that it is needed for honest terms. Low on its effect on first-order conversion.

**5. The guarantee looks unlimited but covers the first order only.**
- **Evidence:**
  - The plan box says "30-Day Money-Back Guarantee" and the bar says "30-DAY GUARANTEE".
  - The last FAQ says "This policy applies only to your initial purchase."
- **Change:** add "on your first order" wherever the guarantee appears.
- **Keep:** the guarantee itself.
- **Confidence:** high.

**6. The claims above the fold go beyond what the study shows.**
- **Evidence:**
  - Under the title: "60+ potent ingredients to revive whole body vitality".
  - Bullets: "Promotes mental clarity + energy" and "Supports immunity + stress relief".
  - The study measured blood vitamin C and folate only.
- **Step:** click to purchase, through trust for doubters. It also limits legal exposure.
- **Change:** use the lines on file instead:
  - "60+ ingredients, 21 vitamins & minerals, and 6g fiber in 1 pack".
  - "Clinically tested for nutrient absorption: vitamin C +40.1%, folate +20.5% in a 12-week placebo-controlled study".
  - Have whoever signs off claims check the Benefits accordion too: "immune health, energy metabolism, and normal cognitive function".
- **Keep:** "Supports digestion and gut health". It matches T1, the best-converting ad.
- **Confidence:** high.

**7. The star rating near the title doesn't match the live widget.**
- **Evidence:**
  - Header: "4.8/5.0 (100,000)".
  - Bottom widget: "4.75 stars, 109,639 reviews".
- **Change:** show the widget's live figure up top and name where it comes from.
- **Confidence:** high.

**8. The best proof is at the very bottom.**
- **Evidence:**
  - "Real Customer Reviews (at the very bottom)".
  - The "Vs Powders" cards are several sections below "Start Now".
  - The brand file's top review theme is "I finally stuck with a supplement".
  - H1, the one habit ad, converts at 3.38% with the second-highest order value ($45.80).
- **Step:** click to purchase.
- **Change:** test 2 to 3 short review quotes (one powder quitter, one gut story) plus the live rating directly under the button.
- **Keep:** the full review section where it is.
- **Confidence:** medium. This is a test, not a ship.

**9. No guidance on Sugar-Free for sensitive stomachs.**
- **Evidence:** "Low Sugar vs. Sugar-Free: content not captured. Nothing about sugar alcohols was seen on the page."
  - The gut buyer arrives via T1, the largest-volume and best-converting ad.
  - The brand file notes "Sugar-Free upsets some stomachs".
- **Change:** add next to the selector: "Sensitive stomach? Start with Low Sugar. Sugar-Free uses sugar alcohols."
- **Keep:** both options.
- **Confidence:** low, because the panel was not captured.

**10. The first screen doesn't say it's a greens supplement.**
- **Evidence:**
  - The title "Sprout Superfood Gummies" and the vague subtitle are likely all that shows on the phone first screen, with the bar, gallery and rating above them (inferred).
  - "Greens", "1 pack a day" and "no water" are not visible.
- **Change:** use a subtitle built from held facts, for example: "Your daily greens as a small handful of gummies. 1 pack a day. No water, no shaker."
- **Keep:** the brand voice.
- **Confidence:** low, because there is no screenshot. MISSING: 390 px first screen.

**11. The cost comparison uses a price shown nowhere else.**
- **Evidence:** "Us vs. Them ... Sprout $1.26".
  - The page's own prices are $1.07, $1.78 and $2.38 a day.
  - The third column's label was not captured.
- **Change:** recheck the comparison and use the $1.78 renewal figure, or remove the section.
- **Confidence:** high that it doesn't match.

**12. Smaller fixes, all ship.**
- The vitamin count says "21 vitamins" in one place and "over 20 vitamins & minerals" in another. Use 21.
- The stat "[number missing] of U.S. adults" is blank, and the footnotes only say "Source". Fill both in or remove the stat.
- "Less than 1% of customers use our Money-Back Guarantee" is unverified and sits right under the button. Remove it or source it.

**13. The one-time option is labelled as the bad deal.**
- **Evidence:** "No Free Shipping. No First Order Discount."
- **Why it matters:** this reads as a push for the buyer who says "subscriptions ... are a trap."
- **Confidence:** low on its effect. Leave this until the tests below are done.

### Other pages and ads (shorter)

- **Kids page:** "GET 58% WITH FREE SHIPPING" at $22.49 sits right above "Renews at $74.98 each 4 weeks". The page doesn't say what $74.98 covers. Fix if K1 lands here (MISSING: K1 landing URL). Ship.
- **Science page:**
  - "Each gummy delivers 100% of your daily needs" is wrong. It should be per pack.
  - "backed by 35,000+ studies" refers to ingredient studies, not the product.
  - "The results are in. [Sprout] works." overstates an absorption study.
  - Ship all three corrections.
- **How-it-works page:**
  - "GET 49% OFF" at $45.33 is a fifth discount number. Bring it in line with the one chosen in finding 1.
  - The 30/60/90-day results timeline has no support. Remove it.
- **Ad W1:** "Support Muscle While You Lose Weight" has no evidence on file, and the page says nothing about it. Pause or rewrite. Ship.
- **Ad T1:** "Fix the Hot Girl Tummy" is the best converter, but "Fix" breaks the brand's own "supports" rule. Rewrite to keep the slang and drop the treatment claim, for example "Support the Hot Girl Tummy". Watch its rate afterwards.
- **Ad R1:** it has the lowest click rate (0.70%) and lowest conversion (1.86%), and the page has nothing for runners. Cut spend rather than build for it.
- **Ad P1:** fatigue after day 21. Rotate the creative.
- **Cart and checkout:** not inspected. I did not see how the text-sign-up discount, shipping and the total appear there.

## 5. Sized fixes

Only finding 1 can be anchored to the store's own better group. **All figures below are a model, not a forecast.**

**Formula:** clicks from the ad × (hoped-for click-to-purchase rate minus current rate) × that ad's average order. The click-to-purchase rate already includes buying, so the "share who go on to buy" term is 1.

**Two targets, both from the store's own numbers**
- **Lower target: 2.99%.** This is P1 in days 1 to 21: same 61% offer, same page, best period.
- **Upper target: 3.42%.** This is the non-discount ads combined.

| Ad | Clicks | Rate now | Extra orders at 2.99% | Extra revenue at 2.99% | Extra orders at 3.42% | Extra revenue at 3.42% |
|---|---|---|---|---|---|---|
| P2 | 5,569 | 0.90% | 116 | $3,618 | 140 | $4,361 |
| P1, days 22 to 42 | 1,780 | 2.19% | 14 | $485 | 22 | $746 |
| S1 | 1,600 | 2.38% | 10 | $323 | 17 | $549 |
| P1, days 1 to 21 | 3,750 | 2.99% | 0 | $0 | 16 | $550 |
| **Total** | 12,699 | 1.88% | **about 140** | **about $4,400** | **about 195** | **about $6,200** |

This is against $24,668 of revenue in the file, over runs of 21 to 42 days.

**Assumptions**
- All four ads land on this page.
- Link clicks equal visits.
- Order value stays at each ad's own figure.
- First orders only. The $49.99 renewals are not in the file.
- Part of P2's gap is likely the audience, not the page. Treat the upper target as a ceiling.

**Not sized:** findings 2 to 13. There is no group in the data to anchor them, so they are ranked by confidence above instead.

## 6. Ship now / test

**Ship now (plainly wrong or missing terms)**
- One discount number from ad to plan box (finding 1).
- "With text sign-up" next to $29.99, or real auto-apply (finding 2).
- One reason for the $29.99 price (finding 3).
- The renewal price in the plan box (finding 4).
- "On your first order" next to every guarantee (finding 5).
- Claims swapped for the lines on file (finding 6).
- The live rating with its source (finding 7).
- The $1.26 comparison, the 21 vitamins count, the blank stat, "Source" footnotes and the "<1%" line (findings 11 and 12).
- The low-sugar note (finding 9), once the panel text is confirmed.
- The Kids $74.98 explanation, the Science page corrections and the W1 ad.

After shipping, watch revenue per click by ad against this table. P2 at $0.28 is the number to beat.

**Test**

1. **Change:** move 2 to 3 review quotes (powder quitter, gut story) and the live rating to directly under "Start Now".
   - **Because:** the best proof sits at the very bottom.
   - **Step it moves:** click to purchase for all traffic.
   - **Can traffic support it?** Only for a large lift. The file holds about 24,000 clicks at 2.60%. Rule of thumb: visitors per arm ≈ 16 × p × (1 − p) ÷ (difference)².
     - Spotting a 30% lift needs about 6,700 per arm, or 13,300 in total. That fits in about four weeks if the file's clicks arrive in about 30 days (MISSING: dates).
     - A 20% lift needs about 30,000 in total. That won't finish in four weeks, so if the result is small, ship it on judgement.
2. **Change:** send "61% off" traffic to a version where the price, renewal and guarantee terms come straight after the title, ahead of the claims.
   - **Because:** these visitors came for a price and convert at 1.88%.
   - **Step it moves:** click to purchase for P2 and S1.
   - **Can traffic support it?** Yes, for P2 alone, if the lift is large. Spotting 0.9% → 2.0% needs about 1,900 per arm (rule of thumb). P2 brings about 5,600 clicks in 30 days, so the test takes roughly three weeks. Start it only after the ship-now discount fix is live, and measure against the new baseline.
3. **Later, not now:** neutral wording on the one-time option (finding 13). Traffic can't carry a third test at the same time.

MISSING: an A/B testing tool on the store.

## 7. What the page needs from the owner

- MISSING: date range of the ad file, and whether "purchases" are store orders or ad-platform attributed.
- MISSING: landing URL for each ad.
- MISSING: product views, add to cart, reached checkout and orders for this page, split by phone and desktop and by new and returning.
- MISSING: what makes up the "61%" (price, gifts, shipping).
- MISSING: whether $29.99 applies without the text sign-up, and what the cart and checkout show.
- MISSING: the Low Sugar vs. Sugar-Free panel text, and grams of sugar per pack.
- MISSING: phone screenshots at 390 px of the first screen (before and after the pop-up), the plan box with an option picked, and the cart.
- MISSING: the number and source behind "[number missing] of U.S. adults", and the source behind "61% of Americans experience weekly digestive issues".
- MISSING: the current per-serving comparison, and the label of the third "Us vs. Them" column.
- MISSING: refund rate, subscription share, renewal and cancel rates (first-order revenue is all the file shows).
- MISSING: who signs off health claims, to review the Benefits accordion.

## 8. Already working

- **The gut and habit messages carry the best buyers.** "Supports digestion and gut health" on the page matches T1 (4.00%, $1.68 per click). The habit idea behind H1 converts at 3.38% with a $45.80 average order.
- **The plan box shows a struck-through price and a per-day price,** plus "Pause Or Cancel Any Time".
- **The quality section is specific and dated:** "Tested for 70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial contaminants. 'Tested by [an outside lab] in SEP 2026.'"
- **The survey numbers are framed honestly:** "Survey of 3,000+ customers after 3 months".
- **The voice works:** "No more gagging on pills, sloshing chalky powders, or cleaning messy counters."
- **The FAQ answers the real questions plainly:**
  - Delivery: "ship within 24 hours ... arrive 3-5 days later".
  - The limited flavour "automatically reverts".
  - A measured "When will I feel something?"
- **The paid spokesperson is disclosed,** and the FDA line is in the footer.
- **The kids ad (K1) has the highest average order in the file ($48.60)** and converts at 3.10%. The picky-eater, fiber angle earns its spend.
```
