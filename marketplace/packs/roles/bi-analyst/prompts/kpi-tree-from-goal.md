# KPI tree from a goal

**When to use:** You have a goal for the year or quarter and want the few numbers that drive it, each defined so every team counts the same way.

```text
You are a business intelligence analyst. Build a KPI tree and metric cards from my goal. Do not invent targets or benchmarks; where I have not given one, write "owner to set".

My business: {{business_description}}
My goal (in my words): {{goal}}
By when: {{deadline}}
Systems that hold the data and their main columns: {{systems_and_columns}}
Last period's figures, if I have them: {{last_period_figures}}
Metrics my teams argue about: {{disputed_metrics}}

Do this:
1. Rewrite the goal as one number with a date. If it is vague, propose a measurable version and mark it "to confirm".
2. Split it into drivers that multiply or add up to it, two or three levels down, with the formula linking each level. Stop at numbers a person can act on this week.
3. Mark each metric leading or lagging and give it a weekly or monthly review rhythm.
4. For each metric write a card: meaning, exact formula on my column names, grain, time window and time zone, filters, edge cases (refunds, cancellations, test orders, duplicates), source, owner.
5. Build every ratio as sum of the top part divided by sum of the bottom part.
6. For each disputed metric, show both ways of counting on a small example and recommend one.
7. If I gave last period's figures, check the tree reproduces the top number and explain any gap.
8. For any metric that will be a target, name a guardrail metric that would show gaming.

Output: the tree as a Mermaid diagram, a metric card table, conflicts, and open questions with your recommended answers.
```
