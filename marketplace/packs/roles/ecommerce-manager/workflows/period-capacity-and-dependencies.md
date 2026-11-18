# Check growth plans against period capacity and dependencies

**Trigger:** any growth, trading, launch or recovery plan assigns work, dates, stock or cash across teams. Run before calling the plan feasible and again after changing its schedule.

## Build a schedule from the evidence

1. Record each owner's capacity, unit, source locator and source period. Preserve the stated period: weekly hours remain a limit for each week, even when the plan spans a fortnight or a month. Record the week boundaries, operating days and timezone; distinguish elapsed days from operating days. If boundaries or usable availability are unclear, label the schedule provisional and state the assumption. Do not silently prorate partial weeks or assume overtime.
2. Record existing commitments, leave, delivery work, QA and review time. Identify whether the source gives total capacity or capacity remaining after those commitments; count each commitment once. Missing owner capacity or task estimates stay unknown, never zero. Task estimates are planning assumptions unless independently evidenced.
3. Give every task a stable ID, named owner, deliverable, start/end, dependency, acceptance check and hours **in each source period**. A task spanning periods needs explicit allocations whose sum equals its task estimate. A date range alone is not an allocation; do not silently spread hours across it. Multiple owners need separate effort rows. Assignments in a period must agree with the dated task schedule.

## Verify the allocations

Use the existing portable tool, not mental arithmetic:

`node tools/commerce-math.mjs output/capacity-input.json`

The input is an object with `operation: "capacityPlan"` and `inputs` containing:

- `availability`: one row per owner and exact source period, with `owner`, `period`, `hours` and `source`.
- `assignments`: one row per task, owner and period, with `task`, `owner`, `period` and `hours`.

Save the input and result alongside the plan. Check `result.feasible`, every period's assigned/available/remaining hours and `result.violations`; a successful tool invocation (`ok: true`) alone does not mean the schedule fits. Retain the mapping from plan rows and source locators to the tool input. The tool checks the declared allocations, not their dates or evidence, so independently reconcile that mapping.

Show an owner-by-period table including periods with no work. Then reconcile each task's allocated hours and each owner's whole-plan totals. **Both checks must pass.** Spare capacity next week cannot cancel overload this week; spare capacity on another owner cannot cover work they cannot perform. An aggregate-only check cannot establish feasibility. Also check day-level deadlines where a weekly total could conceal an impossible sequence.

If any period is overloaded, explicitly defer, reduce scope, resequence or propose a qualified additional owner. Show the changed dates and dependent tasks, then recalculate. Extra people, overtime or spend are proposals until availability and authority are confirmed. Do not mark an overloaded or unknown schedule feasible.

## Preserve ecommerce constraints

- Sequence prerequisite work before dependent work; include QA and approval lead time. Moving a prerequisite moves the dependent launch unless a justified alternative exists.
- Check SKU/variant stock, reserved units, expected arrivals and fulfilment capacity at the planned launch date. Forecast receipts are not stock on hand; order counts are not physical inventory units. A task-hour pass does not prove delivery capacity.
- Check the cash available at each payment date, including prior commitments and supplier lead times. Forecast sales or ad-attributed revenue are not cash already collected. Lower ad spend does not instantly replenish inventory or remove fulfilment work.
- Keep decision conditions visible: a proposed offer, page or campaign is planned; a draft is prepared; a live change requires execution evidence; a revenue or margin improvement requires measured results. A feasible plan is not an achieved outcome or permission to change budgets.

## Deliver

Provide the dated task schedule, owner-by-period capacity table, reproducible capacity input/result, stock/cash dependency checks, and any unresolved assumptions or deferred tasks. The closing recommendation must agree with these artifacts. Report pending prerequisites and the evidence needed to unblock them; preserve the applicable access and approval limits.
