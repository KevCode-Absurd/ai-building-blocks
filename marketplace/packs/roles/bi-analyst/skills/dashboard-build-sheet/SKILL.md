---
name: dashboard-build-sheet
description: Writes a complete build sheet for one dashboard in the client's tool (Power BI, Data Studio, Metabase, Tableau, Excel or Google Sheets) - purpose and questions, sources and joins, a star-schema model, every measure in the tool's own syntax with a worked check, page layout, refresh, access and a test list that ties dashboard numbers to source totals. Use it before building a new dashboard, when moving a spreadsheet dashboard into a BI tool, or when a freelancer needs a spec to quote and build from.
---

# Dashboard build sheet

## When to use

- A new dashboard is wanted and the metrics are agreed (or can be agreed in the same job with the `metric-definition-sheet` skill).
- A many-tab spreadsheet dashboard is being moved into Power BI, Data Studio or Metabase.
- A freelancer or in-house person will build, and needs a spec that leaves no guesswork.
- A capacity, utilisation or sales report needs the same layout every month.

## What you need

1. Who opens the dashboard, how often, and the three to five questions it must answer.
2. The agreed metric cards, or the reports used today.
3. For each source table: column list, 10 to 20 sample rows (personal details replaced by IDs), row count and date range.
4. The tool and licence the client already has (for Power BI: Free, Pro, PPU or capacity; for Data Studio: free or Pro).
5. Who may see what: all staff, managers only their branch, the board everything.
6. One or more totals the owner trusts (till Z-report, bank deposits, accounts) for the tie-out.

Access: level 1 to read existing reports and sources; level 2 to build in a copy or development workspace; level 3 to publish, set refresh and sharing.

## Steps

### 1. Purpose and questions

Write the readers, rhythm and questions at the top. Every chart must answer one question; a chart that answers none is cut.

### 2. Read every table

For each table note what one row means (the grain), its key, its date columns and its row count. Unclear columns become questions at the top of the sheet, not guesses.

### 3. Design the model

- Name each table as fact (events: sales lines, bookings) or dimension (things: date, product, staff, location).
- Split mixed tables. Keep one grain per fact table.
- Add a date table with full years and no gaps; list each date role (order, ship, appointment).
- Draw relationships: one-to-many from dimension to fact, single direction unless a reason is written down. Avoid many-to-many; if unavoidable, say rows without a match will drop.
- **Data Studio:** say where a blend is needed, its join type and keys, and add a row ID so identical rows do not collapse. Remember a blend stays in one report.
- **Excel or Sheets:** a raw tab you paste into, a clean tab with formulas, one pivot per question, a summary page.

Draw the model in Mermaid.

### 4. Write every measure in full

Use the tool's syntax: DAX for Power BI, calculated fields for Data Studio, custom expressions or SQL for Metabase, calculations for Tableau, SUMIFS or QUERY for sheets. Under each: one plain sentence, and how it treats refunds, blanks, cancellations and dates. Ratios divide summed parts (DIVIDE in DAX; SUM(a)/SUM(b) in Data Studio).

### 5. Work one measure by hand

Pick the most important measure, compute it on the sample rows by hand, and show the sum. If the measure and the hand result disagree, fix the measure before going on.

### 6. Lay out the page

Grid of tiles: the headline numbers top left with a comparison (last period, last year or target) and unit; trend next; detail and tables below. For each chart: type, fields, sort, filters and which slicers apply. Status needs a label or arrow as well as colour; chart marks need 3:1 contrast.

### 7. Refresh, freshness and access

- **Power BI:** schedule within the licence limit (8 a day on shared capacity, 48 on Premium, PPU or Fabric); name the failure-alert recipient; note that a schedule pauses after two months with no visits. RLS roles, the user-mapping table and who gets the Viewer role.
- **Data Studio:** freshness per source (Sheets defaults to 15 minutes, GA and BigQuery to 12 hours); owner's or viewer's credentials and why.
- **Licences:** state who needs which licence to view.

### 8. Write the test list

At least three dashboard numbers compared with source totals the owner can check, with a tolerance; a row-count check from source to model; one RLS test per role with a real account.

### 9. Build (level 2) and publish (level 3)

At level 2, build in a copy, development workspace or Power BI Project file and send the test results. At level 3, publish only after the owner approves the test list, then log what was published, where and when.

## Checks

- Every chart maps to a question; every question has a chart.
- Every column name comes from the brief or is marked [placeholder].
- No measure is missing; every ratio divides summed parts.
- One measure is worked by hand on sample rows.
- Grain stated for every fact table; relationships listed with direction.
- No target appears that the client did not give.
- Refresh, failure alert, access and licences are written down.
- No passwords or connection strings in the sheet.

## Output format

1. Purpose, readers, rhythm, questions
2. Open questions about the data
3. Sources table (table, grain, key, dates, rows)
4. Model diagram (Mermaid) and relationship list
5. Measures (syntax, meaning, edge cases)
6. Worked check
7. Page layout and chart specs
8. Refresh, freshness, access and licences
9. Test list
10. Build log (levels 2 and 3)

## Example of good output

*Illustrative structure, not a real business: a yoga studio with two rooms. Copy the shape, never the content: every fact comes from the client's own context. Figures only show the shape.*

> **Question 2:** Which hours sit idle? → Heatmap, hour × weekday, value = Utilisation %.
>
> ```dax
> Utilisation % =
> DIVIDE (
>     SUM ( Bookings[BookedPlaces] ),
>     SUM ( Classes[Capacity] )
> )
> ```
> Meaning: booked places as a share of places offered. Cancelled classes are removed from both parts; waitlist places are not counted.
>
> **Worked check (sample rows, Tuesday 07:00):** booked 9 + 6 = 15; capacity 20 + 20 = 40; 15 / 40 = 37.5%. Measure returns 37.5%. Pass.
>
> | Test | Dashboard | Source | Tolerance | Result |
> |---|---|---|---|---|
> | October class revenue | £18,420 | Booking system payout report £18,420 | £0 | Pass |
> | October bookings (rows) | 3,512 | Export row count 3,512 | 0 | Pass |
