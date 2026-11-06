# Monthly speed and app review

**Cadence:** once a month, and within a week of any new app install, theme update or redesign.

**Time:** about two hours of review once the data is in.

**Access:** steps are marked L1 (read), L2 (read and draft) or L3 (read, write and publish). The review itself is L1.

## Steps

1. **Collect (tool: Web performance dashboard, PageSpeed Insights), L1.** Dashboard screenshots or a view-only role (summary, page types, over-time chart with annotations), PageSpeed links for home, a busy collection and a top product, and the current app list. Capture them promptly: the dashboard keeps 90 days only. Confirm "Access I have" is still current.
2. **Compare with last month, L1.** Note any page type whose LCP, INP or CLS moved out of the good range, and line it up with the annotations for app installs and theme changes.
3. **Review apps, L1.** For each app: still used, which pages it loads on, overlap with another app or a theme feature. List removed apps and check for leftovers (prompt: leftover-app-code-finder).
4. **Rank fixes (skill: speed-fix-list), L1.** Rank new problems by sales at risk divided by effort. Carry over unfinished fixes from last month.
5. **Check the calendar, L1.** Note Shopify deadlines that affect the store, such as apps that still rely on script tags, which Shopify stops adding to storefronts on 1 March 2027, and any upcoming sale that needs the launch-and-sale-readiness workflow.
6. **Write change requests (prompt: change-request-writer), L1** for the top fixes, with the level each needs.
   **Approval point:** the owner approves which fixes to make this month and any app removal, knowing what feature is lost.
7. **Build, L2, and release, L3 or the owner,** through the safe-theme-change workflow. App removals at L3 happen one at a time, each with a fresh yes, because removing an app can delete its data.
8. **Report, L1.** Send the monthly note and the action log.

## Outputs

- One-page monthly note: what changed, why, the top three fixes, app decisions.
- Updated baseline table.
- Change requests for approved fixes.
- Action log for any L2 or L3 work.

## Needs the client's approval

- Which fixes go ahead this month.
- Every app removal or replacement, each time.
- At L3, one yes to the month's action list before the first live action; anything outside the limits needs a fresh yes.
