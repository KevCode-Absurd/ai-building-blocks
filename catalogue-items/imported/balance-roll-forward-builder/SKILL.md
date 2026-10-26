---
name: roll-forward
description: Build a roll-forward schedule for a balance-sheet account — beginning balance plus activity less reversals equals ending balance, with each component tied to GL. Use for month-end close packages and audit support.
---

# Roll-forward

Given an account (or account group), entity, and period, produce a roll-forward that ties beginning to ending.

## Before you start

You need:

- The account or account group, the entity and the period.
- The beginning balance (prior-period close package, or GL balance at the prior-period end date).
- GL activity for the period (an extract, or the results of GL queries) and the GL ending balance.

Ask once for anything missing. Do not invent a balance, a query or a journal reference. If the user has no GL data yet, list the queries they should run (account + date range + journal-source filter) and stop.

A line with no real source is marked `unverified (no GL source given)`. It never gets a made-up citation.

## Structure

```
Beginning balance (per prior-period close)      X
  + Additions / new activity                    A
  + Accruals booked this period                 B
  − Reversals of prior accruals                (C)
  − Payments / settlements                     (D)
  ± Reclasses / adjustments                     E
  ± FX translation                              F
Ending balance (per GL at period end)           Y
```

Drop lines that do not apply to the account, and say they were dropped. Add a line if the account has a movement the layout does not cover.

## Tie each line

- **Beginning** — prior-period close package, or GL balance at prior-period end date.
- **Each activity line** — a GL query (account + date range + journal-source filter) via the GL system of record. Cite the query, or the row range in the extract the user gave you.
- **Ending** — GL balance at period-end date.

The schedule **must foot**: `X + A + B − C − D + E + F = Y`. If it doesn't, the gap is an unexplained item — surface it, don't plug it.

## If the entity reports in India

The companion files this skill once pointed to (`india-market-conventions`, `india-market-data`, `NOT-ADAPTABLE.md`) are not in this folder. These two rules are the part that matters. Use them when the entity is Indian, and ignore them otherwise.

- **Fiscal year is April–March.** `FY2025` = year ending **31 Mar 2025**; `Q1 FY26` = Apr–Jun 2025. Label periods `Q3 FY26 (Oct–Dec 25)`, never a bare calendar year.
- **Units are lakh (10⁵) and crore (10⁷).** Never use the Excel format `#,##0,," Cr"`: each trailing comma divides by 1,000, so it shows lakh under a crore label (a 100× error). Divide by `10000000` in a live formula and label the column `Balance (₹ Cr)`.

## Output

1. The roll-forward table with a "Ties to" column citing the GL query or document for every line, and a "Status" column (`tied` or `unverified`).
2. A foot check: pass/fail and the unexplained delta if any.
3. Open items: every unverified line, and the unexplained delta.

Next steps to state at the end:

- Foot check passes: the schedule can go in the close package. Say which lines still need a source before sign-off.
- Foot check fails: do not sign off. Re-check the period cut-off, the journal-source filter and missing postings on the unexplained delta, then rebuild.

No-tools note: this works in a plain chat. Paste the ledger rows and do the sums in a table. It needs no code.
