---
name: recall-process
description: Designs and sets up a practice's recall and reactivation process (who is due, from intervals the clinicians set; who contacts them, by which channel and when; what happens after no reply; how it is recorded and measured) and builds it in the practice system's recall list or automated workflow. Use it for dental check-ups and hygiene, physio and chiro reviews, optometry eye tests, vet vaccinations and therapy follow-ups when recalls depend on memory, lapse after busy spells, or the system's recall tools are unused. Never sets the interval itself.
---

# Recall process

## When to use

- Recalls are done "when someone remembers".
- The diary empties a few months after a busy period.
- The practice system has recall or return-visit tools that nobody set up.
- Patients complain they were never reminded, or were reminded too often.
- A practice is moving systems and needs recalls carried over.

## Access needed

- **Level 1 (read):** recall and return-visit reports, patients-without-a-booking reports, current templates.
- **Level 2 (read and draft):** create recall types, templates and workflows saved inactive; draft the call list procedure.
- **Level 3 (read, write and publish):** switch on the approved workflow, mark recalls as contacted, book recall appointments when patients reply, and move patients through the no-reply steps, within the agreed recall types and channels.

## What you need

1. The recall types the clinicians use and the interval for each, as they set it per patient or by default. If an interval is missing, it is "for the clinicians to set".
2. The practice system and plan (some recall automation is plan-dependent).
3. A de-identified report of patients due and overdue now, by recall type.
4. Channels the practice uses (SMS, email, letter, phone) and patients' recorded preferences and consents.
5. Who on the team makes recall calls and when.
6. Where the practice and patients are, for messaging rules.

## Steps

### 1. Confirm the intervals sit with the clinicians

List each recall type with its interval and who set it. In the systems checked for this kit, the interval sits in the patient record or the recall type: Dentally sets separate dentist and hygienist intervals in the Clinical section; Open Dental fills a default from the recall type that can be changed per patient. Do not change intervals. If the desk has been setting them, flag it to the owner.

### 2. Make "next step before they leave" the first recall step

The cheapest recall is the one booked at check-out. Add to the check-out procedure: book the next visit, or set the recall or return-visit reminder, before payment. In Jane, a return visit reminder only sends if no visit is booked; in Cliniko, staff apply a recall from a recall type with its duration.

### 3. Design the contact sequence

For each recall type, write the stages: when the first message goes (relative to the due date), the channel, the follow-up if no booking, the final attempt, and when the patient leaves the active list. Use the patient's preferred channel where recorded, and a fallback if it fails. Dentally's workflows have a first and a fallback template per stage; Cliniko's recall report is worked by hand with a "Recalled" tick; Open Dental tracks status on its Recall List.

Keep the number of attempts small and the gap between them reasonable. Stop when the patient books, opts out or asks not to be contacted.

### 4. Write the messages

Short, with the practice name, what is due in general words ("your check-up", "Bella's vaccination"), and one action. No clinical details beyond what the clinician approved. Opt-out wording where the channel needs it. Keep offers out of recall messages; a promotion can turn a service message into marketing. Detailed reminder and texting rules are in the front desk coordinator kit. Check this with local rules.

### 5. Build it in the system

At level 2, build recall types (Cliniko: only Administrators and Power receptionists can), templates and the workflow, saved inactive (new Dentally workflows start inactive). Test with made-up patients: create a record, set a recall, check what would send and when. Fix and retest.

### 6. Set the call list

For patients with no mobile or email, or after messages fail, a weekly call list: who calls, which day, what to say, and how the result is recorded in the system.

### 7. Switch on and measure

With the owner's yes, switch on (level 3). Each month measure, by recall type: patients due, contacted, booked within the window, still overdue, and opted out. Show the arithmetic. Change one thing at a time.

## Checks

- Every interval was set by a clinician; none was invented.
- "Book or set recall before payment" is in the check-out procedure.
- Each recall type has stages, channels, a fallback and a stop rule.
- Messages carry no clinical detail beyond approved wording, and no offers.
- The workflow was tested on made-up records before switching on.
- The plan carries the line: *Intervals are for the clinicians to set; check this with local rules for messaging.*

## Output format

1. Recall types table (type, interval, set by)
2. Check-out step
3. Contact sequence per type (stage, timing, channel, fallback, stop)
4. Message set
5. System build notes and test results
6. Weekly call list procedure
7. Monthly recall measures with definitions

## Example of good output (short)

> **Made-up example: Brookside Dental, three dentists, one hygienist, Dentally (not a real practice).**
>
> | Recall type | Interval | Set by |
> |---|---|---|
> | Dentist exam | Per patient, in record | Each dentist |
> | Hygiene | Per patient, in record | Hygienist |
>
> **Sequence (dentist exam):** stage 1 SMS on the due date, fallback email; stage 2 email 3 weeks later, fallback letter; stage 3 call list 6 weeks after the due date; then off the active list until the next annual review.
>
> **Stage 1 text:** "Brookside Dental: your check-up is due. Book online at [link] or reply CALL and we'll ring you. Reply STOP to opt out."
>
> **Measure:** 120 due in March; 84 booked within 8 weeks (84 / 120 = 70%); 9 opted out; 27 still overdue.
