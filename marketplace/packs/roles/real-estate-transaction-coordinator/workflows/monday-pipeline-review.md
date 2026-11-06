# Monday pipeline review across all deals

**Trigger:** An agent or brokerage has several live deals and wants one view of what is due, what is at risk and who needs an update.

**Cadence:** Weekly, Monday morning, plus a quick check each afternoon for deadlines due the next day.

**Access:** Level 1 reads the transaction tool, inbox and calendar to build the review. [L2] drafts updates and tasks. [L3] sends approved updates and reminders and updates checklists within the client's limits.

## Steps

1. **Pull the list.** Every open deal from the transaction tool (Docusign Rooms, dotloop, SkySlope) or the agent's tracker: address, side, stage, closing or completion date, last update sent.
2. **Next 14 days.** List every deadline and task due in the next two weeks from each deal's tracker (`deal-deadline-tracker`), sorted by date, with owner and status.
3. **Red flags.** Mark deadlines at risk (condition not met, document missing, no reply), deals with no movement since last week, chain links stalled, and any suspicious money message seen in the inbox (`suspicious-money-message-check`). *Approval: the agent decides what to do about each red flag; nothing about a missed or at-risk deadline goes to a party without a fresh yes.*
4. **Missing documents.** From each deal's checklist (`stage-document-checklists`), list what is outstanding and draft the chase. [L3] Send approved requests to parties on the file.
5. **Updates due.** List parties who have not heard from us within the agreed cadence and prepare their updates (`weekly-party-updates`). [L3] Send the approved ones at the agreed time; bad news waits for the agent.
6. **Closings this week.** For each, confirm the `closing-day-plan` is current, the Closing Disclosure timing is on track for US financed buyers, and the wire-safety line has gone to the buyer.
7. **Report.** A one-page review for the agent: deals by stage, next 14 days, red flags, decisions needed, messages waiting for approval, and the log of last week's live actions.

## Outputs

- Pipeline table by stage and closing date
- Next 14 days deadline list
- Red flag list with suggested next step and owner
- Chase list and drafted requests
- Updates ready to send or approve
- One-page Monday review and action log

## Needs the client's approval

Every response to a red flag; every bad news or missed-deadline message; any binding document; any new recipient. Money instructions never pass through the coordinator. Check local rules for every deal's state or UK nation, and send legal questions to the broker, attorney or conveyancer.
