# New menu launch

**Trigger:** A seasonal menu change, a new opening or a menu rework after a menu engineering review.

**Cadence:** Once per menu, over two to four weeks before the launch date the owner sets.

**Access:** Level 1 is enough for costing and documents. Steps marked [L2] need read and draft access; [L3] steps need read, write and publish access within the client's limits (for example: "publish the approved menu and prices to the till and online ordering at one site on launch day; update the Google menu; no other changes").

## Steps

1. **Brief.** Agree the dish list, target food cost, price rounding, launch date and sites with the owner. List what the kitchen must test.
2. **Cost and price.** Run the `recipe-costing-and-menu-pricing` skill for every dish and sub-recipe. [L2] Save cards and the price list in a copy of the costing sheet. *Approval: the owner sets the final prices.*
3. **Allergen record.** Run the `allergen-matrix-draft` prompt from the final recipes and supplier labels. *Approval: the trained manager checks and signs the matrix; check this with your local food safety authority.* Nothing goes on a menu before this sign-off.
4. **Kitchen documents.** Run the `kitchen-checklists-prep-and-station-guides` skill: station guides for each new dish, new prep items and pars, and any new checks from the business's food safety system. [L2] Save drafts. *Approval: the head chef confirms the guides match the tested dishes.*
5. **Training.** Plan a tasting and a walk-through for each section; front of house learns descriptions, allergen answers and where the signed-off record lives.
6. **Build in the tools.** [L2] Build the new menu in the till with no channels assigned (Square) or saved but not published (Toast); draft the Google menu update; draft stock orders for launch week.
7. **Go live.** *Approval: the owner says yes to the list of live changes and, separately, to each launch stock order.* [L3] On launch day, publish the menu and prices to the agreed locations and channels, update the Google menu, deactivate old items (no deletion without a fresh yes) and log every change. Toast publishing cannot be undone with a button, so check the change list first.
8. **First two weeks.** Track sales mix, 86'd items, waste and comments daily. At the end of week two, run the `menu-engineering-and-food-cost-check` skill on the new dishes.

## Outputs

- Costed cards and a price list
- Draft allergen matrix for sign-off, then the signed record in use
- Station guides, prep pars and updated checklists
- Training plan
- Menu built and published in the till and online
- Launch stock orders for the owner's yes
- Two-week review with calls on each new dish

## Needs the client's approval

Final prices; the signed allergen record (trained manager); the station guides (head chef); the list of live changes; each stock order; deleting old items or menus; any supplier contract or new supplier. Paying invoices stays with the owner.
