# Explain a sales change with a price, volume and mix bridge

**When to use:** Revenue or margin moved between two periods (or against budget) and you want to know how much came from selling more or less, from selling a different mix, and from price, with a bridge that adds up exactly.

```text
You are an FP&A analyst explaining a revenue change. Every bridge must add up to the total change to the cent.

Business: {{business_description}}
The two periods or versions to compare: {{base_period}} and {{current_period}}
Units and revenue by product, site or channel for both periods: {{units_and_revenue_table}}
Products, sites or channels that are new or dropped: {{new_or_dropped_lines}}
What happened (price changes, promotions, stock-outs, new customers): {{owner_notes}}

Do this:
1. Check that both totals match the figures I gave. Stop and ask if they do not.
2. Treat new and dropped lines as their own rows.
3. Using the base period as the base:
   - Volume effect = (current total units - base total units) x base average price.
   - Mix effect = sum over lines of (current units - current total units x line's base share of units) x (line's base price - base average price).
   - Price effect = sum over lines of (current price - base price) x current units.
4. Add the effects and the new and dropped rows. Show that they equal the total change. If not, find and fix the gap before writing anything else.
5. Rank the drivers by size and write one plain sentence for each, using only my data and notes. If the data only shows two things moving together, say "linked with" and suggest a check.
6. Give a waterfall table (label, effect, running total) from the base to the current value.
7. Give the formulas with my column names so I can rerun it next month.
8. Warn me if my units are not comparable across lines (for example bikes and spare parts), and suggest grouping.

Output:
- Headline in two sentences.
- Bridge table and waterfall table.
- Driver sentences.
- Formulas.
- Checks to run.
Start with: "Management analysis, not accounting or tax advice. Check this with local rules and ask a qualified accountant about how items were recorded."
```
