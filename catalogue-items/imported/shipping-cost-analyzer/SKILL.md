---
name: shopify-admin-shipping-cost-analysis
role: finance
description: "Read-only: aggregates shipping revenue charged to customers vs. actual shipping line costs by carrier and method."
toolkit: shopify-admin, shopify-admin-execution
api_version: "2025-01"
graphql_operations:
  - orders:query
status: stable
compatibility: Claude Code, Cursor, Codex, Gemini CLI
---

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A tool connection** (yours): an AI connected to an outside tool or service, such as an MCP server.

**Makes it better (optional):**
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a tool connection, a spreadsheet. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.

**Tools that do this best:**
- **Claude or ChatGPT with a Shopify connection:** It reads your orders directly, so you skip the export.
- **A spreadsheet:** Handy for keeping a carrier cost table to reuse each month.
<!-- /needs -->

## Purpose
Shows what customers were charged for shipping, and how much was given away in shipping discounts and free shipping, broken down by carrier and shipping method. When the user also supplies what each method costs them (from carrier invoices or a rate card), it compares the two and shows where shipping is subsidized (charged less than it cost) or over-charged. Read-only — no mutations.

**Important:** Shopify's order data holds only what the customer was charged. It does not hold what you paid the carrier, unless your carrier app writes that cost back. This skill never guesses carrier cost. Without cost figures from the user, report charges and discounts only, and say so plainly at the top of the report.

## Prerequisites
- Authenticated Shopify CLI session: `shopify store auth --store <domain> --scopes read_orders`
- API scopes: `read_orders`
- Shopify returns only the last 60 days of orders unless your access also has `read_all_orders`. If `days_back` is more than 60 and you do not have it, say so before you start.
- **Carrier cost (optional but needed for a subsidy figure):** ask once for what each carrier and method costs the user per parcel, from carrier invoices or a rate card, or the total invoiced per method for the window. If the user has none, run the charges and discounts report only and mark cost MISSING.
- **No Shopify access?** Ask once for an orders export with the shipping method, shipping charged and shipping discount for each order, then run steps 2 and 3 on it.

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| store | string | yes | — | Store domain (e.g., mystore.myshopify.com) |
| days_back | integer | no | 30 | Lookback window |
| carrier_costs | table | no | — | What each carrier or method costs you per parcel, or the invoiced total per method for the window. Supplied by the user. Never estimated. |
| format | string | no | human | Output format: `human` or `json` |

## Safety

> ℹ️ Read-only skill — no mutations are executed. Safe to run at any time.

## Workflow Steps

1. **OPERATION:** `orders` — query
   **Inputs:** `query: "financial_status:paid created_at:>='<NOW - days_back days>'"`, `first: 250`, select `shippingLines { title, discountedPriceSet, originalPriceSet, carrierIdentifier }` (in the query below, `shippingLines` is a connection, so it is read through `edges` and `node`, up to 5 lines per order), pagination cursor
   **Expected output:** Orders with shipping line details; paginate until `hasNextPage: false`

2. For each shipping line: record carrier (from `title` or `carrierIdentifier`), the price before discounts (`originalPriceSet`), the amount charged (`discountedPriceSet`), and the discount (original minus charged). Count a line with a charged amount of 0 as free shipping.

3. Group by carrier and method. For each group, calculate orders, total charged, total discount given, free shipping orders and average charged per order.

4. **Only if the user supplied `carrier_costs`:** for each group, work out total cost (cost per parcel times orders, or the invoiced total), then net = total charged minus total cost. A negative net is a subsidy. A positive net is an overcharge. If a method has no cost figure, leave its net blank and mark it MISSING. If you matched costs to methods by name, show the match so the user can check it.

## GraphQL Operations

```graphql
# orders:query — validated against api_version 2025-01
query ShippingCostAnalysis($query: String!, $after: String) {
  orders(first: 250, after: $after, query: $query) {
    edges {
      node {
        id
        name
        createdAt
        totalShippingPriceSet {
          shopMoney {
            amount
            currencyCode
          }
        }
        shippingLines(first: 5) {
          edges {
            node {
              id
              title
              carrierIdentifier
              originalPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
              discountedPriceSet {
                shopMoney {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

## Session Tracking

**Claude MUST emit the following output at each stage. This is mandatory.**

**On start**, emit:
```
╔══════════════════════════════════════════════╗
║  SKILL: Shipping Cost Analysis               ║
║  Store: <store domain>                       ║
║  Started: <YYYY-MM-DD HH:MM UTC>             ║
╚══════════════════════════════════════════════╝
```

**After each step**, emit:
```
[N/TOTAL] <QUERY|MUTATION>  <OperationName>
          → Params: <brief summary of key inputs>
          → Result: <count or outcome>
```

**On completion**, emit:

For `format: human` (default):
```
══════════════════════════════════════════════
SHIPPING COST ANALYSIS  (<days_back> days)
  Orders analyzed:     <n>
  Total charged to customers: $<amount>
  Free shipping orders:       <n>

  By Carrier/Method:
    "Standard Shipping"  Orders: <n>  Charged: $<n>  Discounts: $<n>  Avg: $<n>  Cost: $<n or MISSING>  Net: $<n or MISSING>
    "Express"            Orders: <n>  Charged: $<n>  Discounts: $<n>  Avg: $<n>  Cost: $<n or MISSING>  Net: $<n or MISSING>
  Carrier cost: <supplied by you | MISSING, so no subsidy figure>
  Output: shipping_cost_<date>.csv
══════════════════════════════════════════════
```

For `format: json`, emit:
```json
{
  "skill": "shipping-cost-analysis",
  "store": "<domain>",
  "period_days": 30,
  "orders_analyzed": 0,
  "total_shipping_charged": 0,
  "free_shipping_order_count": 0,
  "currency": "USD",
  "by_method": [],
  "output_file": "shipping_cost_<date>.csv"
}
```

## Output Format
CSV file `shipping_cost_<YYYY-MM-DD>.csv` with columns:
`order_name`, `shipping_method`, `carrier`, `charged_amount`, `original_price`, `discount_applied`, `currency`. When the user supplied carrier costs, also add `carrier_cost` and `net` for each line, or leave them blank.

Report these five parts in order: (1) settings and what was missing, (2) totals, (3) table by carrier and method, (4) methods that lose money, or "cannot tell, carrier cost missing", (5) one next step.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Order picking, packing and shipping planner](https://useaiblocks.com/skills/pick-pack-and-ship-improver). It takes the audit report.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->

## Error Handling
| Error | Cause | Recovery |
|-------|-------|----------|
| `THROTTLED` | API rate limit exceeded | Wait 2 seconds, retry up to 3 times |
| No shipping lines | Digital products or free shipping store | Report $0 shipping revenue |
| Carrier identifier missing | Custom or manual shipping methods | Use `title` as carrier name |

## Best Practices
- Free shipping orders show $0 charged. What you paid the carrier on them is your subsidy, but only if you bring the cost. Knowing this per carrier helps judge a free shipping threshold.
- `originalPriceSet` vs `discountedPriceSet` difference represents shipping discounts applied to customers — useful for understanding total shipping subsidy cost.
- Pair with the Average order value tracker to see whether a free shipping threshold lifts order value.
- Do not use this if you have no carrier invoices and want a true cost. Get the invoices first, or use the Carrier performance comparer to compare carriers on delivery time.
