---
name: cloud-cost-and-resilience-review
description: Reviews an AWS, Azure or Google Cloud bill and set-up from cost exports and a service list - top costs and month-on-month change, waste (idle or oversized servers, old snapshots, unattached storage, data transfer, test systems left on), savings ranked by amount, effort and risk with a safe test for each, a tagging and budget alert plan that reaches a person, and a resilience check of backups, restore tests and single points of failure. Works from exports at access level 1; creates budgets, alerts and tags at level 3 within the client's limits. Deleting any resource, switching on an automatic spending brake, and spend above the budget cap each need a fresh yes. Use it for a surprise bill, a monthly cost check or before a hosting move.
---

# Cloud cost and resilience review

## When to use

- The cloud bill jumped and nobody knows why.
- A monthly or quarterly cost check.
- Before a hosting move, to compare like with like.
- Nobody can say when a backup was last restored.

## What you need

1. Cost exports for the last three months by service (and by tag or project if tags exist). AWS Cost Explorer, Azure Cost Management or Google Cloud Billing exports all work.
2. A list of services and what each does for the business, and which are production.
3. Current budgets and alerts, and who receives them.
4. Backup settings and the date and result of the last restore test.
5. The monthly budget cap the client wants.
6. Access: level 1 (exports or a billing read-only role) is enough for the review. Level 3, within the client's limits, to create budgets, alerts and tags.

## Steps

### 1. Show where the money goes

Group spend by service, then by environment and project if tags allow. Put the top five costs and the change since last month at the top. Name what changed: a new service, more usage, a price change, or something left on.

### 2. Look for waste

Check, in order of usual size:
- Servers and databases with low use for weeks, or sized for a peak that never comes.
- Test, staging and demo systems running nights and weekends.
- Old snapshots and backups past any retention need; unattached disks; unused IP addresses.
- Data transfer between regions or out to the internet; NAT and load balancer charges.
- Logs kept forever; storage in a costly class for data nobody reads.
- Commitment coverage (Savings Plans, reservations) that is too low or unused.

For each finding: resource, monthly cost, why it looks wasteful (the evidence), and who owns it.

### 3. Rank the savings

Table: action, saving range per month, effort, risk, how to test. Savings are ranges, never promises. Mark every change that could cause an outage and say how to test it first (stop it for a day in staging, resize in a quiet window, snapshot before deleting).

### 4. Check resilience

- Backups: what is backed up, how often, how long kept, and whether a restore was tested and timed. AWS Backup can schedule restore tests and remove the test copies afterwards; each test has a cost.
- Single points of failure: one server, one region, one person with the keys.
- What happens if the region has a bad day. The AWS US-EAST-1 disruption on 19 and 20 October 2025 also hit launching new servers and IAM sign-in, so "we'll just launch more" may not work.
- Who gets alerts at night.

### 5. Plan tags, budgets and alerts

- **Tags:** a short list (project, environment, owner, cost centre). On AWS, user-defined cost allocation tags must be activated before they show in Cost Explorer and take up to a day to appear. No personal or secret data in tags.
- **Budgets:** monthly cost budget at the cap, with actual and forecast alerts to a named person and a shared channel. Budgets alert; they do not stop spending on AWS, Azure or Google Cloud.
- **Anomaly alerts:** AWS Cost Anomaly Detection runs about three times a day and can take up to a day to flag a spike; new services need history first.
- **Automatic brakes, only with a fresh yes:** AWS budget actions that block new resources, Google Cloud automation that disables billing on a project, Azure action groups that run automation. They can stop production.

### 6. Act at the right level

- Level 1: deliver the review and plan.
- Level 2: draft budgets, alerts and tag changes as code or a change list.
- Level 3, after the client's yes on the action list: create budgets and alerts, apply tags, make agreed low-risk changes within the cap.
- A fresh yes every time: deleting anything (servers, snapshots, buckets, IPs, users), switching on an automatic brake, buying commitments, and any change that takes spend past the cap. Take a snapshot or backup before any change that touches data.

### 7. Report and follow up

A one-page summary, the tables, and a date to check the next bill.

## Checks

- The top five costs and the month-on-month change are correct against the export.
- Every saving has a range, an owner, a risk and a test.
- Nothing is marked for deletion without a backup plan and a fresh yes.
- Budget alerts go to a real person, and the client understands they are not caps.
- The resilience section states when a restore was last tested, or that it never was.

## Output format

1. Summary: top five costs, what changed, the three biggest savings, the biggest risk.
2. Waste table: resource, monthly cost, evidence, owner.
3. Savings table: action, saving range, effort, risk, how to test.
4. Resilience checklist with gaps ranked.
5. Tags, budgets and alerts plan.
6. Action list for the client's yes, with deletions and brakes listed separately.

## Example of good output (short)

*Made-up business for illustration: "Larkspur Learning", AWS bill up from about 900 to 2,600 a month.*

> | Action | Saving per month | Effort | Risk | How to test |
> |---|---|---|---|---|
> | Stop staging RDS nights and weekends | 150 to 220 | Low | Low | Schedule in staging for one week |
> | Delete 41 snapshots older than 180 days | 90 to 130 | Low | Medium: can't undo | Confirm retention need, keep latest 3; **fresh yes needed** |
> | Fix cross-region copy job | 600 to 800 | Medium | Medium | Run once to the same region, compare file counts |
>
> **Resilience:** daily database backups kept 7 days; no restore test on record. Next step: one restore test into a separate account, timed, before any other change.
