---
name: guarantee-and-risk-reversal
description: "A guarantee buyers trust and the store can afford: the guarantee type matched to the product and the buyer's biggest fear (money back, free exchange, repair-first warranty, results trial or returnless refund), its exact terms, the expected claim cost per order and the conversion lift it must buy to pay, the cash it ties up, and the lines and placements that show it on product page, cart, checkout and ads. Keeps 'money back' and 'lifetime' claims inside US advertising rules and states statutory rights in India. Use when buyers hesitate on a new or pricey product, when the current returns promise is vague, or when the owner wants a bolder guarantee but fears refunds."
---

# Guarantee and risk reversal

**You get:** a guarantee pack: the chosen guarantee and runner-up, the full terms text for the policy page, a cost model (claim rate, cost per claim, cost per order, conversion lift needed, cash held), the short guarantee line and badge text, where each goes, and the claim-handling rules for support.

## When to use

- Survey answers, chats or abandoned checkouts show fear of wasting money ("will it work", "will it fit", "will it last").
- A new product or brand has few reviews and needs a reason to try it.
- The returns policy is generic and nobody uses it to sell.
- The owner wants a longer or bolder guarantee and needs the cost first.

## Not for

- Writing every store policy page: use `write-store-policy-pages` (this skill hands it the guarantee terms).
- Finding every doubt across the journey: use `trust-and-reassurance-audit`.
- Analysing what returns and RTO already cost: use `returns-and-rto-cost-analysis`.
- Handling a single angry claim: use `handle-angry-customer-escalations`.

## What you need

Required:

1. **Shopify order and refund data**, 6 to 12 months: orders, refunds, refund reasons, refund amounts by product.
2. **Returns or RTO report** by product and reason, from the returns app or courier.
3. **Gross profit per order** from `build-sku-profit-sheet`.
4. **The buyer's biggest fear**, from at least one of: post-purchase survey "what almost stopped you", pre-sale chats, reviews, abandoned-checkout replies.
5. **Current policy text** and the Shopify return rules set up.

Optional: a competitor's guarantee terms (live page, dated), cash plan.

If no source shows the buyer's fear, run a two-question post-purchase survey first [CRO-0018] and use chat logs meanwhile. Changing policy pages or return settings needs draft access (level 2); publishing needs the client's yes.

## Before you start: the gates

1. **Gross profit per order known.** Fail: stop.
2. **Cash.** The store must be able to refund every expected claim inside the window. A long guarantee is a liability the cash plan must carry. Fail: shorten the window.
3. **Product truth.** The product must do what the guarantee implies. A lifetime promise on a product that wears out buries the brand in claims [OFF-0064]. Fail: pick a narrower guarantee.
4. **Legal floor.** The guarantee adds to the buyer's legal rights; it never replaces them. In the US, "money back" must mean the full purchase price on request, with conditions stated in the ad [OFF-6501], and "lifetime" must say whose lifetime [OFF-6502].

## Steps

### 1. Name the fear

Sort the evidence into fears and count them: does it work for me, will it fit, will it last, is the store real, what if it arrives damaged. Pick the one with the most mentions among people who nearly did not buy. One guarantee answers one fear well.

### 2. Match the guarantee type

| Fear | Product | Guarantee type |
|---|---|---|
| Will it work | consumables, skincare, supplements | money back on the first order, long window [OFF-0060] |
| Will it work, slow results | products with delayed effect | results trial with a guided first 60 to 90 days [CXP-0003] |
| Will it fit | apparel, footwear | free first exchange, prepaid label |
| Will it last | durable goods | repair-first warranty for a stated period [OFF-0064] |
| Damaged or wrong item | all | replace or refund, photo claim, no return needed under a value line |

For cheap items, a refund without a return can cost less than shipping the item back; returns can cost 20 to 65% of the item's cost to process. Apply it case by case through support, not as advertised policy, because about 9% of returns are fraudulent [CXP-0018].

On low-ticket consumables, one agency reports that a longer window (say 180 days) drew fewer claims than 30 days because buyers stop tracking the deadline [OFF-0060]. That is a practitioner pattern, not a study: test it, and do not use it for high-ticket or resellable goods.

### 3. Cost it

Per order:

- Expected claim rate: from the store's own refund rate for that reason; for a new guarantee use the current rate plus a margin (practitioner default: add half again, test it).
- Cost per claim = refund amount + outbound shipping not recovered + return shipping if the store pays + unsellable unit cost + the card fee, which is not refunded on Shopify Payments refunds [FIN-6243].
- Guarantee cost per order = claim rate x cost per claim.
- Conversion lift needed to pay = guarantee cost per order / gross profit per order. If gross profit per order is 400 and the guarantee costs 20 per order, conversion must rise 5% just to break even.
- Cash held = expected claims inside the window x cost per claim.

Show the lift needed beside the store's real conversion rate. If the lift needed is above about 10% (practitioner default), narrow the guarantee.

### 4. Write the terms

Include, in plain words:

- What is covered and for how long, counted from delivery.
- What the buyer must do: contact route, photo if damaged, return or not, opened or unopened.
- What they get: full refund, exchange, repair, store credit (say which; store credit is not "money back").
- How fast: refund within a stated number of days. Fast refunds protect repeat buying [CXP-0015] [CXP-0007].
- Limits: one claim per customer per product, first order only if so.
- Set the matching return rules in Shopify (window, return shipping fee, per-product overrides) so the system agrees with the page [CXP-6284].

### 5. Show it where the fear happens

- Product page: one line directly under the add-to-cart button, with a link to the terms [LPG-0038]. If buyers object to price, trust and risk reducers placed near the price and button helped in agency tests [LPG-0017].
- Cart: a short trust bar (guarantee, returns, support) instead of a discount box when no promotion runs [LPG-0058].
- Checkout and exit: risk reversal, not a discount, for people about to buy [OFF-0009].
- Bundles: if the fear is "will it last", attaching the stronger guarantee to the bigger bundle gives buyers a reason to step up.
- Ads and email: the same words as the page; never a stronger promise than the terms.

### 6. Set claim handling

Give support a one-page rule: who approves, what evidence, refund route, and a flag for customers with more than one claim. Track claim rate and cost per claim by product each month; narrow cover on any product whose claims climb [OFF-0064].

### 7. India and US notes

- **India:** refunds for cash-on-delivery orders go to a bank account or UPI ID the buyer gives; state the time. Write terms in plain English plus the main regional language if the store sells in it. Keep the buyer's legal rights for defective goods; do not write "no returns" where the law gives one.
- **US:** call it a money-back guarantee only if the full price is refunded on request [OFF-6501]; state any condition next to the claim, and define any "lifetime" period [OFF-6502].

## Checks before you hand it over

- The guarantee answers the most common fear, with the evidence count.
- Cost per order, lift needed and cash held are shown with the store's own refund data.
- Terms say what is covered, how long, what the buyer does, what they get and how fast.
- Shopify return rules match the written terms.
- "Money back" means full price; "lifetime" is defined.
- Ads, product page and cart use the same words as the terms.
- Support has claim rules and a repeat-claim flag.
- Nothing was published without a client yes.

## Output

**One-screen summary:** the guarantee in one sentence, the fear it answers, cost per order, conversion lift needed, cash held, runner-up in one line.

**Cost model table:** Product | Fear | Guarantee type | Claim rate | Cost per claim | Cost per order | Gross profit per order | Lift needed | Cash held.

**Terms text** for the policy page, ready to paste. **Guarantee lines:** product page line (under 12 words), cart trust bar text, ad line, email block. **Support rule card.** **To confirm:** window length, refund method, store credit or cash.

## Common mistakes

- **Copying a famous guarantee.** Step 2 matches the type to the product and fear.
- **Costing refunds only.** Step 3 adds lost shipping, unsellable units and fees.
- **"Money back" that is really store credit.** Step 4 and the US note keep the words honest.
- **A promise the system does not match.** Step 4 sets Shopify rules to the terms.
- **Guarantee hidden in the footer.** Step 5 puts it under the button and in the cart.
- **Lifetime cover on things that wear out.** The gates block it.

## Sources

- CRO-0018: post-purchase survey for near-miss reasons.
- OFF-0060: long guarantees on low-ticket consumables (practitioner pattern).
- OFF-0064: lifetime warranties only on durable goods, repair first.
- CXP-0003: results trial for slow-effect products.
- CXP-0018: refund without return under a value line.
- FIN-6243: card fees not refunded on refunds.
- CXP-0015, CXP-0007: fast refunds protect repeat buying.
- CXP-6284: Shopify return rules.
- LPG-0038, LPG-0017, LPG-0058, OFF-0009: where risk reducers go.
- OFF-6501, OFF-6502: US money-back and lifetime claims.

What makes this skill ours: the guarantee is picked from the buyer's counted fear and the product type, not from a famous brand; the cost model turns the promise into the conversion lift it must buy and the cash it ties up; the system's return rules are set to match the words; and support gets a claim rule so a bold promise does not become an abuse channel.
