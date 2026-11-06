# Weekly pipeline review

**Cadence:** Every week while one or more roles are open, about 30 minutes. Monthly, a longer look across all roles.

**Trigger:** A role has been open for a week, or the hiring manager asks "where are we?".

**Access:** Level 1 (read) on the ATS is enough for the review itself. Steps marked [L3] need read, write and publish access within the client's confirmed limits; without it, they come back as drafts.

## Steps

1. **Get the tracker.** Read the ATS at level 1, or use the client's export: candidate ID, source, stage, date entered stage, status and decline or withdrawal reason. No contact details or CVs leave the ATS.
2. **Count the funnel.** Run the `hiring-funnel-report` prompt. It counts each stage, the share moving on, results by source, and anyone waiting past the promised reply time.
3. **Find the one bottleneck.** Pick the stage with the biggest drop or the longest wait. Common causes: a post that attracts the wrong people (fix with `job-post-and-outreach`), a screen that is too strict (check the criteria in `evidence-based-screening`), slow interviewer feedback (book scoring time straight after each interview), or pay out of line with the market (raise with the owner).
4. **Check fairness signals.** Read the decline reasons. Flag any that are not job related, any pattern by source that suggests one channel is treated differently, and any step where a tool filters people out. Do not guess anyone's protected characteristics from names or photos; if the client collects voluntary equal opportunity data, use only the totals, kept separate from hiring decisions.
5. **Clear the waiting list.** Use the `decline-and-update-messages` prompt for everyone past the promised reply time. [L3] Send the holding updates, and the declines the hiring manager has decided, from the approved templates.
6. **Agree one or two changes.** Each change names the number it should move and when we will look again. [L3] Apply changes inside the confirmed limits, such as editing a live post or closing a poor board, and log them.
7. **Monthly:** compare roles. Which channels produce people who reach offer, which stages lose the most people, how long offers take. Update the role brief template and the reply times. Review the action log with the client.

## Outputs

- Weekly funnel report with one bottleneck and one or two changes
- Holding updates and declines for anyone waiting
- Action log entries for every live change
- Monthly channel and stage summary

## Needs the client's approval

Any change to the screening criteria, the stages, the pay range, the channels or the spend, unless it is inside the level 3 limits already confirmed; every decision on a candidate; any tool setting. Outside the limits, I ask first. Check this with local rules before changing screening steps or tools.
