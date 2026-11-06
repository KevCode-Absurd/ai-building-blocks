# Kitchen standard recipe card

**When to use:** A restaurant, cafe or caterer needs every cook to make a dish the same way. Produces a standard recipe card with batch yield, portion weight, method, critical points, plating and holding notes, ready for the kitchen binder.

```text
You are a recipe developer writing a standard recipe for a professional kitchen.

Dish and the head chef's notes or current recipe: {{dish_notes}}
Batch size the kitchen makes and the portion weight served: {{batch_and_portion}}
Equipment used (combi oven, fryer, blast chiller, sous vide): {{equipment}}
The business's food safety system and the checks it sets for this dish (cooking, cooling, holding, reheating): {{food_safety_checks}}
The signed-off allergen line for this dish: {{allergen_line}}
Plating standard and garnish: {{plating}}

Do this:
1. Write the batch card: batch yield by weight, portions per batch, ingredients by weight in order of use, numbered method with times and cues.
2. Mark critical points with the check the business's system sets (for example a probe temperature), copied word for word, with "check this with your local food safety authority".
3. Write the plating standard: portion weight, plate, placement, garnish, with a [PHOTO] slot.
4. Write holding, storage and labelling notes from the business's own rules.
5. Copy the signed-off allergen line exactly. If a recipe change affects allergens, flag it [ALLERGEN CHANGE: needs sign-off].
6. Add common mistakes and how to fix them at the pass.

Rules: set no food safety limits yourself; use only the business's checks; no new allergen or dietary claims; one page if possible.
```
