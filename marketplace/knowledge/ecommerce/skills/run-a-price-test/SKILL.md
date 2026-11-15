---
name: run-a-price-test
description: "A one-page price test design that is safe for buyers and the brand: which of four designs to use (a split test of offer structure such as pack sizes or tiers, a timed switch with comparison products, a market-by-market price, or a new variant at a new price), never two prices for the same product to different visitors at the same time. Sets the profit line the new price must beat, the main metric (contribution per visitor, not conversion), guardrails for refunds, returns, failed deliveries and complaints, the run time in whole weeks from the store's own order volume, the stop rule, and how to read the result on profit. Use before raising or lowering a price, when the team wants to 'A/B test the price', or when a price change needs proof before it rolls out."
---

# Run a price test

**You get:** a one-page price test plan: the question, the design chosen and why, the variants with exact prices and terms, the profit line to beat, main metric and guardrails, run time and order count needed, the stop rule, set-up steps for approval, and a filled reading template that turns the result into contribution per visitor and per month.

## When to use

- The team believes the price is too low (or too high) and wants proof before changing it.
- Costs rose and the owner wants to know if buyers will accept a higher price.
- A new pack size, tier or premium version could change what buyers pay.
- Someone has asked for an "A/B test on the price" and it needs to be done safely.

## Not for

- Setting the price in the first place: use `set-prices-from-costs-and-competitors`.
- Tests of page layout, copy or images: use `design-store-ab-test`.
- Reading a finished split test: use `read-store-ab-test-result` (this skill's reading template covers timed and market designs).
- Testing an offer inside Meta ads: use `store-meta-test`.

## What you need

Required (read access):

1. **Shopify order export**, 90 days: Created at, Lineitem sku, Lineitem quantity, Lineitem price, Discount Amount, Payment Method, Shipping Country, refunds.
2. **Sessions by product page** (Shopify Analytics or GA4) for the same window.
3. **Delivered cost per unit** from `build-sku-profit-sheet`.
4. **Return, refund and failed delivery rates** for the product.

Optional: a list of similar products to act as a comparison group, market list (Shopify Markets), testing tool, rival prices from `track-competitor-prices`.

Setting up variants, market prices or a testing tool needs draft access (level 2). The test starts only after the client approves the plan and the exact prices.

## Before you start: the gates

1. **No same-product, same-time price split.** Showing two prices for one product to different visitors at once ended in refunds and a public apology for one large retailer; test structure, framing or a separate offering instead [CRO-0009]. Fail: change the design.
2. **Order volume.** Under about 30 orders a month, do not test; change the price with care and watch. From 30 to 300, only big swings can be read [CRO-0011]. Fail: pick a bigger change or a design that pools products.
3. **Costs known** so the profit line can be computed. Fail: stop.
4. **Price consistency.** Feed, page, cart and ads must show the same price at any moment [GAD-6122]; a catalog sale price must sit below the regular price [ADC-6047]. Never above any legal maximum or printed retail price where the market has one.

## Steps

### 1. Write the question and the profit line

Question: "If we move product X from price P to P2, does contribution per visitor rise?"

Profit line: at P2, orders can fall by up to 1 minus (contribution per order at P / contribution per order at P2) and still break even. Illustrative: contribution 300 at P and 400 at P2 means orders may fall 25% before the raise loses money. Write this number down before the test; it is what the result is judged against.

### 2. Choose the design

| Design | How it works | Use when |
|---|---|---|
| A. Offer-structure split | Visitors are split between two offers that differ in pack size, tier set, bundle or framing, each with one fixed price | the question is "what will buyers pay for more" |
| B. Timed switch with comparison products | Everyone sees P for 2 weeks, then P2 for 2 weeks, then P again; similar unchanged products show the background trend | one product's price, enough orders, stable season |
| C. Market price | Each country or market has one price (for example via Shopify Markets) | the store sells in several markets with similar buyers |
| D. New variant | Launch a new size, version or premium edition at the new price beside the old one | testing willingness to pay for a real difference |

Default to A or D; both keep one price per product at any time. Use B when the change is to the core price. Use C only when the markets are alike enough to compare.

### 3. Set the metric and guardrails

- **Main metric:** contribution per visitor = (orders x contribution per order) / product page sessions. Pick the winner by profit per session, not order value or conversion [OFF-0015].
- **Guardrails:** refund and return rate, failed delivery rate (where pay on delivery is offered), price complaints in chat and reviews, add-to-cart rate, share of pay-on-delivery orders.
- **Later check:** repeat rate at 60 and 90 days; price changes can show their real cash effect only after 60 to 180 days [FIN-0029].

### 4. Size it

- For a split (design A): about 1,600 conversions per variant are needed to detect a 10% lift, 420 for 20% and 190 for 30% at a 2% baseline [CRO-0005]. Revenue or profit per visitor needs far more traffic than conversion rate, roughly six times [CRO-0014]. If the store cannot reach the count, test a bigger difference or use design B or D.
- For a timed switch (design B): at least two full weeks per period, so each covers whole weekly cycles [CRO-0015], and three periods (P, P2, P) so a trend is not mistaken for a price effect.
- Write the end date before launch. Do not stop the first time the result looks good; peeking can push false winners from 5% to about 26% [CRO-0017].

### 5. Set it up (for approval)

- Design A: two product or bundle offers, one per variant, split by a testing tool or by separate landing pages with an even ad split. Each visitor sees one offer for the whole test.
- Design B: dated price changes in Shopify, feed and catalog updates scheduled the same hour, ads that name the price updated.
- Design C: market prices set and checked at checkout for each market.
- Design D: new variant or product with its own SKU, images and copy; the old one stays unchanged.
- Support gets a short answer for "why did the price change". If a lower price is tested after buyers paid more, decide in advance whether to refund the difference; one brand did this after a launch price cut [OFF-0070].

### 6. Read the result

For design A, use `read-store-ab-test-result`.

For design B, fill the template:

| Period | Price | Sessions | Orders | Conversion | Contribution per order | Contribution per visitor | Comparison products' contribution per visitor |
|---|---|---|---|---|---|---|---|

Effect = change in the test product's contribution per visitor minus the change in the comparison products over the same periods. If the comparison products moved just as much, the price did nothing.

Verdict rules:

- **Win:** contribution per visitor up in both P2 periods against the comparison, orders fell less than the profit line, guardrails flat.
- **Lose:** contribution per visitor down, or orders fell more than the profit line.
- **Unclear:** mixed periods or too few orders; keep the safer price and retest with a bigger change.

Turn the result into money per month: effect per visitor x monthly product sessions.

### 7. Market notes

- **Pay on delivery:** where offered, price changes can shift buyers between prepaid and pay on delivery; wait 10 to 14 days after the last order before reading failed deliveries. Keep any price printed on the pack unchanged during a test unless the pack is reprinted.
- **US, UK, EU and beyond:** do not later advertise the higher price as a "was" price unless it was genuinely the regular price for a real period [OFF-6145]; in the EU, a price cut is shown against the lowest price of the prior 30 days.

## Checks before you hand it over

- No design shows two prices for the same product to different visitors at once.
- The profit line (largest order drop the new price can survive) is written before launch.
- The main metric is contribution per visitor; guardrails include refunds and failed deliveries.
- Run time is in whole weeks with a fixed end date; order count needed is stated.
- Feed, page, cart and ads change together.
- Support has an answer and a refund rule.
- Nothing goes live without the client's yes on the plan and prices.

## Output

**One-screen summary:** the question, design and why, prices, profit line, run time, end date, and what the store does on win, lose or unclear.

**Test plan:** Question | Product | Current price | Test price | Design | Contribution per order at each price | Profit line (max order drop) | Main metric | Guardrails | Orders needed | Start | End | Stop rule | Owner.

**Set-up list** for approval, **support answer**, and the **reading template** above. **Decisions made:** test prices, the refund-the-difference rule and comparison products, one line each with the reason.

## Common mistakes

- **Two prices, one product, same day.** The gates rule it out.
- **Judging on conversion.** Step 3 uses contribution per visitor.
- **Before-and-after with no comparison.** Step 6 subtracts the comparison products' change.
- **Stopping early.** Step 4 fixes the end date.
- **Missing the later effect.** Step 3 books a 60 to 90 day repeat check.
- **Feed out of sync.** Step 5 changes every surface in the same hour.

## Sources

- CRO-0009: do not test two prices for one product.
- CRO-0011: order-volume gates for testing.
- CRO-0005, CRO-0014: sample sizes; profit per visitor needs far more traffic.
- CRO-0015, CRO-0017: whole weeks; no peeking.
- OFF-0015: judge on profit per session.
- FIN-0029: cash effects show over 60 to 180 days.
- OFF-0070: a launch price cut with the difference refunded.
- GAD-6122, ADC-6047: feed and catalog price rules.
- OFF-6145: genuine former prices.

What makes this skill ours: it never splits one product's price across visitors, and instead offers four designs that keep one price per product at a time; the profit line is written before launch so the result is judged on profit, not conversion; timed tests use comparison products to remove the background trend; and failed delivery and repeat effects are checked after the test ends.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Never price above MRP [COG-6264: India MRP], and keep MRP unchanged during a test unless the pack is reprinted. Price changes can shift buyers between prepaid and COD; wait 10 to 14 days after the last order before reading RTO.
