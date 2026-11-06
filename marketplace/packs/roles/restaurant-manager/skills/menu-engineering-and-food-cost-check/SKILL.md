---
name: menu-engineering-and-food-cost-check
description: Sorts each dish by cash margin and popularity from the till's sales mix (stars, plowhorses, puzzles, dogs) with a keep, reprice, rework or cut call for each, and runs a weekly or monthly food cost check - actual food cost from opening stock, purchases and closing stock against the expected cost from recipe cards and items sold - with the likely causes of the gap ranked. Use it for a menu review, when food cost runs above target, or at each month end. Needs costed recipe cards; reads at level 1 and changes the menu only with level 3 access and the owner's approval.
---

# Menu engineering and food cost check

## When to use

- A menu review before a seasonal change.
- Food cost is above the owner's target and nobody can say why.
- Month end, as a routine check on food cost.
- The owner wants to know which dishes earn their place.

Do not use it to judge individual staff, accuse anyone of theft, or give tax or accounting advice. The arithmetic here is a management check, not the accounts.

## Access needed

- **Level 1 (read):** item sales by dish for the period, costed recipe cards, stock counts, purchase invoices and credit notes, waste log.
- **Level 2 (read and draft):** the analysis and a proposed menu in a copy; menu changes saved but not published.
- **Level 3 (read, write and publish):** publish approved menu changes (moves, renames, removals, prices) to the agreed till and online channels, and update the live costing sheet. Cutting a dish from the till deletes nothing: I deactivate it unless the owner gives a fresh yes to delete.

## What you need

1. Item sales by dish for the same period as the stock counts (four weeks or a calendar month works well).
2. A costed card for every dish sold (use the `recipe-costing-and-menu-pricing` skill first if any are missing).
3. Opening and closing stock counts valued at cost, from the same counting method both times.
4. All food purchase invoices and credit notes for the period, plus any transfers between sites.
5. Food sales for the period, excluding sales tax or VAT, and excluding drinks.
6. The waste log, staff meal log and comps or voids report if they exist.

## Steps

### Menu engineering

1. **Group by section.** Starters with starters, mains with mains. Comparing a dessert with a main tells you nothing.
2. **Work out each dish's numbers.** Units sold, net price, cost per portion, contribution per plate (net price minus cost) and total contribution (contribution per plate times units sold).
3. **Set the popularity bar.** Share of the section's units for each dish, compared with an equal share (1 divided by the number of dishes in the section). Say which bar you used; some owners set it a little lower.
4. **Set the profit bar.** The section's average contribution per plate, weighted by units sold (total contribution divided by total units).
5. **Sort.** Star: high contribution, high popularity. Plowhorse: low contribution, high popularity. Puzzle: high contribution, low popularity. Dog: low on both.
6. **Make one call per dish.** Stars: keep, protect the recipe and the plate. Plowhorses: re-cost first (portion, garnish, supplier), then consider a small price move. Puzzles: change position, name, description or what staff recommend before cutting. Dogs: rework or cut, unless the dish serves a purpose the owner names (a vegan main, a child's plate).
7. **Check the knock-on.** If a dish is cut, which prep items and stock lines become waste?

### Food cost check

1. **Actual food cost** = opening stock + purchases - credit notes +/- transfers - closing stock. Actual food cost percent = actual food cost divided by food sales.
2. **Expected food cost** = for each dish, units sold times cost per portion, added up. Expected percent = expected cost divided by food sales.
3. **The gap** = actual minus expected, in money and in percentage points.
4. **Rank the likely causes** and test the cheap ones first: invoices dated to the wrong period or missing; counting errors (units, missing areas, a different counter); recipe cards out of date; portions bigger than the card; logged and unlogged waste; staff meals and comps not recorded; price rises not yet on the cards; and only then possible theft, which goes to the owner privately with the evidence.
5. **Size each cause** where the records allow (for example, the invoice total misdated, or waste log value). Label any estimate as an estimate.
6. **Recommend fixes** with an owner and a date: fix the paperwork, run a portion check at the pass, add a waste log line, re-cost the cards.

## Checks

- Sales, counts and invoices cover exactly the same dates.
- Food sales exclude tax and drinks; drink costs are not in food purchases.
- Every dish sold has a card; missing ones are listed.
- Dishes are compared within their section only.
- The bars used for popularity and profit are stated.
- Causes are ranked by evidence, with estimates labelled; nobody is named without evidence.
- Food safety and allergen effects of any reworked dish go to the trained manager: check this with your local food safety authority.
- Live menu changes only at level 3, as approved, and logged.

## Output format

1. Menu engineering table per section: dish, units, share, net price, cost, contribution, total contribution, group, call
2. Food cost check: the arithmetic, actual and expected percent, gap
3. Causes ranked, with evidence and size
4. Three to five fixes, each with an owner, date and measure
5. Missing data marked "Needs answer"

## Example of good output (short)

*Made-up business for illustration: Copperleaf Cafe, October.*

> **Mains (1,000 sold; equal share 25%; average contribution £8.71)**
>
> | Dish | Sold | Share | Net price | Cost | Contribution | Group | Call |
> |---|---|---|---|---|---|---|---|
> | Burger | 420 | 42% | £12.50 | £3.90 | £8.60 | Plowhorse | Re-cost bun and fries portion |
> | Fish and chips | 380 | 38% | £14.00 | £5.10 | £8.90 | Star | Keep |
> | Mushroom risotto | 90 | 9% | £13.00 | £2.60 | £10.40 | Puzzle | Move to top of section, staff recommend it |
> | Lamb shoulder | 110 | 11% | £18.50 | £11.40 | £7.10 | Dog | Rework with a cheaper cut or cut |
>
> **Food cost:** £3,200 opening + £11,400 purchases - £2,900 closing = £11,700. Food sales £33,000: actual 35.5%. Expected from cards: £10,230, 31.0%. Gap: £1,470, 4.5 points.
> **Likely causes:** (1) Two invoices dated 30 Oct for goods delivered 3 Nov, £620: check with the supplier. (2) Fries portion weighed at the pass averaged 180 g against a card of 150 g. (3) Waste log £310, mostly bread. (4) Staff meals not logged.
> **Needs answer:** was the closing count done before or after the Friday delivery?
