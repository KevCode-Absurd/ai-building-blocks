# Pre-season set-up, from squad brief to first session

**Trigger:** A club, school or academy group is about to start a season, term or new age group, or a new volunteer coach is taking over a squad.

**Cadence:** Once per season, two to four weeks before the first session, with a short check-in after the first two sessions.

**Access:** At the start, ask which level the client grants for the club app, the planning tool, documents, the progress sheet and email, and record it under "Access I have". Until they answer, work at level 1. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits. Without that level, the output comes back as files and text.

This is not medical advice. Injury, concussion, nutrition and training-load questions go to a qualified medical professional, with extra care for young players. Anything about a named child's welfare goes to the club welfare officer, with a fresh yes before any action.

## Steps

1. **Take the brief.** Sport, age group, usual and worst-case numbers, ability spread, space, kit, session length, adults and first aider, governing body, country. First names or initials only; no health details. If any of this is missing, ask before planning.
2. **Check the safety basics.** Confirm the welfare officer's name and contact, the codes of conduct, photo consent, messaging rules and the concussion policy. Compare adults with the CPSU ratios or the governing body's rule. List gaps for the club, with an owner for each. *Approval: the club lead confirms the contacts and gaps list.*
3. **Plan the season.** Run `season-plan-and-progress-sheet`: development stage, skills in order, week-by-week grid with review weeks and breaks, and the progress sheet template. [L2] Save the plan and a new sheet tab. *Approval: the head coach approves the season plan.*
4. **Plan the first sessions.** Run `session-plan-builder` for the first few weeks, each with easier and harder versions and a safety line. Add one backup with the `backup-session-for-bad-weather` prompt. [L2] Attach the plans to draft events in the club app.
5. **Write the handbook.** Run `volunteer-coach-handbook` with the club's policies and contacts, or [placeholders]. [L2] Save it beside the current handbook with changes marked. *Approval: the welfare officer approves every safeguarding section; the club lead approves the rest.*
6. **Write the parent messages.** Run `club-messages-for-parents` for the start-of-season message, the photo consent request and the head-injury steps (use the `head-injury-steps-for-parents` prompt). [L2] Save them unsent. *Approval: the head coach approves wording, audience and send times.*
7. **Confirm the live action list.** [L3] Show the actions and limits: which team events to publish, which plans to attach, which messages go to which parent groups and when, which coaches get the handbook, and until when. *Approval: the client's yes.*
8. **Go live.** [L3] Publish the events with plans attached, send the approved messages to the agreed groups (parents included), share the handbook with the named coaches, and log every action. Fee requests and any photo need a fresh yes each time.
9. **Check in after two sessions.** Ask the coach what worked, where players queued, and whether numbers matched. Adjust the next sessions. Any welfare worry raised by the coach goes to the welfare officer through the `welfare-concern-note` prompt, never into a group message.

## Outputs

- Brief and safety gaps list with owners
- Season plan and progress sheet template
- First session plans and a backup session
- Volunteer coach handbook draft
- Start-of-season, photo consent and head-injury messages
- Action log of every live change

## Needs the client's approval

The contacts and gaps list, the season plan, every safeguarding section of the handbook (welfare officer), the parent messages, the level 3 action list and limits, and anything outside them: a new audience, a message to a single family, any photo, fee requests, deleting records, or anything about a named child's welfare, which goes to the welfare officer with a fresh yes. Check this with local rules and your sport's governing body.
