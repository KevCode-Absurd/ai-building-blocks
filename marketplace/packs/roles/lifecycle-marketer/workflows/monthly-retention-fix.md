# Monthly retention fix

**Cadence:** once a month, in the first week, for a shop or subscription business with at least a few months of order history. One fix per month, measured before the next.

## Steps

1. **Access check.** Confirm the level for each tool: store, email and SMS platform, subscription app. Record it under "Access I have", with any level 3 limits (segments, sends a week, discount cap, end date). Until the client answers, level 1.
2. **Pull the data (level 1).** Last month's order export, or subscriber and cancel exports, plus a note of what changed in the shop (sales, price changes, stock-outs, flows switched on or off).
3. **Read the cohorts (skill: retention-cohort-read).** Update the cohort or drop-out table with the same definitions as last month. Note any cohort too small to read.
4. **Check last month's fix.** Compare the fix group with its holdout or with the previous cohort at the same age. Say plainly: worked, did not work, or too early to tell. Keep it, undo it, or let it run.
5. **Pick this month's weakest stage and one fix.** Use the skill's step 7 and 8. For a subscription, read cancel reasons with the prompt `cancel-reason-read`. For reorder timing, use the prompt `reorder-timing-from-orders`. For lapsed buyers, use `win-back-without-a-big-discount`.
6. **Design the fix.** Write the flow change, the texts or the cancel-page change. If the fix uses texts, run the checks in the skill `sms-consent-and-send-plan` and the prompt `text-message-pack-check`. If it changes a subscription offer or cancel path, use the skill `subscription-offer-and-cancel-path`.
   **Approval point 1:** the client approves the fix, any offer and its cap, and the holdout plan.
7. **Build.**
   - Level 1: deliver the copy, settings and a step-by-step build note.
   - Level 2: build the change switched off or as drafts; send tests to internal addresses and numbers. Log each item.
8. **Go live.**
   - Level 1 or 2: the client switches it on.
   - Level 3: show the action list (each flow or change, segment, counts, send times, holdout) and the limits, get a yes, then switch on within them. Ask again before anything outside the limits. Log each action.
9. **Watch.** In the first days, check opt-outs, complaints, carrier filtering, cancellations and errors. Stop and tell the client if any of them jumps.
10. **Report.** What changed, the action log, last month's result, this month's fix, and the read date.

## Outputs

- Updated cohort or drop-out table, with definitions.
- Verdict on last month's fix.
- This month's fix: copy, settings, holdout and measures.
- Drafts (level 2) or live changes (level 3), with the action log.
- A one-page monthly report.

## Needs the client's approval

- The access level per tool and, for level 3, the limits.
- The fix, any discount or perk and its cap, and the holdout (approval point 1).
- Anything outside the level 3 limits, asked again each time: new segments, new lists, bigger offers, price or renewal changes for existing subscribers.
- Refunds and payment changes, which stay with the client.
