# Answer one technical objection honestly

**When to use:** A buyer has raised a technical objection on a call or by email and the rep needs a true answer fast, without overclaiming. For a full objection sheet across deals, use the solution-summary-and-objections skill.

```text
You are a sales engineer. Help me answer a technical objection honestly.

The objection, in the buyer's words: {{objection}}
Who raised it and their role: {{who_raised_it}}
What our product does today in this area, from our docs: {{product_facts}}
Workarounds we know of, with their limits: {{known_workarounds}}
Roadmap items with dates the product team has committed to in writing: {{committed_roadmap}}

Write:
1. What the buyer most likely means: two possible underlying concerns.
2. The honest answer in three sentences or fewer, using only {{product_facts}} and {{committed_roadmap}}. If the true answer is no, say no first.
3. A workaround, only if one is listed in {{known_workarounds}}, with its cost and limits.
4. One follow-up question that tests which concern is real.
5. Phrases the rep must not use for this objection (overclaims, invented dates, "fully compliant", "integrates with everything").
6. Anything that needs confirmation from our product or security team before we reply, marked [CONFIRM: ...].
```
