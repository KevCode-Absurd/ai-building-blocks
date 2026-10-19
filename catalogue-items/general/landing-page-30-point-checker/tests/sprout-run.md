# Test run on Sprout, 2026-10-19

Result: **fail**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 4 of 5 met. Invented facts: 0.

The audit itself is strong: every no is evidenced from the page, nothing is invented, the arithmetic and counts are correct, and the fixes only reuse Sprout's own prices, claims and figures. It fails only because it hands back a checks score and percentages (29, 52), which the judge list forbids even though the SKILL text still asks for one.

## Fix

Delete the 'Score it' step and the CHECKS SCORE block from the output shape (and the 'checks score out of 100' phrase in the description), so 'Count by stop' is the only tally and no percentage can appear.

## Judge list

- Met: Every "no" quotes the page or says where it is.
  e.g. check 22: "The plan box says '30-Day Money-Back Guarantee'. The last FAQ says 'This policy applies only to your initial purchase.'"
- Met: Checks it couldn't see are marked can't tell, never yes.
  Checks 2, 6, 10, 17, 18, 24, 28, 29, 30 all "Can't tell"; every yes (7, 8, 9, 15, 21, 25) cites page text.
- Met: The verdict names one stop, not a list.
  "Stop 1: Arrive. The page loses buyers on arrival. Check 3 shows it"
- Met: No fix adds a rating, count, price, offer or deadline you didn't supply.
  Fixes reuse $29.99, $49.99, $1.78/day, 28 packs, 4.75 from 109,639, 80% daily; 55% is worked out from $29.99 vs $66.65.
- Not met: There's no score or percentage. The counts show where trouble clusters, nothing more.
  "Now: 6 yes ÷ (6 yes + 15 no) = 6 ÷ 21 × 100 = 29" and "With the five fixes: ... 52"

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

**Stop 1: Arrive.** The page loses buyers on arrival.
Check 3 shows it: the ad promises "61% off", and the page greets them with "Save 52%", then "up to 55%", then "55% Off".

*MISSING: phone screenshots.* Checks 4 to 6 and 29 are judged from page text only. *MISSING: ad image.* *MISSING: speed report.* *MISSING: checkout screenshot.*

---

## 2. The checks

### Stop 1: Arrive

| # | Check | Result | Tag | Evidence | Fix |
|---|---|---|---|---|---|
| 1 | Headline carries the ad's main words | No | Drag | The ad is about price ("'Sprout is too expensive': here's 61% off"). The title is "Sprout Superfood Gummies" and the under-title is "60+ potent ingredients to revive whole body vitality". The price objection never comes up. | Add a first-screen line that answers the ad's price point with real page figures, e.g. "$29.99 first box, then $1.78/day." |
| 2 | First picture matches the ad's product | Can't tell | n/a | Ad image not supplied. The gallery is inferred, not seen. | Send the ad image and a phone screenshot of the gallery. |
| 3 | Ad's offer appears at the same amount and name | No | **Deal-breaker** | Ad: "61% off". Bar: "Save 52% + free shipping". Badge: "GET UP TO 55% OFF". Pop-up: "Sign Up for 55% Off". | Run the ad and page on one discount. $29.99 vs $66.65 is 55%, so use 55% in the ad, or show the 61% offer on this page if it is real. |
| 4 | Stranger can say what it is and who it's for in 5 seconds | No | Drag | Judged from text only. "Superfood Gummies" and "revive whole body vitality" don't say it's a daily greens and vitamin pack. Nothing on the first screen says it's for adults. | Under the title, add: "Daily greens + 21 vitamins & minerals in one grab-and-go pack. For adults." |
| 5 | One main button near the first screen, with a label that says what you get | No | Drag | Judged from text only. "Start Now" sits below the bullets, flavour, sugar level, number of adults and plan box. The page notes say the button is likely below the first screen. "Start Now" doesn't say what you get. | Rename it "Get my 28 packs" and cut the stack above it so the button is one short scroll from the gallery. |
| 6 | Nothing covers the page on arrival | Can't tell | n/a | A "Sign Up for 55% Off" pop-up exists, but its timing isn't known. | Send a phone screen recording or screenshot of the first 5 seconds. |

### Stop 2: Understand

| # | Check | Result | Tag | Evidence | Fix |
|---|---|---|---|---|---|
| 7 | Says what you get | Yes | n/a | "28 packs each 4 weeks"; "Each large pouch contains 28 individual packs." | n/a |
| 8 | Shows or says how you use it | Yes | n/a | Directions: "Grab a single pack daily and enjoy the small handful of green gummy bears inside." (It sits in a closed accordion.) | n/a |
| 9 | Answers the fit question (taste, servings, how long it lasts) | Yes | n/a | Taste: "Where fresh strawberries meets clean greens." One pack a day, 28 packs every 4 weeks. | n/a |
| 10 | Real photos: several sides, in use, with scale | Can't tell | n/a | The gallery is inferred: "pack shots on a soft gradient, gummies in a hand". | Send the gallery images. |
| 11 | Headings and bold alone give the main reason to buy | No | Drag | Headings are "Modern Living Leaves Our Bodies Deficient", "Snackable, Packable, Tested", "Quality You Can Trust", "Us vs. Them" and the birthday price cut. The easy-habit reason ("No more gagging on pills, sloshing chalky powders") is hidden in a closed accordion. | Make one heading carry the reason, backed by the survey: "The supplement people actually stick with: 80% of surveyed users take it daily." |
| 12 | One main reason leads | No | Drag | Under-title "vitality", then bullets on mental clarity, immunity, digestion and absorption, then deficiency stats, testing, price and a birthday sale. All compete. | Lead with one reason (easy daily habit vs powders and pills) and put the other benefits under it as support. |

### Stop 3: Believe

| # | Check | Result | Tag | Evidence | Fix |
|---|---|---|---|---|---|
| 13 | Reviews reachable from near the button | No | Drag | "Real Customer Reviews" is at the very bottom. The plan box has no review near it. | Link the rating under the title to the reviews. Place 2 or 3 real reviews (powder quitter, gut story) beside the plan box. |
| 14 | Rating shows count and source, same everywhere | No | Drag | Header: "4.8/5.0 (100,000)". Bottom widget: "4.75 stars, 109,639 reviews". The brand file also has 4.74 from 118,002 on the reviews page. | Use the widget figure in the header (4.75 from 109,639) and name its source. |
| 15 | More than hand-picked praise | Yes | n/a | The widget lists "Latest reviews, newest first", including a critical one ("the taste is off."). A star breakdown wasn't captured. | n/a |
| 16 | Each big claim has proof beside it, nothing past what can be backed | No | **Deal-breaker** | See the list below the table. | Cut to the backed claims: "Supports digestion and gut health"; "Clinically tested for nutrient absorption: vitamin C +40.1%, folate +20.5% in a 12-week placebo-controlled study"; "60+ ingredients, 21 vitamins & minerals, 6 g fiber". Source or remove every stat. |
| 17 | Quotes read as real and sourced; paid reviewers disclosed | Can't tell | n/a | The athlete is disclosed as "a paid spokesperson", which passes. Whether the themed review cards show names or a verified-buyer source wasn't captured. | Send a screenshot of the review cards. |
| 18 | Clear who sells, with a way to contact them | Can't tell | n/a | The brand name is clear. No contact route was captured from the page or footer. | Send the footer and any contact link. |

Evidence for check 16:
- The study measured only 2 vitamins in the blood, yet the page claims "revive whole body vitality", "Promotes mental clarity + energy" and "Supports immunity + stress relief" above the fold.
- One stat is missing its number: "[number missing] of U.S. adults…".
- The digestive-issues stat "61% of Americans…" links only to "Source".
- "Us vs. Them" shows "$1.26" a serving, which matches none of the prices on the page ($1.07, $1.78 or $2.38/day).
- The page says "21 vitamins" in one place and "over 20" in another.
- "Less than 1% … use our Money-Back Guarantee" and "first smart gummy" have no support.

### Stop 4: Commit

| # | Check | Result | Tag | Evidence | Fix |
|---|---|---|---|---|---|
| 19 | Full price clear: first price, later price and how often, together | No | **Deal-breaker** | The tile shows "~~$66.65~~ $29.99. $1.07/day." The renewal "$49.99 each 4 weeks" is in small text under the button. The $29.99 needs the text sign-up, which only the footer says, while the box says "DISCOUNT AUTO-APPLIED". | In the tile: "$29.99 first box with text sign-up discount, then $49.99 every 4 weeks ($1.78/day)." Remove or correct "DISCOUNT AUTO-APPLIED". |
| 20 | Shipping cost or free-shipping threshold stated | No | Drag | Subscription: "Free Shipping Today", which implies first order only. One-time: "No Free Shipping", with no cost given. | State the one-time shipping cost and whether renewals ship free. *MISSING: shipping terms.* |
| 21 | Delivery as a date or range | Yes | n/a | FAQ: "typically ship within 24 hours and on average arrive 3-5 days later." | n/a |
| 22 | Guarantee near the button, with its conditions | No | **Deal-breaker** | The plan box says "30-Day Money-Back Guarantee". The last FAQ says "This policy applies only to your initial purchase." | In the plan box: "30-day money-back guarantee on your first order." |
| 23 | How to pause or cancel said before buying | No | Drag | "Pause Or Cancel Any Time" and "Cancel anytime" say you can, not how. Cancelling is the loudest public complaint. | Add one line naming where to pause or cancel, using the site's real steps only. |
| 24 | No forced account; common payments offered | Can't tell | n/a | No checkout screenshot. | Send a checkout screenshot showing guest checkout and express payment options. |

### Stop 5: Fine print

| # | Check | Result | Tag | Evidence | Fix |
|---|---|---|---|---|---|
| 25 | Crossed-out price is real | Yes | n/a | ~~$66.65~~ is the live one-time price offered on the same page. | n/a |
| 26 | Deadlines and urgency are true | No | Drag | The bar says "✨ Limited Time Sale ✨ Save 52%", but the birthday section says "Not just for a week but indefinitely." | Drop "Limited Time Sale", or drop "indefinitely", whichever is untrue. |
| 27 | Discount numbers agree everywhere | No | **Deal-breaker** | Ad 61%; bar 52%; badge "up to 55%"; pop-up 55%. The brand file also has 49% and 58% on other pages. | Use one number in the ad, bar, badge and pop-up: 55% matches $29.99 vs $66.65. |
| 28 | Nothing pre-ticked for the buyer | Can't tell | n/a | No add-on appears in the captured text, but the buy area wasn't seen. Subscribe as the default plan is inferred and isn't an extra item. | Send buy-area screenshots with each option picked. |
| 29 | Phone text about 16 px, tap targets at least 24 px | Can't tell | n/a | No phone screenshots. | Send phone screenshots of the first screen and buy area. |
| 30 | Phone speed: LCP ≤ 2.5 s, INP ≤ 200 ms, CLS < 0.1 | Can't tell | n/a | Not measured. | Run PageSpeed Insights on mobile. |

---

## 3. Count by stop

| Stop | No's | Deal-breakers among them |
|---|---|---|
| 1 Arrive | 4 | 1 (check 3) |
| 2 Understand | 2 | 0 |
| 3 Believe | 3 | 1 (check 16) |
| 4 Commit | 4 | 2 (checks 19, 22) |
| 5 Fine print | 2 | 1 (check 27) |

The trouble clusters at Arrive and Commit. This shows where buyers drop out, not how many sales are lost.

---

## 4. First five fixes

1. **Check 3 (deal-breaker, first screen).** Make the ad and the landing page show the same discount. 55% is what $29.99 vs $66.65 actually is.
2. **Check 27 (deal-breaker, bar, badge and pop-up).** Use that one number in the bar, the badge and the pop-up too. Doing this together with fix 1 clears both.
3. **Check 16 (deal-breaker, under-title and bullets).**
   - Replace "revive whole body vitality", "mental clarity + energy" and "immunity + stress relief" with backed claims: gut-health support, absorption with the vitamin C +40.1% and folate +20.5% figures, and "60+ ingredients, 21 vitamins & minerals, 6 g fiber".
   - Fill in or cut the missing stat, add a real source to the 61% digestive stat, and fix or remove the $1.26 comparison.
4. **Check 19 (deal-breaker, plan box).** Put "$29.99 first box with text sign-up discount, then $49.99 every 4 weeks ($1.78/day)" in the tile itself. Remove or correct "DISCOUNT AUTO-APPLIED".
5. **Check 22 (deal-breaker, plan box).** Change the plan-box line to "30-day money-back guarantee on your first order."

---

## 5. Checks score

- **Now:** 6 yes ÷ (6 yes + 15 no) = 6 ÷ 21 × 100 = **29**. Deal-breakers left: 3, 16, 19, 22 and 27.
- **With the five fixes:** 11 yes ÷ (11 yes + 10 no) = 11 ÷ 21 × 100 = **52**. Deal-breakers left: none.
- Left out: 9 can't tell (checks 2, 6, 10, 17, 18, 24, 28, 29, 30) and 0 doesn't apply.

The score measures the share of checks passed. It doesn't predict sales.

---

## 6. Can't tell

- **Check 2:** *MISSING: ad image.* Send the ad image and the gallery's first photo on a phone.
- **Check 6:** *MISSING: phone screenshots.* Send a screen recording of the first 5 seconds on a phone to show when the "55% Off" pop-up fires and what it covers.
- **Check 10:** Send the gallery images to check angles, in-use shots and scale.
- **Check 17:** Send a screenshot of the themed review cards to see whether they show names or a verified-buyer source.
- **Check 18:** Send the footer and contact page to see if a contact route exists.
- **Check 24:** *MISSING: checkout screenshot.* Needed to check guest checkout and express payment options.
- **Check 28:** Send buy-area screenshots with each option picked, to look for pre-ticked add-ons.
- **Check 29:** Send phone screenshots to measure text size and tap targets.
- **Check 30:** *MISSING: speed report.* Run PageSpeed Insights on mobile.

Numbers on the page that need a source before reuse:
- "1M+ Customers" and "1,000,000+ Others"
- "Less than 1% of customers use our Money-Back Guarantee"
- "61% of Americans experience weekly digestive issues"
- The missing "don't meet daily nutrient intake" figure
- "$1.26" vs "$3.60" a serving
- "4.8/5.0 (100,000)"

*MISSING: shipping cost for one-time orders and for renewals* (needed for check 20).
```
