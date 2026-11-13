---
name: gift-with-purchase-offer
description: "A free gift offer ready to approve: which gift to give (scored on buyer-perceived value, landed cost, whether it helps the buyer use the main product, stock and parcel weight), the spend or product threshold that unlocks it, the cost per order and change in gross profit per order and per month, the offer terms, where it shows in page and cart, and the end rule. Separates threshold gifts that lift order value from acquisition gifts that must lower cost per new customer, and checks the US free-offer rules and India's cash-on-delivery losses. Use when order value has stalled, when a sale needs a cheaper mechanic than a discount, or when the team wants to 'add a free gift' and needs to know which and at what line."
---

# Gift with purchase offer

**You get:** a one-page gift offer: the chosen gift and runner-up from a scored shortlist, the unlock rule (spend line, product or quantity), cost per order, change in gross profit per order and per month, stock check, the exact terms, placement on product page and cart, and the date the offer ends.

## When to use

- Order value has stalled and a gift might pull buyers over a line.
- A sale is planned and the owner wants something cheaper than a percentage off.
- New-customer cost is rising and a first-order gift could help conversion.
- The team has a cheap, liked item (sample size, accessory, pouch) and wants to use it well.

## Not for

- The full set of threshold, bundles, upsells and discounts together: use `offer-bundle-threshold-design`.
- Gifts inside subscriptions (welcome kits): use `design-subscribe-and-save-program`.
- A surprise gift in the box after purchase, or gifts to top customers: use `post-purchase-repeat-sequence`.
- Sending products to creators: use `plan-influencer-gifting-campaign`.

## What you need

Required (read access):

1. **Shopify order export**, last 90 days: Name, Subtotal, Discount Amount, Lineitem sku, Lineitem quantity, Payment Method. Used for the order value distribution and units per order.
2. **Gross profit per order** (delivered cost basis) from `build-sku-profit-sheet` or `store-meta-math`.
3. **Candidate gifts**: landed cost, current selling price if sold, stock, weight and size.
4. **Sessions** for the same window (Shopify Analytics or GA4).
5. **Shipping rate card** by weight, to see if the gift changes the parcel cost.

Optional: post-purchase survey answers, reviews that mention accessories, past gift results.

If no gift candidate has a known cost, ask the supplier first. Setting up the gift in Shopify (automatic discount, gift app or a free variant) needs draft access (level 2); turning it on needs the client's yes.

## Before you start: the gates

1. **Gross profit per order is known.** Fail: stop; a gift cannot be judged.
2. **Goal is named.** Either "lift order value" (threshold gift) or "lower cost per new customer" (acquisition gift). One goal per offer.
3. **Stock.** Gift stock must cover expected uptake for the whole window plus 20% (practitioner default, test it). Fail: shorten the window or cap the gift ("while 500 last", only if true).
4. **Legal.** In the US, the paid item's price must have been its regular price for at least 30 days and must not rise during the offer, and terms must be stated up front, not in a footnote [OFF-6500].

## Steps

### 1. Build the gift shortlist

List 3 to 6 candidates and score each 1 to 5 on:

- **Perceived value:** what a buyer would pay. Strongest when the gift is also sold on the site at a real price, which anchors its value [OFF-0007].
- **Landed cost** (lower scores higher).
- **Helps use the main product:** a scoop, frother, travel case or care kit. Gifts of more of the same product tend to delay the next purchase; gifts that improve use do not [OFF-0039] [OFF-0032].
- **Desire:** a coveted, cheap-to-make item pulls hardest. One apparel brand stopped selling its most-wanted low-cost item and gave it away above a line, lifting order value from about 60 to about 100 dollars [OFF-0076].
- **Parcel impact:** does it push the order into a heavier or bigger shipping band?
- **Stock and resupply.**

Drop any gift that adds a shipping band unless step 3 shows it still pays.

### 2. Set the unlock rule

**Threshold gift (lift order value):**

- Plot the order value distribution in steps (5 or 10 dollars, 100 to 200 rupees). Set the line just above a peak, not from the mean; a mean-based line moves few buyers and gives the gift to everyone already above it [OFF-0013] [OFF-0079].
- A line about 30 to 40% above the current average is a common starting point for a coveted gift [OFF-0076]; check it against the peaks.
- If a free-shipping threshold already exists, place the gift as the next rung above it in a cart progress bar [LPG-0001]. One brand ran free shipping, then a free shirt, then free joggers at rising lines [LPG-0072].

**Product or quantity gift:** gift with two units, or with a starter kit. Scale gifts with units when the product is bought in quantity [OFF-0046]. A low-cost gift with a two-unit purchase can double order value while leaving break-even ROAS almost unchanged; in one worked case 1.87 against 1.89 [OFF-0078].

**Acquisition gift (first order only):** pays only if it cuts cost per new customer by more than the gift's landed cost [OFF-0073].

### 3. Model the money

For a threshold gift, per month:

Change in gross profit = (orders that move up x gross profit gained per moved order) minus (gift cost x all orders above the line, including those already there) minus (extra shipping, if any).

- Orders that move up: buyers just below the line. Use past behaviour at a similar line if the store has one; otherwise model 10%, 20% and 30% of buyers within one item's price below the line, and show all three.
- If only the high case pays, do not launch; lower the gift cost or move the line.

For an acquisition gift: break-even cost per new customer with gift = (gross profit per first order minus gift cost). Compare with today's cost per new customer; the gift must lower that cost by more than it adds.

Show gross profit per session before and after, since a gift can raise order value and still lower profit per visitor.

### 4. Write the terms

- What the gift is, its real price if sold, and the unlock rule.
- Start and end date. One gift per order. Does it stack with codes? (Default: no.)
- What happens on a return: the gift is kept or must come back (keep it simple; default kept for gifts under the cost of return shipping).
- Sold-out rule: what the cart shows when the gift runs out. Never keep advertising a gift that is gone.

### 5. Place it

- Product page: one line under the price ("Free travel case with orders over X").
- Cart: progress bar with the amount left to unlock, and the gift added automatically once unlocked.
- Ads and email: the same terms word for word. Hand copy to `write-sale-and-discount-ad-copy` and visuals to `design-sale-banners-and-hero`.

### 6. India and US notes

- **India:** on cash-on-delivery orders the gift is lost on every RTO along with shipping; add gift cost x RTO rate to the cost per order, or unlock the gift on prepaid orders only and say so on the product page. Ask the store's accountant how GST applies to free items in the offer.
- **US:** keep the paid item's price unchanged during the offer, state conditions next to the offer, and do not run a free offer on the same product size more than 6 months a year [OFF-6500].

### 7. Read it after 14 days

Compare with the 14 days before: share of orders at or above the line, gross profit per order, gross profit per session, gift stock left. Keep, move the line, or end.

## Checks before you hand it over

- The gift was chosen from a scored shortlist with its landed cost and perceived value.
- The line sits above a real peak in the order value distribution, with the chart attached.
- Gross profit change is shown at low, middle and high uptake, and the middle case pays.
- Gift cost includes any extra shipping band and the RTO loss on COD orders.
- Gift stock covers the window, or the cap is stated and true.
- Terms (dates, stacking, returns, sold-out rule) are written.
- Nothing was switched on without a client yes.

## Output

**One-screen summary:** the gift, the line, expected change in gross profit per order and per month (middle case), stock cover, end date, and the runner-up gift in one line.

**Gift shortlist table:** Gift | Real price if sold | Landed cost | Perceived value 1-5 | Helps use 1-5 | Desire 1-5 | Parcel impact | Stock | Total.

**Offer model:** Line or rule | Orders above line now | Orders that move up (low / mid / high) | Gift cost per month | Gross profit change per month (low / mid / high) | Gross profit per session before and after.

**Terms block** and **set-up list** for approval (Shopify discount or app settings, cart bar text, product page line).

## Common mistakes

- **A gift nobody values.** Step 1 scores perceived value and lists the gift for sale.
- **Line from the average.** Step 2 uses the peaks.
- **Forgetting the buyers already above the line.** Step 3 charges the gift to every qualifying order.
- **More of the same as the gift.** Step 1 prefers items that help use.
- **Gift out of stock while ads still promise it.** Step 4 sets the sold-out rule.
- **COD losses ignored.** Step 6 adds the gift to RTO cost.

## Sources

- OFF-0007: gift with high perceived value, listed for sale.
- OFF-0073: acquisition gifts must cut cost per new customer.
- OFF-0078: low-cost gift with two units kept break-even ROAS flat.
- OFF-0076: coveted item given free above a line.
- OFF-0032, OFF-0039: gifts that help use beat more of the same.
- OFF-0046: gifts that scale with units.
- OFF-0013, OFF-0079: thresholds from the distribution peaks.
- LPG-0001, LPG-0072: cart progress bar and gift ladder.
- OFF-6500: US free-offer rules.

What makes this skill ours: the gift is chosen from a scored shortlist that includes parcel weight and whether it helps the buyer use the product; the money model charges the gift to every order above the line, not just the new ones; uptake is shown at three levels and only launched if the middle case pays; and COD orders carry the gift's RTO loss.
