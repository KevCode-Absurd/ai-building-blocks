---
name: launch-amazon-ppc
description: "A launch build sheet for Amazon Sponsored Products: four campaigns (auto research, exact, phrase discovery, product targeting) with ad groups, keywords, negatives, bids worked back from the product's profit, daily budgets, a capped launch spend the client signs off, and a day-by-day check list for the first 14 days with the rule for each decision. Bids come from gross profit after Amazon's fees and the real conversion rate, not from Amazon's suggested bid. Covers Amazon.com and Amazon.in. Use when a product is newly listed and ready for ads, when a first PPC attempt burned money with no structure, or when relaunching a product after a listing rebuild."
---

# Amazon PPC launch

**You get:** a build sheet for 4 Sponsored Products campaigns ready to create paused in the Amazon Ads console, with every keyword, negative, bid and budget written down, a launch spend cap for the client to approve, and a 14-day check list with the action rule for each day.

## When to use

- A product has a finished listing and needs its first ads.
- A first launch spent money across one broad auto campaign with no clear result.
- A listing was rebuilt and the product is relaunching.
- The store is adding Amazon.in or Amazon.com as a new marketplace.

## Not for

- The weekly routine after launch (moving winners to exact, blocking waste): use `harvest-amazon-search-terms`.
- Writing or fixing the listing itself: use `write-amazon-listing` first.
- Ads on the store's own site traffic: use `build-meta-campaign-launch-sheet` or `google-ads-first-90-days`.
- Deciding the store's total ad budget across channels: use `set-ad-budget-from-profit-target`.

## What you need

Required:

1. **Gross profit per unit before ads**: price minus landed cost, referral fee, fulfilment fee, storage and a returns allowance, from `build-sku-profit-sheet`.
2. **Keyword map** from `write-amazon-listing`: buyer phrases grouped by meaning.
3. **Conversion rate**: unit session percentage from Business Reports (Detail Page Sales and Traffic by child item), last 30 days. If the product is new, use 10% as a planning figure (practitioner default, test it) and replace it after 14 days.
4. **Stock**: units at Amazon plus inbound, and the reorder lead time.
5. **The client's launch spend cap**: the most they will spend on ads in the first 14 days, as money they accept may not come back.

Optional: rival ASINs with their price and rating, Brand Analytics search terms, past campaign exports.

Building the campaigns needs draft access (level 2) in the Amazon Ads console; build them paused. Turning them on and the launch spend cap need the client's yes.

## Before you start: the gates

1. **Profit sets a bid that can buy clicks.** Break-even ACOS = gross profit per unit before ads / price. Highest affordable cost per click = price x target ACOS x conversion rate, because cost per sale = cost per click / conversion rate [MEA-0019] [GAD-0038]. Example (illustrative): price 30, gross profit 12, break-even ACOS 40%, conversion 10%, so the most a click can cost at break-even is 1.20. If that figure is below Amazon's suggested bids for the main phrases, ads cannot pay. Low-price products hit this wall first: at 8 a unit and 1 a click, two or three clicks wipe out the profit [AMZ-0004]. Fail: raise the price, sell a multi-pack, or skip ads and say so.
2. **Stock lasts.** Days of cover must exceed 14 launch days plus the reorder lead time. If cover is shorter than lead time, ads would sell out the product and the rank goes with it [ADC-0023]. Fail: cut the launch budget to what stock can carry, or wait.
3. **The listing is ready.** Title, bullets, images and A+ (if registered) are final. A listing with no reviews converts worse; enrol in Vine first if eligible (`get-early-amazon-reviews`).
4. **The offer is featured.** Sponsored Products ads show only while the offer holds the Featured Offer; check its status in the ad's eligibility column and in `win-the-buy-box` if it is lost.
5. **Cash.** The launch cap is in the 13-week cash plan (`build-13-week-cash-forecast`). Fail: lower the cap.

## Steps

1. **Set the targets.** Write break-even ACOS and the launch target ACOS. A launch may run above break-even only inside the approved cap and only for 14 days; write the planned loss in money, not as a percent.
2. **Choose the bidding strategy.** Use dynamic bids down only at launch, so the bid you enter is the most you pay. With up and down, Amazon can raise a bid by up to 100%, so a click can cost double what you entered [AMZ-6447]. If the client wants up and down on exact keywords later, enter half the affordable cost per click.
3. **Campaign 1, auto research.** One ad group, the product's ad. Bid by targeting group, not one default bid: close match at the affordable cost per click; substitutes at 75% of it; loose match and complements at 50%, or off if the cap is small (practitioner default, test it). Job: find search terms and rival pages you did not know about.
4. **Campaign 2, exact.** One ad group with 5 to 15 phrases from the keyword map that name the product type plus its deciding feature. These are the terms the listing should rank for. Bid at the affordable cost per click. Products described in many ways give you more cheap long-tail phrases for this list [AMZ-0003].
5. **Campaign 3, phrase discovery.** 3 to 8 root phrases (two or three words each) in phrase match, bid at 70% of the affordable cost per click (practitioner default). Job: find longer phrases buyers use.
6. **Campaign 4, product targeting.** 10 to 20 rival ASINs where the product's price is equal or lower and the rating is not far below. Start at 60% of the affordable cost per click; turn on from day 8 if the listing has fewer than 5 reviews (practitioner default), because buyers on a rival page compare reviews first.
7. **Add negatives so campaigns do not compete.** Add every exact keyword as a negative exact in campaigns 1 and 3. Add obviously wrong words (other product types, "free", "used", "repair" if irrelevant) as negative phrase in campaigns 1 and 3.
8. **Set budgets from data needs.** A keyword needs roughly 2 / conversion rate clicks before it can be judged (at 10% conversion, 20 clicks; practitioner default, test it). Daily budget per campaign = (keywords x clicks needed / 14 days) x bid. Add the four and compare with the cap / 14. If over, cut keyword count, not bids. Put about half the cap on exact, a quarter on auto, the rest split (practitioner default).
9. **Name everything.** Format: `SP | ASIN or SKU | type | match | date`, so reports sort cleanly.
10. **India notes (Amazon.in).** Bids and budgets in rupees with the same formulas. For cash-on-delivery orders, use the delivered share in the conversion rate, since refused orders do not pay: affordable cost per click x delivered share. Ad invoices add GST; a GST-registered seller can usually claim it as input credit, confirm with the accountant. Add Hindi terms written in Latin letters to campaign 3 if the keyword map has them.
11. **US notes (Amazon.com).** Click prices rise in October to December; re-run the affordable cost per click before Q4 and do not launch a new product into the peak unless the cap allows for it (practitioner default).
12. **Hand over for approval.** Show the build sheet, the cap and the planned loss. Create campaigns paused. Switch on only after the client's yes.

## The first 14 days

| Day | Check | Rule |
|---|---|---|
| 1 | All 4 campaigns serving, impressions on each | No impressions after 24 hours: raise bids 20% on that campaign once, or check the Featured Offer |
| 3 | Search term report, spend vs daily budget | Add clearly irrelevant terms as negative exact; a campaign out of budget by noon gets +20% budget within the cap |
| 5 | Stock and Featured Offer | Days of cover below lead time: lower bids or pause campaigns 3 and 4 [ADC-0023] |
| 7 | Clicks per keyword and target | Keyword past its click threshold with no order: cut bid 30% or pause. Order at ACOS under target: hold |
| 10 | Search terms with 2 or more orders | Note them for exact; move them on day 14, not before |
| 14 | Full read | Hand over to `harvest-amazon-search-terms`: harvest winners, negate waste, set new bids from real conversion rate |

Throughout: track ad spend / total sales (TACOS) from Business Reports beside ACOS, since a launch is meant to lift organic sales too. Stop and ask the client if spend runs 20% ahead of plan or a policy warning appears.

## Checks before you hand it over

- Break-even ACOS and affordable cost per click are shown with the inputs.
- Bidding strategy is down only, or up and down with entered bids halved.
- Every exact keyword is a negative exact in auto and phrase campaigns.
- Daily budgets add up to no more than cap / 14.
- Stock cover exceeds 14 days plus lead time, or the plan says how it is limited.
- All campaigns built paused; the cap and planned loss are in money.
- Day 1 to 14 rules are written, with owners.

## Output

**One-screen summary:** product, marketplace, break-even ACOS, affordable cost per click, launch cap, planned loss, the 4 campaigns with daily budgets, and the day 14 decision date.

**Build sheet:**

| Campaign | Ad group | Targeting type | Keyword or ASIN | Match | Bid | Strategy | Daily budget | Negatives |
|---|---|---|---|---|---|---|---|---|

**Maths block:** Price | Gross profit before ads | Break-even ACOS | Conversion rate (source) | Affordable cost per click | Clicks needed per keyword | Keywords | Budget needed | Cap.

**14-day log:** Day | Check done | Finding | Action taken | Approved by.

## Common mistakes

- **Bids copied from Amazon's suggested bid.** Step 1 works bids back from profit and conversion.
- **Up and down bidding at launch.** It can double the cost per click; step 2 uses down only.
- **One auto campaign and nothing else.** Step 3 to 6 split research from proven terms.
- **Campaigns bidding against each other.** Step 7 adds exact keywords as negatives elsewhere.
- **Judging a keyword on 5 clicks.** Step 8 sets a click threshold from the conversion rate.
- **Launching into a stockout.** Gate 2 and day 5 tie bids to stock cover.

## Sources

- AMZ-6447: dynamic bids up and down can raise bids up to 100%.
- AMZ-0004: low-price products cannot carry click costs.
- AMZ-0003: products described in many ways give long-tail terms.
- MEA-0019: cost per sale = cost per click / conversion rate.
- GAD-0038: click price matters only against conversion rate.
- ADC-0023: tie ad targets to stock cover versus lead time.

What makes this skill ours: bids are worked back from gross profit after Amazon's fees, not from suggested bids; the launch loss is a capped sum the client signs; keyword verdicts wait for a click count set by conversion rate; and cash-on-delivery refusals in India cut the affordable bid.
