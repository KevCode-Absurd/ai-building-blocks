# Enquiry to confirmed booking

**Trigger:** Enquiries wait too long, replies vary by who sends them, holds lapse, or quotes go out with errors. Set-up runs once; the daily run happens every working day.

**Cadence:** Daily during business hours for new enquiries, holds and quotes; weekly review of reply times and bookings.

**Access:** At the start, ask which level the client grants for the inbox, calendar, CRM and any client platform (HoneyBook, Tripleseat) or accounting tool, and record it under "Access I have". Until they answer, work at level 1. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits. Steps marked [YES] need a fresh yes every time, even at level 3.

## Steps

### Set-up

1. **Read how they sell now.** At level 1, read the last few months of enquiries, replies, quotes and bookings. List enquiry types, reply times and where deals stall.
2. **Write the replies.** Run the `enquiry-reply-and-follow-up` skill (or the `first-reply-by-enquiry-type` prompt) for every enquiry type, plus hold messages and the follow-up series. *Approval: the client approves every template and the hold rules.*
3. **Write the quote layout.** Run the `quote-and-proposal-builder` skill once on a recent real enquiry to agree the layout, fees and wording. *Approval: the client approves the layout and confirms which quotes are binding.*
4. **Build it in the tools.** [L2] Save templates, set up the hold calendar, required CRM fields for each stage, and the quote template. *Approval: the client checks the set-up.*
5. **Confirm the live action list.** [L3] Show the actions and limits: which inbox, which templates, which slots, hold length, which rate card, which quotes may go without a fresh yes, for how long. *Approval: the client's yes.*

### Daily run

6. **Reply.** [L3] Send the first reply to each new enquiry from the approved templates after checking the date or stock. At level 2, drafts wait for the client.
7. **Book the next step.** [L3] Book tours, calls or viewings into the named calendar and send confirmations.
8. **Manage holds.** [L3] Place holds with an end date, send the reminder before it ends, and release or convert by the agreed rule. Extensions beyond the rule need the client's OK.
9. **Quote.** Build quotes with `quote-and-proposal-builder` and check them with the `quote-total-price-check` prompt. [L3] Send non-binding estimates within limits. [YES] Binding quotes, contracts and anything off the rate card wait for a fresh yes.
10. **Follow up.** [L3] Run the follow-up series; stop at once on a reply or a no.
11. **Escalate.** Hand to a person the same day: complaints, legal or data requests, payment problems, double bookings, price disputes, anything outside the templates.
12. **Log.** Log every reply, hold, quote and booking in the CRM with the next step and date.

### Weekly review

13. **Report.** Reply time by channel, enquiries by type, holds converted or released, quotes sent and accepted, lost reasons. Suggest one change. *Approval: changes outside the confirmed limits need a fresh yes.*

## Outputs

- First replies by enquiry type, hold messages and follow-up series
- Quote and proposal layout, and each quote sent or drafted
- Booked tours, calls and viewings
- Weekly report with one suggested change
- Action log of every message, hold, quote and CRM change

## Needs the client's approval

Every template, the hold rules, the quote layout, the level 3 action list and limits, every binding quote or contract (fresh yes each time), any price or discount not on the rate card, and anything outside the limits.
