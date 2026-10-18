---
name: video-script-type-library
description: Use when you want many genuinely different video ad scripts from the same research: pick script types (architectures) that fit the buyer stage and what the business can prove, and set the feeling the script moves through.
---

# Video Script Type Library

The same research written with the same recipe gives the same ad again and again. A script type is a different architecture for the same truth: a different way in, beat order, and thing doing the persuading. Two types for one persona and angle are different ads to the viewer and the platform.

This block chooses types and gives each one's recipe. Pair it with a script-writing block; the type wins on the opening, beat order, person and tense, and what carries the script. Rules on facts never change.

## Inputs
- **Concept** (required): persona, angle, offer.
- **Awareness stage and length** (required).
- **What the business can supply** (required): an accommodation, failed solutions, the nearly-didn't-buy, a true cause, process facts, a real customer account, something visible, time points, offer terms, a real shortcoming.
- **How many scripts** (optional): default a batch of 4.

## Steps
1. **Shortlist types** from the table. A type needing something the business lacks is skipped, not faked. Drop types the stage does not suit and types the length cannot hold (stories need about 60 seconds; a timeline needs longer).

| Carried by | Type | Opens with | Stage | Needs |
|---|---|---|---|---|
| Problem | straight argument | The accommodation, said to "you" | problem, solution | an accommodation |
| | confession | Something the speaker did and never said | unaware, problem | an accommodation with stakes |
| | unaware observation | An observation about their life, no problem named | unaware | a behaviour customers describe from before they knew why |
| Objection | failed solutions | What they tried, in order | problem, solution | two failed solutions from research |
| | objection first | The doubt, conceded before they think it | solution, product | the nearly-didn't-buy |
| | honest review | What is not perfect, before what is good | product, solution | a real shortcoming |
| Mechanism | discovery | "Here's what I didn't know" | problem, solution | one true cause |
| | three things | A count and an open question | solution | two or three features each with "which means" |
| | category call-out | What the category gets wrong | solution | a true flaw of the usual product |
| | timeline | The first time point | problem, solution | supportable time points |
| | days in | A day count and where things stand | solution, product | a day count the business holds |
| | how it's made | A decision made in making it | solution, product | a real process fact |
| Proof | witness | Someone else noticing | problem | a real customer's account |
| | demonstration | The thing working | solution, product | something visibly done |
| | daily routine | A moment of an ordinary day | solution, product | how and when customers use it |
| | several side by side | The line-up and what it is judged on | solution, product | a real test or checkable facts |
| Offer | offer first | The terms | product, most aware | terms worth leading with |
| | price of the problem | What the problem has already cost | problem, solution | a cost the research or business states |
| Identity | identity led | Who they are | product, most aware; tired markets | a feature that says something about its buyer |

2. **Spread the batch** across what carries the script: one problem type, one mechanism type, one proof type, one offer or objection type. Three scripts carried by the same beat read as one ad. Do not use two types that open on the same fact for one concept (straight argument and confession on one accommodation; demonstration and how it's made on one process fact; failed solutions and price of the problem on the same two tries). Give the second a different fact or another type.
3. **Load each chosen type's recipe** from `references/types.md` and write the script with the chosen script-writing block.
4. **Set the feeling.** A script has a lead feel (hook and problem) and an ending feel (promise onward); the move between is the arc. Every feel starts from something the research shows customers feel, and works only on a true fact.

| Feel | Sounds like | Natural ending |
|---|---|---|
| fear of loss | What is being lost while they wait; quiet and exact, never loud | relief or transformation |
| frustration | Fed up with what they tried; dry, a little angry on their behalf | relief |
| matter of fact | Calm, plain; facts carry it | matter of fact or pride |
| relief | The weight coming off | joy |
| transformation | Who they become; forward-looking, earned | pride |
| joy | Light, playful, pleased | joy |
| pride | Quiet self-respect | pride |

Rules: true first (fear with nothing at stake is manufactured urgency); the accommodation, never the affliction (no pity, shame or claim the viewer has a condition); the brand's voice wins (if it forbids fear or guilt, take the nearest allowed feel and say so); lead with one feel, end on another, and let the mechanism be the turn; words carry feeling, not adjectives; the visual track follows. By default: hook and problem = lead feel; promise and mechanism = the turn, plain and clear; objection = respect for how they felt; proof, offer, risk reversal = steady and specific; call to action and identity line = ending feel.

## Output
```
Batch: <n> scripts
1. <type> | carried by <beat> | opens: <pattern> | feel: <lead> -> <end> | needs met: <fact>
...
Skipped types and why
```
Then the scripts themselves if a writing block is paired.

## Checks
- Each script would be called a different ad from its neighbour.
- Each type's "needs" is met by supplied facts.
- No type in the batch shares its carrying beat more than twice.
- No example opening from the library appears in a script.

## If something is missing
Write `MISSING: <need>` and skip the type that needs it. A witness type without a real account becomes a brief for a real customer to film, with listed placeholders.

## Avoid
- Faking a process fact, shortcoming, test or customer account to fit a type.
- Picking types because they sound fresh rather than fit.
