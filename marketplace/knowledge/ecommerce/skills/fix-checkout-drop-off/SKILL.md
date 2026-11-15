---
name: fix-checkout-drop-off
description: "Finds where buyers leave between add to cart and paid order (cart, contact, shipping, payment, failed payment), works out why from the store's own funnel, a hands-on phone checkout run, abandoned checkout records, surveys and recordings, and hands over the fixes in order of gross profit recovered per month. Repairs come before tests. Covers Shopify's checkout limits, local payment methods (wallets, bank payments, buy now pay later, pay on delivery), postcode delivery checks, sales tax and VAT display, shipping and express wallets in any market. Use when cart or checkout abandonment looks high, after a checkout or app change, or before spending more on ads."
---

# Fix checkout drop-off

**You get:** a leak map of the cart and checkout steps with orders lost at each, the cause behind each leak with its evidence, and a fix list of 5 to 12 items ranked by gross profit recovered per month, each marked repair (ship now) or test, with who makes it and the setting or copy to change.

## When to use

- Many carts or checkouts start but few become paid orders.
- Conversion fell after a checkout, payment, shipping or app change.
- Before raising ad spend, to make sure paid traffic is not leaking at the last step.
- A new payment option, pay-on-delivery rule or shipping rate is being considered.

## Not for

- Leaks before the cart (home, collection, product pages): use `storefront-conversion-audit` or `diagnose-low-add-to-cart-products`.
- Writing the cart and checkout words themselves: use `write-cart-checkout-and-shipping-microcopy`.
- Emails, texts and chats that win back abandoners: use `write-abandoned-cart-and-checkout-emails` or `recover-carts-by-chat`.
- Pay-on-delivery and prepaid rules for India in depth: use `cod-and-prepaid-checkout-for-india`, owned by Ishita (`ishita-india-commerce`).

## What you need

Required (read access, level 1):

1. **Funnel counts by device, last 30 to 90 days:** sessions, added to cart, reached checkout, purchased (Shopify Analytics conversion funnel). For steps inside checkout, a GA4 funnel exploration on add_to_cart, begin_checkout, add_shipping_info, add_payment_info, purchase.
2. **Abandoned checkout export** (Shopify Orders > Abandoned checkouts): date, cart value, items, country or postcode, how far the buyer got where shown.
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

Cut the weakest step by mobile versus desktop, new versus returning, top traffic sources, cart value band, country, and postcode zone and payment method. A leak that is twice as bad on one device, source or region usually has a specific cause.

### 3. Do the checkout yourself, on a phone

Run 3 journeys on a mid-range phone on mobile data: a guest buyer with one item, a buyer with a discount code, and a buyer far from the warehouse. Record each screen. Note:

- **Total cost surprise:** first screen where shipping, tax or fees appear, and whether the product page or cart warned. Extra costs are the top stated reason for leaving [CRO-6180]; keeping them under about 10% of order value showed no material effect in one practitioner's tests [LPG-0063].
- **Account wall, length and fields:** forced login or OTP before address, number of fields. Most checkouts need about 8 fields; the 2024 average was 11.3 [CRO-6181].
- **Delivery promise:** a date or range shown before payment. Specific dates lift conversion in reported tests [CXP-0010].
- **Payment options and failures:** express wallets near the top (Shop Pay reports a higher mobile checkout-to-order rate [SET-0008]); the local methods buyers expect in each market (cards, wallets, bank payments such as iDEAL in the Netherlands, buy now pay later, pay on delivery where used); what happens when a payment fails or the bank or wallet app does not return the buyer to the store.
- **Discount code box:** a visible box with no running promotion sends buyers off to hunt for codes [LPG-0058].
- **Errors and speed:** any error message, slow step or app script that blocks the cart.
- **Error handling:** do errors appear beside the field after the buyer leaves it or presses continue, not while they type and not only as a list at the top? After a card decline, a 3D Secure step or a sold-out item, does the form keep what was typed and say what failed and what to do next?
- **Phone keyboards and taps:** card, postcode and phone fields open the number keyboard; buttons and wallet options are large enough to tap first time.
- **Trust at the pay button:** a short guarantee line and a clear cost breakdown near the button do more than a wall of badges; one or two recognised seals can help an unknown store, more than that adds clutter.
- **Returning buyers:** "Already have an account?" is a link, not a wall in front of the form.

### 4. Find out why, from buyers

- **Survey:** add or read a post-purchase question "What almost stopped you buying today?" [CRO-0018]; read answers for checkout words (shipping, delivery, payment, trust, account).
- **Abandoned checkouts:** group by cart value, region and furthest step reached. With the client's yes and only where buyers consented to be contacted, call or message 10 to 20 recent abandoners and ask what stopped them [MCR-0043].
- **Abandoned checkouts by cart value band and hour:** count each abandoned checkout once by cart value band (bands set from the store's own order values, for example under half the average order, around the average, over twice the average) and once by hour of day in the store's time zone. Leavers bunched in the highest band point at shipping cost, payment limits or buy now pay later not showing; leavers bunched in the lowest band point at a shipping threshold or a fee that is large next to a small cart. A spike at odd hours with tiny carts and random emails is usually bots or card testing, not buyers: hand it to `stop-fake-orders-and-card-testing` and leave those checkouts out of the leak map. A spike in one hour on one day often marks a payment or app outage; check the gateway status for that hour. Pull only the fields the count needs (date, time, cart value, furthest step); never export buyer emails into the sheet.
- **Gateway report:** payment success rate by method. A method under about 90% success (practitioner default) is a repair, not a persuasion problem.
- **Recordings:** if installed, watch 20 cart and checkout sessions that did not convert (hand off to `review-session-recordings-and-heatmaps` for a full review).

### 5. Match each leak to a cause and a fix

| Cause | Typical evidence | Fix |
|---|---|---|
| Surprise shipping, tax or fees | Leak at shipping step; survey "too expensive" | Show shipping estimate on product page and cart; rework rates or threshold with `offer-bundle-threshold-design` |
| Slow or vague delivery | Leak at shipping step; "when will it arrive" tickets | Show a padded delivery date by postcode or ZIP |
| Forced account or OTP wall | Leak at contact step | Guest checkout; login optional |
| Too many fields | Long mobile form; recordings show retyping | Hide company and address line 2; turn on address autocomplete |
| Payment failures | Gateway success under 90% on a method | Fix gateway, add retry, add a second provider |
| Missing payment method | Survey; region split | Add wallets, local bank payments or pay on delivery with rules |
| Code hunting | Visible empty code box; exits after box | Collapse box or auto-apply live offers |
| Card distrust | Survey "not sure it's safe"; new visitors leak more | Trust lines at cart; see `trust-and-reassurance-audit` |
| Errors or slow cart | Errors in Step 3; slow cart drawer | Repair; remove the app causing it with `remove-app-bloat` |
| Form wiped after a decline or 3D Secure | Step 3 run; repeat payment attempts in gateway log | Keep the form, say what failed, offer another method |
| Errors shown only at the top | Recordings show scrolling up and down after continue | Show each error beside its field after the field or on continue |
| Odd-hour spike of tiny abandoned carts | Hour and cart value bands | Treat as bot traffic; remove from the leak map; see `stop-fake-orders-and-card-testing` |

At checkout itself, do not add a discount to stop leavers; risk reversal and shipping clarity do the job there [OFF-0009].

### 6. Size each fix in gross profit

Recovered gross profit a month = orders lost at that step x share of leavers the cause explains (from survey or abandoned-checkout grouping; if no data, 25% as a working figure, marked) x share the fix can win back (practitioner default 30%, test it) x gross profit per order. Subtract monthly cost (app fees, payment fees, extra shipping given away). Repairs (errors, failed payments, broken steps) go first regardless of size.

### 7. Order the list and assign it

Sort: repairs, then fixes by recovered gross profit per hour of work. Mark each "ship" or "test" (tests only where the store has the volume; see `design-store-ab-test`). Name the owner (store admin, developer, payment provider, courier).

### 8. Market notes

- **All markets:** check delivery coverage by postcode before the address step, any pay-on-delivery fee shown early, that buyers come back to the store after paying in a bank or wallet app on Android, one-time-code logins in third-party checkouts (fast for repeat buyers, a wall for some first-timers), and any address fields couriers need.
- **UK, EU and Australia:** prices shown to shoppers include VAT or goods and services tax, so the total should not jump at checkout. Check that the local methods for each country show (for example iDEAL, Bancontact, Klarna, PayPal).
- **US:** sales tax often appears only at checkout; show "taxes calculated at checkout" in the cart. Express wallets (Shop Pay, Apple Pay, Google Pay) should sit above the form. Check PO box and address validation errors.

## Checks before you hand it over

- The leak map shows each step's rate, planning range and orders lost per month, by device.
- At least 3 phone checkout runs are recorded with screenshots.
- Every cause has at least one piece of buyer or system evidence, labelled by type.
- Each fix shows recovered gross profit per month and its cost, with working figures marked.
- Repairs are listed first and marked ship now.
- No checkout-stage discount is proposed to stop leavers.
- No live checkout or payment change, and no buyer contact, without the client's yes.
- Abandoned checkouts are counted by cart value band and by hour, and any bot spike is taken out of the leak map.
- The phone run records how errors, declines and 3D Secure steps are handled.

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
- **Counting bots as abandoners.** Step 4 reads the hour and cart value bands and removes odd-hour spikes of tiny carts.
- **A form that empties after a declined card.** Step 3 checks recovery after declines and 3D Secure.

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

What makes this skill ours: the leak is sized in orders and gross profit per month by device before any fix is named; the agent does three real phone checkouts and reads the payment gateway's own success rate, so failed wallet, bank or card payments are caught as repairs; postcode, pay-on-delivery and one-time-code walls are checked alongside tax and wallet issues in every market; and checkout discounts are ruled out as a fix.

## Selling in India

- Check pincode serviceability before the address step, and show COD availability and any COD fee early.
- Test that UPI intent returns the buyer to the store on Android, and that failed UPI payments are caught.
- OTP-only third-party checkouts are fast for repeat buyers but a wall for some first-timers.
- Keep the landmark field couriers need.
- Split the leak by pincode zone and payment method (UPI, cards, wallets, COD).
