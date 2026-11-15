---
name: find-trending-products
description: "A shortlist of five to ten rising products for the store to test, pulled from free trend sources (Google Trends, Merchant Center Popular products, Amazon, Walmart, Etsy and other marketplace best-seller lists, TikTok and Instagram where available) and screened for real margin: each survivor shows its rising signal, how long it has been rising, rivals, landed cost estimate, gross profit per order and whether that can pay for a buyer. Filters out fads, products already past their peak, hard-to-ship or regulated items and anything that only works at a loss. Use when a new store is choosing a first product, when an existing store wants fresh candidates, or before a supplier sourcing trip."
---

# Find trending products

**You get:** a ranked shortlist of 5 to 10 rising products, each with its trend evidence, rival count, estimated landed cost, gross profit per order and a pass or fail on whether that profit can pay for a buyer, ready to hand to a demand test.

## When to use

- A new store needs its first product and has no sales data yet.
- An existing store wants new candidates in its category every quarter.
- The owner has seen a product "everywhere" and wants to know if it is rising or already done.
- Before a sourcing trip or supplier call, to arrive with a short list.

## Not for

- Checking whether a whole niche is big enough and winnable: use `niche-size-and-competition-check`.
- Picking the next product from the store's own buyers and repeat data: use `plan-product-line-extension`.
- Proving buyers will pay before buying stock: hand the shortlist to `validate-demand-before-buying-stock`.
- Studying one rival product in depth: use `competitor-product-teardown`.

## What you need

Required:

1. **Store's market and category** (the countries it sells in; the categories it will or will not sell).
2. **Price band and cash limit** for a first stock order.
3. **Delivered cost inputs:** typical shipping cost by weight band, payment fee, expected return and failed-delivery rate. If missing, use the store's courier rate card or carrier website and say so.

Optional: a Merchant Center account (free, gives the Popular products tab); Amazon, Walmart or other marketplace seller access; a Google Ads account with billing set up (needed for Keyword Planner ideas); a TikTok or Instagram account for browsing.

Access: read only (level 1). Nothing is bought, ordered or published in this skill.

## Before you start: the gates

1. **Margin maths ready.** Pass: the store can compute gross profit per order from landed cost, shipping, fees and returns [MEA-0037] [FIN-0007]. Fail: write the cost inputs the screen will need and use carrier and supplier quotes.
2. **Cash and capacity.** Pass: the owner has named the most they can spend on a first order and who will pack. Fail: screen only products under that limit and small enough to pack in-house.
3. **Market rules.** Note products the store cannot sell: regulated food, supplements, cosmetics, toys, electricals and anything needing FDA, CPSC or FCC rules in the US, CE or UKCA marking in the EU and UK, or your market's own safety marks. These fail the screen unless the store already holds the approvals.
4. **Mode.** This skill screens products for picking a new line. For a store adding to an existing range, switch to `plan-product-line-extension`.

## Steps

### 1. Pull rising candidates from at least three free sources

Collect 30 to 60 raw candidates, noting the source and date for each:

- **Google Trends.** Search category words and compare over 5 years and 12 months in the target country. Trends scores are a share of a sample of searches scaled 0 to 100, so they show direction and season, never how many people search [PRD-6480].
- **Merchant Center Popular products.** Free, by category and country (many countries included), with brands gaining popularity and price ranges, refreshed weekly [PRD-6481]. Internal use only: do not publish its data.
- **Marketplace best-seller and movers lists.** Amazon Best Sellers and Movers and Shakers in each country, Walmart, Etsy and eBay trending lists, and big regional marketplaces (Zalando or bol in Europe, Mercado Libre in Latin America). Note rank and the date.
- **Social.** TikTok Creative Center top products and TikTok Shop where it runs; where TikTok is not available, use Instagram Reels and YouTube Shorts search instead. Note how many separate creators post the product, not one viral video.
- **TikTok Shop product data** (where the shop runs; the research tools are usually paid). Read the 30 and 180 day revenue graphs and drop anything falling straight down or that peaked months ago. Keep products whose revenue comes from videos rather than live streams. Want the best video 7 to 14 days old and revenue spread across 3 to 5 recent videos; one old video carrying 90% or more of the revenue is a drop. Products priced around 9.99 are bought on price alone and rarely fund paid ads elsewhere. These are one practitioner's rules, so test them, and treat a TikTok Shop win as a lead for other channels, not proof.
- **Buyer forums.** Reddit and category forums for "what do you use for" threads.

Paid spy tools are optional. Everything here can be done free.

### 2. Sort rising from spiking

For each candidate, read the 5-year and 12-month curves:

| Shape | Read | Action |
|---|---|---|
| Steady rise for 12 months or more | Trend | Keep |
| Rising with a yearly peak | Seasonal | Keep only if cash can carry the off season |
| One sharp spike, then fall | Fad or past peak | Drop |
| Flat and high | Established | Keep only with a clear angle (step 5) |
| Spike in the last 4 weeks only | Too early to read | Park and recheck in a month |

A single viral hero decays; one brand's main product peaked and fell faster than its other products grew [PRD-0003]. Trends alone never makes the shortlist.

### 3. Screen the product itself

Drop a candidate that fails any of these:

- Can win new buyers on its own, not only as an add-on; check whether it lifts repeat purchase and could sell on marketplaces too [PRD-0012].
- Ships safely and cheaply in a parcel; repeat use or gifting demand is a plus [PRD-0013].
- Not fragile, oversized or perishable unless the store is set up for it.
- Hard to find in local shops. If buyers can pick it up at a nearby store or grocer, online demand is weaker.
- Can launch as one SKU (one size, one colour). Each extra size or colour adds stock cost, storage and pick mistakes before the product has proved itself.
- Sold in a price band that can fund paid acquisition: candidates that only sell at very low prices struggle at launch [PRD-0006]. Where many orders are paid on delivery, check the band against refusals: low prices attract more refused parcels.
- Described by buyers in many ways (for example slim, waterproof, for men), which leaves cheaper long-tail search terms [AMZ-0003].

### 4. Estimate the margin and the room to pay for a buyer

For each survivor:

1. Supplier price from two quotes or marketplace wholesale listings (label as estimate).
2. Landed cost: add freight, duty and packaging; use `calculate-landed-cost-per-unit` when the shortlist is final.
3. Gross profit per order = expected selling price minus landed cost, shipping, pick and pack, payment fee and return and failed-delivery allowance [MEA-0037].
4. Cost per buyer floor = expected cost per click divided by expected conversion rate [MEA-0019]. Use 2% conversion as a starting assumption and the store's own cost per click if it has one; label both as assumptions.
5. **Pass:** gross profit per first order at or above the floor. **Hold:** below the floor but a repeat product where 90-day value may cover it. **Fail:** below the floor and one-off.

The source playbooks use flat rules such as "three times product cost" or a fixed dollar margin. Those ignore shipping, returns and ad costs, so this skill uses the delivered margin against the cost per buyer instead.

### 5. Check the rivals and the angle

- Count active sellers on the marketplace and stores running Meta ads for it in the Ad Library, which shows only ads running now [PRD-6483]. Run length is a proxy, never proof of profit.
- On Amazon, beatable rivals look like: listings with 300 reviews or fewer, at least 8 months old, few images [AMZ-0006]; current US sellers making $5,000 to $20,000 a month suit a small first order, while a $30,000-a-month product needs months of stock and heavy launch spend [AMZ-0005].
- Write the one angle the store would use: a buyer group or use the rivals ignore. If there is none and the rivals are many, drop it.

### 6. Rank and hand over

Score each survivor 1 to 3 on: trend shape, delivered margin against cost per buyer, rival room, ease of shipping, cash needed. Margin has a veto: a fail on step 4 never makes the list. Rank by total, show the top 5 to 10, and name the first one to test with one line on why.

## Checks before you hand it over

- Every candidate has at least two independent sources, each with a date.
- Every TikTok Shop pick shows where its revenue comes from (video or live) and how spread it is across videos.
- No product is on the list from Trends or one viral video alone.
- Every gross profit figure uses delivered costs and is labelled as an estimate where quotes are not in.
- Cost per click and conversion assumptions are stated, not hidden.
- Regulated or uncertified products are flagged or removed.
- Each pick is available in the store's markets (no TikTok-based picks for a store that only sells where TikTok is not available).
- No Merchant Center data is copied into anything public.

## Output

**One-screen summary:** the top pick and why, the margin against cost per buyer, and the test to run next. Add a second pick to the same test only if the budget funds both reads.

**Shortlist table:**

| Rank | Product | Market | Sources and dates | Trend shape | Est. landed cost | Selling price | Gross profit per order | Cost per buyer floor | Margin result | Active rivals | Angle | Cash for first order | Score |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Dropped list:** Product, Reason dropped (fad, margin fail, shipping, regulation, crowded with no angle).

**Recheck list:** products parked as "too early", with the date to look again.

## Common mistakes

- **Treating a Trends score as volume.** Step 1 reads Trends as direction only.
- **Buying the spike.** Step 2 drops one-spike curves.
- **Margin from product cost alone.** Step 4 uses delivered costs and the cost per buyer.
- **One source.** The checks require two dated sources per pick.
- **Trusting one viral video.** Step 1 drops products where one old video carries the revenue.
- **Picking what the store's buyers cannot buy or the store cannot legally sell.** Gate 3 and the checks remove them.
- **No angle in a crowded product.** Step 5 drops it.

## Sources

- PRD-6480: Google Trends is a 0 to 100 relative scale, not volume.
- PRD-6481: Merchant Center Popular products by category and country.
- PRD-6483: Meta Ad Library shows ads running now.
- PRD-0003: viral heroes decay.
- PRD-0006: low-price products struggle to fund paid launch.
- PRD-0012: screen for new-customer pull, repeat and marketplace fit.
- PRD-0013: parcel-friendly, repeat and gifting screen.
- AMZ-0003: products described many ways leave long-tail terms.
- AMZ-0005: target seller revenue band for a first order.
- AMZ-0006: signs of beatable Amazon rivals.
- MEA-0037: delivered gross margin.
- MEA-0019: cost per buyer floor.
- FIN-0007: what belongs in cost of goods.

What makes this skill ours: free first-party sources replace paid spy tools; every trend needs a second dated source; the margin screen compares delivered gross profit with the cost to win a buyer instead of a flat markup; and platform gaps by country and refusals on pay-on-delivery orders change which picks survive.

## Selling in India

- Use Flipkart and Myntra category best-sellers, and Meesho for low-price demand. Note rank and the date.
- TikTok is not available in India, so use Instagram Reels and YouTube Shorts search, and make no TikTok-based picks for an India-only store.
- Products needing BIS marks fail the screen unless the store holds them.
- Check the price band against COD behaviour: low prices attract more refusals, so include the RTO rate in gross profit per order.
