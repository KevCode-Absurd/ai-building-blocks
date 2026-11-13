---
name: test-a-new-ad-channel
description: "A small, capped test of one new ad channel (Pinterest, Snapchat, YouTube or Reddit) with a written pass or fail line before any more money goes in. Checks first that the store's main channels are profitable and tracking works, picks the one channel that fits the product, buyer and creative on hand, sets the most the store will lose, sizes budget and length from the allowed cost per new customer, matches attribution windows so the new channel is not flattered, and reads the result on the store's own new customers, the post-purchase survey and any lift in other channels. Use when the owner wants to 'try Pinterest' or any new platform, or when the main channel has stalled and a second one is being considered."
---

# Test a new ad channel

**You get:** a one-page test plan for one channel (why this one, maximum loss, budget per day, length, creative set, tracking checklist, and the pass, extend or fail line), plus a results sheet filled at the end with the decision, ready for the owner to approve before any spend.

## When to use

- The owner asks to try Pinterest, Snapchat, YouTube or Reddit ads.
- Meta or Google has stalled at the allowed cost per new customer and more spend there costs too much.
- The store has a buyer group the main channel reaches poorly (for example planners, gamers, hobby communities).
- A competitor seems to be selling on a channel the store does not use.

## Not for

- Building a full YouTube campaign after the test passes: use `set-up-youtube-ads-for-store`.
- Organic Pinterest boards and pins: use `pinterest-for-stores`.
- A first TikTok ads campaign: use `launch-tiktok-ads-first-campaign`.
- A geo or time holdout to prove lift on a channel already running: use `measure-channel-lift-with-holdouts`.

## What you need

Required (read access, level 1):

1. **Allowed cost per new customer** and **first-order gross profit**, from `set-ad-budget-from-profit-target` or `store-meta-math`.
2. **Current new-customer cost by channel** from `new-customer-cost-by-channel`, last 2 months.
3. **Shopify order export** for the test window and 4 weeks before it (to count new customers and their source).
4. **Creative on hand**: videos and images with usage rights, sizes and lengths.
5. **The owner's maximum loss** for the test, in money.

Optional: post-purchase survey answers, Shopify or GA4 orders by region (for a geo read), competitor ads seen on the channel.

Opening an ads account, adding a pixel and drafting the campaign need draft access (level 2) and the owner signs in to create the account; the agent never handles passwords or card details. Starting spend needs the owner's yes.

## Before you start: the gates

1. **The base is healthy.** The main channel is at or under the allowed cost per new customer and tracking matches store orders. A wild bet never outranks fixing the baseline. Fail: fix the main channel first.
2. **Gross profit per order is known** from delivered costs. Fail: stop; no pass line can be written.
3. **Cash covers the maximum loss** without touching stock or payroll money. Fail: wait or shrink the test.
4. **Creative exists in the channel's shape.** Fail: brief it with `write-one-page-creative-brief` before booking any spend.
5. **Category rules.** Supplements, alcohol, weight loss and some health products have extra rules on each platform. Fail: check the platform's ad policy page for the category before building.

## Steps

### 1. Pick one channel, not four

Score each candidate 1 to 3 on four questions, and pick the highest. Ties go to the channel with the cheapest creative path.

| Question | What to look at |
|---|---|
| Are the buyers there? | The platform's own audience estimate for the target country and age in its ads manager |
| Does the product fit how people use it? | Pinterest: planning and visual search (home, fashion, beauty, food, gifts, weddings). Snapchat: young buyers, full-screen vertical video. YouTube: products that need showing or explaining. Reddit: research-heavy products and hobby communities |
| Do we have the creative? | Vertical video, static pins, longer demo video, or text-led posts |
| Can we track it? | Pixel plus server events available, Shopify app or tag manager path |

Channel fit varies by buyer, not by hype: in one large apparel brand, a mobile app network matched Meta spend in gift season while TikTok never scaled for menswear [ADC-0054]. India: check the audience estimate in each regional language the store sells in.

### 2. Set the maximum loss and budget

Maximum loss = the lower of the owner's limit and the expected loss if the channel returns nothing.

Budget per day = target new customers x allowed cost per new customer / test days [ADC-0066]. Plan for about 20 purchases where cash allows, and at least 14 days to cover two weekly cycles (practitioner default, test it). If that budget is above the maximum loss, optimise to add to cart instead and say the read is weaker.

YouTube: Google recommends a Demand Gen daily budget of at least ten times the target cost per action [GAD-6124]; if cash cannot carry that, do not test YouTube yet.

### 3. Match the attribution window before launch

Defaults differ: Pinterest reports 1-day view and 30-day click if no window is chosen [MEA-6100]; Snap defaults to a 28-day swipe window [MEA-6101]; Reddit to 28-day click [MEA-6102]. Meta is read on 7-day click [MEA-0042]. Set the new channel to the store's standard window, or re-pull its numbers on it, so the test is not flattered.

### 4. Set up tracking

- Platform pixel through the official Shopify app or tag manager, with purchase value and order ID.
- Server events (conversions API) if the platform offers them, with deduplication by order ID.
- UTM rule on every ad: one spelling, lower case [MEA-6221].
- Add the channel to the post-purchase survey answer list.
- Place a test order and confirm one purchase shows in the platform and one in Shopify.

### 5. Build the smallest fair test

One campaign, purchase or add-to-cart goal, broad targeting in the main country, 3 to 6 ads from the store's proven angles (do not test a new channel and new messages at once). Exclude existing customers where the platform allows. Send traffic to the page that wins on the main channel.

### 6. Write the pass, extend and fail lines before launch

Read on store data:

- **Pass:** store-view cost per new customer at or under the allowed cost after the full budget, and the survey names the channel.
- **Extend once:** cost between 1 and 1.5 times the allowance with cost falling week to week (practitioner default, test it). Extend by one more test length, same budget.
- **Fail:** cost above 1.5 times the allowance at the end, or no store-attributed new customer after spending three times the allowed cost [ADC-0039].

Also watch the other channels. A new channel's effect can show up as better results in Meta, while a tiny budget can drift to warm visitors and look cheap [MEA-0040]. If blended new-customer cost improves while the test runs and nothing else changed, note it as a reason to extend, not as a pass.

### 7. Run it without touching

No edits for the first 7 days except to stop a broken ad or tracking fault. Log daily: spend, platform purchases, store-attributed new customers, survey mentions.

### 8. Read and decide

At the end, fill the results sheet with all three views (store, platform on matched window, survey). If the store has enough regions and volume, a follow-up geo test gives the firm answer: cluster regions on spend, new-customer revenue and new-customer orders, then compare [MEA-0050]. Very large brands run geo-lift before scaling a channel [MEA-0033]; smaller stores rely on 7-day click and a new-customer dashboard [MEA-0041].

Decision: pass goes to a scaling plan with its own budget line; extend once; fail stops spend and records why, so the same test is not rerun next quarter without a new reason.

## Checks before you hand it over

- Only one channel is tested, with its score shown.
- The maximum loss is in money and the owner has agreed it.
- Budget per day x days is no more than the maximum loss.
- The attribution window matches the store's standard.
- A test order reached both the platform and Shopify once.
- Pass, extend and fail lines were written before launch.
- The result uses store-attributed new customers, not only platform purchases.
- No account, spend or ad went live without the owner's yes.

## Output

**One-screen summary:** the channel chosen and why, maximum loss, budget per day and dates, the pass line, and at the end the decision with its three numbers.

**Test plan** (`channel-test-<channel>.md`):

| Field | Entry |
|---|---|
| Channel and score | Scores for buyers, fit, creative, tracking |
| Allowed cost per new customer | From the budget sheet |
| Maximum loss | Money, agreed by owner |
| Budget per day and days | With the formula |
| Goal event | Purchase or add to cart |
| Window | Click and view days |
| Ads | Names, angles, sizes |
| Tracking checklist | Pixel, server events, UTM, survey, test order |
| Pass, extend, fail | Exact numbers |

**Results sheet** (`channel-test-results.csv`): Day, Spend, Platform purchases (matched window), Store new customers, Survey mentions, Blended new-customer cost, Notes; final row with the decision.

## Common mistakes

- **Testing four channels at once.** Step 1 picks one so the budget can buy a readable result.
- **Reading the platform's default window.** Step 3 matches it to the store's standard.
- **New channel plus new messages.** Step 5 uses proven angles, so a fail means the channel.
- **No line written in advance.** Step 6 fixes pass and fail before any spend.
- **Killing a channel that helps elsewhere.** Step 6 watches blended new-customer cost during the test.
- **Testing before the base is healthy.** Gate 1 stops it.

## Sources

- ADC-0039: judge after three times target cost.
- ADC-0054: channel fit varies by buyer.
- ADC-0066: test budget from conversions x cost / days.
- GAD-6124: Demand Gen budget of ten times target cost per action.
- MEA-0033: geo-lift before trusting a channel at scale.
- MEA-0040: small channels mislead in-platform.
- MEA-0041: match measurement to store size.
- MEA-0042: read Meta on 7-day click.
- MEA-0050: geo-lift design from store data.
- MEA-6100, MEA-6101, MEA-6102: Pinterest, Snap and Reddit default windows.
- MEA-6221: consistent UTM spelling.

What makes this skill ours: a wild bet only runs once the base channel is healthy; the new channel's attribution window is matched before launch so 28 and 30-day defaults cannot flatter it; the maximum loss is agreed in money before budget is sized; and the pass line is read on store new customers with an eye on halo in other channels.
