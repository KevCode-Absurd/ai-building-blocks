---
name: ad-change-approval-gate
description: "Turns ad change ideas from audits, daily reviews and monitors into short proposals the store owner can approve or reject by replying in chat or email, with no custom server. Each proposal shows the money at stake, how easily the change can be undone, the evidence, and the expected effect as a range. An approval matrix sets which actions need a yes, which can happen inside written limits, and which only the owner can do. Spend guardrails warn at set points and use the platforms' own spending limits as a hard stop. Every approved change goes into one audit log. Use it to set up how an agent or team may touch the ad accounts, and every time a change is proposed."
---

# Ad changes the owner approves, with spend limits that hold

**You get:** an approval matrix with spend limits, numbered change proposals the owner can answer yes or no in chat or email, and a change audit log file, ready for agents, freelancers or agencies to work under.

Agents and junior buyers find many things to change. Most should wait, some need a quick yes, and a few the owner must do personally. This skill sorts them by money and reversibility, asks in a form the owner can answer in one word, and keeps a log that shows who approved what.

## When to use

- Setting up how an AI agent, a freelancer or an agency may change the store's ad accounts.
- An audit or daily review produced a list of changes.
- A monitor flags a spend spike or a pacing problem.
- The owner wants spend limits that cannot be passed, even by mistake.

## Not for

- Finding the changes in the first place: use `store-meta-audit`, `google-ads-account-audit` or `daily-ad-account-review`.
- Deciding budgets per campaign: use `store-meta-budget` or `cross-channel-budget-reallocation`.
- Grading whether approved changes worked: use `recommendation-scorekeeping`.

## What you need

Required:

1. **The proposed changes**, each with its evidence (export rows, screenshots).
2. **The owner's limits**: monthly ad cap per platform, daily cap, the most any single change may move, and the end date of any level 3 permission.
3. **Who approves**: one named person per platform, a back-up, and how they reply (chat, email, a shared sheet).
4. **Money lines** from `store-meta-math`: gross profit per purchase and break-even cost per purchase, to size money at stake.

Optional: the platforms' current account spending limit settings, the last 30 days' activity history.

Access: this skill writes proposals and logs at level 1. Setting a platform spending limit is an account setting: the owner sets it, or approves it explicitly. Never ask for passwords, tokens or payment details.

## Before you start: the gates

1. **Gross profit per purchase known.** Needed to put a money figure on each proposal. Fail: proposals show spend at stake only, marked "profit effect unknown".
2. **Limits and approver named.** Fail: every action is treated as "owner yes before" until they are written down.
3. **Tracking trusted.** If tracking is broken, every proposal except tracking fixes and pauses is held; numbers built on a broken signal are not a reason to act [ADC-0028].

## Steps

### 1. Score each change on three things

**Money at stake** = weekly spend the change affects, plus the gross profit it could add or lose. Use the store's gross profit per purchase, not revenue. Size it against the store, not a fixed amount: small is under 5% of daily ad spend, medium 5 to 20%, large over 20%, practitioner default. A fixed "under 50 a day" band means nothing to a store spending 100 a day or 20,000.

**Reversibility:**
- Easy: undone in minutes with no lasting effect (lowering a budget, pausing one ad).
- Costly: undone, but resets learning or loses days (new targeting, bid strategy, optimisation event, big budget jumps, a pause of 7 days or more on Meta, per Meta documentation).
- Permanent or public: cannot be undone (deleting campaigns, publishing new ads people will see, changing tracking or store settings).

**Who sees it:** only the team, the owner, or customers (live ads, offers, messages). A change customers see that cannot be undone is never below tier C, whatever its size.

The default is deny: only reading, reporting and drafting happen without a yes. Everything else needs a tier.

### 2. Place it in the approval matrix

| Action | Default tier |
|---|---|
| Pause an ad or ad set that meets a written cut rule | A: inside limits, report after |
| Lower a budget | A |
| Pause ads on a SKU about to sell out [ADC-0023] | A |
| Raise a budget within the per-change limit | B: yes by reply first |
| Change a cost cap, bid or ROAS goal | B |
| Publish new ads (switch on a paused batch) | B |
| New campaign, new targeting, new optimisation event | C: written proposal, yes, and a review date |
| Raise a budget beyond the per-change limit | C |
| Delete anything | C, and archive or pause instead where possible |
| Change pixel, Conversions API, store app or consent settings | C |
| Billing, payment method, account spending limit, user access | D: owner only |
| Any message to customers | D: not an ad-account change |

Tier A runs only when the owner has given level 3 access with written limits. Without it, A becomes B. A large change in tier B moves to C. If the store names a second approver, tier C needs both. The owner can move any row up a tier; nothing moves down without them saying so.

A small pre-approved budget lets a team act fast on time-sensitive work, as some brands do for trend content with a fixed spend and turnaround [OPS-0018]. Support teams use the same idea with a fixed no-approval amount per incident [OPS-0009]. Tier A is that idea for ads: small, written, capped.

### 3. Hold back changes the evidence does not support

Before writing any proposal:
- Below about 1,000 a day of Meta spend, one or two days of results are noise; judge on 7 days or more [ADC-0064].
- A raise judged on its first day looks worse than it is, because new buyers convert days later [ADC-0056].
- A scale proposal needs the marginal cost of the last raise below break-even, not just a good average [ADC-0049].
- When stock is slow and cash is tight, a cut can make cash worse; check before proposing cuts on clearance campaigns [FIN-0027].
- Related signals become one proposal: when two of three linked warnings on the same campaign arrive within 48 hours (for example frequency up, click-through down, cost per purchase up), send one combined proposal with one diagnosis, not three. After a proposal on a campaign, wait 24 hours before proposing on it again, practitioner defaults.

### 4. Write the proposal so it can be answered in one word

Format, one block per change (numbers illustrative only):

> **P-0142 | Tier B | Meta | Raise "PROSP CBO" from 400 to 500 a day**
> Why: store-basis cost per purchase 17.80 over 14 days against a target of 20; last raise bought sales at 19.10 each.
> Money at stake: up to 700 extra spend a week; expected gross profit change minus 0 to plus 380 a week (method: extra spend divided by marginal cost, times gross profit per purchase, minus extra spend).
> Undo: lower back in one step; no learning reset at this size, practitioner default.
> Review: 21 Nov. Urgency: normal. Expires: 24 hours after sending.
> Reply **YES P-0142** or **NO P-0142**.

Rules: one change per proposal; never bundle a safe change (a pause) with a risky one (a raise), so one answer cannot block or carry the other. Show the expected effect as a range with its method, never a single promised number. Expiry by urgency, practitioner defaults: normal 24 hours; high (money leaking now) 4 hours; emergency (spend spike, tracking stopped, wrong price live) a direct message or call the same hour. An expired proposal is a no; resend it with fresh numbers if still needed.

### 5. Send, collect, and act only on a clear answer

Send proposals as one numbered message per day, in the channel the owner chose. Only "YES" with the proposal ID counts. "Looks fine" or a thumbs-up on a group message gets a one-line follow-up asking for the ID. Silence is a no. An approval applies to that proposal only, not to similar ones later.

Record the kind of answer, because each teaches something different: yes; no (the diagnosis was wrong); right problem, wrong action; or already known (too obvious or too frequent). A no caused by bad data is a data fix, not a lesson about the advice. These feed `recommendation-scorekeeping`.

### 6. Set the spend guardrails

Three layers:

1. **Platform hard stop (owner sets it):** Meta's account spending limit and campaign spending limits in billing settings; Google's campaign budgets, keeping in mind Google can spend up to twice the daily budget on a day while keeping the month near 30.4 days of budget (Google Ads documentation). These stop spend even if everything else fails.
2. **Pacing warnings (this skill computes them daily):** pacing = spend to date / (monthly cap x days elapsed / days in month). Warn at 110%. At 125%, propose reductions as tier A or B. Practitioner defaults, test them.
3. **Per-change limit:** no single proposal may raise daily spend by more than the owner's written limit. A larger change is split, or goes to tier C.

When spend reaches 100% of the monthly cap before month end, the only automatic action allowed is the one the owner wrote in advance (for example "pause all prospecting"), and only at level 3. Otherwise, alert the owner the same hour.

### 7. Keep one audit log

Append one row for every proposal, whatever happens to it. Store it in a shared sheet the owner can read. Rows are never edited; corrections are new rows.

### 8. Close the loop

On each review date, add the outcome to the log and pass the row to `recommendation-scorekeeping`. When a tier A rule keeps producing good results, the owner may widen it; when one goes wrong twice, it drops to tier B.

## Checks before you hand it over

- Every proposal has an ID, a tier, money at stake, reversibility, evidence, an effect range with its method, an undo step and an expiry.
- No tier A action runs without written level 3 limits and an end date.
- Nothing in tier D is proposed as something the agent will do.
- Pacing is computed from the cap and today's date, and warnings match the thresholds.
- Platform hard stops are listed as set, or listed as "owner to set".
- Every live change in the log has a matching YES with the same ID.

## Output

**Summary, one screen:** proposals waiting (count and total weekly spend at stake), pacing per platform, guardrail status, changes made since the last summary, and anything that needs the owner today.

**Table "Approval matrix":** Action, Tier, Who approves, Limit, Report after (yes or no).

**Proposal messages** in the format of step 4, numbered.

**File "change-audit-log.csv":** ID, Date proposed, Platform, Object, Change, Tier, Urgency, Money at stake, Reversibility, Who sees it, Evidence link, Effect range, Approver, Answer, Answer kind, Answer time, Done by, Done at, Before value, After value, Review date, Outcome, Grade.

## Common mistakes

- **Treating a thumbs-up as approval.** Step 5 needs "YES" plus the ID.
- **One approval reused for the next similar change.** Approvals are per proposal.
- **Proposals built on two days of data.** Step 3 holds them [ADC-0064].
- **Spend limits only in a spreadsheet.** Step 6 puts the hard stop in the platform, set by the owner.
- **Single-number promises.** Step 4 gives a range with a method.
- **A log that gets tidied.** Step 7 only appends.

## Sources

- ADC-0023: pause ads on SKUs about to sell out.
- ADC-0028: tracking before other changes.
- ADC-0049: scale on the cost of the last extra sales.
- ADC-0056: day-one reads of raises mislead.
- ADC-0064: short windows are noise.
- FIN-0027: cutting media can hurt cash when stock is stuck.
- OPS-0009, OPS-0018: small pre-approved budgets let teams act fast.

What makes this skill ours: tiers set by gross profit at stake and how hard a change is to undo, not by who asked; one-word approvals tied to an ID that expire; spend limits that live in the platform's own settings; and an append-only log that feeds the store's scorekeeping.
