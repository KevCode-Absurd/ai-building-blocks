# Fill one role, from brief to accepted offer

**Trigger:** The client decides to fill a role, new or replacement. Runs once per role, usually over three to eight weeks. An agency runs it once per client search.

**Access:** At the start, ask which level the client grants for the ATS, job boards, email, calendar and careers page, and record it under "Access I have". Until they answer, work at level 1. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits. Without that level, the step's output comes back as drafts for the client to use.

## Steps

1. **Pin down the role.** Run the `role-brief-and-search-plan` skill, steps 1 to 3: mission, six-month outcomes, criteria, pay range and the location rules to check. *Approval: hiring manager confirms outcomes and criteria; owner confirms the pay range.*
2. **Plan the search.** Same skill, steps 4 to 8: channels, search brief, stages with owners and reply times, tracker, first-week tasks. [L2] Set up the role, stages and decline reasons in the ATS, unpublished. *Approval: client confirms channels, budget for paid boards and the stage plan.*
3. **Write the post and messages.** Run `job-post-and-outreach`: long and short posts, wording change table, outreach set, follow-ups, answers to common questions and decline notes. [L2] Save posts unpublished and messages as templates. If the careers page needs work, run the `careers-page-draft` prompt once a year, not per role. *Approval: client approves the final post and every message template.*
4. **Confirm the live action list.** [L3] Before anything goes live, show the client the list of actions and limits: which boards, which templates, how many outreach messages a day, any sponsored spend cap, for how long. *Approval: the client's yes to the list.*
5. **Post and source.** [L3] Publish on the agreed boards and the careers page, and send outreach and follow-ups from the approved templates, logging each action. At lower levels the client publishes and sends from their own accounts. LinkedIn messages go from the seat holder's own seat.
6. **Check any AI tool.** If the ATS or a board will screen, rank or score applicants, run the `ai-hiring-tool-questions` prompt before it is switched on. *Approval: owner decides whether to use the tool, after checking local rules.*
7. **Screen on evidence.** Run `evidence-based-screening`, steps 1 to 3, on each batch of applications with names replaced by IDs where the tools allow. [L2] Add evidence notes in the ATS. *Approval: hiring manager reviews all three groups and confirms the shortlist; nobody is declined by the sort alone.*
8. **Interview.** Same skill, steps 4 to 7: questions, work sample, scorecard, round plan, scores entered alone before the debrief. [L3] Share booking links and book interviews for the confirmed shortlist. Agencies run the `agency-candidate-summary` prompt for each shortlisted person, with consent.
9. **Report and keep people informed.** Every week the role is open, run the `hiring-funnel-report` prompt and send it to the hiring manager. [L3] Send holding updates and declines from the approved templates once the hiring manager has decided on each person, so nobody waits past the promised reply time.
10. **Decide.** The hiring manager and owner decide from the comparison sheet and the decision record. *Approval: the decision is theirs; I prepare the evidence and carry out what they decide.*
11. **References and offer.** Run `offer-and-reference-check`: agreed terms table, offer draft or letter check, reference questions, offer call notes. [L2] Create the letter in the client's documents. [L3] Send reference requests; send the offer only after a fresh yes on that candidate's final letter. *Approval: owner approves the terms; a qualified employment lawyer or HR adviser reviews any new letter template.*
12. **Checks before day one.** List the checks the location requires (background check notices, right to work or Form I-9 steps), each linked to its official source. I give no immigration advice. *Approval: owner confirms which checks to run.*
13. **Close the loop.** After acceptance, decline the other finalists [L3, or the client sends] and close or expire the posts [L3]. Share the action log. Note what worked: which channel produced the hire, where people dropped out, what to change next time.

## Outputs

- Role brief and search plan, with rules to check
- Long and short job posts, outreach set, decline notes
- Application sort tables, interview kit, scorecards, comparison sheet, decision record
- Weekly funnel reports
- Offer letter draft or check, reference sheet, offer call notes
- Action log of every live change, and lessons for the next search

## Needs the client's approval

Outcomes and criteria, pay range, channels and spend, every post and message template, the level 3 action list and limits, use of any AI screening tool, the shortlist, every hiring decision, the offer terms and letter, and which checks to run. Anything outside the confirmed limits (a new board or role, more spend, a new outreach list, an offer, deleting records) needs a fresh yes. Every template carries: *Check this with local rules before use.*
