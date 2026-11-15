---
name: store-meta-math
description: "Works out the money lines a store needs before judging any Meta ad: gross profit per purchase after product cost, shipping, payment fees, returns and cash-on-delivery losses; break-even and target ROAS; target cost per purchase; MER and new-customer MER; first-order versus 90-day value; marginal cost of extra sales; and the most daily spend the stock and cash can carry. Needs no ad account access, only the store's own exports. Use it first, before an audit, a budget change, a new offer or a sale, and whenever someone quotes a ROAS without saying whether it is profitable."
---

# Store money lines for Meta ads

**You get:** the store's money lines for Meta (gross profit per purchase, break-even and target ROAS and cost per purchase, offer break-evens and daily spend ceilings) in tables and a CSV or live sheet.

Five lines every other Meta edition judges against: gross profit per purchase, break-even ROAS, target cost per purchase, new-customer MER and the spend ceiling. Worked examples use round **illustrative numbers**, not benchmarks; replace each with the store's data.

## When to use

- Before any Meta audit, budget change or scaling call, so there is a break-even line to judge against.
- Before a sale, a new bundle or a new discount code, because each offer has its own break-even.
- When Meta counts orders that later fail: parcels returned undelivered, refused at the door, or with payments that fail or are reversed.
- When the owner asks how much more they can spend without running out of stock or cash.

## Not for

- Checking whether Meta's purchase numbers match real orders: use `store-meta-attribution`.
- Fixing the pixel, Conversions API or event values: use `store-meta-capi`.
- Deciding which campaigns get more or less money: use `store-meta-budget`, which takes these lines as input.
- Sizing a test or reading its result: use `store-meta-test`.

## What you need

Required (read access, level 1, for everything in this skill):

1. **Shopify order export**, last 90 days at least, 12 months if the store has them. Columns: Name, Created at, Financial Status, Subtotal, Discount Amount, Shipping, Taxes, Total, Refunded Amount, Payment Method, Lineitem sku, Lineitem quantity, Customer email or Id. WooCommerce: the equivalent order CSV.
2. **Landed cost per SKU**: purchase price plus inbound freight, duty and the branded retail box [FIN-0007] [FIN-0008]. From Shopify's "Cost per item" field or the store's cost sheet.
3. **Fulfilment cost per order**: pick, pack, shipping carton and outbound postage, from the 3PL or courier invoice.
4. **Payment fees**: percent and fixed fee per order, from the gateway statement.
5. **Return rate** and return cost per returned order (return postage, handling, share of items that cannot be resold).
6. **Total ad spend by month across all channels**, and Meta spend on its own.

Required if more than a few orders fail after they are placed: share of orders that fail (undelivered, refused, payment failed or reversed), by payment method, any fee for the payment method (for example a pay on delivery fee), and return shipping cost on failed parcels, from the courier, shipping app or payment provider export.

Optional: stock per SKU, reorder lead time, cash set aside for ads, and payout timing.

If an input is missing, ask once. If the client skips it, use a stated assumption and mark that line "low confidence".

## Before you start: the gates

1. **Gross profit per purchase.** Pass when every cost line above has a number from the store. Fail when the only margin offered is "product margin" (price minus unit cost). That figure overstates margin badly [MEA-0023] [MEA-0037]. On a fail, compute it here with the store's invoices; do not pass any ROAS judgement until it exists.
2. **Cash and stock limits.** Pass when the client has stated the most they will spend per month and which SKUs are short. Fail: compute steps 9 and 10 with what you have and label the ceilings "provisional".
3. **Data trust.** Meta tracking does not gate this skill; the order export does. Pass when test, staff and cancelled orders are removed. Shopify books refunds on the refund date, not the order date, so accrue returns at the expected rate rather than reading last month's refunds [MEA-0011] [MEA-0028].

## Steps

### 1. Net revenue per order

Net revenue per order = (Subtotal minus Discount Amount plus Shipping charged) divided by orders. Leave tax out [MEA-0010]. Shopify's dashboard AOV leaves out shipping charged, so rebuild it from the export [MEA-0013].

### 2. Gross profit per kept order

Gross profit per kept order = net revenue minus landed product cost minus fulfilment minus payment fees.

Illustrative: net revenue 60, landed cost 18, fulfilment 8, payment fee 3% plus 0.30 = 2.10. Gross profit per kept order = 60 minus 18 minus 8 minus 2.10 = **31.90**.

### 3. Returns

A return loses the revenue, keeps the shipping and fee costs, adds return costs, and loses unsellable stock:

Loss per returned order = fulfilment + payment fee + return postage and handling + (unsellable share x landed cost).

Expected gross profit per purchase = (1 minus return rate) x kept-order profit minus return rate x loss per returned order.

Illustrative: return rate 10%, return postage and handling 7, 20% of returns unsellable. Loss per return = 8 + 2.10 + 7 + 3.60 = 20.70. Expected gross profit = 0.9 x 31.90 minus 0.1 x 20.70 = **26.64**.

Repack labour is a product cost; return postage is an overhead in the books but still counts here [FIN-0009].

### 4. Failed deliveries and unpaid orders (where it applies)

Meta records a Purchase when the order is placed, but a failed order never pays. So the line that matters is gross profit **per placed order**, the same thing Meta counts. Practitioner default, test it against your courier and payment data: work this out separately for orders paid at checkout and orders paid later (pay on delivery, invoice), since the second group fails far more often.

Loss per failed order = forward shipping + return shipping + payment method fee + packing + damaged share x landed cost.

Illustrative, in the store's own currency: delivered order profit 450; loss per failed order 180; paid-later orders are 60% of orders with 25% failing, so 15% of all placed orders come back. Gross profit per placed order = 0.85 x 450 minus 0.15 x 180 = **355.50**, about a fifth below the headline 450.

### 5. Break-even ROAS and break-even cost per purchase

Break-even cost per purchase = expected gross profit per placed purchase.
Break-even ROAS = Meta purchase value per purchase divided by expected gross profit per purchase.

Use the value Meta actually receives (check with `store-meta-capi`: subtotal, total, with or without tax). Illustrative: Meta value per purchase 60, gross profit 26.64. Break-even cost per purchase **26.64**; break-even ROAS = 60 / 26.64 = **2.25**.

This is "1 divided by gross margin" [OFF-0065], built from delivered costs. Recompute it for every offer: a discount cuts price but not cost [OFF-0069] [OFF-0016]. Illustrative: 20% off takes net revenue from 60 to 48 while costs barely move, so expected gross profit drops from 26.64 to about 16 and break-even ROAS rises from 2.25 to about 3.0.

### 6. Target cost per purchase: first order versus 90 days

Meta's cost per purchase includes returning customers. For acquisition, use new-customer CAC = total ad spend divided by new customers from the store export.

- **First-order rule (default):** target CAC at or below first-order gross profit, so the first order pays back the ad [MEA-0026].
- **90-day rule:** 90-day gross profit per new customer = first-order profit + repeat profit within 90 days, measured only on cohorts at least 90 days old. Target CAC = 90-day gross profit divided by 2 to 3 [MEA-0020] [MEA-0024].

Illustrative: 200 new customers in May, first-order profit 26.64 each; by day 90 they placed 50 repeat orders at 30 profit, so +7.50 each and 90-day profit = 34.14. Target CAC on the 90-day rule = 34.14 / 2 = 17.07. Target ROAS = Meta value per purchase / target cost per purchase = 60 / 17.07 = **3.51**.

Which wins: use the **lower** of the two unless the store has measured repeat on real cohorts and passes the cash gate; then the 90-day rule may allow a first-order loss [MEA-0044]. Never accept a first-order loss on assumed repeat. Sanity check only: 365-day profit lift over the first order is about 55% in fashion, 110% in consumables, near zero in furniture [MEA-0052].

### 7. MER and new-customer MER

MER = total store net revenue divided by total ad spend, all channels.
New-customer MER (aMER) = new-customer net revenue divided by total ad spend [MEA-0025] [MEA-0039].

Illustrative month: spend 10,000; net revenue 40,000, so MER 4.0; new-customer revenue 22,000, so aMER 2.2. Against a break-even of 2.25, acquisition is roughly break-even on the first order; profit comes from repeat. MER can rise while new-customer efficiency falls, so aMER decides acquisition questions. Read it weekly or monthly.

### 8. Marginal cost of the next sales

Marginal CAC = extra spend divided by extra new customers between two periods [ADC-0049].

Illustrative: spend rises from 300 to 400 a day; new customers rise from 15 to 18. Average CAC goes from 20 to 22.22, which looks fine, but the extra 3 customers cost 100 / 3 = **33.33** each, above the 26.64 break-even. Stop raising spend where marginal cost per purchase reaches break-even.

### 9. Spend ceiling from stock

Days of cover = sellable units divided by units sold per day. If days of cover are shorter than the reorder lead time, cap or pause ads on that SKU rather than pay to sell out [ADC-0023]. Base demand on in-stock days only [OPS-0014].

Most ad-driven units per day = (stock minus safety stock) / days until restock lands, minus organic units per day.
Daily Meta spend ceiling for the SKU = ad-driven units per day / units per order x cost per purchase.

Illustrative: 600 units, 100 safety stock, restock in 40 days gives 12.5 units a day; 4.5 sell without ads, so 8 can come from ads; 1 unit per order at 20 per purchase gives a ceiling of **160 a day**.

### 10. Spend ceiling from cash

Ads are paid now; order cash arrives after the gateway payout and, for pay on delivery, the courier remittance. Stock-and-loan funded growth can push profit to near zero [FIN-0011].

Cash tied up = (daily ad spend + daily landed cost of units you must reorder) x days until order cash lands.

Illustrative: 500 a day of ads at 20 per purchase is 25 orders; reordering 25 units at 18 is 450 a day; cash lands after 10 days. The store needs (500 + 450) x 10 = **9,500** on hand before raising spend to that level.

Slow C and D stock is the exception: it may run at break-even or a small loss to turn it into cash [FIN-0026]. Label any such line "clearance" so nobody judges it on the main target.

## Checks before you hand it over

- Gross profit per purchase includes product, inbound freight, fulfilment, payment fees and returns, and failed delivery losses where they exist.
- Break-even ROAS uses the same value definition Meta receives.
- Every discount or bundle in the plan has its own break-even line.
- Target CAC states which rule set it (first order or 90 day) and why.
- aMER uses new-customer revenue from the store, not Meta's figures.
- Stock and cash ceilings are shown per SKU or per month, with the date they were computed.
- Every example number is replaced by store data or marked as an assumption.

## Output

**Summary, one screen:** gross profit per purchase, break-even ROAS, break-even and target cost per purchase, aMER now, and the daily spend ceiling with the limit that sets it (stock, cash or marginal cost). Then one line: "Profitable now / break-even / losing money on the first order."

**Table "Money lines":** Line, Formula, Value, Inputs used, Source and date, Confidence (high, medium, low).

**Table "Offer break-evens":** Offer, Net revenue, Gross profit, Break-even ROAS, Break-even cost per purchase.

**Table "Spend ceilings":** SKU or store, Days of cover, Lead time, Ad-driven units a day, Daily spend ceiling, Cash needed.

**File:** `store-money-lines.csv`, or a Google Sheet with live formulas the client can change. No paid tool is needed.

## Common mistakes

- **Product margin as gross margin.** A 70% "margin" can be 24% once delivered [MEA-0023]. Step 2 builds profit from the door back.
- **Meta value and break-even on different bases.** Value with tax against profit without tax makes break-even look easy. Step 5 uses Meta's own value definition.
- **Ignoring failed orders.** Orders that never pay still count in Meta. Step 4 measures profit per placed order.
- **Reading returns by refund date.** Returns from a strong month land later and fake a dip [MEA-0011]. The gate accrues them.
- **Scaling on average CAC.** Step 8 checks the last sale, not the average.
- **Daily ROAS panic.** Below about 1,000 a day, swings are normal; judge over 7 days or more [ADC-0064].

## Sources

- MEA-0010, MEA-0013: Shopify cash collected and AOV definitions.
- MEA-0011, MEA-0028: returns land on the refund date; accrue them.
- MEA-0020, MEA-0024, MEA-0026, MEA-0044, MEA-0052: first-order and time-bound profit targets.
- MEA-0023, MEA-0037: gross margin is delivered cost to the door.
- MEA-0025, MEA-0039: new-customer MER over blended MER.
- FIN-0007, FIN-0008, FIN-0009: what counts as product cost.
- FIN-0011, FIN-0026: cash limits growth; slow stock may run at break-even.
- OFF-0016, OFF-0065, OFF-0069: recompute break-even for each offer.
- ADC-0023, OPS-0014: tie ad spend to stock cover.
- ADC-0049: scale on marginal, not average, CAC.
- ADC-0064: daily ROAS swings are normal at low spend.

Coverage checked against the open-source meta-ads skill set (MIT), https://github.com/AI-Marketing-Hub/meta-ads.

What this skill does that the open-source one did not: builds gross profit per purchase from delivered costs, returns and failed delivery losses instead of a single margin percent; splits first-order and 90-day targets and says which wins; adds marginal cost of extra sales; and sets daily spend ceilings from stock cover and cash timing.

## Selling in India

- COD and RTO are the big case for step 4. Split prepaid and COD, use the courier's RTO rate and COD fee, and work in rupees.
