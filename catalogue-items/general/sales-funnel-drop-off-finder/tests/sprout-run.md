# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 6 of 6 met. Invented facts: 0.

A careful, accurate audit: every rate, AOV and sized-fix sum checks against the CSV, the leakiest group (61% offer ads at 1.88% vs 3.42%) is correctly isolated, and the fixes map to real page problems with held facts only. Gaps are marked MISSING throughout, the test-sizing figure is labelled a rule of thumb, and the owner gets a clear ship-now list they can act on this month.

## Judge list

- Met: The top of the audit says which mode it ran in, and page-only mode has no money figures.
  "Mode: with numbers, limited. The ad file splits orders by traffic source" stated first; money figures are allowed in this mode.
- Met: The first finding is on the step that loses the most buyers, not on colour or fonts.
  F1 "The ad's 61% appears nowhere on the page" targets click to purchase for the offer ads, the named leakiest group.
- Met: Every finding quotes the page or points to a screenshot.
  F1 to F13 each quote page text, e.g. "DISCOUNT AUTO-APPLIED", "This policy applies only to your initial purchase."
- Met: Sized fixes use your own rates, show the sum, and say "model, not a forecast".
  "Model, not a forecast." Hoped-for rate from "P1 days 1 to 21"; "8,949 × 2.99% = 267.3, minus 127 = 140" × $33.36.
- Met: No fix adds a rating, review count, price or offer you don't hold.
  Suggested copy uses held facts only: 55% (pop-up), $1.78/day renewal, "Rip. Tip. Enjoy.", approved "supports digestion and gut health".
- Met: Sections that work are named as working.
  Section 8 lists plan box basics, pop-up 55% match, testing section, survey stats, FAQ answers, voice, disclosures.

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
# Sprout product page audit: where buyers drop out

## 1. Mode and sources

- **Mode: with numbers, limited.** The ad file splits orders by traffic source (9 ads, 10 rows, because P1 is split into days 1 to 21 and days 22 to 42). That meets the minimum. There are no steps between click and purchase and no device split. So the only measurable step is **ad click to purchase**, split by ad.
- **Date range:** MISSING. The file gives days live (14 to 42) but no calendar dates.
- **Attribution window and source of purchase counts:** MISSING. These look like ad-platform figures. They are treated as the owner's numbers.
- **Ads checked:** opening lines only, from ad-results.csv. Ad images were not seen, so the visual match with the page is not judged.
- **Landing page per ad:** MISSING. This audit assumes all 9 ads land on sprout.example/products/sprout, the page supplied.
- **Page capture:** text only, top to bottom, read 13 Oct 2026 with notes from 30 Sept (sprout/product-page.md).
  - MISSING: phone screenshots at about 390 px.
  - Anything about layout, what sits on the first screen, image content or button placement is **inferred**, not seen.
- **Cart and checkout:** not inspected. The file does not show whether the $29.99 price holds at checkout without the text sign-up.
- **Facts:** sprout/brand.md (offers, guarantee, claims marked fine or risky).

## 2. Step table: ad click to purchase, by ad

Owner's numbers. Rates are my arithmetic on them.

| Ad | Angle | Impr. | Link clicks | CTR | Purchases | Click to purchase | AOV | Revenue per click | Revenue / spend |
|---|---|---|---|---|---|---|---|---|---|
| T1 Hot girl tummy | Gut pain | 300,000 | 4,950 | 1.65% | 198 | **4.00%** | $42.10 | $1.68 | 1.98 |
| H1 One step never skip | Habit | 96,300 | 1,300 | 1.35% | 44 | 3.38% | $45.80 | $1.55 | 1.55 |
| K1 Fiber kids | Kids | 169,200 | 2,030 | 1.20% | 63 | 3.10% | $48.60 | $1.51 | 1.39 |
| F1 Fiber question | Fiber | 138,500 | 1,524 | 1.10% | 46 | 3.02% | $40.39 | $1.22 | 1.03 |
| P1 Too expensive, days 1 to 21 | 61% off | 250,000 | 3,750 | 1.50% | 112 | 2.99% | $34.20 | $1.02 | 1.28 |
| W1 Muscle weight loss | Weight | 64,300 | 900 | 1.40% | 23 | 2.56% | $44.52 | $1.14 | 1.14 |
| S1 Trusted by 1M | 61% off | 128,000 | 1,600 | 1.25% | 38 | 2.38% | $33.00 | $0.78 | 0.78 |
| P1 Too expensive, days 22 to 42 | 61% off | 193,500 | 1,780 | 0.92% | 39 | 2.19% | $34.21 | $0.75 | 0.44 |
| R1 Runner | Runner | 76,900 | 538 | 0.70% | 10 | 1.86% | $40.00 | $0.74 | 0.40 |
| P2 Dont pay full price | 61% off | 227,300 | 5,569 | **2.45%** | 50 | **0.90%** | $31.10 | $0.28 | 0.62 |
| **All ads** | | 1,644,000 | 23,941 | 1.46% | 623 | **2.60%** | $39.60 | $1.03 | 1.15 |

**Split by angle:**

| Group | Clicks | Share of clicks | Purchases | Click to purchase | AOV | Revenue per click |
|---|---|---|---|---|---|---|
| "61% off" offer ads (P1 both periods, P2, S1) | 12,699 | 53% | 239 | **1.88%** | $33.36 | $0.63 |
| All other ads | 11,242 | 47% | 384 | **3.42%** | $43.48 | $1.49 |

**Against the store's own past:** P1 fell from 2.99% to 2.19% click to purchase, and from 1.50% to 0.92% CTR, between its first and second 21 days.

**Small samples:** R1 (10 purchases), W1 (23) and H1 (44). Read their rates loosely.

## 3. Leakiest step

- **Step:** ad click to purchase. It is the only step the file can see.
- **Group:** the "61% off" offer ads.
  - Together they bring 53% of all clicks but convert at 1.88%, against 3.42% for every other ad.
  - The worst single source is **P2 "Don't Pay Full Price. You Literally Don't Have To. (61% off inside)"**. It has the highest CTR in the account (2.45%) and the most clicks (5,569), but converts at 0.90%. That is under a quarter of T1's rate and under a third of P1's fresh rate.
  - People click the 61% promise, then don't buy.
- **Page that owns it:** the product page, assumed to be the landing page. Its first screen and buying area are where a 61% clicker meets the price.
- **What the file cannot show:** whether these buyers leave on landing, before adding to cart, or at checkout. If the $29.99 price only appears after a text sign-up, part of the loss may sit in checkout (not inspected).

## 4. Findings

**How the page was read:** a five-second glance at the inferred phone first screen, a skim of headings, prices and buttons, and a full read as a buyer arriving from a 61% ad.

- **Glance:**
  - The first screen likely shows the rotating bar, gallery, "Sprout Superfood Gummies", "60+ potent ingredients to revive whole body vitality" and "4.8/5.0 (100,000)".
  - What it is: gummies, clear enough.
  - Who it's for, and that it is one pack a day: not said.
  - What to do next: the button is likely below the fold (inferred).
- **Skim:** four different discount figures, two different prices per day, two star ratings.
- **Full read:** the price terms, the guarantee limit and the text sign-up condition only appear below the button, in the footer or in the last FAQ.

### Product page (owns the leakiest step)

**F1. The ad's 61% appears nowhere on the page.**
- **Evidence:** the ads promise "61% off". The page shows:
  - "Save 52% + free shipping on your first order" (bar)
  - "MOST POPULAR: GET UP TO 55% OFF" (badge)
  - "Sign Up for 55% Off" (pop-up)
  - "~~$66.65~~ $29.99", which works out to 55.0% off
- **Also missing:** the ads' "4 FREE gifts" are not mentioned on the page.
- **Step it should move:** click to purchase for the offer ads (P1, P2, S1).
- **Change:**
  - Make the ad and the page show one identical figure.
  - Either change the ads to the 55% the page actually delivers, or, if 61% is a real path (MISSING: what makes up 61%), show that exact figure and the gifts in the plan box for that traffic.
  - Remove the 52% bar line.
- **Keep:** the strike-through $66.65 next to $29.99, and the price-objection angle itself (P1 fresh was 2.99%).
- **Confidence:** high that the mismatch exists. Medium that it explains most of the gap, because deal-led clicks may simply buy less.
- **Severity:** stops the sale.

**F2. "$29.99" depends on a text sign-up, but the page says "DISCOUNT AUTO-APPLIED".**
- **Evidence:**
  - Plan box: "$29.99. $1.07/day", then "DISCOUNT AUTO-APPLIED".
  - Birthday section: "Subs Now Start at $29.99."
  - Footer: "Offer assumes customer has received and uses promotional SMS discount reserved for new customers only."
- **Step it should move:** click to purchase, most likely the checkout part (not inspected).
- **Change:**
  - Next to the $29.99, state the condition in full-size type: "$29.99 first box with text sign-up, new customers only".
  - Or make the discount truly auto-apply.
  - Make the pop-up the clear route to that price.
- **Keep:** the pop-up's 55%, which matches the plan box price.
- **Confidence:** high on the contradiction. What a non-sign-up buyer sees at checkout is MISSING.
- **Severity:** stops the sale.

**F3. The renewal price is hidden in small print under the button.**
- **Evidence:**
  - Plan box: "$29.99. $1.07/day".
  - Under the button: "Renews at $49.99 each 4 weeks. Cancel anytime."
  - The price doubter's own words: "Will the price jump after the first order?" and "I hate subscriptions because I feel like they are a trap."
- **Step it should move:** click to purchase for price-led traffic.
- **Change:** put "First box $29.99, then $49.99 every 4 weeks ($1.78/day)" inside the plan box at the same size as the price.
- **Keep:** "Pause Or Cancel Any Time" in the site's own words. Promise nothing easier than that, since cancelling is the loudest public complaint.
- **Confidence:** medium.
- **Severity:** slows buyers.

**F4. The guarantee reads as unlimited but covers the first order only.**
- **Evidence:**
  - Plan box: "30-Day Money-Back Guarantee".
  - Bar: "FREE SHIPPING + 30-DAY GUARANTEE".
  - Last FAQ: "This policy applies only to your initial purchase."
- **Step it should move:** click to purchase. Also refund and trust risk later.
- **Change:** "30-day money-back guarantee on your first order" wherever it appears.
- **Keep:** the guarantee in the plan box. It is a real reassurance.
- **Confidence:** high that terms are missing. Low on the size of the effect on sales.
- **Severity:** slows buyers.

**F5. The top claims are ones the brand can't back.**
- **Evidence:** "60+ potent ingredients to revive whole body vitality", "Promotes mental clarity + energy" and "Supports immunity + stress relief". The study measured blood vitamin C (+40.1%) and folate (+20.5%) only.
- **Step it should move:** click to purchase for the doubter ("A gummy can't hold enough to replace my powder"). It also removes claim risk.
- **Change:** use the claims already cleared:
  - "60+ ingredients, 21 vitamins & minerals, and 6g fiber" in 1 pack
  - "Supports digestion and gut health"
  - "Clinically tested for nutrient absorption: vitamin C +40.1%, folate +20.5% (2025, 12 weeks, 120 adults)"
- **Keep:** "Supports digestion and gut health" and "Clinically tested for nutrient absorption", which are already in the bullets.
- **Confidence:** high on the claim problem. Medium on any effect on sales.
- **Severity:** slows buyers.

**F6. No Sugar-Free stomach note (inferred).**
- **Evidence:**
  - The "Low Sugar vs. Sugar-Free" panel was not captured.
  - "Nothing about sugar alcohols was seen on the page."
  - The brand file says Sugar-Free "upsets some stomachs".
  - The best-converting ad, T1 "Fix the Hot Girl Tummy" at 4.00%, brings exactly the gut-sensitive buyer.
- **Step it should move:** click to purchase for gut traffic. Also refunds.
- **Change:** one line under "Select Sugar Level": "Sensitive stomach? Start with Low Sugar. Sugar-Free uses sugar alcohols."
- **Keep:** both options, and Low Sugar as the cheaper default.
- **Confidence:** low, because the panel was not seen.
- **Severity:** slows buyers.

**F7. Reviews sit at the very bottom.**
- **Evidence:** "Real Customer Reviews (at the very bottom)". The best proof ("Vs Powders" cards, gut stories, "the one thing I've been able to stick to") is far from "Start Now".
- **Step it should move:** click to purchase.
- **Change:** 2 or 3 real review cards (one Vs Powders, one gut, one habit) directly under the button.
- **Keep:** the full review section where it is.
- **Confidence:** medium.
- **Severity:** slows buyers.

**F8. The one-time purchase is framed as a punishment.**
- **Evidence:** "One Time Purchase ... No Free Shipping. No First Order Discount."
- **Step it should move:** click to purchase for buyers who won't subscribe.
- **Change:** plain wording, for example "28 packs, delivered once. $66.65." Shipping cost stated as a figure (MISSING: the shipping cost).
- **Keep:** Subscribe & Save as the selected default.
- **Confidence:** low. It could lower the subscription share.
- **Severity:** slows buyers.

**F9. Two star ratings on one page.**
- **Evidence:** header "4.8/5.0 (100,000)", bottom widget "4.75 stars, 109,639 reviews".
- **Step it should move:** click to purchase, for trust.
- **Change:** show one figure, the live widget's, with its source in the header.
- **Keep:** the rating near the title.
- **Confidence:** medium.
- **Severity:** minor.

**F10. The vitamin count changes.**
- **Evidence:** "21 vitamins & minerals" (brand claim) against "over 20 vitamins & minerals" (Ingredients accordion).
- **Change:** "21" everywhere.
- **Confidence:** high.
- **Severity:** minor.

**F11. A stat with no number, and footnotes that say only "Source".**
- **Evidence:** "[number missing] of U.S. adults don't meet recommended daily nutrient intake". The "61% of Americans experience weekly digestive issues" line links only to "Source".
- **Change:** fill in the number and name the sources, or cut the lines.
- **Confidence:** high.
- **Severity:** minor.

**F12. The Us vs. Them price is dated and matches no price on the page.**
- **Evidence:** "Sprout $1.26, greens powders $3.60, a third column ~$35 (label not captured)". The plan box shows $1.07 first box and $1.78 renewal.
- **Change:**
  - Use the renewal $1.78/day, the price a buyer pays long term.
  - Recheck the powder figure. The brand file holds about $2.63 per serving for the big-name powder.
  - Label or cut the third column.
- **Confidence:** high.
- **Severity:** minor.

**F13. The first screen doesn't say how it works (inferred).**
- **Evidence:** the title is "Sprout Superfood Gummies". "28 packs" and "Grab a single pack daily" only appear in the plan box and the closed Directions accordion.
- **Change:** a short line under the title in the brand's voice, for example "1 pack a day. Rip. Tip. Enjoy."
- **Keep:** the title.
- **Confidence:** low, without a screenshot.
- **Severity:** minor.

### Other pages and ads (shorter)

- **Kids page:** "GET 58% WITH FREE SHIPPING" at $22.49, then "Renews at $74.98 each 4 weeks". The renewal is three times the first price and unexplained (probably 2 kids, MISSING). State the number of kids and the price per kid. Ship now.
- **How-it-works page:** "GET 49% OFF" at $45.33 is a fifth discount figure. The 30/60/90-day timeline ("radiant skin", "better metabolism", "hormone health") is unsupported. Align the figure and cut the timeline. Ship now.
- **Science page:**
  - "Each gummy delivers 100% of your daily needs" uses the wrong unit. Change it to per pack.
  - "these gummies actually f*&$%#g work", "The results are in. [Sprout] works." and "backed by 35,000+ studies" overreach. Keep them to the absorption study.
  - Ship now.
- **Shop page:** "Clinically backed formula for energy, immunity, and daily wellness". The study did not test energy or immunity. Ship now.
- **Ads:**
  - T1 converts best but opens with "Fix", which the brand's own rule says should be "supports". Reword the claim, keep the slang and the gut angle. Do not invent a new claim; for example "Hot Girl Tummy? 6g of fiber a day that supports digestion and gut health." Ship now.
  - W1 "Support Muscle While You Lose Weight" has no evidence on file. Pause or reword. Ship now.
  - The ads carry no FDA line.
- **Cart and checkout:** not inspected. MISSING: shipping cost shown, total with and without the text discount, and payment options.

## 5. Sized fixes

**Model, not a forecast.**
- **Formula:** clicks reaching the step × (hoped-for rate minus current rate) × AOV. Click to purchase is a single step here, so the share who go on to buy is 1.
- **Hoped-for rate:** taken only from the store's own better group.
- **Period:** each ad's own run in the file (14 to 42 days, dates MISSING).

**Fix F1 + F2 + F3 (offer match, price terms, renewal clarity) on offer-ad traffic**

| Version | Clicks | Current rate | Hoped-for rate (source) | Extra purchases | AOV | Extra revenue |
|---|---|---|---|---|---|---|
| Central: P2, S1, P1 days 22 to 42 | 8,949 | 1.42% (127 purchases) | 2.99%, P1 days 1 to 21, the same 61% offer when fresh | 8,949 × 2.99% = 267.3, minus 127 = **140** | $33.36 | **about $4,680** |
| of which P2 alone | 5,569 | 0.90% | 2.99%, same source | 166.3 minus 50 = **116** | $31.10 | **about $3,620** |
| Upper: all offer ads | 12,699 | 1.88% | 3.42%, the non-offer ads | 433.8 minus 239 = **195** | $33.36 | **about $6,500** |

**Assumptions:**
- All 9 ads land on this page.
- The gap is caused by the page, not by who the offer attracts.
- AOV stays at the offer-ad level.
- Part of P1's later drop is ad fatigue, which page fixes won't cure. The central model is therefore the more realistic one.
- Revenue is first-order only. Renewals are not counted (MISSING: renewal and cancel rates).

**Not sized:** F5 to F13. No group in the file isolates their effect, so there is no own-rate to model from. They are ranked by severity in section 4.

## 6. Ship now / test

**Ship now** (plainly wrong, missing terms, or claims the brand can't back):

1. **F1:** one discount figure, matched between ad and page. Remove the 52% bar line, and show the gifts if the ads promise them.
2. **F2:** state the text sign-up condition next to $29.99, or make the discount truly auto-apply.
3. **F3:** put the renewal price inside the plan box.
4. **F4:** "on your first order" added to every guarantee mention.
5. **F5:** swap the top three claims for the cleared ones.
6. **F6:** a Low Sugar note for sensitive stomachs. Confirm the panel text first.
7. **F9, F10, F11, F12:** one rating with its source, "21" everywhere, fill in or cut the stat, and current per-serving prices.
8. **F13:** a one-line "how it works" under the title. Ship and watch revenue per click.
9. **Other pages and ads:** Kids renewal explained, the 49% figure aligned, science, shop and how-it-works claims fixed, T1 "Fix" reworded, W1 paused or reworded.

**Test:**

- **Reviews by the button (F7).** Change: add 2 to 3 review cards (Vs Powders, gut, habit) under "Start Now". Because: the best proof is at the very bottom. Step to move: click to purchase.
  - **Traffic:** this file holds about 24,000 clicks across the ads' runs. Rule of thumb: at a 2.6% base rate, a fair test needs about 30,000 visitors to catch a 20% lift, or about 13,000 to catch a 30% lift.
  - So this file's traffic supports only a test for a large lift within four weeks. The whole account probably has more traffic (MISSING: total page sessions).
  - If total traffic is below about 30,000 visitors in four weeks, ship it and watch revenue per visitor instead.
- **Neutral one-time option (F8).** Change: plain wording on the one-time purchase. Because: buyers who fear subscriptions are pushed away. Step to move: click to purchase.
  - **Measure:** first-order conversion and subscription share together (MISSING: current subscription share).
  - **Traffic:** same limit as above.

## 7. What the page needs from the owner

- MISSING: phone screenshots at about 390 px of the first screen (before and after the pop-up), the full scroll, the plan box with an option picked, and the cart with an item in it.
- MISSING: page sessions, product views, add to cart, reached checkout and orders for one stated date range, split by phone and desktop and by new and returning.
- MISSING: calendar dates for each ad, and the attribution window.
- MISSING: which page each ad lands on.
- MISSING: what the 61% is made of, and which "4 FREE gifts" are given and where they are shown.
- MISSING: whether $29.99 holds at checkout without the text sign-up.
- MISSING: the text of the Low Sugar vs. Sugar-Free panel, and grams of sugar per pack.
- MISSING: one-time shipping cost.
- MISSING: subscription share, refund rate, renewal and cancel rates.
- MISSING: the number in "don't meet recommended daily nutrient intake", and the sources for both stats.
- MISSING: current per-serving prices for the Us vs. Them section, and the third column's label.
- MISSING: what the Kids "$74.98" renewal covers.
- MISSING: the ad images, to judge the visual match.

## 8. Already working

- **Plan box basics:** Subscribe & Save is preselected, "Pause Or Cancel Any Time" sits in the box, and the renewal line exists (it only needs moving up).
- **Pop-up:** "Sign Up for 55% Off" matches the real plan box price of 55% off.
- **Testing section:** "70 pesticides, 4 heavy metals, 16 contaminants, 9 microbial contaminants" with "Tested by [an outside lab] in SEP 2026". Specific and dated.
- **Survey stats:** shown with the sample stated ("Survey of 3,000+ customers after 3 months").
- **FAQ answers:** delivery ("ship within 24 hours ... arrive 3-5 days later"), the limited flavour reverting to Original, and an honest "When will I feel something?".
- **Voice:** "No more gagging on pills, sloshing chalky powders, or cleaning messy counters." and "Sachet is a fancy word for our gummy pack." are on brand and clear.
- **Disclosure and compliance:** the paid athlete is disclosed, and the FDA line is in the footer.
- **Ads beyond discounts:** in the file, gut (T1 4.00%), habit (H1 3.38%, small sample) and kids fiber (K1 3.10%) beat every discount ad on click to purchase and on revenue per click.

## 9. Page score

Scored on the product page behind the leakiest step. It measures obstacles on the page, not sales.

- **Now:** 100 minus 2 stops the sale × 20 (F1, F2), minus 6 slows buyers × 8 (F3, F4, F5, F6, F7, F8), minus 5 minor × 2 (F9, F10, F11, F12, F13).
  - 100 − 40 − 48 − 10 = **2 / 100**
- **After the ship-now fixes:** only the two test items remain, F7 and F8, both slows buyers.
  - 100 − 8 − 8 = **84 / 100**
```
