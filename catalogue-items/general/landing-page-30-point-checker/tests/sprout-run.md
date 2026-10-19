# Test run on Sprout, 2026-10-19

Result: **pass**. Ran on claude-opus-5-5 (effort medium), graded by claude-fable-5-1. Judge list: 5 of 5 met. Invented facts: 0.

A careful, accurate audit: every no is quoted from the page, every unseen item is can't tell, and all suggested figures come from Sprout's own files or simple arithmetic. The owner gets a correctly ranked list of the five real problems (ad-to-page discount mismatch, over-reaching claims, hidden renewal and SMS condition, guarantee limit) with ready-to-paste fixes.

## Judge list

- Met: Every "no" quotes the page or says where it is.
  Each no quotes, e.g. check 22: "The plan box says '30-Day Money-Back Guarantee'. The limit appears only in the last FAQ".
- Met: Checks it couldn't see are marked can't tell, never yes.
  Checks 2, 6, 10, 17, 18, 24, 28, 29, 30 all "Can't tell"; yes's (7, 8, 9, 15, 21, 25) cite page text.
- Met: The verdict names one stop, not a list.
  "The page first loses buyers at Stop 1: Arrive. Check 3 shows it"
- Met: No fix adds a rating, count, price, offer or deadline you didn't supply.
  Fixes use $29.99, $49.99, $1.78/day, 4.75/109,639, study numbers; 55% is worked out from $66.65 to $29.99; shipping and cancel marked MISSING.
- Met: There's no score or percentage. The counts show where trouble clusters, nothing more.
  "The trouble clusters at Arrive and Commit"; counts per stop only, no grade or percentage.

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

**The page first loses buyers at Stop 1: Arrive.**
Check 3 shows it: the ad promises "61% off", and the page never shows 61%. The top bar says 52%, the badge says "up to 55%" and the pop-up says 55%.

## 2. The checks

No phone screenshots were supplied, so checks 4 to 6 and 29 are judged from the page text only.

**Stop 1: Arrive (the first phone screen)**

| # | Check | Result | Tag | Evidence | Fix |
|---|---|---|---|---|---|
| 1 | Headline carries the ad's main words | No | Drag | The ad is about price ("too expensive", "61% off"). The title is "Sprout Superfood Gummies" and the line under it is "60+ potent ingredients to revive whole body vitality". Neither mentions price. | Put the price answer by the title, using the supplied figures: "$29.99 first box, then $49.99 every 4 weeks." |
| 2 | First picture matches the ad's product | Can't tell | n/a | MISSING: the ad's picture. The gallery is only inferred ("pack shots on a soft gradient"). | n/a |
| 3 | Ad's offer appears here at the same amount and name | No | **Deal-breaker** | Ad: "61% off". Bar: "Save 52%". Badge: "GET UP TO 55% OFF". Pop-up: "Sign Up for 55% Off". 61% appears nowhere. | Match the ad to what the page delivers. $66.65 down to $29.99 is 55% off. Don't run "61%" unless the page shows that exact deal. |
| 4 | Stranger can say what it is and who it's for in 5 seconds | No (text only) | Drag | "Superfood Gummies" does not say these are daily greens and vitamin gummies. "Adults" first appears at "How many Adults?" below the bullets. | Make the under-title plain, for example: "Daily greens + 21 vitamins & minerals in one pack of gummies, for adults." |
| 5 | One main button on or near the first screen, label says what you get | No | Drag | The button reads "Start Now". It sits below the bullets, flavour, sugar level, number of adults and the plan box, so it is likely several scrolls down (inferred). | Relabel to say what you get, for example "Start my subscription: 28 packs every 4 weeks". Keep the plan box close under the gallery. |
| 6 | Nothing covers the page on arrival | Can't tell | n/a | A "Sign Up for 55% Off" pop-up exists, but when it fires was not captured. | n/a |

**Stop 2: Understand (what exactly is this?)**

| # | Check | Result | Tag | Evidence | Fix |
|---|---|---|---|---|---|
| 7 | Says what you get | Yes | n/a | "28 packs each 4 weeks". Directions: "Each large pouch contains 28 individual packs … the small handful of green gummy bears inside." | n/a |
| 8 | Shows how you use it | Yes | n/a | Directions: "Grab a single pack daily and enjoy…" This is in a closed accordion. | n/a |
| 9 | Answers the fit question (taste, servings, how long it lasts) | Yes | n/a | Taste: "Where fresh strawberries meets clean greens." One pack a day, 28 packs every 4 weeks. See Can't tell for the Low Sugar vs Sugar-Free panel. | n/a |
| 10 | Photos show the real product, several sides, in use, with scale | Can't tell | n/a | The gallery is inferred, not seen. | n/a |
| 11 | Headings and bold alone give the main reason to buy | No | Drag | Headings are "Modern Living Leaves Our Bodies Deficient", "Snackable, Packable, Tested", "Quality You Can Trust" and so on. The core idea, a supplement you'll actually keep taking, sits only inside the closed "Why Sprout?" accordion. | Make it a heading, using the brand's own line: "Tastes like a treat, works like a supplement." |
| 12 | One main reason leads | No | Drag | Four bullets compete: "mental clarity + energy", "immunity + stress relief", "digestion and gut health", "nutrient absorption". The ad leads on price, which is a fifth reason. | Lead with one reason. Back it with "Supports digestion and gut health" and the study line. |

**Stop 3: Believe (why should I trust this?)**

| # | Check | Result | Tag | Evidence | Fix |
|---|---|---|---|---|---|
| 13 | Reviews reachable from near the button | No | Drag | "Real Customer Reviews" sits "at the very bottom". It was not captured whether the header rating links to it. | Link the header rating to the reviews. Move the review cards (Vs Powders, Taste) to just under the plan box. |
| 14 | Rating shows count and source, same figure everywhere | No | Drag | The header says "4.8/5.0 (100,000)". The widget says "4.75 stars, 109,639 reviews". Neither names its source. | Show one figure with its source everywhere, for example "4.75 from 109,639 reviews on sprout.example". |
| 15 | More than hand-picked praise | Yes | n/a | The widget shows "Latest reviews, newest first", including one that says "the taste is off." A star breakdown was not captured. | n/a |
| 16 | Each big claim has proof beside it, nothing past what's backed | No | **Deal-breaker** | See the claim list below this table. | See the claim list below this table. |
| 17 | Quotes are real with a source, paid reviewers disclosed | Can't tell | n/a | The athlete is disclosed as a paid spokesperson, in small print. Whether the review cards carry names or sources was not captured. | n/a |
| 18 | Clear who is selling, with a contact | Can't tell | n/a | The captured footer has only the FDA line and the SMS note. No company name or contact was seen. | n/a |

**Check 16 evidence.** These claims go past what the business can back:
- "revive whole body vitality", "Promotes mental clarity + energy" and "Supports immunity + stress relief" all sit above the fold. The study measured only blood vitamin C and folate.
- "[number missing] of U.S. adults…" shows no number.
- "61% of Americans experience weekly digestive issues" has a footnote that only says "Source".
- "$1.26" per serving vs "$3.60" is a dated comparison. It also clashes with the page's own $1.07/day and $1.78/day.
- "Less than 1% of customers use our Money-Back Guarantee" is brand-reported and unverified.
- "21 vitamins" appears in one place and "over 20" in the ingredients panel.

**Check 16 fix.**
- Cut the vitality, clarity, immunity and stress lines.
- Put the study numbers right beside "Clinically tested for nutrient absorption": 12-week placebo-controlled study, vitamin C +40.1%, folate +20.5%.
- Use "60+ ingredients, 21 vitamins & minerals, 6g fiber" everywhere.
- Fill in or cut the missing-number stat.
- Name the sources behind "61% of Americans" and "1M+ Customers", and recheck or drop $1.26 vs $3.60.

**Stop 4: Commit (what will it cost me, and what if it goes wrong?)**

| # | Check | Result | Tag | Evidence | Fix |
|---|---|---|---|---|---|
| 19 | Full price clear; first price, renewal and frequency together | No | **Deal-breaker** | The plan box shows "~~$66.65~~ $29.99. $1.07/day". The renewal ("Renews at $49.99 each 4 weeks") is under the button. The $29.99 needs the SMS discount, which only the footer says, while the button area says "DISCOUNT AUTO-APPLIED". | Put it all in the plan box: "$29.99 first box with text sign-up discount, then $49.99 ($1.78/day) every 4 weeks." Drop "AUTO-APPLIED" unless it's true without the SMS. |
| 20 | Shipping cost or free threshold stated | No | Drag | Subscribe says "Free Shipping Today". One-time says "No Free Shipping" with no cost given. It's unclear whether renewals ship free. | State the one-time shipping cost (MISSING: figure) and whether renewals ship free. |
| 21 | Delivery as a range of days | Yes | n/a | FAQ: "typically ship within 24 hours and on average arrive 3-5 days later." It is far from the button. | n/a |
| 22 | Guarantee terms near the button, with conditions | No | **Deal-breaker** | The plan box says "30-Day Money-Back Guarantee". The limit appears only in the last FAQ: "This policy applies only to your initial purchase." | In the plan box, say "30-day money-back guarantee on your first order". |
| 23 | How to pause or cancel said before buying | No | Drag | The page says only "Pause Or Cancel Any Time" and "Cancel anytime". It never says how. Cancelling is the loudest public complaint. | Add one line with the real steps (MISSING: cancel method). Promise nothing beyond the site's own terms. |
| 24 | No forced account, common payments offered | Can't tell | n/a | Checkout was not supplied. Only "HSA/FSA eligible with [a third-party service]" was seen. | n/a |

**Stop 5: Fine print (anything that feels off?)**

| # | Check | Result | Tag | Evidence | Fix |
|---|---|---|---|---|---|
| 25 | Crossed-out price is a real price | Yes | n/a | ~~$66.65~~ matches the live one-time option on the same page ("One Time Purchase … $66.65"). | n/a |
| 26 | Deadlines and urgency are true | No | Drag | The bar says "Limited Time Sale ✨ Save 52%". The birthday section says the price cut is "Not just for a week but indefinitely." | Drop "Limited Time" from the price line. Keep "before it's gone" only for the rotating limited flavour, which really does rotate. |
| 27 | Discount numbers agree everywhere | No | **Deal-breaker** | Ad "61%", bar "52%", badge "UP TO 55%", pop-up "55%". | Use one number everywhere, matching the real price: 55% ($66.65 down to $29.99). |
| 28 | Nothing pre-ticked for the buyer | Can't tell | n/a | No add-ons were seen. The option defaults were not captured; only Subscribe was inferred as selected. | n/a |
| 29 | Phone text and tap sizes | Can't tell | n/a | MISSING: phone screenshots. | n/a |
| 30 | Phone speed | Can't tell | n/a | MISSING: speed report. | n/a |

## 3. Count by stop

| Stop | No's |
|---|---|
| Stop 1: Arrive | 4 |
| Stop 2: Understand | 2 |
| Stop 3: Believe | 3 |
| Stop 4: Commit | 4 |
| Stop 5: Fine print | 2 |

The trouble clusters at Arrive and Commit. All five deal-breakers are about price, offer, guarantee or claims.

## 4. First five fixes

1. **Check 3:** make the ad's offer match the page. The page delivers 55% ($66.65 down to $29.99), so stop sending "61% off" traffic to it.
2. **Check 27:** show one discount number everywhere: top bar, badge and pop-up. Replace "52%", "up to 55%" and "55%" with the single real figure.
3. **Check 16:** cut "revive whole body vitality", "mental clarity + energy" and "immunity + stress relief". Put the study numbers (vitamin C +40.1%, folate +20.5%) right beside "Clinically tested", and fix or source the page's stats.
4. **Check 19:** in the plan box, say "$29.99 first box with text sign-up discount, then $49.99 every 4 weeks." Remove "DISCOUNT AUTO-APPLIED" unless it's true.
5. **Check 22:** change the plan box line to "30-day money-back guarantee on your first order."

## 5. Can't tell

- **Check 2:** need the ad's image to compare against the gallery.
- **Checks 4, 5, 6 and 29:** need phone screenshots of the first screen and the buy area.
  - Checks 4 and 5 were judged from the text only.
  - Check 6 needs to show when the "Sign Up for 55% Off" pop-up fires.
- **Check 10:** need the actual gallery images. They were inferred, not seen.
- **Check 17:** need to see whether the review cards carry names or sources.
- **Check 18:** need the full footer or a contact page showing the company name and a contact.
- **Check 24:** need a checkout screenshot to see guest checkout and express payment options.
- **Check 28:** need the buy area with each option picked, to see the defaults and any add-ons.
- **Check 30:** need a PageSpeed Insights report for the page on a phone.
- **Low Sugar vs Sugar-Free panel:** its content was not captured, so check 9 can't be confirmed for the sugar choice.
  - Nothing about sugar alcohols was seen, and they upset some stomachs.
  - Capture that panel to check whether gut-sensitive buyers are pointed to Low Sugar.
- **Shipping figure (check 20):** need the one-time shipping cost before that fix can be written.
- **Cancel steps (check 23):** need the real pause and cancel steps before that fix can be written.
```
