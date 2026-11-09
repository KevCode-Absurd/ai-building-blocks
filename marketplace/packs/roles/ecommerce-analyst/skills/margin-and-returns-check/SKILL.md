---
name: margin-and-returns-check
description: Works out contribution margin per order and per product from order, cost, shipping, fee and refund exports, in layers (after product cost, after fulfilment and payment costs, after marketing), then analyses returns by product, reason, channel and customer group using orders placed in the period as the base, sizes the cost of returns, and picks the one fix to make first. Use when revenue is up but cash isn't, before a discount or free-delivery decision, or when returns feel high and nobody knows which products drive them.
---

# Margin and returns check

Revenue tells you how busy the store was. Contribution tells you whether each order paid for itself. Returns quietly take back both, weeks later. This skill puts the three in one view.

## When to use

- "We're selling more but there's less money in the bank."
- Before a free-delivery threshold, a discount or a bundle decision.
- Returns feel high, or one product keeps coming back.
- A monthly margin and returns review.

## What you need

**Access:** level 1 for every step. Level 2 to save the margin sheet or a returns dashboard as a draft. Level 3 to publish them, or to tidy return reason codes in the returns app as agreed. Changing prices, delivery charges or return policies is the client's decision; I prepare the case.

- Orders for the period, with net sales, discounts, shipping charged, tax, payment method and channel.
- Cost price per product or variant. Note products with no cost.
- Fulfilment costs: pick and pack, packaging, postage paid per order (from the carrier or 3PL invoice).
- Payment and platform fees per order (from payouts or the fee report).
- Marketing spend by channel for the same period.
- Returns and refunds: order ID, product, date returned, reason code, refund amount, whether restocked, return postage paid.
- Markets sold to (return windows differ: EU and UK online buyers have 14 days to cancel; UK buyers then have 14 more days to send goods back).

## Steps

1. **Check cost coverage.** Share of net sales with a cost price. Shopify only counts sales with cost recorded toward gross profit, so its margin can look better than reality. Report coverage at the top.
2. **Build the layers per order** (show each formula once):
   - Net revenue = gross sales − discounts − refunds (excluding tax).
   - Contribution 1 = net revenue − product cost.
   - Contribution 2 = Contribution 1 − pick, pack and packaging − postage paid + shipping charged − payment and platform fees.
   - Contribution 3 = Contribution 2 − marketing spend (allocated by channel or spread evenly, and say which).
3. **Roll up** by product, channel, discount code, new versus returning customer and order size band. Find orders that lose money at Contribution 2: often small baskets with free delivery.
4. **Returns base.** Use orders placed in the period as the base, and wait for the return window to close before calling a period final. Refunds booked this week for older orders belong to those orders.
5. **Return rates** by product, variant (size, colour), reason code, channel and customer group. Rank by cost of returns, not by count.
6. **Cost of returns** = refunded amount + return postage paid + handling + write-off value of goods not resellable − value restocked. Mark any part that is estimated.
7. **Read the reasons.** Group free-text reasons into a few codes (wrong size, not as pictured, damaged, late, changed mind). A size-driven product needs a size chart fix; "not as pictured" needs photos or copy; "damaged" needs packaging.
8. **Pick the one fix first:** the largest cost of returns with a clear, cheap cause. Size its likely effect as a range, labelled as an estimate.
9. **Save or publish (level 2 or 3).** Save the sheet; publish the dashboard if allowed; log changes.

## Checks

- Cost coverage stated; products with no cost excluded from margin, not counted at zero cost.
- Tax excluded from revenue throughout.
- Return rates use orders placed as the base; incomplete windows marked.
- Every estimate labelled; every formula shown.
- No pricing, tax or accounting rulings: these are management numbers, not the client's accounts. Ask a qualified accountant for anything that goes into the books.

## Output format

1. **Coverage and assumptions box.**
2. **Contribution table:** by channel and by top products (revenue, C1, C2, C3, margin %).
3. **Loss-making orders:** count, share, typical shape.
4. **Returns table:** product, units sold, units returned, return rate, top reason, cost of returns.
5. **The fix to make first,** with expected effect as a range.

## Example of good output (short)

*Illustrative structure, not a real business: a running apparel store. Copy the shape, never the content: every fact comes from the client's own context. October 2026 orders; cost coverage 96% of net sales. Figures only show the shape.*

| Channel | Net revenue | C1 | C2 | C3 | C3 % |
|---|---|---|---|---|---|
| Email | £18,400 | £10,300 | £8,100 | £7,600 | 41% |
| Paid social | £31,200 | £17,200 | £13,000 | £3,100 | 10% |
| Marketplace | £9,800 | £5,300 | £2,900 | £2,900 | 30% |

Orders under £30 with free delivery: 18% of orders, average C2 of −£1.40.

| Product | Sold | Returned | Rate | Top reason | Cost of returns |
|---|---|---|---|---|---|
| Trail tights, women's | 640 | 173 | 27% | Wrong size (61%) | £3,050 |
| Rain shell | 210 | 19 | 9% | Not as pictured | £690 |

**Fix first:** the women's trail tights size chart (runs small per the reasons). If size returns halve, cost of returns falls by roughly £800 to £1,000 a month (estimate).
