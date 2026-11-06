# Weekly optimisation routine

**Cadence:** once a week, same day each week (Monday or Tuesday works well, so the weekend is in the data). About 60 to 90 minutes for a small account.

**Goal:** keep the account stable, catch problems early, and make a few well-reasoned changes, within the access level and limits the client set.

## Steps

Steps 1 to 6 need level 1 (read). Step 7 can use level 2, and step 9 needs level 3.

1. **Pull the data** (tool: Meta Ads Manager export, or the ads MCP server). Last 7 days and the 7 days before, at ad level, by day, with the attribution setting named. Pull shop or CRM totals for the same dates.
2. **Check tracking first** (skill: `meta-signal-health-check`, quick version). Open Events Manager: main event volume against shop orders or CRM leads, deduplication, any new diagnostics. If something broke, stop here and raise it.
3. **Read the week** (prompt: `weekly-results-read`). Spend, results, cost per result, ROAS, CPM, CTR (link), frequency. Note what moved and the likely cause, in this order: tracking, market, creative, post-click, structure.
4. **Learning and delivery** (tool: Ads Manager delivery column). List ad sets in learning, Learning limited, or with Creative limited or Creative fatigue statuses. Check the "Last significant edit" column so you do not judge an ad set that restarted learning two days ago.
5. **Creative pulse** (skill: `meta-creative-test-plan`, read-out section). Is a test ending this week? Read it against its pre-set rule. Is any concept fatiguing? Add it to the next brief.
6. **Budget pacing.** Compare month-to-date spend with the plan. Caps or ROAS goals that under-spend for several days are a sign the target is too tight.
7. **Draft changes** (prompt: `change-request-for-approval`; level 2 if you build them in Ads Manager as paused or unpublished edits). At most three, grouped so learning restarts once. Each with reason, effect, risk, review date and undo.
8. **Send the weekly note and change list** to the client. Mark each item "inside your limits" or "needs your yes". At level 1 or 2, every item needs a yes.
9. **Make the changes** (level 3; tool: Ads Manager, or the ads MCP server with its budget rule set to the client's cap). Make the items inside the limits and the items the client said yes to. At level 2, the client publishes them. Log each in the change log with date, item number, result, and the yes or limit that covered it.

## Outputs

- Weekly note (one page).
- Change request with numbered items.
- Updated change log and test log.

## Approval

**At level 3, inside the limits confirmed at the start (no new yes each week):** the kinds of change on the confirmed list, for example budget moves within the cap and step size, pausing ads that hit the agreed stop rule, and adding ads from the approved creative plan.

**Always needs a new yes:** a new campaign or ad account, spend above the cap, a new audience or customer list, a placement, bid strategy or goal change that is not on the list, turning Advantage+ creative enhancements on or off, starting or stopping a test that is not on the plan, a Special Ad Category choice, deleting anything, and any rejected ad or policy warning.

Reading data, writing notes and drafting changes need no approval.
