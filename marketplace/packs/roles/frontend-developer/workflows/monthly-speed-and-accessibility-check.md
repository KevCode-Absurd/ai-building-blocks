# Monthly speed and accessibility check

**Cadence:** Once a month, on the same pages, plus after any redesign, new theme, new app or new tracking tag. About two hours of the client's time to share reports or access and review the result.

**Access:** level 1 for reports and checker exports; level 2 to open pull requests or prepare changes on a staging copy; level 3 to put the chosen fixes live, within the sites, environments and time the client set.

## Steps

1. **Collect the same evidence each month (level 1).** PageSpeed Insights for the five most important pages, mobile and desktop, saved with the date; the Core Web Vitals report from Search Console; any automated accessibility checker export. Use the same pages and settings every time.
2. **Compare with last month.** Field data first (it covers the last 28 days), lab data second. Note new third-party scripts, apps or tags since last month.
3. **Diagnose what moved.** Use the `page-speed-diagnosis` skill for any metric that got worse or still fails. Rank fixes by expected gain and effort.
4. **Accessibility spot check.** Run the `accessibility-fix-pass` skill on one key template each month (home, product or service, form, checkout), rotating so each is covered in turn. Check that last month's fixes held.
5. **Write a one-page report.** Pass or fail per page, what changed, top three fixes, last month's fixes checked, and anything not verified.
6. **Build the fixes (level 2).** Each fix becomes a small pull request or a step list for the platform, tested on a staging copy first. *Approval: the client picks which fixes to do this month.*
7. **Ship the chosen fixes (level 3).** With level 3 access, I merge and deploy the chosen fixes within the agreed limits and re-check the live pages. Otherwise the client's team applies them, staging first, then live.
8. **Log decisions and actions.** Keep a running list of fixes done, dates, results and every action taken in a tool, so the field data trend can be read against them.

## Outputs

- Monthly one-page report with field and lab numbers and dates
- Ranked fix list for the month
- Accessibility change table for the template checked
- Pull requests or platform steps for the chosen fixes
- Updated decisions and action log

## Needs the client's approval

- **Runs at level 3 within the limits, after the one-time confirmation:** shipping the fixes the client picked this month, on the named sites and environments.
- **Always needs a new yes:** which fixes to make, any removal of an app, plugin or tracking script (it may affect marketing or sales), any brand colour change, and any change outside the named sites or environments.
