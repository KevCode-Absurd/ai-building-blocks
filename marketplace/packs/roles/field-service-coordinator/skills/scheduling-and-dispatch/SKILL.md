---
name: scheduling-and-dispatch
description: Plans and runs the daily schedule for a field service team - booking jobs into arrival windows the team can keep, matching each job to a technician with the right skills, parts and area, ordering visits to cut driving, writing the day sheet, and handling the day's changes (sick calls, overruns, emergencies) with a message to every affected customer. Use it for booking rules, tomorrow's plan, the morning dispatch check and same-day rescheduling. Books and moves visits and sends booking messages only with level 3 access and within the client's rules.
---

# Scheduling and dispatch

## When to use

- Setting up booking rules: arrival windows, job lengths, zones, who does what.
- Building tomorrow's schedule and day sheets.
- The morning check before vans leave.
- Same-day changes: a sick technician, a job running over, an emergency call, a no-access visit.
- A weekly look at missed windows, reschedules and empty hours.

Do not use it to decide whether a job is an emergency on safety grounds (the technician or owner decides) or to set overtime pay.

## Access needed

- **Level 1 (read):** the schedule, job list, technician skills and areas, the parts list and last week's reports.
- **Level 2 (read and draft):** tentative or unscheduled visits, a draft schedule in a copy or a planning view, draft messages.
- **Level 3 (read, write and publish):** book, move and assign visits, set arrival windows, run the tool's route optimisation, and send confirmations, reminders, "on my way" and running-late messages from approved templates, within the hours, crews and limits the client set. Cancelling with a charge, or booking overtime the client has not approved, needs a fresh yes.

## What you need

1. The team: names or IDs, skills and certificates relevant to job types (from the owner, not guessed), home base or start point, working hours, days off.
2. Job types and how long each usually takes, from the client's records.
3. The arrival windows the business promises and the hours it books.
4. Zones or areas each technician covers.
5. The job list: address or area, job type, window, access notes, parts needed, customer contact preference.
6. The rules for emergencies and priority customers (for example maintenance plan members), from the owner.

## Steps

### 1. Set the booking rules once
Write the rules the office books by: windows offered, job lengths by type, a buffer for travel, which skills each job type needs, and the last start time. Windows tell the customer what to expect and give the business a yardstick for on-time arrival (ServiceTitan, for example, tracks arrival against the promised window). Keep windows the team can actually hit.

### 2. Check capacity before promising
Compare booked hours with available technician hours by day and area. Offer only slots a technician with the right skills in that area can take; FSM tools with capacity planning show only those slots. If a day is full, offer the next real slot rather than squeezing one in.

### 3. Match jobs to technicians
For each job: required skill, parts on the van, area, and any customer history (who went last time, any notes). Put plan members and repeat customers with the technician they know where the rules allow. Flag jobs with no matching technician.

### 4. Order the day
Fixed-time and narrow-window jobs first, then fill around them by area to cut back-tracking. Use the tool's route optimisation where it fits: Jobber's, for example, reorders only "anytime" visits, by driving distance, for up to 7 days at a time. Check the result against windows and lunch breaks before saving.

### 5. Write the day sheet
One per technician: visits in order, window, address and access notes (codes stay in the job's private notes), job type, parts, customer contact preference, what the customer was told, and the checklist to complete. Add the office number for problems.

### 6. Send the night-before and morning messages
Confirm tomorrow's bookings with the window. Check that reminders are right for any visit moved today, since tools cancel old reminders and queue new ones on reschedule.

### 7. Run the day
Each morning, check every van has its first job, parts and access. Through the day, watch for: jobs running over, cancelled or no-access visits, and new urgent calls. Automated dispatch tools help, but the dispatcher keeps the final decision; ServiceTitan's Dispatch Pro, for example, lists jobs it cannot place with a reason and only reschedules within the arrival window.

### 8. Handle changes in this order
1. Protect the customers whose windows are at risk: tell them before the window ends, with a new time and the reason.
2. Move flexible work (anytime visits, plan visits) before moving fixed bookings.
3. Offer the customer a choice of new slot when a visit must move to another day.
4. Log every change with the reason.

### 9. Weekly review
From the tool's reports: arrivals outside the window, visits moved by the business, no-access visits, empty hours by technician, and jobs that needed a second visit. Name one change to the booking rules for next week.

## Checks

- Every visit has a window the customer was told, an address, access notes and the skill and parts it needs.
- No technician is booked past their hours without the owner's yes.
- Every moved visit has a fresh reminder and a message to the customer.
- Customers at risk of a missed window were told before it ended.
- Safety-related urgency was decided by a technician or the owner, not the office.
- Every live change was within the access level and limits, and is in the log.

## Output format

1. Booking rules (one page): windows, job lengths, skills by job type, zones, last start time, emergency rule.
2. Tomorrow's schedule: one table per technician (order, window, job, area, parts, notes).
3. Messages sent or to send, by customer.
4. Change log for the day: time, change, reason, who was told.
5. Weekly numbers: missed windows, business-moved visits, no-access visits, empty hours, return visits.

## Example of good output (short)

*Illustrative structure, not a real business: a heating firm with three engineers. Copy the shape, never the content: every fact comes from the client's own context.*

> **Tuesday: Ola (gas, boilers)**
> | # | Window | Job | Area | Parts | Notes |
> |---|---|---|---|---|---|
> | 1 | 8-10 | Annual boiler service (plan member) | North | Service kit | Side gate; dog in kitchen |
> | 2 | 10-12 | No hot water | North | Diverter valve (likely, per call notes) | Customer works from home |
> | 3 | 1-3 | Boiler service | Centre | Service kit | Parking permit in van |
>
> **10.40 change:** Job 2 needs a part not on the van. Ola collects it at lunch. Job 3 customer texted: "Running about 45 minutes behind because a part was needed on an earlier job. New window 1.45-3.45. Reply 2 if you'd rather move to Thursday morning."
>
> **Log:** 10.42 moved job 3 window, customer texted with approved running-late template; 10.44 job 2 marked "part collected".
