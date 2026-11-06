# Maintenance plan launch and renewals

**Trigger:** The owner wants recurring income from maintenance or service plans, or existing plan members are not being booked or renewed.

**Cadence:** Set up once, then weekly: book due plan visits and chase pending renewals.

**Access:** Level 1 (read) on the job tool is enough to design the plan and audit members. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "book plan visits into the quiet-month slots, send the approved visit and renewal reminders to plan members only; no plan contracts sent without the owner's yes").

## Steps

1. **Design the plan.** Run the `service-plan-tiers-and-visit-costing` prompt with the owner's real costs. *Approval: the owner chooses tiers, prices and perks; their accountant checks the model.*
2. **Write the terms summary.** Use the plan section of the same prompt, then the `plain-warranty-summary` prompt for any guarantee attached. *Approval: the owner's adviser checks cancellation, renewal and auto-billing wording against local rules.*
3. **Set it up in the tool.** [L2] Build the plan templates (visits, billing cycle, discount) in the job tool, unpublished. Check how the tool books visits: some tools generate recurring service events that staff must still book, others fill in visit months from the start date. [L3] Publish the templates once approved.
4. **Write the selling scripts and messages.** A short end-of-job script for technicians, an office phone script, and the plan messages (welcome, visit due, visit booked, renewal due, lapsed member) using the `customer-messages` skill. *Approval: the owner approves the scripts and templates.*
5. **Sell and send.** Plan contracts or agreements sent for signature need the owner's fresh yes each time. Card payments are taken by the client or through the tool's own payment flow.
6. **Book visits at sale.** [L3] As soon as a plan is accepted, book its visits into the quiet months using the `scheduling-and-dispatch` skill.
7. **Weekly: due list.** Review the tool's list of due plan visits and book them. [L3] Send the approved visit reminders.
8. **Weekly: renewals.** Review plans expiring soon and renewals still pending. Renewal drafts in some tools stay pending until the customer accepts and pays, so chase them. [L3] Send the approved renewal reminders to plan members only.
9. **Monthly: plan health.** Members, visits due versus done, renewals, cancellations and reasons, plan visit hours against the costing. Report to the owner with one suggested change.

## Outputs

- Plan tiers and costing (owner-approved)
- Plain-words plan terms
- Plan templates in the job tool
- Technician and office scripts
- Plan message set
- Weekly due-visit and renewal lists
- Monthly plan health report and action log

## Needs the client's approval

Tiers, prices, perks and terms; every plan contract sent for signature; any change to billing or auto-renewal settings; any message to customers who are not plan members; and refunds or cancellations with a charge. Payments and payout details stay with the client.
