# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful audit that correctly computes every rate from the ad file, lands the first finding on the 61% ad-to-page mismatch where the numbers show the loss, and keeps every money figure labelled as a model. The owner gets a clear ship-now list, a well-caveated test, and a long MISSING list rather than guesses.

## Judge list

- Met: The top of the audit says which mode it ran in, and page-only mode has no money figures.
  "Mode: with numbers, thin." stated first; money figures are allowed and all labelled as model from the ad rows.
- Met: The first finding is on the step that loses the most buyers, not on colour or fonts.
  "F1. The ad's 61% is nowhere on the page." Step: click → purchase, for "61% off" traffic.
- Met: Every finding quotes the page or points to a screenshot.
  Each F1 to F12 has an Evidence line, e.g. "DISCOUNT AUTO-APPLIED", "Renews at $49.99 each 4 weeks"; other-page findings quote brand.md text.
- Met: Sized fixes use your own rates, show the sum, and say "model, not a forecast".
  "Model, not a forecast." 12,699 clicks × (2.99% from P1 days 1 to 21 − 1.88% now) × $33.36 = about 140 orders, about $4,680.
- Met: No fix adds a rating, review count, price or offer you don't hold.
  Suggestions reuse held facts only: "$29.99 first box, then $49.99", "4.75 from 109,639 reviews on our site", approved claims list.
- Met: Sections that work are named as working.
  "8. Already working" names T1/H1/K1 conversion, the struck price box, "Why Sprout?", dated testing, survey framing, FAQ disclosures.

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
## 1. Mode and sources

- **Mode: with numbers, thin.** You gave orders split by traffic source: 9 ads in 10 rows, with P1 split into two 21-day periods. There are no counts between click and purchase, no device split and no store analytics. Every money figure below is a model built from these ad rows.
- **Date range:** MISSING: dates. Each ad has only "days_live" (14 to 42 days). Totals cover each ad's own live period, not one shared range.
- **Source of numbers:** sprout/ad-results.csv, which you called a practice file. Purchases and revenue appear to be ad-attributed, not store orders. The figures are treated as yours.
- **Ads checked:** opening lines of all 9 ads. No ad images were attached, so the ad match is judged on words only. MISSING: which page each ad lands on. This audit assumes they land on sprout.example/products/sprout. K1 ("Fiber Kids Won't Fight") may land on the Kids page.
- **Page capture:** text only, read 13 Oct 2026, with notes from 30 Sept 2026 (sprout/product-page.md). No phone screenshots. The phone first screen, the default plan selection and the gallery are inferred, not seen. Cart and checkout were not inspected.
- **Facts:** sprout/brand.md (offers, guarantee, claims, buyer doubts).

## 2. Step table

**By ad.** Each row is impressions → link clicks → purchases.

| Ad | Impressions | Link clicks | Click rate | Purchases | Click → purchase | Avg order | Revenue per click |
|---|---|---|---|---|---|---|---|
| T1 Hot girl tummy | 300,000 | 4,950 | 1.65% | 198 | 4.00% | $42.10 | $1.68 |
| H1 One step never skip | 96,300 | 1,300 | 1.35% | 44 | 3.38% | $45.80 | $1.55 |
| K1 Fiber kids | 169,200 | 2,030 | 1.20% | 63 | 3.10% | $48.60 | $1.51 |
| F1 Fiber question | 138,500 | 1,524 | 1.10% | 46 | 3.02% | $40.39 | $1.22 |
| P1 Too expensive, days 1 to 21 | 250,000 | 3,750 | 1.50% | 112 | 2.99% | $34.20 | $1.02 |
| W1 Muscle weight loss | 64,300 | 900 | 1.40% | 23 | 2.56% | $44.52 | $1.14 |
| S1 Trusted by 1M | 128,000 | 1,600 | 1.25% | 38 | 2.38% | $33.00 | $0.78 |
| P1 Too expensive, days 22 to 42 | 193,500 | 1,780 | 0.92% | 39 | 2.19% | $34.21 | $0.75 |
| R1 Runner | 76,900 | 538 | 0.70% | 10 | 1.86% | $40.00 | $0.74 |
| P2 Dont pay full price | 227,300 | 5,569 | 2.45% | 50 | **0.90%** | $31.10 | **$0.28** |

**By group.**

| Group | Link clicks | Purchases | Click → purchase | Avg order | Revenue per click |
|---|---|---|---|---|---|
| "61% off" ads (P1 both periods, P2, S1) | 12,699 | 239 | **1.88%** | $33.36 | $0.63 |
| All other ads | 11,242 | 384 | 3.42% | $43.48 | $1.49 |
| All ads | 23,941 | 623 | 2.60% | $39.60 | $1.03 |

Between click and purchase, these counts are MISSING: landing page views, product views, added to cart, reached checkout. Phone vs desktop and new vs returning splits are also MISSING.

## 3. Leakiest step

- **Step:** click → purchase.
- **Group:** visitors from the "61% off" ads, worst of all P2. P2 brought the most clicks of any ad (5,569, 23% of all clicks) and turned 0.90% of them into orders. The rest of the account turns 3.42%, and the same audience on P1's first 21 days turned 2.99%.
- **Page that owns it:** the landing page, assumed to be sprout.example/products/sprout. Its first screen and plan box are the first thing a "61% off" clicker checks.
- **Limits:** with no step counts, the loss could also sit in cart or checkout, where the text-only discount applies. Those were not inspected.

A smaller second leak: P1 fell against its own past. Click rate dropped from 1.50% to 0.92% and purchase rate from 2.99% to 2.19% between days 1 to 21 and days 22 to 42.

## 4. Findings

### Product page (behind the leakiest step)

The three phone reads are inferred from text, since no screenshots were provided.

- **Five-second glance.** The first screen is likely the rotating bar, gallery, "Sprout Superfood Gummies" and "60+ potent ingredients to revive whole body vitality", with the plan box below.
  - What it is: clear.
  - Who it's for: not said on the first screen.
  - What to do next: the button is likely below the fold.
- **Skim.** The skim turns up eight different prices and percentages: $66.65, $29.99, $1.07/day, $2.38/day, $49.99, $1.26, 52%, 55%.

**F1. The ad's 61% is nowhere on the page.**
- Evidence:
  - The ads say "Don't Pay Full Price. You Literally Don't Have To. (61% off inside)", "here's 61% off to prove otherwise" and "Take 61% OFF".
  - The page says "Save 52% + free shipping on your first order", "MOST POPULAR: GET UP TO 55% OFF" and "Sign Up for 55% Off".
  - The price shown is ~~$66.65~~ $29.99, which is 55% off. 61% off $66.65 would be about $25.99, and no such price appears.
  - The bar says "Limited Time Sale" while the birthday section says "Not just for a week but indefinitely."
- Step: click → purchase, for "61% off" traffic.
- Change: use one number and one story everywhere.
  - Either change the ads to the page's real offer ("$29.99 first box, 55% off").
  - Or, if 61% is real (for example with gifts or 2 adults), show that exact math in the plan box.
  - Pick "limited time" or "permanent", not both.
- Keep: the struck ~~$66.65~~ $29.99 with $1.07/day, and the price-objection hook in the ads.
- Confidence: high that it mismatches. Medium that it causes the gap: the "61% off" ads convert at 1.88% vs 3.42%, but there are no step counts to locate the drop.
- Severity: stops the sale.

**F2. "DISCOUNT AUTO-APPLIED", but the price needs a text sign-up.**
- Evidence: under the button the page says "DISCOUNT AUTO-APPLIED". The footer says "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only."
- Step: click → purchase (cart and checkout total, not inspected).
- Change: at the price, say "$29.99 for new customers with the text sign-up code" and link the sign-up. Or make the discount truly auto-applied.
- Keep: the pop-up sign-up itself.
- Confidence: high on the mismatch, medium on its effect.
- Severity: stops the sale.

**F3. The renewal price sits in small print under the button.**
- Evidence: "$29.99. $1.07/day" is the headline price. "Renews at $49.99 each 4 weeks. Cancel anytime." sits under the button.
- Step: click → purchase. The price doubter asks "Will the price jump after the first order?"
- Change: put it in the plan box: "$29.99 first box, then $49.99 every 4 weeks ($1.78/day)".
- Keep: "Pause Or Cancel Any Time" as worded. Promise nothing more about cancelling.
- Confidence: medium.
- Severity: slows buyers.

**F4. The guarantee limit is hidden.**
- Evidence: the plan box and bar say "30-Day Money-Back Guarantee" and "30-DAY GUARANTEE". The last FAQ says "This policy applies only to your initial purchase."
- Step: click → purchase.
- Change: "30-day money-back guarantee on your first order" in the plan box and bar.
- Keep: the guarantee badge.
- Confidence: high that a term is missing, medium on its effect.
- Severity: slows buyers.

**F5. Claims above the fold go past what the study shows.**
- Evidence: "revive whole body vitality", "Promotes mental clarity + energy", "Supports immunity + stress relief". The study measured blood vitamin C and folate only.
- Step: click → purchase. Credibility matters to the doubter.
- Change: use claims the brand can back.
  - "60+ ingredients, 21 vitamins & minerals, and 6g fiber"
  - "Clinically tested for nutrient absorption: vitamin C +40.1%, folate +20.5% in a 12-week study"
- Keep: the "Supports digestion and gut health" bullet.
- Confidence: high that the claims outrun the evidence, low on their effect on sales.
- Severity: slows buyers.

**F6. Two different ratings on the same page.**
- Evidence: the header says "4.8/5.0 (100,000)". The bottom widget says "4.75 stars, 109,639 reviews".
- Step: click → purchase.
- Change: show the widget figure with its source: "4.75 from 109,639 reviews on our site".
- Keep: the review count, which is strong proof.
- Confidence: medium.
- Severity: slows buyers.

**F7. The best proof is at the very bottom.**
- Evidence: "Real Customer Reviews (at the very bottom)". The review cards ("Vs Powders", "Taste") sit far below "Start Now".
- Step: click → purchase. Buyers doubt "A gummy can't hold enough to replace my powder" and ask "Will this upset my stomach more?"
- Change: put 2 to 3 real review cards (a powder quitter, a gut story) directly under the button.
- Keep: the full review section where it is.
- Confidence: medium.
- Severity: slows buyers.

**F8. No sugar-alcohol note was seen at the sugar picker (inferred: the panel was not captured).**
- Evidence: "Low Sugar vs. Sugar-Free: content not captured. Nothing about sugar alcohols was seen on the page."
- Step: click → purchase, for gut-sensitive buyers.
- Change: one line at "Select Sugar Level": "Sugar-Free is sweetened with sugar alcohols, which bother some stomachs. Sensitive tummy? Start with Low Sugar."
- Keep: both options.
- Confidence: low.
- Severity: slows buyers.

**F9. The "$1.26" per serving matches no price on the page.**
- Evidence: "Sprout $1.26, greens powders $3.60". The page's own prices are $1.07, $1.78 and $2.38 a day.
- Change: recheck it, or use the $1.78 renewal figure with a date.
- Confidence: high.
- Severity: minor.

**F10. The vitamin count changes.**
- Evidence: "21 vitamins & minerals" in one place, "over 20 vitamins & minerals" in the ingredients panel.
- Change: say 21 everywhere.
- Confidence: high.
- Severity: minor.

**F11. A stat is missing its number, and its sources are blank.**
- Evidence: "[number missing] of U.S. adults don't meet recommended daily nutrient intake". The footnotes only say "Source".
- Change: fill in the number and name the source, or cut the line.
- Confidence: high.
- Severity: minor.

**F12. One-time purchase is framed as the bad deal.**
- Evidence: "No Free Shipping. No First Order Discount."
- Change: none for now. It is true.
- Confidence: low.
- Severity: minor.

### Other pages and ads (shorter)

- **Kids page.** "GET 58% WITH FREE SHIPPING" at $22.49 sits right above "Renews at $74.98 each 4 weeks". Say what the $74.98 covers (2 kids?). Ship now. K1 may land here.
- **How-it-works page.**
  - "GET 49% OFF" at $45.33 contradicts $29.99. Align it.
  - Cut the 30/60/90-day "radiant skin", "better metabolism", "hormone health" timeline.
- **Science page.**
  - "Each gummy delivers 100%" should be "each pack".
  - "The results are in. [Sprout] works." should be limited to absorption.
  - "backed by 35,000+ studies" should say these are studies on the ingredients, or be cut.
- **Ads.**
  - T1 is your best ad (4.00%, $1.68 per click) but says "Fix". Keep the slang and the gut angle, and change "fix" to a "supports" line. Ship.
  - W1 "Support Muscle While You Lose Weight" has no evidence on file. Rewrite or pause.
  - P1 has worn out (see section 3). Refresh it.
  - The ads carry no FDA line.

## 5. Sized fixes

Model, not a forecast. The formula, from your own rates:

> clicks reaching the step × (hoped-for rate − current rate) × share who go on to buy (1, since this rate already ends at purchase) × average order.

The total covers each ad's live period (14 to 42 days, dates missing). It counts first orders only. Renewals are excluded because renewal and refund rates are MISSING.

| Fix | Assumption | Model |
|---|---|---|
| F1 + F2 + F3 together, on "61% off" traffic | 12,699 clicks × (2.99% from P1 days 1 to 21 − 1.88% now) × $33.36 | about 140 extra orders, **about $4,680** |
| Same, stretch case | Hoped-for rate is the non-offer ads' 3.42%. Different audiences, so less likely | about 195 orders, about $6,500 |
| Of which P2 alone | 5,569 × (2.99% − 0.90%) × $31.10 | about 116 orders, about $3,620 (included above) |

F4 to F11 are not sized. No split isolates their effect.

## 6. Ship now / test

**Ship now.** Each is plainly wrong, missing a term or unbacked.
- F1: one discount number between ads and page.
- F2: the text sign-up terms at the price.
- F3: the renewal price in the plan box.
- F4: "first order" on the guarantee.
- F5: backed claims only.
- F6: one rating, with its source.
- F8: the sugar-alcohol note, after checking the uncaptured panel.
- F9, F10, F11.
- The Kids, How-it-works, Science page and ad fixes above.

To measure the effect, watch revenue per click on the "61% off" ads. It is $0.63 now, against $1.49 on the other ads.

**Test.**
- **Idea:** move 2 to 3 review cards (Vs Powders, gut) to just under "Start Now", because the strongest proof sits at the very bottom, to move click → purchase.
- **Can traffic support it?** Borderline.
  - If the current pace holds, about 23,000 clicks arrive in 4 weeks, or about 11,500 per side. This is an estimate, since dates are missing.
  - By rule of thumb (16 × p(1−p) ÷ difference²), that detects only a lift from 2.6% to about 3.2% (about 23%) or more.
  - If the store can't split page traffic, or you expect less than that, ship it and watch revenue per visitor.
  - Measure in store analytics, not ad-attributed purchases.
- **Leave:** F12.

## 7. What the page needs from the owner

- MISSING: how "61% off" is worked out, and which "4 FREE gifts" are in the offer now.
- MISSING: the landing page for each ad.
- MISSING: dates for the ad file.
- MISSING: store analytics with the counts at each step (views, added to cart, reached checkout, orders).
- MISSING: phone vs desktop and new vs returning splits.
- MISSING: phone screenshots (about 390 px) of the first screen, the plan box, and the cart with the sign-up discount applied and without it.
- MISSING: the Low Sugar vs Sugar-Free panel text, and grams of sugar.
- MISSING: the number and source for the nutrient-gap stat, and the sources behind "61% of Americans...".
- MISSING: which rating to show, and its source.
- MISSING: the basis and date for "$1.26", and the label for the third "Us vs. Them" column.
- MISSING: what "Renews at $74.98" covers on the Kids page.
- MISSING: subscription share, renewal rate and refund rate.
- MISSING: the cancel steps, so the page doesn't promise more than "Pause Or Cancel Any Time".

## 8. Already working

- **Habit and gut ads convert best.**
  - T1: 4.00% and $1.68 per click.
  - H1 "One Step I Never Skip": 3.38%, with the highest average order at $45.80, on only 1,300 clicks. The habit lane is open.
  - K1: 3.10%.
- **The plan box already shows a struck price and a cost per day**, and "Renews at $49.99" exists. It just needs moving.
- **"Why Sprout?" is in the brand voice and names the enemy:** "No more gagging on pills, sloshing chalky powders, or cleaning messy counters."
- **Testing is specific and dated:** "70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial contaminants", "Tested by [an outside lab] in SEP 2026".
- **The survey stats are framed as a survey of 3,000+ customers.** Delivery time is stated ("ship within 24 hours ... arrive 3-5 days later").
- **Honest notes are already on the page:** the limited-flavour FAQ ("automatically reverts"), the paid-spokesperson disclosure, and the FDA line in the footer.

## 9. Page score

- **Now: 4 out of 100.**
  - 2 stop the sale (F1, F2): 2 × 20 = 40.
  - 6 slow buyers (F3 to F8): 6 × 8 = 48.
  - 4 are minor (F9 to F12): 4 × 2 = 8.
  - 100 − 40 − 48 − 8 = **4**.
- **After the ship-now fixes: 90 out of 100.**
  - Left: F7, which slows buyers (8), and F12, which is minor (2).
  - 100 − 8 − 2 = **90**.
  - This assumes F8 is shipped once the panel is checked.

This score measures what stands in a buyer's way on this page. It is not a sales forecast.
```
