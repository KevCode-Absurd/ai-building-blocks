---
name: deal-deadline-tracker
description: Builds a deal tracker backwards from the closing or completion date using only the dates in the contract, memorandum of sale and addenda the client supplies, with a key dates table (date, duty as written, clause number, question for the lawyer), an owner, reminder date and status for every line, and red flags on the deadlines that can end the deal. Never computes a legal deadline the contract does not state without marking it to confirm. Works for US closings (contingencies, Loan Estimate and Closing Disclosure timing) and England, Wales and Scotland sales. Builds from pasted text at access level 1; drafts tasks in the transaction tool at level 2; keeps the live checklist and reminders up to date at level 3 within the client's limits. Use when an offer is accepted, an addendum changes a date, or an agent takes over a file.
---

# Deal deadline tracker

## When to use

- An offer has just been accepted, or a memorandum of sale issued.
- An amendment or extension changed a date.
- An agent with many deals wants every deadline in one place.
- A file is being handed to a new coordinator mid-deal.

Not for: deciding what a clause means, whether a deadline can be missed, or whether to extend. Those go to the broker, real estate attorney, conveyancer or solicitor.

## What you need

1. The contract or memorandum of sale and every addendum, as pasted text or a shared file, with the effective or acceptance date.
2. Where the property is: state and county, or UK nation. Check local rules: deadlines, forms and counting rules differ.
3. The parties by role, with how each prefers to be contacted.
4. How the buyer is paying (cash or mortgage) and the lender, if any.
5. The brokerage's own checklist, if it has one.
6. Access: level 1 to build the tracker in chat or a file; level 2 to create draft tasks and tentative calendar holds; level 3 to keep the live checklist, statuses and approved reminders running within the agreed limits.

## Steps

### 1. Pull every date and duty, as written

Read the contract clause by clause. For each date, period or duty, write a key dates line: the date or period exactly as written, the duty, who owes it, and the clause number. Do not paraphrase into legal meaning. Where the contract counts from another date ("within 10 days after the effective date"), copy the wording and leave the computed date for step 3.

### 2. Anchor on closing or completion

Put the closing or completion date at the bottom of the tracker and work upwards. For a US financed purchase, add the lender milestones the client gives you, and note that the buyer must receive the Closing Disclosure at least three business days before closing; a disclosure that is not handed over in person counts as received three business days after it is sent. If the APR becomes inaccurate, the loan product changes or a prepayment penalty is added, a new three-business-day wait applies and closing can move. For England and Wales, mark the status "agreed, not exchanged" until exchange, because the offer is not binding before then; completion often follows exchange by two to four weeks but the contract sets it.

### 3. Compute only with a label

If a date must be counted, show the count ("effective date 3 Nov + 10 days = 13 Nov, counted as calendar days") and mark it [CONFIRM WITH YOUR LAWYER OR CONVEYANCER]. Never decide how weekends, holidays or time of day apply.

### 4. Give every line an owner, a reminder and a status

| Due | Item | Clause | Owner | Reminder | Status | Notes |
|---|---|---|---|---|---|---|

Reminders go out early enough for the owner to act; ask the agent for their preferred lead time. Status values: not started, requested, received, done, at risk, extended in writing.

### 5. Flag the deal-enders

Mark in red the deadlines that can end or change the deal if missed: contingency deadlines, mortgage offer or loan approval, appraisal, title objections, deposit due dates, exchange and completion. Add who to alert if each slips.

### 6. Add the federal and local items the contract leans on

Examples to check, not to assume: the US lead disclosure and 10-day inspection opportunity for homes built before 1978; the written buyer agreement for buyer-side files since 17 August 2024; the state's seller disclosure forms [CHECK LOCAL RULES]; in Scotland, the Home Report and the missives; in England, searches, survey, mortgage offer and buildings insurance from exchange.

### 7. List the questions for the lawyer

Any wording that is unclear, any computed date, any conflict between two clauses, and anything the client asked you to interpret. One question per line, with the clause quoted.

### 8. Keep it current (level 3)

Within the agreed limits: update statuses as documents arrive, send approved reminders before each deadline, and log each action. A missed or at-risk deadline is never handled by a template: alert the agent the same day. Extensions are recorded only when signed.

## Checks

- Every date traces to a clause, an addendum or the client; nothing is invented.
- Every computed date shows its count and is marked to confirm.
- Every line has an owner, a reminder date and a status.
- Deal-ending deadlines are flagged, with who to alert.
- No line explains what a clause means.
- The property's state or UK nation is written at the top, with [CHECK LOCAL RULES] where rules were not confirmed.
- At level 3, every live update and reminder is logged and within the limits.

## Output format

1. **Header:** property, state or nation, parties, financing, closing or completion date, status.
2. **Tracker** built backwards from closing.
3. **Key dates table:** date or period as written, duty, clause, question for the lawyer.
4. **Red flag list** with who to alert.
5. **Questions for the lawyer or conveyancer.**
6. **Change log** (level 3).

## Example of good output (short)

*Made-up deal for illustration: 14 Maple Court, a financed purchase in a US state, closing 15 December 2026.*

> | Due | Item | Clause | Owner | Reminder | Status |
> |---|---|---|---|---|---|
> | 15 Dec | Closing | 4 | Closing agent | 8 Dec | Scheduled |
> | Lender to confirm | Buyer receives Closing Disclosure (at least 3 business days before closing) | TRID | Lender | 3 Dec | Asked lender how and when it will be sent |
> | 1 Dec | **Financing contingency ends** | 8(b) | Buyer and lender | 24 Nov | Requested |
> | 17 Nov [CONFIRM WITH YOUR LAWYER] | **Inspection period ends** ("10 days after the effective date", 7 Nov + 10, calendar days) | 9(a) | Buyer's agent | 13 Nov | Inspection booked 11 Nov |
>
> Question for the attorney: clause 9(a) says "10 days"; does the state count calendar or business days, and what if day 10 falls on a weekend?
