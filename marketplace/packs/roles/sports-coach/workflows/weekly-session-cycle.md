# Weekly session cycle during the season

**Trigger:** A squad is in season with a plan in place.

**Cadence:** Every week: plan two to three days before the session, publish, run, review the same day or the next; a progress check at each review week.

**Access:** Use the levels recorded under "Access I have". Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits. Until a level is granted, work at level 1 and return text.

This is not medical advice. Injury, concussion, nutrition and training-load questions go to a qualified medical professional, with extra care for young players. Anything about a named child's welfare goes to the club welfare officer, with a fresh yes before any action.

## Steps

1. **Read the week.** Check the season grid for this week's theme, the team calendar for venue and time changes, and expected numbers from availability in the club app. [L1]
2. **Plan the session.** Run `session-plan-builder` for the theme, with the real numbers, space and adults. If the venue or numbers changed, use the `backup-session-for-bad-weather` prompt. [L2] Attach the plan to the event as a draft.
3. **Publish and remind.** [L3] Publish the plan to the coaches on the event and send the agreed weekly reminder to the parent group within agreed hours. A change of time or venue uses `club-messages-for-parents`. *Approval: covered by the level 3 limits; anything new (new audience, single family, photo, fees) needs a fresh yes.*
4. **After the session.** Ask the coach three questions: what worked, where players waited, what to change. Record attendance and short skill notes against first names or initials. [L3] Update the agreed progress sheet columns.
5. **Handle anything unusual.** Injury: the coach follows the first aid steps and tells the parent; medical questions go to a qualified medical professional. Suspected head injury: the player sat out for the rest of the day, the parent was told, and the club's form was completed; the agent never plans a return. Welfare worry: the coach writes a note with the `welfare-concern-note` prompt and sends it to the welfare officer. *Approval: nothing in this step is sent by the agent without the coach's fresh yes, and welfare notes go only to the welfare officer.*
6. **Review week.** At the end of each block, use the progress sheet to adjust the next block and run the `end-of-block-player-notes` prompt. [L2] Save notes unsent. *Approval: the head coach approves notes before they go to families.*
7. **Report.** Send the coach a short weekly summary: sessions run, changes made, messages sent, and the action log.

## Outputs

- Weekly session plan attached to the event
- Parent reminders and change messages
- Attendance and progress sheet updates
- End-of-block player notes
- Weekly summary and action log

## Needs the client's approval

The level 3 limits set at the start of the season; any message outside them; any photo or video of a child; fee requests; notes to families at the end of a block; and anything about a named child's welfare, injury or behaviour, which goes to the welfare officer or the parent through the coach, never from the agent on its own. Check this with local rules and your sport's governing body.
