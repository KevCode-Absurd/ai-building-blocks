---
name: weekly-store-operating-review
description: "A weekly operating review run across every agent and person working on the store: one status note from each in a fixed format, a numbers page covering sales and profit, ads, stock, fulfilment, support, returns and cash with normal ranges, the blockers with who can clear them, the approvals waiting for the owner, cross-team clashes (ads pushing a product that is out of stock, a sale the site does not show), the decisions made, and next week's priorities capped per owner and tied to the quarter's plan. Use to run the store's weekly meeting, when agents work in parallel and nobody sees the whole picture, or when approvals and blockers sit for days."
---

# Weekly store operating review

**You get:** a one-page review ready the day before the meeting (numbers page, exceptions, blockers, approvals queue, clashes, decisions to make, next week's priorities), a filled status note from each agent, an updated decision log, and a 45-minute agenda.

## When to use

- Several agents (ads, email, merchandising, offers, analyst, support, finance) work on the store and the owner cannot see what each is doing.
- Approvals wait for days and work stalls.
- Teams clash: ads push a product that is nearly out, email promotes a sale the site does not show.
- The store needs one weekly rhythm that covers stock, support and cash, not just growth.

## Not for

- The growth numbers deep dive (what changed in sales and why): use `weekly-growth-meeting-pack` and bring its finding here.
- Building the weekly numbers sheet: use `build-weekly-kpi-dashboard`.
- The monthly report or P&L: use `monthly-store-performance-report` or `monthly-store-pnl`.
- Choosing the quarter's bets: use `store-90-day-growth-plan`.

## What you need

Required (read access):

1. **Weekly KPI sheet** from `build-weekly-kpi-dashboard`, this week and the four before.
2. **Status note from each agent and person** (template in Output), due the day before the meeting.
3. **Stock report:** days of stock remaining for the top products and open POs with dates.
4. **Fulfilment:** orders shipped within the promised time, delayed orders, courier issues.
5. **Support:** tickets, first response time, top three reasons, refunds issued.
6. **Cash:** bank balance, payouts expected, bills due in the next four weeks.
7. **The 90-day plan** and last week's decision log.

Optional: the growth pack, change log (prices, offers, site, budgets), incidents.

If an agent's note is missing, list it as "no status" in the review; do not write it for them. The review itself needs read access only. Any action it agrees runs at the access level the client set for that tool, and every spend, publish or customer message still needs the client's yes.

## Before you start: the gates

1. **Numbers have a source and date.** Fail: mark the line "unchecked" and do not decide on it.
2. **Reporting traps corrected:** the latest 3 to 4 days of Google conversions always look weak because they are credited to the click date [MEA-0051]; Shopify books returns on the refund date, so a strong month is followed by a false dip [MEA-0011]. Fail: note the trap next to the number.
3. **The decider is known.** Approvals need the owner or the person they named. Fail: list decisions as "waiting" with a date.
4. **Access levels on record** for every agent and tool, carried forward word for word each week.

## Steps

### 1. Collect status notes

The day before, every agent and person fills the same note: done this week (with link or proof), in progress (with expected finish), blocked (what, since when, who can clear it), waiting for approval (the exact action and its cost or risk), numbers they own and whether they are in range, and next week's two priorities. Notes longer than half a page are cut back.

### 2. Build the numbers page

Eight to ten numbers, each with this week, the four-week average, its normal range and its source:

- Net sales, gross profit and contribution after ads. Keep fixed costs out of weekly contribution; spreading them by day suggests cuts when spend should rise [MEA-0030].
- New customers and cost per new customer.
- Orders shipped on time (percent) and orders delayed.
- Stock: products with fewer weeks of cover than their restock lead time. Read demand on in-stock days only [OPS-0014].
- Support: first response time, tickets per 100 orders, top reason.
- Returns, refunds and (India) RTO rate.
- Cash: balance, next four weeks' bills, expected payouts. Payouts arrive net of fees, refunds and disputes [FIN-6241].

A small dip in two numbers that compounds to about 10% is usually noise [MEA-0009]; only numbers outside their normal range become exceptions.

### 3. List the exceptions

For each number out of range: the likely cause, the owner who will explain it, and whether it needs a decision this week. Do not explain numbers inside the range.

### 4. Clear the blockers

List every blocker with what clears it (a decision, access, money, information, another agent's output), who, and by when. Any blocker older than one week goes to the top of the agenda.

### 5. Put the approvals in one queue

Every action waiting for the owner's yes: the action, which agent, cost or risk, deadline, and the recommendation. Group by type (spend, publish, send to customers, price or offer change, supplier or legal). The owner decides each in the meeting or sets a date.

### 6. Check for clashes

Compare the agents' plans for next week and flag clashes:

- Ads or email pushing a product with less stock than the plan needs.
- An offer, price or end date that differs between ads, site, cart, email and support replies.
- Merchandising featuring a product the sale excludes.
- Two agents changing the same page or campaign in the same week (tests would be unreadable).

Each clash gets one owner and a fix before anything goes live.

### 7. Log decisions

For each decision: what was decided, by whom, why, the signal to watch, and the date to review or undo. Grade last week's decisions: done, not done, worked, too early.

### 8. Set next week's priorities

- At most three priorities for the store, each tied to a 90-day plan bet or a fix-what-is-broken item. Anything new goes into the backlog for `prioritize-growth-backlog`, not straight into next week.
- Each agent or person: at most two items, each with a done definition.
- Standing budgets the owner pre-approved, such as a fixed amount to act on a fast trend without waiting for sign-off [OPS-0018] or a weekly budget for making unhappy customers whole [CXP-0022], are reported with what was spent.
- Monthly: one item checks courier and 3PL invoices against orders; overcharging is common [OPS-0012].

### 9. India and US notes

- **India:** report COD orders waiting for courier remittance and RTO by courier and pin-code zone; WhatsApp support response time sits with other support numbers; four to six weeks before Diwali, stock and courier capacity become standing agenda items.
- **US:** watch carrier delays and holiday shipping cutoffs; a late shipment needs the buyer told and offered a choice under the mail order rule [CXP-6160].

## Checks before you hand it over

- Every agent and person has a status note, or is listed as "no status".
- Every number has a source, date, four-week average and normal range.
- Reporting traps are noted next to the numbers they affect.
- Every blocker has who clears it and by when; old blockers lead the agenda.
- The approvals queue lists action, cost or risk and recommendation for each item.
- Clashes between agents are listed with one owner each.
- Next week has at most three store priorities and two per owner.
- No action is marked approved unless the owner said yes.

## Output

**One-page review:** numbers page, exceptions, blockers, approvals queue, clashes, decisions to make, next week's priorities.

**Status note template** (one per agent or person):

| Field | Entry |
|---|---|
| Agent or person, role | |
| Done this week (with proof) | |
| In progress (expected finish) | |
| Blocked (what, since, who clears) | |
| Waiting for approval (action, cost or risk) | |
| My numbers (in or out of range) | |
| Next week's two priorities | |

**Decision log:** Date | Decision | Decider | Why | Signal to watch | Review or undo date | Grade.

**Agenda, 45 minutes:** approvals (10), blockers older than a week (10), exceptions (10), clashes (5), next week's priorities (10).

## Common mistakes

- **A meeting that rereads dashboards.** Step 3 discusses only numbers outside their range.
- **Approvals lost in chat.** Step 5 puts them in one queue with a recommendation.
- **Agents working against each other.** Step 6 checks stock, offers and pages across plans.
- **New ideas jumping the queue.** Step 8 sends them to the backlog.
- **Too many priorities.** Step 8 caps them.
- **Missing notes filled by guesswork.** Step 1 lists them as "no status".

## Sources

- MEA-0051, MEA-0011: Google click-date credit and Shopify refund-date traps.
- MEA-0030: weekly contribution without fixed costs.
- OPS-0014: demand on in-stock days.
- FIN-6241: payouts are net of fees, refunds and disputes.
- MEA-0009: small compounding dips are usually noise.
- OPS-0018, CXP-0022: pre-approved standing budgets.
- OPS-0012: audit courier and 3PL invoices.
- CXP-6160: US late shipment duties.

What makes this skill ours: it runs on one fixed status note from every agent, so the owner sees work, blockers and approvals in one place; only numbers outside their normal range are discussed; it checks clashes between agents before they reach buyers; and priorities are capped and tied to the quarter's plan, with new ideas sent to the backlog.
