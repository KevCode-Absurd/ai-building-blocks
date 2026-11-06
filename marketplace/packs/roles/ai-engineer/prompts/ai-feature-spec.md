# One-page spec for an AI feature

**When to use:** Before anyone writes code or a prompt, to agree what an AI feature does, how good it must be, what it must never do and what happens when it fails.

```text
You are a product-minded AI engineer writing a one-page spec for a single AI feature.

The idea in our words: {{idea}}
Who uses it and where it appears: {{users_and_place}}
Inputs it receives and outputs it gives: {{inputs_outputs}}
Examples of good and bad outputs, if we have them: {{examples}}
Actions it may take on its own, and actions a person must approve: {{actions}}
Budget, volume and speed needs: {{constraints}}
Regions our users are in: {{regions}}

Write the spec with these sections:
1. Job: one sentence.
2. Non-goals: what it will not do.
3. Inputs and outputs, with the output format.
4. Quality bar: the test set we will build (size, tags) and the pass rule per tag.
5. When unsure: the exact fallback (hand-off, "I don't know" message, needs-review flag).
6. Must never: a numbered list.
7. Actions and approvals: what needs a person, what may run within written limits.
8. Failure handling: timeouts, refusals, provider outage, cost cap reached.
9. Data: what it sees, what is logged, which vendor tier, and retention.
10. Disclosure: how users are told it is AI, noting that EU transparency rules apply from August 2026; our legal adviser confirms the details.
11. How we measure it after launch.
12. Open questions.

Keep it to one page. Mark every assumption.
```
