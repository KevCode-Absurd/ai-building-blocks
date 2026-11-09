---
name: repairs-and-compliance-log
description: Runs the maintenance side of a rental portfolio - takes repair reports, sorts them by urgency using the landlord's rules, writes work orders, arranges access, keeps tenants updated and keeps a dated log from report to sign-off - plus a compliance calendar of safety checks and certificates (gas, electrical, alarms, EPC, licences) with due dates. Use it when repairs get lost in messages, certificates lapse, or a landlord needs a maintenance handover or evidence for a dispute. With level 3 access it logs repairs, books approved contractors within the cost cap and sends repair updates; new contractors, jobs over the cap and anything unsafe need a fresh yes. Check local rules for safety duties.
---

# Repairs and compliance log

## When to use

- Repair requests arrive by text, email, phone and the tenant portal, and nobody has one list.
- A tenant says "I reported this months ago" and there is no record.
- Gas, electrical or other certificates have lapsed, or nobody knows when they are due.
- The landlord is handing the portfolio to someone else, or going away.
- A deposit or repair dispute needs a dated record of what was reported and done.

## Access needed

- **Level 1 (read):** maintenance requests, work orders, documents and certificates in the property software; the shared inbox.
- **Level 2 (read and draft):** draft work orders, tenant updates and the log; a draft compliance calendar.
- **Level 3 (read, write and publish):** log and update requests, send work orders to contractors on the approved list within the cost cap, confirm appointments the tenant agreed, send repair updates from approved templates, and keep the compliance calendar. A new contractor, a job over the cap, a notice of entry the tenant has not agreed, or anything unsafe needs a fresh yes.

## What you need

1. The property list with addresses, ages, heating type (gas, electric, oil, solid fuel) and any licences.
2. The landlord's repair rules: what counts as emergency, urgent and routine, response promises, the cost cap per job, and the approved contractors by trade.
3. Open repair requests and the message history.
4. Current certificates with dates: gas safety record, electrical inspection report, EPC, alarm tests, any licence.
5. Where the home is (country, UK nation, state, city), because safety duties differ. Check local rules.

## Steps

### 1. Pull every report into one log
One row per issue: date and time reported, property and unit, who reported it, how, the tenant's words, photos, and what has been done so far. Never merge two issues into one row.

### 2. Sort by urgency using the landlord's rules
Use the landlord's written categories. Where the landlord has none, propose words, not hours: **emergency** (danger to people or the building now, such as a gas smell, no heat or water in cold weather, a major leak, an electrical hazard, a door that will not lock), **urgent** (affects daily living or will get worse quickly), **routine** (everything else). For a gas smell or anything unsafe, the first message tells the tenant to call the emergency number and leave if told to; then tell the landlord.

### 3. Treat hazards before looks
Damp and mould, gas, electrics, fire safety, falls and structure go first, because councils judge homes by hazards. In England a tenant can ask the council to inspect under the Housing Health and Safety Rating System. Awaab's Law timescales for private renting are only proposed (consultation closes 18 December 2026), so do not quote deadlines for them as law; treat damp and mould as urgent anyway.

### 4. Write the work order
Property and unit, issue in the tenant's words plus your summary, photos, category, access arrangements (keys held, tenant times, pets), the cost cap, what "done" looks like, and photos required before and after. Send to the approved contractor for that trade. Over the cap or not on the list: draft it and ask the landlord.

### 5. Arrange access and keep the tenant told
Offer the tenant a choice of slots. Give written notice of entry with the reason and at least the legal minimum (24 hours in England, except emergencies); a notice the tenant has not already agreed to is a formal notice and needs the landlord's yes. Send updates at each change: booked, delayed, parts ordered, done.

### 6. Close with evidence
Before closing: contractor's note, invoice, before and after photos, the tenant's confirmation, and any certificate issued. Record the cost and the date closed. If the same issue returns, link the rows.

### 7. Keep the compliance calendar
One line per property per duty, with last done, next due and who books it. For England: gas safety check every year with a copy to the tenant within 28 days; electrics checked at least every five years with proof to tenants; smoke alarm on each storey and a carbon monoxide alarm in any room with a solid fuel appliance, fitted and tested; an EPC. In Scotland, Wales, Northern Ireland and the US, use the client's local list and mark it [CHECK LOCAL RULES]. Set reminders well ahead of each due date so bookings fit around tenants.

### 8. Report
Weekly: open jobs by age and category, jobs over promise, costs this month, certificates due in the next quarter, and decisions needed from the landlord.

## Checks

- Every report is in the log with a date and time, even small ones.
- Emergencies were escalated to the landlord at once, and the tenant was told what to do first.
- No contractor outside the approved list and no job over the cap was booked without a fresh yes.
- Every entry notice gave a reason, a time and the legal minimum notice.
- Every closed job has evidence and a cost.
- Every certificate has a next due date; none is overdue without a note to the landlord.
- Every live action is logged.

## Output format

1. Maintenance log (table): ID, date reported, unit, issue, category, contractor, access, status, next action, cost, date closed, evidence.
2. Work orders ready to send.
3. Tenant update messages.
4. Compliance calendar (table): property, duty, last done, next due, who books, source.
5. Weekly summary and decisions needed.

## Example of good output (short)

*Illustrative structure, not a real business: a landlord with five houses in Bristol, England. Copy the shape, never the content: every fact comes from the client's own context.*

| ID | Reported | Unit | Issue | Category | Contractor | Status | Next action |
|---|---|---|---|---|---|---|---|
| R-041 | 3 Nov, 19:10 | 22 Ash St | Black mould on bedroom wall, child's room | Urgent (hazard) | Damp contractor (approved) | Survey booked 5 Nov, 10-12 | Survey report, then landlord decides on works |
| R-042 | 4 Nov, 08:30 | 9 Fern Rd | Kitchen tap dripping | Routine | Plumber (approved) | Booked 11 Nov, 1-4 pm | Confirm with tenant 10 Nov |
| R-043 | 5 Nov, 21:45 | 9 Fern Rd | Smell of gas in hall | Emergency | Gas emergency line called by tenant; approved gas engineer for follow-up | Supply made safe 22:30 | Landlord told 21:50; engineer visit 6 Nov |

| Property | Duty | Last done | Next due | Source |
|---|---|---|---|---|
| 22 Ash St | Gas safety check | 14 Jan 2026 | by 14 Jan 2027 | GOV.UK safety responsibilities |
| 22 Ash St | Electrical inspection | 2 Mar 2022 | by 2 Mar 2027 | GOV.UK electrical safety standards |

**Decisions for you this week:** R-041 works quote when the survey arrives; book the 22 Ash St electrical check in January so it is done before March.
