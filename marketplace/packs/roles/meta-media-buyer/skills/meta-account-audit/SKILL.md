---
name: meta-account-audit
description: Audit a Meta (Facebook and Instagram) ad account the way a senior media buyer would. Checks tracking and event quality, goals and value, account structure and learning, creative supply and fatigue, budgets and bid strategies, attribution and incrementality, and policy risk, then ranks fixes by money at stake and turns them into a change list the client approves. Use when taking over an account, when results have slipped for weeks, before raising spend, or once a quarter.
---

# Meta account audit

## When to use

- You are taking over an account from another buyer or agency.
- Cost per result has drifted up for two or more weeks and nobody knows why.
- The owner wants to spend more and needs to know whether the account can take it.
- Quarterly health check.

Not for: a single ad that was rejected (use the policy prompt), or a one-day dip (wait for more data first).

## What you need

Minimum (no account access):
- Ads Manager export, last 90 days, by day, at ad level, with: campaign, ad set and ad name; delivery status; spend; impressions; reach; frequency; CPM; link clicks; CTR (link); results; cost per result; purchases or leads; purchase value; ROAS; attribution setting.
- Screenshots of Events Manager: overview, main conversion event detail, event match quality, deduplication.
- Shop or CRM totals by day for the same 90 days (orders, revenue, refunds, or leads and qualified leads).
- The client's unit economics: average order value or lead value, gross margin, target cost per acquisition.
- A screenshot of the activity history for the last 30 days.

Better: partner access with **View performance** on the ad account and **Use events dataset** on the dataset.

**Access:** level 1 for the whole audit; level 2 to build the fixes paused for you; level 3 to make approved fixes live, within your limits.

## Steps

Work in this order. Each layer depends on the one before it.

### 1. Business frame (10 minutes)
Write down expected contribution before ads per acquired order after landed COGS, fulfilment, payment fees, returns/refunds and other variable costs. That is the contribution break-even CPA. Break-even ROAS is the same purchase-value definition reported by the ad platform divided by that contribution; use 1 / contribution rate only when its revenue denominator matches exactly. A 40% product gross margin alone gives a product-cost-only threshold of 2.5, not profit break-even. Missing costs block a scaling verdict. Keep first-order economics separate from mature-cohort value and cash.

### 2. Tracking truth
- Compare platform purchases (or leads) to shop or CRM for the same dates. A gap is normal; the question is whether it is stable and explainable. Platform higher than the shop usually means double counting or view-through credit. Platform far lower usually means missing events.
- Events Manager: are browser and server events both present for the main conversion? Is deduplication working (shared event name and event ID, within 48 hours)? What is the event coverage ratio against Meta's 75% guide? What is event match quality for the main event?
- Does the purchase event carry value and currency? Are test or staging events polluting the data?
- Note the attribution model (standard, incremental, custom) and windows on each ad set. Flag mixed models in one comparison.

If tracking fails badly, stop the audit here and make tracking the first and only recommendation. Everything else is noise until it is fixed.

### 3. Goal and value
- What performance goal does each ad set optimise for? Flag any that optimise for clicks, landing page views or reach when the business wants sales or leads.
- For lead businesses: is there any signal back from the CRM on lead quality (Conversions API for CRM, or offline uploads)?
- For shops with varied margins: is value optimisation or a ROAS goal in use, and are values correct?

### 4. Structure and learning
- Count active campaigns and ad sets. For each ad set, estimate weekly results against the ~50 needed to leave learning. Weekly spend needed is about 50 times cost per result.
- How many ad sets show Learning limited? What share of spend sits in them?
- Overlap: several ad sets chasing the same people with the same goal? Recommend combining and using breakdowns for reporting.
- Advantage+ levers: are campaign budget, Advantage+ audience and Advantage+ placements on? If not, is there a stated reason (for example, a Special Ad Category or a brand placement restriction)?

### 5. Edits and stability
From the activity history, count significant edits per ad set per week (targeting, creative, optimisation event, new ads, bid strategy, big budget jumps, pauses of 7 days or more). More than one a week on a core ad set is a stability problem.

### 6. Creative
- Group live ads by concept (person, problem, promise, proof, format), not by file. Count distinct concepts.
- Share of spend on the top ad and top concept. If one concept takes most of the spend and shows Creative limited or Creative fatigue, a refresh is overdue.
- Formats in use: video, static, carousel, catalogue; vertical versions for Reels and Stories.
- When was the last new concept launched? What is the hit rate (share of new concepts that reach break-even)?
- Advantage+ creative enhancements: which are on, and has the client approved them?

### 7. Budget and bidding
- Bid strategy per campaign. Caps or ROAS goals that under-spend for days in a row are set too tight.
- Budget split across prospecting, retargeting and existing customers. Large retargeting share with high ROAS needs an incrementality question, not more budget.

### 8. Measurement maturity
Has the account ever run a Conversion Lift or a proper A/B test? Is there any check outside Meta (post-purchase survey, MMM, holdout by region)? Rate it: none, informal, tested.

### 9. Policy and risk
Special Ad Category needed but missing? Rejected ads in the last 90 days? Account Quality warnings? Claims in ads that cannot be proven?

## Checks before you send it

- Every finding has evidence: a number, an export row, or a screenshot reference.
- Findings are ranked by money at stake per month, not by how interesting they are.
- No finding contradicts the tracking verdict.
- Each fix states what changes, the expected effect, the risk (for example, "restarts learning on two ad sets") and when we review it.
- Nothing is presented as done. Every fix is a proposal until the client says yes or it falls inside agreed level 3 limits, and anything made live is in the change log.
- You have said what the data cannot tell you.

## Output format

1. **Verdict in three lines:** can this account take more spend now, after fixes, or not yet?
2. **Scorecard:** Tracking, Goal and value, Structure, Stability, Creative, Bidding, Measurement, Policy. Each rated Good, Needs work or Broken, with one line of evidence.
3. **Findings table:** rank, finding, evidence, monthly money at stake (estimate, with the method), fix, effort, risk.
4. **Change list for approval:** numbered, each item small enough to say yes or no to.
5. **What I need from you:** access, exports, decisions.
6. **Review date.**

## Example of good output (short)

> **Verdict:** Not ready to scale. Purchases are counted twice on about a third of orders, so reported ROAS of 3.1 is closer to 2.2 against shop revenue. Break-even is 2.5.
>
> | # | Finding | Evidence | At stake / month | Fix | Risk |
> |---|---|---|---|---|---|
> | 1 | Purchase events double-counted | 412 Meta purchases vs 301 shop orders, 1 to 30 Sep; server events have no event ID | Decisions made on wrong ROAS | Add matching event ID to pixel and server purchase events | None to delivery |
> | 2 | 9 ad sets, 7 Learning limited | 64% of spend in Learning limited; cost per purchase 34 USD there vs 26 USD in the rest | About 1,100 USD (8 USD extra on about 140 purchases) | Combine into 2 ad sets after fix 1 | Restarts learning for about a week |
>
> **For your approval:** 1) Developer adds event ID (I will write the spec). 2) After 7 clean days, merge ad sets as listed. Reply yes or no to each.
