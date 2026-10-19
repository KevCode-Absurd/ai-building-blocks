# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, usable doubt map: every row is tied to a real review, visibility labels are honest, the score arithmetic (7.5/11 = 68, 9.5/11 = 86) checks out, and risky claims (GLP-1, energy, guarantee wording) are handled conservatively. The only weaknesses are cosmetic: the DOUBT MAP heading is dropped and the SMS-discount condition is asked for as MISSING even though the page footer already states it.

## Judge list

- Met: Every row has a real quote and a source.
  All 13 rows carry a verbatim review line with its R-number and origin, e.g. "the taste is off." (R19, widget, tie-in Sugar-Free).
- Met: Nothing is marked "missing" unless FAQ, gallery and buying area were checked, or it's marked "unknown".
  No row is labelled missing; cancel steps and Sugar-Free panel are "Unknown" with "The gallery was not seen" noted.
- Met: No proposed answer states a fact, test or number you didn't supply.
  Answers reuse page/supplied facts only: "$29.99 first box, then $49.99", "Sweetened with sugar alcohols", "30-day money-back guarantee on your first order".
- Met: Counts are distinct sources, not mentions.
  Counts tally one per distinct review, e.g. row 1 lists R1, R4, R2, R6, R15 and counts 5.
- Met: With a small sample, priorities are labelled as a guess.
  "Top 5 fixes (the order is a guess: 20 reviews, mostly hand-picked by the brand)"

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
| Will I actually stick with it, compared with powders? | "[Sprout] has been the one thing I've been able to stick to." (R1, brand site); "I've been choking on [a big-name greens powder]" (R4, brand site); also R2, R6, R15 (all brand site) | 5 | "Why Sprout?" accordion (closed); survey line "95% take it at least 4 to 6 times a week (80% daily)" and "Vs Powders" review cards, both below the plan box | Hidden | None for moving existing copy. The survey method (who was asked, how they were picked) would strengthen it. | Put one "Vs Powders" review card and the existing survey line directly under the Start Now button. Label the survey as a customer survey of 3,000+ after 3 months. |
| Is it worth the price, and is it cheaper than powders? | "even with their monthly subscription discount it was still $94 a month" (R3, brand site); "They are expensive" (retailer fragment) | 2 | Plan box price is visible ($29.99, $1.07/day). The renewal at $49.99 appears only in small text under the button. The $1.26 vs $3.60 comparison is in "Us vs. Them", far below. | Hidden | MISSING: what the $1.26/serving figure is based on (it matches neither $1.07 nor the $1.78 renewal), what the $3.60 powder figure is based on, the third column's label, and whether $29.99 needs the SMS sign-up | Beside the price, give "$29.99 first box, then $49.99 every 4 weeks" equal weight. Add the cost comparison next to it only once the basis is confirmed. |
| Can it replace my other supplements? | "I also stopped buying separate probiotic gummies, b12 gummies, and multivitamin gummies." (R5, brand site) | 1 | "Why Sprout?" ("replaces handfuls of health products") and "Benefits" ("replace a big shelf in your medicine cabinet"), both closed accordions. Ingredients accordion says "over 20 vitamins & minerals". The "View Nutrition Label" link was not opened. | Hidden | MISSING: per-pack amounts from the nutrition label, and whether any probiotic is included (the page names only prebiotics and inulin). The vitamin count also conflicts: "21" in one place, "over 20" in another. | Near the flavour picker, add an image of the nutrition label (real label). Make no "replaces" claim until the amounts are checked against what customers say they replaced. |
| Will it help my digestion or regularity? | "My bowel movements are normal for the 1st time in 15 years!" (R7, brand site); "[Sprout] have been the solution to my problems with regularity." (R9, retailer); also R8, R10 (retailer), R11 (widget) | 5 | Bullet "Supports digestion and gut health" is above the button. Survey "67% better, more regular digestion" and the gut reviews are below the plan box or at the very bottom. | Visible (claim). Proof is hidden. | None for moving existing copy | Next to the digestion bullet, add the 67% survey line and R7 framed as one buyer's story ("one customer's experience; results vary"), never as a promise. |
| Does it help while on a GLP-1 medication? | "I've been on a glp1 for about a year now and was always constipated not anymore" (R11, widget); "I'm on Glp-1 and they definitely help with the vitamin loss" (R14, widget) | 2 | Only in the auto-generated review summary at the very bottom, which mentions GLP-1 side effects | Hidden | The brand has no supported claim here and should not make one | Add no brand answer. Check whether the auto-generated summary repeating GLP-1 effects counts as the brand making the claim, and remove it if so. Leave customer reviews as they are. |
| Will it taste good? | "[Sprout] literally tastes like fruit snacks I ate as a kid." (R12, brand site); also R6, R14 (widget), R16 | 4 | Flavour tile "Where fresh strawberries meets clean greens" sits in the picker. "Delicious" is in the accordion. Taste review cards are below. | Visible | None | Optional: one Taste review card beside the flavour picker |
| Will it give me energy and focus? | "clean feeling energy and mental focus ... without the sugar crash" (R13, brand site); "noticed a difference in my energy" (R14, widget) | 2 | Bullet "Promotes mental clarity + energy" is above the button. Survey "52% feel more energized" is below. | Visible | MISSING: evidence for the "mental clarity" and "energy" claims. The 2025 study measured only 2 vitamins in the blood. | Next to the bullet, put the survey line labelled as self-reported, or narrow the bullet to the "energy metabolism" wording already in Benefits. Do not leave the bullet unsupported. |
| Will my kids eat it, and is there a kids version? | "this is the only one they love eating. They think it's a treat." (R16, brand site, Kids page); "A bonus is my kids love them too!" (R17, brand site) | 2 | "Find Your Flavor" tiles for Original Kids and the tie-in Kids, far below the button | Hidden | MISSING: what the Kids page "Renews at $74.98" covers (2 kids is inferred, not stated) | Under the "How many Adults?" picker, add a "Shopping for kids? See Sprout Kids" link, quoting R16. |
| Is the subscription a trap, and can I stop it? | "I hate subscriptions because I feel like they are a trap" (R17, brand site); "I have tried multiple times to cancel my subscription." (R20, review site) | 2 | "Pause Or Cancel Any Time" in the plan box and "Cancel anytime" under the button | Visible | None for the promise itself | Keep the promise. Add the steps (next row). |
| How do I actually cancel? | "I have tried multiple times to cancel my subscription." (R20, review site) | 1 | Not found in the captured text. The gallery was not seen. | Unknown | MISSING: the real cancel steps (where in the account, by what date before renewal) | Once the steps are confirmed, add a one-line "How to cancel" under "Pause Or Cancel Any Time" in the plan box. |
| Will the Sugar-Free version upset my stomach? | "The sugar free [Sprout] worked too well." (review site fragment) | 1 | The "Low Sugar vs. Sugar-Free" accordion content was not captured. No mention of sugar alcohols was seen. | Unknown | Supplied fact: Sugar-Free uses sugar alcohols. MISSING: which sugar alcohol, the amount per pack, and approved wording on tolerance | At the "Select Sugar Level" picker, label Sugar-Free with "Sweetened with sugar alcohols". Add tolerance wording only once it is approved. |
| What if I don't like it? | "I thought the first pack I tried tasted terrible" (R18, retailer); "the taste is off." (R19, widget, tie-in Sugar-Free) | 2 | The plan box says "30-Day Money-Back Guarantee". The "first order only" limit appears only in the last FAQ. | Hidden (the key term is hidden, and the visible wording conflicts with the real terms) | None. Supplied fact: 30 days, first order only. | Directly beside Start Now: "30-day money-back guarantee on your first order." Use the same wording in the plan box. |
| How soon will I notice anything? | "I've been taking them for 2 months now and have noticed a difference" (R14, widget) | 1 | FAQ "When will I feel something?" ("within days or weeks ... Consistent daily use is essential"), near the bottom | Hidden | None | Move the existing FAQ answer to a line under the benefit bullets. |

**Top 5 fixes** (the order is a guess: 20 reviews, mostly hand-picked by the brand)
1. Beside Start Now, add "30-day money-back guarantee on your first order" and match the plan-box wording to it.
2. Label Sugar-Free at the sugar-level picker as "Sweetened with sugar alcohols".
3. Add the real cancel steps under "Pause Or Cancel Any Time" once they are confirmed.
4. Give the $49.99 renewal and the SMS condition equal weight beside the $29.99 price, and reconcile $1.07, $1.26 and $1.78 per day.
5. Move the gut and powder-switcher proof (67% survey, R7 framed as one buyer's story, a "Vs Powders" card) up next to the bullets and button.

**Facts to collect before writing**
- MISSING: cancel steps and the deadline before renewal.
- MISSING: which sugar alcohol is in Sugar-Free, the amount per pack, and approved tolerance wording.
- MISSING: per-pack nutrition label amounts, whether any probiotic is included, and the true vitamin count ("21" or "over 20").
- MISSING: the basis for $1.26/serving, the basis for $3.60 for powders, the label of the ~$35 column, and whether $29.99 requires the SMS sign-up.
- MISSING: evidence for "mental clarity", "energy", "immunity + stress relief" and "revive whole body vitality" beyond the 2-vitamin absorption study.
- MISSING: method for the 3,000+ customer survey.
- MISSING: what the Kids "$74.98" renewal covers.
- MISSING: the absent nutrient-intake figure and the real sources behind the "Source" footnotes.
- Phone screenshots of the first screen, the full gallery, the opened "Low Sugar vs. Sugar-Free" panel and the nutrition label. Without these, nothing could be marked "missing", so those rows stay "unknown".

**Coverage score**
- Now: visible rows score 1, hidden rows 0.5. That gives 4 × 1 + 7 × 0.5 = 7.5 points out of 11 doubts counted, so 7.5 / 11 × 100 = **68**.
- With the new answers (only those needing no missing fact): stick-with-it, kids, guarantee and time-to-notice move to visible. Price, supplement replacement and GLP-1 stay hidden. That gives 8 × 1 + 3 × 0.5 = 9.5 points, so 9.5 / 11 × 100 = **86**.
- Left out as unknown: "How do I actually cancel?" and "Will Sugar-Free upset my stomach?"

**What this can't tell you**
- These are 20 reviews, mostly chosen by the brand. They show what these sources talk about, not how many buyers leave or why non-buyers didn't buy. No return reasons or support tickets were supplied.
- The page was read as text. Phone layout, the gallery and some panels were not seen, so "visible" means visible in the reading order, not confirmed on the first phone screen.
- The rating and discount mismatches (four ratings; 52%, 55% and 61% discounts) have no customer quote attached here, so they are not scored. They may still be costing trust.
```
