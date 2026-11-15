---
name: abc-xyz-product-classes
description: "Every SKU in the catalogue classed A, B or C by its share of contribution margin and X, Y or Z by how steady its monthly demand is, with demand cleaned for stock-outs and promotions first, new and dying products set aside, a nine-box grid with the count, margin share and stock value in each box, the rule behind each class, and what each box means for range, stock policy and promotion. Use when the catalogue is too big to review SKU by SKU, before setting stock policies or a range review, when cash is tied up in slow stock, or when every product gets the same service level and ad support."
---

# ABC and XYZ classes for your products

**You get:** a class for every SKU (for example AX or CZ), a nine-box grid with SKU count, contribution share and stock value per box, the bands used and why, a policy line per box for range, stock and promotion, and a short list of SKUs that need a decision now.

## When to use

- The store has more than about 30 SKUs and nobody can say which ones carry the profit.
- Every product gets the same reorder rule, safety stock and ad support.
- Cash is tied up in stock that sells unevenly.
- A range review, a reorder cycle or next season's buy is coming.
- The owner wants a simple rule to decide which products get attention first.

## Not for

- The final kill, keep, fix or grow call per SKU: use `rank-products-to-push-or-cut`, which reads these classes.
- Reorder points and safety stock numbers: use `set-reorder-points-and-safety-stock`.
- SKU demand forecasts: use `forecast-demand-per-sku`.
- Bundles, add-ons and cannibalisation: use `basket-and-attach-rate-analysis`.
- Clearing slow stock: use `clear-slow-moving-stock`.

## What you need

Required (read access, level 1):

1. **Order lines for 12 months or more:** order date, SKU, units, net revenue after discounts, refunds by line.
2. **Cost per SKU:** landed cost, plus fulfilment, payment and packaging per order where known (from `build-sku-profit-sheet`).
3. **Stock history:** units on hand by SKU by day or week, or at least the dates each SKU was out of stock.
4. **Promotion calendar:** sale dates, codes and featured SKUs.
5. **SKU status and launch date**, so new and discontinued items can be set aside.

Optional: stock value at cost per SKU today, returns by SKU, ad spend by SKU.

This is analysis at level 1 and 2. Changing reorder rules, ad budgets or the range needs the owner's yes.

## Before you start: the gates

1. **Margin, not revenue.** Pass when contribution per SKU can be computed: net revenue minus landed cost, returns, fulfilment, payment fees and discounts. Fail: get it from `build-sku-profit-sheet` first; a best seller by revenue can be a C by margin.
2. **Clean demand.** Pass when stock-out periods are known. Fail: get stock history; months with stock-outs understate demand [OPS-0014], and training on stock-out sales makes forecasts run low [OPS-6630].
3. **Enough history.** Pass when a SKU has at least 6 months of sales. Fail: class it "new" and review it next quarter instead.

## Steps

### 1. Set aside SKUs that cannot be classed fairly

- **New:** launched less than 6 months ago.
- **Ending:** marked discontinued, or no reorder planned.
- **Bundles and kits:** class their parts, not the bundle, so demand is not counted twice.

List them with a short note. Class the rest.

### 2. Clean monthly demand

For each SKU and month, use demand on in-stock days: units sold / in-stock days x days in month. Mark promotion months. If one month is more than 3 times the median and matches a promotion, cap it at the median for the steadiness test, and note it; find the cause before replacing any spike that does not match a promotion. A long run of zero sales on a SKU marked in stock may be wrong stock counts, not zero demand: check before classing it.

### 3. Class A, B and C by contribution margin

Sort SKUs by 12-month contribution, highest first. Work out each SKU's cumulative share of total contribution.

- **A:** SKUs that make up the first 80% of contribution.
- **B:** the next 15%.
- **C:** the last 5%, plus every SKU with zero or negative contribution, flagged "loss".

These are starting bands; say if you change them and why. Expect a steep curve: at one manufacturer, 21% of products made 380% of profit while the other 79% destroyed 280% once complexity costs were counted. If any C SKU is the first purchase for many new customers, flag it "entry product": it may earn its place through later orders.

### 4. Class X, Y and Z by demand steadiness

For each SKU, compute the coefficient of variation (CV) of cleaned monthly demand over 12 months: standard deviation / mean.

- **X:** CV under 10%.
- **Y:** CV 10% to 25%.
- **Z:** CV above 25% [MEA-6398].

Online stores often show higher CVs than these textbook bands. If more than 70% of SKUs land in Z, use your own split instead (for example the lowest third of CVs X, middle third Y, top third Z) and say so. Also mark SKUs that sell in some months and not others: if the average gap between selling months is more than about 1.3 months, class them Z and note "intermittent", because they need a different forecast method [OPS-6641].

### 5. Build the nine-box grid

For each box (AX to CZ): SKU count, share of contribution, stock value at cost, months of supply (stock on hand / average monthly units), and GMROI (gross margin dollars / average stock cost) [MEA-6277]. Highlight boxes where stock value share is far above contribution share.

### 6. Set a policy line per box

Give each cell its own stock policy: high service on A items, with less safety stock for AX than AZ, lower service on C, and question stocking CZ at all [MEA-6399]. Starting policies:

| Box | Range | Stock | Promotion |
|---|---|---|---|
| AX | Protect | Highest service, automatic reorder, lean safety stock | Hero spots, steady ad support |
| AY | Protect | High service, more safety stock | Feature in planned sales |
| AZ | Protect, find the cause of swings | High service, review each reorder by hand, consider pre-orders | Plan around known peaks |
| BX | Keep | Medium service, automatic reorder | Bundle with A items |
| BY | Keep | Medium service, standard safety stock | Seasonal pushes |
| BZ | Review | Order smaller and more often | Only with a reason |
| CX | Keep if cheap to hold | Low service, small orders | Add-on or cart offer |
| CY | Review | Low service, no extra safety stock | Clearance candidates |
| CZ | Question stocking | Make or order to demand, or drop | No paid support |

### 7. Pick the SKUs that need a decision now

List up to 10: A items often out of stock, C or loss items with high stock value, Z items with big buys on order, and any entry product in C. Hand them to `rank-products-to-push-or-cut` for the call. Remind the owner to prune selectively: removing redundant slow sellers can hold or lift sales, but cutting a whole size, colour family or line shoppers rely on can lose visits and repeat orders.

### 8. Repeat each quarter

Re-run the classes each quarter and list SKUs that changed class, with the likely reason.

## Checks before you hand it over

- ABC uses contribution after returns, fulfilment, fees and discounts, not revenue.
- Demand was measured on in-stock days and promotion spikes were handled.
- New, ending and bundle SKUs were set aside, not forced into a class.
- The bands used are stated, and any change from the defaults is explained.
- Each box shows stock value and months of supply next to contribution share.
- Every box has a range, stock and promotion line.
- No reorder rule, ad budget or range change was made without the owner's yes.

## Output

1. **Class table:** SKU, title, 12-month units, contribution, contribution share, cumulative share, ABC, CV, XYZ, flags (loss, entry product, intermittent, new, ending), stock on hand, stock value, months of supply.
2. **Nine-box grid** with count, contribution share, stock value, months of supply and GMROI per box.
3. **Policy sheet:** box, range, stock, promotion.
4. **Decide-now list:** up to 10 SKUs with the reason and the skill or agent that takes it next.
5. **Class changes** since last quarter (from the second run on).

## Common mistakes

- **Classing on revenue.** Gate 1 and step 3 use contribution.
- **Reading stock-outs as low demand.** Step 2 uses in-stock days.
- **Textbook bands on online data.** Step 4 switches to the store's own split when most SKUs land in Z.
- **One policy for all.** Step 6 gives each box its own.
- **Cutting all C items.** Step 7 protects entry products and whole lines shoppers rely on.

## Sources

- MEA-6398: XYZ bands by monthly coefficient of variation.
- MEA-6399: a stock policy per ABC and XYZ cell.
- OPS-0014, OPS-6630: in-stock days and stock-out bias.
- OPS-6641: intermittent demand needs its own method.
- MEA-6277: GMROI as the return on stock.
- Web sources: ABC Supply Chain, "ABC XYZ Analysis in Inventory Management" (https://abcsupplychain.com/abc-xyz-analysis/); Huron, "Strengthen growth strategy with complexity-adjusted whale curves" (https://www.huronconsultinggroup.com/en/insights/strengthen-growth); Kahn, Weingarten and Townsend, "Assortment Variety: Too Much of a Good Thing?" (https://faculty.wharton.upenn.edu/wp-content/uploads/2016/12/kahn-weingarten-townsend-bookchapter.pdf); tsintermittent R package, idclass (https://raw.githubusercontent.com/cran/tsintermittent/master/R/idclass.R).

What makes this skill ours: classes are built on contribution margin and on demand cleaned for stock-outs and promotions, new and ending SKUs are kept out, the bands bend to the store's own data, every box shows stock value next to margin, and the grid ends in a short list of SKUs that need a decision now.
