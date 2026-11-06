# After an outage: report, customer update and safer procedure

**Trigger:** An incident met the client's postmortem triggers: user-visible downtime, data loss, a rollback, a long resolution, or monitoring that missed it. Start within a day of recovery while memories are fresh; finish within one to two weeks.

## Steps

1. **Agree access (level 1 until answered).** Read access to chat exports, alerts, deploy logs and monitoring. Level 2 to draft in the client's docs or status tool. Level 3 only if the client wants me to publish an approved status update. Record the "Access I have" list.
2. **Customer update first, if customers were affected (level 2).** Use the `customer-incident-update` prompt with confirmed facts only. *Approval: the client approves before anything is published; publishing needs level 3 or is done by the client.*
3. **Flag reporting rules on day one.** If the client is a US public company, in a NIS2 sector in the EU, under the UK NIS Regulations, or personal data was involved, tell their legal or data protection lead now. They decide what to report and when.
4. **Collect the material (level 1).** Every source before any conclusions. Ask for missing times.
5. **Write the report (level 2).** Use the `blameless-incident-report` skill: timeline with sources, impact, contributing causes, what went well and badly, where we got lucky, actions with owners and dates.
6. **Review.** Someone senior who was not in the incident reviews it for blame, gaps and weak actions. *Approval: the client signs off the report and the action owners accept their actions.*
7. **Fix the runbook (level 2).** Draft the safer procedure: symptoms, checks, fixes, escalation, rollback, customer messages. Where the cause was a change pushed everywhere at once, add a staged rollout or kill switch to the actions.
8. **Do the actions.** Pipeline or config changes go through the `docker-and-ci-pipeline` or `release-checklist-and-rollback` skill and the client's normal approvals. Production changes at level 3 only, after the action list is confirmed; destructive changes, deletions and spend past the cap need a fresh yes.
9. **Final customer update, if promised (level 2).** What changed, with the same prompt. *Approval: the client approves before publishing.*
10. **Track to done.** Check actions on their due dates and record "how we know it worked".

## Outputs

- Customer updates (first, progress, resolved, follow-up) with a fact list
- Reporting flags for the client's legal lead
- Blameless incident report, reviewed
- Updated runbook
- Action tracker with owners, dates and evidence

## Needs the client's approval

Every customer-facing update before it is published; the final report and action owners; any production change that comes out of the actions, through the normal pipeline approvals; a fresh yes for destructive changes, deletions and spend past the cap. Reporting to regulators or investors is decided by the client's legal lead. The client can lower the access level at any time.
