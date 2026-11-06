# Weekly PPC routine

**Cadence:** once a week, same day each week (twice in the first week of a launch). About 60 to 90 minutes for an account with 10 to 50 products.

**Goal:** keep spend clean, move proven searches to exact match, catch problems early, and make a few changes with clear reasons, within the access level and limits the client set.

## Steps

Steps 1 to 6 need level 1 (read). Step 7 can use level 2. Step 9 needs level 3.

1. **Pull the reports** (tool: Amazon Ads reports, or the Amazon Ads MCP Server at level 1). Last 7 days and the 7 before: search term, targeting, advertised product, placement, campaign; the Prompts report if you advertise in the US.
2. **Look for alarms first.** Products with no impressions (out of stock or lost the Featured Offer), campaigns out of budget before midday, spend spikes, ads stopped for policy reasons. If any, stop and tell the client before anything else.
3. **Read each product against its break-even ACOS** (skill: `break-even-acos-review`, quick version: the per-product table only).
4. **Harvest and negatives** (skill: `search-term-harvest`; prompt: `search-term-report-review`). Use the agreed rules: harvest at or below target ACOS; negatives after at least 20 clicks with no orders, or a clear relevance reason. Don't re-touch negatives added in the last two weeks.
5. **Bids by phase** (skill: `phase-bid-rules`). Apply each product's rule card: launch, growth or defend. Note any product that meets an exit condition.
6. **Placements and budgets.** Read the placement report against each campaign's adjustment. Note profitable campaigns that ran out of budget.
7. **Draft the changes** (prompt: `change-request-for-approval`; level 2 if you prepare a bulk file for the client to upload). Keep it to the changes that matter most, spaced so one cause can be read at a time.
8. **Send the weekly note and change list.** Mark each item "inside your limits" or "needs your yes".
9. **Make the changes** (level 3; tool: Amazon Ads Agent, bulk upload or the MCP server). Make the items inside the limits and the items the client said yes to. Log each: what, where, when, result, and the yes or limit that covered it.

## Outputs

- Weekly note (one page): per-product status, alarms, what changed and why.
- Harvest and negatives CSVs.
- Change request.
- Updated change log.

## Approval

**At level 3, inside the limits confirmed at the start (no new yes each week):** harvested keywords and negatives on the agreed rules, bid moves within the step size, budget moves within the cap, pausing targets that meet the agreed stop rule.

**Always needs a new yes:** spend above the cap, a new ad account or marketplace, a new campaign type (Sponsored Brands, display ads), switching on a budget rule, reserve share of voice, moving a product into launch spend, archiving or deleting anything, and any policy warning.

Reading reports, writing notes and drafting changes need no approval.
