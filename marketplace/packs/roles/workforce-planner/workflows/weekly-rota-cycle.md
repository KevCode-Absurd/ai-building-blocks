# Weekly rota cycle

**Cadence:** every week (or fortnight), finishing far enough ahead that the rota is posted by your own posting rule, and by any notice period a scheduling law sets where you operate. About one to three hours for a site with up to 40 staff.

**Access:** set at the start, per tool (see `access.md`). Steps marked level 2 or level 3 need that level in the named tool; at a lower level I hand you the draft to enter yourself. Until you choose, I work at level 1. Publishing each rota and changing anyone's hours need your fresh yes, even at level 3.

Check this with local rules, or ask a qualified employment adviser or accountant.

## Steps

1. **Collect (posting day minus 5).** Pull last week's actual sales or footfall by hour, approved time off, availability changes and any events coming up. Ask managers for known changes.
2. **Staffing needs (posting day minus 4).** Update the forecast and staff needed by hour and role with the `staffing-levels-from-demand` skill. Flag any hour where last week's actual demand beat the high case.
3. **Build the draft (posting day minus 3, level 2).** Use the `fair-rota-and-rules-check` skill to place the hardest shifts first, spread late and weekend shifts fairly and keep start times stable. At level 2 the draft sits in the rota tool where staff cannot see it.
4. **Check (posting day minus 2).** Run the `rota-precheck-before-publishing` prompt: rules, under-18 limits, fairness, cost against budget. Fix what can be fixed; list what cannot with options.
5. **Approve (posting day minus 1).** Send you the rota, the rule check, the fairness count, the cost and the open gaps. *Approval: you say yes to publishing this rota.*
6. **Publish (posting day, level 3, after your yes).** Publish the approved rota and send the agreed "rota is up" message to the team. Offer approved open shifts to the people you named. Log each action.
7. **Changes during the week.** For any requested change, run the `schedule-change-cost-check` prompt and show the cost and rule effects. *Approval: each change to anyone's hours needs your fresh yes.* Worker-requested swaps follow your swap rule.
8. **Review (after the week).** Compare planned against actual hours and cost, overtime by person, late changes and their cause. Note one fix for next week's rota.

## Outputs

- Updated staffing table by hour and role
- Draft rota (level 2) and rule check
- Fairness count for late, weekend and holiday shifts
- Cost against budget
- Published rota and team message (level 3, after your yes)
- Change log with cost of each change
- Weekly review note with one fix
- Action log (what, where, when, result)

## Needs the client's approval

**Runs within your limits after one confirmation.** Building drafts in the rota tool (level 2), sending the agreed "rota is up" message and offering approved open shifts to named people after a rota is approved (level 3).

**Always needs a fresh yes, or stays with you.** Publishing each rota, changing anyone's hours or shifts after publishing, cancelling a shift, offering hours beyond someone's contract or the budget, messaging a new group of people, running payroll and paying staff, and any question on what the law requires, which goes to your employment adviser.
