---
name: set-prices-from-costs-and-competitors
description: "A price for each product, worked out four ways and then decided: a floor from delivered cost, the ad cost to win a buyer and the profit target; the band rival products sell in, compared per unit and with shipping; where the store's proof lets it sit in that band; and the price ladder across the range. Each row ends with one recommended price, contribution per order, break-even ROAS, India MRP or US pre-tax price, and what to do when the floor sits above the market. Use when pricing a new product, repricing after cost or ad-cost changes, when margins are thin across the range, or before a launch or marketplace listing."
---

# Set product prices

**You get:** a price sheet with one row per product: delivered cost, price floor, rival price band per unit, proof level, recommended price, contribution per order and as a percentage, break-even ROAS, price per unit or per use, MRP (India) or pre-tax price (US), and change from today, plus a one-screen summary of the moves.

## When to use

- A new product needs a price before launch.
- Costs, shipping or ad costs have risen and margins are thin.
- Prices were set by doubling the cost and nobody has checked them since.
- The store is listing on a marketplace or entering a new market.

## Not for

- Testing two prices on live traffic: use `run-a-price-test`.
- Wholesale and retailer prices: use `build-wholesale-price-list-and-terms`.
- Watching rivals' prices week to week: use `track-competitor-prices`.
- Answering "too expensive" in chat: use `handle-price-objections-in-chat`.

## What you need

Required:

1. **Delivered cost per unit**: landed cost, delivery per order, payment fees, return and RTO allowance, from `build-sku-profit-sheet`.
2. **Ad cost per new customer**, from `store-meta-math` or `new-customer-cost-by-channel`. For a new store, a planning figure from current tests, marked as such.
3. **Profit target**: the contribution per order the owner needs to cover fixed costs and profit, as a percentage of price.
4. **Rival prices**: 3 to 8 close alternatives buyers would compare, with live URL, pack size, shipping and date checked.
5. **Proof the store has**: review count and rating, press, awards, test results, guarantee.

Optional: repeat rate and 90-day gross profit per customer (`cohort-repeat-and-ltv-analysis`), Amazon page-one prices, survey answers on price.

If rival prices cannot be checked on the day, mark them "unchecked" and do not decide on them. Changing prices in Shopify needs draft access (level 2) and a client yes; marketplace prices are set by the client or with their approval.

## Before you start: the gates

1. **Delivered cost per product is complete.** Product cost against price is not gross margin [MEA-0037]. Fail: build the cost rows first.
2. **Profit target is agreed.** Fail: use the store's current average contribution percentage and state it as the assumption in one line.
3. **Price rules for the market.** India: the selling price may not exceed the printed MRP, which includes all taxes [COG-6264]. US: prices show before sales tax. Feed prices must match the page exactly or Google disapproves products [GAD-6122].

## Steps

### 1. Work out the floor

Floor price = (delivered cost per unit + ad cost per new customer) / (1 minus payment fee % minus discount and return allowance % minus profit target %).

Illustrative: delivered cost 6 dollars landed plus 11 shipping, ad cost 30, fees 3%, allowances 6%, target 20%: floor = 47 / 0.71, about 66 dollars. This bottom-up method replaces doubling the unit cost, which ignores ecommerce costs and often leaves brands too thin to advertise [FIN-0012].

Two adjustments:

- **Repeat products:** if buyers reliably reorder, the ad cost can be spread over the first 90 days of gross profit, but only with the store's own cohort data [MEA-0024].
- **Entry products** meant to win customers for a higher-value range can sit below the floor on purpose; label them and cap how much of the range they make up.

### 2. Map the rival band

For each product, list rivals with: price, pack size, price per unit (per 100 g, per wash, per wear), shipping to a typical address, and rating. Record min, median and max per unit. For products with a valid GTIN listed in Merchant Center, its free Pricing tab shows a benchmark price from other retailers selling the same item [PRD-6482]; use it as one more input, not the answer.

Read the spread. A tight band signals a price fight where buyers judge mostly on price; a wide band means buyers weigh other things [AMZ-0001].

### 3. Place the product in the band

Decide position from proof, not from hope:

- **Above the median** only with visible proof the buyer can check: many reviews, a real difference they can see, press or awards, a strong guarantee.
- **At the median** with some proof.
- **Below the median** only if the floor allows it and the store wants to win on price.

A new brand that priced like luxury with no reviews sold a tenth of its plan until it moved to a price buyers would trust [OFF-0070]. If proof is thin, pricing near the median and adding a guarantee or gift usually beats a premium nobody believes.

### 4. Decide

- **Floor below the band:** choose the position from step 3.
- **Floor inside the band:** price at or above the floor, at the position the proof supports.
- **Floor above the band top:** do not just price at the floor. Either reshape the product (bigger pack, bundle, premium version with a real difference), lower the delivered cost, or drop it [FIN-0012].
- Products that can only sell at a very low price struggle to fund paid ads at all; one product-research card screens for retail prices of about 50 to 150 dollars for paid-led stores [PRD-0006]. Treat that as a test line, not a rule.

Round to the price endings buyers in that category expect (look at the rivals). Check that a single unit gives enough contribution to pay for its own shipping; if not, sell it as a multi-pack.

### 5. Build the ladder across the range

- Entry, core and premium products should step up in clear jumps, so the middle option looks sensible.
- Multi-packs show the per-unit saving, funded by shipping savings, not by margin.
- Check that no cheaper product makes a pricier one look poor value per unit.

### 6. Work out what each price means

For the recommended price: contribution per order, contribution %, break-even ROAS (price / contribution), and the conversion change a price rise could survive: a rise from P to P2 keeps the same total contribution if orders fall by no more than 1 minus (contribution at P / contribution at P2).

### 7. Plan the change

- **Raising prices:** announce to the list a week ahead with the reason, honour subscribers' current price for a set time or for good [OFF-0063], update feeds and ads the same day.
- **Cutting prices:** do it once, cleanly. Do not turn a cut into a fake "sale" against a price that will not return.
- Where the gain is uncertain, run `run-a-price-test` before changing everything.
- Trust lines near the price (reviews, guarantee) can lower price objections [LPG-0017].

### 8. India and US notes

- **India:** set MRP inclusive of GST on the pack and the page; the selling price may be lower but not higher. Add marketplace commission and closing fees per channel; a price that works on the store may lose money on a marketplace. Decide whether COD carries a fee and show it on the product page.
- **US:** compare rivals including shipping; Amazon referral fees rise with price, so price per channel.

## Checks before you hand it over

- Every row has a floor from delivered cost, ad cost and profit target.
- Rival prices are per unit, include shipping and carry a check date.
- Each position (above, at, below median) cites the proof that supports it.
- Rows where the floor sits above the band have a reshape, cost or drop decision.
- Contribution % and break-even ROAS are shown at the recommended price.
- India rows show MRP inclusive of GST, and selling price at or below it.
- Feed, page and ads change on the same day.
- No price was changed without a client yes.

## Output

**One-screen summary:** products to raise, hold, cut, reshape or drop; the average change in contribution per order; the three biggest moves and why.

**Price sheet** (`price-sheet.csv` or Google Sheet):

| SKU | Product | Delivered cost | Ad cost per new customer | Profit target % | Floor | Rival min / median / max per unit | Spread read | Proof level | Position | Recommended price | MRP or pre-tax price | Contribution per order | Contribution % | Break-even ROAS | Orders a rise can lose | Current price | Change | Action (raise, hold, cut, reshape, drop) | Date checked |

**Change plan:** dates, list announcement, subscriber rule, feed and ad updates, test candidates. **Assumptions:** the profit target, entry products and rival list used where not given, one line each.

## Common mistakes

- **Doubling the cost.** Step 1 builds the floor from every cost plus the ad cost.
- **Comparing sticker prices.** Step 2 compares per unit with shipping.
- **Premium without proof.** Step 3 ties position to checkable proof.
- **Pricing at the floor when the market will not pay it.** Step 4 forces reshape, cost or drop.
- **One price for every channel.** Step 8 prices per channel's fees.
- **Price change that misses the feed.** The gates and step 7 change feed, page and ads together.

## Sources

- FIN-0012: bottom-up pricing from profit target, ad cost and costs.
- MEA-0037: gross margin is delivered cost to the door.
- MEA-0024: gross profit per customer over cost per customer bands.
- AMZ-0001: tight versus wide price spread.
- PRD-6482: Merchant Center benchmark price per GTIN.
- OFF-0070: luxury launch price without proof failed.
- PRD-0006: very low prices struggle to fund paid ads.
- OFF-0063: grandfather subscribers at their price.
- LPG-0017: trust near the price lowers price objections.
- COG-6264: India MRP inclusive of all taxes.
- GAD-6122: feed price must match the page.

What makes this skill ours: the floor includes the ad cost to win a buyer, not just product cost; rivals are compared per unit with shipping; the position in the band is set by proof the buyer can check; and a floor above the market triggers a reshape, cost or drop decision instead of a price nobody will pay.
