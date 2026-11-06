---
name: build-programme-and-look-ahead
description: Turns a scope, trade list and start date into a build programme with tasks in site order, durations from the builder's figures (estimates clearly marked), links, key dates such as inspections, long-lead deliveries and handover, and the critical path, as a table or Mermaid Gantt chart. Then rolls a two-week look-ahead by trade each week, showing what is ready and what is blocked by missing information, materials, access, permits or inspections, and records what got done. Use it at job start, when a job slips, or every week while on site.
---

# Build programme and look-ahead

## When to use

- At the start of a job, to build the programme from the scope.
- Every week on site, to roll the two-week look-ahead for trades.
- When the job slips, to re-plan and show the new finish date.
- To check a builder's programme before the client accepts it.

Not for structural, temporary works or safety sequencing decisions: those belong to the engineer, temporary works designer and principal contractor. The programme shows their dates; it does not set their method.

## Access needed

- **Level 1 (read):** the scope, drawings list, quotes, trade list, existing programme and site notes.
- **Level 2 (read and draft):** build or re-plan the programme in a copy; draft the look-ahead.
- **Level 3 (read, write and publish):** update progress and dates in the live programme and send the look-ahead to the named trades, within the confirmed limits. Moving a contract completion or sectional date needs a fresh yes.

## What you need

1. The scope (room by room or element by element) and drawings list.
2. The trades and who supplies each.
3. Start date, fixed dates (client moves, inspections, holidays, site hours) and any contract completion date.
4. Durations from the builder or trades, and lead times for windows, kitchens, steel, boilers and other long-lead items.
5. Permits and inspections needed. Check local rules.

## Steps

### 1. List the tasks in site order
Typical order for a house extension: set-up and welfare, demolition, groundworks and foundations, drainage, slab, walls, roof structure and covering (weathertight), windows and external doors, first-fix services, insulation, plaster, screed, second fix, kitchen and bathroom, decoration, external works, snagging, handover. Add inspection points as tasks (foundations, drainage, insulation and completion are common ones; confirm with building control).

### 2. Give each task a duration
Use the builder's or trade's figure. Where you must estimate, mark it [ESTIMATE] and say what it is based on. Add drying or curing time as its own task, not hidden inside the next one.

### 3. Link the tasks
For each task, write what must finish before it can start. Note overlaps (roof covering can start before all walls are finished on one elevation) as start-to-start links with a lag.

### 4. Add long-lead items and decisions
Work back from the date each item is needed on site: order date = needed date minus lead time minus any approval or submittal time. Add the client's decisions (tile choice, kitchen design sign-off) as dated tasks; late decisions are a common cause of delay.

### 5. Find the critical path
The longest chain of linked tasks sets the finish. Mark it. Note the float on near-critical tasks. If the finish misses a fixed date, show options (extra crew, re-sequencing, a phased handover) with what each costs in time or money; the client decides.

### 6. Present the programme
A table (ID, task, trade, duration, start, finish, depends on, critical yes or no, source of duration) or a Mermaid Gantt chart. Key dates in a short list at the top.

### 7. Roll the two-week look-ahead each week
From the programme, pull the next two weeks of tasks by trade. For each: dates, crew, materials and plant needed on site, information needed (open RFIs, drawings), access, permits and inspections to confirm. Mark each task **ready** or **not ready**, and for not-ready tasks, who clears the blocker by when. Only ready tasks are promised to trades.

### 8. Record what got done
At the end of the week, mark each planned task done or not done, and the reason for each miss (late material, weather, previous trade late, information, labour, client change). The share done is the week's percent plan complete; track it and the reasons over time.

### 9. Update the programme
Feed actual progress back into the programme. If the critical path has moved, say so in the weekly report with the reason and a new date. Every slip also goes in the delay log (see `site-reports-and-delay-log`).

## Checks

- Every task has a trade, a duration with its source, and links.
- Estimates are marked.
- Inspections, long-lead orders and client decisions are on the programme with dates.
- The critical path is marked and matches the reports.
- Not-ready tasks are not promised to trades.
- Any date the contract fixes is moved only with the client's yes.
- Structural, temporary works and safety sequencing are left to the right professionals.

## Output format

1. Key dates.
2. Programme table or Mermaid Gantt with the critical path marked.
3. Long-lead order dates.
4. Two-week look-ahead by trade, ready or not ready, with blockers and owners.
5. Weekly completion record and reasons for misses.

## Example

*Made-up business for illustration: Ashdown Build, a four-person builder in Sheffield, UK; single-storey rear extension.*

> **Key dates:** start Mon 2 Mar; weathertight Fri 3 Apr; handover Fri 22 May [ESTIMATE, depends on kitchen delivery].
>
> | ID | Task | Trade | Days | Depends on | Critical |
> |---|---|---|---|---|---|
> | 4 | Foundations, inspect, pour | Groundworker | 4 | 3 | Yes |
> | 7 | Roof structure and covering | Carpenter, roofer | 6 | 6 | Yes |
> | 8 | Bifold doors fit | Supplier | 1 | 7; order by 13 Feb (5-week lead) | Yes |
> | 10 | First-fix electrics | Electrician | 3 | 8 | No (2 days float) |
>
> **Look-ahead, w/c 16 Mar:** Bricklayer: walls to wall-plate, Mon-Thu, **ready** (bricks delivered 13 Mar). Carpenter: roof joists, Fri, **not ready**: steel beam calcs RFI-03 open with the engineer, answer needed by Wed 18 Mar (owner: Dan).
