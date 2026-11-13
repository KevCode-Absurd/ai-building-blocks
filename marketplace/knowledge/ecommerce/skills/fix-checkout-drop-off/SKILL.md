---
name: fix-checkout-drop-off
description: "Finds where buyers leave between add to cart and paid order (cart, contact, shipping, payment, failed payment), works out why from the store's own funnel, a hands-on phone checkout run, abandoned checkout records, surveys and recordings, and hands over the fixes in order of gross profit recovered per month. Repairs come before tests. Covers Shopify's checkout limits, India checkouts with pincode checks, COD, UPI and OTP logins, and US checkouts with tax, shipping and express wallets. Use when cart or checkout abandonment looks high, after a checkout or app change, or before spending more on ads."
---

# Fix checkout drop-off

**You get:** a leak map of the cart and checkout steps with orders lost at each, the cause behind each leak with its evidence, and a fix list of 5 to 12 items ranked by gross profit recovered per month, each marked repair (ship now) or test, with who makes it and the setting or copy to change.

## When to use

- Many carts or checkouts start but few become paid orders.
- Conversion fell after a checkout, payment, shipping or app change.
- Before raising ad spend, to make sure paid traffic is not leaking at the last step.
- A new payment option, COD rule or shipping rate is being considered.

## Not for

- Leaks before the cart (home, collection, product pages): use `storefront-conversion-audit` or `diagnose-low-add-to-cart-products`.
- Writing the cart and checkout words themselves: use `write-cart-checkout-and-shipping-microcopy`.
- Emails, texts and chats that win back abandoners: use `write-abandoned-cart-and-checkout-emails` or `recover-carts-by-chat`.
- COD and prepaid rules in depth: use `cod-and-prepaid-checkout-for-india`.

## What you need

Required (read access, level 1):

1. **Funnel counts by device, last 30 to 90 days:** sessions, added to cart, reached checkout, purchased (Shopify Analytics conversion funnel). For steps inside checkout, a GA4 funnel exploration on add_to_cart, begin_checkout, add_shipping_info, add_payment_info, purchase.
2. **Abandoned checkout export** (Shopify Orders > Abandoned checkouts): date, cart value, items, country or pincode, how far the buyer got where shown.
3. **Shopify order export:** Name, Created at, Subtotal, Shipping, Taxes, Discount Code, Payment Method, Financial Status, Shipping Zip.
4. **Checkout and payment settings:** screenshots of Settings > Checkout, Payments, Shipping and delivery, and any checkout or cart apps.
5. **Gross profit per order**, from `build-sku-profit-sheet` or `store-meta-math`.

Optional: post-purchase or exit survey answers, support tickets tagged checkout or payment, payment gateway failure report (success rate by method), session recordings of cart and checkout.

If in-checkout step data is missing, use the hands-on run (Step 3) and abandoned checkouts to place the leak, and say so. Changing settings needs draft access (level 2) where possible; any live checkout or payment change needs the client's yes. Placing a real test order on the live store needs the client's yes; prefer test mode.

## Before you start: the gates

1. **Gross profit per order known.** Pass when built from delivered cost [MEA-0037]. Fail: compute it first; fixes cannot be ranked without it.
2. **Purchase tracking is clean.** GA4 purchases within about 5% of Shopify orders; one purchase per order. Fail: fix tracking first, or rank on Shopify numbers only.
3. **Real abandonment, not browsing.** A large share of cart leavers were only looking; Baymard sets them aside before ranking reasons [CRO-6180]. Read the checkout-to-order step first; cart-to-checkout includes many browsers.
4. **What the store can change.** On non-Plus Shopify, checkout layout and most fields are fixed and browser test tools cannot run there [CRO-0016]. Fixes go in settings, cart, product page, shipping rates, payment methods and apps.

## Steps

### 1. Build the leak map

For each device: add-to-cart rate (carts / sessions), cart to checkout (checkouts / carts), checkout to order (orders / checkouts). Compare with planning ranges: begin checkout 40 to 60% of carts, purchase 45 to 60% of checkouts [LPG-0040]; a typical store runs about 4 carts to 2 checkouts to 1 order, and well-run low-ticket stores reach about 2:1:1 [MEA-0008]. For each step, orders lost a month = entries x (planning midpoint - current rate), only where the store is below range. The biggest number is where the work starts.

### 2. Split the leak

Cut the weakest step by mobile versus desktop, new versus returning, top traffic sources, cart value band, and (India) pincode zone and payment method. A leak that is twice as bad on one device, source or region usually has a specific cause.

### 3. Do the checkout yourself, on a phone

Run 3 journeys on a mid-range phone on mobile data: a guest buyer with one item, a buyer with a discount code, and a buyer far from the warehouse. Record each screen. Note:

- **Total cost surprise:** first screen where shipping, tax or fees appear, and whether the product page or cart warned. Extra costs are the top stated reason for leaving [CRO-6180]; keeping them under about 10% of order value showed no material effect in one practitioner's tests [LPG-0063].
- **Account wall, length and fields:** forced login or OTP before address, number of fields. Most checkouts need about 8 fields; the 2024 average was 11.3 [CRO-6181].
- **Delivery promise:** a date or range shown before payment. Specific dates lift conversion in reported tests [CXP-0010].
- **Payment options and failures:** express wallets near the top (Shop Pay reports a higher mobile checkout-to-order rate [SET-0008]); for India UPI, cards, wallets, COD; what happens when a payment fails or the UPI app does not return.
- **Discount code box:** a visible box with no running promotion sends buyers off to hunt for codes [LPG-0058].
- **Errors and speed:** any error message, slow step or app script that blocks the cart.

### 4. Find out why, from buyers

- **Survey:** add or read a post-purchase question "What almost stopped you buying today?" [CRO-0018]; read answers for checkout words (shipping, delivery, payment, trust, account).
- **Abandoned checkouts:** group by cart value, region and furthest step reached. With the client's yes and only where buyers consented to be contacted, call or message 10 to 20 recent abandoners and ask what stopped them [MCR-0043].
- **Gateway report:** payment success rate by method. A method under about 90% success (practitioner default) is a repair, not a persuasion problem.
- **Recordings:** if installed, watch 20 cart and checkout sessions that did not convert (hand off to `review-session-recordings-and-heatmaps` for a full review).

### 5. Match each leak to a cause and a fix

| Cause | Typical evidence | Fix |
|---|---|---|
| Surprise shipping, tax or fees | Leak at shipping step; survey "too expensive" | Show shipping estimate on product page and cart; rework rates or threshold with `offer-bundle-threshold-design` |
| Slow or vague delivery | Leak at shipping step; "when will it arrive" tickets | Show a padded delivery date by pincode or zip |
| Forced account or OTP wall | Leak at contact step | Guest checkout; login optional |
| Too many fields | Long mobile form; recordings show retyping | Hide company and address line 2; turn on address autocomplete |
| Payment failures | Gateway success under 90% on a method | Fix gateway, add retry, add a second provider |
| Missing payment method | Survey; region split | Add wallets, UPI or COD with rules |
| Code hunting | Visible empty code box; exits after box | Collapse box or auto-apply live offers |
| Card distrust | Survey "not sure it's safe"; new visitors leak more | Trust lines at cart; see `trust-and-reassurance-audit` |
| Errors or slow cart | Errors in Step 3; slow cart drawer | Repair; remove the app causing it with `remove-app-bloat` |

At checkout itself, do not add a discount to stop leavers; risk reversal and shipping clarity do the job there [OFF-0009].

### 6. Size each fix in gross profit

Recovered gross profit a month = orders lost at that step x share of leavers the cause explains (from survey or abandoned-checkout grouping; if no data, 25% as a working figure, marked) x share the fix can win back (practitioner default 30%, test it) x gross profit per order. Subtract monthly cost (app fees, payment fees, extra shipping given away). Repairs (errors, failed payments, broken steps) go first regardless of size.

### 7. Order the list and assign it

Sort: repairs, then fixes by recovered gross profit per hour of work. Mark each "ship" or "test" (tests only where the store has the volume; see `design-store-ab-test`). Name the owner (store admin, developer, payment provider, courier).

### 8. India and US notes

- **India:** check pincode serviceability before the address step, COD availability and fee shown early, UPI intent return on Android, OTP-only third-party checkouts (fast for repeat buyers, a wall for some first-timers), and the landmark field couriers need.
- **US:** sales tax often appears only at checkout; show "taxes calculated at checkout" in the cart. Express wallets (Shop Pay, Apple Pay, Google Pay) should sit above the form. Check PO box and address validation errors.

## Checks before you hand it over

- The leak map shows each step's rate, planning range and orders lost per month, by device.
- At least 3 phone checkout runs are recorded with screenshots.
- Every cause has at least one piece of buyer or system evidence, labelled by type.
- Each fix shows recovered gross profit per month and its cost, with working figures marked.
- Repairs are listed first and marked ship now.
- No checkout-stage discount is proposed to stop leavers.
- No live checkout or payment change, and no buyer contact, without the client's yes.

## Output

**One-screen summary:** the biggest leak (step, device, orders lost a month), the top 3 fixes with recovered gross profit, and the first repair to make this week.

**Leak map:**

| Step | Device | Entries | Rate | Planning range | Orders lost a month | GP lost a month |
|---|---|---|---|---|---|---|

**Evidence log:** ID, Source (funnel, run, survey, call, gateway, recording), Date, Finding, Step.

**Fix list:**

| # | Fix | Type (repair or test) | Step | Cause and evidence IDs | Recovered GP a month (low to high) | Monthly cost | Effort (hours) | Owner | Setting or copy to change | Approval |
|---|---|---|---|---|---|---|---|---|---|---|

## Common mistakes

- **Blaming checkout for cart browsers.** Gate 3 reads checkout-to-order first.
- **Copying a reasons list as the store's own.** Step 4 uses the store's buyers; outside lists only suggest causes.
- **Discounts to stop leavers.** Step 5 uses clarity and risk reversal instead.
- **Ignoring failed payments.** Step 4 reads the gateway success rate; failures are repairs.
- **Trying to A/B test checkout on non-Plus Shopify.** Gate 4 moves fixes to cart, settings and product page.
- **Ranking by abandonment rate instead of money.** Step 6 sizes each fix in gross profit.

## Sources

- CRO-6180: average abandonment and stated checkout reasons.
- CRO-6181: most checkouts need about 8 fields; average 11.3.
- CRO-0016: Shopify checkout limits for testing.
- CRO-0018: post-purchase "what almost stopped you" survey.
- CXP-0010: specific delivery dates lift conversion.
- LPG-0040: funnel step planning ranges.
- LPG-0058: remove an idle discount code box.
- LPG-0063: extra checkout costs under 10% of order value.
- MCR-0043: call checkout abandoners to learn objections.
- MEA-0008: typical cart to checkout to order ratios.
- MEA-0037: gross margin is delivered cost.
- OFF-0009: no discount at checkout; use risk reversal or shipping.
- SET-0008: Shop Pay and mobile checkout-to-order rate.

What makes this skill ours: the leak is sized in orders and gross profit per month by device before any fix is named; the agent does three real phone checkouts and reads the payment gateway's own success rate, so failed UPI or card payments are caught as repairs; India pincode, COD and OTP walls are checked alongside US tax and wallet issues; and checkout discounts are ruled out as a fix.
