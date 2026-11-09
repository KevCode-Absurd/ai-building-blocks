---
name: variance-analysis
description: Explains why a number moved, against budget, forecast or last period. Maps actual and budget lines, computes variances, keeps the ones that matter, splits revenue into price, volume and mix and costs into rate and quantity, tests whether each gap is timing, permanent or one-off, and writes a one-page report with a bridge that adds up to the cent, a waterfall chart spec and three to five actions. Use it for monthly budget versus actual, board and lender packs, or any "why did sales or margin drop?" question. Causes it cannot prove are marked as questions.
---

# Variance analysis

## When to use

- Monthly or quarterly budget versus actual review.
- A sales dip or spike, or a margin that moved, and the owner wants the reason.
- A board, lender or investor pack that needs a clear "why".
- Before a reforecast, to see which gaps will repeat.

It explains management numbers. It does not decide accounting treatment or tax. Check this with local rules and ask a qualified accountant if a variance comes from how something was recorded.

## What you need

1. Actuals for the period from the accounting software (profit and loss by line, by month).
2. The budget or forecast for the same period, or last period's actuals.
3. For price, volume and mix: units and revenue by product, site or channel for both periods.
4. For costs: quantity and rate where they exist (hours and pay rate, kilos and price per kilo).
5. The owner's notes on what happened: price changes, lost or won customers, closures, campaigns.
6. The threshold that counts as material for this business, if the owner has one.

**Access:** level 1 is enough for the analysis: reports or exports from the accounting software and the budget. Level 2 lets me save the variance report in your reporting tool without sharing it; level 3 lets me share it with the people you name, within your limits.

## Steps

### 1. Name the question

Which number, which two periods or versions, and how big is the change? Check both totals against the source reports before going further.

### 2. Map the lines

Budget and actual line names often differ. Build a mapping table and show it. Lines with no match on one side get their own row (new costs, dropped products).

### 3. Compute and filter

Variance = actual minus budget, in money and percent, favourable or unfavourable (for costs, higher is unfavourable). Keep lines above the owner's threshold plus the top five by money. If the owner has no threshold, ask; do not set one.

### 4. Split revenue into price, volume and mix

For each product line, using last period (or budget) as the base:
- **Volume effect:** (this period total units minus base total units) times base average price.
- **Mix effect:** for each line, (this period units minus this period total units times the line's base share of units) times (line's base price minus base average price), summed.
- **Price effect:** for each line, (this period price minus base price) times this period units, summed.
- New lines and dropped lines get their own rows.
Add volume, mix, price and the new and dropped rows. The sum must equal the total revenue change to the cent. If it does not, find the gap before writing anything else.

### 5. Split costs into rate and quantity

- **Quantity effect:** (actual quantity minus budget quantity) times budget rate.
- **Rate effect:** (actual rate minus budget rate) times actual quantity.
For margin, split into the sales effect and the cost effect the same way.

### 6. Test each gap

- **Timing:** it will reverse next month (an invoice landed early, a bill paid late).
- **Permanent:** it will repeat (a lost customer, a price rise from a supplier).
- **One-off:** it will not repeat and will not reverse (a repair, a bad debt).
Only permanent gaps change the full-year forecast.

### 7. Find causes, carefully

Rank the drivers by size. For each, write one plain sentence using only what the data and the owner's notes show. If the data only shows that two things moved together, write "linked with" and suggest a check.

### 8. Draft the waterfall

A waterfall chart spec from the start value to the end value through each driver, in the order of the bridge. Give it as a simple table (label, value, running total) the owner can paste into Excel, or a chart spec if asked.

### 9. Turn it into actions

Three to five actions, each with the money effect, risk, owner and date. Mark which need a decision from the owner.

### 10. Make it rerunnable

Write the formulas once in words and with the owner's column names, so the bridge can be rerun next month. At level 2, save the report as a draft in the reporting tool (level 2); share it only after the owner reviews it, with level 3.

## Checks

- Both totals tie to the source reports.
- The mapping table is shown.
- The bridge adds up to the total change exactly; no "other" bar hiding an error.
- Every cause is evidenced or marked "linked with" and a check.
- Each gap is labelled timing, permanent or one-off.
- The report carries: *Management analysis, not accounting or tax advice. Check this with local rules and ask a qualified accountant about how items were recorded.*

## Output format

1. Headline: the change, the top two drivers and the decision needed.
2. Variance table: line, budget, actual, variance, percent, timing, permanent or one-off, cause.
3. Price, volume and mix bridge (and rate and quantity for costs).
4. Waterfall table.
5. Actions: what, money effect, risk, owner, date.
6. Questions and checks to run.
7. Formulas with column names.

## Example of good output (short)

Illustrative structure, not a real business: a bike shop with two product lines. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.

> **Headline:** October revenue rose 7,700 against last October (44,000 to 51,700). Mix added 6,900 as buyers moved to e-bikes, volume added 1,100 (one more bike sold), and price took away 300 because e-bike discounts outweighed the road bike price rise.
>
> | Line | Units base | Price base | Units now | Price now | Revenue base | Revenue now |
> |---|---|---|---|---|---|---|
> | Road bikes | 30 | 800 | 25 | 820 | 24,000 | 20,500 |
> | E-bikes | 10 | 2,000 | 16 | 1,950 | 20,000 | 31,200 |
> | Total | 40 | 1,100 avg | 41 | | 44,000 | 51,700 |
>
> | Driver | Effect | Running total |
> |---|---|---|
> | Start (last October) | | 44,000 |
> | Volume: +1 unit at base average 1,100 | +1,100 | 45,100 |
> | Mix: road -5.75 units against base share at -300 from average; e-bikes +5.75 at +900 | +6,900 | 52,000 |
> | Price: road +20 x 25; e-bikes -50 x 16 | -300 | 51,700 |
> | Unexplained | 0 | 51,700 |
>
> **Timing, permanent or one-off:** the e-bike discount was a two-week promotion (one-off, owner's note). The shift to e-bikes has held for three months (linked with the new display; suggest checking sales by week before and after it went up).
>
> **Action:** price e-bikes back to list after the promotion (owner decides by 15 Nov).
>
> *Management analysis, not accounting or tax advice. Check this with local rules and ask a qualified accountant about how items were recorded.*
