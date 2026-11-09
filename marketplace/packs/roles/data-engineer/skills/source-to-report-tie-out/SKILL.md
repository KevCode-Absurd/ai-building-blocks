---
name: source-to-report-tie-out
description: Finds out why a report number does not match the source tool and fixes it for good - a lineage map from the report number back through mart, intermediate and staging models to the raw table and source tool, then a step-by-step tie-out of counts and totals at each hop for one fixed period and time zone, a ranked list of causes (filters, time zones, currencies, refunds, soft deletes, duplicates from joins or re-runs, late data, truncated loads), the model fix and a permanent test so it cannot drift again. Reading and querying is level 1; fixing models on a branch is level 2; deploying the fix is level 3. Use it when "the numbers don't match".
---

# Source-to-report tie-out

## When to use

- "Our Postgres revenue report never matches Stripe."
- Two dashboards show different customer counts.
- Monday's numbers always change by Wednesday.
- Before anyone trusts a new warehouse.

## What you need

1. The report number in question, the period and the screenshot or query behind it.
2. The source tool's own figure for the same period (Stripe balance report, Shopify sales report, the accounts), and how the source defines it.
3. The models or SQL between source and report, or read access to the project.
4. The time zone and currency of each system.
5. Access: level 1 to read and run read-only queries; level 2 to fix models on a branch; level 3 to deploy the fix within your limits.

## Steps

### 1. Pin one period

Pick one closed period (last full week or month) and the time zone. Write both definitions side by side: what the report counts and what the source counts (gross or net, refunds, fees, taxes, test transactions, currency).

### 2. Draw the lineage

Report number, then mart, intermediate and staging models, then the raw table, then the source object. One line per hop with the filter and join at each.

### 3. Tie out hop by hop

At each hop, for the same period, count rows and sum the measure. Start at the raw table against the source export. The first hop where the numbers change unexpectedly is where the cause lives.

### 4. Check the usual causes, in order

1. **Definitions:** gross vs net, refunds, fees, tax, discounts.
2. **Time zones:** source in local time, warehouse in UTC; BigQuery partition boundaries are UTC [17].
3. **Currencies:** mixed currencies summed without conversion.
4. **Deletes:** soft-deleted rows still counted, or hard deletes never captured [27].
5. **Duplicates:** a join that fans out rows; a re-run that inserted twice; an incremental model with no unique key [3][11].
6. **Late data:** refunds or conversions arriving after the load, with no lookback [3].
7. **Lost rows:** a sync or file limit cutting loads short [26].
8. **Test and internal records** counted in one system but not the other.

### 5. Prove the cause

Show the rows that explain the gap and their total. The explained differences should add up to the whole gap; if not, keep going.

### 6. Fix the model

On a branch (level 2): fix the definition, filter, join, key or lookback in the right layer. Re-run for the period and confirm the tie-out.

### 7. Add a permanent test

A singular dbt test or check that compares the mart total with the source total for a recent closed period, plus `unique` tests on keys that fanned out [1]. Set it to block reports if it fails.

### 8. Deploy and backfill (level 3)

Merge the fix through the client's pipeline. If past periods must be rebuilt, the backfill overwrites production data, so it needs a fresh yes, with time travel or a copy confirmed first [16][20].

### 9. Write it up

The gap, the causes with their amounts, the fix, the new test, and anything still unexplained.

## Checks

- One closed period and one time zone used throughout.
- Both definitions written side by side.
- Lineage drawn hop by hop.
- Explained differences add up to the full gap, or the remainder is stated.
- The fix sits in the right layer, with a permanent test.
- Backfills that overwrite data are flagged for a fresh yes.

## Output format

```
# Tie-out: [report number] vs [source], [period, time zone]
## Definitions side by side
## Lineage
## Hop-by-hop counts and totals
| Hop | Rows | Total | Change | Why |
## Causes and amounts (adding up to the gap)
## Fix, test and release steps
## Still unexplained
```

## Example of good output (short)

*Illustrative structure, not a real business: an online tutoring firm with Stripe payments and a Postgres reporting database. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> October revenue: report €48,920; Stripe net volume €46,310 (Europe/Dublin time). Gap €2,610.
>
> | Hop | Rows | Total | Change | Why |
> |---|---|---|---|---|
> | Stripe export | 1,874 | €46,310 | | Net of refunds |
> | raw_stripe.charges | 1,874 | €47,590 | +€1,280 | Raw holds gross charges; refunds sit in another table |
> | fct_payments | 1,903 | €48,920 | +€1,330 | Join to invoices fans out 29 charges paid across two invoices |
>
> **Causes:** refunds not subtracted, €1,280; join fan-out, €1,330; total €2,610, the whole gap.
> **Fix:** subtract refunds in `int_payments__net`; join on `charge_id` to a one-row-per-charge invoice table. **New test:** monthly net total equals the Stripe export within the agreed tolerance; `unique` on `charge_id` in `fct_payments`. Rebuilding September and earlier overwrites those months and needs your yes.
