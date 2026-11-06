---
name: prioritise-and-roadmap
description: Turns a long backlog or request list into a short, reasoned plan - goals for the period, each item written as a bet, a scoring table (RICE, or value, effort S/M/L and risk) with the scoring shown, dependencies checked, work fitted to real capacity with room held back for surprises, a now/next/later roadmap of outcomes, a "not now" list with a reason for each item, a request-screening rule for new asks, and a one-page stakeholder update. Can update Jira Product Discovery, Jira or Linear at the access level granted. Use when a team has more ideas than time, before a quarter or cycle, or when stakeholders need to hear "no" with reasons.
---

# Prioritise and roadmap

Most small teams do not lack ideas; they lack a short list everyone understands. This skill ties every item to a goal, shows the scoring, fits the plan to real capacity, and writes down every "no" with its reason, so nobody feels ignored and the team can focus.

## When to use

- Before a quarter, a cycle or a planning meeting.
- A backlog that has grown past what anyone reads.
- A flood of requests from sales, support or the founder.
- A board or stakeholder update on the roadmap.

## What you need

- **Goals** for the period, with how each is measured. If goals are vague, sharpen them before ranking anything.
- **The full list** of candidate work: backlog export, requests, ideas.
- **Capacity:** who builds, for how many weeks, and how much unplanned work usually lands.
- **Evidence** behind the big items (from discovery, analytics or support).
- **Dates already agreed** with customers, if any.
- **Access I have** per tool: level 1 to read the backlog; level 2 to add scores and a draft roadmap view; level 3 to update fields, reorder the backlog and publish the roadmap within the limits.

## Steps

1. **Write the goals at the top,** each with its measure. Two or three is plenty.
2. **Clean the list.** Merge duplicates, split anything too big to score, drop items nobody can explain.
3. **Write each item as a bet:** "We believe [change] will move [measure] for [users]." Items that move no goal go straight to the "not now" list.
4. **Score.** Use RICE where data allows: Reach (people or events per period, from real metrics where possible), Impact (3 massive, 2 high, 1 medium, 0.5 low, 0.25 minimal), Confidence (100%, 80%, 50%), Effort (person-months); score = reach x impact x confidence / effort. Without data, use value to the goal (high, medium, low), effort (S, M, L) and risk (high, medium, low). Show the table and every assumption.
5. **Sense-check the order.** Recheck any score that looks too high or low. Move up items that unblock others, table-stakes work, and cheap tests of the riskiest assumptions.
6. **Fit to capacity.** Add up effort for the top items until capacity is used, leaving room for unplanned work based on the team's own history. Name what is in and what falls below the line.
7. **Write the "not now" list** with a reason and a "revisit when" note for each item.
8. **Write the roadmap in three horizons:** now (committed, this cycle), next (likely, shaped), later (ideas). Each line is an outcome or bet, not a feature list. Dates only where the team agreed them.
9. **Write a request-screening rule** for new asks: which goal does it move? What evidence? What would we stop to do it? Accept, defer or decline, with the reply template.
10. **Write the stakeholder update:** done, next, changed and why, risks, decisions needed.
11. **Access steps.** Level 2: add scores and a draft roadmap view in Jira Product Discovery, Jira or Linear, visible only to the client. Level 3: update priority fields, reorder the backlog, publish the roadmap view and post the update to the agreed channel, within the limits. Ask again before sharing outside the agreed audience or before changing any date promised to a customer.

## Checks

- Every item in "now" ties to a goal.
- Scores and assumptions are visible.
- The plan fits capacity with room held back.
- Every declined item has a reason.
- No unagreed dates.
- The update fits one page.

## Output format

1. **Access I have.**
2. **Goals** with measures.
3. **Scoring table:** item, bet, reach or value, impact, confidence, effort, risk, score, notes.
4. **Capacity line:** total, held back, committed.
5. **Roadmap:** now, next, later.
6. **"Not now" list** with reasons and revisit triggers.
7. **Request-screening rule** and reply template.
8. **Stakeholder update** (one page).
9. **Action log.**

## Example of good output (short)

*Ledgerly is a made-up business used only to show the format: invoicing software with two developers for 12 weeks and 40 backlog items. Goals: raise trial-to-paid conversion; cut "how do I" support tickets.*

| Item | Bet | Value | Effort | Risk | Call |
|---|---|---|---|---|---|
| Guided first invoice | Will lift trial-to-paid for new trials | High | M | Low | Now |
| Bank feed import | Will cut setup tickets for new users | High | L | Medium | Next: test demand first |
| Dark mode | Moves no goal | Low | M | Low | Not now |
| Mobile app | Moves no goal this quarter | Medium | L | High | Not now |

**Capacity:** 24 developer-weeks; part held back for support work, based on last quarter's share; 16 committed.

**Not now:** Mobile app. Reason: large effort, moves neither goal, would take the room held for surprises. Revisit after the conversion work ships.

**Request reply template:** "Thanks for this. It doesn't move this quarter's two goals, so it's on the not-now list with a note to revisit in [month]. If you have customer evidence, send it and we'll re-score."
