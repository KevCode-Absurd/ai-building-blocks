# Weekly leadership rhythm

**Cadence:** Every week, on the same days: prepare the day before the leadership meeting, follow up the same day as the meeting.

**Trigger:** The leader has agreed an operating rhythm (see the `operating-rhythm-and-meetings` skill) and the quarter's goals exist.

**Access:** Level 1 (read) on the goals tool, project tracker, scorecard sources, calendar and channels is enough to prepare the pack. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the leader's written limits (for example: "update key-result values in Asana; post the scorecard and minutes in #leadership; send agendas to the five attendees; nothing to the board, investors or the whole company").

## Steps

1. **Refresh the scorecard.** Pull each weekly number from its agreed source and compare with target and last week. [L3] Update the key-result values in the goals tool. Any number that does not match its source goes on a "check" list, not into the scorecard.
2. **Collect project updates.** Ask each owner for their line by the agreed deadline. Run the `cross-team-project-status` prompt to build the one-page project view, with clashes and decisions needed.
3. **Build the agenda.** Fixed order: scorecard, priorities on or off track, headlines, last week's actions, then the issues, each written as a question with its owner. Put decisions first. [L2] Save the agenda and pre-read as drafts. [L3] Send them to the attendees the day before.
4. **Prepare briefs for big decisions.** For any one-way-door decision on the agenda, run the `decision-brief-and-log` skill. Two-way doors get a three-line note: question, recommendation, owner.
5. **During or after the meeting: capture decisions and actions.** From notes or a transcript, list decisions (one sentence each, with the decider) and actions (one owner, one date). Never invent an owner; unowned actions go under "needs an owner".
6. **Log decisions.** [L3] File each decision in the decision log the same day with reason and review date. *Approval: the decider confirms the wording if it is a one-way door.*
7. **Send minutes.** [L2] Draft minutes and the follow-up. [L3] Send to attendees and post in the agreed channel within the limits.
8. **Messages in the leader's name.** If a decision needs announcing (to the team, a partner, an investor), run the `message-in-the-leaders-name` prompt. *Approval: a fresh yes from the leader for every message outside the written limits, and always for the board, investors, press, the whole company, or anything about pay, hiring or restructuring.*
9. **Chase actions.** Mid-week, check overdue actions and remind owners. [L3] Within the limits, send reminders to named owners only.
10. **Report.** At the foot of the minutes, list every live action taken this week (what, where, when, result).

## Outputs

- Scorecard (updated)
- Cross-team project page
- Agenda and pre-reads
- Decision briefs and decision-log entries
- Minutes, actions and follow-up message
- Action log (level 3)

## Needs the leader's approval

Changing a target or goal after it is set; any message outside the written limits; anything to the board, investors, lenders, press or the whole company; cancelling a meeting someone else owns; deleting or overwriting decision records or goal history; and anything that cannot be undone. Signing, voting, filings and moving money stay with the leader.
