---
name: track-competitor-prices
description: "A weekly sheet of rival prices, offers and stock for the store's key products, filled from free sources (rival product pages and checkout, marketplace listings, Merchant Center benchmark prices, Meta Ad Library), with delivered price per unit, change since last week and a written react rule for each product: hold, answer with value, pull ad spend, or match within a price floor set from gross profit. Separates short sales from real price moves, checks every reaction against margin and pricing law, and keeps a dated log. Use when rivals discount often, when Shopping or marketplace sales dip without a clear reason, or before setting sale prices."
---

# Track competitor prices and offers

**You get:** a weekly price and offer sheet for 5 to 20 key products against 3 to 5 named rivals, with change flags, a price floor per product, and one written decision per flagged line (hold, answer with value, pull spend, or match within the floor), ready to review in 15 minutes.

## When to use

- Rivals run frequent sales and the owner keeps asking whether to match.
- Google Shopping clicks or marketplace sales on a product drop with no change on the store's side.
- Before setting sale or launch prices, to see where the market sits.
- The store sells branded goods also sold by other retailers.

## Not for

- A deep look at one rival product: use `competitor-product-teardown`.
- Rival ads and messages across channels: use `cross-channel-competitor-map`.
- Setting the store's base price: use `set-prices-from-costs-and-competitors`.
- Working out how deep a discount can go: use `how-deep-can-we-discount`.

## What you need

Required:

1. **Product list:** the store's top products by gross profit, with SKU, GTIN if any, current price and gross profit per order from `build-sku-profit-sheet`.
2. **Rival list:** 3 to 5 named rivals per product, with product page URLs and marketplace listing links.
3. **Store's own weekly sales and traffic** per product: Shopify sessions and orders, Google Shopping clicks and click-through rate, marketplace sales.

Optional: Merchant Center account (free benchmark prices for products with GTINs); a paid price-tracking app (any; the free manual path below works for up to about 20 products).

Access: read only (level 1) to track. Any price change, sale or ad-spend change is drafted at level 2 and goes live only with the client's yes.

## Before you start: the gates

1. **Price floor per product.** Pass: the lowest price that still leaves the gross profit the store needs to pay for a buyer, from delivered costs [MEA-0037]. Fail: compute it first; without a floor, every rival sale looks like a reason to cut.
2. **Discount cost understood.** A 30% cut on a 40% margin order can push break-even ROAS from 2.5 to about 7 [OFF-0065]. Note each product's break-even before any reaction.
3. **Same item.** Compare like for like: same size, pack, model and condition. Note any difference.
4. **Collection method.** Read public pages by hand or with a tool that respects each site's terms. Do not log into rival accounts or place fake orders.

## Steps

### 1. Set up the sheet once

One row per product per rival per week. Fix the day and time of the check (for example Monday 10 a.m. store time), because prices change during sales.

### 2. Capture each week

For each product and rival:

- List price, sale price, any "was" price.
- **Delivered price:** add shipping, any payment method fee and taxes shown before payment. Compare like with like: US prices usually show before sales tax, while UK, EU and Australian prices show with VAT or goods and services tax included. Where a market has a printed maximum retail price, note it and the price shown [COG-6264].
- Price per unit or per use (per 100 ml, per wash, per month).
- Offer: code, bundle, gift, threshold, and the end date if shown.
- Stock: in stock, low, out, or pre-order; delivery promise.
- Merchant Center benchmark and the store's price gap for products sharing a GTIN [PRD-6482].
- Ads: whether the rival is running ads with this offer now (Meta Ad Library shows live ads only, so a capture each week is the history) [PRD-6483].

### 3. Flag changes

Flag a line when, against last week:

- Delivered price moved 5% or more (practitioner default, test it).
- A new offer, bundle or gift appeared.
- Stock went out or came back.
- The store's own clicks, click-through rate or orders on that product fell 20% or more (practitioner default, test it).

### 4. Classify each flag

| Type | Signs | Usual read |
|---|---|---|
| Short sale | end date shown, sale event, ads with deadline | Temporary; usually hold |
| Price reset | new list price, no end date, two weeks running | Real move; review |
| Stock-out | rival out of stock | Opportunity; push ads and stock, keep the price |
| Clearance | deep cut on old model | Usually hold |
| New entrant | new seller, low price | Check quality and history before reacting |

### 5. Decide the reaction

Apply in this order:

1. **Hold** when it is a short sale, the store's own sales did not fall, or the rival is out of stock (then push ads and stock instead).
2. **Answer with value** when the store's sales fell but the floor would be breached by matching: add a bundle, gift, guarantee or faster delivery, priced against gross profit, rather than cutting the headline price.
3. **Pull ad spend** on that product while the rival's cut lasts. On Google Shopping, a rival's sale pulls clicks fast; one advertiser cut spend on a product while a rival discounted it and restored it after, instead of matching at almost no margin [GAD-0034].
4. **Match within the floor** only after a price reset (two weeks running), with sales lost, and gross profit at the new price still above the floor. Small 5 to 10% cuts usually lose profit because units per order do not move [OFF-0014].

Never test two prices for the same product at the same time to "see what works" [CRO-0009].

### 6. Make any change honestly

- A "was" price must be a price the store really charged for a reasonable recent time [OFF-6145].
- No false urgency, drip pricing or bait and switch; show all-in prices. Ad standards and consumer rules in most markets ban these (FTC in the US, CMA and ASA in the UK, EU consumer law) [ADC-6147].
- Feed price and page price must match exactly in Merchant Center, or products are disapproved [GAD-6122]. Schedule the feed update with any site change.
- Marketplaces: check each platform's price parity and minimum price rules before changing.

### 7. Log and review

Each decision goes in the log with date, reason and owner. Every four weeks, review: which reactions protected gross profit, which rivals sale on a cycle (so the store can expect them), and whether any product should be repositioned rather than chased.

## Checks before you hand it over

- Every price is dated and linked, with the delivered price worked out.
- Like-for-like products only, or the difference noted.
- Every product has a floor price based on delivered costs.
- Each flag is classified and has one decision.
- No reaction drops a price below the floor.
- Any "was" price or urgency line passes the rule in each market the store sells to.
- Feed and page prices will match after any change.
- No price, sale or spend change goes live without the client's yes.

## Output

**One-screen summary for the week:** number of flags, what changed that matters, decisions taken (hold, value, pull spend, match), gross profit at risk, and anything for the owner to approve.

**Weekly sheet:**

| Week | Product | SKU | Rival | List price | Sale price | Delivered price | Per unit | Offer and end date | Stock | Benchmark gap | Live ads (y/n) | Change vs last week | Store clicks or orders change | Flag type | Decision | Floor price | Gross profit at decision | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

**Decision log:** Date, Product, Rival move, Decision, Reason, Approved by, Result four weeks later.

**Floor table:** Product, Delivered cost, Gross profit needed per order, Floor price, Break-even ROAS at floor.

## Common mistakes

- **Matching every sale.** Step 4 separates short sales from resets.
- **No floor.** Gate 1 sets one per product before tracking starts.
- **List price instead of price at the door.** Step 2 captures delivered price per unit.
- **Small cuts that lose money.** Step 5 prefers value or pulling spend.
- **Fake "was" prices in reply.** Step 6 checks the price history.
- **Feed and page out of sync after a change.** Step 6 schedules both.

## Sources

- MEA-0037: delivered gross margin.
- OFF-0065: deep discounts multiply break-even ROAS.
- OFF-0014: small discounts usually lose profit.
- PRD-6482: Merchant Center benchmark price and price gap.
- PRD-6483: Meta Ad Library shows live ads only.
- GAD-0034: pull Shopping spend while a rival discounts.
- CRO-0009: never test two prices for one product.
- OFF-6145: "was" prices must be genuine.
- ADC-6147: an ad standards code on false urgency and drip pricing.
- GAD-6122: feed and page prices must match.
- COG-6264: maximum retail price declaration rules.

What makes this skill ours: every product gets a price floor from gross profit before any rival is tracked; flags are sorted into short sales and real resets so the store stops chasing temporary cuts; pulling ad spend and answering with value come before cutting price; and each market's "was" price and all-in price rules sit in the same sheet.

## Selling in India

- Note the MRP printed and the price shown. Selling above MRP is not allowed, and MRP includes all taxes [COG-6264].
- Add any COD fee to the delivered price.
- The Advertising Standards Council of India (ASCI) bans false urgency and drip pricing [ADC-6147].
