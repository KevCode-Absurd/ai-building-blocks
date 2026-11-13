---
name: set-up-payments-and-cod-rules
description: "Sets up how a store gets paid: the payment gateway chosen on full cost per order (fees, settlement time, refunds, disputes), UPI, cards, wallets, net banking and pay-later where they fit, accelerated checkouts, cash on delivery switched on with limits, fees and pincode rules, and a risky-order routine that holds doubtful orders before they ship. Compares gateways on the store's own order mix rather than headline rates, and covers India (UPI, COD, RTO) and the US (cards, wallets, 3D Secure). Use before launch, when payment fees look high, when COD refusals climb, or when switching gateways."
---

# Payments and cash-on-delivery rules

**You get:** a payments sheet with the chosen gateway and runner-up costed on the store's own order mix, the list of payment methods to turn on, COD rules (on or off, order limit, fee, blocked pincodes, confirmation step), a risky-order routine with hold and cancel rules, and a test log, ready for the client to approve.

## When to use

- A new store must choose its gateway and payment methods.
- Payment fees per order look high, or settlement is slow and cash is tight.
- COD is on with no limits, and refusals or fake orders are rising.
- The store is switching gateways or adding a market.
- Many orders sit in "payment pending" or fail at the payment step.

## Not for

- Nudging buyers from COD to prepaid with offers and checkout design: use `cod-and-prepaid-checkout-for-india`.
- Pincode and order-pattern rules to cut return-to-origin losses in depth: use `cut-rto-on-cod-orders`.
- Calling or messaging COD buyers to confirm: use `confirm-cod-orders-by-chat-or-call`.
- Matching payouts to orders and fees each month: use `reconcile-payouts-and-payment-fees`.

## What you need

Required:

1. **Shopify order export**, last 90 days if trading: Name, Created at, Total, Payment Method, Financial Status, Shipping Zip, Cancelled at, Refunded Amount, Risk Level if shown.
2. **Gateway quotes** in writing from 2 or 3 providers: fees by method (UPI, debit, credit, international cards, wallets, pay-later), fixed fees, settlement days, refund fee, chargeback fee, setup or annual fees.
3. **Courier COD terms**: COD fee per order, remittance days, RTO charge.
4. **Gross profit per order** by product (`store-meta-math` or `build-sku-profit-sheet`).
5. **KYC documents ready with the owner** (business PAN or EIN, bank proof). The owner uploads them; the agent never handles them.

Optional: abandoned checkout export, courier RTO report by pincode.

Comparing is level 1. Turning methods on or off and editing COD settings is level 2 in a test or unpublished state, then live with the client's yes. The agent never enters bank, card or KYC details.

## Before you start: the gates

1. **Gross profit per order known**, including payment fee and an RTO allowance for COD [MEA-0037]. Fail: work it out first; COD cannot be judged without it.
2. **Legal names match.** Gateway verification stalls when names differ from ID [SET-0005]. Fail: fix before applying.
3. **Cash need stated.** The client says how many days of settlement they can wait. COD remittance and gateway settlement lag both tie up cash.
4. **Two-step login on.** Shopify Payments requires it [SET-0005]; turn it on for every gateway dashboard too.

## Steps

### 1. Cost each gateway on the store's own mix

From the export, find the share of orders by method and average order value by method. For each gateway quote, cost per 100 orders = sum over methods of (orders x (percent fee x order value + fixed fee)) + refunds x refund fee + expected disputes x dispute fee. Add the cash cost of settlement delay if the client gave one. Pick the lowest total that offers every method buyers use. Name the runner-up.

US: Shopify Payments includes fraud analysis, dynamic 3D Secure and, for eligible US stores, chargeback protection; its card testing screening runs only on Shopify Payments [SEC-6200] [SEC-0005]. A third-party gateway can also add a Shopify transaction fee, depending on plan and country; read it from the plan page and include it.

India: Shopify Payments is not offered in every country; most India stores use a local gateway. Compare UPI pricing separately from cards, since it differs.

### 2. Turn on the methods buyers use

- **India:** UPI first (QR on desktop, app intent on mobile), cards, net banking, wallets, then pay-later only if the order value supports it.
- **US:** cards, Shop Pay, Apple Pay, Google Pay, PayPal if past orders show demand, pay-later above about $100 order value (practitioner default, test it).
- Accelerated checkouts first: Shop Pay is reported at 1.91x higher mobile checkout-to-order rate than regular checkout [SET-0008].
- Without Shopify Payments, local currency may show only up to the cart [SET-0002]; state the charge currency clearly for foreign buyers.

### 3. Decide on COD

COD is on only if: gross profit per delivered COD order minus (RTO rate x RTO cost) is positive. RTO cost = forward shipping + return shipping + damage or repack + COD fee. Use the courier's RTO report by pincode if trading; for a new store, ask the courier for its category RTO average and treat it as a starting guess.

If on, set:

1. **Order value ceiling** for COD (practitioner default: around 1.5x to 2x the average order, test it).
2. **Blocked pincodes**: those the courier cannot serve for COD, and those with RTO far above the store's average.
3. **COD fee or prepaid discount**, shown on the product page, never as a checkout surprise. Keep total add-ons under about 10% of order value [LPG-0063].
4. **Confirmation step** for COD orders before dispatch (WhatsApp or call): hand off to `confirm-cod-orders-by-chat-or-call`.
5. **Hiding COD** above the ceiling or for blocked pincodes, using a payment customisation app or the gateway's checkout tool. Try the free option first.

### 4. Risky-order routine

Shopify scores every order low, medium or high risk. Set a routine:

- **High risk:** hold fulfilment, review within 24 hours, cancel and refund if signs stack up (billing and shipping far apart, many failed payments before success, mismatched name and email, proxy IP).
- **Medium risk:** review before dispatch for high-value orders.
- **COD orders:** duplicate names or phone numbers, fake-looking addresses, many units of one item. Hold until confirmed.

Automate the holds with Shopify Flow (free) where the plan supports it. AVS is off by default on Shopify Payments because fraud analysis already screens; turning it on can raise false declines, so read the risk reports first [SEC-0003]. Card processors flag stores above about 0.9% chargebacks [SEC-0004]; deeper card-testing defence goes to `stop-fake-orders-and-card-testing`.

### 5. Refunds and settlement

Write down: refund method per payment type (UPI and cards back to source; COD refunds by bank transfer or UPI to the buyer after the return is received), the promised refund time, and who approves. Settlement days per method go into the cash forecast.

### 6. Test

Run one order per method: UPI, card, wallet, COD (with confirmation), a failed payment, a refund to source, and a COD refund. Check the order status, the email, the payout record and the fee charged against the quote.

## Checks before you hand it over

- The gateway choice shows cost per 100 orders on the store's own mix, with a runner-up.
- Every method turned on matches a real buyer need from the export or market norms.
- COD rules show the profit check, the ceiling, blocked pincodes and the fee or discount shown before checkout.
- The risky-order routine says who reviews, how fast, and what triggers a cancel.
- Test log has one order per method with fee checked against the quote.
- No bank, card or KYC detail was entered or stored by the agent.

## Output

**One-screen summary:** chosen gateway and runner-up with cost per 100 orders, methods on, COD decision with ceiling and fee, risky-order routine owner, and the changes to approve.

**Gateway comparison:**

| Gateway | UPI fee | Domestic card fee | Intl card fee | Wallet fee | Fixed fee | Settlement days | Refund fee | Dispute fee | Platform transaction fee | Cost per 100 orders (own mix) |
|---|---|---|---|---|---|---|---|---|---|---|

**COD rules:**

| Rule | Setting | Reason | Tool (built-in, free, paid) |
|---|---|---|---|

**Risky-order routine:** Risk level or pattern, Action, Owner, Time limit, Automation.

**Test log:** Method, Order no., Amount, Fee charged, Fee quoted, Payout date, Pass or fail.

## Common mistakes

- **Choosing a gateway on headline card rate.** Step 1 costs the real method mix, refunds and disputes.
- **COD on with no ceiling.** Step 3 checks profit after RTO and sets limits.
- **Surprise COD fee at checkout.** Step 3 shows it on the product page.
- **Switching on AVS by reflex.** It can block good buyers [SEC-0003].
- **No one owns held orders.** Step 4 names a reviewer and a time limit.
- **Untested refunds.** Step 6 tests refunds per method.

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

What makes this skill ours: gateways are costed on the store's own payment mix, refunds and disputes, not headline rates; COD is switched on only when profit after return-to-origin losses is positive, with limits shown before checkout; and every risky order has a named reviewer and time limit.
