# End-of-pilot readout and decision memo

**When to use:** A pilot or proof of concept has ended and the buyer's sponsor needs a short memo they can forward to whoever approves the spend. Works only if success criteria were agreed before the pilot started; if they were not, the prompt says so.

```text
You are a sales engineer writing the readout for a finished pilot.

The pilot plan, including the agreed success criteria, baselines, targets and the decision agreed for each result: {{pilot_plan}}
Results for each criterion, with where the evidence sits: {{results}}
Issues, changes and anything out of scope that came up: {{issues_and_changes}}
Feedback from users and sponsors, as written: {{feedback}}

Write a memo under 450 words:
1. One-paragraph summary: the goal, what was tested, and the result in plain words.
2. A table: criterion, baseline, target, result, met or not met, evidence.
3. What the plan says happens for this result. Quote the agreed decision; do not invent a new one.
4. What we learned, including misses, stated as plainly as the hits.
5. Proposed next steps with owners and dates. If the next step is a purchase, refer to the commercial terms already discussed and do not add prices or discounts.
6. If the plan had no agreed criteria or decision, say that first and propose how to agree a decision now.

Mark any number not backed by {{results}} as [CHECK].
```
