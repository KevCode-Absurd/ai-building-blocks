# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A solid, usable doubt map: every row ties a real review to the exact page spot, proposed copy only reuses page facts or supplied terms, and gaps are marked MISSING rather than filled. The coverage arithmetic (7.5/11 = 68, 9/11 = 82) checks out and health-adjacent rows (GLP-1, energy, sleep) are handled cautiously.

## Judge list

- Met: Every row has a real quote and a source.
  All 12 rows quote reviews.md with source, e.g. R20 "I have tried multiple times to cancel my subscription." (review site).
- Met: Nothing is marked "missing" unless the FAQ, gallery and buying area were checked, or it's marked "unknown".
  No row marked missing; uncaptured Sugar-Free panel is "Unknown", gallery noted as "not seen" in row 11.
- Met: No proposed answer states a fact, test or number you didn't supply.
  Answers reuse page facts only: "80% said they take it daily", "Then $49.99 every 4 weeks ($1.78/day)", "[MISSING: steps]".
- Met: Counts are distinct sources, not mentions.
  Row 3 lists R3, R4, R6 = 3; row 5 lists five separate reviewers = 5.
- Met: With a small sample, priorities are labelled as a guess.
  "13 of the 20 reviews were picked by the brand... The priority order is a guess."

## What went in

```text
Customer words: 20 public reviews R1 to R20 plus two short fragments,
with where each came from (sprout/reviews.md).

The page: Sprout's main product page as text, including the closed
accordions and FAQ, with notes on what wasn't captured
(sprout/product-page.md).

Facts: Sugar-Free uses sugar alcohols. Subscriptions "Pause Or Cancel
Any Time". Guarantee: 30 days, first order only.

[attached: sprout/reviews.md, sprout/product-page.md]
```

## What came out

```text
| Doubt | Quote and source | Distinct sources | Where the page answers it now | Visible, hidden, missing or unknown | Fact still needed | Answer to add, and where |
|---|---|---|---|---|---|---|
| 1. Will I actually stick with it? | R1 "[Sprout] has been the one thing I've been able to stick to." (brand site); R2 "It's wild I WANT to take [Sprout] and don't forget." (brand site) | 2 | "Why Sprout?" accordion, closed ("A habit that tastes so good…"). The survey section below the plan box says "95% take it at least 4 to 6 times a week (80% daily)". | Hidden | None for moving it. The survey method (who was asked, how) would help: `MISSING: survey method`. | Under the plan box, before the button, add one line: "In a survey of 3,000+ customers after 3 months, 80% said they take it daily." Label it as a customer survey. Put R1 beside it as a quote. |
| 2. Is it worth the price, and what will I really pay? | R3 "even with their monthly subscription discount it was still $94 a month" (brand site); "They are expensive" (retailer) | 2 | The plan box shows $29.99, $1.07/day, ~~$66.65~~. Renewal at $49.99 appears only in small print under the button. The cost-per-serving comparison ($1.26 vs $3.60) is far below. The footer says the price needs the SMS sign-up. | Hidden (the first price is visible, but renewal and the comparison are not) | `MISSING: what $1.26/serving is based on, given $1.07 first box and $1.78 renewal`. `MISSING: source for $3.60 and the label of the ~$35 column`. `MISSING: whether $29.99 needs the SMS sign-up, and which discount is real (49/52/55/58/61%)`. | In the plan box, show "Then $49.99 every 4 weeks ($1.78/day)" at the same size as $29.99. Use one discount figure across the bar, badge, pop-up and ads. If SMS is required, state it in the plan box and drop "DISCOUNT AUTO-APPLIED". Move the cost comparison beside the price only after the facts above are confirmed. |
| 3. Is it gritty or chalky, or a hassle like powders? | R3 "the drink was definitely gritty/chalky" (brand site); R4 "I've been choking on [a big-name greens powder]" (brand site); R6 "not having to clean a shaker bottle" (brand site) | 3 | The title says "Superfood Gummies". "Why Sprout?" accordion: "No more gagging on pills, sloshing chalky powders". "Vs Powders" review cards sit far below. | Visible (the format is in the title; the detail is hidden) | None | Put R4 or R6 as a short quote beside the plan box, labeled as a customer review. Do not repeat R3's $94 as a brand claim. |
| 4. Can it replace my other supplements? | R5 "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies." (brand site) | 1 | "Why Sprout?" accordion ("replaces handfuls of health products"). The Benefits accordion and the Ingredients accordion ("over 20 vitamins & minerals") are both closed. A "View Nutrition Label" link exists. | Hidden | `MISSING: per-pack amounts (e.g. B12) from the label`. `MISSING: whether it contains probiotics or only prebiotics (inulin)`. `MISSING: the correct vitamin count (21 vs "over 20")`. | After confirming the facts, add an image of the nutrition label with the key amounts called out, in the gallery or beside the price. Make no "replaces" claim for probiotics unless the product contains them. |
| 5. Will it help my digestion or regularity? | R7 "My bowel movements are normal for the 1st time in 15 years!" (brand site); R8 "chronic IBS" (brand site); R9 "solution to my problems with regularity" (retailer); R10 "less bloated" (retailer); R11 "was always constipated not anymore" (brand site widget) | 5 | Bullet: "Supports digestion and gut health". Survey "67% better, more regular digestion" sits below. The 61% stat has footnotes that only say "Source". | Visible | `MISSING: which ingredient(s) and amount do the work (e.g. inulin) and how`. `MISSING: real source for the 61% stat`. | Directly under the gut bullet, add: "67% of 3,000+ surveyed customers reported better, more regular digestion after 3 months (customer survey)." Add R7 framed as one buyer's story, not a promise. |
| 6. Will Sugar-Free upset my stomach? | "The sugar free [Sprout] worked too well." (review site, about sugar alcohols) | 1 | The Low Sugar vs. Sugar-Free panel was not captured. No sugar-alcohol mention was seen elsewhere. | Unknown | `MISSING: which sugar alcohols and how much per pack`. `MISSING: the panel's current text`. | Next to the Sugar Level picker, add: "Sugar-Free is sweetened with sugar alcohols, which can upset some stomachs." (The use of sugar alcohols is a supplied fact.) Gut buyers are a core group, so this belongs at the picker, not in the panel. |
| 7. Will I like the taste, and what if I don't? | R12 "tastes like fruit snacks I ate as a kid" (brand site); R6 "Like mixed berries!" (brand site); R14 "They taste good!" (brand site widget); R18 "tasted terrible, but after the third day they started tasting better" (retailer); R19 "the taste is off." (brand site widget, tie-in Sugar-Free) | 5 | The flavour tile says "Where fresh strawberries meets clean greens". The "Why Sprout?" accordion says "Delicious". The plan box says "30-Day Money-Back Guarantee". The first-order limit appears only in the last FAQ. | Visible (flavour); the guarantee limit is hidden | `MISSING: whether Sugar-Free tastes different from Low Sugar`. | Beside the button: "30-day money-back guarantee on your first order." This uses the supplied terms and moves the limit out of the FAQ. Do not use R18 to promise the taste improves. |
| 8. Will I feel more energy, and when? | R13 "clean feeling energy and mental focus ... without the sugar crash" (brand site); R14 "noticed a difference in my energy, gut health, and even my sleep!!!" (brand site widget) | 2 | Bullet: "Promotes mental clarity + energy". FAQ, far below: "Some individuals may notice improvements within days or weeks ... Consistent daily use is essential." Survey "52% feel more energized" is also below. | Hidden | `MISSING: evidence for the energy and clarity claims (the study measured only 2 vitamins in the blood)`. | Once the claim's support is confirmed, move the FAQ timing line under the energy bullet with the 52% survey figure, labeled as a survey. If it can't be supported, soften the bullet rather than hide it. Do not claim sleep benefits. |
| 9. I'm on a GLP-1. Will it help? | R11 "on a glp1 ... was always constipated not anymore" (brand site widget); R14 "I'm on Glp-1 and they definitely help with the vitamin loss" (brand site widget) | 2 | Only the auto-generated review summary at the very bottom, which mentions GLP-1 side effects. | Hidden | `MISSING: legally approved brand wording on use with medication`. | Add no brand claim. Customer reviews can stay as customer words. Check that the auto-summary isn't presenting GLP-1 benefits as the brand's voice. A FAQ line on medication goes in only after legal provides the wording. |
| 10. Is there a version for my kids? | R16 "this is the only one they love eating" (brand site, Kids page); R17 "A bonus is my kids love them too!" (brand site) | 2 | Only "How many Adults?" sits in the buy area. Kids tiles appear in "Find Your Flavor" far below. | Hidden | `MISSING: what the Kids page's "Renews at $74.98" covers (how many kids)`. | Next to "How many Adults?", add a link: "Buying for kids? See Sprout Kids." The tiles for Original Kids and the tie-in Kids flavour already exist. |
| 11. Is it easy on the go? | R15 "So easy to grab and eat on my way to the billion things I have to do as a mom." (brand site); R6 "The convenience and taste are huge!" (brand site) | 2 | The plan box says "28 packs". The "Why Sprout?" and Directions accordions are closed ("28 individual packs. Grab a single pack daily"). The "Snackable, Packable" section is below. The gallery was not seen. | Hidden (gallery unknown) | None | Change the plan box line to: "28 single-day packs, one handful of gummies each". This comes from the Directions. A gallery image of one opened pack would also help; use a real product photo. |
| 12. Can I really cancel, or is it a trap? | R17 "I hate subscriptions because I feel like they are a trap" (brand site); R20 "I have tried multiple times to cancel my subscription." (review site) | 2 | The plan box says "Pause Or Cancel Any Time". Under the button: "Cancel anytime". | Visible | `MISSING: the actual cancel steps (self-serve in account? how long?) and why R20's attempts failed`. Copy can't fix a cancel process that doesn't work. | Once the process is confirmed, add under the button: "Cancel or pause in your account in [MISSING: steps]." Stop marking One Time Purchase with "No Free Shipping / No First Order Discount" wording that reads as a push. |

**Top 5 fixes**
1. Plan box: show the $49.99 renewal ($1.78/day) as clearly as $29.99, use one discount figure everywhere, and state the SMS condition if it applies.
2. Beside the button: "30-day money-back guarantee on your first order", plus the real cancel steps once confirmed.
3. At the Sugar Level picker: a sugar-alcohol line for Sugar-Free.
4. Under the gut bullet: the 67% survey figure, labeled, with R7 told as one buyer's story.
5. Move two or three reviews (R1 habit, R4 or R6 powder quitters) up beside the plan box, out of the bottom section.

**Facts to collect before writing**
- Whether $29.99 requires the SMS sign-up, and which single discount figure is accurate.
- The real cancel process, and what went wrong for R20.
- Per-pack nutrient amounts, whether it contains probiotics, and the correct vitamin count (21 vs "over 20").
- Sugar-alcohol types and amounts, the Low Sugar vs. Sugar-Free panel text, and any taste difference between them.
- The basis of $1.26/serving, the source for $3.60, and the label of the ~$35 column.
- The missing number in the nutrient-intake stat, and real sources for the 61% stat.
- Evidence for the energy, clarity, immunity and stress claims beyond the 2-vitamin blood study.
- Who the Kids $74.98 renewal covers.
- Legal-approved wording on medication or GLP-1 use.
- Which star rating is current (4.8, 4.75 or 4.74).
- Phone screenshots of the first screen, gallery and opened accordions.

**Coverage score**
- **Now:** 4 visible (3, 5, 7, 12) × 1 + 7 hidden (1, 2, 4, 8, 9, 10, 11) × 0.5 = 7.5. 7.5 / 11 × 100 = **68**. Row 6 is unknown and left out.
- **With new answers (only those needing no missing fact):** rows 1, 10 and 11 move from hidden to visible. That gives 7 × 1 + 4 × 0.5 (rows 2, 4, 8, 9) = 9. 9 / 11 × 100 = **82**. Row 6 is still left out; its sugar-alcohol line uses a supplied fact and would add one more visible row once the panel is checked.

**What this can't tell you**
- 13 of the 20 reviews were picked by the brand, so complaints such as cancelling, cost and Sugar-Free effects are likely under-counted. The priority order is a guess.
- These are buyers only. People who left the page without buying may have different doubts, especially about price and the subscription.
- Visibility was judged from the order of the text, not phone screenshots. Nothing here estimates lost sales.

Want to turn these buying reasons into ads next: [image ads](https://useaiblocks.com/skills/customer-quote-image-ad) or [video scripts](https://useaiblocks.com/skills/quote-video-ad-script)? Or name something else.
```
