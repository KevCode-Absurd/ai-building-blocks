---
name: upsell-and-cross-sell-in-chat
description: "Rules and ready lines for suggesting a bundle, upgrade or add-on in a sales chat without pushing: an offer sheet per hero product ranked by added gross profit, the moment to suggest (only after the main item is decided), the signals that mean do not suggest, one suggestion per chat tied to the buyer's own words, permission-based wording, a ban on adding anything without a clear yes, and a weekly read of offers made, taken, added gross profit and refunds. Works on WhatsApp, Instagram, site chat and calls. Market notes for tax-inclusive prices, risky pay on delivery baskets, consent rules and honest reference prices. Use when chat orders are mostly single items, or agents push add-ons that buyers resent."
---

# Upsell and cross-sell in chat

**You get:** a chat offer sheet for the store's top products (one upgrade, one add-on and one bundle each, ranked by added gross profit), a when-and-when-not card, 3 wording patterns with filled examples, and a weekly tracker of offers, take rate, added gross profit and refunds.

## When to use

- Most chat orders are a single item while buyers of the same product often buy a second thing later.
- Agents suggest add-ons at random, or to everyone, and buyers push back.
- A new bundle or upgrade exists and the chat team needs to know when to mention it.
- The store wants chat to raise gross profit per order, not just order count.

## Not for

- Choosing which products pair on the product page, cart and post-purchase: use `set-up-cart-upsells-and-cross-sells`.
- Designing bundle tiers, gifts and thresholds: use `offer-bundle-threshold-design`.
- Price pushback: use `handle-price-objections-in-chat`.
- The main reply library: use `write-chat-sales-scripts`.

## What you need

Required:

1. **Shopify order export**, last 6 to 12 months: Name, Created at, Lineitem name, Lineitem sku, Lineitem quantity, Lineitem price, Discount Amount, Customer Id, plus refunds by line item.
2. **Gross profit per SKU** on delivered costs, from `build-sku-profit-sheet`.
3. **Stock** per SKU.
4. **Existing offers**: bundles, multipacks, gifts, add-ons and their real prices.
5. **Chat transcripts**, last 100 orders from chat, to see what buyers asked for.

Optional: the pairing table from `set-up-cart-upsells-and-cross-sells`, second-order data (what buyers buy next).

Access: reading orders and chats is level 1. Creating a new bundle or price in the store is level 2 and needs the client's yes. Agents add items to a buyer's order or draft order only after the buyer says yes in the chat.

## Before you start: the gates

1. **Gross profit per SKU known.** Pass: offers are ranked by added gross profit. Fail: stop; take rate alone ranks badly [OFF-0011].
2. **Offer is honest.** Prices are the real prices, any "was" price is one the store genuinely charged [OFF-6145], bundle savings are true, and urgency is real. Fail: drop the offer.
3. **Stock.** The add-on has at least 4 weeks of cover at the expected take rate. Fail: leave it out.
4. **Message type.** On WhatsApp, an offer inside an order update template turns it into a marketing message [OPS-6286]. Upsells happen in live replies inside an open chat, not in order templates. Fail: rewrite.

## Steps

### 1. Find what goes together

From the order export, for each of the top 10 products by chat orders: the items most often bought in the same order, and the items most often bought next by the same customer. Two sound rules for picking: more of the same at a multi-unit price, or the product that solves the next problem the first one creates [OFF-0052].

### 2. Build the offer sheet

For each top product, at most three offers:

| Type | Example shape | Rule |
|---|---|---|
| Upgrade | Bigger size, better grade, longer warranty | Fits the need the buyer stated |
| Add-on | Care kit, refill, matching piece | Under about 30% of the main item's price (practitioner default, test it) |
| Bundle | Multipack or set | Tier tied to a real use (one person or a family, one room or two) [OFF-0018] |

Rank the three by added gross profit per offer made = expected take rate x added order value x gross margin of the added item [OFF-0011]. Planning take rates in a cart run about 5 to 15% [OFF-0010]; chat is one to one, so measure the store's own rate after 2 weeks.

Check every discount in a bundle with the profit maths; a cut in price that looks small can remove most of an order's gross profit [OFF-0065].

### 3. Suggest only at the right moment

Suggest once, after the buyer has chosen the main item and before they get the link or confirm the order. Never in the first message, never before the main question is answered.

Do **not** suggest when:

- the buyer has said money is tight or asked for a discount;
- the chat is a complaint or a delivery problem;
- it is a first pay on delivery order to an area the store marks risky (a bigger unpaid basket puts more cash at risk; see `cut-rto-on-cod-orders`);
- the add-on is low on stock or late;
- the buyer already said no to one suggestion.

### 4. Use permission-based wording

One suggestion, tied to what they said, with an easy no:

1. **Use-based:** "Since you said it's for the whole family, the 3-pack works out at Rs [x] each instead of Rs [y]. Want that instead, or keep the single?"
2. **Next-problem:** "Most people who get this rug also use a non-slip pad on tiled floors. It's Rs [price]. Shall I add it, or just the rug?"
3. **Upgrade:** "For daily use outdoors, the [grade] version has [real difference]. It's Rs [difference] more. Happy to stick with the one you picked."

The buyer's answer decides. "No thanks" gets "Sure, here's your link" and nothing more.

### 5. Never add without a yes

Nothing goes into a cart, draft order or pay on delivery order without the buyer's clear yes in the chat. Adding items without consent ("basket sneaking") is a banned dark pattern in many markets; EU consumer law bans pre-ticked paid extras, and the FTC and UK CMA treat hidden add-ons as unfair. Treat any pre-ticked add-on as a consumer-law risk. Read back the final items and total before sending the link.

### 6. Prefer value over discount

Where a sweetener is needed, a low-cost gift of real value can lift order value at nearly the same margin [OFF-0078]. Discount-led buyers often repeat less [CXP-0016], so keep chat bundles at their published prices.

### 7. Track and prune

Tag each chat where an offer was made: Offered, Taken, Declined. Weekly per offer: times offered, take rate, added gross profit, refunds or returns on the added item, complaints. Drop an offer whose refunds eat its added profit or that draws complaints; promote the one with the highest added gross profit per offer made.

### Market notes

- **Tax-inclusive markets** (UK, EU, Australia and others): prices include VAT or goods and services tax; a multipack can also lower shipping cost per unit, which is often where bundle savings come from. Keep pay on delivery baskets in risky areas to the main item. Write lines in the languages your buyers use where the team can.
- **Reference prices and unit prices:** state the real unit price in multipacks (the UK and EU require unit pricing for many goods); a compared "regular price" must be a price the store actually charged for a meaningful period [OFF-6145]. In the US, sales tax is added at checkout.

## Checks before you hand it over

- Every offer is ranked by added gross profit, not take rate.
- Every price, saving and "was" price is true and current.
- Each top product has at most three offers, each with stock cover.
- The do-not-suggest list is part of the agent card.
- Wording gives an easy no and names one item.
- No step adds anything without the buyer's yes.
- The tracker includes refunds on added items.

## Output

1. **One-screen summary:** the 10 products covered, the best offer for each, expected added gross profit a month at planning take rates, and what the client must approve.
2. **Offer sheet:** Main product, Offer type, Offer item, Price, Added gross profit, Planning take rate, Added gross profit per offer made, Stock cover, Line to use.
3. **Agent card:** when to suggest, do-not-suggest signals, the 3 wording patterns, read-back rule.
4. **Weekly tracker:** Week, Offer, Offered, Taken, Take rate, Added gross profit, Refunds on added items, Complaints, Keep or drop.

## Common mistakes

- **Ranking add-ons by take rate.** Step 2 ranks by added gross profit.
- **Offering in the first message.** Step 3 waits until the main item is chosen.
- **Pushing a buyer who asked for a discount.** Step 3 lists it as a do-not-suggest signal.
- **Two or three suggestions in one chat.** Step 4 makes one.
- **Adding items "for convenience".** Step 5 needs a yes and a read-back.
- **Deep bundle discounts.** Steps 2 and 6 check profit and prefer real-value gifts.

## Sources

- OFF-0011: rank upsells by added profit per exposed order.
- OFF-0010: planning take rates by slot.
- OFF-0052: more of the same, or the next problem.
- OFF-0018: tie bundle tiers to real use.
- OFF-0065: discount profit maths.
- OFF-0078: low-cost gift with a two-unit purchase.
- CXP-0016: discount-acquired buyers often have lower lifetime value.
- OFF-6145: genuine former prices.
- OPS-6286: offers turn WhatsApp utility templates into marketing.

What makes this skill ours: each chat offer is ranked by added gross profit per offer made; the agent card says when not to suggest as clearly as when to; nothing is added without a yes and a read-back; and risky pay on delivery baskets stay small instead of being grown.

## Selling in India

- Prices include GST.
- Keep COD baskets in risky pincodes to the main item.
- India's 2023 dark-pattern guidelines name basket sneaking as a banned practice.
