---
name: set-up-payments-and-cod-rules
description: "Sets up how a store gets paid, in any country: the payment gateway chosen on full cost per order (fees, settlement time, refunds, disputes), cards, wallets, local bank methods and buy now, pay later where they fit, accelerated checkouts, pay on delivery switched on only with limits, fees and delivery-area rules where buyers expect it, and a risky-order routine that holds doubtful orders before they ship. Compares gateways on the store's own order mix rather than headline rates, and covers cards and 3D Secure, local favourites such as iDEAL, Klarna or Interac, and failed-delivery risk. Use before launch, when payment fees look high, when refused or unpaid orders climb, or when switching gateways."
---

# Payments and pay-on-delivery rules

**You get:** a payments sheet with the chosen gateway and runner-up costed on the store's own order mix, the list of payment methods to turn on, pay-on-delivery rules where the market uses it (on or off, order limit, fee, blocked delivery areas, confirmation step), a risky-order routine with hold and cancel rules, and a test log, ready for the client to approve.

## When to use

- A new store must choose its gateway and payment methods.
- Payment fees per order look high, or settlement is slow and cash is tight.
- Pay on delivery or invoice payment is on with no limits, and refusals, unpaid orders or fake orders are rising.
- The store is switching gateways or adding a market.
- Many orders sit in "payment pending" or fail at the payment step.

## Not for

- Nudging buyers from pay on delivery to paying upfront with offers and checkout design: use `cod-and-prepaid-checkout-for-india`.
- Delivery-area and order-pattern rules to cut refused and failed deliveries in depth: use `cut-rto-on-cod-orders`.
- Calling or messaging pay-on-delivery buyers to confirm: use `confirm-cod-orders-by-chat-or-call`.
- Matching payouts to orders and fees each month: use `reconcile-payouts-and-payment-fees`.

## What you need

Required:

1. **Shopify order export**, last 90 days if trading: Name, Created at, Total, Payment Method, Financial Status, Shipping Zip, Cancelled at, Refunded Amount, Risk Level if shown.
2. **Gateway quotes** in writing from 2 or 3 providers: fees by method (debit, credit, international cards, wallets such as Apple Pay, Google Pay and PayPal, local bank methods, buy now, pay later), fixed fees, currency conversion fees, settlement days, refund fee, chargeback fee, setup or annual fees.
3. **Courier pay-on-delivery terms**, only if the store will offer it: cash handling fee per order, remittance days, and the charge for a refused or undelivered parcel sent back.
4. **Gross profit per order** by product (`store-meta-math` or `build-sku-profit-sheet`).
5. **Identity and business documents ready with the owner** (the business tax or company number, such as an EIN, VAT number, company registration or ABN, plus bank proof). The owner uploads them; the agent never handles them.

Optional: abandoned checkout export, courier report of refused and failed deliveries by postcode or ZIP code.

Comparing is level 1. Turning methods on or off and editing pay-on-delivery settings is level 2 in a test or unpublished state, then live with the client's yes. The agent never enters bank, card or identity verification details.

## Before you start: the gates

1. **Gross profit per order known**, including payment fee and, for pay on delivery, an allowance for refused and failed deliveries [MEA-0037]. Fail: work it out first; pay on delivery cannot be judged without it.
2. **Legal names match.** Gateway verification stalls when names differ from ID [SET-0005]. Fail: fix before applying.
3. **Cash need stated.** The client says how many days of settlement they can wait. Gateway settlement lag, buy now, pay later payouts and pay-on-delivery remittance all tie up cash.
4. **Two-step login on.** Shopify Payments requires it [SET-0005]; turn it on for every gateway dashboard too.

## Steps

### 1. Cost each gateway on the store's own mix

From the export, find the share of orders by method and average order value by method. For each gateway quote, cost per 100 orders = sum over methods of (orders x (percent fee x order value + fixed fee)) + refunds x refund fee + expected disputes x dispute fee. Add the cash cost of settlement delay if the client gave one. Pick the lowest total that offers every method buyers use. Name the runner-up.

Shopify Payments includes fraud analysis, dynamic 3D Secure and, for eligible US stores, chargeback protection; its card testing screening runs only on Shopify Payments [SEC-6200] [SEC-0005]. A third-party gateway can also add a Shopify transaction fee, depending on plan and country; read it from the plan page and include it.

Shopify Payments is not offered in every country; where it is not, compare local gateways (for example Stripe, Adyen, PayPal, Mollie or a national provider). Price local bank methods, international cards and currency conversion separately from domestic cards, since they differ a lot. In the EU and UK, check that the gateway handles Strong Customer Authentication (3D Secure 2) without extra declines.

### 2. Turn on the methods buyers use

- **Everywhere:** cards, Shop Pay, Apple Pay, Google Pay, PayPal if past orders show demand, buy now, pay later (Klarna, Afterpay or Clearpay, Affirm) above about 100 in order value in the store's currency (practitioner default, test it).
- **Local favourites:** the methods buyers in each market expect, for example iDEAL in the Netherlands, Bancontact in Belgium, BLIK in Poland, Sofort or Klarna in Germany and Austria, Interac in Canada, Pix in Brazil, Konbini in Japan, and bank-app or QR payments where they lead. The payment settings list methods by country.
- Accelerated checkouts first: Shop Pay is reported at 1.91x higher mobile checkout-to-order rate than regular checkout [SET-0008].
- Without Shopify Payments, local currency may show only up to the cart [SET-0002]; state the charge currency clearly for foreign buyers.

### 3. Decide on pay on delivery

Most stores in the US, UK, Canada, Australia and northern Europe do not need it. Where buyers do expect it (parts of eastern and southern Europe, the Middle East, Latin America, South and Southeast Asia, Africa), or where invoice payment is common, it is on only if: gross profit per delivered pay-on-delivery order minus (refusal rate x cost of a refused parcel) is positive. Cost of a refused parcel = forward shipping + return shipping + damage or repack + cash handling fee. Use the courier's refused-delivery report by postcode if trading; for a new store, ask the courier for its category average and treat it as a starting guess.

If on, set:

1. **Order value ceiling** for pay on delivery (practitioner default: around 1.5x to 2x the average order, test it).
2. **Blocked delivery areas**: postcodes or regions the courier cannot serve for cash collection, and those with refusals far above the store's average.
3. **Pay-on-delivery fee or pay-now discount**, shown on the product page, never as a checkout surprise, and only where local rules allow a payment surcharge. Keep total add-ons under about 10% of order value [LPG-0063].
4. **Confirmation step** for pay-on-delivery orders before dispatch (message or call): hand off to `confirm-cod-orders-by-chat-or-call`.
5. **Hiding pay on delivery** above the ceiling or for blocked areas, using a payment customisation app or the gateway's checkout tool. Try the free option first.

The same logic applies to buy now, pay later and invoice methods: the provider usually carries the credit risk, so the check is the fee against the lift in conversion and order value.

### 4. Risky-order routine

Shopify scores every order low, medium or high risk. Set a routine:

- **High risk:** hold fulfilment, review within 24 hours, cancel and refund if signs stack up (billing and shipping far apart, many failed payments before success, mismatched name and email, proxy IP).
- **Medium risk:** review before dispatch for high-value orders.
- **Pay-on-delivery orders:** duplicate names or phone numbers, fake-looking addresses, many units of one item. Hold until confirmed.

Automate the holds with Shopify Flow (free) where the plan supports it. AVS is off by default on Shopify Payments because fraud analysis already screens; turning it on can raise false declines, so read the risk reports first [SEC-0003]. Card processors flag stores above about 0.9% chargebacks [SEC-0004]; deeper card-testing defence goes to `stop-fake-orders-and-card-testing`.

### 5. Refunds and settlement

Write down: refund method per payment type (cards, wallets and bank methods back to source; buy now, pay later refunds through the provider; pay-on-delivery refunds by bank transfer to the buyer after the return is received), the deadline local law sets (for example 14 days from cancellation under EU and UK distance selling rules), the promised refund time, and who approves. Settlement days per method go into the cash forecast.

### 5b. Checkout settings that sit beside payments

Payment rules and provider screens change often and differ by country. If you can browse, read the provider's current help pages for account setup, bank account requirements and checkout form options, and record the page and the date checked beside each setting; if you cannot, mark each provider or regional rule "not checked" until the owner confirms it on screen. Never infer a rule from a continent, a brand's size or a business number alone.

- **Business type and names:** use the actual legal business type in the provider's country categories, and names exactly as on government ID (Robert, not Rob) [SET-0005]. A mismatch is a blocker. Do not promise a review time; point the owner to the provider's current page.
- **Bank account:** the owner confirms the account type, currency and transfer network the provider accepts for their country. The agent asks only which type it is, never for the number.
- **Capture:** automatic at checkout, unless the owner wants to review orders before charging (manual capture), for example for made-to-order goods.
- **Checkout fields:** ask for email or phone as the contact, not both as required; company name and address line 2 optional; guest checkout on. Each required field is a reason to leave.
- **Marketing consent boxes:** keep email and SMS consent separate from the contact details needed for the order. Check the platform's current controls and the rules for each region before choosing pre-ticked or unticked; never pre-tick because the brand is new or the list is small, and never treat a collected email as consent. Where a region's rule is unclear, leave it unticked and suggest a qualified person reviews it. This is not legal advice.
- **Order limits:** set a per-order quantity limit when stock is low or resellers bulk-buy a launch.
- **Customer accounts:** prefer Shopify's new customer accounts (code sign-in, no password to forget), and consider turning on self-serve returns and store credit there.
- **Show costs early:** a "free shipping over X" line in the announcement bar or cart, and a delivery promise by day ("arrives by Thursday") rather than a vague range, so the total does not surprise at the last step.
- **Recovery:** check which abandoned checkout and abandoned cart emails are on and their rules (for example skipping buyers emailed recently); do not assume the defaults. Message recovery by WhatsApp or SMS only with the buyer's consent; check what plan, app and per-message cost it needs first.
- **WooCommerce:** a PayPal personal account will not connect; it must be a business account. Connect each gateway, run its connection test and place a test order with the gateway's test card, then stop: switching a gateway to Live is a separate step that needs the owner's clear yes, and the owner does it.

Score the setup as a custom checklist (our own scale, not a payout risk forecast): start at 100, take off 20 for each blocker (could stop payouts or break a consent rule), 8 for each risk (costs sales or may cause a hold) and 3 for each polish item; stop at 0; show the sum and how many items were checked. A setting not checked takes nothing off and is listed as not checked; any confirmed blocker means fix before launch, whatever the score.

### 6. Test

Run one order per method: card, wallet, each local method, buy now, pay later, pay on delivery if on (with confirmation), a failed payment, a refund to source, and a pay-on-delivery refund. Check the order status, the email, the payout record and the fee charged against the quote.

## Checks before you hand it over

- The gateway choice shows cost per 100 orders on the store's own mix, with a runner-up.
- Every method turned on matches a real buyer need from the export or market norms.
- Pay-on-delivery rules, if on, show the profit check, the ceiling, blocked areas and the fee or discount shown before checkout.
- The risky-order routine says who reviews, how fast, and what triggers a cancel.
- Test log has one order per method with fee checked against the quote.
- No bank, card or identity verification detail was entered or stored by the agent.
- Every provider or regional rule behind a setting has a source and date checked, or is marked not checked.
- Consent boxes are set by region with the reason, and none is pre-ticked by default.
- The checklist score shows its sum and coverage, with blockers listed first.
- No gateway was switched to Live by the agent.

## Output

**One-screen summary:** chosen gateway and runner-up with cost per 100 orders, methods on, pay-on-delivery decision with ceiling and fee, risky-order routine owner, and the changes to approve.

**Gateway comparison:**

| Gateway | Local method fee | Domestic card fee | Intl card fee | Wallet fee | Fixed fee | Settlement days | Refund fee | Dispute fee | Platform transaction fee | Cost per 100 orders (own mix) |
|---|---|---|---|---|---|---|---|---|---|---|

**Pay-on-delivery rules** (if on):

| Rule | Setting | Reason | Tool (built-in, free, paid) |
|---|---|---|---|

**Risky-order routine:** Risk level or pattern, Action, Owner, Time limit, Automation.

**Test log:** Method, Order no., Amount, Fee charged, Fee quoted, Payout date, Pass or fail.

## Common mistakes

- **Choosing a gateway on headline card rate.** Step 1 costs the real method mix, refunds and disputes.
- **Pay on delivery with no ceiling.** Step 3 checks profit after refused parcels and sets limits.
- **Surprise payment fee at checkout.** Step 3 shows it on the product page.
- **Missing the local method.** Step 2 turns on the methods each market expects.
- **Switching on AVS by reflex.** It can block good buyers [SEC-0003].
- **No one owns held orders.** Step 4 names a reviewer and a time limit.
- **Untested refunds.** Step 6 tests refunds per method.
- **Pre-ticked marketing boxes everywhere.** Step 5b sets consent by region and never assumes it.
- **Names that do not match ID.** Step 5b fixes them before verification stalls payouts [SET-0005].
- **Phone and email both required at checkout.** Step 5b asks for one contact field.

## Sources

- SET-0002: without Shopify Payments, checkout charges the base currency.
- SET-0005: verification name matching; two-step login required.
- SET-0008: Shop Pay mobile checkout figure.
- SEC-0003: AVS off by default; can raise false declines.
- SEC-0004: chargeback rate thresholds and cost.
- SEC-0005: dynamic 3D Secure and liability shift.
- SEC-6200: Shopify Payments card testing screening.
- LPG-0063: keep checkout add-ons under about 10% of order value.
- MEA-0037: gross margin uses delivered cost.

What makes this skill ours: gateways are costed on the store's own payment mix, refunds and disputes, not headline rates; pay on delivery is switched on only where buyers expect it and profit after refused parcels is positive, with limits shown before checkout; and every risky order has a named reviewer and time limit.

## Selling in India

Selling in India? Ishita (ishita-india-commerce) owns COD, RTO, quick commerce, Indian marketplaces and GST; hand those parts to her. Shopify Payments is not offered in India; most stores use a local gateway, and UPI pricing differs from cards, so cost it separately. Turn on UPI first (QR on desktop, app intent on mobile), then cards, net banking, wallets, and pay-later only if order value supports it. COD is on only if profit per delivered COD order minus (RTO rate x RTO cost) is positive; set a ceiling, block weak pincodes, show any COD fee on the product page, and confirm orders by WhatsApp or call. KYC needs the business PAN. Refund COD orders by bank transfer or UPI after the return arrives.
