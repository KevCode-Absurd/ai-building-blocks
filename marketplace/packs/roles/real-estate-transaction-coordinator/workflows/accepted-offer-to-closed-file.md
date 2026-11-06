# One deal: accepted offer to closed file

**Trigger:** An offer is accepted (US) or a sale is agreed and the memorandum of sale issued (UK).

**Cadence:** Once per deal, with a weekly update and a check at every stage change.

**Access:** Level 1 (read) is enough to prepare every tracker, checklist and message. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "keep the dotloop checklist for 14 Maple Court; send the approved weekly update each Monday at 9am to the buyers and the listing agent; send approved deadline reminders; route the approved HOA acknowledgement to the two buyers; no amendments, extensions or money messages").

## Steps

1. **Open the file.** Collect the contract or memorandum of sale, addenda, parties by role, financing, location and the brokerage checklist. Write the access level for each tool under "Access I have". *Approval: the agent confirms the limits before the first live action.*
2. **Key dates and tracker.** Run the `contract-key-dates-table` prompt, then the `deal-deadline-tracker` skill, built backwards from closing or completion. Computed dates are marked to confirm. Send the lawyer questions to the agent. [L2] Create tasks and tentative calendar holds. [L3] Keep the live checklist and reminders running.
3. **Document checklists.** Run the `stage-document-checklists` skill. [L2] Draft requests. [L3] Send approved requests to parties on the file and file what arrives.
4. **Wire safety from day one.** Send the approved welcome message with the wire-safety line: instructions only from the closing agent or conveyancer, confirmed by phone on a number already held. *Earnest money, deposits, wiring and payee bank details never pass through the coordinator at any level.*
5. **Weekly updates.** Run the `weekly-party-updates` prompt or the `party-updates-with-wire-safety` skill. [L3] Send approved templates at the agreed time and log them. *Approval: bad news, missed or at-risk deadlines and anything binding get a fresh yes each time.*
6. **Stage changes.** At each stage (inspection, appraisal, loan approval or mortgage offer, title or searches, exchange), update the tracker and checklist and send the stage update. Use `delay-or-bad-news-update` when something slips. *Approval: offers, counter-offers, amendments, extensions, contingency removals and terminations are routed for signature only after a fresh yes per envelope.*
7. **Suspicious messages.** Any message about changed bank details or urgent payments goes through the `suspicious-money-message-check` prompt and straight to the agent.
8. **Closing week.** Run the `closing-day-plan` skill one week out and on the day. For US financed buyers, confirm with the lender how the Closing Disclosure will arrive at least three business days before closing.
9. **Close the file.** Final documents filed, checklist complete for broker review, lessons noted. *Approval: deleting any record or document needs a fresh yes.*

## Outputs

- Key dates table with lawyer questions
- Deal tracker with owners, reminders and red flags
- Document checklist by stage, with requests
- Welcome message with the wire-safety line
- Weekly and stage updates per party
- Closing or completion day plan
- Activity log of every live action (level 3)
- Closed compliance file

## Needs the client's approval

The access limits before the first live action; every binding document routed for signature; every bad news, missed-deadline or deal-ending message; any new recipient or signer; deleting records. Wiring instructions, earnest money, deposits, proceeds and payee bank details stay with the client and the closing agent or conveyancer. Check local rules at every stage, and ask the broker, real estate attorney, conveyancer or solicitor about anything with legal effect.
