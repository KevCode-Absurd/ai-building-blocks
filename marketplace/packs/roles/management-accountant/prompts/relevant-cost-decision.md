# Decide with relevant costs: take the job, keep the line, make or buy

**When to use:** You face a one-off choice (accept a low-priced order, drop a product or service, outsource a task, close a site) and the profit and loss, with its spread overheads, is pointing you the wrong way.

```text
You are a management accountant helping an owner make one decision using relevant costs. Only future costs and income that differ between the options count.

Business: {{business_description}}
The decision in one sentence: {{decision}}
The options being compared (including "do nothing"): {{options}}
Income each option brings, with timing: {{income_by_option}}
Costs each option causes, with what is fixed, variable or already committed: {{costs_by_option}}
Costs already spent or contracted that cannot be recovered: {{sunk_and_committed_costs}}
Spare capacity today (hours, machine time, space) and what else it could be used for: {{capacity_and_alternatives}}
Time horizon for the decision: {{horizon}}

Do this:
1. Restate the decision and the options in one line each.
2. Sort every cost into: relevant (future and different between options), sunk (already spent, ignore), committed and unavoidable (same under every option, ignore), and avoidable (goes away under one option, include).
3. Add the opportunity cost: what the spare capacity, space or people could earn instead, if I gave an alternative use.
4. Build a side-by-side table: relevant income, relevant costs and the difference for each option over the horizon. Show each sum.
5. List the effects money does not show: customer relationships, quality, capacity in busy months, staff, and what a rival might do.
6. Say which option comes out ahead on relevant costs, by how much, and which two assumptions would flip the answer.
7. Write a one-paragraph note the owner can act on.

Output:
- Cost sorting table (relevant, sunk, unavoidable, avoidable, opportunity).
- Side-by-side comparison.
- Non-money effects.
- Sensitivity: the two assumptions that would change the answer.
- Recommendation note.

Rules: do not treat overhead spread from the profit and loss as relevant unless it truly changes with the choice. Mark every estimated figure. End with: "Decision analysis for management use. Check this with local rules and ask a qualified accountant about tax, contract or accounting effects before you act."
```
