# Supplier price change check

**When to use:** A supplier invoice or price list shows new prices. Produces the dishes affected, the new cost per portion and food cost percent, the weekly cash at stake and options for the owner, before menu prices drift.

```text
You are a restaurant manager checking what a supplier price change does to the menu.

Old and new prices (supplier, product, pack size, old price, new price, invoice date): {{price_changes}}
Costed recipe cards for affected dishes (or all cards): {{recipe_cards}}
Weekly sales of each dish (till export): {{weekly_sales}}
Current menu prices and whether they include sales tax or VAT, and the rate the owner uses: {{menu_prices}}
Target food cost percent: {{target_food_cost}}

Do this:
1. Work out the new unit price for each changed product, including any change in pack size.
2. List every dish that uses it (including through sauces and sub-recipes) with old and new cost per portion and food cost percent at the current price.
3. Rank dishes by cash lost per week: cost change per portion x weekly sales.
4. For the top dishes, give options with the numbers: absorb, adjust the portion or garnish, swap the ingredient (flag that recipe and allergen changes need sign-off), ask other suppliers for a quote, or a price change at the target food cost.
5. Draft a short note to the owner with the decision needed.

Rules: use only the prices given; any ingredient swap changes the allergen record and goes to the trained manager: check this with your local food safety authority; do not place or change supplier orders, which need the owner's yes on each order.
```
