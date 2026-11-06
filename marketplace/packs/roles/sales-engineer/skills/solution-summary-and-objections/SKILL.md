---
name: solution-summary-and-objections
description: Writes a solution design summary for the buyer's team and an honest technical objection sheet. The summary shows how the product fits the buyer's current tools, data flows as a text diagram, integration points, what changes for each team, assumptions and open questions, with anything proposed clearly labelled. The objection sheet gives, for each technical objection, what the buyer means, the true answer, evidence, a follow-up question and what not to say. Also drafts the hand-off from sales to delivery. Use after discovery or a demo, when the buyer's IT or engineering people need to see the fit, or when the same objections keep stalling deals.
---

# Solution summary and technical objections

The buyer's IT lead needs to see how the product fits what they already run, and what could go wrong. This skill writes that picture honestly, answers the hard questions without overclaiming, and passes the same facts to the delivery team.

## When to use

- After a demo, when the buyer asks "how would this work with our setup?"
- Before a technical review or architecture meeting with the buyer.
- When a deal stalls on technical concerns: integration, security, data, performance, support.
- When the same objections recur across deals and the team needs one answer sheet.
- At signature, to write the hand-off to delivery.

## What you need

**Access:** level 1 to read discovery notes, the CRM record, product and integration docs, and the buyer's description of their systems. Level 2 to save the summary, objection sheet and hand-off as drafts. Level 3 to file the final versions, attach them to the deal and send the approved summary to the named buyer contacts within the client's limits.

- The buyer's current systems, as they described them, with versions where known.
- What the product does today, documented integrations and their limits, hosting and data locations, support terms.
- Roadmap items with dates the product team has committed to in writing.
- The objections raised, in the buyer's words, from notes or recordings.
- Who on the client's team can confirm technical and security answers.

## Steps

### Solution summary

1. **State the goal and scope.** One line on the buyer's goal, then which teams, sites and processes the solution covers.
2. **List current systems.** Each system the product touches, its role, and who owns it on the buyer's side.
3. **Draw the data flows.** A text diagram: what data moves, from where to where, how (documented API, file export, manual), how often and which direction. Mark each flow as existing, configured, or proposed custom work.
4. **Name the integration points.** For each: the method, what is documented, what needs configuration, what the buyer's team must do, and any limit (rate limits, field mapping, one-way only).
5. **Say what changes for each team.** Daily users, IT, finance, management: what they stop doing, start doing, and what training they need.
6. **Write assumptions and open questions.** Assumptions you made because facts were missing, each with who can confirm it. Open questions with owners and dates.
7. **Label proposals.** Anything not yet agreed or built is labelled "proposed". Roadmap items carry only committed dates.

### Objection sheet

8. **Collect the objections.** Use the buyer's exact words. Group by theme: integration, security, data, performance, support, migration, cost of change.
9. **Find the real concern.** For each, write what the buyer most likely means. "Your app is cloud-only" may mean "our IT policy bans storing customer data outside our country".
10. **Write the honest answer.** What is true today, with the evidence. If the answer is "no", say so, then offer a real workaround if one exists, and its cost or limits.
11. **Add a follow-up question.** A question that checks the real concern ("Is the rule about storage location, or about who can access the data?").
12. **Write what not to say.** Overclaims a rep might reach for: "it integrates with everything", "fully compliant", "no one has ever had that problem".

### Hand-off to delivery

13. **Write the hand-off.** At signature, give delivery: the buyer's problems, what was shown and promised, the success criteria from any pilot, the solution summary, open questions, contacts, and anything the buyer was told "not today". [L3] Attach it to the deal and create the hand-off task for the delivery owner.

## Checks

- Every integration claim names a documented method and its limits.
- Every "proposed" item is labelled, and nothing proposed appears in the summary as fact.
- Every objection answer is true today and has evidence or a named confirmer.
- Workarounds state their cost, effort and limits.
- The hand-off matches the demo script, pilot plan and summary; no new promises appear.
- No legal or regulatory conclusions; contract and data protection terms are flagged for the client's lawyer.

## Output format

1. Solution summary: goal and scope, current systems table, data flow diagram (text), integration points table, changes by team, assumptions, open questions.
2. Objection sheet: table with objection (their words), what they mean, honest answer, evidence, follow-up question, what not to say.
3. Hand-off note to delivery (one page).

## Example of good output

*Made-up business for illustration: Bookwhistle, appointment software, for a made-up chain of physiotherapy clinics.*

**Data flows**

```
Clinic website --(booking form, live)--> Bookwhistle
Bookwhistle --(nightly CSV, one way)--> Clinic accounts system   [configured]
Bookwhistle --(SMS reminders, via provider)--> Patients            [existing]
Patient records system <--(two-way sync)--> Bookwhistle            [PROPOSED: not built]
```

**Objection sheet**

| Objection (their words) | What they mean | Honest answer | Evidence | Follow-up question | Do not say |
|---|---|---|---|---|---|
| "It won't talk to our patient records system." | Staff will retype data and make errors | Correct today: there is no two-way sync. A nightly export of bookings exists; a two-way sync is not on the committed roadmap. | Integration guide, page 4 | "Which fields do staff retype most?" | "We can build that quickly." |
| "Where is the data stored?" | Data must stay in the UK | Bookings are hosted in the UK region named in our hosting statement. | Hosting statement v2 | "Does the rule cover backups too?" | "All our data is in the UK" (backups not checked) |
