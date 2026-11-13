---
name: returns-and-rto-cost-analysis
description: "A costed loss table showing what returns, refunds and failed cash-on-delivery (return-to-origin, RTO) orders really cost the store by product, pincode or ZIP area and sales channel, plus a ranked list of fixes with the money each one saves. Builds the full cost of one failed delivery and one return from courier, order and returns data, measures rates on matured order cohorts, finds the few cells that cause most of the loss, and only recommends a fix when the loss it removes beats its cost and the good orders it would turn away. Use when returns or RTO feel high, before blocking COD anywhere, when profit per order looks fine but cash does not arrive, or before changing courier or return policy."
---

# Returns and return-to-origin cost analysis

**You get:** one loss table (cost per failed delivery and per return, by product, pincode or ZIP area and channel), a ranked list of 3 to 6 fixes with money saved per month, and a one-screen summary the owner can approve.

## When to use

- Cash-on-delivery orders come back undelivered and nobody knows what each one costs.
- Return or refund rate rose and the owner wants to know which products and channels cause it.
- Profit per order looks healthy on paper but cash collected keeps falling short.
- Someone wants to block COD for some areas, change courier or tighten the return policy.
- A new channel or ad angle is scaling and its orders may come back more often.

## Not for

- Building the per-product profit sheet itself: use `build-sku-profit-sheet` (this skill feeds it the return and RTO cost lines).
- Writing the COD rules, confirmation flow or blocks: hand off to `cut-rto-on-cod-orders` and `confirm-cod-orders-by-chat-or-call`.
- Designing the returns portal and exchange flow: use `set-up-returns-and-exchanges`.
- Optimising Meta for delivered orders: use `meta-ads-for-cod-stores`.

## What you need

Required (read access, level 1):

1. **Shopify order export**, at least 90 days ending 30 days ago (so orders have matured): Name, Created at, Financial Status, Fulfillment Status, Cancelled at, Payment Method, Shipping Zip, Shipping Province, Subtotal, Shipping, Discount Amount, Refunded Amount, Lineitem sku, Lineitem quantity, Lineitem price, Tags, Source.
2. **Courier or shipping aggregator report** for the same orders: order or AWB number, pincode, final status (delivered, RTO, lost, damaged), delivery attempts, non-delivery reasons, forward freight, RTO freight, COD charge, weight billed.
3. **Returns export** from the returns app or a manual log: order, SKU, reason, item condition, outcome (refund, exchange, store credit), return freight.
4. **Landed cost per SKU** and packaging cost per order.
5. **Channel per order**: UTM or first-click source from Shopify's sales-by-referrer report or GA4, joined on order number.

Optional: ad cost per order by channel, warehouse labour cost per return, the courier contract.

If the courier report is missing, ask once; without it, RTO cost can only be estimated from order statuses, so label every RTO number "estimated". If channel data is missing, run by product and area only. This skill only reads data; any fix that changes checkout, COD rules or courier settings needs draft access (level 2) and the client's yes before it goes live.

## Before you start: the gates

1. **Gross profit per delivered order.** Pass when it is built from delivered cost: landed product, outbound shipping, packing, payment fees [MEA-0037]. Fail: build it first with `build-sku-profit-sheet`. A fix cannot be judged without knowing what a good order earns.
2. **Matured orders only.** Pass when every order in the window is at least 30 days past dispatch, or past the return window if longer. Shopify books returns on the refund date, not the order date, so recent weeks always look too clean [MEA-0011]. Fail: move the window back.
3. **Enough orders per cell.** Practitioner default, test it: 30 shipped orders per cell before quoting a rate. Below that, merge cells (see step 4).
4. **Cash and capacity.** If a fix needs calling staff or a new courier, confirm someone can do it before it goes on the list.

## Steps

### 1. Cost one failed COD delivery

Add up, from the courier report and invoices:

- forward freight (paid even though nothing was sold);
- RTO freight back to the warehouse;
- COD handling fee, if the courier charges it on failed orders;
- packing materials and pick-pack labour, now wasted;
- damage or write-off share: units returned unsellable / units returned x landed cost;
- ad cost already spent to win that order (the channel's cost per order).

Keep the ad cost as a separate column: it is spent whether the order is delivered or not, but it is the real reason RTO hurts a paid-traffic store. Stock that sits in transit for a fortnight is also cash you cannot use; note days in transit.

### 2. Cost one return

Return freight, inspection and repacking labour, any refurbishing, the processing fee you do not get back [FIN-6243], the outbound shipping you gave free, and the write-off share for items that cannot be resold. Book refurbishing and repacking into product cost and return freight as an overhead if the store follows that split [FIN-0009], but count all of it here: this table is about decisions, not the ledger. An exchange costs freight both ways but keeps the sale; a refund loses the sale.

### 3. Measure the rates on matured cohorts

- **RTO rate** = COD orders that came back / COD orders shipped. Compute prepaid failed deliveries separately; they are usually rare and have different causes.
- **Return rate** = units returned / units delivered, by SKU and by size or variant.
- **Refund rate by value** = refunded amount / delivered revenue.

Group by order month, not refund month [MEA-0011]. For the P&L, accrue expected returns at this rate on each day's sales instead of waiting for refunds to land [MEA-0028].

### 4. Cut it three ways

- **Product (SKU and variant).** High return rate on one size points to a fit or description problem.
- **Area.** India: group by full pincode where volume allows, else by the first three digits (the sorting district), else by state. US: group by the first three ZIP digits. Merge thin cells upward until each has 30 orders.
- **Channel.** Meta, Google, marketplace, influencer code, organic. Some channels bring buyers who order on impulse and refuse at the door.

Also cut by order pattern where the data allows: first order versus repeat, order value band, and orders placed late at night or with incomplete addresses.

### 5. Turn rates into money

For each cell: **loss per month = failed orders x cost per failed order + returns x cost per return**. Also compute **profit per order shipped** = (delivered orders x gross profit per delivered order minus losses) / orders shipped. Sort cells by loss per month. Usually a small share of cells carries most of the loss; name them.

A product or area that looks profitable per delivered order can lose money per shipped order. That is the number to show the owner [MEA-0023].

### 6. Read the reasons

Group non-delivery reasons (customer refused, not reachable, wrong address, fake order, delayed delivery) and return reasons (fit, not as shown, damaged, changed mind, late). Each reason points to a different owner: refusals and fake orders to COD rules, address problems to checkout, damage to packing, "not as shown" to the product page and ads, late delivery to the courier.

### 7. Price each fix

For every candidate fix: **net gain per month = losses avoided minus good orders lost x gross profit per delivered order minus the fix's running cost.** Blocking COD in an area stops RTO there but also loses buyers who would have paid; never skip that term.

Typical fixes and where they go:

| Cause | Fix | Hand off to |
|---|---|---|
| Refusals, fake orders | Confirm COD orders by WhatsApp or call before dispatch | `confirm-cod-orders-by-chat-or-call` |
| High RTO in a few areas | Prepaid nudge, partial advance or COD block for those cells | `cut-rto-on-cod-orders`, `cod-and-prepaid-checkout-for-india` |
| One channel's buyers refuse | Optimise and judge that channel on delivered orders | `meta-ads-for-cod-stores` |
| Late delivery, lost parcels | Change courier for those pincodes | `compare-shipping-carriers` |
| Fit or "not as shown" returns | Size guide, better photos, honest copy | `write-size-fit-and-how-to-use-guides` |
| Refunds that could be exchanges | Exchange-first return flow | `set-up-returns-and-exchanges` |
| Overbilled weight or RTO charges | Audit courier invoices against orders | this skill, step 8 |

For low-value items, refunding without asking for the item back can cost less than the return: a return can cost 20 to 65% of the item's cost to process, but about 9% of returns are fraudulent, so cap it by value and repeat use [CXP-0018].

Keep the customer in view: a bad return experience makes most buyers less likely to buy again [CXP-0007]. A fix that saves freight but makes returns painful can cost more in lost repeat orders.

### 8. Check the courier bills

Match billed weight, RTO charges and COD fees to the orders. Overcharging is common enough that one operator puts it at 30 to 40% of the brands he mentors [OPS-0012]. List each mismatch with the order and AWB. Raising a claim with the courier is a message on the client's behalf: draft it, and send only with the client's yes.

### India and US notes

- **India:** RTO is mostly a COD problem. Include the COD remittance lag in the cash view, and note that an RTO after a GST invoice was raised needs a credit note; confirm the treatment with the store's CA. Regional-language confirmation messages often get better answers than English ones; test it.
- **US:** COD is rare, so the weight is on returns. Free return shipping, bracketing (ordering two sizes) and card disputes are the main costs; check disputes in `reconcile-payouts-and-payment-fees`.

## Checks before you hand it over

- Cost per failed delivery and per return are built line by line, each line with its source file.
- Every rate uses matured orders grouped by order month, not refund month.
- No rate is quoted on a cell with fewer than 30 shipped orders unless marked "thin".
- Each fix shows losses avoided, good orders lost and running cost, and only fixes with a positive net gain are recommended.
- Profit per order shipped is shown next to profit per delivered order.
- Courier mismatches list order, AWB, billed and expected amounts.
- No COD rule, courier setting or customer message was changed or sent without the client's yes.

## Output

**One-screen summary:** total monthly loss from RTO and returns, as money and as a share of gross profit; the three cells that cause most of it; the recommended fixes in order with net gain per month; and up to three assumption lines where a missing cost changes the order of fixes.

**Sheet 1, cost per event:**

| Line | Failed COD delivery | Return | Source |
|---|---|---|---|
| Forward freight | | | |
| Reverse freight | | | |
| COD or processing fee lost | | | |
| Packing and labour | | | |
| Write-off share | | | |
| Ad cost per order (separate) | | | |
| **Total** | | | |

**Sheet 2, loss table:** Cut (product, area or channel), Cell, Orders shipped, Delivered, RTO rate, Return rate, Loss per month, Gross profit per delivered order, Profit per order shipped, Top reason, Thin cell (yes or no).

**Sheet 3, fix list:** Rank, Fix, Cells it covers, Losses avoided per month, Good orders lost, Running cost, Net gain per month, Owner, Hand-off skill, Needs client yes (yes or no).

**Sheet 4, courier mismatches:** Order, AWB, Billed weight, Actual weight, Billed charge, Expected charge, Difference, Claim drafted (yes or no).

## Common mistakes

- **Reading last month's returns.** Recent orders have not come back yet, and refunds land later [MEA-0011]. Step 3 uses matured cohorts.
- **Counting only return freight.** Forward freight, packing, write-offs and lost fees make the real cost much higher. Steps 1 and 2 cost every line.
- **Blocking COD on the RTO rate alone.** It also turns away good buyers. Step 7 subtracts them.
- **Rates on tiny cells.** One pincode with 4 orders and 2 RTOs is noise. Step 4 merges cells to 30 orders.
- **Fixing the courier for a product problem.** "Not as shown" returns come from the page and ads. Step 6 routes each reason to its owner.
- **Saving freight with painful returns.** It can cost repeat orders [CXP-0007].

## Sources

- MEA-0037: gross margin uses delivered cost to the door.
- MEA-0011: Shopify books returns on the refund date.
- MEA-0028: accrue returns daily at the expected rate.
- MEA-0023: product margin is not true gross margin.
- FIN-0009: where return freight and refurbishing sit in the books.
- FIN-6243 (proposed): card fees are not returned on Shopify Payments refunds.
- CXP-0018: refund without return for low-value items, with fraud caveat.
- CXP-0007: poor returns make buyers less likely to buy again.
- OPS-0012: audit courier and 3PL invoices monthly.

What makes this skill ours: it costs a failed COD delivery including the ad money already spent; it reports profit per order shipped, not just per order delivered; every fix is priced against the good orders it would turn away; and pincode cells are merged to a minimum size so nobody blocks an area on noise.
