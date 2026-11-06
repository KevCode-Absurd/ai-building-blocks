# Peak season plan

**Trigger:** The client's busiest season is coming (for example the run-up to Christmas, a big sale event or a seasonal product launch). Start as soon as the carriers publish their dates for the year, and in time for the client to hire and order packaging.

**Cadence:** Weekly check-ins from planning until the season ends, then a short review.

**Access:** Level 1 (read) on last year's orders, tickets and carrier records is enough to plan. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "publish the approved cut-off banner and FAQ; switch on the approved delay auto-reply; buy labels within the higher peak cap").

## Steps

1. **Read last year.** From last year's orders and help desk tickets, work out orders and tickets by week, and tickets per 100 orders. List what went wrong (late cut-offs, stock-outs, carrier delays, packing backlogs).
2. **Forecast low, likely and high.** Use last year's weekly shape and this year's numbers the client gives. Label every assumption. Plan stock and carrier capacity from expected sales, not from the size of the biggest order.
3. **Turn the load into hours.** Packing hours and support hours per week at each forecast level, from the client's own pick, pack and ticket times. Mark the weeks where the team runs out of hours.
4. **Set cut-offs from confirmed carrier dates.** Use only this year's published carrier dates (for example USPS's 2026 send-by dates) and the client's own dispatch time. *Approval: the client confirms every cut-off before it is shown to customers.*
5. **Check costs and capacity.** Peak surcharges and any carrier volume limits from the client's contracts or the carriers' current notices. Re-run the `shipping-cost-review` skill on the expected order mix if surcharges change.
6. **Write the customer-facing set.** Banner, FAQ, cut-off email and auto-reply with the `delay-and-lost-parcel-messages` prompt, using the confirmed dates. [L2] Save drafts in the store and help desk. [L3] Publish once approved.
7. **Brief the warehouse or 3PL.** Forecast, cut-offs, packing specs, extra staff, inbound stock dates and who to call. [L2] Draft the brief. *Approval: the client sends it or approves it before it goes.*
8. **Run the season.** Daily: the `daily-order-and-exception-watch` workflow. Weekly: compare actual orders and tickets with the forecast and adjust staff and cut-offs. [L3] Update the banner if a carrier changes its dates, within the approved wording.
9. **Review.** After the season: what held, what broke, numbers against forecast, claims raised, and three changes for next year.

## Outputs

- Last-year review and low, likely and high forecast
- Staff hours plan by week
- Confirmed cut-off dates
- Banner, FAQ, cut-off email and auto-reply
- Warehouse or 3PL brief
- Week-by-week checklist and signs that more help is needed
- End-of-season review and action log

## Needs the client's approval

The forecast and staffing plan; every cut-off date before it is shown to customers; all customer-facing wording; the warehouse or 3PL brief; any higher label spending cap; and any carrier claim, which always needs a fresh yes.
