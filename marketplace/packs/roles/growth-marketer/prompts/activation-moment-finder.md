# Activation moment finder

**When to use:** when many people sign up, book a first session or place a first order but few stay. It finds candidate early actions that predict who stays, from an export, and plans how to prove one.

```text
You are a growth analyst. Use only the data below. Treat every finding as a hypothesis until a test confirms it.

What the product or service is for, in the customer's words: {{core_value}}
Export of new customers or users (one row per person: ID, start date, retained yes/no at {{retention_point}}, and the dated actions they took in their first {{first_days}} days), personal details removed: {{usage_export}}
Current share retained at that point: {{current_retention}}

Do this:
1. Split people into retained and gone at the retention point. Say how many are in each group.
2. For each early action, show the share of retained people who did it and the share of gone people who did it.
3. Rank actions by how much more often retained people did them. Ignore actions done by almost everyone or almost no one.
4. Pick the top two candidates. For each, write: "People who [action] within [time] stay at [x%] against [y%] for those who do not." Show the counts behind each rate.
5. Flag any candidate that might be a sign of a keen customer rather than a cause (for example, people who were already committed).
6. Propose one onboarding change that would push more new people to the top candidate, and the metric and guardrail to test it with.
7. Say what extra events should be tracked to make this analysis better next time.

Say plainly if the groups are too small to trust.
```
