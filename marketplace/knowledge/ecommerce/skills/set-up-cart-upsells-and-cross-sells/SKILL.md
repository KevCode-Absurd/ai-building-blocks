---
name: set-up-cart-upsells-and-cross-sells
description: "Picks which product to offer with which, in each slot (product page, cart, checkout, post-purchase and thank-you page), from the store's own baskets and second orders, and writes the rules that keep each offer profitable and honest: margin floor, price ratio, stock, exclusions, one offer per slot, never pre-ticked. Ranks every pairing by added gross profit per exposed order and ends with a setup sheet for any upsell app or the theme's own recommendations, plus a holdout to prove the offers add profit. Use when order value has stalled, when an upsell app shows offers nobody takes, or when adding a new slot such as post-purchase."
---

# Cart upsells and cross-sells

**You get:** a pairing table (for each top product: the offer in each slot, its price, the rule behind it and the added gross profit per exposed order), a rules sheet the upsell app or theme can follow, a setup sheet ready for approval, and a holdout plan that shows after 4 weeks whether the offers really add profit.

## When to use

- Order value has stalled and the store sells items that go together.
- An upsell app is installed but its offers are random or rarely taken.
- The store is adding a slot it has not used (post-purchase one-click, thank-you page, checkout add-on).
- New products launched and need a place in existing baskets.

## Not for

- Setting the free-shipping threshold, bundle tiers and discount depth: use `offer-bundle-threshold-design`.
- A free gift at a spend level: use `gift-with-purchase-offer`.
- Suggesting add-ons in WhatsApp or chat: use `upsell-and-cross-sell-in-chat`.
- Post-purchase emails with cross-sells: use `post-purchase-repeat-sequence`.

## What you need

Required (read access, level 1):

1. **Shopify order export, last 6 to 12 months:** Name, Created at, Customer email or ID, Lineitem name, Lineitem sku, Lineitem quantity, Lineitem price, Discount Amount, Payment Method.
2. **Gross profit per unit** for every SKU, from `build-sku-profit-sheet` (product cost, extra shipping weight, payment fees, returns).
3. **Stock on hand and days of cover** per SKU.
4. **Current upsell setup:** apps, slots used, offers and their take rates if the app reports them.

Optional: product reviews mentioning what buyers use together, return reasons, product page sessions by product.

If gross profit per unit is missing, stop: offers cannot be ranked. Building offers in an app or theme needs draft access (level 2); switching them on needs the client's yes.

## Before you start: the gates

1. **Gross profit per unit known** for both the anchor and the offered product [MEA-0037]. Fail: compute it first.
2. **Enough orders.** At least about 300 multi-item orders in the window for basket analysis (practitioner default). Fewer: build pairings from product logic and reviews (Step 2), and mark them as untested.
3. **Stock can carry it.** An offered SKU needs cover for the whole offer window plus lead time. Fail: drop it or cap it.
4. **Honest mechanics.** No pre-ticked add-ons, no items added to the cart without a tap, no fake "only today" on always-on offers. India's 2023 dark-pattern guidelines name adding items without consent (basket sneaking) and false urgency; US consumer protection law treats them as deceptive too.

## Steps

### 1. Find what already sells together

From multi-item orders, for every pair of products A and B with at least 10 orders together (practitioner default):

- **Attach rate** = orders with A and B / orders with A.
- **Lift** = attach rate / share of all orders containing B. Lift above 1.5 means A buyers want B more than average buyers do.

Then look at second orders: for customers with two or more orders, what did they buy next after A, and how many days later? Most second purchases happen within 30 days of the first [EML-0062]; those next items are the best post-purchase and thank-you offers.

### 2. Add product logic where data is thin

Two rules pick strong post-purchase and cart offers: more of the same at a multi-unit price, or the product that solves the new problem the first purchase creates (refills, cases, care kits, the matching piece) [OFF-0052]. Read reviews for "I wish it came with" and "I also bought" lines.

### 3. Assign offers to slots

| Slot | What fits | Planning take rate |
|---|---|---|
| Product page, under add to cart | Multi-pack of the same item, or the top paired item | Varies; a 3-pack under the button added large monthly revenue for one brand [OFF-0053] |
| Cart drawer | One-tap, low-price add-ons that pair with what is in the cart [LPG-0001] | 5 to 15% [OFF-0010] |
| Checkout add-on (where the plan or app allows) | A small add-on, often 10 to 20 in price | Can reach about 50% [OFF-0050] |
| Post-purchase one-click | More of the same at a deep discount, or the next-problem product | 25 to 40% [OFF-0010] |
| Thank-you page and order status | Next-purchase item, referral, or account sign-up | Lower; no payment shortcut |

One offer per slot per order. Multiple offers in one slot split attention.

### 4. Write the rules

- **Margin floor:** an offer must add gross profit after its discount, extra shipping weight and fees. Reject any pairing where added gross profit per accepted offer is below a floor the client sets (working figure: at least 20% of the offer price, marked).
- **Price ratio:** cart add-ons usually sit well below the cart value (practitioner default: under about 30% of it); larger items belong on the product page or post-purchase.
- **Exclusions:** never offer what is already in the cart, an item the customer bought in the last 60 days unless it is a refill, or out-of-stock or low-cover SKUs.
- **Fallback:** if no pairing passes, show the best-margin bestseller under the cart value ratio, or nothing.
- **Service add-ons:** shipping protection and priority packing count only at true margin; protection fees minus expected claims, and priority packing only if the warehouse really packs those orders first. Both must be opt-in with clear terms.
- **Post-purchase discount:** a deep discount on more of the same can be the strongest offer [OFF-0074]; keep its price above the margin floor and do not show the same discount to all buyers on the product page.

### 5. Rank every pairing by added profit

Added gross profit per exposed order = take rate x offer price x gross margin of the offered item [OFF-0011]. Use the slot's planning take rate until the store has its own. For post-purchase, judge by price x take rate, not take rate alone: a pricier offer taken less often can add more [OFF-0051]. Keep the top pairing per product per slot; list the runner-up in one line.

### 6. Fill the setup sheet

For each slot: trigger product or collection, offer product and variant, price or discount, rule (margin floor, exclusions, stock limit), copy line, image, start date, and the app or theme setting. Use the theme's built-in "complementary products" or Shopify's free Search and Discovery app for product page pairings where it is enough; add a paid upsell app only for slots the theme cannot do, and check its effect on speed with `remove-app-bloat` in mind.

### 7. Prove it with a holdout

Offers can take credit for items buyers would have bought anyway. Where the app allows, hold out 10% of carts from offers for 4 weeks (practitioner default) and compare gross profit per order and conversion between groups. If the app cannot hold out, compare 4 weeks before and after, with no promotion in either window, and label it weaker evidence. Keep an offer only if gross profit per order rises and conversion does not fall beyond noise.

### 8. India and US notes

- **India:** on COD orders, a post-purchase add-on raises the cash due at the door; confirm it with the buyer (chat or call) and watch RTO on orders with add-ons. One-click post-purchase works only with payment methods that can be charged again without re-entry; for COD and UPI, use the thank-you page and a WhatsApp or email follow-up instead. Show prices with GST included.
- **US:** check that the add-on price shown includes any extra shipping, and that subscription add-ons state the renewal terms before the tap.

## Checks before you hand it over

- Every pairing has attach rate and lift, or is marked as product logic with its reason.
- Every offer shows added gross profit per exposed order after its discount and extra shipping.
- One offer per slot; no offer for items already in the cart or out of stock.
- Nothing is pre-ticked or added without a tap; no false time limits.
- Service add-ons show true margin after claims and real operations.
- A holdout or before-and-after read is planned with dates.
- Nothing switched on without the client's yes.

## Output

**One-screen summary:** the top 5 pairings by added gross profit, the slots to switch on first, expected added gross profit per month at planning take rates, and the holdout dates.

**Pairing table:**

| Anchor product | Slot | Offer product | Offer price | Attach rate | Lift | Basis (data or logic) | Margin of offer | Planning take rate | Added GP per exposed order | Stock cover (days) | Runner-up |
|---|---|---|---|---|---|---|---|---|---|---|---|

**Rules sheet:** margin floor, price ratio, exclusions, fallback, one-offer rule, service add-on terms.

**Setup sheet:** Slot, Trigger, Offer, Price or discount, Copy line, Image, App or theme setting, Start date, Approval.

**Holdout plan:** split, dates, metrics (gross profit per order, conversion, take rate), keep or drop rule.

## Common mistakes

- **Ranking by take rate.** Step 5 ranks by added gross profit per exposed order.
- **Random "you may also like" offers.** Steps 1 and 2 pair from baskets, second orders and product logic.
- **Too many offers.** Step 3 allows one per slot.
- **Pre-ticked add-ons.** Gate 4 rules them out.
- **Assuming every add-on is extra profit.** Step 7 holds out a group to check.
- **Post-purchase one-click on COD orders.** Step 8 moves those to the thank-you page and follow-up.

## Sources

- EML-0062: most second purchases happen within 30 days.
- LPG-0001: side cart with one-click low-price cross-sells.
- MEA-0037: gross margin is delivered cost.
- OFF-0010: planning take rates by slot.
- OFF-0011: rank upsells by take rate x added value x margin.
- OFF-0050: checkout add-ons at 10 to 20 can reach about 50% take.
- OFF-0051: judge post-purchase offers by price x take rate.
- OFF-0052: more of the same, or the product for the next problem.
- OFF-0053: a 3-pack under add to cart.
- OFF-0074: deep-discount post-purchase offer of the same item.

What makes this skill ours: pairings come from the store's own baskets (attach rate and lift) and second orders, not an app's generic suggestions; each slot gets one offer ranked by added gross profit after discount and shipping; mechanics that India's dark-pattern guidelines and US law treat as deceptive are banned up front; COD orders are routed away from one-click offers; and a holdout proves the offers add profit rather than just taking credit.
