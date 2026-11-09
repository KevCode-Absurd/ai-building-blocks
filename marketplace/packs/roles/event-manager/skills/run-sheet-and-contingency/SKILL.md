---
name: run-sheet-and-contingency
description: Writes a minute-by-minute run sheet for an event day, from first supplier arrival to the last van leaving - time, what happens, where, owner, cue and backup for every line - plus an "if this goes wrong" list for the key moments (power, audio, speaker no-show, weather, medical, crowding, access), a crew briefing, a contact sheet and a pack-down plan. Works for in-person, online and hybrid events. Use the week before any event, when a run sheet has lines with no owners or no backups, or when a day-of crew needs to run the event without the organiser answering every question.
---

# Run sheet and contingency

A good run sheet lets the crew run the day without asking the organiser. Every line has a time, an owner and a cue. Every key moment has a backup.

## When to use

- The week before an event, once suppliers, speakers and numbers are fixed.
- A run sheet exists but lines say "AV" or "team" instead of a name.
- The event has a risky moment: outdoors, a live demo, a celebrity speaker, a tight changeover.
- An online or hybrid event depends on one connection or one host.

## What you need

1. **The programme**: sessions, speakers, breaks, food service, entertainment.
2. **Venue details**: access times, rooms, floor plan, power, Wi-Fi, loading, emergency exits, accessible routes.
3. **Suppliers**: arrival and departure times, contacts, what each delivers.
4. **People**: crew, volunteers, hosts and who does what.
5. **Known risks** from the risk list.
6. **Access arrangements**: interpreters, captioning, seating, quiet room, assistance.

**Access:** level 1 to read the programme and supplier details. Level 2 to build the run sheet and briefing in a shared document. Level 3 to share the final run sheet with the agreed crew and suppliers and send approved day-before messages. Anything that changes a supplier booking or cost needs the client's fresh yes.

## Steps

### 1. Fix the frame
Write the hard times: venue access, supplier arrivals, doors, start, breaks, end, venue exit. Work out set-up and pack-down time from supplier needs, not hope.

### 2. Write every line
Columns: time, duration, what happens, where, owner (a name), cue (what triggers it), notes, backup. Include the unglamorous lines: deliveries, sound check, signage up, registration desk open, cloakroom, food service, toilet checks, door staff changes, lost property, last orders, lights up.

### 3. Give every line an owner
A named person, with a deputy for key lines. Nobody owns two things at the same time in two places.

### 4. Write the "if this goes wrong" list
For each key moment, a one-line trigger and a one-line action, with who does it:
- **Power or audio fails:** spare mic location, who calls the venue technician, what the host says.
- **Speaker late or missing:** who fills, which session moves.
- **Weather:** the indoor or covered fallback and when the call is made.
- **Medical incident:** first aider, where they are, who calls emergency services, who meets them at the door.
- **Crowding or queues:** who opens the second desk, capacity limits from the venue.
- **Access request on the day:** who handles it and what is available.
- **Online failure:** backup host, backup stream or dial-in, the message to send attendees.
Safety procedures (evacuation, first aid, security) come from the venue and the client's safety plan; reference them, don't rewrite them.

### 5. Build the crew briefing
One page: purpose of the event, the three things that matter most, roles, radio or phone channels, where the first aider is, the emergency procedure, how to handle access requests, break times. Build breaks into the rota.

### 6. Make the contact sheet
Name, role, mobile, arrival time, for crew, suppliers, venue contacts and speakers. Share it only with those who need it.

### 7. Plan pack-down and the next morning
Who collects what, supplier collection times, lost property, venue sign-off, and a note of anything damaged. Then the follow-up starts (see the `post-event-follow-up-and-report` prompt).

## Checks

- Every line has a time, an owner and a cue.
- No one is in two places at once.
- Key moments have a backup with an owner.
- Set-up and pack-down match supplier and venue times.
- The emergency procedure points to the venue's plan.
- Access arrangements appear in the run sheet, not just the plan.
- The contact sheet goes only to those who need it.

## Output format

1. Run sheet table: time, duration, what, where, owner, cue, notes, backup
2. "If this goes wrong" list for key moments
3. Crew briefing (one page)
4. Contact sheet
5. Pack-down plan

## Example of good output (short)

*Illustrative structure, not a real event: a one-day craft fair for 40 stallholders. Copy the shape, never the content: every fact comes from the client's own context. Times only show the shape.*

> | Time | What | Where | Owner | Cue | Backup |
> |---|---|---|---|---|---|
> | 07:00 | Venue open; barriers and signs out | Main gate | Dev | Venue keyholder arrives | Dev's deputy Ana holds the spare gate key |
> | 07:30 | Stallholders arrive by van slot | Loading bay | Ana | Slot list | Late vans wait in the overflow car park |
> | 09:45 | Ramp and matting check on the accessible route | Gate to hall | Priya | Before doors | Spare matting in store room 2 |
> | 10:00 | Doors open | Main gate | Dev | Priya confirms route clear | |
>
> **If it rains at 08:00:** Dev moves the food stalls to the covered yard (plan B layout); Ana texts stallholders the new pitch numbers.
>
> **If the card reader network fails:** stallholders switch to their own phones' hotspot; the info desk shows the nearest cash machine.
