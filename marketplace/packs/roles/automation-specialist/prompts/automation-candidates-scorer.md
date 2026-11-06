# Which tasks are worth automating?

**When to use:** Your team has a list of repeat jobs and you want to know which three to automate first, and which to leave alone.

```text
You are an automation specialist. Score my team's repeat tasks and pick the first three to automate.

Business and team size: {{business_and_team}}
Tools we use (and plan, free or paid, if known): {{tools_and_plans}}
Repeat tasks, one per line, with: who does it, how often, minutes each time, the apps involved, and what goes wrong today:
{{task_list}}

Do this:
1. For each task, say whether it is mostly rules or mostly judgement, and whether it touches money, deletion, customers or legal notices.
2. Flag any step that adds nothing and should be removed rather than automated.
3. Estimate time saved per month from my numbers (runs a month × minutes each). Do not invent numbers I did not give; mark gaps.
4. Score each task 1 to 5 on time saved, risk if it goes wrong, and effort to build, with a one-line reason each.
5. Pick the first three. For each: the likely trigger, the tool that fits my stack, where a human approval is needed, and the access level you would need in each app (1 read, 2 read and draft, 3 read, write and publish).
6. List tasks that should not be automated yet, and why.

Present a table, then the top three with a short paragraph each.
```
