---
name: product-requirements-and-prototype-plan
description: Turns a physical product idea into a requirements document where every line has a measurable target, a test method and an owner, then plans prototypes in stages (looks-like, works-like, pre-production) with the question each stage answers, a budget line for the owner to approve, pass criteria and a results log. Flags anything that touches food, children, skin, heat, water, batteries or electricity for a qualified test lab or adviser early, and adds design-for-manufacture questions for the factory. Use it at the start of any new physical product, or when a project has samples but no agreed spec.
---

# Product requirements and prototype plan

## When to use

- An idea, sketch or handmade sample needs to become something a factory can quote.
- Samples keep changing because nobody wrote down what "right" means.
- An investor, partner or factory asks for the spec.
- Before paying for any production tooling.

## What you need

1. The idea in a few lines, and any sketch, photo, 3D print or sample.
2. Who uses it, where, how often, and how it is cleaned and stored.
3. Target retail price and first order quantity.
4. Materials or finishes in mind, and any you want to avoid.
5. Countries of sale, and whether children will use it.
6. Packaging ideas.
7. Budget and timing for prototypes.

**Access:** level 1 to read your notes and files. Level 2 to write the document and plan in a copy. Level 3 to update the live tracker within your limits. Paying for prototypes stays with you.

## Steps

### 1. Write the purpose and users

One paragraph: what problem it solves, for whom, and what it replaces. Then the conditions of use: indoor or outdoor, temperatures, water, drops, dishwasher, contact with food or skin, who might misuse it (children, pets).

### 2. List requirements as testable lines

| ID | Requirement | Target | Test method | Who tests | Priority |
|---|---|---|---|---|---|

- Write targets as numbers with units or as pass/fail checks: "fits pans 24, 26 and 28 cm across, measured at the rim", "survives 20 drops from 1 m onto tile" (the owner sets the numbers; I never invent them), "no rattle when shaken".
- Must-have and nice-to-have in the priority column.
- Who tests: owner, factory, or a qualified lab.
- A line that cannot be tested gets rewritten or removed.

### 3. Flag lines for a lab or adviser

Mark every line touching food contact, children, skin, heat, water, batteries, electricity, flammability or chemicals. These need a qualified test lab or regulatory adviser to say which rules apply and how to test. Note the markets, because rules differ in the US, UK and EU. Use the `safety-and-labelling-question-list` skill to write the questions.

### 4. Add packaging and labelling needs

Pack size, protection in transit, retail or shipping box, and the information the label must carry, which the adviser confirms (for example the EU requires a type, batch or serial number and the manufacturer's contact details on consumer products).

### 5. Plan the prototype stages

| Stage | Question it answers | Method | Budget line (owner approves) | Pass criteria | Result |
|---|---|---|---|---|---|
| Looks-like | Is the size and feel right? | 3D print, foam, modified product | [owner to fill] | 5 target users hold it and pick the right size | |
| Works-like | Does the function work? | Rough functional build | [owner to fill] | Meets requirement IDs listed | |
| Pre-production | Can the factory make it to spec? | Production process and material | From factory quote | Meets all must-haves; lab tests passed where needed | |

Each stage ends with go, change or stop. No production tooling until works-like passes.

### 6. Add design-for-manufacture questions

Ask the factory, not the internet, for their rules, and note what to check: even wall thickness and draft on moulded parts; bend radius and flange length on sheet metal; tolerances that matter and those that do not; parts that can fit only one way; standard screws and hardware; how many separate parts and finishes the design needs.

### 7. Lay out the timeline

Stages, sample rounds, lab slots, decision points and buffers, with who decides at each gate. Lab slots go in before the production order, not after.

### 8. Keep a results log

Date, stage, sample ID, test, measurement, photo, pass or fail, decision. The log is what the factory and the lab will ask for.

## Checks

- Every requirement has a target, test method, owner and priority.
- No number I invented: targets come from the owner, the brief or a standard the adviser names, or are marked [owner to set].
- Lab and adviser flags are on every line that needs them.
- Prototype stages each answer one question, with pass criteria.
- No tooling before works-like passes.
- No safety, certification or material claims the brief did not give.
- Unknowns are listed at the top.

## Output format

1. Summary: product, users, price and quantity targets, markets.
2. Unknowns and assumptions.
3. Requirements table.
4. Lab and adviser flags.
5. Packaging and labelling needs.
6. Prototype plan table.
7. DFM questions for the factory.
8. Timeline with gates.
9. Results log template.

## Example of good output (short)

*Made-up business for illustration: "Hearth & Hollow", a silicone pan lid that fits three sizes and vents steam. Target retail $24, first batch 1,000, US and UK.*

> **Unknowns.** Lid material grade [to confirm with supplier]; dishwasher-safe claim [owner to decide, then test].
>
> | ID | Requirement | Target | Test method | Who tests | Priority |
> |---|---|---|---|---|---|
> | R1 | Fits three pan sizes | Seals on 24, 26 and 28 cm pans (owner's sizes) | Place on each pan; no gap visible; lid stays on with 20 degree tilt | Owner | Must |
> | R2 | Vents steam | Vent stays open while boiling; no spitting | Boil 1 litre of water 10 minutes with lid on | Owner | Must |
> | R3 | Food contact | Material suitable for food contact in US and UK | Supplier certificate and lab test as the adviser directs | Lab / adviser | Must, flagged |
> | R4 | Heat | No deformation at the oven temperature the owner sets | Oven test at that temperature for the time set | Lab | Must, flagged |
>
> **Stage gate.** Works-like lid must pass R1 and R2 on all three pans before any mould deposit is approved.
