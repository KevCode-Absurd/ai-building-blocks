# Monthly property run

**Cadence:** Monthly, with a short weekly check. Rent day and the few days after it; mid-month for repairs and compliance; month end for the owner report.

**Trigger:** The landlord hands over day-to-day management, or rent, repairs and certificates are being tracked from memory.

**Access:** Level 1 (read) on the property and accounting software is enough to reconcile and report. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "log and update repairs for the six Elm Road flats; send work orders to the three approved contractors up to the cap you set; send the approved 'rent is due' reminder on the 1st; send the owner report to the two owners; no notices, no deductions, no new contractors").

## Steps

1. **First month only: set the rules.** Agree repair categories, the cost cap, the approved contractor list, message templates and owner report format. Build the compliance calendar with the `repairs-and-compliance-log` skill, step 7. *Approval: the landlord agrees the rules and every template before first use.*
2. **Rent day.** [L3] Send the approved "rent is due" reminder where the landlord wants one. Two to three days later, reconcile rent received against rent due from the ledger.
3. **Late rent.** Draft the second and third letters with the `late-rent-reminder-sequence` prompt and the `tenant-notices-and-letters` skill. [L2] Save as drafts. *Approval: a fresh yes on each formal letter before it goes. Payment plans are the landlord's decision.*
4. **Weekly: repairs.** Pull new reports into the log, sort by the agreed categories, and send work orders (`repairs-and-compliance-log`, steps 1 to 6). [L3] Book approved contractors within the cap and send repair updates. Emergencies go to the landlord at once. *Approval: new contractors, jobs over the cap and notices of entry the tenant has not agreed need a fresh yes.*
5. **Mid-month: compliance.** Check the calendar for anything due in the next three months and book it, giving tenants notice. Flag anything overdue to the landlord the same day.
6. **Month end: owner report.** Build it with the `owner-report-and-deal-numbers` skill or the `owner-monthly-report` prompt. [L3] Send to the owners on the approved list.
7. **Log and report.** List every live action taken this month (what, where, when, result), every tenant contacted, and every decision waiting on the landlord.
8. **Check local rules.** Once a month, re-check the official pages listed in `knowledge.md` section 10 for changes that affect notices, deposits or safety checks, and note anything new for the landlord.

## Outputs

- Rent reconciliation and arrears list by days late
- Draft formal letters awaiting approval
- Maintenance log and work orders
- Compliance calendar with next due dates
- Owner report
- Monthly action log and decisions list

## Needs the client's approval

The rules, templates and contractor list before first use; every formal notice to a tenant, every rent change, deposit deduction and possession step (a fresh yes each time); any contractor not on the list and any job over the cap; and every payment, refund or transfer, which the landlord makes. Safety decisions are made by qualified trades and the landlord.
