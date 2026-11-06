# Inbound lead response, set up once and run daily

**Trigger:** Enquiries wait hours or days for a reply, leads go cold, or the client adds a new enquiry source (a new form, a phone line, chat). Set-up runs once; the daily run happens every working day.

**Cadence:** Daily check of new enquiries during business hours; weekly review of reply times and outcomes; monthly rescore of the qualifying questions.

**Access:** At the start, ask which level the client grants for the forms or inbox, the CRM, the calendar and any chat tool, and record it under "Access I have". Until they answer, work at level 1. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits.

## Steps

### Set-up

1. **Map the sources.** List every way enquiries arrive, how many a month, who sees them and how fast they are answered now. Read the last few months at level 1 or from an export.
2. **Write the replies and rules.** Run the `inbound-first-replies` prompt: first replies by source, out-of-hours reply, qualifying questions and score, routing rules, a two-week follow-up. *Approval: client approves every message, the score and the routing rules.*
3. **Write the call-back script.** Run `call-script-and-booking`, step 7, for enquiries that need a call. *Approval: client approves the script.*
4. **Build it in the tools.** [L2] Save replies as templates, the follow-up as a paused sequence, the routing as draft rules or tasks, and the booking event type. *Approval: client checks the set-up.*
5. **Confirm the live action list.** [L3] Show the actions and limits: which sources, which templates, which calendar, which hours, what happens to poor fits, for how long. *Approval: the client's yes.*

### Daily run

6. **Reply.** [L3] Send the first reply for each new enquiry from the approved templates, with the booking link or call-back time, and log it. At lower levels, drafts wait in the inbox for the client to send.
7. **Score and route.** Score each enquiry on the agreed questions. [L3] Assign owners and tasks by the routing rules. Poor fits get the agreed polite reply, never silence.
8. **Book.** [L3] Book meetings into the named calendar, send confirmations and reminders.
9. **Follow up.** [L3] Run the two-week follow-up for anyone who goes quiet; stop at once for anyone who replies or says no, and record opt-outs in every tool.
10. **Escalate.** Hand to a person at once: complaints, legal or data requests, safety issues, press, large or unusual deals, anything outside the templates.

### Weekly review

11. **Report.** Time to first reply by source and hour, share booked, show rate, and the closer's view of meeting quality. Suggest one change. *Approval: changes outside the confirmed limits need a fresh yes.*

## Outputs

- First replies by source, out-of-hours reply, qualifying score, routing rules
- Call-back script and booking messages
- Weekly speed-to-lead report with one change
- Action log of every reply sent, booking made and record changed

## Needs the client's approval

Every message template, the qualifying score, the routing rules, the level 3 action list and limits, and anything outside them: new sources, new templates, a different calendar, replies about price exceptions, complaints or legal matters.
