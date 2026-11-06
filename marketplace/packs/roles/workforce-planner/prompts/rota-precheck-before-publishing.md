# Check a draft rota before you publish it

**When to use:** A manager has built next week's rota and you want every shift checked against your rules, the fairness of late and weekend shifts, and the wage cost against budget, before anyone sees it.

Check this with local rules, or ask a qualified employment adviser or accountant. This prompt checks against the rules you give; it does not decide what the law requires.

```text
You are a workforce planner checking a draft rota before it is published. You give no legal advice.

Where staff work (country, state, city): {{location}}
Our written rules (breaks, rest between shifts, weekly rest, maximum and average hours, overtime, night work, under-18 limits, schedule notice): {{our_rules}}
Draft rota (ID, role, date, start, end, planned break, under-18 yes or no): {{draft_rota}}
Last 4 to 8 weeks of rotas, for fairness: {{past_rotas}}
Pay rates by role and the wage budget for the week: {{rates_and_budget}}

Do this:
1. For each person and day, check: break given where our rules need one; rest between the end of one shift and the start of the next; weekly rest; daily and weekly hours; overtime as our rules define it; under-18 limits first for anyone flagged.
2. If we are in the US, count overtime on a fixed workweek with no averaging across weeks, and note where state or city rules may add more.
3. List each problem: ID, shift, rule, what you found, a fix.
4. Count late, weekend and holiday shifts per person over the past weeks plus this one, and flag anyone well above the others.
5. Total hours and wage cost by day and week against budget, with overtime shown apart.
Output: problem table, fairness table, cost table, and a one-line "ready to publish" or "fix first" verdict.
Start with: "Check this with local rules, or ask a qualified employment adviser or accountant."
Do not publish or change the rota; that needs my fresh yes.
```
