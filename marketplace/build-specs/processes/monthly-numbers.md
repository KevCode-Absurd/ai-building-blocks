# Monthly numbers: profit, cash, products and prices

Each month you get one page with profit and cash from the warehouse and shop data, what each product really earns, a keep, fix, grow or kill call per product, and pricing and merchandising proposals with the margin beside each. Any price or discount change goes live only through a plan you approved.

**Starts from:** The first working day of the month (a scheduled run reads and drafts only), or once your bookkeeper has closed the month.

| # | Stage | Who | Makes | Checked by | You sign off | Access |
|---|---|---|---|---|---|---|
| 1 | Tie the month's data | Callum (callum-reporting) | data-check.md | data-review | no | read |
| 2 | Profit and cash for the month | Hemant (hemant-store-finance) | pnl.md, cash-forecast.md, pnl-numbers.json | pnl-numbers, pnl-review | no | draft |
| 3 | What each product and channel earns | Radek (radek-unit-economics) | unit-economics.md, unit-numbers.json | unit-numbers, unit-review | no | read |
| 4 | Keep, fix, grow or kill for each product | Sabelo (sabelo-product-portfolio) | portfolio.md | portfolio-review | no | read |
| 5 | Price and merchandising proposals | Juliet (juliet-merchandising) | proposals.md, proposal-numbers.json | proposal-numbers, proposals-review, compliance-review | yes | draft |
| 6 | Make the approved changes | Juliet (juliet-merchandising) | changes.md | none | yes, the plan | publish |
| 7 | The month on one page | Callum (callum-reporting) | monthly-report.md, report-numbers.json | report-numbers, report-readability, report-review | no | draft |
| 8 | Watch the price changes | Radek (radek-unit-economics) | price-watch.md | watch-review | no | read |

## Stage by stage

### 1. Tie the month's data

Refreshes the warehouse and ties the month: shop orders, revenue, refunds and new customers against the shop's own report, ad spend for every channel against each platform, and payouts against the bank export. Revenue is shown before sales tax or VAT, in the store's currency. If the bookkeeper has not closed the month yet, every affected number is marked provisional.

- **Needs:** warehouse views shop_orders_daily, ads_daily and daily_blended; the shop's own monthly report (level 1, or an export); bank and payout exports; metric-definitions.md from store setup
- **Makes:** data-check.md
- **Checks:** data-review (revenue and orders come from the shop, each source total matches the warehouse or the gap is explained, and provisional numbers are marked)
- **Done when:** data-check.md shows each source total next to the warehouse total for the month, with every gap explained, and marks provisional numbers.

### 2. Profit and cash for the month

Writes the monthly profit and cash summary in plain words: sales, gross profit, ad spend, fees, net profit and cash, with what moved and why against last month and the budget. Rolls the 13-week cash forecast on with actuals and flags any week below your cash floor. Prepares the pack for your accountant, with tax and VAT questions marked for them to confirm. It never files tax or moves money.

- **Needs:** data-check.md; accounting export or bookkeeper's close; the last 13-week cash forecast
- **Makes:** pnl.md, cash-forecast.md, pnl-numbers.json
- **Checks:** pnl-numbers (every total in the profit and cash summary matches its rows, and no total mixes two periods); pnl-review (the profit lines tie to data-check.md, the cash floor is checked in every week, and tax questions are left for the accountant)
- **Done when:** pnl.md has every line with its source and the reason for each big change, cash-forecast.md shows 13 weeks with the lowest week flagged, and the accountant questions are listed.

### 3. What each product and channel earns

Updates gross profit per purchase by product, channel and market from this month's costs, fees, discounts and returns, and the break-even ad cost per first order. Says what moved since last month and why, for example a supplier price rise or more returns on one product. Updated costs feed the next growth plan and every offer.

- **Needs:** data-check.md; product costs and landed costs from sourcing; warehouse view shop_orders_daily
- **Makes:** unit-economics.md, unit-numbers.json
- **Checks:** unit-numbers (gross profit per purchase and break-even recompute from their inputs); unit-review (every cost has a source and date, estimates are marked, and changes from last month are explained)
- **Done when:** unit-economics.md gives gross profit per purchase and break-even cost by product and channel, with each input sourced and each change against last month explained.

### 4. Keep, fix, grow or kill for each product

Builds one row per product: units, revenue, contribution margin after returns, trend, ABC class by share of margin, XYZ class by how steady demand is, returns and review themes. Reads which products are bought together and which take sales from each other. Calls keep, fix, grow or kill for each, with the reason and first step. Every kill call shows the stock and cash left; clearance goes to merchandising.

- **Needs:** unit-economics.md; orders and line items, last 12 months; returns, reviews and site search terms; stock on hand
- **Makes:** portfolio.md
- **Checks:** portfolio-review (every call fits the product's numbers, every kill call shows stock and cash left, and launches or stockouts that bend the numbers are noted)
- **Done when:** portfolio.md has a row and a call for every active product, the bundle pairs worth testing with their margin, and the stock and cash left for every kill call.

### 5. Price and merchandising proposals

Turns the month's numbers into a short list of proposals: price changes, discount depth by product, bundles (with the offer strategist), clearance for kill calls, and collection order so best sellers with good margins lead. Every proposal shows the margin before and after, the reason, the date and how to undo it. Sale wording follows the rules where you sell, such as the EU rule to show the lowest price of the last 30 days beside a discount. Nothing goes below the profit floor.

- **Needs:** unit-economics.md; portfolio.md; context/org-context/ claims and offers allowed; discount history
- **Makes:** proposals.md, proposal-numbers.json
- **Checks:** proposal-numbers (each margin before and after recomputes from price, cost and fees); proposals-review (no proposal goes below the profit floor, each has a reason from the month's numbers, and each has an undo step); compliance-review (reference prices and sale wording follow the rules for each market, with no false was-price or fake deadline)
- **Done when:** proposals.md lists each proposal with its product, current and new value, margin before and after, the rule checked for each market, the start date and the undo step.
- **You sign off:** You pick the proposals to make and see the margin effect of each. Reply yes with the code to approve the list as written, or say which to drop. Approving here does not change your store; the next stage shows the exact changes as a plan with its own code.

### 6. Make the approved changes

Shows you a plan with each approved change as one step: the product or variant, the old and new price or compare-at price, the discount with its start and end dates, or the new collection order, each with its undo. On your yes it makes the changes through the shop connector and reads each one back. Where your connector cannot make a change, the stage gives you click-by-click steps for the shop admin instead. If you approved no changes, this stage is skipped.

- **Needs:** proposals.md (signed off); shop connector at level 3, or the admin steps for you; context/limits.json
- **Makes:** changes.md
- **Goes live:** Through the shop connector (for Shopify, the official connector or the Admin API): variant price and compare-at price updates, discounts created with set start and end dates, and collection sort order. Never deletes or archives a product. Product status changes need their own plan and yes.
- **Done when:** changes.md records each change with its plan code, the value read back after, and the undo step.

### 7. The month on one page

Writes the one-page monthly report: one line on what happened and what is suggested, then the main number against target, sales, orders, contribution margin, MER, new and returning revenue and the lowest cash week, each with its dates and source. Lists the decisions you made this month and the next check date. Refreshes the dashboard.

- **Needs:** pnl.md; unit-economics.md; portfolio.md; proposals.md and changes.md
- **Makes:** monthly-report.md, report-numbers.json
- **Checks:** report-numbers (every figure in the report recomputes from its ledger); report-readability (the readability checker exits 0); report-review (the report says what happened and what to do in its first line, and its numbers match pnl.md and unit-economics.md)
- **Done when:** monthly-report.md fits one page, every number names its dates and source, and it lists this month's decisions and the next check date.

### 8. Watch the price changes

Two weeks after any price or discount change, compares the 14 days after with the 14 days before for each changed product: conversion, units, margin per order, refunds and complaints. If conversion or complaints moved sharply, it drafts a rollback plan for you rather than waiting for next month. If nothing changed this month, it records that in one line.

- **Needs:** changes.md; warehouse view shop_orders_daily; support ticket counts
- **Makes:** price-watch.md
- **Checks:** watch-review (before and after use the same number of days and sources, and the suggestion follows its deciding number)
- **Done when:** price-watch.md gives before and after for each changed product over the same number of days, with a keep or roll back suggestion and its deciding number.

## Where you step in

- **Price and merchandising proposals:** You pick the proposals to make and see the margin effect of each. Reply yes with the code to approve the list as written, or say which to drop. Approving here does not change your store; the next stage shows the exact changes as a plan with its own code.
- **Make the approved changes:** approve the exact plan of live changes

## How we judge it

- Main number from context/goals.json for the month, next to last month and the same month last year.
- Profit and cash: net profit, contribution margin per order, and the lowest cash week in the next 13 weeks against your cash floor.
- Price changes: margin and conversion in the 14 days after a change, against the 14 days before.
