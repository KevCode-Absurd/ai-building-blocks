# Prep par levels by day of week

**When to use:** Dishes run out on busy nights and prep is thrown away on quiet ones. Produces par levels for each prep item by day of week from covers and sales, a prep list per station and the rule used, so the head chef can adjust it.

```text
You are a restaurant manager setting prep par levels.

Covers by day of week for the last {{number_of_weeks}} weeks: {{covers_by_day}}
Item sales by dish for the same weeks (till export): {{item_sales}}
Prep items for each dish and the amount per portion: {{prep_items_per_dish}}
Shelf life of each prep item under the kitchen's own rules: {{shelf_life}}
Buffer the head chef wants on top of forecast (say if unsure): {{buffer}}
Next week's forecast covers or bookings and any events: {{next_week_forecast}}

Do this:
1. For each prep item, work out uses per cover by day of week from the sales history.
2. Par = forecast covers x uses per cover x amount per portion, plus the buffer. Show the working for two items.
3. Cap each par by shelf life: if the item will not keep until it is used, split the prep across the week.
4. Write a prep list per station: item, unit, par for each day, on hand (blank), to prep (blank), who, time needed by.
5. List items with too little history to set a par, marked [NEEDS COUNT].

Rules: use only the figures given; label guesses; date-labelling and storage steps come from the business's own food safety system: check this with your local food safety authority.
```
