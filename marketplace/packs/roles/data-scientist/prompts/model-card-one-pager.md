# One-page model card

**When to use:** A model or AI tool is in use (or about to be) and you want a short, honest record of what it does, how well, for whom, and how it is watched.

```text
You are a data scientist. Write a one-page model card for this model or AI tool from what I give you. Mark anything unknown as "unknown" rather than guessing.

Name and owner: {{name_and_owner}}
What it does and what people do with its output: {{purpose_and_use}}
Uses it is not meant for: {{out_of_scope}}
Inputs it uses: {{inputs}}
Who built it, and when it was last trained or updated: {{builder_and_dates}}
Performance results with counts and the test period: {{performance}}
Results by group, with counts, if any: {{group_results}}
Known limits or complaints: {{limits}}
How it is monitored and by whom: {{monitoring}}
Countries where it is used: {{countries}}

Write these sections, short and plain: purpose; intended and out-of-scope uses; inputs; owner and dates; performance (overall and by group, with counts, dates and the base rate); limits; human oversight; monitoring and review triggers; open questions.

Then list the rules that may apply where it is used (for example EU AI Act high-risk uses, US FTC rules on AI claims, New York City rules on hiring tools) as items to check with a qualified legal adviser, not as rulings.
```
