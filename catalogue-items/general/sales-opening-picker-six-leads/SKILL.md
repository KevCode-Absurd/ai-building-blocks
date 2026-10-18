---
name: sales-opening-picker-six-leads
description: Use when you need to choose how a piece of sales copy should open (deal, promise, problem, fact, statement or scene) for a given buyer, and write two genuinely different openings to test.
---

# Sales Opening Picker (Six Leads)

Chooses the way into a sale that fits the buyer's awareness and writes two openings that differ in approach, not just wording.

## Inputs
- **Buyer read** (required): who it is for, awareness stage, the one want. If you do not have one, write it first with `buyer-read-before-writing-copy`.
- **Offer and proof** (required): what is sold, terms, and the proof you may use.
- **Channel** (optional): what shows before "see more" or before the thumb moves.
- **Brand brain** (optional): voice, claims register, current offers.

## Steps
1. Match the buyer to a lead using the table.
2. Write the opening for that lead: the part read or heard before the reader decides to continue. Length follows the buyer's stage: a ready buyer gets a line, a cold buyer gets the first scene of a longer piece.
3. Write a second opening using the paired lead (last column), not a rewording of the first.
4. State what the close must return to so the piece ends where it promised.

| Lead | Best for a buyer who | Opens with |
|---|---|---|
| Deal first | knows the product and wants it | The best part of the deal, then what it is worth, then the real reason it exists, then the guarantee |
| Headline benefit | knows the product, has not decided, or is comparing | The biggest believable benefit, backed in the next sentence; smaller if the market is tired of it |
| Problem to relief | has a named problem and is searching | The problem as they live it: the moment it bites, what they tried, what it costs; then the turn |
| Unknown fact | has the problem and doubts the usual answers | A true fact named in the first line and left unexplained; the body explains it. Only with a real fact |
| Fresh statement | is unaware or has heard every claim | Something they have not heard, said like news and proven straight away |
| Scene | is unaware, or knows the problem | One person, one place, one thing happening; it runs as long as the stage needs and answers its own question by the end |

Pairs that test well: problem to relief vs unknown fact (problem aware); fresh statement vs scene (unaware or crowded market); deal first vs headline benefit (knows the product); headline benefit vs problem to relief (comparing).

## Output
```
Buyer stage: ...
Lead A: <name> - why it fits (1 line)
Opening A: <text>
Lead B: <name> - why it differs (1 line)
Opening B: <text>
Close must return to: <1 line>
```

## Checks
- The two openings use different leads.
- Neither opening uses a fact, number or quote not in the supplied material.
- A scene written as "you" comes from what buyers say; a named customer or a founder moment appears only if it is on record.
- If buyer and market point to different leads, the buyer's awareness chose A.

## If something is missing
Write `MISSING: buyer stage` or `MISSING: proof` and pick the lead that needs no proof (scene or problem to relief). Never invent the fact an "unknown fact" lead needs.

## Avoid
- Two wordings of the same lead presented as two options.
- Opening on the product for a cold buyer.
- A deadline or count that is not real.
