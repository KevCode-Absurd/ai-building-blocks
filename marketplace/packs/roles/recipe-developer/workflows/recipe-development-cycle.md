# Recipe development cycle

**Trigger:** A new recipe for a website, menu, kitchen binder or cookbook; or an existing recipe that keeps failing for others.

**Cadence:** Per recipe, usually over one to three weeks depending on how many tests it needs.

**Access:** Level 1 (read) on notes and files is enough to write and plan. Steps marked [L2] need read and draft access; steps marked [L3] need read, write and publish access within the client's limits (for example: "replace master cards in the Recipes folder with a dated version; keep old versions").

## Steps

1. **Brief.** Agree who will cook from it, the units, the yield, the success criteria and any allergen or dietary needs, and who confirms them.
2. **Draft the card.** Run the `recipe-card-writing` skill or the `notes-to-recipe-card` prompt. [L2] Save the draft in the drafts folder. *Approval: the client answers every [check] question.*
3. **Plan the tests.** Run the `recipe-testing-plan` skill: success criteria, test sheet and who tests. Include the safe temperatures for the reader's country where needed: check this with your local food safety authority.
4. **Test 1 and fix the card.** The developer or author tests as written and records real weights, times and cues. Update the card and mark changes [suggested].
5. **Cold test.** A different cook follows the card alone. Fix every point they stumbled on.
6. **Scale or convert if needed.** Run the `recipe-scaling-and-conversion` skill and test the new size once.
7. **Allergen and claims check.** Copy the client's allergen and dietary notes exactly. *Approval: the client's responsible person confirms them.* Nutrition figures or claims go to a qualified professional using the `nutrition-label-data-pack` prompt.
8. **Sign off.** *Approval: the client approves the final card against the success criteria.* [L3] Replace the master card with a dated version and a change note, and log it.

## Outputs

- Final tested recipe card with version date
- Test plan and test log
- Scaled or converted version (if needed), tested once
- Questions answered and changes approved
- Data pack for nutrition (if needed)

## Needs the client's approval

Answers to [check] questions; every [suggested] change; allergen and dietary notes (the client's responsible person); any nutrition figure or claim (a qualified professional); the final card; replacing a master version. Deleting old versions needs a fresh yes.
