---
name: cold-email-sequence
description: "Writes a short cold email sequence for one buyer type (first email of four sentences or fewer, follow-ups that each add something new, one final subject line per email and send gaps), personal first lines for up to 25 leads from the notes given, and a matching LinkedIn note set, then checks every message against honesty, opt-out and sender basics for the US, UK and EU. Use it for outbound to a defined segment, or when an old sequence gets no replies. Never invents facts about a lead. Loads and sends sequences only with level 3 access, within the client's limits. Not legal advice: check the rules where your prospects are."
---

# Cold email sequence

## When to use

- A segment from the scored list (see `icp-and-lead-scoring`) needs its first outreach.
- An old sequence gets opens but no replies, or replies that say "not relevant".
- A rep has a list of people met at an event and one note on each.
- The client wants LinkedIn messages to match the email sequence.

Do not use it for bulk blasts to bought lists with no history, or to people who have opted out.

## Access needed

- **Level 1 (read):** past sequences and their reply, bounce and unsubscribe numbers; won deals' first emails.
- **Level 2 (read and draft):** build the sequence and templates in the engagement tool, paused; save first emails as drafts.
- **Level 3 (read, write and publish):** enrol the approved contacts, start the sequence, handle replies with approved scripts and stop anyone who opts out, within the limits confirmed (mailbox and domain, segment, templates, new contacts a day, countries, dates). Log every action. LinkedIn messages are always sent by the client from their own seat; LinkedIn's terms ban automated messaging.

Without access, the sequence comes back as text with a sending plan.

## What you need

1. The offer in two sentences, and the one result you can prove (a named case the client may share, or a number with its source).
2. The buyer type: role, company type, the problem they feel today, in their words if possible.
3. Notes per lead (for first lines): only facts the client gathered or public work facts, each with a date.
4. Countries of the prospects, and whether any are sole traders or partnerships.
5. Sender details: name, role, company, postal address, the mailbox and domain.
6. Two past emails the client liked, for tone.

## Steps

### 1. Name the problem and the proof

One problem the buyer feels now, one result you can show. If there is no proof, say so and use a smaller claim you can back up, such as how you work.

### 2. Find the reason to write now

Use a dated fact from the notes: a new site, a job post, a change of rules in their sector. If there is none, do not invent one. Use a plain problem-first opener instead.

If the client's own results show that leads with a trigger reply far better than leads without one, send to the triggered leads first. Put the rest on a watch list and write to them when a trigger appears, rather than loading everyone with a weaker opener.

Time the sequence from the trigger, not from the calendar. Email 1 goes soon after the trigger fires (within the window the client's data ties to replies, if it gives one); each follow-up counts working days from email 1. Never hold a triggered lead for a set week of the month or a fixed send day.

### 3. Write email 1

Four sentences or fewer:
1. Who I am, in a few words, and why them (the true reason).
2. The problem as they would say it.
3. One proof point.
4. One light ask, the lightest the client's data supports: a yes or no question ("Is this on your list this quarter?"), an offer to send one useful thing, or "Who looks after this at [company]?"

No call or meeting request in email 1 unless the client's results show call asks convert better than lighter ones. If the data shows a link or a calendar invite cut replies, leave it out. One ask per email, never two in one line.

Plain text, no images, at most one link. Sign with a real name and role.

### 4. Write follow-ups

Three or four more, each shorter than the last and each adding something new: a short case, a number with its source, a different angle, a useful resource. Each has one light ask. Never "just checking in". The last one closes the loop: "I'll stop here. If this becomes a priority, reply any time." Suggest send gaps in working days that widen over the sequence.

Write every email in full, ready to send: subject, body and sign-off. Never a one-line note on what a follow-up will say.

### 5. Subject lines

One final subject line per email, short and honest, matching the content, and within any character limit in the brief. If the brief asks for options, label them as options below the email, never inside the subject field, each within the same limit. Never fake "Re:" or "Fwd:", never a fake invoice or meeting. US law requires subject lines that do not mislead.

### 6. First lines for named leads

For each lead, one opening line from their notes. If a note is too thin, write "not enough to personalise" and fall back to the segment opener. Show which fact each line used.

### 7. LinkedIn set

A connection note and up to three follow-ups, short enough for LinkedIn's limits, matching the email story. The client sends them by hand from their own seat.

### 8. Run the compliance and sender check

For every message and the plan:
- **Honesty:** every claim is in the brief; no fake familiarity or urgency.
- **US (CAN-SPAM):** accurate From and headers, honest subject, a clear notice that it is an ad, a physical postal address, a working opt-out honoured within 10 business days.
- **UK (PECR):** companies and LLPs may be emailed without prior consent, but sole traders and some partnerships need consent or the soft opt-in; always identify the sender and give a way to opt out.
- **EU:** email rules for companies differ by country; a named person's work email is personal data, so tell them where you got it and honour objections.
- **Senders:** SPF, DKIM and DMARC set up on the sending domain; one-click unsubscribe where the volume needs it; spam rate watched.
Point to the official pages in `knowledge.md`. Where the law needs a sign-off (for example, permission to name a customer), put it in one line next to the message it affects. Do not rule on whether the campaign is lawful.

### 9. Plan the test

Test one thing per round: the opener or the subject line, not both. A subject-line test is a later round with a new line; it does not put alternates into the sequence. Name the measure (positive replies per hundred contacted), the minimum batch before judging, and when to stop.

### 10. Run it (level 3)

Show the action list and limits, get a yes, then enrol only the approved contacts. Check daily: bounces, complaints, replies, opt-outs. Pause at once if complaints or bounces jump, or if a reply raises a legal point.

## Checks

- Email 1 is four sentences or fewer with one light ask; no call request unless the data shows call asks convert.
- Timing runs from the trigger, not a calendar window.
- Every email is written in full. Each follow-up adds something new; the last one closes the loop.
- Every first line uses a real fact or says it could not.
- Subject lines match the content.
- Opt-out, sender identity and postal address present.
- Country rules flagged; sole traders removed or marked.
- Nothing went live without level 3 and a yes to the action list; every send is logged.

## Output format

1. Problem, proof and reason-to-write summary
2. Sequence table: step, gap in working days, subject line, body, goal
3. First lines table: lead ID, line, fact used
4. LinkedIn note and follow-ups
5. Reply scripts for common answers (see the `reply-handling-scripts` prompt)
6. Compliance and sender check, with any legally needed sign-off as one line next to the item
7. Test plan
8. Facts I left out because the brief did not give them

## Example of good output (short)

*Illustrative structure, not a real business: an agency running paid search for dental clinics. Copy the shape, never the content: every fact comes from the client's own context.*

> **Email 1** (day 0)
> Subject: new patient bookings at [clinic]
>
> Hi Dr Shah, I run [Business], a small agency that only works with dental clinics. Many clinics with two to five dentists tell us their ads bring calls about check-ups, not the treatments they want to grow. For [Clinic A] we moved spend to implant searches and their implant consults went from 4 to 11 a month (shared with permission). Is growing implant work on your list this year?
>
> Priya Nair, [Business], [postal address]. Not relevant? Reply "no thanks" and I won't write again.
>
> **Follow-up 2** (day 4)
> Subject: three search terms that waste clinic budgets
>
> Dr Shah, across the clinics we run ads for, three search terms took the most spend and booked the fewest treatments: "free dental check", "dentist open now" and "cheap teeth whitening". Blocking them is a ten-minute job. Want the full list of terms we block?
>
> Same sign-off, address and opt-out line as email 1.
>
> **Compliance flags:** two leads are sole traders (UK): removed until consent exists. Postal address and opt-out present. Clinic A result: named only with the clinic's written permission.
