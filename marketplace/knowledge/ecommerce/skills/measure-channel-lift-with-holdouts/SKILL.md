---
name: measure-channel-lift-with-holdouts
description: "A geo or time holdout test, sized from the store's own orders, that shows whether one channel (Meta, Google brand search, TikTok, a retargeting campaign, an email or WhatsApp program) adds sales the store would have made anyway. Picks matched regions from order history, checks the store is big enough to read a result, writes the decision rule and the most the test may cost before launch, then reads incremental orders, revenue and gross profit against the control and turns them into an incrementality factor for platform numbers. Use before cutting or scaling a channel on platform ROAS, when brand search or retargeting look too good, or when platforms and the survey disagree."
---

# Measure channel lift with holdouts

**You get:** a one-page test plan (question, regions or weeks, size check, duration, freeze list, cost cap, decision rule written before launch), the set-up list for the client to approve, and a read-out sheet that gives incremental orders, revenue, gross profit, incremental return per extra spend and an incrementality factor to apply to the platform's reported numbers.

## When to use

- The owner wants to cut or scale a channel by a lot and the platform's ROAS is the only evidence.
- Brand search, retargeting or catalog ads report very high returns.
- The post-purchase survey and the platform disagree about a channel.
- A new channel (TikTok, YouTube, out of home, a creator push) needs proof before it gets a real budget.

## Not for

- Meta's own conversion lift study or an in-platform A/B test: use `store-meta-test`.
- Weekly reconciliation of platform claims with store orders: use `blended-channel-profit-view`.
- Testing prices or pages: use `run-a-price-test` or `storefront-conversion-audit`.
- Splitting next month's budget: use `set-ad-budget-from-profit-target` once the result is in.

## What you need

1. **Shopify order export**, at least 12 weeks before the test and through the test: Name, Created at, Financial Status, Cancelled at, Subtotal, Email or Phone, Shipping Province, Shipping City, Shipping Zip, Payment Method.
2. **Gross profit per order** from `store-meta-math` or `build-sku-profit-sheet`.
3. **Spend by region by day** for the channel under test, from its ads manager breakdown by region.
4. **Calendar**: planned sales, launches, stock arrivals and email pushes for the test window.
5. India: courier report of delivered and RTO orders by pincode, so the read uses delivered orders.

The plan is level 1. Changing location targeting or budgets is level 2 (built paused or as a draft) and goes live only on the client's yes, with the cost cap agreed in writing. Owned-channel holdouts (email, WhatsApp) only stop messages to a group; the client approves the group.

## Before you start: the gates

1. **Data is clean.** Purchases reach the platform and GA4 (`set-up-ga4-for-store-and-check-data`); attribution settings are fixed first. A test on broken data answers nothing [MEA-0033].
2. **Gross profit per order known.** The decision rule is in profit, not revenue.
3. **Size.** Pass when the expected effect is larger than normal noise (step 3). Fail: do not run a geo test; use a time holdout for directional evidence, or the platform's own lift study through `store-meta-test`, and say so.
4. **Cash and stock.** The cost cap fits the month's cash plan, and a scale test does not run a top SKU out of stock.
5. **Quiet window.** No sale, launch or price change that hits test and control differently, and the test ends at least 3 weeks before a peak sale if a post-test window is needed [MEA-0034].

## Steps

### 1. Write the question and the decision

One channel, one change, one decision. Examples: "If we switch off brand search in the test regions, do new-customer orders fall by more than the brand search spend is worth?" or "If we double Meta prospecting in test regions, does gross profit rise by more than the extra spend?"

Write the decision rule now: keep or scale the channel if incremental gross profit / spend is at or above 1 (it pays for itself) or the store's set target; cut or trim if it is below. State what "inconclusive" leads to (usually: keep current spend and retest larger).

### 2. Choose the design

- **Geo holdout (preferred):** switch the channel off, or change its spend, in a set of test regions and compare with matched control regions.
- **Inverse test for demand-capture channels:** switch off brand search or retargeting in test regions [MEA-0033].
- **Time holdout:** only when the store sells mostly in one region or cannot target by region. Alternate on and off in blocks of at least one full week, four blocks or more, and label the result directional; seasonality and other changes can explain it.
- **Owned channels:** for email or WhatsApp programs, hold back a random 10 to 20% of eligible customers from the program instead of a region (practitioner default), and compare their orders. Keep the holdout clean of overlapping messages.

### 3. Pick matched regions and check the size

Regions: US states or metro areas; in India, states or groups of cities (use the platform's location options to confirm what it can target). Using the 12-week history, group regions so the test group and control group move together on three series: ad spend, new-customer revenue and new-customer orders. Single regions rarely match, so combine them [MEA-0050]. Put about 20 to 30% of new-customer orders in the test group for a holdout, to cap what the test can cost (practitioner default).

Size check: compute the weekly ratio of test-group to control-group new-customer orders over the 12 weeks and its normal swing (standard deviation). The expected change from the test must be at least twice that swing to be readable (practitioner default, test it). Expected change = the channel's share of new-customer orders as the platform claims it, discounted by half for over-claiming, in the test regions. If it fails, enlarge the test group, lengthen the test, or switch to gate 3's fallback.

Measurement tools and tests are worth about 1% of ad spend [MEA-0036]; at small budgets that buys a simple design like this one, not a paid tool. Geo tests suit larger brands; smaller stores lean on 7-day click and a new-customer dashboard [MEA-0041].

### 4. Set duration and windows

- Pre-period: the 12 weeks used for matching.
- Test: at least two full weeks to cover weekly cycles [CRO-0015]; about 25 days is a common length at agencies running these [MEA-0033]. Longer if the product's purchase decision takes longer than a week.
- Post-period: 2 to 3 weeks after the change ends, read separately; some lift shows up after spend returns to normal, much more in fashion than consumables [MEA-0034].

### 5. Freeze and log

Freeze list for test and control alike: same creative, offers, prices, emails and stock. Log every change by date. When the channel is switched off in test regions, lower its total budget by the test regions' share so the platform does not pour the same money into control regions and inflate them (practitioner default; check the spend breakdown daily).

### 6. Launch with approval

Prepare the set-up list: exact location exclusions or budget changes, start and end dates, the cost cap (most gross profit the store accepts losing), the stop rule (stop early only for a breakage or if the loss passes the cap), and who checks spend daily. Build it paused; go live on the client's yes.

### 7. Read the result

Use store orders by shipping region, new customers only, delivered orders in COD markets.

- Expected test-group orders = control-group orders in the test period x the pre-period ratio.
- Incremental orders = actual minus expected for a scale test, or expected minus actual for a holdout.
- Incremental revenue and gross profit = incremental orders x average order value and gross profit per order in the test group.
- Incremental return = incremental revenue / spend changed; example from a geo method: 100,000 extra revenue from 40,000 extra spend is 2.5 [MEA-0050].
- Incremental gross profit / spend changed, read against the decision rule.
- **Incrementality factor** = incremental orders / platform-reported orders in the test regions over the same days. Apply it to the platform's numbers until the next test [MEA-0041].

Report a range, not a point: rerun the read with the pre-period ratio from the noisiest and calmest four weeks. If the range crosses the decision line, the result is inconclusive.

### 8. Decide and record

Apply the decision rule as written. Record the test in the store's log with dates, regions, factor and range, and set a retest date (practitioner default: every 6 months, or after a big creative or budget change). Never run tests back to back in the same regions; it muddies the matching data [MEA-0041].

## Checks before you hand it over

- The decision rule and cost cap were written and approved before launch.
- Test and control groups matched on spend, new-customer revenue and orders over 12 weeks.
- The size check passed, or the design was switched and labelled directional.
- Test length is at least two full weeks, with a post-period read.
- Budget was cut by the test regions' share during a holdout.
- The read uses store orders by shipping region, new customers, delivered orders.
- Results show a range and the incrementality factor.
- Nothing went live without the client's yes.

## Output

**1. One-screen summary:** question, design, regions, dates, result range, incremental gross profit per spend, the decision, the factor to apply, retest date.

**2. Test plan**

| Field | Entry |
|---|---|
| Channel and change | |
| Decision rule | |
| Test regions, control regions, test share of new-customer orders | |
| Size check: normal swing, expected change, pass or fail | |
| Pre, test and post dates | |
| Freeze list | |
| Cost cap and stop rule | |
| Daily checker | |

**3. Set-up list for approval:** Change, Platform, Level, Start, End, Approved.

**4. Read-out sheet**

| Period | Control orders | Test orders | Expected test orders | Incremental orders | Incremental revenue | Incremental GP | Spend changed | Incremental GP / spend | Platform-reported orders (test) | Factor |
|---|---|---|---|---|---|---|---|---|---|---|

## Common mistakes

- **Before and after in one region.** Seasonality looks like lift; step 2 uses matched control regions or repeated time blocks.
- **Leaving budget unchanged in a holdout.** The platform moves money into control regions; step 5 cuts it.
- **Deciding the rule after seeing the result.** Step 1 writes it first.
- **Reading revenue.** Step 7 reads gross profit on delivered orders.
- **Stopping early on a good day.** Step 6 stops only for breakage or the cost cap.
- **Testing too small.** Step 3's size check prevents a noise result.

## Sources

- MEA-0033: geo-lift tests of about 25 days; inverse test for brand search; fix data first.
- MEA-0034: post-treatment lift shows after holdouts; end 3 weeks before peak.
- MEA-0036: spend about 1% of ad budget on measurement.
- MEA-0041: measurement ladder by size; apply incrementality factors.
- MEA-0050: match regions on spend, new-customer revenue and orders; incremental ROAS.
- CRO-0015: run at least one full week, in practice two.

What makes this skill ours: the size check uses the store's own region-to-region noise before any money moves; the holdout cuts total budget by the test share so control regions are not inflated; COD stores read delivered orders by shipping region; and the result becomes an incrementality factor applied to platform numbers until the next test.
