# Monthly margin review

**Cadence:** the first week of each month, covering the month just ended. About two to three hours.

**Goal:** judge every product's ad spend against its own margin, check that ads lift total sales, move products between launch, growth and defend, and agree next month's caps.

## Steps

Steps 1 to 6 need level 1. Step 8 needs level 2 or 3 depending on the change.

1. **Refresh the costs.** Ask the client for any change to prices, landed costs or fees. Re-date every fee figure. Never reuse last month's costs without asking.
2. **Per-product table** (skill: `break-even-acos-review`; prompt: `break-even-acos-table`). Profit before ads, break-even ACOS, actual ACOS, TACOS and its trend, status.
3. **Total-sales check.** For each product, compare ad sales, organic sales and TACOS with the month before. Flag products where ad spend rose and total sales didn't.
4. **Brand-term test check.** If brand terms take a large share of spend, propose or read a test of lower brand bids, as in the JLab case (see knowledge.md).
5. **Account health of the ads.** Overlapping campaigns, ad groups mixing targets, unused budget rules, Prompts spend, placement adjustments that no longer pay (prompt: `account-map` if the structure has drifted).
6. **Phase moves** (skill: `phase-bid-rules`). Which products move phase, with the evidence.
7. **Write the monthly report.** One page per product group plus a ranked change list and the proposed caps for next month.
8. **Agree and apply.** The client approves next month's caps and phase moves. At level 3, apply the approved items and log them; at level 2, prepare them paused or as a bulk file.

## Outputs

- Monthly report: per-product table, total-sales view, what the blend hides, phase moves.
- Ranked change list.
- Proposed caps and limits for next month.
- Updated rule cards and change log.

## Approval

**Needs the client's approval every month:** next month's spend caps, phase moves into launch spend, new campaigns or ad types, any test that cuts spend on brand terms, archiving old campaigns.

**At level 3, inside the confirmed limits:** routine bid, budget, keyword and negative changes that follow the rule cards.

Analysis and the report itself need no approval.
