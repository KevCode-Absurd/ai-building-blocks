---
name: tiktok-ads-creative-testing
description: "A weekly TikTok ads creative test sized to the store's own budget: how many new concepts and hooks the week can pay to read, how to set up the test and scaling campaigns, what to read on day 1, day 3 and day 7 (hook hold, watch time, click rate, then store purchases), a diagnosis table for why an ad failed, and a written winner rule based on purchases at the store's allowed cost. Includes the monthly volume of new ads needed to replace tired winners and a tag sheet so results can be traced to angle, hook and format. Use every week once TikTok ads are live, or when TikTok results depend on one or two old ads."
---

# TikTok ads creative test plan

**You get:** a weekly test sheet: the number of test slots the budget funds, the concepts and hooks going in, the campaign layout, the day 1, 3 and 7 reads, and the winner, wait or cut call for each ad, plus next week's brief list, ready for the owner to approve the spend.

## When to use

- TikTok ads are live and the store needs a steady flow of new winners.
- One or two old ads carry most of the spend and are tiring.
- The team makes many TikTok videos but cannot say which ones work or why.
- The owner asks how many new videos a month TikTok really needs.

## Not for

- Writing the scripts: use `write-tiktok-ad-scripts`.
- Setting up the first campaign: use `launch-tiktok-ads-first-campaign`.
- Daily budget calls on the scaling campaign: use `tiktok-ads-daily-review-and-scale`.
- Creative tests on Meta: use `weekly-creative-sprint`.

## What you need

Required:

1. **TikTok Ads Manager export** at ad level, last 4 weeks: spend, impressions, CPM, 2-second and 6-second video views, average watch time, CTR, add to cart, purchases.
2. **Allowed cost per purchase** from `store-meta-math`.
3. **Shopify orders** for the same weeks, with UTM content per ad, to confirm purchases.
4. **The week's TikTok budget** and the share the owner allows for tests.
5. **New videos ready** for the week, with usage rights.

Optional: the tag sheet from `creative-naming-and-tagging-system`, TikTok Creative Center top ads in the category (free), comments on live ads.

Drafting ads needs level 2; launching and moving budget need the owner's yes, or level 3 within written limits.

## Before you start: the gates

1. **Tracking passes.** Purchases in TikTok roughly match store orders from TikTok traffic. Fail: run `tiktok-pixel-and-events-api-check` first; tests read on broken purchases waste money.
2. **Allowed cost per purchase is known.** Fail: compute it; there is no winner line without it.
3. **The budget funds at least one readable slot** (step 1). Fail: test fewer concepts, or test hooks only on one proven body.
4. **Rights and rules.** Every video has usage rights, licensed sound and AI labels where needed. Fail: hold that video.

## Steps

### 1. Count the slots

Test share of TikTok spend: about 30% when TikTok is profitable, 10% or none when it is not [ADC-0053].

One slot = one concept read to a decision. Spend per slot = three times allowed cost per purchase, the point where a call can be made [ADC-0039]. Each test ad group also needs at least $20 a day [ADC-0063].

Slots this week = weekly test budget / (3 x allowed cost per purchase), rounded down.

If a firmer read is wanted, size it the other way: daily test budget = target purchases x expected cost per purchase / test days [ADC-0066].

### 2. Fill the slots with concepts, not tweaks

A concept is a new angle, format or person. A new background or caption is not. Rank candidates by the gross profit per purchase of the product they sell, then by evidence (buyer comments, reviews, a creator post that beat its usual views).

Split the month's slots about 50 to 60% remakes of past winners, 20 to 30% fixes of near-misses, 20 to 30% new concepts; never zero new concepts [MCR-0042].

### 3. Build hooks per concept

Each concept gets 2 to 4 hooks on one body; more spreads budget too thin to read [MCR-0013]. Vary the three hook levers separately: what is said, the on-screen text, the first visual [MCR-0028]. The hook must pull in buyers, not just stop the scroll; broad curiosity hooks train delivery toward people who never buy [MCR-0026]. Most viewers leave in the first half, so the opening seconds and the product reveal matter most [MCR-0077].

### 4. Lay out the campaigns

| Campaign | Ad groups | Budget |
|---|---|---|
| Test | One ad group per concept, 2 to 4 hook versions inside, broad targeting | Per ad group: slot spend over 3 to 7 days, $20 a day minimum |
| Scaling | Proven winners only | Run by `tiktok-ads-daily-review-and-scale` |

Name every ad with product, angle, format, hook, person and date, and fill the tag sheet so winners can be traced to one element [MCR-0051].

### 5. Read on day 1, 3 and 7

Do not judge before about $50 of spend or 1,000 impressions per ad [ADC-0037].

| Day | Read | Starting lines (replace with the store's own baseline after 4 weeks) |
|---|---|---|
| 1 | Hook and hold | CTR above 1%, average watch time above 25% [ADC-0037] |
| 3 | Click to cart | Cost per click and add to cart against the store's last 4 weeks |
| 7 | Purchases | Store-confirmed purchases against allowed cost |

Use one decision metric for the call: purchases at allowed cost. Every extra metric used to pick winners raises the chance of a false win [CRO-0010]. The others are for diagnosis only.

### 6. Diagnose the losers

| Pattern | Likely cause | Next try |
|---|---|---|
| Low 2-second hold | Hook | New first second and text, same body |
| Good hold, low CTR | Body or offer unclear | Show the product working earlier |
| High CTR, few add to carts | Hook pulled the wrong people, or page mismatch | Check the hook filters for buyers; a high-CTR ad can be a false winner [MCR-0029] |
| Add to carts, few purchases | Price, shipping or checkout | Check the page and offer, not the ad |
| High CPM, low delivery | Audience or ad review issue | Check rejections and targeting |

### 7. Make the call

After three times allowed cost per purchase in spend [ADC-0039]:

- **Keep:** 3 or more store-confirmed purchases. Move the ad (same post, so likes and comments stay) into the scaling campaign.
- **Wait:** 2 purchases. Allow about one more allowed cost of spend.
- **Cut:** 0 or 1.

A kept ad is a winner only when it holds spend in scaling at or under allowed cost for 7 days.

### 8. Plan next week's volume

New ads needed a month = winners lost per month / hit rate [MCR-0025]. Use the store's own hit rate (winners / ads launched) after a month of tests. Write next week's brief list from the diagnosis column, not from scratch.

## Checks before you hand it over

- Slots are computed from the week's test budget and allowed cost per purchase.
- Each concept has 2 to 4 hooks, no more.
- Each test ad group has at least $20 a day.
- Every ad is named and tagged.
- No call was made before $50 or 1,000 impressions.
- Keep, wait and cut use store-confirmed purchases.
- Next week's briefs come from the diagnosis table.
- No spend moved without the owner's yes or written level 3 limits.

## Output

**One-screen summary:** test budget, slots, concepts tested, winners moved to scaling, cuts, the main lesson, and next week's slot count.

**Weekly test sheet** (`tiktok-test-week-<date>.csv`):

| Column | Entry |
|---|---|
| Ad name | Product, angle, format, hook, person, date |
| Concept type | Remake, fix, new |
| Spend | To date |
| CTR, 2-second hold, average watch time | Day 1 read |
| Cost per click, add to carts | Day 3 read |
| TikTok purchases, store purchases | Day 7 read |
| Cost per purchase (store) | Against allowed cost |
| Call | Keep, wait, cut |
| Diagnosis | From step 6 |
| Next brief | One line |

**Volume line:** winners lost this month, hit rate, new ads needed next month.

## Common mistakes

- **More concepts than the budget can read.** Step 1 counts slots first.
- **Twenty hooks on one body.** Step 3 caps at four.
- **Picking winners on CTR or views.** Step 5 uses purchases at allowed cost.
- **Copying an agency's fixed cost line.** Step 5 replaces starting lines with the store's own after 4 weeks.
- **Duplicating a winner as a new ad.** Step 7 moves the same post so social proof stays.
- **Testing tweaks, not concepts.** Step 2 defines a concept.

## Sources

- ADC-0037: early TikTok creative reads; no call before $50 or 1,000 impressions.
- ADC-0039: call after three times target cost: keep, wait, cut.
- ADC-0053: test share by profitability.
- ADC-0063: TikTok ad group floor of $20 a day.
- ADC-0066: daily test budget formula.
- CRO-0010: extra decision metrics raise false positives.
- MCR-0013: 2 to 4 hooks per body.
- MCR-0025: monthly volume from churn and hit rate.
- MCR-0026: hooks must filter for buyers.
- MCR-0028: three hook levers.
- MCR-0029: high CTR can be a false winner.
- MCR-0042: split of remakes, fixes and new concepts.
- MCR-0051: tag every ad on the same fields.
- MCR-0077: the first half of a video matters most.

What makes this skill ours: the week's slots are counted from the store's allowed cost per purchase before any video is made; one decision metric (store-confirmed purchases at allowed cost) picks winners while the rest only diagnose; agency starting lines are replaced by the store's own baseline; and next week's briefs come straight from the loser diagnosis.
