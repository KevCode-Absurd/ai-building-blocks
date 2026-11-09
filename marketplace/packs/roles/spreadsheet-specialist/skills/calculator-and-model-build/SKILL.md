---
name: calculator-and-model-build
description: Designs a spreadsheet calculator or what-if model cell by cell - quote and price calculators, day-rate and job-cost sheets, trackers and three-case models - with an inputs block, a rates table, workings and outputs, every formula written for its exact cell in Excel or Google Sheets, drop-downs and limits on inputs, protected formula cells, built-in checks and a worked example that proves the maths. Use it when a business wants to change one input and see the answer safely.
---

# Calculator and model build

## When to use

- A trade or service business quotes every day and the prices live in someone's head or in old emails.
- An owner wants a day rate or job cost from labour, overheads and margin.
- A what-if model with plan, cautious and stretch cases side by side.
- A register or tracker that volunteers or staff will fill in.
- An existing sheet needs rebuilding so a non-expert can use it.

Not for tax, payroll or legal calculations, or loan and investment advice; those need a qualified adviser.

## What you need

1. The outputs: what the user must see at the end (quote total, margin, day rate, monthly cash).
2. The inputs a user will type each time (job size, quantity, hours, options).
3. The rates and rules: price lists, labour rates, minimum charges, discounts, VAT or sales tax treatment as the business applies it. Anything missing becomes a marked input, never a guess.
4. Who will use it, on which tool and version (Excel 365, Excel 2019, Google Sheets), on which device.
5. Two or three real past jobs with known answers, to test against (masked if needed).
6. Access: level 1 for steps 1 and 2. Building in your Drive or OneDrive needs level 2 (a copy); replacing a live sheet or changing who can edit needs level 3.

## Steps

### 1. Write the logic in words

One line per calculation, in order: "Labour cost = hours × hourly rate. Materials = area × rate per square metre, minimum 1 unit. Subtotal = labour + materials + call-out fee. Margin applied on subtotal. Tax added last." Confirm it with the owner before building.

### 2. Lay out the sheet

- **Inputs** at the top (or on an Inputs tab), coloured one way, each with a label and unit.
- **Rates table** as an Excel table or a clearly bounded range, each rate with a "checked on" date.
- **Workings** in the middle, one calculation per row, labelled.
- **Outputs** at the bottom or on their own tab, formatted for the customer or owner.
- **Notes** tab: purpose, how to update rates, known limits, change log.
Name key cells and ranges (HourlyRate, MinCharge) so formulas read like the logic.

### 3. Write each formula for its exact cell

Use the clearest function the user's version supports: XLOOKUP for rates, SUMIFS for totals, IFS for tiers, LET to name parts of a long formula. If anyone has Excel 2019 or older, use INDEX and MATCH and plain IF instead. Write each formula out in full with the cell it goes in.

### 4. Guard the inputs

Drop-downs for choices; limits on numbers (no negative hours, area under a sensible maximum the owner sets); a message when a required input is blank. Use Stop alerts where a wrong entry would make a wrong price.

### 5. Build the checks

Visible checks on the output: inputs complete, totals reconcile, margin above the owner's floor, no negative values. Show a plain message ("Enter the job size") instead of an error code.

### 6. Add cases (for what-if models)

A case switch (Plan, Cautious, Stretch) that picks a column of assumptions with XLOOKUP or INDEX. Show the three cases side by side on the output, with every assumption visible.

### 7. Run the worked example

Use a real past job. Show each step from inputs to final price with the numbers. The sheet's answer must match the hand calculation to the penny. Then test edge cases: minimum job, largest job, a blank input, every option on.

### 8. Protect and hand over (level 3 to put it live)

Clear the Locked setting on input cells only, then protect the sheet so formulas cannot be typed over (this stops accidents; it is not security). In Google Sheets, protect formula ranges with "Restrict who can edit". Fill in the notes tab.

## Checks

- Every rate and rule comes from the owner or is a labelled input.
- The worked example matches by hand, to the penny.
- Edge cases behave: blanks show a message, not an error.
- Functions match every user's version.
- Inputs are validated; formula cells are protected.
- Rounding happens where the business rounds (per line or on the total), stated in the notes.
- Nothing gives tax or legal advice; tax rates are inputs the owner confirms with their accountant.

## Output format

1. **Logic in words**, numbered.
2. **Layout:** tabs and blocks with cell ranges.
3. **Formula cards:** cell, formula, what each part does.
4. **Validation and protection** settings, cell by cell.
5. **Checks** with formulas.
6. **Worked example** step by step, plus edge-case results.
7. **Notes tab** text.

## Example of good output (short)

*Illustrative structure, not a real business: a window cleaning firm quoting homes by window count. Copy the shape, never the content: every fact comes from the client's own context.*

> **Logic.** Price = MAX(minimum charge, windows × rate for the property type) + conservatory fee if chosen; 10% off for a 4-weekly round.
>
> **Formula card, Output!C8 (quote before discount):**
> `=LET(base, Inputs!C5*XLOOKUP(Inputs!C4, Rates[Type], Rates[Per window]), con, IF(Inputs!C6="Yes", ConservatoryFee, 0), MAX(MinCharge, base)+con)`
> base = windows × the rate for the chosen property type; con = conservatory fee if ticked; MAX keeps small jobs at the minimum charge.
>
> **Worked example.** Semi-detached, 14 windows, rate 2.00, conservatory yes (fee 8.00), minimum 15.00, 4-weekly. Base 28.00; plus 8.00 = 36.00; less 10% = 32.40. Sheet shows 32.40.
>
> **Edge case.** 5 windows at 2.00 = 10.00, so the minimum charge of 15.00 applies.
