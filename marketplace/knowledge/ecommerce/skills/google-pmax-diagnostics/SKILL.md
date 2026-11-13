---
name: google-pmax-diagnostics
description: "Shows what a store's Performance Max campaigns really do with the budget: where the money goes by channel, how much goes to brand searches and returning customers, how each asset group scores on product coverage, stock and asset performance, and whether conversion goals, audience signals, final URL expansion or feed problems are steering it wrong. Adds a step-by-step brand-exclusion test that measures true new-customer lift from Shopify data. Read access only; the client approves every change and the test. Use it when Performance Max reports strong ROAS but store profit or new customers do not follow, or monthly on any store running it."
---

# Performance Max diagnostics

**You get:** a Performance Max breakdown of spend by channel and brand share, asset group scores, a settings check, the top three fixes and a dated brand-exclusion test plan with a weekly readout table.

Performance Max decides where ads run and who sees them, and reports one blended return. That return often includes people who searched the brand name or bought before. This skill opens the box: where the money went, who it reached, what the feed and assets allow, and whether the campaign adds customers the store would not have won anyway.

## When to use

- Monthly, on any store running Performance Max; changes need about 14 days to show, so not more often.
- Performance Max ROAS looks strong but new-customer orders or store profit are flat.
- Clicks jumped while return fell.
- Before scaling Performance Max or adding a second one.
- After a feed change, a stock-out or a target change, when results drop.

## Not for

- Product-by-product tiers and feed fixes: use `google-shopping-product-tiers`.
- Target ROAS and budget moves across campaigns: use `google-smart-bidding-budget`.
- Junk Display placements: use `google-display-placement-cleanup`.
- Video asset drop-off: use `google-video-dropoff`.

## What you need

Required, read access (level 1):

1. **Campaign settings**: bid strategy and target, budget, conversion goals (account default or campaign-specific), customer acquisition setting, brand exclusions, final URL expansion, automatically created assets.
2. **Channel performance report**, last 30 to 90 days: Search, Shopping, YouTube, Display, Discover, Gmail, Maps, with Cost, Clicks, Conversions, Conv. value.
3. **Asset group report**: asset groups, listing groups, asset counts by type, each asset's performance label (Low, Good, Best, Pending, Learning), ad strength.
4. **Search terms** for Performance Max where the account shows them, or Search term insights (query themes), with brand terms marked.
5. **Merchant Center**: active products, disapprovals, out-of-stock products with spend.
6. **Shopify order export**, same period, with customer type (new or returning), totalled by week.
7. **Gross profit per purchase**, from `store-meta-math`.

Optional: Google's new versus returning customer columns (needs a customer list or the Shopify integration), brand Search campaign data, audience signals per asset group.

Missing input: ask once. A report the account does not show is marked "not visible", never guessed.

## Before you start: the gates

1. **Money gate.** Gross profit per purchase known, so break-even return can be set. Fail: compute it with `store-meta-math` first.
2. **Tracking gate.** One primary purchase action with real values [MEA-0017] [MEA-0016]. If the account has several primary actions, the fix is one purchase goal, not a campaign-level override that hides the problem.
3. **Readiness gate.** Performance Max works best with a clean feed, working purchase tracking and about 30 to 50 conversions a month [GAD-0026]; new accounts do better on Search and Shopping first, adding it after about 100 purchases [GAD-0033]. Fail: the finding may be "too early".
4. **Cash gate.** The brand-exclusion test can lower reported return for weeks. The client states the dip they accept before it starts.

## Steps

### 1. Where the money goes

Show cost and conversion value per channel. In e-commerce most results should come from Shopping inventory (one agency says 80 to 90% [GAD-0037]). Flag YouTube, Display or Gmail share rising while return falls; in one case YouTube went from 2% to 10% and Gmail took about 10%, where an opened email counts as a click [GAD-0055].

Decision: if non-Shopping channels lose money after 60 days, recommend feed-only Performance Max (no uploaded assets, auto-created assets and final URL expansion off), which keeps spend on Shopping and Search [GAD-0048] [GAD-0006] [GAD-0014]. Keep full assets only where video and image placements show real store-side sales.

### 2. Who it reaches

- Share of cost and conversions on brand terms, from search terms or themes.
- Share of conversions from returning customers (Google columns, or Shopify new versus returning in the same weeks).

Brand takes a small share of search spend but a large share of conversions (about 11% of spend and 34% of conversions in one cited pattern [GAD-0003]), which inflates blended return. Flag "warm drift" when brand or returning customers make up a large share; practitioner default: over about 30% of the campaign's conversions, test it. Performance Max can drift to warm buyers on its own, especially after the target ROAS was raised [GAD-0037]: a higher target does not make the same people buy more, it makes Google enter fewer auctions, mostly warm ones.

### 3. Score each asset group out of 10

- **Coverage (4 points):** share of its products active and approved (2), and in stock (2). A stock-out on a product with a big share of spend can reset learning [GAD-0037].
- **Structure (2 points):** listing groups match one product type, with asset groups split by product type [GAD-0046].
- **Asset performance (4 points), full-asset groups only:** share of rated assets labelled Good or Best, leaving out Pending and Learning (2); enough assets of each type for the placements it uses, within Google's current limits (1); no asset labelled Low running for more than 4 to 6 weeks (1). If you run full assets, supply your own video; otherwise Google may make one automatically from your images.

Feed-only asset groups are scored on coverage and structure only, out of 6; ignore their poor ad strength rating [GAD-0014].

### 4. Settings check

| Setting | Pass |
|---|---|
| Brand exclusions | On, applied to the campaign, with brand served by its own exact-match Search campaign [GAD-0003] [GAD-0027] |
| Conversion goal | Purchase only, no micro-actions |
| Customer acquisition | "Bid higher for new customers" or "new customers only" set on purpose, with a customer list uploaded |
| Final URL expansion | Off unless the pages it picks were checked |
| Audience signals | Customer list and site visitors for new campaigns; after about 30 days of conversion data they matter little [GAD-0046] |
| Feed health | No top-spending product out of stock or disapproved |

### 5. Performance Max versus Standard Shopping

When both run, the higher ad rank wins the auction between them [GAD-0008]. Scaled side by side in one test, Performance Max held a higher in-platform return while Standard Shopping grew store revenue more [GAD-0045]. Judge both on store-side new-customer revenue.

On budget share the cards differ: a cap of 20 to 30% of Google budget [GAD-0026] fits accounts with strong Search and Shopping, but a feed-only Performance Max is effectively the Shopping campaign, so the cap does not apply. Store-side results set the share.

### 6. The brand-exclusion test

Goal: how many new customers Performance Max adds when it cannot take brand searches.

1. **Baseline, 2 to 4 weeks.** Weekly: Performance Max cost and conversions, brand Search cost and conversions, total orders, new-customer orders and new-customer revenue from Shopify.
2. **Change one thing.** Turn on brand exclusions in Performance Max; make sure a brand Search campaign is live so brand searchers still see an ad.
3. **Run 4 weeks**, or a full buying cycle if longer.
4. **Read** new-customer revenue / total ad spend (acquisition MER [MEA-0039]) and new-customer orders, before versus after. Performance Max's own return will drop; that is expected and not the verdict.
5. **Larger accounts** with enough orders per region: run it as a regional split instead [MEA-0050] [MEA-0033].

Verdict: new-customer orders hold or rise while reported return falls, so the old return was brand sales: keep the exclusion. New-customer orders fall and brand Search did not pick them up: Performance Max was adding real buyers; lift the exclusion and recheck.

## Checks before you hand it over

- Channel shares add up to campaign cost.
- Brand and returning-customer shares state their source.
- Each asset group shows its score with the parts.
- Every setting row is pass or fail with the evidence.
- The test plan names dates, the one change, the metric and the stop rule.
- No verdict rests on in-platform return alone.
- Nothing changes in the account without the client's yes; the test starts only after approval.

## Output

**One-screen summary first:** Performance Max spend, share on Shopping versus other channels, share from brand and returning customers, the top three fixes, and whether to run the brand-exclusion test, with dates.

**Table "Channel split":** Channel, Cost, Share of cost, Conversions, Conv. value, Store-side check, Call.

**Table "Asset groups":** Asset group, Type (feed-only or full), Products, Active and in stock, Coverage, Structure, Asset performance, Total, Fix.

**Table "Settings":** Setting, Current, Pass or fail, Change.

**Test plan:** start date, change, metrics, and a weekly readout table (Week, PMax cost, Brand Search cost, New-customer orders, New-customer revenue, Acquisition MER).

## Common mistakes

- **Trusting blended return.** Brand and returning buyers inflate it [GAD-0003].
- **Raising target ROAS to fix return.** It narrows delivery to warm buyers [GAD-0037].
- **Adding video and images by default.** They can pull spend off Shopping [GAD-0048]; add them only where they sell.
- **Fixing goal problems with overrides.** One purchase goal fixes the cause.
- **Judging the brand test on Performance Max return.** New-customer orders decide.
- **Starting Performance Max too early** [GAD-0033].

## Sources

- GAD-0003, GAD-0027: exclude brand from Performance Max; brand in its own campaign.
- GAD-0006, GAD-0014, GAD-0048: feed-only Performance Max keeps spend on Shopping.
- GAD-0008, GAD-0045: Performance Max versus Standard Shopping.
- GAD-0026, GAD-0033: when Performance Max is ready.
- GAD-0037: warm drift, feed and stock problems, raised targets.
- GAD-0046: asset groups by product type; signals fade after 30 days.
- GAD-0055: YouTube and Gmail click spikes.
- MEA-0016, MEA-0017: one purchase goal with real values.
- MEA-0033, MEA-0039, MEA-0050: acquisition MER and regional tests.

What makes this skill ours: the verdict rests on Shopify new-customer orders and acquisition MER, not Performance Max's own return; a step-by-step brand-exclusion test measures real new-customer lift; asset groups are scored on stock and product coverage as well as assets; and card conflicts on video, signals and budget share are settled by the store's own results.
