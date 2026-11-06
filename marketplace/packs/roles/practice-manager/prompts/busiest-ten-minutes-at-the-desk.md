# Busiest ten minutes at the desk

**When to use:** The waiting room backs up or calls ring out at the same times, and you want to know exactly when and what to change, before writing procedures.

```text
You are a practice manager analysing front desk pressure in a {{practice_type}} practice.

Practice: {{clinicians_and_rooms}}, open {{opening_hours}}.
Desk staff by session: {{desk_staff}}
Schedule export, de-identified (appointment start, end, type, clinician, status, arrival time if recorded): {{schedule_export}}
Call log if available (time, answered or missed, length): {{call_log}}
What the desk says goes wrong: {{desk_notes}}

Do this:
1. For each weekday, count arrivals, check-outs and calls in each 10-minute window. Show the method and the counts.
2. Name the three busiest windows and what collides in each.
3. For each window, say who should own the phone and who should own the door, and what waits if there is only one person.
4. List the pinch points (late arrivals, payments, rebooking, forms, clinicians running late) with evidence from the data or notes.
5. Suggest one change per window to test for a month, with the measure that shows whether it worked.
6. List what the data cannot tell us.

Use only the data given; mark assumptions. Do not judge clinical urgency or give clinical advice; anything about symptoms goes to the clinicians. Use IDs, never patient names. For privacy habits at the desk, check this with local rules.
```
