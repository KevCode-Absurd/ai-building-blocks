# Daily schedule and dispatch

**Cadence:** Every working day: the evening before (plan and confirm), first thing (dispatch check), and through the day (changes).

**Trigger:** The client hands over the schedule, or customers keep chasing the office about arrival times.

**Access:** Level 1 (read) on the job tool is enough to plan and write day sheets. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "book and move visits for the two crews, Monday to Friday; send the approved reminder, on my way and running-late texts between 8 am and 7 pm; no cancellations with a charge").

## Steps

1. **First week only: set the rules.** Run the `scheduling-and-dispatch` skill, step 1: windows, job lengths, skills by job type, zones, last start time, emergency rule. Run the `customer-messages` skill for the confirmation, reminder, on my way and running-late templates. *Approval: the owner agrees the rules and every template before any are switched on.*
2. **Evening: build tomorrow.** Check capacity, match jobs to technicians and order each day (`scheduling-and-dispatch`, steps 2 to 4). [L2] Save as tentative visits. [L3] Book and assign the visits and run the tool's route optimisation on anytime visits.
3. **Evening: day sheets and confirmations.** Write each technician's day sheet (step 5). [L3] Send confirmations and check reminders for every visit moved today.
4. **Morning: dispatch check.** Confirm every van has its first job, parts and access notes. List anything missing for the owner or technician.
5. **Through the day: handle changes.** Follow the change order in `scheduling-and-dispatch`, step 8. [L3] Move flexible visits, update windows and send running-late or reschedule messages from approved templates. Anything outside the limits (overtime, a cancellation with a charge, a new kind of message) waits for a fresh yes.
6. **End of day: close out.** Check every finished job has its checklist, photos and sign-off (`job-sheets-and-handover`). List jobs closed with gaps. [L3] Send job-done messages and the review request to every completed job, as the client's rules allow.
7. **Log and report.** List every live action taken today (what, where, when, result) and every customer told about a change.
8. **Friday: weekly numbers.** Missed windows, business-moved visits, no-access visits, empty hours, return visits, and one booking rule to change next week.

## Outputs

- Booking rules and message templates (first week)
- Tomorrow's schedule and a day sheet per technician
- Change log with customers told
- List of jobs closed without full checklists
- Daily action log (level 3)
- Weekly numbers with one proposed rule change

## Needs the client's approval

The booking rules and every message template before first use; any overtime or weekend booking not already allowed; cancelling a visit with a charge; messaging a customer group not already agreed; and any change to promised windows. Safety-related urgency is decided by a technician or the owner. Sending quotes and replying to formal complaints always need a fresh yes.
