---
name: pipeline-stage-design
description: Designs or repairs a sales pipeline and the lifecycle around it - deal stages with entry and exit rules, owners, required fields and probabilities, lifecycle stages, and the written handoff rules between marketing, sales and customer success. Use it when a business sets up a CRM, moves from spreadsheets, has stages nobody agrees on, or has leads and new customers falling between teams. Works from a description of the sale or a CRM export; builds in the CRM only at the access level granted.
---

# Pipeline stage design

## When to use

- A team is moving from spreadsheets or a shared inbox into a CRM.
- Stages exist but mean different things to different people, so pipeline reports are argued about.
- Marketing says sales ignores leads, sales says the leads are junk, or new customers wait days for onboarding.
- The business is adding a new motion (renewals, partners, a new product) and wonders whether it needs another pipeline.

## What you need

1. How a sale happens today, in the team's own words: how a lead arrives, the steps to a yes, who does what, and where deals stall.
2. The CRM in use, and a deal export with stage history if one exists.
3. The current lifecycle or lead status values, if any.
4. Who owns each step: marketing, SDRs, account executives, customer success, finance.
5. Any response time already promised to leads or customers.

**Access:** level 1 to read the current pipelines, properties and reports; level 2 to build new stages, fields and views hidden from reps; level 3 to publish the approved pipeline, map old stages to new ones and switch on the agreed routing, within your limits. Bulk moves of existing deals are shown as a change list first, and merging or deleting stages that hold deals needs a fresh yes.

## Steps

### 1. Walk the sale on paper

Write the sale as a list of buyer commitments, not seller activities. "Agreed there is a problem worth solving" is a stage; "sent email" is not. Use the words the team already uses for each step. Mark where deals wait for the buyer and where they wait for the seller.

### 2. Cut to five to eight stages

Merge steps that never happen apart. Each stage must be something a manager can check from the record. Keep closed won and closed lost. If two motions share the same buyer steps, keep one pipeline and use a property to tell them apart; HubSpot's own help page advises separate pipelines only when the process truly differs (see `knowledge.md`, section 3).

### 3. Write entry and exit rules

For every stage write:
- **Entry rule:** what must be true and recorded (for example, "discovery held; pain and impact written in the deal; next meeting booked").
- **Exit rule:** what moves it forward, and what sends it to closed lost.
- **Owner:** the role responsible while the deal is in the stage.
- **Required fields:** only the fields needed at that point, made required on entry where the CRM allows it.
- **Expected time in stage:** from the client's own history if there is one; otherwise leave it blank and measure it for a quarter.
- **Probability:** start from historic stage-to-won conversion if the export allows; otherwise mark it as a placeholder to review after a quarter.

Use a qualification checklist such as MEDDICC as a menu for later-stage exit rules, not as a form for every deal.

### 4. Design the lifecycle and lead status

Keep two different questions apart:
- **Lifecycle stage:** where the person or company is in the whole relationship (subscriber, lead, MQL, SQL, opportunity, customer, and any post-sale stages the client needs).
- **Lead status:** what sales is doing with this lead now (new, attempting, connected, not ready, disqualified).

In HubSpot, automatic updates only move a lifecycle stage forward, so plan a deliberate "recycle" step that clears and resets the stage with a reason when a lead goes back to marketing.

### 5. Write the handoff agreements

For each handoff (marketing to sales, sales to customer success, sales to finance for billing set-up) write:
- The trigger (score threshold, form type, closed won).
- Who receives it, and the routing rule.
- The response time the receiving team commits to, chosen by the client.
- What the receiver must record (accepted, rejected with reason).
- What happens if nobody acts in time (reminder, reassignment, report to the manager).
- For closed won: the fields billing needs (legal entity, billing contact, plan, price, start date, payment terms), so finance can set up the subscription without chasing.

### 6. Plan the move

- Map every old stage to a new stage in a table. Flag deals that do not fit.
- List deals that would land in a stage without meeting its entry rule. These go to the owner to fix, not to an automatic move.
- Write a one-page team guide: each stage, its rule, and what reps must update.
- Agree a review date after one quarter to check probabilities and time in stage.

## Checks

- Five to eight open stages, each named as a buyer commitment.
- Every stage has entry rule, exit rule, owner and required fields.
- Lifecycle stage and lead status are separate properties with no overlapping values.
- Every handoff has a trigger, owner, response time, record and fallback.
- The closed-won handoff lists every field billing needs.
- Probabilities are either from history or marked as placeholders.
- No live change was made without the approved list and the client's limits.
- Pricing, payment terms or contract wording questions are marked for the client, and for anything about revenue recognition, ask a qualified accountant.

## Output format

1. One-paragraph summary of the change and why.
2. Stage table: stage, entry rule, exit rule, owner, required fields, probability, expected days.
3. Lifecycle and lead status definitions.
4. Handoff agreements, one block each.
5. Old-to-new stage mapping and the deals needing an owner's check.
6. One-page team guide.
7. Access I have, actions taken (if any) and the action log.

## Example of good output (short)

*Illustrative structure, not a real business: a 9-person B2B design agency moving from a spreadsheet to HubSpot. Copy the shape, never the content: every fact comes from the client's own context.*

| Stage | Entry rule | Exit rule | Owner | Required fields | Probability |
|---|---|---|---|---|---|
| Problem confirmed | Discovery call held; problem and budget range written | Proposal call booked, or lost with reason | Founder | Problem, budget range, decision maker | Placeholder: review in Q1 |
| Proposal out | Written proposal sent with price and start date | Verbal yes, or lost with reason | Founder | Proposal value, decision date | Placeholder |
| Contract out | Contract sent for signature | Signed, or lost with reason | Ops lead | Contract value, billing contact | Placeholder |

**Handoff: closed won to delivery and billing.** Trigger: deal moved to closed won. Receiver: ops lead. Response: kickoff email within the time the founder sets [NEEDED]. Record: kickoff date. Fields for billing: legal name, billing email, plan, monthly fee, start date, payment terms. Fallback: reminder to the founder if no kickoff date after the agreed time.
