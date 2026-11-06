# Weekly optimisation routine

**Cadence:** once a week, same day each week. About 60 to 90 minutes for a small account.

**Goal:** catch problems early, keep traffic clean, and make a few well-reasoned changes, within the access level and limits the client set.

## Steps

Steps 1 to 8 need level 1 (read). Step 9 can use level 2, and step 11 needs level 3.

1. **Pull the data** (tool: Google Ads reports, Google Ads Editor download, or the Google Ads API MCP server). Campaigns, search terms, ads and assets, and Performance Max channel performance for the last 7 days and the 7 before. Shop or CRM totals for the same dates.
2. **Check conversions first** (skill: `google-conversion-tracking-check`, quick version). Conversions versus shop or CRM; any diagnostics warnings on conversion actions; any change to primary goals. If tracking broke, stop and raise it.
3. **Read the week** (prompt: `weekly-results-read`). Brand and non-brand apart. Bid strategy status for each campaign: learning, limited by budget, limited by target.
4. **Search terms** (skill: `search-terms-cleanup`; prompt: `search-terms-review`). Weekly for larger accounts, fortnightly for small ones. Include AI Max and Performance Max terms.
5. **Bidding and budget** (skill: `smart-bidding-strategy`). Any target campaign limited by budget: is the target still right after the 17 August 2026 change? Impression share lost to budget on profitable campaigns: draft a budget proposal with a forecast. Do not propose target changes on campaigns changed in the last one to two conversion cycles.
6. **Ads and assets.** Ad Strength, low-performing assets to replace, disapprovals (prompt: `responsive-search-ad-writer` for replacements).
7. **Feed** (if Shopping or Performance Max with a feed): new Merchant Center disapprovals or price mismatches.
8. **Experiments.** Any running custom experiment: past its settling period? Read it against its pre-set rule.
9. **Draft changes** (prompt: `change-request-for-approval`; level 2 if you prepare them in Google Ads Editor and leave them unposted). At most three to five, spaced so one cause can be read at a time.
10. **Send the weekly note and change list.** Mark each item "inside your limits" or "needs your yes". At level 1 or 2, every item needs a yes.
11. **Make the changes** (level 3; tool: Google Ads or Google Ads Editor). Make the items inside the limits and the items the client said yes to. At level 2, the client posts them. Log each with date, item number, result, and the yes or limit that covered it.

## Outputs

- Weekly note (one page).
- Search terms lists (negatives, keywords, watch).
- Change request.
- Updated change log.

## Approval

**At level 3, inside the limits confirmed at the start (no new yes each week):** the kinds of change on the confirmed list, for example negatives from the agreed themes, replacing low-performing assets, and budget or target moves within the cap and step size.

**Always needs a new yes:** a new campaign or account, spend above the cap, a new audience or customer list, a bid strategy or conversion goal change that is not on the list, bidding on competitor terms, applying Google's recommendations or turning auto-applied recommendations on or off, starting or applying an experiment that is not on the plan, deleting anything, and any disapproval or policy warning.

Reading data, writing notes and drafting changes need no approval.
