---
name: lead-scoring-and-sales-handoff
description: Builds a lead and account scoring rule from a B2B firm's own won and lost leads (fit points, engagement points with decay, negative points for students, competitors and job seekers, and an account-level score for ABM), tests the threshold on last quarter's leads before it goes live, and writes the handoff agreement both sales and marketing sign - definition of sales-ready, routing, response time, what sales records, and the way back for rejected leads - plus a monthly pipeline report that shows sourced and influenced pipeline apart with each number's attribution window. Use when sales says marketing's leads are poor, leads wait days for a call, scores reward the wrong people, or pipeline reports can't be trusted.
---

# Lead scoring and sales handoff

Scoring decides who sales calls first. The handoff decides whether they call at all. Both should come from what actually turned into revenue, and both teams should sign them.

## When to use

- Sales ignores marketing's leads, or accepts few of them.
- The top of the score list is students, job seekers, competitors or existing customers.
- Leads wait days for a first call, or nobody knows who owns them.
- The board asks "how much pipeline did marketing create?" and the answers don't agree.

## What you need

1. **Lead history** for at least two quarters: each lead's source, properties (role, company, size, country), actions (visits, forms, webinar attendance, email clicks) and outcome (opportunity, won, lost, rejected, no response).
2. **Current lifecycle stages and lead status values** in the CRM.
3. **Sales capacity**: who takes leads, by region or segment, and how many a week.
4. **The current handoff rule**, even if it is "sales gets everything".
5. **Pipeline export**: opportunities with source fields, campaign touches, created date, value and stage.

**Access:** level 1 to read the CRM and exports. Level 2 to build the scoring rule switched off, draft properties and draft routing workflows. Level 3 to switch on the approved rule, update owner and lead status, and run approved routing. Changing a rule both leaders signed, bulk-updating stages or deleting records needs a fresh yes.

## Steps

### 1. Find what predicts revenue
Split past leads into those that became real opportunities and those that did not. For each property and action, compare how often it appears in each group. Keep the ones that clearly separate them. Note the sample size; if fewer than a few dozen leads converted, say the rule is a first guess to revisit.

### 2. Build fit points
Points for properties that match the ideal customer profile: role, seniority, company size, industry, country served. Negative points for clear non-buyers: student or personal email domains, competitor domains, job-seeker behaviour (careers page visits), existing customers routed to account management instead.

### 3. Build engagement points
Points for actions that came before opportunities in the history, weighted by how strongly: a demo request outranks a blog visit; attending a webinar outranks registering. Add decay so old activity fades. In HubSpot, decay can run every 1, 3, 6 or 12 months; pick the interval that matches the client's sales cycle.

### 4. Add an account score for ABM
For target accounts, total the engagement of everyone at the company and count distinct engaged people. Several engaged people at one tier 1 account should trigger sales even if no single person passes the threshold.

### 5. Test before switching on
Run the rule over last quarter's leads. Show: how many would have passed, how many of those became opportunities, how many real opportunities it would have missed, and how many leads a week sales would receive. Adjust the threshold until sales can handle the volume and few real opportunities are missed. Show the trade-off; let the leaders pick.

### 6. Write the handoff agreement
One page, signed by the marketing and sales leaders:
- **Definition:** what makes a lead or account sales-ready (score threshold, or a direct request such as a demo form).
- **Routing:** who receives it, by territory, segment or account owner.
- **Response time:** the time both teams agree, and what happens if it is missed.
- **What sales records:** first contact date, outcome, reason if rejected.
- **The way back:** rejected leads return to marketing with a reason and a status; in HubSpot, moving a stage backwards needs a deliberate reset because automatic updates only move forward.
- **Review:** acceptance rate and response time, monthly.

### 7. Report pipeline monthly
- Accounts engaged by tier; leads handed over; accepted; meetings held; opportunities created.
- **Sourced pipeline** (first touch was marketing) and **influenced pipeline** (any marketing touch) in separate columns, never added across channels.
- For each platform figure, the attribution model and window (LinkedIn defaults to last touch with 90-day click and 90-day view windows; say so if unchanged).
- Won revenue from target accounts at the end of the normal cycle.
- What to change next month.

## Checks

- Points are backed by the lead history, with sample sizes stated.
- Negative points remove obvious non-buyers.
- The threshold was tested on past leads, and the weekly volume fits sales capacity.
- The handoff agreement names owners, response time and the way back, and both leaders signed it.
- Sourced and influenced pipeline are shown apart, with windows stated.
- No personal data beyond what scoring needs; no sensitive properties.
- Level 2 and level 3 steps are marked.

## Output format

1. Evidence table: property or action, share among converted leads, share among others, points
2. Scoring rule with decay and threshold
3. Back-test on last quarter: passed, converted, missed, weekly volume
4. Handoff agreement (one page)
5. Monthly pipeline report template, with definitions

## Example of good output (short)

*Illustrative structure, not a real business: payroll software for firms of 50 to 500 staff. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Back-test, Q3 (412 leads, 38 became opportunities).**
>
> | Threshold | Leads passed | Of which opportunities | Opportunities missed | Leads a week to sales |
> |---|---|---|---|---|
> | 60 | 141 | 34 | 4 | 11 |
> | 75 | 72 | 29 | 9 | 6 |
>
> Sales can handle about 10 a week, so 60 fits; 75 would miss 9 real opportunities.
>
> **Handoff:** a lead at 60 points, or any demo request, goes to the territory owner in HubSpot. The owner calls within the agreed time and records the outcome. Rejected leads go back with one of four reasons (no budget, wrong role, timing, not a fit) and re-enter nurture.
>
> **October pipeline:** sourced £182,000 (14 opportunities); influenced £410,000 (31 opportunities, overlaps with sales-sourced deals). LinkedIn figures use last touch, 90-day click and 90-day view windows.
