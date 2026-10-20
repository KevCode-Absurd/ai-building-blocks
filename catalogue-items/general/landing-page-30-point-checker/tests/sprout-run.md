# Test run on Sprout, 2026-10-20

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A thorough, accurate audit that catches the real discount mess, the hidden renewal price, the first-order-only guarantee and the overreaching health claims, with every fix built from Sprout's own approved numbers. The owner gets a correct score with its sum, a clear ranked fix list, and honest can't-tell notes instead of guessed screenshot judgements.

## Judge list

- Met: Every "no" quotes the page or says where it is.
  e.g. check 22: "The limit, 'This policy applies only to your initial purchase.', is in the last FAQ." All 15 no's cite page text or location.
- Met: Checks it couldn't see are marked can't tell, never yes.
  Checks 2, 6, 10, 17, 18, 24, 28, 29, 30 are can't tell; the six yes's (7, 8, 9, 15, 21, 25) quote visible page text.
- Met: The verdict names one stop, not a list.
  "Stop 1: Arrive. ... Check 3 shows it: the ad promises '61% off', but the page's top bar says 'Save 52%'"
- Met: No fix adds a rating, count, price, offer or deadline you didn't supply.
  Fixes reuse $29.99, $49.99, $1.78/day, 4.75/109,639, +40.1%/+20.5%, 120 adults; 55% is worked out from $66.65 to $29.99.
- Met: The checks score shows its sum, says how many left out, never sold as a sales forecast.
  "6 yes ÷ (6 yes + 15 no) × 100 = 28.6, so 29. 9 checks are can't tell" ... "It doesn't predict sales." Counts verified.

## What went in

```text
The page: Sprout's main product page, as text top to bottom
(sprout/product-page.md). No screenshots, no speed report.

The ad: "'Sprout is too expensive': here's 61% off to prove otherwise"

Facts: sprout/brand.md, with the real prices, the guarantee terms
and the table of risky or unsupported claims.

[attached: sprout/brand.md, sprout/product-page.md]
```

## What came out

```text
## 1. Verdict
**Stop 1: Arrive.** Buyers who come from the ad start dropping off on the first screen.
Check 3 shows it: the ad promises "61% off", but the page's top bar says "Save 52%" and its badge says "UP TO 55% OFF".

## 2. The checks

MISSING: phone screenshots, the ad's image and a speed report. Checks 4 to 6 and 29 are judged from the page text only. Checks 2 and 30 are can't tell.

**Stop 1: Arrive**

| # | Check | Result | Tag | Evidence | Fix |
|---|---|---|---|---|---|
| 1 | Headline carries the ad's words | No | Drag | The ad is about price ("too expensive"). The page leads with "Sprout Superfood Gummies" and "60+ potent ingredients to revive whole body vitality". Price is not mentioned until the plan box. | Under the title, answer the ad with real numbers: "$29.99 first box with text sign-up, then $49.99 every 4 weeks ($1.78/day)." |
| 2 | First picture matches the ad's product | Can't tell | | The ad image was not supplied. The gallery is only inferred from photo files. | |
| 3 | Ad's offer appears at same amount and name | No | **Deal-breaker** | Ad: "61% off". Bar: "Save 52%". Badge: "UP TO 55% OFF". Pop-up: "55% Off". The page's own prices ($66.65 to $29.99) work out to 55%. | Make the ad and first screen carry the same figure. Use the 55% the plan box supports, or show what "61%" is made of. MISSING: what the 61% includes. |
| 4 | Stranger can say what it is and who for in 5 seconds | No | Drag | "Superfood Gummies" and "revive whole body vitality" don't say greens, vitamins, daily packs or adults. "Adults" first appears at the "How many Adults?" picker. | Subhead: "Daily greens gummies for adults: 60+ ingredients, 21 vitamins & minerals and 6g fiber in one pack." |
| 5 | One main button near the top, label says what you get | No | Drag | The label is "Start Now". On a phone (inferred), the button sits below the bullets, flavour, sugar-level, adults and plan pickers. | Change the label to "Start my 28-pack subscription" and keep the plan box straight under the pickers. |
| 6 | Nothing covers the page on arrival | Can't tell | | A "Sign Up for 55% Off" phone-number pop-up exists. When it opens is not captured. | |

**Stop 2: Understand**

| # | Check | Result | Tag | Evidence | Fix |
|---|---|---|---|---|---|
| 7 | Says what you get | Yes | | "28 packs each 4 weeks". Directions: "Each large pouch contains 28 individual packs." | |
| 8 | Shows how you use it | Yes | | Directions: "Grab a single pack daily and enjoy the small handful of green gummy bears inside." This sits in an accordion that is closed by default. | |
| 9 | Answers the fit question (taste, servings, how long) | Yes | | Taste: "Where fresh strawberries meets clean greens." One pack a day, 28 per pouch, delivered every 4 weeks. | |
| 10 | Photos from several sides, in use, with size | Can't tell | | The gallery was not seen. | |
| 11 | Headings and bold alone give the main reason | No | Drag | The headings are "Modern Living Leaves Our Bodies Deficient", "Snackable, Packable, Tested", "Quality You Can Trust" and "Us vs. Them". The ease reason ("No more gagging on pills, sloshing chalky powders…") is hidden in the closed "Why Sprout?" accordion. | Move the brand's own line "No more gagging on pills, sloshing chalky powders, or cleaning messy counters." into a visible heading near the top. |
| 12 | One main reason leads | No | Drag | Four reasons compete in the bullets: mental clarity, immunity and stress, digestion, absorption. The subhead (vitality), the deficiency section and the price cut all compete too. | Lead with ease and sticking with it. Back it with "95% of surveyed users take it at least 4-6x per week". Make digestion and absorption the supporting points. |

**Stop 3: Believe**

| # | Check | Result | Tag | Evidence | Fix |
|---|---|---|---|---|---|
| 13 | Reviews reachable from near the button | No | Drag | "Real Customer Reviews" sits "at the very bottom". There is no sign that the header rating links to them. | Link the header rating to the reviews. Place 2 or 3 review cards (Vs Powders, gut) right under the plan box. |
| 14 | Rating shows count and source, same everywhere | No | Drag | Header: "4.8/5.0 (100,000)". Widget: "4.75 stars, 109,639 reviews". Neither names a source. | Use the widget figure in the header: "4.75 from 109,639 reviews on sprout.example". |
| 15 | More than hand-picked praise visible | Yes | | The bottom widget lists the latest reviews newest first, including "the taste is off." A star breakdown was not captured. | |
| 16 | Big claims have proof beside them and stay within what's backed | No | **Deal-breaker** | "revive whole body vitality", "Promotes mental clarity + energy" and "Supports immunity + stress relief" sit above the fold. The study only measured vitamin C and folate in blood. The study numbers are in a closed accordion. The deficiency stat is missing its number, and footnotes only say "Source". "Over 20" vitamins contradicts "21". "Sprout $1.26" a serving doesn't match the page's own $1.07 or $1.78/day. | Cut the three unsupported bullets. Keep "Supports digestion and gut health". Put this beside the absorption bullet: "vitamin C +40.1%, folate +20.5% in a 12-week placebo-controlled study of 120 adults". Fill or drop the missing stat, name the sources, use "21" everywhere, and recheck the $1.26. |
| 17 | Quotes have a source; paid reviewers disclosed | Can't tell | | The athlete is disclosed as a paid spokesperson (passes). The names and sources on the themed review cards were not captured. | |
| 18 | Clear who sells and how to contact | Can't tell | | Only the FDA line and the SMS note from the footer were captured. No contact details were seen. | |

**Stop 4: Commit**

| # | Check | Result | Tag | Evidence | Fix |
|---|---|---|---|---|---|
| 19 | Subscription first price, later price and frequency shown together | No | **Deal-breaker** | The tile shows "~~$66.65~~ $29.99. $1.07/day". "Renews at $49.99 each 4 weeks" appears only under the button. The SMS condition for $29.99 is only in the footer, while "DISCOUNT AUTO-APPLIED" suggests no condition. | Inside the Subscribe tile: "$29.99 first box with text sign-up discount, then $49.99 every 4 weeks ($1.78/day)." |
| 20 | Shipping cost stated | No | Drag | The one-time tile says "No Free Shipping" but gives no cost. | State the one-time shipping cost next to the buy area. MISSING: one-time shipping cost. |
| 21 | Delivery as a range of days | Yes | | FAQ: "typically ship within 24 hours and on average arrive 3-5 days later." | |
| 22 | Guarantee terms near the button, with conditions | No | **Deal-breaker** | The plan box says "30-Day Money-Back Guarantee". The limit, "This policy applies only to your initial purchase.", is in the last FAQ. The top bar also says "30-DAY GUARANTEE" with no condition. | Use "30-day money-back guarantee, first order only" in the plan box and the bar. |
| 23 | How to pause or cancel said before buying | No | Drag | "Pause Or Cancel Any Time" and "Cancel anytime" say that you can, not how. Cancelling is the loudest public complaint. | Add one line on where and how to cancel, using the site's actual steps. MISSING: the cancel steps. |
| 24 | No hint of forced account or limited payment | Can't tell | | Checkout was not seen. | |

**Stop 5: Fine print**

| # | Check | Result | Tag | Evidence | Fix |
|---|---|---|---|---|---|
| 25 | Crossed-out price is real | Yes | | ~~$66.65~~ is the live one-time price shown on the same page. | |
| 26 | Deadlines and urgency are true | No | Drag | The bar says "✨ Limited Time Sale ✨ Save 52%". The page's own birthday section says the lower price is "Not just for a week but indefinitely." | Drop "Limited Time Sale" from the bar. |
| 27 | Discount numbers agree everywhere | No | **Deal-breaker** | Ad 61%, bar 52%, badge "up to 55%", pop-up 55%. Other pages show 49% and 58%. | Pick one figure (55% matches $66.65 to $29.99) and use it in the bar, badge, pop-up and ads. |
| 28 | Nothing extra pre-ticked | Can't tell | | No add-on, warranty or donation appears in the text. Subscribe & Save appears to be selected by default (inferred), but that is a plan choice, not an extra item. | |
| 29 | Phone text about 16 px, buttons easy to tap | Can't tell | | No screenshots. | |
| 30 | Phone speed within limits | Can't tell | | Not measured. | |

## 3. Count by stop

| Stop | No's | Of which deal-breakers |
|---|---|---|
| 1 Arrive | 4 | 1 |
| 2 Understand | 2 | 0 |
| 3 Believe | 3 | 1 |
| 4 Commit | 4 | 2 |
| 5 Fine print | 2 | 1 |

These counts show where the trouble clusters. They don't predict sales.

## 4. First five fixes
1. **Check 3 (deal-breaker):** make the ad and the first screen show the same discount. Use the 55% the prices support, or say what the 61% includes.
2. **Check 27 (deal-breaker):** use one discount figure in the bar, the badge and the pop-up.
3. **Check 16 (deal-breaker):** cut "revive whole body vitality", "Promotes mental clarity + energy" and "Supports immunity + stress relief". Put the vitamin C +40.1% and folate +20.5% study numbers beside "Clinically tested for nutrient absorption".
4. **Check 19 (deal-breaker):** in the Subscribe tile, show "$29.99 first box with text sign-up discount, then $49.99 every 4 weeks ($1.78/day)".
5. **Check 22 (deal-breaker):** change the guarantee to "30-day money-back guarantee, first order only" in the plan box and the top bar.

## 5. Checks score
- **Now:** 6 yes ÷ (6 yes + 15 no) × 100 = 28.6, so **29**. 9 checks are can't tell and 0 don't apply. Five deal-breakers are open: checks 3, 16, 19, 22 and 27.
- **With the five fixes made:** 11 yes ÷ (11 yes + 10 no) × 100 = 52.4, so **52**. No deal-breakers left. The remaining no's are all drags: checks 1, 4, 5, 11, 12, 13, 14, 20, 23 and 26.

The score measures the share of checks passed. It doesn't predict sales.

## 6. Can't tell
- **Check 2:** need the ad's image and the page gallery to compare the product, pack and flavour.
- **Check 6:** need a phone recording or screenshot on load to see whether the "Sign Up for 55% Off" pop-up covers the page on arrival.
- **Check 10:** need the gallery images to see the sides shown, the product in use and the size reference.
- **Check 17:** need the themed review cards with their names and sources.
- **Check 18:** need the full footer or contact page to see the business name and contact details.
- **Check 24:** need a checkout screenshot to see guest checkout and express payment options.
- **Check 28:** need a buy-box screenshot to confirm nothing is ticked by default.
- **Check 29:** need phone screenshots of the first screen and the buy area.
- **Check 30:** need a PageSpeed Insights phone report for the page's address.
- **Also not captured:** the Low Sugar vs. Sugar-Free panel. Without it, nobody can tell whether gut-sensitive buyers are warned that sugar alcohols can upset some stomachs.
```
