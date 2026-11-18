# Cash numbers that stay tied to their ledger

Use for a cash reserve, first-breach, minimum-balance or funding-gap statement in an opportunity report. This tool calculates from declared inputs using the pack's existing cash calculator. It generates a complete HTML or Markdown cash section and can check that the same section survives in the final deliverable.

It does not authenticate a source, establish complete costs, check other report prose, verify a browser layout, or authorize spending. A matching section is not a whole-report pass.

## Prepare one explicit input

Copy `tools/cash-report-example.json` into `context/` and replace all illustrative values. Identify scope and dated source references. Use one declared currency and its verified minor-unit precision. Each scenario has its own opening cash, reserve and periods in chronological order. Payments include each dated commitment exactly once. Do not add revenue to cash receipts, repeat ad spend already in operating payments, mix currencies, silently truncate a horizon, or invent an unknown payment date.

Amounts finer than the declared minor unit are rejected rather than silently rounded. The calculator works in integer minor units, then presents currency values. Nonnegative receipts, payments and reserve are required; opening cash may be negative. It accepts up to 12 scenarios, 520 periods per scenario and one billion currency units per input amount. Unknown fields are rejected. Period labels must be unique within each scenario; chronological order is the caller's responsibility. Labels that could become spreadsheet formulas are rejected by CSV output.

## Build and use the generated section

```sh
node tools/cash-report.mjs build context/cash-input.json --out output/cash-v1
```

The new directory contains `facts.json`, `cash-ledger.csv`, `cash-section.html`, `cash-section.md` and `receipt.json`. Existing output directories are never overwritten. Only relative paths within the project are accepted; writes must be under `context/` or `output/`. Symlinks and junctions are rejected. This is a local tool, not a hostile concurrent-filesystem sandbox.

Insert the complete generated section, including its two comment markers, into the actual HTML or Markdown deliverable. Keep its text and tables unchanged; style its classes from outside the section if needed. Generate cash headlines and other numerical prose from the same `facts.json` values in code, instead of typing a date or amount twice. Regenerate after any input change. A decision table, headline or caption outside the generated section still needs an explicit, recorded comparison against the saved facts.

Key distinctions:

- Opening reserve shortfall is separate from a period-end breach.
- The first reserve breach is the first closing balance strictly below reserve. Equality is not a breach.
- The first negative cash period is separate from the first reserve breach. Zero is not negative.
- Lowest closing balance means the lowest period-end row; ties keep the first occurrence.
- Peak funding gap includes an opening shortfall. It is not the sum of weekly gaps.
- A period-end forecast does not establish sufficient cash on every day inside that period.

## Read the final file back

```sh
node tools/cash-report.mjs check context/cash-input.json --artifact output/decision.html --format html
node tools/cash-report.mjs check context/cash-input.json --artifact output/decision.md --format markdown
```

Run the matching command for every delivered format. Save its JSON output as a new receipt outside the checked artifact. `BOUND_CASH_SECTION_MATCH` means exactly one complete generated section matches current calculated facts, after CRLF normalization. Missing, duplicated, stale or edited sections return `CASH_SECTION_MISMATCH` and a failing exit code. Other edits, including contradictory figures outside the section, are not evaluated: `overallReportVerified`, `sourcesAuthenticated` and `unboundCashClaimsVerified` remain false.

Before handoff, independently recompute material source rows and inspect every cash statement in the delivered headline, narrative, summary table and answer. Record the source fact each uses and whether it matches. If an unbound statement cannot be checked, remove it or mark the deliverable incomplete. Do not claim a correct CSV proves a separately typed HTML table. Keep source, arithmetic, cross-artifact consistency and visual checks distinct.
