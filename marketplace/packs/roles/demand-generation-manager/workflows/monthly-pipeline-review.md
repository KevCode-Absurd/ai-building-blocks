# Monthly pipeline review with sales

**Cadence:** first Monday of each month, with the marketing and sales leaders. About two hours of preparation and a 30-minute meeting.

**Access:** set at the start, per tool (see `access.md`). Level 1 is enough to read the CRM and ad exports and write the report. Level 2 to keep the report as a draft dashboard or document. Level 3 to share it with the agreed people and update lead owners or statuses agreed in the meeting. Until you choose, I work at level 1.

## Steps

1. **Pull (Friday before).** CRM export of leads handed over, accepted and rejected (with reasons), response times, meetings, opportunities by source and tier, pipeline value, won and lost deals. Ad exports by company with each platform's attribution setting. Webinar and event attendance by company.
2. **Check handoff health.** Using the agreement from the `lead-scoring-and-sales-handoff` skill: acceptance rate, response time against the agreed time, rejected reasons, leads with no owner.
3. **Write the report.** Use the `abm-progress-report` prompt: accounts engaged by tier, warming and cold accounts, sourced and influenced pipeline apart with windows stated, won revenue, last month's actions.
4. **Spot scoring drift.** If many accepted leads scored low, or many high scorers were rejected, list the rules to revisit. Changes go through the skill's back-test before they go live.
5. **Meet (Monday).** Agree three actions with owners, any accounts to move between tiers, and any change to the handoff rule.
6. **Apply (level 3, within limits).** Update agreed lead owners, statuses and tier values; share the report with the agreed people. Log every change.
7. **Follow through.** Next month's report opens with what happened to these actions.

## Outputs

- One-page monthly pipeline report with definitions and windows
- Handoff health check: acceptance, response time, rejection reasons
- Agreed actions with owners
- Scoring changes proposed, with back-test results
- Action log

## Needs the client's approval

**Approved once, then run at level 3 within your limits.** Sharing the report with the agreed list; updating owners, statuses and tiers agreed in the meeting.

**Always needs a new yes.** Changing the scoring rule or the handoff agreement both leaders signed, bulk changes to lifecycle stages, deleting or merging records, and sharing the report with anyone new.
