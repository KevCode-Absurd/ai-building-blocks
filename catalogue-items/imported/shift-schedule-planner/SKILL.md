---
name: hr-workforce-scheduling
description: "Help operations and HR teams build employee schedules, forecast staffing needs, and manage shift swaps and coverage. Use when asked to build a shift schedule, forecast staffing needs, create a rotation pattern, handle a shift swap request, or similar workforce scheduling tasks."
metadata:
  author: Tuan Duc Tran
  version: "1.0.1"
---

# HR workforce scheduling

Helps operations and HR teams forecast labor demand, design shift patterns, build fair schedules, and manage day-to-day schedule changes.

## Steps

1. Ask for what you need in one message: opening hours, expected demand (people needed per hour or a busy and quiet pattern), number of staff and their roles, allowed shift lengths, and any rules you must follow (rest between shifts, days in a row, local scheduling law). A current rota and complaints are optional. If a crisis or continuity plan is supplied, take the essential service windows, minimum safe coverage and working limits from it in place of asking again.
2. If an input is missing, write `MISSING: <what is needed>` and say which result depends on it. Do not invent demand figures, staff or rules.
3. Work out headcount. For each time block: people needed at once, times hours open, divided by hours per person per shift, plus a buffer for absence. Show the working. If the user gave no absence rate, ask or show the result with and without a buffer.
4. Pick a pattern (fixed, rotating, 4-on-3-off or similar) and give one line on why it fits.
5. Build the schedule as a table: staff in rows, days in columns, a shift code in each cell, and a key for the codes.
6. Share nights, weekends and holidays by one stated rule, such as "everyone takes the same number over 8 weeks". Show each person's count.
7. Write a one-page shift swap and open-shift policy: who can swap, who approves, the deadline and what happens if a shift is unfilled.
8. Write a short staff notice about the schedule or a change to it.
9. Check the schedule against each rule the user gave, as met, broken or not checked. Rules the user did not give are "not checked".

This is a planning aid, not legal advice. Rest-period and predictive scheduling rules differ by country and state. Ask an employment adviser before you publish schedules or notices.

## Supported tasks

- Forecasting staffing needs based on demand patterns
- Designing shift rotation patterns (fixed, rotating, DuPont, 4-on-3-off, etc.)
- Building weekly or monthly schedules balancing coverage and labor cost
- Writing shift swap and open-shift policies
- Calculating required headcount from forecasted demand and shift length
- Drafting on-call and standby scheduling rules
- Designing fair rotation for undesirable shifts (nights, weekends, holidays)
- Communicating schedule changes to employees
- Building scheduling policies compliant with predictive scheduling laws
- Auditing schedules for compliance with rest-period requirements
- Creating manager guides for schedule approval and exception handling
- Designing scheduling rules for multi-site or multi-department coverage

## Key prompts

### Forecasting and demand planning

1. "Forecast staffing needs for [department] based on [demand pattern/historical data description]."
2. "Calculate required headcount for [X] concurrent coverage across [shift length] shifts."
3. "Identify peak demand windows for a [industry] business operating [hours]."
4. "Build a staffing model accounting for seasonal demand swings."
5. "Estimate the buffer needed to cover expected absenteeism in the schedule."

### Schedule design

1. "Design a rotating shift pattern for a 24/7 operation with [number] of teams."
2. "Create a fair rotation for weekend and holiday shifts across a team of [X] employees."
3. "Build a weekly schedule template balancing coverage needs and labor cost."
4. "Design an on-call rotation policy with clear response-time expectations."
5. "Draft rest-period rules to ensure compliance between consecutive shifts."

### Policy and communication

1. "Write a shift swap policy including approval steps and deadlines."
2. "Draft a predictive scheduling notice compliant with [jurisdiction] requirements."
3. "Create a message to employees announcing next month's schedule."
4. "Write a policy for handling last-minute call-outs and finding coverage."
5. "Draft an escalation process for unfilled open shifts."

## Tips

- Publish schedules as far in advance as possible; some jurisdictions legally require it (predictive scheduling laws).
- Build in rest-period buffers between shifts to avoid fatigue and compliance violations.
- Rotate undesirable shifts fairly and transparently to reduce turnover and grievances.
- Track no-show and swap patterns to spot systemic coverage gaps early.

## Common mistakes

- Scheduling back-to-back shifts that violate minimum rest requirements ("clopening").
- Publishing schedules too close to the shift start, especially where predictive scheduling laws apply.
- Letting shift swaps happen informally without manager visibility, causing coverage gaps.
- Ignoring seasonal demand data and overstaffing or understaffing predictably busy periods.
