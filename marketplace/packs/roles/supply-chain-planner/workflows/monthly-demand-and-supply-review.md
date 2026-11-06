# Monthly demand and supply review

**Cadence:** Once a month, a week before the month's main buying or production decisions. A small-business version of sales and operations planning.

## Steps

1. **Agree the inputs (level 1).** Unit sales and stock by product for the month, open orders, the production or buying calendar, planned promotions and listings, and the cash forecast. Personal customer data is not needed.
2. **Score last month's forecast.** Run the `forecast-accuracy-by-product` prompt: MASE and bias by product, the costliest misses, products to change method.
3. **Reforecast.** Use the `demand-forecast-by-product` skill for the next six to twelve months (or the longest supplier lead time plus a season). Keep promotions and new listings as labelled lines and write the reason for each.
4. **Check supply against demand.** For buyers, the `reorder-points-and-safety-stock` skill: reorder points, safety stock and the buy plan by month, plus any one-time seasonal buys with the `seasonal-one-time-buy` prompt. For makers, the `production-and-materials-plan` skill: load against capacity, the bottleneck, the materials buy list.
5. **Check the cash.** Total stock purchases and production costs by week against the cash forecast and the floor. Mark the weeks that break the floor and the options to fix them.
6. **Review slow stock.** Run the `slow-stock-cash-release` prompt and list decisions: clear, bundle, stop buying.
7. **Write the decision pack.** One page: forecast changes and why, the buy or production plan, cash by week, risks (single suppliers, long lead times, freight changes), and three decisions for the owner. *Approval: the owner agrees the forecast, the service levels, the buy and production plan and the budget for the month.*
8. **Set the month's limits.** Record the approved budget, suppliers and period as the level 3 limits for the weekly run, if the client grants level 3.
9. **Log and close.** Save the forecast, settings and decisions so next month's review can score them.

## Outputs

- Forecast accuracy table and method changes
- Updated forecast with ranges and labelled adjustments
- Buy plan or production plan with materials list
- Cash by week against the floor
- Slow stock decisions
- One-page decision pack and the month's level 3 limits

## Needs the client's approval

The forecast and any adjustment; the service levels per product group; the monthly buying or production budget; the approved supplier list; one-time seasonal buys; clearing or writing down slow stock; any change to reorder settings in live tools (level 3). Payments and contracts stay with the client.
