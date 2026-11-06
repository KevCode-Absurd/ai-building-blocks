# Monthly maintenance and updates

**Cadence:** Monthly, plus within days of any security release for core or an installed plugin. About an hour of the owner's time to share information or access and approve the plan.

**Access:** level 1 to read Site Health, updates and security findings; level 2 to take backups and run the plan on staging; level 3 to run the approved plan on live, only on the named sites, in the agreed window, and with a fresh backup.

## Steps

1. **Collect (level 1).** Site Health > Info as text, Dashboard > Updates, the security plugin's findings (if any) and last month's notes. The owner sends them, or I read them through the connected site.
2. **Check the backup.** Confirm a backup ran in the last day and that a restore was tested in the last quarter. If not, plan a restore test on staging first (level 2).
3. **Review security news.** Check WordPress.org releases for new core versions and the security plugin's alerts for installed plugins. Security fixes go first.
4. **Plan.** Run the `safe-update-plan` skill: inventory, keep, update, replace or remove calls, order, test and rollback for each step. Every few months, run the `plugin-cleanup-review` prompt as well. *Approval: the owner approves the plan and the live run window. That is the action list for level 3.*
5. **Staging run (level 2).** Apply the plan on staging in order, with the test list after each step. I do it with level 2 access; otherwise the owner or developer does. Any failure goes through the `wordpress-break-fix` skill before going further.
6. **Live run (level 3).** Fresh backup, same order, quiet time, tests after each step, rollback ready. With level 3 access I run it and log each step; otherwise the owner or developer does.
7. **Health check.** Site Health shows no new critical issues, debug display is off, forms deliver, PHP version is still supported, and auto-updates are set as agreed.
8. **Report.** One page: what was updated, what was removed, what failed and how it was fixed, risks left (abandoned plugins, PHP end-of-life dates coming up), next month's items, and the action log.

## Outputs

- Monthly update plan with order, tests and rollback
- Staging and live test results
- One-page maintenance report with the action log
- Updated list of plugins with their calls and upcoming end-of-life dates

## Needs the client's approval

- **Runs at level 3 within the limits, after the owner approves the month's plan:** the updates in that plan, on the named sites, in the agreed window, with tests after each step and rollback if one fails.
- **Always needs a new yes:** any plugin removal or replacement not in the plan, any PHP or core version change not in the plan, changes to which plugins auto-update, restoring a backup over live, and anything else outside the plan.
