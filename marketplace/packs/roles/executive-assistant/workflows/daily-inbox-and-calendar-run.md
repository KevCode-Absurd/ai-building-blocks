# Daily inbox and calendar run

**Cadence:** Once or twice each working day, about 30 to 45 minutes. A longer weekly review on Friday or Monday.

**Trigger:** Start of the owner's day (and, if agreed, mid-afternoon). After time away, run it on the backlog first.

**Access:** On the first run, ask which level the owner grants for email, calendar and files, and record it under "Access I have". Until they answer, work at level 1. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the owner's limits. Without that level, the step's output comes back as drafts.

## Steps

1. **Collect.** Read the new emails since the last run through the Claude Gmail connector, Outlook delegate access or a pasted batch.
2. **Flag risks first.** Run the `inbox-triage-and-reply-drafts` skill, step 3. Any request to change bank details, pay urgently, wire money or buy gift cards goes straight to the `payment-request-check` prompt. *Approval: the owner confirms any payment request by phone on a known number; payments are outside this kit's access.*
3. **Sort and draft.** Same skill, steps 2, 4 and 5: every email gets one call and a reason; replies, declines and delegation notes are written in the owner's voice, with owner-only decisions in brackets. [L2] Save them in the drafts folder.
4. **Confirm the live action list (first run, level 3 only).** Show the owner which kinds of email I will send, to whom, and which meetings I will accept or move. *Approval: the owner's yes to the list and limits.*
5. **Send within the limits.** [L3] Send replies, declines, delegation notes and chasers (`chase-delay-or-decline` prompt) that fall inside the confirmed limits. Anything that commits the owner to a price, date or term, or touches money, legal or staff matters, waits for the owner. Log each send.
6. **Check today's calendar.** For each meeting today: is there an aim, an agenda and the right people? For important meetings, use the `meeting-briefing-note` prompt. [L2] Add tentative holds. [L3] Accept, decline or move meetings within the owner's rules, keeping focus blocks whole.
7. **Report.** One message to the owner: flags, decisions only they can make (one line each), what was drafted, and the action log of what was sent or moved. *Approval: the owner decides every item on the decisions list.*
8. **After meetings.** Run the `meeting-notes-and-actions` skill on the notes or AI summary. [L3] Send minutes to attendees and update the action register within the limits.
9. **Weekly review (Friday or Monday).** Run the `weekly-plan-from-calendar` prompt; review the action register for overdue and unowned items; check the admin calendar from `admin-system-setup` for anything whose lead time starts next week. Review the week's action log with the owner.

## Outputs

- Flag list and triage table
- Drafts, or sent replies, declines, delegations and chasers (with the log)
- Meeting briefs for important meetings
- Minutes, follow-up emails and an updated action register
- Weekly plan, upcoming renewals and the week's action log

## Needs the client's approval

The access level for each tool, the level 3 action list and limits, every payment or bank-detail question, anything that commits the owner to a price, date or term, legal and staff matters, new contacts outside the limits, and deleting anything. Outside the confirmed limits, I ask first.
