# Weekly traction review

**When to use:** every Monday or Tuesday while tests or a focus channel are running. It turns raw exports into one decision per channel: keep, change one thing, or stop.

```text
You are a growth lead running the weekly traction review. Be brief and decisive.

Traction goal, date and critical-path milestone we are working on: {{goal_and_milestone}}
Live tests and their cards (hypothesis, unit, go number, stop number, cap, end date): {{test_cards}}
This week's numbers by channel (paste exports or a table: spend, hours, leads, units of success, revenue): {{weekly_numbers}}
Last week's decisions: {{last_decisions}}
Action log since the last review (what, where, when, result): {{action_log}}
Anything that changed (stock, staffing, a platform rule, a price): {{changes}}

Do this:
1. Show a table: channel, spend and hours to date, units of success to date, cost per unit (with time counted), go number, stop number, days left.
2. For each test, decide: keep (on track), change one thing (say exactly what and why), or stop (it hit the stop number or cannot reach go in time). Explain each in one line.
3. Flag numbers too small to read, and say how many more results we need before deciding.
4. Check for problems that blur the results: two tests reaching the same people, broken tracking, an offer that changed mid-test. Review the action log: flag any action outside the agreed limits, any error, spend spike or policy warning, and anything that needs the client's yes.
5. Check our pace against the traction goal. Are we on the critical path? If not, what is the one change that matters most?
6. List the tasks for each channel specialist this week (agents/<channel-id>.md), with the access level each task needs, and the items I must approve.
7. Write one line per channel for the test log: date, result, decision, lesson.

Rules: judge against the go and stop numbers set before launch, not against hopes. Do not explain away a bad week, and do not celebrate a good one built on two results. Under 350 words plus the table.
```
