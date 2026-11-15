---
name: store-results-drop-diagnosis
description: "Find out why an online store's ad results changed (return on ad spend fell, cost per purchase jumped, sales dipped) across Meta, Google and TikTok, starting from the store, not the ads. Proves the drop is real across 7, 14 and 30 days and is not a reporting delay, checks profit against the store's own break-even, then the store's conversion rate, order value, stock and site in Shopify, then tracking, then each channel weighted by spend. Names the cause (tracking break, stock-out, conversion-rate problem, creative fatigue, audience saturation, budget limit, season or platform shift) with the share of the drop it explains, a scored confidence, what not to do, and next steps the owner approves."
---

# Why did results change? A store-first diagnosis

**You get:** a one-screen answer naming the cause of the drop, its share and money at stake, with tables proving it is real, splitting store and channel effects, and next steps with a do-not list.

Most ad "problems" start outside the ad account: a sold-out size, a broken checkout, a price change, a reporting delay. This skill checks those first, then walks into the channels, and only names a cause it can show with numbers. For a deep drill inside one Meta account, it hands over to `store-meta-deep-dive`.

## When to use

- Return on ad spend or cost per purchase moved sharply for a week or more.
- Store revenue dipped and the owner wants to know whether ads are to blame.
- Several channels moved at once and nobody knows which started it.
- An early-warning alert fired and needs a cause before budgets change.

## Not for

- One area of a Meta account in depth: use `store-meta-deep-dive`.
- A general health score: use `paid-ads-health-score`.
- Ongoing daily alerts: use `ad-early-warning-watch`.
- New budgets once the cause is known: use `store-meta-budget`.

## What you need

**Required**

- Shopify Analytics by day for the drop window and the four weeks before: sessions, conversion rate, orders, average order value, net sales. Or the order export (Created at, Name, Total, Discount amount, Lineitem sku, Lineitem quantity, Customer ID, Financial status).
- Stock by SKU and variant for the window, and any stock-outs.
- Ad exports by day for eight weeks: Meta (campaign, ad set, ad, spend, impressions, reach, frequency, CPM, CTR link, 3-second plays, purchases, cost per purchase, attribution setting); Google (campaign, cost, clicks, conversions, value, plus conversions by conversion time); TikTok if used.
- What changed and when: Meta activity history, Google change history, and store changes (prices, offers ending, theme or app installs, shipping rules).
- Gross profit per purchase and target cost per purchase.

**Optional**

- GA4 traffic and landing page reports filtered to purchase; payment gateway and courier notes; survey answers.

**Missing input:** ask once. Without store-side data, give a low-confidence answer and name the export that would settle it.

**Access.** Level 1, read. Pausing, budget and setting changes need level 2 or 3 and approval.

## Before you start: the gates

1. **Break-even known.** Gross profit per purchase gives break-even cost per purchase and break-even return (order value / gross profit per purchase). A return of 1 is not break-even; it loses the product cost. Fail: compute it from costs; without costs, diagnose but do not rank fixes.
2. **Enough data.** At least 7 days after the change and a comparable 7 to 28 days before. Below about $1,000 a day of spend, daily swings are normal; judge on 7 days or more [ADC-0064]. Fail: wait or widen the window.
3. **Cash and capacity limits stated,** so next steps fit what the store can do this week.

## Steps

### 1. Prove the drop is real

- Compare the last 7, 14 and 30 days with the same lengths before, same weekdays and attribution setting. Only the 7-day window bad: likely noise, wait 48 hours and recheck. 7 and 14 both bad: real.
- Google credits conversions to the click date, so the last 3 to 4 days look weak; use conversions by conversion time [MEA-0051].
- In sale seasons short attribution windows lag long ones, so recent days look worse in real time [ADC-0046].
- Shopify books returns on the refund date, so a strong month can be followed by a false dip [MEA-0011].
- Revenue = sessions x conversion rate x order value; a 5% order value dip plus a 4% conversion dip compounding to about 10% is usually noise [MEA-0009].

If the drop disappears, stop and say so.

### 2. Is it still profitable?

Compare cost per purchase with break-even and target. If it is at or under target, a rise in CPM or CPC alone is not a problem; look only at frequency and fatigue signals and do not change budgets. If above target, run the full flow.

### 3. Check the store before the ads

Split the change into sessions, conversion rate and order value:

- **Sessions:** Shopify counts bots GA4 filters; cross-check before trusting a jump or drop [MEA-0012].
- **Conversion rate:** blended conversion rate falls on its own as cold spend rises [MEA-0015]; compare by channel and landing page, filtered to purchase.
- **Stock:** best sellers, sizes and colours out of stock; on collection pages the top six products and their size stock decide conversion [LPG-0069].
- **Site:** checkout errors, payment outages, slow pages, a new app or theme.
- **Offer and price:** an offer ended, a price changed, a shipping threshold moved.

If conversion rate fell on every channel at once, the cause is the site, not an ad account.

### 4. Match the pattern, in this order (first match wins)

Cost per purchase = CPM / (1,000 x CTR x conversion rate). Compare each part after vs before.

| # | Pattern | Signals | Likely cause |
|---|---|---|---|
| 1 | Tracking break | Platform purchases fall, store orders steady, spend and CTR normal | Pixel, server events, a test code left live [MEA-0005], consent banner change [MEA-0007], two Google primaries, attribution definition change [ADC-0027] |
| 2 | Stock-out | Advertised SKU or sizes below cover | Ads selling what the store cannot ship [ADC-0023] |
| 3 | Conversion-rate problem | CTR steady, conversion rate down on all channels | Site, offer or price (step 3) |
| 4 | Creative fatigue | Frequency up, CTR or hook rate down on the same ads, CPM flat | Cold ad frequency above 2 is the signal [MCR-0040] |
| 5 | Audience saturation | CPM up, reach flat, hook rate falling across all variations | Saturation [MCR-0052] |
| 6 | Budget limit | Spend raised recently, cost per purchase up | The extra customers cost more than average [ADC-0049]; a big raise can look bad for days [ADC-0056] |
| 7 | Season or platform shift | CPM up across several campaigns with no changes made | Auction or season; one campaign alone is not a platform shift |
| 8 | Rival price move | Shopping CTR down on one product | A rival discounted [GAD-0034] |
| 9 | Performance Max decline | Feed disapprovals, stock-outs, warm drift or a raised return target [GAD-0037] | Fix feed and target |

Read channels in order of spend share, starting from change history [MEA-0018]; a small channel's big swing rarely explains a store-wide drop.

### 5. Size each cause and score confidence

Estimate the share of the drop each cause explains (conversion rate down 18% explains most of a 22% rise in cost per purchase). Confidence starts at 50 points: add 15 if the pattern's signals all match, 10 if 7 and 14-day windows agree, 10 if a second source confirms (Shopify stock log, change history), 5 for complete data; subtract 10 for conflicting signals and 15 for missing or short data. 80 and over: act. 60 to 79: check one more thing first. Under 60: directional; rerun in 3 to 5 days. These weights are a practitioner default, test them.

### 6. Next steps and what not to do

- Fix the proven cause with the smallest targeted change; rebuilds reset learning and can start a spiral [GAD-0036].
- Stock: pause or raise targets on SKUs below lead-time cover.
- Fatigue: brief new concepts with `store-meta-concepts` or openers with `ai-presenter-video-openers`.
- **Do not:** raise budget on tired creative (it burns faster); change targeting to fix fatigue (it moves the problem); call a platform shift when only one campaign moved; pause a campaign still under target on early signals.
- Each step: what changes, who, access level, expected effect, and a monitoring line ("check frequency in 3 days; if still above 2, launch the new concepts").

### 7. Failed deliveries and payment problems

Check delivered and paid orders, not placed ones: a rise in failed deliveries, courier delays, a payment provider outage or a jump in declined cards can look like an ad problem. Compare the share of orders that failed delivery or payment, by payment method, before and after (practitioner default, test it). Where pay on delivery is offered, check its share and its refusal rate too.

## Checks before you hand it over

1. The drop survived step 1, with windows stated.
2. Profit was judged against the store's break-even, not a return of 1.
3. Store metrics and stock were checked before blaming ads.
4. Tracking was ruled in or out with platform vs store counts.
5. Each named cause has numbers, a share of the drop and a confidence score.
6. Next steps are targeted, include a "do not" list and a monitoring line, and need a yes.
7. A plain "creative is tired" answer would not beat this on evidence.

## Output

1. **One-screen answer:** cause, share explained, confidence, money at stake per week, first step.
2. **Is it real?** table: measure, 7, 14 and 30-day change, delay or noise check.
3. **Store split:** sessions, conversion rate, order value, stock events, site events.
4. **Channel table:** channel, spend share, cost per purchase before and after, CPM, CTR, conversion rate, frequency.
5. **Cause table:** pattern, evidence, share explained, confidence score.
6. **Next steps:** action, owner, access level, expected effect, monitoring line, do-not list.

## Common mistakes

- **Treating a return of 1 as profitable.** Gate 1 uses the store's break-even.
- **Blaming the ads for a sold-out size.** Step 3 checks stock first.
- **Reacting to Google's last three days.** Step 1 uses conversion time.
- **Calling a tracking break a demand drop.** Pattern 1 is checked first.
- **Rebuilding the account.** Step 6 makes the smallest proven fix.
- **Counting placed cash-on-delivery orders.** Step 7 uses delivered orders.

## Sources

- [ADC-0064]: daily swings are normal at low spend.
- [MEA-0051]: Google credits the click date.
- [ADC-0046]: sale-season attribution lag.
- [MEA-0011]: returns booked on refund date.
- [MEA-0009]: revenue = sessions x conversion rate x order value.
- [MEA-0012]: Shopify sessions include bots.
- [MEA-0015]: blended conversion rate falls as cold spend rises.
- [LPG-0069]: collection grid stock decides conversion.
- [MEA-0005]: a left-in test code hides conversions.
- [MEA-0007]: consent changes can stop the pixel.
- [ADC-0027]: Meta changed what counts as a click.
- [ADC-0023]: tie ad targets to stock.
- [MCR-0040]: cold frequency above 2 signals fatigue.
- [MCR-0052]: saturation shows as rising CPMs and falling hook rates.
- [ADC-0049]: the extra customers cost more than average.
- [ADC-0056]: a big budget raise looks bad for days.
- [GAD-0034]: falling Shopping CTR often means a rival discount.
- [GAD-0037]: Performance Max decline causes.
- [MEA-0018]: diagnose top-down, weighted by spend.
- [GAD-0036]: targeted fixes before rebuilds.

What makes this skill ours: profit is judged against the store's own break-even, never a return of 1; the store's conversion rate, stock and site are checked before any ad account; patterns are matched in a fixed order with tracking first; and each cause carries its share of the drop and a scored confidence, with cash-on-delivery stores judged on delivered orders.

## Selling in India

- In step 7, compare the COD share and its RTO rate before and after the drop, and check for a UPI outage on the days results fell.
