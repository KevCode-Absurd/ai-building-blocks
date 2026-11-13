---
name: monthly-store-pnl
description: "A monthly profit and loss statement laid out for an online store, from gross sales through discounts, returns, landed product cost, delivery costs and marketing down to contribution and net profit, with last month and the same month last year beside it and the three lines to act on. Reconciles Shopify's sales figures to what really happened (returns accrued to the month they belong to, tax kept out of revenue), places each cost in the right line, and splits the month into first-order and returning-customer profit so repeat buyers cannot hide a loss on new ones. Use at every month end, before a budget meeting, when profit does not match the bank, or when the bookkeeper's accounts are too late or too coarse to run the store on."
---

# Monthly store profit and loss

**You get:** a one-page monthly P&L for the store (this month, last month, same month last year, and each line as a share of net revenue), a first-order versus returning split, and the three things to act on with their money at stake.

## When to use

- At each month end, within the first week of the next month.
- The bookkeeper's accounts arrive late or lump store costs together.
- Revenue grew but profit or cash did not.
- Before a budget, pricing or hiring decision that needs real margins.

## Not for

- The full monthly performance report with channels and actions: `monthly-store-performance-report` uses this P&L as its money section.
- Per-product profit: use `build-sku-profit-sheet`.
- Weekly cash in and out: use `build-13-week-cash-forecast`.
- Statutory accounts, tax filing or tax advice: the store's accountant owns those; this is a management P&L.

## What you need

Required (read access, level 1):

1. **Shopify Finances summary and Sales report** for the month: Gross sales, Discounts, Returns, Net sales, Shipping charges, Taxes, Total sales; and the **order export** (Created at, Subtotal, Discount Amount, Shipping, Taxes, Refunded Amount, Payment Method, Lineitem sku, Lineitem quantity, Customer ID).
2. **Landed cost per SKU**, including inbound freight, duty and retail packaging.
3. **Invoices or exports for variable costs**: courier or 3PL invoices, packaging, payment gateway fees (payouts report), COD fees and RTO charges.
4. **Marketing spend**: Meta, Google and other ad account invoices; creator, affiliate and agency costs.
5. **Fixed costs**: payroll, rent, apps and software, retainers, and the bookkeeping ledger if there is one.

Optional: marketplace settlement reports, loan interest, last year's same month.

If landed costs are missing, stop: the P&L has no gross profit without them. If an invoice is missing, use last month's figure marked "estimate". This skill reads only.

## Before you start: the gates

1. **Landed cost per SKU is known.** Product cost is "all in until it's in": purchase price, inbound freight, duty and the retail box [FIN-0007] [FIN-0008]. Fail: run `calculate-landed-cost-per-unit`.
2. **The month is closed.** All courier, ad and app invoices for the month are in, or estimated and marked.
3. **The cost choices are written down.** Where outbound shipping and return freight sit is a choice; state it once at the top and keep it every month [FIN-0017].

## Steps

### 1. Build revenue from gross to net

- Gross sales (before discounts, excluding tax and shipping).
- Minus discounts. Coupons reduce revenue; they are not a cost of goods [FIN-0009].
- Minus returns. Shopify books returns on the refund date [MEA-0011], so a big month's returns land in the next month. Instead, accrue expected returns at the matured return rate on this month's sales, then true up against actual refunds [MEA-0028].
- Minus failed COD orders if they were counted as sales (India).
- = **Net sales**; plus **shipping charged** = **Net revenue**. This matches Shopify's net sales plus shipping; total sales includes tax and is not revenue [MEA-0010].

Show the gross-to-net bridge every month; accounting software usually receives only Shopify's net figure, which hides why revenue moved [FIN-0010].

### 2. Cost of goods and gross profit

Units sold x landed cost per unit, minus units returned to sellable stock, plus the cost of repacking or refurbishing returns [FIN-0009]. **Gross profit = net revenue minus cost of goods.**

### 3. Delivery costs and contribution 1

Outbound shipping, pick and pack, shipping cartons, payment gateway fees (including fees on refunded orders, which are not returned on Shopify Payments [FIN-6243]), COD fees, RTO freight and return freight. **Contribution 1 = gross profit minus delivery costs.** This is what each order really earns before marketing [MEA-0037].

### 4. Marketing and contribution 2

Ad spend by channel, creator and affiliate payouts, and any agency fee tied to spend. **Contribution 2 = contribution 1 minus variable marketing.** Keep fixed marketing (an in-house team, a flat retainer) in fixed costs, so that contribution shows what one more month of spend earns [MEA-0030].

### 5. Fixed costs down to net profit

Payroll, rent, apps, retainers, insurance, bookkeeping: **operating profit (EBITDA)**. Then depreciation, interest and financing fees, and income tax: **net profit**. Do not spread fixed costs into daily or per-order numbers; doing so makes extra spend look worse than it is [MEA-0030].

### 6. Show the shares

Every line as a share of net revenue. One practitioner reads a store in four buckets: cost of delivery 30 to 40% of revenue, variable media 40 to 50% for low repeat goods, fixed costs 10 to 12% for a strong brand, leaving 15 to 20% profit [FIN-0016]. Use these as a reference, not a target; categories differ.

### 7. Split first-order and returning profit

Using the order export, tag each order first order or repeat. Build contribution 2 for each: put all acquisition spend against first orders, and only retention costs (email and SMS tools, retargeting of past buyers) against repeat orders. Returning-customer profit can hide a loss on acquiring new customers [MEA-0055]. If first-order contribution 2 is negative, say how many months of repeat orders it takes to recover.

### 8. Compare and explain

Columns: this month, last month, same month last year, and the change. For any line moving more than 2 points of net revenue, write one line on why, with the evidence (a sale, a courier rate change, a new app, returns from last month's peak landing).

### 9. Pick the three things to act on

Rank lines by money at stake: the gap between this month's share and the best of last month, last year or the reference band, times net revenue. Pick the top three that the store can change. Each gets the lever, an owner and the skill to hand off to:

- delivery costs high: `compare-shipping-carriers`, `returns-and-rto-cost-analysis`;
- discounts deep: `how-deep-can-we-discount`;
- marketing share up and first-order contribution negative: `set-ad-budget-from-profit-target`;
- gross margin falling: `negotiate-moq-and-price` or `set-prices-from-costs-and-competitors`;
- fixed costs creeping: an app and retainer review.

### India and US notes

- **India:** revenue is net of GST; GST collected is a liability, and input credit on costs reduces what is paid, so book costs net of claimable GST. COD fees and RTO freight belong in delivery costs. Marketplace tax deductions are not costs if they can be claimed back; confirm with the CA.
- **US:** sales tax collected is not revenue. Marketplace facilitator states collect tax for marketplace sales, so marketplace payouts may already exclude it.

## Checks before you hand it over

- Net revenue ties to Shopify net sales plus shipping, with the bridge shown.
- Returns are accrued to this month's sales, with last month's true-up shown.
- Cost of goods uses landed cost, and the shipping and returns placement is stated at the top.
- Contribution 1 and 2 are shown, with fixed marketing kept in fixed costs.
- First-order and returning contribution are shown separately.
- Every estimate is marked, and the share of estimated costs is under 10% of total costs, or the P&L is labelled draft.
- Each of the three actions has money at stake, owner and hand-off skill.

## Output

**One-screen summary:** net revenue, contribution 2 and net profit with their change versus last month and last year; first-order versus returning contribution; the three things to act on with money at stake; and up to three assumption lines where a missing cost changes a number.

**P&L sheet:**

| Line | This month | % of net revenue | Last month | % | Same month last year | % | Change | Note |
|---|---|---|---|---|---|---|---|---|
| Gross sales | | | | | | | | |
| Discounts | | | | | | | | |
| Returns (accrued) | | | | | | | | |
| Net sales | | | | | | | | |
| Shipping charged | | | | | | | | |
| **Net revenue** | | | | | | | | |
| Cost of goods (landed) | | | | | | | | |
| **Gross profit** | | | | | | | | |
| Outbound shipping and pick-pack | | | | | | | | |
| Payment and COD fees | | | | | | | | |
| RTO and return freight | | | | | | | | |
| **Contribution 1** | | | | | | | | |
| Ad spend by channel | | | | | | | | |
| Creators, affiliates, spend-linked fees | | | | | | | | |
| **Contribution 2** | | | | | | | | |
| Payroll | | | | | | | | |
| Rent, apps, retainers, other fixed | | | | | | | | |
| **Operating profit (EBITDA)** | | | | | | | | |
| Depreciation, interest, financing fees | | | | | | | | |
| Income tax | | | | | | | | |
| **Net profit** | | | | | | | | |

**Customer split:** Line, First orders, Returning orders, Total (net revenue, gross profit, contribution 1, marketing, contribution 2).

**Gross-to-net bridge** and **returns true-up:** Shopify figure, adjustment, P&L figure, reason.

**Action list:** Rank, Line, Money at stake per month, Lever, Owner, Hand off to.

## Common mistakes

- **Total sales as revenue.** It includes tax [MEA-0010]. Step 1 starts from gross sales.
- **Returns in the wrong month.** Step 1 accrues them [MEA-0028].
- **Product cost without freight and duty.** Step 2 uses landed cost [FIN-0007].
- **Everything below gross profit lumped as expenses.** Steps 3 to 5 separate delivery, marketing and fixed costs so contribution is visible.
- **One blended profit line.** Repeat buyers can hide a loss on new ones [MEA-0055]. Step 7 splits it.
- **A list of ten problems.** Step 9 picks three by money at stake.

## Sources

- FIN-0007: cost of goods is all in until it is in the warehouse.
- FIN-0008: retail box in cost of goods, shipping carton in shipping.
- FIN-0009: coupons reduce revenue; refurbishing goes to cost of goods.
- FIN-0010: report gross-to-net monthly.
- FIN-0016: four-bucket P&L reference bands.
- FIN-0017: state where outbound shipping sits.
- FIN-6243 (proposed): card fees are not returned on refunds.
- MEA-0010: net sales plus shipping; total sales includes tax.
- MEA-0011: Shopify books returns on the refund date.
- MEA-0028: accrue returns daily at the expected rate.
- MEA-0030: keep fixed costs out of contribution.
- MEA-0037: gross margin uses delivered cost.
- MEA-0055: split first-time and returning P&Ls.

What makes this skill ours: returns are accrued to the month that caused them instead of the month Shopify books them; the P&L stops at two contribution lines before fixed costs so spend decisions are not distorted; first-order and returning profit are split; and the month ends with three actions ranked by money, not a list of everything that moved.
