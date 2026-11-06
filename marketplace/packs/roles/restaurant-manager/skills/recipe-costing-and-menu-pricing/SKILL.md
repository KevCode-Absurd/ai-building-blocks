---
name: recipe-costing-and-menu-pricing
description: Builds costed recipe cards from the client's recipes and supplier invoices - ingredient prices per gram or unit, trim and cooking yield, cost per portion, food cost percent at today's price - then sets menu prices at the owner's target food cost with their rounding rules, and checks which dishes move when an ingredient price changes. Use it for a new menu, a menu that has not been costed, a price review, or when a supplier raises prices. Publishes prices to the till or online menu only with level 3 access.
---

# Recipe costing and menu pricing

## When to use

- A new menu, a new dish or a menu that has never been costed.
- The owner wants prices that hit a target food cost.
- A supplier invoice shows a price rise and the owner asks what it does to the menu.
- Catering packages or set menus need a cost per head.

Do not use it to sign off allergens or food safety, write menu descriptions, set tax treatment or decide prices for the owner. The owner chooses the price; I show the numbers behind it.

## Access needed

- **Level 1 (read):** recipes, supplier invoices or price lists, the till's item list and prices, and the last stock count.
- **Level 2 (read and draft):** costed cards and a price list in a copy of the costing sheet; new prices saved but not published in the till (Square: menu with no channels assigned; Toast: saved, not published).
- **Level 3 (read, write and publish):** update the live costing sheet, and publish the approved prices to the agreed till locations and online channels. The owner approves the price list first.

## What you need

1. Each recipe with quantities, batch yield and portion size. Photos of handwritten cards are fine.
2. Supplier invoices from the last one to two months, with pack sizes.
3. Yields for trimmed or cooked items (meat, fish, produce) if the kitchen has measured them. If not, I state the figure I used so the owner can replace it with a test.
4. The owner's target food cost percent and rounding rules (for example, end in .00 or .50).
5. Whether menu prices include sales tax or VAT, and the rate, as the owner's accountant set it.
6. The allergen line for each dish from the business's signed-off record. I copy it; I do not create it.

## Steps

### 1. Build the ingredient price list
One row per ingredient: supplier, pack size, pack price, invoice date, price per gram, millilitre or unit. Flag any price older than three months (or the owner's own limit) as "old price" and any ingredient with no invoice as "Needs answer".

### 2. Add yield
For anything trimmed, boned, peeled or cooked down, record usable yield as a percent and divide the purchase price by it to get the usable price. Show the yield on the card so the owner can change it after a yield test (weigh before and after trimming one batch).

### 3. Cost sub-recipes first
Sauces, dressings, stocks and doughs get their own batch card with batch yield and cost per gram. Main cards then use the sub-recipe's cost per gram.

### 4. Cost each dish
Quantity times usable price for every line, including the side, garnish and anything served with it. Add the owner's allowance for oil, salt and seasoning if they use one, labelled as their figure.

### 5. Work out food cost percent
Cost per portion divided by the menu price excluding sales tax or VAT. Show both the price on the menu and the net price used.

### 6. Price to target
Net price at target = cost per portion divided by the target percent. Add tax back if prices include it, then round the owner's way. Show the food cost percent and the cash margin (net price minus cost) at the rounded price. Flag dishes where the target price looks far from the prices the owner describes for their area, rather than forcing the number.

### 7. Price change check
When an invoice moves, list each affected ingredient, the old and new price, every dish that uses it, and the new cost per portion and food cost percent. Rank dishes by cash lost per week (cost change times weekly sales).

### 8. Publish or hand over
At level 3, publish the prices the owner approved to the agreed locations and channels, and log each change. Otherwise hand over the cards and the price list.

## Checks

- Units match on every line (grams with price per gram, not per kilo).
- Every price has an invoice date; old prices are flagged.
- Yields are shown and labelled as measured or assumed.
- Sub-recipe costs flow into the dishes that use them.
- Food cost percent uses the net price, not the price with tax.
- The rounded price is the owner's rule, and the resulting percent is shown.
- Allergen lines are copied exactly from the signed-off record: check this with your local food safety authority.
- Nothing was published without level 3 access and the owner's approved price list.

## Output format

1. Ingredient price list (supplier, pack, price, date, unit price, flags)
2. One costed card per dish (lines, yield, cost per portion, food cost percent, margin, allergen line)
3. Price table: dish, cost, current price, current percent, price at target, rounded price, new percent, margin
4. Price change table when relevant
5. Open questions marked "Needs answer"

## Example of good output (short)

*Made-up business for illustration: Harbour Lane Bistro, 40 covers, target food cost 28%, prices include VAT at 20% (owner's figures).*

> **Card: Roast hake, new potatoes, samphire, brown shrimp butter (1 portion). Card date 6 Nov.**
>
> | Ingredient | Qty | Usable price | Yield | Cost |
> |---|---|---|---|---|
> | Hake fillet (£18.00/kg, invoice 28 Oct) | 160 g | £21.18/kg | 85% (assumed, test due) | £3.39 |
> | New potatoes (£1.40/kg) | 200 g | £1.47/kg | 95% | £0.29 |
> | Samphire (£24.00/kg) | 30 g | £24.00/kg | 100% | £0.72 |
> | Brown shrimp butter (batch card, £16.00/kg) | 25 g | | | £0.40 |
> | Lemon, oil, salt (owner's allowance) | | | | £0.12 |
> | **Cost per portion** | | | | **£4.92** |
>
> Menu price £19.00, net £15.83: food cost 31.1%, margin £10.91.
> At 28%: net £17.57, with VAT £21.09; owner rounds to £21.00: food cost 28.1%, margin £12.58.
> Allergens (copied from signed-off matrix, 2 Nov): fish, crustaceans, milk.
> **Needs answer:** hake yield test; shrimp butter batch card last costed in August.
