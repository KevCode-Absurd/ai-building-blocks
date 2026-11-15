---
name: store-meta-attribution
description: "Decides how much of what Meta reports a store should believe. Lines up Meta purchases and purchase value against the Shopify or WooCommerce order export week by week, splits click from view credit, checks the attribution setting, new-customer share, cash-on-delivery orders that never paid, and the post-purchase survey, then sets one store-truth factor that turns Meta ROAS into store-basis ROAS. Ends with a reconciliation table of Meta versus store orders and a plain rule for which number decides each question. Use it when Meta and the store disagree, before trusting a ROAS for a budget call, and after any change to tracking or attribution settings."
---

# How much of Meta's credit is real: store attribution check

**You get:** a week-by-week table of Meta against store orders, the size of the gap and its main cause, a chosen reporting basis, and store-truth factors per campaign for reading ROAS on a store basis.

Meta reports what its model credits to ads. The store export reports what was actually ordered, paid and kept. This skill measures the gap, explains it, and turns it into one factor that other editions use to judge campaigns on store truth.

## When to use

- Meta shows more purchases or more revenue than the store took in, or far fewer.
- Before a budget decision in `store-meta-budget`, so ROAS is read on a store basis.
- After a change to the attribution setting, the pixel, the Conversions API or the checkout.
- Retargeting or catalog ads show a ROAS that looks too good to be true.
- Before and after Black Friday or a big sale, when delayed credit swings hardest.
- Many orders fail delivery, get refused, or have payments reversed after Meta counted them (pay on delivery stores see this most).

## Not for

- Building gross profit per purchase or break-even ROAS: use `store-meta-math` first.
- Repairing the pixel, event IDs or server events: use `store-meta-capi`; this skill only flags the symptoms.
- Running a lift or holdout test: design it with `store-meta-test`.
- A full account review: use `store-meta-audit`.

## What you need

Required, read access (level 1) throughout:

1. **Meta Ads Manager export**, last 8 to 12 full weeks, by week, at campaign level. Columns: Campaign name, Attribution setting, Amount spent, Purchases, Purchases conversion value, and the same two under "Compare attribution settings" for 7-day click, 1-day view and 1-day engaged view. Add the incremental attribution column where the account shows it.
2. **Shopify order export** for the same dates: Name, Created at, Financial Status, Subtotal, Discount Amount, Shipping, Total, Refunded Amount, Payment Method, Customer email or Id, Cancelled at. Plus Shopify Analytics "Sales by customer type" (new versus returning) or the customer export to tag first orders. WooCommerce: the order CSV and customer list.
3. **Money lines** from `store-meta-math`: break-even ROAS and target cost per purchase.
4. **Total ad spend by week across all channels.**

Optional: post-purchase survey answers ("Where did you first hear about us?"), courier export of delivered and failed orders (most useful where pay on delivery is offered), Amazon sales by week if the brand sells there.

If the Ads Manager export lacks the comparison columns, ask once. If the client cannot provide them, work on the default setting at reduced confidence and say so in the first line.

## Before you start: the gates

1. **Gross profit per purchase known.** Pass when `store-meta-math` has produced break-even ROAS. Fail: you can still measure the gap, but you may not call any campaign profitable or not.
2. **Cash and stock limits stated.** Not needed to measure the gap. Note them so the hand-over to `store-meta-budget` is complete.
3. **Tracking good enough to reconcile.** Pass when Meta receives Purchase events every day and the store export is clean of test and staff orders. Fail when Meta shows Purchases on days the store had none, or zero for two or more days: stop and send the client to `store-meta-capi` first. A test event code left live sends real purchases to the test screen, which looks like a sudden drop [MEA-0005].

## Steps

### 1. Use closed weeks only

Meta credits a purchase to the day of the ad click or view, so recent days keep filling in. Use weeks that ended at least 7 days ago. In November the gap between 1-day and longer-window credit roughly doubles, so wait longer around sales [ADC-0046].

### 2. Check the attribution setting

Read the Attribution setting column for every active campaign. Mixed settings make campaign comparisons meaningless; flag any that differ [ADC-0027].

Default reporting basis: 7-day click plus 1-day engaged view [ADC-0027]. Engaged view now covers likes, shares and video watches of about five seconds, which used to sit inside click credit. Plain 1-day view is the main inflator: agency audits found 30 to 50% of reported ROAS came from it [MEA-0042]. Changing the setting on a live ad set counts as a significant edit, so prefer changing report columns over changing the optimisation setting mid-flight.

Where these disagree: the setting that tracks the store's weekly new-customer orders most closely wins for this store (step 6). The cards above are the starting point, not the verdict.

### 3. Measure view-through share

View share = (Purchases on default setting minus Purchases on 7-day click) divided by Purchases on default setting, per campaign.

Practitioner default, test it: above about 30% on a prospecting campaign, judge it on click credit only. On a retargeting or catalog campaign, a high view share usually means credit for people who would have bought anyway.

### 4. Build the store side

From the order export, per closed week: orders placed, orders cancelled, orders refunded (accrue at the expected return rate, because Shopify books refunds on the refund date [MEA-0011]), net revenue, new-customer orders and new-customer revenue. Add orders delivered and orders that failed delivery or were never paid. Meta counts the order when it is placed, so failed and unpaid orders inflate Meta against cash.

### 5. Explain the gap

Ratio = Meta purchases (7-day click plus 1-day engaged view) divided by store orders placed.

| What you see | Usual cause | Next step |
|---|---|---|
| Meta above store | Double-counted pixel and server events, view credit, thank-you page reloads, failed or unpaid orders | `store-meta-capi` for dedup; step 3 for view credit |
| Meta far below store | Missing server events, consent blocking the first page view [MEA-0007], ad blockers [MEA-0001], strong email or search | `store-meta-capi`; check other channels' share |
| Meta value far from store value | Value sent with tax or shipping, wrong currency, discounts not netted | `store-meta-capi`, event values |
| Store sales rise on Amazon when Meta spend rises | Meta demand landing on Amazon; about 20% of Meta value in one study [MEA-0029] | Count Amazon in the store side if the brand sells there |

A steady gap is fine; a gap that jumps week to week is not. Ask why before using any factor.

### 6. Choose the reporting basis by correlation

For each setting (7-day click, 7-day click plus 1-day engaged view, default), list weekly Meta purchases beside weekly store new-customer orders for 8 or more weeks. The setting whose weekly ups and downs follow new-customer orders most closely becomes the store's reporting basis. 7-day click without view credit often tracks new-customer MER closely [MEA-0025].

### 7. Set the store-truth factor

Store-truth factor = Meta-driven store revenue divided by Meta-reported revenue on the chosen basis.

Estimate Meta-driven store revenue from new-customer revenue times Meta's share of new-customer sources. Get Meta's share from the post-purchase survey: if Meta takes about half of spend, about half of "where did you hear" answers should name it [MEA-0045]. Without a survey, use Meta's share of total ad spend and mark the factor "low confidence".

Illustrative only: Meta reports 30,000 on the chosen basis; store new-customer revenue is 30,000; the survey gives Meta 70%. Factor = 21,000 / 30,000 = 0.70. A Meta ROAS of 3.0 becomes a store-basis ROAS of 2.1. Compare that with break-even from `store-meta-math`. The factor counts new customers only, so it is deliberately strict; that is the right basis for prospecting that excludes existing customers.

Set a separate, lower factor for retargeting and catalog campaigns. Their ROAS is inflated by existing customers; Meta's incremental column cut one from 5x to 2.5x [ADC-0010], and a top ad at 12.84 fell to about 5 on new customers and 1.71 incrementally [ADC-0024]. Use the incremental column where shown.

### 8. Decide which number answers which question

- **Is acquisition paying?** New-customer MER from the store, against break-even [MEA-0039].
- **Which campaign or ad gets more?** Meta on the chosen basis times the factor, inside Meta only, never across platforms [MEA-0025].
- **Is retargeting worth it?** The incremental column, or a holdout test.
- **Does the store-level total make sense?** MER and the survey.

### 9. Match measurement to size

Under about $5M a year in revenue: 7-day click reporting plus a new-customer dashboard. Up to about $20M: add Meta's lift studies. Above that: geo holdout tests [MEA-0041]. When Meta ROAS and new-customer MER disagree for a month or more, a geo test of about 25 days settles it [MEA-0033].

### 10. Build the reconciliation table

One row per closed week, columns as in the Output section, totals at the bottom. Write one line under it saying which number decides budget questions and the factor to use until the next check.

### 11. Say which rung of evidence each decision stands on

Every budget call rests on some evidence. Name the rung, lowest to highest:

1. Opinion or a platform's own claim.
2. A simple correlation (daily 7-day click ROAS against daily acquisition MER).
3. A model, such as a media mix model.
4. A quasi-experiment (a geo split or a planned spend cut with a floor).
5. A true experiment (a conversion lift test or randomised holdout).

Decision order: the profit and loss account first; lift studies for big calls such as cutting a channel; platform numbers for daily steering only.

- **Correlation bar.** Run CORREL on at least 8 weeks of daily series. About 0.8 or higher means the two numbers move together, which is enough to steer by, not proof the ads caused the sales.
- **Store an incrementality factor from a holdout** only when it is completed, recent, on the same platform and a similar setup, with dates, spend and margin of error written down. A survey-based factor stays labelled as the weaker rung.
- **Never compare ROAS across platforms, margins or funnel stages.** Pinterest claims view-throughs whenever any of several tiles was on screen, so 7x there against 2.5x on Meta says little [ADC-6152]. TikTok and Pinterest are read on 7-day click.
- **A jump that is someone else's work.** If Meta's mid-funnel ROAS leaps (for example 4x to 12x) while a new channel looks weak, Meta is probably retargeting the new channel's traffic [ADC-6153]. Some large retail brands see more TikTok spend lift Meta and Google ROAS while TikTok's own number stays weak [ADC-6158].
- **Confirm the click definition.** Around March or April 2026 Meta limited 7-day click to outbound clicks, so click ROAS fell overnight in many accounts [ADC-6151]; compare periods on the same definition.

## Checks before you hand it over

- Only closed weeks are used, and the cut-off date is stated.
- Every campaign's attribution setting is listed and mixed settings are flagged.
- View-through share is shown per campaign.
- The reconciliation table balances: weekly rows add up to the totals, and store orders match the export count.
- Delivered orders and failed or unpaid orders show as separate columns.
- The factor states its method (survey or spend share) and its confidence.
- Retargeting and catalog campaigns have their own factor or an incremental read.
- One sentence names the number that decides budget questions.
- Each recommendation names its evidence rung.
- No ROAS is compared across platforms or funnel stages.

## Output

**Summary, one screen:** the gap in one sentence (for example "Meta claims 1.4 times the store's orders"), its main cause, the chosen reporting basis, the store-truth factor for prospecting and for retargeting, and what to fix first.

**Table "Meta versus store, by week" (the reconciliation table):** Week, Ad spend all channels, Meta spend, Meta purchases (default), Meta purchases (chosen basis), Meta purchase value (chosen basis), Store orders placed, Store orders cancelled or refunded, Store orders delivered, New-customer orders, New-customer revenue, Meta-to-store order ratio, MER, New-customer MER, Survey share naming Meta.

**Table "Campaign factors":** Campaign, Attribution setting, View share, Meta ROAS, Factor used, Store-basis ROAS, Break-even ROAS, Verdict (above, near, below break-even).

**File:** `meta-vs-store.csv` or a Google Sheet, with the week cut-off date in the title.

## Common mistakes

- **Judging the last few days.** They are still filling in. Step 1 uses closed weeks.
- **Comparing campaigns on different settings.** Step 2 flags them.
- **Trusting retargeting ROAS.** Existing customers inflate it [ADC-0010]. Step 7 sets its own factor.
- **Counting placed orders as revenue.** Failed deliveries and reversed payments never pay. Step 4 tracks delivered orders.
- **Blended MER as proof that Meta works.** Returning customers lift it while acquisition worsens [MEA-0039]. Step 8 uses new-customer MER.
- **A factor from one week.** A single week is noise; use 8 or more.
- **Ignoring Amazon.** Meta demand can land there [MEA-0029].
- **Cutting a channel on its own ROAS.** Check what the other channels' numbers did when it ran [ADC-6158].

## Sources

- MEA-0001: CAPI Gateway does not recover pixels blocked by extensions.
- MEA-0005: a live test event code hides real purchases.
- MEA-0007: consent setup can miss the landing page view.
- MEA-0011: Shopify books returns on the refund date.
- MEA-0025, MEA-0039: new-customer MER over blended MER; 7-day click tracks it.
- MEA-0029: about 20% of Meta value can land on Amazon.
- MEA-0033, MEA-0041: geo tests and measurement by company size.
- MEA-0042: view-through credit inflates reported ROAS.
- MEA-0045: post-purchase survey share should match spend share.
- ADC-0010, ADC-0024: retargeting and catalog ROAS collapse on incremental reads.
- ADC-0027: 7-day click plus 1-day engaged view; keep one setting.
- ADC-0046: November credit lag roughly doubles.
- Meta documentation: attribution settings, compare attribution settings and incremental attribution columns.
- ADC-6151: 7-day click now outbound clicks only.
- ADC-6152: do not compare ROAS across platforms.
- ADC-6153: a Meta jump can be retargeted traffic from a new channel.
- ADC-6158: TikTok spend can lift other channels.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill does that the open-source one did not: reconciles Meta purchases and value with the store's own order export week by week instead of scoring settings; picks the reporting window by how well it tracks the store's new-customer orders; turns the gap into a store-truth factor, with a lower one for retargeting and catalog ads; and handles cash-on-delivery orders that never pay.

## Selling in India

- For COD stores, pull the courier's delivered and RTO export each week. Meta counts the COD order when it is placed, so a rising RTO rate makes Meta look better than cash.
