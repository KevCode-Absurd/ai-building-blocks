---
name: blended-channel-profit-view
description: "Shows a store the true combined return of its Meta and Google spend, measured on store gross profit, not platform revenue. Builds a weekly table from Shopify, Meta and Google exports: blended and new-customer return on spend, gross profit after ads, and how far the platforms over-claim the same orders. Looks for signs that Meta drives branded Google searches, checks each channel against a post-purchase survey, scores the channel mix, and designs a simple holdout test sized to the store to check any cross-channel claim before money moves. Ends with a unified budget direction. Use monthly, when platforms disagree, or before shifting spend between channels."
---

# Blended view: what Meta and Google really return together

**You get:** a weekly blended table of Meta and Google spend against store gross profit, a channel mix table with the over-claim ratio, and a holdout plan for the one channel claim worth testing.

Meta and Google each take credit for the same orders. Added up, they often claim more sales than the store made. This skill measures the combined return from the store's own orders and gross profit, checks how the channels feed each other, and tests the claims that would move money.

## When to use

- Monthly, as the store's single view of paid media.
- Meta and Google together claim more orders than Shopify recorded.
- Someone argues Meta "drives" Google brand searches and wants to shift budget on that basis.
- Before a large shift of spend between channels.

## Not for

- Moving money between campaigns: use `cross-channel-budget-reallocation`, which takes this view as input.
- How much of Meta alone to believe: use `store-meta-attribution`.
- The full monthly owner report: use `monthly-store-performance-report`.
- Designing a Meta-only test: use `store-meta-test`.

## What you need

Required (read access, level 1):

1. **Shopify order export**, 26 weeks: Name, Created at, Subtotal, Discount Amount, Shipping, Refunded Amount, Customer Id, Landing site or UTM fields, Payment Method, shipping region.
2. **Meta Ads Manager export** by week, same period: Amount spent, Purchases and Purchases conversion value on 7-day click and on the account's default setting.
3. **Google Ads campaign report** by week: Campaign, Campaign type, Cost, Conversions, Conv. value, Impressions; plus brand campaign impressions, or Google Search Console impressions for brand queries.
4. **Gross profit per order** from `store-meta-math`, or gross margin rate after delivery costs and returns.

Optional: post-purchase survey answers ("How did you first hear about us?"), Amazon sales if the store sells there, email and SMS revenue.

If the survey is missing, recommend adding one and proceed without that check. If brand search data is missing, skip step 5 and say so.

Access: level 1 throughout. Running a holdout changes live campaigns: the client approves the design, dates and spend first.

## Before you start: the gates

1. **Gross profit per order known.** Fail: stop. Revenue-based return hides refunds, discounts and costs; the view must be on gross profit.
2. **Cash and capacity.** Not a gate for the view. Gate for the holdout in step 7: the client must accept a few weeks of possibly lower sales in test regions.
3. **Tracking.** Shopify is the source of truth here, so the view runs even if platform tracking is weak. Note platform tracking problems in the over-claim line rather than stopping.

## Steps

### 1. Build the weekly store table

One row per week: total ad spend (Meta plus Google), store net sales, new-customer net sales, orders, new-customer orders, gross profit, refunds accrued at the expected rate (Shopify books refunds on the refund date) [MEA-0011].

### 2. Work out the four store-side returns

- **Blended MER** = net sales / total ad spend.
- **New-customer MER (aMER)** = new-customer net sales / total ad spend. This decides acquisition questions; blended MER can rise while new-customer efficiency falls [MEA-0039] [MEA-0025].
- **Gross profit after ads** = gross profit minus total ad spend. This is the line the owner keeps.
- **First-order profit ratio** = new-customer gross profit / total ad spend. Under 1 loses money on the first order, 1 to 2 needs proven repeat, 2 to 3 is where scaling makes sense, above 3 suggests under-spending [MEA-0024].

Split the profit line into new and returning customers; returning profit can hide a monthly loss on acquisition [MEA-0055].

### 3. Measure how much the platforms over-claim

Over-claim ratio = (Meta purchases + Google purchase conversions) / store orders from paid traffic, by week.

**Comparability gate first.** Before any two platform numbers sit in one sum or one ratio, check they count the same thing: the same conversion event and value (purchase with or without tax and shipping), the same attribution window and click or view scope, the same counting (every conversion or one per click), the same time zone, the same currency, and whether modelled conversions are included. A Meta 7-day click figure and a Google 30-day figure cannot be added. Where they differ, show them side by side with their definitions and fix the settings or exports first; label any gap you cannot tie to a setting "possible, not confirmed". Recent days are not final: conversions keep arriving for the length of the window, so leave the last 7 days out of the ratio or mark them provisional. The store's orders are the total; platforms are only good for ranking campaigns inside themselves.

A ratio above 1 means both claim the same orders; above about 1.3, practitioner default, platform numbers should not decide budgets at all until the store basis replaces them. Report Meta on 7-day click for this line; view-through credit often makes up 30 to 50% of reported return [MEA-0042]. Large retailers have seen new-customer MER of 3 to 7 against a reported Meta ROAS of 17 [MEA-0031]. Brand search sits apart: it often takes a small share of spend but a large share of conversions, inflating Google's figure [GAD-0003].

### 4. Check against the post-purchase survey

If Meta takes about half of spend, about half of "where did you hear about us" answers should name it [MEA-0045]. Compare survey share with spend share and claimed share for each channel. The survey under-credits channels people rarely remember, and needs hundreds of answers a month to be steady.

### 5. Look for Meta feeding brand search

Plot weekly Meta spend against weekly brand search impressions for the same 26 weeks, with the brand series shifted 0, 1 and 2 weeks later. Add a second series: Shopify sessions from direct traffic. Compare week-on-week changes, not raw levels: two series that both grow over the season always look linked, and six weekly points are too few to mean anything. Day-level lags need daily data; with weekly data, test lags in weeks.

Signs that Meta feeds brand search: brand impressions and direct sessions move with Meta spend changes at a steady lag, across more than one spend change. This is a hint, not proof: sales, launches and press move both. Do not add a share of brand revenue to Meta's return on a hint; only the holdout in step 7 gives a number. A new or small channel's lift often appears in another platform's numbers [MEA-0040], which is why step 7 tests it.

If the store also sells on Amazon, add Amazon sales to the table; part of Meta's effect can land there [MEA-0029].

### 6. Score the channel mix

For each channel, mark pass or fail on four lines, then count passes (0 to 4):

1. Positive gross profit after its own spend on the store basis.
2. Survey share within 10 points of spend share, practitioner default.
3. New-customer share of its store-matched orders at or above the store average.
4. Its marginal return holds after the last spend change.

A channel scoring 3 or 4 can receive money; 2 holds; 0 or 1 is a candidate for cuts or a holdout. Set no fixed floor such as "never below 30% on a channel"; a floor needs a holdout behind it. Also check that the top-spending Meta ad and Google ad promise the same offer and price; mixed promises across channels confuse buyers who see both. Branded search spend share is a separate check: one practitioner keeps it at 3 to 8% of Google spend [GAD-0024], and one large brand's holdouts put it under 1% of all paid spend [ADC-0051]. The holdout result wins over either rule of thumb.

### 7. Design one holdout to test the claim that would move money

Pick the method by size [MEA-0041]:

- **Small store (under about 5M a year):** the card's advice is 7-day click plus a new-customer dashboard, no formal test. If one claim would move real money, add a time-based test: switch off branded search for 2 weeks, then back on for 2 weeks, and compare total store orders and new customers with Meta spend held flat. Practitioner default, test it; seasonality can fool it, so avoid sale weeks.
- **Mid-size store (about 5M to 20M):** Meta's own conversion lift study, or a region test using 2 to 4 matched regions.
- **Large store (20M and up) selling across many regions:** a geo-lift test of about 25 days with regions clustered on spend, new-customer revenue and new-customer orders; incremental return = sales lift / extra spend [MEA-0033] [MEA-0050].

Write before launch: the claim, test and control regions or weeks, dates, the spend at risk, the result that would change the budget, and the result that would not. End region tests at least 3 weeks before a peak, and read a post-test window [MEA-0034].

### 8. Write the unified budget direction

From steps 2 to 7: which channel gets more, which holds, which goes to a holdout, and the total. The detailed moves go to `cross-channel-budget-reallocation`.

### 9. Read channel quality over time, and noise before moving money

- **Cohort by channel:** once a quarter, take new customers by first-order month and the channel that brought them (survey answer or UTM), and compare their 90 and 180-day gross profit per customer against what each cost. A channel with a lower short-term return but buyers who come back more can be the better use of money; compare channels on payback or gross profit to CAC, not on platform ROAS [MEA-0024]. If a channel's newer cohorts are worth less than older ones for two months running, flag it before the weekly numbers show it.
- **Noise:** a weekly move smaller than the channel's normal week-to-week swing is not a result. One practitioner rule of thumb (unsourced, check against your own history) is that a real change in a metric that moves 10 to 20% a week is about 30% or more. Agree the test length before reading a change.
- **Traps to name when they show up:** a new campaign with a huge first-week return is often retargeting warm buyers; turning off a broad Google campaign without losing sales often means it was taking brand searches you would have won anyway; steady ROAS with falling profit usually means the product mix moved to lower-margin items.

## Checks before you hand it over

- Every return is calculated from Shopify numbers, with gross profit, not revenue, on the bottom line.
- New and returning customers are split.
- The over-claim ratio uses the same weeks and the attribution setting is named.
- Each cross-channel claim is labelled "hint" or "tested", with the test named.
- The holdout has dates, spend at risk and a decision rule written before launch.
- The channel-mix score shows all four lines per channel, not just the total.
- Platform numbers were only combined after passing the comparability gate; otherwise they sit side by side with definitions.
- The last 7 days are left out of the over-claim ratio or marked provisional.
- Channel cohorts compare gross profit per customer at 90 and 180 days against cost, not platform ROAS.
- No live campaign change without a client yes.

## Output

**Summary, one screen:** gross profit after ads this month and trend, new-customer MER against break-even, over-claim ratio, which channel earns more money and which does not, the one claim worth testing and how.

**Table "Weekly blended view":** Week, Meta spend, Google spend, Total spend, Net sales, New-customer net sales, Gross profit, Gross profit after ads, Blended MER, New-customer MER, Platform-claimed orders, Store paid orders, Over-claim ratio.

**Table "Channel mix":** Channel, Spend share, Claimed share of orders, Survey share, New-customer share, Gross profit after own spend, Marginal return, Score (0 to 4), Direction.

**Table "Holdout plan":** Claim, Method, Test and control, Dates, Spend at risk, Success rule, Decision if yes, Decision if no.

**Table "Definitions check":** Source, Conversion event, Value definition, Window, Click or view, Counting, Time zone, Currency, Modelled included, Comparable (yes or no), Fix.

**Table "Channel cohorts" (quarterly):** Channel, First-order month, New customers, Cost per new customer, Gross profit per customer at 90 days, at 180 days, Ratio to cost, Trend.

**File:** `blended-view.csv` or a Google Sheet that updates from the three exports.

## Common mistakes

- **Adding platform revenue together.** The sum exceeds the store's sales. Step 3 measures the over-claim.
- **Blended MER as the only number.** It rises when returning customers carry the month. Step 2 adds new-customer MER and splits profit [MEA-0039].
- **Treating a matching chart as proof.** Step 5 calls it a hint; step 7 tests it.
- **Rules of thumb on brand spend overruling a test.** Step 6 lets the holdout decide.
- **Running a region test into Black Friday.** Step 7 ends it 3 weeks before [MEA-0034].
- **Revenue instead of gross profit.** Gate 1 stops the view without it.
- **Adding a 7-day figure to a 30-day figure.** Step 3's comparability gate keeps them apart until the definitions match.
- **Cutting the channel with the lower ROAS.** Step 9 checks what its buyers are worth over 180 days first.
- **Reacting to a normal weekly swing.** Step 9 sets a noise line before anyone moves money.

## Sources

- ADC-0051: one brand's holdouts put branded search under 1% of spend.
- GAD-0003: brand inflates blended Google return.
- GAD-0024: branded Google spend at 3 to 8%.
- MEA-0011: refunds land on the refund date.
- MEA-0024: profit to CAC bands.
- MEA-0025, MEA-0039: new-customer MER over blended MER.
- MEA-0029: part of Meta's effect lands on Amazon.
- MEA-0031: store-side return far below reported return.
- MEA-0033, MEA-0050: geo-lift design.
- MEA-0034: end holdouts well before peaks.
- MEA-0040: lift shows up in other channels.
- MEA-0041: measurement method by store size.
- MEA-0042: view-through inflates Meta.
- Library items: Conversion reconciliation (adapted from ads-attribution by Daniel Agrici, MIT, https://github.com/AgriciDaniel/claude-ads/tree/main/skills/ads-attribution), used for the comparability gate; Ad dashboard reader (adapted from ads-performance-analytics by RampStack, MIT, https://github.com/rampstackco/claude-skills/tree/main/skills/ads-performance-analytics), used for channel cohorts, the noise line and the named traps.
- MEA-0045: survey share should track spend share.
- MEA-0055: split new and returning profit.

What makes this skill ours: gross profit after ads as the bottom line instead of blended ROAS; an over-claim ratio that shows how much the platforms double count; a channel-mix score built from four store-side checks; and a holdout sized to the store that decides cross-channel claims before money moves.
