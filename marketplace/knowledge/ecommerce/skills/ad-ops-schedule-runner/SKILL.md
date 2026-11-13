---
name: ad-ops-schedule-runner
description: "Sets up an always-on ad operations assistant for a store with no self-built server: which checks run when (a frequent breakage monitor, a daily review, weekly and monthly jobs), each run on the AI tool's own scheduler or the ad platforms' free built-in scripts and rules in notify-only mode. Writes a short role brief for each specialist (ads, creative, copy, reporting), one shared work queue, alert rules that pass work between specialists without flooding the team, and replies in the team's chat or email. Every account change goes through the owner's approval. Use when nobody watches the ad accounts every day, when problems are found days late, or when several people or agents share the accounts."
---

# Scheduled ad-operations assistant

**You get:** a schedule of ad checks (breakage monitor, daily review, weekly and monthly jobs) on free schedulers in notify-only mode, with role briefs, alert rules, a work queue and a shadow-week report, ready to switch on.

The schedule, roles, queue and alert rules that make the store's ad checks run on their own and report into chat or email. The checks themselves live in other skills; this one decides when they run, who acts on them, and what never happens without a yes.

## When to use

- Nobody checks the ad accounts daily, so problems (spend stopped, ads rejected, tracking broken) surface days late.
- Several people or agents share the accounts and work falls between them.
- The owner wants a short daily report in chat instead of three dashboards.
- A founder checking ads by hand hands over to a small team or agents.

## Not for

- The daily account review itself: use `daily-ad-account-review`; this skill schedules it.
- How change proposals are approved and logged: use `ad-change-approval-gate`; this skill routes every change there.
- Connecting the data: use `ad-and-store-data-connections` first.
- Grading past decisions: use `recommendation-scorekeeping`, scheduled weekly here.

## What you need

Required:

1. **Working data connections** from `ad-and-store-data-connections`, read-only, with the sync log passing.
2. **Money lines** from `store-meta-math`: gross profit per purchase, break-even cost per purchase, and the monthly spend ceiling.
3. **Team channel**: where reports go (Slack, Microsoft Teams, Google Chat, WhatsApp group or email), connected through the tool's official integration, and who reads it.
4. **Approval rules** from `ad-change-approval-gate`: who approves what, and the written limits.
5. **Specialists**: the people or agents who own ads, creative, copy and reporting, even if one person holds several roles.

Optional: stock feed per SKU, sale calendar, the store's working hours and time zone.

Access: the assistant reads (level 1). Drafting changes needs level 2. Any live change goes through `ad-change-approval-gate`; this skill never grants level 3.

## Before you start: the gates

1. **Gross profit per purchase.** Pass when the money lines exist. Fail: run only the breakage monitor (spend, rejections, tracking, stock); no alert may judge performance against a target that does not exist.
2. **Cash.** The monthly spend ceiling is written into the alert rules. Pass when stated. Fail: the overspend alert uses the current daily budgets and says "no ceiling set".
3. **Capacity.** Name the approver and their response time. If nobody can answer an alert within a working day, cut alerts to breakages only.
4. **Tracking.** Pass when the store-versus-platform check in `ad-and-store-data-connections` passes. Fail: the first scheduled job is that fix, and performance alerts stay off.

## Steps

### 1. Choose the scheduler

Use what the store already has; build no server.

- **The AI tool's own scheduled tasks** for runs that call skills and write reports.
- **Google Ads scripts** (free, inside Google Ads) for Google-only checks; they can run hourly and send email.
- **Meta automated rules** set to notify only, never to change budgets or pause ads on their own.
- **Google Sheets with a time trigger** for queue housekeeping, if the queue is a sheet.

Write down, for each job: scheduler, run time in the store's time zone, what it reads, what it writes, and who is told.

### 2. Set the schedule

| Cadence | Job | Calls |
|---|---|---|
| Every 2 to 4 hours, working hours | Breakage monitor | Checks in step 4 only |
| Daily, before the team starts | Daily review and report | `daily-ad-account-review` |
| Weekly, Monday | Creative cycle; budget read; scorekeeping | `weekly-creative-sprint`, `cross-channel-budget-reallocation`, `recommendation-scorekeeping` |
| Monthly | Money lines refresh; full audit; access review | `store-meta-math`, `store-meta-audit` or `google-ads-account-audit`, `ad-and-store-data-connections` |
| Before and after a sale | Pre-sale check; post-sale read | `store-meta-plan`, then the weekly jobs |

Match cadence to how fast money moves (practitioner default, test it): spend, cost per purchase and delivery hourly to every 4 hours; creative fatigue every 6 hours; feed, quality and email health daily; list growth weekly. Do not run everything hourly; it buries the signal.

Run two passes: a cheap scan over every campaign that flags anything that moved, then a deeper analysis only on the flagged ones. Most days only a few need it.

### 3. Write a role brief per specialist

One short brief each, kept in the shared folder:

- **Ads:** owns budgets, structure and bids; acts on breakage and daily review items; proposes changes through the approval gate.
- **Creative:** owns the creative queue; acts on fatigue and low-diversity flags; delivers briefs and assets.
- **Copy:** owns ad text, headlines and landing page lines; acts on rejected-ad and message-match flags; runs claim checks.
- **Reporting:** owns the daily and weekly reports, the store-versus-platform check and the decision log.

- **Lead:** reads every role's findings, spots when two roles flag the same store, writes the daily brief, and ends it with the single most important action in one sentence. It proposes and delegates; it never approves on a human's behalf.

Each brief states: scope, the skills it uses, the queue items it picks up, what it hands to whom, what it may never do (spend, publish, or message customers without a yes), and its evidence rules:

- No data, no numbers: if a source is empty, say so.
- Owner claims are quoted as claims ("you said returns are up"), not adopted as facts.
- No diagnosis below a minimum of data (practitioner default: 3 or more days and spend of at least one target cost per purchase).
- Pull the daily breakdown before calling anything a winner.

### 4. Set the alert rules

Breakage alerts (always on):

- Active campaign with zero spend for 4 or more hours in working hours.
- Spend pace above 1.5 times the daily budget, or month-to-date spend above the planned share of the ceiling.
- Ads or products rejected; Merchant Center disapprovals, often price mismatches between feed and page [GAD-0005].
- Platform purchases at zero while the store has orders in the same window (tracking break).
- An advertised product with fewer days of stock than its reorder lead time; raise its target or pause it, as a proposal [ADC-0023].

Performance alerts (only when the money gate passes):

- Cost per purchase above break-even on 7 days of data, not one day. Below about 1,000 a day of Meta spend, daily ROAS swings are normal [ADC-0064].
- Cold-campaign ad frequency above 2, a fatigue or diversity flag for the creative queue [MCR-0040].
- Performance Max clicks up while value falls, a sign of placement drift into video or Gmail [GAD-0055].
- Store revenue down: split into sessions, conversion rate and order value before blaming ads [MEA-0009].

Rules that must not alert:

- The last 3 or 4 days of Google Ads look weak because conversions are credited to the click date [MEA-0051].
- A single bad day below the spend level above.
- The platforms' automated suggestions; they are not alerts [ADC-0064].

More rules worth having: spend with zero purchases for 7 days on a campaign; monthly budget pacing 20% over or under plan with 10 or more days left.

Each alert carries: what tripped, the numbers, gross profit at stake per day where known, the owner from step 3, and the skill to run next. Route by severity: critical goes out at once with acknowledge, investigate and dismiss replies; warnings wait for the daily brief; information is logged only. Same alert twice in a day is merged. Cap at five non-breakage alerts a day (practitioner default, test it).

Combined patterns: when two different roles flag related problems for the same store within 24 to 48 hours (for example creative fatigue plus a cost rise), raise one joint diagnosis instead of two alerts. Require 2 of 3 signals, set a cooldown at least as long as the window, and replay the rule on 30 days of past data first, keeping false alarms under 10%.

Tune monthly: more than 20% false alarms a week, loosen the threshold by about 25%; a problem a person caught first, tighten by about 15%; an alert that fires and clears repeatedly must hold for two checks in a row before firing.

### 5. Run one work queue

A shared sheet or board with one row per item: id, source (monitor, daily review, weekly job, person), type, owner, status (new, in progress, waiting approval, done, dropped), evidence link, proposed change, approval reference, due date. Specialists pick up items by type. An alert that needs another specialist becomes a new row assigned to them, linked to the first; that is how the ads owner hands a fatigue flag to creative.

Each run picks work in this order: items already in progress, approved changes not yet done, items waiting for review, new items, then routine checks. Mark a row "in progress" with the run time before working it; a row stuck that way for over 30 minutes is released for the next run. A role never assigns work to itself in a loop; a parent item closes only when its child items are done.

### 6. Report into chat or email

- **Daily, one message:** breakages (or "none"), spend and store orders yesterday and last 7 days against break-even, items waiting approval, and the one decision needed today.
- **Weekly:** results of last week's approved changes, the creative plan, and the budget read.
- Replies in the thread are read on the next run, or at once where the chat tool has an official AI integration. Four reply types teach the system: approve; reject (the diagnosis was wrong); right problem, wrong action; already known (too sensitive or repeated). A new house rule ("no budget rises on Fridays") is recorded as a rule; a data error is fixed at the source and the finding dismissed, not counted against the role. A weekly digest lists what was approved, rejected and learned; `recommendation-scorekeeping` grades the predictions.
- Review windows: normal items within 24 hours, urgent within 4 hours. A proposal mixing a small safe change with a large risky one is split in two. Nothing is posted in a customer-facing channel.
- Approvals still go through `ad-change-approval-gate` and its log.

### 7. Keep changes behind approval

The assistant may: read, draft, propose, and log. It may not: change budgets, bids, targeting, status or creative live; spend; or message customers, unless the owner's written limits in `ad-change-approval-gate` allow a named action. Platform rules and scripts stay notify-only. Avoid stacked changes during a decline; targeted fixes first, because rebuilds reset learning [GAD-0036]. For fast trend work, the owner may pre-approve a fixed budget and turnaround in writing [OPS-0018].

### 8. Test for a week, then go live

Run every job in shadow mode for five working days: reports go only to the owner, alerts are logged but not sent. Count false alarms and missed issues. Tune thresholds, then switch on team reporting.

## Checks before you hand it over

- Every scheduled job lists scheduler, time, inputs, outputs and recipient; no self-built server is used.
- Performance alerts are off unless the money lines exist; breakage alerts are on.
- No platform rule or script can change the account on its own.
- Every specialist brief states what it may never do.
- Every alert names an owner and the next skill; non-breakage alerts are capped.
- The shadow week ran, with false alarms and misses counted and thresholds tuned.
- Approvals route through `ad-change-approval-gate` and its log.

## Output

1. **One-screen summary:** the schedule, who gets what, which alerts are live, and what still needs the owner.
2. **Schedule table:** Job, Cadence, Time, Scheduler, Reads, Writes, Notifies.
3. **Role briefs:** one page per specialist.
4. **Alert rules table:** Alert, Rule, Data window, Severity, Owner, Next skill, On or off.
5. **Work queue** template with the columns in step 5.
6. **Shadow-week report:** alerts fired, false alarms, misses, changes made to thresholds.

## Common mistakes

- **Alerting on daily ROAS at low spend.** Step 4 uses 7 days and a spend floor [ADC-0064].
- **Panicking over the last three days of Google Ads.** Step 4 suppresses it [MEA-0051].
- **Rules that act on their own.** Step 7 keeps every rule notify-only.
- **Alert floods.** Step 4 merges and caps them.
- **Work lost between roles.** Step 5 turns hand-offs into linked queue rows.
- **Going live untested.** Step 8 runs a shadow week first.
- **Judging performance with no break-even.** Gate 1 limits the assistant to breakages.

## Sources

- ADC-0023: tie ad targets to stock cover.
- ADC-0064: daily ROAS swings are normal below about 1,000 a day; ignore automated suggestions.
- GAD-0005: Merchant Center price mismatch disapprovals.
- GAD-0036: targeted fixes before rebuilds.
- GAD-0055: Performance Max placement drift.
- MCR-0040: cold frequency above 2 signals fatigue.
- MEA-0009: split revenue into sessions, conversion and order value.
- MEA-0051: Google credits conversions to the click date.
- OPS-0018: pre-approved budget for fast trend work.

What makes this skill ours: it runs on schedulers the store already has, with platform rules locked to notify only; performance alerts switch on only when gross profit per purchase exists; alert rules suppress known false alarms such as low-spend daily ROAS and Google's late-filling days; and a shadow week tunes the thresholds before the team sees a single alert.
