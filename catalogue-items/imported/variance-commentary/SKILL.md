---
name: variance-commentary
description: Write flux commentary for every P&L and balance-sheet line over threshold — current vs prior period and vs budget, with the driver explained from underlying activity. Use for the month-end close package and management reporting.
---

# Variance commentary

Given current-period actuals, prior-period actuals, and budget for the same scope, produce a commentary table.

<!-- needs: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## Before you start
Use the material below to do this job. If facts or tool access are missing, explain what you can finish and what must wait.

**What you need** (use your own material or the linked skill):
- **A spreadsheet** (yours): a spreadsheet with its data, formulas and charts.

**Makes it better (optional):**
- **Financial statements** (yours): the income statement, balance sheet and cash flow statement, for the periods you have.

How to start:
1. **Look first.** Use what they've already attached, pasted or put in their about-me note. In a coding assistant with file access, look in the project too for these by name.
2. **Check what's missing.** Look for a spreadsheet, financial statements. They can attach files, paste the details, or share a file path your assistant can read. Ask only for missing facts that change the result. If they ask you to start with what they have, complete the parts you can and mark the gaps.
3. **Do the job.** Follow the skill below with the facts and tools you have. Mark each gap with `MISSING:` where it belongs and never invent a fact to fill it.
<!-- /needs -->

## Threshold

Flag a line for commentary if **either** is true:

- Absolute variance ≥ the firm's materiality threshold (use the provided value; default 5% of the line or a fixed floor, whichever is greater)
- The line is on the "always comment" list (revenue, headcount cost, cash)

## For each flagged line

| Column | Content |
|---|---|
| **Line** | Account or caption |
| **Current / Prior / Budget** | The three values |
| **Δ vs prior** and **Δ vs budget** | Amount and % |
| **Driver** | One sentence explaining the movement from underlying activity — not a restatement of the number |

A driver explains *why*, not *what* (example only, not real data): "Cloud spend up $1.2M on incremental GPU reservations for the May launch" — not "Cloud spend increased $1.2M (18%)."

## Sourcing the driver

Look at the activity behind the line (journal-source breakdown, vendor mix, headcount delta, volume × rate). Use the detail the user pasted from their accounting system (for example a general ledger export). You do not need system access. If the driver isn't clear from the data, write "driver unclear — flag for controller" rather than inventing one.

## Output

The commentary table plus a short narrative (3–5 sentences) summarizing the period's biggest movers.

<!-- next: written by tools/add-needs.mjs for AI Blocks; not part of the original skill. Edit that tool, not this section. -->
## After this
When you've handed it back, suggest what they could do next in one short question. It's a suggestion: if they're done, that's fine. Offer these, and say they can type their own:
- The [Trailing year financial calculator](https://useaiblocks.com/skills/trailing-period-financial-bridge). It takes the document.
- The [Revenue growth currency checker](https://useaiblocks.com/skills/constant-currency-revenue-bridge). It takes the document.
- The [Extra week sales growth checker](https://useaiblocks.com/skills/extra-week-revenue-comparability). It takes the document.
- The [Monthly store profit reviewer](https://useaiblocks.com/skills/monthly-profit-close). It takes the document.
If they pick one and that skill is added here, carry straight on with what you just made. If not, give the link and say what to bring.
<!-- /next -->
