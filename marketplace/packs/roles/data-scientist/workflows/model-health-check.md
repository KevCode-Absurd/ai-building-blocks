# Model health check

**Cadence:** Every quarter for any model or score the business relies on (fraud, churn, lead, risk, demand), and straight after a complaint, a big change in customers or products, or a vendor update.

## Steps

1. **List the models (level 1).** For each: owner, what it decides, what happens to its output, when it was last trained, and its model card if one exists. Write one with the `model-card-one-pager` prompt if not.
2. **Pull recent outcomes.** Decisions and what really happened for the last quarter, through the official connector, MCP server or an export. Personal details replaced by IDs.
3. **Recheck performance.** Use the `model-and-ai-claim-review` skill: confusion matrix and rates on the new period, at today's base rate, priced with today's costs. Compare with the last check and the launch figures.
4. **Recheck calibration and ranking.** Score bands against real rates. Flag any band that moved.
5. **Look for drift.** Changes in the mix of inputs (new products, new markets, a new sales channel), in the base rate and in the share of cases flagged.
6. **Recheck by group** where the client lawfully holds group data, with counts. Use the `responsible-ai-risk-check` skill if gaps grew.
7. **Recheck the threshold.** Would a different cut-off or action cost less at today's base rate and costs?
8. **Report.** One page per model: healthy, watch, or act; what changed; the recommended change (retrain, new threshold, manual check, retire). *Approval: the client decides on changes; changing a live threshold or rule is level 3, within limits.*
9. **Update the record.** Model card, monitoring dates and the next review.

## Outputs

- Model list with owners and cards
- Performance, calibration, drift and group checks per model
- One-page health report per model with a recommendation
- Updated model cards and review dates

## Needs the client's approval

The access level for each tool; use of any group data; changes to thresholds, rules or actions in live tools (level 3, within the limits set); retraining or retiring a model; and any message to customers or staff about a model. Legal questions go to the client's qualified adviser.
