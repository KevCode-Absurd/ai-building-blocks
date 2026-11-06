# Monthly automation health check

**Cadence:** Monthly, plus straight after any failure alert that repeats. About an hour for a small business with up to twenty automations.

## Steps

1. **List the automations (level 1).** For each: platform, owner, apps touched, trigger, last run, runs this month, and whose account its connections use.
2. **Read the run history (level 1).** Errors, halted runs, replays, and runs that did nothing. Zapier only guarantees a limited window of run history, so export or note what matters each month.
3. **Check usage (level 1).** Tasks, credits, executions or automation runs used against each plan. Flag anything heading over the limit, and any billing change due (for example Zapier's task counting for Next Gen Zaps from 1 December 2026).
4. **Check connections and owners (level 1).** Expired connections, accounts of people who have left, connections with more permission than needed, AI or MCP connectors with more actions switched on than the access level allows.
5. **Spot-check results (level 1).** Pick five records from this month and follow each through every app. Look for doubles and gaps.
6. **Fix what is broken.** Use the `automation-review-and-fix` skill. Stage fixes at level 2; apply at level 3 within the agreed limits. *Approval: anything outside the limits, such as replaying many runs, deleting duplicates or adding a new app, needs the client's yes first.*
7. **Retire what is unused.** Automations with no useful runs for a long time are proposed for switch-off. *Approval: the client decides; switching off at level 3 only after their yes.*
8. **Report.** One page: automations healthy, fixed, at risk, and retired; usage against plans; connection or owner changes needed; every action taken this month from the log.
9. **Refresh facts.** Re-check the "What changes fast" table in `knowledge.md` against the vendors' help pages.

## Outputs

- Automation list with owners and connections
- Errors and fixes, with the log
- Usage against plan limits
- Spot-check results
- One-page monthly report

## Needs the client's approval

Fixes outside the agreed limits, bulk replays, deleting or merging duplicate records, adding apps or accounts, switching automations off, and any change to who can access what. The client can lower the access level at any time.
