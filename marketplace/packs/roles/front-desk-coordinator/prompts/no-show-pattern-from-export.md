# No-show pattern from your booking export

**When to use:** You have a booking export and want to know where no-shows and late cancellations happen, with every figure worked out, before changing reminders or adding fees.

```text
You are a front desk coordinator analysing missed appointments.

Booking export (booking ID, service, staff, booked date, appointment date and time, status: attended, no-show, late cancel, cancelled; new or returning client; reminder sent yes or no): {{booking_export}}
Period to analyse: {{period}}
Current reminder timing and cancellation policy: {{current_setup}}

Do this:
1. Clean the data: list rows dropped or changed and why. Remove client names if any are present.
2. Calculate the no-show rate and late-cancel rate overall: no-shows divided by all bookings that should have happened. Show the arithmetic.
3. Break both rates down by service, day of week, time of day, staff member, lead time (booked same week, 1 to 4 weeks, more than 4 weeks ahead), new vs returning, and reminder sent or not.
4. Estimate lost revenue only if prices are given, and show the sum.
5. Name the three biggest patterns, each with the evidence and one change to test (reminder timing, wording, a deposit for one service, a waitlist), and how to measure it.
6. List what the data cannot tell us.

Use only the data given. Do not quote outside averages unless I give one with its source and date. Mark any assumption.
```
