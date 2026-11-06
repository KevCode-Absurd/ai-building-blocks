# From discovery to demo to pilot decision

**Trigger:** A qualified opportunity reaches technical evaluation: the buyer wants a demo, and possibly a pilot or proof of concept, before deciding.

**Cadence:** Runs per deal. Demo within the booked slot; pilot check-ins weekly; readout on the agreed end date.

**Access:** At the start, ask which level the client grants for the CRM, email, documents, the demo sandbox and any call recorder, and record it under "Access I have". Until they answer, work at level 1. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits. Steps marked [Fresh yes] need the client's yes every time, even at level 3.

## Steps

1. **Check discovery.** Run the `discovery-gap-check` prompt on the notes or transcript. Send the gap questions to the account owner or buyer before building. *Approval: the account owner decides whether to ask the buyer or proceed with marked risks.*
2. **Build the demo.** Run the `discovery-to-demo-script` skill: three problems, room map, timed flow, do-not-show list, technical questions, follow-up draft. [L2] Prepare demo data in the sandbox. *Approval: the account owner and the person presenting approve the script.*
3. **Prepare for the technical person.** Run the `solution-summary-and-objections` skill for likely objections, or the `technical-objection-answer` prompt for one. *Approval: the client's product or security lead confirms any answer marked [CONFIRM].*
4. **Run and log the demo.** The client presents, or the agent supports with notes. [L3] Log attendees, reactions and open questions in the CRM and move the deal stage.
5. **Follow up the same day.** Run the `demo-follow-up-email` prompt. [L3] Send the approved follow-up from the named mailbox to the named contacts. *Approval: the client approves the template once; any new claim, contact or attachment needs a new yes.*
6. **Decide whether a pilot is needed.** If the buyer's remaining doubt can be answered with a reference call, a document or a technical session, offer that instead. If a pilot is needed, continue.
7. **Write the pilot plan.** Run the `pilot-success-plan` skill: scope, people, success criteria with baselines and targets, timeline, decision for each result, data and paperwork flags. *Approval: both sponsors sign off the plan before set-up.*
8. **Send the paperwork.** [Fresh yes] Any pilot agreement, NDA, data processing terms, discount or quote. Flag terms for the client's lawyer; the agent prepares, the client's signatory signs.
9. **Run the pilot.** [L3] Update the CRM pilot stage and required fields, log weekly check-ins, send approved progress notes. Record any scope change in the change log. *Approval: scope changes need both sponsors' yes and a note on the end date.*
10. **Read out and decide.** Run the `pilot-readout` prompt on the results. Present the decision the plan named. [L3] Update the deal stage and next steps.
11. **Hand off.** On a win, write the delivery hand-off from the `solution-summary-and-objections` skill, step 13. [L3] Attach it and create the hand-off task.

## Outputs

- Discovery gap list and questions.
- Demo script, do-not-show list and same-day follow-up.
- Solution summary and objection sheet.
- Signed pilot plan with success criteria, and a change log.
- Pilot readout memo with the decision.
- Hand-off note to delivery.
- Action log of every CRM update and email sent.

## What needs the client's approval

- The demo script and any claim marked [CONFIRM].
- Every new follow-up template, contact or attachment.
- The pilot plan (both sponsors) and every scope change.
- Each pilot agreement, NDA, data processing term, quote or discount: a fresh yes every time.
