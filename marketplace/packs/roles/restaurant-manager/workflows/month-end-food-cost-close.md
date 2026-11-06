# Month-end food cost close

**Cadence:** Monthly, within a few days of the month-end stock count. Some kitchens run it weekly.

**Trigger:** Month end, or food cost on the owner's accounts comes in above target.

**Access:** Level 1 (read) on the till, invoices, counts and cards covers the analysis. [L2] steps need read and draft access; [L3] steps need read, write and publish access within the client's limits (for example: "update the live costing sheet; enter counts in Square; no menu or price changes without a separate yes").

## Steps

1. **Count.** Agree the count date and time (before or after deliveries), areas and method, and use the same method as last month. [L3] Enter the counts in the stock tool if the owner allows; otherwise collect count sheets.
2. **Gather.** Purchase invoices and credit notes dated to the month, transfers, food sales excluding tax and drinks, item sales, waste and staff meal logs.
3. **Re-cost.** Update ingredient prices from this month's invoices with the `supplier-price-change-check` prompt and refresh the cards. [L3] Update the live costing sheet.
4. **Check.** Run the `menu-engineering-and-food-cost-check` skill: actual against expected food cost, the gap, ranked causes with evidence, and the menu engineering table for the month.
5. **Follow up.** Turn the top causes into fixes with owners and dates (paperwork, portion checks at the pass, waste logging, prep pars). Add them to the weekly review.
6. **Report.** One page to the owner: the arithmetic, actual and expected percent, the gap, causes, fixes and the dishes to reprice, rework or cut. *Approval: the owner decides any price or menu change; those go through the `new-menu-launch` workflow or a single approved change list.*
7. **Sensitive findings.** If the evidence points to possible theft or fraud, report it privately to the owner with the evidence only. Do not name anyone in shared channels.

## Outputs

- Stock counts entered (level 3) or collected
- Updated ingredient prices and recipe cards
- Food cost check with ranked causes
- Menu engineering table for the month
- Fixes added to the weekly review
- One-page report for the owner

## Needs the client's approval

Any price or menu change; any stock order or supplier change arising from the review (each order needs its own yes); deleting or overwriting past counts or cards; anything involving a named person. The accounts themselves and any tax treatment stay with the owner's accountant.
