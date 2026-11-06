# Monthly link review

**Cadence:** monthly, in the first week of the month. Two to four hours.

**Access:** level 1 to read the backlink tool, Search Console and the tracking sheet; level 2 to save the report and update the sheet; level 3 to fix redirects for lost links in the named site sections and send recovery notes to the approved list.

## Steps

1. **Collect (level 1).** Export new and lost links from the backlink tool, the Search Console Links report, and check the Manual Actions report. Note Google updates that ran during the month from the Search Status Dashboard.
2. **Write the report.** Run the `monthly-link-report` skill: new referring domains by campaign, link types, unlinked mentions, lost links, risk check.
3. **Recover lost links (level 3).** Where the client's own URL change broke a link, add a redirect in the named site section. Where a linking site changed a URL by mistake, send a short note to that contact if they are on the approved list. *Approval: contacts not on the approved list need a new yes.*
4. **Check risk.** If the profile shows something odd, run the `backlink-profile-risk-check` prompt. *Approval: any disavow upload or reconsideration request needs the client's fresh yes, every time.*
5. **Plan next month.** Pick three next steps from the report, such as a new angle for the current asset, a refresh, or a local cut. *Approval: the client agrees next month's priorities.*
6. **Share.** Send the one-page report to the client and the manager they name.

## Outputs

- One-page monthly link report with appendix table
- Updated tracking sheet
- Redirect fixes and recovery notes, logged
- Risk check result and any prepared disavow or reconsideration drafts
- Next month's three steps
- Action log

## Needs the client's approval

- **Runs at level 3 within the limits, after the one-time confirmation:** adding redirects for lost links in the named site sections, and sending recovery notes to contacts on the approved list.
- **Always needs a new yes:** uploading or replacing a disavow file, sending a reconsideration request, contacting anyone not on the approved list, and any payment.
