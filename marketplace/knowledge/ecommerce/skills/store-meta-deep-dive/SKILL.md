---
name: store-meta-deep-dive
description: "Find out why an online store's Meta (Facebook and Instagram) results changed, or answer one hard question about the account, by walking down from Shopify revenue to campaign, ad set and ad until one cause is proven. Separates a real demand change from a tracking change, new from returning customers, and auction, creative, page, stock and offer causes. Covers Advantage+ sales campaigns, catalog ads and creative overlap. Use when an owner says ROAS dropped, sales fell, costs jumped, or a campaign that worked stopped working."
---

# Meta deep dive for an online store

**You get:** a one-screen answer naming what changed and its proven cause, a bridge table, a walk-down table from campaign to ad, and a change log, saved as one dated file.

An audit looks at everything and ranks it. A deep dive chases one change to its cause. It ends with one cause, the evidence for it, how sure we are, and the next step, not with a list of 40 checks.

## When to use

- "ROAS dropped" or "sales fell" and the owner wants to know why.
- Cost per purchase jumped in one campaign while others held.
- An Advantage+ sales campaign or catalog campaign that worked has stopped working.
- A new product or offer launched and Meta results moved in an odd way.
- After a sale period, to separate the sale's effect from a real change.

## Not for

- A full account health check: use `store-meta-audit`.
- Fixing events, deduplication or match quality once the cause is tracking: use `store-meta-capi`.
- Settling a Meta versus Shopify sales gap that is stable: use `store-meta-attribution`.
- Deciding new budgets once the cause is known: use `store-meta-budget`.

## What you need

Required:
1. **Meta Ads Manager export** at ad level, by day, covering the change period and a comparison period of the same length and weekday mix: campaign, ad set, ad, delivery, attribution setting, amount spent, impressions, reach, frequency, CPM, link clicks, CTR (link), purchases, purchase conversion value, cost per purchase. Add 7-day click and 1-day view columns, and the audience segment breakdown (new, engaged, existing) for Advantage+ sales campaigns.
2. **Shopify order export** for both periods: Created at, Financial Status, Subtotal, Shipping, Discount Code, Discount Amount, Refunded Amount, Payment Method, Email, Lineitem sku, Lineitem quantity.
3. **Shopify sessions** by day for both periods (Analytics, Sessions over time), and the same from GA4 if installed.
4. **Activity history** in Ads Manager for both periods.
5. **Gross profit per purchase** and break-even ROAS from `store-meta-ads` or `store-meta-math`.

Optional: Commerce Manager catalog diagnostics; stock levels by SKU by week; price and offer changes; a post-purchase survey export.

If the activity history or Shopify export is missing, ask once; without them the cause stays "likely", never "proven".

**Access:** level 1 (read) for the whole job. Fixes are handed to the skill that owns them.

## Before you start: the gates

1. **Money.** Break-even ROAS is known, so "dropped" can be judged against break-even, not against last month's high. Fail: diagnose only, no "cut" or "scale" advice.
2. **Enough data.** At least 7 days in each period, since day-to-day swings under about $1,000 a day of spend are normal [ADC-0064]. Fail: say the change may be noise and set a read date.
3. **Comparable periods.** Neither period contains a sale, a stock-out week or a holiday the other lacks. Fail: pick new periods, or treat the sale as the first suspect.

## Steps

### 1. Define the change in one line

"Meta 7-day click ROAS fell from X to Y between [dates] and [dates], on spend of Z." Name the metric, both periods and the spend. If the owner's claim is vague, write it this way first and confirm.

### 2. Check that it is real on the store side

- Store revenue: Shopify Net sales plus Shipping charges, not Total sales [MEA-0010]. Returns land on the refund date, so a month after a big month can look weak when it is not [MEA-0011].
- Split it: revenue = sessions x conversion rate x order value. A 5% order value dip plus a 4% conversion dip that compound to about 10% is usually normal noise [MEA-0009].
- Shopify sessions include bots that GA4 filters, so check a session drop in GA4 before trusting it [MEA-0012].
- **Decision:** if store revenue held and only Meta numbers fell, go to Step 4. If store revenue fell too, go to Step 3.

### 3. Read the change history first

List every edit in both periods from the activity history: budgets, bid strategy, targeting, attribution setting, new or paused ads, catalog or product set changes. Add store changes: price, offer, shipping threshold, stock-outs, site changes. Work top-down: change history, then a cross-channel check weighted by spend, then revenue drivers, then the top five campaigns by spend [MEA-0018]. Most causes show up here.

### 4. Rule out a measurement change

Plot weekly Meta 7-day click purchases divided by Shopify paid orders. If that ratio moved, the cause is measurement, not demand: a dropped server event, a broken deduplication, a consent change, an attribution setting change. Stop and hand off to `store-meta-capi` or `store-meta-attribution`. Lost signal also lowers Meta's estimate of your conversion rate, so delivery can suffer even when sales are fine [MEA-0046].

### 5. Split new from returning customers

- Tag Shopify orders as new or returning by email. Compute acquisition MER (new-customer revenue / ad spend) for both periods [MEA-0039].
- Do not use Shopify's "returning customer rate" for this; it rises when acquisition slows [MEA-0014].
- For Advantage+ sales campaigns, read the audience segment breakdown. One ad's 12.84 ROAS fell to about 5 on new customers [ADC-0024]. A drop in ROAS can simply mean less spend went to existing customers, which may be good.

### 6. Walk down the account

Rank campaigns, then ad sets, then ads by spend in the change period. For the biggest movers, compare CPM, CTR (link), click to purchase rate, and order value. Read the pattern:

| Pattern | Likely cause | Check next |
|---|---|---|
| CPM up, CTR and conversion flat | Auction or season | Calendar; late December is cheap, early December is not [ADC-0043] |
| CTR down, frequency up on the same ads | Creative fatigue | Ad-level frequency on cold above 2 [MCR-0040]; new concepts launched |
| CTR fine, conversion down | Page, offer, price or stock | Landing page stock and sizes [LPG-0069]; revenue per 100 visitors [MEA-0047] |
| Purchases fine, value down | Product mix or discount | Which SKUs sold; discount codes used |
| Spend shifted to one ad set or ad | Budget pulled to one winner | Spend concentration [ADC-0014] |
| Spend fell, caps unchanged | Bid cap or ROAS goal too tight, or ads rejected | Delivery column, Account Quality |

Judge creative at ad set level more than ad level; ad-level credit is less reliable [ADC-0059].

### 7. Check store mechanics that generic reviews miss

- **Catalog and product sets:** out-of-stock or low-margin products still in the set; price or availability sync errors in Commerce Manager. When a SKU has fewer days of stock than its reorder lead time, raise its target or pause its ads [ADC-0023].
- **Catalog ad share:** a rising share of dynamic product ads lifts reported ROAS while new customers fall [ADC-0010].
- **Product economics:** cost-per-purchase bidding sends spend to the easiest-to-sell product, which may have the thinnest margin [ADC-0022].
- **Creative overlap:** near-duplicate ads are grouped and serve to the same people, so ten variants of one idea add little reach [MCR-0078]. A new colour or pose is not a new ad [MCR-0022]. Count concepts by persona, angle and offer.
- **Cash on delivery:** in COD markets, check whether the return-to-origin rate moved; Meta counts the order before delivery.

### 8. Name the cause

Write one cause, the evidence (two numbers at least), confidence (proven, likely, possible), and the runner-up cause in one line. Proven needs the change history or a clean before and after; likely needs the pattern in Step 6 plus one store-side number.

### 9. Say what to do and how to check it

One next step per cause, handed to the skill that owns it: `store-meta-capi`, `store-meta-attribution`, `store-meta-budget`, `store-meta-creative-review`, `store-meta-landing` or `store-meta-test`. Name the number that will show the fix worked and the date to read it, at least 7 days later. Any live change needs the owner's yes.

## Checks before you hand it over

1. The change is stated in one line with metric, both periods and spend.
2. Store-side revenue was checked with Net sales plus Shipping, split into sessions, conversion rate and order value.
3. The Meta to Shopify purchase ratio was checked before blaming demand or creative.
4. New and returning customers were split.
5. The cause has at least two pieces of evidence and a confidence label.
6. The runner-up cause is named.
7. The next step names its owner skill, its check number and a read date.

## Output

1. **One screen:** what changed (one line); the cause; evidence; confidence; runner-up; next step with owner skill and read date.
2. **Bridge table:** store revenue, sessions, conversion rate, order value, new-customer orders, ad spend, acquisition MER, Meta 7-day click purchases, Meta to Shopify ratio, for both periods with the change in %.
3. **Walk-down table:** level (campaign, ad set, ad), name, spend share both periods, CPM, CTR (link), click to purchase rate, order value, cost per purchase on 7-day click, verdict.
4. **Change log:** date, change, who, expected effect.

File: `meta-deep-dive-<date>.md`.

## Common mistakes

- **Starting at the ad level.** Steps 2 to 5 start from Shopify and the change history.
- **Blaming creative for a tracking break.** Step 4 checks the purchase ratio first.
- **Treating a lower ROAS from less existing-customer spend as a loss.** Step 5 splits customers.
- **Comparing a sale week with a normal week.** Gate 3 blocks it.
- **Calling one bad day a trend.** Gate 2 asks for 7 days.
- **Reading high CTR as a winner.** Step 6 checks click to purchase rate and order value.
- **Missing a stock-out.** Step 7 checks stock against product sets and landing pages.

## Sources

- [MEA-0009]: revenue as sessions x conversion x order value.
- [MEA-0010]: Net sales plus Shipping as cash collected.
- [MEA-0011]: returns land on refund date.
- [MEA-0012]: Shopify sessions include bots.
- [MEA-0014]: returning customer rate rises when acquisition slows.
- [MEA-0018]: top-down revenue drop diagnosis.
- [MEA-0039]: judge on acquisition MER.
- [MEA-0046]: lost signal lowers estimated action rate.
- [MEA-0047]: revenue per 100 visitors.
- [ADC-0010]: dynamic product ad ROAS inflated.
- [ADC-0014]: spend concentrates in few ads.
- [ADC-0022]: bidding favours cheapest-to-sell product.
- [ADC-0023]: tie ad targets to stock.
- [ADC-0024]: audience segment breakdown cut ROAS.
- [ADC-0043]: late December auction is cheapest.
- [ADC-0059]: judge at ad set level.
- [ADC-0064]: read on 7 days at low spend.
- [LPG-0069]: landing grid stock decides conversion.
- [MCR-0022]: a new colour is not a new ad.
- [MCR-0040]: cold ad-level frequency above 2.
- [MCR-0078]: near-duplicates share one entity.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill does that the open-source one did not: diagnoses one change to one proven cause instead of re-running a 130-check scorecard; starts from Shopify revenue and the change history and rules out a tracking change before blaming demand or creative; splits new from returning customers and checks store causes such as stock-outs, catalog sets, product mix and cash on delivery returns; drops the unsourced "60% similarity score" and fixed CTR and EMQ pass marks in favour of concept counts and the store's own break-even.
