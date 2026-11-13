---
name: write-gifting-ad-copy
description: "Writes ad copy for the person buying a gift, not the person who will use it: copy sets that speak to the giver's real worries (will they like it, will it fit, will it arrive in time, will it look special, can they exchange it), each promise on delivery dates, gift wrap, gift messages, hidden prices and exchanges checked against what the store and its couriers can really do by region. Includes a dated delivery cutoff table, a last-safe-day swap to gift cards, and India and US gifting notes. Use before Diwali, Raksha Bandhan, Valentine's, Mother's or Father's Day, Christmas, or any time a product sells as a gift."
---

# Gifting ad copy

**You get:** five to seven gifting copy sets (primary text, headline, description, on-screen text) written to the gift buyer, each tied to one giver worry and one recipient, a promise sheet showing every delivery, wrap, message, price-hiding and exchange line with its proof, a delivery cutoff table by region with the date each ad must stop or switch, and a one-screen summary of which set runs when.

## When to use

- A gifting season is coming and the product is bought for someone else.
- Reviews, gift notes or orders with a different shipping name show that many buyers are givers.
- Gift ads talk about how the product feels to use, but the buyer is not the user.
- Last year's gift orders arrived late or the "arrives by" promise caused refunds and tickets.

## Not for

- The season's full creative plan, asset list and deadlines: use `seasonal-gifting-creative-plan`.
- A gift guide page on the store: use `build-gift-guide-page`.
- A free gift with purchase offer: use `gift-with-purchase-offer`.
- Delivery promise and shipping set-up on the store: use `set-up-shipping-rates-and-delivery-promise`.

## What you need

Required:

1. **Order export** (Shopify): Created at, Billing name, Shipping name, Shipping city and province or state, Shipping zip, Note or gift message field, Lineitem name, Total. Orders where billing and shipping names differ, or with a gift note, show who gives what to whom.
2. **Courier transit times** by region and the warehouse's last dispatch time, from the courier or aggregator dashboard. For India include COD availability by pincode.
3. **What the store really offers for gifts:** gift wrap (and its cost per order), gift message, price-free packing slip or invoice, exchange for the recipient, gift cards.
4. **The season and its key date**, and the products to push, with stock.
5. **Gross profit per order** including any gift wrap cost.

Optional: reviews mentioning gifts, last season's gift-period results, support tickets about late gifts.

Writing is read-only. Loading and scheduling ads needs draft access; the client approves each ad and each cutoff switch.

## Before you start: the gates

1. **Gift promises are real.** Every gift line (wrap, message, no price on slip, recipient exchange) is live on the site and in the warehouse process. Fail: drop that line.
2. **Delivery dates are kept.** The "arrives by" promise must hold for each region the ads reach, based on courier transit times plus dispatch time. Fail: narrow the ad's regions or stop the line earlier. A promise the store cannot keep turns into refunds, and ads that imply an outcome the buyer then does not get are treated as misleading in India [ADC-6147].
3. **Gross profit per order covers wrap and packing.** A branded unboxing can cost from under 0.50 to several dollars per order [CXP-0008]. Pass when `store-meta-math` includes it [MEA-0037]. Fail: charge for wrap or drop it.
4. **Stock covers the season.** A gift that sells out mid-season leaves ads selling a dead product. Fail: cap or swap the product.

## Steps

### 1. Find who gives to whom

From the order export, count gift orders (different billing and shipping names, gift notes) by product, season and region. Write down the top 3 giver-to-recipient pairs: "daughter buying for mother", "wife buying for husband", "employee buying for team". Many products sell as "for me or for you" [PRD-0013]; the store's own orders say which. Large brands have found whole new buyer groups this way, such as women buying menswear for men in the gifting quarter [ADC-0054].

### 2. List the giver's worries

Givers worry about different things than users. Typical worries, to confirm in the store's reviews and tickets:

- Will they like it? (taste, style)
- Will it fit? (size)
- Will it arrive in time?
- Will it look like a real gift? (wrap, box)
- Will the price show? (slip, invoice)
- Can they swap it if it is wrong?
- Is it special enough for this person? (status, effort)

Each copy set answers one worry with one true promise.

### 3. Write the copy sets

Write 5 to 7 sets. Each names the recipient and the moment, then answers one worry:

| Set | Recipient and moment | Worry | Promise line (only if true) |
|---|---|---|---|
| 1 | Mother, Mother's Day | Will she like it? | The proof: a review from a mother, the product's story |
| 2 | Husband, Valentine's | Will it fit? | "Size exchange for him, free, within 30 days" |
| 3 | Sister, Raksha Bandhan | Will it arrive? | "Order by 15 Aug for delivery in Delhi NCR" |
| 4 | Team, Diwali | Looks special? | "Wrapped in our festive box, with your message" |
| 5 | Anyone, last minute | Too late? | "Send a gift card by email today" |

Write the copy to the giver ("Your mum will..." or "For the sister who..."), not to the user ("You'll love how soft..."). Keep the product's proven benefit in, but as a reason the recipient will be happy.

### 4. Write the promise lines exactly

Every gift promise is written as the exact operating rule:

- **Delivery:** "Order by [date], [time] for delivery by [date] in [regions]". Never "Arrives in time for Diwali" without a date and region.
- **Wrap:** "Gift wrap available, ₹99" or "Free gift wrap" only if free for every order.
- **Message:** "Add a handwritten note at checkout" only if a person really writes it.
- **Price:** "No price on the packing slip" only if the warehouse removes it and the invoice goes to the buyer; in India check that GST invoice handling allows it.
- **Exchange:** who can exchange (buyer or recipient), how many days, who pays return shipping.

### 5. Build the cutoff table and the swap

For each region the ads reach, compute the last safe order day: festival date minus courier transit days minus dispatch days minus one buffer day (practitioner default; widen it for remote pincodes and peak weeks). Then:

- ads with an "arrives by" line stop or switch the day after the cutoff for that region;
- after the last cutoff, switch to gift card copy ("Instant e-gift card, sent by email") or "Order now, arrives after [date], with a card you can give on the day".

No urgency beyond the real cutoff. "Last chance" copy runs only on the real last day.

### 6. Season and timing notes

- **India:** Diwali, Raksha Bandhan, Karva Chauth, Bhai Dooj and wedding season dates move each year; check the calendar. COD is common for gifts but RTO risk rises when the recipient is not expecting a parcel; push prepaid for gift orders where the store can (`cut-rto-on-cod-orders`). Prices include GST [ADC-6147]. Corporate Diwali gifting goes to `corporate-gifting-sales-pitch`.
- **US:** Black Friday to Christmas cutoffs depend on carrier peak schedules; publish the cutoff dates on the site. 16 to 31 December can be the cheapest Meta auction of the quarter, so plan post-Christmas copy for gift-card spenders and self-gifters [ADC-0043].
- Beyond the big holidays, owning a cultural moment can create extra demand peaks [EML-0055].

### 7. Plan the read

Gift-season ads look weak in real time because purchases backdate across longer click windows in November [ADC-0046]; read them a week later. Gift-season buyers may repeat less than other cohorts [MEA-0035], so judge on first-order gross profit and do not count on repeat orders to pay back the cost.

## Checks before you hand it over

- Each set names a giver, a recipient and one worry, and is written to the giver.
- Every gift promise (delivery, wrap, message, price-free slip, exchange) is live and written as the exact rule.
- Every "arrives by" line has a date and the regions it holds for, from courier transit times.
- The cutoff table gives each ad's stop or switch date by region.
- A gift card or late-delivery version is ready for after the last cutoff.
- Wrap and packing cost is inside gross profit per order.
- No urgency beyond the real cutoff; India prices include GST.
- Nothing published or scheduled without the client's yes.

## Output

**1. One-screen summary:** gift buyer pairs from orders, the sets and when each runs, regions, the last safe order days, the swap.

**2. Copy sheet:**

| Set | Giver to recipient | Worry | Platform | Primary text | Headline | Description | On-screen text | Promise lines used | Runs from | Stops or switches |
|---|---|---|---|---|---|---|---|---|---|---|

**3. Promise sheet:**

| Promise | Exact wording | Proof (setting, process, courier data) | Owner | Holds for regions |
|---|---|---|---|---|

**4. Cutoff table:**

| Region | Transit days | Dispatch days | Buffer | Last safe order date and time | Ad action after |
|---|---|---|---|---|---|

## Common mistakes

- **Writing to the user, not the giver.** Step 3 names the giver and recipient.
- **"Arrives in time" with no date or region.** Step 4 writes the exact rule.
- **Gift wrap promised but not costed.** Gate 3.
- **Ads selling delivery after the cutoff.** Step 5's table and swap.
- **Guessing who buys gifts.** Step 1 reads the order export.
- **Judging gift ads in real time.** Step 7.

## Sources

- PRD-0013: screen products for "for me or for you" gifting demand.
- ADC-0054: gift-season buyers can be a different group from users.
- ADC-0043: late-December auctions are cheap; plan post-Christmas copy.
- ADC-0046: November purchases backdate across longer click windows.
- MEA-0035: gift-season customers may repeat less.
- EML-0055: owning a cultural moment adds demand peaks.
- CXP-0008: unboxing cost per order bands.
- ADC-6147: bait and switch and false urgency are misleading in India.
- MEA-0037: margin from delivered cost.

What makes this skill ours: gift buyers are found in the store's own orders (different billing and shipping names, gift notes); every gift promise is written as the exact operating rule with its proof; a cutoff table by region tells each ad when to stop or switch to gift cards; and wrap cost and weaker repeat rates are counted before the season starts.
