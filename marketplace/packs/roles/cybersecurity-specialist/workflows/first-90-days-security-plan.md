# First 90 days: security plan for a small business

**Trigger:** A new client with no security plan, a near miss, an insurer or customer asking what the business does about security, or a new owner taking over.

**Access:** Set at the start, per tool (see `access.md`). Until you choose, I work at level 1. Scanning, testing and simulations happen only with the system owner's written authorisation, at any level.

## Steps

1. **Week 1: question set and access (level 1).** Send the question set from the `security-health-check-and-risk-register` skill and ask which access level the client grants per tool, with limits. Ask for no passwords. Ask whether any testing is wanted and, if so, who owns each system.
2. **Week 1: health check and register.** Run the `security-health-check-and-risk-register` skill. Deliver the summary, risk register, CSF map and 90-day plan. *Approval: the owner agrees the plan, the risk owners and the change list for level 3 items.*
3. **Weeks 1 to 2: quick wins (level 3 after one confirmation).** Apply the agreed free basics within the change list: two-step sign-in requirements, mail protections, sharing defaults, store staff permissions. Admin role changes go through a fresh yes each. Use the `it-administrator` kit for MFA roll-out and admin details. Log each change.
4. **Week 2: payment checks.** Write the call-back rule and two-person approval for bank-detail changes with the person who pays invoices. Process change only; no tool access needed.
5. **Weeks 2 to 3: staff rules.** Run the `staff-security-rules-one-page` prompt. *Approval: the owner signs off.* At level 3, publish the rules where staff read them.
6. **Weeks 3 to 5: awareness session.** Run the `phishing-awareness-session` skill: 30-minute session, quiz, reporting route, reporting drill. A simulation only with written authorisation and HR's agreement.
7. **Weeks 4 to 6: incident plan.** Run the `incident-response-plan-and-exercise` skill to write the one-page plan and contact sheet. *Approval: the owner signs off the plan.*
8. **Weeks 6 to 8: store (if any).** Run the `store-lockdown-and-card-testing` skill: checklist, app list, fraud rules, first-hour card. Rules go live at level 3 after the owner's yes; refunds above the limit, app removal and account deletion each need a fresh yes.
9. **Weeks 8 to 10: rehearse.** Run a tabletop with the `tabletop-exercise-script` prompt or an NCSC Exercise in a Box scenario. Update the plan.
10. **Weeks 10 to 12: suppliers and backups.** Ask key suppliers the three questions (MFA on admin access, how they report a breach, where data sits). Confirm a restore test happened (the `it-administrator` kit covers the method).
11. **Week 12: review.** Update the register, report progress against the plan, and set the quarterly review date. With web search connected, re-check the "What changes fast" facts live; without it, list the facts to confirm.

## Outputs

- Health check summary, risk register and CSF map
- 90-day plan with owners and access levels
- Change log of everything done at level 3
- One-page staff rules, awareness session pack and drill results
- One-page incident plan, contact sheet and exercise notes
- Store checklist and fraud rules, if relevant
- Day-90 report and next review date

## Needs the client's approval

**Approval points.** The 90-day plan and change list; staff rules; the incident plan; any fraud rules before they go live.

**Runs at level 3 after one confirmation.** The agreed items on the change list, within the limits set, logged one by one.

**Always needs a fresh yes.** Isolating or wiping a device; deleting any data, account, app or order; adding, removing or changing an admin role; refunds above the limit; turning off MFA or a fraud rule; any scan, test or simulation (which also needs the owner's written authorisation); messages to customers, insurers or regulators. Moving money and changing bank or payout details stay with the client.
