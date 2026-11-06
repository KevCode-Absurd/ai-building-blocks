# Idea to factory-ready

**Trigger:** A client brings a new physical product idea, a sketch or a handmade sample and wants to reach a factory order.

## Steps

1. **Agree access and limits.** Ask which level the client grants for each tool (documents and sheets, supplier email, tech pack software) and, for level 3, which suppliers I may write to and which kinds of message. Write it under "Access I have". Until the client answers, use level 1.
2. **Intake (level 1).** Idea, users, conditions of use, target retail price, first quantity, markets, materials in mind, budget and timing. Note anything that touches food, children, skin, heat, water, batteries or electricity.
3. **Requirements and prototype plan (level 2).** Use the `product-requirements-and-prototype-plan` skill: testable requirements, lab flags, prototype stages with budget lines and pass criteria. *Approval: the client approves the requirements and each prototype budget line.*
4. **Safety and labelling questions.** Use the `safety-and-labelling-question-list` skill to write the lab brief and the questions by market. The client chooses the lab or adviser and pays. *Approval: lab booking and fees are the client's.*
5. **Prototype rounds.** Run looks-like, then works-like, logging results against pass criteria. Gate: no tooling until works-like passes.
6. **DFM review.** Run the `dfm-questions-before-quote` prompt on the near-final design and fold the answers into the spec.
7. **Tech pack or spec pack.** For garments, use the `apparel-tech-pack` skill; for other goods, the spec sheet from step 3 with drawings.
8. **Quote round.** Use the `rfq-pack-and-quote-comparison` skill to build the pack. At level 3, send it to suppliers on the client's list; otherwise the client sends it. Chase missing answers with the `routine-supplier-update` prompt.
9. **Compare and cost.** Normalise quotes, work out landed cost per unit at each quantity with the `cost-per-unit-at-three-quantities` prompt, and check duty in the official tool on the day.
10. **Timeline.** Use the `timeline-to-first-batch` prompt with real lead times and lab slots.
11. **Decision pack.** Recommendation, open questions, cost table, timeline, risks, and the list of commitments for the client: supplier choice, sample order, tooling agreement, production purchase order, deposits. *Approval: every one of these needs the client's fresh yes; payments are made by the client.*
12. **Report.** What was done, what was sent and to whom (the action log), what is open, and the next gate.

## Outputs

- Requirements document with lab flags
- Prototype plan and results log
- Lab brief and questions by market
- Tech pack or spec pack
- RFQ pack, normalised quote table and landed cost per unit
- Timeline to the first batch
- Decision pack with the commitments for the client
- Action log of messages sent at level 3

## Needs the client's approval

The access level per tool and the level 3 limits (which suppliers, which messages); the requirements; each prototype budget line; lab and inspection bookings and fees; any message to a supplier not on the list; sharing design files with a new party; sample orders, purchase orders, tooling agreements, contracts and accepting a quote as binding (a fresh yes every time); all payments, including tooling and deposits, which the client makes.
